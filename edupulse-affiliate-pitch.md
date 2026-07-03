# EduPulse Affiliate Pitch — for test-prep tutors & study creators

*(Target: NCLEX / bar / MCAT / SAT / Series-7 tutors, study-content creators, nursing-school
Discord & subreddit admins, test-prep YouTubers/TikTokers. Adapt the exam name to their niche.)*

---

## The one-liner
**Earn 30% every time your audience uses an AI test-prep tool — you build nothing, host nothing,
and pay nothing. Just share your link.**

## The pitch (DM / email ready)

> Hey [name] — I run PulseNetwork. We built an AI engine that generates unlimited **[NCLEX]** prep
> on demand: targeted practice-question sets, full timed mock exams, instant essay/answer grading,
> concept explanations, and flashcards — any topic, any difficulty, in seconds.
>
> You already have the thing that's hard to get: **the audience of students who need this.**
>
> So here's the deal: you get a personal link. Every time one of your followers runs a prep drill
> or mock exam through it, **you earn 30%** — automatically, paid in USDC (or we'll cut you a check).
> No product to build, no subscriptions to manage, no upfront cost, no risk. You promote, we deliver
> the content and handle everything else.
>
> A drill set is $1, a full mock exam is $2. If 100 of your students each do a few drills a week,
> that's real recurring income for you — for content you're basically already recommending.
>
> Want me to set up your link so you can test it free?

## Why it converts
- **Extreme intent:** students pay *thousands* to pass these exams — $1 for a targeted drill is nothing.
- **Daily-repeat use:** prep isn't one-and-done; students drill every day for weeks → recurring commission.
- **Zero friction for the tutor:** they already recommend study resources; now they get paid for it.
- **They can go further:** power users can *bundle* it into their own paid course (reseller model) —
  they set the price, keep the spread, we're the wholesale engine underneath.

## What they promote (real EduPulse endpoints)
| Product | What it does | Price |
|---|---|---|
| **Prep drills** (`exam/prep`) | targeted practice-question set — pick exam, topic, difficulty, count | $1.00 |
| **Mock exam** (`exam/mock`) | full timed practice exam | $2.00 |
| **Answer/essay grading** (`exam/grade`) | grades a student's response with feedback | $1.00 |
| **Concept explainer** (`exam/explain`) | plain-English explanation of any tested concept | $0.50 |
| **Flashcards** (`exam/flashcards`) | instant flashcard set on any topic | $0.50 |

## Their economics (be honest, it sells itself)
- 100 students × 5 drills/week × $1.00 × **30%** = **$150/week** (~$650/mo), passive.
- A creator with a 50k nursing-student following converting even 1% = huge.
- Power tutors bundling it into a $99 course = they keep the markup *and* their audience.

## How to actually launch one
1. Sign the tutor → get their USDC wallet (Base) → mint their code:
   `referral.mjs create ref_<name> 0x<theirWallet> 0.30 "<name>"`
2. Give them their link: `https://edupulse-<domain>/api/exam/prep?ref=ref_<name>&exam=NCLEX&...`
   (or the `x-referral-code: ref_<name>` header for agent/app integrations).
3. They promote. Attribution is automatic. `referral.mjs report` shows their earnings live;
   `referral.mjs payout` tells you exactly what USDC to send; `mark-paid` records it.

## First 3 to recruit
- A **nursing-student TikTok/IG creator** (NCLEX) — highest-intent, biggest niche.
- A **bar-exam prep YouTuber** (bar) — very high WTP.
- A **nursing-school Discord/subreddit admin** — owns a captive, on-topic community.
