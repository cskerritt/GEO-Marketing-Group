# GEO Marketing Group — Launch Checklist & Deploy Notes

A step-by-step path from the current branch to a live site. Items marked **[you]**
need the founder (accounts/DNS/secrets); everything else is in the repo.

---

## 1. Hosting (Cloudflare Pages)

- Build command: `npm run build` · Output dir: `dist` · Root: `website/`
- Functions auto-detected from `website/functions/`.
- Node version: 18+ (set `NODE_VERSION=20` in Pages env if needed).

## 2. Domain **[you]**

- Register **geomarketinggroup.org**.
- In Cloudflare Pages → Custom domains, add `geomarketinggroup.org` (+ `www` → redirect to apex).
- Point DNS per Cloudflare's instructions (CNAME/apex). Canonical URL is already set to `https://geomarketinggroup.org` in `astro.config.mjs` and `src/lib/site.ts`.

## 3. Environment variables **[you]** (Pages → Settings → Environment variables)

- `AUDIT_TO_EMAIL` — inbox for audit + contact submissions (e.g. `chris@geomarketinggroup.org`)
- `AUDIT_FROM_EMAIL` — a verified sender on the domain (e.g. `hello@geomarketinggroup.org`)
- `RESEND_API_KEY` — optional; if set, email sends via Resend instead of MailChannels
- After setting, **redeploy** so functions pick them up.

## 4. Email deliverability **[you]**

- If using **MailChannels** (default): add the required SPF/domain-lockdown DNS records.
- If using **Resend**: verify the domain (SPF/DKIM) and set `RESEND_API_KEY`.
- **Test both forms on the live site** and confirm email arrives:
  - `/audit` → POST `/api/audit` → `/audit/thanks`
  - `/contact` → POST `/api/contact` → `/contact/thanks`
  - Both have honeypot (`hp_field`) spam protection.

## 5. Real details to replace **[you → tell me the values, I'll update]**

- **Phone** — `src/lib/site.ts` has a placeholder `+1-401-555-0100` (used in schema). Give me the real number or we remove `telephone` from the schema.
- **Social handles** — LinkedIn `…/company/geomarketinggroup` and X `…/geomktgroup` are assumed; confirm or correct.
- **Pricing** — SEO & Content and Paid Ads & Lead Gen render "Explore" (no price). Set prices or keep "request a quote".

## 6. Search & analytics (post-deploy)

- **Google Search Console**: verify the domain, submit `https://geomarketinggroup.org/sitemap-index.xml`.
- **Bing Webmaster Tools**: verify + submit sitemap.
- **Analytics**: enable Cloudflare Web Analytics (free, privacy-friendly) or add Plausible. Track audit/contact form submissions as conversions.

## 7. Pre-launch QA (in repo — run before merge)

- `cd website && npm run build` passes (29+ pages).
- `npm run dev` and click every nav item; submit both forms locally.
- Lighthouse pass (SEO, a11y, performance) on home + a service page.
- Confirm reduced-motion: with OS "reduce motion" on, animations are disabled.

## 8. Already done in this repo

- Rebrand → GEO Marketing Group, full-service positioning, Direction-A + motion system.
- SEO/GEO/AEO: AI-crawler `robots.txt`, `llms.txt`, Organization/WebSite/LocalBusiness/Service/FAQ/Article/Breadcrumb schema, sitemap, OG image, favicons + web manifest, branded 404.
- Lead capture functions (`/api/audit`, `/api/contact`).

## 9. GEO Audit tool (separate)

`audit-tool/` is the internal audit CLI (its own README). It is **not** part of the
website deploy. Phase 2 will add an on-site self-serve `/tools/geo-audit`.

---

## Quick deploy (once domain + env are set)

```bash
# from repo root, after merging the launch branch to main:
cd website && npm run build      # sanity check
# Cloudflare Pages builds from main automatically, or:
npx wrangler pages deploy dist --project-name geo-marketing-group
```
