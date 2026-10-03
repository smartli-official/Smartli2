import { NextRequest, NextResponse } from 'next/server';
import { callNvidiaModel } from '@/lib/ai/nvidia-client';
import type { NvidiaModel } from '@/types/nvidia';

/**
 * POST /api/nvidia
 * Test endpoint for NVIDIA NIM API integration
 * 
 * Body:
 * {
 *   "model": "moonshotai/kimi-k3" | "deepseek-ai/deepseek-v4-flash-0731" | "openai/gpt-oss-20b",
 *   "message": "Your question here",
 *   "options": { optional parameters }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, message, options = {} } = body;

    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare messages
    const messages = [
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Call NVIDIA API
    const response = await callNvidiaModel(
      model as NvidiaModel,
      messages,
      {
        stream: false,
        ...options
      }
    );

    // Handle different response formats
    if ('data' in response && response.data) {
      // Axios response (Kimi K3)
      return NextResponse.json({
        success: true,
        model,
        response: response.data
      });
    } else if ('choices' in response) {
      // OpenAI SDK response (DeepSeek and GPT)
      const reasoning = (response.choices[0]?.message as any)?.reasoning_content;
      const content = response.choices[0]?.message?.content;

      return NextResponse.json({
        success: true,
        model,
        response: {
          content,
          reasoning,
          usage: response.usage
        }
      });
    }

    return NextResponse.json(
      { error: 'Unexpected response format' },
      { status: 500 }
    );

  } catch (error: any) {
    console.error('NVIDIA API Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process NVIDIA API request',
        details: error.message,
        ...(error.response && { apiError: error.response.data })
      },
      { status: 500 }
    );
  }
}
