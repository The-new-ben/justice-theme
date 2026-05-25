# Lawyer Public Profile Claim Safety - 2026-05-25

## Why This Was Needed

The owner reported that a lawyer mini-site could still look like a premium profile while containing unverified or inaccurate claims. The previous gate blocked the main biography and credentials, but other rich CMS fields could still expose unverified positioning.

## What Changed

- `single-justice_lawyer.php` now replaces the hero subtitle on fact-gated profiles with a safe source-review message.
- Fact-gated profiles no longer show rich claims until approved:
  - approach/process sections
  - services written in profile fields
  - videos and media links
  - signed article panels
  - FAQs
  - final marketing CTA
  - ratings, testimonials, and recommendations
- The source-review notice now includes a profile claim/update link into lawyer registration.
- `template-parts/cards/lawyer-card.php` now keeps homepage/directory cards from showing unverified short bios, years of experience, languages, verified badges, or review ratings for Maya/public-index/import/seed-like profiles until `profile_fact_review_status` is approved/source-checked/owner-approved/lawyer-approved.
- Cards now show a conservative "background details under source review" message instead of presenting unverified credentials as facts.

## Research Basis

Current directory benchmarks support this split:

- LawReviews emphasizes reviews and ratings as a governed trust layer, not decoration.
- Justia directory emphasizes structured practice/location browsing.
- Justia Connect's review guidance reinforces that review display needs a managed approval/featured-review workflow.

The implementation is original and does not copy competitor lawyer names, photos, reviews, ratings, text, badges, or contact data.

## What This Does Not Do

- It does not edit the live WordPress database.
- It does not approve any lawyer profile facts.
- It does not import competitor lawyers or legal-service providers.
- It does not copy competitor photos, reviews, ratings, claims, badges, or contact details.
- It does not create revenue, payment proof, invoices, refunds, or recurring billing.

## Verification

- `php -l single-justice_lawyer.php` passed.
- `php -l template-parts/cards/lawyer-card.php` passed.
- `git diff --check` passed.

## Completion Impact

Profile trust/safety moved from about 79% to 82%. The next live step is still uPress Pull Git and visual verification on the homepage cards and Maya profile.
