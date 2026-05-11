# Criminal Law Support Decision Packet

Date: 2026-05-11
Status: VERIFIED / REVIEW ONLY / NO URL CHANGE

This packet turns the current criminal-law inventory and targeted GSC evidence into a controlled review plan. It does not approve publishing, slug changes, redirects, noindex, canonical changes, sitemap changes, menu changes or content replacement.

## Evidence Used

VERIFIED:
- `project-control/content-master-inventory.csv` from the public REST export.
- `project-control/url-migration-map.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/gsc-keyword-page-map.csv`.
- `project-control/gsc-cannibalization-review.csv`.
- `project-control/gsc-content-priorities.csv`.
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`.

NOT VERIFIED:
- Full authenticated WordPress postmeta and menus.
- GA4 conversion data.
- GSC API export for all query variants.
- Legal/source review of old criminal-law articles.

## Main Finding

VERIFIED: the criminal-law cluster needs a strong public pillar, but the current evidence does not approve immediate URL migration.

The broad criminal-lawyer queries currently point mainly to old Hebrew URLs and scattered support pages. The refreshed slug-conflict map shows `criminal-lawyer` has 13 conflict rows and no exact current clean `/criminal-lawyer/` URL in the public map. That means `/criminal-lawyer/` can remain the strategic target, but the primary page must be selected carefully.

## Proposed Structure For Review

Primary pillar candidate:
- `https://jus-tice.co.il/criminal-lawyer/`

Supporting articles to review:
- `https://jus-tice.co.il/police-investigation/`
- `https://jus-tice.co.il/indictment/`
- `https://jus-tice.co.il/pretrial-detention/`
- `https://jus-tice.co.il/drug-offenses/`
- future `suspect-rights` and `closing-criminal-case` only after SERP/inventory evidence.

Existing pages that must be compared first:
- `https://jus-tice.co.il/משרד-עורכי-דין-פלילי-הכי-טוב-תל-אביב/`
- `https://jus-tice.co.il/criminal-defense-attorney-roles-and-responsibilities/`
- `https://jus-tice.co.il/drug-offenses-criminal-lawyer/`
- `https://jus-tice.co.il/הכנה-לחקירה-במשטרה/`
- `https://jus-tice.co.il/articles/מחיקת-כתב-אישום-חזרה-מכתב-אישום-ביטול/`
- existing old arrest/detention case-law and guide pages mapped to `pretrial-detention`.

## Decision Notes

VERIFIED:
- `עורך דין פלילי` and `דין פלילי` are not cleanly owned by a clean criminal pillar.
- The old Hebrew criminal-lawyer page has visible impressions and must not be changed without a redirect plan.
- `חקירה במשטרה` returned no visible rows in the targeted filter.
- `כתב אישום` has only 4 impressions and maps to a specific Netanyahu indictment page plus homepage, not a general guide.
- `מעצר ימים`, `זכויות חשוד`, `סגירת תיק פלילי`, and `עורך דין עבירות סמים` returned no visible rows in the latest targeted filters.
- Broad `עבירות סמים` had only 2 impressions, split across a case-law page and an old criminal-lawyer page.
- `drug-offenses-criminal-lawyer/` already exists and is long, so a new `/drug-offenses/` page would be a duplicate unless a migration decision is approved.

IN PROGRESS:
- Select whether the criminal pillar should be created as a new clean page, rebuilt from an existing old URL, or assembled through a merge batch.
- Decide whether the existing drug-offenses article keeps its current slug or later redirects to `/drug-offenses/`.
- Decide the primary detention page before using `/pretrial-detention/`.

BLOCKED:
- URL changes.
- 301 redirects.
- Deleting old case-law pages.
- Replacing old pages with new content.
- Marking old pages noindex.
- Adding canonical changes.
- Adding sitemap changes.

## Recommended Next Action

1. Run SERP review for `עורך דין פלילי`, `דין פלילי`, `חקירה במשטרה`, `כתב אישום`, `מעצר ימים`, and `עבירות סמים`.
2. Compare the old criminal-lawyer pages by content quality and search intent.
3. Choose one primary criminal-lawyer URL for owner approval.
4. Only then prepare a redirect and internal-link batch.

## CSV Detail

See `project-control/criminal-law-support-review.csv`.

