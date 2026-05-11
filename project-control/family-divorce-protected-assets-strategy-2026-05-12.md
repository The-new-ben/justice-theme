# Family / Divorce Protected Assets Strategy

Date: 2026-05-12
Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

This strategy protects Family/Divorce document, tool, case-law and old URL assets before the first controlled upload. It does not approve public content changes, redirects, deletion, noindex, canonical changes, sitemap changes, taxonomy changes, internal-link execution, media-file removal, schema changes, CMS writes or database changes.

## Purpose

The Family/Divorce upload can move faster cluster by cluster, but it must not accidentally erase assets that already have search value or user intent.

The main risk is not weak old content. Weak old content can be rewritten or merged later. The real risk is treating every old URL, PDF, DOCX, calculator and case-law page as disposable before GSC API export and owner approval.

## Inputs Reviewed

VERIFIED:
- `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`
- `project-control/family-divorce-current-url-upload-readiness-2026-05-11.csv`
- `project-control/family-divorce-owner-upload-review-package-2026-05-12.csv`
- `project-control/family-divorce-no-url-internal-link-map-2026-05-12.csv`
- `project-control/family-divorce-first-upload-decision-table-2026-05-12.csv`
- `project-control/child-support-owner-approval-packet.md`
- `project-control/child-custody-owner-approval-packet.md`
- `project-control/url-migration-map.csv`
- `project-control/internal-link-map.csv`
- `project-control/exports/all-content-export.csv`

## Current Finding

VERIFIED:
- Family/Divorce has protected non-normal assets that should stay live during the first upload.
- The clean support pages can be improved without redirecting or deleting these protected assets.
- Some protected assets hold document, calculator, custody or support intent that the clean guide pages do not fully replace yet.

NOT VERIFIED:
- Final GSC API export by page and query.
- Final legal/source review of document/template/tool claims.
- Final owner approval for any redirect, canonical, noindex or deletion decision.

## Protected Assets

### Divorce Rights PDF

Current asset:
- `https://jus-tice.co.il/wp-content/uploads/2022/06/misradhamishpatim-women.pdf`

VERIFIED:
- Browser GSC evidence previously recorded `45` impressions for a divorce-lawyer query.
- This asset should not be removed, noindexed, blocked, replaced or redirected during the first upload.

Decision:
- Protect as a document/source asset.
- Do not promote as a primary related card before source and compliance review.
- Later, consider a contextual HTML wrapper or download warning if the document remains useful.

### Mediation / Agreement DOCX

Current asset:
- `https://jus-tice.co.il/wp-content/uploads/2021/03/%D7%A0%D7%95%D7%A1%D7%97-%D7%94%D7%A1%D7%9B%D7%9D-%D7%92%D7%99%D7%A8%D7%95%D7%A9%D7%99%D7%9F-%D7%93%D7%95%D7%92%D7%9E%D7%90-2021.docx`

VERIFIED:
- Existing planning marks this DOCX as visible for mediation/agreement demand.
- A downloadable agreement template is higher risk than a general guide.

Decision:
- Protect as a template/document asset.
- Do not present it as a safe legal template without warning and review.
- Later, link only from an approved mediation or consensual-divorce page with clear template caution, or replace with an HTML checklist after approval.

### Child Support Calculator

Current asset:
- `https://jus-tice.co.il/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-%D7%9E%D7%96%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%9C%D7%93%D7%99%D7%9D/`

Related clean page:
- `/child-support/`

VERIFIED:
- `child-support-owner-approval-packet.md` records visible calculator demand:
  - child support query: `160` impressions.
  - calculation query: `131` impressions.
  - calculator query: `70` impressions.
- The clean `/child-support/` guide does not fully replace calculator/tool intent yet.

Decision:
- Protect as a tool-intent URL.
- Do not redirect it into the guide during the first upload.
- Future tool should be framed as an informational preparation or intake aid, not a binding legal calculation.

### 919/15 Case-Law Asset

Current asset:
- `/psakdin/...919-15...`

Related clean page:
- `/child-support/`

VERIFIED:
- Exported word count is about `39,818`, so it is a large case-law/source asset.

Decision:
- Keep separate as case/source support.
- Do not merge into the broad child-support guide.
- Later, the guide may summarize the doctrine and link to the case source after legal/source review.

### What-Is Child Custody Article

Current asset:
- `https://jus-tice.co.il/what-is-child-custody/`

Related clean page:
- `/child-custody/`

VERIFIED:
- `child-custody-owner-approval-packet.md` records `400` impressions for the current article on a custody query.

Decision:
- Protect and compare against `/child-custody/`.
- Do not redirect, noindex, delete or overwrite during first upload.
- Later, merge useful sections or use as support depending on GSC API export and content comparison.

### Child Custody PDF

Current asset:
- `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`

Related clean page:
- `/child-custody/`

VERIFIED:
- `child-custody-owner-approval-packet.md` records `297` impressions for this PDF on a custody query.

Decision:
- Protect as a document asset.
- Do not remove, noindex, block or redirect during first upload.
- Later, create or improve an HTML equivalent if the PDF is useful but poor for user experience.

### Sole-Mother Custody Case URL

Current asset:
- `REFERENCE:SOLE-MOTHER-CUSTODY-CASE-GSC-001`

Related clean page:
- `/child-custody/`

VERIFIED:
- `child-custody-owner-approval-packet.md` records `107` impressions and average position `9.6` for a sole-mother custody query.

Decision:
- Protect as a case-law/support asset.
- Do not redirect, noindex, delete or retitle during first upload.
- Later, summarize the legal concept carefully inside `/child-custody/` only after legal/source review.

## First Upload Rules

VERIFIED PLANNING:
- The first Family/Divorce upload may improve `/divorce-lawyer/` and approved support pages without touching these protected assets.
- Protected assets can be referenced in planning and future internal-link maps, but should not become prominent related cards until source, legal and owner review are done.
- Any upload package must include a post-upload protected-asset check.

BLOCKED:
- No redirect.
- No noindex.
- No canonical change.
- No media-file removal.
- No document replacement.
- No robots block.
- No sitemap removal.
- No schema claim based on these assets.
- No fake calculator output or legal formula.
- No template promotion without warning.

## Checklist Impact

VERIFIED PLANNING:
- `FAM-UPLOAD-003` divorce PDF strategy can move from NOT VERIFIED to VERIFIED PLANNING.
- `FAM-UPLOAD-004` mediation DOCX strategy can move from NOT VERIFIED to VERIFIED PLANNING.
- `FAM-UPLOAD-005` child-support calculator relationship can move from PARTIAL to VERIFIED PLANNING.
- `FAM-UPLOAD-006` custody article/PDF/case-law relationship can move from PARTIAL to VERIFIED PLANNING.

Still BLOCKED:
- Final GSC API export.
- Owner approval.
- Any public execution.

## Next Steps

1. Add these protected assets to the final upload checklist.
2. Run GSC API export when access is available.
3. Confirm whether the first upload is draft-only or public update.
4. After preview/upload, verify all protected URLs still return the intended status.
5. Only after GSC API and owner approval, decide redirect/canonical/noindex/delete actions.
