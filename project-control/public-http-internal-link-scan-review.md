# Public First-Party HTTP Link Scan Review

Date: 2026-05-11
Status: IN PROGRESS / REVIEW FINDINGS

## Scope

This pass checks public rendered output and sitemap XML for remaining first-party `http://jus-tice.co.il` references after the public template HTTPS normalization work.

## Tooling

- FIXED: created `tools/check-public-http-internal-links.ps1`.
- VERIFIED: the tool fetches a bounded public sample of homepage, archive, lawyer directory, selected article/category pages, sitemap index and child sitemaps.
- VERIFIED: output is written to `project-control/public-http-internal-link-scan-2026-05-11.csv`.
- VERIFIED: the scanner records source page, final URL, occurrence type, attribute/context and notes.
- SAFETY: the scanner is read-only. It does not change content, URLs, redirects, canonical tags, sitemap settings, taxonomy, lawyer data, CRM data, reviews, wp-admin settings or database rows.

## Latest Scan Result

- REVIEW: 199 remaining first-party HTTP references were found in the bounded sample.
- VERIFIED: 17 scanned resources had no first-party HTTP references.
- REVIEW: 122 findings came from rendered HTML pages.
- REVIEW: 77 findings came from child sitemap XML.
- REVIEW: 118 findings point to internal page/category/article URLs.
- REVIEW: 81 findings point to `/wp-content/uploads/` media URLs.
- REVIEW: top finding sources include `articles-sitemap1.xml`, `/articles/`, the homepage, `articles-sitemap2.xml`, `articles-sitemap6.xml`, `articles-sitemap4.xml`, and `/family-law/`.

## Interpretation

- NOT FIXED: the previous related-card/template HTTPS fix worked for sampled related cards, but broader public output still contains first-party HTTP references.
- REVIEW: some references appear in theme-rendered sections such as homepage popular practice-area links and practice-area cards.
- REVIEW: some references appear in old article/category/content output and should be classified before any permanent CMS update.
- REVIEW: sitemap media/image references still expose HTTP upload URLs; this is likely media/content/plugin sitemap output, not a slug migration issue.

## Required Next Steps

1. Classify each finding as THEME_OUTPUT, MENU_OUTPUT, CONTENT_BODY, MEDIA_UPLOAD, SEO_PLUGIN_SITEMAP, or UNKNOWN.
2. Fix theme-owned rendering with display-only HTTPS normalization.
3. Plan CMS/content/media cleanup separately; do not rewrite stored content blindly.
4. Re-run the scanner after any remediation.
5. Do not treat this as URL migration and do not create redirects from this file alone.

## Blockers / Approval Gates

- BLOCKED: permanent database/content URL replacement requires owner approval and a backup/export plan.
- BLOCKED: SEO plugin sitemap/media configuration changes require wp-admin/uPress access and should be tested before GSC submission.
- NOT APPROVED: no redirects, slug changes, deletions, noindex rules or sitemap inclusion removals were executed.
