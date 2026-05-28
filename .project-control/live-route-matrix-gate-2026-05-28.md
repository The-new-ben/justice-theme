# Live Route Matrix Gate - 2026-05-28

Status: PASS_WITH_LEGACY_WARNING

Scope: read-only live route QA for money and trust routes. No public CMS/database content, redirects, canonicals/noindex, sitemap, taxonomy, forms, leads, CRM records, invoices, payments, or deployment settings were changed.

## Why This Exists

The About `?page_id=315` report showed that a single URL can be technically live but still look wrong to a human because it remains on an old WordPress numeric URL. The new gate checks the route matrix systematically before we claim a page, menu, homepage, or revenue path is healthy.

## Primary Sources Rechecked

- Google Search technical requirements: `https://developers.google.com/search/docs/essentials/technical`
- Google Search Console URL Inspection help: `https://support.google.com/webmasters/answer/9012289`
- Chrome Lighthouse overview: `https://developer.chrome.com/docs/lighthouse/overview/`
- Web Vitals overview: `https://web.dev/articles/vitals`
- WordPress `redirect_canonical()` reference: `https://developer.wordpress.org/reference/functions/redirect_canonical/`

## Artifact Added

- `.project-control/scripts/check-live-route-matrix.ps1`
- Integrated into `.project-control/scripts/check-revenue-readiness-gate.ps1` as `live_route_matrix`.
- Knowledge base updated: `C:\Users\janana\.codex\skills\justice-url-site-route-checker\references\url-site-checking-research.md`.

## Verification

Command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-route-matrix.ps1
```

Latest run: `2026-05-28T04:21Z`

Summary:

- Route count: `8`
- Failures: `0`
- Warnings: `1`
- Overall pass: `true`

## Route Results

| Route | URL | Status | Classification | Canonical | Lead signals |
| --- | --- | ---: | --- | --- | --- |
| Homepage | `https://jus-tice.co.il/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/` | WhatsApp, phone, lead form, header, footer |
| About canonical | `https://jus-tice.co.il/about/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/about/` | WhatsApp, phone, lead form, header, footer |
| About legacy | `https://jus-tice.co.il/?page_id=315` | 200 | `LEGACY_URL_CANONICAL_OK` | `https://jus-tice.co.il/about/` | WhatsApp, phone, lead form, header, footer |
| Contact | `https://jus-tice.co.il/contact/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/contact/` | WhatsApp, phone, lead form, header, footer |
| Lawyers directory | `https://jus-tice.co.il/lawyers/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/lawyers/` | WhatsApp, phone, lead form, header, footer |
| Lawyer registration | `https://jus-tice.co.il/lawyer-registration/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/lawyer-registration/` | WhatsApp, phone, lead form, header, footer |
| Lawyer plans | `https://jus-tice.co.il/lawyer-plans/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/lawyer-plans/` | WhatsApp, phone, lead form, header, footer |
| Lawyer dashboard | `https://jus-tice.co.il/lawyer-dashboard/` | 200 | `LIVE_OK` | `https://jus-tice.co.il/lawyer-dashboard/` | WhatsApp, phone, lead form, header, footer |

## Warning

`https://jus-tice.co.il/?page_id=315` still resolves without redirecting to `/about/`, but it declares `/about/` as canonical. This is not treated as a hard route failure because the page returns 200 and contains the expected trust/lead signals. It remains a UX/link-hygiene warning until the live menu stops exposing the old URL after uPress Pull Git.

## Revenue Readiness Impact

The new route gate reduces uncertainty around public trust and revenue surfaces. It proves selected live routes respond and contain conversion signals, but it does not prove Google indexing, rankings, Search Console state, CRM routing, lawyer handoff, invoice issuance, payment settlement, or revenue.

Current consolidated gate after integration:

- `pass=true`
- `readiness=partial_live_funnel_deploy_blocked`

## Honesty Statement

This cycle created a reusable route QA gate and updated the Codex URL-checking knowledge base. It did not publish content, change redirects/canonicals/noindex/sitemaps/taxonomies, create customers/lawyers, send WhatsApp messages, create CRM records, issue invoices, charge payments, or perform uPress Pull Git.
