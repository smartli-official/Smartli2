/**
 * Canonical INR price table for paid upgrades.
 *
 * Single source of truth — BOTH /api/razorpay/order and /api/razorpay/verify
 * import from here so the amount charged and the amount verified can never
 * drift apart. Values are in paise (Razorpay's smallest unit).
 */
export const PLAN_PRICES_INR_PAISA: Record<string, { monthly: number; yearly: number }> = {
  scholar: { monthly: 11000, yearly: 118800 },
  luminary: { monthly: 139900, yearly: 1399900 },
};

export type BillingPeriod = 'monthly' | 'yearly';

export function isPaidPlanId(planId: unknown): planId is 'scholar' | 'luminary' {
  return planId === 'scholar' || planId === 'luminary';
}

export function isBillingPeriod(billing: unknown): billing is BillingPeriod {
  return billing === 'monthly' || billing === 'yearly';
}

/** Expected charge in paise, or null when plan/billing is invalid. */
export function expectedAmountPaise(planId: unknown, billing: unknown): number | null {
  if (!isPaidPlanId(planId) || !isBillingPeriod(billing)) return null;
  return PLAN_PRICES_INR_PAISA[planId]![billing];
}
