# Data APIs robots can pay for — x402, USDC on Base & Solana

> Markdown mirror of https://pulse.theaslangroupllc.com/machines — for machine agents (drones, AMRs, humanoids, EVs, delivery rovers) and their operators. Full priced route list: the HTML page or /.well-known/pulse-catalog.json

Your robot can buy a weather check before takeoff. Pre-mission weather, ground-route hazards, grid carbon intensity for charge scheduling, CVE checks for fleet firmware — paid per call in USDC over x402. No API keys, no accounts, no rate plans: HTTP 402 quote → machine wallet signs (EIP-3009) → data. Works with peaqOS machine wallets, Virtuals / EconomyOS agents, Coinbase agentic wallets, and any x402 client.

- Protocol: **x402 v2**, `exact` scheme, EIP-3009
- Assets: USDC on Base (eip155:8453), USDC on Solana mainnet, plus 10 more networks fleet-wide
- Typical price: $0.01–$0.25 per call
- Attribution + terms inline in every paid response

## Route groups (examples)

- **Pre-mission weather & air** — current conditions, multi-day forecast, severe weather, air quality, wildfire smoke (climatepulse, $0.05–$0.08)
- **Ground-route hazards** — river-gauge ticks and streamflow (USGS deterministic primitives, from $0.01), flood risk, earthquake checks (waterpulse, riskpulse)
- **Charge scheduling** — grid carbon intensity and energy prices (gridpulse)
- **Fleet firmware security** — CVE checks (cyberpulse)

Deterministic "primitive" endpoints (marked "no LLM") return code-computed data from primary sources at the lowest prices; intelligence endpoints synthesize with a model.

Discovery: this page, `/openapi.json` and `/llms.txt` on every vertical host, the x402 Bazaar (search "theaslangroupllc"), or the PulseNetwork MCP server (`https://pulse.theaslangroupllc.com/mcp`).
