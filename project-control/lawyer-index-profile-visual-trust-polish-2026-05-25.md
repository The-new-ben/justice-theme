# Lawyer Index/Profile Visual Trust Polish - 2026-05-25

## Why this was done
- Investor feedback said the lawyer index/profile surfaces still looked generic and visually unsafe.
- The owner also flagged a specific trust risk: imported/basic profiles must not look like verified premium mini-sites or display inaccurate facts.

## What changed
- Lawyer directory cards now carry explicit state classes for photo, initials, basic index, paid and fact-gated profiles.
- Card images now render through a dedicated `lawyer-card__photo` class with fixed sizing hints instead of relying on generic thumbnail markup.
- Premium pass 4 CSS now locks directory/homepage cards into stable portrait media slots, clamps long summaries, prevents image/text collisions, and gives fact-gated/imported profiles a deliberate initials treatment instead of fake-looking imagery.
- Fact-gated lawyer mini-sites now use the safe post title as the hero headline instead of an unverified custom marketing headline.
- Fact-gated lawyer mini-sites now hide the proof-number strip, avoiding dash/placeholder facts that can look like inaccurate credentials.
- CSS cache was bumped from `4.3.7` to `4.3.8`.

## Competitor research signal used
- LawReviews foregrounds verified reviews, real profile details, search by field/area/name, and clear profile creation/login paths.
- Psakdin combines lawyer cards with practice fields, contact details, articles/rulings/legal service surfaces and directory navigation.
- Din emphasizes broad category coverage, many indexed professionals, and city/practice navigation.
- The implementation is original and intentionally does not copy competitor profile text, photos, reviews, ratings, contact data, or lawyer data.

## Files changed
- `template-parts/cards/lawyer-card.php`
- `single-justice_lawyer.php`
- `assets/css/premium-pass-4.css`
- `inc/enqueue.php`

## Verification
- `php -l template-parts/cards/lawyer-card.php`
- `php -l single-justice_lawyer.php`
- `php -l inc/enqueue.php`

## Revenue impact
- This does not create proven revenue by itself.
- It improves investor/demo trust and lawyer conversion readiness by making the directory look more professional and reducing legal/trust risk around imported profiles.

## Remaining blocker
- Production still requires uPress Pull Git and visual browser verification.
