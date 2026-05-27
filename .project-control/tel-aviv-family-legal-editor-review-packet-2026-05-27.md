# Tel Aviv Family Legal Editor Review Packet - 2026-05-27

Status: TEL_AVIV_FAMILY_LEGAL_EDITOR_REVIEW_PACKET_BLOCKED_HUMAN_REVIEW_REQUIRED_NO_PUBLIC_CHANGE
Target: /divorce-lawyer-tel-aviv/

Scope: private legal/editor review packet only. It does not generate final article content, call paid LLM APIs, publish CMS content, change title/H1/meta/body/internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, message, or deploy.

## Source Chain

- Publication review (2026-05-27): TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER
- Local draft packet (2026-05-27): TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE
- Internal overlap review (2026-05-27): TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE
- GSC export operator (2026-05-27): TEL_AVIV_FAMILY_GSC_EXPORT_OPERATOR_PACKET_READY_NO_API_NO_PUBLIC_CHANGE
- Lawyer readiness owner packet (2026-05-27): TEL_AVIV_FAMILY_LAWYER_READINESS_OWNER_PACKET_BLOCKED_OWNER_ADMIN_FILL_REQUIRED_NO_PUBLIC_CHANGE

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TA-LEG-GATE-01 | source_packets_available | PASS | Publication=TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER; GSC=TEL_AVIV_FAMILY_GSC_EXPORT_OPERATOR_PACKET_READY_NO_API_NO_PUBLIC_CHANGE; lawyer readiness=TEL_AVIV_FAMILY_LAWYER_READINESS_OWNER_PACKET_BLOCKED_OWNER_ADMIN_FILL_REQUIRED_NO_PUBLIC_CHANGE. | Use this packet as the legal/editor review surface only. |
| TA-LEG-GATE-02 | human_legal_editor_review_required | BLOCKED_REVIEWER_REQUIRED | 12 legal/editor review rows generated; none are human-approved. | Legal/editor fills the review template with approve/revise/reject decisions. |
| TA-LEG-GATE-03 | focused_gsc_still_required | BLOCKED_FOCUSED_GSC_EXPORT_FILL_REQUIRED | 144 GSC paste rows are prepared, but not filled. | Do not approve FAQ/title/link scope until focused GSC rows are filled. |
| TA-LEG-GATE-04 | lawyer_readiness_still_required | BLOCKED_OWNER_ADMIN_READINESS_FILL_REQUIRED | 1 lawyer readiness gate(s) remain blocked. | Owner/admin fills lawyer readiness template before coverage language is approved. |
| TA-LEG-GATE-05 | no_public_or_live_action_authorized | PASS_NO_LIVE_ACTION | This packet writes private repo artifacts only and authorizes 0 public/CMS/SEO/CRM/contact/payment/email/uPress actions. | Keep all output private until owner explicitly approves publication scope. |

## Legal Editor Review Rows

| ID | Section | Status | Review Focus | Forbidden Claims Or Changes |
| --- | --- | --- | --- | --- |
| TA-LEGAL-01 | title_h1_and_route_role | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm local page stays subordinate to /divorce-lawyer/ and does not become a general divorce guide. | No public title, H1, meta, slug, route, canonical/noindex, sitemap or internal-link change from this packet. |
| TA-LEGAL-02 | intro_opening | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm wording is informational, local-fit oriented and not legal advice. | No guarantee, deadline, court/local-office claim, price, ranking, best-lawyer or outcome claim. |
| TA-LEGAL-03 | preparation_checklist | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm checklist is framed as preparation only and does not say every item is legally required. | No mandatory-process claim unless official source and legal review support it for the exact case type. |
| TA-LEGAL-04 | lawyer_fit_trigger | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm when-to-contact wording is careful and does not imply urgency, SLA, availability or result. | No emergency, response-time, success, suitability guarantee or availability promise. |
| TA-LEGAL-05 | internal_links_and_cta_boundaries | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm any future link plan protects the pillar and uses only canonical area= directory path. | No internal link, CTA, route, redirect, canonical/noindex, sitemap or taxonomy change from this packet. |
| TA-LEGAL-06 | faq_candidates | BLOCKED_GSC_OR_OWNER_EVIDENCE_REQUIRED | FAQ candidates need GSC, lead, owner or legal/editor evidence before use. | No FAQ schema or public FAQ body until evidence and legal/editor review are complete. |
| TA-LEGAL-07 | official_source_boundaries | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm official sources are used only for document/checklist/service-context boundaries. | No eligibility, mandatory-process, deadline or certificate-service claim beyond source-supported wording. |
| TA-LEGAL-08 | competitor_source_boundaries | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Use competitor pages only for SERP context; do not copy claims or positioning. | No copied testimonials, rankings, case outcomes, badges, price ranges or personal positioning. |
| TA-LEGAL-09 | protected_route_overlap | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm custody, child support, mediation, settlement, template and cost intents stay with existing route owners. | No absorbing protected route intent into the Tel Aviv local page without explicit legal/editor approval. |
| TA-LEGAL-10 | lawyer_coverage_language | BLOCKED_OWNER_ADMIN_READINESS_REQUIRED | Confirm the page does not imply selected, ranked, paid, sponsored, verified, available or guaranteed coverage. | No best/recommended/ranked/sponsored/paid/guaranteed language; no contact details or lawyer outreach. |
| TA-LEGAL-11 | gsc_dependency_and_query_scope | BLOCKED_FOCUSED_GSC_EXPORT_REQUIRED | Confirm final copy and FAQ choices wait for focused GSC evidence. | No publication, FAQ/schema, internal links, consolidation, redirect, canonical/noindex or sitemap decision from preliminary cache. |
| TA-LEGAL-12 | final_disclaimer_and_forbidden_claims | HUMAN_LEGAL_EDITOR_REVIEW_REQUIRED | Confirm final disclaimer and forbidden-claim list for a local legal-services page. | No legal advice, outcome guarantee, price, deadline, urgent SLA, ranking, recommendation, paid proof, profile availability or unsupported court/local-office claim. |

## Fillable Template

Use .project-control/tel-aviv-family-legal-editor-fill-template-2026-05-27.csv. 12 rows require human legal/editor decisions; blanks keep publication blocked.

## Decision

This packet narrows the legal/editor review work to exact rows, but it does not approve publication. Focused GSC rows, owner/admin lawyer readiness, legal/editor decisions and explicit owner publication scope are still required before any public page work.
