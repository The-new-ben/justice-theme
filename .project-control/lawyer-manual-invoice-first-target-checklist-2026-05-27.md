# Lawyer manual invoice first-target checklist - 2026-05-27

Status: LAWYER_MANUAL_INVOICE_FIRST_TARGET_CHECKLIST_READY_OWNER_TARGET_REQUIRED

## Project Manager Check

Active goal: convert the recommended first-revenue lane into a one-target checklist that the owner can approve without triggering live action.
Readiness to profit: 88% checklist readiness, 0% live revenue impact.
Honesty: This packet prepares a one-target approval checklist and draft only. It does not contact anyone, create CRM records, invoice, request payment, mark paid, publish or deploy.

## Recommendation

Start with `pro` at 349 ILS per month including VAT.

Why: it is the lowest-friction paid plan, uses the existing manual invoice registration path and avoids lead-volume promises.

## Plan Options

| Plan | Monthly ILS incl. VAT | Recommendation | Reason | Source |
| --- | --- | --- | --- | --- |
| pro | 349 | RECOMMENDED_FIRST_CLOSE | Lowest paid friction and does not require lead-volume promises or client PII routing. | inc/lawyer-plans.php public override and WooCommerce setup notes list Pro at 349 ILS per month including VAT. |
| featured | 749 | SECOND_OPTION | Higher value, but includes exposure positioning and needs clearer sponsored-profile wording. | inc/lawyer-plans.php public override and WooCommerce setup notes list Featured at 749 ILS per month including VAT. |
| lead_partner | 1490 | NOT_FIRST_WITHOUT_OWNER_APPROVAL | Bigger revenue but closer to lead allocation and ethical/volume expectations; not the first close unless owner explicitly wants it. | inc/lawyer-plans.php public override and WooCommerce setup notes list Lead Partner at 1490 ILS per month including VAT. |
| full_service | 2490 | LATER | High value but needs broader service delivery capacity and onboarding proof. | inc/lawyer-plans.php public override and WooCommerce setup notes list Full Service at 2490 ILS per month including VAT. |

## Checklist

| Step | Phase | Action | Required input | Pass condition | Blocked if | Live action allowed |
| --- | --- | --- | --- | --- | --- | --- |
| LMI-01 | owner_choice | Owner confirms the selected lane is lawyer subscription by manual invoice. | yes/no lane approval | Owner approves lawyer_subscription_manual_invoice as the next live-approved lane. | Owner says no or chooses wait. | NO |
| LMI-02 | target | Owner names one lawyer/prospect, or approves a generic one-target draft only. | target name/contact or generic draft permission | Exactly one target path is selected. | No target and no generic draft approval. | NO |
| LMI-03 | offer | Use Pro plan as the first paid offer unless owner overrides. | plan=pro or owner override | Plan and monthly price are recorded: recommended Pro at 349 ILS per month including VAT. | No price or plan is selected. | NO |
| LMI-04 | fit | Check license, practice fit, public claims and no-guarantee language before any public profile activation. | license/profile fit review | Owner/admin confirms fit review can proceed for the selected target. | Unverified identity, license or claims. | NO |
| LMI-05 | billing | Collect or confirm billing legal name and invoice email. | billing legal name, billing invoice email | Billing contact exists before invoice_requested/invoice_sent. | Missing billing contact. | NO |
| LMI-06 | message | Owner approves the outreach/message text before any send. | approved message or requested edits | Owner approves or edits the Hebrew draft. | No wording approval. | NO |
| LMI-07 | registration_path | Use the existing manual registration path for Pro plan if owner approves live action. | /lawyer-registration/?plan_interest=pro&payment_path=manual_invoice | The target can be sent to the manual invoice registration path or admin-created only after approval. | No owner approval to contact or create admin entry. | NO |
| LMI-08 | invoice_reference | After accepted terms, save manual invoice/payment reference. | manual_invoice_reference or manual payment link reference | Reference exists before invoice_sent. | No invoice/payment reference. | NO |
| LMI-09 | payment_proof | Mark payment confirmed only after private payment evidence. | payment evidence, owner note | Payment proof exists and no dispute/refund/complaint is open. | Promise to pay, invoice only, or missing proof. | NO |
| LMI-10 | activation | Activate or publish profile only after payment proof and content/license review. | payment proof plus content/license review | Payment confirmed and profile content approved. | Unpaid, disputed, or unreviewed profile. | NO |

## Hebrew Draft Messages

| ID | Use when | Subject | Body | Status |
| --- | --- | --- | --- | --- |
| LMI-MSG-01 | Owner wants a generic draft before selecting the exact target. | בדיקת הצטרפות למסלול Pro ב-Jus-Tice | שלום, אנחנו בודקים הצטרפות של עורך דין אחד למסלול Pro ב-Jus-Tice במסלול חשבונית ידנית. המסלול מיועד לפרופיל מקצועי מורחב, בדיקת התאמה, אפשרות לדוח חשיפה ותהליך הפעלה מסודר. בשלב זה אין חיוב אוטומטי, אין הבטחת כמות פניות, אין התחייבות לתוצאה משפטית ואין בלעדיות. המחיר המוצע למסלול הראשון הוא 349 ש״ח לחודש כולל מע״מ, בכפוף לאישור התאמה, פרטי חשבונית ואישור תשלום. אם זה רלוונטי, נשלח קישור הרשמה קצר ונמשיך רק אחרי אישור תנאים. | DRAFT_ONLY_NOT_SENT |
| LMI-MSG-02 | After a target asks how payment works. | איך עובד התשלום הידני | ההרשמה יוצרת בקשת בדיקת התאמה. לאחר אישור התאמה נשלח חשבונית או קישור תשלום ידני. הפרופיל יופעל רק לאחר אישור תשלום ובדיקת תוכן ורישיון. חשבונית או קישור תשלום אינם נחשבים תשלום עד שיש אסמכתא. | DRAFT_ONLY_NOT_SENT |

## Owner Decision Rows

| ID | Decision needed | Recommended | Allowed answers | Owner answer | Note |
| --- | --- | --- | --- | --- | --- |
| OWNER-LMI-01 | Approve lawyer subscription manual invoice as the next lane. | yes | yes \| no \| wait |  |  |
| OWNER-LMI-02 | Choose target mode. | generic_draft_only_until_target_named | target_named \| generic_draft_only \| wait |  |  |
| OWNER-LMI-03 | Approve first-offer plan and price. | pro_349_ils_month_vat_included | pro_349 \| featured_749 \| lead_partner_1490 \| other \| wait |  |  |
| OWNER-LMI-04 | Approve or edit Hebrew message draft. | edit_or_approve_before_any_send | approve \| edit_first \| no \| wait |  |  |

## What This Does Not Do

- Does not name or contact a lawyer.
- Does not create or edit a CRM/admin record.
- Does not send an email, WhatsApp or invoice.
- Does not create a payment request.
- Does not mark invoice_sent or paid.
- Does not publish a profile or deploy anything.