# Medical Malpractice First-Upload Metadata Package - 2026-05-22

## Status
- VERIFIED PLANNING: this package prepares field-level CMS values for the Medical Malpractice cluster.
- REVIEW ONLY: values are ready for owner/legal/source review, not for automatic publication.
- PUBLIC EXECUTION BLOCKED: no CMS, URL, redirect, canonical, noindex, sitemap, taxonomy, related-card, lawyer-card, schema or CRM change is approved by this file.
- CURRENT-URL ONLY: all link and canonical recommendations keep the current URLs until duplicate identity, focused GSC export and owner migration approval are complete.

## Batch Completed
- Cluster: `medical-malpractice`.
- Pages reviewed: `9`.
- Rows created: `9` metadata rows in `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.csv`.
- Inputs used: Medical Malpractice readiness dashboard, owner decision packet, duplicate identity review, operator runbook, source/legal checklist and no-URL internal-link map.
- Upload status: `0/9` approved for CMS upload.

## Covered Current URLs
| ID | Current URL | Future slug candidate | Current evidence | Words | Status |
|---|---|---|---|---:|---|
| MEDMAL-META-001 | `/medical-malpractice-lawyer/` | current path only | duplicate IDs `11607` and `1130` | 5,135 / 3,287 | BLOCKED_DUPLICATE_CMS_IDENTITY_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-002 | `/articles/שכר-טרחה-עורך-דין-רשלנות-רפואית/` | `/medical-malpractice-lawyer-fees/` | protected GSC-visible cost support | 989 | BLOCKED_PROTECTED_GSC_VISIBLE_OWNER_SOURCE_LEGAL |
| MEDMAL-META-003 | `/what-is-medical-malpractice-definition-examples/` | keep current or later clean concept slug | definition support | 1,415 | BLOCKED_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-004 | `/medical-malpractice-common-errors-doctors-hospitals/` | keep current or later clean concept slug | thin common-errors support | 698 | BLOCKED_EXPAND_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-005 | `/medical-malpractice-vs-negligence-differences-israel/` | keep current or later clean concept slug | concept/comparison support | 1,906 | BLOCKED_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-006 | `/anesthesia-medical-malpractice/` | keep current or later clean support slug | anesthesia support | 2,878 | BLOCKED_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-007 | `/surgical-errors-medical-malpractice/` | keep current or later clean support slug | thin surgery support | 855 | BLOCKED_EXPAND_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-008 | `/birth-injury/` | keep current parent support path | birth injury support parent | 1,723 | BLOCKED_SENSITIVE_CAUSATION_OWNER_GSC_SOURCE_LEGAL |
| MEDMAL-META-009 | old Hebrew birth-malpractice page ID `11834` | `/birth-malpractice/` and `/pregnancy-malpractice/` blocked | protected high-visibility birth/pregnancy asset | 6,739 | BLOCKED_PROTECTED_SPLIT_MERGE_OWNER_GSC_SOURCE_LEGAL |

## Field Policy
- Title/H1/meta/OG/breadcrumb values are proposed values only.
- Existing pages must be backed up in WordPress before any approved body or metadata update.
- The operator should not create duplicate clean-slug pages.
- Future English slugs are migration candidates only; they must not be used in public links yet.
- Canonical policy is self-canonical on the current URL until GSC and owner migration approval.
- Robots policy is no-change; do not add or remove `noindex` from this package.
- Schema policy is conservative: WebPage, Article and BreadcrumbList only; no MedicalWebPage claims, Review schema, AggregateRating, fake trust badges or unsupported FAQ schema.

## Current-URL Internal Link Map
- The pillar candidate `/medical-malpractice-lawyer/` should link to cost, definition, common-errors, anesthesia, surgery and birth-injury support only after the authoritative CMS record is chosen.
- Each approved support page should link back to `/medical-malpractice-lawyer/` using the current URL only.
- Cost support may link to definition support and records/evidence sections, but should not become a second commercial pillar.
- Surgery and anesthesia pages may cross-link only after source/legal review confirms unique support roles.
- Birth-injury pages may link to the old protected birth/pregnancy asset only after the owner approves split/merge handling.
- Clean-slug links such as `/birth-malpractice/`, `/pregnancy-malpractice/`, `/diagnosis-malpractice/`, `/surgery-malpractice/` and `/medical-malpractice-lawyer-fees/` remain blocked until redirect/canonical/sitemap migration approval.

## Anti-Cannibalization Notes
- `/medical-malpractice-lawyer/` owns commercial lawyer-hiring intent only after duplicate identity is resolved.
- The fee/cost page owns cost intent and should support the pillar, not compete with it.
- Definition/common-errors/comparison pages are informational support only.
- Anesthesia and surgery pages are support topics, not broad malpractice pillars.
- `/birth-injury/` is a possible birth-injury parent support page; the old Hebrew birth/pregnancy page must be protected until GSC and owner split/merge decisions are final.
- Do not promote pages with "recommended" language as trust/ranking claims until wording and policy are reviewed.
- Traffic/Marvad, criminal negligence, US malpractice and general clinic pages stay outside this metadata package.

## Ready
- VERIFIED: `9` current or protected medical-malpractice pages now have proposed field-level metadata rows.
- VERIFIED: each row keeps current URLs and blocks clean-slug migration.
- VERIFIED: every row is blocked from CMS execution pending owner/legal/source/GSC gates.
- READY FOR OWNER REVIEW: the owner can approve, edit, hold or request legal/source review per row.
- READY FOR OPERATOR PREP: after approval, the CMS operator can use this package together with `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.md`.

## Blocked
- BLOCKED: authoritative CMS record decision for `/medical-malpractice-lawyer/`.
- BLOCKED: focused GSC/API export before final URL migration, redirect, canonical, noindex and sitemap decisions.
- BLOCKED: source/legal/privacy review for medical causation, expert-opinion, limitation, costs and sensitive health-data wording.
- BLOCKED: actual WordPress editor/database rollback backup before CMS execution.
- BLOCKED: public visual QA until approved CMS updates exist on the site.

## Upload Checklist
1. Owner records the authoritative `/medical-malpractice-lawyer/` CMS identity decision.
2. Owner marks each metadata row `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
3. Legal/source reviewer checks factual claims, disclaimers and privacy posture for approved rows.
4. Operator captures current WordPress editor values and database rollback evidence.
5. Operator updates only approved current URLs, with no slug change.
6. Operator applies only approved metadata values from the CSV.
7. Operator verifies final path, title, H1, canonical, robots, visible body, links and mobile/desktop rendering.
8. URL migration, redirects and sitemap changes remain a later GSC-approved phase.

## Safety
No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
