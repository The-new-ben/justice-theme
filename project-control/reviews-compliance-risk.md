# Reviews Compliance Risk

Date: 2026-05-11
Status: CANONICAL ALIAS / SUMMARY - NOT IMPLEMENTED
Canonical detailed file: `project-control/review-compliance-risk.md`

This file exists because the owner request used both `reviews-compliance-risk.md`
and `review-compliance-risk.md`. The singular file remains the detailed
compliance register. This plural file is the owner-facing summary so the
required output list does not look incomplete.

## Scope

This review/reputation module affects lawyer profiles, mini-sites, directory
cards, Google review links, first-party Jus-Tice reviews, reputation summaries,
paid lawyer products, schema, and lead conversion.

No public review, rating, badge, schema, or reputation score should be launched
until the compliance gates below are satisfied.

## Non-Negotiable Rules

- No fake reviews.
- No fake ratings.
- No invented "verified", "recommended", "top lawyer", "best lawyer", or
  similar trust labels without a documented rule and approval.
- No incentivized Google reviews.
- No copying or scraping Google reviews unless the chosen integration path and
  Google terms allow it.
- No private client facts, confidential legal details, or sensitive case
  details in public reviews.
- No AggregateRating or Review schema unless the ratings/reviews are real,
  visible on the same page, source-disclosed, technically accurate, and approved
  by legal/SEO review.
- Paid placement must be disclosed separately from reputation signals.
- Lawyer replies must be moderated for privacy, confidentiality, and defamatory
  or misleading statements.

## MVP Compliance Position

The safest first release is not a full ratings system.

Recommended MVP:

- Add lawyer profile fields for Google Place ID, Google review URL, rating
  source, rating count, last verified date, and review display status.
- Display a "Read reviews on Google" button only when the public Google profile
  URL is verified.
- Display rating summary only when the source is verified and the value can be
  maintained accurately.
- Keep Jus-Tice first-party reviews behind moderation until review policy,
  consent language, privacy warnings, admin workflow, and takedown process are
  approved.
- Do not publish review schema in the MVP.

## Required Approval Gates

Before public launch:

- Review policy approved.
- Privacy warning approved.
- Moderation workflow approved.
- Review removal/correction workflow approved.
- Paid placement disclosure approved.
- Verification policy approved.
- Schema policy approved.
- Israeli lawyer advertising / ethics review completed.
- Google review integration path approved.

## Launch Blockers

- NEEDS LEGAL REVIEW: Israeli lawyer advertising and testimonials.
- NEEDS OWNER REVIEW: whether Jus-Tice should show star ratings at all in the
  first release.
- NEEDS TECHNICAL REVIEW: Google Places / Business Profile API terms, billing,
  OAuth, and caching requirements.
- NEEDS SEO REVIEW: whether review schema is eligible and safe for this site.

## Related Files

- `project-control/reviews-reputation-research.md`
- `project-control/review-compliance-risk.md`
- `project-control/google-reviews-integration-plan.md`
- `project-control/lawyer-rating-system-spec.md`
- `project-control/lawyer-review-fields.csv`
- `project-control/review-schema-policy.md`
- `project-control/reputation-product-roadmap.md`
- `project-control/maya-rotenberg-reputation-plan.md`

## Current Decision

DOCUMENTED: The review/reputation system is a major product and trust module.

NOT IMPLEMENTED: No public review UI, no fake ratings, no reputation score, no
review schema, and no Google review sync have been implemented from this file.

NEXT ACTION: Use the documented MVP fields and compliance gates when the lawyer
mini-site implementation moves from planning to code.
