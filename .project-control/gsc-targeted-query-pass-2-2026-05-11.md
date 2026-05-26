# GSC Targeted Query Pass 2

Date: 2026-05-11
Status: COMPLETED / REVIEW ONLY / NO SITE CHANGE
Property checked: `https://jus-tice.co.il/`
Date range: Last 3 months
GSC report: Performance > Search results
Breakdown used: Pages

## Purpose

This second browser pass checks follow-up child-support, child-custody, criminal support and traffic support queries from `project-control/targeted-gsc-query-queue.csv`.

It does not approve content rewrites, URL changes, 301 redirects, noindex, canonical changes, sitemap changes, document removal, menu changes or CMS writes.

## Evidence Created

VERIFIED:
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`
- `project-control/visual-evidence/gsc-targeted-drunk-driving-pages-2026-05-11.png`

## Queries Checked

VERIFIED:
- `מזונות משותפת`
- `הפחתת מזונות`
- `שינוי מזונות`
- `הלכת המזונות החדשה`
- `בע"מ 919/15`
- `משמורת בלעדית לאם`
- `חקירה במשטרה`
- `עבירות סמים`
- `נהיגה בשכרות`
- `עורך דין נהיגה בשכרות`

## Main Findings

VERIFIED:
- `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה` and `בע"מ 919/15` returned no visible rows in the checked Pages tab.
- `משמורת בלעדית לאם` has `107` impressions, `0` clicks, `0%` CTR and average position `9.6`; all visible impressions map to an old case-law URL.
- `חקירה במשטרה` returned no visible rows in this checked filter.
- `עבירות סמים` has only `2` impressions: one on `https://jus-tice.co.il/decision6077-20/` and one on the old Hebrew criminal-lawyer URL.
- `נהיגה בשכרות` has `7` impressions and maps to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`.
- `עורך דין נהיגה בשכרות` also has `7` impressions and maps to the same will-revocation URL.

## Interpretation

REVIEW:
- Child-support modification/shared-custody variants currently have no visible GSC signal in this pass. That does not mean the topics lack search demand; it means Jus-Tice has no visible current signal for these exact filters.
- Sole-custody-for-mother is a real opportunity and migration-risk URL. The old case-law page should be protected until a practical `/child-custody/` support strategy is approved.
- Police-investigation and drug-offense support evidence remains weak in this pass; do not create duplicate criminal support pages from these rows alone.
- Drunk-driving is a wrong-page-match problem. The will-revocation page must not be optimized for traffic-law intent; the traffic cluster needs a reviewed support page plan.

## Recommended Next Step

RECOMMENDED:
- Update the child-custody owner packet with the sole-custody old-URL risk before any merge/redirect decision.
- Keep child-support modification variants in the queue for later SERP/source review, but do not prioritize from GSC alone.
- Keep `drug-offenses` and `police-investigation` as criminal support candidates, but require old-content inventory and source/legal review first.
- Treat `drunk-driving` as a low-sample but clear wrong-page signal for traffic-law internal-link and support-page planning.

## Safety

BLOCKED:
- No old URL should be redirected from this evidence alone.
- No will, custody, criminal or traffic page should be rewritten from this evidence alone.
- No clean English slug should be made primary without source, content-quality, internal-link and owner review.
- No public content body, URL slug, redirect, noindex, canonical, sitemap inclusion, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting or database row was changed.
