# Medical Malpractice Duplicate Identity Review - 2026-05-26

## Status

FIXED local review packet. VERIFIED local generation completed from repo exports. NOT VERIFIED in wp-admin/database and NOT VERIFIED by focused GSC API export.

REVIEW ONLY: this file does not approve a CMS edit, content overwrite, URL change, redirect, canonical/noindex change, sitemap change, taxonomy edit, internal-link write, media change, schema change, lawyer-card change or CRM change.

## Batch Completed

- Reviewed CMS IDs: `11607, 1130`.
- Output rows: `8`.
- Same public URL in local export: `YES`.
- Distinct content hashes: `2`.
- Slug conflict count: `27`.
- Exact current records in slug conflict review: `2`.
- Slug-conflict proposed primary post ID: `11607`.
- Upload approved now: `0`.

## Record Comparison

| Post ID | Field | Value | Comparison | Risk | Recommended owner action |
| --- | --- | --- | --- | --- | --- |
| 11607 | record_profile | title=עורך דין רשלנות רפואית | עו”ד רשלנות רפואית; slug=%d7%a2%d7%95%d7%a8%d7%9a-%d7%93... | Compare ID 1130: מומחים לענייני רשלנות רפואית; words=3287; quality=8 | SAME_PUBLIC_URL | CANDIDATE_AUTHORITATIVE_RECORD_AFTER_OWNER_REVIEW |
| 1130 | record_profile | title=מומחים לענייני רשלנות רפואית; slug=%d7%a2%d7%95%d7%a8%d7%9a-%d7%93%d7%99%d7%9f-%d... | Compare ID 11607: עורך דין רשלנות רפואית | עו”ד רשלנות רפואית; words=5135; quality=6 | SAME_PUBLIC_URL | COMPARE_FOR_MERGE_ASSET_OR_HOLD_DECISION |

## Material Differences

| Post ID | Field | Value | Comparison | Risk | Recommended owner action |
| --- | --- | --- | --- | --- | --- |
| - | word_count_delta | 11607: 5135 | 1130: 3287 | CONTENT_MERGE_REVIEW | COMPARE_BODY_SECTIONS_BEFORE_OVERWRITE |
| - | quality_media_links_delta | 11607: quality=6; media=0; links=NO | 1130: quality=8; media=1; links=YES | DO_NOT_DROP_USEFUL_ASSETS | IF_FIRST_ID_IS_AUTHORITATIVE_REVIEW_WHETHER_SECOND_ID_MEDIA_LINKS_OR_SECTIONS_SHOULD_BE_MERGED |
| - | taxonomy_delta | 11607: practice_area=308 | 1130: practice_area=76 | TAXONOMY_ID_MISMATCH | CONFIRM_CANONICAL_MEDICAL_MALPRACTICE_TAXONOMY_BEFORE_CMS_SAVE |

## Decision Rows

| Post ID | Field | Value | Comparison | Risk | Recommended owner action |
| --- | --- | --- | --- | --- | --- |
| - | same_public_url | http://jus-tice.co.il/medical-malpractice-lawyer/ | ID 11607: %d7%a2%d7%95%d7%a8%d7%9a-%d7%93%d7%99%d7%9f-%d7%a8%d7%a9%d7%9c%d7%a0%d7%95%d7... | P0_DUPLICATE_PUBLIC_URL | RESOLVE_AUTHORITATIVE_CMS_RECORD_BEFORE_UPLOAD |
| - | duplicate_decision_rows | 0 duplicate identity decision rows in current owner packet |  | OWNER_DECISION_REQUIRED | OWNER_MARKS_AUTHORITATIVE_RECORD_OR_HOLD |
| - | pre_upload_sequence | 1 backup both IDs; 2 verify wp-admin/database canonical served record; 3 compare body/m... |  | UPLOAD_BLOCKED_UNTIL_RESOLVED | HOLD_MEDICAL_MALPRACTICE_UPLOAD_UNTIL_DUPLICATE_IDENTITY_IS_RESOLVED |

## Practical Interpretation

- ID `11607` is the newer commercial-title candidate and is the proposed primary in the slug-conflict review, but it has lower heuristic quality, no featured image and no detected outgoing internal links.
- ID `1130` is older and shorter, but it has a higher heuristic quality score, a featured image and at least one outgoing internal link.
- Both records share the same public URL in the local export, so public upload must not proceed until wp-admin/database confirms which record is actually authoritative and how WordPress is resolving the duplicate slug state.

## Allowed Owner Decisions

- `KEEP_11607_AS_AUTHORITATIVE`: use ID 11607 as the current URL update target after backup and review.
- `KEEP_1130_AS_AUTHORITATIVE`: use ID 1130 as the current URL update target after backup and review.
- `MERGE_1130_ASSETS_INTO_11607`: keep 11607 as authoritative but manually review whether 1130 sections, image or links should be preserved.
- `HOLD_PENDING_WP_ADMIN_DB_CHECK`: do not upload Medical Malpractice until the actual CMS state is inspected.

## Minimum Checklist Before Medical Malpractice CMS Upload

1. Export WordPress editor values and database rollback material for both IDs.
2. Confirm in wp-admin/database which post ID owns the rendered public URL and canonical permalink.
3. Compare body sections, featured image, internal links, taxonomy, title/H1/meta and modified dates.
4. Decide whether any content/media/link assets from the non-authoritative record should be merged.
5. Keep the current URL; do not create or migrate to another slug in this step.
6. Run focused GSC export before any redirect, canonical/noindex, sitemap or slug migration decision.
7. Complete source/legal review before public body update.

## Still Blocked

- BLOCKED: authoritative CMS record decision.
- BLOCKED: WordPress editor/database rollback backup.
- BLOCKED: focused Medical Malpractice GSC export.
- BLOCKED: source/legal review.
- BLOCKED: public CMS upload, URL migration, redirects, canonicals, noindex, sitemap, taxonomy and internal-link writes.

## Outputs

- `.reports/medical-malpractice-duplicate-identity-review-2026-05-26.csv`
- `.reports/medical-malpractice-duplicate-identity-review-2026-05-26.json`
- `.project-control/medical-malpractice-duplicate-identity-review-2026-05-26.csv`

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
