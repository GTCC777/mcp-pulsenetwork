// GET /api/ideas — FREE. The top-of-funnel answer to "how do I use AI to make money?".
// Lists the curated business models, each joined to a LIVE PulseNetwork engine, with illustrative
// economics and a route into the reseller starter kit. No key, no payment — register everywhere.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadModels, enrich, economics } from '../lib/business-models.js';

const STARTER_KIT = 'https://github.com/GTCC777/pulse-starter-kit';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const models = loadModels();
  res.setHeader('cache-control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({
    question: 'How do I use AI to make money?',
    answer:
      'Build an AI ___-in-a-Box. Pick a business model below, fork the starter kit, wire your chosen ' +
      'PulseNetwork endpoints as the engine, brand the result as your own, and ship in ~10 minutes. ' +
      'You charge retail, pay wholesale (near-$0 with a scoped key), and keep the spread — we built ' +
      'the engine, you build and sell the box.',
    models: models.map((m) => ({
      ...enrich(m),
      illustrative_economics: economics(m),
    })),
    next: 'Call /api/blueprint?goal=...&interests=...&budget=... for one tailored build plan.',
    starter_kit: STARTER_KIT,
    monetization: [
      'wholesale reseller — build your own AI ___-in-a-Box (scoped key)',
      'affiliate rev-share (referral code, no box required)',
    ],
    meta_proof:
      'You reached this because an agent called a PulseNetwork endpoint. That same pay-per-call rail ' +
      'is the engine your business will run on — you have already seen it work.',
    disclaimer: 'Illustrative business frameworks and unit economics — not income guarantees.',
  });
}
