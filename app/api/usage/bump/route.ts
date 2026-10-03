import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkAndConsume } from '@/lib/plan/usage-server';

/**
 * POST /api/usage/bump — legacy client increment path.
 * Prefer server-side checkAndConsume in the AI routes; this exists so older
 * clients can reconcile. Body: { kind: 'messages'|'quizzes'|'voice', amount?: number }
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  try {
    const body = (await req.json().catch(() => null)) as {
      kind?: unknown;
      amount?: unknown;
      // Back-compat: { messagesUsed, quizzesUsed, voiceMinutesUsed }
      messagesUsed?: unknown;
      quizzesUsed?: unknown;
      voiceMinutesUsed?: unknown;
    } | null;

    let kind: 'messages' | 'quizzes' | 'voice' = 'messages';
    let amount = 1;

    if (body && typeof body.kind === 'string' && ['messages', 'quizzes', 'voice'].includes(body.kind)) {
      kind = body.kind as 'messages' | 'quizzes' | 'voice';
      amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 1;
      if (kind === 'voice') amount = Math.round(Math.min(600, amount) * 10) / 10;
      else amount = Math.min(100, Math.floor(amount));
    } else if (body && (body.messagesUsed || body.quizzesUsed || body.voiceMinutesUsed)) {
      // Old shape — apply the first non-zero bucket.
      if (typeof body.messagesUsed === 'number' && body.messagesUsed > 0) {
        kind = 'messages';
        amount = Math.min(100, Math.floor(body.messagesUsed));
      } else if (typeof body.quizzesUsed === 'number' && body.quizzesUsed > 0) {
        kind = 'quizzes';
        amount = Math.min(100, Math.floor(body.quizzesUsed));
      } else {
        kind = 'voice';
        amount = Math.round(Math.min(600, Number(body.voiceMinutesUsed) || 0) * 10) / 10;
      }
    } else {
      return NextResponse.json({ error: 'kind must be messages, quizzes, or voice.' }, { status: 400 });
    }

    const { allowed, view } = await checkAndConsume(userId, kind, amount);
    if (!allowed) {
      return NextResponse.json(
        { error: 'You have hit your limits.', limitKind: kind, ...pickView(view) },
        { status: 402 },
      );
    }
    return NextResponse.json({ success: true, ...pickView(view) });
  } catch (err: any) {
    console.error('POST /api/usage/bump failed:', err);
    return NextResponse.json({ error: 'Failed to update usage.' }, { status: 500 });
  }
}

function pickView(view: any) {
  return {
    planId: view.planId,
    plan: view.plan,
    limits: view.limits,
    used: view.used,
    remaining: view.remaining,
    pct: view.pct,
    exhausted: view.exhausted,
    nextResetLabel: view.nextResetLabel,
  };
}
