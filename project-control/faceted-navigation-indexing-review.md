# Faceted Navigation And Filter Indexing Review

Date: 2026-05-10  
Status: STRATEGY V1 - no robots/canonical changes executed

## Problem

The lawyer directory will naturally support filters by practice area, city, language and perhaps plan/availability. These filters are useful for users but can create crawl/index bloat if every combination becomes indexable.

## Indexing Rule

Index only curated, useful hub pages. Do not index arbitrary query-string filter combinations until they have:
- unique user value.
- stable demand.
- enough lawyer/content depth.
- clear title/H1/meta.
- self-canonical URL.
- internal links.
- sitemap inclusion decision.

## Current Recommended Split

Indexable candidates later:
- `/lawyers/`
- approved practice hubs such as `/criminal-lawyer/`, `/divorce-lawyer/`
- approved city/practice landing pages only after content depth exists.

Noindex/canonical candidates:
- `/lawyers/?area=...`
- `/lawyers/?city=...`
- `/lawyers/?area=...&city=...`
- empty or near-empty filter pages.
- sort/pagination/query variants where content is duplicate.

## Current Status

PARTIAL:
- Repo has noindex/canonical hardening for some non-singular/search/filter states according to earlier code work.

NOT VERIFIED LIVE:
- Whether live `/lawyers/?area=family-law` emits the intended robots/canonical after latest deployment/cache.
- Whether sitemap includes query URLs.
- Whether GSC has indexed filter variants.

## Required Map

Before launching city/practice pages:
- add candidate URL to `url-migration-map.csv`.
- add category/hub intent to `category-map.csv`.
- define index/noindex decision.
- define canonical.
- define sitemap inclusion.
- define internal link source.

## Next Action

Use GSC indexing examples and public crawl export to identify any indexed query/filter URLs, then classify each as INDEXABLE_HUB, NOINDEX_FILTER, CANONICAL_TO_DIRECTORY or NEEDS_OWNER_REVIEW.
