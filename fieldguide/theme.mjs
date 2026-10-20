// FIELD GUIDE shared design system — "the gentleman naturalist's private press".
// Imported by fieldguide-site/build.mjs (landing/faq/book) and tools/build-fieldguide.mjs
// (blueprint hub) so both surfaces stay one brand. Fonts live at /fieldguide/fonts/ so the
// same URLs resolve on pulse.theaslangroupllc.com and on fieldguide.money (the hub is
// copied verbatim between them). Regenerate the sites after editing; never edit output.

// Self-hosted variable fonts (latin subsets, downloaded 2026-07-11):
// Fraunces (display, opsz 9..144 / wght 300..900) + Newsreader (text, opsz 6..72 / wght 400..700).
export const FONTS_CSS = `
@font-face{font-family:'Fraunces';font-style:normal;font-weight:300 900;font-display:swap;src:url(/fieldguide/fonts/fraunces-rm-lat.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Fraunces';font-style:italic;font-weight:300 900;font-display:swap;src:url(/fieldguide/fonts/fraunces-it-lat.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Newsreader';font-style:normal;font-weight:400 700;font-display:swap;src:url(/fieldguide/fonts/newsreader-rm-lat.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:'Newsreader';font-style:italic;font-weight:400 700;font-display:swap;src:url(/fieldguide/fonts/newsreader-it-lat.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
`;

export const FONT_PRELOADS = `
<link rel="preload" href="/fieldguide/fonts/fraunces-rm-lat.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fieldguide/fonts/newsreader-rm-lat.woff2" as="font" type="font/woff2" crossorigin>`;

// Paper grain (tiny fractal-noise SVG tile, applied as a fixed overlay).
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Ernest crest — brass roundel line mark used in the masthead and colophon.
export const CREST = `<svg class="crest" viewBox="0 0 48 48" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="24" cy="24" r="21.5" stroke-width="1.6"/><circle cx="24" cy="24" r="18.2" stroke-width=".7" opacity=".55"/><line x1="24" y1="8.5" x2="24" y2="12.5" stroke-width="1.6"/><circle cx="24" cy="7.2" r="1.5" fill="currentColor" stroke="none"/><rect x="14.5" y="12.5" width="19" height="14.5" rx="4.6" stroke-width="1.6"/><rect x="18.2" y="17" width="11.6" height="5.4" rx="2.7" stroke-width="1.2"/><circle cx="21.2" cy="19.7" r="1.15" fill="currentColor" stroke="none"/><circle cx="26.8" cy="19.7" r="1.15" fill="currentColor" stroke="none"/><path d="M24 33.5l-4.6-3.4h9.2z" stroke-width="1.3" stroke-linejoin="round"/><path d="M16.5 38.5q7.5 4.6 15 0" stroke-width="1.6" stroke-linecap="round"/></svg>`;

// Engraved section divider — rule · diamond · rule.
export const FLEURON = `<div class="fleuron" aria-hidden="true"><svg viewBox="0 0 44 12" fill="currentColor"><path d="M22 1l5 5-5 5-5-5z" opacity=".9"/><circle cx="9" cy="6" r="1.4"/><circle cx="35" cy="6" r="1.4"/></svg></div>`;

// ── Core stylesheet (tokens, chrome, ornament, motion) — shared verbatim ──────
export const THEME_CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --paper:#f5eeda;--paper-deep:#eee4c6;--card:#fbf6e8;--card-edge:#fffdf3;
  --ink:#252012;--ink-soft:#6d6450;--ink-faint:#948a70;
  --green:#1e4d2e;--green-hi:#2a6a3f;--green-soft:#e6ecdd;
  --brass:#8a6118;--brass-hi:#b8862b;--brass-glow:#d4ab4e;
  --oxblood:#6e2a35;
  --rule:#dccfa6;--hairline:#e7ddbe;
  --mahogany:#221610;--mahogany-2:#2e1e14;--cream:#f3e8cc;--cream-soft:#c9ba97;
  --shadow:60,40,8;
  --serif:'Newsreader',Georgia,'Times New Roman',serif;
  --display:'Fraunces',Georgia,serif;
  --mono:ui-monospace,'SF Mono',Menlo,Consolas,monospace;
  --foil:linear-gradient(105deg,#7a5514 0%,#c9992f 38%,#e8c568 50%,#c9992f 62%,#7a5514 100%);
}
@media(prefers-color-scheme:dark){:root{
  --paper:#191308;--paper-deep:#150f06;--card:#221a0d;--card-edge:#2a210f;
  --ink:#ecdfc0;--ink-soft:#a4956f;--ink-faint:#7d7256;
  --green:#8fc79b;--green-hi:#a7d8b1;--green-soft:#20301f;
  --brass:#d2a54a;--brass-hi:#e3bd67;--brass-glow:#f0d68c;
  --oxblood:#c07784;
  --rule:#3d331d;--hairline:#2e2614;
  --mahogany:#0f0a04;--mahogany-2:#1a1208;--cream:#eaddbd;--cream-soft:#9c8f6f;
  --shadow:0,0,0;
  --foil:linear-gradient(105deg,#a97e22 0%,#e0b954 38%,#f7e3a0 50%,#e0b954 62%,#a97e22 100%);
}}
html{scroll-behavior:smooth}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{font:400 17.5px/1.7 var(--serif);font-optical-sizing:auto;background:var(--paper);color:var(--ink);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body::after{content:'';position:fixed;inset:0;background:${GRAIN};background-size:240px;opacity:.05;pointer-events:none;z-index:2147483647}
@media(prefers-color-scheme:dark){body::after{opacity:.07}}
::selection{background:#d4ab4e;color:#241c08}
a{color:var(--green);text-decoration-thickness:1px;text-underline-offset:3px;transition:color .18s}
a:hover{color:var(--brass)}
:focus-visible{outline:2px solid var(--brass-hi);outline-offset:3px;border-radius:2px}
.wrap{max-width:1060px;margin:0 auto;padding:0 24px}
.wrap.narrow{max-width:760px}
p{margin:0 0 18px}
.muted{color:var(--ink-soft)}
strong{font-weight:600}

/* type */
h1,h2,h3,.display{font-family:var(--display);font-optical-sizing:auto;font-weight:590;letter-spacing:-.012em}
h1{font-size:clamp(38px,5.2vw,56px);line-height:1.04;margin:0 0 22px;text-wrap:balance}
h2{font-size:clamp(26px,3vw,34px);line-height:1.15;margin:0 0 16px;text-wrap:balance}
h3{font-size:21px;line-height:1.3;margin:0 0 8px}
.lede{font-size:clamp(19px,1.6vw,21px);line-height:1.65;color:var(--ink)}
.overline{font-family:var(--serif);font-size:12.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--brass);margin:0 0 18px;display:flex;align-items:center;gap:16px}
.overline::before,.overline::after{content:'';height:1px;background:linear-gradient(to right,transparent,var(--rule));flex:0 0 34px}
.overline::before{background:linear-gradient(to left,var(--rule),transparent)}
.overline.left{justify-content:flex-start}
.overline.left::before{display:none}
.overline.center{justify-content:center}
.foil{background:var(--foil);-webkit-background-clip:text;background-clip:text;color:transparent}
.smallcaps{font-size:12.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft)}

/* fleuron divider */
.fleuron{display:flex;justify-content:center;margin:0 0 18px;color:var(--brass)}
.fleuron svg{width:44px;height:12px}

/* masthead */
header.site{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--paper) 88%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--hairline);transition:box-shadow .3s,border-color .3s}
header.site.scrolled{border-bottom-color:var(--rule);box-shadow:0 10px 30px -18px rgba(var(--shadow),.5)}
header.site .wrap{display:flex;align-items:center;gap:14px;padding-top:13px;padding-bottom:13px}
.crest{width:34px;height:34px;color:var(--brass);flex:none}
.wordmark{font-family:var(--display);font-weight:640;letter-spacing:.2em;font-size:17px;color:var(--ink);text-decoration:none;line-height:1.1}
.wordmark small{display:block;font-family:var(--serif);font-style:italic;letter-spacing:.02em;text-transform:none;font-weight:400;font-size:12px;color:var(--ink-soft);margin-top:2px}
.wordmark:hover{color:var(--ink)}
nav.main{margin-left:auto;display:flex;gap:26px;align-items:center;font-size:15.5px}
nav.main a{text-decoration:none;color:var(--ink-soft);letter-spacing:.01em}
nav.main a:hover{color:var(--brass)}
nav.main a.go{color:var(--paper);background:var(--green);padding:8px 18px;border-radius:99px;font-weight:600;transition:background .2s,transform .2s,box-shadow .2s}
nav.main a.go:hover{background:var(--green-hi);color:#fff;transform:translateY(-1px);box-shadow:0 8px 18px -8px rgba(var(--shadow),.55)}
@media(max-width:640px){nav.main{gap:16px;font-size:14.5px}.wordmark small{display:none}}

/* buttons */
.btn{display:inline-block;position:relative;overflow:hidden;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:16.5px;font-weight:600;letter-spacing:.01em;border:1.5px solid var(--green);transition:transform .22s,box-shadow .22s,background .22s,color .22s}
.btn.primary{background:var(--green);color:#f7f3e4;box-shadow:0 10px 24px -12px rgba(var(--shadow),.6)}
.btn.primary::after{content:'';position:absolute;top:0;left:-80%;width:55%;height:100%;background:linear-gradient(100deg,transparent,rgba(244,225,160,.28),transparent);transform:skewX(-18deg);transition:left .5s ease}
.btn.primary:hover{background:var(--green-hi);color:#fff;transform:translateY(-2px);box-shadow:0 16px 30px -12px rgba(var(--shadow),.65)}
.btn.primary:hover::after{left:125%}
.btn.ghost{color:var(--green);background:transparent}
.btn.ghost:hover{border-color:var(--brass);color:var(--brass);transform:translateY(-2px)}
@media(prefers-color-scheme:dark){.btn.primary{background:var(--green);color:#10200f}.btn.primary:hover{color:#0c180b}}

/* framed portrait (video / art) */
.frame{position:relative;background:var(--mahogany-2);border:1px solid var(--brass);border-radius:4px;padding:10px;box-shadow:0 24px 60px -22px rgba(var(--shadow),.55),0 4px 14px -6px rgba(var(--shadow),.3)}
.frame::before{content:'';position:absolute;inset:4px;border:1px solid color-mix(in srgb,var(--brass) 55%,transparent);border-radius:2px;pointer-events:none}
.frame video,.frame img{display:block;width:100%;height:auto;border-radius:2px}
.placard{margin:14px auto 0;max-width:86%;text-align:center;font-style:italic;font-size:14.5px;color:var(--ink-soft);border:1px solid var(--hairline);border-radius:6px;padding:8px 16px;background:var(--card)}

/* cards */
.card{background:linear-gradient(180deg,var(--card-edge),var(--card));border:1px solid var(--rule);border-radius:12px;box-shadow:0 1px 0 rgba(var(--shadow),.05),0 14px 34px -26px rgba(var(--shadow),.5);transition:transform .28s cubic-bezier(.22,.6,.2,1),box-shadow .28s,border-color .28s}
.card.hov:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--brass) 55%,var(--rule));box-shadow:0 24px 44px -24px rgba(var(--shadow),.55)}

/* ledger tables */
.tablebox{overflow-x:auto}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:15.5px}
th,td{text-align:left;padding:11px 12px;border-bottom:1px solid var(--hairline);vertical-align:top}
tbody tr:hover{background:color-mix(in srgb,var(--card) 60%,transparent)}
th{font-family:var(--serif);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:var(--ink-soft);border-bottom:2px solid var(--rule)}

/* scroll reveal (js-gated so no-JS renders everything) */
html.js .rv{opacity:0;transform:translateY(18px)}
html.js .rv.in{opacity:1;transform:none;transition:opacity .75s ease,transform .75s cubic-bezier(.22,.6,.2,1);transition-delay:var(--d,0s)}
@media(prefers-reduced-motion:reduce){
  html.js .rv{opacity:1;transform:none}
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}

/* colophon footer */
footer.site{margin-top:96px;border-top:1px solid var(--rule);background:var(--paper-deep);position:relative}
footer.site::before{content:'';display:block;height:3px;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);margin-top:2px}
footer.site .wrap{padding-top:44px;padding-bottom:52px;text-align:center}
footer.site .crest{width:40px;height:40px;margin:0 auto 14px;display:block}
footer.site .fmark{font-family:var(--display);font-weight:640;letter-spacing:.24em;font-size:14px;color:var(--ink)}
footer.site .row{display:flex;flex-wrap:wrap;gap:10px 26px;justify-content:center;margin:18px 0 6px;font-size:14.5px}
footer.site .row a{color:var(--ink-soft);text-decoration:none}
footer.site .row a:hover{color:var(--brass)}
footer.site p{font-size:13.5px;color:var(--ink-soft);max-width:640px;margin:10px auto 0}
footer.site .colophon{font-style:italic;color:var(--ink-faint)}
`;

// Interaction layer: masthead shadow, scroll reveal, ledger counters, copy buttons.
export const THEME_JS = `
(function(){
var d=document,h=d.querySelector('header.site');
if(h){var on=function(){h.classList.toggle('scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on()}
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  d.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  var co=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;co.unobserve(e.target);
    var el=e.target,n=parseFloat(el.getAttribute('data-count'))||0,pre=el.getAttribute('data-pre')||'';
    if(rm||!n){el.textContent=pre+n;return}
    var t0=null;function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1300,1),e2=1-Math.pow(1-p,3);
      el.textContent=pre+Math.round(n*e2);if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  })},{threshold:.4});
  d.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)});
}else{d.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}
d.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
  var t=d.querySelector(b.getAttribute('data-copy'));if(!t)return;
  navigator.clipboard&&navigator.clipboard.writeText(t.textContent).then(function(){var o=b.textContent;b.textContent='Copied ✓';setTimeout(function(){b.textContent=o},1600)})
})});
})();
`;

export const JS_CLASS_SNIPPET = `<script>document.documentElement.classList.add('js')</script>`;
