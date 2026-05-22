# Family Law Live Repair Diagnostics - 2026-05-22

## Status

- VERIFIED LIVE READ-ONLY: this diagnostic fetches public URLs only.
- HTML PAGES: 6.
- PDF CANDIDATES: 3.
- ROWS WITH ISSUES: 9/9.
- H1 ISSUE ROWS: 6.
- RAW SHORTCODE ROWS: 1.
- WORKING PDF CANDIDATES: 0.
- SAFETY: no CMS write, redirect, canonical/noindex, sitemap, taxonomy, media, CRM, wp-admin or uPress action was made.

## H1 Diagnostics

- /lawyer-divorce-guide-proceedings-costs-rights/: h1_count_3; H1 texts: עורך דין גירושין | מחירים, זכויות וייצוג 2025 | Jus-Tice || עורך דין גירושין — מדריך מלא לשנת 2025: הליך, מחירים וזכויות || עורך דין גירושין – מדריך להליכים, עלויות, זכויות ושלבי התהליך
- /divorce-lawyer/: h1_count_2; H1 texts: עורך דין גירושין: מדריך עומק לבחירה נכונה, תהליך, עלויות, ילדים ורכוש || עורך דין גירושין: מדריך עומק לבחירה נכונה, תהליך, עלויות, ילדים ורכוש
- /divorce-agreement/: h1_count_2; H1 texts: הסכם גירושין 2025 | מדריך + טופס PDF להורדה | Jus-Tice || הסכם גירושין 2025 — מדריך מלא, טופס PDF להורדה וכל מה שצריך לדעת
- /child-support/: h1_count_3; H1 texts: מזונות ילדים: מדריך מעשי לפני הסכם, תביעה או שינוי מצב || מזונות ילדים: איך בודקים צרכים, הכנסות, זמני שהות וסיכונים לפני הסכם או תביעה || רבני מזונות ילדים יסודות חיוב בדמי טיפול
- /child-custody/: h1_count_2; H1 texts: משמורת ילדים וזמני שהות: איך מתכננים הסדר שמתאים לילדים || זמני שהות ואחריות הורית: מדריך להורים בגירושין בלי להפוך את הילדים לזירת מאבק
- /divorce-mediation/: h1_count_3; H1 texts: גישור גירושין: מתי זה נכון, איך מתכוננים ומה חשוב לבדוק || גישור גירושין: מתי זה מתאים, מה בודקים, כמה זה עולה ומה חשוב לא לפספס || גירושין בגישור עם ילדים: הדרך הטובה להתגרש בגישור בלי לפגוע בילדים

## Raw Shortcode Diagnostics

- /divorce-agreement/: justice_pdf_download|justice_contact_form; context: נים עם עורך הדין שלכם. חשוב: הטופס הוא מדריך בלבד ואינו תחליף לייעוץ משפטי. כל הסכם גירושין חייב להיות מותאם לנסיבות הספציפיות של זוג. [justice_pdf_download file="divorce-agreement-template-2025.pdf" label="הורד טופס הסכם גירושין 2025 בחינם"] ⚠️ < || p class="wp-block-paragraph"> זקוק לעורך דין גירושין לעריכת הסכם גירושין? השאר פרטים ומומחה ג'סטיס יחזור אליך תוך שעה. [justice_contact_form type="divorce" subject="הסכם גירושין"] ← <a href="/lawyer-divorce-guide-proceedings-costs-

## PDF Candidates

- https://jus-tice.co.il/wp-content/uploads/divorce-agreement-template-2025.pdf: HTTP 404; content-type: text/html; issues: http_404
- https://jus-tice.co.il/wp-content/uploads/2025/05/divorce-agreement-template-2025.pdf: HTTP 404; content-type: text/html; issues: http_404
- https://jus-tice.co.il/wp-content/uploads/2026/05/divorce-agreement-template-2025.pdf: HTTP 404; content-type: text/html; issues: http_404

## Next

1. Use this report to identify the exact body/template headings to repair after owner approval and CMS rollback backup.
2. Repair `/divorce-agreement/` raw shortcode/PDF promise before marking the page final.
3. Keep divorce-lawyer canonical/redirect/noindex/sitemap decisions blocked until focused GSC export and owner decision.
4. Rerun `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD` after approved public repair.

