import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createRazorpayOrder,
  publicKeyId,
  validateOrderInput,
} from '@/lib/plan/razorpay-orders';

/**
 * POST /api/create-order — Razorpay Standard Checkout (one-time, LIVE).
 *
 * Request: { amount (paise, integer >= 100), currency?, receipt? }
 * Returns: { order_id, amount, currency, keyId }
 *
 * Errors:
 *   401 — not logged in
 *   400 — invalid amount / currency / missing fields
 *   500/502 — Razorpay API failure / missing credentials
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'You have to be logged in to pay.' },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      amount?: unknown;
      currency?: unknown;
      receipt?: unknown;
    };

    const validated = validateOrderInput(body);
    if ('error' in validated) {
      return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET is not configured.');
      return NextResponse.json(
        { success: false, error: 'Payments are not configured.' },
        { status: 500 },
      );
    }

    let order;
    try {
      order = await createRazorpayOrder({
        amountPaise: validated.amountPaise,
        currency: validated.currency,
        receipt: validated.receipt,
        userId,
      });
    } catch (err) {
      console.error('Razorpay create order failed:', err);
      return NextResponse.json(
        { success: false, error: 'Could not create the order with Razorpay. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: publicKeyId(),
    });
  } catch (error) {
    console.error('Create order failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order.' },
      { status: 500 },
    );
  }
}
