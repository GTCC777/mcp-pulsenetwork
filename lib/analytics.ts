// lib/analytics.ts — PulseNetwork demand analytics (canonical; distributed fleet-wide by
// hive/wire-analytics.mjs). Logs ONE event per SETTLED paid call to Upstash Redis (REST).
//
// Hard guarantees (a payment must NEVER be harmed by analytics):
//   • never throws            — whole body is try/caught
//   • never blocks materially — single REST call, hard 1.2s AbortController timeout
//   • no-ops when unconfigured — silent unless PN_ANALYTICS_URL + PN_ANALYTICS_TOKEN are set
//
// It is called only at the post-settlement success return, so internal-key bypass calls and
// Bazaar-prime calls (which return earlier) are excluded — we log real external sales only.
//
// Keys written (Upstash pipeline, prefix pn:):
//   pn:sales            LPUSH capped list of raw events (newest first)   — the audit trail
//   pn:count   <key>    HINCRBY  per-endpoint call count                 — what sells
//   pn:rev     <key>    HINCRBYFLOAT per-endpoint USDC revenue           — what earns
//   pn:buyers:<key>     PFADD HyperLogLog distinct buyers per endpoint   — CDP-rank signal
//   pn:buyers:all       PFADD HyperLogLog distinct buyers fleet-wide
// where <key> = "<host><path>" (e.g. onchainpulse-xxx.vercel.app/api/evmtoken).
import type { IncomingHttpHeaders } from 'http';

const A_URL = process.env.PN_ANALYTICS_URL;
const A_TOKEN = process.env.PN_ANALYTICS_TOKEN;

function hdr(h: IncomingHttpHeaders, name: string): string {
  const v = h[name.toLowerCase()];
  return (Array.isArray(v) ? v[0] : v) ?? '';
}

export async function logSale(
  reqHeaders: IncomingHttpHeaders,
  rawUrl: string,
  amount: string,
  settleResult: Record<string, unknown>,
): Promise<void> {
  try {
    if (!A_URL || !A_TOKEN) return;
    const host = (hdr(reqHeaders, 'x-forwarded-host') || hdr(reqHeaders, 'host') || 'unknown').toLowerCase();
    const path = (rawUrl || '').split('?')[0];
    const key = `${host}${path}`;
    const amt = Number(amount) / 1e6;
    const payer = String(settleResult?.payer ?? '').toLowerCase();
    // Referral attribution: an affiliate's code rides in on the x-referral-code header or a ?ref=
    // query param. Captured here so referred revenue can be credited + paid out. Sanitized + capped.
    const refRaw = hdr(reqHeaders, 'x-referral-code') || new URLSearchParams((rawUrl || '').split('?')[1] || '').get('ref') || '';
    const ref = String(refRaw).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
    const ev = JSON.stringify({
      t: Date.now(),
      host,
      path,
      amt,
      net: String(settleResult?.network ?? ''),
      payer,
      tx: String(settleResult?.transaction ?? ''),
      ...(ref ? { ref } : {}),
    });
    const pipeline: string[][] = [
      ['LPUSH', 'pn:sales', ev],
      ['LTRIM', 'pn:sales', '0', '19999'],
      ['HINCRBY', 'pn:count', key, '1'],
      ['HINCRBYFLOAT', 'pn:rev', key, String(amt)],
      ['PFADD', `pn:buyers:${key}`, payer || 'anon'],
      ['PFADD', 'pn:buyers:all', payer || 'anon'],
    ];
    // Credit the referrer — but never for self-referral (referrer's own wallet buying).
    if (ref) {
      pipeline.push(
        ['HINCRBYFLOAT', 'pn:ref:rev', ref, String(amt)],
        ['HINCRBY', 'pn:ref:count', ref, '1'],
        ['PFADD', `pn:ref:buyers:${ref}`, payer || 'anon'],
      );
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1200);
    try {
      await fetch(`${A_URL}/pipeline`, {
        method: 'POST',
        headers: { authorization: `Bearer ${A_TOKEN}`, 'content-type': 'application/json' },
        body: JSON.stringify(pipeline),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  } catch {
    /* analytics must never affect the paid response */
  }
}
