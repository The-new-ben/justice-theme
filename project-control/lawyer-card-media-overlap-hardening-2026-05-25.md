# Lawyer Card Media Overlap Hardening - 2026-05-25

## Why this was done
- The owner flagged an investor-visible problem: lawyer-card images could look disproportionate and appear to cover or crowd card text.
- The risk is highest with CMS-managed media because an uploaded photo may be wide, tall, cropped poorly, or paired with a long lawyer name, status badge or CTA.

## Research signal checked
- Psakdin directory pages show lawyer cards with image, name, phone/address and long practice-area lists, so card layout must tolerate dense text.
- LawReviews emphasizes filtered lawyer discovery, recommendations/reviews and profile trust, so a card must look controlled before asking a lawyer to upgrade.
- Justia and Avvo patterns reinforce that public/basic profiles should be clearly separable from claimed or completed lawyer profiles.
- Implementation is original. No competitor lawyer data, photos, reviews, ratings, phone numbers, text or profile facts were copied.

## What changed
- Tightened the existing lawyer-card portrait slot so media stays clipped inside the card.
- Added text containment for long lawyer names, badges, metadata, summaries and claim-upgrade blocks.
- Added button wrapping rules so CTA labels cannot widen or break the card.
- Bumped `premium-pass-4.css` from `4.3.8` to `4.3.9` so uPress/browser cache has a new asset version after pull.

## Files changed
- `assets/css/premium-pass-4.css`
- `inc/enqueue.php`

## Verification needed
- Local static checks: PHP lint for enqueue and CSS diff check.
- After uPress Pull Git: visually check `/lawyers/?justice_readonly=1` and the homepage lawyer showcase on desktop/mobile.

## Revenue impact
- This does not create revenue proof.
- It reduces demo embarrassment risk and improves the trust surface for lawyer upgrade outreach.

## Safety
- No CMS database write.
- No public content import.
- No competitor asset/content copy.
- No payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.
