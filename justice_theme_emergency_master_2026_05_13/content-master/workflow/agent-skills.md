# Jus-Tice Agent Skills & Workflows
**Version**: 2.0 — 2026-05-15
**Purpose**: Reusable skills, patterns, and step-by-step procedures for operating the jus-tice.co.il legal portal.

---

## Skill 1: WordPress REST API Operations

### Read Articles by Taxonomy
```powershell
$creds = Get-Content "tools\gsc\wp-app-password.json" | ConvertFrom-Json
$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("benbatash:$($creds.app_password)"))
$h = @{ "Authorization" = "Basic $b64" }
$articles = Invoke-RestMethod -Uri "https://jus-tice.co.il/wp-json/wp/v2/articles?practice-areas=170&per_page=100&_fields=id,slug,title,status" -Headers $h
```

### Assign Taxonomy Term to Articles (Batch)
```powershell
# Add practice-areas term 170 to a list of article IDs
$articleIds = @(19304, 19302, 19300)
foreach ($id in $articleIds) {
  $body = @{ "practice-areas" = @(170) } | ConvertTo-Json -Compress
  Invoke-RestMethod -Uri "https://jus-tice.co.il/wp-json/wp/v2/articles/${id}" -Headers $h -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
}
```

### Rename Taxonomy Terms (Name only, preserve slug/ID)
```powershell
# Rename city term to Hebrew (slug stays English for URL preservation)
$body = @{ name = "חיפה" } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "https://jus-tice.co.il/wp-json/wp/v2/city/702" -Headers $h -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

### Check Lawyer Profiles
```powershell
$lawyers = Invoke-RestMethod -Uri "https://jus-tice.co.il/wp-json/wp/v2/justice_lawyer?per_page=50&_fields=id,slug,title,status,practice-areas,city,featured_media" -Headers $h
```

---

## Skill 2: Yoast SEO Configuration

### Programmatic Yoast Config via Theme
Yoast stores settings in `wp_options`:
- **`wpseo_titles`**: Title/description templates, indexation rules
- **`wpseo`**: General settings (separator, breadcrumbs)

Key patterns:
```php
// Meta description template for articles CPT
$options['metadesc-articles'] = '%%title%% - %%excerpt%%';
// Taxonomy archive description
$options['metadesc-tax-practice-areas'] = '%%term_title%% - מדריכים ועורכי דין';
// Noindex tags
$options['noindex-tax-post_tag'] = true;
// Disable author archives
$options['disable-author'] = true;
```

### Trigger Yoast Config via REST
```powershell
Invoke-RestMethod -Uri "https://jus-tice.co.il/wp-json/justice/v1/seed-yoast-config" -Headers $h -Method Post
```

### Yoast Snippet Variables (most useful)
| Variable | Output |
|----------|--------|
| `%%title%%` | Post/page title |
| `%%excerpt%%` | Post excerpt (auto-generated if empty) |
| `%%term_title%%` | Taxonomy term name |
| `%%sitename%%` | Site name |
| `%%sep%%` | Separator (configured as pipe) |
| `%%page%%` | Page number (pagination) |
| `%%primary_category%%` | Primary category name |

---

## Skill 3: Sitemap Management

### Architecture
- `.xml` files are 301-redirected by uPress nginx — CANNOT use traditional sitemaps
- REST API sitemap: `GET /wp-json/justice/v1/sitemap` (sitemapindex format)
- Sub-sitemaps: `/sitemap/articles`, `/sitemap/pages`, `/sitemap/lawyers`, `/sitemap/taxonomies`
- `X-Robots-Tag` stripped via `rest_post_dispatch` hook
- robots.txt filter at `PHP_INT_MAX` priority

### Verify Sitemap Health
```powershell
$r = Invoke-WebRequest -Uri "https://jus-tice.co.il/wp-json/justice/v1/sitemap" -TimeoutSec 10
echo "Status: $($r.StatusCode) | X-Robots: $($r.Headers['X-Robots-Tag'] ?? 'NONE')"
echo "sitemapindex: $($r.Content -match 'sitemapindex')"
```

---

## Skill 4: Deployment Workflow

### Standard Deploy Cycle
1. Edit code locally in `justice-theme/`
2. `git status` — review diff
3. `git add <files>` — stage only intended changes
4. `git commit -m "type: description"` — clear commit message
5. `git push origin main` — push to GitHub
6. **OWNER ACTION**: Pull in uPress (theme file manager → Git → Pull)
7. Verify: check deployment marker on live site

### Verify Deploy Landed
```powershell
$r = Invoke-WebRequest -Uri "https://jus-tice.co.il/" -TimeoutSec 15
if ($r.Content -match 'justice-deployment-marker.*?content="([^"]+)"') { echo $Matches[1] }
```

### After Deploy Checklist
- [ ] Flush permalinks (Settings → Permalinks → Save)
- [ ] Clear SG Optimizer cache
- [ ] Clear any CDN cache
- [ ] Verify deployment marker matches commit

---

## Skill 5: Taxonomy Term Management

### Safety Rules (from taxonomy-governance.yaml)
- NEVER delete terms without owner approval
- NEVER change slugs (breaks URLs)
- Renaming display name is SAFE (preserves slug, ID, assignments)
- Adding taxonomy-to-object-type associations is SAFE (additive)
- `inc/taxonomy-seed.php` is the safety net — always additive, idempotent

### Common Operations
| Operation | Safe? | Method |
|-----------|-------|--------|
| Rename term display name | ✅ | REST API PUT/POST |
| Add term to article | ✅ | REST API PUT article |
| Create new child term | ✅ | REST API POST |
| Delete term | ❌ OWNER ONLY | - |
| Change term slug | ❌ OWNER ONLY | Breaks URLs |
| Merge terms | ❌ OWNER ONLY | Requires redirect plan |

---

## Skill 6: GSC Data Pull

### Run GSC Pull
```powershell
cd justice-theme/tools/gsc
node gsc-pull.js
# First run: opens browser for OAuth login (use mistabrajustice@gmail.com)
# Subsequent: auto-refreshes token
# Output: justice-theme/reports/gsc/
```

### Key GSC Reports
| File | Content |
|------|---------|
| `gsc_striking_distance.csv` | Positions 5-20 — fastest wins |
| `gsc_cannibalization_map.csv` | Multiple pages ranking for same query |
| `gsc_low_ctr_opportunities.csv` | Good position, low CTR = title/desc fix |
| `gsc_traffic_drop_analysis.csv` | Pages losing traffic — protect |

---

## Skill 7: Practice Area Cluster Workflow

### YAML Execution Pattern
Reference: `workflow/practice-area-seo-workflow.yaml`

For each practice area cluster:
1. **Data verification** → Pull all articles, terms, GSC data
2. **Competitor analysis** → SERP patterns, content gaps
3. **Trust cleanup** → Fix canonical/HTTPS/meta issues
4. **Pillar decision** → Select pillar URL, review hub page
5. **Sub-practice mapping** → Map keywords to existing/new pages
6. **Guide mapping** → FAQ/procedure content opportunities
7. **Anti-cannibalization** → Resolve competing URLs
8. **Internal linking** → Hub→pillar→spokes bidirectional
9. **Journeys** → User, Googlebot, AI bot paths verified
10. **Technical SEO** → Title/desc/H1/schema/canonical
11. **E-E-A-T** → Disclaimer, sources, author, dates
12. **Business alignment** → Lawyer profiles, CTAs, monetization
13. **Authority plan** → Backlinks, directories, GBP
14. **Exit review** → All layers pass before next cluster

### Hard Stop Rules
- Never skip exit review
- Never start next cluster while current is incomplete
- Never mass-redirect or mass-delete
- Always document status in `{cluster}/{practice}-workflow-status.md`

---

## Skill 8: Lawyer Profile Management

### Current Profiles
| Name | ID | Practice Area | City | Image |
|------|----|--------------|------|-------|
| Sharon Nahari | 19309 | Criminal Law (170) | Tel Aviv (700), Bnei Brak (721) | ❌ Missing |
| Maya Rothenberg | 19130 | Family Law (68) | Tel Aviv (700) | ❌ Missing |

### Profile Image Rules (`lawyer-profile-image-system.md`)
- No fake/AI-generated photos of real lawyers
- No invented identities
- Professional placeholder OR owner-approved real photo only
- Consistent crop/dimensions
- Correct alt text: "עו"ד [שם] - [תחום]"

### Future Architecture Notes
- Lawyers can have multiple sub-expertise areas within a practice area
- Lawyers can be in multiple cities
- Future: lawyer self-registration + subscription plans
- Schema: `@type: Attorney` with `knowsAbout` and `areaServed`

---

## Skill 9: Page Audit Checklist

### Quick Page Health Check
```powershell
$r = Invoke-WebRequest -Uri "https://jus-tice.co.il/PAGE_URL" -TimeoutSec 15
# Canonical count (should be 1)
([regex]::Matches($r.Content, 'rel="canonical"')).Count
# Description count (should be 1)
([regex]::Matches($r.Content, 'name="description"')).Count
# JSON-LD count
([regex]::Matches($r.Content, 'application/ld\+json')).Count
# H1
if ($r.Content -match '<h1[^>]*>([^<]+)</h1>') { $Matches[1] }
```

### SEO Signal Checklist
- [ ] Single canonical tag
- [ ] Meta description present
- [ ] Single H1, matches page topic
- [ ] JSON-LD schema (Article, BreadcrumbList, FAQPage as needed)
- [ ] Breadcrumbs visible and correct
- [ ] Internal links to pillar/hub
- [ ] Mobile-responsive layout
- [ ] HTTPS (no mixed content)
- [ ] Legal disclaimer present
- [ ] Last updated date visible
