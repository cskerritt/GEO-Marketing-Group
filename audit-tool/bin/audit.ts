#!/usr/bin/env node
import { runAudit } from '../src/run.js';
import type { AuditFlags, AuditInput } from '../src/types.js';

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

const a = parseArgs(process.argv.slice(2));

if (!a.site || !a.firm) {
  console.error(
    `\nGEO Audit Tool\n\n` +
      `Usage:\n  npm run audit -- --site <url> --firm "<name>" [options]\n\n` +
      `Required:\n  --site <url>            Firm website root (https://…)\n  --firm "<name>"         Firm name (used in the report + visibility queries)\n\n` +
      `Options:\n  --location "City, ST"   Location for visibility queries\n  --areas "a,b,c"         Practice areas (comma-separated)\n  --competitors "X,Y"     Known competitors to look for\n  --max-pages N           Cap pages audited (default 30)\n  --dry-run               Crawl + extract only; no OpenAI calls\n  --no-visibility         Skip the AI web-search spot-check\n  --no-pdf                Write HTML/JSON only (skip PDF)\n`
  );
  process.exit(1);
}

const input: AuditInput = {
  website: String(a.site),
  firm: String(a.firm),
  location: a.location ? String(a.location) : undefined,
  practiceAreas: a.areas
    ? String(a.areas).split(',').map((s) => s.trim()).filter(Boolean)
    : undefined,
  competitors: a.competitors
    ? String(a.competitors).split(',').map((s) => s.trim()).filter(Boolean)
    : undefined,
  maxPages: a['max-pages'] ? parseInt(String(a['max-pages']), 10) : 30,
};

const flags: AuditFlags = {
  dryRun: Boolean(a['dry-run']),
  visibility: !a['no-visibility'],
  pdf: !a['no-pdf'],
};

runAudit(input, flags)
  .then(({ result, files }) => {
    console.log(`\n✓ Audit complete — overall ${result.scores.overall}/100`);
    console.log(
      `  Citability ${result.scores.citability} · Technical ${result.scores.technical} · Visibility ${result.scores.visibility}`
    );
    for (const f of files) console.log(`  → ${f}`);
  })
  .catch((err) => {
    console.error('\n✗ Audit failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
