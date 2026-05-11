# Full Review Report Action Intake - 2026-05-11

Status: VERIFIED task intake / REVIEW ONLY

Source: owner-provided full review report in English and Hebrew.

Execution rule: this pass only read the report, analyzed overlap with existing control docs, and added tasks. No public content, URL, redirect, canonical, sitemap, title/H1/meta, taxonomy, menu, lawyer, CRM, review, wp-admin setting, CMS/database or theme behavior change was executed.

## Summary

The report is directionally aligned with the current project: Jus-Tice has a strong WordPress/content foundation but is not launch-ready until trust, demo-data, localization, policy, content-quality, taxonomy and visual-brand gates are closed.

Important nuance: several report findings already have code fixes or live checks documented in `project-control/current-status.md`, `project-control/next-actions.md`, `project-control/visual-qa-report.md` and `project-control/task-board.csv`. Therefore this intake does not treat every claim as newly true. Items are added as one of:
- P0 launch blocker.
- P1 verify/fix before public marketing.
- P2 roadmap/competitive parity.

## Highest-Priority Launch Blockers

### P0 - Demo / Fictional Lawyer Trust Gate

Status: BLOCKED until live verification and owner-approved remediation.

Report claim: 10 fictional lawyers and fake phone numbers may be visible publicly.

Existing project overlap:
- Lawyer public approval gates, demo seeder gates, placeholder phone suppression, and default-disabled profile-view writes are already documented as code-fixed in prior work.
- Some live verification remains marked NOT VERIFIED or historically showed demo profiles.

Required task:
- Re-run a live lawyer-directory/profile QA pass.
- Confirm whether demo/seed/unapproved lawyers are visible to normal visitors.
- If visible, owner must choose one remediation path:
  1. unpublish/draft/private demo profiles;
  2. keep them hidden behind public approval gates;
  3. if a demo environment is needed, add an unmistakable demo-only label outside public marketing flow.

Acceptance criteria:
- No visitor can reasonably believe a seed/demo lawyer is a real available lawyer.
- No placeholder phone/WhatsApp route is exposed.
- Lawyer cards/profiles show no fake ratings, fake badges, fake reviews or fake verification claims.
- Live screenshot/source evidence is stored after the fix.

## P1 - Pre-Marketing Cleanup Tasks

### Hebrew UI / English Leak Verification

Status: PARTIAL / RECHECK.

Report claim: 404, search, pagination and archive/OG text leak English.

Existing project overlap:
- Search, 404 and archive label fixes are documented.
- `/lawyers/` English `Archive` leak is documented as live fixed.
- Current sampled visual QA says `/lawyers/`, `/articles/` and Hebrew search no longer show sampled English default strings in title/UI.

Required task:
- Re-run a public Hebrew UI smoke test for homepage, search, no-results, 404, articles archive, lawyer archive and one article.
- Keep any remaining English strings in the next controlled cleanup batch.

### Contact / About Menu URL Verification

Status: NOT VERIFIED from this intake.

Report claim: navigation uses raw `?page_id=42` and `?page_id=315`.

Required task:
- Verify live header/footer/menu source and WordPress menu state.
- Replace public raw page-id links with stable slugs only after the target pages and slugs are confirmed.

### Required Legal / Policy Pages

Status: P1 NOT DONE unless verified separately.

Required pages before public marketing:
- Privacy Policy.
- Terms of Use.
- Editorial Policy.
- Advertising / Paid Placement Disclosure.
- Lawyer Verification / Review Policy where relevant.

Acceptance criteria:
- Pages are published, linked in footer, written in Hebrew, and reviewed for Israeli legal-services context.
- Policy pages do not promise lawyer quality, legal outcomes, or review/rating claims the platform cannot prove.

### E-E-A-T / YMYL Article Trust Layer

Status: P1 NOT DONE as a complete system.

Required task:
- Add an approval-gated plan for article authorship, legal reviewer, review date, source date, official-source links and no-legal-advice disclaimer.
- Do not fabricate lawyer authors or review badges.

### Logo / Favicon / Search Branding Recheck

Status: PARTIAL / VERIFY.

Existing project overlap:
- Logo/favicon assets and fallback logic are documented.
- Live favicon URLs have been verified as HTTP 200.
- Final WordPress Site Icon media selection and Google search-result favicon refresh remain NOT VERIFIED.

Required task:
- Recheck browser tab favicon, mobile bookmark/app icon, page source tags, crawlability and Google result readiness after latest deploy/cache state.

### Taxonomy / Content Cannibalization

Status: IN PROGRESS.

Report claim: many overlapping practice-area terms and uncategorized/empty articles create cannibalization.

Existing project overlap:
- Content inventory, quality audit, URL migration map, category map, topic clusters, cannibalization map and decision batches already exist.

Required task:
- Continue GSC-backed cluster decisions.
- Do not merge/delete/redirect taxonomies until a canonical taxonomy map and redirect/canonical/internal-link plan are owner-approved.

### Hreflang / Canonical / HTTPS Verification

Status: PARTIAL / VERIFY.

Existing project overlap:
- Hebrew `hreflang` and HTTPS normalization are documented as code-fixed, with live verification still required in some cases.

Required task:
- Re-run source checks for homepage, articles archive, lawyer archive, one article, one practice page and one future-blocked slug.
- Confirm canonical, hreflang, OG URLs and first-party internal links are HTTPS and consistent.

### 404 / Old URL Routing

Status: BLOCKED.

Existing project overlap:
- Native 404 guard exists, but the active `All 404 Redirect to Homepage` plugin is documented as blocking real 404 behavior.

Required task:
- Owner approval is needed before deactivating the plugin.
- After deactivation, verify invalid URLs return real Hebrew 404 with noindex/no-follow and no homepage canonical.

## P2 - Roadmap / Competitive-Parity Tasks

These should be added to roadmap, but not executed before the P0/P1 gates:
- Real lawyer onboarding and verification workflow.
- Lawyer photos/headshots and image policy.
- Article featured-image/thumbnails plan.
- Practice-area icon replacement for empty-box icons.
- Multi-contact lawyer card CTAs where real data exists.
- Trust/review/reputation modules only after compliance policy approval.
- Q&A/forum, newsletter, legal forms library and editorial/news/case-summary areas.
- Practice-area x city matrix with thin-page/faceted-indexing controls.
- Legacy CPT cleanup and REST exposure review.
- CSS/frontend performance/minification review after template structure stabilizes.

## Immediate Recommended Order

1. P0: verify and close public demo lawyer exposure.
2. P1: verify/fix Hebrew UI leaks and menu raw page-id links.
3. P1: publish/link legal policy pages.
4. P1: recheck logo/favicon/search branding.
5. P1: continue GSC-backed taxonomy/content/cannibalization decisions.
6. P1: owner-approved 404 plugin deactivation and routing QA.
7. P2: visual/editorial/product parity roadmap.

## Not Executed

- No public lawyer records were unpublished or edited.
- No titles, H1s, meta, canonicals, redirects, sitemap rows or URLs were changed.
- No menu/page links were changed.
- No taxonomy merges were executed.
- No policy pages were created or published.
- No live theme/plugin code was changed.
