# תקציר החלטות בעלים - 2026-05-27

סטטוס: OWNER_UNBLOCKER_HEBREW_DECISION_BRIEF_READY_NO_LIVE_ACTION
מקור: owner-unblocker-command-queue-2026-05-27

מטרה: לתת לבעלים מסך החלטה קצר בעברית. זהו קובץ פרטי בלבד. הוא לא מאשר עריכת CMS, שינוי SEO, יצירת רשומות CRM, פניה ללקוח/עורך דין/ספק, חשבונית, תשלום, אימייל, WhatsApp/TalkTo, קריאת GSC או uPress.

## שלוש החלטות ראשונות

| מזהה | עדיפות | נושא | החלטה נדרשת | הצעד הבא | אסור בלי אישור | תשובה מומלצת |
| --- | ---: | --- | --- | --- | --- | --- |
| UNBLOCK-00 | 1 | פריסת עמוד הבית החי | להריץ Pull Git ב-uPress עבור wp-content/themes/justice-theme ואז לוודא שעמוד הבית החדש עלה לאתר החי. | להיכנס ל-uPress של jus-tice.co.il, לפתוח Git management לתיקיית wp-content/themes/justice-theme, להריץ Pull Git ולבדוק שהעמוד מציג כותרת עזרה משפטית ואת אזור המצבים החדש. | במהלך המשיכה לא עורכים CMS, לא משנים redirect, canonical/noindex, sitemap, taxonomy, CRM, תשלום או הגדרות ספק. | UNBLOCK-00 approve |
| UNBLOCK-01 | 2 | הוכחת ליד בתשלום בביטוח לאומי | למלא את חבילת מוכנות המקורות של ביטוח לאומי: 3 שורות מומחים פרטיים, כיסוי, ליד אחד עם הסכמה, חיוב, הוכחת תשלום והחלטת go/no-go. | הבעלים או מנהל האתר ממלאים את תבנית מוכנות המקורות של BTL מתוך wp-admin/CRM פרטי, בלי להכניס פרטים אישיים לקבצים. | לא פונים ללידים ישנים, לא מעבירים פרטים אישיים, לא מחייבים, לא מסמנים שולם ולא טוענים להכנסה מתוך הקבצים בלבד. | UNBLOCK-01 approve |
| UNBLOCK-02 | 3 | בדיקת מסלול מנוי עורך דין | לבחור זהות בדיקה נשלטת לעורך דין: שם/מייל/טלפון בדיקה ומסלול תשלום מאושר כמו חשבונית ידנית, לינק תשלום מאושר, קישור ספק או dry-run ללא חיוב. | מריצים walkthrough נשלט רק עם זהות הבדיקה ונתיב התשלום שאושרו. | לא מחייבים עורך דין אמיתי, לא שולחים לינק תשלום, לא מגישים הרשמה חיה ולא משנים ספק תשלום בלי היקף בדיקה מאושר. | UNBLOCK-02 approve |

## כל התור

| מזהה | עדיפות | נושא | למה זה חשוב | אם מאושר | מקור |
| --- | ---: | --- | --- | --- | --- |
| UNBLOCK-00 | 1 | פריסת עמוד הבית החי | שיפור ההמרה של עמוד הבית כבר נמצא בגיטהאב, אבל הוא לא יכול להשפיע על מבקרים, לידים או אמון עד שהשרת החי מושך את התבנית. | אחרי המשיכה מותר לבצע בדיקה חיה לקריאה בלבד: נוסח עמוד הבית, מובייל, קישורי חיפוש/פנייה והיעדר שפת הכנסה פנימית. | HOMEPAGE_DEPLOYMENT_BLOCKED_UPRESS_PULL_REQUIRED |
| UNBLOCK-01 | 2 | הוכחת ליד בתשלום בביטוח לאומי | זה המסלול הקרוב ביותר לליד ראשון בתשלום, אבל כרגע יש רק הכנת תשתית ולא ראיות חיות. | קודקס יכול לבדוק את שורות הראיה ללא פרטים מזהים ולהמשיך רק אם כל השורות עוברות. | BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION |
| UNBLOCK-02 | 3 | בדיקת מסלול מנוי עורך דין | מסלול המנוי מוכן סטטית, אבל הוכחת הכנסה חיה דורשת זהות בדיקה וראיית תשלום שאושרו מראש. | אפשר לאסוף הוכחות על הרשמה, תוכנית, תשלום, דשבורד ובקשות שירות בתוך היקף בדיקה מוגדר. | LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION \| MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION |
| UNBLOCK-08 | 4 | כיסוי עורך דין פלילי בירושלים | הספריה המדויקת פלילי+ירושלים וגם ספריית פלילי בלבד מציגות 0 כרטיסי עורכי דין, לכן אסור להסתמך על הדף לפני שיש כיסוי אמיתי. | אפשר לבדוק את הראיות הפרטיות ואז לבצע צעד prospect/profile פרטי מאושר לפני הרצה מחדש של בדיקת הכיסוי. | CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_PACKET_READY_NO_LIVE_ACTION |
| UNBLOCK-03 | 5 | עדכון ציבורי אפשרי בעמוד הסכם שכירות | זה יכול לשפר המרה בעמוד קיים בלי ליצור מסלול כפול, אבל דורש אישור בעלים/SEO/משפטי לפני עריכת CMS. | אפשר להכין טיוטת שינוי מדויקת בלבד, עדיין בלי פרסום. | OWNER_APPROVAL_QUEUE_READY_NOT_APPROVED |
| UNBLOCK-04 | 6 | החלטת Low Hype / RV | המחקר תומך בפיילוט צר בלבד; מסלול RV עצמאי עדיין מסוכן מדי. | אפשר להמשיך בדיקת GSC/משפטי פרטית או intake ללא פרטים מזהים רק עם הסכמה מפורשת. | LOW_HYPE_RV_FIRST_PILOT_DECISION_QUEUE_READY_NO_PUBLIC_CHANGE |
| UNBLOCK-05 | 7 | עמוד גירושין תל אביב | יש כיסוי ספריה שנראה חי, אבל פרסום דורש מוכנות פרופילים, GSC ובדיקת משפטית/עריכה. | אפשר להכין טיוטת fit-check צרה שמגינה על pillar הגירושין ועל עמודים קשורים. | TEL_AVIV_FAMILY_EVIDENCE_COMPLETION_CONTROL_CENTER_READY_BLOCKED_ON_HUMAN_FILL_NO_PUBLIC_CHANGE |
| UNBLOCK-06 | 8 | תפקיד העמוד פלילי ירושלים | העמוד כבר ציבורי ודק, אבל אסור לערוך לפני שמחליטים איך הוא משתלב עם pillar פלילי ועמודים מומחים. | אפשר להכין טיוטת עדכון רק אחרי שבעלות המסלול ברורה. | CRIMINAL_LAW_PILLAR_SPLIT_DECISION_PACKET_READY_NO_PUBLIC_CHANGE |
| UNBLOCK-07 | 9 | הסכמה ללידים מ-WhatsApp/TalkTo | צאטים נכנסים וישנים יכולים להפוך ל-CRM רק אם הסכמה, כללי עצירה וגבולות no-PII ברורים. | אפשר לטפל בפניות עדכניות רק עם הרשאה; לידים ישנים רק אחרי re-permission מאושר. | CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND |

## בדיקות בטיחות

| מזהה | בדיקה | סטטוס | ראיה |
| --- | --- | --- | --- |
| OHB-GATE-01 | source_owner_queue_available | PASS | Source queue status: OWNER_UNBLOCKER_COMMAND_QUEUE_READY_NO_LIVE_ACTION. |
| OHB-GATE-02 | top_three_owner_decisions_present | PASS | Top rows: UNBLOCK-00, UNBLOCK-01, UNBLOCK-02. |
| OHB-GATE-03 | no_live_action_authorized | PASS | All Hebrew decision rows keep public, CRM/outreach and payment approval set to no. |

## נוסח תשובה קצר

אפשר להשיב רק עם מזהים, למשל:

`UNBLOCK-01 approve, UNBLOCK-08 approve, UNBLOCK-03 park`

## סקירה קצרה

המסלול הכי מהיר להכנסה עדיין אינו פרסום עמוד חדש. הוא אחד משלושה צעדים פרטיים: הוכחת ליד בביטוח לאומי, בדיקת מנוי עורך דין, או אישור prospect פלילי בירושלים כדי לפתוח את חסימת הכיסוי. כל שינוי ציבורי נשאר חסום עד אישור בעלים, GSC ובדיקה משפטית.
