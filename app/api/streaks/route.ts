import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getStreak, touchStreak } from '@/lib/streaks';

/** GET /api/streaks — current streak from Supabase (applies rollover/expiry). */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const row = await getStreak(userId);
    return NextResponse.json({
      streakDays: row.streak_days ?? 0,
      lastCreditedDate: row.last_credited_date,
      creditedToday: row.credited_today ?? false,
      activeSecondsToday: row.active_seconds_today ?? 0,
    });
  } catch (err) {
    console.error('GET /api/streaks failed:', err);
    return NextResponse.json({ error: 'Failed to load streak.' }, { status: 500 });
  }
}

/**
 * POST /api/streaks — record activity.
 * Body: { seconds?: number; credit?: boolean }
 * - `credit: true` (default) counts today toward the streak (AI chat, quiz, focus).
 * - `seconds` accumulates focus/active time without forcing a credit when credit:false.
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = (await req.json().catch(() => null)) as { seconds?: unknown; credit?: unknown } | null;
    const seconds = Math.max(0, Math.floor(Number(body?.seconds ?? 0) || 0));
    const credit = body?.credit === undefined ? true : Boolean(body.credit);
    const row = await touchStreak(userId, { seconds, credit });
    return NextResponse.json({
      streakDays: row.streak_days ?? 0,
      lastCreditedDate: row.last_credited_date,
      creditedToday: row.credited_today ?? false,
      activeSecondsToday: row.active_seconds_today ?? 0,
    });
  } catch (err) {
    console.error('POST /api/streaks failed:', err);
    return NextResponse.json({ error: 'Failed to update streak.' }, { status: 500 });
  }
}
