---
name: pulsenetwork
description: "Pay-per-query access to 67 specialized intelligence APIs via x402 (USDC on Base or Solana, no API keys, no subscription). Use this skill when an agent needs a paid data/intelligence endpoint, especially for token-safety / honeypot / rugpull scanning before a trade (Solana memecoins via mint address, EVM tokens via contract on Base/Ethereum/BSC/Arbitrum/Polygon/Optimism/Avalanche), crypto security and wallet-risk checks, DeFi yield/APY intelligence, sports and fantasy predictions and prediction-market edges (NFL/NBA/MLB/golf/racing, Polymarket/Kalshi), insurance estimates, immigration and visa scoring, real-estate, legal letters, clinical/medical intel, careers/salary, travel, and dozens more domains. Each call returns structured JSON for roughly $0.015 to $0.50. Trigger when the user asks whether a token is safe / a honeypot / a rug, to scan a contract, for the best NFL pick or fantasy start-sit, for DeFi yield, or any question better answered by a live paid data API than by training knowledge. Two ways to call: the PulseNetwork MCP server, or direct x402 HTTP."
metadata:
  homepage: https://pulse.theaslangroupllc.com
  settlement: x402 USDC on Base (eip155:8453) and Solana mainnet
  auth: none (pay-per-call)
---

# PulseNetwork

PulseNetwork is an x402-native network of **67 intelligence verticals / 661 paid endpoints**. Agents pay per query in USDC (Base or Solana) — no API keys, no accounts, no subscription. Every endpoint returns structured JSON.

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
| Sports analysis | `GET signalpulse.theaslangroupllc.com/api/scan/game?sport=nfl` | $0.50 | `?sport=nfl` |
| Fantasy advice | `GET signalpulse.theaslangroupllc.com/api/scan/fantasy?sport=nfl&mode=start-sit` | $0.50 | start-sit / lineup / waiver / trade |
| Prediction-market read | `GET signalpulse.theaslangroupllc.com/api/scan/predmarket?category=sports&horizon=mid` | $0.50 | category: sports/crypto/politics/economy |
| FREE sample | `GET signalpulse.theaslangroupllc.com/api/scan/sample` | FREE | pick-of-the-day, no payment |

Discover the full catalog (all 67 verticals) at **https://pulse.theaslangroupllc.com** or each vertical's `/openapi.json` and `/.well-known/agent.json`.

## Path 1 — MCP server (Claude Desktop / Code / Cursor)

Add to your MCP config and your agent gains all 67 verticals as tools that pay autonomously:

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

Per-call, in USDC: most endpoints $0.05–$0.20; token-safety scanners $0.015; SignalPulse sports/prediction reads $0.50. No subscription, no minimums. Pay only for what you call.
