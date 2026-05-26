# Private Artifact Script Migration - 2026-05-26

## Status

Verified local. This is a repo-only safety improvement for old tooling.

## What Changed

The first high-risk criminal/traffic content-planning tools now read and write only dot-private artifact paths:

- `tools/build-criminal-traffic-readiness-dashboard.mjs`
- `tools/build-criminal-gsc-decision-map.mjs`

The migrated paths are:

- `project-control/...` -> `.project-control/...`
- `reports/...` -> `.reports/...`
- `content-drafts/...` -> `.content-drafts/...`

## Verification

- `node --check tools/build-criminal-traffic-readiness-dashboard.mjs` passed.
- `node --check tools/build-criminal-gsc-decision-map.mjs` passed.
- `node --check tools/check-private-artifact-boundaries.mjs` passed.
- `node tools/build-criminal-traffic-readiness-dashboard.mjs --reportDate=2026-05-26` generated a private dashboard with `57` rows and no public folder output.
- `node tools/check-private-artifact-boundaries.mjs --reportDate=2026-05-26` returned `PASS`.
- Legacy public-root references dropped from `600` to `563`.

## Generated Private Artifacts

- `.project-control/criminal-traffic-readiness-dashboard-2026-05-26.md`
- `.project-control/criminal-traffic-readiness-dashboard-2026-05-26.csv`
- `.reports/criminal-traffic-readiness-dashboard-2026-05-26.csv`
- `.reports/criminal-traffic-readiness-dashboard-2026-05-26.json`
- `.project-control/private-artifact-boundary-guard-2026-05-26.md`
- `.project-control/private-artifact-boundary-guard-2026-05-26.csv`

## Safety Statement

No public CMS page, lead, lawyer, supplier, payment, invoice, email, WhatsApp, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed. No public artifact root was recreated.

## Remaining Work

Continue the same migration for Family/Divorce, Medical Malpractice and supplier/content packet tools before enabling the stricter `--fail-on-legacy-writers` release gate.
