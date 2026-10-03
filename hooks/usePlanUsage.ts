'use client';

import { useCallback, useEffect, useState } from 'react';
import { PLANS } from '@/components/plan/plans';
import {
  buildUsageView,
  normalizePlanId,
  type UsageState,
} from '@/lib/plan/limits';

export type { PlanLimits, UsageState } from '@/lib/plan/limits';

/**
 * @deprecated LocalStorage placeholder — usage now lives in Supabase
 * (`user_usage` via /api/usage). Kept for back-compat imports; no longer read.
 */
export const USAGE_KEY = 'smartli-usage-v2';

interface UsageView {
  planId: string;
  plan: (typeof PLANS)[number];
  limits: { messages: number | null; quizzes: number | null; voiceMinutes: number | null };
  used: UsageState;
  remaining: { messages: number | null; quizzes: number | null; voiceMinutes: number | null };
  pct: { messages: number; quizzes: number; voice: number };
  exhausted: { messages: boolean; quizzes: boolean; voice: boolean };
  nextResetLabel: string;
}

function defaultView(): UsageView {
  return buildUsageView('spark', { messagesUsed: 0, quizzesUsed: 0, voiceMinutesUsed: 0 }) as UsageView;
}

export function usePlanUsage() {
  const [view, setView] = useState<UsageView>(() => defaultView());
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/usage', { cache: 'no-store' });
      if (!res.ok) {
        // 401 (logged out) or error — fall back to local defaults so public
        // pages still render; API routes enforce auth independently.
        setReady(true);
        return;
      }
      const data = (await res.json()) as {
        planId?: unknown;
        used?: Partial<UsageState>;
      };
      const planId = normalizePlanId(data.planId);
      const used: UsageState = {
        messagesUsed: Number(data.used?.messagesUsed ?? 0) || 0,
        quizzesUsed: Number(data.used?.quizzesUsed ?? 0) || 0,
        voiceMinutesUsed: Number(data.used?.voiceMinutesUsed ?? 0) || 0,
      };
      setView(buildUsageView(planId, used) as UsageView);
    } catch {
      /* offline — keep last known view */
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // Hygiene: drop orphaned pre-Supabase counters so stale local quotas
    // can never shadow the server again.
    try {
      window.localStorage.removeItem('smartli-usage-v1');
      window.localStorage.removeItem('smartli-usage-v2');
      window.localStorage.removeItem(USAGE_KEY);
    } catch {
      /* private mode */
    }
    void refresh();

    const onCustom = () => void refresh();
    const onFocus = () => void refresh();
    window.addEventListener('smartli-plan-change', onCustom);
    window.addEventListener('smartli-usage-change', onCustom);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('smartli-plan-change', onCustom);
      window.removeEventListener('smartli-usage-change', onCustom);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  /** Gate a single API call: returns false + caller must show the limit modal. */
  const canUse = useCallback(
    (kind: 'messages' | 'quizzes' | 'voice', amount = 1) => {
      if (kind === 'messages') return view.remaining.messages === null || view.remaining.messages >= amount;
      if (kind === 'quizzes') return view.remaining.quizzes === null || view.remaining.quizzes >= amount;
      return view.remaining.voiceMinutes === null || view.remaining.voiceMinutes >= amount;
    },
    [view.remaining.messages, view.remaining.quizzes, view.remaining.voiceMinutes],
  );

  /**
   * Local optimistic bump for instant UI after a successful call.
   * The server already incremented via checkAndConsume in the AI routes;
   * this just mirrors that +1 locally until the next refresh() reconciles
   * with Supabase truth (refresh overwrites, never double-adds server-side).
   */
  const bump = useCallback((patch: Partial<UsageState>) => {
    setView((prev) => {
      const nextUsed: UsageState = {
        messagesUsed: prev.used.messagesUsed + (patch.messagesUsed ?? 0),
        quizzesUsed: prev.used.quizzesUsed + (patch.quizzesUsed ?? 0),
        voiceMinutesUsed:
          Math.round((prev.used.voiceMinutesUsed + (patch.voiceMinutesUsed ?? 0)) * 10) / 10,
      };
      return buildUsageView(prev.planId, nextUsed) as UsageView;
    });
    // Reconcile with server truth (server already +1'd). Debounced by browser.
    window.setTimeout(() => void refresh(), 1500);
  }, [refresh]);

  /** Persist a plan change to Supabase (free switch or post-payment). */
  const setPlan = useCallback(
    async (planId: string) => {
      const safe = normalizePlanId(planId);
      setView((prev) => buildUsageView(safe, prev.used) as UsageView);
      try {
        const res = await fetch('/api/usage/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: safe }),
        });
        if (res.ok) {
          await refresh();
          try {
            window.dispatchEvent(new Event('smartli-plan-change'));
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* offline — optimistic plan stands until refresh */
      }
    },
    [refresh],
  );

  return {
    ready,
    plan: view.plan,
    planId: view.planId,
    limits: view.limits,
    used: view.used,
    remaining: view.remaining,
    pct: view.pct,
    nextResetLabel: view.nextResetLabel,
    bump,
    exhausted: view.exhausted,
    canUse,
    refresh,
    setPlan,
  };
}

export type PlanUsage = ReturnType<typeof usePlanUsage>;
