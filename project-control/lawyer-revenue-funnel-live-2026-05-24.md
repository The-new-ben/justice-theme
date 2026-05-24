# Lawyer Revenue Funnel Live Check - 2026-05-24

- Status: PASS
- Started: 2026-05-24T13:21:26.568Z
- Base URL: https://jus-tice.co.il
- Checks passed: 8/8
- Checks needing review: 0
- Scope: read-only public route and static asset checks only.
- Safety: no CMS record, lawyer profile, payment, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Unexpected | Final URL |
|---|---:|---:|---|---|---|
| Homepage exposes lawyer revenue entrypoints | PASS | 200 | - | - | https://jus-tice.co.il/ |
| Plan page routes paid intent through checkout | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-plans/?codex_check=lawyer_revenue_funnel |
| Checkout path exposes Grow-required fields and terms approval | PASS | 200 | - | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&codex_check=grow_checkout |
| Registration success explains manual activation | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-registration/?registration=sent&plan_interest=pro&payment_path=manual_invoice |
| Registration form preserves paid manual-invoice plan state | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice |
| Logged-out dashboard gate offers paid-lawyer path | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-dashboard/?codex_check=lawyer_revenue_funnel |
| Revenue UI CSS markers are deployed | PASS | 200 | - | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/css/premium-pass-3.css?codex_check=lawyer_revenue_funnel |
| Lawyer revenue analytics events are deployed | PASS | 200 | - | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/js/analytics-events.js?codex_check=lawyer_revenue_funnel |

## Owner Meaning

The public lawyer revenue path is currently wired: lawyers can find the paid-plan area, paid intent is routed to manual invoice activation, the paid registration form preserves manual-invoice plan state, the post-registration handoff avoids fake automatic-charge language, the dashboard gate exposes the next revenue step, and tracking assets are present.

## Rerun

```powershell
node tools/check-live-lawyer-revenue-funnel.mjs
```
