# Unserved Demand Ledger Implementation Spec - 2026-05-18

Status: BUILD-READY SPEC / NO LIVE CMS CHANGE

## Business Goal

Stop losing money on calls and forms where Jus-Tice has demand but no paying lawyer partner yet.

Example:
- A user calls for a Thailand lawyer.
- Today: owner spends time, maybe tries to help, no revenue, no structured record.
- Target: owner logs the request in under 45 seconds, the system counts it as unserved demand, follows up safely, and turns it into a lawyer recruitment/sales proof point.

## Current Best-Practice Research Applied

Sources checked this cycle:

- Clio client intake tips: `https://www.clio.com/blog/improve-client-intake-law-firm/`
- Clio client intake stages: `https://www.clio.com/blog/client-intake-process-stages/`
- Clio lead management best practices: `https://www.clio.com/blog/lead-management-best-practices-law-firms/`
- Lawmatics practice-area segmentation: `https://help.lawmatics.com/en/articles/10700069-practice-areas`
- Lawmatics intake pipeline: `https://help.lawmatics.com/en/articles/10699827-intake-pipeline/`
- Lawmatics QualifyAI overview: `https://help.lawmatics.com/en/articles/13357833-qualifyai-overview`

Applied conclusions:

- Intake must track lead source, practice area, contact status, follow-up deadline, and conversion status.
- Practice areas should be separate when workflows, reporting, routing, or qualification differ.
- Leads should move through a visible pipeline; not every lead needs every stage, but every lead needs a known stage.
- AI/rules can help classify, but unclear or sensitive matters need human review.
- For Jus-Tice, "unserved" should be a first-class status, not a free-text note.

## Fit With Existing Code

Existing system:

- `functions.php` loads `inc/lead-crm.php`, `inc/lead-classifier.php`, and `inc/lead-routing.php`.
- `justice_lead` already exists as the lead CPT.
- `inc/lead-crm.php` already renders a Justice CRM admin page.
- `inc/lead-routing.php` already records "No lawyers with routing enabled..." when no match exists.
- `inc/lead-classifier.php` already normalizes practice areas and urgency.

Therefore the safest implementation is not a separate product. It should extend the existing Justice CRM and `justice_lead` records.

## Proposed Implementation

### Phase 1 - Admin-only ledger inside Justice CRM

Add a new section to the Justice CRM admin page:

- "Unserved Demand"
- "Quick Log Phone Lead"
- "This Month By Practice/Country"
- "Recruitment Proof"

Do not expose anything publicly in Phase 1.

### Phase 2 - Lead metadata

Register these `justice_lead` meta fields:

- `service_status`: `served`, `unserved`, `waiting_for_partner`, `referred_out`, `not_qualified`, `closed`
- `requested_area_raw`
- `requested_country`
- `requested_city`
- `requested_language`
- `matter_urgency`
- `lead_source_channel`: `phone`, `form`, `whatsapp`, `email`, `organic`, `manual`
- `source_landing_url`
- `consent_to_follow_up`
- `unserved_reason`: `no_partner`, `outside_scope`, `unclear_area`, `no_budget`, `duplicate`, `spam`
- `follow_up_deadline`
- `owner_next_action`
- `recruitment_priority`
- `revenue_status`: `none`, `partner_recruitment_open`, `partner_sold`, `converted_to_partner_lead`

Use normal `justice_lead` posts so the existing classifier, CRM table, and reporting can evolve without data split.

### Phase 3 - Quick-log form

Admin-only fields:

- caller name;
- phone;
- optional email/WhatsApp;
- requested area;
- country/jurisdiction;
- city;
- urgency;
- source/landing page if known;
- one-sentence matter summary;
- consent to follow up;
- owner next action.

On submit:

- create `justice_lead` with `post_status=private`;
- set `lead_status=unserved` if no matching partner exists;
- set `service_status=unserved`;
- set `source_type=owner_phone_log`;
- run classification if possible;
- show next step: "Recruit partner" / "Follow up user" / "Close as not qualified".

### Phase 4 - Routing behavior

When `justice_theme_find_routing_lawyers()` returns empty:

- set `service_status=unserved`;
- set `unserved_reason=no_partner`;
- set `follow_up_deadline` to same day for urgent/high-intent leads;
- surface it on the Unserved Demand panel.

Do not email random lawyers.
Do not route to lawyers without routing enabled.
Do not promise the user that a lawyer will accept the matter.

### Phase 5 - Reporting

Monthly groups:

- requested area;
- country/jurisdiction;
- source landing page;
- source channel;
- urgency;
- count;
- qualified count;
- contacted count;
- converted count;
- unserved count;
- suggested lawyer recruitment pitch.

Example sales line:

> "In the last 30 days Jus-Tice received 7 Thailand-lawyer requests and 1,689 organic impressions on the Thailand-lawyer URL. We currently have no partner in this category. First partner seat is available."

## UX Rules

- Owner must log a phone lead in under 45 seconds.
- Use dropdowns for practice/country/source/status; free text only for summary and notes.
- The first screen should show only fields needed during a live call.
- Details and recruitment notes can come later.
- Every unserved record must have a follow-up deadline or a closed reason.

## Compliance Guardrails

- Do not sell "client paid for a referral" publicly.
- Do not state that Jus-Tice recommends a specific lawyer unless the claim is legally reviewed and objectively supportable.
- Do not make outcome guarantees.
- If a lead is referred out manually, log it as operational help, not as paid referral revenue, unless legal/ethics counsel approves the model.
- Sponsored/paid lawyer placement must remain disclosed where public.

## Metrics

Track weekly:

- unserved requests by area/country;
- response time;
- follow-up completion rate;
- partner gaps with more than 3 requests/month;
- pages that generate unserved demand;
- lawyer recruitment outreach sent;
- partner seats sold from unserved-demand proof.

## First Implementation Files

Recommended code files:

- `inc/unserved-demand.php`
- `functions.php` include entry
- optional future: `assets/css/admin-unserved-demand.css`

Recommended tests/checks:

- PHP lint touched files.
- Admin page renders when `justice_lead` exists.
- Quick-log form rejects missing nonce/capability.
- Manual phone lead creates private `justice_lead`.
- "No matching lawyer" routing path marks `service_status=unserved`.
- No public output changes before owner approval.

## Suggested Next Coding Step

Create `inc/unserved-demand.php` with:

1. meta registration;
2. admin submenu under Justice CRM;
3. admin-post quick-log handler;
4. unserved dashboard query;
5. helper that marks empty-routing leads as unserved;
6. CSV export link for owner review.

Keep this behind admin capability `edit_pages`.

## Honesty Statement

This is a build-ready implementation spec based on current research, local code inspection, and the owner's real phone-call example. I did not create WordPress records, edit live CMS content, change public forms, contact lawyers, charge users, or deploy code to uPress.
