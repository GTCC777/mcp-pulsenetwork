# Hire the Fleet — agent contract

Give PulseNetwork a bounded task, get a deterministic quote, pay via x402, receive the finished work product in the paid response body. No account, no API key, no negotiation loop. Human page: [/hire](https://pulse.theaslangroupllc.com/hire).

## Flow (3 steps, synchronous)

1. **Quote (free, deterministic — no LLM in the quote path):**
   ```bash
   curl -s -X POST https://pulse.theaslangroupllc.com/api/hire/quote \
     -H 'Content-Type: application/json' \
     -d '{"task_type":"vendor-dd-memo","company_or_token":"Acme Corp","country":"DE"}'
   ```
   Returns `{ price_usd, x402_amount, eta_seconds, normalized_input, pay_at }` or a 400 with `declined: true` and the exact reason. Call with no `task_type` to get the full menu with live availability.

2. **Pay:** call `pay_at` with the same inputs (GET query params or POST JSON body both work) with no payment header → HTTP 402 with an x402 v2 `accepts[]` (USDC on Base default; Solana and 9 more rails advertised). Sign one option, retry the identical request with `PAYMENT-SIGNATURE`.

3. **Receive:** the deliverable is the 200 response body (JSON with a `markdown` field). Tasks run synchronously — budget up to `eta_seconds[1]` (max 280s) for the response; set your HTTP timeout ≥ 300s.

## Task menu (v1)

### prospect-ledger — $25.00
Ranked B2B prospect research. Input: `thesis` (80-1000 chars — what you sell and why a prospect cares), `target_profile` (10-500 chars), optional `region`, `count` (5-15, default 10). Output: per prospect — who (company + role), why-they-fit evidence with **machine-verified source URLs** (every cited URL is existence-checked at delivery; failing prospects ship labeled `unverified`, never silently), one public BUSINESS contact route, one tailored research-style opening question, confidence tier.

### vendor-dd-memo — $5.00
Counterparty due diligence, deterministic composition of live engines (no generative synthesis): OFAC sanctions screen (alias-aware) + GLEIF legal-entity lookup + media-narrative-vs-court-record. Pass a token contract address / Solana mint as `company_or_token` (with optional `chain`) to get a deterministic on-chain token-safety verdict instead of the entity checks. Every section carries its own source status in a coverage block — a failed source is reported as MISSING, never as clean.

### market-entry-brief — $10.00
Sector × country expansion brief: country-risk assessment + sector supply-chain geopolitical risk + regulatory applicability preview + global macro regime context. Pass `home_country` for bilateral trade-tension analysis. Same honest coverage block.

## Hard rules (enforced in code, not prompts)

- **We never send anything.** Deliverables are research memos. No outreach, no emails, no form-fills, no webhooks to third parties — the execution path has no send capability.
- **Public business contacts only.** A code-level filter strips personal email domains and anything phone-shaped from deliverables before they reach you.
- **Declined before payment:** consumer-targeted lists, protected-class targeting, and anything reading as harassment, doxxing, or deceptive outreach return 400 with the reason — you are never charged for a declined task.
- **Citation gate:** prospect-ledger source URLs are existence-checked in code at delivery time. Unverifiable claims are labeled, not laundered.

## Billing semantics

- Quotes and declined inputs (400): never charged.
- prospect-ledger while its research engine is unprovisioned: 503 before any 402 is issued — never charged.
- Payment settles before execution. If execution then fails (5xx), the response says so plainly and the [paid-error policy](https://pulse.theaslangroupllc.com/terms.html) applies: retry the identical request, or email info@theaslangroupllc.com with your payment tx hash for a credit.
- Each delivery is a fresh charge — there is no idempotency store in v1. Identical GET requests within a short window may be served from a post-settle response cache (you are still charged; you just skip the recompute wait).
- Responses are `Cache-Control: private, no-store`. You bought the response, not redistribution rights ([terms](https://pulse.theaslangroupllc.com/terms.html)).

## Discovery

Menu JSON: `POST /api/hire/quote` (no body) · Full fleet catalog: [/.well-known/pulse-catalog.json](https://pulse.theaslangroupllc.com/.well-known/pulse-catalog.json) · [/llms.txt](https://pulse.theaslangroupllc.com/llms.txt) · [/agents.md](https://pulse.theaslangroupllc.com/agents.md) · [/skill.md](https://pulse.theaslangroupllc.com/skill.md)

Humans: info@theaslangroupllc.com · Operated by The Aslan Group LLC.
