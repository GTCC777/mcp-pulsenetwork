// lib/unbundle.ts — loader + matcher for the Unbundler registry (unbundle-registry.json).
// Deterministic by design: every decomposition (especially licensing/legal claims) is curated,
// never LLM-generated. The matcher is forgiving on names; the data is not improvised.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface UnbundleUpstream {
  source: string;
  license: string;
  access: string;
}

export interface UnbundleEntry {
  id: string;
  product: string;
  aliases: string[];
  category: string;
  typical_price: string;
  moat_type: string;
  verdict: 'arbitragable' | 'partially_arbitragable' | 'not_arbitragable' | 'legal_review_required';
  what_you_actually_pay_for: string;
  free_upstreams: UnbundleUpstream[];
  rebuild_recipe: string[];
  price_math: string;
  legal_traps: string[];
  our_coverage: { vertical: string; endpoints: string[] };
  diy_difficulty: string;
}

let cache: UnbundleEntry[] | null = null;

export function loadRegistry(): UnbundleEntry[] {
  if (cache) return cache;
  const path = process.env.UNBUNDLE_REGISTRY_PATH || join(__dirname, '..', 'unbundle-registry.json');
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as { products: UnbundleEntry[] };
  if (!Array.isArray(parsed.products) || parsed.products.length === 0) {
    // Loud-failure doctrine: an empty registry is a build defect, not a soft condition.
    throw new Error('unbundle_registry_empty_or_malformed');
  }
  cache = parsed.products;
  return cache;
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Score a product entry against a query: exact alias > alias/product containment > token overlap. */
function score(entry: UnbundleEntry, q: string): number {
  const names = [entry.product, ...entry.aliases].map(norm);
  if (names.some((n) => n === q)) return 100;
  if (names.some((n) => n.includes(q) || q.includes(n))) return 80;
  const qTokens = new Set(q.split(' ').filter((t) => t.length > 2));
  if (qTokens.size === 0) return 0;
  let best = 0;
  for (const n of names) {
    const nTokens = n.split(' ');
    const hits = nTokens.filter((t) => qTokens.has(t)).length;
    if (hits > 0) best = Math.max(best, Math.min(60, 25 * hits));
  }
  // category match is a weak signal, enough to power "closest" suggestions
  if (norm(entry.category).split('-').some((t) => qTokens.has(t))) best = Math.max(best, 20);
  return best;
}

export interface MatchResult {
  entry: UnbundleEntry | null;
  confidence: 'exact' | 'high' | 'fuzzy' | null;
  closest: { product: string; category: string; verdict: string }[];
}

export function matchProduct(query: string): MatchResult {
  const q = norm(query);
  const registry = loadRegistry();
  const scored = registry
    .map((entry) => ({ entry, s: score(entry, q) }))
    .sort((a, b) => b.s - a.s);
  const top = scored[0];
  const closest = scored
    .slice(0, 5)
    .filter((x) => x.s >= 20)
    .map((x) => ({ product: x.entry.product, category: x.entry.category, verdict: x.entry.verdict }));
  if (!top || top.s < 40) return { entry: null, confidence: null, closest };
  const confidence = top.s >= 100 ? 'exact' : top.s >= 80 ? 'high' : 'fuzzy';
  return { entry: top.entry, confidence, closest };
}

export function catalogSummary(): { product: string; category: string; typical_price: string; verdict: string }[] {
  return loadRegistry().map((e) => ({
    product: e.product,
    category: e.category,
    typical_price: e.typical_price,
    verdict: e.verdict,
  }));
}
