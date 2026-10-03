'use client';

import { PromptInputBox, PromptModeToggle, type PromptMode } from '@/components/ui/prompt-input-box';
import { useState } from 'react';
import { type AIModelId, AI_MODELS } from '@/lib/ai/config';
import Image from 'next/image';

export function AiPromptBoxDemo() {
  const [mode, setMode] = useState<PromptMode>('explainer');
  const [model, setModel] = useState<AIModelId>(AI_MODELS[0].id);

  return (
    <div className="relative flex w-full max-w-4xl flex-col items-center justify-center px-4 md:px-8 pt-32">
      <div className="absolute top-8 left-0 right-0 z-50 flex flex-col items-center text-center">
        <PromptModeToggle 
          mode={mode} 
          onModeChange={setMode} 
          className="scale-110 shadow-lg bg-background/90 backdrop-blur-sm"
        />
      </div>

      <div className="flex flex-col items-center text-center mb-16 gap-6">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm">
            <Image 
              src="/assets/branding/logo.png" 
              alt="Smartli Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Smartli <span className="text-primary">Intelligence</span>
          </h1>
        </div>
      </div>

      <PromptInputBox
        mode={mode}
        onModeChange={setMode}
        showToggle={false}
        model={model}
        onModelChange={setModel}
        onSend={(message, files) => {
          console.log('Model:', model);
          console.log('Message:', message);
          console.log('Files:', files);
        }}
        placeholder="Ask me anything..."
        className="max-w-4xl"
      />

      <p className="mt-6 text-center text-xs text-zinc-600 dark:text-gray-500">
        {mode === 'quiz'
          ? 'Quiz mode tests you instead of explaining.'
          : 'Explainer mode is ready to break down any topic.'}
      </p>
    </div>
  );
}
