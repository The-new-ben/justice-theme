# Medical Malpractice GSC Export Runner - 2026-05-22

## Status

FIXED / VERIFIED LOCAL / API EXECUTION BLOCKED UNTIL OWNER CREDENTIAL SETUP / NO PUBLIC CHANGES.

This is a read-only Google Search Console workflow for the Medical Malpractice cluster. It does not change WordPress, URLs, redirects, canonicals, noindex, taxonomy, sitemap, internal links, lawyer records, leads or CRM.

## Files Added

- `tools/gsc/gsc-medical-malpractice-export.js`
- `tools/gsc/run-medical-malpractice-gsc-export.ps1`
- `tools/build-medical-malpractice-gsc-decision-map.mjs`

## Dry Run Verification

VERIFIED LOCAL:

```powershell
.\tools\gsc\run-medical-malpractice-gsc-export.ps1 -DryRun
```

Dry run confirmed:

- `1` primary target path.
- `73` protected/source paths from the dashboard scope.
- `10` route candidate paths.
- `8` boundary/excluded paths.
- `22` Medical Malpractice query terms.
- No credential contents read.
- No OAuth browser opened.
- No GSC API call made.

## Baseline Decision Map

VERIFIED LOCAL:

```powershell
node tools/build-medical-malpractice-gsc-decision-map.mjs --reportDate=2026-05-22
```

Generated baseline outputs:

- `reports/medical-malpractice-gsc-decision-map-2026-05-22.csv`
- `reports/medical-malpractice-protected-url-decision-map-2026-05-22.csv`
- `reports/medical-malpractice-cannibalization-decision-map-2026-05-22.csv`
- `reports/medical-malpractice-gsc-decision-map-2026-05-22.json`
- `project-control/medical-malpractice-gsc-decision-map-2026-05-22.csv`
- `project-control/medical-malpractice-gsc-decision-map-2026-05-22.md`

Baseline counts:

- `187` decision rows.
- `1` primary target row.
- `178` protected/source/review rows.
- `8` source/legal gate rows.
- `26` high/protected/unknown-GSC risk rows.
- `1` cannibalization row.

## How To Run After Owner Credentials

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\run-medical-malpractice-gsc-export.ps1 -DryRun
.\tools\gsc\run-medical-malpractice-gsc-export.ps1
```

The full wrapper will run the read-only export and then build decision maps for the same report date.

## Review Before Any Public Action

BLOCKED until reviewed:

- Duplicate `/medical-malpractice-lawyer/` CMS identity.
- Focused GSC query/page ownership.
- Protected support pages with impressions/clicks.
- Clean slug route candidates such as `/birth-malpractice/`, `/pregnancy-malpractice/`, `/diagnosis-malpractice/`.
- Source/legal/privacy gates for medical causation, experts, costs and lead intake.
- Redirect, canonical, noindex, sitemap and internal-link decisions.

## Safety

NOT VERIFIED FINAL: the generated decision map is baseline-only until the focused GSC export runs.

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
