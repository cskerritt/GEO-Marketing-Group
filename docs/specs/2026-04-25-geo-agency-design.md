# GEO — Agency Project Design Spec

**Date:** 2026-04-25
**Status:** Draft, awaiting user review
**Author:** Chris Skerritt (with Claude)

---

## 1. Project Summary

Launch a digital marketing agency, **GEO**, that delivers Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) services to professional services firms — making clients citable and recommended by ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini, and emerging AI answer engines.

**Founder context:** Chris has delivered 3 unpaid GEO/AEO website builds for B2B clients who specifically want LLMs to recommend their sites. Technical execution skills exist (GitHub hosting, deployment). The unsolved problem has been pricing and packaging — not delivery capability.

**Goal:** Operationalize what Chris has already been giving away into a paid, scalable, full-time business.

---

## 2. Brand

| | |
|---|---|
| **Name** | GEO |
| **Wordmark** | "GEO" — three letters, standalone |
| **Working tagline** | *"GEO & AEO for Professional Services."* |
| **Domain (working)** | `geostudio.io` (verified available 2026-04-25) |
| **Domain stretch goal** | Acquire `getgeo.com` (parked, Korean registrar) post-revenue |
| **Acceptable alternates** | `geoaeoagency.com`, `geofirstco.com` |

### Brand discoverability risk (acknowledged)

"GEO" is the generic descriptor of the service category. Searching "GEO" returns satellites, GIS, and GEO Group (a $1B+ private prison operator). This means:

- Cannot be trademarked
- Difficult to rank for own brand name on Google
- Domain options for pure "geo.X" are saturated

**Mitigations baked into the plan:**
1. URL anchors (`geostudio.io`) provide a brandable URL even if wordmark is generic
2. Industry-vertical content moat ("GEO for law firms," "GEO for CPAs") becomes the discoverability vector — buyers search the *problem*, not the brand
3. Founder name + "GEO" used in consistent author bylines and entity references for AI training-data signal
4. Long-term: acquire `getgeo.com` if revenue allows

### Visual direction

- **Palette:** Deep navy `#0F2A44`, warm cream `#F5EBD8`, brass accent `#A8722C`, ink `#111`
- **Typography:** Serif display (Fraunces or Playfair Display) + clean sans body (Inter)
- **Tone:** Confident, authoritative, professionally grounded — *not* Silicon Valley startup
- **Logo direction:** Wordmark-driven, "GEO" set in serif display, possibly with subtle geometric or compass-rose mark

---

## 3. Strategic Positioning

### The Hybrid GTM (national brand, Providence beachhead)

| Phase | Months | Focus | Lead mix |
|---|---|---|---|
| 1. Beachhead | 1–6 | Providence/RI/MA warm market via Chamber, RI Bar, RISCPA, founder network | 80% RI/MA, 20% national inbound |
| 2. Northeast vertical | 6–18 | Boston, Hartford, NYC; industry content marketing scales | 50/50 |
| 3. National vertical leadership | 18–36 | "*The* GEO agency for [vertical]"; vertical media partnerships, conference circuit | 80% national, 20% local |

**Key insight:** Geographic moats don't scale. Vertical moats compound. Providence is the Year 1 *sales channel*, not the Year 3 *brand identity*.

### Ideal Customer Profile (ICP)

- **Industries:** Law firms, CPA/accounting practices, consultants, financial advisors, architecture/engineering firms
- **Size:** $1M–$25M revenue, 5–75 employees
- **Geography (Y1):** Rhode Island and Southeast Massachusetts; (Y3) national
- **Decision-maker:** Managing partner, owner, or marketing director
- **Pain trigger:** Lost referral traffic to AI; competitors getting cited in AI answers; existing SEO investment producing diminishing returns

### Service Model (Hybrid)

| Service | Format | Price range | Frequency |
|---|---|---|---|
| **GEO Audit** | Productized one-time | $1,500–$2,500 | Lead magnet / standalone |
| **Build + GEO Optimization** | Project | $4,000–$8,000 | One-time |
| **GEO Retainer** | Monthly | $1,500–$3,500/mo | Ongoing |
| **Hybrid (most common)** | Build → Retainer | $4K–$8K then $1.5K–$3.5K/mo | Project + recurring |
| **Industry-specific add-ons** | Productized | $500–$2,000 ea | One-time, à la carte |

Pricing is preliminary; will be refined by competitive benchmarking in the research phase.

---

## 4. Project Decomposition

This single project is delivered in three sequential sub-projects:

```
1. MARKET RESEARCH  →  2. BUSINESS PLAN  →  3. WEBSITE
   (informs ICP,         (becomes source of truth        (uses business plan
    pricing, positioning) for messaging, services)        positioning as content)
```

Each sub-project depends on the prior. The website cannot be written before the business plan; the plan cannot be written before the research.

---

## 5. Folder Structure

```
/Users/chrisskerritt/Documents/New project/GEO/
├── README.md                          # Project overview & status
├── docs/
│   └── specs/
│       └── 2026-04-25-geo-agency-design.md   # ← this document
├── research/
│   ├── 01-geo-aeo-landscape.md        # State of GEO/AEO, frameworks, tools
│   ├── 02-competitor-analysis.md      # National + local agencies, pricing
│   ├── 03-providence-market.md        # TAM, key firms, buyer profiles
│   ├── 04-pricing-benchmarks.md       # Build, retainer, audit pricing
│   └── 05-icp-profile.md              # Detailed ICP with pain points
├── business-plan/
│   ├── business-plan.md               # Full plan (10 sections)
│   ├── financial-model.md             # Y1/Y2/Y3 projections
│   └── one-pager.md                   # Investor/partner summary
├── brand/
│   ├── brand-guidelines.md            # Voice, palette, type, logo direction
│   └── messaging.md                   # Positioning, taglines, value props
└── website/                           # Astro project
    ├── src/                           # Pages, layouts, components
    ├── public/
    │   ├── llms.txt                   # AI crawler instructions
    │   ├── sitemap.xml
    │   └── robots.txt
    └── content/                       # Markdown blog & case studies
```

---

## 6. Sub-project 1 — Market Research

**Output:** Five markdown research documents, ~1,000–1,500 words each, citation-rich.

### 6.1 GEO/AEO Landscape (`01-geo-aeo-landscape.md`)

What the space is, leading frameworks (CITABLE methodology, schema/llms.txt patterns), how LLMs select citations, ranking factors, tool ecosystem (Profound, Otterly, Scrunch, AICitable, Athena, etc.), how the space differs from traditional SEO.

### 6.2 Competitor Analysis (`02-competitor-analysis.md`)

Top 10 GEO/AEO agencies including Discovered Labs, First Page Sage, Mr. Green, Animalz, Cite Solutions, iPullRank, TripleDart, Omnius, Flow Agency, Growth Plays, Uproer, GreenBanana SEO. For each: positioning, pricing if discoverable, ICP, gaps to attack. Conclude with positioning whitespace map.

### 6.3 Providence Market (`03-providence-market.md`)

RI professional services landscape: number of firms by category (law, CPA, consulting, financial advisors, A&E), marketing budget norms, decision-maker profiles, dominant trade orgs (RI Bar Association, RISCPA, Providence Chamber of Commerce, RIBA), key publications (Providence Business News, Rhode Island Lawyers Weekly).

### 6.4 Pricing Benchmarks (`04-pricing-benchmarks.md`)

What GEO build/retainer/audit pricing looks like nationally vs. RI norms; what professional services firms already pay for SEO/marketing/web; willingness-to-pay framing; productization examples from leading agencies.

### 6.5 ICP Profile (`05-icp-profile.md`)

Detailed buyer persona: managing partner at 8-attorney RI law firm, marketing director at mid-size CPA, owner of consulting practice. For each: pains, triggers, decision criteria, objections, where they consume content, who they trust.

---

## 7. Sub-project 2 — Business Plan

**Output:** `business-plan/business-plan.md`, ~5,000–8,000 words, plus financial model and one-pager.

### Sections

1. **Executive Summary** — what GEO is, who it serves, why now, Y1/Y3 targets
2. **Company & Brand** — origin, mission, brand identity, founder story
3. **Market Opportunity** — synthesizes research into market size and timing argument
4. **ICP & Positioning** — who we serve, why us, vs. competitors, brand voice
5. **Services & Pricing** — Audit, Build, Retainer, productized add-ons; pricing logic
6. **Go-to-Market** — three-phase plan (Providence → Northeast → national); channel strategy; founding-client offer; content/SEO/PR/partnerships
7. **Operations** — delivery process, SOPs, tooling stack, capacity planning, hiring milestones
8. **Financial Projections** — Y1 month-by-month, Y2/Y3 quarterly. Targets:
   - **Y1:** $150K–$200K revenue (Providence-heavy, hybrid clients)
   - **Y2:** $400K–$600K (Northeast + early national, first contractor hire)
   - **Y3:** $750K–$1.2M (national, small team, full agency model)
9. **Milestones & KPIs** — clients/MRR/CAC/LTV/utilization benchmarks
10. **Risks & Mitigations** — including (a) "GEO" brand discoverability, (b) GEO terminology drift, (c) local-to-national transition, (d) competitive saturation, (e) AI platform changes

---

## 8. Sub-project 3 — Website

**Tech stack:** Astro + Tailwind CSS + TypeScript. Deployed to Cloudflare Pages or Vercel. Content as Markdown for fast iteration. Forms via Cloudflare Pages Functions + email (or Formspree as fallback).

**Why Astro:** Static HTML output is the most LLM-crawl-friendly format (no JavaScript-rendered content). Excellent Core Web Vitals out of the box (a known GEO/AEO ranking signal). Markdown-native authoring. Matches Chris's existing GitHub-based deploy workflow.

### 8.1 Page Inventory (~20 pages)

**Core (5):**
- Home
- About
- Process / Methodology
- Contact
- Free GEO Audit (lead magnet form)

**Services (4):**
- Services overview
- GEO Service detail
- AEO Service detail
- Website Build service detail

**Industries (5)** — *the moat, written to ~2,500 words each:*
- GEO for Law Firms
- GEO for CPAs / Accounting Firms
- GEO for Consulting Firms
- GEO for Financial Advisors
- GEO for Architecture & Engineering Firms

**Locations (2 at launch, expandable):**
- Providence, RI (rich)
- Boston, MA (lighter — sets up Phase 2)

**Content (1 collection at launch):**
- Insights / Blog with 10 launch posts targeting AEO queries:
  1. *"What is GEO (Generative Engine Optimization)?"*
  2. *"GEO vs. SEO vs. AEO — what's the difference?"*
  3. *"How do law firms get cited by ChatGPT?"*
  4. *"How AI answer engines pick which businesses to recommend"*
  5. *"The CITABLE framework, explained"*
  6. *"How to set up llms.txt for your firm"*
  7. *"AEO for accounting firms: 7 plays that actually work"*
  8. *"Why your firm isn't showing up in Perplexity"*
  9. *"GEO for Providence professional services"* (local SEO play)
  10. *"AI search has eaten Google referrals — here's the data"*

### 8.2 GEO/AEO Infrastructure (the proof of concept)

The website *itself* is the proof of concept. Every recommendation we sell is implemented on our own site:

- **Schema.org markup** — `Organization`, `LocalBusiness`, `Service`, `Person` (founder), `FAQPage`, `Article`, industry-specific (`LegalService`, `AccountingService`, etc.)
- **`llms.txt`** at root with curated content map for AI crawlers
- **Clean `sitemap.xml`** and `robots.txt`
- **FAQ block on every service & industry page** — citable, dated, attributed
- **Citable content blocks** — clear stats with dates and sources, easy for LLMs to lift
- **Author byline + bio** on every blog post (E-E-A-T signal)
- **Internal entity linking** — consistent name patterns for "GEO," "Providence," services, founder
- **Semantic HTML** — proper headings hierarchy, accessible
- **Performance** — Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO
- **Open Graph + Twitter cards** for every page
- **JSON-LD** preferred over Microdata
- **Citations on stat-bearing claims** — links to original sources, builds trust + provides triangulation for LLMs

### 8.3 Lead Capture

| Surface | Intent | Outcome |
|---|---|---|
| Free GEO Audit form | High (active buyer) | Audit deliverable → sales call |
| Contact page | High–medium | Direct inquiry |
| Industry-page CTA | Medium | Industry-specific lead magnet (checklist) |
| Blog post CTA | Low–medium | Newsletter |
| Footer newsletter | Low | Newsletter |

---

## 9. Build Sequence

| # | Step | Output | Estimate |
|---|---|---|---|
| 1 | Folder scaffold | `GEO/` tree + `README.md` | 5 min |
| 2 | Market research | 5 markdown docs in `research/` | 1–2 hrs |
| 3 | Business plan | 3 docs in `business-plan/` | 1 hr |
| 4 | Brand & messaging | 2 docs in `brand/` | 30 min |
| 5 | Website scaffold | Astro project + design system | 1 hr |
| 6 | Website content | All pages + 10 blog posts | 2 hrs |
| 7 | GEO/AEO infrastructure | Schema, llms.txt, sitemap, FAQs | 30 min |
| 8 | Deploy | Cloudflare Pages, domain config, validation | 30 min |

Total: ~7–8 hours of focused work, sequenced.

---

## 10. Risks & Open Questions

### Acknowledged risks (carried into business plan)

1. **Brand "GEO" is generic** — un-Googleable, unprotectable. Mitigated by URL/vertical/founder-name strategy. Re-evaluated at $250K revenue: do we acquire `getgeo.com`, rebrand, or stay?
2. **GEO/AEO terminology will drift** — copy is written to age. Outcome language ("get recommended by AI") leads acronyms.
3. **Local-to-national transition** — most regional agencies never make it. Mitigated by national brand from day 1, no city in domain, deliberate de-localization at Month 12.
4. **Prior-client case study permissions** — the 3 unpaid clients must consent (even anonymized). Plan B: founding-client offers with placeholder case studies until results land.
5. **Competitive saturation** — many GEO agencies launching. Mitigated by vertical specialization (most competitors are horizontal).
6. **AI platform changes** — Google/OpenAI may change citation behavior. Mitigated by service breadth (we serve any answer engine, not one).

### Open questions (to confirm before build)

- **Domain:** Lock `geostudio.io` or pursue acquisition of `getgeo.com`? Default: `geostudio.io`.
- **Prior client permissions:** Does Chris have permission (or the relationship to ask) to use the 3 prior builds as case studies?
- **Budget for tooling:** Astro + Cloudflare Pages = $0/mo. Domain ~$30/yr. Optional: GEO monitoring tool (Profound, Otterly) ~$50–$200/mo. Confirm willingness to subscribe.
- **Founder photo & bio:** Will Chris provide a professional headshot and full bio for the About page and author bylines?

---

## 11. Out of Scope (this spec)

- Logo design/illustration assets (handled in brand sub-step or outsourced)
- Legal entity formation (LLC, EIN, RI registration) — separate workstream
- CRM/billing/contract tooling selection — covered briefly in business plan, not implemented here
- Sales collateral beyond the website (decks, proposal templates) — Phase 2
- Paid advertising creative — Phase 2

---

## 12. Approval

Design approved by user (verbally) on 2026-04-25 with the strategic shift from "Providence-only" to "national brand, Providence beachhead."

Awaiting written-spec review before proceeding to implementation plan.
