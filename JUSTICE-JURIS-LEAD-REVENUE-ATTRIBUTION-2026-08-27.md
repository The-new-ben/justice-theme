# JURIS → lead → revenue attribution contract

Date: 2026-08-27
Status: `code_and_tests_verified__preview_and_production_pending`

## Outcome

The repository now contains a privacy-safe join from a real JURIS professional-action click to the existing WordPress lead CRM. It closes the measurement gap between `professional_action_started` and a consented lead without transferring Matter data.

The shared key is `journey_id`, generated with browser cryptographic randomness and retained only for the current browser session. The value is an attribution key, not authentication, not a secret, and not a Matter ID. It grants no access to any product record.

## End-to-end flow

1. CourtAI emits `professional_action_started` with a random `sessionId` such as `jf-123e4567-e89b-12d3-a456-426614174000`.
2. The same value is added as `journey_id` to the fixed `https://jus-tice.co.il/lawyers/` destination.
3. The directory preserves only `source`, `journey_id`, canonical UTM values and an allow-listed cluster while the visitor filters the directory or opens a lawyer profile.
4. The directory presents a specific JURIS continuation panel. Its primary action opens the consented homepage lead form and can preselect only a known legal area.
5. The lead form adds hidden attribution fields only when both `source=juris-arena` and a strictly valid `journey_id` exist.
6. A successful WordPress lead insert stores `product_journey_id`, `product_origin_cluster` and `product_handoff_source=juris-arena` beside the existing consent, CRM status and payment-evidence fields.
7. The owner-only Justice CRM reports the strict downstream funnel and evidenced revenue.

No new database table or migration is required; the existing WordPress post-meta model is used.

## Accepted public dimensions

| Field | Rule | Purpose |
|---|---|---|
| `source` | exactly `juris-arena` | distinguishes the product handoff |
| `journey_id` | `jf-` plus UUID or 32 cryptographic hex characters | joins the product event and CRM lead |
| `cluster` | one of the reconciled 11 GSC clusters | attributes SEO demand to business outcome |
| `area` / `lead_area` | derived from a fixed cluster-to-practice map | safely preselects a form area |
| UTM values | rewritten to three canonical constants | reporting compatibility without free text |

Explicitly forbidden: Matter ID/title, facts, prompts, names, phone/email, witness answers, record excerpts, evidence, transcript, score, deliverable content, or arbitrary return URL.

## KPI definitions

The KPI hierarchy is intentionally small and tied to decisions.

### Primary outcomes

1. **Consented JURIS leads** — CRM lead rows with a valid product journey and `consent=1`. A click is never counted as a lead.
2. **Qualified-to-accepted progression** — qualified means CRM `lead_status` is `qualified`, `accepted` or `converted`, or the controlled follow-up status is `consult_scheduled`/`won`; accepted is `accepted`/`converted` or `consult_scheduled`/`won`.
3. **Evidenced collected revenue** — sum of `suggested_lead_price_ils` only where billing is `paid` and a payment-evidence URL exists. An invoice reference without evidence is not collected revenue.

### Drivers

- professional-action click → consented lead conversion, joined on `journey_id`;
- consented lead → qualified rate;
- accepted → won rate;
- stage counts by `product_origin_cluster`, beginning with criminal, family, real estate and medical malpractice.

### Guardrails

- URL or analytics payloads containing Matter content or contact data: target `0`;
- unknown/spoofed clusters accepted: target `0`;
- `paid` revenue without payment evidence: target `0`;
- production claim before both repositories are deployed and one synthetic, no-PII journey is verified: forbidden.

No numerical conversion target is set before a trustworthy baseline. First review occurs after enough real product actions exist to avoid treating one or two leads as a trend; until then the dashboard is an instrumentation and operations check, not a forecasting model.

## Good and bad examples

Good example 1:

```text
/lawyers/?source=juris-arena&journey_id=jf-123e4567-e89b-12d3-a456-426614174000&cluster=criminal-law
```

It contains a random join key and an allow-listed cluster only.

Good example 2: a visitor opens a lawyer profile and then deliberately types a fresh summary into the consented WordPress form. Only that submitted summary belongs to the lead; the Matter remains isolated.

Bad example 1:

```text
/lawyers/?matter_id=42&client=Israel%20Israeli&transcript=...
```

This exposes identity and legal-work content in browser history, logs and analytics and is rejected by the contract.

Bad example 2: treating `professional_action_started`, a WhatsApp click or an invoice reference as revenue. Those are intent or billing-process signals, not a consented lead and not collected cash.

## Implementation map

- `inc/product-handoff-attribution.php` — strict format and cluster allow-lists, canonical navigation args.
- `inc/lead-spam-guard.php` — hidden form attribution and safe fallback URL.
- `archive-justice_lawyer.php` — JURIS continuation panel and filter preservation.
- `template-parts/cards/lawyer-card.php` — safe journey preservation into a professional profile.
- `justice-core/includes/lead-submissions.php` — authoritative lead storage.
- `inc/lead-routing.php` — product source channel and owner next action.
- `inc/lead-crm.php` — owner-only funnel and evidenced-revenue snapshot.
- `tests/test-product-handoff-attribution.php` — executable privacy and continuity contract.

The corresponding product implementation and event contract are documented in CourtAI at `docs/JUSTICE-PROFESSIONAL-ACTION-HANDOFF-2026-08-27.md` and `docs/JUSTICE-FUNNEL-INSTRUMENTATION-2026-08-27.md`.

## Release and proof gate

Current code and focused tests are verified, but nothing in this change has been deployed to WordPress Production. Safe release order remains:

1. resolve and deploy the approved JURIS gateway change;
2. prove a strict 20-turn professional run and save a useful deliverable;
3. deploy a reviewed CourtAI frontend commit;
4. deploy this reviewed theme/core change;
5. run one synthetic no-PII handoff through the directory and form;
6. verify the CRM row has consent plus the same opaque journey and cluster;
7. verify stage reporting; never mark Paid without evidence;
8. preserve desktop/mobile screenshots and deployed commit identifiers.

Do not create a real person, production lead, payment or lawyer handoff solely for QA.

## Rollback

Revert the product-attribution changes in CourtAI and this repository. Existing leads and CRM fields remain readable; no schema rollback, redirect, 301, 410, content deletion, sitemap mutation or OAuth change is involved.
