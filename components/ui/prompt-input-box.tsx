'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  BrainCog,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  FileImage,
  FileText,
  FileUp,
  FolderCog,
  Globe,
  GraduationCap,
  Layers,
  Loader2,
  Mic,
  Paperclip,
  Plus,
  Square,
  StopCircle,
  X,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { AI_MODELS, type AIModelId } from '@/lib/ai/config';
import { cn } from '@/lib/utils';
import { usePlanUsage } from '@/hooks/usePlanUsage';
import { LimitReachedModal } from '@/components/plan/LimitReachedModal';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';

const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea {
    line-height: 1.6 !important;
  }
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #444444;
    border-radius: 3px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: #555555;
  }
`;

const useStyleInjection = () => {
  React.useEffect(() => {
    const styleId = 'ai-prompt-box-styles';
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);
};

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'scrollbar-thin scrollbar-thumb-[#444444] scrollbar-track-transparent hover:scrollbar-thumb-[#555555] flex min-h-[44px] w-full resize-none border-none bg-transparent px-3 py-2.5 text-base text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:placeholder:text-gray-400',
        className,
      )}
      ref={ref}
      rows={1}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md border border-[#a1a1aa] bg-white dark:border-[#333333] dark:bg-[#1F2023] px-3 py-1.5 text-sm text-zinc-900 shadow-md dark:text-white data-[state=closed]:animate-out',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[90vw] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-[#a1a1aa] bg-white dark:border-[#333333] dark:bg-[#1F2023] p-0 shadow-xl duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in md:max-w-[800px]',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 z-10 rounded-full bg-zinc-950/[0.06] p-2 transition-all hover:bg-zinc-950/10 dark:bg-[#2E3033]/80 dark:hover:bg-[#2E3033]">
        <X className="h-5 w-5 text-zinc-600 hover:text-zinc-950 dark:text-gray-200 dark:hover:text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-semibold text-zinc-950 text-lg leading-none tracking-tight dark:text-gray-100',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white hover:bg-white/80 text-black',
      outline: 'border border-[#444444] bg-transparent hover:bg-[#3A3A40]',
      ghost: 'bg-transparent hover:bg-[#3A3A40]',
    };
    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-6',
      icon: 'h-8 w-8 rounded-full aspect-[1/1]',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
  stream?: MediaStream | null;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  visualizerBars = 32,
  stream = null,
}) => {
  const [time, setTime] = React.useState(0);
  const timeRef = React.useRef(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const wasRecordingRef = React.useRef(false);
  const onStartRecordingRef = React.useRef(onStartRecording);
  const onStopRecordingRef = React.useRef(onStopRecording);
  const barRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const levelsRef = React.useRef<number[]>(Array(visualizerBars).fill(0.06));

  onStartRecordingRef.current = onStartRecording;
  onStopRecordingRef.current = onStopRecording;
  timeRef.current = time;

  React.useEffect(() => {
    if (isRecording) {
      wasRecordingRef.current = true;
      onStartRecordingRef.current();
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (wasRecordingRef.current) {
        onStopRecordingRef.current(timeRef.current);
        wasRecordingRef.current = false;
        setTime(0);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Live mic visualizer: drive each bar from the actual microphone signal
  // via Web Audio time-domain data (one slice of the waveform per bar).
  React.useEffect(() => {
    if (!isRecording || !stream) return;

    let audioContext: AudioContext | null = null;
    let rafId = 0;
    let cancelled = false;

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextCtor) return;
      audioContext = new AudioContextCtor();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.55;
      source.connect(analyser);
      const buffer = new Uint8Array(analyser.fftSize);

      const tick = () => {
        if (cancelled) return;
        analyser.getByteTimeDomainData(buffer);
        const slice = Math.floor(buffer.length / visualizerBars);
        for (let i = 0; i < visualizerBars; i++) {
          let peak = 0;
          const start = i * slice;
          for (let j = start; j < start + slice; j++) {
            const deviation = Math.abs((buffer[j] ?? 128) - 128) / 128;
            if (deviation > peak) peak = deviation;
          }
          // Boost quiet speech a little so whispers still move the bars.
          const target = Math.min(1, peak * 1.6);
          const prev = levelsRef.current[i] ?? 0.06;
          // Fast attack, slower release for a natural VU-meter feel.
          const next =
            target > prev ? prev + (target - prev) * 0.6 : prev + (target - prev) * 0.18;
          levelsRef.current[i] = next;
          const bar = barRefs.current[i];
          if (bar) {
            bar.style.height = `${Math.max(8, next * 100)}%`;
          }
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    } catch {
      // If Web Audio is unavailable, leave the idle bars as-is.
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      levelsRef.current = Array(visualizerBars).fill(0.06);
      if (audioContext) {
        void audioContext.close().catch(() => {});
      }
    };
  }, [isRecording, stream, visualizerBars]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center py-3 transition-all duration-300',
        isRecording ? 'opacity-100' : 'h-0 opacity-0',
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="font-mono text-sm text-zinc-700 dark:text-white/80">
          {formatTime(time)}
        </span>
      </div>
      <div className="flex h-10 w-full items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="w-0.5 rounded-full bg-zinc-400 transition-[height] duration-75 dark:bg-white/50"
            style={{ height: '8%' }}
          />
        ))}
      </div>
    </div>
  );
};

interface ImageViewDialogProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageViewDialog: React.FC<ImageViewDialogProps> = ({
  imageUrl,
  onClose,
}) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none md:max-w-[800px]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl bg-zinc-200 shadow-2xl dark:bg-[#1F2023]"
        >
          <div className="relative max-h-[80vh] w-full">
            <img
              src={imageUrl}
              alt="Full preview"
              width={800}
              height={600}
              className="rounded-2xl object-contain"
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

interface CameraCaptureDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

/** Seamless in-app camera: live preview, front/back switch, capture to JPEG. */
const CameraCaptureDialog: React.FC<CameraCaptureDialogProps> = ({
  open,
  onClose,
  onCapture,
}) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [facingMode, setFacingMode] = React.useState<'environment' | 'user'>('environment');
  const [capturing, setCapturing] = React.useState(false);
  const onCaptureRef = React.useRef(onCapture);
  onCaptureRef.current = onCapture;

  const stopStream = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  React.useEffect(() => {
    if (!open) {
      stopStream();
      setError(null);
      return;
    }
    let cancelled = false;
    const start = async () => {
      setError(null);
      stopStream();
      try {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera is not supported in this browser.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        setError(
          err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera access was denied. Allow access and try again.'
            : err instanceof Error
              ? err.message
              : 'Could not access the camera.',
        );
      }
    };
    void start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, facingMode, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    setCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          setCapturing(false);
          if (!blob) {
            setError('Could not capture the photo. Try again.');
            return;
          }
          const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCaptureRef.current(file);
          onClose();
        },
        'image/jpeg',
        0.92,
      );
    } catch {
      setCapturing(false);
      setError('Could not capture the photo. Try again.');
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-[560px]">
        <DialogTitle>Use camera</DialogTitle>
        <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-black">
          {error ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-300">
                <Camera className="h-6 w-6" />
              </span>
              <p className="text-sm text-zinc-700 dark:text-gray-300">{error}</p>
              <p className="text-xs text-zinc-600 dark:text-gray-500">Tip: on mobile the native camera opens automatically.</p>
            </div>
          ) : (
            <video ref={videoRef} playsInline muted autoPlay className="aspect-[4/3] w-full object-cover" />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 pb-1">
          <button
            type="button"
            onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Switch camera
          </button>
          <button
            type="button"
            onClick={handleCapture}
            disabled={!!error || capturing}
            className="inline-flex items-center gap-2 rounded-full bg-[#346bf1] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#346bf1]/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {capturing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            {capturing ? 'Capturing…' : 'Capture photo'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}

const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: '',
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});

function usePromptInput() {
  return React.useContext(PromptInputContext);
}

interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value: value ?? internalValue,
            setValue: onValueChange ?? handleChange,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              'rounded-[32px] border border-[#a1a1aa] bg-[#ececef] px-4 pt-4 pb-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 dark:border-[#444444] dark:bg-[#1F2023] dark:shadow-[0_8px_30px_rgba(0,0,0,0.24)]',
              isLoading && 'border-red-500/70',
              className,
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="form"
            aria-label="Prompt Input Area"
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  },
);
PromptInput.displayName = 'PromptInput';

interface PromptInputTextareaProps {
  disableAutosize?: boolean;
  placeholder?: string;
}

const PromptInputTextarea: React.FC<
  PromptInputTextareaProps & React.ComponentProps<typeof Textarea>
> = ({
  className,
  onKeyDown,
  disableAutosize = false,
  placeholder,
  ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height =
      typeof maxHeight === 'number'
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn('px-1 text-base py-2', className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptInputActions: React.FC<PromptInputActionsProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('flex items-center gap-2 pt-1', className)} {...props}>
    {children}
  </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const PromptInputAction: React.FC<PromptInputActionProps> = ({
  tooltip,
  children,
  className,
  side = 'top',
  ...props
}) => {
  const { disabled } = usePromptInput();

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

const CustomDivider: React.FC = () => (
  <div className="relative mx-1 h-6 w-[1.5px]">
    <div
      className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent"
      style={{
        clipPath:
          'polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)',
      }}
    />
  </div>
);

export type PromptMode = 'explainer' | 'quiz';

interface PromptModeToggleProps {
  mode: PromptMode;
  onModeChange: (mode: PromptMode) => void;
  className?: string;
  disabled?: boolean;
}

export const PromptModeToggle: React.FC<PromptModeToggleProps> = ({
  mode,
  onModeChange,
  className,
  disabled,
}) => (
  <div
    className={cn(
      'mb-3 flex w-fit items-center gap-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm p-1 relative',
      className,
    )}
    role="group"
    aria-label="AI response mode"
  >
    {(
      [
        {
          value: 'explainer' as const,
          label: 'Explainer',
          description: 'Learn with a clear explanation',
          icon: GraduationCap,
          activeColor: 'bg-[#9b87f5]/20 text-[#c4b5fd]',
          bgId: 'explainer-bg'
        },
        {
          value: 'quiz' as const,
          label: 'Quiz',
          description: 'Practice with questions',
          icon: Check,
          activeColor: 'bg-emerald-500/20 text-emerald-300',
          bgId: 'quiz-bg'
        },
      ]
    ).map(({ value, label, description, icon: Icon, activeColor }) => {
      const isActive = mode === value;
      return (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          disabled={disabled}
          aria-pressed={isActive}
          title={description}
          className={cn(
            'relative inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 z-10',
            isActive ? activeColor : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {isActive && (
            <motion.div
              layoutId="active-mode-bg"
              className={cn(
                "absolute inset-0 rounded-full shadow-sm z-[-1]",
                value === 'quiz' ? 'bg-emerald-500/20' : 'bg-[#9b87f5]/20'
              )}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{label}</span>
          {isActive && <span className="sr-only">selected</span>}
        </button>
      );
    })}
  </div>
);

interface PromptInputBoxProps {
  onSend?: (message: string, files: File[], fileContext?: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  mode?: PromptMode;
  onModeChange?: (mode: PromptMode) => void;
  showToggle?: boolean;
  model?: AIModelId;
  onModelChange?: (model: AIModelId) => void;
  showSuggestions?: boolean;
  /** False for logged-out visitors — send/voice/parse never hit the API. */
  signedIn?: boolean;
  /** When provided, login prompts route to the parent's modal. */
  onLoginRequired?: () => void;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
  (
    {
      onSend = () => {},
      onStop,
      isLoading = false,
      placeholder = 'Type your message here...',
      className,
      mode: controlledMode,
      onModeChange,
      showToggle = true,
      model: controlledModel,
      onModelChange,
      showSuggestions,
      signedIn = true,
      onLoginRequired,
    },
    ref,
  ) => {
    useStyleInjection();

    const [input, setInput] = React.useState('');
    const [files, setFiles] = React.useState<File[]>([]);
    const [filePreviews, setFilePreviews] = React.useState<{
      [key: string]: string;
    }>({});
    const [selectedImage, setSelectedImage] = React.useState<string | null>(
      null,
    );
    const [isRecording, setIsRecording] = React.useState(false);
    const [isTranscribing, setIsTranscribing] = React.useState(false);
    const [transcriptionError, setTranscriptionError] = React.useState<
      string | null
    >(null);
    // Hard usage gate for voice transcription — when exhausted we never
    // call /api/transcribe and open the Sorry! modal instead.
    const { plan, canUse, bump, nextResetLabel } = usePlanUsage();
    const [voiceLimitOpen, setVoiceLimitOpen] = React.useState(false);
    // Auth gate: logged-out visitors never reach any AI API — voice,
    // parsing, or send. Routes to the parent modal when provided.
    const [loginOpen, setLoginOpen] = React.useState(false);
    const openLogin = React.useCallback(() => {
      if (onLoginRequired) onLoginRequired();
      else setLoginOpen(true);
    }, [onLoginRequired]);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);
    const mediaStreamRef = React.useRef<MediaStream | null>(null);
    const [liveStream, setLiveStream] = React.useState<MediaStream | null>(
      null,
    );
    const [showSearch, setShowSearch] = React.useState(false);
    const [showThink, setShowThink] = React.useState(false);
    const [showCanvas, setShowCanvas] = React.useState(false);
    const [internalMode, setInternalMode] =
      React.useState<PromptMode>('explainer');
    const [internalModel, setInternalModel] = React.useState<AIModelId>(
      AI_MODELS[0].id,
    );
    const [showModelMenu, setShowModelMenu] = React.useState(false);
    const [reasoningType, setReasoningType] = React.useState<'Normal' | 'High'>('Normal');
    const [showReasoningMenu, setShowReasoningMenu] = React.useState(false);
    const [hoveredModelId, setHoveredModelId] = React.useState<string | null>(null);
    // Attach-menu dropdown (file button) + camera dialog state.
    const [showAttachMenu, setShowAttachMenu] = React.useState(false);
    const [showCamera, setShowCamera] = React.useState(false);
    const [fileError, setFileError] = React.useState<string | null>(null);
    const [parsingFiles, setParsingFiles] = React.useState<Record<string, boolean>>({});
    const [fileTexts, setFileTexts] = React.useState<Record<string, string>>({});
    // Refs mirror the maps above so processFiles can dedupe without stale closures.
    const filesRef = React.useRef<File[]>([]);
    const fileTextsRef = React.useRef<Record<string, string>>({});
    const parsingRef = React.useRef<Record<string, boolean>>({});
    React.useEffect(() => {
      filesRef.current = files;
    }, [files]);
    React.useEffect(() => {
      fileTextsRef.current = fileTexts;
    }, [fileTexts]);
    React.useEffect(() => {
      parsingRef.current = parsingFiles;
    }, [parsingFiles]);
    const attachMenuRef = useRef<HTMLDivElement | null>(null);
    const cameraInputRef = React.useRef<HTMLInputElement>(null);

    const uploadInputRef = React.useRef<HTMLInputElement>(null);
    const promptBoxRef = React.useRef<HTMLDivElement>(null);
    const mode = controlledMode ?? internalMode;
    const model = controlledModel ?? internalModel;
    // Think mode is not supported for GPT OSS models — the toggle is
    // disabled for them and any stale toggle state is cleared.
    const isGptOssModel = model.startsWith('openai/');

    React.useEffect(() => {
      if (isGptOssModel) setShowThink(false);
    }, [isGptOssModel]);

    const handleModeChange = (nextMode: PromptMode) => {
      setInternalMode(nextMode);
      onModeChange?.(nextMode);
    };

    const handleToggleChange = (value: string) => {
      if (value === 'search') {
        setShowSearch((prev) => !prev);
        setShowThink(false);
      } else if (value === 'think') {
        if (isGptOssModel) return;
        setShowThink((prev) => !prev);
        setShowSearch(false);
      }
    };

    const handleCanvasToggle = () => setShowCanvas((prev) => !prev);

    const allSuggestions = React.useMemo(() => ({
      quiz: [
        { label: 'Calculus Practice', icon: GraduationCap, prompt: 'Generate 5 challenging Calculus integration problems', color: 'text-blue-600 dark:text-blue-400', hover: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
        { label: 'History Quiz', icon: Check, prompt: 'Quiz me on the major events of the French Revolution', color: 'text-emerald-600 dark:text-emerald-400', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
        { label: 'Bio Competency', icon: BrainCog, prompt: 'Test my knowledge on DNA replication and transcription', color: 'text-amber-600 dark:text-amber-400', hover: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
        { label: 'Physics Laws', icon: Globe, prompt: 'Create a quiz about Newton\'s Laws of Motion', color: 'text-purple-600 dark:text-purple-400', hover: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
        { label: 'Vocab Practice', icon: GraduationCap, prompt: 'Test my advanced English vocabulary with context sentences', color: 'text-rose-600 dark:text-rose-400', hover: 'hover:border-rose-500/50 hover:bg-rose-500/10' },
        { label: 'Chem Bonding', icon: Check, prompt: 'Quiz me on ionic vs covalent bonding principles', color: 'text-cyan-600 dark:text-cyan-400', hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
        { label: 'Literature Quiz', icon: BrainCog, prompt: 'Test my understanding of symbolism in "The Great Gatsby"', color: 'text-indigo-600 dark:text-indigo-400', hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/10' },
        { label: 'World Map', icon: Globe, prompt: 'Quiz me on European capitals and geography', color: 'text-orange-600 dark:text-orange-400', hover: 'hover:border-orange-500/50 hover:bg-orange-500/10' },
        { label: 'Coding Logic', icon: Paperclip, prompt: 'Give me 3 logic puzzles involving algorithms', color: 'text-teal-600 dark:text-teal-400', hover: 'hover:border-teal-500/50 hover:bg-teal-500/10' },
        { label: 'Econ Basics', icon: Check, prompt: 'Quiz me on Supply and Demand curves', color: 'text-pink-600 dark:text-pink-400', hover: 'hover:border-pink-500/50 hover:bg-pink-500/10' },
        { label: 'Art History', icon: Globe, prompt: 'Test me on Renaissance period artists and works', color: 'text-yellow-600 dark:text-yellow-400', hover: 'hover:border-yellow-500/50 hover:bg-yellow-500/10' },
        { label: 'Psychology', icon: BrainCog, prompt: 'Quiz me on different types of memory (Short vs Long term)', color: 'text-violet-600 dark:text-violet-400', hover: 'hover:border-violet-500/50 hover:bg-violet-500/10' },
        { label: 'Data Structures', icon: Paperclip, prompt: 'Test my knowledge on Linked Lists and Binary Trees', color: 'text-lime-600 dark:text-lime-400', hover: 'hover:border-lime-500/50 hover:bg-lime-500/10' },
      ],
      explainer: [
        { label: 'Quantum Physics', icon: Globe, prompt: 'Explain Quantum Entanglement like I am 5 years old', color: 'text-purple-600 dark:text-purple-400', hover: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
        { label: 'Study Science', icon: BrainCog, prompt: 'What are the most effective evidence-based study methods?', color: 'text-rose-600 dark:text-rose-400', hover: 'hover:border-rose-500/50 hover:bg-rose-500/10' },
        { label: 'React Perf', icon: Paperclip, prompt: 'How do I optimize large lists in React with virtualization?', color: 'text-cyan-600 dark:text-cyan-400', hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
        { label: 'Black Holes', icon: Globe, prompt: 'Explain how Hawking Radiation works', color: 'text-blue-600 dark:text-blue-400', hover: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
        { label: 'Neural Networks', icon: BrainCog, prompt: 'Break down how backpropagation works in Deep Learning', color: 'text-emerald-600 dark:text-emerald-400', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
        { label: 'Market Cycles', icon: Check, prompt: 'Explain the difference between a Bear and Bull market', color: 'text-amber-600 dark:text-amber-400', hover: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
        { label: 'Photosynthesis', icon: Globe, prompt: 'Explain the light-dependent reactions in simple terms', color: 'text-green-600 dark:text-green-400', hover: 'hover:border-green-500/50 hover:bg-green-500/10' },
        { label: 'Blockchain', icon: Paperclip, prompt: 'How does a consensus algorithm like Proof of Work function?', color: 'text-zinc-600 dark:text-zinc-400', hover: 'hover:border-zinc-500/50 hover:bg-zinc-500/10' },
        { label: 'Stoicism', icon: BrainCog, prompt: 'What are the core principles of Stoic philosophy?', color: 'text-orange-600 dark:text-orange-400', hover: 'hover:border-orange-500/50 hover:bg-orange-500/10' },
        { label: 'Genetic Editing', icon: Check, prompt: 'Explain the CRISPR-Cas9 mechanism', color: 'text-red-600 dark:text-red-400', hover: 'hover:border-red-500/50 hover:bg-red-500/10' },
        { label: 'French Revolution', icon: Globe, prompt: 'Explain the causes and consequences of the French Revolution', color: 'text-sky-600 dark:text-sky-400', hover: 'hover:border-sky-500/50 hover:bg-sky-500/10' },
        { label: 'Thermodynamics', icon: Paperclip, prompt: 'Explain the Second Law of Thermodynamics and entropy', color: 'text-fuchsia-600 dark:text-fuchsia-400', hover: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10' },
      ]
    }), []);

    const [suggestions, setSuggestions] = React.useState(allSuggestions.explainer.slice(0, 5));

    React.useEffect(() => {
      const pool = mode === 'quiz' ? allSuggestions.quiz : allSuggestions.explainer;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 5));
    }, [mode, allSuggestions]);

    // Close the attach dropdown on outside click / Escape.
    React.useEffect(() => {
      if (!showAttachMenu) return;
      const onPointerDown = (e: PointerEvent) => {
        if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
          setShowAttachMenu(false);
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowAttachMenu(false);
      };
      document.addEventListener('pointerdown', onPointerDown);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('keydown', onKey);
      };
    }, [showAttachMenu]);

    const MAX_FILES = 5;
    const MAX_FILE_MB = 10;
    const ACCEPT_ATTR = '.pdf,.png,.jpg,.jpeg,.txt,.md,.docx,.doc,.pptx,.ppt,image/png,image/jpeg,application/pdf,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.openxmlformats-officedocument.presentationml.presentation';

    const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

    const isSupportedFile = (file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (['pdf', 'png', 'jpg', 'jpeg', 'txt', 'md', 'markdown', 'docx', 'doc', 'pptx', 'ppt'].includes(ext)) return true;
      if (file.type === 'image/png' || file.type === 'image/jpeg') return true;
      if (file.type === 'application/pdf') return true;
      if (file.type === 'text/plain') return true;
      if (file.type === 'text/markdown' || file.type === 'text/x-markdown') return true;
      if (file.type.includes('wordprocessingml') || file.type.includes('msword')) return true;
      if (file.type.includes('presentationml') || file.type.includes('powerpoint')) return true;
      return false;
    };

    const [fileErrors, setFileErrors] = React.useState<Record<string, string>>({});

    const extractPdfText = React.useCallback(async (file: File): Promise<string> => {
      // Client-side fallback when the server parse route is unreachable.
      const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && !GlobalWorkerOptions.workerSrc) {
        GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
      }
      const buf = await file.arrayBuffer();
      const pdf = await getDocument({ data: buf }).promise;
      const maxPages = Math.min(pdf.numPages, 30);
      const chunks: string[] = [];
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content.items as Array<{ str?: string }>)
          .map((it) => it.str ?? '')
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (text) chunks.push(`--- Page ${i} ---\n${text}`);
        if (chunks.join('\n').length > 40000) break;
      }
      await pdf.destroy().catch(() => {});
      return chunks.join('\n\n').slice(0, 40000);
    }, []);

    const extractTextFromFile = React.useCallback(
      async (file: File): Promise<string> => {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (ext === 'txt' || ext === 'md' || ext === 'markdown' || file.type.startsWith('text/')) {
          const text = await file.text();
          return text.slice(0, 40000);
        }
        if (ext === 'pdf' || file.type === 'application/pdf') {
          return extractPdfText(file);
        }
        return '';
      },
      [extractPdfText],
    );

    /** Server-side parse (PDF/DOCX/PPTX/TXT/MD) — single source of truth. */
    const parseFilesOnServer = React.useCallback(async (targets: { file: File; key: string }[]) => {
      if (targets.length === 0) return;
      // Images + plain text resolve locally; everything else goes to /api/parse.
      const serverTargets = targets.filter(({ file }) => {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (file.type.startsWith('image/')) return false;
        if (['txt', 'md', 'markdown'].includes(ext) || file.type.startsWith('text/')) return false;
        return true;
      });
      // Fast local path for .txt/.md
      for (const { file, key } of targets) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (['txt', 'md', 'markdown'].includes(ext) || file.type.startsWith('text/')) {
          try {
            const text = (await file.text()).slice(0, 40000);
            setFileTexts((m) => ({ ...m, [key]: text }));
            if (!text.trim()) {
              setFileErrors((m) => ({ ...m, [key]: `No readable text in "${file.name}".` }));
            }
          } catch {
            setFileTexts((m) => ({ ...m, [key]: '' }));
            setFileErrors((m) => ({ ...m, [key]: `Could not read "${file.name}".` }));
          } finally {
            setParsingFiles((prev) => {
              const copy = { ...prev };
              delete copy[key];
              return copy;
            });
          }
        }
      }
      if (serverTargets.length === 0) return;
      try {
        const form = new FormData();
        for (const { file } of serverTargets) form.append('files', file);
        const res = await fetch('/api/parse', { method: 'POST', body: form });
        const data = (await res.json().catch(() => null)) as {
          files?: { name: string; text: string; words: number; status: string; error?: string }[];
          error?: string;
        } | null;
        if (res.status === 401) {
          openLogin();
          for (const { file, key } of serverTargets) {
            setFileTexts((m) => ({ ...m, [key]: '' }));
            setFileErrors((m) => ({ ...m, [key]: 'Log in to attach files.' }));
          }
          setFileError('You have to be logged in to use AI features.');
          return;
        }
        if (!res.ok) throw new Error(data?.error || `Parse failed (${res.status})`);
        const byName = new Map((data?.files ?? []).map((f) => [f.name, f]));
        for (const { file, key } of serverTargets) {
          const parsed = byName.get(file.name);
          if (parsed && parsed.status === 'ok' && parsed.text?.trim()) {
            setFileTexts((m) => ({ ...m, [key]: parsed.text }));
          } else if (parsed?.status !== 'ok') {
            // Server understood the file but couldn't extract text (e.g. scanned PDF).
            const msg = parsed?.error || `Could not read "${file.name}".`;
            setFileTexts((m) => ({ ...m, [key]: '' }));
            setFileErrors((m) => ({ ...m, [key]: msg }));
            setFileError(msg);
          } else {
            // Empty text with ok status (e.g. image placeholder) — leave blank.
            setFileTexts((m) => ({ ...m, [key]: parsed?.text ?? '' }));
          }
        }
      } catch {
        // Fallback: try client-side extraction for PDFs so chat still works offline.
        for (const { file, key } of serverTargets) {
          const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
          const isPdf = ext === 'pdf' || file.type === 'application/pdf';
          if (!isPdf) {
            setFileTexts((m) => ({ ...m, [key]: '' }));
            setFileErrors((m) => ({ ...m, [key]: `Could not read "${file.name}".` }));
            continue;
          }
          try {
            const text = await extractTextFromFile(file);
            setFileTexts((m) => ({ ...m, [key]: text }));
            if (!text.trim()) {
              setFileErrors((m) => ({ ...m, [key]: `Could not read "${file.name}" (scanned PDF?).` }));
            }
          } catch {
            setFileTexts((m) => ({ ...m, [key]: '' }));
            setFileErrors((m) => ({ ...m, [key]: `Could not read "${file.name}".` }));
          }
        }
        setFileError('Server parsing failed — used local fallback for PDFs.');
      } finally {
        for (const { key } of serverTargets) {
          setParsingFiles((prev) => {
            if (!(key in prev)) return prev;
            const copy = { ...prev };
            delete copy[key];
            return copy;
          });
        }
      }
    }, [extractTextFromFile, openLogin]);

    const processFiles = React.useCallback(
      (incoming: File[]) => {
        setFileError(null);
        const accepted: File[] = [];
        for (const file of incoming) {
          if (!isSupportedFile(file)) {
            setFileError('Only PDF, DOCX, PPTX, TXT, MD and image files are supported.');
            continue;
          }
          if (file.size > MAX_FILE_MB * 1024 * 1024) {
            setFileError(`"${file.name}" is too large (max ${MAX_FILE_MB}MB).`);
            continue;
          }
          accepted.push(file);
        }
        if (accepted.length === 0) return;

        // Dedupe against current files (via ref — no stale closure).
        const existing = new Set(filesRef.current.map((f) => fileKey(f)));
        const deduped = accepted.filter((f) => !existing.has(fileKey(f)));
        if (deduped.length === 0) return;
        const room = MAX_FILES - filesRef.current.length;
        if (room <= 0) {
          setFileError(`You can attach up to ${MAX_FILES} files.`);
          return;
        }
        const next = [...filesRef.current, ...deduped].slice(0, MAX_FILES);
        if (deduped.length > room) {
          setFileError(`You can attach up to ${MAX_FILES} files.`);
        }
        setFiles(next);
        // Image previews for newly added images.
        for (const file of deduped) {
          if (file.type.startsWith('image/') || /\.(png|jpe?g)$/i.test(file.name)) {
            const key = fileKey(file);
            const reader = new FileReader();
            reader.onload = (e) =>
              setFilePreviews((m) => (m[key] ? m : { ...m, [key]: e.target?.result as string }));
            reader.readAsDataURL(file);
          }
        }
        // Kick off text extraction for docs without parsed text yet.
        const toParse = deduped
          .filter((f) => {
            const k = fileKey(f);
            return fileTextsRef.current[k] === undefined && parsingRef.current[k] === undefined;
          })
          .map((f) => ({ file: f, key: fileKey(f) }));
        if (toParse.length > 0) {
          setParsingFiles((m) => {
            const copy = { ...m };
            for (const { key } of toParse) copy[key] = true;
            return copy;
          });
          void parseFilesOnServer(toParse);
        }
      },
      [parseFilesOnServer],
    );

    const processFile = React.useCallback(
      (file: File) => processFiles([file]),
      [processFiles],
    );

    const buildFileContext = React.useCallback(() => {
      if (files.length === 0) return undefined;
      const blocks: string[] = [];
      files.forEach((file, idx) => {
        const key = fileKey(file);
        const text = fileTexts[key];
        const err = fileErrors[key];
        if (text && text.trim()) {
          blocks.push(
            `===== DOCUMENT ${idx + 1}/${files.length}: ${file.name} =====\n(Use this document to answer. Cite it by name.)\n${text.trim().slice(0, 20000)}`
          );
        } else if (err) {
          blocks.push(`===== DOCUMENT ${idx + 1}/${files.length}: ${file.name} =====\n(Could not extract text: ${err})`);
        } else if (/\.(png|jpe?g)$/i.test(file.name) || file.type.startsWith('image/')) {
          blocks.push(`===== DOCUMENT ${idx + 1}/${files.length}: ${file.name} =====\n(An image was attached. Describe what the user asks about it; you cannot see pixels, only this note.)`);
        }
      });
      if (blocks.length === 0) {
        return `Attached files: ${files.map((f) => f.name).join(', ')}`;
      }
      return (
        `You have been given ${blocks.length} attached document${blocks.length === 1 ? '' : 's'} below. ` +
        `Read and understand the full content before answering.\n\n${blocks.join('\n\n')}`
      );
    }, [files, fileTexts, fileErrors]);

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) processFiles(droppedFiles);
      },
      [processFiles],
    );

    const handleRemoveFile = (index: number) => {
      setFiles((prev) => {
        const fileToRemove = prev[index];
        if (fileToRemove) {
          const key = fileKey(fileToRemove);
          setFilePreviews((m) => {
            const copy = { ...m };
            delete copy[key];
            return copy;
          });
          setFileTexts((m) => {
            const copy = { ...m };
            delete copy[key];
            return copy;
          });
          setFileErrors((m) => {
            const copy = { ...m };
            delete copy[key];
            return copy;
          });
          setParsingFiles((m) => {
            const copy = { ...m };
            delete copy[key];
            return copy;
          });
        }
        return prev.filter((_, i) => i !== index);
      });
    };

    const handlePaste = React.useCallback(
      (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
              e.preventDefault();
              processFile(file);
              break;
            }
          }
        }
      },
      [processFile],
    );

    React.useEffect(() => {
      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    const renderSuggestion = (suggestion: any, index: number) => (
      <button
        key={index}
        onClick={() => {
          setInput(suggestion.prompt);
        }}
        className={cn(
          "flex items-center gap-2.5 rounded-full border border-zinc-950/25 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:text-zinc-950 dark:border-gray-600/30 dark:bg-gray-600/5 dark:text-gray-300 dark:hover:text-white",
          suggestion.hover
        )}
      >
        <suggestion.icon className={cn("h-4.5 w-4.5", suggestion.color)} />
        {suggestion.label}
      </button>
    );

    const handleSubmit = () => {
      if (isLoading) return;
      // Auth gate: logged-out sends never reach the API.
      if (!signedIn) {
        openLogin();
        return;
      }
      // Don't send while documents are still being read — otherwise the AI
      // answers without the PDF content.
      if (Object.keys(parsingFiles).length > 0) {
        setFileError('Still reading your files… please wait a moment, then send again.');
        return;
      }
      if (input.trim() || files.length > 0) {
        let messagePrefix = '';
        if (showSearch) messagePrefix = '[Search: ';
        else if (showThink && !isGptOssModel) messagePrefix = '[Think: ';
        else if (showCanvas) messagePrefix = '[Canvas: ';
        const formattedInput = messagePrefix
          ? `${messagePrefix}${input}]`
          : input;
        onSend(formattedInput, files, buildFileContext());
        setInput('');
        setFiles([]);
        setFilePreviews({});
        setFileTexts({});
        setFileErrors({});
        setParsingFiles({});
        setFileError(null);
      }
    };

    const stopMediaTracks = React.useCallback(() => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      setLiveStream(null);
    }, []);

    React.useEffect(
      () => () => {
        mediaRecorderRef.current?.stream
          ?.getTracks()
          .forEach((track) => track.stop());
        stopMediaTracks();
      },
      [stopMediaTracks],
    );

    const pickMimeType = () => {
      if (
        typeof MediaRecorder !== 'undefined' &&
        typeof MediaRecorder.isTypeSupported === 'function'
      ) {
        for (const mime of [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
        ]) {
          if (MediaRecorder.isTypeSupported(mime)) return mime;
        }
      }
      return undefined;
    };

    const transcribeAudio = React.useCallback(async (blob: Blob, durationSec?: number) => {
      // Auth gate: logged-out transcription never reaches the API.
      if (!signedIn) {
        openLogin();
        return;
      }
      if (blob.size === 0) {
        setTranscriptionError('No audio captured. Please try again.');
        return;
      }
      // Hard gate: exhausted voice quota never reaches the API.
      // Estimate cost from the recorded duration (min 0.1 min per clip so
      // short voice notes still meter), falling back to 0.5 min.
      const estimatedMinutes =
        typeof durationSec === 'number' && durationSec > 0
          ? Math.max(0.1, Math.round((durationSec / 60) * 10) / 10)
          : 0.5;
      if (!canUse('voice', estimatedMinutes)) {
        setVoiceLimitOpen(true);
        return;
      }
      setIsTranscribing(true);
      setTranscriptionError(null);
      try {
        const extension =
          blob.type.includes('mp4') || blob.type.includes('m4a')
            ? 'm4a'
            : 'webm';
        const formData = new FormData();
        formData.append(
          'audio',
          new File([blob], `voice-message.${extension}`, {
            type: blob.type || 'audio/webm',
          }),
        );
        formData.append('minutes', String(estimatedMinutes));

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        const data = (await response.json().catch(() => null)) as {
          text?: string;
          error?: string;
          limitKind?: string;
        } | null;

        if (!response.ok) {
          if (response.status === 401 || (data as any)?.limitKind === 'auth') {
            openLogin();
            return;
          }
          if (response.status === 402 || response.status === 429) {
            setVoiceLimitOpen(true);
            return;
          }
          throw new Error(data?.error || 'Transcription failed.');
        }

        const text = data?.text?.trim() ?? '';
        if (!text) {
          throw new Error('No speech recognized. Please try again.');
        }

        bump({ voiceMinutesUsed: estimatedMinutes });
        // Append transcription to any existing draft with a space separator.
        setInput((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      } catch (error) {
        if ((error as any)?.status === 401 || (error as any)?.limitKind === 'auth') {
          openLogin();
          return;
        }
        if ((error as any)?.status === 402 || (error as any)?.status === 429 || (error as any)?.limitKind) {
          setVoiceLimitOpen(true);
          return;
        }
        setTranscriptionError(
          error instanceof Error ? error.message : 'Transcription failed.',
        );
      } finally {
        setIsTranscribing(false);
      }
    }, [canUse, bump, signedIn, openLogin]);

    const handleStartRecording = React.useCallback(async () => {
      // Auth gate: logged-out visitors get the login panel, never the mic.
      if (!signedIn) {
        openLogin();
        setIsRecording(false);
        return;
      }
      // Block recording entirely when voice quota is exhausted — no mic
      // prompt, no API call, just the Sorry! panel.
      if (!canUse('voice', 0.1)) {
        setVoiceLimitOpen(true);
        setIsRecording(false);
        return;
      }
      setTranscriptionError(null);
      audioChunksRef.current = [];
      try {
        if (
          typeof navigator === 'undefined' ||
          !navigator.mediaDevices?.getUserMedia
        ) {
          throw new Error('Microphone is not supported in this browser.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;
        setLiveStream(stream);
        const mimeType = pickMimeType();
        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        recorder.start();
      } catch (error) {
        console.error('Microphone error:', error);
        setTranscriptionError(
          error instanceof DOMException && error.name === 'NotAllowedError'
            ? 'Microphone access was denied. Allow access and try again.'
            : error instanceof Error
              ? error.message
              : 'Could not access the microphone.',
        );
        // Bail out of recording UI if we never got the mic.
        setIsRecording(false);
        stopMediaTracks();
      }
    }, [stopMediaTracks, canUse, signedIn, openLogin]);

    const handleStopRecording = React.useCallback(
      (duration: number) => {
        const recorder = mediaRecorderRef.current;
        setIsRecording(false);

        if (!recorder || recorder.state === 'inactive') {
          stopMediaTracks();
          mediaRecorderRef.current = null;
          return;
        }

        const mimeType = recorder.mimeType || 'audio/webm';
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          audioChunksRef.current = [];
          mediaRecorderRef.current = null;
          stopMediaTracks();
          void transcribeAudio(blob, duration);
        };
        recorder.stop();
      },
      [stopMediaTracks, transcribeAudio],
    );

    const hasContent = input.trim() !== '' || files.length > 0;

    return (
      <div className="flex w-full flex-col items-center gap-10 mb-12">
        {showSuggestions && !isRecording && (
          <div className="flex flex-col items-center gap-3 px-4 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestions.slice(0, 3).map((suggestion, index) => renderSuggestion(suggestion, index))}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestions.slice(3, 5).map((suggestion, index) => renderSuggestion(suggestion, index + 3))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          maxHeight={400}
          className={cn(
            'w-[calc(100%-4px)] border-[#a1a1aa] bg-[#ececef] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out dark:border-[#444444] dark:bg-[#1F2023] dark:shadow-[0_8px_30px_rgba(0,0,0,0.24)]',
            isRecording && 'border-red-500/70',
            className,
          )}
          disabled={isRecording || isTranscribing}
          ref={ref || promptBoxRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {showToggle && (
            <PromptModeToggle
              mode={mode}
              onModeChange={handleModeChange}
              disabled={isLoading || isRecording || isTranscribing}
            />
          )}

          {files.length > 0 && !isRecording && (
            <div className="mb-2 flex flex-wrap gap-2 transition-all duration-300">
              {files.map((file, index) => {
                const key = fileKey(file);
                const preview = filePreviews[key];
                const isImage =
                  file.type.startsWith('image/') || /\.(png|jpe?g)$/i.test(file.name);
                const parsing = parsingFiles[key];
                if (isImage && preview) {
                  return (
                    <div key={key} className="group relative">
                      <div
                        className="h-16 w-16 cursor-pointer overflow-hidden rounded-xl transition-all duration-300"
                        onClick={() => setSelectedImage(preview)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedImage(preview);
                        }}
                      >
                        <img
                          src={preview}
                          alt={file.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                }
                const Icon = isImage ? FileImage : FileText;
                return (
                  <div
                    key={key}
                    className="flex max-w-[220px] items-center gap-2 rounded-xl border border-zinc-950/20 bg-white px-2.5 py-2 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950/[0.05] text-zinc-600 dark:bg-white/[0.06] dark:text-gray-300">
                      {parsing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-zinc-900 dark:text-gray-200" title={file.name}>
                        {file.name}
                      </span>
                      <span className="block text-[10px] text-zinc-500 dark:text-gray-500">
                        {parsing ? 'Reading…' : `${(file.size / 1024).toFixed(0)} KB`}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-950/5 hover:text-zinc-900 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {fileError && !isRecording && (
            <div
              className="mb-2 flex w-full items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
              role="alert"
            >
              <span>{fileError}</span>
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="rounded-full p-1 hover:bg-amber-500/20"
                aria-label="Dismiss file error"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div
            className={cn(
              'transition-all duration-300',
              isRecording ? 'h-0 overflow-hidden opacity-0' : 'opacity-100',
            )}
          >
            <PromptInputTextarea
              placeholder={
                mode === 'quiz'
                  ? 'What would you like to practice?'
                  : showSearch
                    ? 'Search the web...'
                    : showThink
                      ? 'Think deeply...'
                      : showCanvas
                        ? 'Create on canvas...'
                        : placeholder
              }
              className="text-base"
            />
          </div>

          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            stream={liveStream}
          />

          {isTranscribing && (
            <div
              className="flex w-full items-center justify-center gap-2 py-2 text-sm text-[#9CA3AF]"
              role="status"
              aria-live="polite"
            >
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#9CA3AF]/30 border-t-[#9CA3AF]" />
              Transcribing your voice…
            </div>
          )}

          {transcriptionError && !isRecording && (
            <div
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
              role="alert"
            >
              <span>{transcriptionError}</span>
              <button
                type="button"
                onClick={() => setTranscriptionError(null)}
                className="rounded-full p-1 hover:bg-red-500/20"
                aria-label="Dismiss transcription error"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <PromptInputActions className="flex items-center justify-between gap-2">
            <div
              className={cn(
                'flex items-center gap-1 transition-opacity duration-300',
                isRecording ? 'invisible h-0 opacity-0' : 'visible opacity-100',
              )}
            >
              <div className="relative" ref={attachMenuRef}>
                <PromptInputAction tooltip="Add files, camera, search & more">
                  <button
                    type="button"
                    onClick={() => setShowAttachMenu((v) => !v)}
                    className={cn(
                      'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors',
                      showAttachMenu || files.length > 0 || showSearch || showThink
                        ? 'bg-zinc-900 text-white dark:bg-gray-600/40 dark:text-white'
                        : 'text-zinc-500 hover:bg-zinc-950/5 hover:text-zinc-800 dark:text-[#9CA3AF] dark:hover:bg-gray-600/30 dark:hover:text-[#D1D5DB]',
                    )}
                    disabled={isRecording}
                    aria-label="Open attach menu"
                    aria-expanded={showAttachMenu}
                    aria-haspopup="menu"
                  >
                    <Plus
                      className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        showAttachMenu && 'rotate-45',
                      )}
                    />
                    <input
                      ref={uploadInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processFiles(Array.from(e.target.files));
                        }
                        e.target.value = '';
                      }}
                      accept={ACCEPT_ATTR}
                    />
                    {/* Hidden native camera capture (mobile seamless fallback). */}
                    <input
                      ref={cameraInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          processFiles(Array.from(e.target.files));
                        }
                        e.target.value = '';
                      }}
                    />
                  </button>
                </PromptInputAction>

                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-2xl border border-[#a1a1aa] bg-white dark:border-[#333333] dark:bg-[#1F2023] p-1.5 shadow-2xl"
                      role="menu"
                      aria-label="Attach options"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setShowAttachMenu(false);
                          uploadInputRef.current?.click();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors text-zinc-700 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-gray-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#346bf1]/15 text-[#6b9bff]">
                          <FileUp className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">Add files</span>
                          <span className="block truncate text-[11px] opacity-60">
                            PDF, DOCX, PPTX, TXT, MD, images
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setShowAttachMenu(false);
                          // Mobile: seamless native camera. Desktop: in-app viewfinder.
                          const isMobile = /Android|iPhone|iPad|iPod/i.test(
                            typeof navigator !== 'undefined' ? navigator.userAgent : '',
                          );
                          if (isMobile) cameraInputRef.current?.click();
                          else setShowCamera(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors text-zinc-700 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-gray-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                          <Camera className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">Use camera</span>
                          <span className="block truncate text-[11px] opacity-60">
                            Capture a photo to attach
                          </span>
                        </span>
                      </button>

                      <div className="mx-2 my-1 h-px bg-zinc-950/10 dark:bg-white/[0.06]" />

                      <button
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={showSearch}
                        onClick={() => {
                          handleToggleChange('search');
                          setShowAttachMenu(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                          showSearch
                            ? 'bg-[#1EAEDB]/10 text-[#1EAEDB]'
                            : 'text-zinc-700 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-gray-300 dark:hover:bg-white/[0.06] dark:hover:text-white',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            showSearch ? 'bg-[#1EAEDB]/20' : 'bg-[#1EAEDB]/15 text-[#1EAEDB]',
                          )}
                        >
                          <Globe className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">Use web search</span>
                          <span className="block truncate text-[11px] opacity-60">
                            Ground answers in live results
                          </span>
                        </span>
                        {showSearch && <Check className="h-4 w-4 shrink-0" />}
                      </button>

                      <button
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={showThink}
                        disabled={isGptOssModel}
                        title={
                          isGptOssModel
                            ? 'Extended thinking isn’t available for GPT OSS models'
                            : 'Think step-by-step before answering'
                        }
                        onClick={() => {
                          handleToggleChange('think');
                          setShowAttachMenu(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                          showThink
                            ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                            : 'text-zinc-700 hover:bg-zinc-950/5 hover:text-zinc-950 dark:text-gray-300 dark:hover:bg-white/[0.06] dark:hover:text-white',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            showThink ? 'bg-[#8B5CF6]/20' : 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
                          )}
                        >
                          <BrainCog className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">Extended thinking</span>
                          <span className="block truncate text-[11px] opacity-60">
                            {isGptOssModel ? 'Not available on GPT OSS' : 'Deeper step-by-step reasoning'}
                          </span>
                        </span>
                        {showThink && <Check className="h-4 w-4 shrink-0" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggleChange('search')}
                  className={cn(
                    'flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all',
                    showSearch
                      ? 'border-[#1EAEDB] bg-[#1EAEDB]/15 text-[#1EAEDB]'
                      : 'border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]',
                  )}
                  aria-pressed={showSearch}
                >
                  <motion.div
                    animate={{
                      rotate: showSearch ? 360 : 0,
                      scale: showSearch ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  >
                    <Globe className="h-4 w-4" />
                  </motion.div>
                  <AnimatePresence>
                    {showSearch && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#1EAEDB]"
                      >
                        Search
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <CustomDivider />

                <button
                  type="button"
                  onClick={() => handleToggleChange('think')}
                  disabled={isGptOssModel}
                  title={isGptOssModel ? 'Think mode isn’t available for GPT OSS models' : 'Think deeply'}
                  className={cn(
                    'flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all disabled:cursor-not-allowed disabled:opacity-40',
                    showThink
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#8B5CF6]'
                      : 'border-transparent bg-transparent text-[#9CA3AF] hover:text-[#D1D5DB]',
                  )}
                  aria-pressed={showThink}
                >
                  <motion.div
                    animate={{
                      rotate: showThink ? 360 : 0,
                      scale: showThink ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  >
                    <BrainCog className="h-4 w-4" />
                  </motion.div>
                  <AnimatePresence>
                    {showThink && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 overflow-hidden whitespace-nowrap text-xs text-[#8B5CF6]"
                      >
                        Think
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                  <PromptInputAction tooltip="Switch model">
                    <button
                      type="button"
                      onClick={() => setShowModelMenu(!showModelMenu)}
                      className={cn(
                        'flex h-8 items-center gap-1.5 rounded-full border border-gray-600/50 bg-gray-600/20 px-2 py-1 text-xs font-medium text-[#9CA3AF] transition-all hover:border-gray-500 hover:text-[#D1D5DB]',
                        showModelMenu && 'border-[#9b87f5]/50 bg-[#9b87f5]/10 text-[#6d5ef0] dark:text-[#9b87f5]',
                      )}
                      disabled={isRecording || isLoading || isTranscribing}
                    >
                      {(() => {
                        const currentModel = AI_MODELS.find((m) => m.id === model);
                        return currentModel?.logo ? (
                          <div className="h-4 w-4 overflow-hidden rounded-full bg-white/10 p-0.5">
                            <img src={currentModel.logo} alt="" className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <Layers className="h-3.5 w-3.5" />
                        );
                      })()}
                      <span className="hidden sm:inline">
                        {(() => {
                          if (model === 'openai/gpt-oss-20b') return 'GPT - Normal';
                          if (model === 'openai/gpt-oss-120b') return 'GPT - High';
                          return AI_MODELS.find((m) => m.id === model)?.name || 'Model';
                        })()}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 transition-transform',
                          showModelMenu && 'rotate-180',
                        )}
                      />
                    </button>
                  </PromptInputAction>


                <AnimatePresence>
                  {showModelMenu && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowModelMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 bottom-full z-50 mb-2 w-56 rounded-2xl border border-[#a1a1aa] bg-white dark:border-[#333333] dark:bg-[#1F2023] p-1 shadow-2xl"
                      >
                        {AI_MODELS.filter(m => m.id !== 'openai/gpt-oss-120b').map((m) => (
                          <div
                            key={m.id}
                            className="relative group"
                            onMouseEnter={() => {
                              if (m.id === 'openai/gpt-oss-20b') setHoveredModelId(m.id);
                            }}
                            onMouseLeave={() => {
                              if (m.id === 'openai/gpt-oss-20b') setHoveredModelId(null);
                            }}
                          >
                            <button
                              onClick={() => {
                                if (m.id === 'openai/gpt-oss-20b') {
                                  onModelChange?.('openai/gpt-oss-20b');
                                  setInternalModel('openai/gpt-oss-20b');
                                  setReasoningType('Normal');
                                } else {
                                  onModelChange?.(m.id);
                                  setInternalModel(m.id);
                                }
                                setShowModelMenu(false);
                              }}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                                model === m.id
                                  ? 'bg-[#9b87f5]/10 text-[#6d5ef0] dark:text-[#9b87f5]'
                                  : 'text-zinc-500 hover:bg-zinc-950/5 hover:text-zinc-800 dark:text-gray-400 dark:hover:bg-gray-600/30 dark:hover:text-gray-200',
                              )}
                            >
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-950/[0.05] p-1 dark:bg-white/5">
                                {m.logo ? (
                                  <img src={m.logo} alt="" className="h-full w-full object-contain" />
                                ) : (
                                  <Layers className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden">
                                <div className="flex w-full items-center justify-between gap-2">
                                  <span className="truncate text-sm font-semibold">
                                    {m.name}
                                  </span>
                                  {model === m.id && (
                                    <Check className="h-3.5 w-3.5 shrink-0" />
                                  )}
                                </div>
                                <span className="text-[10px] opacity-70">
                                  {m.provider}
                                </span>
                              </div>
                            </button>
                            {m.id === 'openai/gpt-oss-20b' && hoveredModelId === m.id && (
                              <div className="absolute left-full top-0 z-50 pl-2">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  className="relative w-40 overflow-hidden rounded-2xl border border-[#a1a1aa] bg-white dark:border-[#333333] dark:bg-[#1F2023] p-1 shadow-2xl"
                                >
                                  {(['Normal', 'High'] as const).map((type) => (
                                    <button
                                      key={type}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setReasoningType(type);
                                        const selectedModel = type === 'High'
                                          ? 'openai/gpt-oss-120b'
                                          : 'openai/gpt-oss-20b';
                                        setInternalModel(selectedModel as AIModelId);
                                        onModelChange?.(selectedModel as AIModelId);
                                        setShowModelMenu(false);
                                      }}
                                      className={cn(
                                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors',
                                        reasoningType === type
                                          ? 'bg-[#9b87f5]/10 text-[#6d5ef0] dark:text-[#9b87f5]'
                                          : 'text-zinc-500 hover:bg-zinc-950/5 hover:text-zinc-800 dark:text-gray-400 dark:hover:bg-gray-600/30 dark:hover:text-gray-200',
                                      )}
                                      >
                                      <span className="text-sm font-medium">{type}</span>
                                      {reasoningType === type && <Check className="h-3.5 w-3.5 shrink-0" />}
                                    </button>
                                  ))}
                                </motion.div>
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <PromptInputAction
                tooltip={
                  isLoading
                    ? 'Stop generation'
                    : isRecording
                      ? 'Stop and transcribe'
                      : isTranscribing
                        ? 'Transcribing…'
                        : hasContent
                          ? 'Send message'
                          : 'Voice message'
                }
              >
              <Button
                variant="default"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-full transition-all duration-200',
                  isLoading || isRecording
                    ? 'bg-[#de0a26] text-white hover:bg-[#de0a26]/85'
                    : 'bg-[#346bf1] text-white hover:bg-[#346bf1]/85',
                )}
                onClick={() => {
                  if (isLoading) {
                    onStop?.();
                  } else if (isRecording) setIsRecording(false);
                  else if (hasContent && !isTranscribing) handleSubmit();
                  else if (!isTranscribing) {
                    // Auth gate first: logged-out taps never start
                    // recording or hit /api/transcribe.
                    if (!signedIn) {
                      openLogin();
                      return;
                    }
                    // Pre-check voice quota so an exhausted plan never
                    // starts recording or hits /api/transcribe.
                    if (!canUse('voice', 0.1)) {
                      setVoiceLimitOpen(true);
                      return;
                    }
                    setIsRecording(true);
                  }
                }}
                disabled={isTranscribing}
                aria-label={
                  isLoading
                    ? 'Stop generation'
                    : isRecording
                      ? 'Stop recording and transcribe'
                      : hasContent
                        ? 'Send message'
                        : 'Start voice message'
                }
              >
                <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={
                        isLoading
                          ? 'stop'
                          : isRecording
                            ? 'recording'
                            : isTranscribing
                              ? 'transcribing'
                              : hasContent
                                ? 'send'
                                : 'mic'
                      }
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className="flex items-center justify-center"
                    >
                      {isLoading ? (
                        <Square className="h-4 w-4 fill-white text-white" />
                      ) : isRecording ? (
                        <StopCircle className="h-5 w-5 text-white" />
                      ) : isTranscribing ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : hasContent ? (
                        <ArrowUp className="h-4 w-4 text-white" />
                      ) : (
                        <Mic className="h-5 w-5 text-white" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </Button>
            </PromptInputAction>
          </div>
        </PromptInputActions>
      </PromptInput>

      <ImageViewDialog
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <CameraCaptureDialog
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(file) => processFiles([file])}
      />
      {voiceLimitOpen && (
        <LimitReachedModal
          open
          kind="voice"
          planName={plan.name}
          resetLabel={nextResetLabel}
          onClose={() => setVoiceLimitOpen(false)}
        />
      )}
      {/* Own modal only when no parent handles it (standalone demo use). */}
      {loginOpen && !onLoginRequired && (
        <LoginRequiredModal open onClose={() => setLoginOpen(false)} />
      )}
    </div>
  );
},
);
PromptInputBox.displayName = 'PromptInputBox';
