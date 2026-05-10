# Payment Architecture

**Date:** 2026-05-10
**Status:** PLANNING — no payments live yet.

---

## 1. Plan structure (already encoded in `plan_type` meta)

| Slug | Hebrew | Position | Notes |
|---|---|---|---|
| `free` | חינם | Default | Profile shown but at bottom; no inquiry form (`lead_routing_enabled=0`) |
| `pro` | פרו | Mid | Profile shown with photo + bio; inquiry form enabled; up to N leads/month |
| `featured` | מוצג | High | Same as Pro + appears in `featured-lawyers` carousel + on practice-area pages |
| `lead_partner` | שותף לידים | Pay-per-lead | Pays per accepted lead; routing enabled |
| `full_service` | שירות מלא | Premium | Featured + lead routing + content authoring + dedicated support |

---

## 2. Pricing strategy (DRAFT — not committed)

| Plan | Monthly | Annual | Lead allowance |
|---|---|---|---|
| Free | ₪0 | ₪0 | 0 (display only) |
| Pro | ₪299 | ₪2,990 (~16% off) | 5 |
| Featured | ₪699 | ₪6,990 (~17% off) | 15 |
| Lead Partner | ₪0 base + ₪80–250/lead | tier-based | unlimited (capped per area) |
| Full Service | ₪1,499 | ₪14,990 | 30 + content + concierge |

These numbers are DRAFT — owner decision required. Benchmark data: din.co.il monthly listing fees historically range ₪300–₪1,500; PsakDin offers free + paid promotion; Justia premium is paid.

---

## 3. Technical options for payment

### Option A: WooCommerce Subscriptions (RECOMMENDED for MVP)
**Pros:**
- Mature, supported
- Recurring billing built-in
- Israeli payment gateways supported (Tranzila, Cardcom, Pelecard, PayPlus)
- Familiar admin UX
- Coupons/discounts/upgrades native
- Subscription pause/resume

**Cons:**
- Heavy plugin (~5MB)
- Requires WooCommerce + WC Subscriptions ($199/yr) + Israeli gateway add-on

### Option B: Custom checkout + Stripe (NOT RECOMMENDED for Israeli market)
- Stripe Israel exists but limited; many users prefer Israeli gateways
- Custom code = ongoing maintenance
- Recurring billing requires custom implementation

### Option C: Israeli gateway direct (Tranzila/Cardcom/PayPlus)
- Pros: Israeli UX, accepted bit/Apple Pay/Israeli cards
- Cons: Custom integration per gateway, limited to one gateway

### Option D: Defer payment — manual onboarding for first 50 lawyers
- Pros: Lowest tech cost, learn pricing in market
- Cons: Doesn't scale; no self-serve

**MVP recommendation:** Option D for first 30–50 lawyers, then Option A.

---

## 4. Plan switching logic

When `plan_type` changes:
- Update `subscription_status` to `active`/`expired`/`cancelled`
- Set `featured_until` based on plan + billing period
- Adjust `lead_routing_enabled` based on plan
- Adjust `monthly_lead_limit` based on plan
- Update `priority_score`:
  - free: 10
  - pro: 50
  - featured: 80
  - lead_partner: 70 (variable, paid per lead)
  - full_service: 100

This logic should live in a single function (`jte_apply_plan_settings($lawyer_id, $plan)`) — NOT YET BUILT.

---

## 5. Israeli compliance

| Item | Notes |
|---|---|
| חשבונית מס (VAT invoice) required | Lawyer is a business; must receive a VAT invoice. WooCommerce Israeli gateway add-ons handle this. |
| מס הכנסה (income tax) reporting | Owner accountant handles |
| כפתור "ביטול עסקה" (cancel transaction button) | Israeli law requires easy cancellation. WooSubs supports. |
| "צרכן עסקי" disclosure | Lawyer is a business customer, not a consumer; some consumer protection rules don't apply but cancellation rules do |
| חוק הגנת הפרטיות (Privacy law) | Already covered via consent + privacy policy |

---

## 6. Lawyer billing dashboard (Phase 2)

After login:
- Current plan + status
- Next billing date
- Past invoices (download PDF VAT invoices)
- Update payment method
- Upgrade/downgrade/cancel
- Lead allowance used/remaining (for plans with limits)

---

## 7. Free → paid funnel

```
Lawyer registers (free) → completes profile → sees "0 leads this month"
    ↓
Pop-up after profile completion: "אתם מקבלים 5 לידים בחודש בתוכנית פרו"
    ↓
Pricing page → CTA "Upgrade to Pro"
    ↓
Checkout (WooSubs) → plan_type=pro → priority_score=50 → emails confirmation
    ↓
Profile re-ranks higher; lead form now active
    ↓
After first lead converted: review request sent → social proof
```

---

## 8. NOT in scope for MVP

| Feature | Why deferred |
|---|---|
| Pay-per-lead billing automation | Complex pricing rules; Phase 2 |
| Lawyer-to-lawyer referral marketplace | Complex; later |
| Bidding for leads (auction model) | Avvo-style; ethically debatable in legal market |
| Cryptocurrency payment | Not relevant for Israeli legal market |
| Multi-firm management (one billing entity → multiple lawyers) | Phase 2 |
| Affiliate program (lawyer refers other lawyer) | Compliance concern with Bar |

---

## 9. Decision log

| Decision | Date | Rationale |
|---|---|---|
| Plan slugs (`free|pro|featured|lead_partner|full_service`) | finalized | Already in code; matches typical legal directory tiers |
| Pricing | DRAFT | Owner to confirm market check first |
| Payment platform | DRAFT — likely WooSubs | Best Israeli market fit, mature |
| Manual onboarding for first 30–50 | RECOMMENDED | Lowest risk, fastest learning |

---

## 10. Verification status

| Item | Status |
|---|---|
| Plan structure in code | ✅ exists in `cpt-lawyers.php` |
| `is_paid` check in templates uses correct plans | ✅ verified this session |
| Payment plugin installed | ❌ not installed |
| Pricing committed | ❌ DRAFT only |
| Israeli payment gateway selected | ❌ not selected |
| VAT invoice flow | ❌ not designed |
| Subscription cancellation flow | ❌ not designed |
