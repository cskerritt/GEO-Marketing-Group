import fs from 'node:fs';
import path from 'node:path';
import OpenAI from 'openai';
import { config } from './config.js';
import { discoverPages, fetchText } from './crawl.js';
import { extractPage, getSiteSignals, type ExtractedPage } from './extract.js';
import { auditPage } from './auditPage.js';
import { generateQueries, checkVisibility } from './visibility.js';
import { fetchPageSpeed } from './psi.js';
import { assembleScores, buildRoadmap } from './score.js';
import { renderHtml } from './report/template.js';
import { htmlToPdf } from './report/pdf.js';
import type { AuditFlags, AuditInput, AuditResult, PageAudit, VisibilityResult } from './types.js';

async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export async function runAudit(
  input: AuditInput,
  flags: AuditFlags
): Promise<{ result: AuditResult; files: string[] }> {
  console.log(`\n▶ Discovering pages for ${input.website} …`);
  const { origin, pages: urls, sitemapFound } = await discoverPages(input.website, input.maxPages);
  console.log(`  ${urls.length} page(s) found ${sitemapFound ? '(via sitemap)' : '(homepage crawl fallback)'}.`);

  console.log('▶ Reading site signals …');
  const site = await getSiteSignals(origin, sitemapFound);
  site.pageSpeed = await fetchPageSpeed(input.website);

  console.log('▶ Fetching & extracting pages …');
  const extracted = (
    await mapLimit(urls, config.concurrency, async (url) => {
      const html = await fetchText(url);
      return html ? extractPage(url, html) : null;
    })
  ).filter((p): p is ExtractedPage => p !== null);

  const queries = flags.visibility && !flags.dryRun ? generateQueries(input) : [];

  // Cost preview before any paid calls.
  const estCost = extracted.length * config.estPerPageUsd + queries.length * config.estPerVisibilityUsd;
  if (flags.dryRun) {
    console.log('▶ DRY RUN — no OpenAI calls will be made.');
  } else {
    console.log(`▶ Estimated OpenAI cost: ~$${estCost.toFixed(2)} (${extracted.length} pages + ${queries.length} visibility queries).`);
  }

  let pageAudits: PageAudit[];
  let visibility: VisibilityResult[] = [];

  if (flags.dryRun) {
    pageAudits = extracted.map((p) => ({
      url: p.url,
      title: p.title,
      signals: p.signals,
      mainTextPreview: p.mainText.slice(0, 300),
      scores: { structure: 0, schema: 0, clarity: 0, overall: 0 },
      topFixes: ['(dry run — page not sent to OpenAI)'],
    }));
  } else {
    if (!config.openaiKey) {
      throw new Error('OPENAI_API_KEY is not set. Add it to audit-tool/.env (see .env.example).');
    }
    const client = new OpenAI({ apiKey: config.openaiKey });
    console.log(`▶ Auditing ${extracted.length} pages with ${config.model} …`);
    pageAudits = await mapLimit(extracted, config.concurrency, (p) => auditPage(client, p));
    if (queries.length) {
      console.log(`▶ Running ${queries.length} AI-visibility queries …`);
      visibility = await mapLimit(queries, 2, (q) => checkVisibility(client, input, q));
    }
  }

  const scores = assembleScores(pageAudits, site, visibility);
  const roadmap = buildRoadmap(pageAudits, site, visibility);
  const result: AuditResult = {
    input,
    generatedAt: new Date().toISOString(),
    site,
    pages: pageAudits,
    visibility,
    scores,
    roadmap,
  };

  // Write artifacts
  const outDir = path.resolve(process.cwd(), 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const base = `${slug(input.firm)}-${result.generatedAt.slice(0, 10)}`;
  const files: string[] = [];

  const jsonPath = path.join(outDir, `${base}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  files.push(jsonPath);

  const html = renderHtml(result);
  const htmlPath = path.join(outDir, `${base}.html`);
  fs.writeFileSync(htmlPath, html);
  files.push(htmlPath);

  if (flags.pdf) {
    try {
      const pdfPath = path.join(outDir, `${base}.pdf`);
      await htmlToPdf(html, pdfPath);
      files.push(pdfPath);
    } catch (e) {
      console.warn(`  PDF rendering failed (${e instanceof Error ? e.message : e}). HTML report still written.`);
    }
  }

  return { result, files };
}
