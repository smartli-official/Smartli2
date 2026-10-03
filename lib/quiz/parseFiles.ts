import mammoth from 'mammoth';
import JSZip from 'jszip';

export interface ParsedMaterial {
  name: string;
  text: string;
  words: number;
  status: 'ok' | 'failed';
  error?: string;
  imageDataUrl?: string;
}

const MAX_CHARS_PER_FILE = 60_000;

function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return text.trim() ? words.length : 0;
}

function truncate(text: string): string {
  return text.length > MAX_CHARS_PER_FILE
    ? text.slice(0, MAX_CHARS_PER_FILE)
    : text;
}

async function parsePdf(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages: string[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean);
      const pageText = strings.join(' ').replace(/\s+/g, ' ').trim();
      // Keep page boundaries so the AI can cite/locate info ("on page 3").
      pages.push(pageText ? `--- Page ${i} ---\n${pageText}` : `--- Page ${i} ---\n(no text on this page)`);
    }
  } finally {
    await doc.destroy().catch(() => {});
  }
  return { text: pages.join('\n\n'), pages: doc.numPages };
}

async function parsePptx(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] ?? '0', 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] ?? '0', 10);
      return numA - numB;
    });
  if (slideNames.length === 0) {
    throw new Error('No slides found in this .pptx file.');
  }
  const slides: string[] = [];
  for (const name of slideNames) {
    const xml = await zip.files[name]!.async('text');
    const runs = Array.from(xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g), (m) =>
      m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    )
      .join(' ')
      .trim();
    if (runs) slides.push(runs);
  }
  return slides.join('\n\n');
}

export async function parseUploadedFile(file: File): Promise<ParsedMaterial> {
  const name = file.name;
  const lower = name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (file.type.startsWith('image/')) {
      const base64 = buffer.toString('base64');
      return {
        name,
        text: `[Image: ${name}]`,
        words: 0,
        status: 'ok',
        imageDataUrl: `data:${file.type};base64,${base64}`,
      };
    }
    if (lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.markdown')) {
      const text = truncate(buffer.toString('utf-8').trim());
      if (!countWords(text)) {
        throw new Error('No readable text was found in this text file.');
      }
      return { name, text, words: countWords(text), status: 'ok' };
    }
    if (lower.endsWith('.pdf')) {
      const { text: raw, pages } = await parsePdf(buffer);
      const text = truncate(raw.trim());
      if (!countWords(text.replace(/--- Page \d+ ---/g, ''))) {
        throw new Error(
          `No readable text was found in this PDF (${pages} page${pages === 1 ? '' : 's'}). It may be a scanned document — try exporting it as text first, or attach it as images.`
        );
      }
      return { name, text, words: countWords(text), status: 'ok' };
    }
    if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
      const { value } = await mammoth.extractRawText({ buffer });
      const text = truncate(value.trim());
      if (!countWords(text)) {
        throw new Error('No readable text was found in this Word document.');
      }
      return { name, text, words: countWords(text), status: 'ok' };
    }
    if (lower.endsWith('.pptx')) {
      const text = truncate((await parsePptx(buffer)).trim());
      if (!countWords(text)) {
        throw new Error('No readable text was found in these slides.');
      }
      return { name, text, words: countWords(text), status: 'ok' };
    }
    if (lower.endsWith('.ppt')) {
      throw new Error(
        'Legacy .ppt format cannot be parsed (binary OLE format). Please re-save the file as .pptx and try again.'
      );
    }
    throw new Error(`Unsupported file type: ${name}. Use PDF, PPTX, DOCX, TXT, MD, or an image.`);
  } catch (err: any) {
    if (err?.message?.startsWith('Legacy .ppt') || err?.message?.startsWith('No readable') || err?.message?.startsWith('Unsupported') || err?.message?.startsWith('No slides')) {
      return { name, text: '', words: 0, status: 'failed', error: err.message };
    }
    return {
      name,
      text: '',
      words: 0,
      status: 'failed',
      error: `Could not parse ${name}: ${err?.message ?? 'unknown error'}`,
    };
  }
}

/**
 * Format parsed documents into a single context block for the AI.
 * Shared by chat + quiz so the model always sees filenames, word counts,
 * and clear boundaries — this is what lets it "understand" the PDF.
 */
export function formatMaterialsForAI(
  materials: { name: string; text: string; words?: number }[],
  opts?: { maxCharsPerFile?: number }
): string {
  const perFile = opts?.maxCharsPerFile ?? 20_000;
  const blocks = materials
    .filter((m) => m.text?.trim())
    .map(
      (m, i) =>
        `===== DOCUMENT ${i + 1}/${materials.length}: ${m.name} =====\n` +
        `(Use this document to answer. Cite it by name.)\n${m.text.trim().slice(0, perFile)}`
    );
  if (blocks.length === 0) return '';
  return (
    `You have been given ${blocks.length} attached document${blocks.length === 1 ? '' : 's'} below. ` +
    `Read and understand the full content before answering.\n\n${blocks.join('\n\n')}`
  );
}
