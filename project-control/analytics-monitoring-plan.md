# Analytics Monitoring Plan

Date: 2026-05-10  
Status: PLAN V1 - GA4/GSC monitoring active manually, events not fully verified

## Purpose

Use GSC and GA4 together to decide content, design, internal links and conversion priorities.

GSC answers:
- what Google sees.
- which queries and pages get impressions.
- cannibalization and URL risk.
- indexing/sitemap/Core Web Vitals problems.

GA4 answers:
- what users do after landing.
- whether pages convert.
- whether lawyer cards, CTAs and lead flows work.
- whether search and filters help users.

## Daily / Cyclic Checks

Search Console:
- top queries/pages by impressions.
- low CTR opportunities.
- position 5-20 opportunities.
- query-to-page cannibalization.
- page-to-query intent mismatch.
- indexing errors.
- sitemap status.
- Core Web Vitals and HTTPS.

GA4:
- organic landing pages.
- engagement by page/template.
- lead/call/WhatsApp events.
- lawyer directory usage.
- lawyer profile engagement.
- article CTA clicks.
- search/filter usage.
- signup funnel activity.

## Required Key Events

Primary key events:
- `generate_lead`
- `phone_click`
- `whatsapp_click`
- `document_request_submit`
- `lawyer_signup_submit`

Supporting events:
- `lawyer_profile_view`
- `lawyer_card_click`
- `article_cta_click`
- `search_submit`
- `document_request_start`
- `lawyer_signup_start`

## Reporting Outputs

Update:
- `gsc-keyword-page-map.csv`
- `gsc-cannibalization-review.csv`
- `gsc-content-priorities.csv`
- `gsc-indexing-review.csv`
- `gsc-core-web-vitals-review.csv`
- `ga4-analytics-review.md`
- `ga4-event-plan.csv`

## Current Blockers

NOT VERIFIED:
- event firing on live forms/buttons.
- key-event configuration in GA4.
- full GSC API export.
- GA4 landing-page exports.

## Next Action

After next live deployment, run a click/form event QA pass and record whether each event appears in GA4 DebugView or Realtime.
