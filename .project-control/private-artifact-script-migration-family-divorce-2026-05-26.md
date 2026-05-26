# Private Artifact Script Migration - Family Divorce - 2026-05-26

## Status

Verified local. This is the second repo-only safety pass for old tooling.

## What Changed

The Family/Divorce planning tools below now use dot-private artifact paths:

- `tools/build-family-divorce-gsc-decision-map.mjs`
- `tools/build-family-divorce-protected-url-review-packet.mjs`
- `tools/build-family-law-live-repair-readiness-gate.mjs`
- `tools/apply-family-divorce-child-custody-draft-merges.mjs`
- `tools/apply-family-divorce-child-support-draft-merges.mjs`
- `tools/apply-family-divorce-property-division-draft-merges.mjs`

The migrated path families are:

- `project-control/...` -> `.project-control/...`
- `reports/...` -> `.reports/...`
- `content-drafts/...` -> `.content-drafts/...`

## Verification

- Syntax checks passed for all six migrated tools.
- `node tools/build-family-divorce-gsc-decision-map.mjs --reportDate=2026-05-26` generated private `.reports` outputs only.
- `node tools/build-family-divorce-protected-url-review-packet.mjs --reportDate=2026-05-26` generated private `.reports` and `.project-control` outputs only.
- `node tools/build-family-law-live-repair-readiness-gate.mjs --help` confirms dot-private inputs and outputs.
- `node tools/check-private-artifact-boundaries.mjs --reportDate=2026-05-26` returned `PASS`.
- Legacy public-root references dropped from `563` to `512`.

## Generated Private Artifacts

- `.reports/family-divorce-gsc-decision-map-2026-05-26.csv`
- `.reports/family-divorce-gsc-decision-map-2026-05-26.json`
- `.reports/family-divorce-protected-url-decision-map-2026-05-26.csv`
- `.reports/family-divorce-cannibalization-decision-map-2026-05-26.csv`
- `.reports/family-divorce-protected-url-owner-review-packet-2026-05-26.csv`
- `.reports/family-divorce-protected-url-owner-review-packet-2026-05-26.json`
- `.project-control/family-divorce-protected-url-owner-review-packet-2026-05-26.csv`

## Content Safety Note

The generated Family/Divorce GSC decision map used fallback cached GSC data, not a fresh owner-approved focused export. It is useful for local planning and anti-cannibalization review only. It does not approve CMS upload, URL migration, redirects, canonicals/noindex, sitemap changes, taxonomies or internal-link writes.

## Safety Statement

No public CMS page, lead, lawyer, supplier, payment, invoice, email, WhatsApp, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed. No public artifact root was recreated.

## Remaining Work

Continue the same migration for Medical Malpractice and supplier/content packet tools before enabling the stricter `--fail-on-legacy-writers` release gate.
