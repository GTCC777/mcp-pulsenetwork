// Money-safety policy for the outbound x402 payer. Ported from the audited
// plugin-pulsenetwork client (2026-08-12 fleet payer sweep): a 402 challenge is
// attacker-influenceable input, so the client must pin WHAT it will ever sign —
// exact-scheme USDC on Base to PulseNetwork's own fleet wallet, at or under a
// per-call cap — BEFORE a payment is created. A non-conforming challenge yields
// a refusal, never a signature. Without this, buildPaymentFetch signed whatever
// amount/asset/recipient any endpoint's live 402 named.
import type { PaymentRequirements } from '@x402/core/types';

export const EXPECTED_SCHEME = 'exact';
export const EXPECTED_NETWORK = 'eip155:8453'; // Base mainnet
export const EXPECTED_ASSET = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'; // USDC on Base, lowercased
export const EXPECTED_PAY_TO = '0x50ab2018c06c6e4eaa9ba52057eb55ed284912fc'; // PulseNetwork fleet wallet, lowercased

/** Default per-call ceiling: $0.60 in atomic USDC (6 decimals). Catalog prices
 *  run $0.005–$0.50; this clears the most expensive endpoint while refusing
 *  anything absurd. Override with MCP_MAX_PAYMENT_USD. */
export const DEFAULT_MAX_PAYMENT_ATOMIC = 600_000n;

const MAX_PAYMENT_SETTING = 'MCP_MAX_PAYMENT_USD';

export class PaymentPolicyError extends Error {}

/**
 * A cap the operator set but got wrong must REFUSE paid calls, not silently
 * revert to the default — "0" or a typo reverting to $0.60 would move money
 * against explicit configuration. The default applies only when unset.
 */
export function resolveMaxPaymentAtomic(env: NodeJS.ProcessEnv = process.env): bigint {
  const raw = env[MAX_PAYMENT_SETTING];
  if (raw === undefined || raw === '') return DEFAULT_MAX_PAYMENT_ATOMIC;
  if (!/^\d+(\.\d+)?$/.test(raw.trim())) {
    throw new PaymentPolicyError(
      `${MAX_PAYMENT_SETTING} is set but not a plain positive number ("${raw.slice(0, 40)}"). ` +
        `Refusing all paid calls until it is fixed or unset.`,
    );
  }
  const usd = Number.parseFloat(raw.trim());
  if (!Number.isFinite(usd) || usd <= 0) {
    throw new PaymentPolicyError(`${MAX_PAYMENT_SETTING} is ${usd} — paid calls disabled. Unset to restore the $0.60 default.`);
  }
  return BigInt(Math.round(usd * 1_000_000));
}

/**
 * x402 PaymentPolicy: keeps only challenge options matching every pin AND
 * under the cap. An empty result makes the client refuse to pay — no signature
 * is produced for a rejected challenge. Scans the whole list (never returns on
 * the first network match) so an unsupported option listed first can't hide a
 * payable one.
 */
export function buildPaymentPolicy(maxAtomic: bigint) {
  return (_x402Version: number, requirements: PaymentRequirements[]): PaymentRequirements[] =>
    requirements.filter((req) => {
      if (req.scheme !== EXPECTED_SCHEME) return false;
      if (req.network !== EXPECTED_NETWORK) return false;
      if (typeof req.asset !== 'string' || req.asset.toLowerCase() !== EXPECTED_ASSET) return false;
      if (typeof req.payTo !== 'string' || req.payTo.toLowerCase() !== EXPECTED_PAY_TO) return false;
      if (typeof req.amount !== 'string' || !/^\d+$/.test(req.amount)) return false;
      if (BigInt(req.amount) > maxAtomic) return false;
      // Pin the EIP-712 domain to plain USDC EIP-3009 so a batched-gateway
      // variant in the same challenge can't switch what gets signed.
      const extra = (req.extra ?? {}) as Record<string, unknown>;
      if (extra.name !== 'USD Coin' || extra.version !== '2') return false;
      if (extra.assetTransferMethod !== undefined && extra.assetTransferMethod !== 'eip3009') return false;
      if (typeof req.maxTimeoutSeconds !== 'number' || req.maxTimeoutSeconds <= 0 || req.maxTimeoutSeconds > 3600) return false;
      return true;
    });
}
