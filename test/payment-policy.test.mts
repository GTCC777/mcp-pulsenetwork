/**
 * Money-safety regressions for the outbound x402 payer policy.
 *
 * Before this policy, buildPaymentFetch signed whatever amount / asset /
 * recipient any endpoint's live 402 named — the exact "a preflight authorizes
 * nothing; pin the asset; bind the cap to the signed challenge" scar. These
 * cases lock the pins in.
 *
 *   npx tsx --test test/payment-policy.test.mts
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPaymentPolicy,
  DEFAULT_MAX_PAYMENT_ATOMIC,
  EXPECTED_ASSET,
  EXPECTED_PAY_TO,
  resolveMaxPaymentAtomic,
} from '../lib/payment-policy.js';

const LIVE = {
  scheme: 'exact',
  network: 'eip155:8453',
  asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  amount: '15000',
  payTo: '0x50ab2018c06c6E4eAA9BA52057Eb55eD284912fc',
  maxTimeoutSeconds: 300,
  extra: { name: 'USD Coin', version: '2' },
} as any;

const policy = buildPaymentPolicy(DEFAULT_MAX_PAYMENT_ATOMIC);

test('accepts the live Base USDC option, drops a Solana sibling', () => {
  const solana = { ...LIVE, network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' };
  assert.deepEqual(policy(2, [LIVE, solana]), [LIVE]);
});

test('rejects a swapped recipient', () => {
  assert.deepEqual(policy(2, [{ ...LIVE, payTo: '0x1111111111111111111111111111111111111111' }]), []);
});

test('rejects a swapped asset (8-decimal-token attack)', () => {
  assert.deepEqual(policy(2, [{ ...LIVE, asset: '0x2222222222222222222222222222222222222222' }]), []);
});

test('rejects an amount above the cap', () => {
  assert.deepEqual(policy(2, [{ ...LIVE, amount: (DEFAULT_MAX_PAYMENT_ATOMIC + 1n).toString() }]), []);
});

test('accepts an amount exactly at the cap', () => {
  assert.equal(policy(2, [{ ...LIVE, amount: DEFAULT_MAX_PAYMENT_ATOMIC.toString() }]).length, 1);
});

test('rejects non-exact schemes and wrong EVM networks', () => {
  assert.deepEqual(policy(2, [{ ...LIVE, scheme: 'upto' }]), []);
  assert.deepEqual(policy(2, [{ ...LIVE, network: 'eip155:1' }]), []);
});

test('rejects malformed amounts', () => {
  for (const amount of ['-1', '0.5', '0x10', '', '1e6']) {
    assert.deepEqual(policy(2, [{ ...LIVE, amount }]), [], amount);
  }
});

test('rejects a batched-gateway domain and non-eip3009 transfer methods', () => {
  assert.deepEqual(policy(2, [{ ...LIVE, extra: { name: 'GatewayWalletBatched', version: '1' } }]), []);
  assert.deepEqual(policy(2, [{ ...LIVE, extra: { name: 'USD Coin', version: '2', assetTransferMethod: 'permit2' } }]), []);
});

test('rejects out-of-bounds authorization windows', () => {
  assert.deepEqual(policy(2, [{ ...LIVE, maxTimeoutSeconds: 0 }]), []);
  assert.deepEqual(policy(2, [{ ...LIVE, maxTimeoutSeconds: 3601 }]), []);
  assert.equal(policy(2, [{ ...LIVE, maxTimeoutSeconds: 3600 }]).length, 1);
});

test('pins match the fleet constants', () => {
  assert.equal(LIVE.asset.toLowerCase(), EXPECTED_ASSET);
  assert.equal(LIVE.payTo.toLowerCase(), EXPECTED_PAY_TO);
});

test('cap resolves and fails closed on bad values', () => {
  assert.equal(resolveMaxPaymentAtomic({} as NodeJS.ProcessEnv), DEFAULT_MAX_PAYMENT_ATOMIC);
  assert.equal(resolveMaxPaymentAtomic({ MCP_MAX_PAYMENT_USD: '0.05' } as any), 50_000n);
  for (const bad of ['0', '-1', 'abc', '$2']) {
    assert.throws(() => resolveMaxPaymentAtomic({ MCP_MAX_PAYMENT_USD: bad } as any), undefined, bad);
  }
});
