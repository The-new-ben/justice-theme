# GSC Targeted Query Pass 3

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY
Property checked: `https://jus-tice.co.il/`
Date range: Last 3 months
GSC report: Performance > Search results
Breakdown used: Pages

## Purpose

This pass checks criminal-law and traffic-law support variants from the targeted query queue.

It does not approve content rewrites, URL changes, 301 redirects, noindex, canonical changes, sitemap changes, menu changes or CMS writes.

## Evidence Created

VERIFIED:
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`
- `project-control/visual-evidence/gsc-targeted-pass3-indictment-netanyahu-url-2026-05-11.png`
- `project-control/visual-evidence/gsc-targeted-pass3-drunk-driving-lawyer-wrong-page-2026-05-11.png`

## Queries Checked

VERIFIED:
- `זכויות חשוד`
- `כתב אישום`
- `מעצר ימים`
- `סגירת תיק פלילי`
- `עורך דין עבירות סמים`
- `עורך דין נהיגה בשכרות`
- `פסילה מנהלית`
- `שלילת רישיון נהיגה`

## Main Findings

VERIFIED:
- `זכויות חשוד`, `מעצר ימים`, `סגירת תיק פלילי`, `עורך דין עבירות סמים`, `פסילה מנהלית`, and `שלילת רישיון נהיגה` returned no visible rows in the checked filters.
- `כתב אישום` has `4` total impressions, `0` clicks, `0%` CTR and average position `24.8`.
- The visible `כתב אישום` pages are a specific Netanyahu indictment page with `3` impressions and position `9.7`, plus the homepage with `1` impression and position `70.0`.
- `עורך דין נהיגה בשכרות` has `7` impressions, all mapped to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, confirming the wrong-page traffic-law match.

## Interpretation

REVIEW:
- Criminal support pages for suspect rights, detention, case closure and lawyer-intent drug offenses do not currently have visible GSC ownership in these exact filters.
- The `כתב אישום` signal is tiny and specific-case driven. The Netanyahu indictment page should not be treated as the general indictment pillar.
- The homepage should not be treated as an indictment support page from a single impression.
- Drunk-driving lawyer intent still maps to a will-revocation article. This is not a reason to alter the will page; it is a traffic-law support gap to handle later.

## Recommended Next Step

Move from query evidence to cluster decision packets for:

- criminal-law support map: `/criminal-lawyer/`, `/indictment/`, `/police-investigation/`, `/drug-offenses/`.
- traffic-law support map: `/traffic-lawyer/`, `/drunk-driving/`, `/license-suspension/`.

Before creating or rewriting anything, compare existing URLs, content quality, GSC evidence, internal links and SERP intent.

## Safety

BLOCKED:
- No old URL should be redirected from this evidence alone.
- No clean English slug should be made primary without source, content-quality, internal-link and owner review.
- No public content body, URL slug, redirect, noindex, canonical, sitemap inclusion, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting or database row was changed.
