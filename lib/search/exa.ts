/**
 * Server-side Exa web-search helper.
 *
 * - Reads the key from `EXA_API_KEY` only (never NEXT_PUBLIC_*, never client).
 * - Wraps Exa's `/search` REST endpoint with fetch (no extra dependency).
 * - Returns a small normalized shape the app can inject into AI context + UI.
 *
 * Docs: https://docs.exa.ai/reference/search
 */

export type ExaSearchResult = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  score?: number;
};

export type ExaSearchOptions = {
  numResults?: number;
  /** e.g. "exa.ai" — limit results to these domains. */
  includeDomains?: string[];
  excludeDomains?: string[];
  /** Restrict to content published after this ISO date. */
  startPublishedDate?: string;
  /** Extra Exa `contents` options are intentionally fixed (text snippet). */
  type?: 'auto' | 'neural' | 'keyword';
};

const EXA_SEARCH_URL = 'https://api.exa.ai/search';

export function isExaConfigured(): boolean {
  return Boolean(process.env.EXA_API_KEY?.trim());
}

export async function searchExa(
  query: string,
  options: ExaSearchOptions = {},
): Promise<ExaSearchResult[]> {
  const apiKey = process.env.EXA_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'EXA_API_KEY is not configured. Add it to .env.local (server-side only).',
    );
  }

  const cleanQuery = query.trim().slice(0, 1000);
  if (!cleanQuery) {
    throw new Error('Search query must not be empty.');
  }

  const numResults = Math.min(Math.max(options.numResults ?? 6, 1), 10);

  const res = await fetch(EXA_SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      query: cleanQuery,
      numResults,
      type: options.type ?? 'auto',
      contents: { text: { maxCharacters: 1500 } },
      ...(options.includeDomains?.length
        ? { includeDomains: options.includeDomains }
        : {}),
      ...(options.excludeDomains?.length
        ? { excludeDomains: options.excludeDomains }
        : {}),
      ...(options.startPublishedDate
        ? { startPublishedDate: options.startPublishedDate }
        : {}),
    }),
    // Search should be fast; don't let a hung upstream stall chat.
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    if (res.status === 401 || res.status === 403) {
      throw new Error('Exa API key rejected (401/403). Check EXA_API_KEY.');
    }
    if (res.status === 429) {
      throw new Error('Exa rate limit hit (429). Try again in a moment.');
    }
    throw new Error(
      `Exa search failed (${res.status}): ${errText.slice(0, 200)}`,
    );
  }

  const data = (await res.json()) as {
    results?: Array<{
      title?: string;
      url?: string;
      text?: string;
      snippet?: string;
      publishedDate?: string;
      score?: number;
    }>;
  };

  return (data.results ?? [])
    .filter((r) => r.url)
    .slice(0, numResults)
    .map((r) => ({
      title: r.title?.trim() || r.url!,
      url: r.url!,
      snippet: cleanSnippet(r.text || r.snippet || ''),
      publishedDate: r.publishedDate,
      score: r.score,
    }));
}

/**
 * Strip Exa's wrapper metadata lines (Published:/Source:/Language:) from the
 * extracted page text. We already pass title/URL/date as structured fields —
 * leaving the echoed headers in doubles up (possibly wrong) date signals and
 * lends them false authority inside the article body.
 */
function cleanSnippet(raw: string): string {
  return raw
    .split('\n')
    .filter((line) => !/^\s*(published|source|language)\s*:/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 600);
}

/**
 * Format results as compact context for the LLM. Numbered so the model can
 * cite them as [1], [2], ... and the UI can render the same list.
 * NOTE: published dates are deliberately NOT included here. Exa's dates come
 * from the search index and can be wrong (e.g. an old article republished
 * with a fresh date), and a wrong date actively misleads small models into
 * relabeling past events as current. The model must work from event years
 * stated in the results themselves. (Dates are still returned by /api/search
 * and shown in the UI sources panel for the user to verify.)
 */
export function formatResultsForContext(results: ExaSearchResult[]): string {
  return results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.snippet || '(no snippet)'}`,
    )
    .join('\n\n');
}
