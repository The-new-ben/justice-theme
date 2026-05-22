# Practice Term Link Alias Cleanup - 2026-05-21

## Goal

Clean the last homepage/internal-link dilution found after the money-topic link cleanup.

Older duplicate practice-area term URLs were still rendered by generated CMS components:

- `/practice-areas/real-estate/`
- `/practice-areas/personal-injury/`
- `/practice-areas/tort-law/`
- `/practice-areas/israeli-labor-law/`

These URLs returned 200, so this was not a 404 emergency. The problem was SEO signal dilution: the homepage and generated term surfaces should point consistently to the current money hubs.

## Research Used

Google Search Central says internal links should point to the preferred canonical URL when duplicates exist, because consistent linking helps Google understand the preferred URL:

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

Google also says crawlable internal links and clear anchor text help Google find and understand important pages:

- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Code Changed

### `inc/template-tags.php`

Added `justice_theme_preferred_practice_term_url()` as a display-only alias map:

| Older term slug | Preferred public URL |
| --- | --- |
| `real-estate` | `/practice-areas/real-estate-law/` |
| `personal-injury` | `/tort-lawyer/` |
| `tort-law` | `/tort-lawyer/` |
| `israeli-labor-law` | `/practice-areas/labor-law/` |

Then `justice_theme_public_term_link()` checks this map before falling back to the native WordPress term URL.

This affects generated public links such as practice cards, breadcrumbs, article terms, lawyer profile terms, related-content blocks and HTML sitemap output.

### `template-parts/sections/hero.php`

Changed the homepage hero popular-practice list to use `justice_theme_public_term_link()` instead of calling `get_term_link()` directly.

## Verification

Pre-deploy checks:

- `php -l inc/template-tags.php` passed.
- `php -l template-parts/sections/hero.php` passed.
- `git diff --check` passed, with only expected line-ending warnings.

Deployment:

- Pushed `d96507d Prefer live hubs for duplicate practice terms`.
- Pulled through uPress Git Manager.
- Found one remaining homepage source in the hero quick-links.
- Pushed `d80e576 Route homepage hero terms through public links`.
- Pulled through uPress Git Manager again.
- uPress log showed `d80e576` as `HEAD -> main, origin/main`.

Live read-only checks with cache-busting URLs:

| URL | Status | Noindex | Duplicate links found |
| --- | ---: | --- | --- |
| `https://jus-tice.co.il/?qa=d80e576` | 200 | No | 0 |
| `https://jus-tice.co.il/practice-areas/real-estate-law/?qa=d80e576` | 200 | No | 0 |
| `https://jus-tice.co.il/practice-areas/labor-law/?qa=d80e576` | 200 | No | 0 |
| `https://jus-tice.co.il/articles/?qa=d80e576` | 200 | No | 0 |

The same live responses include the preferred targets:

- `/practice-areas/real-estate-law/`
- `/practice-areas/labor-law/`
- `/tort-lawyer/`

## Money Assessment

No revenue was earned in this cycle.

Material advancement: the homepage is a cleaner SEO pyramid root. Generated CMS links now reinforce the same live money hubs instead of splitting internal authority across older duplicate taxonomy URLs.

## Completion Assessment

- Public money-link hygiene: 83% -> 88%.
- Homepage-to-money-hub SEO chain: 85% -> 88%.
- First paid-lawyer readiness remains about 84%, because actual payment approval, product mapping and paying lawyers are still open.

## Safety

Repo theme code and project-control documentation only.

No WordPress database edits, no public CMS page edits, no 301 redirect package changes, no Grow/Meshulam action, no payment settings, no card charge, no product creation and no outreach.
