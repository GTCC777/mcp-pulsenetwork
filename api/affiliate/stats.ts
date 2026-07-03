// GET /api/affiliate/stats?code=X — public, read-only stats for a referral code. No auth: codes
// are not secrets (they ride in a public ?ref= query param / x-referral-code header on every
// referred call), so anyone who has a code can already see it took a sale. Reuses the exact key
// shapes hive/referral.mjs reads/writes: pn:refcodes (registry hash), pn:ref:rev / pn:ref:count
// (HINCRBYFLOAT/HINCRBY per code), pn:ref:buyers:<code> (HLL, PFCOUNT for distinct buyers).
import type { VercelRequest, VercelResponse } from '@vercel/node';

const A_URL = process.env.PN_ANALYTICS_URL;
const A_TOKEN = process.env.PN_ANALYTICS_TOKEN;

async function pipe(cmds: (string | number)[][]): Promise<unknown[]> {
  const r = await fetch(`${A_URL}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${A_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  const j = (await r.json()) as { result: unknown }[];
  return j.map((x) => x.result);
}

// Best-effort in-memory per-IP rate limit. This host is stateless (serverless) so this only holds
// within a warm instance — acceptable for a light public read; not a security boundary.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 30;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  if (HITS.size > 5000) HITS.clear(); // crude guard against unbounded growth across many IPs
  return arr.length > MAX_HITS;
}
function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const s = Array.isArray(fwd) ? fwd[0] : fwd;
  return (s ? s.split(',')[0].trim() : req.socket?.remoteAddress) || 'unknown';
}

const CODE_RE = /^[a-z0-9-]{3,20}$/;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }

  if (!A_URL || !A_TOKEN) {
    res.status(503).json({
      error: 'not configured',
      detail: 'PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN are not set on this deployment yet — ask the owner to add them.',
    });
    return;
  }

  if (rateLimited(clientIp(req))) { res.status(429).json({ error: 'rate limited, try again shortly' }); return; }

  const raw = req.query.code;
  const code = String(Array.isArray(raw) ? raw[0] : raw ?? '').trim().toLowerCase();
  if (!CODE_RE.test(code)) { res.status(400).json({ error: 'invalid code format (expected [a-z0-9-]{3,20})' }); return; }

  try {
    const [recRaw, revRaw, countRaw, buyersRaw] = await pipe([
      ['HGET', 'pn:refcodes', code],
      ['HGET', 'pn:ref:rev', code],
      ['HGET', 'pn:ref:count', code],
      ['PFCOUNT', `pn:ref:buyers:${code}`],
    ]);

    if (!recRaw) { res.status(404).json({ error: 'unknown code' }); return; }

    const rec = JSON.parse(recRaw as string) as { rate?: number; paid?: number; status?: string; createdAt?: number };
    const rev = Number(revRaw ?? 0);
    const rate = Number(rec.rate ?? 0.25);
    const earned = rev * rate;
    const paid = Number(rec.paid ?? 0);

    res.setHeader('cache-control', 's-maxage=30, stale-while-revalidate=120');
    res.status(200).json({
      code,
      total_rev_usd: Number(rev.toFixed(4)),
      calls: Number(countRaw ?? 0),
      distinct_buyers: Number(buyersRaw ?? 0),
      share_rate: rate,
      est_earnings_usd: Number(earned.toFixed(4)),
      paid_usd: Number(paid.toFixed(4)),
      owed_usd: Number((earned - paid).toFixed(4)),
      status: rec.status ?? 'active',
    });
  } catch {
    res.status(502).json({ error: 'stats temporarily unavailable, try again shortly' });
  }
}
