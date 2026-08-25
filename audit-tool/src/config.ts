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

const OPENAI_KEY_PLACEHOLDERS = new Set([
  'openai_api_key',
  'replace-me',
  'replace_me',
  'sk-...',
  'sk-your-key-here',
  'your-openai-api-key',
  'your_openai_api_key',
]);

export function isUsableOpenAiKey(value: string): boolean {
  const key = value.trim();
  if (!key) return false;

  const normalized = key.toLowerCase();
  if (OPENAI_KEY_PLACEHOLDERS.has(normalized)) return false;
  if (/^<[^>]+>$/.test(key)) return false;
  if (/^(?:your|replace|insert)(?:[-_\s]|$)/i.test(key)) return false;
  if (/^sk-(?:\.{3}|x{3,}|(?:your|replace|insert|test)(?:[-_\s]|$))/i.test(key)) return false;
  return true;
}

export function assertOpenAiKeyConfigured(dryRun: boolean, key: string): void {
  if (!dryRun && !isUsableOpenAiKey(key)) {
    throw new Error(
      'OPENAI_API_KEY is missing or still a placeholder. Set a real key in audit-tool/.env, or use --dry-run for a keyless audit.'
    );
  }
}

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
