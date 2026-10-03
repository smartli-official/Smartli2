'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { InlineMath } from '@/components/ai/math-markdown';
import type { GradeResult, GradeVerdict, QuizConfig, QuizItem, QuizResult } from '@/types';

interface QuizRunnerProps {
  result: QuizResult;
  config: QuizConfig;
  onGrade: (question: string, modelAnswer: string, userAnswer: string) => Promise<GradeResult>;
  onNewQuiz: () => void;
  onRetry: () => void;
  onFinishedChange?: (finished: boolean) => void;
  /** External pause (e.g. floating timer button) — freezes the countdown. */
  paused?: boolean;
}

interface FlatQuestion {
  sectionTitle: string;
  sectionKey: string;
  question: QuizItem;
}

type AnswerState =
  | { status: 'unanswered' }
  | { status: 'mcq-answered'; picked: number }
  | { status: 'graded'; verdict: GradeVerdict; feedback: string; userAnswer: string };

const VERDICT_LABEL: Record<GradeVerdict, string> = {
  correct: 'Correct',
  partial: 'Partially correct',
  incorrect: 'Not quite',
};

export function QuizRunner({ result, config, onGrade, onNewQuiz, onRetry, onFinishedChange, paused = false }: QuizRunnerProps) {
  const flat: FlatQuestion[] = useMemo(
    () =>
      result.sections.flatMap((s) =>
        s.questions.map((q) => ({
          sectionTitle: s.title,
          sectionKey: s.key,
          question: q,
        }))
      ),
    [result]
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    config.timeLimitMinutes !== null ? config.timeLimitMinutes * 60 : null
  );

  const current = flat[index];
  const currentState: AnswerState = current ? answers[current.question.id] ?? { status: 'unanswered' } : { status: 'unanswered' };
  const answeredCount = flat.filter((f) => {
    const a = answers[f.question.id];
    return a && a.status !== 'unanswered';
  }).length;

  useEffect(() => {
    setPicked(null);
    setDraft('');
    setGradeError(null);
  }, [index]);

  useEffect(() => {
    if (secondsLeft === null || finished || paused) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => (s !== null ? s - 1 : s)), 1000);
    return () => window.clearTimeout(t);
  }, [secondsLeft, finished, paused]);

  useEffect(() => {
    onFinishedChange?.(finished);
  }, [finished, onFinishedChange]);

  if (!current) return null;

  const totalSeconds =
    config.timeLimitMinutes !== null ? Math.max(1, Math.round(config.timeLimitMinutes * 60)) : null;
  const timeFraction =
    totalSeconds !== null && secondsLeft !== null
      ? Math.min(1, Math.max(0, secondsLeft / totalSeconds))
      : 0;
  const timeLow = secondsLeft !== null && secondsLeft < 60;
  const RING_C = 2 * Math.PI * 26;

  const isMcq = current.sectionKey === 'mcq' && current.question.options;

  const score = flat.reduce((total, f) => {
    const a = answers[f.question.id];
    if (!a || a.status === 'unanswered') return total;
    if (a.status === 'mcq-answered') {
      return total + (a.picked === f.question.correctIndex ? 1 : 0);
    }
    return total + (a.verdict === 'correct' ? 1 : a.verdict === 'partial' ? 0.5 : 0);
  }, 0);

  const sectionScores = result.sections.map((s) => {
    const items = flat.filter((f) => f.sectionKey === s.key);
    const earned = items.reduce((total, f) => {
      const a = answers[f.question.id];
      if (!a || a.status === 'unanswered') return total;
      if (a.status === 'mcq-answered') return total + (a.picked === f.question.correctIndex ? 1 : 0);
      return total + (a.verdict === 'correct' ? 1 : a.verdict === 'partial' ? 0.5 : 0);
    }, 0);
    return { title: s.title, earned, total: items.length };
  });

  const pickOption = (optionIndex: number) => {
    if (currentState.status !== 'unanswered') return;
    setPicked(optionIndex);
    setAnswers((prev) => ({ ...prev, [current.question.id]: { status: 'mcq-answered', picked: optionIndex } }));
  };

  const checkWritten = async () => {
    if (!draft.trim() || grading || currentState.status !== 'unanswered') return;
    setGrading(true);
    setGradeError(null);
    try {
      const g = await onGrade(current.question.prompt, current.question.modelAnswer ?? '', draft.trim());
      setAnswers((prev) => ({
        ...prev,
        [current.question.id]: { status: 'graded', verdict: g.verdict, feedback: g.feedback, userAnswer: draft.trim() },
      }));
    } catch (err: any) {
      setGradeError(err?.message ?? 'Grading failed. Your answer is saved above — compare it with the model answer.');
    } finally {
      setGrading(false);
    }
  };

  const goNext = () => {
    if (index + 1 >= flat.length) setFinished(true);
    else setIndex(index + 1);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (finished) {
    return (
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-background/80 text-left shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-border/60 px-6 py-6 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Results</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {score} / {flat.length}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {answeredCount} of {flat.length} answered · {config.difficulty}
          </p>
        </div>
        <div className="max-h-[min(60vh,600px)] space-y-6 overflow-y-auto px-6 py-6 sm:px-10">
          <div className="grid gap-2 sm:grid-cols-2">
            {sectionScores.map((s) => (
              <div key={s.title} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/30 px-4 py-3">
                <span className="text-sm text-foreground">{s.title}</span>
                <span className="text-sm font-semibold tabular-nums text-foreground">{s.earned} / {s.total}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {flat.map((f, i) => {
              const a = answers[f.question.id];
              const right =
                a?.status === 'mcq-answered'
                  ? a.picked === f.question.correctIndex
                  : a?.status === 'graded'
                    ? a.verdict === 'correct'
                    : null;
              return (
                <div key={f.question.id} className="rounded-2xl border border-border/60 bg-card/20 p-4">
                  <div className="flex items-start gap-2">
                    {right === true && <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />}
                    {right === false && <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
                    {right === null && <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-border" />}
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Q{i + 1} · {f.sectionTitle}</p>
                      <p className="mt-1 text-sm text-foreground"><InlineMath text={f.question.prompt} /></p>
                      {a?.status === 'graded' && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          <span className="text-foreground">Your answer:</span> {a.userAnswer}
                        </p>
                      )}
                      {f.question.options && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          <span className="text-foreground">Correct:</span>{' '}
                          <InlineMath text={f.question.options[f.question.correctIndex ?? 0]} />
                        </p>
                      )}
                      {f.question.modelAnswer && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          <span className="text-foreground">Model answer:</span>{' '}
                          <InlineMath text={f.question.modelAnswer} />
                        </p>
                      )}
                      {(a?.status === 'graded' || (a?.status === 'mcq-answered' && f.question.explanation)) && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {a.status === 'graded' ? <InlineMath text={a.feedback} /> : <InlineMath text={f.question.explanation!} />}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-border/60 px-6 py-5 sm:flex-row sm:justify-end sm:px-10">
          <Button type="button" variant="ghost" onClick={onNewQuiz}>New quiz</Button>
          <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-background/80 text-left shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="border-b border-border/60 px-6 py-5 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Question {index + 1} of {flat.length} · {current.sectionTitle} · {config.difficulty}
            </p>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-[width] duration-200"
                style={{ width: `${(answeredCount / flat.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {secondsLeft !== null && (
              <span
                role="timer"
                aria-label={`Time remaining: ${formatTime(secondsLeft)}`}
                className={cn(
                  'flex items-center gap-2 rounded-full border border-border/70 py-1 pl-1 pr-3 font-mono text-sm tabular-nums',
                  timeLow ? 'border-red-400/50 text-red-500 dark:text-red-300' : 'text-foreground'
                )}
              >
                <span className="relative h-7 w-7 shrink-0" aria-hidden="true">
                  <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
                    <circle cx="32" cy="32" r={26} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                    <circle
                      cx="32"
                      cy="32"
                      r={26}
                      fill="none"
                      stroke={timeLow ? '#f87171' : '#34d399'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      strokeDashoffset={RING_C * (1 - timeFraction)}
                    />
                  </svg>
                </span>
                {formatTime(secondsLeft)}
              </span>
            )}
            <button type="button" onClick={onNewQuiz} className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground" aria-label="Exit quiz">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {result.material.summary && (
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground"><InlineMath text={result.material.summary} /></p>
        )}
      </div>

      <div className="max-h-[min(60vh,600px)] space-y-5 overflow-y-auto px-6 py-6 sm:px-10">
        <h2 className="text-lg font-medium leading-7 text-foreground"><InlineMath text={current.question.prompt} /></h2>

        {isMcq ? (
          <div className="space-y-2">
            {current.question.options!.map((option, i) => {
              const revealed = currentState.status !== 'unanswered';
              const isCorrect = i === current.question.correctIndex;
              const isPicked = picked === i;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => pickOption(i)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors',
                    !revealed && 'border-border/70 bg-card/20 text-foreground hover:border-foreground/30 hover:bg-card/40',
                    revealed && isCorrect && 'border-emerald-300/50 bg-emerald-400/10 text-foreground',
                    revealed && isPicked && !isCorrect && 'border-red-400/50 bg-red-400/10 text-foreground',
                    revealed && !isPicked && !isCorrect && 'border-border/60 text-muted-foreground'
                  )}
                >
                  <span className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                    revealed && isCorrect ? 'border-emerald-300 text-emerald-300' : 'border-border text-muted-foreground'
                  )}>
                    {revealed && isCorrect ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span><InlineMath text={option} /></span>
                </button>
              );
            })}
            {currentState.status !== 'unanswered' && current.question.explanation && (
              <p className="rounded-2xl border border-border/60 bg-card/30 px-4 py-3 text-sm leading-6 text-muted-foreground">
                <InlineMath text={current.question.explanation} />
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={currentState.status !== 'unanswered'}
              rows={5}
              placeholder="Write your answer here…"
              className="w-full resize-y rounded-2xl border border-border/70 bg-card/30 px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-foreground/40 disabled:opacity-70"
            />
            {gradeError && (
              <p className="flex items-start gap-2 rounded-2xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {gradeError}
              </p>
            )}
            {currentState.status === 'graded' ? (
              <div className="space-y-3">
                <p className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
                  currentState.verdict === 'correct' && 'border-emerald-300/50 text-emerald-300',
                  currentState.verdict === 'partial' && 'border-amber-300/50 text-amber-300',
                  currentState.verdict === 'incorrect' && 'border-red-400/50 text-red-300'
                )}>
                  {VERDICT_LABEL[currentState.verdict]}
                </p>
                <p className="text-sm leading-6 text-muted-foreground"><InlineMath text={currentState.feedback} /></p>
                {current.question.modelAnswer && (
                  <p className="rounded-2xl border border-border/60 bg-card/30 px-4 py-3 text-sm leading-6 text-muted-foreground">
                    <span className="text-foreground">Model answer:</span>{' '}
                    <InlineMath text={current.question.modelAnswer} />
                  </p>
                )}
              </div>
            ) : (
              <Button type="button" onClick={checkWritten} disabled={!draft.trim() || grading}>
                {grading ? 'Checking…' : 'Check my answer'}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-6 py-4 sm:px-10">
        <button
          type="button"
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Button type="button" onClick={goNext} disabled={currentState.status === 'unanswered'} className="gap-1.5">
          {index + 1 >= flat.length ? 'See results' : 'Next'} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
