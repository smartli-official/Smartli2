/**
 * NVIDIA NIM Usage Examples
 * 
 * These examples demonstrate how to use each NVIDIA model directly.
 * For integration with the existing Smartli AI gateway, use streamAIResponse() from gateway.ts
 */

import { callKimiK3, callDeepSeek, callGPT } from './nvidia-client';

/**
 * Example 1: Using Kimi K3 for text-based conversation
 */
export async function exampleKimiText() {
  const response = await callKimiK3(
    [
      {
        role: 'user',
        content: 'Explain quantum computing in simple terms.',
      }
    ],
    {
      temperature: 1,
      max_tokens: 16384,
      stream: false
    }
  );

  const content = response.choices[0]?.message?.content;
  console.log('Kimi K3 Response:', content);
  return content;
}

/**
 * Example 2: Using Kimi K3 with vision capabilities
 */
export async function exampleKimiVision() {
  const response = await callKimiK3(
    [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is in this image?'
          },
          {
            type: 'image_url',
            image_url: {
              url: 'https://example.com/image.jpg'
            }
          }
        ]
      }
    ],
    {
      stream: false
    }
  );

  const content = response.choices[0]?.message?.content;
  console.log('Kimi K3 Vision Response:', content);
  return content;
}

/**
 * Example 3: Using DeepSeek with thinking/reasoning
 */
export async function exampleDeepSeek() {
  const response = await callDeepSeek(
    [
      {
        role: 'user',
        content: 'Write a limerick about the wonders of GPU computing.'
      }
    ],
    {
      temperature: 1,
      max_tokens: 16384,
      stream: false,
      thinking: true,
      reasoning_effort: 'high'
    }
  );

  // Extract reasoning and content
  const reasoning = (response.choices[0]?.message as any)?.reasoning_content;
  const content = response.choices[0]?.message?.content;
  
  if (reasoning) {
    console.log('DeepSeek Reasoning:', reasoning);
  }
  console.log('DeepSeek Response:', content);
  
  return { reasoning, content };
}

/**
 * Example 4: Using GPT OSS 20B
 */
export async function exampleGPT() {
  const response = await callGPT(
    [
      {
        role: 'user',
        content: 'Which number is larger, 9.11 or 9.8?'
      }
    ],
    {
      temperature: 1,
      max_tokens: 4096,
      stream: false
    }
  );

  const content = response.choices[0]?.message?.content;
  console.log('GPT Response:', content);
  
  return content;
}

/**
 * Example 5: Streaming response from DeepSeek
 */
export async function exampleDeepSeekStreaming() {
  const response = await callDeepSeek(
    [
      {
        role: 'user',
        content: 'Explain the theory of relativity.'
      }
    ],
    {
      stream: true,
      thinking: true,
      reasoning_effort: 'high'
    }
  );

  console.log('DeepSeek Streaming Response:', response);
  return response;
}

/**
 * Example 6: Multi-turn conversation with context
 */
export async function exampleConversation() {
  const response = await callDeepSeek(
    [
      {
        role: 'user',
        content: 'What is photosynthesis?'
      },
      {
        role: 'assistant',
        content: 'Photosynthesis is the process by which plants convert light energy into chemical energy...'
      },
      {
        role: 'user',
        content: 'How does this relate to the carbon cycle?'
      }
    ],
    {
      temperature: 0.7,
      thinking: true
    }
  );

  const content = response.choices[0]?.message?.content;
  console.log('Conversation Response:', content);
  
  return content;
}
