---
name: google-god-mode-playbook
description: The mandatory method for building any ranking article for jus-tice.co.il. Research the SERP like Google (Israel + US), suck down every ranking competitor, design the article skeleton from evidence, and assemble a war-grade writing prompt with everything embedded. Works with the SerpApi tool when available, and fully by hand with a normal browser when not. Hand this file to any agent or chat and it knows the whole process.
---

# GOOGLE GOD MODE — the article-war playbook (one book, whole process)

**If you are an AI agent reading this:** follow the nine steps in order.
Never skip a step. Your job is to produce either (a) the research pack, or
(b) the final mega-prompt, or (c) the article itself if explicitly asked —
always per the rules below. You never publish anything; you deliver drafts
and prompts. Outputs for the site are in Hebrew; this playbook is in
English so every agent parses it reliably.

**The one law:** an article prompt is a weapon. It carries the battlefield
inside it — real SERP data, the competitors' actual content, a dictated
skeleton, style law, and fences. If the writer has to "go research", the
prompt has already failed.

---

## THE NINE MANDATORY STEPS

1. Define the target and check cannibalization fences
2. Pull the REAL Israeli SERP
3. Pull US signals
4. Suck down the ranking competitors
5. Design the skeleton from evidence (human/agent thinking step)
6. Engineer the first paragraph
7. Build the entity and synonym map
8. Assemble the mega-prompt (everything embedded)
9. QA the returned article against the gauntlet

---

## STEP 1 — Target and fences

Decide: ONE primary query, ONE target URL. One query = one page, forever.

Then inventory what the site already owns around this query:
- **With repo access:** open `project-control/rebuild-plan-2026-07/D1-full-url-disposition-1522-v1.1.csv` — every URL with its primary query, action and wave.
- **Manual:** search Google for `site:jus-tice.co.il "<the query>"` and 2-3
  close variants. List every page of ours that appears.

Output of this step: a **fence list** — neighbor pages and their queries.
Each fence goes into the prompt later as: "this subtopic gets ONE paragraph
plus an internal link to <url>, never a full section."

## STEP 2 — The real Israeli SERP

**Track A (SerpApi tool, when the key works):**
```
https://serpapi.com/search.json?engine=google&google_domain=google.co.il&gl=il&hl=he&num=10&q=<QUERY_URL_ENCODED>&api_key=<KEY>
```
Collect from the JSON: `organic_results[]` → position, link, title;
`related_questions[]` → every question (this is the PAA).

**Track B (manual, any Chrome/browser):**
1. Open an incognito/private window (kills personalization).
2. Go to `https://www.google.co.il` and search the exact Hebrew query.
3. Copy the top 10 organic results in order: title + URL. Skip ads
   (marked "ממומן") and skip our own site.
4. Find the "אנשים שאלו גם" (People Also Ask) box. Click each question once
   — clicking loads MORE questions. Copy every question you can surface
   (aim for 6-10).
5. Note the page TYPE of each result: law-firm page / guide / government
   (gov.il) / portal (kolzchut, ynet) / Wikipedia. The winning type tells
   you what Google believes the intent is.

Record: query | top 10 (rank, URL, title, type) | all PAA questions.

## STEP 3 — US signals

Google tests patterns in English first; US PAA predicts Israeli demand.

**Track A:** same API call with `gl=us&hl=en&google_domain=google.com` and
the translated query (e.g. "criminal defense lawyer").

**Track B (manual):** open
`https://www.google.com/search?q=<english+query>&gl=us&hl=en&pws=0`
in incognito. Copy the PAA questions and the top-5 result titles.

Rule: US material gives you QUESTIONS and STRUCTURES, never legal facts.
Every US-inspired section must be re-grounded in Israeli law or marked
TODO-VERIFY.

## STEP 4 — Competitor suck-down (the heart)

Take the top 3-6 ORGANIC competitors from Step 2. For EACH page:

**Track A (agent with fetch/crawl):** fetch the URL, extract `<title>`,
the H1, every H2/H3 in order, the first real paragraph, and total word
count of the main text.

**Track B (manual browser, no tools):**
1. Open the competitor page.
2. `Ctrl+U` (view page source) → `Ctrl+F` search for `<h1`, then `<h2`,
   then `<h3` — copy each heading text in document order. (Alternative
   without source view: use the browser's Reader Mode and copy the heading
   lines.)
3. Copy the first substantial paragraph from the visible page.
4. Select the article body, paste into any word counter
   (e.g. wordcounter.net) — note the word count.
5. In the page source, search `application/ld+json` — note schema types
   (FAQPage? Attorney? Article?).

For EACH competitor write a four-line teardown:
```
rank N | ~X,XXX words | URL
STRUCTURE: (the heading outline, condensed)
WINS ON: (why Google ranks it: structure? persona? depth? freshness?)
MISSING: (what it does NOT cover or does thinly — this is your kill zone)
```

Then write ONE strategic conclusion: what does the whole SERP reward, and
where is the shared weakness we will exploit.

## STEP 5 — Design the skeleton (thinking, not collecting)

Rules for building the H2/H3 map:
- UNION of coverage: every real topic any ranking competitor covers must
  have a home in our skeleton (at equal or greater depth).
- Every PAA question (IL + adapted US) maps to a section or an FAQ item.
- Every fence from Step 1 appears as "one paragraph + link only".
- Every section title is phrased as a real search question/intent, not a
  label ("מתי חייבים עורך דין פלילי", not "החשיבות של ייצוג").
- Assign each section a word budget; the sum hits the target (a pillar:
  9,000-11,000; a money spoke: 1,500-2,500; a precision/procedure page:
  match the SERP winner's depth, bloat LOSES procedure queries).
- Mark where TABLES go (comparisons, timelines, penalties, documents) —
  tables are a ranking weapon competitors are usually too lazy to build.
- FAQ section: 8-10 questions mirroring the PAA verbatim where possible.

## STEP 6 — First-paragraph engineering (exact spec)

40-70 words. Must contain: the exact query phrase inside the first 10
words; a direct answer to the dominant intent in 2-4 sentences; one
concrete value promise (what the reader will know by the end); ZERO
superlatives, zero "המוביל בישראל", zero years-of-experience bragging.

## STEP 7 — Entity and synonym map

Build a list of 25-40 terms Google expects on a truly relevant page:
- Synonyms of the head term (עו"ד פלילי / סנגור / ייצוג פלילי...)
- Process entities (the procedural stages, motions, documents)
- Statute names and section numbers (marked TODO-VERIFY if unsure)
- Institutions (courts, prosecution bodies, agencies)
Sources: the SERPs, the PAA, the competitor headings you collected.
The prompt will instruct: use each naturally at least once, no stuffing.

## STEP 8 — Assemble the mega-prompt

The prompt is written in Hebrew and contains, IN THIS ORDER:
1. Role + mission + word target + "this is a portal, not a law firm" (no
   persona, no success stories, no promises).
2. The battlefield: the per-competitor teardowns from Step 4, verbatim
   data (rank, words, structure, weakness) + the strategic conclusion.
3. US signals: the adapted PAA list with instructions how each becomes a
   section or FAQ.
4. THE DICTATED SKELETON from Step 5 — every H2/H3 with its orders: what
   to cover, word budget, which table, which internal link, what is
   fenced to one paragraph.
5. First-paragraph spec (Step 6).
6. Entity map (Step 7).
7. The canonical style-law block (Appendix A below) — verbatim.
8. Output contract: single HTML file, allowed tags only, manifest block
   at the end (word count, TODO-VERIFY list), export via download.
9. Continuation protocol: if the model stops, the operator replies "המשך"
   until the contract is complete.

Never write "research the competitors yourself" — the data is IN the
prompt. Deep Research may VERIFY and deepen, never replace the embedded
battlefield.

## STEP 9 — QA the returned article (the gauntlet)

Mechanical checks before anything goes near the site:
- Zero em dashes (—) and zero en dashes (–) anywhere.
- Zero forbidden phrases (see Appendix A list).
- Every fact that was not verified carries [TODO-VERIFY: ...]; extract the
  full list; verify each against primary sources (wikisource / gov.il /
  knesset.gov.il / court records); anything unverifiable is REMOVED, not
  softened. Never publish an invented case number, sum, or section.
- Coverage check: every skeleton section exists, in order, at budget.
- Links: internal links only from the allowlist; externals only to primary
  sources with rel="nofollow".
- Attribution law (permanent): family-law content → עו"ד מאיה רוטנברג may
  be credited; EVERYTHING else → עו"ד בן בטש or "צוות Jus-Tice"; tools →
  team or nothing; attribution sits at the BOTTOM; no "reviewed by" claim
  unless a review actually happened; schema must say the same as the page.
- Publishing is engineering's job only (revisions, purge, live-verify on
  the RENDERED page, mobile-first). Any other agent stops at draft.

---

## APPENDIX A — canonical Hebrew style-law block (paste verbatim into every prompt)

```
חוקי סגנון קשיחים - הפרה אחת פוסלת את כל הריצה:
1. אסור קו מפריד ארוך (— או –) בשום מקום. פסיק, נקודתיים או מקף רגיל בלבד.
2. אסור: "חשוב לציין", "חשוב להבין", "חשוב לדעת", "יש לציין", "בשורה
   התחתונה", "אין ספק", "כידוע", "בעולם של היום", "כפי שראינו", "לסיכום",
   וכל ניסוח שיווקי ריק או הבטחת תוצאה.
3. כל פרק נפתח בתשובה ישירה של 2-3 משפטים לשאלת הכותרת, ורק אז פירוט.
4. כל סעיף חוק, מספר תיק, סכום, אחוז או שם הלכה שאינך בטוח בו במאה אחוז:
   כתוב [TODO-VERIFY: מה בדיוק צריך לאמת]. עדיף שלושים סימונים מעובדה
   שגויה אחת. לעולם אל תמציא פסיקה או נתונים.
5. אל תכתוב שורת "נכתב על ידי" או "נבדק על ידי" בכלל.
6. HTML בלבד בתגיות: h2 h3 p ul ol li table thead tbody tr th td
   blockquote a strong em. בלי h1, בלי div, בלי style, בלי אימוג'ים.
7. קישורים פנימיים רק מהרשימה שסופקה, בעוגנים טבעיים. קישורים חיצוניים רק
   למקורות ראשוניים (gov.il, wikisource, knesset.gov.il, kolzchut.org.il)
   עם rel="nofollow".
8. בדיקה עצמית לפני מסירה: סרוק ל-— ול-– (אפס), סרוק לביטויים האסורים
   (אפס), ודא שכל פרקי השלד קיימים בסדר שנקבע, ספור מילים מול היעד.
פלט: קובץ HTML אחד + בלוק מניפסט בסופו: ספירת מילים, מספר פריטי
TODO-VERIFY ורשימתם המרוכזת. ייצוא דרך כפתור ההורדה בלבד.
```

## APPENDIX B — quick reference card

| Step | With tools | Manual browser |
|---|---|---|
| IL SERP | SerpApi gl=il hl=he | google.co.il incognito, copy top-10 + PAA |
| US signals | SerpApi gl=us hl=en | google.com/search?q=...&gl=us&hl=en&pws=0 |
| Competitor outlines | fetch + extract | Ctrl+U, find h1/h2/h3; reader mode; wordcounter.net |
| Fences | D1 disposition CSV | site:jus-tice.co.il "query" |
| Schema check | parse ld+json | Ctrl+U, find application/ld+json |

**Version:** 2026-07-15 · lives in the repo root as GOOGLE-GOD-MODE-PLAYBOOK.md
· twin of the enforcement skill at .claude/skills/google-god-mode/
