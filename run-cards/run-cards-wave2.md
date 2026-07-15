# RUN CARDS — WAVE 2: CRIMINAL (עורך דין פלילי)

Owner workflow: paste one card at a time into ChatGPT Deep Research, attach
the files listed in its INPUTS (all hosted under
https://jus-tice.co.il/wp-content/uploads/jt-warpack/ as .txt), reply "המשך"
when it stops mid-run, export via the download button as a single .html
file. One run = one card. Engineering (Claude Code) takes every output
through the QA gauntlet, primary-source fact pass, and publishes.

Attribution law (CLAUDE.md): criminal content is NEVER attributed to מאיה
רוטנברג. The writer writes NO attribution/reviewer line at all — the
truthful bottom line is added at the engineering QA stage.

Style law (hard, run disqualified on breach):
- No em/en dashes (— –) anywhere. Use commas, colons or hyphens.
- No AI-teller phrases: בעולם של היום, אין ספק, כידוע, למותר לציין,
  חשוב להבין, חשוב לדעת, יש לציין, בשורה התחתונה, כפי שראינו.
- No [citeturn...] or 【†】 artifacts; export via download only.
- Answer-first: every H2 opens with a direct 2-3 sentence answer.
- Any fact, statute section, case number or sum you are not 100% sure of:
  write [TODO-VERIFY: what needs verification]. Never invent case law.
- Internal links ONLY from the attached allowlist file, max 6 per unit,
  natural anchors. External links only to primary sources (gov.il,
  wikisource, knesset.gov.il, kolzchut.org.il) with rel="nofollow".
- Allowed tags: h2 h3 p ul ol li table thead tbody tr th td blockquote a
  strong em br. No h1, no div, no inline styles.

## CARD A — THE CRIMINAL PILLAR (run first)

MISSION: the definitive Hebrew resource for "עורך דין פלילי" on
/criminal-defense-attorney/ (81,000 impressions at position 57 — the
biggest single prize on the site). Target 9,000-11,000 words of real
substance that beats every attached competitor on coverage AND precision.

INPUTS: corpus-w2 files (88 competitor pages including every ranking
firm), serp-w2 files (24 real Israeli SERPs with PAA), wave2-allowlist.txt,
the live page text (attached).

REQUIRED COVERAGE (the SERP + corpus prove demand for each): מתי חייבים
עורך דין פלילי (זימון לחקירה, מעצר, שחרור בערובה, שימוע, כתב אישום,
משפט, ערעור); זכויות הנחקר והעצור בכל שלב עם סעיפי חוק מדויקים
[TODO-VERIFY where unsure]; חקירת משטרה: מה מותר לחוקרים, זכות השתיקה
והשלכותיה; מעצר ימים מול מעצר עד תום ההליכים; עסקת טיעון: יתרונות,
סיכונים, אישור בית משפט; שכר טרחה: מבנה, טווחים לפי שלב [TODO-VERIFY],
מה כלול; איך בוחרים סנגור (קריטריונים, שאלות, דגלים אדומים); רישום פלילי
ומחיקתו (חוק המידע הפלילי ותקנת השבים התשע"ט-2019 [TODO-VERIFY סעיפים]);
טבלת עבירות נפוצות ומתחי ענישה [TODO-VERIFY לכל עבירה]; שאלות נפוצות
המשקפות את ה-PAA מהקבצים המצורפים.

## CARD B1 — רישום פלילי ומחיקה (units W01, W…)
Rebuild the police-record family per the work order rows: מחיקת רישום
משטרתי, מחיקת רישום פלילי, תעודת מידע פלילי, רישום פלילי כמה שנים.
gov.il owns these SERPs with procedure pages — win on PRECISION: exact
eligibility, timelines, forms, and what a lawyer changes. 1,500-2,500
words per unit. Each unit links up to the pillar.

## CARD B2 — עבירות מין (defense side)
Units per work order: עורך דין עבירות מין, עבירת מין. Sensitive area:
factual, procedural, zero sensationalism, defendant-rights framing with
victim-respect language. Competitor corpus attached; exceed on process
detail (חקירה, מעצר, איסור פרסום, סיווג עבירות וענישה [TODO-VERIFY]).

## CARD B3 — סמים, הלבנת הון, הונאה וצווארון לבן
Units: עבירות סמים, הלבנת הון, הונאות, צווארון לבן. Include the statutory
anchors (פקודת הסמים המסוכנים, חוק איסור הלבנת הון התש"ס-2000, סעיפי
מרמה בחוק העונשין) as [TODO-VERIFY] where exact sections are uncertain.

## CARD B4 — מעצר, חקירה והליך
Units: הארכת מעצר ימים, שחרור ממעצר, זימון לחקירה, זכויות נחקר, שימוע,
כתב אישום, עיכוב הליכים, ערעור פלילי, עסקת טיעון. kolzchut wins several
of these — match its accuracy, beat it on practical defense guidance.

## CARD B5 — International + misc per work order
Units: מעצר בחו"ל, עבירות בארה"ב (מירנדה, רצח, אונס — informational,
jurisdiction-honest: US law as background for Israeli readers, never
advice in foreign law), plus remaining work-order rows.

OUTPUT CONTRACT per run: one .html file per unit, separated by
<!-- UNIT: Wxx --> comments, plus a manifest block at the end listing
unit_id, title, meta_description, h1, word_count, todo_verify_count,
faq_count. Titles and metas come from the work order columns; do not
invent new ones.
