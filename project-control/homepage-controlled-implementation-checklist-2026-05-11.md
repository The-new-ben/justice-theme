# Homepage Controlled Implementation Checklist - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NEEDS OWNER APPROVAL

Purpose:
Turn the homepage line-by-line review and section-order proposal into an executable, no-URL-change implementation checklist. This does not approve public edits. It defines the safe batch only after owner approval.

## Inputs

VERIFIED:
- `project-control/homepage-line-by-line-review-2026-05-11.md`
- `project-control/homepage-line-by-line-review-2026-05-11.csv`
- `project-control/homepage-section-order-proposal-2026-05-11.md`
- `project-control/homepage-section-order-proposal-2026-05-11.csv`
- `project-control/homepage-curated-pillar-link-map-2026-05-11.csv`

Code surfaces to review before implementation:
- `front-page.php`
- `page-home.php`
- `template-parts/sections/hero.php`
- `template-parts/sections/practice-areas-grid.php`
- `template-parts/sections/featured-lawyers.php`
- `template-parts/sections/latest-articles.php`
- `template-parts/sections/ask-lawyer.php`
- `archive-justice_lawyer.php`

## Owner Approval Gates

BLOCKED until owner approval:
1. Confirm `front-page.php` is the short-term authoritative live homepage template.
2. Approve or edit the proposed section order.
3. Approve or edit the curated pillar-link and fallback map.
4. Decide whether empty featured-lawyer blocks should be hidden until real approved profiles exist.
5. Confirm this first batch has no URL changes, redirects, noindex, canonical, sitemap, title/H1/meta, menu, CMS/database, CRM or review-system changes.

## Controlled Batch Scope

Allowed after approval:
- Keep the current homepage H1/title/meta unchanged in the first batch unless separately approved.
- Keep `front-page.php` as the live template; do not switch to `page-home.php` blindly.
- Replace raw taxonomy-count homepage links with approved curated pillar/fallback links.
- Correct hero search city values only if they are verified against `/lawyers/` filters.
- Hide or replace empty featured-lawyer states if no real lawyer profile is approved.
- Replace latest-only article logic with approved cluster/priority guide logic only after the article map is approved.
- Keep LegalTech, newsletter and future product sections gated until routes, forms and analytics are real.

Not allowed in this batch:
- URL slug changes.
- 301 redirects.
- Canonical changes.
- Sitemap changes.
- Robots/noindex changes.
- Homepage title/H1/meta rewrite.
- Menu restructuring.
- CMS/database writes.
- Fake lawyer, rating, badge or review data.
- Form/CRM behavior changes unless tested and separately approved.

## Preflight Checklist

Before any code edit:
- VERIFIED: git worktree is clean or unrelated changes are documented.
- VERIFIED: public homepage baseline screenshot exists for desktop and mobile.
- VERIFIED: current homepage link crawl is saved, including first-party `http://`, `?page_id=` and `#` links.
- VERIFIED: major homepage target URLs are checked for 200/direct behavior before promotion.
- VERIFIED: `/lawyers/` filter parameters and city slugs are checked before changing hero search values.
- VERIFIED: current contact/intake CTAs are inventoried.
- VERIFIED: fake/mock/demo data risks are listed.

## Implementation Checklist

Step 1 - Template authority:
- Confirm `front-page.php` remains the source of truth for the first public batch.
- Do not import full `page-home.php` sections without separate review.

Step 2 - Hero/search:
- Keep the legal-help intent clear.
- Verify search fields route users to a real directory/search result.
- Correct only verified filter values.

Step 3 - Curated legal hubs:
- Use approved pillar/fallback map.
- Avoid promoting clean slugs that resolve to the homepage.
- Keep anchor text natural and Hebrew-facing.

Step 4 - Lawyer directory entry:
- Keep `/lawyers/` visible as the broad directory destination.
- Do not claim lawyer availability, rating or verification unless real.

Step 5 - Article/library entry:
- Do not use random latest-only logic on the final major homepage.
- Use approved cluster-priority content after content audit approval.

Step 6 - Empty/fake states:
- Hide empty lawyer showcase if no approved real profile exists.
- Do not show fake phones, fake ratings, fake badges, demo names or placeholder CTAs.

Step 7 - Measurement:
- Keep CTA and search events on the GA4 event-plan queue.
- Do not add production analytics code until event naming and testing are approved.

## QA Checklist

After implementation, before deploy:
- VERIFIED: PHP syntax check passes for changed PHP files.
- VERIFIED: `git diff --check` passes.
- VERIFIED: no secrets or credentials are added.
- VERIFIED: desktop and mobile screenshots show no overflow, broken logo, broken cards, or layout shift.
- VERIFIED: homepage links do not include unintended first-party `http://` URLs or `?page_id=` URLs unless explicitly approved.
- VERIFIED: promoted pillar links point to direct approved pages or approved fallbacks.
- VERIFIED: no fake ratings, fake reviews, fake badges or fake lawyer trust claims appear.
- VERIFIED: no URL, redirect, canonical, sitemap, noindex or robots changes are included.

After deploy/pull:
- VERIFIED: public homepage renders the expected section order.
- VERIFIED: public desktop and mobile screenshots match the approved scope.
- VERIFIED: public source contains the same approved links.
- VERIFIED: no 404 or homepage-resolving pillar links were introduced.
- VERIFIED: forms/search routes are checked without submitting real leads unless approved.

## Rollback Plan

Use a single small commit for the approved homepage batch.

If public QA fails:
- Revert that commit.
- Do not change database settings.
- Do not redirect or delete URLs.
- Re-test desktop, mobile, links and forms after rollback.

## Decision Summary

VERIFIED:
- This checklist creates an executable homepage path without approving live edits.
- The next public homepage batch should be small, no-URL-change and reversible.
- Homepage design and content must be reviewed together.

BLOCKED:
- Public homepage implementation is blocked until owner approval.
- URL/canonical/sitemap/redirect/title/H1/meta/menu/CMS changes remain blocked.

Next action:
- Owner approves or edits this checklist, section order and pillar-link map.
- If not approved yet, continue review-only content architecture tasks.
