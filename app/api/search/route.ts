import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchExa } from '@/lib/search/exa';

/**
 * POST /api/search — Exa-powered web search.
 * Body: { query: string; numResults?: number }
 * Returns: { results: [{ title, url, snippet, publishedDate, score }] }
 *
 * The Exa key stays server-side (process.env.EXA_API_KEY). If it is missing
 * we return 503 with a clear message instead of leaking anything.
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
    const body = (await req.json().catch(() => null)) as {
      query?: unknown;
      numResults?: unknown;
    } | null;

    const query = typeof body?.query === 'string' ? body.query.trim() : '';
    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }
    if (query.length > 1000) {
      return NextResponse.json(
        { error: 'query is too long (max 1000 chars)' },
        { status: 400 },
      );
    }

    const numResults =
      typeof body?.numResults === 'number' ? body.numResults : 6;

    const results = await searchExa(query, { numResults });
    return NextResponse.json({ results });
  } catch (error: any) {
    const message = error?.message ?? 'Search failed';
    const status = message.includes('EXA_API_KEY is not configured')
      ? 503
      : message.includes('rejected')
        ? 500
        : message.includes('rate limit')
          ? 429
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
