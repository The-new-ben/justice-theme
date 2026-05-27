# Lawyer manual invoice sales packet - 2026-05-27

Status: LAWYER_MANUAL_INVOICE_SALES_PACKET_READY_NO_LIVE_ACTION

## Project Manager Check

Active goal: close the first paid lawyer subscription through manual invoice after owner approval.
Readiness to profit: 90% sales-prep readiness, 0% live revenue impact.
Honesty: This packet prepares the first sales conversation only. It does not name or contact a lawyer, create CRM records, invoice, request payment, mark paid, publish or deploy.

## First Offer

Recommended first offer: Pro, 349 ILS per month including VAT.

This packet is internal only. It prepares the words and boundaries for a first close. It does not send anything.

## What To Say

| ID | Type | Text | Do not say | Revenue role |
| --- | --- | --- | --- | --- |
| SALE-OFFER-01 | positioning | אנחנו בודקים צירוף עורך דין אחד למסלול Pro ב-Jus-Tice. המטרה היא פרופיל מקצועי מסודר, בדיקת התאמה, חשיפה מדודה והפעלה בלי התחייבות לכמות פניות. | אל תגידו שיש בלעדיות, הבטחת תיקים או תוצאה משפטית. | Creates a clear low-friction first paid offer. |
| SALE-OFFER-02 | price | המסלול הראשון המומלץ הוא Pro במחיר 349 ש"ח לחודש כולל מע"מ, בכפוף לבדיקת התאמה ואישור תשלום. | אל תציגו את המחיר כהנחה זמנית אם אין אישור בעלים לכך. | Sets a small first close instead of waiting for a larger plan. |
| SALE-OFFER-03 | scope | הפרופיל יופעל רק אחרי בדיקת רישיון, תוכן, פרטי חשבונית ואישור תשלום. חשבונית או קישור תשלום אינם נחשבים תשלום עד שיש אסמכתא. | אל תבטיחו פרסום לפני בדיקות או לפני תשלום. | Protects payment proof and profile activation boundaries. |

## Objection Handling

| ID | Objection | Answer | Close question | Safety note |
| --- | --- | --- | --- | --- |
| OBJ-01 | כמה לידים אני מקבל? | במסלול הזה לא מוכרים כמות לידים. אנחנו מתחילים מחשיפה ופרופיל מקצועי, עם בדיקת התאמה ודיווח בסיסי. אם נראה שיש ביקוש יציב, אפשר לדבר על מסלול מתקדם יותר. | רוצה להתחיל ב-Pro לחודש ראשון ולבדוק התאמה בלי התחייבות לכמות לידים? | No lead-volume promise. |
| OBJ-02 | למה לשלם לפני שיש תוצאות? | התשלום הוא על הקמה, נוכחות מקצועית ותהליך בדיקה מסודר, לא על תוצאה. לכן בחרנו מסלול כניסה נמוך יחסית של 349 ש"ח לחודש. | אם נגדיר את זה כחודש בדיקה מסודר, זה מתאים להתחלה? | No legal-result promise. |
| OBJ-03 | מי רואה את הפרופיל? | האתר מיועד לציבור שמחפש עזרה משפטית. ההופעה תלויה בהתאמה, תוכן, קטגוריה ואיכות הפרופיל. לא נתחייב למיקום קבוע בלי בדיקה נפרדת. | נוכל להתחיל מהפרופיל הבסיסי ולשפר לפי נתונים? | No fixed ranking promise. |
| OBJ-04 | אפשר לבטל? | אפשר להגדיר את ההתחלה כחודש ראשון לבדיקה. תנאי הביטול המדויקים צריכים להיות מאושרים על ידי בעל האתר לפני שליחה. | רוצה שאשלח תנאי התחלה קצרים לאישור? | Terms need owner approval before send. |
| OBJ-05 | אני רוצה בלעדיות בתחום. | בשלב הראשון אין בלעדיות. אנחנו בודקים התאמה של פרופיל מקצועי אחד, בלי לחסום עורכי דין אחרים ובלי לפגוע בבחירת הציבור. | נתחיל בלי בלעדיות ונבחן בהמשך אם יש הצדקה למסלול מתקדם? | No exclusivity. |
| OBJ-06 | איך משלמים? | אחרי אישור התאמה ופרטי חשבונית נשלחת חשבונית או קישור תשלום ידני. הפרופיל מופעל רק אחרי אסמכתת תשלום ובדיקת תוכן. | אפשר לקבל שם חשבונית ומייל חשבוניות כדי להכין את זה אחרי אישור? | No payment claim without proof. |

## Close Sequence

| Step | Phase | Owner/admin action | Pass condition | Blocked if | Live action allowed |
| --- | --- | --- | --- | --- | --- |
| CLOSE-01 | precheck | Select one target lawyer or approve generic draft only. | Owner reply gate passes for target mode, plan and message. | Owner reply CSV is blank or partial. | NO |
| CLOSE-02 | first_contact | Use approved Hebrew message only after owner approval. | Exact message approved and target details stored privately, not in repo. | Message still needs edits or target details are not verified. | NO |
| CLOSE-03 | fit | Verify license, practice fit, claims, billing legal name and invoice email. | Fit and billing facts are confirmed in private admin notes. | Missing license, fit, billing name or invoice email. | NO |
| CLOSE-04 | registration | Use manual invoice registration path for Pro only if owner approved live action. | Registration creates manual invoice follow-up without automatic charge. | No owner live-action approval. | NO |
| CLOSE-05 | invoice | Save invoice reference or manual payment link reference only after accepted terms. | Reference exists before invoice_sent. | No invoice/payment reference. | NO |
| CLOSE-06 | payment | Mark payment confirmed only after private payment proof. | Payment proof exists and owner confirms no dispute. | Promise to pay or invoice only. | NO |

## Not Published And Not Sent

- No lawyer is named or contacted.
- No CRM or admin record is created or edited.
- No invoice or payment request is created.
- No revenue or paid status is claimed.
- No public profile, public page, route, SEO setting or uPress action is changed.