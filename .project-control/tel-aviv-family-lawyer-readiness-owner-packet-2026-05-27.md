# Tel Aviv Family Lawyer Readiness Owner Packet - 2026-05-27

Status: TEL_AVIV_FAMILY_LAWYER_READINESS_OWNER_PACKET_BLOCKED_OWNER_ADMIN_FILL_REQUIRED_NO_PUBLIC_CHANGE
Target: /divorce-lawyer-tel-aviv/
Canonical directory: /lawyers/?city=tel-aviv&area=family-law

Scope: private owner/admin readiness packet only. It does not edit lawyer profiles, contact lawyers or clients, export contact details, create CRM records, invoice, charge, publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemaps/taxonomies, email, message, or deploy.

## Source Chain

- Publication review (2026-05-27): TEL_AVIV_FAMILY_PUBLICATION_REVIEW_BLOCKED_FOCUSED_GSC_LEGAL_OWNER
- Directory coverage QA (2026-05-27): DIRECTORY_COVERAGE_QA_FOUND_FILTER_ALIAS_GAP_NO_PUBLIC_CHANGE
- Visible canonical cards in source QA: 3
- Owner/admin fill rows: 3

## Readiness Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TA-LR-GATE-01 | canonical_directory_visible_coverage | PASS_VISIBLE_COVERAGE_PRESENT | /lawyers/?city=tel-aviv&area=family-law status 200 with 3 public card(s); publication gate says: REVIEW_COVERAGE_PRESENT_NOT_FINAL. | Use this as visible coverage only; owner/admin still has to verify readiness. |
| TA-LR-GATE-02 | card_level_rows_available | PASS_CARD_ROWS_READY | Read-only public fetch returned 200 and extracted 3 card row(s). | Owner/admin fills one readiness row per card before any public copy or link plan uses this coverage. |
| TA-LR-GATE-03 | basic_or_claim_cards_need_verification | BLOCKED_OWNER_ADMIN_VERIFICATION_REQUIRED | 2 card row(s) are public-basic or claim-flow cards that cannot be treated as final local-page coverage without owner/admin review. | Verify profile owner/permission, source-gated details, current fit and display readiness in private admin evidence. |
| TA-LR-GATE-04 | paid_or_sponsored_claims_absent | PASS_NO_PAID_OR_SPONSORED_PUBLIC_CLAIM | 0 visible card row(s) include paid/sponsored class markers in the public directory extract. | Keep local-page language neutral and avoid commercial quality claims. |
| TA-LR-GATE-05 | publication_still_blocked | PUBLICATION_STILL_BLOCKED | Focused GSC evidence, legal/editor approval and owner publication approval remain unfilled. | Use the filled owner/admin template as input to a later private go/no-go packet only. |

## Visible Card Readiness Rows

| ID | Display Name | Profile Path | Public Card Type | Readiness Status | Required Owner/Admin Checks |
| --- | --- | --- | --- | --- | --- |
| TA-LAWYER-01 | עו"ד מאיה רוטנברג | /lawyers/advocate-maya-rotenberg/ | profile_card | REVIEW_OWNER_ADMIN_VERIFICATION_REQUIRED | verify license/source identity in private admin evidence \| confirm family-law/divorce fit for Tel Aviv local page \| confirm profile ownership or display permission where relevant \| confirm current availability for inbound local inquiries \| confirm no ranking/best/sponsored/paid claim is implied \| confirm no unsupported price/outcome/response-time claim is attached |
| TA-LAWYER-02 | עורכת דין הילה וינטרוב | /lawyers/public-basic-hila-weintraub/ | public_basic_index | BLOCKED_PUBLIC_BASIC_OR_CLAIM_VERIFICATION_REQUIRED | verify license/source identity in private admin evidence \| confirm family-law/divorce fit for Tel Aviv local page \| confirm profile ownership or display permission where relevant \| confirm current availability for inbound local inquiries \| confirm no ranking/best/sponsored/paid claim is implied \| confirm no unsupported price/outcome/response-time claim is attached |
| TA-LAWYER-03 | משרד עורכי דין יצחקי פריד | /lawyers/public-basic-yitzhaki-frid/ | public_basic_index | BLOCKED_PUBLIC_BASIC_OR_CLAIM_VERIFICATION_REQUIRED | verify license/source identity in private admin evidence \| confirm family-law/divorce fit for Tel Aviv local page \| confirm profile ownership or display permission where relevant \| confirm current availability for inbound local inquiries \| confirm no ranking/best/sponsored/paid claim is implied \| confirm no unsupported price/outcome/response-time claim is attached |

## Fillable Template

Use .project-control/tel-aviv-family-lawyer-readiness-fill-template-2026-05-27.csv. Blank owner/admin fields keep publication blocked.

## Decision

The canonical directory has visible Tel Aviv family-law cards, but that is still not final publication coverage. The owner/admin must verify identity, field fit, local fit, permission, availability and no unsupported commercial claim before this coverage can support any public local-page work.
