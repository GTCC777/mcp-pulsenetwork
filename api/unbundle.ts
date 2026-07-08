// GET /api/unbundle — The Unbundler. Name a gated data product (Candid, Web of Science, Panjiva,
// GovWin, a Bloomberg sleeve…) and get its decomposition: what you're actually paying for, the
// free public upstreams it curates, a rebuild recipe, honest price math, the licensing traps, and
// — where the PulseNetwork fleet already covers it — the live per-call endpoint that replaces it.
//
// Every decomposition is CURATED (researched 2026-07-06, subscription-arbitrage study). Nothing
// here is LLM-improvised: licensing and legality claims are exactly where hallucination would be
// dangerous, so misses return the decomposed-catalog honestly instead of inventing an answer.
//
// Params: product (required) — the gated product name to decompose. list=true — catalog only.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePaymentGate } from '../lib/x402.js';
import { matchProduct, catalogSummary } from '../lib/unbundle.js';

const AMOUNT = '1000000'; // $1.00

// ≤500 chars HARD LIMIT: x402 clients echo this description into their signed payment payload and
// the CDP facilitator's verify schema rejects resource.description > 500 chars (proven 2026-07-06).
const DESCRIPTION =
  'Name a gated data product — get its decomposition. For procurement, research and buying agents ' +
  'evaluating $1k–$200k/yr data subscriptions: what the product actually adds vs the free public ' +
  'sources under it, exact upstream datasets with licenses, a rebuild recipe, per-call price math, ' +
  'the licensing traps (non-commercial APIs, scraping judgments, live litigation), and the pay-per-' +
  'call alternative where one exists. Curated research, not generated guesses; honest when a moat is real.';

const TAGS = [
  'data-subscription-alternative',
  'build-vs-buy',
  'procurement-agent',
  'research-agent',
  'open-data',
  'cost-reduction',
  'due-diligence',
  'api-alternative',
];

function str(v: unknown): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === 'string' && s.trim() ? s.trim() : undefined;
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const gate = await handlePaymentGate(req.headers, req.url ?? '/api/unbundle', AMOUNT, DESCRIPTION, TAGS);
  if (!gate.ok) { Object.entries(gate.headers).forEach(([k, v]) => res.setHeader(k, v)); res.status(gate.status).json(gate.body); return; }

  const q = req.query as Record<string, unknown>;
  const product = str(q.product);
  const listOnly = str(q.list) === 'true';

  res.setHeader('PAYMENT-RESPONSE', gate.settlementHeader);
  res.setHeader('cache-control', 's-maxage=3600, stale-while-revalidate=86400');

  if (listOnly || !product) {
    res.status(200).json({
      found: false,
      note: product
        ? undefined
        : "Pass ?product=<name> to decompose a specific gated data product. Returning the decomposed catalog.",
      decomposed_catalog: catalogSummary(),
      request_a_decomposition:
        'Product not listed? Email info@theaslangroupllc.com — high-demand products get decomposed and added.',
      methodology:
        "The discriminating test: if the incumbent's moat is CURATION of public facts, it is arbitragable per-call; " +
        'if the moat is data that never touches a public record, it is not — and this catalog says so honestly.',
      disclaimer:
        'Research synthesis for build-vs-buy evaluation — not legal advice. Verify licenses against the primary source before building.',
    });
    return;
  }

  const { entry, confidence, closest } = matchProduct(product);

  if (!entry) {
    // Honest miss — never improvise a decomposition (licensing claims must stay curated).
    console.error('[MISS] unbundle_product_not_in_registry', { product });
    res.status(200).json({
      found: false,
      query: product,
      note: 'This product is not yet in the curated decomposition registry. No guess is returned: licensing and legality claims are researched, never generated.',
      closest_matches: closest,
      decomposed_catalog: catalogSummary().map((c) => c.product),
      request_a_decomposition:
        'Want this one decomposed? Email info@theaslangroupllc.com — high-demand products get researched and added.',
      disclaimer: 'Research synthesis for build-vs-buy evaluation — not legal advice.',
    });
    return;
  }

  res.status(200).json({
    found: true,
    query: product,
    match_confidence: confidence,
    product: entry.product,
    category: entry.category,
    typical_price: entry.typical_price,
    moat_type: entry.moat_type,
    verdict: entry.verdict,
    what_you_actually_pay_for: entry.what_you_actually_pay_for,
    free_upstreams: entry.free_upstreams,
    rebuild_recipe: entry.rebuild_recipe,
    price_math: entry.price_math,
    legal_traps: entry.legal_traps,
    pay_per_call_alternative: entry.our_coverage,
    diy_difficulty: entry.diy_difficulty,
    methodology:
      "The discriminating test: moats built on CURATION of public facts are arbitragable per-call; moats built on data that never touches a public record are not. Verdicts here apply that test — including against our own interests (see 'not_arbitragable' entries).",
    researched: '2026-07-06',
    disclaimer:
      'Research synthesis for build-vs-buy evaluation — not legal advice. Verify licenses against the primary source before building. Incumbent names are used nominatively to identify the products being analyzed.',
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('unhandled_handler_error', { url: req.url, err });
    if (!res.headersSent) {
      res.status(500).json({ error: 'upstream_failed', message: 'This request failed unexpectedly after payment processing began. If you were charged and did not receive a result, this is a bug on our side — please retry or contact support.' });
    }
  }
}
