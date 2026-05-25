# Homepage Investor Polish Live Check - 2026-05-25

- Status: PASS
- Started: 2026-05-25T01:14:27.677Z
- Base URL: https://jus-tice.co.il
- Expected marker: 2026-05-25-competitor-signup-funnel-v1
- Checks passed: 4/4
- Checks needing review: 0
- Scope: read-only homepage and static marker checks only.
- Safety: no CMS record, payment, invoice, refund, lead, lawyer profile, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Final URL |
|---|---:|---:|---|---|
| Homepage runtime deployment marker | PASS | 200 | - | https://jus-tice.co.il/?homepage_investor_polish_check=1779671667677 |
| Homepage lawyer revenue strip is visible | PASS | 200 | - | https://jus-tice.co.il/?homepage_investor_polish_check=1779671667677 |
| Static theme deployment marker | PASS | 200 | - | https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?homepage_investor_polish_check=1779671667677 |
| Premium polish CSS version is deployed | PASS | 200 | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/css/premium-pass-4.css?homepage_investor_polish_check=1779671667677 |

## Owner Meaning

Production is serving the homepage investor polish bundle: the lawyer revenue strip, signup/login routes and deployment markers are visible on the live homepage.

## Rerun

```powershell
node tools\check-homepage-investor-polish-live.mjs
```
