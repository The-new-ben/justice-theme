# Criminal Jerusalem Lawyer Coverage Activation Packet - 2026-05-27

Status: CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_PACKET_READY_NO_LIVE_ACTION
Source date: 2026-05-27

Scope: private owner/admin activation worksheet for the criminal-law/Jerusalem directory coverage gap. This packet does not create WordPress records, publish a lawyer profile, contact anyone, route a lead, invoice, take payment, send email/WhatsApp/TalkTo, change SEO settings or deploy.

## Source Blocker

- Exact directory: /lawyers/?city=jerusalem&area=criminal-law
- Exact lawyer cards: 0
- Area-only criminal cards: 0
- City-only Jerusalem cards: 2 (review-only; not criminal-specific)
- Contact fallback status: 200 (review-only)

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| CJLA-GATE-01 | source_unblocker_available | PASS | Source unblocker status: DIRECTORY_COVERAGE_UNBLOCKER_READY_NO_PUBLIC_CHANGE. | Use the source blocker as private evidence only; do not publish from it. |
| CJLA-GATE-02 | criminal_jerusalem_exact_coverage_missing | PASS | Exact criminal+Jerusalem card count 0; area-only criminal 0; city-only Jerusalem 2. | Treat private matching-lawyer coverage as the safest unblocker. |
| CJLA-GATE-03 | prospect_cpt_private_admin_only | PASS | justice_prospect is non-public, hidden from REST and available in the owner onboarding menu. | Use wp-admin prospect entry only; do not create public lawyer cards from this packet. |
| CJLA-GATE-04 | prospect_fields_ready | PASS | 23 prospect fields needed for coverage activation are registered. | Fill only owner-known, no-PII fields in the private CSV/template before any live entry. |
| CJLA-GATE-05 | verification_rules_ready | PASS | Verification helper checks license, specialty, response fit, payment path, terms, fee and billing contact. | Do not mark a prospect routable until these fields are complete in wp-admin. |
| CJLA-GATE-06 | owner_sales_queue_ready | PASS | Lead CRM exposes Lawyer Prospects as the owner sales queue, not a public listing. | Use the owner queue for paid-coverage follow-up after owner approval. |
| CJLA-GATE-07 | no_live_action_authorized | PASS | This packet approves 0 CMS writes, public changes, CRM records, contacts, routing, invoices, payments, emails, WhatsApp, TalkTo or uPress actions. | Keep this as a preparation artifact until the owner explicitly approves private live entry. |

## Activation Checklist

| ID | Stage | Owner Action | WP Admin Field | Recommended Value | Completion Rule | Forbidden Without Approval |
| --- | --- | --- | --- | --- | --- | --- |
| CJ-COVERAGE-01 | private_prospect_entry | Create or verify one private Lawyer Prospect for criminal-law in jerusalem. | prospect_practice_area, prospect_city, prospect_target_plan, prospect_priority, prospect_outreach_status, prospect_source_url, prospect_demand_signal | criminal-law \| jerusalem \| lead_partner \| hot \| research \| /lawyers/?city=jerusalem&area=criminal-law \| exact directory has 0 lawyer cards | Private prospect row exists in wp-admin or owner template; no public profile/card is created from this packet. | Do not create or publish a public lawyer card. |
| CJ-COVERAGE-02 | license_check | Verify Israeli Bar/license status from an owner-approved source. | prospect_license_verified, prospect_verification_note | 1 only after owner/admin verification; note private source/date. | License checkbox is 1 and note identifies the private verification evidence. | Do not infer license status from marketing copy alone. |
| CJ-COVERAGE-03 | specialty_fit | Verify real criminal-law fit and Jerusalem service coverage. | prospect_specialty_verified, prospect_owner_note | 1 only after human review; note criminal-law plus Jerusalem coverage. | Specialty checkbox is 1 and owner note explains why this prospect fits criminal-law/Jerusalem. | Do not mark a general Jerusalem lawyer as criminal-law coverage without evidence. |
| CJ-COVERAGE-04 | response_fit | Record response readiness for paid lead handling. | prospect_response_fit | within_15_min or same_day | Response fit is one of the accepted values. | Do not route urgent criminal-law leads to a prospect with unknown response fit. |
| CJ-COVERAGE-05 | payment_terms | Record manual payment path and agreed qualified-lead fee terms. | prospect_payment_path_ready, prospect_lead_fee_terms_ready, prospect_agreed_lead_fee_ils, prospect_terms_note | 1 \| 1 \| owner-filled numeric fee \| manual invoice/payment terms note | Payment path and terms are 1, agreed lead fee is greater than 0, and terms note is complete. | Do not invoice, mark paid, or claim revenue from this packet. |
| CJ-COVERAGE-06 | billing_contact | Record billing contact email only after owner/admin has permission to store it. | prospect_billing_contact_email | owner-filled valid email | Billing contact email is valid and owner-approved for private storage. | Do not place personal email addresses in repo artifacts. |
| CJ-COVERAGE-07 | routable_profile_review | Only after the private prospect is ready, prepare a separate fact-gated public lawyer-card/profile review. | separate owner-approved profile/profile-card workflow | not approved by this packet | Separate owner approval exists and public-card facts are reviewed before any CMS/public record action. | Do not convert a private prospect into a public routable lawyer profile. |
| CJ-COVERAGE-08 | coverage_gate_rerun | After owner-approved private/profile work, rerun the city/practice coverage gate. | repo-local verification only | node tools/build-city-practice-priority-draft-briefs.mjs --reportDate=YYYY-MM-DD | Exact criminal+Jerusalem directory has at least one matching lawyer card before public draft/link reliance. | Do not use broader city or contact fallback publicly from this packet alone. |

## Owner Template

| Template ID | Practice | City | Plan | Priority | Status | Source URL | Demand Signal | Private Entry Ready | Forbidden Without Fresh Approval |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CJ-PROSPECT-TEMPLATE-01 | criminal-law | jerusalem | lead_partner | hot | research | /lawyers/?city=jerusalem&area=criminal-law | Exact criminal-law/Jerusalem directory has 0 lawyer cards; city-only Jerusalem has coverage but is not criminal-specific. | no | No public profile/card, contact, routing, invoice, payment, email, WhatsApp, TalkTo or uPress action. |

## Review

The concrete next step is not a public content edit. It is a private owner/admin coverage activation step: identify one real criminal-law lawyer who serves Jerusalem, verify license/specialty/response fit/payment terms/billing contact in the private prospect flow, then rerun the directory coverage gate. Only after exact coverage exists should a public draft, internal link, or lawyer-card/profile workflow be considered.
