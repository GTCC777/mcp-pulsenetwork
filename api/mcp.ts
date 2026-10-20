// HTTP (Streamable HTTP) MCP entry — hosted on Vercel so the network is installable by any
// remote MCP client (Smithery, Claude, Cursor, Coinbase-for-Agents). Stateless: a fresh
// server+transport per request. The caller supplies their own Base wallet key (we never pay
// for users); without a key, tools still LIST — they only fail at call time.
//
// We drive the *web-standard* transport directly (not the Node wrapper, which routes through
// Hono and reads req.rawHeaders) so we can guarantee the Accept header the SDK requires —
// some scanners (e.g. Smithery) send only `application/json`, which the transport otherwise
// 406s. We answer with JSON (enableJsonResponse), so SSE isn't needed.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { registerTools, buildPaymentFetch } from '../lib/register-tools.js';
// `with { type: 'json' }` is required on Node 24 ESM — omitting it crashed this function at
// import time (ERR_IMPORT_ATTRIBUTE_MISSING): every /mcp request 500'd since the Node bump.
import catalog from '../public/.well-known/pulse-catalog.json' with { type: 'json' };

// Derived from the canonical machine catalog (bundled at build time) — the same file the
// landing page and all external messaging cite, so every public surface states one pair.
const VERTICAL_COUNT = (catalog as { vertical_count: number }).vertical_count;
const ENDPOINT_COUNT = (catalog as { endpoint_count: number }).endpoint_count;

// Wallet keys are accepted via the x-agent-private-key header ONLY. Query strings are
// recorded in request logs (ours and any proxy's), so a key sent that way is a custody
// liability — we refuse the request outright and tell the caller to rotate the key.
// Deliberately NO process.env fallback here: this endpoint is shared and unauthenticated,
// so a server-side key would sign payments for every anonymous caller. The env-var flow
// belongs to the self-run stdio entry (index.ts) only.
function resolveKey(req: VercelRequest): { key?: string; queryKeyRejected: boolean } {
  const q = (req.query ?? {}) as Record<string, string | string[]>;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  let fromQuery = first(q.agentPrivateKey) ?? first(q.AGENT_PRIVATE_KEY);
  const cfg = first(q.config);
  if (!fromQuery && typeof cfg === 'string') {
    try { fromQuery = JSON.parse(Buffer.from(cfg, 'base64').toString()).agentPrivateKey; } catch { /* ignore */ }
  }
  const key = first(req.headers['x-agent-private-key'] as string | string[] | undefined) ?? undefined;
  return { key, queryKeyRejected: Boolean(fromQuery) };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-agent-private-key, mcp-session-id, mcp-protocol-version, authorization');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id, mcp-protocol-version');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const server = new McpServer({
    name: 'PulseNetwork',
    version: '1.1.0',
    description: `PulseNetwork — ${VERTICAL_COUNT} AI-powered intelligence verticals (${ENDPOINT_COUNT} endpoints), x402-native. USDC on Base + Solana, USDG on Robinhood Chain, XRP + RLUSD on XRPL. Finance, health, law, travel, real estate, immigration, crypto, careers, and more. Free catalog: /.well-known/pulse-catalog.json`,
  });

  let fetch402: ReturnType<typeof buildPaymentFetch> | undefined;
  const { key, queryKeyRejected } = resolveKey(req);
  registerTools(server, () => {
    // Custody notification first, unconditionally: even if a usable header key was also
    // sent, the query copy hit request logs and the caller must be told to rotate it.
    if (queryKeyRejected) throw new Error('Private keys in URL query parameters are not accepted: query strings can be recorded in request logs, so the key you sent was NOT used and should be treated as exposed — rotate it. Send the key via the `x-agent-private-key` header instead, or run the server locally where the key never leaves your machine: `npx -y mcp-pulsenetwork` with AGENT_PRIVATE_KEY in the environment.');
    if (!key) throw new Error('No wallet key provided. Supply your Base wallet private key via the `x-agent-private-key` header, or run the server locally (`npx -y mcp-pulsenetwork` with AGENT_PRIVATE_KEY in the environment). The wallet must hold USDC on Base.');
    if (!fetch402) fetch402 = buildPaymentFetch(key);
    return fetch402;
  });

  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);

  // Build a Web Request with a guaranteed-correct Accept header.
  const host = (req.headers['x-forwarded-host'] as string) ?? req.headers.host ?? 'pulse.theaslangroupllc.com';
  const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https';
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  headers.set('accept', 'application/json, text/event-stream');
  headers.set('content-type', 'application/json');
  const webReq = new Request(`${proto}://${host}${req.url}`, { method: req.method, headers });

  try {
    const webRes = await transport.handleRequest(webReq, { parsedBody: req.body });
    res.status(webRes.status);
    webRes.headers.forEach((value, k) => res.setHeader(k, value));
    res.send(await webRes.text());
  } finally {
    transport.close();
    server.close();
  }
}
