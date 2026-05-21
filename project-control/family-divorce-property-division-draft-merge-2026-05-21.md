# Family/Divorce Property-Division Draft Merge - 2026-05-21

## Status

- FIXED: applied the six approved `/divorce-property-division/` merge edits to `content-drafts/divorce-property-division-public-body-he.md`.
- TOOLING FIXED: added `tools/apply-family-divorce-property-division-draft-merges.mjs`.
- VERIFIED LOCAL: all six insertion IDs are present in the public-body draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce clean bodies passed.
- NOT PUBLISHED: this is a local content-draft update only; no public CMS field changed.

## Batch Completed

Applied the six approved merges from `project-control/family-divorce-property-division-merge-decisions-2026-05-21.md`:

- Separate registration/shared-intent caution.
- Children and housing needs practical timing note.
- Separation-date checklist.
- Post-separation assets/debts review note.
- Prenup/prior-agreement checklist.
- Prenup validity/interpretation caution.

## Verification

- VERIFIED LOCAL: `node --check tools/apply-family-divorce-property-division-draft-merges.mjs`.
- VERIFIED LOCAL: `node tools/apply-family-divorce-property-division-draft-merges.mjs`.
- VERIFIED LOCAL: insertion-presence check passed for all `6` insertion IDs.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/check-family-divorce-public-bodies.mjs`.
- VERIFIED LOCAL: `/divorce-property-division/` static QA status is `PASS` with `1,851` words, no missing required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- VERIFIED LOCAL: all `7` Family/Divorce public-body drafts pass static QA.

## Upload Readiness Impact

- READY: `/divorce-property-division/` draft now includes approved live-content retention edits.
- READY: repeatable static QA confirms the edited draft remains clean.
- BLOCKED: owner/legal/source approval is still required before CMS upload.
- BLOCKED: actual WordPress editor/database backup is still required before CMS execution.
- BLOCKED: `/child-support/` and `/child-custody/` still need row-level merge decisions.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
