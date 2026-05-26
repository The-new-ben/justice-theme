# Criminal Law Primary Selection Review

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO PUBLIC EXECUTION
Project area: Content audit / SEO structure / cannibalization / URL migration

This document is the next approval layer after the criminal-law upload-readiness batch. It compares the current criminal-law primary candidates before any public upload, URL migration, redirect, sitemap, internal-link, canonical, category or content action.

## Evidence Used

VERIFIED:
- `project-control/criminal-law-content-upload-readiness-2026-05-11.md`
- `project-control/criminal-law-content-upload-readiness-2026-05-11.csv`
- `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`
- `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`
- `project-control/content-decision-evidence-overlay.csv`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/slug-conflict-review.csv`
- `project-control/url-migration-map.csv`
- `project-control/internal-link-map.csv`

NOT VERIFIED:
- Authenticated wp-admin source object for old Hebrew URLs.
- Full GSC API export for all criminal-lawyer variants.
- GA4 conversion value by landing page.
- Legal/source review of criminal-law content.
- Owner approval for any redirect or content migration.

## Live URL Findings

VERIFIED LIVE:
- `https://jus-tice.co.il/criminal-defense-attorney/` returns `200 OK`, self-canonicalizes, has a criminal-lawyer title/H1 and is indexable.
- `https://jus-tice.co.il/criminal-defense-attorney-roles-and-responsibilities/` returns `200 OK`, self-canonicalizes and behaves like a support page.

BLOCKED / LIVE ROUTE RISK:
- `https://jus-tice.co.il/criminal-lawyer/` returns a first-hop `301` to the homepage.
- the old Hebrew GSC-visible broad criminal-lawyer URL returns a first-hop `301` to the homepage.
- the legacy deep criminal-law broad URL also returns a first-hop `301` to the homepage.

This means `/criminal-lawyer/` is not ready to use as a public target yet. It should remain the strategic future slug only.

## GSC / Cannibalization Findings

VERIFIED:
- `עורך דין פלילי` has `267` impressions on the old Hebrew broad criminal-lawyer URL in the existing GSC evidence.
- `דין פלילי` has `275` impressions on the same old Hebrew URL and `29` impressions on a legacy deep criminal-law URL.
- the homepage appears weakly for criminal-lawyer intent.
- the slug-conflict review has `13` rows competing for `criminal-lawyer`.
- the auto-selected highest-word-count candidate in the slug-conflict review is a foreign/Europe criminal-law page, which is not appropriate as the Israeli criminal-lawyer primary.

## Recommendation

VERIFIED / RECOMMENDED FOR PLANNING:
- Use `https://jus-tice.co.il/criminal-defense-attorney/` as the current no-URL-change planning primary.

BLOCKED / FUTURE ONLY:
- Keep `https://jus-tice.co.il/criminal-lawyer/` as the future strategic target, but do not add it to sitemap, menus, breadcrumbs, related cards or internal-link maps until it is a real approved destination.

BLOCKED / PROTECT:
- Protect the old Hebrew GSC-visible broad criminal-lawyer URL and legacy deep URL. The current homepage redirect is not a clean SEO migration and should not be treated as final.

## Decision Rules Before Public Migration

Before `/criminal-lawyer/` is used publicly:
1. owner approves the primary page decision.
2. legal/source review approves the rewritten criminal-lawyer content.
3. route audit confirms `/criminal-lawyer/` returns a real `200` page, not homepage.
4. old URL -> `/criminal-lawyer/` 301 redirects are mapped.
5. canonical points to the approved primary.
6. internal links point to the approved primary.
7. sitemap contains only the approved primary and approved support pages.
8. support pages link back to the primary.
9. GSC annotations and monitoring are prepared.

## Current Safe Next Step

Prepare no-URL-change outlines using current URLs:
- `https://jus-tice.co.il/criminal-defense-attorney/` as current planning primary.
- police investigation support from the current Hebrew URL.
- indictment support from the current indictment-cancellation URL.
- detention support using current detention URLs.
- drug offenses support from `https://jus-tice.co.il/drug-offenses-criminal-lawyer/`.

## Blocked Actions

BLOCKED:
- publishing `/criminal-lawyer/`.
- redirecting old Hebrew URLs.
- adding `/criminal-lawyer/` to sitemap.
- linking menus/breadcrumbs/related cards to `/criminal-lawyer/`.
- changing title/H1/meta/canonical.
- noindexing or deleting old URLs.
- changing taxonomy/category assignments.
- CMS/database writes.
