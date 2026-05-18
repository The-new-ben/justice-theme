# Commercial Pipeline Clean Integration Branch - 2026-05-18

Status: CODEX INTEGRATION BRANCH / NO LIVE SITE CHANGE

Branch:
- `codex/commercial-pipeline-pr5-integration`

Purpose:
- Provide a clean, current-`main` integration path for the commercial pipeline from PR #5 without force-pushing another agent's `claude/*` branch.

## What Changed

This branch starts from current `main` and applies:
- `2ebe724` - `Commercial pipeline activation + Codex P0/P1 fixes`
- `49c25df` - `Codex runbook: live execution of the commercial pipeline`

Conflict resolved:
- `project-control/current-status.md`

Resolution:
- Kept the newer `main` status history.
- Added the commercial pipeline status entry above it.
- Removed no status entries.

Runbook cleanup:
- Changed one architecture-diagram separator from `=======` to `------` because `git diff --check` treats a seven-equals line as a possible unresolved merge marker even inside a Markdown code block.

## Current Research Applied

Current subscription launch guidance checked this cycle:
- WooCommerce Subscriptions Health Check announcement: `https://developer.woocommerce.com/2026/04/30/subscriptions-health-check/`
- WooCommerce Subscriptions Health Check documentation: `https://woocommerce.com/document/woocommerce-subscriptions-health-check/`
- Morning for WooCommerce plugin page: `https://wordpress.org/plugins/wc-gateway-greeninvoice/`

Applied conclusion:
- Before live payment launch, the runbook/test matrix should treat subscription health as an ongoing operational check, not a one-time checkout test.
- After WooCommerce Subscriptions is installed, Section 10 should include WooCommerce -> Status -> Subscriptions health review before and after the first renewal.
- The Morning plugin supports token replacement for existing subscriptions in its recent changelog, which matters for failed/expired card recovery.

## Verification

Completed:
- PHP lint clean on:
  - `functions.php`
  - `inc/lawyer-account-provisioning.php`
  - `inc/lawyer-onboarding.php`
  - `inc/lawyer-plans-admin.php`
  - `inc/lawyer-plans.php`
  - `inc/woocommerce-subscription-bridge.php`
  - `page-lawyer-dashboard.php`
  - `page-lawyer-plans.php`
- Conflict-marker search run against touched PHP/template/status files.

Still required before deployment:
- Open/refresh the GitHub PR for this branch and confirm GitHub mergeability.
- Rerun Section 3 with authenticated wp-admin and uPress sessions.
- Ask the owner for explicit approval before merging or starting Sections 4-10.

## Safety Statement

No live WordPress dashboard, uPress server, payment gateway, Morning account, WooCommerce product, lawyer profile, user, lead, order, subscription, invoice, CMS content, GA4/GSC setting, URL, redirect, canonical/noindex rule, sitemap setting, or database row was changed.
