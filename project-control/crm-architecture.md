# CRM Architecture

**Date:** 2026-05-10
**Goal:** Self-operating legal marketplace where leads flow from visitor → matched lawyer → tracked outcome with minimal manual involvement.

---

## 1. Layers

```
┌─────────────────────────────────────────────────┐
│  PUBLIC                                         │
│   ─ Visitor lands on pillar/article/lawyer page │
│   ─ Submits inquiry form                        │
└──────────────┬──────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────┐
│  LEAD INTAKE                                    │
│   ─ jte_handle_lead (lead-submissions.php)      │
│   ─ Sanitize, validate, nonce-check             │
│   ─ Create justice_lead CPT                     │
│   ─ Capture UTM, source URL, device             │
│   ─ Spam filter (NOT YET)                       │
└──────────────┬──────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────┐
│  AI ENRICHMENT (Phase 2)                        │
│   ─ Classify legal_area from message text       │
│   ─ Extract city if mentioned                   │
│   ─ Extract urgency (true urgency vs casual)    │
│   ─ Score lead quality (0–100)                  │
└──────────────┬──────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────┐
│  ROUTING (Phase 2)                              │
│   ─ Match lawyers by area + city                │
│   ─ Filter by lead_routing_enabled,             │
│     plan_type, monthly_lead_limit               │
│   ─ Order by priority_score                     │
│   ─ Assign top 1–3 lawyers                      │
└──────────────┬──────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────┐
│  LAWYER NOTIFY                                  │
│   ─ Email (always)                              │
│   ─ WhatsApp (if number in profile)             │
│   ─ In-app notification (Phase 2 dashboard)     │
│   ─ SMS (Phase 3, paid plans only)              │
└──────────────┬──────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────┐
│  LAWYER ACTION                                  │
│   ─ Accept / Decline (front-end Phase 2)        │
│   ─ Contact visitor                             │
│   ─ Update status                               │
└──────────────┬──────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────┐
│  OUTCOME                                        │
│   ─ Status updated to converted/closed/rejected │
│   ─ Trigger review request (Phase 2)            │
│   ─ Update analytics (leads_accepted)           │
└─────────────────────────────────────────────────┘
```

---

## 2. Data model (already in place)

### `justice_lead` CPT

| Field | Source | Phase |
|---|---|---|
| `visitor_name` | form | now |
| `visitor_phone` | form | now |
| `visitor_email` | form | now |
| `legal_area` | form (or AI in Phase 2) | now |
| `city` | form (or AI in Phase 2) | now |
| `urgency` | form (default `normal`) | now |
| `message` | form | now |
| `source_url` | wp_get_referer | now |
| `source_keyword` | (UTM term) | now |
| `assigned_lawyer_id` | routing | Phase 2 |
| `lead_status` | workflow | now |
| `consent` | form checkbox | now |
| `utm_source`, `utm_campaign`, `utm_medium` | querystring | now |

### `justice_lawyer` CPT — relevant CRM fields

`plan_type`, `subscription_status`, `featured_until`, `priority_score`, `lead_routing_enabled`, `monthly_lead_limit`, `profile_views`, `leads_received`, `leads_accepted`

---

## 3. Status workflow (already implemented in lead admin meta box)

```
new ──> qualified ──> assigned ──> contacted ──> accepted ──> converted
                                              ──> rejected
                                                      ↓
                                                    closed
```

---

## 4. MVP CRM (what works today, what's needed)

### What works today
- ✅ Lead capture from forms
- ✅ Lead stored as `justice_lead` CPT
- ✅ Email to `admin_email`
- ✅ Admin status workflow via meta box
- ✅ Admin column view in WP Admin
- ✅ REST `/content/leads` returns JSON for external CRM sync

### What's missing for MVP

| Item | Priority |
|---|---|
| Anti-spam (honeypot or captcha) | Critical |
| SMTP for reliable email delivery | Critical |
| Lawyer-facing notification (currently only admin gets email) | High |
| Manual assignment UI (admin picks lawyer for lead) | High |
| Webhook/Slack notification on new lead | Medium |
| Lead deduplication (same phone within 24h = ignore) | Medium |

### What's deferred (Phase 2+)

| Item | Phase |
|---|---|
| AI lead classification (area, urgency, quality score) | 2 |
| Auto-routing to top N matched lawyers | 2 |
| Lawyer-facing front-end dashboard | 2 |
| Front-end accept/reject buttons | 2 |
| Review collection after status=converted | 2 |
| Multi-lawyer broadcast (notify N, first to accept wins) | 3 |
| WhatsApp Business API integration | 3 |
| SMS via 019/Twilio | 3 |

---

## 5. Integrations to external services (decisions needed)

| Service | Purpose | Recommendation |
|---|---|---|
| **SMTP** | Reliable email | SendGrid (free tier 100/day) OR AWS SES (cheaper at scale) |
| **WhatsApp** | Lead notifications to lawyers | Wait — WhatsApp Business API requires Meta approval, ~$0.005/msg. Phase 3. |
| **Captcha** | Anti-spam | Cloudflare Turnstile (free, no PII, GDPR-friendly) > Google reCAPTCHA v3 > hCaptcha |
| **Payments** | Lawyer plan upgrades | See `payment-architecture.md` |
| **AI classification** | Lead enrichment | Anthropic Claude API (Sonnet 4.6 for batched cheap classification) — see `seo-aio-geo-strategy.md` |
| **Search Console** | SEO data | Manual GSC connection for now; later, GSC API → admin dashboard |

---

## 6. Privacy / compliance (Israeli Privacy Protection Law)

| Requirement | Status |
|---|---|
| Consent checkbox before submission | ✅ implemented (`lead_consent`) |
| Disclosure of who receives the data | ⚠️ Add to disclaimer text: "פרטיך יועברו לעורך הדין שתופיע על המסך וכן לצוות Jus-Tice" |
| Data minimization (only what we need) | ✅ Form collects only name + phone + (optional email/area/city/message) |
| Right to deletion | ⚠️ MUST build a "remove my data" form linked from `/privacy/` |
| Data retention policy | ⚠️ Decide: leads kept for X months then anonymized? |
| SSL/HTTPS for data transmission | NOT VERIFIED — needs live check |
| Encrypted storage | n/a — WP DB encryption is at MySQL level, hosting decision |
| Audit log | ✅ `jte_log` for admin actions on leads |

---

## 7. Reporting (admin)

Existing REST + admin tools cover:
- `/wp-json/jus-tice-engine/v1/content/leads` → JSON list
- WP Admin → Leads → table with filterable columns
- `/reports/log` → audit trail

Missing:
- Time-to-first-response report
- Conversion funnel report (new → qualified → assigned → ... → converted)
- Per-lawyer performance dashboard
- Source attribution report (which pages drive most leads)

These are Phase 2 (build a small admin dashboard page using `admin-pages.php` stub).

---

## 8. End-state vision (12-month)

A lawyer who signs up:
1. Lands on `/lawyer-registration/`
2. Verifies Bar number (live lookup)
3. Picks plan
4. Pays via integrated checkout
5. Edits profile via front-end editor
6. Sees lead inbox in their dashboard
7. Receives WhatsApp notification on new matched lead
8. Accepts/rejects with one tap
9. Updates lead status as case progresses
10. Gets review requests sent to clients on `converted`
11. Sees analytics: views, leads, conversion rate, ROI

A visitor:
1. Lands on pillar page from organic search
2. Reads guide; sees relevant lawyer cards alongside
3. Clicks lawyer profile
4. Either calls directly OR fills inquiry form
5. Gets confirmation; lawyer contacts them within X hours
6. Completes engagement
7. Receives review request after lawyer marks converted
8. Posts public review (Phase 2)

The CRM, payment, and notification infrastructure described above is what makes that vision operational.
