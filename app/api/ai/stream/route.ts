import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { streamAIResponse } from '@/lib/ai/gateway';
import { AIRequest } from '@/lib/ai/config';
import { checkAndConsume } from '@/lib/plan/usage-server';
import { touchStreak } from '@/lib/streaks';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  // Server-side quota gate: backed by Supabase, not bypassable via client.
  try {
    const { allowed } = await checkAndConsume(userId, 'messages', 1);
    if (!allowed) {
      return NextResponse.json(
        { error: 'You have hit your limits.', limitKind: 'messages' },
        { status: 402 },
      );
    }
  } catch (err) {
    console.error('Usage check failed (/api/ai/stream):', err);
    // Fail open on usage-infra errors so AI still works; quota reconciles on next call.
  }
  // Genuine learning activity → counts toward today's streak (fire-and-forget).
  touchStreak(userId, { credit: true }).catch((err) =>
    console.error('Streak touch failed (/api/ai/stream):', err),
  );
  try {
    const body: AIRequest = await req.json();
    const stream = await streamAIResponse(body);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
