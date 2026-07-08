// GET /go/:merchant?<params> — branded affiliate redirect. Rewritten here by vercel.json
// ("/go/:merchant" -> "/api/go?merchant=:merchant", original query params ride along automatically).
//
// Behavior:
//   • known merchant  -> 302 to the affiliate-tagged destination URL (lib/go-registry.ts)
//   • unknown merchant -> 302 to the hub homepage + a loud console.warn (never a dead end)
//   • ANY error        -> falls through to the hub homepage; this route must never 500
//
// Click analytics (loud-failure doctrine: log store failures loudly, never let them break the
// redirect) go to the same Upstash Redis REST instance the rest of the hub already uses
// (PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN — see lib/analytics.ts). Keys:
//   pn:go:count:<merchant>  INCR                      — per-merchant click count
//   pn:go:clicks            LPUSH capped event list   — merchant/params/referer/ts audit trail
//
// Every redirect carries X-Affiliate-Disclosure so browsers/tooling/auditors can find our
// disclosure page without digging — the merchant slug itself already makes the destination
// transparent (no URL-shortener-style obfuscation), this header just makes the policy explicit.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GO_REGISTRY, HUB_HOME } from '../lib/go-registry.js';

const A_URL = process.env.PN_ANALYTICS_URL;
const A_TOKEN = process.env.PN_ANALYTICS_TOKEN;
const DISCLOSURE_URL = 'https://pulse.theaslangroupllc.com/affiliate-disclosure';
const CLICK_LOG_TIMEOUT_MS = 1200;
const MAX_CLICK_LOG_LEN = 4999;

function hdr(req: VercelRequest, name: string): string {
  const v = req.headers[name.toLowerCase()];
  return (Array.isArray(v) ? v[0] : v) ?? '';
}

function firstOrEmpty(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? '';
}

// Bounded, best-effort. Awaited (with a hard timeout) rather than truly detached, matching the
// fleet-wide logSale() pattern in lib/analytics.ts — serverless functions can be frozen/recycled
// the instant the response is sent, so a genuinely un-awaited fetch risks never completing.
// Any failure here is swallowed (fail-open) but logged LOUDLY per the loud-failure doctrine —
// a silently-dead click logger is exactly the kind of months-long invisible outage we've hit before.
async function logClick(merchant: string, params: Record<string, string>, referer: string): Promise<void> {
  if (!A_URL || !A_TOKEN) return; // unconfigured — silent no-op, same convention as lib/analytics.ts
  try {
    const ev = JSON.stringify({ merchant, params, referer, ts: Date.now() });
    const pipeline: string[][] = [
      ['INCR', `pn:go:count:${merchant}`],
      ['LPUSH', 'pn:go:clicks', ev],
      ['LTRIM', 'pn:go:clicks', '0', String(MAX_CLICK_LOG_LEN)],
    ];
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CLICK_LOG_TIMEOUT_MS);
    try {
      const r = await fetch(`${A_URL}/pipeline`, {
        method: 'POST',
        headers: { authorization: `Bearer ${A_TOKEN}`, 'content-type': 'application/json' },
        body: JSON.stringify(pipeline),
        signal: ctrl.signal,
      });
      if (!r.ok) {
        console.error(`[go] click-log store returned HTTP ${r.status} for merchant "${merchant}"`);
      }
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    console.error(`[go] click-log store failed for merchant "${merchant}":`, err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('X-Affiliate-Disclosure', DISCLOSURE_URL);

  let destination = HUB_HOME;
  let merchant = '';
  let params: Record<string, string> = {};

  try {
    merchant = firstOrEmpty(req.query.merchant as string | string[] | undefined).toLowerCase().trim();

    for (const [k, v] of Object.entries(req.query)) {
      if (k === 'merchant') continue;
      params[k] = firstOrEmpty(v as string | string[] | undefined);
    }

    const entry = merchant ? GO_REGISTRY[merchant] : undefined;
    if (!entry) {
      console.warn(`[go] unknown merchant "${merchant}" — redirecting to hub homepage`);
    } else {
      try {
        destination = entry.build(params) || HUB_HOME;
      } catch (err) {
        console.error(`[go] builder for merchant "${merchant}" threw — falling back to hub homepage:`, err);
        destination = HUB_HOME;
      }
    }
  } catch (err) {
    // Belt-and-suspenders: this route must never 500, no matter what's wrong with the request.
    console.error('[go] handler error — falling back to hub homepage:', err);
    destination = HUB_HOME;
  }

  try {
    await logClick(merchant || 'unknown', params, hdr(req, 'referer'));
  } catch {
    /* logClick already catches internally; this is just an extra guard so a click is never lost to a 500 */
  }

  res.writeHead(302, { Location: destination });
  res.end();
}
