# Live theme deployment mismatch - 2026-05-28

## Purpose

Record the deployment blocker after the mobile menu stability fix was committed and pushed.

## Expected repo state

- GitHub remote: `https://github.com/The-new-ben/justice-theme.git`
- Expected branch heads:
  - `main`: `bc78bf692f6bb9539b22fc25e39169bc7bc7410d`
  - `codex/live-homepage-conversion-release`: `bc78bf692f6bb9539b22fc25e39169bc7bc7410d`
- Expected commit subject: `Stabilize mobile menu drawer`
- Expected deployment marker: `2026-05-28-mobile-menu-stable-fixed-drawer-v2`
- Expected live JS token: `lockPageScroll`

## Read-only live checks

Checker:

`C:/Users/janana/jutice-theme/.project-control/scripts/check-live-theme-deployment-marker.ps1`

Live URLs checked:

- `https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt?codex_check=bc78bf692f6bb9539b22fc25e39169bc7bc7410d`
- `https://jus-tice.co.il/wp-content/themes/justice-theme/assets/js/navigation.js?codex_check=bc78bf692f6bb9539b22fc25e39169bc7bc7410d`

Observed result:

- `deployment-marker.txt`: HTTP 200, but still shows `2026-05-28-lawyer-retention-followup-completion-v1`.
- Live `navigation.js`: HTTP 200, length `2528`, missing `lockPageScroll`.
- Live `navigation.js`: missing `document.documentElement.classList.add`.
- `liveDeploymentMatchesCode`: `false`.

## uPress status

Chrome/uPress access worked and the Git panel was available under:

`https://my.upress.co.il/account/websites/jus-tice.co.il/filemanager#/wp-content/themes/justice-theme`

The panel showed Git actions for Pull, Status, and Log. After attempting Pull/Status/Log, the visible log still showed `HEAD -> main, origin/main` at `ce695fc9` and did not show `bc78bf69`.

## Classification

`DEPLOYMENT_BLOCKED_GIT_STATE_MISMATCH`

GitHub has the expected commit. The live public theme does not. uPress does not currently provide evidence that it pulled the expected GitHub commit.

## Safe next actions

- Verify the Git remote/branch configured inside the uPress Git panel before repeating deployment.
- If uPress is connected to a different repository or local server branch, switch only with owner approval.
- After a successful Pull, run the checker again and require `liveDeploymentMatchesCode = true`.
- Then run the mobile menu browser QA against the live site.

## Not changed

No CMS content, database rows, redirects, canonicals, noindex, sitemap, taxonomy, payment provider settings, invoices, leads, WhatsApp messages, or public content migrations were changed by this diagnostic.
