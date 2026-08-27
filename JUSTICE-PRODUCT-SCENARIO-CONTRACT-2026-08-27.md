# Justice product-scenario and revenue contract

Date: 2026-08-27
Status: `implemented_and_tested__production_pending`

## Outcome

The WordPress side now uses the same strict `cluster → SEO owner → product
scenario` vocabulary as CourtAI. Organic entry, the reverse JURIS professional
action, the consented lead record and the owner-only CRM therefore retain one
business journey without accepting arbitrary public text or Matter content.

## Canonical mapping

| Cluster | SEO owner | Scenario |
|---|---|---|
| `family-law` | `/divorce-lawyer/` | `mediation-preparation` |
| `criminal-law` | `/criminal-defense-attorney/` | `investigation-rehearsal` |
| `real-estate` | `/articles/real-estate-attorney/` | `transaction-dispute-rehearsal` |
| `immigration` | `/immigration-lawyer/` | `immigration-interview-preparation` |
| `international-real-estate` | `/buying-property-abroad-guide/` | `cross-border-transaction-review` |
| `traffic-law` | `/articles/traffic-lawyer/` | `traffic-hearing-rehearsal` |
| `inheritance` | `/inheritance-lawyer/` | `probate-dispute-preparation` |
| `employment` | `/labor-lawyer/` | `employment-dispute-rehearsal` |
| `medical-malpractice` | `/medical-malpractice-lawyer/` | `medical-expert-preparation` |
| `personal-injury` | `/personal-injury-law/` | `damages-testimony-preparation` |
| `tax` | `/tax-lawyer/` | `tax-review-preparation` |

`scenario` is accepted only when it exactly matches the selected cluster. A
missing, legacy, unknown or mismatched value is never guessed from free text.

## End-to-end behavior

1. The editorial CTA emits only the allow-listed cluster, its derived owner and
   its derived scenario into `jus-tice.com/#/intake`.
2. CourtAI uses that scenario to select a source-safe preparation track and
   returns it with the opaque `journey_id` after useful product work.
3. The lawyer directory, profile and consented form preserve only the validated
   public attribution dimensions.
4. `justice_lead` storage writes `product_origin_scenario` only for a valid
   JURIS journey and matching cluster.
5. The CRM reports 11 fixed scenario rows plus `Unattributed`, including
   submitted, qualified, accepted, closed, won and evidenced collected revenue.

This makes it possible to compare, for example, whether investigation rehearsal
or medical-expert preparation produces qualified cases and cash, rather than
optimizing only for visits or clicks.

## Privacy and integrity boundary

Allowed: canonical cluster, canonical owner, canonical scenario, fixed source
and UTM values, and an opaque random journey key.

Forbidden: Matter ID/title, case facts, names, contact details, search query,
medical record, evidence, transcript, prompt, result prediction, score,
deliverable body or arbitrary return URL.

Invalid scenario input is discarded. A valid cluster is still visible in the
owner report, while the scenario report places absent/invalid scenario data in
`Unattributed`; this exposes migration gaps without corrupting commercial data.

## Implementation and proof

- `inc/product-handoff-attribution.php` owns the 11-scenario allow-list and
  cross-page sanitization.
- `inc/simulation-handoff.php` emits the canonical scenario to local and CourtAI
  destinations.
- `inc/lead-spam-guard.php` preserves it only through a valid product journey.
- `justice-core/includes/lead-submissions.php` performs authoritative storage
  validation.
- `inc/lead-crm.php` renders the owner-only scenario funnel and revenue table.
- `tests/test-simulation-handoff.php` proves all 11 scenarios are unique and the
  four launch URLs receive the correct value.
- `tests/test-product-handoff-attribution.php` proves preservation, mismatch and
  PII rejection, fallback behavior and core registration.
- `tests/test-product-handoff-report.php` proves 11 scenarios plus
  `Unattributed`, stage counts and evidence-backed revenue.

The corresponding visible Intake behavior, screenshots and SPA route-switch
proof are in CourtAI:
`docs/JUSTICE-SEO-PRODUCT-SCENARIO-CONTRACT-2026-08-27.md`.

## Release gate

No WordPress Production change is claimed. Deploy only after the reviewed
CourtAI destination is live, then verify four commercial entries and one
synthetic consented no-PII professional return. Confirm the CRM stores the same
journey, cluster and scenario and that both attribution tables agree. Record the
deployed commits and screenshots before calling KR3 complete.

Rollback is a normal code revert. It requires no 301, 410, content deletion,
OAuth change or lead-table migration.
