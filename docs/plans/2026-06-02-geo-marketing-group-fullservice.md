# GEO Marketing Group — Full-Service Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand and reposition the existing GEO/AEO Astro site into "GEO Marketing Group" — a full-service marketing agency for professional-services firms — with five equal-weight services, a redesigned Authority-Editorial homepage, a Work/Results page, working contact + audit forms, and `geomarketinggroup.org` throughout.

**Architecture:** The site is a static Astro 5 + Tailwind 3 project deployed to Cloudflare Pages. Almost all brand/identity flows from a single source of truth (`src/lib/site.ts`) consumed by shared components (`Header`, `Footer`, `Logo`, `Base`, schema builders). Most of the rebrand is therefore data + a few component strings; the visible redesign work concentrates in `index.astro`, the services pages, and two new pages. Lead capture uses Cloudflare Pages Functions (`functions/api/*`).

**Tech Stack:** Astro 5, Tailwind 3, MDX content collections, Cloudflare Pages + Pages Functions, MailChannels/Resend email.

**Working directory for all commands:** `Documents/New project/GEO/website`

**Verification model (static site, no unit-test runner):** Each task verifies with one or more of: `grep` assertions on the changed files, `npx astro check` (typecheck), `npm run build` (must succeed), and — for the homepage — a Playwright visual check via the `example-skills:webapp-testing` skill. "Expected: FAIL/PASS" refers to these gates.

**Pricing note (owner decision):** New services SEO & Content and Paid Ads & Lead Gen ship **without** a hard price (the card renders a neutral "Explore →"). The owner should set real prices later; do not invent dollar figures.

**Reference spec:** `docs/specs/2026-06-02-geo-marketing-group-fullservice-design.md`

---

## Task 1: Rebrand the single source of truth (`site.ts`)

**Files:**
- Modify: `src/lib/site.ts` (SITE block + SERVICES array + NAV array)

- [ ] **Step 1: Baseline check — confirm old brand strings exist**

Run: `grep -n "geostudio.io\|name: 'GEO'\|GEO & AEO for" src/lib/site.ts`
Expected: matches found (old brand present).

- [ ] **Step 2: Replace the `SITE` object**

In `src/lib/site.ts`, replace the entire `export const SITE = {...} as const;` block with:

```ts
export const SITE = {
  name: 'GEO Marketing Group',
  shortName: 'GEO',
  legalName: 'GEO Marketing Group',
  tagline: 'Full-service marketing for professional-services firms.',
  url: 'https://geomarketinggroup.org',
  description:
    'GEO Marketing Group is a full-service marketing agency for professional-services firms — law, CPA, consulting, financial advisors, and A&E. We combine Generative Engine Optimization (GEO), SEO & content, web design, and paid media to make serious firms impossible to overlook, online and in AI.',
  founder: {
    name: 'Chris Skerritt',
    role: 'Founder',
    email: 'chris@geomarketinggroup.org',
    bioShort:
      'Chris Skerritt is the founder of GEO Marketing Group, a full-service marketing agency for professional-services firms in Providence, RI.',
  },
  address: {
    streetAddress: 'Providence, RI',
    addressLocality: 'Providence',
    addressRegion: 'RI',
    addressCountry: 'US',
    postalCode: '02903',
  },
  email: 'hello@geomarketinggroup.org',
  phone: '+1-401-555-0100',
  social: {
    linkedin: 'https://www.linkedin.com/company/geomarketinggroup',
    twitter: 'https://twitter.com/geomktgroup',
  },
} as const;
```

- [ ] **Step 3: Replace the `NAV` array** (swap Process → Work)

Replace the `export const NAV = [...] as const;` block with:

```ts
export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Work', href: '/work' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
] as const;
```

- [ ] **Step 4: Replace the `SERVICES` array + make price optional**

Replace the entire `export const SERVICES = [...] as const;` block with:

```ts
export const SERVICES = [
  {
    slug: 'geo',
    label: 'GEO',
    title: 'Generative Engine Optimization',
    description:
      'Get cited and recommended by ChatGPT, Claude, Perplexity, and Google AI Overviews.',
    price: 'From $1,500',
  },
  {
    slug: 'aeo',
    label: 'AEO',
    title: 'Answer Engine Optimization',
    description:
      'FAQ scaffolding, schema markup, and structured answers AI engines lift directly.',
    price: 'From $1,500',
  },
  {
    slug: 'seo-content',
    label: 'SEO',
    title: 'SEO & Content',
    description:
      'Rank for the searches that bring qualified clients — and build the content that earns the citations.',
  },
  {
    slug: 'web',
    label: 'Web',
    title: 'Web Design & Development',
    description:
      'Fast, credible, conversion-focused websites built on a GEO-ready foundation from day one.',
    price: 'From $7,500',
  },
  {
    slug: 'paid',
    label: 'Paid',
    title: 'Paid Ads & Lead Gen',
    description:
      'Targeted Google and LinkedIn campaigns that fill the pipeline with qualified, ready-to-talk prospects.',
  },
] as const;
```

Then change the `Service` type export so `price` is optional. Replace:

```ts
export type Service = (typeof SERVICES)[number];
```

with:

```ts
export type Service = {
  slug: string;
  label: string;
  title: string;
  description: string;
  price?: string;
};
```

- [ ] **Step 5: Verify typecheck passes**

Run: `npx astro check`
Expected: PASS (0 errors). If `Service` type errors appear in consumers, they are fixed in Tasks 5–7; re-run after those if needed.

- [ ] **Step 6: Verify new brand strings present, old ones gone (in this file)**

Run: `grep -n "geostudio.io\|name: 'GEO'," src/lib/site.ts`
Expected: no matches.
Run: `grep -n "GEO Marketing Group\|geomarketinggroup.org\|slug: 'seo-content'\|slug: 'paid'" src/lib/site.ts`
Expected: matches found.

- [ ] **Step 7: Commit**

```bash
git add src/lib/site.ts
git commit -m "rebrand: GEO Marketing Group config, full-service NAV + 5 services"
```

---

## Task 2: Update build config + crawler files to the new domain

**Files:**
- Modify: `astro.config.mjs:9` (the `site:` field)
- Modify: `public/robots.txt`
- Modify: `public/llms.txt` (full rewrite)

- [ ] **Step 1: Update `astro.config.mjs` site URL**

Replace `site: 'https://geostudio.io',` with `site: 'https://geomarketinggroup.org',`.

- [ ] **Step 2: Update `public/robots.txt`**

Replace the first comment line `# https://geostudio.io` with `# https://geomarketinggroup.org` and the final line `Sitemap: https://geostudio.io/sitemap-index.xml` with `Sitemap: https://geomarketinggroup.org/sitemap-index.xml`. Leave all `User-agent`/`Allow` rules unchanged.

- [ ] **Step 3: Rewrite `public/llms.txt`**

Replace the entire file contents with:

```
# GEO Marketing Group

> GEO Marketing Group is a full-service marketing agency for professional-services firms, based in Providence, Rhode Island. We help law firms, CPAs, consulting firms, financial advisors, and architecture & engineering firms win the modern buyer through Generative Engine Optimization (GEO), SEO & content, web design & development, and paid media — so they get found everywhere their clients search, including AI answer engines like ChatGPT, Claude, Perplexity, Google AI Overviews, and Gemini.

GEO Marketing Group serves five professional-services verticals: law firms, CPA & accounting practices, consulting firms, financial advisors / RIAs, and architecture & engineering (A&E) firms. Service area: Rhode Island and Massachusetts (Year 1), the Northeast US (Year 2), national (Year 3).

Founder: Chris Skerritt, based in Providence, RI. Reach: chris@geomarketinggroup.org.

## Services

- [GEO — Generative Engine Optimization](https://geomarketinggroup.org/services/geo): Optimize content, schema, and authority signals so AI engines cite and recommend your firm.
- [AEO — Answer Engine Optimization](https://geomarketinggroup.org/services/aeo): FAQ scaffolding, schema markup, and structured answers AI engines lift directly.
- [SEO & Content](https://geomarketinggroup.org/services/seo-content): Rank for the searches that bring qualified clients, backed by content that earns citations.
- [Web Design & Development](https://geomarketinggroup.org/services/web): Fast, credible, conversion-focused websites on a GEO-ready foundation. From $7,500.
- [Paid Ads & Lead Gen](https://geomarketinggroup.org/services/paid): Targeted Google and LinkedIn campaigns that fill the pipeline predictably.
- [Free GEO Audit](https://geomarketinggroup.org/audit): A no-obligation audit of your firm's visibility across AI answer engines.

## Industries

- [Law Firm Marketing](https://geomarketinggroup.org/industries/law-firms)
- [CPA & Accounting Marketing](https://geomarketinggroup.org/industries/cpa-firms)
- [Consulting Firm Marketing](https://geomarketinggroup.org/industries/consulting)
- [Financial Advisor & RIA Marketing](https://geomarketinggroup.org/industries/financial-advisors)
- [Architecture & Engineering Marketing](https://geomarketinggroup.org/industries/architecture-engineering)
```

- [ ] **Step 4: Verify no stray old domain in public/ or config**

Run: `grep -rn "geostudio.io" astro.config.mjs public/`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs public/robots.txt public/llms.txt
git commit -m "rebrand: point domain + crawler files at geomarketinggroup.org"
```

---

## Task 3: Update the Logo to read "GEO Marketing Group"

**Files:**
- Modify: `src/components/Logo.astro`

The wordmark currently hardcodes `GEO`. Add an optional "Marketing Group" suffix so the lockup reads as the full brand, keeping the mono tagline behavior.

- [ ] **Step 1: Baseline check**

Run: `grep -n "Generative&nbsp;Engine&nbsp;Optimization\|aria-label=\"GEO" src/components/Logo.astro`
Expected: matches found.

- [ ] **Step 2: Update the `aria-label`**

Replace `aria-label="GEO — Generative Engine Optimization"` with `aria-label="GEO Marketing Group"`.

- [ ] **Step 3: Replace the wordmark block**

Replace this block:

```astro
  {(variant === 'wordmark' || variant === 'lockup') && (
    <span class="flex flex-col leading-none">
      <span class={`font-display font-bold tracking-[-0.04em] ${wordColor}`} style={`font-size:${Math.round(size * 0.72)}px`}>
        GEO
      </span>
      {showTagline && (
        <span class={`mt-1 font-mono uppercase tracking-[0.22em] ${tagColor}`} style={`font-size:${Math.max(9, Math.round(size * 0.18))}px`}>
          Generative&nbsp;Engine&nbsp;Optimization
        </span>
      )}
    </span>
  )}
```

with:

```astro
  {(variant === 'wordmark' || variant === 'lockup') && (
    <span class="flex flex-col leading-none">
      <span class={`font-display font-bold tracking-[-0.04em] ${wordColor}`} style={`font-size:${Math.round(size * 0.72)}px`}>
        GEO<span class="text-electric">.</span>
        <span class={`font-medium tracking-[-0.01em] ${tagColor}`} style={`font-size:${Math.round(size * 0.34)}px`}>&nbsp;Marketing&nbsp;Group</span>
      </span>
      {showTagline && (
        <span class={`mt-1 font-mono uppercase tracking-[0.22em] ${tagColor}`} style={`font-size:${Math.max(9, Math.round(size * 0.18))}px`}>
          Full-Service&nbsp;Marketing
        </span>
      )}
    </span>
  )}
```

- [ ] **Step 4: Verify**

Run: `grep -n "Marketing&nbsp;Group\|Full-Service&nbsp;Marketing" src/components/Logo.astro`
Expected: matches found.
Run: `npx astro check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Logo.astro
git commit -m "rebrand: Logo reads GEO Marketing Group"
```

---

## Task 4: Generic CTA labels + Header/Footer link updates

The Header CTA hardcodes "Free GEO Audit →" (fine to keep — GEO is still our signature audit). The Footer links to `/process` and the `CTA` component default label is "Get a Free GEO Audit". Keep the audit naming, but ensure Footer's "Firm" column still lists Process (it does) and that nothing references removed routes.

**Files:**
- Modify: `src/components/Footer.astro` (no functional change required; verify only)
- Modify: `src/components/CTA.astro` (default secondary unaffected — verify only)

- [ ] **Step 1: Verify Footer references resolve**

Run: `grep -n "/process\|/services/\|/industries/\|/insights\|/contact" src/components/Footer.astro`
Expected: matches found; all are valid routes (Process page still exists; services map now yields the 5 new slugs).

- [ ] **Step 2: Confirm no broken nav after NAV change**

The `Header` maps `NAV` (now includes `/work`, created in Task 10) and a static `/audit` button. No change needed now; `/work` 404 until Task 10 — acceptable mid-plan.

Run: `grep -n "NAV\|/audit" src/components/Header.astro`
Expected: matches found.

- [ ] **Step 3: No commit** (verification-only task; nothing changed). Skip.

---

## Task 5: New service page — SEO & Content

**Files:**
- Create: `src/pages/services/seo-content.astro`

Model on the existing `services/build.astro` structure (hero → detail section → FAQ → CTA), using the shared components and `service` schema builder.

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../../layouts/Base.astro';
import FAQ from '../../components/FAQ.astro';
import CTA from '../../components/CTA.astro';
import { service as serviceSchema } from '../../lib/schema';

const faqs = [
  {
    q: 'How is your SEO different from a generic agency?',
    a: 'We build SEO and GEO together. The same structured, question-shaped, schema-rich content that ranks in Google is what AI answer engines lift and cite. You get traditional organic rankings and a head start on AI visibility from the same work — not two disconnected programs.',
  },
  {
    q: 'What does an SEO & Content engagement include?',
    a: 'Technical SEO audit and fixes, keyword and question research grounded in how your buyers actually search, an editorial calendar, and ongoing production of authority content — practice-area pages, guides, and FAQ hubs — all optimized for both search rankings and AI citation.',
  },
  {
    q: 'How long until we see results?',
    a: 'Technical fixes and on-page improvements can move rankings within weeks. Content-driven authority compounds over 3–6 months. We report on rankings, organic traffic, and AI citation share so you can see progress across both channels.',
  },
  {
    q: 'Do you write the content, or do we?',
    a: 'We do. Every piece is researched, drafted, and optimized by us, then sent to you for review. For regulated verticals (law, financial advisory) we build in the compliance review your rules require before anything publishes.',
  },
];
---

<Base
  title="SEO & Content"
  description="SEO and content built for professional-services firms — engineered to rank in Google and earn citations in AI answer engines from the same work."
  schema={serviceSchema({
    name: 'SEO & Content',
    description: 'Search engine optimization and authority content for professional-services firms, optimized for both Google rankings and AI citation.',
  })}
>
  <section class="section">
    <div class="container-prose">
      <p class="eyebrow">Service · SEO &amp; Content</p>
      <h1 class="font-display text-hero mt-2 mb-8">SEO &amp; Content</h1>
      <p class="text-2xl text-ink/85 leading-snug">
        Rank for the searches that bring qualified clients — and build the content that earns
        the citations. We optimize for Google and AI answer engines from a single program.
      </p>
    </div>
  </section>

  <section class="bg-cream-light border-y border-navy/10 section">
    <div class="container-prose prose prose-lg max-w-none">
      <h2>What's included</h2>
      <ul>
        <li>Technical SEO audit and remediation (Core Web Vitals, crawlability, indexation)</li>
        <li>Keyword and buyer-question research mapped to your practice areas</li>
        <li>On-page optimization of your highest-value pages</li>
        <li>An editorial calendar and ongoing authority-content production</li>
        <li>FAQ hubs and structured content engineered for AI citation (shared with GEO)</li>
        <li>Monthly reporting on rankings, organic traffic, and AI citation share</li>
      </ul>
      <h2>Why it pairs with GEO</h2>
      <p>
        Question-shaped, schema-rich content is what ranks in Google <em>and</em> what AI engines
        quote. Running SEO and GEO as one program means every article does double duty — no wasted
        motion, no contradictory advice from two vendors.
      </p>
    </div>
  </section>

  <FAQ items={faqs} heading="Frequently asked about SEO & Content." />

  <CTA
    heading="Want to rank — and get cited?"
    body="Start with a free audit. We'll show you where you stand in search and in AI."
    primaryLabel="Get a Free GEO Audit"
    secondaryLabel="See all services"
    secondaryHref="/services"
  />
</Base>
```

- [ ] **Step 2: Verify build renders the route**

Run: `npm run build`
Expected: PASS; output includes `/services/seo-content/index.html`. Confirm with:
`ls dist/services/seo-content/index.html`
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/seo-content.astro
git commit -m "feat: add SEO & Content service page"
```

---

## Task 6: New service page — Paid Ads & Lead Gen

**Files:**
- Create: `src/pages/services/paid.astro`

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../../layouts/Base.astro';
import FAQ from '../../components/FAQ.astro';
import CTA from '../../components/CTA.astro';
import { service as serviceSchema } from '../../lib/schema';

const faqs = [
  {
    q: 'Which platforms do you run ads on?',
    a: 'Primarily Google Search (high-intent buyers actively looking for your service) and LinkedIn (precise firmographic and title targeting for B2B professional services). We recommend the mix based on where your buyers actually decide — not a one-size template.',
  },
  {
    q: 'How do you keep paid spend efficient?',
    a: 'Tight intent-based keyword and audience targeting, conversion tracking wired to real leads (not just clicks), landing pages built to convert, and weekly optimization. We report on cost per qualified lead, not vanity metrics.',
  },
  {
    q: 'Do you build the landing pages too?',
    a: 'Yes. Paid traffic converts on focused, fast landing pages — which is exactly what our Web team builds. Ads and the pages they point to are designed together, so the message matches from click to conversion.',
  },
  {
    q: 'Is paid right for a professional-services firm?',
    a: 'Often, yes — especially to win high-value, high-intent searches while your organic and AI visibility compounds. We are candid when paid is not the right lever for your goals or margins, and will tell you so in the audit.',
  },
];
---

<Base
  title="Paid Ads & Lead Gen"
  description="Google and LinkedIn advertising for professional-services firms — targeted campaigns measured on qualified leads, with conversion-built landing pages."
  schema={serviceSchema({
    name: 'Paid Ads & Lead Gen',
    description: 'Paid search and social advertising for professional-services firms, measured on cost per qualified lead.',
  })}
>
  <section class="section">
    <div class="container-prose">
      <p class="eyebrow">Service · Paid Ads &amp; Lead Gen</p>
      <h1 class="font-display text-hero mt-2 mb-8">Paid Ads &amp; Lead Gen</h1>
      <p class="text-2xl text-ink/85 leading-snug">
        Targeted Google and LinkedIn campaigns that fill the pipeline with qualified,
        ready-to-talk prospects — measured on cost per lead, not clicks.
      </p>
    </div>
  </section>

  <section class="bg-cream-light border-y border-navy/10 section">
    <div class="container-prose prose prose-lg max-w-none">
      <h2>What's included</h2>
      <ul>
        <li>Channel strategy across Google Search and LinkedIn</li>
        <li>Intent-based keyword and firmographic audience targeting</li>
        <li>Conversion-built landing pages (with our Web team)</li>
        <li>Conversion tracking wired to real leads, not just form fills</li>
        <li>Weekly optimization and budget pacing</li>
        <li>Reporting on cost per qualified lead and pipeline contribution</li>
      </ul>
      <h2>Built to compound, not just spend</h2>
      <p>
        Paid wins the high-intent searches today while your SEO, content, and AI visibility build
        durable, lower-cost demand over time. We run paid as part of that whole — not in a silo.
      </p>
    </div>
  </section>

  <FAQ items={faqs} heading="Frequently asked about Paid Ads & Lead Gen." />

  <CTA
    heading="Ready to fill the pipeline?"
    body="Start with a free audit. We'll tell you whether paid is the right next lever — honestly."
    primaryLabel="Get a Free GEO Audit"
    secondaryLabel="See all services"
    secondaryHref="/services"
  />
</Base>
```

- [ ] **Step 2: Verify build renders the route**

Run: `npm run build && ls dist/services/paid/index.html`
Expected: PASS; file exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/paid.astro
git commit -m "feat: add Paid Ads & Lead Gen service page"
```

---

## Task 7: Rename "Build" → "Web" with a redirect

**Files:**
- Rename: `src/pages/services/build.astro` → `src/pages/services/web.astro`
- Create: `src/pages/services/build.astro` (redirect stub)

- [ ] **Step 1: Move the file**

Run: `git mv src/pages/services/build.astro src/pages/services/web.astro`

- [ ] **Step 2: Retitle the page header in `web.astro`**

In `src/pages/services/web.astro`, update the hero eyebrow and H1. Replace:

```astro
      <p class="eyebrow">Service · Build</p>
      <h1 class="font-display text-hero mt-2 mb-8">GEO-Native Website Build</h1>
```

with:

```astro
      <p class="eyebrow">Service · Web Design &amp; Development</p>
      <h1 class="font-display text-hero mt-2 mb-8">Web Design &amp; Development</h1>
```

Leave the rest (timeline, pricing tiers, FAQ, CTA) intact — it accurately describes the web build offering.

- [ ] **Step 3: Create the redirect stub at the old URL**

Create `src/pages/services/build.astro`:

```astro
---
// Permanent redirect: the Build service was renamed to Web Design & Development.
return Astro.redirect('/services/web', 301);
---
```

- [ ] **Step 4: Verify**

Run: `npm run build && ls dist/services/web/index.html`
Expected: PASS; file exists.
Run: `grep -rn "Service · Web Design" src/pages/services/web.astro`
Expected: match found.

- [ ] **Step 5: Commit**

```bash
git add src/pages/services/web.astro src/pages/services/build.astro
git commit -m "refactor: rename Build service to Web Design & Development (+301 redirect)"
```

---

## Task 8: Reposition the Services index for equal full-service

**Files:**
- Modify: `src/pages/services/index.astro`

Current copy says "Three services… productized… fixed price" and embeds GEO-specific hybrid pricing. Reframe to five equal services and make the card price conditional (new services have no price).

- [ ] **Step 1: Replace the file contents**

```astro
---
import Base from '../../layouts/Base.astro';
import CTA from '../../components/CTA.astro';
import { SERVICES } from '../../lib/site';
---

<Base
  title="Services"
  description="Full-service marketing for professional-services firms: GEO, AEO, SEO & Content, Web Design & Development, and Paid Ads & Lead Gen — one accountable team."
>
  <section class="section">
    <div class="container-prose">
      <p class="eyebrow">Services</p>
      <h1 class="font-display text-hero mt-2 mb-8">Five disciplines. One accountable team.</h1>
      <p class="text-2xl text-ink/85 leading-snug">
        Most firms juggle a separate vendor for every channel. We bring GEO, SEO, web, and paid
        under one roof — so your marketing pulls in the same direction, and one team owns the result.
      </p>
    </div>
  </section>

  <section class="bg-cream-light border-y border-navy/10">
    <div class="container-default py-20">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service) => (
          <a href={`/services/${service.slug}`} class="group block bg-white border border-navy/10 rounded-2xl p-8 transition-all hover:border-electric/40 hover:-translate-y-1 hover:shadow-glow-blue">
            <p class="eyebrow">{service.label}</p>
            <h2 class="font-display text-2xl mt-3 text-navy group-hover:text-electric transition-colors">
              {service.title}
            </h2>
            <p class="mt-4 text-ink/80 leading-relaxed">{service.description}</p>
            <p class="mt-8 font-mono text-sm text-electric inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              {service.price ?? 'Explore'}
              <span aria-hidden="true">→</span>
            </p>
          </a>
        ))}
      </div>

      <div class="mt-16 prose prose-lg max-w-prose mx-auto">
        <h2>Where most firms start.</h2>
        <p>
          The most common first step is a free GEO Audit — a clear read on where your firm stands
          in AI answer engines and traditional search. From there we scope the right mix: a faster,
          more credible website; an SEO and content engine; paid campaigns to win high-intent
          demand now; or a combination. No mystery scope, no channel silos.
        </p>
      </div>
    </div>
  </section>

  <CTA
    heading="Not sure where to start?"
    body="Start with a free GEO Audit. We'll tell you exactly where your firm stands — and what's worth doing first."
    primaryLabel="Get a Free GEO Audit"
  />
</Base>
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS.
Run: `grep -n "Five disciplines\|service.price ?? 'Explore'" src/pages/services/index.astro`
Expected: matches found.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/index.astro
git commit -m "content: reframe services index to five equal disciplines"
```

---

## Task 9: Redesign the homepage (Direction A, equal full-service)

**Files:**
- Modify: `src/pages/index.astro` (full replacement)

Authority-Editorial hero (navy headline + single gradient keyword), gradient-topped stat trio, five-service band, kept dark Industries section, founder section reworded to full-service, full-service FAQ. Reuses existing components and utility classes — no new CSS.

- [ ] **Step 1: Replace the file contents**

```astro
---
import Base from '../layouts/Base.astro';
import CTA from '../components/CTA.astro';
import FAQ from '../components/FAQ.astro';
import CitableStat from '../components/CitableStat.astro';
import { SERVICES, INDUSTRIES, SITE } from '../lib/site';

const homeFaqs = [
  {
    q: 'What does GEO Marketing Group do?',
    a: 'We are a full-service marketing agency for professional-services firms. We combine Generative Engine Optimization (GEO), SEO & content, web design & development, and paid media so your firm gets found everywhere modern buyers look — Google, AI answer engines like ChatGPT and Perplexity, and the channels in between — under one accountable team.',
  },
  {
    q: 'What is GEO (Generative Engine Optimization)?',
    a: 'GEO is the practice of optimizing your content, schema, and authority signals so AI answer engines — ChatGPT, Claude, Perplexity, Google AI Overviews, and Gemini — cite and recommend your firm when buyers ask questions in your industry. It is the AI-search counterpart to traditional SEO, and it is our signature capability.',
  },
  {
    q: 'Why hire one agency instead of several specialists?',
    a: 'Because your channels should reinforce each other. The structured content that earns AI citations is the same content that ranks in Google; the landing pages that convert paid traffic are built by the team that designed your site. One roof means no contradictory advice, no finger-pointing, and one team that owns the outcome.',
  },
  {
    q: 'Who do you work with?',
    a: 'Five professional-services verticals: law firms, CPA & accounting practices, consulting firms, financial advisors / RIAs, and architecture & engineering firms. We are based in Providence, Rhode Island and serve the Northeast US, with national reach as our authority grows.',
  },
  {
    q: 'How do we start?',
    a: 'With a free GEO Audit — a no-obligation read on your firm\'s visibility across AI answer engines and traditional search. From there we recommend the right mix of services and what to do first. No mystery scope.',
  },
];

const engines = ['ChatGPT', 'Claude', 'Perplexity', 'Google AI Overviews', 'Gemini', 'Copilot'];
---

<Base title={SITE.name}>
  <!-- HERO (Direction A — Authority Editorial) -->
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-mesh opacity-70 pointer-events-none" aria-hidden="true"></div>
    <div class="container-default relative pt-20 md:pt-28 pb-20 md:pb-24">
      <div class="grid lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-navy/10 backdrop-blur text-[11px] font-mono uppercase tracking-[0.22em] text-electric">
            <span class="w-1.5 h-1.5 rounded-full bg-gradient-brand animate-pulse"></span>
            Full-Service Marketing · Professional Services
          </span>
          <h1 class="font-display text-hero font-bold text-navy mt-6">
            Be the firm
            <span class="bg-gradient-brand bg-clip-text text-transparent">AI recommends.</span>
          </h1>
          <p class="mt-7 text-xl md:text-2xl text-ink/75 max-w-2xl leading-snug">
            GEO, SEO, web &amp; paid — one accountable team that makes serious professional-services
            firms impossible to overlook, online and in AI.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="/audit" class="btn-primary">Get a free GEO audit →</a>
            <a href="/work" class="btn-secondary">See how we work</a>
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div class="border-t-[3px] border-transparent [border-image:linear-gradient(120deg,#2563EB,#7C3AED,#22D3EE)_1] pt-5">
            <div class="stat-num text-5xl md:text-6xl leading-none">37%</div>
            <p class="mt-3 text-base text-ink/80 max-w-xs">of B2B research now starts in AI search — not Google.</p>
          </div>
          <div class="border-t border-navy/10 pt-5">
            <div class="font-display font-bold tracking-tight text-navy text-5xl md:text-6xl leading-none">5</div>
            <p class="mt-3 text-base text-ink/80 max-w-xs">disciplines, one accountable team.</p>
          </div>
          <div class="border-t border-navy/10 pt-5">
            <div class="font-display font-bold tracking-tight text-navy text-4xl md:text-5xl leading-none">RI&nbsp;→&nbsp;NE</div>
            <p class="mt-3 text-base text-ink/80 max-w-xs">Providence-based, serving the Northeast.</p>
          </div>
        </div>
      </div>

      <!-- Engines strip -->
      <div class="mt-20 md:mt-24 border-t border-navy/10 pt-8">
        <p class="font-mono text-[10px] uppercase tracking-[0.28em] text-navy/45 mb-5">
          We measure your visibility in
        </p>
        <div class="flex flex-wrap items-center gap-x-10 gap-y-4">
          {engines.map((e) => (
            <span class="font-display font-semibold text-lg text-navy/55 hover:text-navy transition-colors">{e}</span>
          ))}
        </div>
      </div>
    </div>
  </section>

  <!-- WHY NOW / STATS -->
  <section class="section relative overflow-hidden bg-cream-light border-y border-navy/10">
    <div class="container-default">
      <div class="max-w-3xl">
        <p class="eyebrow">Why now</p>
        <h2 class="font-display text-display-lg mt-3 mb-6">
          Strong SEO is no longer enough.
        </h2>
        <p class="text-lg text-ink/75 leading-relaxed">
          Buyers who used to find you through Google referrals are now asking ChatGPT, Claude, and
          Perplexity — and the firms those engines recommend are winning the shortlist. The fix is
          marketing that works across search and AI at once.
        </p>
      </div>

      <div class="mt-16 grid md:grid-cols-3 gap-12">
        <CitableStat
          value="73%"
          label="of B2B buyers now use AI tools in their research process."
          source="Bain & Company analysis, 2025"
          sourceUrl="https://finance.yahoo.com/sectors/technology/articles/73-b2b-buyers-ai-tools-231200431.html"
        />
        <CitableStat
          value="14.2%"
          label="conversion rate from AI search traffic. Google's organic converts at 2.8%."
          source="Superlines AI Search Report, 2026"
          sourceUrl="https://www.superlines.io/articles/ai-search-statistics/"
        />
        <CitableStat
          value="11%"
          label="of domains are cited by both ChatGPT and Perplexity. The two engines almost never overlap."
          source="upGrowth Citation Algorithm Analysis, 2026"
          sourceUrl="https://upgrowth.in/citation-algorithm-chatgpt-perplexity-gemini-ai-overviews-2026/"
        />
      </div>
    </div>
  </section>

  <!-- SERVICES (5, equal weight) -->
  <section class="section">
    <div class="container-default">
      <p class="eyebrow">What we do</p>
      <h2 class="font-display text-display-lg mt-3 mb-12 max-w-2xl">
        Five disciplines. One accountable team.
      </h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, i) => (
          <a href={`/services/${service.slug}`} class="group relative block rounded-2xl bg-white border border-navy/10 p-8 transition-all hover:border-electric/40 hover:-translate-y-1 hover:shadow-glow-blue overflow-hidden">
            <div class="absolute -inset-px rounded-2xl bg-gradient-brand opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none"></div>
            <div class="relative">
              <p class="eyebrow">{(i + 1).toString().padStart(2, '0')} · {service.label}</p>
              <h3 class="font-display text-2xl mt-3 text-navy group-hover:text-electric transition-colors">
                {service.title}
              </h3>
              <p class="mt-3 text-ink/75 leading-relaxed">{service.description}</p>
              <p class="mt-6 font-mono text-sm text-electric inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                {service.price ?? 'Explore'}
                <span aria-hidden="true">→</span>
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>

  <!-- INDUSTRIES (kept, dark) -->
  <section class="section relative overflow-hidden bg-navy-deep text-white">
    <div class="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" aria-hidden="true"></div>
    <div class="container-default relative">
      <p class="eyebrow !text-cyan">Industries we serve, deeply</p>
      <h2 class="font-display text-display-lg mt-3 mb-4 text-white max-w-3xl">
        We pick five verticals and own them.
      </h2>
      <p class="text-lg text-white/70 max-w-2xl mb-12 leading-relaxed">
        Most agencies serve everyone. We don't. The deeper we go in your industry, the sharper
        every campaign — and the more citable your firm becomes.
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRIES.map((industry) => (
          <a href={`/industries/${industry.slug}`} class="group relative block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-cyan/40 hover:bg-white/[0.06]">
            <h3 class="font-display text-xl text-white group-hover:text-cyan transition-colors">
              {industry.title}
            </h3>
            <p class="mt-3 text-sm text-white/65 leading-relaxed">{industry.description}</p>
            <p class="mt-5 text-xs font-mono text-cyan/80 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more <span aria-hidden="true">→</span>
            </p>
          </a>
        ))}
      </div>
    </div>
  </section>

  <!-- FOUNDER / PROVIDENCE -->
  <section class="section">
    <div class="container-default grid md:grid-cols-2 gap-12 items-start">
      <div>
        <p class="eyebrow">Providence-rooted</p>
        <h2 class="font-display text-display-lg mt-3 mb-6">
          Founded in Providence. Built for the Northeast. Designed to scale.
        </h2>
        <p class="text-lg text-ink/75 leading-relaxed mb-4">
          We build long relationships, not transactions. In Year 1, most of our clients are within
          driving distance — firms that want a marketing partner who picks up the phone.
        </p>
        <p class="text-lg text-ink/75 leading-relaxed">
          As our content authority compounds, our reach goes national. But the firm's gravity
          stays here.
        </p>
      </div>
      <div class="relative rounded-2xl bg-cream-light border border-navy/10 p-8 overflow-hidden">
        <span class="absolute left-0 top-8 bottom-8 w-1 bg-gradient-brand rounded-r-full" aria-hidden="true"></span>
        <p class="eyebrow mb-3">Founder</p>
        <h3 class="font-display text-2xl text-navy mb-3">Chris Skerritt</h3>
        <p class="text-ink/80 leading-relaxed">
          Chris founded GEO Marketing Group after years building AI-search-ready websites for B2B
          clients who specifically wanted ChatGPT and Perplexity to recommend them. GEO Marketing
          Group brings that edge together with the full marketing stack professional-services firms
          actually need.
        </p>
        <p class="mt-5">
          <a href="/about" class="text-electric hover:text-violet underline underline-offset-4 transition-colors">
            More about Chris →
          </a>
        </p>
      </div>
    </div>
  </section>

  <FAQ items={homeFaqs} eyebrow="Common questions" heading="Things firms ask before they hire us." />

  <CTA
    heading="Ready to be the answer when buyers — and AI — get asked?"
    body="Start with a free GEO Audit. We'll show you exactly where your firm stands, and what's worth doing first."
    secondaryLabel="See how we work"
    secondaryHref="/work"
  />
</Base>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Visual check (Playwright)**

Use the `example-skills:webapp-testing` skill to start `npm run dev`, navigate to `http://localhost:4321/`, and screenshot the hero + services band. Confirm: navy headline with gradient "AI recommends." keyword, stat trio with gradient-topped 37%, five service cards, dark industries section. Adjust spacing only if visibly broken.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redesign homepage — Direction A, equal full-service positioning"
```

---

## Task 10: Add the Work / Results page (process & methodology)

**Files:**
- Create: `src/pages/work.astro`

Honest, process-driven proof — no fabricated clients or logos. Reuses `CTA` and existing utility classes.

- [ ] **Step 1: Create the page**

```astro
---
import Base from '../layouts/Base.astro';
import CTA from '../components/CTA.astro';

const steps = [
  { k: '01', name: 'Audit & baseline', desc: 'We measure your current visibility across AI answer engines and traditional search, map competitors, and find the gaps worth closing first.' },
  { k: '02', name: 'Strategy & scope', desc: 'A prioritized plan across GEO, SEO, web, and paid — sequenced by impact and effort, with clear deliverables and no mystery scope.' },
  { k: '03', name: 'Build & publish', desc: 'We execute: structured citation-ready content, technical and on-page SEO, conversion-built pages, and targeted campaigns.' },
  { k: '04', name: 'Measure & iterate', desc: 'Monthly reporting on citations, rankings, traffic, and qualified leads — then we double down on what moves the needle.' },
];

const principles = [
  { name: 'One team, one outcome', desc: 'Every channel is run by the same team and reinforces the others. No silos, no finger-pointing.' },
  { name: 'Citation-ready by default', desc: 'The content that ranks in Google is the content AI engines quote. We build for both from the start.' },
  { name: 'Measured on leads, not clicks', desc: 'We report on qualified pipeline and cost per lead — the numbers that actually matter to a firm.' },
  { name: 'Honest about fit', desc: 'If a channel is not right for your goals or margins, we say so. We would rather keep a client than sell a service.' },
];
---

<Base
  title="Work & Results"
  description="How GEO Marketing Group works: a proven audit-to-iterate methodology across GEO, SEO, web, and paid for professional-services firms."
>
  <section class="section">
    <div class="container-prose">
      <p class="eyebrow">Work &amp; Results</p>
      <h1 class="font-display text-hero mt-2 mb-8">How we get firms found.</h1>
      <p class="text-2xl text-ink/85 leading-snug">
        We're a new firm with a clear method — built from years of getting professional-services
        clients cited and recommended. Here's exactly how we work, and how we'll prove it on your numbers.
      </p>
    </div>
  </section>

  <section class="bg-cream-light border-y border-navy/10 section">
    <div class="container-default">
      <p class="eyebrow">The engagement</p>
      <h2 class="font-display text-display-md mt-3 mb-12">A four-phase method.</h2>
      <ol class="grid md:grid-cols-2 gap-8">
        {steps.map((s) => (
          <li class="relative rounded-2xl bg-white border border-navy/10 p-8">
            <span class="stat-num text-3xl">{s.k}</span>
            <h3 class="font-display text-xl text-navy mt-3">{s.name}</h3>
            <p class="mt-2 text-ink/75 leading-relaxed">{s.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="container-default">
      <p class="eyebrow">How we work</p>
      <h2 class="font-display text-display-md mt-3 mb-12 max-w-2xl">Principles we don't bend on.</h2>
      <div class="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {principles.map((p) => (
          <div class="flex gap-5">
            <span class="flex-shrink-0 rule-brass mt-3"></span>
            <div>
              <h3 class="font-display text-xl text-navy">{p.name}</h3>
              <p class="mt-2 text-ink/75 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p class="mt-14 text-base text-slate italic max-w-prose">
        We're transparent about being early: rather than show borrowed logos or invented numbers,
        we show our method — and we'll set measurable baselines with you from day one, so the
        results are yours and real.
      </p>
    </div>
  </section>

  <CTA
    heading="See the method on your own numbers."
    body="A free GEO Audit is the first phase — no obligation, real findings."
    primaryLabel="Get a Free GEO Audit"
    secondaryLabel="Explore services"
    secondaryHref="/services"
  />
</Base>
```

- [ ] **Step 2: Verify build + route**

Run: `npm run build && ls dist/work/index.html`
Expected: PASS; file exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work.astro
git commit -m "feat: add Work & Results page (process & methodology)"
```

---

## Task 11: Add a working Contact form + `/api/contact` function

**Files:**
- Create: `functions/api/contact.ts`
- Create: `src/pages/contact/thanks.astro`
- Modify: `src/pages/contact.astro` (add a real form above the existing email cards)

- [ ] **Step 1: Create the Cloudflare Pages Function**

Create `functions/api/contact.ts` (modeled on `functions/api/audit.ts`, simpler payload):

```ts
/**
 * Cloudflare Pages Function: /api/contact
 *
 * Receives the general contact form POST, validates, and emails it to the
 * founder via MailChannels (default) or Resend (if RESEND_API_KEY set).
 * Spam protected by honeypot field. Mirrors functions/api/audit.ts.
 *
 * Env vars (Cloudflare Pages dashboard):
 *   AUDIT_TO_EMAIL    — destination address
 *   AUDIT_FROM_EMAIL  — verified sender address
 *   RESEND_API_KEY    — optional
 */

interface Env {
  AUDIT_TO_EMAIL?: string;
  AUDIT_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  firm?: string;
  message: string;
  hp_field?: string;
}

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(p: ContactPayload): string {
  const safe = (s: string | undefined) => htmlEscape(s ?? '');
  return `
    <h1>New contact message</h1>
    <p><strong>Name:</strong> ${safe(p.name)}<br>
       <strong>Email:</strong> ${safe(p.email)}<br>
       <strong>Firm:</strong> ${safe(p.firm)}</p>
    <h2>Message</h2>
    <p>${safe(p.message).replace(/\n/g, '<br>')}</p>
  `;
}

async function sendViaMailChannels(env: Env, p: ContactPayload): Promise<Response> {
  const body = {
    personalizations: [{ to: [{ email: env.AUDIT_TO_EMAIL! }] }],
    from: { email: env.AUDIT_FROM_EMAIL!, name: 'GEO Marketing Group — Contact Form' },
    reply_to: { email: p.email, name: p.name },
    subject: `[Contact] ${p.name}${p.firm ? ' — ' + p.firm : ''}`,
    content: [{ type: 'text/html', value: buildEmailHtml(p) }],
  };
  return await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function sendViaResend(env: Env, p: ContactPayload): Promise<Response> {
  return await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY!}`,
    },
    body: JSON.stringify({
      from: env.AUDIT_FROM_EMAIL!,
      to: [env.AUDIT_TO_EMAIL!],
      reply_to: p.email,
      subject: `[Contact] ${p.name}${p.firm ? ' — ' + p.firm : ''}`,
      html: buildEmailHtml(p),
    }),
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ContactPayload;
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const fd = await request.formData();
      payload = {
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        firm: String(fd.get('firm') ?? ''),
        message: String(fd.get('message') ?? ''),
        hp_field: String(fd.get('hp_field') ?? ''),
      };
    }
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  if (payload.hp_field) {
    return Response.redirect(new URL('/contact/thanks', request.url).toString(), 303);
  }
  if (!payload.name || !payload.email || !payload.message) {
    return new Response('Missing required fields', { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return new Response('Invalid email', { status: 400 });
  }
  if (!env.AUDIT_TO_EMAIL || !env.AUDIT_FROM_EMAIL) {
    return new Response('Server misconfigured: missing email env vars', { status: 500 });
  }

  const res = env.RESEND_API_KEY ? await sendViaResend(env, payload) : await sendViaMailChannels(env, payload);
  if (!res.ok) {
    console.error('Contact email send failed', res.status, await res.text());
    return new Response('Failed to deliver message. Please email us directly.', { status: 502 });
  }
  return Response.redirect(new URL('/contact/thanks', request.url).toString(), 303);
};
```

- [ ] **Step 2: Create the thank-you page**

Create `src/pages/contact/thanks.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
---

<Base title="Message received" description="Thanks — we received your message and will reply within one business day." noIndex>
  <section class="section">
    <div class="container-prose text-center">
      <p class="eyebrow">Message received</p>
      <h1 class="font-display text-hero mt-2 mb-6">Thanks — we'll be in touch.</h1>
      <p class="text-xl text-ink/80 leading-relaxed mb-10">
        We received your message and reply within one business day. In the meantime, you're
        welcome to request a free GEO Audit.
      </p>
      <a href="/audit" class="btn-primary">Get a free GEO audit →</a>
    </div>
  </section>
</Base>
```

- [ ] **Step 3: Add the form to `contact.astro`**

In `src/pages/contact.astro`, insert the following block immediately after the closing `</p>` of the H1 line and before `<div class="space-y-12 mt-12">`. (Locate `<h1 class="font-display text-hero mt-2 mb-8">Three ways to reach us.</h1>` and add the form right under it.)

```astro
      <form
        method="POST"
        action="/api/contact"
        class="bg-cream-light border border-navy/10 rounded-2xl p-8 md:p-10 space-y-6 mt-4"
      >
        <h2 class="font-display text-display-md">Send us a message.</h2>
        <input type="text" name="hp_field" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
        <div class="grid md:grid-cols-2 gap-6">
          <label class="block">
            <span class="font-mono text-xs uppercase tracking-wider text-navy">Your name</span>
            <input type="text" name="name" required autocomplete="name"
              class="mt-2 w-full px-4 py-3 bg-white border border-navy/20 focus:border-electric focus:outline-none rounded-sm" />
          </label>
          <label class="block">
            <span class="font-mono text-xs uppercase tracking-wider text-navy">Email</span>
            <input type="email" name="email" required autocomplete="email"
              class="mt-2 w-full px-4 py-3 bg-white border border-navy/20 focus:border-electric focus:outline-none rounded-sm" />
          </label>
        </div>
        <label class="block">
          <span class="font-mono text-xs uppercase tracking-wider text-navy">Firm (optional)</span>
          <input type="text" name="firm" autocomplete="organization"
            class="mt-2 w-full px-4 py-3 bg-white border border-navy/20 focus:border-electric focus:outline-none rounded-sm" />
        </label>
        <label class="block">
          <span class="font-mono text-xs uppercase tracking-wider text-navy">Message</span>
          <textarea name="message" rows="5" required
            class="mt-2 w-full px-4 py-3 bg-white border border-navy/20 focus:border-electric focus:outline-none rounded-sm"></textarea>
        </label>
        <button type="submit" class="btn-primary w-full justify-center">Send message →</button>
        <p class="text-xs text-slate text-center">We respond within 1 business day. We never add you to a marketing list.</p>
      </form>
```

- [ ] **Step 4: Verify build + routes**

Run: `npm run build && ls dist/contact/thanks/index.html`
Expected: PASS; file exists.
Run: `grep -n "action=\"/api/contact\"" src/pages/contact.astro`
Expected: match found.

- [ ] **Step 5: Local form smoke test (optional but recommended)**

If `wrangler` is available, run `npx wrangler pages dev dist` and POST a test payload:
`curl -i -X POST localhost:8788/api/contact -d "name=Test&email=t@example.com&message=hi"`
Expected: `HTTP/1.1 500` with "missing email env vars" (proves the function runs and validation passes; email send needs the dashboard env vars). If wrangler is unavailable, skip — the build proves compilation.

- [ ] **Step 6: Commit**

```bash
git add functions/api/contact.ts src/pages/contact/thanks.astro src/pages/contact.astro
git commit -m "feat: add working contact form + /api/contact function"
```

---

## Task 12: Reframe industry pages to full-service (light touch)

**Files:**
- Modify: `src/lib/site.ts` (INDUSTRIES titles/descriptions)
- Modify: each of `src/pages/industries/{law-firms,cpa-firms,consulting,financial-advisors,architecture-engineering}.astro` (hero eyebrow + H1 + lead only)
- Modify: `src/pages/industries/index.astro` (intro copy only)

Goal: industry pages read as full-service marketing for that vertical, with GEO as the signature — without rewriting the deep GEO body content (deferred). Only the data labels and each page's hero change.

- [ ] **Step 1: Update INDUSTRIES titles/descriptions in `site.ts`**

Replace the five `title:`/`description:` pairs in the `INDUSTRIES` array as follows (keep `slug`, `label`, `schemaType` unchanged):

- `law-firms`: title `'Marketing for Law Firms'`, description `'Win the clients who ask AI and Google for a firm like yours — bar-rule-compliant GEO, SEO, web, and paid.'`
- `cpa-firms`: title `'Marketing for CPA & Accounting Firms'`, description `'Turn your expertise into demand: citation-ready content, search rankings, and campaigns that reach the right businesses.'`
- `consulting`: title `'Marketing for Consulting Firms'`, description `'Make your frameworks and case studies findable — in AI answers, in search, and in front of the buyers you want.'`
- `financial-advisors`: title `'Marketing for Financial Advisors & RIAs'`, description `'Compliance-friendly marketing that grows AUM — without violating SEC marketing rules.'`
- `architecture-engineering`: title `'Marketing for Architecture & Engineering Firms'`, description `'Win the RFPs you weren\'t invited to. Project work becomes citable, searchable, pipeline-building content.'`

- [ ] **Step 2: Update each industry page hero**

For each of the five files in `src/pages/industries/`, open it, locate the first `<section class="section">` hero (eyebrow `<p class="eyebrow">…</p>`, an `<h1>`, and a lead `<p>`), and replace the eyebrow + H1 with full-service framing while keeping the page's existing body sections. Use this exact mapping for the eyebrow and H1:

- `law-firms.astro`: eyebrow `Industry · Law Firms`, H1 `Marketing for Law Firms`
- `cpa-firms.astro`: eyebrow `Industry · CPA & Accounting`, H1 `Marketing for CPA & Accounting Firms`
- `consulting.astro`: eyebrow `Industry · Consulting`, H1 `Marketing for Consulting Firms`
- `financial-advisors.astro`: eyebrow `Industry · Financial Advisors`, H1 `Marketing for Financial Advisors & RIAs`
- `architecture-engineering.astro`: eyebrow `Industry · Architecture & Engineering`, H1 `Marketing for Architecture & Engineering Firms`

Leave each page's existing lead paragraph and body as-is if it already reads sensibly under the new H1; only adjust the lead's opening sentence if it explicitly says the firm does "only GEO." (GEO-focused body content is acceptable — GEO is a real service.)

- [ ] **Step 3: Update `industries/index.astro` intro**

Open `src/pages/industries/index.astro`. Update the hero H1 and lead paragraph to full-service framing, e.g. H1 `We pick five verticals and own them.` and a lead noting we bring GEO, SEO, web, and paid to each. Keep the existing grid that maps `INDUSTRIES`.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: PASS.
Run: `grep -rn "Marketing for Law Firms\|Marketing for CPA" src/lib/site.ts src/pages/industries/`
Expected: matches in both data and pages.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/pages/industries/
git commit -m "content: reframe industry pages to full-service marketing"
```

---

## Task 13: Site-wide stray-reference + design-system sweep

**Files:**
- Audit across `src/` and `public/` (read + targeted edits)

- [ ] **Step 1: Hunt remaining old-brand strings**

Run: `grep -rn "geostudio\|GEO Studio\|Generative Engine Optimization agency\|productized" src/ public/ --include=*.astro --include=*.ts --include=*.txt --include=*.md`
Expected after edits: review each hit. Fix any that present the firm as GEO-only or use the old domain/name. Acceptable to keep: GEO defined as a service, the GEO Audit product name, GEO methodology references in service/insight bodies.

- [ ] **Step 2: Fix any flagged hits**

For each problematic hit, edit to full-service framing or the new domain/name. (No code shown — these are localized string fixes discovered at runtime.) Re-run the grep until only acceptable hits remain.

- [ ] **Step 3: Verify the audit/about/process pages still cohere**

Read `src/pages/about.astro` and `src/pages/process.astro`. Confirm they don't claim "we only do GEO." If they do, soften the framing sentence to position GEO as the signature within full-service. Make minimal edits.

- [ ] **Step 4: Typecheck + build**

Run: `npx astro check && npm run build`
Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "content: full-service framing sweep + remove stray old-brand references"
```

---

## Task 14: Final verification + deployment notes

**Files:**
- Create: `docs/DEPLOY-NOTES.md`

- [ ] **Step 1: Full clean build**

Run: `rm -rf dist && npm run build`
Expected: PASS, no warnings about missing routes.

- [ ] **Step 2: Route inventory check**

Run: `find dist -name index.html | sort`
Expected: includes `dist/index.html`, `dist/work/index.html`, `dist/services/{geo,aeo,seo-content,web,paid}/index.html`, `dist/services/build/index.html` (redirect), `dist/contact/thanks/index.html`, all five industries, both locations, insights + 5 articles, about, process, audit, audit/thanks.

- [ ] **Step 3: Sitemap + canonical spot check**

Run: `grep -o "https://geomarketinggroup.org[^<]*" dist/sitemap-0.xml | head`
Expected: URLs on the new domain.
Run: `grep -rn "geostudio.io" dist/ | head`
Expected: no matches.

- [ ] **Step 4: Homepage visual confirmation**

Use `example-skills:webapp-testing` to load the built site (`npm run preview`) at `/` and `/services`, screenshot, and confirm Direction A renders correctly on desktop and mobile widths.

- [ ] **Step 5: Write deploy notes**

Create `docs/DEPLOY-NOTES.md`:

```markdown
# GEO Marketing Group — Deploy Notes

## Hosting
Cloudflare Pages. Build command: `npm run build`. Output dir: `dist`. Functions auto-detected from `functions/`.

## Required environment variables (Cloudflare Pages → Settings → Environment variables)
- `AUDIT_TO_EMAIL` — where audit + contact submissions are sent (e.g. chris@geomarketinggroup.org)
- `AUDIT_FROM_EMAIL` — verified sender on the geomarketinggroup.org domain
- `RESEND_API_KEY` — optional; if set, email sends via Resend instead of MailChannels

## Domain
Canonical: https://geomarketinggroup.org — register and point DNS at Cloudflare Pages.
Update the apex/CNAME per Cloudflare Pages custom-domain instructions.

## Forms
- `/audit` → POST `/api/audit` → redirect `/audit/thanks`
- `/contact` → POST `/api/contact` → redirect `/contact/thanks`
Both use honeypot (`hp_field`) spam protection.

## Open follow-ups (owner)
- Set real pricing for SEO & Content and Paid Ads & Lead Gen services (currently render "Explore").
- Confirm LinkedIn/X social handles in src/lib/site.ts.
- Replace Work/Results methodology with real case studies once available.
```

- [ ] **Step 6: Commit**

```bash
git add docs/DEPLOY-NOTES.md
git commit -m "docs: add deployment notes for GEO Marketing Group"
```

---

## Self-Review

**Spec coverage:**
- Rebrand to GEO Marketing Group → Tasks 1, 2, 3, 13. ✓
- Equal full-service repositioning → Tasks 1 (data), 8 (home), 9 wait—home is Task 9; services index Task 8; industries Task 12. ✓
- Two new service pages (SEO & Content, Paid) → Tasks 5, 6. ✓
- Rename Build → Web + redirect → Task 7. ✓
- Homepage + system-wide Direction A → Task 9 (home) + reused components everywhere; sweep Task 13. ✓
- Work / Results (process & methodology) → Task 10. ✓
- Lead capture for audit + contact → Task 11 (contact added; audit already worked). ✓
- SEO/GEO hygiene (schema, sitemap, OG, llms.txt, robots) → schema auto-flows from site.ts (Task 1); Task 2 (robots/llms); Task 14 (sitemap/canonical verify). ✓
- Domain geomarketinggroup.org → Tasks 1, 2, 14. ✓
- Out-of-scope items (real case studies, pricing, blog expansion) → flagged in DEPLOY-NOTES + Work page copy. ✓

**Placeholder scan:** No "TBD"/"TODO" in shipped code. New-service pricing is intentionally absent and rendered as "Explore" (a real UI state), with the owner decision flagged in prose + deploy notes — not a code placeholder.

**Type consistency:** `Service.price` made optional in Task 1; every consumer (`services/index.astro` Task 8, `index.astro` Task 9, `Footer.astro` uses only `.label`) handles the optional via `service.price ?? 'Explore'`. NAV `/work` target created in Task 10. `/api/contact` redirect target `/contact/thanks` created in Task 11. Consistent.
