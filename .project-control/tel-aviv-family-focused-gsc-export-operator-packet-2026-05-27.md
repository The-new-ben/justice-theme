# Tel Aviv Family Focused GSC Export Operator Packet - 2026-05-27

Status: TEL_AVIV_FAMILY_GSC_EXPORT_OPERATOR_PACKET_READY_NO_API_NO_PUBLIC_CHANGE
Target: /divorce-lawyer-tel-aviv/

Scope: private owner/operator packet only. It does not call the GSC API, open OAuth, automate login, bypass platform protections, publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, invoice, charge, email, or deploy.

## Source Chain

- Publication review (2026-05-27): TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER
- GSC cache review (2026-05-27): TEL_AVIV_FAMILY_GSC_CACHE_REVIEW_READY_FOCUSED_EXPORT_REQUIRED_NO_PUBLIC_CHANGE
- Focused template rows: 60
- Exact local cache rows: 0
- Broad divorce-lawyer cache rows: 84

## Manual Export Workflow

1. In an approved owner session, open Search Console for jus-tice.co.il and go to Performance / Search results.
2. Export Query + Page rows for each paste-template row using the page filter and the matching date window.
3. Use the query-cluster column as an offline reviewer filter; do not rely on wildcard UI behavior.
4. Paste query, page, clicks, impressions, CTR and position into the paste template. Mark checked zero-row cases explicitly in notes.
5. Reviewer fills reviewer_decision only after both date windows are checked. Blank rows keep publication blocked.

## Generated Files

- Operator packet: .project-control\tel-aviv-family-focused-gsc-export-operator-packet-2026-05-27.md
- Operator task CSV: .project-control\tel-aviv-family-focused-gsc-export-operator-packet-2026-05-27.csv
- Paste template: .project-control\tel-aviv-family-gsc-export-paste-template-2026-05-27.csv
- Machine report: .reports\tel-aviv-family-focused-gsc-export-operator-packet-2026-05-27.json

## Operator Gates

| ID | Step | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TA-GSC-OP-01 | open_gsc_manually | OWNER_OPERATOR_ACTION_REQUIRED | No GSC API/OAuth call is made by this packet. | Owner/operator opens Search Console manually in an approved logged-in session and selects the jus-tice.co.il property. |
| TA-GSC-OP-02 | export_query_page_rows | READY_TEMPLATE_ROWS | 60 focused source rows expand into 144 paste rows across two required date windows and legacy/profile cache checks. | Fill .project-control/tel-aviv-family-gsc-export-paste-template-2026-05-27.csv with Query + Page exports. |
| TA-GSC-OP-03 | prove_or_block_exact_local_demand | BLOCKED_FOCUSED_EXPORT_REQUIRED | Local GSC cache has 0 exact local rows; focused export template has 60 rows. | Fill target /divorce-lawyer-tel-aviv/, pillar /divorce-lawyer/, directory and protected route rows for exact local divorce-lawyer intent. |
| TA-GSC-OP-04 | protect_pillar_and_associated_routes | READY_REVIEW_BOUNDARY | Broad divorce-lawyer cache rows: 84; protected focused rows include 10 current route/page filters. | Compare target, pillar, family overview, custody, child support, mediation, settlement, template and cost rows before copy approval. |
| TA-GSC-OP-05 | inspect_legacy_profile_cache_pages | READY_LEGACY_PROFILE_REVIEW_ROWS | 24 paste rows added for top legacy/profile/attachment cache pages discovered in the local cache. | Use these only to understand current query ownership; do not consolidate, redirect, canonicalize or noindex from this packet. |
| TA-GSC-OP-06 | record_reviewer_decisions | READY_FILLABLE_REVIEW | Every paste row has reviewer_decision and notes_no_pii fields. | After exports are pasted, reviewer marks keep_private, local_target_supported, preserve_existing_owner, or needs_more_evidence. |
| TA-GSC-OP-07 | hold_publication_gate | PUBLICATION_STILL_BLOCKED | Focused GSC data, lawyer readiness, legal/editor approval and owner publication approval are still not filled. | Use the filled paste template as input for the next private go/no-go review only. |

## Current And Protected Pages To Export

| Page Filter | Role | Paste Rows | Date Ranges |
| --- | --- | ---: | --- |
| /divorce-lawyer-tel-aviv/ | target_private_local_page | 12 | last_16_months \| last_90_days |
| /divorce-lawyer/ | protected_divorce_lawyer_pillar | 12 | last_16_months \| last_90_days |
| /lawyers/?city=tel-aviv&area=family-law | canonical_tel_aviv_family_law_directory | 12 | last_16_months \| last_90_days |
| /family-law/ | protected_family_law_overview | 12 | last_16_months \| last_90_days |
| /child-custody/ | protected_child_custody_route | 12 | last_16_months \| last_90_days |
| /child-support-calculator-2023/ | protected_child_support_route | 12 | last_16_months \| last_90_days |
| /divorce-mediation/ | protected_mediation_route | 12 | last_16_months \| last_90_days |
| /what-is-a-divorce-settlement-agreement/ | protected_settlement_route | 12 | last_16_months \| last_90_days |
| /free-divorce-agreement-template/ | protected_template_route | 12 | last_16_months \| last_90_days |
| /how-much-does-a-divorce-agreement-cost/ | protected_cost_route | 12 | last_16_months \| last_90_days |

## Legacy/Profile Cache Pages To Inspect

| Page Filter | Cache Role | Paste Rows |
| --- | --- | ---: |
| /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | attachment_or_pdf | 2 |
| /wp-content/uploads/2022/06/misradhamishpatim-women.pdf | attachment_or_pdf | 2 |
| /עורכי-דין/עורכת-דין-מאיה-רוטנברג | lawyer_profile | 2 |
| /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | other_existing_page | 2 |
| /cancel-a-divorce-settlement-agreement/ | other_existing_page | 2 |
| /פסד-חיוב-גט-בגין-מאיסות-אישה-בבעל-פירוד-ממושך-ומשניכר-כי-פני-הצדדים-לגירושין-1343730-1-ביהד-הגדול/ | other_existing_page | 2 |
| /psakdin/הליכי-גירושין-מבחן-הזיקות-טענה-כי-בימ/ | case_law_page | 2 |
| /strategic-divorce-cost-planning/ | other_existing_page | 2 |
| /עורך-דין-צוואות-וירושות/ | other_existing_page | 2 |
| /articles/חיוב-גט-גירושין-ודחיית-בקשת-האיש-לדון-ב/ | legacy_article | 2 |
| /1520884-1/ | other_existing_page | 2 |
| /1331339-1/ | other_existing_page | 2 |

## Decision Rule

This packet prepares the evidence collection step only. The page remains private unless focused GSC rows, lawyer readiness, legal/editor copy approval and explicit owner publication approval are all filled in a later private review packet.
