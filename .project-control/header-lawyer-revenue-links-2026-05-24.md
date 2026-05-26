# Header Lawyer Revenue Links - 2026-05-24

## Goal
Make the lawyer subscription path visible from the top of the site, not only inside homepage sections or footer links.

## Research Signal
- Justia sells lawyer visibility through attorney profiles and paid premium placements by practice area and metro area.
- Clio frames intake and reporting around a dashboard/portal where firms can see what drives revenue and follow-up work.

## What Changed
- The desktop header paid-lawyer CTA now reads `מסלולים לעורכי דין` instead of the vaguer `לעורכי דין`.
- The dashboard/login CTA now reads `אזור אישי` instead of only `כניסה`.
- Mobile keeps compact labels, `מסלולים` and `כניסה`, so the sticky header remains usable on smaller screens.
- The live revenue funnel checker now verifies the clearer homepage/header text and the CSS markers that swap full/short labels.

## Verification
- Local PHP syntax check passed for `template-parts/layout/site-header.php`.
- Local Node syntax check passed for `tools/check-live-lawyer-revenue-funnel.mjs`.
- `git diff --check` passed with only existing line-ending warnings.
- Committed and pushed: `090aa6c Clarify header lawyer revenue links`.
- uPress Git pull completed for `wp-content/themes/justice-theme`; uPress log showed `090aa6c` as live `HEAD`.
- Live read-only revenue funnel check passed `8/8`.

## Owner Meaning
Lawyers now see a clearer top-of-site path to paid plans and their personal area. This supports manual outreach and reduces the chance a prospect reaches the site and misses the subscription path.

## Still Blocked
Automated recurring lawyer payments remain blocked until Grow/Meshulam approval and gateway/product mapping are complete.

## Safety
Theme display/CSS/checker changes and read-only live verification only. No CMS database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, charge, invoice, lawyer record, lead, CRM, email/SMS, GSC or GA4 setting was changed.
