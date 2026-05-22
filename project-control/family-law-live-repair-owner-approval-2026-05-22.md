# Family Law Live Repair Owner Approval - 2026-05-22

Status: VERIFIED PLANNING / OWNER DECISION PENDING / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

This worksheet converts the May 22 live Family/Divorce repair evidence into owner decisions. It is intentionally narrower than a content-upload approval. Approval here can authorize visible repairs on current URLs only after WordPress rollback capture. It does not approve URL migration, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, related-card writes, content-wave upload, lawyer-card changes, lead/CRM changes, media deletion, wp-admin setting changes or uPress deployment.

## Owner Decision Summary

Recommended safe decision for the next manual step:

- `APPROVE_VISIBLE_REPAIR_ONLY` for current-URL visible defects after CMS rollback backup.
- `HOLD_PENDING_GSC` for duplicate divorce-lawyer canonical/redirect/noindex/sitemap decisions.
- `HOLD_PROTECTED_ASSETS` for old source URLs, old documents, old PDFs and case-law assets.
- `REQUIRE_POST_REPAIR_QA` before marking Family/Divorce upload-safe.

If there is any legal/source concern on a specific page, use `LEGAL_SOURCE_REVIEW_REQUIRED` for that page and keep it out of the visible repair batch.

## Approve Now Only If These Conditions Are True

- Owner has explicitly approved visible current-URL repair.
- Operator has captured rollback fields from `project-control/family-law-live-repair-cms-backup-template-2026-05-22.md`.
- Repairs stay on the existing public URLs.
- SEO fields are frozen unless a separate GSC-backed owner decision exists.
- The operator will rerun the live safety checker and diagnostics after repair.
- Desktop and mobile screenshots will be captured after repair.

## Decisions To Record

| Approval ID | Target | Recommended owner decision | Allowed if approved | Must remain blocked |
|---|---|---|---|---|
| FLR-APPROVAL-001 | All affected pages | `APPROVE_VISIBLE_REPAIR_ONLY` or `HOLD_PUBLIC_REPAIR` | Start only the current-URL visible repair workflow after backup | Full content upload, URL migration and SEO consolidation |
| FLR-APPROVAL-002 | All affected pages | `REQUIRE_CMS_BACKUP_FIRST` | Capture rollback material before edits | Editing from public HTML evidence alone |
| FLR-APPROVAL-003 | `/divorce-agreement/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Remove/replace raw shortcode output | URL, canonical, robots, sitemap or taxonomy changes |
| FLR-APPROVAL-004 | `/divorce-agreement/` | `UPLOAD_VERIFIED_PDF` or `REMOVE_PDF_CTA_UNTIL_READY` | Use a working PDF or remove the promise | 404 PDF links and unverified download promises |
| FLR-APPROVAL-005 | `/divorce-agreement/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Repair H1 structure on current URL | Bundled SEO migration |
| FLR-APPROVAL-006 | `/divorce-lawyer/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Repair H1 structure on current URL | Canonical/redirect/noindex/sitemap decision |
| FLR-APPROVAL-007 | `/lawyer-divorce-guide-proceedings-costs-rights/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Repair H1 structure on current URL | Canonical/redirect/noindex/sitemap decision |
| FLR-APPROVAL-008 | `/child-support/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Repair H1/template structure on current URL | URL/taxonomy/internal-link changes |
| FLR-APPROVAL-009 | `/child-custody/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Repair H1/template structure on current URL | URL/taxonomy/internal-link changes |
| FLR-APPROVAL-010 | `/divorce-mediation/` | `APPROVE_VISIBLE_REPAIR_ONLY` | Repair H1/template structure on current URL | URL/taxonomy/internal-link changes |
| FLR-APPROVAL-011 | Divorce pillar candidates | `HOLD_PENDING_GSC` | Run/read focused GSC workflow only | Choosing canonical target from preference alone |
| FLR-APPROVAL-012 | Protected old URLs/assets | `HOLD_PROTECTED_ASSETS` | Preserve during visible repair | Delete, redirect, noindex or remove from sitemap |
| FLR-APPROVAL-013 | All repaired pages | `REQUIRE_POST_REPAIR_QA` | Rerun live checker/diagnostics and screenshots | Marking upload-safe from planning docs alone |

## Exact Approval Language

Use this text if approving only the visible repair batch:

`I approve current-URL visible repairs only for the May 22 Family/Divorce live repair batch, after WordPress rollback backup is captured. This approval does not authorize URL changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, protected asset changes, full content upload, lawyer-card changes, lead/CRM changes or uPress deployment.`

Use this text if holding:

`Hold public repair. Continue repo-only planning and do not change WordPress production pages.`

## Still Blocked After This Approval

- Focused Family/Divorce GSC export.
- Owner canonical decision between `/divorce-lawyer/` and `/lawyer-divorce-guide-proceedings-costs-rights/`.
- Redirect plan.
- Canonical/noindex/sitemap plan.
- Protected URL and protected asset handling.
- Full content upload/update wave.
- Category hierarchy changes.
- Related-content/internal-link writes.
- Legal/source review for any page flagged by owner.

## Verification Required After Approved Repair

- Fresh `tools/check-family-law-live-safety.mjs` output.
- Fresh `tools/extract-family-law-live-repair-diagnostics.mjs` output.
- HTTP 200 on repaired current URLs.
- Final path unchanged.
- Canonical and robots unchanged unless separately approved.
- Exactly one intended H1 per repaired page.
- No raw `justice_*` shortcode text.
- PDF link absent or verified as HTTP 200 with PDF content type.
- Desktop and mobile screenshots.
- Project-control docs updated with `VERIFIED`, `FIXED`, `BLOCKED` or `NOT VERIFIED` labels.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
