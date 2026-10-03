export const AI_MODELS = [
  {
    id: 'google/gemini-3.1-flash-lite',
    name: 'Gemini 3 Flash Lite',
    provider: 'Google',
    logo: 'https://cdn.simpleicons.org/googlegemini',
    api: 'gemini'
  },
  {
    id: 'moonshotai/kimi-k3',
    name: 'Kimi K3',
    provider: 'Moonshot AI',
    logo: 'https://statics.moonshot.cn/kimi-chat/favicon.ico',
    api: 'nvidia'
  },
  {
    id: 'deepseek-ai/deepseek-v4-flash-0731',
    name: 'DeepSeek V4',
    provider: 'DeepSeek',
    logo: 'https://cdn.simpleicons.org/deepseek',
    api: 'nvidia'
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT 20B',
    provider: 'OpenAI / Ollama',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    api: 'ollama'
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT 120B',
    provider: 'OpenAI / Ollama',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    api: 'ollama'
  },
] as const;

export type AIModelId = (typeof AI_MODELS)[number]['id'];

export const AI_CONFIG = {
  PRIMARY_MODEL: 'google/gemini-3.1-flash-lite' as AIModelId,
  STREAMING_ENABLED: true,
};

/**
 * Regex to strip internal AI reasoning tags like <think>...</think> or [thought]...[/thought]
 * Also strips an unclosed trailing tag while a stream is in progress.
 */
export function filterAIStream(text: string): string {
  return text
    .replace(/<(think|thought|reasoning)>[\s\S]*?<\/\1>/gi, '')
    .replace(/\[(think|thought|reasoning)\][\s\S]*?\[\/\1\]/gi, '')
    .replace(/<(think|thought|reasoning)>[\s\S]*$/gi, '')
    .replace(/\[(think|thought|reasoning)\][\s\S]*$/gi, '');
}

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AIRequest = {
  prompt: string;
  context?: string;
  mode?: 'explainer' | 'tutor' | 'eli5' | 'quiz';
  quizType?: 'mcq' | 'exam' | 'competency' | 'reasoning';
  model?: AIModelId;
  /** Previous turns of the conversation (excluding the current prompt). */
  history?: ChatMessage[];
  /**
   * When true, the server augments the prompt with Exa web-search results
   * (if EXA_API_KEY is configured). The prompt-box sends "[Search: ...]"
   * which the client also normalizes into this flag.
   */
  search?: boolean;
  /**
   * When true, the model reasons step-by-step before answering.
   * The prompt-box sends "[Think: ...]" which the client also normalizes
   * into this flag. Deliberately NOT supported for GPT OSS models
   * (they stay on the fast path).
   */
  think?: boolean;
  /**
   * Attachment file names for display in the user bubble.
   * File text content travels via `context`; this keeps the
   * visible message short while still showing what was attached.
   */
  attachments?: string[];
};

export type AIResponse = {
  content: string;
  suggestions?: string[];
};
