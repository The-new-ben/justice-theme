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

## 2026-05-11 SERP Evidence Pass

VERIFIED:
- `עורך דין פלילי` is dominated by specialist criminal-defense service pages with urgency, credibility signals, consultation CTAs and sections for investigation, arrest, indictment and offense types.
- `דין פלילי` is broader than lawyer-hiring and should not become a competing second pillar unless owner approval separates the intent clearly.
- `חקירה במשטרה`, `כתב אישום`, and `מעצר ימים` are valid support intents, but each requires old-content comparison and legal/source review before clean URL execution.
- `עבירות סמים` must start from the existing `drug-offenses-criminal-lawyer/` asset rather than a new duplicate page.

DECISION IMPACT:
- Keep `/criminal-lawyer/` as the strategic pillar target.
- Compare old Hebrew criminal-lawyer pages and existing criminal support pages before any new clean URL, merge or redirect decision.
- Next step is an owner-approval packet, not execution.

See:
- `project-control/serp-criminal-traffic-review-2026-05-11.md`
- `project-control/serp-criminal-traffic-review-2026-05-11.csv`

## 2026-05-11 Owner Approval Packet

CREATED:
- `project-control/criminal-law-owner-approval-packet.md`
- `project-control/criminal-law-owner-approval-packet.csv`

RECOMMENDED:
- Do not approve criminal-law URL migration yet.
- Approve primary-selection and consolidation planning first.
- Compare the existing clean `/criminal-defense-attorney/` page, the old Hebrew GSC-signal page, and the future `/criminal-lawyer/` target before choosing a primary.

BLOCKED:
- No public content edits, slugs, redirects, canonicals, sitemap updates, noindex changes or CMS writes until owner approval.

## 2026-05-11 Traffic / Criminal Wrong-Page Decision Packet

CREATED:
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`
- `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.csv`

VERIFIED:
- `כתב אישום` maps to a specific Netanyahu indictment page and homepage in the latest targeted pass, not to a general indictment primary.
- Criminal support topics remain in review lanes before any clean slug migration.

BLOCKED:
- No public criminal-law content expansion, internal-link batch, slug migration, redirect, canonical, noindex, sitemap or title/H1/meta change is approved by this packet.

## CSV Detail

See `project-control/criminal-law-support-review.csv`.

## 2026-05-11 Criminal Law Source/Legal Checklist

CREATED:
- `project-control/criminal-law-source-legal-checklist-2026-05-11.md`
- `project-control/criminal-law-source-legal-checklist-2026-05-11.csv`

VERIFIED:
- `5` criminal-law page/topic gates were mapped for current criminal pillar, police investigation, indictment, detention and drug offenses.
- Source anchors and limitations are documented before final Hebrew drafting.
- Allowed claims, blocked claims, privacy/confidentiality risk, disclaimer requirement and approval status are mapped per target.

NEXT:
- Prepare a no-URL-change internal-link map for the same five targets.

BLOCKED:
- No public criminal-law content expansion, title/H1/meta change, internal-link batch, slug migration, redirect, canonical, noindex, sitemap or taxonomy/category change is approved by this checklist.

## 2026-05-11 Criminal Law No-URL-Change Outline Queue

CREATED:
- `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.md`
- `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.csv`

VERIFIED:
- `5` outline targets were prepared across `6` current URLs.
- Current planning primary: `/criminal-defense-attorney/`.
- First support lanes: police investigation, indictment, detention and drug offenses.
- Future clean slugs remain blocked: `/criminal-lawyer/`, `/police-investigation/`, `/indictment/`, `/pretrial-detention/`, `/drug-offenses/`.

CONTENT-UPLOAD READINESS:
- The first criminal-law upload group now has review-only section structures, internal-link posture, semantic related-content rules, CTA/lawyer-card safety rules and sitemap posture.

NEXT:
- Prepare source/legal checklist or no-URL-change internal-link map before final Hebrew copy or CMS upload.

BLOCKED:
- No public criminal-law content expansion, title/H1/meta change, internal-link batch, slug migration, redirect, canonical, noindex, sitemap or taxonomy/category change is approved by this queue.

## 2026-05-11 Criminal Law Primary Selection Review

CREATED:
- `project-control/criminal-law-primary-selection-2026-05-11.md`
- `project-control/criminal-law-primary-selection-2026-05-11.csv`
- `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`
- `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`

VERIFIED LIVE:
- `/criminal-defense-attorney/` is the current no-URL-change planning primary because it returns `200 OK`, self-canonicalizes and has criminal-lawyer title/H1 signals.
- `/criminal-lawyer/`, the old Hebrew broad criminal-lawyer URL and the sampled legacy deep criminal-law URL currently redirect to the homepage.

DECISION:
- Keep `/criminal-lawyer/` as a future strategic slug only.
- Do not use `/criminal-lawyer/` in sitemap, menus, breadcrumbs, internal links, related cards, canonicals or redirects until route repair and owner approval.

BLOCKED:
- No public criminal-law content expansion, title/H1/meta change, internal-link batch, slug migration, redirect, canonical, noindex, sitemap or taxonomy/category change is approved by this review.

## 2026-05-11 Criminal Law Content Upload Readiness Batch

CREATED:
- `project-control/criminal-law-content-upload-readiness-2026-05-11.md`
- `project-control/criminal-law-content-upload-readiness-2026-05-11.csv`

VERIFIED:
- `220` raw criminal-adjacent inventory candidates were extracted.
- `50` higher-value candidates were mapped into upload-readiness lanes.
- `/criminal-defense-attorney/` is the current clean-ish primary candidate to compare.
- `/criminal-lawyer/` remains the future strategic pillar target, but no migration is approved.
- The old Hebrew GSC-visible criminal-lawyer URL must remain protected until the redirect and internal-link map are owner-approved.
- Support lanes are now mapped for police investigation, indictment, detention, drug offenses, sex offenses, economic/white-collar crime, tax offenses, criminal records and criminal defenses.

BLOCKED:
- No public criminal-law content expansion, title/H1/meta change, internal-link batch, slug migration, redirect, canonical, noindex, sitemap or taxonomy/category change is approved by this batch.
