# Targeted GSC Query Queue

Date: 2026-05-11
Status: IN PROGRESS / REVIEW ONLY

## Purpose

This file converts the current content-audit gaps into a practical Search Console browser work queue.

It does not approve URL changes, redirects, noindex decisions, canonical updates, sitemap changes, public rewrites, menu changes, or content deletion.

## Created

VERIFIED:
- `project-control/targeted-gsc-query-queue.csv`

## Why This Queue Exists

The public inventory and audit maps are refreshed, and the first evidence overlay already connects existing GSC evidence to the highest-risk clusters. The next bottleneck is direct query evidence for topics where the inventory shows conflict but GSC traffic risk is still NOT VERIFIED.

Priority gaps:
- Child support: largest slug-conflict group, but direct query evidence is still missing.
- Child custody: exact clean URL exists, but broad custody and narrow custody evidence must be separated.
- Employment law: strategic pillar is not confirmed by public URL map or direct GSC evidence.
- Inheritance/wills: will queries have evidence, but inheritance-lawyer intent is weak or zero-row.
- Work/car accidents and traffic: several variants either have zero visible rows or map to wrong/old URLs.
- Criminal support topics: broad criminal-lawyer evidence exists, but support spokes need query-to-page checks.

## How To Use In GSC

For each row in `targeted-gsc-query-queue.csv`:

1. Open Google Search Console Performance > Search results.
2. Set date range to last 3 months.
3. Add filter: Query contains the `query_filter` value.
4. Open Pages tab.
5. Record every visible URL with clicks, impressions, CTR and average position.
6. If a likely primary URL appears, run the reverse Page filter and inspect Queries.
7. Update:
   - `project-control/gsc-keyword-page-map.csv`
   - `project-control/gsc-cannibalization-review.csv`
   - `project-control/gsc-content-priorities.csv`
   - `project-control/content-decision-evidence-overlay.csv`
   - topic-specific packets such as `project-control/child-support-content-decision-packet.md`

## Decision Rules

VERIFIED:
- A clean English slug can be a primary candidate only after GSC, SERP, content-quality and internal-link review.
- An old Hebrew URL with impressions is a migration-risk URL, not junk.
- A DOCX/media URL with impressions needs a document/public-content strategy before any redirect.
- Zero visible GSC rows means Jus-Tice has no visible current signal for that exact filter; it does not prove the topic has no demand.

BLOCKED:
- Do not redirect old URLs from this queue alone.
- Do not change slugs from this queue alone.
- Do not delete old content from this queue alone.
- Do not noindex pages from this queue alone.
- Do not publish new duplicate pages from this queue alone.
- Do not update canonical or sitemap logic from this queue alone.

## Immediate First Pass

Run these first because they directly unblock the active child-support and first decision batch:

1. `מזונות ילדים`
2. `חישוב מזונות`
3. `מחשבון מזונות`
4. `בעמ 919/15`
5. `משמורת ילדים`
6. `עורך דין דיני עבודה`
7. `דיני עבודה`
8. `עורך דין ירושה`
9. `עורך דין צוואות וירושות`
10. `עורך דין תאונות דרכים`

## Output After GSC Session

After each browser session, document:

- VERIFIED: queries checked, date range, Pages tab URLs and metrics.
- REVIEW: suspected primary URL, support URLs, merge candidates and weak primary pages.
- NOT VERIFIED: filters that showed no rows or could not be checked.
- BLOCKED: decisions needing owner approval, legal review, menu export, full CMS export or GSC/GA4 export.

## 2026-05-11 Homepage And Directory Browser Pass Completed

VERIFIED:
- `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.md`
- `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.csv`
- `project-control/visual-evidence/gsc-homepage-page-query-2026-05-11.png`
- `project-control/visual-evidence/gsc-lawyers-page-query-2026-05-11.png`
- `project-control/visual-evidence/gsc-query-lawyer-singular-pages-2026-05-11.png`
- `project-control/visual-evidence/gsc-query-lawyers-plural-pages-2026-05-11.png`
- `project-control/visual-evidence/gsc-query-find-lawyer-pages-2026-05-11.png`

Key findings:
- Homepage page-to-query check shows `26` clicks, `5,459` impressions, CTR `0.5%`, and average position `17.1`.
- `/lawyers/` page-to-query check returned `No data`.
- `עורך דין`, `עורכי דין`, and `מציאת עורך דין` query-to-page checks currently map broad lawyer/directory intent mainly to the homepage.
- Multiple old/support URLs receive broad lawyer impressions, so homepage and directory decisions must be integrated with internal links, pillar pages and URL migration planning.

Next queue direction:
- Run cyber/privacy and national-insurance remaining-gap checks.

## 2026-05-11 Second Browser Pass Completed

VERIFIED:
- `project-control/gsc-targeted-query-pass-2-2026-05-11.md`
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`
- `project-control/visual-evidence/gsc-targeted-drunk-driving-pages-2026-05-11.png`

Key findings:
- `משמורת בלעדית לאם` maps to an old case-law URL with `107` impressions and average position `9.6`.
- `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` map to `/revocation-of-a-will-and-reviving-previous-will/`.
- `עבירות סמים` has only `2` impressions across case-law/old criminal URLs.
- Child-support modification/shared-custody variants, `בע"מ 919/15`, and `חקירה במשטרה` showed no visible rows.

Next queue direction:
- Update custody and traffic approval packets with these risks.
- Keep child-support modification variants as SERP/source-review topics rather than GSC-driven priorities.
- Continue remaining GSC/SERP gaps for cyber/privacy, national insurance, lawyer-directory, homepage and page-to-query checks.

## 2026-05-11 Remaining Gap Queue Added

VERIFIED:
- Created `project-control/gsc-remaining-gap-queue-2026-05-11.md`.
- Created `project-control/gsc-remaining-gap-queue-2026-05-11.csv`.
- The new queue covers cyber/privacy, national insurance, homepage broad intent, lawyer-directory intent and page-to-query checks.
- It adds both query-to-page and page-to-query rows so future GSC browser sessions can capture what Google associates with the homepage, `/lawyers/`, `/cyber-lawyer/`, the national-insurance practice-area hub and the old national-insurance calculator URL.

NEXT:
- Run the homepage and `/lawyers/` page-to-query checks first.
- Then check cyber/privacy and national-insurance lawyer-service terms.
- Update the relevant owner packets only after evidence is captured.

## Current Safety State

VERIFIED:
- This is a repo-side planning artifact only.
- No public content body, URL slug, redirect, noindex, canonical, sitemap inclusion, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting or database row was changed.
