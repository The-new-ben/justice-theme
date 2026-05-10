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
