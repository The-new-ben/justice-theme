# GSC Targeted Query Pass

Date: 2026-05-11
Status: IN PROGRESS / REVIEW ONLY
Property checked: `https://jus-tice.co.il/`
Date range: Last 3 months
GSC report: Performance > Search results
Breakdown used: Pages

## Purpose

This pass checks the first queries from `project-control/targeted-gsc-query-queue.csv`.

It does not approve content rewrites, URL changes, 301 redirects, noindex, canonical changes, sitemap changes, document removal, menu changes or CMS writes.

## Evidence Created

VERIFIED:
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`
- `project-control/visual-evidence/gsc-targeted-child-support-pages-2026-05-11.png`
- `project-control/visual-evidence/gsc-targeted-child-support-pages-2026-05-11-full.png`
- `project-control/visual-evidence/gsc-targeted-child-support-pages-table-2026-05-11.png`

## Queries Checked

VERIFIED:
- `מזונות ילדים`
- `חישוב מזונות`
- `מחשבון מזונות`
- `בעמ 919/15`
- `משמורת ילדים`
- `עורך דין דיני עבודה`
- `דיני עבודה`
- `עורך דין ירושה`
- `עורך דין צוואות וירושות`
- `עורך דין תאונות דרכים`

## Main Findings

VERIFIED:
- `מזונות ילדים` has `160` impressions and `0` clicks. All visible impressions map to `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`.
- `חישוב מזונות` has `131` impressions and `0` clicks. All visible impressions map to the same old calculator URL.
- `מחשבון מזונות` has `70` impressions and `0` clicks. All visible impressions map to the same old calculator URL.
- `בעמ 919/15` returned no visible rows for this exact filter.
- `משמורת ילדים` has `611` impressions and `0` clicks. Visible URLs are `https://jus-tice.co.il/what-is-child-custody/` and `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`.
- `עורך דין דיני עבודה` has `88` impressions and `0` clicks. Visible URLs are the homepage and `https://jus-tice.co.il/labor-lawyer/`.
- `דיני עבודה` has `614` impressions and `0` clicks. The dominant visible URL is `https://jus-tice.co.il/israeli-labor-law/` with `472` impressions.
- `עורך דין ירושה` returned no visible rows.
- `עורך דין צוואות וירושות` returned no visible rows.
- `עורך דין תאונות דרכים` has `2` impressions and `0` clicks, mapped to `https://jus-tice.co.il/car-accident-auto-injury-lawyer/`.

## Interpretation

REVIEW:
- Child support is not currently owned by `/child-support/` in GSC for the checked variants. The old calculator URL is a traffic-risk/support/tool candidate and must not be removed or redirected blindly.
- Child custody is not currently owned by `/child-custody/` for the broad checked query. A public guide URL and a PDF are receiving impressions, so document handling is part of the migration plan.
- Employment has a split between homepage, `/labor-lawyer/`, and informational/support/case-law pages. This points to a weak primary page and a cluster-splitting need, not an immediate rewrite.
- Inheritance-lawyer intent still has no visible signal for the exact checked filters; adjacent will queries from the earlier pass remain more useful for the cluster.
- Car accident lawyer intent is low sample, but the existing car-accident URL should be preserved until a controlled URL decision is approved.

## Recommended Next Step

Run the second family-law/legal-support pass:

- `מזונות משותפת`
- `הפחתת מזונות`
- `שינוי מזונות`
- `הלכת המזונות החדשה`
- `בע"מ 919/15`
- `משמורת בלעדית לאם`
- `חקירה במשטרה`
- `עבירות סמים`
- `נהיגה בשכרות`

Then update the same GSC maps and topic packets.

## Safety

BLOCKED:
- No old URL should be redirected from this evidence alone.
- No document/PDF URL should be removed from this evidence alone.
- No clean English slug should be made primary without source, content-quality, internal-link and owner review.
- No public content body, URL slug, redirect, noindex, canonical, sitemap inclusion, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting or database row was changed.
