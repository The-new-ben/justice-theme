# Deployment Verification

Date: 2026-05-10

## Current Finding

Latest recheck after uPress pull to commit `cbbba45`:

- uPress Git Log: VERIFIED top commit `cbbba45` (`Render native 404 before homepage redirects`).
- Static theme marker: VERIFIED now returns `justice-theme-deployment-marker=2026-05-11-native-404-before-redirect-v1`.
- Homepage marker: VERIFIED source includes `2026-05-11-native-404-before-redirect-v1`.
- Native 404 guard: CODE DEPLOYED.
- Fake public URL: STILL BLOCKED; returns `301 Location: https://jus-tice.co.il`.
- Invalid post query `/?p=99999999`: STILL BLOCKED; returns `301 Location: https://jus-tice.co.il`.
- Diagnostic clue: no `X-Redirect-By` header and no theme `X-Justice-Route-Guard` header on the 301 response.
- Source: VERIFIED in uPress plugin manager. `All 404 Redirect to Homepage` is active (`פעיל`) and describes 301 redirects for 404 links.
- Evidence: `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
- Interpretation: the uncontrolled homepage redirect is coming from the active 404 redirect plugin unless later testing disproves it.
- Safety: no `.htaccess`, redirect, permalink, URL migration, content, taxonomy, canonical, sitemap, lawyer, CRM, review, wp-admin setting or database data was changed. Plugin status was inspected only.

Latest recheck after live root robots.txt repair:

- Root `robots.txt`: FIXED LIVE by editing the physical uPress webroot file that was shadowing WordPress-generated robots output.
- Public robots before fix: VERIFIED HTTP 200 with zero-length body.
- WordPress dynamic robots before fix: VERIFIED at `/?robots=1`, with normal crawl rules and `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
- Public robots after fix: VERIFIED HTTP 200, length 268, sitemap directive present, no global `Disallow: /`, and no `/wp-content/themes` block.
- Sitemap context: VERIFIED active sitemap index and sampled children remain XML with zero first-party HTTP loc values.
- Interpretation: current deployment blocker is no longer robots/sitemap HTTPS. Remaining high-risk deployment checks are 404/homepage redirect behavior, active generator/settings review, and controlled GSC submission/monitoring.

Latest recheck after uPress pull to commit `c992fd2`:

- uPress Git Manager: VERIFIED accessible through browser automation with owner-approved login/2FA path.
- uPress Git Status: VERIFIED clean working directory before pull.
- uPress Git Pull: VERIFIED completed.
- uPress Git Log: VERIFIED top commit `(HEAD -> main, origin/main, origin/HEAD) Document reviews compliance alias` / `c992fd2`.
- Static theme marker: VERIFIED now returns `justice-theme-deployment-marker=2026-05-11-robots-sitemap-directive-v1`.
- Homepage source marker: VERIFIED includes `2026-05-11-robots-sitemap-directive-v1`.
- Branding manifest behavior: VERIFIED PARTIAL; homepage source continues to use the WordPress/RealFaviconGenerator manifest and does not duplicate the theme fallback manifest.
- Robots.txt: BLOCKED / NOT FIXED BY PULL; public `https://jus-tice.co.il/robots.txt` returns HTTP 200 with zero-length body.
- Rank Math child sitemap URLs: BLOCKED / NOT FIXED BY PULL; `https://jus-tice.co.il/articles-sitemap2.xml` still has 200 `http://jus-tice.co.il` loc values and zero HTTPS loc values.
- Interpretation: the stale-theme deployment blocker is resolved for this cycle. Remaining robots/sitemap blockers require server/plugin/cache investigation, not another Git pull.

Latest recheck after uPress pull to commit `4c7b45e`:

- uPress Git Log: VERIFIED top commit `(HEAD -> main, origin/main, origin/HEAD) Bypass Rank Math sitemap cache` / `4c7b45e`.
- Static theme marker: VERIFIED now returns `justice-theme-deployment-marker=2026-05-11-rankmath-sitemap-cache-bypass-v1`.
- Sitemap HTTPS: FIXED LIVE for sampled child sitemaps:
  - `page-sitemap.xml`: 0 HTTP / 11 HTTPS
  - `articles-sitemap1.xml`: 0 HTTP / 201 HTTPS
  - `articles-sitemap2.xml`: 0 HTTP / 200 HTTPS
  - `practice-areas-sitemap.xml`: 0 HTTP / 40 HTTPS
  - `category-sitemap.xml`: 0 HTTP / 16 HTTPS
- Robots.txt: STILL BLOCKED; public `https://jus-tice.co.il/robots.txt` returns HTTP 200 with zero-length body.
- Interpretation: the Rank Math sitemap HTTP-loc blocker is fixed for the sampled XML outputs. Robots remains a separate server/plugin/static output issue.

HISTORICAL: GitHub `main` was previously ahead of the live WordPress theme output before the 2026-05-11 uPress pull.

Latest recheck after commit `a90bf4b`:

- Local PHP: VERIFIED with PHP 8.5.6; full repo lint passes for 127 PHP files.
- `/articles/` live deployment marker: VERIFIED still serving `2026-05-10-runtime-guard-v5`, not the newer `2026-05-10-contextual-title-v1`.
- `/articles/` title/OG output: NOT FIXED LIVE; still shows `Articles Archive | Jus-Tice.co.il`.
- Fake URL `/not-a-real-page-justice-qa/`: LIVE VERIFIED as a `301` redirect to `https://jus-tice.co.il`, before the theme can serve a real 404.
- Sample lawyer URL `/lawyers/עוד-איתן-כץ/`: LIVE VERIFIED as `200 OK`, but rendered with old deployment marker and HTTP canonical/OG URL signals in the sampled HTML.
- Interpretation: the contextual-title fix is CODE FIXED and PHP VERIFIED locally, but NOT VERIFIED LIVE. The fake-404-to-homepage behavior appears to be a server/cache/SEO routing rule, not only a theme-template issue.

Latest recheck after commit `2c418b4`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: commit `2c418b4` and the queued cleaner/trust-gate changes are pushed to GitHub but are not being served by live WordPress yet.

Latest recheck after commit `23e3807`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the lawyer-directory guidance/filter improvements are pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `ae8726b`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: canonical menu/filter slug cleanup is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `3fdae22`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: menu repair versioning is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `76dc56f`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the public-publication safety gate is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `9d19686`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the lead-form anti-spam guard is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `31a0026`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the lawyer-to-lead CRM routing patch is pushed to GitHub, but live WordPress is still not serving the newest `main` code. Maya/lawyer mini-site lead routing cannot be called live-verified until uPress pulls and a controlled test lead is submitted.

Latest recheck after commit `0c6cf21`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: lead attribution hidden fields are pushed to GitHub, but live WordPress is still not serving the newest `main` code. UTM/source-keyword capture cannot be called live-verified until uPress pulls and a controlled test lead is submitted.

Evidence from `tools/check-live-deployment.ps1` after commit `542aeef`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- The static marker request resolves to the homepage instead of returning the marker file.
- All seven family-law URLs still expose internal markers publicly.

## Interpretation

The current problem is deployment state, not only article-cleaning logic.

Until live WordPress serves either:

- `<meta name="justice-deployment-marker" content="2026-05-10-runtime-guard-v5" />`
- or `/wp-content/themes/justice-theme/deployment-marker.txt`

we cannot claim the v5 runtime guard is active on the live site.

## Required Live Action

1. Pull latest `main` in uPress for `jus-tice.co.il`.
2. Open `/wp-admin/` once or open any public page once so WordPress init/hooks execute.
3. Run `tools/check-live-deployment.ps1`.
4. Expected proof after pull:
   - Homepage PHP marker is VERIFIED.
   - Static theme marker is VERIFIED.
   - Family-law pages no longer show `NOT VERIFIED`, `PARTIAL:`, `READY NEXT`, `project-control`, `CMS`, `CRM`, or `GSC` in public article bodies.

## Status

BLOCKED: waiting for uPress pull / live file sync / cache refresh.
