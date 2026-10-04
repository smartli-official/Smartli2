'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: { description?: string; reason?: string };
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (res: RazorpayFailureResponse) => void) => void;
    };
  }
}

let checkoutScriptPromise: Promise<void> | null = null;

/** Loads https://checkout.razorpay.com/v1/checkout.js exactly once. */
function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => (window.Razorpay ? resolve() : reject(new Error('Checkout failed to load')));
      script.onerror = () => {
        checkoutScriptPromise = null;
        reject(new Error('Could not load the payment window. Check your connection and retry.'));
      };
      document.body.appendChild(script);
    });
  }
  return checkoutScriptPromise;
}

interface RazorpayCheckoutProps {
  /** Amount in paise (integer >= 100). E.g. 50000 = ₹500. */
  amountPaise: number;
  currency?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (data: { paymentId: string; orderId: string }) => void;
  onError?: (message: string) => void;
}

export function RazorpayCheckout({
  amountPaise,
  currency = 'INR',
  description = 'Smartli one-time payment',
  buttonText,
  className,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fail = (message: string) => {
    setError(message);
    onError?.(message);
  };

  const handlePay = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await loadRazorpayScript();

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountPaise, currency }),
      });
      const order = (await orderRes.json()) as {
        success: boolean;
        error?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
      };
      if (!order.success || !order.order_id || !order.keyId) {
        throw new Error(order.error ?? 'Could not create the order. Please try again.');
      }
      if (!window.Razorpay) throw new Error('Payment window failed to load. Please retry.');

      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency ?? currency,
        name: 'Smartli',
        description,
        theme: { color: '#9b87f5' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            fail('Payment cancelled. No money was deducted.');
          },
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verified = (await verifyRes.json()) as {
              success: boolean;
              error?: string;
              paymentId?: string;
              orderId?: string;
            };
            if (!verified.success) throw new Error(verified.error ?? 'Payment could not be verified.');
            setLoading(false);
            setError(null);
            onSuccess?.({
              paymentId: String(verified.paymentId ?? response.razorpay_payment_id),
              orderId: String(verified.orderId ?? response.razorpay_order_id),
            });
          } catch (err) {
            setLoading(false);
            fail(err instanceof Error ? err.message : 'Payment verification failed.');
          }
        },
      });

      checkout.on('payment.failed', (res: RazorpayFailureResponse) => {
        setLoading(false);
        fail(res.error?.description ?? 'Payment failed. No money was deducted.');
      });
      checkout.open();
    } catch (err) {
      setLoading(false);
      fail(err instanceof Error ? err.message : 'Something went wrong starting the payment.');
    }
  };

  const rupees = (amountPaise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: currency.toUpperCase() === 'INR' ? 'INR' : 'INR',
  });

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => void handlePay()}
        disabled={loading}
        className={cn(
          'inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-[#1F2023] transition hover:bg-white/85 disabled:opacity-70',
          className,
        )}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
            Processing…
          </>
        ) : (
          (buttonText ?? `Pay ${rupees}`)
        )}
      </button>
      {error && (
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
