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
