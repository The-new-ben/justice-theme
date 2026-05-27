# Tel Aviv Family Local Draft Packet - 2026-05-27

Status: TEL_AVIV_FAMILY_LOCAL_DRAFT_PACKET_READY_FOR_PRIVATE_EDITOR_REVIEW_NO_PUBLIC_CHANGE
Source date: 2026-05-27

Scope: private editor packet for `/divorce-lawyer-tel-aviv/` only. This does not create or publish a page, edit CMS, change title/H1/meta/body/internal links, alter redirects/canonicals/noindex/sitemap/taxonomies, contact lawyers/leads, create CRM records, send email, invoice, charge, or deploy.

## Target

- Slug: divorce-lawyer-tel-aviv
- Title: עורך דין גירושין בתל אביב
- Pillar: /divorce-lawyer/
- Canonical filtered directory: /lawyers/?city=tel-aviv&area=family-law
- Unsupported alias, QA only: /lawyers/?city=tel-aviv&practice=family-law

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| TAF-GATE-01 | source_packets_available | PASS | Priority packet: CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_BLOCKED_NO_PUBLIC_CHANGE; thin packet: CITY_PRACTICE_THIN_PAGE_PACKET_READY_NO_PUBLIC_CHANGE. Global priority packet remains blocked by a different target, so this packet narrows only to divorce-lawyer-tel-aviv. | Keep Jerusalem criminal blocked; advance only Tel Aviv family as a private editor packet. |
| TAF-GATE-02 | target_not_public_200 | PASS | https://jus-tice.co.il/divorce-lawyer-tel-aviv/ returned 404 with gate PASS_TARGET_NOT_PUBLIC_200. | Do not create or publish the URL without owner/SEO/legal approval. |
| TAF-GATE-03 | pillar_reachable_and_primary | PASS | https://jus-tice.co.il/divorce-lawyer/ returned 200; role says local draft supports /divorce-lawyer/. | Keep the pillar as the main divorce guide and avoid duplicating it. |
| TAF-GATE-04 | canonical_directory_has_coverage | PASS | https://jus-tice.co.il/lawyers/?city=tel-aviv&area=family-law returned 200, H1 "עורך דין דיני משפחה בתל אביב", and 3 lawyer cards. | Use only the canonical area= filtered directory in private planning. |
| TAF-GATE-05 | unsupported_alias_excluded | PASS | https://jus-tice.co.il/lawyers/?city=tel-aviv&practice=family-law remains marked PASS_UNSUPPORTED_ALIAS_NOT_FILTERED_DO_NOT_USE; H1 "עורכי דין בתל אביב". | Do not put practice= alias in a draft/public internal link plan. |
| TAF-GATE-06 | research_source_scaffold_present | PASS | 3 official source prompt(s) and 2 competitor context prompt(s) are available. | Use official sources for document/checklist language; use competitors only for SERP context, not copy. |
| TAF-GATE-07 | no_public_or_live_action_authorized | PASS | Source priority packet has 0 public/CMS/SEO/CRM/contact/payment/email approvals and no uPress requirement. | Keep all outputs private until the owner explicitly approves publication scope. |

## Private Editor Rows

| ID | Section | Status | Value | Guardrail |
| --- | --- | --- | --- | --- |
| TAF-ROW-01 | route_role | PRIVATE_REVIEW_READY | עמוד עזר מקומי ותמציתי שמפנה לעמוד הגירושין המרכזי ואינו מנסה להיות מדריך גירושין מלא. | Keep the local page subordinate to /divorce-lawyer/ and avoid duplicating the divorce pillar. |
| TAF-ROW-02 | safe_private_opening | PRIVATE_DRAFT_ONLY | טיוטת עבודה פרטית: אם אתם מחפשים עורך דין גירושין בתל אביב, העמוד הזה אמור לעזור להבין אילו שאלות ומסמכים כדאי להכין לפני פנייה מסודרת. הוא לא מחליף ייעוץ משפטי, ולא אמור להתחרות במדריך הגירושין המרכזי של Jus-Tice. | Do not publish this copy before GSC, internal overlap, legal/editor and owner approval. |
| TAF-ROW-03 | reader_evidence_checklist | PRIVATE_REVIEW_READY | פרטי הצדדים והילדים, מסמכי הליכים קיימים אם יש, הסכמות או מחלוקות מרכזיות, מסמכים כלכליים בסיסיים, מועדי דיון או פניות קודמות, ושאלות שהגולש רוצה לברר מול עורך דין. | Use as a preparation checklist, not legal advice or a claim that all items are required. |
| TAF-ROW-04 | lawyer_fit_trigger | PRIVATE_REVIEW_READY | כאשר יש הליך פתוח, מועד קרוב, מחלוקת משמעותית או צורך להבין התאמה לעורך דין בתחום המשפחה בעיר או בסביבה. | Do not promise response time, outcome, ranking, price or specific lawyer availability. |
| TAF-ROW-05 | internal_link_plan | PRIVATE_REVIEW_READY | /divorce-lawyer/ as primary pillar \| /lawyers/?city=tel-aviv&area=family-law as canonical filtered lawyer path \| /lawyers/?city=tel-aviv&practice=family-law as unsupported alias for QA only \| no new internal links until owner/SEO review | Use /lawyers/?city=tel-aviv&area=family-law only; keep practice= alias QA-only. |
| TAF-ROW-06 | faq_candidates | NEEDS_GSC_OR_OWNER_EVIDENCE | איך יודעים אם צריך עורך דין גירושין מקומי? \| אילו מסמכים כדאי להכין לפני פנייה? \| מתי לקרוא קודם את מדריך הגירושין המרכזי? | FAQ rows stay placeholders until backed by GSC, lead, owner or legal/editor evidence. |
| TAF-ROW-07 | official_source_boundaries | PRIVATE_RESEARCH_READY | קבלת תעודת גירושין - בתי הדין הרבניים: source prompt for official-document language and evidence checklist only \| בקשה לסיוע משפטי - סיוע משפטי: source prompt for eligibility-sensitive wording and urgent-family-matter caveats \| יחידות הסיוע ליד בתי המשפט ובתי הדין: source prompt for non-adversarial family-dispute context | Do not turn certificate-service details into legal advice or deadline claims. \| Do not claim eligibility; invite users to verify with official service or lawyer. \| Do not describe a mandatory process unless legal/editor review confirms the exact case type. |
| TAF-ROW-08 | competitor_source_boundaries | SERP_CONTEXT_ONLY | מורן גוהר - עורך דין גירושין בתל אביב: SERP positioning reference: competitor pages lead with credentials, family-court experience and local service framing \| מאיה רוטנברג - עורך דין גירושין: SERP positioning reference: competitor pages often use experience, process reassurance and city coverage | Do not copy claims, rankings, testimonials, case outcomes, pricing or personal positioning. \| Do not copy claims, price ranges, badges, testimonials or outcome promises. |
| TAF-ROW-09 | thin_page_original_need | PRIVATE_REVIEW_READY | local-intent opening that explains who this city/practice page is for \| document/evidence checklist specific to the practice area \| when to move from reading to a lawyer fit check \| filtered lawyer coverage proof before public visibility \| FAQ rows only after real search, lead or owner evidence \| links to the central pillar and filtered directory without competing with the pillar | Do not publish, change title/H1/meta/canonical/sitemap/internal links, claim ranking/best-lawyer status, or contact lawyers/leads from this packet. |
| TAF-ROW-10 | publication_blockers | BLOCKS_PUBLICATION | GSC query/page evidence, internal overlap check, filtered lawyer count, legal/editor review, owner approval, and no public-exposure accident. | No best/recommended/ranked lawyer claims, no guarantee, no copied competitor claims, no prices, no legal deadlines and no advice without verified legal review. |
| TAF-ROW-11 | live_source_snapshot | PRIVATE_EVIDENCE_READY | central_pillar_live_check: 200; gate=PASS_PILLAR_REACHABLE; cards=3; h1=איך לבחור עורך דין גירושין \| ניסיון, מחיר ושאלות נכונות \| Jus-Tice \| draft_target_public_exposure_check: 404; gate=PASS_TARGET_NOT_PUBLIC_200; cards=0; h1=העמוד לא נמצא \| canonical_directory_live_check: 200; gate=PASS_CANONICAL_DIRECTORY_FILTER_REACHABLE; cards=3; h1=עורך דין דיני משפחה בתל אביב \| unsupported_directory_alias_live_check: 200; gate=PASS_UNSUPPORTED_ALIAS_NOT_FILTERED_DO_NOT_USE; cards=3; h1=עורכי דין בתל אביב | Snapshot is read-only evidence; do not publish or link from it without owner/SEO/legal approval. |

## Source Boundaries

| ID | Type | Title | URL | Use For | Boundary |
| --- | --- | --- | --- | --- | --- |
| SRC-001 | official | קבלת תעודת גירושין - בתי הדין הרבניים | https://www.gov.il/he/service/obtaining-divorce-certificate | source prompt for official-document language and evidence checklist only | Do not turn certificate-service details into legal advice or deadline claims. |
| SRC-002 | official | בקשה לסיוע משפטי - סיוע משפטי | https://www.gov.il/he/service/legal_aid_application | source prompt for eligibility-sensitive wording and urgent-family-matter caveats | Do not claim eligibility; invite users to verify with official service or lawyer. |
| SRC-003 | official | יחידות הסיוע ליד בתי המשפט ובתי הדין | https://www.gov.il/he/departments/Units/molsa-court-assiatance-units | source prompt for non-adversarial family-dispute context | Do not describe a mandatory process unless legal/editor review confirms the exact case type. |
| SRC-004 | competitor | מורן גוהר - עורך דין גירושין בתל אביב | https://www.goharlaw.com/ | SERP positioning reference: competitor pages lead with credentials, family-court experience and local service framing | Do not copy claims, rankings, testimonials, case outcomes, pricing or personal positioning. |
| SRC-005 | competitor | מאיה רוטנברג - עורך דין גירושין | https://rotenberglaw.co.il/ | SERP positioning reference: competitor pages often use experience, process reassurance and city coverage | Do not copy claims, price ranges, badges, testimonials or outcome promises. |

## Review

This target can advance to private owner/editor drafting because the page is not public 200, the central divorce pillar is reachable, the canonical filtered lawyer directory has 3 cards, and the unsupported alias is explicitly excluded. It is still not publishable: GSC evidence, internal overlap review, legal/editor review and owner approval remain required.
