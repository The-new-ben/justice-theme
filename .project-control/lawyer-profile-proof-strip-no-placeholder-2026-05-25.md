# Lawyer Profile Proof Strip No Placeholder - 2026-05-25

## What changed
- Replaced the fixed lawyer profile proof strip with a dynamic proof list.
- Removed investor-facing placeholder dashes for missing years/license/review data.
- Fact-gated profiles now show only safe signals: profile status, practice area, city and public-source count when available.
- Verified/rich profiles can still show years, license number, verified status, approved rating and public-source count when those fields exist.
- Hardened proof strip CSS so long Hebrew labels and CMS values wrap inside cards.

## Why it matters
The owner flagged that unverified profiles can look fake or low quality when the page shows empty facts. This change makes the lawyer profile feel more like a controlled legal directory profile and less like a half-filled template.

## Research basis
Competitor profile patterns checked in the current workstream: Din, Psakdin, LawReviews, Avvo and Justia. Strong profiles show proof only where it exists and avoid making missing claims look like real facts.

## Verification
- `php -l single-justice_lawyer.php`
- `php -l inc/enqueue.php`

## Honest limitations
- This does not create or verify lawyer facts.
- This does not add real photos, reviews, rulings, media, payment, invoice, refund or revenue.
- Production will not show this until uPress pulls the latest commit.

## Safety
Repo display/CSS/docs only. No live CMS database edit, competitor profile import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.
