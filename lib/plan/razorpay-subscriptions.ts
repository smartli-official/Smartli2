/**
 * Shared server-side helpers for Razorpay Subscriptions (recurring billing).
 *
 * Flow:
 *   1. POST /api/razorpay/subscription  → creates a `sub_*` subscription
 *      against one of the 4 pre-made Razorpay Plans (see
 *      scripts/create-razorpay-plans.mjs) and returns its id.
 *   2. Checkout.js opens with `subscription_id`; on success it returns
 *      { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }.
 *   3. POST /api/razorpay/verify-subscription verifies the signature
 *      HMAC-SHA256(`payment_id|subscription_id`, KEY_SECRET) — note the field
 *      order is the REVERSE of one-time order verification — then confirms
 *      the subscription is active before granting the plan.
 *   4. POST /api/webhooks/razorpay keeps the plan in sync over the
 *      subscription lifetime (renewals, cancellations, halts).
 *
 * Amounts are NEVER trusted from the client: the chargeable paise always
 * come from lib/plan/pricing.ts via expectedAmountPaise().
 */

import { expectedAmountPaise, isBillingPeriod, isPaidPlanId } from './pricing';

const API_BASE = 'https://api.razorpay.com';

/** Which .env var holds the Razorpay Plan id for a (tier, billing) combo. */
const PLAN_ENV_VARS: Record<string, Record<string, string>> = {
  scholar: {
    monthly: 'RAZORPAY_PLAN_SCHOLAR_MONTHLY',
    yearly: 'RAZORPAY_PLAN_SCHOLAR_YEARLY',
  },
  luminary: {
    monthly: 'RAZORPAY_PLAN_LUMINARY_MONTHLY',
    yearly: 'RAZORPAY_PLAN_LUMINARY_YEARLY',
  },
};

/**
 * Billing cycles before Razorpay auto-completes the subscription (~10 years).
 * Users cancel explicitly; this just stops "forever" subscriptions from
 * erroring on total_count limits.
 */
export const TOTAL_COUNT: Record<string, number> = {
  monthly: 120,
  yearly: 10,
};

/** Subscriptions that still entitle the user to the paid plan. */
export const ACTIVE_SUBSCRIPTION_STATUSES = ['created', 'authenticated', 'active'];

export interface SubscriptionPlanRef {
  planId: 'scholar' | 'luminary';
  billing: 'monthly' | 'yearly';
  amountPaise: number;
  razorpayPlanId: string;
  totalCount: number;
}

/** Validate tier/billing and resolve the configured Razorpay Plan id. */
export function resolveSubscriptionPlan(
  planId: unknown,
  billing: unknown,
): SubscriptionPlanRef | { error: string } {
  if (!isPaidPlanId(planId) || !isBillingPeriod(billing)) {
    return {
      error:
        'Unknown plan or billing. Subscriptions exist for "scholar" and "luminary" with "monthly" or "yearly" billing.',
    };
  }
  const amountPaise = expectedAmountPaise(planId, billing);
  const envVar = PLAN_ENV_VARS[planId]?.[billing];
  const razorpayPlanId = (envVar && process.env[envVar]?.trim()) || '';
  if (amountPaise === null || !razorpayPlanId) {
    return {
      error:
        'Subscription billing is not configured yet (missing Razorpay Plan id). ' +
        'Run `node scripts/create-razorpay-plans.mjs` and add the IDs to .env.local.',
    };
  }
  return { planId, billing, amountPaise, razorpayPlanId, totalCount: TOTAL_COUNT[billing] ?? 120 };
}

function basicAuth(): string {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) {
    throw new Error('Razorpay credentials are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).');
  }
  return `Basic ${Buffer.from(`${keyId}:${secret}`).toString('base64')}`;
}

export interface RazorpaySubscription {
  id: string;
  status?: string;
  plan_id?: string;
  customer_id?: string | null;
  quantity?: number;
  total_count?: number;
  paid_count?: number;
  charge_at?: number | null;
  start_at?: number | null;
  end_at?: number | null;
  has_scheduled_changes?: boolean;
  short_url?: string | null;
  notes?: Record<string, unknown>;
}

export interface RazorpayPlan {
  id: string;
  period?: string;
  interval?: number;
  item?: { name?: string; amount?: number | string; currency?: string };
}

/** Minimal typed wrapper around the Razorpay REST API (Basic auth). */
export async function razorpayApi<T>(
  method: 'GET' | 'POST' | 'PATCH',
  endpoint: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: { Authorization: basicAuth(), 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json().catch(() => null)) as {
    error?: { code?: string; description?: string };
  } | null;
  if (!res.ok) {
    const detail = json?.error?.description ?? res.statusText;
    const code = json?.error?.code ? ` (${json.error.code})` : '';
    throw new Error(`Razorpay ${method} ${endpoint} failed: ${detail}${code}`);
  }
  return json as T;
}

export interface ResolvedPlanRef {
  planId: 'scholar' | 'luminary';
  billing: 'monthly' | 'yearly';
  amountPaise: number;
}

/**
 * Reverse lookup: Razorpay Plan id (`plan_*`) → our (tier, billing, amount).
 * Used to resolve the authoritative plan from a live subscription object
 * instead of trusting client-sent planId/billing.
 */
export function planRefFromRazorpayPlanId(razorpayPlanId: unknown): ResolvedPlanRef | null {
  if (typeof razorpayPlanId !== 'string' || !razorpayPlanId) return null;
  for (const [planId, billings] of Object.entries(PLAN_ENV_VARS)) {
    for (const [billing, envVar] of Object.entries(billings)) {
      if (process.env[envVar]?.trim() === razorpayPlanId) {
        const amountPaise = expectedAmountPaise(planId, billing);
        if (amountPaise === null) return null;
        return {
          planId: planId as ResolvedPlanRef['planId'],
          billing: billing as ResolvedPlanRef['billing'],
          amountPaise,
        };
      }
    }
  }
  return null;
}
