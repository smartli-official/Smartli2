import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { verifyOrderSignature } from '@/lib/plan/razorpay-orders';

/**
 * POST /api/verify-payment — verify a one-time Razorpay payment (LIVE).
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Algorithm: HMAC-SHA256(`order_id|payment_id`, KEY_SECRET), timingSafeEqual.
 *
 * Returns success ONLY when signatures match. Mismatch → 400, never mark paid.
 * Missing fields → 400. Not logged in → 401.
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'You have to be logged in to verify a payment.' },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      razorpay_order_id?: unknown;
      razorpay_payment_id?: unknown;
      razorpay_signature?: unknown;
    };

    const result = verifyOrderSignature(body);
    if (!result.valid) {
      const status = result.error?.includes('not configured') ? 500 : 400;
      return NextResponse.json({ success: false, error: result.error }, { status });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified.',
      paymentId: body.razorpay_payment_id,
      orderId: body.razorpay_order_id,
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed.' },
      { status: 500 },
    );
  }
}
