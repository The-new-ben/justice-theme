# Lawyer Mini-Site Strategy

Date: 2026-05-10  
Status: STRATEGY V1 - no live profile changes executed

## Goal

A lawyer mini-site should feel strong enough that a real lawyer wants one. It should be a professional profile, content hub and lead-conversion page, not a thin directory card.

## User Jobs

Potential client:
- understand who the lawyer is.
- see practice areas, city/office, language and contact options.
- read relevant guides or FAQs.
- know what to prepare before contacting the office.

Lawyer:
- show professional presence without exaggerated claims.
- receive relevant leads.
- connect articles and expertise to the profile.
- see value in a paid profile/mini-site package.

## Required Sections

Each mature mini-site should support:
- name.
- firm.
- professional photo or approved placeholder.
- firm logo if available.
- practice areas.
- cities served.
- languages.
- bio.
- services.
- office/contact details.
- legal articles connected to the lawyer.
- FAQ.
- related pillar pages.
- related public legal guides.
- lead form and phone/WhatsApp CTAs.
- disclosure/trust section.
- review/reputation section with source-disclosed ratings only.
- Google review link if verified.
- first-party Jus-Tice reviews only after moderation workflow exists.
- profile completeness indicator in admin.
- schema where appropriate.

## Content Safety

Do not claim:
- verified, recommended, best, leading, success rate or client satisfaction unless true, documented and approved.
- public achievements, cases or media appearances unless sourced.
- bar/license details unless verified from public/owner-approved sources.
- ratings, reviews, "Google score" or "recommended" status unless source-disclosed and approved.

## Review / Reputation Module

Status: STRATEGY ADDED / NOT IMPLEMENTED

Mini-sites should eventually support:
- Google Place ID and "Read reviews on Google" link.
- Google rating/count only if verified.
- Jus-Tice first-party reviews after moderation.
- profile completeness score.
- source verification status.
- review-source disclosure.
- review policy and privacy warning.
- lawyer reply workflow after approval.

Do not add `AggregateRating` schema until `project-control/review-schema-policy.md` approval gates are met.

Reference files:
- `project-control/reviews-reputation-research.md`
- `project-control/google-reviews-integration-plan.md`
- `project-control/lawyer-rating-system-spec.md`
- `project-control/lawyer-review-fields.csv`
- `project-control/maya-rotenberg-reputation-plan.md`

## Cluster Integration Examples

Family-law lawyer:
- `/divorce-lawyer/`
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/child-support/`
- `/child-custody/`
- `/divorce-property-division/`

Criminal-law lawyer:
- `/criminal-lawyer/`
- `/police-investigation/`
- `/indictment/`
- `/pretrial-detention/`
- `/drug-offenses/`
- `/sex-offenses/`

## Maya Rotenberg MVP

Maya's mini-site is the proof-of-product profile. It should be enriched only with sourced or owner-approved facts. Any public source notes belong in `project-control/maya-rotenberg-public-source-audit.md`, not in the public profile body.

Reputation prototype:
- use Maya only with source-verified review/profile data.
- do not show stars or Google rating until Place ID/rating/count are verified.
- add review block as empty/source-disclosed state first.
- see `project-control/maya-rotenberg-reputation-plan.md`.

## Analytics

Track:
- `lawyer_profile_view`
- `lawyer_card_click`
- `phone_click`
- `whatsapp_click`
- `generate_lead`
- `article_cta_click` from lawyer-connected articles

Status: PLANNED. Event implementation remains NOT VERIFIED live.
