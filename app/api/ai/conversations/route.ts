import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  DEFAULT_TITLES,
  type AiConversationMode,
} from '@/lib/ai/conversations';

const MODES: AiConversationMode[] = ['explainer', 'quiz'];

async function requireUserId() {
  const { userId } = await auth();
  return userId;
}

/** GET /api/ai/conversations — list the signed-in user's conversations. */
export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('ai_conversations')
    .select('id, mode, title, pinned, created_at, updated_at')
    .eq('user_id', userId)
    .order('pinned', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: 'Failed to load conversations.' }, { status: 500 });
  }
  return NextResponse.json({ conversations: data ?? [] });
}

/** POST /api/ai/conversations — create a conversation. Body: { mode }. */
export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { mode?: unknown } | null;
  const mode: AiConversationMode = MODES.includes(body?.mode as AiConversationMode)
    ? (body!.mode as AiConversationMode)
    : 'explainer';

  const { data, error } = await supabaseAdmin
    .from('ai_conversations')
    .insert({ user_id: userId, mode, title: DEFAULT_TITLES[mode] })
    .select('id, mode, title, pinned, created_at, updated_at')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create conversation.' }, { status: 500 });
  }
  return NextResponse.json({ conversation: { ...data, messages: [] } });
}
