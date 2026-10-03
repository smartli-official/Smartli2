import { PLANS } from '@/components/plan/plans';

export interface PlanLimits {
  messages: number | null; // null = unlimited
  quizzes: number | null;
  voiceMinutes: number | null;
}

export const NUMERIC_LIMITS: Record<string, PlanLimits> = {
  spark: { messages: 25, quizzes: 5, voiceMinutes: 5 },
  scholar: { messages: 1500, quizzes: null, voiceMinutes: 120 },
  luminary: { messages: null, quizzes: null, voiceMinutes: 600 },
};

export interface UsageState {
  messagesUsed: number;
  quizzesUsed: number;
  voiceMinutesUsed: number;
}

export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function normalizePlanId(planId: unknown): string {
  if (typeof planId === 'string' && PLANS.some((p) => p.id === planId)) return planId;
  return 'spark';
}

export function getLimits(planId: string): PlanLimits {
  return NUMERIC_LIMITS[planId] ?? NUMERIC_LIMITS.spark!;
}

export function nextResetLabel(d = new Date()) {
  const first = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return first.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function buildUsageView(planId: string, used: UsageState) {
  const safePlanId = normalizePlanId(planId);
  const plan = PLANS.find((p) => p.id === safePlanId) ?? PLANS[0]!;
  const limits = getLimits(safePlanId);

  const remaining = {
    messages: limits.messages === null ? null : Math.max(0, limits.messages - used.messagesUsed),
    quizzes: limits.quizzes === null ? null : Math.max(0, limits.quizzes - used.quizzesUsed),
    voiceMinutes:
      limits.voiceMinutes === null
        ? null
        : Math.max(0, Math.round((limits.voiceMinutes - used.voiceMinutesUsed) * 10) / 10),
  };

  const pct = {
    messages:
      limits.messages === null ? Math.min(1, used.messagesUsed / 2000) : Math.min(1, used.messagesUsed / limits.messages),
    quizzes:
      limits.quizzes === null ? Math.min(1, used.quizzesUsed / 60) : Math.min(1, used.quizzesUsed / Math.max(1, limits.quizzes)),
    voice:
      limits.voiceMinutes === null || limits.voiceMinutes === 0
        ? 0
        : Math.min(1, used.voiceMinutesUsed / limits.voiceMinutes),
  };

  const exhausted = {
    messages: remaining.messages !== null && remaining.messages <= 0,
    quizzes: remaining.quizzes !== null && remaining.quizzes <= 0,
    voice: remaining.voiceMinutes !== null && remaining.voiceMinutes <= 0,
  };

  return { plan, planId: safePlanId, limits, used, remaining, pct, exhausted, nextResetLabel: nextResetLabel() };
}
