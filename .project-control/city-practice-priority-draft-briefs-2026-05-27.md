# City/Practice Priority Draft Briefs - 2026-05-27

Status: CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_BLOCKED_NO_PUBLIC_CHANGE

Scope: private owner/editor draft brief packet for the first two approved city/practice targets. It does not publish content, edit WordPress, change SEO settings, contact leads/lawyers, create CRM records, send email, or deploy.

## Summary

- Priority targets: 2.
- Static/live gates: 4/6 pass.
- Own-site live checks: 8.
- Source prompts: 9 total; 5 official; 4 competitor.
- Public actions: 0 CMS writes, 0 public page changes, 0 SEO setting changes, 0 CRM/contact/payment/email actions.

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| CPD-GATE-01 | previous_city_practice_packet_exists | PASS | Prior city/practice thin-page packet exists in .reports. | Use its target order and blockers. |
| CPD-GATE-02 | priority_targets_not_public_200 | REVIEW | 1 target URL(s) returned live 200. | Inspect accidental public exposure before creating any draft. |
| CPD-GATE-03 | central_pillars_reachable | PASS | 2/2 central pillar URLs reachable. | Keep local draft subordinate to the reachable pillar. |
| CPD-GATE-04 | source_scaffold_ready | PASS | 5 official source prompts and 4 competitor source prompts recorded. | Use sources for direction and guardrails only; no copying or legal advice. |
| CPD-GATE-05 | directory_filter_param_policy | PASS | 2/2 priority directory paths use area=; 2 practice= alias path(s) retained as review-only references. | Do not use practice= in draft or public links unless alias support is explicitly implemented and deployed. |
| CPD-GATE-06 | canonical_directory_live_coverage | BLOCKED | 1 canonical directory URL(s) failed filtered-title/H1 or lawyer-card coverage. | Do not rely on the filtered directory path for draft/internal-link planning until coverage is fixed or replaced. |

## Live Own-Site Checks

| ID | Slug | Role | Status | Gate | URL | H1 | Lawyer Cards |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CPD-01-PILLAR | divorce-lawyer-tel-aviv | central_pillar_live_check | 200 | PASS_PILLAR_REACHABLE | https://jus-tice.co.il/divorce-lawyer/ | איך לבחור עורך דין גירושין \| ניסיון, מחיר ושאלות נכונות \| Jus-Tice | 3 |
| CPD-01-TARGET | divorce-lawyer-tel-aviv | draft_target_public_exposure_check | 404 | PASS_TARGET_NOT_PUBLIC_200 | https://jus-tice.co.il/divorce-lawyer-tel-aviv/ | העמוד לא נמצא | 0 |
| CPD-01-DIRECTORY | divorce-lawyer-tel-aviv | canonical_directory_live_check | 200 | PASS_CANONICAL_DIRECTORY_FILTER_REACHABLE | https://jus-tice.co.il/lawyers/?city=tel-aviv&area=family-law | עורך דין דיני משפחה בתל אביב | 3 |
| CPD-01-UNSUPPORTED-DIRECTORY | divorce-lawyer-tel-aviv | unsupported_directory_alias_live_check | 200 | PASS_UNSUPPORTED_ALIAS_NOT_FILTERED_DO_NOT_USE | https://jus-tice.co.il/lawyers/?city=tel-aviv&practice=family-law | עורכי דין בתל אביב | 3 |
| CPD-02-PILLAR | criminal-lawyer-jerusalem | central_pillar_live_check | 200 | PASS_PILLAR_REACHABLE | https://jus-tice.co.il/criminal-lawyer/ | קטגוריה: משפט פלילי | 0 |
| CPD-02-TARGET | criminal-lawyer-jerusalem | draft_target_public_exposure_check | 200 | REVIEW_TARGET_ALREADY_PUBLIC | https://jus-tice.co.il/criminal-lawyer-jerusalem/ | עורך דין פלילי ירושלים \| ייצוג, מחירים ובתי משפט \| Jus-Tice | 0 |
| CPD-02-DIRECTORY | criminal-lawyer-jerusalem | canonical_directory_live_check | 200 | BLOCKED_CANONICAL_DIRECTORY_FILTER_GENERIC_OR_EMPTY | https://jus-tice.co.il/lawyers/?city=jerusalem&area=criminal-law | עורך דין משפט פלילי בירושלים | 0 |
| CPD-02-UNSUPPORTED-DIRECTORY | criminal-lawyer-jerusalem | unsupported_directory_alias_live_check | 200 | PASS_UNSUPPORTED_ALIAS_NOT_FILTERED_DO_NOT_USE | https://jus-tice.co.il/lawyers/?city=jerusalem&practice=criminal-law | עורכי דין בירושלים | 2 |

## Draft Brief Rows

| ID | Slug | Title | Target Gate | Pillar | Canonical Directory | Directory Gate | Cards | Unsupported Alias | Draft Role | Publication Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CPD-01 | divorce-lawyer-tel-aviv | עורך דין גירושין בתל אביב | PASS_TARGET_NOT_PUBLIC_200 | /divorce-lawyer/ | /lawyers/?city=tel-aviv&area=family-law | PASS_CANONICAL_DIRECTORY_FILTER_REACHABLE | 3 | /lawyers/?city=tel-aviv&practice=family-law | עמוד עזר מקומי ותמציתי שמפנה לעמוד הגירושין המרכזי ואינו מנסה להיות מדריך גירושין מלא. | GSC query/page evidence, internal overlap check, filtered lawyer count, legal/editor review, owner approval, and no public-exposure accident. |
| CPD-02 | criminal-lawyer-jerusalem | עורך דין פלילי בירושלים | REVIEW_TARGET_ALREADY_PUBLIC | /criminal-lawyer/ | /lawyers/?city=jerusalem&area=criminal-law | BLOCKED_CANONICAL_DIRECTORY_FILTER_GENERIC_OR_EMPTY | 0 | /lawyers/?city=jerusalem&practice=criminal-law | עמוד עזר מקומי למצבי חקירה, מעצר או כתב אישום, עם הפניה לעמוד הפלילי המרכזי ולבדיקת התאמה. | GSC query/page evidence, internal overlap check, filtered lawyer count, legal/editor review, owner approval, and no public-exposure accident. |

## Source Prompts

| ID | Target | Type | Title | URL | Use For | Boundary |
| --- | --- | --- | --- | --- | --- | --- |
| SRC-001 | divorce-lawyer-tel-aviv | official | קבלת תעודת גירושין - בתי הדין הרבניים | https://www.gov.il/he/service/obtaining-divorce-certificate | source prompt for official-document language and evidence checklist only | Do not turn certificate-service details into legal advice or deadline claims. |
| SRC-002 | divorce-lawyer-tel-aviv | official | בקשה לסיוע משפטי - סיוע משפטי | https://www.gov.il/he/service/legal_aid_application | source prompt for eligibility-sensitive wording and urgent-family-matter caveats | Do not claim eligibility; invite users to verify with official service or lawyer. |
| SRC-003 | divorce-lawyer-tel-aviv | official | יחידות הסיוע ליד בתי המשפט ובתי הדין | https://www.gov.il/he/departments/Units/molsa-court-assiatance-units | source prompt for non-adversarial family-dispute context | Do not describe a mandatory process unless legal/editor review confirms the exact case type. |
| SRC-004 | divorce-lawyer-tel-aviv | competitor | מורן גוהר - עורך דין גירושין בתל אביב | https://www.goharlaw.com/ | SERP positioning reference: competitor pages lead with credentials, family-court experience and local service framing | Do not copy claims, rankings, testimonials, case outcomes, pricing or personal positioning. |
| SRC-005 | divorce-lawyer-tel-aviv | competitor | מאיה רוטנברג - עורך דין גירושין | https://rotenberglaw.co.il/ | SERP positioning reference: competitor pages often use experience, process reassurance and city coverage | Do not copy claims, price ranges, badges, testimonials or outcome promises. |
| SRC-006 | criminal-lawyer-jerusalem | official | בקשת ייצוג על ידי הסניגוריה הציבורית | https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office | source prompt for official criminal-procedure document checklist and representation caveat | Do not claim eligibility; mention only that official routes may exist and require verification. |
| SRC-007 | criminal-lawyer-jerusalem | official | חוות דעת ועמדות רשמיות - הסניגוריה הציבורית | https://www.gov.il/he/departments/dynamiccollectors/official_opinions_and_positions | source prompt for rights-sensitive language around suspects, defendants and criminal process | Do not summarize legal rights as instructions without legal review. |
| SRC-008 | criminal-lawyer-jerusalem | competitor | דוד הלוי - עורך דין פלילי ירושלים | https://halevi-law.co.il/ | SERP positioning reference: competitor pages highlight case types, urgency and defense review | Do not copy case lists, media mentions, client praise or aggressive promises. |
| SRC-009 | criminal-lawyer-jerusalem | competitor | רמי בן חמו - עורך דין פלילי בירושלים | https://rbh-law.co.il/ | SERP positioning reference: competitor pages emphasize availability, discretion and local office presence | Do not copy availability promises, slogans, personal claims or guarantees. |

## Review

The two priority city/practice targets are ready for private owner/editor drafting, not publication. The safest next move is to fill GSC/internal-overlap/lawyer-coverage evidence for one target, then convert only that target into a legal-reviewed Hebrew draft. Competitor pages suggest that the SERP is commercially strong, but their claims should be used only to understand user expectations, never copied.
