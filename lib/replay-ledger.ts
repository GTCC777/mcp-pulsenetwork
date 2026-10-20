// replay-ledger.ts — settled-payment replay window for the x402 gate.
//
// Problem (verified live 2026-08-17): a buyer whose payment settles but who never receives
// the response (timeout, connection drop) retries the identical request with the identical
// PAYMENT-SIGNATURE header. The facilitator rejects the re-settle (EIP-3009 nonce already
// used) and the gate returns 402 — the buyer paid and got nothing. Hardened agent buyers
// (AWS AgentCore / OpenAI cookbook pattern) retry with a stable idempotency key and audit
// receipts, so this reads as a paid error on our side.
//
// Fix: after each successful settle, record the exact signed payment (hashed) → the request
// it paid for. When verify/settle later fails for a payment found in this ledger AND bound to
// the same URL, treat the request as already-paid instead of 402: the buyer gets the data
// (usually straight from paid-cache) on retry.
//
// Safety properties:
// - Only payments that actually settled are recorded — recording happens strictly after a
//   successful settle result.
// - Key = sha256 of the raw PAYMENT-SIGNATURE header value: covers nonce, signature, and the
//   accepted requirement. A different payer, amount, or nonce is a different key.
// - The entry binds to the URL (path + sorted params) it paid for. The same payment cannot be
//   replayed against any other resource.
// - Short TTL (REPLAY_TTL_S, default 600s): transport-retry windows are seconds to minutes.
//   0 disables the ledger entirely.
// - Best-effort storage (Vercel Runtime Cache when available, warm-instance memory otherwise):
//   a ledger miss degrades to today's behavior (402 on retry), never worse.
import { createHash } from 'crypto';

// NaN-proof: a config typo (REPLAY_TTL_S=garbage) must fall back to the default, not
// produce a NaN that slips past `=== 0` guards and hands the backend an undefined TTL.
const _ttlRaw = Number(process.env.REPLAY_TTL_S ?? 600);
const TTL_S = Number.isFinite(_ttlRaw) ? Math.max(0, _ttlRaw) : 600;

type RuntimeCache = {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, opts?: { ttl?: number; name?: string }): Promise<void>;
};
let _cachePromise: Promise<RuntimeCache | null> | undefined;
function runtimeCache(): Promise<RuntimeCache | null> {
  if (_cachePromise === undefined) {
    const spec = '@vercel/functions'; // variable specifier: keeps local tsc from resolving types
    _cachePromise = import(spec)
      .then((m: { getCache?: (o?: { namespace?: string }) => RuntimeCache }) =>
        m.getCache ? m.getCache({ namespace: 'x402replay' }) : null)
      .catch(() => null);
  }
  return _cachePromise;
}

const mem = new Map<string, { v: ReplayEntry; exp: number }>();
function memPrune(): void {
  if (mem.size < 500) return;
  const now = Date.now();
  for (const [k, e] of mem) if (e.exp <= now) mem.delete(k);
  while (mem.size > 400) { const k = mem.keys().next().value; if (k === undefined) break; mem.delete(k); }
}

export type ReplayEntry = {
  urlKey: string;
  // The PAYMENT-RESPONSE header from the original settle, replayed verbatim so the buyer's
  // receipt check sees the same settlement proof on the retry as on the original.
  settlementHeader: string;
  ts: number;
  // Set once the replay has been served via the full-handler (recompute) path. A consumed
  // entry can still be served from paid-cache (near-free), but never buys another compute
  // run — one payment funds at most ONE recompute, killing the pay-once-loop-recompute abuse.
  consumed?: boolean;
};

function paymentKey(rawPaymentSig: string): string {
  return createHash('sha256').update(rawPaymentSig).digest('hex');
}

export function urlKeyFor(rawUrl: string): string {
  const u = new URL(rawUrl, 'https://local');
  const params = [...u.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  return createHash('sha256').update(u.pathname + '|' + JSON.stringify(params)).digest('hex');
}

/** Record a successfully settled payment. Call strictly AFTER a successful settle. */
export async function replayLedgerRecord(rawPaymentSig: string, rawUrl: string, settlementHeader: string): Promise<void> {
  if (TTL_S === 0) return;
  try {
    const k = paymentKey(rawPaymentSig);
    const entry: ReplayEntry = { urlKey: urlKeyFor(rawUrl), settlementHeader, ts: Date.now() };
    memPrune();
    mem.set(k, { v: entry, exp: Date.now() + TTL_S * 1000 });
    const c = await runtimeCache();
    if (c) await c.set(k, entry, { ttl: TTL_S, name: 'x402-replay' });
  } catch { /* ledger outage must never break a paid request */ }
}

/** Look up a failed payment: returns the entry iff this exact payment already settled for this
 *  exact URL within the replay window. The entry's own `ts` is enforced here — the window must
 *  not silently extend if the cache backend serves past-TTL values. */
export async function replayLedgerLookup(rawPaymentSig: string, rawUrl: string): Promise<ReplayEntry | undefined> {
  if (TTL_S === 0) return undefined;
  try {
    const k = paymentKey(rawPaymentSig);
    const wantUrl = urlKeyFor(rawUrl);
    const fresh = (v: ReplayEntry) => Date.now() - v.ts <= TTL_S * 1000;
    const m = mem.get(k);
    if (m && m.exp > Date.now() && m.v.urlKey === wantUrl && fresh(m.v)) return m.v;
    const c = await runtimeCache();
    if (c) {
      const v = (await c.get(k)) as ReplayEntry | undefined;
      if (v && typeof v === 'object' && v.urlKey === wantUrl && typeof v.settlementHeader === 'string'
        && typeof v.ts === 'number' && fresh(v)) return v;
    }
  } catch { /* fall through to normal 402 */ }
  return undefined;
}

/** Mark an entry as having spent its one recompute. Best-effort: a race between two concurrent
 *  retries can double-recompute at worst once — bounded, unlike the unbounded loop it prevents. */
export async function replayLedgerConsume(rawPaymentSig: string, entry: ReplayEntry): Promise<void> {
  try {
    const k = paymentKey(rawPaymentSig);
    const spent: ReplayEntry = { ...entry, consumed: true };
    const exp = entry.ts + TTL_S * 1000;
    mem.set(k, { v: spent, exp });
    const c = await runtimeCache();
    const ttlLeft = Math.max(1, Math.ceil((exp - Date.now()) / 1000));
    if (c) await c.set(k, spent, { ttl: ttlLeft, name: 'x402-replay' });
  } catch { /* best-effort */ }
}
