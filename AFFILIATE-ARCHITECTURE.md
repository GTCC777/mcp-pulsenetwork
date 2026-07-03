# PulseNetwork Affiliate / Referral Architecture

**Goal:** let third-party agents & humans promote our x402/ACP endpoints and earn commission on
the revenue they drive — turning distribution (our #1 constraint) into an agent-powered growth
engine. Designed 2026-07-01, reusing the demand-analytics layer shipped the same day.

## Two models — support both

| Model | How they earn | Infra we need | Cost to us |
|---|---|---|---|
| **Reseller** (free, organic) | resells our endpoint at a markup, keeps the spread (what our own ACP seller already does) | none — just be a great cheap wholesale supplier | $0 |
| **Affiliate** (paid) | promotes with a **referral code**, earns X% of referred revenue | attribution + payout (this doc) | a rev-share, only on incremental sales |

## Core mechanic: attribution
A referral code must ride through a paid call and get logged with the sale. Three carriers, in
priority order:

- **A. HTTP header** `x-referral-code: ref_xxx` — simplest; works for x402 + ACP proxy calls.
- **B. Query param** `?ref=ref_xxx` — human/link-friendly fallback.
- **C. x402 `extensions` map** (part of the signed payment) — trustless, on-chain, the *same slot*
  we already use for the Base Builder Code `bc_gxy6qn5p`. This is the endgame (Phase 3).

### Capture = a small extension of TODAY's analytics layer
`lib/analytics.ts` `logSale()` already logs `{endpoint, amount, payer, tx, ts}` fleet-wide. Add:
read the ref code (header → param) and log it too, plus new Upstash keys:
- `pn:ref:rev:<code>`   — HINCRBYFLOAT referred revenue
- `pn:ref:count:<code>` — HINCRBY referred calls
- `pn:ref:buyers:<code>`— PFADD distinct referred buyers (HLL)
- `pn:sales` events gain a `ref` field.

Distributed the same way we shipped analytics: `hive/wire-analytics.mjs` → all 68 repos.

## Referrer registry
Upstash hash `pn:refcodes`: `ref_xxx → {wallet, name, rate, createdAt}`.
- MVP: we assign codes manually to pilot partners.
- Phase 2: self-serve signup (enter wallet → get code + promo link + dashboard).

## Commission + payout
- **Rate:** 20–30% of referred revenue (per-referrer configurable).
- **Anti-abuse:** exclude self-referral (referrer's own wallet as payer — we see payer wallets);
  cap/verify referrers; ignore prime/internal calls (already excluded from analytics).
- **Payout:**
  - MVP → scripted weekly USDC batch to referrer wallets (we control; trusted).
  - Phase 3 → atomic on-chain split at settlement via x402 extension / splitter contract (trustless).

## Reporting
- Extend `hive/analytics-report.mjs` with a **referrer leaderboard** (revenue / calls / distinct
  buyers per code) — reuses the readout we already built.
- Phase 2: per-referrer self-serve dashboard.

## Phased build
1. **Phase 1 — MVP:** analytics captures ref code + registry + leaderboard + manual payout script.
   Recruit 2–3 pilot affiliates (X crypto/sports-signal accounts). *This is the kickoff.*
2. **Phase 2:** self-serve signup + referrer dashboard + automated (cron) payouts.
3. **Phase 3:** on-chain rev-split via x402 `extensions` (trustless, Builder-Code-style).

## Strategic fit
- Directly attacks distribution — referrers become our sales force.
- Reuses the analytics substrate (near-zero incremental build for Phase 1).
- Pairs with the emerging trust/reputation layer (ERC-8004) — affiliates promote provably-good
  products and can prove their referred volume.

## Kickoff = one concrete step
Extend `lib/analytics.ts` to capture the referral code (header/param) → the attribution
foundation. Everything else (registry, leaderboard, payout) builds on that one hook. Fleet-wide
via the existing `wire-analytics.mjs`.
