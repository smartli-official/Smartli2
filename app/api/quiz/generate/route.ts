import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import type { QuizConfig, QuizResult, QuizSectionKey } from '@/types';
import { parseUploadedFile } from '@/lib/quiz/parseFiles';
import { buildQuizPrompt } from '@/lib/quiz/buildQuizPrompt';
import { completeOnce, extractJsonObject, type QuizChatImage } from '@/lib/quiz/completeOnce';
import { checkAndConsume } from '@/lib/plan/usage-server';
import { touchStreak } from '@/lib/streaks';

const SECTION_TITLES: Record<QuizSectionKey, string> = {
  mcq: 'Multiple Choice',
  competency: 'Competency',
  critical: 'Critical Thinking',
  justification: 'Justification',
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  try {
    const form = await req.formData();
    const configPart = form.get('config');
    const configRaw = typeof configPart === 'string' ? configPart : await configPart?.text?.();
    if (!configRaw) {
      return NextResponse.json({ error: 'Missing quiz configuration.' }, { status: 400 });
    }
    const { sections, sectionOrder, difficulty, model, extraNotes } = JSON.parse(configRaw) as QuizConfig;

    const enabledSections = (sectionOrder ?? []).filter((key) => sections?.[key]?.enabled);
    if (enabledSections.length === 0) {
      return NextResponse.json({ error: 'Enable at least one question section.' }, { status: 400 });
    }

    const uploads = form.getAll('files').filter((f): f is File => f instanceof File);
    if (uploads.length === 0) {
      return NextResponse.json({ error: 'Add at least one file of study material.' }, { status: 400 });
    }

    const parsed = await Promise.all(uploads.map((f) => parseUploadedFile(f)));
    const usable = parsed.filter((p) => p.status === 'ok' && (p.text.trim() || p.imageDataUrl));
    const failed = parsed.filter((p) => p.status === 'failed' || (!p.text.trim() && !p.imageDataUrl));

    if (usable.length === 0) {
      return NextResponse.json(
        {
          error: 'None of the uploaded files could be read.',
          files: parsed.map((p) => ({ name: p.name, words: 0, status: 'failed' as const, error: p.error })),
        },
        { status: 422 }
      );
    }

    // Server-side quota gate (Supabase). Checked after input validation so
    // malformed requests don't burn quota; consumed before the expensive
    // model call so bypassing the client can't grant unlimited quizzes.
    try {
      const { allowed } = await checkAndConsume(userId, 'quizzes', 1);
      if (!allowed) {
        return NextResponse.json(
          { error: 'You have hit your limits.', limitKind: 'quizzes' },
          { status: 402 },
        );
      }
    } catch (err) {
      console.error('Usage check failed (/api/quiz/generate):', err);
    }
    // A generated quiz is genuine study activity → credit today's streak.
    touchStreak(userId, { credit: true }).catch((err) =>
      console.error('Streak touch failed (/api/quiz/generate):', err),
    );

    const prompt = buildQuizPrompt(
      { sections, sectionOrder, difficulty, model, extraNotes, timeLimitMinutes: null, timerCorner: 'top-left', files: [] },
      usable.map((p) => ({ name: p.name, text: p.text }))
    );

    const images: QuizChatImage[] = usable
      .filter((p) => p.imageDataUrl)
      .map((p) => {
        const mimeType = p.imageDataUrl!.split(';')[0].split(':')[1];
        return { mimeType, base64: p.imageDataUrl!.split(',')[1], dataUrl: p.imageDataUrl! };
      });

    const raw = await completeOnce(
      model,
      'You generate structured quizzes from study material. You always respond with a single JSON object and nothing else.',
      prompt,
      images
    );
    const data = extractJsonObject(raw);

    const resultSections = enabledSections.map((key) => {
      const wanted = Math.max(1, Math.min(50, sections[key].count));
      const found = Array.isArray(data.sections)
        ? data.sections.find((s: any) => s?.key === key)
        : null;
      const rawQuestions = Array.isArray(found?.questions) ? found.questions : [];
      const questions = rawQuestions.slice(0, wanted).map((q: any, i: number) => {
        if (key === 'mcq') {
          const options = Array.isArray(q?.options) ? q.options.map(String).slice(0, 4) : [];
          while (options.length < 4) options.push('');
          let correctIndex = Number(q?.correctIndex);
          if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) correctIndex = 0;
          return {
            id: `${key}-${i}`,
            prompt: String(q?.prompt ?? ''),
            options,
            correctIndex,
            explanation: String(q?.explanation ?? ''),
          };
        }
        return {
          id: `${key}-${i}`,
          prompt: String(q?.prompt ?? ''),
          modelAnswer: String(q?.modelAnswer ?? ''),
          explanation: String(q?.explanation ?? ''),
        };
      }).filter((q: any) => q.prompt.trim());

      return { key, title: SECTION_TITLES[key], questions };
    });

    const totalQuestions = resultSections.reduce((n, s) => n + s.questions.length, 0);
    if (totalQuestions === 0) {
      return NextResponse.json(
        { error: 'The model returned an empty quiz. Please try again.' },
        { status: 502 }
      );
    }

    const material = data.material ?? {};
    const result: QuizResult = {
      sections: resultSections,
      material: {
        files: parsed.map((p) => ({
          name: p.name,
          words: p.words,
          status: failed.includes(p) ? ('failed' as const) : ('ok' as const),
          ...(failed.includes(p) ? { error: p.error } : {}),
        })),
        topics: Array.isArray(material.topics) ? material.topics.map(String).slice(0, 10) : [],
        summary: typeof material.summary === 'string' ? material.summary : '',
      },
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Quiz generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
