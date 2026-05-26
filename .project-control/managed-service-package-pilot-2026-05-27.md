# Managed Legal-Service Package Pilot Packet - 2026-05-27

Status: PRIVATE_PACKAGE_PILOT_READY_WITH_PUBLIC_BLOCKERS

Scope: private readiness packet for the Lawhive-style managed legal-service path. This does not publish a service page, create a checkout, create a client request, create a lawyer assignment, send email/WhatsApp, draft legal documents, invoice, charge payment, change SEO controls or deploy uPress.

## Summary

- Admin/static gates passing: 6/6
- Private package candidates checked: 7
- Packages present in private catalog: 7/7
- Public launch approvals: 0

## Admin Gate Results

| ID | Area | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| GATE-01 | private_meta | PASS | Owner-only fulfillment meta fields are registered on justice_legal_request. | Keep as private/admin-only gate. |
| GATE-02 | package_catalog | PASS | Private package selector exists in the LegalTech request fulfillment metabox. | Keep as private/admin-only gate. |
| GATE-03 | readiness_logic | PASS | Readiness logic blocks managed fulfillment unless lawyer, engagement, ethics and payment gates are recorded. | Keep as private/admin-only gate. |
| GATE-04 | crm_panel | PASS | Justice CRM has a private managed-service fulfillment preflight panel. | Keep as private/admin-only gate. |
| GATE-05 | public_blocker | PASS | Admin copy explicitly blocks public launch until ethics/engagement/payment gates are clear. | Keep as private/admin-only gate. |
| GATE-06 | revenue_stream | PASS | Revenue-stream map records the managed-services idea as started privately, not public. | Keep as private/admin-only gate. |

## Private Package Pilot Queue

| Order | Package | Suggested Price | Risk | Private Status | Public Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Rental agreement review / draft | 299 | medium | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |
| 2 | Demand letter with lawyer review | 599 | medium-high | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |
| 3 | Bituach Leumi appeal package | 1499 | high | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |
| 4 | Simple will package | 599 | high | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |
| 5 | Prenuptial / financial agreement | 999 | high | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |
| 6 | Company formation documents | 1890 | medium-high | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |
| 7 | Cross-border / immigration consult bundle | 2990 | high | READY_FOR_OWNER_CONTROLLED_REQUEST | BLOCKED_PRIVATE_PILOT_ONLY |

## Package Notes

### 1. Rental agreement review / draft
- First controlled scope: Residential lease review or custom draft from owner-approved checklist.
- Blockers: lawyer of record; signed engagement; ethics review; payment proof; no public checkout
- Cannibalization review before public page: Check existing rental, real-estate and apartment contract articles before any page or CTA.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

### 2. Demand letter with lawyer review
- First controlled scope: Manual lawyer-reviewed warning letter for consumer, employment or rental dispute.
- Blockers: claim-specific lawyer review; evidence checklist; engagement letter; payment proof; no AI draft promise
- Cannibalization review before public page: Check employment, consumer and rental dispute pages before any public demand-letter tool.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

### 3. Bituach Leumi appeal package
- First controlled scope: Controlled manual appeal-file preparation with specialist lawyer supervision.
- Blockers: three verified BTL specialists; client consent; medical-document handling; engagement; payment proof
- Cannibalization review before public page: Use the existing Bituach Leumi route-intent split before any public copy or linking.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

### 4. Simple will package
- First controlled scope: Single-person simple will only after lawyer confirms scope and ceremony requirements.
- Blockers: lawyer of record; capacity/conflict checks; witness/notary process; engagement; payment proof
- Cannibalization review before public page: Check inheritance, wills and estate-planning pages before creating or upgrading a package page.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

### 5. Prenuptial / financial agreement
- First controlled scope: Financial agreement intake and lawyer-supervised draft, no court filing promise.
- Blockers: family-law lawyer; conflict checks; court/notary approval process; engagement; payment proof
- Cannibalization review before public page: Check family-law, divorce and financial-agreement pages before any public route.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

### 6. Company formation documents
- First controlled scope: Company formation document pack with corporate lawyer and manual filing proof.
- Blockers: corporate lawyer; filing path; beneficial-owner/KYC details; engagement; payment proof
- Cannibalization review before public page: Check business, companies and corporate-law pages before public packaging.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

### 7. Cross-border / immigration consult bundle
- First controlled scope: Consult bundle only, with Israeli lawyer plus external supplier where needed.
- Blockers: supplier registration; lawyer/supplier role separation; consent; accepted terms; payment proof
- Cannibalization review before public page: Check Aliyah, immigration, citizenship, tax and diaspora pages before any offer page.
- Owner next action: Use only inside a controlled justice_legal_request after owner approval and lawyer/engagement/payment evidence.

## Controlled Pilot Run Order

1. Choose one package from this packet; start with rental agreement or demand letter, not a high-risk family/will/immigration package.
2. Create or use one private `justice_legal_request` only after owner approval.
3. Set package, fulfillment mode and managing lawyer of record.
4. Record signed engagement, ethics approval for the pilot structure and payment proof.
5. Fulfill manually under lawyer supervision; do not use unattended AI drafting.
6. Record owner notes, case reference and payment evidence before counting revenue.

## Public Launch Stop Conditions

1. No Israeli Bar/ethics-reviewed engagement structure.
2. No managing lawyer of record.
3. No signed client engagement letter.
4. No payment proof and refund/cancel path.
5. No anti-cannibalization review for the target page and associated existing articles/tools.
6. No owner approval for exact public copy, URL, title/H1/meta and checkout wording.

## Safety Statement

This packet is private infrastructure only. It is not approval to publish packaged legal-service pages, sell a service, offer fixed legal outcomes, run AI drafting, contact clients/lawyers, process payment, or represent Jus-Tice publicly as a law firm.
