import type { QuizConfig, QuizDifficulty, QuizSectionKey } from '@/types';

const SECTION_INSTRUCTIONS: Record<QuizSectionKey, { title: string; describe: (count: number) => string }> = {
  mcq: {
    title: 'Multiple Choice',
    describe: (count) =>
      `Write exactly ${count} multiple-choice questions. Each question MUST have exactly 4 options ("options" array of 4 strings), a "correctIndex" (0-3), and a short "explanation" of why the correct option is right.`,
  },
  competency: {
    title: 'Competency',
    describe: (count) =>
      `Write exactly ${count} scenario-driven questions that test practical application. Describe a short real-world situation, then ask what to do or what follows. Provide a "modelAnswer" (2-4 sentences) and a short "explanation". No "options".`,
  },
  critical: {
    title: 'Critical Thinking',
    describe: (count) =>
      `Write exactly ${count} "why" and "how" questions that require analysis, comparison, or connecting ideas across the material. Provide a "modelAnswer" (2-4 sentences) and a short "explanation". No "options".`,
  },
  justification: {
    title: 'Justification',
    describe: (count) =>
      `Write exactly ${count} questions that ask the user to justify or defend a claim, method, or conclusion from the material ("Why is X correct?", "Defend the claim that..."). Provide a "modelAnswer" (2-4 sentences) and a short "explanation". No "options".`,
  },
};

const DIFFICULTY_GUIDE: Record<QuizDifficulty, string> = {
  Light: 'Light: basic recall of definitions and facts stated directly in the material.',
  Easy: 'Easy: straightforward recall and simple comprehension.',
  Medium: 'Medium: a mix of recall and application; some questions need connecting two ideas.',
  Hard: 'Hard: application and analysis; avoid questions answerable by quoting one sentence.',
  'Extra Hard': 'Extra Hard: subtle distinctions, edge cases, and multi-step reasoning.',
  Ultra: 'Ultra: demanding synthesis across the material, tricky distractors, and non-obvious connections.',
};

export interface QuizPromptMaterial {
  name: string;
  text: string;
}

export function buildQuizPrompt(
  config: QuizConfig,
  materials: QuizPromptMaterial[]
): string {
  const enabledSections = config.sectionOrder.filter((key) => config.sections[key]?.enabled);
  const sectionSpecs = enabledSections
    .map((key, i) => {
      const count = Math.max(1, Math.min(50, config.sections[key].count));
      return `${i + 1}. Section key "${key}" (${SECTION_INSTRUCTIONS[key].title}): ${SECTION_INSTRUCTIONS[key].describe(count)}`;
    })
    .join('\n');

  const materialText = materials
    .map((m) => `--- FILE: ${m.name} ---\n${m.text}`)
    .join('\n\n');

  const extra = config.extraNotes.trim()
    ? `Additional instructions from the user (follow these):\n${config.extraNotes.trim()}\n\n`
    : '';

  return `You are generating a quiz from the study material below. Follow every rule exactly.

RULES:
- Sections, in this order, with these exact question counts:
${sectionSpecs}
- Difficulty: ${DIFFICULTY_GUIDE[config.difficulty]}
- Every question must be answerable from the material. Do not invent facts outside it.
- Write formulas and math in LaTeX (inline $...$, display $$...$$), e.g. $H_2O$, $x^2$, $$\\frac{a}{b}$$. The app renders LaTeX beautifully.
${extra}- Also identify 3-8 main topics covered by the material, and write a 2-3 sentence summary of what the material covers (this proves you read it).

OUTPUT FORMAT — respond with ONLY a JSON object, no markdown fences, no commentary:
{"sections":[{"key":"<one of: ${enabledSections.join(', ')}>","questions":[{"prompt":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."} for mcq, or {"prompt":"...","modelAnswer":"...","explanation":"..."} for other sections]}],"material":{"topics":["..."],"summary":"..."}}

STUDY MATERIAL:
${materialText}`;
}
