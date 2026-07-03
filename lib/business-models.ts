// lib/business-models.ts — the Startup Engine's brain. Loads the curated business-models.json,
// scores models against a caller's situation (deterministic — no LLM cost), and joins each model to
// LIVE vertical data from verticals.ts so recommendations can never reference a stale endpoint.
//
// Guarantee: validate() hard-fails on any model referencing a vertical that no longer exists, and
// warns on any endpoint missing from verticals.ts. Wire validate() into CI (tools/validate-models.mjs).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { VERTICALS } from './verticals.js';

export interface BusinessModel {
  id: string;
  title: string;
  tagline: string;
  audience: string[];
  engine: { vertical: string; endpoints: string[] };
  suggested_retail: number;
  playbook?: string;
  difficulty?: string;
  match_signals: { interests?: string[]; skills?: string[]; budget_min?: number };
  economics_template: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadModels(): BusinessModel[] {
  const path = process.env.BUSINESS_MODELS_PATH || join(__dirname, '..', 'business-models.json');
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as { models: BusinessModel[] };
  return parsed.models;
}

/** Validate every model against the live vertical catalog.
 *  errors  = a referenced vertical does not exist (BLOCKING — the recommendation would 404).
 *  warnings = a referenced endpoint isn't in the generated verticals.ts (may lag live openapi). */
export function validate(models: BusinessModel[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  for (const m of models) {
    if (ids.has(m.id)) errors.push(`duplicate model id: ${m.id}`);
    ids.add(m.id);
    const v = (VERTICALS as Record<string, { endpoints: { path: string }[] }>)[m.engine.vertical];
    if (!v) { errors.push(`${m.id}: vertical "${m.engine.vertical}" not found in verticals.ts`); continue; }
    const known = new Set(v.endpoints.map((e) => e.path));
    for (const ep of m.engine.endpoints) {
      if (!known.has(ep)) warnings.push(`${m.id}: endpoint "${ep}" not in verticals.ts for ${m.engine.vertical} (live but ungenerated?)`);
    }
    if (typeof m.suggested_retail !== 'number' || m.suggested_retail <= 0) errors.push(`${m.id}: suggested_retail must be a positive number`);
  }
  return { errors, warnings };
}

function norm(s: string): string { return s.toLowerCase().trim(); }

/** Deterministic relevance score of a model for a caller's situation. Higher = better match. */
export function scoreModel(m: BusinessModel, q: RecommendQuery): number {
  let score = 0;
  const interests = (q.interests ?? []).map(norm);
  const skills = (q.skills ?? []).map(norm);
  const sigInterests = (m.match_signals.interests ?? []).map(norm);
  const sigSkills = (m.match_signals.skills ?? []).map(norm);
  for (const i of interests) if (sigInterests.some((s) => s.includes(i) || i.includes(s))) score += 3;
  for (const s of skills) if (sigSkills.some((x) => x.includes(s) || s.includes(x))) score += 2;
  // Audience text can also match a free-text interest ("families", "traders", …).
  for (const i of interests) if (m.audience.some((a) => norm(a).includes(i))) score += 1;
  if (q.budget !== undefined && q.budget >= (m.match_signals.budget_min ?? 0)) score += 1;
  // Low-difficulty models are a safer default when we have little to go on.
  if (m.difficulty === 'low') score += 0.5;
  return score;
}

export interface RecommendQuery {
  goal?: string;
  budget?: number;
  interests?: string[];
  skills?: string[];
  region?: string;
  time?: number;
  model?: string; // pin a specific model id
}

/** Live vertical facts joined onto a model for output (baseUrl + which of its endpoints are live). */
export function enrich(m: BusinessModel) {
  const v = (VERTICALS as Record<string, { name: string; baseUrl: string; endpoints: { path: string; price: string }[] }>)[m.engine.vertical];
  const eps = v ? v.endpoints.filter((e) => m.engine.endpoints.includes(e.path)) : [];
  return {
    id: m.id,
    title: m.title,
    tagline: m.tagline,
    audience: m.audience,
    difficulty: m.difficulty,
    engine: {
      vertical: m.engine.vertical,
      name: v?.name ?? m.engine.vertical,
      base_url: v?.baseUrl ?? null,
      endpoints: m.engine.endpoints,
      live_prices: eps.map((e) => ({ path: e.path, retail_on_pulse: e.price })),
    },
    suggested_retail: m.suggested_retail,
    playbook: m.playbook ?? null,
  };
}

/** Pick the single best model for a query (or the pinned one). Falls back to the easiest model. */
export function recommend(models: BusinessModel[], q: RecommendQuery): { model: BusinessModel; score: number } {
  if (q.model) {
    const pinned = models.find((m) => m.id === q.model);
    if (pinned) return { model: pinned, score: scoreModel(pinned, q) };
  }
  const ranked = models
    .map((m) => ({ model: m, score: scoreModel(m, q) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0];
}

/** Render an illustrative-economics line from a model's template. Never a guarantee. */
export function economics(m: BusinessModel, units = 20): string {
  return m.economics_template
    .replace('{units}', String(units))
    .replace('{retail}', m.suggested_retail.toFixed(2));
}
