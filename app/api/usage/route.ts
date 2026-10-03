import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getOrCreateUsage } from '@/lib/plan/usage-server';

/** GET /api/usage — current plan + monthly usage from Supabase. */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  try {
    const { row, view } = await getOrCreateUsage(userId);
    return NextResponse.json({
      planId: view.planId,
      plan: view.plan,
      limits: view.limits,
      used: view.used,
      remaining: view.remaining,
      pct: view.pct,
      exhausted: view.exhausted,
      nextResetLabel: view.nextResetLabel,
      periodMonth: row.period_month,
    });
  } catch (err: any) {
    console.error('GET /api/usage failed:', err);
    return NextResponse.json({ error: 'Failed to load usage.' }, { status: 500 });
  }
}
