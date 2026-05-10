# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

## 2026-05-10 - Session: CMS wiring hardening

### FIXED

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
