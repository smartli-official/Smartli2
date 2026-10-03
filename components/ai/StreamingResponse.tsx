'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { normalizeMathDelimiters } from '@/lib/format/normalizeMath';

interface StreamingResponseProps {
  text: string;
  className?: string;
}

export const StreamingResponse = ({ text, className }: StreamingResponseProps) => {
  const normalized = useMemo(() => normalizeMathDelimiters(text), [text]);
  const tokens = useMemo(() => normalized.split(/(\s+)/), [normalized]);

  return (
    <div className={cn('leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200', className)}>
      <AnimatePresence mode="popLayout">
        {tokens.map((token, index) => (
          <motion.span
            key={`${index}-${token}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="inline-block"
          >
            {token}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};
