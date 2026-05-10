# Current Status — Jus-Tice.co.il

**Last updated:** 2026-05-10
**Branch:** `claude/justice-website-review-aovSK`
**Owner:** Jus-Tice

---

## TL;DR

| Layer | State | Confidence |
|---|---|---|
| Theme code | Premium, Hebrew-first, RTL, schema-rich, no known bugs | HIGH (code reviewed) |
| Plugin code | Working CPT/taxonomy/REST/lead architecture, all critical bugs fixed | HIGH (code reviewed) |
| Live server | NOT VERIFIED in this session (no live access) | UNKNOWN |
| Content | Pillar PAGES not yet built; lawyer profiles status unknown | NOT VERIFIED |
| SEO | Schema.org, canonical, robots, OG tags all in code | HIGH (code) |
| Lead capture | Form + handler wired correctly | MEDIUM (no SMTP/anti-spam yet) |
| Lawyer onboarding | Designed, not built | LOW |
| Payments | Architecture designed, not built | LOW |

---

## What's working today (verified in code)

1. Theme structure (12-section homepage)
2. RTL Hebrew rendering throughout
3. Custom logo support + Customizer settings (phone, email, WhatsApp, business hours)
4. 6 nav-menu locations
5. CPTs: `articles`, `justice_lawyer`, `justice_lead`
6. Taxonomies: `practice-areas`, `city`
7. Lawyer profile template with Attorney schema
8. Lawyer directory with city/area/keyword filtering
9. Lead form: ask-lawyer + per-lawyer inquiry → admin-post handler → `justice_lead` CPT + email
10. Admin: lawyer list with custom columns, lead inbox with status workflow
11. REST: 17 admin-only routes for inspection + content management
12. SEO: meta description, OG, canonical, robots noindex on thin pages
13. Schema.org: WebSite, Article, BreadcrumbList, Attorney, LegalService, FAQ-ready
14. Premium CSS polish: hover micro-animations, focus rings, fade-in, RTL overrides

---

## What's broken / risky on the LIVE server (NOT VERIFIED)

These are SUSPECTED based on previous-session evidence but NOT confirmed:

| Issue | Evidence | Severity |
|---|---|---|
| Casino/gambling spam in `wp_posts` | Confirmed in previous session inspection | High |
| Multiple "Justice" plugins active | Owner mentioned plugin folder confusion | High |
| Real lawyer names appearing without consent | Owner mentioned "names other than Maya Rothenberg" | Critical |
| `jte_seeded_v4` flag may have published seed lawyers as `publish` | Earlier session bug — fixed with v5 bump but only effective on next admin_init | High |
| No SEO plugin | Owner mentioned no Yoast/RankMath | High |
| No GSC connection | Owner mentioned no Search Console | High |
| No logo uploaded | Owner mentioned logo missing | Medium |
| No menus assigned | Inferred from fallback menu being shown | High |
| No taxonomy terms (practice-areas, city) | Inferred from empty hero quick-links | High |

---

## Workflow state

| Doc | Status |
|---|---|
| URL strategy decision | DOCUMENTED (`url-strategy.md`) |
| Slug normalization rules | DOCUMENTED |
| SEO/AIO/GEO strategy | DOCUMENTED |
| CMS audit (20 bugs catalogued, 17 fixed) | DOCUMENTED |
| Frontend ↔ CMS map | DOCUMENTED |
| Competitor research | DOCUMENTED with citations |
| Lawyer privacy review | DOCUMENTED |
| Lawyer system audit | DOCUMENTED |
| CRM architecture | DOCUMENTED |
| Payment architecture | DOCUMENTED |
| Lawyer onboarding flow | DOCUMENTED |
| Visual QA (desktop) | DOCUMENTED — code-only review |
| Mobile QA | DOCUMENTED — code-only review |
| Polish cycles log | DOCUMENTED through cycle 3 |
| Performance + PHP audit | DOCUMENTED |
| URL migration map | SKELETON (needs live URL inventory) |
| SERP research log | SKELETON (needs GSC) |
| Title audit | SKELETON |
| CMS checklist (operational) | SKELETON |
| Content inventory CSV | EXISTS (template) |
| Cannibalization map CSV | EXISTS (template) |
| Topic clusters CSV | EXISTS |
| Internal link opportunities CSV | EXISTS (template) |
| Spam investigation | DOCUMENTED — investigation plan only |
| Plugin/theme manual | DOCUMENTED |
| Strategic roadmap (30/60/90) | DOCUMENTED |
| Demo readiness | DOCUMENTED |
| Next actions | DOCUMENTED |
| Task board CSV | EXISTS |
| Decisions log | DOCUMENTED (this session) |
| Blockers log | DOCUMENTED (this session) |
| Risks log | DOCUMENTED (this session) |

---

## Highest-leverage next actions (when live access available)

### Within 1 hour
1. Run `GET /wp-json/jus-tice-engine/v1/health` → verify CPTs, taxonomies, plugin v1.0.0
2. Run `GET /wp-json/jus-tice-engine/v1/reports/spam` → list casino content
3. Run `GET /wp-json/jus-tice-engine/v1/reports/plugins` → confirm only ONE Justice plugin
4. Run `GET /wp-json/jus-tice-engine/v1/reports/users` → audit users
5. Run `GET /wp-json/jus-tice-engine/v1/content/lawyers` → see actual lawyer profiles
6. Set permalinks to `/%postname%/`
7. Verify "Discourage search engines" UNCHECKED

### Within 1 day
8. Trash all casino spam (use `/content/trash-post`)
9. Upload logo (Customizer > Site Identity)
10. Assign menus (Appearance > Menus to all 6 locations)
11. Create 10 practice-areas terms (Hebrew name, English slug per `slug-normalization-rules.md`)
12. Verify 20 city terms exist (plugin auto-seeds them)
13. Install SEO plugin (RankMath recommended for free tier)
14. Submit sitemap to Google Search Console
15. Install SMTP plugin + configure (SendGrid free tier)
16. Install Cloudflare Turnstile or hCaptcha for lead form

### Within 1 week
17. Create 8 pillar PAGES per `url-strategy.md` (1500–3000 words each, in Hebrew)
18. Create 5 supporting articles per pillar (start with `divorce-lawyer` cluster)
19. Concierge-onboard 5 real lawyers (Mode C in `lawyer-onboarding-flow.md`)
20. Create required pages: `/about/`, `/editorial-policy/`, `/advertising-disclosure/`, `/privacy/`, `/terms/`
21. Create `/lawyer-registration/` and `/lawyer-plans/` pages

### Within 1 month
22. Build lawyer-facing dashboard (Phase 2 — substantial)
23. Build claim-your-profile flow
24. Wire payment platform (WooSubs + Israeli gateway)
25. Build lead routing (auto-assign to lawyer matching area + city)
26. Set up review collection trigger on `lead_status=converted`
27. Outbound: 30 lawyer outreach for concierge onboarding

---

## What I CAN do without live access

- More code reviews / refactoring
- Build templates (e.g., pillar-page-content.php template part with FAQ + lawyer carousel)
- Build lawyer dashboard (Phase 2 starter)
- Build claim flow form
- Continue documenting edge cases
- Write content templates for pillar PAGES (Hebrew, ready to paste)

## What I CANNOT do without live access

- Verify any of the "NOT VERIFIED" items above
- Run REST endpoints
- Take screenshots
- Confirm fixes actually deployed
- Test actual lead submission end-to-end
- Test actual page speed
- Connect Google Search Console
- Upload logo / menus / taxonomy terms
- Trash actual spam posts
