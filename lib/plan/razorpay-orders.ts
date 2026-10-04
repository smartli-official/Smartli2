/**
 * Shared server-side helpers for Razorpay Standard Checkout (one-time orders).
 *
 * This sits ALONGSIDE the existing subscription flow:
 *   - subscriptions → lib/plan/razorpay-subscriptions.ts (`sub_*`, plans)
 *   - one-time      → this file (`order_*`, no plans needed)
 *
 * Flow:
 *   1. POST /api/create-order (alias: /api/razorpay/order) → creates an
 *      `order_*` via POST https://api.razorpay.com/v1/orders and returns
 *      { order_id, amount, currency } + publishable keyId for Checkout.js.
 *   2. Checkout.js collects payment, returns
 *      { razorpay_payment_id, razorpay_order_id, razorpay_signature }.
 *   3. POST /api/verify-payment (alias: /api/razorpay/verify) verifies
 *      HMAC-SHA256(`order_id|payment_id`, KEY_SECRET) with timingSafeEqual.
 *      Success ONLY if signatures match — never mark as paid otherwise.
 *
 * Security:
 *   - KEY_SECRET never leaves the server (no NEXT_PUBLIC_ prefix).
 *   - Amount must be integer paise >= 100 (Razorpay minimum).
 *   - Currency defaults to INR (account bills subscriptions in INR).
 */

import crypto from 'crypto';
import { razorpayApi } from './razorpay-subscriptions';

export const MIN_ORDER_AMOUNT_PAISE = 100;
export const MAX_ORDER_AMOUNT_PAISE = 10_000_000; // ₹1,00,000 cap for one-time checkout

export interface CreateOrderInput {
  amount?: unknown;
  currency?: unknown;
  receipt?: unknown;
  notes?: Record<string, unknown>;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  status?: string;
}

export function validateOrderInput(input: CreateOrderInput): { error: string } | {
  amountPaise: number;
  currency: string;
  receipt: string;
} {
  const { amount, currency = 'INR', receipt } = input;

  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return { error: 'Amount must be an integer in paise (e.g. 50000 for ₹500).' };
  }
  if (amount < MIN_ORDER_AMOUNT_PAISE) {
    return { error: `Amount must be at least ${MIN_ORDER_AMOUNT_PAISE} paise.` };
  }
  if (amount > MAX_ORDER_AMOUNT_PAISE) {
    return { error: `Amount exceeds the one-time limit of ${MAX_ORDER_AMOUNT_PAISE} paise.` };
  }

  const cur = typeof currency === 'string' && currency.trim() ? currency.trim().toUpperCase() : 'INR';
  if (!/^[A-Z]{3}$/.test(cur)) {
    return { error: 'Currency must be a 3-letter ISO code (e.g. INR).' };
  }

  let rcpt = typeof receipt === 'string' && receipt.trim() ? receipt.trim().slice(0, 40) : `rcpt_${Date.now()}`;
  if (rcpt.length === 0) rcpt = `rcpt_${Date.now()}`;

  return { amountPaise: amount, currency: cur, receipt: rcpt };
}

export async function createRazorpayOrder(
  args: { amountPaise: number; currency: string; receipt: string; userId?: string },
): Promise<RazorpayOrder> {
  return razorpayApi<RazorpayOrder>('POST', '/v1/orders', {
    amount: args.amountPaise,
    currency: args.currency,
    receipt: args.receipt,
    notes: args.userId ? { userId: args.userId } : undefined,
  });
}

export function publicKeyId(): string | undefined {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
}

export interface VerifyOrderInput {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
}

export function verifyOrderSignature(input: VerifyOrderInput): { valid: boolean; error?: string } {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = input;

  if (
    typeof razorpay_order_id !== 'string' ||
    !razorpay_order_id ||
    typeof razorpay_payment_id !== 'string' ||
    !razorpay_payment_id ||
    typeof razorpay_signature !== 'string' ||
    !razorpay_signature
  ) {
    return { valid: false, error: 'Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature.' };
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return { valid: false, error: 'Payment verification is not configured (missing KEY_SECRET).' };
  }

  // One-time orders: HMAC-SHA256(`order_id|payment_id`, secret).
  // NOTE: subscription verify uses the REVERSE field order — do not mix them.
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(razorpay_signature, 'utf8');
  const valid =
    expectedBuf.length === receivedBuf.length && crypto.timingSafeEqual(expectedBuf, receivedBuf);

  return valid ? { valid: true } : { valid: false, error: 'Signature mismatch. Payment NOT verified.' };
}
