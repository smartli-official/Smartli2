'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAIStream } from '@/hooks/useAIStream';
import { StreamingResponse } from '@/components/ai/StreamingResponse';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Send, Sparkles, GraduationCap, Loader2, Pause } from 'lucide-react';
import { AIExplainerMode } from '@/types';
import { usePlanUsage } from '@/hooks/usePlanUsage';
import { LimitReachedModal } from '@/components/plan/LimitReachedModal';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';

export default function ExplainerPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIExplainerMode>('explainer');
  const { streamText, isLoading, error, isComplete, startStream, stopStream } = useAIStream();
  const { plan, nextResetLabel } = usePlanUsage();
  const [limitOpen, setLimitOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) setLoginOpen(true);
  }, [isLoaded, isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!isSignedIn) {
      setLoginOpen(true);
      return;
    }

    try {
      await startStream({
        prompt: input,
        mode: mode,
      });
    } catch (err: any) {
      if (err?.status === 401 || err?.limitKind === 'auth') {
        setLoginOpen(true);
      } else if (err?.status === 402 || err?.status === 429 || err?.limitKind) {
        setLimitOpen(true);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col h-[calc(100vh-2rem)]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="text-primary" /> AI Explainer
          </h1>
          <p className="text-muted-foreground">Deep dive into any topic with pedagogical precision.</p>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-full">
          {(['explainer', 'tutor', 'eli5'] as AIExplainerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                mode === m
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {m === 'explainer' && 'Explainer'}
              {m === 'tutor' && 'Tutor'}
              {m === 'eli5' && 'ELI5'}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4">
        {!streamText && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <GraduationCap size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground max-w-sm">
              Ask me to explain a complex concept, or paste your notes to get a deep dive.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm">
            {error.message}
          </div>
        )}

        {streamText && (
          <Card className="p-6 shadow-sm animate-fade-in border-border/50">
            <StreamingResponse text={streamText} />
          </Card>
        )}

        {isLoading && !streamText && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        )}
      </main>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'tutor'
              ? "Ask a follow-up question..."
              : mode === 'eli5'
              ? "What should I explain simply?"
              : "What do you want to learn today?"
          }
          className="pr-16 h-14 rounded-2xl focus:ring-primary"
        />
        <div className="absolute right-2 top-2">
          {isLoading ? (
            <Button variant="default" size="sm" className="w-10 h-10 p-0 rounded-full" onClick={stopStream}>
              <Pause size={18} />
            </Button>
          ) : (
            <Button variant="default" size="sm" className="w-10 h-10 p-0 rounded-full" type="submit">
              <Send size={18} />
            </Button>
          )}
        </div>
      </form>
      {limitOpen && (
        <LimitReachedModal
          open
          kind="messages"
          planName={plan.name}
          resetLabel={nextResetLabel}
          onClose={() => setLimitOpen(false)}
        />
      )}
      {loginOpen && (
        <LoginRequiredModal open onClose={() => setLoginOpen(false)} />
      )}
    </div>
  );
}
