# Jus-Tice Reputation System: Google Reviews + First-Party Recommendations

Date: 2026-05-20

## Owner goal

Make lawyer reputation a paid value layer:

- Lawyers connect their Google Business / Google Maps reputation to Jus-Tice.
- Lawyers can request new Google reviews from real clients.
- Jus-Tice also has its own moderated recommendation system, similar in business value to Din/LawReviews, without mixing it with Google-owned review text.
- The lawyer dashboard should make this feel like a real growth system, not a loose form.

## Current best-practice findings

1. Google explicitly allows businesses to ask real customers for reviews through a Google link or QR code, but prohibits incentives or fake/misleading reviews.
2. Google says business replies are public and should be relevant, short, professional, non-promotional and timely.
3. The Google Business Profile Reviews API can list reviews for verified locations and supports owner replies, but requires OAuth/business-management access.
4. The Google Places API can return place details, ratings and up to five reviews for a place ID, but displayed Google review content requires attribution and policy compliance, and should not be cached/stored beyond allowed rules.
5. BrightLocal 2026 says review recency is now a major trust factor: many consumers care about reviews from the last three months, not just old total review count.

Sources:

- Google Business Profile Help, "Tips to get more reviews": https://support.google.com/business/answer/3474122
- Google Business Profile API reviews list: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
- Google Places API Place Details: https://developers.google.com/maps/documentation/places/web-service/place-details
- Google Places API policies and attributions: https://developers.google.com/maps/documentation/places/web-service/policies
- BrightLocal Local Consumer Review Survey 2026: https://www.brightlocal.com/research/local-consumer-review-survey/

## Product decision

Do not copy Google review text into Jus-Tice manually.

Use two separate tracks:

1. Google track
   - Store Google Business profile URL.
   - Store Google review request URL.
   - Store Google Place ID.
   - Store review count and latest review date as owner-reviewed signals.
   - Later: connect official Google Business Profile OAuth/API for real review sync and reply management.

2. Jus-Tice first-party recommendation track
   - Store recommendations in `justice_recommendation`.
   - Require permission status and moderation status.
   - Publish only approved recommendations.
   - Keep Google content separate unless the official API/policy path is implemented.

## What changed this cycle

The lawyer dashboard review-campaign form now captures:

- Google Business profile URL
- Google review request URL
- Google Place ID
- target client group
- owner notes

On submit, the system saves these details onto the linked lawyer profile and includes them in the owner notification email. Nothing is sent to clients automatically.

## Next build steps

1. Add an owner/admin "Review Campaign Queue" view that groups lawyers with pending review campaign requests.
2. Add approved SMS/email templates for Google review requests, with no incentives and no pressure.
3. Add a "copy review link" and QR-code asset for each lawyer with a saved Google review request URL.
4. Add a first-party recommendation intake form with permission checkbox and moderation queue.
5. Add public profile display for approved first-party recommendations only.
6. Add Google API/OAuth connector after we confirm the Google Cloud project and Business Profile access model.

## Completion assessment

- Google review source capture: 60%
- Google review public display: 20%
- Official Google API sync: 10%
- First-party recommendation storage: 55%
- First-party public display: 20%
- Revenue readiness from reputation product: 35%

## Safety rules

- No fake reviews.
- No incentives for reviews.
- No copying Google review text into our database manually.
- No automated SMS/email until owner approves the template and recipient group.
- No public star/review claims unless the source is real, current and permission-compliant.
