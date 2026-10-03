/**
 * Shared shapes + helpers for synced AI sidebar conversations.
 * Conversations + messages live in Supabase (`ai_conversations`,
 * `ai_messages`) keyed by Clerk user id. All DB access goes through
 * server API routes with the service-role key — never from the client.
 */

export type AiConversationMode = 'explainer' | 'quiz';

export interface AiConversation {
  id: string;
  mode: AiConversationMode;
  title: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type AiMessageRole = 'user' | 'assistant';

export interface NewAiMessage {
  role: AiMessageRole;
  content: string;
  model?: string;
  meta?: Record<string, unknown>;
}

export interface AiMessage extends NewAiMessage {
  id: string;
  created_at: string;
}

export interface AiConversationDetail extends AiConversation {
  messages: AiMessage[];
}

export const DEFAULT_TITLES: Record<AiConversationMode, string> = {
  explainer: 'New chat',
  quiz: 'New quiz',
};

/** Derive a sidebar title from the first user message. */
export function titleFromText(text: string, fallback: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return fallback;
  return clean.length > 60 ? `${clean.slice(0, 60).trimEnd()}…` : clean;
}

export function formatRelativeTime(iso: string, nowMs: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  // `nowMs` defaults to the device clock, but callers should pass
  // server-anchored time (see useAiConversations `timeOffsetMs`): device
  // clocks can sit minutes fast/slow, which would skew every label.
  const diff = nowMs - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return 'Just now';
  if (diff < hour) {
    const m = Math.floor(diff / minute);
    return `${m}m ago`;
  }
  if (diff < day) {
    const h = Math.floor(diff / hour);
    return `${h}h ago`;
  }
  if (diff < 2 * day) return 'Yesterday';
  if (diff < 7 * day) {
    const d = Math.floor(diff / day);
    return `${d}d ago`;
  }
  return new Date(then).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
