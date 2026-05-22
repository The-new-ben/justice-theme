# Criminal CMS Operator Runbook - 2026-05-22

Status: READY FOR OPERATOR PREP / EXECUTION BLOCKED / NO PUBLIC CHANGES

This runbook explains how the CMS operator should handle the five Criminal first-upload pages after owner/legal/source approval. It is not an approval to publish and it does not authorize redirects, URL migration, canonical changes, noindex changes, sitemap changes, taxonomy restructuring, old-URL retirement, related-card edits, lawyer-card changes, lead/CRM changes, wp-admin setting changes or database writes.

## Scope

Target pages:

1. `/criminal-defense-attorney/`
2. `/%D7%94%D7%9B%D7%A0%D7%94-%D7%9C%D7%97%D7%A7%D7%99%D7%A8%D7%94-%D7%91%D7%9E%D7%A9%D7%98%D7%A8%D7%94/`
3. `/detention-before-charge-or-trial/`
4. `/articles/%D7%9E%D7%97%D7%99%D7%A7%D7%AA-%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%97%D7%96%D7%A8%D7%94-%D7%9E%D7%9B%D7%AA%D7%91-%D7%90%D7%99%D7%A9%D7%95%D7%9D-%D7%91%D7%99%D7%98%D7%95%D7%9C/`
5. `/drug-offenses-criminal-lawyer/`

Primary source packet:
- `project-control/criminal-owner-review-packet-2026-05-22.md`
- `project-control/criminal-owner-review-packet-2026-05-22.csv`

Readiness evidence:
- `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`
- `project-control/criminal-first-upload-draft-closure-2026-05-22.md`
- `project-control/criminal-law-source-legal-checklist-2026-05-11.csv`

## Execution Boundary

ALLOWED AFTER APPROVAL:
- Update an existing approved current URL.
- Replace or edit only approved body content from the matching draft file.
- Apply approved title/H1/meta/taxonomy/related-link values only when an approved metadata package exists.
- Capture actual WordPress editor/database rollback material before editing.
- Run post-upload route, content, link, indexability and visual QA.

NOT ALLOWED IN THIS RUNBOOK:
- Creating duplicate clean-slug pages.
- Changing slugs to `/criminal-lawyer/`, `/police-investigation/`, `/pretrial-detention/`, `/indictment/` or `/drug-offenses/`.
- Redirecting old Hebrew URLs, `detention-days`, case-law pages or drug-boundary pages.
- Noindexing old pages.
- Changing canonicals except to preserve or verify intended self-canonicals.
- Removing pages from sitemap.
- Editing protected source pages, case-law pages, police-directory pages, traffic/drug-driving pages or criminal-record support pages.
- Publishing fake ratings, recommendations, badges, testimonials, best/top claims or Review/AggregateRating schema.

## Required Pre-Edit Backup

Before editing each approved page, capture actual WordPress editor/database rollback material. Public text snapshots and local drafts are not a sufficient rollback backup.

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
- `reports/criminal-cms-editor-backup-YYYY-MM-DD/`

Do not commit secrets, admin cookies, database credentials or private exports. If a full database dump is created, keep it outside Git unless the owner explicitly approves a sanitized copy.

## Operator Workflow

1. Confirm owner decision for the page is `APPROVE_CURRENT_URL_UPDATE`.
2. Confirm legal/source review is complete enough for publication with disclaimers.
3. Confirm page is still an existing live target with HTTP `200` and the expected final path.
4. Export/copy the full editor rollback material before editing.
5. Open the existing WordPress page. Do not create a new page.
6. Paste or edit only from the approved draft file.
7. Apply only approved metadata/taxonomy/related-link fields.
8. Save as draft/preview first if the CMS workflow allows it.
9. Recheck preview or public page for status, final path, title, H1, canonical, robots and visible body.
10. Recheck links to approved current Criminal target URLs only.
11. Confirm protected old URLs, support URLs and boundary pages were not touched.
12. Capture desktop and mobile screenshots after the page stays on its own final path.
13. If a critical issue appears, restore from the page-specific backup immediately.

## Page Queue

| Target | Wave | Draft file | Words | Upload status | Operator action |
|---|---|---|---:|---|---|
| `/criminal-defense-attorney/` | 1A | `content-drafts/criminal-lawyer-pillar-he.md` | 5390 | BLOCKED | Update existing current pillar only after approval and backup |
| Police investigation current Hebrew URL | 1B | `content-drafts/police-investigation-supporting-he.md` | 3724 | BLOCKED | Update existing Hebrew URL only after approval, backup and rights-wording review |
| `/detention-before-charge-or-trial/` | 1B | `content-drafts/pretrial-detention-supporting-he.md` | 3733 | BLOCKED | Update existing detention page only; do not merge or redirect `detention-days` |
| Current indictment article URL | 1B | `content-drafts/indictment-supporting-he.md` | 2148 | BLOCKED | Update existing article only; do not redirect/canonicalize case-specific indictment pages |
| `/drug-offenses-criminal-lawyer/` | 1B | `content-drafts/drug-offenses-supporting-he.md` | 2237 | BLOCKED | Update existing drug-offenses page only; do not create duplicate `/drug-offenses/` |

## Post-Upload QA

MUST VERIFY AFTER EACH APPROVED UPDATE:
- HTTP status is `200`.
- Final path matches the approved current URL.
- Page is not accidentally redirected to homepage.
- Canonical is self-canonical unless a separately approved canonical decision exists.
- Robots does not accidentally add `noindex`.
- Visible H1 matches the approved page intent.
- Body has no internal notes, TODOs, source notes or competitor notes.
- Body has no fake trust, rating, review, best/top or guaranteed-result claims.
- Body has no legal-strategy scripts, evidence-concealment suggestions or outcome promises.
- Internal links resolve over HTTPS.
- Links use approved current URLs only; clean English slug links wait for URL migration approval.
- Related cards do not show rankings, fake trust, Maya profile, LegalTech routes or protected boundary assets unless separately approved.
- Protected old URLs, source pages, traffic/drug-driving pages and case-law pages remain reachable and unchanged.
- Desktop and mobile screenshots show readable content and no obvious CTA/accessibility overlap.

## Current Status

READY:
- Five first-upload Criminal drafts exist locally.
- Owner review packet exists.
- Source/legal checklist exists for the same five target topics.
- Criminal/Traffic readiness dashboard identifies the first current-URL upload group and blocks URL migration.

BLOCKED:
- Owner decisions are still `PENDING_OWNER_DECISION`.
- Legal/source review is not complete.
- Actual CMS editor/database rollback backup is not complete.
- GSC API/export is still required before URL migration, redirects, noindex, canonical retirement or sitemap actions.
- Public upload and post-upload QA have not happened.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
