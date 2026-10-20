// POST|GET /api/hire/vendor-dd-memo — $5.00 x402. Deterministic composition, no new LLM call:
// OFAC sanctions screen + GLEIF entity lookup + media-vs-record + (token mode) on-chain safety.
// Honest coverage block per D1/D10: every component reports ok|failed|skipped; if ALL fail we
// 500 with the paid-error note instead of shipping an empty memo.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePaymentGate } from '../../lib/x402.js';
import { paidCacheArm } from '../../lib/paid-cache.js';
import {
  TASK_TYPES, readInput, validateAndQuote, fleetCall, looksLikeEvmAddress, looksLikeSolanaMint,
  PAID_ERROR_NOTE, safeJsonBlock, fenceSafe, type ComponentResult,
} from '../../lib/hire.js';

const T = TASK_TYPES['vendor-dd-memo'];

function hasPaymentSignature(req: VercelRequest): boolean {
  const h = req.headers['payment-signature'] ?? req.headers['PAYMENT-SIGNATURE' as never];
  return typeof h === 'string' && h.length > 0;
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, PAYMENT-SIGNATURE');
  res.setHeader('Access-Control-Expose-Headers', 'PAYMENT-REQUIRED, PAYMENT-RESPONSE');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  // Read inputs. Malformed body must NOT reach the outer catch (which claims "you were charged").
  let input: Record<string, unknown>;
  try {
    input = readInput(req.query as Record<string, unknown>, req.body);
  } catch (err) {
    res.status(400).json({ error: 'bad_request', message: 'Could not parse request body as JSON.', not_charged: true });
    return;
  }

  // Bare probe (no payment signature) → emit the 402 challenge so Bazaar/x402scan can index this
  // route. Nothing can be charged without a signature, so declined-input validation happens on the
  // SIGNED path only, still before verify/settle.
  const signed = hasPaymentSignature(req);
  if (signed) {
    const quote = validateAndQuote('vendor-dd-memo', { ...input, task_type: 'vendor-dd-memo' });
    if (!quote.ok) {
      res.status(400).json({ declined: true, reason: quote.declined_reason, not_charged: true });
      return;
    }
  }

  const gate = await handlePaymentGate(req.headers, req.url ?? '/api/hire/vendor-dd-memo', T.amount, T.summary, T.tags, {
    queryParams: T.queryParams,
    outputExample: T.outputExample,
  });
  if (!gate.ok) { Object.entries(gate.headers).forEach(([k, v]) => res.setHeader(k, v)); res.status(gate.status).json(gate.body); return; }

  // Past the gate = paid. On the signed path this already validated pre-gate; re-run as a guard.
  const quote = validateAndQuote('vendor-dd-memo', { ...input, task_type: 'vendor-dd-memo' });
  if (!quote.ok) {
    console.error('[FAIL] vendor-dd-memo: settled request failed validation (should be unreachable)', quote.declined_reason);
    res.status(400).json({ declined: true, reason: quote.declined_reason });
    return;
  }
  const { company_or_token, chain, country, jurisdiction } = quote.normalized_input as Record<string, string | undefined>;
  const subject = company_or_token!;

  // ---- Execute: parallel fleet composition ----
  const enc = encodeURIComponent;
  const isEvm = looksLikeEvmAddress(subject);
  const isMint = !isEvm && looksLikeSolanaMint(subject);
  const tokenMode = isEvm || isMint;

  const calls: Record<string, Promise<ComponentResult>> = {
    sanctions: tokenMode
      ? Promise.resolve<ComponentResult>({ status: 'skipped', note: 'subject is a token address — sanctions screening needs a legal name' })
      : fleetCall(`https://compliancepulse.theaslangroupllc.com/api/screen/sanctions?name=${enc(subject)}${country ? `&country=${enc(country)}` : ''}`),
    entity: tokenMode
      ? Promise.resolve<ComponentResult>({ status: 'skipped', note: 'subject is a token address — GLEIF lookup needs a legal name' })
      : fleetCall(`https://compliancepulse.theaslangroupllc.com/api/validate/lei?name=${enc(subject)}${country ? `&country=${enc(country)}` : ''}`),
    media_vs_record: tokenMode
      ? Promise.resolve<ComponentResult>({ status: 'skipped', note: 'subject is a token address — pass a company name for the media-vs-record check' })
      : fleetCall(`https://truthpulse.theaslangroupllc.com/api/truth/media-vs-record?case_or_topic=${enc(subject)}${jurisdiction ? `&jurisdiction=${enc(jurisdiction)}` : ''}`),
    token_safety: tokenMode
      ? (isMint || chain === 'solana'
          ? fleetCall(`https://onchainpulse.theaslangroupllc.com/api/memecoin?mint=${enc(subject)}`)
          : fleetCall(`https://onchainpulse.theaslangroupllc.com/api/evmtoken?address=${enc(subject)}&chain=${enc(chain ?? 'base')}`))
      : Promise.resolve<ComponentResult>({ status: 'skipped', note: 'no token address given' }),
  };

  const keys = Object.keys(calls);
  const settled = await Promise.all(Object.values(calls));
  const components: Record<string, ComponentResult> = {};
  keys.forEach((k, i) => (components[k] = settled[i]));

  const ran = keys.filter((k) => components[k].status !== 'skipped');
  const failed = ran.filter((k) => components[k].status === 'failed');
  if (ran.length > 0 && failed.length === ran.length) {
    console.error('[FAIL] vendor-dd-memo: ALL components failed', { subject, failed });
    res.status(500).json({ error: 'all_components_failed', components, message: PAID_ERROR_NOTE });
    return;
  }

  // ---- Deterministic memo assembly ----
  const lines: string[] = [
    `# Vendor Due-Diligence Memo — ${fenceSafe(subject)}`,
    '',
    `Generated by PulseNetwork Hire-the-Fleet (vendor-dd-memo, $${T.price_usd.toFixed(2)}). Deterministic composition of live engines — no generative synthesis in this memo. Each section reports its own source status.`,
    '',
  ];
  const summarize = (k: string, title: string): void => {
    const c = components[k];
    lines.push(`## ${title}`);
    if (c.status === 'skipped') lines.push(`_Skipped: ${fenceSafe(String(c.note))}_`);
    else if (c.status === 'failed') lines.push(`**SOURCE FAILED** (${fenceSafe(String(c.note))}) — this section is missing, not clean. See coverage.`);
    else lines.push(safeJsonBlock(c.data));
    lines.push('');
  };
  summarize('sanctions', 'OFAC Sanctions Screen (deterministic, alias-aware)');
  summarize('entity', 'Legal Entity Lookup (GLEIF)');
  summarize('media_vs_record', 'Media Narrative vs. Court Record');
  summarize('token_safety', 'On-chain Token Safety (deterministic verdict)');
  lines.push('## Coverage', ...keys.map((k) => `- ${k}: ${components[k].status}${components[k].note ? ` (${components[k].note})` : ''}`));
  lines.push('', '_A failed section means the underlying engine was unavailable — it never means "no findings". Failed-section-only reruns: contact info@theaslangroupllc.com for a credit._');

  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('PAYMENT-RESPONSE', gate.settlementHeader);
  paidCacheArm(req, res);
  res.status(200).json({
    task_type: 'vendor-dd-memo',
    subject,
    token_mode: tokenMode,
    components,
    coverage: { ran: ran.length, ok: ran.length - failed.length, failed: failed.length, skipped: keys.length - ran.length },
    markdown: lines.join('\n'),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('[FAIL] hire/vendor-dd-memo unhandled', { url: req.url, err });
    if (!res.headersSent) res.status(500).json({ error: 'task_failed', message: PAID_ERROR_NOTE });
  }
}
