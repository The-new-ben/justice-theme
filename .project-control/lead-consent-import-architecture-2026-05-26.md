# Lead Consent Import Architecture - WhatsApp, TalkTo and Legacy Leads

Date: 2026-05-26

## Owner decision

WhatsApp, TalkTo, email, phone and legacy exports are not treated as automatically routable leads. They enter Jus-Tice as private CRM records first. A lawyer, supplier or marketplace partner receives client details only after consent and commercial terms are recorded.

## Consent states

| State | Meaning | Allowed action |
|---|---|---|
| `fresh_inbound_needs_details` | The client contacted Jus-Tice now, but case details or permission to match are not complete. | Store privately, ask for details/permission. Do not route. |
| `explicit_match_consent` | The client clearly agreed to be matched or contacted by a lawyer/supplier. | May route after paid terms and coverage checks. |
| `owner_verified_consent` | The owner reviewed evidence and confirmed permission. | May route after paid terms and coverage checks. |
| `legacy_needs_repermission` | Old WhatsApp/TalkTo/CRM lead without fresh opt-in. | Send only an owner-approved re-permission message. Do not route. |
| `do_not_contact` | Opt-out or sensitive no-contact instruction. | Do not contact or route. Keep only for audit/deduplication unless deletion is requested. |

## System flow

1. Import source arrives from WhatsApp, WhatsApp Business API, TalkTo, email, phone note or CSV.
2. The owner/admin creates a private `justice_lead` through Justice CRM.
3. The lead is saved with `routing_hold=1` first.
4. The source, page URL, thread/import ID, consent status, consent basis and permission next step are stored as metadata.
5. The system may classify legal area and demand, but does not hand the lead to a lawyer while consent is incomplete.
6. Release is allowed only when:
   - consent status is `explicit_match_consent` or `owner_verified_consent`;
   - the permission checkbox is verified by the owner/admin;
   - the handoff path includes the paid lawyer router;
   - there is a routable paid lawyer or approved supplier path.
7. Legacy leads can be reactivated only through an opt-in message, not by direct lawyer introduction.

## Current UK WhatsApp lead treatment

The UK-law WhatsApp lead from the `uk-lawyer` page is not enough for automatic routing. It should be stored as `fresh_inbound_needs_details` or held for owner review until the client gives case details and permission to be matched. It should not be sent to a UK lawyer/supplier or counted as revenue yet.

## Implementation status

- Added consent-status metadata to manual CRM leads.
- Added TalkTo, WhatsApp Business, WhatsApp export and legacy import source channels.
- Added source thread/import ID and source page URL fields.
- Hardened manual router release so external leads cannot route without explicit/verified consent.
- Hardened the router itself so later edits cannot bypass the manual consent gate.
- Added the owner-only WhatsApp/TalkTo import staging panel. Pasted CSV exports can create private `justice_lead` records with routing hold, import batch ID, dedupe fingerprint and re-permission status.
- Added the owner-only Permission / re-permission queue. The queue prepares copyable opt-in messages, records requested/received/do-not-contact actions, and requires an owner evidence checkbox before upgrading a lead to `owner_verified_consent`.
- Tightened CRM contact actions. Held `justice_lead` records no longer expose direct Call/Email contact links in the main CRM table; they expose only permission/opt-in actions until consent is approved. `do_not_contact` records expose no contact action.
- Added the owner-only anonymized partner preview / terms queue. This lets the owner price a lead with a lawyer or supplier using a no-PII packet before any client details are released.
- Preview packets are marked `internal only` unless client permission is explicit/owner-verified. Even when a preview is shareable, PII release still requires partner terms and owner release.
- Added the owner-only no-PII lead audit export. The CSV lets the owner or another agent review consent, routing hold, preview, partner terms and billing proof status without exporting client PII.
- Added the owner-only WhatsApp/TalkTo connector-readiness panel. It documents the future official webhook field map, provider questions and acceptance gates, while keeping the connection explicitly not live.
- Added the owner-only handoff release queue. A lead can be marked ready for manual handoff only after consent is routeable, partner terms are accepted and a minimum paid fee exists. Recording owner release keeps `routing_hold=1` and sends nothing automatically.

## Import staging headers

Supported CSV headers include:

- phone, client_phone, lead_phone, tel, telephone, טלפון, נייד
- name, client_name, lead_name, שם
- email, client_email, lead_email, מייל, אימייל
- message, text, chat, body, lead_message, תוכן, הודעה
- date, created_at, timestamp, time, תאריך
- page_url, source_url, url, landing_page, link
- thread_id, chat_id, conversation_id, source_thread_id, id
- legal_area, area_key, practice_area
- consent_status, permission_status

Each import is limited to 200 pasted rows to keep owner review manageable. Duplicate fingerprints are skipped.

## Next build tasks

1. DONE: verify the re-permission queue in `wp-admin -> Justice CRM` after uPress pull.
2. DONE: verify the anonymized partner preview / terms queue in `wp-admin -> Justice CRM` after uPress pull.
3. DONE: add audit export for consent evidence, preview state, partner terms and handoff billing proof.
4. DONE: verify the no-PII lead audit export panel/link in `wp-admin -> Justice CRM` after uPress pull.
5. DONE: document and verify official WhatsApp Business/TalkTo webhook field map, provider questions and acceptance gates inside Justice CRM.
6. DONE: verify the owner handoff release queue in `wp-admin -> Justice CRM` after uPress pull.
7. LATER: connect official WhatsApp Business/TalkTo webhooks only after the provider route, signature/shared-secret method, pause control and permission text are approved.
