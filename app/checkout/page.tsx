'use client';

import { useState } from 'react';
import { RazorpayCheckout } from '@/components/RazorpayCheckout';

export default function CheckoutPage() {
  const [amountPaise, setAmountPaise] = useState(50000);
  const [paid, setPaid] = useState<{ paymentId: string; orderId: string } | null>(null);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 py-16">
      <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-time Razorpay Standard Checkout (LIVE). Subscriptions still live on the{' '}
          <a href="/plan" className="underline underline-offset-4">
            plan page
          </a>
          .
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Amount (paise, min 100)
        </label>
        <input
          type="number"
          min={100}
          step={100}
          value={amountPaise}
          onChange={(e) => {
            setPaid(null);
            setAmountPaise(Number(e.target.value));
          }}
          className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-foreground outline-none focus:border-[#9b87f5]/60"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {(amountPaise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} will be
          charged. Use a real payment method — this is LIVE mode.
        </p>

        <div className="mt-5">
          <RazorpayCheckout
            amountPaise={amountPaise}
            description="Smartli one-time payment"
            onSuccess={(data) => setPaid(data)}
          />
        </div>

        {paid && (
          <div role="status" className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Payment verified. Order <span className="font-mono">{paid.orderId}</span>, payment{' '}
            <span className="font-mono">{paid.paymentId}</span>.
          </div>
        )}
      </div>
    </div>
  );
}
