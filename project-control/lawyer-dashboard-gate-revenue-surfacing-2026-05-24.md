# Lawyer Dashboard Gate Revenue Surfacing - 2026-05-24

## Goal

Turn the logged-out lawyer personal area from a simple login wall into a useful revenue doorway.

## Change

- Existing lawyers still get a direct login button back to `/lawyer-dashboard/`.
- New lawyers now see a clear plan-selection path with UTM attribution.
- A fast manual-invoice registration path is available from the same gate.
- The gate explains the value of the private area: leads, mini-site/profile updates, signed content requests, Google review campaign requests, and supplier connections.

## Safety

- Theme/template only.
- No public CMS record was created or edited.
- No database migration, redirect, canonical, noindex, sitemap, taxonomy, lead, CRM, payment or wp-admin setting changed.

## Verification

- `php -l page-lawyer-dashboard.php`
- `php -l inc/enqueue.php`
- `git diff --check`
- After deployment, check `/lawyer-dashboard/` as a logged-out visitor and confirm the plan/registration links contain `utm_source=lawyer_dashboard_gate`.
