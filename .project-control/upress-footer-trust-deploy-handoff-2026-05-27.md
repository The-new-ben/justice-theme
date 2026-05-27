# uPress Deploy Handoff: Footer Trust Path

Date: 2026-05-27
Owner loop status: blocked on uPress access through the Codex Chrome extension.

## What is ready

- Branch: `codex/live-homepage-conversion-release`
- Main: `main`
- Latest operational blocker commit: `a8d569c2 Document uPress Chrome deploy blocker`
- Footer code commit: `9c51a843 Add footer trust path`
- Expected theme version after deploy: `1.1.66`
- Expected deployment marker after deploy: `2026-05-27-footer-trust-path-v1`

## Current live verification

Live URL checked:

`https://jus-tice.co.il/?cachebust=footer-trust-20260527-2021`

Result:

- HTTP status: `200`
- New marker present: `false`
- Version `1.1.66` present: `false`
- `site-footer__trust-path` present: `false`
- Old marker `2026-05-27-mobile-menu-lead-actions-v1` present: `true`

Conclusion: the code is pushed to GitHub, but the live site has not pulled it yet.

## Blocker

Chrome is running and the configured `Profile 2` was opened. The Codex Chrome extension and native host checks pass, but Codex still cannot acquire the Chrome extension browser:

`Browser is not available: extension`

The connected uPress session depends on Chrome control, so Pull Git cannot be executed from this loop until the Codex Chrome plugin connection is repaired, or until the owner manually runs the uPress pull.

## Resume steps

1. Repair/reinstall the Codex Chrome plugin from the Codex plugin UI, or manually complete the uPress pull.
2. Open uPress for `jus-tice.co.il`.
3. Go to Git management for `wp-content/themes/justice-theme`.
4. Run `Pull Git`.
5. Run status check in uPress and confirm the worktree is clean.
6. Re-check the live homepage for:
   - `2026-05-27-footer-trust-path-v1`
   - `1.1.66`
   - `site-footer__trust-path`
7. Run mobile and desktop visual QA for the footer.

## Acceptance criteria

- The live site returns HTTP `200`.
- The new deployment marker is present.
- The footer trust path is present in live HTML.
- WhatsApp and form links exist in the footer trust path.
- No horizontal overflow on mobile.
- No public CMS settings, redirects, canonicals, noindex, sitemaps, or taxonomies were changed.

## Honesty statement

This is not published yet. It is a deployment handoff only. No customer, payment, or revenue was created by this artifact.
