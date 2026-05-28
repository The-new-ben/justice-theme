# uPress Git state mismatch gate - 2026-05-28

## Purpose

Record the refined deployment blocker after checking GitHub, the uPress-visible Git log, and the public theme files for the mobile menu fix.

## Expected state

- GitHub `main`: resolved dynamically by the checker from `git ls-remote --heads origin main`.
- GitHub `codex/live-homepage-conversion-release`: checked against the same resolved expected head.
- Last observed shared head before creating this gate: `962ca7da0c637166b76964acbfde92d904ce8fc0`.
- Mobile menu fix commit: `bc78bf69`
- Expected live deployment marker: `2026-05-28-mobile-menu-stable-fixed-drawer-v2`
- Expected live JS token: `lockPageScroll`

## Observed uPress state

- uPress Git panel was accessible in Chrome for `jus-tice.co.il`.
- Visible theme path: `/wp-content/themes/justice-theme/`
- Visible uPress log head: `ce695fc9`
- Visible uPress log subject: `Record mobile menu stable in place deployment`
- Local Git confirms `ce695fc9` is an ancestor of the expected GitHub head.
- Local Git confirms the expected GitHub head is not an ancestor of `ce695fc9`.

## Live public theme state

Read-only checks against:

- `https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt`
- `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/js/navigation.js`

Observed:

- Live marker still reports `2026-05-28-lawyer-retention-followup-completion-v1`.
- Live `navigation.js` does not contain `lockPageScroll`.
- Live `navigation.js` does not contain the current document-element drawer lock code.
- Therefore the public theme is not verified on the pushed mobile menu fix.

## Classification

`UPRESS_LOG_BEHIND_GITHUB_AND_LIVE_THEME_STALE`

GitHub contains the expected commits. The uPress-visible log is behind the expected head, and the public theme files still expose old code. This is a deployment/path/cache blocker, not a reason to rewrite the fix.

## Reusable checker

Checker:

`C:/Users/janana/jutice-theme/.project-control/scripts/check-upress-git-state-mismatch.ps1`

Latest verified output:

- `githubMainHasExpected`: `true`
- `githubReleaseHasExpected`: `true`
- `localContainsExpectedGithubHead`: `true`
- `localContainsObservedUpressHead`: `true`
- `observedIsAncestorOfExpected`: `true`
- `expectedIsAncestorOfObserved`: `false`
- `liveHasMenuFix`: `false`
- `liveMarkerCurrent`: `false`
- `classification`: `UPRESS_LOG_BEHIND_GITHUB_AND_LIVE_THEME_STALE`
- Expected exit code while blocked: `1`

## Safe next actions

- Do not force-push or manually upload theme files.
- Verify the uPress Git remote and branch configured for `/wp-content/themes/justice-theme/`.
- Verify whether uPress is serving the same document root that its Git panel controls.
- After uPress shows the current expected GitHub head or a later commit, rerun:
  - `.project-control/scripts/check-upress-git-state-mismatch.ps1`
  - `.project-control/scripts/check-live-theme-deployment-marker.ps1`
- Only claim deployment after the live checker proves the marker and `navigation.js` match the expected fix.
- Then run live mobile menu QA again on the public site.

## Not changed

No CMS content, database rows, redirects, canonicals, noindex, sitemap, taxonomy, payment settings, invoices, leads, WhatsApp messages, or public content migrations were changed by this diagnostic.

## Readiness impact

Estimated readiness to profit remains blocked at about `72%`: code and QA for the mobile menu fix are ready, but live deployment evidence is missing. Payment/Grow proof remains a separate blocker.
