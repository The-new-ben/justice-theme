# Lawyer Profile Fact Review Admin Control - 2026-05-25

## Why This Was Needed

The public fact gate protects visitors from unverified profile claims, but the owner also needs a clear CMS control to move a profile from "blocked for fact review" to "safe to show premium facts" after source checking or lawyer approval.

## What Changed

- `inc/lawyer-visibility.php` now defines a controlled `profile_fact_review_status` status list:
  - `pending`
  - `source_checked`
  - `owner_approved`
  - `lawyer_approved`
  - `approved`
  - `hold`
  - `rejected`
- The lawyer edit sidebar now has a "Fact review for premium profile facts" selector.
- The wp-admin lawyer list now shows a `Facts:` badge in the `Jus-Tice control` column.
- The lawyer list now has an `All fact review states` filter, including pending/blank profiles.
- Bulk actions now support:
  - `Jus-Tice: facts source checked`
  - `Jus-Tice: hold facts/promotion`
- The trust gate now treats Maya, seed, public-index, and imported profiles as `hold` until profile facts are approved.

## Competitor-Informed Standard

The direction follows the profile-quality pattern seen in leading directories: profile pages need clear specialties, sourceable credentials, reviews only when review governance is real, claim/update paths for lawyers, and prominent contact actions. The implementation is original and deliberately avoids copying competitor profile text, photos, ratings, reviews, badges, or lawyer data.

## What This Does Not Do

- It does not edit the live WordPress database.
- It does not approve any specific lawyer's facts.
- It does not import lawyers from competitor sites.
- It does not copy competitor photos, reviews, ratings, claims, badges, or contact data.
- It does not create revenue, payment proof, invoices, refunds, or recurring billing.

## Verification

- `php -l inc/lawyer-visibility.php` passed.
- `git diff --check` passed.
- Commit `4d99a93` was pushed to `origin/main`.
- uPress Pull Git is still blocked from Codex because the in-app browser reports no active uPress pane, and the live Maya profile still serves the old unverified text until the server pulls.

## Completion Impact

Profile trust/safety moved from about 76% to 79%. The next live step is pulling Git on uPress and checking that the lawyer edit screen and lawyer list expose the new fact-review control.
