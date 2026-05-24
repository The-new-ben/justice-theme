# Lawyer Source Performance Board - 2026-05-24

## Purpose

Turn paid-lawyer signup attribution into an owner operating view. The board answers: which outreach segment, message, city, practice area or campaign is creating registrations and expected monthly value?

## Research Basis

- Clio Grow intake reporting promotes filtering intake data by lead sources, matter types and other dimensions.
- Clio Grow revenue reporting includes anticipated legal fees and lead/referral source fields, so the owner can connect intake sources to future revenue.
- Jus-Tice already captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `outreach_segment`, `outreach_city` and `outreach_practice`, so the next useful step was making those fields operational inside Lawyer Onboarding.

Sources:
- https://www.clio.com/features/client-intake-insights/
- https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports

## What Changed

- Added a new owner-only `Source performance board` inside Lawyer Onboarding.
- The board groups recent lawyer registrations/manual-invoice records by the best available source bucket:
  - outreach segment
  - message variant
  - city
  - practice area
  - campaign
  - source
- Each row shows registration count, expected monthly value, payment queue counts, city/practice/message context, latest submission time and an `Open source` filter.
- Lawyer Onboarding now accepts safe `source_key` and `source_value` filters, restricted to known attribution meta keys.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.
- Code was committed as `53f7dac Add lawyer source performance board`.
- uPress Git pull completed successfully and the uPress log showed `53f7dac` as live `HEAD`.
- Public lawyer revenue funnel check passed `9/9` after deployment.

## Owner Value

This makes outreach measurable without API spend. If a specific message, city or practice segment starts producing paid registrations, the owner can immediately open that source, follow up from the payment queue and repeat the winning batch.

## Remaining Blocker

Automatic recurring lawyer payments remain blocked until Grow/Meshulam approval plus gateway/product mapping are complete. Manual invoice activation remains the active money path.

## Safety

Admin-only read/report UI and safe filters only. No CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting was changed.
