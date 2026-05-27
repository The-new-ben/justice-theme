# WhatsApp / TalkTo Consent Message Pack - 2026-05-27

Status: CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND

Purpose: give owner/operators exact private wording and stop rules for current inbound WhatsApp/TalkTo leads, old untreated leads, no-PII partner previews and manual billing proof without sending anything automatically.

Safety: no mailbox login, message send, CMS publish, database edit, CRM lead creation, client contact, lawyer/supplier contact, WhatsApp action, TalkTo action, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin or uPress action was performed.

Legal posture: these are operational drafts for owner/legal review, not legal advice. Legacy re-permission is explicitly blocked until owner/legal approval and suppression checks.

## Generated Files

- Private report: `.project-control\whatsapp-talkto-consent-message-pack-2026-05-27.md`
- Private CSV: `.project-control\whatsapp-talkto-consent-message-pack-2026-05-27.csv`
- Blank operator template: `.project-control\whatsapp-talkto-consent-message-template-2026-05-27.csv`
- Machine JSON: `.reports\whatsapp-talkto-consent-message-pack-2026-05-27.json`
- Machine CSV: `.reports\whatsapp-talkto-consent-message-pack-2026-05-27.csv`

## Summary

- Message rows: 8
- Client-facing rows: 4
- Partner-facing rows: 3
- Internal owner rows: 1
- Blocked pending legal/owner approval: 1
- Static code gates passing: 5/5
- Messages sent: 0
- CRM records created: 0
- Partner/client contacts made: 0
- Public changes approved: 0

## Source References

| ID | Source | URL | Why It Matters |
| --- | --- | --- | --- |
| SRC-IL-COMMS-30A | Knesset: Communications Law amendment, section 30A | https://fs.knesset.gov.il/17/law/17_lsr_299991.pdf | Commercial messages generally require explicit prior consent, include sender identity/contact details and allow refusal/opt-out. |
| SRC-PPA-DB-REG | Israel Privacy Protection Authority: database registration after Amendment 13 | https://www.gov.il/he/service/registration_in_the_database | Personal-data databases remain subject to privacy, purpose limitation, confidentiality, data-security and data-subject-right duties even when registration is not required. |
| SRC-PPA-DATA-MIN | Israel Privacy Protection Authority: data minimization public guidance | https://www.gov.il/BlobFolder/rfp/data_minimization_public_hearing/he/data_minimization_public_hearing.pdf | Consent and privacy notices should be clear, direct, accessible and tied to the purpose of collection/use. |

## Static Code Gates

| ID | Gate | Status | Evidence |
| --- | --- | --- | --- |
| CODE-01 | manual bridge has consent states | PASS | inc/lead-crm.php consent options |
| CODE-02 | external leads remain held unless consent is routeable | PASS | inc/lead-routing.php routing guard |
| CODE-03 | partner preview and terms queue exist | PASS | inc/lead-crm.php partner preview queue |
| CODE-04 | owner handoff release exists | PASS | inc/lead-crm.php owner release queue |
| CODE-05 | payment proof guard exists | PASS | inc/lead-crm.php billing proof fields |

## Message Rows

| ID | Audience | Scenario | Consent State | Status | Hebrew Template | CRM Update If Sent | Allowed Use | Blocked Use | Stop Rule |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CLIENT-FRESH-01 | client | fresh inbound WhatsApp or TalkTo message | fresh_inbound_needs_details | READY_FOR_OWNER_LEGAL_REVIEW | שלום, קיבלנו את הפנייה שלך דרך Jus-Tice. כדי להבין אם אפשר לעזור, אפשר לכתוב בקצרה מה הנושא ומה העיר/האזור? אם תרצה/י שנבדוק התאמה לעורך דין או ספק מתאים, כתוב/כתבי במפורש: "אני מאשר/ת להעביר את הפרטים שלי לצורך התאמה". | Keep routing_hold=1; keep consent_status=fresh_inbound_needs_details until explicit wording is received. | Reply to a current inbound lead that asked for help and needs details/permission clarification. | Do not send as a bulk message; do not release PII to a partner from this message alone. | If the person says no, stop and set consent_status=do_not_contact. |
| CLIENT-FRESH-02 | client | fresh inbound gave problem but not match permission | fresh_inbound_needs_details | READY_FOR_OWNER_LEGAL_REVIEW | תודה. לפני שנעביר פרטים לגורם מתאים, נצטרך אישור מפורש ממך. אם את/ה מסכים/ה שנעביר שם, טלפון ותיאור קצר של הפנייה לצורך התאמה, השב/י: "מאשר/ת התאמה". אפשר גם לבקש שלא נעביר פרטים. | Move to explicit_match_consent only after the user replies with clear affirmative wording. | Clarify matching permission after a current user provided case context. | Do not treat silence, emoji, missed call, or button click as match permission. | If permission is unclear, keep routing_hold=1 and do not preview PII. |
| CLIENT-LEGACY-01 | client | old untreated WhatsApp or TalkTo lead | legacy_needs_repermission | BLOCKED_LEGAL_OWNER_APPROVAL_BEFORE_SENDING | שלום, בעבר פנית ל-Jus-Tice בנושא משפטי. אם זה עדיין רלוונטי וברצונך שנבדוק אפשרות התאמה לעורך דין או ספק מתאים, השב/י "מאשר/ת התאמה". אם אינך מעוניין/ת שנפנה שוב, השב/י "הסר". | Use only after owner/legal approval; keep routing_hold=1 until affirmative re-permission is recorded. | Small owner-approved re-permission batch only after suppression/do-not-contact checks. | Do not send to old leads as routine marketing, and do not route legacy rows before renewed permission. | Any opt-out, complaint, ambiguity or no response keeps the lead blocked. |
| CLIENT-STOP-01 | client | user asks not to be contacted | do_not_contact | READY_FOR_OWNER_LEGAL_REVIEW | קיבלנו. לא נפנה אליך שוב בנושא זה. אם תרצה/י בעתיד לפתוח פנייה חדשה, אפשר לפנות דרך האתר Jus-Tice. | Set consent_status=do_not_contact; keep routing_hold=1; record opt-out note and date. | Confirm stop request one time if operationally needed. | Do not include offers, partner names, prices or persuasion. | No further client outreach unless the same person later initiates a new request. |
| PARTNER-PREVIEW-01 | lawyer_or_supplier | no-PII partner preview before terms | owner_verified_consent_or_explicit_match_consent | READY_FOR_OWNER_LEGAL_REVIEW | יש לנו פנייה בתחום [תחום], באזור [אזור כללי], עם דחיפות [נמוכה/בינונית/גבוהה]. בשלב זה לא מועברים שם, טלפון, מסמכים או פרטי זיהוי. האם אתם מקבלים פניות מסוג זה, מה זמינות המענה, ומה תנאי התשלום/עמלת הליד שאתם מאשרים מראש? | Record anonymized_preview_status and partner_terms_status; do not release PII yet. | Ask a potential partner about fit and commercial terms using anonymized facts. | Do not attach screenshots, raw chat, full city/address, documents, phone or email. | If partner does not accept terms/billing contact, do not release client PII. |
| PARTNER-TERMS-01 | lawyer_or_supplier | partner terms confirmation | owner_verified_consent_or_explicit_match_consent | READY_FOR_OWNER_LEGAL_REVIEW | כדי להתקדם עם התאמת פנייה, נא אשרו בכתב: סוג הפניות שאתם מקבלים, מחיר/עמלה מוסכמים, איש קשר לחשבונית/תשלום, זמן תגובה צפוי, והאם קיימת מגבלת קיבולת. רק לאחר אישור ותיעוד, ובכפוף לאישור הלקוח, נוכל לשקול העברת פרטים מזהים. | Record partner_terms_status, min fee, billing contact and owner note. | Confirm commercial terms before any PII release. | Do not promise exclusivity, guaranteed case quality, guaranteed volume or legal outcome. | Missing billing contact or fee keeps owner_handoff_release_status blocked. |
| OWNER-RELEASE-01 | owner_admin | final pre-handoff checklist | explicit_match_consent_or_owner_verified_consent | INTERNAL_ONLY | לפני מסירה: 1. יש אישור לקוח מפורש? 2. יש תקציר ללא מידע עודף? 3. שותף קיבל תנאים ומחיר? 4. יש איש קשר לחיוב? 5. נרשמה החלטת בעלים? 6. נפתח מעקב חשבונית/תשלום? אם אחד חסר - לא מעבירים. | Use as owner_handoff_release_note checklist; no outbound message required. | Internal owner/admin gate before manual handoff. | Do not bypass because the lead is urgent or high-value. | Any missing item keeps routing_hold=1. |
| BILLING-01 | lawyer_or_supplier | manual invoice/payment proof after approved handoff | approved_manual_handoff | READY_FOR_OWNER_LEGAL_REVIEW | בהתאם לתנאים שאושרו מראש עבור הפנייה, נבקש להסדיר תשלום לפי הפרטים שנרשמו. נא לשלוח אישור תשלום/אסמכתא או פרטי חיוב לחשבונית. התשלום יירשם רק לאחר קבלת אסמכתא. | Record qualified_lead_invoice_reference or qualified_lead_payment_evidence_url before marking paid. | After owner release and partner terms are documented. | Do not send before the partner accepted the fee and the handoff was approved. | No payment evidence means no paid revenue claim. |

## Operator Rule

The safest path is: current inbound help request -> details request -> explicit match permission -> routing hold remains -> no-PII partner preview -> accepted partner terms and billing contact -> owner release -> manual handoff -> invoice/payment proof. Old leads do not skip into this path; they stay parked until re-permission is approved and recorded.

## Linear Anchors

- Parent: `HAD-87` WhatsApp/TalkTo consent-safe CRM.
- Related: `HAD-102` paid handoff runbook, `HAD-79` supplier marketplace, `HAD-97` smart-match readiness, `HAD-76` first paid lead.
