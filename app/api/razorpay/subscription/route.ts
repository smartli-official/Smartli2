import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { activatePaidPlan } from '@/lib/plan/usage-server';
import {
  ACTIVE_SUBSCRIPTION_STATUSES,
  planRefFromRazorpayPlanId,
  razorpayApi,
  resolveSubscriptionPlan,
  type RazorpaySubscription,
} from '@/lib/plan/razorpay-subscriptions';

/**
 * /api/razorpay/subscription — recurring-billing lifecycle.
 *
 * POST — create or SWITCH a subscription. The chargeable Plan is resolved
 *   SERVER-SIDE; the client only sends planId + billing, never an amount.
 *   Body: { planId: 'scholar' | 'luminary', billing: 'monthly' | 'yearly' }
 *
 *   No existing subscription → create `sub_*`, return it for Checkout.
 *   Existing `created` (checkout abandoned, nothing billed) → same plan:
 *     resume it; different plan: cancel it immediately + create fresh.
 *   Existing `authenticated`/`active` → in-place plan change via
 *     PATCH /v1/subscriptions/:id (same subscription id, no double billing):
 *     - UPGRADE (higher amount, incl. any active sub previously set to
 *       cancel): `schedule_change_at: 'now'` — effective immediately.
 *       Status `active` afterwards → done, plan activated here. Any other
 *       status → customer must authorise the new amount: returns the
 *       subscription id for Checkout, then verify-subscription finishes it.
 *     - DOWNGRADE (lower amount): `schedule_change_at: 'cycle_end'` —
 *       current plan runs till period end, then the pending plan applies
 *       (see the `subscription.charged` webhook). No proration/refund
 *       math on our side — Razorpay owns the billing timeline.
 *
 * GET — the caller's latest subscription (for the plan page's
 *   renew/switch/cancel UI), including any scheduled downgrade.
 *   200 with { subscription: null } when there is none.
 *
 * DELETE — cancel at the end of the current billing cycle (fair: the user
 *   keeps access until the period they paid for ends; the
 *   `subscription.cancelled` webhook then downgrades them). Also drops any
 *   scheduled plan change. No immediate prorations or refunds.
 */

interface SubscriptionRow {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  billing: string;
  razorpay_plan_id: string;
  status: string;
  amount: number;
  currency: string;
  total_count: number;
  last_payment_id: string | null;
  cancel_at_cycle_end: boolean;
  pending_plan_id: string | null;
  pending_billing: string | null;
  pending_amount: number | null;
}

const PUBLIC_KEY_ID = () =>
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;

async function latestEntitlingRow(userId: string): Promise<SubscriptionRow | null> {
  const { data } = await supabaseAdmin
    .from('razorpay_subscriptions')
    .select(
      'subscription_id, user_id, plan_id, billing, razorpay_plan_id, status, amount, currency, total_count, last_payment_id, cancel_at_cycle_end, pending_plan_id, pending_billing, pending_amount',
    )
    .eq('user_id', userId)
    .in('status', ACTIVE_SUBSCRIPTION_STATUSES)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return (data as SubscriptionRow | null) ?? null;
}

async function createSubscription(
  userId: string,
  ref: Exclude<ReturnType<typeof resolveSubscriptionPlan>, { error: string }>,
) {
  const subscription = await razorpayApi<RazorpaySubscription>('POST', '/v1/subscriptions', {
    plan_id: ref.razorpayPlanId,
    customer_notify: 1,
    quantity: 1,
    total_count: ref.totalCount,
    notes: { planId: ref.planId, billing: ref.billing, userId },
  });

  await supabaseAdmin.from('razorpay_subscriptions').upsert(
    {
      subscription_id: subscription.id,
      user_id: userId,
      plan_id: ref.planId,
      billing: ref.billing,
      razorpay_plan_id: ref.razorpayPlanId,
      status: subscription.status ?? 'created',
      amount: ref.amountPaise,
      currency: 'INR',
      total_count: ref.totalCount,
      cancel_at_cycle_end: false,
      pending_plan_id: null,
      pending_billing: null,
      pending_amount: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'subscription_id' },
  );

  return subscription;
}

function checkoutPayload(
  subscriptionId: string,
  ref: { planId: string; billing: string; amountPaise: number },
) {
  return {
    success: true,
    requiresCheckout: true as const,
    subscriptionId,
    amount: ref.amountPaise,
    currency: 'INR',
    keyId: PUBLIC_KEY_ID(),
    planId: ref.planId,
    billing: ref.billing,
  };
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'You have to be logged in to subscribe.' },
      { status: 401 },
    );
  }

  try {
    const { planId, billing } = (await request.json().catch(() => ({}))) as {
      planId?: string;
      billing?: string;
    };

    const ref = resolveSubscriptionPlan(planId, billing);
    if ('error' in ref) {
      const status = ref.error.startsWith('Unknown plan') ? 400 : 500;
      return NextResponse.json({ success: false, error: ref.error }, { status });
    }

    const existing = await latestEntitlingRow(userId);
    if (!existing) {
      const subscription = await createSubscription(userId, ref);
      return NextResponse.json(checkoutPayload(subscription.id, ref));
    }

    // Reconcile with Razorpay truth (status may have moved via dashboard).
    let live: RazorpaySubscription;
    try {
      live = await razorpayApi<RazorpaySubscription>('GET', `/v1/subscriptions/${existing.subscription_id}`);
    } catch (err) {
      console.error('Razorpay subscription fetch failed:', err);
      return NextResponse.json(
        { success: false, error: 'Could not reach Razorpay. Please try again.' },
        { status: 502 },
      );
    }
    if (!ACTIVE_SUBSCRIPTION_STATUSES.includes(live.status ?? '')) {
      await supabaseAdmin
        .from('razorpay_subscriptions')
        .update({ status: live.status ?? existing.status, updated_at: new Date().toISOString() })
        .eq('subscription_id', existing.subscription_id);
      const subscription = await createSubscription(userId, ref);
      return NextResponse.json(checkoutPayload(subscription.id, ref));
    }

    // Same plan + billing and still entitling → nothing to do.
    if (existing.plan_id === ref.planId && existing.billing === ref.billing && !existing.cancel_at_cycle_end) {
      if (live.status === 'created') {
        return NextResponse.json(checkoutPayload(existing.subscription_id, ref));
      }
      return NextResponse.json(
        { success: false, error: `You are already subscribed to ${ref.planId} (${ref.billing}).` },
        { status: 409 },
      );
    }

    // Abandoned checkout (`created`, nothing ever billed): safe to replace.
    // Previously-scheduled-to-cancel: it was already on the way out, so an
    // immediate switch just cuts the remainder short instead of overlapping.
    if (live.status === 'created' || existing.cancel_at_cycle_end) {
      try {
        await razorpayApi('POST', `/v1/subscriptions/${existing.subscription_id}/cancel`, {
          cancel_at_cycle_end: 0,
        });
      } catch (err) {
        console.warn('Razorpay immediate cancel during switch failed:', err);
      }
      await supabaseAdmin
        .from('razorpay_subscriptions')
        .update({
          status: 'cancelled',
          cancel_at_cycle_end: false,
          cancelled_at: new Date().toISOString(),
          pending_plan_id: null,
          pending_billing: null,
          pending_amount: null,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', existing.subscription_id);
      const subscription = await createSubscription(userId, ref);
      return NextResponse.json(checkoutPayload(subscription.id, ref));
    }

    // In-place plan change on the live subscription (same id, no overlap).
    if (live.has_scheduled_changes) {
      try {
        await razorpayApi('POST', `/v1/subscriptions/${existing.subscription_id}/cancel_scheduled_changes`);
      } catch (err) {
        console.warn('Razorpay cancel_scheduled_changes failed:', err);
      }
    }

    const isUpgrade = ref.amountPaise > existing.amount;
    const schedule_change_at = isUpgrade ? 'now' : 'cycle_end';

    let updated: RazorpaySubscription;
    try {
      updated = await razorpayApi<RazorpaySubscription>(
        'PATCH',
        `/v1/subscriptions/${existing.subscription_id}`,
        {
          plan_id: ref.razorpayPlanId,
          schedule_change_at,
          customer_notify: true,
          notes: { planId: ref.planId, billing: ref.billing, userId },
        },
      );
    } catch (err) {
      console.error('Razorpay subscription update failed:', err);
      return NextResponse.json(
        { success: false, error: 'Could not switch plans with Razorpay. Please try again or contact support.' },
        { status: 502 },
      );
    }

    if (isUpgrade) {
      if (updated.status === 'active') {
        // New amount took effect without extra authorisation.
        await supabaseAdmin
          .from('razorpay_subscriptions')
          .update({
            plan_id: ref.planId,
            billing: ref.billing,
            razorpay_plan_id: ref.razorpayPlanId,
            status: 'active',
            amount: ref.amountPaise,
            cancel_at_cycle_end: false,
            pending_plan_id: null,
            pending_billing: null,
            pending_amount: null,
            updated_at: new Date().toISOString(),
          })
          .eq('subscription_id', existing.subscription_id);
        const { view } = await activatePaidPlan(userId, ref.planId);
        return NextResponse.json({
          success: true,
          switched: true,
          immediate: true,
          subscriptionId: existing.subscription_id,
          planId: view.planId,
          billing: ref.billing,
          message: `Upgraded to ${ref.planId} effective immediately.`,
        });
      }
      // New amount needs the customer's authorisation → Checkout on the same
      // subscription id; verify-subscription finalises afterwards.
      await supabaseAdmin
        .from('razorpay_subscriptions')
        .update({
          plan_id: ref.planId,
          billing: ref.billing,
          razorpay_plan_id: ref.razorpayPlanId,
          status: updated.status ?? existing.status,
          amount: ref.amountPaise,
          cancel_at_cycle_end: false,
          pending_plan_id: null,
          pending_billing: null,
          pending_amount: null,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', existing.subscription_id);
      return NextResponse.json({
        ...checkoutPayload(existing.subscription_id, ref),
        message: 'Authorise the new amount to complete the upgrade.',
      });
    }

    // Downgrade (or cheaper lateral move): queued at Razorpay, applies next
    // cycle. Recorded as pending; the `subscription.charged` webhook flips it.
    await supabaseAdmin
      .from('razorpay_subscriptions')
      .update({
        pending_plan_id: ref.planId,
        pending_billing: ref.billing,
        pending_amount: ref.amountPaise,
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', existing.subscription_id);
    return NextResponse.json({
      success: true,
      switched: true,
      scheduled: true,
      subscriptionId: existing.subscription_id,
      planId: existing.plan_id,
      pendingPlanId: ref.planId,
      pendingBilling: ref.billing,
      message: `Downgrade to ${ref.planId} scheduled — your current plan stays active until the end of this billing period.`,
    });
  } catch (error) {
    console.error('Razorpay subscription creation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start the subscription. Please try again.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: true, subscription: null });
  }
  const row = await latestEntitlingRow(userId);
  if (!row) return NextResponse.json({ success: true, subscription: null });
  // Authoritative plan comes from Razorpay's Plan id, not our cached copy.
  const resolved = planRefFromRazorpayPlanId(row.razorpay_plan_id);
  return NextResponse.json({
    success: true,
    subscription: {
      id: row.subscription_id,
      planId: resolved?.planId ?? row.plan_id,
      billing: resolved?.billing ?? row.billing,
      status: row.status,
      cancelAtCycleEnd: row.cancel_at_cycle_end,
      entitling: ACTIVE_SUBSCRIPTION_STATUSES.includes(row.status) && !row.cancel_at_cycle_end,
      pending:
        row.pending_plan_id && row.pending_billing
          ? { planId: row.pending_plan_id, billing: row.pending_billing }
          : null,
    },
  });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'You have to be logged in to cancel.' },
      { status: 401 },
    );
  }

  try {
    const { subscriptionId } = (await request.json().catch(() => ({}))) as {
      subscriptionId?: string;
    };

    let targetId = subscriptionId?.trim();
    if (!targetId) {
      const row = await latestEntitlingRow(userId);
      targetId = row?.subscription_id;
    }
    if (!targetId) {
      return NextResponse.json(
        { success: false, error: 'No active subscription to cancel.' },
        { status: 404 },
      );
    }

    // Ownership check: the subscription must belong to the caller.
    const { data: owned } = await supabaseAdmin
      .from('razorpay_subscriptions')
      .select('subscription_id')
      .eq('subscription_id', targetId)
      .eq('user_id', userId)
      .single();
    if (!owned) {
      return NextResponse.json(
        { success: false, error: 'This subscription belongs to a different account.' },
        { status: 403 },
      );
    }

    // Drop any scheduled plan change first so cancel is unambiguous.
    try {
      await razorpayApi('POST', `/v1/subscriptions/${targetId}/cancel_scheduled_changes`);
    } catch {
      /* none scheduled — ignore */
    }

    await razorpayApi<RazorpaySubscription>('POST', `/v1/subscriptions/${targetId}/cancel`, {
      cancel_at_cycle_end: 1,
    });

    await supabaseAdmin
      .from('razorpay_subscriptions')
      .update({
        cancel_at_cycle_end: true,
        pending_plan_id: null,
        pending_billing: null,
        pending_amount: null,
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', targetId);

    return NextResponse.json({
      success: true,
      message: 'Subscription will cancel at the end of the current billing period. Access stays active until then.',
      subscriptionId: targetId,
    });
  } catch (error) {
    console.error('Razorpay subscription cancel failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel the subscription. Please try again or contact support.' },
      { status: 500 },
    );
  }
}
