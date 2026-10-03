'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStream } from '@/hooks/useChatStream';
import type { AiConversationsStore } from '@/hooks/useAiConversations';
import { AI_MODELS, type AIModelId } from '@/lib/ai/config';
import { useQuiz } from '@/hooks/useQuiz';
import { usePlanUsage } from '@/hooks/usePlanUsage';
import { LimitReachedModal, type LimitKind } from '@/components/plan/LimitReachedModal';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { collapseDock } from '@/components/navigation/app-dock';
import type { QuizConfig, QuizResult, TimerCorner } from '@/types';
import type { PromptMode } from '@/components/ui/prompt-input-box';

// Heavy, rarely-needed-first-paint chunks load on demand so /ai paints fast.
// The empty-state input is tiny; quiz + history + timers hydrate after.
const PromptInputBox = dynamic(
  () => import('@/components/ui/prompt-input-box').then((m) => m.PromptInputBox),
  { ssr: false, loading: () => <div className="h-32 animate-pulse rounded-[32px] bg-white/[0.04]" /> },
);
const PromptModeToggle = dynamic(
  () => import('@/components/ui/prompt-input-box').then((m) => m.PromptModeToggle),
  { ssr: false },
);
const ChatMessages = dynamic(
  () => import('./chat-messages').then((m) => m.ChatMessages),
  { ssr: false, loading: () => null },
);
const QuizCreatePanel = dynamic(
  () => import('./quiz/QuizCreatePanel').then((m) => m.QuizCreatePanel),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-3xl bg-white/[0.04]" /> },
);
const QuizRunner = dynamic(
  () => import('./quiz/QuizRunner').then((m) => m.QuizRunner),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-3xl bg-white/[0.04]" /> },
);
const QuizTimer = dynamic(
  () => import('./quiz/QuizTimer').then((m) => m.QuizTimer),
  { ssr: false, loading: () => null },
);

const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  sections: {
    mcq: { enabled: true, count: 5 },
    competency: { enabled: true, count: 3 },
    critical: { enabled: true, count: 2 },
    justification: { enabled: true, count: 2 },
  },
  sectionOrder: ['mcq', 'competency', 'critical', 'justification'],
  difficulty: 'Medium',
  model: AI_MODELS[0].id,
  extraNotes: '',
  timeLimitMinutes: null,
  timerCorner: 'top-left',
  files: [],
};

export interface FreshRequest {
  key: number;
  mode: PromptMode;
}

function isTimerCorner(value: unknown): value is TimerCorner {
  return (
    value === 'top-left' ||
    value === 'top-right' ||
    value === 'bottom-left' ||
    value === 'bottom-right'
  );
}

/** Pull persisted Exa sources out of a synced message's meta (if any). */
function extractSources(
  meta: unknown,
): { title: string; url: string; snippet: string; publishedDate?: string }[] | undefined {
  if (typeof meta !== 'object' || meta === null) return undefined;
  const sources = (meta as Record<string, unknown>).sources;
  if (!Array.isArray(sources)) return undefined;
  const clean = sources
    .filter(
      (s): s is { title: string; url: string; snippet: string; publishedDate?: string } =>
        typeof s === 'object' &&
        s !== null &&
        typeof (s as Record<string, unknown>).url === 'string',
    )
    .map((s) => ({
      title: typeof s.title === 'string' ? s.title : s.url,
      url: s.url,
      snippet: typeof s.snippet === 'string' ? s.snippet : '',
      ...(typeof s.publishedDate === 'string' ? { publishedDate: s.publishedDate } : {}),
    }));
  return clean.length > 0 ? clean : undefined;
}

/** Pull persisted thinking out of a synced message's meta (if any). */
function extractThinking(meta: unknown): string | undefined {
  if (typeof meta !== 'object' || meta === null) return undefined;
  const t = (meta as Record<string, unknown>).thinking;
  return typeof t === 'string' && t ? t : undefined;
}

/** Human-readable summary stored as the user turn of a quiz session. */
function quizTopicFromConfig(config: QuizConfig): string {
  const bits: string[] = [];
  if (config.extraNotes.trim()) bits.push(config.extraNotes.trim().slice(0, 200));
  if (config.files.length > 0) {
    bits.push(`Files: ${config.files.map((f) => f.name).join(', ').slice(0, 200)}`);
  }
  const total = Object.values(config.sections).reduce(
    (n, s) => n + (s.enabled ? s.count : 0),
    0,
  );
  const topic = bits.length > 0 ? bits.join(' | ') : 'Quiz practice';
  return `Quiz practice (${config.difficulty}, ${total} questions): ${topic}`.slice(0, 500);
}

export function ChatInterface({
  store,
  syncEnabled,
  signedIn = true,
  authLoaded = true,
  freshRequest,
}: {
  store: AiConversationsStore;
  syncEnabled: boolean;
  /** False for logged-out visitors — all AI API calls are disabled. */
  signedIn?: boolean;
  /** Clerk auth load state — avoids flashing the login modal mid-restore. */
  authLoaded?: boolean;
  freshRequest: FreshRequest | null;
}) {
  const [mode, setMode] = useState<PromptMode>('explainer');
  const [showQuizPanel, setShowQuizPanel] = useState(false);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(DEFAULT_QUIZ_CONFIG);
  const reduceMotion = useReducedMotion();
  const [model, setModel] = useState<AIModelId>(AI_MODELS[0].id);
  const { messages, streamingId, isLoading, searching, error, send, stop, reset, load } = useChatStream();
  const quiz = useQuiz();
  const { restore: restoreQuiz, reset: resetQuiz } = quiz;
  const quizActive = quiz.phase === 'generating' || quiz.phase === 'ready';
  // Tracks the runner's internal finished state so the floating corner timer
  // freezes on the results screen instead of draining behind it.
  const [quizFinished, setQuizFinished] = useState(false);
  // Manual pause from the floating donut's center button — shared with the
  // runner so both countdowns freeze together.
  const [timerManuallyPaused, setTimerManuallyPaused] = useState(false);
  useEffect(() => {
    setQuizFinished(false);
    setTimerManuallyPaused(false);
  }, [quiz.result]);
  const searchParams = useSearchParams();
  // Hard usage gate: when a bucket is exhausted we never call the API —
  // we open the Sorry! modal instead.
  const { plan, canUse, bump, nextResetLabel } = usePlanUsage();
  const [limitKind, setLimitKind] = useState<LimitKind | null>(null);
  // Logged-out visitors get the login popup on arrival (once Clerk has
  // resolved) and every API call stays disabled until they sign in.
  const [loginOpen, setLoginOpen] = useState(false);
  useEffect(() => {
    if (authLoaded && !signedIn) setLoginOpen(true);
  }, [authLoaded, signedIn]);

  // Which synced conversation is currently loaded here (null = fresh local).
  const loadedConvId = useRef<string | null>(null);
  // Last quiz result already persisted (avoids double-saving on re-renders).
  const persistedQuizRef = useRef<QuizResult | null>(null);
  // Config snapshot from the generate call (panel state may change after).
  const lastQuizConfigRef = useRef<QuizConfig | null>(null);
  const lastFreshKey = useRef(0);

  // Load the selected synced conversation (both modes).
  useEffect(() => {
    const conv = store.active;
    if (!conv) {
      if (loadedConvId.current !== null) {
        // Active conversation was deleted elsewhere — start fresh.
        loadedConvId.current = null;
        persistedQuizRef.current = null;
        reset();
        resetQuiz();
        setMode('explainer');
        setShowQuizPanel(false);
      }
      return;
    }
    if (conv.id === loadedConvId.current) return;
    loadedConvId.current = conv.id;
    persistedQuizRef.current = null;

    if (conv.mode === 'quiz') {
      load([]);
      reset();
      setMode('quiz');
      const quizMsg = [...conv.messages]
        .reverse()
        .find(
          (m) =>
            m.role === 'assistant' &&
            typeof m.meta === 'object' &&
            m.meta !== null &&
            'quizResult' in (m.meta as Record<string, unknown>),
        );
      const meta = quizMsg?.meta as
        | { quizResult?: QuizResult; quizConfig?: unknown }
        | undefined;
      if (meta?.quizResult) {
        const qc = meta.quizConfig as
          | { timeLimitMinutes?: unknown; timerCorner?: unknown; model?: unknown }
          | undefined;
        if (qc && typeof qc === 'object') {
          setQuizConfig((prev) => ({
            ...prev,
            timeLimitMinutes:
              typeof qc.timeLimitMinutes === 'number' ? qc.timeLimitMinutes : prev.timeLimitMinutes,
            timerCorner: isTimerCorner(qc.timerCorner) ? qc.timerCorner : prev.timerCorner,
            model:
              typeof qc.model === 'string' && AI_MODELS.some((m) => m.id === qc.model)
                ? (qc.model as AIModelId)
                : prev.model,
          }));
        }
        persistedQuizRef.current = meta.quizResult;
        restoreQuiz(meta.quizResult);
      } else {
        resetQuiz();
      }
      setShowQuizPanel(true);
    } else {
      resetQuiz();
      setMode('explainer');
      setShowQuizPanel(false);
      load(
        conv.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          model: m.model ?? undefined,
          sources: extractSources(m.meta),
          thinking: extractThinking(m.meta),
        })),
      );
    }
  }, [store.active, load, reset, resetQuiz, restoreQuiz]);

  // Sidebar "New Chat" / "New Quiz" requests — fresh local slate, no DB row
  // until the first message (avoids junk rows on accidental clicks).
  useEffect(() => {
    if (!freshRequest || freshRequest.key === lastFreshKey.current) return;
    lastFreshKey.current = freshRequest.key;
    loadedConvId.current = null;
    persistedQuizRef.current = null;
    reset();
    resetQuiz();
    setMode(freshRequest.mode);
    setShowQuizPanel(freshRequest.mode === 'quiz');
    store.clearActive();
  }, [freshRequest, reset, resetQuiz, store]);

  useEffect(() => {
    if (searchParams.get('mode') === 'quiz') {
      setMode('quiz');
      setShowQuizPanel(true);
    }
  }, [searchParams]);

  // Focused activities get the full screen: collapse the dock when the quiz
  // builder opens and when a generated quiz starts (runner visible).
  useEffect(() => {
    if (showQuizPanel) collapseDock();
  }, [showQuizPanel]);

  useEffect(() => {
    if (quiz.phase === 'ready') collapseDock();
  }, [quiz.phase]);

  const activeModelMeta = AI_MODELS.find((m) => m.id === model);

  const handleModelChange = (next: AIModelId) => {
    if (next !== model) stop();
    setModel(next);
  };

  const handleModeChange = (nextMode: PromptMode) => {
    setMode(nextMode);
    // Switching modes starts a fresh slate (never mixes turns into a
    // conversation of the other mode).
    loadedConvId.current = null;
    persistedQuizRef.current = null;
    store.clearActive();
    if (nextMode === 'explainer') {
      setShowQuizPanel(false);
      resetQuiz();
    }
  };

  const handleNewQuiz = () => {
    resetQuiz();
    setShowQuizPanel(false);
  };

  /** Persist a finished quiz session once (never double-save). */
  useEffect(() => {
    if (quiz.phase !== 'ready' || !quiz.result || !syncEnabled) return;
    if (persistedQuizRef.current === quiz.result) return;
    const conv = store.active;
    if (!conv || conv.mode !== 'quiz') return;
    persistedQuizRef.current = quiz.result;
    const cfg = lastQuizConfigRef.current ?? quizConfig;
    const result = quiz.result;
    void store
      .appendMessages(conv.id, [
        { role: 'user', content: quizTopicFromConfig(cfg) },
        {
          role: 'assistant',
          content: 'Quiz generated.',
          model: cfg.model,
          meta: {
            quizResult: result,
            quizConfig: {
              timeLimitMinutes: cfg.timeLimitMinutes,
              timerCorner: cfg.timerCorner,
              model: cfg.model,
            },
          },
        },
      ])
      .catch(() => {
        // Keep local state as truth; allow a retry on next render.
        persistedQuizRef.current = null;
      });
  }, [quiz.phase, quiz.result, quizConfig, syncEnabled, store]);

  const handleGenerate = async (config: QuizConfig) => {
    // Auth gate: logged-out visitors never reach the API.
    if (!signedIn) {
      setLoginOpen(true);
      return;
    }
    // Hard gate: exhausted quiz quota never reaches the API.
    if (!canUse('quizzes')) {
      setLimitKind('quizzes');
      return;
    }
    lastQuizConfigRef.current = config;
    if (syncEnabled) {
      const conv = store.active;
      if (!conv || conv.mode !== 'quiz') {
        // Fresh quiz slate; create the row in the background (no junk rows
        // if generation is never started — creation happens on click).
        load([]);
        resetQuiz();
        setMode('quiz');
        setShowQuizPanel(true);
        store.clearActive();
        loadedConvId.current = null;
        persistedQuizRef.current = null;
        try {
          const created = await store.createConversation('quiz');
          if (created) loadedConvId.current = created.id;
        } catch {
          // Signed-in but offline: quiz still works locally this session.
        }
      }
    }
    try {
      const created = await quiz.generate(config);
      if (created) bump({ quizzesUsed: 1 });
    } catch (err: any) {
      if ((err as any)?.status === 401 || (err as any)?.limitKind === 'auth') {
        setLoginOpen(true);
        return;
      }
      if ((err as any)?.status === 402 || (err as any)?.status === 429 || (err as any)?.limitKind) {
        setLimitKind('quizzes');
        return;
      }
      throw err;
    }
  };

  const handleGrade = async (
    question: string,
    modelAnswer: string,
    userAnswer: string,
  ) => {
    // Auth gate: grading is an AI call — disabled while logged out.
    if (!signedIn) {
      setLoginOpen(true);
      throw new Error('You have to be logged in to use AI features.');
    }
    try {
      return await quiz.grade(question, modelAnswer, userAnswer, quizConfig.model);
    } catch (err: any) {
      if ((err as any)?.status === 401 || (err as any)?.limitKind === 'auth') {
        setLoginOpen(true);
      }
      throw err;
    }
  };

  const handleSend = async (message: string, files?: File[], fileContext?: string) => {
    // Auth gate: logged-out visitors never reach the API.
    if (!signedIn) {
      setLoginOpen(true);
      return;
    }
    // Hard gate: exhausted message quota never reaches the API.
    if (!canUse('messages')) {
      setLimitKind('messages');
      return;
    }
    const searchMatch = message.match(/^\[(Search|Think|Canvas):\s*([\s\S]*?)\]$/);
    const searchRequested = searchMatch?.[1] === 'Search';
    // Think mode is not supported for GPT OSS models — force the fast path.
    const thinkRequested = searchMatch?.[1] === 'Think' && !model.startsWith('openai/');
    const clean = (searchMatch ? searchMatch[2]! : message).trim();
    // Attachments without a typed question still send: give the AI an
    // explicit task so it summarizes instead of echoing filenames.
    const hasFiles = !!files && files.length > 0;
    const promptText =
      clean ||
      (hasFiles
        ? 'Please read the attached document(s) and give me a clear overview with key takeaways.'
        : '');
    if (!promptText || isLoading) return;

    // User started talking to the AI — dock out of the way.
    collapseDock();

    // Sync: reuse the active explainer conversation, else create one in the
    // background so streaming starts with zero added latency.
    let convPromise: Promise<string | null> | null = null;
    if (syncEnabled) {
      const conv = store.active;
      if (conv && conv.mode === 'explainer') {
        convPromise = Promise.resolve(conv.id);
      } else {
        load([]);
        resetQuiz();
        setMode('explainer');
        setShowQuizPanel(false);
        store.clearActive();
        loadedConvId.current = null;
        persistedQuizRef.current = null;
        convPromise = store
          .createConversation('explainer')
          .then((created) => {
            if (created) loadedConvId.current = created.id;
            return created?.id ?? null;
          })
          .catch(() => null);
      }
    }

    let result: Awaited<ReturnType<typeof send>>;
    try {
      result = await send({ prompt: promptText, mode: 'explainer', model, search: searchRequested, think: thinkRequested, ...(fileContext ? { context: fileContext } : {}), ...(files && files.length > 0 ? { attachments: files.map((f) => f.name) } : {}) });
    } catch (err: any) {
      if ((err as any)?.status === 401 || (err as any)?.limitKind === 'auth') {
        setLoginOpen(true);
        return;
      }
      if ((err as any)?.status === 402 || (err as any)?.status === 429 || (err as any)?.limitKind) {
        setLimitKind('messages');
        return;
      }
      throw err;
    }
    if (result) bump({ messagesUsed: 1 });

    if (result && convPromise) {
      const convId = await convPromise;
      if (convId) {
        try {
          await store.appendMessages(convId, [
            { role: 'user', content: result.userContent },
            {
              role: 'assistant',
              content: result.assistantContent,
              model: result.model,
              ...(result.sources?.length || result.thinking
                ? {
                    meta: {
                      ...(result.sources?.length ? { sources: result.sources } : {}),
                      ...(result.thinking ? { thinking: result.thinking } : {}),
                    },
                  }
                : {}),
            },
          ]);
        } catch {
          // Local thread stays the source of truth; the list heals on poll.
        }
      }
    }
  };

  const inputBox = (
<PromptInputBox
            mode={mode}
            onModeChange={handleModeChange}
            model={model}
            onModelChange={handleModelChange}
            isLoading={isLoading}
            showToggle={false}
            showSuggestions={messages.length === 0}
            onSend={handleSend}
            onStop={stop}
            signedIn={signedIn}
            onLoginRequired={() => setLoginOpen(true)}
            placeholder={
              mode === 'quiz'
                ? 'What would you like to practice?'
                : 'Ask me anything...'
            }
          />
  );

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(155,135,245,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9b87f5]/5 blur-[120px]" />

      {mode === 'quiz' && quizConfig.timeLimitMinutes !== null && (showQuizPanel || (quiz.phase === 'ready' && quiz.result)) && (
        <QuizTimer
          minutes={quizConfig.timeLimitMinutes}
          corner={quizConfig.timerCorner}
          paused={!(quiz.phase === 'ready' && quiz.result) || quizFinished}
          userPaused={timerManuallyPaused}
          onTogglePause={() => setTimerManuallyPaused((p) => !p)}
        />
      )}

      {messages.length === 0 ? (
        /* Empty state: original centered layout (explainer) / top-anchored layout (quiz) */
        <div
          className={cn(
            'relative z-10 flex h-full w-full flex-col items-center px-4 md:px-8',
            mode === 'quiz' && showQuizPanel
              ? 'justify-start overflow-y-auto pb-12 pt-24'
              : 'justify-center',
          )}
        >
          <div className="absolute top-8 left-0 right-0 z-50 flex flex-col items-center">
            <PromptModeToggle
              mode={mode}
            onModeChange={handleModeChange}
              className="scale-110 shadow-lg bg-background/90 backdrop-blur-sm"
            />
          </div>

          {mode === 'quiz' ? (
            showQuizPanel || quizActive ? (
              <div className="w-full max-w-5xl">
                <AnimatePresence mode="wait" initial={false}>
                  {quizActive && quiz.result ? (
                    <motion.div
                      key="quiz-runner"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px) scale(0.98)' }}
                      animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px) scale(0.98)' }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <QuizRunner
                        result={quiz.result}
                        config={quizConfig}
                        onGrade={handleGrade}
                        onNewQuiz={handleNewQuiz}
                        onRetry={() => void handleGenerate(quizConfig)}
                        onFinishedChange={setQuizFinished}
                        paused={timerManuallyPaused}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quiz-panel"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px) scale(0.98)' }}
                      animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px) scale(0.98)' }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <QuizCreatePanel
                        config={quizConfig}
                        onChange={setQuizConfig}
                        onBack={() => setShowQuizPanel(false)}
                        onGenerate={(config) => void handleGenerate(config)}
                        isGenerating={quiz.phase === 'generating'}
                        generateError={quiz.phase === 'error' ? quiz.error : null}
                        progressLabel={quiz.progressLabel}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center mb-16 gap-6">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm">
                    <img
                      src="/assets/branding/logo.png"
                      alt="Smartli Logo"
                      className="object-contain"
                      width={48}
                      height={48}
                    />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Smartli <span className="text-primary">Intelligence</span>
                  </h1>
                </div>

                <div className="w-full max-w-4xl">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key="quiz-empty"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px) scale(0.99)' }}
                      animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px) scale(0.99)' }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowQuizPanel(true)}
                        className="quiz-create-button mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-border bg-card px-8 py-10 text-center transition-colors duration-200 ease-[var(--ease-out)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.99]"
                      >
                        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                          <ListChecks className="h-6 w-6" />
                        </span>
                        <span className="text-xl font-semibold tracking-tight text-foreground">Create Quiz</span>
                        <span className="mt-1 text-sm text-muted-foreground">Create a quiz on your material.</span>
                      </button>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-600 dark:text-gray-500">
                  Quiz mode tests you instead of explaining.
                </p>
              </>
            )
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-16 gap-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm">
                  <img
                    src="/assets/branding/logo.png"
                    alt="Smartli Logo"
                    className="object-contain"
                    width={48}
                    height={48}
                  />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Smartli <span className="text-primary">Intelligence</span>
                </h1>
              </div>

              <div className="w-full max-w-4xl">
                {inputBox}
              </div>

              <p className="mt-6 text-center text-xs text-zinc-600 dark:text-gray-500">
                Explainer mode breaks topics down for you.
              </p>
            </>
          )}
        </div>
      ) : (
        /* Chat state: messages + docked input */
        <>
          <div className="relative z-10 flex items-center justify-between border-b border-border bg-background/40 px-6 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground/80">
                {activeModelMeta?.name ?? 'Smartli'}
              </span>
              <span className="text-xs text-muted-foreground">
                · {activeModelMeta?.provider}
              </span>
            </div>
            <button
              onClick={() => {
                reset();
                loadedConvId.current = null;
                persistedQuizRef.current = null;
                store.clearActive();
              }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              Clear chat
            </button>
          </div>

          <div className="relative z-0 flex-1 overflow-hidden">
            <ChatMessages
              messages={messages}
              streamingId={streamingId}
              error={error}
              searching={searching}
            />
          </div>

          <div className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center',
            'bg-gradient-to-t from-background via-background/80 to-transparent pb-6 pt-12'
          )}>
            <div className="pointer-events-auto w-full max-w-3xl px-4 sm:px-6">
              {inputBox}
            </div>
          </div>
        </>
      )}
      {limitKind && (
        <LimitReachedModal
          open
          kind={limitKind}
          planName={plan.name}
          resetLabel={nextResetLabel}
          onClose={() => setLimitKind(null)}
        />
      )}
      {loginOpen && (
        <LoginRequiredModal open onClose={() => setLoginOpen(false)} />
      )}
    </div>
  );
}
