# Bituach Leumi First Paid-Lead Readiness - 2026-05-27

Status: BLOCKED_STATIC_GATES
Source packet date: 2026-05-27

Scope: repo-local readiness check for the Bituach Leumi specialist-to-first-paid-lead loop. This does not publish CMS content, create leads, create lawyer/prospect records, contact anyone, change routing, send email/WhatsApp, invoice, charge payment, change SEO controls or deploy uPress.

## Summary

- Static gates passing: 6/9
- Runtime blockers preserved: 1
- Source-pack candidates: 0
- High-priority candidates: 0
- Source packet date: 2026-05-27
- Public changes approved by this report: 0

## Gate Results

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| BTL-01 | private_source_pack_loaded | BLOCKED | 0 candidate rows; 0 high-priority rows; columns= | Create the first 3-6 private prospects from `.project-control/btl-specialist-prospect-shortlist-2026-05-27.csv`. |
| BTL-02 | crm_supply_panel_available | PASS | Justice CRM has source-pack conversion, candidate table and outreach packet functions. | Use wp-admin -> Justice CRM -> Bituach Leumi specialist supply to create private prospects. |
| BTL-03 | prospect_verification_fields_available | PASS | Private prospect records include license, specialty, response, payment path, lead fee, terms and billing-contact gates. | Do not mark a prospect ready until all verification-missing checks return empty. |
| BTL-04 | manual_outreach_and_activation_packet_available | PASS | Prospect edit screen has manual-send outreach, terms acceptance and routable activation copy. | Use these packets manually; record terms before setting prospect status to won/onboarding. |
| BTL-05 | routing_consent_and_hold_guard_available | PASS | Lead router blocks held/manual external leads unless explicit or owner-verified match consent exists. | Keep WhatsApp/TalkTo/legacy leads on hold until consent evidence is recorded. |
| BTL-06 | btl_revenue_hint_and_billing_queue_available | PASS | National-insurance leads can be tagged as qualified appeal leads and moved to manual billing after routing. | After one controlled routed lead, save invoice/reference before invoice_sent and private payment evidence before paid. |
| BTL-07 | controlled_test_drill_available | PASS | Justice CRM has a first paid-lead preflight and controlled-test drill. | Run the controlled test only after 3 verified prospects and 3 active routable specialists exist. |
| BTL-08 | anti_cannibalization_boundary_documented | BLOCKED | Bituach Leumi attorney route and appeal-guide route have a private intent split packet. | Do not edit public title/H1/body/canonical/redirect/noindex/sitemap/taxonomy until owner/SEO/GSC approval. |
| BTL-09 | private_path_references_clean | REVIEW | Source-pack references should point future agents to dot-private `.project-control` artifacts. | Fix any remaining non-dot private report references before telling a remote operator where to work. |
| BTL-10 | runtime_revenue_proof | RUNTIME_BLOCKED | Repo can verify infrastructure, but cannot prove live WP DB has 3 verified prospects, 3 routable paid lawyers, one consented lead, or payment proof. | Owner/admin must create or verify private prospects, activate routable lawyer profiles, run one consented controlled lead, then record invoice/reference and private payment evidence. |

## Owner Run Order

1. Open `wp-admin -> Justice CRM -> Bituach Leumi specialist supply`.
2. Create the first 3-6 private prospects from `.project-control/btl-specialist-prospect-shortlist-2026-05-27.csv`.
3. For each prospect, verify license/status, Bituach Leumi appeal experience, same-day response, manual payment path, per-lead fee and billing contact.
4. Convert only verified prospects into routable lawyer profiles with owner approval.
5. Run one controlled consented Bituach Leumi lead only after the preflight is green.
6. Record private payment evidence before marking revenue as paid.

## Safety Statement

This report verifies infrastructure and preserves blockers. It is not approval to publish or edit Bituach Leumi public pages, change title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, route real leads, contact lawyers/suppliers, or claim payment revenue.
