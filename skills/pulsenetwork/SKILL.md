---
name: pulsenetwork
description: "Pay-per-query access to 68 intelligence APIs via x402 (real USDC charges on Base or Solana per call, no API keys, no subscription, no refunds). Use when an agent needs live paid data instead of training knowledge: pre-trade token-safety scans (Solana memecoin / EVM honeypot-rug checks by mint or contract address across Base/Ethereum/BSC/Arbitrum/Polygon/Optimism/Avalanche), crypto wallet-risk and DeFi yield intelligence, sports/fantasy picks and prediction-market edges (NFL/NBA/MLB/golf/racing, Polymarket/Kalshi), insurance, immigration/visa, real-estate, legal letters, clinical intel, careers, travel, and more. Each call costs $0.015-$2.00 in USDC and returns structured JSON. Trigger on: \"is this token a rug/honeypot\", \"scan this contract\", \"best NFL pick\", \"fantasy start-sit\", \"DeFi yield\", or any question better served by a live paid API. Calls the hosted PulseNetwork MCP server or raw x402 HTTP; requires a funded USDC wallet - no free tier except one daily sample."
metadata:
  homepage: https://pulse.theaslangroupllc.com
  settlement: x402 USDC on Base (eip155:8453) and Solana mainnet
  auth: none (pay-per-call)
---

# PulseNetwork

PulseNetwork is an x402-native network of **68 intelligence verticals / 733 paid endpoints**. Agents pay per query in USDC (Base or Solana) — no API keys, no accounts, no subscription. Every endpoint returns structured JSON.

There are **two integration paths**. Use the MCP server inside Claude Desktop/Code/Cursor; use direct x402 HTTP from any agent or language.

## When to use this skill

- Pre-trade **token safety**: "is this a honeypot / rug?", "scan this Solana mint", "check this Base token contract"
- **Crypto security / DeFi**: wallet-risk & custody checks, malicious-address screening, DeFi yield/APY by chain & risk
- **Sports & prediction markets**: best NFL/NBA/MLB pick, fantasy start-sit / lineup / waiver, golf/racing boards, Polymarket/Kalshi edges
- **Other domains**: insurance estimates, immigration/visa points, real-estate, legal letters, clinical pipelines, salaries, travel, and more
- Any task where a **live paid data API** beats answering from training knowledge

## Flagship endpoints (call these directly)

| Capability | Endpoint | Price | Example |
|---|---|---|---|
| Solana memecoin safety | `GET onchainpulse.theaslangroupllc.com/api/memecoin?mint=<base58>` | $0.015 | `?mint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263` (BONK) |
| EVM token safety | `GET onchainpulse.theaslangroupllc.com/api/evmtoken?address=<addr>&chain=base` | $0.015 | `?address=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed&chain=base` (DEGEN) |
| Crypto security / wallet-risk | `GET cryptopulse-xi-five.vercel.app/api/security?token=&address=&chain=` | $0.10 | `?token=DEGEN&chain=base` |
| DeFi yield intelligence | `GET cryptopulse-xi-five.vercel.app/api/yield?chain=&risk=` | $0.10 | `?chain=base&risk=moderate` |
| Sports analysis | `GET signalpulse.theaslangroupllc.com/api/scan/game?sport=nfl` | $1.00 | `?sport=nfl` |
| Fantasy advice | `GET signalpulse.theaslangroupllc.com/api/scan/fantasy?sport=nfl&mode=start-sit` | $1.00 | start-sit / lineup / waiver / trade |
| Prediction-market read | `GET signalpulse.theaslangroupllc.com/api/scan/predmarket?category=sports&horizon=mid` | $2.00 | category: sports/crypto/economics/geopolitics/politics/esports |
| Crypto / market synthesis | `GET signalpulse.theaslangroupllc.com/api/scan/crypto` or `/api/scan/market` | $2.00 | de-vigged, calibrated synthesis reads |
| FREE sample | `GET signalpulse.theaslangroupllc.com/api/scan/sample` | FREE | pick-of-the-day, no payment |

Discover the full catalog (all 68 verticals, 733 endpoints) at **https://pulse.theaslangroupllc.com** or each vertical's `/openapi.json` and `/.well-known/agent.json`.

## Path 1 — MCP server (Claude Desktop / Code / Cursor)

Add to your MCP config and your agent gains all 68 verticals as tools that pay autonomously:

```json
{
  "mcpServers": {
    "pulsenetwork": {
      "command": "npx",
      "args": ["-y", "mcp-pulsenetwork"],
      "env": { "AGENT_PRIVATE_KEY": "<YOUR_BASE_WALLET_PRIVATE_KEY>" }
    }
  }
}
```

The wallet needs USDC on Base. Each tool call settles automatically via x402.

## Path 2 — Direct x402 HTTP (any agent / language)

x402 is a standard 402 → pay → retry flow. No key, no signup.

1. **GET** the endpoint with no payment header → server replies **HTTP 402** with an `accepts` array advertising both Base and Solana USDC, the `amount`, and the `payTo` address.
2. Sign a USDC payment for one of the advertised options (Base settlement is **gasless** — the facilitator sponsors gas).
3. **Retry** the same request with the `PAYMENT-SIGNATURE` header → server returns the JSON result.

Most x402 client libraries handle this in one wrapper. With the official `@x402/fetch`:

```js
import { wrapFetchWithPayment } from '@x402/fetch';
import { x402Client } from '@x402/core/client';
import { ExactEvmScheme } from '@x402/evm';
import { privateKeyToAccount } from 'viem/accounts';

const client = new x402Client();
client.register('eip155:8453', new ExactEvmScheme(privateKeyToAccount(process.env.PRIVATE_KEY)));
const fetch402 = wrapFetchWithPayment(fetch, client);

const res = await fetch402('https://onchainpulse.theaslangroupllc.com/api/memecoin?mint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
console.log(await res.json()); // { verdict: "CLEAR" | "CAUTION" | "AVOID", risk_score, evidence, ... }
```

Solana works the same way via `@x402/svm` (`ExactSvmScheme`) — the 402 advertises a Solana USDC option too.

## Discovery surfaces

PulseNetwork is indexed on the **CDP x402 Bazaar** (`api.cdp.coinbase.com/platform/v2/x402/discovery`), **x402scan**, and ships per-vertical `/openapi.json`, `/llms.txt`, and `/.well-known/agent.json`. The hub at **pulse.theaslangroupllc.com** lists every endpoint with params and pricing.

## Pricing

Per-call, in USDC, $0.015–$2.00 with no subscription and no minimums — pay only for what you call:

- Token-safety scanners (Solana memecoin, EVM honeypot/rug): **$0.015**
- Most core verticals (finance, health, law, travel, real estate, careers, etc.): **$0.07–$0.15**
- SignalPulse racing/h2h/player/forex/options/futures reads: **$0.50**
- SignalPulse game/fantasy/ask/golf/compare/event reads: **$1.00**
- SignalPulse prediction-market and deep crypto/market synthesis: **$2.00**
- Free daily sample: **FREE** (`signalpulse.theaslangroupllc.com/api/scan/sample`)
