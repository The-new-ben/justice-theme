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
- Justia Legal Professional Directory: https://professionals.justia.com/
- FindLaw legal directory advertising: https://www.findlaw.com/lawyer-marketing/services/legal-directory-advertising/
- Midrag: https://www.midrag.co.il/Home/
- LawReviews Israel: https://www.lawreviews.co.il/
- Zap / Dapei Zahav: https://www.d.co.il/
- Podium reviews product: https://www.podium.com/product/reviews
- Birdeye reviews product: https://birdeye.com/reviews/
- ReviewTrackers enterprise reputation: https://www.reviewtrackers.com/enterprise/
- Israel lawyer advertising amendment PDF: https://cdn.the7eye.org.il/uploads/2018/03/advertising_rules_march_2018.pdf

## Status

VERIFIED: source-backed strategic research completed.  
NOT IMPLEMENTED: no code, database, schema, reviews, ratings, URLs or public lawyer cards were changed.

## 2026-05-11 Deep Research Addendum

Status: VERIFIED - desk research and product strategy only.
Implementation status: NOT IMPLEMENTED.

This addendum strengthens the module around the exact product question: how Jus-Tice can use reviews, ratings and reputation without faking trust, violating Google policies, or creating risky lawyer-advertising claims.

### Deep Platform Matrix

| Platform / source | Review and rating elements | First-party or third-party | Google reviews shown | Custom score | Profile completeness | Badges / labels | License / discipline data | Q&A / content authority | Contact CTA | Useful pattern for Jus-Tice | Avoid |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Avvo | Lawyer rating, client reviews, Q&A, profile detail | Avvo plus public licensing data | No native Google display observed | Yes, proprietary Avvo Rating | Strong profile claim/update flow | Rating bands, profile signals | Uses state bar/public data in US context | Strong Q&A | Yes | Separate "profile completeness" from user reviews | Copying the proprietary score or implying official quality |
| Justia | Lawyer profiles by practice, location, education, associations, contact data | Directory/profile data | Not a Google-review product | No universal Avvo-style score | Profile claim/update workflow | Directory/profile badges and profile status concepts | Public profile fields where available | Publications/profile content | Yes | Rich profile pages and claim flow | Thin profiles with no source disclosure |
| FindLaw / Martindale ecosystem | Directory profile, premium visibility, client/peer review concepts | Directory plus review ecosystem | Not the core feature | Peer/client rating concepts in Martindale layer | Premium profile upgrades | Peer review/client review labels | Professional-recognition style data | Articles/legal guides | Yes | Productize profile upgrades and trust signals | Mixing paid visibility with unbiased trust score |
| Midrag | Review counts, numeric scores, transparent category ratings | First-party user feedback | No | Yes, category-specific score | Not lawyer-specific | Trust/quality seal model | No lawyer license layer | Service-category pages | Yes | Transparent review count and source model | Using "recommended" lawyer language without Israeli legal review |
| Zap / Dapei Zahav style directories | Business listings, ratings/reviews where available, contact and category pages | Directory/user reviews | Sometimes links to external signals | Platform ratings where supported | Business listing completeness | Listing badges/ads may exist | No legal license model | Limited | Yes | Local directory UX, category and city filtering | Treating generic business reviews as legal authority |
| LawReviews Israel | Lawyer profiles and client reviews in Israeli legal context | Legal review platform | Not primary | Rating/review emphasis | Legal-profile detail | Practice/location signals | Legal-specific profile context | Limited | Yes | Israeli-lawyer review UX benchmark | Importing/copying reviews without permission |
| Google Business Profile | Public star rating, review count, review text, owner replies | Third-party Google | Source itself | Google rating only | Business profile completeness outside Jus-Tice | Google labels only | No lawyer license verification | Posts/photos can exist | Calls, directions, website | Link out and disclose source | Scraping, incentives, review gating, fake engagement |
| Google Places API | Place fields: rating, userRatingCount, Google Maps URI, limited reviews if requested | Google Maps Platform API | Yes through API terms | Google rating only | No | No | No | No | Maps URL | Fetch source-disclosed summary later | Treating limited Places reviews as full review management |
| Google Business Profile API | List/get/reply/delete replies for managed locations | Authorized business profile data | Yes, when lawyer authorizes profile access | Google rating/reviews | Managed profile context | No Jus-Tice badge | No | Owner replies | Owner-managed profile | Premium connected profile later | Accessing profiles without lawyer authorization |
| Podium / Birdeye / ReviewTrackers class | Review requests, review inbox, AI replies, sentiment/reporting | Multi-source reputation software | Often central feature | Dashboard scores | Account health dashboards | Product badges/reports | No legal-specific license layer | AI summaries possible | Messaging/lead features | Dashboard, alerts, response workflow, review request links | Review gating, aggressive solicitation, vendor lock-in |

### Product Lessons

1. A legal marketplace should not start with a public "best lawyer" score. Start with source-disclosed trust facts.
2. The safest first visible layer is: verified profile details, Google review link, optional manually verified Google rating/count, and "reviews not yet displayed" when no source is verified.
3. Jus-Tice first-party reviews require moderation before public display.
4. Reputation must be a product layer: review collection, profile completeness, source disclosure, response workflow, and monthly reputation report.
5. Ratings can improve conversion only if users understand where the rating came from and what it means.
6. Paid placement must never quietly change a trust score.
7. If paid ranking affects directory order, disclose it separately from review/rating quality.
8. Review content must avoid confidential legal facts, names of children, case numbers, settlement details, health facts and defamatory claims.
9. A lawyer can improve their profile by adding verified facts, articles, Q&A, public source links, media and profile completeness, not by buying a fake rating.
10. AI can summarize themes and draft replies, but must not create, rewrite or hide reviews deceptively.

### MVP Decision

Recommended MVP: source-disclosed reputation fields and display rules, not automated Google review import.

MVP includes:
- Google Place ID field.
- Google Maps review/profile URL field.
- manually verified Google rating and review count.
- last verified date.
- profile completeness score.
- review display enabled flag.
- review collection enabled flag.
- "Read reviews on Google" button.
- "No reviews displayed yet" empty state.
- internal admin notes and source proof.

MVP excludes:
- automated Google API sync.
- public AggregateRating schema.
- fake review placeholders.
- review snippets copied from Google.
- "verified", "recommended", "top" or "best" labels unless a written policy and legal review approve them.

### Research Gaps To Keep Open

- Israeli Bar advertising-rule interpretation for client reviews, paid placement and rating language.
- Whether first-party Jus-Tice lawyer reviews can be shown with stars, text or both.
- Whether paid profile pages should show review schema at all.
- Whether Google Places review excerpts are allowed in the chosen implementation and under the active Maps Platform terms.
- Whether lawyers will authorize Google Business Profile OAuth or prefer manual links.
- Whether Jus-Tice should build a native reputation dashboard or integrate a vendor later.

### Status Labels

VERIFIED: strategy and source-backed benchmark research.
NOT VERIFIED: Israeli legal/compliance signoff.
BLOCKED: Google API sync, GBP OAuth and schema deployment until credentials, terms review and legal approval exist.
NOT IMPLEMENTED: no public ratings, review CPT, schema, API sync or lawyer-card review UI was added.
