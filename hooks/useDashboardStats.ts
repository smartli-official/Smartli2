'use client';

import { useCallback, useEffect, useState } from 'react';

export interface DashboardHours {
  totalSeconds: number;
  totalHours: number;
  totalLabel: string;
  weekHours: number;
  weeklyTargetHours: number;
  weeklyPct: number;
}

export interface DashboardStreak {
  streakDays: number;
  creditedToday: boolean;
  lastCreditedDate: string | null;
  activeSecondsToday: number;
}

export interface DashboardUsage {
  planId: string;
  used: { messagesUsed: number; quizzesUsed: number; voiceMinutesUsed: number };
  remaining: { messages: number | null; quizzes: number | null; voiceMinutes: number | null };
  limits: { messages: number | null; quizzes: number | null; voiceMinutes: number | null };
  pct: { messages: number; quizzes: number; voice: number };
  nextResetLabel: string;
}

interface DashboardPayload {
  hours: DashboardHours;
  streak: DashboardStreak;
  usage: DashboardUsage;
}

/**
 * Live Studio Hub stats, all sourced from Supabase via GET /api/dashboard.
 * - hours  -> dashboard.study_time (+ weekly buckets)
 * - streak -> user_streaks
 * - usage  -> user_usage (AI messages / quizzes / voice)
 * Logged-out visitors get `authed:false` and the page falls back to placeholders.
 */
export function useDashboardStats() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [authed, setAuthed] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      if (res.status === 401) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const payload = (await res.json()) as DashboardPayload;
      setData(payload);
      setAuthed(true);
    } catch {
      /* offline — keep last known */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onFocus = () => void refresh();
    const onCustom = () => void refresh();
    window.addEventListener('focus', onFocus);
    window.addEventListener('smartli-usage-change', onCustom);
    window.addEventListener('smartli-focus-logged', onCustom);
    window.addEventListener('smartli-streak-change', onCustom);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('smartli-usage-change', onCustom);
      window.removeEventListener('smartli-focus-logged', onCustom);
      window.removeEventListener('smartli-streak-change', onCustom);
    };
  }, [refresh]);

  return { data, authed, loading, refresh };
}
