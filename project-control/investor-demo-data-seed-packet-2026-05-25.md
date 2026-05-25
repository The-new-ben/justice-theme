# Investor Demo Data Seed Packet - 2026-05-25

## Honest Scope

This packet is a copy-ready operator guide. It does not create WordPress users, lawyer profiles, leads, payments, invoices or refunds. Use it only if the owner approves creating controlled live demo records for the investor walkthrough.

## Demo Persona

| Field | Value |
|---|---|
| Scenario | Medical-malpractice lawyer buying lead access |
| Lawyer full name | עו"ד דניאל רוזן |
| Firm name | רוזן רשלנות רפואית ונזקי גוף |
| Practice area | רשלנות רפואית |
| City / service area | תל אביב, מרכז, אונליין |
| Plan | Lead Partner |
| Payment path | Manual invoice / real Grow-Morning payment link |
| Demo email | investor-demo-lawyer@jus-tice.co.il |
| Demo phone | 050-123-4567 |
| Business ID | 123456789 |
| Invoice email | billing-demo@jus-tice.co.il |
| Invoice address | תל אביב |

## Lawyer Profile Copy

Short bio:

משרד רוזן רשלנות רפואית ונזקי גוף מלווה מטופלים ומשפחות בבדיקת חשד לרשלנות רפואית, איסוף מסמכים, הערכת עילת תביעה והפניה לחוות דעת מומחה. ההדגמה מיועדת להציג למשקיע כיצד עורך דין מקבל חשבון, פרופיל מקצועי, פניות מדידות ודוח טיפול.

Service bullets:

- בדיקה ראשונית של חשד לרשלנות רפואית
- איסוף מסמכים רפואיים והכנת תיק
- בחינת צורך בחוות דעת מומחה
- ליווי מול מוסדות רפואיים וחברות ביטוח
- עדכון סטטוס טיפול ודוח ערך באזור האישי

## Demo Lead

| Field | Value |
|---|---|
| Lead type | Medical malpractice inquiry |
| Client name | נועה כהן |
| Client phone | 050-765-4321 |
| Client email | noa.demo@example.com |
| Practice area | רשלנות רפואית |
| City | ראשון לציון |
| Intake summary | לאחר ניתוח אורתופדי הופיעו סיבוכים. הלקוחה מבקשת להבין אם יש עילה לבדיקה משפטית ואילו מסמכים נדרשים. |
| Owner assignment | Assign to עו"ד דניאל רוזן |
| First lawyer stage | Contacted |
| Lawyer follow-up note | שוחחתי עם הלקוחה, ביקשתי סיכום אשפוז, תיעוד ניתוח ותוצאות בדיקות. נקבעה שיחת המשך לאחר קבלת המסמכים. |

## Service Request Demo

Use the claimed lawyer dashboard to submit one ticket after login.

| Request Type | Demo Message |
|---|---|
| Refund request | אבקש לבדוק החזר עבור חודש ההדגמה אם לא יתקבלו פניות פעילות לאחר הפעלת המסלול. |
| Cancel subscription | מבקש להבין איך מבטלים את המסלול ומה קורה ללידים שכבר התקבלו. |
| Lead quality | הליד הראשון רלוונטי, אך חסרים מסמכים רפואיים. מבקש סימון איכות והמשך מעקב. |

## Payment Link Demo

Manual bridge wording:

החיוב האוטומטי החודשי נשאר תלוי אישור Grow/Meshulam. להדגמה מבוקרת משתמשים בקישור תשלום אמיתי של Morning/Grow או בחשבונית ידנית, שומרים את הקישור בכרטיס עורך הדין ומפעילים את המסלול רק אחרי אישור תשלום.

Suggested payment reference:

`INV-DEMO-MEDMAL-2026-05-25`

Suggested payment-link label:

`Jus-Tice Lead Partner - Demo Medical Malpractice Lawyer`

## Morning Demo Order

1. Open homepage and point to the lawyer revenue strip.
2. Open `/lawyer-plans/` and choose Lead Partner.
3. Open checkout fallback and show billing fields, terms, privacy and cancellation links.
4. Open registration with demo lawyer details prefilled.
5. In wp-admin, create or verify the demo lawyer profile only if owner approves live demo data.
6. Attach the demo lawyer to a WordPress user via `claimed_by_user_id`.
7. Paste the real Morning/Grow payment link or invoice reference on the lawyer record.
8. Create or assign the medical-malpractice demo lead only if owner approves live demo data.
9. Log in as the demo lawyer and show dashboard, lead contact buttons and stage update.
10. Submit one service request and show it in Lawyer Onboarding / owner queue.

## Do Not Claim

- Do not claim automatic recurring billing is live.
- Do not claim automatic branded invoices are live.
- Do not claim refunds execute automatically.
- Do not claim demo records are real customers or real legal inquiries.

## Investor Script

The acquisition, onboarding, checkout fallback, private dashboard, lead CRM, follow-up notes and service-request flow are live. Payment automation is approval-gated, so the live bridge is a real manual Morning/Grow payment link or invoice. Once Grow/Meshulam approval is complete, the same customer path can move to recurring payment products without changing the public funnel.
