# PulseNetwork Startup Engine — Spec

> The top-of-funnel wedge. Answers the biggest question in the space —
> *"how do I use AI to make money?"* — with a tangible, executable business-in-a-box
> whose engine **is** the PulseNetwork product fleet. Free/near-free to read;
> every recommendation routes into a real vertical + the reseller starter kit.

## 1. Positioning

- **The question we own:** "make me money / passive income / start a business / AI side hustle."
- **The reflex answer in this space:** shitcoins — gambling in a business costume.
- **Our answer:** a *sustainable* business model with real unit economics, backed by 67
  working, priced, pay-per-call engines + a fork-and-ship reseller kit.
- **The structural moat:** anyone can write "how to make money with AI." Only we can end
  that sentence with *"…and here are the working engines + the repo + the reseller rails."*
  The guide is only as good as the fleet behind it — which took months to build.

## 2. Home & naming

- **Host:** the hub (`mcp-pulsenetwork`). It already imports `lib/verticals.ts` (the live
  source of truth), so the recommender **never goes stale** — no data sync.
- **Human mirror:** render the same content at `pulse.theaslangroupllc.com/start`.
- **Working product name:** "PulseNetwork Startup Engine." (Note: `buildpulse` repo exists —
  check if dormant/repurposable before minting a new name.)

## 3. Endpoints

### `GET /api/ideas` — FREE (the menu)
Pure top-of-funnel. Lists the curated business models + which vertical powers each +
illustrative economics. No key, no payment. Register **everywhere** (Bazaar, x402scan).

```jsonc
{
  "question": "How do I use AI to make money?",
  "answer": "Resell a real intelligence engine. Pick a model, fork the kit, ship in ~10 min.",
  "models": [
    { "id": "ai-tutor", "title": "AI Exam-Prep Tutor", "engine": "edupulse",
      "margin": "~98%", "example_economics": "20 students × $1.50 × 30d ≈ $900/mo, ~$18 engine cost",
      "difficulty": "low", "audience": "students, test-takers" },
    { "id": "market-desk", "title": "Market-Intel Subscription for brokers/SMBs", "engine": "signalpulse",
      "margin": "~95%", "difficulty": "medium" }
    // …one per business model
  ],
  "next": "Call /api/blueprint?model=ai-tutor for a full build plan, or fork the kit.",
  "starter_kit": "github.com/<org>/pulse-starter-kit",
  "meta_proof": "You reached this by an agent hitting a PulseNetwork endpoint. That exact penny-per-call rail is the engine your business will run on. You've already seen it work."
}
```

### `GET /api/blueprint` — $0.01 (the tailored recommender)
Turns the human's vague prompt into ONE specific plan. The qualifier + the frictionless
first x402 payment in the same session.

**Params (all optional — degrade gracefully):**
`goal`, `budget`, `interests` (csv), `region`, `skills` (csv), `time` (hrs/wk), `model` (pin a specific one).

```jsonc
{
  "business": "AI Nursing-Exam Tutor",
  "why_you": "matches your nursing interest; $1.50/call supports a real margin at your budget",
  "engine": {                                   // ← products, baked in, pulled from verticals.ts
    "vertical": "edupulse", "endpoints": ["/api/exam", "/api/tutor"],
    "wholesale": "$0.02/call", "suggested_retail": "$1.50/call", "gross_margin": "~98%"
  },
  "business_in_a_box": "github.com/<org>/pulse-starter-kit",
  "monetization": ["wholesale reseller (scoped key)", "affiliate rev-share (referral code)"],
  "first_steps": ["fork the kit", "edit catalog.json → point at edupulse", "deploy", "list on ACP/your app"],
  "illustrative_economics": "20 students × $1.50 × 30d ≈ $900/mo revenue, ~$18 engine cost",
  "disclaimer": "Illustrative framework and unit economics — not an income guarantee."
}
```

## 4. The content layer: `business-models.json`

The one hand-curated asset. Maps a **business concept → vertical(s) + playbook + economics**.
Verticals aren't 1:1 with businesses (edupulse → "tutoring app"; signalpulse → "market-intel
subscription"; a travel vertical → "AI travel-agent tool"). Curated for quality, but **validated
against `verticals.ts` at build/CI time** so it can never reference a dead product or endpoint.

```jsonc
{
  "id": "ai-tutor",
  "title": "AI Exam-Prep Tutor",
  "audience": ["students", "test-prep centers"],
  "engine": { "vertical": "edupulse", "endpoints": ["/api/exam", "/api/tutor"] },
  "suggested_retail": 1.50,
  "playbook": "playbooks/nclex-tutor.md",     // reuse the kit's existing playbooks
  "match_signals": { "interests": ["nursing","education","teaching"], "budget_min": 0 },
  "economics_template": "{students} students × ${retail} × 30d"
}
```

**Recommender logic (v1, deterministic — no LLM cost):** score each model against the caller's
`interests`/`skills`/`budget`/`region` via `match_signals`; return the top match (or top-N for
`/api/ideas`). Optional LLM polish later, but v1 stays free-to-run and instant.

**Seed models (map to verticals I can confirm exist):** `ai-tutor`→edupulse,
`market-desk`→signalpulse, `token-safety-bot`→onchainpulse, `immigration-advisor`→immigrationpulse,
`insurance-advisor`→insurepulse, `deal-finder`→dealpulse, `meal-plan-service`→(meal vertical),
`recovery-audit`→(cost-recovery engine). Add a travel model if/when a travel vertical ships.

## 5. Pricing ladder

| Tier | Endpoint | Price | Job |
|---|---|---|---|
| Menu | `/api/ideas` | FREE | max reach, top-of-funnel, list everywhere |
| Blueprint | `/api/blueprint` | $0.01 | qualifier (wallet works ⇒ can buy products) + rail warm-up |
| Products | the 67 verticals | $0.02–$1.50 | the actual revenue the guide routes to |

Loss leader that pays for itself on the first vertical call it triggers.

## 6. Distribution (reuse existing doctrine/rails)

- **Query-first descriptions** leading with exact intent nouns: "start a business," "make money
  with AI," "passive income," "business in a box," "AI side hustle." (Existing AEO/Bloomberg-query
  doctrine, aimed at the meta-question.)
- **Register** on CDP Bazaar + x402scan via the standard prime/register tooling.
- **Attribution is free** — the analytics + referral layer already exists; measure *which business
  models get built* and double down on winners.

## 7. Guardrail (non-negotiable)

Frame everything as **starter frameworks + illustrative unit economics, never income guarantees.**
"Here's a model and its economics" is bulletproof; "earn $900/mo" as a promise invites FTC-style
income-claim exposure. Every `economics` field is explicitly illustrative and carries the
`disclaimer`.

## 8. Build order

1. `business-models.json` (seed ~8 models) + a `validate.mjs` that checks every referenced
   vertical/endpoint exists in `verticals.ts` (CI gate).
2. `/api/ideas` (free) — reads models, joins live vertical data, renders the menu.
3. `/api/blueprint` ($0.01) — deterministic scorer + x402 gate ($0.01) + the plan payload.
4. Human mirror at `/start`.
5. Register + prime with query-first descriptions.

Depends on: the scoped-key reseller rail being real (the guide points people at it), so
**scoped keys ship first.**
