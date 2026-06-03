import { config } from './config.js';
import type {
  AuditResult,
  PageAudit,
  RoadmapPhase,
  SiteSignals,
  VisibilityResult,
} from './types.js';

export function citabilityScore(pages: PageAudit[]): number {
  const ok = pages.filter((p) => !p.error);
  if (!ok.length) return 0;
  return Math.round(ok.reduce((s, p) => s + p.scores.overall, 0) / ok.length);
}

export function technicalScore(site: SiteSignals): number {
  // Base checklist (max 55) — present even without PageSpeed.
  let base = 0;
  if (site.https) base += 10;
  if (site.sitemapFound) base += 10;
  if (site.hasLlmsTxt) base += 15;
  if (site.aiBotsAllowed) base += 20;

  if (site.pageSpeed) {
    const ps = site.pageSpeed.seo * 0.25 + site.pageSpeed.performance * 0.2; // max 45
    return Math.round(base + ps);
  }
  // No PageSpeed → scale the 55-point checklist to 100.
  return Math.round((base / 55) * 100);
}

export function visibilityScore(results: VisibilityResult[]): number {
  const ran = results.filter((r) => !r.error);
  if (!ran.length) return 0;
  const per = ran.map((r) => (r.firmCited ? 1 : r.firmMentioned ? 0.6 : 0));
  return Math.round((per.reduce((a, b) => a + b, 0) / ran.length) * 100);
}

export function overallScore(
  citability: number,
  technical: number,
  visibility: number,
  visibilityRan: boolean
): number {
  const w = config.weights;
  if (!visibilityRan) {
    const denom = w.citability + w.technical;
    return Math.round((citability * w.citability + technical * w.technical) / denom);
  }
  return Math.round(
    citability * w.citability + technical * w.technical + visibility * w.visibility
  );
}

export function buildRoadmap(
  pages: PageAudit[],
  site: SiteSignals,
  visibility: VisibilityResult[]
): RoadmapPhase[] {
  const quick: string[] = [];
  const mid: string[] = [];
  const long: string[] = [];

  if (!site.aiBotsAllowed) quick.push('Unblock AI crawlers in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).');
  if (!site.hasLlmsTxt) quick.push('Publish an llms.txt summarizing the firm, services, and key pages for AI engines.');
  if (!site.sitemapFound) quick.push('Generate and submit an XML sitemap so engines can discover every page.');

  const missingMeta = pages.filter((p) => !p.error && !p.signals.hasMetaDescription);
  if (missingMeta.length) quick.push(`Add meta descriptions to ${missingMeta.length} page(s) missing them.`);

  const noFaq = pages.filter((p) => !p.error && !p.signals.hasFaqSchema);
  if (noFaq.length) mid.push('Add FAQ sections with FAQPage schema to key service/industry pages (AI engines lift Q&A pairs directly).');

  const lowest = [...pages]
    .filter((p) => !p.error)
    .sort((a, b) => a.scores.overall - b.scores.overall)
    .slice(0, 3);
  if (lowest.length) mid.push(`Rework the lowest-scoring pages first: ${lowest.map((p) => shortPath(p.url)).join(', ')}.`);
  mid.push('Convert key pages to an answer-first structure with question-shaped headings.');

  const lostQueries = visibility.filter((v) => !v.error && !v.firmMentioned && v.competitorsMentioned.length);
  if (lostQueries.length) {
    long.push(`Publish citable content targeting queries where competitors win: ${lostQueries.map((v) => `"${v.query}"`).slice(0, 3).join(', ')}.`);
  }
  long.push('Build topical authority hubs and earn citations; re-run this audit monthly to track citation share.');

  return [
    { horizon: '30', items: quick.length ? quick : ['Quick technical wins already in place — maintain them.'] },
    { horizon: '60', items: mid },
    { horizon: '90', items: long },
  ];
}

function shortPath(url: string): string {
  try {
    return new URL(url).pathname || '/';
  } catch {
    return url;
  }
}

export function assembleScores(
  pages: PageAudit[],
  site: SiteSignals,
  visibility: VisibilityResult[]
): AuditResult['scores'] {
  const citability = citabilityScore(pages);
  const technical = technicalScore(site);
  const visRan = visibility.some((v) => !v.error);
  const visibilityVal = visibilityScore(visibility);
  return {
    citability,
    technical,
    visibility: visibilityVal,
    overall: overallScore(citability, technical, visibilityVal, visRan),
  };
}
