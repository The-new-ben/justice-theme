# Related Content Implementation Report
Date: 2026-05-10

## Status

- CODE FIXED V3: semantic related-content selection is implemented in `inc/related-content.php`, with a cluster gate for taxonomy fallback and safe QA attributes for post-deploy DOM checks.
- VERIFIED: PHP lint passed for 127 PHP files.
- LIVE VERIFIED PARTIAL: public article `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"` after uPress pull/cache clear.
- CODE FIXED / NOT LIVE VERIFIED: V3 should make off-cluster cards easier to detect after deployment; deployment and repeat visual QA are still required.

## What Changed

- Manual editorial URLs now have first priority through `manual_related_urls`, `related_urls`, and `parent_pillar_url` article metadata.
- Articles with the same `content_cluster` are selected before taxonomy fallback.
- Shared `practice-areas` taxonomy is used only after manual and cluster matches.
- Shared `practice-areas` fallback now requires a matching inferred editorial cluster when the source page has enough slug/meta/title signals.
- Manual URL fields now accept comma, newline, pipe and semicolon separators.
- Related sections expose `data-related-source-cluster` and `data-related-card-count`.
- Related cards expose `data-related-card-cluster` and `data-related-cluster-match`.
- Global latest-post fallback was removed from single-article related cards.
- If no semantic related article exists, the public page shows a relevant practice-area link instead of unrelated cards.

## Why

Related articles are part of the SEO and user journey. A visitor reading about a specific legal issue should see the next useful legal step, not a random latest item or legacy post.

## Safety

- No public content was changed.
- No URL, slug, redirect, canonical, sitemap, robots, wp-admin, CRM or database action was changed.
- No article was published or deleted.

## 2026-05-11 CMS Metadata Batch 001

- CREATED: `project-control/related-content-cms-update-batch-001.csv`.
- STATUS: READY_FOR_CMS_METADATA_UPDATE_NO_CONTENT_BODY_CHANGE.
- WHY: live related-content QA showed unrelated cards on general lawyer-selection, criminal/drug-offense, and real-estate cost pages.
- WHAT TO SET IN CMS: `content_cluster`, `parent_pillar_url`, and `manual_related_urls`.
- NOT EXECUTED: no WordPress metadata, article body, URL, redirect, taxonomy or database row was changed from this repo session.

## 2026-05-11 QA Attributes V1

- CODE FIXED: related cards can now be inspected for source cluster, card cluster and match/mismatch state.
- QA RULE: `data-related-cluster-match="mismatch"` should be treated as an editorial review warning, especially when the card was not manually selected.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and DOM QA against marker `2026-05-11-related-content-qa-attrs-v1`.

## 2026-05-11 URL Inference Fix

- CREATED: `tools/check-live-related-content-qa.ps1`.
- CREATED: `project-control/live-related-content-qa-2026-05-11-before-url-inference.csv`.
- FOUND LIVE: general lawyer-selection and criminal/drug-offense samples still had `data-related-source-cluster="unknown"` and off-topic cards because inference did not use the public permalink/request path.
- FIXED IN CODE: `justice_theme_related_context_text()` now includes `get_permalink( $post_id )` and, for the current source page, the current request URI.
- EXPECTED IMPACT: clean public URL slugs such as `/find-lawyer-how-to-find-good-attorney/` and `/drug-offenses-criminal-lawyer/` can drive cluster inference even when old post metadata is weak.
- VERIFIED: PHP lint passed for 128 PHP files.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and rerun of `tools/check-live-related-content-qa.ps1`.

## Next

1. Fill CMS metadata for priority articles: `manual_related_urls`, `parent_pillar_url`, `content_cluster`.
2. Use `project-control/related-content-map.csv` as the editorial source for family, criminal, real estate, malpractice, traffic and inheritance clusters.
3. After uPress pull/cache clear, repeat live visual QA for one general lawyer-selection article, one family article, one criminal article and one real-estate article.
4. During that QA, record any related card with `data-related-cluster-match="mismatch"`.
5. Add GA4 event tracking for related-article clicks later.
