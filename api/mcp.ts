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

function resolveKey(req: VercelRequest): string | undefined {
  const q = (req.query ?? {}) as Record<string, string | string[]>;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  let key = first(q.agentPrivateKey) ?? first(q.AGENT_PRIVATE_KEY);
  if (!key && typeof q.config === 'string') {
    try { key = JSON.parse(Buffer.from(q.config, 'base64').toString()).agentPrivateKey; } catch { /* ignore */ }
  }
  if (!key) key = first(req.headers['x-agent-private-key'] as string | string[] | undefined);
  if (!key && process.env.AGENT_PRIVATE_KEY) key = process.env.AGENT_PRIVATE_KEY;
  return key;
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
    description: 'PulseNetwork — 67 AI-powered intelligence verticals (660+ endpoints), x402-native, USDC on Base + Solana. Finance, health, law, travel, real estate, immigration, crypto, careers, and more.',
  });

  let fetch402: ReturnType<typeof buildPaymentFetch> | undefined;
  const key = resolveKey(req);
  registerTools(server, () => {
    if (!key) throw new Error('No wallet key provided. Supply your Base wallet private key via the `agentPrivateKey` query param (Smithery config) or the `x-agent-private-key` header. The wallet must hold USDC on Base.');
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
