# Strategic Roadmap — Jus-Tice.co.il
**Date:** 2026-05-09  
**Horizon:** 30 / 60 / 90 days  
**Goal:** Build the dominant Israeli legal portal — content authority, lawyer directory, lead generation, AI intake

---

## PHASE 0 — EMERGENCY STABILIZATION (Days 1–7)

These must be done BEFORE anything else. Nothing else matters if the site is broken.

| # | Task | Owner | Risk if Skipped |
|---|------|-------|-----------------|
| 0.1 | Identify and stop spam content appearing on homepage | Dev | Google spam penalty |
| 0.2 | Verify only ONE Justice Core plugin is active | Dev | Fatal errors |
| 0.3 | Verify `articles` and `justice_lawyer` CPTs are registered | Dev | 404 on all CPT pages |
| 0.4 | Verify active theme is `justice-theme` | Dev | Wrong theme loads |
| 0.5 | Run WP-CLI `wp rewrite flush` | Dev | CPT archives 404 |
| 0.6 | Enable WP_DEBUG_LOG (not display) | Dev | Blind to errors |
| 0.7 | Change `latest-articles.php` query to `articles` only | Dev | Spam posts show in feed |
| 0.8 | Fix hero search form action to `/lawyers/` | Dev | Broken UX flow |

---

## PHASE 1 — FOUNDATION (Days 1–30)

Goal: A working, professional, spam-free Hebrew legal portal that can be demonstrated.

### Technical
| Task | Priority | Estimated Effort |
|------|----------|-----------------|
| 1.1 Create canonical Justice Core plugin with all CPTs/taxonomies/REST | CRITICAL | 2 days |
| 1.2 Implement `justice_submit_lead` POST handler | HIGH | 4 hours |
| 1.3 Add ACF/CMB2 meta boxes for lawyer profile fields | HIGH | 4 hours |
| 1.4 Install Yoast SEO or RankMath (XML sitemap, canonical) | HIGH | 1 hour |
| 1.5 Install WP Rocket or caching plugin | MEDIUM | 1 hour |
| 1.6 Install Wordfence (security scan + monitoring) | HIGH | 1 hour |
| 1.7 Implement REST health route | MEDIUM | 2 hours |
| 1.8 Upload professional logo (SVG preferred) | HIGH | Design task |
| 1.9 Configure menus (primary nav, footer legal areas) | MEDIUM | 1 hour |

### Content
| Task | Priority | Estimated Effort |
|------|----------|-----------------|
| 1.10 Create 10 practice area taxonomy terms with Hebrew names + descriptions | HIGH | 2 hours |
| 1.11 Publish 5 pillar articles (family law, criminal, traffic, real estate, labor) | HIGH | 5 × 2 hours = 10 hours |
| 1.12 Publish 20 supporting articles across clusters | HIGH | 20 × 1.5 hours = 30 hours |
| 1.13 Create 10 draft/private lawyer profiles (test data) | HIGH | 2 hours |
| 1.14 Create About page (Hebrew, editorial policy) | HIGH | 2 hours |
| 1.15 Create Contact page | MEDIUM | 1 hour |
| 1.16 Create Terms of Use (users) | HIGH | Legal task |
| 1.17 Create Lawyer Terms (lawyer registration) | HIGH | Legal task |
| 1.18 Create Privacy Policy | HIGH | Legal task |
| 1.19 Create Advertising Disclosure | MEDIUM | 1 hour |

### SEO
| Task | Priority | Estimated Effort |
|------|----------|-----------------|
| 1.20 Connect Google Search Console | CRITICAL | 30 min |
| 1.21 Connect Google Analytics | HIGH | 30 min |
| 1.22 Submit sitemap to GSC | HIGH | 30 min |
| 1.23 Verify all practice area taxonomy pages are indexable | HIGH | 1 hour |
| 1.24 Add FAQ schema to pillar articles | MEDIUM | Per-article |

---

## PHASE 2 — GROWTH ENGINE (Days 31–60)

Goal: Lawyer self-registration, payment structure, lead routing live.

### Lawyer System
| Task | Priority | Estimated Effort |
|------|----------|-----------------|
| 2.1 Build lawyer registration page (/lawyer-registration/) | CRITICAL | 2 days |
| 2.2 Build lawyer onboarding wizard (multi-step form) | HIGH | 3 days |
| 2.3 Build lawyer dashboard (/dashboard/) | HIGH | 3 days |
| 2.4 Build lawyer profile editor | HIGH | 2 days |
| 2.5 Implement plan/subscription structure (WooCommerce) | HIGH | 3 days |
| 2.6 Build admin approval flow (lawyer pending → active) | HIGH | 1 day |
| 2.7 Email notification: new lead to lawyer | HIGH | 4 hours |
| 2.8 Email notification: admin approval status to lawyer | MEDIUM | 2 hours |
| 2.9 Build lawyer lead inbox page | HIGH | 1 day |

### Payment Plans (Phase 2 MVP)
| Plan | Price (suggested) | Features |
|------|-------------------|---------|
| Free Profile | ₪0 | Basic profile, no leads |
| Pro Profile | ₪299/mo | Full profile, 5 leads/mo |
| Featured Lawyer | ₪599/mo | Pro + featured placement |
| Lead Partner | ₪999/mo | Unlimited leads |

### Content
| Task | Priority |
|------|----------|
| 2.10 Add author CPT or user roles for article authors | HIGH |
| 2.11 Add 50 more supporting articles | HIGH |
| 2.12 Add city taxonomy terms + city filter pages | HIGH |
| 2.13 Begin collecting 3–5 real lawyer profiles | HIGH |

### SEO
| Task | Priority |
|------|----------|
| 2.14 Implement canonical tags | HIGH |
| 2.15 Add FAQ schema to articles with real FAQs | MEDIUM |
| 2.16 Build first 5 city × practice area pages | MEDIUM |
| 2.17 GSC analysis — find high impression / low CTR pages | HIGH |

---

## PHASE 3 — AUTHORITY AND SCALE (Days 61–90)

Goal: Topical authority, AI intake, premium positioning.

### AI Integration
| Task | Notes |
|------|-------|
| 3.1 AI-powered lead classification | Practice area + city + urgency from free text |
| 3.2 AI lawyer matching | Match lead to top 3 lawyers by area + city |
| 3.3 AI content briefs | Weekly suggestions for new articles |
| 3.4 AI duplicate detection | Weekly scan for cannibalizing content |
| 3.5 AI SEO report | Weekly GSC anomaly detection + opportunity report |

### Scale Content
| Task | Notes |
|------|-------|
| 3.6 100+ articles across all clusters | Complete pillar + supporting structure |
| 3.7 25+ real lawyer profiles (paid) | Revenue milestone |
| 3.8 Q&A forum (basic) | High SEO value, user engagement |
| 3.9 Lawyer endorsements / reviews | Trust building |

### Business
| Task | Notes |
|------|-------|
| 3.10 Performance-based lead model | Pay per lead instead of/alongside subscription |
| 3.11 Advertising packages | Sponsored articles, banner placements |
| 3.12 Legal content marketing for law firms | Ghostwritten articles attributed to firm |

---

## SUCCESS METRICS

| Metric | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|--------|---------------|----------------|----------------|
| Published articles | 25 | 75 | 150+ |
| Lawyer profiles | 10 (draft) | 25 (live, 5 paid) | 100+ |
| Monthly organic sessions | 500 | 5,000 | 25,000+ |
| Monthly leads | 0 | 50 | 500+ |
| Monthly revenue | ₪0 | ₪3,000 | ₪30,000+ |
| GSC impressions | 1,000 | 50,000 | 500,000+ |
| Domain Authority | 10 | 20 | 35+ |
