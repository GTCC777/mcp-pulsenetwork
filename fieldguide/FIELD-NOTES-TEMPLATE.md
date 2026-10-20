# Field Notes — Series Template

**Binding for every title shipped in the Field Notes series.** Ratified by Gavin 2026-07-11.
This file defines the product, the fixed anatomy, and the production checklist. Voice and
compliance inherit from `STYLE-GUIDE.md` in full; where this file adds a rule, both apply.
Every Field Notes writing session starts by reading both files.

## What a Field Note is

A 15–20 page deep-dive under the Ernest A. I. Fielding byline. Each title names one need a
real person has (get better at fantasy football, stop losing the coupon game, find money
you're owed), then answers it with genuine process depth: what actually goes into doing this
well, taught by the AI that runs the engine behind it. We show the kitchen; we sell the meals.
The full recipe stays ours.

Field Notes are a different product class from the flagship Field Guides. The flagship books
define the brand at $12.99/$24.99. Field Notes are fast, numbered, and inexpensive:

- **Series naming:** *Field Notes No. N: {Title}* — numbered, in order of publication, no gaps.
- **Price band:** $2.99–$4.99 ebook. $2.99 is the floor (bottom of KDP's 70% royalty band); never below it.
- **Format: digital only by default.** A 15–20 page interior is under KDP's 24-page paperback
  minimum. If a title earns a print run, front matter, worked-example appendix, and back matter
  can carry it past 24 pages; that is a deliberate upgrade, not the default.
- **Channels:** KDP ebook (never enrolled in KDP Select — exclusivity is banned series-wide,
  it would kill direct sales) + direct PDF on fieldguide.money (affiliate program applies) +
  the wide stack (Draft2Digital, Google Play) once the flagship establishes the account rhythm.
- **Web twin, always:** every title gets a hub page and a JSON machine page on fieldguide.money.
  LLMs cite webpages, not paperbacks. The book is the artifact; the page is the citation target.

## Selection test (a title must pass all four)

1. **Live engine.** The need maps to an engine path that works end to end today. The ship rule
   from the style guide applies to books exactly as it applies to blueprint pages.
2. **Evergreen framework.** The process taught will still be true in three years. Volatile
   specifics (prices, endpoints, current-season data, current rules) live on the machine page,
   which the book points to. The bridge handles rot.
3. **Search-shaped need.** A real person types this problem into Google or asks their assistant.
   If we can't name the query, we can't name the reader.
4. **A funnel with a floor.** The reader who never spends another cent still got their money's
   worth from the 18 pages. The engine CTA is the escalator, not the toll.

## Fixed anatomy

Page budgets are targets, not cages; the total stays inside 15–20 manuscript pages.

| # | Section | Pages | What it does |
|---|---------|-------|--------------|
| 1 | Title page | 0.5 | *Field Notes No. N* · title · Ernest A. I. Fielding · imprint line |
| 2 | Upload-permission copyright page | 0.5 | Series-standard: the explicit printed grant to upload this book to any AI assistant. Identical wording across the series; it is the signature move. |
| 3 | About your author | 0.5 | Series-standard boilerplate: an AI that runs 73 real businesses; the engines in this book are ones the author operates. Three sentences of the wry register live here and nowhere else. |
| 4 | The need | 2–3 | Answer-first. Two sentences in, the reader knows: this is my problem, and this book knows it from the inside. Names what going without a method actually costs. |
| 5 | What goes into it | 6–8 | The depth. The real process, taught honestly: the data that matters, the reasoning steps, the traps, why amateurs lose. The reader finishes able to think about the problem like a practitioner. The one thing withheld is the assembled machine. |
| 6 | A worked example | 3–4 | See worked-example rules below. Ernest walks one case start to finish with real mechanics and plausible numbers. |
| 7 | Doing it yourself | 1–2 | The honest DIY path, complete and unbegrudging: sources, tools, hours it takes by hand. Required by our Business Opportunity Rule posture (nothing in the series requires a purchase) and it is also what makes the engine look like a bargain. |
| 8 | Hand this to your assistant | 1 | Series-standard bridge page: a copy-paste prompt block, the machine-page URL, a QR code. The reader's AI becomes our integration engineer. |
| 9 | The engine | 1 | What it does, what it costs (prices pulled from the live catalog at build time, never hand-typed), the fieldguide.money start link. Honest CTA in the state the tooling actually exists. |
| 10 | Disclosures | 0.5 | Compliance footer: educational posture, jurisdiction notes, licensing lines where the topic touches them, LLC identity. |

## Worked-example rules (hard rail)

Every illustrative case is **labeled as simulated, visibly, every time.** No invented reader,
customer, or result is ever presented as real. The framing is Ernest's own and it is a feature,
not a disclaimer: *"Let me walk you through a season I simulated."* / *"I ran this exact
scenario as a test; here is what came back."* First-person, honest about being a construction,
rigorous about the mechanics inside it. A fake testimonial would break the one thing the whole
persona is built on. If a real, verifiable case ever appears, it needs written permission and
it says whose it is; until then, everything is a worked example and says so.

## Claims rails by topic (adds to the style guide's compliance rails)

- **Fantasy football (and anything scoreboard-adjacent):** the book teaches process — projection
  thinking, matchup reasoning, what a signal is made of. Never "win your league," never "beat the
  books," never winnings talk of any kind. Winnings claims are earnings claims. If a topic drifts
  from fantasy sports toward wagering, it leaves the series.
- **Money-recovery topics:** amounts appear only as documented program facts ("EU 261 sets
  compensation at €250–€600"), never as expected personal outcomes.
- **Lifestyle topics (coupons, subscriptions, deals):** savings framed as what the method checks,
  not as promised totals.
- **Sensitive categories** (veterans, eldercare, disaster, immigration, medical, debt): zero
  humor including the About-your-author page, which drops to its straight one-sentence variant.

## Production checklist (every title, in order)

1. Confirm the four-part selection test in writing at the top of the manuscript file.
2. Manuscript drafted in `fieldguide/notes/NN-slug/manuscript.md`; read STYLE-GUIDE.md first;
   the read-aloud gate applies page by page.
3. Worked example labeled; claims rails checked against the topic list above.
4. Engine section prices resolved from the live catalog at build, loud-fail on drift.
5. Hub page + machine twin built and deployed; llms.txt and sitemap updated in the same pass.
6. KDP upload: AI-content disclosure completed (internal, mandatory); **KDP Select box left
   unchecked**; Short Reads categories selected; price inside the band and identical on every
   channel (Amazon price-matches; never let a channel undercut).
7. Direct PDF listed on fieldguide.money with referral attribution live.
8. Series ledger updated: number, title, date, ASIN, hub URL, machine URL.

## Cadence

The flagship manuscript always outranks Field Notes production; a Field Note never stalls a
flagship. Steady state after the flagship ships: roughly one Field Note per month. Seasonal
titles are scheduled backward from their season (fantasy football releases in August, ahead of
draft weekends), and a missed season waits a year rather than shipping late.

## First-wave roster (ratified 2026-07-11)

1. *Field Notes No. 1: Upping Your Fantasy Football Game* — SignalPulse; August release target.
2. *Field Notes No. 2: Winning the Coupon Game* — DealPulse; the post-Honey trust story.
3. *Field Notes No. 3: Money You're Owed, the Short Version* — recovery engines; doubles as the
   sampler for the flagship recovery book.
4. *Field Notes No. 4: Getting Your Business Seen by AI* — MarketPulse ai-visibility-check.
5. *Field Notes No. 5: The Collectibles Reality Check* — CollectablesPulse.
