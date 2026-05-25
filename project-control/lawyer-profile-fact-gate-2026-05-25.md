# Lawyer Profile Fact Gate - 2026-05-25

## Why This Was Needed

The owner reported that the Maya Rotenberg mini-site was showing inaccurate background material, including an education claim. A read-only live check confirmed the public profile HTML still contained `אוניברסיטת` inside the free-form biography area.

## What Changed

- `single-justice_lawyer.php` now treats Maya, seed data, and imported/public-index profiles as fact-gated profiles.
- Free-form biography text, credential lists, placeholder article panels, placeholder review panels, and mini-site marketing modules are hidden until the CMS has a source-check signal:
  - `profile_fact_review_status=approved`
  - `profile_fact_review_status=source_checked`
  - `profile_fact_review_status=owner_approved`
  - `profile_fact_review_status=lawyer_approved`
- The public profile status no longer says `מאומת` for fact-gated profiles unless the profile is also source-checked.
- The page shows a restrained factual notice instead of unverified education, credentials, rankings, reviews, or success claims.
- `assets/css/premium-pass-4.css` adds a polished trust-gate notice style.
- `inc/enqueue.php` bumps `justice-premium-4` to `4.3.6` so browsers fetch the updated CSS after deployment.

## What This Does Not Do

- It does not edit the live WordPress database.
- It does not delete Maya's CMS content; it prevents risky free-form facts from being displayed publicly until approved.
- It does not copy competitor photos, reviews, ratings, claims, or contact data.
- It does not create revenue, payment proof, invoices, refunds, or recurring billing.

## Verification

- `php -l single-justice_lawyer.php` passed.
- `php -l inc/enqueue.php` passed.
- `git diff --check` passed.

## Completion Impact

Profile trust/safety moved from about 72% to 76%. The biggest remaining work is live post-pull verification that Maya's public page no longer contains the unverified education claim, plus CMS owner review for any profile that should become fully premium.
