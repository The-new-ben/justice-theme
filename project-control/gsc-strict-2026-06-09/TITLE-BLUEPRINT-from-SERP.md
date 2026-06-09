# Title Blueprint — reverse-engineered from the live SERP (2026-06-09)

> Rule the owner set: do NOT invent unique marketing titles. Match the pattern Google
> already rewards on page 1 for each head term. Below is what actually ranks #1–10 today,
> the extracted pattern, and the title formula to apply to our pillar pages. No em-dashes,
> no AI tells, no slogans.

## Why this matters (live GSC, 16 months)

We hold huge impressions on the head money terms but sit on page 4–8, so we get ~0 clicks:

| Query | Impressions | Avg position | Clicks |
|---|---:|---:|---:|
| עורך דין פלילי | 13,989 | 45.7 | 10 |
| עורך דין מקרקעין | 13,412 | 64.0 | 2 |
| עורך דין פלילי מומלץ | 13,192 | 25.3 | 1 |
| ביטול כתב אישום | 11,837 | 36.6 | 0 |
| עורך דין עבירות מין | 10,849 | 63.9 | 0 |
| עורך דין מכירת דירה | 10,286 | 53.0 | 0 |
| עורך דין הסכם ממון | 9,236 | 60.9 | 0 |
| עורך דין גירושין | 8,520 | 83.6 | 0 |
| עורך דין רשלנות רפואית בלידה | 8,209 | 41.0 | 0 |
| עורך דין סמים | 8,107 | 31.5 | 0 |
| עורך דין | 6,944 | 39.9 | 21 |

## What ranks #1–10 right now (verbatim SERP titles)

### עורך דין פלילי
- עורך דין פלילי מומחה אסף דוק
- עורך דין פלילי אלון ארז: זמינות 24/7 | יעוץ וליווי משפטי מלא
- עורך דין פלילי | עו"ד פלילי מומלץ - ייעוץ וליווי משפטי! - יעקב שקלאר
- עורך דין פלילי מנוסה בכל סוגי העבירות | עו"ד לימור עציוני
- עורך דין פלילי מומלץ - לפי 603 חוות דעת (LawReviews — directory)

### עורך דין מקרקעין
- עורך דין מקרקעין יוני לוי - ליווי משפטי מקצועי בעסקאות נדל"ן
- עורך דין מקרקעין ותכנון ובנייה | קולודני ושות - 19+ שנות ניסיון
- עורך דין מקרקעין דניאל שגב | ניסיון של מעל 400 עסקאות מקרקעין
- עורך דין מקרקעין מומלץ (נדל"ן) | לפי 1292 חוות דעת | LawReviews (directory)

### עורך דין גירושין
- עורך דין גירושין, דיני משפחה: מעל 25 שנות ניסיון | אביבית מוסקוביץ
- עורך דין גירושין ודיני משפחה ⚖️ 20 שנות ניסיון מוכח - לוסי מאיר
- עורך דין גירושין | המדריך המלא (2025)  ← informational/guide ranker (closest to our page type)

## The extracted pattern (what Google rewards — copy this, don't deviate)

1. **Exact head keyword FIRST**: the title opens with `עורך דין <תחום>`.
2. **Add the SERP synonym/expansion** that co-occurs: גירושין→"דיני משפחה", מקרקעין→"נדל\"ן",
   פלילי→"ייעוץ וליווי משפטי".
3. **One trust token from the SERP's own vocabulary** (never a made-up slogan):
   `מומלץ` · `מנוסה` · `מומחה` · `ניסיון מוכח` · `N שנות ניסיון` · `זמינות 24/7`.
4. **Pipe `|` separator**, then the brand or the guide signal.
5. For a **portal/guide page** (which is what our pillars are — not a single firm), the
   winning page-1 pattern is the "guide" ranker: `עורך דין <תחום> | המדריך המלא (<year>)`.
   We are a directory+guide like LawReviews, so we follow the directory/guide pattern,
   not the single-lawyer pattern.

## Recommended pillar titles (match SERP, ready to apply — NOT yet applied)

| Pillar slug | Recommended `<title>` (≤60 chars where possible) |
|---|---|
| criminal-defense-attorney | עורך דין פלילי - ייעוץ וליווי משפטי \| מדריך והשוואה \| Jus-Tice |
| real-estate-attorney | עורך דין מקרקעין ונדל"ן - מדריך מלא לעסקה בטוחה \| Jus-Tice |
| divorce-lawyer | עורך דין גירושין ודיני משפחה - המדריך המלא \| Jus-Tice |
| medical-malpractice-lawyer | עורך דין רשלנות רפואית - מתי תובעים ואיך \| מדריך \| Jus-Tice |
| traffic-lawyer | עורך דין תעבורה - שלילת רישיון, דוחות ושכרות \| מדריך \| Jus-Tice |
| labor-lawyer | עורך דין דיני עבודה - זכויות עובדים ופיטורים \| מדריך \| Jus-Tice |
| inheritance-lawyer | עורך דין ירושה וצוואות - צו ירושה והתנגדות \| מדריך \| Jus-Tice |
| personal-injury-law | עורך דין נזיקין ותאונות - פיצויים ותביעות \| מדריך \| Jus-Tice |
| immigration-lawyer | עורך דין הגירה ואזרחות - ויזות ודרכונים \| מדריך \| Jus-Tice |

Notes:
- Every title leads with the exact head keyword, adds the co-occurring synonym, carries a
  neutral guide/comparison signal (מדריך / השוואה) like LawReviews, and ends with the brand.
- No em-dashes (we use a normal hyphen "-" and the pipe "|"); no exclamation slogans; no
  "best/number 1" claims (Bar rules + Google spam).

## How to apply safely (theme-level, no DB write, reversible)

A `pre_get_document_title` / Yoast `wpseo_title` filter keyed by the pillar slug can set these
titles from theme code — no post-table edits, instantly reversible by removing the filter.
Recommended only after the owner reviews the 9 strings above. Not applied in this commit.
