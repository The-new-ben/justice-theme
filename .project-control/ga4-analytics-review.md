# GA4 Analytics Review

Date: 2026-05-10  
Status: VERIFIED IN BROWSER UI - no GA4 settings changed

## Access

VERIFIED:
- GA4 property opened: `justice - GA4`.
- Browser access works.
- Traffic acquisition, Events, and Pages and screens reports were checked.

NOT EXECUTED:
- No GA4 configuration changes.
- No key events were created.
- No Search Console link was created from GA4.

## Executive Findings

VERIFIED:
- Organic Search is the largest visible acquisition channel.
- Key events are currently `0`, so GA4 is not yet measuring leads, phone clicks, WhatsApp clicks, lawyer-profile actions, or document-tool conversions as business outcomes.
- The homepage has unusually strong engagement relative to other pages, but many top landing/content pages are legacy articles, PDFs, or old Hebrew-slug pages.
- GA4 itself recommends linking the Search Console property `https://jus-tice.co.il/` to Analytics. The browser UI indicated the account has owner verification for Search Console and editor role in Analytics.

DECISION:
- GA4 must become the business measurement layer before marketing. Organic traffic exists, but conversion intelligence is not yet usable.

## Home Snapshot

Date range visible: last 7 days.

VERIFIED:
- Active users: 469, down 18.9%.
- Event count: 2.8K, up 10.1%.
- Key events: 0.
- New users: 451, down 19.6%.
- Active users in last 30 minutes: 1, from Israel.

NOTES:
- This is enough to confirm GA4 is installed and receiving data.
- It is not enough to evaluate lead quality, lawyer inquiry quality, or monetization because key events are missing.

## Traffic Acquisition

VERIFIED totals:
- Sessions: 2,447.
- Engaged sessions: 779.
- Engagement rate: 31.83%.
- Average engagement time per session: 45 seconds.
- Events per session: 4.22.
- Event count: 10,322.
- Key events: 0.00.
- Revenue: $0.00.

Channels:
- Organic Search: 1,261 sessions, 575 engaged sessions, 45.6% engagement rate, 27s average engagement, 5,366 events, 0 key events.
- Direct: 1,106 sessions, 172 engaged sessions, 15.55% engagement rate, 1m05s average engagement, 4,584 events, 0 key events.
- Unassigned: 47 sessions, 22 engaged sessions, 46.81% engagement rate, 1m10s average engagement, 251 events.
- Referral: 37 sessions, 11 engaged sessions, 29.73% engagement rate, 9s average engagement, 121 events.

Interpretation:
- Organic Search is the real traffic base.
- Direct traffic is large but lower engagement; it may include untagged campaigns, bots, bookmarks, admin/client review, or attribution loss.
- No conversion tracking means traffic quality cannot be judged yet.

## Events

VERIFIED event report:
- Total event count: 10,322.
- Total users: 2,199.
- Event count per user: 4.75.
- Total revenue: $0.

Visible events:
- `page_view`: 3,038 events, 2,198 users.
- `session_start`: 2,452 events, 2,199 users.
- `first_visit`: 2,137 events, 2,134 users.
- `scroll`: 1,334 events, 1,050 users.
- `user_engagement`: 1,264 events, 810 users.
- `click`: 89 events, 76 users.
- `file_download`: 6 events, 4 users.
- `view_search_results`: 2 events, 2 users.

MISSING:
- `lead_form_submit`
- `phone_click`
- `whatsapp_click`
- `lawyer_profile_view`
- `lawyer_card_click`
- `article_cta_click`
- `ask_lawyer_start`
- `document_request_start`
- `document_request_submit`
- `lawyer_signup_submit`

## Pages And Screens

VERIFIED top rows:
- `/`: 396 views, 108 active users, 3.67 views/user, 6m10s average engagement, 984 events.
- `/articles/השופט-יחזקאל-אליהו-החלטה-בבקשה-לצרף-תו/`: 192 views, 192 active users, 0s average engagement, 578 events.
- `/famous-criminal-defense-lawyer/`: 65 views, 61 active users, 0s average engagement, 250 events.
- `/lahav-433/`: 53 views, 45 active users, 31s average engagement, 191 events.
- `/court-judge/`: 42 views, 42 active users, 8s average engagement, 169 events.
- `/תחנות-משטרה-כתובת-טלפון-רשימה-ארצית-מעודכן/`: 32 views, 28 active users, 31s average engagement, 124 events.
- `/שופטת-טלי-חיימוביץ-פסד-קבלת-דבר-במרמה-בנסיבות-מחמירות-הלבנת-הון-עבירות-מנהלים-בתאגיד/`: 31 views, 30 active users, 9s average engagement, 135 events.
- `/משפט-החוזר-של-רומן-זדורוב-תפח-502-07/`: 28 views, 11 active users, 1m36s average engagement, 79 events.
- `/portugal-relocation/`: 23 views, 17 active users, 9s average engagement, 88 events.
- `/lawyers/`: 22 views, 4 active users, 5.50 views/user, 1m51s average engagement, 36 events.

Interpretation:
- The homepage is a strong engagement asset and should be treated as a broad legal-portal SEO page.
- `/lawyers/` has low user volume but high views per user and meaningful engagement; it needs stronger discovery/internal links and conversion events.
- Some old legacy/legal-news pages still receive visits and must not be deleted or redirected without data review.
- Several high-view pages show 0s average engagement and need investigation: either quick exits, measurement limitations, or template/tracking behavior.

## Recommended GA4 Actions

1. Link GA4 and Search Console.
2. Add and mark key events:
   - `lead_form_submit`
   - `phone_click`
   - `whatsapp_click`
   - `document_request_submit`
   - `lawyer_signup_submit`
3. Add supporting events:
   - `lawyer_profile_view`
   - `lawyer_card_click`
   - `article_cta_click`
   - `search_submit`
   - `ask_lawyer_start`
   - `document_request_start`
4. Build a landing page report segmented by Organic Search.
5. Build a directory/conversion funnel.
6. Tag lawyer outreach and owner testing traffic with UTM parameters so it does not pollute Direct traffic analysis.

## Evidence

- Screenshot: `project-control/visual-evidence/ga4-pages-screens-2026-05-10.png`
- Event plan: `project-control/ga4-event-plan.csv`

## Current Decision

DO NOT make content or URL decisions from GA4 alone yet.

Use GA4 now for:
- traffic channel importance
- landing page discovery
- conversion tracking gap
- prioritizing measurement implementation

Use GSC for:
- query/page mapping
- indexing risk
- URL migration risk
- cannibalization evidence

## 2026-05-22 Google Business / Reputation Measurement Addendum

Evidence:
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.

VERIFIED PLANNING:
- Google Business Profile and review/reputation work should not launch until GA4 and UTM measurement can distinguish profile traffic, review-link clicks, lawyer contact clicks, lead submits and lawyer signup steps.

Recommended additional key events:
- `lawyer_profile_contact_click`
- `review_link_click`
- `lawyer_onboarding_step_complete`

Recommended campaign/source conventions:
- `utm_source=google_business_profile`
- `utm_source=google_maps`
- `utm_source=first_wave_outreach`
- `utm_medium=organic|profile|sms|email|whatsapp|site_cta`
- `utm_campaign=brand_profile|lawyer_profile|review_request|lawyer_acquisition`

BLOCKED:
- No GA4 setting, tag, key event, account link or public tracking change is approved by this addendum.
