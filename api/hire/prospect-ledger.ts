// POST|GET /api/hire/prospect-ledger — $25.00 x402. Claude + web search produce a ranked B2B
// prospect research ledger. Env-gated on ANTHROPIC_API_KEY (503 BEFORE payment when absent).
//
// HARD RULES enforced in code, not prompts:
//  - This route NEVER sends anything anywhere. Outbound HTTP = Anthropic API + citation
//    existence checks (GET/HEAD of source URLs) only. No SMTP, no form posts, no webhooks.
//  - Public business contacts only: personal-email/phone filter runs on the OUTPUT.
//  - Declined categories 400 before the payment gate.
//  - Citation gate: every source URL is existence-checked; prospects whose sources all fail
//    are labeled tier "unverified" — honest-no beats fake-yes.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { handlePaymentGate } from '../../lib/x402.js';
import { paidCacheArm } from '../../lib/paid-cache.js';
import { isInternalRequest } from '../../lib/internal-auth.js';
import {
  TASK_TYPES, readInput, validateAndQuote, sanitizeContact, scrubText, verifyCitations,
  extractJson, inlineSafe, isPersonalEmailUrl, PAID_ERROR_NOTE,
} from '../../lib/hire.js';

const T = TASK_TYPES['prospect-ledger'];
const MODEL = 'claude-sonnet-5'; // per spec + model-budget-delegation doctrine
// Budgets under Vercel's 300s maxDuration. Research is HARD-ABORTED at RESEARCH_MS via an
// AbortSignal passed into the model stream (a between-hops check alone can't stop an in-flight
// hop from overrunning — that caused a live 504 charge-without-delivery on first test). Citations
// then get up to CITATION_MS, leaving ~60s margin for assembly + the HTTP response.
const RESEARCH_MS = 235_000;
const CITATION_MS = 18_000;
const MAX_WEB_SEARCHES = 6; // bounded for latency — interleaved search round-trips are the sink

function hasPaymentSignature(req: VercelRequest): boolean {
  const h = req.headers['payment-signature'] ?? req.headers['PAYMENT-SIGNATURE' as never];
  return typeof h === 'string' && h.length > 0;
}

interface RawProspect {
  who?: string;
  company?: string;
  role?: string;
  why_fit?: string;
  sources?: string[];
  contact?: { type?: string; value?: string };
  opening_question?: string;
}

function buildPrompt(thesis: string, target_profile: string, region: string | undefined, count: number): string {
  return [
    `Research ${count} real, currently-operating BUSINESSES that fit this thesis and profile. You are producing a research memo — nobody will be contacted; do not draft outreach or pitches.`,
    '',
    `THESIS (what the buyer sells / why a prospect cares): ${thesis}`,
    `TARGET PROFILE: ${target_profile}`,
    region ? `REGION: ${region}` : 'REGION: global',
    '',
    'Requirements per prospect:',
    '- who: company name + the relevant ROLE (never a private individual outside their business role)',
    '- why_fit: 1-3 sentences of SPECIFIC evidence tying this company to the thesis (an announcement, hiring signal, tech stack, expansion, regulatory event). Every factual claim must come from a source you actually found via web search.',
    '- sources: the URLs supporting why_fit. These will be MACHINE-VERIFIED after you finish — a URL that does not resolve marks the prospect unverified, so only cite pages you actually opened.',
    '- contact: ONE public BUSINESS contact route only — company contact page URL, published business email on a company domain, or the company LinkedIn page URL. NEVER personal emails (gmail etc.), NEVER phone numbers; these are stripped by a code filter after you, so including them only destroys the entry.',
    '- opening_question: ONE tailored research-style opening question the buyer could ask (a genuine question about their situation — no pitch, no flattery).',
    '',
    'Rank by fit strength. Prefer fewer well-evidenced prospects over padded weak ones — if you can only evidence 7, return 7.',
    '',
    'Return STRICT JSON only, no prose before or after, exactly this shape:',
    '{"prospects":[{"who":"...","why_fit":"...","sources":["https://..."],"contact":{"type":"company_contact_page|business_email|linkedin_company","value":"..."},"opening_question":"..."}]}',
  ].join('\n');
}

interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  webSearches: number;
}
const ZERO_USAGE: Usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, webSearches: 0 };

// Sonnet 5 intro pricing (through 2026-08-31): $2/1M input, $10/1M output. Cache read ~0.1x
// input, cache write 1.25x. Web search $10 per 1,000 requests. Server-side telemetry only.
function estimateCostUsd(u: Usage): number {
  return (
    (u.input / 1e6) * 2 +
    (u.output / 1e6) * 10 +
    (u.cacheRead / 1e6) * 0.2 +
    (u.cacheWrite / 1e6) * 2.5 +
    (u.webSearches / 1000) * 10
  );
}

async function runResearch(client: Anthropic, prompt: string, deadlineMs: number, usage: Usage): Promise<RawProspect[] | null> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }];
  const textChunks: string[] = [];
  let refused = false;
  // Resume up to 3 pause_turns (server-tool loops legitimately pause on long web-search turns).
  for (let hop = 0; hop < 4; hop++) {
    const remaining = deadlineMs - Date.now();
    if (remaining < 3_000) { console.error('[FAIL] prospect-ledger: research deadline reached'); break; }
    // HARD stop: the model stream is aborted at the wall-clock deadline so an in-flight hop can
    // never run the function past maxDuration. Whatever text we have so far is still parsed below.
    const signal = AbortSignal.timeout(remaining);
    let final: Anthropic.Message;
    try {
      const stream = client.messages.stream(
        {
          model: MODEL,
          max_tokens: 10000,
          // Thinking OFF + low effort: adaptive thinking interleaves reasoning between every web
          // search, which blows the 300s synchronous budget. This is aggregation, not deep
          // reasoning, so disabling thinking is the right latency/quality trade here. (Server-side
          // web search means the "tool call as plain text" disabled-thinking pitfall doesn't apply —
          // searches execute on Anthropic's side, not via a client tool_use block.)
          thinking: { type: 'disabled' },
          output_config: { effort: 'low' },
          system:
            'You are a precise, FAST B2B prospect researcher on a strict time budget. Work efficiently: at most one or two targeted web searches per prospect, then write the result. You only report what you verified via web search this session. Your output is consumed by a machine pipeline that verifies every source URL and strips non-business contact data — so return the final JSON as soon as you have enough evidence rather than continuing to search.',
          messages,
          tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: MAX_WEB_SEARCHES }],
        },
        { signal },
      );
      final = await stream.finalMessage();
    } catch (err) {
      // Abort/timeout/transient error — stop looping and deliver best-effort from what we have.
      console.error('[FAIL] prospect-ledger: research hop aborted/errored', (err as Error).name, (err as Error).message?.slice(0, 100));
      break;
    }
    const un = final.usage as {
      input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number;
      cache_creation_input_tokens?: number; server_tool_use?: { web_search_requests?: number };
    };
    usage.input += un.input_tokens ?? 0;
    usage.output += un.output_tokens ?? 0;
    usage.cacheRead += un.cache_read_input_tokens ?? 0;
    usage.cacheWrite += un.cache_creation_input_tokens ?? 0;
    usage.webSearches += un.server_tool_use?.web_search_requests ?? 0;
    if (final.stop_reason === 'refusal') {
      console.error('[FAIL] prospect-ledger: model refusal', (final as { stop_details?: unknown }).stop_details);
      refused = true;
      break;
    }
    for (const b of final.content) if (b.type === 'text') textChunks.push(b.text);
    if (final.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: final.content });
      continue; // resume the same turn — do NOT restart from scratch (would re-bill and re-pause)
    }
    break;
  }
  if (refused) return null;
  const parsed = extractJson(textChunks.join('\n')) as { prospects?: RawProspect[] } | null;
  if (!parsed || !Array.isArray(parsed.prospects) || parsed.prospects.length === 0) return null;
  return parsed.prospects;
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, PAYMENT-SIGNATURE');
  res.setHeader('Access-Control-Expose-Headers', 'PAYMENT-REQUIRED, PAYMENT-RESPONSE');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const startMs = Date.now();
  const researchDeadlineMs = startMs + RESEARCH_MS;

  // Availability gate FIRST — never issue a 402 for a task we cannot run.
  if (!T.available()) {
    res.status(503).json({ error: 'temporarily_unavailable', message: T.unavailable_reason, not_charged: true });
    return;
  }

  let input: Record<string, unknown>;
  try {
    input = readInput(req.query as Record<string, unknown>, req.body);
  } catch {
    res.status(400).json({ error: 'bad_request', message: 'Could not parse request body as JSON.', not_charged: true });
    return;
  }

  // Bare probe (unsigned) → 402 challenge for indexers; declined-input validation on signed path only.
  if (hasPaymentSignature(req)) {
    const pre = validateAndQuote('prospect-ledger', { ...input, task_type: 'prospect-ledger' });
    if (!pre.ok) { res.status(400).json({ declined: true, reason: pre.declined_reason, not_charged: true }); return; }
  }

  const gate = await handlePaymentGate(req.headers, req.url ?? '/api/hire/prospect-ledger', T.amount, T.summary, T.tags, {
    queryParams: T.queryParams,
    outputExample: T.outputExample,
  });
  if (!gate.ok) { Object.entries(gate.headers).forEach(([k, v]) => res.setHeader(k, v)); res.status(gate.status).json(gate.body); return; }

  // Past the gate = paid. Validate/destructure on the paid path (signed path validated pre-gate).
  const quote = validateAndQuote('prospect-ledger', { ...input, task_type: 'prospect-ledger' });
  if (!quote.ok) {
    console.error('[FAIL] prospect-ledger: settled request failed validation (should be unreachable)', quote.declined_reason);
    res.status(400).json({ declined: true, reason: quote.declined_reason });
    return;
  }
  const { thesis, target_profile, region, count } = quote.normalized_input as { thesis: string; target_profile: string; region?: string; count: number };

  // ---- Research. Retry once on parse failure ONLY if the budget allows. ----
  const client = new Anthropic({ maxRetries: 0 }); // no SDK retry — we own the budget via AbortSignal
  const prompt = buildPrompt(thesis, target_profile, region, count);
  const usage: Usage = { ...ZERO_USAGE };
  let raw = await runResearch(client, prompt, researchDeadlineMs, usage);
  if (!raw && researchDeadlineMs - Date.now() > 60_000) {
    raw = await runResearch(client, prompt + '\n\nREMINDER: strict JSON only, exactly the shape specified.', researchDeadlineMs, usage);
  }
  if (!raw) {
    console.error('[FAIL] prospect-ledger: no parseable prospects (budget or parse)');
    res.status(500).json({ error: 'research_failed', message: PAID_ERROR_NOTE });
    return;
  }

  // ---- Citation existence gate (its own bounded budget; unchecked ≠ failed) ----
  const allUrls = raw.flatMap((p) => (Array.isArray(p.sources) ? p.sources.filter((s): s is string => typeof s === 'string') : []));
  const citeDeadline = Date.now() + CITATION_MS;
  const verified = await verifyCitations(allUrls, Math.max(20, count * 6), citeDeadline);

  // ---- Assemble with code-level contact filter ----
  let droppedByContactFilter = 0;
  let droppedUrlsForPII = 0;
  const prospects = raw
    .map((p) => {
      const who = inlineSafe(scrubText(String(p.who ?? [p.company, p.role].filter(Boolean).join(' — ') ?? 'unknown')));
      const whyFit = scrubText(String(p.why_fit ?? ''));
      const sources = (Array.isArray(p.sources) ? p.sources : [])
        .filter((s): s is string => typeof s === 'string')
        .filter((url) => { const bad = isPersonalEmailUrl(url); if (bad) droppedUrlsForPII++; return !bad; })
        .map((url) => {
          // Absent from the map = never checked (budget/cap). Distinguish from checked-and-failed.
          const status: 'verified' | 'unresolved' | 'unchecked' = verified.has(url) ? (verified.get(url) ? 'verified' : 'unresolved') : 'unchecked';
          return { url, status, verified: status === 'verified' };
        });
      const contact = sanitizeContact(p.contact);
      if (p.contact && !contact) droppedByContactFilter++;
      const anyVerified = sources.some((s) => s.status === 'verified');
      return {
        who,
        why_fit: whyFit,
        sources,
        contact: contact ?? { type: 'none_public_found', value: '' },
        opening_question: inlineSafe(scrubText(String(p.opening_question ?? ''))),
        confidence: anyVerified ? ('verified' as const) : ('unverified' as const),
      };
    })
    .filter((p) => p.who && p.why_fit)
    .sort((a, b) => (a.confidence === b.confidence ? 0 : a.confidence === 'verified' ? -1 : 1))
    .map((p, i) => ({ rank: i + 1, ...p }));

  if (prospects.length === 0) {
    console.error('[FAIL] prospect-ledger: all prospects filtered out');
    res.status(500).json({ error: 'no_deliverable_prospects', message: PAID_ERROR_NOTE });
    return;
  }

  const unverifiedCount = prospects.filter((p) => p.confidence === 'unverified').length;
  const md: string[] = [
    `# Prospect Ledger`,
    '',
    `Thesis: ${inlineSafe(thesis)}`,
    `Profile: ${inlineSafe(target_profile)}${region ? ` · Region: ${inlineSafe(region)}` : ''}`,
    '',
    `Delivered ${prospects.length}/${count} requested · ${unverifiedCount} carry tier UNVERIFIED (none of their cited sources resolved to a live page at delivery time — treat those claims as leads, not facts). This is a research memo: nothing was sent to anyone.`,
    '',
  ];
  for (const p of prospects) {
    md.push(
      `## ${p.rank}. ${p.who} ${p.confidence === 'unverified' ? '⚠️ UNVERIFIED' : ''}`,
      inlineSafe(p.why_fit),
      `Sources: ${p.sources.map((s) => `${s.url}${s.status === 'verified' ? '' : ` (${s.status})`}`).join(' · ') || 'none provided'}`,
      `Contact (public business route): ${p.contact.value || 'none found — research their site directly'}`,
      `Opening question: ${p.opening_question}`,
      '',
    );
  }

  // COGS telemetry: log every run's Anthropic cost server-side; expose it in the body ONLY to
  // internal callers (x-internal-key) so buyers never see our margin.
  const costUsd = estimateCostUsd(usage);
  console.log('[COST] prospect-ledger', JSON.stringify({ ...usage, costUsd: Number(costUsd.toFixed(4)), prospects: prospects.length, elapsedMs: Date.now() - startMs }));

  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('PAYMENT-RESPONSE', gate.settlementHeader);
  paidCacheArm(req, res);
  res.status(200).json({
    task_type: 'prospect-ledger',
    prospects,
    coverage: {
      requested: count,
      delivered: prospects.length,
      unverified: unverifiedCount,
      dropped_by_contact_filter: droppedByContactFilter,
      dropped_urls_for_pii: droppedUrlsForPII,
      citation_urls_checked: verified.size,
      elapsed_ms: Date.now() - startMs,
    },
    ...(isInternalRequest(req.headers) ? { _cost: { ...usage, cost_usd: Number(costUsd.toFixed(4)) } } : {}),
    exclusion_note: 'Research memo only — PulseNetwork never contacts prospects on your behalf. Personal contact data is filtered out in code.',
    markdown: md.join('\n'),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('[FAIL] hire/prospect-ledger unhandled', { url: req.url, err });
    if (!res.headersSent) res.status(500).json({ error: 'task_failed', message: PAID_ERROR_NOTE });
  }
}
