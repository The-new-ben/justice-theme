# Homepage Router Revenue Queue

Date: 2026-05-27
Status: code prepared for live deployment
Deploy marker: 2026-05-27-homepage-router-revenue-queue-v1

## What changed

- Added an owner-only Justice CRM panel named `Homepage situation-card lead queue`.
- The queue shows homepage situation-card leads that still have no first follow-up attempt.
- Each row exposes lead identity, phone/email, legal area, city, urgency, message excerpt, source keyword, source page, contact actions, and a `Log first attempt` action.
- Registered `source_keyword` and `lead_source_surface` as lead metadata in the theme CRM layer.

## Revenue purpose

The homepage cards already create measurable public leads. This change makes those leads harder to miss in the CRM and turns each new homepage lead into a direct owner action: call or WhatsApp, confirm issue/city/urgency/consent, then route only to a paid or owner-approved lawyer path.

## Not done

- No public CMS content was created or changed.
- No payment gateway, Grow/Meshulam setting, product price, redirect, canonical, noindex, sitemap, or taxonomy was changed.
- No real customer, lawyer, supplier, or payment was contacted or charged.

## Blockers

- Grow/Meshulam KYC/payment readiness still blocks a fully verified online payment path.
- A real revenue result still requires a real inbound lead and an owner-approved lawyer/payment handoff.

## Readiness to profit

Estimated readiness: 52%.

Reason: public lead capture, source tagging, WhatsApp/phone contact actions, and CRM follow-up queue now exist. Payment proof and repeated paid conversion are not yet verified.
