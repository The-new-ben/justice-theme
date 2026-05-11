# Related Content Implementation Report
Date: 2026-05-10

## Status

- CODE FIXED V2: semantic related-content selection is implemented in `inc/related-content.php`, with a cluster gate for taxonomy fallback.
- VERIFIED: PHP lint passed for 127 PHP files.
- LIVE VERIFIED PARTIAL: public article `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"` after uPress pull/cache clear.
- CODE FIXED / NOT LIVE VERIFIED: V2 should reduce off-intent fallback cards found on general, criminal and real-estate samples; deployment and repeat visual QA are still required.

## What Changed

- Manual editorial URLs now have first priority through `manual_related_urls`, `related_urls`, and `parent_pillar_url` article metadata.
- Articles with the same `content_cluster` are selected before taxonomy fallback.
- Shared `practice-areas` taxonomy is used only after manual and cluster matches.
- Shared `practice-areas` fallback now requires a matching inferred editorial cluster when the source page has enough slug/meta/title signals.
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

## Next

1. Fill CMS metadata for priority articles: `manual_related_urls`, `parent_pillar_url`, `content_cluster`.
2. Use `project-control/related-content-map.csv` as the editorial source for family, criminal, real estate, malpractice, traffic and inheritance clusters.
3. After uPress pull/cache clear, repeat live visual QA for one general lawyer-selection article, one family article, one criminal article and one real-estate article.
4. Add GA4 event tracking for related-article clicks later.
