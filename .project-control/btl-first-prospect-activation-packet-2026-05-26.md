# Bituach Leumi First-Prospect Activation Packet - 2026-05-26

Status: READY_FOR_OWNER_PRIVATE_PROSPECT_ENTRY

Scope: private owner/team activation packet for the first Bituach Leumi supplier entries. This does not create leads, create prospects, create lawyer records, publish public pages, send outreach, route clients, invoice, charge payment, change SEO controls or deploy uPress.

## Source Boundary

- Source CSV: `.project-control/btl-specialist-prospect-shortlist-2026-05-26.csv`.
- This is not a public recommendation list and not public lawyer-directory content.
- Selection order is for private CRM entry only. It does not endorse any candidate.
- Every candidate starts as `not_verified` until the private CRM verification fields prove otherwise.

## Summary

- Source rows loaded: 19
- High-priority rows available: 12
- Primary private-entry candidates: 3
- Backup private-entry candidates: 3
- Public changes approved by this packet: 0

## Primary Private-Entry Queue

| Step | Candidate | Source | Focus | Current Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| 1 | עו"ד אורי דלאל | [source](https://www.work-accidents.co.il/appeal-to-a-medical-committee/) | ערעור ועדה רפואית, נפגעי עבודה, נכות כללית, ועדות ערר | not_verified | Create private prospect, then verify all gates before any outreach. |
| 2 | קובי שפירא משרד עורכי דין | [source](https://kslaw.biz/social-security/) | ביטוח לאומי, ועדות רפואיות, ועדות ערר, בית הדין לעבודה | not_verified | Create private prospect, then verify all gates before any outreach. |
| 3 | סמרה ושות' משרד עורכי דין ונוטריון | [source](https://samaratviot.co.il/bituach-leumi/) | תביעות ביטוח לאומי, ועדות רפואיות, דיני המוסד לביטוח לאומי | not_verified | Create private prospect, then verify all gates before any outreach. |

## Backup Queue

| Step | Candidate | Source | Focus | Current Status | Next Action |
| --- | --- | --- | --- | --- | --- |
| 1 | לב-טייב משרד עורכי דין / עו"ד מיכאל לב | [source](https://lt-law.co.il/medical-committee-appeal/) | ועדה רפואית וערעור, ביטוח לאומי, תביעות ביטוח | not_verified | Hold as backup unless a primary candidate fails gates. |
| 2 | מרום פרידמן משרד עורכי דין | [source](https://www.m-f.law/%D7%91%D7%99%D7%98%D7%95%D7%97-%D7%9C%D7%90%D7%95%D7%9E%D7%99) | תביעות מול ביטוח לאומי, ועדות רפואיות, ועדות ערר, בית הדין האזורי לעבודה | not_verified | Hold as backup unless a primary candidate fails gates. |
| 3 | עו"ד ראובן צירלסון / משרד צירלסון | [source](https://tsirelson-law.co.il/) | ביטוח לאומי, נכות כללית, נכות מעבודה, סיעוד, ועדות/ערעורים | not_verified | Hold as backup unless a primary candidate fails gates. |

## Per-Prospect Manual Checklist

1. Verify Israeli Bar license and active professional status from an independent source.
2. Verify Bituach Leumi appeal, medical committee or appeal committee experience from a direct source.
3. Verify same-day response SLA for urgent appeal-window cases.
4. Verify accepted lead fee, trial terms or subscription path before marking as commercial-ready.
5. Verify billing contact email and manual invoice/payment path.
6. Verify permission to receive no-PII lead previews and the exact terms they accept.
7. Record partnership status, accepted terms, billing contact and payment path in the private CRM.
8. Only after all gates pass, convert the private prospect to a routable lawyer profile with owner release.

## Stop Conditions

1. No independent source verification for license or active status.
2. No direct evidence of Bituach Leumi appeal or medical-committee work.
3. No accepted lead fee, subscription terms or manual invoice/payment path.
4. No billing contact email.
5. No explicit permission to receive no-PII lead previews.
6. No owner-approved controlled lead for the first routing drill.

## Manual No-PII Outreach Skeletons

Use these only after the owner decides to contact a prospect manually. Do not attach client names, phone numbers, documents, chats, medical facts or files.

**Email subject:** בדיקת שיתוף פעולה פרטית - פניות ביטוח לאומי מ-Jus-Tice

**Email/WhatsApp body skeleton:**

שלום, אנחנו בודקים שיתוף פעולה פרטי ומבוקר לפניות בתחום ביטוח לאומי / ועדות רפואיות. בשלב זה לא מועברים פרטי לקוח. נרצה לוודא תחומי טיפול, זמינות, תנאי קבלת פניות, פרטי חיוב ואישור לקבלת תקצירי פנייה ללא פרטים מזהים. אם מתאים, נמשיך רק אחרי אישור תנאים מסודר.

## Owner / Remote Team Run Order

1. Open `wp-admin -> Justice CRM -> Bituach Leumi specialist supply`.
2. Create private prospect records only for the three primary candidates.
3. Fill source URL, focus, evidence summary and `not_verified` status from the CSV.
4. Work the manual checklist until each verification-missing field is empty.
5. If a primary candidate fails, use the next backup candidate.
6. Convert to routable lawyer profile only after owner release and accepted commercial terms.
7. Run the controlled Bituach Leumi lead only after three routable paid specialists and billing evidence paths exist.

## Related Trail

- Parent Linear task: `HAD-76` - Bituach Leumi first billable lead.
- Prior evidence: `HAD-104` / `.project-control/btl-first-paid-lead-readiness-2026-05-26.md`.
- Source pack: `.project-control/btl-specialist-prospect-shortlist-2026-05-26.md`.

## Safety Statement

Do not create public profiles, publish recommendations, route leads, send client PII, contact lawyers automatically, invoice, charge, mark paid or claim first paid-lead revenue from this packet alone.
