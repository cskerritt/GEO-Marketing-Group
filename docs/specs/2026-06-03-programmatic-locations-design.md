# Programmatic Local SEO — New England Locations Game Plan

**Date:** 2026-06-03
**Status:** Approved direction — ready for implementation plan
**Scope:** Tiered, quality-first, one-page-per-town location program for `website/`
**Decisions locked:** coverage = tiered quality-first; granularity = one location page per town (no town×service/industry matrix in v1).

---

## 1. Opportunity analysis

New England ≈ **1,536 municipalities** (MA 351 · CT 169 · RI 39 · VT 255 · NH 234 · ME 488). Most are small towns with negligible commercial search volume; carpeting all of them yields thin/doorway pages that Google penalizes and AI engines ignore. Strategy: **tier by demand + business density + proximity to Providence**, launch where it matters, expand on evidence. Public Census data is the spine; the **defensible, differentiated angle is the AI-search/GEO framing per market** — which no local competitor is publishing.

## 2. Page model & URL structure

Hub-and-spoke, clean subfolders:

```
/locations                         → index (all states/markets, map of coverage)
/locations/[state]                 → 6 state hubs (e.g. /locations/massachusetts)
/locations/[state]/[city]          → city/town spokes (e.g. /locations/rhode-island/providence)
/locations/[state]/[county]        → optional county roll-up pages (long-tail)
```

**Migration:** existing flat `/locations/providence-ri` and `/locations/boston-ma` → move into the nested structure with **301 redirects** preserved.

Each **city page targets the firm's whole offering for that market** ("Marketing for [City] professional-services firms" / "Get [City] firms found on Google and AI"), not per-service pages.

## 3. Tiering & rollout

| Tier | Count | Who | Index? |
|---|---|---|---|
| **1 (launch)** | ~40 | Major NE metros + RI/MA base markets | Yes |
| **2** | ~150 | County seats + affluent professional-services suburbs | Yes, after Tier-1 proves out |
| **3 (long tail)** | rest | Small towns | Rolled into **county pages**; standalone only when enriched enough to clear the content bar (else `noindex`) |

**Tier-1 list (~40):**
- **RI:** Providence, Warwick, Cranston, Pawtucket, East Providence, Newport, Woonsocket
- **MA:** Boston, Worcester, Springfield, Cambridge, Lowell, Brockton, Quincy, Newton, Framingham, Somerville, Fall River, New Bedford
- **CT:** Hartford, New Haven, Stamford, Bridgeport, Norwalk, Waterbury, Greenwich, Danbury
- **NH:** Manchester, Nashua, Concord, Portsmouth
- **ME:** Portland, Lewiston, Bangor, South Portland
- **VT:** Burlington, South Burlington, Montpelier, Rutland

## 4. Uniqueness engine (the make-or-break)

Every page is **data-driven, never name-swapped**. Per-city content blocks:
1. **Local facts** — county, population, region, nearby cities, local economy/industry mix (from the dataset).
2. **AI-search angle for that market** — a genuinely unique 2–3 paragraph section on how that city's professional-services firms win/lose in AI search and local search. Generated from the city's real data via the OpenAI integration (reuse the audit-tool client), **human-reviewed**, not pure template.
3. **Local FAQ** (3–4 Q&As) with `FAQPage` schema — e.g., "Do you work with firms in [City]?", "How do [City] firms get cited by ChatGPT?"
4. **Internal links** — to the state hub, 3–5 nearby city pages, and the most relevant service + industry pages.
5. **Unique title/meta** per page; `LocalBusiness`/`Service` schema with `areaServed` = the city + `BreadcrumbList`.

**Content bar (gate for indexing):** ≥ ~350 words of genuinely city-specific content + ≥1 local data point + a local FAQ. Pages that can't clear it are `noindex` or folded into the county page.

## 5. Data spine

`src/data/ne-municipalities.json` (or `.csv` → generated): `{ name, slug, state, stateSlug, county, population, lat, lng, tier }`. Source: **US Census** place/population data (public). Astro `getStaticPaths` reads it to generate hubs + spokes. Tier assigned in-data so rollout = flip a flag / filter.

## 6. Architecture, schema, crawl

- **Hub-and-spoke** internal linking; breadcrumbs with schema; no orphan pages.
- **Dedicated locations sitemap** (separate from the main pages); manage crawl budget; Tier-3 thin pages excluded until enriched.
- Schema: `Service`/`LocalBusiness` with `areaServed`, `FAQPage`, `BreadcrumbList` — reuse existing `src/lib/schema.ts` builders (add an `areaServed`-aware helper).
- Reuse the site's motion/brand system (`Reveal`, brand tokens) so location pages match the redesigned site.

## 7. Content generation pipeline

A build-time/offline script (`scripts/gen-locations.ts`) that, per Tier-1/2 city: feeds the city's real data to OpenAI for the unique local sections, writes the result into the dataset/MDX so generation is **deterministic at build** (no live API calls during `astro build`). Human review before commit. (Same OpenAI key as the audit tool.)

## 8. Rollout phases

- **Phase 0:** dataset + city/hub templates + 6 state hubs + Tier-1 (~40) + redirects from old location URLs. Ship, submit locations sitemap, monitor 3–4 weeks.
- **Phase 1:** Tier-2 (~150) once Tier-1 indexes/ranks cleanly.
- **Phase 2:** county roll-ups for the long tail; expand standalone town pages only where evidence supports it.
- **Phase 3 (optional):** town×service/industry pages for top metros only.

## 9. Pre-launch checklist

- [ ] Each Tier-1 page clears the content bar (unique local sections + FAQ + data).
- [ ] Unique title/meta; `LocalBusiness`/`Service`/`FAQPage`/`BreadcrumbList` schema valid.
- [ ] Hub-and-spoke links present; no orphans; breadcrumbs.
- [ ] Locations sitemap generated; old URLs 301 → new.
- [ ] `npm run build` green; Lighthouse SEO strong on a sample city page.

## 10. Post-launch monitoring

| Metric | Tool | Cadence | Alert |
|---|---|---|---|
| Indexation rate | Search Console | weekly | < 80% of Tier-1 indexed after 4 wks |
| Thin-content / manual actions | Search Console | weekly | any warning → pause expansion |
| Rankings (city queries) | Search Console / rank tracker | biweekly | — |
| AI citations for city queries | the GEO audit tool | monthly | — |
| Traffic + form conversions | Cloudflare/Plausible | monthly | — |

## 11. Risks

- **Thin content / doorway penalty** — mitigated by tiering, the content bar, real local data + unique AI-search angle, and `noindex` on weak pages.
- **Crawl budget** — separate sitemap, tiered indexing.
- **Generation cost/quality** — offline, human-reviewed generation; deterministic at build.
- **Over-reach** — resist Phase 3 matrix until location pages prove out.

## 12. Success criteria

- 6 state hubs + ~40 Tier-1 city pages live, each clearing the content bar, all on the new nested URL structure with old URLs redirected.
- Clean `npm run build`, valid schema, locations sitemap submitted.
- Tier-1 indexes without thin-content warnings → green light for Tier-2.
