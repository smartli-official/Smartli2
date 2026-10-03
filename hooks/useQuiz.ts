'use client';

import { useCallback, useState } from 'react';
import type { GradeResult, QuizConfig, QuizResult } from '@/types';

export type QuizPhase = 'idle' | 'generating' | 'ready' | 'error';

export function useQuiz() {
  const [phase, setPhase] = useState<QuizPhase>('idle');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState('');

  const generate = useCallback(async (config: QuizConfig): Promise<QuizResult | null> => {
    setError(null);
    setResult(null);
    setPhase('generating');
    setProgressLabel('Reading your files…');

    try {
      const form = new FormData();
      form.append(
        'config',
        JSON.stringify({
          sections: config.sections,
          sectionOrder: config.sectionOrder,
          difficulty: config.difficulty,
          model: config.model,
          extraNotes: config.extraNotes,
        })
      );
      for (const file of config.files) form.append('files', file);

      setProgressLabel('Generating your questions…');
      const res = await fetch('/api/quiz/generate', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Surface auth (401) + plan-limit (429/402) failures to the caller
        // so it can re-open the login/limit modal instead of a generic error.
        if (res.status === 401) {
          const err = new Error((data as any)?.error ?? 'You have to be logged in to use AI features.');
          (err as any).limitKind = 'auth';
          (err as any).status = res.status;
          throw err;
        }
        if (res.status === 402 || res.status === 429) {
          const err = new Error((data as any)?.error ?? 'You have hit your limits.');
          (err as any).limitKind = (data as any)?.limitKind ?? 'quizzes';
          (err as any).status = res.status;
          throw err;
        }
        const files = Array.isArray(data.files) ? data.files : [];
        const failed = files.filter((f: any) => f.status === 'failed');
        const detail = failed.length
          ? ` ${failed.map((f: any) => `${f.name}: ${f.error ?? 'could not be parsed'}`).join(' ')}`
          : '';
        throw new Error(`${data.error ?? 'Quiz generation failed.'}${detail}`);
      }

      const quizResult = data as QuizResult;
      setResult(quizResult);
      setPhase('ready');
      return quizResult;
    } catch (err: any) {
      // Re-throw auth/limit errors so the call-site can show the right modal.
      if ((err as any)?.status === 401 || (err as any)?.status === 402 || (err as any)?.status === 429 || (err as any)?.limitKind) throw err;
      setError(err?.message ?? 'Quiz generation failed. Please try again.');
      setPhase('error');
      return null;
    } finally {
      setProgressLabel('');
    }
  }, []);

  const grade = useCallback(
    async (question: string, modelAnswer: string, userAnswer: string, model: QuizConfig['model']): Promise<GradeResult> => {
      const res = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, modelAnswer, userAnswer, model }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          const err = new Error((data as any)?.error ?? 'You have to be logged in to use AI features.');
          (err as any).limitKind = 'auth';
          (err as any).status = res.status;
          throw err;
        }
        throw new Error(data.error ?? 'Grading failed.');
      }
      return data as GradeResult;
    },
    []
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
    setProgressLabel('');
  }, []);

  /** Restore a previously generated quiz (e.g. from a synced conversation). */
  const restore = useCallback((saved: QuizResult) => {
    setResult(saved);
    setError(null);
    setProgressLabel('');
    setPhase('ready');
  }, []);

  return { phase, result, error, progressLabel, generate, grade, reset, restore };
}
