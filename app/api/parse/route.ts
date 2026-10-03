import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { parseUploadedFile } from '@/lib/quiz/parseFiles';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
// Keep the JSON response small enough for chat: the client slices further.
const MAX_CHARS_PER_FILE_IN_RESPONSE = 30_000;

/**
 * Unified document-parsing endpoint for chat attachments.
 * Accepts multipart FormData { files: File[] } and returns extracted text
 * using the same parser as quiz generation (PDF / DOCX / PPTX / TXT / MD / images).
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  try {
    const form = await req.formData();
    const uploads = form
      .getAll('files')
      .filter((f): f is File => f instanceof File)
      .slice(0, MAX_FILES);

    if (uploads.length === 0) {
      return NextResponse.json({ error: 'No files uploaded.' }, { status: 400 });
    }

    for (const f of uploads) {
      if (f.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: `"${f.name}" is too large (max 10MB).` },
          { status: 413 }
        );
      }
    }

    const parsed = await Promise.all(uploads.map((f) => parseUploadedFile(f)));

    return NextResponse.json({
      files: parsed.map((p) => ({
        name: p.name,
        text: p.text.slice(0, MAX_CHARS_PER_FILE_IN_RESPONSE),
        words: p.words,
        status: p.status,
        ...(p.error ? { error: p.error } : {}),
        // Images: text is just a placeholder — the client shows the preview.
        // Don't send giant base64 back to the chat client.
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Could not parse files.' },
      { status: 500 }
    );
  }
}
