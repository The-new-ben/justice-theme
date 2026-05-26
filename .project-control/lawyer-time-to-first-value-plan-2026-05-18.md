# Lawyer Time To First Value Plan - 2026-05-18

Status: REPO ONLY / CUSTOMER-SUCCESS SPEC / NO LIVE BILLING OR CMS CHANGES

## Purpose

Turn lawyer onboarding into a measurable activation system.

The business goal is not only "a lawyer registered." The goal is:
- the lawyer understands what Jus-Tice will do for them;
- the lawyer completes the minimum profile and trust data needed to sell them well;
- Jus-Tice can route or attribute demand to them;
- the lawyer sees the first proof of value quickly;
- the owner can spot stalled lawyers before they churn or refuse to pay.

## Research Basis

Current SaaS onboarding guidance emphasizes time-to-first-value and activation events over generic onboarding completion. Current legal-intake guidance emphasizes that fast response and CRM workflow triggers are what convert generated demand into signed clients.

Sources reviewed:
- `https://www.arcade.software/post/customer-onboarding-best-practices`
- `https://productgrowth.in/insights/saas/saas-onboarding-benchmarks-2026/`
- `https://retentioncheck.com/learn/onboarding-reduces-churn`
- `https://growthlayer.app/blog/saas-customer-onboarding-best-practices`

## Activation Definitions

### Registration Complete

Definition:
- lawyer registration form submitted successfully;
- selected plan interest is preserved;
- owner can see plan/sales priority in onboarding admin.

Current status:
- Implemented in repo.
- Not live until uPress pulls the latest GitHub main.

This is not first value. It is only the entry point.

### Profile Ready

Definition:
- lawyer has name, practice areas, city/region, phone, email, bio/summary, services, and verification/trust fields ready for owner review;
- no fake recommendations, fake ratings, fake review schema, or undisclosed paid placement claims;
- owner can decide whether profile is publishable.

Target:
- within 24 hours of registration for high-intent paid-plan lawyers;
- within 72 hours for free/low-intent lawyers.

### First Measurable Value

Definition:
- one of the following happens and is visible to the owner/lawyer:
  - a qualified lead is assigned or routed;
  - profile views are recorded and shown;
  - phone/WhatsApp/form/contact event is verified in GA4/GTM;
  - a relevant content/internal-link opportunity is attached to the lawyer;
  - a monthly value report snapshot is generated with verified data.

Target:
- within 7 days for paid-plan lawyers;
- within 14 days for free/trial/community lawyers.

### Retention Value

Definition:
- the lawyer sees a recurring monthly proof package:
  - profile visibility;
  - qualified leads and response status;
  - content/reputation/search work completed;
  - next action to improve results;
  - upgrade reason only when there is real usage, visibility or lead value.

Target:
- first report by day 30;
- customer-success review before day 45 for any paid lawyer without first measurable value.

## Owner Dashboard / Admin Signals

Needed signals:
- registration date;
- plan interest;
- sales priority;
- profile completeness;
- profile publish/verification status;
- first lead assigned date;
- first contact event date;
- first profile view date;
- first report generated date;
- activation status: `registered`, `profile_ready`, `first_value`, `retention_review`, `at_risk`;
- owner note/customer-success note.

Current implemented pieces:
- selected plan intent is preserved through registration;
- onboarding admin shows plan and sales priority;
- owner-only activation fields are implemented on lawyer edit screens: `activation_status`, `first_value_at`, and `activation_owner_note`;
- new lawyer registrations start with `activation_status=registered`;
- dashboard shows profile views, assigned leads and content requests;
- CRM shows lead quality, follow-up and response SLA;
- monthly value report spec exists.

Blocked pieces:
- GA4/GTM event receipt;
- payment provider and subscription state;
- exact billing/qualified-lead rules;
- live admin/browser verification.

## At-Risk Rules

Mark a lawyer as at risk when:
- paid-plan interest exists but owner has not followed up within 24 hours;
- profile is incomplete after 72 hours;
- no first measurable value within 7 days for a paid-plan lawyer;
- leads exist but response SLA is overdue;
- dashboard has no verified value metrics by day 30;
- lawyer has not received a monthly value report before renewal.

## Next Safe Implementation Steps

1. After uPress pull, verify the lawyer registration and analytics changes live.
2. Verify the owner-only activation fields in wp-admin on one draft lawyer.
3. Add dashboard copy/structure that makes the first-value milestone visible to the lawyer.
4. Add a report/export skeleton for lawyers who reached first measurable value.
5. Only after payment/legal/tax approval, connect subscription state and renewal-risk reporting.

## Safety Rules

- Do not claim a lawyer is recommended, verified, rated, top, leading or preferred unless the claim is source-backed and legally approved.
- Do not expose user/client PII to a lawyer unless routing and permission rules allow it.
- Do not automate payment, invoices, refunds, lead billing or public paid-placement disclosure until owner/legal/tax decisions are complete.
- Do not treat registration completion as business success; first measurable value is the real activation target.
