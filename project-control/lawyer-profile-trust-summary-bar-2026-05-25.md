# Lawyer Profile Trust Summary Bar - 2026-05-25

## Why This Was Needed

The trust gate column/filter made unsafe lawyer profiles visible, but the owner still needed a quick operating view: how many profiles are safe, how many are on hold, and what kind of cleanup blocks promotion.

## What Changed

- Added a `Jus-Tice profile trust queue` summary bar above the wp-admin `justice_lawyer` table.
- The bar counts and links directly to:
  - `Hold before promotion`
  - `Needs review`
  - `Missing source`
  - `Blocked media`
  - `Maya review`
  - `Trust ready`
- Reused the same trust-gate logic as the list filter, so the count and the filtered table match the same source of truth.

## Operator Use

Before investor demo, homepage promotion, sponsored placement, or lawyer outreach:

1. Open wp-admin -> Lawyers.
2. Read the `Jus-Tice profile trust queue` bar.
3. Click red/yellow counters first.
4. Do not present a profile as premium until it is `Trust ready` or manually verified by the owner.

## Honest Limits

- This is an admin operating dashboard only.
- It does not verify the facts itself.
- It does not add or change lawyer records.
- It does not create revenue, invoices, refunds, payments, or outreach.

## Verification

- Pending live verification after commit, push, and uPress Pull Git.

