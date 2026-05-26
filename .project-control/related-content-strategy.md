# Related Content Strategy

Date: 2026-05-10  
Status: PARTIAL LIVE VERIFIED / QUALITY CLEANUP NEEDED

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

Status: PARTIAL LIVE VERIFIED. No public content, URL, redirect, sitemap, robots or database changes were made.

## 2026-05-11 Live Related-Content QA

- LIVE VERIFIED: sampled article pages for general lawyer selection, family/divorce, criminal/drug offenses and real-estate cost all render `data-related-mode="semantic"`.
- LIVE VERIFIED: sampled public article bodies did not expose unsafe internal markers such as `NOT VERIFIED`, source-audit labels, owner instructions or developer notes.
- PARTIAL QUALITY: the semantic ladder is technically live, but the available metadata is not clean enough. General and criminal samples still surface off-intent related cards such as AI-for-law-firms, business-license and Australia lawyers. The real-estate sample includes a weak Cyprus pricing match.
- EVIDENCE: `project-control/visual-evidence/related-content-live-qa-2026-05-11.json` plus the `related-content-*-2026-05-11.png` screenshots.
- NEXT: populate `manual_related_urls`, `content_cluster`, `parent_pillar_url` and correct `practice-areas` terms for priority articles before calling related content customer-ready.
- NEXT: add a cluster mismatch QA rule that flags related cards whose URL/topic does not match the source page cluster.

## 2026-05-11 Cluster Gate V2

- CODE FIXED: taxonomy fallback now passes through a conservative cluster gate before cards are accepted.
- CODE FIXED: the gate normalizes common cluster aliases (`family-law`/`family_divorce`, `criminal`/`criminal_law`, `real_estate_law`/`real_estate`, etc.).
- CODE FIXED: when explicit CMS cluster metadata is missing, the template infers an editorial cluster from slug, title, primary keyword, search intent and practice-area terms.
- EXPECTED IMPACT: generic/shared taxonomy terms should no longer connect a criminal guide to AI-for-law-firms, business-license or Australia-lawyer cards.
- EXPECTED IMPACT: real-estate pages should stop accepting international/Cyprus-style cards unless the source page is also international.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and repeat of the 2026-05-11 related-content sample.

## 2026-05-11 Priority CMS Metadata Batch 001

- CREATED: `project-control/related-content-cms-update-batch-001.csv`.
- PURPOSE: convert the weak live related-content QA findings into specific CMS metadata work, without changing public article bodies in the repo.
- SCOPE: four sampled pages from the 2026-05-11 live QA:
  - `/find-lawyer-how-to-find-good-attorney/`
  - `/drug-offenses-criminal-lawyer/`
  - `/real-estate-lawyer-cost-2025/`
  - `/mutual-divorce-agreement-2025/`
- RECOMMENDED CMS FIELDS: set `content_cluster`, `parent_pillar_url`, and `manual_related_urls` for each row.
- NOT EXECUTED: no CMS metadata was updated from this repo session.
- OWNER APPROVAL REQUIRED: yes, because even metadata changes can alter public related-card output.

## 2026-05-11 QA Attribute Batch

- CODE FIXED: manual related metadata now accepts comma, newline, pipe and semicolon separators.
- CODE FIXED: related sections expose `data-related-source-cluster` and `data-related-card-count`.
- CODE FIXED: related cards expose `data-related-card-cluster` and `data-related-cluster-match`.
- QA USE: after deployment, DOM checks can flag `data-related-cluster-match="mismatch"` for editorial review instead of relying only on screenshots.
- LIMITATION: a mismatch is a QA warning, not an automatic failure, because some manually selected cross-cluster links may be intentional.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and repeat related-content sample QA.

## 2026-05-10 Implementation Notes

- CODE FIXED: `inc/related-content.php` now collects related cards through a semantic ladder:
  - manual editorial URLs in `manual_related_urls`, `related_urls`, or `parent_pillar_url`;
  - same `content_cluster` metadata;
  - same `practice-areas` taxonomy.
- CODE FIXED: related cards are limited to public `articles` and `page` content types, avoiding legacy standard `post` fallback.
- CODE FIXED: if no semantic card exists, the template shows a relevant practice-area link rather than unrelated latest posts.
- VERIFIED: PHP lint passed for 127 PHP files.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and article-page visual check.
