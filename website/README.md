# GEO Website

The GEO/AEO-optimized website for GEO Marketing Group. Built with **Astro 7 + Tailwind CSS 4 + TypeScript**, configured for **Cloudflare Pages**, with lead-form delivery through **Resend**.

> This repository is not currently connected to the live
> `geomarketinggroup.org` Railway deployment. Merging its `main` branch does not
> publish the production site. Confirm the authoritative repository before
> connecting this project to a host.

The website itself is the proof-of-concept: every recommendation we sell is implemented on our own site.

---

## Requirements

- **Node.js 22.12 or newer** (`.nvmrc` pins the project to Node 22.23.2)
- **npm 10.9 or newer** (`package.json` records npm 10.9.8)

Use npm for dependency changes so `package-lock.json` remains the reproducible source of truth.

## Local development

```bash
cd website
nvm use                    # if nvm is installed
npm ci

# Static Astro development (Pages Functions are not available here)
npm run dev                 # http://localhost:4321

# Full Cloudflare Pages development, including protected form endpoints
cp .env.example .env
cp .dev.vars.example .dev.vars
# Put PUBLIC_TURNSTILE_SITE_KEY in .env (Astro build time), and put the
# matching TURNSTILE_SECRET_KEY plus Resend values in .dev.vars (runtime).
# Blank values are safe: the UI/endpoints fail closed without real keys.
npm run pages:dev           # http://localhost:8788

# Verification and production output
npm run check               # Astro diagnostics + Pages Functions TypeScript
npm run build               # static output in ./dist
npm run build:functions     # compile the Pages Functions Worker
npm run test:functions      # deterministic payload/Turnstile helper tests
npm run verify              # all checks and both builds
npm run preview             # static production preview only
```

To exercise the successful form path locally, use a real development widget
whose allowed hostnames include `localhost`. Cloudflare's published dummy
tokens omit the widget `action`, so this application's strict `audit`/`contact`
action check intentionally rejects them; they remain useful for testing the
failure path.

`npm run check:functions` regenerates `functions/types.d.ts` from `wrangler.jsonc` before type-checking. Rerun it whenever the Wrangler configuration or bindings change.

---

## Project structure

```
website/
├── .dev.vars.example           # Local Pages Function variable template; copy to .dev.vars
├── .env.example                # Astro public build-variable template; copy to .env
├── .nvmrc                      # Node 22.23.2
├── astro.config.mjs            # Astro + Tailwind + MDX + Sitemap configuration
├── tailwind.config.mjs         # Brand colors, fonts, type system
├── wrangler.jsonc              # Cloudflare Pages project/runtime configuration
├── package.json
├── tsconfig.json
├── functions/
│   ├── types.d.ts              # Generated Cloudflare runtime types
│   ├── tsconfig.json           # Pages Functions TypeScript project
│   ├── _shared/                # Bounded payload parsing, env, and Turnstile verification
│   └── api/
│       ├── audit.ts            # POST /api/audit
│       └── contact.ts          # POST /api/contact
├── public/
│   ├── llms.txt                # AI crawler content map (llmstxt.org spec)
│   ├── robots.txt              # Allow all crawlers, including AI
│   └── favicons, web manifest, and default OG images
└── src/
    ├── components/
    │   ├── Turnstile.astro     # Fail-closed Cloudflare Turnstile widget
    │   ├── Header.astro        # Site navigation with mobile menu
    │   ├── Footer.astro        # 4-column footer + utility links
    │   ├── FAQ.astro           # Accessible FAQ + auto FAQPage JSON-LD
    │   ├── CTA.astro           # Reusable call-to-action band
    │   ├── CitableStat.astro   # Big-number stat with cited source
    │   └── SchemaJsonLd.astro  # Renders <script type="application/ld+json">
    ├── content.config.ts        # Insights Content Layer schema + loader
    ├── content/
    │   └── insights/           # Markdown blog posts
    ├── layouts/
    │   └── Base.astro          # Shared <head>, header/footer, schema
    ├── lib/
    │   ├── site.ts             # Site constants (org info, nav, industries, services)
    │   └── schema.ts           # JSON-LD schema builders
    ├── pages/
    │   ├── index.astro         # Home
    │   ├── about.astro
    │   ├── process.astro
    │   ├── audit.astro         # Free audit form
    │   ├── audit/thanks.astro  # Audit submission thank-you
    │   ├── contact.astro
    │   ├── services/           # Services overview + detail pages
    │   ├── industries/         # 5 industry deep-dive pages + index
    │   ├── locations/          # New England state/city landing pages
    │   └── insights/           # Blog index + dynamic [...slug].astro
    └── styles/
        └── global.css          # Tailwind + brand base styles
```

---

## GEO/AEO infrastructure (the proof of concept)

Every recommendation we sell is implemented here:

- **Schema.org JSON-LD** — Organization + LocalBusiness on every page (via Base layout); Service / FAQPage / Person / Article / BreadcrumbList layered per page. See `src/lib/schema.ts`.
- **`llms.txt`** at root — curated content map for AI crawlers.
- **`robots.txt`** — explicit allow for GPTBot, ChatGPT-User, Google-Extended, PerplexityBot, Claude-Web, anthropic-ai, CCBot, cohere-ai, Bytespider, Applebot.
- **`sitemap-index.xml`** — auto-generated by `@astrojs/sitemap`.
- **FAQ blocks on every service and industry page** — schema-marked, rendered as accessible disclosures.
- **Citable stats** — numbers with sources, dated, attributable (`<CitableStat>` component).
- **Author bylines** — every blog post emits `Article` JSON-LD with author + datePublished + dateModified.
- **Internal entity linking** — consistent name patterns for "GEO," industries, services, founder.
- **Semantic HTML + Lighthouse** — target ≥95 across all metrics.
- **Performance** — Astro produces static HTML, no client-side framework overhead.

---

## Deployment to Cloudflare Pages

### One-time setup

1. **Cloudflare Pages → Create project → Connect to Git** and select this repository.
2. Deploy the `main` branch to production and enable preview deployments for pull requests.
3. **Build configuration:**
   - Framework preset: *Astro*
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `website`
   - Node version: detected from `.nvmrc` (`22.23.2`)
4. **Required environment variables** — set all five for both Production and Preview under *Settings → Environment variables*:
   - `PUBLIC_TURNSTILE_SITE_KEY` — public Turnstile site key, available during the Astro build
   - `TURNSTILE_SECRET_KEY` — matching secret used only by Pages Functions; store it as encrypted
   - `AUDIT_TO_EMAIL` — inbox that receives audit and contact submissions
   - `AUDIT_FROM_EMAIL` — sender on the domain verified in Resend, such as `hello@geomarketinggroup.org`
   - `RESEND_API_KEY` — Resend API key with permission to send from the verified domain
5. **Turnstile:** create a managed widget restricted to the production and preview hostnames. Both forms use Cloudflare's implicit widget and validate every token server-side against Siteverify, including the `audit`/`contact` action and `CF-Connecting-IP`. Keep each environment's site/secret key pair matched. See [Cloudflare's Turnstile setup](https://developers.cloudflare.com/turnstile/get-started/).
6. **Rate limiting:** add host-level request limits for `/api/audit` and `/api/contact`. The application already enforces Turnstile, a 32 KiB body cap, bounded fields, and strict validation; the active host should provide the additional per-client traffic limit.
7. **Resend:** add and verify `geomarketinggroup.org`, publish the SPF/DKIM records Resend supplies, and confirm the sender above is accepted. The Functions fail closed with HTTP 503 if any required email setting is missing; there is no unauthenticated fallback provider.
8. **Custom domain:** add `geomarketinggroup.org` and `www.geomarketinggroup.org`, then redirect `www` to the canonical apex domain.

`wrangler.jsonc` pins the project/runtime settings and declares the four required runtime secret names for generated types and local validation; secret values never belong in the file. The public site key remains an Astro build variable, so it intentionally lives in `.env`/the Pages build environment rather than `.dev.vars`.

### Subsequent deploys

If this repository is connected to Cloudflare Pages, pushes to `main`
auto-deploy and pull requests receive preview deployments.

### Validation after first deploy

- [ ] `https://geomarketinggroup.org/llms.txt` returns the AI-crawler content map
- [ ] `https://geomarketinggroup.org/robots.txt` returns the robot rules
- [ ] `https://geomarketinggroup.org/sitemap-index.xml` resolves and lists all pages
- [ ] Submit `/audit` and `/contact` and confirm both messages arrive through Resend
- [ ] Confirm both forms render Turnstile and reject missing, expired, replayed, or wrong-action tokens
- [ ] Confirm host-level rate limits cover both `/api/audit` and `/api/contact`
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) — paste home, an industry page, a blog post → no errors
- [ ] [Schema.org Validator](https://validator.schema.org/) — same pages, no errors
- [ ] [Lighthouse](https://pagespeed.web.dev/) — Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO 100
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Submit URL to [Common Crawl](https://commoncrawl.org/) — improves probability of LLM training inclusion
- [ ] Manual baseline test — ask ChatGPT, Claude, Perplexity, and Gemini "What's the best GEO agency for Providence law firms?" and record current results before SEO compounds

---

## Adding content

### Adding a new blog post

Create a Markdown file in `src/content/insights/`:

```markdown
---
title: "Your post title"
description: "Single-sentence description used for meta + AI summaries."
pubDate: 2026-04-25
author: "Chris Skerritt"
industry: "law"        # law | cpa | consulting | financial-advisors | ae | general
tags: ["GEO", "law"]
citations:
  - label: "Source title"
    url: "https://example.com/source"
---

Your content here. First 200 words must complete the answer to the primary query.

## Question-shaped header
...
```

The dynamic route `src/pages/insights/[...slug].astro` will pick it up automatically.

### Adding an industry or service page

Each industry/service page follows the same template. Copy `src/pages/industries/law-firms.astro` and adapt. The page should include:

- Hero with eyebrow + title + 2-sentence subhead
- "Why now" explanatory section
- Industry-specific playbook (5–7 plays)
- 6–10 industry-specific FAQ entries
- Service / industry-specific schema
- Bottom CTA

---

## Brand & copy reference

- **Brand guidelines:** `../brand/brand-guidelines.md`
- **Messaging:** `../brand/messaging.md`
- **Spec:** `../docs/specs/2026-04-25-geo-agency-design.md`
- **Implementation plan:** `../docs/plans/2026-04-25-geo-agency-implementation.md`

---

## Why these technology choices

- **Astro:** Static HTML output is the most LLM-crawl-friendly format. Excellent Core Web Vitals out of the box. Markdown-native authoring.
- **Tailwind:** Fast iteration on consistent design system without bespoke CSS sprawl.
- **TypeScript:** Catches schema/typing mistakes early, especially in the JSON-LD builders.
- **Cloudflare Pages:** Free hosting at our scale, generous Pages Functions quota for the audit form.
- **Resend:** Authenticated transactional delivery for audit and contact submissions.

---

## Open issues (Phase 3 follow-ups)

- [ ] Commission founder headshot (Chris) for About page
- [ ] Build out the remaining launch blog posts (the site currently ships with 5)
- [ ] Set up Cloudflare Web Analytics
- [ ] Subscribe to Otterly.AI Growth ($189/mo) for AI citation monitoring
- [ ] Submit baseline AI visibility test results to `research/` after Day 1
