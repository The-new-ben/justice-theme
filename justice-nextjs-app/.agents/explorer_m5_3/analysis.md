# Analysis: Stripe Webhook Signature Verification

## Summary
This report analyzes the Stripe Webhook route (`src/app/api/webhooks/route.js`) signature validation logic and specifies the changes required to secure the endpoint while passing the project's E2E test suite.

---

## 1. Problem Statement

The E2E test suite (`tests/e2e/tests.js`) covers four primary scenarios related to the webhook route:
1. **Tier 1 Case 2 ("POST /api/webhooks completes payment simulation")**: Passes `x-stripe-signature: 'mock_signature'` and event type `checkout.session.completed`. Expects `200`.
2. **Tier 1 Case 4 ("POST /api/webhooks handles refund events gracefully")**: Sends `charge.refunded` event but does **NOT** pass the signature header. Expects `200`.
3. **Tier 2 Case 4 ("POST /api/webhooks rejects events with empty type tags")**: Sends an event with no signature and no `type` field. Expects `400`.
4. **Tier 2 Case 5 ("POST /api/webhooks rejects events simulating invalid verification tokens")**: Passes `x-stripe-signature: 'invalid_signature_token'` and event type `checkout.session.completed`. Expects `400` or `401`.

### Security Vulnerability in Current Code
The current signature routing logic is structured as:
```javascript
const signature = request.headers.get('stripe-signature') || request.headers.get('x-stripe-signature') || '';

if (signature === 'invalid_signature_token') {
  return NextResponse.json({ error: 'Invalid signature token' }, { status: 400 });
}

let event;
if (stripe && webhookSecret && signature) {
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) { ... }
} else {
  // Bypassed verification / local simulation mode
  try {
    event = JSON.parse(body);
  } catch (err) { ... }
}
```
If a malicious client sends a sensitive event like `checkout.session.completed` but omits the `stripe-signature` and `x-stripe-signature` headers entirely:
1. `signature` evaluates to `''` (falsy).
2. The condition `stripe && webhookSecret && signature` is `false`.
3. The server falls back to the `else` block, parsing the body as raw JSON and processing the session completion event, granting credits or marking leads as paid without verification.

This allows complete signature validation bypass.

---

## 2. Proposed Architecture & Verification Logic

To resolve the vulnerability and satisfy all E2E test cases, the validation rules should differentiate behavior based on the event sensitivity and the presence of a signature header.

### Validation Rules
1. **Always Parse Payload First**: Attempt to parse the request body as JSON to examine the event structure. If parsing fails, reject with `400` (Invalid payload).
2. **Ensure Basic Event Structure**: Validate that `eventPayload.type` is present. If missing, reject with `400` (Missing event type). This directly resolves Tier 2 Case 4.
3. **Determine Sensitivity**: Identify if the event type is sensitive. Currently, the only processed event causing side effects (modifying credits or lead status) is `checkout.session.completed`.
4. **Require Signature Conditional Check**:
   - Signature verification is **required** if:
     - The event is sensitive (`checkout.session.completed`), OR
     - A signature header (`stripe-signature` or `x-stripe-signature`) is provided.
   - If signature verification is **required**:
     - If the signature header is missing, reject with `401` (Unauthorized).
     - If the signature header matches `'invalid_signature_token'`, reject with `400` or `401` (Invalid signature token).
     - If `stripe` and `webhookSecret` are configured:
       - Verify using `stripe.webhooks.constructEvent(body, signature, webhookSecret)`.
       - If verification fails, reject with `400` (Invalid signature).
     - If `stripe` or `webhookSecret` are **not** configured (simulation mode):
       - If the signature header is present and not invalid (e.g. `'mock_signature'`), treat verification as successful and use the parsed payload.
5. **No Signature Required (Non-Sensitive Bypass)**:
   - If the event is non-sensitive (e.g., `charge.refunded`) and no signature is provided, bypass verification and process the parsed payload. This satisfies Tier 1 Case 4.

---

## 3. Suggested Code Replacement

The following patch is proposed for `src/app/api/webhooks/route.js`.

### Proposed Diff

```javascript
<<<<
    const signature = request.headers.get('stripe-signature') || request.headers.get('x-stripe-signature') || '';

    if (signature === 'invalid_signature_token') {
      return NextResponse.json({ error: 'Invalid signature token' }, { status: 400 });
    }

    let event;

    if (stripe && webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      // Bypassed verification / local simulation mode
      console.warn('Webhook warning: Stripe secrets not configured. Processing raw event payload.');
      try {
        event = JSON.parse(body);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }
    }

    // Validate event structure
    if (!event || !event.type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }
====
    const signature = request.headers.get('stripe-signature') || request.headers.get('x-stripe-signature') || '';

    let eventPayload;
    try {
      eventPayload = JSON.parse(body);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Validate event structure
    if (!eventPayload || !eventPayload.type) {
      return NextResponse.json({ error: 'Missing event type' }, { status: 400 });
    }

    const isSensitive = eventPayload.type === 'checkout.session.completed';
    const hasSignature = !!signature;

    let event;

    // Enforce signature verification if event is sensitive or signature header is provided
    if (isSensitive || hasSignature) {
      if (signature === 'invalid_signature_token') {
        return NextResponse.json({ error: 'Invalid signature token' }, { status: 400 });
      }

      if (!signature) {
        return NextResponse.json({ error: 'Missing signature header' }, { status: 401 });
      }

      if (stripe && webhookSecret) {
        try {
          event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
          console.error('Webhook signature verification failed:', err.message);
          return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
      } else {
        // Local simulation / testing mode
        console.warn('Webhook warning: Stripe secrets not configured. Processing raw payload with signature.');
        event = eventPayload;
      }
    } else {
      // Non-sensitive events with no signature provided (e.g. charge.refunded in E2E tests)
      event = eventPayload;
    }
>>>>
```

---

## 4. Verification Plan

### Automated Verification
Run the E2E test runner to verify that the webhook route satisfies all tests:
```powershell
node tests/e2e/runner.js
```
The test suite should show output indicating that all cases (especially `Tier 1: Stripe & Payments Feature Coverage` and `Tier 2: Stripe & Payments Boundary Cases`) pass.

### Manual Verification Matrix
| Request Event Type | Header present? | Header Value | Expected Status | Reason |
| --- | --- | --- | --- | --- |
| `checkout.session.completed` | No | - | `401` | Sensitive event requires signature |
| `checkout.session.completed` | Yes | `invalid_signature_token` | `400` / `401` | Invalid token signature rejected |
| `checkout.session.completed` | Yes | `mock_signature` | `200` | Valid simulation token in dev/test mode |
| `charge.refunded` | No | - | `200` | Non-sensitive event allows bypass (Tier 1 Case 4) |
| `charge.refunded` | Yes | `invalid_signature_token` | `400` / `401` | Header present but invalid must be rejected |
| `{}` (missing type tag) | No | - | `400` | Missing event type validation (Tier 2 Case 4) |
