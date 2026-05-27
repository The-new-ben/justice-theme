# Divorce Tel Aviv Evidence-Fill Packet - 2026-05-27

Status: DIVORCE_TEL_AVIV_EVIDENCE_FILL_READY_NO_PUBLIC_CHANGE

Scope: private evidence-fill packet for `/divorce-lawyer-tel-aviv/`. It does not publish content, edit WordPress, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, create CRM records, send email/WhatsApp/TalkTo, create invoices/payments, or deploy.

## Summary

- Target: /divorce-lawyer-tel-aviv/
- Target live status: 404
- Associated/cannibalization routes checked: 11
- Query clusters prepared for GSC fill: 6
- Source prompts: 3 official and 2 competitor.
- Canonical directory coverage route: /lawyers/?city=tel-aviv&area=family-law
- Local gates: 3/3 pass.
- Public actions: 0 approved; 0 CMS writes; 0 SEO changes; 0 emails; 0 uPress actions.

## Local Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| LOCAL-01 | priority_brief_exists | PASS | Prior priority draft-brief report is present and includes the Tel Aviv divorce target. | Use this packet as the next private evidence-fill layer. |
| LOCAL-02 | blank_evidence_row_exists | PASS | The prior evidence template still has a row for the target. | Fill GSC/lawyer/reviewer fields before any public action. |
| LOCAL-03 | public_boundary | PASS | This tool writes only dot-private .project-control and .reports artifacts. | Do not publish, update CMS, change SEO settings, contact people, invoice, email or deploy from this packet. |

## Route / Cannibalization Map

| ID | Path | Role | Status | Gate | H1 | Review Need |
| --- | --- | --- | ---: | --- | --- | --- |
| ROUTE-01 | /divorce-lawyer-tel-aviv/ | target_private_candidate | 404 | PASS_TARGET_NOT_PUBLIC_200 | העמוד לא נמצא | confirm target is not already public before private drafting continues |
| ROUTE-02 | /divorce-lawyer/ | central_divorce_pillar | 200 | PASS_PILLAR_REACHABLE | איך לבחור עורך דין גירושין \| ניסיון, מחיר ושאלות נכונות \| Jus-Tice | protect from local-page duplication and send broad intent here |
| ROUTE-03 | /family-law/ | family_law_hub | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | דיני משפחה | check whether family-law hub should link to the eventual local page only after approval |
| ROUTE-04 | /child-custody/ | specific_family_issue | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | משמורת ילדים וזמני שהות: איך מתכננים הסדר שמתאים לילדים | do not absorb custody advice into the Tel Aviv divorce page |
| ROUTE-05 | /child-support-calculator-2023/ | calculator_specific_intent | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | מחשבון מזונות ילדים 2023 | link only if user task genuinely needs child-support calculation context |
| ROUTE-06 | /divorce-mediation/ | mediation_specific_intent | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | גישור גירושין: מתי זה נכון, איך מתכוננים ומה חשוב לבדוק | avoid making the Tel Aviv page a mediation guide |
| ROUTE-07 | /what-is-a-divorce-settlement-agreement/ | settlement_agreement_article | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | הסכם גירושין | can support document checklist only after legal/editor review |
| ROUTE-08 | /free-divorce-agreement-template/ | template_article | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | הסכם גירושין דוגמא \| תבנית הסכם גירושין \| טופס הסכם גירושין בחינם | avoid promising that a template is enough for a local case |
| ROUTE-09 | /how-much-does-a-divorce-agreement-cost/ | cost_article | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | כמה עולה הסכם גירושין? \| עלות הסכם גירושין | do not copy price claims into a local lawyer page without review |
| ROUTE-10 | /lawyers/?city=tel-aviv&area=family-law | filtered_lawyer_directory | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | עורך דין דיני משפחה בתל אביב | canonical directory evidence route; public draft stays blocked until real filtered lawyer readiness is verified |
| ROUTE-11 | /lawyers/?city=tel-aviv&practice=family-law | unsupported_directory_alias | 200 | LIVE_ASSOCIATED_PAGE_REVIEW | עורכי דין בתל אביב | keep this out of publication gates unless a public alias fix is approved |

## Query Clusters To Fill

| ID | Cluster | Likely Intent | Draft Treatment | Gate |
| --- | --- | --- | --- | --- |
| QUERY-01 | exact_local_divorce_lawyer | User wants a divorce lawyer in Tel Aviv or nearby and may be ready to leave a request. | Short local triage, then route broad divorce questions to the central pillar and lawyer-fit questions to the filtered directory. | BLOCKED_PENDING_GSC |
| QUERY-02 | broad_divorce_lawyer | User is still comparing how to choose a divorce lawyer. | Keep this owned by the central pillar; local page may add only local fit and intake preparation. | BLOCKED_PENDING_GSC |
| QUERY-03 | documents_and_procedure | User needs to prepare documents or understand next procedural steps. | Checklist language only, source-aware, no deadlines or legal instructions. | REVIEW_REQUIRED |
| QUERY-04 | settlement_mediation_agreement | User is checking whether an agreement or mediation path is relevant. | Point to existing settlement/mediation articles instead of duplicating them. | REVIEW_REQUIRED |
| QUERY-05 | cost_consultation_price | User is comparing consultation or agreement costs. | Avoid price promises; link to cost article only if owner/legal review approves exact wording. | BLOCKED_NO_PRICE_CLAIMS |
| QUERY-06 | urgent_local_help | User may have a hearing, conflict escalation or urgent family-law need. | Use calm fit-check wording; do not promise emergency handling or response time. | BLOCKED_NO_SLA_CLAIMS |

## Source Prompts

| ID | Type | Title | URL | Use For | Boundary |
| --- | --- | --- | --- | --- | --- |
| SRC-001 | official | Israeli government divorce certificate service | https://www.gov.il/he/service/obtaining-divorce-certificate | official-document vocabulary and evidence checklist direction | Do not convert certificate-service details into legal advice, local court facts, timelines or eligibility claims. |
| SRC-002 | official | Israeli government legal aid application service | https://www.gov.il/he/service/legal_aid_application | eligibility-sensitive wording and alternatives for users who may need official help | Do not claim eligibility or promise representation; direct users to verify with official service or a lawyer. |
| SRC-003 | official | Assistance units near courts and religious courts | https://www.gov.il/he/departments/Units/molsa-court-assiatance-units | non-adversarial family-dispute context and source-aware wording | Do not describe a mandatory process, deadline or local office assignment unless legal/editor review confirms it. |
| SRC-004 | competitor | Gohar Law divorce-lawyer positioning reference | https://www.goharlaw.com/ | commercial SERP framing: experience, local service, family-law reassurance | Do not copy claims, rankings, testimonials, outcomes, price ranges, badges or personal positioning. |
| SRC-005 | competitor | Rotenberg Law divorce-lawyer positioning reference | https://rotenberglaw.co.il/ | commercial SERP framing: process reassurance, family-law coverage, trust cues | Do not copy claims, slogans, reviews, price ranges, badges or outcome promises. |

## Evidence Findings

| ID | Category | Finding | Implication | Gate | Owner Action |
| --- | --- | --- | --- | --- | --- |
| EVIDENCE-01 | target_status | /divorce-lawyer-tel-aviv/ live status is 404. | Safe to continue private draft preparation. | PASS_TARGET_NOT_PUBLIC_200 | Do not create or publish the page until all draft gates are filled. |
| EVIDENCE-02 | pillar_protection | /divorce-lawyer/ live status is 200. | Broad divorce-lawyer intent must stay with the central pillar. | PASS_PILLAR_REACHABLE | Confirm the local page will be a subordinate fit-check page, not a duplicate guide. |
| EVIDENCE-03 | lawyer_coverage | /lawyers/?city=tel-aviv&area=family-law live status is 200, but real filtered lawyer readiness is not verified. | Commercial path is visible, but public page remains blocked without verified Tel Aviv family-law coverage. | BLOCKED_PENDING_WP_ADMIN_REVIEW | Owner/admin must confirm filtered lawyer profile count and readiness. |
| EVIDENCE-04 | directory_parameter | Use /lawyers/?city=tel-aviv&area=family-law for coverage evidence; do not use /lawyers/?city=tel-aviv&practice=family-law unless a public alias fix is approved. | The page should not be approved from a city-only or incorrectly filtered directory signal. | PASS_CANONICAL_DIRECTORY_PARAM_CORRECTED | Keep future evidence and templates on the canonical area parameter. |
| EVIDENCE-05 | gsc_gap | The prior evidence template contains no clicks, impressions or average position for this target. | Publication and internal-link decisions would be guesswork. | BLOCKED_PENDING_GSC_EXPORT | Fill exact local, broad divorce, documents/procedure, mediation/agreement and price query rows. |
| EVIDENCE-06 | unique_angle | Best safe angle is local triage and request preparation for Tel Aviv divorce users. | The page can help commercially without replacing the divorce pillar or issue-specific articles. | REVIEW_REQUIRED | Approve one narrow angle before any Hebrew copy is prepared. |
| EVIDENCE-07 | forbidden_claims | No evidence supports best/recommended/ranked lawyer claims, price promises, emergency response, local court facts or legal instructions. | Draft must stay careful, user-first and source-aware. | PASS_WITH_RESTRICTIONS | Legal/editor review must remove any unsupported claims. |

## Private Draft Positioning

- Page role: short local fit-check and request-preparation page for users looking for divorce help in Tel Aviv.
- It should not become a full divorce guide; broad how-to content belongs on `/divorce-lawyer/`.
- It should not absorb custody, child support, mediation, agreement-template or cost intent; those routes stay separate unless GSC/legal/editor review says otherwise.
- Commercial CTA direction may be a quiet request/fit-check path, but only after verified filtered lawyer coverage exists.
- Directory coverage evidence must use `/lawyers/?city=tel-aviv&area=family-law`; `/lawyers/?city=tel-aviv&practice=family-law` is not proof of family-law filtering unless a public alias fix is separately approved.
- No best/recommended/ranked claims, price promises, response-time claims, local court facts, deadlines, eligibility claims or legal advice without source and legal/editor approval.

## Own Review

This target is a good private next step because the target URL is not public 200, the broad divorce pillar exists, and the SERP is clearly commercial. The remaining risk is cannibalization: a Tel Aviv page can be useful only if it stays local and practical while preserving the central divorce guide and issue-specific family-law articles. Publication should remain blocked until GSC, filtered lawyer coverage, legal/editor review and owner approval are filled.

## Next Blocked Inputs

- GSC export rows for exact local, broad divorce, documents/procedure, mediation/agreement and price clusters.
- Real wp-admin count of verified Tel Aviv family-law/divorce lawyer profiles.
- One approved unique angle and internal-link plan.
- Legal/editor approval for source-sensitive wording.
- Owner approval for exact public title/H1/body/internal links and publication method.
