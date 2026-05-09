# Jus-Tice.co.il — Strategic Recap

## 1. Business Goal

Transform jus-tice.co.il from an under-maintained WordPress legal content site into **Israel's dominant legal portal** — a platform that combines legal media, lawyer directory, lead generation, and a paid marketplace for legal professionals.

## 2. Competitor Model Summary

| Competitor | Strength | What We Take |
|---|---|---|
| **din.co.il** | Largest Israeli legal forum, Q&A, lawyer directory | Forum/Q&A structure, category depth, practice area pages |
| **Justia** (US) | Premium lawyer profiles, paid placements, AI intake | Monetization model (free/paid tiers), profile pages, city+practice pages |
| **PsakDin** | Legal magazine, court rulings, newsletter | Legal news format, editorial authority, content freshness |
| **Takdin** | Legal database, search, law archive | Information architecture, advanced search, structured legal data |
| **Midrag** | Verified provider marketplace, ratings, performance-based pay | Dashboard UX, closed-deal model, trust signals |

## 3. Target Users

| User Type | Need | How We Serve |
|---|---|---|
| Person in legal crisis | Find a lawyer NOW | AI intake → instant match → lead form |
| Person researching rights | Understand their legal situation | Pillar guides, FAQs, glossary |
| Person comparing lawyers | Which lawyer is right for me? | Directory, profiles, reviews (if compliant) |
| Law student / professional | Legal news, rulings, updates | Legal magazine, court decision summaries |

## 4. Target Lawyers

| Lawyer Segment | Value Proposition |
|---|---|
| Solo practitioner | Affordable online presence, lead flow |
| Small firm (2-10) | Featured placements, branded profiles |
| Boutique firm | Content marketing, thought leadership |
| Large firm | Premium visibility, sponsored content |

## 5. Revenue Models

| Model | Description | Priority |
|---|---|---|
| Paid lawyer profiles | Monthly subscription for enhanced profile | P1 — Core |
| Premium placements | Featured positions on practice/city pages | P1 — Core |
| Lead sharing | Pay-per-qualified-lead | P1 — Core |
| Sponsored content | Lawyer-authored articles with disclosure | P2 — Phase 2 |
| Lawyer content packages | Profile + articles + SEO pages bundle | P2 — Phase 2 |
| AI intake routing | Automated lead classification and routing | P2 — Phase 2 |
| Closed-case commission | Pay on conversion (if legally allowed) | P3 — Research needed |

## 6. SEO Keyword Targets

### Tier 1 — National Head Terms
- עורך דין
- עורכי דין
- עורך דין גירושין
- עורך דין פלילי
- עורך דין תעבורה

### Tier 2 — Practice Area Terms
- עורך דין לענייני משפחה
- עורך דין רשלנות רפואית
- עורך דין נזיקין
- עורך דין מקרקעין
- עורך דין ירושה / צוואות
- עורך דין עבודה
- עורך דין ביטוח לאומי
- עורך דין תאונות דרכים

### Tier 3 — Practice + City Combinations
- עורך דין גירושין בתל אביב
- עורך דין פלילי בירושלים
- עורך דין תעבורה בחיפה
- עורך דין משפחה בראשון לציון
- עורך דין מקרקעין בבאר שבע

### Strategy
- One canonical pillar page per practice area
- One canonical page per practice+city combination
- All supporting articles link to their pillar
- No cannibalization between pillar and supporting content

## 7. CMS Architecture

### Custom Post Types
| CPT | Slug | Purpose |
|---|---|---|
| `articles` | articles | Legal articles, guides, rulings (exists) |
| `lawyer` | lawyers | Lawyer profiles (NEW) |
| `lead` | (admin only) | Visitor inquiries / lead CRM (NEW) |
| `question` | questions | Public legal Q&A (FUTURE) |

### Taxonomies
| Taxonomy | Applied To | Purpose |
|---|---|---|
| `practice-areas` | articles, lawyer, question | Legal fields (exists) |
| `city` | lawyer | Location served (NEW) |
| `lawyer-plan` | lawyer | Subscription tier (NEW) |

### Key Meta Fields — Lawyer CPT
- bar_number, firm_name, profile_photo, bio
- phone, email, website, whatsapp
- languages, years_experience, license_status
- plan_type, featured_status, lead_routing_active

### Key Meta Fields — Lead CPT
- name, phone, email, legal_area, city
- urgency, message, assigned_lawyer, lead_status
- source_url, utm_source, utm_medium, consent, created_date

## 8. AI Automation Plan

| AI Function | Priority | Description |
|---|---|---|
| Lead intake classifier | P1 | Classify legal field, urgency, city from form input |
| Lead-to-lawyer router | P1 | Match lead to relevant lawyers by area + city |
| Content brief generator | P2 | Create outlines for pillar + supporting pages |
| Internal link suggester | P2 | Scan content, suggest cross-links |
| Duplicate topic detector | P2 | Flag cannibalization risks |
| Weekly owner report | P2 | Summarize leads, SEO, payments |
| Article update detector | P3 | Flag outdated content for refresh |
| Lawyer onboarding assistant | P3 | Guide lawyers through profile setup |

## 9. Technical Roadmap

### Phase 1 — Foundation (Current → 2 weeks)
- ✅ Premium Hebrew homepage
- ✅ RTL design system
- ✅ Git → GitHub → uPress deployment
- Content inventory & anti-cannibalization audit
- Lawyer CPT registration (justice-core plugin)
- Lead CPT registration (justice-core plugin)
- Practice area pillar page template
- Legal advertising compliance research

### Phase 2 — Directory MVP (2-4 weeks)
- Lawyer profile page template
- Lawyer directory page with filters
- Lawyer registration flow
- Lead form integration
- Admin lead dashboard
- City taxonomy + city pages

### Phase 3 — Monetization (4-8 weeks)
- Lawyer subscription plans
- Featured placement system
- Pay-per-lead tracking
- Lawyer dashboard (profile, leads, analytics)
- Payment processing

### Phase 4 — AI & Scale (8-12 weeks)
- AI intake chatbot
- AI lead routing
- AI content briefs
- GSC integration & automated reporting
- Newsletter system
- Legal Q&A system

## 10. First 30 Tasks

| # | Task | Priority | Area |
|---|---|---|---|
| 1 | Create project-control system | P0 | Ops |
| 2 | Create strategic-recap.md | P0 | Strategy |
| 3 | Research Israeli lawyer advertising rules | P0 | Legal |
| 4 | Set up Linear milestones | P0 | Ops |
| 5 | Content inventory from WP REST API | P1 | SEO |
| 6 | Anti-cannibalization map | P1 | SEO |
| 7 | Register Lawyer CPT in justice-core | P1 | Dev |
| 8 | Register Lead CPT in justice-core | P1 | Dev |
| 9 | Create practice area pillar page template | P1 | Dev |
| 10 | Create lawyer profile page template | P1 | Dev |
| 11 | Create lawyer directory page template | P1 | Dev |
| 12 | Upgrade hero with new messaging | P1 | Design |
| 13 | Add "For Lawyers" CTA section to homepage | P1 | Design |
| 14 | Add newsletter section to homepage | P2 | Design |
| 15 | Create featured-lawyers section (placeholder) | P2 | Design |
| 16 | Create editorial policy page | P1 | Legal |
| 17 | Create advertising disclosure page | P1 | Legal |
| 18 | Create privacy policy page | P1 | Legal |
| 19 | Create lead form component | P1 | Dev |
| 20 | Create city taxonomy | P1 | Dev |
| 21 | Create city+practice landing page template | P2 | Dev |
| 22 | Design lawyer dashboard wireframe | P2 | Product |
| 23 | Design admin CRM wireframe | P2 | Product |
| 24 | Prepare GSC OAuth integration | P2 | Dev |
| 25 | Create legal glossary page template | P2 | Dev |
| 26 | Add schema.org LegalService markup | P1 | SEO |
| 27 | Add schema.org Attorney markup for lawyer profiles | P1 | SEO |
| 28 | Create 301 redirect plan | P1 | SEO |
| 29 | Mobile UX audit | P1 | QA |
| 30 | Demo readiness checklist | P0 | Ops |
