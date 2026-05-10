# Google Search Console Connection Plan
Date: 2026-05-10

## Current Status
- NOT VERIFIED: Search Console property access for `jus-tice.co.il`.
- The owner says access exists through `mistabrajustice@gmail.com`.
- The current repo workflow has no authenticated GSC API token or service-account credential.

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

## Blocker
- BLOCKED: no authenticated GSC credential is available inside this repo session.

## Execution Path
1. Verify GSC property in browser.
2. Decide OAuth vs service account.
3. Add selected credential to GitHub Secrets.
4. Run the weekly workflow manually once.
5. Commit generated CSVs only if they contain real GSC data.
6. Use the data before approving any URL redirects.
