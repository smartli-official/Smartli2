import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logFocusSeconds } from '@/lib/dashboard';
import { touchStreak } from '@/lib/streaks';

/**
 * POST /api/dashboard/focus — log genuine focus time from the Focus Hub timer.
 * Body: { seconds: number }
 * - Adds to dashboard.study_time (+ weekly buckets).
 * - Credits today's streak (a completed focus block is real activity).
 * Clamp: 5s min per heartbeat, 4h max per call to prevent abuse.
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = (await req.json().catch(() => null)) as { seconds?: unknown } | null;
    const seconds = Math.floor(Number(body?.seconds ?? 0) || 0);
    if (!Number.isFinite(seconds) || seconds < 5 || seconds > 4 * 3600) {
      return NextResponse.json({ error: 'seconds must be between 5 and 14400.' }, { status: 400 });
    }
    const [{ row, view }, streak] = await Promise.all([
      logFocusSeconds(userId, seconds),
      touchStreak(userId, { seconds, credit: true }),
    ]);
    return NextResponse.json({
      hours: view,
      streakDays: streak.streak_days ?? 0,
      studyTimeSeconds: row.study_time ?? 0,
      loggedSeconds: seconds,
    });
  } catch (err) {
    console.error('POST /api/dashboard/focus failed:', err);
    return NextResponse.json({ error: 'Failed to log focus time.' }, { status: 500 });
  }
}
