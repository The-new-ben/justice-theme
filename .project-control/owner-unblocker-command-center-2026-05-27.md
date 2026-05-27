# מרכז החלטות בעלים פרטי - 2026-05-27

סטטוס: OWNER_UNBLOCKER_COMMAND_CENTER_READY_NO_LIVE_ACTION
מקור: owner-unblocker-hebrew-decision-brief-2026-05-27

מטרה: קובץ ניווט פרטי שמחבר בין החלטות הבעלים, תקציר עברי, תבנית תשובה וחבילות המקור. הוא לא מאשר פעולה ציבורית, CRM, פניה, חשבונית, תשלום, אימייל או uPress.

## שלוש ההחלטות הראשונות

| מזהה | עדיפות | נושא | תשובה מוצעת | מקור פרטי | הצעד הבא | אסור ללא אישור |
| --- | ---: | --- | --- | --- | --- | --- |
| UNBLOCK-00 | 1 | פריסת עמוד הבית החי | UNBLOCK-00 approve | .project-control/homepage-deployment-blocker-2026-05-27.md | להיכנס ל-uPress של jus-tice.co.il, לפתוח Git management לתיקיית wp-content/themes/justice-theme, להריץ Pull Git ולבדוק שהעמוד מציג כותרת עזרה משפטית ואת אזור המצבים החדש. | במהלך המשיכה לא עורכים CMS, לא משנים redirect, canonical/noindex, sitemap, taxonomy, CRM, תשלום או הגדרות ספק. |
| UNBLOCK-01 | 2 | הוכחת ליד בתשלום בביטוח לאומי | UNBLOCK-01 approve | .project-control/btl-source-readiness-admin-fill-packet-2026-05-27.md | הבעלים או מנהל האתר ממלאים את תבנית מוכנות המקורות של BTL מתוך wp-admin/CRM פרטי, בלי להכניס פרטים אישיים לקבצים. | לא פונים ללידים ישנים, לא מעבירים פרטים אישיים, לא מחייבים, לא מסמנים שולם ולא טוענים להכנסה מתוך הקבצים בלבד. |
| UNBLOCK-02 | 3 | בדיקת מסלול מנוי עורך דין | UNBLOCK-02 approve | .project-control/lawyer-subscription-controlled-evidence-review-gate-2026-05-27.md | מריצים walkthrough נשלט רק עם זהות הבדיקה ונתיב התשלום שאושרו. | לא מחייבים עורך דין אמיתי, לא שולחים לינק תשלום, לא מגישים הרשמה חיה ולא משנים ספק תשלום בלי היקף בדיקה מאושר. |

## כל השורות

| מזהה | עדיפות | נושא | מקור קיים | סטטוס מקור | פעולה חיה מאושרת |
| --- | ---: | --- | --- | --- | --- |
| UNBLOCK-00 | 1 | פריסת עמוד הבית החי | yes | HOMEPAGE_DEPLOYMENT_BLOCKED_UPRESS_PULL_REQUIRED | no |
| UNBLOCK-01 | 2 | הוכחת ליד בתשלום בביטוח לאומי | yes | BTL_SOURCE_READINESS_ADMIN_FILL_PACKET_READY_BLOCKED_ON_OWNER_ADMIN_EVIDENCE_NO_LIVE_ACTION | no |
| UNBLOCK-02 | 3 | בדיקת מסלול מנוי עורך דין | yes | LAWYER_SUBSCRIPTION_CONTROLLED_EVIDENCE_REVIEW_BLOCKED_NO_LIVE_ACTION \| MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION | no |
| UNBLOCK-08 | 4 | כיסוי עורך דין פלילי בירושלים | yes | CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_PACKET_READY_NO_LIVE_ACTION | no |
| UNBLOCK-03 | 5 | עדכון ציבורי אפשרי בעמוד הסכם שכירות | yes | OWNER_APPROVAL_QUEUE_READY_NOT_APPROVED | no |
| UNBLOCK-04 | 6 | החלטת Low Hype / RV | yes | LOW_HYPE_RV_FIRST_PILOT_DECISION_QUEUE_READY_NO_PUBLIC_CHANGE | no |
| UNBLOCK-05 | 7 | עמוד גירושין תל אביב | yes | TEL_AVIV_FAMILY_EVIDENCE_COMPLETION_CONTROL_CENTER_READY_BLOCKED_ON_HUMAN_FILL_NO_PUBLIC_CHANGE | no |
| UNBLOCK-06 | 8 | תפקיד העמוד פלילי ירושלים | yes | CRIMINAL_LAW_PILLAR_SPLIT_DECISION_PACKET_READY_NO_PUBLIC_CHANGE | no |
| UNBLOCK-07 | 9 | הסכמה ללידים מ-WhatsApp/TalkTo | yes | CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND | no |

## בדיקות

| מזהה | בדיקה | סטטוס | ראיה |
| --- | --- | --- | --- |
| OCC-GATE-01 | source_hebrew_brief_ready | PASS | Source Hebrew brief status: OWNER_UNBLOCKER_HEBREW_DECISION_BRIEF_READY_NO_LIVE_ACTION. |
| OCC-GATE-02 | top_three_private_sources_linked | PASS | Top rows: UNBLOCK-00:yes, UNBLOCK-01:yes, UNBLOCK-02:yes. |
| OCC-GATE-03 | all_source_artifacts_exist | PASS | All row source artifacts exist locally. |
| OCC-GATE-04 | no_live_action_authorized | PASS | Source report keeps public, CRM/outreach, payment and email approvals disabled. uPress deployment required: yes. |
