# About Page ID 315 Route Check - 2026-05-28

Status: LIVE_OK_WITH_LEGACY_URL_RISK

Scope: read-only live route diagnosis for `https://jus-tice.co.il/?page_id=315` and `https://jus-tice.co.il/about/`. No public CMS/database content, redirects, canonicals/noindex, sitemap, taxonomy, forms, leads, payments, or deployment settings were changed.

Latest rerun: 2026-05-28T04:21Z.

## Commands

```powershell
node scripts\check-url.mjs --url "https://jus-tice.co.il/?page_id=315" --expected "https://jus-tice.co.il/about/"
node scripts\check-url.mjs --url "https://jus-tice.co.il/about/" --expected "https://jus-tice.co.il/about/"
node scripts\check-url.mjs --url "https://jus-tice.co.il/" --expected "https://jus-tice.co.il/"
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-deploy.ps1
```

## Findings

| URL | Status | Final URL | Canonical | Robots | Classification |
| --- | ---: | --- | --- | --- | --- |
| `https://jus-tice.co.il/?page_id=315` | 200 | `https://jus-tice.co.il/?page_id=315` | `https://jus-tice.co.il/about/` | `index, follow, max-image-preview:large` | `LEGACY_URL_CANONICAL_OK` |
| `https://jus-tice.co.il/about/` | 200 | `https://jus-tice.co.il/about/` | `https://jus-tice.co.il/about/` | `index, follow, max-image-preview:large` | `LIVE_OK` |
| `https://jus-tice.co.il/` | 200 | `https://jus-tice.co.il/` | `https://jus-tice.co.il/` | `index, follow...` | `LIVE_OK` |

## Exact Page Signals

- `?page_id=315` title: `אודות Jus-Tice | Jus-Tice`.
- `?page_id=315` H1: `אודות Jus-Tice`.
- `?page_id=315` body length: 80,551 bytes.
- `/about/` title: `אודות Jus-Tice | Jus-Tice`.
- `/about/` H1: `אודות Jus-Tice`.
- `/about/` body length: 82,813 bytes.
- Both pages include WhatsApp, phone, lead form, header navigation, and footer signals.

## Diagnosis

The page is live and content is present. The legacy `?page_id=315` URL does not redirect to the pretty `/about/` URL, but it does declare `/about/` as canonical. That means the owner-visible "not working" problem is not a missing page or 404; it is a trust/UX risk caused by an ugly legacy URL staying in the address bar.

## Safe Fix Path

1. Prefer linking only to `/about/` from menus, footer, homepage, emails, reports, and public CTAs.
2. If the owner explicitly wants `?page_id=315` to redirect, add one narrow redirect/alias for that exact URL after approval.
3. Do not change canonical/noindex/sitemap behavior without explicit approval.

## Current Rerun

- `https://jus-tice.co.il/?page_id=315` returned HTTP 200 with no redirect, title/H1 for About, canonical `https://jus-tice.co.il/about/`, index/follow robots, WhatsApp, phone, lead form, header navigation, and footer.
- `https://jus-tice.co.il/about/` returned HTTP 200 with canonical `https://jus-tice.co.il/about/`, index/follow robots, WhatsApp, phone, lead form, header navigation, and footer.
- `https://jus-tice.co.il/` returned HTTP 200 with canonical `https://jus-tice.co.il/`, index/follow robots, WhatsApp, phone, lead form, header navigation, and footer.
- Classification remains `LEGACY_URL_CANONICAL_OK` for `?page_id=315` and `LIVE_OK` for `/about/`.

## Latest Route Evidence - 2026-05-28T04:21Z

- `https://jus-tice.co.il/?page_id=315` returned HTTP 200 with no redirect, title/H1 `אודות Jus-Tice`, canonical `https://jus-tice.co.il/about/`, index/follow robots, WhatsApp, phone, lead form, header navigation, footer, and response headers `X-Justice-Route-Guard: trust-route-early-render` plus `X-Justice-Route-Alias: page_id-315-about`.
- `https://jus-tice.co.il/about/` returned HTTP 200 with title/H1 `אודות Jus-Tice`, canonical `https://jus-tice.co.il/about/`, index/follow robots, WhatsApp, phone, lead form, header navigation, footer, and response header `X-Justice-Route-Guard: trust-route-early-render`.
- Live route matrix returned `pass=true`, route count `8`, failures `0`, warnings `1`; the warning is only the legacy URL staying visible instead of redirecting to `/about/`.
- One generic web fetch presented the query URL as if it landed on the homepage. Direct route checks with the repo checker and raw response headers showed the live server returns the About trust route for the exact URL. Treat direct HTTP/header evidence as authoritative unless a human browser capture proves a different cached/session behavior.

## Mobile Deploy Check

The latest mobile-menu/link-hygiene deployment marker is still not live:

- Expected marker `2026-05-28-mobile-menu-stability-v1`: missing.
- Expected theme version `1.1.69`: missing.
- Old footer marker `2026-05-27-footer-trust-path-v1`: still present.
- Live component and WhatsApp mobile surface are present, but this does not prove the pushed mobile-menu/link-hygiene release deployed.

## Tangible Artifact Added

`scripts/check-url.mjs` is now a reusable route checker for exact URL, final URL, redirect chain, title, H1, canonical, robots, body length, required text tokens, and lead/conversion signals. It implements the local `justice-url-site-route-checker` skill workflow that previously referenced a missing script.

## Honesty Statement

This check does not create customers, lawyers, invoices, payments, CRM records, or Search Console proof. It removes ambiguity around the About page report and adds a repeatable checker so future "page not working" claims can be tested instead of guessed.
