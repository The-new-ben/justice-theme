# Unserved Demand Intake Hardening - 2026-05-18

Status: DRAFT PR CODE / NOT LIVE / NO UPRESS PULL

Branch:
- `codex/traffic-lead-demand-capture-plan`

PR:
- `https://github.com/The-new-ben/justice-theme/pull/7`

## What Was Hardened

Updated:
- `inc/unserved-demand.php`

Changes:
- Removed the `post_type_exists( 'justice_lead' )` guard from meta registration so metadata registration is not skipped if the CPT is registered later in the load order.
- Split "Email / WhatsApp" into separate Email and WhatsApp inputs.
- Saved `visitor_whatsapp` as its own lead meta field.
- Added `Overdue follow-up` to the dashboard summary cards.
- Expanded CSV export with:
  - WhatsApp;
  - unserved reason;
  - owner next action;
  - revenue status.

## Research Applied

Current law-firm intake research this cycle emphasized:

- response time and follow-up discipline are conversion levers;
- lead source and practice area must be measurable;
- unmonitored channels leak revenue;
- conversion reporting should include source, stage, and next action.

Sources checked:
- Clio lead-management best practices: `https://www.clio.com/blog/lead-management-best-practices-law-firms/`
- Current 2026 intake/automation search results on source tracking, response-speed, routing and conversion reporting.

## Why This Matters

The first version logged unsupported calls. This hardening makes the data more usable:

- WhatsApp is not lost inside an email field.
- Overdue follow-ups are visible.
- Exported rows can be handed to a lawyer-sales/recruitment process without reopening each lead record.
- Meta registration is more robust across CPT load order.

## Verification

Completed:
- `php -l inc/unserved-demand.php`
- `php -l inc/lead-routing.php`
- `php -l functions.php`
- `git diff --check`

Still needed after deployment:
- Log one owner-only controlled call with separate email/WhatsApp values.
- Confirm the overdue card changes when a deadline passes.
- Confirm CSV export contains the extra columns.

## Safety Statement

This is draft PR admin code only. It did not create live leads, change public forms, change public content, contact lawyers, charge clients, update GSC/GA4, or pull uPress.
