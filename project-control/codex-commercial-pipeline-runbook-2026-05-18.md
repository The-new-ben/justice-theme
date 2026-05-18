# Codex Runbook — Activate the Commercial Pipeline on jus-tice.co.il

**Audience:** Codex (the AI agent that can perform live browser actions, install plugins, open external accounts) and any human operator who needs to follow along.

**Goal:** Take PR #5 (`claude/review-legal-portal-aRAzz`) from "code merged" to "first paying lawyer successfully subscribed". After this runbook is executed, the owner's manual work per lawyer drops from 9 steps to 1 (review and publish the draft profile).

**Time budget:** ~3 hours of active work spread across 2–5 calendar days while account approvals process.

**Cost summary:** ~$280 USD/year for WooCommerce Subscriptions + Morning subscription (₪49–₪149/month depending on plan) + Meshulam clearing fees (~1.4–2.5% per transaction depending on Meshulam plan).

---

## Section 0 — How to read this doc

Each step is shaped like this:

```
■ STEP N — short title
WHY:    one-sentence reason this step matters
WHERE:  exact URL / wp-admin path
HOW:    click-by-click instructions
EXPECT: what success looks like
COPY:   any value to copy and where to paste it
IF IT FAILS: fallback or escalation
```

Codex should execute steps in order. If a step is blocked (e.g. account approval pending), park it, leave a `STATUS_PENDING_OWNER` note in `project-control/current-status.md`, and continue with whatever IS unblocked.

**Never**:
- Skip an "EXPECT" check. If the expectation is not met, do not proceed.
- Enter real card data in production until Section 9 (the live smoke test). Use sandbox/test mode for everything earlier.
- Publish a lawyer profile to the public site without the owner's explicit approval.
- Hit Meshulam or Morning with automated/headless requests against their human signup forms — use a real browser session.

---

## Section 1 — Decisions already locked in by the owner

These are NOT options. They were decided in `commercial-pipeline-activation-2026-05-18.md` on 2026-05-18.

| Decision | Value |
|---|---|
| Payment gateway | **Meshulam** (via the Morning bundle) |
| Invoicing | **Morning / Green Invoice** with auto-invoice on every transaction |
| Plan prices | Pro ₪349 / Featured ₪749 / Lead Partner ₪1,490 / Full Service ₪2,490 — monthly, including VAT |
| Lead model | Subscription-only — leads are a feature of the tier, not sold per-piece |
| Lead caps | Pro 5/mo · Featured 15/mo · Lead Partner 40/mo · Full Service 80/mo |
| Free tier | Continues to exist — basic profile, no leads |
| Compliance | כללי לשכת עורכי הדין (פרסומת) תשס"א-2001 — every paid placement must be marked "פרופיל ממומן"; never promise outcomes |

---

## Section 2 — Architecture in one diagram

```
LAWYER                       JUS-TICE THEME (this PR)               WOOCOMMERCE STACK            EXTERNAL
------                       -------------------------              ------------------           --------

clicks /lawyer-plans/ ─────► page-lawyer-plans.php
                             ↓
                             justice_theme_plan_checkout_url('pro')
                             ↓
                             not logged in?  ───────────────────────► /lawyer-registration/?plan_interest=pro&pre_checkout=1
                                                                       (FIX 1: gate behind a linked profile)

fills form ────────────────► justice_theme_handle_lawyer_registration()
                             ↓
                             wp_insert_post(justice_lawyer draft)
                             ↓
                             justice_theme_provision_lawyer_user()
                               - wp_insert_user(role=justice_lawyer_member)
                               - update_post_meta(claimed_by_user_id)
                             ↓
                             justice_theme_send_magic_link_email() ─────────────────────────────► email out via wp_mail

clicks magic link ─────────► template_redirect (priority 1)
                             justice_theme_handle_magic_link_request()
                             wp_set_auth_cookie() → /lawyer-dashboard/?welcome=1

clicks "שדרוג מסלול" ──────► /lawyer-plans/ → justice_theme_plan_checkout_url('pro')
                                                                          ↓
                                                                          /checkout/?add-to-cart=<product_id>
                                                                                            ↓
                                                                                            Morning gateway iframe ─► Meshulam clears card

success ──────────────────────────────────────────────────────────► woocommerce_checkout_subscription_created
                                                                       ↓
                             justice_theme_sync_subscription_to_lawyer()
                               - look up profile by claimed_by_user_id
                               - if missing: auto-create (FIX 1 safety-net) → email owner
                               - subscription_status = active
                               - plan_type = pro
                               - first_value_at = now
                               - activation_status = first_value
                               - lead_routing_enabled = 1 (lead_partner / full_service only)

                                                                          Morning auto-issues tax invoice ─────────► email out to lawyer
                                                                          monthly renewal cron ────────────────────► Meshulam re-charges → Morning auto-invoices → bridge re-syncs

OWNER                        wp-admin → Lawyer Onboarding queue
                             reviews license, photo, claims
                             clicks Publish → profile goes live
```

The **only** human decision point on the right side of this diagram is the owner's identity/license review before publishing. Everything else is automatic.

---

## Section 3 — Pre-flight checks (Codex runs these before touching anything live)

```
■ STEP 3.1 — Confirm the branch is mergeable
WHERE:  https://github.com/The-new-ben/justice-theme/pull/5
HOW:    Open PR #5. Look at the "Mergeable" status under the conversation header.
EXPECT: "This branch has no conflicts with the base branch" (green).
        Files changed = 10. Single commit.
IF IT FAILS: report back; do not merge.

■ STEP 3.2 — Confirm the live site is healthy
WHERE:  https://jus-tice.co.il/
HOW:    curl -sI https://jus-tice.co.il/ | head
EXPECT: HTTP/2 200, X-Robots-Tag absent on homepage
HOW:    curl -sI https://jus-tice.co.il/lawyer-plans/
EXPECT: HTTP/2 200
HOW:    curl -sI https://jus-tice.co.il/lawyer-registration/
EXPECT: HTTP/2 200
HOW:    curl -sI https://jus-tice.co.il/lawyer-dashboard/
EXPECT: HTTP/2 200

■ STEP 3.3 — Confirm wp-admin access
WHERE:  https://jus-tice.co.il/wp-admin/
HOW:    Log in with the owner's admin credentials. Codex must have these
        stored as a secret in its environment — do NOT log credentials
        anywhere in this runbook or in any commit.
EXPECT: WordPress dashboard loads. Top-right shows the admin user.
        Check "WordPress version" in the bottom-right footer is 6.7+.

■ STEP 3.4 — Confirm uPress Git Manager access
WHERE:  uPress control panel → File Manager → Git management
        (path: wp-content/themes/justice-theme)
EXPECT: Git status shows "clean working tree" / "לא זוהו שינויים"
        Current branch: main

■ STEP 3.5 — Owner approval gate
ACTION: Before any merge/install/account-opening, post a comment on PR #5
        asking the owner to confirm:
          "OK to merge PR #5 and start the Section 4–10 setup?"
        Wait for explicit "yes".
```

---

## Section 4 — Merge PR #5 and pull to live

```
■ STEP 4.1 — Merge PR #5
WHERE:  https://github.com/The-new-ben/justice-theme/pull/5
HOW:    Click "Squash and merge" (preferred — keeps main history clean)
        or "Rebase and merge" if the owner prefers a linear history.
        Commit message: keep the existing PR title.
        DO NOT delete the branch yet — keep it until Section 10 verifies live.
EXPECT: Main now contains commit titled "Commercial pipeline activation + Codex P0/P1 fixes".
        PR #5 status flips to "Merged".

■ STEP 4.2 — Pull to live via uPress
WHERE:  uPress control panel → File Manager → wp-content/themes/justice-theme → Git management
HOW:    Click "Pull Git" (משוך גיט).
        Wait for the success toast: "המשיכה הסתיימה בהצלחה" / "Pull completed".
EXPECT: Latest commit hash on the server matches GitHub main HEAD.
        Git status shows clean.
IF IT FAILS: check that no untracked files exist on the server
        (the previous emergency-recovery.php cleanup may matter here);
        if conflicts appear, fetch the conflict description and report
        back — do not force the pull.

■ STEP 4.3 — Verify the deployment marker
WHERE:  curl -s https://jus-tice.co.il/ | grep -i 'JUSTICE_DEPLOY_MARKER\|deploy-marker'
EXPECT: HTML contains 'justice-dashboard-first-value-v1' marker
        (from the page-lawyer-dashboard.php first-value panel that we
        rebased onto).
        If we bump JUSTICE_DEPLOY_MARKER in functions.php in the future,
        check that the new marker appears.

■ STEP 4.4 — Verify the new admin page exists
WHERE:  https://jus-tice.co.il/wp-admin/options-general.php?page=justice-lawyer-plans
EXPECT: Page renders. Shows a table with each paid plan and a number input
        for product ID. Top row says "WooCommerce active: NO" (still correct
        at this point, before we install WC). No PHP errors in the page source.

■ STEP 4.5 — Verify the new menu role exists
WHERE:  https://jus-tice.co.il/wp-admin/users.php → "Roles" dropdown / filter
EXPECT: "Jus-Tice Lawyer" appears as a selectable role.
```

---

## Section 5 — Open the Morning (Green Invoice) account

Morning is a single vendor that bundles **Meshulam credit card clearing + automated tax invoice issuance + WooCommerce plugin**. This is simpler than wiring Meshulam and the invoicing as two separate vendors.

```
■ STEP 5.1 — Sign up for Morning
WHERE:  https://www.greeninvoice.co.il/
HOW:    Click "התחל חינם" or "התנסות חינם" (free trial).
        Required info:
          - business name (שם העסק)
          - business owner full name
          - business ID number (ע.מ. / ח.פ. / ת.ז.)
          - business address
          - email
          - phone
          - business type: "אתר אינטרנט / מערכת ניהול לקוחות"
          - target market: Israel
        Use the owner's real business details — there is no sandbox-only
        signup for Morning, but the FREE TRIAL MONTH is unrestricted.
EXPECT: Email confirmation arrives. Account is created with status
        "תקופת ניסיון" (trial period).
        Login URL: https://app.greeninvoice.co.il/

■ STEP 5.2 — Choose the Morning plan
WHERE:  https://app.greeninvoice.co.il/billing
PLAN:   "Basic" (פופולרי) or "Extra" — Codex should pick "Popular" first.
        Cost: ~₪49–₪149/month depending on volume. Reference:
        https://www.greeninvoice.co.il/pricing
        Confirm with owner via AskUserQuestion before purchase. Do not
        purchase silently.
EXPECT: Plan shows "Active". Trial converts to paid after the trial month.

■ STEP 5.3 — Enable the Digital Payments add-on
WHERE:  https://app.greeninvoice.co.il/market
HOW:    Find "תשלומים דיגיטליים" (Digital Payments). Click "הוספה".
        This add-on is 0 NIS monthly fixed cost — you only pay clearing
        fees per transaction.
EXPECT: The add-on shows status "פעיל" (active).
        A new "תשלומים" / "Payments" section appears in the Morning
        sidebar.

■ STEP 5.4 — Connect Meshulam clearing inside Morning
WHERE:  https://app.greeninvoice.co.il/market → search "Meshulam" /
        "משולם"
HOW:    Click "הוספה" on the Meshulam add-on. Follow the prompts to
        either:
          (a) authorize Morning to open a new Meshulam merchant for the
              business (Morning brokers this — preferred path), OR
          (b) connect an existing Meshulam merchant if the owner already
              has one.
        Required from the business:
          - business ID
          - bank account for payouts (account number + branch + bank)
          - copy of business owner's ID
          - photo of a voided check or screenshot from the bank
        Meshulam underwriting: typically 1–3 business days.
EXPECT: Meshulam status flips to "ממתין לאישור" → then "פעיל".
        While pending: park this step. Continue Section 6 in parallel.

■ STEP 5.5 — Get the Morning WooCommerce add-on key
WHERE:  https://app.greeninvoice.co.il/market/plugin/woocommerce
HOW:    Click "הפעלה" / "Activate" on the WooCommerce add-on.
        Under "הגדרות התוסף" you will see:
          - "מפתח התוסף" (Plugin key) — a long alphanumeric string
          - Toggles for which payment methods to expose at checkout:
            כרטיס אשראי / PayPal / bit / Apple Pay / Google Pay
        Enable: כרטיס אשראי + bit + Apple Pay + Google Pay.
        Do NOT enable PayPal unless the owner explicitly asks — PayPal
        does not support WC Subscriptions recurring billing well in
        Israel.
COPY:   The plugin key. Save it in the password manager as
        "Morning WC plugin key".
EXPECT: Key is 32+ characters, alphanumeric.
```

---

## Section 6 — Install the WordPress plugins

This section can run in parallel with Section 5.4–5.5 while Meshulam underwriting is pending.

```
■ STEP 6.1 — Install WooCommerce
WHERE:  https://jus-tice.co.il/wp-admin/plugin-install.php
HOW:    Search "WooCommerce". The result by "Automattic" is the right one.
        Click "Install Now" → "Activate".
EXPECT: WooCommerce setup wizard launches. CLOSE THE WIZARD — we will
        configure manually to keep store settings clean.
        Confirm: WooCommerce → Settings → General loads.

■ STEP 6.2 — Configure WooCommerce general settings
WHERE:  https://jus-tice.co.il/wp-admin/admin.php?page=wc-settings
SET:    Store address: owner's business address (Hebrew is fine)
        Currency: ILS — Israeli new shekel (₪)
        Currency position: Right with space (e.g. "349 ₪") — OR left, owner's choice
        Thousand separator: ,
        Decimal separator: .
        Number of decimals: 0  ← important for ILS, we sell whole shekels
SET:    Tax → Enable taxes: NO. We sell INCLUDING VAT — Morning issues
        the tax invoice with the correct VAT breakdown.
SET:    Shipping → Disable all shipping (this is a digital service).
EXPECT: Settings save. No errors in the top notice area.

■ STEP 6.3 — Disable WooCommerce front-end shop pages we don't need
WHERE:  WooCommerce → Settings → Advanced → Page setup
SET:    Shop page: leave default
        Cart page: leave default (WC requires it)
        Checkout page: leave default
        My account page: change to redirect to /lawyer-dashboard/
          OR leave default for now — we'll route lawyers there from
          the dashboard CTA.
        Terms and conditions: link to the legal page once it exists.

■ STEP 6.4 — Install WooCommerce Subscriptions
WHERE:  https://woocommerce.com/products/woocommerce-subscriptions/
COST:   $280 USD / year. The owner must purchase from this page using
        the business credit card. Codex should ASK the owner first.
HOW:    After purchase, in the WooCommerce.com account dashboard:
          Downloads → WooCommerce Subscriptions → download zip.
        wp-admin → Plugins → Add new → Upload plugin → choose zip → Install → Activate.
        Then connect the wp-admin to the WooCommerce.com account
        for license validation:
          WooCommerce → Extensions → My subscriptions → Connect store.
EXPECT: A new product type "Simple subscription" appears under
        Products → Add New → Product data dropdown.
        WC menu now shows "WooCommerce → Subscriptions".

■ STEP 6.5 — Install Morning for WooCommerce
WHERE:  https://jus-tice.co.il/wp-admin/plugin-install.php
HOW:    Search "Morning Green Invoice" or use the slug
        "wc-gateway-greeninvoice". The plugin by "Green Invoice" is
        the right one (current version 2.4.0, May 2026).
        Install → Activate.
EXPECT: New menu "Morning" appears under WooCommerce, AND a new entry
        in WooCommerce → Settings → Payments named "כרטיס אשראי
        Morning" / "Morning Credit Card".

■ STEP 6.6 — Connect Morning plugin to the Morning account
WHERE:  https://jus-tice.co.il/wp-admin/admin.php?page=wc-settings&tab=greeninvoice
HOW:    Paste the plugin key from Section 5.5 into the "מפתח התוסף" /
        "Plugin Key" field. Save.
        The plugin will now pull the configured payment methods from
        the Morning account.
EXPECT: A "Status" indicator shows "Connected". The list of payment
        methods at WooCommerce → Settings → Payments updates to show
        Credit Card / bit / Apple Pay / Google Pay — exactly the ones
        enabled in Morning in Section 5.5.

■ STEP 6.7 — Enable the Credit Card method in WooCommerce
WHERE:  https://jus-tice.co.il/wp-admin/admin.php?page=wc-settings&tab=checkout
HOW:    Toggle "Morning - Credit Card" to ON.
        Click "Manage" → set:
          Title shown to user: "כרטיס אשראי"
          Description: "תשלום מאובטח באמצעות Morning. חשבונית מס תישלח אוטומטית."
          Installments: "ללא תשלומים" (no installments) for the monthly
          subscription tier. For LATER one-time products, can enable.
EXPECT: Saving the toggle does not throw an error. The method shows
        "Enabled" with a green dot.

■ STEP 6.8 — Test that the credit-card method appears at checkout
WHERE:  Open an incognito browser. Visit
        https://jus-tice.co.il/?add-to-cart=<ANY_PRODUCT_ID>
        (we don't have products yet — skip this and revisit after 7.1).
```

---

## Section 7 — Create the 4 Subscription products

```
■ STEP 7.1 — Create product: מיני-סייט מקצועי
WHERE:  https://jus-tice.co.il/wp-admin/post-new.php?post_type=product
SET:
  Product name (Hebrew): מיני-סייט מקצועי
  Slug (English):        lawyer-plan-pro
  Description (Hebrew):
    "מיני-סייט מקצועי לעורך דין על פלטפורמת Jus-Tice. כולל עמוד פרופיל
    עשיר, ביוגרפיה, וידאו, שירותים, תהליך עבודה ושאלות נפוצות. חיבור
    למאמרים ותחומי מומחיות. עד 5 לידים תואמים בחודש. דוח חשיפה חודשי.
    החיוב חודשי, ניתן לבטל בכל עת."
  Short description (Hebrew):
    "מסלול חודשי לעורכי דין — ₪349/חודש כולל מע""מ. עד 5 לידים תואמים."
  Product data dropdown: "Simple subscription"
  Subscription price:    349
  Per: 1 / month
  Expire after:          Never expire
  Sign-up fee:           (empty)
  Free trial:            (empty)
  Virtual:               ☑ checked
  Downloadable:          ☐ unchecked
  Tax status:            None (we sell VAT-inclusive)
  Categories:            "Lawyer plans" (create if missing)
  Catalog visibility:    Hidden — we drive traffic from /lawyer-plans/
                         only, not the WC shop
  Featured image:        skip for now
PUBLISH
EXPECT: After save, the URL bar shows ?post=NNNN where NNNN is the
        product ID.
COPY:   The product ID. Note it as "PRO_PRODUCT_ID".

■ STEP 7.2 — Create product: חשיפה מוגברת
Same as 7.1 with these values:
  Product name:  חשיפה מוגברת
  Slug:          lawyer-plan-featured
  Description:   "מסלול חשיפה מוגברת לעורכי דין. כל מה שכלול במסלול
                  מיני-סייט מקצועי + הצגה מועדפת בעמודי תחום ועיר, עם
                  תווית ""פרופיל ממומן"" כנדרש בכללי לשכת עורכי הדין.
                  עד 15 לידים תואמים בחודש. אנליטיקת קליקים ושיחות.
                  ₪749/חודש כולל מע""מ."
  Short description: "₪749/חודש — חשיפה מועדפת + 15 לידים בחודש."
  Subscription price:  749
COPY:  FEATURED_PRODUCT_ID

■ STEP 7.3 — Create product: שותף לידים
Same with:
  Product name:  שותף לידים
  Slug:          lawyer-plan-lead-partner
  Description:   "מסלול מבוסס לידים לעורכי דין. כל מה שכלול בחשיפה
                  מוגברת + עד 40 לידים תואמים בחודש, תעדוף ראשון בניתוב
                  לפי תחום ועיר, התראות WhatsApp/SMS, SLA מענה 60 דקות.
                  ₪1,490/חודש כולל מע""מ."
  Subscription price:  1490
COPY:  LEAD_PARTNER_PRODUCT_ID

■ STEP 7.4 — Create product: שירות מלא
Same with:
  Product name:  שירות מלא
  Slug:          lawyer-plan-full-service
  Description:   "מסלול שירות מלא לעורכי דין. כל מה שכלול בשותף לידים
                  + עד 80 לידים בחודש + 2 מאמרים חתומים בחודש מצוות
                  עריכה + אופטימיזציה שוטפת של מיני-סייט + ניהול Google
                  Reviews + דוח חודשי מקיף. ₪2,490/חודש כולל מע""מ.
                  מנהל הצלחת לקוח אישי."
  Subscription price:  2490
COPY:  FULL_SERVICE_PRODUCT_ID

■ STEP 7.5 — Wire the product IDs into the theme
WHERE:  https://jus-tice.co.il/wp-admin/options-general.php?page=justice-lawyer-plans
HOW:    Paste each product ID next to the matching plan label:
          מיני-סייט מקצועי → PRO_PRODUCT_ID
          חשיפה מוגברת    → FEATURED_PRODUCT_ID
          שותף לידים      → LEAD_PARTNER_PRODUCT_ID
          שירות מלא       → FULL_SERVICE_PRODUCT_ID
        Click "Save plan mapping".
EXPECT: After save, each row shows "✓ Product name" pulled live from
        WooCommerce. If any row shows "Product #NNNN not found", the
        product ID is wrong — fix it before continuing.

■ STEP 7.6 — Confirm the public /lawyer-plans/ CTA now points to checkout
WHERE:  Open an incognito browser → https://jus-tice.co.il/lawyer-plans/
        Hover over the "הצטרפות והפעלת המסלול" button on the Pro card.
EXPECT: For an unauthenticated visitor, the link should be
        /lawyer-registration/?plan_interest=pro&pre_checkout=1
        (NOT /checkout/?add-to-cart=...) — this is the registration-first
        gate from FIX 1. Confirmed correct.

        For an authenticated lawyer with a linked profile, the link
        becomes /checkout/?add-to-cart=<PRO_PRODUCT_ID> — we will verify
        this in Section 9 with the smoke test.
```

---

## Section 8 — Pre-flight test in Morning's sandbox mode

Before charging a real card, verify the whole pipeline works with Meshulam's test card numbers.

```
■ STEP 8.1 — Switch Morning plugin to sandbox / test mode
WHERE:  wp-admin → WooCommerce → Settings → Payments → Morning Credit
        Card → Manage.
HOW:    Find the "Test mode" / "מצב בדיקה" toggle. Turn it ON.
        Save.
EXPECT: Toggle remains on after refresh.

■ STEP 8.2 — Create a throwaway test lawyer registration
WHERE:  Open an incognito browser.
HOW:    Visit https://jus-tice.co.il/lawyer-registration/?plan_interest=pro
        Fill the form:
          Full name:      Test Lawyer Sandbox
          Firm:           Sandbox LLC
          Bar number:     TEST-001
          Practice area:  family-law
          Phone:          052-0000000
          Email:          USE A REAL INBOX CODEX CAN READ (e.g. a
                          mailcatcher or a +sandbox@ Gmail address)
          WhatsApp:       052-0000000
          Cities served:  Tel Aviv
          Languages:      Hebrew, English
          Plan interest:  Pro
          Bio:            "Sandbox test profile — DO NOT PUBLISH."
          Consent:        ☑
        Submit.
EXPECT: Redirect to /lawyer-registration/?registration=sent.
        Success notice appears.

■ STEP 8.3 — Verify the WP user + draft profile + magic-link
WHERE:  wp-admin → Users → search for the test email.
EXPECT: User exists. Role = "Jus-Tice Lawyer". Email matches.
WHERE:  wp-admin → All Lawyers (justice_lawyer CPT) → search "Sandbox".
EXPECT: Draft profile exists. Meta fields:
          claimed_by_user_id = the new user's ID
          source_type = registration
          plan_type = pro
          subscription_status = pending
          activation_status = registered
WHERE:  The test inbox.
EXPECT: Email subject contains "ברוכים הבאים". Body contains a URL of
        the form https://jus-tice.co.il/lawyer-dashboard/?justice_magic=1&u=NNN&t=<hex>

■ STEP 8.4 — Test the magic-link login
HOW:    Click the magic-link from the email.
EXPECT: Browser lands on /lawyer-dashboard/?welcome=1, already logged
        in as the test lawyer. The welcome banner ("ברוכים הבאים!")
        appears. The first-value panel shows the test profile linked,
        completeness < 70% (because profile fields are minimal),
        no leads, no views, no content requests, payment status =
        "תשלום וסליקה עדיין לא פעילים".

■ STEP 8.5 — Test the upgrade path
HOW:    From the dashboard, click "מסלולים ושדרוג" or visit
        /lawyer-plans/.
        Click "הצטרפות והפעלת המסלול" on the Pro card.
EXPECT: Browser now redirects to /checkout/?add-to-cart=<PRO_PRODUCT_ID>
        — not back to registration. This proves FIX 1 works for a
        logged-in lawyer with a linked profile.
        The cart shows: "מיני-סייט מקצועי × 1 — ₪349 (חוזר חודשי)".

■ STEP 8.6 — Test card pay through Meshulam sandbox
HOW:    Fill the checkout form. Use Meshulam's test card:
          Card number:  4580 0000 0000 0000
          Expiry:       12/29
          CVV:          123
          Cardholder:   Test Lawyer
        (If this number is rejected, ask Morning support for the
        current sandbox card via the in-app chat — it changes
        occasionally.)
        Submit.
EXPECT: WC redirects to /checkout/order-received/. Order status is
        "Processing" or "On hold" (Morning sandbox sometimes lands
        on hold until manually approved). The subscription record
        in wp-admin → WooCommerce → Subscriptions shows the new
        sub with status "Active" or "Pending".

■ STEP 8.7 — Verify the bridge synced the profile
WHERE:  wp-admin → All Lawyers → "Sandbox" → edit.
EXPECT: Meta fields now show:
          subscription_status = active (or pending, depending on
                                gateway state)
          plan_type = pro
          first_value_at = current timestamp
          activation_status = first_value
          subscription_id = the new subscription's ID
        The "Internal notes" section should contain an entry like:
          "Subscription #NNN state synced: wc_status=active,
           plan_key=pro, normalized=active."

■ STEP 8.8 — Verify Morning issued the invoice
WHERE:  https://app.greeninvoice.co.il/documents
EXPECT: A new "חשבונית מס/קבלה" (Tax invoice/receipt) appears for the
        test lawyer's email, amount ₪349, with the business's VAT
        ID and the buyer's details. The Morning plugin's order view
        in WooCommerce also links to the invoice PDF.

■ STEP 8.9 — Test the safety-net path (paid first, no profile)
This is the FIX 1 safety-net. Codex should test it explicitly.
HOW:
  1. wp-admin → Users → Add new
       Username: orphan-test
       Email:    orphan-test@<the test inbox>
       Role:     Customer  (NOT Jus-Tice Lawyer)
       Password: <generate>
  2. Log out and log back in as orphan-test.
  3. Visit /lawyer-plans/ → click Pro CTA.
     Because the user is logged in but has no justice_lawyer profile,
     the CTA should send them to /lawyer-registration/?...&pre_checkout=1.
     ★ TO ACTUALLY EXERCISE THE SAFETY-NET, BYPASS THE GATE:
     visit /checkout/?add-to-cart=<PRO_PRODUCT_ID> directly while
     logged in as orphan-test.
  4. Pay with the sandbox card.
EXPECT:
  - A NEW draft justice_lawyer profile is created from the WC customer
    data. Title = "orphan-test" or the user's display name.
  - Profile meta: source_type = woocommerce_checkout
  - Profile meta: internal_notes contains "auto-created by
    WooCommerce checkout safety-net"
  - Owner email arrives: subject "[Jus-Tice] Paying lawyer needs
    profile review".
  - wp-admin → Lawyer Onboarding queue shows this new orphan-recovered
    profile.
IF IT FAILS: roll back the test by deleting the orphan-test user, the
        auto-created profile, the WC subscription, and the WC order.
        Report which step failed.

■ STEP 8.10 — Test magic-link resend throttling
HOW:    Log out. Visit /lawyer-dashboard/ (the logged-out gate page).
        Submit the resend form with the test lawyer's email. Wait for
        the success message. Submit it again immediately.
        Submit it 6 times in a row.
EXPECT: Every submission shows the same success message ("נשלח אליכם
        קישור כניסה...") — no enumeration leak.
        Email inbox receives EXACTLY ONE new email, not six.
        After 60 seconds, a new submission produces a new email.
        After 5 submissions from the same IP within an hour, no further
        emails are sent regardless of email value.

■ STEP 8.11 — Clean up the sandbox data
HOW:    wp-admin → Users → delete the test lawyer user + orphan-test user.
        wp-admin → All Lawyers → delete the sandbox draft profiles.
        wp-admin → WooCommerce → Orders → delete the sandbox orders.
        wp-admin → WooCommerce → Subscriptions → cancel + delete the
        sandbox subscriptions.
        Morning dashboard → cancel the sandbox invoices.
EXPECT: Only the real owner admin user, no test profiles, no test
        subscriptions remain.
```

---

## Section 9 — Go-live smoke test with real money

Codex should NOT do this step autonomously. The owner runs it personally with their own real credit card, ₪1 micro-amount.

```
■ STEP 9.1 — Switch Morning plugin OFF sandbox
WHERE:  wp-admin → WooCommerce → Settings → Payments → Morning →
        Manage → Test mode = OFF. Save.

■ STEP 9.2 — Owner-led real-money test
HOW:    The OWNER (not Codex) does this:
          1. Incognito browser.
          2. Register a real test profile under a clean email
             (e.g., owner+livetest@<their domain>).
          3. Click the magic link from real email.
          4. Click Pro plan upgrade.
          5. Pay with their real card. ₪349 actually charges.
          6. Verify the bridge flipped activation_status=first_value.
          7. Verify Morning issued a real tax invoice (it WILL be a real
             invoice — preserve the document number for accounting).
          8. Refund the order via WC → Orders → Refund full amount.
             Meshulam refund will appear within 3–5 business days.
          9. Mark the subscription "cancelled" via WC →
             Subscriptions → Actions.
         10. Verify the bridge flipped subscription_status=cancelled
             and lead_routing_enabled=0.

EXPECT: Every step succeeds. If any step fails, STOP and report to
        Codex with the exact failure point.

■ STEP 9.3 — Open the gate publicly
After Step 9.2 passes:
HOW:    Already done — the prices are public. No further action.
        Optional: announce on Maya's profile / LinkedIn / a "we're
        open for self-serve" post.

■ STEP 9.4 — Set up renewal monitoring
WHERE:  wp-admin → WooCommerce → Subscriptions → Reports.
        Add to Codex's recurring task list: weekly status check —
        any "On hold" or "Failed" renewals get owner notification.
```

---

## Section 10 — Post-launch verification

```
■ STEP 10.1 — Confirm PR #5 branch can be deleted
WHERE:  https://github.com/The-new-ben/justice-theme
HOW:    After Section 9 passes, delete the merged branch
        claude/review-legal-portal-aRAzz.

■ STEP 10.2 — Update project-control/current-status.md
ADD:    A new status block dated when Section 9.2 succeeded, listing:
          - the live test order number
          - the Meshulam transaction ID
          - the Morning invoice number
          - confirmation that activation_status flipped
          - confirmation that lead_routing_enabled toggled correctly
          - cost-to-go-live actually paid (WC Subs license, Morning
            plan, Meshulam underwriting fee if any)

■ STEP 10.3 — Update task-board.csv
MARK done: "Activate commercial pipeline (Meshulam + Morning + WC
            Subscriptions)".

■ STEP 10.4 — Open the next priority task on the board
ADD:    one of these three, per owner's choice in
        commercial-pipeline-activation-2026-05-18.md "Next safe commit":
          A. Money-query SEO rescue batch 001
          B. Lead Router v2
          C. AI lead classifier (Claude Haiku)
```

---

## Section 11 — Common failure modes and how to recover

### "Lawyer paid but no profile exists"
- This is the case PR #5 FIX 1 specifically guards against.
- If somehow it still happens: open wp-admin → Lawyer Onboarding queue.
  The safety-net should have created a draft. If it didn't:
  - Run via WP-CLI: `wp eval "justice_theme_sync_subscription_to_lawyer( wcs_get_subscription( <SUB_ID> ) );"`
  - This re-runs the bridge for that subscription and forces the safety-net path.

### "Magic-link email never arrives"
- Test wp_mail: wp-admin → Tools → Site Health → check for "Could not send email" warnings.
- The owner should configure an SMTP plugin (recommended: WP Mail SMTP or FluentSMTP) and route through a real provider (SendGrid / Brevo / Mailgun). Without SMTP, transactional emails from a shared host frequently hit spam.

### "Morning plugin shows Disconnected"
- Re-paste the plugin key from Section 5.5.
- Check the time on the server (`date` over SSH). Morning's signature validation rejects requests if the server clock skews more than 5 minutes.

### "WooCommerce Subscriptions can't process renewal"
- Almost always Meshulam token expiration. Morning v2.3.6 added "support for replacing a token for existing subscriptions" — the lawyer gets an email to re-enter the card; the existing sub stays alive.

### "First lawyer subscribes and lead routing doesn't activate"
- Bridge auto-enables `lead_routing_enabled` for `lead_partner` and `full_service` only. Pro and Featured plans do NOT auto-enable routing — that is intentional (those plans don't include routed leads).
- If owner wants the lawyer to also receive routed leads on a lower plan, manually set `lead_routing_enabled=1` on the profile via wp-admin.

### "Branch has conflicts again"
- Don't force-merge. Run `git rebase main` on the branch, resolve, push --force-with-lease, ask for a fresh review.

---

## Section 12 — Lawyer value at launch vs roadmap (so Codex understands the bigger picture)

What a lawyer gets the moment they subscribe under this PR:
1. A WordPress mini-site at `/lawyer/<slug>/` with photo, bio, services, FAQs, video.
2. Auto-listed in `/lawyers/`, in city pages, in practice-area pages.
3. Listed in their practice area's pillar article (when content packets are wired).
4. Dashboard with profile-completeness gauge, profile-view counter, leads inbox.
5. (Lead Partner / Full Service) Auto-routed leads by area + city + urgency.
6. Monthly value report (email + dashboard).
7. Auto-issued tax invoices every month from Morning.
8. Cancel anytime from the dashboard.

What the owner explicitly wants added LATER (do NOT promise these on the plans page yet — they are roadmap, not current):
- **Cross-media advertising:** Google Ads, Facebook, Israeli news-site media buying — the Din.co.il-style amplification layer. Requires owner to fund an ad budget + Codex to manage campaigns. Document in `project-control/cross-media-advertising-roadmap.md` once the commercial spine is proven live.
- **Reputation/reviews module:** Phase 1 Google reviews link + Phase 2 first-party reviews, per `reputation-product-roadmap.md`.
- **AI Console:** AI-assisted profile writing, FAQ drafting, article briefs.
- **Q&A forum:** SEO moat play, Phase 2.
- **Video introductions managed by Jus-Tice:** in the Full Service tier later.

Codex: do not surface these as "coming soon" in any public copy until the owner approves. Saying "coming soon" creates expectations that can damage trust if delivery slips.

---

## Section 13 — Things this runbook explicitly tells Codex NOT to do

1. **Do not** enable any payment gateway other than Morning. Tranzila, CardCom, PelePay, etc. are out of scope.
2. **Do not** create lawyer profiles with fake "verified" / "מומלץ" / "מוביל" / "top lawyer" claims. Israeli Bar advertising rules forbid this.
3. **Do not** publish auto-generated articles attributed to a lawyer without that lawyer's written approval, even if the dashboard says they "requested" the topic — Section 11 of `self-serve-lawyer-platform-plan.md` is non-negotiable.
4. **Do not** import scraped Google reviews into the site. Use the Google review link CTA only, until the Places API integration is approved (Phase 3 of `reputation-product-roadmap.md`).
5. **Do not** push to `main` directly. Every change goes through a PR branch.
6. **Do not** delete the `project-control/` directory or any file in it without owner approval — it is the project's institutional memory.
7. **Do not** disable WP_DEBUG_LOG or hide PHP notices. We want to see them while the commercial flow is stabilising.
8. **Do not** treat Codex's success criteria as "the test passed once". Real success is "Meshulam renews the second month and Morning auto-issues the renewal invoice with no human intervention". Verify that on day 30.

---

## Section 14 — Sources Codex should consult when in doubt

- WooCommerce Subscriptions docs: <https://woocommerce.com/document/subscriptions/>
- Creating subscription products: <https://woocommerce.com/document/subscriptions/creating-subscription-products/>
- Subscriptions payment gateways: <https://woocommerce.com/document/subscriptions/payment-gateways/>
- Morning (Green Invoice) WC plugin page: <https://wordpress.org/plugins/wc-gateway-greeninvoice/>
- Morning add-on market: <https://app.greeninvoice.co.il/market>
- Morning pricing: <https://www.greeninvoice.co.il/pricing/>
- Meshulam (Grow) sandbox host: `sandbox.meshulam.co.il`
- Meshulam production host: `api.meshulam.co.il`
- Israeli Bar advertising rules: <https://www.nevo.co.il/law_html/law00/4427.htm>
- Internal architecture doc: `project-control/commercial-pipeline-activation-2026-05-18.md`
- Internal Codex review of PR #5: `project-control/commercial-pipeline-branch-review-2026-05-18.md`
- Internal lawyer time-to-first-value spec: `project-control/lawyer-time-to-first-value-plan-2026-05-18.md`

---

## Section 15 — What "done" looks like

The owner can say "this is done" when ALL of these are true:

- [ ] PR #5 merged to `main` and pulled to live via uPress.
- [ ] Morning account active, paid plan, Digital Payments + Meshulam add-ons active.
- [ ] WooCommerce + WC Subscriptions + Morning plugin installed and connected on jus-tice.co.il.
- [ ] All 4 subscription products created at the published prices.
- [ ] Settings → Lawyer Plans shows all 4 products mapped with no "not found" rows.
- [ ] Section 8 sandbox test passed all 11 sub-steps.
- [ ] Section 9 owner-led real-money test passed, ₪1 refunded successfully.
- [ ] First real paying lawyer subscribed AND renewed at month 2.
- [ ] No PHP errors in `wp-content/debug.log` from any of the new modules over a 7-day window.
- [ ] Owner confirms they did not have to manually create a WP user, link a profile, send credentials, or issue an invoice for that first paying lawyer.

When all boxes are checked, the commercial spine is **load-bearing**. Then we move on to the cross-media advertising layer (Section 12 roadmap), which is the next big value-add the owner asked for.

---

## Appendix A — Cost summary

| Line item | One-time | Recurring | Notes |
|---|---|---|---|
| WooCommerce Subscriptions license | $280 USD | $280 USD/year | <https://woocommerce.com/products/woocommerce-subscriptions/> |
| Morning Popular plan | – | ~₪49–₪149/mo | Owner picks tier in 5.2 |
| Morning Digital Payments add-on | – | ₪0/mo + clearing % | Clearing fees passed through |
| Meshulam clearing | – | ~1.4–2.5%/transaction | Underwriting fee may apply at signup |
| SMTP service (recommended) | – | $0–$15/mo | Brevo free tier handles 300/day |
| **Total run-rate to start** | **~₪1,150 ($280 + first Morning month)** | **~₪150/mo + ~2% of revenue** | |

Break-even: one Pro subscriber covers Morning + SMTP. Three Pro subscribers cover the WC Subs license amortized monthly. Anything above three lawyers is contribution margin.

---

## Appendix B — Codex check-in template

After completing each Section, Codex should append a comment to PR #5 in this format:

```
✅ Section <N> — <title> — completed at <ISO timestamp>
- Step 1 outcome: <verified>
- Step 2 outcome: <verified>
- ...
- Notes / anomalies: <free text>
- Next section: <N+1>
- Owner action required before <N+1>: <yes/no, what>
```

This gives the owner a real-time audit trail without having to ask "what did you do today?".
