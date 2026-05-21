# 404 Redirect Crisis — Full Analysis Report
**Date:** 2026-05-21  
**Status:** ANALYSIS ONLY — No code changes made

---

## The Problem

Your WordPress "404 to Homepage" plugin shows **227,056 total redirects handled** and **11,559 unique broken URLs**. This means thousands of old URLs (mostly Hebrew-encoded) are hitting 404 and being silently sent to the homepage — destroying SEO equity and user experience.

## What I Found in the Repo

I scanned every relevant file in the repository. Here is what exists:

| File | What It Contains |
|------|-----------------|
| [slug-audit-report.csv](file:///c:/Users/pro/justice/reports/slug-audit-report.csv) | **1,199 posts** audited with their current slug status |
| [redirect-map-301.csv](file:///c:/Users/pro/justice/reports/redirect-map-301.csv) | **601 pre-built 301 redirect rules** (old Hebrew URL → new English URL) |
| [url-health-report.csv](file:///c:/Users/pro/justice/reports/url-health-report.csv) | Live HTTP status codes for all 1,199 URLs |
| [url-migration-map.csv](file:///c:/Users/pro/justice/project-control/url-migration-map.csv) | 9 example redirect rules (strategy document) |
| [slug-normalization-rules.md](file:///c:/Users/pro/justice/project-control/slug-normalization-rules.md) | Translation table for practice areas, cities, modifiers |
| [url-strategy.md](file:///c:/Users/pro/justice/project-control/url-strategy.md) | The strategic decision to translate Hebrew → English slugs |

---

## The 1,199 Pages — Broken Into 3 Categories

| Status | Count | What This Means |
|--------|-------|----------------|
| `ENGLISH_URL_HEBREW_SLUG` | **582** | WordPress slug is still Hebrew internally, but a new English URL was SET as the permalink. **These are the 404 danger zone.** |
| `NEEDS_TRANSLATION` | **601** | These pages still have their ORIGINAL Hebrew URLs (both slug and URL are Hebrew). **Redirects are pre-built in redirect-map-301.csv but NOT implemented.** |
| `ENGLISH_OK` | **16** | Both slug and URL are clean English. No action needed. |

---

## The Root Cause of the 404s

Here is exactly what happened:

```
BEFORE MIGRATION:
  URL: jus-tice.co.il/עורך-דין-לענייני-גירושין/
  WP Slug: עורך-דין-לענייני-גירושין
  Status: Working ✅

AFTER MIGRATION (what the code did):
  URL: jus-tice.co.il/lawyer-divorce-guide-proceedings-costs-rights/
  WP Slug: עורך-דין-לענייני-גירושין (STILL HEBREW!)
  Status: New URL works ✅, Old URL returns 404 ❌
```

**The migration changed the permalink to English but did NOT set up 301 redirects from the old Hebrew URLs to the new English URLs.** So anyone (Google, backlinks, bookmarks, WhatsApp shares) hitting the old Hebrew URL gets a 404.

---

## The Redirect Map Already Exists — But Was Never Deployed

> [!IMPORTANT]
> The file [redirect-map-301.csv](file:///c:/Users/pro/justice/reports/redirect-map-301.csv) contains **601 ready-to-deploy 301 redirect rules**. These are the `NEEDS_TRANSLATION` pages. Someone (likely a previous agent session) already built this map, but **it was never actually implemented in WordPress.**

### Sample from redirect-map-301.csv:

| Old URL (Hebrew) | New URL (English) |
|-------------------|-------------------|
| `/עורך-דין-לענייני-גירושין/` | `/lawyer-divorce-guide-proceedings-costs-rights/` |
| `/מחירון-שירותי-עורך-דין-נדלן/` | `/lawyer-price-list-real-estate-2025/` |
| `/המדריך-המלא-לצוואות/` | `/guide-complete-wills-updated-2025/` |
| `/הסכם-ממון-בישראל/` | `/prenuptial-agreement-israel-guide-comprehensive-2025/` |
| `/עורך-דין-פורקס-forex/` | `/lawyer-forex/` |
| `/סדר-דין-פלילי-חוק-המעצרים/` | `/criminal-law-review-procedure-law-detention-2025/` |

---

## The 582 `ENGLISH_URL_HEBREW_SLUG` Pages — The BIGGER Problem

These 582 pages are in a weird state:
- WordPress internally stores a Hebrew slug (e.g., `עורך-דין-גירושין-מומלץ-פתח-תקווה`)
- But the permalink resolves to an English URL (e.g., `/petah-tikva-divorce-lawyer/`)
- **The old Hebrew URL they USED to be at is now a 404**

> [!CAUTION]
> For these 582 pages, **we do NOT have a pre-built redirect map.** We need to generate one by mapping each page's decoded Hebrew slug back to its current English URL.

### Sample of what needs to happen for these 582:

| Old Hebrew URL (now 404) | Current English URL (working) | Redirect Needed |
|--------------------------|-------------------------------|----------------|
| `/עורך-דין-גירושין-מומלץ-פתח-תקווה-והמרכ/` | `/petah-tikva-divorce-lawyer/` | **301** |
| `/עורך-דין-עבירות-סמים-מדריך-2025-לעבירות-סמ/` | `/drug-offenses-criminal-lawyer/` | **301** |
| `/עלויות-גירושין-2025-מחירון-מעודכן-השוואה/` | `/divorce-costs-2025/` | **301** |
| `/מגמות-חדשות-בדיני-משפחה-השפעת-הבינה-המ/` | `/new-trends-ai-family-law/` | **301** |
| `/דירוג-עורכי-דין-בינה-מלאכותית-ai-שנת-2025/` | `/ai-lawyer-ranking/` | **301** |

---

## Summary: What Needs to Be Done

| Task | Count | Source | Status |
|------|-------|--------|--------|
| Deploy pre-built 301 redirects | **601** | `redirect-map-301.csv` | Map exists, NOT deployed |
| Generate + deploy 301 redirects for English-URL pages | **582** | `slug-audit-report.csv` (ENGLISH_URL_HEBREW_SLUG) | Map needs to be GENERATED from the CSV data |
| No action needed | **16** | `slug-audit-report.csv` (ENGLISH_OK) | Clean |
| **TOTAL** | **1,199** | | |

### Implementation Options (When You Give Permission to Code)

**Option A: WordPress Plugin (Recommended)**
Use the existing "SEO Redirection" or "Redirection" plugin in WP Admin to bulk-import the CSV. This is the safest approach because it handles regex, logging, and avoids `.htaccess` conflicts with uPress.

**Option B: PHP Code in justice-core**
Add a function to `justice-core/includes/` that hooks into `template_redirect`, checks the request URI against a lookup array generated from the CSV, and issues `wp_redirect($new_url, 301)`.

**Option C: .htaccess RewriteRules**  
Generate 1,183 `RewriteRule` entries. This is fast but fragile on uPress hosting and harder to maintain.

### My Recommendation

**Option A** is safest. The screenshot shows you already have "SEO Redirection" plugin installed. It supports CSV import. We can import both CSVs (the 601 existing + the 582 we generate) in one bulk operation.

### Before We Deploy — Critical Checks

1. **Verify the 601 redirect-map-301.csv entries are still accurate** — the new English URLs must return 200 (they do, per `url-health-report.csv`)
2. **Generate the missing 582 redirects** — I can build this map automatically from the `slug-audit-report.csv` by taking each page's decoded Hebrew slug and mapping it to its current English URL
3. **Check for redirect chains** — ensure no old URL redirects to another old URL that also redirects
4. **Test 10 redirects manually** after deployment to confirm they fire correctly

> [!WARNING]
> Every day without these 301s, Google is de-indexing the old Hebrew URLs and the SEO equity built on those pages is evaporating. The 227,056 redirect count in the screenshot confirms this is happening at massive scale right now.
