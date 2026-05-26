# Google Reviews Integration Plan
Date: 2026-05-10  
Status: PLAN - NOT IMPLEMENTED

## Recommended Path

MVP should start with manual/source-disclosed Google review linking, not automated import.

1. Store lawyer Google Place ID if verified.
2. Store Google Maps review/profile URL.
3. Store rating and review count only when manually verified by admin.
4. Display "Read reviews on Google" and "Google rating last verified on [date]".
5. Add Places API sync later after billing/API/terms review.
6. Add Business Profile API only for lawyers who authorize their own Google Business Profile via OAuth.

## Option 1 - Google Business Profile API

Use when:
- the lawyer owns/manages the Google Business Profile.
- the lawyer grants authorization.
- Jus-Tice has OAuth setup and app approval as needed.

Capabilities:
- list reviews.
- get a specific review.
- get reviews across multiple locations.
- reply to reviews.
- delete review replies.

Blockers:
- OAuth credentials.
- lawyer/business authorization.
- app verification and consent-screen work.
- Google Workspace/Business Profile service availability.
- product/legal review of reply workflow.

Status: FUTURE PREMIUM FEATURE / BLOCKED.

## Option 2 - Google Places API

Use when:
- we know the public Place ID.
- we need public rating, review count, Google Maps URL and limited review sample.

Technical notes:
- endpoint: `https://places.googleapis.com/v1/places/{PLACE_ID}`.
- required header: `X-Goog-FieldMask`.
- `rating` and `userRatingCount` are supported Place fields.
- `reviews` can return a limited set of reviews and has higher cost/terms risk.
- production should request only needed fields, not wildcard `*`.

Recommended fields for MVP sync:
- `id`
- `displayName`
- `googleMapsUri`
- `rating`
- `userRatingCount`

Blocked until:
- Google Maps Platform billing/API key.
- terms review.
- quota/cost limits.
- cache policy.

Status: FUTURE API MVP / BLOCKED.

## Option 3 - Manual Google Link

Use now:
- admin enters verified Google Maps URL.
- admin enters Place ID if known.
- admin optionally enters rating/count with verification date.
- page links users to Google for full reviews.

Pros:
- fastest.
- low risk.
- no scraping.
- no OAuth.

Cons:
- manual updates.
- needs admin review discipline.

Status: RECOMMENDED MVP.

## Data To Store

Lawyer meta:
- `google_place_id`
- `google_maps_review_url`
- `google_business_profile_location_id`
- `google_reviews_connected`
- `google_rating`
- `google_review_count`
- `google_reviews_last_synced`
- `google_reviews_last_verified`
- `google_reviews_source_status`
- `google_reviews_admin_notes`

Review CPT fields later:
- `source = google`
- `source_review_id`
- `source_url`
- `rating`
- `review_text`
- `review_date`
- `imported_at`
- `source_place_id`
- `moderation_status`

## Display Rules

Allowed MVP display:
- "Google rating: 4.7 · 52 reviews" only if verified.
- "Read reviews on Google" button.
- "Last verified: 2026-05-10" if available.
- "No reviews shown yet" if absent.

Not allowed:
- fake stars.
- unsourced ratings.
- copied Google review text without terms review.
- Google review schema as Jus-Tice review schema.

## Sync Concept

1. Admin verifies Place ID.
2. Cron/admin action fetches selected fields.
3. Data is cached to lawyer meta.
4. Page shows summary and Google link.
5. Sync failures do not delete old public display; they mark source status stale.
6. Admin sees stale/error state.

## Status

NOT IMPLEMENTED. No API key, OAuth flow, sync job, cron, database update or public display was changed.

## 2026-05-11 Integration Addendum

Status: VERIFIED - technical integration plan only.
Implementation status: NOT IMPLEMENTED.

### Google Business Profile API Boundary

Use the Business Profile review API only when:
- the lawyer owns or manages the Google Business Profile;
- the lawyer explicitly authorizes Jus-Tice via OAuth;
- the Google Cloud project, scopes and app verification path are approved;
- the system stores the connection status and last sync date;
- the lawyer can disconnect the integration.

Useful capabilities:
- list reviews for a managed location;
- retrieve review data;
- reply to reviews;
- delete or update owner replies where the API permits.

Do not use it to access profiles that Jus-Tice or the lawyer does not manage.

### Google Places API Boundary

Use Places API only as a public profile-enrichment source after Maps Platform terms and billing are approved.

Preferred fields for a later sync:
- `id` or Place ID;
- `displayName`;
- `rating`;
- `userRatingCount`;
- `googleMapsUri`;
- possibly `reviews`, only after terms and display rules are reviewed.

Rules:
- request only needed fields through field masks;
- cache results and store last synced date;
- show source disclosure;
- link users to Google for the full review set;
- do not treat the limited Places review sample as a full review archive.

### Manual MVP Boundary

## 2026-05-22 Google Business Ecosystem Addendum

Evidence:
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.

VERIFIED RESEARCH:
- Google Business Profile guidance still supports asking real customers for reviews by link or QR code, while blocking incentives, fake/misleading reviews and pressure to change or remove reviews.
- Google Business Profile performance can show profile views/searches/actions such as calls, website clicks, directions, messages and search terms where available.
- Business Profile Performance API and Reviews API are later automation paths for managed/verified locations, but they require approved access, OAuth and owner/lawyer authorization.

UPDATED DECISION:
- Keep the manual/source-verified Google link MVP as the first release.
- Add Google Business Profile evidence capture to lawyer onboarding and first-wave prospect qualification.
- Keep Google review content separate from Jus-Tice first-party recommendations.
- Use GA4 events and UTM fields before any marketing campaign is started.

BLOCKED:
- No Google Business Profile edit, API/OAuth connection, review import, SMS/email sending, public rating display or review schema is approved by this addendum.

Manual MVP is the safest launch path:
- admin verifies the lawyer Google Maps profile;
- admin stores Google profile/review URL;
- admin stores rating/count only if source proof is kept internally;
- public page shows "Google rating last verified on [date]";
- public CTA says "Read reviews on Google";
- no review text is copied into Jus-Tice unless terms and legal review approve it.

### Third-Party Reputation Tools

Podium, Birdeye and ReviewTrackers-style tools can inspire product design:
- review request workflows;
- review inbox;
- AI response drafts;
- sentiment themes;
- review alerts;
- multi-location dashboard;
- monthly reputation reports.

They should not be embedded blindly because:
- widgets can slow pages;
- vendor UX may clash with the site;
- review-gating risk must be checked;
- data ownership and export rights matter;
- legal-directory compliance differs from general local business reputation management.

### Prohibited Flows

Do not build:
- "leave us a 5-star review" messaging;
- incentives, discounts or rewards for Google reviews;
- funnels that ask unhappy users to submit private feedback while only happy users are sent to Google;
- scraping of Google review text;
- fake review imports;
- copied screenshots of Google reviews as a workaround;
- AggregateRating schema for Google data unless visible, permitted and approved.

### Recommended Sequence

1. Add fields and admin source-proof workflow.
2. Add visible Google link and empty states.
3. Add first-party review CPT and moderation.
4. Add lawyer reply workflow.
5. Add reputation dashboard.
6. Add Places API summary sync only after billing/terms review.
7. Add Business Profile API only for lawyers who authorize profile access.
