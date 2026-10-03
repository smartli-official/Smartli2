'use client';

import { useRef, useState } from 'react';
import {
  BookOpenCheck,
  BrainCircuit,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  File as FileIcon,
  FileImage,
  FileText,
  GripVertical,
  Lightbulb,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AppleSwitch } from '@/components/ui/apple-switch';
import { cn } from '@/lib/utils';
import { AI_MODELS } from '@/lib/ai/config';
import type {
  QuizConfig,
  QuizDifficulty,
  QuizSectionKey,
  TimerCorner,
} from '@/types';

interface QuizCreatePanelProps {
  config: QuizConfig;
  onChange: (config: QuizConfig) => void;
  onBack: () => void;
  onGenerate?: (config: QuizConfig) => void;
  isGenerating?: boolean;
  generateError?: string | null;
  progressLabel?: string;
}

const SECTION_META: Record<QuizSectionKey, { label: string; description: string; icon: typeof Check }> = {
  mcq: { label: 'MCQs', description: 'Multiple choice questions', icon: Check },
  competency: { label: 'Competency Questions', description: 'Apply what you know', icon: BookOpenCheck },
  critical: { label: 'Critical Thinking Questions', description: 'Analyze and connect ideas', icon: BrainCircuit },
  justification: { label: 'Justification Questions', description: 'Explain your reasoning', icon: Lightbulb },
};

const DEFAULT_SECTION_ORDER: QuizSectionKey[] = ['mcq', 'competency', 'critical', 'justification'];
const DIFFICULTIES: QuizDifficulty[] = ['Light', 'Easy', 'Medium', 'Hard', 'Extra Hard', 'Ultra'];
const ACCEPTED_FILES = '.pdf,.ppt,.pptx,.doc,.docx,image/*';

function fileIcon(file: File) {
  if (file.type.startsWith('image/')) return FileImage;
  if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('presentation')) return FileText;
  return FileIcon;
}

export function QuizCreatePanel({ config, onChange, onBack, onGenerate, isGenerating, generateError, progressLabel }: QuizCreatePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSection, setDraggedSection] = useState<QuizSectionKey | null>(null);

  const sectionOrder = config.sectionOrder?.length ? config.sectionOrder : DEFAULT_SECTION_ORDER;

  const updateSection = (key: QuizSectionKey, update: Partial<QuizConfig['sections'][QuizSectionKey]>) => {
    onChange({
      ...config,
      sections: { ...config.sections, [key]: { ...config.sections[key], ...update } },
    });
  };

  const addFiles = (incoming: File[]) => {
    const accepted = incoming.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return file.type.startsWith('image/') || ['pdf', 'ppt', 'pptx', 'doc', 'docx'].includes(extension ?? '');
    });
    const existing = new Set(config.files.map((file) => `${file.name}-${file.size}`));
    const next = accepted.filter((file) => !existing.has(`${file.name}-${file.size}`));
    if (next.length) onChange({ ...config, files: [...config.files, ...next] });
  };

  const removeFile = (index: number) => {
    onChange({ ...config, files: config.files.filter((_, fileIndex) => fileIndex !== index) });
  };

  const moveSection = (key: QuizSectionKey, direction: -1 | 1) => {
    const index = sectionOrder.indexOf(key);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    const nextOrder = [...sectionOrder];
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    onChange({ ...config, sectionOrder: nextOrder });
  };

  const dropSection = (target: QuizSectionKey) => {
    if (!draggedSection || draggedSection === target) return;
    const nextOrder = [...sectionOrder];
    const fromIndex = nextOrder.indexOf(draggedSection);
    const toIndex = nextOrder.indexOf(target);
    nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, draggedSection);
    onChange({ ...config, sectionOrder: nextOrder });
    setDraggedSection(null);
  };

  const enabledSections = sectionOrder.filter((key) => config.sections[key].enabled).length;
  const canGenerate = config.files.length > 0 && enabledSections > 0 && !isGenerating;

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-background/80 text-left shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-start justify-between border-b border-border/60 px-6 py-6 sm:px-10 sm:py-8">
        <div>
          <div className="mb-1 flex items-center gap-2 text-emerald-300">
            <BookOpenCheck className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Quiz builder</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Set up your quiz</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Choose what to practice, how challenging it should be, and which material the AI should use.</p>
        </div>
        <button type="button" onClick={onBack} aria-label="Close quiz builder" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-[min(72vh,760px)] space-y-10 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
        <section className="quiz-panel-section">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Question sections</h3>
              <p className="mt-1 text-xs text-muted-foreground">Keep at least one section and set its question count.</p>
            </div>
            <span className="text-xs text-muted-foreground">{enabledSections} selected</span>
          </div>
          <div className="space-y-3">
            {sectionOrder.map((key, index) => {
              const meta = SECTION_META[key];
              const section = config.sections[key];
              const Icon = meta.icon;
              return (
                <div key={key} draggable onDragStart={() => setDraggedSection(key)} onDragEnd={() => setDraggedSection(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropSection(key)} className={cn('flex flex-wrap items-center gap-3 rounded-2xl border p-4 transition-[background-color,border-color,opacity,transform] duration-150 ease-[var(--ease-out)] sm:flex-nowrap', section.enabled ? 'border-emerald-400/25 bg-emerald-400/[0.06]' : 'border-border/60 bg-card/30 opacity-60', draggedSection === key && 'scale-[0.99] opacity-50')}>
                  <div className="hidden shrink-0 flex-col items-center gap-0.5 sm:flex">
                    <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">{index + 1}</span>
                    <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/60 active:cursor-grabbing" aria-hidden="true" />
                  </div>
                  <button type="button" onClick={() => updateSection(key, { enabled: !section.enabled })} aria-pressed={section.enabled} className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors', section.enabled ? 'bg-emerald-400/15 text-emerald-300' : 'bg-muted text-muted-foreground')}>
                    <Icon className="h-4 w-4" />
                  </button>
                  <div className="min-w-[calc(100%-7rem)] flex-1 sm:min-w-0">
                    <p className="text-sm font-medium text-foreground">{meta.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{meta.description}</p>
                  </div>
                  {section.enabled && (
                    <div className="ml-12 flex items-center gap-1 rounded-xl border border-border/70 bg-background/50 p-1 sm:ml-0">
                      <button type="button" onClick={() => updateSection(key, { count: Math.max(1, section.count - 1) })} aria-label={`Decrease ${meta.label} count`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">{section.count}</span>
                      <button type="button" onClick={() => updateSection(key, { count: Math.min(50, section.count + 1) })} aria-label={`Increase ${meta.label} count`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                  <div className="ml-auto flex shrink-0 items-center gap-0.5">
                    <button type="button" onClick={() => moveSection(key, -1)} disabled={index === 0} aria-label={`Move ${meta.label} earlier`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-25"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => moveSection(key, 1)} disabled={index === sectionOrder.length - 1} aria-label={`Move ${meta.label} later`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-25"><ArrowDown className="h-3.5 w-3.5" /></button>
                  </div>
                  <button type="button" onClick={() => updateSection(key, { enabled: false })} disabled={!section.enabled || enabledSections === 1} aria-label={`Remove ${meta.label}`} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="quiz-panel-section">
          <div className="mb-5">
            <h3 className="font-semibold text-foreground">AI model</h3>
            <p className="mt-1 text-xs text-muted-foreground">Choose which model should build your quiz.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => onChange({ ...config, model: model.id })}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-4 text-left transition-[background-color,border-color,color,box-shadow] duration-150 ease-[var(--ease-out)]',
                  config.model === model.id
                    ? 'border-emerald-300/50 bg-emerald-400/10 text-foreground shadow-sm'
                    : 'border-border/70 bg-card/20 text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-1.5">
                  <img src={model.logo} alt="" className="h-full w-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{model.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{model.provider}</span>
                </span>
                {config.model === model.id && <Check className="h-4 w-4 shrink-0 text-emerald-300" />}
              </button>
            ))}
          </div>
        </section>

        <section className="quiz-panel-section">
          <div className="mb-5">
            <h3 className="font-semibold text-foreground">Extra notes</h3>
            <p className="mt-1 text-xs text-muted-foreground">Give the AI extra instructions about the quiz.</p>
          </div>
          <textarea
            value={config.extraNotes}
            onChange={(event) => onChange({ ...config, extraNotes: event.target.value })}
            placeholder="For example: focus on dates, show explanations after each answer, or avoid trick questions."
            rows={5}
            className="w-full resize-y rounded-2xl border border-border/70 bg-card/30 px-4 py-3 text-sm leading-6 text-foreground outline-none transition-[border-color,background-color] duration-150 ease-[var(--ease-out)] placeholder:text-muted-foreground/60 focus:border-emerald-300/60 focus:bg-card/50"
          />
        </section>

        <section className="quiz-panel-section">
          <div className="mb-5"><h3 className="font-semibold text-foreground">Difficulty</h3><p className="mt-1 text-xs text-muted-foreground">Set the level for the full quiz.</p></div>
          <div className="flex flex-wrap gap-3">
            {DIFFICULTIES.map((difficulty) => (
              <button key={difficulty} type="button" onClick={() => onChange({ ...config, difficulty })} className={cn('rounded-full border px-3.5 py-2 text-xs font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-[var(--ease-out)]', config.difficulty === difficulty ? 'border-emerald-300/50 bg-emerald-400/15 text-emerald-200 shadow-sm' : 'border-border/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground')}>
                {difficulty}
              </button>
            ))}
          </div>
        </section>

        <section className="quiz-panel-section">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Time constraint</h3>
              <p className="mt-1 text-xs text-muted-foreground">Add a countdown while you take the quiz.</p>
            </div>
            <AppleSwitch checked={config.timeLimitMinutes !== null} onChange={(next) => onChange({ ...config, timeLimitMinutes: next ? 20 : null })} label="Time constraint" />
          </div>
          {config.timeLimitMinutes !== null && (
            <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/30 p-5 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-foreground">Duration <input type="number" min={1} max={240} value={config.timeLimitMinutes} onChange={(event) => onChange({ ...config, timeLimitMinutes: Math.max(1, Math.min(240, Number(event.target.value) || 1)) })} className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-center tabular-nums outline-none focus:border-emerald-400/60" /> <span className="text-muted-foreground">minutes</span></label>
              <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Timer corner</span><div className="grid grid-cols-2 gap-1 rounded-xl border border-border/70 bg-background p-1">{(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as TimerCorner[]).map((corner) => <button key={corner} type="button" aria-label={`Place timer ${corner}`} onClick={() => onChange({ ...config, timerCorner: corner })} className={cn('h-5 w-5 rounded-md border transition-colors', config.timerCorner === corner ? 'border-emerald-300 bg-emerald-400' : 'border-border bg-muted/50 hover:border-foreground/40')} />)}</div></div>
            </div>
          )}
        </section>

        <section className="quiz-panel-section">
          <div className="mb-5"><h3 className="font-semibold text-foreground">Add material</h3><p className="mt-1 text-xs text-muted-foreground">Upload notes, slides, documents, or images for this quiz.</p></div>
          <button type="button" onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); addFiles(Array.from(event.dataTransfer.files)); }} className={cn('flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-9 text-center transition-colors', isDragging ? 'border-emerald-300 bg-emerald-400/10' : 'border-border/80 bg-card/20 hover:border-emerald-300/50 hover:bg-emerald-400/[0.04]')}><Upload className="mb-3 h-5 w-5 text-emerald-300" /><span className="text-sm font-medium text-foreground">Drop files here or browse</span><span className="mt-2 text-xs text-muted-foreground">PDF, PowerPoint, Word, or image files</span><input ref={inputRef} type="file" multiple accept={ACCEPTED_FILES} className="hidden" onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ''; }} /></button>
          {config.files.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{config.files.map((file, index) => { const Icon = fileIcon(file); return <div key={`${file.name}-${index}`} className="flex min-w-0 items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2"><Icon className="h-4 w-4 shrink-0 text-emerald-300" /><span className="min-w-0 flex-1 truncate text-xs text-foreground" title={file.name}>{file.name}</span><button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`} className="rounded-md p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"><X className="h-3.5 w-3.5" /></button></div>; })}</div>}
        </section>
      </div>

      {generateError && (
        <p className="border-t border-border/60 px-6 py-4 text-sm leading-6 text-red-300 sm:px-10">{generateError}</p>
      )}
      <div className="flex flex-col-reverse gap-4 border-t border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6"><button type="button" onClick={() => onChange({ ...config, files: [] })} className="inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" /> Clear materials</button><div className="flex items-center gap-3">{isGenerating && progressLabel && <span className="text-xs text-muted-foreground">{progressLabel}</span>}<Button type="button" variant="ghost" onClick={onBack} disabled={isGenerating}>Back</Button><Button type="button" onClick={() => onGenerate?.(config)} disabled={!canGenerate}>{isGenerating ? 'Creating…' : 'Create quiz'} <ArrowRight className="h-4 w-4" /></Button></div></div>
    </div>
  );
}
