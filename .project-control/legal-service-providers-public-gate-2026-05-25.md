# Legal Service Providers Public Gate - 2026-05-25

## What changed
- Added a controlled public visibility gate to the existing `justice_supplier` CMS post type.
- Added public supplier fields for display status and badge text.
- Added supplier admin list visibility column, filter, and bulk actions.
- Added a homepage/template section that renders approved legal-service providers from CMS only when all public-readiness checks pass.
- Inserted the section after featured lawyers and before the legaltech section on both homepage templates.

## Public gate
A supplier appears publicly only when all conditions are true:
- Post type is `justice_supplier` and status is published.
- `supplier_public_visibility` is `show`.
- `supplier_partnership_status` is `approved`.
- `supplier_offer_summary` is filled.
- A website or source URL is present.

## Revenue purpose
This creates a non-hard-coded inventory path for:
- legal-service providers,
- sponsored category partners,
- referral/lead-fee partners,
- monthly listing partners,
- future lawyer-dashboard supplier requests.

## Research basis
Checked public directory/profile patterns from Din, Psakdin, LawReviews, Avvo, and Justia. The repeated useful elements are category fit, profile depth, trust/review signals, location/practice matching, and controlled calls to contact or claim/update a profile. This implementation uses those ideas as structure only and does not copy competitor text, lawyers, photos, reviews, ratings, or contact data.

## Verification
- `php -l inc/lawyer-suppliers.php`
- `php -l template-parts/sections/legal-service-providers.php`
- `php -l front-page.php`
- `php -l page-home.php`
- `php -l inc/enqueue.php`

## Honest limitations
- No supplier/customer records were created in CMS during this repo-only cycle.
- No competitor provider list was imported.
- No public production change is visible until the server pulls this commit.
- Revenue remains NIS 0 until real providers/lawyers are contacted, approved, invoiced, and paid.

## Safety
No live CMS database edit, competitor profile import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting was changed.
