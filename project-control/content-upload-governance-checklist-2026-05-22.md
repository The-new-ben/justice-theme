# Content Upload Governance Checklist - 2026-05-22

Status: VERIFIED PLANNING / REVIEW ONLY / PUBLIC EXECUTION BLOCKED
Upload approval: 0 clusters approved for public upload by this checklist.

## Purpose

This checklist converts the staged cluster-by-cluster strategy into an operator gate before any content upload, current-URL repair, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link, lawyer, lead, CRM or uPress action.

The working strategy remains:
- Finish one legal field at a time.
- Use Family/Divorce as the first controlled domain unless the owner changes priority.
- Prefer current-URL updates first.
- Protect strong existing pages and assets.
- Do not let weak old pages freeze the entire project.
- Do not publish duplicate or cannibalizing pages.

## Primary Rule

VERIFIED:
- A cluster can move through planning, drafting, metadata, source/legal review and owner approval while other clusters are incomplete.

BLOCKED:
- Public CMS execution is not approved until the selected cluster passes the gates below.
- Clean English slug migration, redirects, canonicals/noindex, sitemap changes, taxonomy cleanup and large internal-link rewrites require separate GSC-backed approval.

## Master Gates

| Gate | Stage | Status | Required evidence | Public action allowed |
|---|---|---|---|---|
| GOV-001 | Cluster selection | REQUIRED | Exactly one active upload cluster named | None |
| GOV-002 | Existing URL inventory | REQUIRED | Current URLs, old Hebrew URLs, media/docs and CMS identities listed | None |
| GOV-003 | Strong-page protection | REQUIRED | GSC/source evidence or owner judgment for pages/assets to protect | None |
| GOV-004 | Draft body readiness | REQUIRED | One approved draft target per current URL or new approved page | None |
| GOV-005 | Metadata readiness | REQUIRED | H1, title, meta, breadcrumb, schema, robots and page role recorded | None |
| GOV-006 | Source/legal review | REQUIRED | Owner/legal/source worksheet with approve/edit/hold decision | None |
| GOV-007 | Focused GSC evidence | REQUIRED | Priority export validator returns `VERIFIED_EXPORT_OUTPUTS_READY_FOR_OWNER_REVIEW` or owner explicitly accepts a manual substitute | None |
| GOV-008 | WordPress rollback backup | REQUIRED | Actual pre-edit CMS body, metadata, screenshots and rollback notes captured | None |
| GOV-009 | Public execution boundary | REQUIRED | Owner confirms exact allowed action: visible repair, current-URL update or migration | Only the approved action class |
| GOV-010 | Current-URL CMS update | CONDITIONAL | Approved rows map to current URLs and do not create duplicate clean slugs | Approved current-URL body/meta update only |
| GOV-011 | Internal-link write gate | CONDITIONAL | Links point only to verified current live URLs unless migration is separately approved | Approved links only |
| GOV-012 | Post-update QA | REQUIRED AFTER EXECUTION | HTTP status, final path, title, H1, canonical, robots, content, links, desktop/mobile screenshots | Verification only |
| GOV-013 | Monitoring | REQUIRED AFTER EXECUTION | GSC, GA4, 404 and index-status follow-up window recorded | Monitoring only |
| GOV-014 | Migration phase | SEPARATE APPROVAL | Clean slug map, redirect map, canonical/noindex map, sitemap and protected-asset decisions | Only after explicit owner approval |
| GOV-015 | Rollback or hold | REQUIRED ON FAILURE | Any critical mismatch produces stop/rollback/owner review | Rollback or no action |

## Cluster Status

| Cluster | Current status | Main blocker | First safe public action candidate |
|---|---|---|---|
| Family/Divorce | BLOCKED / PROCEDURALLY PREPARED | Owner visible-repair approval, actual CMS rollback backup, focused GSC, post-repair QA | Narrow current-URL visible repair only |
| Criminal Law | READY FOR OWNER SOURCE/LEGAL REVIEW / NOT UPLOAD APPROVED | Owner/legal/source worksheet, focused GSC, rollback backup | Current-URL updates after row-level approval |
| Medical Malpractice | BLOCKED | CMS identity decision, source/legal/privacy review, focused GSC, rollback backup | None until identity and privacy/source gates clear |
| Real Estate / Traffic / Personal Injury | NOT STARTED FOR UPLOAD | Cluster package not prepared | None |

## Must Not Be Skipped

- Current URL mapping and CMS identity check.
- Anti-cannibalization check for every target page.
- Strong-page and protected-asset review.
- English slug map, even if migration waits.
- Pillar/support role assignment.
- Source/legal/owner decision row.
- Focused GSC evidence or explicit owner-approved substitute.
- WordPress rollback backup before editor save.
- Post-update QA with screenshots when public UI changes.

## Can Wait

- Full sitewide 1,200-page audit.
- Full clean English slug migration.
- Redirect/canonical/noindex/sitemap execution.
- Broad taxonomy/category cleanup.
- Large related-card and internal-link rewrites.
- Lawyer cards, reviews, ratings, CRM and lead automation.
- Full visual QA for pages that were not publicly changed.

## Owner/Operator Use

1. Pick one cluster.
2. Fill every required gate for that cluster.
3. Mark row-level decisions as `APPROVE_CURRENT_URL_UPDATE`, `APPROVE_VISIBLE_REPAIR_ONLY`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
4. Execute only the approved action class.
5. Run post-update QA and monitoring.
6. Open a separate migration review only after current-URL changes are stable.

## Safety

NOT VERIFIED FOR PUBLIC EXECUTION:
- No cluster is upload-approved by this document alone.

BLOCKED PUBLIC EXECUTION:
- This document does not approve CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin or uPress action.
