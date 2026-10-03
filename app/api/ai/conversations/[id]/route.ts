import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

type Ctx = { params: { id: string } };

/** GET /api/ai/conversations/[id] — conversation + its messages. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  const { data: messages, error: msgError } = await supabaseAdmin
    .from('ai_messages')
    .select('id, role, content, model, meta, created_at')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: true })
    .limit(500);

  if (msgError) {
    return NextResponse.json({ error: 'Failed to load messages.' }, { status: 500 });
  }
  return NextResponse.json({ conversation: { ...conversation, messages: messages ?? [] } });
}

/** PATCH /api/ai/conversations/[id] — rename / pin. Body: { title?, pinned? }. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    title?: unknown;
    pinned?: unknown;
  } | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const patch: { title?: string; pinned?: boolean; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (typeof body.title === 'string') {
    const title = body.title.trim().slice(0, 120);
    if (!title) {
      return NextResponse.json({ error: 'Title cannot be empty.' }, { status: 400 });
    }
    patch.title = title;
  }
  if (typeof body.pinned === 'boolean') patch.pinned = body.pinned;
  if (patch.title === undefined && patch.pinned === undefined) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('ai_conversations')
    .update(patch)
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('id, mode, title, pinned, created_at, updated_at');

  if (error) {
    return NextResponse.json({ error: 'Failed to update conversation.' }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }
  return NextResponse.json({ conversation: data[0] });
}

/** DELETE /api/ai/conversations/[id] — delete (messages cascade). */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('ai_conversations')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId)
    .select('id');

  if (error) {
    return NextResponse.json({ error: 'Failed to delete conversation.' }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
