# Lead Intake Smoke Live Check

Date: 2026-05-28
Status: live read-only smoke test passed.

## Goal

Verify the live homepage can start a public legal-help lead path and a lawyer monetization path without submitting a fake production lead or charging money.

Reusable script:

`C:\Users\janana\jutice-theme\.project-control\scripts\check-lead-intake-smoke.ps1`

## Command

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-lead-intake-smoke.ps1
```

## Result

Pass: `true`

Checked URL:

`https://jus-tice.co.il/?cachebust=lead-intake-smoke-1779928676`

Checked at:

`2026-05-27T21:37:58.6613796Z`

## Passed Checks

| Check | Result | Meaning |
|---|---:|---|
| Homepage status | PASS | Homepage returned HTTP 200 |
| Ask-lawyer section | PASS | Public lead section exists |
| Form target | PASS | Form posts to `admin-post.php` |
| Lead action | PASS | Form action is `justice_submit_lead` |
| Nonce | PASS | Security nonce field exists |
| Source attribution | PASS | `lead_source_surface` exists |
| Required fields | PASS | Name, phone, legal area, and message exist |
| Optional qualifier fields | PASS | Email, city, and urgency exist |
| Consent | PASS | Consent field is required |
| Anti-spam | PASS | Anti-spam fields exist |
| Ask-lawyer WhatsApp | PASS | `data-whatsapp-surface="ask_lawyer_form"` exists |
| Hero WhatsApp | PASS | `data-whatsapp-surface="homepage_hero"` exists |
| Footer trust WhatsApp | PASS | `data-whatsapp-surface="footer_trust_path"` exists |
| Lawyer registration | PASS | `/lawyer-registration/` link exists |
| Lawyer plans | PASS | `/lawyer-plans/` link exists |

## Revenue Relevance

This confirms that the current live homepage has:

- a public lead form entry point,
- legal area/city/urgency qualification fields,
- consent and anti-spam protections,
- source-aware WhatsApp CTA surfaces,
- lawyer signup and plan routes.

This gives the homepage rebuild a minimum gate: any future redesign must pass this checker before being reported as revenue-safe.

## What This Does Not Prove

- It does not submit the form.
- It does not create a real CRM lead.
- It does not verify owner/admin notification.
- It does not release a lead to a lawyer.
- It does not create a WooCommerce order, Meshulam/Grow charge, invoice, refund, or subscription.
- It does not verify the pushed mobile-menu stability fix is live.

## Current Blockers

- Mobile-menu stability fix is still pushed but not live; live marker remains `2026-05-27-footer-trust-path-v1`.
- uPress Pull Git is still required for `wp-content/themes/justice-theme`.
- Grow/Meshulam KYC/payment readiness remains blocked.
- Chrome extension control remains unavailable from Codex, so authenticated browser actions are not executable here yet.

## Honesty Statement

This is a real live read-only smoke test. It proves the visible funnel surface exists, but it does not prove a paid customer, real lead, CRM routing, payment, invoice, or supplier/lawyer handoff.
