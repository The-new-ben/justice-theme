# טופס שלוש שורות להכנסה ראשונה - 2026-05-27

סטטוס: FIRST_REVENUE_THREE_ROW_OWNER_STARTER_READY_NO_LIVE_ACTION

זהו טופס פנימי קצר לבעלים/מנהל. ממלאים כאן רק שלוש שורות התחלה, בלי פרטים מזהים. אחרי מילוי, מעבירים את הערכים לקובץ ה-CSV המלא ומריצים בדיקת ראיות חוזרת.

## שורות למילוי

| מסלול | שורת CSV | פעולה | מה לבדוק בפרטי | pointer בטוח לדוגמה | סטטוס לכתוב רק אם נבדק |
| --- | ---: | --- | --- | --- | --- |
| ביטוח לאומי: ליד ראשון בתשלום | 1 | לאמת שלושה מומחי ביטוח לאומי פרטיים | להתחיל רק בשורת המומחה הראשונה: לאמת שיש גורם פרטי מתאים, בלי שם, טלפון, מייל או קישור בקובץ. | btl-private-admin-row-01-01 | pass |
| מנוי עורך דין: בדיקה בתשלום או חשבונית ידנית | 1 | לאשר זהות בדיקה נשלטת | להתחיל רק בזהות הבדיקה: לאשר שהבעלים יודע מי עורך הדין/משתמש הבדיקה, בלי להכניס פרטי קשר לקובץ. | lawyer-test-private-row-01-01 | pass |
| כיסוי פלילי בירושלים: ספק/עורך דין לפני פרסום | 1 | לבחור מועמד פרטי אחד לעורך דין פלילי בירושלים | להתחיל רק במועמד אחד: לסמן שיש מועמד פרטי לבדיקה, בלי שם, טלפון, מייל או כתובת אתר בקובץ. | criminal-jlm-private-row-01-01 | pass |

## ערכים לכתוב רק אחרי בדיקה פרטית

| עמודה בקובץ המלא | ערך |
| --- | --- |
| private_admin_pointer_no_pii | מזהה פנימי קצר בלבד, לדוגמה מהעמודה safe_pointer_example. |
| status | pass |
| owner_verified_yes_no | yes |
| proof_present_yes_no | yes |
| no_pii_confirmed_yes_no | yes |
| live_or_public_action_approved | no |
| owner_note_no_pii | הערה קצרה ללא פרטים מזהים, או להשאיר ריק. |

קובץ יעד מלא: `.project-control/first-revenue-owner-evidence-kit-owner-fill-2026-05-27.csv`

אסור: לא להכניס שם, טלפון, מייל, URL, מספר תיק, פרטי לקוח, פרטי כרטיס, סוד API או צילום/טקסט פרטי.

## שערי בטיחות

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| FR-3ROW-GATE-01 | fill_guide_ready | PASS | Fill guide status: FIRST_REVENUE_OWNER_FILL_GUIDE_READY_NO_LIVE_ACTION. |
| FR-3ROW-GATE-02 | three_start_rows_only | PASS | 3/3 starter rows generated. |
| FR-3ROW-GATE-03 | live_action_still_blocked | PASS | Every starter row keeps live_or_public_action_approved=no. |
| FR-3ROW-GATE-04 | revenue_not_claimed | PASS | The starter sheet cannot claim revenue; it only prepares private evidence pointers. |

## החלטה

אין עדיין הכנסה חיה. אם שלוש השורות ימולאו נכון ויעברו בדיקה, אפשר יהיה לבקש אישור בעלים לשלב הבא. גם אז לא מבוצעת פעולה חיה בלי אישור מפורש.
