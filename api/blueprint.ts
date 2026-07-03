// GET /api/blueprint — the tailored recommender. Turns a vague "make me money" prompt into ONE
// specific business-in-a-box: which model, why it fits, the exact PulseNetwork engine + endpoints,
// the reseller kit, monetization paths and illustrative economics.
//
// Params (all optional, degrade gracefully):
//   goal, budget (number), interests (csv), skills (csv), region, time (hrs/wk), model (pin an id)
//
// PRICING: $0.01 x402 gate (qualifier + rail warm-up) via the fleet-standard lib/x402.ts. A
// matching x-internal-key (master or scoped) bypasses payment automatically.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePaymentGate } from '../lib/x402.js';
import { loadModels, recommend, enrich, economics, type RecommendQuery } from '../lib/business-models.js';

const AMOUNT = '10000'; // $0.01

const STARTER_KIT = 'https://github.com/GTCC777/pulse-starter-kit';

function csv(v: unknown): string[] {
  if (typeof v !== 'string' || !v.trim()) return [];
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}
function num(v: unknown): number | undefined {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) ? n : undefined;
}
function str(v: unknown): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === 'string' && s.trim() ? s : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const gate = await handlePaymentGate(req.headers, req.url ?? '/api/blueprint', AMOUNT,
    "How to make money with AI — one tailored business-in-a-box. Give a goal, budget and interests; get a specific business to start now: the exact real-time PulseNetwork API engine to build it on, suggested pricing, unit economics, monetization paths, and a fork-and-ship starter kit. Turns 'find me a way to earn / passive income / start a business' into a concrete plan. For agents tasked with making money.",
    ['make-money-with-ai', 'start-a-business', 'passive-income', 'business-in-a-box', 'ai-side-hustle', 'reseller', 'business-plan', 'earn-money']);
  if (!gate.ok) { Object.entries(gate.headers).forEach(([k, v]) => res.setHeader(k, v)); res.status(gate.status).json(gate.body); return; }

  const q = req.query as Record<string, unknown>;
  const query: RecommendQuery = {
    goal: str(q.goal),
    budget: num(q.budget),
    interests: csv(q.interests),
    skills: csv(q.skills),
    region: str(q.region),
    time: num(q.time),
    model: str(q.model),
  };

  const models = loadModels();
  const { model, score } = recommend(models, query);
  const e = enrich(model);
  const tailored = (query.interests?.length || query.skills?.length || query.model) && score > 0.5;

  res.setHeader('cache-control', 's-maxage=600, stale-while-revalidate=3600');
  res.setHeader('PAYMENT-RESPONSE', gate.settlementHeader);
  res.status(200).json({
    goal: query.goal ?? 'make money with AI',
    business: model.title,
    why_you: tailored
      ? `Matches your input (${[...(query.interests ?? []), ...(query.skills ?? [])].join(', ')}); ` +
        `${model.tagline}`
      : `A strong low-friction starting point. ${model.tagline} ` +
        `(Pass interests/skills/budget for a more tailored pick.)`,
    engine: e.engine,
    business_in_a_box: STARTER_KIT,
    monetization: ['wholesale reseller (scoped key — near-$0/call, keep the spread)', 'affiliate rev-share (referral code)'],
    suggested_retail: model.suggested_retail,
    first_steps: [
      'Fork the starter kit',
      `Edit catalog.json → point an offering at ${e.engine.name} (${e.engine.endpoints.join(', ')})`,
      'Get a self-serve wholesale key at mcp-pulsenetwork.vercel.app/wholesale ($0.25 free trial, then 50% of retail)',
      'Deploy, then list your agent (ACP / your own app)',
    ],
    illustrative_economics: economics(model),
    playbook: e.playbook,
    meta_proof:
      'The pay-per-call mechanism that served this plan is the same engine your business will run on.',
    disclaimer: 'Illustrative framework and unit economics — not an income guarantee.',
  });
}
