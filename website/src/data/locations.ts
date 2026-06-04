/**
 * New England locations dataset for the programmatic local-SEO program.
 * Tier-1 cities live in per-state files under ./cities/. Each entry carries
 * genuinely city-specific content (not template-swapped) so pages clear the
 * thin-content bar.
 *
 * Populations are approximate (2020 Census era) — verify before relying on
 * them publicly. Counties are accurate.
 */
import { cities as riCities } from './cities/rhode-island';
import { cities as maCities } from './cities/massachusetts';
import { cities as ctCities } from './cities/connecticut';
import { cities as nhCities } from './cities/new-hampshire';
import { cities as meCities } from './cities/maine';
import { cities as vtCities } from './cities/vermont';

export interface StateInfo {
  name: string;
  slug: string;
  abbr: string;
  blurb: string;
}

export interface CityFaq {
  q: string;
  a: string;
}

export interface City {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  abbr: string;
  county: string;
  population: number;
  tier: 1 | 2 | 3;
  metaDescription: string;
  intro: string; // hero lead paragraph (local)
  body: string[]; // 2–3 unique paragraphs: local market + AI-search angle
  highlights: string[]; // 3–4 local economy / professional-services notes
  faqs: CityFaq[]; // 3 local FAQs
}

export const STATES: StateInfo[] = [
  { name: 'Rhode Island', slug: 'rhode-island', abbr: 'RI', blurb: 'Our home state. We meet Rhode Island firms in person and know the RI legal, CPA, advisory, and A&E markets cold.' },
  { name: 'Massachusetts', slug: 'massachusetts', abbr: 'MA', blurb: 'From Boston to the South Coast and MetroWest — the Northeast’s densest professional-services market.' },
  { name: 'Connecticut', slug: 'connecticut', abbr: 'CT', blurb: 'Fairfield County wealth management, Hartford’s insurance and legal corridor, and New Haven’s firms.' },
  { name: 'New Hampshire', slug: 'new-hampshire', abbr: 'NH', blurb: 'Manchester, Nashua, and the Seacoast — a fast-growing, tax-friendly professional-services base.' },
  { name: 'Maine', slug: 'maine', abbr: 'ME', blurb: 'Portland’s growing firm ecosystem and statewide professional services across Maine.' },
  { name: 'Vermont', slug: 'vermont', abbr: 'VT', blurb: 'Burlington and the capital region — a tight, reputation-driven professional community.' },
];

export const CITIES: City[] = [
  ...riCities,
  ...maCities,
  ...ctCities,
  ...nhCities,
  ...meCities,
  ...vtCities,
];

// ── Helpers ─────────────────────────────────────────────
export function citiesInState(stateSlug: string): City[] {
  return CITIES.filter((c) => c.stateSlug === stateSlug).sort((a, b) => b.population - a.population);
}

export function getCity(stateSlug: string, citySlug: string): City | undefined {
  return CITIES.find((c) => c.stateSlug === stateSlug && c.slug === citySlug);
}

export function getState(stateSlug: string): StateInfo | undefined {
  return STATES.find((s) => s.slug === stateSlug);
}

export function cityPath(c: City): string {
  return `/locations/${c.stateSlug}/${c.slug}`;
}

export function statePath(s: StateInfo): string {
  return `/locations/${s.slug}`;
}
