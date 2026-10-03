'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';

/**
 * Shared math-aware markdown rendering.
 *
 * - `MarkdownContent`: full block markdown for AI chat answers.
 *   `$...$` / `$$...$$` (and `\(...\)` / `\[...\]`) render via KaTeX.
 * - `InlineMath`: lightweight inline renderer for short plain-text spots
 *   (quiz questions, options, feedback) that can't host a full markdown tree.
 */

const REHYPE_KATEX_OPTIONS = { strict: false, throwOnError: false };

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="math-content text-[15px] leading-7 text-zinc-800 dark:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, REHYPE_KATEX_OPTIONS]]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-xl font-bold text-zinc-950 first:mt-0 dark:text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-lg font-bold text-zinc-950 first:mt-0 dark:text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold text-zinc-950 first:mt-0 dark:text-white">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 text-[15px] font-semibold text-zinc-950 first:mt-0 dark:text-white">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-6 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-6 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-zinc-950 dark:text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-2 border-zinc-950/15 pl-4 text-zinc-600 last:mb-0 dark:border-white/20 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-zinc-950/10 dark:border-white/10" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6d5ef0] underline underline-offset-2 hover:text-[#7c6cf0] dark:text-[#9b87f5] dark:hover:text-[#c4b5fd]"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const text = String(children).replace(/\n$/, '');
            const isBlock = text.includes('\n') || /language-/.test(className || '');

            if (isBlock) {
              return (
                <code className="block overflow-x-auto whitespace-pre text-[13px] leading-relaxed">
                  {text}
                </code>
              );
            }
            return (
              <code className="rounded-md bg-zinc-950/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-zinc-900 dark:bg-white/10 dark:text-gray-100">
                {text}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-xl border border-zinc-950/10 bg-zinc-950/[0.03] p-4 last:mb-0 dark:border-white/10 dark:bg-[#0d0d0f]">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-xl border border-zinc-950/10 last:mb-0 dark:border-white/10">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-950/[0.03] dark:bg-white/5">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-zinc-950/10 px-4 py-2.5 text-left font-semibold text-zinc-950 dark:border-white/10 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-zinc-950/5 px-4 py-2.5 dark:border-white/5">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

type Segment = { kind: 'text'; value: string } | { kind: 'math'; value: string; display: boolean };

/** Single-$ is only math when it looks like math (protects "$20 and $30"). */
function looksLikeMath(inner: string): boolean {
  // Sub/superscripts, commands, braces, relations: $x^2$, $H_2O$, $x=-2$, $a \ne 0$
  if (/[_^\\{}=≠≤≥±×÷→←≈∞∈∑∏∫√∂]/.test(inner)) return true;
  // Letter + arithmetic operator: $ax + b$, $x - 2$ (but not digit-digit ranges like $10-$20$)
  if (/[a-zA-Z]/.test(inner) && /[+\-*/]/.test(inner) && !/^\d[\d\s,.]*[-–][\d\s,/.]+$/.test(inner.trim())) {
    return true;
  }
  return false;
}

function splitMathSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // $$...$$, \[...\], \(...\), $...$ — left to right, first match wins.
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const math = m[1] ?? m[2] ?? m[3] ?? m[4] ?? '';
    const display = m[1] !== undefined || m[2] !== undefined;
    const isExplicit = m[1] !== undefined || m[2] !== undefined || m[3] !== undefined;
    if (!isExplicit && !looksLikeMath(math)) continue; // money / plain $ — keep literal
    if (m.index > last) segments.push({ kind: 'text', value: text.slice(last, m.index) });
    segments.push({ kind: 'math', value: math, display });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ kind: 'text', value: text.slice(last) });
  return segments;
}

/**
 * Render `$...$` / `$$...$$` inside short plain-text strings (quiz items).
 * Unparseable or unclosed math falls back to literal text — never red errors.
 */
export function InlineMath({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => {
    const segments = splitMathSegments(text);
    if (!segments.some((s) => s.kind === 'math')) return null;
    return segments
      .map((s) => {
        if (s.kind === 'text') {
          return escapeHtml(s.value);
        }
        try {
          return katex.renderToString(s.value, {
            displayMode: s.display,
            strict: false,
            throwOnError: true,
          });
        } catch {
          return escapeHtml(s.display ? `$$${s.value}$$` : `$${s.value}$`);
        }
      })
      .join('');
  }, [text]);

  if (html === null) return <span className={className}>{text}</span>;
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
