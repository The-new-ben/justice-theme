# דף פעולה לבעלים: בדיקת מנוי עורך דין להכנסה - 2026-05-27

סטטוס: LAWYER_SUBSCRIPTION_OWNER_PAID_TEST_ACTION_SHEET_READY_NO_LIVE_ACTION
מקור: lawyer-subscription-controlled-evidence-review-gate-2026-05-27

מטרה: להפוך את מסלול מנוי עורך דין מבדיקה פנימית להוכחת הכנסה או החלטת חסימה ברורה, בלי לשמור פרטים אישיים ובלי לבצע חיוב או פנייה לא מאושרים.

## מצב רווחיות

- הכנה סטטית: 70%.
- הוכחת רווח חיה: 0%.
- נתיב ידני: מוכן כמסגרת, לא כחשבונית שנשלחה.
- הכנסה נספרת רק אחרי החלטת בעלים והוכחת תשלום פרטית או החלטה מפורשת של no-charge dry-run שאינה הכנסה.

## מה למלא

| סדר | פעולה | מה הבעלים עושה במערכת הפרטית | מה מותר לרשום בקובץ | מה זה פותח | חסום אם |
| ---: | --- | --- | --- | --- | --- |
| 1 | לאשר זהות בדיקה נשלטת | הבעלים בוחר alias, תיבת מייל וטלפון בדיקה שנשלטים על ידו, ומחליט אם זה dry-run או בדיקה חיה מאושרת. | מותר לרשום alias קצר, yes/no, ומיקום ראיה פרטי. לא לשמור מייל, טלפון, סיסמה או שם אמיתי בקבצים. | פותח הרשמה/דשבורד מבוקרים. | אין זהות בדיקה, אין אישור בעלים, או יש פרטים אישיים בקובץ. |
| 2 | לבחור נתיב תשלום מאושר | לבחור נתיב אחד: manual_invoice, approved_payment_link, provider_link או no_charge_dry_run. Grow/Meshulam נשאר חסם אם אין KYC/מוצר/תשלום מאושרים. | רק שם הנתיב וסטטוס מאושר/לא מאושר. לא להדביק URL תשלום, מפתחות ספק או קבלות. | פותח בדיקת הרשמה ותוכנית בלי להבטיח הכנסה. | אין נתיב תשלום מאושר או אין חלופה ידנית ברורה. |
| 3 | לאשר הרשמה ופרופיל עורך דין מבוקר | רק אחרי אישור: ליצור/לאמת פרופיל בדיקה פרטי, login ודשבורד עורך דין. אם זה לא חי מאושר, להשאיר כ-dry-run. | מותר לרשום wp-admin ID או מיקום ראיה פרטי. לא לשמור סיסמאות, מיילים או טלפונים. | פותח בדיקת בקשות שירות ותוכנית מנוי. | אין פרופיל, אין login, או אין אישור הרשמה חיה. |
| 4 | לבדוק בקשות שירות בדשבורד | להפעיל רק במסגרת הבדיקה בקשות כמו invoice, payment_link, upgrade, downgrade, cancel או refund, ולוודא שהן נוחתות לבדיקת בעלים. | מותר לשמור IDs של בקשות בלבד, בלי גוף הודעה רגיש. | פותח הוכחת תפעול מנוי/חיוב. | בקשות לא נשמרות, או שהן יוצרות פעולה ספק/תשלום בלי אישור. |
| 5 | לקשר ליד/שירות מבוקר אם בודקים הכנסה | אם בודקים ליד בתשלום או מנוי עם ליד: לבחור ליד עם הסכמה ושחרור בעלים, ולקשר אותו לעורך הדין הבדוק. | רק lead ID וסטטוס הסכמה/hold, בלי שם לקוח, טלפון, צאט או מסמכים. | פותח מצב חשבונית/תשלום שמבוסס על ערך אמיתי. | אין ליד עם הסכמה, אין שחרור בעלים, או אין עורך דין מחויב. |
| 6 | להפיק ראיית חשבונית או תשלום פרטית | בנתיב manual_invoice: לרשום invoice/reference אחרי שהבעלים שולח ידנית. בנתיב paid: לספור הכנסה רק כשיש הוכחת תשלום פרטית. | מותר לרשום reference או payment-proof-present=yes בלבד. לא להדביק חשבונית, קבלה או URL פרטי. | פותח החלטת count_revenue / do_not_count / blocked. | יש רק הבטחה או invoice בלי הוכחת תשלום אם רוצים לספור הכנסה. |

## איך למסור לקודקס בלי לחשוף מידע פרטי

1. מלאו את הקובץ: `.project-control\lawyer-subscription-owner-paid-test-owner-fill-2026-05-27.csv`.
2. השתמשו רק בערכים: pass / partial / fail / not_available / needs_owner / park.
3. אל תכניסו שמות, טלפונים, מיילים, סיסמאות, URLs לתשלום, קבלות, הודעות לקוח או מסמכים.
4. אם השורות עוברות, קודקס יכול להריץ סקירת ראיות פרטית ולהגיד אם אפשר להתקדם לשלב חי מאושר.

## בדיקות בטיחות

| מזהה | בדיקה | סטטוס | ראיה |
| --- | --- | --- | --- |
| LAW-SHEET-GATE-01 | source_chain_ready | PASS | Review: LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION; walkthrough: READY_SCRIPT_WITH_RUNTIME_BLOCKERS; manual invoice: MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION. |
| LAW-SHEET-GATE-02 | subscription_is_top_revenue_goal | PASS | Top command-center rows: UNBLOCK-01, UNBLOCK-02, UNBLOCK-08. |
| LAW-SHEET-GATE-03 | manual_invoice_boundary_preserved | PASS | Manual invoice packet records 0 invoices sent and 0 payments created. |
| LAW-SHEET-GATE-04 | no_live_action_authorized | PASS_NO_LIVE_ACTION | This sheet approves 0 registrations, CRM writes, provider changes, invoices, payments, outreach, public edits, GSC calls or uPress actions. |

## מה לא אעשה בלי אישור מפורש

לא אגיש הרשמה חיה, לא אפתח משתמש אמיתי, לא אפנה לעורך דין/לקוח, לא אשלח חשבונית או לינק תשלום, לא אשנה Grow/Meshulam, לא אסמן paid, לא אפרסם עמוד ולא אמשוך uPress מתוך הדף הזה.
