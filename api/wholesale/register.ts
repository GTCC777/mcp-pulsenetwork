// POST /api/wholesale/register — self-serve prepaid wholesale key issuance. Body:
//   { contact: "email or telegram", scope?: "csv of vertical/endpoint substrings, default '*'",
//     desired_prefix?: "cosmetic key prefix, [a-z0-9-]{1,20}" }
//
// Mints a pk_live_ key with billing:"prepaid" (deducts wholesale cost from a balance on every call —
// see hive/internal-auth.ts) instead of the old metered-free model. Ships with a $0.25 free-trial
// balance so a builder can test end-to-end before ever depositing real USDC. Grants "*" scope by
// default: because the call is now BILLED against a balance (not simply free), a broad grant is
// bounded by however much the builder has deposited — once it hits zero, calls fail closed back to
// the normal x402 retail gate, so there is no unbounded-access risk the old metered-free "*" refusal
// was guarding against.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pipe, isConfigured, mintKey, TRIAL_BALANCE_MICRO, DEFAULT_RATE, STARTER_PER_MIN, STARTER_PER_DAY } from '../../lib/wholesale.js';

const HUB = 'https://pulse.theaslangroupllc.com';

// Best-effort in-memory per-IP rate limit — 2 signups/hour. Stateless host, so this only holds
// within a warm instance; good enough to blunt casual bot spam without any new infra (same pattern
// as api/affiliate/register.ts, tightened further since this mints a billable credential).
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 2;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  if (HITS.size > 5000) HITS.clear();
  return arr.length > MAX_HITS;
}
function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const s = Array.isArray(fwd) ? fwd[0] : fwd;
  return (s ? s.split(',')[0].trim() : req.socket?.remoteAddress) || 'unknown';
}

const PREFIX_RE = /^[a-z0-9-]{1,20}$/;
const SCOPE_ITEM_RE = /^[a-z0-9*/_.-]{1,80}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  if (!isConfigured()) {
    res.status(503).json({
      error: 'not configured',
      detail: 'PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN are not set on this deployment yet — ask the owner to add them.',
    });
    return;
  }

  if (rateLimited(clientIp(req))) {
    res.status(429).json({ error: 'rate limited — max 2 wholesale key requests/hour per IP, try again later' });
    return;
  }

  let body = req.body as Record<string, unknown> | string | undefined;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = (body as Record<string, unknown>) ?? {};

  // Honeypot: a hidden field real humans never fill. Bots that autofill every input land here —
  // pretend success (don't tip off the bot) but mint nothing.
  const honeypot = String(body.company ?? body.website ?? '').trim();
  if (honeypot) {
    res.status(201).json({ note: 'registered' });
    return;
  }

  const contact = String(body.contact ?? '').trim().slice(0, 200);
  if (!contact) {
    res.status(400).json({ error: 'contact (email or telegram handle) is required' });
    return;
  }

  const desiredPrefix = String(body.desired_prefix ?? '').trim().toLowerCase();
  if (desiredPrefix && !PREFIX_RE.test(desiredPrefix)) {
    res.status(400).json({ error: 'desired_prefix must be 1-20 chars: lowercase letters, numbers, hyphens only' });
    return;
  }

  const scopeRaw = String(body.scope ?? '*').trim();
  const scopes = scopeRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!scopes.length) scopes.push('*');
  for (const s of scopes) {
    if (!SCOPE_ITEM_RE.test(s)) {
      res.status(400).json({ error: `invalid scope entry "${s}" — use vertical names, endpoint paths, or "*"` });
      return;
    }
  }

  try {
    const key = mintKey(desiredPrefix || undefined);
    const record = {
      builder: contact,
      scopes,
      active: true,
      billing: 'prepaid' as const,
      rate: DEFAULT_RATE,
      rlPerMin: STARTER_PER_MIN,
      rlPerDay: STARTER_PER_DAY,
      note: 'self-serve wholesale key',
      created: new Date().toISOString(),
      source: 'self-serve',
      contact,
    };
    await pipe([
      ['SET', `pn:wk:${key}`, JSON.stringify(record)],
      ['SADD', 'pn:wk:index', key],
      ['SET', `pn:wk:bal:${key}`, TRIAL_BALANCE_MICRO],
    ]);

    // Never log the full key — only its prefix, for support/debug correlation.
    console.log(`wholesale/register: minted ${key.slice(0, 16)}… for contact=${contact.slice(0, 40)}`);

    res.status(201).json({
      key,
      note:
        'Save this key now — it is shown once and never logged or retrievable again. If you lose it, ' +
        'register a new one (the old balance/scope stays under the lost key).',
      billing: 'prepaid',
      rate: DEFAULT_RATE,
      scope: scopes,
      trial_balance_usd: TRIAL_BALANCE_MICRO / 1_000_000,
      limits: { per_min: STARTER_PER_MIN, per_day: STARTER_PER_DAY },
      usage: {
        header: 'x-internal-key: ' + key,
        example: `curl -H "x-internal-key: ${key}" "https://onchainpulse.theaslangroupllc.com/api/evmtoken?address=0x…&chain=base"`,
        billing_note:
          'Each call deducts ceil(retail_price * 0.5) from your balance (floored at $0.005/call). ' +
          'When the balance hits zero, calls stop being wholesale-priced and fall through to the ' +
          'normal x402 retail payment gate — no surprise overdraft.',
      },
      deposit: {
        url: `${HUB}/api/wholesale/deposit?key=${key}&tier=5`,
        tiers_usd: [5, 25, 100],
        note: 'A GET request to the deposit URL returns a 402 for the chosen tier; pay it in USDC (Base or Solana) and your balance credits automatically on settlement.',
      },
      stats_url: `${HUB}/api/wholesale/stats?key=${key}`,
    });
  } catch {
    res.status(502).json({ error: 'registry temporarily unavailable, try again shortly' });
  }
}
