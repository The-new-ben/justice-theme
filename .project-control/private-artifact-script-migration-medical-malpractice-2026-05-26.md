# Private Artifact Script Migration - Medical Malpractice - 2026-05-26

## Status

Verified local. This is the third repo-only safety pass for old tooling.

## What Changed

The Medical Malpractice planning tools below now use dot-private artifact paths:

- `tools/build-medical-malpractice-readiness-dashboard.mjs`
- `tools/build-medical-malpractice-gsc-decision-map.mjs`
- `tools/build-medical-malpractice-owner-decision-packet.mjs`
- `tools/build-medical-malpractice-duplicate-identity-review.mjs`

The migrated path families are:

- `project-control/...` -> `.project-control/...`
- `reports/...` -> `.reports/...`

## Verification

- Syntax checks passed for all four migrated tools.
- `node tools/build-medical-malpractice-readiness-dashboard.mjs --reportDate=2026-05-26` generated private `.reports` and `.project-control` outputs only.
- `node tools/build-medical-malpractice-gsc-decision-map.mjs --reportDate=2026-05-26` generated private decision, protected URL and cannibalization maps only.
- `node tools/build-medical-malpractice-owner-decision-packet.mjs --reportDate=2026-05-26` generated a private owner decision packet with `69` rows and `0` approved-for-upload rows.
- `node tools/build-medical-malpractice-duplicate-identity-review.mjs --reportDate=2026-05-26` generated a private duplicate-identity review for IDs `11607` and `1130`.
- `node tools/check-private-artifact-boundaries.mjs --reportDate=2026-05-26` returned `PASS`.
- Legacy public-root references dropped from `512` to `440`.

## Generated Private Artifacts

- `.project-control/medical-malpractice-readiness-dashboard-2026-05-26.md`
- `.project-control/medical-malpractice-readiness-dashboard-2026-05-26.csv`
- `.project-control/medical-malpractice-gsc-decision-map-2026-05-26.md`
- `.project-control/medical-malpractice-gsc-decision-map-2026-05-26.csv`
- `.project-control/medical-malpractice-owner-decision-packet-2026-05-26.md`
- `.project-control/medical-malpractice-owner-decision-packet-2026-05-26.csv`
- `.project-control/medical-malpractice-duplicate-identity-review-2026-05-26.md`
- `.project-control/medical-malpractice-duplicate-identity-review-2026-05-26.csv`
- `.reports/medical-malpractice-readiness-dashboard-2026-05-26.csv`
- `.reports/medical-malpractice-readiness-dashboard-2026-05-26.json`
- `.reports/medical-malpractice-gsc-decision-map-2026-05-26.csv`
- `.reports/medical-malpractice-gsc-decision-map-2026-05-26.json`
- `.reports/medical-malpractice-protected-url-decision-map-2026-05-26.csv`
- `.reports/medical-malpractice-cannibalization-decision-map-2026-05-26.csv`
- `.reports/medical-malpractice-owner-decision-packet-2026-05-26.csv`
- `.reports/medical-malpractice-owner-decision-packet-2026-05-26.json`
- `.reports/medical-malpractice-duplicate-identity-review-2026-05-26.csv`
- `.reports/medical-malpractice-duplicate-identity-review-2026-05-26.json`

## Content Safety Note

The Medical Malpractice GSC decision map used the baseline dashboard path, not a fresh owner-approved focused export. It is useful for local planning and anti-cannibalization review only. The generated owner decision packet explicitly has `0` approved-for-upload rows.

## Safety Statement

No public CMS page, lead, lawyer, supplier, payment, invoice, email, WhatsApp, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed. No public artifact root was recreated.

## Remaining Work

Continue the same migration for supplier/content packet tools before enabling the stricter `--fail-on-legacy-writers` release gate.
