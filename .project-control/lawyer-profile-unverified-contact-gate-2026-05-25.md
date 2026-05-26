# Lawyer Profile Unverified Contact Gate - 2026-05-25

## Why this exists

The owner and investor flagged a trust problem: a public or imported lawyer profile can look like a real premium mini-site even when its facts, photo, education, contact details or social links have not been checked. That is dangerous for credibility and for legal/consumer trust.

## What changed

- `template-parts/cards/lawyer-card.php`
  - Fact-gated cards no longer show firm names as profile claims before fact review.
  - Fact-gated public/import/basic cards no longer expose direct phone or WhatsApp actions unless the source is trusted, the profile is paid/verified, or the facts are approved.
  - Claim/upgrade and safe profile-view paths remain available.

- `single-justice_lawyer.php`
  - Fact-gated mini-sites now suppress firm, languages, years, bar number, license status, address, email and social links before fact review.
  - The professional-details sidebox now renders only when at least one approved detail exists.
  - Area, city, public-source transparency and claim/update flow remain available.

## Research basis

- LawReviews emphasizes detailed profiles, focused filtering and review verification, including invoice/receipt based verification for some reviews.
- Justia positions lawyer profiles around claim, verification and updating by the attorney, with extensive information only when the profile is maintained.
- Justia's rating/review policy separates review/rating signals from advertising and requires attorney verification for peer review activity.

Sources checked:
- https://www.lawreviews.co.il/
- https://www.lawreviews.co.il/about
- https://www.justia.com/lawyers
- https://lawyers.justia.com/about-the-justia-lawyer-rating-reviews

## Honest boundary

This does not import competitor lawyers, photos, reviews, ratings or contact data. It makes the CMS-backed profile layer safer so future imported/basic cards can exist without pretending that unverified details are confirmed.

## Verification

Local verification passed:
- `php -l template-parts/cards/lawyer-card.php`
- `php -l single-justice_lawyer.php`
- `git diff --check`

Deployment verification is still pending until this patch is pushed and pulled on uPress.

## Safety

Theme display logic and docs only. No CMS database record, competitor asset/content, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting was changed.
