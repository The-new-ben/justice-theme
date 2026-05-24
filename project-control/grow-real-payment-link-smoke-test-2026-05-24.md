# Real Grow Payment Link Smoke Test - 2026-05-24

## Status

Created a real one-time Grow Payment Link inside the `Jus-Tice Israel` Grow account for the investor demo payment smoke test.

This is not a mock link and not a hard-coded repo value. It was created in the live Grow dashboard under `Payment Links`.

## Payment Link Details

| Field | Value |
|---|---|
| Provider | Grow |
| Account | `Jus-Tice Israel` / `10182706` |
| Type | One-time Payment Link |
| Amount | `₪1` |
| Customer label | `Jus-Tice Investor Demo Payment Test` |
| Phone used | `052-5101555` |
| Description | `Jus-Tice investor demo real payment smoke test` |
| Grow status at creation | Active |
| Full link | Sent by email; intentionally not stored in repo |
| Redacted link marker | `https://pay.grow.link/MTAwODI3~...-MzQ1MTgzNw` |

## Verification Completed

| Check | Result |
|---|---|
| Grow account login | PASS |
| Payment Link created in Grow dashboard | PASS |
| Link copied from Grow | PASS |
| Link sent to owner by Gmail | PASS |
| Provider payment page opens | PASS |
| Branded payment page shows `Jus-Tice Israel` | PASS |
| Page shows `₪1` total | PASS |
| Page shows secure payment button | PASS |
| Real payment completed | NOT YET |
| Receipt/invoice visible after payment | NOT YET |

## Owner Email

Full payment URL was sent to:

- `info@jus-tice.co.il`
- `benbetesh@gmail.com`

Subject:

`REAL Grow payment link ready: Jus-Tice investor demo 1 NIS smoke test`

## Next Actions

1. Open the email above.
2. Pay the `₪1` link once with a real card.
3. Open `Grow > Transactions` and confirm the transaction appears.
4. Open `Grow > Payment Links` and confirm the link status/payment date changed.
5. Check whether Grow/Morning generated a receipt/invoice automatically.
6. If WordPress handoff proof is needed, paste the link into the demo lawyer record, tick `Send this payment link by email now`, and save.

## Honest Completion Assessment

- Real provider payment-link creation: 100%.
- Openable branded payment page: 100%.
- Real money collection proof: about 75%, because the link exists and opens but has not been paid yet.
- Investor-ready payment proof after paying the link and seeing the transaction/receipt: about 82%-85%.
- Fully automatic subscription lifecycle: still about 45%, because recurring billing, upgrades, downgrades, cancellation and refunds still need product/gateway lifecycle mapping.

## Safety

This cycle changed the live Grow provider account by creating one real `₪1` payment link under the owner's emergency approval and sent the link by email. No public WordPress CMS/database content, redirects, canonicals/noindex, sitemaps, taxonomies, WooCommerce products, gateway settings, charge, invoice execution, refund execution, lawyer record, lead, CRM record, GSC or GA4 setting was changed.
