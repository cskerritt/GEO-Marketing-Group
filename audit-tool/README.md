# GEO Audit Tool

OpenAI-powered GEO / AEO / SEO audit for professional-services firms. Crawls a
firm's indexed pages, grades each page's AI **citability**, runs a live
**visibility** spot-check via OpenAI web-search, and produces a branded
**HTML + PDF report** with a 30/60/90 roadmap.

> Phase 1 — internal CLI (this package). Phase 2 (later) exposes a trimmed
> self-serve "instant mini-audit" on geomarketinggroup.org.

## Setup

```bash
cd audit-tool
npm install
cp .env.example .env      # then add your OPENAI_API_KEY
```

`npm install` downloads Chromium for Puppeteer (PDF rendering). Use `--no-pdf`
to skip PDF if you don't need it.

## Run

```bash
npm run audit -- \
  --site "https://harborvale.com" \
  --firm "Harbor & Vale LLP" \
  --location "Providence, RI" \
  --areas "estate planning,probate,trusts" \
  --max-pages 25
```

Outputs to `output/<firm>-<date>.{html,pdf,json}`.

### Options

| Flag | Meaning |
|------|---------|
| `--site <url>` | **required** — firm website root |
| `--firm "<name>"` | **required** — used in the report + visibility queries |
| `--location "City, ST"` | location for visibility queries |
| `--areas "a,b,c"` | practice areas (seed the visibility queries) |
| `--competitors "X,Y"` | competitors to detect in AI answers |
| `--max-pages N` | cap pages audited (default 30) |
| `--dry-run` | crawl + extract only — **no OpenAI calls, no cost** |
| `--no-visibility` | skip the web-search spot-check (cheaper) |
| `--no-pdf` | write HTML + JSON only |

## What it scores

- **Citability** — mean of per-page scores (structure / schema / clarity) from OpenAI.
- **Technical** — HTTPS, sitemap, `llms.txt`, AI-crawler access, and (optionally) Lighthouse SEO + Core Web Vitals via Google PageSpeed.
- **Visibility** — share of buyer queries where the firm is mentioned/cited by OpenAI web-search (sample, not a guarantee).
- **Overall** — documented blend (see `src/config.ts`).

## Cost

Roughly one cheap OpenAI call per page plus ~4–6 web-search calls. The tool
prints an estimate before any paid calls. Use `--dry-run` to preview the crawl
for free.

## Notes

- The page audit grades **AI-readiness**; the visibility spot-check samples
  **live** AI answers. Both are shown in the report so a human can verify before
  sending to a client.
- Model is set in `src/config.ts` (`OPENAI_MODEL` env overrides).
