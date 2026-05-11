# Public First-Party HTTP Link Scan Review

Date: 2026-05-11
Status: FIXED LIVE / MONITOR WITH FUTURE MIGRATION WORK

## Scope

This pass checks public rendered output and sitemap XML for remaining first-party `http://jus-tice.co.il` references after the public template HTTPS normalization work.

## Tooling

- FIXED: created `tools/check-public-http-internal-links.ps1`.
- VERIFIED: the tool fetches a bounded public sample of homepage, archive, lawyer directory, selected article/category pages, sitemap index and child sitemaps.
- VERIFIED: output is written to `project-control/public-http-internal-link-scan-2026-05-11.csv`.
- VERIFIED: the scanner records source page, final URL, occurrence type, attribute/context and notes.
- FIXED: the scanner now also records `suspected_source` and `remediation_lane` so theme, content, media and sitemap/plugin findings are not mixed together.
- SAFETY: the scanner is read-only. It does not change content, URLs, redirects, canonical tags, sitemap settings, taxonomy, lawyer data, CRM data, reviews, wp-admin settings or database rows.

## Latest Scan Result

- REVIEW: 199 remaining first-party HTTP references were found in the bounded sample.
- VERIFIED: 17 scanned resources had no first-party HTTP references.
- REVIEW: 122 findings came from rendered HTML pages.
- REVIEW: 77 findings came from child sitemap XML.
- REVIEW: 118 findings point to internal page/category/article URLs.
- REVIEW: 81 findings point to `/wp-content/uploads/` media URLs.
- REVIEW: top finding sources include `articles-sitemap1.xml`, `/articles/`, the homepage, `articles-sitemap2.xml`, `articles-sitemap6.xml`, `articles-sitemap4.xml`, and `/family-law/`.

## Classified Pre-Fix Baseline

- CREATED / REVIEW: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv`.
- REVIEW: 175 rows were recorded in the bounded classified scan.
- VERIFIED: 15 scanned resources had no first-party HTTP references.
- REVIEW: 160 rows still require remediation or classification.
- REVIEW: 54 findings are in the `THEME_DISPLAY_FIX` lane.
- REVIEW: 69 findings are `PLUGIN_OR_MEDIA_CONFIG_REVIEW`, mostly sitemap media upload references.
- REVIEW: 2 findings are `CONTENT_MEDIA_DISPLAY_OR_CMS_REVIEW`.
- REVIEW: 35 findings remain `CLASSIFY_BEFORE_FIX`; many appear adjacent to theme term lists but need an after-fix scan before assigning ownership permanently.

## Theme Display Fix Applied In Code

- FIXED LIVE: added `justice_theme_public_term_link()` and deployed it through uPress.
- LIVE VERIFIED: uPress Git log shows commit `005af18` as live HEAD and the public static marker returns `2026-05-11-theme-term-link-https-v1`.
- CODE FIXED: theme term links now normalize to HTTPS in breadcrumbs, homepage popular term links, practice-area cards, article cards, single-article term chip, article archive sidebar terms, lawyer mini-site practice-area chips, fallback header dropdown terms and related-content fallback targets.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files.
- VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv` records 36 `VERIFIED` resources and 71 remaining `REVIEW` findings.
- FIXED LIVE: `THEME_DISPLAY_FIX` findings dropped from 54 before deployment to 0 after deployment.
- REVIEW REMAINS: the remaining findings are 69 `SEO_PLUGIN_SITEMAP_MEDIA` and 2 `CONTENT_MEDIA_OUTPUT`.
- SAFETY: this does not update stored content, taxonomy records, media URLs, sitemap plugin settings or redirects.

## Media / Image Sitemap Fix Applied In Code

- FIXED LIVE: first-party media URLs now normalize to HTTPS in public attachment URLs, attachment image tuples, srcsets and rendered post content.
- FIXED LIVE: Rank Math image sitemap output now normalizes first-party image URLs via `rank_math/sitemap/xml_img_src` and `rank_math/sitemap/urlimages`.
- VERIFIED SOURCE: Rank Math official sitemap hooks document both image sitemap filters.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `a74a28b` (`Normalize media sitemap URLs to HTTPS`) as live HEAD and the public marker returns `2026-05-11-media-sitemap-https-v1`.
- VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-media-sitemap-https.csv` records 42 `VERIFIED` resources and 0 `REVIEW` findings.
- FIXED LIVE: the prior 69 `SEO_PLUGIN_SITEMAP_MEDIA` and 2 `CONTENT_MEDIA_OUTPUT` rows cleared in the bounded after-scan.
- SAFETY: this does not update stored content, media records, sitemap inclusion rules, redirects or database values.

## Interpretation

- FIXED LIVE: the public-template, term-link, media-output and image-sitemap lanes are clean in the latest bounded scan.
- VERIFIED: after deployment of `a74a28b`, the scanner found 42 `VERIFIED` resources and 0 `REVIEW` findings.
- DECISION: keep this as a technical-output fix, not URL migration approval; it did not change slugs, redirects, canonical logic, sitemap inclusion rules, media records or stored article bodies.
- REVIEW: future content exports may still find stored old HTTP values inside the CMS/database, but those are a separate inventory/migration question and should not be changed blindly.

## Required Next Steps

1. Keep `project-control/public-http-internal-link-scan-2026-05-11-after-media-sitemap-https.csv` as the current VERIFIED baseline.
2. Re-run `tools/check-public-http-internal-links.ps1` before any GSC sitemap submission or URL migration batch.
3. Plan CMS/content/media cleanup separately only if the full content export shows stored values that matter.
4. Do not treat this as URL migration and do not create redirects from this file alone.

## Blockers / Approval Gates

- BLOCKED: permanent database/content URL replacement requires owner approval and a backup/export plan.
- BLOCKED: SEO plugin sitemap/media configuration changes require wp-admin/uPress access and should be tested before GSC submission.
- NOT APPROVED: no redirects, slug changes, deletions, noindex rules or sitemap inclusion removals were executed.
