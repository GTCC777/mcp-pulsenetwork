// POST /api/affiliate/register — self-serve affiliate code issuance. Body:
//   { code: "your-code", wallet: "0x…" (Base address, USDC payouts), contact: "email or telegram" }
// Validates + writes directly into the SAME registry hive/referral.mjs reads (pn:refcodes), using
// the same record shape ({wallet, name, rate, createdAt, paid}) plus source/status/contact so the
// manual leaderboard/payout tooling (hive/referral.mjs) keeps working unmodified on self-serve codes.
import type { VercelRequest, VercelResponse } from '@vercel/node';

const A_URL = process.env.PN_ANALYTICS_URL;
const A_TOKEN = process.env.PN_ANALYTICS_TOKEN;
const DEFAULT_RATE = 0.25; // 25% — mid-point of the validated 25-30% rev-share range
const HUB = 'https://pulse.theaslangroupllc.com';

async function pipe(cmds: (string | number)[][]): Promise<unknown[]> {
  const r = await fetch(`${A_URL}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${A_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  const j = (await r.json()) as { result: unknown }[];
  return j.map((x) => x.result);
}

// Best-effort in-memory per-IP rate limit — 3 signups/hour. Stateless host, so this only holds
// within a warm instance; good enough to blunt casual bot spam without any new infra.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 3;
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

const CODE_RE = /^[a-z0-9-]{3,20}$/;
const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  if (!A_URL || !A_TOKEN) {
    res.status(503).json({
      error: 'not configured',
      detail: 'PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN are not set on this deployment yet — ask the owner to add them.',
    });
    return;
  }

  if (rateLimited(clientIp(req))) {
    res.status(429).json({ error: 'rate limited — max 3 signups/hour per IP, try again later' });
    return;
  }

  let body = req.body as Record<string, unknown> | string | undefined;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = (body as Record<string, unknown>) ?? {};

  // Honeypot: a hidden field real humans never fill. Bots that autofill every input land here.
  // Pretend success (don't tip off the bot) but write nothing.
  const honeypot = String(body.company ?? body.website ?? '').trim();
  if (honeypot) {
    res.status(201).json({ code: String(body.code ?? '').toLowerCase(), note: 'registered' });
    return;
  }

  const code = String(body.code ?? '').trim().toLowerCase();
  const wallet = String(body.wallet ?? '').trim();
  const contact = String(body.contact ?? '').trim().slice(0, 200);

  if (!CODE_RE.test(code)) {
    res.status(400).json({ error: 'code must be 3-20 chars: lowercase letters, numbers, hyphens only' });
    return;
  }
  if (!WALLET_RE.test(wallet)) {
    res.status(400).json({ error: 'wallet must be a Base (EVM) address: 0x followed by 40 hex characters' });
    return;
  }
  if (!contact) {
    res.status(400).json({ error: 'contact (email or telegram handle) is required' });
    return;
  }

  try {
    const rec = {
      wallet,
      name: contact,
      contact,
      rate: DEFAULT_RATE,
      createdAt: Date.now(),
      paid: 0,
      source: 'self-serve',
      status: 'active',
    };
    // HSETNX = atomic "set only if this field doesn't already exist" — avoids a check-then-set
    // race on the registry hash and gives us collision rejection in one round trip.
    const [setOk] = await pipe([['HSETNX', 'pn:refcodes', code, JSON.stringify(rec)]]);
    if (!setOk) { res.status(409).json({ error: 'code already taken, choose another' }); return; }

    res.status(201).json({
      code,
      share_rate: DEFAULT_RATE,
      usage: {
        query_param: `?ref=${code}`,
        header: `x-referral-code: ${code}`,
      },
      stats_url: `${HUB}/api/affiliate/stats?code=${code}`,
      note:
        'Attribution is per paid call — append the query param or header to any PulseNetwork x402 ' +
        'request you route (yours or your users’). Payouts are monthly in USDC on Base; manual ' +
        'review while the program is young.',
    });
  } catch {
    res.status(502).json({ error: 'registry temporarily unavailable, try again shortly' });
  }
}
