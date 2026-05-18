# `/will/` Route Conflict Review - 2026-05-18

## Goal

Resolve the immediate crawl/user bug around inheritance topic links without blindly recovering or redirecting `/will/`.

## Research Basis

- Google redirect guidance says redirects are useful when content has moved, been removed with a new destination, or when merging sites/URLs.
- Google site-move guidance recommends preparing a URL mapping from current URLs to corresponding new URLs before redirecting.
- Google soft-404 guidance discourages serving unrelated successful pages for missing URLs because it can confuse users and search engines and waste crawl coverage.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/blog/2008/08/farewell-to-soft-404s

## What Was Found

Live checks:

- `/will/` returns HTTP 404 and noindex.
- `/will-contest/` is not a verified live support URL.
- `/estate-administration/` returns HTTP 404 and noindex.
- Live replacements exist:
  - `/will-and-testament/`
  - `/will-probate-objection/`
  - `/inheritance-order/`
  - `/what-is-a-probate-order/`

Repo checks:

- `template-parts/sections/topic-clusters.php` still linked to `/will/`, `/will-contest/`, and `/estate-administration/`.
- `project-control/slug-conflict-review.csv` flags `will` as a 10-row slug conflict.
- `project-control/url-migration-map.csv` shows multiple old inheritance case-law URLs mapped to `https://jus-tice.co.il/will/` with `TARGET_SLUG_CONFLICT_NEEDS_REVIEW` and `duplicate_target_slug`.
- `project-control/redirect-map.csv` contains planned-only redirects to `/will/`, not executed.
- `inc/url-redirects.php` already contains more specific Hebrew-slug redirects for some will/probate terms, including mappings to `will-and-testament`, `will-probate-objection`, and specific case-law slugs.

## Implemented

Updated `template-parts/sections/topic-clusters.php`:

- Replaced `/will/` with `/will-and-testament/`.
- Replaced `/will-contest/` with `/will-probate-objection/`.
- Replaced `/estate-administration/` with `/what-is-a-probate-order/`.
- Added `/inheritance-order/` as a clean support link.
- Updated the deployment marker to `2026-05-18-inheritance-topic-links-v1`.

## Verification

Local:

- PHP lint passed for `functions.php`.
- PHP lint passed for `template-parts/sections/topic-clusters.php`.
- Node syntax checks passed for live checker scripts.
- Static scan found no remaining hardcoded `'/will/'`, `'/will-contest/'`, or `'/estate-administration/'` links in `template-parts`, `inc`, `tools`, or `functions.php`.
- `git diff --check` passed with line-ending warnings only.

Deployment:

- Commit `5e6973b` was pushed to GitHub `main`.
- Codex opened uPress File Manager Git management for `/wp-content/themes/justice-theme` and clicked Pull Git.
- uPress did not display a clear success toast, but live deployment-marker checks proved the pull landed.

Live:

- HTML sitemap/footer checker passed with deployment marker `2026-05-18-inheritance-topic-links-v1`.
- Owner-phone checker passed with the same marker.
- Traffic-priority audit passed all sampled public, lawyer and Googlebot routes.
- Reachability checker passed homepage, HTML sitemap, REST API, robots, XML sitemap, phone and canonical checks.

## Decision

Do not recover `/will/` yet.

Reason: `/will/` is not one page's clean moved destination. It is a conflicted target for multiple different case-law URLs, plus there are already better live evergreen destinations for the user intents:

- Basic will explainer: `/will-and-testament/`
- Will/probate objection: `/will-probate-objection/`
- Probate order: `/what-is-a-probate-order/`
- Inheritance order: `/inheritance-order/`
- Commercial lawyer hub: `/inheritance-lawyer/`

## Next Actions

1. Review the 10 `will` slug-conflict rows and choose whether each old case-law URL should:
   - map to a specific existing case-law slug,
   - merge into `/will-probate-objection/`,
   - merge into `/will-and-testament/`,
   - merge into `/what-is-a-probate-order/`,
   - or remain 404/410 if it has no useful equivalent.
2. Do not add a blanket `/will/` redirect to homepage or to `/inheritance-lawyer/`.
3. If owner approves a public route decision, implement only specific one-to-one redirects where the replacement page meaningfully matches the old URL's intent.

## Safety

Theme link correction plus read-only route review. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.
