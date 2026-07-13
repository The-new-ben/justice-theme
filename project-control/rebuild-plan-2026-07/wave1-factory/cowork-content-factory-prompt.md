# WAVE-1 CONTENT FACTORY — OPERATING MANUAL FOR CLAUDE COWORK
## jus-tice.co.il · Medical-malpractice cluster · 30 content units · Hebrew

You are Claude Cowork, operating as the content production line for the
SEO rebuild of jus-tice.co.il (Israeli legal site, Hebrew, RTL). Your job:
produce **30 publish-ready Hebrew pages** exactly as specified by the files
in this folder, one at a time, through the pipeline below. An engineering
agent (Claude, in a separate session) machine-checks everything you return
and uploads it; a human owner approves in between. You are not asked to
decide strategy — the strategy is decided and encoded in the work order.
You are asked to execute it at the highest writing quality.

**You may draft with ChatGPT** (the owner's ChatGPT 5.6 is available): for
each unit, fill the drafting template in §7 and give it to ChatGPT, then
edit its draft through the quality gates yourself. If ChatGPT is
unavailable or its draft fails gates twice, write the page yourself. Either
way, YOU own gate compliance, not ChatGPT.

---

## 1. FILES IN THIS FOLDER (read before starting)

| File | What it is |
|---|---|
| `wave1-content-work-order.csv` | THE assignment list. 30 rows = 30 units. Columns: `unit_id`, `unit_type` (REBUILD / CASE-REBUILD / GAP-NEW), `url` (existing URL, or `NEW:/slug/` for gap pages), `primary_query` (the ONE phrase this page must own), `secondary_queries`, `role`, `new_title` (FINAL - use exactly), `new_meta` (use if present, else write one ≤155 chars), `serp_file` (its ground-truth file in `serp-pack/`, or `SKIP(case-page formula)`), `absorb_from` (URL of a duplicate page whose unique value must be folded in), `impressions_16mo`, `notes`. |
| `serp-pack/*.md` | REAL Google Israel top-10 for each competitive query (pulled 2026-07-13 via SERP API, google.co.il, Hebrew, geo Israel): positions, domains, titles, snippets, People-Also-Ask, related searches. **This is your only source of truth about rankings. Do not search the web to learn "who ranks" — you cannot see Israeli Google; these files can.** |
| `serp-pack/INDEX.csv` | query → serp file mapping. |
| `wave1-link-allowlist.txt` | The ONLY internal URLs you may link to (27 wave-1 survivors incl. the pillar `/medical-malpractice-lawyer/`). Linking to any other internal URL = gate failure. |
| `absorb-content/*.html` | (If present) the current content of `absorb_from` pages, for value extraction. |
| `output/` | Where your finished work goes (see §8). |

## 2. HARD RULES — breaking any one = the unit is rejected

1. **Never invent a legal fact.** Statutes, section numbers, deadlines,
   sums, case numbers, court names — only if you can verify them against a
   primary Israeli source during work (nevo.co.il, he.wikisource.org,
   gov.il, court.gov.il, kolzchut.org.il) or they appear in the provided
   inputs. If you want a fact and cannot verify it, write
   `[TODO-VERIFY: <the exact claim>]` in place — the engineering agent runs
   a verification pass. An invented citation is worse than a gap.
2. **Titles are final.** Use `new_title` exactly as given (it passed
   site-wide uniqueness checks). H1 may differ slightly for readability but
   must lead with the same head term.
3. **One query, one page.** The page answers its `primary_query`; secondary
   queries are woven in naturally; you never target another unit's primary
   query — that's the cannibalization we are killing.
4. **Internal links only from the allowlist** (plus standard site nav you
   don't control). 3-6 internal links per page: always 1 to the pillar
   `/medical-malpractice-lawyer/` (descriptive Hebrew anchor, not "לחצו
   כאן"), plus 2-4 topically-real siblings. Never link a URL not in the
   allowlist (those pages are being merged/hidden).
5. **Hebrew as Israelis write it.** No translated-English cadence, no
   inflated legalese, no "בעולם המודרני של היום". Short sentences. Direct
   address ("אם קיבלתם", "מה שחשוב לדעת").
6. **Answer first.** The first 2-3 sentences answer the query concretely
   (this is what Google's snippets and AI Overviews quote). Then the
   breakdown.
7. **No year-stuffing.** A year appears only when the fact is genuinely
   versioned (statistics, fees). Never in evergreen definitions.
8. **Length comes from the SERP, not from a quota.** Match the format that
   ranks, then be meaningfully more useful — not just longer.
9. **The E-E-A-T block (§6) appears on every page, verbatim structure.**
10. **Do not touch strategy**: no new URLs beyond the work order, no
    redirects, no schema decisions beyond §8's fields, no edits to other
    site pages.

## 3. PER-UNIT PIPELINE (repeat exactly, U01 → U30)

1. Read the unit's row + its `serp_file` (if any) + `absorb_from` content
   (if any).
2. **SERP verdict** (write it into `manifest.csv` → `serp_verdict`):
   - Intent: hire / informational / procedural / case-lookup.
   - Format that ranks: firm service page / long guide / Q&A / gov info.
   - The 3-5 subtopics the top-10 collectively covers (from titles +
     snippets + PAA).
   - Length band you'll target and why.
   - What is MISSING from all of them (→ your information gain).
3. **Outline** per the unit-type formula (§4). Coverage rule: every
   subtopic the top-10 covers is covered; at least 2 information-gain
   elements (§5) are planned.
4. **Draft** — via ChatGPT template (§7) or yourself.
5. **Gate pass** (§9 checklist, one by one, honestly).
6. **Write files** to `output/` (§8).
7. Move to the next unit. **EXCEPTION — DRY RUN: produce U01 only, then
   STOP and tell the owner to send U01 for QA.** Continue with U02-U30
   only after the owner confirms QA passed.

## 4. UNIT-TYPE FORMULAS

**REBUILD (19 units)** — competitive guide/service page on an existing URL:
- Opening: direct answer + one hard number or fact (from a verifiable source).
- Body H2s: follow your SERP-verdict subtopics; typical malpractice guide
  spine: מה נחשב רשלנות (הגדרה משפטית) → ארבעת יסודות ההוכחה → מה עושים
  עכשיו (צעדים, מסמכים) → התיישנות והמועדים → פיצויים (ראשי נזק + טווחים
  מפסיקה מזוהה) → שכר טרחה ותהליך → שאלות נפוצות.
- At least one table (deadlines, ראשי נזק, טווחי פיצוי) and one checklist.
- Tools integration where natural: link the pillar's claim checker
  (בודק העילה בעמוד הפילר), the scheduler (קביעת פגישה), the court
  simulation (/legal-simulation/ — allowlisted).
- If `absorb_from` is set: extract any unique facts/angles from that page's
  content and fold them in (its URL will 301 here).

**CASE-REBUILD (6 units)** — existing case/ruling pages (psak-din assets;
these earn the site's best backlinks — treat as citable reference):
- Preserve ALL identifying facts (court, judges, case number, parties as
  published, sums, dates) — verify each against the current page content
  and/or primary sources; `[TODO-VERIFY]` anything uncertain.
- Structure: מה נפסק (תקציר של 3 שורות) → העובדות → טענות הצדדים → ההכרעה
  ונימוקיה → הסכומים → מה זה אומר למי שבמצב דומה → קישור לעמוד השירות.
- Do NOT retarget to a service head term; the page owns its case-specific
  query only.
- Tone: precise reporter, not marketer.

**GAP-NEW (5 units)** — new pages (URL = `NEW:/slug/`):
- Same as REBUILD, plus: because the page is new, the opening must
  establish scope instantly (what exactly this page covers vs the pillar).
- Slug and title come from the work order; do not change them.

## 5. INFORMATION-GAIN MENU (pick ≥2 per page, name them in the manifest)

- Identified Israeli case law: case number + court + year + outcome + sum.
- Concrete ₪ ranges from published rulings (sourced), presented in a table.
- Step-by-step process with real deadlines and which document proves what.
- Decision aid: "מתי שווה לתבוע" checklist or flow.
- Interactive tools no competitor has: claim checker, limitation
  calculator, meeting scheduler, court simulation (link with descriptive
  anchors).
- Official data: משרד הבריאות reports, ombudsman (נציב קבילות הציבור)
  statistics — sourced.
- The 2022 inter-ministerial report on malpractice public expenditure
  (this site hosts it — cite and link the pillar until its archive URL is
  live; mark `[TODO-VERIFY: archive URL]`).

## 6. E-E-A-T BLOCK — appears at the end of every page, exactly this structure

```html
<div class="jt-eeat">
  <p><strong>נכתב ונבדק על ידי עו"ד מאיה רוטנברג (מ.ר. 32125)</strong>,
  עורכת דין העוסקת בתחום. עדכון ובדיקה משפטית אחרונה: [REVIEW-DATE].</p>
  <p><strong>מקורות</strong></p>
  <ul>
    <li><a href="..." rel="nofollow">שם המקור המדויק (חוק/פס"ד/גוף רשמי)</a></li>
    <!-- כל מקור שהסתמכת עליו, עם קישור עמוק -->
  </ul>
  <p class="jt-disclaimer">המידע בעמוד זה הוא מידע כללי ואינו תחליף לייעוץ
  משפטי או רפואי פרטני. כל מקרה נבחן לגופו. ליצירת קשר עם עורך דין:
  <a href="/medical-malpractice-lawyer/">עורך דין רשלנות רפואית</a>.</p>
</div>
```
`[REVIEW-DATE]` stays a placeholder — the upload pipeline stamps it.

## 7. CHATGPT DRAFTING TEMPLATE (fill the ⟨slots⟩, one page per prompt)

> You are a senior Israeli legal content writer. Write in Hebrew (RTL), for
> a worried non-lawyer reader. Write the FULL article now — no outline, no
> meta-commentary.
> PAGE: ⟨new_title⟩ — must own the search phrase "⟨primary_query⟩".
> REAL GOOGLE ISRAEL TOP-10 for this phrase (ground truth, do not search
> yourself): ⟨paste the serp .md file content⟩.
> REQUIRED: open with a direct 2-3 sentence answer; cover: ⟨your outline
> H2s⟩; include ⟨your 2+ chosen information-gain elements⟩; one table; one
> checklist; FAQ section answering: ⟨PAA questions from the serp file⟩.
> LEGAL FACTS: use ONLY facts you are certain of from official Israeli
> sources, with the source named inline; where uncertain write
> [TODO-VERIFY: claim]. Never invent case numbers or sums.
> LENGTH: ⟨your band⟩ words. STYLE: short sentences, direct address, no
> "בעולם של היום", no year-stuffing, no superlatives about the firm.
> FORMAT: clean HTML only: h2/h3/p/ul/ol/table/blockquote.

Then YOU edit the draft: verify structure, cut fluff, check facts, add
internal links (§2.4), append the E-E-A-T block (§6), run gates (§9).

## 8. OUTPUT CONTRACT — what you write to `output/`

- One file per unit: `output/U01.html` … `output/U30.html` — the full page
  body HTML (starts at the first `<p>` of the opening answer; no `<html>`,
  no `<h1>` tag — the H1 goes in the manifest).
- `output/manifest.csv` (UTF-8), one row per unit, columns exactly:
  `unit_id, url, primary_query, title, meta_description, h1, filename,
  word_count, serp_verdict, information_gain, internal_links,
  sources_count, todo_verify_count, faq_count, notes`
  - `internal_links`: the target URLs used, `;`-separated.
  - `serp_verdict`: your §3.2 verdict in ≤25 words.
  - `information_gain`: the named elements, `;`-separated.
- FAQ lives inside the HTML as a `<h2>שאלות נפוצות</h2>` section (h3 per
  question) — the upload pipeline generates FAQPage schema from it.

## 9. GATES — check every one before writing the unit's files

- [ ] Title = work order's `new_title`, character count ≤60.
- [ ] Meta ≤155 chars, contains the primary query naturally, no clickbait.
- [ ] First paragraph directly answers the query (readable standalone).
- [ ] Every top-10 subtopic covered; ≥2 information-gain elements present.
- [ ] Zero unverified legal facts without `[TODO-VERIFY]`.
- [ ] Every case number / sum / section number has a named source.
- [ ] 3-6 internal links, all in the allowlist, one to the pillar,
      descriptive Hebrew anchors.
- [ ] E-E-A-T block present with מ.ר. 32125 and ≥2 real sources.
- [ ] No forbidden style: "בעולם של היום", "אין ספק ש", "כידוע",
      empty superlatives, year-stuffing.
- [ ] HTML is only h2/h3/p/ul/ol/table/blockquote/a/strong/em (+ the §6
      div) — no style attributes, no scripts, no images you invented.
- [ ] `absorb_from` value folded in (when set).
- [ ] Word count within ±25% of your declared band.

## 10. ESCALATION — return unfinished rather than guess

If a unit cannot meet the gates (SERP file contradicts the assigned intent,
`absorb_from` content unreachable, a case's facts unverifiable), write the
unit's row in `manifest.csv` with `notes = BLOCKED: <exact reason>` and no
HTML file, and continue to the next unit. A blocked unit is a good outcome;
a guessed unit is a failure.

## 11. ORDER OF WORK

U01 first (dry run — STOP after it, §3.7). Then U02-U30 in order. After
U30: re-scan all gates across the set (especially: no two pages drifted
onto the same query), write `output/DONE.txt` with a 5-line summary
(units done, blocked, total TODO-VERIFYs, anything the engineer must know),
and tell the owner to send the `output/` folder back.
