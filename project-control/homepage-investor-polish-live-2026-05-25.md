# Homepage Investor Polish Live Check - 2026-05-25

- Status: REVIEW
- Started: 2026-05-24T21:14:44.322Z
- Base URL: https://jus-tice.co.il
- Expected marker: 2026-05-25-owner-demo-payment-playbook-v1
- Checks passed: 2/4
- Checks needing review: 2
- Scope: read-only homepage and static marker checks only.
- Safety: no CMS record, payment, invoice, refund, lead, lawyer profile, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Final URL |
|---|---:|---:|---|---|
| Homepage runtime deployment marker | REVIEW | 200 | 2026-05-25-owner-demo-payment-playbook-v1 | https://jus-tice.co.il/?homepage_investor_polish_check=1779657284322 |
| Homepage lawyer revenue strip is visible | PASS | 200 | - | https://jus-tice.co.il/?homepage_investor_polish_check=1779657284322 |
| Static theme deployment marker | REVIEW | 200 | justice-theme-deployment-marker=2026-05-25-owner-demo-payment-playbook-v1<br>expected-github-main-commit=owner-demo-payment-playbook-v1 | https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?homepage_investor_polish_check=1779657284322 |
| Premium polish CSS version is deployed | PASS | 200 | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/css/premium-pass-4.css?homepage_investor_polish_check=1779657284322 |

## Owner Meaning

Production has not yet proven the homepage investor polish bundle. Pull Git in uPress for `wp-content/themes/justice-theme`, clear cache if needed, then rerun this checker.

## Rerun

```powershell
node tools\check-homepage-investor-polish-live.mjs
```
