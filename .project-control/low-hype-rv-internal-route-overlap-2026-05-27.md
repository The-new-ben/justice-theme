# Low Hype / RV Internal Route Overlap - 2026-05-27

Status: INTERNAL_ROUTE_OVERLAP_READY_NO_PUBLIC_ACTION

Scope: private internal route inventory and anti-cannibalization gate only. This does not approve public copy, metadata, links, CRM records, outreach, payments, email or deployment.

## Decision

No standalone RV route. If owner approves the pilot, start as a narrow owner-review path on consumer/rental surfaces only after GSC, internal route and legal review.

The live route inventory supports the earlier SERP packet: RV should remain a private research cluster unless the owner approves a narrow rental/deposit/charge pilot. Accident, insurance and traffic paths stay blocked for now because they overlap stronger existing legal intents.

## Summary

- Source SERP packet: SERP_REVIEW_PACKET_READY_NOT_APPROVED_FOR_PUBLICATION
- Source recommendation: RV rental/deposit/charge dispute attached to existing consumer/rental surfaces
- Routes sampled: 10
- Live verified routes: 8
- Primary verified consumer/rental surfaces: 2
- Existing pages already mentioning RV/caravan/camper terms: 0
- High cannibalization rows: 5
- Public changes approved: 0

## Route Rows

| ID | Route | Status | Role | RV Intent Fit | Decision | Risk | Existing RV Markers | Blocked Public Action |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| ROUTE-01 | [/consumer-rights-israel/](https://jus-tice.co.il/consumer-rights-israel/?rv_route_overlap=1779839258404) | VERIFIED_LIVE (200) | consumer_rights_guide | Primary existing surface for refund, cancellation, extra charge, deposit and supplier dispute angles. | PRIMARY_EXISTING_SURFACE_FOR_OWNER_REVIEW | MEDIUM | 0 | Do not add RV copy or CTA before GSC query evidence, legal review and owner approval. |
| ROUTE-02 | [/rental-agreement/](https://jus-tice.co.il/rental-agreement/?rv_route_overlap=1779839258500) | VERIFIED_LIVE (200) | rental_contract_guide | Primary adjacent surface for rental terms, written agreement, inspection, liability and breach language. | PRIMARY_ADJACENT_SURFACE_FOR_OWNER_REVIEW | MEDIUM | 0 | Do not turn contract-document intent into a broad dispute page without SEO/legal review. |
| ROUTE-03 | [/small-claims-court-israel/](https://jus-tice.co.il/small-claims-court-israel/?rv_route_overlap=1779839258502) | VERIFIED_LIVE (200) | small_claims_guide | Secondary support surface for low-value deposit/charge disputes if the route is live. | SECONDARY_SUPPORT_ONLY | MEDIUM | 0 | Do not publish case/outcome advice or link until route status and legal framing are reviewed. |
| ROUTE-04 | [/contract-law-israel/](https://jus-tice.co.il/contract-law-israel/?rv_route_overlap=1779839258504) | VERIFIED_LIVE (200) | contract_law_guide | Secondary support surface for agreement interpretation and contract breach, not first public pilot. | SECONDARY_SUPPORT_ONLY | MEDIUM | 0 | Do not dilute contract-law page with travel/rental supplier copy without route review. |
| ROUTE-05 | [/eviction-notice-israel/](https://jus-tice.co.il/eviction-notice-israel/?rv_route_overlap=1779839258506) | VERIFIED_LIVE (200) | rental_dispute_guide | Adjacent rental-dispute surface, but eviction-specific and likely not a clean RV fit. | ADJACENT_NOT_FIRST_PILOT | HIGH | 0 | Do not attach RV rental copy to eviction intent. |
| ROUTE-06 | [/real-estate-lawyer-guide/](https://jus-tice.co.il/real-estate-lawyer-guide/?rv_route_overlap=1779839258507) | VERIFIED_LIVE (200) | real_estate_guide | Broad legal context only. It should not own RV rental/deposit disputes. | CONTEXT_ONLY | HIGH | 0 | Do not use real-estate page as the RV landing surface. |
| ROUTE-07 | [/insurance-national-insurance-lawyer/](https://jus-tice.co.il/insurance-national-insurance-lawyer/?rv_route_overlap=1779839258509) | NOT_PUBLIC_OR_FETCH_BLOCKED (404) | insurance_national_insurance | Possible insurance overlap if live, but RV insurance claims need separate legal/supplier coverage review. | INSURANCE_PATH_BLOCKED_FOR_NOW | HIGH | 0 | Do not combine insurance claim intent with rental/deposit disputes. |
| ROUTE-08 | [/car-accident-lawyer/](https://jus-tice.co.il/car-accident-lawyer/?rv_route_overlap=1779839258510) | NOT_PUBLIC_OR_FETCH_BLOCKED (404) | car_accident_lawyer | Accident/injury intent is mature and separate. It should not be the first Low Hype/RV pilot. | ACCIDENT_PATH_BLOCKED_FOR_NOW | HIGH | 0 | Do not publish RV accident copy without GSC evidence and injury/traffic legal review. |
| ROUTE-09 | [/traffic-lawyer/](https://jus-tice.co.il/traffic-lawyer/?rv_route_overlap=1779839258512) | VERIFIED_LIVE (200) | traffic_lawyer | Traffic/fines intent is separate and should not absorb consumer rental disputes. | TRAFFIC_PATH_BLOCKED_FOR_NOW | HIGH | 0 | Do not publish RV fines/traffic copy from this packet. |
| ROUTE-10 | [/lawyers/](https://jus-tice.co.il/lawyers/?rv_route_overlap=1779839258513) | VERIFIED_LIVE (200) | lawyer_directory | Conversion/matching surface only after an approved content or private intake path exists. | CONVERSION_SURFACE_ONLY | LOW | 0 | Do not add RV lawyer filtering or matching claims before supply/legal coverage is verified. |

## Next Evidence Required

1. GSC query export for caravan/RV/campervan, rental, deposit, charge, cancellation and insurance modifiers.
2. Owner/legal decision whether the first pilot is consumer contract, rental document review, insurance claim, traffic/accident or private-only intake.
3. Exact public copy approval only if the chosen route remains legal-help-first and does not expose revenue logic.

## Safety Statement

This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue or require uPress deployment.
