# Scope: Milestone 5 - Lead-Routing Funnel, checkout/webhook API validation and GTM

## Architecture
- `src/app/api/leads/route.js`: Handles lead intake and mapping, SQL sanitization, SMS/Email notifications.
- `src/app/api/checkout/route.js`: Handles Stripe checkout URL generation and validation.
- `src/app/api/webhooks/route.js`: Handles Stripe event webhooks (signature verification and database state update).
- `tests/e2e/tests.js`: E2E test cases validating lead ingestion, checkout validation, and webhook signature verification.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Analysis | Explorer analyzes routes and test suite to design implementation plan | None | DONE |
| 2 | Implementation | Worker implements route changes (mapping, sanitization, validation) | M1 | DONE |
| 3 | Verification & Review | Reviewer verifies correctness and runs E2E tests, Auditor performs forensic integrity checks | M2 | DONE |

## Interface Contracts
### Leads API
- Input: `{ name, email, phone, details }` or `{ clientName, clientEmail, clientPhone, description, title, ... }`
- Output: `{ success: true, leadId, lead, dbSaved, notifications }`
- Error Output: `{ error: String }` (status 400 or 500)

### Checkout API
- Input: `{ amount, lawyerId, creditsToAdd }`
- Output: `{ success: true, url, isMock }`
- Error Output: `{ error: String }` (status 400 or 500)

### Webhooks API
- Input: Stripe event JSON body
- Headers: `stripe-signature` or `x-stripe-signature`
- Output: `{ received: true }` (status 200)
- Error Output: `{ error: String }` (status 400/401)
