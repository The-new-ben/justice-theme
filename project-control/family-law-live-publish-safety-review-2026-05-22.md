# Family Law Live Publish Safety Review - 2026-05-22

## Status

- FIXED REPO SAFETY: `reports/semrush/publish-family-law-pages.js` now defaults to dry-run mode.
- VERIFIED LOCAL: dry run reads the local Family Law JSON, reports the two planned pages and makes no credential or network request.
- VERIFIED LIVE READ-ONLY: checked `9` public URLs/resources without CMS writes.
- NOT EXECUTED: no WordPress REST write, wp-admin save, database row edit, slug change, redirect, canonical/noindex setting, sitemap change, taxonomy change, media upload or public content edit was performed in this cycle.

## Batch Completed

- Reviewed the live-publish artifact introduced by commit `5f86d9c`.
- Hardened the Family Law publish script so live writes require both:
  - `ALLOW_WP_PUBLISH=YES`
  - `WP_APP_PASSWORD_JSON=/path/to/wp-app-password.json`
- Replaced hardcoded local Windows paths with repo-relative/env-driven paths.
- Verified the script with:
  - `node --check reports/semrush/publish-family-law-pages.js`
  - `node reports/semrush/publish-family-law-pages.js`
  - `ALLOW_WP_PUBLISH=YES` without `WP_APP_PASSWORD_JSON`, which is rejected before any request can be made.

## Public Read-Only Findings

| Scope | Status | Finding |
|---|---|---|
| `/lawyer-divorce-guide-proceedings-costs-rights/` | VERIFIED LIVE | HTTP 200, index/follow, self-canonical, Hebrew content renders, no replacement characters detected. |
| `/divorce-agreement/` | VERIFIED LIVE WITH BLOCKER | HTTP 200, index/follow, self-canonical, Hebrew content renders, but raw shortcodes are visible in public HTML. |
| `/divorce-lawyer/` | VERIFIED LIVE CONFLICT | HTTP 200, index/follow, self-canonical. This is still a competing divorce-lawyer pillar candidate. |
| `/child-support/` | VERIFIED LIVE | HTTP 200, index/follow, self-canonical. |
| `/child-custody/` | VERIFIED LIVE | HTTP 200, index/follow, self-canonical. |
| `/divorce-mediation/` | VERIFIED LIVE | HTTP 200, index/follow, self-canonical. |
| PDF asset candidates | BLOCKED | `divorce-agreement-template-2025.pdf` returned 404 at the tested common upload paths. |

## Risks Found

1. P0 CANNIBALIZATION RISK: `/lawyer-divorce-guide-proceedings-costs-rights/` and `/divorce-lawyer/` are both live, indexable and self-canonical. They compete for the same divorce-lawyer intent until owner/GSC decides which URL is canonical.
2. P0 USER EXPERIENCE RISK: `/divorce-agreement/` exposes raw `[justice_pdf_download ...]` and `[justice_contact_form ...]` shortcodes in public HTML.
3. P0 ASSET RISK: the promised `divorce-agreement-template-2025.pdf` was not found at tested common media paths.
4. P1 TEMPLATE/SEO RISK: the two newly published pages have multiple H1 tags in live HTML (`3` on the long divorce-lawyer guide, `2` on divorce agreement).
5. P1 URL STRATEGY RISK: the newly published divorce-lawyer URL is long and differs from the planned clean canonical `/divorce-lawyer/`.
6. P1 SOURCE/LEGAL REVIEW RISK: the pages include cost, time, court/process and legal-consequence claims that still need source/legal review before being treated as final.
7. P1 SCRIPT RISK REDUCED: the Family publish script no longer writes live by default, but repo still contains other production-write scripts that should be reviewed separately.

## What Is Ready

- Script-level safety for this Family Law publisher is ready.
- Live read-only route evidence exists for the two published URLs and their main support links.
- Internal support targets `/child-support/`, `/child-custody/` and `/divorce-mediation/` do not appear to 404.

## What Is Blocked

- BLOCKED: do not run another live publish from this script without explicit owner approval.
- BLOCKED: do not redirect, canonicalize, noindex or delete either divorce pillar URL until focused GSC data and owner decision are available.
- BLOCKED: do not treat `/divorce-agreement/` as final until raw shortcodes are fixed or replaced with working public UI.
- BLOCKED: do not promise a PDF download until the actual media asset exists and the shortcode/rendering path is verified.

## Minimum Repair Checklist Before Family Upload Is Considered Safe

1. OWNER DECISION: choose the divorce-lawyer canonical URL strategy:
   - keep `/divorce-lawyer/` as canonical, or
   - migrate to `/lawyer-divorce-guide-proceedings-costs-rights/`, or
   - merge content into one URL and redirect later after GSC approval.
2. GSC CHECK: export query/page data for the two divorce-lawyer URLs before any redirect/noindex/canonical decision.
3. SHORTCODE FIX: replace raw `justice_pdf_download` and `justice_contact_form` output with working blocks/forms, or remove them from public content.
4. ASSET FIX: upload/verify `divorce-agreement-template-2025.pdf` before referencing it publicly.
5. H1 CHECK: normalize page templates/content so each published page has one primary H1.
6. SOURCE/LEGAL CHECK: review cost/time/process claims before marking content final.
7. QA CHECK: rerun live HTML checks after each approved public repair.

## Recommended Next Action

Fix the live Family Law safety blockers in this order, after owner approval:

1. Decide whether the live long divorce-lawyer page should be rolled back, held, noindexed temporarily, or merged into `/divorce-lawyer/`.
2. Fix `/divorce-agreement/` raw shortcode output and missing PDF asset.
3. Run focused Family/Divorce GSC API export before any redirect/canonical/noindex action.

## Content Upload Readiness Estimate

- Family/Divorce readiness before this review: high planning readiness, blocked by GSC/CMS approval.
- Family/Divorce readiness after this review: lower live-safety confidence because two pages are already public with unresolved URL/cannibalization and shortcode/PDF blockers.
- Current estimated readiness for clean Family upload: `70% planning ready / 40% live-safe`.
