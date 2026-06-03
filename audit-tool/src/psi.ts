import { config } from './config.js';
import type { SiteSignals } from './types.js';

/** Optional Google PageSpeed Insights (free, keyless at low volume). */
export async function fetchPageSpeed(url: string): Promise<SiteSignals['pageSpeed'] | undefined> {
  try {
    const params = new URLSearchParams({ url, strategy: 'mobile' });
    params.append('category', 'performance');
    params.append('category', 'seo');
    if (config.pageSpeedKey) params.append('key', config.pageSpeedKey);
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`
    );
    if (!res.ok) return undefined;
    const j: any = await res.json();
    const cats = j?.lighthouseResult?.categories ?? {};
    const audits = j?.lighthouseResult?.audits ?? {};
    const lcpMs = audits['largest-contentful-paint']?.numericValue ?? 0;
    return {
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      lcp: +(lcpMs / 1000).toFixed(2),
      cls: +(audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3),
    };
  } catch {
    return undefined;
  }
}
