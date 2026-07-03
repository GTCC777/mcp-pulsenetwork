// lib/wholesale.ts — shared helpers for the self-serve wholesale reseller program (prepaid
// billing v2). Used by api/wholesale/register.ts, stats.ts and deposit.ts. Reuses the exact
// Upstash key shapes hive/internal-auth.ts reads (`pn:wk:<key>` record, `pn:wk:bal:<key>` balance,
// `pn:wk:index` set) and the manual-mint CLI (hive/wholesale-key.mjs) already established — this
// module is the TypeScript-side equivalent of that CLI's mint logic, used by the Vercel functions.
import { randomBytes } from 'node:crypto';

const A_URL = process.env.PN_ANALYTICS_URL;
const A_TOKEN = process.env.PN_ANALYTICS_TOKEN;

export const TRIAL_BALANCE_MICRO = 250_000; // $0.25 free trial credit — ~30 calls at $0.0075 wholesale
export const DEFAULT_RATE = 0.5; // 50% of retail — the standard wholesale spread
export const STARTER_PER_MIN = 30;
export const STARTER_PER_DAY = 2000;

// Deposit tiers, in whole USD → micro-USD (USDC has 6 decimals; 1_000_000 micro = $1.00, matching
// the amount convention lib/x402.ts already uses for its `amount` strings).
export const DEPOSIT_TIERS_USD = [5, 25, 100] as const;
export type DepositTierUsd = (typeof DEPOSIT_TIERS_USD)[number];
export function tierToMicro(tier: number): number | null {
  return (DEPOSIT_TIERS_USD as readonly number[]).includes(tier) ? tier * 1_000_000 : null;
}

export function isConfigured(): boolean {
  return !!(A_URL && A_TOKEN);
}

/** POST a single-pipeline Upstash REST command batch. Throws on missing config or non-OK HTTP —
 *  callers are expected to catch and turn that into a 502/503, never a silent wrong answer. */
export async function pipe(cmds: Array<Array<string | number>>): Promise<unknown[]> {
  if (!A_URL || !A_TOKEN) throw new Error('PN_ANALYTICS_URL / PN_ANALYTICS_TOKEN not configured');
  const r = await fetch(`${A_URL}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${A_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error(`Upstash ${r.status}`);
  const j = (await r.json()) as { result: unknown }[];
  return j.map((x) => x.result);
}

const PREFIX_RE = /^[a-z0-9-]{1,20}$/;

/** Mint a new pk_live_ key. An optional builder-chosen prefix is cosmetic only (readability in
 *  their own logs/dashboards) — the random suffix is what actually makes the key unguessable. */
export function mintKey(desiredPrefix?: string): string {
  const prefix = desiredPrefix && PREFIX_RE.test(desiredPrefix) ? `${desiredPrefix}_` : '';
  return `pk_live_${prefix}${randomBytes(20).toString('hex')}`;
}

export interface WholesaleRecord {
  builder: string;
  scopes: string[];
  active: boolean;
  billing: 'prepaid';
  rate: number;
  rlPerMin: number;
  rlPerDay: number;
  note?: string;
  created: string;
  source: string;
  contact: string;
}

export const KEY_RE = /^pk_live_[a-z0-9_-]{6,80}$/i;
