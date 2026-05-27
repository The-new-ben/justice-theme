# מדריך מילוי ראיות להכנסה ראשונה - 2026-05-27

סטטוס: FIRST_REVENUE_OWNER_FILL_GUIDE_READY_NO_LIVE_ACTION

המדריך הזה פנימי בלבד. הוא לא מפרסם עמוד, לא יוצר ליד, לא פונה לעורך דין או ספק, לא יוצר חשבונית או תשלום, ולא מאשר פעולה חיה. המטרה שלו היא לעזור לבעלים או מנהל למלא ראיות מסוננות כדי שקודקס יוכל לבדוק pass/blocked בלי פרטים מזהים.

## מה לעשות עכשיו

1. לפתוח את קובץ המילוי: `.project-control/first-revenue-owner-evidence-kit-owner-fill-2026-05-27.csv`.
2. להתחיל בשלוש השורות הראשונות בלבד: שורה אחת לכל מסלול הכנסה.
3. בכל שורה שעברה בדיקה פרטית אמיתית, למלא `status=pass`, `owner_verified_yes_no=yes`, `proof_present_yes_no=yes`, להשאיר `no_pii_confirmed_yes_no=yes`, ולהשאיר `live_or_public_action_approved=no`.
4. לא להכניס שמות, טלפונים, מיילים, כתובות URL, פרטי לקוחות, מספרי תיקים או סודות.
5. אחרי מילוי, להריץ מחדש את בדיקת הראיות. גם אם הבדיקה עוברת, פעולה חיה עדיין דורשת אישור בעלים נפרד.

## שלוש שורות להתחלה

| מסלול | שורה | פעולה | מה צריך להוכיח | דוגמת pointer בטוחה | סטטוס נוכחי |
| --- | ---: | --- | --- | --- | --- |
| ביטוח לאומי: ליד ראשון בתשלום | 1 | לאמת שלושה מומחי ביטוח לאומי פרטיים | להתחיל רק בשורת המומחה הראשונה: לאמת שיש גורם פרטי מתאים, בלי שם, טלפון, מייל או קישור בקובץ. | btl-private-admin-row-01-01 | BLOCKED_STATUS_NOT_PASS |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 1 | לאשר זהות בדיקה נשלטת | להתחיל רק בזהות הבדיקה: לאשר שהבעלים יודע מי עורך הדין/משתמש הבדיקה, בלי להכניס פרטי קשר לקובץ. | lawyer-test-private-row-01-01 | BLOCKED_STATUS_NOT_PASS |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 1 | לבחור מועמד פרטי אחד לעורך דין פלילי בירושלים | להתחיל רק במועמד אחד: לסמן שיש מועמד פרטי לבדיקה, בלי שם, טלפון, מייל או כתובת אתר בקובץ. | criminal-jlm-private-row-01-01 | BLOCKED_STATUS_NOT_PASS |

## איך למלא עמודות

| עמודה | למלא כך | לא למלא כך |
| --- | --- | --- |
| private_admin_pointer_no_pii | מזהה פנימי בלבד, למשל admin-row-1 או btl-private-admin-row-01. | לא שם אדם, לא טלפון, לא מייל, לא URL, לא מספר תיק, לא סוד API. |
| status | pass רק אם הבעלים/מנהל באמת בדק את הראיה הפרטית. אחרת להשאיר not_started או blocked. | לא לסמן pass כדי להתקדם מהר. pass בלי ראיה ייחסם בהמשך. |
| owner_verified_yes_no | yes רק אם הבעלים/מנהל אישר שהראיה נבדקה. | לא yes אם רק יש הנחה או זיכרון כללי. |
| proof_present_yes_no | yes רק אם קיימת ראיה פרטית במקום אחר: wp-admin, CRM, חשבונית, צילום מסך פרטי או מסמך פנימי. | לא להדביק את הראיה עצמה לקובץ הזה. |
| no_pii_confirmed_yes_no | yes רק אחרי בדיקה שאין בקובץ הזה פרטים מזהים. | לא להשאיר yes אם הוכנסו פרטי קשר, URL או פרטי לקוח. |
| live_or_public_action_approved | להשאיר no. פעולה חיה דורשת אישור בעלים נפרד אחרי שהבדיקה עוברת. | לא להשתמש בעמודה הזו כדי לאשר פנייה, תשלום, פרסום או שינוי ציבורי. |
| owner_note_no_pii | הערה קצרה ללא פרטים מזהים, למשל "נבדק מול wp-admin" או "חסר אישור תשלום". | לא להכניס שמות, מספרים, מיילים, טלפונים, קישורים או פרטי תיק. |

## כל שורות הבדיקה

| מסלול | שורה | action_id | סטטוס נוכחי | pointer מוצע |
| --- | ---: | --- | --- | --- |
| ביטוח לאומי: ליד ראשון בתשלום | 1 | BTL-ACTION-01 | BLOCKED_STATUS_NOT_PASS | btl-private-admin-row-01-01 |
| ביטוח לאומי: ליד ראשון בתשלום | 2 | BTL-ACTION-02 | BLOCKED_STATUS_NOT_PASS | btl-private-admin-row-01-02 |
| ביטוח לאומי: ליד ראשון בתשלום | 3 | BTL-ACTION-03 | BLOCKED_STATUS_NOT_PASS | btl-private-admin-row-01-03 |
| ביטוח לאומי: ליד ראשון בתשלום | 4 | BTL-ACTION-04 | BLOCKED_STATUS_NOT_PASS | btl-private-admin-row-01-04 |
| ביטוח לאומי: ליד ראשון בתשלום | 5 | BTL-ACTION-05 | BLOCKED_STATUS_NOT_PASS | btl-private-admin-row-01-05 |
| ביטוח לאומי: ליד ראשון בתשלום | 6 | BTL-ACTION-06 | BLOCKED_STATUS_NOT_PASS | btl-private-admin-row-01-06 |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 1 | LAW-SUB-ACTION-01 | BLOCKED_STATUS_NOT_PASS | lawyer-test-private-row-01-01 |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 2 | LAW-SUB-ACTION-02 | BLOCKED_STATUS_NOT_PASS | lawyer-test-private-row-01-02 |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 3 | LAW-SUB-ACTION-03 | BLOCKED_STATUS_NOT_PASS | lawyer-test-private-row-01-03 |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 4 | LAW-SUB-ACTION-04 | BLOCKED_STATUS_NOT_PASS | lawyer-test-private-row-01-04 |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 5 | LAW-SUB-ACTION-05 | BLOCKED_STATUS_NOT_PASS | lawyer-test-private-row-01-05 |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 6 | LAW-SUB-ACTION-06 | BLOCKED_STATUS_NOT_PASS | lawyer-test-private-row-01-06 |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 1 | CJ-OWNER-ACTION-01 | BLOCKED_STATUS_NOT_PASS | criminal-jlm-private-row-01-01 |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 2 | CJ-OWNER-ACTION-02 | BLOCKED_STATUS_NOT_PASS | criminal-jlm-private-row-01-02 |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 3 | CJ-OWNER-ACTION-03 | BLOCKED_STATUS_NOT_PASS | criminal-jlm-private-row-01-03 |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 4 | CJ-OWNER-ACTION-04 | BLOCKED_STATUS_NOT_PASS | criminal-jlm-private-row-01-04 |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 5 | CJ-OWNER-ACTION-05 | BLOCKED_STATUS_NOT_PASS | criminal-jlm-private-row-01-05 |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 6 | CJ-OWNER-ACTION-06 | BLOCKED_STATUS_NOT_PASS | criminal-jlm-private-row-01-06 |

## שערי בטיחות

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| FR-FILL-GUIDE-GATE-01 | source_review_loaded | PASS | Source review status: FIRST_REVENUE_OWNER_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION. |
| FR-FILL-GUIDE-GATE-02 | owner_fill_csv_available | PASS | 18/18 owner-fill rows available. |
| FR-FILL-GUIDE-GATE-03 | guide_rows_created | PASS | 18/18 guide rows created. |
| FR-FILL-GUIDE-GATE-04 | no_live_action_from_guide | PASS | The guide only explains private fill values; it approves 0 live/public/payment/email/uPress actions. |

## החלטה

עדיין אין הכנסה חיה. המדריך הופך את החסם לפעולת מילוי פרטית וברורה: שלוש שורות ראשונות, בלי פרטים מזהים, ואז בדיקת pass/blocked חוזרת.
