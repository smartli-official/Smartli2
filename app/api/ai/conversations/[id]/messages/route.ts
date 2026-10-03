import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { titleFromText } from '@/lib/ai/conversations';

type Ctx = { params: { id: string } };

const DEFAULT_TITLE_BY_MODE: Record<string, string> = {
  explainer: 'New chat',
  quiz: 'New quiz',
};

interface IncomingMessage {
  role: unknown;
  content: unknown;
  model?: unknown;
  meta?: unknown;
}

/**
 * POST /api/ai/conversations/[id]/messages
 * Append a batch (usually a user turn + the assistant reply). Auto-titles a
 * fresh conversation from its first user message and bumps updated_at.
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    messages?: IncomingMessage[];
  } | null;
  const incoming = body?.messages;
  if (!Array.isArray(incoming) || incoming.length === 0 || incoming.length > 20) {
    return NextResponse.json({ error: 'Provide 1–20 messages.' }, { status: 400 });
  }

  const { data: conversation, error: convError } = await supabaseAdmin
    .from('ai_conversations')
    .select('id, mode, title, pinned, created_at, updated_at')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (convError || !conversation) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const rows: {
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    model: string | null;
    meta: Record<string, unknown>;
  }[] = [];
  for (const m of incoming) {
    if (m.role !== 'user' && m.role !== 'assistant') {
      return NextResponse.json({ error: 'Each message needs role "user" or "assistant".' }, { status: 400 });
    }
    if (typeof m.content !== 'string' || m.content.length === 0 || m.content.length > 100_000) {
      return NextResponse.json({ error: 'Each message needs 1–100000 chars of content.' }, { status: 400 });
    }
    rows.push({
      conversation_id: params.id,
      role: m.role,
      content: m.content,
      model: typeof m.model === 'string' ? m.model.slice(0, 200) : null,
      meta:
        m.meta && typeof m.meta === 'object' && !Array.isArray(m.meta)
          ? (m.meta as Record<string, unknown>)
          : {},
    });
  }

  const { data: saved, error: insertError } = await supabaseAdmin
    .from('ai_messages')
    .insert(rows)
    .select('id, role, content, model, meta, created_at')
    .order('created_at', { ascending: true });

  if (insertError || !saved) {
    return NextResponse.json({ error: 'Failed to save messages.' }, { status: 500 });
  }

  // Auto-title fresh conversations from the first user message in this batch.
  let title = conversation.title as string;
  const defaultTitle = DEFAULT_TITLE_BY_MODE[conversation.mode as string] ?? 'New chat';
  if (title === defaultTitle) {
    const firstUser = rows.find((r) => r.role === 'user');
    if (firstUser) title = titleFromText(firstUser.content, defaultTitle);
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('ai_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('id, mode, title, pinned, created_at, updated_at')
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: 'Saved, but failed to refresh conversation.' }, { status: 500 });
  }

  return NextResponse.json({ messages: saved, conversation: updated });
}
