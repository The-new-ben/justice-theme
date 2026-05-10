# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

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

## 2026-05-10 Family-Law Public Cleaner v6
- FIXED IN CODE: Bumped the family-law editorial repair version to `v6` so live WordPress reruns repair after deployment.
- FIXED IN CODE: The cleaner now strips product/business/editorial-planning language from public article bodies, not only obvious labels like `NOT VERIFIED`.
- INTERNAL-ONLY examples now removed from public output include paid-lawyer product logic, lead monetization, owner strategy, CRM/CMS/GSC/LegalTech implementation notes, AI-internal routing, mini-site sales language and `Jus-Tice should` instructions.
- DOCUMENTED: `project-control/live-content-publication-status.md` and `project-control/publication-workflow.md`.
- VERIFIED: PHP lint passed locally for 125 PHP files.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and public recheck of the seven family-law URLs.
