# Changelog — Jus-Tice.co.il
**Format:** [Date] | [Branch/Commit] | [Category] | [Description]

## 2026-05-24 - Lawyer billing readiness gate

- UPDATED: `inc/lawyer-onboarding.php` now adds `Needs billing details` and `Billing ready` cards to the Lawyer Onboarding payment command center.
- UPDATED: the admin list supports `billing_status=missing` and `billing_status=ready` filters for manual-invoice registrations.
- UPDATED: the next money action now prioritizes missing billing details after overdue payment follow-up and before ordinary invoice chasing.
- CREATED: `project-control/lawyer-billing-readiness-gate-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax and `git diff --check` passed.
- DEPLOYED: `fed6aa0 Add lawyer billing readiness gate` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full public lawyer revenue funnel check passed `9/9`.
- SAFETY: no CMS database write during this cycle, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Manual invoice billing details

- UPDATED: `page-lawyer-registration.php` now shows optional billing details only on paid manual-invoice registration paths.
- UPDATED: `inc/lawyer-onboarding.php` now saves billing legal name, business ID, invoice email and invoice address.
- UPDATED: owner notification emails, manual invoice handoff context and payment queue CSV exports include the billing fields.
- UPDATED: `assets/css/premium-pass-3.css` styles the billing-details block.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` verifies the live paid manual-invoice registration path renders and prefills the billing fields.
- CREATED: `project-control/manual-invoice-billing-details-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax, Node syntax and `git diff --check` passed.
- DEPLOYED: `51d3c1d Collect manual invoice billing details` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full public lawyer revenue funnel check passed `9/9`.
- SAFETY: no CMS database write during this cycle, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Lawyer source performance export

- UPDATED: `inc/lawyer-onboarding.php` now adds an `Export source performance CSV` button to the Source performance board.
- UPDATED: added nonce-protected `justice_export_lawyer_source_performance` admin export.
- UPDATED: exported rows include source bucket, registration count, expected monthly/annual value, payment status counts, city/practice/message variants, latest submission time, filtered admin URL and next-action recommendation.
- CREATED: `project-control/lawyer-source-performance-export-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax and `git diff --check` passed.
- DEPLOYED: `5ccf3c3 Export lawyer source performance` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full public lawyer revenue funnel check passed `9/9`.
- SAFETY: no CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Lawyer source performance board

- UPDATED: `inc/lawyer-onboarding.php` now renders an owner-only `Source performance board` inside Lawyer Onboarding.
- UPDATED: source buckets group lawyer registrations/manual-invoice records by outreach segment, message variant, city, practice, campaign or source.
- UPDATED: each source row shows registration count, expected monthly value, payment queue counts, city/practice/message context, latest submission time and an `Open source` filter.
- UPDATED: Lawyer Onboarding now supports safe source filters restricted to known attribution keys.
- CREATED: `project-control/lawyer-source-performance-board-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax and `git diff --check` passed.
- DEPLOYED: `53f7dac Add lawyer source performance board` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full public lawyer revenue funnel check passed `9/9`.
- SAFETY: no CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Signup success attribution

- UPDATED: `inc/lawyer-onboarding.php` now carries `utm_content`, `utm_term`, `outreach_city` and `outreach_practice` into the post-submit registration success redirect.
- UPDATED: `assets/js/analytics-events.js` now reads URL hash parameters as a fallback for success-event attribution, matching Yoast's live UTM-to-hash redirect behavior.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies the registration success UTM hash redirect and richer analytics markers.
- CREATED: `project-control/signup-success-attribution-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax, Node syntax and `git diff --check` passed.
- DEPLOYED: `001d993 Preserve signup success attribution` and `c7a845f Track signup attribution from redirect hash` were pushed and pulled through uPress; uPress log showed `c7a845f` as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full lawyer revenue funnel check passed `9/9`.
- SAFETY: no CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Checkout registration prefill

- UPDATED: `page-lawyer-registration.php` now pre-fills registration name, phone, email and firm fields from safe request values.
- UPDATED: checkout `billing_first_name`, `billing_last_name`, `billing_phone` and `billing_email` can now carry into the paid manual-invoice registration form.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` verifies the paid registration form receives the checkout name, phone and email.
- CREATED: `project-control/checkout-registration-prefill-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax, Node syntax and `git diff --check` passed.
- DEPLOYED: `c9ea012 Prefill registration from checkout details` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full lawyer revenue funnel check passed `8/8`.
- SAFETY: no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Checkout lawyer attribution preservation

- UPDATED: `inc/payment-compliance-routes.php` now carries hidden attribution fields through the fallback checkout form.
- UPDATED: the checkout fallback preserves `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `outreach_segment`, `outreach_city` and `outreach_practice`, with safe manual-invoice defaults when no campaign data exists.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` verifies the paid Lead Partner/manual-invoice checkout path keeps those hidden fields.
- CREATED: `project-control/checkout-attribution-preservation-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax, Node syntax and `git diff --check` passed.
- DEPLOYED: `5cb8761 Preserve checkout lawyer attribution` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full lawyer revenue funnel check passed `8/8`.
- SAFETY: no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Header lawyer revenue links

- UPDATED: `template-parts/layout/site-header.php` now labels the desktop lawyer plan CTA as `מסלולים לעורכי דין` and the portal CTA as `אזור אישי`.
- UPDATED: `assets/css/premium-pass-3.css` adds full/short header-label switching so mobile keeps compact labels.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` verifies the clearer header text and CSS markers.
- CREATED: `project-control/header-lawyer-revenue-links-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax, Node syntax and `git diff --check` passed.
- DEPLOYED: `090aa6c Clarify header lawyer revenue links` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full lawyer revenue funnel check passed `8/8`.
- SAFETY: no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Lawyer registration paid state gate

- UPDATED: `page-lawyer-registration.php` now renders the selected plan option server-side for all lawyer registration plan interests.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies the paid Lead Partner/manual-invoice registration form state.
- CREATED: `project-control/lawyer-registration-paid-state-gate-2026-05-24.md`.
- REGENERATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md` and `.csv`.
- REGENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `.csv`.
- VERIFIED LOCAL: PHP syntax, Node syntax and `git diff --check` passed.
- DEPLOYED: `6bbf7ae Harden paid lawyer registration state` was pushed and pulled through uPress; uPress log showed it as live `HEAD`.
- VERIFIED LIVE READ-ONLY: full lawyer revenue funnel check passed `8/8`.
- SAFETY: no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

## 2026-05-24 - Maya lawyer live refresh and CMS activation packet

- REGENERATED: `project-control/maya-lawyer-live-readonly-2026-05-24.md`.
- REGENERATED: `project-control/maya-lawyer-live-readonly-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-24.json`.
- CREATED: `tools/build-maya-lawyer-cms-activation-packet.mjs`.
- CREATED: `project-control/maya-lawyer-cms-activation-packet-2026-05-24.md`.
- CREATED: `project-control/maya-lawyer-cms-activation-packet-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-cms-activation-packet-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-cms-activation-packet-2026-05-24.json`.
- VERIFIED LOCAL: `node --check tools/check-maya-lawyer-live-readonly.mjs` and `node --check tools/build-maya-lawyer-cms-activation-packet.mjs` passed.
- VERIFIED LIVE READ-ONLY PARTIAL: `justice_lawyer` REST type exists, but `/lawyers/advocate-maya-rotenberg/` remains HTTP `404`, no canonical, `noindex, follow`, 404 title/H1 and REST slug count `0`.
- FIXED PLANNING: packet converts the blocked route into explicit owner/operator gates for existing profile confirmation, rollback capture, approval signals, false-by-default migration filters, mini-site fields, public sources and post-activation QA.
- BLOCKED PUBLIC CMS ACTIVATION: no public profile, slug, redirect, canonical/noindex, taxonomy, sitemap, lead, CRM, wp-admin or uPress action is approved by this packet.
- SAFETY: no public CMS record, lawyer profile data, page body, title, H1, meta, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, media asset, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-24 - Route deploy live and screenshot QA closure

- UPDATED: `tools/build-route-deploy-verification-gate.mjs` now verifies desktop/mobile screenshot PNG evidence.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-24.md`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-verification-gate-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-verification-gate-2026-05-24.json`.
- GENERATED: `reports/route-deploy-live-traffic-priority-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-live-trust-routes-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-live-controlled-breadcrumbs-2026-05-24.csv`.
- CREATED / VERIFIED SCREENSHOTS: `project-control/visual-evidence/route-deploy-2026-05-24/` has `12/12` desktop/mobile route screenshots.
- VERIFIED LOCAL: `node --check tools/build-route-deploy-verification-gate.mjs` passed.
- VERIFIED LIVE READ-ONLY: traffic `12/12` PASS; trust `3/3` PASS; controlled breadcrumbs `4/4` PASS.
- FIXED: `T416`, `T418` and `T419` are now completed in `project-control/task-board.csv`.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Maya lawyer live read-only QA

- CREATED: `tools/check-maya-lawyer-live-readonly.mjs`.
- CREATED: `project-control/maya-lawyer-live-readonly-2026-05-22.md`.
- CREATED: `project-control/maya-lawyer-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-22.json`.
- VERIFIED LOCAL: `node --check tools/check-maya-lawyer-live-readonly.mjs` passed.
- VERIFIED LIVE READ-ONLY PARTIAL: anonymous WordPress REST type discovery exposes `justice_lawyer`.
- BLOCKED LIVE QA: `/lawyers/advocate-maya-rotenberg/` returns HTTP `404`, has no canonical, exposes `noindex, follow`, renders the 404 page and anonymous `justice_lawyer?slug=advocate-maya-rotenberg` returns `0` records.
- NOT SCREENSHOT VERIFIED: no browser screenshots were captured because the route is not yet live-ready.
- SAFETY: no public CMS record, lawyer profile data, page body, title, H1, meta, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, media asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Family Law owner wording approval packet

- CREATED: `project-control/family-law-owner-wording-approval-2026-05-22.md`.
- CREATED: `project-control/family-law-owner-wording-approval-2026-05-22.csv`.
- FIXED PLANNING: converted the Family/Divorce draft enhancement readiness rows into explicit owner approve/edit/hold decisions.
- FIXED PLANNING: isolated five owner-wording-ready modules from agreement/PDF, CTA/lawyer matching, Maya fact and GSC/live repair dependency rows.
- VERIFIED LOCAL: owner wording approval CSV parses with `9` rows.
- BLOCKED OWNER DECISION: no Family/Divorce draft body-copy edit should happen until owner decisions are recorded for cost, process, document checklist, mediation risk and children modules.
- BLOCKED PUBLIC EXECUTION: no public CMS edit, URL/SEO migration, media/PDF change, lawyer-card change, lead/CRM action, GSC/GA4 setting, wp-admin setting or uPress deployment is authorized by this packet.
- SAFETY: no public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Family Law draft enhancement readiness gate

- CREATED: `tools/check-family-law-draft-enhancement-readiness.mjs`.
- CREATED: `project-control/family-law-draft-enhancement-readiness-2026-05-22.md`.
- CREATED: `project-control/family-law-draft-enhancement-readiness-2026-05-22.csv`.
- GENERATED: `reports/family-law-draft-enhancement-readiness-2026-05-22.csv`.
- GENERATED: `reports/family-law-draft-enhancement-readiness-2026-05-22.json`.
- FIXED: normalized `project-control/family-law-draft-enhancement-queue-2026-05-22.csv` row `FL-DRAFT-ENH-007` to keep strict CSV parsing at `12` columns.
- VERIFIED LOCAL: `node --check tools/check-family-law-draft-enhancement-readiness.mjs` passed.
- VERIFIED LOCAL: readiness checker reviewed `12` queue rows with `0` missing repo artifacts; `5` rows are ready for owner wording review, `6` rows remain blocked by live/GSC/Maya/lead dependencies and `1` row is post-upload backlog.
- BLOCKED OWNER WORDING: Family/Divorce draft body-copy edits remain held until owner-approved wording exists.
- SAFETY: no public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Family Law draft enhancement queue

- CREATED: `project-control/family-law-draft-enhancement-queue-2026-05-22.md`.
- CREATED: `project-control/family-law-draft-enhancement-queue-2026-05-22.csv`.
- FIXED PLANNING: converted competitor gaps into exact draft/source targets for costs, process, document checklist, agreement/template policy, mediation, children, CTA, FAQ/schema, E-E-A-T, cluster structure, live repair and post-upload calculator backlog.
- VERIFIED LOCAL: draft enhancement queue CSV parses with `12` rows.
- BLOCKED OWNER WORDING: body-copy edits remain held until owner-approved wording exists for cost/process/document/agreement/CTA modules.
- BLOCKED PUBLIC EXECUTION: Family/Divorce upload remains blocked by visible live defects, CMS rollback backup, focused GSC export, Maya route/schema verification and post-repair QA.
- SAFETY: no public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Family Law competitor gap analysis

- CREATED: `project-control/family-law-competitor-gap-analysis-2026-05-22.md`.
- CREATED: `project-control/family-law-competitor-gap-analysis-2026-05-22.csv`.
- VERIFIED RESEARCH: compared Family/Divorce upload package against current competitor evidence for cost, process, agreement, mediation, custody/support, lawyer connection, CTAs and structure.
- FIXED PLANNING: identified pre-upload improvements for cost framing, process path, document checklist, agreement/PDF policy and CTA/lawyer connection.
- BLOCKED PUBLIC EXECUTION: Family/Divorce remains blocked until owner approval, CMS rollback backup, visible live repair, focused GSC evidence and post-repair QA.
- SAFETY: no public CMS record, page body, title, H1, meta, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, media asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Route deploy verification gate and controlled breadcrumb filter

- UPDATED: `functions.php`.
- UPDATED: `deployment-marker.txt`.
- UPDATED: `inc/breadcrumbs.php`.
- UPDATED: `tools/check-controlled-route-breadcrumb-safety.mjs`.
- UPDATED: `tools/check-live-trust-routes.mjs`.
- CREATED: `tools/check-live-controlled-route-breadcrumbs.mjs`.
- CREATED: `tools/build-route-deploy-verification-gate.mjs`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-22.md`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-22.csv`.
- GENERATED: `reports/route-deploy-verification-gate-2026-05-22.csv` and `reports/route-deploy-verification-gate-2026-05-22.json`.
- GENERATED: `reports/route-deploy-live-traffic-priority-2026-05-22.csv`, `reports/route-deploy-live-trust-routes-2026-05-22.csv` and `reports/route-deploy-live-controlled-breadcrumbs-2026-05-22.csv`.
- FIXED: controlled practice routes now filter stale Yoast BreadcrumbList nodes, leaving the theme-controlled BreadcrumbList generated from route config.
- VERIFIED LIVE READ-ONLY: traffic checker returned `12/12` PASS and trust checker returned `3/3` PASS.
- BLOCKED LIVE QA: controlled breadcrumb checker returned `3/4` PASS because `/family-law/` still exposes one stale article BreadcrumbList live before this new filter is deployed.
- VERIFIED LOCAL: PHP lint, node syntax checks, route gate generation and controlled-route breadcrumb safety checker passed.
- SAFETY: no public CMS record, page body, lawyer profile, URL redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

## 2026-05-22 - Maya lawyer mini-site readiness

- UPDATED: `single-justice_lawyer.php`.
- CREATED: `tools/check-maya-lawyer-mini-site-readiness.mjs`.
- CREATED: `project-control/maya-lawyer-mini-site-readiness-2026-05-22.md`.
- CREATED: `project-control/maya-lawyer-mini-site-readiness-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-mini-site-readiness-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-mini-site-readiness-2026-05-22.json`.
- FIXED: related-article lookup on lawyer mini-sites now includes the shared authority person slug, so Maya Rotenberg content connected to `advocate-maya-rotenberg` can attach even while legacy slug handling remains.
- VERIFIED LOCAL: `php -l single-justice_lawyer.php`, `node --check tools/check-maya-lawyer-mini-site-readiness.mjs` and `node tools/check-maya-lawyer-mini-site-readiness.mjs --reportDate=2026-05-22` passed.
- VERIFIED LOCAL: readiness report generated `13` checks with `12` verified source checks, `1` blocked live route check and `1` not-verified screenshot check.
- BLOCKED LIVE QA: public Maya route verification and screenshots still wait for deployment/uPress cache control.
- SAFETY: no public CMS record, lawyer profile data, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media asset, live lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages CMS repair readiness gate

- CREATED: `tools/build-priority-page-cms-repair-readiness-gate.mjs`.
- CREATED: `project-control/priority-pages-cms-repair-readiness-gate-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-repair-readiness-gate-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-cms-repair-readiness-gate-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-cms-repair-readiness-gate-2026-05-22.json`.
- FIXED: consolidated live QA, repair packet, owner approval, rollback capture and publisher safety into one generated readiness gate.
- VERIFIED LOCAL: `node --check tools/build-priority-page-cms-repair-readiness-gate.mjs` and `node tools/build-priority-page-cms-repair-readiness-gate.mjs --reportDate=2026-05-22` passed.
- BLOCKED PUBLIC EXECUTION: readiness result is `BLOCKED_NOT_READY_FOR_PUBLIC_CMS_REPAIR`; `7/7` gates remain blocked.
- SAFETY: no public CMS content, article body, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages CMS owner approval worksheet

- CREATED: `project-control/priority-pages-cms-owner-approval-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-owner-approval-2026-05-22.csv`.
- FIXED PLANNING: added explicit approval language for duplicate body/content H1 repair only on `/criminal-lawyer-cost/` article ID `19261` and `/plea-bargain/` article ID `19279`.
- BLOCKED PUBLIC EXECUTION: clean-slug creation, page publisher use and SEO migration remain held until separate owner/GSC/source/legal decisions.
- VERIFIED LOCAL: owner approval CSV parses with `11` rows.
- NOT LIVE VERIFIED: no WordPress REST write, public page/article update, redirect, canonical/noindex, sitemap, GSC/GA4 action, screenshot or uPress deployment was executed.
- SAFETY: no public CMS content, article body, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages CMS rollback capture template

- CREATED: `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.csv`.
- FIXED PLANNING: added exact pre-edit capture requirements for article IDs `19261` and `19279` before duplicate body/content H1 repair.
- FIXED PLANNING: added related-asset review capture requirements before any clean-slug decision for diagnosis, joint custody, medication errors and pension split targets.
- VERIFIED LOCAL: rollback capture CSV parses with `10` rows.
- NOT LIVE VERIFIED: no WordPress REST write, public page/article update, redirect, canonical/noindex, sitemap, GSC/GA4 action, screenshot or uPress deployment was executed.
- SAFETY: no public CMS content, article body, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages CMS repair packet

- CREATED: `project-control/priority-pages-cms-repair-packet-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-repair-packet-2026-05-22.csv`.
- FIXED PLANNING: documented that `/criminal-lawyer-cost/` and `/plea-bargain/` must be repaired as `articles` CPT records, not through the page publisher.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` maps to public `articles` ID `19261`; `/plea-bargain/` maps to public `articles` ID `19279`.
- BLOCKED PUBLIC EXECUTION: four missing clean slugs stay blocked until owner approval, focused GSC where needed, source/legal review and anti-cannibalization decisions.
- VERIFIED LOCAL: repair packet CSV parses with `10` rows.
- NOT LIVE VERIFIED: no WordPress REST write, public page/article update, redirect, canonical/noindex, sitemap, GSC/GA4 action, screenshot or uPress deployment was executed.
- SAFETY: no public CMS content, article body, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages custom REST source diagnostics

- UPDATED: `tools/check-priority-pages-live-readonly.mjs`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.md`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
- FIXED: checker now discovers the public REST type surface and checks `pages`, `posts` and `articles` for each priority slug.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` maps to public `articles` CPT ID `19261`.
- VERIFIED LIVE READ-ONLY: `/plea-bargain/` maps to public `articles` CPT ID `19279`.
- BLOCKED LIVE READ-ONLY: four missing priority slugs have no public `pages`, `posts` or `articles` hit and still return HTTP `404`, missing canonical and `noindex`.
- VERIFIED LOCAL: `node --check tools/check-priority-pages-live-readonly.mjs`, `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` and generated CSV/JSON inspection passed.
- NOT SCREENSHOT VERIFIED: no screenshots were captured because Playwright is not installed in this repo environment.
- SAFETY: no public CMS content, article body, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages H1 and REST diagnostics

- UPDATED: `tools/check-priority-pages-live-readonly.mjs`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.md`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
- FIXED: live read-only checker now captures duplicate H1 source text, class, id and nearby context.
- FIXED: live read-only checker now probes public `wp/v2/pages` and `wp/v2/posts` for each target slug.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` and `/plea-bargain/` each have a template H1 plus a duplicate body/content H1.
- VERIFIED LIVE READ-ONLY: all six target slugs return `200/0` through public `wp/v2/pages` and `200/0` through public `wp/v2/posts`.
- BLOCKED LIVE READ-ONLY: four target slugs still return HTTP `404` with missing canonical and `noindex`.
- VERIFIED LOCAL: `node --check tools/check-priority-pages-live-readonly.mjs`, `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` and generated CSV/JSON inspection passed.
- NOT SCREENSHOT VERIFIED: no screenshots were captured because Playwright is not installed in this repo environment.
- SAFETY: no public CMS content, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Priority pages live read-only QA

- CREATED: `tools/check-priority-pages-live-readonly.mjs`.
- CREATED: `project-control/priority-pages-live-readonly-2026-05-22.md`.
- CREATED: `project-control/priority-pages-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` and `/plea-bargain/` return HTTP `200`, index/follow and no mojibake markers.
- BLOCKED LIVE READ-ONLY: `/criminal-lawyer-cost/` and `/plea-bargain/` both have duplicate H1s.
- BLOCKED LIVE READ-ONLY: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` return HTTP `404`, have no canonical and expose `noindex`.
- VERIFIED LOCAL: `node --check tools/check-priority-pages-live-readonly.mjs`, `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` and `git diff --check` passed.
- VERIFIED LIVE READ-ONLY: checker output is `0/6 VERIFIED`; this is a post-publish QA finding.
- NOT SCREENSHOT VERIFIED: no screenshots were captured because Playwright is not installed in this repo environment.
- SAFETY: no public CMS content, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - WP REST publisher safety

- UPDATED: `reports/semrush/build-priority-pages.js`.
- CREATED: `tools/check-wp-rest-publisher-safety.mjs`.
- CREATED: `project-control/wp-rest-publisher-safety-2026-05-22.md`.
- CREATED: `project-control/wp-rest-publisher-safety-2026-05-22.csv`.
- GENERATED: `reports/wp-rest-publisher-safety-2026-05-22.csv`.
- GENERATED: `reports/wp-rest-publisher-safety-2026-05-22.json`.
- FIXED: the six-page WP REST publisher now defaults to dry-run and requires explicit `--publish` for writes.
- FIXED: removed the hardcoded machine-specific WordPress app-password path; publish mode now requires `WP_APP_PASSWORD_PATH` outside Git.
- FIXED: publish mode preflights credentials before any page upsert loop starts.
- VERIFIED LOCAL: `node --check reports/semrush/build-priority-pages.js`, `node --check tools/check-wp-rest-publisher-safety.mjs`, publisher dry-run and safety checker passed.
- VERIFIED LOCAL: publisher safety checker returned `10/10 VERIFIED`.
- VERIFIED LOCAL: `--publish` without `WP_APP_PASSWORD_PATH` exits before page loop/write.
- NOT LIVE VERIFIED: no WordPress REST write, public page update, screenshot, wp-admin action, redirect, canonical/noindex, sitemap, GSC/GA4 action or uPress deployment was executed.
- SAFETY: no public CMS content, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Lead area vocabulary safety

- UPDATED: `inc/lead-spam-guard.php`.
- UPDATED: `template-parts/forms/lead-form.php`.
- UPDATED: `template-parts/sections/ask-lawyer.php`.
- CREATED: `tools/check-lead-area-vocabulary-safety.mjs`.
- CREATED: `project-control/lead-area-vocabulary-safety-2026-05-22.md`.
- CREATED: `project-control/lead-area-vocabulary-safety-2026-05-22.csv`.
- GENERATED: `reports/lead-area-vocabulary-safety-2026-05-22.csv`.
- GENERATED: `reports/lead-area-vocabulary-safety-2026-05-22.json`.
- FIXED: public lead-area options now render from one canonical helper instead of two duplicated public form option blocks.
- FIXED: accepted public `lead_area` values now derive from the same option keys used by the forms.
- VERIFIED LOCAL: PHP lint passed for changed PHP files; node syntax and `node tools/check-lead-area-vocabulary-safety.mjs --reportDate=2026-05-22` passed.
- VERIFIED LOCAL: lead-area vocabulary checker returned `11/11 VERIFIED`.
- NOT LIVE VERIFIED: no public form screenshot, live lead submission, CRM record, email notification or routing assignment was executed.
- SAFETY: no public CMS content, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Controlled route breadcrumb safety

- UPDATED: `inc/breadcrumbs.php`.
- CREATED: `tools/check-controlled-route-breadcrumb-safety.mjs`.
- CREATED: `project-control/controlled-route-breadcrumb-safety-2026-05-22.md`.
- CREATED: `project-control/controlled-route-breadcrumb-safety-2026-05-22.csv`.
- GENERATED: `reports/controlled-route-breadcrumb-safety-2026-05-22.csv`.
- GENERATED: `reports/controlled-route-breadcrumb-safety-2026-05-22.json`.
- FIXED: controlled practice routes now resolve breadcrumb labels from the same route config used by their protected templates.
- FIXED: `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/` and `/inheritance-lawyer/` are checked before stale page/article/archive/404 query fallbacks.
- VERIFIED LOCAL: `php -l inc/breadcrumbs.php`, `node --check tools/check-controlled-route-breadcrumb-safety.mjs`, `node tools/check-controlled-route-breadcrumb-safety.mjs --reportDate=2026-05-22` and `git diff --check` passed.
- VERIFIED LOCAL: controlled route breadcrumb checker returned `10/10 VERIFIED`.
- NOT LIVE VERIFIED: no public breadcrumb screenshot, live JSON-LD check, wp-admin setting or uPress deployment was executed.
- SAFETY: no public CMS content, database row, lawyer profile, lead, CRM, payment, URL slug, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment was changed.

## 2026-05-22 - Authority person profile schema gate

- UPDATED: `inc/authority.php`.
- UPDATED: `inc/schema.php`.
- UPDATED: `tools/check-eeat-authority-safety.mjs`.
- UPDATED: `project-control/eeat-authority-governance-2026-05-19.md`.
- CREATED: `project-control/authority-person-profile-schema-gate-2026-05-22.md`.
- CREATED: `project-control/authority-person-profile-schema-gate-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.json`.
- FIXED: `justice_lawyer` schema is gated behind public profile approval.
- FIXED: approved lawyer pages now get a stable `Attorney` schema `@id`.
- FIXED: verified lawyer `Person` schema is emitted only through the authority registry helper.
- FIXED: Maya Rotenberg can resolve to the verified authority registry by canonical slug or title match.
- FIXED: lawyer schema `sameAs` URLs can be assembled from approved website, source, social and `profile_public_sources` fields.
- VERIFIED LOCAL: `php -l inc/authority.php`, `php -l inc/schema.php`, `node --check tools/check-eeat-authority-safety.mjs`, `node tools/check-eeat-authority-safety.mjs` and `git diff --check` passed.
- VERIFIED LOCAL: authority safety checker returned `11/11 VERIFIED`.
- BLOCKED: Ben entity page/schema remains blocked until owner facts, external links and approved role wording exist.
- NOT LIVE VERIFIED: no live Maya JSON-LD/Rich Results check, public screenshot, wp-admin setting or uPress deployment was executed.
- SAFETY: no public CMS content, database row, lawyer profile, author page, Google Business/social profile, lead, CRM, payment, URL, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 setting or admin setting changed.

## 2026-05-22 - E-E-A-T authority safety hardening

- UPDATED: `inc/schema.php`.
- UPDATED: `inc/eeat.php`.
- CREATED: `tools/check-eeat-authority-safety.mjs`.
- CREATED: `project-control/eeat-authority-safety-hardening-2026-05-22.md`.
- CREATED: `project-control/eeat-authority-safety-hardening-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.json`.
- FIXED: Article schema no longer uses the old hardcoded Ben person author block; it now defaults to the Jus-Tice organization authority helper.
- FIXED: `reviewedBy` now comes only from `justice_theme_authority_article_reviewer_schema()`.
- FIXED: legacy `inc/eeat.php` automatic Person schema/byline injection is opt-in and disabled by default.
- VERIFIED LOCAL: `php -l inc/schema.php`, `php -l inc/eeat.php`, `node --check tools/check-eeat-authority-safety.mjs` and `node tools/check-eeat-authority-safety.mjs` passed.
- NOT LIVE VERIFIED: no live JSON-LD/Rich Results check, article screenshot, wp-admin setting or uPress deployment was executed.
- SAFETY: no public CMS content, database row, lawyer profile, author page, Google Business/social profile, lead record, CRM record, payment setting, URL, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Supplier marketplace prospect research and exposure rules

- CREATED: `project-control/supplier-marketplace-prospect-research-2026-05-22.md`.
- CREATED: `project-control/supplier-marketplace-prospect-research-2026-05-22.csv`.
- UPDATED: `project-control/supplier-marketplace-outreach-playbook-2026-05-20.md`.
- UPDATED: `project-control/lawyer-platform-product-spine-2026-05-20.md`.
- VERIFIED RESEARCH: reviewed current public PsakDin, Din and provider/company pages for a first supplier prospect queue.
- VERIFIED LOCAL: prospect CSV parses with `30` rows across translation/notary, office-space, legal-marketing, legal-tech, courier/filing and expert/private-investigation categories.
- VERIFIED PLANNING: dashboard exposure rules require approved supplier status, owner evidence, paid-placement disclosure and no automatic lawyer data transfer.
- NOT LIVE VERIFIED: no supplier records, public supplier pages, dashboard offers, outreach messages or lawyer introductions were created.
- SAFETY: no public CMS content, database row, supplier record, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Lawyer onboarding upload and AI queue

- UPDATED: `page-lawyer-registration.php` now supports optional profile photo, logo, public-safe document and intro-video upload fields.
- UPDATED: `inc/lawyer-onboarding.php` now handles optional uploads, stores attachment IDs on the draft lawyer profile, marks upload review, stores account-continuation status and creates a deterministic AI-assistant draft scaffold for owner review.
- UPDATED: `assets/js/lawyer-registration-wizard.js` keeps the new asset fields inside the trust-assets wizard step.
- UPDATED: `assets/css/premium-pass-3.css` adds file-field note styling.
- UPDATED: `project-control/lawyer-onboarding-workflow.md`.
- CREATED: `project-control/lawyer-onboarding-upload-ai-queue-2026-05-22.md`.
- CREATED: `project-control/lawyer-onboarding-upload-ai-queue-2026-05-22.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php`, `php -l page-lawyer-registration.php`, `node --check assets/js/lawyer-registration-wizard.js` and `git diff --check` passed.
- NOT LIVE VERIFIED: no live registration submission, file upload, admin queue screenshot or public lawyer profile check was executed.
- SAFETY: no profile is auto-published, no upload is auto-displayed, no generated draft text is used publicly, and no public CMS/database/profile/lead/payment/outreach/URL/redirect/canonical/noindex/taxonomy/sitemap/GA4/GSC/wp-admin/uPress action was executed.

## 2026-05-22 - Project timing and acceleration estimate

- CREATED: `project-control/project-timing-acceleration-resources-2026-05-22.md`.
- CREATED: `project-control/project-timing-acceleration-resources-2026-05-22.csv`.
- UPDATED: `project-control/content-upload-governance-checklist-2026-05-22.md`.
- UPDATED: `project-control/priority-owner-action-queue-2026-05-22.md`.
- VERIFIED PLANNING: first narrow Family/Divorce visible repair is estimated at `0.5-1 operator day` after owner approval, CMS rollback backup and focused GSC or owner-approved substitute.
- VERIFIED PLANNING: complete Family/Divorce controlled current-URL upload package is estimated at `2-4 operator days` after owner/legal/source decisions, GSC evidence and rollback backup.
- VERIFIED PLANNING: all priority clusters can likely reach controlled upload-ready state in `2-4 focused weeks` if owner/GSC/CMS gates are available, or `4-8+ calendar weeks` under current blocker pattern.
- BLOCKED: the estimate does not approve public CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link write, lawyer card, lead/CRM, payment, GA4/GSC setting, wp-admin or uPress action.
- SAFETY: no public CMS content, database row, lawyer record, lead record, prospect record, payment setting, Google account setting, GA4/GSC setting, URL, redirect, canonical/noindex, taxonomy, sitemap, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Google Business marketing ecosystem strategy

- CREATED: `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
- CREATED: `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.
- UPDATED: `project-control/google-reviews-integration-plan.md`.
- UPDATED: `project-control/google-reviews-reputation-system-2026-05-20.md`.
- UPDATED: `project-control/reputation-product-roadmap.md`.
- UPDATED: `project-control/ga4-analytics-review.md`.
- UPDATED: `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
- VERIFIED RESEARCH: reviewed current official Google Business Profile guidance for review requests/replies, profile edits, local ranking, performance metrics, Performance API and Reviews API.
- VERIFIED PLANNING: strategy connects GBP, GA4 events, lead tracking, lawyer onboarding, review/reputation workflow, off-site visibility and monthly lawyer reporting.
- BLOCKED: no Google Business Profile setting, GA4 setting, GSC setting, OAuth/API flow, review import, SMS/email outreach, lawyer profile edit, public review display, schema, CRM, wp-admin or uPress action was approved.
- SAFETY: no public CMS content, database row, lawyer record, lead record, prospect record, payment setting, Google account setting, GA4/GSC setting, URL, redirect, canonical/noindex, taxonomy, sitemap, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Homepage line-by-line business review

- CREATED: `project-control/homepage-line-by-line-business-review-2026-05-22.md`.
- CREATED: `project-control/homepage-line-by-line-business-review-2026-05-22.csv`.
- UPDATED: `project-control/homepage-seo-strategy.md`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`.
- VERIFIED LOCAL: reviewed `front-page.php` and the 12 current homepage section templates.
- VERIFIED PLANNING: current homepage structure is strong enough for controlled refinement; no rebuild is recommended.
- VERIFIED PLANNING: next homepage action should be no-URL-change copy/link QA, with special controls for featured lawyers, latest articles, practice-area ordering, trust-process language and lead/route verification.
- BLOCKED: no homepage template, copy, title/H1/meta, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment, wp-admin or uPress action was approved.
- SAFETY: no public CMS content, database row, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical/noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Homepage competitor-aligned strategy

- CREATED: `project-control/homepage-competitor-aligned-strategy-2026-05-22.md`.
- CREATED: `project-control/homepage-competitor-aligned-strategy-2026-05-22.csv`.
- UPDATED: `project-control/homepage-seo-strategy.md`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`.
- VERIFIED RESEARCH: reviewed current legal portal/directory patterns from Din, PsakDin, Mishpati and Justia.
- VERIFIED LOCAL: `front-page.php` has a strong 12-section homepage stack, so the recommendation is controlled refinement rather than rebuild.
- BLOCKED: no homepage template, copy, title/H1/meta, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment, wp-admin or uPress action was approved.
- SAFETY: no public CMS content, database row, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical/noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Lawyer prospect private list validator

- TOOLING FIXED: created `tools/validate-lawyer-prospect-private-list.ps1`.
- CREATED: `project-control/lawyer-prospect-private-list-validator-2026-05-22.md`.
- CREATED: `project-control/lawyer-prospect-private-list-validator-2026-05-22.csv`.
- GENERATED: `reports/lawyer-prospect-private-list-template-validation-2026-05-22.csv`.
- UPDATED: `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
- VERIFIED LOCAL: first-wave template validation passed in `-TemplateMode` with `20` rows, `0` errors and `0` warnings.
- VERIFIED PRIVACY: private filled CSVs are blocked from repo-local paths by default, and reports contain only row numbers/issue codes.
- BLOCKED: actual first-20 prospect names/contact details remain owner-private and must be filled outside Git.
- SAFETY: no public CMS content, database row, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical/noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message was changed.

## 2026-05-22 - Content upload governance checklist

- CREATED: `project-control/content-upload-governance-checklist-2026-05-22.md`.
- CREATED: `project-control/content-upload-governance-checklist-2026-05-22.csv`.
- UPDATED: `project-control/priority-owner-action-queue-2026-05-22.md`.
- UPDATED: `project-control/cluster-by-cluster-publishing-strategy-2026-05-12.md`.
- VERIFIED PLANNING: checklist defines `15` required or conditional gates before public content upload or repair.
- VERIFIED PLANNING: checklist separates current-URL body/visible repair work from later clean English slug, redirect, canonical/noindex, sitemap and taxonomy migration.
- BLOCKED: `0` clusters are upload-approved; Family/Divorce still requires owner approval, actual CMS rollback backup, focused GSC and post-repair QA.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin or uPress change was made.

## 2026-05-22 - Criminal source/legal review worksheet

- CREATED: `project-control/criminal-source-legal-review-worksheet-2026-05-22.md`.
- CREATED: `project-control/criminal-source-legal-review-worksheet-2026-05-22.csv`.
- UPDATED: `project-control/criminal-first-upload-metadata-package-2026-05-22.md`.
- UPDATED: `project-control/criminal-owner-review-packet-2026-05-22.md`.
- VERIFIED PLANNING: worksheet covers five Criminal first-upload current URLs plus one cluster-wide disclaimer/lead/schema gate.
- VERIFIED PLANNING: `0/6` rows are approved for upload; all rows still require owner/legal/source review.
- BLOCKED: focused Criminal GSC export and WordPress rollback backup remain required before public CMS work.
- BLOCKED PUBLIC EXECUTION: no CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link, lawyer, lead, CRM or uPress action was approved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin or uPress change was made.

## 2026-05-22 - GSC owner execution packet

- CREATED: `project-control/gsc-owner-execution-packet-2026-05-22.md`.
- CREATED: `project-control/gsc-owner-execution-packet-2026-05-22.csv`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- UPDATED: `tools/gsc/README.md`.
- VERIFIED PLANNING: packet gives one ordered sequence for credential env vars, OAuth preflight, priority dry run, real read-only export and strict output validation.
- BLOCKED: real Search Console export still requires owner OAuth setup and property access.
- BLOCKED PUBLIC EXECUTION: packet explicitly blocks CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link, lawyer, lead, CRM and uPress actions.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin or uPress change was made.

## 2026-05-22 - GSC priority export output validator

- TOOLING FIXED: created `tools/gsc/check-priority-gsc-export-output.ps1`.
- CREATED: `project-control/gsc-priority-export-output-validator-2026-05-22.md`.
- CREATED: `project-control/gsc-priority-export-output-validator-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: validator ran for Family/Divorce, Criminal Law and Medical Malpractice.
- VERIFIED LOCAL: current result is `BLOCKED_EXPORT_VALIDATION` with `9` verified rows and `21` blocked rows because focused export folders are not present yet.
- VERIFIED LOCAL: existing decision-map CSV files parse, but their summaries are blocked as baseline/cache/dashboard maps rather than `FOCUSED_GSC_EXPORT`.
- BLOCKED: real Search Console export still requires owner OAuth setup; validator must pass before decision maps are used for upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy or internal-link decisions.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin or uPress change was made.

## 2026-05-22 - GSC OAuth preflight checker

- TOOLING FIXED: created `tools/gsc/check-gsc-oauth-preflight.ps1`.
- CREATED: `project-control/gsc-oauth-preflight-runbook-2026-05-22.md`.
- CREATED: `project-control/gsc-oauth-preflight-runbook-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: missing credential/token paths produce `BLOCKED_PRECHECK`.
- VERIFIED LOCAL: local ignored OAuth path plus `-RunPriorityDryRun` produces `VERIFIED_PRECHECK_READY` and dry-runs Family/Divorce, Criminal Law and Medical Malpractice.
- BLOCKED: real Search Console export still requires owner OAuth setup and owner approval of the first OAuth screen.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC write, wp-admin or uPress change was made.

## 2026-05-22 - Priority owner action queue

- TOOLING FIXED: created `tools/build-priority-owner-action-queue.mjs`.
- GENERATED: `reports/priority-owner-action-queue-2026-05-22.csv`.
- GENERATED: `reports/priority-owner-action-queue-2026-05-22.json`.
- CREATED: `project-control/priority-owner-action-queue-2026-05-22.md`.
- CREATED: `project-control/priority-owner-action-queue-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax check passed and queue generation produced `10` owner/operator action rows from `139` reviewed source rows.
- BLOCKED: all `10/10` action rows remain blocked; no priority cluster is approved for public content upload.
- NEXT: owner completes read-only GSC OAuth setup outside Git, then runs the priority cluster export runner and reviews the resulting decision maps before any CMS upload, URL, redirect, canonical/noindex, sitemap, taxonomy or internal-link action.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - GSC priority cluster export runner

- TOOLING FIXED: created `tools/gsc/run-priority-cluster-gsc-exports.ps1`.
- CREATED: `project-control/gsc-priority-cluster-export-runner-2026-05-22.md`.
- CREATED: `project-control/gsc-priority-cluster-export-runner-2026-05-22.csv`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- UPDATED: `tools/gsc/README.md`.
- VERIFIED LOCAL: priority runner dry-run completed Family/Divorce, Criminal Law and Medical Malpractice without opening OAuth or calling GSC.
- VERIFIED LOCAL: dry-run scope covers `7` Family/Divorce target paths, `5` Criminal target paths, `1` Medical Malpractice primary target and `67` query terms.
- BLOCKED: real API export remains blocked until owner OAuth setup; generated maps must be reviewed before any CMS upload, redirect, canonical/noindex, sitemap, taxonomy or internal-link action.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law live repair readiness gate

- TOOLING FIXED: created `tools/build-family-law-live-repair-readiness-gate.mjs`.
- GENERATED: `reports/family-law-live-repair-readiness-gate-2026-05-22.csv`.
- GENERATED: `reports/family-law-live-repair-readiness-gate-2026-05-22.json`.
- CREATED: `project-control/family-law-live-repair-readiness-gate-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-readiness-gate-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links the readiness gate.
- VERIFIED LOCAL: Node syntax check passed and the generated gate has `8` critical rows from `95` reviewed source rows.
- BLOCKED: all `8/8` gate rows remain blocked; owner approval, real WordPress rollback backup, focused GSC, public repair execution and post-repair QA are still required.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law owner approval worksheet

- CREATED: `project-control/family-law-live-repair-owner-approval-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-owner-approval-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the owner approval worksheet.
- VERIFIED LOCAL: owner-approval CSV parses and contains `13` rows.
- VERIFIED PLANNING: worksheet defines owner decisions for visible current-URL repair, CMS backup, `/divorce-agreement/` shortcode/PDF/H1 repair, H1 repairs on the two divorce-lawyer candidates and support pages, GSC-gated SEO consolidation, protected assets and post-repair QA.
- VERIFIED PLANNING: worksheet explicitly blocks full content upload, URL migration, redirects, canonicals/noindex, sitemap changes, taxonomy edits, related-card writes, protected-asset changes, lawyer-card changes, lead/CRM changes and uPress deployment.
- BLOCKED: actual owner approval, WordPress rollback material, focused GSC, public repair execution and post-repair live QA remain required before Family/Divorce can be marked upload-safe.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law CMS backup template

- CREATED: `project-control/family-law-live-repair-cms-backup-template-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-cms-backup-template-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the rollback backup template.
- VERIFIED LOCAL: backup-template CSV parses and contains `14` rows.
- VERIFIED PLANNING: template defines required rollback capture fields for `/divorce-agreement/`, `/divorce-lawyer/`, `/lawyer-divorce-guide-proceedings-costs-rights/`, `/child-support/`, `/child-custody/` and `/divorce-mediation/`.
- VERIFIED PLANNING: template separates visible repair backup from GSC-gated divorce-lawyer canonical/redirect/noindex/sitemap decisions.
- BLOCKED: actual WordPress rollback material, owner approval and post-repair live QA remain required before public repair execution can be marked safe.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law visible repair field map

- CREATED: `project-control/family-law-visible-repair-field-map-2026-05-22.md`.
- CREATED: `project-control/family-law-visible-repair-field-map-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the field map.
- VERIFIED LOCAL: field-map CSV parses and contains `10` rows.
- VERIFIED PLANNING: `8` rows remain blocked by owner approval, `1` by focused GSC/owner SEO decision and `1` by post-repair verification.
- VERIFIED PLANNING: map defines intended H1s to keep, extra H1s to demote/remove, and `/divorce-agreement/` shortcode/PDF handling.
- BLOCKED: no public CMS edit, PDF upload, redirect, canonical/noindex, slug, sitemap, taxonomy, related-card, lawyer, lead, CRM or wp-admin action is approved by this map.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law live repair diagnostics

- TOOLING FIXED: created `tools/extract-family-law-live-repair-diagnostics.mjs`.
- GENERATED: `reports/family-law-live-repair-diagnostics-2026-05-22.csv`.
- GENERATED: `reports/family-law-live-repair-diagnostics-2026-05-22.json`.
- CREATED: `project-control/family-law-live-repair-diagnostics-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-diagnostics-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links the diagnostics evidence.
- VERIFIED LOCAL: Node syntax check passed.
- VERIFIED LIVE READ-ONLY: diagnostics fetched `6` Family/Divorce HTML pages and `3` PDF candidates.
- VERIFIED LIVE READ-ONLY: produced `9` diagnostic rows; all have issues, with `6` H1 issue rows, `1` raw-shortcode row and `0` working PDF candidates.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law live repair operator packet

- CREATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.csv`.
- VERIFIED LOCAL: repair CSV parses and contains `20` operator rows: `1` ready-for-operator-prep row and `19` blocked rows.
- VERIFIED PLANNING: packet separates visible current-URL repair approval from SEO consolidation approval.
- VERIFIED PLANNING: `/divorce-agreement/` shortcode/PDF repair, H1/template repair, GSC gate, owner canonical decision, checker rerun and screenshot QA are now explicit operator steps.
- BLOCKED: no public CMS edit, PDF upload, redirect, canonical/noindex, slug, sitemap, taxonomy, related-card, lawyer, lead, CRM or wp-admin action is approved by this packet.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law live safety checker

- TOOLING FIXED: created `tools/check-family-law-live-safety.mjs`.
- GENERATED: `reports/family-law-live-safety-check-2026-05-22.csv`.
- GENERATED: `reports/family-law-live-safety-check-2026-05-22.json`.
- CREATED: `project-control/family-law-live-safety-check-2026-05-22.md`.
- CREATED: `project-control/family-law-live-safety-check-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax check passed.
- VERIFIED LIVE READ-ONLY: checker fetched `6` Family/Divorce HTML pages and `3` PDF asset candidate URLs.
- BLOCKED LIVE: generated `11` rows, with `0` verified rows, `11` blocked/review rows and `8` critical blockers.
- BLOCKED LIVE: duplicate indexable self-canonical divorce-lawyer pillar candidates remain live.
- BLOCKED LIVE: `/divorce-agreement/` exposes raw shortcodes and the PDF asset gate remains blocked.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family Law live publish safety review

- FIXED REPO SAFETY: `reports/semrush/publish-family-law-pages.js` now defaults to dry-run mode.
- FIXED REPO SAFETY: live WordPress writes require `ALLOW_WP_PUBLISH=YES` and `WP_APP_PASSWORD_JSON`.
- FIXED REPO SAFETY: Family Law pages JSON path is now env/repo-relative instead of a hardcoded user-machine path.
- CREATED: `project-control/family-law-live-publish-safety-review-2026-05-22.md`.
- CREATED: `project-control/family-law-live-publish-safety-review-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax check passed.
- VERIFIED LOCAL: dry run parsed the Family Law JSON and reported the two planned pages without reading credentials or making a network request.
- VERIFIED LOCAL: live-write guard rejects `ALLOW_WP_PUBLISH=YES` when `WP_APP_PASSWORD_JSON` is missing, before any request can be made.
- VERIFIED LIVE READ-ONLY: checked `9` public URLs/resources for the already-live Family/Divorce pages and their support/PDF targets.
- VERIFIED LIVE CONFLICT: `/lawyer-divorce-guide-proceedings-costs-rights/` and `/divorce-lawyer/` are both live, index/follow and self-canonical, so divorce-lawyer URL/cannibalization remains blocked.
- BLOCKED LIVE: `/divorce-agreement/` exposes raw `justice_pdf_download` and `justice_contact_form` shortcodes; tested PDF upload paths return 404.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice source/legal review worksheet

- CREATED: `project-control/medical-malpractice-source-legal-review-worksheet-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-source-legal-review-worksheet-2026-05-22.csv`.
- VERIFIED LOCAL: worksheet CSV parses and contains `10` page/source review rows: `9` first-upload metadata pages plus `1` cluster-wide privacy/lead-form gate.
- VERIFIED PLANNING: all rows remain `NOT_APPROVED_FOR_UPLOAD` and define source anchors, allowed-after-review language, blocked claims/actions, privacy risk, reviewer decision status and next step.
- BLOCKED: worksheet does not authorize CMS upload, source/legal approval, medical claims, lead-form privacy changes, slug changes, redirects, canonical/noindex changes, sitemap changes, taxonomy edits, media changes, schema expansion, lawyer-card changes or CRM changes.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice first-upload metadata package

- CREATED: `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.csv`.
- VERIFIED LOCAL: metadata CSV parses and contains `9` page-level rows with `0` rows approved for upload.
- VERIFIED PLANNING: package proposes current-URL-only H1, SEO title, meta description, OG, breadcrumb, taxonomy, related-link, schema and robots policies for the duplicate pillar candidate, cost support, informational support, surgery/anesthesia support and birth/pregnancy support assets.
- BLOCKED: package does not authorize CMS upload, slug changes, redirects, canonical/noindex changes, sitemap changes, taxonomy edits, media changes, schema expansion, lawyer-card changes or CRM changes.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice CMS identity operator runbook

- CREATED: `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.csv`.
- VERIFIED LOCAL: runbook CSV contains `9` operator checklist rows.
- VERIFIED PLANNING: runbook covers inspection authorization, rollback evidence for IDs `11607` and `1130`, served-record verification, field comparison, allowed owner decisions, focused GSC gate, source/legal gate and upload boundary.
- BLOCKED: runbook does not authorize CMS upload, editor saves, slug changes, redirects, canonical/noindex changes, sitemap changes, taxonomy edits, media changes, schema, lawyer-card changes or CRM changes.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice duplicate identity review

- TOOLING FIXED: created `tools/build-medical-malpractice-duplicate-identity-review.mjs`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-duplicate-identity-review-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-duplicate-identity-review-2026-05-22.json`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.md`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax check passed and packet generation produced `8` evidence/decision rows.
- VERIFIED LOCAL: IDs `11607` and `1130` share the same public URL in local exports, have `2` distinct content hashes, slug-conflict count `27`, exact current record count `2`, and proposed primary post ID `11607`.
- VERIFIED LOCAL: ID `11607` is newer and longer but lacks media/outgoing links; ID `1130` is older and shorter but has higher heuristic quality, a featured image and outgoing links.
- NOT VERIFIED FINAL: wp-admin/database served-record state and owner authoritative-record decision are still required before Medical Malpractice upload.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice owner decision packet

- TOOLING FIXED: created `tools/build-medical-malpractice-owner-decision-packet.mjs`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-owner-decision-packet-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-owner-decision-packet-2026-05-22.json`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-owner-decision-packet-2026-05-22.md`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-owner-decision-packet-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax check passed and packet generation produced `69` owner decision rows.
- VERIFIED LOCAL: packet includes `8` owner gates, `23` current-URL review rows, `15` P0 support/protected rows, `12` clean-slug route blocker rows, `8` source/legal rows, `1` cannibalization row and `2` possible false-positive rows.
- NOT VERIFIED FINAL: packet remains baseline-only until focused Medical Malpractice GSC export, owner review, duplicate CMS identity review and source/legal review are complete.
- BLOCKED: Medical Malpractice public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap, related/internal-link writes, lawyer cards, schema and CRM changes remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice GSC export workflow

- TOOLING FIXED: created `tools/gsc/gsc-medical-malpractice-export.js`.
- TOOLING FIXED: created `tools/gsc/run-medical-malpractice-gsc-export.ps1`.
- TOOLING FIXED: created `tools/build-medical-malpractice-gsc-decision-map.mjs`.
- CREATED: `project-control/gsc-medical-malpractice-export-runner-2026-05-22.md`.
- CREATED: `project-control/gsc-medical-malpractice-export-runner-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-gsc-decision-map-2026-05-22.json`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-gsc-decision-map-2026-05-22.md`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-gsc-decision-map-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax checks passed and PowerShell dry run passed without OAuth browser and without GSC API call.
- VERIFIED LOCAL: dry-run scope includes `1` primary target path, `73` protected/source paths, `10` route candidates, `8` boundary paths and `22` Medical Malpractice query terms.
- VERIFIED LOCAL / NOT FINAL: baseline decision map generated `187` rows, `178` protected rows, `8` source/legal gate rows and `1` cannibalization row.
- BLOCKED: real Medical Malpractice GSC export requires owner OAuth/GSC approval before URL migration, redirect, canonical, noindex, sitemap, taxonomy, CMS upload or internal-link decisions.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Medical Malpractice readiness dashboard

- TOOLING FIXED: created `tools/build-medical-malpractice-readiness-dashboard.mjs`.
- GENERATED: `reports/medical-malpractice-readiness-dashboard-2026-05-22.csv`.
- GENERATED: `reports/medical-malpractice-readiness-dashboard-2026-05-22.json`.
- CREATED: `project-control/medical-malpractice-readiness-dashboard-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-readiness-dashboard-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-medical-malpractice-readiness-dashboard.mjs` passed.
- VERIFIED LOCAL: dashboard generated `249` consolidated planning rows across `9` lanes.
- VERIFIED LOCAL: flagged `63` high/protected/unknown-GSC risk rows, `86` blocked or approval-gated rows, `4` clean-slug/route blockers, `8` source/legal blockers and `2` possible false-positive medical-malpractice cluster assignments.
- BLOCKED: Medical Malpractice public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap, related/internal-link writes, lawyer cards, schema and CRM changes remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal GSC decision maps

- TOOLING FIXED: created `tools/build-criminal-gsc-decision-map.mjs`.
- TOOLING FIXED: updated `tools/gsc/run-criminal-gsc-export.ps1` so a full Criminal export also builds decision maps.
- GENERATED / NOT FINAL: `reports/criminal-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/criminal-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/criminal-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/criminal-gsc-decision-map-2026-05-22.json`.
- CREATED: `project-control/criminal-gsc-decision-map-2026-05-22.md`.
- CREATED: `project-control/criminal-gsc-decision-map-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: baseline run generated `5` Criminal target rows, `20` protected/support/route-risk rows and `8` cannibalization/wrong-page rows.
- NOT VERIFIED FINAL: current maps are baseline-only and still require the focused owner-authorized GSC export before URL migration, redirect, canonical, noindex or sitemap decisions.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal GSC export runner

- TOOLING FIXED: created `tools/gsc/gsc-criminal-export.js`.
- TOOLING FIXED: created `tools/gsc/run-criminal-gsc-export.ps1`.
- CREATED: `project-control/gsc-criminal-export-runner-2026-05-22.md`.
- CREATED: `project-control/gsc-criminal-export-runner-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/gsc/gsc-criminal-export.js` passed.
- VERIFIED LOCAL: direct dry run and PowerShell wrapper dry run passed without OAuth browser and without GSC API call.
- VERIFIED LOCAL: dry-run scope includes `5` Criminal first-upload targets, `20` protected/support/route-risk paths and `27` query terms.
- BLOCKED: real Criminal GSC export requires owner OAuth/GSC approval before any URL migration, redirect, canonical, noindex or sitemap decision.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal first-upload metadata package

- CREATED: `project-control/criminal-first-upload-metadata-package-2026-05-22.md`.
- CREATED: `project-control/criminal-first-upload-metadata-package-2026-05-22.csv`.
- UPDATED: `project-control/criminal-cms-operator-runbook-2026-05-22.md` now references the metadata package as the source for approved field values.
- VERIFIED PLANNING: package covers `5` Criminal current-URL first-upload targets with H1, SEO title, meta description, OG title, OG description, breadcrumb label, taxonomy label, internal links, schema policy and robots policy.
- VERIFIED PLANNING: all internal links remain current-URL-only; future English slugs remain blocked until GSC and owner migration approval.
- BLOCKED: all metadata rows remain `BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL`; Criminal public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap, related/internal-link writes, lawyer cards, schema and CRM changes remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal CMS operator runbook

- CREATED: `project-control/criminal-cms-operator-runbook-2026-05-22.md`.
- CREATED: `project-control/criminal-cms-operator-runbook-2026-05-22.csv`.
- VERIFIED LOCAL: runbook covers `5` Criminal first-upload current-URL targets and `11` operator checklist rows.
- VERIFIED PLANNING: runbook requires owner/legal/source approval, actual WordPress editor/database rollback material and post-upload route/indexability/link/visual QA.
- BLOCKED: Criminal public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap, related/internal-link writes, lawyer cards, schema and CRM changes remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal owner review packet

- TOOLING FIXED: created `tools/build-criminal-owner-review-packet.mjs`.
- GENERATED: `reports/criminal-owner-review-packet-2026-05-22.csv`.
- GENERATED: `reports/criminal-owner-review-packet-2026-05-22.json`.
- CREATED: `project-control/criminal-owner-review-packet-2026-05-22.md`.
- CREATED: `project-control/criminal-owner-review-packet-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-owner-review-packet.mjs` passed.
- VERIFIED LOCAL: packet generated `5` owner-review rows covering the Criminal first-upload current-URL targets.
- VERIFIED LOCAL: all rows remain `PENDING_OWNER_DECISION` and `READY_FOR_OWNER_LEGAL_SOURCE_REVIEW_NOT_UPLOAD`.
- BLOCKED: Criminal public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap, related/internal-link writes, lawyer cards, schema and CRM changes remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal first-upload draft closure

- CONTENT FIXED / REVIEW ONLY: created `content-drafts/indictment-supporting-he.md`.
- CONTENT FIXED / REVIEW ONLY: created `content-drafts/drug-offenses-supporting-he.md`.
- TOOLING FIXED: updated `tools/build-criminal-traffic-readiness-dashboard.mjs` to track all five Criminal first-upload draft files.
- CREATED: `project-control/criminal-first-upload-draft-closure-2026-05-22.md`.
- CREATED: `project-control/criminal-first-upload-draft-closure-2026-05-22.csv`.
- REGENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- REGENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.json`.
- REGENERATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.md`.
- REGENERATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-traffic-readiness-dashboard.mjs` passed.
- VERIFIED LOCAL: Criminal first-upload draft coverage is now `5/5`, with `0` missing drafts.
- VERIFIED LOCAL: new tracked dashboard word counts are `2,148` for indictment and `2,237` for drug offenses.
- BLOCKED: Criminal public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap and internal-link expansion remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Criminal/Traffic readiness dashboard

- TOOLING FIXED: created `tools/build-criminal-traffic-readiness-dashboard.mjs`.
- GENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- GENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.json`.
- CREATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.md`.
- CREATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-traffic-readiness-dashboard.mjs` passed.
- VERIFIED LOCAL: dashboard generated `57` rows, including `5` criminal first-upload targets, `18` criminal P0 support/protection rows, `13` traffic support/boundary rows, `9` targeted GSC signal rows and the traffic/criminal wrong-page decision packet.
- FIXED LATER: criminal first-upload readiness is now `5/5` drafts present and `0/5` missing after the Criminal first-upload draft closure cycle.
- BLOCKED: Criminal/Traffic public CMS upload, clean-slug migration, redirects, canonicals, noindex, taxonomy, sitemap and internal-link expansion remain unapproved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-22 - Family/Divorce GSC workflow handoff

- TOOLING FIXED: `tools/build-family-divorce-gsc-decision-map.mjs` now supports `--reportDate=YYYY-MM-DD` and latest/explicit live-preupload input selection.
- TOOLING FIXED: `tools/build-family-divorce-protected-url-review-packet.mjs` now supports `--reportDate=YYYY-MM-DD` and `--input=path`.
- TOOLING FIXED: created `tools/gsc/run-family-divorce-gsc-workflow.ps1` for one-command dry run, focused export, decision-map generation and protected URL review-packet generation.
- UPDATED: `tools/gsc/README.md` and `project-control/gsc-api-setup-guide.md`.
- CREATED: `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.md`.
- CREATED: `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.csv`.
- CREATED: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-22.md`.
- GENERATED / NOT FINAL: `reports/family-divorce-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-gsc-decision-map-2026-05-22.json`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-owner-review-packet-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-owner-review-packet-2026-05-22.json`.
- GENERATED / NOT FINAL: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax checks passed for both downstream scripts.
- VERIFIED LOCAL: GSC workflow PowerShell dry run completed without opening OAuth and without calling the API.
- VERIFIED LOCAL: current-date cached baseline still reports `18` protected rows, `5` protected conflicts, `18` high-risk protected rows and `40` cannibalization rows.
- BLOCKED: final URL migration, redirects, canonicals, noindex and sitemap decisions still require focused GSC API export and owner approval.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce protected URL owner review packet

- TOOLING FIXED: created `tools/build-family-divorce-protected-url-review-packet.mjs`.
- GENERATED: `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.json`.
- CREATED: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.md`.
- CREATED: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-protected-url-review-packet.mjs` passed.
- VERIFIED LOCAL: generated `18` protected URL review rows with `5` P0 restore-or-targeted-301 conflicts and `1` P0 keep-asset-live row.
- BLOCKED: packet is not final; focused GSC API export and owner approval are required before any URL, redirect, canonical, noindex or sitemap action.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce GSC decision map baseline

- TOOLING FIXED: created `tools/build-family-divorce-gsc-decision-map.mjs`.
- GENERATED: `reports/family-divorce-gsc-decision-map-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-protected-url-decision-map-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-cannibalization-decision-map-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-gsc-decision-map-2026-05-21.json`.
- CREATED: `project-control/family-divorce-gsc-decision-map-2026-05-21.md`.
- CREATED: `project-control/family-divorce-gsc-decision-map-2026-05-21.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: baseline run used existing cached GSC CSVs and is marked `FALLBACK_EXISTING_GSC_CACHE_NOT_FINAL`.
- VERIFIED LOCAL: generated `7` clean target rows, `18` protected source/asset rows and `40` cannibalization baseline rows.
- VERIFIED LOCAL: all `18` protected source/asset URLs have cached GSC rows and are high-risk in the baseline.
- BLOCKED: final URL migration, redirects, canonicals, noindex and sitemap decisions still require the focused GSC API export.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce Wave 1B metadata word-count sync

- TOOLING FIXED: created `tools/sync-family-divorce-wave1b-metadata-counts.mjs`.
- FIXED: synced `6/6` stale Wave 1B support metadata word counts to the current static-QA counts.
- GENERATED: `reports/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.md`.
- CREATED: `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
- UPDATED: `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
- UPDATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`.
- UPDATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.csv`.
- VERIFIED LOCAL: sync script fixed `6` rows and skipped `0`.
- VERIFIED LOCAL: reran upload readiness checker; Wave 1B metadata word-count mismatches are now `0`.
- VERIFIED: `7/7` current public-body drafts still pass static QA and `7/7` target URLs still have live public backups.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database rollback material.
- BLOCKED: URL migration, redirects, canonicals, noindex and sitemap actions still require GSC API export and protected-source redirect review.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce upload readiness dashboard

- TOOLING FIXED: created `tools/check-family-divorce-upload-readiness.mjs`.
- GENERATED: `reports/family-divorce-upload-readiness-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-upload-readiness-2026-05-21.json`.
- CREATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`.
- CREATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.csv`.
- VERIFIED LOCAL: `node --check tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED LOCAL: `node tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED: `7/7` current public-body drafts pass static QA and `7/7` target URLs have live public backups.
- FIXED LATER: the `6` Wave 1B support metadata word-count mismatches were synced in the follow-up metadata cycle.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database rollback material.
- BLOCKED: URL migration, redirects, canonicals, noindex and sitemap actions still require GSC API export and protected-source redirect review.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - GSC Family/Divorce export runner

- TOOLING FIXED: created `tools/gsc/gsc-family-divorce-export.js`.
- FIXED: runner supports credential and token paths outside the repo through `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`.
- FIXED: added `--dry-run` mode for path/scope verification without reading credential contents, opening OAuth or calling the API.
- CREATED: `project-control/gsc-family-divorce-export-runner-2026-05-21.md`.
- CREATED: `project-control/gsc-family-divorce-export-runner-2026-05-21.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/gsc/gsc-family-divorce-export.js` passed.
- VERIFIED LOCAL: `node tools/gsc/gsc-family-divorce-export.js --dry-run` passed and reported `7` targets, `18` protected source/asset paths and `18` query terms.
- BLOCKED / OWNER ACTION: actual GSC export still requires owner credential rotation/setup and local credential/token paths.
- SAFETY: credential contents were not printed; no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - GSC credential hygiene

- FIXED: removed `tools/gsc/oauth-client.json` from Git tracking with `git rm --cached` while leaving the local file in the workspace.
- FIXED: updated `.gitignore` to ignore local GSC OAuth client files, token files and common Google credential JSON names.
- FIXED: updated `tools/gsc/README.md` with credential-safety and rotation guidance.
- CREATED: `project-control/gsc-credential-hygiene-2026-05-21.md`.
- CREATED: `project-control/gsc-credential-hygiene-2026-05-21.csv`.
- VERIFIED LOCAL: local `tools/gsc/oauth-client.json` is ignored after removal from tracking.
- BLOCKED / OWNER ACTION: if the removed tracked OAuth client was real, create a new OAuth Desktop client in Google Cloud and delete/rotate the old one.
- SAFETY: credential contents were not printed; no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce CMS operator runbook

- CREATED: `project-control/family-divorce-cms-operator-runbook-2026-05-21.md`.
- CREATED: `project-control/family-divorce-cms-operator-runbook-2026-05-21.csv`.
- VERIFIED LOCAL: runbook covers all `7` Family/Divorce owner-review targets.
- VERIFIED PLANNING: runbook requires actual WordPress editor/database backup before each approved edit.
- VERIFIED PLANNING: runbook explicitly blocks duplicate pages, slug changes, redirects, noindex/canonical changes, sitemap changes and protected asset edits during body upload.
- READY: after owner/legal/source approval, the CMS operator has a controlled update-existing-page-only workflow.
- BLOCKED: no CMS execution is approved until owner/legal/source approval and actual WordPress editor/database backup are complete.
- BLOCKED: redirects, URL migration, canonical/noindex and sitemap decisions still require GSC API/export and separate approval.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce owner review packet

- CREATED: `project-control/family-divorce-owner-review-packet-2026-05-21.md`.
- CREATED: `project-control/family-divorce-owner-review-packet-2026-05-21.csv`.
- VERIFIED LOCAL: packet covers `7` locally merged Family/Divorce upload candidates.
- VERIFIED LOCAL: all seven page rows reference static QA `PASS` from `reports/family-divorce-public-body-static-qa-2026-05-21.csv`.
- VERIFIED LOCAL: packet records that `/divorce-property-division/`, `/child-custody/` and `/child-support/` high-risk merge blockers are resolved locally.
- READY: owner can now mark each page as `APPROVE`, `EDIT`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
- BLOCKED: no CMS upload is approved until owner/legal/source approval and actual WordPress editor/database backup are complete.
- BLOCKED: redirects, URL migration, canonical/noindex and sitemap decisions still require GSC API/export and separate approval.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce child-support merge decisions and draft merge

- TOOLING FIXED: added `tools/resolve-family-divorce-child-support-merge.mjs`.
- TOOLING FIXED: added `tools/apply-family-divorce-child-support-draft-merges.mjs`.
- CONTENT FIXED: applied the four approved `/child-support/` merge edits to `content-drafts/child-support-public-body-he.md`.
- GENERATED: `reports/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-support-merge-decisions-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-support-draft-merge-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-support-draft-merge-2026-05-21.csv`.
- VERIFIED LOCAL: `35` live rows resolved into `4` draft merges, `25` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips.
- VERIFIED LOCAL: all four approved insertion blocks are present in the edited public-body draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed static QA.
- VERIFIED: `/child-support/` now passes static QA with `1,650` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- FIXED: all three high-risk Family/Divorce pages now have row-level merge decisions and applied approved draft merges.
- BLOCKED: CMS upload still requires owner/legal/source approval and actual WordPress editor/database backup.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce child-custody merge decisions and draft merge

- TOOLING FIXED: added `tools/resolve-family-divorce-child-custody-merge.mjs`.
- TOOLING FIXED: added `tools/apply-family-divorce-child-custody-draft-merges.mjs`.
- CONTENT FIXED: applied the nine approved `/child-custody/` merge edits to `content-drafts/child-custody-public-body-he.md`.
- GENERATED: `reports/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-custody-draft-merge-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-custody-draft-merge-2026-05-21.csv`.
- VERIFIED LOCAL: `35` live rows resolved into `9` draft merges, `20` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips.
- VERIFIED LOCAL: all nine insertion IDs are present in the edited public-body draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed static QA.
- VERIFIED: `/child-custody/` now passes static QA with `1,748` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- BLOCKED: CMS upload still requires owner/legal/source approval and actual WordPress editor/database backup; `/child-support/` still needs row-level merge decisions.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce property-division draft merge

- CONTENT FIXED: applied the six approved `/divorce-property-division/` merge edits to `content-drafts/divorce-property-division-public-body-he.md`.
- TOOLING FIXED: added `tools/apply-family-divorce-property-division-draft-merges.mjs`.
- CREATED: `project-control/family-divorce-property-division-draft-merge-2026-05-21.md`.
- CREATED: `project-control/family-divorce-property-division-draft-merge-2026-05-21.csv`.
- VERIFIED LOCAL: all six insertion IDs are present in the edited public-body draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce public-body drafts passed static QA.
- VERIFIED: `/divorce-property-division/` now passes static QA with `1,851` words, all required links, no internal markers, no fake-trust hits and disclaimer status `PASS`.
- BLOCKED: CMS upload still requires owner/legal/source approval and actual WordPress editor/database backup.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce property-division merge decisions

- TOOLING FIXED: added `tools/resolve-family-divorce-property-division-merge.mjs`.
- VERIFIED LOCAL: resolved all `/divorce-property-division/` live candidate rows from the high-risk merge worksheet.
- GENERATED: `reports/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-property-division-merge-decisions-2026-05-21.md`.
- CREATED: `project-control/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
- VERIFIED: `35` live rows resolved into `6` draft merges, `23` covered/no-action rows and `6` UI/CTA/taxonomy/related-link skips.
- BLOCKED: `/divorce-property-division/` still needs the six concise draft edits, static QA rerun, owner/legal/source approval and CMS backup before upload.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce high-risk merge review

- TOOLING FIXED: added `tools/prepare-family-divorce-merge-review.mjs`.
- VERIFIED LOCAL: generated a merge-review worksheet for `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- GENERATED: `reports/family-divorce-high-risk-merge-review-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-high-risk-merge-review-2026-05-21.md`.
- CREATED: `project-control/family-divorce-high-risk-merge-review-2026-05-21.csv`.
- VERIFIED: worksheet contains `165` rows: `60` draft base sections, `30` live sections marked `REVIEW_FOR_MERGE`, `46` marked `PARTIAL_OVERLAP_REVIEW` and `29` marked `COVERED_BY_DRAFT`.
- BLOCKED: no direct overwrite is approved for the three high-risk pages until review rows are resolved.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce live vs draft comparison

- TOOLING FIXED: added `tools/compare-family-divorce-live-vs-drafts.mjs`.
- VERIFIED LOCAL: compared seven live public snapshots against seven clean public-body drafts.
- GENERATED: `reports/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.md`.
- CREATED: `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
- VERIFIED: live snapshots total `19,236` words; clean draft bodies total `11,673` words; net draft reduction is `-7,563` words.
- BLOCKED: all seven pages need merge review before upload; no blind CMS overwrite is approved.
- HIGH PRIORITY: `/child-support/`, `/child-custody/` and `/divorce-property-division/` have the largest retention risk.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce live target backup

- TOOLING FIXED: added `tools/export-family-divorce-live-targets.mjs`.
- VERIFIED LIVE / READ ONLY: exported metadata and public text snapshots for seven live Family/Divorce target pages.
- GENERATED: `reports/family-divorce-live-target-backup-2026-05-21/manifest.csv`.
- GENERATED: seven public-text snapshot files under `reports/family-divorce-live-target-backup-2026-05-21/`.
- CREATED: `project-control/family-divorce-live-target-backup-2026-05-21.md`.
- CREATED: `project-control/family-divorce-live-target-backup-2026-05-21.csv`.
- VERIFIED: all seven target pages returned `200`, stayed on their own final paths and exported as `PASS`.
- VERIFIED: captured `19,236` words of current live public text for comparison before CMS overwrite/update.
- NOT A DB BACKUP: actual WordPress editor/database export is still required before live edits.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce live pre-upload guard

- TOOLING FIXED: added `tools/check-family-divorce-live-preupload.mjs`.
- VERIFIED LIVE / READ ONLY WITH BLOCKERS: checked `25` Family/Divorce URLs, including `7` clean target pages, `17` protected P0 source URLs and `1` protected DOCX asset.
- GENERATED: `reports/family-divorce-live-preupload-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-live-preupload-guard-2026-05-21.md`.
- CREATED: `project-control/family-divorce-live-preupload-guard-2026-05-21.csv`.
- VERIFIED LIVE: `13` protected source/asset URLs passed reachability checks.
- LIVE PRESENT REVIEW: all seven clean upload targets already return `200` and self-canonicalize, so current live content must be exported before any CMS update.
- BLOCKED LIVE: `5` protected source URLs return initial `301` to homepage and need restore/update-in-place/documented 301 decisions after GSC API confirmation.
- VERIFIED LOCAL: `node --check tools/check-family-divorce-live-preupload.mjs` passed.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Family/Divorce public body static QA

- TOOLING FIXED: added `tools/check-family-divorce-public-bodies.mjs`.
- FIXED: cleaned one `/divorce-lawyer/` caution sentence in `content-drafts/divorce-lawyer-public-body-he.md` to avoid a risky outcome-promise phrase.
- VERIFIED LOCAL: all seven Family/Divorce public-body drafts passed static QA for minimum words, required internal links, internal-note markers, fake trust/review/outcome-promise terms and disclaimer signals.
- GENERATED: `reports/family-divorce-public-body-static-qa-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-public-body-static-qa-2026-05-21.md`.
- CREATED: `project-control/family-divorce-public-body-static-qa-2026-05-21.csv`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- NOT LEGAL VERIFIED: static QA does not replace owner/legal/source review.
- SAFETY: no public CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Trust route early render

- CODE FIXED: `inc/trust-routes.php` now renders `/contact/`, `/about/` and `/editorial-policy/` at `template_redirect` priority `-999999`.
- CODE FIXED: trust-route responses send `X-Justice-Route-Guard: trust-route-early-render`.
- UPDATED: deployment marker to `2026-05-21-trust-route-early-render-v1`.
- CREATED: `project-control/trust-route-early-render-2026-05-21.md`.
- CREATED: `project-control/trust-route-early-render-2026-05-21.csv`.
- VERIFIED LOCAL: PHP lint passed for `functions.php` and `inc/trust-routes.php`; JS syntax passed for the traffic-priority and trust-route checkers; task-board CSV parse and `git diff --check` passed with normal Windows line-ending warnings only.
- NOT LIVE VERIFIED: uPress pull/cache clear and fresh route checks are still required.
- SAFETY: no CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Protected practice route early render

- CODE FIXED: `inc/practice-landing.php` now uses one controlled-route template resolver for practice-route templates.
- CODE FIXED: controlled practice routes render at `template_redirect` priority `-999999` and exit before later WordPress redirect plugins.
- CODE FIXED: early controlled practice route output sends `X-Justice-Route-Guard: controlled-practice-early-render`.
- CODE FIXED: `inc/html-sitemap.php` now renders `/site-map/` at priority `-999999`.
- UPDATED: deployment marker to `2026-05-21-protected-route-early-render-v1`.
- CREATED: `project-control/protected-practice-route-early-render-2026-05-21.md`.
- CREATED: `project-control/protected-practice-route-early-render-2026-05-21.csv`.
- VERIFIED LOCAL: PHP lint passed for `inc/practice-landing.php`, `inc/html-sitemap.php` and `functions.php`.
- NOT LIVE VERIFIED: uPress pull/cache clear and route checker rerun are still required.
- SAFETY: no CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Public route home redirect triage

- TOOLING FIXED: `tools/check-live-traffic-priority.mjs` now records initial manual redirect status/location before following redirects.
- CREATED: `project-control/public-route-home-redirect-triage-2026-05-21.md`.
- CREATED: `project-control/public-route-home-redirect-triage-2026-05-21.csv`.
- GENERATED: `reports/traffic-priority-audit-2026-05-21-route-home-redirects.csv`.
- VERIFIED LIVE: `/`, `/articles/`, `/family-law/`, `/lawyers/?area=family-law`, `/criminal-defense-attorney/` and `/traffic-lawyer/` returned initial `200`.
- BLOCKED LIVE: `/site-map/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/`, `/contact/` and `/about/` returned initial `301` to `https://jus-tice.co.il`.
- VERIFIED LOCAL: `node --check tools/check-live-traffic-priority.mjs` passed after the checker update.
- SAFETY: no CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Real estate guide redirect guard

- CODE FIXED: `inc/routing-guards.php` now blocks WordPress-level `wp_redirect` and `redirect_canonical` conflicts from `/real-estate-lawyer-guide/` to `/` or `/real-estate-attorney`.
- TOOLING FIXED: `tools/check-live-traffic-priority.mjs` now requires route checks to finish on their expected final path.
- UPDATED: deployment marker to `2026-05-21-real-estate-guide-redirect-guard-v1`.
- CREATED: `project-control/real-estate-guide-redirect-guard-2026-05-21.md`.
- CREATED: `project-control/real-estate-guide-redirect-guard-2026-05-21.csv`.
- GENERATED: `reports/traffic-priority-audit-2026-05-21-real-estate-guide-redirect-guard.csv`.
- VERIFIED LOCAL: PHP lint passed for `inc/routing-guards.php` and `functions.php`; JS syntax check passed for `tools/check-live-traffic-priority.mjs`.
- NOT LIVE VERIFIED: public server still needs uPress Git pull/cache clear. If the route still redirects before the theme marker appears, the blocker is likely a server/plugin redirect rule outside this theme guard.
- ROUTE QA BACKLOG: the stricter checker currently flags `/site-map/`, `/medical-malpractice-lawyer/`, `/inheritance-lawyer/`, `/contact/` and `/about/` as homepage-fallback final-path failures in addition to `/real-estate-lawyer-guide/`.
- SAFETY: no CMS content, database row, title/H1/meta, URL slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Real estate public edit package

- CREATED: `project-control/real-estate-public-edit-package-2026-05-21.md`.
- CREATED: `project-control/real-estate-public-edit-package-2026-05-21.csv`.
- VERIFIED / REVIEW ONLY: prepared exact Hebrew CMS insert text and internal-link placement for `/real-estate-attorney/` plus five safe support pages.
- VERIFIED LIVE: `/real-estate-attorney/`, `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, `/land-appreciation-tax/`, `/real-estate-lawyer-cost-2025/` and `/real-estate-appraiser/` returned `200` and self-canonicalized.
- BLOCKED LIVE: `/real-estate-lawyer-guide/` currently resolves to homepage URL/canonical, so it is excluded until route QA is repaired.
- SAFETY: repo docs and read-only public checks only. No CMS content, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap, lawyer, lead, payment, GA4/GSC, wp-admin or uPress change was made.

## 2026-05-21 - Recommendation token safety checker

- TOOLING FIXED: added `tools/check-recommendation-token-safety.mjs`.
- CREATED: `project-control/recommendation-token-safety-checker-2026-05-21.md`.
- CREATED: `project-control/recommendation-token-safety-checker-2026-05-21.csv`.
- VERIFIED LOCAL: `node --check tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: `node tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: checker confirms private token CPT, hashed tokens, noindex token form, honeypot, draft-only first-party submission, `confirmed` permission, `draft_review` moderation, no `approved_public` on submission, public guard source filtering and no Review/AggregateRating schema.
- SAFETY: tooling/docs only. No live CMS database row, Google API, Google import, outbound client message, public schema, payment setting, redirect or sitemap changed.

## 2026-05-21 - First-party recommendation token intake

- CODE FIXED: `inc/lawyer-recommendations.php` now registers private `justice_reco_token` records for one-time first-party recommendation intake links.
- CODE FIXED: recommendation tokens store hashed token values, linked lawyer ID, status, expiry, creator and submitted recommendation ID.
- CODE FIXED: public token URLs render a standalone Hebrew `noindex,nofollow` intake form at `/?justice_recommendation_token=...`.
- CODE FIXED: valid token submissions create draft `justice_recommendation` records with `first_party`, `confirmed` permission and `draft_review` moderation.
- CODE FIXED: Lawyer Onboarding now has a `Create recommendation link` action and an admin-only notice with the generated link.
- CREATED: `project-control/first-party-recommendation-token-intake-2026-05-21.md`.
- CREATED: `project-control/first-party-recommendation-token-intake-2026-05-21.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- VERIFIED LOCAL: `git diff --check` passed with normal Windows line-ending warnings only.
- NOT LIVE VERIFIED: authenticated admin click-through, uPress pull, token form submission and public-profile display QA still need owner/admin access and a real approved first-party test record.
- SAFETY: repo theme code/docs only. No Google API connection, Google import, outbound client message, public schema, CMS database row, lawyer/customer/recommendation record, payment setting, redirect or sitemap changed in this cycle.

## 2026-05-21 - First-party recommendation display guard

- CODE FIXED: `inc/lawyer-recommendations.php` now centralizes recommendation source types and validates saved source type values.
- CODE FIXED: public recommendation count/list queries now require linked lawyer ID, `approved_public`, `confirmed` permission and `recommendation_source_type=first_party` by default.
- CODE FIXED: Google-linked/manual-import recommendation records stay reference-only by default and do not appear in the public lawyer profile recommendation list.
- CREATED: `project-control/public-recommendations-display-guard-2026-05-21.md`.
- CREATED: `project-control/public-recommendations-display-guard-2026-05-21.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- NOT LIVE VERIFIED: public server behavior still needs uPress pull/cache refresh and an approved first-party recommendation test record.
- BLOCKED: recommendation request token/intake flow, Google API, outbound SMS/email, public review schema and AggregateRating remain blocked.
- SAFETY: repo theme code/docs only. No Google API connection, Google review import, outbound review request, public schema, CMS database row, recommendation/lawyer/customer record, payment setting, redirect, sitemap or outreach message changed.

## 2026-05-21 - Lawyer platform owner walkthrough completion

- UPDATED: `project-control/lawyer-platform-owner-walkthrough-2026-05-20.md`.
- VERIFIED / DOCS: completed the owner walkthrough for the deployed lawyer platform state, including public URLs, private admin command center, prospect follow-up views, outreach links, reputation workflow, manual activation rules and LegalTech lead-intent handling.
- VERIFIED LIVE: `/`, `/lawyer-plans/`, `/lawyer-registration/`, `/lawyer-dashboard/` and `/lawyers/` returned `200`.
- VERIFIED LIVE: `/legal-tools/` still resolves to the homepage, so direct promotion remains blocked until real tool records and archive behavior are verified.
- VERIFIED LIVE: homepage source contains `legaltech-tools`, `AI Console`, `ask-lawyer` and `data-lead-message`; it has no direct `/legal-tools/` archive link and no page-level `noindex`.
- VERIFIED PRIVATE: unauthenticated access to Lawyer Onboarding, Lawyer Prospects and Outreach Links redirects to WordPress login.
- COMPLETED: task-board item `T368`.
- BLOCKED: authenticated admin walkthrough, real outreach, first payment, lawyer activation and real LegalTech product archive require owner action/access.
- SAFETY: repo documentation and read-only live/private-boundary checks only. No public CMS page, database row, lawyer, lead, prospect, product, payment, redirect, sitemap, taxonomy, title/H1/meta or outreach message was changed.

## 2026-05-12 - Wave 1B support metadata package

- CREATED: `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `6`-row metadata package for the six Family/Divorce support pages.
- VERIFIED LIVE: all six support URLs returned `200` and self-canonicalized.
- VERIFIED: package covers H1/title, meta description, OG posture, breadcrumb labels, taxonomy, related-link boundaries and schema/trust exclusions.
- RECOMMENDED: preserve current safe support metadata unless owner requests edits.
- BLOCKED: support metadata execution and support upload remain blocked until owner/legal/source approval.
- BLOCKED: no public content, support title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce lawyer CMS upload field map

- CREATED: `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.md`.
- CREATED: `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `24`-row CMS upload worksheet for the first controlled `/divorce-lawyer/` upload candidate.
- VERIFIED: map covers backup, body, title/H1, SEO meta, OG fields, breadcrumb, canonical, robots, taxonomy, related links, schema safety, disclaimer, CTA, post-upload QA and GSC monitoring.
- VERIFIED: slug and canonical remain unchanged; old URLs/protected assets remain untouched.
- BLOCKED: CMS execution remains blocked until owner approval of the clean body, metadata package and field map.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce lawyer metadata package

- CREATED: `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `20`-row metadata package for the first controlled `/divorce-lawyer/` upload candidate.
- VERIFIED: live `/divorce-lawyer/` returned `200` and self-canonicalized before any public change.
- RECOMMENDED: tighter H1/title/meta while keeping the slug and canonical unchanged.
- VERIFIED: taxonomy is limited to `family-law` and `divorce`; related links are limited to approved Family/Divorce support paths.
- BLOCKED: Review, AggregateRating, fake ratings, fake badges, fake trust labels, recommendation language, URL changes, redirects, noindex, sitemap changes and CMS writes remain blocked until owner approval.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - First upload decision brief

- CREATED: `project-control/family-divorce-first-upload-decision-brief-2026-05-12.md`.
- CREATED: `project-control/family-divorce-first-upload-decision-brief-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `10`-row owner-facing decision brief for the first Family/Divorce public upload scope.
- RECOMMENDED: first public upload should be Wave 1A only: `/divorce-lawyer/`, after owner/legal/source approval and controlled QA.
- VERIFIED: support copy can be approved separately, but support upload remains blocked until owner chooses scope.
- BLOCKED: `FAM-UPLOAD-055` blocks the first public Family/Divorce upload scope until owner approval.
- RECOMMENDED NEXT: approve or edit `content-drafts/divorce-lawyer-public-body-he.md`; if approval is not ready, prepare exact `/divorce-lawyer/` title/H1/meta package as repo-only work.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Wave 1B support approval package

- CREATED: `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: packaged all six clean Family/Divorce support bodies into a `16`-row owner/legal/source approval gate.
- VERIFIED: the support bodies total `11,222` words across `435` lines.
- VERIFIED: strict scans found no internal planning markers, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake ratings, fake review claims, fake trust labels, recommendation-label terms or guaranteed-result language.
- FIXED: neutralized two harmless `מומלץ` wording hits in `/divorce-property-division/` and `/family-dispute-resolution/` so the strict scan stays clean.
- VERIFIED: `FAM-UPLOAD-052` is planning-verified; `FAM-UPLOAD-053` blocks support upload scope until owner/legal/source approval.
- RECOMMENDED: approve support copy as a batch, but keep public upload blocked until `/divorce-lawyer/` scope and QA are settled.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Child custody CMS-clean public body

- CREATED: `content-drafts/child-custody-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `1,693`-word clean public Hebrew body for `/child-custody/`.
- VERIFIED: internal editorial notes, CMS planning sections, source-audit notes, Maya/profile notes, LegalTech notes and pre-publication status notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels, custody-result promises or guaranteed-result language.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/child-support/`, `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-050` now has a clean file, but `FAM-UPLOAD-051` blocks upload until owner/legal/source approval.
- VERIFIED: all six Wave 1B support pages now have CMS-clean public bodies.
- RECOMMENDED: review all six clean Wave 1B support bodies as one support-page approval batch, or return to the first controlled `/divorce-lawyer/` upload decision.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Child support CMS-clean public body

- CREATED: `content-drafts/child-support-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `1,729`-word clean public Hebrew body for `/child-support/`.
- VERIFIED: internal editorial notes, CMS planning sections, source-audit notes, Maya/profile notes, LegalTech notes and pre-publication status notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels, fixed calculator promises or guaranteed-result language.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-048` now has a clean file, but `FAM-UPLOAD-049` blocks upload until owner/legal/source approval.
- RECOMMENDED: `/child-custody/` clean body now exists; review all six Wave 1B support bodies before any support upload.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family dispute resolution CMS-clean public body

- CREATED: `content-drafts/family-dispute-resolution-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `1,992`-word clean public Hebrew body for `/family-dispute-resolution/`.
- VERIFIED: internal editorial notes, CMS planning sections, source-audit notes, Maya/profile notes, LegalTech notes and pre-publication status notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels or guaranteed-result language.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-046` now has a clean file, but `FAM-UPLOAD-047` blocks upload until owner/legal/source approval.
- RECOMMENDED: prepare `/child-support/` as the next clean support body if repo-only prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce property division CMS-clean public body

- CREATED: `content-drafts/divorce-property-division-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `1,874`-word clean public Hebrew body for `/divorce-property-division/`.
- VERIFIED: internal editorial notes, CMS planning sections, source-audit notes, Maya/profile notes, LegalTech notes and pre-publication status notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels or guaranteed-result language.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-044` now has a clean file, but `FAM-UPLOAD-045` blocks upload until owner/legal/source approval.
- RECOMMENDED: prepare `/family-dispute-resolution/` as the next clean support body if repo-only prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce mediation CMS-clean public body

- CREATED: `content-drafts/divorce-mediation-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `2,059`-word clean public Hebrew body for `/divorce-mediation/`.
- VERIFIED: internal editorial notes, CMS planning sections, source-audit notes, Maya/profile notes, LegalTech notes and pre-publication status notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels or guaranteed-result language.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-042` now has a clean file, but `FAM-UPLOAD-043` blocks upload until owner/legal/source approval.
- RECOMMENDED: prepare `/divorce-property-division/` as the next clean support body if repo-only prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Consensual divorce CMS-clean public body

- CREATED: `content-drafts/consensual-divorce-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `1,875`-word clean public Hebrew body for `/consensual-divorce/`.
- VERIFIED: internal editorial notes, CMS planning sections, source-audit notes, Maya/profile notes, LegalTech notes and pre-publication status notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels or guaranteed-result language.
- PARTIAL VERIFIED: `FAM-UPLOAD-040` now has a clean file, but `FAM-UPLOAD-041` blocks upload until owner/legal/source approval.
- RECOMMENDED: prepare `/divorce-mediation/` as the next clean support body if repo-only prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family/Divorce Wave 1B support review package

- CREATED: `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: reviewed the six Family/Divorce support drafts planned after `/divorce-lawyer/`.
- VERIFIED: support drafts total `27,277` words and cover `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- NOT VERIFIED / NOT CMS-CLEAN: all six drafts still contain internal production notes or planning sections and must be cleaned before public upload.
- RECOMMENDED: clean `/consensual-divorce/` first, then `/divorce-mediation/`.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce lawyer controlled upload QA package

- CREATED: `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `32`-row QA package for the first controlled `/divorce-lawyer/` upload candidate.
- VERIFIED: package covers approval, backup, clean body checks, metadata, taxonomy, related cards, protected old URLs/assets, canonical/indexability, mobile/desktop QA, GSC follow-up and rollback.
- VERIFIED: `FAM-UPLOAD-037` is planning-verified; `FAM-UPLOAD-038` remains blocked until an approved preview or public upload exists.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce lawyer CMS-clean public body

- CREATED: `content-drafts/divorce-lawyer-public-body-he.md`.
- VERIFIED / REVIEW ONLY: created a `2,374`-word clean public Hebrew body for `/divorce-lawyer/`.
- VERIFIED: internal editorial notes, CMS planning sections, duplicate FAQ structure and source/competitor notes were removed from the public body.
- VERIFIED: scans found no internal planning markers, `TODO`/`TBD`, fake ratings, fake review claims, fake trust labels or guaranteed-result language.
- PARTIAL VERIFIED: `FAM-UPLOAD-035` now has a clean file, but `FAM-UPLOAD-036` blocks upload until owner/legal/source approval.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family/Divorce disclaimer and CTA policy

- CREATED: `project-control/family-divorce-disclaimer-cta-policy-2026-05-12.md`.
- CREATED: `project-control/family-divorce-disclaimer-cta-policy-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `20`-row first-wave disclaimer, CTA and trust-language policy for the Family/Divorce controlled upload gate.
- VERIFIED: all first-wave pages need visible general-information/no-legal-advice language, CTA disclaimers and page-specific caution where the topic is sensitive.
- VERIFIED: fake ratings, badges, review counts, top/recommended/trusted language, guaranteed results, fixed child-support promises and review/rating schema remain blocked.
- RECOMMENDED: approve this policy with the Family/Divorce upload package, then verify visible disclaimers and blocked trust language after preview or upload.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family/Divorce taxonomy and category plan

- CREATED: `project-control/family-divorce-taxonomy-category-plan-2026-05-12.md`.
- CREATED: `project-control/family-divorce-taxonomy-category-plan-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `22`-row first-wave taxonomy/category decision plan for the Family/Divorce controlled upload gate.
- VERIFIED: first-wave pages should use existing `practice-areas` terms only: `family-law`, `divorce`, `child-support` and `child-custody`.
- VERIFIED: WordPress `category`, `post_tag`, city terms, inheritance/wills terms and new Family/Divorce term archives are blocked from first-wave cluster control.
- REVIEW: `prenuptial-agreement` has a current slug collision risk and must not be used for `הסכם ממון` until the term map is reviewed.
- RECOMMENDED: approve the taxonomy/category plan with the Family/Divorce upload package, then verify actual term assignments after any draft import or public update.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce pillar related-content boundary plan

- CREATED: `project-control/family-divorce-related-content-boundary-plan-2026-05-12.md`.
- CREATED: `project-control/family-divorce-related-content-boundary-plan-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: created a `20`-row manual related-card allowlist and blocklist for the first `/divorce-lawyer/` controlled upload candidate.
- VERIFIED: first related cards should prefer approved Family/Divorce support pages: `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/` and `/child-custody/`.
- VERIFIED: broad recommendation/top/trusted lawyer pages, city pages, LegalTech/tool promises, Maya/reputation/profile links and protected old/document assets remain blocked from core related cards.
- RECOMMENDED: approve related-card boundaries with the `/divorce-lawyer/` owner package before public upload.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce pillar owner-review draft package

- CREATED: `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: converted the `/divorce-lawyer/` section-level merge outline into a `15`-row owner approval package.
- VERIFIED: the package defines the primary URL, merge sources, support-page boundaries, legal/freshness/document gates, related-content boundary and redirect/canonical/sitemap hold state.
- RECOMMENDED: owner approves the package, then prepare a final merged draft/update package for review; otherwise run GSC API export first.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce pillar section merge outline

- CREATED: `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.md`.
- CREATED: `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: converted the duplicate-page comparison into a `20`-section merge plan for `/divorce-lawyer/`.
- VERIFIED: the large Hebrew duplicate, selection article and definition article are mapped into the pillar; consultation remains support; the generic divorce guide remains held for process-role review.
- REVIEW: live related-content on the pillar includes broad/recommendation-style items, so related-card boundaries must be cleaned before public upload execution.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family/Divorce duplicate page comparison

- CREATED: `project-control/family-divorce-duplicate-page-comparison-2026-05-12.md`.
- CREATED: `project-control/family-divorce-duplicate-page-comparison-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: checked the live duplicate divorce-lawyer group before first Family/Divorce upload.
- VERIFIED LIVE: `6` URLs returned `200` and self-canonicalized.
- VERIFIED LIVE: `/עורך-דין-לענייני-גירושין/` has `9,697` extracted live words and is a major merge-source candidate, not a page to ignore.
- RECOMMENDED: keep `/divorce-lawyer/` as the future primary pillar, merge strong material from the large duplicate and smaller selection/definition pages, keep consultation as support, and hold the generic divorce guide for process-role review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Divorce pillar side-by-side review

- CREATED: `project-control/family-divorce-divorce-pillar-side-by-side-2026-05-12.md`.
- CREATED: `project-control/family-divorce-first-upload-decision-table-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: compared `/divorce-lawyer/` with the old Hebrew divorce URL before any public upload or redirect.
- VERIFIED LIVE: `/divorce-lawyer/` returns `200`, self-canonicalizes and is the best first repair/enrichment candidate.
- VERIFIED LIVE: the old Hebrew divorce URL returns `200`, self-canonicalizes and has `960` GSC-browser impressions for `עורך דין גירושין`, but only `697` exported words.
- RECOMMENDED: merge useful old-page value into `/divorce-lawyer/`, keep the old URL live short term and decide redirect/canonical only after GSC API export and owner approval.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family Law / Divorce execution plan and GSC setup guide

- CREATED: `project-control/gsc-api-setup-guide.md`.
- CREATED: `project-control/family-law-divorce-execution-plan-2026-05-12.md`.
- VERIFIED / REVIEW ONLY: Family/Divorce is now documented as the first controlled upload cluster under the staged publishing strategy.
- VERIFIED: plan covers competitor research, current Jus-Tice pages, old pages to keep/improve/merge, new pages needed, pillar/support structures, internal-link map posture, English slug map, redirect/canonical notes, content gaps, upload checklist, first-publish candidates and wait list.
- VERIFIED: GSC setup guide explains required Search Console access, Google Cloud/API/OAuth credential setup, read-only scope, export fields and credential safety.
- RECOMMENDED: next cycle should build the side-by-side comparison for `/divorce-lawyer/` versus the old Hebrew divorce URL.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Cluster-by-cluster publishing strategy

- CREATED: `project-control/cluster-by-cluster-publishing-strategy-2026-05-12.md`.
- CREATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- CREATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`.
- CREATED: `project-control/gsc-api-access-plan-2026-05-12.md`.
- VERIFIED / REVIEW ONLY: content execution strategy now favors staged cluster-by-cluster publishing rather than waiting for the full sitewide audit before the first controlled upload.
- VERIFIED: Family/Divorce is the first recommended cluster, with Criminal Law, Medical Malpractice, Traffic, Real Estate and Personal Injury/Damages following.
- VERIFIED: minimum Family/Divorce upload gates now cover protected old URLs/documents, URL conflict prevention, anti-cannibalization, English slug posture, internal links, redirect/canonical/sitemap posture, disclaimers, no-fake-trust controls and GSC monitoring.
- RECOMMENDED: set up GSC API read-only query/page exports to reduce browser work and accelerate future clusters.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family/divorce owner upload review package

- CREATED: `project-control/family-divorce-owner-upload-review-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-owner-upload-review-package-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: `13` family/divorce target decisions are packaged for owner review before content upload or draft import.
- VERIFIED: package combines old Hebrew divorce URL risk, PDF/DOCX document risk, child-support calculator risk, custody PDF/case risk, support-page roles, internal-link map, upload order, anti-cannibalization rules, family-law hub separation and Maya/compliance boundaries.
- RECOMMENDED: approve planning only, then compare the divorce pillar, old Hebrew divorce article, document URLs, child-support/custody protected URLs and support pages side-by-side.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-12 - Family/divorce no-URL internal-link map

- CREATED: `project-control/family-divorce-no-url-internal-link-map-2026-05-12.md`.
- CREATED: `project-control/family-divorce-no-url-internal-link-map-2026-05-12.csv`.
- VERIFIED / REVIEW ONLY: `82` planned current-URL relationship/control rows were mapped for the family/divorce upload group.
- VERIFIED: the map connects the divorce pillar, six clean support pages, protected old GSC/document URLs, child-support/custody assets, property/dispute supports and compliance boundaries while keeping broad ranking/trust, city, LegalTech and Maya profile paths blocked until approved.
- READY FOR REVIEW: relationship type, priority, anchor intent, placement guidance and execution status are documented.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Medical malpractice owner upload review package

- CREATED: `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `8` medical-malpractice target decisions are packaged for owner review before content upload.
- VERIFIED: package combines duplicate same-public-URL identity risk, source/legal gates, current-URL readiness, internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
- RECOMMENDED: approve planning only, then compare `/medical-malpractice-lawyer/` duplicate records, the protected fee article and the old birth/pregnancy page side-by-side.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Medical malpractice no-URL internal-link map

- CREATED: `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `38` planned current-URL relationship/control rows were mapped for the medical-malpractice upload group.
- VERIFIED: the map connects the malpractice pillar candidate, protected fee/birth assets, surgery/anesthesia pages, definition/common-errors pages and birth-injury support while keeping traffic/Marvad, criminal negligence, US malpractice and future clean slugs blocked.
- READY FOR REVIEW: relationship type, priority, anchor intent, placement guidance and execution status are documented.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Medical malpractice current-URL upload readiness

- CREATED: `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `19` inventory candidates were scanned and `23` medical-malpractice URL or URL-reference items were advanced into review roles.
- VERIFIED: the queue separates commercial pillar, duplicate same-public-URL state, protected fee/birth assets, support pages, traffic/criminal boundaries and future-only slugs.
- READY FOR REVIEW: internal-link posture, sitemap posture, related-content boundaries and blocked public actions are documented.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Medical malpractice source/legal checklist

- CREATED: `project-control/medical-malpractice-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-source-legal-checklist-2026-05-11.csv`.
- VERIFIED SOURCE ANCHORS / REVIEW ONLY: `8` medical-malpractice page/topic gates were mapped before public YMYL copy or URL execution.
- VERIFIED: source anchors and limitations are documented for Ministry of Health, Kol Zchut, Patient Rights Law, Gov.il committee, State Comptroller and medical-record documentation sources.
- READY FOR REVIEW: allowed claims, blocked claims, privacy-risk level, disclaimer needs, schema/review restrictions and legal-review status are mapped per target.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Family/divorce current-URL upload readiness

- CREATED: `project-control/family-divorce-current-url-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/family-divorce-current-url-upload-readiness-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `92` inventory candidates were scanned and `58` family/divorce URL or URL-reference items were advanced into review roles.
- VERIFIED: the queue separates pillar, support, old high-risk URL, document-risk, child-support/custody, property/dispute, broad family-lawyer hub and Maya-profile items before public upload.
- READY FOR REVIEW: current URL roles, support hierarchy, merge candidates, sitemap posture, internal-link requirements and related-content boundaries are documented in one package.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Traffic law owner upload review package

- CREATED: `project-control/traffic-law-owner-upload-review-package-2026-05-11.md`.
- CREATED: `project-control/traffic-law-owner-upload-review-package-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `5` traffic-law target decisions are packaged for owner review before content upload.
- VERIFIED: package combines outline structure, source/legal gates, current-URL internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
- RECOMMENDED: approve the planning package only, then draft `/traffic-lawyer/` first under source/legal review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Traffic law no-URL internal-link map

- CREATED: `project-control/traffic-law-no-url-internal-link-map-2026-05-11.md`.
- CREATED: `project-control/traffic-law-no-url-internal-link-map-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `31` planned current-URL internal-link relationships were mapped for the traffic-law upload group.
- VERIFIED: the map connects traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness while keeping future clean slugs blocked.
- READY FOR REVIEW: relationship type, priority, anchor direction, placement guidance and reason are documented.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Traffic law source/legal checklist

- CREATED: `project-control/traffic-law-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/traffic-law-source-legal-checklist-2026-05-11.csv`.
- VERIFIED SOURCE ANCHORS / REVIEW ONLY: `5` traffic-law page/topic gates were mapped for traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- VERIFIED: source anchors and limitations are documented for police intoxication and breathalyzer procedures, point/suspension workflows, driver inquiries and Marvad medical-fitness workflows.
- READY FOR REVIEW: allowed legal claims, blocked legal claims, privacy/medical-risk level, disclaimer requirement and approval status are mapped per target.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Traffic law no-URL-change outline queue

- CREATED: `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.md`.
- CREATED: `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `5` outline targets were prepared across `10` current traffic-law URLs.
- VERIFIED: the batch covers `/traffic-lawyer/`, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- VERIFIED: future clean slugs stay blocked until owner approval, source/legal review, redirect planning, canonical planning, internal-link planning and sitemap planning.
- READY FOR REVIEW: section structures, internal-link posture, semantic related-content rules, CTA/lawyer-card safety rules and sitemap posture are documented for the traffic-law upload group.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Criminal law owner upload review package

- CREATED: `project-control/criminal-law-owner-upload-review-package-2026-05-11.md`.
- CREATED: `project-control/criminal-law-owner-upload-review-package-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `5` target decisions are packaged for owner review before content upload.
- VERIFIED: package combines outline structure, source/legal gates, current-URL internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
- RECOMMENDED: approve the planning package only, then draft `/criminal-defense-attorney/` first under source/legal review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Criminal law no-URL internal-link map

- CREATED: `project-control/criminal-law-no-url-internal-link-map-2026-05-11.md`.
- CREATED: `project-control/criminal-law-no-url-internal-link-map-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `21` planned current-URL internal-link relationships were mapped for the first criminal-law upload group.
- VERIFIED: the map connects current criminal pillar, police investigation, indictment, detention, detention-days and drug offenses while keeping future clean slugs blocked.
- READY FOR REVIEW: relationship type, priority, anchor direction, placement guidance and reason are documented.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Criminal law source/legal checklist

- CREATED: `project-control/criminal-law-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/criminal-law-source-legal-checklist-2026-05-11.csv`.
- VERIFIED SOURCE ANCHORS / REVIEW ONLY: `5` criminal-law page/topic gates were mapped for current criminal pillar, police investigation, indictment, detention and drug offenses.
- VERIFIED: source anchors and limitations are documented for criminal procedure, public-defense representation/investigation context, detention context and drug/cannabis public workflows.
- READY FOR REVIEW: allowed legal claims, blocked legal claims, confidentiality risk, disclaimer requirement and approval status are mapped per target.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Criminal law no-URL-change outline queue

- CREATED: `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.md`.
- CREATED: `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `5` outline targets were prepared across `6` current URLs.
- VERIFIED: the batch covers the current planning pillar `/criminal-defense-attorney/`, police investigation, indictment, detention and drug offenses.
- VERIFIED: all future clean slugs remain blocked until route repair, owner approval, redirect planning, canonical planning, internal-link planning and sitemap planning.
- READY FOR REVIEW: section structures, internal-link posture, semantic related-content rules, CTA/lawyer-card safety rules and sitemap posture are documented for the first criminal-law upload group.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Criminal law primary selection review

- CREATED: `project-control/criminal-law-primary-selection-2026-05-11.md`.
- CREATED: `project-control/criminal-law-primary-selection-2026-05-11.csv`.
- CREATED: `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`.
- CREATED: `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`.
- VERIFIED LIVE: `/criminal-defense-attorney/` returns `200 OK`, self-canonicalizes, is indexable, and has criminal-lawyer title/H1 signals.
- VERIFIED LIVE / BLOCKED: `/criminal-lawyer/`, the old Hebrew broad criminal-lawyer URL and a legacy deep criminal-law URL currently `301` to the homepage.
- RECOMMENDED: use `/criminal-defense-attorney/` as the current no-URL-change planning primary; keep `/criminal-lawyer/` future-only until route repair and migration approval.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Criminal law content upload readiness batch

- CREATED: `project-control/criminal-law-content-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/criminal-law-content-upload-readiness-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `220` raw criminal-adjacent inventory candidates were extracted and `50` higher-value URL candidates were mapped into pillar, support, merge/rewrite, source/reference, boundary and exclude lanes.
- VERIFIED: `/criminal-defense-attorney/` is the current clean-ish primary candidate, while `/criminal-lawyer/` remains the future strategic pillar target pending owner-approved migration.
- VERIFIED: the old Hebrew criminal-lawyer URL remains protected because GSC shows broad criminal-lawyer impressions there.
- VERIFIED: support lanes now cover police investigation, indictment, detention, drug offenses, sex offenses, economic/white-collar crime, tax offenses, criminal records, criminal defenses and selected case/source pages.
- CATEGORY CLEANUP: foreign-law, legal-career, victim-rights, defamation/police-complaint, traffic-criminal and cyber-criminal boundary pages are excluded from blind criminal-law pillar consolidation.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Traffic law content upload readiness batch

- CREATED: `project-control/traffic-law-content-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/traffic-law-content-upload-readiness-2026-05-11.csv`.
- VERIFIED / REVIEW ONLY: `38` traffic-adjacent URL candidates were mapped into pillar, support, merge/rewrite, boundary, legacy and false-positive lanes.
- VERIFIED: `/traffic-lawyer/` remains the current no-URL-change pillar candidate.
- VERIFIED: drunk driving, refusal/testing, breathalyzer, speeding, Marvad, license suspension/points and traffic evidence are the main support lanes.
- CATEGORY CLEANUP: business-license, professional-license, real-estate-license, trafficking and unrelated intoxication pages are excluded from traffic-law upload planning.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Lawyer REST public guard post-pull QA

- CREATED: `project-control/live-lawyer-rest-public-guard-2026-05-11.csv`.
- VERIFIED LIVE: anonymous `/wp-json/wp/v2/justice_lawyer?per_page=20` now returns `X-WP-Total: 0`, with no placeholder phone hits and no sensitive meta-key hits.
- VERIFIED LIVE: anonymous direct REST request for seed ID `19139` returns `404`.
- VERIFIED LIVE: `/lawyers/` remains public `200`, with `0` lawyer cards and no placeholder phone hits.
- REVIEW: static `deployment-marker.txt` still reports `2026-05-11-branding-polish-v3`, while page meta reports `2026-05-11-lawyer-rest-public-guard-v1`.
- REVIEW: one sampled old lawyer profile route lands on the homepage with `200` instead of the expected generic noindex `404`, but it did not expose placeholder phone data or sensitive meta.
- BLOCKED: old profile-route behavior still needs routing/permalink review; no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## 2026-05-11 - Traffic drunk-driving source audit

- CREATED: `project-control/traffic-drunk-driving-source-audit-2026-05-11.md`.
- CREATED: `project-control/traffic-drunk-driving-source-audit-2026-05-11.csv`.
- VERIFIED LIVE: `/driving-under-the-influence/`, `/traffic-lawyer/` and `/revocation-of-a-will-and-reviving-previous-will/` return `200`, self-canonical and indexable pages.
- VERIFIED: the will-revocation page has strong will/inheritance signals and no visible `נהיגה בשכרות` matches in fetched text, so it should not be optimized for traffic-law intent.
- REVIEW: the will page source contains sitewide `SiteNavigationElement` entries for traffic pages using `http://`; generator is not yet verified and needs schema/navigation-source audit.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Traffic/criminal wrong-page decision packet

- CREATED: `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`.
- CREATED: `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.csv`.
- VERIFIED: targeted GSC evidence shows `עורך דין נהיגה בשכרות` mapping to `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, so the will page is protected and must not be optimized for traffic-law intent.
- VERIFIED: `כתב אישום` maps only to a specific Netanyahu indictment page and homepage in the latest pass, so it is not a general indictment primary-page signal.
- RECOMMENDED: audit `/driving-under-the-influence/`, `/traffic-lawyer/` and the wrong-page will URL before any public drunk-driving content expansion.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Lawyer seed profile cleanup plan

- CREATED: `project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.md`.
- CREATED: `project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.csv`.
- VERIFIED LIVE BASELINE: public REST currently exposes `10` published `justice_lawyer` records, IDs `19130` through `19139`.
- VERIFIED LIVE BASELINE: all `10` exported records have placeholder/seed-style contact signals and are recommended as `DRAFT_OR_PRIVATE_UNTIL_REAL_SOURCE_APPROVED`.
- REVIEW: ID `19130` / Maya Rotenberg must be checked separately because she may be the intended real client prototype, but current public use still requires verified source/contact/approval.
- BLOCKED: owner approval and backup are required before any post-status/meta cleanup.
- SAFETY: no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## 2026-05-11 - Lawyer REST public guard

- VERIFIED LIVE BASELINE: `/lawyers/` returns `200` with `0` `lawyer-card` blocks and no placeholder phone hits.
- VERIFIED LIVE BASELINE: anonymous `/wp-json/wp/v2/justice_lawyer?per_page=20` returns `X-WP-Total: 10`, `11` placeholder phone hits and `50` sensitive meta-key hits before this patch is live.
- VERIFIED LIVE BASELINE: anonymous `/wp-json/wp/v2/justice_lawyer/19139` returns `200` before this patch is live.
- CODE FIXED: added `inc/lawyer-rest-guards.php` and included it from `functions.php`.
- CODE FIXED: anonymous lawyer REST collections now return public-approved profiles only; anonymous direct REST reads for unapproved lawyer IDs return `404`.
- CODE FIXED: anonymous approved lawyer REST responses strip `meta`, `acf` and `guid`.
- CODE FIXED: unapproved public lawyer profile routes are marked as `404` before head/SEO output, with generic Hebrew title/description, no Rank Math canonical and noindex/nofollow robots directives.
- CREATED: `project-control/lawyer-rest-public-guard-2026-05-11.md`.
- CREATED: `project-control/lawyer-rest-public-guard-2026-05-11.csv`.
- CREATED: `tools/check-live-lawyer-rest-public-guard.ps1`.
- CREATED: `project-control/live-lawyer-rest-public-guard-2026-05-11-before-pull.csv`.
- VERIFIED LOCAL: PHP lint passed for all `130` PHP files.
- NOT LIVE VERIFIED: requires uPress pull/cache refresh and live checker rerun for marker `2026-05-11-lawyer-rest-public-guard-v1`.
- SAFETY: no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## 2026-05-11 - Full review report action intake

- CREATED: `project-control/full-review-report-action-intake-2026-05-11.md`.
- CREATED: `project-control/full-review-report-action-intake-2026-05-11.csv`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, `project-control/final-integrated-launch-checklist.md`, and `project-control/task-board.csv`.
- VERIFIED / REVIEW ONLY: owner-provided site review was converted into P0/P1/P2 roadmap tasks for demo lawyer trust, mock data, Hebrew UI, menu links, legal policy pages, E-E-A-T, branding, taxonomy/cannibalization, URL migration, canonical/hreflang/HTTPS, 404 routing, lead routing, visuals, legacy CPTs and competitor-parity items.
- VERIFIED: existing project docs already cover several claims as code-fixed, live-checked or blocked, so new tasks distinguish `PARTIAL`, `NOT VERIFIED`, `BLOCKED` and `ROADMAP` rather than treating every report claim as newly confirmed.
- BLOCKED / P0: public demo/seed lawyer exposure remains the immediate pre-marketing verification gate.
- BLOCKED: no public lawyer record, content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, taxonomy, menu, breadcrumb, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Real estate route/CMS audit plan

- CREATED: `project-control/real-estate-route-cms-audit-plan-2026-05-11.md`.
- CREATED: `project-control/real-estate-route-cms-audit-plan-2026-05-11.csv`.
- UPDATED: `project-control/real-estate-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED LIVE: `/real-estate-lawyer/` returns `200` with `0` response bytes and no title/H1/canonical/body marker.
- VERIFIED LIVE: `/buying-apartment/` and `/real-estate-purchase-agreement/` resolve to homepage content with homepage canonical.
- BLOCKED: those future slugs must not be used in internal links, redirects, canonicals, sitemap plans, related cards, menus or breadcrumbs until route/CMS audit and owner approval.
- BLOCKED: no public real-estate route, content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Real estate owner decision summary

- CREATED: `project-control/real-estate-owner-decision-summary-2026-05-11.md`.
- CREATED: `project-control/real-estate-owner-decision-summary-2026-05-11.csv`.
- UPDATED: `project-control/real-estate-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- RECOMMENDED: `/real-estate-attorney/` as the current no-URL-change working primary for planning only.
- RECOMMENDED: keep `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` blocked until route/CMS audit and migration planning are approved.
- VERIFIED: `/real-estate-lawyer-cost-2025/` remains protected support and international property content remains separate from local Israeli real-estate lawyer-service intent.
- BLOCKED: no public real-estate content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Real estate side-by-side review

- CREATED: `project-control/real-estate-side-by-side-review-2026-05-11.md`.
- CREATED: `project-control/real-estate-side-by-side-review-2026-05-11.csv`.
- UPDATED: `project-control/real-estate-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/real-estate-attorney/` is the current no-URL-change planning primary and `/real-estate-lawyer-cost-2025/` remains protected high-impression support.
- REVIEW: `/real-estate-lawyer/` currently returns a `200` route with no fetched title/H1/canonical/body marker.
- REVIEW: `/buying-apartment/` and `/real-estate-purchase-agreement/` currently resolve to homepage content/canonical and must not be treated as safe support destinations.
- BLOCKED: no public real-estate content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Real estate page decision matrix

- CREATED: `project-control/real-estate-page-decision-matrix-2026-05-11.md`.
- CREATED: `project-control/real-estate-page-decision-matrix-2026-05-11.csv`.
- UPDATED: `project-control/real-estate-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/real-estate-attorney/` is classified as the current no-URL-change commercial candidate, while `/real-estate-lawyer/` remains a future-only migration slug.
- VERIFIED: `/real-estate-lawyer-cost-2025/` is protected as a high-impression support page.
- VERIFIED: broad property-law, fee/cost, buying-apartment, registry, tax, rental, contractor/defect and international-property pages now have role classifications before side-by-side review.
- BLOCKED: no public real-estate content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Real estate source and legal checklist

- CREATED: `project-control/real-estate-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/real-estate-source-legal-checklist-2026-05-11.csv`.
- UPDATED: `project-control/real-estate-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/real-estate-attorney/` remains the current no-URL-change commercial candidate; `/real-estate-lawyer/` remains a future strategic slug only.
- VERIFIED: `/real-estate-lawyer-cost-2025/` is protected as high-impression support content and should not be redirected, canonicalized away, noindexed or rewritten blindly.
- VERIFIED: registry, tax, sale-agreement, buying-apartment, contractor/defect, rental and international-property boundaries now have approval gates.
- BLOCKED: no public real-estate content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury rewrite outline queue

- CREATED: `project-control/personal-injury-rewrite-outline-queue-2026-05-11.md`.
- CREATED: `project-control/personal-injury-rewrite-outline-queue-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/tort-lawyer/` and `/car-accident-auto-injury-lawyer/` are queued only as blocked outline candidates.
- VERIFIED: road-accident, compulsory-insurance, tort-law support, US/international, work-accident and old-URL items remain separated and approval-gated.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury owner decision summary

- CREATED: `project-control/personal-injury-owner-decision-summary-2026-05-11.md`.
- CREATED: `project-control/personal-injury-owner-decision-summary-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: decision summary recommends `/tort-lawyer/` as the current no-URL-change planning primary, protects `/car-accident-auto-injury-lawyer/`, and keeps future clean slugs blocked until migration planning.
- VERIFIED: support pages, internal links, old URLs and work-accident boundary topics remain approval-gated.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury damages SERP review

- CREATED: `project-control/serp-personal-injury-damages-review-2026-05-11.md`.
- CREATED: `project-control/serp-personal-injury-damages-review-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: current public SERP patterns support a strong damages service page, a separate car-accident injury page and a cautious work-accident boundary decision.
- VERIFIED: `/tort-lawyer/` and `/car-accident-auto-injury-lawyer/` remain protected current candidates, while `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/` remain future-only.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury internal-link plan

- CREATED: `project-control/personal-injury-internal-link-plan-2026-05-11.md`.
- CREATED: `project-control/personal-injury-internal-link-plan-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: support-to-primary and primary-to-support internal-link relationships are mapped for `/tort-lawyer/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/` and `/personal-injury-law/`.
- VERIFIED: `/personal-injury-lawyer/` and `/car-accident-lawyer/` remain future-only migration notes, not live link targets.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, breadcrumb, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury side-by-side review

- CREATED: `project-control/personal-injury-side-by-side-review-2026-05-11.md`.
- CREATED: `project-control/personal-injury-side-by-side-review-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/tort-lawyer/` remains the current local damages/service candidate but is thin and needs approved expansion before pillar use.
- VERIFIED: `/car-accident-auto-injury-lawyer/` remains the protected current GSC-visible car-accident candidate, while future `/car-accident-lawyer/` remains migration-only planning.
- VERIFIED: `/punitive-damage/` is specialist support, `/personal-injury-law/` is US/international content, and tort-law concept pages remain support/merge-review assets.
- REVIEW: old Hebrew damages/category URL variants currently 301 to the homepage, so exact old URL capture and routing cleanup remain required before redirects.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury page decision matrix

- CREATED: `project-control/personal-injury-page-decision-matrix-2026-05-11.md`.
- CREATED: `project-control/personal-injury-page-decision-matrix-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/tort-lawyer/` is classified as current thin service candidate; `/personal-injury-lawyer/` remains future-only.
- VERIFIED: `/car-accident-auto-injury-lawyer/` is protected as current GSC-visible candidate; `/car-accident-lawyer/` remains future-only until migration planning.
- VERIFIED: support/specialist pages and US/international content were separated from broad Israeli service intent.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Personal injury source and legal checklist

- CREATED: `project-control/personal-injury-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/personal-injury-source-legal-checklist-2026-05-11.csv`.
- UPDATED: `project-control/personal-injury-owner-approval-packet.md`, `project-control/content-decision-batches.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: direct public URL checks returned 200 for `/tort-lawyer/`, `/punitive-damage/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/personal-injury-law/`, `/tort-reform/`, `/outline-of-tort-law/` and `/deep-pocket/`.
- VERIFIED: source/legal gates were mapped for tort law, road-accident compensation, police accident confirmation, National Insurance work injury, Ministry of Labor work-accident reporting, personal-accident benefits and US personal-injury separation.
- BLOCKED: no public personal-injury/damages content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Logo/favicon polish v3

- CODE FIXED: removed duplicate fallback favicon output from `header.php`.
- CODE FIXED: kept fallback favicon/app-icon logic centralized in `inc/seo.php`, preserving the WordPress Site Icon first path via `has_site_icon()`.
- CODE FIXED: removed negative letter-spacing from the newest premium brand/trust polish rules.
- UPDATED: premium brand CSS cache version to `4.3.1`, theme version to `1.0.4`, and deployment marker to `2026-05-11-branding-polish-v3`.
- VERIFIED: this version is aligned on top of the incoming v4.3 CSS commit that arrived during rebase.
- UPDATED: `project-control/favicon-logo-task.md`, `project-control/visual-qa-report.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED LOCAL: `git diff --check` passed with only normal Windows LF-to-CRLF warnings.
- VERIFIED LOCAL: PHP lint passed for all PHP files using the owner-provided local PHP zip extracted to a temporary runtime.
- NOT LIVE VERIFIED: public source still showed marker `2026-05-11-media-sitemap-https-v1` before uPress pull/cache refresh.
- SAFETY: no public content body, URL slug, redirect, noindex, canonical, sitemap, taxonomy, menu, lawyer, CRM, review, wp-admin option or CMS/database row was changed.

## 2026-05-11 - Cyber/privacy rewrite outline queue

- CREATED: `project-control/cyber-privacy-rewrite-outline-queue-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-rewrite-outline-queue-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: the queue separates primary-service, support-guide, boundary, section-first and context-support outline candidates.
- VERIFIED: all rows remain outline-only or section-only and block public execution.
- BLOCKED: no public cyber/privacy content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Cyber/privacy page decision matrix

- CREATED: `project-control/cyber-privacy-page-decision-matrix-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-page-decision-matrix-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: direct 200 checks passed for `/cyber-lawyer/`, `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, `/cyber-insurance/`, `/cybersex-trafficking/`, `/police-records-data-deletion/` and `/fbi-cyber-division/`.
- VERIFIED: the matrix classifies current cyber/privacy URLs as primary candidate, support, boundary, context, protected old URL, case support or planned section before execution.
- BLOCKED: no public cyber/privacy content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Cyber/privacy source and legal checklist

- CREATED: `project-control/cyber-privacy-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-source-legal-checklist-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: official/public source anchors were mapped for privacy/data breach, cyber event reporting, CERT, police complaints, computer-law, defamation-law and Google/platform removal process references.
- VERIFIED: the checklist separates cyber lawyer, cybercrime, privacy/data breach, online defamation/reputation, Google removal and police-record/data-deletion boundaries before any public rewrite.
- BLOCKED: no public cyber/privacy content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, internal link, related-card, menu, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Homepage controlled implementation checklist

- CREATED: `project-control/homepage-controlled-implementation-checklist-2026-05-11.md`.
- CREATED: `project-control/homepage-controlled-implementation-checklist-2026-05-11.csv`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`, `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: the checklist turns the homepage review and section-order proposal into a no-URL-change, owner-approved execution path.
- VERIFIED: the first public homepage batch is constrained to reversible template/link/empty-state/UX cleanup and requires screenshots, link crawl, PHP checks and rollback planning.
- BLOCKED: no public homepage, title/H1/meta, menu, template, URL, redirect, noindex, canonical, sitemap, internal link, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Homepage section-order and pillar-link proposal

- CREATED: `project-control/homepage-section-order-proposal-2026-05-11.md`.
- CREATED: `project-control/homepage-section-order-proposal-2026-05-11.csv`.
- CREATED: `project-control/homepage-curated-pillar-link-map-2026-05-11.csv`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`, `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: live URL checks were recorded for major homepage pillar candidates and fallbacks.
- VERIFIED: several clean strategic slugs still resolve to the homepage, so the proposal blocks blind homepage promotion of those URLs.
- REVIEW: proposed structure keeps `front-page.php` as the short-term live template and uses `page-home.php` only as a source of future approved sections.
- BLOCKED: no public homepage, title/H1/meta, menu, template, URL, redirect, noindex, canonical, sitemap, internal link, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Homepage line-by-line SEO/design review

- CREATED: `project-control/homepage-line-by-line-review-2026-05-11.md`.
- CREATED: `project-control/homepage-line-by-line-review-2026-05-11.csv`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`, `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: live homepage title, meta and H1 support broad legal-help / lawyer-directory intent.
- VERIFIED: live scrape matches the shorter `front-page.php` flow more than the richer `page-home.php` flow, so authoritative homepage template must be decided before execution.
- REVIEW: homepage has useful legal-help structure but still has uncurated taxonomy quick links, empty lawyer showcase state, latest-only article logic, first-party `http://` links, `?page_id=` links and a possible city-filter mismatch.
- BLOCKED: no public homepage, title/H1/meta, menu, template, URL, redirect, noindex, canonical, sitemap, internal link, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Cyber/privacy internal-link plan

- CREATED: `project-control/cyber-privacy-internal-link-plan-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-internal-link-plan-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/cyber-privacy-owner-approval-packet.csv`, `project-control/content-decision-evidence-overlay.csv`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: the plan maps primary-to-support and support-to-primary links around `/cyber-lawyer/`, cybercrime, cyber law, cyberattack, cyber insurance, cybersex trafficking, old privacy-injury and police-record/data-deletion pages.
- VERIFIED: all planned link rows remain approval-gated and are not live-site instructions.
- BLOCKED: no public content, internal link, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Cyber/privacy side-by-side content review

- CREATED: `project-control/cyber-privacy-side-by-side-review-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-side-by-side-review-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/cyber-privacy-owner-approval-packet.csv`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/cyber-lawyer/` remains the current service candidate but must be compared against the Hebrew cyber-lawyer role page and `/cybercrime-lawyer-roll/`.
- VERIFIED: `/fbi-cyber-division/` and `/cyber-laws/` are strong support assets but not approved primary pages by word count alone.
- VERIFIED: the old Hebrew privacy-injury URL remains protected; `/police-records-data-deletion/` remains a criminal-record/privacy/data-deletion boundary item.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Cyber/privacy SERP and source review

- CREATED: `project-control/serp-cyber-privacy-review-2026-05-11.md`.
- CREATED: `project-control/serp-cyber-privacy-review-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/cyber-privacy-owner-approval-packet.csv`, `project-control/content-decision-evidence-overlay.csv`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: cyber/privacy service intent remains a planning lane only; `/cyber-lawyer/` is the current inventory candidate but not a public execution approval.
- VERIFIED: the old Hebrew privacy-injury URL must be protected and compared because privacy-injury/privacy-protection GSC support signals already map there.
- VERIFIED: online defamation/shaming and data deletion remain source/legal/boundary review items, not approved duplicate content.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Cyber/privacy and national-insurance GSC gap pass

- CREATED: `project-control/gsc-cyber-national-gap-pass-2026-05-11.md`.
- CREATED: `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`.
- CREATED: `project-control/visual-evidence/gsc-gap-query-cyber-lawyer-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-gap-query-privacy-lawyer-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, and `project-control/gsc-content-priorities.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/cyber-privacy-owner-approval-packet.csv`, `project-control/national-insurance-owner-approval-packet.md`, and `project-control/national-insurance-owner-approval-packet.csv`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, `project-control/gsc-remaining-gap-queue-2026-05-11.md`, `project-control/visual-qa-report.md`, and `project-control/task-board.csv`.
- VERIFIED: `עורך דין סייבר` maps weakly to `/cybercrime-lawyer-roll/` with `42` impressions; `/cyber-lawyer/` has no visible reverse-query rows.
- VERIFIED: national-insurance service and empty-hub checks show no visible service signal; broad national-insurance rows are low-sample wrong-page/boundary evidence only.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Homepage and directory GSC evidence pass

- CREATED: `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.md`.
- CREATED: `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.csv`.
- CREATED: `project-control/visual-evidence/gsc-homepage-page-query-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-lawyers-page-query-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-query-lawyer-singular-pages-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-query-lawyers-plural-pages-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-query-find-lawyer-pages-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, and `project-control/gsc-content-priorities.csv`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, `project-control/targeted-gsc-query-queue.md`, `project-control/gsc-remaining-gap-queue-2026-05-11.md`, `project-control/visual-qa-report.md`, and `project-control/task-board.csv`.
- VERIFIED: the homepage currently owns broad lawyer/find-lawyer visibility in GSC, including `26` clicks and `5,459` impressions in the homepage page-to-query check.
- VERIFIED: `/lawyers/` returned zero visible GSC rows in the page-to-query check.
- BLOCKED: no public homepage, directory, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Remaining GSC gap queue

- CREATED: `project-control/gsc-remaining-gap-queue-2026-05-11.md`.
- CREATED: `project-control/gsc-remaining-gap-queue-2026-05-11.csv`.
- UPDATED: `project-control/targeted-gsc-query-queue.md`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: the new queue covers cyber/privacy, national insurance, homepage broad intent, lawyer-directory intent and page-to-query diagnostics.
- NOT VERIFIED: no new browser GSC metrics were pulled in this cycle; the queue is the executable plan for the next GSC pass.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - GSC pass-2 packet carry-forward

- UPDATED: `project-control/child-custody-owner-approval-packet.md`.
- UPDATED: `project-control/child-custody-owner-approval-packet.csv`.
- UPDATED: `project-control/traffic-law-owner-approval-packet.md`.
- UPDATED: `project-control/traffic-law-owner-approval-packet.csv`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `משמורת בלעדית לאם` pass-2 evidence is now carried in the custody approval packet as a protected old-case-law URL risk with `107` impressions and average position `9.6`.
- VERIFIED: drunk-driving pass-2 evidence is now carried in the traffic approval packet as a wrong-page signal on `/revocation-of-a-will-and-reviving-previous-will/`.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, wp-admin setting or CMS/database change was executed.

## 2026-05-11 - Targeted GSC browser pass 2

- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.md`.
- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- CREATED: `project-control/visual-evidence/gsc-targeted-drunk-driving-pages-2026-05-11.png`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, `project-control/targeted-gsc-query-queue.md`, `project-control/visual-qa-report.md`, and `project-control/task-board.csv`.
- VERIFIED: `משמורת בלעדית לאם` maps to an old case-law URL with `107` impressions and average position `9.6`.
- VERIFIED: `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` map to `/revocation-of-a-will-and-reviving-previous-will/`, confirming wrong-page traffic-law evidence.
- VERIFIED: `עבירות סמים` has only `2` impressions across case-law/old criminal URLs, and child-support modification variants returned zero visible rows.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - National insurance owner approval packet

- CREATED: `project-control/national-insurance-owner-approval-packet.md`.
- CREATED: `project-control/national-insurance-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: practice area `ביטוח לאומי` exists at `/practice-areas/national-insurance/` with count `0`; it is a hub candidate only, not an approved pillar.
- VERIFIED: strategic `/national-insurance-lawyer/` is proposed only in the URL migration draft for the old calculator URL and must not be created or redirected without owner approval.
- VERIFIED: the old national-insurance calculator has `1,778` words and quality `5/10`; the old disability regulations page has `24,883` words and quality `4/10`.
- NOT VERIFIED: direct GSC/SERP evidence for national-insurance lawyer, medical-committee, disability-benefit and work-injury terms is incomplete; checked `תאונת עבודה` evidence shows zero visible rows.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Cyber and privacy owner approval packet

- CREATED: `project-control/cyber-privacy-owner-approval-packet.md`.
- CREATED: `project-control/cyber-privacy-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/cyber-lawyer/` exists with `6,405` words, quality `8/10`, and internal links.
- VERIFIED: strategic `/cyber-privacy-lawyer/` is not a verified current public URL, while the heuristic selected `/fbi-cyber-division/` by word count only.
- NOT VERIFIED: direct GSC evidence for cyber/privacy terms is still missing and must be gathered before public execution.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Personal injury and damages owner approval packet

- CREATED: `project-control/personal-injury-owner-approval-packet.md`.
- CREATED: `project-control/personal-injury-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: strategic `/personal-injury-lawyer/` is not a verified current public URL, while the heuristic selected `/punitive-damage/` by word count only.
- VERIFIED: `/tort-lawyer/` exists but is thin at `507` words and quality `4/10`.
- VERIFIED: GSC browser evidence maps `תאונת דרכים` mainly to `/car-accident-auto-injury-lawyer/`, while future `/car-accident-lawyer/` has conflict rows and no exact current clean URL.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, menu, taxonomy, related-card, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Inheritance and wills owner approval packet

- CREATED: `project-control/inheritance-wills-owner-approval-packet.md`.
- CREATED: `project-control/inheritance-wills-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `will` has `10` conflict rows and `0` exact current clean `/will/` URLs.
- VERIFIED: strategic `/inheritance-lawyer/` is not a verified current public URL; the heuristic selected `/most-recommended-family-lawyer/` by word count only.
- VERIFIED: GSC browser evidence maps visible `צוואה` and `התנגדות לצוואה` demand to case-law, old Hebrew, support and document URLs, including a DOCX file.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, document/media, menu, taxonomy, related-card, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Real estate owner approval packet

- CREATED: `project-control/real-estate-owner-approval-packet.md`.
- CREATED: `project-control/real-estate-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/real-estate-attorney/` exists as current commercial candidate with `6,941` words and quality `6/10`, while exact `/real-estate-lawyer/` was not found as current public URL.
- VERIFIED: GSC browser evidence maps real-estate lawyer intent to the homepage and sale/buying/agreement support intent to `/real-estate-lawyer-cost-2025/`.
- VERIFIED: international-property content contaminates the real-estate cluster and must be classified before internal-link or migration decisions.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, homepage, menu, taxonomy, related-card, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Medical malpractice owner approval packet

- CREATED: `project-control/medical-malpractice-owner-approval-packet.md`.
- CREATED: `project-control/medical-malpractice-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `medical-malpractice-lawyer` has `27` conflict rows and duplicate same-public-URL records.
- VERIFIED: `/medical-malpractice-lawyer/` has public REST IDs `11607` and `1130`, with quality scores `6/10` and `8/10`.
- VERIFIED: GSC browser evidence maps visible `עורך דין רשלנות רפואית` demand to the fee article and maps birth/pregnancy malpractice demand to an old Hebrew birth-malpractice page.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, taxonomy, menu, lawyer, review/rating, schema, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Divorce and family-law owner approval packet

- CREATED: `project-control/divorce-family-owner-approval-packet.md`.
- CREATED: `project-control/divorce-family-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/divorce-lawyer/` is a clean candidate with `3,205` words and quality score `8/10`.
- VERIFIED: GSC browser evidence maps `עורך דין גירושין` mostly to an old Hebrew divorce-lawyer article with `960` impressions.
- VERIFIED: document URL risk exists for divorce/family queries: a PDF has `45` impressions and a DOCX has `86` impressions.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, document/media, homepage, menu, taxonomy, Maya profile, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Employment law owner approval packet

- CREATED: `project-control/employment-law-owner-approval-packet.md`.
- CREATED: `project-control/employment-law-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/labor-lawyer/` is the current service candidate but is thin at `689` words and quality score `4/10`.
- VERIFIED: GSC browser evidence maps `עורך דין דיני עבודה` mostly to the homepage and `דיני עבודה` mostly to `/israeli-labor-law/`.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, homepage, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Child custody owner approval packet

- CREATED: `project-control/child-custody-owner-approval-packet.md`.
- CREATED: `project-control/child-custody-owner-approval-packet.csv`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/child-custody/` is a likely public guide candidate with `2,397` words and a quality heuristic of `7/10`.
- VERIFIED: visible GSC broad custody demand maps to `what-is-child-custody/` and `ChildCustody.pdf`, while `משמורת בלעדית לאם` maps to an old case-law URL with average position `9.6`.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, PDF/document, robots, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Child support owner approval packet

- CREATED: `project-control/child-support-owner-approval-packet.md`.
- CREATED: `project-control/child-support-owner-approval-packet.csv`.
- UPDATED: `project-control/child-support-content-decision-packet.md`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/child-support/` is a likely public guide candidate with `2,767` words and a quality heuristic of `8/10`.
- VERIFIED: visible GSC child-support/calculation demand maps to the old calculator URL, so `https://jus-tice.co.il/מחשבון-מזונות-ילדים/` must be protected until a support/tool strategy is approved.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, calculator/tool claim, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Criminal law owner approval packet

- CREATED: `project-control/criminal-law-owner-approval-packet.md`.
- CREATED: `project-control/criminal-law-owner-approval-packet.csv`.
- UPDATED: `project-control/criminal-law-support-decision-packet.md`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/criminal-defense-attorney/` is a published clean page with `9,086` words and title alignment for `עורך דין פלילי`.
- VERIFIED: `/criminal-lawyer/` remains a strategic future target, but migration is blocked by conflict rows and old Hebrew GSC-signal URLs.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Traffic law owner approval packet

- CREATED: `project-control/traffic-law-owner-approval-packet.md`.
- CREATED: `project-control/traffic-law-owner-approval-packet.csv`.
- UPDATED: `project-control/traffic-law-support-decision-packet.md`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `/traffic-lawyer/` is a published exact clean URL and is thin at `1,399` words, so the safest first traffic batch is no-URL-change expansion.
- VERIFIED: `/driving-under-the-influence/` exists and must be reviewed/expanded before any `/drunk-driving/` clean-slug decision.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, title/H1/meta, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Criminal and traffic SERP evidence pass

- CREATED: `project-control/serp-criminal-traffic-review-2026-05-11.md`.
- CREATED: `project-control/serp-criminal-traffic-review-2026-05-11.csv`.
- UPDATED: `project-control/criminal-law-support-decision-packet.md`.
- UPDATED: `project-control/traffic-law-support-decision-packet.md`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: criminal-law SERPs support `/criminal-lawyer/` as a strategic commercial pillar, but old Hebrew URLs and existing support pages still block immediate URL/content execution.
- VERIFIED: `דין פלילי` requires careful intent separation to avoid cannibalizing `עורך דין פלילי`.
- VERIFIED: traffic-law SERPs support expanding `/traffic-lawyer/`, while `/driving-under-the-influence/` must be reviewed before any `/drunk-driving/` migration decision.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Targeted GSC browser evidence pass

- CREATED: `project-control/gsc-targeted-query-pass-2026-05-11.csv`.
- CREATED: `project-control/gsc-targeted-query-pass-2026-05-11.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-child-support-pages-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-content-priorities.csv`, `project-control/content-decision-evidence-overlay.csv`, and `project-control/child-support-content-decision-packet.md`.
- VERIFIED: GSC URL-prefix property `https://jus-tice.co.il/` is accessible in the browser, while the domain property route showed no access.
- VERIFIED: `מזונות ילדים`, `חישוב מזונות`, and `מחשבון מזונות` all map to `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`, not `/child-support/`.
- VERIFIED: `משמורת ילדים` maps to `https://jus-tice.co.il/what-is-child-custody/` and a `ChildCustody.pdf` upload, not clean `/child-custody/`.
- VERIFIED: employment-law queries show weak primary ownership across homepage, `/labor-lawyer/`, `/israeli-labor-law/`, case/support pages and one lawyer-facing page.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Criminal and traffic support decision packets

- CREATED: `project-control/criminal-law-support-decision-packet.md`.
- CREATED: `project-control/criminal-law-support-review.csv`.
- CREATED: `project-control/traffic-law-support-decision-packet.md`.
- CREATED: `project-control/traffic-law-support-review.csv`.
- VERIFIED: criminal-law support planning now compares `/criminal-lawyer/`, old Hebrew criminal-lawyer URLs, police-investigation, indictment, pretrial-detention, drug-offenses and existing criminal support/case-law pages.
- VERIFIED: traffic-law support planning now compares `/traffic-lawyer/`, existing `/driving-under-the-influence/`, possible `/drunk-driving/`, possible `/license-suspension/`, wrong-page will-revocation GSC matches and car-accident boundary pages.
- DECISION: do not create duplicate support pages where old or clean support content already exists; choose keep, expand, merge or migrate only after SERP, content-quality, legal/source and owner review.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Targeted GSC query queue

- CREATED: `project-control/targeted-gsc-query-queue.csv`.
- CREATED: `project-control/targeted-gsc-query-queue.md`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, `project-control/content-decision-batches.md`, `project-control/gsc-serp-first-evidence-pass.md`, and `project-control/task-board.csv`.
- VERIFIED: the queue turns the current NOT VERIFIED audit gaps into a concrete browser GSC sequence for child support, child custody, employment law, inheritance/wills, work/car accident, traffic/drunk-driving, and criminal support spokes.
- VERIFIED: each row documents expected primary URL, supporting URLs, known signal, GSC tabs to inspect, and decision rules if a clean URL, old URL, or multiple URLs appear.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Child support decision packet

- CREATED: `project-control/child-support-content-decision-packet.md`.
- CREATED: `project-control/child-support-conflict-review.csv`.
- UPDATED: `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: `child-support` is the largest current conflict group, with `30` rows and an exact clean URL candidate at `https://jus-tice.co.il/child-support/`.
- VERIFIED: `/child-support/` is the likely public guide candidate, while old long case-law/doctrine pages should be support or merge-review material until GSC and legal/source review are complete.
- NOT VERIFIED: direct GSC query filters for `מזונות ילדים`, `חישוב מזונות`, `מחשבון מזונות`, `בעמ 919/15`, `מזונות משותפת`, `הפחתת מזונות`, and `שינוי מזונות`.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Content decision evidence overlay

- CREATED: `project-control/content-decision-evidence-overlay.csv`.
- CREATED: `project-control/gsc-serp-first-evidence-pass.md`.
- UPDATED: `project-control/content-decision-batches.md`, `project-control/current-status.md`, `project-control/next-actions.md`, and `project-control/task-board.csv`.
- VERIFIED: existing `GSC_BROWSER_VERIFIED` rows were mapped onto the first URL/content decision queue for criminal, divorce, child support, medical malpractice, real estate, custody, mediation, traffic, personal injury, employment and inheritance targets.
- REVIEW: old Hebrew URLs, document/media URLs and support pages hold visible impressions in multiple clusters, so these are controlled migration decisions, not quick slug replacements.
- NOT VERIFIED: fresh GSC browser data was not captured in this pass; `child-support` and employment-law variants still need targeted GSC filters.
- BLOCKED: no URL migration, redirect, noindex, canonical, sitemap, content-body, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Media and image-sitemap HTTPS normalization

- PUSHED: `a74a28b` (`Normalize media sitemap URLs to HTTPS`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Normalize media sitemap URLs to HTTPS`.
- LIVE VERIFIED: public marker returns `2026-05-11-media-sitemap-https-v1`.
- FIXED LIVE: first-party media URLs now normalize to HTTPS in public attachment URL helpers, attachment image tuples, responsive srcsets and rendered post content.
- FIXED LIVE: Rank Math image sitemap URLs now normalize through `rank_math/sitemap/xml_img_src` and `rank_math/sitemap/urlimages`.
- VERIFIED SOURCE: Rank Math official sitemap hook documentation lists both hooks for changing image URLs/items in XML sitemaps.
- WHY: after the term-link fix, remaining first-party HTTP findings were isolated to 69 `SEO_PLUGIN_SITEMAP_MEDIA` rows and 2 `CONTENT_MEDIA_OUTPUT` rows.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only Windows LF-to-CRLF warnings.
- CREATED: `project-control/public-http-internal-link-scan-2026-05-11-after-media-sitemap-https.csv`.
- VERIFIED AFTER-SCAN: bounded public scan now records 42 `VERIFIED` resources and 0 `REVIEW` findings.
- DEPLOYMENT MARKER: `2026-05-11-media-sitemap-https-v1`.
- SAFETY: no media-library record, content body, stored URL, slug, redirect, sitemap inclusion rule, canonical setting, taxonomy, lawyer, CRM, review, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 - Theme-owned term links HTTPS normalization

- PUSHED: `005af18` (`Normalize theme term links to HTTPS`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Normalize theme term links to HTTPS`.
- LIVE VERIFIED: public marker returns `2026-05-11-theme-term-link-https-v1`.
- CODE FIXED / NOT LIVE VERIFIED: added `justice_theme_public_term_link()` for first-party HTTPS-normalized taxonomy term URLs.
- CODE FIXED: breadcrumbs, homepage popular legal-topic links, practice-area cards, article cards, single-article term chips, article archive term lists, lawyer mini-site area chips, fallback header dropdowns and related-content fallback targets now use HTTPS-normalized term links.
- TOOLING FIXED: `tools/check-public-http-internal-links.ps1` now records `suspected_source` and `remediation_lane`.
- CREATED: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv`.
- CREATED: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv`.
- REVIEW FINDING: the classified pre-fix scan has 160 findings needing review and 15 verified resources with no first-party HTTP references.
- FIXED LIVE: `THEME_DISPLAY_FIX` findings dropped from 54 before deployment to 0 after deployment.
- REVIEW REMAINS: 69 `SEO_PLUGIN_SITEMAP_MEDIA` findings and 2 `CONTENT_MEDIA_OUTPUT` findings remain for separate media/sitemap/content review.
- ROADMAP: queued future homepage line-by-line review, competitor-aligned homepage strategy, holistic content-upload governance, Google Business/marketing ecosystem planning and timing/resource tracking.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only Windows LF-to-CRLF warnings.
- SAFETY: no content body, CMS metadata, stored URL, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy term, lawyer, CRM, review, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 - Public first-party HTTP scan baseline

- PUSHED: `88a92f0` (`Add public HTTP link scan baseline`) to GitHub main.
- VERIFIED UPRESS PULL: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Add public HTTP link scan baseline`.
- CREATED: `tools/check-public-http-internal-links.ps1`.
- CREATED: `project-control/public-http-internal-link-scan-2026-05-11.csv`.
- CREATED: `project-control/public-http-internal-link-scan-review.md`.
- VERIFIED TOOLING: scanner checks public rendered HTML plus sitemap index/child XML for remaining `http://jus-tice.co.il` references.
- REVIEW FINDING: bounded scan found 199 remaining first-party HTTP references: 122 in rendered HTML pages and 77 in sitemap child XML.
- REVIEW FINDING: 118 findings are internal page/category/article URLs and 81 are media upload URLs.
- DECISION: classify source ownership before remediation; do not treat this as URL migration or redirect approval.
- SAFETY: no content body, CMS metadata, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy, lawyer, CRM, review, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 - Public template HTTPS link normalization

- PUSHED: `3b99fbb` (`Normalize public template links to HTTPS`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Normalize public template links to HTTPS`.
- LIVE VERIFIED: public marker returns `2026-05-11-public-link-https-normalization-v1`.
- CODE FIXED: added `justice_theme_public_url()` and `justice_theme_public_permalink()` display helpers.
- CODE FIXED: article cards, lawyer cards, search cards, generic cards, LegalTech cards, practice pages, lawyer mini-site article links, dashboard links, topic-cluster links and schema URLs now render first-party public URLs through HTTPS normalization.
- CREATED: `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv`.
- VERIFIED: all sampled live related-content rows passed after deployment.
- FIXED LIVE: related-card `card_url` values now use HTTPS in sampled public HTML.
- SAFETY: no stored URL, slug, redirect, content body, CMS metadata, sitemap inclusion rule, canonical setting, taxonomy, lawyer, CRM, review, plugin state, wp-admin setting or database row was changed.

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

## 2026-05-11 Content Inventory Refresh And Audit Map Rebuild
- RERAN: `tools/content-audit/wp-rest-export.ps1` against the public WordPress REST API.
- RERAN: `tools/content-audit/build-audit-v1.ps1` from the refreshed inventory.
- UPDATED: public export CSVs, `content-master-inventory.csv`, `content-quality-audit.csv`, `url-migration-map.csv`, `redirect-map.csv`, `cannibalization-map.csv`, `category-map.csv`, `topic-clusters.csv`, and `internal-link-map.csv`.
- VERIFIED: export contains `1,220` public content rows and `1,707` internal links.
- VERIFIED: audit maps contain `1,220` quality rows, `1,220` URL rows, `1,160` redirect-plan rows, `11` cannibalization groups, `110` category/term rows, `11` topic clusters, and `1,707` internal-link rows.
- VERIFIED: internal-link map has `0` first-party HTTP targets and `1,707` first-party HTTPS targets.
- BLOCKED: public menu export still returns WordPress REST `401`, so authenticated menu export remains a later step.
- SAFETY: no public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 Content Architecture Decision Review Batches
- CREATED: `tools/content-audit/build-decision-review-batches.ps1`.
- CREATED: `project-control/slug-conflict-review.csv`.
- CREATED: `project-control/editorial-slug-mapping-review.csv`.
- CREATED: `project-control/cluster-pillar-review.csv`.
- CREATED: `project-control/content-decision-batches.md`.
- VERIFIED: decision batches identify `15` slug-conflict groups, `481` editorial slug-mapping rows and `11` cluster pillar rows.
- VERIFIED: highest slug-conflict groups include `child-support`, `medical-malpractice-lawyer`, `criminal-lawyer`, `child-custody`, `will`, `pretrial-detention` and `divorce-lawyer`.
- VERIFIED: cluster review separates strategic target candidates from heuristic long-article picks, so long legacy posts are not mistaken for pillars.
- BLOCKED: GSC/SERP evidence and owner approval are still required before any redirect, URL, noindex, canonical, sitemap or content-body change.
- SAFETY: no public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 - Targeted GSC browser evidence pass 2

- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-2026-05-11.png`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-table-2026-05-11.png`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-2026-05-11.png`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-table-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-content-priorities.csv`, `project-control/content-decision-evidence-overlay.csv`, `project-control/child-support-content-decision-packet.md`, and project-control status files.
- VERIFIED: child-support sub-variants `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה`, and `בע"מ 919/15` returned no visible rows in the checked filters.
- VERIFIED: `משמורת בלעדית לאם` maps to an old Hebrew case-law URL with `107` impressions and average position `9.6`, so it is a protected support/merge-review URL.
- VERIFIED: `חקירה במשטרה` returned no visible rows; `עבירות סמים` is very low sample and split across old/case-law URLs.
- VERIFIED: `נהיגה בשכרות` maps to a will-revocation article, a wrong-page traffic-law match.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Targeted GSC browser evidence pass 3

- CREATED: `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`.
- CREATED: `project-control/gsc-targeted-query-pass-3-2026-05-11.md`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass3-indictment-netanyahu-url-2026-05-11.png`.
- SAVED EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass3-drunk-driving-lawyer-wrong-page-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-content-priorities.csv`, `project-control/content-decision-evidence-overlay.csv`, and project-control status files.
- VERIFIED: criminal support filters for `זכויות חשוד`, `מעצר ימים`, `סגירת תיק פלילי`, and `עורך דין עבירות סמים` returned no visible rows.
- VERIFIED: `כתב אישום` is a tiny specific-case signal, with visible pages on the Netanyahu indictment article and homepage, not a general indictment guide.
- VERIFIED: `עורך דין נהיגה בשכרות` still maps to a will-revocation article, confirming a wrong-page traffic-law match.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-11 - Cyber/privacy support GSC browser evidence pass

- CREATED: `project-control/gsc-cyber-privacy-support-pass-2026-05-11.md`.
- CREATED: `project-control/gsc-cyber-privacy-support-pass-2026-05-11.csv`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-content-priorities.csv`, `project-control/content-decision-evidence-overlay.csv`, `project-control/cyber-privacy-owner-approval-packet.md`, `project-control/cyber-privacy-owner-approval-packet.csv`, and project-control status files.
- VERIFIED: `פגיעה בפרטיות` has 38 impressions and `הגנת הפרטיות` has 7 impressions on an old Hebrew privacy-injury URL.
- VERIFIED: `שיימינג` has a one-impression wrong-page signal on `/changing-or-canceling-a-prenuptial-agreement/`.
- VERIFIED: `מתקפת סייבר`, `לשון הרע באינטרנט`, and `מחיקת מידע` returned no visible rows.
- BLOCKED: GSC screenshot capture timed out for this pass, so evidence is text-metric based.
- BLOCKED: no URL, redirect, noindex, canonical, sitemap, content-body, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change was executed.

## 2026-05-12 - Family/Divorce protected asset strategy

- CREATED: `project-control/family-divorce-protected-assets-strategy-2026-05-12.md`.
- CREATED: `project-control/family-divorce-protected-assets-strategy-2026-05-12.csv`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`.
- UPDATED: `project-control/family-law-divorce-execution-plan-2026-05-12.md`.
- UPDATED: `project-control/content-decision-batches.md`.
- UPDATED: project-control status and action files.
- VERIFIED: `16` protected asset rows now cover the divorce PDF, mediation DOCX, child-support calculator, 919/15 case-law asset, what-is-child-custody article, ChildCustody PDF, sole-mother custody case reference and post-upload QA gates.
- VERIFIED: `FAM-UPLOAD-003`, `FAM-UPLOAD-004`, `FAM-UPLOAD-005` and `FAM-UPLOAD-006` are planning-verified, not execution-approved.
- BLOCKED: GSC API export and owner approval are still required before any redirect, noindex, deletion, canonical, sitemap-removal, media-file, document-template, calculator/tool or public content action.
- SAFETY: no public content body, title/H1/meta, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, internal link, related-card, document/media file, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-12 - Family/Divorce first upload package

- CREATED: `project-control/family-divorce-first-upload-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-first-upload-package-2026-05-12.csv`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`.
- UPDATED: `project-control/family-law-divorce-execution-plan-2026-05-12.md`.
- UPDATED: `project-control/content-decision-batches.md`.
- UPDATED: project-control status and action files.
- VERIFIED: `20` package rows define Wave 1A, Wave 1B, Wave 1C, wait-list, QA and GSC lanes.
- VERIFIED: Wave 1A is `/divorce-lawyer/`, while Wave 1B contains the six core support pages with drafts available but review required.
- RECOMMENDED: prepare the final merged `/divorce-lawyer/` draft/update package next; do not publish all seven pages blindly as one dump.
- SAFETY: no public content body, draft import, title/H1/meta, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, internal link, related-card, document/media file, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-12 - Divorce lawyer final draft package

- CREATED: `project-control/family-divorce-divorce-lawyer-final-draft-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-divorce-lawyer-final-draft-package-2026-05-12.csv`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`.
- UPDATED: `project-control/family-law-divorce-execution-plan-2026-05-12.md`.
- UPDATED: `project-control/content-decision-batches.md`.
- UPDATED: project-control status and action files.
- VERIFIED: `36` rows translate the existing `5,691`-word Hebrew draft and 20-section merge outline into a CMS update plan.
- PARTIAL VERIFIED: `FAM-UPLOAD-027` is now partially verified; the package exists and a later cycle created the CMS-clean public body file.
- RECOMMENDED: review the clean `/divorce-lawyer/` public body and controlled upload QA package before any CMS import.
- SAFETY: no public content body, draft import, title/H1/meta, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, internal link, related-card, document/media file, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.
