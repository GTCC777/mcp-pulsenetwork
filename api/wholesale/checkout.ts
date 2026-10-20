// GET /api/wholesale/checkout?key=pk_live_...&tier=5|25|100 — card-funded top-up for a prepaid
// wholesale key: the no-crypto onramp (Field Guide "Operator" rung). Creates a Stripe Checkout
// Session for the chosen tier and 303-redirects the buyer to Stripe's hosted payment page; on
// success Stripe sends them to /api/wholesale/checkout-complete which verifies the session
// server-side against Stripe's API and credits the balance (same INCRBY as the USDC deposit path).
//
// Same safety rule as deposit.ts: the key is validated (exists + active) BEFORE any payment UI is
// shown — nobody can be handed a checkout link that pays into a dead or typo'd key. No x402 gate
// here: this endpoint is free to call; the payment happens on Stripe's page.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pipe, isConfigured, KEY_RE, tierToMicro, DEPOSIT_TIERS_USD } from '../../lib/wholesale.js';

const HUB = 'https://pulse.theaslangroupllc.com';

function q(req: VercelRequest, name: string): string {
  const v = req.query[name];
  return String(Array.isArray(v) ? v[0] : v ?? '').trim();
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }

  const stripeKey = process.env.STRIPE_RESTRICTED_KEY;
  if (!stripeKey) {
    res.status(503).json({
      error: 'card checkout not configured on this deployment yet',
      alternative: `USDC deposit works now: GET ${HUB}/api/wholesale/deposit?key=pk_live_...&tier=${DEPOSIT_TIERS_USD[0]} (x402, Base or Solana)`,
    });
    return;
  }
  if (!isConfigured()) {
    res.status(503).json({ error: 'not configured', detail: 'PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN missing on this deployment.' });
    return;
  }

  const key = q(req, 'key');
  const tier = Number(q(req, 'tier'));
  if (!KEY_RE.test(key)) {
    res.status(400).json({ error: 'invalid or missing key (expected key=pk_live_...)', examples: [`/api/wholesale/checkout?key=pk_live_...&tier=${DEPOSIT_TIERS_USD[0]}`] });
    return;
  }
  if (!tierToMicro(tier)) {
    res.status(400).json({ error: `tier must be one of: ${DEPOSIT_TIERS_USD.join(', ')} (USD)`, examples: [`/api/wholesale/checkout?key=${key.slice(0, 16)}…&tier=${DEPOSIT_TIERS_USD[0]}`] });
    return;
  }

  // Key must exist and be active before we show anyone a payment page.
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

  // Create the Checkout Session (raw REST — no SDK dependency; Stripe's API is form-encoded).
  const form = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(tier * 100),
    'line_items[0][price_data][product_data][name]': `PulseNetwork API credit — $${tier} pack`,
    'line_items[0][price_data][product_data][description]': `Prepaid usage credit for API key ${key.slice(0, 26)}… (wholesale-priced pay-per-call; no subscription)`,
    'metadata[wholesale_key]': key,
    'metadata[tier_usd]': String(tier),
    success_url: `${HUB}/api/wholesale/checkout-complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${HUB}/wholesale`,
  });
  const sr = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${stripeKey}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const session = (await sr.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!sr.ok || !session.url) {
    console.error('wholesale/checkout: stripe session create failed', { status: sr.status, err: session.error?.message });
    res.status(502).json({ error: 'could not create card checkout session — try again or use the USDC deposit path', detail: session.error?.message?.slice(0, 140) });
    return;
  }

  if (q(req, 'format') === 'json') {
    res.status(200).json({ checkout_url: session.url, session_id: session.id, tier_usd: tier, key_prefix: key.slice(0, 16) + '…' });
    return;
  }
  res.setHeader('Location', session.url);
  res.status(303).end();
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('unhandled_handler_error', { url: req.url, err });
    if (!res.headersSent) res.status(500).json({ error: 'upstream_failed' });
  }
}
