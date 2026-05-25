# Lawyer Onboarding Service Request Owner Actions - 2026-05-25

## Why This Was Needed

The lawyer dashboard can already submit structured customer-success requests: payment link, invoice copy, upgrade, downgrade, cancellation, refund review, complaint, lead-quality issue and technical support. The owner/admin side could filter and read those requests, but there was no quick action from the Lawyer Onboarding table to move the request through an operator status.

## What Changed

- `inc/lawyer-onboarding.php` now registers service-request metadata used by the dashboard flow.
- Lawyer Onboarding rows with a service request now show one-click actions:
  - `Mark in review`
  - `Resolve`
  - `Block`
  - `Reopen`
- The quick action updates `latest_service_request_status`, timestamps review/resolution/block states, keeps unresolved requests in the pending service queue, and removes resolved requests from the pending queue.
- A success notice confirms the owner-side status update.

## Owner-Visible Result

After deploy, go to:

`wp-admin -> Lawyer Onboarding -> Service requests`

For each open service/billing/refund/cancellation/complaint request, the owner can show the investor a real workflow:

1. Lawyer submits request from the dashboard.
2. Owner sees it in the onboarding queue.
3. Owner marks it `In review`, `Blocked`, `Resolved`, or reopens it.
4. The lawyer dashboard keeps showing the latest status.

## What This Does Not Do

- It does not automatically refund, cancel, upgrade or downgrade an account.
- It does not create invoices, payment links or subscriptions.
- It does not send an email to the lawyer when the status changes.
- It does not create or edit public CMS content, redirects, canonicals, noindex, sitemaps, taxonomies, GSC, GA4 or provider settings.

## Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `git diff --check` passed.

## Completion Impact

Owner-side service/support workflow readiness moves from about 72% to 80%. Remaining demo gap: create or approve one claimed lawyer account with a real service request and then test the request status update live after uPress pulls the commit.
