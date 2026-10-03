import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { touchStreak } from '@/lib/streaks';
import type { GradeResult, GradeVerdict } from '@/types';
import { AI_MODELS, type AIModelId } from '@/lib/ai/config';

const GRADER_MODEL = 'google/gemma-4-31b-it';
const GRADE_TIMEOUT_MS = 20_000;

function coerceVerdict(value: unknown): GradeVerdict {
  const v = String(value ?? '').toLowerCase();
  if (v.includes('correct') && !v.includes('incorrect') && !v.includes('partial')) return 'correct';
  if (v.includes('partial')) return 'partial';
  if (v.includes('incorrect') || v.includes('wrong')) return 'incorrect';
  return 'partial';
}

async function gradeWithNvidia(question: string, modelAnswer: string, userAnswer: string): Promise<GradeResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured');

  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GRADER_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You grade a student answer against a model answer. Respond with ONLY a JSON object: {"verdict":"correct"|"partial"|"incorrect","feedback":"one or two sentences explaining what was right or missing"}. Be fair: accept paraphrases and equivalent wording as correct.',
        },
        {
          role: 'user',
          content: `Question: ${question}\nModel answer: ${modelAnswer}\nStudent answer: ${userAnswer}`,
        },
      ],
      temperature: 0.2,
      top_p: 1,
      max_tokens: 500,
      stream: false,
      chat_template_kwargs: { thinking: false },
    }),
    signal: AbortSignal.timeout(GRADE_TIMEOUT_MS),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Grader error (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('Grader returned an unreadable response.');
  const parsed = JSON.parse(text.slice(start, end + 1));
  return {
    verdict: coerceVerdict(parsed.verdict),
    feedback: String(parsed.feedback ?? 'No feedback provided.'),
  };
}

async function gradeWithFallback(
  model: AIModelId,
  question: string,
  modelAnswer: string,
  userAnswer: string
): Promise<GradeResult> {
  const modelConfig = AI_MODELS.find((m) => m.id === model);
  if (!modelConfig || modelConfig.api !== 'gemini' || !process.env.GEMINI_API_KEY) {
    throw new Error('Grading is unavailable right now. Compare your answer with the model answer below.');
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'You grade a student answer against a model answer. Respond with ONLY a JSON object: {"verdict":"correct"|"partial"|"incorrect","feedback":"one or two sentences"}.' }],
        },
        contents: [{ role: 'user', parts: [{ text: `Question: ${question}\nModel answer: ${modelAnswer}\nStudent answer: ${userAnswer}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
      }),
      signal: AbortSignal.timeout(GRADE_TIMEOUT_MS),
    }
  );
  if (!res.ok) throw new Error('Grading is unavailable right now. Compare your answer with the model answer below.');
  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('Grading is unavailable right now. Compare your answer with the model answer below.');
  const parsed = JSON.parse(text.slice(start, end + 1));
  return { verdict: coerceVerdict(parsed.verdict), feedback: String(parsed.feedback ?? '') };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  try {
    const { question, modelAnswer, userAnswer, model } = await req.json();
    if (!question || !modelAnswer || !String(userAnswer ?? '').trim()) {
      return NextResponse.json({ error: 'Missing question, model answer, or your answer.' }, { status: 400 });
    }
    touchStreak(userId, { credit: true }).catch(() => {});
    try {
      return NextResponse.json(await gradeWithNvidia(question, modelAnswer, userAnswer));
    } catch (err: any) {
      console.warn(`Quiz grader (${GRADER_MODEL}) failed: ${err.message}, using fallback`);
      return NextResponse.json(await gradeWithFallback(model, question, modelAnswer, userAnswer));
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Grading failed.' }, { status: 500 });
  }
}
