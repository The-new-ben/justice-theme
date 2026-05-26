# Family/Divorce CMS Operator Runbook - 2026-05-21

Status: READY FOR OPERATOR PREP / EXECUTION BLOCKED / NO PUBLIC CHANGES

This runbook explains exactly how the CMS operator should handle the seven Family/Divorce pages after owner/legal/source approval. It is not an approval to publish and it does not authorize redirects, URL migration, canonical changes, noindex changes, sitemap changes, taxonomy restructuring, old-URL retirement, protected-asset edits, lawyer-card changes, lead/CRM changes, wp-admin setting changes or database writes.

## Scope

Target pages:

1. `/divorce-lawyer/`
2. `/consensual-divorce/`
3. `/divorce-mediation/`
4. `/divorce-property-division/`
5. `/family-dispute-resolution/`
6. `/child-support/`
7. `/child-custody/`

Primary source packet:
- `project-control/family-divorce-owner-review-packet-2026-05-21.md`
- `project-control/family-divorce-owner-review-packet-2026-05-21.csv`

Static QA source:
- `reports/family-divorce-public-body-static-qa-2026-05-21.csv`

Live public snapshot source:
- `reports/family-divorce-live-target-backup-2026-05-21/manifest.csv`

## Execution Boundary

ALLOWED AFTER APPROVAL:
- Update an existing approved target page.
- Replace or edit only approved body content.
- Apply approved title/H1/meta/taxonomy/related-link values only when an approved metadata package exists.
- Save current editor/database rollback material before editing.
- Run post-upload route, source, link and visual QA.

NOT ALLOWED IN THIS RUNBOOK:
- Creating duplicate pages.
- Changing slugs.
- Redirecting old Hebrew URLs.
- Noindexing old pages.
- Changing canonicals except to preserve or verify intended self-canonicals.
- Removing pages or assets from sitemap.
- Editing protected PDFs, DOCX files, calculators, case-law pages or old source URLs.
- Publishing fake ratings, recommendations, badges, testimonials or Review/AggregateRating schema.

## Required Pre-Edit Backup

Before editing each approved page, capture actual WordPress editor/database rollback material. The existing public text snapshots are useful comparison evidence, but they are not a sufficient rollback backup.

Minimum backup fields:
- WordPress post ID.
- Current post title.
- Current slug/permalink.
- Current full editor body.
- Current SEO title.
- Current meta description.
- Current OG title and OG description if editable.
- Current canonical value.
- Current robots/indexing value.
- Current taxonomy/category terms.
- Current featured image if any.
- Current manual related-content fields if any.
- Current revision ID or timestamp.

Recommended backup folder name:
- `reports/family-divorce-cms-editor-backup-YYYY-MM-DD/`

Do not commit secrets, admin cookies, database credentials or private exports. If a full database dump is created, keep it outside Git unless the owner explicitly approves a sanitized copy.

## Operator Workflow

1. Confirm owner decision for the page is `APPROVE`.
2. Confirm page is still an existing live target with HTTP `200` and the expected final path.
3. Export/copy the full editor rollback material before editing.
4. Open the existing WordPress page. Do not create a new page.
5. Paste or edit only from the approved public-body draft file.
6. Apply only approved metadata/taxonomy/related-link fields.
7. Save as draft/preview first if the CMS workflow allows it.
8. Recheck preview or public page for status, final path, title, H1, canonical, robots and visible body.
9. Recheck links to approved Family/Divorce targets.
10. Confirm protected old URLs/assets were not touched.
11. Capture desktop and mobile screenshots after the page stays on its own final path.
12. If a critical issue appears, restore from the page-specific backup immediately.

## Page Queue

| Target | Wave | Draft file | Static QA | Upload status | Operator action |
|---|---|---|---|---|---|
| `/divorce-lawyer/` | 1A | `content-drafts/divorce-lawyer-public-body-he.md` | PASS / 2106 words | BLOCKED | Update existing page only after approval and backup |
| `/consensual-divorce/` | 1B | `content-drafts/consensual-divorce-public-body-he.md` | PASS / 1656 words | BLOCKED | Update existing page only after approval and backup |
| `/divorce-mediation/` | 1B | `content-drafts/divorce-mediation-public-body-he.md` | PASS / 1834 words | BLOCKED | Update existing page only after approval and backup |
| `/divorce-property-division/` | 1B | `content-drafts/divorce-property-division-public-body-he.md` | PASS / 1851 words | BLOCKED | Update existing page only after approval and backup |
| `/family-dispute-resolution/` | 1B | `content-drafts/family-dispute-resolution-public-body-he.md` | PASS / 1793 words | BLOCKED | Update existing page only after approval and backup |
| `/child-support/` | 1B | `content-drafts/child-support-public-body-he.md` | PASS / 1650 words | BLOCKED | Update existing page only after approval and backup |
| `/child-custody/` | 1B | `content-drafts/child-custody-public-body-he.md` | PASS / 1748 words | BLOCKED | Update existing page only after approval and backup |

## Post-Upload QA

MUST VERIFY AFTER EACH APPROVED UPDATE:
- HTTP status is `200`.
- Final path matches the target path.
- Page is not accidentally redirected to homepage.
- Canonical is self-canonical unless a separately approved canonical decision exists.
- Robots does not accidentally add `noindex`.
- Visible H1 matches the approved page intent.
- Body has no internal notes, TODOs, source notes or competitor notes.
- Body has no fake trust, rating, review or guaranteed-result claims.
- Internal links resolve over HTTPS.
- Related cards do not show rankings, fake trust, Maya profile, LegalTech routes or protected assets unless separately approved.
- Protected old URLs/assets remain reachable and unchanged.
- Desktop and mobile screenshots show readable content and no obvious CTA/accessibility overlap.

## Current Status

READY:
- Seven page drafts are locally merged and static-QA clean.
- Three high-risk merge blockers are resolved locally.
- Public live snapshots exist for all seven target pages.
- Owner review packet exists.

BLOCKED:
- Owner/legal/source approval is not complete.
- Actual CMS editor/database backup is not complete.
- GSC API/export is still required before URL migration, redirects, noindex, canonical retirement or sitemap actions.
- Public upload and post-upload QA have not happened.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
