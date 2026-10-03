'use client';

import React, { useState, useEffect } from 'react';
import { SmartTimer } from '@/components/timer/SmartTimer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX, Volume1, Music, Wind, CloudRain, Coffee, Headphones } from 'lucide-react';

const SOUNDS = [
  { id: 'lofi', name: 'Lofi Beats', icon: Music, url: '/sounds/lofibeats.mp3' },
  { id: 'rain', name: 'Gentle Rain', icon: CloudRain, url: '/sounds/rain.mp3' },
  { id: 'white-noise', name: 'White Noise', icon: Wind, url: '/sounds/whitenoise.mp3' },
  { id: 'cafe', name: 'Cafe Ambience', icon: Coffee, url: '/sounds/cafe.mp3' },
];

export default function FocusPage() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [showVolume, setShowVolume] = useState(false);
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seamless-loop audio engine (Web Audio loop + HTMLAudio fallback).
  const ctxRef = React.useRef<AudioContext | null>(null);
  const sourceRef = React.useRef<AudioBufferSourceNode | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);
  const cacheRef = React.useRef<Map<string, AudioBuffer>>(new Map());
  const requestRef = React.useRef(0);
  const fallbackRef = React.useRef<HTMLAudioElement | null>(null);
  const volumeRef = React.useRef(volume);
  volumeRef.current = volume;
  const mutedRef = React.useRef(isMuted);
  mutedRef.current = isMuted;

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) throw new Error('WebAudio unavailable');
      ctxRef.current = new Ctx();
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    if (!gainRef.current) {
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  };

  const applyGain = () => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(
        mutedRef.current ? 0 : volumeRef.current,
        ctxRef.current.currentTime,
        0.05
      );
    }
    if (fallbackRef.current) {
      fallbackRef.current.volume = volumeRef.current;
      fallbackRef.current.muted = mutedRef.current;
    }
  };

  const stopAll = () => {
    // Invalidate any in-flight fetch/decode so a stale track can't start late.
    requestRef.current += 1;
    try {
      sourceRef.current?.stop();
    } catch {
      /* already stopped */
    }
    try {
      sourceRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    sourceRef.current = null;
    if (fallbackRef.current) fallbackRef.current.pause();
  };

  const startFallbackLoop = (sound: { id: string; name: string; url: string }) => {
    if (!fallbackRef.current) fallbackRef.current = new Audio();
    const el = fallbackRef.current;
    el.pause();
    el.src = sound.url;
    el.loop = true;
    el.preload = 'auto';
    el.volume = volumeRef.current;
    el.muted = mutedRef.current;
    el.currentTime = 0;
    // Belt & suspenders: native loop + manual restart if a browser drops loop.
    el.onended = () => {
      el.currentTime = 0;
      el.play().catch(() => {});
    };
    el.onerror = () => {
      setAudioError(`Couldn't load ${sound.name}. Make sure ${sound.url} exists in /public/sounds.`);
      setActiveSound(null);
    };
    el.load();
    el.play().catch((err) => {
      console.error(`Failed to play ${sound.url}:`, err);
      setAudioError(`Couldn't play ${sound.name}. Check the file exists at public${sound.url}.`);
      setActiveSound(null);
    });
  };

  const startSeamlessLoop = async (sound: { id: string; name: string; url: string }, req: number) => {
    try {
      const ctx = ensureCtx();
      let buffer = cacheRef.current.get(sound.id);
      if (!buffer) {
        const res = await fetch(sound.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.arrayBuffer();
        buffer = await ctx.decodeAudioData(data);
        cacheRef.current.set(sound.id, buffer);
      }
      // A newer selection (or stop) happened while we were loading — bail out.
      if (requestRef.current !== req) return;
      stopSourceOnly();
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gainRef.current ?? ctx.destination);
      applyGain();
      src.start(0);
      sourceRef.current = src;
    } catch (err) {
      // Web Audio failed (or file missing) — fall back to looping <audio>.
      if (requestRef.current !== req) return;
      console.error(`Seamless loop failed for ${sound.url}, using fallback:`, err);
      try {
        startFallbackLoop(sound);
      } catch {
        setAudioError(`Couldn't play ${sound.name}. Check the file exists at public${sound.url}.`);
        setActiveSound(null);
      }
    }
  };

  const stopSourceOnly = () => {
    try {
      sourceRef.current?.stop();
    } catch {
      /* already stopped */
    }
    try {
      sourceRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    sourceRef.current = null;
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAll();
      if (fallbackRef.current) fallbackRef.current.src = '';
      if (ctxRef.current) void ctxRef.current.close().catch(() => {});
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVolumeAreaEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowVolume(true);
  };

  const handleVolumeAreaLeave = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    // Small delay so moving between button and slider doesn't flicker
    hideTimeoutRef.current = setTimeout(() => setShowVolume(false), 180);
  };

  const handleVolumeChange = (next: number) => {
    const clamped = Math.min(1, Math.max(0, next));
    setVolume(clamped);
    // Dragging up from 0 unmutes; dragging to 0 silences (keeps muted flag in sync)
    if (clamped > 0 && mutedRef.current) setIsMuted(false);
  };

  // Keep live gain in sync with volume / mute state.
  useEffect(() => {
    applyGain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, isMuted, activeSound]);

  const toggleSound = (soundId: string) => {
    setAudioError(null);
    if (activeSound === soundId) {
      stopAll();
      setActiveSound(null);
    } else {
      stopAll();
      const sound = SOUNDS.find((s) => s.id === soundId);
      if (!sound) return;
      setActiveSound(soundId);
      const req = requestRef.current;
      void startSeamlessLoop(sound, req);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6 flex flex-col lg:flex-row items-center justify-center gap-16">
      {/* Left Section: The Timer (Centerpiece) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-center opacity-30">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Deep Work Session</p>
        </div>
        <SmartTimer />
      </div>

      {/* Right Section: Soundscape (Architecture) */}
      <div className="w-full max-w-md space-y-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Headphones className="text-primary" size={24} />
            Ambient Space
          </h2>
          <p className="text-muted-foreground font-medium">
            Curate your auditory environment for cognitive flow.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SOUNDS.map((sound) => {
            const Icon = sound.icon;
            return (
              <Button
                key={sound.id}
                variant={activeSound === sound.id ? 'default' : 'secondary'}
                className={cn(
                  'h-20 flex flex-col gap-2 text-center rounded-2xl transition-all duration-300',
                  activeSound === sound.id ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'hover:border-primary/50'
                )}
                onClick={() => toggleSound(sound.id)}
              >
                <Icon size={20} />
                <span className="text-xs font-bold uppercase tracking-tight">{sound.name}</span>
              </Button>
            );
          })}
        </div>

        {audioError && (
          <p className="text-xs font-medium text-destructive bg-destructive/10 rounded-xl px-4 py-3">
            {audioError}
          </p>
        )}

        <Card className="p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeSound ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-1 items-end h-4">
                  <span className="w-1 bg-primary animate-bounce" style={{ height: '40%', animationDelay: '0s' }} />
                  <span className="w-1 bg-primary animate-bounce" style={{ height: '80%', animationDelay: '0.2s' }} />
                  <span className="w-1 bg-primary animate-bounce" style={{ height: '60%', animationDelay: '0.4s' }} />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {SOUNDS.find(s => s.id === activeSound)?.name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic font-medium">Silence is golden...</span>
            )}
          </div>

          <div
            className="relative flex items-center"
            onMouseEnter={handleVolumeAreaEnter}
            onMouseLeave={handleVolumeAreaLeave}
            onFocus={handleVolumeAreaEnter}
            onBlur={handleVolumeAreaLeave}
          >
            {/* Volume slider — fades/slides in on hover, fades out on unhover */}
            <div
              className={cn(
                'absolute right-full mr-3 flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur transition-all duration-300 ease-out',
                showVolume
                  ? 'pointer-events-auto translate-x-0 opacity-100'
                  : 'pointer-events-none translate-x-2 opacity-0'
              )}
              aria-hidden={!showVolume}
            >
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                aria-label="Volume"
                tabIndex={showVolume ? 0 : -1}
                className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              />
              <span className="w-9 text-right text-[11px] font-bold tabular-nums text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 rounded-full bg-muted"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : volume < 0.5 ? (
                <Volume1 size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
