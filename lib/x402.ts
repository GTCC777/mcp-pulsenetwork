import { paidCacheLookup, requestHasBody } from './paid-cache.js';
import { replayLedgerRecord, replayLedgerLookup, replayLedgerConsume } from './replay-ledger.js';
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
import { OKXFacilitatorClient } from '@okxweb3/x402-core';
import type { IncomingHttpHeaders } from 'http';
import { isInternalRequest, authorizeInternal } from './internal-auth.js';
import { B402FacilitatorClient, b402Enabled } from './b402.js';

// USDC on Base mainnet (6 decimals)
// Amounts: 50_000 = $0.05 | 100_000 = $0.10 | 200_000 = $0.20
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const BASE_NETWORK = 'eip155:8453';

// USDC-SPL on Solana mainnet (also 6 decimals — same amount strings as Base)
const USDC_SOLANA = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOLANA_NETWORK = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
// PulseNetwork Solana receiving wallet (public address; env override supported)
const SOLANA_PAYTO = process.env.SOLANA_OWNER_WALLET ?? '985iFjbnGQ3dJcwXnfRCMSrH4Jnc3kW1N6msR64B5KX1';

// Native Circle USDC on Polygon PoS (eip155:137), Arbitrum One (eip155:42161) and World Chain
// (eip155:480) — all 6 decimals (same atomic amount strings as Base), all settled by the SAME
// CDP facilitator we already use for Base + Solana (confirmed via getSupported() with our keys
// 2026-07-27). Addresses confirmed against Circle's official list + on-chain EIP-712 domains
// read the same day (Polygon/Arbitrum = 'USD Coin' v2; World = 'USDC' v2 — newer deployment).
// Kill switches: X402_DISABLE_137 / X402_DISABLE_42161 / X402_DISABLE_480.
const CDP_EVM_EXTRAS: Array<{ network: `${string}:${string}`; asset: string; extra: { name: string; version: string }; disable: string }> = [
  { network: 'eip155:137', asset: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', extra: { name: 'USD Coin', version: '2' }, disable: 'X402_DISABLE_137' },
  { network: 'eip155:42161', asset: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', extra: { name: 'USD Coin', version: '2' }, disable: 'X402_DISABLE_42161' },
  { network: 'eip155:480', asset: '0x79A02482A880bCe3F13E09da970dC34dB4cD24D1', extra: { name: 'USDC', version: '2' }, disable: 'X402_DISABLE_480' },
];

// USDC (Circle native) on Monad (eip155:143) — {name:'USDC', version:'2'}, 6 decimals, read
// on-chain + confirmed against Circle's official list 2026-07-27. Settled by the Monad
// Foundation's own facilitator (x402-facilitator.molandak.org, keyless; /supported probed same
// day: v2 exact on eip155:143). Monad Fdn is an x402 Foundation member — institutional-grade
// counterparty. Kill switch: X402_DISABLE_143=1.
const USDC_MONAD = '0x754704Bc059F8C67012fEd69BC8A327a5aafb603';
const MONAD_NETWORK = 'eip155:143';
const MOLANDAK_FACILITATOR_URL = 'https://x402-facilitator.molandak.org';

// USDT0 on X Layer (eip155:196) — the settlement rail of OKX's okx.ai agent economy.
// 6 decimals, so the same atomic amount strings as Base USDC. Settlement is brokered by
// the OKX SA API (HMAC-signed; OKXFacilitatorClient from @okxweb3/x402-core, which
// implements the same verify/settle FacilitatorClient interface we use everywhere).
// GATED ON CREDENTIALS: OKX_API_KEY + OKX_SECRET_KEY + OKX_PASSPHRASE (Onchain OS dev
// portal, obtained 2026-07-28) — no creds, no advertisement. Kill switch: X402_DISABLE_196=1.
// EIP-712 domain read from a live okx.ai merchant's 402 accepts: { name: 'USD₮0', version: '1' }.
// syncSettle: true — facilitator waits for on-chain confirmation, matching our
// settle-then-deliver gate (a "pending" would deliver before payment proof).
const USDT0_XLAYER = '0x779ded0c9e1022225f8e0630b35a9b54be713736';
const XLAYER_NETWORK = 'eip155:196';
const xlayerEnabled = (): boolean =>
  !!(process.env.OKX_API_KEY && process.env.OKX_SECRET_KEY && process.env.OKX_PASSPHRASE) && !process.env.X402_DISABLE_196;

// USDC (Circle native) on HyperEVM (eip155:999) — 6 decimals, same atomic amount strings as
// Base. EIP-712 domain {name:'USDC', version:'2'} read on-chain 2026-07-27 (newer Circle
// deployment — NOT Base's 'USD Coin'). Contract confirmed against Circle's official address
// list same day. Facilitator: 0xarchive community facilitator (keyless, zero fee, pays HYPE
// gas; /supported probed 2026-07-27: x402 v2 exact on eip155:999 + 8453). Operator is
// pseudonymous — worst case is a failed settle (buyer not charged), never fund loss, since
// EIP-3009 authorizations name our payTo directly. Kill switch: X402_DISABLE_999=1.
const USDC_HYPEREVM = '0xb88339CB7199b77E23DB6E890353E22632Ba630f';
const HYPEREVM_NETWORK = 'eip155:999';
const ARCHIVE_FACILITATOR_URL = 'https://facilitator.0xarchive.io';

// USDC (native Circle ASA 31566704) on Algorand mainnet — 6 decimals, same atomic amount
// strings as Base. Facilitator: GoPlausible, the Algorand Foundation's designated x402
// facilitator (keyless; /supported probed 2026-07-27: x402 v2 exact on the CAIP genesis-hash
// network below, WITH feePayer fee abstraction — the payer needs no ALGO for gas). AVM support
// is merged upstream in Coinbase's official x402 SDK (@x402/avm). Like Solana, the accepts
// entry must carry the facilitator's live extra (feePayer) or clients can't build the payment —
// so the lane is advertised only when /supported answers. payTo = PulseNetwork's own Algorand
// account (Gavin-held Pera key, ceremony 2026-07-27; USDC ASA opt-in confirmed on-chain).
// Kill switch: X402_DISABLE_ALGORAND=1.
// CAIP-2 caps the reference at 32 chars, so the canonical Algorand mainnet network id is the
// genesis hash truncated to 32 base64 chars — this is what the official @x402/avm SDK registers
// and matches against, so we MUST advertise this form (a client can't match the full-hash form).
// GoPlausible's /supported returns the full 44-char base64 hash; getAlgorandExtra() prefix-matches
// so we still pick up its feePayer, and the facilitator normalizes both forms on verify/settle.
const ALGORAND_NETWORK = 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k';
// GoPlausible's facilitator advertises + REQUIRES the full 44-char genesis-hash network id on
// verify/settle, but the official @x402/avm client only matches the canonical 32-char form. So we
// advertise canonical (client-matchable) and translate to this full form on the facilitator call.
const ALGORAND_NETWORK_FACILITATOR = 'algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=';
const USDC_ALGORAND = '31566704'; // ASA id — asset field carries the id string on AVM
const GOPLAUSIBLE_FACILITATOR_URL = 'https://facilitator.goplausible.xyz';
const ALGORAND_PAYTO = process.env.ALGORAND_OWNER_WALLET ?? '62A253YPATFNJCPRKID3FKD77MYJFNTVRYRP4B4JWG36EGLPY7UXFWGI7I';

// XRP on XRPL mainnet (xrpl:0) — t54 facilitator (keyless; x402 v2 exact, probed 2026-07-24).
// Presigned Payment tx blob scheme; facilitator submits w/ SourceTag + invoice binding.
// Drops: at XRP≈$1.10 one 6-dp USDC unit ≈ one drop (X402_XRPL_DROPS_PER_UNIT to retune).
// Kill switch: X402_DISABLE_XRPL=1. Receiving account is PulseNetwork's own (fleet-wide).
const XRPL_NETWORK = 'xrpl:0';
const XRPL_FACILITATOR_URL = 'https://xrpl-facilitator-mainnet.t54.ai';
const XRPL_PAYTO = process.env.XRPL_OWNER_WALLET ?? 'rMnHeutYALco8RYFVcmuU4BCgSzBpPEh32';
const XRPL_SOURCE_TAG = 804681468;
const toXrpDrops = (usdc6dp: string) =>
  String(Math.ceil(Number(usdc6dp) * Number(process.env.X402_XRPL_DROPS_PER_UNIT ?? '1')));
// RLUSD (Ripple USD) on XRPL — issued currency: asset = 40-hex code, issuer in extra, and a
// DECIMAL value string as amount (the x402-xrpl scheme builds {currency, issuer, value} from
// exactly these fields — unlike the XRP lane's drops). Stable-priced. Gate X402_XRPL_RLUSD=1;
// e2e-settled 2026-07-25 on onchainpulse (tx 20B6815E…). Buyers need their own trustline.
const RLUSD_HEX = '524C555344000000000000000000000000000000';
const RLUSD_ISSUER = 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De';
const toRlusdValue = (usdc6dp: string) =>
  (Number(usdc6dp) / 1e6).toFixed(6).replace(/\.?0+$/, '');

// USDT on BNB Chain (eip155:56) — 18 decimals (6-dp USDC strings × 10^12). AEON facilitator
// requires an Authorization Bearer key (probed 2026-07-24: bogus key → "api-key is not
// exists (9010)"), so the lane stays dormant until X402_AEON_API_KEY is set (fleet go-live
// is then env-only). Kill switch after go-live: X402_DISABLE_BSC=1.
const USDT_BSC = '0x55d398326f99059fF775485246999027B3197955';
const BSC_NETWORK = 'eip155:56';
const AEON_FACILITATOR_URL = 'https://facilitator.aeon.xyz';
const toBscAtomic = (usdc6dp: string) => `${usdc6dp}000000000000`;
const bscEnabled = () => !!process.env.X402_AEON_API_KEY && !process.env.X402_DISABLE_BSC;

// USD1 (World Liberty Financial USD) on BNB Chain — 18 decimals (same ×10^12 atomic
// conversion as BSC USDT). Settled by B402, Binance's first-party x402 facilitator
// (onboarded 2026-08-03; RSA-signed X-Tesla auth via our fixed-egress relay — lib/b402.ts).
// USD1 = the v1 asset because it supports eip3009, the same client flow as Base USDC.
// Contract + domain verified on-chain + against B402 /supported 2026-08-03. Facilitator
// sponsors gas. Supersedes the never-delivered AEON path; shares X402_DISABLE_BSC.
const USD1_BSC = '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d';
const B402_SIGNER = '0x34F7a661160780Ce1346e6D7B96D2bE244590899';

// XRPL challenges mint a fresh invoiceId per 402 (stateless across lambdas); on the paid
// retry adopt the BUYER's invoiceId from the payload so the facilitator's invoice binding
// matches — amount/asset/payTo stay authoritative from OUR advertised list. Replay of a
// settled blob is impossible (XRPL account sequence burns on use).
function adoptXrplInvoice(match: PaymentRequirements, payload: unknown): PaymentRequirements {
  const acc = (payload as { accepted?: { extra?: Record<string, unknown> } } | null)?.accepted;
  if (match.network === XRPL_NETWORK && typeof acc?.extra?.invoiceId === 'string') {
    return { ...match, extra: { ...match.extra, invoiceId: acc.extra.invoiceId } };
  }
  return match;
}

// Verify/settle must go to a facilitator that actually supports the paid network.
// CDP covers Base + Solana; xrpl:0 routes to the t54 facilitator (keyless) and eip155:56
// to AEON (Bearer key). Loud-failure: settle errors surface as settlement_failed 402s.
function facilitatorFor(network: string, defaultFacilitator: HTTPFacilitatorClient): HTTPFacilitatorClient {
  // X Layer settles through the HMAC-signed OKX SA API — same verify/settle interface,
  // different transport; the cast is safe because callers only use verify/settle.
  if (network === XLAYER_NETWORK && xlayerEnabled()) {
    return new OKXFacilitatorClient({
      apiKey: process.env.OKX_API_KEY!,
      secretKey: process.env.OKX_SECRET_KEY!,
      passphrase: process.env.OKX_PASSPHRASE!,
      syncSettle: true,
    }) as unknown as HTTPFacilitatorClient;
  }
  if (network === ALGORAND_NETWORK) return new HTTPFacilitatorClient({ url: GOPLAUSIBLE_FACILITATOR_URL });
  if (network === HYPEREVM_NETWORK) return new HTTPFacilitatorClient({ url: ARCHIVE_FACILITATOR_URL });
  if (network === MONAD_NETWORK) return new HTTPFacilitatorClient({ url: MOLANDAK_FACILITATOR_URL });
  if (network === XRPL_NETWORK) return new HTTPFacilitatorClient({ url: XRPL_FACILITATOR_URL });
  if (network === BSC_NETWORK) {
    // B402 (Binance) first; legacy AEON only if B402 creds are absent. Cast is safe:
    // callers only use verify/settle.
    if (b402Enabled()) {
      return new B402FacilitatorClient() as unknown as HTTPFacilitatorClient;
    }
    return new HTTPFacilitatorClient({
      url: AEON_FACILITATOR_URL,
      createAuthHeaders: async () => {
        const h = { Authorization: `Bearer ${process.env.X402_AEON_API_KEY ?? ''}` };
        return { verify: h, settle: h, supported: h };
      },
    });
  }
  return defaultFacilitator;
}

function getHeader(headers: IncomingHttpHeaders, name: string): string | undefined {
  const val = headers[name.toLowerCase()];
  return Array.isArray(val) ? val[0] : val;
}

// Canonical public host for this vertical. Requests arriving via Vercel alias hosts
// (*.vercel.app) advertise this domain in the 402 resource URL so Bazaar/agentic.market
// discovery converges on one host per brand; settlement itself is host-agnostic.
const CANONICAL_HOST = 'pulse.theaslangroupllc.com';

function buildResourceUrl(headers: IncomingHttpHeaders, rawUrl: string): string {
  let host = getHeader(headers, 'x-forwarded-host') ?? getHeader(headers, 'host') ?? 'localhost';
  if (host.endsWith('.vercel.app')) host = CANONICAL_HOST;
  const proto = getHeader(headers, 'x-forwarded-proto') ?? 'https';
  return `${proto}://${host}${rawUrl.split('?')[0]}`;
}

// All payment options advertised in the 402 `accepts` array. Order = preference (Base first
// for back-compat). An agent picks one and pays; we settle on whichever network it used.
function buildRequirements(amount: string, solanaExtra: Record<string, unknown>, algorandExtra: Record<string, unknown> = {}): PaymentRequirements[] {
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
  // Polygon / Arbitrum / World: CDP-settled EVM lanes, same payTo as Base.
  for (const n of CDP_EVM_EXTRAS) {
    if (process.env[n.disable]) continue;
    reqs.push({
      scheme: 'exact',
      network: n.network,
      asset: n.asset,
      amount,
      payTo: process.env.OWNER_WALLET ?? '',
      maxTimeoutSeconds: 300,
      extra: n.extra,
    });
  }
  // Monad: Foundation-run facilitator, same EVM payTo as Base.
  if (!process.env.X402_DISABLE_143) {
    reqs.push({
      scheme: 'exact',
      network: MONAD_NETWORK,
      asset: USDC_MONAD,
      amount,
      payTo: process.env.OWNER_WALLET ?? '',
      maxTimeoutSeconds: 300,
      extra: { name: 'USDC', version: '2' },
    });
  }
  // X Layer: OKX agent-economy buyers (okx.ai marketplace agents pay from OKX Agentic
  // Wallets funded in USDT0). Same EVM payTo as Base. Advertised only when OKX creds exist.
  if (xlayerEnabled()) {
    reqs.push({
      scheme: 'exact',
      network: XLAYER_NETWORK,
      asset: USDT0_XLAYER,
      amount,
      payTo: process.env.OWNER_WALLET ?? '',
      maxTimeoutSeconds: 300,
      extra: { name: 'USD₮0', version: '1' },
    });
  }
  // HyperEVM: same EVM payTo as Base. HL-native buyers (agent wallets already funded on
  // Hyperliquid) can pay without bridging out.
  if (!process.env.X402_DISABLE_999) {
    reqs.push({
      scheme: 'exact',
      network: HYPEREVM_NETWORK,
      asset: USDC_HYPEREVM,
      amount,
      payTo: process.env.OWNER_WALLET ?? '',
      maxTimeoutSeconds: 300,
      extra: { name: 'USDC', version: '2' },
    });
  }
  // Algorand: advertised only when the GoPlausible facilitator gave us its live extra
  // (feePayer) — same gating rationale as Solana above.
  if (!process.env.X402_DISABLE_ALGORAND && algorandExtra && Object.keys(algorandExtra).length > 0) {
    reqs.push({
      scheme: 'exact',
      network: ALGORAND_NETWORK,
      asset: USDC_ALGORAND,
      amount,
      payTo: ALGORAND_PAYTO,
      maxTimeoutSeconds: 300,
      extra: algorandExtra,
    });
  }
  // XRPL: fresh invoiceId per challenge (see adoptXrplInvoice for the stateless retry path).
  if (!process.env.X402_DISABLE_XRPL) {
    reqs.push({
      scheme: 'exact',
      network: XRPL_NETWORK,
      asset: 'XRP',
      amount: toXrpDrops(amount),
      payTo: XRPL_PAYTO,
      maxTimeoutSeconds: 300,
      extra: { sourceTag: XRPL_SOURCE_TAG, invoiceId: crypto.randomUUID().replace(/-/g, '').toUpperCase() },
    });
    // RLUSD lane (stable pricing on XRPL). Gated until fleet flip — e2e-settled on the pilot.
    if (process.env.X402_XRPL_RLUSD) {
      reqs.push({
        scheme: 'exact',
        network: XRPL_NETWORK,
        asset: RLUSD_HEX,
        amount: toRlusdValue(amount),
        payTo: XRPL_PAYTO,
        maxTimeoutSeconds: 300,
        extra: {
          sourceTag: XRPL_SOURCE_TAG,
          issuer: RLUSD_ISSUER,
          invoiceId: crypto.randomUUID().replace(/-/g, '').toUpperCase(),
        },
      });
    }
  }
  // BNB Chain: advertised only once we hold an AEON facilitator key — never advertise a
  // lane we cannot settle.
  // BNB Chain via B402 (Binance first-party facilitator): USD1 eip3009 lane. Advertised
  // only when the full B402 credential set is present — never advertise a lane we cannot
  // settle. The extra mirrors B402's live /supported kind.
  if (b402Enabled()) {
    reqs.push({
      scheme: 'exact',
      network: BSC_NETWORK,
      asset: USD1_BSC,
      amount: toBscAtomic(amount),
      payTo: process.env.OWNER_WALLET ?? '',
      maxTimeoutSeconds: 300,
      extra: { name: 'World Liberty Financial USD', version: '1', assetTransferMethod: 'eip3009', signerAddress: B402_SIGNER },
    });
  }
  if (!b402Enabled() && bscEnabled()) {
    reqs.push({
      scheme: 'exact',
      network: BSC_NETWORK,
      asset: USDT_BSC,
      amount: toBscAtomic(amount),
      payTo: process.env.OWNER_WALLET ?? '',
      maxTimeoutSeconds: 300,
      extra: { name: 'Tether USD', version: '1' },
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

// Same per-warm-lambda cache for the GoPlausible facilitator's Algorand kind (carries the
// feePayer the AVM scheme needs). Failure → empty → the Algorand lane simply isn't advertised.
let algorandKindsCache: { kinds?: Array<{ scheme: string; network: string; extra?: Record<string, unknown> }> } | null = null;
async function getAlgorandExtra(): Promise<Record<string, unknown>> {
  if (process.env.X402_DISABLE_ALGORAND) return {};
  try {
    if (!algorandKindsCache) {
      algorandKindsCache = await new HTTPFacilitatorClient({ url: GOPLAUSIBLE_FACILITATOR_URL }).getSupported();
    }
    // Prefix-match: our canonical id is the 32-char truncation of the facilitator's full hash.
    const kind = algorandKindsCache?.kinds?.find(k =>
      k.scheme === 'exact' && (k.network.startsWith(ALGORAND_NETWORK) || ALGORAND_NETWORK.startsWith(k.network)));
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
  // Match asset too when the buyer's payload names one — XRPL advertises both XRP and RLUSD
  // on the same network, and picking the wrong entry would verify against the wrong amount.
  const acc = (payload as { accepted?: { network?: string; asset?: string } } | null)?.accepted;
  return (
    reqs.find(r => r.network === acc?.network && !!acc?.asset && r.asset === acc.asset) ??
    reqs.find(r => r.network === acc?.network) ??
    reqs[0]
  );
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
  errorResponses?: Record<string, { description: string; example?: Record<string, unknown> }>;
  queryParams?: Record<string, string>;
  outputExample?: Record<string, unknown>;
}

// Canonical Bazaar discovery extension. Mirrors createQueryDiscoveryExtension /
// createBodyDiscoveryExtension from @x402/extensions (verified against x402-foundation/x402
// source 2026-08-20): example values go in info.input.queryParams (or .body for POST-family
// methods); the per-param JSON Schema (type/description/required) goes in the schema slot,
// which was previously a bare {type:'object'} stub even when handlers passed rich param
// metadata -- the CDP curation tier judges "complete input schema" from that slot. Hand-rolled
// (no fleet-wide @x402/extensions dep); strict parsers (AWS AgentCore) require exactly the
// info+schema keys, so emit nothing else.
function buildBazaarExtension(bazaarMeta?: BazaarMeta) {
  const method = ((bazaarMeta as { method?: string } | undefined)?.method ?? 'GET').toUpperCase();
  const isBody = method === 'POST' || method === 'PUT' || method === 'PATCH';
  const exampleParams: Record<string, string> = {};
  const schemaProps: Record<string, unknown> = {};
  const required: string[] = [];
  const rawParams = (bazaarMeta?.queryParams ?? {}) as Record<
    string,
    string | { type?: string; description?: string; example?: string; required?: boolean }
  >;
  for (const [k, v] of Object.entries(rawParams)) {
    if (typeof v === 'string') {
      exampleParams[k] = v;
      schemaProps[k] = { type: 'string' };
    } else {
      if (v.example !== undefined) exampleParams[k] = v.example;
      schemaProps[k] = { type: v.type || 'string', ...(v.description ? { description: v.description } : {}) };
      if (v.required) required.push(k);
    }
  }
  const paramsSchema = {
    type: 'object',
    properties: schemaProps,
    ...(required.length ? { required } : {}),
  };
  const outputExample = bazaarMeta?.outputExample;
  // Documented error responses (CDP Bazaar curation gate): carried in info.output.errors —
  // additive, passes @x402/extensions validateDiscoveryExtension (verified 2026-08-23). The
  // fleet-standard set matches actual route behavior (param validation BEFORE the payment
  // gate; paid 5xx = credit policy); routes may override via bazaarMeta.errorResponses.
  const errorResponses = bazaarMeta?.errorResponses ?? {
    '400': {
      description: (required.length
        ? `Invalid or missing parameter(s) — required: ${required.join(', ')}. `
        : 'Invalid or missing parameter(s). ')
        + 'Returned before the payment gate on paid requests, so a malformed call is never charged. JSON body: { error: <what is wrong and how to fix it> } plus usage hints.',
      example: { error: required.length ? `${required[0]} parameter required` : 'invalid request' },
    },
    '402': {
      description: 'Payment required — x402 v2 challenge; the accepts array lists scheme, network, and amount. Retry the same request with a PAYMENT-SIGNATURE (v2) or X-PAYMENT (v1) header. Verification is free.',
    },
    '500': {
      description: 'Unexpected server error. If a payment settled without a usable result, contact info@theaslangroupllc.com with the settlement tx hash for a re-run or credit.',
      example: { error: 'upstream_failed' },
    },
  };
  return {
    info: {
      input: isBody
        ? { type: 'http', method, bodyType: 'json', body: exampleParams }
        : { type: 'http', method, queryParams: exampleParams },
      output: {
        type: 'json',
        ...(outputExample ? { example: outputExample } : {}),
        errors: errorResponses,
      },
    },
    schema: {
      '$schema': 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        input: {
          type: 'object',
          properties: {
            type: { type: 'string', const: 'http' },
            method: { type: 'string', enum: isBody ? ['POST', 'PUT', 'PATCH'] : ['GET', 'HEAD', 'DELETE'] },
            ...(isBody
              ? { bodyType: { type: 'string', enum: ['json', 'form-data', 'text'] }, body: paramsSchema }
              : { queryParams: paramsSchema }),
          },
          required: isBody ? ['type', 'method', 'bodyType', 'body'] : ['type', 'method'],
          additionalProperties: false,
        },
        output: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            example: { type: 'object' },
            errors: {
              type: 'object',
              description: 'Documented error responses, keyed by HTTP status code',
              additionalProperties: {
                type: 'object',
                properties: { description: { type: 'string' }, example: { type: 'object' } },
                required: ['description'],
              },
            },
          },
          required: ['type'],
        },
      },
      required: ['input'],
    },
  };
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


// ---- x402 v1 back-compat (2026-08-18) ----
// v2 clients (@x402/fetch, @x402/axios, @x402/core) read the PAYMENT-REQUIRED header first and
// only fall back to a body whose x402Version === 1. Legacy v1 clients (x402-fetch 1.x /
// x402-axios 1.x — ~24k installs/wk on 2026-08-18, zero v2 awareness, NOT npm-deprecated) read
// ONLY the body and hard-fail zod parsing on v2 vocabulary (amount vs maxAmountRequired, CAIP-2
// vs bare network name) — the buyer sees a generic parse error and never reaches a code path we
// log. So: header = v2 challenge, body = v1 challenge → both populations can pay. Server side
// accepts the legacy X-PAYMENT header alongside PAYMENT-SIGNATURE and verifies/settles v1
// payloads with the SAME CDP facilitator (its /supported lists x402Version 1 for base + solana,
// probed 2026-08-18). Only BASE is advertised in the v1 body: the v1 Base settle is E2E-proven
// (x402-fetch@1.2.0, 2026-08-18); a v1 Solana settle is not, and x402 <1.1 clients zod-parse EVERY
// accepts entry with an enum that lacks 'solana' (an unproven lane would break them all). Add
// SOLANA_NETWORK: 'solana' here only after a real v1 Solana settle. Known limitation: settlement receipt is returned as PAYMENT-RESPONSE
// (v2 header name); v1 helpers looking for X-PAYMENT-RESPONSE simply see no receipt — the paid
// body is still delivered. Surfaced by an external conformance sweep (VerityLayer, 2026-08-17).
const V1_NETWORK_NAMES: Record<string, string> = { [BASE_NETWORK]: 'base' };

// ---- x402 402 body dialect (2026-10-19) ----
// Default v2: the 402 body carries the SAME PaymentRequired as the PAYMENT-REQUIRED header. The v1
// body above served legacy x402-fetch 1.x; by 2026-10 those are ~10% of client installs and paid
// $0.02 in October, while body-only v2 readers (t54 x402-xrpl 0.3.x, the reference XRP Ledger
// client; the Weighmaster grader) saw no XRPL lane at all — reported by Brük (brukledger.com)
// 2026-10-18. The official @x402/core client reads the header first and only falls back to a v1
// body, so it is unaffected. X-PAYMENT (v1) settlement below stays accepted for anyone who has the
// terms. Set X402_BODY_DIALECT=v1 on a project to restore the legacy body with no code change.
const X402_BODY_DIALECT: 'v1' | 'v2' = process.env.X402_BODY_DIALECT === 'v1' ? 'v1' : 'v2';

type V1Requirement = {
  scheme: string; network: string; maxAmountRequired: string; resource: string; description: string;
  mimeType: string; payTo: string; maxTimeoutSeconds: number; asset: string; extra?: Record<string, unknown>;
};

function buildV1Accepts(reqs: PaymentRequirements[], resourceUrl: string, description: string): V1Requirement[] {
  const out: V1Requirement[] = [];
  for (const r of reqs) {
    const name = V1_NETWORK_NAMES[r.network];
    if (!name) continue;
    // One lane per v1 network, and never the Circle Gateway Base lane (v1 clients cannot sign a
    // GatewayWalletBatched domain) — the vanilla USDC entry is first in allReqs, so it wins.
    if ((r.extra as { name?: unknown } | undefined)?.name === 'GatewayWalletBatched') continue;
    if (out.some(o => o.network === name)) continue;
    out.push({
      scheme: r.scheme, network: name, maxAmountRequired: r.amount, resource: resourceUrl, description,
      mimeType: 'application/json', payTo: r.payTo, maxTimeoutSeconds: r.maxTimeoutSeconds, asset: r.asset,
      extra: r.extra as Record<string, unknown> | undefined,
    });
  }
  return out;
}

type V1PaymentPayload = { x402Version: 1; scheme: string; network: string; payload: Record<string, unknown> };
function decodeV1PaymentHeader(h: string): V1PaymentPayload | undefined {
  try {
    const j = JSON.parse(Buffer.from(h, 'base64').toString('utf8'));
    if (j && j.x402Version === 1 && typeof j.scheme === 'string' && typeof j.network === 'string' && j.payload && typeof j.payload === 'object') return j as V1PaymentPayload;
  } catch { /* not a v1 header */ }
  return undefined;
}
// ---- end v1 back-compat helpers ----

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
  const [solanaExtra, algorandExtra] = await Promise.all([getSolanaExtra(facilitator), getAlgorandExtra()]);
  const allReqs = buildRequirements(amount, solanaExtra, algorandExtra);
  const resourceUrl = buildResourceUrl(reqHeaders, rawUrl);

  const paymentRequired = {
    x402Version: 2,
    accepts: allReqs,
    resource: {
      url: resourceUrl,
      description,
      mimeType: 'application/json',
      serviceName: 'PulseNetwork',
      // CDP catalog validator hard-caps tags at 5 (probed via listing-doctor 2026-07-27);
      // more than 5 fails tags_valid and blocks Bazaar/agentic.market listing.
      tags: tags.slice(0, 5),
      // Facilitator-side sanitizer drops an invalid iconUrl without affecting the listing.
      iconUrl: 'https://pulse.theaslangroupllc.com/logo.svg',
    },
    extensions: {
      bazaar: buildBazaarExtension(bazaarMeta),
      'builder-code': BUILDER_CODE_EXTENSION,
    },
  } as unknown as PaymentRequired;

  // Body dialect: v2 by default (the same terms as the header); v1 only when X402_BODY_DIALECT=v1. See helpers.
  const v1Accepts = buildV1Accepts(allReqs, resourceUrl, description);
  const challenge402 = {
    ok: false as const,
    status: 402,
    body: X402_BODY_DIALECT === 'v1'
      ? { x402Version: 1, error: 'X-PAYMENT header is required', accepts: v1Accepts }
      : { ...(paymentRequired as unknown as Record<string, unknown>), error: 'PAYMENT-SIGNATURE header is required' },
    headers: { 'PAYMENT-REQUIRED': encodePaymentRequiredHeader(paymentRequired) },
  };

  const paymentSig = getHeader(reqHeaders, 'payment-signature');
  const xPayment = paymentSig ? undefined : getHeader(reqHeaders, 'x-payment');

  if (!paymentSig && !xPayment) {
    return challenge402;
  }
  // Replay-ledger key: the exact signed header the buyer sent, whichever dialect.
  const paymentSigKey = (paymentSig ?? xPayment) as string;

  let paymentPayload: ReturnType<typeof decodePaymentSignatureHeader>;
  let v1Req: V1Requirement | undefined;
  if (paymentSig) {
    try {
      paymentPayload = decodePaymentSignatureHeader(paymentSig);
    } catch {
      return challenge402;
    }
  } else {
    const v1 = decodeV1PaymentHeader(xPayment as string);
    if (!v1) return challenge402;
    v1Req = v1Accepts.find(a => a.scheme === v1.scheme && a.network === v1.network);
    if (!v1Req) {
      return { ...challenge402, body: { ...challenge402.body, error: `unsupported v1 network ${v1.network}; accepted: ${v1Accepts.map(a => a.network).join(', ')}` } };
    }
    // Cast: the facilitator client is a passthrough (x402Version taken from the payload itself).
    paymentPayload = v1 as unknown as typeof paymentPayload;
  }

  // Idempotent retry (2026-08-17): if this EXACT signed payment already settled for this EXACT
  // URL within the replay window, a verify/settle failure below is a transport retry of a paid
  // request (EIP-3009 nonce already consumed), not a new payment attempt. Serve it as paid —
  // usually straight from paid-cache — instead of 402'ing a buyer who already paid. logSale is
  // intentionally NOT repeated (the original settle already logged the sale).
  const replayPaid = async (): Promise<PaymentGateResult | undefined> => {
    const entry = await replayLedgerLookup(paymentSigKey, rawUrl);
    if (!entry) return undefined;
    if (process.env.PULSE_PRIME_KEY && getHeader(reqHeaders, 'x-prime-key') === process.env.PULSE_PRIME_KEY) {
      return { ok: false, status: 200, body: { primed: true }, headers: { 'PAYMENT-RESPONSE': entry.settlementHeader } };
    }
    const cachedBody = await paidCacheLookup(rawUrl, reqHeaders);
    if (cachedBody !== undefined) {
      return {
        ok: false,
        status: 200,
        body: cachedBody,
        headers: { 'PAYMENT-RESPONSE': entry.settlementHeader, 'Cache-Control': 'private, no-store' },
      };
    }
    // Recompute (full handler) costs real money, so it is strictly bounded:
    // - Body-bearing retries never reach it. The ledger binds only the URL, so a replayed
    //   header with a NEW body would buy a fresh paid computation on attacker-chosen input.
    //   Those degrade to the normal 402 — never free recompute.
    // - One payment funds at most one recompute: the entry is consumed before the handler
    //   runs. Later retries are served from paid-cache (populated by that run) or 402.
    if (requestHasBody(reqHeaders)) return undefined;
    if (entry.consumed) return undefined;
    await replayLedgerConsume(paymentSigKey, entry);
    return { ok: true, settlementHeader: entry.settlementHeader };
  };

  // v1 payments verify/settle against the v1-shaped requirement (bare network name, maxAmountRequired) —
  // the CDP facilitator dispatches on x402Version and expects v1 vocabulary for a v1 payload.
  const reqs = v1Req ? (v1Req as unknown as PaymentRequirements) : adoptXrplInvoice(selectRequirement(allReqs, paymentPayload), paymentPayload);
  // GoPlausible requires the full-hash Algorand network id in the verify/settle envelope; the
  // signed AVM transaction carries the real genesis hash intrinsically, so swapping the routing
  // string is safe and does not invalidate the signature.
  const facReqs: PaymentRequirements = reqs.network === ALGORAND_NETWORK ? { ...reqs, network: ALGORAND_NETWORK_FACILITATOR as `${string}:${string}` } : reqs;

  let verifyResult;
  try {
    verifyResult = await facilitatorFor(reqs.network, facilitator).verify(paymentPayload, facReqs);
  } catch (err) {
    const rp = await replayPaid();
    if (rp) return rp;
    return {
      ok: false,
      status: 402,
      body: { error: 'verification_failed', detail: String(err) },
      headers: {},
    };
  }

  if (!verifyResult.isValid) {
    const rp = await replayPaid();
    if (rp) return rp;
    return {
      ok: false,
      status: 402,
      body: { error: 'payment_invalid', reason: verifyResult.invalidReason },
      headers: {},
    };
  }

  let settleResult;
  try {
    settleResult = await facilitatorFor(reqs.network, facilitator).settle(paymentPayload, facReqs);
  } catch (err) {
    const rp = await replayPaid();
    if (rp) return rp;
    return {
      ok: false,
      status: 402,
      body: { error: 'settlement_failed', detail: String(err) },
      headers: {},
    };
  }

  if ((settleResult as { success?: boolean } | null)?.success === false) {
    const reason = (settleResult as { errorReason?: string }).errorReason ?? 'unknown';
    // settlement_pending (x402-foundation/x402 #3083, live in facilitator SDKs since
    // 2026-08-17): the payment tx WAS broadcast with a valid hash but the facilitator's
    // receipt-wait failed. The tx almost certainly confirms; a 402 here sends the buyer into
    // a retry whose nonce is already consumed on-chain = charged, got nothing. Deliver and
    // let PAYMENT-RESPONSE carry the hash. Worst case (tx drops) is one free response,
    // bounded by the endpoint price; the buyer-harm branch is a paid error.
    const txHash = (settleResult as { transaction?: string }).transaction;
    const pendingDeliverable = reason === 'settlement_pending' && typeof txHash === 'string' && /^0x[0-9a-fA-F]{64}$/.test(txHash);
    if (!pendingDeliverable) {
      console.error('[FAIL] x402_settle_reported_failure', { url: rawUrl.split('?')[0], network: reqs.network, reason });
      const rp = await replayPaid();
      if (rp) return rp;
      return {
        ok: false,
        status: 402,
        body: { error: 'settlement_failed', reason },
        headers: {},
      };
    }
    console.error('[WARN] x402_settlement_pending_delivered', { url: rawUrl.split('?')[0], network: reqs.network, txHash });
  }

  // Payment definitively settled: open the replay window for transport retries of this exact
  // signed payment against this exact URL. Fire-and-forget — the ledger is best-effort and
  // must not add a cache round-trip to the happy path.
  void replayLedgerRecord(paymentSigKey, rawUrl, encodePaymentResponseHeader(settleResult)).catch(() => { /* best-effort */ });

  // Bazaar priming: payment has settled above. If the secret prime header is present,
  // skip synthesis (Tavily/Claude) to avoid compute cost. Real users never send this header.
  if (getHeader(reqHeaders, "x-prime-key") === "pnprime_k7Qz3mV9xR2wL5tB") {
    return { ok: false, status: 200, body: { primed: true }, headers: { "PAYMENT-RESPONSE": encodePaymentResponseHeader(settleResult) } };
  }
  const cachedBody = await paidCacheLookup(rawUrl, reqHeaders);
  if (cachedBody !== undefined) {
    await logSale(reqHeaders, rawUrl, amount, settleResult as unknown as Record<string, unknown>);
    return {
      ok: false,
      status: 200,
      body: cachedBody,
      headers: {
        'PAYMENT-RESPONSE': encodePaymentResponseHeader(settleResult),
        'Cache-Control': 'private, no-store',
      },
    };
  }
  await logSale(reqHeaders, rawUrl, amount, settleResult as unknown as Record<string, unknown>);
  return { ok: true, settlementHeader: encodePaymentResponseHeader(settleResult) };
}
