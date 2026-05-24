# Grow Payment Compliance Live Check - 2026-05-24

- Status: PASS
- Started: 2026-05-24T15:40:01.512Z
- Base URL: https://jus-tice.co.il
- Checks passed: 8/8
- Checks needing review: 0
- Scope: read-only public route checks for Grow/Meshulam approval readiness.
- Safety: no CMS record, payment, invoice, product, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Final URL |
|---|---:|---:|---|---|
| Checkout page exists and is reachable | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779637201512 |
| Checkout exposes Grow-required customer fields | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779637201512 |
| Checkout exposes terms checkbox and terms link | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779637201512 |
| Paid lawyer plan path links to checkout | PASS | 200 | - | https://jus-tice.co.il/lawyer-plans/?grow_compliance_check=1779637201512 |
| Terms page remains available | PASS | 200 | - | https://jus-tice.co.il/sample-terms-and-conditions-template/?grow_compliance_check=1779637201512 |
| Cancellation and supply policy remains available | PASS | 200 | - | https://jus-tice.co.il/cancellation/?grow_compliance_check=1779637201512 |
| Privacy policy remains available | PASS | 200 | - | https://jus-tice.co.il/privacy/?grow_compliance_check=1779637201512 |
| Business contact signals remain visible | PASS | 200 | - | https://jus-tice.co.il/sample-terms-and-conditions-template/?grow_compliance_check=1779637201512 |

## Owner Meaning

The live public site currently exposes the checkout page, required customer fields, terms checkbox, terms link, legal-policy pages and business contact signals that Grow flagged in the latest rejection.

## Rerun

```powershell
node tools/check-grow-payment-compliance.mjs
```
