# Signup Success Attribution - 2026-05-24

## Purpose

Keep paid-lawyer acquisition attribution visible after registration success, especially for outreach batches segmented by message, city, practice area and keyword intent.

## Research Basis

- Google Analytics 4 campaign URL guidance identifies campaigns through UTM-tagged URLs and examples include `utm_source`, `utm_medium`, `utm_campaign` and `utm_content`.
- GA4 traffic-source documentation treats manual campaign tagging as the basis for source, medium and campaign reporting.
- Live Jus-Tice behavior showed Yoast redirects UTM query parameters into the URL hash on the lawyer registration success page. Browser-side success tracking therefore has to read both the query string and hash parameters.

Sources:
- https://support.google.com/analytics/answer/10917952
- https://support.google.com/analytics/answer/11242870

## What Changed

- `inc/lawyer-onboarding.php` now preserves `utm_content`, `utm_term`, `outreach_city` and `outreach_practice` in the post-submit success redirect, in addition to the existing source, medium, campaign and segment fields.
- `assets/js/analytics-events.js` now merges URL hash parameters into the success-event parameter set before firing `lawyer_signup_submit`.
- `tools/check-live-lawyer-revenue-funnel.mjs` now verifies both the Yoast UTM-to-hash redirect and the deployed analytics asset markers.

## Live Verification

- Local syntax checks passed for PHP and JavaScript.
- uPress Git pull completed successfully after both code commits.
- Live lawyer revenue funnel passed `9/9` after deployment.
- The checker now includes `registration-success-utm-hash-redirect`, proving that `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term` survive the public redirect as hash parameters.

## Owner Value

Paid lawyer signup success events can now be attributed to a specific outreach message, city, practice area and keyword bucket. This makes manual sales follow-up and future subscription conversion reporting more useful without adding API spend or touching the public CMS database.

## Remaining Blocker

Automatic recurring lawyer payments remain blocked until Grow/Meshulam approval and gateway/product mapping are complete. The current path still supports manual invoice activation.

## Safety

No CMS database write, public content publishing, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead record, CRM, email/SMS or GSC/GA4 setting was changed.
