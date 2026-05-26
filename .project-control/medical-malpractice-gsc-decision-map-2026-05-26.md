# Medical Malpractice GSC Decision Map - 2026-05-26

## Status

FIXED local decision workflow. VERIFIED local generation completed. NOT VERIFIED FINAL: this is a baseline dashboard map until the focused GSC export runs.

No public CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link write, lawyer-card, schema or CRM change was executed.

## Batch

- Decision rows: 187
- Protected URL rows: 178
- Source/legal gate rows: 8
- High/protected/unknown-GSC risk rows: 26
- Cannibalization rows: 1

## Required Gates

- BLOCKED: resolve duplicate CMS identity for `/medical-malpractice-lawyer/`.
- BLOCKED: run focused GSC export before any redirect, canonical, noindex, sitemap or slug action.
- BLOCKED: complete source/legal/privacy review before medical content upload.
- BLOCKED: approve primary/support/merge/rewrite/keep roles before internal-link or related-content writes.

## Highest Risk Rows

| group | path | mapped_target | risk | proposed_action | status |
| --- | --- | --- | --- | --- | --- |
| medical_primary_target | /medical-malpractice-lawyer/ | REST ID 11607; REST ID 1130; fee article; birth/pregnancy page | PROTECTED_REVIEW | DUPLICATE_IDENTITY_REVIEW_THEN_CURRENT_URL_UPDATE_ONLY_AFTER_OWNER_APPROVAL | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /medical-malpractice-in-the-united-states/ | Israeli medical-malpractice pillar | UNKNOWN_NEEDS_GSC | KEEP_SEPARATE_INTERNATIONAL_CONTEXT_DO_NOT_MERGE_INTO_ISRAELI_SERVICE_HUB | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /anesthesia-medical-malpractice/ | /medical-malpractice-lawyer/; surgery support | UNKNOWN_NEEDS_GSC | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /personal-injury/medical-malpractice/surgery/ | /medical-malpractice-lawyer/; surgical-errors page | UNKNOWN_NEEDS_GSC | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /surgical-errors-medical-malpractice/ | /medical-malpractice-lawyer/; anesthesia page | UNKNOWN_NEEDS_GSC | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /medical-malpractice-vs-negligence-differences-israel/ | /medical-malpractice-lawyer/; definition page | UNKNOWN_NEEDS_GSC | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /what-is-medical-malpractice-definition-examples/ | /medical-malpractice-lawyer/ | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /medical-malpractice-common-errors-doctors-hospitals/ | /medical-malpractice-lawyer/; definition page | UNKNOWN_NEEDS_GSC | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /birth-injury/ | /medical-malpractice-lawyer/; old birth/pregnancy page | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /birth-injury-lawyer/ | /birth-injury/; future birth-malpractice slug | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /birth-injury-causes/ | /birth-injury/ | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /brain-damage-at-birth/ | /birth-injury/; old birth/pregnancy page | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /malpractice-cerebral-palsy/ | /birth-injury/; old birth/pregnancy page | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /pregnancy-malpractice/ | current support pages and old Hebrew URLs | PROTECTED_REVIEW | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A8%D7%A9%D7%9C%D7%A0%D7%95%D7%AA-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA-% | https://jus-tice.co.il/medical-malpractice-lawyer/ | HIGH | KEEP_URL_REWRITE_TRUST_CLAIMS_AFTER_OWNER_REVIEW | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /%D7%A2%D7%95%D7%A8%D7%9B%D7%99-%D7%93%D7%99%D7%9F-%D7%9E%D7%95%D7%91%D7%99%D7%9C%D7%99%D7%9D-%D7%91%D7%AA%D7%97%D7%95%D | https://jus-tice.co.il/medical-malpractice-lawyer/ | HIGH | KEEP_URL_REWRITE_TRUST_CLAIMS_AFTER_OWNER_REVIEW | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /medical-malpractice-in-the-united-states/ | https://jus-tice.co.il/medical-malpractice-lawyer/ | HIGH | KEEP_SEPARATE_INTERNATIONAL_CONTEXT_DO_NOT_MERGE_INTO_ISRAELI_SERVICE_HUB | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |
| medical_protected_support | /%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%95%D7%9E%D7%97%D7%99%D7%9D-%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%99%D7%9D-%D7%9C%D | https://jus-tice.co.il/medical-malpractice-lawyer/ | HIGH | KEEP_LIVE_REVIEW_ROLE_BEFORE_UPLOAD_OR_LINK_CHANGE | NOT_FINAL_BASELINE_PENDING_FOCUSED_GSC_EXPORT |

_Showing 18 of 26 rows._

## Cannibalization Rows

| source | query | page_count | total_clicks | total_impressions | risk | proposed_action |
| --- | --- | --- | --- | --- | --- | --- |
| DASHBOARD_BASELINE_NOT_FINAL | NEEDS_MANUAL_INTENT_REVIEW |  |  |  | UNKNOWN_NEEDS_GSC | CHOOSE_PRIMARY_SUPPORT_MERGE_REWRITE_KEEP_AND_REDIRECT_LATER_ROLES |

## Output Files

- `.reports\medical-malpractice-gsc-decision-map-2026-05-26.csv`
- `.reports\medical-malpractice-protected-url-decision-map-2026-05-26.csv`
- `.reports\medical-malpractice-cannibalization-decision-map-2026-05-26.csv`
- `.reports\medical-malpractice-gsc-decision-map-2026-05-26.json`
