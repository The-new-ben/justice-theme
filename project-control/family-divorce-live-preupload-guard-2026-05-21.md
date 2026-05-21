# Family/Divorce Live Pre-Upload Guard - 2026-05-21

## Status

- VERIFIED TOOLING: added `tools/check-family-divorce-live-preupload.mjs`.
- VERIFIED LIVE / READ ONLY: checked `25` Family/Divorce URLs on `https://jus-tice.co.il`.
- GENERATED: `reports/family-divorce-live-preupload-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-live-preupload-guard-2026-05-21.csv`.
- NOT PUBLISHED: no CMS body, URL, redirect, canonical, noindex, sitemap, taxonomy or database change was made.

## Batch Completed

The guard checks three groups:

- `7` clean target URLs for the controlled Family/Divorce upload set.
- `17` protected P0 Family/Divorce source URLs from the GSC support-to-hub map.
- `1` protected DOCX asset URL.

Result counts:

- `13` PASS.
- `7` LIVE_PRESENT_REVIEW.
- `5` CONFLICT.

## Clean Target Findings

All seven clean target URLs currently return `200` on their own final paths and self-canonicalize:

- `/divorce-lawyer/`
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/divorce-property-division/`
- `/family-dispute-resolution/`
- `/child-support/`
- `/child-custody/`

Status: LIVE_PRESENT_REVIEW.

Meaning: these are not empty upload slots. Before any CMS overwrite or update, export/backup the current live page body, title, H1, meta, canonical and internal links. The current live pages appear indexable, so replacing them is a content-update operation, not a first-time publication operation.

## Protected Source Findings

PASS: `12` protected source URLs remain reachable as their own pages:

- `/free-divorce-agreement-template/`
- `/joint-custody-shared-parenting/`
- `/child-custody-modification/`
- `/divorce-costs-2025/`
- `/living-apart-together-legal-rights/`
- `/request-for-family-dispute-settlements/`
- `/divorce-mediation-basics/`
- `/cohabitation-property-rights-for-unmarried-couples/`
- `/how-much-does-a-divorce-agreement-cost/`
- `/divorce-everything-you-need-to-know/`
- `/trusted-divorce-attorney-guide/`
- `/strategic-divorce-cost-planning/`

PASS: the protected DOCX asset remains reachable:

- `/wp-content/uploads/2021/03/%D7%A0%D7%95%D7%A1%D7%97-%D7%94%D7%A1%D7%9B%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%93%D7%95%D7%92%D7%9E%D7%90-2021.docx`

CONFLICT: `5` protected source URLs return an initial `301` to the homepage and then serve homepage HTML:

- `/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-%D7%9E%D7%96%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%9C%D7%93%D7%99%D7%9D`
- `/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%A2%D7%93%D7%9B%D7%A0%D7%99-%D7%9C%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F`
- `/%D7%A2%D7%95%D7%93-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%95%D7%9E%D7%9C%D7%A5-%D7%9B%D7%99%D7%A6%D7%93-%D7%9C%D7%9E%D7%A6%D7%95%D7%90-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%95%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%94%D7%AA%D7%92%D7%A8%D7%A9`
- `/%D7%92%D7%99%D7%A9%D7%95%D7%A8-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%9E%D7%94-%D7%96%D7%94-%D7%95%D7%90%D7%99%D7%9A-%D7%94%D7%AA%D7%94%D7%9C%D7%99%D7%9A-%D7%A2%D7%95%D7%91%D7%93`
- `/what-is-child-custody/`

## Upload Readiness Impact

- READY: the clean target slugs are live and technically reachable.
- READY: `13` protected URLs/assets can be preserved or internally linked after upload.
- BLOCKED: the `5` homepage-redirecting protected sources need a restore/redirect decision before Family/Divorce URL migration is approved.
- BLOCKED: no redirect/canonical/noindex/sitemap action should be taken until the GSC API export confirms whether those five source URLs still carry traffic or impressions.

## Minimum Next Steps

1. Export/backup the seven current clean target pages before any CMS update.
2. Investigate the five homepage redirects in WordPress redirects, Permalink Manager, uPress/server rules and deleted/post status records.
3. For each of the five, decide one of: restore old article, update in place, or map to the correct new Family/Divorce target with a documented 301.
4. Rerun `node tools/check-family-divorce-live-preupload.mjs` after any route cleanup.
5. Only then approve the Family/Divorce CMS upload/update batch.

## Verification

- VERIFIED LOCAL: `node --check tools/check-family-divorce-live-preupload.mjs`.
- VERIFIED LIVE / READ ONLY WITH BLOCKERS: `$env:JUSTICE_WRITE_REPORT='1'; node tools/check-family-divorce-live-preupload.mjs` checked `25` URLs and wrote the report.
- BLOCKED LIVE: the checker exits non-zero because `5` protected source URLs redirect to the homepage.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
