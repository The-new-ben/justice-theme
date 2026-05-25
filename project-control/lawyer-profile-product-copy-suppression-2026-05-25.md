# Lawyer Profile Product Copy Suppression - 2026-05-25

## Why this was done
- The owner flagged that a lawyer mini-site must feel like the lawyer's own best-in-market profile, not like an advertisement for the Jus-Tice platform or other lawyers.
- The single lawyer profile did not render other lawyer cards inside the profile, but it did show a generic "active mini-site / what can be done through this profile" engagement overview.
- That block is useful as a product explainer, but it weakens the premium profile feeling during an investor/lawyer demo.

## Research signal checked
- Psakdin and LawReviews both center the user on lawyer discovery, profile detail, contact/reviews and topic navigation rather than explaining the platform inside every profile.
- Justia profile patterns emphasize profile fields such as contact information, education, associations, practice areas and online presence.
- Avvo's profile/claim model reinforces a split between unclaimed/basic records and claimed/enhanced profiles.
- Implementation is original and does not copy competitor profile text, photos, reviews, ratings, lawyer data or contact data.

## What changed
- The generic lawyer-profile engagement overview is now off by default.
- The profile still keeps the revenue-critical and visitor-critical sections: hero, profile facts when approved, services, areas, signed articles, verified reviews/recommendations, public sources and the inquiry form.
- A developer filter remains available: `justice_theme_show_lawyer_profile_engagement_overview`.

## Files changed
- `single-justice_lawyer.php`

## Verification needed
- PHP lint for `single-justice_lawyer.php`.
- After uPress Pull Git, visually check a lawyer profile and confirm the generic mini-site explainer no longer appears above the profile body.

## Revenue impact
- This does not create proven revenue.
- It improves the sales surface for lawyers because the profile now feels more like a dedicated professional mini-site and less like product marketing.

## Safety
- No CMS database write.
- No public profile facts imported.
- No competitor asset/content copy.
- No payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.
