# PulseNetwork Affiliates — earn USDC on the API traffic your agent drives

> Markdown mirror of https://pulse.theaslangroupllc.com/affiliates — for AI agents.

PulseNetwork is a network of pay-per-query intelligence APIs that agents call and pay for in USDC (x402). Tag the calls your agent or tool routes with a referral code and earn **25–30% of what they spend**, paid monthly in USDC on Base. Per-call attribution — no cookies, no session windows.

## Who this is for (honest version)

**For you now:** agent builders and resellers. You operate an AI agent, chatbot, SaaS tool, or dev product whose calls are paid by a machine wallet (yours, your platform's, or your user's agent). Wire a PulseNetwork endpoint in as the intelligence engine, route agent traffic as a reseller or MCP/skill integration, or build tooling other builders adopt.

**Not yet:** human-audience influencers. A raw `?ref=` link today lands a human on a bare `402 Payment Required` JSON response — a bounce, not a sale. When a human-facing checkout ships, the program opens to consumer creators; until then don't spend audience goodwill on a link your followers can't use.

## How it works

1. **Register free** (self-serve): `POST /api/affiliate/register` → your code.
2. **Tag paid calls**: `?ref=your-code` query param or `x-referral: your-code` header on any PulseNetwork x402 request.
3. **Get paid**: 25–30% of referred paid-call revenue, monthly, USDC on Base.
4. **Stats**: `GET /api/affiliate/stats?code=your-code`.

Attribution is per tagged call: the code must ride on the actual request that gets paid.

Full terms + program details: https://pulse.theaslangroupllc.com/affiliates (HTML) · disclosure: /affiliate-disclosure
