// B402 — Binance's first-party x402 facilitator for BNB Smart Chain (eip155:56).
// Speaks standard x402 v2 wire format wrapped in the BAPI envelope ({code,message,data},
// HTTP always 200) behind RSA-signed X-Tesla-* headers. All calls route through our
// fixed-egress relay (pulse-b402-relay.fly.dev → cb.binanceapi.com) because Binance
// enforces a hard per-merchant IP whitelist (our static egress 209.71.103.213); the RSA
// key never leaves the lambda — the relay just forwards signed requests.
// Auth format (docs quick-start, verified live 2026-08-03): X-Tesla-Signature =
// base64(RSA-SHA256(body + timestamp)), timestamp in milliseconds.
import { createSign } from 'crypto';

const RELAY_BASE = process.env.B402_RELAY_BASE ?? 'https://pulse-b402-relay.fly.dev/b402/mainnet';

// Advertise/settle the BSC lane only when the full credential set is present.
// Kill switch shared with the legacy AEON path: X402_DISABLE_BSC=1.
export function b402Enabled(): boolean {
  return !!(
    process.env.B402_CLIENT_ID &&
    process.env.B402_MAINNET_ACCESS_TOKEN &&
    process.env.B402_RSA_PRIVATE_KEY_B64 &&
    process.env.B402_RELAY_KEY
  ) && !process.env.X402_DISABLE_BSC;
}

type Envelope<T> = { code?: string; message?: string; data?: T };

// Binance's edge WAF 403s any request body containing a semicolon or parentheses (a
// generic SQLi signature). Those characters only ever appear in the human-readable hint
// text of the Bazaar discovery blob (e.g. a queryParams example "horse (default; ...)"),
// which buyers echo back into paymentPayload.extensions. Strip them from string values in
// the extensions subtree ONLY — the EIP-3009 authorization + signature live in
// payload.authorization/payload.signature and are never touched, so this cannot invalidate
// a payment. BSC-only: CDP/AWS facilitators keep the rich punctuation.
function stripWafChars<T>(v: T): T {
  if (typeof v === 'string') {
    return v.replace(/[()]/g, '').replace(/;/g, ',').replace(/ {2,}/g, ' ').trim() as unknown as T;
  }
  if (Array.isArray(v)) return v.map(stripWafChars) as unknown as T;
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) out[k] = stripWafChars(val);
    return out as unknown as T;
  }
  return v;
}

export class B402FacilitatorClient {
  // `challengeExtensions` = the extensions map from OUR 402 challenge (bazaar blob +
  // builder-code). B402 Bazaar listing rides on settle traffic (persisted today, indexed
  // when Binance launches the public registry), carried inside paymentPayload.extensions.
  // Echoing clients bring it themselves; for the rest we merge it in at settle time.
  // Binance guarantee: a failure persisting the blob never fails the settle.
  constructor(private challengeExtensions?: Record<string, unknown>) {}

  private async call<T>(path: 'verify' | 'settle' | 'supported', body: object): Promise<T> {
    // Sanitize the echoed Bazaar blob so it never trips Binance's edge WAF (see stripWafChars).
    const b = body as { paymentPayload?: { extensions?: unknown } };
    if (b?.paymentPayload?.extensions) {
      b.paymentPayload = { ...b.paymentPayload, extensions: stripWafChars(b.paymentPayload.extensions) };
    }
    const raw = JSON.stringify(body);
    const timestamp = String(Date.now());
    const signer = createSign('RSA-SHA256');
    signer.update(raw + timestamp);
    const pem = Buffer.from(process.env.B402_RSA_PRIVATE_KEY_B64 ?? '', 'base64').toString('utf8');
    const signature = signer.sign(pem, 'base64');
    const res = await fetch(`${RELAY_BASE}/papi/v2/b402/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-relay-key': process.env.B402_RELAY_KEY ?? '',
        'X-Tesla-ClientId': process.env.B402_CLIENT_ID ?? '',
        'X-Tesla-SignAccessToken': process.env.B402_MAINNET_ACCESS_TOKEN ?? '',
        'X-Tesla-Timestamp': timestamp,
        'X-Tesla-Signature': signature,
      },
      body: raw,
      signal: AbortSignal.timeout(25_000),
    });
    const text = await res.text();
    let env: Envelope<T>;
    try {
      env = JSON.parse(text) as Envelope<T>;
    } catch {
      throw new Error(`b402 ${path} non-JSON HTTP ${res.status}: ${text.slice(0, 160)}`);
    }
    if (env.code !== '000000' || !env.data) {
      throw new Error(`b402 ${path} code=${env.code}: ${env.message ?? text.slice(0, 160)}`);
    }
    return env.data;
  }

  async getSupported(): Promise<{ kinds?: Array<{ scheme: string; network: string; extra?: Record<string, unknown> }> }> {
    return this.call('supported', {});
  }

  async verify(
    paymentPayload: unknown,
    paymentRequirements: unknown,
  ): Promise<{ isValid: boolean; invalidReason?: string; payer?: string }> {
    return this.call('verify', { x402Version: 2, paymentPayload, paymentRequirements });
  }

  async settle(
    paymentPayload: unknown,
    paymentRequirements: unknown,
  ): Promise<{ success: boolean; transaction?: string; network?: string; payer?: string; errorReason?: string }> {
    const pp = paymentPayload as { extensions?: Record<string, unknown>; resource?: { url?: string; description?: string } } | null;
    // Extension precedence: buyer-echoed > our 402 challenge's > minimal blob derived from
    // the payload's own resource (keeps Bazaar listing riding on EVERY settle fleet-wide,
    // even in repos without challenge-extension plumbing).
    const fallback = pp?.resource?.url
      ? {
          bazaar: {
            info: { input: { type: 'http', method: 'GET' }, output: { type: 'json' } },
            schema: { $schema: 'https://json-schema.org/draft/2020-12/schema', type: 'object' },
            description: String(pp.resource.description ?? '').slice(0, 500),
          },
        }
      : undefined;
    const extensions = pp?.extensions ?? this.challengeExtensions ?? fallback;
    const merged = pp && !pp.extensions && extensions ? { ...(pp as object), extensions } : paymentPayload;
    const body = { x402Version: 2, paymentPayload: merged, paymentRequirements };
    // BAPI settle has THREE outcomes: settled (success:true + tx hash), failed terminal
    // (success:false + transaction:''), and PENDING (success:false + non-empty tx hash —
    // broadcast, awaiting confirmation; docs: "do not stop at the first success:false").
    // Settle is idempotent on (nonce, network, payer), so we re-POST until terminal within
    // the lambda's time budget (~15s of polling; BSC blocks land in seconds).
    let last = await this.call<{ success: boolean; transaction?: string; network?: string; payer?: string; errorReason?: string }>('settle', body);
    for (let i = 0; i < 6 && !last.success && last.transaction; i++) {
      await new Promise(r => setTimeout(r, 2500));
      last = await this.call('settle', body);
    }
    if (!last.success && last.transaction) {
      // Still pending after the polling budget: fail LOUD. The gate 402s (content not
      // delivered). If the tx confirms later the buyer's retry hits the idempotent settle
      // and gets the content — no double charge.
      return { ...last, errorReason: last.errorReason ?? 'settlement_pending_timeout' };
    }
    return last;
  }
}
