# Child Custody Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the child-custody inventory, slug-conflict, GSC browser evidence, source-audit and document-risk findings into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes, document removal or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change child-custody comparison and document-risk planning batch.
- Do not redirect, delete, noindex or replace `what-is-child-custody/`, the custody PDF, or old case-law custody URLs yet.
- Treat `/child-custody/` as the likely public guide candidate, but only after comparing it to the current GSC-visible URLs.

Why:
- `child-custody` has `12` conflict rows.
- The exact clean URL already exists:
  - `https://jus-tice.co.il/child-custody/`
  - public REST word count: `2,397`
  - quality heuristic: `7/10`
- GSC browser evidence for `משמורת ילדים` does not currently map to `/child-custody/`.
- GSC browser evidence shows broad custody demand split between:
  - `https://jus-tice.co.il/what-is-child-custody/`
  - `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`
- GSC browser evidence also shows `משמורת בלעדית לאם` maps to an old Hebrew case-law URL at average position `9.6`.

## Current Evidence

VERIFIED:
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/url-migration-map.csv`.
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/internal-link-map.csv`.
- `project-control/child-custody-source-audit.csv`.
- `project-control/family-law-content-cluster-map.md`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page or lead data.
- Full legal review of child-custody claims.
- Browser verification of source links that blocked scripted checks.
- Owner approval for choosing final primary/support/document/redirect paths.

## Query Evidence From GSC Browser Passes

VERIFIED:
- `משמורת ילדים`: `611` impressions, `0` clicks, `0%` CTR, average position `54.8`.
- Visible pages for `משמורת ילדים`:
  - `https://jus-tice.co.il/what-is-child-custody/`: `400` impressions, average position `55.7`.
  - `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`: `297` impressions, average position `61.7`.
- `משמורת בלעדית לאם`: `107` impressions, `0` clicks, `0%` CTR, average position `9.6`.
- Visible page for `משמורת בלעדית לאם`:
  - `https://jus-tice.co.il/משמורת-בלעדית-לאם-ושיתופיות-יחסית-במסגרת-איזון-משאבים-תלהמ-37049-07-18/`

Interpretation:
- `/child-custody/` is a strong guide candidate but does not yet own the checked broad custody query.
- The PDF is an SEO migration risk and needs a document strategy before any URL changes.
- The old sole-mother custody case-law URL has position 5-20 opportunity/risk and must not be redirected or replaced blindly.

## 2026-05-11 Pass-2 Evidence Carry-Forward

VERIFIED:
- The second targeted GSC browser pass is now part of this owner-approval packet:
  - `project-control/gsc-targeted-query-pass-2-2026-05-11.md`
  - `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`
- `משמורת בלעדית לאם` remains a high-risk narrow custody query because all visible GSC impressions in the pass map to the old Hebrew case-law URL.
- The old case-law URL has `107` impressions, `0` clicks, `0%` CTR and average position `9.6`, so it is both a position 5-20 opportunity and a migration-risk URL.
- Child-support modification/shared-custody variants checked in the same pass returned no visible rows; they should stay in source/SERP review and should not drive custody URL decisions.

RECOMMENDED:
- Protect the old sole-mother custody case-law URL until the side-by-side custody comparison is complete.
- Treat the old URL as possible case-support content, not as disposable duplicate content.
- Do not merge, redirect, noindex or canonicalize the old URL into `/child-custody/` unless the final migration map, source/legal review and owner approval explicitly support that move.
- Add internal links from the old case-law/support path to the final custody guide only after the primary URL is approved.

BLOCKED:
- No public custody content edits, title/H1/meta changes, URL changes, redirects, noindex, canonical, sitemap, PDF/media or CMS changes are approved by this pass-2 evidence.

## Page Decisions For Approval

### 1. Child Custody Guide Candidate

Current URL:
- `https://jus-tice.co.il/child-custody/`

Current facts:
- Exact clean English slug exists.
- Published page.
- Public REST word count: `2,397`.
- Quality heuristic: `7/10`.
- Already links to child support, consensual divorce, divorce lawyer, divorce mediation, property division, family dispute resolution and family-law lawyer directory.

Recommended action:
- APPROVE COMPARE / PREPARE AS PRIMARY / NO URL CHANGE.

Required next review:
- Compare title, H1, structure, source quality, terminology, internal links and public usefulness against `what-is-child-custody/`, the PDF, and the old case-law URLs.

### 2. Current GSC-Visible Custody Article

Current URL:
- `https://jus-tice.co.il/what-is-child-custody/`

Current facts:
- Receives the largest visible share for `משמורת ילדים` in the checked GSC browser filter.
- Not the planned clean `/child-custody/` guide.

Recommended action:
- PROTECT / COMPARE / DO NOT TOUCH UNTIL PRIMARY IS APPROVED.

Blocked:
- No redirect.
- No noindex.
- No overwrite.
- No canonical change.

### 3. Custody PDF

Current URL:
- `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`

Current facts:
- Receives `297` impressions for `משמורת ילדים` in the checked GSC browser filter.

Recommended action:
- DOCUMENT STRATEGY REQUIRED.
- Decide later whether to keep, link from the guide, replace with an HTML equivalent, redirect later, or noindex later.

Blocked:
- No deletion.
- No redirect.
- No media replacement.
- No robots/sitemap exclusion until document strategy is approved.

### 4. Sole-Mother Custody Case-Law URL

Current URL:
- `https://jus-tice.co.il/משמורת-בלעדית-לאם-ושיתופיות-יחסית-במסגרת-איזון-משאבים-תלהמ-37049-07-18/`

Current facts:
- GSC browser pass shows `107` impressions and average position `9.6` for `משמורת בלעדית לאם`.

Recommended action:
- PROTECT / KEEP AS CASE-SUPPORT / MERGE SUMMARY ONLY AFTER LEGAL REVIEW.

Blocked:
- No redirect or merge now.
- No title/H1 change now.
- No deletion/noindex now.

### 5. Related Support Pages

Known current clean/support URLs:
- `https://jus-tice.co.il/child-custody-modification/`
- `https://jus-tice.co.il/tender-years-mother-custody-child-age-under-6/`

Recommended action:
- REVIEW AS SUPPORT, NOT DUPLICATES.
- `tender-years-mother-custody-child-age-under-6/` is thin and needs legal terminology review before expansion.

## Source / Legal Review Checklist

Before public edits:
- Verify the legal terminology around `משמורת`, `זמני שהות`, and `אחריות הורית`.
- Verify claims about best interests of the child.
- Verify cautious wording around `חזקת הגיל הרך`.
- Verify any discussion of a child's wishes, relocation, non-return, violence, parental alienation or urgent risk.
- Verify process language for family dispute resolution, temporary relief, welfare reports and court referrals.
- Add official/public sources where appropriate.
- Add a clear legal disclaimer.
- Avoid unsupported legal conclusions or practical instructions that could harm a family dispute.

## Internal-Link Direction After Approval

If owner approves the comparison batch:
- `/child-custody/` should link naturally to divorce, family-law lawyer, child support, family dispute resolution, divorce mediation, property division and relevant official/public source pages.
- `what-is-child-custody/` should link to `/child-custody/` if it remains live.
- The PDF should be linked or handled according to the approved document strategy.
- Case-law/support pages should link back to the main guide when the final primary is confirmed.
- Maya Rotenberg or family-law lawyer cards should appear only if real profile data and disclosure are verified.

## Sitemap / Canonical / Redirect Position

NOT APPROVED:
- No custody redirects.
- No PDF redirect or removal.
- No canonical changes.
- No sitemap inclusion/exclusion change.
- No noindex.
- No deletion.

Required before URL migration:
- Full URL inventory for all child-custody conflict rows.
- GSC query/page evidence for high-risk URLs and documents.
- Internal-link update map.
- Redirect map.
- Canonical plan.
- Sitemap/document plan.
- Owner approval.

## Owner Approval Questions

1. Should `/child-custody/` be compared as the near-term public guide while protecting `what-is-child-custody/`?
2. Should the `ChildCustody.pdf` remain live until a document strategy is approved?
3. Should the sole-mother custody case-law URL stay separate as support/case content because it has position 9.6 evidence?
4. Should terminology around `משמורת`, `זמני שהות`, and `אחריות הורית` require legal review before public edits?
5. Should Maya Rotenberg/family-law lawyer cards be connected only after profile/review/disclosure data is verified?

## Blocked Actions

Do not execute yet:
- Public content body edits.
- Title/H1/meta changes.
- Slug changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Robots/media/document changes.
- Noindex.
- Deletions.
- PDF removal or replacement.
- New standalone custody support pages.
- Menu/category/taxonomy edits.
- Lawyer cards, review widgets or lead-flow changes.
- CMS/database writes.

## Next Approved Work If Owner Says Yes

1. Build a side-by-side content-quality comparison:
   - `/child-custody/`
   - `what-is-child-custody/`
   - `ChildCustody.pdf`
   - sole-mother custody case-law URL
   - custody-modification and tender-years support pages
2. Build a document strategy for the PDF.
3. Build a source/legal checklist for every claim that may appear in the public guide.
4. Build an internal-link plan for the child-custody cluster.
5. Draft a no-URL-change editorial brief for `/child-custody/`.
6. Return for owner approval before any CMS edit.

## Safety

This packet is documentation and CSV planning only. No public content body, URL slug, redirect, sitemap inclusion, canonical setting, noindex setting, robots/media/document rule, taxonomy term, menu, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.
