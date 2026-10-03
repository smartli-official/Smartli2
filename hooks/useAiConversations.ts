'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AiConversation,
  AiConversationDetail,
  AiConversationMode,
  NewAiMessage,
} from '@/lib/ai/conversations';

const POLL_MS = 15_000;

/**
 * Best-effort offset between the API server clock and this device clock,
 * derived from the `Date` response header (same-origin, always readable).
 * Server timestamps (Supabase) share the server's accurate clock, so adding
 * this offset to `Date.now()` keeps relative-time labels truthful even when
 * the device clock has drifted minutes fast/slow. Null when unavailable.
 */
function serverOffsetFrom(res: Response): number | null {
  const h = res.headers.get('date');
  if (!h) return null;
  const t = new Date(h).getTime();
  if (Number.isNaN(t)) return null;
  return t - Date.now();
}

async function readJson(res: Response) {
  const data = (await res.json().catch(() => null)) as {
    conversations?: AiConversation[];
    conversation?: AiConversationDetail | AiConversation;
    messages?: AiConversationDetail['messages'];
    error?: string;
  } | null;
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data ?? {};
}

function sortConversations(list: AiConversation[]): AiConversation[] {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

export function useAiConversations(enabled: boolean) {
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [active, setActive] = useState<AiConversationDetail | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshingRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = active?.id ?? null;

  // Ms to add to Date.now() to approximate the server clock (0 = unknown /
  // device clock trusted). Refreshed on every same-origin API response.
  const [timeOffsetMs, setTimeOffsetMs] = useState(0);

  /** Same-origin fetch that also tracks the server↔device clock offset. */
  const syncedFetch = useCallback(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(input, {
        ...init,
        cache: 'no-store',
        signal: init?.signal ?? controller.signal,
      });
      const off = serverOffsetFrom(res);
      if (off !== null) setTimeOffsetMs(off);
      return res;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled || refreshingRef.current) return;
    refreshingRef.current = true;
    try {
      const data = await readJson(await syncedFetch('/api/ai/conversations'));
      setConversations(sortConversations(data.conversations ?? []));
      setError(null);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Sync timed out. Tap to retry.');
      } else if (err instanceof Error && err.message.includes('(401)')) {
        setError('Session expired. Please sign in again. Tap to retry.');
      } else {
        setError(err instanceof Error ? err.message : 'Sync failed.');
      }
    } finally {
      refreshingRef.current = false;
    }
  }, [enabled, syncedFetch]);

  // Initial load + polling sync (same account, any device) + refetch on focus.
  useEffect(() => {
    if (!enabled) {
      setConversations([]);
      setActive(null);
      setListLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setListLoading(true);
    refresh().finally(() => {
      if (!cancelled) setListLoading(false);
    });
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, POLL_MS);
    const onFocus = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, refresh]);

  const createConversation = useCallback(
    async (mode: AiConversationMode): Promise<AiConversationDetail | null> => {
      if (!enabled) return null;
      const data = await readJson(
        await syncedFetch('/api/ai/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode }),
        }),
      );
      const detail = data.conversation as AiConversationDetail;
      setConversations((prev) =>
        sortConversations([
          {
            id: detail.id,
            mode: detail.mode,
            title: detail.title,
            pinned: detail.pinned,
            created_at: detail.created_at,
            updated_at: detail.updated_at,
          },
          ...prev,
        ]),
      );
      setActive({ ...detail, messages: detail.messages ?? [] });
      return { ...detail, messages: detail.messages ?? [] };
    },
    [enabled, syncedFetch],
  );

  const selectConversation = useCallback(
    async (id: string) => {
      if (!enabled) return;
      if (activeIdRef.current === id && active) return;
      setDetailLoading(true);
      try {
        const data = await readJson(await syncedFetch(`/api/ai/conversations/${id}`));
        setActive(data.conversation as AiConversationDetail);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to open chat.');
      } finally {
        setDetailLoading(false);
      }
    },
    [enabled, active, syncedFetch],
  );

  const clearActive = useCallback(() => setActive(null), []);

  const renameConversation = useCallback(
    async (id: string, title: string) => {
      const clean = title.trim().slice(0, 120);
      if (!clean) return;
      const prev = conversations;
      setConversations((list) =>
        sortConversations(list.map((c) => (c.id === id ? { ...c, title: clean } : c))),
      );
      setActive((a) => (a && a.id === id ? { ...a, title: clean } : a));
      try {
        const data = await readJson(
          await syncedFetch(`/api/ai/conversations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: clean }),
          }),
        );
        const updated = data.conversation as AiConversation;
        setConversations((list) =>
          sortConversations(list.map((c) => (c.id === id ? updated : c))),
        );
        setActive((a) => (a && a.id === id ? { ...a, ...updated } : a));
      } catch {
        setConversations(prev);
      }
    },
    [conversations, syncedFetch],
  );

  const togglePin = useCallback(
    async (id: string, pinned: boolean) => {
      const prev = conversations;
      setConversations((list) =>
        sortConversations(list.map((c) => (c.id === id ? { ...c, pinned } : c))),
      );
      setActive((a) => (a && a.id === id ? { ...a, pinned } : a));
      try {
        await readJson(
          await syncedFetch(`/api/ai/conversations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinned }),
          }),
        );
        void refresh();
      } catch {
        setConversations(prev);
      }
    },
    [conversations, refresh, syncedFetch],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      const prev = conversations;
      setConversations((list) => list.filter((c) => c.id !== id));
      setActive((a) => (a && a.id === id ? null : a));
      try {
        await readJson(await syncedFetch(`/api/ai/conversations/${id}`, { method: 'DELETE' }));
      } catch {
        setConversations(prev);
      }
    },
    [conversations, syncedFetch],
  );

  const appendMessages = useCallback(
    async (id: string, messages: NewAiMessage[]): Promise<AiConversation | null> => {
      if (messages.length === 0) return null;
      const data = await readJson(
        await syncedFetch(`/api/ai/conversations/${id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        }),
      );
      const updated = data.conversation as AiConversation;
      const saved = (data.messages ?? []) as AiConversationDetail['messages'];
      setConversations((list) =>
        sortConversations(list.map((c) => (c.id === id ? updated : c))),
      );
      setActive((a) =>
        a && a.id === id ? { ...updated, messages: [...a.messages, ...saved] } : a,
      );
      return updated;
    },
    [syncedFetch],
  );

  return {
    conversations,
    active,
    activeId: active?.id ?? null,
    listLoading,
    detailLoading,
    error,
    /** Ms to add to Date.now() to approximate the server clock. */
    timeOffsetMs,
    refresh,
    createConversation,
    selectConversation,
    clearActive,
    renameConversation,
    togglePin,
    deleteConversation,
    appendMessages,
  };
}

export type AiConversationsStore = ReturnType<typeof useAiConversations>;
