# ערכת ראיות בעלים להכנסה ראשונה - 2026-05-27

סטטוס: FIRST_REVENUE_OWNER_EVIDENCE_KIT_READY_NO_LIVE_ACTION

מטרה: לרכז את שלושת מסלולי ההכנסה הראשונים לערכת מילוי אחת. הערכה לא מפרסמת, לא פונה, לא מחייבת ולא יוצרת רשומות. היא רק אומרת לבעלים מה למלא במערכות הפרטיות כדי שקודקס יוכל לבדוק pass/blocked.

## תמונת מצב

| יעד | מוכנות סטטית | הוכחת רווח חי | אפשר לספור הכנסה | קובץ מילוי | דף פעולה |
| --- | ---: | ---: | --- | --- | --- |
| ביטוח לאומי: ליד ראשון בתשלום | 75% | 0% | no | .project-control/btl-owner-first-paid-lead-owner-fill-2026-05-27.csv | .project-control/btl-owner-first-paid-lead-action-sheet-2026-05-27.html |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 70% | 0% | no | .project-control/lawyer-subscription-owner-paid-test-owner-fill-2026-05-27.csv | .project-control/lawyer-subscription-owner-paid-test-action-sheet-2026-05-27.html |
| ספק פלילי בירושלים: כיסוי פרטי לפני פרסום | 65% | 0% | no | .project-control/criminal-jerusalem-owner-coverage-owner-fill-2026-05-27.csv | .project-control/criminal-jerusalem-owner-coverage-action-sheet-2026-05-27.html |

## שלושת הצעדים עכשיו

1. למלא קודם את ביטוח לאומי אם קיימות ראיות פרטיות לשלושה מומחים וליד עם הסכמה.
2. למלא את מנוי עורך דין אם קיימת זהות בדיקה ונתיב תשלום/חשבונית מאושר.
3. למלא את כיסוי פלילי ירושלים אם יש מועמד ספק אמיתי שאפשר לאמת בלי לפרסם ובלי לפנות.

## שורות מילוי מאוחדות

| מסלול | מזהה | פעולה | סטטוס התחלתי | אישור בעלים | ראיה קיימת | אסור פעולה חיה |
| --- | --- | --- | --- | --- | --- | --- |
| UNBLOCK-01 | BTL-ACTION-01 | לאמת שלושה מומחי ביטוח לאומי פרטיים | not_started | no | no | no |
| UNBLOCK-01 | BTL-ACTION-02 | להפוך את השלושה לכיסוי ניתן לניתוב | not_started | no | no | no |
| UNBLOCK-01 | BTL-ACTION-03 | לבחור ליד ביטוח לאומי אחד עם הסכמה | not_started | no | no | no |
| UNBLOCK-01 | BTL-ACTION-04 | ליצור מצב חיוב לליד מוסמך | not_started | no | no | no |
| UNBLOCK-01 | BTL-ACTION-05 | לאשר תשלום רק עם הוכחה פרטית | not_started | no | no | no |
| UNBLOCK-01 | BTL-ACTION-06 | לקבל החלטת scale/fix/stop | not_started | no | no | no |
| UNBLOCK-02 | LAW-SUB-ACTION-01 | לאשר זהות בדיקה נשלטת | not_started | no | no | no |
| UNBLOCK-02 | LAW-SUB-ACTION-02 | לבחור נתיב תשלום מאושר | not_started | no | no | no |
| UNBLOCK-02 | LAW-SUB-ACTION-03 | לאשר הרשמה ופרופיל עורך דין מבוקר | not_started | no | no | no |
| UNBLOCK-02 | LAW-SUB-ACTION-04 | לבדוק בקשות שירות בדשבורד | not_started | no | no | no |
| UNBLOCK-02 | LAW-SUB-ACTION-05 | לקשר ליד/שירות מבוקר אם בודקים הכנסה | not_started | no | no | no |
| UNBLOCK-02 | LAW-SUB-ACTION-06 | להפיק ראיית חשבונית או תשלום פרטית | not_started | no | no | no |
| UNBLOCK-08 | CJ-OWNER-ACTION-01 | לבחור מועמד פרטי אחד לעורך דין פלילי בירושלים | not_started | no | no | no |
| UNBLOCK-08 | CJ-OWNER-ACTION-02 | לאמת רישיון וסטטוס מקצועי | not_started | no | no | no |
| UNBLOCK-08 | CJ-OWNER-ACTION-03 | לאמת התאמה פלילית ושירות בירושלים | not_started | no | no | no |
| UNBLOCK-08 | CJ-OWNER-ACTION-04 | לאשר זמינות תגובה ללידים רגישים | not_started | no | no | no |
| UNBLOCK-08 | CJ-OWNER-ACTION-05 | לאשר תנאי lead-fee ונתיב חשבונית ידני | not_started | no | no | no |
| UNBLOCK-08 | CJ-OWNER-ACTION-06 | להחליט אם מכינים כרטיס ציבורי בנפרד | not_started | no | no | no |

## תשובת בעלים קצרה

| יעד | החלטה | מקום ראיה פרטי ללא PII | פעולה חיה מאושרת | תשלום/חשבונית מאושרים |
| --- | --- | --- | --- | --- |
| UNBLOCK-01 | approve_fill / park / reject / needs_more_evidence |  | no | no |
| UNBLOCK-02 | approve_fill / park / reject / needs_more_evidence |  | no | no |
| UNBLOCK-08 | approve_fill / park / reject / needs_more_evidence |  | no | no |

## בדיקות בטיחות

| מזהה | בדיקה | סטטוס | ראיה |
| --- | --- | --- | --- |
| FRK-GATE-01 | top_three_sources_available | PASS | UNBLOCK-01:BTL_OWNER_FIRST_PAID_LEAD_ACTION_SHEET_READY_NO_LIVE_ACTION \| UNBLOCK-02:LAWYER_SUBSCRIPTION_OWNER_PAID_TEST_ACTION_SHEET_READY_NO_LIVE_ACTION \| UNBLOCK-08:CRIMINAL_JERUSALEM_OWNER_COVERAGE_ACTION_SHEET_READY_NO_LIVE_ACTION |
| FRK-GATE-02 | command_center_top_three_aligned | PASS | Top command-center rows: UNBLOCK-01, UNBLOCK-02, UNBLOCK-08. |
| FRK-GATE-03 | revenue_not_claimable_yet | PASS | UNBLOCK-01: live proof 0%, revenue no \| UNBLOCK-02: live proof 0%, revenue no \| UNBLOCK-08: live proof 0%, revenue no |
| FRK-GATE-04 | no_live_action_authorized | PASS_NO_LIVE_ACTION | This kit approves 0 CMS edits, CRM writes, outreach, supplier/lawyer/client contact, invoices, payments, email, WhatsApp/TalkTo, SEO changes or uPress actions. |

## הצהרת כנות

הערכה הזו לא מייצרת כסף בעצמה. היא מקצרת את הדרך לראיות: supply, consent, billing ו-payment proof. בלי מילוי בעלים/מנהל ובלי הוכחת תשלום פרטית, ההכנסה נשארת 0.
