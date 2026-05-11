# Deployment Verification

Date: 2026-05-10

## Current Finding

Latest public template HTTPS link normalization:

- VERIFIED UPress PULL: uPress Git log shows top commit `3b99fbb` (`Normalize public template links to HTTPS`).
- VERIFIED LIVE MARKER: `https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?qa=public-link-https-20260511` returns `2026-05-11-public-link-https-normalization-v1`.
- VERIFIED LIVE QA: `tools/check-live-related-content-qa.ps1` created `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv` with every sampled row marked `VERIFIED`.
- FIXED LIVE: sampled related-card URLs now render with `https://jus-tice.co.il/...` in public HTML.
- SAFETY: no WordPress content, metadata, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy, lawyer, lead/CRM, review, plugin-state, wp-admin setting or database row was changed.

Latest related-content international filter deployment:

- VERIFIED UPress PULL: uPress Git log shows top commit `4868db2` (`Filter international real estate related cards`).
- VERIFIED LIVE MARKER: `https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?qa=related-international-filter-20260511` returns `2026-05-11-related-international-filter-v1`.
- VERIFIED LIVE QA: `tools/check-live-related-content-qa.ps1` created `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv` with every sampled row marked `VERIFIED`.
- FIXED LIVE: foreign-market real-estate content no longer appears under the local real-estate cost sample.
- SAFETY: no WordPress content, metadata, URL, redirect, sitemap, canonical, taxonomy, lawyer, lead/CRM, review, plugin-state, wp-admin setting or database row was changed.

Latest related-content fallback QA deployment:

- VERIFIED UPress PULL: uPress Git log shows top commit `40ee1c4` (`Expose related fallback QA attributes`).
- VERIFIED LIVE MARKER: `https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?qa=related-fallback-qa-20260511` returns `2026-05-11-related-fallback-qa-v1`.
- VERIFIED LIVE QA: `tools/check-live-related-content-qa.ps1` created `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` with every sampled row marked `VERIFIED`.
- SAFETY: no WordPress content, metadata, URL, redirect, sitemap, canonical, taxonomy, lawyer, lead/CRM, review, plugin-state, wp-admin setting or database row was changed.

Latest uPress pull after export-tooling commit:

- VERIFIED UPress PULL: uPress Git log shows top commit `74309c5` (`Prepare plugin manifest export tooling`).
- SCOPE: docs/tooling sync only; active live plugin files under `/wp-content/plugins/ultra-justice-engine/` were not changed.

Latest authenticated manifest export attempt:

- BLOCKED: Codex browser returned a network failure for the WordPress-side diagnostic route and `/wp-admin/`.
- VERIFIED: unauthenticated PowerShell route check still reaches the diagnostic endpoint and returns HTTP 401.
- CODE FIXED: added future export helper `tools/export-plugin-manifest-diagnostic.ps1`.
- CODE FIXED: added comparison helper `tools/compare-plugin-manifests.ps1`.
- NEXT: use WordPress Application Password or authenticated WP admin session to export `project-control/live-active-plugin-manifest.csv`, then compare.

Latest live verification after diagnostic deployment:

- VERIFIED UPress PULL: uPress Git log shows top theme commit `8111d12` (`Add active plugin manifest diagnostic`).
- VERIFIED LIVE MARKER: `https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?codex_diag=202605110856` returns `2026-05-11-plugin-manifest-diagnostic-v1`.
- VERIFIED LIVE SECURITY: `tools/check-plugin-manifest-diagnostic.ps1` returned HTTP 401 for a public unauthenticated request.
- RESULT: the diagnostic route is deployed and protected from public access.
- STILL BLOCKED: admin-authenticated manifest export has not been run yet.

Latest code change awaiting deployment:

- CODE FIXED: added admin-only read-only active plugin manifest route at `/wp-json/justice-theme/v1/active-plugin-manifest`.
- DEPLOYMENT MARKER: `2026-05-11-plugin-manifest-diagnostic-v1`.
- LOCAL VERIFIED: PHP lint passed for 128 files; `git diff --check` returned only Windows LF-to-CRLF warnings.
- LIVE CHECK NEEDED: pull in uPress, verify public unauthenticated route returns 401/403 with `tools/check-plugin-manifest-diagnostic.ps1`, then use admin authentication to export the live plugin manifest.
- SAFETY: route reads active plugin files only for admins and returns hashes/metadata only; no plugin state or database data is changed.

Latest uPress pull after plugin parity documentation:

- VERIFIED UPress PULL: uPress Git log for `/wp-content/themes/justice-theme` shows top commit `8800b13` (`Document live plugin parity gap`).
- VERIFIED SYNC: the theme repository on uPress now includes the plugin parity baseline files.
- SCOPE WARNING: theme Git pull does not update the active plugin folder under `/wp-content/plugins/ultra-justice-engine/`.
- NEXT: keep plugin code replacement/update blocked until byte-level active plugin parity or an owner-approved plugin deployment plan exists.
- SAFETY: no plugin activation state or live plugin file was changed.

Latest live plugin code parity baseline:

- PARTIAL VERIFIED LIVE PARITY: repo `ultra-justice-engine/` manifest generated with 17 files, 80,392 bytes and SHA-256 hashes.
- VERIFIED LIVE VISIBLE: uPress File Manager active plugin `includes/` listing shows 15 files.
- VERIFIED PARITY GAP: repo `ultra-justice-engine/includes/cpt-legal-tools.php` exists, but live `/wp-content/plugins/ultra-justice-engine/includes/cpt-legal-tools.php` was NOT VISIBLE.
- EXPLAINED: this aligns with public REST where `justice_legal_tool` and `justice_legal_request` are NOT_EXPOSED.
- BLOCKED: byte-level live plugin hashes are not available without SSH/WP-CLI/file export or an owner-approved read-only diagnostic endpoint.
- DOCUMENTED: `project-control/live-plugin-code-parity-review.md`, `project-control/ultra-justice-engine-repo-manifest.csv`, and `project-control/ultra-justice-engine-live-visible-manifest.csv`.
- SAFETY: no live plugin file, plugin activation state, URL, redirect, sitemap, content, taxonomy, lawyer, CRM, review, wp-admin setting or database row was changed.

Latest path-level live plugin filesystem check:

- VERIFIED LIVE PATH: uPress File Manager shows `/wp-content/plugins/ultra-justice-engine/`.
- VERIFIED LIVE PATH: uPress File Manager shows `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php`.
- VERIFIED LIVE PATH: uPress File Manager shows `/wp-content/plugins/ultra-justice-engine/includes/`.
- VERIFIED LIVE ABSENCE: filtering `/wp-content/plugins/` for `justice-core` returned 0 items.
- DOCUMENTED: `project-control/upress-plugin-filesystem-readonly-review.md`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`, `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`, and `project-control/visual-evidence/upress-plugin-filesystem-no-justice-core-2026-05-11.png`.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

Latest local plugin collision review:

- VERIFIED LOCAL: `tools/check-justice-plugin-collision.ps1` scans repo-side Justice plugin headers, constants, functions, REST namespaces, CPTs and taxonomies.
- VERIFIED LOCAL: `ultra-justice-engine/ultra-justice-engine.php` is the expected repo main file for `Ultra Justice Engine` v1.0.0.
- VERIFIED LOCAL: `justice-core/justice-core.php` is the expected repo main file for `Justice Core` v1.0.0.
- VERIFIED LOCAL: `ultra-justice/ultra-justice.php` is the expected repo main file for `Ultra Justice` v1.0.0.
- VERIFIED LOCAL RISK: `justice-core/` and `ultra-justice-engine/` share `UJE_*` constants and many `uje_*` functions.
- NOT LIVE CHANGED: plugin state remains unchanged; this was a local repo/path and documentation review only.
- LIVE PATH CHECK: exact active plugin PHP file path is now verified through read-only uPress filesystem inspection.

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

## 2026-05-11 404 Redirect Plugin Verification Baseline

- VERIFIED SOURCE: uPress plugin manager shows active `All 404 Redirect to Homepage`.
- CREATED: `tools/check-404-routing.ps1` for repeatable pre/post plugin-state checks.
- CREATED: `project-control/404-plugin-deactivation-checklist.md` for owner-approved deactivation, post-change verification and rollback.
- LIVE DEPLOYMENT VERIFIED: Codex used the uPress Git panel directly; uPress Git log showed commit `0410d2f` as `Prepare 404 plugin deactivation checks`.
- VERIFIED BASELINE: the checker passes homepage, `/articles/`, `/lawyers/`, `robots.txt`, and `sitemap_index.xml`.
- BLOCKED BASELINE: fake generated URLs and invalid `?p=99999999` still return `301 Location: https://jus-tice.co.il/`.
- NEXT: after explicit owner approval, deactivate only `All 404 Redirect to Homepage`, rerun the checker, and capture screenshots if the 404 is fixed.
- SAFETY: no plugin state, `.htaccess`, permalink, URL migration, redirect map, content, taxonomy, canonical, sitemap, lawyer, CRM, review or database change was executed in this documentation/checker pass.

## 2026-05-11 Live Justice Plugin Surface Verification

- VERIFIED LIVE: `tools/check-live-plugin-surface.ps1` reports `ultra-justice-engine/v1` as the exposed Justice REST namespace.
- VERIFIED LIVE: `justice-core/v1` and `ultra-justice/v1` are not exposed.
- VERIFIED LIVE: `articles`, `justice_lawyer`, and `justice_lead` are exposed in `wp/v2/types`.
- NOT VERIFIED LIVE: `justice_legal_tool` and `justice_legal_request` are not exposed in the current public type check.
- VERIFIED RISK: legacy CPTs remain exposed in `wp/v2/types`.
- VERIFIED UPRESS PLUGIN MANAGER: `Ultra Justice Engine` version `1.0.0` is active; `All 404 Redirect to Homepage` version `5.6` is also active.
- VERIFIED UPRESS FILESYSTEM: `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists; `/wp-content/plugins/justice-core` was not found in the filtered live plugin filesystem view.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-all-404-active-2026-05-11.png`.
- DEPLOYMENT INTERPRETATION: theme Git pulls are verified, but plugin deployment remains a separate control surface until wp-admin/uPress plugin-path inspection confirms the active plugin filesystem path and version.
- VERIFIED: exact active plugin PHP file path is `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` for the current live state.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `c58cd7e` as `Verify live plugin architecture surface`.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `7acd40c` as `Document uPress plugin manager status`.
- SAFETY: no plugin activation, deactivation, deletion, installation, file-manager edit, wp-admin setting or database change was made.
