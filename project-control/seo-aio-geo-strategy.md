# SEO + AIO + GEO Strategy

**Date:** 2026-05-10
**Audience:** Editor, content team, dev.
**Goal:** Make Jus-Tice the canonical Israeli legal portal in both Google search AND AI-powered answer engines (ChatGPT search, Perplexity, Google AI Overviews).

---

## 1. Three layers of optimization

| Layer | What it optimizes for | Primary surface |
|---|---|---|
| **SEO** (traditional) | Crawl, index, rank in 10 blue links | Googlebot |
| **GEO** (Generative Engine Optimization) | Citation in AI overviews, ChatGPT answers, Perplexity sources | LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) |
| **AIO** (AI search Optimization) | Surface in AI-generated SERP modules — answer boxes, featured snippets, People Also Ask | Hybrid — Google's AI features pull from organic SERP data |

The three overlap. Strong organic content with clean structure satisfies all three.

---

## 2. SEO foundations

### 2.1 Technical SEO checklist

| Item | Status | Where |
|---|---|---|
| Meta description on every page | ✅ Done — front-page only | `inc/seo.php` `justice_theme_meta_head()` |
| OG tags (title, description, type, image, locale) | ✅ Partial — front + singular | `inc/seo.php` |
| Canonical tag emitted | ✅ Done | `inc/seo.php` `justice_theme_canonical_url()` |
| Robots noindex for thin URLs (search, combinatorial filters) | ✅ Done | `inc/seo.php` `justice_theme_robots_meta()` |
| XML sitemap | ❌ NOT DONE — install Yoast/RankMath/AIOSEO | NOT VERIFIED |
| robots.txt allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) | ❌ NOT VERIFIED | needs server check |
| HTTPS forced | ❌ NOT VERIFIED | needs server check |
| Mobile-friendly (responsive, viewport meta) | ✅ Done | `header.php` viewport meta + responsive CSS |
| Page speed (LCP, CLS, INP) | ❌ NOT VERIFIED — needs PageSpeed test on live | BLOCKED on live URL |
| H1 unique per page | ✅ Done | template review confirmed |
| Hreflang (he-IL primary) | ❌ NOT NEEDED — single language site |
| Schema.org WebSite | ✅ Done | `inc/schema.php` |
| Schema.org Article | ✅ Done | `inc/schema.php` |
| Schema.org BreadcrumbList | ✅ Done | `inc/schema.php` |
| Schema.org Attorney | ✅ Done — added this session | `inc/schema.php` `justice_theme_attorney_schema()` |
| Schema.org LegalService | ✅ Done — added this session | `inc/schema.php` `justice_theme_legalservice_schema()` |
| Schema.org FAQPage on pillar pages | ❌ NOT DONE — pillar PAGES don't exist yet |

### 2.2 On-page SEO rules

For every public page:

1. **Title tag** ≤60 chars, contains primary keyword, contains "Jus-Tice" or brand suffix
2. **Meta description** 140–160 chars, includes primary keyword + secondary keyword + CTA
3. **H1** matches user intent (Hebrew). One H1 per page. NEVER duplicate H1 with navigation.
4. **H2** structures the page into scannable sections. Use 4–8 H2s on pillar pages.
5. **Alt text** on every meaningful image (not just decorative SVG icons)
6. **Internal links** 3–8 per page minimum, descriptive anchor text
7. **Word count**: pillar PAGE 1500–3000 words; supporting PAGE 800–1500; article 800–2000

---

## 3. GEO (Generative Engine Optimization)

LLM crawlers favor content that:

| Pattern | Example |
|---|---|
| **Direct answer at the top** | First paragraph of every article: "X means Y. Y is governed by Z law and applies when..." |
| **Definitional sections** | `<h2>מהו X?</h2>` followed by 1-paragraph definition |
| **Step-by-step lists** | Ordered lists for "how to" content |
| **Comparison tables** | Comparing options, costs, alternatives — LLMs cite tables verbatim |
| **FAQs at the bottom** | Each Q is the kind of question a user might ask the model |
| **Citations to authoritative sources** | Israel Law Books, Knesset.gov.il, supreme court rulings on `psakdin.co.il`, official Bar Association resources — link to .gov.il where possible |
| **Updated dates visible** | "Last updated: <date>" in the article header — LLMs prefer recent content |
| **Author + reviewer named** | E-E-A-T: author has bio, reviewer is a real licensed lawyer |
| **Structured data** | FAQPage, HowTo, LegalService, Attorney — all mapped to JSON-LD |

### 3.1 Required article structure (template)

```markdown
# Hebrew title (H1)
**עודכן: <date> | מאת: <author> | נסקר על ידי: <reviewer-lawyer>**

## TL;DR (תקציר)
2-3 sentence direct answer.

## הגדרה — מהו X?
Definitional paragraph. ≤120 words.

## איך זה עובד? (תהליך)
Numbered steps.

## טבלת השוואה (when relevant)
| Option | Cost | Time | Best for |

## מה אומר החוק?
Law citations. Link to Knesset.gov.il / official sources.

## שאלות נפוצות (FAQ)
**שאלה 1:** ...
**תשובה:** ...
(emit as Schema.org FAQPage)

## הצעדים הבאים
CTA: contact lawyer / read related guide.

## מקורות
List of cited sources.
```

### 3.2 robots.txt for AI crawlers (NOT VERIFIED — needs deployment)

Recommended `robots.txt`:
```
User-agent: *
Allow: /

# Allow AI training and answer engines (default WP robots.txt blocks none)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Block resource-heavy paths
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://jus-tice.co.il/sitemap.xml
```

Owner action: ensure WP isn't blocking AI crawlers via "Discourage search engines" setting; deploy this `robots.txt` via the SEO plugin.

---

## 4. YMYL / E-E-A-T compliance

Legal content is Your Money or Your Life (YMYL). Google's quality raters apply maximum scrutiny.

### 4.1 Required pages

| Page | Why | Status |
|---|---|---|
| `/about/` — corporate identity | Trust signal | NOT VERIFIED |
| `/editorial-policy/` — how content is reviewed | Trust signal | NOT VERIFIED |
| `/advertising-disclosure/` — paid placements disclosed | Israeli Bar advertising rules | NOT VERIFIED |
| `/privacy/` — data handling policy | GDPR-equivalent + Israeli Privacy Protection Law | NOT VERIFIED |
| `/terms/` — terms of use | Legal protection | NOT VERIFIED |
| `/contact/` — physical address, phone, email | Trust + business legitimacy | NOT VERIFIED |

### 4.2 Per-article requirements

| Element | Why |
|---|---|
| Author byline with credentials | Real human author, named |
| Reviewer byline (a licensed Israeli lawyer) | Expert review for legal accuracy |
| Last updated date | Freshness signal |
| Inline citations to sources | Verifiable claims |
| "אינו מהווה ייעוץ משפטי" disclaimer | Protect site + user |
| Schema.org Article with author + reviewer | Machine-readable expertise |

### 4.3 Per-lawyer-profile requirements

| Element | Why |
|---|---|
| Bar number visible | Verifiability — anyone can check at lsb.org.il |
| `verification_status` set + visible | Honest signaling |
| Source of profile data documented (`source_type`) | Distinguishes user-claimed vs. seeded vs. imported |
| "פרופיל ממומן" badge if paid | Israeli Bar advertising disclosure |
| NEVER claim "best lawyer", "top lawyer", "recommended" | False superlatives violate Bar rules + Google policy |

---

## 5. AIO (AI search modules)

Google's AI Overviews and SGE pull from organic SERP. To surface:

1. **Be the citation source** — if your guide on `/police-investigation/` is well-structured, AI Overviews will pull from you.
2. **Use definition + steps + FAQ** — that's the format AI parses best.
3. **Mark up with FAQPage schema** — directly powers People Also Ask.
4. **Updated content wins** — AI Overviews favor recent dates.
5. **Long-tail wins** — AI Overviews trigger more on long-tail queries; pillar pages should target broad keywords, supporting PAGES should target long-tails.

---

## 6. Content cadence

| Phase | Months | Content output |
|---|---|---|
| 0 | now | Build 8 pillar PAGES + 30 supporting PAGES (foundation) |
| 1 | 1–2 | 2 articles/week × 8 weeks = 16 articles. Distribute across clusters by SERP gap. |
| 2 | 3–6 | 2 articles/week + 1 city × area combo PAGE/month |
| 3 | 6–12 | 1 article/week + lawyer-authored guides (E-E-A-T uplift) |

---

## 7. KPIs (track in `current-status.md`)

| KPI | Source | Target month 3 | Target month 6 |
|---|---|---|---|
| Indexed pages | GSC Coverage report | 60+ | 200+ |
| Avg position for top 20 money keywords | GSC Performance | <30 | <15 |
| Clicks/month | GSC Performance | 500+ | 5,000+ |
| Lawyer profiles published | WP admin | 30+ | 150+ |
| Verified lawyer profiles | WP admin | 5+ | 50+ |
| Leads/month from form | `justice_lead` CPT count | 20+ | 100+ |
| Citations in AI overviews | Manual SERP check on top 10 keywords | 1+ | 5+ |

---

## 8. What we are NOT doing

| Anti-pattern | Reason |
|---|---|
| AI-generated articles published unedited | YMYL + E-E-A-T disaster |
| Buying backlinks | Google penalty + Israeli Bar issue |
| "Top 10 lawyers in Tel Aviv" listicles | False authority + Bar rules |
| Hidden text / cloaking | Penalty |
| Doorway pages (e.g., `/lawyers-tel-aviv/`, `/lawyers-jerusalem/`) before we have actual lawyer data | Thin content penalty |
| Fake reviews / fake testimonials | Trust killer + legally risky |
