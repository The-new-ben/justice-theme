# Deployment Verification

Date: 2026-05-10

## Current Finding

VERIFIED: GitHub `main` is ahead of the live WordPress theme output.

Evidence from `tools/check-live-deployment.ps1` before the static marker commit is deployed:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- The static marker request resolves to the homepage instead of returning the marker file.
- All seven family-law URLs still expose internal markers publicly.

## Interpretation

The current problem is deployment state, not only article-cleaning logic.

Until live WordPress serves either:

- `<meta name="justice-deployment-marker" content="2026-05-10-runtime-guard-v5" />`
- or `/wp-content/themes/justice-theme/deployment-marker.txt`

we cannot claim the v5 runtime guard is active on the live site.

## Required Live Action

1. Pull latest `main` in uPress for `jus-tice.co.il`.
2. Open `/wp-admin/` once or open any public page once so WordPress init/hooks execute.
3. Run `tools/check-live-deployment.ps1`.
4. Expected proof after pull:
   - Homepage PHP marker is VERIFIED.
   - Static theme marker is VERIFIED.
   - Family-law pages no longer show `NOT VERIFIED`, `PARTIAL:`, `READY NEXT`, `project-control`, `CMS`, `CRM`, or `GSC` in public article bodies.

## Status

BLOCKED: waiting for uPress pull / live file sync / cache refresh.
