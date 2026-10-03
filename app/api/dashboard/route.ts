import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDashboard, toHoursView } from '@/lib/dashboard';
import { getStreak } from '@/lib/streaks';
import { getOrCreateUsage } from '@/lib/plan/usage-server';

/**
 * GET /api/dashboard — single payload for the Studio Hub widgets.
 * Sources of truth, all Supabase:
 *  - hours  -> dashboard.study_time / weekly buckets
 *  - streak -> user_streaks
 *  - usage  -> user_usage (via existing usage-server)
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [dashRow, streakRow, usage] = await Promise.all([
      getDashboard(userId),
      getStreak(userId),
      getOrCreateUsage(userId),
    ]);
    return NextResponse.json({
      hours: toHoursView(dashRow),
      streak: {
        streakDays: streakRow.streak_days ?? 0,
        creditedToday: streakRow.credited_today ?? false,
        lastCreditedDate: streakRow.last_credited_date,
        activeSecondsToday: streakRow.active_seconds_today ?? 0,
      },
      usage: {
        planId: usage.view.planId,
        used: usage.view.used,
        remaining: usage.view.remaining,
        limits: usage.view.limits,
        pct: usage.view.pct,
        nextResetLabel: usage.view.nextResetLabel,
      },
    });
  } catch (err) {
    console.error('GET /api/dashboard failed:', err);
    return NextResponse.json({ error: 'Failed to load dashboard.' }, { status: 500 });
  }
}
