# Homepage Legal Router Flow Live QA - 2026-06-06

## Public Review URL

- https://jus-tice.co.il/

## Change Applied

- Commit: `64b63807fad31757c316462dca2468dff62c0ab8`
- Branch pushed: `codex/live-homepage-conversion-release`
- Main pushed: `main`
- uPress Git pull: completed successfully for `/wp-content/themes/justice-theme/`
- Theme marker now live: `2026-06-06-homepage-legal-router-flow-v1`

## Content Summary

The active homepage template now includes two existing competitor-informed sections directly after the customer intake strip:

- `homepage-legal-service-flow`: explains the flow from first inquiry to a clearer next step.
- `homepage-legal-help-router`: routes users by legal situation before asking them to browse lawyers or submit a lead.

This applies Lawhive-style process clarity and din.co.il-style broad legal routing without copying competitor wording, adding fake reviews, promising outcomes, or changing CMS content.

## Verification

- PHP lint passed:
  - `page-home.php`
  - `functions.php`
  - `inc/enqueue.php`
  - `template-parts/sections/homepage-legal-help-router.php`
  - `template-parts/sections/homepage-legal-service-flow.php`
- `git diff --check` passed, with Git line-ending warnings only.
- Pre-deploy live marker check failed as expected because the old marker was still live.
- Post-deploy live marker check passed:
  - marker status: 200
  - navigation status: 200
  - CSS status: 200
  - marker matched expected value
  - mobile menu scroll-lock token still present
  - accessibility-toolbar layering CSS token still present

## Live Visual QA

Desktop `1440x1200`:

- H1 present: "צריכים עזרה משפטית? התחילו ממה שקרה לכם עכשיו"
- Service flow visible: yes
- Service steps: 4
- Service CTAs: 2
- Legal help router visible: yes
- Router cards: 6
- Router intake links: 6
- Horizontal overflow: no

Mobile `390x1200`:

- H1 present: "צריכים עזרה משפטית? התחילו ממה שקרה לכם עכשיו"
- Service flow visible: yes
- Service steps: 4
- Service CTAs: 2
- Legal help router visible: yes
- Router cards: 6
- Router intake links: 6
- Horizontal overflow: no

Evidence screenshots:

- `.project-control/visual-evidence/live-2026-06-06-homepage-legal-router-flow-desktop-service-flow-viewport.png`
- `.project-control/visual-evidence/live-2026-06-06-homepage-legal-router-flow-desktop-router-viewport.png`
- `.project-control/visual-evidence/live-2026-06-06-homepage-legal-router-flow-mobile-service-flow-viewport.png`
- `.project-control/visual-evidence/live-2026-06-06-homepage-legal-router-flow-mobile-router-viewport.png`

## Self-Review

The change improves the revenue path by making the homepage less like a passive directory and more like a public legal intake surface. It gives users a clearer path from "what happened" to either a guide, lawyer search, or structured inquiry. It is narrow and safe because it reuses existing section templates and styles.

Main residual risk: the mobile sticky contact/header UI covers part of the viewport while scrolling through long cards. The sections remain visible and usable, but a later mobile polish pass should improve breathing room around sticky controls.

## Related Pages To Inspect For Linkage Or Consolidation

- `/lawyers/`
- `/articles/`
- `/practice-areas/`
- `/criminal-defense-attorney/`
- `/divorce-lawyer/`
- `/family-law/`
- `/national-insurance/`
- `/lawyer-selection-guide/`

These pages are associated with the new router and should be inspected before further content expansion to avoid duplicate or cannibalizing local/practice pages.

## Not Changed

- No CMS/database publishing.
- No redirects.
- No canonicals.
- No noindex or robots changes.
- No sitemap changes.
- No taxonomy changes.
- No payment or invoice changes.
- No lead records were created.

## Remaining Blockers

- Grow/Meshulam KYC and payment readiness remain blocked until the owner confirms provider status.
- CRM-to-billing and manual invoice smoke tests remain incomplete.
- The full din.co.il forwarded email body is still not available through the current Gmail snippet-only access.
- External AI review packets have not been manually run in the owner's paid web accounts.

## Readiness To Profit

- Estimated readiness to profit after this cycle: 78%.
- Reason: homepage conversion clarity improved live, uPress deployment path is working, and live QA passed. Payment readiness and CRM-to-billing proof still block full paid conversion confidence.
