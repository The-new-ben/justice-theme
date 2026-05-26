# Lawyer Registration Dynamic Billing Fields - 2026-05-25

## What Changed

- The lawyer registration form now always includes the manual invoice billing fieldset in the page markup.
- Free/basic registration keeps those billing fields hidden.
- When a lawyer selects a paid plan inside the registration wizard, the form immediately switches `payment_path` to `manual_invoice`, reveals the billing fields, and makes the minimum billing fields required.
- If the lawyer switches back to the free plan, the billing fields hide again and stop blocking the form.
- The lawyer registration wizard script version was bumped from `1.2.1` to `1.2.2` so the live site requests the updated behavior instead of a stale cached script.

## Why It Matters

Before this change, paid billing fields were reliable only when the prospect arrived through a paid-plan URL such as `/lawyer-registration/?plan_interest=featured`. A lawyer who arrived at the generic registration page and changed the plan selector to a paid plan could miss the invoice context. That created a revenue handoff gap.

This cycle closes that gap for the investor/customer journey:

1. Lawyer opens registration from a generic link.
2. Lawyer chooses a paid plan in the wizard.
3. Billing fields appear in the same step.
4. Submission is tagged as manual-invoice payment intent.
5. Owner/onboarding team has enough billing context to send a Grow/Morning payment request manually until the automated gateway path is complete.

## Verification

- PASS: Local PHP lint for `page-lawyer-registration.php` and `inc/enqueue.php`.
- PASS: Local JS syntax check for `assets/js/lawyer-registration-wizard.js`.
- PASS: JSON parse for `reports/lawyer-registration-dynamic-billing-fields-2026-05-25.json`.
- PASS: `git diff --check`.
- PASS: uPress Git log showed live HEAD `59a9c8b`.
- PASS: Live free/default registration contains the billing fieldset marker but keeps it hidden and does not set `payment_path=manual_invoice`.
- PASS: Live paid preselected registration with `plan_interest=featured` exposes the billing fieldset, requires billing legal name and invoice email, and sets `payment_path=manual_invoice`.
- PASS: Browser interaction from the generic registration page changed the plan to `featured`; the wizard set `payment_path=manual_invoice`, revealed billing fields, and made billing legal name plus invoice email required.

## Honest Revenue Status

Realized revenue is still NIS 0 in this cycle. This is a funnel-readiness improvement, not proof of payment. The next money step remains a controlled real Grow/Morning/Woo payment link or manual invoice test with the owner.

## Safety

No CMS records, competitor records, public content, redirects, canonicals/noindex, sitemaps, taxonomies, payment gateway settings, charges, invoices, refunds, GSC or GA4 settings were changed.
