# Editorial Policy Trust Route - 2026-05-19

## Objective
Give Jus-Tice a public, indexable editorial policy page that supports the E-E-A-T authority program without requiring a live WordPress database edit.

## Research Used
- Google Search Central helpful-content guidance: legal/YMYL content should make the "who, how, and why" behind the content clear, including author/site background and trust signals.
- Google Search Central Article structured-data guidance: Article markup can help Google understand article metadata, but author/reviewer identity must be represented accurately.

## Repo Change
- Added a virtual route for `/editorial-policy/` in `inc/trust-routes.php`.
- The route uses the existing trust-route renderer, SEO metadata filters, canonical URL handling, and `index, follow` robots behavior.
- The page explains:
  - content purpose and limitations;
  - no legal-advice / no attorney-client relationship boundary;
  - when a lawyer can appear as author or reviewer;
  - how unverified articles are attributed to the Jus-Tice editorial organization;
  - paid profile disclosure expectations;
  - corrections and update path.

## Why This Matters
The owner reported that another team added Ben Batash broadly as the author on legal articles. For a legal portal, that is risky unless the author identity and practice-area authority chain are real and verifiable. This route creates the public policy surface that supports the safer attribution model in PR #8.

## Verification Plan
1. PHP lint `inc/trust-routes.php`.
2. Confirm `/editorial-policy/` returns 200 after PR merge and uPress pull.
3. Confirm the page is indexable and has canonical `https://jus-tice.co.il/editorial-policy/`.
4. Add the page to footer/sitewide trust links in a later focused commit after visual QA.

## Safety
No live wp-admin, CMS database, lawyer profile, lead, user, payment, GA4, GSC, URL redirect, noindex, sitemap, taxonomy, social profile, Google Business Profile, uPress deployment, or client charge was changed.

