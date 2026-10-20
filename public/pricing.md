# PulseNetwork Startup Engine — Pricing

All endpoints are pay-per-call via the [x402 protocol](https://x402.org): USDC on Base
(Solana also accepted on most endpoints). **No account, no API key, no subscription** —
an agent pays exactly the calls it makes. Send a GET without payment headers, receive a
402 challenge, sign the USDC authorization, retry.

| Endpoint | What it does | Price/call |
|---|---|---|
| `/api/affiliate/register` | Self-serve affiliate code registration — zero-build passive income | $0 |
| `/api/affiliate/stats` | Public affiliate code stats — revenue, calls, distinct buyers, earnings owed | $0 |
| `/api/ideas` | Business model menu — free top-of-funnel list of AI reseller business ideas | $0 |
| `/api/wholesale/register` | Self-serve prepaid wholesale key — low-build reselling at 50% of retail | $0 |
| `/api/wholesale/stats` | Wholesale key status and balance lookup (holder-only) | $0 |
| `/api/blueprint` | Tailored business-in-a-box recommender — how to make money with AI | $0.01 |
| `/api/unbundle` | The Unbundler — decompose any gated data product into its free public upstreams | $1 |
| `/api/wholesale/deposit` | Top up a wholesale key's prepaid balance via x402 USDC | $5 |

- Machine-readable spec: [/openapi.json](https://pulse.theaslangroupllc.com/openapi.json) · agent card: [/.well-known/agent.json](https://pulse.theaslangroupllc.com/.well-known/agent.json) · [/llms.txt](https://pulse.theaslangroupllc.com/llms.txt)
- Terms (accepted by paying): [/terms.html](https://pulse.theaslangroupllc.com/terms.html)
- Part of [PulseNetwork](https://pulse.theaslangroupllc.com) — The Aslan Group LLC · info@theaslangroupllc.com
