# Criminal GSC Export Runner - 2026-05-22

## Status
- FIXED / VERIFIED LOCAL: a focused read-only Criminal Law Search Console export runner now exists.
- PUBLIC EXECUTION BLOCKED: this does not approve CMS upload, URL migration, redirects, canonical changes, noindex changes, sitemap edits, taxonomy edits or internal-link writes.
- API EXECUTION BLOCKED: real export still requires owner OAuth/GSC token approval.

## Files Created
- `tools/gsc/gsc-criminal-export.js`
- `tools/gsc/run-criminal-gsc-export.ps1`

## Scope
- Criminal first-upload targets: `5`.
- Protected/support/redirect-risk paths: `20`.
- Query terms: `27`.
- Default output directory: `reports/gsc/criminal-law-YYYY-MM-DD/`.

## Export Outputs
After owner credentials are configured, the runner creates:

- `criminal-law-pages.csv`
- `criminal-law-query-page.csv`
- `criminal-law-cannibalization.csv`
- `criminal-law-protected-sources.csv`
- `criminal-law-summary.json`
- `gsc-sites-visible.csv`

## Commands
Dry run:

```powershell
.\tools\gsc\run-criminal-gsc-export.ps1 -DryRun
```

Full read-only export after owner OAuth setup:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\run-criminal-gsc-export.ps1
```

Manual node command:

```powershell
node tools/gsc/gsc-criminal-export.js --dry-run
node tools/gsc/gsc-criminal-export.js
```

## Verification
- VERIFIED LOCAL: `node --check tools/gsc/gsc-criminal-export.js` passed.
- VERIFIED LOCAL: `node tools/gsc/gsc-criminal-export.js --dry-run` passed.
- VERIFIED LOCAL: `.\tools\gsc\run-criminal-gsc-export.ps1 -DryRun` passed.
- VERIFIED LOCAL: dry run reported `5` target paths, `20` protected/support paths and `27` query terms.
- VERIFIED LOCAL: dry run did not read credential contents, open OAuth browser or call GSC API.

## How To Use The Export
Review these files before any Criminal URL decision:

1. `criminal-law-query-page.csv` for query/page ownership and wrong-page routing.
2. `criminal-law-cannibalization.csv` for queries ranking with multiple pages.
3. `criminal-law-protected-sources.csv` for old/support pages that must not be redirected or overwritten blindly.
4. `criminal-law-pages.csv` for current path-level clicks/impressions.
5. `criminal-law-summary.json` for row counts and export metadata.

## Decisions This Enables Later
- Whether `/criminal-defense-attorney/` should remain the current Criminal pillar until migration.
- Whether `/criminal-lawyer/` has any GSC signal despite currently being a blocked route fallback.
- Which old criminal-defense URLs need targeted 301 planning instead of homepage fallback.
- Which Criminal support pages are strong enough to preserve, rewrite or link from the pillar.
- Whether police investigation, detention, indictment and drug-offenses pages have query overlap before upload.

## Blocked
- BLOCKED: owner OAuth approval and real GSC token.
- BLOCKED: URL migration and redirect decisions until export rows are reviewed.
- BLOCKED: public CMS upload until owner/legal/source approval and WordPress rollback backups are complete.

## Safety
No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
