# Demand-Letter First Context Owner Decision Draft - 2026-05-27

Status: DEMAND_LETTER_FIRST_CONTEXT_DECISION_DRAFT_READY_NOT_APPROVED

Source approval packet: .project-control/demand-letter-public-update-approval-packet-2026-05-27.md

Scope: private owner/SEO/legal decision draft only. This does not publish, edit CMS content, change title/H1/meta/body, add internal links, create a generic demand-letter route, change redirects/canonicals/noindex/sitemaps/taxonomies, create leads, contact lawyers or clients, invoice, charge, send email/WhatsApp/TalkTo or deploy uPress.

## Summary

- Source packet status: OWNER_REVIEW_PACKET_READY_NOT_APPROVED
- Context rows: 3
- Decision rows: 5
- Global demand-letter GSC rows: 19
- Global demand-letter GSC impressions: 836
- Exact route GSC rows across candidate routes: 0
- Source/competitor notes: 8
- Owner decision template rows: 5
- Forbidden public marker hits: 0
- Public changes approved: 0

## Recommended Order

1. Keep the generic demand-letter route blocked.
2. Ask the owner to choose one first context only.
3. If choosing from the current evidence, employment is the first review candidate, consumer is the cleaner second candidate, and rental-dispute should wait until rental-agreement review is settled.
4. After owner choice, build one CMS draft/review packet for that route only and run legal/source review, SEO review and mobile duplicate-CTA QA.

## Context Rows

| context | target_route | recommendation | demand_query_rows | demand_query_impressions | top_demand_query | live_surface_status | exact_route_gsc_rows | risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| employment | https://jus-tice.co.il/labor-lawyer/ | REVIEW_FIRST_CONTEXT_CANDIDATE | 2 | 18 | מכתב פנייה למעסיק דוגמא | VERIFIED | 0 | HIGH: broad labor-law page must stay broad and not become a demand-letter product page. |
| consumer | https://jus-tice.co.il/consumer-rights-israel/ | SECOND_CONTEXT_CANDIDATE_AFTER_OWNER_CHOICE | 1 | 154 | מכתב התראה לקבלן איחור במסירה | VERIFIED | 0 | MEDIUM: consumer page already has guide intent; demand-letter wording must remain a small remedy subsection. |
| rental_dispute | https://jus-tice.co.il/eviction-notice-israel/ | PARK_UNTIL_RENTAL_AGREEMENT_REVIEW_SETTLED | 3 | 81 | מכתב התראה לשוכר דירה דוגמא | VERIFIED | 0 | MEDIUM-HIGH: must not blur eviction/dispute intent with rental-agreement review/drafting intent. |

## Owner Decision Rows

| id | decision | status | target | owner_choice | evidence | blocked_action |
| --- | --- | --- | --- | --- | --- | --- |
| DECISION-01 | BLOCK_GENERIC_ROUTE | BLOCKED | NEW_GENERIC_DEMAND_LETTER_ROUTE | Keep blocked unless owner/SEO later creates a separate strategy. | 7 generic/other demand-letter GSC rows; broad competitors cover many disputes, which increases cannibalization risk. | Do not create /demand-letter/, generic H1/meta or one-size-fits-all letter copy. |
| DECISION-02 | CHOOSE_EMPLOYMENT_FIRST | REVIEW_FIRST_CONTEXT_CANDIDATE | https://jus-tice.co.il/labor-lawyer/ | Choose employment as first demand-letter context, or keep parked. | 3 source packet rows; 2 matching demand-query rows; 18 demand-query impressions; live surface VERIFIED. | Owner/SEO/legal approval required before CMS, title/H1/meta/body, CTA, link or publication action. |
| DECISION-03 | CHOOSE_CONSUMER_FIRST | SECOND_CONTEXT_CANDIDATE_AFTER_OWNER_CHOICE | https://jus-tice.co.il/consumer-rights-israel/ | Choose consumer refund/cancellation as first demand-letter context, or keep parked. | 3 source packet rows; 1 matching demand-query rows; 154 demand-query impressions; live surface VERIFIED. | Owner/SEO/legal approval required before CMS, title/H1/meta/body, CTA, link or publication action. |
| DECISION-04 | CHOOSE_RENTAL_DISPUTE_FIRST | PARK_UNTIL_RENTAL_AGREEMENT_REVIEW_SETTLED | https://jus-tice.co.il/eviction-notice-israel/ | Choose rental-dispute demand letters only after rental-agreement copy is settled. | 3 source packet rows; 3 matching demand-query rows; 81 demand-query impressions; live surface VERIFIED. | Owner/SEO/legal approval required before CMS, title/H1/meta/body, CTA, link or publication action. |
| DECISION-05 | PARK_OTHER_DEMAND_LETTER_CONTEXTS | PARKED | MULTI_ROUTE_REVIEW | Park defamation, contractor, debt and other contexts until their own route packets exist. | 6 defamation-style rows and mixed non-target query rows exist in GSC; they should not be absorbed into employment/consumer/rental pages. | Do not broaden the first-context route to chase unrelated demand-letter queries. |

## Top Demand-Letter Queries

| query | context | impressions | clicks | ctr | position |
| --- | --- | --- | --- | --- | --- |
| מכתב התראה הוצאת דיבה | other_defamation | 244 | 0 | 0.00% | 74.3 |
| מכתב התראה לקבלן איחור במסירה | consumer | 154 | 0 | 0.00% | 71.8 |
| מכתב התראה בגין לשון הרע | other_defamation | 131 | 0 | 0.00% | 57.1 |
| מכתב התראה לשון הרע לדוגמא | other_defamation | 79 | 0 | 0.00% | 55.4 |
| מכתב התראה לשוכר דירה דוגמא | rental_dispute | 53 | 0 | 0.00% | 70 |
| דוגמא למכתב התראה לשוכר | rental_dispute | 24 | 0 | 0.00% | 69.2 |
| מכתב התראה על אי תשלום | generic_or_other | 22 | 0 | 0.00% | 88.1 |
| לשון הרע במכתב התראה | other_defamation | 21 | 0 | 0.00% | 88.3 |
| מכתב התראה לפני תביעה לשון הרע | other_defamation | 19 | 0 | 0.00% | 89.5 |
| דוגמא מכתב התראה לפני נקיטת הליכים | generic_or_other | 18 | 0 | 0.00% | 86.5 |
| מכתב פנייה למעסיק דוגמא | employment | 14 | 0 | 0.00% | 40.4 |
| דוגמא למכתב התראה לשון הרע | other_defamation | 13 | 0 | 0.00% | 63.1 |
| מכתב התראה מעורך דין דוגמא | generic_or_other | 12 | 0 | 0.00% | 63.2 |
| דוגמא לנוסח מכתב התראה | generic_or_other | 12 | 0 | 0.00% | 68 |
| כמה עולה מכתב התראה מעורך דין | generic_or_other | 9 | 0 | 0.00% | 74.2 |

## Source And Competitor Notes

| id | type | context | name | url | usable_takeaway | draft_instruction |
| --- | --- | --- | --- | --- | --- | --- |
| SRC-01 | official_reference | employment | Labor Court ODR service | https://odr-laborcourt.court.gov.il/odr.laborcourt.app/labor-court-client/Home | Employment disputes can involve a structured pre-court path, including rights checks and a warning letter before labor-court action. | Keep employment copy as a dispute-specific subsection and avoid turning the labor page into a generic legal-letter page. |
| SRC-02 | official_reference | employment | Ministry of Labor work-rights complaint service | https://www.gov.il/he/service/work-rights-violation-complaints | A regulatory complaint is different from private civil relief; the page should not imply one letter replaces legal route selection. | Mention lawyer review only as fit-check help before escalation, not as a guaranteed remedy. |
| SRC-03 | official_reference | consumer | Consumer Protection Authority complaint service | https://www.gov.il/he/service/filing_a_complaint_to_fair_trade_authority | Consumer complaints need transaction details, business details and supporting documents. | Consumer copy should ask for facts/evidence first and place any letter wording after refund/cancellation context. |
| SRC-04 | official_reference | consumer | Small Claims Court filing service | https://www.gov.il/he/service/filing_a_small_claim | Small claims can cover goods, services, cancellation, tenancy and other disputes, and evidence preparation matters. | Use this as a boundary: demand-letter help may precede small claims, but the public page should not promise litigation results. |
| SRC-05 | official_reference | rental_dispute | Enforcement Authority eviction-cancellation service | https://www.gov.il/he/service/cancellation_remove_from_an_asset | Eviction wording can sit in later enforcement stages, so public copy must distinguish warning/response from post-judgment eviction steps. | Keep rental-dispute demand-letter copy narrow and separated from lease-review copy and post-judgment enforcement content. |
| COMP-01 | competitor_pattern | generic_boundary | Asaf Pelleg warning-letter guide | https://pelleg-law.co.il/warning-letter/ | Competitor pattern explains purpose, timing, risks and why lawyer review can prevent damaging wording. | Jus-Tice should match practical usefulness but keep the generic page blocked and split by dispute type. |
| COMP-02 | competitor_pattern | generic_boundary | Yitzhak Goldstein warning-letter article | https://ygoldlaw.co.il/litigation-lawyer/articles/warning-letter/ | Competitor pattern emphasizes scope and complexity differences across disputes. | Avoid fixed pricing or broad promises; ask owner to choose one narrow context first. |
| COMP-03 | competitor_pattern | generic_boundary | Hatraa warning-letter guide | https://hatraa.co.il/warning-letter-the-complete-guide/ | Competitor pattern presents a broad guide, but broadness is exactly the cannibalization risk for Jus-Tice. | Use broad competitor coverage only as inspiration for checklist completeness, not route structure. |

## Owner Decision Template

| decision_id | owner_decision | route_to_approve | exact_copy_change | legal_reviewer | seo_reviewer | publication_allowed |
| --- | --- | --- | --- | --- | --- | --- |
| DECISION-01 | approve/edit/reject/park/needs_more_evidence | NEW_GENERIC_DEMAND_LETTER_ROUTE |  |  |  | NO |
| DECISION-02 | approve/edit/reject/park/needs_more_evidence | https://jus-tice.co.il/labor-lawyer/ |  |  |  | NO |
| DECISION-03 | approve/edit/reject/park/needs_more_evidence | https://jus-tice.co.il/consumer-rights-israel/ |  |  |  | NO |
| DECISION-04 | approve/edit/reject/park/needs_more_evidence | https://jus-tice.co.il/eviction-notice-israel/ |  |  |  | NO |
| DECISION-05 | approve/edit/reject/park/needs_more_evidence | MULTI_ROUTE_REVIEW |  |  |  | NO |

## Files

- Decision draft MD: .project-control\demand-letter-first-context-owner-decision-draft-2026-05-27.md
- Decision draft CSV: .project-control\demand-letter-first-context-owner-decision-draft-2026-05-27.csv
- Owner decision template CSV: .project-control\demand-letter-owner-decision-template-2026-05-27.csv

## Safety Statement

This is a private decision draft. A visitor should see help for a specific legal dispute, not a generic legal-letter product page or internal business reasoning.