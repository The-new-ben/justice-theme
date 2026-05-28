# Synthetic Lead-To-Revenue Drill

Date: 2026-05-28.
Scope: dry-run proof packet for the owner-requested "user needs lawyer -> CRM -> lawyer/supplier -> billing" flow.

## Project Manager Check

- Active goals: prove the lead funnel path without unsafe live data creation, keep lawyer handoff measurable, and keep payment proof separate from invoice/payment intent.
- Sub-goals: public lead capture, WhatsApp source attribution, CRM follow-up status, permission/handoff release, lawyer dashboard contact/stage update, manual invoice path, and paid-proof guard.
- Completed this cycle: added a read-only synthetic lead-to-revenue drill script and this proof packet.
- Incomplete / internal-only / not published: no real lead, CRM post, WhatsApp message, email, invoice, WooCommerce order, payment, lawyer profile update, CMS change, or public deployment occurred.
- Blockers: Grow/Meshulam KYC/payment proof, real invoice/payment evidence, and a controlled paying lawyer remain unresolved.
- Estimated readiness to profit: route/UX controls ~96%; payment/manual-invoice proof ~86-88%; proven revenue 0%.
- Honesty statement: this is a dry-run readiness proof. It does not prove live CRM creation, lawyer response, invoice issuance, payment settlement, or profit.

## Synthetic Entity

- Name: Synthetic legal-help visitor - dry run only.
- Phone: 050-000-0000.
- Email: synthetic-lead@example.invalid.
- Legal area: Bituach Leumi.
- City: Tel Aviv.
- Urgency: high.
- Source surface: homepage ask-lawyer / WhatsApp.
- Intended revenue path: qualified lead -> paid lawyer handoff -> manual invoice -> private payment evidence.

This entity was not submitted to the live site.

## Operator Flow Being Proven

1. Public user submits the homepage lead form or opens source-aware WhatsApp.
2. Private `justice_lead` CRM record is created with source, consent, follow-up, coverage, and billing-not-ready defaults.
3. Owner logs first attempt and qualifies area, city, urgency, permission, and coverage.
4. Owner releases to lawyer/supplier only after client permission and commercial terms are clear.
5. Assigned lawyer sees contact actions and updates lead stage in the dashboard.
6. Qualified/billable lead or paid lawyer plan moves to manual invoice path while Grow/Meshulam is blocked.
7. Paid status is allowed only after private payment evidence URL and timestamp exist.

## New Gate

Script:

```text
.project-control/scripts/check-synthetic-lead-to-revenue-drill.ps1
```

It checks:

- live homepage status and public lead form fields,
- source-aware WhatsApp surfaces,
- lawyer registration/plans/status revenue paths,
- public lead handler creates private CRM leads with consent/source/follow-up/billing-not-ready defaults,
- CRM manual WhatsApp bridge, homepage lead queue, and first-attempt action,
- CRM permission/handoff and billing proof guard,
- routing defaults and ready-to-bill gate,
- lawyer dashboard contact actions, SLA, stage update, and payment context,
- lawyer service/payment request handlers,
- lawyer registration manual invoice path and attribution,
- lawyer onboarding payment evidence guard,
- checkout/manual-invoice compliance fields,
- first paid lawyer manual invoice acceptance packet.

## Verification Run

Result on 2026-05-28T05:25:22Z:

- `.project-control/scripts/check-synthetic-lead-to-revenue-drill.ps1`: pass true, 0 failures.
- Live homepage: HTTP 200.
- Live public form: present with action, source, name, phone, legal area, message, and consent fields.
- Live WhatsApp surfaces: homepage hero, ask-lawyer form, and mobile menu present.
- Live lawyer revenue paths: lawyer registration, lawyer plans, and customer-status path present.
- Lead handler: private `justice_lead` creation path present with source, consent, follow-up, coverage, and billing-not-ready defaults.
- CRM operator controls: manual WhatsApp bridge, homepage lead queue, first-attempt logging, permission/handoff release, billing queue, and paid-proof guard present.
- Lawyer dashboard controls: contact actions, response SLA, stage update, follow-up note, and payment context present.
- Payment/invoice controls: manual invoice path, payment evidence guard, checkout compliance fields, and first-paid packet present.

Supporting checks:

- `.project-control/scripts/check-lead-intake-smoke.ps1`: pass true.
- `.project-control/scripts/check-lead-crm-operator-readiness.ps1`: pass true.
- `.project-control/scripts/check-first-paid-lawyer-manual-invoice-packet.ps1`: pass true.

## Safety Rules

- Do not mark `paid` without private payment evidence URL.
- Do not route a client to a lawyer/supplier without permission and owner release.
- Do not claim revenue from invoice/reference alone.
- Do not use fake generated profiles or fake reviews as supplier proof.
- Do not create live records from synthetic data unless the owner explicitly asks for a controlled test and the target system is safe/test-mode.

## What Was Not Changed

- No public CMS/database record was created or updated.
- No redirect, canonical, noindex, sitemap, taxonomy, gateway, checkout, product, or uPress setting was changed.
- No WhatsApp/email outreach was sent.
- No invoice/payment/order/subscription/refund was created.

## Next Real Test Requirement

Before a real 5 NIS/self-payment or lawyer-paid test, the owner should identify the exact safe target:

- test mode WooCommerce/Grow path, or
- one controlled real lawyer/manual invoice path.

The acceptance condition is: private payment evidence URL, invoice/reference, timestamp, and CRM/lawyer status update all exist. Until then, readiness is operational only, not revenue proof.
