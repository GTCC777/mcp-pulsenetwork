// lib/internal-auth.ts — PulseNetwork internal / wholesale authorization (canonical; distributed
// fleet-wide by hive/wire-wholesale.mjs). Three ways a request can skip the x402 payment gate:
//
//   1. MASTER key — the first-party all-access secret PULSE_INTERNAL_KEY. Used server→server by
//      our own surfaces (Bankr proxy, PulseAgent, ACP seller). Matched with a constant-time-ish
//      string compare, NO network call — must stay zero-latency for high-volume internal traffic.
//      NEVER hand this key to an outside builder: it unlocks every endpoint of every vertical.
//
//   2. SCOPED metered-free wholesale key — a per-builder, revocable, rate-limited, scope-limited
//      key we mint for resellers (hive/wholesale-key.mjs). Stored in Upstash under `pn:wk:<key>`.
//      Free per call (metered as an abuse ceiling only) — the legacy/manual-mint model.
//
//   3. SCOPED PREPAID wholesale key — same record shape plus `billing: "prepaid"`, `rate` (a
//      multiplier on the endpoint's retail price) and a balance tracked in a DEDICATED integer key
//      `pn:wk:bal:<key>` (never embedded in the JSON record — a hot-mutated counter must live on
//      its own key so it can be deducted with a single atomic DECRBY, never a read-modify-write).
//      Self-serve keys minted by api/wholesale/register.ts are prepaid by default. Each authorized
//      call deducts ceil(retailAmountMicro * rate) micro-USD (floored at $0.005) from the balance;
//      insufficient balance fails closed (the compensating INCRBY puts the attempted deduction back
//      so the balance is never left in a phantom negative state) and the caller falls through to
//      the normal x402 retail payment gate.
//
// Security posture: FAIL CLOSED. Any error/timeout/missing-record/inactive/scope-miss/over-limit/
// insufficient-balance denies the bypass, and the caller simply falls through to the normal x402
// payment path (a 402, never a crash). The master path never touches the network, so first-party
// traffic is unaffected even if Upstash is down.
import type { IncomingHttpHeaders } from 'http';

// Read at call time (not module load) so a process that provisions these env vars lazily — and
// tests that toggle them — both see the current value, not whatever was present at import time.
function analyticsCreds(): { url?: string; token?: string } {
  return { url: process.env.PN_ANALYTICS_URL, token: process.env.PN_ANALYTICS_TOKEN };
}

// The all-access master secret. Fleet-standard name is PULSE_INTERNAL_KEY; signalpulse historically
// set SIGNALPULSE_SERVICE_KEY, so accept either (whichever a repo has configured) to avoid breaking
// existing first-party callers. Never hand any of these to an external builder.
function masterKeys(): string[] {
  return [process.env.PULSE_INTERNAL_KEY, process.env.SIGNALPULSE_SERVICE_KEY].filter(
    (v): v is string => !!v,
  );
}

// Default meter caps when a key record omits them. Sized to keep genuine reselling comfortable
// while making bulk output-scraping (distillation of a single endpoint) uneconomic + visible.
const DEFAULT_PER_MIN = 300;
const DEFAULT_PER_DAY = 20000;

// Prepaid billing constants.
const WHOLESALE_FLOOR_MICRO = 5000; // $0.005 minimum charge per call, even on very cheap endpoints
const REDIS_TIMEOUT_MS = 800;

export type InternalAuth = {
  ok: boolean;
  kind: 'master' | 'scoped' | 'none';
  builder?: string;
  /** Present only for prepaid keys: the billing mode that was applied. */
  billing?: 'prepaid';
  /** Present only on a successful prepaid deduction: micro-USD actually charged. */
  charged_micro?: number;
  /** Present only on a successful prepaid deduction: resulting balance, micro-USD. */
  balance_micro?: number;
};

function keyHeader(h: IncomingHttpHeaders): string {
  const raw = h['x-internal-key'] ?? h['X-INTERNAL-KEY'];
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v ? String(v) : '';
}

/** Legacy sync master-only check. Retained for backward compat with any caller not yet upgraded to
 *  authorizeInternal(). Only ever matches the all-access PULSE_INTERNAL_KEY. */
export function isInternalRequest(headers: IncomingHttpHeaders): boolean {
  const got = keyHeader(headers);
  return !!got && masterKeys().includes(got);
}

function resourceKey(headers: IncomingHttpHeaders, rawUrl: string): string {
  const hdr = (n: string) => {
    const v = headers[n];
    return (Array.isArray(v) ? v[0] : v) ?? '';
  };
  const host = (hdr('x-forwarded-host') || hdr('host') || '').toLowerCase();
  const path = (rawUrl || '').split('?')[0];
  return `${host}${path}`; // e.g. "onchainpulse.theaslangroupllc.com/api/evmtoken"
}

/** A scope authorizes the call when it is "*" (all) or a substring of the resource key. The mint
 *  script controls granularity: "onchainpulse" (whole vertical) or "/api/evmtoken" (one endpoint). */
function scopeAllows(scopes: unknown, rkey: string): boolean {
  if (!Array.isArray(scopes)) return false;
  return scopes.some((s) => s === '*' || (typeof s === 'string' && s.length > 0 && rkey.includes(s)));
}

/** POST a single-pipeline Upstash REST command set with a short timeout. Returns the raw `result`
 *  array, or null on any network/HTTP error (caller must treat null as fail-closed). */
async function upstashPipeline(cmds: Array<Array<string | number>>): Promise<Array<{ result: unknown }> | null> {
  const { url, token } = analyticsCreds();
  if (!url || !token) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REDIS_TIMEOUT_MS);
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(cmds),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as Array<{ result: unknown }>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Atomically deduct a prepaid key's balance. Never reads-then-writes the balance: DECRBY is a
 *  single atomic Redis op on its own dedicated integer key. If the result goes negative, the
 *  deduction is reversed with a compensating INCRBY (so the stored balance always reflects only
 *  successfully-authorized calls) and the function reports insufficient funds. Fails closed on
 *  any Upstash error (treats it as insufficient balance — never lets a call through un-metered). */
async function deductBalance(key: string, costMicro: number): Promise<{ ok: true; balance: number } | { ok: false }> {
  const balKey = `pn:wk:bal:${key}`;
  const dec = await upstashPipeline([['DECRBY', balKey, costMicro]]);
  const newBal = Number(dec?.[0]?.result);
  if (dec === null || !Number.isFinite(newBal)) return { ok: false };
  if (newBal < 0) {
    // Compensate — best-effort; even if this fails, the balance only reads too-low (fail-closed
    // direction), never too-high, so no double-spend is possible.
    await upstashPipeline([['INCRBY', balKey, costMicro]]).catch(() => null);
    return { ok: false };
  }
  return { ok: true, balance: newBal };
}

/** Authorize an internal/wholesale request. Master key → instant allow (no network). Otherwise, if a
 *  key is present, look it up in Upstash and validate active + scope + rate limits. Prepaid keys
 *  additionally deduct wholesale cost from a dedicated balance counter. Fail closed throughout.
 *
 *  @param retailAmountMicro The retail x402 `amount` for this call, in micro-USD (i.e. `Number(amount)`
 *    from lib/x402.ts's handlePaymentGate). Optional/backward-compatible: metered-free keys and the
 *    master path ignore it entirely. Required only to authorize a PREPAID key — if a prepaid key is
 *    matched but no retail amount was supplied, the call fails closed (can't bill an unknown cost). */
export async function authorizeInternal(
  headers: IncomingHttpHeaders,
  rawUrl: string,
  retailAmountMicro?: number,
): Promise<InternalAuth> {
  const got = keyHeader(headers);
  if (!got) return { ok: false, kind: 'none' };

  // Master fast-path — no network, no metering.
  if (masterKeys().includes(got)) return { ok: true, kind: 'master' };

  // Scoped key path — requires the shared Upstash. If unconfigured, deny (fall through to x402).
  const { url: A_URL, token: A_TOKEN } = analyticsCreds();
  if (!A_URL || !A_TOKEN) return { ok: false, kind: 'none' };

  try {
    const now = Date.now();
    const minBucket = Math.floor(now / 60000);
    const dayBucket = Math.floor(now / 86400000);
    const recKey = `pn:wk:${got}`;
    const minKey = `pn:wk:m:${got}:${minBucket}`;
    const dayKey = `pn:wk:d:${got}:${dayBucket}`;
    // One round trip: read the record and bump both meters. Over-counting a denied call is fine —
    // meters only throttle, and a rejected request having consumed a token is the conservative side.
    const pipeline: Array<Array<string | number>> = [
      ['GET', recKey],
      ['INCR', minKey],
      ['EXPIRE', minKey, '120'],
      ['INCR', dayKey],
      ['EXPIRE', dayKey, '172800'],
    ];
    const results = await upstashPipeline(pipeline);
    if (results === null) return { ok: false, kind: 'none' };

    const rawRec = results?.[0]?.result;
    if (!rawRec || typeof rawRec !== 'string') return { ok: false, kind: 'none' }; // unknown/revoked
    const rec = JSON.parse(rawRec) as {
      active?: boolean; scopes?: unknown; rlPerMin?: number; rlPerDay?: number; builder?: string;
      billing?: string; rate?: number;
    };
    if (rec.active === false) return { ok: false, kind: 'none' };

    const rkey = resourceKey(headers, rawUrl);
    if (!scopeAllows(rec.scopes, rkey)) return { ok: false, kind: 'none' };

    const perMin = Number(results?.[1]?.result ?? 0);
    const perDay = Number(results?.[3]?.result ?? 0);
    if (perMin > (rec.rlPerMin ?? DEFAULT_PER_MIN)) return { ok: false, kind: 'none' };
    if (perDay > (rec.rlPerDay ?? DEFAULT_PER_DAY)) return { ok: false, kind: 'none' };

    // Metered-free (legacy/manual) key: allow, no billing.
    if (rec.billing !== 'prepaid') {
      return { ok: true, kind: 'scoped', builder: rec.builder };
    }

    // Prepaid key: must have a retail amount to bill against. Missing/invalid amount fails closed
    // rather than guessing a cost.
    if (!retailAmountMicro || !Number.isFinite(retailAmountMicro) || retailAmountMicro <= 0) {
      return { ok: false, kind: 'none' };
    }
    const rate = typeof rec.rate === 'number' && rec.rate > 0 ? rec.rate : 1;
    const cost = Math.max(WHOLESALE_FLOOR_MICRO, Math.ceil(retailAmountMicro * rate));

    const deduction = await deductBalance(got, cost);
    if (!deduction.ok) return { ok: false, kind: 'none' };

    return {
      ok: true,
      kind: 'scoped',
      builder: rec.builder,
      billing: 'prepaid',
      charged_micro: cost,
      balance_micro: deduction.balance,
    };
  } catch {
    return { ok: false, kind: 'none' }; // fail closed
  }
}
