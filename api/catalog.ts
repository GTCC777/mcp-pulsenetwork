// GET /api/catalog?q=<terms>&limit=<n> — FREE machine-readable catalog search.
// The JSON companion to llms.txt: agent tooling (browser-use packs, MCP clients,
// shopping agents) queries this instead of grepping llms-full.txt. Matches against
// vertical + endpoint names/descriptions/paths/params; blank q returns vertical summaries.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Param = { description?: string; required?: boolean; example?: unknown };
type Endpoint = {
  path: string;
  method?: string;
  price_usd?: number;
  description?: string;
  params?: Record<string, Param>;
  [k: string]: unknown;
};
type Vertical = { id: string; base: string; name: string; description: string; endpoints?: Endpoint[] };

let cached: { verticals: Vertical[]; updated: string } | null = null;
function loadCatalog(): { verticals: Vertical[]; updated: string } {
  if (!cached) {
    const raw = JSON.parse(readFileSync(join(process.cwd(), 'public', '.well-known', 'pulse-catalog.json'), 'utf8'));
    cached = { verticals: raw.verticals ?? [], updated: raw.updated ?? '' };
  }
  return cached;
}

// Query-side expansion. Agents search with intent words ("is this token safe?")
// while endpoint copy uses product words ("scan", "verdict", "honeypot"). Expanding
// the query — never the data — keeps pulse-catalog.json the single source of truth.
const ALIASES: Record<string, string[]> = {
  safety: ['scan', 'scanner', 'risk', 'verdict', 'honeypot', 'security', 'recall', 'safe'],
  safe: ['scan', 'scanner', 'risk', 'verdict', 'honeypot', 'security', 'recall'],
  unsafe: ['risk', 'honeypot', 'scam', 'recall'],
  risk: ['scan', 'verdict', 'exposure', 'safety', 'security'],
  scam: ['honeypot', 'scan', 'verdict', 'risk', 'fraud'],
  rug: ['honeypot', 'liquidity', 'holder', 'scan', 'verdict'],
  rugpull: ['honeypot', 'liquidity', 'holder', 'scan', 'verdict'],
  honeypot: ['sellability', 'scan', 'verdict'],
  scanner: ['scan', 'check', 'verdict'],
  check: ['scan', 'verdict', 'lookup'],
  price: ['cost', 'quote', 'market', 'value'],
  cheap: ['cent'],
  wallet: ['address', 'holder'],
  memecoin: ['token', 'meme'],
  crypto: ['onchain', 'token', 'defi'],
};

// Dropped from queries: they match nearly every description and only add noise.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'this', 'that', 'these', 'those', 'it', 'its',
  'of', 'for', 'to', 'in', 'on', 'at', 'by', 'with', 'and', 'or', 'my', 'me', 'i',
  'do', 'does', 'how', 'what', 'which', 'any', 'get', 'find', 'show', 'about',
]);

const words = (s: string): Set<string> => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));

// Whole-word hit scores highest, then a forward prefix ("token" reaches
// "tokenization", "scan" reaches "scanner"). Deliberately no substring tier and no
// reverse prefix: "rug" must never reach "drug", and short words in a description
// must never reach a longer query term.
function termScore(term: string, hay: Set<string>, exact: number, prefix: number): number {
  if (hay.has(term)) return exact;
  if (term.length >= 4) {
    for (const w of hay) if (w.length > term.length && w.startsWith(term)) return prefix;
  }
  return 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { verticals, updated } = loadCatalog();
  const q = String(req.query.q ?? '').trim().toLowerCase();
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100);
  const allTerms = [...new Set(q.split(/[^a-z0-9]+/).filter(Boolean))];
  const kept = allTerms.filter((t) => !STOPWORDS.has(t));
  const terms = kept.length ? kept : allTerms;

  // Ranked, never first-hit-wins: every candidate is scored per query term against
  // endpoint text (path + description + param names/docs) and vertical text, then
  // sorted. "token safety" must surface the scanner, not whichever token-adjacent
  // vertical happens to sit first in the catalog.
  let hits: Array<Record<string, unknown>> = [];
  if (!terms.length) {
    for (const v of verticals.slice(0, limit)) {
      hits.push({ vertical: v.id, name: v.name, base: v.base, description: v.description, endpoint_count: v.endpoints?.length ?? 0 });
    }
  } else {
    const scored: Array<{ score: number; price: number; url: string; hit: Record<string, unknown> }> = [];
    for (const v of verticals) {
      const vHay = words(`${v.id} ${v.name} ${v.description}`);
      for (const e of v.endpoints ?? []) {
        const paramText = Object.entries(e.params ?? {})
          .map(([k, p]) => `${k} ${p?.description ?? ''}`)
          .join(' ');
        const eHay = words(`${e.path} ${e.description ?? ''} ${paramText}`);

        let score = 0;
        let matched = 0;
        for (const t of terms) {
          // Endpoint and vertical score ADDITIVELY, not either/or. A vertical that
          // is genuinely about the topic is the signal that separates "severe
          // weather" in a weather API from a sports endpoint that happens to list
          // weather as a match factor. Scoring them either/or made those tie, and
          // the tie-break then handed the win to whichever was cheaper.
          let s = termScore(t, eHay, 4, 3);
          s += termScore(t, vHay, 2, 1);
          if (!s) {
            for (const a of ALIASES[t] ?? []) {
              s = (eHay.has(a) ? 2 : 0) + (vHay.has(a) ? 1 : 0);
              if (s) break;
            }
          }
          if (s) matched++;
          score += s;
        }
        if (!score) continue;
        if (matched === terms.length) score += 3; // reward covering the whole query

        const price = e.price_usd ?? 0;
        const url = `${v.base}${e.path}`;
        scored.push({
          score,
          price,
          url,
          hit: {
            vertical: v.id,
            base: v.base,
            path: e.path,
            url,
            method: e.method ?? 'GET',
            price_usd: e.price_usd ?? null,
            description: e.description ?? v.description,
            ...(e.params ? { params: e.params } : {}),
          },
        });
      }
    }
    // Deterministic order: best score, then cheapest, then URL.
    scored.sort((a, b) => b.score - a.score || a.price - b.price || a.url.localeCompare(b.url));
    hits = scored.slice(0, limit).map((s) => s.hit);
  }

  res.setHeader('cache-control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({
    query: q || null,
    updated,
    count: hits.length,
    results: hits,
    payment: 'x402: pay per call in USDC on Base (plus other networks per endpoint). Discovery is free.',
    docs: 'https://pulse.theaslangroupllc.com/llms.txt',
  });
}
