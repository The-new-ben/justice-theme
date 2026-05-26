# Competitor Research — Legal Portal Benchmark
**Date:** 2026-05-09  
**Purpose:** Inform design, UX, SEO, and business model decisions for Jus-Tice.co.il  
**Note:** Based on expert knowledge of these platforms. Live URLs not fetched — structural analysis only.

---

## 1. Din.co.il

### What It Does Well
- **Lawyer directory is the core product.** The homepage is a search interface first. No editorial clutter.
- **Practice area taxonomy** is the primary navigation axis. Every page is reachable via practice area → city.
- **Category pages are deep.** "עורך דין גירושין בתל אביב" pages have real content: lawyer listings, FAQs, articles.
- **Q&A forum** drives massive SEO value through long-tail queries ("מה זכויותי ב...").
- **Lawyer profiles** are detailed: photo, bio, years of experience, bar number, specializations, client reviews.
- **Review system** is the moat — collected reviews over years build social proof that can't be replicated quickly.
- **Internal linking** is dense and strategic: every article links to the directory, every taxonomy links to articles.
- **Mobile UX** is category-first with filters. Converts well on mobile searches.

### What to Copy From Din
| Pattern | Implementation |
|---------|----------------|
| Hero = search form first | ✅ Already done in Justice theme |
| Practice area + City = primary navigation | ✅ Taxonomy architecture exists |
| Dense footer links (practice × city) | ✅ Already implemented |
| Category pages with lawyer list + articles | MUST BUILD — taxonomy-practice-areas.php needs lawyer query |
| Q&A / Forum section | PHASE 2 — high SEO value |
| Lawyer review collection | PHASE 3 — requires trust building |

### What Din Does Wrong (Opportunities for Jus-Tice)
- **Design is dated** — dark blue corporate look from 2012. No visual hierarchy.
- **Mobile experience is cluttered.** Too many items, too small tap targets.
- **Article quality is thin** — mass-produced, low E-E-A-T content.
- **No AI intake/routing.** Lead forms go to generic contact pages.
- **UX between content and directory is disconnected.**

---

## 2. PsakDin.co.il (פסק דין)

### What It Does Well
- **Legal news + legal articles** is the primary value prop. Deep content library.
- **High E-E-A-T signals** — authors named, dates displayed, judicial rulings cited.
- **Legal database** — actual court rulings are indexed and searchable.
- **Authority positioning** — perceived as professional/official by legal practitioners.
- **Long articles** with citations, table of contents, and proper editorial structure.
- **Lawyer section** exists but is secondary to content.

### What to Copy From PsakDin
| Pattern | Implementation |
|---------|----------------|
| Named authors with credentials | Must add author CPT or user roles |
| Updated date prominently shown | ✅ Already in single-articles.php |
| Editorial note / legal disclaimer | ✅ Already in single-articles.php |
| Article with full table of contents | Add TOC plugin or manual HTML structure |
| Source citations at end of article | Add to single-articles.php template |
| Practice area tag prominently displayed | ✅ Already shown in article header |

### What PsakDin Does Wrong
- **No lead generation.** Editorial-only, no business model visible for average user.
- **No lawyer directory UX.** Lawyers exist but are hard to find/filter.
- **Design is newspaper-style** — functional but not premium or modern.
- **No AI or chat features.** Static content only.

---

## 3. Justia.com (International Benchmark)

### What It Does Well — World Class Execution
- **Lawyer directory is premium.** Profiles are detailed, SEO-optimized, and structured.
- **Three monetization tiers are clear:** Free basic profile → Premium profile → Platinum (lead routing).
- **Lawyer marketing pitch is explicit:** "Get found. Get hired." — clear value prop.
- **Legal guides** are encyclopedic, linked to each other, and to lawyer profiles.
- **URL structure is surgical:**
  ```
  /lawyers/family-law/
  /lawyers/family-law/california/
  /lawyers/family-law/los-angeles/
  /lawyers/john-smith/
  ```
- **State/region pages** are real content pages, not thin doorway pages.
- **Schema is thorough** — Attorney, LegalService, BreadcrumbList, FAQ on every relevant page.
- **Free lawyer profiles** are a brilliant growth hack — lawyers claim free profiles, then see lead data and upgrade.
- **Client reviews** are collected and displayed. Lawyers pay to respond.

### What Justia Does That Jus-Tice Must Copy
| Pattern | Priority | Implementation |
|---------|----------|----------------|
| Free profile claim → upgrade path | CRITICAL | Phase 2 self-registration |
| Practice area → City → Lawyer URL structure | CRITICAL | Requires city taxonomy + URL rewrite rules |
| Premium lawyer profiles with visible plan tier | HIGH | Plan field exists; upgrade page missing |
| Lead routing tied to paid plan | HIGH | `lead_routing_enabled` field exists; needs handler |
| Article ↔ Lawyer cross-linking | HIGH | Related lawyers sidebar on articles |
| FAQ schema only on pages with real FAQs | HIGH | Do NOT fake FAQs |
| Lawyer self-service dashboard | MEDIUM | Phase 2 |

### What to NOT Copy From Justia
- Their breadth (50 states × 100+ practice areas × 1000 cities) — that's 10 years of content.
- Their forum / community features — too early for Jus-Tice.
- Their law school / law review content — not the audience.

---

## 4. Midrag.co.il

### What It Does Well
- **Marketplace UX** — clear provider cards, ratings prominently shown, easy comparison.
- **Lead capture is core** — every page pushes you to "קבלו הצעות" (get quotes).
- **Trust signals are strong** — number of reviews, certified professionals, response time.
- **Category landing pages** are conversion-optimized, not just listings.
- **Simple professional onboarding** — contractors sign up, complete profile, start getting leads.
- **Mobile-first conversion** — CTA buttons are large, above fold.

### What to Copy From Midrag
| Pattern | Priority |
|---------|----------|
| Provider cards with rating/review count | PHASE 3 |
| "קבלו הצעות" primary CTA on every lawyer page | HIGH |
| Onboarding wizard (step 1/4, step 2/4...) | PHASE 2 |
| Mobile CTA above fold on lawyer profile | HIGH |
| Response time / activity signal on profile | PHASE 3 |

### What Midrag Does Wrong
- Midrag is a generic marketplace. Legal is YMYL — trust, authority, and professional compliance matter more than speed of comparison.
- Reviews on Midrag feel transactional. Legal needs editorial authority, not just Yelp-style ratings.

---

## 5. International Legal Portals (Avvo, FindLaw, LegalZoom, LawDepot)

### Key Patterns Across All
1. **Content is the SEO funnel.** Guides → search query → lawyer directory.
2. **Practice area pages are pillar content** with sub-topic clusters underneath.
3. **"Find a Lawyer" is always one click from any article.**
4. **Lead forms capture name, phone, legal area, urgency.** Simple, short.
5. **Lawyer verification/badge** is a paid feature but also a trust signal.
6. **"Peer endorsements"** or "colleague reviews" (Avvo) add professional credibility.

### What Justia-Model Lawyer Profile Should Include
```
1. Name, credentials (Adv.)
2. Firm name + address
3. Photo (professional)
4. Practice areas (as tags)
5. Cities/regions served (as tags)
6. Languages spoken
7. Years of experience
8. Bar number (verification link)
9. Bio (short summary + long bio)
10. Client reviews (if available)
11. Awards/recognitions
12. Lead inquiry form
13. Phone / WhatsApp CTAs
14. "פרופיל ממומן" badge if paid
15. Verification status (unverified / verified / partner)
16. Related articles in this practice area
17. Similar lawyers nearby
18. Legal disclaimer
```

### What a Premium Legal Article Page Should Include
```
1. Practice area breadcrumb
2. H1 (money keyword first)
3. Author name + date published + date updated
4. Estimated reading time
5. Table of contents (for long articles)
6. Article content
7. FAQ section (only if real FAQs)
8. Related articles (same practice area)
9. Related lawyers (from directory)
10. Lead CTA: "צריכים עזרה? שלחו פנייה"
11. Editorial disclaimer
12. Sources/references
13. Social share (optional)
```

---

## 6. Homepage Design Benchmark Summary

Based on all competitors, the homepage must follow this section order (already implemented in Justice theme — VERIFIED):

1. **Hero** — H1 with "עורכי דין" + structured search (practice area + city) + stats
2. **Practice areas grid** — 8–12 cards, primary navigation
3. **Cities grid** — 8–12 major cities, SEO footprint
4. **Featured lawyers** — 4 cards, social proof (will show empty state until lawyers added)
5. **Latest articles** — 6 cards, content authority signal
6. **Featured pillars** — 6 deep guides
7. **Topic clusters** — 4 clusters with sub-articles
8. **Ask a lawyer** — lead form (primary conversion)
9. **Trust section** — stats (article count, practice areas, cities)
10. **Lawyer CTA** — B2B section (lawyer onboarding)
11. **Newsletter** — email capture
12. **Footer** — dense internal links (SEO) + legal disclaimers

**VERDICT:** The Justice theme homepage section order is already benchmarked correctly against competitors. The gap is content (zero real articles/lawyers) and hero search functionality (broken GET params).

---

## 7. What Will Make Jus-Tice Better Than Competitors

| Differentiator | Description |
|----------------|-------------|
| AI-powered lead intake | Classify practice area + urgency + city automatically from free-text input |
| Premium Hebrew typography | Competitors all use system fonts or generic Hebrew fonts — Heebo at proper weights is a visual upgrade |
| E-E-A-T from day one | Named authors, update dates, legal disclaimers on every article |
| Mobile-first lead forms | Competitors have clunky mobile forms |
| Transparent pricing for lawyers | Din/PsakDin don't show pricing — Jus-Tice should publish plan pricing |
| Modern design | All Israeli competitors have 2012-era designs — Jus-Tice's navy/gold is a premium leap |
| WhatsApp-first contact | Israeli audience uses WhatsApp heavily — already implemented in theme |
| Real-time lawyer availability | "זמין לפגישה עכשיו" badge if lawyer marks themselves available |
