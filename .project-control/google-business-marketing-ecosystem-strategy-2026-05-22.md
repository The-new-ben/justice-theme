# Google Business Marketing Ecosystem Strategy - 2026-05-22

Status: VERIFIED RESEARCH / VERIFIED PLANNING / NO ACCOUNT CHANGES / NO PUBLIC CHANGES

## Purpose

This document completes T246 by defining how Google Business Profile, Google reviews, GA4 events, lead tracking, lawyer onboarding, campaign readiness and off-site visibility should work together for Jus-Tice.

This does not approve or perform any Google Business Profile edit, Google Ads change, GA4 setting change, GSC setting change, API connection, OAuth flow, review import, SMS/email outreach, lawyer profile edit, public review display, schema change, CRM change, payment change, wp-admin action or uPress deployment.

## Sources Reviewed

VERIFIED RESEARCH on 2026-05-22:

- Google Business Profile Help, "Tips to get more reviews": `https://support.google.com/business/answer/3474122`.
- Google Business Profile Help, "Understand your Business Profile performance": `https://support.google.com/business/answer/9918094`.
- Google Business Profile Help, "Tips to improve your local ranking on Google": `https://support.google.com/business/answer/7091`.
- Google Business Profile Help, "Edit your Business Profile": `https://support.google.com/business/answer/3039617`.
- Google Business Profile Performance API reference: `https://developers.google.com/my-business/reference/performance/rest`.
- Google Business Profile Reviews API reference: `https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list`.

## Strategic Recommendation

Use Google Business as a measured ecosystem, not as a single profile task.

The correct order is:

1. Profile truth and compliance: verified Jus-Tice profile, verified lawyer profiles, real contact/website/review links, no fake ratings.
2. Measurement: GA4 key events, UTMs, lead-source fields and monthly report definitions.
3. Reputation MVP: manual Google review links and first-party recommendations with moderation.
4. Lawyer onboarding: collect each lawyer's GBP URL, Place ID, review request link, service areas, practice areas and source proof.
5. Off-site visibility: link from safe owned profiles and partner/public legal profiles back to the correct Jus-Tice lawyer mini-site or directory path.
6. API later: only after owner/lawyer authorization, OAuth, quota/API access, terms review and data-display rules are approved.

## Minimum Account / Data Access Needed

For Jus-Tice brand profile:

- Owner or manager access to the verified Google Business Profile.
- Current Business Profile URL.
- Public Google Maps URL.
- Website URL currently listed in GBP.
- Primary category, secondary categories, service areas, phone, hours and business description.
- Performance export for views, searches, calls, website clicks, direction requests, messages and search terms where available.
- Review request link or QR code generated from the profile.

For each lawyer profile:

- Confirmation that the lawyer owns/manages the profile or authorizes Jus-Tice to store public source fields.
- Public GBP/Maps URL.
- Google Place ID when verified.
- Google review request URL if the lawyer wants review-request workflow.
- Latest review date and review count, manually verified and dated if used.
- Website URL listed in GBP and whether it should point to the lawyer's own site or Jus-Tice mini-site.
- Service area and city coverage.
- Source screenshot/export stored privately, not in Git if it includes private account data.

For later API access:

- Google Cloud project approved by owner.
- OAuth consent setup.
- Business Profile API access where required.
- OAuth scopes limited to the approved use case, especially `https://www.googleapis.com/auth/business.manage` for managed-location review workflows.
- Performance API access if monthly profile metrics are pulled programmatically.
- Clear disconnect/revocation flow for lawyers.

## Operating Model

### Track 1 - Jus-Tice GBP

Goal: make the brand profile a credible local/entity touchpoint.

Immediate planning tasks:

- Verify name, category, phone, website URL, service area and business description.
- Use the website URL with UTM when appropriate, such as `utm_source=google_business_profile&utm_medium=organic&utm_campaign=brand_profile`.
- Add or confirm photos/video only if assets are real and brand-safe.
- Track GBP profile performance monthly.
- Do not promise local ranking. Google says local results are based mainly on relevance, distance and prominence, and there is no paid/request path for better organic local rank.

### Track 2 - Lawyer GBP Capture

Goal: make each paid lawyer profile more valuable without pretending Jus-Tice owns their Google reputation.

Collect during onboarding:

- GBP URL.
- Place ID.
- Review request link.
- Review count.
- Latest review date.
- Website listed in GBP.
- Service area/cities.
- Profile photo and source proof.

Display rule:

- MVP can show "Read reviews on Google" only if the URL is verified.
- Rating/count can be shown only if manually verified with date or synced through an approved API path.
- Do not copy Google review text into Jus-Tice.
- Do not add Review or AggregateRating schema.

### Track 3 - Review Growth Workflow

Goal: make reputation work a paid retention feature.

Safe MVP:

- Lawyer requests a review campaign from dashboard.
- Owner approves wording and recipient group.
- System stores request internally.
- Lawyer or owner sends the Google review link manually until SMS/email provider and templates are approved.
- First-party Jus-Tice recommendation intake remains separate and moderated.

Must not skip:

- No incentives.
- No fake or selective review generation.
- No pressure to change or remove negative reviews.
- No private legal facts in public replies or first-party recommendations.

### Track 4 - GA4 / Lead Measurement

Goal: connect profile visibility to business outcomes.

Required GA4 key events:

- `lead_form_submit`.
- `phone_click`.
- `whatsapp_click`.
- `lawyer_signup_submit`.
- `lawyer_profile_contact_click`.
- `review_link_click`.

Useful supporting events:

- `search_submit`.
- `lawyer_profile_view`.
- `lawyer_card_click`.
- `article_cta_click`.
- `ask_lawyer_start`.
- `document_request_start`.
- `document_request_submit`.
- `lawyer_onboarding_step_complete`.

Required UTM / attribution fields:

- Source: `google_business_profile`, `google_maps`, `first_wave_outreach`, `lawyer_profile`, `homepage`, `legaltech_gateway`.
- Medium: `organic`, `profile`, `sms`, `email`, `whatsapp`, `site_cta`.
- Campaign: `brand_profile`, `lawyer_profile`, `review_request`, `lawyer_acquisition`, `cluster_family_law`, etc.
- Area/practice field.
- Lawyer ID/profile ID where consent and privacy allow it.

### Track 5 - Lawyer Onboarding Funnel

Goal: make Google Business and reputation setup part of paid onboarding, not a later loose task.

Onboarding checklist:

1. Verify license/profile basics.
2. Capture GBP/Maps URL and Place ID.
3. Capture review request URL or mark unavailable.
4. Capture own website/social/external authority URLs.
5. Set source status: `not_provided`, `owner_verified`, `lawyer_provided`, `admin_verified`, `api_synced`.
6. Decide whether the GBP website URL should point to lawyer site, Jus-Tice mini-site or another approved URL.
7. Set no public rating/review display until approval gates pass.
8. Add lawyer to monthly reporting only after tracking fields exist.

### Track 6 - Off-Site Visibility

Goal: build a clean authority footprint around real lawyer profiles.

Allowed planning targets:

- Lawyer's official website.
- Google Business Profile.
- LinkedIn.
- Facebook/Instagram/YouTube if active and professional.
- Bar/license source where publicly available and appropriate.
- Dun's 100 or similar source profile when real.
- Justia or other existing legal directory profiles when real.
- Local chamber/professional association profiles.

Rules:

- Store source URLs and verification date.
- Link only to real profiles.
- Do not invent credentials, rankings, awards, reviews or badges.
- Do not create duplicate lawyer profiles or uncontrolled citations without owner approval.

## API Position

Use API later, not now.

Business Profile Performance API can retrieve performance data such as daily/monthly metrics and search keyword impressions for managed profiles. Reviews API can retrieve a paginated list of reviews for a verified location and returns review details, average rating and total review count with business-management OAuth scopes.

However, the safe first milestone is manual/source-verified data because:

- lawyers must authorize access to their own managed locations;
- API quota/access may require approval;
- review display and caching need policy review;
- public display must not mix Google reviews with first-party Jus-Tice recommendations;
- no review schema is approved.

## First 30-Day Execution Plan

Week 1:

- Owner confirms Jus-Tice GBP access and exports/downloads performance if available.
- Add private owner checklist for brand GBP fields; do not commit private exports.
- Add GA4 key-event implementation plan if not already complete.
- Confirm review-link and UTM conventions.

Week 2:

- Add GBP/reputation fields to first-wave lawyer onboarding checklist.
- Owner fills private first-20 lawyer prospect list with Google review count/latest review date and GBP URL when available.
- Prepare safe review-request templates for owner approval.

Week 3:

- Run one manual pilot with Maya or another approved lawyer only after source proof is collected.
- Verify public profile does not show fake ratings/reviews.
- Measure clicks to Google review link and profile contact CTAs.

Week 4:

- Produce first monthly lawyer value report template: profile views, leads, contact clicks, review link clicks, profile completeness, content links and next actions.
- Decide whether to request/prepare API access for profile performance/reviews.

## Blockers

BLOCKED:

- Owner/lawyer Google Business access is not confirmed in repo.
- No real GBP export is present.
- No API OAuth connection is approved.
- No public review display or review schema is approved.
- No SMS/email review request sending is approved.
- No account or profile settings were changed.

## Next Action

NEXT: create an owner-private Google Business evidence checklist and keep it outside Git if it includes account screenshots or private profile exports. In repo, the next safe task is GA4 event and UTM implementation planning for GBP/reputation flows.
