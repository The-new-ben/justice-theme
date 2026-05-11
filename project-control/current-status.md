# Current Status - Jus-Tice.co.il
Date: 2026-05-10
Deployment model: GitHub repo sync to live WordPress. Do not build ZIP packages unless explicitly requested.

## LATEST WORK STATUS - 2026-05-11 04:50 Asia/Jerusalem
- CODE FIXED: custom REST content write routes for `update-meta` and `trash-post` now require explicit opt-in filters (`uje_enable_rest_content_writes` / `uj_enable_rest_content_writes`) in addition to admin capability.
- CODE FIXED: legacy agent bridge REST routes are disabled by default through `uje_enable_agent_bridge_rest` / `uj_enable_agent_bridge_rest`; theme file writes also require `uje_enable_agent_bridge_file_write` / `uj_enable_agent_bridge_file_write`.
- WHY: REST read tools can help the audit, but REST writes and theme-file writes must not become an unplanned deployment/CMS mutation channel.
- VERIFIED: read-only audit/report routes remain admin-only; write routes are opt-in only.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-rest-write-gates-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no REST call, file write, taxonomy term, page, article, URL, redirect, content body, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:40 Asia/Jerusalem
- CODE FIXED: theme admin seeders now require explicit opt-in filters before creating taxonomy terms, pillar page drafts, article drafts, city/practice drafts, lawyer registration page, lawyer dashboard page or lawyer plans page.
- CODE FIXED: added shared `justice_theme_admin_cms_write_enabled()` gate for owner-approved admin seed/write actions.
- WHY: opening wp-admin during the content audit/URL migration project should not silently create public pages, article drafts, taxonomy terms or business-funnel pages.
- VERIFIED: manual/editorial form submissions and existing public render-time fallbacks are unchanged; this patch only controls automatic seeders.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-admin-seed-write-guard-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no taxonomy term, page, article, URL, redirect, content body, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:30 Asia/Jerusalem
- CODE FIXED: primary WordPress menu seeding no longer runs from public `init`; it is admin-only and requires explicit opt-in filter `justice_theme_enable_primary_menu_seed`.
- CODE FIXED: seeded-menu URL repair now requires explicit opt-in filter `justice_theme_enable_seeded_menu_area_url_repair`.
- WHY: menus are part of SEO/design hierarchy and should not be permanently rewritten by an ordinary frontend request during the content architecture and URL migration project.
- VERIFIED: customer-facing render-time fallback menu links remain in place through `wp_nav_menu_items`; the patch only controls permanent WordPress menu writes.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-menu-cms-write-guard-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no menu item, URL, redirect, content body, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:22 Asia/Jerusalem
- CODE FIXED: family-law public runtime guard now remains visitor-safe but render-only by default; if old public bodies still contain internal markers, the rendered output is replaced with the cleaned repo article body without silently saving it back to WordPress.
- CODE FIXED: family-law editorial repair, internal-notes draft sync, quarantine and auto-publication now all require explicit opt-in filters before they can perform permanent CMS writes.
- WHY: the current project mode is content inventory, URL migration mapping and controlled approvals. A theme pull should not silently rewrite article bodies, draft pages, URLs, metadata or cache state.
- VERIFIED: automatic creation/update of the internal notes draft is paused by default; manual wp-admin repair remains available through the existing approved admin action.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-family-cluster-render-only-guard-v1`; public homepage still serves older marker `2026-05-11-mobile-inner-qa-v1`, so uPress pull/cache clear is still required.
- SAFETY: no public content body, URL, redirect, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:18 Asia/Jerusalem
- CODE FIXED: automatic Maya Rotenberg live slug migration is now disabled by default and requires explicit opt-in through `justice_theme_enable_maya_slug_migration`.
- CODE FIXED: automatic Maya mini-site CMS field bootstrapping is now disabled by default and requires explicit opt-in through `justice_theme_enable_maya_minisite_bootstrap`.
- CODE FIXED: automatic Maya public-source metadata bootstrapping is now disabled by default and requires explicit opt-in through `justice_theme_enable_maya_public_sources_bootstrap`.
- WHY: URL/profile changes must be controlled by the content inventory, URL migration map, redirect plan and owner approval. A theme pull should not silently mutate WordPress slugs or lawyer profile fields.
- VERIFIED: the previous public lawyer trust gate remains in place; this patch only changes when live data migrations are allowed to run.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-controlled-maya-migration-guard-v1`; requires uPress pull/cache clear and a source-marker check.
- SAFETY: no public content body, URL, redirect, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:02 Asia/Jerusalem
- CODE FIXED: breadcrumb markup now includes stable item/current/home classes, a breadcrumb depth attribute, and text wrappers for safer truncation.
- CODE FIXED: breadcrumb styling was upgraded from a plain grey strip to a compact premium navigation band with pill links, current-page emphasis, subtle legal-brand accent, mobile horizontal scrolling, and RTL-safe separators.
- VERIFIED: breadcrumb schema output remains in place through the existing `justice_theme_print_breadcrumb_schema()` path.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-breadcrumb-polish-v1`; requires uPress pull/cache clear and desktop/mobile checks on article, archive, lawyer directory, practice, search and 404 pages.
- SAFETY: no public content body, URL, redirect, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:52 Asia/Jerusalem
- CODE FIXED: related-content manual URL metadata now accepts comma, newline, pipe and semicolon separators, so admin/CMS batches are less brittle.
- CODE FIXED: related-article sections now expose safe DOM QA signals: `data-related-source-cluster`, `data-related-card-count`, and per-card `data-related-card-cluster` / `data-related-cluster-match`.
- CODE FIXED: reusable article cards can receive controlled `data-*` attributes without changing public text, layout, URLs or article content.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-related-content-qa-attrs-v1`; requires uPress pull/cache clear and repeat related-content DOM/visual QA.
- SAFETY: no WordPress article body, CMS metadata, URL, redirect, taxonomy term, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:41 Asia/Jerusalem
- DOCUMENTED: created `project-control/related-content-cms-update-batch-001.csv` for four priority pages whose live related cards need explicit CMS metadata.
- DOCUMENTED: batch 001 specifies `content_cluster`, `parent_pillar_url`, and `manual_related_urls` for the general lawyer-selection article, drug-offenses article, real-estate cost article, and mutual-divorce-agreement article.
- DOCUMENTED: updated related-content strategy and implementation report so the next CMS/admin pass has a concrete metadata update list instead of a vague "fix related cards" note.
- VERIFIED: docs-only CSV/header/content checks passed locally.
- NOT LIVE VERIFIED / NOT EXECUTED: no WordPress article body, CMS metadata, URL, redirect, taxonomy term, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.
- NEXT: after owner approval and wp-admin/REST write access, apply the metadata batch and then repeat the 2026-05-11 related-content visual QA sample.

## LATEST WORK STATUS - 2026-05-11 03:31 Asia/Jerusalem
- CODE FIXED: header topic-strip fallbacks for personal injury/damages and inheritance now route to canonical lawyer-directory filters instead of old standalone fallback paths.
- CODE FIXED: homepage inheritance pillar fallback now also routes to the canonical inheritance lawyer-directory filter until the clean pillar page is published.
- CODE FIXED: footer specialization links now expose medical malpractice, employment, traffic and inheritance filters in addition to family, criminal, real estate and personal injury.
- CODE FIXED: seeded/admin-repaired practice-area menu URLs now normalize additional stale aliases (`medical-malpractice`, `medical_malpractice`, `cyber-privacy`, `privacy-cyber`, `employment-law`) into canonical directory filters.
- CODE FIXED: lawyer-directory filter parsing now accepts extra public aliases for medical malpractice, privacy/cyber and tax filters, with `privacy-cyber-law` querying the existing `cyber-law` taxonomy slug.
- VERIFIED: PHP lint passed for 127 files, `git diff --check` passed, and the remaining legacy alias scan matches intentional admin-menu repair mappings only.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-nav-area-fallback-normalization-v1`; requires uPress pull/cache clear and live checks of header/footer/menu links plus filtered directory URLs.
- SAFETY: no public article body, URL migration, redirect, taxonomy term, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:20 Asia/Jerusalem
- CODE FIXED: public lead forms now submit canonical clean legal-area slugs (`family-law`, `criminal-law`, `real-estate-law`, `personal-injury-law`, `medical-malpractice-law`, etc.) instead of mixed legacy values.
- CODE FIXED: the lead classifier now normalizes old/legacy area values (`family`, `real_estate`, `damages`, `torts`, `medical_malpractice`, `employment-law`, Hebrew `אחר`) into the same canonical CRM/content-cluster vocabulary.
- CODE FIXED: existing non-canonical `legal_area` values are normalized on lead save, and the CRM table displays Hebrew legal-area labels instead of raw slugs where possible.
- VERIFIED: PHP lint passed for 127 files using the provided local PHP 8.5.6 runtime, and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lead-area-normalization-v1`; requires uPress pull/cache clear and one controlled test lead from homepage/lead form.
- SAFETY: no existing lead rows, lawyer records, review data, public article bodies, URLs, redirects, taxonomy terms, wp-admin settings or database rows were changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 03:10 Asia/Jerusalem
- CODE FIXED: lawyer-directory area filters now accept clean/public aliases such as `personal-injury-law`, `medical-malpractice-law`, and `employment-law` while querying the existing taxonomy slugs safely.
- CODE FIXED: legacy/old filter params (`torts`, `medical-malpractice`, `labor`, `employment`) are normalized so menu/header/homepage links do not silently produce empty or weak lawyer-directory states.
- CODE FIXED: the public filter dropdown now presents normalized visitor-facing labels for `נזיקין ותאונות`, `רשלנות רפואית`, and `דיני עבודה` while preserving the underlying taxonomy route.
- VERIFIED: PHP lint passed for 127 files using the provided local PHP 8.5.6 runtime, and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-filter-slug-alias-v1`; requires uPress pull/cache clear and live checks for `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, and `/lawyers/?area=labor-law`.
- SAFETY: no taxonomy terms, URLs, redirects, public article bodies, lawyer records, review data, lead/CRM records, wp-admin settings or database rows were changed.

## LATEST WORK STATUS - 2026-05-11 04:36 Asia/Jerusalem
- CODE FIXED: homepage featured pillar cards now include visible entries for `עורך דין רשלנות רפואית` and `עורך דין נזיקין`, using safe published-page checks with lawyer-directory fallbacks.
- CODE FIXED: homepage topic clusters now cover `רשלנות רפואית`, `נזיקין ותאונות`, `דיני עבודה`, and `ירושה וצוואות` in addition to family, criminal, real estate and traffic.
- CODE FIXED: new supporting links use `justice_theme_safe_public_link()`, so unpublished clean English slugs fall back to safe topic/directory URLs instead of creating weak homepage redirects or broken links.
- VERIFIED: PHP lint passed for 127 files using the provided local PHP 8.5.6 runtime, and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-homepage-hub-coverage-v1`; requires uPress pull/cache clear and a public homepage DOM/mobile visual check.
- SAFETY: no public article body, URL migration, redirect, sitemap, wp-admin setting, lead/CRM record, lawyer data, review data or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:24 Asia/Jerusalem
- CODE FIXED: forced homepage-fallback 404 responses now emit `X-Justice-Route-Guard: forced-unknown-path-404` so the routing guard can be verified cleanly after deployment.
- CODE FIXED: the same forced 404 responses emit `X-Robots-Tag: noindex, nofollow` to avoid accidental indexing if a missing path is caught by the guard.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-forced-404-header-signal-v1`; requires uPress pull/cache clear and a public fake-URL header/status check.
- SAFETY: no public content body, URL migration, redirect, sitemap, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:12 Asia/Jerusalem
- CODE FIXED: public frontend first-party links generated by WordPress now normalize to HTTPS through `home_url`, post/page/CPT permalink, term link and attachment link filters.
- CODE FIXED: the URL normalization helper no longer calls `home_url()` internally, avoiding recursion while still matching the configured Jus-Tice host.
- PARTIAL ONLY: this does not change stored database URLs, redirect rules, URL slugs, wp-admin settings, or external links; plugin-specific sitemap settings may still need admin review.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-public-link-https-normalization-v1`; requires uPress pull/cache clear and public HTML/sitemap spot checks for internal `http://jus-tice.co.il` links.
- SAFETY: no public content body, URL migration, redirect, robots rule, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:00 Asia/Jerusalem
- CODE FIXED: theme-emitted first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS when they point to the Jus-Tice public host.
- CODE FIXED: common SEO plugin canonical/Open Graph URL filters are normalized through the same safe helper, and WordPress core sitemap entries are normalized if core sitemaps are active.
- PARTIAL ONLY: this does not change live redirects, database URLs, URL slugs, or the active SEO-plugin sitemap configuration; the plugin sitemap still needs wp-admin/uPress review because live child sitemaps previously exposed many `http://` locs.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-https-seo-url-normalization-v1`; requires uPress pull/cache clear and source checks on homepage, article, practice page, lawyer directory and sitemap outputs.
- SAFETY: no public content body, URL migration, redirect, robots rule, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:40 Asia/Jerusalem
- CODE FIXED: shared public legal search forms now have premium responsive styling instead of plain browser-form presentation.
- CODE FIXED: the public search header, no-results state, and 404 search panel now use consistent card spacing, focus states, mobile stacking, and Hebrew visitor-facing hierarchy.
- CODE FIXED: `404.php` no longer uses inline layout styles for the 404 panel/home CTA; styling now lives in reusable theme CSS.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-search-404-polish-v1`; requires uPress pull/cache clear and live desktop/mobile QA for search, no-results, and a true 404 URL.
- SAFETY: no content body, URL, redirect, sitemap, robots, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:27 Asia/Jerusalem
- CODE FIXED: search result cards now use a theme-side Hebrew public post-type label map instead of trusting raw plugin labels.
- CODE FIXED: mapped public labels include `מאמר משפטי`, `מאמר`, `עמוד מידע`, `פרופיל עורך דין`, `כלי משפטי`, with a safe Hebrew fallback `תוכן משפטי`.
- CODE FIXED: this protects the public search UI even if a legacy plugin registration or cached CPT label still exposes English labels.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-public-label-map-v1`; requires uPress pull/cache clear and live search-page QA.
- SAFETY: no content body, URL, redirect, sitemap, robots, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:14 Asia/Jerusalem
- CODE FIXED: Articles CPT labels in both plugin trees now use Hebrew public/admin labels (`מאמרים משפטיים`, `מאמר משפטי`) instead of English `Articles` / `Article`.
- CODE FIXED: practice-area taxonomy labels in both plugin trees now use Hebrew labels (`תחומי משפט`, `תחום משפט`) instead of English `Practice Areas`.
- VERIFIED IN CODE: 404 and search templates already had Hebrew body/H1/pagination strings; this batch closes the remaining CPT-label leak that can appear on search result cards.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-hebrew-cpt-labels-v1`; requires uPress pull/cache clear and live search-page QA.
- SAFETY: no content body, URL, redirect, sitemap, robots, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:00 Asia/Jerusalem
- CODE FIXED: homepage featured-lawyer module now requires the selected lawyer profile to pass the public-approved profile helper before rendering.
- CODE FIXED: homepage featured-lawyer copy no longer says "verified lawyer" at section level; verification language is left to the card only when real profile metadata supports it.
- CODE FIXED: homepage lawyer CTA now points to `/lawyer-registration/` instead of the weaker `/join/` path.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-featured-lawyer-trust-v1`; requires uPress pull/cache clear and homepage visual QA.
- SAFETY: no lawyer profile content, review data, lead data, URL, redirect, sitemap, robots, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 02:45 Asia/Jerusalem
- CODE FIXED: lawyer phone and WhatsApp CTAs now pass through a shared public-contact safety filter before rendering on directory cards or mini-site hero buttons.
- CODE FIXED: obvious placeholder/demo numbers such as sequential values, repeated digits and `555123`-style values are suppressed from public lawyer CTAs.
- CODE FIXED: Attorney schema now uses the same safe phone value, so placeholder lawyer numbers should not be emitted as structured data.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-contact-safety-v1`; requires uPress pull/cache clear and live QA on `/lawyers/` plus at least one lawyer profile.
- SAFETY: no lawyer profile content, review data, lead data, URL, redirect, sitemap, robots, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 02:28 Asia/Jerusalem
- CODE FIXED: lawyer card/profile ratings and testimonials now require explicit `review_display_enabled` approval before public display.
- CODE FIXED: sponsored/profile-paid labels on the lawyer mini-site now require `subscription_status=active` and are suppressed for seed-like profiles.
- CODE FIXED: lawyer profile view counting is throttled with a one-day hashed visitor transient, reducing database writes from every anonymous page load to at most one counted write per visitor/profile/day.
- VERIFIED: `single-justice_lawyer.php`, `template-parts/cards/lawyer-card.php`, and `functions.php` passed PHP syntax checks.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-trust-safety-v1`; requires uPress pull/cache clear and public lawyer-profile QA.
- SAFETY: no review data, lawyer profile content, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 02:05 Asia/Jerusalem
- CODE FIXED: related article taxonomy fallback now has a cluster-sanity gate in `inc/related-content.php`.
- CODE FIXED: when explicit `content_cluster` metadata is absent, the related-content system infers a conservative editorial cluster from slug/title/meta/practice-area signals before accepting taxonomy fallback cards.
- CODE FIXED: off-intent fallback patterns such as AI-for-law-firms, business-license, Australia lawyers and Cyprus pricing should no longer be accepted under criminal/general/real-estate pages unless they match the source cluster.
- VERIFIED: `inc/related-content.php` passed PHP syntax check and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-related-cluster-gate-v1`; requires uPress pull/cache clear and repeat QA on general, criminal, family and real-estate article samples.
- SAFETY: no article body, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 01:35 Asia/Jerusalem
- CODE FIXED: article templates no longer expose internal review/status panels to anonymous public visitors. The `NOT VERIFIED` / source-audit / draft word-count/status blocks in `single-articles.php` are now editor-only via `current_user_can( 'edit_post', get_the_ID() )`.
- VERIFIED: PHP lint passed for 127 PHP files after the article-note guard.
- LIVE VERIFIED BEFORE FIX: four sampled live article pages did not currently expose unsafe internal markers, but the template was unsafe when those meta fields existed.
- LIVE RELATED QA: sampled general, family, criminal and real-estate article pages show `data-related-mode="semantic"` and no unsafe internal markers.
- PARTIAL QUALITY: related cards are still not customer-ready across all clusters. General/criminal samples still surface off-intent cards such as AI-for-law-firms, business-license and Australia lawyers; real-estate also surfaces Cyprus pricing. Manual related URLs, `content_cluster`, and practice-area metadata cleanup are required.
- NOT LIVE VERIFIED AFTER FIX: deployment marker is now `2026-05-11-public-article-note-guard-v1`; uPress pull/cache clear is required before public verification of this exact guard.
- BLOCKED FOR AUTONOMOUS DEPLOY: uPress file-manager still redirects this Codex browser session to login, and browser automation cannot safely fill the uPress login form. Owner must either log in once in the Codex browser and keep the session authenticated, or provide SSH/WP-CLI/deploy-hook access.
- SAFETY: no article body, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## LATEST LIVE STATUS - 2026-05-11 01:10 Asia/Jerusalem
- LIVE VERIFIED: owner pressed uPress Git pull and the public site now serves deployment marker `2026-05-11-mobile-inner-qa-v1` on homepage and `/family-law/`.
- LIVE VERIFIED: public `premium-pass-3.css` contains the inner-page mobile overflow/contact-control fix.
- VISUAL VERIFIED: fresh live mobile screenshots were captured for `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` without injected CSS.
- EVIDENCE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json` and `project-control/visual-evidence/mobile-inner-*-2026-05-11-live.png`.
- FIXED / LIVE VERIFIED: all four sampled mobile pages report `scrollWidth = 390`, `clientWidth = 390`, `overflowX = false`.
- FIXED / LIVE VERIFIED: duplicate theme `.whatsapp-float` is hidden on sampled inner mobile pages; one compact third-party WhatsApp button remains.
- VERIFIED: article page still exposes `data-related-mode="semantic"`.
- BLOCKED FOR AUTONOMOUS PULL: the direct uPress file-manager URL still redirects this Codex browser session to the uPress login screen. A persistent authenticated uPress session, SSH/WP-CLI access, or an approved secured deploy webhook is needed for Codex to pull without owner action.
- CREATED: `project-control/deployment-access-plan.md`.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, CRM records, database rows or wp-admin settings were changed.

## LATEST WORK STATUS - 2026-05-10 23:32 Asia/Jerusalem
- BLOCKED: the provided uPress file-manager URL opened to the uPress login screen in the in-app browser, so authenticated file-manager inspection is not available yet.
- CODE FIXED: related article selection now uses semantic priority instead of broad/latest fallback.
- CODE FIXED: `inc/related-content.php` prioritizes manual editorial URLs, then `content_cluster`, then shared `practice-areas`; it no longer uses legacy `post` as a normal related-content source.
- CODE FIXED: when no semantic related card exists, article pages show a relevant practice-area link instead of unrelated cards.
- VERIFIED: PHP lint passed for 127 PHP files.
- SAFETY: no public content, URLs, redirects, sitemap, robots, wp-admin, CRM or database records were changed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and visual check on representative article pages.

## LATEST WORK STATUS - 2026-05-10 23:20 Asia/Jerusalem
- LIVE VERIFIED ISSUE: mobile DOM inspection found the remaining green lower-right overlay is `a.whatsapp-button`, not the Tawk chat iframe.
- LIVE VERIFIED ISSUE DETAIL: before fix the button rendered about 255x61px at the mobile bottom-right and covered lower hero/customer content. Evidence: `project-control/visual-evidence/mobile-third-party-cta-before-2026-05-10.png`.
- CODE FIXED: `assets/css/premium-pass-3.css` now converts the third-party/mobile WhatsApp lead banner into a 54x54px round icon-only control on screens under 760px.
- CODE FIXED: the mobile override hides the extra Jus-Tice logo image/text inside that injected button, keeps the WhatsApp icon visible, lowers stacking priority, and preserves the outbound WhatsApp link.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: injected the exact CSS into the live mobile page and captured `project-control/visual-evidence/mobile-chat-widget-css-test-final-2026-05-10.png`; computed size changed to 54x54px.
- SAFETY: no URLs, redirects, content bodies, sitemap rules, robots rules, admin settings, leads, CRM records or database data were changed.
- NOT LIVE VERIFIED AFTER CODE FIX: requires owner/uPress pull, cache clear, and fresh mobile screenshot.

## LATEST LIVE STATUS - 2026-05-10 23:25 Asia/Jerusalem
- LIVE VERIFIED: owner uPress pull is public; homepage now serves deployment marker `2026-05-10-branding-v1`.
- LIVE VERIFIED: theme version `1.0.2` assets are visible in public source.
- LIVE VERIFIED: repo fallback brand/icon files are crawlable and return HTTP 200: `favicon.svg`, `favicon.ico`, `favicon-512.png`, `apple-touch-icon.png`, `site-icon-512.png`, and `logo.png`.
- LIVE VERIFIED: WordPress/media/plugin favicon tags are still the active source output, so the theme fallback correctly does not print duplicate fallback tags while `has_site_icon()` is true.
- VISUAL VERIFIED: fresh screenshots captured at `project-control/visual-evidence/homepage-branding-post-pull-desktop-2026-05-10.png` and `project-control/visual-evidence/homepage-branding-post-pull-mobile-2026-05-10.png`.
- VISUAL VERIFIED: mobile/desktop header logo remains visible after the branding pull.
- PARTIAL FIX: the theme WhatsApp float is smaller/raised on mobile after the pull.
- STILL LOOKS BAD: the third-party green chat/lead bubble still overlaps lower mobile hero cards; this is separate from the theme WhatsApp float.
- NOT VERIFIED: wp-admin Site Icon selected media item and final Google search-result favicon refresh.

## LATEST WORK STATUS - 2026-05-10 23:05 Asia/Jerusalem
- CODE FIXED: logo/favicon/search-branding task added and documented in `project-control/favicon-logo-task.md` and `project-control/design-polish-checklist.md`.
- VERIFIED: owner-provided Downloads logo PNG was inspected; full image is 1781x1654 and is not square, so it is not directly suitable as a Site Icon without crop/export.
- CODE FIXED: repo dummy `assets/images/logo.png` was replaced with the provided Jus-Tice logo source, and `assets/images/justice-logo-full.png` was added as a reference copy.
- CODE FIXED: square fallback favicon/app assets were generated from the old mark: 16, 32, 48, 180, 192 and 512 PNGs plus `favicon.ico`.
- CODE FIXED: `assets/images/favicon.svg` now uses a square legal mark with the red accent; `inc/seo.php` now emits ICO/SVG/512/Apple fallback tags only when WordPress has no Site Icon.
- CODE FIXED: red dot logo animation is slightly faster and the fallback wordmark is slightly smaller.
- LIVE VERIFIED: current live page already outputs multiple favicon tags from WordPress/media/plugin layers, and sampled live favicon URLs return HTTP 200.
- NOT LIVE VERIFIED AFTER FIX: requires uPress pull/cache refresh, browser tab/mobile icon visual check and wp-admin Site Icon review.

## LATEST WORK STATUS - 2026-05-10 22:48 Asia/Jerusalem
- LIVE VERIFIED BEFORE FIX: mobile homepage screenshot shows the Pojo accessibility tab overlapping the hero area and the theme WhatsApp button competing with the lower mobile lead/chat CTA.
- VISUAL EVIDENCE: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
- CODE FIXED: mobile CSS now reserves bottom safe space, reduces the theme WhatsApp float from 52px to 48px, raises it above the lower CTA zone, and lowers its stacking priority.
- CODE FIXED: mobile CSS now moves the Pojo accessibility toolbar from the middle of the first viewport to a predictable top-side position and caps the overlay height.
- VERIFIED: `git diff --check` passed after the CSS change.
- SAFETY: no public URLs, redirects, content bodies, sitemap rules, robots rules, wp-admin settings, lead submissions or CMS/database records were changed.
- NOT LIVE VERIFIED: requires uPress pull/cache refresh and a fresh mobile screenshot after deployment.

## LATEST LIVE STATUS - 2026-05-10 22:35 Asia/Jerusalem
- LIVE VERIFIED: follow-up fallback patch is now public.
- LIVE VERIFIED: homepage topic strip traffic link now renders as `https://jus-tice.co.il/lawyers/?area=traffic-law` instead of the homepage-redirecting `/traffic-law/`.
- LIVE VERIFIED: homepage topic strip AI/intake link now renders as `https://jus-tice.co.il/#ask-lawyer` instead of the homepage-redirecting `/legal-tools/ai-intake/`.
- LIVE VERIFIED: enriched ask-lawyer form is public and now includes visible fields for email, legal area, city/region and urgency.
- LIVE VERIFIED: old hidden `lead_area=general` and `lead_urgency=normal` values are no longer present in the homepage form.
- LIVE VERIFIED: homepage lead source keyword is now neutral: `עורך דין / עורכי דין / הכוונה משפטית`.
- VISUAL VERIFIED: screenshots captured at `project-control/visual-evidence/ask-lawyer-enriched-desktop-2026-05-10.png` and `project-control/visual-evidence/ask-lawyer-enriched-mobile-2026-05-10.png`.
- SAFETY: no lead submission was sent, no CRM records changed, and no public URLs/redirects/content bodies were changed.
- NEXT: run one controlled lead submission only when CRM/wp-admin verification is available.

## LATEST LIVE STATUS - 2026-05-10 22:15 Asia/Jerusalem
- LIVE VERIFIED: owner Upress pull is now reflected publicly. Homepage deployment marker is `2026-05-10-contextual-title-v1`.
- LIVE VERIFIED: homepage title is now `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- LIVE VERIFIED: `/lawyers/` title is now `מדריך עורכי דין בישראל | Jus-Tice`; the English `Archive` leak is fixed live.
- LIVE VERIFIED: header topic strip renders expanded crawlable topic links for divorce, criminal, real estate, malpractice, personal injury, traffic, employment, inheritance and legal intake.
- VISUAL VERIFIED: fresh homepage and `/lawyers/` desktop/mobile screenshots were captured under `project-control/visual-evidence/*post-pull*2026-05-10.png`.
- LIVE VERIFIED FOLLOW-UP ISSUE: rendered traffic topic fallback used `/traffic-law/`, which returns 301 to homepage.
- LIVE VERIFIED FOLLOW-UP ISSUE: `/legal-tools/` and `/legal-tools/ai-intake/` return 301 to homepage, so LegalTech CTAs are not safe until tool pages are published.
- CODE FIXED: traffic fallbacks now use `/lawyers/?area=traffic-law`, and LegalTech/header AI links fall back to `/#ask-lawyer` until the legal-tool pages exist.
- VERIFIED: PHP lint passed locally for 127 PHP files after the follow-up traffic/LegalTech fallback patch.
- SAFETY: no slugs, redirects, public content, sitemap rules, robots rules, wp-admin settings or database records were changed.
- NOT LIVE VERIFIED AFTER FOLLOW-UP FIX: requires another Upress pull/cache refresh after commit.

## LATEST LEAD / INTAKE STATUS - 2026-05-10 22:25 Asia/Jerusalem
- LIVE VERIFIED: homepage ask-lawyer form now posts to `wp-admin/admin-post.php` and includes the nonce/spam/attribution hidden fields.
- LIVE VERIFIED ISSUE: the pulled homepage ask-lawyer form still captures `lead_area=general` and `lead_urgency=normal` as hidden values, which is too thin for a LegalTech/AI fallback destination.
- LIVE VERIFIED ISSUE: homepage lead attribution still used an old recommendation-heavy source keyword in the hidden field.
- CODE FIXED: homepage ask-lawyer form now asks for email, legal area, city/region and urgency as visible public fields.
- CODE FIXED: homepage and lawyer-directory lead source keywords now use neutral portal/directory phrases instead of stale page meta.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead/intake form enrichment.
- SAFETY: no lead submissions were sent, no CRM records changed, and no public content/URLs/redirects changed.
- NOT LIVE VERIFIED AFTER FIX: requires Upress pull/cache refresh and one controlled lead submission test.

## LATEST WORK STATUS - 2026-05-10 21:55 Asia/Jerusalem
- CODE FIXED: no-URL-change homepage/directory SEO batch added safe primary/fallback internal links for major legal-intent topics.
- CODE FIXED: `inc/template-tags.php` now exposes `justice_theme_public_path_is_published()` and `justice_theme_safe_public_link()` so planned English pillar URLs are used only when published.
- CODE FIXED: header topic strip now includes divorce, criminal, real estate, medical malpractice, personal injury, traffic, employment, inheritance and AI intake links.
- CODE FIXED: featured pillar cards and topic-cluster links now use safe published-path checks and fallbacks.
- VERIFIED LIVE BEFORE FIX: `/criminal-lawyer/`, `/real-estate-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/` redirect to homepage, so direct hard-coded links were unsafe before the batch.
- VERIFIED LIVE BEFORE FIX: homepage and `/lawyers/` title/H1/meta were exported into `project-control/seo-title-h1-review.csv`; `/lawyers/` still shows the English `Archive` title leak on live.
- VERIFIED: PHP lint passed locally for 127 PHP files after this batch.
- DOCUMENTED: evidence and next steps are in `project-control/homepage-directory-seo-batch-001.md` and `project-control/homepage-directory-seo-batch-001.csv`.
- SAFETY: no slugs, redirects, public content, sitemap rules, robots rules, wp-admin settings or database records were changed.
- NOT VERIFIED LIVE: requires deployment/pull/cache refresh and visual recheck.

## LATEST VERIFICATION STATUS - 2026-05-10 21:30 Asia/Jerusalem
- VERIFIED: owner-provided PHP ZIP was installed locally at `C:\Users\janana\tools\php-8.5.6\php.exe`.
- VERIFIED: full repo PHP lint now passes for 127 PHP files; the previous "PHP lint blocked" status for the contextual SEO title fix is resolved locally.
- FIXED: `tools/php-lint.ps1` now discovers the local PHP 8.5.6 install before older Winget fallback paths.
- DOCUMENTED: local PHP setup is recorded in `project-control/php-local-setup.md`.
- NOT VERIFIED LIVE: `/articles/` still serves deployment marker `2026-05-10-runtime-guard-v5` and the old `Articles Archive | Jus-Tice.co.il` title, so commit `a90bf4b` is not live yet or is blocked by cache/sync.
- LIVE VERIFIED: `/not-a-real-page-justice-qa/` currently returns a 301 redirect to the homepage, which is a customer-facing 404/routing problem and likely requires uPress/wp-admin/server/cache review.
- LIVE VERIFIED: a sample Hebrew lawyer URL returns 200, but sampled HTML still contains old deployment marker and HTTP canonical/OG signals; this needs a post-deploy lawyer-profile/canonical QA pass.
- BLOCKED LIVE: uPress pull/cache refresh/wp-admin access is still needed before repo fixes can be called live customer-ready.
- LIVE VERIFIED: `https://jus-tice.co.il/sitemap_index.xml` is the active sitemap index and returns valid XML with 9 child sitemaps.
- LIVE VERIFIED BLOCKER: `/sitemap.xml`, `/wp-sitemap.xml`, and `/post-sitemap.xml` redirect to the homepage instead of returning XML.
- LIVE VERIFIED BLOCKER: active child sitemaps list many `http://` URLs: page sitemap 10/11 HTTP, articles sitemap 1 has 238/252 HTTP, articles sitemap 2 has 217/217 HTTP, and practice-area sitemap has 34/48 HTTP.
- DOCUMENTED: sitemap evidence is recorded in `project-control/sitemap-live-verification.csv`, `project-control/sitemap-strategy.md`, and `project-control/robots-htaccess-review.md`.
- CREATED: first no-URL-change remediation batch at `project-control/no-url-change-remediation-batch-001.md` and `project-control/no-url-change-remediation-batch-001.csv`.
- DOCUMENTED: media/document policy, legacy CPT migration review, and divorce mediation merge review now exist in `project-control/media-document-policy.md`, `project-control/legacy-cpt-migration-review.md`, and `project-control/divorce-mediation-merge-review.md`.
- VERIFIED: `/divorce-mediation-basics/` already exists and overlaps `/divorce-mediation/`; no duplicate publication or redirect is approved.
- DECISION: next safe unblocked task is a no-URL-change homepage/directory SEO batch, not article publication or URL migration.

## LATEST CONTENT AUDIT STATUS - 2026-05-10
- VERIFIED: GSC/GA4 continuous SEO intelligence baseline was expanded beyond keyword filters into Page indexing, Sitemaps, Core Web Vitals, HTTPS, Links overview, GA4 acquisition, GA4 events, and GA4 pages/screens.
- CREATED/UPDATED: `project-control/gsc-master-workflow.md`, `project-control/gsc-indexing-review.csv`, `project-control/gsc-core-web-vitals-review.csv`, `project-control/ga4-analytics-review.md`, `project-control/ga4-event-plan.csv`, `project-control/seo-title-h1-review.csv`, `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/sitemap-strategy.md`, and `project-control/daily-gsc-monitoring.md`.
- VERIFIED FROM GSC: Page indexing shows 198 indexed pages and 1.58K not indexed pages, including 785 crawled-currently-not-indexed URLs, 38 duplicate-without-user-selected-canonical URLs, 90 page-with-redirect URLs, 2 not-found URLs, and 1 Google-selected-different-canonical URL.
- VERIFIED FROM GSC DRILLDOWNS: sampled Page indexing examples show not-indexed URLs are a mix of media/PDF/DOCX URLs, legacy CPT URLs (`/labor_law/...`), old Hebrew taxonomy/category URLs, attachment redirect URLs, a test URL, and real content candidates such as `/divorce-mediation-basics`. This supports classification before deletion/redirect, not blanket cleanup.
- CLASSIFIED: first 16 sampled GSC indexing examples are now split in `project-control/gsc-indexing-example-classification.csv` into media/document noise, technical asset/probe URLs, legacy CPT migration candidates, old taxonomy/category URLs, redirect sources, and real content candidates.
- DECISION FROM CLASSIFICATION: valid 404/probe URLs should stay 404; media files require document-library policy; `/divorce-mediation-basics` must be compared/merged before any `/divorce-mediation/` publication; old criminal/family taxonomy URLs remain migration-sensitive.
- VERIFIED FROM GSC: Core Web Vitals summary shows 8 poor URLs and 8 needs-improvement URLs; drilldown metrics still need opening before template-level fixes.
- VERIFIED FROM GSC: HTTPS report shows 412 Non-HTTPS URLs, 25 HTTPS URLs, and 222 HTTPS-not-evaluated URLs, making HTTPS/canonical/sitemap consistency a migration blocker.
- VERIFIED FROM GA4: Organic Search is the largest visible channel with 1,261 sessions; total visible sessions are 2,447; key events are 0, so business conversions are not measurable yet.
- VERIFIED FROM GA4: `/` has 396 views and strong visible engagement, while `/lawyers/` has only 22 views but high repeat views/engagement, so homepage-to-directory routing and event tracking are priority.
- GSC BROAD INTENT FINDING: `עורך דין` has 10.4K impressions, 9 clicks, 0.1% CTR, average position 50.6; `עורכי דין` has 2.49K impressions, 4 clicks, 0.2% CTR, average position 29.7. Broad lawyer/directory intent is scattered and should be handled by homepage + `/lawyers/`, not random article rewrites.
- DECISION: first execution batch should be no-URL-change SEO architecture work: homepage/directory title-H1-meta review, internal links to approved pillars, GA4 key events, sitemap verification and GSC indexing drilldowns.
- MODE SHIFT: article-by-article publishing is paused. The active project is now full content audit, URL migration planning and SEO restructure.
- VERIFIED: public WordPress REST export completed with 1,220 public content rows and 1,707 extracted internal links.
- CREATED/UPDATED: `project-control/content-audit-access-plan.md`, `project-control/content-restructure-execution-plan.md`, `project-control/ai-content-audit-workflow.md`, `project-control/content-master-inventory.csv`, `project-control/content-quality-audit.csv`, `project-control/cannibalization-map.csv`, `project-control/url-migration-map.csv`, `project-control/redirect-map.csv`, `project-control/category-map.csv`, `project-control/topic-clusters.csv`, `project-control/internal-link-map.csv`, `project-control/sitemap-plan.md`, and `project-control/robots-htaccess-review.md`.
- VERIFIED: the first heuristic audit marks all GSC-dependent traffic fields as `UNKNOWN`; no fake GSC data was invented.
- VERIFIED: Google Search Console browser UI access now works for the `https://jus-tice.co.il/` property after owner-approved sign-in/2FA.
- VERIFIED: first GSC browser pass checked last-3-month query/page data for `עורך דין פלילי`, `דין פלילי`, `עורך דין גירושין`, `גישור גירושין`, and `עורך דין לענייני משפחה`.
- VERIFIED: second GSC browser pass checked last-3-month query/page data for `עורך דין מקרקעין`, `עורך דין רשלנות רפואית`, `עורך דין נזיקין`, and `עורך דין תעבורה`.
- CREATED: `project-control/gsc-browser-workflow.md`, `project-control/gsc-cannibalization-method.md`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, and `project-control/gsc-content-priorities.csv`.
- FOUND FROM GSC: clean pillar URLs do not yet own the competitive criminal/family terms; Google is mostly seeing old Hebrew slugs, uploaded documents, homepage and scattered legacy pages.
- FOUND FROM GSC: `עורך דין מקרקעין` has 153 impressions at average position 15.8, mostly landing on the homepage; this is a strong candidate for a controlled `/real-estate-lawyer/` pillar/internal-linking batch after inventory review.
- FOUND FROM GSC: `עורך דין רשלנות רפואית` has 1.34K impressions, mainly birth/pregnancy/c-section variants, but the visible page mapping points to a narrow fee article; this needs a malpractice pillar plus deeper export/manual review before migration.
- VERIFIED: page-to-query browser pass found `/real-estate-lawyer-cost-2025/` has 2 clicks, 3.85K impressions, 0.1% CTR and average position 50.1; it should support a future `/real-estate-lawyer/` pillar.
- VERIFIED: high-traffic media URLs include `06102016_1.pdf` with 99 clicks / 928 impressions / 10.7% CTR / position 8.1, plus foreign-lawyer list PDFs for Greece and Italy with 1.39K and 1.35K impressions. These must not be deleted during cleanup without review.
- VERIFIED: support-cluster GSC pass checked `קניית דירה`, `חוזה מכר`, `רשלנות רפואית בלידה`, `רשלנות רפואית בהריון`, `תאונת עבודה`, and `תאונת דרכים`.
- FOUND FROM GSC: `/real-estate-lawyer-cost-2025/` owns 871 of 885 impressions for `קניית דירה` and all 31 visible impressions for `חוזה מכר`; it is overloaded as a cost/support page and should not be the final pillar.
- FOUND FROM GSC: old Hebrew birth-malpractice URL owns 661 impressions for `רשלנות רפואית בלידה` and 419 impressions for `רשלנות רפואית בהריון`; pregnancy and birth malpractice need a careful split/merge plan before English slug migration.
- FOUND FROM GSC: `/car-accident-auto-injury-lawyer/` owns 79 of 84 impressions for `תאונת דרכים`; it needs review before deciding whether to keep it or migrate later to `/car-accident-lawyer/`.
- VERIFIED: work/traffic/inheritance variant GSC pass checked `עורך דין תאונת עבודה`, `פגיעה בעבודה`, `תאונת עבודה ביטוח לאומי`, `נהיגה בשכרות`, `שלילת רישיון`, `עורך דין ירושה`, `צוואה`, and `התנגדות לצוואה`.
- FOUND FROM GSC: work-accident exact variants returned no visible rows; traffic subtopic signals are currently mismapped or off-intent.
- FOUND FROM GSC: `צוואה` has 201 impressions and `התנגדות לצוואה` has 121 impressions, mostly on old case-law pages and one old Hebrew wills/inheritance page. This is an inheritance/wills cluster opportunity but requires merge planning.
- VERIFIED: overloaded page-to-query pass reconfirmed `/real-estate-lawyer-cost-2025/` as a real estate cost/payment support asset with 3.85K impressions and found `/car-accident-auto-injury-lawyer/` has 124 impressions mainly for fatal-accident/criminal-punishment intent.
- PARTIAL: direct GSC page filters for Hebrew malpractice and inheritance URLs returned zero rows even though those URLs appeared in query-to-page checks; this is documented as a browser-filter limitation, not proof of no traffic.
- BLOCKED: GSC API/download export, database/phpMyAdmin, wp-admin menu export and uPress server settings remain unavailable from this session without separate credentials/tooling.
- DECISION: no URL changes, redirects, deletes, noindex actions, sitemap edits or content overwrites will happen until the maps are reviewed and approved.
- RISK: `sitemap.xml` and `wp-sitemap.xml` returned homepage-like HTML in public shell checks, so sitemap generation must be verified/fixed before any migration.
- GSC MIGRATION WARNING: the old Hebrew divorce-lawyer URL has 960 impressions for `עורך דין גירושין`; the old Hebrew criminal Tel Aviv URL has 267 impressions for `עורך דין פלילי`. These must be protected until merge/redirect plans are approved.
- GSC OPPORTUNITY: homepage currently captures lawyer-intent impressions for real estate and traffic; these should be redirected by internal architecture, not by URL redirect, into clean pillar pages and supporting articles.

## LATEST CODE STATUS - 2026-05-10
- EXPANDED IN REPO: Criminal-law pillar draft at `content-drafts/criminal-lawyer-pillar-he.md` for `/criminal-lawyer/`, now 5,037 words and in 5,000-word-class draft status.
- CREATED IN REPO: Police-investigation supporting draft at `content-drafts/police-investigation-supporting-he.md` for `/police-investigation/`, now 3,500 words and connected back to the criminal-law pillar.
- CREATED IN REPO: Pretrial-detention supporting draft at `content-drafts/pretrial-detention-supporting-he.md` for `/pretrial-detention/`, now 3,500 words and connected back to the criminal-law pillar.
- DOCUMENTED: Pretrial-detention source audit and cannibalization note exist at `project-control/pretrial-detention-source-audit.csv` and `project-control/pretrial-detention-cannibalization-note.md`.
- SAFETY: `/pretrial-detention/` is draft-only. Existing arrest/procedure pages must be compared before any publication or redirect.
- VERIFIED: Word-count and internal-marker scan were run locally for the pretrial-detention draft; the public body has no internal project markers.
- DOCUMENTED: Police-investigation source audit and cannibalization note exist at `project-control/police-investigation-source-audit.csv` and `project-control/police-investigation-cannibalization-note.md`.
- SAFETY: `/police-investigation/` is draft-only. Existing criminal prosecution/arrest pages must be compared before any publication or redirect.
- VERIFIED: Word-count and internal-marker scan were run locally for the police-investigation draft; the public body has no internal project markers.
- DOCUMENTED: Criminal source audit and cannibalization note exist at `project-control/criminal-lawyer-source-audit.csv` and `project-control/criminal-lawyer-cannibalization-note.md`.
- SAFETY: `/criminal-lawyer/` is draft-only. Existing live pages such as `/criminal-prosecutions/` and the Hebrew arrests-law slug must be compared before any publication or redirect.
- VERIFIED: Word-count and internal-marker scan were run locally after expansion; the public body has no internal project markers. The draft still needs old-content comparison plus legal/source/GSC review before CMS import or publication.
- FIXED IN CODE: Public lead forms now carry hidden attribution fields for `source_keyword`, `utm_source`, `utm_campaign`, and `utm_medium` when available.
- BUSINESS VALUE: Lead records can now connect a CRM inquiry back to search/ad/source context instead of losing the context during form submission.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead-attribution patch.
- NOT VERIFIED LIVE: requires uPress pull and one controlled lead test from a URL containing keyword/UTM parameters.
- LIVE RECHECK AFTER PUSH `0c6cf21`: deployment marker remains absent and family-law pages remain dirty. Lead attribution is pushed, but not live-verified.
- FIXED IN CODE: Lawyer mini-site inquiry leads now persist `assigned_lawyer_id` and `source_keyword` in the lead CRM metadata.
- FIXED IN CODE: The lead admin detail box can show the assigned lawyer as a profile edit link, which makes Maya/lawyer mini-site inquiries traceable inside CRM.
- HARDENED: UTM values and lead-status saves now use `wp_unslash()` before sanitization, and lead-status saves require `edit_post` permission.
- SCOPE: Applied the same lead-routing patch to `justice-core`, `ultra-justice-engine`, and `ultra-justice` because the active live plugin folder is still not definitively verified.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead-routing patch.
- NOT VERIFIED LIVE: requires uPress pull and one controlled lead submission from a lawyer mini-site.
- LIVE RECHECK AFTER PUSH `31a0026`: deployment marker remains absent and family-law pages remain dirty. Lead routing is pushed, but not live-verified.
- FIXED IN CODE: Added a lightweight anti-spam guard for public legal lead forms. Shared lead forms, homepage ask-lawyer and lawyer mini-site inquiry now include a hidden honeypot and timestamp field.
- SAFETY: The guard runs before the plugin lead handler; filled honeypot or impossible timing is blocked without creating a CRM lead, while missing timestamp remains allowed for old cached forms.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead spam guard.
- NOT VERIFIED LIVE: requires uPress pull and a controlled test lead submission.
- LIVE RECHECK AFTER PUSH `9d19686`: deployment marker remains absent and family-law pages remain dirty. Lead spam guard is pushed, but not live-verified.
- FIXED IN CODE: Added a global publication safety gate for public posts/pages/articles. It blocks publish/future saves if internal markers like `NOT VERIFIED`, `project-control/`, `Source audit:`, `GSC`, `CMS`, `CRM`, slug metadata, keyword metadata, or owner/team notes remain in the body.
- SAFETY: Draft/private editing remains allowed so internal notes can be preserved in draft-only editorial notes.
- VERIFIED: PHP lint passed locally for 126 PHP files after the publication safety gate.
- NOT VERIFIED LIVE: requires uPress pull and a controlled wp-admin test publish attempt.
- LIVE RECHECK AFTER PUSH `76dc56f`: deployment marker remains absent and family-law pages remain dirty. Publication safety gate is pushed, but not live-verified.
- FIXED IN CODE: Header/footer/fallback menu URLs now use canonical English lawyer-directory filter slugs for personal injury and inheritance, while old `torts`/`inheritance` params are still normalized for compatibility.
- FIXED IN CODE: Existing WordPress menu repair is bumped to `justice_menu_area_urls_repaired_v2` so stale `torts`/`inheritance` menu items can be repaired even if the older v1 hook already ran.
- VERIFIED: PHP lint passed locally for 125 PHP files after the menu slug cleanup.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and menu repair hook execution.
- LIVE RECHECK AFTER PUSH `3fdae22`: deployment marker remains absent and family-law pages remain dirty. Menu repair versioning is pushed, but not live-verified.
- LIVE RECHECK AFTER PUSH `ae8726b`: deployment marker remains absent and family-law pages remain dirty. Canonical filter cleanup is pushed, but not live-verified.
- FIXED IN CODE: Lawyer directory now has customer-facing guidance cards, canonical fallback filter options, active-filter chips, public-approved profile count, and a general inquiry CTA.
- VERIFIED: PHP lint passed locally for 125 PHP files after the lawyer-directory changes.
- NOT VERIFIED LIVE: `/lawyers/` needs uPress pull/cache refresh and public visual check before calling this customer-ready.
- LIVE RECHECK AFTER PUSH `23e3807`: homepage deployment marker is still absent, static marker is still absent, and family-law pages still expose internal markers. The lawyer-directory fix is pushed but not live-verified.
- FIXED IN CODE: Public canonical pages now emit Hebrew-first alternate tags: `hreflang="he"` and `hreflang="x-default"`.
- SAFETY: Search pages, 404 pages and filtered lawyer-directory URLs are skipped because they are not primary public landing pages.
- VERIFIED: PHP lint passed locally for 125 PHP files after the hreflang change.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and public HTML recheck.
- BLOCKED LIVE: the deployment checker still needs to prove that live WordPress is serving the newest GitHub `main` code before any family-law cleanup, lawyer trust gate or hreflang work can be called live.
- LIVE RECHECK AFTER PUSH `2c418b4`: homepage deployment marker is still absent, static theme marker is still absent, and all seven family-law pages still expose internal markers. This is a live deployment/cache blocker, not a local PHP syntax blocker.

## VERIFIED
- Repo is available at `C:\Users\janana\jutice-theme` and tracks `origin/main`.
- Claude/Opus review is now converted into an explicit response file at `project-control/claude-opus-review-response.md`.
- Customer-facing screenshots were captured for homepage, articles archive, single article, lawyer archive, divorce pillar and a fake 404 URL under `project-control/visual-evidence/`.
- PHP lint passed locally for 120 PHP files after the customer-facing code pass.
- Live public recheck on 2026-05-10 11:48 Asia/Jerusalem returned HTTP 200 for the homepage and `/lawyers/?area=family-law`.
- Live public recheck VERIFIED that canonical tags and the header topic strip are present on the public homepage.
- PHP 8.3 is installed locally through Winget and can be run directly from the Winget package path in this session.
- PHP lint passed locally for 120 PHP files after fixing two legacy `ultra-justice` syntax issues.
- `tools/php-lint.ps1` is now available as the repeatable repo PHP syntax check and passes locally for 120 PHP files.
- Live homepage at https://jus-tice.co.il responds and is serving the Jus-Tice portal UI.
- Live `/lawyers/` responds and displays `justice_lawyer` profiles.
- Live `/lawyers/` currently includes `עו"ד מאיה רוטנברג`, but also still shows multiple demo profiles.
- Live profile links currently use Hebrew URL slugs; example observed: `/lawyers/%D7%A2%D7%95%D7%93-%D7%9E%D7%90%D7%99%D7%94-%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92/`.
- Live homepage DOM snapshot did not show obvious casino/gambling terms in this check.
- Google Search Console URL opened to the public/about screen; `jus-tice.co.il` property access was NOT VERIFIED in this browser check.
- Public wp-admin check redirects to `wp-login.php`, so authenticated admin work is BLOCKED from the current repo shell session unless an authenticated browser/connector is available.
- Public uPress filemanager URL redirects to login/session flow, so direct uPress pull/filemanager work is BLOCKED from the current repo shell session.
- Local theme has required WordPress files: `style.css`, `index.php`, `functions.php`, `header.php`, `footer.php`.
- `assets/images/logo.png` exists in repo.
- `assets/images/logo.png` is a dummy placeholder, not a usable final brand asset.
- Hero search form in local repo submits to the `justice_lawyer` archive with `area`, `city`, and `keyword` params.
- `latest-articles.php` no longer needs regular `post` content for homepage article feed in the intended architecture.
- Article pages can now resolve connected lawyer metadata through a shared public-lawyer resolver, including a Maya Rotenberg fallback while the live slug migration is pending.
- Imported repo draft metadata is normalized without Markdown backticks, and family-law article pages can render a connected cluster-navigation block.
- Family-law article cluster navigation styling is now class-based in CSS, with stronger tap targets and current-page state for mobile/desktop article sidebars.
- Lawyer mini-sites now prefer CMS-connected articles via `connected_lawyer_slug` before falling back to practice-area articles, so Maya can become a proper signed content hub once drafts are reviewed and published.
- Seeded WordPress menu practice-area links now use canonical lawyer-directory filter slugs such as `family-law`, `criminal-law`, `real-estate-law`, `labor-law`, and `traffic-law`.
- Lawyer archive filters now normalize legacy incoming area values such as `family`, `criminal`, `real-estate`, `labor`, and `traffic` to their canonical slugs before querying.
- Lawyer self-registration now collects richer mini-site fields: profile headline, services, process steps, video URL and FAQ ideas.
- Lawyer onboarding admin queue now surfaces mini-site field completeness, and owner notification email includes headline/video context.
- Lawyer registration now maps recognized submitted city names to `city` taxonomy terms on the draft profile, while still keeping the original free-text `cities_served` meta.
- Lawyer registration city field now suggests core city names so lawyers are more likely to enter values the taxonomy mapper can recognize.
- Lawyer registration has fallback primary-practice options with canonical English slugs if `practice-areas` terms are not available yet.
- Lawyer dashboard now includes a draft-only content request flow for logged-in lawyers with claimed profiles.
- Lawyer content request drafts are now visible in the Articles admin list through a `Content Origin` column and trigger an owner notification email.
- Lawyer dashboard now shows a lawyer-facing queue of submitted content requests with draft/publish state and legal/source review gates.
- Lawyer-requested article drafts now inherit the lawyer profile's practice-area terms and receive cluster metadata for editorial/SEO review.
- Lawyer dashboard now supports staged mini-site update requests that save to `pending_profile_*` metadata instead of changing public profile fields directly.
- Lawyer Onboarding admin queue now includes profiles flagged with `pending_profile_review = 1`, including published profiles that need update review.
- Lawyer Onboarding admin queue now previews pending mini-site update fields so owner review is faster.
- Lawyer Onboarding admin queue now has a nonce-protected action to apply reviewed pending mini-site updates into public profile fields while leaving final review status.
- Lawyer Onboarding admin queue now has a nonce-protected action to discard pending mini-site updates without changing public profile fields.
- Lawyer mini-site update submission/apply/discard events now append timestamped notes to lawyer `internal_notes` for lightweight CRM audit history.
- Lawyer Onboarding admin queue now previews the latest internal notes for each listed lawyer profile.
- Lawyer content request submissions now append timestamped notes to the requesting lawyer profile `internal_notes`.
- Lawyer content request submissions now flag the lawyer profile for pending content review, and Lawyer Onboarding shows the latest content request with a draft-review link.
- Lawyer Onboarding admin queue now has a nonce-protected action to mark a pending content request reviewed and clear the lawyer profile review flag.
- Legacy `ultra-justice` PHP 8 syntax errors in admin column fallback expressions are fixed in repo.
- Added a reusable PHP lint helper at `tools/php-lint.ps1`, replacing the one-off manual PHP path check with a repeatable local verification command.
- Header now includes a premium topic strip under the main navigation with Hebrew labels and English slug targets for core legal routes and AI intake.
- Latest repo commit `e511c00` is pushed to `origin/main`, but live public HTML does not yet show every fix from that commit.

## FIXED IN THIS PASS
- CODE FIXED: family-law editorial repair bumped to `v6` and now strips product/business/editorial-planning language from public article bodies, including paid-lawyer logic, lead monetization, owner strategy, CRM/CMS/GSC/LegalTech implementation notes, AI-internal routing and `Jus-Tice should` instructions.
- DOCUMENTED: publication workflow now explicitly bans business/product-planning notes from public articles.
- VERIFIED locally: PHP lint passed for 125 PHP files after the family-law public cleaner v6 pass.
- NOT VERIFIED LIVE: v6 repair requires uPress pull/cache refresh and public recheck of the seven family-law URLs.
- CODE FIXED: removed remaining visible English fallback strings from `index.php`, `home.php`, and `template-parts/content/content-none.php`.
- VERIFIED locally: PHP lint passed for 125 PHP files after the Hebrew fallback-template cleanup.
- NOT VERIFIED LIVE: fallback/search empty states require uPress pull/cache refresh and public visual recheck.
- CODE FIXED: added a conservative public approval gate for lawyer profiles so old seed/demo/testing lawyer records are no longer rendered as real public listings.
- CODE FIXED: lawyer archive now filters rendered cards through the approval gate; single lawyer pages return 404 for unapproved public profiles while admins can still inspect them.
- CODE FIXED: lawyer directory now outputs explicit Hebrew meta/OG tags, preventing generic "Archive" wording from leaking into previews.
- CODE FIXED: lawyer-card city display now maps `herzliya` to `הרצליה`.
- DOCUMENTED: `project-control/deep-dive-audit-v2-response.md` records the accepted/partial/blocker status for the V2 audit.
- VERIFIED locally: PHP lint passed for 125 PHP files after the lawyer trust gate.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and a public `/lawyers/` recheck.
- CODE FIXED: Maya Rotenberg mini-site now has a CMS-driven public-source sidebox so the profile can show reviewable public references instead of unsupported claims.
- CODE FIXED: a separate Maya public-source migration fills only empty source fields and the official website/source URL; it does not auto-fill phone, WhatsApp, email, photo, awards, ratings, reviews, bar number or case-achievement claims.
- DOCUMENTED: `project-control/maya-rotenberg-public-source-audit.md` records public sources used for the source layer: official firm site, official about page, Dun's 100, Psakdin, Easy and official press page.
- VERIFIED locally: PHP lint passed for 125 PHP files after the Maya public-source layer.
- NOT VERIFIED LIVE: Maya source layer requires uPress pull/cache refresh and profile render/admin review.
- MODE SHIFT APPLIED: emergency route blocking/quarantine work is stopped. The workflow is now editorial repair/enrichment: keep pages, clean public article bodies, move internal notes to a draft-only internal WordPress page, and continue anti-cannibalization/cluster work.
- CODE FIXED: unapproved-family route blocking was removed before commit, and the previous quarantine routine is now disabled by default.
- CODE FIXED: existing family-law pages can now be repaired in place with public-facing body content from the repo drafts; the repair does not delete, draft, redirect, or create missing pages.
- CODE FIXED: WordPress will create/update a draft-only internal page titled `Internal Editorial Notes — Family Law Cluster` with the team/source/CMS/GSC/publication notes extracted from the repo drafts.
- CODE FIXED: content-draft imports into the `articles` CPT now use public-cleaned body content and store internal notes separately in `internal_editorial_notes` meta.
- DOCUMENTED: `publication-cannibalization-check.csv` now marks the seven family-law URLs as `APPROVED_FOR_EDITORIAL_REPAIR`, meaning clean existing live pages now while merge/redirect decisions remain pending.
- LIVE RECHECK AFTER PUSH `d3ff1d6`: all seven family-law URLs still returned HTTP 200 with internal-note markers. This means uPress/live cache has not yet applied the editorial repair commit, or WordPress has not executed the repair hook yet.
- CODE FIXED: public article conversion now changes backticked internal URL references into real internal links and strips more internal SEO/CMS/CRM/GSC/LegalTech planning paragraphs before repair/import.
- CODE FIXED: bumped the family-law editorial repair version to `v2` so WordPress reruns the stricter repair after uPress pulls the latest commit.
- CODE FIXED: bumped the family-law editorial repair version to `v3` and changed the cleaner to remove whole internal Markdown sections by strong body markers, not only by exact heading matches.
- CODE FIXED: extracted internal sections are still preserved in the draft-only `Internal Editorial Notes — Family Law Cluster` page.
- VERIFIED locally: PHP lint passed for 124 PHP files after the v3 family-law repair hardening.
- VERIFIED locally: all seven family-law draft files scan clean after the v3 public-content cleanup function is applied.
- LIVE RECHECK after push `cd9b123`: all seven family-law URLs still expose internal markers publicly, so uPress/live WordPress has not yet pulled/executed the v3 repair or cache is still serving the previous page bodies.
- CODE FIXED: family-law editorial repair is bumped to `v4` and now purges common WordPress/page-cache layers after public-body repair, reducing the chance that visitors keep seeing old unsafe cached HTML after the database is cleaned.
- VERIFIED locally: PHP lint passed for 124 PHP files after the v4 cache-purge repair pass, and the seven-draft public-marker scan still passes.
- LIVE RECHECK after push `d5824ed`: all seven family-law URLs still expose internal markers publicly. GitHub is updated; live still needs uPress pull, wp-admin load/hook execution, or cache refresh.
- CODE FIXED: family-law editorial repair is bumped to `v5` and now includes a runtime public-content guard. If an approved family-law page renders with internal markers, the theme serves the cleaned article body from the repo draft, persists it back to the WordPress page, records guard metadata, and purges cache.
- VERIFIED locally: PHP lint passed for 124 PHP files after the v5 runtime guard, and the seven-draft public-marker scan still passes.
- LIVE RECHECK after push `d374407`: all seven family-law URLs still expose internal markers publicly. This confirms GitHub is ahead of the live WordPress files/cache; uPress pull or wp-admin execution remains required.
- CODE FIXED: added a public non-visual deployment marker in `<head>` so future checks can prove whether live WordPress is serving the latest theme code. Current marker: `2026-05-10-runtime-guard-v5`.
- VERIFIED locally: PHP lint passed for 125 PHP files after adding the deployment marker.
- LIVE RECHECK after push `9dd41aa`: homepage and `/divorce-lawyer/` do not contain `justice-deployment-marker` or `2026-05-10-runtime-guard-v5`. This VERIFIED that live WordPress is not yet serving the latest pushed theme code.
- CODE FIXED: added a static `deployment-marker.txt` and `tools/check-live-deployment.ps1` to separate GitHub state, uPress file sync state, WordPress PHP rendering state, and family-law public content cleanliness.
- VERIFIED locally: `tools/check-live-deployment.ps1` runs and confirms current live state: homepage PHP marker absent, static theme marker absent, and seven family-law URLs still dirty. Details documented in `project-control/deployment-verification.md`.
- LIVE RECHECK after push `542aeef`: the deployment checker still reports PHP marker absent, static theme marker absent, and all seven family-law pages dirty. This reinforces that live is not serving the latest pushed files.
- EDITORIAL SAFETY: family-law auto-publication remains paused as a creation mechanism, but existing live pages are now treated as content to repair and enrich rather than remove.
- LIVE VERIFIED: the seven family-law URLs were live and contained internal markers in the earlier public check; the current repo fix is to clean those pages in place on the next pull.
- CODE FIXED: the previous draft/restore cleanup routine is disabled by default and replaced by editorial repair for existing pages.
- LIVE RECHECK 13:52 Asia/Jerusalem: the pages still needed public-body cleanup on live.
- LIVE RECHECK 14:02 Asia/Jerusalem: the pages still needed public-body cleanup on live; the follow-up work is now editorial repair/enrichment rather than page removal.
- CODE FIXED: manual wp-admin publication now runs public-content and cannibalization preflight checks and blocks unapproved pages.
- CODE FIXED: internal-only sections such as NOT VERIFIED, source-audit notes, CMS/CRM/GSC notes, LegalTech product notes, owner/dev instructions, status sections and cannibalization notes are stripped/blocked from public output.
- DOCUMENTED: `project-control/publication-workflow.md`, `project-control/publication-cannibalization-check.csv`, and `project-control/publication-review-family-law-cluster.md` now define the required workflow.
- PREVIOUS PUBLICATION PACKAGE: a one-time publisher exists for the first family-law SEO cluster in `inc/live-content-publication.php`, but manual creation of missing public pages is no longer the preferred path. Current mode repairs existing pages and keeps article drafts in the `articles` CPT.
- CODE FIXED: the publisher creates/updates public root English-slug pages for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/`, and `/family-dispute-resolution/`.
- CODE FIXED: each published page gets SEO title/description, AEO/GEO summary meta, Article schema eligibility, visible internal cluster links, Maya Rotenberg connection, lead CTA and a public legal disclaimer.
- SAFETY VERIFIED IN CODE: existing root page content is backed up into post meta before replacement.
- DOCUMENTED: `project-control/live-content-publication-status.md` lists the exact public review links and publish status.
- LIVE RECHECK: after push `8e28528`, all seven new URLs still redirected to the homepage and did not expose publication markers, so uPress pull/cache/migration execution is still required.
- CODE FIXED: homepage topic clusters now include direct links to the seven family-law cluster pages; `/family-law/` now includes the family-dispute-resolution page in its supporting-topic map.
- CODE FIXED: the featured divorce pillar card now points to `/divorce-lawyer/` instead of the old `/family-law/divorce/` path.
- CODE FIXED: `Tools > Jus-Tice Content Drafts` now has an admin-only manual button to preflight and repair existing family-law pages without creating missing pages.
- Maya Rotenberg mini-site CMS bootstrap added in `inc/live-migrations.php`: it fills rich editable profile fields only when empty and targets only the verified Maya profile.
- Maya bootstrap adds services, process, approach, FAQ, CTA and credentials-style fields without fake ratings, awards, photos, bar number or paid claims.
- Practice-area archive pages now have an intent-first customer layer in `taxonomy-practice-areas.php`: problem framing, when-to-contact guidance, preparation checklist and a lead CTA.
- Practice-area CTAs now link to the filtered lawyer directory with canonical English area slugs where available, plus the homepage lead form.
- Practice-area visual styling added in `assets/css/premium-pass-3.css` for desktop/mobile cards and CTA panel.
- VERIFIED locally: PHP lint passed for 120 PHP files after the practice-area landing-page pass.
- LIVE RECHECK: homepage hero copy and article intent panel are now visible publicly, so part of the customer-facing theme pass is live.
- LIVE VERIFIED: `/family-law/` now exposes the practice intent layer publicly. Screenshot: `project-control/visual-evidence/family-law-live-intent-2026-05-10.png`.
- LIVE VERIFIED: `/lawyers/?area=family-law` now outputs a Jus-Tice fallback `noindex,follow` robots tag and base `/lawyers/` canonical. Screenshot: `project-control/visual-evidence/lawyers-family-filter-2026-05-10.png`.
- STILL BROKEN LIVE: Maya lawyer profile URLs are in a redirect loop between Permalink Manager English-to-Hebrew and theme Hebrew-to-English redirect logic.
- FIXED IN CODE: theme-side Maya Hebrew-to-English redirect is now disabled by default behind `justice_theme_enable_maya_slug_redirect` to stop the redirect loop after deployment.
- English practice slug pages served through generic `page.php` now get a structured practice landing template when the page slug matches a controlled legal area such as `/family-law/`, `/criminal-law/`, `/traffic-law/`, `/real-estate-law/`, `/labor-law/`, `/inheritance/`, `/torts/`, `/medical-malpractice/`, or `/national-insurance/`.
- The page-route practice landing layer includes intent cards, supporting-topic links, a lead form, related articles and a Maya Rotenberg card only on the family-law route when her public profile can be resolved.
- VERIFIED locally: PHP lint passed for 122 PHP files after adding the reusable practice landing helper/template.
- PARTIAL LIVE: `/family-law/` now shows the practice intent layer, but the separate generic `practice-landing` page fallback marker is not visible; route ownership still needs wp-admin/permalink review.
- Lawyer mini-site template now includes an engagement module explaining structured inquiry, signed content, video/media and verified reviews without inventing ratings or claims.
- CODE FIXED: added `inc/routing-guards.php` to turn suspicious "unknown URL served as homepage" requests into real 404 responses before WordPress canonical redirect can send them to the homepage.
- VERIFIED locally: PHP lint passed for 123 PHP files after adding the routing guard.
- NOT VERIFIED live: fake URL `/not-a-real-page-justice-qa/` must be rechecked after uPress pull/cache refresh; currently live still redirects that path to the homepage.
- Maya bootstrap can attach `family-law` and a city term only where safe, and adds an internal note for admin review.
- Homepage hero copy is now more direct: it speaks to users who need a lawyer or legal direction, not only generic portal language.
- Primary navigation now has a code safety layer that appends missing customer-critical links when the assigned WordPress menu is too thin.
- Added a temporary SVG favicon fallback when WordPress Site Icon is not configured.
- Breadcrumbs now have premium CSS/RTL treatment instead of visible ordered-list numbering.
- Single article pages now show a short intent panel before the body: problem, lawyer threshold, and how Jus-Tice helps.
- Article archive copy now frames guides by user problem and anti-cannibalization.
- Lawyer cards no longer show a sponsored badge unless the profile has an active paid subscription and is not seed/demo data.
- Common city slugs in lawyer cards are mapped to Hebrew display labels where possible.
- 404 template copy is now Hebrew and user-friendly, although live routing still needs investigation.
- Added tracked `page-home.php` because the live homepage is assigned to the `page-home.php` page template, not only `front-page.php`.
- Removed failed package artifacts from the previous interrupted ZIP attempt.
- Added a canonical source candidate at `justice-core/justice-core.php` for repo review.
- Fixed taxonomy ownership in legacy plugin folders: `city` now attaches to `justice_lawyer`; `practice-areas` now attaches to `articles`, `justice_lawyer`, and `post`.
- Fixed duplicate `</main>` in `archive-justice_lawyer.php`.
- Fixed one remaining English lead-form label: "Short description" -> Hebrew.
- Added canonical `justice-core/v1` REST aliases in the new `justice-core` candidate for health, site-state, plugin-registry, content inventory, spam candidates, duplicate titles, lawyers, and leads.
- Fixed lead REST reporting in the new `justice-core` candidate to read canonical lead meta keys (`visitor_name`, `visitor_phone`, `legal_area`, `source_url`).
- Homepage featured-lawyer section now queries only `advocate-maya-rotenberg` and does not show fake/demo lawyer cards.
- Lawyer profile meta model now includes initial mini-site fields for video, social links, homepage feature flag, review count, and average rating.
- `single-justice_lawyer.php` is now a richer lawyer mini-site template with hero, CTAs, video support, practice areas, related content, reviews placeholder, social links, and lead form.
- `lawyer-card.php` is now a richer premium card and avoids fake ratings or unsupported "top lawyer" claims.
- Homepage featured lawyer section now has a fallback lookup for live posts still using the Hebrew title while slug migration is pending.
- Seeder now assigns `advocate-maya-rotenberg` to the Maya Rotenberg seed/profile and generates English-only slugs for future seed profiles.
- Admin lawyer meta boxes now expose video URL, social URLs, homepage feature flag, approved review count, and approved average rating.
- Lawyer mini-site now reads additional CMS fields for headline, subheadline, approach, services, process, credentials, media links, FAQs, testimonials and final CTA.
- Homepage templates now include an editable WordPress page-content band through `template-parts/sections/home-page-content.php`, with a basic spam keyword guard.
- Self-serve/passive-income platform direction documented in `project-control/self-serve-lawyer-platform-plan.md`.
- Breadcrumbs fixed in repo: generic single posts no longer render breadcrumbs twice, and lawyer/article/archive breadcrumb hierarchy is explicit.
- Final URL decision documented: Hebrew content/UI with short clean English slugs only.
- URL strategy files created/updated: `url-strategy.md`, `slug-normalization-rules.md`, `url-migration-map.csv`, and legacy `url-slug-migration-plan.md`.
- Strategic goals file created at `project-control/strategic-goals.md`.
- Hebrew-slug audit file created at `project-control/url-hebrew-audit.csv`.
- SEO goal files updated around English-slug pillar architecture: `topic-clusters.csv`, `internal-link-opportunities.csv`, `cannibalization-map.csv`, `keyword-serp-plan.md`, `serp-research-log.csv`, and `title-audit.csv`.
- Legal pillar CMS controls added in `inc/pillar-pages.php`.
- Draft seeding added for the first pillar pages: `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, and `/medical-malpractice-lawyer/`.
- Draft seeding added for the first 5 SEO article starters: divorce, criminal, traffic, real estate, and labor law. These are intentionally draft-only and marked for legal/editorial review.
- Practice-area taxonomy pages upgraded into richer hubs with lawyer cards, article cards, LegalTech tools, and related practice links.
- Lawyer self-registration funnel added. `/lawyer-registration/` can collect lawyer details and create draft/pending `justice_lawyer` profiles for review.
- Lawyer onboarding review workflow documented in `project-control/lawyer-onboarding-workflow.md`.
- Lawyer registration now sends an admin email and adds a WordPress admin review queue at `Lawyer Onboarding`.
- Owner CRM overview added at `Justice CRM` in WordPress admin for leads and LegalTech requests.
- Core practice-area term seeder added for the 10 main legal areas with Hebrew names and English slugs.
- Header/footer fallback no longer renders the dummy bundled logo. It now renders a Jus-Tice wordmark with a red blinking dot when no WordPress custom logo is configured.
- Lawyer seeders hardened across all plugin candidates: demo profiles use canonical practice-area slugs where available, remain draft/unverified/inactive, are not homepage-featured, are not lead-routed, and are marked `SEED_DATA`.
- Added first LegalTech product layer in code: CMS-backed legal tools, private tool requests, homepage gateway, archive/single templates, and starter tools for AI intake, demand letter, family agreement, and real-estate contract review.
- Added `project-control/legaltech-platform-roadmap.md` to document the broader document automation, AI console, lawyer-review and passive-income product plan.
- Article sidebar lawyer lookup now uses `justice_theme_get_connected_lawyer_by_slug()` instead of a raw slug-only lookup, so family-law drafts connected to `advocate-maya-rotenberg` can still show Maya when live data is temporarily on the old Hebrew slug.
- Content draft imports now strip Markdown backticks from metadata fields, preventing values like `family-law` or `advocate-maya-rotenberg` from being stored with literal backticks.
- Single article sidebars now show a family-law cluster navigation module for imported family-law drafts, linking the divorce pillar and supporting article URLs with Hebrew labels and English slugs.
- Article cluster navigation was moved out of inline styling into `premium-pass-3.css`, improving mobile usability and making future visual QA/polish safer.
- Maya/lawyer mini-site article feed now queries published articles explicitly connected to the lawyer by `connected_lawyer_slug`, including a temporary backtick-tolerant match for any drafts imported before metadata normalization.
- Menu seeding and repair now normalize stale filter URLs like `/lawyers/?area=family` to `/lawyers/?area=family-law` without rebuilding the full menu.
- Lawyer archive query handling now accepts old short area filter values and converts them to canonical values, protecting users and crawlers that hit older links.
- Lawyer onboarding handler now stores mini-site inputs as draft metadata for admin review instead of forcing the owner to gather that information manually later.
- Lawyer onboarding admin review table now shows a mini-site content checklist, reducing owner effort when deciding which registrations are ready for polishing.
- Lawyer onboarding now auto-assigns known city terms such as Tel Aviv, Jerusalem, Haifa and Ramat Gan to draft profiles so future directory filtering needs less manual cleanup.
- Lawyer registration form now includes a city datalist for the seeded/core cities while still allowing multiple free-text areas.
- Lawyer registration primary-area select no longer depends entirely on live taxonomy seeding; it can show canonical fallback options during setup.
- Lawyer content requests create draft `articles` records connected to the lawyer slug and marked for legal/source review before publication.
- Articles admin review columns now distinguish repo drafts from lawyer-requested drafts and show the connected/requesting lawyer context.

## NOT VERIFIED
- LIVE NOT VERIFIED: the seven family-law cluster URLs will publish only after this commit is pushed, uPress pulls it, and WordPress executes the one-time publication migration.
- GSC NOT USED YET: no Search Console traffic-risk scoring has been applied to these publication URLs.
- Active live plugin path and name.
- Whether live WordPress activates `ultra-justice`, `ultra-justice-engine`, or another Justice plugin.
- WordPress version, PHP version, active plugin list, and debug log.
- Whether GitHub sync deploys only the theme directory or also plugin directories.
- Whether `justice-core/` is recognized on live; it has not been activated live.
- Visual rendering quality after current local changes; no browser QA cycle has been run in this pass.
- Live homepage does not yet show Maya Rotenberg at the time of browser verification.
- Live `/lawyers/advocate-maya-rotenberg/` currently redirects to the homepage, indicating the live slug is not migrated yet.
- GSC property visibility, sitemap status, and performance data are NOT VERIFIED.
- The new homepage lawyer section was not visible before adding `page-home.php` because the live page assignment uses `page-template-page-home`.
- Lawyer self-registration and a front-end lawyer dashboard MVP are built in code. Billing, AI console, self-edit workflow and full approval automation are still NOT BUILT.
- Lawyer plan presentation and WooCommerce product-ID mapping helpers are built in code. Live billing is NOT enabled and remains blocked pending WooCommerce setup, product IDs, gateway testing and legal/ethical review.
- Rule-based lead intake classification is built in code. Leads now receive detected area, detected urgency, summary and routing notes on save.
- GSC weekly report automation scaffold is built: GitHub Action plus Python report generator for opportunities, low CTR, positions 5-20 and cannibalization CSVs.
- GSC report script smoke test ran locally without secrets and safely generated BLOCKED placeholder CSVs instead of fake data.
- City-practice architecture is built in code: core city seeder, city-practice template and five draft English-slug city/practice pages.
- Public lead form upgraded to collect email, city/area, urgency and consent so CRM/AI classification receives usable routing data.
- Lawyer monetization pages are linked from footer: registration, plans and dashboard.
- Live `/legal-tools/` is NOT VERIFIED until GitHub/Upress sync is pulled and WordPress rewrites/cache are refreshed.
- Starter LegalTech tool posts are NOT VERIFIED on live; seeding runs on an admin dashboard visit after plugin code is active.
- SERP research is PARTIAL. Initial web sampling was recorded, but manual top-10 capture, People Also Ask, autocomplete, and GSC data are still NOT VERIFIED.
- Legal pillar draft pages are NOT VERIFIED on live; they seed only after Upress pulls the commit and an admin dashboard visit runs.
- Draft SEO article starters are NOT VERIFIED live; they seed only after Upress pulls the commit, the `articles` CPT exists, and an admin dashboard visit runs.
- Current draft SEO article starters are NOT enough for publication. User direction is 5,000-word-class pillar/supporting articles built from SERP reverse engineering, intent mapping, FAQs, related lawyers, and internal links.
- Practice-area hub rendering is NOT VERIFIED on live after this pass.
- Lawyer registration page and submission handler are NOT VERIFIED live until latest code is pulled and `/wp-admin/` runs the page seeder.
- Lawyer dashboard page is NOT VERIFIED live; it seeds `/lawyer-dashboard/` after Upress pull and an admin dashboard visit.
- Lawyer plans page is NOT VERIFIED live; it seeds `/lawyer-plans/` after Upress pull and an admin dashboard visit.
- Lead classification is NOT VERIFIED live; it requires a test lead after Upress pull and active `justice_lead` CPT.
- GSC automation is NOT VERIFIED; it requires GitHub secrets and Search Console service-account access.
- City terms and draft city-practice pages are NOT VERIFIED live; they require Upress pull and admin dashboard visit.
- Upgraded lead form is NOT VERIFIED live after Upress pull.
- Lawyer onboarding admin queue and email notification are NOT VERIFIED live.
- Justice CRM admin overview is NOT VERIFIED live.
- Practice-area term seeding is NOT VERIFIED live; it runs after Upress pull and an admin dashboard visit, if the taxonomy is active.
- Header/footer logo fallback is NOT VERIFIED live after this pass.
- Hardened lawyer seeding is NOT VERIFIED live; it requires Upress pull and the active plugin/admin seeder path.
- Live visual screenshot check ran again on 2026-05-10. Homepage returned 200 and latest repo markers (`brand-lockup--justice`, `hero__visual`, `article-card__placeholder--legal`) are present live, so GitHub/Upress sync is now VERIFIED for the latest theme changes.

## STILL BROKEN / RISK
- NEEDS LIVE VERIFICATION: Maya mini-site bootstrap will not run until the latest theme code is pulled and WordPress executes `init`.
- NEEDS ADMIN REVIEW: Maya profile contact details, photo, video, license/bar data and final copy approval still require wp-admin review.
- LIVE VERIFIED STILL BROKEN: a fake URL (`/not-a-real-page-justice-qa/`) returned the homepage with HTTP 200 instead of a real 404; likely needs permalink/plugin/server inspection.
- LIVE VERIFIED STILL WEAK: desktop primary menu currently shows only a thin assigned menu; code now mitigates this, but wp-admin menu assignment is still required for a clean permanent fix.
- NEEDS LIVE VERIFICATION: breadcrumb CSS, menu augmentation, favicon fallback, article intent panel and lawyer-card badge/city cleanup after Upress pulls this pass.
- POST-PUSH LIVE RECHECK: after commit `5b4f16e`, public homepage still did not show the new hero copy, fallback favicon, or appended menu marker; single article did not show `article-intent-panel`. This means the latest commit is NOT LIVE yet or cache is serving old assets/templates.
- NOT VERIFIED LIVE: Homepage ask-lawyer form still did not expose `admin-post.php` or `justice_submit_lead` in the public HTML check, so the newest lead-form wiring from `e511c00` has not been confirmed live.
- NOT VERIFIED LIVE: `/lawyers/?area=family-law` returned 200 and canonical output, but did not expose `noindex` in the public HTML check, so the newest filtered-directory robots hardening from `e511c00` has not been confirmed live.
- BLOCKED: Upress/GitHub pull/cache state is not directly verified from the repo-only workflow; live may need another Upress pull or cache refresh before these latest theme changes appear publicly.
- Repo still contains duplicate plugin-like folders: `ultra-justice/`, `ultra-justice-engine/`, and new `justice-core/`.
- Do not delete the legacy plugin folders until live active plugin path is verified; otherwise GitHub sync could remove the currently active plugin and break CPTs.
- Do not merge `origin/claude/justice-website-review-aovSK` wholesale; it deletes newer `main` work and must only be used as a reviewed patch source.
- Live lawyer cards show city slugs such as `tel-aviv` in the public extract, which means terms or assigned values may not be user-facing Hebrew in every place.
- Live archive still exposes multiple demo lawyers publicly; this must be cleaned or moved to draft/private from WP admin/API after active plugin and content ownership are verified.
- Existing public demo lawyers on live may predate the hardened seeder and require manual/API cleanup after backup.
- The 5 article starters are not publication-ready; they are scaffolds only. Production target is long-form, source-backed, reviewed legal content, not short SEO stubs.
- First long-form divorce pillar production draft now exists in repo at `content-drafts/divorce-lawyer-pillar-he.md` and was expanded to about 5,083 words with a decision map, process timeline, document checklist, common mistakes, rabbinical/ketubah notes, agreement/common-law/children/assets/urgent-relief sections, lawyer-comparison guidance, FAQ, CMS module plan and official-source anchors. It is source-audited in `project-control/divorce-pillar-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- First supporting family-law draft now exists at `content-drafts/consensual-divorce-supporting-he.md` and was expanded to about 3,518 words with agreement-quality checks, agreement structure, approval workflow, cost caution, children/risk sections, CRM intent, CMS module plan, common mistakes and a LegalTech readiness-tool concept. It is source-audited in `project-control/consensual-divorce-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Consensual-divorce source audit now exists at `project-control/consensual-divorce-source-audit.csv`; official gov.il and Kol Zchut source candidates were search-verified and unresolved price/children/property/pressure claims remain blocked for review.
- Second supporting family-law draft now exists at `content-drafts/divorce-mediation-supporting-he.md` and was expanded to about 3,525 words with suitability test, mediation types, preparation checklist, failure paths, power-imbalance warnings, children section, legal-advice boundary, pricing caution, anti-cannibalization, CMS layout and LegalTech questionnaire concept. It is source-audited in `project-control/divorce-mediation-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Divorce-mediation source audit now exists at `project-control/divorce-mediation-source-audit.csv`; gov.il/Midrag source candidates were search-verified and confidentiality, mediator-role and power-imbalance claims remain blocked for legal review.
- Third supporting family-law draft now exists at `content-drafts/child-support-supporting-he.md` and was expanded to about 5,019 words with no-fake-calculator policy, intake model, medor, exceptional expenses, time-sharing, variable income, agreement clauses, temporary support, age bands, proof/evidence, modification, unmarried parents, anti-cannibalization, cautious examples, FAQ, CMS structure, enforcement cautions, CRM routing, decision paths and LegalTech tool guardrails. It is source-audited in `project-control/child-support-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Child-support source audit maps court procedure, financial-detail form, National Insurance payment/collection rules, change-of-support guidance, 919/15, calculator policy and age/medor/time-sharing claims to source candidates or legal-review blockers. BTL and Kol Zchut direct checks returned 200 where tested; gov.il source candidates returned 403 in scripted checks and remain browser verification items.
- Fourth supporting family-law draft now exists at `content-drafts/child-custody-supporting-he.md` and was expanded to about 4,575 words with custody-vs-parenting-time terminology, parenting schedules, holidays, logistics, parent communication, risk situations, professional factors, relocation/school changes, age bands, temporary-vs-permanent arrangements, breach/enforcement cautions, proof/evidence guidance, urgent situations, CRM intake model, LegalTech parenting-plan tool concept, Maya mini-site modules, CMS layout, decision paths, agreement-structure guidance, success metrics, common mistakes and anti-cannibalization links. It is source-audited in `project-control/child-custody-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Child-custody source audit maps custody/time-sharing procedure, family-dispute filing, dispute-resolution process, interim relief, assistance units, legal aid, social-work reports, tender terminology, child-wishes, parental alienation, risk/urgency and evidence guidance to source candidates or legal-review blockers. gov.il direct checks returned 403 in scripted checks and remain browser verification items.
- Fifth supporting family-law draft now exists at `content-drafts/divorce-property-division-supporting-he.md` and was expanded to about 4,553 words with asset map, rupture-date caution, prenuptial agreement review, premarital home, inheritance/gifts, pension documentation, business/company/self-employed issues, tech options, family-vs-personal debts, hidden-asset warning signs, asset table, staged workflow, expert roles, home-sale alternatives, common mistakes, urgency detection, CRM intake fields, lawyer monetization modules, decision paths, publication gates, follow-up cluster plan, anti-cannibalization boundaries, LegalTech property-map tool and CMS structure. It is source-audited in `project-control/property-division-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Property-division source audit maps resource balancing, excluded assets, pension division, tax authority pension-transfer guidance, family-dispute procedure, interim relief, rupture date, premarital home, intent to share, agreements, inheritances/gifts, business/options, debts and hidden-assets warnings to source candidates or legal-review blockers. Kol Zchut direct checks returned 200; gov.il source candidates returned 403 in scripted checks and remain browser verification items.
- Existing live Hebrew slugs need a controlled English-slug migration with 301 redirects; repo changes prevent future seed slugs but do not automatically fix already-published URLs unless an approved migration runs.
- Live homepage extract shows "Content is protected !!", likely from a content-protection/accessibility/plugin layer; source and impact are NOT VERIFIED.
- Spam source remains NOT VERIFIED. Homepage may be hiding spam by querying only `articles`, but database cleanup is still required.
- Live visual recheck found fallback wordmark order reversed on RTL (`Tice dot Jus`). FIXED IN REPO with LTR isolation; live verification pending next Upress pull.
- Header fallback menu is stronger in repo: readable Hebrew labels, LegalTech and lawyer-registration links, corrected English filter slugs, and heavier premium nav styling. LIVE NOT VERIFIED.
- Header topic strip is VERIFIED LIVE in public HTML and screenshots. Evidence: `project-control/visual-evidence/homepage-topic-strip-desktop.png` and `project-control/visual-evidence/homepage-topic-strip-mobile.png`.
- Header recheck on live public homepage found `brand-lockup--justice`, `/legal-tools/`, and `/lawyer-registration/` links present. Dummy logo text was not present.
- Search and archive pagination labels were cleaned in repo: search results, previous/next labels, article archive pagination, and lawyer archive pagination no longer use English or mojibake arrows.
- CMS draft-import bridge added in repo: `Tools > Jus-Tice Content Drafts` can import repo Markdown drafts from `content-drafts/` into the `articles` CPT as draft-only posts. It never publishes content and blocks refresh of already-published articles.
- CMS draft-import bridge now supports admin-only bulk draft import for all repo drafts. Bulk import still keeps everything draft-only and preserves the block on refreshing already-published articles.
- Articles admin list now has repo-draft review columns for imported drafts: source file/status, legal/source verification gates, source-audit file and draft word count.
- Single article pages now read imported draft metadata and can show legal/source review status, source-audit file, draft word count/status, and a connected lawyer mini-site card when `connected_lawyer_slug` is present.
- Family-law cluster map now exists at `project-control/family-law-content-cluster-map.md`, with anti-cannibalization roles and internal-link rules for the divorce pillar and first five supporting drafts.
- Content inventory and title audit now include the first six repo-maintained family-law drafts with word counts, status, intent, duplicate-risk notes, and review/import actions.
- Divorce pillar source audit now exists at `project-control/divorce-pillar-source-audit.csv`. It maps official/legal-reference sources to sensitive sections and keeps unresolved legal claims blocked from publication. Kol Zchut source URLs were direct-check verified where possible; gov.il direct checks returned 403 and remain browser/source-review items.
- Family-law publication readiness file now exists at `project-control/family-law-publication-readiness.csv`; all six first-cluster drafts are mapped with word counts, source-audit files, CMS module requirements, blockers and import order.
- Seventh family-law supporting draft now exists at `content-drafts/family-dispute-resolution-supporting-he.md` for `/family-dispute-resolution/`, with a source audit at `project-control/family-dispute-resolution-source-audit.csv`.
- Family-dispute-resolution draft is intentionally NOT publication-ready: it is now 3,521 words, but still needs legal review, browser source verification, and cannibalization review against existing live Jus-Tice URLs.
- Cannibalization note created at `project-control/family-dispute-resolution-cannibalization-note.md`; existing live URLs `/request-for-family-dispute-settlements` and `/is-a-law-for-the-settlement-of-family-disputes-successful/` are marked as merge/redirect review candidates, with traffic risk UNKNOWN until GSC data is checked.
- Reviewed `origin/claude/justice-website-review-aovSK` and documented it at `project-control/branch-review-claude-aovsk.md`.
- FIXED: Homepage ask-lawyer section now posts to the existing `justice_submit_lead` admin-post handler instead of `action="#"`.
- FIXED: Footer WhatsApp number is now configurable through the WordPress Customizer via `justice_whatsapp`.
- FIXED: Non-singular canonical URLs and `noindex,follow` for search/filter states are implemented in `inc/seo.php`.
- FIXED: Lawyer mini-site pages now output conservative `Attorney` JSON-LD without fake ratings or unverified claims.
- FIXED: Lawyer profile view counting now skips logged-in/admin/feed/ajax/cron/bot/preview traffic.

## INTEGRATED SEO / DESIGN / CONTENT LAYER
- ACCEPTED: SEO content architecture and page design must now be planned together. The working rule is content cluster + URL + template + related links + mobile + schema + sitemap + analytics as one system.
- CREATED: `project-control/homepage-seo-design-alignment.md` for the homepage portal-entry strategy.
- CREATED: `project-control/related-content-strategy.md` and `project-control/related-content-map.csv` so related articles become semantic cluster links instead of random latest posts.
- CREATED: `project-control/kol-zchut-article-structure.md` to standardize public legal articles around practical user-facing sections.
- CREATED: `project-control/lawyer-mini-site-strategy.md` and `project-control/lawyer-mini-site-fields.csv` for richer lawyer profile/mini-site architecture.
- CREATED: `project-control/lawyer-funnel-strategy.md` and `project-control/payment-and-subscription-model.md` for marketplace monetization planning without implementing payments.
- CREATED: `project-control/mobile-first-template-review.md`, `project-control/accessibility-review.md`, `project-control/entity-schema-review.md`, `project-control/image-seo-review.md` and `project-control/faceted-navigation-indexing-review.md`.
- CREATED: `project-control/analytics-monitoring-plan.md` and `project-control/integrated-launch-checklist.md`.
- UPDATED: `project-control/ga4-event-plan.csv` with `generate_lead`, `lawyer_signup_start` and `related_article_click`.
- STATUS: CODE/DOC FIXED in repo; NOT LIVE EXECUTED. No URLs, redirects, sitemap settings, robots rules, public content or payments were changed.
- VISUAL VERIFIED: integrated desktop/mobile screenshots captured for homepage, articles archive, one article, lawyer directory, sample lawyer profile URL, family practice page, search and 404 test at `project-control/visual-evidence/integrated-*-2026-05-10.png`.
- LIVE VERIFIED WEAK: `/articles/`, `/lawyers/` and search still show English/default title leaks (`Articles Archive`, `Archive`, `You searched for`) in live HTML during this pass.
- FIXED IN CODE: `inc/seo.php` now uses contextual Hebrew SEO titles through WordPress title parts and common SEO-plugin title filters.
- LIVE VERIFIED BROKEN: sample Hebrew lawyer profile URL renders homepage-style content with status 200 and homepage canonical; not a real mini-site/profile experience.
- LIVE VERIFIED BROKEN: fake 404 URL finalizes as homepage with status 200.
- LIVE VERIFIED RISK: `/practice-areas/family-law/` finalizes to `http://jus-tice.co.il/family-law/`, so HTTPS/canonical consistency needs review.
- LIVE VERIFIED MOBILE RISK: sticky WhatsApp/lead CTA and accessibility button overlap important content on several mobile views.
- NOT VERIFIED: PHP syntax lint for the latest `inc/seo.php` title fix because PHP is not installed in this local session.

## 2026-05-10 UPRESS PULL + MOBILE FLOATING CTA LIVE STATUS
- LIVE VERIFIED: uPress theme folder was pulled from GitHub after commits `ffc08c8` and `b7763b7`; uPress cache clear was triggered after each pull.
- LIVE VERIFIED: public CSS now contains the homepage-only mobile hide rule for `.whatsapp-float` and third-party `a.whatsapp-button`.
- LIVE VERIFIED: public CSS still keeps the compact 54px third-party mobile button behavior for non-home pages.
- VISUAL VERIFIED: homepage mobile screenshot `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png` shows the search form and CTAs are no longer covered by floating WhatsApp bubbles.
- VERIFIED: computed mobile homepage geometry reports `display: none` for both floating WhatsApp controls on `body.home` and no horizontal overflow.
- LIVE VERIFIED: sample article `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"`, proving the semantic related-content implementation is live at least on the tested article.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, CRM data, payments, lawyer records or database rows were changed in this pass.
- NOT VERIFIED: related-content quality still needs manual visual review across family, criminal and real-estate article examples.
- NOT VERIFIED: mobile floating controls on non-home inner pages still need a separate article/directory QA pass.

## 2026-05-10 LAWYER REVIEWS / REPUTATION MODULE
- ACCEPTED: reviews, ratings, reputation and trust are now a major planned product/SEO/business module.
- CREATED: `project-control/reviews-reputation-research.md`, `google-reviews-integration-plan.md`, `lawyer-rating-system-spec.md`, `lawyer-review-fields.csv`, `review-schema-policy.md`, `review-compliance-risk.md`, `reviews-compliance-risk.md`, `reputation-product-roadmap.md`, and `maya-rotenberg-reputation-plan.md`.
- CREATED: `project-control/final-integrated-launch-checklist.md` and `project-control/seo-aio-geo-strategy.md` to carry the module into launch/SEO planning.
- UPDATED: `lawyer-mini-site-strategy.md`, `payment-and-subscription-model.md`, and `integrated-launch-checklist.md`.
- VERIFIED: research used official Google Business Profile, Google Places, Google review schema and Google Maps UGC policy docs, plus Avvo, Justia, Midrag, LawReviews and Israeli lawyer-advertising rule references.
- DECISION: MVP should start with verified Google Place ID/review link/manual rating-count fields and profile completeness; first-party reviews, API sync and review schema come later.
- BLOCKED: Google API sync requires API key/billing/OAuth/terms review and lawyer/business authorization.
- NEEDS LEGAL REVIEW: Israeli lawyer advertising, testimonials, directory ratings, paid placement disclosure, review moderation and any public stars/rating/schema.
- SAFETY: no review CPT, ratings, schema, public profile changes, API calls, database updates or fake review content were implemented.

## 2026-05-11 LAWYER REVIEWS / REPUTATION DEEPENING
- ACCEPTED: the module is not just a design widget; it is a trust, SEO, mini-site, conversion and monetization layer.
- UPDATED: `reviews-reputation-research.md` with a deeper Avvo/Justia/FindLaw/Midrag/Zap/LawReviews/Google/reputation-tools comparison matrix.
- UPDATED: `google-reviews-integration-plan.md` with stronger Google Business Profile API, Places API, manual MVP and third-party reputation-tool boundaries.
- UPDATED: `review-compliance-risk.md` with explicit no-review-gating, no-incentive, moderation, lawyer-reply and schema gates.
- UPDATED: `lawyer-rating-system-spec.md` with public label boundaries, review workflow, reputation-score boundary and future criminal-lawyer mini-site example.
- UPDATED: `reputation-product-roadmap.md`, `maya-rotenberg-reputation-plan.md`, `review-schema-policy.md`, `seo-aio-geo-strategy.md`, `payment-and-subscription-model.md`, and `final-integrated-launch-checklist.md`.
- DECISION: MVP remains source-disclosed and conservative: Google link + verified rating/count fields + profile completeness, no automated sync, no public score, no AggregateRating schema.
- VERIFIED: documentation-only research pass. No public reviews, fake ratings, lawyer-card UI, API calls, schema, database changes, URLs, redirects or live content changes were made.

## 2026-05-11 INNER-PAGE MOBILE QA FIX
- LIVE VERIFIED BEFORE FIX: mobile Playwright QA checked `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` at 390px.
- EVIDENCE BEFORE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11.json` plus matching `mobile-inner-*-2026-05-11.png` screenshots.
- FOUND: article, articles archive and lawyer directory passed horizontal-overflow checks; `/family-law/` failed with `scrollWidth` 434 vs `clientWidth` 390.
- FOUND: `/family-law/` showed duplicate mobile WhatsApp controls and practice-hub hero text overflowing its grid column.
- CODE FIXED: `assets/css/premium-pass-3.css` clips mobile page overflow, constrains practice-hub hero content, hides duplicate theme WhatsApp on non-home mobile, keeps one compact third-party WhatsApp button, and strengthens the Pojo accessibility toolbar mobile selector.
- UPDATED: `functions.php` deployment marker is now `2026-05-11-mobile-inner-qa-v1`.
- VERIFIED: `functions.php` passed PHP syntax check using local cached PHP from the owner-provided zip.
- VISUAL VERIFIED BY CSS SIMULATION: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json`; all four sampled pages pass overflow and duplicate-WhatsApp checks with local CSS injected.
- NOT LIVE VERIFIED AFTER CODE FIX: requires uPress pull/cache clear and fresh public screenshots without local CSS injection.

## NEXT BEST ACTION
1. Verify the exact GitHub sync target and active plugin path.
2. Decide whether `justice-core/` will replace `ultra-justice-engine/` on live or whether the legacy active folder must be renamed in a controlled migration.
3. Use admin/API access to set Maya Rotenberg's live slug to `advocate-maya-rotenberg` and draft/unpublish demo lawyers after backup.
4. Run PHP lint on changed files when PHP is available locally or on server.
5. Pull latest repo in Upress and visit `/wp-admin/` once to trigger LegalTech starter tool seeding.
6. Verify `/legal-tools/`, `/legal-tools/ai-intake/`, and one test LegalTech request in admin.
7. Commit only repo-safe changes; do not create ZIPs.
8. Export live URL/slug inventory before changing any Hebrew slugs; fill `url-migration-map.csv`, then create approved 301 redirects for every changed URL.
9. Pull latest in Upress and visit `/wp-admin/` once so the family-law editorial repair and internal notes draft sync can run.
10. Recheck all seven family-law URLs for clean public body content, then continue old-content merge review and import future legal content into the `articles` CPT as clean drafts.
11. Verify live homepage after Upress pull; expected signs are the blinking red-dot Jus-Tice fallback, richer hero visual layer, and upgraded article-card placeholders.
