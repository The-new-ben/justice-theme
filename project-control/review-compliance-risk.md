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

## 2026-05-11 Compliance Addendum

Status: VERIFIED - policy-risk model documented.
Implementation status: NOT IMPLEMENTED.
Legal status: NEEDS LEGAL REVIEW before launch.

### No Review Gating

Jus-Tice must not build a flow that:
- asks the user how satisfied they are;
- sends only happy users to Google;
- routes unhappy users only to a private feedback form;
- asks users to revise or remove a negative review in exchange for anything;
- gives a lawyer plan benefit, discount, gift or promotion in exchange for a review.

Safe wording pattern:
- "You may leave honest feedback about your experience."
- "Please do not include confidential legal details, names of children, case numbers, health details or private settlement information."
- "Reviews are moderated for privacy, authenticity and legal risk."

Unsafe wording:
- "Leave a 5-star review."
- "Help us improve our rating."
- "Get a benefit after posting a review."
- "Only satisfied clients should post to Google."

### Minimum Review Display Disclosure

Draft only, legal/Hebrew review required before public use:

Reviews and ratings are shown according to Jus-Tice review and moderation policy. Review sources may include Google, Jus-Tice first-party reviews, and other disclosed public sources. A rating or review is not a guarantee of legal result, professional quality or suitability for a specific case. Paid placement, if active, is disclosed separately and does not create a professional recommendation.

### Moderation Gate

Every first-party review must pass these checks before publication:
- genuine interaction confirmation;
- privacy consent;
- no confidential legal facts;
- no personal identifying details that are not necessary;
- no names of children or sensitive family facts;
- no health data unless explicitly allowed and necessary, which should normally be rejected;
- no defamatory allegations beyond a fair service review;
- no competitor, employee, relative or conflict-of-interest review;
- no repeated wording pattern that suggests fake reviews;
- no AI-generated review text submitted by Jus-Tice or the lawyer.

### Lawyer Reply Gate

Lawyer replies must also be moderated because replies can reveal confidential facts. The safe default is:
- thank the reviewer;
- do not confirm representation details;
- do not discuss facts, strategy, documents, parties, children, settlements or court proceedings;
- invite private follow-up if needed.

### Schema Gate

AggregateRating and Review schema remain BLOCKED until all are true:
- real reviews are visible on the page;
- the displayed source and schema source match;
- the reviewed entity is clear;
- the page is not using self-serving markup in a way Google disallows;
- Israeli legal advertising/compliance review approves the display;
- Rich Results Test validation passes;
- Search Console monitoring is ready after launch.
