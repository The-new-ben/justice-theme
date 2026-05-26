# Robots / htaccess / Redirect Review

Date: 2026-05-10
Status: REVIEW V2 - robots fixed live; redirects/htaccess unchanged

## Current Public Checks

2026-05-11 MEDIA / IMAGE SITEMAP HTTPS FIX:
- FIXED LIVE: first-party media URLs now normalize to HTTPS in public media output and Rank Math image sitemap callbacks.
- VERIFIED SOURCE: Rank Math documents `rank_math/sitemap/urlimages` and `rank_math/sitemap/xml_img_src` as image sitemap filters.
- VERIFIED LIVE: uPress top commit is `a74a28b`, marker returns `2026-05-11-media-sitemap-https-v1`, and the after-scan has 42 `VERIFIED` resources with 0 `REVIEW` findings.
- NEXT SAFE ACTION: keep `.htaccess` and redirects unchanged; rerun the scanner before GSC sitemap resubmission or any URL migration batch.
- SAFETY: no `.htaccess`, redirect, URL migration, stored content, media-library item, canonical, sitemap setting, taxonomy, lawyer, CRM, review, wp-admin option or database change was made.

2026-05-11 THEME TERM-LINK HTTPS FIX:
- FIXED LIVE: theme-owned taxonomy term links now use `justice_theme_public_term_link()` and first-party HTTPS normalization before rendering.
- VERIFIED LIVE: uPress top commit is `005af18` and static marker returns `2026-05-11-theme-term-link-https-v1`.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only normal Windows LF-to-CRLF warnings.
- REVIEW BASELINE: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv` classifies 54 findings as `THEME_DISPLAY_FIX` before deployment.
- VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv` shows `THEME_DISPLAY_FIX` dropped to 0; remaining findings are media/sitemap/content lanes.
- NEXT SAFE ACTION: investigate the remaining media/sitemap/content findings without `.htaccess`, redirect, slug or bulk database changes.
- SAFETY: no `.htaccess`, redirect, URL migration, stored content, canonical, sitemap setting, taxonomy, lawyer, CRM, review, wp-admin option or database change was made.

2026-05-11 BROAD PUBLIC HTTP SCAN:
- IN PROGRESS / REVIEW: added `tools/check-public-http-internal-links.ps1` and generated `project-control/public-http-internal-link-scan-2026-05-11.csv`.
- REVIEW FINDING: bounded scan found 199 remaining first-party `http://jus-tice.co.il` references after the sampled related-card HTTPS fix.
- REVIEW FINDING: 122 findings are in rendered HTML pages; 77 are in child sitemap XML.
- REVIEW FINDING: 118 findings are internal page/category/article URLs; 81 are media upload URLs.
- INTERPRETATION: the site still needs source classification and display-level cleanup before final URL migration/GSC submission confidence.
- SAFETY: no `.htaccess`, redirect, URL migration, stored content, canonical, sitemap setting, taxonomy, lawyer, CRM, review, wp-admin option or database change was made.

2026-05-11 ROOT ROBOTS FIX:
- FIXED LIVE: uPress root `robots.txt` was edited from a zero-byte static file into a conservative crawl file.
- VERIFIED BEFORE FIX: `https://jus-tice.co.il/robots.txt?codex_check=...` returned HTTP 200 with length 0.
- VERIFIED BEFORE FIX: `https://jus-tice.co.il/?robots=1&codex_check=...` returned valid WordPress-generated robots output including `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
- VERIFIED LIVE AFTER FIX: `https://jus-tice.co.il/robots.txt?codex_verify=...` returns HTTP 200, length 268, includes the sitemap directive, has no global `Disallow: /`, and does not block `/wp-content/themes`.
- DIRECTIVES NOW LIVE:

```text
User-agent: *
Disallow: /wp-admin/
Disallow: */feed
Disallow: */embed
Disallow: /wp-content/uploads/wpo/wpo-plugins-tables-list.json
Disallow: /wp-content/uploads/wp-import-export-lite/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://jus-tice.co.il/sitemap_index.xml
```
- SAFETY: no `.htaccess`, redirect, URL migration, canonical, sitemap-inclusion, content, taxonomy, lawyer, CRM, review, wp-admin option or database change was made.
- NEXT SAFE ACTION: monitor the static file after server/plugin/cache changes and keep `sitemap_index.xml` as the only sitemap URL candidate for GSC submission unless the sitemap strategy changes.

2026-05-11 PUBLIC INTERNAL LINK HTTPS FIX:
- FIXED LIVE: public template/card/schema links now render first-party URLs through HTTPS normalization helpers.
- VERIFIED LIVE: `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv` shows sampled related-card URLs using `https://jus-tice.co.il/...`.
- SAFETY: no `.htaccess`, redirect, URL migration, stored URL, slug, canonical setting, sitemap inclusion rule, content body, taxonomy, lawyer, CRM, review, wp-admin option or database change was made.

2026-05-11 POST-PULL UPDATE:
- VERIFIED LIVE: uPress pull deployed the latest theme marker `2026-05-11-robots-sitemap-directive-v1`.
- VERIFIED LIVE: `https://jus-tice.co.il/robots.txt` still returns HTTP 200 with zero-length body.
- INTERPRETATION: the theme `robots_txt` filter is live in code but is not controlling the public robots response. A static/server/plugin/cached robots layer is likely intercepting or replacing output; exact source is NOT VERIFIED.
- BLOCKED: do not submit `/robots.txt` as "fixed" until it includes `Sitemap: https://jus-tice.co.il/sitemap_index.xml` and does not block CSS/JS/public content.
- NEXT SAFE ACTION: inspect uPress webroot / WordPress SEO plugin settings / cache layer for the empty robots source before editing any robots or htaccess file.

VERIFIED:
- `https://jus-tice.co.il/robots.txt` returned HTTP 200 from the public web.
- `https://jus-tice.co.il/sitemap_index.xml` returned valid XML and appears to be the active sitemap index.
- `https://jus-tice.co.il/page-sitemap.xml`, `articles-sitemap1.xml`, `articles-sitemap2.xml`, `category-sitemap.xml`, and `practice-areas-sitemap.xml` returned XML in public shell checks.
- `https://jus-tice.co.il/sitemap.xml` returned a 301 redirect to the homepage, not XML.
- `https://jus-tice.co.il/wp-sitemap.xml` returned a 301 redirect to the homepage, not XML.
- `https://jus-tice.co.il/post-sitemap.xml` returned a 301 redirect to the homepage, not XML.
- The active sitemap children expose many `http://` locs: page sitemap 10/11 HTTP, articles sitemap 1 has 238/252 HTTP, articles sitemap 2 has 217/217 HTTP, practice-area sitemap has 34/48 HTTP.
- GSC HTTPS report shows 412 Non-HTTPS URLs, 25 HTTPS URLs, and 222 HTTPS-not-evaluated URLs.
- GSC Page indexing shows 90 "Page with redirect" URLs, 38 duplicate-without-user-selected-canonical URLs, 2 404 URLs and 785 crawled-currently-not-indexed URLs.

CODE FIXED / LIVE VERIFIED WHERE NOTED:
- Theme-emitted first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS for the Jus-Tice host.
- Common SEO plugin canonical/Open Graph URL filters now pass through the same first-party HTTPS normalization helper.
- WordPress core sitemap entries now normalize first-party `loc` URLs to HTTPS if core sitemaps are active.
- Supported Yoast, Rank Math and AIOSEO sitemap hooks now normalize first-party sitemap URL/index entries to HTTPS when those generators apply the hooks.
- Robots.txt now includes `Sitemap: https://jus-tice.co.il/sitemap_index.xml` in the live static root file because that file shadows WordPress' dynamic robots output.
- Public frontend first-party links generated by WordPress URL helpers and major theme templates now normalize to HTTPS for home, post/page/CPT, taxonomy, attachment, card and schema links. Sampled related-card URLs are LIVE VERIFIED as HTTPS.
- This does not update `.htaccess`, redirects, database URLs, or active SEO-plugin sitemap settings.

NOT VERIFIED:
- Actual `.htaccess` contents.
- Existing redirect plugin rules.
- Server-level uPress redirects.
- SEO plugin sitemap settings.
- Whether a plugin/cache layer later rewrites or re-empties the static robots file.
- Example URL lists from the GSC drilldowns.

BLOCKED:
- `.htaccess`, redirect rules and server config still require uPress, file manager, SFTP, wp-admin plugin settings or database/options access.
- Robots is no longer blocked, but must be monitored after any server/cache/plugin change.

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

Target directive after deployment:

```text
Sitemap: https://jus-tice.co.il/sitemap_index.xml
```

The theme now adds this directive when absent because `sitemap_index.xml` has been publicly verified as valid XML. Do not submit `/sitemap.xml` or `/wp-sitemap.xml` until those aliases stop redirecting to the homepage.

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
- If the active sitemap keeps listing `http://` URLs, Google receives mixed protocol signals even when live pages redirect or canonicalize to HTTPS.
- Default sitemap aliases redirecting to homepage can confuse GSC setup if the wrong sitemap URL is submitted.

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
3. Continue monitoring sitemap URLs after cache/login/server review.
4. Check whether a catch-all rewrite/redirect is returning homepage HTML for missing URLs.
5. Confirm final redirect mechanism: SEO plugin, Redirection plugin, `.htaccess`, or uPress redirect layer.
6. Fix sitemap generator/base URL so every public sitemap loc is HTTPS before any URL migration.
