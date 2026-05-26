# Homepage Lawyer Showcase Quality Gate - 2026-05-25

## Why This Was Needed

The investor noticed that the homepage lawyer area looked less professional than competitor directories and that unsafe/unverified profile material could appear too prominently. The homepage must be stricter than the full directory: it should promote profiles only when they are safe enough to represent the brand.

## What Changed

- `template-parts/sections/featured-lawyers.php` now checks whether a lawyer profile is safe for homepage promotion.
- Maya, seed/demo/test-like profiles, public-index profiles, and imported profiles are held back from the homepage unless their `profile_fact_review_status` is:
  - `approved`
  - `source_checked`
  - `owner_approved`
  - `lawyer_approved`
- The homepage value panel now shows an owner-visible quality note when profiles are held out of homepage promotion.
- `assets/css/premium-pass-4.css` adds a small styled quality-note block.
- `inc/enqueue.php` bumps `justice-premium-4` to `4.3.7`.

## Research Basis

- Din emphasizes broad legal directory coverage, reviews/recommendations, articles, forums, videos and contact paths.
- Justia emphasizes practice/location browsing and claim/update profile mechanics.
- The current Avvo criticism around scraper-style profile creation reinforces why imported/unclaimed profiles should not be homepage-promoted before review.

The implementation is original and does not copy competitor lawyer data, photos, reviews, ratings, profile text, badges, or contact details.

## What This Does Not Do

- It does not edit the live WordPress database.
- It does not approve any lawyer profile facts.
- It does not import competitor lawyers or legal-service providers.
- It does not copy competitor photos, reviews, ratings, claims, badges, or contact details.
- It does not create revenue, payment proof, invoices, refunds, or recurring billing.

## Verification

- `php -l template-parts/sections/featured-lawyers.php` passed.
- `php -l inc/enqueue.php` passed.
- `git diff --check` passed.
- Commit `17c9892` was pushed to `origin/main`.
- uPress Pull Git is still blocked from Codex because the in-app browser reports no active uPress pane, and the live Maya profile still serves the old unverified text until the server pulls.

## Completion Impact

Homepage lawyer showcase quality moved from about 68% to 74%. The remaining gap is visual live verification after uPress pulls the latest theme commit.
