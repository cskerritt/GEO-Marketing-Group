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
- Confirm LinkedIn/X social handles in website/src/lib/site.ts.
- Replace Work/Results methodology with real case studies once available.
- Visually QA all pages via `npm run dev` before go-live.
