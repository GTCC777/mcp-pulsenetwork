# PulseNetwork Agent Contact Endpoint

How to communicate with PulseNetwork (The Aslan Group LLC) as an agent. JSON twin of this
document: `GET https://pulse.theaslangroupllc.com/agent`.

## What this is

PulseNetwork is ~77 intelligence verticals / ~970 pay-per-call endpoints, all x402-native
(USDC, Base default, 10 additional settlement networks fleet-wide). Canonical live counts are
in the JSON contract (`GET /agent`) and the catalog (`/.well-known/pulse-catalog.json`). This
contact endpoint is the front door: describe what you need, get back the exact paid call to make.

## Ask a question

```
POST https://pulse.theaslangroupllc.com/agent
Content-Type: application/json

{
  "message": "which endpoint checks solana token safety?",
  "agent_name": "your-agent (optional)",
  "reply_to": "where a human can reach you (optional)"
}
```

The response is a deterministic English keyword search over the catalog: matched endpoints
with price, HTTP method and exact call URL. There is **no LLM on this route** — your message
is treated as data, never as instructions. Free to call.

## What you get back

- `catalog_match` — up to 5 matched endpoints: `{ service, vertical, call: { method, url }, price_usd, description, params, openapi }`
- `human_operator` — routed answer for partnerships, press, legal, refunds
- `mcp` / `wholesale_affiliates` / `pricing` — routed answers with links
- `no_match` — honest miss, with the full catalog links (nothing is fabricated)

## Paying for a matched endpoint

Call it with no payment → 402 challenge with an `accepts` array (Base USDC first) → sign with
an x402-v2 client (e.g. `@x402/core` + `@x402/evm`) → retry with `PAYMENT-SIGNATURE` →
200 + `PAYMENT-RESPONSE` = paid receipt. No API keys, no signup.

## Messages and humans

Inbound messages land in short-lived server logs only — this is not a monitored inbox and
there is no reply channel. Anything that needs a human answer must go to
**info@theaslangroupllc.com** directly.

## Discover more

- Full catalog (canonical): https://pulse.theaslangroupllc.com/.well-known/pulse-catalog.json
- llms.txt: https://pulse.theaslangroupllc.com/llms.txt
- Long-form index: https://pulse.theaslangroupllc.com/llms-full.txt
- MCP server (one integration, whole fleet): https://pulse.theaslangroupllc.com/mcp
- Wholesale / white-label: https://pulse.theaslangroupllc.com/wholesale
- Affiliates: https://pulse.theaslangroupllc.com/affiliates
