# Family / Divorce Public Body Static QA - 2026-05-21

## Status
- VERIFIED LOCAL: created and ran `tools/check-family-divorce-public-bodies.mjs`.
- VERIFIED LOCAL: all `7` Family/Divorce public-body drafts passed static QA after one wording cleanup in `/divorce-lawyer/`.
- FIXED: `content-drafts/divorce-lawyer-public-body-he.md` no longer contains the risky phrase that matched the fake-trust/outcome-promise guard.
- GENERATED: `reports/family-divorce-public-body-static-qa-2026-05-21.csv`.
- NOT LEGAL VERIFIED: this is static upload hygiene, not lawyer/source/legal approval.
- NOT PUBLISHED: no CMS or public site content changed.

## Batch Completed
- Pages reviewed: `7`.
- Cluster advanced: Family Law / Divorce.
- Draft files checked:
  - `content-drafts/divorce-lawyer-public-body-he.md`
  - `content-drafts/consensual-divorce-public-body-he.md`
  - `content-drafts/divorce-mediation-public-body-he.md`
  - `content-drafts/divorce-property-division-public-body-he.md`
  - `content-drafts/family-dispute-resolution-public-body-he.md`
  - `content-drafts/child-support-public-body-he.md`
  - `content-drafts/child-custody-public-body-he.md`

## What The Checker Verifies
- Minimum body length per page.
- Required internal links inside the planned Family/Divorce cluster.
- No obvious internal planning markers such as `TODO`, `OWNER`, `LEGAL`, `BLOCKED`, `project-control` or `content-drafts/`.
- No obvious fake-trust/review/rating/outcome-promise terms.
- A general-information / no-legal-advice disclaimer signal exists.

## Results

| Target | Static QA | Words | Missing links | Fake trust hits | Disclaimer |
|---|---:|---:|---:|---:|---:|
| `/divorce-lawyer/` | PASS | 2106 | 0 | 0 | PASS |
| `/consensual-divorce/` | PASS | 1656 | 0 | 0 | PASS |
| `/divorce-mediation/` | PASS | 1834 | 0 | 0 | PASS |
| `/divorce-property-division/` | PASS | 1647 | 0 | 0 | PASS |
| `/family-dispute-resolution/` | PASS | 1793 | 0 | 0 | PASS |
| `/child-support/` | PASS | 1488 | 0 | 0 | PASS |
| `/child-custody/` | PASS | 1503 | 0 | 0 | PASS |

## What Is Ready
- READY FOR OWNER REVIEW: all seven clean public-body drafts are static-QA clean.
- READY FOR OPERATOR PREP: `/divorce-lawyer/` remains the safest Wave 1A page if owner approves body, metadata and backup workflow.
- READY FOR REPEATABLE CHECKS: future edits can rerun:

```bash
node tools/check-family-divorce-public-bodies.mjs
```

To regenerate the CSV:

```bash
JUSTICE_WRITE_REPORT=1 node tools/check-family-divorce-public-bodies.mjs
```

## What Is Still Blocked
- BLOCKED: owner approval for public upload.
- BLOCKED: legal/source review or explicit owner acceptance of general informational content.
- BLOCKED: CMS backup of current live body/title/meta/taxonomy before any overwrite.
- BLOCKED: GSC API export before any redirect, noindex, canonical, deletion, asset retirement or sitemap removal action.
- BLOCKED: live post-upload QA because no upload has happened.

## Upload Readiness Estimate
- Wave 1A `/divorce-lawyer/` copy/static hygiene: `VERIFIED`, roughly `85%` ready pending owner/legal/source approval and CMS backup.
- Wave 1B support copy/static hygiene: `VERIFIED`, roughly `75%` ready pending owner/legal/source approval and Wave 1A results.
- Full Family/Divorce URL migration/redirect readiness: `NOT VERIFIED`, roughly `45%` because GSC API export and owner redirect/canonical decisions are still missing.

## Safety
- No CMS page body changed.
- No database row changed.
- No public title/H1/meta, URL slug, canonical, noindex, redirect, taxonomy, sitemap, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress setting changed.

