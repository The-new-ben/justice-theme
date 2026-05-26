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

## Next build tasks

1. Add a CSV/import upload tool for TalkTo exports with dedupe by normalized phone + source thread + date.
2. Add a re-permission queue with approved Hebrew/English message templates.
3. Add supplier/lawyer bidding so anonymized lead previews can be priced before PII is released.
4. Add audit export for consent evidence and handoff billing proof.
5. Connect official WhatsApp Business/TalkTo webhooks only after the provider route and permission text are approved.
