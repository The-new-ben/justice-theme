# Bituach Leumi First Paid-Lead Proof Lock - 2026-05-28

Status: LIVE_DEPLOYED_WITH_RUNTIME_REVENUE_BLOCKER

## What Changed

- Added an owner-only `First paid-lead proof lock` panel inside Justice CRM -> Bituach Leumi specialist supply.
- The panel separates specialist supply, billable lead record, private payment evidence and owner reporting claim.
- The copyable checklist blocks Bituach Leumi paid-revenue claims until the CRM has a consented lead, routed/billable lawyer IDs, accepted terms, invoice/payment reference, private payment evidence URL and `qualified_lead_paid_at`.
- Updated the BTL readiness checker and CRM operator-readiness checker so future cycles must verify the payment-proof lock.
- Updated deployment marker/version to `2026-05-28-btl-first-paid-lead-proof-lock-v1` / `1.1.83`.

## Verification

- `php -l inc/lead-crm.php`: pass.
- `node tools/check-btl-first-paid-lead-readiness.mjs --reportDate=2026-05-28 --sourceDate=2026-05-26`: `PASS_WITH_RUNTIME_BLOCKERS`, 9/9 static gates passing, 1 runtime blocker preserved.
- `.project-control/scripts/check-lead-crm-operator-readiness.ps1`: pass, including `btl_payment_proof_lock`.
- `git diff --cached --check`: pass before commit.
- Commit pushed to GitHub branch and main: `933f33a9 Add BTL first paid lead proof lock`.
- uPress Pull Git for `wp-content/themes/justice-theme`: success.
- uPress Git log: `933f33a9` shown as `HEAD -> main`.
- Live deploy check: `liveReady=true`; marker `2026-05-28-btl-first-paid-lead-proof-lock-v1`, version `1.1.83`, mobile menu component and `mobile_menu` WhatsApp surface present; old marker `2026-05-28-lawyer-retention-followup-completion-v1` absent.

## Remaining Runtime Blocker

The repo and live theme now have the control surface, but first Bituach Leumi paid revenue is still not proven. Owner/admin still needs to verify or create three private specialist prospects, activate three routable paid/trialing/active lawyer profiles, run one consented controlled Bituach Leumi lead, save invoice/reference, and save private payment evidence before marking revenue as paid.

## Safety

No public CMS/database content, route, title/H1/meta/body, redirect, canonical/noindex, sitemap, taxonomy, GSC data, lawyer/client/supplier contact, WhatsApp, TalkTo, invoice issuance, payment charge, provider setting or paid LLM API action was performed.
