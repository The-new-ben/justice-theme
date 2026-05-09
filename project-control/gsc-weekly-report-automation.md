# GSC Weekly Report Automation
Date: 2026-05-09

## VERIFIED
- Added GitHub Actions workflow: `.github/workflows/gsc-weekly-report.yml`
- Added report generator: `tools/gsc_weekly_report.py`
- The workflow can run manually or weekly.
- Outputs are uploaded as GitHub Actions artifacts:
  - `project-control/gsc-opportunities.csv`
  - `project-control/gsc-low-ctr.csv`
  - `project-control/gsc-position-5-20.csv`
  - `project-control/gsc-cannibalization.csv`

## NOT VERIFIED
- Search Console property access.
- Service account access to `https://jus-tice.co.il/`.
- GitHub repository secrets.
- Real report output.

## Required Secrets
- `GSC_SITE_URL`
- `GSC_CLIENT_EMAIL`
- `GSC_PRIVATE_KEY`

## API Notes
- The Search Analytics API uses `POST /webmasters/v3/sites/{siteUrl}/searchAnalytics/query`.
- Useful dimensions for this project: `query`, `page`, `device`, `country`, `date`.
- Google notes the API returns top rows under Search Console internal limits, not a guaranteed complete export.

Sources:
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://developers.google.com/webmaster-tools/v1/searchanalytics

## Reports
- Low CTR: impressions >= 100 and CTR < 3%.
- Position 5-20: pages close enough to improve through title/content/internal links.
- Cannibalization: same query appearing with multiple pages.

## Next
1. Add service account secrets to GitHub.
2. Give the service account permission in Search Console.
3. Run the workflow manually.
4. Review artifact CSVs.
5. Convert recurring opportunities into tasks in `task-board.csv`.
