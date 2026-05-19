# Unserved Demand Source Attribution Hardening - 2026-05-18

Status: DRAFT PR CODE / NOT LIVE / NO UPRESS PULL

Branch:
- `codex/traffic-lead-demand-capture-plan`

PR:
- `https://github.com/The-new-ben/justice-theme/pull/7`

## Why This Matters

The owner needs to know not only that a Thailand-lawyer-style request happened, but how it arrived. If the demand came from organic search, a phone call, WhatsApp, a form, or manual referral, the next action is different:

- SEO page rescue;
- lawyer recruitment;
- follow-up workflow;
- call tracking;
- or content/category creation.

## Research Applied

Sources checked this cycle:

- Clio lead-management best practices: `https://www.clio.com/blog/lead-management-best-practices-law-firms/`
- Current law-firm intake/attribution research showing that response time, lead source, practice area, and conversion stage must be tracked together before marketing spend can be optimized.

Applied conclusion:

- Unserved demand must preserve source/channel and next action. Otherwise the business cannot know whether SEO, phone calls, WhatsApp, or directory traffic is producing partner-seat opportunities.

## What Was Hardened

Updated:
- `inc/unserved-demand.php`

Changes:
- Quick-log form now has a `Source channel` select:
  - phone;
  - WhatsApp;
  - website form;
  - email;
  - organic search;
  - manual / other.
- Quick-log form now has separate fields for:
  - city;
  - language.
- Handler validates the selected source channel against an allowlist.
- Lead meta now saves:
  - `requested_city`;
  - `requested_language`;
  - selected `lead_source_channel`.
- Dashboard and CSV export can now distinguish sources more accurately.

## Verification

Completed:
- `php -l inc/unserved-demand.php`
- `php -l inc/lead-routing.php`
- `php -l functions.php`
- `git diff --check`

Still needed after deployment:
- Log one controlled owner-only call with source channel `phone`.
- Log one controlled owner-only WhatsApp-style row.
- Confirm the Partner Recruitment Proof source column shows correct counts.
- Confirm CSV export includes source, city and language.

## Safety Statement

This is draft PR admin code only. It does not change public pages, create live leads, change live WordPress data, contact lawyers, charge clients, update GSC/GA4, or pull uPress.
