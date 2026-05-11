# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

## 2026-05-11 - Related content international real-estate filter

- PUSHED: `4868db2` (`Filter international real estate related cards`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Filter international real estate related cards`.
- LIVE VERIFIED: public marker returns `2026-05-11-related-international-filter-v1`.
- CODE FIXED: related-content inference now classifies foreign market signals such as Greece, Cyprus, Italy, Portugal, Spain and Australia as `international`.
- CODE FIXED: a post with broad `real_estate` metadata can be overridden to `international` when its slug/title clearly shows foreign-market intent.
- CREATED: `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv`.
- VERIFIED: all sampled live related-content rows passed after deployment.
- FIXED LIVE: `/real-estate-lawyer-cost-2025/` no longer shows the Greece real-estate pricing article as a related card.
- VERIFIED STABLE: general lawyer-selection fallback, criminal-law cards and family-divorce cards still pass.
- SAFETY: no content body, CMS metadata, URL, redirect, sitemap setting, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 - Related content fallback QA live verification

- PUSHED: `40ee1c4` (`Expose related fallback QA attributes`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Expose related fallback QA attributes`.
- LIVE VERIFIED: public marker returns `2026-05-11-related-fallback-qa-v1`.
- CODE FIXED: related fallback sections now expose `data-related-mode="fallback"`, `data-related-source-cluster`, and `data-related-card-count="0"`.
- CODE FIXED: known no-card clusters can show a safe fallback lawyer-directory link instead of disappearing or falling back to unrelated latest posts.
- TOOLING FIXED: `tools/check-live-related-content-qa.ps1` now validates both semantic and fallback related sections.
- CREATED: `project-control/live-related-content-qa-2026-05-11-after-url-inference.csv`.
- CREATED: `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv`.
- VERIFIED: all four sampled live sources now pass the related-content QA script.
- FIXED LIVE: the general lawyer-selection article no longer shows off-topic cards and now reports a verified `lawyer_selection` fallback.
- FIXED LIVE: the criminal/drug-offense article now reports `criminal_law` and matched related cards.
- SAFETY: no content body, CMS metadata, URL, redirect, sitemap setting, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 - Active plugin manifest diagnostic

- VERIFIED UPress PULL: uPress Git log shows top commit `74309c5` (`Prepare plugin manifest export tooling`).

- BLOCKED AUTH EXPORT: Codex browser hit a network failure opening the WordPress-side diagnostic route/wp-admin, while local unauthenticated PowerShell access still reached the route and received HTTP 401.
- CODE FIXED: added `tools/export-plugin-manifest-diagnostic.ps1` for future WordPress Application Password export without hardcoded secrets.
- CODE FIXED: added `tools/compare-plugin-manifests.ps1` for live-vs-repo manifest comparison.
- DECISION: do not use normal account passwords for command-line Basic Auth and do not store credentials in repo files.

- VERIFIED LIVE: uPress Git log shows top commit `8111d12` (`Add active plugin manifest diagnostic`).
- VERIFIED LIVE: public static marker returns `2026-05-11-plugin-manifest-diagnostic-v1`.
- VERIFIED LIVE SECURITY: unauthenticated public diagnostic request returns HTTP 401; `tools/check-plugin-manifest-diagnostic.ps1` reports the route is protected.
- STILL BLOCKED: admin-authenticated manifest export still needs a WordPress admin session/request.

- CODE FIXED: added admin-only read-only route `GET /wp-json/justice-theme/v1/active-plugin-manifest` for active plugin file manifests.
- CODE FIXED: added `inc/diagnostics.php` and included it from `functions.php`.
- CODE FIXED: route defaults to `ultra-justice-engine/ultra-justice-engine.php`, requires `manage_options`, only accepts active plugins, stays inside `WP_PLUGIN_DIR`, and returns file metadata plus SHA-256 hashes without file contents.
- CODE FIXED: added `tools/check-plugin-manifest-diagnostic.ps1` to confirm public unauthenticated requests get 401/403 after deployment.
- DOCUMENTED: created `project-control/plugin-manifest-diagnostic-review.md`.
- VERIFIED: PHP lint passed for 128 files; `git diff --check` returned only Windows LF-to-CRLF warnings.
- LIVE VERIFIED: deployment marker is `2026-05-11-plugin-manifest-diagnostic-v1`; public protection check passed.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## 2026-05-11 - Justice plugin collision review

- VERIFIED UPress PULL: uPress Git log shows top theme commit `8800b13` (`Document live plugin parity gap`).
- SCOPE WARNING: the pull synced theme-repo documentation/tooling only; it did not update the separately active live plugin folder under `/wp-content/plugins/ultra-justice-engine/`.

- PARTIAL VERIFIED LIVE PARITY: generated repo hash manifest for `ultra-justice-engine/` and recorded the live-visible uPress active-plugin file listing.
- VERIFIED LOCAL: repo plugin contains 17 files / 80,392 bytes and repo `includes/` contains 16 files / 77,046 bytes.
- VERIFIED LIVE VISIBLE: uPress active plugin `includes/` listing shows 15 files; screenshot evidence saved at `project-control/visual-evidence/upress-plugin-filesystem-ultra-includes-2026-05-11.png`.
- VERIFIED PARITY GAP: repo `ultra-justice-engine/includes/cpt-legal-tools.php` was NOT VISIBLE in live active plugin `includes/`.
- EXPLAINED: this aligns with live public REST where `justice_legal_tool` and `justice_legal_request` are not exposed.
- DOCUMENTED: created `project-control/live-plugin-code-parity-review.md`, `project-control/ultra-justice-engine-repo-manifest.csv`, `project-control/ultra-justice-engine-live-visible-manifest.csv`, and `tools/build-plugin-manifest.ps1`.
- BLOCKED: byte-level live hashes remain blocked without SSH/WP-CLI/file export; no live plugin changes were made.

- VERIFIED LIVE PATH: uPress File Manager read-only inspection confirmed `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` as the live Justice plugin path.
- VERIFIED LIVE ABSENCE: filtering `/wp-content/plugins/` for `justice-core` returned 0 items.
- DOCUMENTED: created `project-control/upress-plugin-filesystem-readonly-review.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/upress-plugin-filesystem-ultra-justice-engine-active-2026-05-11.png`, `project-control/visual-evidence/upress-plugin-filesystem-ultra-main-file-2026-05-11.png`, and `project-control/visual-evidence/upress-plugin-filesystem-no-justice-core-2026-05-11.png`.
- DECISION: exact plugin path is now verified for the current live state; keep `Ultra Justice Engine` as the active track and keep `Justice Core` migration approval-gated.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

- DOCUMENTED / VERIFIED LOCAL: added `tools/check-justice-plugin-collision.ps1` to scan Justice plugin headers, constants, functions, REST namespaces, CPTs and taxonomies.
- VERIFIED LOCAL: `Ultra Justice Engine`, `Justice Core`, and `Ultra Justice` all exist as repo plugin trees with version `1.0.0`.
- VERIFIED LOCAL RISK: `justice-core/` and `ultra-justice-engine/` share `UJE_*` constants and many `uje_*` functions.
- DOCUMENTED: created `project-control/justice-plugin-collision-review.md` and updated the plugin registry / live plugin architecture notes.
- DECISION: keep `Ultra Justice Engine` as the active live plugin track; do not activate `Justice Core` beside it.
- SAFETY: no plugin activation, deactivation, deletion, installation, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## 2026-05-11 - Live root robots.txt fixed

- FIXED LIVE: replaced the empty physical root `robots.txt` in uPress File Manager with conservative crawler directives and the verified sitemap index URL.
- VERIFIED BEFORE FIX: public `/robots.txt` returned HTTP 200 with zero-length body, while `/?robots=1` returned healthy WordPress-generated robots output with the sitemap directive.
- VERIFIED LIVE AFTER FIX: `/robots.txt?codex_verify=...` returns HTTP 200, length 268, includes `Sitemap: https://jus-tice.co.il/sitemap_index.xml`, has no global `Disallow: /`, and does not block theme/CSS assets.
- VERIFIED LIVE: active sitemap index and sampled child sitemaps still return valid XML and zero first-party HTTP locs.
- SAFETY: no URL changes, redirects, `.htaccess` rules, sitemap inclusion changes, public content edits, taxonomy edits, canonical changes, CRM/lawyer/review changes, wp-admin option changes or database writes were made.

## 2026-05-11 - Native 404 route guard deployed / live redirect still blocked

- CODE FIXED: added an early native-404 guard that renders the theme 404 template before later template redirect handlers can send real 404s to the homepage.
- DEPLOYED LIVE: uPress Git log shows commit `cbbba45` and the public static marker returns `2026-05-11-native-404-before-redirect-v1`.
- VERIFIED LIVE BLOCKED: fake public URLs still return `301 Location: https://jus-tice.co.il`; invalid `?p=99999999` and `/index.php/not-a-real-index-path-.../` also redirect to homepage.
- VERIFIED CLUE: the 301 response has no `X-Redirect-By` header and no theme route-guard header, so the redirect source is likely before theme template routing or bypasses standard WordPress redirect filters.
- VERIFIED SOURCE: uPress plugin manager shows `All 404 Redirect to Homepage` active (`פעיל`), and its description says it redirects 404 links using 301 redirects.
- DOCUMENTED: added `project-control/redirect-404-source-review.md` and screenshot evidence under `project-control/visual-evidence/`.
- NEXT: deactivate the plugin only after owner approval, then clear cache and verify real 404 behavior.
- SAFETY: no live URL, redirect, `.htaccess`, content, taxonomy, canonical, sitemap, lawyer, CRM, review, wp-admin option or database data was changed; plugin status was inspected read-only.

## 2026-05-11 - Rank Math sitemap cache bypass

- CODE FIXED: disabled Rank Math sitemap caching via the official `rank_math/sitemap/enable_caching` filter while sitemap HTTPS output is being verified.
- EXPECTED IMPACT: Rank Math child sitemap XML should stop serving stale cached HTTP loc values and allow the existing first-party HTTPS normalization filters to affect generated entries.
- VERIFIED BEFORE PATCH: `articles-sitemap2.xml?nocache=1` still returned 200 `http://jus-tice.co.il` loc values and zero HTTPS loc values.
- VERIFIED LIVE: uPress Git log shows top commit `4c7b45e` and public marker returns `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
- FIXED LIVE: sampled child sitemaps now return zero first-party HTTP locs and HTTPS locs only: page 11, articles1 201, articles2 200, practice-areas 40, category 16.
- STILL BLOCKED: public `robots.txt` remains empty and needs separate server/plugin/static robots investigation.
- SAFETY: no URL inventory, redirect, sitemap plugin setting, robots/htaccess file, content, taxonomy, canonical setting, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - uPress Git pull verified

- VERIFIED LIVE: accessed uPress File Manager, opened `ניהול GIT` for `/wp-content/themes/justice-theme`, confirmed clean Git status and ran Git pull.
- VERIFIED LIVE: uPress Git log now shows top commit `c992fd2` (`Document reviews compliance alias`), matching GitHub `main`.
- VERIFIED LIVE: public static deployment marker now returns `2026-05-11-robots-sitemap-directive-v1`, and homepage source includes the same marker.
- BLOCKED / NOT FIXED BY PULL: public `robots.txt` still returns HTTP 200 with empty body; this needs static/server/plugin robots investigation.
- BLOCKED / NOT FIXED BY PULL: Rank Math child sitemap XML still exposes HTTP loc values after deployment, likely requiring sitemap cache/settings flush.
- DOCUMENTED: created `project-control/upress-git-pull-workflow.md`.
- SAFETY: no content, URL, redirect, sitemap setting, robots/htaccess file, taxonomy, canonical setting, CRM, lawyer, review or database data was changed by this repo documentation patch; the live action was the requested Git pull only.

## 2026-05-11 - Reviews compliance alias hardening

- DOCUMENTED: expanded `project-control/reviews-compliance-risk.md` into an owner-facing compliance summary for the lawyer reviews, ratings, reputation and trust module.
- DOCUMENTED: kept `project-control/review-compliance-risk.md` as the canonical detailed compliance register while making the plural requested filename complete and readable.
- VERIFIED: the related review/reputation research, Google review integration plan, rating-system spec, review field map, schema policy, product roadmap and Maya reputation plan are present.
- NOT IMPLEMENTED: no public review UI, no fake ratings, no review schema, no Google review sync, no lawyer-profile change and no database/wp-admin change was made.
- SAFETY: docs-only change; no URLs, redirects, sitemap settings, robots/htaccess rules, content, taxonomy, canonical settings, CRM, lawyer, review or database data was changed.

## 2026-05-11 - Robots sitemap directive

- CODE FIXED: robots.txt now appends the verified active sitemap index `https://jus-tice.co.il/sitemap_index.xml` when absent.
- EXPECTED IMPACT: crawlers receive the working sitemap index instead of relying on default aliases that currently redirect to the homepage.
- VERIFIED: the filter respects WordPress public-indexing settings and avoids duplicate directives for the same sitemap URL.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-robots-sitemap-directive-v1`.
- SAFETY: no URLs, redirects, sitemap plugin settings, robots/htaccess server files, content, taxonomy, canonical settings, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Plugin sitemap HTTPS filters

- CODE FIXED: added first-party HTTPS normalization for sitemap entries emitted through WordPress core, Yoast, Rank Math and AIOSEO hooks.
- CODE FIXED: sitemap entry arrays and URL strings now reuse `justice_theme_normalize_public_url()` so only Jus-Tice host URLs are changed from HTTP to HTTPS.
- EXPECTED IMPACT: after deployment and cache clear, active sitemap child files should stop exposing first-party `http://jus-tice.co.il` locs when the active generator uses supported hooks.
- VERIFIED: official Yoast, Rank Math and AIOSEO sitemap hook documentation was checked before implementation.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-sitemap-https-plugin-filters-v1`.
- SAFETY: no URLs, redirects, sitemap settings, robots/htaccess rules, content, taxonomy, canonical settings, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Branding manifest

- CODE FIXED: added `assets/images/site.webmanifest` for stable mobile bookmark/install branding.
- CODE FIXED: `inc/seo.php` now emits the fallback manifest link only when WordPress has no Site Icon, preserving the admin/plugin icon stack and avoiding duplicate manifest tags.
- PARTIAL LIVE VERIFIED: current public source already has a RealFaviconGenerator manifest under `/wp-content/uploads/fbrfg/site.webmanifest`.
- VERIFIED: local icon assets include square 16/32/48/180/192/512 PNG variants; the full logo source remains available as a non-square reference image.
- VERIFIED: PHP lint passed for 127 files, manifest JSON validated, and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-branding-manifest-v1`.
- SAFETY: no wp-admin Site Icon, custom logo, media item, content, URL, redirect, sitemap, canonical, taxonomy, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Lawyer directory approved query

- CODE FIXED: `/lawyers/` now builds the visible archive query from profiles that pass the public lawyer approval gate.
- CODE FIXED: public result counts and pagination now reflect approved matching profiles instead of unapproved records filtered after the query.
- EXPECTED IMPACT: seed/demo/unapproved lawyer records should no longer create misleading directory counts or empty later pages.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-lawyer-directory-approved-query-v1`.
- SAFETY: no lawyer record, content, URL, redirect, sitemap, canonical, taxonomy, CRM, review or database data was changed by this repo patch.

## 2026-05-11 - Maya public approval hardening

- CODE FIXED: Maya Rotenberg no longer bypasses lawyer public-approval safety solely by name/slug before seed/demo metadata is evaluated.
- CODE FIXED: Maya name/slug fallback now requires normal approval/source signals or explicit opt-in filter `justice_theme_allow_maya_name_public_profile_fallback`.
- EXPECTED IMPACT: a real, approved/source-backed Maya mini-site can still appear, but seed/demo Maya records cannot be treated as public-approved by identity alone.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-maya-public-approval-hardening-v1`.
- SAFETY: no Maya profile, lawyer record, content, URL, redirect, sitemap, canonical, taxonomy, CRM, review or database data was changed by this repo patch.

## 2026-05-11 - LegalTech tool seed gate

- CODE FIXED: automatic LegalTech tool-page seeders in `justice-core`, `ultra-justice-engine`, and `ultra-justice` now require explicit opt-in filters.
- EXPECTED IMPACT: wp-admin loads will not silently publish `justice_legal_tool` product pages before product, SEO, pricing, legal-review and funnel decisions are approved.
- VERIFIED: public LegalTech request submissions are unchanged; this patch only gates automatic tool-page creation.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-legal-tools-seed-gate-v1`.
- SAFETY: no legal tool, legal request, lawyer record, content, URL, redirect, sitemap, canonical, taxonomy, CRM, review or database data was changed by this repo patch.

## 2026-05-11 - Lawyer profile view tracking gate

- CODE FIXED: automatic lawyer profile view tracking now requires explicit opt-in filter `justice_theme_enable_lawyer_profile_view_tracking`.
- EXPECTED IMPACT: public single lawyer page loads no longer write `profile_views` metadata or visitor throttling transients by default during the audit-first cleanup phase.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-lawyer-profile-view-tracking-gate-v1`.
- SAFETY: no lawyer record, content, URL, redirect, sitemap, canonical, taxonomy, CRM, review or database data was changed by this repo patch.

## 2026-05-11 - Demo lawyer seed gates

- CODE FIXED: legacy/demo lawyer admin-init seeders in `justice-core`, `ultra-justice-engine`, and `ultra-justice` now require explicit opt-in filters.
- CODE FIXED: legacy `/seed-lawyers` and `/seed-reset` REST routes now require separate explicit opt-in filters in addition to admin capability.
- EXPECTED IMPACT: wp-admin and REST usage will not silently recreate placeholder/demo lawyer profiles or trigger seed reset/import behavior during the audit-first content architecture project.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-demo-lawyer-seed-gates-v1`.
- SAFETY: no lawyer record, content, URL, redirect, sitemap, canonical, taxonomy, CRM, review or database data was changed by this repo patch.

## 2026-05-11 - REST write gates

- CODE FIXED: custom REST content write routes (`update-meta`, `trash-post`) now require explicit opt-in filters in addition to admin capability.
- CODE FIXED: legacy agent bridge REST routes are disabled by default and theme file writes require a separate explicit write filter.
- EXPECTED IMPACT: REST remains useful for controlled inspection, but cannot quietly mutate CMS records or theme files during the audit-first migration phase.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-rest-write-gates-v1`.
- SAFETY: no REST call, file write, terms, pages, articles, content, URLs, redirects, sitemap, canonical, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Admin seed CMS write guard

- CODE FIXED: added `justice_theme_admin_cms_write_enabled()` for explicit owner-approved admin seed/write actions.
- CODE FIXED: automatic theme seeders for taxonomy terms, pillar page drafts, pillar article drafts, city/practice drafts, lawyer registration, lawyer dashboard and lawyer plans pages now require explicit opt-in filters.
- EXPECTED IMPACT: opening wp-admin after a theme pull will not silently create new drafts/pages/terms during the audit-first content architecture project.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-admin-seed-write-guard-v1`.
- SAFETY: no terms, pages, articles, content, URLs, redirects, sitemap, canonical, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Menu CMS write guard

- CODE FIXED: primary menu seeding no longer runs from public `init`; it is admin-only and requires `justice_theme_enable_primary_menu_seed`.
- CODE FIXED: seeded menu URL repair now requires `justice_theme_enable_seeded_menu_area_url_repair`.
- EXPECTED IMPACT: pulling the theme will not silently create/assign/repair WordPress menus during ordinary frontend traffic, while render-time fallback links still protect the public navigation experience.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-menu-cms-write-guard-v1`.
- SAFETY: no menu, content, URL, redirect, sitemap, canonical, taxonomy, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Family cluster render-only public guard

- CODE FIXED: the family-law runtime public-content guard still replaces unsafe public output at render time, but no longer persists the cleaned body to WordPress unless `justice_theme_enable_family_cluster_runtime_guard_persistence` is explicitly enabled.
- CODE FIXED: automatic editorial repair, internal-notes draft sync, quarantine and auto-publication are all opt-in live CMS writes.
- EXPECTED IMPACT: pulling the theme keeps visitors protected from internal-note leakage while respecting the current audit-first migration policy.
- NOT LIVE VERIFIED: immediate public homepage check still served older marker `2026-05-11-mobile-inner-qa-v1`; requires uPress pull/cache clear and marker check for `2026-05-11-family-cluster-render-only-guard-v1`.
- SAFETY: no content, URLs, redirects, sitemap, canonical, taxonomy, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Controlled Maya migration guard

- CODE FIXED: automatic Maya Rotenberg slug migration is now opt-in only through `justice_theme_enable_maya_slug_migration`.
- CODE FIXED: automatic Maya mini-site field bootstrapping is now opt-in only through `justice_theme_enable_maya_minisite_bootstrap`.
- CODE FIXED: automatic Maya public-source metadata bootstrapping is now opt-in only through `justice_theme_enable_maya_public_sources_bootstrap`.
- EXPECTED IMPACT: pulling the theme will no longer silently change live lawyer slugs or profile CMS fields before URL migration mapping, redirect planning and owner approval.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and marker check for `2026-05-11-controlled-maya-migration-guard-v1`.
- SAFETY: no content, URLs, redirects, sitemap, canonical, taxonomy, CRM, lawyer, review or database data was changed by this repo patch.

## 2026-05-11 - Breadcrumb visual polish

- CODE FIXED: breadcrumb markup now has stable item/current/home classes, text wrappers and a depth attribute for safer CSS/QA.
- CODE FIXED: breadcrumbs now render as a more premium customer-facing navigation band with pill links, current-page emphasis, subtle brand accent and mobile horizontal scrolling.
- CODE FIXED: RTL separator behavior was aligned with the updated visual separator.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and desktop/mobile checks with marker `2026-05-11-breadcrumb-polish-v1`.
- SAFETY: no content, URL, redirect, sitemap, canonical, taxonomy, CRM, lawyer, review or database data was changed.

## 2026-05-11 - Related-content QA attributes

- CODE FIXED: manual related URL metadata now supports comma, newline, pipe and semicolon separators.
- CODE FIXED: semantic related-content sections expose source cluster and card count as safe `data-*` attributes.
- CODE FIXED: related article cards expose inferred card cluster and cluster-match state for visual/DOM QA.
- EXPECTED IMPACT: post-deployment checks can identify off-cluster related cards without reading internal project notes or changing public article bodies.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and related-content QA with marker `2026-05-11-related-content-qa-attrs-v1`.
- SAFETY: no content, URLs, redirects, sitemap, robots, CMS metadata, CRM, lawyer or review records were changed.

## 2026-05-11 - Related-content CMS metadata batch 001

- DOCUMENTED: created `project-control/related-content-cms-update-batch-001.csv`.
- DOCUMENTED: the batch turns live QA findings into concrete metadata instructions for four priority pages: general lawyer selection, drug offenses, real-estate cost, and mutual divorce agreement.
- DOCUMENTED: each row includes `content_cluster`, `parent_pillar_url`, and `manual_related_urls` recommendations.
- EXPECTED IMPACT: after owner-approved CMS metadata update, related cards should stop relying on broad taxonomy fallback for those sampled pages.
- NOT EXECUTED: no public article body, CMS metadata, URL, redirect, taxonomy, CRM, review, wp-admin setting or database row was changed.

## 2026-05-11 - Navigation area fallback normalization

- CODE FIXED: header topic-strip fallbacks for personal injury/damages and inheritance now point to canonical lawyer-directory filters instead of older bare fallback paths.
- CODE FIXED: homepage inheritance pillar fallback now uses the canonical inheritance lawyer-directory filter while the clean pillar page is not yet live.
- CODE FIXED: footer specialization navigation now includes the same major legal-area filters already used by the homepage/directory strategy: medical malpractice, employment, traffic and inheritance.
- CODE FIXED: seeded/admin-repaired menu URLs normalize additional legacy aliases into canonical directory filters, including medical malpractice, employment and privacy/cyber variants.
- CODE FIXED: lawyer-directory parsing now accepts extra public aliases for medical malpractice, privacy/cyber and tax filters, and maps the clean privacy/cyber filter to the existing `cyber-law` taxonomy slug.
- EXPECTED IMPACT: visible navigation, SEO cluster links and directory filters stay aligned without changing public slugs or executing redirects.
- VERIFIED: PHP lint passed for 127 files, `git diff --check` passed, and the leftover legacy alias scan only matched intentional repair mappings.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and live header/footer/menu/directory checks with marker `2026-05-11-nav-area-fallback-normalization-v1`.
- SAFETY: no public content body, URL migration, redirect, taxonomy term, lawyer data, lead data, review data, wp-admin setting or database row was changed.

## 2026-05-11 - Lead area normalization

- CODE FIXED: homepage and shared lead forms now submit canonical clean area slugs instead of mixed legacy form values.
- CODE FIXED: the rule-based lead classifier maps legacy aliases such as `family`, `real_estate`, `damages`, `medical_malpractice`, `torts`, `employment-law`, and Hebrew `אחר` into the current content/CRM vocabulary.
- CODE FIXED: saved leads with non-canonical `legal_area` values are normalized during lead classification, and the CRM table displays Hebrew area labels when possible.
- EXPECTED IMPACT: lead routing, CRM review, content clusters and directory filters now speak the same legal-area language.
- VERIFIED: PHP lint passed for 127 files using local PHP 8.5.6, and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and one controlled public lead test with marker `2026-05-11-lead-area-normalization-v1`.
- SAFETY: no existing leads, public content, URLs, redirects, taxonomy terms, lawyer data, review data, wp-admin settings or database rows were changed by this repo patch.

## 2026-05-11 - Lawyer directory filter slug aliases

- CODE FIXED: lawyer-directory area filters now accept clean/public aliases while querying the real taxonomy slugs underneath.
- CODE FIXED: `personal-injury-law` maps safely to the existing `torts` term, and `medical-malpractice-law` maps safely to `medical-malpractice`.
- CODE FIXED: `employment-law`, `employment` and `labor` normalize to the established `labor-law` filter path.
- CODE FIXED: filter dropdown labels are normalized for `נזיקין ותאונות`, `רשלנות רפואית`, and `דיני עבודה`, reducing duplicate/technical term leakage.
- VERIFIED: PHP lint passed for 127 files using local PHP 8.5.6, and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and live filtered-directory checks with marker `2026-05-11-lawyer-filter-slug-alias-v1`.
- SAFETY: no taxonomy terms, redirects, public content, lawyer records, review data, wp-admin settings or database rows were changed.

## 2026-05-11 - Homepage legal hub coverage

- CODE FIXED: homepage featured pillars now include medical malpractice and personal injury/damages lawyer-intent cards.
- CODE FIXED: homepage topic clusters now include medical malpractice, personal injury/damages, employment law, and inheritance/wills, not only family/criminal/real-estate/traffic.
- CODE FIXED: all new homepage hub/support links use safe published-page checks with directory/topic fallbacks, so clean English slugs can be promoted without creating broken or duplicate URLs.
- EXPECTED IMPACT: the homepage better supports broad legal-portal relevance and visibly links users toward the major lawyer-topic hubs requested in the integrated SEO/design strategy.
- VERIFIED: PHP lint passed for 127 files using local PHP 8.5.6, and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public homepage desktop/mobile DOM check with marker `2026-05-11-homepage-hub-coverage-v1`.
- SAFETY: no public article body, URL migration, redirect, sitemap, CRM record, lawyer data, review data, wp-admin setting or database row was changed.

## 2026-05-11 - Forced 404 verification headers

- CODE FIXED: the homepage-fallback routing guard now emits `X-Justice-Route-Guard: forced-unknown-path-404` when it converts an unknown homepage-served path into a real 404.
- CODE FIXED: guarded 404 responses also emit `X-Robots-Tag: noindex, nofollow`.
- EXPECTED IMPACT: post-deploy QA can verify the fake-404 fix by checking HTTP status and headers, not only rendered body text.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public fake-URL header check with marker `2026-05-11-forced-404-header-signal-v1`.
- SAFETY: no public content body, slug, URL migration, redirect, sitemap, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Public link HTTPS normalization

- CODE FIXED: public frontend first-party links generated through WordPress URL helpers now normalize to HTTPS.
- CODE FIXED: covered surfaces include `home_url`, post/page/CPT permalinks, taxonomy term links and attachment links.
- CODE FIXED: URL host detection now reads configured options directly, avoiding recursion when `home_url` itself is filtered.
- PARTIAL ONLY: stored database URLs, redirect rules, URL slugs and plugin sitemap settings were not changed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public HTML/sitemap spot checks with marker `2026-05-11-public-link-https-normalization-v1`.
- SAFETY: no public content body, slug, URL migration, redirect, robots rule, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - HTTPS SEO URL normalization

- CODE FIXED: theme-emitted first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS for the Jus-Tice host.
- CODE FIXED: common SEO-plugin canonical/Open Graph URL filters route through the same first-party URL normalization helper.
- CODE FIXED: WordPress core sitemap entries normalize first-party `loc` URLs to HTTPS when core sitemaps are active.
- PARTIAL ONLY: active plugin sitemap configuration still requires wp-admin/uPress review because prior live checks showed many `http://` sitemap locs.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public source/sitemap QA with marker `2026-05-11-https-seo-url-normalization-v1`.
- SAFETY: no public content body, slug, URL migration, redirect, robots rule, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Search and 404 visual polish

- CODE FIXED: shared public legal search forms now use polished responsive styling with clear focus states and mobile stacking.
- CODE FIXED: search headers now highlight the searched term with theme accent styling, and no-results states render as clean cards instead of plain content blocks.
- CODE FIXED: 404 panel layout moved from inline styles into reusable theme classes for a more consistent customer-facing page.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public desktop/mobile QA with marker `2026-05-11-search-404-polish-v1`.
- SAFETY: no content body, URL, redirect, sitemap, robots, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Public search label map

- CODE FIXED: search result cards now use a theme-side Hebrew post-type label map rather than raw plugin labels.
- CODE FIXED: visitor-facing labels map to `מאמר משפטי`, `מאמר`, `עמוד מידע`, `פרופיל עורך דין`, `כלי משפטי`, or fallback `תוכן משפטי`.
- EXPECTED IMPACT: public search cards should stay Hebrew even if a legacy plugin copy or cached CPT registration exposes an English singular label.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public search-page QA with marker `2026-05-11-public-label-map-v1`.
- SAFETY: no content body, URL, redirect, sitemap, robots, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Hebrew CPT and taxonomy labels

- CODE FIXED: `articles` CPT labels now use Hebrew in both plugin trees, so search result cards should show `מאמר משפטי` instead of `Article`.
- CODE FIXED: `practice-areas` taxonomy labels now use Hebrew in both plugin trees, reducing English leakage in admin/REST/template label surfaces.
- VERIFIED IN CODE: 404 and search templates already use Hebrew body/H1/pagination strings.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public search-page QA with marker `2026-05-11-hebrew-cpt-labels-v1`.
- SAFETY: no content body, URL, redirect, sitemap, robots, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Homepage featured-lawyer trust gate

- CODE FIXED: homepage featured-lawyer section now renders only a public-approved lawyer profile.
- CODE FIXED: section-level copy no longer claims "verified lawyer"; verified wording is left to the lawyer card only when profile metadata supports it.
- CODE FIXED: homepage lawyer mini-site CTA now points to `/lawyer-registration/`.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and homepage visual QA with marker `2026-05-11-featured-lawyer-trust-v1`.
- SAFETY: no public lawyer content, review data, lead data, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## 2026-05-11 - Lawyer public contact safety

- CODE FIXED: lawyer directory cards and lawyer mini-site hero CTAs now use a shared contact safety helper before outputting phone or WhatsApp links.
- CODE FIXED: obvious placeholder/demo numbers are suppressed instead of being exposed as public `tel:` or WhatsApp routes.
- CODE FIXED: Attorney schema now uses the same safe public phone value, so placeholder lawyer phone values are not emitted as structured data.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and live `/lawyers/` plus lawyer profile QA with marker `2026-05-11-lawyer-contact-safety-v1`.
- SAFETY: no public profile content, review data, lead data, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## 2026-05-11 - Lawyer trust-signal safety and view throttling

- CODE FIXED: lawyer cards only show rating values when `review_display_enabled` is explicitly approved and rating/count data exists.
- CODE FIXED: lawyer mini-sites only show rating summaries and testimonials when review display is explicitly approved.
- CODE FIXED: sponsored/profile-paid labels on lawyer mini-sites now require `subscription_status=active` and are suppressed for seed-like profiles.
- CODE FIXED: profile view counting is throttled with a one-day hashed visitor transient to avoid writing on every anonymous page load.
- VERIFIED: changed PHP files passed syntax checks.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and public lawyer archive/profile QA with marker `2026-05-11-lawyer-trust-safety-v1`.
- SAFETY: no public lawyer content, review record, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## 2026-05-11 - Related content cluster gate V2

- CODE FIXED: taxonomy fallback related cards now pass through an inferred cluster gate before rendering.
- CODE FIXED: cluster aliases are normalized so `family-law`, `family_divorce`, `criminal`, `criminal_law`, `real_estate_law`, and similar values map consistently.
- CODE FIXED: when explicit CMS cluster metadata is absent, cluster inference uses slug, title, primary keyword, search intent and practice-area terms.
- EXPECTED IMPACT: criminal/general/real-estate pages should no longer fill related cards with AI/business/international items just because they share a broad taxonomy term.
- VERIFIED: `inc/related-content.php` passed syntax check and `git diff --check` passed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and repeat related-content visual QA with marker `2026-05-11-related-cluster-gate-v1`.
- SAFETY: no public content, URL, redirect, sitemap, robots, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Public article-note guard and related-content live QA

- CODE FIXED: public article templates no longer render internal review/source-audit/draft-status panels to anonymous visitors; those blocks are now editor-only.
- VERIFIED: PHP lint passed for 127 PHP files.
- LIVE VERIFIED PARTIAL: related-content mode is live on sampled article pages and reports `data-related-mode="semantic"`.
- LIVE VERIFIED: sampled article pages did not expose unsafe internal markers in the public body.
- PARTIAL QUALITY: sampled general/criminal/real-estate related cards still include off-intent items; metadata/manual related URL cleanup is required before customer-ready status.
- CREATED: `project-control/visual-evidence/related-content-live-qa-2026-05-11.json` and related-content screenshot evidence.
- BLOCKED: autonomous uPress pull remains unavailable because the Codex browser session is not authenticated and browser automation cannot safely fill the uPress login form.
- SAFETY: no public article body, URL, redirect, sitemap, robots, CRM record, wp-admin setting or database row was changed.

## 2026-05-11 - Live inner mobile QA and deployment access plan

- LIVE VERIFIED: uPress Git pull is public; homepage and `/family-law/` serve marker `2026-05-11-mobile-inner-qa-v1`.
- LIVE VERIFIED: public `premium-pass-3.css` contains the inner-page mobile fix.
- CREATED: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json`.
- CREATED: live mobile screenshots for article, articles archive, lawyer directory and family practice page.
- UPDATED: `project-control/current-status.md`, `visual-qa-report.md`, `mobile-first-template-review.md`, `accessibility-review.md`, `customer-facing-qa.md`, and `task-board.csv`.
- CREATED: `project-control/deployment-access-plan.md` with safe future pull paths: persistent authenticated uPress session, SSH/WP-CLI, or approved secured webhook.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, CRM records, database rows or wp-admin settings were changed.

## 2026-05-10 - Semantic related-content selection

- BLOCKED: provided uPress file-manager URL opened to the uPress login screen in the in-app browser.
- CODE FIXED: `inc/related-content.php` now chooses related article cards through manual URLs, same `content_cluster`, then same `practice-areas`.
- CODE FIXED: removed broad legacy `post`/latest-style fallback from single-article related content.
- CODE FIXED: if no semantic related card exists, the article template shows a relevant practice-area link instead of unrelated cards.
- VERIFIED: PHP lint passed for 127 PHP files.
- SAFETY: no public content, URLs, redirects, sitemap, robots, wp-admin, CRM or database records were changed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and representative article-page screenshots.

## 2026-05-10 - Third-party mobile CTA collision repair

- LIVE VERIFIED ISSUE: mobile DOM inspection identified the remaining green overlay as `a.whatsapp-button`, not the Tawk chat iframe.
- VISUAL EVIDENCE: before state captured at `project-control/visual-evidence/mobile-third-party-cta-before-2026-05-10.png`.
- CODE FIXED: `assets/css/premium-pass-3.css` compacts the injected mobile WhatsApp/lead banner into a 54px round icon-only control.
- CODE FIXED: extra logo/text inside the injected button is hidden on mobile while the WhatsApp icon/link remains visible.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: `project-control/visual-evidence/mobile-chat-widget-css-test-final-2026-05-10.png` confirms the 54x54px state on the live page with the exact CSS injected.
- SAFETY: no URLs, redirects, content bodies, sitemap rules, robots rules, admin settings, leads or database records were changed.
- NOT LIVE VERIFIED AFTER CODE FIX: requires uPress pull/cache clear and fresh mobile visual QA.

## 2026-05-10 - Live verification after branding pull

- LIVE VERIFIED: homepage source now contains deployment marker `2026-05-10-branding-v1`.
- LIVE VERIFIED: theme version `1.0.2` is present publicly.
- LIVE VERIFIED: theme fallback icon files return HTTP 200.
- LIVE VERIFIED: WordPress/media/plugin icon tags remain active; theme fallback tags are correctly suppressed while WordPress has a Site Icon.
- VISUAL VERIFIED: captured `homepage-branding-post-pull-desktop-2026-05-10.png` and `homepage-branding-post-pull-mobile-2026-05-10.png`.
- VISUAL VERIFIED PARTIAL: theme WhatsApp float is improved on mobile.
- FOUND: third-party green chat/lead bubble still overlaps lower mobile hero cards.
- NOT VERIFIED: wp-admin Site Icon/Custom Logo selected assets and Google search-result favicon refresh.

## 2026-05-10 - Logo favicon search branding task

- CODE FIXED: added `project-control/favicon-logo-task.md`.
- VERIFIED: inspected owner-provided Downloads logo PNG; full logo is not square, so the scale mark was exported separately for icon use.
- CODE FIXED: replaced dummy `assets/images/logo.png` with the provided Jus-Tice logo and added `assets/images/justice-logo-full.png`.
- CODE FIXED: added square fallback icon assets: `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-192.png`, `favicon-512.png`, `site-icon-512.png`, `apple-touch-icon.png`, and `favicon.ico`.
- CODE FIXED: refreshed `assets/images/favicon.svg` with a square legal mark and red accent.
- CODE FIXED: `inc/seo.php` now emits ICO/SVG/512/Apple fallback tags only when WordPress Site Icon is absent.
- CODE FIXED: theme version bumped to `1.0.2`, deployment marker changed to `2026-05-10-branding-v1`, and header red-dot animation was slightly tightened.
- LIVE VERIFIED: current live source already outputs favicon tags and sampled icon URLs return HTTP 200.
- NOT LIVE VERIFIED AFTER FIX: needs uPress pull/cache refresh, browser-tab check, mobile bookmark check and wp-admin Site Icon review.

## 2026-05-10 - Mobile floating action collision fix

- LIVE VERIFIED BEFORE FIX: mobile screenshot shows the Pojo accessibility launcher and fixed WhatsApp/lead controls competing with customer-facing content.
- VISUAL EVIDENCE: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
- CODE FIXED: mobile WhatsApp float is smaller, raised above the bottom CTA zone, and uses a lower mobile z-index.
- CODE FIXED: mobile body gets bottom safe-space padding to reduce footer/form obstruction from fixed controls.
- CODE FIXED: Pojo accessibility toolbar is moved out of the middle of the first mobile viewport and its overlay height is capped.
- VERIFIED: `git diff --check` passed.
- SAFETY: no URLs, redirects, content bodies, sitemap rules, robots rules, admin settings, leads or CMS records were changed.
- NOT LIVE VERIFIED: requires uPress pull/cache refresh and mobile visual recheck.

## 2026-05-10 - Live verification of fallback and intake fixes

- LIVE VERIFIED: homepage topic strip traffic link now renders as `/lawyers/?area=traffic-law`.
- LIVE VERIFIED: homepage topic strip AI/intake link now renders as `/#ask-lawyer`.
- LIVE VERIFIED: homepage ask-lawyer form now shows email, legal area, city/region and urgency fields.
- LIVE VERIFIED: old hidden `lead_area=general` and `lead_urgency=normal` values are gone.
- LIVE VERIFIED: homepage lead source keyword is now neutral portal language.
- VISUAL VERIFIED: captured `ask-lawyer-enriched-desktop-2026-05-10.png` and `ask-lawyer-enriched-mobile-2026-05-10.png`.
- SAFETY: no live lead was submitted and no CRM records were changed.
- NEXT: controlled end-to-end CRM lead test when wp-admin/CRM verification is available.

## 2026-05-10 - Enriched homepage ask-lawyer intake fallback

- LIVE VERIFIED: homepage ask-lawyer form posts to `wp-admin/admin-post.php` and includes nonce/spam/attribution hidden fields.
- FOUND: the pulled form still used hidden `lead_area=general` and `lead_urgency=normal`, which is too weak as the temporary AI/LegalTech fallback destination.
- FOUND: homepage lead attribution could still inherit a stale recommendation-heavy source keyword.
- CODE FIXED: homepage ask-lawyer form now visibly captures legal area, city/region, optional email and urgency.
- CODE FIXED: homepage and lawyer-directory lead source keywords now use neutral portal/directory language when no explicit query/UTM term is present.
- VERIFIED: PHP lint passed locally for 127 PHP files.
- SAFETY: no live lead was submitted, no CRM records changed, and no public URLs/redirects/content bodies were changed.
- NOT LIVE VERIFIED AFTER FIX: requires Upress pull/cache refresh and one controlled lead test.

## 2026-05-10 - Post-pull verification and unsafe fallback cleanup

- LIVE VERIFIED: owner Upress pull is reflected publicly; homepage marker is `2026-05-10-contextual-title-v1`.
- LIVE VERIFIED: homepage title is now `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- LIVE VERIFIED: `/lawyers/` title is now `מדריך עורכי דין בישראל | Jus-Tice`; the English `Archive` leak is fixed live.
- VISUAL VERIFIED: homepage and `/lawyers/` screenshots captured after pull under `project-control/visual-evidence/*post-pull*2026-05-10.png`.
- FOUND: rendered traffic topic fallback still used `/traffic-law/`, which redirects to the homepage.
- FOUND: `/legal-tools/` and `/legal-tools/ai-intake/` redirect to the homepage, so LegalTech/AI CTAs were unsafe.
- CODE FIXED: traffic fallback now points to `/lawyers/?area=traffic-law`; LegalTech/AI links fall back to `/#ask-lawyer` until tool pages exist.
- SAFETY: no public URLs, redirects, content bodies, sitemap rules, robots rules, wp-admin settings or CMS/database records were changed.
- NOT LIVE VERIFIED AFTER FOLLOW-UP FIX: requires another Upress pull/cache refresh.

## 2026-05-10 - No-URL-change homepage/directory SEO link safety batch

- CODE FIXED: added safe primary/fallback public link helpers so planned English pillar URLs are only used when published content exists.
- CODE FIXED: header topic strip now covers the major homepage lawyer-intent links: divorce, criminal, real estate, medical malpractice, personal injury, traffic, employment, inheritance and AI intake.
- CODE FIXED: featured pillar cards and topic-cluster links now avoid not-yet-published pillar URLs that currently redirect to the homepage.
- LIVE VERIFIED BEFORE FIX: several planned pillar URLs still redirect to the homepage, including `/criminal-lawyer/`, `/real-estate-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/`.
- UPDATED: `project-control/homepage-directory-seo-batch-001.md`, `project-control/homepage-directory-seo-batch-001.csv`, `project-control/homepage-seo-design-alignment.md`, `project-control/seo-title-h1-review.csv`, `project-control/internal-link-map.csv`, `project-control/next-actions.md`, and `project-control/current-status.md`.
- VERIFIED: PHP lint passed locally for 127 PHP files.
- SAFETY: no public URLs, redirects, content bodies, sitemap rules, robots rules, wp-admin settings or CMS/database records were changed.
- NOT VERIFIED LIVE: requires deployment/cache refresh and public visual recheck.

## 2026-05-10 - Local PHP 8.5.6 install and live deployment recheck

- VERIFIED: installed owner-provided PHP ZIP locally to `C:\Users\janana\tools\php-8.5.6\php.exe`.
- VERIFIED: PHP CLI reports PHP 8.5.6 and full repo PHP lint passes for 127 PHP files.
- FIXED: `tools/php-lint.ps1` now discovers the local user-tools PHP install before older Winget fallback paths.
- CREATED: `project-control/php-local-setup.md`.
- LIVE RECHECK: `/articles/` still serves old deployment marker `2026-05-10-runtime-guard-v5` and old `Articles Archive | Jus-Tice.co.il` title, so commit `a90bf4b` is not live yet or is blocked by cache/sync.
- LIVE RECHECK: fake URL `/not-a-real-page-justice-qa/` returns a 301 redirect to the homepage; this is a routing/404 blocker requiring uPress/wp-admin/server/cache review.
- LIVE RECHECK: sample Hebrew lawyer profile URL returns 200 but still emits old marker and HTTP canonical/OG signals in sampled HTML.
- SAFETY: no public URLs, redirects, content bodies, sitemap, robots rules or CMS records were changed.

## 2026-05-10 - Public sitemap and HTTPS migration blocker verification

- LIVE VERIFIED: `https://jus-tice.co.il/sitemap_index.xml` is the active sitemap index and returns valid XML with 9 HTTPS child sitemap URLs.
- LIVE VERIFIED BLOCKER: `/sitemap.xml`, `/wp-sitemap.xml`, and `/post-sitemap.xml` redirect to the homepage instead of returning XML.
- LIVE VERIFIED BLOCKER: active child sitemaps expose many `http://` locs, including page sitemap 10/11 HTTP, articles sitemap 1 with 238/252 HTTP, articles sitemap 2 with 217/217 HTTP, and practice-area sitemap with 34/48 HTTP.
- CREATED: `project-control/sitemap-live-verification.csv`.
- UPDATED: `project-control/sitemap-strategy.md`, `project-control/robots-htaccess-review.md`, `project-control/next-actions.md`, and `project-control/current-status.md`.
- DECISION: URL migration remains blocked until sitemap generator settings/base URL are corrected and GSC is submitted the real active sitemap URL.
- SAFETY: no sitemap settings, redirects, robots rules, public URLs, content bodies, or CMS records were changed.

## 2026-05-10 - No-URL-change remediation batch 001

- CREATED: `project-control/no-url-change-remediation-batch-001.md`.
- CREATED: `project-control/no-url-change-remediation-batch-001.csv`.
- CREATED: `project-control/media-document-policy.md`.
- CREATED: `project-control/legacy-cpt-migration-review.md`.
- CREATED: `project-control/divorce-mediation-merge-review.md`.
- VERIFIED: `/divorce-mediation-basics/` exists as a 1,045-word duplicate-risk page and overlaps `/divorce-mediation/`.
- VERIFIED: `/family-mediation-updated-trends/` is a much deeper 20,334-word mediation/trends asset that should be reviewed before merging or redirecting mediation content.
- DECISION: media files, legacy CPT URLs, divorce mediation duplicates and high-risk old Hebrew URLs are review/merge candidates, not delete/redirect candidates.
- SAFETY: no public content, URLs, redirects, noindex rules, sitemap settings or CMS records were changed.

## 2026-05-10 - Pretrial-detention supporting draft

## 2026-05-10 - Continuous GSC/GA4 SEO intelligence baseline

- VERIFIED: GSC browser UI was used beyond Performance queries to inspect Page indexing, Sitemaps, Core Web Vitals, HTTPS and Links overview.
- VERIFIED: GSC Page indexing baseline is 198 indexed pages and 1.58K not indexed pages, with 785 crawled-currently-not-indexed URLs and 38 duplicate-without-user-selected-canonical URLs.
- VERIFIED: GSC HTTPS baseline shows 412 Non-HTTPS URLs, 25 HTTPS URLs and 222 HTTPS-not-evaluated URLs.
- VERIFIED: GA4 browser UI was used for Home, Traffic acquisition, Events and Pages and screens reports.
- FOUND: Organic Search is the largest visible channel with 1,261 sessions, while GA4 key events are 0, meaning lead/phone/WhatsApp/lawyer conversion tracking is not configured.
- FOUND: Broad lawyer intent is weak and scattered: `עורך דין` has 10.4K impressions / 9 clicks / 0.1% CTR, and `עורכי דין` has 2.49K impressions / 4 clicks / 0.2% CTR.
- CREATED: `project-control/gsc-master-workflow.md`, `project-control/gsc-indexing-review.csv`, `project-control/gsc-core-web-vitals-review.csv`, `project-control/ga4-analytics-review.md`, `project-control/ga4-event-plan.csv`, `project-control/seo-title-h1-review.csv`, `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/sitemap-strategy.md`, and `project-control/daily-gsc-monitoring.md`.
- UPDATED: GSC keyword/cannibalization/content-priority CSVs with broad lawyer/directory evidence, and updated robots/htaccess review with GSC HTTPS/indexing risks.
- VERIFIED: GSC Page indexing drilldowns were sampled for crawled-currently-not-indexed, duplicate-without-user-selected-canonical, page-with-redirect, alternate-page-with-proper-canonical and 404 examples.
- FOUND: not-indexed examples include media/PDF/DOCX URLs, legacy CPT URLs, old Hebrew taxonomy/category URLs, attachment redirect URLs, one test URL, and real content candidates such as `/divorce-mediation-basics`.
- CREATED: `project-control/gsc-indexing-example-classification.csv` with 16 sampled examples classified by URL type, content match, cluster, recommended action, and no-delete/no-redirect gates.
- DECISION: valid technical 404s remain 404; media files need a document-library policy; legacy CPT and taxonomy URLs need migration mapping; real content candidates need compare/merge work before publication.
- SAFETY: No URLs, redirects, public content, sitemap, robots or canonical behavior were changed.
- NEXT: Open GSC indexing drilldowns for examples and prepare the first no-URL-change SEO architecture batch.

- CREATED: `content-drafts/pretrial-detention-supporting-he.md`, a Hebrew public-facing supporting draft for `/pretrial-detention/`.
- CONTENT: Draft is 3,500 words and covers מעצר ימים, hearing flow, judicial considerations, חלופת מעצר, supervisors, release conditions, family action steps, common mistakes, youth arrests, communication with detainee, after-release workflow, condition-change requests, appeal considerations, work/family impact, release-plan checklist, FAQ and internal links.
- CREATED: `project-control/pretrial-detention-source-audit.csv` with Kol Zchut/gov.il source candidates and legal-review blockers.
- CREATED: `project-control/pretrial-detention-cannibalization-note.md` mapping overlap with existing Jus-Tice arrest/procedure pages.
- UPDATED: content inventory, publication cannibalization check and 5,000-word article brief with draft-only status.
- SAFETY: No live publication, redirect or CMS import was performed.
- VERIFIED: local word count is 3,500 words and the public-body marker scan found no internal project notes.
- NOT VERIFIED: legal review, browser source verification, GSC traffic-risk scoring and old-content merge comparison remain required before CMS import/publication.

## 2026-05-10 - Police-investigation supporting draft

- CREATED: `content-drafts/police-investigation-supporting-he.md`, a Hebrew public-facing supporting draft for `/police-investigation/`.
- CONTENT: Draft is 3,500 words and covers police summons, witness/suspect distinction, consultation before investigation, conduct inside the investigation room, silence/self-incrimination cautions, escalation to custody or conditions, youth investigations, non-police authorities, digital searches, family guidance, first-contact script, FAQ and internal links.
- CREATED: `project-control/police-investigation-source-audit.csv` with source candidates and legal-review blockers.
- CREATED: `project-control/police-investigation-cannibalization-note.md` mapping overlap with existing Jus-Tice criminal prosecution/arrest pages.
- UPDATED: content inventory, publication cannibalization check and 5,000-word article brief with draft-only status.
- SAFETY: No live publication, redirect or CMS import was performed.
- VERIFIED: local word count is 3,500 words and the public-body marker scan found no internal project notes.
- NOT VERIFIED: legal review, browser source verification, GSC traffic-risk scoring and old-content merge comparison remain required before CMS import/publication.

## 2026-05-10 - Criminal-law pillar 5,000-word expansion

- EXPANDED: `content-drafts/criminal-lawyer-pillar-he.md` from about 4,110 words to 5,037 words.
- CONTENT: Added public-facing sections for practical hearing preparation, the difference between pre-investigation advice/lawyer accompaniment/full case representation, action paths by procedural stage, first-consultation questions, and expanded FAQ.
- CLEANUP: Reworded the criminal cluster section so it reads as visitor guidance instead of internal editorial planning.
- SOURCE AUDIT: Corrected the investigation/youth source-audit split so adult consultation-right wording remains legal-review gated while youth-specific Kol Zchut material is tracked separately.
- UPDATED: content inventory and 5,000-word article brief now mark the draft as `DRAFT_V2_5000_WORD_CLASS_SOURCE_AUDITED`.
- SAFETY: No live publication, redirect or CMS import was performed.
- VERIFIED: local word count is 5,037 words and the public-body marker scan found no internal project notes.
- NOT VERIFIED: legal review, browser source verification, GSC traffic-risk scoring and old-content merge comparison remain required before CMS import/publication.

## 2026-05-10 - Criminal-law pillar draft

- CREATED: `content-drafts/criminal-lawyer-pillar-he.md`, a Hebrew public-facing draft for `/criminal-lawyer/`.
- CONTENT: Draft is about 4,110 words and covers urgent investigation/arrest/indictment intent, lawyer-selection guidance, police investigation, remand, hearing before indictment, digital evidence, case closure, criminal record risk, drugs, violence, sex offenses, white-collar matters, youth, FAQ and internal links.
- CREATED: `project-control/criminal-lawyer-source-audit.csv` with source candidates and legal-review blockers.
- CREATED: `project-control/criminal-lawyer-cannibalization-note.md` mapping overlap with existing live Jus-Tice criminal prosecution/arrests pages.
- UPDATED: content inventory, publication cannibalization check and 5,000-word article brief with draft-only status.
- SAFETY: No live publication or redirect was performed; GSC traffic risk remains unknown.
- VERIFIED: local word count is about 4,110 words and the draft scan found only stripped metadata markers, not public-body project notes.

## 2026-05-10 - Lead attribution fields

- FIXED IN CODE: Public lead forms now include hidden attribution fields for `source_keyword`, `utm_source`, `utm_campaign`, and `utm_medium` when those values are available.
- FIXED IN CODE: `source_keyword` is resolved from explicit query params, search terms, SEO keyword meta, or the current singular page title as a fallback.
- BUSINESS VALUE: Leads can now carry basic SEO/campaign context into CRM instead of losing it when the form posts to `admin-post.php`.
- VERIFIED: PHP lint passed locally for 127 PHP files.
- NOT VERIFIED LIVE: post-push checker after commit `0c6cf21` still shows homepage PHP marker absent, static theme marker absent, and family-law pages dirty. Requires uPress pull and a controlled test lead from a URL with UTM/query parameters.

## 2026-05-10 - Lead lawyer routing metadata

- FIXED IN CODE: Lead handlers now save `assigned_lawyer_id` from lawyer mini-site inquiry forms into `justice_lead` metadata.
- FIXED IN CODE: Lead handlers now persist `source_keyword` when provided, so future search/SEO attribution can travel with the lead.
- FIXED IN CODE: The lead admin detail box now shows the assigned lawyer as an editable profile link when the lead was submitted from a lawyer mini-site.
- HARDENED: UTM fields and lead-status saves now unslash before sanitization, and lead-status saves now check edit permission.
- SCOPE: Patched all three plugin-like folders (`justice-core`, `ultra-justice-engine`, `ultra-justice`) because the active live plugin path is still not fully verified.
- VERIFIED: PHP lint passed locally for 127 PHP files.
- NOT VERIFIED LIVE: post-push checker after commit `31a0026` still shows homepage PHP marker absent, static theme marker absent, and family-law pages dirty. Requires uPress pull and a controlled test submission from Maya Rotenberg's mini-site.

## 2026-05-10 - Lead form spam guard

- FIXED IN CODE: Added `inc/lead-spam-guard.php` with a honeypot and timing guard that runs before the lead plugin handler.
- FIXED IN CODE: Shared lead form, homepage ask-lawyer form and lawyer mini-site inquiry form now include the hidden anti-spam fields.
- SAFETY: Missing timing field is allowed for compatibility with older cached forms; filled honeypot or impossible timing is blocked and redirected without creating a lead.
- VERIFIED: PHP lint passed locally for 127 PHP files.
- NOT VERIFIED LIVE: requires uPress pull and a controlled test lead submission.

## 2026-05-10 - Public publication safety gate

- FIXED IN CODE: Added `inc/publication-safety.php`, a hard gate that blocks `publish`/`future` saves for public posts/pages/articles when internal project markers are still present.
- SAFETY: Draft/private content remains editable, so internal notes can still live in private editorial notes.
- FIXED IN CODE: Theme now loads the safety gate after the family-law cleaner so both share marker-detection logic.
- DOCUMENTED: `project-control/publication-workflow.md` now names the global safety gate and expected live test.
- VERIFIED: PHP lint passed locally for 126 PHP files.
- NOT VERIFIED LIVE: requires uPress pull and a controlled wp-admin test publish attempt.

## 2026-05-10 - Canonical lawyer-directory filter slugs

- FIXED IN CODE: Header/footer/fallback seeded menus now use canonical English directory filter slugs for personal injury and inheritance.
- FIXED IN CODE: Existing stale menu URLs using `area=torts` and `area=inheritance` are repaired to `personal-injury-law` and `inheritance-law`.
- FIXED IN CODE: Menu URL repair now uses version marker `justice_menu_area_urls_repaired_v2`, so it can rerun on live even if the earlier v1 repair already completed.
- FIXED IN CODE: Lawyer archive still accepts old incoming filter params and normalizes them, so old links do not simply break.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and menu repair hook execution.

## 2026-05-10 - Lawyer directory guidance and filters

- FIXED IN CODE: Lawyer archive now shows a stronger public guidance layer explaining how visitors should choose a lawyer without fake ranking or guarantee language.
- FIXED IN CODE: Directory filter dropdowns now include canonical fallback practice areas and cities even when live taxonomy data is sparse or fragmented.
- FIXED IN CODE: Active filters now appear as chips with a clear-filters action, and the page shows a count of public-approved profiles.
- FIXED IN CODE: Added a directory-level general inquiry CTA for users who do not know which lawyer/category fits.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and visual recheck of `/lawyers/`.

## 2026-05-10 - Hebrew hreflang alternates

- FIXED IN CODE: Public canonical pages now emit `hreflang="he"` and `hreflang="x-default"` alternate tags from `inc/seo.php`.
- SAFETY: Search pages, 404s and filtered lawyer-directory states are skipped so thin/noindex URLs do not get language alternates.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: post-push checker after commit `2c418b4` still shows homepage PHP marker absent, static theme marker absent, and family-law pages dirty.

## 2026-05-10 - Session: CMS wiring hardening

### EDITORIAL IMPROVEMENT MODE

**[HIGH] Added public deployment marker for live verification**
- Files: `functions.php`, `inc/deployment-marker.php`
- The theme now prints non-visual `<meta>` markers for `justice-theme-version` and `justice-deployment-marker` in the public `<head>`.
- Current marker: `2026-05-10-runtime-guard-v5`.
- Purpose: verify whether uPress/live WordPress is actually serving the latest pushed theme code before interpreting live failures as code failures.
- VERIFIED locally: PHP lint passed for 125 PHP files.
- LIVE RECHECK after push `9dd41aa`: homepage and `/divorce-lawyer/` do not contain the marker, proving live WordPress is not yet serving the latest pushed theme code.
- CODE FIXED. LIVE NOT VERIFIED until the public homepage includes the marker.

**[MEDIUM] Added repeatable live deployment checker**
- Files: `deployment-marker.txt`, `tools/check-live-deployment.ps1`
- Added a static theme marker file for direct uPress/theme-file sync verification at `/wp-content/themes/justice-theme/deployment-marker.txt`.
- Added a PowerShell checker that reports the homepage PHP marker, static marker, and family-law internal-marker scan in one pass.
- This separates three states: GitHub pushed, static files pulled, and WordPress actually rendering the latest PHP.
- VERIFIED locally: checker runs and currently reports PHP marker absent, static marker absent, and all seven family-law URLs still dirty on live.
- LIVE RECHECK after push `542aeef`: checker still reports the same absent markers and dirty family-law pages.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls and the checker sees the marker.

**[CRITICAL] Added runtime public-content guard for family-law pages**
- Files: `inc/live-content-publication.php`
- If one of the seven family-law public pages is rendered while still containing internal markers, the theme now serves the cleaned public article body from the approved repo draft and persists that cleaned body back to the WordPress page.
- The guard is scoped only to the approved family-law English slugs and only runs when internal markers are detected.
- The family-law repair version is bumped to v5 so normal migration repair reruns as well.
- VERIFIED locally: PHP lint passed for 124 PHP files and the seven-draft public-marker scan still passes.
- LIVE RECHECK after push `d374407`: public pages still expose internal markers, so the runtime guard is pushed but not live/executed yet.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls and at least one affected page is opened.

**[HIGH] Added cache purge after family-law editorial repair**
- Files: `inc/live-content-publication.php`
- After repairing or manually refreshing the family-law cluster, the theme now clears post/object cache and asks common cache plugins/layers to purge: LiteSpeed, WP Rocket, W3 Total Cache, Autoptimize, SG CachePress, Cache Enabler-style hooks and WordPress object cache.
- The family-law editorial repair version is bumped to v4 so the repair can rerun even if v3 was already recorded before cache clearing existed.
- VERIFIED locally: PHP lint passed for 124 PHP files and the seven-draft public-marker scan still passes.
- LIVE RECHECK after push `d5824ed`: public pages still expose internal markers, so the cache-purge repair is pushed but not live/executed yet.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls and the seven public URLs are checked again.

**[HIGH] Hardened family-law repair against leaked internal status sections**
- Files: `inc/live-content-publication.php`
- Public-content cleanup now removes whole Markdown sections when the section body contains strong internal markers such as `NOT VERIFIED`, `PARTIAL:`, `READY NEXT`, `CMS`, `CRM`, `GSC`, `LegalTech`, `Tools > Jus-Tice`, `FAQ schema`, `source audit`, or `project-control/...`.
- Internal notes extraction now uses the same section logic, so removed team/editorial sections are preserved in the draft-only `Internal Editorial Notes — Family Law Cluster` page instead of being lost.
- The family-law editorial repair version is bumped to v3 so live WordPress reruns the repair after the next uPress pull.
- VERIFIED locally: PHP lint passed for 124 PHP files.
- VERIFIED locally: the seven family-law repo drafts pass the public-marker scan after cleanup.
- LIVE RECHECK after push `cd9b123`: public pages still expose internal markers, so the v3 repair is pushed but not live/executed yet.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls and all seven URLs are checked again for leaked internal markers.

**[MEDIUM] Improved public article conversion for repaired pages**
- Files: `inc/content-draft-importer.php`, `inc/live-content-publication.php`
- Public article conversion now turns repo-style internal URL references like `/child-support/` into actual internal links.
- The public sanitizer now strips more owner/team planning language, including cannibalization instructions, CMS/CRM/GSC/LegalTech notes, mini-site planning notes and "this page should link" implementation notes.
- The family-law editorial repair version is bumped to v2 so live WordPress reruns the stricter cleanup after the next uPress pull.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls and the seven family-law URLs are checked again.

**[HIGH] Switched family-law cluster from cleanup/removal to editorial repair**
- Files: `inc/live-content-publication.php`, `inc/content-draft-importer.php`, `project-control/publication-workflow.md`, `project-control/publication-cannibalization-check.csv`, `project-control/publication-review-family-law-cluster.md`, `project-control/live-content-publication-status.md`, `project-control/editorial-repair-runbook.md`
- Removed the uncommitted front-end route block before it was pushed.
- Disabled the previous draft/restore quarantine routine by default.
- Added an editorial repair flow that keeps existing family-law pages public and refreshes their body with public-facing article content.
- Added a draft-only WordPress page sync for `Internal Editorial Notes — Family Law Cluster`.
- Content-draft imports into `articles` now use cleaned public body content and store internal notes separately.
- VERIFIED locally: PHP lint passed for 124 PHP files.
- LIVE RECHECK after push `d3ff1d6`: live pages still show internal-note markers, so uPress pull/cache refresh or hook execution is still required.

### URGENT PUBLICATION SAFETY CORRECTION

**[CRITICAL] Paused family-law auto-publication and added public-content gates**
- Files: `inc/live-content-publication.php`, `inc/content-draft-importer.php`, `project-control/publication-workflow.md`, `project-control/publication-cannibalization-check.csv`, `project-control/publication-review-family-law-cluster.md`, `project-control/review-notes/family-law-internal-notes.md`
- Automatic publication is now disabled.
- Manual wp-admin publication now runs preflight and blocks unapproved rows.
- Public output is blocked if internal markers such as `NOT VERIFIED`, `project-control`, source-audit paths, CMS/CRM/GSC notes or publication blockers remain.
- The seven proposed family-law URLs are blocked pending cannibalization/merge review.
- VERIFIED locally with PHP lint pending in this pass.

**[CRITICAL] Added emergency quarantine for already-live unsafe pages**
- Files: `inc/live-content-publication.php`, `inc/content-draft-importer.php`, `project-control/live-content-publication-status.md`
- Live recheck found all seven family-law pages public with publication markers and internal-note markers.
- The emergency migration restores pre-publication backups where available; otherwise it moves generated pages to draft.
- No pages are deleted.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls the emergency commit and the seven URLs are rechecked.

**[CRITICAL] Added manual emergency cleanup runbook**
- File: `project-control/emergency-live-cleanup-runbook.md`
- Live recheck at 14:02 Asia/Jerusalem confirmed all seven unsafe pages are still live.
- Runbook documents the preferred uPress pull path and wp-admin fallback to draft unsafe generated pages without deleting anything.

### OWNER-APPROVED PUBLICATION PACKAGE

**[HIGH] Added live publisher for the first family-law cluster**
- Files: `inc/live-content-publication.php`, `functions.php`, `inc/seo.php`, `inc/schema.php`, `assets/css/premium-pass-3.css`, `project-control/live-content-publication-status.md`
- Publishes the approved family-law cluster as public root-level SEO pages with short English slugs after GitHub/uPress deployment.
- Intended review URLs: `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/`, `/family-dispute-resolution/`.
- Adds page-level SEO title/description, AEO/GEO summaries, Article schema, internal cluster links, Maya Rotenberg connection, lead CTA and legal disclaimer.
- Existing root page content is backed up into post meta before replacement.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls the commit and the URLs are opened.

**[MEDIUM] Added visible discovery links for published family-law cluster**
- Files: `template-parts/sections/topic-clusters.php`, `template-parts/sections/featured-pillars.php`, `inc/practice-landing.php`
- Homepage topic clusters now expose the seven family-law publication URLs directly instead of waiting for article CPT queries.
- Featured pillar card now points to `/divorce-lawyer/` instead of the old `/family-law/divorce/` path.
- The `/family-law/` practice hub now includes `/family-dispute-resolution/` in its supporting-topic map.
- CODE FIXED. LIVE NOT VERIFIED until uPress pulls the commit.

**[MEDIUM] Added wp-admin manual trigger for family-law publication**
- Files: `inc/live-content-publication.php`, `inc/content-draft-importer.php`
- `Tools > Jus-Tice Content Drafts` now shows the owner-approved family-law cluster publication status.
- Added an admin-only nonce-protected button to publish/refresh the seven family-law cluster pages if the front-end one-time publisher is blocked by cache or deployment timing.
- CODE FIXED. LIVE NOT VERIFIED until wp-admin is opened after uPress pull.

### FIXED

**[HIGH] Reviewed Claude branch without destructive merge**
- File: `project-control/branch-review-claude-aovsk.md`
- VERIFIED: `origin/claude/justice-website-review-aovSK` exists at remote tip `8e965ff`.
- RISK: Whole-branch merge would delete newer `main` work including long-form drafts, LegalTech templates, onboarding/dashboard pages, GSC tooling, visual evidence and many project-control files.
- Decision: use it only as a patch source.

**[HIGH] Wired ask-lawyer section into lead handler**
- File: `template-parts/sections/ask-lawyer.php`
- The form now posts to `admin-post.php` with `action=justice_submit_lead`, proper nonce and canonical lead field names.
- VERIFIED: PHP lint passed locally for 120 PHP files.

**[MEDIUM] Added SEO canonical/noindex and lawyer schema hardening**
- Files: `inc/seo.php`, `inc/schema.php`
- Added non-singular canonical tags for homepage/archive/tax/search contexts.
- Added `noindex,follow` for search and lawyer-directory filter URLs.
- Added conservative `Attorney` schema for lawyer mini-sites without fake ratings/reviews.
- VERIFIED: PHP lint passed locally for 120 PHP files.

**[MEDIUM] Hardened lawyer profile counters and contact settings**
- Files: `single-justice_lawyer.php`, `inc/lead-ui.php`
- Profile view counts now skip logged-in users, admin contexts, ajax/cron/feed and common bots/previews.
- `justice_whatsapp` is now editable in the Customizer instead of being only a footer default.
- VERIFIED: PHP lint passed locally for 120 PHP files.

**[HIGH] Added family-dispute-resolution supporting draft**
- Files: `content-drafts/family-dispute-resolution-supporting-he.md`, `project-control/family-dispute-resolution-source-audit.csv`
- Added a Hebrew draft for `/family-dispute-resolution/` covering the pre-lawsuit family dispute process, preparation, urgent-risk warnings, relation to divorce agreements, FAQ, Maya/pillar linking plan and LegalTech intake concept.
- Expanded with timeline, preparation matrix, CMS/module strategy, Maya mini-site integration and URL consolidation notes.
- VERIFIED: Draft word count is 3,521 words locally.
- NOT VERIFIED: Legal review, browser source verification and publication readiness.

**[HIGH] Documented cannibalization risk for family-dispute-resolution**
- Files: `project-control/family-dispute-resolution-cannibalization-note.md`, `project-control/url-migration-map.csv`, `project-control/content-inventory.csv`, `project-control/title-audit.csv`, `project-control/family-law-publication-readiness.csv`, `project-control/family-law-content-cluster-map.md`
- Existing live Jus-Tice URLs around family dispute settlement were identified as overlap risks, so the new English-slug draft is treated as a controlled consolidation candidate rather than a blind new publication.
- VERIFIED: URL migration map marks traffic risk UNKNOWN and redirects as approval-dependent.

**[HIGH] Added premium header topic strip**
- Files: `template-parts/layout/site-header.php`, `assets/css/premium-pass-3.css`
- Added a dark portal-style quick navigation strip for the main Hebrew legal intents while keeping URLs in the approved short English slug format.
- Links include divorce, criminal, real estate, medical malpractice, family law directory filtering and AI intake.
- VERIFIED: PHP lint passed locally for 120 PHP files.
- VERIFIED LIVE: public homepage HTML contains the topic strip and target links.
- VERIFIED LIVE: desktop/mobile screenshots saved at `project-control/visual-evidence/homepage-topic-strip-desktop.png` and `project-control/visual-evidence/homepage-topic-strip-mobile.png`.

**[HIGH] Added reusable PHP lint helper**
- File: `tools/php-lint.ps1`
- Result: VERIFIED locally - PHP lint passed for 120 PHP files.
- Why it matters: PHP is now installed locally, and future PHP edits can be checked with one repeatable repo command instead of a manual Winget path workaround.
- Remaining gap: live server PHP version remains NOT VERIFIED.

**[HIGH] Installed local PHP and cleared full repo PHP lint**
- Files: `ultra-justice/includes/cpt-lawyers.php`, `ultra-justice/includes/lead-submissions.php`
- Installed PHP 8.3 locally through Winget for command-line syntax checks.
- Fixed two PHP 8 parser errors in the legacy `ultra-justice` plugin folder by parenthesizing nested ternary/fallback expressions.
- VERIFIED: PHP lint passed for 120 PHP files locally.

**[HIGH] Added content-request reviewed action in Lawyer Onboarding**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer Onboarding now has a nonce-protected `Mark reviewed` action for pending signed-content requests.
- The action clears `pending_content_review`, stores `latest_content_request_reviewed_at`, and appends an internal note to the lawyer profile.
- VERIFIED in repo. LIVE NOT VERIFIED until a content request is marked reviewed in wp-admin after Upress pull.

**[HIGH] Surfaced pending lawyer content requests in onboarding queue**
- Files: `inc/lawyer-dashboard.php`, `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer content requests now flag the lawyer profile with `pending_content_review`, latest article id, topic and submitted timestamp.
- Lawyer Onboarding now includes profiles with pending content requests and shows a `Content Request` column with a review-draft link.
- VERIFIED in repo. LIVE NOT VERIFIED until a content request is submitted after Upress pull.

**[MEDIUM] Added audit notes for lawyer content requests**
- Files: `inc/lawyer-dashboard.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer content request submissions now append a timestamped entry to the requesting lawyer profile `internal_notes` field.
- This makes signed-article requests visible in the Lawyer Onboarding recent-notes queue.
- VERIFIED in repo. LIVE NOT VERIFIED until a content request is submitted after Upress pull.

**[MEDIUM] Surfaced recent internal notes in Lawyer Onboarding**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer Onboarding now previews the last three `internal_notes` entries for each listed lawyer profile.
- This makes profile-update submission/apply/discard history visible in the owner queue without opening every profile editor.
- VERIFIED in repo. LIVE NOT VERIFIED until onboarding admin is checked after Upress pull.

**[MEDIUM] Added audit notes for staged mini-site updates**
- Files: `inc/lawyer-dashboard.php`, `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Staged mini-site update submission, apply, and discard events now append timestamped entries to the lawyer profile `internal_notes` field.
- This creates a lightweight owner audit trail before building a fuller CRM activity log.
- VERIFIED in repo. LIVE NOT VERIFIED until a staged update is submitted/applied/discarded after Upress pull.

**[HIGH] Added discard action for staged mini-site updates**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer Onboarding now shows a `Discard pending update` action beside the apply action.
- The action is admin-only and nonce-protected; it clears pending update metadata without touching public profile fields and marks `profile_status = update_rejected_no_public_change`.
- VERIFIED in repo. LIVE NOT VERIFIED until a staged update is discarded in wp-admin after Upress pull.

**[HIGH] Added admin apply action for staged mini-site updates**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer Onboarding now shows an `Apply pending update` action for profiles with staged mini-site changes.
- The action is admin-only and nonce-protected; it copies non-empty pending fields into public profile fields, clears pending metadata, and leaves the profile marked `update_applied_pending_final_review`.
- VERIFIED in repo. LIVE NOT VERIFIED until a staged update is applied in wp-admin after Upress pull.

**[MEDIUM] Added pending mini-site update preview to onboarding admin**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer Onboarding now has a `Pending Update` column that previews staged headline, services, process, video and FAQ update fields.
- This lets the owner triage lawyer-submitted mini-site changes before opening the full profile editor.
- VERIFIED in repo. LIVE NOT VERIFIED until a staged profile update exists in wp-admin after Upress pull.

**[HIGH] Added staged lawyer mini-site update requests**
- Files: `inc/lawyer-dashboard.php`, `page-lawyer-dashboard.php`, `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Claimed lawyers can submit mini-site updates from `/lawyer-dashboard/` for headline, services, process, video and FAQs.
- Updates are stored as `pending_profile_*` metadata and flagged with `pending_profile_review = 1`, so public profile fields are not changed before owner review.
- Lawyer Onboarding now includes profiles with pending update review, including already-published profiles.
- VERIFIED in repo. LIVE NOT VERIFIED until a claimed lawyer submits a profile update after Upress pull.

**[HIGH] Connected lawyer content requests to practice-area clusters**
- Files: `inc/lawyer-dashboard.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer-requested article drafts now inherit the requesting lawyer's `practice-areas` terms when available.
- Drafts also receive `primary_keyword` from the requested topic and `content_cluster` from the first linked practice-area slug, helping editors keep requests aligned with SEO clusters.
- VERIFIED in repo. LIVE NOT VERIFIED until a test content request is submitted after Upress pull.

**[HIGH] Added lawyer-facing content request status queue**
- Files: `page-lawyer-dashboard.php`, `assets/css/premium-pass-3.css`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer dashboard now shows a count and read-only list of the lawyer's submitted article/content requests.
- Each request shows publication state plus legal-review and source-review gates, so lawyers can see that signed content is moving through a controlled editorial pipeline.
- VERIFIED in repo. LIVE NOT VERIFIED until a claimed lawyer account views `/lawyer-dashboard/` after a content request exists.

**[HIGH] Surfaced lawyer content requests in article admin**
- Files: `inc/content-draft-importer.php`, `inc/lawyer-dashboard.php`, `project-control/lawyer-onboarding-workflow.md`
- Added a `Content Origin` column to the `articles` admin list so lawyer-requested drafts are visible beside repo-imported drafts.
- Lawyer content request submissions now email the owner with topic, lawyer, intent, audience and edit link.
- VERIFIED in repo. LIVE NOT VERIFIED until a content request is submitted and checked in wp-admin.

**[HIGH] Added lawyer dashboard content request MVP**
- Files: `page-lawyer-dashboard.php`, `inc/lawyer-dashboard.php`, `project-control/lawyer-onboarding-workflow.md`
- Logged-in lawyers with claimed profiles can submit article/content ideas from the dashboard.
- Requests create draft-only `articles` records connected to the lawyer profile and marked for legal/source review.
- This starts the self-serve “content under my name” product path without auto-publishing anything.
- VERIFIED in repo. LIVE NOT VERIFIED until a logged-in lawyer account submits a test request.

**[MEDIUM] Added practice-area fallback options to lawyer registration**
- Files: `page-lawyer-registration.php`, `project-control/lawyer-onboarding-workflow.md`
- If `practice-areas` terms are unavailable, the registration form now still shows canonical primary-area options using English slugs.
- This prevents empty practice-area submissions during setup or taxonomy activation gaps.
- VERIFIED in repo. LIVE NOT VERIFIED until the registration page is checked after Upress pull.

**[LOW] Added city suggestions to lawyer registration**
- Files: `page-lawyer-registration.php`, `project-control/lawyer-onboarding-workflow.md`
- The city/served-area field now includes a browser datalist with the core city names used by the city taxonomy mapper.
- This improves matching without forcing lawyers into a rigid single-city selector.
- VERIFIED in repo. LIVE NOT VERIFIED until the registration page is checked after Upress pull.

**[MEDIUM] Mapped registration city text to city taxonomy**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Lawyer registration still stores free-text `cities_served`, but now maps recognized city names to `city` taxonomy terms on the draft profile.
- This reduces manual cleanup before approved profiles can appear in city-based lawyer directory filters.
- VERIFIED in repo. LIVE NOT VERIFIED until a test registration is submitted.

**[MEDIUM] Added mini-site intake visibility to onboarding admin**
- Files: `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Owner notification emails now include submitted profile headline and video URL.
- The Lawyer Onboarding admin queue now shows a compact YES/NO checklist for headline, services, process, video and FAQ fields.
- VERIFIED in repo. LIVE NOT VERIFIED until a test registration is submitted and reviewed in wp-admin.

**[HIGH] Expanded lawyer self-registration into mini-site intake**
- Files: `page-lawyer-registration.php`, `inc/lawyer-onboarding.php`, `project-control/lawyer-onboarding-workflow.md`
- Public lawyer registration now asks for profile headline, key services, work process, video URL and FAQ ideas.
- Submitted values are stored as draft `justice_lawyer` mini-site metadata for admin review, not auto-published.
- VERIFIED in repo. LIVE NOT VERIFIED until Upress pulls the commit and a test registration is submitted.

**[MEDIUM] Normalized legacy lawyer archive area filters**
- Files: `archive-justice_lawyer.php`
- The `/lawyers/` archive now converts old short area values such as `family`, `criminal`, `real-estate`, `labor`, and `traffic` into canonical slugs before building the taxonomy query.
- This protects old menu/search links from returning empty directory results after the English-slug cleanup.
- VERIFIED in repo. LIVE NOT VERIFIED until Upress pulls the commit and archive filters are tested.

**[HIGH] Repaired seeded menu lawyer-directory filter URLs**
- Files: `inc/menu-seed.php`
- Future menu seeding now uses canonical practice-area slugs for lawyer directory filters.
- Added a narrow admin repair pass for existing menus that only replaces known stale URLs such as `/lawyers/?area=family` with `/lawyers/?area=family-law`.
- VERIFIED in repo. LIVE NOT VERIFIED until Upress pulls the commit and wp-admin runs once.

**[HIGH] Wired lawyer mini-sites to connected article metadata**
- Files: `single-justice_lawyer.php`
- Lawyer mini-site article feeds now prefer published `articles` records whose `connected_lawyer_slug` matches the lawyer profile slug.
- Maya Rotenberg gets a canonical `advocate-maya-rotenberg` match even while live slug cleanup is still in progress.
- The query tolerates older imported metadata with literal Markdown backticks, then falls back to practice-area articles if no directly connected articles are published.
- VERIFIED in repo. LIVE NOT VERIFIED until reviewed family-law drafts are imported/published and the Maya mini-site is previewed.

**[MEDIUM] Polished family-law article cluster navigation**
- Files: `single-articles.php`, `assets/css/premium-pass-3.css`
- Moved the family-law cluster navigator from inline styles to reusable CSS classes.
- Added larger mobile tap targets, current-page state, hover/focus states and cleaner spacing so the article sidebar feels like a premium portal module.
- VERIFIED in repo. LIVE NOT VERIFIED until Upress pulls the commit and a family-law article draft is previewed.

**[HIGH] Added family-law article cluster navigation**
- Files: `single-articles.php`, `inc/content-draft-importer.php`
- Article pages now read normalized `content_cluster` and `primary_keyword` metadata from imported repo drafts.
- Family-law drafts render a sidebar cluster navigator linking the divorce pillar and supporting pages with Hebrew labels and English slugs.
- The draft importer now strips Markdown backticks from metadata fields so cluster/lawyer/keyword values remain machine-usable.
- VERIFIED in repo. LIVE NOT VERIFIED until draft import and article preview run in wp-admin.

**[HIGH] Hardened article connected-lawyer lookup**
- Files: `inc/template-tags.php`, `single-articles.php`
- Added `justice_theme_get_connected_lawyer_by_slug()` for article templates and future CMS blocks.
- The resolver first uses the canonical English slug, then safely falls back to known Maya Rotenberg legacy Hebrew slug/title lookup while the live URL migration is still pending.
- Article pages now avoid dropping to the generic contact sidebar when imported family-law drafts point to `advocate-maya-rotenberg` but live data has not fully migrated yet.
- VERIFIED in repo. LIVE NOT VERIFIED until Upress pulls the commit and an imported article draft is previewed.

## 2026-05-09 - Session: logo fallback and content depth correction

### FIXED

**[HIGH] Removed dummy logo fallback from visible brand**
- Files: `template-parts/layout/site-header.php`, `template-parts/layout/site-footer.php`, `assets/css/premium-pass-3.css`
- Header/footer no longer render the dummy `assets/images/logo.png` when no WordPress custom logo is configured.
- Added a Jus-Tice wordmark fallback with a blinking red dot, matching the requested old-identity direction.
- Corrected the fallback wordmark direction on RTL pages so it renders as `Jus dot Tice`, not reversed.

**[MEDIUM] Upgraded article-card visual fallback**
- Files: `template-parts/cards/article-card.php`, `assets/css/premium-pass-3.css`
- Replaced the flat gray article image placeholder with a more premium legal-document visual treatment.
- Removed decorative broken/emoji-like date and reading-time symbols from article card metadata.

**[MEDIUM] Strengthened fallback navigation**
- Files: `template-parts/layout/site-header.php`, `assets/css/premium-pass-3.css`
- Replaced mojibake fallback labels with readable Hebrew labels.
- Added LegalTech and lawyer-registration links to the fallback primary menu.
- Corrected fallback practice-area query slugs to canonical English slugs.
- Added stronger premium header/nav styling.

**[HIGH] Added CMS importer for repo content drafts**
- Files: `inc/content-draft-importer.php`, `functions.php`
- Adds `Tools > Jus-Tice Content Drafts` for admin-only importing of `content-drafts/*.md`.
- Imports long-form drafts into the `articles` CPT as draft-only posts.
- Blocks automatic refresh of already-published articles and marks imports as requiring legal review.

**[HIGH] Locked first family-law cluster architecture**
- Files: `project-control/family-law-content-cluster-map.md`, `project-control/internal-link-opportunities.csv`, `project-control/cannibalization-map.csv`
- Documented the divorce pillar and five supporting pages as separate search intents.
- Added internal links from pillar to support pages, support pages to Maya Rotenberg, and cannibalization rules for mediation/agreement/support/custody/property topics.

**[MEDIUM] Added family-law drafts to inventory**
- Files: `project-control/content-inventory.csv`, `project-control/title-audit.csv`
- Added the first six repo-maintained family-law drafts with word counts, intent, duplicate-risk notes, and import/review actions.

**[HIGH] Expanded divorce-lawyer pillar draft**
- Files: `content-drafts/divorce-lawyer-pillar-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/task-board.csv`, `project-control/current-status.md`
- Expanded the flagship `/divorce-lawyer/` draft from about 1,963 words to about 5,067 words across two sequential passes.
- Added decision-path segmentation, process timeline, document checklist, common mistakes, lawyer-comparison guidance, Jus-Tice funnel logic, CMS module plan, and official-source anchors.
- Added rabbinical/ketubah, agreement, common-law separation, children, complex-assets, urgent-relief, lawyer content monetization, and expanded FAQ sections.
- Status remains NOT VERIFIED for legal accuracy and not ready to publish.

**[HIGH] Added divorce pillar source audit**
- Files: `project-control/divorce-pillar-source-audit.csv`, `content-drafts/divorce-lawyer-pillar-he.md`, `project-control/current-status.md`, `project-control/task-board.csv`
- Mapped sensitive sections to official gov.il/Kol Zchut source candidates or explicit legal-review blockers.
- Updated the draft header to `PRODUCTION_DRAFT_V3_5000_WORD_CLASS`.

**[HIGH] Expanded consensual-divorce supporting draft**
- Files: `content-drafts/consensual-divorce-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Expanded `/consensual-divorce/` from about 1,208 words to about 3,507 words across two sequential passes.
- Added agreement-quality checks, agreement structure, approval workflow, cost caution, children/risk sections, CRM intent, CMS module plan, common mistakes and a LegalTech readiness-tool concept tied to lawyer mini-sites.
- Status remains NOT VERIFIED for legal accuracy and not ready to publish.

**[HIGH] Added consensual-divorce source audit**
- Files: `project-control/consensual-divorce-source-audit.csv`, `content-drafts/consensual-divorce-supporting-he.md`, `project-control/current-status.md`, `project-control/task-board.csv`
- Mapped agreement-divorce claims to official gov.il/Kol Zchut source candidates or explicit legal-review blockers.
- Kept price, children, property and pressure/violence sections blocked from publication until source/legal review.

**[HIGH] Expanded divorce-mediation supporting draft**
- Files: `content-drafts/divorce-mediation-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Expanded `/divorce-mediation/` from about 1,256 words to about 3,507 words across two sequential passes.
- Added suitability test, mediation models, preparation checklist, failure paths, power-imbalance warnings, children section, legal-advice boundary, pricing caution, anti-cannibalization, CMS layout and LegalTech questionnaire concept.
- Status remains NOT VERIFIED for legal accuracy and not ready to publish.

**[HIGH] Added divorce-mediation source audit**
- Files: `project-control/divorce-mediation-source-audit.csv`, `content-drafts/divorce-mediation-supporting-he.md`, `project-control/current-status.md`, `project-control/task-board.csv`
- Mapped mediation procedure, price and failure-path claims to gov.il/Midrag source candidates.
- Kept confidentiality, mediator-role and power-imbalance sections blocked for lawyer review.

**[HIGH] Expanded child-support supporting draft**
- Files: `content-drafts/child-support-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Expanded `/child-support/` from about 1,179 words to about 5,019 words across multiple sequential passes.
- Added no-fake-calculator policy, intake model, medor, exceptional expenses, time-sharing, variable-income, agreement-clause, temporary-support, age-band, proof/evidence, modification, unmarried-parent, anti-cannibalization, cautious examples, FAQ, enforcement-caution, CMS-structure, CRM-routing, decision-path and LegalTech-tool guardrail sections.
- Status remains NOT VERIFIED for legal accuracy and not ready to publish.

**[HIGH] Added child-support source audit**
- Files: `project-control/child-support-source-audit.csv`, `content-drafts/child-support-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Mapped child-support procedure, National Insurance payment/collection rules, change-of-support guidance, 919/15, calculator policy, medor, age-band and time-sharing claims to source candidates or legal-review blockers.
- Direct checks returned 200 for tested BTL/Kol Zchut URLs; gov.il service URLs returned 403 in scripted checks and require browser verification.

**[HIGH] Expanded child-custody supporting draft**
- Files: `content-drafts/child-custody-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Expanded `/child-custody/` from about 1,222 words to about 4,575 words across three sequential passes.
- Added parenting schedule models, holidays, logistics, parent communication rules, risk situations, professional factors, relocation/school-change issues, age bands, temporary-vs-permanent arrangement cautions, breach/enforcement cautions, proof/evidence guidance, urgent situations, CRM intake fields, LegalTech parenting-plan concept, Maya mini-site modules, CMS layout, decision paths, agreement-structure guidance, success metrics, common mistakes and anti-cannibalization links.
- Status remains NOT VERIFIED for legal accuracy and not ready to publish.

**[HIGH] Added child-custody source audit**
- Files: `project-control/child-custody-source-audit.csv`, `content-drafts/child-custody-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Mapped custody/time-sharing procedure, family-dispute filing, dispute-resolution process, interim relief, assistance units, legal aid, social-work reports, terminology, child-wishes, parental alienation, risk/urgency and evidence guidance to source candidates or legal-review blockers.
- gov.il source candidates were search-verified; direct scripted checks returned 403 and require browser verification before publication.

**[HIGH] Expanded divorce-property-division supporting draft**
- Files: `content-drafts/divorce-property-division-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Expanded `/divorce-property-division/` from about 1,068 words to about 4,553 words across three sequential passes.
- Added asset map, rupture-date caution, prenuptial agreement review, premarital-home issues, inheritance/gifts, pension documentation, business/company/self-employed issues, tech options, family-vs-personal debts, hidden-asset warning signs, asset table, staged workflow, expert roles, home-sale alternatives, common mistakes, urgency detection, CRM intake fields, lawyer monetization modules, decision paths, publication gates, follow-up cluster plan, anti-cannibalization boundaries, LegalTech property-map concept and CMS structure.
- Status remains NOT VERIFIED for legal/financial accuracy and not ready to publish.

**[HIGH] Added property-division source audit**
- Files: `project-control/property-division-source-audit.csv`, `content-drafts/divorce-property-division-supporting-he.md`, `project-control/article-briefs-5000-word.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Mapped resource balancing, excluded assets, pension division, tax guidance, family-dispute procedure, interim relief, rupture date, premarital home, intent to share, agreements, inheritances/gifts, business/options, debts and hidden-assets warnings to source candidates or legal-review blockers.
- Kol Zchut source candidates returned HTTP 200; gov.il source candidates were search-verified but require browser verification because scripted checks returned 403.

**[HIGH] Added family-law publication readiness tracking**
- Files: `project-control/family-law-content-cluster-map.md`, `project-control/family-law-publication-readiness.csv`, `project-control/content-inventory.csv`, `project-control/current-status.md`, `project-control/task-board.csv`
- Updated the family-law cluster map with current word counts, source-audit files, publication blockers and draft-only import order.
- Added a CSV readiness tracker for all six first-cluster drafts, including CMS module requirements and exact next actions.
- Status remains BLOCKED for publication until legal review, browser source verification and live CMS draft import are completed.

**[HIGH] Upgraded content draft importer readiness metadata**
- Files: `inc/content-draft-importer.php`, `content-drafts/*.md`, `project-control/*.csv`, `project-control/current-status.md`, `project-control/changelog.md`, `project-control/task-board.csv`
- Admin importer now displays import-result notices, draft status, word count and source-audit file for each repo draft.
- Imported article drafts now receive metadata for repo draft status, word count, source audit, browser-source-verification requirement, connected lawyer, cluster and primary keyword.
- Added explicit source-audit lines to the first three family-law drafts so all six first-cluster drafts expose their audit files to the importer.

**[MEDIUM] Added bulk draft import action**
- Files: `inc/content-draft-importer.php`, `project-control/current-status.md`, `project-control/changelog.md`, `project-control/task-board.csv`
- Added an admin-only `Import all repo drafts as drafts` action to `Tools > Jus-Tice Content Drafts`.
- Bulk import preserves draft-only behavior and still blocks refresh of already-published articles.
- Status is NOT VERIFIED live until Upress pulls the commit and the wp-admin importer screen is tested.

**[MEDIUM] Added article admin review columns**
- Files: `inc/content-draft-importer.php`, `project-control/current-status.md`, `project-control/changelog.md`, `project-control/task-board.csv`
- Added `Repo Draft`, `Review Gates`, and `Words` columns to the `articles` admin list.
- Imported drafts now surface source file/status, legal/source verification blockers, source-audit file and draft word count without opening each article.
- Status is NOT VERIFIED live until the Articles admin list is checked after import.

**[HIGH] Wired single article pages to imported draft metadata**
- Files: `single-articles.php`, `project-control/current-status.md`, `project-control/changelog.md`, `project-control/task-board.csv`
- Single article pages now display legal/source review status and source-audit file when imported draft metadata says review is still required.
- Sidebar now uses `connected_lawyer_slug` to show the connected lawyer mini-site CTA, with Maya Rotenberg expected for the family-law cluster.
- Removed emoji-style date/reading-time symbols from the single article header.
- Status is NOT VERIFIED live until drafts are imported and article pages are visually checked.

**[MEDIUM] Rechecked live header**
- Files: `project-control/visual-qa-report.md`, `project-control/current-status.md`, `project-control/visual-evidence/homepage-header-recheck.json`
- Verified public homepage includes the code wordmark and new LegalTech/lawyer-registration links.
- Confirmed dummy logo text is not present.

**[MEDIUM] Cleaned search/archive navigation labels**
- Files: `search.php`, `archive-articles.php`, `archive-justice_lawyer.php`
- Converted remaining search and pagination UI labels to clean Hebrew.
- Removed mojibake arrow strings from archive pagination.

### DOCUMENTED

**[HIGH] Corrected content production standard**
- Files: `project-control/pillar-content-production-system.md`, `project-control/article-briefs-5000-word.csv`, `project-control/logo-audit.md`, `project-control/current-status.md`, `project-control/next-actions.md`
- Current seeded article starters are now explicitly marked as scaffolds only.
- Production direction is 5,000-word-class, SERP-driven, reviewed legal content connected to Maya Rotenberg, internal links, lead forms, tools, and pillar/supporting architecture.
- Added the first long-form production draft at `content-drafts/divorce-lawyer-pillar-he.md`.
- Added the first supporting family-law draft at `content-drafts/consensual-divorce-supporting-he.md`.
- Added the second supporting family-law draft at `content-drafts/divorce-mediation-supporting-he.md`.
- Added the third supporting family-law draft at `content-drafts/child-support-supporting-he.md`.
- Added the fourth supporting family-law draft at `content-drafts/child-custody-supporting-he.md`.
- Added the fifth supporting family-law draft at `content-drafts/divorce-property-division-supporting-he.md`.
- Updated visual QA with live homepage screenshots and findings.

### NOT VERIFIED

- PHP lint could not run locally because PHP is not available in this shell.
- Live rendering is not verified until GitHub/Upress pulls the repo and cache is refreshed.
- Live screenshot shows the latest repo wordmark is not present yet, so Upress pull/cache remains unverified.

## 2026-05-09 - Session: repo-sync stabilization

### SEO GOALS

**[HIGH] Rebuilt topic clusters around English pillar URLs**
- Files: `project-control/topic-clusters.csv`, `project-control/internal-link-opportunities.csv`, `project-control/cannibalization-map.csv`, `project-control/keyword-serp-plan.md`, `project-control/serp-research-log.csv`, `project-control/title-audit.csv`
- Pillars now use clean English slugs such as `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, and `/medical-malpractice-lawyer/`.
- Added first SERP research log and mapped supporting content, lawyer filters, and LegalTech CTAs.

**[HIGH] Added reusable legal pillar page template**
- Files: `page-legal-pillar.php`, `assets/css/premium-pass-3.css`
- Template supports Hebrew pillar content with English slug pages, lawyer cards, supporting topic links, related article cards, LegalTech CTA, and lead form.
- Does not create or publish pages by itself.

**[HIGH] Added CMS controls and draft seeding for legal pillars**
- Files: `inc/pillar-pages.php`, `functions.php`
- Adds editable page fields for pillar keyword, cluster, summary, practice-area slug, LegalTech CTA URL, and supporting topic links.
- Seeds draft pages for `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, and `/medical-malpractice-lawyer/` on admin visit.
- Drafts are not public until reviewed and published.

**[HIGH] Added draft-only starter seeding for first five SEO articles**
- Files: `inc/pillar-article-seed.php`, `functions.php`
- Seeds draft `articles` records for divorce, criminal, traffic, real-estate and labor-law guide starters when the `articles` CPT is active.
- Each draft uses an English slug, Hebrew starter content, practice-area assignment, target pillar URL metadata, and `needs_legal_review = 1`.
- These are scaffolds only; they must be expanded, sourced and reviewed before publication.

**[HIGH] Upgraded practice-area archives into hub pages**
- Files: `taxonomy-practice-areas.php`, `assets/css/premium-pass-3.css`
- Practice pages now show a stronger hero, related lawyer cards, article cards, LegalTech tools, and sibling practice links.
- This moves category pages toward SEO/commercial hubs instead of thin article archives.

**[CRITICAL] Added lawyer self-registration funnel**
- Files: `page-lawyer-registration.php`, `inc/lawyer-onboarding.php`, `functions.php`, `assets/css/premium-pass-3.css`
- `/lawyer-registration/` can be seeded as a public page after admin visit.
- Submitted lawyers become draft `justice_lawyer` profiles with `pending` verification/status and `source_type=registration`.
- No lawyer profile is auto-published.

**[HIGH] Documented lawyer onboarding workflow**
- File: `project-control/lawyer-onboarding-workflow.md`
- Defines review, verification, publishing, paid-plan and anti-fake-claim rules for incoming lawyer submissions.

**[HIGH] Added pending-lawyer admin review queue**
- File: `inc/lawyer-onboarding.php`
- New lawyer submissions now send an admin email notification.
- Added a `Lawyer Onboarding` admin page that lists pending self-registration drafts and links directly to review/edit.

**[HIGH] Added front-end lawyer dashboard MVP**
- Files: `page-lawyer-dashboard.php`, `inc/lawyer-dashboard.php`, `inc/lawyer-onboarding.php`, `functions.php`, `assets/css/premium-pass-3.css`
- Adds `/lawyer-dashboard/` as a login-gated personal area for linked lawyers.
- Shows linked profiles, profile completeness, plan/subscription/verification status, assigned leads, and mini-site improvement tasks.
- New self-registration submissions now store `claimed_by_user_id` when the lawyer is logged in.
- Editing, payment and AI Console remain planned modules, not live promises.

**[HIGH] Added safe lawyer plans and WooCommerce mapping layer**
- Files: `page-lawyer-plans.php`, `inc/lawyer-plans.php`, `page-lawyer-dashboard.php`, `functions.php`, `assets/css/premium-pass-3.css`, `project-control/payment-subscription-architecture.md`
- Adds `/lawyer-plans/` with the five commercial plan types already used by lawyer profile metadata.
- Adds helper logic to route to WooCommerce checkout only when WooCommerce exists and a product ID is mapped.
- Falls back to lawyer registration with plan interest when live billing is not configured.
- Documents why payments stay disabled until product, gateway, tax/invoice and lawyer-advertising compliance checks are complete.

**[HIGH] Added rule-based lead intake classification**
- Files: `inc/lead-classifier.php`, `inc/lead-crm.php`, `functions.php`, `project-control/lead-ai-classification.md`
- New and edited `justice_lead` records receive detected legal area, urgency, summary and routing notes.
- The CRM now displays the detected area when available.
- This is an operational routing layer only; it does not provide legal advice and still requires human review.

**[HIGH] Added GSC weekly report automation scaffold**
- Files: `.github/workflows/gsc-weekly-report.yml`, `tools/gsc_weekly_report.py`, `project-control/gsc-weekly-report-automation.md`
- Workflow runs manually or weekly and uploads GSC opportunity CSVs as artifacts.
- Reports cover opportunities, low CTR, positions 5-20 and cannibalization candidates.
- Real output is blocked until Search Console service-account access and GitHub secrets are configured.
- Local smoke test without secrets generated placeholder CSVs marked blocked, confirming the script does not fabricate GSC data.

**[HIGH] Added city-practice SEO architecture**
- Files: `inc/taxonomy-seed.php`, `inc/city-practice-pages.php`, `page-city-practice.php`, `assets/css/premium-pass-3.css`, `project-control/city-practice-strategy.md`
- Adds admin-only seeding for 20 core Israeli city terms with English slugs.
- Adds five draft city-practice landing pages with English slugs.
- Adds a dedicated template that connects city/practice content to filtered lawyer listings.
- Pages are intentionally drafts to avoid thin doorway publishing.

**[HIGH] Upgraded public lead form for CRM routing**
- Files: `template-parts/forms/lead-form.php`, `assets/css/premium-pass-3.css`
- Form now collects email, city/area, urgency and consent in addition to name, phone, legal area and message.
- These fields already map to the lead CPT handler and rule-based classifier.

**[MEDIUM] Connected lawyer monetization pages to footer**
- File: `template-parts/layout/site-footer.php`
- Footer no longer points lawyer joining to `/join/`; it points to `/lawyer-registration/`, `/lawyer-plans/`, and `/lawyer-dashboard/`.

**[HIGH] Added owner CRM overview**
- Files: `inc/lead-crm.php`, `functions.php`
- Adds a `Justice CRM` admin page with lead status cards, recent legal leads, and recent LegalTech requests.
- Provides direct links to open lead/request records for follow-up.

**[HIGH] Added core practice-area term seeder**
- Files: `inc/taxonomy-seed.php`, `functions.php`, `project-control/next-actions.md`
- Seeds 10 core Hebrew practice-area terms with clean English slugs such as `family-law`, `criminal-law`, `real-estate-law`, and `medical-malpractice`.
- Runs only in admin and only when `practice-areas` taxonomy exists.

**[MEDIUM] Wired bundled logo as header/footer fallback**
- Files: `template-parts/layout/site-header.php`, `template-parts/layout/site-footer.php`, `assets/css/premium-pass-3.css`, `project-control/logo-audit.md`
- If no WordPress custom logo is configured, the theme now renders `assets/images/logo.png` instead of only a text lockup.

**[MEDIUM] Re-verified lawyer archive filter i18n**
- File: `archive-justice_lawyer.php`
- ACTION-012 is already satisfied in the repo: filter labels, options, placeholder and submit button are escaped and translation-ready.
- Live rendering still needs post-sync visual verification.

### URL STRATEGY

**[HIGH] Confirmed final English-slug strategy**
- Files: `project-control/decisions.md`, `project-control/url-strategy.md`, `project-control/slug-normalization-rules.md`, `project-control/url-migration-map.csv`, `project-control/url-slug-migration-plan.md`, `project-control/current-status.md`
- Final decision: Hebrew content and UI, short clean English slugs.
- Added initial migration map with major legal pillar/supporting URLs and the known live Maya Hebrew slug issue.
- Added `project-control/strategic-goals.md` and `project-control/url-hebrew-audit.csv`.
- No redirects or live URL changes were executed.

### LEGALTECH PLATFORM

**[HIGH] Added first LegalTech tools and intake foundation**
- Files: `template-parts/sections/legaltech-tools.php`, `archive-justice_legal_tool.php`, `single-justice_legal_tool.php`, `assets/css/premium-pass-3.css`
- Homepage now has a product-style LegalTech gateway for AI intake, documents, lawyer review and real-estate contract review.
- Public `/legal-tools/` archive and individual tool pages now have dedicated templates with intake CTAs.

**[HIGH] Added CMS content types for legal tools and tool requests**
- Files: `justice-core/includes/cpt-legal-tools.php`, `ultra-justice-engine/includes/cpt-legal-tools.php`, `ultra-justice/includes/cpt-legal-tools.php`
- Added public `justice_legal_tool` posts and private `justice_legal_request` admin records.
- Added starter seeding for four MVP tools after admin login.
- Added a basic form handler that stores LegalTech requests in WordPress admin.

**[HIGH] Documented broader LegalTech monetization roadmap**
- File: `project-control/legaltech-platform-roadmap.md`
- Captures the move beyond pure lawyers into document automation, legal simulation, real-estate workflows, lawyer-in-the-loop review, and self-serve paid products.

### DEPLOYMENT MODEL

**[VERIFIED] Switched to repo-sync workflow**
- User clarified that the theme syncs through GitHub to live WordPress.
- No ZIP/theme package workflow should be used unless explicitly requested.
- Failed zero-byte package artifact from the interrupted attempt was removed before this session continued.

### FIXES

**[HIGH] Added CMS-wired lawyer mini-site fields**
- Files: `single-justice_lawyer.php`, `justice-core/includes/cpt-lawyers.php`, `ultra-justice-engine/includes/cpt-lawyers.php`, `ultra-justice/includes/cpt-lawyers.php`, `assets/css/premium-pass-3.css`
- The lawyer mini-site now reads editable CMS fields for hero text, approach, services, process, credentials, media links, FAQs, testimonials and final CTA.
- Sections only render when real CMS content exists.

**[HIGH] Added editable homepage content band**
- Files: `template-parts/sections/home-page-content.php`, `page-home.php`, `front-page.php`
- The WordPress homepage editor can now control a safe content section inside the homepage template.
- A basic casino/gambling keyword guard prevents known spam categories from rendering in that band.

**[HIGH] Documented zero-founder-effort platform model**
- File: `project-control/self-serve-lawyer-platform-plan.md`
- Added the self-serve lawyer signup, AI console, billing, profile builder, content approval and compliant outreach strategy.

**[CRITICAL] Added the live homepage template path**
- File: `page-home.php`
- Live HTML showed body class `page-template-page-home`, meaning WordPress is using the page template `page-home.php`.
- The repo previously had `front-page.php` but not `page-home.php`, so homepage changes could miss the actual live template assignment.
- `page-home.php` now loads the same premium homepage sections, including `featured-lawyers`.

**[HIGH] Corrected lawyer taxonomy ownership in plugin code**
- Files: `ultra-justice-engine/includes/taxonomy-city.php`, `ultra-justice-engine/includes/taxonomy-practice-areas.php`, `ultra-justice/includes/taxonomy-city.php`, `ultra-justice/includes/taxonomy-practice-areas.php`
- `city` taxonomy now attaches to `justice_lawyer`.
- `practice-areas` taxonomy now attaches to `articles`, `justice_lawyer`, and `post`.

**[HIGH] Made demo seeding safer**
- Files: `justice-core/includes/seeder.php`, `ultra-justice-engine/includes/seeder.php`, `ultra-justice/includes/seeder.php`
- Future seeded lawyer profiles are draft, free-plan, unverified, and marked internally as testing-only.
- Hardened the seeder again so test profiles are inactive, not lead-routed, not featured on the homepage, use `SEED_DATA` as source marker, and align several seed practice slugs with the canonical taxonomy seed (`real-estate-law`, `inheritance-law`, `torts`).

**[MEDIUM] Fixed lawyer archive invalid markup**
- File: `archive-justice_lawyer.php`
- Removed duplicate `</main>`; `footer.php` owns closing the main element.

**[LOW] Fixed one remaining English lead-form label**
- File: `template-parts/forms/lead-form.php`
- Changed "Short description" to Hebrew.

**[HIGH] Fixed breadcrumb duplication and hierarchy**
- Files: `single.php`, `inc/breadcrumbs.php`
- `single.php` no longer prints a second breadcrumb trail after `header.php`.
- Breadcrumbs now explicitly support article archive, article singles, lawyer archive, lawyer singles, and practice-area taxonomy pages.

**[HIGH] Documented English-only slug policy**
- Files: `project-control/url-slug-migration-plan.md`, `project-control/url-slug-map.csv`
- Rule added: visible Hebrew content stays Hebrew, but public slugs/URLs must be English ASCII only.
- Migration is blocked until live URL inventory and redirect mapping exist.

**[HIGH] Built richer lawyer mini-site template**
- Files: `single-justice_lawyer.php`, `assets/css/premium-pass-3.css`
- Added profile hero, premium visual layer, CTAs, proof blocks, video support, practice areas, related article area, review placeholder, social links, and lead form.
- Reviews and verification badges are conservative: no fake ratings or false "top lawyer" claims.

**[HIGH] Upgraded homepage lawyer card and featured section**
- Files: `template-parts/cards/lawyer-card.php`, `template-parts/sections/featured-lawyers.php`, `assets/css/premium-pass-3.css`
- Homepage only targets Maya Rotenberg as the verified client.
- Added fallback lookup by Hebrew title because the live site currently still has a Hebrew slug.
- Card now presents richer profile value while avoiding unverified ranking claims.

**[HIGH] Added lawyer mini-site admin fields**
- Files: `justice-core/includes/cpt-lawyers.php`, `ultra-justice-engine/includes/cpt-lawyers.php`, `ultra-justice/includes/cpt-lawyers.php`
- Admin can now enter profile video URL, social URLs, homepage feature flag, approved review count, and approved average rating.

**[HIGH] Prevented future seeded Hebrew lawyer slugs**
- Files: `justice-core/includes/seeder.php`, `ultra-justice-engine/includes/seeder.php`, `ultra-justice/includes/seeder.php`
- Maya seed/profile is assigned `advocate-maya-rotenberg`.
- Other future seed profiles receive generated English-only slugs.

**[VERIFIED LIVE] Browser observations**
- Home page responds and no obvious casino/gambling terms appeared in DOM snapshot.
- `/lawyers/` responds and includes Maya Rotenberg plus multiple demo lawyers.
- `/lawyers/advocate-maya-rotenberg/` redirects to homepage at the time of verification, so the live slug migration is still NOT VERIFIED / STILL BROKEN.

### ARCHITECTURE / DOCS

**[IN PROGRESS] Added canonical Justice Core candidate**
- Folder: `justice-core/`
- Purpose: source candidate for the documented canonical plugin path `justice-core/justice-core.php`.
- NOT VERIFIED live. Legacy plugin folders remain until active live plugin path is known.

**[VERIFIED] Added missing project-control files**
- Added current status, decisions, blockers, risks, competitor element analysis, CMS/menu/logo/media audits, lawyer-system audit, visual QA trackers, spam candidates template, category audit template, and package-validation note.

### VERIFICATION

**NOT VERIFIED**
- PHP lint: PHP CLI is unavailable in this local environment.
- Live plugin activation path.
- Live WP/PHP versions.
- Live debug log.
- Browser/mobile visual QA.

---

## 2026-05-09 — Session: claude/justice-website-review-aovSK

### BUGS FIXED

**[CRITICAL] Removed duplicate `<main>` tag from `single-justice_lawyer.php`**  
- File: `single-justice_lawyer.php`  
- Problem: Template opened its own `<main id="primary">` INSIDE header.php's existing `<main>`. Resulted in nested `<main>` (invalid HTML) and duplicate `id="primary"`.  
- Fix: Removed the duplicate `<main>` open and `</main>` close from the template.

**[CRITICAL] Removed duplicate `<main>` tag from `archive-justice_lawyer.php`**  
- File: `archive-justice_lawyer.php`  
- Same issue as above. Fixed.

**[HIGH] Fixed lawyer meta key mismatch in `lawyer-card.php`**  
- File: `template-parts/cards/lawyer-card.php`  
- Problem: Card used `_justice_firm_name`, `_justice_phone`, `_justice_years_experience`, `_justice_plan_type` (prefixed, wrong)  
- Fix: Changed to `firm_name`, `phone`, `years_experience`, `plan_type` (matching `single-justice_lawyer.php`)

**[HIGH] Fixed `is_paid` plan type mismatch in `lawyer-card.php`**  
- File: `template-parts/cards/lawyer-card.php`  
- Problem: Card checked for plans `'basic', 'premium', 'elite'` — none of which match the canonical plans in `single-justice_lawyer.php`  
- Fix: Changed to canonical plan names: `'pro', 'featured', 'lead_partner', 'full_service'`

**[HIGH] Fixed CPT name in `featured-lawyers.php`**  
- File: `template-parts/sections/featured-lawyers.php`  
- Problem: Used old `'lawyer'` CPT slug instead of `'justice_lawyer'` — featured section would always be empty  
- Fix: Changed to `'justice_lawyer'` and updated meta key from `_justice_featured` to `featured_until` date logic

**[MEDIUM] Added missing CSS custom properties**  
- File: `assets/css/main.css`  
- Problem: `--color-navy-100`, `--color-navy-400`, `--color-navy-600` were used throughout but not defined in `:root`  
- Fix: Added to `:root` — navy-100: `#e8edf5`, navy-400: `#4a6fa5`, navy-600: `#1d3a6b`

### HEBREW / UI FIXES

**[HIGH] Converted all English strings to Hebrew — `single-articles.php`**  
- "Need legal help?" → "צריכים עזרה משפטית?"
- "Send a short inquiry..." → "שלחו פנייה קצרה ונסייע..."
- "Editorial note" → "הערת מערכת"
- "This guide is intended as general legal information..." → Hebrew equivalent
- "Updated: %s" → "עודכן: %s"

**[HIGH] Converted English strings — `archive-articles.php`**  
- "Legal library" → "ספריית מאמרים משפטיים"
- "Browse legal guides..." → Hebrew
- "Previous" / "Next" → "→ הקודם" / "הבא ←"

**[MEDIUM] Converted English strings — `archive.php`**  
- "Previous" / "Next" → Hebrew pagination

**[HIGH] Converted English strings — `taxonomy-practice-areas.php`**  
- "Practice area" eyebrow → "תחום משפטי"
- "Get legal direction" CTA → "מצאו עורך דין בתחום זה"
- "Previous" / "Next" → Hebrew pagination

**[HIGH] Converted English string — `inc/template-tags.php`**  
- `justice_theme_reading_time()`: "%d min read" → "%d דקת/דקות קריאה"

**[MEDIUM] Converted English strings — `inc/breadcrumbs.php`**  
- "Breadcrumbs" aria-label → "שביל ניווט"
- "Search results for: %s" → "תוצאות חיפוש: %s"

**[LOW] Converted English strings — `inc/lead-ui.php` Customizer**  
- "Contact Information" section title → "פרטי יצירת קשר"
- "Phone Number" label → "מספר טלפון"
- "Email" label → "דואר אלקטרוני"

### DESIGN IMPROVEMENTS

**[MEDIUM] Replaced emoji icons with inline SVG in `featured-pillars.php`**  
- ⚖️🛡️🚗🏠💼📜 → proper legal-themed SVG icons
- Updated pillar icon CSS to circular container background

**[MEDIUM] Replaced emoji placeholder in `lawyer-card.php`**  
- `⚖️` placeholder → person silhouette SVG
- `📍` location pin → location SVG

**[LOW] Replaced emoji in `featured-lawyers.php` empty state**  
- `⚖️` → person SVG

**[LOW] Replaced emoji in `archive-justice_lawyer.php` empty state**  
- `⚖️` → person SVG

**[LOW] Updated CSS for directory/featured empty state icons**  
- Changed from `font-size` emoji sizing to proper `width/height` SVG container sizing

### DOCUMENTATION CREATED

- `project-control/expert-audit.md` — comprehensive technical/design/SEO/business audit
- `project-control/competitor-research.md` — Din, PsakDin, Justia, Midrag comparison
- `project-control/current-site-state.md` — verified theme state, template hierarchy, known issues
- `project-control/plugin-registry.md` — canonical plugin architecture + duplicate detection guide
- `project-control/wordpress-plugin-theme-manual.md` — complete WP engineering reference
- `project-control/spam-investigation.md` — casino/spam content investigation plan
- `project-control/content-inventory.csv` — content audit template with examples
- `project-control/cannibalization-map.csv` — duplicate/competing content template
- `project-control/topic-clusters.csv` — 10 content clusters with pillar keywords
- `project-control/internal-link-opportunities.csv` — internal link audit template
- `project-control/strategic-roadmap.md` — 30/60/90 day roadmap
- `project-control/demo-readiness.md` — demo prerequisites checklist
- `project-control/next-actions.md` — prioritized action list for next sessions
- `project-control/changelog.md` — this file

## 2026-05-10 Lead/SEO Live Recheck
- VERIFIED: Public homepage and `/lawyers/?area=family-law` returned HTTP 200.
- VERIFIED: Canonical output is present live.
- NOT VERIFIED: The public homepage did not show the `admin-post.php`/`justice_submit_lead` ask-lawyer wiring from commit `e511c00`.
- NOT VERIFIED: The filtered lawyer directory did not show `noindex`, so robots hardening from commit `e511c00` is not confirmed live.
- BLOCKED: Latest repo changes may still need Upress pull/cache refresh or direct WordPress file inspection.

## 2026-05-10 Customer-Facing Claude/Opus Response Pass
- CREATED: `project-control/claude-opus-review-response.md`.
- CREATED: `project-control/logo-and-favicon-status.md`, `menu-live-status.md`, `breadcrumbs-fix-report.md`, `customer-facing-qa.md`, `gsc-connection-plan.md`, `user-intent-language-analysis.md`.
- UPDATED: `project-control/frontend-cms-map.md` with detailed CMS wiring status for visible components.
- VERIFIED LIVE: homepage, articles archive, single article, lawyer archive, divorce pillar and fake 404 URL were checked with public screenshots.
- FIXED IN CODE: fallback favicon, stronger homepage/article/archive copy, primary-menu augmentation, breadcrumb CSS/RTL, article intent panel, safer lawyer-card sponsored badge logic and common city-label cleanup.
- VERIFIED: PHP lint passed locally for 120 PHP files.
- NOT LIVE YET: post-push public recheck did not find the new hero copy, fallback favicon, appended-menu marker or article intent panel. uPress pull/cache verification is required.
- STILL BROKEN LIVE: fake 404 URL returns the homepage with HTTP 200; requires wp-admin/uPress routing investigation.

## 2026-05-10 Maya Mini-Site CMS Bootstrap
- FIXED IN CODE: Added a narrow `inc/live-migrations.php` bootstrap for Advocate Maya Rotenberg's mini-site fields.
- The migration fills empty CMS fields for headline, subheadline, services, process, approach, FAQs, CTA and credentials-style notes.
- The migration does not overwrite future wp-admin edits and does not invent ratings, reviews, photos, bar number, awards or paid claims.
- CREATED: `project-control/maya-minisite-cms-status.md`.
- VERIFIED: PHP lint passed locally for 120 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and wp-admin profile review.

## 2026-05-10 Practice-Area Landing Page Intent Pass
- FIXED IN CODE: `taxonomy-practice-areas.php` now adds customer intent cards for the legal problem, when to contact a lawyer and what to prepare before contacting.
- FIXED IN CODE: Added a premium practice-area CTA panel that connects each practice hub to the lead form and filtered lawyer directory.
- FIXED IN CODE: Added responsive styling for the new practice hub cards and CTA in `assets/css/premium-pass-3.css`.
- VERIFIED: PHP lint passed locally for 120 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and a public visual check of one active practice-area taxonomy URL.

## 2026-05-10 Live Deployment Recheck and Filter SEO Hardening
- LIVE VERIFIED: homepage hero copy from the customer-facing pass is visible publicly.
- LIVE VERIFIED: the single-article `article-intent-panel` is visible publicly.
- STILL BROKEN LIVE: `/practice-areas/family-law/` redirects to `/family-law/` and does not expose the new practice intent/CTA sections.
- STILL BROKEN LIVE: `/lawyers/?area=family-law` still exposes `index` in robots output.
- FIXED IN CODE: `inc/seo.php` now detects filtered lawyer-directory states even when live WordPress serves `/lawyers/` through a page-style route.
- FIXED IN CODE: added common SEO-plugin robots/canonical filters plus a fallback noindex meta tag for filtered lawyer-directory URLs.
- VERIFIED: PHP lint passed locally for 120 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and a recheck of `/lawyers/?area=family-law`.

## 2026-05-10 English Practice Page Route Fallback
- FIXED IN CODE: Added `inc/practice-landing.php` with controlled configuration for English practice slugs.
- FIXED IN CODE: Generic `page.php` now renders a structured practice landing template when a public page slug matches a controlled practice route such as `/family-law/`.
- FIXED IN CODE: Added `template-parts/content/practice-landing-page.php` with hero, intent cards, supporting-topic links, related articles, lead form and Maya Rotenberg family-law card when resolvable.
- FIXED IN CODE: Added small CSS support for route-based practice landing pages.
- VERIFIED: PHP lint passed locally for 122 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and public visual check of `/family-law/`.

## 2026-05-10 Live Practice/SEO Recheck and Maya Loop Guard
- LIVE VERIFIED: `/family-law/` exposes the practice intent layer publicly.
- LIVE VERIFIED: `/lawyers/?area=family-law` exposes Jus-Tice fallback `noindex,follow` and the base `/lawyers/` canonical.
- PROOF: screenshots saved at `project-control/visual-evidence/family-law-live-intent-2026-05-10.png` and `project-control/visual-evidence/lawyers-family-filter-2026-05-10.png`.
- STILL BROKEN LIVE: Maya profile URLs loop between Permalink Manager English-to-Hebrew redirects and theme Hebrew-to-English redirects.
- FIXED IN CODE: Disabled the theme-side Maya slug redirect by default behind `justice_theme_enable_maya_slug_redirect`.
- FIXED IN CODE: Added a lawyer mini-site engagement module for inquiry, signed content, media/video and verified reviews without fake claims.
- VERIFIED: PHP lint passed locally for 122 PHP files.
- NOT VERIFIED LIVE: Maya redirect-loop guard and mini-site engagement module require uPress pull/cache refresh.

## 2026-05-10 Unknown URL 404 Routing Guard
- LIVE VERIFIED BROKEN: `/not-a-real-page-justice-qa/` redirects to the homepage and returns HTTP 200 after redirect.
- FIXED IN CODE: Added `inc/routing-guards.php`.
- The guard only fires when WordPress is about to serve the front page for a non-root URL path.
- The guard removes canonical redirect for that request, marks the query as 404, sends a 404 status and uses the theme 404 template.
- VERIFIED: PHP lint passed locally for 123 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and a public recheck of the fake URL.

## 2026-05-10 Maya Public Source Layer
- FIXED IN CODE: Maya Rotenberg lawyer mini-site can now display a public-facing source/reference sidebox from CMS meta.
- FIXED IN CODE: Added a separate source-only live migration that fills Maya source fields only when empty and can run after the original mini-site bootstrap.
- DOCUMENTED: `project-control/maya-rotenberg-public-source-audit.md` records the official site, about page, Dun's 100, Psakdin, Easy and press-page sources.
- SAFETY: no phone, WhatsApp, email, photo, awards, ratings, reviews, bar number or case-achievement claims are auto-filled.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and wp-admin/lawyer review.

## 2026-05-10 Deep-Dive Audit V2 Trust Gate
- DOCUMENTED: `project-control/deep-dive-audit-v2-response.md` classifies the V2 audit findings and next actions.
- FIXED IN CODE: Added `justice_theme_lawyer_profile_is_public_approved()` as a conservative public visibility gate for lawyer profiles.
- FIXED IN CODE: Lawyer archive now renders only public-approved profiles, preventing old seed/demo/testing profiles from appearing as real customer-facing listings.
- FIXED IN CODE: Single lawyer pages now return a 404 for unapproved/demo profiles while still allowing admins with edit permission to inspect them.
- FIXED IN CODE: Lawyer directory has explicit Hebrew meta description and OG tags to avoid "Archive" leaking into social/search previews.
- FIXED IN CODE: Lawyer-card city fallback maps `herzliya` to `הרצליה`.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and public recheck of `/lawyers/` and one old demo profile URL.

## 2026-05-10 Hebrew Fallback Template Cleanup
- FIXED IN CODE: `index.php` fallback pagination now uses Hebrew `הקודם` / `הבא`.
- FIXED IN CODE: `home.php` no longer shows `Blog`; it uses `מאמרים משפטיים`.
- FIXED IN CODE: `home.php` pagination now uses Hebrew `הקודם` / `הבא`.
- FIXED IN CODE: empty search/archive state now says `לא נמצאו תוצאות` with Hebrew guidance.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and a fallback/search page visual recheck.

## 2026-05-10 Content Audit + URL Migration Project Start
- MODE SHIFT: paused random article publishing/rewrite work and started a full content inventory, URL migration and SEO restructure project.
- CREATED: `project-control/content-audit-access-plan.md` documenting repo, public REST, wp-admin, Application Password, uPress, DB, GSC, WP All Export and local-script access states.
- CREATED: `project-control/content-restructure-execution-plan.md` with the export -> inventory -> quality audit -> cannibalization -> URL migration -> internal link -> approval -> CMS update workflow.
- CREATED: `project-control/ai-content-audit-workflow.md` with AI guardrails, prompts and approval gates.
- CREATED: `tools/content-audit/wp-rest-export.ps1` for safe read-only public WordPress REST export.
- CREATED: `tools/content-audit/build-audit-v1.ps1` for heuristic quality, URL, redirect, category, cluster and internal-link map generation.
- VERIFIED: public REST export completed with 1,220 public content rows and 1,707 internal links.
- CREATED/UPDATED EXPORTS: `project-control/content-master-inventory.csv`, `project-control/exports/all-content-export.csv`, `all-articles-export.csv`, `all-pages-export.csv`, `all-posts-export.csv`, `all-categories-export.csv`, `all-tags-export.csv`, `all-practice-areas-export.csv`, `all-cities-export.csv`, `all-taxonomies-export.csv`, `all-media-export.csv`, `all-internal-links-export.csv`, and `all-url-export.csv`.
- CREATED/UPDATED AUDIT MAPS: `project-control/content-quality-audit.csv`, `project-control/cannibalization-map.csv`, `project-control/url-migration-map.csv`, `project-control/redirect-map.csv`, `project-control/category-map.csv`, `project-control/topic-clusters.csv`, and `project-control/internal-link-map.csv`.
- CREATED: `project-control/sitemap-plan.md` and `project-control/robots-htaccess-review.md`.
- VERIFIED: first heuristic audit generated 1,220 quality rows, 1,220 URL rows, 1,160 planned redirect rows, 110 mapped terms, 11 cannibalization groups and 1,707 link rows.
- BLOCKED AT START OF AUDIT: GSC was initially unavailable before owner-approved sign-in/2FA. Menu REST export returned 401. DB/phpMyAdmin remains unavailable.
- SAFETY: no URLs were changed, no redirects were created, no content was deleted, and no live CMS writes were performed.

## 2026-05-10 Family-Law Public Cleaner v6
- FIXED IN CODE: Bumped the family-law editorial repair version to `v6` so live WordPress reruns repair after deployment.
- FIXED IN CODE: The cleaner now strips product/business/editorial-planning language from public article bodies, not only obvious labels like `NOT VERIFIED`.
- INTERNAL-ONLY examples now removed from public output include paid-lawyer product logic, lead monetization, owner strategy, CRM/CMS/GSC/LegalTech implementation notes, AI-internal routing, mini-site sales language and `Jus-Tice should` instructions.
- DOCUMENTED: `project-control/live-content-publication-status.md` and `project-control/publication-workflow.md`.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and public recheck of the seven family-law URLs.

## 2026-05-10 GSC Browser Cannibalization Pass 1
- VERIFIED: Google Search Console browser UI access works for the `https://jus-tice.co.il/` property after owner-approved sign-in/2FA.
- CREATED: `project-control/gsc-browser-workflow.md` documenting the browser-only GSC workflow, limitations and next keywords.
- CREATED: `project-control/gsc-cannibalization-method.md` documenting the query-to-page and page-to-query method for cannibalization, low CTR, position 5-20 and migration-risk review.
- CREATED: `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, and `project-control/gsc-content-priorities.csv`.
- VERIFIED: last-3-month GSC totals visible in browser were 482 clicks, 72.9K impressions, 0.7% CTR and average position 33.8.
- CHECKED: `עורך דין פלילי`, `דין פלילי`, `עורך דין גירושין`, `גישור גירושין`, and `עורך דין לענייני משפחה`.
- FOUND: the current high-value criminal/family queries are mostly associated with old Hebrew URLs, uploaded documents, homepage and scattered legacy content rather than clean English-slug pillar URLs.
- MIGRATION WARNING: the old Hebrew divorce-lawyer URL has 960 impressions for `עורך דין גירושין`; the old Hebrew criminal Tel Aviv URL has 267 impressions for `עורך דין פלילי`; neither should be changed before merge/redirect mapping is approved.
- BLOCKED: full GSC CSV/API export and 12-month comparison are still not available; the in-app browser could show the export menu but file download/export did not complete.
- SAFETY: no public content, URLs, redirects, sitemap settings or robots rules were changed from this GSC pass.

## 2026-05-10 GSC Browser Cannibalization Pass 2
- VERIFIED: Browser GSC review continued for `עורך דין מקרקעין`, `עורך דין רשלנות רפואית`, `עורך דין נזיקין`, and `עורך דין תעבורה`.
- UPDATED: `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-content-priorities.csv`, and `project-control/gsc-browser-workflow.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-pass-2-traffic-law-2026-05-10.png`.
- FOUND: `עורך דין מקרקעין` has 153 impressions, 0 clicks and average position 15.8; the visible Pages tab maps 136 impressions to the homepage and 17 to `/real-estate-lawyer-cost-2025/`.
- FOUND: `עורך דין רשלנות רפואית` has 1.34K impressions, 0 clicks and average position 49.5; visible query variants are concentrated around birth, pregnancy and c-section malpractice.
- FOUND: the malpractice Pages tab exposed a narrow fee article as the visible URL, so this cluster needs deeper export/manual review before URL decisions.
- FOUND: `עורך דין נזיקין` and `עורך דין תעבורה` have low current volume in the checked filter, but both show weak-primary-page signals.
- SAFETY: no content was rewritten, no pages were published, no URLs changed and no redirects were created.

## 2026-05-10 GSC Page-To-Query Pass 1
- CREATED: `project-control/gsc-page-query-review.csv`.
- UPDATED: `project-control/gsc-browser-workflow.md` and `project-control/gsc-content-priorities.csv` with page-level findings.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-page-query-pdf-06102016-2026-05-10.png`.
- VERIFIED: `/real-estate-lawyer-cost-2025/` has 2 clicks, 3.85K impressions, 0.1% CTR and average position 50.1. Queries are mostly sale/purchase apartment lawyer cost/payment intent.
- VERIFIED: `06102016_1.pdf` has 99 clicks, 928 impressions, 10.7% CTR and average position 8.1. It ranks for Israel Securities Authority/personnel/contact queries and must not be removed blindly.
- VERIFIED: foreign-lawyer list PDFs for Greece and Italy have 1.39K and 1.35K impressions. They may be strategically off-focus, but they are real traffic assets and require owner/SEO review before noindex/delete/redirect decisions.
- PARTIAL: direct page filtering for the root homepage behaved like broad property data, and direct filtering for one Hebrew malpractice article URL did not return reliable data. These require UI/manual/API recheck later.
- SAFETY: no public content, URLs, redirects, sitemap settings or robots rules were changed.

## 2026-05-10 GSC Support Cluster Pass
- VERIFIED: Browser GSC review checked `קניית דירה`, `חוזה מכר`, `רשלנות רפואית בלידה`, `רשלנות רפואית בהריון`, `תאונת עבודה`, and `תאונת דרכים`.
- UPDATED: `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-content-priorities.csv`, `project-control/gsc-browser-workflow.md`, and `project-control/current-status.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-support-pass-car-accident-2026-05-10.png`.
- FOUND: `קניית דירה` has 885 impressions, 0 clicks and average position 71.2; `/real-estate-lawyer-cost-2025/` owns 871 impressions.
- FOUND: `חוזה מכר` has 31 impressions, all mapped to `/real-estate-lawyer-cost-2025/`, showing that `/real-estate-purchase-agreement/` is missing or too weak.
- FOUND: `רשלנות רפואית בלידה` has 661 impressions and old Hebrew URL `/עורך-דין-רשלנות-רפואית-בלידה-מומלץ/` owns all visible impressions.
- FOUND: `רשלנות רפואית בהריון` has 419 impressions and maps to the same birth-malpractice URL, showing overlap/cannibalization between birth and pregnancy malpractice intent.
- FOUND: `תאונת עבודה` returned no visible rows for this exact filter; variants should be checked before deciding priority.
- FOUND: `תאונת דרכים` has 84 impressions, mostly on `/car-accident-auto-injury-lawyer/`, which needs migration/primary-URL review before any slug change.
- SAFETY: no public content, URLs, redirects, sitemap settings or robots rules were changed.

## 2026-05-10 GSC Work / Traffic / Inheritance Variant Pass
- VERIFIED: Browser GSC review checked `עורך דין תאונת עבודה`, `פגיעה בעבודה`, `תאונת עבודה ביטוח לאומי`, `נהיגה בשכרות`, `שלילת רישיון`, `עורך דין ירושה`, `צוואה`, and `התנגדות לצוואה`.
- UPDATED: `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-content-priorities.csv`, `project-control/gsc-browser-workflow.md`, and `project-control/current-status.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-variants-pass-wills-2026-05-10.png`.
- FOUND: exact work-accident variants returned no visible rows, so work-accident content should not be prioritized from current GSC evidence alone.
- FOUND: `נהיגה בשכרות` has 8 impressions but maps to a will-revocation page, a wrong-page match and low-sample traffic content gap.
- FOUND: `שלילת רישיון` has 8 impressions at position 6.3 but maps to a Ministry of Health professional-license PDF, not traffic driver-license intent.
- FOUND: `צוואה` has 201 impressions split across old case-law pages, an old Hebrew wills/inheritance page, a DOCX, probate content and will-revocation content.
- FOUND: `התנגדות לצוואה` has 121 impressions, with 120 on the old case-law page about undue influence.
- SAFETY: no public content, URLs, redirects, sitemap settings or robots rules were changed.

## 2026-05-10 GSC Overloaded Page-To-Query Pass
- VERIFIED: Browser GSC page-to-query review reconfirmed `/real-estate-lawyer-cost-2025/` with 2 clicks, 3.85K impressions, 0.1% CTR and average position 50.1.
- VERIFIED: `/car-accident-auto-injury-lawyer/` has 0 clicks, 124 impressions and average position 57.5, mostly for fatal-accident/criminal-punishment queries.
- UPDATED: `project-control/gsc-page-query-review.csv`, `project-control/gsc-content-priorities.csv`, `project-control/gsc-browser-workflow.md`, and `project-control/current-status.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-page-query-car-accident-2026-05-10.png`.
- PARTIAL: direct page filters for Hebrew malpractice and inheritance URLs returned zero rows despite those URLs appearing in query-to-page checks. This was documented as a browser-filter limitation and not treated as a no-traffic conclusion.
- SAFETY: no public content, URLs, redirects, sitemap settings or robots rules were changed.

## 2026-05-10 Integrated SEO / Design / Content Layer
- CREATED: `project-control/homepage-seo-design-alignment.md`.
- CREATED: `project-control/related-content-strategy.md` and `project-control/related-content-map.csv`.
- CREATED: `project-control/kol-zchut-article-structure.md`.
- CREATED: `project-control/lawyer-mini-site-strategy.md` and `project-control/lawyer-mini-site-fields.csv`.
- CREATED: `project-control/lawyer-funnel-strategy.md` and `project-control/payment-and-subscription-model.md`.
- CREATED: `project-control/mobile-first-template-review.md`.
- CREATED: `project-control/accessibility-review.md`.
- CREATED: `project-control/entity-schema-review.md`.
- CREATED: `project-control/image-seo-review.md`.
- CREATED: `project-control/faceted-navigation-indexing-review.md`.
- CREATED: `project-control/analytics-monitoring-plan.md`.
- CREATED: `project-control/integrated-launch-checklist.md`.
- UPDATED: `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/daily-gsc-monitoring.md`, `project-control/sitemap-strategy.md`, `project-control/ga4-event-plan.csv`, `project-control/current-status.md`, `project-control/next-actions.md` and `project-control/task-board.csv`.
- ACCEPTED: content architecture decisions must now include design/template structure, related links, mobile, accessibility, schema, sitemap and analytics before any controlled launch batch.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, payments or live CMS settings were changed.

## 2026-05-10 Integrated Visual QA And Title Cleanup
- VERIFIED: Desktop and mobile visual QA captured for homepage, articles archive, one article, lawyer directory, sample lawyer profile URL, family practice page, search and 404 test.
- CREATED: `project-control/visual-evidence/integrated-visual-qa-2026-05-10.json`.
- CREATED: `project-control/visual-evidence/integrated-*-2026-05-10.png` screenshot set.
- UPDATED: `project-control/customer-facing-qa.md`, `mobile-first-template-review.md`, `accessibility-review.md`, `homepage-seo-design-alignment.md`, `visual-qa-report.md`, `current-status.md`, and `task-board.csv`.
- FIXED IN CODE: `inc/seo.php` now builds contextual Hebrew titles for homepage, articles archive, lawyers archive/page, search, practice-area taxonomy and lawyer profiles, and applies them through WordPress, Yoast, RankMath and AIOSEO title filters.
- UPDATED: `functions.php` deployment marker to `2026-05-10-contextual-title-v1` for live cache/pull verification.
- LIVE VERIFIED WEAK: live titles still showed `Articles Archive`, `עורכי דין Archive`, and `You searched for` before deployment of the code fix.
- LIVE VERIFIED BROKEN: sample lawyer-profile Hebrew URL and fake 404 URL both returned homepage-style content with status 200.
- NOT VERIFIED: PHP lint for the new title helper because local PHP is not installed.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, payments or live CMS settings were changed.

## 2026-05-10 uPress Pull, Semantic Related Live Check And Homepage Mobile CTA Cleanup
- PUSHED: `ffc08c8` moved the third-party mobile WhatsApp CTA above the bottom content rail for inner pages.
- PUSHED: `b7763b7` hides floating WhatsApp controls on the mobile homepage only, where the first viewport already has a guided form and CTAs.
- LIVE VERIFIED: uPress pull and cache clear were executed after deployment.
- LIVE VERIFIED: public `premium-pass-3.css` contains the homepage mobile hide rule and compact non-home WhatsApp button rule.
- LIVE VERIFIED: `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"`.
- VISUAL VERIFIED: `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png` shows the mobile homepage search/CTA area without floating-button overlap.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, CRM records, payments or database rows were changed.

## 2026-05-10 Lawyer Reviews / Reputation Module Strategy
- CREATED: `project-control/reviews-reputation-research.md`.
- CREATED: `project-control/google-reviews-integration-plan.md`.
- CREATED: `project-control/lawyer-rating-system-spec.md`.
- CREATED: `project-control/lawyer-review-fields.csv`.
- CREATED: `project-control/review-schema-policy.md`.
- CREATED: `project-control/review-compliance-risk.md` and pointer `reviews-compliance-risk.md`.
- CREATED: `project-control/reputation-product-roadmap.md`.
- CREATED: `project-control/maya-rotenberg-reputation-plan.md`.
- CREATED: `project-control/final-integrated-launch-checklist.md`.
- CREATED: `project-control/seo-aio-geo-strategy.md`.
- UPDATED: `project-control/lawyer-mini-site-strategy.md`, `project-control/payment-and-subscription-model.md`, `project-control/integrated-launch-checklist.md`, `project-control/current-status.md`, and `project-control/task-board.csv`.
- DECISION: recommended MVP is verified Google review link/Place ID/manual source summary plus profile completeness; no fake ratings, no review schema, no automated Google sync until approvals.
- SAFETY: no public reviews, ratings, schema, database updates, API calls, lawyer-card UI, URLs, redirects, sitemap settings or public content were changed.

## 2026-05-11 Lawyer Reviews / Reputation Deepening
- UPDATED: `project-control/reviews-reputation-research.md` with a deeper competitor/reputation-tool matrix and MVP/non-MVP boundaries.
- UPDATED: `project-control/google-reviews-integration-plan.md` with Business Profile API, Places API, manual MVP and third-party reputation-tool constraints.
- UPDATED: `project-control/review-compliance-risk.md` with no-review-gating, no-incentive, moderation and lawyer-reply gates.
- UPDATED: `project-control/lawyer-rating-system-spec.md` with public-label rules, review workflow, reputation-score boundary and future criminal-lawyer example.
- UPDATED: `project-control/reputation-product-roadmap.md`, `project-control/maya-rotenberg-reputation-plan.md`, `project-control/review-schema-policy.md`, `project-control/seo-aio-geo-strategy.md`, `project-control/payment-and-subscription-model.md`, `project-control/final-integrated-launch-checklist.md`, `project-control/current-status.md`, `project-control/next-actions.md` and `project-control/task-board.csv`.
- DECISION: keep the first launch source-disclosed and conservative; no fake reviews, no fake stars, no AggregateRating schema and no automated Google sync before approval.
- SAFETY: no public content, review UI, database rows, API calls, schema, URLs, redirects, sitemap settings or live CMS settings were changed.

## 2026-05-11 Inner-Page Mobile QA Fix
- LIVE VERIFIED BEFORE FIX: Playwright checked mobile `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/`.
- CREATED: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11.json` and first-pass screenshots.
- FOUND: `/family-law/` had horizontal overflow and duplicate WhatsApp controls on mobile; article, archive and lawyer directory passed horizontal-overflow checks.
- UPDATED: `assets/css/premium-pass-3.css` to clip mobile page overflow, constrain practice hub description/grid children, hide the duplicate theme WhatsApp bubble on non-home mobile pages, lower the remaining compact third-party contact button, and strengthen Pojo accessibility toolbar placement.
- UPDATED: `functions.php` deployment marker to `2026-05-11-mobile-inner-qa-v1`.
- CREATED: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json` and final local-CSS simulation screenshots.
- VERIFIED: final CSS simulation shows all four sampled pages pass horizontal-overflow and duplicate-WhatsApp checks.
- VERIFIED: `functions.php` passed PHP syntax check using the local cached PHP runtime from the owner-provided zip.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, database rows, CRM records or admin settings were changed.

## 2026-05-11 404 Plugin Deactivation Checklist And Verifier
- CREATED: `project-control/404-plugin-deactivation-checklist.md`.
- CREATED: `tools/check-404-routing.ps1`.
- VERIFIED: the checker runs locally and covers fake generated URLs, invalid post queries, homepage, `/articles/`, `/lawyers/`, `robots.txt`, and `sitemap_index.xml`.
- VERIFIED BASELINE: homepage, articles archive, lawyers archive, robots and sitemap checks pass.
- BLOCKED BASELINE: fake generated URLs and invalid `?p=99999999` still return `301 Location: https://jus-tice.co.il/`.
- LIVE DEPLOYMENT VERIFIED: Codex used the uPress Git panel directly and verified the uPress Git log at commit `0410d2f` for `Prepare 404 plugin deactivation checks`.
- DECISION: plugin deactivation remains an owner-approval action because it changes live WordPress plugin state.
- SAFETY: no live plugin state, URL, redirect rule, `.htaccess`, permalink setting, content body, taxonomy, canonical, sitemap, lawyer data, CRM data, review data or database row was changed.

## 2026-05-11 Live Justice Plugin Surface Review
- CREATED: `project-control/live-plugin-architecture-review.md`.
- CREATED: `tools/check-live-plugin-surface.ps1`.
- VERIFIED LIVE: `ultra-justice-engine/v1` is the public Justice REST namespace.
- VERIFIED LIVE: `justice-core/v1` and `ultra-justice/v1` return 404.
- VERIFIED LIVE: core CPTs `articles`, `justice_lawyer`, and `justice_lead` are exposed in `wp/v2/types`.
- NOT VERIFIED LIVE: `justice_legal_tool` and `justice_legal_request` are not exposed in the public type check.
- VERIFIED RISK: legacy CPTs remain exposed in `wp/v2/types`.
- VERIFIED UPRESS PLUGIN MANAGER: `Ultra Justice Engine` version `1.0.0` is active; filtering for `Justice` did not show a separate `Justice Core` row.
- VERIFIED UPRESS PLUGIN MANAGER: `All 404 Redirect to Homepage` version `5.6` is active.
- CREATED: `project-control/upress-plugin-manager-readonly-review.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png` and `project-control/visual-evidence/upress-plugin-manager-all-404-active-2026-05-11.png`.
- DECISION: do not activate `justice-core/` beside `ultra-justice-engine/`; they share `UJE_*` constants and `uje_*` functions.
- LIVE DEPLOYMENT VERIFIED: Codex used the uPress Git panel directly and verified the uPress Git log at commit `c58cd7e` for `Verify live plugin architecture surface`.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows commit `7acd40c` for `Document uPress plugin manager status`.
- SAFETY: no plugin activation, deactivation, deletion, installation, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## 2026-05-11 Live Public Template QA And Lawyer Filter SEO Alias Fix
- CREATED: `tools/check-live-public-template-qa.ps1`.
- CREATED: `project-control/live-public-template-qa-2026-05-11.csv`.
- VERIFIED LIVE SOURCE: homepage, main lawyer directory, article archive, Hebrew search page and sample article return HTTP 200 with Hebrew titles in the sampled checks.
- VERIFIED LIVE SOURCE: homepage fallback links are still safe: traffic points to `/lawyers/?area=traffic-law`, and LegalTech/AI intake points to `/#ask-lawyer`.
- VERIFIED LIVE SOURCE: sample article exposes semantic related-content QA attributes.
- FOUND LIVE: clean lawyer-directory aliases for personal injury, medical malpractice and employment stay on `/lawyers/` but have generic SEO titles.
- FIXED IN CODE: `inc/seo.php` now maps public lawyer-directory area aliases to existing taxonomy slugs before building SEO titles.
- UPDATED: deployment marker to `2026-05-11-lawyer-filter-seo-alias-v1`.
- VERIFIED: PHP lint passed for 128 PHP files.
- VERIFIED: `git diff --check` passed.
- LIVE VERIFIED AFTER FIX: see `project-control/live-public-template-qa-2026-05-11-after-pull.csv`.
- SAFETY: no content, URLs, redirects, sitemap settings, canonical settings, taxonomy terms, lawyer records, CRM records, review data, plugin state or database rows were changed.

## 2026-05-11 Lawyer Filter SEO Alias Live Verification
- PUSHED: `3b07267` (`Fix lawyer filter SEO alias titles`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Fix lawyer filter SEO alias titles` at commit `3b07267`.
- LIVE VERIFIED: public static marker returns `2026-05-11-lawyer-filter-seo-alias-v1`.
- CREATED: `project-control/live-public-template-qa-2026-05-11-after-pull.csv`.
- VERIFIED: full public template source QA passed with all sampled rows marked `VERIFIED`.
- FIXED LIVE: clean lawyer-directory aliases for personal injury, medical malpractice and employment now generate specific SEO titles matching their rendered H1 topics.
- SAFETY: no content, URL, redirect, sitemap setting, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state or database row was changed.

## 2026-05-11 Related Content URL Inference Fix
- CREATED: `tools/check-live-related-content-qa.ps1`.
- CREATED: `project-control/live-related-content-qa-2026-05-11-before-url-inference.csv`.
- FOUND LIVE: general lawyer-selection and criminal/drug-offense related-content samples still produced `unknown` clusters and off-topic cards.
- FIXED IN CODE: `inc/related-content.php` now includes post permalinks and the current request URI in the cluster-inference fingerprint.
- UPDATED: deployment marker to `2026-05-11-related-cluster-url-inference-v1`.
- VERIFIED: PHP lint passed for 128 PHP files.
- VERIFIED: `git diff --check` passed.
- NOT LIVE VERIFIED AFTER FIX: needs push, uPress pull/cache refresh and a fresh related-content QA run.
- SAFETY: no content body, CMS metadata, URL, redirect, sitemap setting, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state or database row was changed.
