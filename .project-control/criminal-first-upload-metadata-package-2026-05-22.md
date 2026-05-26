# Criminal First-Upload Metadata Package - 2026-05-22

## Status
- VERIFIED PLANNING: this package prepares field-level CMS values for the Criminal first-upload cluster.
- REVIEW ONLY: values are ready for owner/legal/source review, not for automatic publication.
- PUBLIC EXECUTION BLOCKED: no CMS, URL, redirect, canonical, noindex, sitemap, taxonomy, related-card, lawyer-card, schema or CRM change is approved by this file.
- CURRENT-URL ONLY: all link and canonical recommendations keep the current URLs until a focused GSC export and owner migration approval are complete.

## Batch Completed
- Cluster: `criminal-law`.
- Pages reviewed: `5`.
- Rows created: `5` metadata rows in `project-control/criminal-first-upload-metadata-package-2026-05-22.csv`.
- Inputs used: Criminal owner review packet, Criminal CMS operator runbook and the five Criminal draft files.
- Upload status: `0/5` approved for CMS upload.

## Covered Current URLs
| ID | Current URL | Future slug candidate | Draft | Words | Status |
|---|---|---|---|---:|---|
| CRIM-META-001 | `/criminal-defense-attorney/` | `/criminal-lawyer/` | `content-drafts/criminal-lawyer-pillar-he.md` | 5,390 | BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL |
| CRIM-META-002 | `/%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%97%D7%A7%D7%99%D7%A8%D7%94-%D7%91%D7%9E%D7%A9%D7%98%D7%A8%D7%94/` | `/police-investigation/` | `content-drafts/police-investigation-supporting-he.md` | 3,724 | BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL |
| CRIM-META-003 | `/detention-before-charge-or-trial/` | `/pretrial-detention/` | `content-drafts/pretrial-detention-supporting-he.md` | 3,733 | BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL |
| CRIM-META-004 | `/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/` | `/indictment/` | `content-drafts/indictment-supporting-he.md` | 2,148 | BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL |
| CRIM-META-005 | `/drug-offenses-criminal-lawyer/` | `/drug-offenses/` | `content-drafts/drug-offenses-supporting-he.md` | 2,237 | BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL |

## Field Policy
- Title/H1/meta/OG/breadcrumb values are proposed values only.
- Existing pages must be backed up in WordPress before any approved body or metadata update.
- The operator should not create duplicate clean-slug pages.
- Future English slugs are migration candidates only; they must not be used in public links yet.
- Canonical policy is self-canonical on the current URL until GSC and owner migration approval.
- Robots policy is no-change; do not add or remove `noindex` from this package.
- Schema policy is conservative: WebPage, Article and BreadcrumbList only; no Review, AggregateRating, fake trust badges or unsupported FAQ schema.

## Current-URL Internal Link Map
- Pillar `/criminal-defense-attorney/` should link to the four support pages using current URLs only.
- Each support page should link back to `/criminal-defense-attorney/`.
- Support pages may cross-link only where the user journey is direct:
  - Police investigation -> detention and indictment.
  - Detention -> police investigation and indictment.
  - Indictment -> police investigation and detention.
  - Drug offenses -> police investigation, indictment and detention.
- Clean-slug links such as `/criminal-lawyer/`, `/police-investigation/`, `/pretrial-detention/`, `/indictment/` and `/drug-offenses/` remain blocked until redirect/canonical/sitemap migration approval.

## Anti-Cannibalization Notes
- `/criminal-defense-attorney/` is the Criminal pillar and should not be duplicated by `/criminal-lawyer/` before migration.
- The police-investigation page owns preparation-for-investigation intent; avoid creating another generic "חקירה במשטרה" page.
- `/detention-before-charge-or-trial/` owns pretrial detention intent for this upload; do not merge or redirect with `/detention-days/` without GSC review.
- The indictment article owns generic indictment/shimua/bittul intent for this upload; case-specific indictment pages should not be overwritten without review.
- `/drug-offenses-criminal-lawyer/` owns general drug-offenses intent; keep traffic/drug-driving topics separate.

## Ready
- VERIFIED: five Criminal drafts exist and have mapped current URLs.
- VERIFIED: metadata rows exist for H1, SEO title, meta description, OG title, OG description, breadcrumb label, taxonomy label, current-url links, schema and robots policy.
- VERIFIED: `project-control/criminal-source-legal-review-worksheet-2026-05-22.md` now provides the matching page-level owner/legal/source gate.
- READY FOR OWNER REVIEW: the owner can approve, edit, hold or request legal/source review per row.
- READY FOR OPERATOR PREP: after approval, the CMS operator can use this package together with `project-control/criminal-cms-operator-runbook-2026-05-22.md`.

## Blocked
- BLOCKED: owner/legal/source approval for each row.
- BLOCKED: focused GSC/API export before final URL migration, redirect, canonical, noindex and sitemap decisions.
- BLOCKED: actual WordPress editor/database rollback backup before CMS execution.
- BLOCKED: public visual QA until approved CMS updates exist on the site.

## Upload Checklist
1. Owner marks each row `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
2. Legal/source reviewer checks factual claims and disclaimers for approved rows.
3. Operator captures current WordPress editor values and database rollback evidence.
4. Operator updates only approved current URLs, with no slug change.
5. Operator applies only approved metadata values from the CSV.
6. Operator verifies final path, title, H1, canonical, robots, visible body, links and mobile/desktop rendering.
7. URL migration, redirects and sitemap changes remain a later GSC-approved phase.

## Safety
No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
