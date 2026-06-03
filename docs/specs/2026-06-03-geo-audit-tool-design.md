# GEO Audit Tool — Design Spec (OpenAI-only)

**Date:** 2026-06-03
**Status:** Approved direction — ready for implementation plan
**Repo:** new package `GEO/audit-tool/` (sibling of `GEO/website/`); Phase 2 adds a function under `website/functions/`

---

## 1. Summary

Build the software that lets GEO Marketing Group **perform and deliver the GEO Audit** the website sells, using a **single OpenAI API key**. The tool:

1. **Crawls the firm's indexed pages** (from its sitemap) and has OpenAI grade each page's **AI citability/readiness** (structure, schema, FAQ/question form, extractable answers, meta) with specific fixes.
2. **Spot-checks live visibility** by running a few buyer queries through **OpenAI's web-search tool** to see whether the firm — and which competitors — get named/cited.
3. **Scores** the firm and produces a **branded report** (HTML → PDF) with a prioritized 30/60/90 roadmap.

**Phase 1 (now):** internal CLI tool that produces the client deliverable.
**Phase 2 (after):** a fast self-serve "instant mini-audit" on the website that returns a teaser score and captures the lead.

## 2. Goals / Non-Goals

### Goals
- **One key, one vendor:** everything runs on `OPENAI_API_KEY`.
- **Per-page audit:** discover indexed pages via `sitemap.xml`, fetch each, and score citability with concrete, page-specific recommendations.
- **Visibility spot-check:** run a small set of buyer queries via OpenAI web-search; record firm mention/citation + competitors named, with source URLs.
- **Transparent scoring** (page citability + site technical + visibility → overall) and a 30/60/90 roadmap.
- **Branded report:** HTML (brand tokens) → PDF, plus raw JSON for our records.
- **Cost controls** and honest data (no fabricated results).

### Non-Goals
- Multi-engine citation testing (Perplexity/Anthropic/Gemini) — explicitly dropped for simplicity; can be added later behind the same adapter seam.
- Google AI Overviews automation (no API).
- Database/persistence (v1 writes local files only) and ongoing monitoring (later phase).

## 3. Architecture

```
GEO/
├── website/                       # existing site
└── audit-tool/                    # NEW Node/TypeScript package (OpenAI-only)
    ├── package.json
    ├── .env.example               # OPENAI_API_KEY  (PAGESPEED_API_KEY optional/free)
    ├── src/
    │   ├── config.ts              # env + cost caps + flags
    │   ├── crawl.ts               # sitemap.xml discovery (fallback: homepage link crawl) + fetch
    │   ├── extract.ts             # parse HTML → signals (JSON-LD, headings, FAQ, meta, llms.txt, robots) + main text
    │   ├── auditPage.ts           # OpenAI structured scoring per page (JSON output)
    │   ├── visibility.ts          # OpenAI web-search buyer-query spot-checks
    │   ├── score.ts               # aggregate → page/technical/visibility/overall
    │   ├── report/
    │   │   ├── template.ts        # branded HTML report (brand tokens)
    │   │   └── pdf.ts             # HTML → PDF via Puppeteer
    │   └── run.ts                 # orchestrates a full audit
    ├── bin/audit.ts               # CLI entrypoint
    └── output/                    # generated reports (gitignored)
```

**Phase 2 (later):** `website/functions/api/instant-audit.ts` (Cloudflare Pages Function) reuses the crawl + per-page audit on a **capped** page count, returns a teaser score as JSON, and emails the lead (existing `/api/contact` pattern). `/tools/geo-audit` Astro page hosts the form with an animated score reveal.

## 4. Core interfaces

```ts
interface AuditInput {
  website: string;            // https://… (root; sitemap derived from it)
  firm: string;               // for visibility queries + report
  location?: string;          // "Providence, RI"
  practiceAreas?: string[];   // seeds the visibility queries
  competitors?: string[];     // optional known competitors
  maxPages?: number;          // cap (default 30)
}

interface PageAudit {
  url: string;
  title?: string;
  signals: {
    schemaTypes: string[];
    hasFaqSchema: boolean;
    questionHeadings: number;
    wordCount: number;
    hasMetaDescription: boolean;
    answerFirst: boolean;     // does it lead with a direct answer?
  };
  scores: { structure: number; schema: number; clarity: number; overall: number }; // 0–100
  topFixes: string[];         // page-specific, prioritized
}

interface VisibilityResult {
  query: string;
  firmMentioned: boolean;
  firmCited: boolean;         // firm domain in the web-search citations
  citations: string[];
  competitorsMentioned: string[];
  answerExcerpt: string;
}

interface SiteSignals {
  https: boolean;
  hasLlmsTxt: boolean;
  aiBotsAllowed: boolean;     // robots.txt
  sitemapFound: boolean;
  pageSpeed?: { performance: number; seo: number; lcp: number; cls: number }; // optional, free PSI
}

interface AuditResult {
  input: AuditInput;
  generatedAt: string;
  site: SiteSignals;
  pages: PageAudit[];
  visibility: VisibilityResult[];
  scores: { citability: number; technical: number; visibility: number; overall: number };
  roadmap: { horizon: '30' | '60' | '90'; items: string[] }[];
}
```

## 5. How it works

**Discovery (`crawl.ts`):** fetch `<site>/sitemap.xml` (and sitemap-index) → page URLs. Fallback: parse homepage links if no sitemap. Respect `maxPages`.

**Extraction (`extract.ts`):** for each page, parse HTML (lightweight regex/DOM) → JSON-LD `@type`s, heading outline, question-form headings, FAQ schema, title/meta, word count, "answer-first" heuristic. Also fetch site-level `llms.txt` and `robots.txt` once.

**Per-page audit (`auditPage.ts`):** send each page's extracted signals + trimmed main text to OpenAI with a strict **JSON schema** (structured output), asking for dimension scores + 2–4 concrete fixes. One call per page.

**Visibility (`visibility.ts`):** generate ~4–6 buyer queries from `{practiceAreas, location}`; run each through OpenAI with the **web-search tool**; detect firm mention/citation + competitors from the answer and the returned source URLs.

**Scoring (`score.ts`):** citability = mean page overall; technical = site-signal checklist (+ optional PSI); visibility = weighted mention/citation rate; overall = documented blend. Weights are constants and printed in the report.

**Report (`report/`):** branded HTML (navy + gradient + Space Grotesk) → PDF via Puppeteer; per-page scorecard table with top fixes, a visibility section showing real competitors named, and the 30/60/90 roadmap. Also writes `output/<firm>-<date>.json`.

## 6. CLI usage

```
cd audit-tool
cp .env.example .env          # add OPENAI_API_KEY
npm run audit -- \
  --site "https://harborvale.com" \
  --firm "Harbor & Vale LLP" \
  --location "Providence, RI" \
  --areas "estate planning,probate,trusts" \
  --max-pages 25
# → output/harbor-vale-llp-2026-06-03.{html,pdf,json}
```

Flags: `--dry-run` (crawl + extract only, **no OpenAI calls**), `--max-pages N`, `--no-visibility` (skip web-search spot-check), `--no-pdf` (HTML only).

## 7. Config, secrets, cost control

- `.env` (gitignored): `OPENAI_API_KEY` required; `PAGESPEED_API_KEY` optional (PSI works keyless at low volume).
- **Cost:** ~1 OpenAI call per page + ~4–6 web-search calls. The tool prints an **estimated cost** before paid calls and supports `--dry-run` / `--max-pages` / `--no-visibility`.
- Graceful degradation: no sitemap → homepage-crawl fallback with a noted limitation; web-search unavailable → visibility section marked "not run" (no silent gaps).
- Model is a single `config.ts` constant (default a current GPT model) so it's easy to swap.

## 8. Phase 2 — self-serve instant mini-audit (after Phase 1)

`website/functions/api/instant-audit.ts`: runs crawl + per-page audit on a small cap (e.g., 5 pages) + 1–2 visibility queries, returns a teaser score JSON, emails the lead (existing pattern, rate-limited + honeypot). `/tools/geo-audit` Astro page: form → animated score reveal → "Get the full audit" CTA. Full audit stays human-reviewed.

## 9. Risks / open items

- **OpenAI API specifics** (Responses API + `web_search` tool, structured-output schema, current model id) confirmed against live docs during implementation; isolated in `auditPage.ts`/`visibility.ts`.
- **Readiness ≠ live citations:** the page audit grades *how citable* the site is; the web-search spot-check is a sample, not a guarantee — the report states this plainly.
- **Crawl politeness:** cap pages, set a descriptive User-Agent, small concurrency; respect the target's robots.
- **Puppeteer** dependency is heavy but fine in a separate internal package; `--no-pdf` avoids it; Phase 2 returns JSON (no PDF).
- **Cost** scales with page count → `--max-pages` default 30, estimate printed first.

## 10. Success criteria

- `npm run audit --site … --firm …` produces a branded PDF + JSON for a real firm: a per-page citability scorecard with concrete fixes, a visibility spot-check naming real competitors, and a 30/60/90 roadmap — all on one OpenAI key.
- `--dry-run`, `--max-pages`, `--no-visibility`, `--no-pdf` all work; estimated cost printed before paid calls.
- Scoring is documented and reproducible; missing sitemap / web-search degrade gracefully with noted gaps.
- Phase 2 self-serve endpoint returns a teaser score + captures a lead (built after Phase 1 is validated).
