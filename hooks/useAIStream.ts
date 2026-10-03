import { useState, useRef, useCallback } from 'react';
import { AIRequest } from '@/lib/ai/config';
import { getCachedResponse, setCachedResponse } from '@/lib/ai/cache';
import { filterAIStream } from '@/lib/ai/config';
import { usePlanUsage } from '@/hooks/usePlanUsage';

export function useAIStream() {
  const [streamText, setStreamText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { canUse, bump } = usePlanUsage();

  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async (request: AIRequest) => {
    // Reset state
    setStreamText('');
    setIsLoading(true);
    setError(null);
    setIsComplete(false);

    // Hard gate: exhausted message quota never reaches the API.
    if (!canUse('messages')) {
      const err = new Error('You have hit your limits.');
      (err as any).limitKind = 'messages';
      (err as any).status = 402;
      setError(err);
      setIsLoading(false);
      throw err;
    }

    // 1. Check Cache
    const cached = getCachedResponse(request.prompt, request.mode || 'explainer');
    if (cached) {
      setStreamText(cached);
      setIsLoading(false);
      setIsComplete(true);
      return;
    }

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
          limitKind?: string;
        };
        if (response.status === 401) {
          const err = new Error(errorData.error || 'You have to be logged in to use AI features.');
          (err as any).limitKind = 'auth';
          (err as any).status = response.status;
          throw err;
        }
        if (response.status === 402 || response.status === 429) {
          const err = new Error(errorData.error || 'You have hit your limits.');
          (err as any).limitKind = (errorData as any).limitKind ?? 'messages';
          (err as any).status = response.status;
          throw err;
        }
        throw new Error(errorData.error || 'AI streaming failed');
      }

      const responseStream = response.body;
      if (!responseStream) throw new Error('No response body received');

      const reader = responseStream.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // 2. Real-time cleaning
        const filteredText = filterAIStream(accumulatedText);
        setStreamText(filteredText);
      }

      // 3. Cache the final result
      setCachedResponse(request.prompt, request.mode || 'explainer', filterAIStream(accumulatedText));
      bump({ messagesUsed: 1 });
      setIsComplete(true);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        if ((err as any)?.status === 401 || (err as any)?.status === 402 || (err as any)?.status === 429 || (err as any)?.limitKind) throw err;
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [canUse, bump]);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    streamText,
    isLoading,
    error,
    isComplete,
    startStream,
    stopStream,
  };
}
