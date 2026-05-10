# Related Content Strategy

Date: 2026-05-10  
Status: STRATEGY V1 - no code changes executed

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

1. Fill `related-content-map.csv` for priority clusters.
2. Add CMS metadata fields or import mapping.
3. Update related-content query logic to prefer map/cluster data.
4. Add QA checks that flag unrelated results.
5. Track `article_cta_click`, `lawyer_card_click`, and `related_article_click` in GA4.

Status: PLANNED. No public content or URL changes were made.
