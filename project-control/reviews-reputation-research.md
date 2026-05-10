# Reviews, Ratings, Reputation And Trust Research
Date: 2026-05-10  
Status: STRATEGY RESEARCH - NOT IMPLEMENTED

## Executive Decision

ACCEPTED: reviews and reputation should become a major Jus-Tice product layer, but not as fake stars or generic "recommended lawyer" labels.

Recommended MVP:
1. Add lawyer reputation fields and review-source disclosure.
2. Show Google rating/review count only when source and Place ID are verified.
3. Add a "Read reviews on Google" link before any automated import.
4. Add moderated Jus-Tice first-party reviews later, with privacy and legal-risk review.
5. Avoid AggregateRating schema until reviews are real, visible, compliant and legally approved.
6. Use "profile completeness", "reviews available", and "source verified" before any subjective rating language.

## Competitor / Platform Findings

| Platform | Review/rating elements shown | Source type | Trust mechanics | Conversion pattern | What Jus-Tice should copy structurally | What to avoid |
|---|---|---|---|---|---|---|
| Avvo | Ratings, client reviews, Q&A, detailed lawyer profiles, consultation flow | First-party Avvo profile/reviews plus public/licensing data | Proprietary rating, claimed profiles, peer endorsements, profile completeness signals | Search by practice/location -> read profile/reviews -> contact/book consultation | Clear rating explanation, Q&A authority, profile completeness, attorney claim/update flow | Copying proprietary scoring, implying official quality, opaque "best lawyer" language |
| Avvo support docs | Rating bands and rating-policy explanations | Platform algorithm | Says advertising does not influence Avvo Rating; client reviews are important for hiring but not part of Avvo Rating | Lawyer can claim/update profile to improve profile data | Separate objective profile completeness from subjective user reviews | Letting paid placement influence a trust score |
| Justia | Lawyer profiles by practice/location, full contact, education, associations, links, profile claiming | Lawyer/profile data, directory information | Encourages lawyers to claim/verify/update profiles | Compare and contact attorneys by need/location | Extensive structured profile sections and "claim profile" workflow | Thin profile pages with no useful context |
| FindLaw / Martindale ecosystem | Directory, client development, attorney reviews/peer review concepts | Legal directory / client reviews / peer ratings | Peer-review and client-review badges in Martindale ecosystem | Directory visibility + contact generation | Differentiate client reviews vs peer/professional recognition | Confusing paid marketing with objective recommendations |
| Midrag | Very strong Israeli review/count model, massive review totals, transparent service categories | First-party service-user reviews | Repeated emphasis on large review counts and standardized scoring | User searches category -> trusts transparent scores -> contacts professional | Transparent review policy, score components, service-category filtering | Applying home-service style "recommended" language to lawyers without legal review |
| LawReviews Israel | Lawyer cards with visible 5.0 scores and review counts | First-party review platform for lawyers | Lawyer-specific review marketplace; ratings prominent on cards | Users browse ranked/reviewed lawyers by field | Israeli UX benchmark for lawyer-review cards and review count display | Showing "5.0" style claims on Jus-Tice without real verified reviews |
| Google Business Profile | Public Google rating, review count, review text, owner replies | Third-party Google reviews | Google policy enforcement against fake/incentivized/conflict reviews | Strong external trust signal; users can leave/read reviews on Google | "Read on Google", verified Google Place ID, last synced date | Scraping, incentivizing, selectively soliciting positive reviews |
| Google Places API | Place details can return rating, userRatingCount, up to 5 reviews, Google Maps URI | Google Maps Platform API | Requires API key/billing/field masks; limited review sample | Enrich public profile with public rating summary | MVP can store Place ID, rating, count, Maps URL | Treating Places as full review-management system |
| Google Business Profile API | Can list/get/reply/delete reply for managed locations | Authorized business profile data | OAuth and business/location authorization required | Best for lawyers who authorize their own GBP | Future premium "connected Google profile" feature | Trying to access unmanaged lawyer profiles |

## What Users Need To See

For a legal visitor:
- Is this a real lawyer/profile?
- Are reviews available?
- Are the reviews from Google, Jus-Tice or another source?
- Are office details and fields clear?
- Does the lawyer publish useful content?
- Is the profile current?
- Is any paid placement disclosed?

For a lawyer:
- Can they claim/manage a profile?
- Can Google reviews be connected safely?
- Can Jus-Tice collect and moderate reviews?
- Can reputation signals improve conversion?
- Can this become a mini-site/product worth paying for?

## Reputation Signals To Support

Source-disclosed review signals:
- Google rating and review count, only with verified Place ID.
- Jus-Tice approved first-party reviews, only after moderation.
- External directory links, not copied content, unless rights/terms are clear.

Professional authority signals:
- public articles by or connected to lawyer.
- Q&A answers.
- verified office details.
- public practice areas.
- years of practice only if sourced.
- media/publications only if sourced.
- public cases only when appropriate and not misleading.

Platform engagement signals:
- profile completeness.
- response-time metric, only if measured.
- lead response rate, only inside dashboard unless public display is approved.
- review reply participation.
- profile update freshness.

## MVP Recommendation

Phase 1, no API:
- Add profile fields: Google Place ID, Google Maps review URL, Google rating, review count, last manually verified date.
- Show source-disclosed rating summary only when admin marks it verified.
- Add "Read reviews on Google" CTA.
- Add "No reviews shown yet" state rather than fake placeholders.
- Add review policy/disclosure pages.

Phase 2, first-party reviews:
- Create private `justice_review` CPT.
- Add review submission form after lead/contact completion.
- Moderation queue before public display.
- Privacy warning: no confidential facts, names, case numbers, children details, health details.
- Lawyer reply workflow after approval.

Phase 3, Google API:
- Places API for public summary fields where allowed.
- Business Profile API for authorized lawyers who grant OAuth access.
- Cache and store last sync date.

Phase 4, reputation dashboard:
- profile completeness.
- review source health.
- response metrics.
- monthly reputation report.
- AI-assisted summaries and response drafts, never fake reviews.

## Source Notes

- Google Business Profile API review data: https://developers.google.com/my-business/content/review-data
- Google Business Profile review resource: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews
- Google Places Place Details: https://developers.google.com/maps/documentation/places/web-service/place-details
- Google Places resource fields: https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places
- Google Maps user-generated content policy: https://support.google.com/contributionpolicy/answer/7400114
- Google review snippet structured data: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Avvo homepage/review model: https://www.avvo.com/
- Avvo rating policy: https://support.avvo.com/hc/en-us/articles/360013500772-What-is-the-Avvo-Rating-
- Justia Lawyer Directory: https://www.justia.com/lawyers
- Midrag: https://www.midrag.co.il/Home/
- LawReviews Israel: https://www.lawreviews.co.il/
- Israel lawyer advertising amendment PDF: https://cdn.the7eye.org.il/uploads/2018/03/advertising_rules_march_2018.pdf

## Status

VERIFIED: source-backed strategic research completed.  
NOT IMPLEMENTED: no code, database, schema, reviews, ratings, URLs or public lawyer cards were changed.
