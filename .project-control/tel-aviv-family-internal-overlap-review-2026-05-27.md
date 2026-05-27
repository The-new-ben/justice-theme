# Tel Aviv Family Internal Overlap Review - 2026-05-27

Status: TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE
Source date: 2026-05-27

Scope: private anti-cannibalization review for `/divorce-lawyer-tel-aviv/`. This does not create or publish a route, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemap/taxonomies, contact anyone, create CRM records, invoice, charge, email, or deploy.

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TAO-GATE-01 | source_packets_available | PASS | Draft packet: TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE; evidence packet: DIVORCE_TEL_AVIV_EVIDENCE_FILL_READY_NO_PUBLIC_CHANGE. | Use this as an internal overlap layer only. |
| TAO-GATE-02 | target_still_private | PASS | /divorce-lawyer-tel-aviv/ live status is 404 with gate PASS_TARGET_NOT_PUBLIC_200. | Do not create or publish the local URL from this review. |
| TAO-GATE-03 | primary_pillar_preserved | PASS | /divorce-lawyer/ status 200; decision PRESERVE_AS_PRIMARY_PILLAR. | Keep broad divorce-lawyer intent on the pillar. |
| TAO-GATE-04 | associated_routes_mapped | PASS | 11 associated route(s) mapped; 10 live 200 route(s) need preservation rules. | Use the table to prevent the local page from absorbing issue, cost, mediation or template intent. |
| TAO-GATE-05 | export_snapshots_available | PASS | 1220 URL export row(s) and 1707 internal-link export row(s) available. | Refresh exports before publication review if the site changes. |
| TAO-GATE-06 | high_risk_overlap_marked_protected | PASS | 5 high-risk overlap route(s) are marked with protect/preserve/exclude decisions. | Do not include price, calculator, template or broad pillar content in the local draft. |
| TAO-GATE-07 | gsc_evidence_still_required | REVIEW | The source evidence packet still has GSC rows blank; this review fills internal overlap, not search performance. | Owner/operator should provide GSC query/page rows before public approval. |
| TAO-GATE-08 | no_public_or_live_action_authorized | PASS | Draft packet has 0 public/CMS/SEO/CRM/contact/payment/email approvals and no uPress requirement. | Keep this review private until explicit publication approval exists. |

## Overlap Decisions

| Route | Role | Live | Risk | Decision | Protected Intent | Allowed Relationship |
| --- | --- | ---: | --- | --- | --- | --- |
| /divorce-lawyer-tel-aviv/ | target_private_candidate | 404 | none_while_404 | KEEP_PRIVATE_DRAFT_ONLY | future local fit-check and preparation page only | No public route until owner/SEO/legal approval. |
| /divorce-lawyer/ | central_divorce_pillar | 200 | high_if_local_page_repeats_broad_guide | PRESERVE_AS_PRIMARY_PILLAR | broad divorce-lawyer guidance, experience, price and decision questions | Local page may link to this as the main divorce guide; broad how-to-choose content stays here. |
| /family-law/ | family_law_hub | 200 | medium_if_local_page_becomes_family_hub | PRESERVE_AS_FAMILY_HUB | general family-law category and related family disputes | Potential supporting link only after approval; do not duplicate family-law overview. |
| /child-custody/ | specific_family_issue | 200 | medium_if_local_page_adds_issue_advice | PROTECT_ISSUE_SPECIFIC_PAGE | custody or other specific family-law issue intent | Mention only as a possible related topic; link only if legal/editor review approves. |
| /child-support-calculator-2023/ | calculator_specific_intent | 200 | high_if_local_page_adds_calculator_or_formula_claims | PROTECT_CALCULATOR_INTENT | child-support calculation intent | Do not summarize calculation logic; link later only if the user task genuinely needs it. |
| /divorce-mediation/ | mediation_specific_intent | 200 | medium_if_local_page_becomes_mediation_guide | PROTECT_MEDIATION_INTENT | divorce mediation guide intent | Do not explain mediation process beyond a review-only related-page pointer. |
| /what-is-a-divorce-settlement-agreement/ | settlement_agreement_article | 200 | medium_if_local_page_explains_agreement_terms | PROTECT_SETTLEMENT_EXPLANATION | settlement agreement explanation intent | May inform the document checklist after legal/editor review; avoid agreement drafting advice. |
| /free-divorce-agreement-template/ | template_article | 200 | high_if_local_page_promises_template_suffices | PROTECT_TEMPLATE_INTENT | free divorce agreement template intent | Do not imply template is enough; link only after owner/legal approval. |
| /how-much-does-a-divorce-agreement-cost/ | cost_article | 200 | high_if_local_page_adds_prices | PROTECT_COST_INTENT | divorce agreement cost and price comparison intent | No price claims; link only if owner/legal approves exact cost wording. |
| /lawyers/?city=tel-aviv&area=family-law | filtered_lawyer_directory | 200 | low_if_used_as_directory_path | USE_CANONICAL_AREA_DIRECTORY_ONLY | lawyer directory filtering for Tel Aviv family law | Use as canonical filtered lawyer path in private planning only. |
| /lawyers/?city=tel-aviv&practice=family-law | unsupported_directory_alias | 200 | high_if_used_as_coverage_proof | EXCLUDE_FROM_DRAFT_LINK_PLAN | none; unsupported alias is city-only/generic in current checks | QA warning only; do not use in draft or public internal links. |

## Editor Meaning

The Tel Aviv local page may only cover local fit-check and preparation intent. Broad divorce-lawyer guidance stays on `/divorce-lawyer/`; general family-law overview stays on `/family-law/`; custody, child support, mediation, settlement agreement, template and cost intents stay with their existing pages. GSC evidence, legal/editor approval and owner approval remain required before any public route or CMS work.
