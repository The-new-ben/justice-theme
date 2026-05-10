# Review Compliance Risk
Date: 2026-05-10  
Status: COMPLIANCE RISK DRAFT - NEEDS LEGAL REVIEW

## Hard Rules

- Do not create fake reviews.
- Do not create fake ratings.
- Do not invent "verified", "recommended", "top lawyer", "best lawyer", "trusted lawyer" or similar labels.
- Do not incentivize Google reviews.
- Do not selectively ask only happy clients for Google reviews.
- Do not scrape Google reviews.
- Do not copy private/sensitive client details.
- Do not publish reviews that expose confidential legal facts.
- Do not add AggregateRating schema until legal and SEO review approve it.
- Do not allow paid placement to change any trust/reputation score without explicit disclosure.

## Israeli Lawyer Advertising Notes

The 2018 advertising-rule amendment reviewed during this pass supports a cautious path:
- Lawyer advertising may include recommendations, thank-you letters and directory ratings, provided the information is not misleading.
- Photos/names of clients require written consent and must not be conditioned on legal services.
- Links should be directly connected to professional practice and not harm the dignity of the profession.
- Online contact forms must consider privacy-law duties.
- Paid professional articles/forums must be clearly disclosed as advertising.

Jus-Tice implication:
- Reviews can exist, but every review display must be source-disclosed, non-misleading and moderated.
- Any "featured" placement must be disclosed as paid/featured, not disguised as editorial recommendation.
- Client names should not be shown by default. Prefer initials or first name + last initial unless written consent is explicit.

## Google Policy Notes

Google Maps policy blocks:
- fake engagement.
- incentives for review posting, revision or removal.
- discouraging negative reviews.
- selectively soliciting positive reviews.
- conflict-of-interest reviews.
- asking users to include specific content.

Jus-Tice implication:
- "Leave a Google review" CTAs must be neutral.
- No coupons, discounts, upgraded listings, prizes or benefits for reviews.
- No pre-filled wording.
- No pressure during a meeting.

## Review Moderation Risks

Moderators must reject/hide reviews that include:
- children's names or family details.
- medical details.
- case numbers or identifying litigation details.
- allegations not needed for the review.
- defamation risk.
- hate, threats, doxxing or personal attacks.
- competitor/employee/family conflict risk.
- suspicious repeated wording or review bursts.

## Schema Risk

Do not publish review/rating structured data unless:
- the reviews are visible on the page.
- the rating is real.
- the markup exactly matches visible content.
- source and ownership are clear.
- legal/SEO review approves.

Google warns that reviews controlled by the reviewed entity can be ineligible for local-business/organization star features. Jus-Tice may be a third-party directory, but lawyer profiles are paid product pages, so self-serving review-risk analysis is mandatory before any markup.

## Required Public Policies

Before first review launch:
- Review policy.
- Review moderation policy.
- Review removal/correction request policy.
- Paid placement disclosure.
- Verification policy.
- Advertising disclosure.
- No legal advice disclaimer.
- Privacy policy update.

## Status Labels

- NEEDS LEGAL REVIEW: all public rating/review display rules.
- BLOCKED: Google API sync until API keys/OAuth/terms review.
- BLOCKED: AggregateRating schema until visible real reviews and policy approval.
- ACCEPTED: source disclosure and moderation must be MVP requirements.
