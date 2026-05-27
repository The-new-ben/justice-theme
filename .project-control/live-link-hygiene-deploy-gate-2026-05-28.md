# Live Link Hygiene Deploy Gate - 2026-05-28

Status: DEPLOYMENT_BLOCKER_RECORDED

Scope: read-only deployment gate for live public links that still expose legacy WordPress `?page_id=` URLs. No CMS/database menu item, redirect, canonical, noindex, sitemap, taxonomy, form, lead, payment, invoice, or uPress setting was changed.

## Why This Was Added

The live About issue was traced to rendered WordPress menu output:

```html
<a href="https://jus-tice.co.il/?page_id=315">אודות</a>
```

The theme-side runtime fix is already pushed in commit `0f20ad62`, but live HTML still shows the old link because the deployment marker `2026-05-28-menu-pageid-normalizer-v1` / version `1.1.68` is not live.

## Commands

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-link-hygiene.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-link-hygiene.ps1 -SkipLive
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-revenue-readiness-gate.ps1
```

## Current Evidence

- Source-only hygiene: PASS.
- Live hygiene: FAIL until deployment.
- Live pages still exposing legacy `page_id` link: `/`, `/about/`, `/contact/`, `/lawyers/`, `/lawyer-plans/`, `/lawyer-registration/`.
- Consolidated revenue gate remains `partial_live_funnel_deploy_blocked`.

## Gate Behavior

- `live_link_hygiene_deploy_check` is now included in `.project-control/scripts/check-revenue-readiness-gate.ps1`.
- It is not a profit-blocking check, because it does not prove or disprove payment readiness.
- It is a deployment blocker, because the public site still exposes a trust/UX issue that the pushed code is supposed to fix.

## What Remains Blocked

1. uPress Pull Git or equivalent deployment must make the latest theme code live.
2. After deployment, `node scripts/check-link-hygiene.mjs` must pass in live mode.
3. The live deployment marker must show `2026-05-28-menu-pageid-normalizer-v1` and version `1.1.68`.
4. This still does not prove customer conversion, lawyer payment, invoice issuance, or Grow/Meshulam payment settlement.

## Honesty Statement

This is a QA gate, not a revenue event. It makes the visible menu-link problem impossible to overlook in future readiness checks, but it does not publish the fix or prove the site generated money.
