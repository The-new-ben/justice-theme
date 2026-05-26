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
- CREATED: `project-control/live-related-content-qa-2026-05-11-after-url-inference.csv`.
- FOUND LIVE: general lawyer-selection and criminal/drug-offense samples still had `data-related-source-cluster="unknown"` and off-topic cards because inference did not use the public permalink/request path.
- FIXED IN CODE: `justice_theme_related_context_text()` now includes `get_permalink( $post_id )` and, for the current source page, the current request URI.
- EXPECTED IMPACT: clean public URL slugs such as `/find-lawyer-how-to-find-good-attorney/` and `/drug-offenses-criminal-lawyer/` can drive cluster inference even when old post metadata is weak.
- VERIFIED: PHP lint passed for 128 PHP files.
- LIVE VERIFIED PARTIAL: after uPress pulled `fec30a2`, the criminal/drug-offense sample moved to `criminal_law` with three matching cards. The general lawyer-selection article stopped showing off-topic cards but exposed no fallback QA attributes, so it remained REVIEW.

## 2026-05-11 Fallback QA Attributes

- FIXED IN CODE: fallback related sections now expose `data-related-mode="fallback"`, `data-related-source-cluster`, and `data-related-card-count="0"`.
- FIXED IN CODE: when no semantic cards exist and no practice-area term is available, known clusters can render a controlled fallback link to the relevant lawyer-directory view instead of random latest posts.
- FIXED IN CODE: the live QA script now accepts semantic and fallback modes, but only marks fallback rows VERIFIED when the expected source cluster is detected.
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Expose related fallback QA attributes` at commit `40ee1c4`.
- LIVE VERIFIED: public static marker returns `2026-05-11-related-fallback-qa-v1`.
- LIVE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` passed with all sampled rows marked `VERIFIED`.
- FIXED LIVE: `/find-lawyer-how-to-find-good-attorney/` now reports `related_mode=fallback` and `detected_source_cluster=lawyer_selection` instead of `missing`, with no off-topic related cards.
- FIXED LIVE: `/drug-offenses-criminal-lawyer/` reports `criminal_law` with three matching criminal-law cards.

## 2026-05-11 International Real-Estate Filter

- FIXED IN CODE: `justice_theme_related_infer_cluster()` now recognizes foreign/international real-estate signals such as Greece, Cyprus, Italy, Portugal, Spain and Australia.
- FIXED IN CODE: if old metadata says `real_estate` but the slug/title clearly points to a foreign market, the related-content gate treats it as `international`.
- LIVE DEPLOYMENT VERIFIED: uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Filter international real estate related cards` at commit `4868db2`.
- LIVE VERIFIED: public static marker returns `2026-05-11-related-international-filter-v1`.
- LIVE VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv` passed with all sampled rows marked `VERIFIED`.
- FIXED LIVE: `/real-estate-lawyer-cost-2025/` no longer shows the Greece pricing article as a related card; the replacement card stays in the local/legal real-estate lane.
- SAFETY: no article body, CMS metadata, taxonomy, URL, redirect, canonical, sitemap, lawyer, CRM, review or plugin state was changed.

## Next

1. Fill CMS metadata for priority articles: `manual_related_urls`, `parent_pillar_url`, `content_cluster`.
2. Use `project-control/related-content-map.csv` as the editorial source for family, criminal, real estate, malpractice, traffic and inheritance clusters.
3. Continue CMS metadata cleanup for weak but same-cluster recommendations, including real-estate cards that are local/legal but still too broad for the source article intent.
4. During future QA, record any related card with `data-related-cluster-match="mismatch"` or any same-cluster card that is semantically weak.
5. Add GA4 event tracking for related-article clicks later.
