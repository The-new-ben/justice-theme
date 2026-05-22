# Priority Owner Action Queue - 2026-05-22

Status: BLOCKED_BEFORE_CONTENT_UPLOAD / NO PUBLIC CHANGES

## Summary

- VERIFIED LOCAL: consolidated 10 owner/operator action rows from current priority upload gates.
- REVIEWED: 139 source rows across GSC, Family/Divorce, Criminal Law and Medical Malpractice artifacts.
- BLOCKED: 10/10 action rows are blocked until owner/operator prerequisites are completed.
- NEXT OWNER ACTION: Complete read-only GSC OAuth setup outside Git, then run the priority cluster export runner.
- UPLOAD READINESS: no priority cluster is approved for public content upload from this queue alone.
- GOVERNANCE UPDATE: `project-control/content-upload-governance-checklist-2026-05-22.md` is now the master pre-upload checklist for cluster selection, current-URL updates, rollback, QA, monitoring and later migration approval.

## Queue

| # | Cluster | Priority | Status | Owner/operator action | Next step |
|---:|---|---|---|---|---|
| 1 | all_priority_clusters | P0 | BLOCKED_OWNER_SETUP | Complete read-only GSC OAuth setup outside Git | Set GSC_OAUTH_CLIENT_PATH and GSC_TOKEN_PATH, then run tools/gsc/run-priority-cluster-gsc-exports.ps1 |
| 2 | family_divorce | P0 | BLOCKED_OWNER_DECISION | Approve or hold visible current-URL repair only | Owner fills Family Law visible repair approval worksheet; SEO consolidation remains HOLD_PENDING_GSC. |
| 3 | family_divorce | P0 | BLOCKED_CMS_BACKUP | Capture actual WordPress rollback backup before approved visible repair | Operator completes the backup template after owner approval and before any editor save. |
| 4 | family_divorce | P0 | BLOCKED_UNTIL_APPROVAL_BACKUP_REPAIR | Execute approved visible repairs, then rerun live safety and diagnostics | Repair only raw shortcode/PDF/H1 visible defects; preserve current URLs and SEO migration decisions. |
| 5 | family_divorce | P0 | BLOCKED_GSC_EXPORT_REVIEW | Review focused Family/Divorce GSC decision maps after export | After priority GSC export, review family-divorce decision maps before any SEO consolidation. |
| 6 | criminal_law | P1 | BLOCKED_GSC_OWNER_LEGAL_SOURCE_REVIEW | Review Criminal owner/legal/source packet and metadata after focused GSC export | Owner marks APPROVE_CURRENT_URL_UPDATE, EDIT_REQUIRED, HOLD or LEGAL_REVIEW_REQUIRED per Criminal row. |
| 7 | criminal_law | P1 | BLOCKED_FOCUSED_GSC_FINALITY | Review Criminal protected URL/cannibalization maps | Keep clean slugs, redirects, canonicals/noindex and sitemap changes blocked until maps are final. |
| 8 | medical_malpractice | P1 | BLOCKED_WP_ADMIN_DB_CHECK | Verify authoritative CMS record for /medical-malpractice-lawyer/ | Operator runs inspection-only runbook and records KEEP_11607, KEEP_1130, MERGE_ASSETS or HOLD. |
| 9 | medical_malpractice | P1 | BLOCKED_OWNER_SOURCE_LEGAL_PRIVACY_REVIEW | Review Medical Malpractice owner/source/legal/privacy worksheet | Owner assigns approve/edit/hold/legal/privacy decisions before any CMS work. |
| 10 | all_priority_clusters | P0 | BLOCKED_UNTIL_PRIOR_ACTIONS_COMPLETE | Run final upload go/no-go review after owner gates clear | Update readiness dashboards and only then approve current-URL CMS uploads or later URL migration batches. |

## Files

- `reports/priority-owner-action-queue-2026-05-22.csv`
- `reports/priority-owner-action-queue-2026-05-22.json`
- `project-control/priority-owner-action-queue-2026-05-22.csv`
- `project-control/priority-owner-action-queue-2026-05-22.md`

## Safety

This is a repo-only planning queue. No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
