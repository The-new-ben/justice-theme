# Family/Divorce Child-Custody Draft Merge - 2026-05-21

## Status

- FIXED: applied the nine approved `/child-custody/` merge edits to `content-drafts/child-custody-public-body-he.md`.
- TOOLING FIXED: added `tools/apply-family-divorce-child-custody-draft-merges.mjs`.
- VERIFIED LOCAL: all nine insertion IDs are present in the public-body draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce clean bodies passed.
- NOT PUBLISHED: this is a local content-draft update only; no public CMS field changed.

## Batch Completed

Applied the nine approved merges from `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.md`:

- Communication/risk/professional-factor language in the best-interests section.
- Professional reports/reference caution.
- Parenting-time agreement checklist.
- Extra-detail triggers for complex schedules.
- Repeated lateness/cancellation documentation guidance.
- Communication-channel details.
- Response-time, school, medical and lateness documentation details.
- Friction-reduction/children-not-as-messengers caution.
- Child-expense coordination boundary separate from child-support analysis.

## Verification

- VERIFIED LOCAL: `node --check tools/apply-family-divorce-child-custody-draft-merges.mjs`.
- VERIFIED LOCAL: `node tools/apply-family-divorce-child-custody-draft-merges.mjs`.
- VERIFIED LOCAL: insertion-presence check passed for all `9` insertion IDs.
- VERIFIED LOCAL: `$env:JUSTICE_WRITE_REPORT='1'; node tools/check-family-divorce-public-bodies.mjs`.
- VERIFIED LOCAL: `/child-custody/` static QA status is `PASS` with `1,748` words, no missing required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- VERIFIED LOCAL: all `7` Family/Divorce public-body drafts pass static QA.

## Upload Readiness Impact

- READY: `/child-custody/` draft now includes approved live-content retention edits.
- READY: repeatable static QA confirms the edited draft remains clean.
- BLOCKED: owner/legal/source approval is still required before CMS upload.
- BLOCKED: actual WordPress editor/database backup is still required before CMS execution.
- BLOCKED: `/child-support/` still needs row-level merge decisions.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
