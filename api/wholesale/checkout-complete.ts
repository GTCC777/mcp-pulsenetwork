// GET /api/wholesale/checkout-complete?session_id=cs_... — Stripe sends the buyer here after
// payment. We NEVER trust the redirect itself: the session is re-fetched server-side from
// Stripe's API (authenticated), payment_status must be 'paid', and crediting is idempotent
// (SET NX on the session id) so refreshing this page can never double-credit. Credit uses the
// exact same INCRBY as the USDC deposit path — one balance, two funding rails.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pipe, KEY_RE } from '../../lib/wholesale.js';

const HUB = 'https://pulse.theaslangroupllc.com';

function page(res: VercelResponse, status: number, title: string, body: string): void {
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.status(status).send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:-apple-system,system-ui,sans-serif;background:#0b1220;color:#e6edf3;display:flex;justify-content:center;padding:48px 16px}
.card{max-width:560px;background:#121a2b;border:1px solid #24314d;border-radius:12px;padding:28px 30px}h1{font-size:20px;margin:0 0 12px}
p{line-height:1.6;color:#b8c4d6}code{background:#0b1220;border:1px solid #24314d;border-radius:6px;padding:2px 7px;font-size:13px;word-break:break-all}
.ok{color:#4ade80}.warn{color:#fbbf24}a{color:#38bdf8}</style></head><body><div class="card">${body}
<p style="margin-top:20px;font-size:12px;color:#64748b">The Aslan Group LLC · info@theaslangroupllc.com · <a href="${HUB}/wholesale">wholesale terms</a></p></div></body></html>`);
}

async function handlerImpl(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') { res.status(405).json({ error: 'GET only' }); return; }
  const stripeKey = process.env.STRIPE_RESTRICTED_KEY;
  if (!stripeKey) { page(res, 503, 'Not configured', '<h1 class="warn">Card checkout not configured</h1><p>Contact info@theaslangroupllc.com.</p>'); return; }

  const raw = req.query.session_id;
  const sessionId = String(Array.isArray(raw) ? raw[0] : raw ?? '').trim();
  if (!/^cs_[a-zA-Z0-9_]{10,120}$/.test(sessionId)) {
    page(res, 400, 'Invalid session', '<h1 class="warn">Invalid session reference</h1><p>This link is malformed. If you completed a payment, contact info@theaslangroupllc.com with your receipt.</p>');
    return;
  }

  // Server-side truth: fetch the session from Stripe.
  const sr = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeKey}` },
  });
  const session = (await sr.json()) as {
    payment_status?: string; amount_total?: number; metadata?: { wholesale_key?: string; tier_usd?: string }; error?: { message?: string };
  };
  if (!sr.ok) {
    page(res, 502, 'Verification failed', `<h1 class="warn">Could not verify the payment session</h1><p>Stripe said: <code>${(session.error?.message || 'unknown').slice(0, 120)}</code>. If you were charged, contact info@theaslangroupllc.com with your receipt — nothing is lost.</p>`);
    return;
  }
  if (session.payment_status !== 'paid') {
    page(res, 402, 'Payment not completed', '<h1 class="warn">Payment not completed</h1><p>This checkout session has not been paid. If you closed the payment page, start again from your deposit link. No charge was made.</p>');
    return;
  }

  const key = session.metadata?.wholesale_key ?? '';
  const cents = session.amount_total ?? 0;
  if (!KEY_RE.test(key) || cents <= 0) {
    console.error('wholesale/checkout-complete: paid session with bad metadata', { sessionId, cents });
    page(res, 500, 'Reconciliation needed', '<h1 class="warn">Payment received — manual credit needed</h1><p>Your payment succeeded but the session is missing key metadata. Email info@theaslangroupllc.com with your receipt; we will credit you promptly.</p>');
    return;
  }

  // Idempotency gate, then credit. 1 cent = 10,000 micro-USD.
  const micro = cents * 10_000;
  try {
    const [nx] = await pipe([['SET', `pn:wk:stripe:${sessionId}`, key, 'NX']]);
    if (nx === null) {
      const [balRaw] = await pipe([['GET', `pn:wk:bal:${key}`]]);
      const bal = Number(balRaw ?? 0) / 1_000_000;
      page(res, 200, 'Already credited', `<h1 class="ok">✓ Already credited</h1><p>This payment was applied earlier (refreshing this page never double-credits).</p><p>Key <code>${key.slice(0, 26)}…</code><br>Current balance: <b>$${bal.toFixed(2)}</b></p>`);
      return;
    }
    const [newBalRaw] = await pipe([['INCRBY', `pn:wk:bal:${key}`, micro]]);
    const newBal = Number(newBalRaw ?? 0) / 1_000_000;
    console.log(`wholesale/checkout-complete: credited $${(cents / 100).toFixed(2)} to ${key.slice(0, 20)}… via ${sessionId}`);
    page(res, 200, 'Credit applied', `<h1 class="ok">✓ $${(cents / 100).toFixed(2)} credited</h1>
<p>Key <code>${key.slice(0, 26)}…</code><br>New balance: <b>$${newBal.toFixed(2)}</b></p>
<p>Start calling immediately — every request just needs the header:</p>
<p><code>x-internal-key: ${key.slice(0, 26)}…</code> <em>(your full key)</em></p>
<p>Balance &amp; usage anytime: <a href="${HUB}/api/wholesale/stats?key=${key}">stats</a> · Catalog &amp; prices: <a href="${HUB}/">pulse.theaslangroupllc.com</a></p>`);
  } catch (err) {
    // Payment succeeded at Stripe; our credit write failed. Loud, reconcilable, never re-charged.
    console.error(`wholesale/checkout-complete: PAID but credit write failed for ${key.slice(0, 20)}… session=${sessionId}`, err);
    page(res, 500, 'Reconciliation needed', '<h1 class="warn">Payment received — credit pending</h1><p>Your card payment succeeded but the balance write hit a temporary error. It has been logged for reconciliation; refresh this page in a minute (safe — crediting is idempotent) or email info@theaslangroupllc.com.</p>');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handlerImpl(req, res);
  } catch (err) {
    console.error('unhandled_handler_error', { url: req.url, err });
    if (!res.headersSent) res.status(500).json({ error: 'upstream_failed' });
  }
}
