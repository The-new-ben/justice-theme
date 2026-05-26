# Low Hype / RV GSC Evidence Request - 2026-05-27

Status: GSC_EVIDENCE_REQUEST_READY_EXPORT_NOT_FILLED

Scope: private Search Console export request and decision template only. This does not call the GSC API, open OAuth, publish public content, change metadata/links, create CRM records, contact anyone, send email or deploy.

## Why This Exists

The RV SERP and route-overlap packets both point to the same blocker: before drafting any public copy, the team needs query/page evidence from GSC. This packet defines the exact filters, candidate pages and go/no-go rules.

## Summary

- Query filters: 5
- Candidate pages: 8
- Blank template rows: 40
- Decision rules: 5
- GSC API called: 0
- Public changes approved: 0

## Export Requests

| ID | Type | Input / Filter | Output Needed | Owner / Operator Action | Status |
| --- | --- | --- | --- | --- | --- |
| GSC-01 | query_page_export | rv_caravan_exact: קרוואן \| קראוון \| קרוואנים \| קראוונים \| caravan \| campervan \| motorhome \|\| rental_deposit_charge: השכרת קרוואן \| פיקדון קרוואן \| נזק קרוואן \| חיוב קרוואן \| ביטול השכרת קרוואן \| refund caravan \| caravan deposit \|\| consumer_small_claims: תביעה קרוואן \| תביעות קטנות קרוואן \| החזר קרוואן \| ביטול עסקה קרוואן \|\| insurance_claim: ביטוח קרוואן \| תביעת ביטוח קרוואן \| caravan insurance \| campervan insurance \|\| accident_traffic: תאונת קרוואן \| קנס קרוואן \| תעבורה קרוואן \| caravan accident \| RV accident | Export queries + pages + clicks + impressions + CTR + position for the last 16 months if available. | In Search Console Performance, filter query by each term cluster and export Query+Page rows. | OWNER_GSC_EXPORT_REQUIRED |
| GSC-02 | page_filter_export | /consumer-rights-israel/ \| /rental-agreement/ \| /small-claims-court-israel/ \| /contract-law-israel/ \| /eviction-notice-israel/ \| /real-estate-lawyer-guide/ \| /traffic-lawyer/ \| /lawyers/ | Export page-level and query-page rows for all candidate existing routes. | Export pages filtered to the listed routes, then paste rows into the template CSV. | OWNER_GSC_EXPORT_REQUIRED |
| GSC-03 | cannibalization_scan | same query appears on 2+ candidate pages or page intent splits across consumer/rental/insurance/traffic | Rows showing query, page, clicks, impressions, position and route family. | Mark every row with route_family and decision_status in the template. | OWNER_GSC_EXPORT_REQUIRED |
| GSC-04 | go_no_go_decision | filled template plus owner/legal review | One of: park idea, private-only intake, existing-route tiny section, or route-decision map. | Use decision rows DEC-01 through DEC-05 after the export is filled. | BLOCKED_UNTIL_EXPORT_FILLED |

## Query Filters

| ID | Cluster | Include Terms | Note | Purpose |
| --- | --- | --- | --- | --- |
| QF-01 | rv_caravan_exact | קרוואן \| קראוון \| קרוואנים \| קראוונים \| caravan \| campervan \| motorhome | Treat bare RV as ambiguous unless paired with rental/caravan/campervan/insurance/legal terms. | Detect whether there is any real Search Console demand around caravan/RV terms. |
| QF-02 | rental_deposit_charge | השכרת קרוואן \| פיקדון קרוואן \| נזק קרוואן \| חיוב קרוואן \| ביטול השכרת קרוואן \| refund caravan \| caravan deposit | This is the preferred first pilot cluster if demand exists. | Validate the consumer/rental dispute path. |
| QF-03 | consumer_small_claims | תביעה קרוואן \| תביעות קטנות קרוואן \| החזר קרוואן \| ביטול עסקה קרוואן | Do not infer legal advice from one query; use only as demand signal. | Check whether RV demand belongs to consumer/small-claims surfaces. |
| QF-04 | insurance_claim | ביטוח קרוואן \| תביעת ביטוח קרוואן \| caravan insurance \| campervan insurance | Insurance path is blocked as first pilot until lawyer/legal coverage review. | Separate insurance demand from rental/deposit disputes. |
| QF-05 | accident_traffic | תאונת קרוואן \| קנס קרוואן \| תעבורה קרוואן \| caravan accident \| RV accident | Accident/traffic path is blocked as first pilot unless GSC shows clear separate demand. | Prevent accident/traffic cannibalization. |

## Decision Rules After Export

| ID | Signal | Interpretation | Allowed Next Step | Blocked Action |
| --- | --- | --- | --- | --- |
| DEC-01 | No exact RV/caravan/campervan impressions | Keep RV as a private Low Hype parking-lot idea. | No public work. Recheck only if owner has WhatsApp/TalkTo/CRM lead evidence. | No standalone RV page, metadata, link, CRM flow or supplier outreach. |
| DEC-02 | Exact rental/deposit/charge queries show impressions on /consumer-rights-israel/ or /rental-agreement/ | Owner may review a narrow consumer/rental pilot, not a new route. | Prepare exact owner-review copy packet only after legal review. | No publish, no title/H1/meta, no internal link, no uPress. |
| DEC-03 | Queries split across consumer, rental, small-claims and contract pages | High cannibalization risk. Need one route owner and internal-link plan. | Build a route-decision map; keep public copy blocked. | No generic RV or demand-letter page. |
| DEC-04 | Most demand is insurance, accident or traffic | Do not use the consumer/rental pilot. Separate legal coverage is required. | Park until insurance/traffic lawyer supply and legal review exist. | No accident/insurance/traffic RV page or advice. |
| DEC-05 | One or more pages already get RV queries but page content has no RV markers | Potential thin-section opportunity, but only after source/legal review. | Owner may approve a tiny legal-help-first section draft packet. | No public edit without exact text approval and post-publication QA. |

## Template Preview

Blank rows generated in `.project-control/low-hype-rv-gsc-query-template-2026-05-27.csv`: 40.

## Safety Statement

This packet writes private repo artifacts only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import WhatsApp/TalkTo leads, send email, create invoices/payments, claim revenue, call the GSC API or require uPress deployment.
