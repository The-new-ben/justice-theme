# Public Basic Lawyer CMS Import Candidates - 2026-05-25

## Honest Status

- Current live public lawyer index: 1 public REST record and 1 visible directory card.
- Current live legal-service/supplier public index: not public.
- New candidate packet: 14 CMS-ready basic lawyer cards sourced from public competitor pages/search results.
- Not created in CMS yet: WordPress admin is blocked behind the uPress/F5 image-code challenge after credential submission.
- No reviews, ratings, photos, awards or copied profile text should be imported from competitors.

## CMS Field Model

Each candidate is designed for the existing `justice_lawyer` CMS post type:

- `post_type`: `justice_lawyer`
- `post_status`: `publish` only after owner/legal approval
- `profile_status`: `public`
- `source_type`: `public_index`
- `verification_status`: `unverified`
- `plan_type`: `free`
- `subscription_status`: `inactive`
- `source_url`: original public source URL
- public card label: `כרטיס בסיסי`
- card proof label: `כרטיס ציבורי לא מאומת`
- CTA: `תביעת כרטיס`

## Import Rule

These are not "joined lawyers" and not "recommended lawyers." They are public basic cards only.

Allowed display:

> כרטיס ציבורי בסיסי ממידע פומבי. לא מאומת ולא משויך לעורך הדין עד תביעת הכרטיס.

Not allowed:

- "מומלץ"
- "מאומת"
- copied LawReviews ratings/reviews
- copied PsakDin/LawReviews profile text
- copied headshots or logos
- active subscription status
- lead routing enabled before payment/claim

## Candidate Summary

| Source | Count | Main cluster |
| --- | ---: | --- |
| Jus-Tice existing live | 1 | Current CMS/public record |
| PsakDin public pages | 8 | Family/divorce lawyer cards |
| LawReviews public pages | 5 | Family/divorce lawyer cards |

## Revenue Expectation

This is a top-of-funnel directory acquisition move, not immediate revenue by itself.

Conservative first-wave expectation after 30 safe public cards and direct outreach:

- 30 public basic cards created.
- 20-30 outreach messages/calls.
- 3-6 serious claim/upgrade conversations.
- 1-2 paid pilots if payment link/invoice proof is ready.
- Expected first-month MRR: ₪490-₪2,980.

Aggressive but realistic with stronger sales follow-up:

- 100 public basic cards across family/divorce, medical malpractice and traffic.
- 60-80 outreach touches.
- 8-15 serious conversations.
- 3-5 paid accounts.
- Expected MRR: ₪1,470-₪7,450.

Do not promise revenue to the investor until at least one lawyer pays and the profile/dashboard/lead flow is proven.

## Legal Services / Supplier Index

The code already has an internal `justice_supplier` CMS type for services lawyers buy:

- expert witnesses / investigators
- legal marketing / video / branding
- legal tech / automation / CRM
- finance / accounting / tax
- translation / notary / apostille
- office rooms / meeting rooms
- courier / filing / court operations
- training / professional education

Current public state: not indexed publicly. Correct next move: create internal supplier records first, then publish public supplier cards only after partnership and disclosure review.

## What Blocks Live Creation

The CMS login flow reached a uPress/F5 image-code challenge. I cannot solve or bypass it. Once the owner enters the code in the browser, I can continue with the CMS record screen and create/import approved basic cards.

## Files

- Candidate CSV: `project-control/public-basic-lawyer-cms-import-candidates-2026-05-25.csv`
- Current live report: `project-control/live-cms-indexed-customers-2026-05-25.md`
- Screenshot proof: `project-control/visual-evidence/lawyer-directory-current-cms-cards-2026-05-25.png`
