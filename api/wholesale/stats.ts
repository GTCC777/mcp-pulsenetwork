// GET /api/wholesale/stats?key=pk_live_... — holder-only lookup for a wholesale key's status and
// balance. Auth model: possession of the FULL key is the secret (same trust model as the key
// itself — whoever holds it can already spend the balance via x-internal-key, so reading its
// balance is not a bigger privilege). Never accept a partial/prefix key.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pipe, isConfigured, KEY_RE } from '../../lib/wholesale.js';

// Best-effort in-memory per-IP rate limit (same pattern as api/affiliate/stats.ts).
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 30;
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

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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

  if (rateLimited(clientIp(req))) { res.status(429).json({ error: 'rate limited, try again shortly' }); return; }

  const raw = req.query.key;
  const key = String(Array.isArray(raw) ? raw[0] : raw ?? '').trim();
  if (!KEY_RE.test(key)) { res.status(400).json({ error: 'invalid or missing key' }); return; }

  try {
    const dayBucket = Math.floor(Date.now() / 86400000);
    const [recRaw, balRaw, dayCountRaw] = await pipe([
      ['GET', `pn:wk:${key}`],
      ['GET', `pn:wk:bal:${key}`],
      ['GET', `pn:wk:d:${key}:${dayBucket}`],
    ]);

    if (!recRaw) { res.status(404).json({ error: 'unknown key' }); return; }

    const rec = JSON.parse(recRaw as string) as {
      active?: boolean; scopes?: unknown; rate?: number; billing?: string; builder?: string;
      rlPerMin?: number; rlPerDay?: number; created?: string;
    };

    res.setHeader('cache-control', 'no-store'); // balance is sensitive-ish + changes per call
    res.status(200).json({
      active: rec.active !== false,
      billing: rec.billing ?? 'metered-free',
      scope: rec.scopes ?? [],
      rate: rec.rate ?? null,
      balance_usd: Number((Number(balRaw ?? 0) / 1_000_000).toFixed(6)),
      calls_today: Number(dayCountRaw ?? 0),
      limits: { per_min: rec.rlPerMin ?? null, per_day: rec.rlPerDay ?? null },
      created: rec.created ?? null,
      deposit_url_hint: '/api/wholesale/deposit?key=<your key>&tier=5|25|100',
    });
  } catch {
    res.status(502).json({ error: 'stats temporarily unavailable, try again shortly' });
  }
}
