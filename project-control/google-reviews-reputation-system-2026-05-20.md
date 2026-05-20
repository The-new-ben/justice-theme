# Google Reviews And Jus-Tice Reputation System
Date: 2026-05-20
Status: PHASE 1 IMPLEMENTATION STARTED

## Goal

Give paid lawyers a reputation-growth system, not only a profile page.

The system should connect:

- Google Business / Google Maps review link;
- Google review freshness and count where allowed;
- first-party Jus-Tice recommendations;
- review-request workflow by SMS/email later;
- owner approval before any message is sent;
- dashboard proof that reputation work is happening.

## Research Summary

Official Google Business Profile API allows listing, getting, replying to and deleting replies to reviews for managed locations. It requires OAuth and access to the business profile/location.

Google Maps user-generated content policies apply to reviews, ratings, images and related metadata. This means Jus-Tice should not fake, rewrite or republish Google review content casually.

Practical review-link workflows use:

- the Google Business Profile "Ask for reviews" / "Share review form" link; or
- `https://search.google.com/local/writereview?placeid=PLACE_ID`.

Competitor/product pattern:

- Justia uses claimed profile, reviews, Q&A, FAQs, social/external proof, premium placement and traffic stats.
- Din emphasizes fresh recommendations, lawyer discovery by practice/city, Q&A/forums and visible phone routing.
- LawReviews-like systems emphasize recommendation collection and display as the lawyer's trust product.

## Safe Architecture

### Phase 1: Manual / Link-Based

- Add fields to each lawyer profile:
  - Google Business profile URL;
  - Google Place ID;
  - Google review request URL;
  - latest Google review date;
  - Google review count;
  - review display approval status.
- Dashboard shows review freshness as a growth asset.
- Lawyer can request a review campaign from the dashboard.
- Owner reviews the request and approves wording before any client message.

### Phase 2: First-Party Jus-Tice Recommendations

- Create a separate Jus-Tice recommendation system.
- Store recommendations as first-party records.
- Moderate before display.
- Never claim they are Google reviews.
- Let lawyers request recommendation links for clients.

### Phase 3: Google Business Profile API

- Only for lawyers who grant access/OAuth.
- Pull review count, star summary and latest review metadata.
- Optionally support owner/lawyer review replies.
- Respect Google policies and attribution requirements.

## What Was Implemented Now

- Lawyer dashboard now has a reputation/authority cockpit.
- The cockpit tracks real growth assets: claimed profile, photo, Bar number, website/external proof, services/process, FAQs, video, review source, fresh review activity, content, exposure and leads.
- Lawyer dashboard now has a "Google reviews and recommendations" request form.
- The form saves an internal request only.
- Owner/admin receives a notification.
- Lawyer Onboarding admin now surfaces pending review campaign requests.
- Lawyer profile edit screens now have owner-only Google reputation source fields:
  - Google Business profile URL;
  - Google Place ID;
  - Google review request URL;
  - Google review count;
  - latest review date;
  - display-approved recommendations flag.
- Linear `HAD-72` tracks the next implementation steps.

## What Is Not Implemented Yet

- No Google API connection.
- No Google OAuth.
- No review import.
- No SMS/email sending.
- No first-party public review display.
- No public review schema.
- No automatic client outreach.

## Completion Assessment

- Research clarity: 70%.
- Phase 1 dashboard workflow: 35%.
- First-party review system: 0%.
- Google Business Profile API integration: 0%.
- Revenue impact today: indirect but important. This is one of the things lawyers will pay for and renew for because it creates ongoing visible value.

## Next Steps

1. Build first-party recommendation CPT/moderation.
2. Add one safe public profile section for approved first-party recommendations.
3. Add a review-request sender only after owner approval of copy/SMS/email provider.
4. Later: add Google OAuth/API only for lawyers who grant account access.
