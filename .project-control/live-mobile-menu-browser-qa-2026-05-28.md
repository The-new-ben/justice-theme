# Live Mobile Menu Browser QA - 2026-05-28

Status: QA_HARNESS_READY_LIVE_DEPLOYMENT_BLOCKED

Scope: read-only Playwright browser QA for the public live homepage mobile menu. No CMS/database menu item, redirect, canonical, noindex, sitemap, taxonomy, form, lead, CRM record, WhatsApp message, payment, invoice, or uPress setting was changed.

## Why This Was Added

The source-side mobile menu stability gate proves the code avoids the previous dynamic hamburger-position bug. A live browser check is still needed after uPress deployment because the owner reported a visible mobile menu problem, and the mobile menu carries revenue actions:

- WhatsApp lead action.
- Phone/contact action.
- Lawyer-plan action.

## New Checker

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-live-mobile-menu-browser-qa.ps1
```

The checker uses anonymous Playwright CLI automation to:

- open the public homepage at a 390x844 mobile viewport,
- tap the hamburger button,
- verify the menu opens,
- verify mobile revenue actions are visible,
- verify the live deployment marker/version,
- verify primary navigation link hygiene,
- save an open-menu screenshot under `output/playwright/`.

## Current Live Result

Run time: 2026-05-27T23:43Z.

Result: FAIL as expected until uPress Pull Git.

Failed checks:

- `live_marker_present`
- `live_version_present`
- `no_legacy_page_id_in_menu`

Passed functional checks:

- Hamburger click set `aria-expanded="true"`.
- Primary navigation became visible.
- Mobile action panel became visible.
- Mobile WhatsApp action was present.
- Lawyer-plan action was present.
- Close button stayed inside the mobile viewport.
- Open-menu screenshot was created.

Evidence screenshot:

- `output/playwright/live-mobile-menu-open-1779925434.png`

## Interpretation

The live mobile menu currently opens and exposes revenue actions, but it is still not the latest pushed code. The public site still lacks marker/version `2026-05-28-mobile-menu-stability-v1` / `1.1.69`, and the live primary navigation still exposes a legacy `page_id` link.

## What Remains Blocked

1. uPress Pull Git must deploy the latest theme code.
2. Re-run `check-live-deploy.ps1`.
3. Re-run `check-live-link-hygiene.ps1`.
4. Re-run `check-live-mobile-menu-browser-qa.ps1`.
5. Only after those pass can the mobile menu fix be considered live-verified.

## Honesty Statement

This is a browser QA harness and evidence capture, not a deployment and not a revenue event. It proves the post-deploy test path is ready and confirms the current live blocker remains.
