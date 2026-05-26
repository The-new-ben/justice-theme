# Lawyer Paid Plan Manual Invoice Fallback - 2026-05-24

## Goal

Close a first-money leak in the lawyer registration path while Grow/Meshulam recurring billing is still not fully approved.

Before this pass, a lawyer could land directly on `/lawyer-registration/`, choose a paid plan, submit the form, and create a paid-plan interest record without the record being clearly marked as a manual invoice/payment follow-up.

## Change

- Paid plan registration now falls back to `manual_invoice` when automatic checkout for that plan is not ready.
- The registration page now treats paid plan URLs as manual activation paths when checkout is unavailable, even if the URL does not explicitly include `payment_path=manual_invoice`.
- The browser-side wizard keeps the hidden `payment_path` field synced when a lawyer changes the selected plan.
- The lawyer registration script version was bumped to force the updated wizard behavior to load.

## Why It Matters

This turns paid-plan intent into an actionable owner task:

1. Review lawyer fit and license.
2. Send Morning/Grow/manual payment instructions.
3. Activate only after payment is confirmed.

That is the fastest workable revenue path until automated subscription checkout is fully approved.

## Verification

- `php -l page-lawyer-registration.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `php -l inc/enqueue.php` passed.
- `node --check assets/js/lawyer-registration-wizard.js` passed.

## Safety

Theme code and project-control documentation only.

No public CMS/database record, live lawyer record, payment setting, WooCommerce product, Grow/Meshulam account setting, redirect, canonical, noindex, sitemap, taxonomy, lead, or outreach action was changed.
