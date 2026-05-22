# Priority Pages CMS Owner Approval Worksheet - 2026-05-22

Status: VERIFIED PLANNING / OWNER DECISION PENDING / PUBLIC EXECUTION BLOCKED / NO PUBLIC CHANGES

This worksheet converts the priority-page live evidence into explicit owner decisions. It is narrower than a content-upload approval. Approval here can authorize duplicate body/content H1 repair on two current live article URLs only after rollback capture. It does not approve clean-slug creation, content upload, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, internal-link writes, media changes, lawyer-card changes, lead/CRM changes, GSC/GA4 changes, wp-admin setting changes or uPress deployment.

## Owner Decision Summary

Recommended safe decision for the next manual step:

- `APPROVE_ARTICLE_H1_REPAIR_ONLY` for `/criminal-lawyer-cost/` article ID `19261` and `/plea-bargain/` article ID `19279`, after rollback capture.
- `HOLD_CLEAN_SLUG_OBJECT_DECISIONS` for the four 404 clean slugs until focused GSC, source/legal review and anti-cannibalization checks are complete.
- `HOLD_PAGE_PUBLISHER_USE` because the current publisher writes to `wp/v2/pages` while the two live repair objects are `articles`.
- `REQUIRE_POST_REPAIR_QA` before marking either repaired article verified.

If there is any legal/source concern on the two live article pages, use `LEGAL_SOURCE_REVIEW_REQUIRED` for that page and keep it out of the visible repair batch.

## Approve Now Only If These Conditions Are True

- Owner explicitly approves duplicate body/content H1 repair for the two named article IDs.
- Operator has captured rollback fields from `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.md`.
- Repairs stay on the existing public URLs.
- Object type is confirmed as `articles` before edit.
- SEO fields are frozen unless a separate owner decision exists.
- No 404 clean slug is created in this approval.
- The operator will rerun the priority live checker after repair.
- Desktop and mobile screenshots will be captured after repair if a browser-capable environment is available.

## Decisions To Record

| Approval ID | Target | Recommended owner decision | Allowed if approved | Must remain blocked |
|---|---|---|---|---|
| PPR-APPROVAL-001 | All priority targets | `APPROVE_ARTICLE_H1_REPAIR_ONLY` or `HOLD_PUBLIC_REPAIR` | Start only duplicate body/content H1 repair for the two live article URLs after backup | Full content upload, clean-slug creation and SEO migration |
| PPR-APPROVAL-002 | All approved repairs | `REQUIRE_CMS_BACKUP_FIRST` | Capture rollback material before any editor save | Editing from public HTML evidence alone |
| PPR-APPROVAL-003 | `/criminal-lawyer-cost/` | `APPROVE_ARTICLE_H1_REPAIR_ONLY` | Remove or demote duplicate body/content H1 on article ID `19261` | Slug, title/meta, canonical, robots, taxonomy, redirects, schema, sitemap and internal-link changes |
| PPR-APPROVAL-004 | `/plea-bargain/` | `APPROVE_ARTICLE_H1_REPAIR_ONLY` | Remove or demote duplicate body/content H1 on article ID `19279` | Slug, title/meta, canonical, robots, taxonomy, redirects, schema, sitemap and internal-link changes |
| PPR-APPROVAL-005 | `reports/semrush/build-priority-pages.js` | `HOLD_PAGE_PUBLISHER_USE` | Dry-run/safety review only | Using page publisher to repair live article CPT records |
| PPR-APPROVAL-006 | `/medical-malpractice-diagnosis-errors/` | `HOLD_PENDING_GSC_SOURCE_LEGAL` | Compare article ID `8271` and planned clean content | Creating clean slug, redirecting, canonicalizing or retiring current asset |
| PPR-APPROVAL-007 | `/joint-custody/` | `HOLD_PROTECTED_ASSET_DECISION` | Preserve and review article ID `5405` at `/joint-custody-shared-parenting/` | Duplicate clean-slug creation, redirect, canonical/noindex, or retirement |
| PPR-APPROVAL-008 | `/medication-errors-malpractice/` | `HOLD_SOURCE_LEGAL_AND_CONTENT_TYPE` | Source/legal review and article-vs-page decision | Public creation, sitemap entry, taxonomy change or internal-link write |
| PPR-APPROVAL-009 | `/divorce-pension-split/` | `HOLD_CANNIBALIZATION_GSC_REVIEW` | Compare page ID `19215` and article IDs `8252`, `7048`, `11205` | Duplicate clean-slug creation, redirect, canonical/noindex, or retirement |
| PPR-APPROVAL-010 | All repaired pages | `REQUIRE_POST_REPAIR_QA` | Rerun priority live checker and screenshots where available | Marking verified from planning docs alone |
| PPR-APPROVAL-011 | All priority targets | `HOLD_SEO_MIGRATION` | None in this approval | Redirects, canonicals, noindex, sitemap, taxonomy and internal-link migration |

## Exact Approval Language

Use this text if approving only the two H1 repairs:

`I approve duplicate body/content H1 repair only for /criminal-lawyer-cost/ article ID 19261 and /plea-bargain/ article ID 19279, after WordPress rollback backup is captured. This approval does not authorize clean-slug creation, content upload, URL changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy changes, schema changes, internal-link writes, media changes, lawyer-card changes, lead/CRM changes, GSC/GA4 changes, wp-admin setting changes or uPress deployment.`

Use this text if holding:

`Hold public repair. Continue repo-only planning and do not change WordPress production pages or article records.`

## Still Blocked After This Approval

- Four 404 clean slug object decisions.
- Focused GSC review for protected and overlapping assets.
- Source/legal review for Medical Malpractice clean content.
- Canonical/noindex/sitemap/redirect decisions.
- Using the page publisher for live article CPT repairs.
- Full content upload/update wave.
- Category hierarchy and taxonomy changes.
- Related-content/internal-link writes.

## Verification Required After Approved H1 Repair

- Fresh `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` output.
- `/criminal-lawyer-cost/` remains HTTP `200`, self-canonical, index/follow, public `articles` ID `19261`, with one H1.
- `/plea-bargain/` remains HTTP `200`, self-canonical, index/follow, public `articles` ID `19279`, with one H1.
- Four clean slugs remain intentionally blocked unless separately approved.
- Project-control docs updated with `VERIFIED`, `FIXED`, `BLOCKED` or `NOT VERIFIED` labels.

## Safety

No public CMS page/article body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
