# Grow Payment Compliance Live Check - 2026-05-27

- Status: PASS
- Started: 2026-05-27T04:12:42.479Z
- Base URL: https://jus-tice.co.il
- Checks passed: 8/8
- Checks needing review: 0
- Scope: read-only public route checks for Grow/Meshulam approval readiness.
- Safety: no CMS record, payment, invoice, product, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Final URL |
|---|---:|---:|---|---|
| Checkout page exists and is reachable | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779855162484 |
| Checkout exposes Grow-required customer fields | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779855162484 |
| Checkout exposes terms checkbox and terms link | PASS | 200 | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&grow_compliance_check=1779855162484 |
| Paid lawyer plan path links to checkout | PASS | 200 | - | https://jus-tice.co.il/lawyer-plans/?grow_compliance_check=1779855162484 |
| Terms page remains available | PASS | 200 | - | https://jus-tice.co.il/sample-terms-and-conditions-template/?grow_compliance_check=1779855162484 |
| Cancellation and supply policy remains available | PASS | 200 | - | https://jus-tice.co.il/cancellation/?grow_compliance_check=1779855162484 |
| Privacy policy remains available | PASS | 200 | - | https://jus-tice.co.il/privacy/?grow_compliance_check=1779855162484 |
| Business contact signals remain visible | PASS | 200 | - | https://jus-tice.co.il/sample-terms-and-conditions-template/?grow_compliance_check=1779855162484 |

## Owner Meaning

The live public site currently exposes the checkout page, required customer fields, terms checkbox, terms link, legal-policy pages and business contact signals that Grow flagged in the latest rejection.

## Rerun

```powershell
node tools/check-grow-payment-compliance.mjs
```

## Artifact Privacy

Outputs are written to `.project-control/` and `.reports/` so payment/provider readiness evidence stays in the private repo artifact area instead of public theme paths.
