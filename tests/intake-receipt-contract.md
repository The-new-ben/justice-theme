# HAD-552: stored-enquiry measurement

## Business contract

`lead_form_submit` remains an attempt. `generate_lead` with
`measurement_version: 2` means a short-lived, server-verified receipt for a
published, stored, non-test `justice_lead` was claimed once. It does **not** mean
an email arrived, a lawyer accepted the enquiry, the person is unique, or the
enquiry was qualified. The private lead store remains the outcome source of truth.

The existing return URL and routing/mail/consent behavior stay unchanged. A
receipt failure must not fail a successfully stored enquiry. The receipt only
works on the same public return path. Public success text is confirmed through
the same endpoint, rather than trusting the URL parameter alone.

## Boundaries

- Token: 32 random bytes; ten-minute lifetime; HttpOnly, Secure, SameSite=Strict,
  host-only cookie limited to the AJAX endpoint. No token in URL, JavaScript or GA.
- Server mapping: token hash -> record ID, public path, expiry. No contact/case text.
- Confirmation: same-origin POST plus non-simple header, valid token, matching
  public path, current stored/non-test/published record. No privacy settings changed.
- Response: only `stored`, `fresh`, `version`. Analytics copies none of the response's
  extra fields and posts no contact fields or URL query/fragment.
- One constant-valued, non-autoloaded `add_option` claim handles duplicate consumers;
  delayed WP-Cron removes only expired claims. Cache eviction fails closed.
- A new accepted form request clears a previous receipt before validation/storage.
- Explicit test visits do not request receipts; the server independently rejects
  test records even if the client test flag is absent.

WordPress API source reviewed: https://developer.wordpress.org/reference/functions/add_option/
and https://developer.wordpress.org/reference/functions/set_transient/ .

## Known limits and rollout

At-most-once **emission eligibility**, not exactly-once GA ingestion. Blocked cookies,
JavaScript, consent, network interruption, delayed analytics or simultaneous valid
submissions in one browser can undercount. A retry after a claim does not create
another event; the customer can still see confirmed storage within the lifetime.
Do not use this event as a billing trigger. It does not retroactively repair old data.

Deploy theme 1.1.6 and Ops 2.37.49 together. If the new theme reaches the old plugin
first, unverified successes are not counted; the old backend cannot confirm them.
Do not configure a new GA key event until the deployment's endpoint, asset and
settings have been independently verified. Do not activate permanent traffic filters
as part of this release.

## Evidence and acceptance

- JS fixture covers 59 boundary assertions, including same-origin endpoint,
  fresh/refresh, malformed proof, HTTP/network failure, test exclusion and no PII.
- PHP receipt fixture covers token/record/path/origin/expiry and single-claim behavior.
  It models the WordPress API, not a native database concurrency stress test.
- Real handler lifecycle fixtures verify storage/routing and non-fatal receipt failure.
- Release must prove the exact live asset/version and invalid/no-cookie endpoint rejection.
  Offline positive fixtures are not represented as a live real-customer conversion.
- No extra real enquiry is submitted merely to make a dashboard show a conversion.

## Readiness ledger

| Requirement | Value | Evidence | Status / next action |
|---|---|---|---|
| Server-confirmed receipt, no refresh double count | Trustworthy stored-enquiry signal | PHP/JS tests | Local until deployment verification |
| Preserve storage, recipient and routing | Do not lose genuine enquiries | Handler lifecycle suite | Recheck in release guard |
| No personal/case data in new measurement | Minimise disclosure | Strict request/response assertions | Verify public asset |
| Recipient receipt and qualification | Measure actual lead value | Not established by this code | Reconcile private outcomes, separate work |
| Tool improvement and organic acquisition | More useful visits and leads | Hotjar/GSC findings | Broad goal remains active |

Owner: HAD-552. No paid service or new account. No new redirects or slug changes.
