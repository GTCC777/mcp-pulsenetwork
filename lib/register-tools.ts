// Shared tool registration for both transports (stdio entry: index.ts, HTTP entry: api/mcp.ts).
// One source of truth for the per-vertical tools + the `discover` meta-tool.
// Counts in tool copy are DERIVED from VERTICALS — never hardcode them (they drift).
import { z } from 'zod';
import { wrapFetchWithPayment, x402Client } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm';
import { privateKeyToAccount } from 'viem/accounts';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { VERTICALS } from './verticals.js';
import { buildPaymentPolicy, EXPECTED_NETWORK, resolveMaxPaymentAtomic } from './payment-policy.js';

type Fetch402 = ReturnType<typeof wrapFetchWithPayment>;

// This payer only ever pays PulseNetwork's own fleet. The allowlist is enforced
// on the pay path (not just relied on from VERTICALS config) so a poisoned
// baseUrl can never route a signed payment off-fleet.
const ALLOWED_HOST_RE = /^[a-z0-9-]+\.theaslangroupllc\.com$/;

export function buildPaymentFetch(key: string): Fetch402 {
  const account = privateKeyToAccount(key as `0x${string}`);
  const client = new x402Client();
  client.register(EXPECTED_NETWORK, new ExactEvmScheme(account));
  // Pin what may ever be signed: exact USDC on Base to the fleet wallet, under
  // the per-call cap. A non-conforming 402 is refused before any signature.
  client.registerPolicy(buildPaymentPolicy(resolveMaxPaymentAtomic()));
  return wrapFetchWithPayment(fetch, client);
}

function assertFleetUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error(`Refusing non-HTTPS URL (${url.protocol}).`);
  if (url.port !== '') throw new Error(`Refusing explicit port "${url.port}".`);
  if (!ALLOWED_HOST_RE.test(url.hostname)) {
    throw new Error(`Refusing host "${url.hostname}": this wallet only pays *.theaslangroupllc.com (the PulseNetwork fleet).`);
  }
  return url;
}

async function callEndpoint(baseUrl: string, path: string, params: Record<string, string>, fetch402: Fetch402, lang?: string): Promise<unknown> {
  const url = assertFleetUrl(baseUrl.replace(/\/$/, '') + path);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  if (lang) url.searchParams.set('lang', lang);
  const res = await fetch402(url.toString(), { redirect: 'error' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} from ${url}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Register all PulseNetwork tools on an McpServer.
 * @param server   the McpServer instance
 * @param getFetch402  resolves a payment-enabled fetch for the current caller.
 *   Throws (with a helpful message) if no key is available — tools still LIST,
 *   they only fail at call time, so discovery works without a key.
 */
export function registerTools(server: McpServer, getFetch402: () => Fetch402): void {
  for (const [key, vertical] of Object.entries(VERTICALS)) {
    const actions = vertical.endpoints.map(e => e.action);
    const schema: Record<string, z.ZodTypeAny> = {
      action: z.enum(actions as [string, ...string[]]).describe(`Which endpoint to call. Options: ${actions.join(' | ')}`),
      lang: z.string().optional().describe('Response language code (en | es | fr | de | zh | hi | ar | pt | ja | ko | etc.)'),
    };
    const allParams = new Map<string, string>();
    for (const endpoint of vertical.endpoints)
      for (const [pName, pDef] of Object.entries(endpoint.params))
        if (!allParams.has(pName)) allParams.set(pName, pDef.description);
    for (const [pName, desc] of allParams.entries()) schema[pName] = z.string().optional().describe(desc);

    const endpointDocs = vertical.endpoints.map(e => `  • ${e.action} (${e.price}): ${e.description}`).join('\n');

    server.tool(
      key,
      `${vertical.name}: ${vertical.description}\n\nCoverage: ${vertical.globalCoverage}\n\nEndpoints:\n${endpointDocs}`,
      schema,
      async (args) => {
        try {
          const fetch402 = getFetch402();
          const { action, lang, ...params } = args as Record<string, string>;
          const endpoint = vertical.endpoints.find(e => e.action === action);
          if (!endpoint) return { content: [{ type: 'text', text: `Unknown action "${action}" for ${vertical.name}` }] };
          const filtered: Record<string, string> = {};
          for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') filtered[k] = v;
          const data = await callEndpoint(vertical.baseUrl, endpoint.path, filtered, fetch402, lang);
          return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        } catch (err) {
          return { content: [{ type: 'text', text: `Error calling ${vertical.name} (${(args as Record<string, string>).action}): ${String(err)}` }], isError: true };
        }
      },
    );
  }

  // ---- Free builder/developer tools (no payment, no key). The self-serve funnel:
  // an agent can search the catalog, pull a service's spec, and debug its x402 flow
  // without spending a cent — then pay only when it calls a product endpoint.

  server.tool(
    'catalog_search',
    'FREE. Keyword-search every PulseNetwork endpoint (name, description, action, params). Returns matching endpoints with vertical, action, price, params, and base URL — the fastest way to find the right paid endpoint for a task. No wallet or payment needed.',
    {
      query: z.string().describe('Keywords to search for, e.g. "flight delay compensation" or "token honeypot scan"'),
      max: z.string().optional().describe('Max results (default 10, cap 25)'),
    },
    async ({ query, max }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const cap = Math.min(Number(max) || 10, 25);
      const hits: Array<{ score: number; result: Record<string, unknown> }> = [];
      for (const [key, v] of Object.entries(VERTICALS)) {
        for (const e of v.endpoints) {
          const hay = `${key} ${v.name} ${v.description} ${e.action} ${e.description} ${Object.entries(e.params).map(([n, p]) => `${n} ${p.description}`).join(' ')}`.toLowerCase();
          const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
          if (score > 0) {
            hits.push({
              score,
              result: { vertical: key, tool: key, action: e.action, price: e.price, description: e.description, baseUrl: v.baseUrl, path: e.path, params: Object.keys(e.params) },
            });
          }
        }
      }
      hits.sort((a, b) => b.score - a.score);
      const top = hits.slice(0, cap).map(h => h.result);
      return { content: [{ type: 'text', text: top.length ? JSON.stringify(top, null, 2) : `No endpoints matched "${query}". Try broader keywords, or call discover for the category map.` }] };
    },
  );

  server.tool(
    'get_openapi_spec',
    'FREE. Fetch a PulseNetwork service\'s OpenAPI spec and return a condensed view (title, description, every path with method, price, and summary) plus the URL of the full spec. Use after catalog_search to see exact request/response shapes. No wallet or payment needed.',
    { vertical: z.string().describe('Vertical id from discover/catalog_search, e.g. "onchainpulse" or "travelpulse"') },
    async ({ vertical }) => {
      const v = VERTICALS[vertical];
      if (!v) return { content: [{ type: 'text', text: `Unknown vertical "${vertical}". Call discover or catalog_search first.` }], isError: true };
      const specUrl = `${v.baseUrl}/openapi.json`;
      try {
        const res = await fetch(specUrl);
        if (!res.ok) throw new Error(`${res.status}`);
        const spec = await res.json() as { info?: { title?: string; description?: string }; paths?: Record<string, Record<string, { summary?: string; description?: string; 'x-price-usd'?: number }>> };
        const paths = Object.entries(spec.paths ?? {}).flatMap(([p, methods]) =>
          Object.entries(methods).map(([m, op]) => ({
            method: m.toUpperCase(), path: p,
            ...(op['x-price-usd'] != null ? { price_usd: op['x-price-usd'] } : {}),
            summary: (op.summary || op.description || '').slice(0, 160),
          })));
        return { content: [{ type: 'text', text: JSON.stringify({ title: spec.info?.title, description: spec.info?.description, full_spec: specUrl, paths }, null, 2) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `Could not fetch ${specUrl}: ${String(err)}` }], isError: true };
      }
    },
  );

  server.tool(
    'x402_troubleshoot',
    'FREE. Paste an x402 payment error (or describe what happened) and get targeted, deterministic guidance for PulseNetwork endpoints — covers 402 challenge shapes, header names, scheme/network selection, verification and settlement failures. No wallet or payment needed.',
    { error: z.string().describe('The error message, HTTP status + body, or a description of the failure') },
    async ({ error }) => {
      const e = error.toLowerCase();
      const tips: string[] = [];
      if (e.includes('settlement_failed') || e.includes('insufficient_balance')) tips.push('settlement_failed: the facilitator refused to settle — the buyer was NOT charged. insufficient_balance on the Circle Gateway lane usually means the Gateway deposit has not finished attesting (Base deposits take several minutes) or the balance is too low. Retry once after ~1 minute; vanilla Base USDC lanes need USDC in the paying wallet itself.');
      if (e.includes('payment_invalid') || e.includes('verification_failed') || e.includes('invalid')) tips.push('payment_invalid / verification_failed: the signed payload did not match the challenge. Most common causes: (1) you signed against a stale challenge — re-fetch the 402 and sign the fresh one; (2) wrong EIP-712 domain — the vanilla Base lane signs the USDC token domain ("USD Coin", version 2) while the Circle Gateway lane signs "GatewayWalletBatched"; pick ONE accepts entry and use its `extra` exactly; (3) amount or payTo mismatch — echo the chosen accepts entry unmodified into your payment payload.');
      if (e.includes('406') || e.includes('x-payment') || e.includes('header')) tips.push('Header names: PulseNetwork speaks x402 v2 — the challenge arrives in the PAYMENT-REQUIRED header (base64 JSON, also in the body), the client retries with PAYMENT-SIGNATURE, and the receipt returns in PAYMENT-RESPONSE. v1-style X-PAYMENT headers are not accepted.');
      if (e.includes('402')) tips.push('A 402 response IS the product working: parse the JSON body, pick one entry from `accepts` (each lists scheme, network, asset, amount, payTo, extra), sign it with a matching scheme client, and retry the same URL with the PAYMENT-SIGNATURE header.');
      if (e.includes('description') && e.includes('500')) tips.push('If a facilitator rejects with a schema error about resource.description: the description in the signed payload must be ≤500 chars and byte-identical to the challenge — never truncate or edit it client-side.');
      if (!tips.length) tips.push('General checklist: (1) GET the endpoint with no payment → expect 402 with an `accepts` array; (2) choose the entry whose network/asset your wallet supports (Base USDC is first); (3) sign with an x402-v2 client (e.g. @x402/core + @x402/evm ExactEvmScheme, or Circle Gateway / CDP payer SDKs); (4) retry with PAYMENT-SIGNATURE; (5) 200 + PAYMENT-RESPONSE = paid receipt. Free debugging surfaces: every service publishes /openapi.json and /.well-known/x402, and the fleet catalog is at pulse.theaslangroupllc.com/.well-known/pulse-catalog.json.');
      return { content: [{ type: 'text', text: tips.join('\n\n') }] };
    },
  );

  const verticalCount = Object.keys(VERTICALS).length;
  const endpointCount = Object.values(VERTICALS).reduce((n, v) => n + v.endpoints.length, 0);
  server.tool(
    'discover',
    `Discover all available PulseNetwork verticals. Returns a categorized list of all ${verticalCount} intelligence APIs (${endpointCount} endpoints) with descriptions, coverage, pricing, and available actions. Use this to find the right vertical for a task.`,
    { category: z.string().optional().describe('Filter by category: finance | health | law | travel | real-estate | crypto | career | data | global | all') },
    async ({ category }) => {
      const categories: Record<string, string[]> = {
        finance: ['macropulse', 'marketpulse', 'alphapulse', 'filingspulse', 'wealthpulse', 'debtpulse', 'taxpulse', 'remittancepulse', 'tradepulse'],
        health: ['nutripulse', 'fitpulse', 'mindpulse', 'petpulse', 'herbapulse', 'seniorpulse', 'clearcarepulse', 'parentpulse'],
        law: ['legalpulse', 'compliancepulse', 'policypulse', 'debtpulse', 'insurepulse'],
        travel: ['travelpulse', 'riskpulse', 'transitpulse', 'climatepulse', 'remittancepulse'],
        'real-estate': ['proppulse', 'homepulse', 'buildpulse', 'harvestpulse'],
        crypto: ['cryptopulse', 'onchainpulse', 'macropulse'],
        career: ['careerpulse', 'edupulse', 'franchisepulse', 'legalpulse'],
        data: ['chronicapulse', 'patentpulse', 'filingspulse', 'biopulse', 'safepulse', 'esgpulse'],
        global: ['immigrationpulse', 'taxpulse', 'riskpulse', 'transitpulse', 'climatepulse', 'remittancepulse', 'tradepulse'],
      };
      let keys = Object.keys(VERTICALS);
      if (category && category !== 'all' && categories[category]) keys = categories[category];
      const result = keys.map(k => {
        const v = VERTICALS[k];
        return { id: k, name: v.name, description: v.description, coverage: v.globalCoverage, actions: v.endpoints.map(e => `${e.action} (${e.price})`) };
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );
}
