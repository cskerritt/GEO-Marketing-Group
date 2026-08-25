# GEO Marketing Group

**A full-service marketing agency for professional-services firms.**

Helping law firms, CPAs, consultants, financial advisors, and A&E firms get cited and recommended by AI answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini).

> **Repository status (August 2026):** This repository is maintained as a
> development codebase, but it is not the current production source for
> [geomarketinggroup.org](https://geomarketinggroup.org). Production is served
> by Railway from a separate repository. Merging here does not deploy the live
> site; confirm the intended deployment source before any release work.

---

## Status

| | |
|---|---|
| **Phase complete** | 1 (Research) · 2 (Business plan & brand) · 3 (Website MVP) |
| **Status** | Development repository · local website and audit CLI are independently runnable |
| **Founded** | 2026 (in progress) |
| **HQ** | Providence, RI |
| **Service area** | RI/MA (Y1) → Northeast (Y2) → National (Y3) |
| **Domain** | `geomarketinggroup.org` |

## Repository Layout

```
GEO/
├── README.md                   ← you are here
├── docs/
│   ├── specs/                  ← Design spec (locked)
│   └── plans/                  ← Implementation plan (locked)
├── research/                   ← Phase 1: 5 research docs (DONE)
├── business-plan/              ← Phase 2: business plan, financial model, one-pager (DONE)
├── brand/                      ← Phase 2: brand guidelines, messaging (DONE)
├── sales-assets/               ← Proposals, scripts, and deliverable templates
├── audit-tool/                 ← Internal GEO/AEO/SEO audit CLI
└── website/                    ← Astro site and form functions
```

## Development setup

The repository pins Node.js in `.nvmrc`. Install that version with `nvm`, then
install and verify each package independently:

```bash
nvm install
nvm use

cd website
npm ci
npm run verify

cd ../audit-tool
npm ci
npm run check
```

The audit CLI's paid analysis requires a local `audit-tool/.env` containing an
OpenAI API key. Its dry-run smoke test does not make OpenAI calls. The website's
Pages Functions require matched Turnstile and Resend credentials for protected
live form delivery; see
[`website/README.md`](website/README.md) for local and hosting configuration.

Pull requests and pushes to `main` run the same checks in GitHub Actions.

## Source Documents (read in this order)

The specs and plans below are historical decision records and intentionally
retain implementation-era details. For current runtime and deployment setup,
use [`website/README.md`](website/README.md) and
[`docs/DEPLOY-NOTES.md`](docs/DEPLOY-NOTES.md).

1. **Spec** — [`docs/specs/2026-04-25-geo-agency-design.md`](docs/specs/2026-04-25-geo-agency-design.md)
2. **Implementation plan** — [`docs/plans/2026-04-25-geo-agency-implementation.md`](docs/plans/2026-04-25-geo-agency-implementation.md)
3. **Business plan** — [`business-plan/business-plan.md`](business-plan/business-plan.md)
4. **One-pager (executive summary)** — [`business-plan/one-pager.md`](business-plan/one-pager.md)
5. **Financial model** — [`business-plan/financial-model.md`](business-plan/financial-model.md)
6. **Brand guidelines** — [`brand/brand-guidelines.md`](brand/brand-guidelines.md)
7. **Messaging** — [`brand/messaging.md`](brand/messaging.md)
8. **Research** — `research/01-geo-aeo-landscape.md` through `05-icp-profile.md`

## What's Built

### Phase 1 — Market Research (5 documents, ~12,000 words)

- **`research/01-geo-aeo-landscape.md`** — State of GEO/AEO in 2026, ranking factors, citation mechanism, frameworks, tooling landscape
- **`research/02-competitor-analysis.md`** — 10 major competitors profiled, positioning whitespace map, 3 strategic openings
- **`research/03-providence-market.md`** — RI/SE-MA addressable market sizing, trade orgs, decision-maker profiles
- **`research/04-pricing-benchmarks.md`** — National pricing benchmarks, GEO's final pricing sheet
- **`research/05-icp-profile.md`** — 5 detailed personas (Law / CPA / Consulting / Financial / A&E)

### Phase 2 — Business Plan & Brand (5 documents)

- **`business-plan/business-plan.md`** — 11-section comprehensive business plan
- **`business-plan/financial-model.md`** — 36-month projections, 3 scenarios
- **`business-plan/one-pager.md`** — Single-page executive summary
- **`brand/brand-guidelines.md`** — Voice, palette, type, logo direction, methodology naming
- **`brand/messaging.md`** — Tagline, hero copy, industry value props, objection handlers, sales scripts, founder bio

### Phase 3 — Website (Astro + Tailwind)

- **76 generated pages** — core marketing pages, five service disciplines, five industry deep dives, New England state/city location pages, insights, form flows, and a branded 404
- **5 launch blog posts** — citation-rich, schema-marked articles covering GEO, AEO, SEO, AI search, law firms, and accounting firms
- **Reusable component library** — navigation, schema, FAQ, CTA, visual effects, and location-page primitives
- **Schema.org infrastructure** — Organization, LocalBusiness, Service, Person, FAQPage, Article, BreadcrumbList, plus industry-specific (LegalService, AccountingService, FinancialService) builders
- **`/llms.txt`** — AI crawler content map
- **`/robots.txt`** — Explicit allow for all major AI crawlers (GPTBot, PerplexityBot, Claude-Web, etc.)
- **Sitemap** — Auto-generated by `@astrojs/sitemap`
- **Audit and contact form functions** — Email delivery through Resend
- **Brand styling** — Navy/electric/violet/cyan palette, Space Grotesk + JetBrains Mono typography, fully responsive, accessible

See **[`website/README.md`](website/README.md)** for local dev and deployment instructions.

## Pricing (Y1)

| | |
|---|---|
| GEO Audit | $1,500 (audit credit applies on hybrid) |
| GEO Foundation (existing site) | $3,500 |
| GEO Build (new site) | $7,500 |
| GEO Build + Authority | $12,500 |
| Retainers | $1,500 / $2,500 / $4,500 per month |

Average client annual value: ~$44,000.

## 3-year Projections

| | Y1 (Base) | Y2 (Base) | Y3 (Base) |
|---|---|---|---|
| Revenue | $200K | $500K | $950K |
| MRR exit | $20K | $42K | $70K |
| Active retainers | 5 | 14 | 22 |
| Founder take-home | $116K | $190–220K | $300–380K |
| Headcount | 1 (founder) | + 1 contractor | + 2 contractors + PT ops |

Bootstrapped. No outside capital sought.

## Remaining release decisions

1. **Choose the authoritative repository.** The live Railway service currently
   deploys from a different repository. Reconcile the two codebases before
   reconnecting deployment automation.
2. **Choose and configure hosting.** This repository contains Cloudflare Pages
   Functions, but it is not currently connected to the production domain.
3. **Configure form delivery.** Verify the sending domain in Resend and add
   `AUDIT_TO_EMAIL`, `AUDIT_FROM_EMAIL`, and `RESEND_API_KEY` as encrypted
   environment values in every deployed environment.
4. **Confirm public business information.** Review phone number, inboxes, and
   social profiles in `website/src/lib/site.ts` before publishing this build.
5. **Configure production abuse protection.** Create matched Cloudflare
   Turnstile site/secret keys for each deployed environment and verify both
   forms reject missing, expired, replayed, or wrong-action tokens. Add
   host-level rate limits for `/api/audit` and `/api/contact` at whichever
   platform becomes the production source of truth.
6. **Confirm repository exposure and licensing.** This public repository
   includes business plans, financial projections, sales materials, and contact
   details, and it does not currently declare a software/content license.

### Launch outreach

- Submit RI Bar Association CLE proposal: *"AI Search and the Modern Law Firm: An Ethics-Compliant GEO Primer"*
- Pitch RISCPA member-benefit GEO Audit program
- Join Greater Providence Chamber of Commerce
- Send 30 personalized LinkedIn intros to known contacts in target verticals
- Take a baseline AI citation reading on `geomarketinggroup.org` (control reading before content compounds)

### Phase 3 follow-ups (visible in website/README.md)
- Build out the remaining launch blog posts
- Commission founder headshot
- Provision Cloudflare Turnstile keys for each deployed environment
- Subscribe to Otterly.AI Growth ($189/mo) for AI citation monitoring
- Reconcile this repository with the production deployment source

## Mission

Make professional services firms citable. When buyers ask AI *"who should I hire for X in Y?"* — our clients are the answer.
