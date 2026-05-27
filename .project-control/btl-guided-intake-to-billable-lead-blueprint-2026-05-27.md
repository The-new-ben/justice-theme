# BTL Guided Intake To Billable Lead Blueprint - 2026-05-27

Status: BTL_GUIDED_INTAKE_BLUEPRINT_READY_INTERNAL_ONLY_NO_PUBLIC_CHANGE

Scope: private product/content-to-CRM blueprint. This does not publish the public funnel, edit CMS, create CRM records, route PII, contact lawyers or clients, create invoices/payments, change providers, call APIs, use paid LLMs or deploy uPress.

## Why This Exists

The legaltech review showed that guided interviews are the useful pattern for Jus-Tice now. Not a generic legal AI chat. Not imported third-party code. A narrow structured intake that turns one public legal problem into safe owner-reviewed evidence for a paid lead.

## Current Code Reality

| Existing Piece | File | What It Already Does | Gap |
| --- | --- | --- | --- |
| Public Bituach Leumi funnel | `inc/national-insurance-funnel.php` | Renders a focused appeal page, calculator and lead form for `national-insurance` | Main case detail is still one free-text message |
| Revenue hint | `inc/lead-routing.php` | Sets `lead_revenue_model=qualified_appeal_lead` and default `suggested_lead_price_ils=249` for Bituach Leumi leads | Does not prove consent, supply, billable lawyer or payment |
| Routing safety | `inc/lead-routing.php` | Holds external/manual leads unless consent evidence is explicit or owner-verified | Needs structured consent/source fields to review quickly |
| Managed service gate | `inc/legal-request-fulfillment.php` | Includes `nii_appeal_package` and private fulfillment/payment statuses | Not connected to a guided BTL questionnaire yet |
| Operator command | `.project-control/btl-first-revenue-operator-command-2026-05-27.md` | Defines 6 steps from private supply to payment proof | Still needs owner/admin private evidence |

## Guided Intake Questions

These are the fields that should replace or supplement the single free-text question before any live publication.

| ID | User-Facing Question | Field Type | CRM / Review Mapping | Billable Lead Signal | Safety Rule |
| --- | --- | --- | --- | --- | --- |
| BTL-Q01 | Which Bituach Leumi decision did you receive? | select | `btl_decision_type` | medical_committee / work_injury / disability / mobility / services | Do not promise eligibility |
| BTL-Q02 | When did you receive the decision? | date | `btl_decision_received_date` | deadline can be calculated | If unknown, mark deadline review needed |
| BTL-Q03 | Do you have the committee protocol or full decision letter? | select | `btl_protocol_available` | yes means lawyer can review faster | Do not request upload until privacy policy and storage are ready |
| BTL-Q04 | What did Bituach Leumi decide? | short text | `btl_current_decision_summary` | structured summary for triage | No medical diagnosis advice |
| BTL-Q05 | What result do you believe should have been decided? | short text | `btl_expected_result_summary` | gap between decision and claimed situation | Keep as client claim, not legal conclusion |
| BTL-Q06 | Current monthly amount or percentage | number/text | `btl_current_amount_or_percent` | value gap estimate | Allow unknown |
| BTL-Q07 | Expected monthly amount or percentage | number/text | `btl_expected_amount_or_percent` | value gap estimate | Make estimate optional |
| BTL-Q08 | Are there updated medical documents after the committee? | select | `btl_updated_docs_available` | yes increases review quality | No document upload in first version |
| BTL-Q09 | How urgent is the deadline? | select | `lead_urgency` | urgent if deadline close/unknown | Owner review before handoff |
| BTL-Q10 | Do you approve Jus-Tice to contact you for an initial review? | checkbox | `consent=1` | needed before human follow-up | Does not approve lawyer handoff |
| BTL-Q11 | Do you approve sharing a short no-PII summary with a relevant lawyer only after owner review? | checkbox | `consent_status=owner_review_needed` initially | prepares later match consent | Must remain hold until explicit match consent or owner-verified consent |

## First Version Flow

1. User answers guided questions.
2. The lead is saved as `national-insurance`.
3. System records `lead_revenue_model=qualified_appeal_lead`.
4. System records `suggested_lead_price_ils=249`.
5. System keeps `routing_hold=1` unless explicit match consent, routable supply and owner release all pass.
6. Owner sees a structured summary: decision type, date, deadline risk, document readiness, value gap, consent status.
7. Only after private supply and consent pass, the owner may release one controlled lead for lawyer handoff.
8. Billing remains `not_ready` until routing actually creates a billable lead.
9. Revenue remains 0 until private payment proof exists.

## Owner Review Triage

| Triage Level | Conditions | Owner Action | Revenue State |
| --- | --- | --- | --- |
| Not ready | No decision date, no decision type, no consent | Ask for missing info only | 0% |
| Reviewable | Decision type/date and contact consent exist | Owner/admin reviews case internally | 0% |
| Potentially billable | Reviewable plus protocol/doc readiness plus value/deadline signal | Check 3 routable specialists and consent | 0% until routed and billed |
| Billable lead candidate | Routable specialist, explicit/owner-verified match consent, owner release | One controlled handoff may be prepared | invoice-stage only |
| Paid proof | Billable lead routed, invoice/payment reference and private payment proof exist | Count one paid lead | first revenue proof |

## Suggested Private Owner Screen Fields

| Field | Default | Allowed Values | Purpose |
| --- | --- | --- | --- |
| `btl_intake_readiness` | `needs_owner_review` | `missing_info`, `needs_owner_review`, `potentially_billable`, `park`, `blocked` | Owner triage |
| `btl_deadline_risk` | `unknown` | `urgent`, `soon`, `normal`, `unknown` | Follow-up speed |
| `btl_document_readiness` | `unknown` | `protocol_ready`, `partial_docs`, `no_docs`, `unknown` | Lawyer review feasibility |
| `btl_value_gap_signal` | `unknown` | `high`, `medium`, `low`, `unknown` | Commercial prioritization |
| `btl_match_consent_status` | `owner_review_needed` | `not_requested`, `owner_review_needed`, `explicit_match_consent`, `owner_verified_consent`, `declined` | Handoff safety |
| `btl_owner_release` | `no` | `yes`, `no` | Blocks automatic routing |

## Implementation Path Without Publishing

1. Keep this as an internal blueprint until owner approves a public form change.
2. Add the fields first to private/admin review documentation, not the public CMS.
3. If approved, implement the public form change in `inc/national-insurance-funnel.php`.
4. Verify PHP syntax and lead-submission compatibility.
5. Do not deploy until uPress Pull Git is available and the owner approves the exact public copy.

## Honesty Statement

- This is a real product specification adapted from legaltech guided-interview patterns.
- It does not create a new customer, supplier or paid lead.
- It does not publish a form change.
- It does not prove lawyer supply, client consent, billing or payment.
- It reduces the next build step from vague "AI intake" to a safe Bituach Leumi lead-quality questionnaire.
