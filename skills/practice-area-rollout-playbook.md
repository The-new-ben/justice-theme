# Skill: Practice Area Rollout Playbook

> Master playbook for rolling out ANY new practice area on jus-tice.co.il.
> Validated on Criminal Law (May 2026). Apply to: Family Law, Tax, Medical Malpractice, Real Estate.

## Phase 1: Foundation (Day 1)

### 1.1 Create Taxonomy Term
```powershell
# Check if term exists
GET /wp-json/wp/v2/practice-areas?slug={area-slug}

# If not, create via WP Admin or REST (taxonomy must exist first)
```

### 1.2 Verify Taxonomy URL
```powershell
# Term should resolve to /{area-slug}/ (bare slug)
Invoke-WebRequest -Uri "https://jus-tice.co.il/{area-slug}/" -TimeoutSec 10
# Body class should contain: tax-practice-areas term-{slug} term-{ID}
```

### 1.3 Create Pillar Article
- Target: main keyword (e.g., "עורך דין פלילי", "עורך דין מיסים")
- Length: 15,000+ chars
- Must include hub navigation to all spoke articles
- Must include lawyer CTA
- Follow E-E-A-T template from content-creation skill

### 1.4 Assign Lawyers
```powershell
$body = @{ "practice-areas" = @(TERM_ID) } | ConvertTo-Json
Invoke-RestMethod -Uri ".../justice_lawyer/{LAWYER_ID}" -Method POST -Headers $h -Body $body
```

## Phase 2: Content Cluster (Days 2-5)

### 2.1 Keyword Research
```
1. Web search: {practice area} site:il keywords volume
2. Identify top 10 keywords by volume
3. Group into spoke articles (1 article per keyword cluster)
4. Prioritize by: volume × relevance ÷ difficulty
```

### 2.2 Create Spoke Articles (5-10 per area)
Use the content-creation skill for each article:
1. Research competitors
2. Write comprehensive content (5,000-11,000 chars)
3. Publish via REST API with practice-areas taxonomy
4. Cross-link from pillar hub navigation
5. Verify on hub page

### 2.3 Content Gap Tracking

| Priority | Keyword | Volume | Difficulty | Status |
|----------|---------|--------|-----------|--------|
| 1 | {main keyword} | X,XXX | XX | ☐ |
| 2 | {secondary} | XXX | XX | ☐ |
| ... | ... | ... | ... | ☐ |

## Phase 3: Verification (Day 5)

### 3.1 Journey Check
Test all URLs in the funnel:
1. Homepage → hub link visible
2. Hub page → articles listed, lawyers shown
3. Each article → loads, has internal links, FAQ, disclaimer
4. Lawyer profiles → practice area shown
5. Directory → filterable by practice area
6. Sitemap → includes all new URLs
7. robots.txt → references correct sitemap

### 3.2 Mobile Check
```
Browser subagent → open hub on mobile viewport (375×667)
Verify: readable, no horizontal scroll, CTA accessible
```

### 3.3 SEO Check
- H1 unique per page
- Meta description present (via Rank Math)
- Canonical URL correct
- No noindex on content pages
- Schema.org structured data (via Rank Math)

## Phase 4: GSC Submission (Day 5)

### Owner Actions Required
1. Go to Google Search Console
2. Navigate to Sitemaps
3. Submit: `sitemap_index.xml`
4. Request indexing for pillar + top 3 articles

## Criminal Law Progress Tracker

| Item | Status | Date | Notes |
|------|--------|------|-------|
| Taxonomy term (170) | ✅ | May 13 | `criminal-law` |
| Hub page `/criminal-law/` | ✅ | May 14 | 1,456 article cards |
| Pillar (ID 857) | ✅ | Pre-existing | 22,945 chars |
| Nahari lawyer assigned | ✅ | May 13 | Practice-areas: 170 |
| 301 redirect old URL | ✅ | May 14 | `/practice-areas/criminal-law/` → `/criminal-law/` |
| robots.txt → Rank Math | ✅ | May 14 | `sitemap_index.xml` |
| Article: criminal-indictment | ✅ | May 14 | ID 19311, 11,060 chars |
| Article: pre-indictment-hearing | ✅ | May 14 | ID 19312, 6,824 chars |
| Article: sex-offenses | ✅ | May 14 | ID 19313, 7,000 chars |
| Article: domestic-violence | ✅ | May 14 | ID 19315, 7,402 chars |
| Nahari profile photo | ☐ | — | Owner action |
| Mobile verification | ✅ | May 14 | Responsive, RTL correct, CTAs visible |
| GSC sitemap submission | ☐ | — | Owner action: submit sitemap_index.xml |
| Navigation menu update | ☐ | — | Later |

## Template for New Practice Areas

```
Practice Area: {Name}
Hebrew Name: {שם}
Taxonomy Term ID: {ID}
Slug: {slug}
Main Keyword: {keyword} ({volume}/mo, KD {difficulty})
Pillar Article ID: {ID}
Pillar URL: /{slug}-attorney/ or similar

Spoke Articles Planned:
1. {title} — {keyword} ({volume}/mo)
2. {title} — {keyword} ({volume}/mo)
...

Lawyers to Assign:
1. {Lawyer Name} — ID {X}
...
```

## Lessons Learned (Criminal Law)

1. **Taxonomy URLs use bare slugs** — not `/practice-areas/` prefix
2. **category_base collision** — WP core category_base can override taxonomy rewrites
3. **GSC rejects wp-json sitemaps** — use Rank Math's sitemap_index.xml
4. **Server cache** — always verify with cache-busted URLs
5. **uPress needs manual pull** — no auto-deploy from GitHub
6. **Rank Math handles Schema/OG** — don't duplicate in theme
7. **Articles CPT slug is `articles`** — REST base is `wp/v2/articles`
8. **UTF-8 encoding matters** — always use `[System.Text.Encoding]::UTF8.GetBytes($body)` for Hebrew
9. **pre_get_posts needed** — articles CPT doesn't show in taxonomy archives by default
10. **X-Robots-Tag noindex** — Rank Math adds `noindex` header to sitemaps by default; strip it with filter or GSC will reject
11. **Verify sitemap headers** — always check `X-Robots-Tag` before submitting to GSC; use `Invoke-WebRequest` and check `$r.Headers['X-Robots-Tag']`
