# CMS Audit

**Date:** 2026-05-10
**Scope:** What WordPress, theme, and plugin actually do — vs. what the live server actually has.

---

## 1. WordPress core

| Item | Status | Notes |
|---|---|---|
| WordPress version | NOT VERIFIED | Plugin requires `at least: 6.4`. Live version unknown. |
| PHP version | NOT VERIFIED | Plugin requires `PHP 8.0+`. Live version unknown. uPress hosting normally serves PHP 8.1+. |
| WP Multisite | No | Plugin sets `Network: false` |
| Permalink structure | NOT VERIFIED | Theme assumes pretty permalinks. If `?p=123`-style, slug-based URLs break. **Owner action:** Settings → Permalinks → "Post name" → Save. |
| Discourage search engines | NOT VERIFIED | Settings → Reading. If checked, kills SEO. **Verify uncheckd.** |
| Site title / Tagline | NOT VERIFIED | Set via Customizer; reflected in `<title>` and OG tags. |
| Default category | NOT VERIFIED | Should be set to a meaningful one (default `Uncategorized` is bad). |

---

## 2. Active theme

| Item | Value |
|---|---|
| Theme name | Justice Theme |
| Theme version | 1.0.0 (`functions.php` `JUSTICE_THEME_VERSION`) |
| Theme dir | `wp-content/themes/justice-theme/` (assumed) |
| Text domain | `justice-theme` |
| RTL support | Yes — `rtl.css` loaded conditionally via `is_rtl()` |
| Custom logo support | Yes — `add_theme_support('custom-logo', ...)` in `inc/setup.php` |
| Image sizes registered | `justice-card 520×340`, `justice-card-wide 760×420`, `justice-hero 1440×720` |
| Nav menu locations | 6 (`primary`, `secondary`, `mobile`, `footer`, `legal_areas`, `footer_trust`) |
| Customizer settings | `justice_phone`, `justice_email`, `justice_whatsapp`, `justice_business_hours` |
| Schema.org JSON-LD | WebSite, Article, BreadcrumbList, Attorney, LegalService |
| Canonical tag | Emitted by theme; deferred when SEO plugin detected |
| Robots noindex | Search results, combinatorial directory filters, keyword search |

---

## 3. Active plugin: jus-tice-engine v1.0.0

| Item | Value |
|---|---|
| Folder | `wp-content/plugins/jus-tice-engine/` (assumed) |
| Main file | `jus-tice-engine.php` |
| Plugin name | Jus-Tice Engine |
| Activation hook | `jte_activate()` — registers CPTs/taxonomies, flushes rewrite rules |
| Loaded modules | 12 (security, logger, cpt-articles, cpt-lawyers, taxonomy-practice-areas, taxonomy-city, lead-submissions, seeder, rest-health, rest-content-tools, rest-db-tools, admin-pages) |
| Empty/stub modules | `security.php`, `admin-pages.php`, `rest-routes.php` (placeholders for future) |
| Removed this session | `agent-bridge.php`, `file-tools.php` (were dead code, not in includes list) |

### 3.1 Custom Post Types

| Slug | Public | Show UI | REST | Archive | Slug rewrite |
|---|---|---|---|---|---|
| `articles` | yes | yes | yes | yes | `/articles/` |
| `justice_lawyer` | yes | yes | yes | yes | `/lawyers/` |
| `justice_lead` | NO | yes | yes | no | (admin-only CRM) |

### 3.2 Taxonomies

| Slug | Hierarchical | REST | Object types | Slug rewrite |
|---|---|---|---|---|
| `practice-areas` | yes | yes | `articles`, `justice_lawyer` (FIXED this session — was `articles, post`) | `/practice-areas/` |
| `city` | no | yes | `justice_lawyer` (FIXED this session — was `lawyer`) | `/city/` |

### 3.3 Lawyer meta fields (registered via `register_post_meta`)

Identity: `lawyer_full_name`, `firm_name`, `bar_number`, `bio_short`
Professional: `languages`, `years_experience`, `courts`, `license_status`, `verification_status`
Contact: `phone`, `email`, `whatsapp`, `website`, `office_address`
Commercial: `plan_type`, `subscription_status`, `featured_until`, `priority_score`, `lead_routing_enabled`, `monthly_lead_limit`
Analytics: `profile_views`, `leads_received`, `leads_accepted`
Admin: `source_url`, `source_type`, `claimed_by_user_id`, `profile_status`, `internal_notes`

### 3.4 Lead meta fields

`visitor_name`, `visitor_phone`, `visitor_email`, `legal_area`, `city`, `urgency`, `message`, `source_url`, `source_keyword`, `assigned_lawyer_id`, `lead_status`, `consent`, `utm_source`, `utm_campaign`, `utm_medium`

---

## 4. REST API surface

All routes under `/wp-json/jus-tice-engine/v1/`. ALL routes require `current_user_can('manage_options')`.

| Route | Method | Purpose |
|---|---|---|
| `/health` | GET | System state — CPT/taxonomy registration, content counts, versions |
| `/theme-state` | GET | Theme info + active plugin list |
| `/reports/spam` | GET | Find casino/gambling content |
| `/reports/duplicates` | GET | Duplicate post titles |
| `/reports/users` | GET | All users with roles |
| `/reports/cron` | GET | WP cron jobs (suspicious flagged) |
| `/reports/options-suspect` | GET | Options matching feed/rss/import/casino/spam patterns |
| `/reports/plugins` | GET | All plugins with active status, duplicate-Justice detection |
| `/reports/log` | GET | Internal audit log (`jte_log` option) |
| `/content/lawyers` | GET | Lawyer list with priority + edit links |
| `/content/posts` | GET | Posts + articles list |
| `/content/leads` | GET | Lead inbox |
| `/content/update-meta` | POST | Whitelisted meta key update + audit log |
| `/content/trash-post` | POST | Move post to trash + audit log |
| `/seed-lawyers` | POST | Manual CSV seed (reads `project-control/lawyer-seed.csv`) |
| `/seed-reset` | POST | Clear `jte_seeded_v5` flag |

---

## 5. Lead flow

```
User fills form (ask-lawyer.php OR single-justice_lawyer.php inquiry)
    ↓
POST /wp-admin/admin-post.php?action=justice_submit_lead
    ↓
jte_handle_lead() in lead-submissions.php
    ↓
1. Verify nonce
2. Sanitize fields
3. wp_insert_post( type=justice_lead, status=publish )
4. Save meta (visitor_name, phone, email, area, city, message, urgency, consent, source_url)
5. Save UTM if present
6. wp_mail() to admin_email
7. Redirect with ?lead=success or ?lead=missing
```

**Status:**
- ✅ ask-lawyer.php form wired correctly (FIXED this session — was `action="#"`)
- ✅ single-justice_lawyer.php inquiry form wired correctly
- ❌ Email delivery NOT VERIFIED on live server (could be blocked, in spam, or `admin_email` could be wrong)
- ❌ No SMTP configured — uses default `wp_mail()` which often fails on shared hosting
- ❌ No webhook/Slack/CRM integration
- ❌ No anti-spam (no honeypot, no reCAPTCHA, no rate limit) — bot-vulnerable

---

## 6. Discovered bugs (this audit)

| # | Bug | Severity | Status |
|---|---|---|---|
| 1 | `archive-justice_lawyer.php` had orphan `</main>` (invalid HTML) | High | FIXED |
| 2 | `taxonomy-city.php` registered against `'lawyer'` not `'justice_lawyer'` | High | FIXED |
| 3 | `cpt-articles.php` labels in English | Medium | FIXED |
| 4 | `taxonomy-practice-areas.php` labels in English | Medium | FIXED |
| 5 | `taxonomy-practice-areas.php` attached to `'post'` (spam-prone) instead of `'justice_lawyer'` | Medium | FIXED |
| 6 | `lawyer-cta.php` had emoji icons 👤📩📊 | Low | FIXED |
| 7 | `ask-lawyer.php` form `action="#"` — leads going nowhere | Critical | FIXED |
| 8 | `trust-section.php` showed fake "10+ years" stat | High (trust) | FIXED |
| 9 | `topic-clusters.php` linked to non-existent `/family-law/` etc. — 404s | High | FIXED |
| 10 | `topic-clusters.php` queried `'post'` type (spam-prone) | Medium | FIXED |
| 11 | `featured-pillars.php` linked to non-existent `/family-law/divorce/` etc. — 404s | High | FIXED |
| 12 | No canonical URL meta in `<head>` | High (SEO) | FIXED |
| 13 | No Attorney schema for lawyer profiles | High (SEO) | FIXED |
| 14 | No LegalService schema for practice-area pages | Medium (SEO) | FIXED |
| 15 | Customizer missing `justice_whatsapp` setting (footer used hardcoded default) | Medium | FIXED |
| 16 | Lawyer view counter incremented on every request including bots | Medium (data) | FIXED |
| 17 | Plugin had dead `agent-bridge.php`, `file-tools.php` not loaded | Low (cleanliness) | FIXED — files removed |
| 18 | Seeder created lawyers as `publish` (fake profiles go live) | Critical (trust) | FIXED in earlier session |
| 19 | Seeder marked lawyers `verification_status=verified` | High (trust) | FIXED in earlier session |
| 20 | Plugin label `verification_status` icon used `⏳` emoji | Low | FIXED in earlier session |

### Still broken / NOT FIXED

| Item | Severity | Why not fixed |
|---|---|---|
| No anti-spam on lead forms (no honeypot, no captcha) | High | Needs deployment + design choice (reCAPTCHA vs hCaptcha vs honeypot) |
| No SMTP for `wp_mail()` reliability | High | Requires SMTP plugin install + credentials |
| Pillar PAGES don't exist (so `/divorce-lawyer/` etc. fall back to taxonomy or directory) | High | Owner action — must be created in WP Admin |
| No XML sitemap | High | Requires SEO plugin |
| No GSC connection | High | Requires GSC verification + sitemap submission |
| Empty `components.css` (2 lines) and `accessibility.css` (1 line) | Low | Loaded but contribute almost nothing — dead enqueue overhead. Either populate or remove from enqueue. |
| Plugin stubs `security.php`, `admin-pages.php`, `rest-routes.php` are 3-line placeholders | Low | Either remove or implement |
| No author meta on articles (uses Organization not Person) | Medium (E-E-A-T) | Needs editorial decision: who is the named author/reviewer? |
| Lead handler uses `wp_mail` only — no Slack/webhook/CRM forwarding | Medium | Architecture decision pending |
| No GDPR/Israeli Privacy Law cookie banner | High | Needs legal review + plugin |

---

## 7. Plugin/theme duplication risk

| Risk | Status |
|---|---|
| Multiple "Justice" plugins active simultaneously | NOT VERIFIED — use `GET /wp-json/jus-tice-engine/v1/reports/plugins` on live to detect |
| Both `lawyer` and `justice_lawyer` CPTs registered | LOW now — `taxonomy-city.php` fixed; only `justice_lawyer` exists in current plugin |
| Both `category` and `practice-areas` taxonomies on `articles` CPT | YES — articles CPT registers `category, post_tag` AND practice-areas registers `articles`. Editor must NOT use both for the same article — choose practice-areas. |
| Default WP `post` type still active and casino spam appearing | YES — confirmed in spam-investigation.md. Restrict admin user from creating new `post`s; use `articles` CPT only. |

---

## 8. Verification commands (when live access is available)

```bash
# Plugin/theme inventory
wp plugin list --format=table
wp theme list --format=table

# CPT/taxonomy verification
wp post-type list --format=table
wp taxonomy list --format=table

# Spam check
wp post list --post_type=post --format=count   # how many native posts (potentially spam)
wp post list --post_type=articles --format=count

# REST health
curl -u admin@jus-tice.co.il:APP_PASSWORD https://jus-tice.co.il/wp-json/jus-tice-engine/v1/health

# Permalink check
wp option get permalink_structure   # should be "/%postname%/"

# Search engine visibility
wp option get blog_public           # should be 1 (visible)
```

All NOT VERIFIED until run.
