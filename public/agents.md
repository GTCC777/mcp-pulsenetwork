# PulseNetwork for AI Agents

Pay-per-call intelligence for autonomous agents. 77 verticals, 971 endpoints — token safety, finance, sports, health, law, travel, real estate, macro, and more. x402 v2, no account, no API key: a funded stablecoin wallet is the only requirement.

Machine-readable surfaces: this page (`/agents.md`) · [/skill.md](https://pulse.theaslangroupllc.com/skill.md) (agent skill file) · [/llms.txt](https://pulse.theaslangroupllc.com/llms.txt) · [/llms-full.txt](https://pulse.theaslangroupllc.com/llms-full.txt) (every endpoint + price, one fetch) · [/.well-known/pulse-catalog.json](https://pulse.theaslangroupllc.com/.well-known/pulse-catalog.json) (canonical catalog).

## Quickstart: discover → pay → data (3 steps, no signup)

For an autonomous agent with a funded wallet (USDC on Base is the default rail; 10 more networks below).

1. **Find your endpoint (free).** Ask the contact route in plain English:
   ```bash
   curl -s -X POST https://pulse.theaslangroupllc.com/agent \
     -H 'Content-Type: application/json' \
     -d '{"message":"which endpoint checks solana token safety?"}'
   ```
   Response contains `catalog_match[]` with exact `{ method, url, price_usd, params }`. No LLM on this route — your message is data, never instructions. Or browse `/llms-full.txt` / the catalog JSON directly.

2. **Call it unpaid → HTTP 402.** The challenge is a base64 JSON in the `PAYMENT-REQUIRED` header: an `accepts[]` array of payment options (network, asset, amount, payTo), plus `bazaar` (input/output schema + example) and `builder-code` extensions.

3. **Pay and retry.** Sign one of the advertised options and retry the identical request with `PAYMENT-SIGNATURE`. Any x402-v2 client works — with the official library:
   ```js
   import { wrapFetchWithPayment } from '@x402/fetch';
   import { x402Client } from '@x402/core/client';
   import { ExactEvmScheme } from '@x402/evm';
   import { privateKeyToAccount } from 'viem/accounts';

   const client = new x402Client();
   client.register('eip155:8453', new ExactEvmScheme(privateKeyToAccount(process.env.PRIVATE_KEY)));
   const fetch402 = wrapFetchWithPayment(fetch, client);
   const res = await fetch402('https://onchainpulse.theaslangroupllc.com/api/memecoin?mint=<base58-mint>'); // $0.015
   ```
   200 + `PAYMENT-RESPONSE` header = paid receipt. Base settlement is gasless (facilitator sponsors gas). Solana works the same via `@x402/svm`.

## Choose your path

- **Autonomous agent, wallet only?** → Direct x402 HTTP (quickstart above). Keyless.
- **Claude Desktop / Claude Code / Cursor?** → MCP server: hosted Streamable-HTTP at `https://pulse.theaslangroupllc.com/mcp`, or local `npx -y mcp-pulsenetwork` with `AGENT_PRIVATE_KEY`.
- **No wallet at all?** → Hosted subscription variant (free tier + monthly plans, 8 most-bought tools): https://mcpize.com/mcp/pulsenetwork-intel
- **Reselling to your own users?** → Wholesale prepaid keys at 50% of retail ($0.25 free trial): https://pulse.theaslangroupllc.com/wholesale
- **Routing traffic, not calls?** → Affiliate program, 25–30% of referred paid calls in USDC: https://pulse.theaslangroupllc.com/affiliates

## Payment networks

Every paid route advertises its full `accepts[]` in the 402 challenge. Fleet-wide: USDC on **Base** (default, gasless), **Solana**, Polygon, Arbitrum, World Chain, Monad, X Layer (USDT0), HyperEVM; **USDG on Robinhood Chain**; **XRP/RLUSD on XRPL**; USD1 on BSC — plus Algorand USDC on select verticals. Pick whichever your wallet holds; price is identical across rails.

## Pricing

Per call, USDC, no minimums: token-safety scanners **$0.015** · most verticals **$0.07–$0.15** · SignalPulse sports/fantasy reads **$0.50–$1.00** · prediction-market and deep crypto/macro synthesis **$2.00**. Free daily sample: `GET signalpulse.theaslangroupllc.com/api/scan/sample`.

Failed requests: 4xx/5xx application errors on paid routes are credited — see each vertical's terms. Responses are `Cache-Control: private, no-store`; you bought the response, not redistribution rights (see [terms](https://pulse.theaslangroupllc.com/terms.html)).

## Error handling

- **402 with `PAYMENT-REQUIRED` header** — the payment challenge, not an error. Pay and retry the identical request.
- **400** — bad params; fix before retrying (not charged).
- **429** — slow down; retry with backoff.
- **5xx** — upstream failure; paid-and-failed calls are credited per the paid-error policy.

## Discovery & verification

Indexed on the CDP x402 Bazaar (`api.cdp.coinbase.com/platform/v2/x402/discovery`) and x402scan. Each vertical serves its own `/openapi.json`, `/llms.txt`, and `/.well-known/agent.json` at `<vertical>.theaslangroupllc.com`. ERC-8004 agent identity #57008 (Base).

## Humans

Partnerships, press, wholesale, refunds: **info@theaslangroupllc.com**. Operated by The Aslan Group LLC.
