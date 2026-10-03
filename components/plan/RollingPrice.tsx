'use client';

import { Fragment } from 'react';
import { useReducedMotion } from 'framer-motion';
import { priceParts, type CurrencyCode } from './currency';

const REEL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Number ticker — each digit is an odometer reel that rolls (translateY)
 * to its new value. Reels are keyed from the ones place so the same
 * column persists across changes and rolls instead of remounting.
 *
 * - Tool: CSS transition on transform (interruptible, GPU-composited).
 * - Curve: codebase --ease-out equivalent cubic-bezier(0.23, 1, 0.32, 1).
 * - Stagger: ones place leads, +35ms per column to the left (cap 5).
 * - Reduced motion: transitions off, digits swap instantly.
 */
function DigitReel({
  digit,
  posFromRight,
  reduceMotion,
  fadeOnMount,
}: {
  digit: number;
  posFromRight: number;
  reduceMotion: boolean;
  fadeOnMount: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={
        'inline-block h-[1em] w-[1ch] overflow-hidden text-center align-top' +
        (fadeOnMount && !reduceMotion ? ' animate-fade-in' : '')
      }
    >
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(${-digit}em)`,
          transition: reduceMotion
            ? 'none'
            : `transform 400ms cubic-bezier(0.23, 1, 0.32, 1) ${Math.min(posFromRight, 5) * 35}ms`,
        }}
      >
        {REEL_DIGITS.map((d) => (
          <span
            key={d}
            className="flex h-[1em] w-[1ch] items-center justify-center leading-none"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function RollingPrice({
  amount,
  currency,
}: {
  amount: number;
  currency: CurrencyCode;
}) {
  const reduceMotion = useReducedMotion();
  const parts = priceParts(amount, currency);
  const fullText = parts.map((p) => p.value).join('');

  // Total digit count, so reel keys anchor to the ones place.
  let totalDigits = 0;
  for (const part of parts) {
    if (part.type === 'integer' || part.type === 'fraction') {
      totalDigits += part.value.length;
    }
  }

  let seenFromLeft = 0;

  return (
    <span
      role="text"
      aria-label={fullText}
      className="inline-flex items-start leading-none tabular-nums"
    >
      {parts.map((part, i) => {
        if (part.type === 'integer' || part.type === 'fraction') {
          const chars = part.value.split('');
          const start = seenFromLeft;
          seenFromLeft += chars.length;
          return (
            <Fragment key={`digits-${i}`}>
              {chars.map((ch, j) => {
                const posFromRight = totalDigits - 1 - (start + j);
                return (
                  <DigitReel
                    key={`reel-${posFromRight}`}
                    digit={Number(ch)}
                    posFromRight={posFromRight}
                    reduceMotion={reduceMotion ?? false}
                    fadeOnMount
                  />
                );
              })}
            </Fragment>
          );
        }
        // Currency symbols, group separators, literals: swap with a fade.
        return (
          <span
            key={`${part.type}-${i}-${part.value}`}
            className={reduceMotion ? undefined : 'animate-fade-in'}
          >
            {part.value}
          </span>
        );
      })}
    </span>
  );
}
