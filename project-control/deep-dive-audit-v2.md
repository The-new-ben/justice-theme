# Jus-Tice Deep-Dive Audit V2 — Full Honest Report
**Date:** 2026-05-10  
**Scope:** Repo code + Live site (public) + REST API + SEO + UX  
**Mode:** Analysis only — zero code changes

---

## 1. Executive Summary

The site is **structurally operational and publicly accessible**. The navigation, homepage sections, articles archive, and lawyers directory are all rendering. The codebase is professionally organized. However, there are **12 critical issues** that prevent this from functioning as a credible legal marketplace.

> [!CAUTION]
> **Verdict:** The site looks like a finished product from a distance, but is populated with **fictional seed data** presented as real, has **massive taxonomy fragmentation**, and has **legacy CPT sprawl** that will hurt SEO long-term.

---

## 2. Live Site — Page-by-Page Findings

### 2.1 Homepage (`/`)

| Element | Status | Detail |
|---------|--------|--------|
| Header/Nav | ✅ Working | 7 items: צור קשר, אודות, עורכי דין, תחומי משפט (dropdown), מאמרים, שאלות, הצטרפות |
| Logo | ⚠️ Text-only | Shows "JusTice Jus-Tice פורטל משפטי חכם" — no image logo |
| Hero | ✅ Working | Hebrew copy, 2 CTAs ("מצאו עורך דין", "קראו מדריכים") |
| Practice areas grid | ✅ Working | 12+ categories with article counts — links work |
| Practice area search | ✅ Working | Full A-Z grid with "בקרוב" (coming soon) labels |
| Cities grid | ✅ Working | 12 Israeli cities with query-string links |
| Featured lawyer | ✅ Shows | **עו"ד מאיה רוטנברג** — Tel Aviv, Family Law |
| LegalTech tools section | ✅ Shows | AI intake, demand letter, family agreement, real estate review |
| Latest articles | ✅ Working | 6 article cards with excerpts, categories, CTA |
| Featured pillars | ✅ Working | Family law, criminal, real estate, traffic, labor, inheritance |
| Topic clusters | ✅ Working | 4 clusters with sub-links (family, criminal, real estate, traffic) |
| Ask-lawyer form | ✅ Present | Lead form section header present |
| Lawyer CTA section | ✅ Working | "הצטרפו למערכת" with 3 benefits |
| Newsletter | ✅ Present | Email signup section |
| Footer CTA | ✅ Working | Phone number 03-6161535, "שליחת פנייה" |
| Footer | ✅ Complete | 3 columns: specializations, quick nav, legal links |
| Accessibility toolbar | ✅ Present | 8-option toolbar (font, contrast, links, etc.) |
| Meta description | ✅ Correct | Hebrew, mentions עורך דין, מדריכים, Jus-Tice |
| OG tags | ✅ Present | og:title, og:description, og:locale=he_IL |
| Schema.org | ✅ Present | WebSite + SearchAction JSON-LD (code verified) |

### 2.2 Lawyers Directory (`/lawyers/`)

| Element | Status | Detail |
|---------|--------|--------|
| Breadcrumbs | ✅ Working | עמוד הבית → עורכי דין |
| Page title | ⚠️ OG issue | `og:description` says "עורכי דין Archive" — English word "Archive" leaks |
| Filter bar | ❌ Missing | No visible practice-area or city filter dropdowns on this page |
| Lawyer count | ⚠️ 10 listed | All 10 seed lawyers visible (Maya, David, Moshe, Sarah, Tamar, Eitan, Yossi, Liat, Noa, Avi) |
| Lawyer URLs | ⚠️ Hebrew slugs | `/lawyers/עוד-מאיה-רוטנברג/` — violates slug normalization plan |
| WhatsApp links | ⚠️ Fake numbers | All WhatsApp links use `972545551234`-style fake numbers |
| Photos | ❌ Missing | No lawyer photos visible (placeholder avatars expected) |
| "Herzliya" in English | ⚠️ Bug | Tamar Goldstein's city shows "Herzliya" in Latin, not "הרצליה" |

> [!WARNING]
> **All 10 lawyers are fictional seed data being served as if they're real published profiles.** This is a credibility and potentially legal risk.

### 2.3 Articles Archive (`/articles/`)

| Element | Status | Detail |
|---------|--------|--------|
| Breadcrumbs | ✅ Working | עמוד הבית → מאמרים משפטיים |
| Page subtitle | ✅ Good | "ספריית מאמרים משפטיים" with guidance copy |
| Category pills | ✅ Visible | 35+ practice-area pill filters with counts |
| Article cards | ✅ Working | Cards with title, excerpt, category tag, CTA |
| Article count | ✅ ~800+ | Massive content library visible |
| Pagination | ✅ Working | Page numbers visible |
| Mixed content types | ⚠️ Issue | Articles page shows mix of guides, court rulings, Corona updates, government bulletins |
| Duplicate categories | 🔴 Critical | "דיני נזיקין" appears TWICE — once with count 1, once with count 21. Different URLs. |

### 2.4 404 Page (Code Review)

| Element | Status | Detail |
|---------|--------|--------|
| H1 | ✅ Hebrew | "העמוד לא נמצא" |
| Body text | ⚠️ English | "The page you requested could not be found…" — **should be Hebrew** |
| Search form | ✅ Present | Legal search form template included |
| Back-home CTA | ✅ Present | "חזרה לעמוד הבית" |

### 2.5 Search Page (Code Review)

| Element | Status | Detail |
|---------|--------|--------|
| H1 | ⚠️ English | "Search results for:" — **should be Hebrew** |
| Pagination text | ⚠️ English | "Previous" / "Next" — **should be Hebrew** |

---

## 3. REST API Findings

### 3.1 Post Types Registered (20 total!)

| CPT Slug | Name | Has Archive | Status |
|----------|------|-------------|--------|
| `post` | פוסטים | No | Active (legacy) |
| `page` | עמודים | No | Active |
| `articles` | Articles | **Yes** | ✅ Core — primary content type |
| `justice_lawyer` | עורכי דין | **Yes** | ✅ Core — lawyer directory |
| `justice_lead` | לידים | No | ✅ Core — CRM |
| `labor_law` | דיני עבודה | No | ⚠️ Legacy CPT |
| `small_claims` | תביעות קטנות | No | ⚠️ Legacy CPT |
| `corona_virus` | משבר הקורונה | No | ⚠️ Legacy CPT |
| `supreme_court` | בית המשפט העליון | No | ⚠️ Legacy CPT |
| `tort` | torts | No | ⚠️ Legacy CPT |
| `goverment-gazette` | goverment-gazette | No | ⚠️ Legacy CPT (typo: "goverment") |
| `yada_wiki` | Wiki Pages | Yes | ⚠️ Third-party plugin CPT |

> [!CAUTION]
> **7 legacy CPTs** are registered alongside the 3 core CPTs. These are leftover from the old blog architecture. They create REST API surface area, potential SEO confusion, and admin clutter. Content inside them is NOT accessible through the new theme templates.

### 3.2 Taxonomies Registered (8 total)

| Taxonomy | Applied To | Status |
|----------|-----------|--------|
| `category` | post, labor_law, small_claims, corona_virus, supreme_court, articles | Active |
| `post_tag` | post, labor_law, small_claims, corona_virus, supreme_court, articles | Active |
| `practice-areas` | articles, post | ✅ Core |
| `city` | **lawyer**, justice_lawyer | ✅ Core — but applies to both old `lawyer` AND new `justice_lawyer` |
| `wiki_cats` | yada_wiki | ⚠️ Third-party |
| `wiki_tags` | yada_wiki | ⚠️ Third-party |

> [!IMPORTANT]
> The `city` taxonomy lists `lawyer` (old) AND `justice_lawyer` (new) — indicating an **old lawyer CPT** still exists at the database level from a previous plugin.

### 3.3 API Content Check

- **`/wp-json/wp/v2/posts?per_page=5`** → Returns `[]` — **ZERO standard posts**
- All content lives in the `articles` CPT (confirmed via site rendering)
- Standard `post` type is registered but empty

---

## 4. Critical Issues (Prioritized)

### 🔴 P0 — Must Fix Before Any Public Marketing

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| 1 | **Fictional lawyers shown as real** | Legal/credibility risk | /lawyers/ + homepage |
| 2 | **Duplicate taxonomy names** | SEO cannibalization | "דיני נזיקין" appears 2x with different counts/URLs |
| 3 | **English text on Hebrew pages** | UX inconsistency | 404.php body, search.php H1, search pagination |
| 4 | **"Archive" in OG description** | Poor social sharing | /lawyers/ page meta |
| 5 | **Hebrew URL slugs for lawyers** | Breaks sharing, violates slug-normalization plan | /lawyers/עוד-.../ |

### 🟡 P1 — High Priority

| # | Issue | Impact | Location |
|---|-------|--------|----------|
| 6 | **7 legacy CPTs active** | API bloat, admin confusion, potential indexing | REST API /types |
| 7 | **No filter bar on /lawyers/** | Users can't filter by area/city | archive-justice_lawyer.php |
| 8 | **No logo image** | Reduces brand trust | Header (text-only) |
| 9 | **"Herzliya" in English** | Inconsistent language | Lawyer card for Tamar Goldstein |
| 10 | **Category page links use `http://`** | Mixed content risk, redirect overhead | Homepage practice-areas grid |
| 11 | **Profile views tracked on page load** | Performance issue (write on every GET) | single-justice_lawyer.php:35 |
| 12 | **`?page_id=42` in menu** | Non-pretty URLs for contact/about | Header menu |

---

## 5. Taxonomy Fragmentation Analysis

The articles archive reveals **35+ practice-area categories**. Many overlap:

| Duplicate Group | Entries | Problem |
|----------------|---------|---------|
| דיני נזיקין | 2 entries (1 vs 21 articles) | Different URLs, same name |
| ירושות/צוואות | "ירושות וצוואות" + "ענייני ירושה" + "צוואות" | 3 separate terms for one topic |
| נזיקין | "דיני נזיקין" + "עו"ד נזיקין פסקי דין" + "נזיקין" + "פיצויים" | 4+ terms |
| משפט פלילי | "משפט פלילי" + "פלילי פסקי דין חשובים" + "עורך דין פלילי פסקי דין 2022" | 3 overlapping |

> [!WARNING]
> This fragmentation creates **keyword cannibalization** where multiple thin taxonomy pages compete for the same search queries. Must be consolidated before SEO push.

---

## 6. URL Strategy vs Reality

| Expected (per slug-normalization-rules.md) | Actual on Live Site |
|---|---|
| `/lawyers/maya-rotenberg/` | `/lawyers/עוד-מאיה-רוטנברג/` |
| `/practice-areas/family-law/` | `/family-law/` (old WP category) |
| `/practice-areas/criminal-law/` | `/criminal-law/` (old WP category) |
| Pretty URLs for contact | `/?page_id=42` |
| Pretty URLs for about | `/?page_id=315` |

The new `practice-areas/` prefix structure from justice-core IS deployed for some terms (environmental-law, insurance-law, blockchain-crypto) but **most practice areas still use old bare-slug WP category URLs** from the legacy blog era.

---

## 7. Content Quality Assessment

### Strengths
- **Volume:** ~800+ articles — massive content library
- **Diversity:** Family law, criminal, traffic, real estate, labor, torts, cyber, tax
- **Fresh content at top:** Recent 2026 articles about rabbinical agreements and family law
- **Professional excerpts:** Well-written Hebrew legal content

### Weaknesses
- **Stale bulk:** Many articles are from 2020 (Corona emergency regulations) — outdated and irrelevant
- **Court rulings mixed with guides:** No visual distinction between a how-to guide and a raw court ruling
- **No author attribution:** Articles appear as site-authored, not lawyer-authored — misses E-E-A-T signal
- **No featured images visible:** Article cards lack thumbnails

---

## 8. Code Architecture Assessment

### Strengths
- **Modular include system** — `inc/` files cleanly separated (seo, schema, breadcrumbs, enqueue, etc.)
- **Layered CSS** — main → premium-pass-2 → premium-pass-3 → components → accessibility → rtl
- **Schema.org** — Article, WebSite, BreadcrumbList JSON-LD all implemented
- **SEO title overrides** — Dynamic title generation per page type with keyword targeting
- **OG tags** — Present on homepage and singulars
- **Accessibility** — Toolbar present, skip-to-content link, ARIA labels

### Weaknesses
- **6 CSS files loaded** — No minification/concatenation pipeline
- **Profile view counter on page load** — DB write on every GET request
- **Mixed protocol links** — Some homepage links use `http://` not `https://`
- **Inline styles** — taxonomy-practice-areas.php has inline CSS that should be in stylesheet
- **No caching headers** — No evidence of object caching or page caching strategy

---

## 9. SEO Technical Snapshot

| Signal | Status |
|--------|--------|
| `<title>` tag | ✅ Dynamic, keyword-optimized |
| Meta description | ✅ Present on homepage + singulars + taxonomy |
| OG tags | ✅ Present (og:title, og:description, og:type, og:url, og:locale) |
| Canonical tags | ❓ Not verified (would need HTML source) |
| JSON-LD Schema | ✅ WebSite + Article + BreadcrumbList |
| hreflang | ❌ Missing (should declare `he` for Hebrew) |
| robots.txt | ❓ Not checked |
| XML sitemap | ❓ Not checked |
| Mobile viewport | ✅ (assumed via responsive CSS) |
| Page speed | ⚠️ 6 CSS files + Google Fonts external load |
| Hebrew URL slugs | ⚠️ Present for lawyers — needs migration |
| Mixed http/https links | ⚠️ Some practice-area links use http:// |

---

## 10. Recommended Action Sequence (No Code Yet)

### Phase 1: Data Integrity (Week 1)
1. **Unpublish or clearly mark** all 10 seed lawyers as demo/draft
2. **Fix English text** in 404.php, search.php (3 strings)
3. **Fix "Archive"** in OG description for /lawyers/
4. **Fix "Herzliya"** → "הרצליה" in seed data
5. **Create pretty permalinks** for Contact and About pages

### Phase 2: Taxonomy Cleanup (Week 2)
6. **Merge duplicate categories** — דיני נזיקין consolidation
7. **Define canonical taxonomy tree** — max 15-20 top-level practice areas
8. **Redirect merged terms** via 301

### Phase 3: Legacy Cleanup (Week 2-3)
9. **Deregister 7 legacy CPTs** (labor_law, small_claims, corona_virus, supreme_court, tort, goverment-gazette, yada_wiki)
10. **Migrate content** from legacy CPTs to `articles` CPT with proper practice-area tagging

### Phase 4: SEO Hardening (Week 3)
11. **Add hreflang** `he` tag
12. **Implement English slug migration** per slug-normalization-rules.md
13. **Add canonical tags** if not present
14. **Minify/concatenate CSS** (34KB + 21KB + 11KB = 66KB unminified)

### Phase 5: Launch Prep (Week 4)
15. **Upload real logo** (vector SVG preferred)
16. **Seed first 10 real lawyers** with verification
17. **Add filter dropdowns** to /lawyers/ archive
18. **Remove Corona-era content** or archive to a dated section

---

## 11. What's Actually Working Well

To be fair and honest:

1. ✅ The **menu system is fully populated** with practice-area dropdown
2. ✅ The **homepage is content-rich** with 12+ sections
3. ✅ The **article library is massive** (~800+ articles)
4. ✅ The **footer is professional** with legal disclaimers, contact, and navigation
5. ✅ The **lead capture system** is architecturally ready (form + CPT + routing)
6. ✅ The **accessibility toolbar** is functional
7. ✅ The **SEO infrastructure** (titles, meta, schema, OG) is production-grade
8. ✅ The **breadcrumbs** work correctly on inner pages
9. ✅ The **LegalTech tools section** is forward-looking and differentiated
10. ✅ The **Lawyer CTA section** clearly explains the value proposition for attorneys

---

*This report is analysis-only. No code was changed. Ready for implementation phase on your signal.*
