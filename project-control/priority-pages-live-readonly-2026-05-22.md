# Priority Pages Live Read-Only QA - 2026-05-22

## Status

- VERIFIED LIVE READ-ONLY: this check fetched public URLs only.
- BASE URL: https://jus-tice.co.il.
- VERIFIED PAGES: 0/6.
- BLOCKED PAGES: 6/6.
- HTTP 200 PAGES: 2/6.
- H1 ISSUE PAGES: 2.
- NOINDEX PAGES: 4.
- MOJIBAKE PAGES: 0.
- PUBLIC REST EMPTY PAGES/POSTS: 6/6.
- SCREENSHOTS: NOT CAPTURED because Playwright is not installed in this repo environment.
- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.

## Results

| Page | Status | HTTP | H1 Count | Issues |
| --- | --- | --- | --- | --- |
| /criminal-lawyer-cost/ | BLOCKED | 200 | 2 | h1_count_2;public_rest_empty_pages_posts |
| /plea-bargain/ | BLOCKED | 200 | 2 | h1_count_2;public_rest_empty_pages_posts |
| /medical-malpractice-diagnosis-errors/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected;public_rest_empty_pages_posts |
| /joint-custody/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected;public_rest_empty_pages_posts |
| /medication-errors-malpractice/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected;public_rest_empty_pages_posts |
| /divorce-pension-split/ | BLOCKED | 404 | 1 | http_404;missing_canonical;noindex_detected;public_rest_empty_pages_posts |

## Duplicate H1 Diagnostics

| Page | H1 Sources | H1 Contexts |
| --- | --- | --- |
| /criminal-lawyer-cost/ | כמה עולה עורך דין פלילי בישראל? / מדריך מחירים מלא 2026 [class=single-article__title id=-] / כמה עולה עורך דין פלילי בישראל? / מדריך מחירים מלא 2026 [class=- id=-] | משפט פלילי כמה עולה עורך דין פלילי בישראל? / מדריך מחירים מלא 2026  / כי דין וטופסי פנייה כדי להפוך חיפוש מבולבל למסלול פעולה ברור יותר. כמה עולה עורך דין פלילי בישראל? / מדריך מחירים מלא 2026 מבוא: למה חשוב להבין את העלויות מראש כאשר אדם מעורב בהליך פלילי, אחת השאלות הראשונות שעולות היא "כמה זה יעלה?". שכר טרחת עורך דין פלילי משתנה מאוד בהתאם לסוג התיק, חומרת העבירה, ניסיון עורך הדין ושלב |
| /plea-bargain/ | הסדר טיעון בישראל / מדריך מלא להליך, יתרונות וסיכונים [class=single-article__title id=-] / הסדר טיעון בישראל / מדריך מלא להליך, יתרונות וסיכונים [class=- id=-] | משפט פלילי הסדר טיעון בישראל / מדריך מלא להליך, יתרונות וסיכונים  / כי דין וטופסי פנייה כדי להפוך חיפוש מבולבל למסלול פעולה ברור יותר. הסדר טיעון בישראל / מדריך מלא להליך, יתרונות וסיכונים מהו הסדר טיעון? הסדר טיעון (Plea Bargain) הוא הסכם בין התביעה לנאשם, שבמסגרתו הנאשם מודה בעבירות מסוימות או מסכים לעובדות מסוימות, בתמורה להקלה מצד התביעה. ההקלה יכולה לבוא לידי ביטוי בהפחתת סעיפי האישום, בהסכ |

## Public REST Visibility

| Page | wp/v2/pages | Page IDs | wp/v2/posts | Post IDs |
| --- | --- | --- | --- | --- |
| /criminal-lawyer-cost/ | 200/0 | - | 200/0 | - |
| /plea-bargain/ | 200/0 | - | 200/0 | - |
| /medical-malpractice-diagnosis-errors/ | 200/0 | - | 200/0 | - |
| /joint-custody/ | 200/0 | - | 200/0 | - |
| /medication-errors-malpractice/ | 200/0 | - | 200/0 | - |
| /divorce-pension-split/ | 200/0 | - | 200/0 | - |

## Next

1. If a row is BLOCKED, inspect the live page in a browser and capture rollback material before any CMS edit.
2. For VERIFIED rows, keep monitoring after cache clears and attach GSC page/query evidence when owner OAuth export is available.
3. Capture mobile/desktop screenshots in a browser-capable environment before marking these pages visually verified.
