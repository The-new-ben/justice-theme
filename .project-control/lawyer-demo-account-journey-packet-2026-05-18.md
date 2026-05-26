# Lawyer Demo Account Journey Packet - 2026-05-18

Status: REPO ONLY / IMPLEMENTATION PACKET / NO USER, LAWYER, LEAD OR PAYMENT RECORD CHANGED

## Purpose

Make the lawyer registration, private zone, account, leads, insights and value system visible enough for the owner to inspect.

The current system has important infrastructure, but too much of it is hidden behind login, wp-admin, pending lawyer profiles and unconfigured payments. The next safe milestone is an owner-verifiable demo journey: one test lawyer account linked to one test lawyer profile, with the dashboard showing exactly what works and what is still a placeholder.

## Research Basis

Current legal intake and portal guidance says the strongest systems connect the full path:
- inquiry/intake capture;
- fast follow-up and CRM workflow;
- portal/default dashboard access;
- engagement/payment step when approved;
- status, documents/value and reporting after activation.

Sources reviewed:
- Clio client intake best-practice guidance: `https://www.clio.com/blog/client-intake-law-firms/`
- Lawmatics 2026 client intake guide: `https://www.lawmatics.com/blog/client-intake-ultimate-guide-for-law-firms`
- US Tech Automations 2026 law firm intake/onboarding checklists: `https://ustechautomations.com/resources/blog/law-firm-client-intake-automation-how-to-2026`
- CounselStack 2026 law-firm client portal comparison: `https://www.counselstack.io/best/client-portal`

Applied conclusion for Jus-Tice:
- The owner needs a testable account journey before payment activation.
- The lawyer should see first value, not just a login page.
- Payment should remain blocked until plan prices, provider, tax invoices and paid-placement/lead-billing rules are approved.

## Demo Journey Goal

Create one owner-verifiable demo lawyer path:

1. Owner opens `/lawyer-plans/`.
2. Owner clicks a plan.
3. Owner lands on `/lawyer-registration/?plan_interest=...`.
4. A test lawyer profile exists in draft or private mode.
5. A test WordPress user is linked to that profile.
6. Owner logs in as or switches to the test lawyer user.
7. Owner opens `/lawyer-dashboard/`.
8. Dashboard shows:
   - linked profile;
   - selected plan;
   - profile completeness;
   - activation status;
   - profile views placeholder/current count;
   - assigned leads area;
   - content request area;
   - next action;
   - clear payment status: "not active yet" until approved.

## Must Be Visible To Owner

| Screen | What owner should be able to spot |
| --- | --- |
| `/lawyer-plans/` | clear plan choices and honest payment status |
| `/lawyer-registration/` | plan intent preserved and registration path clear |
| `/lawyer-dashboard/` logged out | clean private-zone entry state |
| `/lawyer-dashboard/` logged in as demo lawyer | profile status, leads/value/status panels |
| wp-admin lawyer profile | activation status, first-value note and owner follow-up fields |
| wp-admin Justice CRM | assigned leads/status/quality/SLA fields when a lead exists |

## Safe Implementation Requirements

- Do not create a public fake recommendation, fake rating, fake review or fake "top lawyer" claim.
- Do not expose real client PII in a demo lead.
- Do not charge money or enable live recurring billing during the demo.
- Do not change payment provider settings without owner approval.
- Label demo/test data clearly if any test user, profile or lead is created.
- Keep payment copy honest: configured later, not currently active.

## Recommended Build Order

1. Add a dashboard first-value panel to the lawyer dashboard template.
2. Add a clear payment/status block that says payment is not active until commercial approval.
3. Add an owner-only demo journey checklist artifact or admin note.
4. If owner approves database-safe demo setup, create a test lawyer user and link it to a test lawyer profile.
5. Verify with browser login flow and screenshot notes.
6. Only after the demo account is owner-verified, move to payment provider setup.

## Acceptance Checklist

- `/lawyer-plans/` still returns HTTP 200.
- `/lawyer-registration/?plan_interest=pro` still returns HTTP 200.
- `/lawyer-dashboard/` logged-out state is clean and understandable.
- Logged-in demo lawyer sees at least one linked profile card.
- Logged-in demo lawyer sees one clear "first value" panel.
- Logged-in demo lawyer sees leads/content/value sections even if empty.
- Payment status is honest and does not imply live billing.
- Owner can point to exactly where the private zone lives.

## Open Owner Decisions

- Which payment provider to use: Stripe, Tranzila, Meshulam, Grow, WooCommerce-compatible provider, or another Israel-compatible provider.
- Final plan prices and VAT/invoice flow.
- Whether to charge monthly subscription, per qualified lead, hybrid, or full-service retainer.
- Qualified-lead definition.
- Whether demo account can be created in live WordPress, staging, or local only.

## This Cycle Safety Statement

This packet is a repo-only planning artifact. It does not create a user account, lawyer profile, lead record, payment product, subscription, invoice, public page content, redirect, noindex/canonical rule, sitemap setting, GA4/GSC setting or uPress deployment.
