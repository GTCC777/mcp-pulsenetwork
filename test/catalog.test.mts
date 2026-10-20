/**
 * Ranking regressions for /api/catalog.
 *
 * This endpoint is how agent tooling finds anything we sell, so a ranking change
 * is a revenue change. Each case here is one that actually broke in development:
 * substring matching reaching "drug" from "rug", intent words never reaching
 * product words, and a cheapest-first tie-break promoting an irrelevant free
 * endpoint over the right paid one.
 *
 *   npx tsx --test test/catalog.test.mts
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/catalog.js';

type Row = { url: string; price_usd: number | null; vertical: string; base?: string; path?: string; params?: unknown };
const search = (q: string, limit = 8): Promise<{ count: number; results: Row[] }> =>
  new Promise((resolve) => {
    const res: any = { setHeader() {}, status() { return res; }, json: resolve, end: () => resolve(null as any) };
    (handler as any)({ method: 'GET', query: { q, limit: String(limit) } }, res);
  });

test('an intent word reaches the product that answers it', async () => {
  // "safety" appears nowhere in the scanner copy; the query alias table bridges it.
  const top = (await search('token safety')).results.slice(0, 3).map((r) => r.url);
  assert.ok(top.some((u) => /evmtoken|memecoin|facet\/honeypot/.test(u)), `expected a token scanner, got ${top}`);
});

test('a topical vertical outranks an incidental mention', async () => {
  // A sports endpoint mentions weather as a match factor. A weather API is still
  // the answer to "weather". Scoring endpoint and vertical text either/or made
  // these tie, and price then decided it.
  const first = (await search('weather')).results[0];
  assert.match(first.url, /climatepulse/, `expected a weather API first, got ${first.url}`);
});

test('short words never match by substring', async () => {
  const urls = (await search('rug')).results.map((r) => r.url);
  assert.ok(!urls.some((u) => /drug|rugby/.test(u)), `substring bleed: ${urls}`);
});

test('common queries never come back empty', async () => {
  const queries = ['eth', 'btc', 'nft', 'vin', 'etf', 'apy', 'tax', 'flight', 'recall', 'sanctions',
                   'honeypot', 'clinical trial', 'credit card', 'food safety'];
  const empty: string[] = [];
  for (const q of queries) if ((await search(q)).count === 0) empty.push(q);
  assert.deepEqual(empty, [], `zero results for: ${empty.join(', ')}`);
});

test('a result carries everything needed to call it without a second lookup', async () => {
  const r = (await search('token safety', 1)).results[0];
  for (const k of ['vertical', 'base', 'path', 'url', 'method', 'price_usd', 'description']) {
    assert.ok(k in r, `missing ${k}`);
  }
  assert.ok(r.url.startsWith('https://'), 'url must be absolute');
});

test('a blank query lists verticals rather than erroring', async () => {
  const body = await search('', 5);
  assert.equal(body.count, 5);
  assert.ok('endpoint_count' in (body.results[0] as any));
});
