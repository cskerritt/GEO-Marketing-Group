import * as cheerio from 'cheerio';
import { fetchText, urlExists } from './crawl.js';
import type { PageSignals, SiteSignals } from './types.js';

const QUESTION_RE = /^(who|what|how|why|when|where|which|can|does|do|is|are|should)\b/i;

export interface ExtractedPage {
  url: string;
  title?: string;
  signals: PageSignals;
  mainText: string;
}

export function extractPage(url: string, html: string): ExtractedPage {
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim() || undefined;
  const metaDesc = $('meta[name="description"]').attr('content')?.trim();

  // JSON-LD @types
  const schemaTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).contents().text());
      const arr = Array.isArray(json) ? json : [json];
      for (const node of arr) collectTypes(node, schemaTypes);
    } catch {
      /* ignore malformed JSON-LD */
    }
  });

  const headings = $('h1, h2, h3')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const questionHeadings = headings.filter(
    (h) => h.endsWith('?') || QUESTION_RE.test(h)
  ).length;

  // main text (strip script/style/nav/footer), capped
  $('script, style, noscript, nav, footer, header, svg').remove();
  const bodyText = $('main').text() || $('body').text();
  const mainText = bodyText.replace(/\s+/g, ' ').trim();
  const wordCount = mainText ? mainText.split(/\s+/).length : 0;

  // "answer-first": a substantial paragraph appears early in the document
  const firstP = $('p').first().text().replace(/\s+/g, ' ').trim();
  const answerFirst = firstP.length >= 60;

  return {
    url,
    title,
    signals: {
      schemaTypes: [...new Set(schemaTypes)],
      hasFaqSchema: schemaTypes.includes('FAQPage'),
      questionHeadings,
      wordCount,
      hasMetaDescription: Boolean(metaDesc),
      answerFirst,
    },
    mainText: mainText.slice(0, 4000),
  };
}

function collectTypes(node: unknown, out: string[]): void {
  if (!node || typeof node !== 'object') return;
  const t = (node as Record<string, unknown>)['@type'];
  if (typeof t === 'string') out.push(t);
  else if (Array.isArray(t)) for (const x of t) if (typeof x === 'string') out.push(x);
  const graph = (node as Record<string, unknown>)['@graph'];
  if (Array.isArray(graph)) for (const g of graph) collectTypes(g, out);
}

export async function getSiteSignals(origin: string, sitemapFound: boolean): Promise<SiteSignals> {
  const robots = await fetchText(`${origin}/robots.txt`);
  const aiBotsAllowed = robotsAllowsAi(robots);
  const hasLlmsTxt = await urlExists(`${origin}/llms.txt`);
  return {
    origin,
    https: origin.startsWith('https://'),
    hasLlmsTxt,
    aiBotsAllowed,
    sitemapFound,
  };
}

/** Heuristic: AI crawlers aren't broadly blocked. */
function robotsAllowsAi(robots: string | null): boolean {
  if (!robots) return true; // no robots.txt → nothing blocked
  const lower = robots.toLowerCase();
  // crude check: a global "Disallow: /" under User-agent: * blocks everyone
  const blocksAll = /user-agent:\s*\*\s*[\s\S]*?disallow:\s*\/\s*(\n|$)/i.test(robots);
  const blocksGpt = /user-agent:\s*gptbot[\s\S]*?disallow:\s*\//i.test(lower);
  return !(blocksAll || blocksGpt);
}
