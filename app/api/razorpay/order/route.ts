import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createRazorpayOrder,
  publicKeyId,
  validateOrderInput,
} from '@/lib/plan/razorpay-orders';

/**
 * POST /api/razorpay/order — alias of POST /api/create-order.
 *
 * Kept for the `/api/razorpay/*` convention (see lib/plan/pricing.ts).
 * Identical contract: { amount (paise), currency?, receipt? } →
 * { order_id, amount, currency, keyId }.
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

    try {
      const order = await createRazorpayOrder({
        amountPaise: validated.amountPaise,
        currency: validated.currency,
        receipt: validated.receipt,
        userId,
      });
      return NextResponse.json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: publicKeyId(),
      });
    } catch (err) {
      console.error('Razorpay create order failed:', err);
      return NextResponse.json(
        { success: false, error: 'Could not create the order with Razorpay. Please try again.' },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Create order failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order.' }, { status: 500 });
  }
}
