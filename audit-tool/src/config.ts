import fs from 'node:fs';
import path from 'node:path';

/** Minimal .env loader — avoids a dotenv dependency. Reads ./.env if present. */
function loadEnv(): void {
  const p = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

export const config = {
  openaiKey: process.env.OPENAI_API_KEY ?? '',
  pageSpeedKey: process.env.PAGESPEED_API_KEY ?? '',
  model: process.env.OPENAI_MODEL ?? 'gpt-4.1',
  userAgent:
    'GEOMarketingGroup-AuditBot/0.1 (+https://geomarketinggroup.org; audit tool)',
  /** Rough USD estimates, used only for the pre-run cost preview. */
  estPerPageUsd: 0.01,
  estPerVisibilityUsd: 0.03,
  /** Score blend — documented in the report so results are explainable. */
  weights: { citability: 0.45, technical: 0.25, visibility: 0.3 },
  /** Politeness: how many pages to audit concurrently. */
  concurrency: 4,
};
