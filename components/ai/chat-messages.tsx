'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, BrainCog, Check, ChevronDown, Copy, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownContent } from './math-markdown';
import type { ChatTurn } from '@/hooks/useChatStream';
import { AI_MODELS } from '@/lib/ai/config';

interface ChatMessagesProps {
  messages: ChatTurn[];
  streamingId: string | null;
  error: Error | null;
  /** True while Exa pre-search is running (Search toggle on). */
  searching?: boolean;
}

export function ChatMessages({ messages, streamingId, error, searching }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="mx-auto h-full w-full max-w-3xl overflow-y-auto px-4 pb-56 pt-10 sm:px-6"
    >
      <div className="flex flex-col gap-7">
        {messages.map((m) => (
          <Message key={m.id} turn={m} isStreaming={streamingId === m.id} searching={searching} />
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="font-semibold">Something went wrong</div>
            <div className="mt-0.5 opacity-90">{error.message}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Message({ turn, isStreaming, searching }: { turn: ChatTurn; isStreaming: boolean; searching?: boolean }) {
  const isUser = turn.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="flex w-full justify-end"
      >
        <div className="max-w-[75%] whitespace-pre-wrap rounded-3xl bg-zinc-950/[0.07] px-5 py-3 text-[15px] leading-relaxed text-zinc-950 dark:bg-[#2f2f31] dark:text-gray-100">
          {turn.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="w-full"
    >
      {turn.thinking && (
        <ThinkingBlock thinking={turn.thinking} streaming={isStreaming} />
      )}
      {turn.content ? (
        <MarkdownContent content={turn.content} />
      ) : (
        isStreaming && (searching ? <SearchingWeb /> : turn.think ? <ThinkingIndicator /> : <ThinkingDots />)
      )}
      {isStreaming && turn.content && (
        <span className="mt-2 inline-block h-4 w-2 animate-pulse rounded-sm bg-zinc-400 align-middle dark:bg-white/60" />
      )}
      {!isStreaming && turn.sources && turn.sources.length > 0 && (
        <SearchSources sources={turn.sources} />
      )}
      {!isStreaming && turn.content && <MessageActions content={turn.content} />}
    </motion.div>
  );
}

function formatSourceDate(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso.slice(0, 10);
  return new Date(t).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function SearchSources({
  sources,
}: {
  sources: NonNullable<ChatTurn['sources']>;
}) {
  const [open, setOpen] = React.useState(false);
  const shown = open ? sources : sources.slice(0, 3);
  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5 text-[#1EAEDB]" />
        Sources · {sources.length}
        <span className="ml-auto text-[11px] normal-case tracking-normal">
          {open ? 'Show less' : sources.length > 3 ? 'Show all' : ''}
        </span>
      </button>
      <ul className="mt-3 space-y-2.5">
        {shown.map((s, i) => (
          <li key={`${s.url}-${i}`} className="flex gap-2.5 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#1EAEDB]/15 text-[11px] font-bold text-[#1EAEDB]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate font-medium text-foreground underline-offset-2 hover:underline"
              >
                {s.title || s.url}
              </a>
              {s.publishedDate && (
                <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                  {formatSourceDate(s.publishedDate)}
                </p>
              )}
              {s.snippet && (
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {s.snippet}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s] dark:bg-white/50" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s] dark:bg-white/50" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 dark:bg-white/50" />
    </div>
  );
}

function SearchingWeb() {
  return (
    <div
      className="flex items-center gap-2 py-2 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Globe className="h-4 w-4 animate-pulse text-[#1EAEDB]" />
      <span>Searching the web…</span>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div
      className="flex items-center gap-2 py-2 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <BrainCog className="h-4 w-4 animate-pulse text-[#8B5CF6]" />
      <span>Thinking…</span>
    </div>
  );
}

/** Collapsible step-by-step reasoning (Think mode). Open while streaming, collapsed once done. */
function ThinkingBlock({ thinking, streaming }: { thinking: string; streaming: boolean }) {
  const [open, setOpen] = React.useState(true);

  // Auto-collapse when the answer starts streaming in / finishes.
  useEffect(() => {
    if (!streaming) setOpen(false);
    else setOpen(true);
  }, [streaming]);

  return (
    <div className="mb-3 rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <BrainCog className={cn('h-3.5 w-3.5 text-[#8B5CF6]', streaming && 'animate-pulse')} />
        {streaming ? 'Thinking…' : 'Thought process'}
        <ChevronDown className={cn('ml-auto h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto whitespace-pre-wrap px-4 pb-3 text-[13px] leading-relaxed text-muted-foreground">
              {thinking}
              {streaming && <span className="ml-1 inline-block h-3 w-1.5 animate-pulse rounded-sm bg-[#8B5CF6]/60 align-middle" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageActions({ content }: { content: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="mt-3 flex items-center gap-1 text-muted-foreground">
      <button
        onClick={copy}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Copy response"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export { MarkdownContent };
