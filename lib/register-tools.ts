// Shared tool registration for both transports (stdio entry: index.ts, HTTP entry: api/mcp.ts).
// One source of truth for the per-vertical tools + the `discover` meta-tool.
// Counts in tool copy are DERIVED from VERTICALS — never hardcode them (they drift).
import { z } from 'zod';
import { wrapFetchWithPayment, x402Client } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm';
import { privateKeyToAccount } from 'viem/accounts';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { VERTICALS } from './verticals.js';

type Fetch402 = ReturnType<typeof wrapFetchWithPayment>;

export function buildPaymentFetch(key: string): Fetch402 {
  const account = privateKeyToAccount(key as `0x${string}`);
  const client = new x402Client();
  client.register('eip155:8453', new ExactEvmScheme(account));
  return wrapFetchWithPayment(fetch, client);
}

async function callEndpoint(baseUrl: string, path: string, params: Record<string, string>, fetch402: Fetch402, lang?: string): Promise<unknown> {
  const url = new URL(baseUrl + path);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  if (lang) url.searchParams.set('lang', lang);
  const res = await fetch402(url.toString());
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
