// GET /api/go-stats?merchant=vrbo — public, read-only click count for a /go merchant slug. No
// auth: counts aren't sensitive (same rationale as api/affiliate/stats.ts for referral codes) —
// this just makes the write-only pn:go:count:<merchant> counter (api/go.ts) actually inspectable,
// so click analytics are a real, checkable win rather than data going in and never coming out.
import type { VercelRequest, VercelResponse } from '@vercel/node';

const A_URL = process.env.PN_ANALYTICS_URL;
const A_TOKEN = process.env.PN_ANALYTICS_TOKEN;
const MERCHANT_RE = /^[a-z0-9-]{2,40}$/;

async function pipe(cmds: (string | number)[][]): Promise<unknown[]> {
  const r = await fetch(`${A_URL}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${A_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  const j = (await r.json()) as { result: unknown }[];
  return j.map((x) => x.result);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }

  if (!A_URL || !A_TOKEN) {
    res.status(503).json({
      error: 'not configured',
      detail: 'PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN are not set on this deployment yet.',
    });
    return;
  }

  const raw = req.query.merchant;
  const merchant = String(Array.isArray(raw) ? raw[0] : raw ?? '').trim().toLowerCase();
  if (!MERCHANT_RE.test(merchant)) {
    res.status(400).json({ error: 'invalid merchant format (expected [a-z0-9-]{2,40})' });
    return;
  }

  try {
    const [countRaw] = await pipe([['GET', `pn:go:count:${merchant}`]]);
    res.setHeader('cache-control', 's-maxage=10, stale-while-revalidate=30');
    res.status(200).json({ merchant, clicks: Number(countRaw ?? 0) });
  } catch {
    res.status(502).json({ error: 'stats temporarily unavailable, try again shortly' });
  }
}
