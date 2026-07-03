import { logSale } from './analytics.js';
// x402 v2 — multi-network: Base mainnet USDC (eip155:8453) + Solana mainnet USDC-SPL (solana:5eykt4...)
import type { PaymentRequired, PaymentRequirements } from '@x402/core/types';
import {
  HTTPFacilitatorClient,
  decodePaymentSignatureHeader,
  encodePaymentRequiredHeader,
  encodePaymentResponseHeader,
} from '@x402/core/http';
import { facilitator as cdpFacilitator } from '@coinbase/x402';
import type { IncomingHttpHeaders } from 'http';
import { isInternalRequest, authorizeInternal } from './internal-auth.js';

// USDC on Base mainnet (6 decimals)
// Amounts: 50_000 = $0.05 | 100_000 = $0.10 | 200_000 = $0.20
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const BASE_NETWORK = 'eip155:8453';

// USDC-SPL on Solana mainnet (also 6 decimals — same amount strings as Base)
const USDC_SOLANA = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOLANA_NETWORK = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
// PulseNetwork Solana receiving wallet (public address; env override supported)
const SOLANA_PAYTO = process.env.SOLANA_OWNER_WALLET ?? '985iFjbnGQ3dJcwXnfRCMSrH4Jnc3kW1N6msR64B5KX1';

function getHeader(headers: IncomingHttpHeaders, name: string): string | undefined {
  const val = headers[name.toLowerCase()];
  return Array.isArray(val) ? val[0] : val;
}

function buildResourceUrl(headers: IncomingHttpHeaders, rawUrl: string): string {
  const host = getHeader(headers, 'x-forwarded-host') ?? getHeader(headers, 'host') ?? 'localhost';
  const proto = getHeader(headers, 'x-forwarded-proto') ?? 'https';
  return `${proto}://${host}${rawUrl.split('?')[0]}`;
}

// All payment options advertised in the 402 `accepts` array. Order = preference (Base first
// for back-compat). An agent picks one and pays; we settle on whichever network it used.
function buildRequirements(amount: string, solanaExtra: Record<string, unknown>): PaymentRequirements[] {
  const base: PaymentRequirements = {
    scheme: 'exact',
    network: BASE_NETWORK,
    asset: USDC_BASE,
    amount,
    payTo: process.env.OWNER_WALLET ?? '',
    maxTimeoutSeconds: 300,
    extra: { name: 'USD Coin', version: '2' },
  };
  const reqs = [base];
  // Advertise Solana only when the facilitator gave us its required extra (esp. feePayer/gas
  // sponsor). Without it the SVM scheme can't build a transaction, so we omit Solana rather
  // than advertise a broken option.
  if (solanaExtra && Object.keys(solanaExtra).length > 0) {
    reqs.push({
      scheme: 'exact',
      network: SOLANA_NETWORK,
      asset: USDC_SOLANA,
      amount,
      payTo: SOLANA_PAYTO,
      maxTimeoutSeconds: 300,
      extra: solanaExtra,
    });
  }
  return reqs;
}

// Cache the facilitator's supported kinds (per warm lambda) so we don't re-fetch every request.
let supportedKindsCache: { kinds?: Array<{ scheme: string; network: string; extra?: Record<string, unknown> }> } | null = null;
async function getSolanaExtra(facilitator: HTTPFacilitatorClient): Promise<Record<string, unknown>> {
  try {
    if (!supportedKindsCache) supportedKindsCache = await facilitator.getSupported();
    const kind = supportedKindsCache?.kinds?.find(k => k.scheme === 'exact' && k.network === SOLANA_NETWORK);
    return kind?.extra ?? {};
  } catch {
    return {};
  }
}

// Select the advertised requirement matching the network the client actually paid on.
// The decoded payload carries the chosen requirement under `accepted`. We re-match it against
// OUR advertised list (not trust the payload's copy) so payTo/asset stay authoritative.
// Falls back to the first (Base) so the original single-network flow is unchanged.
function selectRequirement(reqs: PaymentRequirements[], payload: unknown): PaymentRequirements {
  const net = (payload as { accepted?: { network?: string } } | null)?.accepted?.network;
  return reqs.find(r => r.network === net) ?? reqs[0];
}

function buildFacilitator(): HTTPFacilitatorClient {
  if (process.env.CDP_API_KEY_ID && process.env.CDP_API_KEY_SECRET) {
    return new HTTPFacilitatorClient(cdpFacilitator);
  }
  return new HTTPFacilitatorClient({ url: 'https://x402.org/facilitator' });
}

export type PaymentGateOk = { ok: true; settlementHeader: string };
export type PaymentGateFail = {
  ok: false;
  status: number;
  body: object;
  headers: Record<string, string>;
};
export type PaymentGateResult = PaymentGateOk | PaymentGateFail;


export interface BazaarMeta {
  queryParams?: Record<string, string>;
  outputExample?: Record<string, unknown>;
}

// Base Builder Code (ERC-8021 Schema 2) — the app code that attributes every PulseNetwork
// x402 settlement to our project on Base (analytics + leaderboards + future builder rewards).
// Declared in the 402 `extensions` map; the CDP facilitator reads `a` from the client payment
// payload and appends the ERC-8021 suffix to the settlement calldata. Public value, not a secret.
// Registered at dashboard.base.org (The Aslan Group / "Pulse Network"). Hand-rolled to avoid a
// fleet-wide @x402/extensions dependency — the wire format is a stable on-chain standard.
const BUILDER_CODE_APP = 'bc_gxy6qn5p';
const BUILDER_CODE_EXTENSION = {
  info: { a: BUILDER_CODE_APP },
  schema: {
    '$schema': 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: {
      a: { type: 'string', pattern: '^[a-z0-9_]{1,32}$', description: 'App builder code' },
      w: { type: 'string', pattern: '^[a-z0-9_]{1,32}$', description: 'Wallet builder code' },
      s: { type: 'array', items: { type: 'string', pattern: '^[a-z0-9_]{1,32}$' }, description: 'Service builder codes' },
    },
    additionalProperties: false,
  },
} as const;

export async function handlePaymentGate(
  reqHeaders: IncomingHttpHeaders,
  rawUrl: string,
  amount: string,
  description: string,
  tags: string[],
  bazaarMeta?: BazaarMeta,
): Promise<PaymentGateResult> {
  // First-party bypass: a matching x-internal-key skips payment entirely (used by our Bankr
  // x402 Cloud proxy handlers + PulseAgent + prepaid wholesale resellers). No settlement, full
  // result served. `amount` is already the retail x402 amount in micro-USD (e.g. "15000" = $0.015)
  // — pass it through so a PREPAID scoped key can be billed wholesale cost against its balance.
  // Metered-free scoped keys and the master path ignore this parameter entirely.
  const internalAuth = await authorizeInternal(reqHeaders, rawUrl, Number(amount));
  if (internalAuth.ok) {
    return { ok: true, settlementHeader: 'internal' };
  }
  const facilitator = buildFacilitator();
  const solanaExtra = await getSolanaExtra(facilitator);
  const allReqs = buildRequirements(amount, solanaExtra);
  const resourceUrl = buildResourceUrl(reqHeaders, rawUrl);

  const paymentRequired = {
    x402Version: 2,
    accepts: allReqs,
    resource: {
      url: resourceUrl,
      description,
      mimeType: 'application/json',
      serviceName: 'PulseNetwork',
      tags,
    },
    extensions: {
      bazaar: {
        info: {
          input: {
            type: 'http',
            method: 'GET',
            queryParams: bazaarMeta?.queryParams ?? {},
          },
          output: {
            type: 'json',
            example: bazaarMeta?.outputExample ?? {},
          },
        },
        schema: { '$schema': 'https://json-schema.org/draft/2020-12/schema', type: 'object' },
      },
      'builder-code': BUILDER_CODE_EXTENSION,
    },
  } as unknown as PaymentRequired;

  const paymentSig = getHeader(reqHeaders, 'payment-signature');

  if (!paymentSig) {
    return {
      ok: false,
      status: 402,
      body: paymentRequired,
      headers: { 'PAYMENT-REQUIRED': encodePaymentRequiredHeader(paymentRequired) },
    };
  }

  let paymentPayload;
  try {
    paymentPayload = decodePaymentSignatureHeader(paymentSig);
  } catch {
    return {
      ok: false,
      status: 402,
      body: paymentRequired,
      headers: { 'PAYMENT-REQUIRED': encodePaymentRequiredHeader(paymentRequired) },
    };
  }

  const reqs = selectRequirement(allReqs, paymentPayload);

  let verifyResult;
  try {
    verifyResult = await facilitator.verify(paymentPayload, reqs);
  } catch (err) {
    return {
      ok: false,
      status: 402,
      body: { error: 'verification_failed', detail: String(err) },
      headers: {},
    };
  }

  if (!verifyResult.isValid) {
    return {
      ok: false,
      status: 402,
      body: { error: 'payment_invalid', reason: verifyResult.invalidReason },
      headers: {},
    };
  }

  let settleResult;
  try {
    settleResult = await facilitator.settle(paymentPayload, reqs);
  } catch (err) {
    return {
      ok: false,
      status: 402,
      body: { error: 'settlement_failed', detail: String(err) },
      headers: {},
    };
  }

  // Bazaar priming: payment has settled above. If the secret prime header is present,
  // skip synthesis (Tavily/Claude) to avoid compute cost. Real users never send this header.
  if (getHeader(reqHeaders, "x-prime-key") === "pnprime_k7Qz3mV9xR2wL5tB") {
    return { ok: false, status: 200, body: { primed: true }, headers: { "PAYMENT-RESPONSE": encodePaymentResponseHeader(settleResult) } };
  }
  await logSale(reqHeaders, rawUrl, amount, settleResult as unknown as Record<string, unknown>);
  return { ok: true, settlementHeader: encodePaymentResponseHeader(settleResult) };
}
