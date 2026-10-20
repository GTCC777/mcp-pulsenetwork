// paid-cache.ts — post-settle response cache for paid synthesis routes.
// Buyers pay on every call (the x402 gate settles BEFORE the lookup runs); this only
// removes the re-compute: identical GET path+params within TTL serve the stored body
// in <1s instead of re-running search+synthesis (fleet p50 was 39s — past most agent
// HTTP timeouts, so buyers paid, got nothing, and never returned).
// Backend: Vercel Runtime Cache when available, warm-instance memory otherwise.
// TTL: PAID_CACHE_TTL_S env (default 3600s); set low (e.g. 300) on realtime verticals;
// 0 disables entirely.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { IncomingHttpHeaders } from 'http';
import { createHash } from 'crypto';

const TTL_S = Math.max(0, Number(process.env.PAID_CACHE_TTL_S ?? 3600));

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
        m.getCache ? m.getCache({ namespace: 'paidresp' }) : null)
      .catch(() => null);
  }
  return _cachePromise;
}

const mem = new Map<string, { v: unknown; exp: number }>();
function memPrune(): void {
  if (mem.size < 500) return;
  const now = Date.now();
  for (const [k, e] of mem) if (e.exp <= now) mem.delete(k);
  while (mem.size > 400) { const k = mem.keys().next().value; if (k === undefined) break; mem.delete(k); }
}

// Cache entries must not outlive the code that produced them. Without a build component in the
// key, shipping a prompt or logic fix leaves the WRONG answer being re-served to every
// subsequent payer until the TTL expires. The commit SHA changes on every deploy, so a fix
// invalidates the entries it fixes.
const BUILD_ID =
  process.env.PAID_CACHE_VERSION ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.VERCEL_DEPLOYMENT_ID ??
  'dev';

function keyFor(rawUrl: string): string {
  const u = new URL(rawUrl, 'https://local');
  const params = [...u.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  return createHash('sha256')
    .update(BUILD_ID + '|' + u.pathname + '|' + JSON.stringify(params))
    .digest('hex');
}

/** True when the request carries a body the response may depend on. The x402 gate sees only
 *  headers + URL (never req.method), so body presence — content-length > 0 or a chunked
 *  transfer-encoding — is the signal that the URL-derived cache key cannot cover the full
 *  input. Routes that read the body first with a query fallback (resume-critique) otherwise
 *  leak: buyer A's GET ?resume_text=A populates the cache, buyer B POSTs their own resume to
 *  the same query string, and the lookup serves B buyer A's critique — A's resume content
 *  included. Personalized-body requests must never be served from, or stored into, this cache. */
export function requestHasBody(headers: IncomingHttpHeaders): boolean {
  const cl = headers['content-length'];
  // Check EVERY value, not just the first — a duplicated header must not hide a body.
  const clVals = Array.isArray(cl) ? cl : cl === undefined ? [] : [cl];
  if (clVals.some((v) => Number(v) > 0)) return true;
  const te = headers['transfer-encoding'];
  if (te !== undefined && String(te).length > 0) return true;
  // HTTP/2 requires NEITHER content-length nor transfer-encoding, so a streaming agent client
  // can send a body with no length signal at all (review-5 B-H1). Any content-type is
  // therefore treated as body-bearing: a bare cacheable GET has no reason to declare one, and
  // the failure direction here is a cache miss, never a cross-buyer answer.
  const ct = headers['content-type'];
  return ct !== undefined && String(ct).length > 0;
}

/** Post-settle lookup (called from the x402 gate). undefined = miss. */
export async function paidCacheLookup(rawUrl: string, reqHeaders: IncomingHttpHeaders): Promise<object | undefined> {
  if (TTL_S === 0) return undefined;
  if (requestHasBody(reqHeaders)) return undefined;
  try {
    const k = keyFor(rawUrl);
    const m = mem.get(k);
    if (m && m.exp > Date.now()) return m.v as object;
    const c = await runtimeCache();
    if (c) {
      const v = await c.get(k);
      if (v && typeof v === 'object') return v as object;
    }
  } catch { /* cache outage must never break a paid request */ }
  return undefined;
}

/** Wrap res.json so the successful synthesis result populates the cache. */
export function paidCacheArm(req: VercelRequest, res: VercelResponse): void {
  // GET-with-a-body is the store-side twin of the lookup guard: the framework parses JSON
  // bodies regardless of method, and body-first routes would cache a body-personalized
  // response under a body-blind key.
  if (TTL_S === 0 || req.method !== 'GET' || requestHasBody(req.headers)) return;
  // Free first-party traffic (internal key: ACP seller, PulseAgent, wholesale) must not seed
  // the cache that paying buyers are served from — paid responses come from paid-path runs.
  // Presence, not truthiness: a caller with an unset env var sends the header empty, and the
  // guard's intent is that internal-shaped traffic never seeds the paid cache (review-5 B-M1).
  if ('x-internal-key' in req.headers) return;
  let k: string;
  try { k = keyFor(req.url ?? '/'); } catch { return; }
  const json = res.json.bind(res);
  res.json = ((body: unknown) => {
    if (res.statusCode === 200 && body && typeof body === 'object' && !('error' in (body as Record<string, unknown>)) && !('parse_error' in (body as Record<string, unknown>))) {
      memPrune();
      mem.set(k, { v: body, exp: Date.now() + TTL_S * 1000 });
      runtimeCache()
        .then(c => c?.set(k, body, { ttl: TTL_S, name: 'paid-response' }))
        .catch(() => { /* best-effort */ });
    }
    return json(body);
  }) as VercelResponse['json'];
}
