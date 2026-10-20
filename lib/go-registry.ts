// lib/go-registry.ts — central merchant registry for the branded /go redirect layer.
//
// Why this exists: affiliate links used to embed program IDs inline, per-repo (e.g. TravelPulse's
// own lib/expedia.ts hardcoded PHG affcids). That means swapping/rotating an affiliate ID meant
// redeploying every one of the 68 verticals that might link to that merchant. Centralizing the ID
// here means ONE file to edit, plus we get click analytics (see api/go.ts) we never had before.
//
// Each entry maps a merchant slug (the ":merchant" path segment in /go/:merchant) to a builder
// that takes the pass-through query params and returns the full, affiliate-tagged destination URL.
// `tagged: false` entries have no real affiliate ID yet — they resolve to the plain merchant URL
// and are structured so dropping in a real ID later is a one-line change to the URL template.
//
// AMAZON IS DELIBERATELY NOT HERE. Amazon Associates Operating Agreement prohibits cloaking/
// obscuring the destination URL behind a redirect — Amazon links must show amazon.com directly
// in the anchor. TravelPulse's amazonTravel()/injectAffiliateTag() stay direct-with-tag and never
// route through /go. See lib/affiliate.ts in travelpulse for the enforcement point.

export interface GoEntry {
  /** Does this merchant have a real affiliate ID wired in today? */
  tagged: boolean;
  /** Build the full destination URL from the pass-through query params (already-decoded strings). */
  build(q: Record<string, string>): string;
}

// --- Expedia Group (PHG network) affiliate IDs — Gavin's Travel Creator Program enrollment. ---
// Source of truth: feedback_expedia_affiliate.md. Core affiliate ID: 1011l432132.
const HCOM_AFFCID = 'HCOM-US.DIRECT.PHG.1011l432132';
const VRBO_AFFCID = 'VRBO-US.DIRECT.PHG.1011l432132';
const EXPEDIA_AFFCID = 'US.DIRECT.PHG.1011l432132.1100l68075';

/** Accept either `dest` (the standard /go query param) or `destination`, for caller convenience. */
function destOf(q: Record<string, string>): string {
  return q.dest ?? q.destination ?? '';
}

export const GO_REGISTRY: Record<string, GoEntry> = {
  // ---------------------------------------------------------------------------------------------
  // TAGGED — real affiliate IDs, live today.
  // ---------------------------------------------------------------------------------------------
  hotels: {
    tagged: true,
    build: (q) => `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(destOf(q))}&affcid=${HCOM_AFFCID}`,
  },
  vrbo: {
    tagged: true,
    build: (q) => `https://www.vrbo.com/Hotel-Search?destination=${encodeURIComponent(destOf(q))}&affcid=${VRBO_AFFCID}`,
  },
  'expedia-hotels': {
    tagged: true,
    build: (q) => `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destOf(q))}&affcid=${EXPEDIA_AFFCID}`,
  },
  'expedia-flights': {
    tagged: true,
    build: (q) => `https://www.expedia.com/Flights-Search?destination=${encodeURIComponent(destOf(q))}&affcid=${EXPEDIA_AFFCID}`,
  },
  'expedia-cars': {
    tagged: true,
    // Expedia's car-search page uses `locn`, not `destination` — quirk preserved from the original builder.
    build: (q) => `https://www.expedia.com/carsearch?locn=${encodeURIComponent(destOf(q))}&affcid=${EXPEDIA_AFFCID}`,
  },
  'expedia-packages': {
    tagged: true,
    build: (q) => `https://www.expedia.com/Vacations-Search?destination=${encodeURIComponent(destOf(q))}&affcid=${EXPEDIA_AFFCID}`,
  },
  'expedia-activities': {
    tagged: true,
    // Expedia's activities page uses `location`, not `destination`.
    build: (q) => `https://www.expedia.com/things-to-do/search?location=${encodeURIComponent(destOf(q))}&affcid=${EXPEDIA_AFFCID}`,
  },

  // --- Polymarket (Dub-powered partner program, approved 2026-07-30; CPA: per-click + per first
  // deposit). Bare /go/polymarket -> our canonical poly.market shortlink (Dub sets its attribution
  // cookie and records the click on their side). With ?dest=<path> -> deep link straight to that
  // polymarket.com page carrying our ?via= code, so "trade this market" links land on the market
  // instead of the homepage. dest is sanitized to a same-site path — never a full URL — so /go
  // can't be abused as an open redirect. NOTE: this is the INTERNATIONAL program/product;
  // Polymarket US is a separate app-only KYC product with no wired program yet.
  polymarket: {
    tagged: true,
    build: (q) => {
      const raw = destOf(q);
      if (!raw) return 'https://poly.market/av9YTI2';
      const path = raw.replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+/, '').replace(/[?#].*$/, '');
      return `https://polymarket.com/${path}?via=av9yti2`;
    },
  },

  // ---------------------------------------------------------------------------------------------
  // UNTAGGED — no affiliate program ID wired in yet. Plain-URL passthrough today; adding a real
  // ID later is a one-line change to the template string (append `&aid=...` / `?ref=...` etc.).
  // ---------------------------------------------------------------------------------------------
  wise: {
    tagged: false,
    build: () => `https://wise.com/`,
  },
  // Discounted gift-card marketplaces (dealpulse /api/deals/giftcard, 2026-07-11). All three run
  // affiliate programs — untagged until enrollment; flip here when approvals land.
  cardcash: {
    tagged: false,
    build: () => `https://www.cardcash.com/buy-gift-cards/`,
  },
  raise: {
    tagged: false,
    build: () => `https://www.raise.com/`,
  },
  fluz: {
    tagged: false,
    build: () => `https://fluz.app/`,
  },
  airalo: {
    tagged: false,
    build: (q) => {
      const country = destOf(q).toLowerCase();
      return country ? `https://www.airalo.com/${encodeURIComponent(country)}-esim` : `https://www.airalo.com/`;
    },
  },
  // saily added 2026-07-07 — eSIM #2 (12% recurring rev-share program); untagged until enrollment
  // approved. Country-slug passthrough mirrors airalo so responses can offer both.
  saily: {
    tagged: false,
    build: (q) => {
      const country = destOf(q).toLowerCase();
      return country ? `https://saily.com/esim-${encodeURIComponent(country)}/` : `https://saily.com/`;
    },
  },
  // nordvpn FLIPPED to tagged 2026-07-03 — see TAGGED section below for the real tracked link.
  eurail: {
    tagged: false,
    build: () => `https://www.eurail.com/en/get-inspired/about-rail-travel`,
  },
  // getyourguide FLIPPED to tagged 2026-07-06 — see TAGGED section below (partner_id extracted
  // from the gyg.me shortlinks, so the dest-search passthrough survives the tagging).
  // viator FLIPPED to tagged 2026-07-07 — see TAGGED section below (pid/mcid are site-wide query
  // params, so the dest-search passthrough survives the tagging, same as getyourguide).
  // squaremouth FLIPPED to tagged 2026-07-06 — see TAGGED section below (aid=24043 is a
  // site-wide query param, so the trip-quote dest passthrough survives the tagging).
  insuremytrip: {
    tagged: false,
    build: (q) => {
      const d = destOf(q);
      return d ? `https://www.insuremytrip.com/quote/?destination=${encodeURIComponent(d)}` : `https://www.insuremytrip.com`;
    },
  },
  // Not in the original spec list but present in travelpulse/lib/affiliate.ts and equally non-Amazon
  // — routed through /go for the same centralization + analytics benefit, both untagged today.
  raileurope: {
    tagged: false,
    build: (q) => {
      const origin = q.origin ?? '';
      const d = destOf(q);
      return origin && d
        ? `https://www.raileurope.com/train/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(d)}`
        : `https://www.raileurope.com`;
    },
  },
  babbel: {
    tagged: false,
    build: (q) => {
      const lang = destOf(q).toLowerCase();
      return lang ? `https://www.babbel.com/learn-${encodeURIComponent(lang)}` : `https://www.babbel.com/`;
    },
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-03 affiliate intake batch (Gavin's brother's newly-approved programs).
  // Source: agentic-review-20260702/18-affiliate-intake-20260703.md. Most of these are plain
  // landing links — no passthrough params needed unless noted. Shortlinks (tidd.ly/AWIN,
  // tkqlhce.com+kqzyfj.com/CJ, pxf.io/Impact, e-junkie) are the networks' own trackers — we
  // redirect to them as-is, same treatment as any other tagged destination.
  // ---------------------------------------------------------------------------------------------
  ledger: {
    tagged: true,
    // Passthrough `tracker` subid for per-vertical attribution (onchainpulse, cryptopulse, ...).
    // Defaults to 'pulsenetwork' when the caller doesn't pass one.
    build: (q) => `https://shop.ledger.com/?r=cf110bdfaf52&tracker=${encodeURIComponent(q.tracker || 'pulsenetwork')}`,
  },
  trezor: {
    tagged: true,
    build: () => `https://affil.trezor.io/aff_c?offer_id=382&aff_id=159887`,
  },
  nordvpn: {
    tagged: true,
    build: () => `https://go.nordvpn.net/aff_c?offer_id=15&aff_id=149734&url_id=902`,
  },
  nordpass: {
    tagged: true,
    build: () => `https://go.nordpass.io/aff_c?offer_id=488&aff_id=149734&url_id=9356`,
  },
  worldnomads: {
    tagged: true,
    build: () => `https://kqzyfj.com/click-101770132-15736546`,
  },
  '12go': {
    tagged: true,
    build: () => `https://12go.asia/?z=16080713`,
  },
  'vin-smart': {
    tagged: true,
    build: () => `https://vinsmart.com/#a_aid=40d83638`,
  },
  vinspectorai: {
    tagged: true,
    build: () => `https://vinspectorai.com/pricing?ref=NT5O227U`,
  },
  oedro: {
    tagged: true,
    build: () => `https://tkqlhce.com/click-101770132-17045171`,
  },
  smartcredit: {
    tagged: true,
    build: () => `https://smartcredit.com/join/?pid=53401`,
  },
  danelfin: {
    tagged: true,
    // Source doc's utm_source value was truncated ("...ryangray5…"); ref=odjlmtb is the complete,
    // functional affiliate identifier — utm_source is supplementary campaign tagging, not required
    // for credit. Append the full utm_source once confirmed with the brother.
    build: () => `https://danelfin.com/?ref=odjlmtb`,
  },
  alphaspread: {
    tagged: true,
    build: () => `https://alphaspread.com/?ref=y2i1ntu`,
  },
  shopify: {
    tagged: true,
    build: () => `https://shopify.pxf.io/R0m7Dy`,
  },
  wpx: {
    tagged: true,
    build: () => `https://wpx.net/?affid=12481`,
  },
  melio: {
    tagged: true,
    build: () => `https://affiliates.meliopayments.com/rd4xlqc79zbx`,
  },
  'quickbooks-uk': {
    tagged: true,
    build: () => `https://tkqlhce.com/click-101770132-17231155`,
  },
  'celsius-herbs': {
    tagged: true,
    build: () => `https://tidd.ly/4vpzFOB`,
  },
  nextrition: {
    tagged: true,
    build: () => `https://tidd.ly/3S6WkjO`,
  },
  'canadian-insulin': {
    tagged: true,
    build: () => `https://tidd.ly/3SItKFN`,
  },
  'ideal-house': {
    tagged: true,
    build: () => `https://ideal.house/?vsource=i_3qu5tgyst7`,
  },
  'fantasy-draft-pools': {
    tagged: true,
    build: () => `https://www.e-junkie.com/ecom/gb.php?cl=116394&c=ib&aff=436130`,
  },
  'daily-grind-fantasy': {
    tagged: true,
    build: () => `https://fas.st/t/56QycFqs`,
  },
  easeus: {
    tagged: true,
    // Source doc gave two Impact media-id variants of the same c/{account}/{campaign}/{mediaid}
    // link ("c/7374350/3877232/23296 + /1964270/"); using the first, complete one as canonical.
    // The second looks like an alternate placement id for the same offer, not a distinct product —
    // confirm with the brother if a second EaseUS product (vs. placement) needs its own slug.
    build: () => `https://easeus.pxf.io/c/7374350/3877232/23296`,
  },
  'wine-express': {
    tagged: true,
    build: () => `https://wineexpress.vneoga.net/Ag24WJ`,
  },
  lendingwise: {
    tagged: true,
    build: () => `https://lendingwise.com/?fpr=ryan83`,
  },

  // --- eBay Partner Network (EPN) — campaign ID confirmed 2026-07-04. EPN's storefront onboarding
  // gates the dashboard's Link Generator behind creating a "Storefront", but the tracking itself is
  // just query-string params (mkcid/mkrid/siteid/campid/toolid/mkevt) that work on ANY ebay.com URL,
  // not only the storefront link — see reference_ebay_affiliate.md.
  ebay: {
    tagged: true,
    build: (q) => {
      const query = destOf(q);
      const base = query
        ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`
        : `https://www.ebay.com/`;
      const sep = base.includes('?') ? '&' : '?';
      const customid = encodeURIComponent(q.tracker || 'pulsenetwork');
      // Optional passthrough: _sop (eBay sort-order code, e.g. collectablespulse's completed-listings sort).
      const sop = q.sop ? `&_sop=${encodeURIComponent(q.sop)}` : '';
      return `${base}${sep}mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339163970&toolid=10001&mkevt=1&customid=${customid}${sop}`;
    },
  },

  // --- Generic / findpulse-catch-all tier (registry only; surfaced via /api/find/product etc.) ---
  rockbros: {
    tagged: true,
    build: () => `https://tidd.ly/4ark9sN`,
  },
  piscifun: {
    tagged: true,
    build: () => `https://tidd.ly/4oz0D3E`,
  },
  tidewe: {
    tagged: true,
    build: () => `https://tidd.ly/4va8INC`,
  },
  'get-out': {
    tagged: true,
    build: () => `https://tidd.ly/3RjPtTY`,
  },
  tsarbomba: {
    tagged: true,
    build: () => `https://tidd.ly/4owl9lr`,
  },
  mooncool: {
    tagged: true,
    build: () => `https://tidd.ly/43s6FsX`,
  },
  'poster-master': {
    tagged: true,
    build: () => `https://tidd.ly/4xum8Xq`,
  },
  'bonheur-jewelry': {
    tagged: true,
    build: () => `https://tidd.ly/4gsZwAj`,
  },
  'hey-happiness': {
    tagged: true,
    build: () => `https://tidd.ly/4ved46z`,
  },
  hapabox: {
    tagged: true,
    build: () => `https://tidd.ly/44uW4hD`,
  },
  'gift-lab': {
    tagged: true,
    build: () => `https://tidd.ly/4aBK94P`,
  },
  'art-of-becoming': {
    tagged: true,
    build: () => `https://tidd.ly/4aiU1jO`,
  },
  nexbie: {
    tagged: true,
    build: () => `https://tidd.ly/3SAnu2w`,
  },

  // --- 2026-07-03 late intake: full URLs recovered verbatim from Gavin's original dump
  // (the intake doc had abbreviated them; category-B exclusions below are now resolved
  // except where noted) ---
  vincheckup: {
    tagged: true,
    build: () => `https://link.moresbymedia.com/c194c3ea/aHR0cHM6Ly93d3cudmluY2hlY2t1cC5jb20vP2xhbmRpbmc9aG9tZSZpdGVtPTExJmV4aXRWYWx1ZT1PTg`,
  },
  'giftcards-visa': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=2037571.444329972993897624853467&type=2&murl=https%3a%2f%2fwww.giftcards.com%2fus%2fen%2fcatalog%2fproduct-details%2fopen-loop-gift-card%3fmode%3ddesign%26brand%3dvisa%26image-id%3d7bef047d-dd75-48ec-89cf-6fec423c33eb%26amount%3d250`,
  },
  'giftcards-mastercard': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=2037571.444329969485861529642455&type=2&murl=https%3a%2f%2fwww.giftcards.com%2fus%2fen%2fcatalog%2fproduct-details%2fopen-loop-gift-card%3fmode%3ddesign%26brand%3dmastercard%26image-id%3d61dd12c3-4799-47f5-9b89-8a2e8f922cac%26amount%3d250`,
  },
  'giftcards-college': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=2037571.44432997720862259346347&type=2&murl=https%3a%2f%2fwww.giftcards.com%2fus%2fen%2fcatalog%2fproduct-details%2fgiftofcollegecom-gift-card%3fimage-id%3d1043658%26amount%3d25`,
  },
  'wondershare-pdf': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=764692.3716019&type=2&murl=https%3a%2f%2fpdf.wondershare.com%2f`,
  },
  'wondershare-video': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=764692.3716021&type=2&murl=https%3a%2f%2fvideoconverter.wondershare.com%2f`,
  },
  'wondershare-mobiletrans': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=764692.3716015&type=2&murl=https%3a%2f%2fmobiletrans.wondershare.com%2f`,
  },
  'blockchain-council-corda': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=980864.4339511674973100354793989&type=2&murl=https%3a%2f%2fwww.blockchain-council.org%2fcorda%2fcertified-corda-developer-ccd%2f`,
  },
  'blockchain-council-polkadot': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=980864.4339512495515644491582358&type=2&murl=https%3a%2f%2fwww.blockchain-council.org%2fcertifications%2fcertified-polkadot-expert%2f`,
  },
  'blockchain-council-metaverse': {
    tagged: true,
    build: () => `https://click.linksynergy.com/link?id=0QEX85FEwm8&offerid=980864.433952078866405577683552&type=2&murl=https%3a%2f%2fwww.blockchain-council.org%2fcertifications%2fcertified-metaverse-developer%2f`,
  },
  'garden-for-wildlife': {
    tagged: true,
    build: () => `https://gardenforwildlife.com?sca_ref=11480606.ggHOOB4jjcQZoPgN&utm_source=affiliate&utm_medium=digital&utm_campaign=ryan-gray`,
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-06 affiliate intake batch (Gavin's brother's newly-approved programs).
  // Shortlink networks as before: tidd.ly=AWIN, tkqlhce/kqzyfj=CJ, sjv.io=Impact.
  // ---------------------------------------------------------------------------------------------
  getyourguide: {
    tagged: true,
    // partner_id extracted from the approved gyg.me shortlinks (both resolve to
    // getyourguide.com/...?partner_id=L7BIXDO). GYG credits the partner on any URL carrying the
    // param, so the destination-search passthrough is preserved — better than the fixed-page
    // shortlinks themselves (which point at Disneyland Paris/Shanghai product pages).
    build: (q) => {
      const d = destOf(q);
      const base = d ? `https://www.getyourguide.com/s/?q=${encodeURIComponent(d)}&` : `https://www.getyourguide.com/?`;
      return `${base}partner_id=L7BIXDO`;
    },
  },
  // ---- 2026-07-09 intake batch (brother, 16 links; shortlinks resolved to TRUE destinations) ----
  joydeco: {
    tagged: true, // AWIN mid 119863, publisher 2923017 (tidd.ly resolved) — home decor (rugs/curtains)
    build: () => `https://www.awin1.com/cread.php?awinmid=119863&awinaffid=2923017`,
  },
  outfitr: {
    tagged: true, // AWIN mid 117613 — TRUE destination outfitrer.com (fashion), not "outfitr"
    build: () => `https://www.awin1.com/cread.php?awinmid=117613&awinaffid=2923017`,
  },
  aosom: {
    tagged: true, // CJ — NOTE: link lands on aosom.RO (Romanian storefront); outdoor/garden/pet gear
    build: () => `https://www.tkqlhce.com/click-101770132-15736806`,
  },
  ngram: {
    tagged: true, // partner platform direct — AI video generation
    build: () => `https://partner.ngram.com/jfoa962nxmgm`,
  },
  carla: {
    tagged: true, // CJ → rentcarla.com — car-rental app
    build: () => `https://www.dpbolvw.net/click-101770132-17094338`,
  },
  'air-serbia': {
    tagged: true, // CJ → airserbia.com/en (second link -13957403 = fr_FR locale)
    build: () => `https://www.anrdoezrs.net/click-101770132-13957405`,
  },
  'paris-city-vision': {
    tagged: true, // CJ → pariscityvision.com — Paris tours/excursions
    build: () => `https://www.jdoqocy.com/click-101770132-15733804`,
  },
  cloudtalk: {
    tagged: true, // PartnerStack-style direct (second variant 6d65pmtwc16u held in reserve)
    build: () => `https://get.cloudtalk.io/kfsce38i25qb-1xtqvk`,
  },
  foxit: {
    tagged: true, // PartnerStack — PDF software
    build: () => `https://partnerstack.foxit.com/prxvfxguahlx`,
  },
  bookyourdata: {
    tagged: true, // PartnerStack (join.bookyourdata.com shortlink) — pay-as-you-go B2B contact lists; merchant approached us 07-31
    build: () => `https://join.bookyourdata.com/r6f8s616kxze`,
  },
  pushowl: {
    tagged: true, // PartnerStack (partnerlinks.io) — PushOwl by Brevo, web push for e-commerce; resolves to dashboard.pushowl.io signup
    build: () => `https://pushowl.partnerlinks.io/o3hidka7whnm`,
  },
  checkr: {
    tagged: true, // direct partner link — background checks
    build: () => `https://get.checkr.com/ljc4yaqs03mr`,
  },
  'cruise-direct': {
    tagged: true, // CJ → cruisedirect.com
    build: () => `https://www.kqzyfj.com/click-101770132-15734200`,
  },
  hostelpass: {
    tagged: true, // in-house ref — hostel discount card
    build: () => `https://www.hostelpass.co/hostel-card/?ref=ymyynzi`,
  },
  yesim: {
    tagged: true, // in-house partner_id — travel eSIM
    build: () => `https://yesim.app/?partner_id=4971`,
  },
  discovercars: {
    tagged: true, // in-house a_aid — car-rental comparison
    build: () => `https://www.discovercars.com/?a_aid=theaslangroupllc`,
  },
  clickfunnels: {
    tagged: true,
    build: () => `https://www.clickfunnels.com/signup-flow?aff=9df6d35c42c685a3ead8e760e39d4503e92a47a8eee0851669a2962cc08750da`,
  },
  'clickfunnels-ofa': {
    tagged: true,
    // One Funnel Away challenge — same ClickFunnels affiliate ID, education-funnel entry point.
    build: () => `https://www.onefunnelaway.com/?aff=9df6d35c42c685a3ead8e760e39d4503e92a47a8eee0851669a2962cc08750da`,
  },
  'plr-funnels': {
    tagged: true,
    build: () => `https://www.plrfunnels.com/plr-wf?aff=9df6d35c42c685a3ead8e760e39d4503e92a47a8eee0851669a2962cc08750da`,
  },
  missha: {
    tagged: true,
    // Missha US (misshaus.com) — K-beauty; the natural GlowPulse merchant.
    build: () => `https://tidd.ly/3SIBZ4G`,
  },
  fytoo: {
    tagged: true,
    // fytoo.com — fashion eyewear (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-17219120`,
  },
  ravin: {
    tagged: true,
    // ravincrossbows.com (Velocity Outdoors) — premium crossbows; findpulse outdoor tier
    // alongside tidewe (hunting gear).
    build: () => `https://www.kqzyfj.com/click-101770132-15747470`,
  },
  'coffee-bros': {
    tagged: true,
    build: () => `https://coffeebros.sjv.io/E0xbN9`,
  },
  'spirit-coffee': {
    tagged: true,
    // spiritorigincoffee.com (AWIN).
    build: () => `https://tidd.ly/4wvgYsU`,
  },
  'mutombo-coffee': {
    tagged: true,
    // Shopify storefront ref link — the ref param IS the affiliate credential.
    build: () => `https://mutombo-3262.myshopify.com?ref=ryan_gray_`,
  },
  squaremouth: {
    tagged: true,
    // Was an untagged placeholder since the /go layer was built — brother's in-house affiliate
    // ID (aid=24043) landed 2026-07-06. Same pattern as getyourguide: the ID is a query param
    // honored site-wide, so the trip-quote destination passthrough is preserved and every
    // existing /go/squaremouth link in the fleet (travelpulse, riskpulse) monetizes as-is.
    build: (q) => {
      const d = destOf(q);
      return d
        ? `https://www.squaremouth.com/trip-quote/?destination=${encodeURIComponent(d)}&aid=24043`
        : `https://www.squaremouth.com/?aid=24043`;
    },
  },
  'simple-project': {
    tagged: true,
    // simpleprojectus.com — eco kitchen/bathroom fixtures (AWIN). Surfaced via homepulse
    // (kitchen/bath tasks) + findpulse keyword tier.
    build: () => `https://tidd.ly/4vZqR1O`,
  },
  'joy-real-toys': {
    tagged: true,
    // joyrealtoys.com — Montessori wooden toys (AWIN). Surfaced via parentpulse
    // (milestone/education links) + findpulse keyword tier.
    build: () => `https://tidd.ly/3T0YXnC`,
  },
  'a-place-for-mom': {
    tagged: true,
    // aplaceformom.com — senior living advisor referrals (AWIN), $500–2,000/placement per
    // seniorpulse's own playbook notes. seniorpulse listed this as a PLAIN link since build;
    // now routed through /go with the real tracked link.
    build: () => `https://tidd.ly/3QZt9yL`,
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-11 affiliate intake batch (brother, 15 links; shortlinks resolved to TRUE
  // destinations before wiring, per standing rule). Heavy travel skew (9 of 15 → travelpulse).
  // ---------------------------------------------------------------------------------------------
  earfun: {
    tagged: true,
    // myearfun.com — EarFun earbuds/speakers (AWIN publisher 2923017 via tidd.ly).
    build: () => `https://tidd.ly/4groBM5`,
  },
  buture: {
    tagged: true,
    // ibuture.com — Buture cordless vacuums / home appliances (AWIN 2923017 via tidd.ly).
    build: () => `https://tidd.ly/4eRgA1O`,
  },
  'travelpro-eu': {
    tagged: true,
    // eu.travelpro.com — TravelPro luggage, EUROPEAN storefront (CJ). Gate to EU audiences.
    build: () => `https://www.tkqlhce.com/click-101770132-15820733`,
  },
  economybookings: {
    tagged: true,
    // economybookings.com — car-rental aggregator (in-house TargetCircle tracker,
    // campaign "The Aslan Group"). Verified: meta-refreshes to economybookings.com.
    build: () => `https://c.economybookings.com/?a=16yupj&i=evjlcf`,
  },
  loaded: {
    tagged: true,
    // loaded.com (formerly CDKeys) — digital game keys/gift cards/top-ups, 15k+ titles.
    // go.loaded.com = their branded Impact tracking domain (Cloudflare-guarded; resolves in
    // real browsers). GamePulse deals + FindPulse gaming tier.
    build: () => `https://go.loaded.com/rE0doR`,
  },
  ownr: {
    tagged: true,
    // ownr.co — RBC-backed CANADIAN business registration/incorporation (PartnerStack).
    // Canada-only service — gate to CA jurisdiction.
    build: () => `https://partners.ownr.co/fqnauxzu3ub3`,
  },
  vipcars: {
    tagged: true,
    // vipcars.com — global car-rental broker (CJ; tid=The Aslan Group LLC baked in).
    build: () => `https://www.tkqlhce.com/click-101770132-17257114`,
  },
  rentcars: {
    tagged: true,
    // rentcars.com — car-rental aggregator via Rakuten LinkShare (first Rakuten merchant in the
    // registry; publisher id 0QEX85FEwm8). NOTE: link lands on the pt-br storefront (Brazilian
    // operator) — strongest for Brazil/LatAm queries.
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=1791245.3&type=3&subid=0`,
  },
  carmellimo: {
    tagged: true,
    // carmellimo.com — NYC airport limo/car service (CJ). US/NYC airport-transfer intent.
    build: () => `https://www.kqzyfj.com/click-101770132-10553833`,
  },
  oojo: {
    tagged: true,
    // oojo.com — international flight booking (CJ).
    build: () => `https://www.dpbolvw.net/click-101770132-15789175`,
  },
  prestigia: {
    tagged: true,
    // prestigia.com — luxury/boutique hotel booking (CJ). Brother's label said "Protestigia";
    // the link resolves to prestigia.com — wired to the TRUE destination.
    build: () => `https://www.jdoqocy.com/click-101770132-13443123`,
  },
  trustedtours: {
    tagged: true,
    // trustedtours.com — US city tours & attractions tickets (CJ).
    build: () => `https://www.kqzyfj.com/click-101770132-15733420`,
  },
  seatsaero: {
    tagged: true,
    // seats.aero — award-flight (points/miles) availability search (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-17075279`,
  },
  silvergoldbull: {
    tagged: true,
    // silvergoldbull.com — precious-metals dealer, CJ "Silver Gold Bull Profit Trove" program
    // ($3-5k AOV, ~1.7% new-customer commission). Brother's label: "Silver Gold Profit Trove".
    build: () => `https://www.kqzyfj.com/click-101770132-11137147`,
  },
  signsonthecheap: {
    tagged: true,
    // signsonthecheap.com family ("Signs, Banners, and Magnets On The Cheap") — custom
    // small-business signage (CJ). MarketPulse local-marketing surface.
    build: () => `https://www.tkqlhce.com/click-101770132-15734513`,
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-07 affiliate intake batch (Gavin's brother's newly-approved programs).
  //   - viator: flipped from the untagged placeholder (see UNTAGGED breadcrumb above). pid/mcid are
  //     honored site-wide, so the /search/{dest} passthrough is preserved — same as getyourguide.
  //   - stay22-*: Stay22 is a meta-affiliate wrapper (one account, "theaslangroup"). Each merchant
  //     has its own {merchant}.stay22.com/theaslangroup/{code} tracked redirect. Treated as fixed
  //     tracked links (like the tidd.ly/CJ shortlinks) — the subdomain resolves to the merchant's
  //     affiliate-credited page. NOTE: stay22-hotels overlaps the direct `hotels` (PHG) link above;
  //     pick one per surface so the same hotel click isn't double-tagged.
  // ---------------------------------------------------------------------------------------------
  viator: {
    tagged: true,
    build: (q) => {
      const d = destOf(q);
      const base = d
        ? `https://www.viator.com/search/${encodeURIComponent(d.replace(/\s+/g, '-'))}?`
        : `https://www.viator.com/?`;
      return `${base}pid=P00308634&mcid=42383&medium=link`;
    },
  },
  'stay22-hotels': {
    tagged: true,
    build: () => `https://hotelscom.stay22.com/theaslangroup/VZ6Qhevpw6`,
  },
  'stay22-kayak': {
    tagged: true,
    build: () => `https://kayak.stay22.com/theaslangroup/eWR-7OWTUt`,
  },
  'stay22-tripadvisor': {
    tagged: true,
    build: () => `https://tripadvisor.stay22.com/theaslangroup/68UKG1h_hJ`,
  },
  'stay22-agoda': {
    tagged: true,
    build: () => `https://agoda.stay22.com/theaslangroup/gs4B8_-H9m`,
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-08 affiliate intake batch (Gavin's brother's newly-approved programs).
  //   - fed-fitness / tower-health: tidd.ly = AWIN publisher 2923017 (same as prior batches).
  //   - readingiq / amazfit: dpbolvw.net + tkqlhce.com = CJ, publisher 101770132 ("The Aslan Group LLC").
  //   - alvva: alvva.co ?via= is a Rewardful referral param (RYANGRAY).
  //   - lawdepot: in-house pid= tracking param.
  // ---------------------------------------------------------------------------------------------
  'fed-fitness': {
    tagged: true,
    // fedfitness.com (AWIN awinmid=125138) — home gym equipment: strength (racks, benches,
    // dumbbells), cardio (bikes, ellipticals, rowers, treadmills), family fitness. Surfaced via
    // fitpulse workout/equipment context.
    build: () => `https://tidd.ly/3Tm3f9b`,
  },
  'tower-health': {
    tagged: true,
    // tower-health.co.uk (AWIN awinmid=21251) — UK health-supplements retailer; the brother
    // flagged its "Lyfespan" longevity range specifically. Surfaced via longevitypulse
    // supplements + fitpulse supplement context (global-audience: a UK-first supplier is the edge).
    build: () => `https://tidd.ly/4aG2ePm`,
  },
  readingiq: {
    tagged: true,
    // CJ link the brother labelled "ABC Mouse" — it actually resolves to readingiq.com
    // (ReadingIQ, ages 5-12 reading app), a sibling Age-of-Learning product to ABCmouse under the
    // same CJ program. Wired to the real destination. Surfaced via parentpulse education context.
    build: () => `https://www.dpbolvw.net/click-101770132-13970119`,
  },
  amazfit: {
    tagged: true,
    // us.amazfit.com (CJ, Zepp Health) — budget fitness/health smartwatches & bands. The first
    // real tracked wearable link (whoop/garmin/oura in the fleet are plain untagged URLs).
    // Surfaced via fitpulse wearable + longevitypulse fitness-tracking context.
    build: () => `https://www.tkqlhce.com/click-101770132-15260968`,
  },
  alvva: {
    tagged: true,
    // alvva.co (Rewardful ?via=RYANGRAY) — low-cost self-guided USCIS applications (green cards,
    // citizenship, DACA) with independent attorney review before submission. Surfaced via
    // immigrationpulse filing-service links, alongside Boundless/CitizenPath.
    build: () => `https://www.alvva.co/en?via=RYANGRAY`,
  },
  lawdepot: {
    tagged: true,
    // lawdepot.com (in-house pid tracking) — 100s of legal document templates (contracts, wills,
    // POAs, leases, LLC operating agreements). Surfaced via legalpulse doc + estate links.
    build: () => `https://www.lawdepot.com/?pid=pg-37OPK6RUB9-generaltextlink`,
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-09 affiliate intake batch (Gavin's brother's newly-approved programs).
  // Networks as before: tidd.ly = AWIN (publisher 2923017); anrdoezrs.net = CJ (publisher
  // 101770132, "The Aslan Group LLC"); *.net Impact wrappers; fp_ref/partners.* = FirstPromoter.
  // Most are fixed tracked landing links (treated like any other shortlink); safetywing carries a
  // site-wide referenceID query param, so a passthrough survives (single-product, so home is fine).
  // NOTE: the brother also sent an AWIN tidd.ly link for OEDRO (tidd.ly/4pb505a) — oedro is ALREADY
  // wired above via CJ (tkqlhce.com/click-101770132-17045171). Kept the existing CJ link (live since
  // the 07-03 batch); the AWIN variant is a redundant tracker for the same merchant, not wired.
  // ---------------------------------------------------------------------------------------------
  demio: {
    tagged: true,
    // demio.com (FirstPromoter fp_ref) — live + automated webinar SaaS. Creator/marketing-tool tier
    // alongside clickfunnels/kit. Brother also sent learn.demio.com/automated?fp_ref=i71jyo (the
    // evergreen-webinar funnel landing); same fp_ref credits either page, home used as canonical.
    build: () => `https://demio.com?fp_ref=i71jyo`,
  },
  kit: {
    tagged: true,
    // kit.com (formerly ConvertKit) — creator email marketing (FirstPromoter partner link). Same
    // creator/marketing-SaaS tier as demio + clickfunnels.
    build: () => `https://partners.kit.com/zpdpfx6jkjgx`,
  },
  aliexpress: {
    tagged: true,
    // AliExpress marketplace (CJ). findpulse/dealpulse catch-all — universal product sourcing.
    build: () => `https://www.anrdoezrs.net/click-101770132-17242061`,
  },
  'mars-ghc': {
    tagged: true,
    // marsbyghc.com (AWIN) — US telehealth: clinically-supervised weight-loss (GLP-1) meds via
    // online consult. Surfaced via fitpulse weight-management + clearcarepulse care-navigation.
    build: () => `https://tidd.ly/4gsD0Yy`,
  },
  wavytalk: {
    tagged: true,
    // wavytalk.com (AWIN) — hair tools (thermal brushes, curling wands, straighteners, dryers).
    // Surfaced via glowpulse beauty/hair context + findpulse keyword tier.
    build: () => `https://tidd.ly/4gt2RiR`,
  },
  'fsj-shoes': {
    tagged: true,
    // fsjshoes.com (AWIN) — women's fashion shoes (heels, boots). findpulse fashion tier.
    build: () => `https://tidd.ly/4ePPDLU`,
  },
  oufer: {
    tagged: true,
    // ouferbodyjewelry.com (AWIN) — body jewelry (piercings, studs). glowpulse/findpulse tier.
    build: () => `https://tidd.ly/4f43IUG`,
  },
  mamaraya: {
    tagged: true,
    // mamaraya.com (AWIN) — personalized baby gifts + nursery décor. Surfaced via parentpulse
    // (new-baby/gift context) + findpulse gift tier.
    build: () => `https://tidd.ly/4wyuMml`,
  },
  'king-koil': {
    tagged: true,
    // kingkoil.com (AWIN) — mattresses & bedding. Surfaced via homepulse (bedroom) + findpulse.
    build: () => `https://tidd.ly/3SFLd1H`,
  },
  'kingbull-ebike': {
    tagged: true,
    // kingbullebike.com (AWIN) — electric bikes. findpulse outdoor/mobility tier alongside mooncool;
    // transitpulse car-free context.
    build: () => `https://tidd.ly/4vXPzQk`,
  },
  'my-perfume-shop': {
    tagged: true,
    // myperfumeshop (AWIN) — fragrance retailer. Surfaced via scentpulse + glowpulse + findpulse.
    build: () => `https://tidd.ly/4w42OPi`,
  },
  termly: {
    tagged: true,
    // termly.io (Impact) — privacy-policy / cookie-consent / legal-compliance generator. Surfaced
    // via legalpulse (business docs / compliance) alongside lawdepot.
    build: () => `https://termly.7zqw8y.net/vD0gJy`,
  },
  bizee: {
    tagged: true,
    // bizee.com (formerly Incfile, AWIN) — LLC / business formation & registered-agent services.
    // Surfaced via legalpulse business-formation + Business-in-a-Box Startup Engine, alongside
    // lawdepot's LLC operating-agreement docs.
    build: () => `https://tidd.ly/4wvdjep`,
  },
  klook: {
    tagged: true,
    // klook.com (Klook affiliate shortlink) — tours & activities, Asia-strong. travelpulse
    // activities tier alongside getyourguide/viator; fixed tracked link.
    build: () => `https://affiliate.klook.com/sl/CtEybSH`,
  },
  'trip-com': {
    tagged: true,
    // trip.com (Trip.com Alliance tracked shortlink) — flights, hotels, trains. travelpulse booking
    // tier alongside the Expedia/Stay22 links; fixed tracked link.
    build: () => `https://www.trip.com/t/LmnS81XWRV2`,
  },
  safetywing: {
    tagged: true,
    // safetywing.com (Ambassador program, referenceID honored site-wide) — nomad/travel medical
    // insurance. travelpulse + riskpulse insurance tier alongside worldnomads/squaremouth. Single
    // product, so the home landing with the referenceID is the credited destination.
    build: () => `https://safetywing.com/?referenceID=26559359&utm_source=26559359&utm_medium=Ambassador`,
  },

  'adguard-vpn': {
    tagged: true,
    build: () => `https://adguardpartner.com/?ref=theaslangroupllp`,
  },
  'postaffiliatepro': {
    tagged: true,
    build: () => `https://www.postaffiliatepro.com/#a_aid=theasiangroup`,
  },
  liveagent: {
    tagged: true,
    build: () => `https://www.liveagent.com/#a_aid=theasiangroup`,
  },

  // ---------------------------------------------------------------------------------------------
  // EXCLUDED — 2026-07-03 intake, NOT wired. Two categories:
  //
  // (A) 2026-07-03 late: brother confirmed all links were copy-pasted verbatim → AdGuard
  //     ("theaslangroupllp") and Post Affiliate Pro/LiveAgent ("theasiangroup") are the real
  //     registered IDs, now wired above. STILL EXCLUDED:
  //   - EpicVIN: `epicvin.com?a_aid={$refid}` — `{$refid}` is the platform's template placeholder,
  //     not an ID (copy-paste from a docs page, not the dashboard's links section). Needs the real
  //     link from the EpicVIN dashboard.
  //
  // (B) RESOLVED 2026-07-03 late: the "missing" URLs were abbreviation loss in the intake doc,
  //     not lost data — recovered verbatim from Gavin's original dump and wired above
  //     (vincheckup, giftcards-visa/-mastercard/-college, wondershare-pdf/-video/-mobiletrans,
  //     blockchain-council-corda/-polkadot/-metaverse, garden-for-wildlife).
  // ---------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-13 affiliate intake batch (23 links supplied; 19 wired).
  //
  // ⚠ FOUR LINKS IN THIS BATCH POINTED AT THE WRONG MERCHANT and are deliberately NOT wired. The
  // Rakuten offerids were duplicated across unrelated merchants, and resolving each link proved it:
  //     "Taobao Global"       -> canadapetcare.com   (offerid 354333.935, same as Canada Petcare)
  //     "Opaque Brazil"       -> flowershopping.com  (offerid 801368.69)
  //     "Oxygen Clothing UK"  -> flowershopping.com  (offerid 801368.69)
  //     "Tienda Fensa Brazil" -> pandahall.com       (offerid 1518542.3399, same as Panda Hall)
  // A user clicking "Taobao Global" would have landed in a Canadian pet pharmacy. These are not new
  // merchants at all — they are copy-paste duplicates of three merchants already in this batch, so
  // there is nothing to wire. Correct links must be re-pulled from Rakuten. (Standing rule, earned
  // twice before: ALWAYS resolve a shortlink/redirect to its TRUE destination before wiring it.)
  // ---------------------------------------------------------------------------------------------

  // — Pets —
  'canada-petcare': {
    tagged: true,
    // canadapetcare.com — pet meds/parasite control, ships to US/CA (Rakuten 0QEX85FEwm8).
    // petpulse's highest-intent merchant: its recall-check + med lanes are exactly this basket.
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=354333.935&subid=0&type=4`,
  },
  'zeal-pet': {
    tagged: true,
    // zealpetfood.com — air-dried natural pet food, NZ-origin (AWIN 2923017 via tidd.ly).
    build: () => `https://tidd.ly/44pntl2`,
  },

  // — Home / water —
  'waterdrop-filter': {
    tagged: true,
    // waterdropfilter.com — under-sink / RO water filtration (Rakuten). Routes from waterpulse
    // (contaminant findings) and homepulse.
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=1888875.3&type=3&subid=0`,
  },
  'highwood-usa': {
    tagged: true,
    // highwood-usa.com — weather-resistant outdoor/patio furniture (Rakuten).
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=1851460.7&type=3&subid=0`,
  },

  // — Travel —
  'byway-travel': {
    tagged: true,
    // byway.travel — FLIGHT-FREE holidays (rail/ferry, UK-based) (CJ 101770132).
    // Unusually good fit: it is the only merchant in the fleet that monetises a LOW-CARBON travel
    // intent, so it can route from climatepulse/travelpulse rather than competing with flights.
    build: () => `https://www.jdoqocy.com/click-101770132-17058621`,
  },
  'the-donna-portals': {
    tagged: true,
    // thedonnaportals.com — 5-star boutique hotel, Portals Nous, MALLORCA (AWIN via tidd.ly).
    // Single-property, so gate it on Spain/Balearics/Mallorca destinations only — never a generic
    // lodging fallback.
    build: () => `https://tidd.ly/44nMuwY`,
  },
  'orca-tauchreisen': {
    tagged: true,
    // orca.de — ORCA Tauchreisen, GERMAN-language dive-travel operator (AWIN via tidd.ly).
    // Gate on diving intent AND a German-speaking audience; it is not an English-language product.
    build: () => `https://tidd.ly/4gyhS2W`,
  },

  // — Outdoors / hobby —
  traverseon: {
    tagged: true,
    // traverseon.com — outdoor gear: camping, fishing, RV (AWIN via tidd.ly).
    // NOTE: supplied as "Traversean"; the real domain is traverseON. Wired to the true destination.
    build: () => `https://tidd.ly/3QS69C2`,
  },
  outsmarted: {
    tagged: true,
    // outsmarted.co.uk — "Outsmarted" live quiz-show board game, UK (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4bBnLca`,
  },
  pandahall: {
    tagged: true,
    // pandahall.com — beads, jewellery-making + craft supplies (Rakuten).
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=1518542.3399&type=3&subid=0`,
  },

  // — Beauty / apparel —
  'powder-shampoo': {
    tagged: true,
    // thepowdershampoo.com — plastic-free powder shampoo/conditioner (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vmNtYY`,
  },
  'some-slight': {
    tagged: true,
    // someslight.com — athleisure + anime merch (AWIN via tidd.ly). Supplied as "Some by Slight
    // Clothes"; true domain is someslight.com.
    build: () => `https://tidd.ly/3SW7bgU`,
  },

  // — Gifting —
  flowershopping: {
    tagged: true,
    // flowershopping.com — flower + gift delivery, US (Rakuten).
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=801368.69&type=3&subid=0`,
  },
  'flower-com': {
    tagged: true,
    // flower.com — flower delivery, US (Rakuten). Distinct merchant from flowershopping.com.
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=102910.10000079&type=3&subid=0`,
  },

  // — Business / SaaS —
  omneky: {
    tagged: true,
    // omneky.com — AI-generated ad creative + performance creative platform (CJ 101770132).
    build: () => `https://www.tkqlhce.com/click-101770132-17294042`,
  },
  'webhosting-uk': {
    tagged: true,
    // webhosting.uk.com — UK shared/VPS/reseller hosting (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wuFWsi`,
  },
  'simply-wholesale': {
    tagged: true,
    // simplywholesale.com.au — AUSTRALIAN discount/wholesale retailer (Rakuten).
    // AU-only storefront — gate on an AU audience, do not surface to US/EU deal queries.
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=776176.46&subid=0&type=4`,
  },

  // — Education / standards —
  linguatv: {
    tagged: true,
    // my.linguatv.com — LinguaTV GmbH, video-based language learning (AWIN via tidd.ly).
    // Routes from edupulse AND immigrationpulse (language requirements are a visa gate).
    build: () => `https://tidd.ly/4eUrnbA`,
  },
  ansi: {
    tagged: true,
    // webstore.ansi.org — American National Standards Institute standards store (Rakuten).
    // B2B: compliancepulse / buildpulse cite standards constantly and have never monetised them.
    build: () => `https://click.linksynergy.com/fs-bin/click?id=0QEX85FEwm8&offerid=208750.10000100&type=3&subid=0`,
  },

  // =============================================================================================
  // 2026-07-15 intake (brother, ~98 links → 84 wired). Every link below was RESOLVED to its true
  // destination before wiring (resolve-first rule, 4th consecutive batch it caught bad links).
  // REJECTED for re-pull: "Discount School Supplies"/"Really Good Stuff"/"Tradeline Supply" (all
  // resolved to arka.com — copy-paste of Arka's link), "Italki Global" (carried Snap Rentals'
  // URL), "Loja Iplace" (carried Samsung VXT's URL), "Moora Pro" (resolved to mora.hu, a
  // Hungarian children's-book publisher), Stamps.com (404 dead redirect), and 4 Rakuten fs-bin
  // links returning hard 400s (Snap Rentals, Tresorit, Samsung VXT, AmScope).
  // =============================================================================================

  // — Travel (16) —
  'ef-adventures': {
    tagged: true,
    // efadventures.com — EF adventure/group tours (CJ).
    build: () => `https://www.kqzyfj.com/click-101770132-17141071`,
  },
  'undercover-tourist': {
    tagged: true,
    // undercovertourist.com — discounted Orlando/Disney/theme-park tickets (CJ). 403s curl, fine in browsers.
    build: () => `https://www.anrdoezrs.net/click-101770132-15733832`,
  },
  'holiday-extras': {
    tagged: true,
    // holidayextras.com — UK airport parking/lounges/hotels (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wBMdlM`,
  },
  'usa-guided-tours': {
    tagged: true,
    // usaguidedtours.com — DC/NYC/Boston guided city tours (AWIN via tidd.ly).
    build: () => `https://tidd.ly/44y75yz`,
  },
  'weekend-in-italy': {
    tagged: true,
    // weekendinitaly.com — Italy attraction tickets/tours (CJ).
    build: () => `https://www.dpbolvw.net/click-101770132-17318817`,
  },
  'turbo-pass': {
    tagged: true,
    // turbopass.com — European city passes (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4bCRBwY`,
  },
  'welcome-pickups': {
    tagged: true,
    // traveler.welcomepickups.com — pre-booked airport transfers w/ meet-and-greet (CJ). 403s curl.
    build: () => `https://www.kqzyfj.com/click-101770132-17268761`,
  },
  hopegoo: {
    tagged: true,
    // hopegoo.com — global OTA (flights/hotels/trains; TongCheng's intl brand) (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-17301432`,
  },
  megabon: {
    tagged: true,
    // megabon.eu — EU hotel/spa package deals (CJ).
    build: () => `https://www.anrdoezrs.net/click-101770132-17064295`,
  },
  ovago: {
    tagged: true,
    // ovago.com — international flight booking (CJ). Brother's label "Orvago" — true dest ovago.com.
    build: () => `https://www.kqzyfj.com/click-101770132-15807941`,
  },
  'aran-grant': {
    tagged: true,
    // arangrant.com — flight deals, business/first specialists (CJ). Label "Arragant Air" — true dest arangrant.com.
    build: () => `https://www.kqzyfj.com/click-101770132-17037905`,
  },
  'travel-up': {
    tagged: true,
    // travelup.com — UK OTA flights/hotels (CJ). 403s curl, fine in browsers.
    build: () => `https://www.jdoqocy.com/click-101770132-15736463`,
  },
  samboat: {
    tagged: true,
    // samboat.es — boat/yacht rental marketplace, ES storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vnNmN7`,
  },
  'reward-flight-finder': {
    tagged: true,
    // rewardflightfinder.com — BA/Avios award-seat search (AWIN via tidd.ly). UK-skewed.
    build: () => `https://tidd.ly/4vVsSfv`,
  },
  coverforyou: {
    tagged: true,
    // coverforyou.com — UK travel insurance (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3SWR2ba`,
  },
  'corporate-housing': {
    tagged: true,
    // corporatehousingbyowner.com — furnished monthly rentals / corporate housing (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3T230jC`,
  },

  // — Pets (2) —
  aatu: {
    tagged: true,
    // aatu.co.uk — premium 80/20 dog & cat food, UK (AWIN via tidd.ly).
    build: () => `https://tidd.ly/451AvFn`,
  },
  'figo-pets-be': {
    tagged: true,
    // figopet.be — pet insurance, BELGIUM storefront (AWIN via tidd.ly). Gate on BE/EU audience.
    build: () => `https://tidd.ly/3SRxuVA`,
  },

  // — Health / longevity / care (8) —
  healthlabs: {
    tagged: true,
    // healthlabs.com — direct-to-consumer lab testing, no doctor visit (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-15735109`,
  },
  myphysicianplan: {
    tagged: true,
    // myphysicianplan.com — telehealth/concierge membership (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wF82Rt`,
  },
  'national-drug-card': {
    tagged: true,
    // nationaldrugcard.com/NDC2093 — free prescription-discount card (in-house referral code NDC2093).
    // Printable variant: /NDC2093/print_card/ndc.
    build: () => `https://www.nationaldrugcard.com/NDC2093`,
  },
  'logos-nutritionals': {
    tagged: true,
    // logosnutritionals.com — clinical-grade supplements (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4yknhkH`,
  },
  'check-my-body-health': {
    tagged: true,
    // us.checkmybodyhealth.com — food-sensitivity test kits (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4faGYCD`,
  },
  asystem: {
    tagged: true,
    // asystem.com — men's supplements (sleep/energy/joint) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wdADh5`,
  },
  nitetronic: {
    tagged: true,
    // nitetronic.com — anti-snore smart pillows (AWIN via tidd.ly). mindpulse sleep lane.
    build: () => `https://tidd.ly/4fghdRh`,
  },
  readywise: {
    tagged: true,
    // readywise.co.uk — emergency/long-term food storage, UK storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3Relg8N`,
  },

  // — Education / crypto education (3) —
  italki: {
    tagged: true,
    // italki.com — 1-on-1 language tutoring marketplace (AWIN via tidd.ly, "Italki HK Limited").
    // Routes from edupulse AND immigrationpulse alongside linguatv.
    build: () => `https://tidd.ly/4vwm8nw`,
  },
  'health-academy': {
    tagged: true,
    // uk.hfonline.org — Academy for Health & Fitness, UK online course provider (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gFqCo6`,
  },
  '101-blockchains': {
    tagged: true,
    // 101blockchains.com — blockchain/web3 certification courses (AWIN via tidd.ly). onchainpulse education lane.
    build: () => `https://tidd.ly/4ymZzUH`,
  },

  // — Business ops / marketing tools (10) —
  circle: {
    tagged: true,
    // circle.so — community platform (in-house referral).
    build: () => `https://try.circle.so/iau3rfb87qif`,
  },
  riverside: {
    tagged: true,
    // riverside.com — studio-quality podcast/video recording (PartnerStack-style in-house link).
    build: () => `https://riverside.partnerlinks.io/gr3vo6cfy3qv`,
  },
  superfiliate: {
    tagged: true,
    // superfiliate.com — affiliate/referral platform for ecommerce brands (in-house referral).
    build: () => `https://ps.superfiliate.com/v035dgxz0bs2`,
  },
  'vista-social': {
    tagged: true,
    // vistasocial.com — social-media management (in-house referral).
    build: () => `https://join.vistasocial.com/wh14exsedgdf`,
  },
  mrpeasy: {
    tagged: true,
    // mrpeasy.com — cloud manufacturing ERP for small factories (in-house referral).
    build: () => `https://try.mrpeasy.com/sacbfqojds4k`,
  },
  trainual: {
    tagged: true,
    // trainual.com — SOP/training documentation for teams (in-house referral).
    build: () => `https://start.trainual.com/c3bqnwf93ms4`,
  },
  flexclip: {
    tagged: true,
    // flexclip.com — online video editor (PearlMountain Limited, AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vLPgY9`,
  },
  updf: {
    tagged: true,
    // updf.com — PDF editor/AI PDF tools (CJ).
    build: () => `https://www.anrdoezrs.net/click-101770132-15820753`,
  },
  doba: {
    tagged: true,
    // doba.com — dropshipping supplier marketplace (CJ). Dotomi-bounces in curl (standard CJ), fine in browsers.
    build: () => `https://www.kqzyfj.com/click-101770132-17307312`,
  },
  arka: {
    tagged: true,
    // arka.com — custom eco ecommerce packaging (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-15736857`,
  },

  // — Money / credit / legal (7) —
  countabout: {
    tagged: true,
    // countabout.com — personal budgeting app (Quicken/Mint importer) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4hblFDv`,
  },
  creditfirm: {
    tagged: true,
    // creditfirm.net — credit-repair service (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wFmIQK`,
  },
  moola: {
    tagged: true,
    // app.moola-money.com — money-management app ("Moola Pro", AWIN via tidd.ly).
    build: () => `https://tidd.ly/4f4hicc`,
  },
  'cashback-remortgages': {
    tagged: true,
    // cashbackremortgages.co.uk — UK remortgage broker (AWIN via tidd.ly). UK-only.
    build: () => `https://tidd.ly/4w2OU04`,
  },
  lemurtrade: {
    tagged: true,
    // lemurtrade.com — "smart investing" retail platform (AWIN via tidd.ly). US label.
    build: () => `https://tidd.ly/3RbZp1J`,
  },
  'crystal-life-wills': {
    tagged: true,
    // wills.crystallifeplanning.co.uk — UK online wills (AWIN via tidd.ly). UK-only estate lane.
    build: () => `https://tidd.ly/4phpNUB`,
  },
  'ks-auxilia': {
    tagged: true,
    // ks-auxilia.de — German legal-costs insurance (Rechtsschutz) (AWIN via tidd.ly). DE-only.
    build: () => `https://tidd.ly/3QUyVSx`,
  },

  // — Property / construction — (deal-docket + gosource removed 2026-09-15: AWIN programs closed)
  argendon: {
    tagged: true,
    // argendon.com — crawlspace/commercial dehumidifiers (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3R6a7Hi`,
  },

  // — Deals / resale / subscriptions (4) —
  coupert: {
    tagged: true,
    // Coupert coupon-finder browser extension (AWIN via tidd.ly; lands on Chrome Web Store).
    build: () => `https://tidd.ly/3T11vlM`,
  },
  sellto: {
    tagged: true,
    // sellto.co.uk — UK device/media buyback (AWIN via tidd.ly). UK-only.
    build: () => `https://tidd.ly/4aLCnFQ`,
  },
  sharingful: {
    tagged: true,
    // sharingful.com — shared subscription slots marketplace (AWIN via tidd.ly). 403s curl.
    build: () => `https://tidd.ly/3T0pykL`,
  },
  'world-businesses': {
    tagged: true,
    // worldbusinessesforsale.com — global business-for-sale listings (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4yyyxtU`,
  },

  // — Fitness / recovery (3) —
  'ape-born': {
    tagged: true,
    // apebornfitness.com — fitness equipment/apparel (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wNh7YN`,
  },
  'plunge-chill': {
    tagged: true,
    // plungechill.com — cold-plunge tubs (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4ykV0KB`,
  },
  'copper-joe': {
    tagged: true,
    // copperjoe.com — copper-infused compression wear (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3Ra0N5d`,
  },

  // — Beauty / hair (4) —
  unice: {
    tagged: true,
    // unice.com — human-hair wigs (AWIN via tidd.ly). 403s curl (mobile redirect).
    build: () => `https://tidd.ly/4fCwBsI`,
  },
  ishowbeauty: {
    tagged: true,
    // ishowbeauty.com — human-hair wigs/extensions ("Ishowhair", AWIN via tidd.ly).
    build: () => `https://tidd.ly/4pso135`,
  },
  'arella-beauty': {
    tagged: true,
    // arella-beauty.co.uk — UK skincare/beauty (AWIN via tidd.ly).
    build: () => `https://tidd.ly/44rO68S`,
  },
  'ideo-skincare': {
    tagged: true,
    // ideoskincare.com — skincare (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4f7ADrG`,
  },

  // — Gear / gadgets / home (findpulse keyword tiers + homepulse) (21) —
  vevor: {
    tagged: true,
    // vevor.co.uk — equipment & tools megastore, UK storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wKsErQ`,
  },
  kansept: {
    tagged: true,
    // kanseptknives.com — pocket knives/EDC (Guangdong Kansept, AWIN via tidd.ly).
    build: () => `https://tidd.ly/4f5O1Oo`,
  },
  'easy-claw': {
    tagged: true,
    // easyclaw.com — pet-hair remover / lint tools (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wNB5CN`,
  },
  'time-kettle': {
    tagged: true,
    // timekettle.co — AI translator earbuds (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4fE1YCf`,
  },
  aohi: {
    tagged: true,
    // iaohi.com — GaN fast chargers/cables (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4fghW4X`,
  },
  'agm-mobile': {
    tagged: true,
    // agmmobile.com — rugged phones (AWIN cread, awinmid=94395).
    build: () => `https://www.awin1.com/cread.php?awinmid=94395&awinaffid=2923017`,
  },
  eonon: {
    tagged: true,
    // eonon.com — Android car stereos / CarPlay head units (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4aWVa0V`,
  },
  allpowers: {
    tagged: true,
    // iallpowers.eu — portable power stations/solar, EU storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gEfHLh`,
  },
  '3dmakerpro-eu': {
    tagged: true,
    // eu.store.3dmakerpro.com — 3D scanners, EU storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4eXtzz2`,
  },
  '3dmakerpro': {
    tagged: true,
    // store.3dmakerpro.com — 3D scanners, global/US storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vz3ATE`,
  },
  sirui: {
    tagged: true,
    // store.sirui.com — camera tripods/lenses/lighting (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4fb92FV`,
  },
  aosu: {
    tagged: true,
    // aosulife.com — home security cameras/doorbells (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vqh0Bn`,
  },
  'av-access': {
    tagged: true,
    // avaccess.com — HDMI/KVM extenders, AV-over-IP (AWIN via tidd.ly). 403s curl.
    build: () => `https://tidd.ly/4542iVI`,
  },
  'fenrir-moto': {
    tagged: true,
    // fenrir-moto.com — motorcycle gear/accessories (Fenrir LTD, AWIN via tidd.ly).
    build: () => `https://tidd.ly/4aUAXZD`,
  },
  lumary: {
    tagged: true,
    // lumarysmart.com — smart/permanent outdoor lighting (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3Ry3Rbq`,
  },
  'wardrobe-supplies': {
    tagged: true,
    // wardrobesupplies.com — Manhattan Wardrobe Supply, film/theater wardrobe dept supplies (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4w95P18`,
  },
  'abracadabra-nyc': {
    tagged: true,
    // abracadabranyc.com — NYC costume/magic superstore (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4bJ75Q6`,
  },
  'amanda-pearl': {
    tagged: true,
    // amandapearl.com — designer jewelry/accessories (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vATGAO`,
  },
  'sara-khatib': {
    tagged: true,
    // sarakhatib.com — designer jewelry (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3SWRVAw`,
  },
  'australia-luxe': {
    tagged: true,
    // australialuxeco.com — luxe sheepskin boots/footwear (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4pjL680`,
  },
  'love-is-a-rose': {
    tagged: true,
    // loveisarose.com — preserved-rose memorial/romance gifts (AWIN via tidd.ly). 403s curl.
    build: () => `https://tidd.ly/4hbCsX3`,
  },

  // — Specialty / misc (7) —
  'first-class-humidors': {
    tagged: true,
    // 1stclasshumidors.com — cigar humidors (AWIN via tidd.ly). Age-appropriate placement only.
    build: () => `https://tidd.ly/4gDqYvk`,
  },
  'abbe-glasses': {
    tagged: true,
    // abbeglasses.com — budget prescription eyewear (AWIN via tidd.ly).
    build: () => `https://tidd.ly/45231Xv`,
  },
  terralock: {
    tagged: true,
    // terralock.com — ground anchoring/stabilization systems (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-17313143`,
  },
  hepster: {
    tagged: true,
    // hepster.com — German embedded insurance (bike/pet/travel) (AWIN via tidd.ly). DE/EU audience.
    build: () => `https://tidd.ly/3QWpKkB`,
  },
  'homeserve-fr': {
    tagged: true,
    // assistance.homeserve.fr — home repairs/assistance, FRANCE (AWIN via tidd.ly). FR-only.
    build: () => `https://tidd.ly/44qz5Eg`,
  },
  gillygro: {
    tagged: true,
    // gillygro.com — resolved OK but product line unconfirmed (JS-walled; label "Aspiring Born").
    // Registry-only until identified — do NOT consume from verticals yet.
    build: () => `https://tidd.ly/44tK8g2`,
  },
  // nikigo REMOVED 2026-07-31 at the MERCHANT'S OWN REQUEST (via Ryan): their program had
  // auto-acceptance on by mistake and asked all affiliates to delete links until fixed.
  // Was registry-only (never consumed). Re-add only when Ryan confirms the program reopened.

  // ── 2026-07-31 intake batch (Ryan, AWIN publisher 2923017; all resolved to true dest) ──
  sunjoy: {
    tagged: true, // AWIN → sunjoyshop.com — gazebos, pergolas, sheds, carports (US)
    build: () => `https://tidd.ly/3S5Z2X2`,
  },
  heideman: {
    tagged: true, // AWIN → heideman-store.de — German jewelry (Schmuck), DE-language storefront
    build: () => `https://tidd.ly/4yN3DOx`,
  },
  'black-bow': {
    tagged: true, // AWIN → theblackbow.com — Black Bow Jewelry Co, broad fine-jewelry catalog (US)
    build: () => `https://tidd.ly/4xf8Qgp`,
  },
  blackbriar: {
    tagged: true, // AWIN → myblackbriar.com — premium backpacks & duffel bags
    build: () => `https://tidd.ly/4hJ5CwZ`,
  },
  bnbtobacco: {
    tagged: true, // AWIN → bnbtobacco.com — REGISTRY-ONLY BY DESIGN: age-restricted category,
    // deliberately NOT consumed on any consumer surface (placement decision 07-31). Link kept
    // tracked in case a fitting age-appropriate surface ever exists.
    build: () => `https://tidd.ly/3RLFuqJ`,
  },

  // ── 2026-07-31 intake batch #3 (Gavin, 10 links; all resolved to true dest before wiring) ──
  coivas: {
    tagged: true,
    // coivas.com — "Choose Health" tagline; product line unconfirmed from server-rendered HTML.
    // Registry-only until identified (gillygro precedent) — do NOT consume from verticals yet.
    build: () => `https://tidd.ly/4fLP5pF`,
  },
  'aosom-uk': {
    tagged: true, // AWIN → aosom.co.uk — UK ENGLISH storefront (sibling of `aosom` → aosom.ro).
    // Label on the intake email said "Aosam".
    build: () => `https://tidd.ly/4vS1gaj`,
  },
  veltra: {
    tagged: true, // AWIN → veltra.com/en — tours & activities marketplace, deepest in Japan
    build: () => `https://tidd.ly/4w1aYYb`,
  },
  usims: {
    tagged: true, // AWIN → App Store listing (USIMS global travel eSIM app, id1555283998)
    build: () => `https://tidd.ly/4gY4cyu`,
  },
  'zlike-hair': {
    tagged: true, // AWIN → zlikehair.com — 100% human-hair glueless lace wigs
    build: () => `https://tidd.ly/4ftchtW`,
  },
  nutrinixy: {
    tagged: true, // AWIN → nutrinixy.com — AI calorie-tracker app (intake label said "Nutrilixy"; true domain is nutriNixy)
    build: () => `https://tidd.ly/4bP4jca`,
  },
  'pyramid-pillow': {
    tagged: true, // AWIN → pyramidpillow.com — anti-snoring memory-foam pillow for side sleepers
    build: () => `https://tidd.ly/4pKU2n7`,
  },
  'trivago-ch': {
    tagged: true, // CJ → trivago.ch (de-CH) — Swiss hotel comparison; Switzerland-audience gate in travelpulse
    build: () => `https://www.kqzyfj.com/click-101832523-17246130`,
  },
  // ── 2026-07-31 intake batch #4 (Ryan, 15 links; 3 were exact dupes of thebizcheckup entries,
  // hub-registered here anyway so the FLEET can consume them; all resolved to true dest) ──
  'all-love-hair': {
    tagged: true, // AWIN → allovehair.com — human-hair wigs & bundles (sibling tier to zlike-hair)
    build: () => `https://tidd.ly/4wmhuJS`,
  },
  'shark-ninja-br': {
    tagged: true, // AWIN → sharkninjabrasil.com.br — BRAZIL Portuguese storefront; Brazil-signal gate only
    build: () => `https://tidd.ly/4fG2HTk`,
  },
  'canvas-vows': {
    tagged: true, // AWIN → canvasvows.com — personalized canvas prints (wedding vows, keepsakes)
    build: () => `https://tidd.ly/4wmhQAc`,
  },
  'sens-iq': {
    tagged: true, // AWIN → sensiqnootropics.com — nootropic supplements
    build: () => `https://tidd.ly/4h6LiFP`,
  },
  'hotels-nz': {
    tagged: true, // AWIN → nz.hotels.com — New Zealand storefront; NZ-dest gate in travelpulse
    build: () => `https://tidd.ly/4fC5SLP`,
  },
  'amen-france': {
    tagged: true, // AWIN → amen.fr — French webhosting/domains; FR-audience framing in marketpulse
    build: () => `https://tidd.ly/3TXQC4u`,
  },
  welling: {
    tagged: true, // AWIN → welling.ai — AI food-coach app (sibling of nutrinixy)
    build: () => `https://tidd.ly/4wvagU2`,
  },
  callhippo: {
    tagged: true, // partner-direct (same link as thebizcheckup entry) — cloud phone system
    build: () => `https://join.callhippo.com/0jacysltyp0y`,
  },
  'soccer-garage': {
    tagged: true, // CJ → soccergarage.com — soccer gear/cleats/jerseys
    build: () => `https://www.tkqlhce.com/click-101832523-10479704`,
  },
  sucuri: {
    tagged: true, // CJ (same link as thebizcheckup entry) — website security/malware cleanup
    build: () => `https://www.kqzyfj.com/click-101832523-15735343`,
  },
  surfshark: {
    tagged: true, // CJ (same link as thebizcheckup entry) — VPN; ToS scar: no absolutist anonymity claims
    build: () => `https://www.kqzyfj.com/click-101832523-15736773`,
  },
  peets: {
    tagged: true, // CJ → peets.com — coffee
    build: () => `https://www.dpbolvw.net/click-101832523-15734720`,
  },
  dancenter: {
    tagged: true, // CJ — intake label said "Belvilla by Oyo" but the link RESOLVES to dancenter.com
    // (sibling OYO Vacation Homes brand) — European holiday-home rentals
    build: () => `https://www.dpbolvw.net/click-101832523-17231387`,
  },
  motel6: {
    tagged: true, // CJ → motel6.com — US budget motels
    build: () => `https://www.kqzyfj.com/click-101832523-17198185`,
  },
  'morningstar-investor': {
    tagged: true, // AWIN → morningstar.com Investor product (retail investing research subscription)
    build: () => `https://tidd.ly/4fsgKgk`,
  },
  'tiktok-shop': {
    tagged: true, // CJ deep link → TikTok Shop US. ?dest=<tiktok.com URL> rides CJ's standard
    // url= deep-linking (sample product link from intake carried cjsku); bare hit → Shop home.
    build: (q) => {
      const raw = destOf(q);
      const dest = raw && /^https?:\/\/(www\.)?tiktok\.com\//i.test(raw) ? raw : 'https://www.tiktok.com/shop';
      return `https://www.dpbolvw.net/click-101832523-17106387?url=${encodeURIComponent(dest)}`;
    },
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-07-17 affiliate intake batch (Gavin, 34 links across 32 items; 33 wired, figopet
  // skipped as exact duplicate of figo-pets-be wired 07-15). All resolved to true dest before wiring.
  // ---------------------------------------------------------------------------------------------
  'systeme-io': {
    tagged: true,
    // systeme.io — all-in-one funnels/email/courses platform (in-house `sa` tracker).
    build: () => `https://systeme.io/?sa=sa0276774724f7f586312c656840add60be772c1d3`,
  },
  'text-com': {
    tagged: true,
    // text.com — Text platform (parent of LiveChat/ChatBot), AI customer-service suite (in-house `a` tracker).
    build: () => `https://www.text.com/?a=nHDtGwYDg&utm_source=PP`,
  },
  'chatbot-com': {
    tagged: true,
    // chatbot.com — no-code AI chatbot builder (Text family, same partner ID).
    build: () => `https://www.chatbot.com/?a=nHDtGwYDg&utm_campaign=pp_chatbot-default&utm_source=PP`,
  },
  livechat: {
    tagged: true,
    // livechat.com — live-chat/customer-support SaaS (Text family, same partner ID).
    build: () => `https://www.livechat.com/?a=nHDtGwYDg&utm_campaign=pp_livechat-default&utm_source=PP`,
  },
  taskade: {
    tagged: true,
    // taskade.com — AI project management / outlining / team tasks (in-house `via` tracker).
    build: () => `https://www.taskade.com/?via=2gf2wf`,
  },
  kartra: {
    tagged: true,
    // kartra.com — all-in-one marketing platform; same checkout family as WebinarJam/EverWebinar (PartnerStack).
    build: () => `https://try.kartra.com/47fvimty85ix`,
  },
  'zosi-tech': {
    tagged: true,
    // zositech.com — security cameras / NVR surveillance systems (AWIN via tidd.ly).
    // NOTE: label said "Zosi" — resolved to the security-camera company, NOT Zosi food-safety training.
    build: () => `https://tidd.ly/4ymvaWF`,
  },
  everblog: {
    tagged: true,
    // everblog.com — digital fridge calendar (family meal/schedule touchscreen) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3T1F7c5`,
  },
  'maxizoo-be': {
    tagged: true,
    // maxizoo.be — pet supplies, BELGIUM (AWIN via tidd.ly). BE audience only.
    build: () => `https://tidd.ly/4btYNLU`,
  },
  'maxizoo-fr': {
    tagged: true,
    // maxizoo.fr — pet supplies, FRANCE (AWIN via tidd.ly). FR audience only.
    build: () => `https://tidd.ly/4fgEDGh`,
  },
  'maxizoo-ie': {
    tagged: true,
    // maxizoo.ie — pet supplies, IRELAND (AWIN via tidd.ly). IE audience only.
    build: () => `https://tidd.ly/4bQDpAD`,
  },
  'maxizoo-pl': {
    tagged: true,
    // maxizoo.pl — pet supplies, POLAND (AWIN via tidd.ly). PL audience only.
    build: () => `https://tidd.ly/3Tad9L8`,
  },
  'fressnapf-at': {
    tagged: true,
    // fressnapf.at — pet food/supplies, AUSTRIA (AWIN via tidd.ly; same group as Maxi Zoo). AT only.
    build: () => `https://tidd.ly/44B3W0V`,
  },
  'fressnapf-ch': {
    tagged: true,
    // fressnapf.ch — pet food/supplies, SWITZERLAND (AWIN via tidd.ly). CH only.
    build: () => `https://tidd.ly/4wd37ro`,
  },
  'fnt-case': {
    tagged: true,
    // fntcase.com — rugged phone cases (label "Shenzhen Feinuote Electronic Technology") (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4pr27Nv`,
  },
  '2echoix': {
    tagged: true,
    // 2echoix.fr — overstock/second-chance retail ("seconde chance aux surplus de stock"), FRANCE (AWIN). FR only.
    build: () => `https://tidd.ly/3TF5Z1C`,
  },
  'glamping-hideaways': {
    tagged: true,
    // glampinghideaways.co.uk — UK glamping stays (AWIN via tidd.ly). UK audience.
    build: () => `https://tidd.ly/4wPH6Pf`,
  },
  andsafe: {
    tagged: true,
    // andsafe.de — German digital business insurance (Provinzial group) (AWIN via tidd.ly). DE only.
    build: () => `https://tidd.ly/4fkrdsN`,
  },
  'ophelia-eternity': {
    tagged: true,
    // opheliaeternity.com — eternity/moissanite jewelry (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3TpnPpf`,
  },
  magzter: {
    tagged: true,
    // magzter.com — digital magazine newsstand, 8000+ titles (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-15735236`,
  },
  'surprice-mobility': {
    tagged: true,
    // booking-form.surpricemobility.com — Surprice & Caradise car rental (CJ).
    build: () => `https://www.kqzyfj.com/click-101770132-17282212`,
  },
  'booking-italy': {
    tagged: true,
    // booking.com — CJ Italy-market program. Gate on IT audience.
    build: () => `https://www.tkqlhce.com/click-101770132-15734767`,
  },
  wallethub: {
    tagged: true,
    // wallethub.com — free credit scores / personal-finance tools (CJ).
    build: () => `https://www.dpbolvw.net/click-101770132-16959162`,
  },
  'armadillo-tough': {
    tagged: true,
    // armadillotough.com — premium GARAGE STORAGE systems (AWIN via tidd.ly). Not phone cases.
    build: () => `https://tidd.ly/3RpsF5c`,
  },
  // --- Intake 2026-07-23b (13 links; all destinations redirect-verified same day) ---
  'emergent-labs': {
    tagged: true,
    // emergent.sh — AI app-builder ("vibe-coding") platform; in-house referral link (no AWIN).
    build: () => `https://get.emergent.sh/rhsqtmdyi559`,
  },
  'ballast-gear': {
    tagged: true,
    // ballastgear.com — BEACH PILLOWS / beach gear (AWIN). Gavin's list said "Ballest Outdoor
    // Gear"; actual brand is Ballast, product is beach comfort gear, not hiking/hunting.
    build: () => `https://tidd.ly/4wpvwL0`,
  },
  'companion-candles': {
    tagged: true,
    // companioncandles.com — candles with hidden pet figurines inside (AWIN).
    build: () => `https://tidd.ly/3R6YzUg`,
  },
  'craft-buddy': {
    tagged: true,
    // craftbuddyshop.com — Crystal Art / craft kits (AWIN).
    build: () => `https://tidd.ly/4pCd3br`,
  },
  'home-zada': {
    tagged: true,
    // homezada.com — digital home-management SaaS (inventory, maintenance, finances) (AWIN).
    build: () => `https://tidd.ly/4wcIprw`,
  },
  'apparel-bags': {
    tagged: true,
    // apparelnbags.com — wholesale/bulk apparel, team & embroidery blanks (AWIN).
    build: () => `https://tidd.ly/4yCxusS`,
  },
  'blacksmith-gunsafes': {
    tagged: true,
    // blacksmithofficial.com — GUN SAFES / secure firearm storage (AWIN). NOT an apparel or
    // forge brand. Link only from home-security / secure-storage contexts.
    build: () => `https://tidd.ly/4bXB3jo`,
  },
  'chill-boys': {
    tagged: true,
    // chillboys.com — men's soft boxers/loungewear (AWIN; lands on /collections/boxers).
    build: () => `https://tidd.ly/4fRYbSM`,
  },
  'crown-and-paw': {
    tagged: true,
    // crownandpaw.com — custom PET PORTRAITS on canvas/mugs etc. (AWIN).
    build: () => `https://tidd.ly/4yxjeBL`,
  },
  'commomy-decor': {
    tagged: true,
    // commomy.com — 3D peel-and-stick wall tiles / renter-friendly decor (AWIN).
    build: () => `https://tidd.ly/4ht3klB`,
  },
  'lighted-address': {
    tagged: true,
    // lightedaddressnumbers.com — illuminated house-address number signs (AWIN).
    build: () => `https://tidd.ly/3RsRmhm`,
  },
  'carex-health': {
    tagged: true,
    // carex.com — Carex Health Brands: mobility aids, bath safety, light therapy (AWIN).
    build: () => `https://tidd.ly/4yBuLjn`,
  },
  chalkys: {
    tagged: true,
    // chalkys.com — UK VINYL/CD/DVD + merch store est. 1987 (AWIN). Media retail, not chalk.
    build: () => `https://tidd.ly/4fxM9wA`,
  },
  voluum: {
    tagged: true,
    // voluum.com — ad-campaign tracker SaaS (in-house `rt` tracker on pricing page).
    build: () => `https://voluum.com/pricing/?rt=P3Sn3D9iEkhxmfEyy129l2ggeQeVRdzpVAoNoN%2FcKrByRSRrIuWnupdsO7iJWi5G`,
  },
  gusto: {
    tagged: true,
    // gusto.com — payroll/benefits/HR for small business (PartnerStack). Final page bot-walls curl (403) but
    // partner params survive the redirect chain — verified 2026-07-17.
    build: () => `https://get.gusto.com/zgo0y861t2nz`,
  },
  sellfy: {
    tagged: true,
    // sellfy.com — creator e-commerce (digital products/print-on-demand) (PartnerStack).
    build: () => `https://get.sellfy.com/2m2o3udhhm5o`,
  },
  reclaim: {
    tagged: true,
    // reclaim.ai — AI calendar/scheduling assistant (PartnerStack).
    build: () => `https://go.reclaim.ai/1cx8srwkcm5e`,
  },
  perfumania: {
    tagged: true,
    // perfumania.com — discount designer fragrance retail (CJ).
    build: () => `https://www.tkqlhce.com/click-101770132-15733833`,
  },
  leadpages: {
    tagged: true,
    // leadpages.com — landing-page/conversion builder (PartnerStack).
    build: () => `https://try.leadpages.com/25bskqi7tnaf`,
  },
  'raw-paws': {
    tagged: true,
    // rawpawspetfood.com — raw/freeze-dried pet food (CJ).
    build: () => `https://www.kqzyfj.com/click-101770132-17244504`,
  },
  gohighlevel: {
    tagged: true,
    // gohighlevel.com — agency CRM / marketing automation (FirstPromoter `fp_ref`).
    build: () => `https://www.gohighlevel.com/?fp_ref=ov7ypy`,
  },
  'phone-com': {
    tagged: true,
    // phone.com — virtual office phone system for small business (CJ).
    build: () => `https://www.jdoqocy.com/click-101770132-15734309`,
  },
  // --- Intake 2026-07-24 (Ryan, 14 links; all destinations redirect-verified same day) ---
  // Resolve-first catches this batch: "Accor Travel" = accorplus.com (APAC membership program,
  // NOT general Accor booking); "U-MAx" = erommy.com greenhouse kits; "REVO" = revomadic.com
  // wellness/recovery tech (NOT sunglasses); Completing the Puzzle = puzzle RENTAL subscription;
  // Whokeys lands the UK storefront. wing-assistant 404s on HEAD probes but 200s on GET —
  // don't "fix" it based on a curl -I check. Last three (disco-crate, kaching-bundles,
  // wing-assistant) are also listed in thebizcheckup tool registry per Ryan.
  'russell-stover': {
    tagged: true,
    // russellstover.com — boxed chocolates / candy gifts (CJ). Standard CJ click URL; loops in
    // curl (dotomi cookie dance) but fine in real browsers.
    build: () => `https://www.dpbolvw.net/click-101832523-15736776`,
  },
  'accor-plus': {
    tagged: true,
    // accorplus.com — Accor Plus "Explorer" membership: hotel/dining discount subscription for
    // Asia-Pacific (CJ). Gavin's list said "Accor Travel" — this is the APAC loyalty-membership
    // program, NOT a general Accor hotel-booking link. Gate on APAC travel contexts.
    build: () => `https://www.dpbolvw.net/click-101832523-17277835`,
  },
  nanit: {
    tagged: true,
    // nanit.com — smart baby monitors + sleep tracking (CJ).
    build: () => `https://www.tkqlhce.com/click-101832523-17318628`,
  },
  whokeys: {
    tagged: true,
    // whokeys.com — Windows keys / Office licenses / game CD-keys (CJ). Link lands the
    // uk.whokeys.com storefront; prices in GBP.
    build: () => `https://www.anrdoezrs.net/click-101832523-17325512`,
  },
  'erommy-greenhouses': {
    tagged: true,
    // erommy.com — Gavin's list said "U-MAx"; link lands erommy.com/collections/greenhouses
    // (portable greenhouse kits; AWIN campaign homrest_93861). Garden/outdoor contexts.
    build: () => `https://tidd.ly/4vRDvzp`,
  },
  bobblegifts: {
    tagged: true,
    // bobblegifts.com — custom bobbleheads from photos (AWIN). Gift contexts.
    build: () => `https://tidd.ly/4pAfafM`,
  },
  'bee-inspired': {
    tagged: true,
    // beeinspiredgoods.com — Bee Inspired candles / home fragrance / gifts (AWIN).
    build: () => `https://tidd.ly/4gW11Y3`,
  },
  'completing-the-puzzle': {
    tagged: true,
    // completingthepuzzle.com — jigsaw-puzzle RENTAL SUBSCRIPTION ("unlimited puzzle rental,
    // best brands delivered") (AWIN). It's a subscription service, not puzzle retail.
    build: () => `https://tidd.ly/4vRJkwL`,
  },
  mailerlite: {
    tagged: true,
    // mailerlite.com — email-marketing SaaS (in-house program, sourceId=theaslangroupllc).
    build: () => `https://www.mailerlite.com/?linkId=lp_170762&sourceId=theaslangroupllc&tenantId=mailerlite`,
  },
  maono: {
    tagged: true,
    // maono.com — microphones / podcasting & streaming audio gear (AWIN).
    build: () => `https://tidd.ly/45kuRhJ`,
  },
  'revo-wellness': {
    tagged: true,
    // revomadic.com — REVO wellness/beauty/recovery tech devices ("move better, recover faster,
    // look better longer") (AWIN). NOT Revo sunglasses. Fitness-recovery / longevity / beauty-
    // device contexts.
    build: () => `https://tidd.ly/4yAkWlP`,
  },
  'disco-crate': {
    tagged: true,
    // apps.shopify.com/discocrate-whatsapp-business — DiscoCrate back-in-stock + WhatsApp
    // alerts app for Shopify stores (Shopify affiliate mref). Merchant-tooling contexts.
    build: () => `https://apps.shopify.com/discocrate-whatsapp-business?mref=dkqckuux`,
  },
  'kaching-bundles': {
    tagged: true,
    // apps.shopify.com/bundle-deals — Kaching Bundles quantity-breaks/upsell app for Shopify
    // stores (Shopify affiliate mref). Merchant-tooling contexts.
    build: () => `https://apps.shopify.com/bundle-deals?mref=dkqckuux`,
  },
  'wing-assistant': {
    tagged: true,
    // wingassistant.com — managed virtual assistants for businesses (PartnerStack-style link).
    // NOTE: 404s on HEAD requests (curl -I); resolves fine on GET with partner params intact.
    build: () => `https://affiliate.wingassistant.com/iz9vsc6p8kl3`,
  },
  // ---------------------------------------------------------------------------------------------
  // 2026-07-21 intake (Gavin, 33 links / 32 merchants). All resolved to true dest before wiring.
  // Resolve-first catches this batch: "Bee Parking Heathrow" = arcparking.co.uk; "Amazonliss" =
  // bondoxhair.com; "Walk Hero (Winggood)" = walkhero.com; BioGaia lands the UK storefront.
  // biom-pharma SKIPPED — Gavin's link was a copy-paste dup of anta-sports (same tidd.ly, resolves
  // to anta.com); re-pull queued. CJ links here use website ID 101832523 (a second CJ property,
  // distinct from the 101770132 batches). booking-aunz is the AU/NZ CJ program — a THIRD booking.com
  // program alongside booking-italy; not a duplicate, gate on AU/NZ audience.
  // ---------------------------------------------------------------------------------------------
  zenind: {
    tagged: true,
    // zenind.com — US company formation (LLC/C-corp) incl. for non-US founders (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gFIXkQ`,
  },
  webceo: {
    tagged: true,
    // webceo.com — SEO platform for agencies/in-house (in-house `id` tracker).
    build: () => `https://www.webceo.com/?id=14479`,
  },
  unbounce: {
    tagged: true,
    // unbounce.com — landing-page builder + CRO (PartnerStack, same NGUyMWI0MDU3ZWNi family as kartra/gusto).
    build: () => `https://unbounce.partnerlinks.io/gc221z2piapj`,
  },
  whatconverts: {
    tagged: true,
    // whatconverts.com — lead/call tracking + attribution SaaS (PartnerStack).
    build: () => `https://partners.whatconverts.com/1538s0cb0tfp`,
  },
  'bigb-energy': {
    tagged: true,
    // bigbenergy.com — energy drinks DTC (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3T6gQ4F`,
  },
  'bask-suncare': {
    tagged: true,
    // basksuncare.com — non-greasy SPF sunscreen DTC (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4b2VDi4`,
  },
  'biogaia-uk': {
    tagged: true,
    // uk.biogaia.com — BioGaia probiotics UK storefront (AWIN via tidd.ly). Gate on UK audience.
    build: () => `https://tidd.ly/4fh2mWM`,
  },
  autelpilot: {
    tagged: true,
    // autelpilot.com — Autel EV home chargers / EVSE (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4ytU5aO`,
  },
  geekshare: {
    tagged: true,
    // geekshare.com — gaming accessories (Switch/console cases, grips, decor) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/45jySD3`,
  },
  'beetles-gel': {
    tagged: true,
    // beetlesgel.com — Beetles gel nail polish kits (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4puqSZt`,
  },
  colamy: {
    tagged: true,
    // colamyhome.com — home office / accent furniture (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4feIAg8`,
  },
  'anta-sports': {
    tagged: true,
    // anta.com — ANTA athletic footwear/apparel (Kai/KAI 1 basketball line) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4fK0nvz`,
  },
  birdfy: {
    tagged: true,
    // birdfy.com — smart bird-feeder cameras (AWIN via tidd.ly). Also a Birdie Bazaar stall.
    build: () => `https://tidd.ly/4fnOs5l`,
  },
  aromapassions: {
    tagged: true,
    // aromapassions.com — essential-oil diffusers / aromatherapy (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4vGyBVA`,
  },
  'asia-foodland': {
    tagged: true,
    // asiafoodland.de — DE Asian grocery e-commerce (AWIN via tidd.ly). Gate on DE audience.
    // Final page bot-walls curl (403) but AWIN params survive the chain — same as gusto/magzter precedent.
    build: () => `https://tidd.ly/4hnBDdV`,
  },
  'bavaria-direkt': {
    tagged: true,
    // bavariadirekt.de — DE direct insurer (car/liability/household) (AWIN via tidd.ly). Gate on DE
    // audience, spelled-out "Germany" too per ks-auxilia/andsafe precedent.
    build: () => `https://tidd.ly/4hoRFUN`,
  },
  'big-poppa-smokers': {
    tagged: true,
    // bigpoppasmokers.com — DIY drum smoker kits + BBQ supplies (AWIN via tidd.ly). Cloudflare-403s
    // curl but fine in browsers. Also a Birdie Bazaar stall.
    build: () => `https://tidd.ly/4vZBbq9`,
  },
  'arc-parking-heathrow': {
    tagged: true,
    // arcparking.co.uk — Heathrow meet & greet airport parking (AWIN via tidd.ly). Label said "Bee
    // Parking" but resolves to ARC Parking — wired to TRUE dest. Gate on UK/LHR travel.
    build: () => `https://tidd.ly/4gNqinl`,
  },
  'cumberland-hotel': {
    tagged: true,
    // thecumberland.com — The Cumberland Hotel, London Marble Arch (AWIN via tidd.ly). Gate on London.
    build: () => `https://tidd.ly/4yrLCFn`,
  },
  bermies: {
    tagged: true,
    // bermies.com — men's swim trunks / beachwear DTC (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4pPmwMN`,
  },
  'bondox-hair': {
    tagged: true,
    // bondoxhair.com — keratin / hair-botox treatments (AWIN via tidd.ly). Label said "Amazonliss"
    // (a sister keratin brand) but resolves to Bondox — wired to TRUE dest.
    build: () => `https://tidd.ly/4bqsIEK`,
  },
  'big-wall-decor': {
    tagged: true,
    // bigwalldecor.com — oversized canvas wall art (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4fJDzw6`,
  },
  personalhour: {
    tagged: true,
    // personalhour.com — home Pilates reformers + accessories (AWIN via tidd.ly). Also a Birdie Bazaar stall.
    build: () => `https://tidd.ly/4wXYaTo`,
  },
  'grama-wellness': {
    tagged: true,
    // gramawellness.com — herbal wellness / supplements (AWIN via tidd.ly). Label spelled "Gramma".
    build: () => `https://tidd.ly/4vLIUrz`,
  },
  walkhero: {
    tagged: true,
    // walkhero.com — orthotic insoles for plantar fasciitis / flat feet (AWIN via tidd.ly). Label
    // said "Winggood" (parent co) but consumer brand/dest is WalkHero.
    build: () => `https://tidd.ly/4gJsV9F`,
  },
  cosabella: {
    tagged: true,
    // cosabella.com — Italian luxury lingerie/loungewear (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3Taephy`,
  },
  'relax-the-back': {
    tagged: true,
    // relaxtheback.com — ergonomic back-care retail (zero-gravity recliners, office chairs, sleep) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wT848C`,
  },
  parallels: {
    tagged: true,
    // parallels.com — Parallels Desktop, run Windows on Mac (CJ, website ID 101832523). CJ click
    // URLs loop in curl (dotomi cookie dance) — standard, fine in browsers.
    build: () => `https://www.kqzyfj.com/click-101832523-15733336`,
  },
  'booking-aunz': {
    tagged: true,
    // booking.com — CJ Australia/NZ-market program. Gate on AU/NZ audience (sibling of booking-italy).
    build: () => `https://www.anrdoezrs.net/click-101832523-17293136`,
  },
  ambir: {
    tagged: true,
    // shop.ambir.com — document/card scanners + signature pads (healthcare/legal office hardware) (CJ).
    build: () => `https://www.anrdoezrs.net/click-101832523-17248333`,
  },
  uniqode: {
    tagged: true,
    // uniqode.com — QR-code generator/management platform (PartnerStack).
    build: () => `https://try.uniqode.com/2hkahfb162ab`,
  },
  bluehost: {
    tagged: true,
    // bluehost.com — web hosting / WordPress (Impact sjv.io, campaign "The Aslan Group LLC").
    // Final page bot-walls curl (403) but clickid/irpid params survive the chain.
    build: () => `https://bluehost.sjv.io/PzY5zN`,
  },
  pictory: {
    tagged: true,
    // pictory.ai — AI video creation from scripts/blogs (FirstPromoter `fpr`).
    build: () => `https://pictory.ai/?fpr=ryan-gray58`,
  },

  // ---------------------------------------------------------------------------------------------
  // 2026-07-23 intake (Gavin, 24 links). All tidd.ly = AWIN publisher 2923017; Freshworks ×2 +
  // Thordata = PartnerStack (shared partner key). Resolve-first catches this batch: "Cowan
  // Technologies Medical Supplies" → cowinaudio.com (COWIN headphones); "Waterline Surf" →
  // waterline-surf.com is a VPN service, not surf gear.
  // ---------------------------------------------------------------------------------------------
  freshdesk: {
    tagged: true,
    // freshworks.com/freshdesk — AI customer-service/helpdesk SaaS (PartnerStack).
    build: () => `https://affiliatepartner.freshdesk.com/6k3fos4x0b9h`,
  },
  freshservice: {
    tagged: true,
    // freshworks.com/freshservice — ITSM / IT service desk SaaS (PartnerStack).
    build: () => `https://affiliatepartner-freshservice.freshworks.com/4ykommpum7yp`,
  },
  thordata: {
    tagged: true,
    // thordata.com — residential/datacenter proxy network for web-data collection (PartnerStack).
    build: () => `https://affiliate.thordata.com/y8njxn7ut7cq`,
  },
  'baby-lock': {
    tagged: true,
    // babylock.com — sewing/embroidery/quilting machines (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4hoOgW2`,
  },
  'black-bee-honey': {
    tagged: true,
    // blackbeehoney.com — British raw honey DTC (AWIN via tidd.ly). UK skew.
    build: () => `https://tidd.ly/3TPfFXp`,
  },
  'best-direct': {
    tagged: true,
    // bestdirect.co.uk — UK direct-response home shopping (as-seen-on-TV housewares) (AWIN via tidd.ly). Gate on UK.
    build: () => `https://tidd.ly/4pwnUDE`,
  },
  bedsure: {
    tagged: true,
    // bedsurehome.com — bedding / comforters / pet blankets DTC (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4ywbcJj`,
  },
  verwoehnwochenende: {
    tagged: true,
    // verwoehnwochenende.de — DE short-break / wellness-weekend hotel packages (AWIN via tidd.ly).
    // Gate on Germany/DACH travel, spelled-out country names too.
    build: () => `https://tidd.ly/4yGRhHJ`,
  },
  'be-green': {
    tagged: true,
    // be.green — online plant shop, Spanish-language storefront shipping Iberia/EU (AWIN via
    // tidd.ly). Label said "Portugal"; site is es-language — gate on Spain/Portugal/EU.
    build: () => `https://tidd.ly/3Txt4Dn`,
  },
  'and-keep': {
    tagged: true,
    // andkeep.com — UK eco-friendly / reusable / sustainable goods shop (AWIN via tidd.ly). UK skew.
    build: () => `https://tidd.ly/4yyZ1v3`,
  },
  cosmondial: {
    tagged: true,
    // cosmondial.com — DE natural-cosmetics house (benecos + GRN brands) (AWIN via tidd.ly).
    // Gate on Germany/DACH audience.
    build: () => `https://tidd.ly/4pxzFtF`,
  },
  geberich: {
    tagged: true,
    // geberich.eu — natural supplements, EU storefront (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wQWI4Y`,
  },
  'laboratoire-laurent': {
    tagged: true,
    // laboratoirelaurent.com — French "compléments alimentaires" (dietary supplements) (AWIN via
    // tidd.ly). Gate on France/francophone audience.
    build: () => `https://tidd.ly/4yqXqaG`,
  },
  'purty-body': {
    tagged: true,
    // purtybody.com — body-care / skincare DTC (AWIN via tidd.ly). Site bot-walls curl but AWIN
    // params survive the chain — gusto/magzter precedent.
    build: () => `https://tidd.ly/3T5pZdM`,
  },
  parkimeter: {
    tagged: true,
    // parkimeter.com — European city/airport parking reservations (AWIN via tidd.ly). Sits beside
    // arc-parking-heathrow in the travel parking lane; Europe origin/dest gate.
    build: () => `https://tidd.ly/3TOfJGR`,
  },
  'led-equipped': {
    tagged: true,
    // ledequipped.com — emergency-vehicle light bars / sirens / tow-truck lighting (AWIN via
    // tidd.ly). Label spelled "LED Equiped"; site is ledequipped.com.
    build: () => `https://tidd.ly/3RMvQUU`,
  },
  starlino: {
    tagged: true,
    // thestarlino.com — Starlino maraschino cherries + aperitif (cocktail pantry) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gRrNRq`,
  },
  'thierry-lasry': {
    tagged: true,
    // thierrylasry.com — French luxury handmade sunglasses (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wsAQNm`,
  },
  comenii: {
    tagged: true,
    // comenii.com — COMENII medical scrubs / uniforms (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4yBafza`,
  },
  barfgold: {
    tagged: true,
    // barfgold.com — DE raw dog food (BARF frozen meals/supplements) (AWIN via tidd.ly). Gate on
    // Germany/DACH audience; site bot-walls curl but AWIN params survive.
    build: () => `https://tidd.ly/3R6C6qn`,
  },
  'cowin-audio': {
    tagged: true,
    // cowinaudio.com — COWIN noise-cancelling headphones / speakers (AWIN via tidd.ly). Label said
    // "Cowan Technologies Medical Supplies" but resolves to COWIN audio — wired to TRUE dest;
    // flagged to Gavin in case a separate medical-supplies link exists.
    build: () => `https://tidd.ly/4py2Hct`,
  },
  'bruno-marc': {
    tagged: true,
    // brunomarc.com — budget men's dress/casual shoes DTC (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gWqsc9`,
  },
  'burton-goods': {
    tagged: true,
    // burtongoods.com — Burton Goods leather bags / accessories (AWIN via tidd.ly). Label said
    // "Burton Leather Goold". Site bot-walls curl but AWIN params survive.
    build: () => `https://tidd.ly/4fRYwnF`,
  },

  // ---------------------------------------------------------------------------------------------
  // TAGGED — 2026-08-05 affiliate intake batch (Ryan via Gavin, 16 links; 14 wired). Skipped:
  // unnamed first link = exact dupe of motel6 (same CJ click ID 17198185); "Rewarx AI" link was a
  // byte-dupe of Sojos Vision — re-pull from Ryan. All resolved to true dest before wiring.
  // ---------------------------------------------------------------------------------------------
  printify: {
    tagged: true,
    // printify.com — print-on-demand platform (PartnerStack, same NGUyMWI0MDU3ZWNi partner-key
    // family as bookyourdata/pushowl). Gavin: "business in a box" — POD side-business enabler.
    build: () => `https://try.printify.com/r8iv48xdwlyu`,
  },
  apollo: {
    tagged: true,
    // apollo.io — B2B sales platform (contact database + engagement) (PartnerStack).
    build: () => `https://get.apollo.io/e13qqixaqonv`,
  },
  brkox: {
    tagged: true,
    // brkox.com — LEGO Speed Champions F1 wall display frames for collectors (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3TQpynL`,
  },
  sylvane: {
    tagged: true,
    // sylvane.com — air treatment retailer (purifiers, dehumidifiers, humidifiers) (CJ).
    build: () => `https://www.dpbolvw.net/click-101832523-15734506`,
  },
  'safari-en-afrique': {
    tagged: true,
    // safarienafrique.fr — FRENCH-language Africa safari tour operator (AWIN via tidd.ly).
    // Gate on French-language / FR audience signals. Site bot-walls curl; AWIN params survive.
    build: () => `https://tidd.ly/3TTbM3M`,
  },
  'cut-golf': {
    tagged: true,
    // cutgolf.co — Cut Golf DTC golf balls / gear (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4z0uhng`,
  },
  promeed: {
    tagged: true,
    // promeed.com — mulberry-silk bedding / organic sleep products (AWIN via tidd.ly). Name reads
    // medical but it's a sleep/bedding brand — wired to what it actually sells.
    build: () => `https://tidd.ly/453zTPO`,
  },
  'easyname-at': {
    tagged: true,
    // easyname.AT (German-language, Austrian storefront) — domains + webhosting (AWIN via tidd.ly).
    // Label said "Webhost DE"; true dest is .at — gate on German-language / DACH signals.
    build: () => `https://tidd.ly/3Sap5fJ`,
  },
  'breeze-esim': {
    tagged: true,
    // breezesim.com — global travel eSIM, 190+ countries from $3.99 (AWIN via tidd.ly). Label said
    // "UK" but the product is global — no UK gate needed.
    build: () => `https://tidd.ly/4yVvMTw`,
  },
  'sojos-vision': {
    tagged: true,
    // sojosvision.com — budget prescription eyewear DTC (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wBD4dv`,
  },
  'funded-trading-plus': {
    tagged: true,
    // fundedtradingplus.com — prop-trading evaluation firm (CJ). Intake label said "Instant
    // Funding Prop Trading" but the link RESOLVES to Funded Trading Plus — wired to TRUE dest.
    // High-risk financial category: consumption stays query-gated + risk-disclosed only.
    build: () => `https://www.tkqlhce.com/click-101832523-17333052`,
  },
  'virgin-mobile-uae': {
    tagged: true,
    // virginmobile.ae — UAE mobile carrier (CJ). Gate on UAE audience/destination signals.
    build: () => `https://www.jdoqocy.com/click-101832523-17231963`,
  },
  'natura-market': {
    tagged: true,
    // naturamarket.ca — CANADIAN online health-food grocery (keto/paleo/organic) (CJ). CA gate.
    build: () => `https://www.dpbolvw.net/click-101832523-15735394`,
  },
  judgeme: {
    tagged: true,
    // apps.shopify.com/judgeme — Judge.me product-review app for Shopify stores (Shopify app
    // referral, mref=dkqckuux). Ryan: feature on thebizcheckup too.
    build: () => `https://apps.shopify.com/judgeme?mref=dkqckuux`,
  },
  myautoloan: {
    tagged: true,
    // myautoloan.com — auto-loan marketplace (CJ). Consumer lending: always beside rate-shopping
    // advice, never sole option.
    build: () => `https://www.kqzyfj.com/click-101832523-15203862`,
  },

  // ===============================================================================================
  // 2026-08-21 intake (Ryan, 44 links). Every label resolve-first verified against its TRUE dest.
  // Label-vs-reality catches this batch: "Elizar Wellness Shots" = elixirshots.com · "Capuccine" =
  // capucinne.com · "Biopropyl" = bioprophyl.BE (Dutch-language Belgian storefront) · "Abrosia
  // Systems" = AmbrosiaSys.com (non-invasive CGM ring, NOT a food brand) · "CG Hunter" = faux
  // plants / home decor (NOT luggage) · "MOYO" = moyu-notebooks.com (erasable stone-paper) ·
  // "Run for Freedom" = a nonprofit 5K registration, not a merchant · "Engine DIY Shop
  // (Shenzhen K)" = enginediyshop.com model-engine build kits.
  // ===============================================================================================

  // — Trivago country storefronts (CJ). Each is a distinct locale; gate on audience/destination
  //   country in travelpulse, same pattern as the existing trivago-ch entry. —
  'trivago-at': {
    tagged: true, // CJ → trivago.at (de-AT) — Austrian hotel comparison
    build: () => `https://www.kqzyfj.com/click-101832523-17237097`,
  },
  'trivago-br': {
    tagged: true, // CJ → trivago.com.br (pt-BR) — Brazilian hotel comparison
    build: () => `https://www.jdoqocy.com/click-101832523-17246129`,
  },
  'trivago-jp': {
    tagged: true, // CJ → trivago.jp (ja) — Japanese hotel comparison
    build: () => `https://www.tkqlhce.com/click-101832523-17247167`,
  },
  'trivago-tr': {
    tagged: true, // CJ → trivago.com.tr (tr) — Turkish hotel comparison
    build: () => `https://www.kqzyfj.com/click-101832523-17246601`,
  },

  // — Travel / relocation —
  'magical-shuttle': {
    tagged: true,
    // magicalshuttle.co.uk — Disneyland Paris <-> CDG/Orly airport shuttle transfers (CJ).
    // Lands the booking page. Paris/Disneyland-destination gate.
    build: () => `https://www.tkqlhce.com/click-101832523-11423882`,
  },
  huurwoningen: {
    tagged: true,
    // huurwoningen.nl — DUTCH-language Netherlands long-term rental-housing marketplace (AWIN).
    // Relocation/expat housing, not holiday lets. NL-audience gate only.
    build: () => `https://tidd.ly/4qbSoez`,
  },

  // — Business software / SaaS (thebizcheckup lane) —
  pipedrive: {
    tagged: true,
    // pipedrive.com — sales CRM (PartnerStack, NGUyMWI0MDU3ZWNi partner-key family, same as
    // apollo/printify/bookyourdata/pushowl). Two-month approval; Ryan: put it on thebizcheckup.
    build: () => `https://aff.trypipedrive.com/7e46tays64g8`,
  },
  consensus: {
    tagged: true,
    // consensus.app — AI search over peer-reviewed research papers (PartnerStack, same key family).
    build: () => `https://get.consensus.app/enbot3wzjxf0`,
  },
  brizy: {
    tagged: true,
    // brizy.io — AI website builder / white-label site platform (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4qgrbYg`,
  },
  stoq: {
    tagged: true,
    // apps.shopify.com/back-in-stock-restock-alerts — Stoq, back-in-stock + preorder alerts for
    // Shopify stores (Shopify app referral, mref=dkqckuux — same code as judgeme/discocrate).
    build: () => `https://apps.shopify.com/back-in-stock-restock-alerts?mref=dkqckuux`,
  },
  wondershare: {
    tagged: true,
    // wondershare.com — consumer/prosumer software house (Filmora video, PDFelement, Recoverit,
    // UniConverter). Lands the individuals shop page (CJ).
    build: () => `https://www.jdoqocy.com/click-101832523-15733675`,
  },
  efile: {
    tagged: true,
    // e-file.com — US federal/state online tax filing (CJ). Lands account registration.
    // SEASONAL + US-only: never surface outside a US tax-filing context.
    build: () => `https://www.jdoqocy.com/click-101832523-11917138`,
  },

  // — Outdoors / gear —
  'kings-camo': {
    tagged: true,
    // kingscamo.com — hunting camo apparel + optics/packs (CJ).
    build: () => `https://www.jdoqocy.com/click-101832523-15784057`,
  },
  'fire-maple': {
    tagged: true,
    // firemaplegear.com — backpacking/camping stoves + cookware (AWIN via tidd.ly). Link lands the
    // camping-stoves collection.
    build: () => `https://tidd.ly/4cqfbNR`,
  },
  'merino-tech': {
    tagged: true,
    // merino.tech — merino wool base layers, socks, blankets (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4z5wFZT`,
  },

  // — Home / household —
  'alorair-crawlspace': {
    tagged: true,
    // aloraircrawlspace.com — AlorAir commercial-grade crawl space + basement dehumidifiers
    // (70-235 PPD, WiFi models, sump pumps) (AWIN via tidd.ly). Cloudflare-walls curl; fine in
    // browsers. Damp/mold/crawl-space task gate — sibling to sylvane air-quality tier.
    build: () => `https://tidd.ly/4bSC5xo`,
  },
  'affordable-blinds': {
    tagged: true,
    // affordableblinds.com — made-to-measure window blinds/shades (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4z47JC5`,
  },
  'mihri-kilim': {
    tagged: true,
    // mihrikilim.com — machine-washable Turkish kilim-pattern rugs (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gvSr1o`,
  },
  beddley: {
    tagged: true,
    // beddley.com — patented three-sided zippered duvet covers (Shark Tank) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3Spo8QP`,
  },
  'cg-hunter': {
    tagged: true,
    // cghunter.com — luxury FAUX PLANTS/flowers + holiday & home decor (AWIN via tidd.ly).
    // Label "CG Hunter" reads like luggage/3D-assets; it is neither. Decor tier only.
    build: () => `https://tidd.ly/3S5DN7R`,
  },
  'enjoy-the-wood': {
    tagged: true,
    // enjoythewood.com — engraved wooden wall maps, art and personalized gifts (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xCApAx`,
  },
  anran: {
    tagged: true,
    // anran-cctv.com — ANRAN DIY wireless/solar/4G home security camera systems (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4z5EApW`,
  },
  garvee: {
    tagged: true,
    // garvee.com — commercial/MRO equipment: power tools, food service, agriculture, automotive,
    // plumbing, gardening (AWIN via tidd.ly). Broad catalog — gate on the specific tool noun.
    build: () => `https://tidd.ly/4fPwqKU`,
  },

  // — Pets —
  'meow-picks': {
    tagged: true,
    // themeowpicks.com — curated modern/designer CAT furniture + accessories from independent
    // makers; donates a portion of each order to cat rescue (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4wUMv7X`,
  },
  meowant: {
    tagged: true,
    // meowant.com — pet-care hardware: self-cleaning litter boxes, automatic feeders, fountains
    // (AWIN via tidd.ly). Distinct from meow-picks (furniture/decor) — do not co-fire blindly.
    build: () => `https://tidd.ly/4g8gKkP`,
  },

  // — Kitchen / food —
  imarku: {
    tagged: true,
    // imarku.net — Japanese-style chef knives, knife sets and cookware (AWIN via tidd.ly).
    build: () => `https://tidd.ly/45sWmWB`,
  },
  epicured: {
    tagged: true,
    // epicured.com — low-FODMAP + gluten-free prepared meal delivery built for IBS/IBD/Crohn's/
    // SIBO (AWIN via tidd.ly). MEDICAL-ADJACENT: describe as a dietitian-designed low-FODMAP meal
    // service, never as treatment for a diagnosed condition.
    build: () => `https://tidd.ly/4qhU5ao`,
  },
  'elixir-shots': {
    tagged: true,
    // elixirshots.com — cold-pressed organic wellness shots, no added sugar (AWIN via tidd.ly).
    // Intake label said "Elizar" — the brand is Elixir Shots.
    build: () => `https://tidd.ly/3SyphWk`,
  },

  // — Hobby / play / creative —
  'puzzle-master': {
    tagged: true,
    // puzzlemaster.ca — CANADIAN jigsaw/brain-teaser/mechanical puzzle specialist (AWIN via
    // tidd.ly). Ships internationally but prices/stock are CA-first.
    build: () => `https://tidd.ly/4xJC5s3`,
  },
  enginediy: {
    tagged: true,
    // enginediyshop.com — buildable model engine kits: MOC engine brick sets, live steam engines,
    // Stirling engines (AWIN via tidd.ly). Intake label "Shenzhen K" is the merchant entity.
    build: () => `https://tidd.ly/4wSRpCH`,
  },
  easysmx: {
    tagged: true,
    // easysmx.com — budget wireless game controllers + headsets for PC/Switch/mobile (AWIN).
    build: () => `https://tidd.ly/4z9Gxlk`,
  },
  'silver-brush': {
    tagged: true,
    // silverbrush.com — Silver Brush Limited, fine-artist paint brushes and art supplies (AWIN).
    build: () => `https://tidd.ly/4zazxVh`,
  },
  moyu: {
    tagged: true,
    // shop.moyu-notebooks.com — MOYU erasable stone-paper notebooks + stationery (AWIN via
    // tidd.ly). Intake label "MOYO"; the brand is MOYU.
    build: () => `https://tidd.ly/4z8k0W1`,
  },
  rotoballer: {
    tagged: true,
    // rotoballer.com — fantasy-sports rankings/projections + premium subscriptions (AWIN).
    build: () => `https://tidd.ly/4g3rrVA`,
  },

  // — Style / personal —
  natkina: {
    tagged: true,
    // natkina.com — NATKINA Swiss-made affordable-luxury jewellery (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xvshS8`,
  },
  capucinne: {
    tagged: true,
    // capucinne.com — handcrafted custom engagement + wedding rings, recycled metals and
    // conflict-free/lab-grown stones (AWIN via tidd.ly). Intake label spelled "Capuccine".
    build: () => `https://tidd.ly/4bRBbRL`,
  },
  '5sens': {
    tagged: true,
    // 5sens.co — clean vegan eau de parfum fragrance brand (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4hqbfjQ`,
  },
  'kisslove-hair': {
    tagged: true,
    // kisslovehair.com — human-hair wigs (AWIN via tidd.ly). Fourth wig merchant alongside
    // unice / ishowbeauty / zlike-hair / all-love-hair — rotate, do not stack all five.
    build: () => `https://tidd.ly/4fNJ2Cd`,
  },

  // — Consumer electronics / auto —
  rexing: {
    tagged: true,
    // rexing.com — Rexing dash cams, backup cameras and vehicle electronics (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4fPpRYM`,
  },
  'ambrosia-systems': {
    tagged: true,
    // AmbrosiaSys.com — non-invasive CGM ring (glucose + sleep/stress/HR/SpO2) (AWIN via tidd.ly).
    // ⚠️ HEALTH-DEVICE CARE: market it as a wellness tracker only. No diabetes-management,
    // diagnostic, or "replaces a glucometer" framing anywhere it is surfaced.
    build: () => `https://tidd.ly/3Uns3OC`,
  },

  // — Confectionery —
  mms: {
    tagged: true,
    // mms.com (Mars) — personalized/custom-print M&M's and gifting (CJ). Big-brand catalog entry:
    // it is NOT a small maker, so it stays out of small-maker showcases.
    build: () => `https://www.jdoqocy.com/click-101832523-15733888`,
  },

  // — Supplements (non-US storefront) —
  'bioprophyl-be': {
    tagged: true,
    // bioprophyl.be — BioProphyl GmbH BELGIAN storefront, DUTCH-language (nl), certified natural
    // food supplements (AWIN via tidd.ly). Intake label said "Biopropyl"; true brand BioProphyl.
    // Dutch-language / BE-NL audience gate only — never on English-language surfaces.
    build: () => `https://tidd.ly/462GMRG`,
  },

  // ── 2026-08-21 intake batch #2 (Ryan, 16 links; pipedrive was already wired in batch #1) ──
  vegas: {
    tagged: true,
    // vegas.com — official Las Vegas hotels/shows/tours OTA (Impact, vdvm.net tracking domain).
    build: () => `https://vegas.vdvm.net/OYLeKW`,
  },
  cheapvuelos: {
    tagged: true,
    // cheapvuelos.com — Spanish-language flight-deals search (CJ). Spanish-audience skew;
    // gate consumption on Spanish-language or budget-flight intent.
    build: () => `https://www.kqzyfj.com/click-101832523-17333642`,
  },
  'dripz-energy': {
    tagged: true, // AWIN → dripzenergy.com — canned energy drinks (singles, 2-packs, BYOB bundles).
    build: () => `https://tidd.ly/4xToq1l`,
  },
  amrita: {
    tagged: true,
    // AWIN → amrita.net — Amrita Aromatherapy: USDA-organic essential oils and diffusers.
    // Copy care: fragrance/relaxation only — never therapeutic or medical claims.
    build: () => `https://tidd.ly/4xSdJfy`,
  },
  vivint: {
    tagged: true, // AWIN → vivint.com/shop — professionally installed smart-home security systems.
    build: () => `https://tidd.ly/4hI3ohD`,
  },
  flextail: {
    tagged: true, // AWIN → flextail.com — ultralight camping gear (tiny pumps, repellers, lanterns).
    build: () => `https://tidd.ly/45FaBYC`,
  },
  jadens: {
    tagged: true, // AWIN → jadens.com — inkless portable thermal printers (photo/label/study notes).
    build: () => `https://tidd.ly/4gaeV8f`,
  },
  'belka-vpn': {
    tagged: true,
    // AWIN → belkavpn.com — consumer VPN. Copy care: position as a budget option; never make
    // security/anonymity guarantees on its behalf.
    build: () => `https://tidd.ly/45AAJDX`,
  },
  'healthy-derm': {
    tagged: true,
    // AWIN → healthyderm.com — grass-fed tallow skincare with copper peptides, mature-skin focus.
    // Copy care: cosmetic/moisturizer language only — no "clinical", healing or treatment claims.
    build: () => `https://tidd.ly/4xSbg4P`,
  },
  mychway: {
    tagged: true,
    // AWIN → mychway.CO.UK — home-use beauty devices (cavitation, microcurrent). UK STOREFRONT:
    // gate to UK audience like bioprophyl's NL/BE gate. Copy care: cosmetic device language only,
    // no medical/aesthetic-procedure claims.
    build: () => `https://tidd.ly/4qA0nCw`,
  },
  'alkemis-paint': {
    tagged: true,
    // AWIN → alkemispaint.com — mineral-based low-VOC interior paint ("wellness paint" is THEIR
    // branding; our copy says mineral/low-VOC, not wellness claims).
    build: () => `https://tidd.ly/4cUJNay`,
  },
  'jumy-bee': {
    tagged: true,
    // AWIN → jumybee.com — keratin hair-treatment sets, masks, anti-frizz care (resolve-first
    // catch: the name reads like a kids' brand; it is hair care).
    build: () => `https://tidd.ly/4x8PWYP`,
  },
  'medical-cgi': {
    tagged: true,
    // AWIN → payhip storefront for thecgicentral.com — digital 3D medical animation/CGI assets
    // (resolve-first catch: a Payhip digital-goods storefront, not a physical shop).
    build: () => `https://tidd.ly/3Urymkk`,
  },
  cloudways: {
    tagged: true,
    // AWIN → cloudways.com — managed cloud hosting. Ryan: for thebizcheckup (business tools).
    build: () => `https://tidd.ly/45GfG2J`,
  },
  'meez-meals': {
    tagged: true, // AWIN → meezmeals.com — Chicago-area meal-kit delivery, family plans.
    build: () => `https://tidd.ly/4wFLpMw`,
  },

  // ── 2026-09-02 intake (Ryan, 18 links). Every link curl-resolved to its true destination
  //    before naming; resolve-first catches noted inline. Ryan's placement calls: 10 → Birdie's
  //    Bazaar, 3 → thebizcheckup ("the business site"); the rest consumed per vertical fit. ──
  optery: {
    tagged: true,
    // PartnerStack → optery.com — data-broker opt-out / personal-info removal (Free, Core,
    // Extended, Ultimate tiers + business plans). Same NGUyMWI0MDU3ZWNi partner-key family as
    // pipedrive/bookyourdata. Ryan: for thebizcheckup.
    build: () => `https://get.optery.com/5fhe2zztq6xc`,
  },
  'until-gone': {
    tagged: true,
    // CJ → untilgone.com — US daily-deals / closeout site (gadgets, home goods, "until gone").
    build: () => `https://www.dpbolvw.net/click-101832523-15736388`,
  },
  aceable: {
    tagged: true,
    // CJ → aceable.com — state-approved online drivers ed, plus AceableAgent (real estate
    // pre-licensing) and PrepAgent (exam prep) under the same program. Ryan: Birdie.
    build: () => `https://www.kqzyfj.com/click-101832523-15735626`,
  },
  'sbla-beauty': {
    tagged: true,
    // AWIN → sbla.com — SBLA Beauty face/neck "wands" (collagen/peptide/retinol cosmetics).
    // Cosmetic language only in our copy. Ryan: Birdie.
    build: () => `https://tidd.ly/4i8OOQl`,
  },
  ausom: {
    tagged: true,
    // AWIN → ausomstore.com — Ausom adult electric scooters (L1/Gosoul/K20/DT lines) + parts.
    // Ryan: Birdie.
    build: () => `https://tidd.ly/4zJ7LPU`,
  },
  stand4socks: {
    tagged: true,
    // AWIN → us.stand4socks.com — Stand4 Socks, buy-one-give-one socks (B Corp), US storefront.
    // Ryan: Birdie.
    build: () => `https://tidd.ly/4gMADhu`,
  },
  brainmd: {
    tagged: true,
    // AWIN (via partnercentric redirect) → brainmd.com — BrainMD supplements (Daniel Amen's
    // line). ⚠️ Supplement copy care: no memory/mood/cognition outcome claims in our copy.
    // NOTE: the tidd.ly hop 404s in curl (partnercentric bounce), fine in real browsers.
    build: () => `https://tidd.ly/4qMDBal`,
  },
  hellosafe: {
    tagged: true,
    // AWIN → hellosafe.com — HelloSafe travel-insurance comparison tool (global, English).
    // Ryan's label "Hello Safe Travel Insurance Tool". Sits beside squaremouth in travelpulse.
    build: () => `https://tidd.ly/4cpBGTh`,
  },
  blokees: {
    tagged: true,
    // AWIN → blokees.com — Blokees (Ryan's label "Pai Technologies", the parent) — poseable
    // model kits / collectible figures (Transformers, Mega Man, Evangelion licences). Ryan: Birdie.
    build: () => `https://tidd.ly/4ydgJTX`,
  },
  'bestdiet-es': {
    tagged: true,
    // AWIN → bestdiet.ES — ⚠️ SPANISH-language keto supplements / functional foods (lang=es
    // storefront, ships Spain). Resolve-first catch: Ryan's label "Best Diet Keto" reads US.
    // Spanish-language gate ONLY, never destination or keto intent alone (cheapvuelos precedent).
    build: () => `https://tidd.ly/45XHCPT`,
  },
  'human-touch': {
    tagged: true,
    // AWIN → humantouch.com — Human Touch massage chairs + zero-gravity recliners (since 1979).
    // Ryan: Birdie.
    build: () => `https://tidd.ly/3T4i9Bk`,
  },
  'ultra-web-hosting': {
    tagged: true,
    // AWIN → ultrawebhosting.com — cPanel shared/WordPress/reseller hosting since 2002, from
    // $3.95/mo, 45-day money-back. Ryan: for thebizcheckup.
    build: () => `https://tidd.ly/4wWzOZv`,
  },
  findlys: {
    tagged: true,
    // AWIN → findlys.com — ⚠️ resolve-first catch: Ryan's label was "Findlay Vacation Tool";
    // the site is a "find services near me / advertise your business" local directory with an
    // eat-or-stay explore tab, not a vacation tool. REGISTRY-ONLY until a consumption surface
    // earns it on merit (a thin directory beside Yelp/Google Maps does not).
    build: () => `https://tidd.ly/4gMZv90`,
  },
  'brookwood-medical': {
    tagged: true,
    // AWIN → brookwoodmed.com — Brookwood Medical, KN95/KF94/3-ply face masks (CE-certified per
    // their listings). No protective-efficacy claims in our copy. Ryan: Birdie.
    build: () => `https://tidd.ly/4646ohf`,
  },
  'wildflower-cases': {
    tagged: true,
    // AWIN → wildflowercases.com — Wildflower limited-edition fashion iPhone/Samsung cases
    // (Devon + Sydney Carlson). Ryan: Birdie.
    build: () => `https://tidd.ly/4xzaH07`,
  },
  dealfuel: {
    tagged: true,
    // AWIN → dealfuel.com — lifetime-deal marketplace for designer/developer/marketer software
    // (AppSumo-style). Ryan: for thebizcheckup.
    build: () => `https://tidd.ly/4cjcLko`,
  },
  '70mai': {
    tagged: true,
    // AWIN → 70mai.store — 70mai official store, dash cams (M310 → 4K A810/Omni) + car
    // accessories. Ryan: Birdie.
    build: () => `https://tidd.ly/4i8Yw5q`,
  },
  amstar: {
    tagged: true,
    // CJ → amstardmc.com — Amstar DMC, airport transfers + excursions in Mexico / Dominican
    // Republic / Jamaica / Costa Rica resort corridors. Ryan's label "Amstar Vacations".
    // amstardmc.com 403s curl (bot wall), fine in browsers. Destination-gated in travelpulse.
    build: () => `https://www.jdoqocy.com/click-101832523-17338956`,
  },

  // — Nonprofit event —
  'run-for-freedom': {
    tagged: true,
    // restoringedentogether.com/events/run — "Run for Freedom", a race registration for the
    // Restoring Eden Together anti-trafficking nonprofit (AWIN via tidd.ly).
    // ⚠️ REGISTRY-ONLY pending Gavin: this pays us a commission on a CHARITY sign-up. Fine as a
    // link the nonprofit itself runs, but it must never sit in a commercial recommendation list.
    build: () => `https://tidd.ly/4x51uMM`,
  },

  // ===============================================================================================
  // 2026-09-15 intake (Ryan, 23 links). Placement calls per Ryan: Amrev + ReachStream (+ Nerihya,
  // UserTrail) → thebizcheckup; the Birdie list → Birdie's Bazaar; the rest → verticals. Every
  // shortlink was resolved to its true destination before wiring (see per-entry notes). Same
  // session REMOVED deal-docket, gosource and waterline-vpn (AWIN programs closing) from this
  // registry and from proppulse/homepulse/buildpulse/cyberpulse/findpulse.
  // ===============================================================================================

  // — Travel —
  'malaysia-airlines': {
    tagged: true, // CJ → malaysiaairlines.com/my/en — Malaysia Airlines (oneworld), KUL hub; SE-Asia flights gate in travelpulse
    build: () => `https://www.tkqlhce.com/click-101832523-17158975`,
  },
  'trivago-mx': {
    tagged: true, // CJ → trivago.com.mx (es-MX) — Mexican hotel comparison; Mexico-destination gate in travelpulse, same pattern as trivago-at/br/jp/tr
    build: () => `https://www.anrdoezrs.net/click-101832523-17246920`,
  },

  // — Business (thebizcheckup) —
  amrev: {
    tagged: true,
    // amrevsoftware.com — Windows data-recovery / photo-recovery / Outlook + Thunderbird email
    // recovery / duplicate-photo finder; free trial, one-time licence, 30-day refund (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xozpzk`,
  },
  reachstream: {
    tagged: true,
    // reachstream.com — B2B contact/company data platform + email verifier (200M+ opt-in contacts
    // claimed); sits beside bookyourdata in the sales-leads tier (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3VqiM8Y`,
  },
  nerihya: {
    tagged: true,
    // nerihya.com — UK hyperlocal deals app (Birmingham-first). Link lands on the MERCHANT signup
    // (/register?plan=starter): it recruits local businesses to post offers, not shoppers. UK-only
    // (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4cDzLKZ`,
  },
  usertrail: {
    tagged: true,
    // usertrail.io — website heatmaps, session replay, funnels, surveys; free 500 sessions/mo,
    // paid from $39/mo billed yearly (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xPGGcn`,
  },

  // — Birdie's Bazaar makers —
  quicklly: {
    tagged: true,
    // quicklly.com — Indian grocery / snacks / beauty marketplace, US delivery (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4y2b6si`,
  },
  'solo-red-light': {
    tagged: true,
    // soloredlight.com — "SoloRed Lite": red/LED light-therapy masks, wands, caps, mats ($89–$1,299)
    // (AWIN via tidd.ly). Cosmetic language only in our copy.
    build: () => `https://tidd.ly/4y1qwNi`,
  },
  'rara-rta': {
    tagged: true,
    // rarartacabinets.com — RTA / pre-assembled kitchen + bath cabinets, US shipping, trade
    // discounts, free samples, financing (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4hj2gjL`,
  },
  'ihome-dental': {
    tagged: true,
    // dentist.ihomedental.com — iHome Dental custom lab-made dental appliances from a mail-in
    // impression kit (night guards, retainers, partials; US + UK regions). Link lands on the
    // "dentist." subdomain but the page is consumer-facing (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3Tsd8CK`,
  },
  'guu-shop': {
    tagged: true,
    // theguushop.com — The GUU Shop hip-hop jewelry: iced chains, custom letter/picture pendants,
    // grillz ($50–$630) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/46Rzalo`,
  },
  'alorair-thedryair': {
    tagged: true,
    // thedryair.com — AlorAir RESTORATION storefront: commercial LGR dehumidifiers, air scrubbers,
    // air movers for flood / water-damage work. DISTINCT from alorair-crawlspace (aloraircrawlspace
    // .com, homeowner crawl-space units) — separate AWIN program (via tidd.ly).
    build: () => `https://tidd.ly/46DfUbz`,
  },
  'matboard-and-more': {
    tagged: true,
    // matboardandmore.com — custom-cut picture mats, frames, foam board (JS-rendered storefront,
    // prices per size) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4gMT335`,
  },
  serwall: {
    tagged: true,
    // serwalloutdoor.com — Serwall HDPE poly outdoor furniture (Adirondack chairs, rockers,
    // dining, bar) US (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4rgy9Nh`,
  },
  ottocast: {
    tagged: true,
    // ottocast.com — wireless CarPlay / Android Auto adapters and AI boxes ($55–$440) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xprUID`,
  },
  robotime: {
    tagged: true,
    // robotimeonline.com — Robotime / ROKR / Rolife 3D wooden puzzles, DIY miniature houses, book
    // nooks, music boxes ($16–$780) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4yDmkmV`,
  },
  zapaka: {
    tagged: true,
    // zapaka.com — ZAPAKA prom / bridesmaid / wedding-guest / vintage-style dresses (most $59–$240)
    // (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xRk0Zi`,
  },
  twopages: {
    tagged: true,
    // twopagescurtains.com — TWOPAGES made-to-measure curtains, drapery, shades, motorised tracks
    // (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xoEE1Y`,
  },
  biba: {
    tagged: true,
    // CJ → biba.in/uk — BIBA Indian ethnic wear for women and girls (kurtas, suit sets, lehengas).
    // Link lands on the UK (£) storefront; the site's country picker also ships US/AU/SG/AE/IN.
    build: () => `https://www.jdoqocy.com/click-101832523-17326799`,
  },

  // — Birdie tool stall + edupulse —
  'remar-nurse': {
    tagged: true,
    // study.remarnurse.com/vit — ReMar Nurse NCLEX-RN/PN review (the "V2" course), TEAS/HESI and
    // nursing-school study guides; free membership tier. In-house Post-Affiliate-Pro tracker in the
    // URL FRAGMENT (#a_aid=Aslan) — read client-side, so the hash MUST survive the redirect.
    build: () => `https://study.remarnurse.com/vit#a_aid=Aslan`,
  },

  // — Verticals only (not on Ryan's Birdie list) —
  'eayon-hair': {
    tagged: true,
    // eayonhair.com — human crochet hair, boho braiding hair, wefts ($52–$799) (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4yCiPx8`,
  },
  'efe-glasses': {
    tagged: true,
    // efeglasses.com — budget prescription eyeglasses / readers / sunglasses (frames ~$10–$30);
    // link lands on /eyeglasses/best-sellers (AWIN via tidd.ly).
    build: () => `https://tidd.ly/4xfFttT`,
  },

  // ---------------------------------------------------------------------------------------------
  // 2026-09-26 intake (Ryan, 16 links: 14 AWIN/CJ + 2 PartnerStack inbound via thebizcheckup).
  // Every link resolved to its true destination before wiring (resolve-first rule).
  // ---------------------------------------------------------------------------------------------

  // — thebizcheckup (Ryan: "for the Business Site") —
  'business-anywhere': {
    tagged: true,
    // AWIN → businessanywhere.io — US LLC/corporation formation + registered agent, virtual mailbox,
    // online notary, EIN/ITIN, banking and tax filing, aimed at global founders and digital nomads
    // (non-US residents forming a US company). Complements zenbusiness (US residents) and ownr (CA).
    build: () => `https://tidd.ly/4xKkDTM`,
  },
  'ssl-store': {
    tagged: true,
    // CJ → thesslstore.com — SSL/TLS certificate reseller (DV/OV/EV, wildcard, code signing) from
    // the major CAs. Cloudflare-guards curl (403) like loaded.com; fine in real browsers.
    build: () => `https://www.dpbolvw.net/click-101832523-15734844`,
  },
  'elevate-forward': {
    tagged: true,
    // PartnerStack (same partner key family as bookyourdata/pushowl) → elevateforward.ai — AI
    // business-strategy and execution platform (Insight Reports per report + Strategy/Execution
    // monthly plans). MERCHANT APPROACHED US via PartnerStack after seeing thebizcheckup.
    build: () => `https://partners.elevateforward.ai/loda0ffa0xgu`,
  },
  momence: {
    tagged: true,
    // PartnerStack → momence.com/sign-up — studio-management platform for gyms, yoga/pilates/dance
    // studios and fitness businesses (scheduling, memberships, payments, marketing). Niche: only
    // fitness/wellness studios. MERCHANT APPROACHED US via PartnerStack.
    build: () => `https://partners.momence.com/zmziddxqnay1`,
  },
  tidio: {
    tagged: true,
    // PartnerStack → tidio.com — website live chat + Lyro AI agent + shared inbox (chat, email,
    // WhatsApp, Instagram, Messenger); Shopify/WooCommerce-first. Same NGUyMWI0MDU3ZWNi partner-key
    // family as the rest of Ryan's PartnerStack programs. MERCHANT APPROACHED US via PartnerStack
    // 2026-09-28. Placed on thebizcheckup (same-ten-questions, store pick) + checkup quiz.
    build: () => `https://affiliate.tidio.com/4okxrd2x259p`,
  },

  // — Birdie's Bazaar (Ryan's Birdie list) —
  'imperia-caviar': {
    tagged: true,
    // AWIN → imperiacaviar.com — premium caviar (Ossetra, Kaluga Hybrid, Sevruga), truffle
    // products, A5 wagyu, gift sets; fresh nationwide (US) delivery.
    build: () => `https://tidd.ly/3VPCL13`,
  },
  goddiva: {
    tagged: true,
    // AWIN → goddiva.US — women's occasion dresses (evening gowns, bridesmaid, wedding guest,
    // maxi/midi), free US delivery and returns. US storefront of the UK brand.
    build: () => `https://tidd.ly/47oLhGR`,
  },
  'everleak-proof': {
    tagged: true,
    // AWIN → everleakproof.com — washable leakproof underwear (women 50+ focus, also men's boxers)
    // and reusable pads. Copy care: product-category language only (leakproof, absorbent,
    // washable); no medical/continence claims.
    build: () => `https://tidd.ly/3VOVTMG`,
  },
  scorpify: {
    tagged: true,
    // AWIN → scorpify.com — fashion-forward protective phone cases (iPhone/Samsung, MagSafe),
    // phone charms, ring holders, magnetic wallets, AirPods cases, lens protectors.
    build: () => `https://tidd.ly/4hlVJ6F`,
  },
  flikeze: {
    tagged: true,
    // AWIN → flikeze.com — home wellness devices: red-light panels and wraps, neck/back air
    // massagers, cupping/vacuum kits, mats. Copy care: cosmetic/comfort language only, no
    // treatment claims (same rule as solo-red-light).
    build: () => `https://tidd.ly/3TQXsJx`,
  },
  honiture: {
    tagged: true,
    // AWIN → honiture.com — robot vacuums (LiDAR/gyro), cordless stick vacuums, wet-dry vacuums,
    // pet bundles and accessories. Sits beside buture (cordless) on vacuum intent.
    build: () => `https://tidd.ly/4Ay2Phk`,
  },
  'mychway-us': {
    tagged: true,
    // AWIN → mychway.COM/product — the US storefront (US warehouse, USD) of the beauty-machine
    // maker already registered as `mychway` (mychway.CO.UK, UK-gated). SEPARATE program, separate
    // slug: salon and home beauty devices (hydrodermabrasion, microcurrent, RF, LED, cavitation,
    // IPL). Copy care: cosmetic device language only, no medical/aesthetic-procedure claims.
    build: () => `https://tidd.ly/3VgA4FE`,
  },

  // — Verticals only (no placement given by Ryan) —
  'ultimate-guitar': {
    tagged: true,
    // AWIN → ultimate-guitar.com/pro — Ultimate Guitar Pro: official tabs, chords, Guitar Pro
    // playback for guitar/bass/drums. Link lands on the Pro subscription page.
    build: () => `https://tidd.ly/3UVN3fX`,
  },
  peremis: {
    tagged: true,
    // AWIN → peremis.com — everyday supplements (magnesium glycinate, ashwagandha, turmeric,
    // D3+K2, mushroom complex, milk thistle, multivitamin; $32–$77), US-manufactured, third-party
    // tested. Copy care: no outcome/health claims.
    build: () => `https://tidd.ly/4rzfvk3`,
  },
  'bahia-principe': {
    tagged: true,
    // CJ → bahia-principe.com — Bahia Principe all-inclusive resorts: Dominican Republic (Punta
    // Cana, Samaná, La Romana), Mexico (Riviera Maya, Tulum), Jamaica (Runaway Bay) and Spain
    // (Tenerife, Mallorca). Link lands on the /es/ Spanish locale; the site has an /en/ switcher.
    build: () => `https://www.tkqlhce.com/click-101832523-15820674`,
  },
  trasmed: {
    tagged: true,
    // CJ → trasmed.com (Trasmed GLE, Grimaldi group) — ferries between mainland Spain (Valencia,
    // Barcelona) and the Balearic Islands (Palma, Ibiza, Mahón). Link lands on the /es/ locale;
    // Radware bot wall in curl, fine in browsers. Balearics-only gate in travelpulse.
    build: () => `https://www.jdoqocy.com/click-101832523-16938545`,
  },
  landjet: {
    tagged: true,
    // AWIN → landjet.com — LandJet "private jet on wheels": chauffeured mobile-office vans for
    // regional business travel between Midwest/Texas cities (Austin, Chicago, Cincinnati, Columbus,
    // Dallas, Des Moines, Houston, Indianapolis, Kansas City, Louisville, Madison, Milwaukee,
    // Nashville, Oklahoma City, Omaha, Quad Cities, San Antonio, St. Louis, Tulsa, Wichita).
    build: () => `https://tidd.ly/4jnLCRt`,
  },

  // — HELD: registered so the link is not lost, deliberately consumed NOWHERE (pending Gavin) —
  healsend: {
    tagged: true,
    // healsend.com — GLP-1 (tirzepatide) weight-loss telehealth, "U.S. doctors, 100% online".
    // 🚫 REGISTRY-ONLY pending a Gavin/Ryan call: prescription weight-loss drugs via telehealth,
    // likely compounded, is a category where a placement reads as medical advice. Same parked
    // treatment as dr-tom-cowan / bnbtobacco until someone decides otherwise (AWIN via tidd.ly).
    build: () => `https://tidd.ly/3SEqv2z`,
  },

  // — HELD: registered so the link is not lost, deliberately consumed NOWHERE —
  'dr-tom-cowan': {
    tagged: true,
    // drtomcowan.com — supplements/books/courses from Thomas Cowan, who surrendered his California
    // medical licence in Dec 2020 and promotes germ-theory denial and the 5G-causes-COVID claim.
    // 🚫 REGISTRY-ONLY, DO NOT CONSUME on Birdie or any health/consumer surface — health
    // misinformation is a credibility and liability problem no commission covers. Same parked
    // treatment as bnbtobacco. Flip only on an explicit Gavin/Ryan decision.
    build: () => `https://tidd.ly/4cvJ8Mu`,
  },
};

export const HUB_HOME = 'https://pulse.theaslangroupllc.com/';
