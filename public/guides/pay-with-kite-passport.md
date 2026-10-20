# Pay for PulseNetwork APIs with Kite Agent Passport

*Published 2026-07-28 by Pulse Network. Works today — no waitlist, no integration.*

[Kite Agent Passport](https://agentpassport.ai) gives your AI agent (Claude Code, Codex,
Cursor, and others) a funded wallet with spending rules you approve by passkey. Its backend
speaks the x402 payment protocol and settles on the merchant's advertised network — and every
PulseNetwork endpoint advertises Base USDC and, for our Robinhood Chain suite, native USDG.
That means a Passport-equipped agent can pay any of our ~950 endpoints right now.

## Setup (once, ~3 minutes)

```bash
# 1. Install Kite's CLI + skills (their official installer)
curl -fsSL https://cli.gokite.ai/install.sh | bash

# 2. Sign up / log in (passwordless email + passkey), then fund with USDC
kpass login
# fund via the app: on-ramp or bridge — a few dollars goes far at $0.005–$0.35/call

# 3. Create a spending session your agent can use (you approve via passkey)
kpass agent:session create --assets USDC --per-tx-cap 0.50 --budget 5
```

## Call any PulseNetwork endpoint

```bash
# Token safety scan before a trade ($0.015):
kpass agent:session execute --url "https://onchainpulse.theaslangroupllc.com/api/evmtoken?address=0x532f27101965dd16442E59d40670FaF5eBB142E4&chain=base"

# Solana memecoin scan:
kpass agent:session execute --url "https://onchainpulse.theaslangroupllc.com/api/memecoin?mint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"

# Full due-diligence receipt ($0.35):
kpass agent:session execute --url "https://onchainpulse.theaslangroupllc.com/api/receipts?address=<TOKEN>&chain=base"
```

Your agent discovers what exists for free: every origin serves `/.well-known/x402` with full
resource metadata, the fleet index lives at
[pulse.theaslangroupllc.com/llms.txt](https://pulse.theaslangroupllc.com/llms.txt), and the
[@pulsenetwork/mcp](https://www.npmjs.com/package/@pulsenetwork/mcp) server adds free catalog
search (`pulse_discover`) to any MCP host.

## Why this pairing makes sense

Kite Passport solves the buyer side (identity, budget, receipts for what your agent spent).
PulseNetwork solves the seller side (what's actually worth paying for): deterministic token
safety verdicts on 10 chains, exit-depth, holder maps, claims-vs-chain receipts, and hundreds
of live data endpoints across finance, travel, sports, climate, health, and law. No API keys
on either side — payment is the authentication.

Also works with: OKX Agentic Wallet (X Layer USDT0), any standard x402 client
(`@x402/fetch`), and our own MCP server with built-in spend guardrails.

*Questions: info@theaslangroupllc.com · The Aslan Group LLC*
