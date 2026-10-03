import axios from 'axios';
import OpenAI from 'openai';

/**
 * NVIDIA NIM API Client
 * Supports Kimi K3, DeepSeek, and GPT models through NVIDIA's unified API
 */

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';

// Lazy-initialized OpenAI client
let _nvidiaClient: OpenAI | null = null;

export function getNvidiaClient() {
  if (!_nvidiaClient) {
    const apiKey = process.env.NVIDIA_API_KEY;
    
    _nvidiaClient = new OpenAI({
      apiKey: apiKey || 'dummy-key',
      baseURL: NVIDIA_BASE_URL,
      // Remove tight custom timeout to allow deep-reasoning models to complete their thought process
      maxRetries: 2,
    });
  }
  return _nvidiaClient;
}

export type NvidiaModel = 
  | 'moonshotai/kimi-k3'
  | 'deepseek-ai/deepseek-v4-flash-0731'
  | 'openai/gpt-oss-20b';

export interface NvidiaRequestOptions {
  model: NvidiaModel;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  seed?: number;
  reasoning_effort?: 'low' | 'medium' | 'high' | 'max';
  chat_template_kwargs?: {
    thinking?: boolean;
    reasoning_effort?: string;
  };
}

/**
 * Unified call using OpenAI SDK
 */
export async function callNvidiaWithOpenAI(options: NvidiaRequestOptions) {
  const client = getNvidiaClient();
  
  try {
    const completion = await client.chat.completions.create({
      model: options.model,
      messages: options.messages as any,
      temperature: options.temperature ?? 1,
      top_p: options.top_p ?? (options.model.includes('deepseek') ? 0.95 : 1),
      max_tokens: options.max_tokens ?? 16384,
      stream: options.stream ?? false,
      // Pass NVIDIA-specific parameters directly (not in extra_body)
      ...(options.chat_template_kwargs && {
        chat_template_kwargs: options.chat_template_kwargs,
      }),
    } as any);

    return completion;
  } catch (error) {
    console.error(`NVIDIA API Error (${options.model}):`, error);
    throw error;
  }
}

/**
 * Fallback Axios call
 */
export async function callNvidiaWithAxios(options: NvidiaRequestOptions) {
  const apiKey = process.env.NVIDIA_API_KEY;
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': options.stream ? 'text/event-stream' : 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(
      `${NVIDIA_BASE_URL}/chat/completions`,
      {
        messages: options.messages,
        model: options.model,
        max_tokens: options.max_tokens || 16384,
        temperature: options.temperature || 1,
        stream: options.stream || false,
        ...(options.reasoning_effort && { reasoning_effort: options.reasoning_effort }),
      },
      {
        headers,
        timeout: 120000,
        responseType: options.stream ? 'stream' : 'json',
      }
    );

    return response;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Kimi K3
 */
export async function callKimiK3(
  messages: NvidiaRequestOptions['messages'],
  options?: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }
) {
  return callNvidiaWithOpenAI({
    model: 'moonshotai/kimi-k3',
    messages,
    temperature: options?.temperature ?? 1,
    max_tokens: options?.max_tokens ?? 16384,
    stream: options?.stream ?? false,
    // reasoning_effort intentionally omitted — causes timeouts on NVIDIA NIM
  });
}

/**
 * DeepSeek V4 Flash
 */
export async function callDeepSeek(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options?: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    thinking?: boolean;
    reasoning_effort?: 'low' | 'medium' | 'high';
  }
) {
  return callNvidiaWithOpenAI({
    model: 'deepseek-ai/deepseek-v4-flash-0731',
    messages,
    temperature: options?.temperature ?? 1,
    top_p: 0.95,
    max_tokens: options?.max_tokens ?? 16384,
    stream: options?.stream ?? false,
    chat_template_kwargs: {
      thinking: options?.thinking ?? true,
      reasoning_effort: options?.reasoning_effort ?? 'high',
    },
  });
}

/**
 * GPT OSS 20B
 */
export async function callGPT(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options?: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  }
) {
  return callNvidiaWithOpenAI({
    model: 'openai/gpt-oss-20b',
    messages,
    temperature: options?.temperature ?? 1,
    top_p: 1,
    max_tokens: options?.max_tokens ?? 4096,
    stream: options?.stream ?? false,
  });
}

/**
 * Unified function to call any NVIDIA model
 */
export async function callNvidiaModel(
  model: NvidiaModel,
  messages: NvidiaRequestOptions['messages'],
  options?: Omit<NvidiaRequestOptions, 'model' | 'messages'>
) {
  switch (model) {
    case 'moonshotai/kimi-k3':
      return callKimiK3(messages, options);
    case 'deepseek-ai/deepseek-v4-flash-0731':
      return callDeepSeek(messages as any, options as any);
    case 'openai/gpt-oss-20b':
      return callGPT(messages as any, options);
    default:
      throw new Error(`Unsupported model: ${model}`);
  }
}
