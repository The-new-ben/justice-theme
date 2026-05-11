# Next Actions — Jus-Tice.co.il
**Date:** 2026-05-10
**Process:** Read this file at the start of every work session. Pick the top unblocked task. Update status when done.

---

## ACTIVE SEO ARCHITECTURE SEQUENCE - 2026-05-10

### ACTION-PLUGIN-COLLISION-001: Keep Justice plugin migration controlled
**Status:** PARTIAL PARITY VERIFIED / MIGRATION NOT APPROVED
**Why:** The live site currently exposes `Ultra Justice Engine`, while the repo also contains `justice-core` and `ultra-justice`. Activating duplicate Justice plugins could create PHP fatal errors, duplicate CPT/taxonomy registration, or confused REST/content behavior.
**Actions:**
1. DONE: added `tools/check-justice-plugin-collision.ps1`.
2. VERIFIED LOCAL: `ultra-justice-engine/ultra-justice-engine.php` has plugin header `Ultra Justice Engine`, version `1.0.0`, REST namespace `ultra-justice-engine/v1`.
3. VERIFIED LOCAL: `justice-core/justice-core.php` has plugin header `Justice Core`, version `1.0.0`, REST namespace `justice-core/v1`.
4. VERIFIED LOCAL: `ultra-justice/ultra-justice.php` has plugin header `Ultra Justice`, version `1.0.0`, REST namespace `ultra-justice/v1`.
5. VERIFIED LOCAL RISK: `justice-core/` and `ultra-justice-engine/` share `UJE_*` constants and many `uje_*` functions.
6. DOCUMENTED: `project-control/justice-plugin-collision-review.md`.
7. DECISION: do not activate `justice-core/` while `ultra-justice-engine/` is active.
8. DONE: read-only uPress File Manager inspection confirmed `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists on live and `/wp-content/plugins/justice-core` returned 0 filtered items.
9. DOCUMENTED: `project-control/upress-plugin-filesystem-readonly-review.md`.
10. DONE: generated `project-control/ultra-justice-engine-repo-manifest.csv` with local file hashes and `project-control/ultra-justice-engine-live-visible-manifest.csv` from the uPress visible active-plugin listing.
11. PARTIAL VERIFIED: repo `ultra-justice-engine/` has 17 files and repo `includes/` has 16 files; live visible `includes/` listing shows 15 files.
12. VERIFIED PARITY GAP: `includes/cpt-legal-tools.php` exists in the repo plugin but was NOT VISIBLE in the live active plugin listing.
13. DOCUMENTED: `project-control/live-plugin-code-parity-review.md`.
14. CODE FIXED: added admin-only read-only route `GET /wp-json/justice-theme/v1/active-plugin-manifest` to produce an active-plugin manifest when authenticated as an administrator.
15. DOCUMENTED: `project-control/plugin-manifest-diagnostic-review.md`.
16. VERIFIED LIVE: uPress top commit `8111d12`, static marker `2026-05-11-plugin-manifest-diagnostic-v1`, and unauthenticated public diagnostic request returns HTTP 401.
17. BLOCKED: Codex browser cannot currently open `jus-tice.co.il/wp-admin/` or the WordPress-side diagnostic route due a browser network failure, while local unauthenticated checks still reach the route.
18. CODE FIXED: added `tools/export-plugin-manifest-diagnostic.ps1` and `tools/compare-plugin-manifests.ps1` for future Application Password export and live-vs-repo comparison.
19. NEXT: create/use a WordPress Application Password or authenticated WP admin session, run the export script, then run the comparison script.
20. SAFETY: no plugin activation, deactivation, deletion, installation, upload, rename, compression, file-manager edit, wp-admin setting, URL, redirect, content, taxonomy, sitemap, canonical, lawyer, CRM, review or database change was made.

### ACTION-ROUTING-404-HOMEPAGE-001: Identify and disable uncontrolled 404-to-homepage redirects
**Status:** VERIFIED SOURCE - owner approval needed before deactivation
**Why:** Arbitrary missing URLs and invalid query routes should return a real Hebrew 404. Redirecting every miss to the homepage hides broken URLs, confuses users, and creates crawl/SEO noise before controlled URL migration.
**Actions:**
1. DONE: confirmed fake paths were returning `301 Location: https://jus-tice.co.il` and then homepage 200.
2. DONE: added and deployed canonical/wp_redirect guards for non-root requests targeting the homepage.
3. DONE: added and deployed native-404 early template guard in commit `cbbba45` with marker `2026-05-11-native-404-before-redirect-v1`.
4. VERIFIED LIVE: marker is deployed and uPress Git log shows `cbbba45`.
5. VERIFIED LIVE BLOCKED: fake paths still return homepage 301 and do not expose `X-Justice-Route-Guard`.
6. VERIFIED LIVE CLUE: the 301 response has no `X-Redirect-By`, suggesting a direct header/server/plugin redirect source. Exact source NOT VERIFIED.
7. VERIFIED SOURCE: uPress plugin manager shows `All 404 Redirect to Homepage` active (`פעיל`); its own description says it redirects 404 links to the homepage or another page using 301 redirects.
8. DOCUMENTED: `project-control/redirect-404-source-review.md` and evidence screenshot `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
9. NEXT: with owner approval, deactivate `All 404 Redirect to Homepage`, clear cache if needed, then verify fake URLs return HTTP 404, homepage returns 200, and key valid pages remain 200.
10. SAFETY: no URL migration, redirect rule, `.htaccess`, content, taxonomy, canonical, sitemap, lawyer, CRM, review, wp-admin option or database row was changed.

### ACTION-ROBOTS-STATIC-FILE-001: Replace empty static root robots.txt with verified sitemap-safe directives
**Status:** FIXED LIVE - monitor after cache/server changes
**Why:** The live root `robots.txt` was a zero-byte static file that shadowed WordPress' healthy generated robots output and prevented the verified sitemap index from being advertised to crawlers.
**Actions:**
1. DONE: confirmed public `https://jus-tice.co.il/robots.txt` returned HTTP 200 with zero-length body.
2. DONE: confirmed WordPress dynamic robots output at `/?robots=1` contained normal crawl rules and `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
3. DONE: confirmed uPress root File Manager listed physical `robots.txt` as size `—` and old backup `robots_ren1756059924.txt` as 196 B.
4. FIXED LIVE: edited root `robots.txt` in uPress File Manager to include wp-admin/feed/embed blocks, plugin private-file blocks, `Allow: /wp-admin/admin-ajax.php`, and the verified sitemap index directive.
5. VERIFIED LIVE: `robots.txt?codex_verify=...` returns HTTP 200, length 268, includes the sitemap index, has no global `Disallow: /`, and does not block theme/CSS assets.
6. VERIFIED LIVE: active sitemap index and sampled child sitemaps remain XML with zero first-party HTTP locs.
7. NEXT: monitor this file after server cache/plugin changes and submit `https://jus-tice.co.il/sitemap_index.xml` in GSC only after the owner approves the current technical SEO baseline.
8. SAFETY: no URL, redirect, `.htaccess`, content body, taxonomy, canonical, lawyer, CRM, review, wp-admin option or database row was changed.

### ACTION-RANKMATH-SITEMAP-CACHE-001: Bypass stale Rank Math sitemap cache during HTTPS baseline verification
**Status:** FIXED LIVE - monitor with robots baseline now fixed
**Why:** Latest theme code is live, but Rank Math child sitemap XML still emits stale `http://jus-tice.co.il` loc values. Sitemap HTTPS must be clean before GSC sitemap submission or URL migration.
**Actions:**
1. DONE: added the official Rank Math `rank_math/sitemap/enable_caching` filter with `__return_false`.
2. DONE: kept the existing first-party sitemap URL normalization hooks; no URL inventory, redirect, canonical or sitemap inclusion rule was changed.
3. DONE: deployment marker advanced to `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
4. VERIFIED BEFORE PATCH: `articles-sitemap2.xml?nocache=1` still returned 200 HTTP loc values and zero HTTPS loc values.
5. VERIFIED LIVE: uPress Git log top commit is `4c7b45e`; public marker returns `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
6. FIXED LIVE: sampled child sitemaps now show zero first-party HTTP locs and HTTPS locs only.
7. NEXT: recheck the same sitemap URLs after any Rank Math/settings/cache change and before GSC sitemap submission.
8. FIXED FOLLOW-UP: the separate empty root `robots.txt` blocker was fixed live in `ACTION-ROBOTS-STATIC-FILE-001`; continue monitoring after server/plugin/cache changes.

### ACTION-UPRESS-PULL-001: Verify and document self-service uPress Git pull
**Status:** VERIFIED LIVE - post-pull robots/sitemap follow-up needed
**Why:** Many completed repo fixes were blocked on live deployment. The owner asked Codex to find a way to pull Git from uPress directly.
**Actions:**
1. DONE: logged into uPress with owner-approved access and opened the `jus-tice.co.il` File Manager.
2. DONE: opened `ניהול GIT` under `/wp-content/themes/justice-theme`.
3. DONE: ran Git Status; uPress reported the theme working directory was clean.
4. DONE: ran Git Pull.
5. VERIFIED LIVE: uPress Git log top commit is `c992fd2` (`Document reviews compliance alias`).
6. VERIFIED LIVE: public static marker now returns `2026-05-11-robots-sitemap-directive-v1`, and homepage source includes the same marker.
7. BLOCKED: public `robots.txt` still returns empty output; inspect static/server/plugin robots source before making any robots/htaccess change.
8. BLOCKED: Rank Math child sitemap XML still exposes HTTP locs; clear Rank Math sitemap cache/resave sitemap or permalink settings, then recheck.

### ACTION-REVIEWS-COMPLIANCE-DOC-001: Keep review/reputation compliance package complete
**Status:** DOCUMENTED - implementation blocked pending legal/owner review
**Why:** Lawyer reviews, ratings and reputation signals are a major trust and monetization layer, but they create legal, privacy, Google-policy and advertising-risk issues if launched without strict rules.
**Actions:**
1. DONE: expanded `project-control/reviews-compliance-risk.md` from a pointer into an owner-facing compliance summary.
2. DONE: preserved `project-control/review-compliance-risk.md` as the canonical detailed compliance register.
3. DONE: documented non-negotiable rules, MVP compliance position, launch blockers and related planning files.
4. VERIFIED: the related review/reputation research, Google integration plan, rating-system spec, review-fields CSV, schema policy, roadmap and Maya prototype plan are present.
5. NEXT: before implementation, confirm legal/owner approval for review wording, paid placement disclosure, moderation workflow, first-party review collection, Google review source display and schema policy.
6. NOT IMPLEMENTED: no public rating/review UI, review schema, Google sync, lawyer profile edit or database/wp-admin change was made.

### ACTION-ROBOTS-SITEMAP-001: Advertise verified sitemap index in robots.txt
**Status:** CODE FIXED - live deployment/verification pending
**Why:** `sitemap_index.xml` is the verified active XML sitemap, while `/sitemap.xml` and `/wp-sitemap.xml` redirect to the homepage and should not be submitted.
**Actions:**
1. DONE: added a `robots_txt` filter that appends `Sitemap: https://jus-tice.co.il/sitemap_index.xml` when absent.
2. DONE: the filter respects WordPress public-indexing settings.
3. DONE: duplicate sitemap directives are avoided when the same URL is already present.
4. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
5. NEXT: pull/deploy marker `2026-05-11-robots-sitemap-directive-v1`, then verify `https://jus-tice.co.il/robots.txt` includes the sitemap index and still does not block CSS/JS/public content.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-SITEMAP-HTTPS-001: Normalize plugin sitemap URLs to HTTPS
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Live sitemap child files previously exposed many first-party `http://` URLs, creating mixed protocol signals and blocking a clean URL migration project.
**Actions:**
1. DONE: WordPress core sitemap entries still normalize first-party `loc` values to HTTPS.
2. DONE: added Yoast sitemap URL/entry filters for first-party HTTPS normalization.
3. DONE: added Rank Math sitemap URL/index/entry filters for first-party HTTPS normalization.
4. DONE: added AIOSEO sitemap index normalization for first-party HTTPS URLs.
5. VERIFIED: official plugin documentation was checked for the sitemap hooks before implementation.
6. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
7. NEXT: pull/deploy marker `2026-05-11-sitemap-https-plugin-filters-v1`, clear sitemap/plugin cache if needed, then recheck `page-sitemap.xml`, `articles-sitemap1.xml`, `articles-sitemap2.xml`, and `practice-areas-sitemap.xml` for `http://jus-tice.co.il` locs.
8. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-BRANDING-MANIFEST-001: Add stable mobile/search-branding manifest
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Browser tabs, mobile bookmarks and search branding need stable, crawlable brand assets without depending on a database-side Site Icon update.
**Actions:**
1. DONE: added `assets/images/site.webmanifest` using the existing 192x192 and 512x512 Jus-Tice icon assets.
2. DONE: `inc/seo.php` outputs the manifest link only when WordPress has no Site Icon, matching the safe favicon fallback behavior.
3. VERIFIED: local icon dimensions include 16, 32, 48, 180, 192 and 512 square PNG assets; full logo source is 1781x1654.
4. VERIFIED: PHP lint passed for 127 files, manifest JSON validated, and `git diff --check` passed.
5. VERIFIED LIVE PARTIAL: current public source already has a RealFaviconGenerator manifest under `/wp-content/uploads/fbrfg/site.webmanifest`.
6. NEXT: pull/deploy marker `2026-05-11-branding-manifest-v1`, then verify the theme fallback manifest is suppressed while WordPress Site Icon exists, and appears only if the admin icon stack is absent.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LAWYER-DIRECTORY-QUERY-001: Keep public lawyer archive counts/pagination approval-safe
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The archive should not let seed/demo/unapproved lawyer records distort result counts, pagination or empty-directory states after the public approval gates are applied.
**Actions:**
1. DONE: candidate lawyer IDs are scanned through `justice_theme_lawyer_profile_is_public_approved()` before the visible archive query.
2. DONE: the visible archive query is limited to approved IDs and fails closed when no public-approved profiles exist.
3. DONE: result count now uses the approved query total instead of counting only the current page after PHP-side filtering.
4. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
5. NEXT: pull/deploy marker `2026-05-11-lawyer-directory-approved-query-v1`, then verify `/lawyers/` and key filtered directory URLs on desktop/mobile.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-MAYA-TRUST-SAFETY-001: Require real approval signals for Maya public display
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Maya Rotenberg is the mini-site prototype, but she must not be public-approved solely because a seed/demo profile uses her name or slug.
**Actions:**
1. DONE: seed/demo metadata is now checked before Maya can pass public approval.
2. DONE: Maya name/slug fallback now requires normal approval/source signals or explicit opt-in filter `justice_theme_allow_maya_name_public_profile_fallback`.
3. VERIFIED: Maya can still display when the profile has approved/verified/source-backed metadata, but seed/demo records cannot pass by name alone.
4. NEXT: pull/deploy marker `2026-05-11-maya-public-approval-hardening-v1`, then verify homepage featured-lawyer section and Maya profile behavior after the current live data state is known.
5. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LEGALTOOLS-SEED-SAFETY-001: Keep LegalTech tool-page seeding opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** LegalTech tools can be valuable product/SEO assets, but draft/product pages should not be published silently by admin-init before strategy, content, pricing, funnel and legal-review decisions are approved.
**Actions:**
1. DONE: `justice-core` LegalTech tool seeding requires `justice_core_enable_legal_tools_seed`.
2. DONE: `ultra-justice-engine` LegalTech tool seeding requires `ultra_justice_engine_enable_legal_tools_seed`.
3. DONE: `ultra-justice` LegalTech tool seeding requires `ultra_justice_enable_legal_tools_seed`.
4. VERIFIED: public LegalTech request submission handler remains unchanged; only automatic tool-page creation is gated.
5. NEXT: pull/deploy marker `2026-05-11-legal-tools-seed-gate-v1`, then verify existing LegalTech pages/request forms still render as expected and no admin load creates new tool pages unless explicitly enabled.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LAWYER-PERFORMANCE-SAFETY-001: Keep profile view tracking opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Profile analytics are useful later, but public lawyer mini-site page loads should not write metadata/transients by default while the directory is still being cleaned and URL/content migration is controlled.
**Actions:**
1. DONE: single lawyer profile view tracking now requires `justice_theme_enable_lawyer_profile_view_tracking`.
2. DONE: existing public approval gate, contact safety gate, article links and profile rendering remain unchanged.
3. VERIFIED: default request path no longer increments `profile_views` or creates the visitor throttle transient unless owner enables the filter.
4. NEXT: pull/deploy marker `2026-05-11-lawyer-profile-view-tracking-gate-v1`, then verify a lawyer profile renders normally and profile view writes remain disabled unless intentionally enabled.
5. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-DEMO-LAWYER-SEED-SAFETY-001: Keep legacy demo lawyer seeders opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The audit found public risk around seed/demo lawyers. Legacy seeding helpers must not recreate placeholder lawyer profiles, fake contact routes or Maya slug changes during ordinary wp-admin/REST use.
**Actions:**
1. DONE: `justice-core` admin-init demo lawyer seeding requires `justice_core_enable_demo_lawyer_auto_seed`.
2. DONE: `ultra-justice-engine` admin-init demo lawyer seeding requires `ultra_justice_engine_enable_demo_lawyer_auto_seed`.
3. DONE: `ultra-justice` admin-init demo lawyer seeding requires `ultra_justice_enable_demo_lawyer_auto_seed`.
4. DONE: `/seed-lawyers` and `/seed-reset` REST routes in all three copies require separate explicit opt-in filters in addition to admin capability.
5. VERIFIED: no default seed path can create/reset/import demo lawyer profiles without owner-approved filters.
6. NEXT: pull/deploy marker `2026-05-11-demo-lawyer-seed-gates-v1`, then verify live source marker and keep any real lawyer imports in the approved data/import workflow.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-REST-SAFETY-001: Keep REST write/deploy helper routes opt-in
**Status:** CODE FIXED - live deployment/verification pending
**Why:** REST inspection helps the audit, but REST writes and theme-file write helpers must not mutate content or code unless explicitly enabled.
**Actions:**
1. DONE: content REST write routes for `update-meta` and `trash-post` now require `uje_enable_rest_content_writes` or `uj_enable_rest_content_writes`.
2. DONE: legacy agent bridge routes now require `uje_enable_agent_bridge_rest` or `uj_enable_agent_bridge_rest`.
3. DONE: agent bridge theme file writes also require `uje_enable_agent_bridge_file_write` or `uj_enable_agent_bridge_file_write`.
4. VERIFIED: read-only audit/report routes remain admin-only and unchanged.
5. NEXT: pull/deploy marker `2026-05-11-rest-write-gates-v1`, then verify unauthenticated/public REST cannot access these tools and admin writes remain disabled unless opted in.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-ADMIN-SEED-SAFETY-001: Prevent automatic draft/page/term seeding during audit
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The current mode is inventory, mapping and controlled approval. Opening wp-admin should not silently create draft pages, article drafts, taxonomy terms or lawyer funnel pages.
**Actions:**
1. DONE: added shared `justice_theme_admin_cms_write_enabled()` helper.
2. DONE: taxonomy practice/city seeding requires `justice_theme_enable_core_practice_terms_seed` / `justice_theme_enable_core_city_terms_seed`.
3. DONE: pillar page, pillar article and city/practice draft seeders require explicit opt-in filters.
4. DONE: lawyer registration, dashboard and plans page seeders require explicit opt-in filters.
5. VERIFIED: existing public fallback links and user-submitted workflows are unchanged.
6. NEXT: pull/deploy marker `2026-05-11-admin-seed-write-guard-v1`, then confirm wp-admin load does not create unapproved seed content.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-MENU-SAFETY-001: Keep permanent WordPress menu writes controlled
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Menus define the public SEO/design hierarchy. During the content architecture project, a theme pull or public page request must not silently create or repair WordPress menu items.
**Actions:**
1. DONE: primary menu seeding moved off public `init` and now requires explicit opt-in filter `justice_theme_enable_primary_menu_seed`.
2. DONE: seeded-menu area URL repair now requires explicit opt-in filter `justice_theme_enable_seeded_menu_area_url_repair`.
3. VERIFIED: render-time public fallback links remain available, so frontend navigation can still expose core legal-portal links without writing CMS data.
4. NEXT: pull/deploy marker `2026-05-11-menu-cms-write-guard-v1`, then verify public menu still renders and no automatic menu write is needed.
5. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-PUBLICATION-SAFETY-002: Keep family-law public cleanup render-only unless approved
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Public pages must not expose internal notes, but the current content architecture project also says no silent CMS rewrites before inventory, GSC, URL migration and owner approval.
**Actions:**
1. DONE: family-law runtime guard still cleans visitor output when internal markers are detected.
2. DONE: runtime guard persistence now requires explicit opt-in filter `justice_theme_enable_family_cluster_runtime_guard_persistence`.
3. DONE: automatic editorial repair now requires explicit opt-in filter `justice_theme_enable_family_cluster_editorial_repair`.
4. DONE: automatic internal-notes draft sync now requires explicit opt-in filter `justice_theme_enable_family_cluster_internal_notes_sync`.
5. DONE: quarantine and auto-publication also use explicit opt-in filters before they can write live CMS data.
6. VERIFIED: no content bodies, URLs, redirects, wp-admin settings, sitemap, taxonomy, lawyer, lead/CRM or review records were changed by this repo patch.
7. NEXT: pull/deploy marker `2026-05-11-family-cluster-render-only-guard-v1`, then inspect one affected family-law URL for clean public rendering while confirming no automatic CMS write was required.
8. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-URL-MIGRATION-SAFETY-001: Keep Maya slug/profile changes controlled
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The current URL migration rule says "map first, approve, then migrate"; theme pulls must not silently change lawyer slugs or profile CMS fields.
**Actions:**
1. DONE: automatic Maya Rotenberg slug migration now requires explicit opt-in filter `justice_theme_enable_maya_slug_migration`.
2. DONE: automatic Maya mini-site field bootstrap now requires explicit opt-in filter `justice_theme_enable_maya_minisite_bootstrap`.
3. DONE: automatic Maya public-source metadata bootstrap now requires explicit opt-in filter `justice_theme_enable_maya_public_sources_bootstrap`.
4. VERIFIED: no URLs, redirects, lawyer records, profile fields, database rows or wp-admin settings were changed by this repo patch.
5. NEXT: pull/deploy marker `2026-05-11-controlled-maya-migration-guard-v1`, then confirm public source marker and keep Maya slug/profile changes on the approved migration map.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-DEPLOY-001: Make Codex-operated uPress pulls reliable
**Status:** PLAN CREATED - access still blocked unless session is authenticated
**Why:** Owner wants Codex to pull Git through uPress without manual intervention every time.
**Actions:**
1. DONE: created `project-control/deployment-access-plan.md`.
2. LIVE VERIFIED: owner-triggered uPress pull deployed marker `2026-05-11-mobile-inner-qa-v1`.
3. BLOCKED: direct uPress file-manager URL still opens the login screen in this Codex browser session.
4. RECOMMENDED SHORT TERM: owner logs into uPress once in the Codex browser with remember-me, then Codex can use the right-panel Git pull button.
5. RECOMMENDED DURABLE: request SSH/WP-CLI deployment access if uPress plan supports it.
6. FUTURE: secured deploy webhook only after explicit approval and security review; do not add a public `pull.php`.
7. RECHECKED 2026-05-11: controlled autonomous login attempt is still BLOCKED by browser form-fill limitations/security policy; do not bypass this with unsafe workarounds.

### ACTION-LAWYER-TRUST-001: Safe lawyer trust signals, contact routes and homepage feature
**Status:** CODE FIXED V3 - live deployment/verification pending
**Why:** Lawyer pages and homepage modules must not show fake ratings/testimonials/sponsorship/contact/verification signals, and profile view tracking should not write to the database on every page load.
**Actions:**
1. DONE: lawyer cards only show rating numbers when `review_display_enabled` is explicitly approved and rating/count data exists.
2. DONE: lawyer mini-sites only show rating summaries and testimonials when review display is explicitly approved.
3. DONE: sponsored profile label now requires an active subscription and is suppressed for seed-like profiles.
4. DONE: anonymous profile views are throttled with a one-day hashed visitor transient.
5. DONE: lawyer card/profile phone and WhatsApp links now suppress obvious placeholder/demo numbers before public display.
6. DONE: Attorney schema now uses the same safe public phone value.
7. DONE: homepage featured-lawyer module now renders only public-approved lawyer profiles and uses neutral section-level wording.
8. VERIFIED: PHP syntax passed for changed files.
9. NEXT: pull/deploy marker `2026-05-11-featured-lawyer-trust-v1`, then verify homepage, Maya profile and lawyer archive do not show unapproved review/rating/verification claims or fake contact routes.
10. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-I18N-001: Remove English labels from public Hebrew surfaces
**Status:** CODE FIXED - live deployment/verification pending
**Latest V2:** CODE FIXED - public search cards now use a theme-side Hebrew label map; live deployment/verification pending.
**Why:** Hebrew visitors should not see English `Article`, `Articles`, `Practice Areas`, `Previous`, `Next`, or similar system labels on search/archive/404 pages.
**Actions:**
1. VERIFIED IN CODE: `404.php` body and CTA are Hebrew.
2. VERIFIED IN CODE: `search.php` H1 and pagination labels are Hebrew.
3. DONE: `articles` CPT labels are Hebrew in both plugin trees, preventing `Article` from leaking in search result cards.
4. DONE: `practice-areas` taxonomy labels are Hebrew in both plugin trees.
5. NEXT: pull/deploy marker `2026-05-11-hebrew-cpt-labels-v1`, then verify `/ ?s=גירושין` or a similar public search page does not show English content-type labels.
6. NOT LIVE VERIFIED: no public deployment yet.

7. DONE V2: search result cards now use `justice_theme_public_post_type_label()` so public cards remain Hebrew even if a legacy plugin label is English.
8. NEXT V2: pull/deploy marker `2026-05-11-public-label-map-v1`, then verify a public search page does not show English content-type labels.

### ACTION-UX-003: Search and 404 premium state polish
**Status:** CODE FIXED - live visual verification pending
**Why:** Public search, no-results, and 404 pages are customer-facing legal-portal states and should not look like plain browser/default WordPress output.
**Actions:**
1. DONE: shared legal search form now has premium responsive styling, focus states, and mobile stacking.
2. DONE: search header now visually highlights the query and keeps long Hebrew/English terms from breaking layout.
3. DONE: no-results content now renders as a clear card with consistent spacing.
4. DONE: 404 template no longer relies on inline styles; the panel and CTA use reusable theme classes.
5. VERIFIED: changed PHP file passed syntax check; CSS diff passed whitespace/conflict checks.
6. DONE: forced homepage-fallback 404 responses now emit a `X-Justice-Route-Guard` verification header and `X-Robots-Tag: noindex, nofollow`.
7. NEXT: pull/deploy marker `2026-05-11-forced-404-header-signal-v1`, then verify public search, no-results, and a true 404 on desktop/mobile.
8. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-UX-004: Breadcrumb Premium Polish
**Status:** CODE FIXED - live visual verification pending
**Why:** Breadcrumbs are visible on customer-facing article, archive, lawyer, practice, search and 404 pages, and weak breadcrumbs reduce trust/navigation clarity.
**Actions:**
1. DONE: breadcrumb markup now includes stable home/current item classes and text wrappers.
2. DONE: breadcrumb band now uses premium compact styling, pill links, current-page emphasis, subtle accent line and mobile horizontal scrolling.
3. DONE: RTL separator behavior was updated for the new visual separator.
4. VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
5. NEXT: pull/deploy marker `2026-05-11-breadcrumb-polish-v1`, then visually check breadcrumbs on article, articles archive, lawyers archive, practice, search and 404 pages.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-HOMEPAGE-SEO-004: Expand homepage legal hub coverage
**Status:** CODE FIXED - live deployment/verification pending
**Why:** The homepage must support broad legal-portal relevance with visible entry points to all major lawyer-topic hubs, not only a subset of categories.
**Actions:**
1. DONE: featured pillar cards now include `עורך דין רשלנות רפואית` and `עורך דין נזיקין`.
2. DONE: topic clusters now include `רשלנות רפואית`, `נזיקין ותאונות`, `דיני עבודה`, and `ירושה וצוואות`.
3. DONE: new links use safe published-page checks and fall back to lawyer-directory/topic URLs when a clean English pillar slug is not live yet.
4. VERIFIED IN CODE: no URLs were migrated, redirected, deleted or published as new content.
5. NEXT: pull/deploy marker `2026-05-11-homepage-hub-coverage-v1`, then verify homepage desktop/mobile DOM includes the broad hub links.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-DIRECTORY-004: Normalize lawyer-directory filter aliases
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Header/homepage/menu filter links must not land on empty directory states just because public clean slugs differ from legacy seeded taxonomy slugs.
**Actions:**
1. DONE: `personal-injury-law` now queries the existing `torts` taxonomy term.
2. DONE: `medical-malpractice-law` now queries the existing `medical-malpractice` taxonomy term.
3. DONE: `employment-law`, `employment` and `labor` normalize to `labor-law`.
4. DONE: dropdown labels are normalized for visitor-facing Hebrew labels.
5. NEXT: pull/deploy marker `2026-05-11-lawyer-filter-slug-alias-v1`, then verify `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, and `/lawyers/?area=labor-law`.
6. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-LEADS-004: Normalize lead legal-area vocabulary
**Status:** CODE FIXED - live lead test pending
**Why:** Lead intake, CRM, content clusters and lawyer-directory filters should use one legal-area vocabulary instead of mixed values like `damages`, `torts`, `medical_malpractice`, and `real_estate`.
**Actions:**
1. DONE: homepage ask-lawyer form now submits clean area slugs.
2. DONE: shared lead form now submits clean area slugs.
3. DONE: classifier normalizes legacy aliases and Hebrew `אחר` into canonical legal-area values.
4. DONE: existing non-canonical lead area values are normalized on lead save/classification.
5. DONE: CRM area column displays Hebrew labels when possible.
6. NEXT: pull/deploy marker `2026-05-11-lead-area-normalization-v1`, then submit one controlled lead with area `רשלנות רפואית` or `נזיקין ותאונות` and verify CRM metadata.
7. NOT LIVE VERIFIED: no public deployment/test lead yet.

### ACTION-NAV-004: Normalize legal-area navigation fallbacks
**Status:** CODE FIXED - live deployment/verification pending
**Why:** Header, footer and menu links must support the same canonical directory filters as the homepage/content-cluster strategy, otherwise users can land on stale paths or empty filtered states.
**Actions:**
1. DONE: header topic-strip fallbacks for personal injury/damages and inheritance now route to `/lawyers/?area=personal-injury-law` and `/lawyers/?area=inheritance-law`.
2. DONE: homepage inheritance pillar fallback now routes to `/lawyers/?area=inheritance-law` until the clean pillar page is published.
3. DONE: footer specialization links now include medical malpractice, employment, traffic and inheritance in addition to the existing major fields.
4. DONE: menu repair logic normalizes additional stale aliases for medical malpractice, employment and privacy/cyber filters.
5. DONE: lawyer-directory filter parsing now accepts extra public aliases for medical malpractice, privacy/cyber and tax filters, with privacy/cyber querying the existing `cyber-law` taxonomy slug.
6. NEXT: pull/deploy marker `2026-05-11-nav-area-fallback-normalization-v1`, then verify header/footer/menu links and filtered directory pages on desktop/mobile.
7. NOT LIVE VERIFIED: no public deployment yet.

### ACTION-BRAND-001: Logo + Favicon + Search Branding
**Status:** PARTIAL LIVE VERIFIED - wp-admin/search-result verification pending
**Why:** Browser tabs, mobile bookmarks and Google search results need a stable, professional icon and final brand state.
**Actions:**
1. DONE: Inspected owner-provided old logo asset.
2. DONE: Replaced dummy repo `assets/images/logo.png` with the provided Jus-Tice logo source.
3. DONE: Generated square favicon/app icon fallback assets in 16, 32, 48, 180, 192 and 512 sizes plus ICO.
4. DONE: Updated SVG favicon and theme fallback tags while preserving WordPress Site Icon priority.
5. DONE: Added `project-control/favicon-logo-task.md`.
6. VERIFIED: live currently outputs favicon tags and sampled live icon URLs return HTTP 200.
7. DONE: owner/uPress pull verified; public source now shows marker `2026-05-10-branding-v1`.
8. DONE: theme fallback icon assets return HTTP 200.
9. DONE: desktop/mobile screenshots captured after deployment.
10. VERIFIED: WordPress/media/plugin favicon tags are still active, so fallback tags are correctly suppressed while WordPress Site Icon exists.
11. NEXT: verify wp-admin Site Icon selected media item and clean up duplicate icon/plugin outputs if owner approves.
12. NOT VERIFIED: final browser tab/mobile bookmark appearance and Google search-result favicon refresh.

### ACTION-UX-002: Third-Party Mobile Chat Bubble Collision
**Status:** CODE FIXED - live deployment/visual verification pending
**Why:** Post-pull mobile screenshot shows the green third-party chat/lead bubble still covering lower hero cards even after the theme WhatsApp float was improved.
**Actions:**
1. DONE: confirmed in `homepage-branding-post-pull-mobile-2026-05-10.png`.
2. DONE: live DOM inspection identified the overlay as `a.whatsapp-button`, a fixed 255px-wide WhatsApp lead banner, not an iframe.
3. CODE FIXED: `assets/css/premium-pass-3.css` now compacts that injected mobile banner into a 54px circular WhatsApp icon and hides the extra logo/text.
4. VISUAL VERIFIED BY LIVE CSS SIMULATION: `mobile-chat-widget-css-test-final-2026-05-10.png` shows the compact state on the live mobile page after injecting the exact CSS.
5. NEXT: owner/uPress pull, clear cache, then capture fresh live mobile homepage/article/directory screenshots.
6. NOT LIVE VERIFIED: deployed public CSS still needs post-pull verification.

### ACTION-CONTENT-001: Semantic Related Articles
**Status:** CODE FIXED V3 - metadata batch prepared / deployment and live QA pending
**Why:** Related articles should support the reader's next legal step and the SEO cluster, not show random latest or unrelated legacy posts.
**Actions:**
1. DONE: replaced single-article related selection with manual URLs, same `content_cluster`, then same `practice-areas`.
2. DONE: removed broad legacy `post` fallback from related article cards.
3. DONE: added relevant practice-area fallback when no semantic card exists.
4. VERIFIED: PHP lint passed for 127 PHP files.
5. LIVE VERIFIED: representative live article pages now expose `data-related-mode="semantic"` and no public unsafe internal markers in the sampled body.
6. PARTIAL QUALITY: general/criminal samples still surface off-intent cards (`ai-for-law-firms`, `business-license`, `australia-lawyers`), and the real-estate sample includes a weak Cyprus pricing match.
7. CODE FIXED: internal article review/status blocks are now editor-only so public visitors do not see internal QA/source-audit status when meta fields exist.
8. CODE FIXED V2: taxonomy fallback now applies an inferred cluster gate so broad/shared practice terms cannot pull obviously off-topic cards.
9. DONE: created `project-control/related-content-cms-update-batch-001.csv` with concrete `content_cluster`, `parent_pillar_url`, and `manual_related_urls` values for four sampled priority pages.
10. DONE V3: manual related URL metadata now accepts comma/newline/pipe/semicolon separators, matching messy real CMS entry patterns.
11. DONE V3: related sections and cards expose safe QA attributes for source cluster, card cluster and cluster-match state.
12. NEXT: deploy/pull marker `2026-05-11-related-content-qa-attrs-v1`, then repeat live QA on general, criminal, family and real-estate article samples.
13. NEXT: with owner approval and wp-admin/REST write access, apply metadata batch 001.
14. NOT LIVE VERIFIED AFTER V3: requires uPress pull/cache clear and article-page DOM/source check for the new QA attributes.

### ACTION-SEO-001: Open GSC Indexing Drilldowns
**Status:** COMPLETED - first sample pass
**Why:** GSC shows 1.58K not indexed pages, including 785 crawled-currently-not-indexed and 38 duplicate canonical issues. We need example URLs before content/URL decisions.
**Actions:**
1. DONE: Opened GSC Page indexing examples for "Crawled - currently not indexed".
2. DONE: Opened examples for "Duplicate without user-selected canonical".
3. DONE: Opened examples for "Page with redirect".
4. DONE: Opened examples for "Alternate page with proper canonical tag" and "Not found (404)".
5. DONE: Recorded examples in `project-control/gsc-indexing-review.csv`.
6. DONE: classified sampled examples into media URL, legacy CPT, taxonomy/archive, redirect source, weak content, content candidate and technical issue in `project-control/gsc-indexing-example-classification.csv`.
7. DONE: created a no-URL-change remediation batch from the classified examples: media policy, legacy CPT comparison, and `/divorce-mediation-basics` merge review.
8. NEXT: prepare the first no-URL-change homepage + directory SEO batch from GSC evidence and live visual QA.

### ACTION-SEO-002: Verify Sitemap And HTTPS Migration Blockers
**Status:** PARTIAL - public endpoint verification completed; wp-admin/uPress settings still blocked
**Why:** Public sitemap URLs appear to return homepage-like HTML, and GSC reports 412 Non-HTTPS URLs. This can break a future URL migration.
**Actions:**
1. BLOCKED: Verify active sitemap generator in wp-admin/server.
2. DONE: Confirmed `sitemap_index.xml` is the active valid XML sitemap index.
3. DONE: Confirmed default `/sitemap.xml`, `/wp-sitemap.xml`, and `/post-sitemap.xml` redirect to the homepage, not XML.
4. DONE: Confirmed live child sitemaps contain many `http://` locs, matching the GSC Non-HTTPS risk.
5. DONE: Created `project-control/sitemap-live-verification.csv`.
6. CODE FIXED: theme-emitted first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS.
7. CODE FIXED: common SEO-plugin canonical/Open Graph filters and WordPress core sitemap entries use the same first-party HTTPS normalization helper.
8. CODE FIXED: public frontend first-party links generated by WordPress URL helpers now normalize to HTTPS for home, post/page/CPT, taxonomy and attachment URLs.
9. PARTIAL ONLY: active plugin sitemap settings remain blocked because live child sitemaps previously exposed many `http://` locs outside the theme output path.
10. NEXT: pull/deploy marker `2026-05-11-public-link-https-normalization-v1`, then source-check homepage/article/practice/lawyer pages and recheck active sitemap children.
11. NEXT: inspect GSC Non-HTTPS examples and wp-admin sitemap/SEO plugin settings when access is available.
12. UPDATED: `project-control/sitemap-strategy.md` and `project-control/robots-htaccess-review.md`.

### ACTION-SEO-003: No-URL-Change Homepage + Directory SEO Batch
**Status:** CODE FIXED - live deployment/visual verification pending
**Why:** GSC shows broad `עורך דין` / `עורכי דין` intent is scattered. This can be improved before URL migration.
**Actions:**
1. DONE: Exported current homepage and `/lawyers/` title/H1/meta into `project-control/seo-title-h1-review.csv`.
2. DONE: Created batch evidence at `project-control/homepage-directory-seo-batch-001.md` and `.csv`.
3. DONE: Code-fixed homepage/header/topic-cluster links so planned pillar URLs are used only when published; otherwise they fall back to working hubs/directory filters.
4. DONE: Updated `project-control/internal-link-map.csv` with homepage-to-pillar link intent rows.
5. VERIFIED: no slugs or redirects were changed in this batch.
6. NEXT: deploy/pull latest code, clear cache, then visually verify homepage topic strip and `/lawyers/` title output.

### ACTION-SEO-004: Post-Deploy Homepage + Directory Verification
**Status:** PARTIAL LIVE VERIFIED - follow-up code fix pending deploy
**Why:** Code is fixed locally, but live site still needs deployment/cache refresh before the customer-facing links and titles can be called verified.
**Actions:**
1. DONE: Rechecked homepage rendered topic strip links in public HTML.
2. DONE: Rechecked homepage and `/lawyers/` title/H1/meta; both title fixes are live.
3. DONE: Captured homepage and `/lawyers/` desktop/mobile screenshots after owner Upress pull.
4. PARTIAL: Most topic links are safe, but traffic still fell back to `/traffic-law/` and LegalTech/AI links redirected home.
5. CODE FIXED: traffic fallback changed to `/lawyers/?area=traffic-law`; LegalTech/AI fallback changed to `/#ask-lawyer`.
6. NEXT: commit/push follow-up, owner pulls latest, then recheck rendered topic-strip and LegalTech links.

### ACTION-SEO-005: Verify Follow-Up Topic/LegalTech Fallbacks
**Status:** LIVE VERIFIED
**Why:** The live pull fixed titles and most links, but the latest fallback patch must be verified after another pull.
**Actions:**
1. DONE: Rechecked rendered topic-strip traffic link; it now uses `/lawyers/?area=traffic-law`.
2. DONE: Rechecked rendered AI intake link; it now uses `/#ask-lawyer`.
3. DONE: Rechecked public homepage form destination and enriched fields.
4. DONE: Updated visual QA and customer-facing QA.

### ACTION-LEADS-001: Verify Enriched Ask-Lawyer Intake Form
**Status:** LIVE VERIFIED - controlled CRM test pending
**Why:** LegalTech/AI fallback now points users to the homepage lead form when tool pages are not published, so the form must capture enough context to route the lead.
**Actions:**
1. DONE: Live-checked current form wiring; it posts to `admin-post.php` and includes spam/attribution fields.
2. DONE: Code-fixed the homepage form to ask for legal area, city/region, email and urgency.
3. DONE: Code-fixed homepage/directory source keyword fallback to neutral portal/directory language.
4. VERIFIED: PHP lint passed locally for 127 PHP files.
5. DONE: Live rechecked `/#ask-lawyer`; the enriched fields are public and hidden general/normal values are gone.
6. NEXT: submit one controlled test lead only when wp-admin/CRM verification is available.

### ACTION-LEADS-002: Controlled Lead Submission Test
**Status:** NEXT - requires CRM/admin verification
**Why:** The public form is now live, but a real end-to-end lead must be checked in the admin CRM before the lead funnel is called operational.
**Actions:**
1. Submit a clearly marked test lead from `/#ask-lawyer`.
2. Confirm the lead appears in the CRM/admin list with source, area, city/region, urgency and test-note metadata.
3. Verify a `justice_lead` record is created.
4. Verify legal area, city, urgency, source keyword and consent are saved.
5. Verify no duplicate email/CRM side effects.
6. Delete or mark the test lead internally after verification.

### ACTION-UX-001: Mobile Floating Action Collision
**Status:** CODE FIXED - live verification pending
**Why:** Mobile screenshots show the accessibility launcher and floating WhatsApp/lead controls covering important first-viewport and lower-page content.
**Actions:**
1. DONE: Captured before screenshot at `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
2. DONE: Reduced and raised the theme WhatsApp float on mobile.
3. DONE: Added mobile bottom safe space so fixed controls do not sit directly on footer/form content.
4. DONE: Moved the Pojo accessibility toolbar away from the middle of the mobile hero and limited the open overlay height.
5. VERIFIED: `git diff --check` passed.
6. NEXT: owner/uPress pulls latest code, cache is cleared, then capture fresh mobile homepage/article/directory screenshots.
7. NOT LIVE VERIFIED: current public site still shows the pre-fix layout until deployment.

---

## CRITICAL — DO FIRST (BLOCKED UNTIL DONE)

### ACTION-001: Establish Live Site Access
**Status:** BLOCKED — no SSH/WP-CLI access in current session  
**Why:** Almost everything else requires ability to run WP-CLI commands or wp-admin access  
**Actions:**
1. Confirm SSH access to server
2. Confirm WP-CLI is installed: `wp --version`
3. Confirm wp-admin credentials work
4. Run: `wp option get template` — confirm active theme
5. Run: `wp plugin list` — confirm no duplicate plugins
6. Run: `wp post list --post_type=post --post_status=publish --format=count` — count spam

### ACTION-002: Stop Spam on Homepage
**Status:** COMPLETED
**Why:** Casino/gaming content destroys credibility and risks Google penalty
**Actions:**
1. Changed `latest-articles.php` query from `array('articles','post')` to `array('articles')` — SAFE, no data loss. Spam posts no longer render on the homepage.
2. Owner still needs to run WP-CLI spam audit to delete the actual spam posts from the database (see spam-investigation.md).

### ACTION-003: Verify/Fix Justice Core Plugin
**Status:** COMPLETED (Pending User Upload)
**Why:** Theme depends on plugin for CPTs/taxonomies. Without working plugin = 404 everywhere
**Actions:**
1. A clean, conflict-free plugin (`jus-tice-engine.zip`) has been generated in the root directory.
2. The user must upload and activate `jus-tice-engine.zip` via wp-admin to register CPTs (`justice_lawyer`, `articles`, `justice_lead`) and the REST API.

---

## HIGH PRIORITY (After CRITICAL is resolved)

### ACTION-004: Fix Hero Search Form
**Status:** COMPLETED in code - live verification pending
**File:** `template-parts/sections/hero.php`  
**Issue:** Form action points to `home_url('/')`, GET params `practice_area` and `city` don't filter lawyers  
**Fix:** Change form action to `get_post_type_archive_link('justice_lawyer')` and change param names to `area` and `city` (matching the archive template filter)

```php
// BEFORE:
<form action="<?php echo esc_url( home_url( '/' ) ); ?>">
<select name="practice_area">

// AFTER:
<form action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ); ?>">
<select name="area">
```

### ACTION-005: Upload Professional Logo
**Repo status:** PARTIAL - bundled fallback logo is now wired in header/footer; live Customizer upload is still optional.
**Status:** Design task — needs SVG or PNG  
**File:** WP Customizer → Site Identity → Logo  
**Spec:** Max height 44px, white text/graphic (shows on dark navy header)

### ACTION-006: Create 10 Practice Area Taxonomy Terms
**Status:** COMPLETED in code - live seeding pending admin visit
**Implementation:** `inc/taxonomy-seed.php` creates/updates the 10 core terms on `/wp-admin/` load when `practice-areas` taxonomy exists.
**Command:**
```bash
wp term create practice-areas "דיני משפחה" --slug=family-law --description="ייעוץ וייצוג בתחום הגירושין, הילדים, הירושות ודיני המשפחה"
wp term create practice-areas "משפט פלילי" --slug=criminal-law --description="הגנה פלילית, ייצוג בחקירות ובבתי משפט"
wp term create practice-areas "דיני תעבורה" --slug=traffic-law --description="ביטול דוחות, עבירות נהיגה, תאונות דרכים"
wp term create practice-areas "מקרקעין ונדלן" --slug=real-estate-law --description="עסקאות נדל\"ן, רישום טאבו, ליקויי בנייה"
wp term create practice-areas "דיני עבודה" --slug=labor-law --description="זכויות עובדים, פיטורים, הסכמי עבודה"
wp term create practice-areas "ירושה וצוואות" --slug=inheritance --description="צוואות, ירושות, ניהול עיזבון"
wp term create practice-areas "נזיקין" --slug=torts --description="תאונות, נזקי גוף, פיצויים"
wp term create practice-areas "רשלנות רפואית" --slug=medical-malpractice --description="שגיאות רפואיות, פגיעות בלידה, תביעות כנגד קופות חולים"
wp term create practice-areas "ביטוח לאומי" --slug=national-insurance --description="קצבאות, ועדות רפואיות, ערעורים"
wp term create practice-areas "הגירה ואזרחות" --slug=immigration --description="אשרות, אזרחות, איחוד משפחות"
```

### ACTION-007: Create Seed Lawyer Profiles (10 draft profiles)
**Status:** COMPLETED in code - live seeding / cleanup pending admin verification
**Implementation:** Existing seeders in `justice-core/`, `ultra-justice-engine/`, and `ultra-justice/` create 10 draft `justice_lawyer` profiles. Safety was hardened so generated profiles remain unverified, inactive, not featured, not lead-routed, and marked as seed/testing data.
**Rules:** All profiles DRAFT/PRIVATE. Not "verified". Source documented. No false endorsement.  
**See:** `project-control/lawyer-seed.csv` template/data file.
**Still needed live:** verify active plugin path, visit `/wp-admin/` after Upress pull if seeding is desired, then draft/unpublish any existing public demo lawyers. Maya Rotenberg remains the only client intended for homepage featuring.

### ACTION-008: Publish 5 Pillar Articles
**Status:** PARTIAL in code - 5 draft article starters seed after admin visit; publishing still pending legal/editorial review
**Required for:** SEO foundation, homepage not showing empty state  
**Titles (minimum viable):**
1. "עורך דין גירושין — מדריך מלא לבחירה, עלויות, הליך"
2. "עורך דין פלילי — מה לדעת לפני שבוחרים"
3. "עורך דין תעבורה — ביטול דוחות, עבירות ותאונות"
4. "עורך דין מקרקעין — כל מה שצריך לדעת לפני עסקה"
5. "עורך דין דיני עבודה — מדריך לעובד ולמעסיק"

---

**Implementation:** `inc/pillar-article-seed.php` seeds draft-only `articles` records with English slugs, Hebrew starter text, practice-area assignment, pillar URL metadata, and `needs_legal_review = 1`.
**Still needed:** expand each draft to publication quality, add real sources, assign author/reviewer, verify no cannibalization with page pillars, then publish manually after review.

## MEDIUM PRIORITY

### ACTION-009: Install Yoast SEO / RankMath
**Status:** BLOCKED in repo-only mode - requires wp-admin plugin install decision and live activation
- Generates XML sitemap automatically
- Adds canonical tags to all pages
- Adds `og:image` for social sharing
- Do NOT install both

### ACTION-010: Configure Customizer Contact Info
**Status:** BLOCKED in repo-only mode - requires live Customizer/admin access
- Set `justice_phone` — appears in header CTA and footer
- Set `justice_email` — appears in footer
- Set `justice_whatsapp` — appears in float button and lawyer profiles

### ACTION-011: Connect Google Search Console
**Status:** BLOCKED - requires verified Google account/property access
- Verify domain ownership
- Submit sitemap: `https://jus-tice.co.il/sitemap_index.xml`
- Set preferred country: Israel

### ACTION-012: Fix i18n in archive-justice_lawyer.php
**Status:** COMPLETED in code
**File:** `archive-justice_lawyer.php`  
**Issue:** Filter labels use raw Hebrew strings not wrapped in `esc_html_e()`  
**Lines to fix:**
```php
// Line ~108:
<label for="filter-area">תחום משפטי</label>
// Should be:
<label for="filter-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
```

---

## LOW PRIORITY (Phase 2)

- ACTION-013: Build lawyer self-registration page — COMPLETED in theme; live verification pending
- ACTION-014: Build lawyer dashboard — PARTIAL: front-end dashboard MVP added; live verification and self-edit/payment modules still planned
- ACTION-015: Integrate WooCommerce for plan subscriptions — PARTIAL: plan page and product-ID mapping hooks added; live WooCommerce install/product setup still blocked
- ACTION-016: Build lead intake AI classification — PARTIAL: rule-based lead classifier added; external AI and lawyer matching still planned
- ACTION-017: Build GSC weekly report automation — PARTIAL: GitHub Action and report generator added; secrets/Search Console access still required
- ACTION-018: Build city taxonomy + city × practice area pages — PARTIAL: city seeder, draft page seeder and template added; live verification and content approval still needed

---

## WORKFLOW RULES

1. Read this file first every session
2. Pick the HIGHEST priority unblocked task
3. Update status in `task-board.csv`
4. Make the smallest useful change
5. Test it
6. Commit with clear message
7. Update `changelog.md`
8. Update status here
9. Pick next task

---

## 2026-05-09 CORRECTIONS FROM OWNER FEEDBACK

### LOGO
**Status:** FIXED IN REPO / LIVE NOT VERIFIED
- The visible fallback must not use `assets/images/logo.png` because that file is a dummy placeholder.
- Header and footer now render a Jus-Tice code wordmark with a blinking red dot when no WordPress custom logo is configured.
- If the old final logo exists in the media library, use it later through WordPress Site Identity; until then the code wordmark is the safer fallback.

### CONTENT DEPTH
**Status:** ACTIVE PRIORITY
- The current seeded article starters are scaffolds only.
- Production target is 5,000-word-class pillar/supporting articles, not short SEO pages.
- Each major article must be built from SERP reverse engineering: intent, competing page types, related questions, price/process/risk sections, internal links, related lawyer mini-site blocks, sources, author/reviewer, and legal disclaimer.
- First full production candidate: `/divorce-lawyer/` and the connected Maya Rotenberg mini-site/content cluster.
- Repo drafts can now be imported into the CMS from `Tools > Jus-Tice Content Drafts`. Imports are draft-only and require legal/editorial review before publication.

---

## 2026-05-10 INTEGRATED SEO / DESIGN / CONTENT WORKFLOW

**Status:** ACTIVE PRIORITY - planning added, no live execution yet

Next safe batch before any URL/content migration:
1. Review homepage SEO/design alignment against `project-control/homepage-seo-design-alignment.md`.
2. Review one article template and one lawyer profile for semantic related-content behavior.
3. Confirm mobile-first template risks in `project-control/mobile-first-template-review.md`.
4. Confirm accessibility risks in `project-control/accessibility-review.md`.
5. Use `project-control/related-content-map.csv` to drive the first semantic related-content implementation plan.
6. Use `project-control/integrated-launch-checklist.md` before approving any batch that touches content, design, URLs, sitemap or redirects.
7. Deploy/pull the title cleanup in `inc/seo.php`, then recheck `/articles/`, `/lawyers/` and search titles for Hebrew output.
8. Recheck the live 404/routing guard and sample lawyer profile route, because both still returned homepage-style content with status 200 in the integrated visual QA pass.

**Do not execute yet:** URL changes, redirects, content deletions, public rewrites, payments, index/noindex changes.

---

## 2026-05-10 LIVE VERIFIED UPDATES

**Status:** LIVE VERIFIED / PARTIAL

- Homepage mobile floating WhatsApp overlap is fixed live: the homepage hides floating WhatsApp controls on mobile, and the guided search form/CTAs remain clear.
- Semantic related-content code is live on the tested article: `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"`.
- Next UX check: run mobile screenshots on one article, `/articles/`, `/lawyers/`, and one practice page to confirm non-home floating controls do not cover important content.
- Next content check: manually review related cards on one family, one criminal and one real-estate article for semantic relevance.

---

## 2026-05-10 REVIEWS / REPUTATION MODULE NEXT ACTIONS

**Status:** STRATEGY CREATED / NOT IMPLEMENTED

- Review and approve `project-control/review-compliance-risk.md` before any public review/rating UI.
- For Maya Rotenberg, verify Google Business Profile and Place ID manually before showing any Google rating/count.
- Add only source-disclosed "Read reviews on Google" MVP fields first; do not add stars or AggregateRating schema yet.
- Decide whether first-party Jus-Tice reviews should be a pilot feature, and approve moderation/privacy policy first.
- Add review/reputation fields to the lawyer CMS only after owner/legal approval.

## 2026-05-11 REVIEWS / REPUTATION NEXT ACTIONS

**Status:** STRATEGY DEEPENED / IMPLEMENTATION BLOCKED UNTIL APPROVAL

1. Owner/legal review: approve review policy, no-incentive rule, moderation workflow, paid placement disclosure and lawyer-reply policy.
2. Product approval: confirm MVP is manual Google review link + verified rating/count + profile completeness, not public star widgets.
3. Maya prototype: verify Google Business Profile and Place ID before showing any Google review link or rating.
4. CMS planning: add fields from `lawyer-review-fields.csv` only after the policy gate is approved.
5. Schema gate: keep AggregateRating/Review schema blocked until visible real reviews, policy approval and Rich Results Test workflow exist.
6. Future implementation: build first-party `justice_review` only as private/moderated content, not public comments.

## 2026-05-11 INNER MOBILE QA NEXT ACTIONS

**Status:** CODE FIXED / LIVE DEPLOYMENT PENDING

1. Pull latest `main` in uPress and clear cache.
2. Verify public source marker `2026-05-11-mobile-inner-qa-v1`.
3. Re-run mobile screenshots for `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` without local CSS injection.
4. Confirm `/family-law/` has no horizontal overflow at 390px.
5. Confirm only one compact mobile WhatsApp/contact control is visible on non-home pages.
6. Confirm the accessibility launcher does not create horizontal scroll and does not cover critical CTAs.

## 2026-05-11 404 ROUTING PLUGIN NEXT ACTIONS

**Status:** SOURCE VERIFIED / CHECKLIST READY / OWNER APPROVAL NEEDED

1. Review `project-control/404-plugin-deactivation-checklist.md`.
2. Confirm owner approval to deactivate `All 404 Redirect to Homepage`.
3. Before changing plugin state, run `tools/check-404-routing.ps1` and preserve the blocked baseline.
4. Deactivate the plugin only; do not delete it, edit `.htaccess`, change permalinks, add redirect rules or change URL migration settings.
5. Rerun `tools/check-404-routing.ps1`.
6. Expected fixed state: fake generated URL and invalid `?p=99999999` return HTTP 404 with no homepage redirect.
7. Confirm homepage, `/articles/`, `/lawyers/`, `robots.txt`, and `sitemap_index.xml` still pass.
8. Capture desktop and mobile screenshots of the fixed Hebrew 404 page.
9. If valid pages break, reactivate the plugin and document the regression.

## 2026-05-11 LIVE PLUGIN ARCHITECTURE NEXT ACTIONS

**Status:** LIVE REST SURFACE VERIFIED / FILESYSTEM PATH VERIFIED / MIGRATION NOT APPROVED

1. Use `tools/check-live-plugin-surface.ps1` before plugin migration work.
2. Treat `ultra-justice-engine/v1` as the active live Justice REST namespace.
3. Do not activate `justice-core/` while `ultra-justice-engine/` is active because both use `UJE_*` constants and `uje_*` functions.
4. VERIFIED: uPress File Manager confirms `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php` exists and `/wp-content/plugins/justice-core` is not present in the filtered live plugin filesystem view.
5. NEXT: compare active live plugin code version against repo `ultra-justice-engine/` before assuming LegalTech CPT parity.
6. Investigate why `justice_legal_tool` and `justice_legal_request` are not exposed in current public `wp/v2/types`.
7. Keep LegalTech public routes marked NOT VERIFIED LIVE until active plugin code version is confirmed.
8. Plan a controlled plugin migration only after backup, parity diff, permalink flush plan and owner approval.

## 2026-05-11 LIVE PUBLIC TEMPLATE QA NEXT ACTIONS

**Status:** LIVE VERIFIED / MONITOR

1. Continue using `tools/check-live-public-template-qa.ps1` after each public template pull to catch title leaks, homepage fallback regressions, related-content QA attribute regressions and filtered directory redirects.
2. Keep the URL migration rule intact: do not redirect or rename these filter URLs during title/template fixes.
3. Expand the script later with one family-law article, one criminal-law article and one real-estate article when selecting the next related-content QA batch.
4. Use `project-control/live-public-template-qa-2026-05-11-after-pull.csv` as the current VERIFIED baseline.

## 2026-05-11 RELATED CONTENT URL INFERENCE NEXT ACTIONS

**Status:** FIXED LIVE / TECHNICAL QA VERIFIED

1. DONE: pulled `40ee1c4` through uPress and verified public marker `2026-05-11-related-fallback-qa-v1`.
2. DONE: reran `tools/check-live-related-content-qa.ps1`.
3. VERIFIED: `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` has all sampled rows marked `VERIFIED`.
4. VERIFIED: `general_lawyer_selection` now uses `related_mode=fallback` with `detected_source_cluster=lawyer_selection`.
5. VERIFIED: `criminal_drug_offenses` now uses `related_mode=semantic` with `detected_source_cluster=criminal_law` and matched cards.
6. NEXT: fix editorially weak but technically same-cluster recommendations through CMS metadata/manual related URLs, not through URL changes.
7. Keep global/latest unrelated fallback blocked for important legal articles.
