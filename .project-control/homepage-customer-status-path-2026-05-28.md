# Homepage Customer Status Path - 2026-05-28

Status: PUSH_READY_DEPLOY_BLOCKED

Scope: source-code homepage conversion improvement. No public CMS/database content, redirects, canonicals/noindex, sitemap, taxonomy, CRM records, WhatsApp messages, invoices, payments, gateway settings, or uPress deployment settings were changed.

## Goal

Make the homepage feel less like a passive WordPress site and more like a legal-help workflow: after a visitor sends a form or WhatsApp inquiry, the page now explains how the inquiry is handled.

## Competitor Mechanism Translated

- `din.co.il`: index/search mental model, so the visitor needs a clear path from issue to lawyer type.
- `LawReviews`: trust comes from showing why a lawyer/profile should be selected.
- `Lawhive`: process clarity reduces friction; users need to know what happens after they describe their issue.

This implementation translates those mechanisms into an original Jus-Tice section. It does not copy competitor text, layout, code, images, or claims.

## What Changed

- Added a visible homepage status path under the customer intake handoff:
  - source,
  - consent,
  - first attempt,
  - lawyer/supplier fit.
- Added `data-revenue-surface="homepage_customer_status_path"` for source and deployment QA.
- Added responsive CSS for desktop, tablet, and mobile.
- Bumped theme version to `1.1.70`.
- Bumped deployment marker to `2026-05-28-homepage-status-path-v1`.
- Bumped `premium-pass-4.css` cache version to `4.5.6`.
- Updated live deploy, mobile browser QA, mobile menu source, and revenue readiness gates to expect the new marker/version.
- Updated B007 and uPress handoff to point to the latest deployment target.

## Verification

Passed:

- `php -l template-parts/sections/customer-intake-strip.php`
- `php -l functions.php`
- `php -l inc/enqueue.php`
- PowerShell syntax checks for updated QA scripts.
- Source marker scan for `homepage_customer_status_path`, `1.1.70`, `2026-05-28-homepage-status-path-v1`, and `4.5.6`.
- `.project-control/scripts/check-mobile-menu-stability.ps1`: `pass=true`.
- `git diff --check`: clean.

Live deploy check:

- HTTP status: `200`
- Expected marker `2026-05-28-homepage-status-path-v1`: `false`
- Expected version `1.1.70`: `false`
- Old marker `2026-05-27-footer-trust-path-v1`: `true`
- Live ready: `false`

Consolidated revenue gate:

- `pass=false`
- `readiness=blocked_funnel_failure`
- Profit-blocking failure: `homepage_revenue_paths`
- Deployment blockers: `mobile_menu_live_deploy_marker`, `live_link_hygiene_deploy_check`

Interpretation: the source is ready, but the live site has not pulled the new release. The homepage revenue path now intentionally fails live until uPress Pull Git makes the new status path visible.

## Required Live Step

1. Open uPress for `jus-tice.co.il`.
2. Go to Git management for `wp-content/themes/justice-theme`.
3. Run Pull Git.
4. Re-run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-deploy.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-homepage-revenue-paths.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-link-hygiene.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-mobile-menu-browser-qa.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-revenue-readiness-gate.ps1
```

## Readiness Impact

This improves homepage trust and lead conversion clarity. It does not create revenue by itself. Readiness remains around `45-55%` until deployment, payment proof, and a controlled real lead/lawyer workflow are verified.

## Honesty Statement

This is source-code progress pushed toward a visible homepage improvement, not a live public update yet. No lead, customer, lawyer, invoice, payment, WhatsApp message, CRM record, CMS record, redirect, canonical, noindex, sitemap, taxonomy, or uPress deployment was created or changed.
