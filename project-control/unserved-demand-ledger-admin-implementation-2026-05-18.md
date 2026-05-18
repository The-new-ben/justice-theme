# Unserved Demand Ledger Admin Implementation - 2026-05-18

Status: DRAFT PR CODE / NOT LIVE / NO UPRESS PULL

Branch:
- `codex/traffic-lead-demand-capture-plan`

PR:
- `https://github.com/The-new-ben/justice-theme/pull/7`

## What Was Implemented

Added:
- `inc/unserved-demand.php`

Updated:
- `functions.php`
- `inc/lead-routing.php`

## Owner-Facing Result After Deployment

In wp-admin:

- Justice CRM -> Unserved Demand

The owner can:

1. Quick-log a phone call where no matching lawyer partner exists.
2. Save the caller as a private `justice_lead`.
3. Mark the lead as `service_status=unserved`.
4. Record requested area, country/jurisdiction, urgency, source URL, consent, follow-up deadline, owner next action, and revenue status.
5. Export unserved demand as CSV for lawyer recruitment.

## Automatic Behavior

When normal lead routing finds no lawyer with routing enabled:

- the lead remains in the existing Justice CRM;
- `service_status` becomes `unserved`;
- `lead_status` becomes `unserved`;
- `unserved_reason` becomes `no_partner`;
- `revenue_status` becomes `partner_recruitment_open`;
- a follow-up deadline is set;
- routing notes explain that no matching paid/routing lawyer exists.

This turns "we missed this category" into a measurable sales signal.

## Why This Is The Right Shape

Current best-practice research from Clio and Lawmatics reinforces that intake must capture source, practice area, pipeline stage, follow-up timing, and conversion status. Jus-Tice already has a `justice_lead` CPT, CRM admin page, classifier, and routing logic, so the safest implementation extends that existing flow instead of creating a separate disconnected database.

## Verification

Completed:

- `php -l inc/unserved-demand.php`
- `php -l inc/lead-routing.php`
- `php -l functions.php`
- `git diff --check`

Still needed after deployment:

- Open wp-admin -> Justice CRM -> Unserved Demand.
- Submit one controlled owner-only test phone lead.
- Confirm private `justice_lead` is created.
- Confirm CSV export works.
- Confirm a no-partner routed public lead is marked unserved only after an approved controlled test.

## Safety Statement

This is admin-only draft PR code. It does not expose a public form, publish public content, create live data, charge clients, contact lawyers, modify GSC/GA4, change URLs, change redirects, change canonical/noindex rules, change sitemap settings, or pull uPress.
