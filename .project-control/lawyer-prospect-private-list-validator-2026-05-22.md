# Lawyer Prospect Private List Validator - 2026-05-22

Status: FIXED TOOLING / VERIFIED LOCAL / PRIVATE DATA NOT STORED / NO OUTREACH

## Purpose

The first lawyer acquisition wave needs a real first-20 prospect list, but names, phone numbers, emails and contact-source notes should not be stored in this repo. The new validator lets the owner fill a private CSV outside Git and check whether it is ready for manual CRM/admin entry.

## Files

- `tools/validate-lawyer-prospect-private-list.ps1`
- `project-control/lawyer-prospect-private-list-validator-2026-05-22.md`
- `project-control/lawyer-prospect-private-list-validator-2026-05-22.csv`
- `reports/lawyer-prospect-private-list-template-validation-2026-05-22.csv`

## Owner Workflow

1. Copy `project-control/lawyer-acquisition-first-wave-template-2026-05-20.csv` to a private folder outside this repository.
2. Fill the private copy with the first 20 lawyers.
3. Use ISO dates: `YYYY-MM-DD`.
4. Keep `practice_area`, `has_website`, `has_profile_photo`, `plan_fit` and `outreach_status` inside the approved values.
5. Run:

```powershell
.\tools\validate-lawyer-prospect-private-list.ps1 -Path C:\PRIVATE\lawyer-first-20.csv -ReportPath reports\lawyer-prospect-private-list-validation-local.csv
```

6. Fix any `ERROR` rows in the private file.
7. After validation passes, enter the prospects manually in WordPress admin: `Lawyer Onboarding -> Lawyer Prospects`.

## Validated Fields

- Required headers match the first-wave template.
- The first wave normally has exactly `20` rows.
- Slots must be unique numbers.
- Practice areas must match the approved wave-1 taxonomy.
- Actual private list mode requires city, lawyer name and contact source.
- Review counts must be blank or non-negative integers.
- Dates must be blank or ISO `YYYY-MM-DD`.
- Website/photo values must be `yes`, `no` or `unknown`.
- Plan and outreach statuses must use approved values.

## Privacy Boundary

VERIFIED:
- The validator refuses repo-local private input by default.
- `-AllowRepoPath` is only for checking the blank template in this repo.
- The generated report contains row numbers and issue codes only, not names, phone numbers, emails or contact details.

BLOCKED:
- Do not commit a filled prospect list.
- Do not store private lawyer names, phone numbers, emails or source notes in project-control.
- Do not send outreach from this repo.

## Verification

VERIFIED LOCAL:
- Template validation passed in `-TemplateMode` with `20` rows.
- Sanitized validation report was generated at `reports/lawyer-prospect-private-list-template-validation-2026-05-22.csv`.
- The report contains no private prospect data.

## Next Step

Owner fills the private first-20 file outside Git, validates it, then enters reachable prospects manually into the private WordPress prospect CRM.

## Safety

No public CMS page, database row, lawyer record, lead record, prospect record, payment setting, redirect, sitemap, taxonomy, GSC/GA4 setting, wp-admin setting, uPress deployment or outreach message was changed.
