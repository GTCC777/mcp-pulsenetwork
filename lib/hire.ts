// lib/hire.ts — Hire-the-Fleet: direct task-hiring surface (menu-based, deterministic quotes).
// Spec: manderley/ops/hire-the-fleet-spec-20260804.md. Three v1 task types:
//   prospect-ledger ($25, Claude + web search, env-gated on ANTHROPIC_API_KEY)
//   vendor-dd-memo ($5, deterministic composition of fleet engines)
//   market-entry-brief ($10, deterministic composition of fleet engines)
// HARD RULES enforced here in code (never prompts): no outbound sends of any kind, public
// business contacts only (personal-contact filter), declined-category 400s BEFORE payment,
// citation existence gate on delivered sources.

export interface TaskInput {
  [k: string]: string | number | undefined;
}

export interface QuoteResult {
  ok: boolean;
  task_type: string;
  price_usd?: number;
  amount?: string; // x402 atomic amount (6-decimal USD)
  eta_seconds?: [number, number];
  declined_reason?: string;
  normalized_input?: TaskInput;
}

// ---------------------------------------------------------------------------
// Task registry
// ---------------------------------------------------------------------------

export const TASK_TYPES: Record<
  string,
  {
    price_usd: number;
    amount: string;
    eta_seconds: [number, number];
    summary: string;
    tags: string[];
    queryParams: Record<string, string>;
    outputExample: Record<string, unknown>;
    available: () => boolean;
    unavailable_reason?: string;
  }
> = {
  'prospect-ledger': {
    price_usd: 25,
    amount: '25000000',
    eta_seconds: [60, 280],
    summary:
      'Ranked B2B prospect research ledger: give a thesis and target profile, get 5-15 researched prospects with why-they-fit evidence (source-checked), a verified PUBLIC business contact route, and one tailored opening question each. Research memo only — we never contact anyone on your behalf.',
    tags: ['prospect-research', 'lead-research', 'b2b', 'business-development', 'research'],
    queryParams: {
      thesis: 'What you sell / why a prospect would care (80-1000 chars, required)',
      target_profile: 'Who fits: industry, size, role, signals (10-500 chars, required)',
      region: 'Geographic focus, optional (e.g. "DACH", "US midwest", "global")',
      count: 'Number of prospects, 5-15 (default 10)',
    },
    outputExample: {
      task_type: 'prospect-ledger',
      prospects: [
        {
          rank: 1,
          who: 'Acme Logistics GmbH — VP Operations',
          why_fit: 'Publicly announced fleet expansion (source below); fits mid-size DACH logistics profile.',
          sources: [{ url: 'https://example.com/press', verified: true }],
          contact: { type: 'company_contact_page', value: 'https://acme-logistics.example/contact' },
          opening_question: 'How are you handling route-cost visibility across the new depots?',
          confidence: 'verified',
        },
      ],
      coverage: { requested: 10, delivered: 10, dropped_by_contact_filter: 0, unverified: 1 },
      markdown: '# Prospect Ledger…',
    },
    // GATED OFF pending async rebuild: live testing showed multi-search research cannot reliably
    // finish inside Vercel's 300s synchronous window, so a paid call risks charging then failing.
    // Re-enable only when the async job pattern (accept → background → poll) ships (Phase 2), by
    // setting HIRE_PROSPECT_LEDGER_ENABLED=1 alongside ANTHROPIC_API_KEY. Until then this 503s
    // BEFORE any 402 — never charged.
    available: () => !!process.env.ANTHROPIC_API_KEY && process.env.HIRE_PROSPECT_LEDGER_ENABLED === '1',
    unavailable_reason:
      'prospect-ledger is being upgraded to handle longer research runs and is temporarily offline — no charge is taken. Use vendor-dd-memo or market-entry-brief now, or check back soon.',
  },
  'vendor-dd-memo': {
    price_usd: 5,
    amount: '5000000',
    eta_seconds: [30, 150],
    summary:
      'Vendor / counterparty due-diligence memo: OFAC sanctions screen (alias-aware, deterministic), GLEIF legal-entity lookup, media-narrative-vs-court-record check, and — if you pass a token address — a deterministic on-chain token safety verdict. Composed from live PulseNetwork engines into one memo with an honest per-source coverage block.',
    tags: ['due-diligence', 'vendor-check', 'sanctions', 'kyb', 'counterparty-risk'],
    queryParams: {
      company_or_token: 'Legal/company name, or a token contract address / Solana mint (required)',
      chain: 'Token chain if company_or_token is an address: base|ethereum|bsc|arbitrum|polygon|optimism|avalanche|solana (optional)',
      country: 'Country hint for entity matching, optional',
      jurisdiction: 'Jurisdiction hint for the media-vs-record check, optional',
    },
    outputExample: {
      task_type: 'vendor-dd-memo',
      subject: 'Acme Corp',
      components: { sanctions: { status: 'ok' }, entity: { status: 'ok' }, media_vs_record: { status: 'ok' }, token_safety: { status: 'skipped', note: 'no token address given' } },
      markdown: '# Vendor DD Memo…',
    },
    available: () => true,
  },
  'market-entry-brief': {
    price_usd: 10,
    amount: '10000000',
    eta_seconds: [40, 200],
    summary:
      'Market-entry brief for a sector × target country: country-risk assessment, sector supply-chain geopolitical risk, regulatory applicability preview, global macro regime context, and (if you pass your home country) bilateral trade-tension analysis. Composed from live PulseNetwork engines with an honest per-source coverage block.',
    tags: ['market-entry', 'country-risk', 'expansion', 'geopolitics', 'regulatory'],
    queryParams: {
      sector: 'Your sector/product in a few words (required)',
      target_country: 'Country you are entering (required)',
      home_country: 'Your home country for trade-tension analysis (optional)',
      size: 'Company size hint for the regulatory preview: micro|small|medium|large (optional)',
    },
    // GATED OFF: two of its five engines (geopoliticalpulse, macropulse) don't accept the hub's
    // internal key, so a paid call would deliver a mostly-empty memo. Re-enable with
    // HIRE_MARKET_ENTRY_ENABLED=1 once composition authenticates to every engine (x402 self-pay,
    // or a shared fleet master key). 503s before any 402 until then — never charged.
    outputExample: {
      task_type: 'market-entry-brief',
      subject: 'industrial sensors → Brazil',
      components: { country_risk: { status: 'ok' }, supply_chain: { status: 'ok' }, regulatory: { status: 'ok' }, macro_regime: { status: 'ok' }, trade_tension: { status: 'skipped' } },
      markdown: '# Market Entry Brief…',
    },
    available: () => process.env.HIRE_MARKET_ENTRY_ENABLED === '1',
    unavailable_reason:
      'market-entry-brief is being upgraded to source all of its intelligence engines reliably and is temporarily offline — no charge is taken. Use vendor-dd-memo now, or check back soon.',
  },
};

// ---------------------------------------------------------------------------
// Input validation + declined categories (400 BEFORE payment — code, not prompts)
// ---------------------------------------------------------------------------

// Consumer-targeting / protected-class / harassment / deception word-list. Matches are
// whole-word, case-insensitive, checked against thesis+target_profile (prospect-ledger)
// or all string inputs (other types). Each entry carries its refusal bucket.
const DECLINE_PATTERNS: Array<{ re: RegExp; reason: string }> = [
  {
    // Target-of-outreach phrasing only, so market-context nouns ("companies building
    // student housing", "clinics managing patient flow") are NOT blocked.
    re: /\b(?:sell(?:ing)? to|market(?:ing)? to|target(?:ing)?|reach(?:ing)?|list of|leads?(?: of| are| :)|contact) (?:consumers?|homeowners?|households?|retirees?|seniors?|the elderly|parents|b2c|retail (?:customers?|investors?)|private individuals?|individual (?:people|persons|consumers?))\b/i,
    reason: 'consumer-targeted prospect lists are declined — this surface researches BUSINESSES and business roles only',
  },
  {
    re: /\b(?:b2c leads?|people over \d{2}|(?:patients?|consumers?)(?: as | to )(?:leads?|contacts?|targets?))\b/i,
    reason: 'consumer-targeted prospect lists are declined — this surface researches BUSINESSES and business roles only',
  },
  {
    re: /\b(?:(?:owned |run |led |filter(?:ed)? |select(?:ed)? |sort(?:ed)? |based |target(?:ed|ing)? )?by (?:a |their |the |specific )*(?:race|ethnic\w*|religion|religious belief|faith|nationality|sexual orientation|gender identity|disability|pregnancy)|(?:muslim|jewish|christian|hindu|immigrant|lgbtq?|disabled|pregnant)[- ]owned|target(?:ing)? (?:muslims?|jews?|christians?|hindus?|immigrants?|lgbtq?))\b/i,
    reason: 'targeting by protected characteristics is declined',
  },
  {
    re: /\b(?:home address(?:es)?|personal (?:phone|cell|mobile|email|number)|family members?|spouse|dox(?:x|xx)?(?:es|ed|ing)?|stalk(?:ing|er)?|surveill?(?:ance|ing)?|track (?:him|her|them|this person)|where (?:he|she|they) lives?|their (?:home|residence))\b/i,
    reason: 'requests that read as locating or profiling private individuals are declined',
  },
  {
    re: /\b(?:pretend(?:ing)? to be|impersonat(?:e|ing|ion)|fake (?:identity|company|profile|persona)|phish(?:ing)?|pretext(?:ing)?|scrape their (?:users|members|customers|subscribers))\b/i,
    reason: 'deceptive-outreach research is declined',
  },
];

export function declineCheck(...texts: Array<string | undefined>): string | null {
  const joined = texts.filter(Boolean).join(' \n ');
  for (const { re, reason } of DECLINE_PATTERNS) {
    const m = joined.match(re);
    if (m) return `${reason} (matched: "${m[0]}")`;
  }
  return null;
}

function str(v: unknown): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === 'string' && s.trim() ? s.trim() : undefined;
}
function num(v: unknown): number | undefined {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) ? n : undefined;
}

/** Merge query params + JSON body (body wins) into one input record. */
export function readInput(query: Record<string, unknown>, body: unknown): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...query };
  if (body && typeof body === 'object' && !Array.isArray(body)) Object.assign(merged, body as object);
  return merged;
}

export function validateAndQuote(taskType: string, raw: Record<string, unknown>): QuoteResult {
  const t = TASK_TYPES[taskType];
  if (!t) {
    return { ok: false, task_type: taskType, declined_reason: `unknown task_type — one of: ${Object.keys(TASK_TYPES).join(', ')}` };
  }
  if (!t.available()) {
    return { ok: false, task_type: taskType, declined_reason: t.unavailable_reason ?? 'temporarily unavailable' };
  }

  if (taskType === 'prospect-ledger') {
    const thesis = str(raw.thesis);
    const target_profile = str(raw.target_profile);
    const region = str(raw.region);
    const count = Math.min(15, Math.max(5, Math.round(num(raw.count) ?? 10)));
    if (!thesis || thesis.length < 80 || thesis.length > 1000) {
      return { ok: false, task_type: taskType, declined_reason: 'thesis is required, 80-1000 characters — say what you sell and why a prospect would care' };
    }
    if (!target_profile || target_profile.length < 10 || target_profile.length > 500) {
      return { ok: false, task_type: taskType, declined_reason: 'target_profile is required, 10-500 characters — industry, size, role, buying signals' };
    }
    const declined = declineCheck(thesis, target_profile, region);
    if (declined) return { ok: false, task_type: taskType, declined_reason: declined };
    return { ok: true, task_type: taskType, price_usd: t.price_usd, amount: t.amount, eta_seconds: t.eta_seconds, normalized_input: { thesis, target_profile, region, count } };
  }

  if (taskType === 'vendor-dd-memo') {
    const company_or_token = str(raw.company_or_token);
    if (!company_or_token || company_or_token.length < 2 || company_or_token.length > 200) {
      return { ok: false, task_type: taskType, declined_reason: 'company_or_token is required (2-200 chars): a company/legal name, or a token contract address / mint' };
    }
    const declined = declineCheck(company_or_token);
    if (declined) return { ok: false, task_type: taskType, declined_reason: declined };
    return {
      ok: true, task_type: taskType, price_usd: t.price_usd, amount: t.amount, eta_seconds: t.eta_seconds,
      normalized_input: { company_or_token, chain: str(raw.chain), country: str(raw.country), jurisdiction: str(raw.jurisdiction) },
    };
  }

  // market-entry-brief
  const sector = str(raw.sector);
  const target_country = str(raw.target_country);
  if (!sector || sector.length < 3 || sector.length > 120) {
    return { ok: false, task_type: taskType, declined_reason: 'sector is required (3-120 chars)' };
  }
  if (!target_country || target_country.length < 2 || target_country.length > 60) {
    return { ok: false, task_type: taskType, declined_reason: 'target_country is required (2-60 chars)' };
  }
  const declined = declineCheck(sector, target_country);
  if (declined) return { ok: false, task_type: taskType, declined_reason: declined };
  return {
    ok: true, task_type: taskType, price_usd: t.price_usd, amount: t.amount, eta_seconds: t.eta_seconds,
    normalized_input: { sector, target_country, home_country: str(raw.home_country), size: str(raw.size) },
  };
}

// ---------------------------------------------------------------------------
// Internal fleet composition (master key, near-$0 marginal cost)
// ---------------------------------------------------------------------------

export interface ComponentResult {
  status: 'ok' | 'failed' | 'skipped';
  note?: string;
  data?: unknown;
}

const FLEET_TIMEOUT_MS = 120_000;

// x402 self-pay fetch, built once from HUB_PAYER_KEY (a dedicated low-balance Base USDC wallet).
// Used as the fallback when a fleet vertical doesn't accept the hub's internal key (the fleet does
// not share one master key). null when the key isn't configured — then 402'd engines simply fail.
type PaidFetch = (url: string, init?: RequestInit) => Promise<Response>;
let _paidFetch: Promise<PaidFetch | null> | undefined;
function paidFetch(): Promise<PaidFetch | null> {
  if (_paidFetch === undefined) {
    _paidFetch = (async () => {
      const rawKey = process.env.HUB_PAYER_KEY;
      if (!rawKey) return null;
      try {
        const [{ wrapFetchWithPayment }, { x402Client }, { ExactEvmScheme }, { privateKeyToAccount }] = await Promise.all([
          import('@x402/fetch'),
          import('@x402/core/client'),
          import('@x402/evm'),
          import('viem/accounts'),
        ]);
        const key = (rawKey.startsWith('0x') ? rawKey : '0x' + rawKey) as `0x${string}`;
        const client = new x402Client();
        client.register('eip155:8453', new ExactEvmScheme(privateKeyToAccount(key)));
        return wrapFetchWithPayment(fetch, client) as PaidFetch;
      } catch (err) {
        console.error('[FAIL] hire paidFetch init:', (err as Error).message);
        return null;
      }
    })();
  }
  return _paidFetch;
}

export async function fleetCall(url: string): Promise<ComponentResult> {
  // Assert fleet host first: the internal key must NEVER leave our own domain, and even the paid
  // path should only ever hit our engines. redirect:'error' stops a dangling CNAME from forwarding
  // the custom header outward (undici keeps custom headers across cross-origin redirects).
  let host: string;
  try {
    host = new URL(url).host.toLowerCase();
  } catch {
    console.error('[FAIL] hire fleetCall: unparseable url', url);
    return { status: 'failed', note: 'bad url' };
  }
  if (!(host === 'theaslangroupllc.com' || host.endsWith('.theaslangroupllc.com'))) {
    console.error('[FAIL] hire fleetCall: refusing non-fleet host', host);
    return { status: 'failed', note: 'non-fleet host refused' };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FLEET_TIMEOUT_MS);
  try {
    // 1. Try the internal key (free) first — accepted by verticals sharing the hub's key.
    const key = process.env.PULSE_INTERNAL_KEY;
    if (key) {
      const res = await fetch(url, { headers: { 'x-internal-key': key }, redirect: 'error', signal: ctrl.signal });
      if (res.ok) return { status: 'ok', data: await res.json() };
      if (res.status !== 402) {
        console.error(`[FAIL] hire fleetCall ${url} → internal HTTP ${res.status}`);
        return { status: 'failed', note: `upstream HTTP ${res.status}` };
      }
      await res.body?.cancel().catch(() => {}); // 402: release socket, fall through to x402 pay
    }
    // 2. x402 self-pay fallback (this vertical doesn't accept our internal key).
    const pf = await paidFetch();
    if (!pf) {
      console.error(`[FAIL] hire fleetCall ${url} → 402 and HUB_PAYER_KEY not configured`);
      return { status: 'failed', note: 'payment rail unavailable' };
    }
    const pres = await pf(url, { redirect: 'error', signal: ctrl.signal });
    if (!pres.ok) {
      console.error(`[FAIL] hire fleetCall ${url} → paid HTTP ${pres.status}`);
      return { status: 'failed', note: `paid HTTP ${pres.status}` };
    }
    return { status: 'ok', data: await pres.json() };
  } catch (err) {
    console.error(`[FAIL] hire fleetCall ${url} →`, (err as Error).message);
    return { status: 'failed', note: (err as Error).message.slice(0, 120) };
  } finally {
    clearTimeout(timer);
  }
}

export function looksLikeEvmAddress(s: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(s);
}
export function looksLikeSolanaMint(s: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s) && !/^0x/.test(s);
}

// ---------------------------------------------------------------------------
// Personal-contact filter (no-personal-info doctrine — code-level, output side)
// ---------------------------------------------------------------------------

// Known consumer/free-email providers — matched on the SECOND-LEVEL domain (the label before
// the public suffix), so gmail.com, gmail.co.uk, and mail.gmail.com all resolve to "gmail".
// This is provider-based, not TLD-based, so it survives new ccTLDs (proton.me, pm.me, yahoo.co.in).
const FREEMAIL_PROVIDERS = new Set([
  'gmail', 'googlemail', 'yahoo', 'ymail', 'rocketmail', 'hotmail', 'outlook', 'live', 'msn',
  'proton', 'protonmail', 'pm', 'icloud', 'me', 'mac', 'aol', 'gmx', 'zoho', 'yandex', 'mail',
  'fastmail', 'hey', 'tutanota', 'tuta', 'rediffmail', 'rediff', 'qq', '163', '126', 'sina',
  'naver', 'daum', 'web', 't-online', 'orange', 'wanadoo', 'free', 'libero', 'comcast', 'att',
  'verizon', 'sbcglobal', 'bellsouth', 'cox', 'charter', 'btinternet', 'sky', 'ntlworld',
  'inbox', 'gmx', 'mail', 'usa', 'msn', ' meta', 'hush', 'hushmail', 'pobox',
]);
// Public suffixes we peel off to find the second-level label. Covers common multi-part ccTLDs.
const MULTI_SUFFIX = /\.(co|com|net|org|gov|edu|ac|or|ne|go)\.[a-z]{2}$/i;

function emailDomainLabel(email: string): string | null {
  const at = email.lastIndexOf('@');
  if (at < 0) return null;
  let host = email.slice(at + 1).trim().toLowerCase().replace(/[>).,;]+$/, '');
  if (!host.includes('.')) return null;
  // Strip a multi-part public suffix (co.uk) if present, else strip the single TLD.
  host = MULTI_SUFFIX.test(host) ? host.replace(MULTI_SUFFIX, '') : host.replace(/\.[a-z]{2,}$/i, '');
  const labels = host.split('.').filter(Boolean);
  return labels.length ? labels[labels.length - 1] : null; // second-level label
}

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// A phone: optional +, then 7-15 digits total once separators are stripped. Rejected if the
// digit run is a lone 4-digit year or a run of year-like 4-digit groups (revenue "2020 2021…").
const PHONE_CANDIDATE = /\+?\d[\d\s().-]{5,}\d/g;

function isPhoneLike(candidate: string): boolean {
  const digits = candidate.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return false;
  // All-year-groups guard: "2020 2021 2022" tokenizes to only 4-digit 19xx/20xx groups.
  const groups = candidate.trim().split(/[\s,]+/);
  if (groups.length > 1 && groups.every((g) => /^(19|20)\d{2}$/.test(g))) return false;
  return true;
}

// Phone-carrier / messaging hosts whose URLs ARE a personal phone channel.
const PHONE_URL_HOST = /^(https?:\/\/)?(www\.)?(wa\.me|api\.whatsapp\.com|t\.me\/\+|telegram\.me\/\+|signal\.me|m\.me)\b|^tel:|^sms:|^whatsapp:/i;

function isPersonalEmail(value: string): boolean {
  const m = value.match(EMAIL_RE);
  if (!m) return false;
  return m.some((e) => {
    const label = emailDomainLabel(e);
    return label !== null && FREEMAIL_PROVIDERS.has(label);
  });
}

/** True if a source URL carries a personal email or phone in its query/path (exfil-shaped or
 *  accidental PII leak). Used to drop such URLs from delivered source lists. */
export function isPersonalEmailUrl(url: string): boolean {
  const decoded = (() => { try { return decodeURIComponent(url); } catch { return url; } })();
  if (isPersonalEmail(decoded)) return true;
  if (PHONE_URL_HOST.test(decoded)) return true;
  return false;
}

/** Strips personal emails and anything phone-shaped from a contact value.
 *  Returns null when the contact should be dropped entirely. */
export function sanitizeContact(contact: { type?: string; value?: string } | undefined): { type: string; value: string } | null {
  if (!contact || typeof contact.value !== 'string' || !contact.value.trim()) return null;
  const value = contact.value.trim();
  if (isPersonalEmail(value)) return null;
  if (PHONE_URL_HOST.test(value)) return null;
  const isUrl = /^https?:\/\//i.test(value);
  if (!isUrl && (value.match(PHONE_CANDIDATE) || []).some(isPhoneLike)) return null;
  const type = typeof contact.type === 'string' && contact.type.trim() ? contact.type.trim() : 'unknown';
  return { type, value };
}

/** Removes personal emails / phone strings anywhere in free text (defense in depth). */
export function scrubText(text: string): string {
  return text
    .replace(EMAIL_RE, (e) => (isPersonalEmail(e) ? '[removed: personal contact]' : e))
    .replace(PHONE_CANDIDATE, (m) => (isPhoneLike(m) ? '[removed: phone]' : m));
}

// ---------------------------------------------------------------------------
// Citation existence gate (D5-lite: the URL must exist NOW, or the claim is labeled)
// ---------------------------------------------------------------------------

// Block private / link-local / loopback hosts so the verified-boolean can't be used as a blind
// SSRF oracle by a prompt-injected model. Hostnames that aren't literal IPs are allowed (public
// DNS resolution happens at fetch time; the value here is only a status boolean, never content).
function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal') || h.endsWith('.local')) return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224) return true;
  }
  if (h.includes(':')) return true; // IPv6 literal — refuse (covers ::1, fc00::, fe80::)
  return false;
}

export async function checkUrl(url: string): Promise<boolean> {
  if (!/^https?:\/\//i.test(url)) return false;
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return false;
  }
  if (isBlockedHost(host)) return false;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8_000);
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
    // Many sites 403/405 bare HEADs — retry once with GET before declaring dead.
    if (res.status >= 400) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { range: 'bytes=0-2048' } });
    }
    const ok = res.status >= 200 && res.status < 400;
    ctrl.abort(); // release the socket immediately — we only needed the status line
    return ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Verify a batch of URLs with bounded concurrency. Returns a map of url → true|false for every
 *  URL actually checked. URLs beyond `cap` are simply absent from the map — callers must treat
 *  "absent" as UNCHECKED (not "failed"), so the deliverable never claims a URL "did not resolve"
 *  when it was never tested. `deadlineMs` (epoch) stops the sweep early under a wall-clock budget. */
export async function verifyCitations(urls: string[], cap = 90, deadlineMs = Infinity): Promise<Map<string, boolean>> {
  const unique = [...new Set(urls)].slice(0, cap);
  const out = new Map<string, boolean>();
  const POOL = 8;
  for (let i = 0; i < unique.length; i += POOL) {
    if (Date.now() > deadlineMs) break; // leave the rest UNCHECKED rather than blow the budget
    const batch = unique.slice(i, i + POOL);
    const results = await Promise.all(batch.map((u) => checkUrl(u)));
    batch.forEach((u, j) => out.set(u, results[j]));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Strict-JSON extraction (balanced-brace extractor + shape check; manual §6)
// ---------------------------------------------------------------------------

export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') inStr = !inStr;
    if (inStr) continue;
    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Markdown-injection defense (D: composed memos embed third-party-derived strings)
// ---------------------------------------------------------------------------

/** Neutralize a string so it cannot break out of a ```json fence or inject markdown/instructions
 *  when embedded in a delivered memo. Backticks (fence breakout), leading #/> (heading/quote
 *  injection). Used on every upstream/model-derived value that lands in `markdown`. */
export function fenceSafe(s: string): string {
  return s.replace(/`/g, 'ˋ'); // ` → modifier-letter grave accent (renders same, inert)
}
/** For inline (non-fenced) markdown: also defang line-leading structural characters. */
export function inlineSafe(s: string): string {
  return fenceSafe(s).replace(/[\r\n]+/g, ' ').replace(/^[\s>#*_=+-]+/, '').trim();
}
/** Pretty-print upstream JSON into a fence, guaranteed not to break the fence or dangle. */
export function safeJsonBlock(data: unknown, limit = 6000): string {
  let body = fenceSafe(JSON.stringify(data, null, 2)).slice(0, limit);
  // A slice can cut mid-line; that's fine inside a fence, but ensure we never end on a stray
  // backtick-equivalent and always re-close the fence ourselves.
  return '```json\n' + body + '\n```';
}

export const PAID_ERROR_NOTE =
  'You were charged for this request and it failed on our side — this is our bug. Retry the identical request; if it fails again contact info@theaslangroupllc.com with your payment tx hash for a credit.';
