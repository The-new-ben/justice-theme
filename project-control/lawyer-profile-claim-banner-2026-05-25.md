# Lawyer Profile Claim Banner - 2026-05-25

## What changed
- Added a compact claim/update banner in the lawyer profile hero for basic, unverified or fact-gated profiles.
- The banner links to the existing lawyer registration/claim path with the profile id and source attribution.
- Paid profiles do not show the banner.
- Added responsive CSS for the banner and bumped `premium-pass-4.css` to `4.4.2`.

## Why it matters
The owner wants profiles to convert lawyers into customers while keeping profile pages professional. This follows the directory pattern used by major legal directories: a lawyer can claim/update the profile, add richer proof, and then choose upgraded placement.

## Research basis
Checked Justia's claim-profile and premium-placement language and Avvo's profile-claim/rating behavior, alongside the earlier Din, Psakdin and LawReviews profile-pattern review. This implementation is original and does not copy competitor text or data.

## Verification
- `php -l single-justice_lawyer.php`
- `php -l inc/enqueue.php`

## Honest limitations
- No email was sent and no lawyer/customer was created.
- No payment or upgrade was completed.
- This improves conversion path readiness only; revenue remains unproven until a real lawyer claims/upgrades and pays.

## Safety
Repo display/CSS/docs only. No live CMS database edit, lawyer/customer/provider creation, competitor import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.
