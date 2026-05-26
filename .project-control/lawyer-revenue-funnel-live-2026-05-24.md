# Lawyer Revenue Funnel Live Check - 2026-05-24

- Status: PASS
- Started: 2026-05-24T18:06:06.036Z
- Base URL: https://jus-tice.co.il
- Checks passed: 10/10
- Checks needing review: 0
- Scope: read-only public route and static asset checks only.
- Safety: no CMS record, lawyer profile, payment, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4, email/SMS, or wp-admin setting was changed.

| Check | Status | HTTP | Missing | Unexpected | Final URL |
|---|---:|---:|---|---|---|
| Homepage exposes lawyer revenue entrypoints | PASS | 200 | - | - | https://jus-tice.co.il/ |
| Plan page routes paid intent through checkout | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-plans/?codex_check=lawyer_revenue_funnel |
| Checkout path exposes Grow-required fields and terms approval | PASS | 200 | - | - | https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&utm_source=lawyer_plans&utm_medium=plan_page&utm_campaign=lawyer_acquisition&utm_content=pricing_card_lead_partner&outreach_segment=plans_page&codex_check=grow_checkout |
| Registration success keeps UTM attribution in redirect hash | PASS | 301 | - | - | https://jus-tice.co.il/lawyer-registration/?registration=sent&plan_interest=pro&payment_path=manual_invoice&utm_source=codex_check&utm_medium=live_funnel&utm_campaign=lawyer_acquisition&utm_content=founder_primary_pro&utm_term=lawyer_subscriptions&outreach_segment=plans_page&outreach_city=tel-aviv&outreach_practice=real-estate-law |
| Registration success explains manual activation | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-registration/?registration=sent&plan_interest=pro&payment_path=manual_invoice&outreach_segment=plans_page&outreach_city=tel-aviv&outreach_practice=real-estate-law |
| Registration form preserves paid manual-invoice plan state | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&billing_first_name=Codex&billing_last_name=Lawyer&billing_phone=0501234567&billing_email=codex-lawyer@example.com&billing_legal_name=Codex+Legal+Ltd&billing_business_id=123456789&billing_invoice_email=billing-codex@example.com&billing_invoice_address=Tel+Aviv |
| Logged-out dashboard gate offers paid-lawyer path | PASS | 200 | - | - | https://jus-tice.co.il/lawyer-dashboard/?codex_check=lawyer_revenue_funnel |
| Revenue UI CSS markers are deployed | PASS | 200 | - | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/css/premium-pass-3.css?codex_check=lawyer_revenue_funnel |
| Lawyer dashboard support assistant JS is deployed | PASS | 200 | - | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/js/lawyer-dashboard.js?codex_check=lawyer_revenue_funnel |
| Lawyer revenue analytics events are deployed | PASS | 200 | - | - | https://jus-tice.co.il/wp-content/themes/justice-theme/assets/js/analytics-events.js?codex_check=lawyer_revenue_funnel |

## Owner Meaning

The public lawyer revenue path is currently wired: lawyers can find the paid-plan area, paid intent is routed to manual invoice activation, the paid registration form preserves manual-invoice plan state, the post-registration handoff avoids fake automatic-charge language, the dashboard gate exposes the next revenue step, and tracking assets are present.

## Rerun

```powershell
node tools/check-live-lawyer-revenue-funnel.mjs
```
