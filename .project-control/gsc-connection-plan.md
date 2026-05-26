# Google Search Console Connection Plan
Date: 2026-05-10

## Current Status
- VERIFIED: Search Console browser UI access works for the `https://jus-tice.co.il/` property.
- VERIFIED: the Performance / Search results report was opened in the browser and used for a first last-3-month cannibalization pass.
- NOT AVAILABLE: the current repo workflow has no authenticated GSC API token, service-account credential, or completed CSV export.

## Expected Property
- Preferred: Domain property `sc-domain:jus-tice.co.il`.
- Acceptable fallback: URL-prefix property `https://jus-tice.co.il/`.

## Access Needed
1. GSC owner/full-user access to the property.
2. Either OAuth consent in an authenticated browser or a Google Cloud service account added to the GSC property.
3. For automation: GitHub secret containing service account JSON or OAuth refresh token.

## API Endpoint
- Search Analytics API:
  - `POST https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`
- Dimensions:
  - `query`
  - `page`
  - `date`
  - `device`
  - `country`
- Metrics returned:
  - clicks
  - impressions
  - ctr
  - position

## Reports To Generate
- `project-control/gsc-opportunities.csv`: high impressions, positions 5-20.
- `project-control/gsc-low-ctr.csv`: high impressions, low CTR.
- `project-control/gsc-position-5-20.csv`: queries close to page one/top five.
- `project-control/gsc-cannibalization.csv`: same query across multiple URLs.
- `project-control/gsc-declining-pages.csv`: pages losing clicks/impressions.
- `project-control/internal-link-opportunities.csv`: pages needing links from related clusters.
- `project-control/url-migration-map.csv`: traffic risk for Hebrew-to-English slug migration.

## Existing Repo Work
- GSC report automation scaffold exists in `.github/workflows/gsc-weekly-report.yml` and supporting scripts.
- Local smoke test can generate BLOCKED placeholder CSVs without secrets, preventing fake data.
- Browser-only research docs now exist at `project-control/gsc-browser-workflow.md` and `project-control/gsc-cannibalization-method.md`.
- First manual GSC maps now exist at `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, and `project-control/gsc-content-priorities.csv`.

## Blocker
- BLOCKED: no API/export credential is available inside this repo session.
- PARTIAL: browser UI data can be reviewed manually, but download/export did not complete through the in-app browser.

## Execution Path
1. Continue manual browser checks for priority clusters.
2. Decide OAuth vs service account for automated exports.
3. Add selected credential to GitHub Secrets only after approval.
4. Run the weekly workflow manually once.
5. Commit generated CSVs only if they contain real GSC data.
6. Use GSC data before approving any URL redirects.
