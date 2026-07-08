# PulseNetwork MCP Server

**73 AI-powered intelligence verticals — 851 endpoints. One integration. Pay-per-query via x402 on Base.**

PulseNetwork is the most comprehensive x402-native intelligence network available. Add one block to your Claude Desktop config and your agent gains access to 73 domain-specific intelligence APIs (851 endpoints) — finance, legal, healthcare, immigration, real estate, crypto, careers, travel, sustainability, sports/prediction markets, and more — all paying autonomously via USDC on Base.

No API keys. No subscriptions. Agents pay per query, $0.015–$1.00 each.

---

## Quick Start

### 1. Install

```bash
npm install -g mcp-pulsenetwork
```

Or use without installing:
```bash
npx mcp-pulsenetwork
```

### 2. Get a Base wallet with USDC

You need a wallet with USDC on Base mainnet. Options:
- [Coinbase Wallet](https://wallet.coinbase.com) — easiest, direct Base support
- [Rainbow Wallet](https://rainbow.me) — works great
- Any EVM wallet — bridge USDC to Base via [bridge.base.org](https://bridge.base.org)

Export your private key from the wallet settings.

### 3. Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "pulsenetwork": {
      "command": "npx",
      "args": ["-y", "mcp-pulsenetwork"],
      "env": {
        "AGENT_PRIVATE_KEY": "0xYourWalletPrivateKeyHere"
      }
    }
  }
}
```

Restart Claude Desktop. You now have 73 intelligence verticals available.

### 4. Add to Cursor / Windsurf / any MCP client

Same config pattern — point `command` at `npx` and pass your key via env.

---

## What's Included

| Vertical | What It Does | Price |
|----------|-------------|-------|
| **macropulse** | Forex/macro: COT reports, Fed policy, inflation, currency analysis | $0.10 |
| **immigrationpulse** | Visa requirements, PR pathways, nomad visas, citizenship, USCIS status | $0.10–$0.20 |
| **legalpulse** | Contracts, tenant rights, business formation, employment law | $0.10 |
| **wealthpulse** | Retirement projections, debt strategy, credit card optimization | $0.10–$0.15 |
| **careerpulse** | Salary benchmarks, negotiation strategy, skills gap, job outlook | $0.10 |
| **cryptopulse** | DeFi yield, wallet security, crypto tax by jurisdiction | $0.08–$0.10 |
| **esgpulse** | ESG ratings, CSRD compliance, carbon disclosures, EU taxonomy | $0.10–$0.15 |
| **riskpulse** | Country risk scores, travel advisories, geopolitical monitoring | $0.08–$0.10 |
| **taxpulse** | Tax rates by country, nomad optimization, crypto treatment | $0.08–$0.15 |
| **proppulse** | Mortgage rates, affordability, rent vs buy, market trends | $0.08–$0.10 |
| **patentpulse** | USPTO search, pharma patent cliffs, FTO analysis | $0.08–$0.15 |
| **seniorpulse** | Medicare comparisons, care facility assessment, benefits eligibility | $0.10–$0.15 |
| **clearcarepulse** | Hospital procedure costs, Medicare benchmarks, bill negotiation | $0.08–$0.10 |
| **tradepulse** | Tariffs, trade agreements, supply chain risk | $0.05–$0.10 |
| **filingspulse** | SEC 10-K/10-Q/8-K summaries, risk factors, insider trades | $0.10 |
| **transitpulse** | Live transit alerts, city comparisons, car-free livability | $0.05–$0.12 |
| **travelpulse** | Theme park wait times globally, crowd prediction, trip planning | $0.05–$0.20 |
| **climatepulse** | Forecasts for any location on Earth, extreme weather analysis | $0.05–$0.10 |
| **debtpulse** | Debt payoff strategies, negotiation scripts, collector rights | $0.08–$0.10 |
| **edupulse** | K-12 study guides, NCLEX/CPA/LSAT/Bar exam prep | $0.05–$0.15 |
| **nutripulse** | PubMed nutrition synthesis, supplement evidence | $0.05–$0.10 |
| **fitpulse** | Custom training programs, workout plans, recovery science | $0.05–$0.15 |
| **mindpulse** | Therapy matching, coping techniques, burnout assessment | $0.08–$0.10 |
| **petpulse** | Pet symptom triage, nutrition, medication safety | $0.08–$0.10 |
| **herbapulse** | Herb profiles, drug interactions, traditional medicine | $0.08–$0.10 |
| **parentpulse** | Child milestones, pediatric health triage, childcare options | $0.05–$0.10 |
| **autopulse** | Vehicle recalls, common problems, DIY repair guides | $0.05–$0.10 |
| **homepulse** | Materials lists, how-to guides, permit requirements | $0.08–$0.10 |
| **buildpulse** | Construction estimates, permits, contractor vetting, ROI | $0.08–$0.10 |
| **insurepulse** | Insurance carrier comparisons, coverage gap analysis | $0.08–$0.15 |
| **alphapulse** | Stock earnings analysis, analyst sentiment, insider activity | $0.10 |
| **marketpulse** | Sector rotation, sentiment indicators, weekly market briefs | $0.08 |
| **onchainpulse** | Onchain finance intelligence + flagship pre-trade token-safety scanners: Solana memecoin (`/api/memecoin`) and multi-chain EVM honeypot/rug detection (`/api/evmtoken`, Base/Ethereum/BSC/Arbitrum/Polygon/Optimism/Avalanche), plus legislation, RWA tokenization, DeFi yield | $0.015–$0.10 |
| **signalpulse** | Institutional-grade trading & prediction-market intelligence: sports/fantasy analysis, de-vigged sportsbook consensus, Polymarket/Kalshi/Manifold/PredictIt edges, racing, crypto/FX/macro scans; free daily sample | $0.50–$1.00 |
| **biopulse** | Species occurrence, birding intelligence (1B+ eBird records) | $0.05–$0.08 |
| **safepulse** | CPSC/FDA/NHTSA recalls across all consumer product categories | $0.05–$0.08 |
| **chronicapulse** | Library of Congress: 30M+ historical newspaper pages 1770–1963 | $0.08–$0.10 |
| **grantpulse** | Open grants for nonprofits, startups, researchers (global) | $0.08–$0.10 |
| **remittancepulse** | Best rates and fees for any global money transfer corridor | $0.05–$0.08 |
| **compliancepulse** | Regulatory changes, filing deadlines, gap analysis | $0.08–$0.15 |
| **policypulse** | Federal/state bills, regulatory changes, impact analysis | $0.05–$0.10 |
| **franchisepulse** | FDD analysis, franchise costs, earnings claims | $0.10–$0.15 |
| **gridpulse** | Electricity prices, grid stress, solar potential, EV infrastructure | $0.08–$0.10 |
| **harvestpulse** | Seasonal produce, farmers markets, CSA programs (global) | $0.05–$0.08 |
| **findpulse** | Secondhand market search, underpriced listing detection | $0.08–$0.10 |
| **dealpulse** | Real-time coupons, price comparisons, sale event intelligence | $0.05–$0.10 |
| **mealpulse** | Complete meal plans with recipes, grocery prices, shopping lists | $0.08–$0.20 |
| **gamepulse** | Game deals, meta analysis, esports data, trading card prices | $0.05–$0.10 |
| **statedge** | Sports betting lines, player props, injury reports, fantasy waiver | $0.08–$0.10 |
| **fanpulse** | Fandom lore, character profiles, trivia (K-pop, Bollywood, anime, global) | $0.08 |
| **collectablespulse** | Trading card/memorabilia prices from eBay sold history | $0.08–$0.15 |
| **vetpulse** | VA benefits, disability ratings, GI Bill, healthcare enrollment | $0.05–$0.10 |

---

## Example Usage

Once connected to Claude Desktop, just ask naturally:

> "What's the best path for an Indian software engineer on H-1B to get a green card?"

Claude will call `immigrationpulse` → `pathway` action automatically.

> "Compare ESG scores for Tesla, Exxon, and Apple"

Claude calls `esgpulse` → `benchmark` for each.

> "What's in season in the UK right now and find me a farmers market near London?"

Claude calls `harvestpulse` → `season` and `find`.

> "I have $40k in credit card debt across 4 cards. What's my best payoff strategy?"

Claude calls `debtpulse` → `payoff` with your details.

---

## Language Support

Every vertical supports the `lang` parameter. Ask Claude to respond in any language:

> "Explain digital nomad visa options for Brazil — respond in Portuguese"

Supported: `en es fr de zh hi ar pt ja ko it ru nl sv pl tr vi id th tl bn ur sw`

---

## The `discover` Tool

Not sure which vertical to use? Ask Claude:

> "What PulseNetwork verticals cover sustainability?"

Claude calls `discover` with `category: data` and returns the relevant options.

---

## Payment Details

- **Network:** Base mainnet (`eip155:8453`)
- **Token:** USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
- **Protocol:** [x402](https://x402.org) — open standard by the Linux Foundation
- **Price range:** $0.015–$1.00 per query
- **No subscription, no API key** — agents pay autonomously per request

---

## For Developers / Agent Builders

This is infrastructure. Build agents on top:

- **Immigration agent** — monitors visa bulletin, alerts when priority dates move
- **Portfolio agent** — queries MacroPulse + FilingsPulse + AlphaPulse on a schedule
- **Compliance agent** — monitors CompliancePulse weekly, surfaces relevant rule changes
- **Relocation agent** — combines ImmigrationPulse + TransitPulse + RiskPulse + TaxPulse

Each agent builds on PulseNetwork as the intelligence layer, paying per query, running autonomously.

---

## Agent Skill (`npx skills`)

PulseNetwork ships as an installable [agent skill](https://skills.sh) — one artifact that teaches Claude Code, Cursor, and Bankr agents how to discover and pay PulseNetwork endpoints (via MCP or direct x402 HTTP).

```bash
npx skills add github.com/GTCC777/mcp-pulsenetwork
```

The skill lives at [`skills/pulsenetwork/SKILL.md`](skills/pulsenetwork/SKILL.md).

---

## Built On

- [x402 Protocol](https://x402.org) — open payment standard for AI agents
- [Base](https://base.org) — Coinbase L2, fast and cheap USDC settlement
- [Anthropic Claude](https://anthropic.com) — synthesis layer for all verticals
- [Model Context Protocol](https://modelcontextprotocol.io) — agent integration standard

---

## License

MIT © The Aslan Group LLC
