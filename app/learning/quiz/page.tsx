'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAIStream } from '@/hooks/useAIStream';
import { StreamingResponse } from '@/components/ai/StreamingResponse';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FileText, ListChecks, BrainCircuit, BookOpen, Loader2, Send, Pause } from 'lucide-react';
import { QuizType } from '@/types';
import { usePlanUsage } from '@/hooks/usePlanUsage';
import { LimitReachedModal } from '@/components/plan/LimitReachedModal';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';

export default function QuizPage() {
  const [input, setInput] = useState('');
  const [quizType, setQuizType] = useState<QuizType>('mcq');
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
        prompt: `Generate a ${quizType} quiz based on the following content. Please follow a pedagogical progression from basic recall to higher-order analysis.`,
        context: input,
        mode: 'quiz',
        quizType: quizType,
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
            <ListChecks className="text-primary" /> AI Quiz Generator
          </h1>
          <p className="text-muted-foreground">Turn your notes into a quiz.</p>
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-full">
          {(['mcq', 'exam', 'competency', 'reasoning'] as QuizType[]).map((t) => (
            <button
              key={t}
              onClick={() => setQuizType(t)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                quizType === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'mcq' && 'MCQ'}
              {t === 'exam' && 'Exam'}
              {t === 'competency' && 'Competency'}
              {t === 'reasoning' && 'Reasoning'}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4">
        {!streamText && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <BrainCircuit size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground max-w-sm">
              Paste your notes or a document's text here to generate a structured quiz.
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
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your notes here..."
          className="pr-16 min-h-[120px] resize-none rounded-2xl focus:ring-primary"
        />
        <div className="absolute right-3 bottom-3">
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
