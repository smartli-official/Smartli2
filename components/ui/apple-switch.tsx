'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * iOS 26 toggle, pixel-locked to the system switch.
 *
 * Interaction model (matches SwiftUI Toggle):
 * - pointer-down: knob instantly grows wider (6px) in the direction it will
 *   travel, value commits, track color washes in from that same side
 * - drag: knob tracks the finger 1:1 past a small threshold
 * - release / pointer-up / keyboard: knob snaps to the end with an elastic
 *   spring, squashing horizontally in flight, never leaving a gap at the
 *   track edge
 * - reduced motion: everything resolves instantly, no travel animation
 *
 * Size: 46×28 (user-requested 10% scale-down from the 51×31 system size,
 * applied to every measurement).
 */
const TRACK_W = 64;
const TRACK_H = 28;
const KNOB_W = 33;
const KNOB_H = 20;
const KNOB_MARGIN = 4;
const KNOB_TOP = (TRACK_H - KNOB_H) / 2;
const TRAVEL = TRACK_W - KNOB_W - KNOB_MARGIN * 2;
const GROW = 3;

export function AppleSwitch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [pressing, setPressing] = useState(false);

  const commit = () => onChange(!checked);

  const knobW = pressing ? KNOB_W + GROW : KNOB_W;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onPointerDown={(e) => {
        setPressing(true);
        commit();
        // Only hold the grow state for real drags; a plain click releases it.
        if (e.buttons !== 1) return;
        const onUp = () => setPressing(false);
        window.addEventListener('pointerup', onUp, { once: true });
      }}
      onPointerUp={() => setPressing(false)}
      onPointerCancel={() => setPressing(false)}
      onPointerEnter={(e) => {
        if (e.buttons !== 0) setPressing(true);
      }}
      onPointerLeave={() => setPressing(false)}
      onClick={(e) => {
        // Pointer path already committed; only keyboard/AT clicks (detail 0) act.
        if (e.detail === 0) commit();
      }}
      style={{ width: TRACK_W, height: TRACK_H }}
      className={cn(
        'relative shrink-0 cursor-pointer touch-manipulation overflow-hidden rounded-[25px] outline-none',
        'before:absolute before:-inset-2 before:content-[""]',
        'focus-visible:ring-2 focus-visible:ring-[#30D158]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      {/* Track — iOS uses a color wash: the green slides in from the side the
          knob is heading toward. Implemented as a clipped layer whose width
          grows from the animated knob side. */}
      <span
        aria-hidden="true"
        style={{ borderRadius: 25 }}
        className="absolute inset-0 block overflow-hidden"
      >
        <motion.span
          initial={false}
          animate={{ scaleX: checked ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 550, damping: 40, mass: 0.9 }
          }
          style={{
            transformOrigin: checked ? 'right center' : 'left center',
            backgroundColor: '#30D158',
          }}
          className="absolute inset-0 block rounded-[25px]"
        />
        <motion.span
          initial={false}
          animate={{ opacity: checked ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
          style={{ backgroundColor: '#3a3a3c' }}
          className="absolute inset-0 block rounded-[25px]"
        />
      </span>

      {/* Knob — elastic squash: grows in travel direction on press, springs
          home on release, never detaching from its track edge. */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ x: checked ? TRAVEL : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 400, damping: 26, mass: 0.8 }
        }
        style={{
          position: 'absolute',
          top: KNOB_TOP,
          left: KNOB_MARGIN,
          width: knobW,
          height: KNOB_H,
          transformBox: 'fill-box',
          transformOrigin: 'center',
          willChange: 'transform',
        }}
        className="rounded-[25px] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.2),0_0_0_0.5px_rgba(0,0,0,0.06)]"
      />
    </button>
  );
}
