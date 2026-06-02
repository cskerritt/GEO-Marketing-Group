# GEO Agency — Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** [`/Users/chrisskerritt/Documents/New project/GEO/docs/specs/2026-04-25-geo-agency-design.md`](../specs/2026-04-25-geo-agency-design.md)

**Goal:** Stand up the GEO agency end-to-end: market research → business plan → brand → GEO/AEO-optimized website, deployed.

**Architecture:** Three sequential phases. Phase 1 (Research) feeds Phase 2 (Business Plan + Brand) which feeds Phase 3 (Website). Website is built in Astro + Tailwind, deployed to Cloudflare Pages, with full GEO/AEO infrastructure (schema.org, llms.txt, FAQ blocks, citable content, Lighthouse ≥95).

**Tech Stack:** Markdown for research/plan/brand/content; Astro 5.x + Tailwind 4.x + TypeScript for website; Cloudflare Pages for hosting; Cloudflare Pages Functions for forms.

**Working directory:** `/Users/chrisskerritt/Documents/New project/GEO/`

---

## Phase 1 — Market Research

Five citation-rich research documents. Each ~1,000–1,500 words. Web-search-heavy. Output is markdown only.

### Task 1.1 — README & project status

**Files:** Create `README.md`

- [ ] **Step 1:** Write project README with status, links to spec/plan, folder map, current phase, next actions.

### Task 1.2 — Research: GEO/AEO Landscape

**Files:** Create `research/01-geo-aeo-landscape.md`

- [ ] **Step 1:** Web research: state of GEO/AEO (2026), leading frameworks, ranking signals, tool ecosystem.
- [ ] **Step 2:** Write doc with sections:
  1. Definitions (GEO, AEO, AIO, AI Search Optimization)
  2. Why now — AI search adoption stats with sources
  3. How LLMs select citations (technical mechanism)
  4. Ranking factors (authority, schema, freshness, citability, entity coherence)
  5. Frameworks in market (CITABLE, others)
  6. Tooling landscape (Profound, Otterly, Scrunch, AICitable, Athena, etc.)
  7. GEO vs. SEO — key differences
  8. Outlook 2026–2028
- [ ] **Step 3:** Each claim cited with source URL.

### Task 1.3 — Research: Competitor Analysis

**Files:** Create `research/02-competitor-analysis.md`

- [ ] **Step 1:** Profile 10 GEO/AEO agencies: Discovered Labs, First Page Sage, Mr. Green Marketing, Animalz, Cite Solutions, iPullRank, TripleDart, Omnius, Flow Agency, Uproer, GreenBanana SEO. For each: positioning, ICP, services, pricing if discoverable, differentiation, weaknesses.
- [ ] **Step 2:** Identify positioning whitespace: where is GEO underserved? (Hypothesis: industry-vertical specialization in professional services + Northeast geographic warmth.)
- [ ] **Step 3:** Conclude with a positioning whitespace map and 3 strategic openings GEO can attack.

### Task 1.4 — Research: Providence Market

**Files:** Create `research/03-providence-market.md`

- [ ] **Step 1:** Quantify RI/SE-MA professional services market: # of law firms, CPA firms, consulting firms, financial advisors, A&E firms in target size range. Sources: RI Bar, RISCPA, SBA, Providence Chamber.
- [ ] **Step 2:** Profile key trade orgs and publications:
  - RI Bar Association, RISCPA, Providence Chamber, RIBA, AIA RI
  - Providence Business News, Rhode Island Lawyers Weekly, Boston Business Journal
- [ ] **Step 3:** Map decision-maker profiles: managing partner / owner / marketing director.
- [ ] **Step 4:** Identify warm-market entry points (CLE talks, sponsorship, guest articles).

### Task 1.5 — Research: Pricing Benchmarks

**Files:** Create `research/04-pricing-benchmarks.md`

- [ ] **Step 1:** National GEO/AEO pricing (build, retainer, audit) by tier — boutique vs. mid-market vs. enterprise.
- [ ] **Step 2:** What professional services firms already pay for SEO/marketing/website (baseline anchor).
- [ ] **Step 3:** Productization examples: how leading agencies package services (named tiers, fixed fees, retainer minimums).
- [ ] **Step 4:** Recommend final GEO pricing: Audit, Build, Retainer, hybrid bundle, with rationale.

### Task 1.6 — Research: ICP Profile

**Files:** Create `research/05-icp-profile.md`

- [ ] **Step 1:** Build 3 detailed personas (one per top vertical): "Patrick — managing partner, 8-attorney RI law firm," "Diane — marketing director, mid-size CPA," "Mark — owner, RI consulting practice."
- [ ] **Step 2:** Per persona document: pains, triggers, decision criteria, objections, budget, content consumption, who they trust, sales cycle.
- [ ] **Step 3:** Map persona → service tier → pricing.

### Phase 1 Checkpoint

- [ ] Review all 5 research docs for cross-consistency.
- [ ] Note any findings that should change the spec (e.g., pricing benchmark wildly different from the spec's range).
- [ ] If spec changes needed, update spec before Phase 2.

---

## Phase 2 — Business Plan & Brand

### Task 2.1 — Business Plan

**Files:** Create `business-plan/business-plan.md`

- [ ] **Step 1:** Write the 10 sections defined in spec §7. Synthesize directly from research docs — every market claim cites the relevant research file.
- [ ] **Step 2:** Quantify Phase 1 (Providence beachhead) sales targets month-by-month: Month 1 = 1 audit + 0 hybrids, Month 6 = 4 audits + 2 hybrids, etc.
- [ ] **Step 3:** Specify go-to-market tactics with named channels (RI Bar CLE, Chamber sponsorship, RISCPA newsletter ads, LinkedIn outbound to 50 managing partners/wk).
- [ ] **Step 4:** Operations: define delivery process from sale to handoff, tooling stack (Notion or Linear, Stripe, Loom, Calendly, Profound or Otterly for monitoring).
- [ ] **Step 5:** Financial projections — month-by-month Y1, quarterly Y2/Y3.
- [ ] **Step 6:** Risk register with mitigations.

### Task 2.2 — Financial Model

**Files:** Create `business-plan/financial-model.md`

- [ ] **Step 1:** Document assumptions: avg deal size, sales cycle, win rate, churn, capacity per consultant.
- [ ] **Step 2:** Build 36-month revenue model in markdown table form (month, new audits, new hybrids, new retainers, MRR, total revenue, COGS, gross margin, opex, net).
- [ ] **Step 3:** Three scenarios: conservative (Y1 = $120K), base (Y1 = $175K), aggressive (Y1 = $250K).
- [ ] **Step 4:** Capacity planning: when does Chris max out solo? When to hire first contractor? When does the agency model kick in?

### Task 2.3 — One-pager

**Files:** Create `business-plan/one-pager.md`

- [ ] **Step 1:** Single-page (markdown) summary: who, what, why now, who serves, pricing, 3-year vision, how to engage.
- [ ] **Step 2:** Designed to be the elevator pitch and the link sent to a curious partner/investor.

### Task 2.4 — Brand Guidelines

**Files:** Create `brand/brand-guidelines.md`

- [ ] **Step 1:** Document the brand:
  - Wordmark spec ("GEO" in serif display)
  - Color palette with hex codes (navy `#0F2A44`, cream `#F5EBD8`, brass `#A8722C`, ink `#111`)
  - Type system (Fraunces or Playfair for headers, Inter for body, mono for code)
  - Logo direction (wordmark + optional compass-rose or geometric mark)
  - Imagery style (no stock people; abstract patterns or photographic Providence/coastal references)
  - Voice attributes (confident, authoritative, RI-grounded, low-jargon)
- [ ] **Step 2:** Provide do/don't examples for voice.

### Task 2.5 — Messaging

**Files:** Create `brand/messaging.md`

- [ ] **Step 1:** Final tagline + 2 alternates.
- [ ] **Step 2:** 3 value propositions written for the home hero.
- [ ] **Step 3:** Industry-specific value props (one per vertical: Law, CPA, Consulting, Financial Advisors, A&E).
- [ ] **Step 4:** Objection-handling lines (5 common objections + responses).
- [ ] **Step 5:** Proof points / social proof framing for the 3 prior clients (anonymized).

### Phase 2 Checkpoint

- [ ] User reviews business plan and approves before website build begins.

---

## Phase 3 — Website

### Task 3.1 — Astro project init

**Files:** Initialize in `website/`

- [ ] **Step 1:** `cd "/Users/chrisskerritt/Documents/New project/GEO/website"` then `npm create astro@latest .` — choose minimal template, TypeScript strict, no sample files, install deps, no git init (parent is git).
- [ ] **Step 2:** Add Tailwind: `npx astro add tailwind --yes`.
- [ ] **Step 3:** Add MDX integration: `npx astro add mdx --yes`.
- [ ] **Step 4:** Add Sitemap integration: `npx astro add sitemap --yes`.
- [ ] **Step 5:** Add Astro icon: `npm install astro-icon @iconify-json/lucide`.
- [ ] **Step 6:** Verify dev server runs: `npm run dev` → opens at `http://localhost:4321/`.

### Task 3.2 — Design system foundation

**Files:** `website/src/styles/global.css`, `website/tailwind.config.mjs`, `website/src/layouts/Base.astro`

- [ ] **Step 1:** Configure Tailwind theme — extend with brand palette (navy, cream, brass, ink), font families (Fraunces/Playfair, Inter), spacing scale, max content width 72ch for prose.
- [ ] **Step 2:** Add Google Fonts to global CSS for Fraunces + Inter (preconnect + display=swap).
- [ ] **Step 3:** Create `Base.astro` layout: `<html lang="en">`, `<head>` with title/description/canonical/OG/JSON-LD slots, `<body>` with header + main + footer slots.
- [ ] **Step 4:** Verify base layout renders without console errors.

### Task 3.3 — Site navigation & global components

**Files:** `website/src/components/Header.astro`, `Footer.astro`, `CTA.astro`, `FAQ.astro`, `CitableStat.astro`

- [ ] **Step 1:** Header: GEO wordmark left, nav (Services / Industries / Insights / About / Contact) right, "Get Free Audit" CTA button on the right, mobile menu.
- [ ] **Step 2:** Footer: address (Providence, RI), contact email/phone, sitemap links, social, llms.txt link, year, "© GEO".
- [ ] **Step 3:** `CTA.astro` reusable component: heading + body + button + optional image.
- [ ] **Step 4:** `FAQ.astro` component: accepts array of `{q, a, sources?}`, renders accessible disclosure widgets, automatically emits `FAQPage` JSON-LD schema.
- [ ] **Step 5:** `CitableStat.astro` component: big number + label + cited source link, semantic `<figure>` with `<figcaption>`.

### Task 3.4 — Schema.org infrastructure

**Files:** `website/src/lib/schema.ts`, `website/src/components/SchemaJsonLd.astro`

- [ ] **Step 1:** `schema.ts` exports typed builders for: `Organization`, `LocalBusiness`, `Service`, `Person`, `FAQPage`, `Article`, `BreadcrumbList`, `LegalService`, `AccountingService`.
- [ ] **Step 2:** Each builder takes typed props and returns a JSON-LD object.
- [ ] **Step 3:** `SchemaJsonLd.astro` component renders `<script type="application/ld+json">` with passed object.
- [ ] **Step 4:** Validate output against [Schema.org validator](https://validator.schema.org/) for one example each — copy/paste output for sanity check.

### Task 3.5 — llms.txt + robots.txt

**Files:** `website/public/llms.txt`, `website/public/robots.txt`

- [ ] **Step 1:** Write `llms.txt` per the [llms.txt spec](https://llmstxt.org/): site title, description, key page links grouped by section (Services, Industries, Insights), with one-line summaries each.
- [ ] **Step 2:** Write `robots.txt`: allow all; disallow `/api/`; reference sitemap.
- [ ] **Step 3:** Verify both files served at `http://localhost:4321/llms.txt` and `/robots.txt`.

### Task 3.6 — Home page

**Files:** `website/src/pages/index.astro`

- [ ] **Step 1:** Hero: tagline "GEO & AEO for Professional Services", subhead about getting cited by AI, primary CTA "Get a Free GEO Audit," secondary CTA "See How It Works."
- [ ] **Step 2:** Problem section: 3 citable stats (e.g., "% of B2B buyers using AI for vendor research") with sources.
- [ ] **Step 3:** Services preview: 3 cards (GEO, AEO, Build + Optimize) linking to detail pages.
- [ ] **Step 4:** Industries preview: 5 cards linking to industry pages.
- [ ] **Step 5:** Founder/Providence note: short paragraph anchoring credibility.
- [ ] **Step 6:** FAQ block with 5 home-level questions (use `FAQ.astro`).
- [ ] **Step 7:** Final CTA: "Ready to be the answer when AI gets asked?"
- [ ] **Step 8:** Embed `Organization` + `LocalBusiness` JSON-LD via `SchemaJsonLd.astro`.

### Task 3.7 — About page

**Files:** `website/src/pages/about.astro`

- [ ] **Step 1:** Founder story (Chris, Providence roots, path to GEO).
- [ ] **Step 2:** Methodology preview (linking to /process).
- [ ] **Step 3:** Why GEO, why now.
- [ ] **Step 4:** `Person` JSON-LD for founder.

### Task 3.8 — Process / Methodology page

**Files:** `website/src/pages/process.astro`

- [ ] **Step 1:** Document the methodology: Audit → Build/Optimize → Monitor → Iterate.
- [ ] **Step 2:** For each step: what we do, what client gets, timeline, deliverables.
- [ ] **Step 3:** Citable: include actual checklists / artifact lists where possible.

### Task 3.9 — Services overview + 3 service detail pages

**Files:** `website/src/pages/services/index.astro`, `geo.astro`, `aeo.astro`, `build.astro`

- [ ] **Step 1:** Services overview: brief intro + 3 cards linking to GEO/AEO/Build details.
- [ ] **Step 2:** Each detail page (GEO, AEO, Build) has identical structure:
  - What it is (clear, citable)
  - What's included (deliverables list)
  - Process & timeline
  - Pricing tier
  - 8 FAQs (citable, dated)
  - `Service` JSON-LD
  - CTA to free audit

### Task 3.10 — 5 Industry pages

**Files:** `website/src/pages/industries/index.astro`, `law-firms.astro`, `cpa-firms.astro`, `consulting.astro`, `financial-advisors.astro`, `architecture-engineering.astro`

- [ ] **Step 1:** Industries overview page: 5 cards, brief intro, links.
- [ ] **Step 2:** For each industry page (~2,500 words each):
  - Industry-specific GEO challenge framing
  - Industry-specific GEO/AEO playbook (5–7 plays)
  - Industry-specific schema (LegalService, AccountingService, etc.)
  - Industry-specific FAQ (10 entries)
  - Industry-specific case study placeholder (or anonymized prior client)
  - Industry-specific lead magnet CTA ("Download the GEO Audit Checklist for [Industry]")
- [ ] **Step 3:** Per-industry JSON-LD: relevant `Service` subtype + `FAQPage`.

### Task 3.11 — 2 Location pages

**Files:** `website/src/pages/locations/providence-ri.astro`, `boston-ma.astro`

- [ ] **Step 1:** Providence page (rich): local market context, Providence-specific clients, in-person availability, RI Bar / RISCPA / Chamber relationships, `LocalBusiness` JSON-LD with full Providence address.
- [ ] **Step 2:** Boston page (lighter): primary regional secondary market, "we work with" framing, no local address claim — `Service` schema with `areaServed`.

### Task 3.12 — Insights / Blog scaffolding

**Files:** `website/src/content/config.ts`, `website/src/pages/insights/index.astro`, `website/src/pages/insights/[slug].astro`

- [ ] **Step 1:** Configure content collection in `src/content/config.ts` for `insights/` with frontmatter schema (title, description, pubDate, updatedDate, author, tags, draft, citations).
- [ ] **Step 2:** Insights index: list posts with title/date/excerpt, sorted by date.
- [ ] **Step 3:** Dynamic `[slug].astro`: render post markdown, author byline, `Article` JSON-LD with `datePublished` + `dateModified` + author + headline, breadcrumb schema, "Sources" section with citations.

### Task 3.13 — 10 Launch blog posts

**Files:** `website/src/content/insights/<slug>.md` × 10

Slugs and topics:
1. `what-is-geo.md` — *"What is GEO (Generative Engine Optimization)?"*
2. `geo-vs-seo-vs-aeo.md` — *"GEO vs. SEO vs. AEO — what's the difference?"*
3. `how-law-firms-get-cited-by-chatgpt.md`
4. `how-ai-engines-pick-citations.md`
5. `citable-framework-explained.md`
6. `setting-up-llms-txt.md`
7. `aeo-for-accounting-firms.md`
8. `why-firm-not-in-perplexity.md`
9. `geo-for-providence-professional-services.md`
10. `ai-search-eaten-google-referrals.md`

- [ ] **Step 1:** For each post: ~1,200–1,800 words, citation-rich (≥5 sources each), well-structured with H2/H3, FAQ block at the end (3 entries), "Sources" section.
- [ ] **Step 2:** Each post emits `Article` + `FAQPage` JSON-LD via the dynamic `[slug].astro` page.
- [ ] **Step 3:** Internal entity linking: every post links to relevant industry/service pages with consistent anchor text.

### Task 3.14 — Free GEO Audit lead form

**Files:** `website/src/pages/audit.astro`, `website/functions/api/audit.ts`

- [ ] **Step 1:** Audit page: explain what's in the audit, who it's for, time to deliver (3 business days), value framing ("normally $1,500, free for first 25 firms in RI/MA").
- [ ] **Step 2:** Form fields: name, email, firm name, firm size dropdown, industry dropdown, current website URL, "what's making you ask now" textarea.
- [ ] **Step 3:** Cloudflare Pages Function at `/api/audit` accepts POST, validates payload, sends email via Resend or MailChannels (Cloudflare's free path), redirects to thank-you.
- [ ] **Step 4:** Spam protection: honeypot field + Cloudflare Turnstile.
- [ ] **Step 5:** Thank-you page with calendar embed (Cal.com or Calendly link).

### Task 3.15 — Contact page

**Files:** `website/src/pages/contact.astro`

- [ ] **Step 1:** Direct contact: email, phone (if used), book-a-call CTA.
- [ ] **Step 2:** Light form for general inquiries (separate from audit).

### Task 3.16 — Sitemap, OG defaults, performance

**Files:** `website/astro.config.mjs`

- [ ] **Step 1:** Configure `@astrojs/sitemap` with site URL, change frequency, priority hierarchy (home + industries = 1.0, services = 0.9, insights = 0.7).
- [ ] **Step 2:** Add default OG image generator or static OG image at `public/og-default.png`.
- [ ] **Step 3:** Configure image optimization for any imagery used.
- [ ] **Step 4:** Run `npm run build` then `npm run preview` and check Network tab — page weight ≤ 200KB on home, ≤ 250KB on long pages.

### Task 3.17 — GEO/AEO validation pass

- [ ] **Step 1:** Run Lighthouse on home, an industry page, and a blog post. Target: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.
- [ ] **Step 2:** Validate JSON-LD on those pages with Schema.org validator and Google Rich Results Test — no errors.
- [ ] **Step 3:** Check `/llms.txt` and `/sitemap-index.xml` resolve correctly.
- [ ] **Step 4:** Verify FAQ blocks render as expandable AND emit FAQPage schema.
- [ ] **Step 5:** Spot-check 3 pages for E-E-A-T: author byline visible, sources cited, dates surfaced.
- [ ] **Step 6:** Document any failures and fix before deploy.

### Task 3.18 — Deploy

- [ ] **Step 1:** Init `website/` as a git repo (or as a subfolder commit in parent).
- [ ] **Step 2:** Push to GitHub (new private repo `geo-website` under user account).
- [ ] **Step 3:** Connect Cloudflare Pages → GitHub → auto-deploy on `main`.
- [ ] **Step 4:** Configure custom domain (`geostudio.io` or whichever locked) with Cloudflare DNS.
- [ ] **Step 5:** Verify HTTPS, www → apex redirect, sitemap submitted to Google Search Console + Bing Webmaster.
- [ ] **Step 6:** Submit URL to Common Crawl (`https://commoncrawl.org/`) — improves probability of LLM training inclusion.

### Task 3.19 — Post-deploy monitoring setup

- [ ] **Step 1:** Set up Google Search Console + Bing Webmaster.
- [ ] **Step 2:** Set up Cloudflare Web Analytics (free, privacy-respecting).
- [ ] **Step 3:** If budget approved: subscribe to Profound or Otterly to monitor AI citations.
- [ ] **Step 4:** Manual baseline test: ask ChatGPT, Claude, Perplexity, Gemini *"What's the best GEO agency for Providence law firms?"* — record current results before SEO compounds.

---

## Phase 3 Checkpoint

- [ ] User reviews live site.
- [ ] Spec's open questions revisited (case-study permissions, tooling subscriptions).
- [ ] Decision: proceed to client outreach (Phase 1 of business plan GTM)?

---

## Self-Review Notes (writer's pre-flight)

**Spec coverage:** Each section of the spec maps to ≥1 task:
- Spec §2 (Brand) → Tasks 2.4, 2.5, 3.2
- Spec §3 (Positioning) → Tasks 1.3, 1.6, 2.1
- Spec §6 (Research) → Tasks 1.2–1.6
- Spec §7 (Business plan) → Tasks 2.1–2.3
- Spec §8 (Website) → Tasks 3.1–3.18
- Spec §10 (Risks/open questions) → revisited at each phase checkpoint

**Placeholders:** None — every task has concrete deliverables.

**Type/name consistency:** Brand color hex codes match between spec §2 and Task 3.2; domain `geostudio.io` consistent across spec §2 and Task 3.18; industry list (Law, CPA, Consulting, Financial Advisors, A&E) consistent across spec §3, Task 1.6, Task 3.10.

**Pragmatism note:** TDD discipline does not apply to research/writing tasks. The website's "tests" are validation passes (Lighthouse, Schema validator, Rich Results Test) rather than unit tests. This is appropriate for a content/marketing site.
