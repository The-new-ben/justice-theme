# Homepage competitor human improvement packet - 2026-05-27

Status: HOMEPAGE_COMPETITOR_HUMAN_IMPROVEMENT_PACKET_READY_NO_PUBLIC_CHANGE

## Project manager check

Active goal: improve homepage trust and conversion for people seeking legal help, while keeping lawyer monetization visible but secondary.
Sub-goals: competitor-informed homepage clarity, no change to the choosing-lawyer guide content, no public deployment without owner approval, and a manual Lovable prompt that does not use paid APIs.
Readiness to profit: 55% for planning and homepage conversion preparation, 0% live revenue impact until owner approves implementation and the site is deployed.
Honesty statement: I did not use Lovable directly because no Lovable plugin was available here. I did not use paid OpenAI, Anthropic, Gemini, Groq or other LLM APIs. I did not publish or change the live site.

## Competitor and legaltech observations

| Source | URL | What they do well | What Jus-Tice can use safely | What not to copy |
| --- | --- | --- | --- | --- |
| Advocato | https://advocato.co.il/ | fast search by legal problem and location, clear category chips, simple three-step explanation, and separate lawyer joining path | make the first action feel fast and understandable, while keeping unverifiable ratings or market-leader claims out of Jus-Tice copy | do not copy testimonials, ratings, exact category wording, or claims about thousands of lawyers |
| LawZone | https://lawzone.co.il/ | direct route from a legal issue to a conversation with a lawyer, broad legal-area taxonomy, and urgency language around personal follow-up | add clearer routes for urgent situations and explain what the visitor should prepare before a lawyer call | do not copy aggressive matching promises, sales language, or any direct-call promise without operational proof |
| iLaw | https://www.ilaw.co.il/ | large legal-topic map, forums, articles, case-law/news navigation and many subtopics under each practice area | expand practice cards with more human explanation and subtopic context instead of making the page thinner | do not turn Jus-Tice into a dense old-style directory or duplicate their topic lists |
| MyAttorney | https://www.myattorney.co.il/ | area-based lawyer search, recommended-lawyer cards and simple public-facing legal categories | show local confidence and nearby-help language without implying rankings or recommendations that are not verified | do not create fake recommendation labels, fake review hierarchy, or unsupported local availability claims |
| Vaquill AI awesome legaltech | https://github.com/Vaquill-AI/awesome-legaltech | curated legaltech map with open-source platforms, AI tools, datasets, MCP servers and verification warnings | translate the idea into Jus-Tice as evidence-based intake, source grounding and human review gates rather than importing foreign-law code directly | do not claim Israeli legal coverage from foreign tools and do not use unverified legal outputs as advice |

## Local homepage files reviewed

| File | Exists | Role | Reviewed for |
| --- | --- | --- | --- |
| page-home.php | yes | Home page assembler | section order, public-first home assignment and where the homepage copy actually renders |
| front-page.php | yes | Front-page fallback | older router and guide sections that must not be overwritten by the packet |
| template-parts/sections/hero.php | yes | Hero and first action | public-first headline, search form, market signals and lawyer side entry |
| template-parts/sections/homepage-intent-pyramid.php | yes | Intent router | situation cards, public guidance copy and lower lawyer path |

## Proposed homepage improvements

| ID | Area | Change type | Current risk | Proposed change | Draft public copy | Inspired by | Guide preserved | Live approval needed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HOME-HUMAN-01 | Hero first screen | copy and layout proposal | the page is better after the public-first update, but the visitor still needs a stronger first-minute answer before choosing a lawyer | add a short strip under the search that says what to do in the first ten minutes: write what happened, keep documents, check deadline, and choose a help path | לפני שמחפשים עורך דין, סדרו את המקרה בשתי דקות: מה קרה, מי מעורב, איזה מסמך קיבלתם, ומה התאריך הקרוב שחשוב לא לפספס. | Advocato speed and LawZone urgency, translated into a public-help step | yes | yes |
| HOME-HUMAN-02 | Situation router | content depth proposal | practice cards can feel like a directory if they do not explain the human situation behind the legal field | add six situation-based routes: got a letter, police or investigation, work problem, family dispute, debt or execution, injury or insurance | בחרו לפי מה שקרה לכם, לא לפי שם משפטי שאתם לא בטוחים בו. אם קיבלתם מכתב, זימון, דרישת תשלום או החלטה רשמית, התחילו משם. | iLaw topic depth and MyAttorney categories, translated into situation language | yes | yes |
| HOME-HUMAN-03 | Practice cards | longer human copy proposal | thin local or practice cards may not build enough trust or search intent coverage | make each card longer by adding what people usually need, what to prepare, and when a lawyer becomes urgent | בכל תחום נציג בשפה פשוטה מה בדרך כלל בודקים, אילו מסמכים כדאי להכין, ומה הסימנים שמצדיקים שיחה מהירה עם עורך דין. | iLaw broad subtopic map, with simpler public wording | yes | yes |
| HOME-HUMAN-04 | Choosing lawyer guide | boundary proposal | the owner explicitly asked not to change the guide content | do not edit guide body copy. Add only a contextual intro above it and internal links around it if later approved | כבר יודעים שאתם צריכים עורך דין? המדריך הבא יעזור להבין איך לבדוק ניסיון, זמינות, שכר טרחה והתאמה למקרה שלכם. | competitors separate search and education, but Jus-Tice should protect the existing guide text | yes | yes |
| HOME-HUMAN-05 | Lawyer path | revenue path placement proposal | lawyer revenue CTAs can distract the public if they dominate the hero | keep lawyer profile, dashboard and subscription entry visible in a side rail or lower section, not as the main headline | לעורכי דין: אפשר להצטרף, לעדכן פרופיל ולבדוק פניות מתאימות. הכניסה לעורכי דין נשארת זמינה, אבל העמוד הראשי מדבר קודם לציבור שמחפש עזרה. | Advocato lawyer join link kept separate from public search | yes | yes |
| HOME-HUMAN-06 | Trust and legal safety | disclaimer and tone proposal | the page needs trust without sounding like AI, sales or legal advice | add a plain Hebrew note that the site helps organize information and connect to legal help, but does not replace legal advice | המידע באתר נועד לעזור לכם להבין את הצעד הבא ולפנות בצורה מסודרת. הוא לא מחליף ייעוץ משפטי אישי מעורך דין שמכיר את הפרטים. | legaltech verification warnings from Vaquill list and public legal portals | yes | yes |

## Anti-cannibalization and tone rules

- Treat this as a homepage improvement proposal only, not a new public page.
- Do not change redirects, canonicals, noindex, sitemap, taxonomy, URL structure or protected guide content.
- Keep the choosing-lawyer guide content unchanged.
- Do not reduce words. Expand useful public explanations where they help users decide what to do next.
- Write to the public first. Keep lawyer business paths visible on the side.
- Avoid unsupported ranking, recommendation, guarantee or best-lawyer claims.
- Use plain Hebrew without AI-looking punctuation or decorative separators.

## Manual Lovable prompt

Prompt file: `.project-control/homepage-lovable-manual-prompt-2026-05-27.md`

## Gates

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| HOME-GATE-01 | local_templates_reviewed | PASS | 4/4 local homepage templates found. |
| HOME-GATE-02 | competitor_sources_recorded | PASS | 5 public competitor or legaltech sources recorded for review. |
| HOME-GATE-03 | choosing_lawyer_guide_preserved | PASS | Every proposed improvement keeps the choosing-lawyer guide content unchanged. |
| HOME-GATE-04 | public_change_blocked_until_owner_approval | PASS | Every row requires explicit owner approval before any public page, CMS, SEO or deployment change. |
| HOME-GATE-05 | paid_llm_api_not_used | PASS | No paid OpenAI, Anthropic, Gemini, Groq or other LLM API was used. |
| HOME-GATE-06 | manual_lovable_packet_only | PASS | Lovable was not available as an installed plugin, so this packet gives a manual prompt only. |

## Completion assessment

The homepage improvement plan is ready as an internal packet. The next step is owner approval of which rows to implement, then local code changes and visual QA. Nothing in this packet changes the public site.
