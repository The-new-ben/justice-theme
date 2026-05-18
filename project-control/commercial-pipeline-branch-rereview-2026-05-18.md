# Commercial Pipeline Branch Re-Review - 2026-05-18

Status: RE-REVIEW / ORIGINAL P0-P1 FIXED / DO NOT DEPLOY UNTIL FINAL STATUS-DOC CLEANUP

Reviewed branch: `origin/claude/review-legal-portal-aRAzz`
Reviewed commit: `2ebe724`
Current main during re-review: `aae778b`

## Purpose

Verify the commercial branch after the worker acknowledged Codex's blockers and pushed fixes.

## Verification Summary

Original blocker status:
- P0 paid checkout can bypass lawyer profile creation: FIXED IN CODE.
- P1 magic-link resend lacks throttling: FIXED IN CODE.
- Merge conflict in shared status: STILL PRESENT because `main` moved again with the money-query SEO packet.

## What I Verified

### Paid CTA Is Registration-First

File:
- `inc/lawyer-plans.php`

Verified behavior:
- Free plan always points to `/lawyer-registration/`.
- Paid plan with WooCommerce product mapping points to checkout only when the current user is logged in and already has a linked `justice_lawyer` profile.
- Logged-out users or logged-in users without a linked profile are sent to `/lawyer-registration/?plan_interest={plan}&pre_checkout=1`.

Result:
- The normal path now creates the lawyer profile/user before checkout.

### Checkout Safety Net Exists

File:
- `inc/woocommerce-subscription-bridge.php`

Verified behavior:
- If WooCommerce subscription sync runs for a paying user without a linked lawyer profile, the bridge calls `justice_theme_create_lawyer_profile_from_wc_customer()`.
- That function creates a draft `justice_lawyer` profile, links `claimed_by_user_id`, stores plan/subscription metadata, keeps `lead_routing_enabled=false`, adds an internal review note and emails the owner.
- The subscription sync then continues on the newly-created draft profile.

Result:
- A paying user should no longer become an orphan payment with no reviewable lawyer profile.

### Magic-Link Resend Throttle Exists

File:
- `inc/lawyer-account-provisioning.php`

Verified behavior:
- Per-email cooldown exists: `JUSTICE_MAGIC_RESEND_EMAIL_COOLDOWN`.
- Per-IP window and max attempts exist: `JUSTICE_MAGIC_RESEND_IP_WINDOW`, `JUSTICE_MAGIC_RESEND_IP_MAX`.
- The public response still redirects to `?magic=sent` for throttle/nonexistent cases, preserving non-enumeration.
- A new magic token is issued only after the throttle check passes.

Result:
- The original resend spam/link-invalidation issue is addressed.

### Lint

PHP lint passed in the branch worktree for:
- `functions.php`
- `inc/lawyer-account-provisioning.php`
- `inc/lawyer-plans-admin.php`
- `inc/woocommerce-subscription-bridge.php`
- `inc/lawyer-onboarding.php`
- `inc/lawyer-plans.php`
- `page-lawyer-dashboard.php`
- `page-lawyer-plans.php`

## Remaining Issues Before Merge/Deploy

### P1 - Current Main Moved Again

`main` now includes the money-query SEO rescue packet after the branch was rebased.

Current conflict:
- `project-control/current-status.md`

Required fix:
- Rebase/merge the branch on top of current `main` and preserve both:
  - money-query SEO rescue status;
  - commercial pipeline activation status.

### P2 - Activation Doc Has A Stale "Not In This Commit" Line

File:
- `project-control/commercial-pipeline-activation-2026-05-18.md`

Issue:
- The document correctly describes the safety-net flow earlier, but the "What is intentionally NOT in this commit" section still says auto-creating a draft profile when checkout happens before registration is backlog.

Required fix:
- Remove or rewrite that bullet before merge so the owner runbook does not contradict the code.

## Deployment Recommendation

Code direction is now acceptable for the original blocker set, but do not uPress-pull this branch yet.

Required sequence:
1. Rebase/merge branch onto current `main`.
2. Resolve `project-control/current-status.md`.
3. Fix the stale runbook bullet.
4. Rerun PHP lint.
5. Merge/push.
6. Only then run uPress Pull Git for live deployment.
7. Live activation still requires WooCommerce, WooCommerce Subscriptions, Meshulam-Grow, Morning and product-ID mapping.

## Safety Statement

This re-review is repo-only. No live WordPress content, database row, lawyer profile, user, lead, payment setting, WooCommerce product, GA4/GSC setting, URL, redirect, canonical/noindex rule, sitemap setting or uPress deployment was changed.
