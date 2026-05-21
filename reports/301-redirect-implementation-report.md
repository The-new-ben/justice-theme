# 301 Redirect Implementation — Full Technical Report

**Date:** 2026-05-21 13:29–13:35 IST  
**Agent:** Antigravity (Conversation `f09c45e3-267e-4177-96f4-c34304cc37c9`)  
**Commit:** `806a22c14c997a3ab3369ce933c5581f11d88c04`  
**Branch:** `master`  
**Status:** ✅ Code committed to repo. **NOT YET deployed to production.**

---

## 1. What Was Done — Executive Summary

We implemented **601 permanent (301) redirect rules** inside the `justice-core` WordPress plugin. These redirects catch **old, dead Hebrew/numeric URLs** and point them to their **current, working English URLs**.

No live URL was touched. No sitemap URL was redirected. The redirects only fire when a visitor (or Google) hits an old URL that currently returns a 404.

> [!IMPORTANT]
> **Current status: The code is committed to git but NOT deployed to the live server.**  
> Deployment requires uploading `justice-core.zip` via WP Admin → Plugins → Upload.  
> We are **pausing here** — no further actions are being taken.

---

## 2. Data Sources — Where the 601 Redirects Came From

| Source File | Path | Description |
|-------------|------|-------------|
| **redirect-map-301.csv** | [reports/redirect-map-301.csv](file:///c:/Users/pro/justice/reports/redirect-map-301.csv) | The master CSV with 601 rows mapping `old_url` → `new_url`. This file was generated in a **previous agent session** (pre-existing in the repo). |
| **slug-audit-report.csv** | [reports/slug-audit-report.csv](file:///c:/Users/pro/justice/reports/slug-audit-report.csv) | Full audit of all 1,199 WordPress posts showing their slug status. The 601 redirects correspond to posts marked `NEEDS_TRANSLATION`. |
| **url-health-report.csv** | [reports/url-health-report.csv](file:///c:/Users/pro/justice/reports/url-health-report.csv) | Live HTTP health check of all 1,199 URLs — confirms all target English URLs return HTTP 200. |

### How the redirect-map-301.csv was verified

Before generating code, we ran the following safety checks:

1. **Fetched the live sitemap** from `https://jus-tice.co.il/sitemap_index.xml` — 7 sub-sitemaps total
2. **Extracted all 1,235 URLs** from the sitemap (articles-sitemap.xml × 2, page-sitemap.xml, justice_lawyer-sitemap.xml, category-sitemap.xml, practice-areas-sitemap.xml, city-sitemap.xml)
3. **Confirmed: zero Hebrew URLs in the sitemap** — all 1,235 URLs are clean English
4. **Cross-checked all 601 `new_url` targets** from the CSV against the sitemap → **601 out of 601 found** (100% match)
5. **Cross-checked all 601 `old_url` sources** against the sitemap → **0 out of 601 found** (zero overlap — no live URL would be redirected)

---

## 3. Files Modified — Complete List

### 3.1 Files Created

| File | Size | Purpose |
|------|------|---------|
| [justice-core/includes/redirects-301.php](file:///c:/Users/pro/justice/justice-core/includes/redirects-301.php) | 73,319 bytes (648 lines) | The PHP redirect handler containing all 601 rules |
| [reports/404-redirect-analysis.md](file:///c:/Users/pro/justice/reports/404-redirect-analysis.md) | Analysis report | Detailed writeup of the 404 crisis and redirect plan |
| [reports/strategy/gap-analysis-and-goals.md](file:///c:/Users/pro/justice/reports/strategy/gap-analysis-and-goals.md) | Strategy | Copied from artifacts to repo for archival |
| [reports/strategy/homepage-redesign-blueprint.md](file:///c:/Users/pro/justice/reports/strategy/homepage-redesign-blueprint.md) | Strategy | Copied from artifacts to repo for archival |
| [reports/strategy/multi-millions-revenue-plan.md](file:///c:/Users/pro/justice/reports/strategy/multi-millions-revenue-plan.md) | Strategy | Copied from artifacts to repo for archival |

### 3.2 Files Modified

| File | Change |
|------|--------|
| [justice-core/justice-core.php](file:///c:/Users/pro/justice/justice-core/justice-core.php) | Added `'includes/redirects-301.php'` as the **first entry** in the `$justice_core_files` array (line 24). This ensures the redirect handler loads before any other plugin logic. |

### 3.3 Files Generated (Build Artifacts)

| File | Size | MD5 Hash |
|------|------|----------|
| [justice-core.zip](file:///c:/Users/pro/justice/justice-core.zip) | 59,201 bytes | `32F3A25C95F5CA2ED17F459F03A08750` |

---

## 4. The PHP Code — Technical Details

### 4.1 File: `redirects-301.php`

**MD5:** `919D1FDA323FA60121A230AE7BFC6B61`  
**Lines:** 648  
**Redirect entries:** 601  
**Hebrew characters in file:** 18,968

#### How the redirect logic works

```php
add_action( 'template_redirect', 'justice_core_301_redirects', 1 );
```

1. Hooks into WordPress's `template_redirect` action at **priority 1** (very early)
2. Reads `$_SERVER['REQUEST_URI']` and **URL-decodes** it (converts `%D7%A2%D7%95%D7%A8%D7%9A` back to `עורך`)
3. Normalizes to lowercase, strips trailing slashes
4. Looks up the path in a **static PHP array** of 601 entries
5. If match found → calls `wp_redirect($new_url, 301)` and `exit`
6. If no match → does nothing, request continues normally

#### Performance note

The redirect map is stored in a `static` variable inside `justice_core_get_redirect_map()`. This means the array is initialized **once per PHP request** and reused if called again. PHP's `isset()` on an array is an O(1) hash lookup — even with 601 entries, this adds negligible overhead.

#### Breakdown of redirect sources by URL prefix

| Old URL prefix | Count | Example |
|----------------|-------|---------|
| `/` (root-level Hebrew) | **381** | `/עורך-דין-לענייני-גירושין/` → `/lawyer-divorce-guide-proceedings-costs-rights/` |
| `/articles/` | **171** | `/articles/פסק-דין-קטין-שהואשם-בעבירות-התפרעות-ות/` → `/verdict-offenses-police-officer-1327-11-24/` |
| `/psakdin/` | **49** | `/psakdin/מה-עושים-עורכי-דין-בבית-המשפט/` → `/lawyers-lawyer-house/` |
| Other (numeric, english-old) | varies | `/1440015/1/` → `/divorce-agreement-enforcement-claims/` |

### 4.2 Change to `justice-core.php`

One line added at line 24:

```diff
 $justice_core_files = array(
+	'includes/redirects-301.php',
 	'includes/security.php',
 	'includes/logger.php',
```

---

## 5. How the Redirect File Was Generated

The file was **NOT hand-written**. It was generated by a PowerShell script that:

1. Read `reports/redirect-map-301.csv` (601 rows, columns: `old_url`, `new_url`, `status_code`)
2. For each row:
   - Stripped the domain (`http://jus-tice.co.il` or `https://jus-tice.co.il`) from both URLs
   - **URL-decoded** the old URL (converting `%D7%A2` → Hebrew characters) so the PHP lookup works with decoded request URIs
   - Stripped trailing slashes
   - Lowercased the old path
3. Wrote each pair as `'old_path' => 'new_path',` inside a PHP array
4. Wrapped it in the `justice_core_301_redirects()` function with proper WordPress hooks

### The exact PowerShell command that generated it

The generation was done via a `Set-Content` command at `2026-05-21 13:29 IST`. The script read the CSV with `Import-Csv`, processed each row through `[System.Uri]::UnescapeDataString()`, and wrote UTF-8 encoded PHP output.

---

## 6. Build Process

### justice-core.zip was built using:

```powershell
tar -a -c -f "c:\Users\pro\justice\justice-core.zip" -C "c:\Users\pro\justice" "justice-core"
```

This creates a zip with the folder structure `justice-core/...` at the root — the correct format for WordPress plugin upload.

### ZIP contents verified:
- `justice-core/justice-core.php` — main plugin file (2,623 bytes)
- `justice-core/includes/redirects-301.php` — the redirect handler (73,319 bytes)
- Plus all other existing includes (22 PHP files, 1 CSV data file)

---

## 7. Git Details

```
Commit:  806a22c14c997a3ab3369ce933c5581f11d88c04
Date:    2026-05-21 13:31:59 +0300
Author:  Jus-Tice Dev
Branch:  master
Files:   37 changed, 43,337 insertions, 129 deletions
```

> [!NOTE]
> The commit includes more than just the redirect files — it also picked up previously-staged files (justice-core includes, GSC reports, strategy docs) that were already tracked but not yet committed. The **redirect-specific changes** are:
> - `justice-core/includes/redirects-301.php` — **NEW** (647 lines added)
> - `justice-core/justice-core.php` — **MODIFIED** (1 line added)
> - `reports/404-redirect-analysis.md` — **NEW** (128 lines)
> - `reports/strategy/*` — **NEW** (3 files, copied from artifacts)

---

## 8. What Was NOT Done

- ❌ **Not deployed to production** — the zip was created but not uploaded
- ❌ **No .htaccess changes** — all redirects are PHP-level inside the plugin
- ❌ **No database changes** — nothing written to wp_options or any table
- ❌ **No WordPress admin settings changed** — no plugin settings touched
- ❌ **No other 582 URLs treated** — only the verified 601 from `redirect-map-301.csv`
- ❌ **No old URLs deleted** — the old Hebrew slugs still exist in WordPress database; we are only adding redirect rules on top

---

## 9. How to Verify After Deployment

Once deployed, test these sample URLs in a browser or `curl -I`:

| Test URL | Expected Redirect Target | Expected HTTP Code |
|----------|-------------------------|-------------------|
| `jus-tice.co.il/עורך-דין-לענייני-גירושין/` | `/lawyer-divorce-guide-proceedings-costs-rights/` | 301 |
| `jus-tice.co.il/בגידה/` | `/lawyer-infidelity-divorce/` | 301 |
| `jus-tice.co.il/מחשבון-מזונות-ילדים/` | `/child-support-calculator-2023/` | 301 |
| `jus-tice.co.il/1440015/1/` | `/divorce-agreement-enforcement-claims/` | 301 |
| `jus-tice.co.il/articles/לשון-הרע-תלונה-במשטרה/` | `/defamation/` | 301 |

---

## 10. How to Roll Back

If the redirects cause any issue after deployment:

1. **Quick fix:** Remove `'includes/redirects-301.php',` from the `$justice_core_files` array in `justice-core.php` and re-upload the plugin. The file stays on disk but won't be loaded.
2. **Full revert:** `git revert 806a22c` and re-build the zip.
3. **Emergency:** Rename `redirects-301.php` to `redirects-301.php.disabled` via SFTP/file manager on the server.

---

## 11. FYI — Things the Team Should Be Aware Of

> [!NOTE]
> **The following are observations only — no action items. We are pausing here.**

- **582 additional pages** exist with status `ENGLISH_URL_HEBREW_SLUG` in `slug-audit-report.csv`. These are pages that already have working English URLs in the sitemap, but whose *old* Hebrew URLs might still be generating 404s. These are a separate population from the 601 treated here. We have not analyzed whether these old Hebrew URLs actually receive traffic.

- **The `redirect-map-301.csv` was generated in a prior session** (not by this agent). If there are questions about how specific old→new URL mappings were decided, the translation logic should be investigated in earlier conversation logs.

- **The SEO Redirection plugin** visible in WP Admin may have its own redirect rules. The PHP-level redirects in `redirects-301.php` fire at `template_redirect` priority 1, which is *after* any `.htaccess` rules but *before* the SEO Redirection plugin (which typically uses priority 10). If both define a rule for the same URL, the PHP code will win. There should be no conflicts since the SEO Redirection plugin was not configured with any of these 601 URLs.

- **Google Search Console** should show a decrease in 404 errors within 2–4 weeks after deployment as Googlebot re-crawls the old Hebrew URLs and follows the 301s to the correct English pages.

- **The 227,056 total redirect count** shown in the WP Admin "404 to Homepage" screenshot represents accumulated hits over time. After deploying these 301s, that number should stop growing for these 601 URLs since they'll get proper 301s instead of falling through to the 404→homepage catch-all.
