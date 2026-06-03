# GEO Marketing Group — Full-Service Redesign Design Spec

**Date:** 2026-06-02
**Status:** Approved for planning
**Supersedes positioning in:** `docs/specs/2026-04-25-geo-agency-design.md` (narrow GEO/AEO niche)
**Project root:** `GEO/website/` (existing Astro + Tailwind MVP)

---

## 1. Summary

Evolve the existing **GEO** agency website (a 20-page Astro + Tailwind MVP focused
purely on Generative/Answer Engine Optimization) into **GEO Marketing Group** — a
**full-service marketing agency for professional-services firms**, with GEO, SEO,
web, and paid offerings carried at **equal weight**.

This is a rebrand + repositioning + scope expansion + design elevation of an
existing, working codebase — not a greenfield build. We keep the brand DNA, the
Astro/Tailwind/Cloudflare stack, the existing content, and the lead-capture
function; we broaden the message, add two service pages and a proof section, and
raise the whole site to a single polished, "Authority Editorial" design system.

## 2. Goals & Non-Goals

### Goals
- Rebrand "GEO" → "GEO Marketing Group" consistently (logo lockup, config, meta, schema, footer).
- Reposition from a pure GEO/AEO niche to **equal full-service** marketing.
- Add two new service pages: **SEO & Content**, **Paid Ads & Lead Gen**.
- Redesign the homepage and propagate a cohesive **Direction A — Authority Editorial** design system across all pages.
- Add a light, honest **Work / Results** section (process & methodology — no fabricated clients).
- Verify and extend lead capture to cover both Free Audit and Contact forms.
- Maintain strong SEO/GEO technical hygiene (JSON-LD, sitemap, OG images, FAQ schema).

### Non-Goals (deferred)
- Real client case studies / logos (no real results to show at launch).
- Blog/content expansion beyond the existing 5 insight articles.
- Paid analytics, CRM, or marketing-automation integrations.
- Any app-like / authenticated functionality (stays a static marketing site).

## 3. Positioning & Messaging

- **Name:** GEO Marketing Group ("GEO" is both the company name and the signature/origin capability).
- **Promise:** *"Be the firm AI recommends — and the one buyers find everywhere else."*
- **Tagline:** *"Full-service marketing for professional-services firms."*
- **Sub-tagline:** *"GEO, SEO, web, and paid — one accountable team that makes serious firms impossible to overlook, online and in AI."*
- **Audience:** owners, principals, and marketing directors at law, CPA, consulting, financial-advisory, and A&E firms.
- **Service area:** Providence, RI → Northeast (Boston) → national, consistent with existing locations pages.
- GEO/AEO messaging from `brand/messaging.md` is retained but reframed as one of several equal services rather than the sole category.

## 4. Information Architecture

Evolution of the existing 20 pages. **(exists)** = refresh in place; **(new)** = create; **(rename)** = retitle existing.

```
/                         Home — redesigned (Direction A)            (exists)
/services                 Services index — 5 equal services          (exists, reframed)
  /services/geo           GEO · Generative Engine Optimization        (exists)
  /services/aeo           AEO · Answer Engine Optimization            (exists)
  /services/seo-content   SEO & Content                               (new)
  /services/web           Web Design & Development                    (rename: /services/build)
  /services/paid          Paid Ads & Lead Gen                         (new)
/industries               Industries index                            (exists)
  /industries/law-firms ... financial-advisors, consulting, a-e       (exist, refreshed)
/work                     Work / Results — process & methodology      (new, light)
/insights                 Insights blog (5 existing articles)          (exists, polished)
  /insights/[slug]                                                     (exists)
/locations/providence-ri, /locations/boston-ma                        (exist)
/about                    About + founder                             (exists)
/process                  How we work                                 (exists)
/contact                  Contact form                                (exists)
/audit, /audit/thanks     Free Audit funnel                           (exists)
```

**Navigation (`NAV`):** Services · Industries · Work · Insights · About — with a persistent "Free Audit" CTA button.

**Redirect:** `/services/build` → `/services/web` (preserve any existing links/SEO).

## 5. Design System — Direction A (Authority Editorial)

Premium, restrained, professional-services-appropriate. Keep the existing brand
tokens; the work is consistency and polish, not new colors/fonts.

- **Palette (unchanged):** Navy `#0B132B`, Navy Deep `#050B1A`, Electric Blue `#2563EB`, Violet `#7C3AED`, Cyan `#22D3EE`, Fog `#E5E7EB`, Mist `#F8FAFC`, Slate `#475569`. Brand gradient `linear-gradient(120deg,#2563EB,#7C3AED 60%,#22D3EE)`.
- **Type (unchanged):** Space Grotesk (display/body), JetBrains Mono (eyebrows/labels).
- **Hero pattern:** white / mist background with subtle radial-gradient wash; mono eyebrow; large navy headline with a **single** gradient-filled keyword; slate subhead; navy pill primary CTA + outline secondary; a supporting stat block (gradient-topped numbers).
- **Gradient discipline:** reserved for stat numbers, top rules on emphasis sections, primary CTAs, and the logo mark — never large fills or body text (per `brand/brand-guidelines.md` §2).
- **Shared components to standardize:** `Header`, `Footer`, `CTA`, `FAQ`, `CitableStat`, `Logo`, `SchemaJsonLd`. Establish a consistent section rhythm (eyebrow → headline → body → proof/CTA) reused across all page types.
- **Accessibility:** preserve existing focus-visible rings, reduced-motion handling; maintain WCAG AA contrast (navy-on-white, white-on-navy).

## 6. Lead Capture & Forms

- Existing **Cloudflare Pages Function `/api/audit`** (MailChannels with optional Resend, honeypot spam protection) is the backend.
- Extend/reuse it so **both** the Free Audit form and the Contact form submit successfully and email the founder. Either share `/api/audit` with a `formType` field or add a sibling `/api/contact` — decide in planning.
- Env vars: `AUDIT_TO_EMAIL`, `AUDIT_FROM_EMAIL`, optional `RESEND_API_KEY` — update to the `geomarketinggroup.org` domain; document required Cloudflare dashboard config.
- Honeypot field retained on all forms; success → `/audit/thanks` (add a contact thank-you state).

## 7. SEO / GEO Technical Hygiene

- Update `src/lib/site.ts` as the single source of truth: `name`, `legalName`, `tagline`, `url` (`https://geomarketinggroup.org`), `description`, emails (`hello@`, `chris@` `@geomarketinggroup.org`), social handles.
- JSON-LD: `Organization` + `LocalBusiness` (Providence) + per-service `Service` + `FAQPage` on pages with FAQs.
- `@astrojs/sitemap` regenerated; canonical URLs on the new domain; per-page OG images; descriptive meta titles/descriptions reflecting full-service positioning.

## 8. Tech & Deployment

- **Stack:** Astro 5 + Tailwind 3 (unchanged). MDX content collections for insights.
- **Deploy:** Cloudflare Pages + Pages Functions. `npm run build` produces `dist/`.
- **Domain:** `geomarketinggroup.org` (canonical; founder to register/configure DNS).
- No new runtime dependencies anticipated beyond what's already in `package.json`.

## 9. Components / Units of Work (for planning)

1. **Config & brand rename** — `site.ts`, `Logo` lockup, footer, meta defaults, schema name → GEO Marketing Group / new domain.
2. **Homepage redesign** — Direction A hero + full-service section structure.
3. **Services restructure** — reframed index; new `seo-content` + `paid` pages; `build`→`web` rename + redirect.
4. **Industries refresh** — reposition copy to full-service framing.
5. **Work / Results page** — process & methodology, honest framing.
6. **Design-system pass** — standardize shared components + section rhythm across all pages.
7. **Forms** — verify/extend audit + contact submission paths and env wiring.
8. **SEO/schema pass** — JSON-LD, sitemap, OG, FAQ schema.
9. **Verification** — local `npm run build` + `astro preview`, link/route check, deploy config notes.

## 10. Risks & Open Items

- **Domain not yet registered** — `geomarketinggroup.org` must be registered and DNS-configured before production deploy; site builds fine with it as canonical meanwhile.
- **Equal-weight vs. signature tension** — name "GEO" is one service; copy must make clear GEO Marketing Group is full-service while GEO remains the namesake/differentiator.
- **Proof without clients** — Work/Results must stay honest (process & methodology); avoid implying real engagements that don't exist.
- **Form backend** — confirm MailChannels still viable / Resend key available for the new domain.

## 11. Success Criteria

- All routes build and render with the unified Direction A design system.
- Brand reads consistently as "GEO Marketing Group" everywhere; no stray bare "GEO Studio"/`geostudio.io` references.
- Five service pages present, equally weighted, each with correct schema.
- Both Free Audit and Contact forms submit and deliver email (verified locally/staging).
- `npm run build` passes clean; Lighthouse SEO/accessibility remain strong.
