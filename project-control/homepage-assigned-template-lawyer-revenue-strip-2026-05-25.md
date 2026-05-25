# Assigned Homepage Template Lawyer Revenue Strip - 2026-05-25

## Why This Was Needed

The investor-facing homepage already had a lawyer revenue strip through `front-page.php`, but the explicit `Home` page template did not load the same section. If WordPress preview/template assignment or a fallback path uses `page-home.php`, the paid lawyer account-opening path can disappear from the first-page experience.

## What Changed

- `page-home.php` now loads `template-parts/sections/homepage-lawyer-revenue-strip.php` immediately after the customer intake strip.
- This keeps the customer-first path intact while making the lawyer signup, plan comparison and personal-area links visible on both homepage template paths.

## Owner-Visible Result

After deploy, the homepage template path should show the lawyer revenue strip between:

- the customer intake strip; and
- the money-intent legal topic pyramid.

The section links to:

- `/lawyer-registration/`
- `/lawyer-plans/`
- `/lawyer-dashboard/`

## What This Does Not Do

- It does not create or modify any CMS lawyer records.
- It does not import competitor lawyers or legal-service suppliers.
- It does not copy competitor photos, reviews, ratings, text, badges or contact details.
- It does not create payment proof, invoices, refunds, subscriptions or recurring billing.
- It does not change redirects, canonicals, noindex, sitemaps, taxonomies, GSC, GA4 or provider settings.

## Verification

- `php -l page-home.php` passed.
- `git diff --check` passed.

## Completion Impact

Homepage lawyer revenue surfacing moves from about 78% to 82% because both homepage template paths now expose the paid lawyer journey. Real revenue completion remains blocked until a controlled Grow/Morning/Woo payment or manual invoice flow is proven end to end.
