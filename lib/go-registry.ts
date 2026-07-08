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

  // ---------------------------------------------------------------------------------------------
  // UNTAGGED — no affiliate program ID wired in yet. Plain-URL passthrough today; adding a real
  // ID later is a one-line change to the template string (append `&aid=...` / `?ref=...` etc.).
  // ---------------------------------------------------------------------------------------------
  wise: {
    tagged: false,
    build: () => `https://wise.com/`,
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
};

export const HUB_HOME = 'https://pulse.theaslangroupllc.com/';
