# GSC OAuth Preflight Runbook - 2026-05-22

Status: VERIFIED LOCAL TOOLING / OWNER CREDENTIAL SETUP STILL REQUIRED / NO PUBLIC CHANGES

## Purpose

Use this before the first real Google Search Console API export. It checks local setup, credential hygiene and runner wiring without opening the OAuth browser, calling GSC or changing the public site.

## Command

Preferred owner setup, with credential and token paths outside Git:

```powershell
$env:GSC_OAUTH_CLIENT_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-oauth-client.json"
$env:GSC_TOKEN_PATH="C:\Users\janana\Documents\jus-tice-secrets\gsc-token.json"
.\tools\gsc\check-gsc-oauth-preflight.ps1 -RunPriorityDryRun
```

Without the dry-run wiring check:

```powershell
.\tools\gsc\check-gsc-oauth-preflight.ps1
```

## What It Checks

- VERIFIED / BLOCKED: Node runtime exists.
- VERIFIED / BLOCKED: `tools/gsc/package.json` exists.
- VERIFIED / BLOCKED: local `googleapis` and `open` packages exist.
- VERIFIED / BLOCKED: priority GSC runner exists.
- VERIFIED / BLOCKED: OAuth client path is provided and the file exists.
- VERIFIED / BLOCKED: OAuth client JSON has expected fields without printing secret values.
- VERIFIED / BLOCKED: OAuth client and token paths are not tracked by Git.
- VERIFIED / BLOCKED: token parent folder exists or can hold the first OAuth token.
- VERIFIED / NOT VERIFIED: optional priority-cluster dry run.

## Local Verification

- VERIFIED LOCAL: `tools/gsc/check-gsc-oauth-preflight.ps1` was added.
- VERIFIED LOCAL: with the local ignored OAuth file, the preflight returned `VERIFIED_PRECHECK_READY`.
- VERIFIED LOCAL: `-RunPriorityDryRun` executed Family/Divorce, Criminal Law and Medical Malpractice dry-runs.
- VERIFIED LOCAL: dry-runs opened no OAuth browser, made no GSC API call and changed no public site data.
- BLOCKED OWNER SETUP: this does not replace owner OAuth approval. It only proves the local command path is ready.

## Expected Result Before Real Export

Good result:

```json
{
  "status": "VERIFIED_PRECHECK_READY",
  "blocked": 0,
  "api_called": false,
  "oauth_browser_opened": false,
  "public_site_changed": false
}
```

Blocked result means do not run the real export yet. Fix the listed `BLOCKED` rows first.

## Safety

This is local preflight only. No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment is changed.
