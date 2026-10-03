import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { activatePaidPlan, setUserPlan } from '@/lib/plan/usage-server';
import {
  planRefFromRazorpayPlanId,
  razorpayApi,
  type RazorpaySubscription,
} from '@/lib/plan/razorpay-subscriptions';

/**
 * POST /api/webhooks/razorpay — Razorpay subscription lifecycle events.
 *
 * Public (no Clerk session — Razorpay calls us). Authenticity comes from the
 * `x-razorpay-signature` header: HMAC-SHA256 of the RAW request body with
 * RAZORPAY_WEBHOOK_SECRET. Requests with a bad signature are rejected with
 * 400 and change nothing.
 *
 * Handled events:
 *   subscription.authenticated → mandate authorised; ensure the plan is on
 *     (counters untouched — the first cycle reset happens in verify).
 *   subscription.charged      → money moved for a cycle; plan on + usage
 *     counters reset for the fresh cycle.
 *   subscription.cancelled | subscription.completed | subscription.expired
 *     → billing over; downgrade to Spark, counters kept.
 *   subscription.halted | subscription.paused → billing interrupted;
 *     downgrade to Spark (a later `charged`/`resumed` re-grants).
 *   subscription.resumed      → billing back; plan back on.
 *   payment.failed            → logged for support; plan untouched.
 *
 * Everything else → 200 ignored. Always 200 on authentic events (even when
 * the user can't be resolved) so Razorpay doesn't retry-storm us.
 *
 * Setup (manual): Dashboard (TEST mode while testing) → Settings → Webhooks →
 * Add webhook for https://<public-url>/api/webhooks/razorpay, subscribe to
 * the subscription.* events, paste the generated secret into
 * RAZORPAY_WEBHOOK_SECRET. Local dev needs a tunnel (e.g. ngrok) since
 * Razorpay can't reach localhost.
 */

interface WebhookSubscriptionEntity {
  id: string;
  status?: string;
  plan_id?: string;
  total_count?: number;
  has_scheduled_changes?: boolean;
  notes?: Record<string, unknown>;
}

interface RazorpayWebhookEvent {
  event: string;
  payload?: {
    subscription?: { entity?: WebhookSubscriptionEntity };
    payment?: { entity?: { id?: string; subscription_id?: string } };
  };
}

async function resolveUserId(
  entity: WebhookSubscriptionEntity | undefined,
): Promise<{ userId: string | null; subscription: WebhookSubscriptionEntity | null }> {
  if (!entity?.id) return { userId: null, subscription: null };
  const noted = entity.notes?.userId;
  if (typeof noted === 'string' && noted) return { userId: noted, subscription: entity };
  // Fallback: notes can be absent on some events — ask Razorpay.
  try {
    const fresh = await razorpayApi<RazorpaySubscription>('GET', `/v1/subscriptions/${entity.id}`);
    const fallback = fresh.notes?.userId;
    return {
      userId: typeof fallback === 'string' && fallback ? fallback : null,
      subscription: { ...entity, status: fresh.status ?? entity.status, plan_id: fresh.plan_id ?? entity.plan_id },
    };
  } catch (err) {
    console.warn('Razorpay webhook: subscription refetch failed:', err);
    return { userId: null, subscription: entity };
  }
}

async function markSubscription(
  subscriptionId: string,
  patch: Record<string, string | boolean | null>,
) {
  await supabaseAdmin
    .from('razorpay_subscriptions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('subscription_id', subscriptionId);
}

async function planOf(subscriptionId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('razorpay_subscriptions')
    .select('plan_id')
    .eq('subscription_id', subscriptionId)
    .single();
  return (data as { plan_id?: string } | null)?.plan_id ?? null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured — ignoring webhook.');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(signature, 'utf8');
  const authentic =
    expectedBuf.length === receivedBuf.length && crypto.timingSafeEqual(expectedBuf, receivedBuf);
  if (!authentic) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload.' }, { status: 400 });
  }

  try {
    switch (event.event) {
      case 'subscription.authenticated': {
        const entity = event.payload?.subscription?.entity;
        const { userId, subscription } = await resolveUserId(entity);
        if (!userId || !subscription) break;
        await markSubscription(subscription.id, { status: subscription.status ?? 'authenticated' });
        const planId = (subscription.notes?.planId as string | undefined) ?? (await planOf(subscription.id));
        if (planId === 'scholar' || planId === 'luminary') {
          await setUserPlan(userId, planId);
        }
        break;
      }
      case 'subscription.charged': {
        const entity = event.payload?.subscription?.entity;
        const paymentId = event.payload?.payment?.entity?.id ?? null;
        const { userId, subscription } = await resolveUserId(entity);
        if (!userId || !subscription) break;
        // Authoritative tier: the live Plan id first (a scheduled downgrade
        // takes effect on exactly this charge), then notes, then our row.
        const fromPlan = planRefFromRazorpayPlanId(subscription.plan_id);
        let planId: string | null = fromPlan?.planId ?? null;
        let billing: string | null = fromPlan?.billing ?? null;
        if (!planId) {
          const noted = subscription.notes?.planId;
          if (noted === 'scholar' || noted === 'luminary') {
            planId = noted;
            billing =
              typeof subscription.notes?.billing === 'string' ? subscription.notes.billing : null;
          } else {
            planId = await planOf(subscription.id);
          }
        }
        if (planId !== 'scholar' && planId !== 'luminary') break;
        const patch: Record<string, string | boolean | null> = {
          status: 'active',
          plan_id: planId,
          last_payment_id: paymentId,
          cancel_at_cycle_end: false,
          // Whatever was scheduled has now applied with this charge.
          pending_plan_id: null,
          pending_billing: null,
          pending_amount: null,
        };
        if (billing) patch.billing = billing;
        await markSubscription(subscription.id, patch);
        // Fresh paid cycle → plan on + usage reset.
        await activatePaidPlan(userId, planId);
        break;
      }
      case 'subscription.updated': {
        // Fires for PATCH changes (plan switches, etc.). Sync status; when
        // Razorpay reports no scheduled changes left, any pending downgrade
        // was applied or withdrawn — clear it so it can't go stale.
        const entity = event.payload?.subscription?.entity;
        const { userId, subscription } = await resolveUserId(entity);
        if (!userId || !subscription) break;
        const syncPatch: Record<string, string | boolean | null> = {
          status: subscription.status ?? 'active',
        };
        if (subscription.has_scheduled_changes === false) {
          syncPatch.pending_plan_id = null;
          syncPatch.pending_billing = null;
          syncPatch.pending_amount = null;
        }
        await markSubscription(subscription.id, syncPatch);
        break;
      }
      case 'subscription.resumed': {
        const entity = event.payload?.subscription?.entity;
        const { userId, subscription } = await resolveUserId(entity);
        if (!userId || !subscription) break;
        await markSubscription(subscription.id, { status: subscription.status ?? 'active' });
        const planId = (subscription.notes?.planId as string | undefined) ?? (await planOf(subscription.id));
        if (planId === 'scholar' || planId === 'luminary') {
          await setUserPlan(userId, planId);
        }
        break;
      }
      case 'subscription.cancelled':
      case 'subscription.completed':
      case 'subscription.expired':
      case 'subscription.halted':
      case 'subscription.paused': {
        const entity = event.payload?.subscription?.entity;
        const { userId, subscription } = await resolveUserId(entity);
        if (!userId || !subscription) break;
        const patch: Record<string, string | boolean | null> = {
          status: subscription.status ?? event.event.replace('subscription.', ''),
        };
        if (event.event === 'subscription.cancelled') {
          patch.cancelled_at = new Date().toISOString();
        }
        await markSubscription(subscription.id, patch);
        // Billing over or interrupted → back to free Spark, counters kept.
        await setUserPlan(userId, 'spark');
        break;
      }
      case 'payment.failed': {
        const payment = event.payload?.payment?.entity;
        console.warn('Razorpay subscription payment failed:', {
          paymentId: payment?.id,
          subscriptionId: payment?.subscription_id,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    // Authentic event but our handling failed — log loudly, still 200 so
    // Razorpay doesn't hammer us; the next event (or manual check) reconciles.
    console.error(`Razorpay webhook ${event.event} handling failed:`, err);
  }

  return NextResponse.json({ received: true });
}
