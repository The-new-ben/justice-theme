# Grow Payment Compliance Live Check - 2026-05-25

- Status: PASS
- Started: 2026-05-25T15:41:42.053Z
- Base URL: https://jus-tice.co.il
- Checks passed: 8/8
- Checks needing review: 0
- Scope: read-only public route checks for Grow/Meshulam approval readiness.
- Safety: no CMS record, payment, invoice, product, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Final URL |
|---|---:|---:|---|---|
| Checkout page exists and is reachable | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779723702053 |
| Checkout exposes Grow-required customer fields | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779723702053 |
| Checkout exposes terms checkbox and terms link | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779723702053 |
| Paid lawyer plan path links to checkout | PASS | 200 | - | https://jus-tice.co.il/lawyer-plans/?grow_compliance_check=1779723702053 |
| Terms page remains available | PASS | 200 | - | https://jus-tice.co.il/sample-terms-and-conditions-template/?grow_compliance_check=1779723702053 |
| Cancellation and supply policy remains available | PASS | 200 | - | https://jus-tice.co.il/cancellation/?grow_compliance_check=1779723702053 |
| Privacy policy remains available | PASS | 200 | - | https://jus-tice.co.il/privacy/?grow_compliance_check=1779723702053 |
| Business contact signals remain visible | PASS | 200 | - | https://jus-tice.co.il/sample-terms-and-conditions-template/?grow_compliance_check=1779723702053 |

## Owner Meaning

The live public site currently exposes the checkout page, required customer fields, terms checkbox, terms link, legal-policy pages and business contact signals that Grow flagged in the latest rejection.

## Rerun

```powershell
node tools/check-grow-payment-compliance.mjs
```
