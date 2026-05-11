# GSC Remaining Gap Queue - 2026-05-11

Status: REVIEW ONLY / NOT EXECUTION / NO URL CHANGE

This queue extends the active targeted GSC workflow after the family, criminal and traffic evidence passes. It converts the remaining NOT VERIFIED gaps into exact browser checks for cyber/privacy, national insurance, homepage broad intent, lawyer-directory intent and page-to-query diagnostics.

Created file:
- `project-control/gsc-remaining-gap-queue-2026-05-11.csv`

## Scope

VERIFIED:
- Cyber/privacy direct GSC rows now exist for cyber lawyer, cyber law, privacy lawyer, cyberattack, privacy invasion, online defamation, data deletion, shaming and privacy-protection variants.
- National insurance direct GSC rows now exist for national-insurance lawyer, broad national-insurance, medical committee, disability benefit and empty-hub page-to-query checks.
- Homepage and lawyer-directory broad intent have direct query-to-page and page-to-query checks.
- The old national-insurance calculator URL must be reverse-checked before any future `/national-insurance-lawyer/` migration decision.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page and conversion data.
- Owner approval for public content, URL, redirect, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM or CMS changes.

## How To Run This In GSC

For rows where `check_type` is `QUERY_TO_PAGE`:
1. Open Performance > Search results.
2. Set date range to Last 3 months.
3. Add Query contains the `query_filter` value.
4. Open Pages.
5. Record every visible URL with clicks, impressions, CTR and average position.
6. If one URL looks like the primary, run a reverse Page filter for that URL.

For rows where `check_type` is `PAGE_TO_QUERY`:
1. Open Performance > Search results.
2. Set date range to Last 3 months.
3. Add Page filter using `page_filter`.
4. Open Queries.
5. Record top queries, clicks, impressions, CTR and average position.
6. Classify whether Google understands the page as intended.

## Priority Order

1. Homepage and `/lawyers/` page-to-query checks.
2. Cyber lawyer and privacy lawyer query-to-page checks.
3. National-insurance lawyer and old calculator page-to-query checks.
4. Broad national-insurance and medical committee checks.
5. Cyber support, privacy support, data deletion, shaming and unemployment checks.

## Decision Rules

VERIFIED:
- A page with impressions is not automatically the best final URL; it is a risk and evidence source.
- A zero-row filter does not prove no market demand; it only means Jus-Tice currently has no visible signal for that exact filter.
- Broad homepage queries should be interpreted carefully because the homepage may temporarily carry weak primary ownership for missing pillar pages.
- Empty or thin pages should not be promoted only because a clean English slug is strategically attractive.

BLOCKED:
- No redirects.
- No slug changes.
- No canonical changes.
- No sitemap changes.
- No noindex changes.
- No public rewrites.
- No deletion.
- No menu, taxonomy, related-card, lawyer-card, CRM, review or CMS writes.

## Output After Browser Session

Update after each checked group:
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-cannibalization-review.csv`
- `project-control/gsc-content-priorities.csv`
- `project-control/content-decision-evidence-overlay.csv`
- Relevant owner packets:
  - `project-control/cyber-privacy-owner-approval-packet.md`
  - `project-control/national-insurance-owner-approval-packet.md`
  - `project-control/homepage-seo-design-alignment.md`

## 2026-05-11 Completed Group: Homepage And Lawyer Directory

VERIFIED:
- `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.md`
- `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.csv`
- Browser screenshots in `project-control/visual-evidence/`.

Findings:
- Homepage reverse query check has `26` clicks, `5,459` impressions and average position `17.1`.
- `/lawyers/` reverse query check has `0` clicks, `0` impressions and no visible query rows.
- Broad `עורך דין`, `עורכי דין`, and `מציאת עורך דין` currently map primarily to the homepage.

Decision:
- REVIEW: keep homepage as current broad legal portal/find-a-lawyer entry.
- REVIEW: do not treat `/lawyers/` as a proven GSC primary until indexability, internal links, sitemap, title/H1 and real lawyer inventory are reviewed.
- BLOCKED: no live homepage, directory, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM/review or CMS action.

## 2026-05-11 Completed Group: Cyber/Privacy And National Insurance

VERIFIED:
- `project-control/gsc-cyber-national-gap-pass-2026-05-11.md`
- `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`
- Cyber/privacy screenshots in `project-control/visual-evidence/`.

Findings:
- `עורך דין סייבר` maps to `/cybercrime-lawyer-roll/` with `0` clicks and `42` impressions; `/cyber-lawyer/` reverse check has no data.
- `דיני סייבר` and `עורך דין פרטיות` have no visible rows.
- `עורך דין ביטוח לאומי`, `ועדה רפואית ביטוח לאומי`, and `/practice-areas/national-insurance/` have no visible rows.
- Broad `ביטוח לאומי` and `קצבת נכות` have only very low-sample wrong-page/boundary rows.

Decision:
- REVIEW: keep `/cyber-lawyer/` as inventory candidate but not GSC-proven.
- REVIEW: keep `/national-insurance-lawyer/` as strategic future slug only.
- BLOCKED: no live cyber/privacy, national-insurance, title/H1/meta, content, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM/review or CMS action.

## 2026-05-11 Completed Group: Cyber/Privacy Support Terms

VERIFIED:
- `project-control/gsc-cyber-privacy-support-pass-2026-05-11.md`.
- `project-control/gsc-cyber-privacy-support-pass-2026-05-11.csv`.

Findings:
- `פגיעה בפרטיות` maps to an old Hebrew privacy-injury URL with `0` clicks, `38` impressions and average position `46`.
- `הגנת הפרטיות` maps to the same old Hebrew privacy-injury URL with `0` clicks, `7` impressions and average position `49.3`.
- `שיימינג` maps only once to `/changing-or-canceling-a-prenuptial-agreement/`, a wrong-page family-law/prenup signal.
- `מתקפת סייבר`, `לשון הרע באינטרנט`, and `מחיקת מידע` have no visible rows.

Decision:
- REVIEW: protect the old privacy-injury URL for comparison and source/legal review.
- REVIEW: do not edit the prenup page for shaming intent.
- REVIEW: treat cyberattack, online defamation and data deletion as SERP/source/legal review items, not GSC-proven traffic pages.
- BLOCKED: screenshot capture timed out during this pass, so the evidence is text-metric based.
- BLOCKED: no live cyber/privacy, title/H1/meta, content, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM/review or CMS action.

## Safety

This queue is a research plan only. It does not approve any live public content, URL, redirect, sitemap, canonical, related-card, menu, taxonomy, lawyer, lead, review, wp-admin or database change.
