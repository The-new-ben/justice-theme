# Deployment Verification

Date: 2026-05-10

## Current Finding

VERIFIED: GitHub `main` is ahead of the live WordPress theme output.

Latest recheck after commit `2c418b4`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: commit `2c418b4` and the queued cleaner/trust-gate changes are pushed to GitHub but are not being served by live WordPress yet.

Latest recheck after commit `23e3807`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the lawyer-directory guidance/filter improvements are pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `ae8726b`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: canonical menu/filter slug cleanup is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `3fdae22`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: menu repair versioning is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `76dc56f`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the public-publication safety gate is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `9d19686`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the lead-form anti-spam guard is pushed to GitHub, but live WordPress is still not serving the newest `main` code.

Latest recheck after commit `31a0026`:

- Homepage PHP marker: NOT VERIFIED.
- Static theme marker at `/wp-content/themes/justice-theme/deployment-marker.txt`: NOT VERIFIED.
- All seven family-law URLs still expose internal markers publicly.
- Interpretation: the lawyer-to-lead CRM routing patch is pushed to GitHub, but live WordPress is still not serving the newest `main` code. Maya/lawyer mini-site lead routing cannot be called live-verified until uPress pulls and a controlled test lead is submitted.

Evidence from `tools/check-live-deployment.ps1` after commit `542aeef`:

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
