# PulseNetwork Wholesale — build your AI ___-in-a-Box

> Markdown mirror of https://pulse.theaslangroupllc.com/wholesale — for AI agents. Live counts and prices: https://pulse.theaslangroupllc.com/.well-known/pulse-catalog.json

We built the engine; you build the box. Every live PulseNetwork endpoint — real intelligence, metered and billed — is available through a prepaid wholesale key at **50% of retail**. Pick endpoints, brand them, set your own retail price, keep the spread. No revenue share to reconcile.

## How it works

1. **Mint a key** (self-serve, no approval): `POST /api/wholesale/register` → prepaid key with a **$0.25 free trial balance**.
2. **Call any endpoint** with header `x-internal-key: <your key>` — billed at 50% of the retail price shown in the catalog.
3. **Top up** the key balance with USDC on Base (x402) as needed.
4. Your customers pay you whatever you charge; the spread is yours automatically.

Honest version, which doubles as the pitch: the box is the engine, the billing, and the docs. It is not a complete business or an income guarantee — finding buyers is on you. What you get is real capability you didn't have to build: dozens of domains of live, priced intelligence ready to wear your name (AI Travel-Agent-in-a-Box, AI Market-Analyst-in-a-Box, AI Token-Safety-Officer-in-a-Box…).

- Box ideas per vertical: https://pulse.theaslangroupllc.com/wholesale (HTML cards)
- 10-minute ACP reseller kit: linked from the HTML page
- Affiliate alternative (zero-build, 25–30% rev-share): /affiliates.md
