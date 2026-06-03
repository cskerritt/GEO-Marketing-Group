# GEO Audit Tool — Design Spec

**Date:** 2026-06-03
**Status:** Awaiting approval
**Repo:** new package `GEO/audit-tool/` (sibling of `GEO/website/`); Phase 2 adds a function under `website/functions/`

---

## 1. Summary

Build the software that lets GEO Marketing Group actually **perform and deliver the GEO Audit** the website sells. A Node/TypeScript tool takes a firm's details, tests its visibility across AI answer engines, scans its site for citability/technical signals, scores it, and produces a **branded report** (HTML → PDF) with a 30/60/90 roadmap.

**Phase 1 (now):** internal CLI tool that produces the client deliverable.
**Phase 2 (after):** a trimmed, fast **self-serve "instant mini-audit"** on the website that returns a teaser score and captures the lead.

## 2. Goals / Non-Goals

### Goals
- Run a defined query set against **Perplexity (Sonar), OpenAI, Anthropic, Google Gemini** and record whether the firm — and which competitors — are mentioned/cited, with source URLs.
- Scan the firm's site for **GEO/AEO/SEO signals**: JSON-LD types, `llms.txt`, AI-bot access in robots, FAQ/question-structured headings, title/meta, heading hierarchy, HTTPS; plus **Core Web Vitals + Lighthouse** via Google PageSpeed Insights API.
- Compute a transparent **visibility score** + **technical citability score**, with a competitor citation map and a prioritized 30/60/90 roadmap.
- Output a **branded report**: HTML (brand tokens) rendered to **PDF**, plus the raw JSON for our records.
- Strict **cost controls** and honest data (no fabricated results).

### Non-Goals
- Google AI Overviews automation (no public API) — captured manually or via optional SerpApi later; out of scope for v1.
- Ongoing monitoring/dashboards (a later phase).
- Storing client data in a database (v1 writes local files only).

## 3. Architecture

```
GEO/
├── website/                       # existing site
└── audit-tool/                    # NEW Node/TypeScript package
    ├── package.json
    ├── .env.example               # API keys (never committed)
    ├── src/
    │   ├── config.ts              # env + cost caps
    │   ├── queries.ts             # buyer-question generation from {areas, location}
    │   ├── engines/
    │   │   ├── types.ts           # EngineResult interface
    │   │   ├── perplexity.ts      # Sonar API (returns citations)
    │   │   ├── openai.ts          # Responses API + web_search tool
    │   │   ├── anthropic.ts       # Messages API + web_search tool
    │   │   └── gemini.ts          # generateContent + Google Search grounding
    │   ├── detect.ts              # firm/competitor mention + citation detection
    │   ├── scan/
    │   │   ├── site.ts            # fetch + parse: JSON-LD, llms.txt, robots, headings, meta
    │   │   └── pagespeed.ts       # PageSpeed Insights API (CWV + Lighthouse)
    │   ├── score.ts               # weighted scoring model
    │   ├── report/
    │   │   ├── template.ts        # branded HTML report (brand tokens)
    │   │   └── pdf.ts             # HTML → PDF via Puppeteer
    │   └── run.ts                 # orchestrates a full audit
    ├── bin/audit.ts               # CLI entrypoint
    └── output/                    # generated reports (gitignored)
```

**Phase 2 (later):** `website/functions/api/instant-audit.ts` (Cloudflare Pages Function) imports a trimmed subset of the core (site scan + PageSpeed + 1–2 Perplexity queries), returns a teaser score as JSON, and emails the lead (reusing the existing `/api/contact` email pattern). A small Astro page `/tools/geo-audit` hosts the form.

## 4. Core interfaces

```ts
interface AuditInput {
  firm: string;
  website: string;            // https://…
  location: string;           // "Providence, RI"
  practiceAreas: string[];    // ["estate planning", "litigation"]
  competitors?: string[];     // optional known competitor names
}

interface EngineResult {
  engine: 'perplexity' | 'openai' | 'anthropic' | 'gemini';
  query: string;
  firmMentioned: boolean;
  firmCited: boolean;         // firm domain appears in citations
  citations: string[];       // source URLs
  competitorsMentioned: string[];
  answerExcerpt: string;      // first ~400 chars, for the report
}

interface SiteScan {
  https: boolean;
  schemaTypes: string[];      // JSON-LD @types found
  hasLlmsTxt: boolean;
  aiBotsAllowed: boolean;     // robots.txt check
  faqStructured: boolean;     // FAQPage schema or Q-shaped headings
  headingOutline: string[];
  titleMeta: { title?: string; description?: string };
  pageSpeed: { performance: number; seo: number; accessibility: number; lcp: number; cls: number; inp?: number };
}

interface AuditResult {
  input: AuditInput;
  generatedAt: string;
  engineResults: EngineResult[];
  siteScan: SiteScan;
  scores: { visibility: number; technical: number; overall: number }; // 0–100
  roadmap: { horizon: '30' | '60' | '90'; items: string[] }[];
}
```

## 5. Engine adapters (web-grounded)

Each adapter sends the same query and normalizes to `EngineResult`. All use **web-grounded** modes so answers reflect real search behavior:
- **Perplexity** — Sonar chat completions; read the returned `citations`. (Primary GEO signal.)
- **OpenAI** — Responses API with the `web_search` tool; read URL annotations.
- **Anthropic** — Messages API with the server-side `web_search` tool; read result citations.
- **Gemini** — `generateContent` with Google Search grounding; read `groundingMetadata` sources.

`detect.ts` flags `firmMentioned` (firm name fuzzy-match in answer), `firmCited` (firm domain in citations), and extracts competitor names from answer + citation domains. Exact endpoint/model strings are confirmed against current API docs at build time.

## 6. Scoring model (transparent, tunable)

- **Visibility score (0–100):** weighted share of queries where the firm is mentioned/cited, weighted by engine (Perplexity & Google highest), with a bonus for being cited (not just mentioned) and a penalty when only competitors appear.
- **Technical citability score (0–100):** weighted checklist — schema present, FAQ structure, `llms.txt`, AI-bot access, Lighthouse SEO, Core Web Vitals pass.
- **Overall** = blend (e.g., 60% visibility / 40% technical). Weights live in `score.ts` constants and are documented in the report so results are explainable.

## 7. Report output

A branded HTML report using the site's visual language (navy, gradient, Space Grotesk) → rendered to **PDF via Puppeteer**. Sections: cover (firm + overall score gauge), AI-visibility by engine (with the actual cited competitors), technical citability scorecard, top gaps, and a **30/60/90 roadmap**. Also writes `output/<firm>-<date>.json`.

## 8. CLI usage

```
cd audit-tool
cp .env.example .env   # fill in API keys
npm run audit -- \
  --firm "Harbor & Vale LLP" \
  --site "https://harborvale.com" \
  --location "Providence, RI" \
  --areas "estate planning,probate,trusts" \
  --competitors "Smith & Co, Doe Law"
# → output/harbor-vale-llp-2026-06-03.{html,pdf,json}
```

## 9. Config, secrets, cost control

- Keys via `.env` (gitignored): `PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `PAGESPEED_API_KEY` (optional). `.env.example` documents them.
- **Cost caps:** default query set is bounded (8–12 queries); the tool prints an **estimated cost** and supports `--dry-run` (generate queries + site scan only, no paid engine calls) and `--max-queries N`.
- Graceful degradation: if an engine key is missing, that engine is skipped and the report notes reduced coverage (no silent gaps).

## 10. Phase 2 — self-serve instant mini-audit (after Phase 1)

- `website/functions/api/instant-audit.ts`: runs site scan + PageSpeed + up to 2 Perplexity queries (cheap), returns a teaser visibility/technical score, and emails the lead (existing email pattern). Rate-limited + honeypot.
- `/tools/geo-audit` Astro page: a form (firm, site, location) → animated score reveal → "Get the full audit" CTA.
- Heavy/expensive engines stay in the internal tool; the full audit remains human-reviewed.

## 11. Risks / open items

- **API specifics drift** — exact model names/endpoints/tool schemas confirmed against live docs during implementation; adapters isolate this.
- **Cost** — each full audit makes ~32–48 paid calls; cost caps + `--dry-run` mitigate. Owner sets a per-audit budget.
- **Mention/competitor detection** — heuristic; v1 favors precision and shows the raw excerpt + citations so a human can verify before sending.
- **Puppeteer dependency** — heavy, but acceptable in a separate internal package; Phase 2 self-serve avoids PDF (returns JSON/HTML).
- **Compliance** — for regulated verticals, the report is reviewed by us before delivery (matches the "5-day, human-reviewed" promise).

## 12. Success criteria

- `npm run audit` produces a correct branded PDF + JSON for a real firm, with live data from all configured engines.
- Missing keys degrade gracefully with a noted coverage gap.
- `--dry-run` and `--max-queries` work; estimated cost printed before paid calls.
- Scoring is documented and reproducible.
- Phase 2 self-serve endpoint returns a teaser score and captures a lead (built after Phase 1 is validated).
