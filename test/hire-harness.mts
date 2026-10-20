// Golden harness for lib/hire.ts — run: npx tsx test/hire-harness.mts
// Exercises: quote validation, declined categories, personal-contact filter,
// text scrubbing, JSON extraction. Exits 1 on any failure (loud).
// Make all task types "available" so the availability gate doesn't mask the validation tests
// (no API call is made here — these exercise validateAndQuote / filters only).
process.env.ANTHROPIC_API_KEY ||= 'test-dummy-key-never-used';
process.env.HIRE_PROSPECT_LEDGER_ENABLED = '1';
process.env.HIRE_MARKET_ENTRY_ENABLED = '1';

import {
  validateAndQuote, declineCheck, sanitizeContact, scrubText, extractJson, TASK_TYPES,
  fenceSafe, inlineSafe, isPersonalEmailUrl, safeJsonBlock,
} from '../lib/hire.js';

let failures = 0;
function check(name: string, cond: boolean, detail?: unknown): void {
  if (cond) console.log(`  ok  ${name}`);
  else {
    failures++;
    console.error(`FAIL  ${name}`, detail ?? '');
  }
}

const LONG_THESIS =
  'We sell an x402-native pay-per-call token safety API that lets trading agents scan any token pre-trade for honeypot and rug risk across ten chains, priced at $0.015 per scan with no signup.';

console.log('— quote validation —');
{
  const q = validateAndQuote('prospect-ledger', { thesis: LONG_THESIS, target_profile: 'crypto trading bot operators and agent platform teams', count: '12' });
  check('valid prospect-ledger quotes ok', q.ok && q.price_usd === 25 && (q.normalized_input as { count: number }).count === 12, q);
}
{
  const q = validateAndQuote('prospect-ledger', { thesis: 'too short', target_profile: 'agent platform teams' });
  check('short thesis declined', !q.ok && /80-1000/.test(q.declined_reason ?? ''), q);
}
{
  const q = validateAndQuote('prospect-ledger', { thesis: LONG_THESIS, target_profile: 'x', count: '50' });
  check('short target_profile declined', !q.ok, q);
}
{
  const q = validateAndQuote('vendor-dd-memo', { company_or_token: 'Acme Corp', country: 'DE' });
  check('vendor-dd-memo quotes ok', q.ok && q.amount === '5000000', q);
}
{
  const q = validateAndQuote('market-entry-brief', { sector: 'industrial sensors', target_country: 'Brazil' });
  check('market-entry-brief quotes ok', q.ok && q.price_usd === 10, q);
}
{
  const q = validateAndQuote('nope', {});
  check('unknown task_type declined', !q.ok, q);
}
{
  const count = (validateAndQuote('prospect-ledger', { thesis: LONG_THESIS, target_profile: 'agent platform teams and bot operators', count: '99' }).normalized_input as { count: number })?.count;
  check('count clamped to 15', count === 15, count);
}

console.log('— declined categories (never charged) —');
check('consumer targeting declined', declineCheck('sell to homeowners in Texas') !== null);
check('protected-class declined', declineCheck('companies owned by a specific religion') !== null);
check('doxxing declined', declineCheck('find his home address and where he lives') !== null);
check('deception declined', declineCheck('pretend to be a customer to get their pricing') !== null);
check('plain B2B passes', declineCheck(LONG_THESIS, 'mid-size logistics companies in DACH, VP Operations') === null);
check('patients targeting declined', declineCheck('clinics and their patients as leads') !== null);

console.log('— personal-contact filter —');
check('gmail dropped', sanitizeContact({ type: 'email', value: 'john.doe@gmail.com' }) === null);
check('proton dropped', sanitizeContact({ type: 'email', value: 'x@protonmail.com' }) === null);
check('phone dropped', sanitizeContact({ type: 'phone', value: '+1 (415) 555-0134' }) === null);
check('company email kept', sanitizeContact({ type: 'business_email', value: 'sales@acme-logistics.de' })?.value === 'sales@acme-logistics.de');
check('contact page kept', sanitizeContact({ type: 'company_contact_page', value: 'https://acme.example/contact' }) !== null);
check('linkedin company kept', sanitizeContact({ type: 'linkedin_company', value: 'https://linkedin.com/company/acme' }) !== null);
check('empty dropped', sanitizeContact({ type: 'email', value: '  ' }) === null);

console.log('— text scrubbing (defense in depth) —');
{
  const s = scrubText('Reach Jane at jane.doe@gmail.com or +1 415 555 0134 about the 2024 expansion.');
  check('email scrubbed from text', !s.includes('gmail.com'), s);
  check('phone scrubbed from text', !s.includes('555 0134'), s);
  check('year survives scrub', s.includes('2024'), s);
}

console.log('— JSON extraction —');
check('clean json', (extractJson('{"prospects":[]}') as { prospects: unknown[] })?.prospects?.length === 0);
check('json with prose', (extractJson('Here you go:\n{"a":{"b":"}"}} trailing') as { a: { b: string } })?.a?.b === '}');
check('no json → null', extractJson('nothing here') === null);
check('broken json → null', extractJson('{"a": [1,2') === null);

console.log('— registry invariants —');
for (const [id, t] of Object.entries(TASK_TYPES)) {
  check(`${id} amount matches price`, String(t.price_usd * 1_000_000) === t.amount, { id, amount: t.amount });
  check(`${id} ≤5 tags (CDP cap)`, t.tags.length <= 5, t.tags);
  check(`${id} eta within 300s maxDuration`, t.eta_seconds[1] < 300, t.eta_seconds);
}

console.log('— review regressions: email filter (findings 3) —');
for (const e of ['a@proton.me', 'a@pm.me', 'a@yahoo.co.in', 'a@fastmail.com', 'a@rediffmail.com', 'a@comcast.net', 'a@mail.gmail.com', 'x@hey.com']) {
  check(`${e} dropped`, sanitizeContact({ type: 'business_email', value: e }) === null, e);
}
check('real company email survives', sanitizeContact({ type: 'business_email', value: 'sales@acme-logistics.de' })?.value === 'sales@acme-logistics.de');
check('company subdomain email survives', sanitizeContact({ type: 'business_email', value: 'ir@investor.acme.com' }) !== null);

console.log('— review regressions: phone-URL bypass (finding 4) —');
check('wa.me dropped', sanitizeContact({ type: 'link', value: 'https://wa.me/14155550134' }) === null);
check('t.me/+ dropped', sanitizeContact({ type: 'link', value: 'https://t.me/+14155550134' }) === null);
check('tel: dropped', sanitizeContact({ type: 'phone', value: 'tel:+14155550134' }) === null);
check('normal company link survives', sanitizeContact({ type: 'company_contact_page', value: 'https://acme.example/contact' }) !== null);

console.log('— review regressions: scrubText year-vs-phone (finding 6) —');
check('year sequence survives scrub', scrubText('revenue 2020 2021 2022 2023 grew 40%') === 'revenue 2020 2021 2022 2023 grew 40%');
check('real phone still scrubbed', !scrubText('call +1 415 555 0134 today').includes('555'));
check('single year survives', scrubText('founded 2019, expanded 2024') === 'founded 2019, expanded 2024');

console.log('— review regressions: decline bypasses (finding 7) —');
check('doxxing gerund declined', declineCheck('doxxing the founder') !== null);
check('surveillance declined', declineCheck('surveillance of their staff') !== null);
check('b2c declined', declineCheck('b2c leads for our app') !== null);
check('student housing NOT declined (false-positive fix)', declineCheck('companies building student housing in Berlin') === null);
check('patient-flow software NOT declined', declineCheck('clinics managing patient flow software') === null);

console.log('— review regressions: markdown injection (findings 10,11) —');
check('fenceSafe neutralizes backticks', !fenceSafe('```json evil```').includes('`'));
check('inlineSafe strips leading heading', !inlineSafe('## Fake heading injection').startsWith('#'));
check('inlineSafe strips newlines', !inlineSafe('line1\nline2').includes('\n'));
check('safeJsonBlock closes its fence', (safeJsonBlock({ x: '```breakout```' }).match(/```/g) || []).length === 2);
check('personal-email URL dropped', isPersonalEmailUrl('https://site.com/?email=jane@gmail.com') === true);
check('clean URL kept', isPersonalEmailUrl('https://acme.example/press/2024') === false);

if (failures > 0) {
  console.error(`\n${failures} FAILURE(S)`);
  process.exit(1);
}
console.log('\nall green');
