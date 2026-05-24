# Lawyer Dashboard Empty-State Activation - 2026-05-24

## Goal

Prevent a logged-in lawyer account with no connected profile from becoming a dead end.

## Change

- The logged-in dashboard hero now links to a tracked manual-invoice profile request.
- The no-profile state now explains the activation sequence: profile request, license/commercial review, manual payment/account connection, then dashboard value.
- The no-profile state now offers two tracked CTAs: request profile/plan and compare plans.
- UTM attribution identifies this source as `lawyer_dashboard` with `utm_medium=personal_area` and `utm_campaign=lawyer_activation`.

## Safety

- Theme/template only.
- No user account, lawyer profile, public CMS record or database setting was changed.
- No redirect, canonical, noindex, sitemap, taxonomy, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

## Verification

- `php -l page-lawyer-dashboard.php`
- `php -l inc/enqueue.php`
- `git diff --check`
- After deployment, confirm the dashboard CSS file contains `lawyer-dashboard__empty-steps`.
