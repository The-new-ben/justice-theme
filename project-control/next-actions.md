# Next Actions — Jus-Tice.co.il
**Date:** 2026-05-10
**Process:** Read this file at the start of every work session. Pick the top unblocked task. Update status when done.

---

## ACTIVE SEO ARCHITECTURE SEQUENCE - 2026-05-10

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
**Status:** CODE FIXED V2 - deployment and live QA pending
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
9. NEXT: deploy/pull marker `2026-05-11-related-cluster-gate-v1`, then repeat live QA on general, criminal, family and real-estate article samples.
10. NEXT: fill `manual_related_urls`/`parent_pillar_url` metadata for priority clusters from `related-content-map.csv`.
11. NEXT: add a QA flag for related cards whose URL/topic does not match the page cluster.
12. NOT LIVE VERIFIED AFTER V2: requires uPress pull/cache clear and article-page source check for marker `2026-05-11-related-cluster-gate-v1`.

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
