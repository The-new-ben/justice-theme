# Review Schema Policy
Date: 2026-05-10  
Status: POLICY DRAFT - DO NOT IMPLEMENT SCHEMA YET

## Decision

Do not add `Review` or `AggregateRating` schema to lawyer pages yet.

Reason:
- No verified Jus-Tice reviews exist yet.
- Google review data is not connected through an approved API path.
- Lawyer pages may be paid mini-site/product pages, creating self-serving review risk.
- Schema must match visible real content.

## Allowed Now

Existing lawyer/profile schema may include:
- `Person` / `Attorney` / `LegalService` basics where supported.
- name.
- URL.
- practice areas.
- office/city when verified.
- sameAs links when sourced.

Do not include:
- aggregateRating.
- review.
- fake star rating.
- "best" or "recommended" claims.

## Future Approval Conditions

Before adding review markup:
1. Reviews are real.
2. Reviews are visible on the page.
3. Reviews are moderated and privacy-safe.
4. Ratings are calculated from approved visible reviews.
5. Google reviews are not marked as Jus-Tice first-party reviews.
6. Source disclosure is visible.
7. Legal/compliance review approves lawyer advertising implications.
8. SEO review approves Google rich-result eligibility.
9. Rich Results Test is passed on staging/public URL.
10. Paid placement disclosure is visible if relevant.

## Google-Specific Caution

Google supports review snippets for certain types and warns that entity-controlled reviews for `LocalBusiness` or `Organization` can be ineligible for star review features. Jus-Tice is a third-party directory, but lawyer profile pages may be paid/managed by the lawyer, so each schema decision needs an explicit self-serving review analysis.

## Schema Types To Reconsider Later

- `Review`
- `AggregateRating`
- `Person`
- `LegalService`
- `LocalBusiness`
- `Organization`
- `FAQPage`

## Policy For Google Reviews

If displaying Google review summary:
- show it as Google-sourced.
- link to Google.
- do not copy Google text unless terms review allows it.
- do not mark Google reviews as Jus-Tice reviews.
- do not include Google reviews in Jus-Tice AggregateRating unless legal/SEO approves the exact implementation.

## Status

BLOCKED: review schema is blocked until real review data, compliance approval and visible page UX exist.

## 2026-05-11 Schema Addendum

Status: BLOCKED - intentionally not implemented.

### Extra Guardrails

Do not add `AggregateRating` or `Review` schema because the product documents mention reviews. Schema is allowed only after:
- the public page visibly displays the same review/rating facts;
- the source of each rating is clear;
- Google reviews are not represented as Jus-Tice first-party reviews;
- first-party reviews have moderation and privacy controls;
- paid placement is disclosed if relevant;
- legal review confirms the display is acceptable for lawyer advertising;
- SEO review confirms eligibility and self-serving review risk;
- a public URL passes Rich Results Test;
- Search Console monitoring is ready after launch.

### MVP Schema Decision

MVP review/reputation module should use no review schema. Use normal profile/entity schema only:
- lawyer name;
- profile URL;
- practice areas;
- city/office information when verified;
- sameAs links when source-reviewed.

Rating facts can be visible to users before they are marked up for rich results. That is safer than forcing schema too early.
