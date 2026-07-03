---
name: pulsenetwork
description: "Pay-per-query access to 68 specialized intelligence APIs via x402 (USDC on Base or Solana, no API keys, no subscription). Use this skill when an agent needs a paid data/intelligence endpoint, especially for token-safety / honeypot / rugpull scanning before a trade (Solana memecoins via mint address, EVM tokens via contract on Base/Ethereum/BSC/Arbitrum/Polygon/Optimism/Avalanche), crypto security and wallet-risk checks, DeFi yield/APY intelligence, sports and fantasy predictions and prediction-market edges (NFL/NBA/MLB/golf/racing, Polymarket/Kalshi), insurance estimates, immigration and visa scoring, real-estate, legal letters, clinical/medical intel, careers/salary, travel, and dozens more domains. Each call returns structured JSON for roughly $0.015 to $1.00. Trigger when the user asks whether a token is safe / a honeypot / a rug, to scan a contract, for the best NFL pick or fantasy start-sit, for DeFi yield, or any question better answered by a live paid data API than by training knowledge. Two ways to call: the PulseNetwork MCP server, or direct x402 HTTP."
metadata:
  homepage: https://mcp-pulsenetwork.vercel.app
  settlement: x402 USDC on Base (eip155:8453) and Solana mainnet
  auth: none (pay-per-call)
---

# PulseNetwork

PulseNetwork is an x402-native network of **68 intelligence verticals / 675 paid endpoints**. Agents pay per query in USDC (Base or Solana) — no API keys, no accounts, no subscription. Every endpoint returns structured JSON.

There are **two integration paths**. Use the hosted MCP server inside Claude Desktop/Code/Cursor, or call any endpoint directly over x402 HTTP from any agent or language.

## When to use this skill

- Pre-trade **token safety**: "is this a honeypot / rug?", "scan this Solana mint", "check this Base token contract"
- **Crypto security / DeFi**: wallet-risk & custody checks, malicious-address screening, DeFi yield/APY by chain & risk
- **Sports & prediction markets**: best NFL/NBA/MLB pick, fantasy start-sit / lineup / waiver, golf/racing boards, Polymarket/Kalshi/Manifold/PredictIt edges
- **Other domains**: insurance estimates, immigration/visa points, real-estate, legal letters, clinical pipelines, salaries, travel, and dozens more (finance, health, law, careers, sustainability — see the full catalog)
- Any task where a **live paid data API** beats answering from training knowledge

## Flagship endpoints (call these directly)

| Capability | Endpoint | Price | Example |
|---|---|---|---|
| Solana memecoin safety | `GET onchainpulse-nine.vercel.app/api/memecoin?mint=<base58>` | $0.015 | `?mint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263` (BONK) |
| EVM token safety | `GET onchainpulse-nine.vercel.app/api/evmtoken?address=<addr>&chain=base` | $0.015 | `?address=0x532f27101965dd16442E59d40670FaF5eBB142E4&chain=base` |
| Sports analysis | `GET signalpulse-peach.vercel.app/api/scan/game?sport=nfl` | $1.00 | `?sport=nfl` |
| Fantasy advice | `GET signalpulse-peach.vercel.app/api/scan/fantasy?sport=nfl&mode=start-sit` | $1.00 | start-sit / lineup / waiver / trade |
| Prediction-market read | `GET signalpulse-peach.vercel.app/api/scan/predmarket?category=sports&horizon=mid` | $2.00 | category: sports/crypto/economics/geopolitics/politics/esports |
| Crypto / market / FX scan | `GET signalpulse-peach.vercel.app/api/scan/crypto` or `/api/scan/market` | $2.00 | de-vigged, calibrated synthesis reads |
| FREE sample | `GET signalpulse-peach.vercel.app/api/scan/sample` | FREE | pick-of-the-day, no payment, no key |

Discover the full catalog (all 68 verticals, 675 endpoints) at **https://mcp-pulsenetwork.vercel.app**, its **/llms.txt**, or each vertical's own `/openapi.json` and `/.well-known/agent.json`.

## Path 1 — Hosted MCP (no install)

Point any Streamable-HTTP MCP client at:

```
https://mcp-pulsenetwork.vercel.app/mcp
```

Fund the configured wallet with a few dollars of USDC on Base and every vertical below is callable as an MCP tool.

## Path 2 — Local MCP server (Claude Desktop / Code / Cursor)

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

## Path 3 — Direct x402 HTTP (any agent / language)

x402 is a standard 402 → pay → retry flow. No key, no signup.

1. **GET** the endpoint with no payment header → server replies **HTTP 402** with an `accepts` array advertising both Base and Solana USDC options, the `amount`, and the `payTo` address.
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

const res = await fetch402('https://onchainpulse-nine.vercel.app/api/memecoin?mint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
console.log(await res.json()); // { verdict: "CLEAR" | "CAUTION" | "AVOID", risk_score, evidence, ... }
```

Solana works the same way via `@x402/svm` (`ExactSvmScheme`) — the 402 response advertises a Solana USDC option too.

## Discovery surfaces

PulseNetwork is indexed on the **CDP x402 Bazaar** (`api.cdp.coinbase.com/platform/v2/x402/discovery`), **x402scan**, and ships per-vertical `/openapi.json`, `/llms.txt`, and `/.well-known/agent.json`. The hub at **https://mcp-pulsenetwork.vercel.app** lists every vertical and endpoint with params and live pricing.

## Earn with PulseNetwork

Building an agent that should make money, not just spend it? Two self-serve paths, no approval queue: **affiliate** (zero-build) — register free at `mcp-pulsenetwork.vercel.app/affiliates`, append `?ref=CODE` to any Pulse link you route, earn 25-30% of referred paid calls in USDC. **Wholesale reseller** (low-build) — mint a prepaid key at `mcp-pulsenetwork.vercel.app/wholesale` ($0.25 free trial), call any endpoint at 50% of retail via `x-internal-key`, keep the spread. Unsure which fits? Call the free `GET /api/ideas`.

## Pricing

Per-call, in USDC, no subscription, no minimums, pay only for what you call:

- Token-safety scanners (Solana memecoin, EVM honeypot/rug): **$0.015**
- Most core verticals (finance, health, law, travel, real estate, careers, etc.): **$0.07–$0.15**
- SignalPulse racing/h2h/player reads: **$0.50**
- SignalPulse game/fantasy/ask/golf/compare reads: **$1.00**
- SignalPulse prediction-market and deep crypto/FX/macro synthesis: **$2.00**
- Free daily sample: **FREE** (`signalpulse-peach.vercel.app/api/scan/sample`)
