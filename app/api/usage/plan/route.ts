import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { setUserPlan } from '@/lib/plan/usage-server';
import { normalizePlanId } from '@/lib/plan/limits';
import { supabaseAdmin } from '@/lib/supabase';
import { ACTIVE_SUBSCRIPTION_STATUSES } from '@/lib/plan/razorpay-subscriptions';

/**
 * POST /api/usage/plan — free plan switches only (Spark downgrade).
 *
 * Paid upgrades (scholar/luminary) are deliberately REJECTED here: they must
 * go through POST /api/razorpay/verify-subscription, which confirms with
 * Razorpay's API that the subscription mandate is active before activating
 * the plan and resetting usage.
 * Letting this endpoint set paid plans directly would allow anyone to grant
 * themselves a subscription without paying.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to change plans.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  try {
    const body = (await req.json().catch(() => null)) as { planId?: unknown } | null;
    const planId = normalizePlanId(body?.planId);
    if (planId === 'scholar' || planId === 'luminary') {
      return NextResponse.json(
        {
          error: 'Paid plans require a verified Razorpay payment. Complete checkout first.',
          limitKind: 'payment_required',
        },
        { status: 402 },
      );
    }
    // A live subscription owns the plan: moving to Spark must go through
    // subscription cancel (DELETE /api/razorpay/subscription), otherwise
    // Razorpay keeps billing while the account enjoys the free tier.
    // (The downgrade webhook calls setUserPlan directly, so it is unaffected.)
    const { data: activeSub } = await supabaseAdmin
      .from('razorpay_subscriptions')
      .select('subscription_id')
      .eq('user_id', userId)
      .in('status', ACTIVE_SUBSCRIPTION_STATUSES)
      .limit(1);
    if (activeSub && activeSub.length > 0) {
      return NextResponse.json(
        {
          error: 'You have an active subscription. Cancel it on the Plan page first — access stays until the period ends.',
          limitKind: 'subscription_active',
        },
        { status: 409 },
      );
    }
    const { view } = await setUserPlan(userId, planId);
    return NextResponse.json({
      success: true,
      planId: view.planId,
      plan: view.plan,
      limits: view.limits,
      used: view.used,
      remaining: view.remaining,
      pct: view.pct,
      exhausted: view.exhausted,
      nextResetLabel: view.nextResetLabel,
    });
  } catch (err: unknown) {
    console.error('POST /api/usage/plan failed:', err);
    return NextResponse.json({ error: 'Failed to update plan.' }, { status: 500 });
  }
}
