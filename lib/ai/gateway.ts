import { AI_CONFIG, AI_MODELS, type AIModelId, type ChatMessage } from './config';
import { getSystemPrompt } from './prompts';
import { AIRequest } from './config';
import { formatResultsForContext, isExaConfigured, searchExa } from '@/lib/search/exa';

const OLLAMA_CHAT_URL = 'https://ollama.com/api/chat';
const NVIDIA_CHAT_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const GEMINI_FALLBACK_MODEL = 'gemini-3.6-flash';
const NVIDIA_TIMEOUT_MS = 90_000; // per-attempt: if no response in 90s, abandon
const NVIDIA_MAX_RETRIES = 2;

export async function streamAIResponse(request: AIRequest) {
  const { prompt, context, mode, history } = request;

  const modelConfig = AI_MODELS.find((m) => m.id === (request.model || AI_CONFIG.PRIMARY_MODEL));
  if (!modelConfig) {
    throw new Error(`Model ${request.model} not found in configuration`);
  }

  // "Search" mode: the prompt-box sends "[Search: query]". Accept both the
  // explicit `search` flag and the legacy prefix so direct API callers work.
  // Same for "Think" mode ("[Think: query]" / `think` flag). The two toggles
  // are mutually exclusive in the UI.
  const searchMatch = prompt.match(/^\[(Search|Think|Canvas):\s*([\s\S]*?)\]$/);
  const searchRequested = request.search === true || searchMatch?.[1] === 'Search';
  const thinkRequested =
    (request.think === true || searchMatch?.[1] === 'Think') &&
    // Think mode is intentionally NOT supported for GPT OSS models
    // (api === 'ollama'): they always stay on the fast path.
    modelConfig.api !== 'ollama';
  const cleanPrompt = searchMatch ? searchMatch[2]!.trim() : prompt;

  // Enrich with Exa web results when requested and configured. If the key is
  // missing we degrade gracefully to a normal (non-grounded) answer.
  // The chat client pre-searches via /api/search and already injects the
  // block below — skip a second (slow, billable) search in that case and act
  // purely as a fallback for direct API callers / pre-search failures.
  let enrichedContext = context;
  const alreadyGrounded = enrichedContext?.includes('Live web results for "') ?? false;
  if (searchRequested && !alreadyGrounded && isExaConfigured()) {
    try {
      const results = await searchExa(cleanPrompt, { numResults: 6 });
      if (results.length > 0) {
        const searchBlock =
          `Live web results for "${cleanPrompt}" (cite as [1], [2], ... with markdown links):\n\n` +
          formatResultsForContext(results);
        enrichedContext = enrichedContext
          ? `${enrichedContext}\n\n${searchBlock}`
          : searchBlock;
      }
    } catch (err) {
      console.warn(`Exa search failed, continuing without grounding: ${(err as Error).message}`);
    }
  }

  const messages = buildProviderMessages(cleanPrompt, enrichedContext, mode, history, searchRequested, thinkRequested);

  if (modelConfig.api === 'gemini') {
    return streamGeminiResponse(modelConfig.id, messages);
  }
  if (modelConfig.api === 'ollama') {
    // Primary: Ollama cloud. Fallback to NVIDIA gpt-oss-20b for resilience.
    // NOTE: Think mode is intentionally NOT supported for GPT OSS models —
    // thinkRequested is forced false above, so they always stay on the
    // fast path (no reasoning params, no reasoning system-prompt).
    try {
      return await streamOllamaResponse(modelConfig.id, messages);
    } catch (err: any) {
      if (!process.env.NVIDIA_API_KEY) throw err;
      console.warn(`Ollama failed (${err.message}), falling back to NVIDIA openai/gpt-oss-20b`);
      return streamNvidiaResponse('openai/gpt-oss-20b', messages, false);
    }
  }
  if (modelConfig.api === 'nvidia') {
    try {
      return await streamNvidiaResponse(modelConfig.id, messages, thinkRequested);
    } catch (err: any) {
      // NVIDIA's free tier is heavily overloaded for DeepSeek & Kimi.
      // Fall back to Gemini so the user isn't stuck waiting or seeing an error.
      const isHeavyNvidiaModel =
        modelConfig.id.startsWith('deepseek-ai/') ||
        modelConfig.id.startsWith('moonshotai/');
      if (isHeavyNvidiaModel && process.env.GEMINI_API_KEY) {
        console.warn(`NVIDIA ${modelConfig.id} failed (${err.message}), falling back to Gemini`);
        return streamGeminiResponse('google/gemini-3.1-flash-lite', messages);
      }
      throw err;
    }
  }
  throw new Error(`Unsupported model api: ${(modelConfig as any).api}`);
}

const DOCUMENT_RULES = `You have been given the full text of attached document(s) in the user message (marked as DOCUMENT 1/N with filenames and page markers).

How to handle documents:
- FIRST read and understand what each document is about (topic, structure, key points).
- If the user asked a specific question: answer it FROM the documents. Quote or paraphrase the relevant parts and mention the document name (and page number when available, e.g. "as stated on Page 3 of report.pdf").
- If the user attached documents with NO clear question (e.g. just filenames or "explain this"): give a helpful overview — what the document is about, its main topics/sections, and 3-6 key takeaways. End with 2-3 things you can do next (summarize deeper, quiz them, explain a section).
- If the answer is NOT in the documents, say so explicitly instead of inventing facts. You may use general knowledge only to explain/clarify what's in the documents, and say when you do.
- If a document note says its text could not be extracted (scanned PDF, failure), tell the user exactly that and suggest exporting it as text or screenshots.
- Never claim you "can't read PDFs" — the text is right there in the conversation. Never ask the user to paste the content.`;

/**
 * Build a messages array for chat-style providers.
 * history may already include the current user turn – dedupe so we only
 * append the latest prompt if it's not already in history.
 */
function buildProviderMessages(
  prompt: string,
  context: string | undefined,
  mode: AIRequest['mode'],
  history?: ChatMessage[],
  searchRequested?: boolean,
  thinkRequested?: boolean,
): ChatMessage[] {
  const systemPrompt = getSystemPrompt(mode || 'explainer');
  const base: ChatMessage[] = [];

  // Think mode (all providers except GPT OSS): ask the model to reason
  // inside <think>...</think> tags, then put the final answer after the
  // closing tag. Native reasoning models (DeepSeek on NVIDIA) already emit
  // <think> blocks via reasoning_content — this instruction unifies the
  // wire format so the client can split thinking from answer for every
  // other model (Gemini, Kimi) too.
  const thinkSuffix = thinkRequested
    ? `\n\nReasoning mode is ON. Think step-by-step INSIDE <think>...</think> tags first (concise — key steps and checks only, no rambling), then give the final answer AFTER the closing </think> tag under a "## Answer" heading. Never leave the final answer inside the thinking tags.`
    : '';

  // System message
  const today = new Date().toISOString().slice(0, 10);
  const hasDocuments =
    !!context &&
    (/===== DOCUMENT \d+\/\d+:/.test(context) ||
      context.includes('Attached files context') ||
      context.includes('--- FILE:') ||
      context.includes('--- File:'));
  base.push({
    role: 'system',
    content: (searchRequested
      ? `${systemPrompt}\n\nToday's date is ${today}. You were given live web-search results in the user message. Treat them carefully:\n- For latest/current questions, answer ONLY from the results — never from parametric memory, which may hold an older answer (e.g. a previous year's winner).\n- State the EVENT year exactly as the results state it. If no result explicitly states the year of an event, say the year is unclear — never fill it in from today's date or how fresh a page looks.\n- Never relabel a past event with the current year. If a result describes a 2024 prize, report it as 2024 even if the page was published recently.
- Cross-check year/date claims across at least two results and prefer official sources (e.g. nobelprize.org) plus consensus. If a single result contradicts the official source and the others (e.g. one page claims a 2026 prize while the official list spans 1901–2025 and 2026 announcements are still scheduled), trust the official source/consensus and briefly note the discrepancy instead of repeating the outlier.\n- Prefer the results over parametric knowledge for all current facts.\n- Cite every factual claim with its source number as a markdown link, e.g. [title](url) or [1](url).\n- If the results don't cover the question, say so.`
      : systemPrompt) +
      (hasDocuments ? `\n\n${DOCUMENT_RULES}` : '') +
      thinkSuffix,
  });

  // Prior history
  if (history && history.length) {
    base.push(...history.map((m) => ({ role: m.role, content: m.content })));
  }

  // Append current turn: documents first, then the user's actual request,
  // so the model never confuses filenames for the question.
  let userText: string;
  if (context && hasDocuments) {
    const request = prompt.trim();
    const looksLikeFileLabelOnly = /^(Attached files?:[\s\S]*|📎[\s\S]*)$/.test(request) || request === '';
    userText =
      `${context}\n\n---\nUSER REQUEST:\n` +
      (looksLikeFileLabelOnly || request.length < 3
        ? 'The user attached the document(s) above without a specific question. Give a helpful overview: what it is about, main topics, and key takeaways.'
        : request);
  } else {
    userText = context ? `${context}\n\n${prompt}` : prompt;
  }
  const last = base[base.length - 1];
  if (!last || last.role !== 'user' || last.content !== userText) {
    base.push({ role: 'user', content: userText });
  }
  return base;
}

/* ------------------------------------------------------------------ */
/* Gemini                                                              */
/* ------------------------------------------------------------------ */

async function streamGeminiResponse(modelId: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const cleanModelId = modelId.replace(/^(google\/|gemini\/)/, '');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const attempt = async (m: string): Promise<ReadableStream<Uint8Array>> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:streamGenerateContent?alt=sse&key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toGeminiPayload(messages))
    });

    if (res.status === 503 && m === cleanModelId) {
      console.warn(`Gemini ${m} returned 503, falling back to ${GEMINI_FALLBACK_MODEL}`);
      return attempt(GEMINI_FALLBACK_MODEL);
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${err.slice(0, 200)}`);
    }
    if (!res.body) throw new Error('No response body from Gemini API');

    return wrapSSEResponse(res.body, (jsonText) => {
      try {
        const data = JSON.parse(jsonText);
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch {
        return '';
      }
    });
  };

  return attempt(cleanModelId);
}

function toGeminiPayload(messages: ChatMessage[]) {
  // System messages become Gemini's dedicated systemInstruction field,
  // so they never leak into the visible conversation.
  const systemText = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');

  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  return {
    ...(systemText ? { system_instruction: { parts: [{ text: systemText }] } } : {}),
    contents
  };
}

/* ------------------------------------------------------------------ */
/* NVIDIA NIM                                                          */
/* ------------------------------------------------------------------ */

async function streamNvidiaResponse(modelId: string, messages: ChatMessage[], think = false): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured');

  const body = buildNvidiaBody(modelId, messages, think);
  const baseWaitMs = 2000;

  for (let attempt = 0; attempt <= NVIDIA_MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(NVIDIA_CHAT_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(NVIDIA_TIMEOUT_MS)
      });

      // Retry on temporary overload (529) or gateway timeout (504) with backoff
      if ((res.status === 529 || res.status === 504 || res.status === 502 || res.status === 503) && attempt < NVIDIA_MAX_RETRIES) {
        const waitMs = baseWaitMs * Math.pow(2, attempt);
        console.warn(`NVIDIA ${modelId} returned ${res.status}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${NVIDIA_MAX_RETRIES + 1})`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`NVIDIA API error (${res.status}): ${err.slice(0, 200)}`);
      }
      if (!res.body) throw new Error('No response body from NVIDIA API');

      return wrapSSEResponse(res.body, (jsonText) => {
        try {
          const data = JSON.parse(jsonText);
          const delta = data.choices?.[0]?.delta;
          const reasoning = delta?.reasoning_content || delta?.reasoning || '';
          const content = delta?.content || '';
          return reasoning ? `<think>${reasoning}</think>${content}` : content;
        } catch {
          return '';
        }
      });
    } catch (err: any) {
      if (attempt < NVIDIA_MAX_RETRIES && (err.name === 'AbortError' || err.cause?.code === 'ECONNRESET' || err.cause?.code === 'ENOTFOUND')) {
        const waitMs = baseWaitMs * Math.pow(2, attempt);
        console.warn(`NVIDIA ${modelId} attempt ${attempt + 1} failed: ${err.message}, retrying in ${waitMs}ms`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`NVIDIA ${modelId} unavailable after ${NVIDIA_MAX_RETRIES + 1} attempts`);
}

function buildNvidiaBody(modelId: string, messages: ChatMessage[], think = false) {
  const base = {
    model: modelId,
    messages,
    max_tokens: 16384,
    stream: true,
    temperature: 1,
    top_p: 1
  };

  if (modelId.startsWith('deepseek-ai/deepseek')) {
    return {
      ...base,
      top_p: 0.95,
      // DeepSeek thinking mode is slow on the NIM free tier, so it stays
      // OFF by default and is only enabled via the Think toggle.
      chat_template_kwargs: { thinking: think }
    };
  }
  if (modelId.startsWith('moonshotai/')) {
    // Kimi K3: no native reasoning params — Think mode works purely via
    // the <think> system-prompt instruction (unified wire format).
    return { ...base, top_p: 0.95, max_tokens: 16384 };
  }
  // gpt-oss models (NVIDIA fallback for Ollama): Think mode is NOT
  // supported — always the fast path, `think` is deliberately ignored.
  return { ...base, max_tokens: 4096 };
}

/* ------------------------------------------------------------------ */
/* Ollama (cloud, OpenAI-compatible)                                   */
/* ------------------------------------------------------------------ */

async function streamOllamaResponse(modelId: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) throw new Error('OLLAMA_API_KEY is not configured');

  // Config ids use dashes (openai/gpt-oss-20b) but Ollama cloud
  // expects colon tags (gpt-oss:20b) — translate, leave others untouched.
  const ollamaModel = modelId
    .replace(/^openai\//, '')
    .replace(/^gpt-oss-(\d+b)$/, 'gpt-oss:$1');

  const res = await fetch(OLLAMA_CHAT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: ollamaModel,
      messages,
      stream: true
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama API error (${res.status}): ${err.slice(0, 200)}`);
  }
  if (!res.body) throw new Error('No response body from Ollama API');

  // Ollama streaming returns newline-delimited JSON, not SSE.
  return wrapNDJSONResponse(res.body, (obj) => {
    return obj?.message?.content || obj?.response || '';
  });
}

/* ------------------------------------------------------------------ */
/* Stream helpers                                                      */
/* ------------------------------------------------------------------ */

function wrapSSEResponse(body: ReadableStream<Uint8Array>, extract: (json: string) => string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = body.getReader();
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;
            const text = extract(payload);
            if (text) controller.enqueue(encoder.encode(text));
          }
        }
        if (buffer.trim().startsWith('data:')) {
          const payload = buffer.trim().slice(5).trim();
          if (payload && payload !== '[DONE]') {
            const text = extract(payload);
            if (text) controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });
}

function wrapNDJSONResponse(body: ReadableStream<Uint8Array>, extract: (obj: any) => string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = body.getReader();
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const obj = JSON.parse(trimmed);
              const text = extract(obj);
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // ignore malformed lines
            }
          }
        }
        if (buffer.trim()) {
          try {
            const text = extract(JSON.parse(buffer.trim()));
            if (text) controller.enqueue(encoder.encode(text));
          } catch {}
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });
}
