# HTML Sitemap Crawl Hub - 2026-05-18

Status: IMPLEMENTED IN REPO, NEEDS UPRESS PULL

## Research

- Google Search Central says Google discovers pages through crawlable links and generally needs real `<a>` elements with `href` attributes. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google's SEO Starter Guide notes that content organization can affect crawling and indexing, especially as a site grows. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Current internal-linking guidance continues to emphasize shallow crawl paths, descriptive anchor text, and topic hubs that connect important pages. Source: https://searchengineland.com/guide/internal-linking
- Recent SEO guidance repeats the same practical point: XML sitemaps help discovery, but strong internal HTML links from crawled pages make the structure clearer. Source: https://ahrefs.com/blog/internal-links-for-seo/

## Business Interpretation

The user is worried about low traffic. The safest immediate repo change is a dynamic, human-readable HTML sitemap that:

- links from the global footer, therefore from the homepage and every normal page;
- exposes real server-rendered `<a href>` links, not JavaScript-only navigation;
- groups articles by legal topic/category to help visitors and crawlers understand the site;
- updates automatically from WordPress posts, pages, taxonomies and approved public lawyer profiles;
- avoids public database writes and avoids changing slugs, redirects, canonicals or XML sitemap behavior.

## Implemented

- Added `inc/html-sitemap.php`.
- Added a virtual public route at `/site-map/`.
- Added `/html-sitemap/` as a 301 alias to `/site-map/`.
- Added a footer link to `/site-map/`.
- Updated deployment marker to `2026-05-18-html-sitemap-v1`.
- Added `tools/check-live-html-sitemap.mjs` for post-deployment verification.

## Verification

Local/repo verification passed:

- `php -l inc/html-sitemap.php`
- `php -l functions.php`
- `php -l template-parts/layout/site-footer.php`
- `node --check tools/check-live-html-sitemap.mjs`
- `git diff --check`

Post-uPress verification command:

```bash
node tools/check-live-html-sitemap.mjs
```

Expected after uPress Git Pull:

- homepage returns `200`;
- homepage/footer links to `/site-map/`;
- `/site-map/` returns `200`;
- `/site-map/` has a visible `h1`;
- `/site-map/` contains crawlable anchor links;
- `/site-map/` links to `/articles/` and `/lawyers/`;
- sitemap page contains marker `2026-05-18-html-sitemap-v1`;
- Googlebot user-agent fetch sees crawlable links.

## Safety

No CMS content body, taxonomy term, page record, slug, redirect rule, XML sitemap setting, robots rule, lawyer record, lead record, payment setting, GA4 setting, GSC setting or database row was changed.
