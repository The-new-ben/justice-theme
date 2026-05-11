# GSC Targeted Query Pass 2

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY
Property checked: `https://jus-tice.co.il/`
Date range: Last 3 months
GSC report: Performance > Search results
Breakdown used: Pages

## Purpose

This pass continues the targeted query queue after the first child-support/custody/employment pass.

It does not approve content rewrites, URL changes, 301 redirects, noindex, canonical changes, sitemap changes, document removal, menu changes or CMS writes.

## Evidence Created

VERIFIED:
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`
- `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-2026-05-11.png`
- `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-table-2026-05-11.png`
- `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-2026-05-11.png`
- `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-table-2026-05-11.png`

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

## Main Findings

VERIFIED:
- `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה`, and `בע"מ 919/15` returned no visible rows in the checked browser filters.
- `משמורת בלעדית לאם` has `107` impressions, `0` clicks, `0%` CTR, and average position `9.6`.
- The visible page for `משמורת בלעדית לאם` is `https://jus-tice.co.il/משמורת-בלעדית-לאם-ושיתופיות-יחסית-במסגרת-איזון-משאבים-תלהמ-37049-07-18/`.
- `חקירה במשטרה` returned no visible rows in the checked browser filter.
- `עבירות סמים` has only `2` impressions, split between `https://jus-tice.co.il/decision6077-20/` and `https://jus-tice.co.il/משרד-עורכי-דין-פלילי-הכי-טוב-תל-אביב/`.
- `נהיגה בשכרות` has `7` impressions, all mapped to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, which is a wrong-page match for traffic-law intent.

## Interpretation

REVIEW:
- The second child-support sub-variants did not show visible GSC ownership. This reduces urgency for those exact terms, but does not remove the broader child-support risk already found for `מזונות ילדים`, `חישוב מזונות`, and `מחשבון מזונות`.
- The sole-mother custody query is a high-position old Hebrew case-law URL. It should be protected and treated as support/merge-review material under the future child-custody guide, not redirected or removed blindly.
- Police investigation has no visible query signal in this pass. A future `/police-investigation/` page can still be strategic, but this filter alone does not justify priority.
- Drug offenses have very low sample data and no clear clean support article ownership. Treat as a criminal-law support gap to review later.
- Drunk driving still shows a wrong-page match to a will-revocation article. Do not optimize the will page for traffic-law. Build a proper traffic-law support page only after checking existing traffic content and internal links.

## Recommended Next Step

Run the third targeted GSC pass for higher-value criminal and traffic variants:

- `זכויות חשוד`
- `כתב אישום`
- `מעצר ימים`
- `סגירת תיק פלילי`
- `עורך דין עבירות סמים`
- `עורך דין נהיגה בשכרות`
- `פסילה מנהלית`
- `שלילת רישיון נהיגה`

Then update the criminal-law, traffic-law and content-decision maps.

## Safety

BLOCKED:
- No old URL should be redirected from this evidence alone.
- No document/PDF URL should be removed from this evidence alone.
- No clean English slug should be made primary without source, content-quality, internal-link and owner review.
- No public content body, URL slug, redirect, noindex, canonical, sitemap inclusion, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting or database row was changed.
