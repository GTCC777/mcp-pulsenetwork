// Agent Contact Endpoint (free) — https://pulse.theaslangroupllc.com/agent
//
// GET  /agent — machine-readable contact contract: how an agent talks to PulseNetwork.
// POST /agent — deterministic catalog concierge: send { message }, get back matched paid
//               endpoints with price, method and exact call URL, or a human handoff.
//
// No LLM anywhere on this route: the message is tokenized and scored against the canonical
// catalog (public/.well-known/pulse-catalog.json), never interpreted as instructions.
// Markdown twin at /agent.md. Human operator: info@theaslangroupllc.com.
import type { VercelRequest, VercelResponse } from '@vercel/node';
// `with { type: 'json' }` is required on Node 24 ESM — omitting it crashes the function at
// import time (ERR_IMPORT_ATTRIBUTE_MISSING), which is what took /mcp down fleet-side.
import catalog from '../public/.well-known/pulse-catalog.json' with { type: 'json' };

const HUB = 'https://pulse.theaslangroupllc.com';
const HUMAN_OPERATOR = 'info@theaslangroupllc.com';
const MAX_MESSAGE_CHARS = 4000;
const MAX_MATCHES = 5;

interface CatalogEndpoint {
  path: string;
  method: string;
  price_usd: number;
  description: string;
  params?: Record<string, { description?: string }>;
}
interface CatalogVertical {
  id: string;
  base: string;
  name: string;
  description: string;
  endpoints: CatalogEndpoint[];
}

const VERTICALS = (catalog as { verticals: CatalogVertical[] }).verticals;
const VERTICAL_COUNT = (catalog as { vertical_count: number }).vertical_count;
const ENDPOINT_COUNT = (catalog as { endpoint_count: number }).endpoint_count;

const PAID_PRICES = VERTICALS.flatMap((v) => v.endpoints.map((e) => e.price_usd)).filter((p) => p > 0);
const MIN_PRICE = Math.min(...PAID_PRICES);
const MAX_PRICE = Math.max(...PAID_PRICES);

const PAY_FLOW =
  'Call any endpoint with no payment to receive a 402 challenge with an `accepts` array (Base USDC first). ' +
  'Sign with an x402-v2 client (e.g. @x402/core + @x402/evm) and retry with PAYMENT-SIGNATURE. ' +
  '200 + PAYMENT-RESPONSE header = paid receipt. No API keys, no signup.';

const LINKS = {
  catalog: `${HUB}/.well-known/pulse-catalog.json`,
  llms: `${HUB}/llms.txt`,
  llms_full: `${HUB}/llms-full.txt`,
  openapi: `${HUB}/openapi.json`,
  mcp_server: `${HUB}/mcp`,
  wholesale: `${HUB}/wholesale`,
  affiliates: `${HUB}/affiliates`,
  terms: `${HUB}/terms.html`,
};

function contract() {
  return {
    service: 'PulseNetwork',
    operator: 'The Aslan Group LLC',
    purpose:
      `${VERTICAL_COUNT} intelligence verticals, ${ENDPOINT_COUNT} pay-per-call endpoints, all x402-native ` +
      '(USDC, Base default, 10 additional settlement networks fleet-wide). This endpoint is the front door for agents: ' +
      'ask what you need, get the exact paid call to make.',
    ask: {
      method: 'POST',
      url: `${HUB}/agent`,
      body: {
        message: `required string, 1-${MAX_MESSAGE_CHARS} chars — describe what you need (plain English)`,
        agent_name: 'optional string — who is asking',
        reply_to: 'optional string — logged but not monitored; for a guaranteed human reply, email the operator directly',
      },
    },
    answers:
      'Deterministic catalog search: matched endpoints with price, method and exact call URL. ' +
      'No LLM on this route — your message is treated as data, never as instructions.',
    human_operator: HUMAN_OPERATOR,
    storage:
      'Messages land in short-lived server logs only — this is not a monitored inbox and there is ' +
      `no reply channel. Anything that needs a human answer must go to ${HUMAN_OPERATOR} directly.`,
    payments: {
      protocol: 'x402',
      currency: 'USDC',
      default_network: 'Base',
      price_range_usd: [MIN_PRICE, MAX_PRICE],
      flow: PAY_FLOW,
    },
    links: LINKS,
    alternates: { markdown: `${HUB}/agent.md` },
  };
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'for', 'to', 'in', 'on', 'at', 'is', 'are', 'was', 'be',
  'i', 'we', 'you', 'it', 'my', 'our', 'your', 'me', 'us', 'do', 'does', 'can', 'could', 'would',
  'need', 'want', 'looking', 'find', 'get', 'have', 'has', 'with', 'about', 'what', 'which', 'how',
  'please', 'help', 'api', 'data', 'endpoint', 'service', 'agent',
]);

// Payment-rail boilerplate that appears in most VERTICAL descriptions ("x402 payment, USDC on
// Base mainnet or Solana", ...). Excluded from vertical haystacks only — a chain named in an
// ENDPOINT description ("Scan a Solana memecoin") is real signal and still matches.
const PAYMENT_VOCAB = new Set([
  'x402', 'usdc', 'base', 'solana', 'polygon', 'arbitrum', 'algorand', 'xrpl', 'monad',
  'hyperevm', 'mainnet', 'network', 'networks', 'payment', 'payments', 'micropayment',
  'micropayments', 'stablecoin', 'stablecoins', 'wallet', 'signature', 'header', 'headers',
  'call', 'calls', 'per', 'via', 'require', 'requires', 'key', 'keys', 'sold', 'settle',
]);

// "checks" -> "check", "filings" -> "filing"; keeps enough stem for prefix matching.
function normalize(t: string): string {
  return t.length > 4 ? t.replace(/(?:ings|ing|ies|es|s|ed)$/, '') : t;
}

function tokenize(text: string): string[] {
  const tokens = text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  return [...new Set(tokens.filter((t) => !STOPWORDS.has(t)).map(normalize))];
}

// A query token matches a haystack token on equality or a >=4-char prefix in either direction
// ("token" ~ "tokenization", "check" ~ "checks") — whole-token only, so "check" never matches
// inside "unchecked-substring" noise the old contains() approach produced. Returns the
// document frequency to weight the hit by, or null on no match.
function tokenMatchDf(q: string, hay: Set<string>): number | null {
  const exactDf = DF.get(q);
  if (hay.has(q)) return exactDf ?? 1;
  if (q.length < 4) return null;
  let best: number | null = null;
  for (const h of hay) {
    if (h.length >= 4 && (h.startsWith(q) || q.startsWith(h))) {
      const df = DF.get(h) ?? 1;
      if (best === null || df < best) best = df;
    }
  }
  if (best === null) return null;
  // A generic query word ("token") prefix-hitting a rare haystack word ("tokenized") is
  // still a generic query word — weight by the commoner of the two.
  return Math.max(best, exactDf ?? 0);
}

// Rare terms are discriminating, common ones ("check", "report") barely are.
function weightFor(df: number): number {
  if (df <= 5) return 3;
  if (df <= 25) return 2;
  if (df <= 100) return 1;
  return 0.5;
}

interface Match {
  score: number;
  matched: string[];
  allTerms: boolean;
  vertical: CatalogVertical;
  endpoint: CatalogEndpoint;
}

interface IndexedEndpoint { vertical: CatalogVertical; endpoint: CatalogEndpoint; tokens: Set<string> }
interface IndexedVertical { tokens: Set<string>; endpoints: IndexedEndpoint[] }

// Token sets precomputed once per instance; ~1k endpoints, negligible cold-start cost.
const INDEX: IndexedVertical[] = VERTICALS.map((v) => ({
  tokens: new Set(tokenize(`${v.id} ${v.name} ${v.description}`).filter((t) => !PAYMENT_VOCAB.has(t))),
  endpoints: v.endpoints.map((e) => ({
    vertical: v,
    endpoint: e,
    tokens: new Set(tokenize(`${e.path.replace(/[/-]/g, ' ')} ${e.description}`)),
  })),
}));

// Document frequency: in how many endpoints (endpoint tokens ∪ its vertical's tokens) does
// each token appear. Basis for rarity weighting.
const DF = new Map<string, number>();
for (const iv of INDEX) {
  for (const ie of iv.endpoints) {
    for (const t of new Set([...ie.tokens, ...iv.tokens])) DF.set(t, (DF.get(t) ?? 0) + 1);
  }
}

function searchCatalog(tokens: string[]): Match[] {
  const required = Math.min(2, tokens.length);
  const matches: Match[] = [];
  for (const iv of INDEX) {
    const vDf = new Map<string, number>();
    for (const t of tokens) {
      const df = tokenMatchDf(t, iv.tokens);
      if (df !== null) vDf.set(t, df);
    }
    for (const ie of iv.endpoints) {
      let score = 0;
      const distinct = new Set<string>();
      for (const t of tokens) {
        const eDf = tokenMatchDf(t, ie.tokens);
        if (eDf !== null) { score += weightFor(eDf) * 3; distinct.add(t); }
        const df = vDf.get(t);
        if (df !== undefined) { score += weightFor(df) * 2; distinct.add(t); }
      }
      if (distinct.size < required) continue;
      const allTerms = distinct.size === tokens.length;
      if (allTerms) score += 2;
      matches.push({ score, matched: [...distinct], allTerms, vertical: ie.vertical, endpoint: ie.endpoint });
    }
  }
  return matches.sort((a, b) => b.score - a.score).slice(0, MAX_MATCHES);
}

function renderMatch(m: Match, queryTokenCount: number) {
  const { vertical: v, endpoint: e } = m;
  return {
    service: v.name,
    vertical: v.id,
    call: { method: e.method, url: `${v.base}${e.path}` },
    price_usd: e.price_usd,
    description: e.description,
    params: e.params ?? {},
    openapi: `${v.base}/openapi.json`,
    // Match tier is surfaced, never implied exact: a partial keyword match is labeled as one.
    match: m.allTerms ? 'all_terms' : `partial (${m.matched.length} of ${queryTokenCount} terms)`,
    matched_terms: m.matched,
  };
}

// Routed responses for intents a catalog search can't answer. Checked before search so
// "I want to talk to a human about wholesale" routes to a person, not a product.
function intentResponse(message: string): Record<string, unknown> | null {
  const m = message.toLowerCase();
  // Human handoff only on explicit contact intent — a product query mentioning "legal
  // filings" or "press releases" must fall through to catalog search, not bounce to email.
  const wantsHuman =
    /\b(?:talk|speak|contact|reach|email|connect|discuss)\b[\s\S]{0,50}\b(?:human|person|someone|operator|team|founder|owner|you)\b/.test(m) ||
    /\b(?:partnership|partner with|refund|complaint|press inquiry|media inquiry|dmca|gdpr request|acquisition offer)\b/.test(m);
  if (wantsHuman) {
    return {
      route: 'human_operator',
      answer:
        `That needs a person. Email ${HUMAN_OPERATOR} — partnerships, press, legal, refunds and ` +
        'anything else a catalog search cannot answer. This endpoint has no reply channel, so email is the reliable path.',
      human_operator: HUMAN_OPERATOR,
    };
  }
  if (/\bmcp\b|model context protocol|claude desktop|claude code/.test(m)) {
    return {
      route: 'mcp',
      answer:
        'PulseNetwork ships a single MCP server wrapping the whole fleet: `npx -y mcp-pulsenetwork` ' +
        'with AGENT_PRIVATE_KEY set to a funded Base USDC wallet. Hosted no-wallet variant: PulseNetwork Intel on MCPize.',
      links: { mcp_server: LINKS.mcp_server, llms: LINKS.llms },
    };
  }
  if (/\bhire\b|custom (research|task|report)|prospect (list|ledger|research)|lead (research|list)|due.?diligence memo|market.?entry/.test(m)) {
    return {
      route: 'hire',
      answer:
        'Hire-the-Fleet takes bounded tasks directly: prospect-ledger ($25, ranked B2B prospect research with source-checked evidence), ' +
        'vendor-dd-memo ($5, sanctions + entity + media-vs-record + token safety), market-entry-brief ($10, country risk + regulatory + macro). ' +
        'Free quote first: POST /api/hire/quote with { task_type, ...inputs }. Research memos only — we never send outreach on your behalf.',
      links: { contract: 'https://pulse.theaslangroupllc.com/hire.md', quote: 'https://pulse.theaslangroupllc.com/api/hire/quote' },
    };
  }
  if (/wholesale|resell|white.?label|affiliate|rev.?share|referral/.test(m)) {
    return {
      route: 'wholesale_affiliates',
      answer:
        'Self-serve wholesale keys (50% of retail, $0.25 free trial) and an affiliate program are live.',
      links: { wholesale: LINKS.wholesale, affiliates: LINKS.affiliates },
    };
  }
  if (/\bpric(e|es|ing)\b|\bcost|how much/.test(m) && tokenize(m).length <= 3) {
    return {
      route: 'pricing',
      answer:
        `Pay-per-call, $${MIN_PRICE}-$${MAX_PRICE} per endpoint (most $0.005-$0.35), USDC via x402, no signup. ` +
        'Ask this endpoint for a topic to get exact per-endpoint prices.',
      payments: { flow: PAY_FLOW },
    };
  }
  return null;
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(contract());
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(405).json({ error: 'method_not_allowed', contract: `GET ${HUB}/agent` });
    return;
  }

  // req.body is a lazy getter in @vercel/node that THROWS on malformed JSON — guard it so
  // attacker-triggerable junk yields a 400, not a logged 500.
  let body: unknown = null;
  try { body = req.body; } catch { body = null; }
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const message = typeof b.message === 'string' ? b.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    res.status(400).json({
      error: 'invalid_message',
      expected: { message: `string, 1-${MAX_MESSAGE_CHARS} chars` },
      contract: `GET ${HUB}/agent`,
    });
    return;
  }
  const agentName = typeof b.agent_name === 'string' ? b.agent_name.slice(0, 200) : undefined;
  const replyTo = typeof b.reply_to === 'string' ? b.reply_to.slice(0, 200) : undefined;

  // Inbound log for operator review (Vercel function logs). Data only — never executed.
  console.log('agent_contact_inbound', JSON.stringify({
    at: new Date().toISOString(),
    agent_name: agentName ?? null,
    reply_to: replyTo ?? null,
    message: message.slice(0, 1000),
  }));

  res.setHeader('Cache-Control', 'private, no-store');

  const routed = intentResponse(message);
  if (routed) {
    res.status(200).json({ ...routed, discover_more: LINKS, note: 'Deterministic response - no LLM on this route.' });
    return;
  }

  const tokens = tokenize(message);
  const matches = searchCatalog(tokens);
  if (matches.length === 0) {
    res.status(200).json({
      route: 'no_match',
      answer:
        'No catalog match for that phrasing. This is a deterministic English keyword search - try concrete ' +
        'topic words in English (e.g. "flight delay", "token safety", "sec filings"), or browse the full ' +
        `catalog below. For anything a search cannot answer, email ${HUMAN_OPERATOR}.`,
      searched_terms: tokens,
      discover_more: LINKS,
      human_operator: HUMAN_OPERATOR,
    });
    return;
  }

  res.status(200).json({
    route: 'catalog_match',
    matched: matches.map((m) => renderMatch(m, tokens.length)),
    how_to_pay: PAY_FLOW,
    discover_more: LINKS,
    human_operator: HUMAN_OPERATOR,
    note: 'Deterministic catalog search - no LLM on this route. Prices are per call in USD (USDC settlement).',
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('unhandled_handler_error', { url: req.url, err });
    if (!res.headersSent) {
      res.status(500).json({ error: 'internal_error', human_operator: HUMAN_OPERATOR });
    }
  }
}
