'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  BadgeCheck,
  Check,
  Crown,
  Minus,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RollingPrice } from './RollingPrice';
import { cn } from '@/lib/utils';
import {
  COMPARISON,
  PLANS,
  type BillingPeriod,
} from './plans';
import { usePlanUsage } from '@/hooks/usePlanUsage';
import {
  CURRENCY_LABEL,
  currencyForCountry,
  fetchCountryCode,
  guessCurrency,
  priceAmount,
  yearlyDiscountPct,
  type CurrencyCode,
} from './currency';

// WebGL aurora runs on a rAF loop — never block first paint with it. Render a
// static gradient immediately; hydrate the live shader after mount.
const PlanShader = dynamic(() => import('./PlanShader').then((m) => m.PlanShader), {
  ssr: false,
});

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PRESS_SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const;

const PLAN_ICONS = [Sparkles, Zap, Crown] as const;

/** India → INR, Myanmar → MMK, everywhere else → USD. */
function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  useEffect(() => {
    // Instant best-guess so first paint already matches most visitors.
    setCurrency(guessCurrency());
    // Refine with IP geolocation; silently keep the guess on failure.
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);
    fetchCountryCode(controller.signal).then((code) => {
      const resolved = currencyForCountry(code);
      if (resolved) setCurrency(resolved);
    }).finally(() => window.clearTimeout(timeout));
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  return currency;
}

/** Razorpay bills subscriptions in INR — canonical charge per plan (whole rupees). */
const CHARGE_INR: Record<string, { monthly: number; yearly: number }> = {
  scholar: { monthly: 110, yearly: 1188 },
  luminary: { monthly: 1399, yearly: 13999 },
};

interface RazorpaySuccessResponse {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface ActiveSubscription {
  id: string;
  planId: string;
  billing: string;
  status: string;
  cancelAtCycleEnd: boolean;
  entitling: boolean;
  pending: { planId: string; billing: string } | null;
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

function BillingToggle({
  billing,
  onChange,
  yearlyOffPct,
}: {
  billing: BillingPeriod;
  onChange: (b: BillingPeriod) => void;
  yearlyOffPct: number;
}) {
  const options: { id: BillingPeriod; label: string; hint: string }[] = [
    { id: 'monthly', label: 'Monthly', hint: 'Pay month to month' },
    { id: 'yearly', label: 'Yearly', hint: `Save ${yearlyOffPct}% vs monthly` },
  ];
  return (
    <div
      role="group"
      aria-label="Billing period"
      className="relative flex w-fit items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md"
    >
      {options.map((opt) => {
        const active = billing === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            title={opt.hint}
            className={cn(
              'relative rounded-full px-5 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60',
              active ? 'text-white' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-[#9b87f5]/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              />
            )}
            <span className="relative z-10">
              {opt.label}
              {opt.id === 'yearly' && yearlyOffPct > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  −{yearlyOffPct}%
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function UsageMeter({
  label,
  value,
  pct,
  index,
}: {
  label: string;
  value: string;
  pct: number;
  index: number;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        <span className="shrink-0 text-xs font-semibold text-foreground/90">
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          initial={{ transform: 'scaleX(0)' }}
          animate={{ transform: `scaleX(${pct})` }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.15 + index * 0.08,
          }}
          style={{ transformOrigin: 'left center' }}
          className="h-full w-full rounded-full bg-gradient-to-r from-[#9b87f5] to-[#22d3ee]"
        />
      </div>
    </div>
  );
}

export function PlanPageClient() {
  const reduceMotion = useReducedMotion();
  const { plan: current, planId: currentId, used, limits, pct, setPlan, refresh } = usePlanUsage();
  const currency = useCurrency();
  const [billing, setBilling] = useState<BillingPeriod>('yearly');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [justSwitched, setJustSwitched] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const refreshSubscription = useCallback(async () => {
    try {
      const res = await fetch('/api/razorpay/subscription', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { success: boolean; subscription: ActiveSubscription | null };
      if (data.success) setSubscription(data.subscription);
    } catch {
      /* offline — keep last known subscription state */
    }
  }, []);

  useEffect(() => {
    void refreshSubscription();
  }, [refreshSubscription]);


  const activatePlan = async (id: string) => {
    await setPlan(id);
    setPendingId(null);
    setJustSwitched(id);
    window.setTimeout(() => setJustSwitched(null), 2400);
  };

  /** Cancel at the end of the current billing cycle (two-step confirm). */
  const handleCancelSubscription = async () => {
    if (!subscription || cancelling) return;
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      window.setTimeout(() => setConfirmingCancel(false), 6000);
      return;
    }
    setConfirmingCancel(false);
    setCancelling(true);
    setPayError(null);
    try {
      const res = await fetch('/api/razorpay/subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? 'Could not cancel the subscription.');
      await refreshSubscription();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Could not cancel the subscription.');
    } finally {
      setCancelling(false);
    }
  };

  const handleSelect = async (id: string) => {
    if (id === currentId || pendingId) return;
    setPayError(null);
    setNotice(null);
    // The free Spark tier needs no payment — but an active subscription must
    // be cancelled first (the backend enforces this too), or billing would
    // continue while the account sits on the free tier.
    if (id === 'spark') {
      if (subscription?.entitling) {
        setPayError('You have an active subscription. Cancel it below first — access stays until the period ends.');
        return;
      }
      await activatePlan(id);
      return;
    }
    const plan = PLANS.find((p) => p.id === id);
    if (!plan) return;
    setPendingId(id);
    try {
      await loadRazorpayScript();
      const subRes = await fetch('/api/razorpay/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: id, billing }),
      });
      const sub = (await subRes.json()) as {
        success: boolean;
        error?: string;
        subscriptionId?: string;
        keyId?: string;
        requiresCheckout?: boolean;
        switched?: boolean;
        immediate?: boolean;
        scheduled?: boolean;
        pendingPlanId?: string;
        planId?: string;
        message?: string;
      };
      if (!sub.success) {
        throw new Error(sub.error ?? 'Could not start the subscription. Please try again.');
      }
      // No Checkout needed: immediate upgrade applied server-side, or a
      // downgrade was queued for the next billing period.
      if (sub.switched && !sub.requiresCheckout) {
        await refresh();
        await refreshSubscription();
        setPendingId(null);
        if (sub.immediate && sub.planId) {
          setJustSwitched(sub.planId);
          window.setTimeout(() => setJustSwitched(null), 2400);
        } else if (sub.scheduled) {
          setNotice(sub.message ?? 'Downgrade scheduled — your current plan stays active until the period ends.');
        }
        return;
      }
      if (!sub.subscriptionId || !sub.keyId) {
        throw new Error(sub.error ?? 'Could not start the subscription. Please try again.');
      }
      if (!window.Razorpay) throw new Error('Payment window failed to load. Please retry.');
      // Recurring billing: Checkout authorises a mandate against the
      // subscription — amount/interval come from the Razorpay Plan, so only
      // subscription_id is passed (never an amount from the client).
      const checkout = new window.Razorpay({
        key: sub.keyId,
        subscription_id: sub.subscriptionId,
        name: 'Smartli',
        description: `${plan.name} — ${billing === 'monthly' ? 'monthly' : 'yearly'} subscription, auto-renews until cancelled`,
        theme: { color: '#9b87f5' },
        modal: { ondismiss: () => setPendingId(null) },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, planId: id, billing }),
            });
            const verified = (await verifyRes.json()) as { success: boolean; error?: string };
            if (!verified.success) throw new Error(verified.error ?? 'Subscription could not be verified.');
            // Verify activated the plan server-side AND reset AI usage.
            // Refresh from server truth (setPlan can't activate paid tiers —
            // /api/usage/plan only allows the free tier without payment).
            await refresh();
            await refreshSubscription();
            setPendingId(null);
            setJustSwitched(id);
            window.setTimeout(() => setJustSwitched(null), 2400);
          } catch (err) {
            setPendingId(null);
            setPayError(err instanceof Error ? err.message : 'Subscription verification failed.');
          }
        },
      });
      checkout.on('payment.failed', (res: RazorpayFailureResponse) => {
        setPendingId(null);
        setPayError(res.error?.description ?? 'The subscription authorisation failed. No money was deducted in test mode.');
      });
      checkout.open();
    } catch (err) {
      setPendingId(null);
      setPayError(err instanceof Error ? err.message : 'Something went wrong starting the payment.');
    }
  };

  const entrance = (i: number) =>
    reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, transform: 'translateY(10px) scale(0.985)' };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background pb-36">
      {/* Ambient shader sky — static gradient paints instantly, live WebGL hydrates after */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(155,135,245,0.18),transparent)]">
        <PlanShader />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#9b87f5]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 md:pt-24">
        {/* Eyebrow + headline */}
        <motion.div
          initial={entrance(0)}
          animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
          transition={{ duration: 0.25, ease: [...EASE_OUT] }}
          className="flex flex-col items-center text-center"
        >
          <h1
            className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl"
          >
            Pick the orbit
            <br />
            for how you study
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Every tier keeps the full Smartli experience. Higher orbits just
            remove the ceilings — more messages, more quizzes, more voice.
          </p>
          <div className="mt-6">
            <BillingToggle billing={billing} onChange={setBilling} yearlyOffPct={yearlyDiscountPct('scholar', currency)} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Test mode — subscriptions run through Razorpay Checkout and bill in INR until cancelled.
            {currency !== 'INR' && ' Converted from the display price above.'}
          </p>
          {payError && (
            <p role="alert" className="mt-3 max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {payError}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-3 max-w-md rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
              {notice}
            </p>
          )}
        </motion.div>

        {/* Current subscription strip */}
        <motion.section
          aria-label="Current subscription"
          initial={entrance(1)}
          animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
          transition={{
            duration: 0.25,
            ease: [...EASE_OUT],
            delay: reduceMotion ? 0 : 0.06,
          }}
          className="glass mt-10 overflow-hidden rounded-3xl"
        >
          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${current.glow}, transparent 70%)`,
                }}
              >
                <BadgeCheck
                  className="h-6 w-6"
                  style={{ color: current.accent }}
                />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Current plan
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={current.id}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, filter: 'blur(4px)' }
                      }
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, filter: 'blur(4px)' }
                      }
                      transition={{ duration: 0.2, ease: [...EASE_OUT] }}
                      className="text-xl font-bold tracking-tight text-foreground"
                    >
                      Smartli {current.name}
                    </motion.span>
                  </AnimatePresence>
                  {justSwitched === current.id ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      Active — enjoy the boost
                    </span>
                  ) : subscription?.entitling ? (
                    <span className="inline-flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Renews {subscription.billing} · auto-renews until cancelled
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleCancelSubscription()}
                        disabled={cancelling}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                      >
                        {cancelling
                          ? 'Cancelling…'
                          : confirmingCancel
                            ? 'Click again to confirm cancel'
                            : 'Cancel subscription'}
                      </button>
                      {subscription.pending && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                          Downgrades to {subscription.pending.planId} at period end
                        </span>
                      )}
                    </span>
                  ) : subscription?.cancelAtCycleEnd ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                      Cancels at period end — access until then
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Renews monthly · cancel anytime
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {current.tagline}
                </p>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-xl">
              <UsageMeter
                label="AI messages"
                value={
                  limits.messages === null
                    ? `${used.messagesUsed.toLocaleString()} used · Unlimited`
                    : `${used.messagesUsed.toLocaleString()} / ${limits.messages.toLocaleString()}`
                }
                pct={pct.messages}
                index={0}
              />
              <UsageMeter
                label="Quizzes"
                value={
                  limits.quizzes === null
                    ? `${used.quizzesUsed.toLocaleString()} used · Unlimited`
                    : `${used.quizzesUsed.toLocaleString()} / ${limits.quizzes.toLocaleString()}`
                }
                pct={pct.quizzes}
                index={1}
              />
              <UsageMeter
                label="Voice"
                value={
                  limits.voiceMinutes === null
                    ? `${used.voiceMinutesUsed.toLocaleString()} min · Unlimited`
                    : `${used.voiceMinutesUsed.toLocaleString()} / ${limits.voiceMinutes.toLocaleString()} min`
                }
                pct={pct.voice}
                index={2}
              />
            </div>
          </div>
        </motion.section>

        {/* Tier cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const Icon = PLAN_ICONS[i % PLAN_ICONS.length]!;
            const isCurrent = plan.id === currentId;
            const isPending = pendingId === plan.id;
            return (
              <motion.article
                key={plan.id}
                initial={entrance(i)}
                animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
                transition={{
                  duration: 0.25,
                  ease: [...EASE_OUT],
                  delay: reduceMotion ? 0 : 0.1 + i * 0.06,
                }}
                whileHover={
                  reduceMotion ? undefined : { transform: 'translateY(-4px)' }
                }
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-[border-color,box-shadow] duration-200 ease-out sm:p-7',
                  plan.popular
                    ? 'border-[#9b87f5]/40 bg-white/[0.05] shadow-[0_20px_80px_-20px_rgba(155,135,245,0.45)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20',
                )}
                style={
                  plan.popular
                    ? { boxShadow: `0 24px 90px -24px ${plan.glow}` }
                    : undefined
                }
              >
                {plan.popular && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-8 top-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${plan.accent}, transparent)`,
                      }}
                    />
                    <span className="absolute right-5 top-5 rounded-full bg-[#9b87f5]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#c4b5fd]">
                      Most popular
                    </span>
                  </>
                )}

                <span
                  aria-hidden="true"
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${plan.glow}, transparent 75%)`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: plan.accent }} />
                </span>

                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {plan.name}
                </h2>
                <p className="mt-1 min-h-[40px] text-sm leading-relaxed text-muted-foreground">
                  {plan.tagline}
                </p>

                <div className="mt-4 flex items-end gap-1.5">
                  <span className="text-4xl font-bold tracking-[-0.02em] text-foreground">
                    <RollingPrice
                      amount={priceAmount(plan.id, currency, billing)}
                      currency={currency}
                    />
                  </span>
                  <span className="pb-1.5 text-sm text-muted-foreground">
                    {plan.monthlyPrice === 0
                      ? 'forever'
                      : billing === 'monthly'
                        ? '/ month'
                        : '/ mo, billed yearly'}
                  </span>
                </div>

                <motion.button
                  type="button"
                  onClick={() => handleSelect(plan.id)}
                  disabled={isCurrent || pendingId !== null}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  transition={PRESS_SPRING}
                  className={cn(
                    'mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-[transform,opacity,background-color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5]/60 disabled:cursor-default',
                    isCurrent
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : plan.popular
                        ? 'bg-white text-[#1F2023] hover:bg-white/85 disabled:opacity-70'
                        : 'border border-white/12 bg-white/[0.05] text-foreground hover:border-white/25 hover:bg-white/[0.08] disabled:opacity-70',
                  )}
                >
                  {isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                      Working…
                    </>
                  ) : isCurrent ? (
                    <>
                      <Check className="h-4 w-4" />
                      Current plan
                    </>
                  ) : (
                    plan.cta
                  )}
                </motion.button>

                <div className="mt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/70">
                    What&rsquo;s included
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {plan.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: plan.accent }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 border-t border-white/[0.07] pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Limits to know
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {plan.limitations.map((l) => (
                      <li
                        key={l}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <Minus className="mt-1 h-3.5 w-3.5 shrink-0 opacity-70" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Comparison table */}
        <motion.section
          aria-label="Plan comparison"
          initial={entrance(4)}
          animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
          transition={{
            duration: 0.25,
            ease: [...EASE_OUT],
            delay: reduceMotion ? 0 : 0.28,
          }}
          className="glass mt-8 overflow-hidden rounded-3xl"
        >
          <div className="border-b border-white/[0.07] px-5 py-4 sm:px-7">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Every plan, side by side
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Benefits in white, limitations muted — no fine-print surprises.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-7">
                    Capability
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: p.accent }}
                    >
                      {p.name}
                      {p.id === currentId && (
                        <span className="ml-2 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] normal-case text-emerald-300">
                          yours
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, ri) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      ri % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent',
                      'border-t border-white/[0.06]',
                    )}
                  >
                    <td className="px-5 py-3 font-medium text-foreground/90 sm:px-7">
                      {row.feature}
                    </td>
                    {row.values.map((v, ci) => (
                      <td
                        key={ci}
                        className={cn(
                          'px-4 py-3',
                          row.included[ci]
                            ? 'text-foreground/85'
                            : 'text-muted-foreground',
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {row.included[ci] ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          )}
                          {v}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Prices in {CURRENCY_LABEL[currency]}. Paid tiers are recurring subscriptions charged in INR via
          Razorpay (Scholar ₹{CHARGE_INR.scholar![billing].toLocaleString('en-IN')} · Luminary ₹
          {CHARGE_INR.luminary![billing].toLocaleString('en-IN')}{' '}
          {billing === 'monthly' ? '/ month' : '/ year'})
          that auto-renew until cancelled and activate only after the mandate is verified.
          Switch tiers anytime — upgrades apply immediately, downgrades at the next billing period.
          Yearly billing saves {yearlyDiscountPct('scholar', currency)}% versus monthly on Scholar.
        </p>
      </div>
    </div>
  );
}
