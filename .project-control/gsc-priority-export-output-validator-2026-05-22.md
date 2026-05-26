# GSC Priority Export Output Validator - 2026-05-22

## Status
- Result: BLOCKED_EXPORT_VALIDATION
- VERIFIED rows: 9
- REVIEW rows: 0
- BLOCKED rows: 21

## What This Checks
- Focused export directories under `reports/gsc/` for Family/Divorce, Criminal Law and Medical Malpractice.
- Required export CSV files, required columns and non-empty page/query/protected-source exports.
- Export summary JSON shape and report-date output directory.
- Decision-map CSV files and summary JSON.
- Decision maps must be rebuilt from `FOCUSED_GSC_EXPORT`; baseline dashboard/cache maps remain blocked.

## How To Run After OAuth Setup
```powershell
.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -ReportDate 2026-05-22
.\tools\gsc\check-priority-gsc-export-output.ps1 -ReportDate 2026-05-22 -WriteReport
```

## Result Rows

| Cluster | Artifact Type | Status | Severity | Rows | Artifact |
|---|---|---:|---:|---:|---|
| Family/Divorce | export-directory | BLOCKED_EXPORT_DIRECTORY_MISSING | BLOCKED | 0 | `reports\gsc\family-divorce-2026-05-22` |
| Family/Divorce | export-pages | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\family-divorce-2026-05-22\family-divorce-pages.csv` |
| Family/Divorce | export-query-page | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\family-divorce-2026-05-22\family-divorce-query-page.csv` |
| Family/Divorce | export-cannibalization | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\family-divorce-2026-05-22\family-divorce-cannibalization.csv` |
| Family/Divorce | export-protected-sources | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\family-divorce-2026-05-22\family-divorce-protected-sources.csv` |
| Family/Divorce | export-summary | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\family-divorce-2026-05-22\family-divorce-summary.json` |
| Family/Divorce | decision-map | VERIFIED_CSV_READY | OK | 25 | `reports\family-divorce-gsc-decision-map-2026-05-22.csv` |
| Family/Divorce | protected-decision-map | VERIFIED_CSV_READY | OK | 18 | `reports\family-divorce-protected-url-decision-map-2026-05-22.csv` |
| Family/Divorce | cannibalization-decision-map | VERIFIED_CSV_READY | OK | 40 | `reports\family-divorce-cannibalization-decision-map-2026-05-22.csv` |
| Family/Divorce | decision-map-summary | BLOCKED_DECISION_MAP_NOT_FOCUSED | BLOCKED | 0 | `reports\family-divorce-gsc-decision-map-2026-05-22.json` |
| Criminal Law | export-directory | BLOCKED_EXPORT_DIRECTORY_MISSING | BLOCKED | 0 | `reports\gsc\criminal-law-2026-05-22` |
| Criminal Law | export-pages | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\criminal-law-2026-05-22\criminal-law-pages.csv` |
| Criminal Law | export-query-page | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\criminal-law-2026-05-22\criminal-law-query-page.csv` |
| Criminal Law | export-cannibalization | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\criminal-law-2026-05-22\criminal-law-cannibalization.csv` |
| Criminal Law | export-protected-sources | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\criminal-law-2026-05-22\criminal-law-protected-sources.csv` |
| Criminal Law | export-summary | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\criminal-law-2026-05-22\criminal-law-summary.json` |
| Criminal Law | decision-map | VERIFIED_CSV_READY | OK | 25 | `reports\criminal-gsc-decision-map-2026-05-22.csv` |
| Criminal Law | protected-decision-map | VERIFIED_CSV_READY | OK | 20 | `reports\criminal-protected-url-decision-map-2026-05-22.csv` |
| Criminal Law | cannibalization-decision-map | VERIFIED_CSV_READY | OK | 8 | `reports\criminal-cannibalization-decision-map-2026-05-22.csv` |
| Criminal Law | decision-map-summary | BLOCKED_DECISION_MAP_NOT_FOCUSED | BLOCKED | 0 | `reports\criminal-gsc-decision-map-2026-05-22.json` |
| Medical Malpractice | export-directory | BLOCKED_EXPORT_DIRECTORY_MISSING | BLOCKED | 0 | `reports\gsc\medical-malpractice-2026-05-22` |
| Medical Malpractice | export-pages | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\medical-malpractice-2026-05-22\medical-malpractice-pages.csv` |
| Medical Malpractice | export-query-page | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\medical-malpractice-2026-05-22\medical-malpractice-query-page.csv` |
| Medical Malpractice | export-cannibalization | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\medical-malpractice-2026-05-22\medical-malpractice-cannibalization.csv` |
| Medical Malpractice | export-protected-sources | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\medical-malpractice-2026-05-22\medical-malpractice-protected-sources.csv` |
| Medical Malpractice | export-summary | BLOCKED_MISSING_FILE | BLOCKED | 0 | `reports\gsc\medical-malpractice-2026-05-22\medical-malpractice-summary.json` |
| Medical Malpractice | decision-map | VERIFIED_CSV_READY | OK | 187 | `reports\medical-malpractice-gsc-decision-map-2026-05-22.csv` |
| Medical Malpractice | protected-decision-map | VERIFIED_CSV_READY | OK | 178 | `reports\medical-malpractice-protected-url-decision-map-2026-05-22.csv` |
| Medical Malpractice | cannibalization-decision-map | VERIFIED_CSV_READY | OK | 1 | `reports\medical-malpractice-cannibalization-decision-map-2026-05-22.csv` |
| Medical Malpractice | decision-map-summary | BLOCKED_DECISION_MAP_NOT_FOCUSED | BLOCKED | 0 | `reports\medical-malpractice-gsc-decision-map-2026-05-22.json` |

## Safety
- VERIFIED: this validator is local/read-only. It does not call GSC, OAuth, WordPress, wp-admin, uPress or any public API.
- BLOCKED: this validator does not approve CMS upload, URL migration, redirects, canonicals/noindex, sitemap, taxonomy, internal-link, lawyer, lead or CRM actions.
- NEXT: fix every `BLOCKED_*` row before treating priority cluster decision maps as upload evidence.
