# Medical Malpractice CMS Identity Operator Runbook - 2026-05-22

Status: READY FOR OPERATOR PREP / EXECUTION BLOCKED / NO PUBLIC CHANGES

This runbook explains how the operator should verify the duplicate CMS identity behind `/medical-malpractice-lawyer/` before any Medical Malpractice upload. It is not approval to edit WordPress, publish content, change a slug, redirect a page, change canonicals/noindex, change sitemap, edit taxonomy, update internal links, change media, add schema, add lawyer cards, or touch CRM.

## Scope

Target public URL:
- `https://jus-tice.co.il/medical-malpractice-lawyer/`

Duplicate candidate IDs from local exports:
- ID `11607`: newer commercial-title candidate, `5,135` words, heuristic quality `6`, no featured image, no detected outgoing internal links.
- ID `1130`: older shorter candidate, `3,287` words, heuristic quality `8`, featured image `1131`, one detected outgoing internal link.

Primary evidence:
- `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.md`
- `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.csv`
- `project-control/medical-malpractice-owner-decision-packet-2026-05-22.md`
- `project-control/medical-malpractice-readiness-dashboard-2026-05-22.md`
- `project-control/slug-conflict-review.csv`
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`

## Execution Boundary

ALLOWED AFTER OWNER AUTHORIZATION:
- Inspect both WordPress editor records.
- Export rollback evidence for both IDs.
- Confirm which ID owns the rendered public URL and canonical permalink.
- Compare title, slug, body, media, internal links, taxonomy, SEO fields and revision state.
- Record one owner decision from the allowed list below.

NOT ALLOWED IN THIS RUNBOOK:
- Saving editor changes.
- Publishing body changes.
- Changing either slug.
- Creating a new page.
- Redirecting, noindexing, canonicalizing, deleting, merging, or moving either record.
- Changing taxonomy/category.
- Replacing featured images.
- Adding related cards, schema, lawyer cards, ratings, trust claims, lead-routing blocks or CRM settings.

## Required Evidence Before Any Later CMS Upload

For both IDs `11607` and `1130`, export or record:
- WordPress post ID.
- Current post status.
- Current post title.
- Current slug and full permalink.
- Current full editor body.
- Current SEO title.
- Current meta description.
- Current OG title and OG description if editable.
- Current canonical value.
- Current robots/indexing value.
- Current taxonomy/category/practice-area values.
- Current featured image ID and URL if present.
- Current manual related-content fields if any.
- Current outgoing internal links.
- Current revision ID or latest revision timestamp.
- Screenshot of the editor identity area showing post ID/permalink if available.

Recommended backup folder:
- `reports/medical-malpractice-cms-editor-backup-YYYY-MM-DD/`

Do not commit admin cookies, private credentials, database dumps, raw wp-admin HTML containing secrets, or unsanitized private exports.

## Operator Workflow

1. Confirm owner has authorized inspection only.
2. Open ID `11607` in wp-admin and export the full rollback evidence.
3. Open ID `1130` in wp-admin and export the full rollback evidence.
4. Confirm whether both records still exist and are published.
5. Confirm each record permalink and whether WordPress resolves both to the same public URL.
6. Confirm which ID is served when viewing `https://jus-tice.co.il/medical-malpractice-lawyer/`.
7. Compare canonical value, title/H1, SEO fields, body sections, featured image, internal links and taxonomy.
8. Identify assets that must not be lost if one record becomes authoritative.
9. Record owner/operator finding in the CSV decision field outside WordPress.
10. Stop. Do not edit content or save either post during this runbook.

## Allowed Owner Decisions

- `KEEP_11607_AS_AUTHORITATIVE`: use ID `11607` as the future current-URL update target after backup, owner approval, source/legal review and GSC checks.
- `KEEP_1130_AS_AUTHORITATIVE`: use ID `1130` as the future current-URL update target after backup, owner approval, source/legal review and GSC checks.
- `MERGE_1130_ASSETS_INTO_11607`: keep ID `11607` as the future target, but manually review whether ID `1130` sections, image, link or metadata should be preserved.
- `HOLD_PENDING_WP_ADMIN_DB_CHECK`: do not proceed because the actual CMS state is unclear.

## Decision Criteria

Prefer `KEEP_11607_AS_AUTHORITATIVE` only if:
- wp-admin/database confirms ID `11607` is the rendered/canonical record.
- Its body is the current intended commercial pillar base.
- Missing media/internal-link assets from ID `1130` are either not useful or separately merged after approval.

Prefer `KEEP_1130_AS_AUTHORITATIVE` only if:
- wp-admin/database confirms ID `1130` is the rendered/canonical record.
- Its higher quality/media/link state is the actual intended page state.
- The newer ID `11607` does not contain needed sections or can be safely held.

Prefer `MERGE_1130_ASSETS_INTO_11607` only if:
- ID `11607` is confirmed as the authoritative served record.
- ID `1130` has useful image, internal links, explanations, FAQ/checklist sections, or metadata worth preserving.
- Merge material is manually reviewed and source/legal safe.

Prefer `HOLD_PENDING_WP_ADMIN_DB_CHECK` if:
- The served record is unclear.
- Either ID cannot be inspected.
- The canonical/permalink state conflicts with the public URL.
- Editor content differs from local exports in a way that changes the decision.

## Minimum Checklist Before Medical Malpractice Upload

1. This identity runbook is completed.
2. Owner records one allowed authoritative-record decision.
3. WordPress rollback evidence exists for both IDs.
4. Focused GSC API export is run and decision maps are regenerated from API data.
5. Source/legal/privacy review clears the selected body and any preserved material.
6. Internal links, taxonomy, metadata and schema policy are approved for the selected current URL.
7. Clean English slugs, redirects, canonical/noindex, sitemap and taxonomy restructuring remain excluded unless separately approved.

## Still Blocked

- BLOCKED: owner/operator wp-admin/database identity check.
- BLOCKED: authoritative-record decision.
- BLOCKED: source/legal/privacy review.
- BLOCKED: focused Medical Malpractice GSC API export.
- BLOCKED: public CMS upload and post-upload visual QA.
- BLOCKED: URL migration, redirects, canonicals, noindex, sitemap, taxonomy and internal-link writes.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
