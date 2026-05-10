# Robots / htaccess / Redirect Review

Date: 2026-05-10
Status: REVIEW V1 - no live server changes executed

## Current Public Checks

VERIFIED:
- `https://jus-tice.co.il/robots.txt` returned HTTP 200 from the public web.
- `https://jus-tice.co.il/sitemap.xml` returned HTTP 200 but appeared to return homepage HTML, not XML.
- `https://jus-tice.co.il/wp-sitemap.xml` returned HTTP 200 but appeared to return homepage HTML, not XML.
- GSC HTTPS report shows 412 Non-HTTPS URLs, 25 HTTPS URLs, and 222 HTTPS-not-evaluated URLs.
- GSC Page indexing shows 90 "Page with redirect" URLs, 38 duplicate-without-user-selected-canonical URLs, 2 404 URLs and 785 crawled-currently-not-indexed URLs.

NOT VERIFIED:
- Actual `.htaccess` contents.
- Existing redirect plugin rules.
- Server-level uPress redirects.
- SEO plugin sitemap settings.
- Whether robots output is modified by a plugin/cache layer.
- Example URL lists from the GSC drilldowns.

BLOCKED:
- `.htaccess`, redirect rules and server config require uPress, file manager, SFTP, wp-admin plugin settings or database/options access.

## Migration Rule

Do not change live URLs until all of these exist:

- full URL inventory
- URL migration map
- redirect map
- category/term map
- internal link update map
- canonical update plan
- sitemap plan
- robots/htaccess review
- owner approval

## Robots.txt Target

Robots should:

- Allow crawling of public legal content.
- Include a correct sitemap directive once a real XML sitemap URL is verified.
- Avoid blocking CSS/JS assets needed for rendering.
- Avoid indexing internal search/filter URLs through robots alone; prefer canonical/noindex where appropriate.

Potential future directive after sitemap is verified:

```text
Sitemap: https://jus-tice.co.il/sitemap.xml
```

Do not add this until the sitemap URL serves valid XML.

## htaccess / Redirect Target

Redirect handling must support:

- 301 from every old migrated URL to its approved new English-slug URL.
- 301 from `http://` to `https://`.
- 301 from duplicate trailing slash/non-trailing slash variants if needed.
- No redirect chains.
- No redirect loops.
- No redirecting all 404s to homepage.

RISK:
- A previous live QA check found a fake URL returning homepage-like HTTP 200 behavior. That can hide broken URLs from users and search engines. It must be verified and fixed before migration.
- GSC HTTPS shows a large Non-HTTPS URL count. Before any migration, inspect whether internal links, canonicals, sitemap URLs or old redirects still expose `http://` URLs.
- If sitemap URLs are returning homepage-like HTML, Google may not receive a reliable canonical URL list for the future migration.

## Redirect Rule Source Of Truth

The source of truth is:

- `project-control/url-migration-map.csv`
- `project-control/redirect-map.csv`

No manual redirect should be added outside those files.

## Verification Procedure

For each redirect batch:

1. Test old URL returns 301.
2. Test target URL returns 200.
3. Confirm there is only one hop.
4. Confirm target canonical matches final URL.
5. Confirm sitemap contains target URL only.
6. Confirm internal links no longer point to old URL.
7. Record proof in project-control before closing the batch.

## Current Decision

NO URL CHANGES NOW.

The repo now has a public REST export and heuristic maps. The next step is review and prioritization, not redirects.

## Next Verification Steps

1. Open examples for GSC Non-HTTPS URLs.
2. Open examples for GSC crawled-currently-not-indexed URLs.
3. Check whether sitemap URLs return valid XML after cache/login/server review.
4. Check whether a catch-all rewrite/redirect is returning homepage HTML for missing URLs.
5. Confirm final redirect mechanism: SEO plugin, Redirection plugin, `.htaccess`, or uPress redirect layer.
