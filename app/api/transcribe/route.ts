import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkAndConsume } from '@/lib/plan/usage-server';

const NAGA_TRANSCRIPTION_URL = 'https://api.naga.ac/v1/audio/transcriptions';
const DEFAULT_MODEL = 'whisper-large-v3:free';
// 15MB cap to stay safely under typical STT limits.
const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

/**
 * POST /api/transcribe
 * Accepts multipart/form-data with an `audio` (or `file`) field,
 * forwards it to Naga AI Whisper, and returns `{ text }`.
 *
 * The Naga API key lives only on the server (NAGA_API_KEY) and is
 * never exposed to the browser.
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: 'You have to be logged in to use AI features.', limitKind: 'auth' },
      { status: 401 },
    );
  }
  const apiKey = process.env.NAGA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Transcription is not configured (missing NAGA_API_KEY).' },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Expected multipart form data with an audio file.' },
      { status: 400 },
    );
  }

  const audio = form.get('audio') ?? form.get('file');
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json(
      { error: 'No audio file provided. Send multipart field "audio".' },
      { status: 400 },
    );
  }

  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: 'Audio file is too large (max 15MB).' },
      { status: 413 },
    );
  }

  // Server-side voice quota (Supabase). Client sends its duration estimate;
  // we clamp to [0.1, 30] min so a missing value still meters fairly.
  const rawMinutes = form.get('minutes') ?? form.get('durationSec');
  let billMinutes = 0.5;
  if (typeof rawMinutes === 'string' && rawMinutes.trim()) {
    const n = Number(rawMinutes);
    if (Number.isFinite(n) && n > 0) {
      billMinutes = form.get('minutes')
        ? Math.min(30, Math.max(0.1, Math.round(n * 10) / 10))
        : Math.min(30, Math.max(0.1, Math.round((n / 60) * 10) / 10));
    }
  }
  try {
    const { allowed } = await checkAndConsume(userId, 'voice', billMinutes);
    if (!allowed) {
      return NextResponse.json(
        { error: 'You have hit your limits.', limitKind: 'voice' },
        { status: 402 },
      );
    }
  } catch (err) {
    console.error('Usage check failed (/api/transcribe):', err);
  }

  const language = form.get('language');
  const prompt = form.get('prompt');
  const model =
    (typeof form.get('model') === 'string' &&
    (form.get('model') as string).trim()
      ? ((form.get('model') as string).trim() as string)
      : process.env.NAGA_TRANSCRIPTION_MODEL) || DEFAULT_MODEL;

  const filename =
    (audio instanceof File && audio.name) || 'recording.webm';
  const contentType =
    (audio as Blob).type || 'audio/webm';

  try {
    const upstream = new FormData();
    upstream.append('model', model);
    upstream.append('file', audio, filename);
    if (typeof language === 'string' && language.trim()) {
      upstream.append('language', language.trim());
    }
    if (typeof prompt === 'string' && prompt.trim()) {
      upstream.append('prompt', prompt.trim());
    }

    const response = await fetch(NAGA_TRANSCRIPTION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstream,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (data as { error?: { message?: string }; message?: string } | null)
          ?.error?.message ??
        (data as { message?: string } | null)?.message ??
        `Naga AI transcription failed (${response.status}).`;
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const text = (data as { text?: string } | null)?.text?.trim() ?? '';
    if (!text) {
      return NextResponse.json(
        { error: 'No speech recognized. Please try again.' },
        { status: 422 },
      );
    }

    return NextResponse.json({ text, model });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed. Please try again.' },
      { status: 500 },
    );
  }
}
