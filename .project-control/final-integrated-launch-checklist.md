# Final Integrated Launch Checklist
Date: 2026-05-10  
Status: FINAL CHECKLIST SHELL - extends `integrated-launch-checklist.md`

## Relationship To Main Checklist

The operational checklist remains:

`project-control/integrated-launch-checklist.md`

This file adds final pre-launch gates, including the new review/reputation module.

## Final Gates

Before public marketing to lawyers:
- P0 full-review trust gate complete: no seed/demo/unapproved lawyer appears to visitors as a real available lawyer.
- P0 mock-data gate complete: no fake phone numbers, fake ratings, fake badges, fake reviews, placeholder CTAs or non-working user promises are visible without clear demo/explanatory context.
- logo/favicon stable and crawlable.
- mobile/search-branding manifest stable and crawlable.
- homepage mobile clean.
- lawyer cards do not make fake claims.
- lawyer directory does not show demo profiles as real lawyers.
- articles have no internal notes.
- URL migration map and redirect map approved before any URL changes.
- sitemap/canonical/robots reviewed.
- GSC risks reviewed.
- lead forms tested.
- analytics events ready.

## 2026-05-11 Full Review Report Gates

Added from owner-provided full review report:
- DEMO LAWYER VERIFIED: live lawyer directory and profile URLs are checked after deployment/cache state; any demo/seed/unapproved profiles are hidden, drafted, private, or unmistakably labeled outside public marketing.
- HEBREW UI VERIFIED: homepage, search, no-results, 404, articles archive, lawyer archive and one article have no sampled English WordPress default strings.
- MENU VERIFIED: Contact/About and other main navigation links use stable approved slugs, not raw `?page_id=` URLs.
- POLICY VERIFIED: Privacy, Terms, Editorial Policy, Advertising/Paid Placement Disclosure and Lawyer Verification/Review Policy exist where relevant.
- ARTICLE TRUST VERIFIED: high-value legal pages have an approved author/reviewer/source-date/freshness/disclaimer plan before publication.
- TAXONOMY VERIFIED: overlapping practice-area terms have an approved canonical map before merge, redirect, noindex or sitemap changes.
- URL MIGRATION VERIFIED: old URL -> 301 -> new URL -> sitemap -> internal links -> canonical consistency is approved before any URL changes.
- 404 ROUTING VERIFIED: invalid URLs return a real Hebrew 404 after owner-approved plugin/server change; valid URLs remain 200.
- VISUAL TRUST VERIFIED: logo, favicon, OG image, lawyer imagery, article thumbnails and practice-area icons are either approved, real, or safely omitted without broken UI.
- LEAD FLOW VERIFIED: lead forms and lawyer contact CTAs route to a real destination before marketing.

## Review / Reputation Gates

Do not launch public review/rating features until:
- review policy exists.
- moderation workflow exists.
- privacy warning exists.
- no-incentive Google review policy exists.
- paid placement disclosure exists.
- lawyer verification policy exists.
- Google Place ID source is verified.
- rating/count source and last verified date are stored.
- `AggregateRating` schema remains disabled unless approved.
- Maya prototype has no fake reviews or fake ratings.

## Status

PARTIAL. The review/reputation strategy is documented, but no public review feature is implemented.

Reference:
- `project-control/reviews-reputation-research.md`
- `project-control/review-compliance-risk.md`
- `project-control/google-reviews-integration-plan.md`
- `project-control/lawyer-rating-system-spec.md`
- `project-control/reputation-product-roadmap.md`

## 2026-05-11 Added Reputation Launch Gates

Before any lawyer review/rating element appears publicly:
- SOURCE VERIFIED: every rating/count has source proof.
- POLICY VERIFIED: review policy, privacy warning and moderation rules exist.
- NO FAKE DATA VERIFIED: no seed/fake ratings or fake review snippets.
- GOOGLE COMPLIANT: no incentives, no review gating, no copied Google review text without approval.
- SCHEMA BLOCKED: no AggregateRating/Review schema until explicitly approved.
- PAID DISCLOSURE READY: paid placement and review/trust signals are separated.
- MOBILE VERIFIED: review cards fit lawyer cards and mini-sites on mobile.
- ACCESSIBILITY VERIFIED: rating text is readable without relying only on star icons.
