# Skill: Practice Area Content Creation

> Repeatable playbook for creating SEO-optimized legal content on jus-tice.co.il.
> First validated on Criminal Law cluster (May 2026).

## Prerequisites

- WP credentials loaded from `tools/gsc/wp-app-password.json`
- REST API endpoint: `https://jus-tice.co.il/wp-json/wp/v2/articles`
- Practice-area taxonomy term ID known (e.g., Criminal Law = 170)
- Pillar article identified (e.g., Criminal Law pillar = ID 857)

## Step 1: Research & Gap Analysis

```
1. Web-search target keyword in Hebrew + English
2. Check competitors on Semrush/web search for:
   - Content structure (H1, H2, H3 hierarchy)
   - Word count (target: 1.5x competitor average)
   - Internal linking patterns
   - E-E-A-T signals (sources, disclaimers, author info)
3. Check existing articles via REST API:
   GET /wp-json/wp/v2/articles?search={keyword}&per_page=10
4. Verify no slug conflict:
   GET /wp-json/wp/v2/articles?slug={target-slug}&per_page=1
```

## Step 2: Content Template

Every article MUST include:

```html
<h1>{Primary Keyword} | {Benefit phrase} — {Secondary keywords}</h1>

<!-- Opening paragraph: define term, why it matters, link to pillar -->
<p><strong>{keyword}</strong> is... <a href="/criminal-defense-attorney/">עורך דין פלילי</a></p>

<!-- Disclaimer -->
<p>המידע בעמוד זה הוא כללי ואינו מהווה ייעוץ משפטי...</p>

<!-- Core content: 5-8 H2 sections -->
<h2>Section 1 - Definition</h2>
<h2>Section 2 - Legal basis (cite specific laws)</h2>
<h2>Section 3 - Process/Steps (numbered)</h2>
<h2>Section 4 - Rights</h2>
<h2>Section 5 - Practical guidance</h2>

<!-- Data table (penalties, comparisons, timelines) -->
<table>...</table>

<!-- FAQ section: 4-6 questions -->
<h2>שאלות נפוצות (FAQ)</h2>
<h3>Question 1?</h3><p>Answer</p>

<!-- Sources -->
<h2>מקורות</h2>
<ul>
  <li><a href="https://www.nevo.co.il/..." target="_blank" rel="noopener">Law name — Nevo</a></li>
  <li><a href="https://www.gov.il/..." target="_blank" rel="noopener">Gov source</a></li>
</ul>

<!-- Disclaimer footer -->
<hr />
<p style="font-size:0.9em;color:#888;"><strong>גילוי נאות:</strong> ...</p>

<!-- Related content hub -->
<p><strong>תוכן קשור:</strong></p>
<ul>
  <li><a href="/criminal-defense-attorney/">Pillar link</a></li>
  <li><a href="/articles/{related-slug}/">Related article 1</a></li>
  <!-- 4-6 related articles -->
</ul>
```

## Step 3: Publish via REST API

```powershell
$body = @{
  title = "Hebrew title | secondary"
  content = $htmlContent
  status = "publish"
  slug = "english-slug"
  "practice-areas" = @(TERM_ID)
} | ConvertTo-Json -Depth 5

$r = Invoke-RestMethod -Uri "https://jus-tice.co.il/wp-json/wp/v2/articles" `
  -Method POST -Headers $h `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 30
```

## Step 4: Cross-Link from Pillar

```powershell
# Get pillar raw content
$pillar = Invoke-RestMethod -Uri ".../articles/PILLAR_ID?context=edit" -Headers $h
$raw = $pillar.content.raw

# Find hub nav section and insert new link
$newLink = '<li><a href="/articles/{slug}/">{Title}</a> – {description}</li>'
# Insert before closing </ul> in hub nav

# Update pillar
$body = @{ content = $updatedRaw } | ConvertTo-Json
Invoke-RestMethod -Uri ".../articles/PILLAR_ID" -Method POST -Headers $h -Body $body
```

## Step 5: Verify

```powershell
# Verify article is live
Invoke-WebRequest -Uri "https://jus-tice.co.il/articles/{slug}/" -TimeoutSec 10

# Verify hub shows article
$hub = Invoke-WebRequest -Uri "https://jus-tice.co.il/{practice-area-slug}/"
$hub.Content -match '{slug}'  # Should be True

# Check article count on hub increased
```

## E-E-A-T Checklist

- [ ] Cite specific Israeli law sections (חוק העונשין, חוק סדר הדין הפלילי)
- [ ] Link to official sources (nevo.co.il, gov.il, knesset.gov.il)
- [ ] Include disclaimer: "המידע בעמוד זה הוא כללי ואינו מהווה ייעוץ משפטי"
- [ ] Include "עודכן לאחרונה" date
- [ ] Link to pillar (עורך דין פלילי) in opening paragraph
- [ ] FAQ section with 4-6 questions
- [ ] Related content links (4-6 spoke articles)
- [ ] Data table (penalties, comparisons, or process steps)
- [ ] Internal links to 3+ other articles

## Quality Gates

| Gate | Minimum | Ideal |
|------|---------|-------|
| Content length | 5,000 chars | 8,000+ chars |
| H2 sections | 4 | 6-8 |
| Internal links | 5 | 10+ |
| FAQ questions | 3 | 5-6 |
| Official sources | 1 | 2-3 |
| Data tables | 0 | 1-2 |

## Articles Created (Criminal Law)

| Date | Slug | ID | Chars | Keyword | Vol/mo |
|------|------|----|-------|---------|--------|
| 2026-05-14 | criminal-indictment | 19311 | 11,060 | כתב אישום | 1,900 |
| 2026-05-14 | pre-indictment-hearing | 19312 | 6,824 | שימוע לפני כתב אישום | 90 |
| 2026-05-14 | sex-offenses | 19313 | 7,000 | עבירות מין | 720 |
