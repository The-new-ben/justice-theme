# Lawyer System Audit

**Date:** 2026-05-10
**Scope:** The lawyer-related code surface — CPT, taxonomies, REST, templates, admin, lead flow.

---

## 1. Architecture summary

```
┌─────────────────────────────────────────────────────────────┐
│  Lawyer system data flow                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Visitor on /lawyers/ ── filters ──> WP_Query ──> cards ──> │
│                                                             │
│  Visitor on /lawyers/{slug}/ ──> single template ──>        │
│       ─ Attorney schema (NEW)                               │
│       ─ Conditional inquiry form (if lead_routing_enabled)  │
│       ─ View counter (skips bots — NEW)                     │
│                                                             │
│  Visitor inquiry POST ──> jte_handle_lead ──>               │
│       ─ justice_lead CPT created                            │
│       ─ Email to admin                                      │
│       ─ Redirect with success/missing param                 │
│                                                             │
│  Admin in WP Admin:                                         │
│       ─ Lawyer list table (custom columns)                  │
│       ─ Lawyer edit screen (3 meta boxes)                   │
│       ─ Lead inbox (status workflow)                        │
│                                                             │
│  Admin via REST:                                            │
│       ─ /content/lawyers — list with priority + edit links  │
│       ─ /content/leads — lead inbox JSON                    │
│       ─ /content/update-meta — whitelisted updates          │
│       ─ /reports/* — inspections                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. CPT: `justice_lawyer`

| Property | Value |
|---|---|
| Slug | `justice_lawyer` |
| Public | yes |
| Archive URL | `/lawyers/` |
| Single URL | `/lawyers/{slug}/` |
| REST exposed | yes |
| Supports | title, editor, thumbnail, excerpt, revisions, custom-fields |
| Taxonomies | practice-areas, city |
| Capability type | post (uses standard editor capabilities) |
| Menu icon | dashicons-businessperson |

### Admin columns
`title | חבילה | עיר | סטטוס | צפיות | לידים | אימות`

### Meta boxes
- "זהות עורך הדין" (identity) — full name, firm, bar number, bio_short, languages, years, courts, license, verification
- "פרטי התקשרות" (contact) — phone, email, whatsapp, website, address
- "מסחרי ומנהלי" (commercial) — plan, subscription, lead routing, profile status, source, internal notes

---

## 3. CPT: `justice_lead`

| Property | Value |
|---|---|
| Slug | `justice_lead` |
| Public | NO (admin-only) |
| Show UI | yes |
| REST exposed | yes (admin only — public=false hides from public REST) |
| Supports | title, custom-fields |

### Admin columns
`title | טלפון | תחום | עיר | סטטוס | תאריך`

### Status workflow
`new → qualified → assigned → contacted → accepted | rejected → converted → closed`

### Meta box
"פרטי הליד" — read-only display of all fields + status selector

---

## 4. Verified working

| Item | Verification |
|---|---|
| Lawyer CPT registered with correct slug | Code review |
| Meta keys consistent between plugin (`cpt-lawyers.php`) and theme (`single-justice_lawyer.php`, `lawyer-card.php`) | Code review |
| `is_paid` plan check matches in plugin admin column + theme templates | Code review |
| Filter URL `/lawyers/?city=X&area=Y` correctly handled by `archive-justice_lawyer.php` | Code review |
| Inquiry form posts to `admin-post.php?action=justice_submit_lead` with nonce | Code review |
| Lead handler creates `justice_lead` CPT with all expected meta | Code review |
| Lead handler emails admin via `wp_mail()` | Code review |
| Admin can update lead status via meta box | Code review |
| Schema.org Attorney emitted on lawyer profile | Code review (added this session) |

---

## 5. Bugs found and fixed (this audit)

| # | Bug | File | Severity |
|---|---|---|---|
| 1 | `taxonomy-city.php` registered against `'lawyer'` not `'justice_lawyer'` | plugin | High |
| 2 | `taxonomy-practice-areas.php` attached to `'post'` not `'justice_lawyer'` | plugin | High |
| 3 | Lawyer admin column emoji ⏳ | plugin (earlier) | Low |
| 4 | Auto-seeder created lawyers as `publish` | plugin (earlier) | Critical |
| 5 | Auto-seeder marked seed profiles `verified` | plugin (earlier) | High |
| 6 | View counter incremented on bots/admins/feeds | theme | Medium |
| 7 | No Attorney schema | theme | High (SEO) |
| 8 | No `LegalService` schema on practice-area pages | theme | Medium (SEO) |

---

## 6. Bugs / gaps NOT fixed

| Gap | Severity | Why not fixed |
|---|---|---|
| Inquiry form has no anti-spam (no honeypot, no captcha, no rate-limit) | High | Needs design decision (reCAPTCHA vs hCaptcha vs simple honeypot) |
| Lead emails go via `wp_mail()` only — no SMTP config | High | Needs SMTP plugin install + credentials (e.g., SendGrid, AWS SES) |
| No webhook/Slack notification on new lead | Medium | Architecture decision: which destination? |
| No claim-your-profile flow | High | Phase 2 feature — needs Bar Association API |
| No lawyer dashboard (lawyer-facing front-end) | High | Phase 2 — substantial work |
| No payment flow for plan upgrade | Critical | Phase 2 — see `payment-architecture.md` |
| `priority_score` set manually only | Medium | Could be computed from plan + featured_until + verification |
| `featured_until` has no admin UI for date picker (uses generic text input) | Low | Cosmetic — admin types YYYY-MM-DD |
| `claimed_by_user_id` not populated anywhere | Medium | Needs claim flow first |
| `monthly_lead_limit` not enforced | Medium | Needs lead handler to check + skip routing if exceeded |
| `leads_received` / `leads_accepted` not auto-incremented | Medium | Should fire when lead is `assigned` to lawyer |

---

## 7. REST tools for lawyer management

All under `/wp-json/jus-tice-engine/v1/` and admin-only:

| Endpoint | Method | Use |
|---|---|---|
| `/content/lawyers?per_page=50&page=1` | GET | List lawyers ordered by priority |
| `/content/leads` | GET | List leads ordered by date DESC |
| `/content/update-meta` | POST | Update whitelisted meta on a lawyer (e.g., bump priority, change plan) |
| `/content/trash-post` | POST | Trash a lawyer profile (audited) |
| `/seed-lawyers` | POST | Seed from CSV |
| `/seed-reset` | POST | Clear seed flag |
| `/reports/log` | GET | Audit trail |

---

## 8. UX gaps for lawyers as USERS (B2B)

Lawyer-facing experience does not yet exist. Plan:

| Surface | Status | Priority |
|---|---|---|
| `/lawyer-registration/` PAGE | NOT BUILT | High |
| `/lawyer-plans/` PAGE (pricing) | NOT BUILT | High |
| Lawyer-facing dashboard (after login) | NOT BUILT | Medium (Phase 2) |
| Profile edit form (front-end) | NOT BUILT | Medium |
| Lead inbox front-end (vs. WP Admin) | NOT BUILT | Medium |
| Plan upgrade page | NOT BUILT | High (after registration) |
| Email notifications when new lead arrives | PARTIAL — only admin gets email | High |
| WhatsApp notification when new lead arrives | NOT BUILT | Medium |

---

## 9. Lead routing logic (current vs needed)

### Current
- ALL new leads create a `justice_lead` CPT post
- Email goes to `get_option('admin_email')` regardless
- `assigned_lawyer_id` is never set
- `lead_routing_enabled` is checked only on the per-lawyer inquiry form (yes/no whether to show the form)

### Needed (Phase 2)
1. Lead arrives with `legal_area` + `city`
2. Find lawyers where `practice-areas` includes `legal_area`, `city` includes `city` (or no city), `lead_routing_enabled=1`, `monthly_lead_limit` not exceeded
3. Order by `priority_score DESC`, take top N (e.g., 3)
4. Set `assigned_lawyer_id` and `lead_status=assigned`
5. Notify each lawyer via email + WhatsApp
6. Track `leads_received` per lawyer
7. When lawyer accepts: increment `leads_accepted`

---

## 10. Verified vs NOT VERIFIED

| Item | Status |
|---|---|
| Code in repo | VERIFIED via Read tool this session |
| Active on live server | NOT VERIFIED — requires `GET /wp-json/jus-tice-engine/v1/health` on live |
| CPT registered on live server | NOT VERIFIED |
| Any real lawyer profiles on live | NOT VERIFIED — user warned that there are real names other than the seed list |
| Email delivery from live server | NOT VERIFIED — `wp_mail()` may be unreliable |
