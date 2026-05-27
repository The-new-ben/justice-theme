# Tel Aviv Family GSC Cache Review - 2026-05-27

Status: TEL_AVIV_FAMILY_GSC_CACHE_REVIEW_READY_FOCUSED_EXPORT_REQUIRED_NO_PUBLIC_CHANGE
Source date: 2026-05-27

Scope: private Search Console cache review for `/divorce-lawyer-tel-aviv/`. This reads local `.reports/gsc` CSV files only. It does not call the GSC API, open OAuth, publish content, edit WordPress, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, create CRM records, send email/WhatsApp/TalkTo, create invoices/payments, or deploy.

## Summary

- Local query-page cache rows read: 3376
- Matching family/divorce cache rows: 203
- Exact local Tel Aviv divorce-lawyer rows in cache: 0
- Broad divorce-lawyer rows in cache: 84
- Focused export template rows: 60
- Public changes approved: 0

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TFG-GATE-01 | source_packets_available | PASS | Draft packet: TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE; overlap review: TEL_AVIV_FAMILY_INTERNAL_OVERLAP_READY_WITH_GSC_REVIEW_NO_PUBLIC_CHANGE. | Use this review as the preliminary GSC cache layer only. |
| TFG-GATE-02 | local_gsc_cache_available | PASS | 3376 query-page cache row(s) available under .reports/gsc. | Keep cache as preliminary because focused export timing/finality is not guaranteed. |
| TFG-GATE-03 | exact_local_query_evidence | REVIEW | 0 exact local Tel Aviv divorce-lawyer cache row(s). | Fill focused Search Console export rows before publication approval. |
| TFG-GATE-04 | broad_divorce_pillar_evidence | REVIEW | 84 broad divorce-lawyer row(s); status CURRENT_PILLAR_EXPORT_REQUIRED. | Compare current pillar with legacy/profile URLs in focused export. |
| TFG-GATE-05 | prior_family_gsc_finality | REVIEW | NOT_FINAL_BASELINE_FROM_EXISTING_CACHE_RUN_FOCUSED_GSC_EXPORT_NEXT | Do not use this cache review as final migration, canonical, noindex, sitemap or publication evidence. |
| TFG-GATE-06 | gsc_api_not_called | PASS | This tool reads local CSV cache files only and does not open OAuth or call the GSC API. | Owner/operator can manually export or run an approved GSC workflow later. |
| TFG-GATE-07 | no_public_or_live_action_authorized | PASS | Source packets and this review authorize 0 public/CMS/SEO/contact/payment/email/uPress actions. | Keep the Tel Aviv local page private until owner/legal/editor/publication gates are filled. |

## Cluster Findings

| Cluster | Cache Rows | Impressions | Clicks | Status | Top Pages | Next Action |
| --- | ---: | ---: | ---: | --- | --- | --- |
| exact_local_divorce_lawyer | 0 | 0 | 0 | FOCUSED_EXPORT_REQUIRED | none in local cache | Run focused GSC export before any publication or internal-link approval. |
| broad_divorce_lawyer | 84 | 1942 | 0 | CURRENT_PILLAR_EXPORT_REQUIRED | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ (1551 imp, 0 clicks) \| /עורכי-דין/עורכת-דין-מאיה-רוטנברג (181 imp, 0 clicks) \| /how-much-does-a-divorce-agreement-cost/ (135 imp, 0 clicks) \| /wp-content/uploads/2022/06/misradhamishpatim-women.pdf (43 imp, 0 clicks) | Focused export must compare current /divorce-lawyer/ against legacy/profile URLs. |
| documents_and_procedure | 31 | 527 | 0 | PROTECT_EXISTING_ROUTE_INTENT | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx (429 imp, 0 clicks) \| /strategic-divorce-cost-planning/ (27 imp, 0 clicks) \| /articles/חיוב-גט-גירושין-ודחיית-בקשת-האיש-לדון-ב/ (23 imp, 0 clicks) \| /פסד-חיוב-גט-בגין-מאיסות-אישה-בבעל-פירוד-ממושך-ומשניכר-כי-פני-הצדדים-לגירושין-1343730-1-ביהד-הגדול/ (16 imp, 0 clicks) | Preserve the existing route owner; local page may only reference after legal/editor approval. |
| settlement_mediation_agreement | 55 | 2707 | 2 | PROTECT_EXISTING_ROUTE_INTENT | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx (1926 imp, 2 clicks) \| /how-much-does-a-divorce-agreement-cost/ (376 imp, 0 clicks) \| /cancel-a-divorce-settlement-agreement/ (271 imp, 0 clicks) \| /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ (107 imp, 0 clicks) | Preserve the existing route owner; local page may only reference after legal/editor approval. |
| cost_consultation_price | 23 | 965 | 0 | PROTECT_EXISTING_ROUTE_INTENT | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ (489 imp, 0 clicks) \| /how-much-does-a-divorce-agreement-cost/ (456 imp, 0 clicks) \| /strategic-divorce-cost-planning/ (19 imp, 0 clicks) \| /divorce-mediation-cons-pros/ (1 imp, 0 clicks) | Preserve the existing route owner; local page may only reference after legal/editor approval. |
| urgent_local_help | 10 | 222 | 0 | CACHE_SIGNAL_LEGACY_OR_OTHER_PAGE | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ (132 imp, 0 clicks) \| /cancel-a-divorce-settlement-agreement/ (69 imp, 0 clicks) \| /עורך-דין-צוואות-וירושות/ (12 imp, 0 clicks) \| /עורכי-דין/עורכת-דין-מאיה-רוטנברג (5 imp, 0 clicks) | Use focused export to decide whether to consolidate, preserve or ignore before public copy. |

## Cache Row Preview

| Cluster | Query | Page | Impressions | Clicks | Position | Route Family |
| --- | --- | --- | ---: | ---: | ---: | --- |
| settlement_mediation_agreement | הסכם גירושין דוגמא | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 468 | 0 | 47.5 | attachment_or_pdf |
| broad_divorce_lawyer | עורך דין גירושין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 288 | 0 | 62.1 | other_existing_page |
| settlement_mediation_agreement | דוגמא להסכם גירושין | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 173 | 0 | 46.1 | attachment_or_pdf |
| settlement_mediation_agreement | הסכם גירושין מחיר | /how-much-does-a-divorce-agreement-cost/ | 156 | 0 | 58.6 | cost_article |
| cost_consultation_price | הסכם גירושין מחיר | /how-much-does-a-divorce-agreement-cost/ | 156 | 0 | 58.6 | cost_article |
| broad_divorce_lawyer | כמה עולה עורך דין גירושין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 146 | 0 | 71.5 | other_existing_page |
| cost_consultation_price | כמה עולה עורך דין גירושין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 146 | 0 | 71.5 | other_existing_page |
| settlement_mediation_agreement | הסכם גירושין לדוגמא | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 133 | 0 | 56.2 | attachment_or_pdf |
| settlement_mediation_agreement | ביטול הסכם גירושין | /cancel-a-divorce-settlement-agreement/ | 127 | 0 | 53.1 | other_existing_page |
| settlement_mediation_agreement | דוגמה להסכם גירושין | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 127 | 0 | 44.6 | attachment_or_pdf |
| broad_divorce_lawyer | עורך דין גירושין דיני משפחה וצוואות | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 123 | 0 | 30.9 | other_existing_page |
| urgent_local_help | עורך דין גירושין דיני משפחה וצוואות | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 123 | 0 | 30.9 | other_existing_page |
| broad_divorce_lawyer | גירושין עורך דין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 113 | 0 | 54.8 | other_existing_page |
| broad_divorce_lawyer | עורך דין גירושין מחיר | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 110 | 0 | 71.6 | other_existing_page |
| cost_consultation_price | עורך דין גירושין מחיר | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 110 | 0 | 71.6 | other_existing_page |
| documents_and_procedure | טופס הסכם גירושין להורדה | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 107 | 0 | 46.5 | attachment_or_pdf |
| settlement_mediation_agreement | טופס הסכם גירושין להורדה | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 107 | 0 | 46.5 | attachment_or_pdf |
| broad_divorce_lawyer | עלות עורך דין גירושין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 106 | 0 | 74.5 | other_existing_page |
| cost_consultation_price | עלות עורך דין גירושין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 106 | 0 | 74.5 | other_existing_page |
| documents_and_procedure | בקשה לאישור הסכם גירושין דוגמא | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 105 | 0 | 26.3 | attachment_or_pdf |
| settlement_mediation_agreement | בקשה לאישור הסכם גירושין דוגמא | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 105 | 0 | 26.3 | attachment_or_pdf |
| settlement_mediation_agreement | נוסח הסכם גירושין | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 103 | 0 | 55.9 | attachment_or_pdf |
| settlement_mediation_agreement | הסכם גירושין pdf | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 101 | 0 | 62.3 | attachment_or_pdf |
| settlement_mediation_agreement | הסכם גירושין בהסכמה דוגמא | /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx | 101 | 0 | 63.1 | attachment_or_pdf |
| broad_divorce_lawyer | עורך דין תותח לגירושין | /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 97 | 0 | 72 | other_existing_page |

## Editor Meaning

The local cache does not prove enough exact Tel Aviv divorce-lawyer demand to publish `/divorce-lawyer-tel-aviv/`. It does show broad, cost, agreement/template and procedure demand scattered across existing or legacy assets, so the local page must remain a narrow fit-check/preparation page and must not absorb pillar, cost, template, mediation, settlement, custody or calculator intent. The generated focused-export template is the next required GSC input before owner/publication approval.
