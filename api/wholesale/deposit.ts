// GET /api/wholesale/deposit?key=pk_live_...&tier=5|25|100 — top up a prepaid wholesale key's
// balance. This is the whole point of prepaid billing: no invoicing, no trust — it's just another
// x402-gated resource. The client pays a real on-chain USDC transfer (Base or Solana) for the
// chosen tier; on settlement, the balance credits atomically. No off-chain payment method exists.
//
// Safety-critical detail: we validate the key exists and is ACTIVE *before* ever returning a 402,
// so nobody can be tricked into paying to top up a dead/typo'd key. We also strip any x-internal-key
// header from the request before calling handlePaymentGate — otherwise a caller could point their
// OWN wholesale key at this endpoint and let the internal-bypass "pay" for the deposit for free
// (worse: it would deduct wholesale cost from their balance while crediting them the full retail
// tier amount, a net-positive exploit loop). Deposits must always go through real settlement.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePaymentGate } from '../../lib/x402.js';
import { pipe, isConfigured, KEY_RE, tierToMicro, DEPOSIT_TIERS_USD } from '../../lib/wholesale.js';

function stripInternalKeyHeader(headers: VercelRequest['headers']): VercelRequest['headers'] {
  const clone = { ...headers };
  delete (clone as Record<string, unknown>)['x-internal-key'];
  delete (clone as Record<string, unknown>)['X-INTERNAL-KEY'];
  return clone;
}

// Param validation only pre-empts the gate for PAID requests (400 before settle, buyer
// unharmed). Bare unpaid probes must still 402 — x402scan/Bazaar validate origins by probing.
function getHeaderStr(h: Record<string, unknown>, k: string): string | undefined {
  const v = h[k];
  return Array.isArray(v) ? v[0] : (v as string | undefined);
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }

  if (!isConfigured()) {
    res.status(503).json({
      error: 'not configured',
      detail: 'PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN are not set on this deployment yet — ask the owner to add them.',
    });
    return;
  }

  const rawKey = req.query.key;
  const key = String(Array.isArray(rawKey) ? rawKey[0] : rawKey ?? '').trim();
  const rawTier = req.query.tier;
  const tier = Number(Array.isArray(rawTier) ? rawTier[0] : rawTier);
  const depositMicro = tierToMicro(tier);
  const paid = Boolean(getHeaderStr(req.headers, 'payment-signature'));

  // Cheap format checks BEFORE the gate — only pre-empt PAID requests (400 before settle, buyer
  // unharmed). Bare unpaid probes must still reach the gate and 402.
  if (paid && !KEY_RE.test(key)) {
    res.status(400).json({
      error: 'invalid or missing key (expected pk_live_..., e.g. key=pk_live_abc123)',
      optional: [],
      examples: [`/api/wholesale/deposit?key=pk_live_...&tier=${DEPOSIT_TIERS_USD[0]}`],
    });
    return;
  }
  if (paid && !depositMicro) {
    res.status(400).json({
      error: `tier must be one of: ${DEPOSIT_TIERS_USD.join(', ')} (USD), e.g. tier=${DEPOSIT_TIERS_USD[0]}`,
      optional: [],
      examples: [`/api/wholesale/deposit?key=pk_live_...&tier=${DEPOSIT_TIERS_USD[0]}`],
    });
    return;
  }

  // Validate the key BEFORE ever issuing a 402 to a PAID request — never let someone pay to top
  // up a dead/typo'd key. Skipped for unpaid probes so bare probes still reach the gate and 402
  // (x402scan/Bazaar validate origins by probing for bare 402s).
  if (paid) {
    let record: { active?: boolean } | null = null;
    try {
      const [recRaw] = await pipe([['GET', `pn:wk:${key}`]]);
      record = recRaw ? (JSON.parse(recRaw as string) as { active?: boolean }) : null;
    } catch {
      res.status(502).json({ error: 'registry temporarily unavailable, try again shortly' });
      return;
    }
    if (!record) { res.status(404).json({ error: 'unknown wholesale key — check it was copied correctly' }); return; }
    if (record.active === false) { res.status(410).json({ error: 'this key has been revoked and can no longer accept deposits' }); return; }
  }

  const safeHeaders = stripInternalKeyHeader(req.headers);
  // Fallback amount only ever advertised to an unpaid/malformed request (real paid requests were
  // already tier-validated above, so depositMicro is always defined by the time a PAID request
  // reaches here) — keeps the 402 body's amount well-formed instead of "null" for bare probes.
  const gateAmount = depositMicro ?? tierToMicro(DEPOSIT_TIERS_USD[0]);
  const gate = await handlePaymentGate(
    safeHeaders,
    req.url ?? '/api/wholesale/deposit',
    String(gateAmount),
    `Top up PulseNetwork wholesale key balance by $${tier}.00 USDC — credits automatically on settlement, usable immediately for wholesale-priced calls via x-internal-key.`,
    ['wholesale', 'reseller', 'deposit', 'top-up', 'prepaid-balance'],
    { queryParams: { key: 'pk_live_...', tier: String(tier) } },
  );
  if (!gate.ok) {
    Object.entries(gate.headers).forEach(([k, v]) => res.setHeader(k, v));
    res.status(gate.status).json(gate.body);
    return;
  }

  // Unreachable in practice (paid requests were param-validated above); narrows the type for TS.
  if (!KEY_RE.test(key)) { res.status(400).json({ error: 'invalid or missing key' }); return; }
  if (!depositMicro) {
    res.status(400).json({ error: `tier must be one of: ${DEPOSIT_TIERS_USD.join(', ')} (USD)` });
    return;
  }

  try {
    const [newBalRaw] = await pipe([['INCRBY', `pn:wk:bal:${key}`, depositMicro]]);
    const newBal = Number(newBalRaw ?? 0);
    res.setHeader('PAYMENT-RESPONSE', gate.settlementHeader);
    res.status(200).json({
      credited_usd: tier,
      new_balance_usd: Number((newBal / 1_000_000).toFixed(6)),
      key_prefix: key.slice(0, 16) + '…',
    });
  } catch {
    // Settlement already succeeded on-chain at this point — the credit failed to record. This is
    // logged loudly (not silently dropped) so a human can manually reconcile; never re-charge.
    console.error(`wholesale/deposit: SETTLED but failed to credit balance for key ${key.slice(0, 16)}… tier=$${tier}`);
    res.status(500).json({
      error: 'payment settled but balance credit failed — this has been logged for manual reconciliation, contact the team with your key prefix and tx',
      key_prefix: key.slice(0, 16) + '…',
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('unhandled_handler_error', { url: req.url, err });
    if (!res.headersSent) {
      res.status(500).json({ error: 'upstream_failed', message: 'This request failed unexpectedly after payment processing began. If you were charged and did not receive a result, this is a bug on our side — please retry or contact support.' });
    }
  }
}

