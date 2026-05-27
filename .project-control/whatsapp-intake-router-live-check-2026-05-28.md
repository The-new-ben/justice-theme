# WhatsApp Intake Router Live Check

Date: 2026-05-28
Status: live read-only WhatsApp intake-router gate passed and was added to the consolidated revenue-readiness gate.

## Goal

Verify that WhatsApp is a measurable lead channel, not only a visible button. The check confirms source-aware surfaces, prefilled messages, campaign attribution, expected owner phone number, and safe external-link behavior.

Reusable script:

`C:\Users\janana\jutice-theme\.project-control\scripts\check-whatsapp-intake-router.ps1`

## Command

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-whatsapp-intake-router.ps1
```

## Result

Pass: `true`

Checked at:

`2026-05-27T22:09:46.2138917Z`

Base URL:

`https://jus-tice.co.il`

Expected WhatsApp number:

`972525101555`

## Passed Pages

| Page | Status | WhatsApp links | Required surfaces |
|---|---:|---:|---|
| Homepage | 200 | 9 | `mobile_menu`, `site_header`, `homepage_hero`, `homepage_customer_handoff`, `ask_lawyer_form`, `homepage_lawyer_fast_fit`, `site_footer`, `footer_trust_path`, `floating_whatsapp` |
| Contact | 200 | 5 | `mobile_menu`, `site_header`, `site_footer`, `footer_trust_path`, `floating_whatsapp` |
| Lawyers directory | 200 | 5 | `mobile_menu`, `site_header`, `site_footer`, `footer_trust_path`, `floating_whatsapp` |
| Lawyer plans | 200 | 5 | `mobile_menu`, `site_header`, `site_footer`, `footer_trust_path`, `floating_whatsapp` |
| Lawyer registration | 200 | 5 | `mobile_menu`, `site_header`, `site_footer`, `footer_trust_path`, `floating_whatsapp` |

## Passed Link Requirements

Every checked WhatsApp link passed:

- points to `wa.me/972525101555`,
- includes a prefilled `text=` message,
- includes `data-whatsapp-surface`,
- includes `data-lead-utm-source`,
- includes `data-lead-utm-medium`,
- includes `data-lead-utm-campaign`,
- opens with `target="_blank"`,
- includes `rel="noopener"`.

The homepage lawyer-acquisition WhatsApp path also passed:

- surface: `homepage_lawyer_fast_fit`,
- medium: `lawyer_whatsapp`,
- campaign: `lawyer_acquisition`.

## Revenue Meaning

This makes the live WhatsApp funnel auditable:

- public visitors can start a legal-help conversation from the homepage, contact page, directory, plan page, and registration page,
- high-intent homepage sections are distinguishable by source surface,
- lawyer acquisition WhatsApp is separated from public legal-help WhatsApp,
- future homepage/header/footer changes now fail the gate if they remove attribution or prefilled-message behavior.

## Consolidated Gate Update

The consolidated gate now includes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-revenue-readiness-gate.ps1
```

Latest expanded gate result:

- Pass: `true`
- Readiness: `partial_live_funnel_deploy_blocked`
- New WhatsApp gate: PASS
- Mobile-menu deployment marker: FAIL, because the expected marker `2026-05-27-mobile-menu-stable-toggle-v1` and theme version `1.1.67` are still not live.

## What This Does Not Prove

- It does not click WhatsApp.
- It does not send a WhatsApp message.
- It does not create a lead.
- It does not create or update CRM records.
- It does not contact users, lawyers, or suppliers.
- It does not create invoices or payments.
- It does not prove human follow-up happened.

## Current Blockers

- uPress Pull Git is still required to make the mobile-menu stability fix live.
- Authenticated Chrome/uPress control is still unavailable from Codex in this environment.
- Grow/Meshulam KYC/payment and real invoice proof remain blocked.
- No real paid lawyer/customer/lead handoff has been verified.

## Honesty Statement

This is real live route and markup proof for WhatsApp intake attribution. It is not proof of a real conversation, CRM record, paid customer, lawyer handoff, invoice, or payment.
