# Live Criminal Jerusalem Page QA - 2026-05-27

Status: LIVE_CRIMINAL_JERUSALEM_QA_REVIEW_NO_PUBLIC_CHANGE

Scope: read-only live QA for the existing public `/criminal-lawyer-jerusalem/` page. This packet does not publish, edit CMS content, change SEO settings, contact anyone, create records, send email or deploy.

## Summary

- Target status: 200.
- Target word estimate: 488.
- QA rows: 8; review rows: 6; blocked rows: 1.
- Own-site live rows: 8.
- Competitor rows: 6; live competitor fetches: 6.
- Public actions: 0 CMS writes, 0 public page changes, 0 SEO setting changes, 0 CRM/contact/payment/email actions.

## QA Rows

| ID | Gate | Status | Evidence | Review | Next Action |
| --- | --- | --- | --- | --- | --- |
| CJQA-01 | target_live_status | REVIEW_CONFIRMED_LIVE_200 | Target https://jus-tice.co.il/criminal-lawyer-jerusalem/ returned 200; title "עורך דין פלילי ירושלים \| מחירים, בתי משפט, ייצוג \| Jus-Tice"; h1 "עורך דין פלילי ירושלים \| ייצוג, מחירים ובתי משפט \| Jus-Tice". | The page is public and should be treated as an existing live asset, not a draft seed. | Do read-only QA first; do not publish, unpublish or rewrite from draft packets alone. |
| CJQA-02 | thin_content_and_helpfulness | REVIEW_THIN_LOCAL_PAGE | Target word estimate 488; CTA anchor count 38; internal links 66. | The live target appears relatively thin for a competitive criminal-law local query; any improvement needs sources and legal/editor review. | Prepare evidence-backed outline sections only after GSC/internal overlap/lawyer coverage proof. |
| CJQA-03 | claim_and_source_safety | REVIEW_PUBLIC_CLAIMS | Public-claim markers in target title/H1/body: מוביל \| מובילים \| מחירים \| בתי משפט. | Markers such as prices/courts/leading/recommended/outcomes need source or legal review before expansion. | Avoid adding price, court, best/recommended, guarantee, outcome or urgent advice language. |
| CJQA-04 | business_language_leakage | PASS | Business/internal markers: none. | The live page should remain a legal-help page and not expose revenue, supplier, CRM or operating model language. | Keep lawyer-join/business language off the page except approved, subtle site-level paths. |
| CJQA-05 | pillar_cannibalization | REVIEW_WEAK_PILLAR_SPLIT | Declared pillar 200/289 words/final https://jus-tice.co.il/practice-areas/criminal-law/; topic surface 200/289 words. | The intended criminal-law pillar appears weak or redirected, so the live local page may be competing with a thin topic surface. | Do not expand the local page until the central criminal-law role, canonical target and internal-link hierarchy are reviewed. |
| CJQA-06 | related_criminal_overlap | REVIEW_OVERLAP_EXISTS | /criminal-defense-attorney/:200/4128w \| /sex-crime-lawyer/:200/24404w | Related criminal pages exist, so local-page improvements need an internal overlap map before link/copy changes. | Keep the Jerusalem page as local triage and lawyer-fit support; leave specialist topics to their own pages. |
| CJQA-07 | competitor_positioning | REVIEW_COMPETITIVE_SERP | 6/6 competitor pages fetched as live 200; search results emphasize urgency, credentials, case types and local office presence. | Jus-Tice should not mimic a single law office. The safer differentiation is neutral legal-help triage, document prep, and filtered lawyer fit. | Use competitor review for user expectations only; do not copy claims, credentials, results or slogans. |
| CJQA-08 | public_action_approval | BLOCKED_NO_PUBLIC_CHANGE_APPROVED | 0 CMS writes, 0 redirects/canonicals/noindex/sitemap/taxonomy changes, 0 CRM/contact/payment/email actions. | This packet approves no public action. | Owner/legal/editor/GSC review must clear one exact update before public work. |

## Own-Site Rows

| ID | Path | Role | Status | Words | CTAs | Claim Hits | Business Hits | Final URL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OWN-01 | /criminal-lawyer-jerusalem/ | live_target | 200 | 488 | 38 | מוביל \| מובילים \| מחירים \| בתי משפט | - | https://jus-tice.co.il/criminal-lawyer-jerusalem/?jt_live_qa=1779844357464 |
| OWN-02 | /criminal-lawyer/ | declared_pillar | 200 | 289 | 33 | מוביל \| מובילים | - | https://jus-tice.co.il/practice-areas/criminal-law/ |
| OWN-03 | /practice-areas/criminal-law/ | practice_archive_or_topic | 200 | 289 | 33 | מוביל \| מובילים | - | https://jus-tice.co.il/practice-areas/criminal-law/?jt_live_qa=1779844362983 |
| OWN-04 | /lawyers/?city=jerusalem&practice=criminal-law | filtered_directory | 200 | 730 | 47 | מוביל \| מובילים | - | https://jus-tice.co.il/lawyers/?city=jerusalem&practice=criminal-law&jt_live_qa=1779844364838 |
| OWN-05 | /criminal-defense-attorney/ | related_criminal_page | 200 | 4128 | 41 | מומלץ \| מוביל \| מובילים \| הטוב \| הצלחה \| זיכוי | - | https://jus-tice.co.il/criminal-defense-attorney/?jt_live_qa=1779844366654 |
| OWN-06 | /sex-crime-lawyer/ | related_criminal_page | 200 | 24404 | 42 | מומלץ \| מוביל \| מובילים \| הטוב \| הצלחה \| הצלחות \| זיכוי \| בתי משפט \| מיידי | - | https://jus-tice.co.il/sex-crime-lawyer/?jt_live_qa=1779844368664 |
| OWN-07 | /traffic-lawyer/ | adjacent_practice_page | 200 | 1881 | 34 | מומלץ \| מוביל \| מובילים \| הטוב \| הצלחה \| זיכוי | - | https://jus-tice.co.il/traffic-lawyer/?jt_live_qa=1779844370662 |
| OWN-08 | /find-lawyer-how-to-find-good-attorney/ | selection_guide | 200 | 1025 | 39 | מומלץ \| מומלצים \| מוביל \| מובילים \| הטוב | - | https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/?jt_live_qa=1779844372551 |

## Competitor Snapshot

| ID | Title | Status | Words | Observation | Boundary | URL |
| --- | --- | --- | --- | --- | --- | --- |
| COMP-01 | עו"ד דוד הלוי \| משרד עורכי דין פלילי ירושלים | 200 | 7299 | Competitor page emphasizes criminal case types, detention, evidence review, representation and long-term criminal-record issues. | Do not copy service lists, claims, testimonials, case results or aggressive urgency framing. | https://halevi-law.co.il/ |
| COMP-02 | עורך דין פלילי בירושלים - שלומי בן דור | 200 | 565 | Competitor page leans on former police/prosecution experience, interrogation preparation and immediate release language. | Do not copy personal credentials, urgency promises or investigation-prep claims. | https://sbd-law.co.il/ |
| COMP-03 | רמי בן חמו - עורך דין פלילי | 200 | 895 | Competitor page emphasizes Jerusalem office presence, availability and broad criminal/traffic disciplinary coverage. | Do not copy availability promises, slogans, pricing or personal positioning. | https://rbh-law.co.il/ |
| COMP-04 | אריאל עטרי - עורך דין פלילי בירושלים | 200 | 482 | Competitor page emphasizes experience, case volume and named public results. | Do not copy outcome claims, media items, rankings or named-case positioning. | https://atarilawfirm.co.il/ |
| COMP-05 | רועי יוסף אטיאס - עורך דין פלילי בירושלים | 200 | 628 | Competitor page positions a private lawyer brand with serious-crime, white-collar and public-figure work. | Do not copy elite-client positioning, sensational language or case-type breadth as a Jus-Tice claim. | https://plilim.co.il/ |
| COMP-06 | משרד עו"ד הוד דיין - משפט פלילי ותעבורה בירושלים | 200 | 1103 | Competitor page combines criminal and traffic work with strategy and evidence-review framing. | Do not turn Jus-Tice into a law-firm voice; keep it a neutral legal-help/matching page. | https://hodayan.co.il/ |

## Official Source Prompts

| ID | Title | Use For | Boundary | URL |
| --- | --- | --- | --- | --- |
| OFF-01 | בקשת ייצוג על ידי הסניגוריה הציבורית | Cautious reference to official representation routes and eligibility-sensitive language. | Do not claim eligibility or advise which route a user should choose. | https://www.gov.il/he/service/request-for-representation-by-the-public-defender-office |
| OFF-02 | חוות דעת ועמדות רשמיות - הסניגוריה הציבורית | Rights-sensitive source prompt for suspect/defendant language. | Do not summarize rights as instructions without legal review. | https://www.gov.il/he/departments/dynamiccollectors/official_opinions_and_positions |

## Review

The live Jerusalem criminal-law page is a real public asset and should not be handled as an unpublished draft. It appears commercially relevant but thin for a competitive local criminal-law query, and it contains source-sensitive title/H1 themes such as prices and courts. The central criminal-law pillar also appears weak/redirected, which raises cannibalization risk. Next step is not a public edit; it is owner/GSC/legal review of the exact role of this page versus the criminal-law pillar and related specialist pages.
