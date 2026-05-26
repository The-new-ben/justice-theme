# Lawyer Registration Success Attribution - 2026-05-24

## Goal

Make the paid lawyer acquisition funnel measurable end to end without waiting for automated Grow recurring billing.

## Change

- The lawyer registration success redirect now preserves safe attribution fields: `utm_source`, `utm_medium`, `utm_campaign`, and `outreach_segment`.
- The success analytics event `lawyer_signup_submit` now includes `plan_interest`, `payment_path`, UTM fields, outreach segment, and a `registration_result`.
- The analytics script version was bumped to `1.1.2` so the live site can pick up the event change after deployment.

## Safety

- No public CMS content was published.
- No database migration was added.
- No redirect, canonical, noindex, sitemap, or taxonomy behavior was changed.
- Full referrer and landing URLs are still stored server-side only; they are not echoed into the public success URL.

## Owner Value

After a lawyer submits the paid-plan form, analytics can show which plan and source produced the submitted registration. This closes the measurement gap between header/plan-page clicks and actual manual-invoice follow-up work.

## Verification

- `node --check assets/js/analytics-events.js`
- `php -l inc/lawyer-onboarding.php`
- `php -l inc/enqueue.php`
- Live deployment check should confirm the homepage or registration page loads `justice-analytics-events` version `1.1.2`.
