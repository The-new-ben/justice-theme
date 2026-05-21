# GSC Family/Divorce Export Runner - 2026-05-21

Status: FIXED / VERIFIED LOCAL / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL ROTATION

## What Was Added

- Created `tools/gsc/gsc-family-divorce-export.js`.
- Added a dry-run mode that verifies paths and export scope without reading credential contents, opening OAuth, or calling the API.
- Added environment-variable support for local credential and token paths:
  - `GSC_OAUTH_CLIENT_PATH`
  - `GSC_TOKEN_PATH`
  - `GSC_SITE_URL`
  - `GSC_OUTPUT_DIR`
  - `GSC_DAYS`
  - `GSC_MAX_ROWS`
  - `GSC_END_DATE`
  - `GSC_AUTH_PORT`
- Kept the older broad GSC scripts unchanged.

## Family/Divorce Scope

VERIFIED: the runner is scoped to:

- `7` clean upload targets:
  - `/divorce-lawyer/`
  - `/consensual-divorce/`
  - `/divorce-mediation/`
  - `/divorce-property-division/`
  - `/family-dispute-resolution/`
  - `/child-support/`
  - `/child-custody/`
- `18` protected source or asset paths from the Family/Divorce live pre-upload guard.
- `18` query terms covering Hebrew Family/Divorce priority terms plus English fallback variants.

## Output Files

When credentials are ready, the runner writes to:

`reports/gsc/family-divorce-YYYY-MM-DD/`

Expected files:

- `gsc-sites-visible.csv`
- `family-divorce-pages.csv`
- `family-divorce-query-page.csv`
- `family-divorce-cannibalization.csv`
- `family-divorce-protected-sources.csv`
- `family-divorce-summary.json`

## Owner Run Command

PowerShell example after owner creates or rotates the OAuth Desktop client:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
node tools/gsc/gsc-family-divorce-export.js --dry-run
node tools/gsc/gsc-family-divorce-export.js
```

If the dry run shows `credentialFileExists: false`, fix the path before running the real export.

## Verification Completed

- VERIFIED LOCAL: `node --check tools/gsc/gsc-family-divorce-export.js` passed.
- VERIFIED LOCAL: `node tools/gsc/gsc-family-divorce-export.js --dry-run` passed.
- VERIFIED LOCAL: dry run reported `7` target paths, `18` protected source paths and `18` query terms.
- VERIFIED LOCAL: dry run did not read credential contents, did not open OAuth and did not call the Search Console API.

## Blockers

- BLOCKED: actual GSC export was not run because owner still needs to rotate or provide the local OAuth Desktop credential path.
- BLOCKED: Family/Divorce URL migration, redirects, canonical/noindex decisions and sitemap changes still require this export.
- NOT VERIFIED API: no live GSC rows were exported in this cycle.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
