# Unserved Demand Recruitment Proof Panel - 2026-05-18

Status: DRAFT PR CODE / NOT LIVE / NO UPRESS PULL

Branch:
- `codex/traffic-lead-demand-capture-plan`

PR:
- `https://github.com/The-new-ben/justice-theme/pull/7`

## What Was Added

The admin-only Unserved Demand page now includes a "Partner Recruitment Proof" table.

It groups unserved leads by:

- requested demand;
- country/jurisdiction;
- request count;
- high-urgency count;
- source channel;
- latest request date.

It also generates a sales line such as:

> Jus-Tice already received 3 request(s) for Thailand lawyer / Thailand and has no active partner yet.

## Why This Matters

The previous code let the owner log unsupported calls. This change turns those records into a lawyer-sales asset. Instead of telling a lawyer "we might get leads", the owner can say "we already got these requests and this category is open."

## Research Applied

Current intake research this cycle reinforced:

- lead source and practice area must be tracked;
- response speed and follow-up are measurable conversion levers;
- conversion reporting should be segmented by source and practice area;
- unserved demand should be visible as a pipeline gap, not hidden inside notes.

Sources:

- Clio lead-management best practices: `https://www.clio.com/blog/lead-management-best-practices-law-firms/`
- Lawmatics intake pipeline: `https://help.lawmatics.com/en/articles/10699827-intake-pipeline/`
- Current 2026 intake/automation guidance from search results on law-firm lead source, practice-area routing, response speed and conversion tracking.

## Verification

Completed:

- `php -l inc/unserved-demand.php`
- `php -l inc/lead-routing.php`
- `php -l functions.php`
- `git diff --check`

Still needed after deployment:

- Open wp-admin -> Justice CRM -> Unserved Demand.
- Log one owner-only test demand.
- Confirm the recruitment proof row appears.
- Export CSV and compare with the displayed summary.

## Safety Statement

This is draft PR admin code only. It does not change public CMS content, create live leads, create lawyer profiles, charge users, contact lawyers, change SEO settings, or pull uPress.
