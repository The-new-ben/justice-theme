# Family/Divorce Owner Review Packet - 2026-05-21

Status: READY FOR OWNER REVIEW / NOT APPROVED FOR CMS UPLOAD / NO PUBLIC CHANGES

This packet converts the locally merged Family/Divorce content work into a controlled owner/legal/source review gate. It does not approve publishing, CMS edits, URL changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy edits, related-card edits, schema changes, lawyer-card changes, CRM changes, wp-admin changes or database writes.

## Scope

The packet covers the seven first-cluster Family/Divorce upload candidates:

1. `/divorce-lawyer/`
2. `/consensual-divorce/`
3. `/divorce-mediation/`
4. `/divorce-property-division/`
5. `/family-dispute-resolution/`
6. `/child-support/`
7. `/child-custody/`

## Inputs Verified

VERIFIED LOCAL:
- `reports/family-divorce-public-body-static-qa-2026-05-21.csv`
- `reports/family-divorce-live-target-backup-2026-05-21/manifest.csv`
- `reports/family-divorce-live-preupload-2026-05-21.csv`
- `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.csv`
- `project-control/family-divorce-high-risk-merge-review-2026-05-21.csv`
- `project-control/family-divorce-property-division-merge-decisions-2026-05-21.csv`
- `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.csv`
- `project-control/family-divorce-child-support-merge-decisions-2026-05-21.csv`

VERIFIED LIVE / READ ONLY:
- All seven target URLs returned `200` and self-canonicalized in the live target backup.
- All seven target URLs are already live, so each CMS update must be treated as an overwrite/update of an existing indexed page, not as a new-page upload.

NOT VERIFIED:
- Owner/legal/source approval.
- Actual WordPress editor/database backup.
- GSC API/export risk check.
- Post-upload live visual QA.
- Final CMS field values after editor entry.

## Page Review Matrix

| Target URL | Draft file | Static QA | Words | Current owner decision | Upload status |
|---|---|---:|---:|---|---|
| `/divorce-lawyer/` | `content-drafts/divorce-lawyer-public-body-he.md` | PASS | 2106 | REQUIRED | BLOCKED |
| `/consensual-divorce/` | `content-drafts/consensual-divorce-public-body-he.md` | PASS | 1656 | REQUIRED | BLOCKED |
| `/divorce-mediation/` | `content-drafts/divorce-mediation-public-body-he.md` | PASS | 1834 | REQUIRED | BLOCKED |
| `/divorce-property-division/` | `content-drafts/divorce-property-division-public-body-he.md` | PASS | 1851 | REQUIRED | BLOCKED |
| `/family-dispute-resolution/` | `content-drafts/family-dispute-resolution-public-body-he.md` | PASS | 1793 | REQUIRED | BLOCKED |
| `/child-support/` | `content-drafts/child-support-public-body-he.md` | PASS | 1650 | REQUIRED | BLOCKED |
| `/child-custody/` | `content-drafts/child-custody-public-body-he.md` | PASS | 1748 | REQUIRED | BLOCKED |

Allowed owner decisions per page:
- `APPROVE`: content can move to the CMS operator checklist after backup.
- `EDIT`: owner provides concrete edits before CMS work.
- `HOLD`: page is not included in the first upload wave.
- `LEGAL_REVIEW_REQUIRED`: page needs lawyer/source review before upload.

## Merge Retention Summary

FIXED / VERIFIED LOCAL:
- `/divorce-property-division/`: `35` live rows resolved into `6` merge edits, `23` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips. The six approved merge edits are applied.
- `/child-custody/`: `35` live rows resolved into `9` merge edits, `20` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips. The nine approved merge edits are applied.
- `/child-support/`: `35` live rows resolved into `4` merge edits, `25` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips. The four approved merge edits are applied.

IMPACT:
- The three high-risk blind-overwrite blockers are now resolved locally.
- The seven drafts pass static QA after the merge edits.
- This still does not replace owner/legal/source review.

## Minimum Approval Checklist

MUST PASS BEFORE CMS UPDATE:
1. Owner marks each target page as `APPROVE`, `EDIT`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
2. Owner confirms that the content is general informational material and does not make legal advice, result, rating, review, recommendation or fake-trust claims.
3. Owner confirms that any sensitive legal process descriptions are source-reviewed enough for publication with disclaimers.
4. CMS operator exports actual WordPress editor/database content for each approved target before editing.
5. CMS operator updates existing target pages only. Do not create duplicate pages.
6. Final title, H1, meta description, canonical, robots, taxonomy and related-content posture are checked before save.
7. Internal links inside each approved page point only to intended live target URLs.
8. No redirect, noindex, canonical migration, deletion or sitemap-removal action is bundled into the body upload.
9. After upload, run fetch checks for HTTP status, final path, title, H1, canonical, robots, body text and broken links.
10. After upload, capture desktop/mobile screenshots only after the page stays on its own final path.

## Recommended Upload Sequencing

RECOMMENDED:
- Wave 1A: upload `/divorce-lawyer/` first after explicit approval, CMS backup and post-upload QA checklist.
- Wave 1B: upload support pages only after page-by-page approval. The support pages are `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/`.

DO NOT DO IN THIS PACKET:
- Do not redirect old Hebrew URLs.
- Do not noindex protected source URLs.
- Do not remove protected assets.
- Do not change sitemap inclusion.
- Do not change canonical strategy.
- Do not rewrite taxonomy hierarchy in the CMS.

## Current Blockers

BLOCKED:
- Owner/legal/source approval is not complete.
- Actual WordPress editor/database backup is not complete.
- GSC API/export is not yet merged into the redirect and URL-migration decision process.
- Five protected Family/Divorce source URLs currently redirect to homepage in the live pre-upload guard and need GSC-informed decisions before URL migration.
- Post-upload visual QA cannot be run because no upload has happened.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
