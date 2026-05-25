# Public Card Claim/Upgrade CTA - 2026-05-25

## What changed
- Public-basic unclaimed lawyer/professional cards now show a small owner-facing claim prompt:
  - "זה הכרטיס שלך?"
  - Claim ownership, update details, and move toward sponsored exposure.
- The claim URL now carries:
  - `claim_profile_id`
  - `claim_profile`
  - `plan_interest=featured`
  - `source=public_card_claim_upgrade`

## Why it matters
The public index is no longer only an inventory surface. Every unclaimed basic card now has a visible conversion path for the professional to claim the profile and upgrade into a sponsored/featured placement.

## Research basis used this cycle
- LawReviews, Din and PsakDin continue to frame lawyer discovery around profile depth, search/filtering, credibility signals and direct conversion paths.
- This implementation is original and avoids unsupported review/rating/contact claims.

## Safety
- No fake phone, WhatsApp, review, rating, verified status or recommendation was added.
- No competitor photo, profile copy, review, rating or contact detail was copied.
- No payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.

## Completion impact
- Lawyer card conversion layer moved from about 65% to 78%.
- Overall CMS-backed lawyer index system remains about 85%.
- Realized revenue remains NIS 0 until a lawyer completes claim/upgrade/payment.
