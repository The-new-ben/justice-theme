# Family/Divorce Child-Support Draft Merge - 2026-05-21

## Status

- FIXED: applied the four approved `/child-support/` merge edits to `content-drafts/child-support-public-body-he.md`.
- TOOLING FIXED: added `tools/apply-family-divorce-child-support-draft-merges.mjs`.
- VERIFIED LOCAL: all four approved insertion blocks are present in the public-body draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce clean bodies passed.
- NOT PUBLISHED: this is a local content-draft update only; no public CMS field changed.

## Batch Completed

Applied the four approved merges from `project-control/family-divorce-child-support-merge-decisions-2026-05-21.md`:

- Included-vs-separate expense clarity.
- Extraordinary-expense request, receipt, dispute and urgent-care mechanics.
- Change-of-support review checklist.
- Communication/evidence tracking for expense requests, refusal to pay and missing documents.

## Verification

- VERIFIED LOCAL: `node --check tools/apply-family-divorce-child-support-draft-merges.mjs`.
- VERIFIED LOCAL: `node tools/apply-family-divorce-child-support-draft-merges.mjs`.
- VERIFIED LOCAL: all four approved insertion blocks are present after applying the merge script.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/check-family-divorce-public-bodies.mjs`.
- VERIFIED LOCAL: `/child-support/` static QA status is `PASS` with `1,650` words, no missing required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- VERIFIED LOCAL: all `7` Family/Divorce public-body drafts pass static QA.

## Upload Readiness Impact

- READY: `/child-support/` draft now includes approved live-content retention edits.
- READY: repeatable static QA confirms the edited draft remains clean.
- READY: the three high-risk Family/Divorce pages no longer have unresolved merge rows.
- BLOCKED: owner/legal/source approval is still required before CMS upload.
- BLOCKED: actual WordPress editor/database backup is still required before CMS execution.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
