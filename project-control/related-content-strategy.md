# Related Content Strategy

Date: 2026-05-10  
Status: CODE FIXED V1 / NOT LIVE VERIFIED

## Goal

Related articles must be semantic, useful and cluster-aware. They must not be random latest posts.

A visitor reading a page about criminal law should see criminal-law support pages, relevant lawyer profiles and official/public resources, not unrelated foreign-lawyer lists or family-law articles.

## Selection Priority

Use this order when building or improving the related-content algorithm:

1. Manual editorial relationship in `project-control/related-content-map.csv`.
2. Same topic cluster.
3. Same parent pillar.
4. Same practice-area taxonomy.
5. Same search intent.
6. Shared target keyword or GSC query relationship.
7. Related lawyer profile or directory filter.
8. Official/public source if it helps the user.
9. Fallback to latest content only inside the same cluster.

Never use global latest posts as the only fallback on important legal pages.

## Required CMS Fields

Recommended article metadata:
- `topic_cluster`
- `parent_pillar_url`
- `search_intent`
- `primary_keyword`
- `secondary_keywords`
- `related_priority`
- `manual_related_urls`
- `connected_lawyer_slug`
- `source_review_status`
- `legal_review_status`

Status: PARTIAL. Some repo draft metadata exists; full CMS field support is NOT VERIFIED.

## Template Behavior

Pillar pages:
- Link to the main support articles.
- Link to relevant lawyer directory pages.
- Link to official/public sources where useful.

Supporting articles:
- Link back to the parent pillar.
- Link to 2-5 sibling support articles.
- Link to a relevant directory/filter page if stable.
- Link to the lead/intake CTA.

Lawyer profiles:
- Link to pillar pages in the lawyer's practice areas.
- Link to articles attached to the lawyer or practice cluster.

## Mobile Behavior

Mobile related-content blocks should:
- show the strongest 3-4 items first.
- avoid overwhelming long article pages.
- keep links in HTML.
- use stable card dimensions.
- avoid layout shift from missing images.

## Quality Rule

If no semantic related content exists, show fewer items and a clear category/pillar link. Do not fill the space with irrelevant content.

## Implementation Plan

1. DONE: Updated related-content query logic to prefer manual URLs, then `content_cluster`, then shared practice area.
2. DONE: Removed global latest-post fallback from the single-article related block.
3. DONE: Kept a user-facing fallback that links to the relevant practice area instead of filling the block with unrelated cards.
4. NEXT: Fill `related-content-map.csv` and CMS `manual_related_urls` metadata for priority clusters.
5. NEXT: Add QA checks that flag unrelated results.
6. NEXT: Track `article_cta_click`, `lawyer_card_click`, and `related_article_click` in GA4.

Status: CODE FIXED. No public content, URL, redirect, sitemap, robots or database changes were made. Live output remains NOT VERIFIED until uPress pulls the latest theme code.

## 2026-05-10 Implementation Notes

- CODE FIXED: `inc/related-content.php` now collects related cards through a semantic ladder:
  - manual editorial URLs in `manual_related_urls`, `related_urls`, or `parent_pillar_url`;
  - same `content_cluster` metadata;
  - same `practice-areas` taxonomy.
- CODE FIXED: related cards are limited to public `articles` and `page` content types, avoiding legacy standard `post` fallback.
- CODE FIXED: if no semantic card exists, the template shows a relevant practice-area link rather than unrelated latest posts.
- VERIFIED: PHP lint passed for 127 PHP files.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and article-page visual check.
