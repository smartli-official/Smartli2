import { AI_MODELS, type AIModelId } from '@/lib/ai/config';

export interface QuizChatImage {
  mimeType: string;
  base64: string;
  dataUrl: string;
}

/** Single non-streaming completion. Returns the full text of the assistant reply. */
export async function completeOnce(
  modelId: AIModelId,
  systemPrompt: string,
  userText: string,
  images: QuizChatImage[] = []
): Promise<string> {
  const modelConfig = AI_MODELS.find((m) => m.id === modelId);
  if (!modelConfig) throw new Error(`Unknown model: ${modelId}`);

  if (modelConfig.api === 'gemini') {
    try {
      return await completeGemini(modelConfig.id, systemPrompt, userText, images);
    } catch (err: any) {
      if (modelId !== 'google/gemini-3.1-flash-lite' && process.env.GEMINI_API_KEY) {
        console.warn(`Quiz generation via ${modelId} failed, falling back to Gemini Flash Lite`);
        return completeGemini('google/gemini-3.1-flash-lite', systemPrompt, userText, images);
      }
      throw err;
    }
  }
  if (modelConfig.api === 'nvidia') {
    try {
      return await completeNvidia(modelConfig.id, systemPrompt, userText, images);
    } catch (err: any) {
      const heavy = modelConfig.id.startsWith('deepseek-ai/') || modelConfig.id.startsWith('moonshotai/');
      if (heavy && process.env.GEMINI_API_KEY) {
        console.warn(`Quiz generation via ${modelConfig.id} failed, falling back to Gemini`);
        return completeGemini('google/gemini-3.1-flash-lite', systemPrompt, userText, images);
      }
      throw err;
    }
  }
  if (modelConfig.api === 'ollama') {
    try {
      return await completeOllama(modelConfig.id, systemPrompt, userText, images);
    } catch (err: any) {
      if (!process.env.NVIDIA_API_KEY) throw err;
      console.warn(`Quiz generation via Ollama failed, falling back to NVIDIA gpt-oss-20b`);
      return completeNvidia('openai/gpt-oss-20b', systemPrompt, userText, []);
    }
  }
  throw new Error(`Unsupported model api: ${(modelConfig as any).api}`);
}

async function completeGemini(
  modelId: string,
  system: string,
  text: string,
  images: QuizChatImage[]
): Promise<string> {
  const clean = modelId.replace(/^(google\/|gemini\/)/, '');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const parts: any[] = [{ text }];
  for (const img of images) {
    parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${clean}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 16384 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const out = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? '';
  if (!out) throw new Error('Gemini returned an empty response.');
  return out;
}

function openAiMessages(system: string, text: string, images: QuizChatImage[]) {
  if (images.length === 0) {
    return [
      { role: 'system', content: system },
      { role: 'user', content: text },
    ];
  }
  return [
    { role: 'system', content: system },
    {
      role: 'user',
      content: [
        { type: 'text', text },
        ...images.map((img) => ({ type: 'image_url', image_url: { url: img.dataUrl } })),
      ],
    },
  ];
}

async function completeNvidia(
  modelId: string,
  system: string,
  text: string,
  images: QuizChatImage[]
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured');

  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId,
      messages: openAiMessages(system, text, images),
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 16384,
      stream: false,
      ...(modelId.startsWith('deepseek-ai/deepseek')
        ? { chat_template_kwargs: { thinking: false } }
        : {}),
    }),
    signal: AbortSignal.timeout(180_000),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA error (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const out = data.choices?.[0]?.message?.content ?? '';
  if (!out) throw new Error('Model returned an empty response.');
  return out;
}

async function completeOllama(
  modelId: string,
  system: string,
  text: string,
  images: QuizChatImage[]
): Promise<string> {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) throw new Error('OLLAMA_API_KEY is not configured');

  const res = await fetch('https://ollama.com/api/chat', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId.replace(/^openai\//, ''),
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: text,
          ...(images.length ? { images: images.map((i) => i.base64) } : {}),
        },
      ],
      stream: false,
    }),
    signal: AbortSignal.timeout(180_000),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const out = data.message?.content ?? data.response ?? '';
  if (!out) throw new Error('Model returned an empty response.');
  return out;
}

/** Extract a JSON object from model output (tolerates fences and chatter). */
export function extractJsonObject(raw: string): any {
  let text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('The model did not return valid quiz data. Please try again.');
  }
  return JSON.parse(text.slice(start, end + 1));
}
