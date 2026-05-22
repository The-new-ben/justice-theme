# Medical Malpractice Readiness Dashboard - 2026-05-22

## Status

FIXED documentation batch only. VERIFIED local generation completed. NOT VERIFIED public CMS state, GSC API export, legal/source review, redirects, canonicals, sitemap, taxonomy, and live internal links. BLOCKED for upload until owner approval gates below are cleared.

No public upload, redirect, canonical/noindex, sitemap, taxonomy, CMS, lawyer directory, lead/CRM, or related-content change was executed.

## Batch Completed

- Reviewed 249 planning rows across 9 lanes.
- Consolidated owner gates, current URL readiness, P0 support pages, clean slug route risks, internal link plan, source/legal gates, content inventory, URL migration, and cannibalization mapping.
- Flagged 63 high/protected/unknown-GSC risk rows and 86 blocked or approval-gated rows.
- Flagged 2 possible false-positive medical-malpractice cluster rows before they can pollute upload planning.
- Confirmed 4 clean-slug/route rows remain blocked before routing or redirects.

## Lane Counts

| lane | count |
| --- | --- |
| CANNIBALIZATION_GROUP | 1 |
| CLEAN_SLUG_ROUTE_REVIEW | 12 |
| CONTENT_INVENTORY_AUDIT | 72 |
| CURRENT_URL_READINESS | 23 |
| INTERNAL_LINK_PLAN | 38 |
| OWNER_DECISION_GATE | 8 |
| P0_SUPPORT_TO_HUB_MAP | 15 |
| SOURCE_LEGAL_GATE | 8 |
| URL_MIGRATION_MAP | 72 |

## Required Gates Before Upload

- BLOCKED: resolve duplicate public URL identity for `/medical-malpractice-lawyer/`.
- BLOCKED: run focused GSC API export before any redirect, canonical, or slug migration decision.
- BLOCKED: classify primary/support/merge/rewrite/keep roles for the medical-malpractice cannibalization group.
- BLOCKED: review and remove possible false-positive inventory rows from the medical-malpractice cluster.
- BLOCKED: complete source/legal/privacy review for medical causation, compensation, expert, and lead-intake claims.
- BLOCKED: approve internal links, sitemap inclusion, and redirect/canonical plan as one controlled batch.

## Highest Risk Rows

| row_id | lane | current_url | target_url_or_hub | readiness_status | traffic_risk | next_step |
| --- | --- | --- | --- | --- | --- | --- |
| MEDD-001 | OWNER_DECISION_GATE | https://jus-tice.co.il/medical-malpractice-lawyer/ | commercial pillar | DUPLICATE_IDENTITY_AND_LEGAL_REVIEW | PROTECTED_REVIEW | Approve duplicate identity review and side-by-side comparison |
| MEDD-002 | OWNER_DECISION_GATE | REFERENCE:MEDMAL-FEE-GSC-001 | fee cost support | OWNER_LEGAL_REVIEW_AND_PILLAR_COMPARISON | PROTECTED_REVIEW | Approve protect compare and support-or-merge review |
| MEDD-003 | OWNER_DECISION_GATE | REFERENCE:MEDMAL-BIRTH-HEBREW-GSC-001 | birth pregnancy old URL | OWNER_LEGAL_REVIEW_AND_SPLIT_PLAN | PROTECTED_REVIEW | Approve protect compare and split-or-merge review |
| MEDD-004 | OWNER_DECISION_GATE | /birth-injury/; /birth-injury-lawyer/; /birth-injury-causes/; /brain-damage-at-birth/; /malpractice-cerebral-palsy/ | birth injury support group | SOURCE_LEGAL_AND_MEDICAL_CAUSATION_REVIEW | PROTECTED_REVIEW | Approve parent support role and merge candidates |
| MEDD-005 | OWNER_DECISION_GATE | /anesthesia-medical-malpractice/; /surgical-errors-medical-malpractice/; /personal-injury/medical-malpractice/surgery/ | surgery anesthesia support group | SOURCE_LEGAL_AND_URL_STRATEGY_REVIEW | UNKNOWN_NEEDS_GSC | Approve support roles and nested URL strategy |
| MEDD-006 | OWNER_DECISION_GATE | /what-is-medical-malpractice-definition-examples/; /medical-malpractice-common-errors-doctors-hospitals/; /medical-ma... | definition common errors support | SOURCE_LEGAL_AND_UNIQUENESS_REVIEW | UNKNOWN_NEEDS_GSC | Approve informational support role |
| MEDD-007 | OWNER_DECISION_GATE | REFERENCE:MEDMAL-REPORT-LARGE-001 | report background | SOURCE_COPYRIGHT_INDEXATION_REVIEW | UNKNOWN_NEEDS_GSC | Approve source copyright and indexation review |
| MEDD-008 | OWNER_DECISION_GATE | TRAFFIC_MARVAD_GROUP; /criminal-negligence/; /medical-malpractice-in-the-united-states/; FUTURE_SLUG_GROUP | boundaries and future slugs | OWNER_APPROVAL_FOR_ROUTE_REDIRECT_CANONICAL_SITEMAP | UNKNOWN_NEEDS_GSC | Approve exclusions and future-only status |
| MEDD-009 | CURRENT_URL_READINESS | https://jus-tice.co.il/medical-malpractice-lawyer/ | REST ID 11607; REST ID 1130; fee article; birth/pregnancy page | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | UNKNOWN_NEEDS_GSC | DUPLICATE_IDENTITY_REVIEW_THEN_COMPARE |
| MEDD-010 | CURRENT_URL_READINESS | REFERENCE:MEDMAL-DUPLICATE-SAME-URL-001 | /medical-malpractice-lawyer/ | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | PROTECTED_REVIEW | CMS_IDENTITY_REVIEW_REQUIRED |
| MEDD-011 | CURRENT_URL_READINESS | REFERENCE:MEDMAL-FEE-GSC-001 | /medical-malpractice-lawyer/ | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | PROTECTED_REVIEW | PROTECT_COMPARE_SUPPORT_OR_MERGE_LATER |
| MEDD-012 | CURRENT_URL_READINESS | REFERENCE:MEDMAL-BIRTH-HEBREW-GSC-001 | /medical-malpractice-lawyer/; future birth/pregnancy slugs | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | PROTECTED_REVIEW | PROTECT_COMPARE_SPLIT_OR_MERGE_LATER |
| MEDD-013 | CURRENT_URL_READINESS | https://jus-tice.co.il/medical-malpractice-in-the-united-states/ | Israeli medical-malpractice pillar | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | UNKNOWN_NEEDS_GSC | SEPARATE_INTERNATIONAL_CONTEXT |
| MEDD-014 | CURRENT_URL_READINESS | https://jus-tice.co.il/anesthesia-medical-malpractice/ | /medical-malpractice-lawyer/; surgery support | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | UNKNOWN_NEEDS_GSC | KEEP_SUPPORT_SOURCE_REVIEW |
| MEDD-015 | CURRENT_URL_READINESS | https://jus-tice.co.il/personal-injury/medical-malpractice/surgery/ | /medical-malpractice-lawyer/; surgical-errors page | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | UNKNOWN_NEEDS_GSC | REVIEW_NESTED_URL_AND_SUPPORT_ROLE |
| MEDD-016 | CURRENT_URL_READINESS | https://jus-tice.co.il/surgical-errors-medical-malpractice/ | /medical-malpractice-lawyer/; anesthesia page | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | UNKNOWN_NEEDS_GSC | EXPAND_AFTER_SOURCE_REVIEW |
| MEDD-017 | CURRENT_URL_READINESS | https://jus-tice.co.il/medical-malpractice-vs-negligence-differences-israel/ | /medical-malpractice-lawyer/; definition page | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | UNKNOWN_NEEDS_GSC | KEEP_INFORMATIONAL_SUPPORT |
| MEDD-018 | CURRENT_URL_READINESS | https://jus-tice.co.il/what-is-medical-malpractice-definition-examples/ | /medical-malpractice-lawyer/ | OWNER_APPROVAL_REQUIRED_BEFORE_UPLOAD | PROTECTED_REVIEW | KEEP_INFORMATIONAL_SUPPORT |

_Showing 18 of 79 rows._

## P0 Support Traffic Signals

| row_id | current_url | target_url_or_hub | gsc_clicks | gsc_impressions | traffic_risk | notes |
| --- | --- | --- | --- | --- | --- | --- |
| MEDD-032 | https://jus-tice.co.il/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA-%D7%A8%D7%A4%... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 1 | 27275 | HIGH | Highest topic visibility; remove/avoid recommended language before public edit |
| MEDD-033 | https://jus-tice.co.il/%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%93%D7%99%D7%9F-%D7%9E%D7%95%D7%91%D7%99%D7%9C%D7%99%D7%9D-%... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 15 | 19549 | HIGH | Trust-claim risk; convert to factual checklist language |
| MEDD-034 | https://jus-tice.co.il/medical-malpractice-in-the-united-states/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | 18 | 10267 | HIGH | Keep as jurisdictional/support content; do not let it displace Israeli hub |
| MEDD-035 | https://jus-tice.co.il/%D7%94%D7%A7%D7%98%D7%A0%D7%AA-%D7%94%D7%95%D7%A6%D7%90%D7%95%D7%AA-%D7%AA%D7%91%D7%99%D7%A2%D... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 22 | 9670 | MEDIUM | Commercial pricing intent |
| MEDD-036 | https://jus-tice.co.il/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%95%D7%9E%D7%97%D7%99%D7%9D-%D7%A8%D7%A4%D7%95%D7%90%D... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 144 | 8191 | HIGH | Very high clicks; useful pre-lead education |
| MEDD-037 | https://jus-tice.co.il/cerebral-palsy/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | 21 | 7104 | MEDIUM | Connect carefully without implying every cerebral palsy case is malpractice |
| MEDD-038 | https://jus-tice.co.il/what-is-medical-malpractice-definition-examples/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | 0 | 4998 | MEDIUM | Needs merge review; useful top-of-funnel explainer |
| MEDD-039 | https://jus-tice.co.il/malpractice-cerebral-palsy/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | 0 | 4887 | MEDIUM | Needs content review; overlaps with cerebral palsy page |
| MEDD-040 | https://jus-tice.co.il/%D7%9E%D7%A7%D7%A8%D7%99-%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 1 | 4882 | MEDIUM | Needs content review; likely support-to-hub candidate |
| MEDD-041 | https://jus-tice.co.il/articles/%D7%9E%D7%A7%D7%A8%D7%99-%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA-%D7%A8%D7%A4%D7%95%D7%9... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 5 | 4642 | MEDIUM | Examples/case-law intent should guide users to evaluation |
| MEDD-042 | https://jus-tice.co.il/medical-malpractice-common-errors-doctors-hospitals/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | 0 | 4067 | MEDIUM | Needs content review; diagnosis/treatment-error cluster |
| MEDD-043 | https://jus-tice.co.il/anesthesia-medical-malpractice/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | 2 | 3296 | MEDIUM | Specific high-intent subtopic |
| MEDD-044 | https://jus-tice.co.il/articles/%D7%A9%D7%9B%D7%A8-%D7%98%D7%A8%D7%97%D7%94-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 1 | 2985 | MEDIUM | Pricing intent; no promises |
| MEDD-045 | https://jus-tice.co.il/%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA-%D7%91%D7%A0%... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 0 | 2309 | LOW_UNKNOWN | Remove/avoid recommended language before public edit |
| MEDD-046 | https://jus-tice.co.il/%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA-%D7%91%D7%94%D7%99%D... | https://jus-tice.co.il/medical-malpractice-lawyer/ | 1 | 1478 | MEDIUM | Good support page if factual and source-backed |

## Clean Slug Blockers

| row_id | current_url | role_or_topic | readiness_status | traffic_risk | notes |
| --- | --- | --- | --- | --- | --- |
| MEDD-047 | /birth-malpractice/ | clean birth-malpractice support slug | BLOCKED_BEFORE_ROUTE_OR_REDIRECT | ROUTE_RISK_404_CLEAN_SLUG | Dead clean slug; old Hebrew birth/pregnancy page has 661 birth impressions and 419 pregnancy impressions in prior own... |
| MEDD-048 | /pregnancy-malpractice/ | clean pregnancy-malpractice support slug | BLOCKED_BEFORE_ROUTE_OR_REDIRECT | ROUTE_RISK_404_CLEAN_SLUG | Dead clean slug; pregnancy demand overlaps with old Hebrew birth page in prior GSC evidence. |
| MEDD-049 | /diagnosis-malpractice/ | clean diagnosis-malpractice support slug | BLOCKED_BEFORE_ROUTE_OR_REDIRECT | ROUTE_RISK_404_CLEAN_SLUG | Dead clean slug; live diagnosis-specific page exists at /medical-malpractice-8271/. |
| MEDD-057 | old row 8400 encoded pregnancy/birth URL | pregnancy and birth malpractice | ROLE_REVIEW_REQUIRED | ROUTE_RISK_404_CLEAN_SLUG | Old encoded URL returned 404; proposed target was generic /medical-malpractice-lawyer/. |

## Possible False Positives

| row_id | lane | source_id | current_url | role_or_topic | next_step |
| --- | --- | --- | --- | --- | --- |
| MEDD-167 | CONTENT_INVENTORY_AUDIT | 5818 | http://jus-tice.co.il/%D7%91%D7%A7%D7%A9%D7%AA-%D7%A0%D7%A4%D7%92%D7%A2-%D7%A2%D7%91%D7%99%D7%A8%D7%94-%D7%9E%D7%99%D... | טופס בקשת נפגע עבירה לקבלת מידע על מהלך אשפוזו של נאשם בבית חולים | Remove or reclassify from medical-malpractice cluster before upload planning |
| MEDD-239 | URL_MIGRATION_MAP | 5818 | http://jus-tice.co.il/%D7%91%D7%A7%D7%A9%D7%AA-%D7%A0%D7%A4%D7%92%D7%A2-%D7%A2%D7%91%D7%99%D7%A8%D7%94-%D7%9E%D7%99%D... | טופס בקשת נפגע עבירה לקבלת מידע על מהלך אשפוזו של נאשם בבית חולים | Fix cluster assignment before using in migration decisions |

## Output Files

- `reports\medical-malpractice-readiness-dashboard-2026-05-22.csv`
- `reports\medical-malpractice-readiness-dashboard-2026-05-22.json`
- `project-control\medical-malpractice-readiness-dashboard-2026-05-22.csv`

## Next Recommended Action

Prepare the focused GSC API export and owner-facing medical-malpractice decision packet from this dashboard. Do not publish or redirect yet.
