# Commercial Pipeline Activation — 2026-05-18

Status: CODE IMPLEMENTED ON BRANCH `claude/review-legal-portal-aRAzz` / OWNER ACTION REQUIRED TO GO LIVE

## Decisions locked in this cycle

- **Payment provider:** Meshulam-Grow (ILS, recurring) + Morning (Green Invoice) for automated tax invoices.
- **Pricing (published on `/lawyer-plans/`):**
  - פרופיל בסיסי — חינם, ללא ניתוב לידים
  - מיני-סייט מקצועי — ₪349 לחודש, עד 5 לידים
  - חשיפה מוגברת — ₪749 לחודש, עד 15 לידים
  - שותף לידים — ₪1,490 לחודש, עד 40 לידים
  - שירות מלא — ₪2,490 לחודש, עד 80 לידים
- **Lead-share model:** subscription-only, leads delivered as a feature of the tier (not sold per piece). Israeli Bar (כללי לשכת עורכי הדין (פרסומת) תשס"א-2001) compliant disclosure required on every paid placement.
- **Sequencing:** commercial build + SEO money-query rescue run in parallel; SEO rescue ships as a separate batch.

## What changed in code

| File | Purpose |
|---|---|
| `inc/lawyer-plans.php` | Real ILS prices, lead caps per tier, helpers `justice_theme_plan_leads_per_month()` and `justice_theme_plan_price_monthly_ils()`. |
| `page-lawyer-plans.php` | Renders the lead cap on each card, Meshulam + Morning disclosure, Israeli Bar compliance note. |
| `inc/lawyer-plans-admin.php` *(new)* | Settings → "Lawyer Plans" admin page. Maps plan_key → WooCommerce product ID without touching wp_options manually. Shows whether WC and WCS are active. |
| `inc/woocommerce-subscription-bridge.php` *(new)* | Listens to `woocommerce_subscription_status_updated` + `woocommerce_checkout_subscription_created`. Mirrors WC subscription state onto `justice_lawyer.subscription_status` and `plan_type`, auto-flips `activation_status=first_value` on first active, auto-enables `lead_routing_enabled` for `lead_partner` / `full_service`. |
| `inc/lawyer-account-provisioning.php` *(new)* | Registers a minimal `justice_lawyer_member` WP role. Provisions a WP user on registration (idempotent), links `claimed_by_user_id` on the draft profile, and emails a **one-shot magic-login URL** valid for 7 days. Includes `?justice_magic=1&u=&t=` template_redirect handler and a "resend magic link" form. |
| `inc/lawyer-onboarding.php` | Calls `justice_theme_provision_lawyer_user()` + `justice_theme_send_magic_link_email()` after creating the draft profile. |
| `page-lawyer-dashboard.php` | Logged-out: shows magic-link resend form, surfaces `?magic=sent|expired|invalid` states. Logged-in: welcome banner on `?welcome=1`, hero CTA now points to `/lawyer-plans/` for in-product upgrade. |
| `functions.php` | Includes the three new modules. |

## Owner action items (do these in this order)

1. **Pull `claude/review-legal-portal-aRAzz` to live via uPress Git Manager.**
2. **Install plugins (one-time):**
   - WooCommerce
   - WooCommerce Subscriptions
   - Meshulam-Grow gateway (search "Grow Payments" or "Meshulam" on WordPress.org plugin directory)
   - Morning / Green Invoice for WooCommerce (`wc-gateway-greeninvoice` slug)
3. **Configure Meshulam:** supplier ID, API key, enable recurring billing. Run a sandbox/₪1 test.
4. **Configure Morning:** API token, enable auto-invoice on `order_completed` and on `subscription_renewal_payment_complete`.
5. **Create 4 Subscription products** (Products → Add new → Product type: *Simple subscription*):

   | Name | Price | Billing | Signup fee | Trial |
   |---|---|---|---|---|
   | מיני-סייט מקצועי | ₪349 | every 1 month | 0 | none |
   | חשיפה מוגברת | ₪749 | every 1 month | 0 | none |
   | שותף לידים | ₪1,490 | every 1 month | 0 | none |
   | שירות מלא | ₪2,490 | every 1 month | 0 | none |

6. **Map product IDs:** Settings → Lawyer Plans → paste the four product IDs → Save.
7. **Test one full signup end-to-end** in incognito, with a real card on a temporary ₪1 product. Confirm:
   - Magic-link email arrives
   - Clicking the link lands the lawyer authenticated on `/lawyer-dashboard/?welcome=1`
   - After paying, the linked `justice_lawyer` profile shows `subscription_status=active`, `plan_type` set, `first_value_at` stamped, `activation_status=first_value`
   - Morning auto-issues a tax invoice email

## How a lawyer signup now flows (end-to-end, post-patch)

```
HAPPY PATH (registration-first):
1. Lawyer lands on /lawyer-plans/.
2. Clicks "הצטרפות והפעלת המסלול" on (e.g.) Pro card.
   → justice_theme_plan_checkout_url('pro'):
       - logged out → returns /lawyer-registration/?plan_interest=pro&pre_checkout=1
       - logged in, no profile → same registration URL
       - logged in WITH a linked justice_lawyer profile → returns
         /checkout/?add-to-cart=<wc_product_id>
3. Lawyer fills /lawyer-registration/, submits.
   → justice_theme_handle_lawyer_registration():
       - wp_insert_post() draft justice_lawyer
       - justice_theme_provision_lawyer_user(): WP user + role
       - magic-link emailed (7-day, one-shot, hashed token)
4. Lawyer clicks magic-link → /lawyer-dashboard/?welcome=1 (already logged in).
5. From the dashboard "מסלולים ושדרוג" CTA → back to /lawyer-plans/ →
   now the checkout URL resolves to the real WooCommerce checkout because
   the linked profile exists.
6. WooCommerce checkout + Meshulam authorize. WC Subscriptions creates the
   sub record. woocommerce_checkout_subscription_created fires →
   justice_theme_sync_subscription_to_lawyer():
     - find profile by claimed_by_user_id
     - subscription_status = active / on_hold / pending
     - plan_type = mapped key
     - stamps first_value_at on first active
     - flips activation_status to 'first_value'
     - enables lead_routing_enabled on lead_partner / full_service tiers
7. Morning fires its invoice hook → tax invoice mailed automatically.

SAFETY-NET PATH (paid first, no profile yet — e.g. owner manually added a
WooCommerce user and they checked out before registering):
- justice_theme_sync_subscription_to_lawyer() detects no profile
- calls justice_theme_create_lawyer_profile_from_wc_customer():
    - builds title/email/phone from the WC customer + billing fields
    - wp_insert_post() draft justice_lawyer with source_type=woocommerce_checkout
    - sets internal_notes flagging this needs identity/license review
    - emails the owner with a Review link
- continues the normal sync flow on that newly-created profile
- the new draft appears in the Lawyer Onboarding admin queue
No payment can orphan; every paying user ends up with a reviewable profile.
```

## How the magic-link flow works (with example)

**Example: Adv. Cohen registers via /lawyer-registration/.**

```
POST /wp-admin/admin-post.php
  action=justice_lawyer_registration
  lawyer_full_name=ישראל כהן
  email=cohen@example.co.il
  phone=050-1234567
  practice_area=family-law
  plan_interest=pro
  consent=1
  ...

→ wp_insert_post() creates justice_lawyer draft #4521
→ justice_theme_provision_lawyer_user('cohen@example.co.il', 'ישראל כהן', 4521):
    - get_user_by('email', ...) returns null
    - generates username 'cohen' (or 'cohen-1' if taken)
    - wp_insert_user(..., role='justice_lawyer_member') → user #88
    - update_post_meta(4521, 'claimed_by_user_id', 88)
→ justice_theme_send_magic_link_email(88, 'ישראל כהן', 'pro'):
    - token = bin2hex(random_bytes(32)) → 64 hex chars
    - hash  = wp_hash_password(token)
    - user_meta '_justice_magic_link_hash' = hash
    - user_meta '_justice_magic_link_expires' = now + 7d
    - URL = https://jus-tice.co.il/lawyer-dashboard/?justice_magic=1&u=88&t=<token>
    - wp_mail to cohen@example.co.il with the welcome body
→ redirect to /lawyer-registration/?registration=sent

Adv. Cohen clicks the email link 3 minutes later:
→ template_redirect priority 1: justice_theme_handle_magic_link_request()
    - validates u=88, t=<token>
    - wp_check_password(token, stored_hash, 88) → true
    - delete the meta (one-shot consumed)
    - wp_set_auth_cookie(88, remember=true)
    - redirect to /lawyer-dashboard/?welcome=1
→ Dashboard renders with the welcome banner, profile completeness card,
   "שדרוג מסלול" CTA pointing at /lawyer-plans/
```

If the link expires or is reused, the dashboard renders the magic-link resend form. If the email isn't a registered lawyer member, the resend handler returns the same "we sent it if it exists" response — no enumeration leak.

## Safety / compliance notes

- Magic-link token is **stored hashed**, never in plain text. One-shot. 7-day TTL.
- The `justice_lawyer_member` role has only `read` capability — no posting, no editing other lawyers' profiles, no admin access.
- WooCommerce sub bridge **never auto-publishes** the lawyer profile. Verification + publish remains an owner decision in wp-admin. The bridge only flips routing and activation state.
- Lead routing is only auto-enabled for `lead_partner` and `full_service` tiers and only after `activation_status=first_value` — i.e. payment confirmed.
- Pricing page now has the required Bar Association compliance disclosures (פרסום ממומן labeling, no outcome guarantees, cancel-anytime).

## What is intentionally NOT in this commit

- **Lead Router v2** (capacity-aware, plan-tier-priority, SLA timer, WhatsApp notification) — needs its own focused commit; the existing `inc/lead-routing.php` keeps working unchanged.
- **AI lead classifier (Claude Haiku)** — depends on owner choosing whether to set `ANTHROPIC_API_KEY` and approving cost (~₪0.01/lead).
- **Money-query SEO rescue batch 001** — separate commit per the parallel-sequencing decision. The existing `gsc-money-query-opportunity-map-2026-05-18.md` is the source list.
- **Auto-create a draft profile when a paying customer reaches checkout without going through registration** — edge case, backlog. For now the owner journey is registration → checkout.
- **Automated cancellation/dunning email templates** — WC Subscriptions sends its defaults; custom Hebrew copy is a polish step.

## Next safe commit on this branch

Pick one of:

1. **Money-query rescue batch 001** — rewrite title/H1/intro for `/real-estate-attorney/`, the criminal indictment cancellation article, `/sex-crime-lawyer/`, `/prenup-attorney/`, `/traffic-lawyer/`. Source: `gsc-money-query-opportunity-map-2026-05-18.md`. Zero payment-dependency.
2. **Lead Router v2** — extend `inc/lead-routing.php` with capacity + plan-tier priority + SLA reassignment.
3. **AI lead classifier integration** — wire `inc/lead-classifier.php` to Claude Haiku 4.5 with structured output.

Owner: pick the next one in conversation.
