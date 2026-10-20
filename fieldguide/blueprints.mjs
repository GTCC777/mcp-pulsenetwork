// Field Guide blueprint roster — 25 live so far (of 75; full roster in the Phase 0 plan).
// Every entry maps to LIVE engine endpoints; the generator resolves prices/descriptions from
// lib/verticals.ts at build time and fails loudly if a referenced path doesn't exist.
// Prose is governed by fieldguide/STYLE-GUIDE.md (binding). Edit here, then:
//   node tools/build-fieldguide.mjs
// Never hand-edit public/fieldguide/*.

export const CATEGORIES = [
  'Recovery & money-finding',
  'Doc-prep & paperwork',
  'Education',
  'Travel',
  'Local & care',
  'B2B services',
  'Commerce & flipping',
  'Creators & content',
  'Finance-adjacent',
  'Odd jobs & side gigs',
];

// Brand hosts (source of truth: x402-test/pay-all.mjs). Fallback = verticals.ts baseUrl.
export const BRAND_HOSTS = {
  travelpulse: 'https://travelpulse.theaslangroupllc.com',
  transitpulse: 'https://transitpulse.theaslangroupllc.com',
  wealthpulse: 'https://wealthpulse.theaslangroupllc.com',
  clearcarepulse: 'https://clearcarepulse.theaslangroupllc.com',
  dealpulse: 'https://dealpulse.theaslangroupllc.com',
  immigrationpulse: 'https://immigrationpulse.theaslangroupllc.com',
  vetpulse: 'https://api.vetpulse.theaslangroupllc.com',
  insurepulse: 'https://insurepulse.theaslangroupllc.com',
  edupulse: 'https://edupulse.theaslangroupllc.com',
  taxpulse: 'https://taxpulse.theaslangroupllc.com',
  seniorpulse: 'https://seniorpulse.theaslangroupllc.com',
  grantpulse: 'https://grantpulse.theaslangroupllc.com',
  marketpulse: 'https://marketpulse.theaslangroupllc.com',
  collectablespulse: 'https://collectablespulse.theaslangroupllc.com',
  findpulse: 'https://findpulse.theaslangroupllc.com',
  citepulse: 'https://citepulse.theaslangroupllc.com',
  legalpulse: 'https://legalpulse.theaslangroupllc.com',
  gamepulse: 'https://gamepulse.theaslangroupllc.com',
  mailpulse: 'https://mailpulse.theaslangroupllc.com',
};

export const BLUEPRINTS = [
  // ── Recovery & money-finding ──────────────────────────────────────────────
  {
    slug: 'airline-flight-compensation',
    title: 'Airline compensation service',
    category: 'Recovery & money-finding',
    sensitive: false,
    summary: 'Check flight-delay compensation eligibility and draft citation-backed claim letters. Engine cost is about $2.10 per client; services like this commonly charge $20 to $50 flat.',
    lede: [
      'When a flight covered by EU 261, UK 261, Canada’s APPR, Brazil’s ANAC 400, or Turkey’s SHY rules is cancelled or lands hours late, the airline can owe the passenger up to €600 in cash. Most passengers never claim it because the rules are tedious and the airlines don’t volunteer.',
      'This business checks a passenger’s eligibility and hands them a ready-to-send claim letter with the regulation citations already in place. You charge a flat fee. The engine does the rules work.',
    ],
    job: [
      'A customer gives you their flight number, date, and what happened. You run an eligibility check, and if the claim is real, you generate a claim letter citing the exact articles of the applicable regime. The customer signs it and sends it to the airline themselves. You never take a cut of the payout and you never represent anyone; you prepare documents, they file.',
      'The typical engagement takes you under fifteen minutes. The hard part, knowing six passenger-rights regimes well enough to cite them, is the part the engine carries.',
      'You can also finish the job for them. The customer reads the exact letter and approves it, then the engine prints it and mails it as US certified mail, with tracking and proof of delivery. The customer is still the author and the name on the letter; you just ran it through the printer and the post office so they didn’t have to.',
    ],
    who: 'Suits someone who likes small, finishable jobs with a clear yes or no. You need basic customer-service instincts and the discipline to say "no claim here" when the check comes back negative. No travel-industry background required.',
    costs: [
      ['Engine calls per client', '~$2.10 (+$6.00 if mailed certified)', 'One eligibility check ($0.10) plus one claim letter ($2.00) at public catalog prices, plus $6.00 wholesale if the customer wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['A way to take payment', '$0–$30/mo', 'PayPal, Stripe, or a payment link'],
      ['A simple intake page', '$0–$15/mo', 'A form that collects flight number, date, and route'],
    ],
    licensing: [
      'Drafting a claim letter that the passenger signs and sends is self-help document preparation, and in most places it doesn’t require a license. What does attract regulation is working on contingency (taking a percentage of the award) or representing passengers in disputes; several European countries regulate claim agencies that do exactly that. This blueprint stays flat-fee and stays out of representation on purpose. Check the consumer-services rules where you operate before you charge your first customer.',
    ],
    engineIntro: 'The engine knows the six major passenger-rights regimes, checks route and delay facts, and writes letters with the citations already verified. If it can’t support a claim with a real citation, it says so instead of guessing. Once the customer approves the letter, the same engine can print and mail it as certified mail, with a tracking number and delivery confirmation you can hand back to them.',
    endpoints: [
      { v: 'travelpulse', path: '/api/rights/check' },
      { v: 'travelpulse', path: '/api/rights/letter' },
      { v: 'travelpulse', path: '/api/travel/disruption' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Run five eligibility checks on your own past flights and your family’s. Real claims often surface immediately, and a recovered claim of your own is your best marketing story.',
      'Set your flat fee. Services in this lane commonly charge $20 to $50 per letter; your engine cost is about $2.10.',
      'Put up a one-page site: who it’s for, what you charge, what you don’t do (no contingency, no representation).',
      'Tell one frequent-flyer community what you do. Delayed passengers search for help within days of the flight, so answer fresh posts.',
      'Deliver your first three letters at half price in exchange for a testimonial.',
    ],
  },
  {
    slug: 'rail-cruise-compensation',
    title: 'Rail, coach, ferry, and cruise compensation service',
    category: 'Recovery & money-finding',
    sensitive: false,
    summary: 'The airline-compensation model applied to trains, coaches, ferries, and cruises, where almost nobody else is helping passengers claim.',
    lede: [
      'Air passengers have claim companies competing for their business. Rail, coach, ferry, and cruise passengers mostly have nothing, even though the EU has passenger-rights regulations for all four modes and the UK, and several other jurisdictions, run delay-repay schemes with real money attached.',
      'Same business as the airline version: check eligibility, draft the letter, charge a flat fee. Less competition, because fewer people know these regimes exist.',
    ],
    job: [
      'A customer tells you what happened: a train three hours late into Lyon, a ferry cancellation that stranded them overnight, a cruise that skipped two ports. You run the eligibility check for the applicable regime (EU 1371/2021 for rail, 1177/2010 for sea, 181/2011 for coach, plus national delay-repay schemes), and generate a citation-backed claim letter the passenger sends themselves.',
      'Cruise claims deserve special attention: the sums are larger, the contracts are messier, and passengers are usually claiming against a well-lawyered operator. The engine keeps you inside what the regulations actually support.',
      'Same finishing step as the airline blueprint: the passenger reads the exact letter, approves it, and the engine mails it as certified mail with tracking and proof of delivery. They remain the author and the signer; you handle the printing and the postage.',
    ],
    who: 'Same profile as the airline blueprint. If you’re in Europe or the UK, this is arguably the better starting point because the field is emptier.',
    costs: [
      ['Engine calls per client', '~$2.10 (+$6.00 if mailed certified)', 'Eligibility check ($0.10) plus claim letter ($2.00), plus $6.00 wholesale if the passenger wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['Payment + intake page', '$0–$45/mo', 'Same stack as the airline blueprint; run both from one site'],
    ],
    licensing: [
      'Identical posture to the airline blueprint: flat-fee self-help document preparation, no contingency, no representation. The customer signs and sends. Verify local consumer-services rules first.',
    ],
    engineIntro: 'One eligibility endpoint covers rail, coach, ferry, and cruise regimes; the letter endpoint produces a citation-locked claim document. Once the passenger approves it, the engine can also print and mail it as certified mail, with tracking and delivery confirmation.',
    endpoints: [
      { v: 'transitpulse', path: '/api/rights/check' },
      { v: 'transitpulse', path: '/api/rights/letter' },
      { v: 'transitpulse', path: '/api/transit/delays-history' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Learn the shape of the four regimes by running ten test checks (commuter rail delay, international rail, ferry cancellation, cruise itinerary change).',
      'Pick a niche to start: UK delay-repay commuters and EU international rail are the highest-volume lanes.',
      'Put the rail service on the same site as your airline service if you run both. "Delayed? Any mode, one place" is a clean pitch.',
      'Post one plain-language explainer where delayed passengers actually complain (commuter forums, cruise communities). Answer questions honestly and let the service sell itself.',
    ],
  },
  {
    slug: 'unclaimed-money-finder',
    title: 'Unclaimed money search service',
    category: 'Recovery & money-finding',
    sensitive: false,
    summary: 'Run flat-fee unclaimed-property searches across state and national databases. Roughly one in seven people has money sitting in a government database.',
    lede: [
      'Governments are holding tens of billions in unclaimed property: forgotten deposits, uncashed checks, dormant accounts, old insurance payouts. In the US alone the states hold over $70 billion, and about one in seven people has something waiting. Most never look.',
      'This business searches on behalf of people who’d never do it themselves, for a flat fee, and hands them the claim instructions. You never touch their money.',
    ],
    job: [
      'A customer gives you their name, past addresses, and past business names. You run a structured search across the relevant databases, compile what surfaces, and deliver a short report: what was found, where, and exactly how to claim it (claims are filed by the owner, free, on the official state or national site).',
      'The honest version of this business tells customers two things up front: they could search for free themselves, and your fee buys thoroughness (name variants, old addresses, multiple states, deceased relatives’ estates) plus clear instructions.',
    ],
    who: 'Detail-oriented people who enjoy search puzzles. It also stacks well with estate-adjacent work: executors and genealogy researchers hit unclaimed property constantly.',
    costs: [
      ['Engine calls per client', '~$0.50–$1.50', 'One to three searches depending on name variants and states'],
      ['Payment + intake page', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'This is the one recovery blueprint with real state-by-state rules: many US states regulate "finders" or "locators" of unclaimed property, and the rules typically target contingency arrangements (percentage fees), with registration requirements and fee caps. This blueprint charges a flat search fee regardless of outcome, never takes a percentage, and never takes custody of funds or files claims on the owner’s behalf, which keeps you outside most finder statutes. Still, read your state’s unclaimed-property law before launch, and disclose in writing that owners can always search and claim for free.',
    ],
    engineIntro: 'The engine runs the multi-database search and returns what it found with claim instructions per hit.',
    endpoints: [
      { v: 'wealthpulse', path: '/api/wealth/unclaimed' },
      { v: 'wealthpulse', path: '/api/wealth/card-benefit' },
    ],
    first30: [
      'Search yourself, your family, and five friends. Found money is the whole pitch, and you’ll usually find some.',
      'Write your one-page disclosure: flat fee, no percentage, owners can search free themselves, you never handle funds.',
      'Read your state’s finder rules (or your country’s equivalent) and confirm your flat-fee posture clears them.',
      'Offer the search free to three local estate attorneys or executors in exchange for referrals; estates are the highest-yield searches.',
    ],
  },
  {
    slug: 'medical-bill-review',
    title: 'Medical bill review assistance',
    category: 'Recovery & money-finding',
    sensitive: true,
    summary: 'Help patients find billing errors, check their rights, and prepare citation-backed dispute letters for bills they were never supposed to owe.',
    lede: [
      'A large share of medical bills contain errors, and US patients have enforceable rights most have never heard of: the No Surprises Act, hospital financial-assistance obligations, state balance-billing protections. People routinely pay bills they don’t owe because disputing one feels impossible.',
      'This service reviews a bill, checks which protections apply, and prepares the dispute letter the patient sends. Flat fee, no percentage of savings.',
    ],
    job: [
      'A customer sends you an itemized bill (you show them how to request one; that alone kills some bills). You check the charges against typical prices for the procedure and region, run a rights check to see which protections apply, and when a dispute is warranted, generate a citation-locked letter the patient signs and sends to the provider or insurer.',
      'You are not negotiating on anyone’s behalf and you’re not giving medical or legal advice. You’re a preparer: you organize the facts, surface the applicable rules, and put a well-cited letter in the patient’s hands.',
      'You can finish the job, too: the patient reads the exact dispute letter and approves it, then the engine prints and mails it as certified mail with tracking and proof of delivery. The patient is still the one who signed it and is sending it; you just ran it through the printer and the post office.',
    ],
    who: 'People with patience for paperwork and calm phone manners. Former medical-office, billing, or insurance staff have a head start, but the engine carries the rules knowledge.',
    costs: [
      ['Engine calls per client', '~$5.35 (+$6.00 if mailed certified)', 'Rights check ($0.10), price context ($0.15–$0.30), citation-locked letter ($5.00), plus $6.00 wholesale if the patient wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['Payment + intake page', '$0–$45/mo', 'Standard stack; use an intake form that never asks for medical details you don’t need'],
    ],
    licensing: [
      'Patient billing advocacy is unlicensed in most US states today, and this blueprint keeps it that way by staying in document-preparation territory: the patient signs, sends, and negotiates. Two lines you do not cross: negotiating or settling insurance claims for a fee (that’s licensed public-adjuster or attorney work in most states) and anything that resembles medical advice. Outside the US, check whether patient-advocacy or claims-management rules apply where you operate.',
      'Handle documents with care: collect the minimum, store nothing longer than the engagement requires, and say so in writing.',
    ],
    engineIntro: 'The engine checks procedure prices by region, runs the rights quiz against the patient’s situation, and produces dispute letters where every citation is verified before it ships. Once the patient approves the letter, the engine can also print and mail it as certified mail, with tracking and delivery confirmation.',
    endpoints: [
      { v: 'clearcarepulse', path: '/api/care/rights' },
      { v: 'clearcarepulse', path: '/api/care/rights-letter' },
      { v: 'clearcarepulse', path: '/api/care/search' },
      { v: 'clearcarepulse', path: '/api/care/negotiate' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Review two real bills free for people you know, start to finish, so you’ve walked the full path before charging.',
      'Write your scope page: what you do (review, rights check, letter prep), what you never do (negotiate for you, give medical or legal advice, take a percentage).',
      'Set a flat fee per bill review. Keep it simple; one number.',
      'Introduce yourself to two independent insurance agents and one patient-advocacy community. Referrals in this lane come from trust, not ads.',
    ],
  },
  {
    slug: 'subscription-bill-review',
    title: 'Subscription and bill review service',
    category: 'Recovery & money-finding',
    sensitive: false,
    summary: 'Review household subscriptions, catch auto-renewal traps, and prepare refund-demand letters backed by state auto-renewal law.',
    lede: [
      'The average household pays for subscriptions it forgot, doesn’t use, or actively tried to cancel. US states have been passing auto-renewal laws with teeth, and when a company obstructs cancellation or renews without the required notice, the customer often has a refund remedy spelled out in statute.',
      'This service reviews a customer’s recurring charges, tells them what to cancel and how, and when a company broke the rules, prepares the demand letter.',
    ],
    job: [
      'The customer walks you through their card and bank statements (or just forwards the list of recurring charges). You run each questionable one through a cancel-versus-keep review, and for the ones where the company violated auto-renewal law (no renewal notice, obstruction of cancellation, free-trial conversion without consent), you run the rights check and generate a citation-locked demand letter for refund.',
      'Deliverable: a one-page savings plan (cancel these, downgrade those, here’s the annual number) plus any demand letters, ready to send.',
      'When there is a demand letter, you can finish that job too: the customer reads and approves the exact letter, and the engine prints and mails it as certified mail with tracking and proof of delivery. The customer is still the one who signed it; you just took care of the printer and the post office.',
    ],
    who: 'A good first business. Low stakes, immediate visible results, and every adult you know is a potential customer.',
    costs: [
      ['Engine calls per client', '~$0.50–$2.60 (+$6.00 if mailed certified)', 'A few subscription reviews ($0.08 each), a rights check ($0.10), and a demand letter ($2.00) when warranted, plus $6.00 wholesale if the customer wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['Payment + intake page', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'No license applies to reviewing bills and preparing letters the customer sends. Flat fee, not a percentage of savings. Don’t log into anyone’s accounts; they share statements, you review.',
    ],
    engineIntro: 'The engine does the cancel-or-keep math per service, checks the state auto-renewal statute against what happened, and drafts demand letters citing the exact violated duties. Once the customer approves a demand letter, the same engine can print and mail it as certified mail, with tracking and delivery confirmation.',
    endpoints: [
      { v: 'dealpulse', path: '/api/deals/subscriptions' },
      { v: 'dealpulse', path: '/api/deals/subscription-rights' },
      { v: 'dealpulse', path: '/api/deals/subscription-letter' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Do your own household first and write down the annual savings number. That number is your ad.',
      'Charge flat: one household review, one price. Resist percentage-of-savings pricing even though customers suggest it; it changes your legal posture and your incentives.',
      'Offer three friends-and-family reviews for testimonials.',
      'Post the plain math (average subscriptions per household, average forgotten spend) one place where your local community talks money.',
    ],
  },

  // ── Doc-prep & paperwork ──────────────────────────────────────────────────
  {
    slug: 'immigration-self-help-kits',
    title: 'Immigration self-help information service',
    category: 'Doc-prep & paperwork',
    sensitive: true,
    summary: 'Sell research and information packs (points scores, pathway comparisons, cost breakdowns) that immigrants take to their attorney or use for self-filed applications. Strictly information, never advice.',
    lede: [
      'People navigating immigration drown in scattered, outdated information, and attorney hours are expensive enough that many burn them on questions a database could answer: what’s my Express Entry score, which countries could I actually get into, what does the whole process cost.',
      'This business sells organized information: personalized research packs a customer takes into their attorney meeting or their own self-filed application. It is emphatically not legal advice, and the line between the two is the first thing you learn.',
    ],
    job: [
      'A customer gives you their profile: nationality, age, education, work history, language scores, destination interest. You run the relevant checks (points calculators, pathway rankings, category eligibility, visa requirements, full cost breakdowns) and assemble a clean, sourced research pack. What you never do is recommend which pathway they should choose or how to present their case; that’s practicing immigration law.',
      'Your customers fall into two groups: self-filers in points-based systems (Canada, Australia, UK) where the process is designed for individuals, and attorney-represented applicants who want to arrive at the paid consultation already informed.',
    ],
    who: 'Immigrants who’ve been through a process themselves are the natural operators here; they know the confusion firsthand and typically serve their own community first, in its own language.',
    costs: [
      ['Engine calls per client', '~$0.60–$1.20', 'Points check ($0.10), category check ($0.25), pathway map ($0.20), costs ($0.10), and comparisons as needed'],
      ['Payment + intake page', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'This is the most tightly regulated blueprint in the Field Guide, and the rules protect your customers from real predators. In the US, giving immigration advice for compensation is the practice of law: only attorneys and DOJ-accredited representatives may do it, and "notario" operations get prosecuted. Canada restricts paid advice to lawyers and licensed consultants (RCIC); the UK requires IAA (formerly OISC) registration for immigration advice. Selling general information and personalized data lookups is legal in these places; selecting forms for someone, advising strategy, or completing applications for a fee is not, unless you’re credentialed.',
      'Run it clean: written disclaimer on everything ("information service, not legal advice, not a law firm"), no case strategy, and a referral list of licensed practitioners you hand out freely. If you love this field, the credentialed route (RCIC in Canada, IAA in the UK, DOJ accreditation via a nonprofit in the US) turns this side business into a profession.',
    ],
    engineIntro: 'The engine covers points calculators for the major skilled-worker systems, pathway rankings by nationality and destination, live category-based selection data, and full cost breakdowns.',
    endpoints: [
      { v: 'immigrationpulse', path: '/api/points' },
      { v: 'immigrationpulse', path: '/api/category-check' },
      { v: 'immigrationpulse', path: '/api/pathway' },
      { v: 'immigrationpulse', path: '/api/cost' },
      { v: 'immigrationpulse', path: '/api/compare' },
    ],
    first30: [
      'Write your disclaimer and your "what I don’t do" list before anything else, and put both on every page and every deliverable.',
      'Build one sample research pack for a fictional profile and show it to a licensed practitioner. Ask them where the advice line is; most will tell you gladly, and some will become your referral partners.',
      'Serve your own community first, in its own language, where trust already exists.',
      'Price the pack flat. Keep it modest; volume and referrals matter more than margin here.',
    ],
  },
  {
    slug: 'veterans-benefits-navigation',
    title: 'Veterans benefits navigation',
    category: 'Doc-prep & paperwork',
    sensitive: true,
    summary: 'Help veterans understand what they may be entitled to across six countries’ systems. US law sharply restricts charging for claims help, so this blueprint is built around what’s legal: free navigation, funded adjacently.',
    lede: [
      'Most veterans leave benefits unclaimed, not because the systems are stingy but because they’re opaque. Disability ratings, pension supplements, education transfers, state and regional add-ons: every one has rules the veteran was never briefed on.',
      'Read the licensing section before anything else on this page. In the US you generally may not charge veterans for help preparing claims unless you’re VA-accredited. The honest version of this blueprint is navigation and research, much of it free, with revenue coming from the adjacent work that’s legal to sell.',
    ],
    job: [
      'You help veterans and their families see the whole board: what a disability rating review involves, whether an Aid & Attendance-style pension supplement might apply to an aging parent, which state benefits stack on top of federal ones, what education benefits transfer to kids. The engine covers six countries’ systems (US, UK, Canada, Australia, NZ, Germany), so expat and dual-service families are in scope too.',
      'Where the claim itself needs preparing, you route to the free, accredited channel: Veterans Service Organizations (VSOs) prepare and file VA claims at no charge. Your value is that veterans arrive at the VSO knowing what to ask for.',
    ],
    who: 'Veterans and military family members, overwhelmingly. Credibility in this lane can’t be manufactured.',
    costs: [
      ['Engine calls per session', '~$0.50–$0.80', 'A handful of benefit checks at $0.05–$0.20 each'],
      ['Payment + site', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'US federal law (38 U.S.C. §§ 5901–5905) restricts who may prepare, present, or prosecute VA benefits claims: accredited attorneys, claims agents, and VSO representatives. Charging unaccredited fees for claims prep is unlawful, and companies doing it anyway are a recurring scandal in this space. What remains legal: selling general education and research that isn’t tied to preparing a specific claim, helping with non-claim paperwork, and charging for coaching on non-VA matters (state benefits, discounts, transition logistics). The clean paths to charging for claims work itself are VA accreditation (the claims-agent exam is open to non-attorneys) or partnering with accredited practitioners. Other countries have their own rules; the engine flags the boundaries per country.',
      'This category carries a zero-tolerance honesty bar: no percentage-of-backpay arrangements, no "we’ll get your rating increased" promises, ever.',
    ],
    engineIntro: 'Six countries’ systems, from disability rating analysis to state-level benefit stacking to verified discount lookups.',
    endpoints: [
      { v: 'vetpulse', path: '/api/vet/disability' },
      { v: 'vetpulse', path: '/api/vet/aid-attendance' },
      { v: 'vetpulse', path: '/api/vet/state-benefits' },
      { v: 'vetpulse', path: '/api/vet/education' },
      { v: 'vetpulse', path: '/api/vet/discounts' },
    ],
    first30: [
      'If you’re serious about claims work, start the VA accreditation process (or your country’s equivalent) now; it takes months, and everything else can run while you wait.',
      'Build a relationship with your local VSO chapter. You’re a feeder, not a competitor, and they’ll tell you exactly where the legal lines sit.',
      'Run free benefit-overview sessions for five veteran families and document (with permission) what they discovered.',
      'Decide your revenue model up front: accredited claims practice, adjacent coaching, or free community service funded by something else you run. Write it down and stick to it.',
    ],
  },
  {
    slug: 'insurance-claim-documentation',
    title: 'Insurance claim documentation prep',
    category: 'Doc-prep & paperwork',
    sensitive: true,
    summary: 'Help policyholders document storm and disaster claims properly, and check whether insurers owe statutory late-payment interest. Documentation and letters only; adjusting requires a license.',
    lede: [
      'After a hurricane, flood, or fire, policyholders face two problems at once: documenting a claim well enough to be paid fairly, and insurers that drag their feet. Most people do the documentation badly (photos too late, no inventory, no paper trail) and never learn that many jurisdictions owe them statutory interest when claim payment is late.',
      'This service helps policyholders build the claim file themselves and prepares interest-demand letters when payment stalls. It stays firmly on the documentation side of the line; negotiating claims for a fee is licensed public-adjuster work.',
    ],
    job: [
      'Before or right after a loss, you help the policyholder assemble what adjusters actually look for: dated photo and video inventory, receipts and serial numbers, a room-by-room contents list, a communications log, and a clean timeline. You package it so their claim tells its own story.',
      'When an insurer sits on a claim past the statutory clock, you run the prompt-pay check: many US states and other jurisdictions set deadlines for acknowledgment, decision, and payment, with interest owed on late payment. If interest is due, you generate a citation-locked demand letter the policyholder sends.',
      'You can finish that step too: the policyholder reads the exact interest-demand letter and approves it, and the engine prints and mails it as certified mail with tracking and proof of delivery, which matters against an insurer that might otherwise claim it never arrived. The policyholder remains the one who signed and sent it.',
    ],
    who: 'Organized, calm people who can work with families on their worst week. Contractors, former adjusters, and estate organizers cross over naturally.',
    costs: [
      ['Engine calls per client', '~$2.20 (+$6.00 if mailed certified)', 'Claims guidance ($0.08), prompt-pay interest check ($0.10), demand letter ($2.00), plus $6.00 wholesale if the policyholder wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['Documentation kit', '$0', 'Phone camera and a spreadsheet; your process is the product'],
    ],
    licensing: [
      'The bright line: helping someone document their own claim and preparing letters they send is generally lawful; negotiating, adjusting, or settling a claim on someone’s behalf for a fee requires a public adjuster license in most US states (and equivalents elsewhere), and states like Florida and Texas police this actively after storms. Never touch the negotiation, never take a percentage of the payout, and put the disclaimer in writing. Some states also regulate post-disaster solicitation; know your state’s rules before you market after a storm.',
    ],
    engineIntro: 'The engine supplies the claims-documentation playbook, runs the statutory prompt-pay math per jurisdiction, and writes the interest-demand letters with verified citations. Once the policyholder approves the letter, the engine can also print and mail it as certified mail, with tracking and delivery confirmation.',
    endpoints: [
      { v: 'insurepulse', path: '/api/insure/claim' },
      { v: 'insurepulse', path: '/api/insure/prompt-pay' },
      { v: 'insurepulse', path: '/api/insure/prompt-pay-letter' },
      { v: 'insurepulse', path: '/api/insure/home' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Build the pre-loss documentation offer first: a home inventory session sold in calm weather. It’s recurring, uncontroversial, and it seeds the client list that calls you after a storm.',
      'Learn your state’s prompt-pay statute by running five test checks with different claim timelines.',
      'Write the scope disclaimer (documentation and letters, no negotiation, no adjusting) and read your state’s public-adjuster statute so you know exactly why it’s there.',
      'Introduce yourself to two independent insurance agents; they refer documentation help without hesitation because it makes their claims go smoother.',
    ],
  },

  // ── Education ─────────────────────────────────────────────────────────────
  {
    slug: 'tutoring-practice',
    title: 'Tutoring practice, engine-assisted',
    category: 'Education',
    sensitive: false,
    summary: 'Run a tutoring business where prep, practice material, and progress diagnosis are generated per student instead of consuming your evenings.',
    lede: [
      'Tutoring has always been a good business: recurring, referral-driven, priced by the hour. Its ceiling has always been prep time, because a good session needs materials matched to this student, this week.',
      'With an engine generating study guides, quizzes, mock exams, and misconception diagnoses on demand, a solo tutor runs the material factory of a company, and every hour you sell is a delivery hour.',
    ],
    job: [
      'You teach, the engine preps. Before each session you generate a study guide and practice set for exactly where the student is; after a wrong answer, the misconception endpoint pinpoints the actual gap behind it, which is the skill parents think they’re paying a great tutor for. For exam students, you run rubric-matched practice questions and full timed mocks with score reports.',
      'The same machinery gives you two premium add-ons: exam-prep packages (structured mock-plus-review cycles priced above hourly tutoring) and monthly progress reports that keep parents renewing.',
    ],
    who: 'Anyone who can genuinely teach: current and former teachers, grad students, retired professionals, homeschool parents whose kids aged out. Subject knowledge plus patience; the engine handles the materials.',
    costs: [
      ['Engine calls per student per week', '~$0.25–$1.50', 'Study guide and quiz ($0.10 each); mock exams and grading ($1.00 each) for exam students'],
      ['Payment + scheduling', '$0–$45/mo', 'Standard stack plus a booking tool'],
    ],
    licensing: [
      'Tutoring is unlicensed nearly everywhere. Two practical notes: background-check expectations are real when you work with minors (get one proactively; parents notice), and if you advertise special-education expertise, know your jurisdiction’s rules about what only credentialed specialists may claim.',
    ],
    engineIntro: 'Study guides, adaptive quizzes, spaced-repetition flashcards, 200+ exam formats with rubric-matched questions, timed mocks with scoring, and misconception diagnosis per wrong answer.',
    endpoints: [
      { v: 'edupulse', path: '/api/study/guide' },
      { v: 'edupulse', path: '/api/study/quiz' },
      { v: 'edupulse', path: '/api/study/misconception' },
      { v: 'edupulse', path: '/api/exam/prep' },
      { v: 'edupulse', path: '/api/exam/mock' },
      { v: 'edupulse', path: '/api/exam/flashcards' },
    ],
    first30: [
      'Pick one subject and one exam you already know cold. Depth beats breadth for referrals.',
      'Take two students at a founding rate and run the full engine-assisted loop: pre-session materials, misconception diagnosis, weekly parent note.',
      'Raise your rate for student three. Your prep quality is now visibly better than the hourly-tutor norm.',
      'Ask both founding families for one referral each at week four, with a specific sentence they can forward.',
    ],
  },
  {
    slug: 'college-planning-consultant',
    title: 'College planning consultant',
    category: 'Education',
    sensitive: false,
    summary: 'Guide families through admissions strategy, essays, financial aid, and the tax side of paying for college, with engines covering the parts that are pure rules and math.',
    lede: [
      'Families pay college consultants for calm sequencing of a process that terrifies them: applications, essays, deadlines, financial aid, and the money mechanics of actually paying. The advice-heavy parts are human work. The rules-heavy parts (aid appeals, 529 withdrawal rules, missed education credits) are exactly what engines do well.',
      'This blueprint pairs your judgment with engine-backed rules work, including two recoveries most consultants never offer: financial-aid appeal letters and missed education-credit checks worth up to $2,500 per student per year.',
    ],
    job: [
      'The consulting core: school-list strategy, application timelines, and essay development, where the engine gives structured admissions-coach feedback on drafts and you supply the human judgment about what story the student should tell.',
      'The rules core: when an aid offer comes in low, you run the appeal screen (job loss, medical costs, special circumstances) and generate a citation-backed appeal letter. When parents ask how to pay, the 529 checker handles withdrawal and rollover rules, and the credit-recovery check looks back across open amendment years for education credits the family never claimed. Those concrete dollar findings are what turn a consulting fee into an easy yes.',
    ],
    who: 'Former admissions staff, school counselors, teachers, and parents who ran the gauntlet recently and got organized about it.',
    costs: [
      ['Engine calls per family', '~$2–$8', 'Essay reviews ($0.25 each), appeal screen ($0.50) and letter ($5.00), 529/credit checks ($0.50 each)'],
      ['Payment + scheduling', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'Independent educational consulting is unlicensed; the credibility bar is set by professional-association ethics (IECA, HECA), the useful one being: no guarantees of admission, ever. On the money side, stay in information territory: the engines report rules and math, and families make their own filings. FAFSA itself is free to file, and you must never imply otherwise; if a family wants someone to prepare tax amendments for the recovered credits, that’s their tax preparer’s job, working from your engine’s findings.',
    ],
    engineIntro: 'Essay feedback, aid-appeal screening and letters, 529 withdrawal/rollover rules, and missed-credit recovery math across the open amendment window.',
    endpoints: [
      { v: 'edupulse', path: '/api/edu/essay' },
      { v: 'edupulse', path: '/api/aid/appeal-check' },
      { v: 'edupulse', path: '/api/aid/appeal-letter' },
      { v: 'taxpulse', path: '/api/tax/529-check' },
      { v: 'taxpulse', path: '/api/tax/aotc-recovery' },
    ],
    first30: [
      'Run the missed-credit check for three families you know with current or recent college students. A concrete "you may have left $2,500 on the table" finding markets the whole practice.',
      'Package three tiers: essay-cycle only, full application season, and application-plus-money (appeals, 529, credits).',
      'Write the no-guarantees line into your agreement and your site.',
      'Book spring families now: juniors’ parents start searching in March, and aid appeals spike when offers land.',
    ],
  },

  // ── Travel ────────────────────────────────────────────────────────────────
  {
    slug: 'independent-travel-agent',
    title: 'Independent travel agent',
    category: 'Travel',
    sensitive: false,
    summary: 'Modern travel agenting through a host agency, with an intelligence engine doing fare timing, disruption risk, visa checks, and trip clearance that other agents do by feel.',
    lede: [
      'Travel agents didn’t die; the order-takers did. What clients pay for now is judgment plus logistics: complex itineraries, group trips, and someone accountable when things wobble. New agents typically start under a host agency, which supplies the booking credentials and supplier relationships for a modest fee or split.',
      'The engine gives a solo agent an intelligence desk: when to book a fare, how likely this airport is to melt down that week, what documents this passport needs for that route.',
    ],
    job: [
      'You plan and book travel for clients through your host agency, earning commission from suppliers plus, increasingly, planning fees you charge directly. The engine differentiates the service: pre-booking trip clearance (visa, health, safety, weather, money in one call), fare intelligence on when to book, disruption risk on routing choices, and full itinerary drafts you refine.',
      'It also feeds a natural companion revenue line: when a client’s flight is disrupted, you already run compensation checks (see the airline-compensation blueprint) as a service touch that clients never forget.',
    ],
    who: 'Organized people who love trip logistics and are good on the phone during small emergencies. Niche focus (destination weddings, multi-generation trips, a region you know deeply) shortens the road.',
    costs: [
      ['Host agency', '$0–$50/mo', 'Varies by host; compare commission splits and support'],
      ['Engine calls per trip', '~$0.50–$1.50', 'Trip clearance ($0.50), fare intel ($0.12), disruption risk ($0.25), itinerary ($0.20)'],
      ['Seller-of-travel registration', '$0–$100s/yr', 'Required in CA, FL, WA, HI regardless of where the client is; hosts usually guide this'],
    ],
    licensing: [
      'No general license, but four US states (California, Florida, Washington, Hawaii) require seller-of-travel registration, and rules bind you based on where your clients are, not just where you are. Most host agencies walk new agents through it. Selling travel insurance has its own licensing in many states; hosts typically route that properly. Outside the US, package-travel rules (UK/EU) matter once you bundle; under a host agency you’re usually inside their compliance umbrella. Confirm rather than assume.',
    ],
    engineIntro: 'One-call trip clearance, fare timing, disruption risk by airport and date, visa requirements by nationality, and full itinerary drafting.',
    endpoints: [
      { v: 'travelpulse', path: '/api/travel/trip-check' },
      { v: 'travelpulse', path: '/api/travel/fare-intel' },
      { v: 'travelpulse', path: '/api/travel/disruption' },
      { v: 'travelpulse', path: '/api/travel/visa' },
      { v: 'travelpulse', path: '/api/travel/plan' },
    ],
    first30: [
      'Choose a host agency (compare splits, training, and whether they handle seller-of-travel registration for you) and pick your niche.',
      'Plan two real trips for friends at cost, running the full engine loop so your process is smooth before it’s paid.',
      'Set a planning fee from day one, even a small one. Free planning attracts clients who ghost after taking your itinerary.',
      'Build the disruption habit: every client departure gets a risk check the week before, with a heads-up note. That message is where referrals come from.',
    ],
  },

  // ── Local & care ──────────────────────────────────────────────────────────
  {
    slug: 'senior-living-placement',
    title: 'Senior living placement advisor',
    category: 'Local & care',
    sensitive: true,
    summary: 'Guide families through choosing senior care, free to the family and paid by referral fee from the community, with engine-backed quality comparisons behind every recommendation.',
    lede: [
      'When a family realizes a parent can’t live alone anymore, they get a crash course in an industry they never wanted to know: assisted living versus memory care, quality records, contracts, and money. Placement advisors guide that decision, typically free to the family, paid a referral fee by the community when a move-in happens.',
      'The model is legitimate and established. What separates a trustworthy advisor from a lead-generation mill is disclosure and homework, and the engine does the homework at a depth mills never bother with.',
    ],
    job: [
      'You meet the family, understand needs and budget, and shortlist communities. The engine grounds the shortlist in evidence: facility evaluation guides, regulator quality-record comparisons for the specific homes under consideration, benefits eligibility (including veteran-related supplements for eligible families), and financing context. You tour with the family, help them compare, and support the decision.',
      'You disclose, in writing, that communities pay you a referral fee and which ones you have agreements with. That sentence is what makes the free-to-family model honest.',
    ],
    who: 'People with eldercare proximity: former nurses, social workers, senior-care staff, and adult children who’ve done this for their own parents. Warmth and patience are the qualifications; families are deciding while grieving.',
    costs: [
      ['Engine calls per family', '~$0.60–$1.00', 'Facility guides ($0.15), quality comparisons ($0.15), benefits checks ($0.10–$0.15)'],
      ['Site + phone', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'Several US states regulate placement or referral agencies (registration, written disclosure of referral fees, sometimes bonding), and the rules keep tightening because bad actors earned it. Know your state’s requirements before your first placement. Two lines to hold everywhere: written fee disclosure to the family, and never presenting yourself as a neutral government-style service when you’re commission-paid. No medical advice; you’re a navigator, not a clinician.',
    ],
    engineIntro: 'Facility evaluation frameworks, regulator quality-record comparisons, senior benefits eligibility including veteran supplements, and financing guides.',
    endpoints: [
      { v: 'seniorpulse', path: '/api/senior/facility' },
      { v: 'seniorpulse', path: '/api/senior/nh-compare' },
      { v: 'seniorpulse', path: '/api/senior/benefits' },
      { v: 'seniorpulse', path: '/api/senior/veterans' },
      { v: 'seniorpulse', path: '/api/senior/medicare' },
    ],
    first30: [
      'Check your state’s rules on placement agencies first; requirements differ sharply by state.',
      'Tour ten communities in your area before you have a single client, and run the quality comparison on each. You now know your market better than most people selling in it.',
      'Sign referral agreements with an honest handful, and write your disclosure sheet.',
      'Introduce yourself to two hospital discharge planners and one elder-law attorney. They meet families on decision day.',
    ],
  },

  // ── B2B services ──────────────────────────────────────────────────────────
  {
    slug: 'grant-prospecting-service',
    title: 'Grant prospecting for nonprofits',
    category: 'B2B services',
    sensitive: false,
    summary: 'Sell funder research to small nonprofits: matched grant lists, foundation giving histories from 990-PF data, and deadline calendars they could never staff internally.',
    lede: [
      'Small nonprofits die of grant-search exhaustion. The executive director is the fundraiser, the program lead, and the accountant, and the funder research that big organizations staff with a development office simply doesn’t happen.',
      'This business sells that research as a service: a monthly matched-funder pipeline, giving-history intelligence on each prospect, and a deadline calendar. Flat monthly fee, no percentage of grants won.',
    ],
    job: [
      'For each client you maintain a live prospect pipeline: federal and state programs they’re eligible for, foundations whose actual giving history (from IRS Form 990-PF data) matches their size and mission, and upcoming deadlines. Monthly deliverable: the refreshed pipeline with three to five researched prospects, each with giving history, typical grant size, and eligibility notes.',
      'The 990 intelligence is the differentiator. Most small nonprofits pick funders from directory listings; you show them who actually wrote checks to organizations like theirs, at what size, in which years. Add-on: application strategy briefs and narrative first drafts for the grants they pursue.',
    ],
    who: 'Former nonprofit staff, grant writers who’d rather research than write, librarians, and analysts. If you can read a 990 and summarize it plainly, you’re qualified.',
    costs: [
      ['Engine calls per client per month', '~$1–$2.50', 'Matching ($0.15), foundation intel ($0.12–$0.25), deadlines ($0.08), drafting support ($0.20) as needed'],
      ['Site + delivery', '$0–$45/mo', 'Standard stack; deliver as a simple monthly document'],
    ],
    licensing: [
      'No license. One ethical rule that doubles as positioning: charge flat fees, not percentages of grants won. Percentage compensation violates fundraising-profession ethics (AFP code) and several funders prohibit it. Some US states require registration for "fundraising counsel"; the definitions usually target campaign management rather than research services, but check your state’s charitable-solicitation law once you’re advising on strategy rather than just researching.',
    ],
    engineIntro: 'Grant matching across federal, state, foundation, EU, and global development sources, plus 990/990-PF financial intelligence on both funders and peer organizations.',
    endpoints: [
      { v: 'grantpulse', path: '/api/grant/match' },
      { v: 'grantpulse', path: '/api/grant/funder-990' },
      { v: 'grantpulse', path: '/api/grant/org-intel' },
      { v: 'grantpulse', path: '/api/grant/deadline' },
      { v: 'grantpulse', path: '/api/grant/writer' },
    ],
    first30: [
      'Build one complete sample pipeline for a real local nonprofit, free, in exchange for a testimonial and permission to show the (redacted) deliverable.',
      'Price monthly and flat. Small nonprofits budget in monthly line items.',
      'Pitch five more local organizations with the sample in hand. Local wins beat cold outreach in this sector.',
      'Track one number per client: dollars applied for from your pipeline. It’s the renewal conversation.',
    ],
  },
  {
    slug: 'compliance-monitoring-smb',
    title: 'Compliance monitoring for small businesses',
    category: 'B2B services',
    sensitive: false,
    summary: 'A monthly regulatory-watch service for small businesses: what changed, what applies to you, what to do about it. Information service, not legal advice.',
    lede: [
      'Small businesses can’t afford compliance staff, so they run on hope: hope the privacy law doesn’t apply to them, hope the employment rules didn’t change, hope the industry regulator isn’t looking. Meanwhile the rules genuinely do change constantly.',
      'This service is a monthly watch: for each client’s jurisdiction and industry, what changed, what plausibly applies, and what questions to take to their lawyer. You’re the radar, not the law firm.',
    ],
    job: [
      'Onboard each client with a profile: where they operate, what they sell, headcount, data they collect. Monthly, you run the watch (regulatory news, privacy rules, employment-law changes, sector-specific requirements) and deliver a short brief: three to seven items, each with "why this might apply to you" and "what to ask your attorney or accountant."',
      'The deliverable’s tone is the product: plain language, no panic, no pretending to be counsel. Clients renew because the brief replaces a vague anxiety with a short list.',
    ],
    who: 'Detail-readers: paralegals, former HR and operations people, bookkeepers expanding their service line. Bookkeepers have a real edge; they already have the trust and the monthly rhythm.',
    costs: [
      ['Engine calls per client per month', '~$0.50–$1.00', 'News watch ($0.08), plus privacy/employment/sector checks ($0.12–$0.15 each) as profiles require'],
      ['Site + delivery', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'The line to respect is unauthorized practice of law: you summarize what rules exist and flag what may apply; you don’t interpret how the law resolves a client’s specific situation, and every brief says whose job that is (their attorney’s). Kept there, regulatory-information services are a normal, lawful publishing business. HR-adjacent advice has equivalent lines; same discipline.',
    ],
    engineIntro: 'Jurisdiction-aware checks across privacy, employment, corporate, cyber, ESG, and sector rules, plus enforcement-news monitoring.',
    endpoints: [
      { v: 'compliancepulse', path: '/api/comply/news' },
      { v: 'compliancepulse', path: '/api/comply/privacy' },
      { v: 'compliancepulse', path: '/api/comply/employment' },
      { v: 'compliancepulse', path: '/api/comply/sector' },
    ],
    first30: [
      'Pick one industry you know (restaurants, e-commerce, home services) and build the monthly brief template for it.',
      'Produce a real sample brief for a fictional client and show it to two small-business owners and one attorney. The attorney conversation matters twice: it sharpens your lines and often produces your first referral partner.',
      'Price monthly, modestly, and sell the first three subscriptions in your own network.',
      'End every brief with the attorney-question list. It’s your compliance posture and your value proof in one section.',
    ],
  },
  {
    slug: 'marketing-research-service',
    title: 'Marketing research service for local businesses',
    category: 'B2B services',
    sensitive: false,
    summary: 'Sell answer-ready marketing intelligence to small businesses: how visible they are to AI assistants, where competitors beat them, and what to do about it, delivered as flat-fee reports.',
    lede: [
      'Small businesses buy marketing help blind. Agencies quote retainers; freelancers quote vibes. What almost nobody sells them is the research layer: where do we actually stand, who’s beating us, and what specifically should we fix first.',
      'New wrinkle that makes this timely: customers increasingly ask AI assistants for recommendations, and most local businesses have no idea whether the assistants even know they exist. That visibility check is a report almost no local agency offers yet.',
    ],
    job: [
      'Your core product is a marketing intelligence report, flat fee, delivered in a week: LLM-visibility analysis (what AI assistants say when asked for businesses like theirs), competitor gap analysis, local SEO review, and a prioritized fix list. No retainer required, which is exactly why owners say yes.',
      'Natural upsells for clients who want execution: content briefs, ad-copy variants, email sequences, and a quarterly re-check subscription that shows movement. You can deliver execution yourself or hand the report to their existing marketer; the report sells either way.',
    ],
    who: 'Marketing-curious generalists, freelance writers who want productized income, and anyone who’s run a small business’s social account and wished for actual data.',
    costs: [
      ['Engine calls per report', '~$0.50–$0.80', 'LLM visibility ($0.15), competitor gap ($0.10), local SEO ($0.08), plus content briefs ($0.15) on upsell'],
      ['Site + delivery', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'None. The honesty rules are the usual ones: report what the checks actually found, no traffic or revenue promises, and clearly mark estimates as estimates.',
    ],
    engineIntro: 'LLM-visibility analysis, competitor gap analysis, local SEO review, and ready-to-use content and campaign material for the execution upsell.',
    endpoints: [
      { v: 'marketpulse', path: '/api/market/llm-visibility' },
      { v: 'marketpulse', path: '/api/market/competitor-gap' },
      { v: 'marketpulse', path: '/api/market/local-seo' },
      { v: 'marketpulse', path: '/api/market/content-brief' },
      { v: 'marketpulse', path: '/api/market/ad-copy' },
    ],
    first30: [
      'Run the full report on three local businesses you frequent, free, and hand it over in person. One will hire you for something.',
      'Lead every pitch with the AI-visibility angle. "Do you know what ChatGPT says when someone asks for a plumber in your town?" opens doors that "SEO analysis" doesn’t.',
      'Fix your flat price and your one-week turnaround, and put both on the site.',
      'Build the quarterly re-check as a subscription from day one; movement over time is what makes clients stay.',
    ],
  },

  {
    slug: 'ai-document-services',
    title: 'AI document services for small businesses',
    category: 'B2B services',
    sensitive: false,
    summary: 'Run the document back-office for local businesses that are drowning in paperwork: scanned archives made searchable, invoice piles turned into spreadsheets, contracts cleaned up and redacted, signatures collected, certified mail handled. Built on off-the-shelf AI PDF tools plus a pay-per-letter mailing engine.',
    lede: [
      'Every small business produces paperwork faster than it processes it: contracts that exist only as scans, invoice piles that someone retypes into a spreadsheet, forms that still get printed just to be signed. The owner knows this is a solved problem. They do not have time to learn the tools that solved it.',
      'That gap is a service business. Modern AI-equipped PDF suites cost about $8 a month and do the heavy lifting: OCR, data extraction, summarizing, redaction, e-signatures. You bring the tools, the workflow, and the discipline; the client hands over a mess and gets back order, at a flat per-job price.',
    ],
    job: [
      'You sell a short menu of finishable document jobs. Archive rescue: a box or folder of scanned paper becomes an organized, searchable, OCR’d set of PDFs with sensible filenames. Data extraction: a stack of PDF invoices or statements becomes a clean spreadsheet, checked by you, without anyone retyping. Document cleanup: contracts and proposals converted, reformatted, watermarked, or redacted properly (real redaction, not a black rectangle over live text). Signature runs: documents set up for e-signing so the client stops printing to sign. Each job is quoted flat, delivered by a deadline, and done with tools any owner could buy but never will.',
      'The AI features are your speed, not your judgment. The suite summarizes a 40-page contract or extracts five hundred invoice lines in a minute; you verify against the source before anything ships, because you are selling accuracy, not magic. Every deliverable gets a human pass.',
      'When a job ends in something that must be physically sent, a contract, a notice, a records request, the engine finishes it: the client approves the exact document, and it gets printed and mailed as US certified mail with tracking and proof of delivery, without you touching a printer either.',
    ],
    who: 'Suits a careful, systems-minded person who likes visible before-and-after results. Office-manager, bookkeeping, or paralegal-adjacent experience helps but is not required; the tools are consumer-grade. You need the patience to spot-check extractions and the spine to tell a client when a scan is too degraded to promise accuracy on.',
    costs: [
      ['An AI PDF suite', '~$8/mo or one-time', 'Foxit (subscription, includes e-sign) or UPDF (one-time license). Our sister site compares them honestly at thebizcheckup.com/adobe-alternatives; links there are affiliate links, meaning the tool makers pay us a commission if you buy through them. The comparison is still best-fit-wins.'],
      ['Engine calls per mailed document', '$6.00 wholesale', 'Only when a client wants a finished document printed and mailed as US certified mail with tracking and proof of delivery; everything else in this business runs on the PDF suite'],
      ['Payment + intake page', '$0–$45/mo', 'A payment link and a form that collects the job, the deadline, and the files'],
    ],
    licensing: [
      'Formatting, converting, extracting, and organizing documents is clerical work, and clerical work is not a licensed profession. The line to respect is content: you process documents, you do not author legal ones or advise on what they should say. If a client asks whether their contract is any good, that question belongs to a lawyer, and saying so is part of the service.',
      'You will regularly hold other people’s sensitive paper: contracts, payroll runs, medical invoices. Act like it. Take files through a channel you control, keep them only as long as the job runs, delete them when it ends, and say all of that on your site. In most places there is no license for this business, but data-protection rules (GDPR and its cousins) apply the moment personal information is in the pile, and redaction jobs in particular deserve a second pass before delivery.',
    ],
    engineIntro: 'Most of this business runs on the off-the-shelf PDF suite; the engine covers the last mile. When a finished document has to travel as real mail, the address gets verified, the document gets printed, and it goes out as US certified mail with a tracking number and delivery confirmation you hand to the client, all pay-per-letter, no printer, no post-office queue.',
    endpoints: [
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Pick your suite (the comparison at thebizcheckup.com/adobe-alternatives is a ten-minute read), buy it, and run all four jobs on your own paperwork first: OCR a folder of scans, extract one statement pile to a spreadsheet, redact a document properly, set up one e-signature.',
      'Define three flat-priced packages with names a busy owner understands: the archive rescue, the invoice pile, the signature setup. Services in this lane commonly price simple jobs at $50 to $150 and archive projects by the box; your tool cost is a rounding error, so price on the hours and the care.',
      'Do one free before-and-after for a business you already know, and photograph the before (the box of paper) with permission. That image is your entire marketing.',
      'Pitch where owners already complain about paperwork: the local chamber, bookkeeper referrals, one plain post in a local business group. "I make your paperwork searchable, signable, and sent" is the whole pitch.',
      'Write your data-handling promise (what you keep, for how long, and that you delete after delivery) before your first paid job, and put it on the intake page.',
    ],
  },

  // ── Commerce & flipping ───────────────────────────────────────────────────
  {
    slug: 'personal-shopper-deal-hunter',
    title: 'Personal shopper and deal-hunting service',
    category: 'Commerce & flipping',
    sensitive: false,
    summary: 'Find people the right product at the best achievable price, stacking sales, coupons, and cashback, and charge a flat finder fee.',
    lede: [
      'Busy people overpay constantly, not from extravagance but from not having four hours to research a laptop, compare prices across nine retailers, and figure out which coupon stacks with which card offer. A deal hunter sells those four hours back.',
      'You take a request ("best robot vacuum under $400 for pet hair"), run the research, and deliver the recommendation with the exact buying play: where, when, with which stacked discounts.',
    ],
    job: [
      'Requests come in two flavors. Product-finding: the customer knows the job, not the product; you deliver a shortlist with a clear pick and the reasoning. Price-execution: they know the product; you deliver the timing (price history says wait or buy), the venue, and the stack (sale plus coupon plus card cashback), computed rather than guessed.',
      'Price it flat per request, tiered by ticket size. Resist percentage-of-savings pricing; it invites arguments about the baseline and slows every sale.',
    ],
    who: 'Natural researchers who already do this for friends free. Also a strong add-on service for virtual assistants who want a productized offer.',
    costs: [
      ['Engine calls per request', '~$0.25–$0.50', 'Product find ($0.10), price compare ($0.08), history ($0.08), stack ($0.10)'],
      ['Payment + request form', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'None. If you also join affiliate programs for products you recommend, disclose it plainly on every recommendation (FTC endorsement rules); your credibility is the whole asset here.',
    ],
    engineIntro: 'Use-case product matching, one-call pre-purchase clearance (verdict plus official recall screen), live price comparison, price-history timing calls, and discount stacking with the math done.',
    endpoints: [
      { v: 'findpulse', path: '/api/find/product' },
      { v: 'findpulse', path: '/api/find/buy-check' },
      { v: 'dealpulse', path: '/api/deals/compare' },
      { v: 'dealpulse', path: '/api/deals/history' },
      { v: 'dealpulse', path: '/api/deals/stack' },
      { v: 'findpulse', path: '/api/find/alternative' },
    ],
    first30: [
      'Do ten free requests for friends this week and keep score: hours saved, dollars saved, both written down.',
      'Set three flat tiers by ticket size and publish them.',
      'Pick a visible niche to start (parents’ gear, home office, gaming) so word-of-mouth has something to grab.',
      'Post one worked example (request, research, the stack, the final price) as your storefront. One honest example outsells any ad.',
    ],
  },
  {
    slug: 'collectibles-flipping',
    title: 'Collectibles flipping with pricing data',
    category: 'Commerce & flipping',
    sensitive: false,
    summary: 'Buy and sell cards, coins, comics, and memorabilia with live market-value, grading, and authentication intelligence instead of gut feel.',
    lede: [
      'Collectibles flipping rewards exactly one thing: knowing what an item is worth faster and more accurately than the person across the table. That used to take years of niche immersion. The data now exists on demand.',
      'This business is classic buy-low-sell-right (estate sales, lots, marketplaces) with an engine answering the three questions that decide every deal: what’s it worth at this grade, is grading worth the fee, and is it even real.',
    ],
    job: [
      'Sourcing: estate sales, storage auctions, mixed lots, and underpriced single listings. At the table, you run value checks by grade and condition before you bid. Back home, the grading endpoint tells you when a $25 grading fee turns a $60 raw card into a $200 slabbed one, and when it doesn’t. The authentication guide keeps you from the mistake that ends flipping careers: paying real money for a fake.',
      'Selling: price to the data, note comps in your listings (buyers pay more when the price is justified), and let the investment-signal endpoint tell you which inventory to hold versus move.',
    ],
    who: 'People who already love a category. The engine replaces the decade of price immersion, not the enthusiasm; you still need to enjoy the hunt.',
    costs: [
      ['Engine calls per sourcing day', '~$0.50–$2', 'Value checks ($0.10 each) on candidates, grading calls ($0.08), authentication ($0.10)'],
      ['Inventory float', '$100–$500 to start', 'Your buying capital; start small and recycle'],
      ['Marketplace fees', '~13%', 'eBay and similar take their cut of sales'],
    ],
    licensing: [
      'No license for buying and selling collectibles generally, with local exceptions worth checking: some jurisdictions regulate secondhand dealers or precious-metal buyers (registration, hold periods). Report your income; flipping profits are taxable income everywhere, and marketplaces report sales to tax authorities in many countries now. Never sell an item as graded or authenticated when it isn’t.',
    ],
    engineIntro: 'Market value by grade and condition, grading-service guidance with the math, authentication guides per category, and buy/hold/sell signals.',
    endpoints: [
      { v: 'collectablespulse', path: '/api/collect/value' },
      { v: 'collectablespulse', path: '/api/collect/grade' },
      { v: 'collectablespulse', path: '/api/collect/authenticate' },
      { v: 'collectablespulse', path: '/api/collect/invest' },
    ],
    first30: [
      'Pick one category you already know and love. One.',
      'Set a $100–$300 float and a rule: every buy gets a value check first, no exceptions, even at auction pace.',
      'Do one estate-sale weekend and list everything within three days; velocity teaches faster than margin at the start.',
      'Track every flip in a spreadsheet: buy price, fees, sale price, days held. The spreadsheet is your real teacher.',
    ],
  },

  {
    slug: 'resale-flipping',
    title: 'Retail arbitrage and resale flipping',
    category: 'Commerce & flipping',
    sensitive: false,
    summary: 'Source underpriced retail, clearance, and secondhand goods and resell them online, with a margin check that prices the exit before you spend a dollar on the buy.',
    lede: [
      'Retail arbitrage is the plainest business model there is: buy something below its resale value, sell it where the buyers are, keep the difference. Clearance aisles, liquidation lots, thrift stores, and online markdowns feed a resale market that runs through eBay, Amazon, Mercari, and Poshmark.',
      'The people who lose at this buy on instinct. The people who last price the exit first. The engine answers the deciding question in one call: if I buy this item at this price, what do I actually clear after fees and shipping when it sells.',
    ],
    job: [
      'Sourcing: clearance endcaps, liquidation pallets, thrift racks, estate-sale leftovers, and online markdowns. At the shelf, you run one margin check per serious candidate. It returns live eBay asking prices for the same item (each linked to a real listing), fee math for five marketplaces, net profit at the low, median, and high comparable prices, and a plain FLIP, THIN, or PASS verdict. THIN and PASS go back on the shelf; your discipline is the business.',
      'Selling: list fast, price at or just under the median comparable, and pick your venue from the best-venue table, because the same item nets a different amount on eBay, Poshmark, and Mercari after each platform takes its cut. Before large buys, discounted gift cards and verified coupon codes lower your acquisition cost, which is the only number in this business you fully control. For used goods, a recall check keeps you from reselling something you legally cannot.',
    ],
    who: 'People who enjoy the hunt and can stay disciplined when the verdict says PASS on something they liked. No technical skill required; checking and listing are phone work.',
    costs: [
      ['Engine calls per sourcing day', '~$1–$5', 'Margin verdicts ($0.50 per item); run them only on items that pass your eye test'],
      ['Acquisition-cost levers', '~$0.25–$0.50 per trip', 'Discounted gift-card rates ($0.25), coupon verification before big buys ($0.50)'],
      ['Inventory float', '$100–$500 to start', 'Your buying capital; start small and recycle it'],
      ['Marketplace fees', '~10–20% of each sale', 'Already included in every verdict before you buy'],
    ],
    licensing: [
      'No license to resell general merchandise in most places, with exceptions worth checking: some jurisdictions regulate secondhand dealers (registration, records, hold periods), some categories are restricted or unwise to resell (recalled products, certain cosmetics and food items), and some brands are gated on Amazon regardless of where you bought the stock. Flipping profit is taxable income everywhere, and marketplaces now report seller totals to tax authorities in many countries. Never resell a recalled product; the engine can check.',
    ],
    engineIntro: 'A margin verdict before you buy, acquisition-cost levers at checkout, and a recall check for used goods.',
    endpoints: [
      { v: 'arbipulse', path: '/api/flip-check' },
      { v: 'dealpulse', path: '/api/deals/giftcard' },
      { v: 'dealpulse', path: '/api/deals/check' },
      { v: 'findpulse', path: '/api/find/recall' },
    ],
    first30: [
      'Walk one clearance section and run the margin check on ten items you would have bought on instinct. Count how many come back PASS. That number is the tuition you did not pay.',
      'Set a floor for month one: buy FLIP verdicts only. THIN margins are for later, when you know your categories and your sell-through speed.',
      'List everything within 48 hours, priced at or just under the median comparable. Velocity teaches faster than margin while you learn.',
      'Track every flip in a spreadsheet: buy price, fees, sale price, days held. After twenty flips the spreadsheet will tell you which categories are yours.',
    ],
  },

  // ── Creators & content ────────────────────────────────────────────────────
  {
    slug: 'author-research-assistant',
    title: 'Research assistant service for authors and academics',
    category: 'Creators & content',
    sensitive: false,
    summary: 'Sell verified-citation research support to nonfiction authors, grad students, and academics: bibliography checks, literature briefs, and source verification, with an engine that refuses to invent references.',
    lede: [
      'Every nonfiction author and grad student has the same two research problems: finding what’s actually been written on a topic, and making sure every citation in the manuscript is real, current, and correctly attributed. AI assistants made the second problem worse; invented citations now slip into serious work regularly.',
      'This service sells the fix: literature research and citation verification built on an engine whose defining behavior is that it checks references against real bibliographic databases and says "could not verify" instead of guessing.',
    ],
    job: [
      'Three productized offers. Bibliography verification: the author sends their reference list; you return it annotated (verified, corrected, could-not-verify) before the manuscript goes to the publisher. Literature briefs: a grounded synthesis of what’s been published on a topic, with real citations, as a starting map for a book chapter or thesis section. Author and topic scouting: who’s publishing on what, which venues, what’s rising, for authors positioning proposals.',
      'Your customers are nonfiction authors on deadline, grad students whose advisors stopped reading their drafts, self-publishing academics, and small presses without fact-checking staff.',
    ],
    who: 'Librarians and library-science students are the natural operators, along with grad students, editors, and research-inclined writers. If citation formats don’t scare you, you’re in.',
    costs: [
      ['Engine calls per project', '~$0.50–$2', 'Reference checks ($0.15 per batch), literature briefs ($0.25), paper lookups ($0.05), topic scans ($0.20)'],
      ['Site + delivery', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'None. The professional line that matters is academic integrity: you verify, research, and map sources; you don’t ghostwrite student work that will be submitted as their own. State that policy on your site; the clients you want will trust you more for it.',
    ],
    engineIntro: 'Bibliography verification against real databases, grounded literature synthesis, author and journal metrics, and rising-topic scans. When a reference can’t be verified, it says so.',
    endpoints: [
      { v: 'citepulse', path: '/api/ref-check' },
      { v: 'citepulse', path: '/api/literature-brief' },
      { v: 'citepulse', path: '/api/topic-scan' },
      { v: 'citepulse', path: '/api/paper' },
      { v: 'citepulse', path: '/api/author' },
    ],
    first30: [
      'Verify the bibliography of one published book in your field and write up what you found (politely). That document is your calling card.',
      'Price per reference batch and per brief, flat, published on the site.',
      'Post your integrity policy (verification and research, no ghostwriting) where clients can see it.',
      'Pitch three small presses and two dissertation-coaching services; they have recurring verification needs and no staff for it.',
    ],
  },

  {
    slug: 'game-asset-creator',
    title: 'Game asset business for artists, musicians, and 3D modelers',
    category: 'Creators & content',
    sensitive: false,
    summary: 'Sell your creative work into the games industry through asset marketplaces that pay 70–90% revenue shares. Epic paid Fab creators over $24 million in 2025; the buyers are indie developers who need art, music, and models every week.',
    lede: [
      'The games industry buys an enormous amount of creative work that never involves a job interview. Every indie developer shipping a game needs environment art, character models, music loops, sound effects, and UI kits, and most of them buy from marketplaces rather than commissioning.',
      'This business is a catalog: you make game-ready assets in your existing craft, list them on the marketplaces with the best terms, and treat the catalog like a product line. Epic’s Fab pays an 88% creator share; itch.io defaults to 90%; Unity Asset Store pays 70%.',
    ],
    job: [
      'You research what developers actually search for in your craft, produce packs that fill gaps (a themed environment set, a genre music bundle, a stylized prop collection), and list them across Fab, itch.io, and the Unity Asset Store with honest previews and clear licensing. Then you keep going: the sellers who earn real money are the ones with forty listings, not four.',
      'The engine carries the research half. The earnings map returns the verified payout table for your specific craft plus a live read of current demand, and the niche checks show where buyer attention actually is before you spend a month producing for a dead category.',
    ],
    who: 'Working artists, musicians, composers, 3D modelers, animators, and writers who already produce finished work in standard tools. No games-industry contacts required; the marketplaces are open to anyone whose submissions pass review.',
    costs: [
      ['Engine calls per research pass', '~$0.40', 'Earnings map for your craft ($0.15) plus a niche check ($0.25) before each new pack'],
      ['Marketplace listing', '$0', 'Fab, itch.io, and Unity Asset Store are free to join; they take their share on sale'],
      ['Portfolio site', '$0–$15/mo', 'The marketplaces host your store pages; a simple portfolio helps with commissions'],
    ],
    licensing: [
      'Your obligations run in two directions. Downstream: every listing carries a license you grant buyers, and the marketplace templates handle it; read them once so you know what you’re promising. Upstream: everything you sell must be yours to sell — no third-party IP, no fan-art of protected characters, and if you use AI tools in your workflow, disclose it where the marketplace requires (Fab requires tagging). Musicians should learn the two-license structure (sync for the composition, master use for the recording) before any custom placement deal, because it’s how game licensing prices are actually built.',
    ],
    engineIntro: 'The earnings map knows the current payout terms across the major marketplaces and platform economies, with sources and dates on every number. The niche checks pull live marketplace and platform data so catalog decisions run on evidence instead of guesswork.',
    endpoints: [
      { v: 'gamepulse', path: '/api/creator/earn-map' },
      { v: 'gamepulse', path: '/api/creator/roblox-check' },
      { v: 'gamepulse', path: '/api/gaming/trending' },
    ],
    first30: [
      'Run the earnings map for your craft and pick your two launch marketplaces from the payout table.',
      'Study the top 20 sellers in your category on each: what do their previews, descriptions, and price points have in common. That is the quality bar, and it is visible for free.',
      'Produce one small pack aimed at a gap you found, not your dream project. Finished and listed beats ambitious and unfinished.',
      'List it on both marketplaces with honest previews, then start pack two the same week. Catalog is the strategy.',
      'Set a research rhythm: one niche check before each new pack, so every production month starts with evidence.',
    ],
  },

  // ── Finance-adjacent ──────────────────────────────────────────────────────
  {
    slug: 'crypto-tax-doc-prep',
    title: 'Crypto tax documentation prep',
    category: 'Finance-adjacent',
    sensitive: false,
    summary: 'Prepare organized, citation-verified crypto activity documentation that clients hand to their CPA. The messy-wallet problem is real, growing, and most tax preparers won’t touch it.',
    lede: [
      'Every tax season, people show up at accountants’ offices with five wallets, three dead exchanges, a DeFi habit, and no records. Most CPAs don’t want to reconstruct on-chain history, and specialist crypto-tax firms price for whales.',
      'This service does the reconstruction and documentation layer: a clean, sourced activity file the client’s regular tax preparer can actually work from. You prepare documentation; the CPA prepares the return.',
    ],
    job: [
      'A client gives you their wallet addresses and exchange records. You run the citation-verified wallet review (the flagship call, $12, which reconstructs activity with verification rather than guesswork), the on-chain investigation for wallets with murky history, and jurisdiction rules checks for where they file. Deliverable: an organized documentation pack (activity summary, flagged events like staking income or NFT sales, jurisdiction notes, open questions for the CPA).',
      'Off-season, the same skills sell as wallet security reviews: drainer-protection scans and security posture checks for people holding meaningful balances.',
    ],
    who: 'Crypto-native people with an organizational streak: the friend who actually kept records. Bookkeepers adding a crypto specialty are a perfect fit and command a premium fast.',
    costs: [
      ['Engine calls per client', '~$13–$15', 'Wallet review ($12.00), wallet investigation ($1.50) when history is murky, jurisdiction check ($0.12)'],
      ['Site + delivery', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'The boundary: preparing documentation is unlicensed; preparing or signing tax returns for compensation triggers preparer rules (PTIN in the US, equivalents elsewhere), and giving tax advice is the CPA’s or tax attorney’s job. Your deliverable ends with "questions for your preparer," not answers to them. Kept there, you’re a bookkeeping-adjacent documentation service, and CPAs will refer clients to you rather than turn the work away. This page is educational information, not tax advice.',
    ],
    engineIntro: 'Citation-verified wallet tax review, on-chain wallet investigation, drainer-protection scans, and per-jurisdiction crypto tax rules. The review’s track record endpoint is public and free.',
    endpoints: [
      { v: 'taxpulse', path: '/api/crypto/wallet-review' },
      { v: 'taxpulse', path: '/api/crypto/wallet-sleuth' },
      { v: 'taxpulse', path: '/api/crypto/wallet-guard' },
      { v: 'taxpulse', path: '/api/tax/crypto' },
    ],
    first30: [
      'Run the full documentation pack on your own wallets first. Your own messy history is the practice ground.',
      'Price per wallet-complexity tier, flat, with the engine’s $12 review cost baked in.',
      'Introduce yourself to three local CPAs in January with a one-page "what I hand you" sample. You’re solving their problem, not competing.',
      'Book off-season security reviews with the same client list; it smooths the seasonality.',
    ],
  },

  // ── Odd jobs & side gigs ──────────────────────────────────────────────────
  {
    slug: 'complaint-resolution-ghostwriting',
    title: 'Complaint-resolution ghostwriting',
    category: 'Odd jobs & side gigs',
    sensitive: false,
    summary: 'Write the effective complaint letters people can’t write when they’re furious: airline refunds, warranty runarounds, billing disputes, deposit returns. They sign and send; you charge flat per letter.',
    lede: [
      'Angry people write bad complaint letters. They rant, they threaten vaguely, they bury the one sentence that would trigger a refund policy or a statutory duty. Companies are staffed to ignore rants and to respond to specific, cited, escalation-ready demands.',
      'This is a ghostwriting service for exactly those letters. The customer tells you what happened; you deliver a letter that names the applicable right, states the demand, and sets the clock. They sign and send it themselves.',
    ],
    job: [
      'Intake is a ten-minute form or call: what happened, what they’ve tried, what outcome they want, what proof they hold. You identify the strongest lever (consumer-protection statute, warranty terms, chargeback rights, tenant deposit rules, the airline and subscription regimes from the sibling blueprints) and draft accordingly. Where the situation matches one of the citation-locked engine letters (flight compensation, subscription refunds, transit claims), you use those; for everything else, the advocacy-letter engine drafts and you edit.',
      'Deliver two versions when it helps: the firm first letter and the escalation letter for fourteen days later. Charge flat per letter, more for the pair.',
      'You can also close the loop yourself: the customer reads the finished letter, approves it exactly as written, and the engine prints and mails it as certified mail with tracking and proof of delivery. The customer stays the author and the signer of record; you’re the one who ran it to the post office.',
    ],
    who: 'Writers with spine and empathy in equal measure. Customer-service veterans are unusually good at this; they know exactly which sentences get escalated.',
    costs: [
      ['Engine calls per letter', '~$0.25–$2.10 (+$6.00 if mailed certified)', 'Advocacy letter draft ($0.25), or a citation-locked regime letter ($2.00) where one fits, plus a rights lookup ($0.08–$0.10), plus $6.00 wholesale if the customer wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['Payment + intake form', '$0–$45/mo', 'Standard stack'],
    ],
    licensing: [
      'Ghostwriting letters that the customer signs and sends in their own name is lawful self-help support; representing someone in a dispute or negotiating for them crosses into regulated territory (and legal advice belongs to lawyers). Flat fee, never a percentage of the recovery. Where a matter is clearly legal-scale (injury, large sums, litigation), your letter says one thing: see a lawyer, and here’s the referral path.',
    ],
    engineIntro: 'A general advocacy-letter drafter plus rights lookups, with citation-locked specialist letters (flight, transit, subscription) for the situations they cover. Once the customer approves a letter, the same engine can print and mail it as certified mail, with tracking and delivery confirmation.',
    endpoints: [
      { v: 'legalpulse', path: '/api/legal/letter' },
      { v: 'legalpulse', path: '/api/legal/consumer' },
      { v: 'legalpulse', path: '/api/legal/tenant' },
      { v: 'dealpulse', path: '/api/deals/subscription-letter' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Write three letters free for people you know with live grievances, and track outcomes; resolved complaints are your testimonials.',
      'Set two flat prices: single letter, and letter-plus-escalation pair.',
      'Build the ten-minute intake form; a good form is half the product.',
      'Post one anonymized before-and-after (the rant they drafted, the letter you sent, the refund email). It sells the service better than any explanation.',
    ],
  },
  {
    slug: 'ai-visibility-consultant',
    title: 'AI-visibility consulting for local businesses',
    category: 'B2B services',
    sensitive: false,
    summary: 'Scan a business\u2019s website for the signals AI assistants actually read, hand them the evidence and the fix list. Engine cost is about $0.65 per client; SEO consultancies bill monthly retainers for less concrete work.',
    lede: [
      'When someone asks ChatGPT or Perplexity for \u201ca good plumber near me,\u201d almost nobody local shows up. Industry measurements put AI-assistant recommendation rates around 1% of local businesses, against roughly 36% for the same businesses in Google\u2019s local pack. The owners can\u2019t see why, and most SEO consultants are still selling last decade\u2019s checklist.',
      'This business answers the new question with evidence. You run a live scan of the client\u2019s actual website, show them exactly which AI crawlers their robots.txt is blocking and which structured data is missing, and sell the fix work or hand them the punch list.',
    ],
    job: [
      'A client gives you their domain. You run one scan and get back verbatim evidence: the robots.txt rules for fourteen AI crawlers, whether an llms.txt exists, what Schema.org data the homepage carries, whether name, address, and phone are machine-readable. The scan grades the site and orders the fixes by impact, with the exact lines and snippets to change.',
      'You walk the client through the evidence, not a slide deck. They can open their own robots.txt and see the same blocked crawler you\u2019re pointing at. Then you either implement the fixes for a project fee or sell the punch list as the deliverable and re-scan a month later to show the change.',
    ],
    who: 'Suits someone comfortable talking to small-business owners and unafraid of a robots.txt file. You don\u2019t need to be a developer; the scan tells you what to change and where. Prior SEO experience helps you price it, not do it.',
    costs: [
      ['Engine calls per client', '~$0.65', 'One AI-visibility scan ($0.50) plus a local SEO punch list ($0.08) or content brief ($0.15) at public catalog prices'],
      ['A way to take payment', '$0\u2013$30/mo', 'PayPal, Stripe, or a payment link'],
      ['A one-page site', '$0\u2013$15/mo', 'What you check, what you charge, a sample report'],
    ],
    licensing: [
      'Website consulting is unregulated nearly everywhere. The honest-practice rules are commercial, not legal: never promise a ranking or a recommendation rate (no one can), sell the evidence and the fixes, and let re-scans do the proving. If you also run ads for clients, disclose any affiliate or platform relationships plainly.',
    ],
    engineIntro: 'The engine fetches the client\u2019s live site and reads the signals machines read: per-crawler robots.txt access for GPTBot, ClaudeBot, PerplexityBot, Google-Extended and ten more, llms.txt, Schema.org types, NAP completeness, sitemap. The grade is computed from the evidence, so two scans of the same site agree, and every claim in your report is a line the client can verify by opening the same file. Country-aware local SEO and content briefs cover the follow-on work anywhere in the world.',
    endpoints: [
      { v: 'marketpulse', path: '/api/market/ai-visibility-check' },
      { v: 'marketpulse', path: '/api/market/llm-visibility' },
      { v: 'marketpulse', path: '/api/market/local-seo' },
      { v: 'marketpulse', path: '/api/market/seo-review' },
      { v: 'marketpulse', path: '/api/market/content-brief' },
    ],
    first30: [
      'Scan your own site first, fix what it flags, and keep the before-and-after. A consultant whose own site grades \u201cstrong\u201d opens every conversation from the right side of the table.',
      'Scan ten local businesses you\u2019d want as clients. The ones blocking AI crawlers without knowing it are your warmest calls: you\u2019re not selling, you\u2019re showing them their own robots.txt.',
      'Set a flat diagnostic fee and a separate implementation fee. The scan costs you fifty cents; established SEO consultancies bill monthly retainers for reporting less concrete than this.',
      'Deliver the first three as paid pilots at half price in exchange for a re-scan testimonial once their grade moves.',
      'Offer a quarterly re-scan subscription. Sites drift, platforms change crawler names, and the re-scan is recurring revenue with near-zero marginal work.',
    ],
  },
  {
    slug: 'demand-letter-prep-service',
    title: 'Demand letter prep service',
    category: 'Doc-prep & paperwork',
    sensitive: false,
    summary: 'Help people write and send their own demand letters — deposits, refunds, billing errors, contractor disputes — with the applicable statute cited and proof of certified delivery. Engine cost is dimes for the research; mailing runs $6 wholesale; the client signs, and the client sends.',
    lede: [
      'A landlord who won’t return a deposit, a contractor who took a payment and stalled, a company that billed for something it shouldn’t have: most people who are owed money in situations like these never write the letter that would start the clock, because they don’t know which statute backs them up or how to say it so it gets read.',
      'This business runs the intake, researches the statute that applies, and drafts a cited letter in the client’s own name and their own words demanding the money, the deadline, and the next step. The client reads it, edits anything they want changed, approves it, and you mail it as certified mail so there’s a tracking number and a delivery date on record.',
    ],
    job: [
      'Intake is a short form or a ten-minute conversation: what happened, what proof they have, what they want (refund, deposit back, corrected bill, contractor to finish or refund). You run the applicable rights lookup, whether that’s tenant deposit law, consumer billing rights, or a small-claims threshold check for a contractor dispute, and the engine returns the statute, the deadline it imposes, and the language a demand letter needs to invoke it.',
      'You turn that into a letter: what happened, what the client is owed, the citation that backs it, a deadline, and what happens next if the deadline passes (a filed complaint, small claims, nothing dramatic, just a clear next step). The client reads the exact letter before anything is sent, changes whatever they want changed, and approves it. Only then does it go out.',
      'Once approved, the engine prints the letter and mails it as certified mail with tracking and proof of delivery. That receipt is often the most valuable part of the file: it is very hard for the other side to claim they never got a demand that USPS confirms they signed for.',
    ],
    boundary: [
      'This is self-help document preparation, not legal advice, and the difference is the whole business. The client is always the author of the letter and always the one who sends it, even though your engine drafted it and your process mailed it. You operate software and logistics; you never recommend a legal strategy, never sign a letter, never send one in your own name, and never threaten criminal charges or "we will report you" in a civil demand letter, because that can cross into extortion in some jurisdictions regardless of intent. Civil next steps only: small claims, a regulatory complaint, a refund request escalation.',
      'If a client’s situation is bigger than a demand letter, personal injury, a real contract fight, anything headed for litigation, you say so plainly and point them to a lawyer. That referral costs you nothing and it is the single fastest way to earn trust in this business.',
    ],
    whyItWorks: [
      'A demand letter works even without a law degree behind it because a lot of statutes are written to reward exactly this step: many states require a written demand before a landlord owes double or treble damages on a withheld deposit, many consumer-protection laws start their response clock the day a demand is received, and fee-shifting provisions in some statutes only trigger once the other side has been formally asked and refused. The letter doesn’t need a bar number. It needs the right citation, the right deadline, and proof it arrived.',
      'Certified mail solves the "we never got it" problem outright: the signature confirmation is dated evidence the recipient can’t credibly dispute later, in a demand file or in small claims court. Between the citation and the delivery receipt, substance is doing the work that letterhead used to do.',
    ],
    who: 'Suits someone with patience for paperwork, plain writing, and a customer-service temperament: comfortable telling someone their case is weak, comfortable sending the letter when it’s strong. No legal background required; the engine carries the statute knowledge. It stacks well next to the recovery blueprints (subscription review, medical bill review, insurance documentation) since the mailing step is identical across all of them.',
    costs: [
      ['Engine calls per client', '~$0.10–$0.50 (+$6.00 if mailed certified)', 'One or two statute lookups (tenant deposit, consumer billing, or small-claims threshold) at $0.08–$0.10 each at public catalog prices, plus $6.00 wholesale if the client wants the letter printed and mailed certified with tracking and proof of delivery'],
      ['Payment + intake form', '$0–$45/mo', 'Standard stack: a short form, a way to take payment, nothing else required'],
    ],
    licensing: [
      'Drafting a letter that the client reads, edits, signs, and sends in their own name is self-help document preparation in most places and doesn’t require a license; giving legal advice about strategy, or negotiating and representing the client in a dispute, is the unauthorized practice of law almost everywhere. Stay a preparer: you supply the citation and the draft, the client supplies the decision and the signature. Flat fee, never a percentage of any recovery. Where a state or country regulates "legal document assistants" or similar (a handful of US states do), register if it applies to you before you charge your first customer.',
    ],
    engineIntro: 'The engine runs rights lookups across tenant deposit law, consumer billing protections, and small-claims thresholds, returning the applicable statute, its deadline, and citation language a letter can use. Once the client approves the drafted letter, the same engine prints and mails it as certified mail, with a tracking number and delivery confirmation you hand back to them.',
    endpoints: [
      { v: 'legalpulse', path: '/api/legal/rights' },
      { v: 'legalpulse', path: '/api/legal/tenant' },
      { v: 'legalpulse', path: '/api/legal/consumer' },
      { v: 'legalpulse', path: '/api/legal/small-claims' },
      { v: 'mailpulse', path: '/api/verify-address' },
      { v: 'mailpulse', path: '/api/letters' },
      { v: 'mailpulse', path: '/api/letters/{id}' },
    ],
    first30: [
      'Write your own demand letter first, for a real deposit or billing dispute if you have one on hand, start to finish including the certified mail step, so you’ve walked the whole path before charging anyone.',
      'Write the scope page in plain language: what you do (research, draft, mail), what you never do (give legal advice, sign anything, send anything in your own name, threaten criminal action), and where the lawyer referral line sits.',
      'Set one flat price for the package (draft plus certified mailing) and one lower price for draft-only, for clients who want to print and mail it themselves.',
      'Offer three letters free or at cost to people you know with a live dispute, and track what happens after the certified receipt lands. A refunded deposit or a paid invoice is your best testimonial.',
      'Introduce yourself to a local tenant-rights group or small-business network; referrals in this lane come from people who’ve seen the statute work, not from ads.',
    ],
    workedExample: 'Worked example with real receipts — coming shortly. A real, documented run (an actual letter, an actual USPS tracking number, an actual delivery confirmation) will replace this note once our payment-rail credentials are live end to end. Until then, this section stays a placeholder rather than a guess.',
  },
];
