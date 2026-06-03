import * as cheerio from 'cheerio';
import { config } from './config.js';

const headers = { 'User-Agent': config.userAgent };

export async function fetchText(url: string, timeoutMs = 15000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { headers, signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers, method: 'GET', redirect: 'follow' });
    return res.ok;
  } catch {
    return false;
  }
}

/** Collect <loc> entries from a sitemap or sitemap index (recursively, shallowly). */
async function parseSitemap(url: string, depth = 0): Promise<string[]> {
  if (depth > 2) return [];
  const xml = await fetchText(url);
  if (!xml) return [];
  const $ = cheerio.load(xml, { xmlMode: true });
  const locs = $('loc').map((_, el) => $(el).text().trim()).get();

  // sitemap index → recurse into child sitemaps
  if ($('sitemapindex').length > 0) {
    const child = await Promise.all(locs.map((l) => parseSitemap(l, depth + 1)));
    return child.flat();
  }
  return locs;
}

/** Same-origin link crawl from the homepage (fallback when no sitemap). */
async function crawlHomepageLinks(origin: string): Promise<string[]> {
  const html = await fetchText(origin);
  if (!html) return [origin];
  const $ = cheerio.load(html);
  const out = new Set<string>([origin]);
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    try {
      const u = new URL(href, origin);
      if (u.origin === origin && !u.hash) out.add(u.href.replace(/#.*$/, ''));
    } catch {
      /* ignore */
    }
  });
  return [...out];
}

export interface Discovery {
  origin: string;
  pages: string[];
  sitemapFound: boolean;
}

export async function discoverPages(website: string, maxPages: number): Promise<Discovery> {
  const origin = new URL(website).origin;
  let pages = await parseSitemap(`${origin}/sitemap-index.xml`);
  if (pages.length === 0) pages = await parseSitemap(`${origin}/sitemap.xml`);
  const sitemapFound = pages.length > 0;
  if (!sitemapFound) pages = await crawlHomepageLinks(origin);

  // de-dupe, drop obvious non-HTML assets, cap
  const seen = new Set<string>();
  const filtered = pages.filter((u) => {
    if (seen.has(u)) return false;
    seen.add(u);
    return !/\.(xml|json|png|jpe?g|svg|gif|webp|pdf|css|js|ico|txt)$/i.test(u);
  });

  return { origin, pages: filtered.slice(0, maxPages), sitemapFound };
}
