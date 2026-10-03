import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { expectedAmountPaise } from '@/lib/plan/pricing';
import { activatePaidPlan, setUserPlan } from '@/lib/plan/usage-server';
import {
  planRefFromRazorpayPlanId,
  razorpayApi,
  type RazorpayPlan,
  type RazorpaySubscription,
} from '@/lib/plan/razorpay-subscriptions';

/**
 * POST /api/razorpay/verify-subscription
 *
 * Authoritative confirmation of a subscription's FIRST payment (the
 * Checkout.js mandate authorisation). Only this route (server-side, with the
 * key secret) can activate a paid plan:
 *
 *  1. Requires a logged-in user.
 *  2. Validates planId/billing and derives the expected INR amount server-side.
 *  3. Verifies the HMAC-SHA256 signature over
 *     `razorpay_payment_id|razorpay_subscription_id` (NOTE: payment id FIRST —
 *     the reverse of one-time order verification) so the payload provably
 *     came from Razorpay Checkout.
 *  4. Fetches the subscription from Razorpay's API and confirms it is
 *     `active`/`authenticated`, bound to the caller's user id, and billing
 *     the exact expected amount via its Plan.
 *  5. Records the subscription (idempotency — replays can never double-grant
 *     or double-reset) and activates the plan with AI usage limits reset.
 *
 * Renewals after this are handled by POST /api/webhooks/razorpay
 * (`subscription.charged`).
 *
 * Body: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planId, billing }
 */

function pickView(view: {
  planId: string;
  plan: unknown;
  limits: unknown;
  used: unknown;
  remaining: unknown;
  pct: unknown;
  exhausted: unknown;
  nextResetLabel: string;
}) {
  return {
    planId: view.planId,
    plan: view.plan,
    limits: view.limits,
    used: view.used,
    remaining: view.remaining,
    pct: view.pct,
    exhausted: view.exhausted,
    nextResetLabel: view.nextResetLabel,
  };
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'You have to be logged in to complete a subscription.' },
      { status: 401 },
    );
  }

  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planId, billing } =
      (await request.json()) as {
        razorpay_payment_id?: string;
        razorpay_subscription_id?: string;
        razorpay_signature?: string;
        planId?: string;
        billing?: string;
      };

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing subscription payment details.' },
        { status: 400 },
      );
    }

    const expectedAmount = expectedAmountPaise(planId, billing);
    if (expectedAmount === null) {
      return NextResponse.json(
        { success: false, error: 'Unknown plan or billing.' },
        { status: 400 },
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not configured.');
      return NextResponse.json(
        { success: false, error: 'Subscription verification is not configured.' },
        { status: 500 },
      );
    }

    // Step 1 — signature must match before we trust anything else.
    // Subscription verify order: payment_id FIRST, then subscription_id.
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expected, 'utf8');
    const receivedBuf = Buffer.from(razorpay_signature, 'utf8');
    const isValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Subscription signature mismatch. The subscription was not accepted.' },
        { status: 400 },
      );
    }

    // Step 2 — confirm against Razorpay's servers that the subscription is
    // real, active, ours, and billing the right amount.
    let subscription: RazorpaySubscription;
    try {
      subscription = await razorpayApi<RazorpaySubscription>(
        'GET',
        `/v1/subscriptions/${razorpay_subscription_id}`,
      );
    } catch (err) {
      console.error('Razorpay subscription fetch failed:', err);
      return NextResponse.json(
        { success: false, error: 'Could not confirm the subscription with Razorpay. No plan was changed.' },
        { status: 502 },
      );
    }

    if (!['active', 'authenticated'].includes(subscription.status ?? '')) {
      return NextResponse.json(
        {
          success: false,
          error: `Subscription is not active (status: ${subscription.status ?? 'unknown'}). No plan was changed.`,
        },
        { status: 400 },
      );
    }

    const notesUserId = subscription.notes?.userId;
    if (typeof notesUserId === 'string' && notesUserId !== userId) {
      return NextResponse.json(
        { success: false, error: 'This subscription belongs to a different account.' },
        { status: 403 },
      );
    }

    try {
      const plan = await razorpayApi<RazorpayPlan>('GET', `/v1/plans/${subscription.plan_id}`);
      if (
        (plan.item?.currency ?? 'INR').toUpperCase() !== 'INR' ||
        Number(plan.item?.amount) !== expectedAmount
      ) {
        return NextResponse.json(
          { success: false, error: 'Subscription amount does not match the plan price. No plan was changed.' },
          { status: 400 },
        );
      }
    } catch (err) {
      console.error('Razorpay plan fetch failed:', err);
      return NextResponse.json(
        { success: false, error: 'Could not confirm the subscription price. No plan was changed.' },
        { status: 502 },
      );
    }

    // Step 3 — the authoritative tier comes from the live subscription's
    // Plan id, NOT the client-sent planId/billing. This is what makes
    // mid-cycle upgrades finalise on the correct tier even if the client
    // payload is stale or tampered with.
    const authoritative = planRefFromRazorpayPlanId(subscription.plan_id) ?? {
      planId: planId as string,
      billing: billing as string,
      amountPaise: expectedAmount,
    };

    const syncRowToAuthoritative = async () => {
      await supabaseAdmin
        .from('razorpay_subscriptions')
        .update({
          plan_id: authoritative.planId,
          billing: authoritative.billing,
          razorpay_plan_id: subscription.plan_id,
          status: subscription.status ?? 'active',
          amount: authoritative.amountPaise,
          last_payment_id: razorpay_payment_id,
          cancel_at_cycle_end: false,
          pending_plan_id: null,
          pending_billing: null,
          pending_amount: null,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', razorpay_subscription_id);
    };

    // Idempotency: a subscription can only ever grant once. Replays
    // return success WITHOUT resetting usage a second time.
    const { data: existing } = await supabaseAdmin
      .from('razorpay_subscriptions')
      .select('subscription_id, user_id, plan_id')
      .eq('subscription_id', razorpay_subscription_id)
      .single();

    if (existing) {
      if ((existing as { user_id: string }).user_id !== userId) {
        return NextResponse.json(
          { success: false, error: 'This subscription was already used by a different account.' },
          { status: 403 },
        );
      }
      await syncRowToAuthoritative();
      const { view } = await setUserPlan(userId, authoritative.planId);
      return NextResponse.json({
        ...pickView(view),
        success: true,
        alreadyProcessed: true,
        message: 'Subscription was already processed. Plan is active.',
        subscriptionId: razorpay_subscription_id,
        billing: authoritative.billing,
      });
    }

    const { error: recordError } = await supabaseAdmin.from('razorpay_subscriptions').insert({
      subscription_id: razorpay_subscription_id,
      user_id: userId,
      plan_id: authoritative.planId,
      billing: authoritative.billing,
      razorpay_plan_id: subscription.plan_id,
      status: subscription.status ?? 'active',
      amount: authoritative.amountPaise,
      currency: 'INR',
      total_count: subscription.total_count ?? 0,
      last_payment_id: razorpay_payment_id,
    });
    if (recordError) {
      if ((recordError as { code?: string }).code === '23505') {
        const { view } = await setUserPlan(userId, planId as string);
        return NextResponse.json({
          ...pickView(view),
          success: true,
          alreadyProcessed: true,
          message: 'Subscription was already processed. Plan is active.',
          subscriptionId: razorpay_subscription_id,
          billing,
        });
      }
      console.error('Failed to record Razorpay subscription:', recordError);
      return NextResponse.json(
        { success: false, error: 'Subscription went through but could not be recorded. Please contact support — do not subscribe again.' },
        { status: 500 },
      );
    }

    // Step 4 — the mandate is live: upgrade the plan AND reset AI usage.
    const { view } = await activatePaidPlan(userId, authoritative.planId);

    return NextResponse.json({
      ...pickView(view),
      success: true,
      message: `Subscription active. Welcome to ${authoritative.planId} — usage limits reset. Renews automatically until cancelled.`,
      subscriptionId: razorpay_subscription_id,
      billing: authoritative.billing,
    });
  } catch (error) {
    console.error('Razorpay subscription verification failed:', error);
    return NextResponse.json(
      { success: false, error: 'Subscription verification failed. Please contact support.' },
      { status: 500 },
    );
  }
}
