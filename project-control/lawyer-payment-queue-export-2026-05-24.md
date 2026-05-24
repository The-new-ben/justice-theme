# Lawyer Payment Queue Export - 2026-05-24

## What changed

Added an owner-only CSV export to the Lawyer Onboarding payment command center.

The export buttons cover:

- Invoice requested queue.
- Invoice sent queue.
- All manual-invoice lawyer registrations.

## Why it matters

The fastest current revenue path is manual activation while Grow recurring billing is still not fully approved. This lets the owner take the queue into a spreadsheet, phone list, WhatsApp workflow, Morning/Grow payment-link workflow, or manual sales follow-up without opening each lawyer profile one by one.

## Export columns

The CSV includes lawyer/contact fields, plan, payment path, follow-up status, activation status, practice areas, cities, attribution, invoice/payment timestamps, admin edit URL, next action, and the copy-ready invoice handoff message.

## Safety

- Owner/admin only: requires `edit_pages` capability and a WordPress nonce.
- Read-only export: no lawyer profile, CMS content, lead, payment, invoice, redirect, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting is changed.
- CSV injection guard: exported cells that begin with spreadsheet formula characters are prefixed safely.

## Verification

- `php -l inc/lawyer-onboarding.php`
- `git diff --check`
