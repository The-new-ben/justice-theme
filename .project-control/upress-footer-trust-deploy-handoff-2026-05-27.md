# uPress Deploy Handoff: Footer Trust Path

Date: 2026-05-27
Owner loop status: resolved. The footer trust path is live and verified.

## What is ready

- Branch: `codex/live-homepage-conversion-release`
- Main: `main`
- Latest operational blocker commit: `a8d569c2 Document uPress Chrome deploy blocker`
- Footer code commit: `9c51a843 Add footer trust path`
- Expected theme version after deploy: `1.1.66`
- Expected deployment marker after deploy: `2026-05-27-footer-trust-path-v1`

## Current live verification

Live URL checked:

`https://jus-tice.co.il/?cachebust=deploy-check-1779914644`

Result:

- HTTP status: `200`
- New marker present: `true`
- Version `1.1.66` present: `true`
- `site-footer__trust-path` present: `true`
- `footer_trust_path` WhatsApp surface present: `true`
- Old marker `2026-05-27-mobile-menu-lead-actions-v1` present: `false`

Conclusion: the code is live.

## Blocker

Resolved for this footer deployment. The live site now passes the deployment marker checker. Chrome extension control may still need follow-up for future authenticated browser work, but it is no longer blocking this specific footer deployment.

## Resume steps

For future pulls:

1. Run `.project-control/scripts/check-live-deploy.ps1` with the expected marker/version/component.
2. Run mobile and desktop visual QA for the changed surface.
3. Record whether the change is live, blocked, or internal-only.

## Acceptance criteria

- The live site returns HTTP `200`.
- The new deployment marker is present.
- The footer trust path is present in live HTML.
- WhatsApp and form links exist in the footer trust path.
- No horizontal overflow on mobile.
- No public CMS settings, redirects, canonicals, noindex, sitemaps, or taxonomies were changed.

## Honesty statement

This footer trust path is published live and verified. No customer, payment, or revenue was created by this artifact.
