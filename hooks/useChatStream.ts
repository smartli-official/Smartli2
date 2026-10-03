'use client';

import { useCallback, useRef, useState } from 'react';
import { AIRequest, filterAIStream, type ChatMessage } from '@/lib/ai/config';

export type ChatRole = 'user' | 'assistant';

export type SearchSource = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
};

export type ChatTurn = {
  id: string;
  role: ChatRole;
  content: string;
  model?: string;
  /** Exa web sources grounding this assistant turn (if Search was used). */
  sources?: SearchSource[];
  /** Step-by-step reasoning for this turn (if Think was used). */
  thinking?: string;
  /** True when this assistant turn was generated with Think mode on. */
  think?: boolean;
};

/**
 * Split a raw accumulated stream into `{ thinking, content }`.
 * Collects every <think>...</think> block (including an unclosed trailing
 * block mid-stream) into `thinking`; everything else is the answer.
 * Non-think turns keep using `filterAIStream` instead.
 */
export function splitThink(acc: string): { thinking: string; content: string } {
  let thinking = '';
  const content = acc.replace(/<think>([\s\S]*?)(?:<\/think>|$)/gi, (_m, inner: string) => {
    const t = (inner ?? '').trim();
    if (t) thinking += (thinking ? '\n\n' : '') + t;
    return '';
  });
  return { thinking, content: content.trimStart() };
}

export function useChatStream() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setStreamingId(null);
    setIsLoading(false);
    setSearching(false);
    setError(null);
  }, []);

  /** Replace the thread (e.g. when opening a synced conversation). */
  const load = useCallback((turns: ChatTurn[]) => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages(turns);
    setStreamingId(null);
    setIsLoading(false);
    setSearching(false);
    setError(null);
  }, []);

  const send = useCallback(async (request: AIRequest): Promise<{
    userContent: string;
    assistantContent: string;
    thinking?: string;
    model: string;
    sources?: SearchSource[];
  } | null> => {
    setError(null);
    const displayContent =
      request.attachments && request.attachments.length > 0
        ? request.prompt
          ? `${request.prompt}\n\n📎 ${request.attachments.join(', ')}`
          : `📎 ${request.attachments.join(', ')}`
        : request.prompt;
    const userTurn: ChatTurn = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: displayContent,
    };
    const assistantTurn: ChatTurn = {
      id: `a_${Date.now()}`,
      role: 'assistant',
      content: '',
      model: request.model,
      ...(request.think === true ? { think: true as const } : {}),
    };

    setMessages((prev) => [...prev, userTurn, assistantTurn]);
    setStreamingId(assistantTurn.id);
    setIsLoading(true);

    const history: ChatMessage[] = [...messages, userTurn].map((m) => ({
      role: m.role,
      content: m.content
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // If Search was requested, fetch Exa sources first so the UI can show
      // them under the answer. The server also re-grounds via gateway as a
      // fallback, so a failure here never blocks the chat.
      let sources: SearchSource[] | undefined;
      let enrichedRequest = request;
      if (request.search === true) {
        setSearching(true);
        try {
          const searchRes = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: request.prompt, numResults: 6 }),
            signal: controller.signal,
          });
          if (searchRes.ok) {
            const data = (await searchRes.json()) as { results?: SearchSource[] };
            if (data.results?.length) {
              sources = data.results;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantTurn.id ? { ...m, sources } : m,
                ),
              );
              const searchBlock =
                `Live web results for "${request.prompt}" (cite as [1], [2], ... with markdown links):\n\n` +
                sources
                  .map(
                    (r, i) =>
                      `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet || '(no snippet)'}`,
                  )
                  .join('\n\n');
              enrichedRequest = {
                ...request,
                context: request.context
                  ? `${request.context}\n\n${searchBlock}`
                  : searchBlock,
              };
            }
          } else if (searchRes.status === 503) {
            // EXA_API_KEY missing — fall through to ungrounded answer.
            console.warn('Search requested but EXA_API_KEY is not configured.');
          }
        } catch (searchErr: any) {
          if (searchErr?.name === 'AbortError') throw searchErr;
          console.warn('Exa pre-search failed, continuing ungrounded.', searchErr);
        } finally {
          setSearching(false);
        }
      }

      const res = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...enrichedRequest, history }),
        signal: controller.signal
      });

      if (!res.ok || !res.body) {
        const errData = (await res.json().catch(() => ({}))) as {
          error?: string;
          limitKind?: string;
        };
        if (res.status === 401) {
          const err = new Error(errData.error || 'You have to be logged in to use AI features.');
          (err as any).limitKind = 'auth';
          (err as any).status = res.status;
          throw err;
        }
        if (res.status === 402 || res.status === 429) {
          const err = new Error(errData.error || 'You have hit your limits.');
          (err as any).limitKind = errData.limitKind ?? 'messages';
          (err as any).status = res.status;
          throw err;
        }
        throw new Error(errData.error || `AI streaming failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      // Think turns preserve <think> blocks (split live); all other turns
      // strip them via filterAIStream as before. GPT OSS models never set
      // `think`, so they always take the fast strip path.
      const useThink = request.think === true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (useThink) {
          const { thinking, content } = splitThink(acc);
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantTurn.id ? { ...m, content, thinking } : m))
          );
        } else {
          const filtered = filterAIStream(acc);
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantTurn.id ? { ...m, content: filtered } : m))
          );
        }
      }

      const { thinking: finalThinking, content: finalContent } = useThink
        ? splitThink(acc)
        : { thinking: '', content: filterAIStream(acc) };
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantTurn.id
            ? { ...m, content: finalContent, ...(finalThinking ? { thinking: finalThinking } : {}) }
            : m,
        )
      );
      // `sources` was attached to the assistant turn via setMessages above
      // (and survives streaming updates since they spread `...m`). Return the
      // closure value directly — reading it back via a setState updater would
      // run on the next render, i.e. after this return.
      return {
        userContent: userTurn.content,
        assistantContent: finalContent,
        ...(finalThinking ? { thinking: finalThinking } : {}),
        model: request.model ?? '',
        sources,
      };
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        // Let limit/auth errors bubble so the call-site can open the Sorry!
        // or login modal instead of just showing an inline error.
        if ((err as any)?.status === 401 || (err as any)?.status === 402 || (err as any)?.status === 429 || (err as any)?.limitKind) throw err;
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      }
      return null;
    } finally {
      setIsLoading(false);
      setStreamingId(null);
      abortRef.current = null;
    }
  }, [messages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, streamingId, isLoading, searching, error, send, stop, reset, load };
}
