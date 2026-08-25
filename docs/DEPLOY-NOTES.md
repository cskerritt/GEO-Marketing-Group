# GEO Marketing Group — Deployment Notes

> **Status verified August 25, 2026:** `geomarketinggroup.org` is served by a
> Railway project whose source is a separate repository. This repository has no
> active GitHub deployment, so merging its `main` branch will not update the
> production website. Reconcile the repositories and designate one source of
> truth before changing any production connection.

The configuration below describes how this repository can be run or deployed
if it is intentionally selected as the deployment source. Account, DNS, and
secret changes require the owner's approval.

---

## 1. Hosting

- Build command: `npm run build` · Output dir: `dist` · Root: `website/`
- Cloudflare Pages detects functions from `website/functions/`; other hosts need
  an equivalent runtime adapter or separate function deployment.
- Node version: `22.23.2` (pinned in `.nvmrc` files).

## 2. Domain **[you]**

- `geomarketinggroup.org` is registered and currently points at the separate
  production Railway service. Do not change its DNS until the authoritative
  repository and host are confirmed.
- In Cloudflare Pages → Custom domains, add `geomarketinggroup.org` (+ `www` → redirect to apex).
- Point DNS per Cloudflare's instructions (CNAME/apex). Canonical URL is already set to `https://geomarketinggroup.org` in `astro.config.mjs` and `src/lib/site.ts`.

## 3. Environment variables **[you]** (Pages → Settings → Environment variables)

- `PUBLIC_TURNSTILE_SITE_KEY` — public widget key available during the Astro build
- `TURNSTILE_SECRET_KEY` — matching Siteverify secret; store it encrypted
- `AUDIT_TO_EMAIL` — inbox for audit + contact submissions (e.g. `chris@geomarketinggroup.org`)
- `AUDIT_FROM_EMAIL` — a verified sender on the domain (e.g. `hello@geomarketinggroup.org`)
- `RESEND_API_KEY` — required; store it as an encrypted secret
- After setting, **redeploy** so functions pick them up.

## 4. Email deliverability **[you]**

- Verify the sending domain in Resend (SPF/DKIM) and set `RESEND_API_KEY`.
- The former unauthenticated MailChannels-for-Workers endpoint is no longer a
  supported fallback and must not be used for production form delivery.
- Create a Cloudflare Turnstile widget and matching secret for each deployed
  environment. Both form handlers validate tokens server-side before sending.
- Configure host-level rate limits for `/api/audit` and `/api/contact`; the
  application-level Turnstile and payload limits are complementary controls.
- **Test both forms on the live site** and confirm email arrives:
  - `/audit` → POST `/api/audit` → `/audit/thanks`
  - `/contact` → POST `/api/contact` → `/contact/thanks`
  - Both have honeypot (`hp_field`) spam protection.

## 5. Real details to replace **[you → tell me the values, I'll update]**

- **Phone** — confirm the currently configured `+1-203-605-2814` before publishing (it is included in structured data).
- **Social handles** — LinkedIn `…/company/geomarketinggroup` and X `…/geomktgroup` are assumed; confirm or correct.
- **Pricing** — SEO & Content and Paid Ads & Lead Gen render "Explore" (no price). Set prices or keep "request a quote".

## 6. Search & analytics (post-deploy)

- **Google Search Console**: verify the domain, submit `https://geomarketinggroup.org/sitemap-index.xml`.
- **Bing Webmaster Tools**: verify + submit sitemap.
- **Analytics**: enable Cloudflare Web Analytics (free, privacy-friendly) or add Plausible. Track audit/contact form submissions as conversions.

## 7. Pre-launch QA (in repo — run before merge)

- `cd website && npm run verify` passes (76 generated pages plus Functions).
- `npm run dev` and click every navigation item for static-site QA.
- Copy `.env.example` to `.env` and `.dev.vars.example` to `.dev.vars`, add
  a real Turnstile development widget pair whose allowed hostnames include
  `localhost` plus valid Resend test credentials, run `npm run pages:dev`, and
  submit both forms through the Pages Functions runtime. Cloudflare's dummy
  tokens omit `action` and should be used only to confirm strict rejection.
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
# from repo root, after selecting/configuring a deployment target:
cd website && npm run build      # sanity check
# If this repository is connected to Cloudflare Pages:
npx wrangler pages deploy dist --project-name geo-marketing-group
```
