// POST|GET /api/hire/quote — FREE deterministic quote for a hire-the-fleet task.
// Validates input against the task-type schema; returns price + eta or declined+reason.
// No LLM in the quote path (no quote-manipulation surface). No payment required here.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { TASK_TYPES, readInput, validateAndQuote } from '../../lib/hire.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  try {
    const input = readInput(req.query as Record<string, unknown>, req.body);
    const taskType = typeof input.task_type === 'string' ? input.task_type : '';

    if (!taskType) {
      // Menu mode: no task_type → return the full menu with live availability.
      res.setHeader('cache-control', 's-maxage=300, stale-while-revalidate=3600');
      res.status(200).json({
        service: 'PulseNetwork Hire-the-Fleet',
        how: 'POST /api/hire/quote with { task_type, ...inputs } for a free quote, then pay the quoted x402 amount at POST|GET /api/hire/{task_type} with the same inputs. Contract: https://pulse.theaslangroupllc.com/hire.md',
        menu: Object.entries(TASK_TYPES).map(([id, t]) => ({
          task_type: id,
          price_usd: t.price_usd,
          eta_seconds: t.eta_seconds,
          available: t.available(),
          ...(t.available() ? {} : { unavailable_reason: t.unavailable_reason }),
          summary: t.summary,
          inputs: t.queryParams,
        })),
        exclusions: [
          'We NEVER send anything on your behalf — deliverables are research memos, no outreach, no emails, no form-fills.',
          'Public business contacts only — personal emails and phone numbers are filtered out in code.',
          'Consumer-targeted lists, protected-class targeting, and anything reading as harassment, doxxing, or deceptive outreach are declined before payment.',
        ],
      });
      return;
    }

    const quote = validateAndQuote(taskType, input);
    if (!quote.ok) {
      res.status(400).json({ task_type: taskType, declined: true, reason: quote.declined_reason, not_charged: true });
      return;
    }
    res.status(200).json({
      task_type: quote.task_type,
      price_usd: quote.price_usd,
      x402_amount: quote.amount,
      eta_seconds: quote.eta_seconds,
      normalized_input: quote.normalized_input,
      pay_at: `https://pulse.theaslangroupllc.com/api/hire/${quote.task_type}`,
      how_to_pay:
        'Call pay_at with these same inputs (GET query params or POST JSON) with no payment → HTTP 402 challenge → sign one of the accepts → retry with PAYMENT-SIGNATURE. Deliverable returns in the paid response body.',
      note: 'Deterministic quote — no LLM on this route.',
    });
  } catch (err) {
    console.error('[FAIL] hire/quote unhandled', err);
    if (!res.headersSent) res.status(500).json({ error: 'quote_failed', message: 'Quote failed unexpectedly (free route, nothing charged). Please retry.' });
  }
}
