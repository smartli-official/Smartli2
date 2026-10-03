'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { AiSidebar } from '@/components/ai/ai-sidebar';
import { ChatInterface, type FreshRequest } from '@/components/ai/chat-interface';
import { useAiConversations } from '@/hooks/useAiConversations';
import type { PromptMode } from '@/components/ui/prompt-input-box';

/** Static skeleton identical on server + first client render (no hydration drift). */
function AiPageSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background border-t border-border/40">
      <div className="hidden w-72 shrink-0 flex-col gap-3 border-r border-white/20 bg-background/60 p-4 sm:flex" aria-hidden="true">
        <div className="h-11 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="h-11 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="mt-4 h-px bg-border/60" />
        <div className="mt-2 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6" aria-hidden="true">
        <div className="h-12 w-12 animate-pulse rounded-xl bg-white/[0.08]" />
        <div className="h-6 w-56 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="h-32 w-full max-w-4xl animate-pulse rounded-[32px] bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { isSignedIn, isLoaded } = useUser();
  const store = useAiConversations(isSignedIn ?? false);
  const [freshRequest, setFreshRequest] = useState<FreshRequest | null>(null);
  // Gate user/time-dependent UI until after mount: the prerendered HTML is
  // auth-agnostic, but Clerk state + relative timestamps differ per viewer.
  // Rendering the skeleton on both sides keeps hydration byte-identical.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const requestFresh = useCallback((mode: PromptMode) => {
    setFreshRequest((prev) => ({ key: (prev?.key ?? 0) + 1, mode }));
  }, []);

  if (!mounted) return <AiPageSkeleton />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background border-t border-border/40">
      <AiSidebar
        signedIn={!!isSignedIn}
        authLoaded={isLoaded}
        conversations={store.conversations}
        activeId={store.activeId}
        loading={store.listLoading}
        detailLoading={store.detailLoading}
        syncError={store.error}
        // Server-anchored "now" so sidebar ages stay truthful even if the
        // device clock has drifted.
        nowMs={Date.now() + store.timeOffsetMs}
        onSelect={(id) => void store.selectConversation(id)}
        onNewChat={() => requestFresh('explainer')}
        onNewQuiz={() => requestFresh('quiz')}
        onRename={(id, title) => void store.renameConversation(id, title)}
        onTogglePin={(id, pinned) => void store.togglePin(id, pinned)}
        onDelete={(id) => void store.deleteConversation(id)}
        onRetrySync={() => void store.refresh()}
      />
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={null}>
          <ChatInterface
            store={store}
            syncEnabled={!!isSignedIn}
            signedIn={!!isSignedIn}
            authLoaded={isLoaded}
            freshRequest={freshRequest}
          />
        </Suspense>
      </main>
    </div>
  );
}
