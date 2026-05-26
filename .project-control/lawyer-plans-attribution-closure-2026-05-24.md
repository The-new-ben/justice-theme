# Lawyer Plans Attribution Closure - 2026-05-24

## Goal

Make plan-page clicks measurable as their own lawyer acquisition source.

## Change

- Every lawyer-plan CTA that sends a lawyer to registration or checkout now carries plan-page UTM attribution.
- The attribution identifies source (`lawyer_plans`), medium (`plan_page`), campaign (`lawyer_acquisition`), surface/content (`founder_primary`, `system_primary`, `pricing_card`, `pricing_manual_link`) and `outreach_segment=plans_page`.
- This lets Analytics separate header CTA clicks, dashboard-gate clicks, and high-intent plan-page clicks before the first paid customer test.

## Safety

- Template-only URL attribution.
- No public CMS record was created or edited.
- No database migration, redirect, canonical, noindex, sitemap, taxonomy, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

## Verification

- `php -l page-lawyer-plans.php`
- `git diff --check`
- After deployment, check `/lawyer-plans/` and confirm outgoing registration links include `utm_source=lawyer_plans`.
