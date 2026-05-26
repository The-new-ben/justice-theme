# Homepage Lawyer Revenue Strip Honesty Pass - 2026-05-25

## Why this exists

The homepage lawyer revenue strip is investor-facing and lawyer-facing. It must sell the paid lawyer path without implying fake live activity. The previous strip used demo-like fixed wording such as a set number of leads and a payment link state. That could be read as live operational proof when confirmed revenue is still zero.

## What changed

- Reworded the three proof cards around real system capabilities:
  - CMS-controlled basic card visibility.
  - Verified profile facts/photos/reviews only after review.
  - Revenue path through upgrade, real payment link and lead dashboard.
- Replaced the mini-dashboard hard-coded live-like states with a path preview:
  - public card controlled by CMS,
  - Grow/Morning or manual invoice payment path,
  - personal area for leads, service and upgrades.

## Verification

Local verification passed:
- `php -l template-parts/sections/homepage-lawyer-revenue-strip.php`
- `git diff --check`
- text check confirmed the old hard-coded `3 בטיפול` and `קישור נשלח` states are gone.

## Safety

Template/docs only. No CMS database record, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, competitor content, GSC, GA4 or provider setting changed.
