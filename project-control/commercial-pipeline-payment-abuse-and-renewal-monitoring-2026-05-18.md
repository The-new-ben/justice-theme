# Commercial Pipeline Payment Abuse And Renewal Monitoring - 2026-05-18

Status: PRE-LAUNCH GUARDRAIL / NO LIVE PAYMENT CHANGE

## Why This Matters

The commercial pipeline is close enough that the next risk is not just "can a lawyer pay once". The real risk is whether the site can safely expose a public checkout, avoid being used for card testing, and keep subscriptions renewing without manual rescue.

## Current Research Applied

Sources checked this cycle:
- WooCommerce card-testing prevention documentation: `https://woocommerce.com/document/how-do-i-prevent-and-respond-to-card-testing-attacks/`
- WooCommerce fraud-prevention help article: `https://woo.zendesk.com/hc/en-us/articles/37329417482644-Fraud-prevention`
- WooCommerce Subscriptions Health Check documentation: `https://woocommerce.com/document/woocommerce-subscriptions-health-check/`
- WooCommerce Subscriptions Health Check product update: `https://woocommerce.com/product-update/review-and-manage-subscription-renewal-states-with-the-new-subscriptions-health-check`

Applied conclusions:
- Public checkout should not go live until bot challenge, rate limiting, gateway fraud checks, and failed-order review exist.
- Recurring billing should be monitored with WooCommerce Subscriptions Health Check after sandbox payment, after real-money smoke test, and weekly after launch.
- A successful first checkout is not enough. Month-two renewal health is the real proof.

## Runbook Update Made

Updated:
- `project-control/codex-commercial-pipeline-runbook-2026-05-18.md`

Added:
- Section 6.9: checkout abuse protection before live mode.
- Section 9.4: WooCommerce Subscriptions Health Check monitoring.
- Section 15: done criteria now includes checkout abuse protection and subscription-health review.

## Required Controls Before Public Checkout

Before Morning/Meshulam credit-card live mode:
1. Add a bot challenge on checkout, login, registration, password reset, and payment-method update screens.
2. Add rate limiting for checkout/payment endpoints by IP/user/email and failed-payment velocity.
3. Keep CVV required and use 3DS/SCA where available in Meshulam/Morning.
4. Review failed/cancelled/pending orders weekly after launch.
5. Run WooCommerce Subscriptions Health Check after each test and weekly after launch.

## Live Journey Check This Cycle

Read-only journey checker passed:
- Homepage lead path.
- Lawyer directory.
- Sample article content path.
- Lawyer registration.
- Lawyer registration with plan intent.
- Sitemap index.
- Robots.txt.

## Safety Statement

This cycle changed only repo documentation/status artifacts on the draft integration branch. It did not log into WordPress admin, pull uPress, install plugins, enable checkout, create products, create users, create lawyer profiles, create leads, charge cards, change payment settings, change public CMS content, change SEO settings, change GA4/GSC, or touch the live database.
