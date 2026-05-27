# Tel Aviv Family Owner Publication Scope Packet - 2026-05-27

Status: TEL_AVIV_FAMILY_OWNER_PUBLICATION_SCOPE_PACKET_BLOCKED_OWNER_AND_EVIDENCE_FILL_REQUIRED_NO_PUBLIC_CHANGE
Target: /divorce-lawyer-tel-aviv/

Scope: private owner publication-scope decision packet only. It does not approve publication, create a CMS page, change title/H1/meta/body/internal links, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, message, call paid LLM APIs, or deploy.

## Source Chain

- Publication review (2026-05-27): TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER
- Focused GSC operator (2026-05-27): TEL_AVIV_FAMILY_GSC_EXPORT_OPERATOR_PACKET_READY_NO_API_NO_PUBLIC_CHANGE
- Lawyer readiness (2026-05-27): TEL_AVIV_FAMILY_LAWYER_READINESS_OWNER_PACKET_BLOCKED_OWNER_ADMIN_FILL_REQUIRED_NO_PUBLIC_CHANGE
- Legal/editor review (2026-05-27): TEL_AVIV_FAMILY_LEGAL_EDITOR_REVIEW_PACKET_BLOCKED_HUMAN_REVIEW_REQUIRED_NO_PUBLIC_CHANGE
- Internal overlap (2026-05-27): TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TA-OWNER-GATE-01 | scope_rows_ready | PASS_SCOPE_TEMPLATE_READY | 8 owner decision rows generated. | Owner fills approve/revise/reject/park decisions. |
| TA-OWNER-GATE-02 | evidence_blockers_still_open | BLOCKED_EVIDENCE_ROWS_REQUIRED | focused_gsc_not_filled \| lawyer_readiness_not_filled \| legal_editor_not_filled \| owner_scope_not_filled | Fill GSC, lawyer readiness, legal/editor and owner scope templates before any go decision. |
| TA-OWNER-GATE-03 | no_live_action_authorized | PASS_NO_LIVE_ACTION | This packet writes private repo artifacts only and records 0 public/CMS/SEO/CRM/contact/payment/email/uPress approvals. | Keep the target private until a later explicit owner-approved deploy packet exists. |

## Owner Decision Rows

| ID | Decision Area | Current Status | Required Owner Decision | Forbidden Now |
| --- | --- | --- | --- | --- |
| TA-OWNER-01 | target_url_and_route_creation | BLOCKED_OWNER_PUBLICATION_SCOPE_REQUIRED | Approve, reject or park exact future target URL /divorce-lawyer-tel-aviv/. | No CMS page, route creation, slug, redirect, canonical/noindex, sitemap, taxonomy or uPress action. |
| TA-OWNER-02 | content_scope | BLOCKED_SCOPE_REQUIRED | Approve whether the page may cover only local fit-check and request-preparation intent. | No broad divorce guide, legal advice, deadline, price, guarantee, ranking or outcome language. |
| TA-OWNER-03 | gsc_evidence_gate | BLOCKED_FOCUSED_GSC_EXPORT_FILL_REQUIRED | Confirm who will fill the GSC paste template and whether blank rows should keep the route private. | No publication, internal links, consolidation, redirect, canonical/noindex or sitemap decision from preliminary cache. |
| TA-OWNER-04 | lawyer_coverage_readiness | BLOCKED_OWNER_ADMIN_READINESS_FILL_REQUIRED | Confirm owner/admin will verify each visible Tel Aviv family-law profile before coverage language is used. | No best/recommended/ranked/paid/sponsored/guaranteed/available claim and no lawyer contact or profile edit. |
| TA-OWNER-05 | legal_editor_approval | BLOCKED_HUMAN_REVIEW_REQUIRED | Assign or approve a legal/editor reviewer for all rows in the fill template. | No final article/content generation, public title/H1/meta/body, FAQ schema or legal-service claims. |
| TA-OWNER-06 | internal_link_and_cta_scope | BLOCKED_OWNER_SEO_REVIEW_REQUIRED | Approve exact future links only after GSC/legal/editor gates pass: /divorce-lawyer/ and /lawyers/?city=tel-aviv&area=family-law. | No link insertion, CTA change, redirect, canonical/noindex, sitemap, taxonomy or public navigation change. |
| TA-OWNER-07 | post_publication_review_workflow | REFERENCE_ONLY_FUTURE_IF_DEPLOYED | Approve who reviews the page after any future owner-approved deployment. | No email, review URL claim, uPress pull or live QA because nothing was deployed. |
| TA-OWNER-08 | final_go_no_go | PUBLICATION_STILL_BLOCKED | Final owner decision must be approve / revise / reject / park after all evidence rows are filled. | No public route execution, CMS/database work, SEO setting changes, CRM/contact/payment/email or uPress action. |

## Fillable Template

Use .project-control/tel-aviv-family-owner-publication-scope-fill-template-2026-05-27.csv. 8 rows require owner decisions; blanks keep publication blocked.

## Future Post-Publication Checklist

| ID | Future Check | Required If Deployed | Similar/Cannibalizing Pages | Current Status |
| --- | --- | --- | --- | --- |
| TA-POST-01 | review_url | Record final review URL for /divorce-lawyer-tel-aviv/. | /divorce-lawyer/ \| /family-law/ \| /child-custody/ \| /child-support-calculator-2023/ \| /divorce-mediation/ \| /what-is-a-divorce-settlement-agreement/ \| /free-divorce-agreement-template/ \| /how-much-does-a-divorce-agreement-cost/ | not_deployed_not_applicable |
| TA-POST-02 | title_h1_meta_body | Confirm final public title/H1/meta/body match owner/legal/editor approved packet only. | /divorce-lawyer/ and all protected family/divorce associated routes. | not_deployed_not_applicable |
| TA-POST-03 | internal_links_and_directory_handoff | Confirm only approved links are present and directory path is /lawyers/?city=tel-aviv&area=family-law. | /divorce-lawyer/ \| /lawyers/?city=tel-aviv&area=family-law | not_deployed_not_applicable |
| TA-POST-04 | owner_email_if_public_update | Before any email, check Gmail for owner instruction emails; then send Hebrew review URL, content summary, concise review and cannibalization list if warranted. | All protected associated routes in this checklist. | not_deployed_not_applicable_no_email_now |

## Decision

This packet is the owner-facing scope gate for a future decision only. Publication remains blocked until focused GSC, lawyer readiness, legal/editor review and owner scope are all filled and reviewed together in a later private go/no-go packet.
