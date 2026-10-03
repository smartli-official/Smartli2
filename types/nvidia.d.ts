/**
 * Type definitions for NVIDIA NIM API integration
 */

export type NvidiaModel = 
  | 'moonshotai/kimi-k3'
  | 'deepseek-ai/deepseek-v4-flash-0731'
  | 'openai/gpt-oss-20b';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ReasoningEffort = 'low' | 'medium' | 'high' | 'max';

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ImageUrlContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

export type MessageContent = string | Array<TextContent | ImageUrlContent>;

export interface ChatMessage {
  role: MessageRole;
  content: MessageContent;
}

export interface NvidiaBaseOptions {
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  seed?: number;
}

export interface KimiK3Options extends NvidiaBaseOptions {
  reasoning_effort?: ReasoningEffort;
}

export interface DeepSeekOptions extends NvidiaBaseOptions {
  thinking?: boolean;
  reasoning_effort?: Exclude<ReasoningEffort, 'max'>;
}

export interface GPTOptions extends NvidiaBaseOptions {
  // GPT has standard options only
}

export interface NvidiaRequestOptions extends NvidiaBaseOptions {
  model: NvidiaModel;
  messages: ChatMessage[];
  reasoning_effort?: ReasoningEffort;
  chat_template_kwargs?: {
    thinking?: boolean;
    reasoning_effort?: string;
  };
}

export interface ChatCompletionMessage {
  role: MessageRole;
  content: string;
  reasoning_content?: string;
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionMessage;
  finish_reason: string | null;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface NvidiaError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

declare module 'openai' {
  export interface ChatCompletionCreateParams {
    chat_template_kwargs?: {
      thinking?: boolean;
      reasoning_effort?: string;
    };
  }
}
