# Final Integrated Launch Checklist
Date: 2026-05-10  
Status: FINAL CHECKLIST SHELL - extends `integrated-launch-checklist.md`

## Relationship To Main Checklist

The operational checklist remains:

`project-control/integrated-launch-checklist.md`

This file adds final pre-launch gates, including the new review/reputation module.

## Final Gates

Before public marketing to lawyers:
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
