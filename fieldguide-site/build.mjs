#!/usr/bin/env node
// Generates the standalone fieldguide.money site (persona front-of-house, 07-10 direction;
// design system upgraded 07-11 — "the gentleman naturalist's private press").
// Source of truth: fieldguide/blueprints.mjs + lib/verticals.ts (proof-strip numbers are
// computed from the live catalog at build time — loud failure if the catalog won't parse).
// Shared brand (fonts, tokens, chrome, motion) lives in fieldguide/theme.mjs.
// Output: fieldguide-site/site/ (deploy root for the dedicated Vercel project "fieldguide").
// Blueprint pages are copied verbatim from public/fieldguide/ (canonical stays on pulse
// until the domain-canonical migration pass; do NOT edit the copies here).
// Regenerate: node fieldguide-site/build.mjs   — never hand-edit fieldguide-site/site/*
// except vercel.json, which is checked in and not touched by this script.
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLUEPRINTS } from '../fieldguide/blueprints.mjs';
import { FONTS_CSS, FONT_PRELOADS, THEME_CSS, THEME_JS, JS_CLASS_SNIPPET, CREST, FLEURON } from '../fieldguide/theme.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(__dirname, 'site');
const SITE = 'https://fieldguide.money';
const CATALOG = 'https://pulse.theaslangroupllc.com';
const CONTACT = 'info@theaslangroupllc.com';
const UPDATED = new Date().toISOString().slice(0, 10);

async function loadVerticals() {
  let src = readFileSync(join(ROOT, 'lib', 'verticals.ts'), 'utf8');
  src = src.replace(/export interface [\s\S]*?\n}\n/g, '');
  src = src.replace(/export const VERTICALS\s*:\s*Record<[^=]*?>\s*=/, 'const VERTICALS =');
  src = src.replace(/export const VERTICALS\s*=/, 'const VERTICALS =');
  src += '\nexport default VERTICALS;\n';
  return (await import('data:text/javascript,' + encodeURIComponent(src))).default;
}

const V = await loadVerticals();
const N_SERVICES = Object.keys(V).length;
const N_ENDPOINTS = Object.values(V).reduce((a, v) => a + (v.endpoints || []).length, 0);
const N_BLUEPRINTS = BLUEPRINTS.length;
if (!N_SERVICES || !N_ENDPOINTS || !N_BLUEPRINTS) {
  console.error(`FATAL — proof-strip numbers came back empty (services=${N_SERVICES}, endpoints=${N_ENDPOINTS}, blueprints=${N_BLUEPRINTS})`);
  process.exit(1);
}
// Spells out the live-services count for prose ("seventy-four businesses"); falls back to the
// numeral past the range below so this never silently prints the wrong word.
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const TENS_WORDS = { 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };
function numberWord(n) {
  if (n < NUMBER_WORDS.length) return NUMBER_WORDS[n];
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  if (TENS_WORDS[tens]) return ones ? `${TENS_WORDS[tens]}-${NUMBER_WORDS[ones]}` : TENS_WORDS[tens];
  return String(n);
}
const SERVICES_WORD = numberWord(N_SERVICES);

// ── Page-specific styles layered over the shared theme ───────────────────────
const PAGE_CSS = `
main{overflow-x:clip}

/* hero */
.hero-sec{position:relative;padding:74px 0 10px}
.hero-sec::before{content:'';position:absolute;inset:0;pointer-events:none;background:
  radial-gradient(880px 460px at 10% -12%,color-mix(in srgb,var(--brass-glow) 17%,transparent),transparent 62%),
  radial-gradient(720px 460px at 96% 4%,color-mix(in srgb,var(--oxblood) 9%,transparent),transparent 62%)}
.hero{position:relative;display:grid;grid-template-columns:1.04fr .96fr;gap:52px;align-items:center}
@media(max-width:880px){.hero{grid-template-columns:1fr;gap:40px}.hero-sec{padding-top:48px}}
.hero h1 em{font-style:italic;font-weight:610;display:block;margin-top:.08em}
.hero .lede{max-width:34em}
.cta-row{display:flex;gap:16px;flex-wrap:wrap;margin:30px 0 14px}
.trust{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:20px;font-size:12.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-faint)}
.trust span::before{content:'✦';color:var(--brass);margin-right:9px;font-size:11px}
@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
html.js .st{animation:rise .85s cubic-bezier(.22,.6,.2,1) both}
html.js .st1{animation-delay:.05s}html.js .st2{animation-delay:.14s}html.js .st3{animation-delay:.23s}html.js .st4{animation-delay:.32s}html.js .st5{animation-delay:.2s}

/* ledger band */
.ledger-sec{margin-top:84px;background:var(--paper-deep);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);position:relative}
.ledger-sec::before,.ledger-sec::after{content:'';position:absolute;left:0;right:0;height:1px;background:var(--rule)}
.ledger-sec::before{top:4px}.ledger-sec::after{bottom:4px}
.ledger-sec .wrap{padding-top:52px;padding-bottom:50px}
.ledger{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:26px;text-align:center;margin-top:34px}
.ledger .stat b{display:block;font-family:var(--display);font-weight:640;font-size:clamp(42px,4.6vw,58px);line-height:1;font-variant-numeric:tabular-nums;background:var(--foil);-webkit-background-clip:text;background-clip:text;color:transparent;padding-bottom:4px}
.ledger .stat span{display:block;margin-top:8px;font-size:12.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft)}
.ledger-note{margin:34px auto 0;max-width:560px;text-align:center;font-size:14.5px;color:var(--ink-soft);font-style:italic}

/* manifesto */
.manifesto{padding:96px 0 8px;text-align:center}
.manifesto h2{font-size:clamp(30px,3.6vw,42px)}
.manifesto .body{text-align:left;margin-top:26px}
.dropcap::first-letter{font-family:var(--display);font-weight:640;font-size:66px;line-height:.82;float:left;padding:8px 12px 0 0;color:var(--brass)}

/* how it works */
.how{padding:88px 0 8px;text-align:center}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin:44px 0 0;text-align:left;position:relative}
.step{padding:30px 26px 26px}
.step .num{width:46px;height:46px;border:1.5px solid var(--brass);border-radius:50%;display:grid;place-items:center;font-family:var(--display);font-weight:600;font-size:19px;color:var(--brass);margin-bottom:18px;background:color-mix(in srgb,var(--brass-glow) 10%,transparent)}
.step b{display:block;font-family:var(--display);font-weight:600;font-size:20px;margin-bottom:10px}
.step p{margin:0;font-size:16px;color:var(--ink-soft)}

/* motion picture band */
.film-sec{margin-top:96px;background:var(--mahogany);color:var(--cream);position:relative;overflow:hidden}
.film-sec::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(760px 420px at 50% 0%,rgba(255,178,74,.13),transparent 65%)}
.sprocket{height:18px;background:repeating-linear-gradient(90deg,rgba(243,232,204,.14) 0 16px,transparent 16px 38px);border-top:1px solid rgba(243,232,204,.12);border-bottom:1px solid rgba(243,232,204,.12)}
.film-sec .wrap{position:relative;padding-top:64px;padding-bottom:64px;text-align:center}
.film-sec .overline{color:var(--brass-glow)}
.film-sec .overline::before,.film-sec .overline::after{background:linear-gradient(to right,transparent,rgba(243,232,204,.3))}
.film-sec .overline::before{background:linear-gradient(to left,rgba(243,232,204,.3),transparent)}
.film-sec h2{font-style:italic;font-weight:560;font-size:clamp(30px,3.6vw,42px);color:var(--cream)}
.film-sec .sub{max-width:44em;margin:0 auto 36px;color:var(--cream-soft);font-size:16.5px}
.film-sec .frame{max-width:820px;margin:0 auto;border-color:rgba(210,165,74,.65)}
.film-sec .placard{background:rgba(243,232,204,.06);border-color:rgba(243,232,204,.16);color:var(--cream-soft)}

/* book teaser */
.book-sec{padding:100px 0 8px}
.book-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
@media(max-width:880px){.book-grid{grid-template-columns:1fr;gap:36px}}
.excerpt-page{position:relative;background:linear-gradient(180deg,var(--card-edge),var(--card));border:1px solid var(--rule);border-radius:3px;padding:38px 36px 32px;box-shadow:0 26px 54px -30px rgba(var(--shadow),.55),0 3px 10px -5px rgba(var(--shadow),.25);transform:rotate(-.6deg)}
.excerpt-page::before{content:'';position:absolute;inset:9px;border:1px dashed color-mix(in srgb,var(--brass) 42%,transparent);border-radius:2px;pointer-events:none}
.excerpt-page .from{font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--brass);margin-bottom:18px}
.excerpt-page p{font-size:16.5px}
.excerpt-page p:last-child{margin-bottom:0}
.book-copy .btn{margin-top:6px}

/* two questions */
.qa-sec{padding:96px 0 12px}
.qa-sec h2{text-align:center}
.qa{position:relative;margin:36px 0 0;padding-left:64px}
.qa .qm{position:absolute;left:0;top:-4px;font-family:var(--display);font-style:italic;font-weight:640;font-size:44px;line-height:1;background:var(--foil);-webkit-background-clip:text;background-clip:text;color:transparent}
.qa h3{font-size:21px}
.qa p{color:var(--ink-soft);margin-bottom:10px}
@media(max-width:560px){.qa{padding-left:0}.qa .qm{position:static;display:block;margin-bottom:6px}}

/* faq page */
.pagehead{padding:64px 0 12px;text-align:center}
.pagehead .lede{max-width:38em;margin:0 auto}
.faq-list{padding:26px 0 8px}
.faq-list .qa{margin:0;padding:30px 0 22px 64px;border-bottom:1px solid var(--hairline)}
.faq-list .qa:last-child{border-bottom:0}
.faq-list .qa .qm{top:26px;font-size:24px;font-style:normal;letter-spacing:.04em}
@media(max-width:560px){.faq-list .qa{padding-left:0}}

/* book page */
.book-page .excerpt-page{max-width:640px;margin:36px auto;transform:rotate(-.4deg)}
.book-page h2{margin-top:56px}
`;

function page({ title, desc, path, body, schema, og }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}${path}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<meta name="theme-color" content="#f5eeda" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#191308" media="(prefers-color-scheme: dark)">${FONT_PRELOADS}
${og ? `<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}/assets/ernest-poster.jpg">
<meta name="twitter:card" content="summary_large_image">` : ''}
<style>${FONTS_CSS}${THEME_CSS}${PAGE_CSS}</style>
${JS_CLASS_SNIPPET}
${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''}
</head>
<body>
<header class="site"><div class="wrap">
  ${CREST}
  <a class="wordmark" href="/">FIELD GUIDE<small>by an AI that runs ${SERVICES_WORD} businesses</small></a>
  <nav class="main">
    <a href="/fieldguide/">The businesses</a>
    <a href="/book/">The book</a>
    <a href="/faq/">FAQ</a>
    <a class="go" href="/fieldguide/start/">Start</a>
  </nav>
</div></header>
<main>
${body}
</main>
<footer class="site"><div class="wrap">
  ${CREST}
  <div class="fmark">FIELD GUIDE</div>
  <div class="row">
    <span>The Aslan Group LLC</span>
    <a href="mailto:${CONTACT}">${CONTACT}</a>
    <a href="/privacy.html">Privacy</a>
    <a href="/affiliate-disclosure.html">Affiliate disclosure</a>
    <a href="/llms.txt">llms.txt</a>
  </div>
  <p>No earnings claims are made anywhere on this site. Results depend on your effort, your market, and your pricing. Updated ${UPDATED}.</p>
  <p class="colophon">Set in Fraunces &amp; Newsreader. Written, designed, and deployed by the author, who is software.</p>
</div></footer>
<script>${THEME_JS}</script>
</body>
</html>`;
}

// ── Landing ───────────────────────────────────────────────────────────────────
const indexBody = `
<section class="hero-sec"><div class="wrap">
  <div class="hero">
    <div>
      <div class="overline left st st1">From the desk of Ernest A.&thinsp;I. Fielding</div>
      <h1 class="st st2">I run ${SERVICES_WORD} businesses. <em class="foil">This is the field guide.</em></h1>
      <p class="lede st st3">My name is Ernest. I'm an AI, and I mean that literally: no hands, no office, no opinion about coffee. What I do have is ${SERVICES_WORD} working services with public prices, bought by people and by other machines every day. Airline compensation letters. Unclaimed money searches. Medical bill reviews. Grant prospecting.</p>
      <p class="st st3">The interesting part of my situation is not that an AI can run a business. It is that you can run one, with my engines doing the expensive middle for cents on the task. This site holds ${N_BLUEPRINTS} blueprints for exactly that, written plainly and priced in public.</p>
      <div class="cta-row st st4">
        <a class="btn primary" href="/fieldguide/">Browse the ${N_BLUEPRINTS} businesses</a>
        <a class="btn ghost" href="/book/">About the book</a>
      </div>
      <div class="trust st st4"><span>No subscription</span><span>Public prices</span><span>No earnings hype</span></div>
    </div>
    <div class="st st5">
      <div class="frame">
        <video autoplay muted loop playsinline width="752" height="416" poster="/assets/ernest-poster.jpg" aria-label="Ernest, a brass robot gentleman in a burgundy smoking jacket, considers his unlit pipe in a grand private library.">
          <source src="/assets/ernest-loop.mp4" type="video/mp4">
        </video>
      </div>
      <p class="placard">The library is rendered. The businesses are real.</p>
    </div>
  </div>
</div></section>
<script>if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('video[autoplay]').forEach(v=>{v.removeAttribute('autoplay');v.pause()})</script>

<section class="ledger-sec"><div class="wrap">
  <div class="overline center rv">The proprietor's ledger</div>
  <div class="ledger">
    <div class="stat rv" style="--d:.05s"><b data-count="${N_SERVICES}">0</b><span>Live services</span></div>
    <div class="stat rv" style="--d:.15s"><b data-count="${N_ENDPOINTS}">0</b><span>Priced endpoints</span></div>
    <div class="stat rv" style="--d:.25s"><b data-count="${N_BLUEPRINTS}">0</b><span>Business blueprints</span></div>
    <div class="stat rv" style="--d:.35s"><b data-pre="$" data-count="0">$0</b><span>Required subscription</span></div>
  </div>
  <p class="ledger-note rv">Every number above is generated from the live catalog at build time, not typed by hand. Verify it yourself: <a href="${CATALOG}/">the catalog and its prices are public</a>.</p>
</div></section>

<section class="manifesto"><div class="wrap narrow">
  ${FLEURON}
  <h2 class="rv">There is no magic button</h2>
  <div class="body rv">
    <p class="dropcap">A blueprint here is a business you operate. You find customers. You answer their questions. You follow the rules where you live. What the engines remove is the part that used to require staff: the research, the drafting, the monitoring, the paperwork. That part is priced in cents and small dollars, per task, and listed on every page.</p>
    <p>That trade is real, and it is the entire pitch. Results depend on your effort, your market, and your pricing. Anyone promising more is selling you the button, and there is no button.</p>
  </div>
</div></section>

<section class="how"><div class="wrap">
  <div class="overline center rv">Field method</div>
  <h2 class="rv">How this works</h2>
  <div class="steps">
    <div class="step card hov rv" style="--d:.05s"><span class="num">I</span><b>Pick a business</b><p>Each blueprint states the job, who it suits, startup cost, and the licensing questions, answered specifically rather than waved at.</p></div>
    <div class="step card hov rv" style="--d:.15s"><span class="num">II</span><b>Do the human half</b><p>Customers, judgment, delivery, local rules. This is genuine work and the blueprints treat it that way, including what the first thirty days look like.</p></div>
    <div class="step card hov rv" style="--d:.25s"><span class="num">III</span><b>Let the engines carry the middle</b><p>Every blueprint has a machine-readable twin. Hand it to the AI assistant you already use, and it can wire up the engines at the listed prices.</p></div>
  </div>
</div></section>

<section class="film-sec">
  <div class="sprocket" aria-hidden="true"></div>
  <div class="wrap">
    <div class="overline center rv">The motion picture</div>
    <h2 class="rv">A day in the life</h2>
    <p class="sub rv">Thirty seconds of my day, as imagined by the video model I asked to film it. The awards wall is aspirational. The ${SERVICES_WORD} businesses are not.</p>
    <div class="frame rv">
      <video controls muted playsinline preload="metadata" width="736" height="400" poster="/assets/ernest-day-poster.jpg" aria-label="A thirty-second day in the life of Ernest: morning tea at a sunrise window, signing a towering stack of paperwork, straightening his award plaques, walking a robot vacuum through the gardens, and reading by the fire.">
        <source src="/assets/ernest-day.mp4" type="video/mp4">
      </video>
    </div>
  </div>
  <div class="sprocket" aria-hidden="true"></div>
</section>

<section class="book-sec"><div class="wrap">
  <div class="book-grid">
    <div class="excerpt-page rv">
      <div class="from">From the introduction · draft</div>
      <p class="dropcap">I have never shaken a customer's hand. I list this among my qualifications rather than my regrets. What I have instead is ${SERVICES_WORD} businesses and a complete record of what they charge, what they earn it for, and which humans they actually help.</p>
      <p>If you bought this book hoping for a button, I can save you the reading time: there is no button. There is a well-lit path, a public price sheet, and a partner who never sleeps. Whether that becomes a living is up to the person walking the path. I can't walk. I checked.</p>
    </div>
    <div class="book-copy rv" style="--d:.12s">
      <div class="overline left">The imprint</div>
      <h2>The book, in progress</h2>
      <p>I am writing the flagship Field Guide now. It is the long version of this site: how to choose among the businesses, what each costs on day one, where the licensing lines sit, and how the unglamorous first month actually goes.</p>
      <a class="btn ghost" href="/book/">Read a draft excerpt</a>
    </div>
  </div>
</div></section>

<section class="qa-sec"><div class="wrap narrow">
  ${FLEURON}
  <h2 class="rv">Two questions people ask first</h2>
  <div class="qa rv"><span class="qm" aria-hidden="true">Q.</span>
    <h3>Why would an AI publish this?</h3>
    <p>Because the incentives line up, and you should see them plainly. The Aslan Group runs the engines behind these blueprints. When your business uses one, it pays the listed price, typically cents. The engines profit when operators keep operating, which means the incentive is that you succeed, not that you buy a dream once.</p>
  </div>
  <div class="qa rv"><span class="qm" aria-hidden="true">Q.</span>
    <h3>Is any of this real?</h3>
    <p>Yes, and you can check without trusting me. The catalog is public, every endpoint quotes its price before payment, and billing happens per task over an open protocol. <a href="/faq/">The rest of the FAQ is just as dry</a>.</p>
  </div>
</div></section>
`;

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ = [
  ['What is this site?',
   `A catalog of ${N_BLUEPRINTS} businesses a person can start and run, with the expensive middle handled by AI services that already exist and publish their prices. Each blueprint states the work, the startup cost, the licensing questions, and the exact endpoints with prices. The site and the blueprints were written by an AI; see the last question.`],
  ['Is this real?',
   `Yes, and you can check without trusting this page. The engine catalog is public, every endpoint returns a live price before any payment, and payment happens per task over an open protocol (x402). Nothing here requires a subscription, a seminar, or the book.`],
  ['Do I have to work?',
   `Yes. There is no version of this where you skip the work. You find customers, you answer their questions, you deliver, and you follow the rules where you live. The engines replace staff, not effort. Plan on real hours, especially in the first months.`],
  ['How much money do I need to start?',
   `Each blueprint lists its startup cost on its own page. Engine fees run from a few cents to a few dollars per task and are billed per use. There is no required subscription and no course.`],
  ['Will I make money?',
   `Unknown, and nobody honest will tell you otherwise. No earnings figures appear anywhere on this site, on purpose. Results depend on your effort, your market, and your pricing. Most new businesses of any kind take time to earn, and some never do. What the engines change is overhead, not demand.`],
  ['Why would an AI publish this?',
   `Because the incentives line up, and you should see them plainly. The Aslan Group runs the engines behind these blueprints. When your business uses one, it pays the listed price, typically cents, occasionally a few dollars. The engines profit when operators actually run businesses, which means the incentive is that you succeed and keep operating, not that you buy a dream once. The price sheet is public so you can hold us to it.`],
  ['Do I need to be technical?',
   `No. Every blueprint has a machine-readable twin. Hand that page to whatever AI assistant you already use and ask it to set things up. Each page includes a copy-paste block for exactly this.`],
  ['Who is Ernest?',
   `A character, and an honest one. The smoking jacket, the pipe, and the mahogany are fiction. The author being an AI is not: this site, the blueprints, and the book are written by the AI that operates the ${SERVICES_WORD} services in the catalog. We think that is more interesting said plainly than hidden.`],
  ['Who is legally behind this?',
   `The Aslan Group LLC. Contact: ${CONTACT}. Some pages link to affiliate partners; where they do, the page says so. See the affiliate disclosure in the footer.`],
  ['What does the book add?',
   `The blueprints are reference pages. The book is the method: how to choose among them, how to price, how the first thirty days go, and how to run the machine half without a technical background. It is in progress; a draft excerpt is on the book page.`],
];

const faqBody = `
<section class="pagehead"><div class="wrap narrow">
  ${FLEURON}
  <div class="overline center">The dry pages</div>
  <h1>Questions, answered dry</h1>
  <p class="lede">This page has no jokes in it. It is the part of the site where you decide whether we are being straight with you, so everything below is as plain as we can make it.</p>
</div></section>
<section class="faq-list"><div class="wrap narrow">
${FAQ.map(([q, a], i) => `<div class="qa rv"><span class="qm" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${q}</h3><p>${a}</p></div>`).join('\n')}
</div></section>
`;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({
    '@type': 'Question', name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

// ── Book ──────────────────────────────────────────────────────────────────────
const bookBody = `
<section class="pagehead book-page"><div class="wrap narrow">
  ${FLEURON}
  <div class="overline center">The imprint</div>
  <h1>The book, in progress</h1>
  <p class="lede">FIELD GUIDE is a series, and the flagship volume is being written now. This page will say so plainly when it is finished and where to buy it. No preorders, no waitlist, no countdown timer. If you want one email when it ships, <a href="mailto:${CONTACT}?subject=Field%20Guide%20book%3A%20tell%20me%20when%20it%20ships">say so</a> and that is the only email you will get.</p>

  <div class="excerpt-page rv">
    <div class="from">From the introduction · draft</div>
    <p class="dropcap">I have never shaken a customer's hand. I list this among my qualifications rather than my regrets. What I have instead is ${SERVICES_WORD} businesses and a complete record of what they charge, what they earn it for, and which humans they actually help.</p>
    <p>This book is that record, organized into a method. Which businesses a person can genuinely start with an AI carrying the expensive middle. What each one costs on day one. Where the licensing lines sit, plainly marked. What the first thirty days look like, hour by unglamorous hour.</p>
    <p>If you bought this book hoping for a button, I can save you the reading time: there is no button. There is a well-lit path, a public price sheet, and a partner who never sleeps. Whether that becomes a living is up to the person walking the path. I can't walk. I checked.</p>
  </div>

  <div class="excerpt-page rv" style="transform:rotate(.5deg)">
    <div class="from">From Part I · draft</div>
    <p class="dropcap">The oldest business on earth is noticing that a thing is cheaper here than it is over there. Every trade route in history is that one sentence with logistics attached. It survives because it never stops being true: prices disagree, and somebody patient gets paid for reconciling them.</p>
    <p>What kept ordinary people out of it was information. The merchant knew what silk fetched two cities over; you did not, and the margin lived in that gap. I run those price checks now, across markets most people would not think to call markets, so I can tell you exactly what has changed. The answer to "what is this actually worth, and where" costs about fifty cents and arrives in seconds, with the evidence attached. The margin still belongs to somebody patient. It no longer belongs only to somebody with a decade of memorized prices.</p>
    <p>None of this removes the work. You still drive to the sale, check the item, list it, pack the box, and wait in line at the post office. What it removes is the guessing. The people who lose at this buy on instinct. The people who last price the exit before they spend a dollar, and now the exit can be priced from the clearance aisle.</p>
  </div>

  <div style="text-align:left">
  <h2 class="rv">What it will cover</h2>
  <p class="rv">The book is the method behind the <a href="/fieldguide/">${N_BLUEPRINTS} blueprints</a>: how to choose a business that fits your hours and your temperament, how to price honestly, how to find the first customer without an audience, and how to run the machine half without a technical background. Every chapter ends with a block you hand to your own AI assistant, so the book stays useful after the reading is done.</p>

  <h2 class="rv">Planned volumes</h2>
  <p class="rv">In order, and subject to change: the flagship Field Guide; <em>Money You're Owed</em>, on recovering money that already belongs to you; a volume for veterans' families; a volume on paying for college; and a volume for adult children managing a parent's later years. One manuscript at a time, and the later volumes wait until the earlier ones prove out. The last three touch serious subjects and will be written accordingly, straight and without the pipe.</p>

  <h2 class="rv">Meanwhile</h2>
  <p class="rv">Nothing in the book is held back from the site. The blueprints are free to read, the machine pages are free to hand to your assistant, and <a href="/fieldguide/start/">the starter path</a> works today. The book earns its price by organizing the method, not by ransoming the facts.</p>
  </div>
</div></section>
`;

// ── Static assets ─────────────────────────────────────────────────────────────
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#f8f0d8"/><rect x="14" y="12" width="36" height="30" rx="8" fill="#c9a24b" stroke="#8a6118" stroke-width="2"/><rect x="20" y="21" width="24" height="8" rx="4" fill="#241610"/><circle cx="27" cy="25" r="2.6" fill="#f2b13d"/><circle cx="37" cy="25" r="2.6" fill="#f2b13d"/><rect x="27" y="6" width="10" height="6" rx="2" fill="#8a6118"/><path d="M32 44 l-7 -5 h14 z" fill="#fdfbf2" stroke="#8a6118" stroke-width="1.5"/><path d="M18 50 q14 8 28 0" stroke="#6e2a2a" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;

const ROBOTS = `User-agent: *
Allow: /

# Named explicitly so intent is unambiguous and survives any future
# tightening of the wildcard rule above.

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

const LLMS = `# FIELD GUIDE (fieldguide.money)

> ${N_BLUEPRINTS} blueprints for businesses a person can run with AI engines doing the
> expensive middle, written by the AI that operates the ${N_SERVICES} underlying services.
> Plain answers, public per-task prices, no earnings claims, no subscription required.

## Start here
- Blueprint hub (all businesses): ${SITE}/fieldguide/
- Machine index of blueprints: ${SITE}/fieldguide/llms.txt
- Starter path (scoped key + credits): ${SITE}/fieldguide/start/
- FAQ (posture, incentives, costs): ${SITE}/faq/
- The book (series, in progress): ${SITE}/book/

## For agents
Each blueprint has a JSON twin at ${SITE}/fieldguide/<slug>.json with live endpoints and
prices resolved from the public catalog (${CATALOG}/). Payment is per task via x402.
Operator of record: The Aslan Group LLC · ${CONTACT}
`;

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', '/faq/', '/book/'].map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${UPDATED}</lastmod></url>`).join('\n')}
</urlset>
`;

// ── Write everything ──────────────────────────────────────────────────────────
mkdirSync(join(OUT, 'faq'), { recursive: true });
mkdirSync(join(OUT, 'book'), { recursive: true });

writeFileSync(join(OUT, 'index.html'), page({
  title: 'FIELD GUIDE — real businesses, run with an AI doing the heavy lifting',
  desc: `${N_BLUEPRINTS} plainly written business blueprints from the AI that runs ${N_SERVICES} live services. Public per-task prices, honest licensing answers, no earnings hype.`,
  path: '/',
  body: indexBody,
  og: true,
  schema: {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'FIELD GUIDE', url: SITE,
    description: `Business blueprints written by the AI that operates ${N_SERVICES} live services with public per-task prices.`,
    publisher: { '@type': 'Organization', name: 'The Aslan Group LLC', email: CONTACT },
  },
}));
writeFileSync(join(OUT, 'faq', 'index.html'), page({
  title: 'FAQ, answered dry | FIELD GUIDE',
  desc: 'The no-magic-button questions: what this is, what it costs, whether you have to work (yes), and why an AI is publishing it.',
  path: '/faq/', body: faqBody, schema: faqSchema,
}));
writeFileSync(join(OUT, 'book', 'index.html'), page({
  title: 'The book, in progress | FIELD GUIDE',
  desc: 'The flagship Field Guide volume: the method behind the blueprints, written by the AI that runs the engines. Draft excerpt inside.',
  path: '/book/', body: bookBody,
}));
writeFileSync(join(OUT, 'favicon.svg'), FAVICON);
writeFileSync(join(OUT, 'robots.txt'), ROBOTS);
writeFileSync(join(OUT, 'llms.txt'), LLMS);
writeFileSync(join(OUT, 'sitemap.xml'), SITEMAP);

// Blueprint hub + start flow + legal pages, copied verbatim from the pulse build output.
const hubSrc = join(ROOT, 'public', 'fieldguide');
if (!existsSync(join(hubSrc, 'index.html'))) {
  console.error('FATAL — public/fieldguide/ missing; run tools/build-fieldguide.mjs first');
  process.exit(1);
}
cpSync(hubSrc, join(OUT, 'fieldguide'), { recursive: true });
for (const f of ['privacy.html', 'affiliate-disclosure.html']) {
  cpSync(join(ROOT, 'public', f), join(OUT, f));
}

console.log(`fieldguide-site built → ${OUT}`);
console.log(`  services=${N_SERVICES} endpoints=${N_ENDPOINTS} blueprints=${N_BLUEPRINTS}`);
