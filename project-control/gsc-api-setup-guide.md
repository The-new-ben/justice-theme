# GSC API Setup Guide — Jus-Tice
**Created:** 2026-05-12  
**Purpose:** Practical, step-by-step guide to connect Google Search Console API

---

## Why This Matters

Without GSC data, every content decision is a guess. With it, we can:
- See which pages actually drive traffic (and protect them)
- Find cannibalization (multiple pages ranking for same query)
- Find quick wins (pages at position 5-20 that just need a push)
- Verify our changes worked after migration

---

## Option A: Manual Export (Fastest — 15 minutes)

If API setup feels too complex, a manual export gets us 80% of the value.

### Steps:
1. Go to https://search.google.com/search-console
2. Select `jus-tice.co.il` property
3. Click **Performance** in the left sidebar
4. Set date range to **Last 12 months**
5. Click **Pages** tab → Click **Export** (top right) → Download CSV
6. Click **Queries** tab → Click **Export** → Download CSV
7. Click the **+New** filter → Page → containing `/family-law/` → Export
8. Repeat filter for `/criminal-law/`, `/real-estate/`, etc.
9. Go to **Settings** → **Crawl stats** → screenshot or note
10. Go to **Index** → **Pages** → Export the coverage report

Save all CSVs to: `c:\Users\pro\justice\reports\gsc\`

**That's it. This gives us enough data to start safely.**

---

## Option B: API Setup (More Powerful — 30-45 minutes first time)

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click **Select Project** → **New Project**
3. Name: `jus-tice-seo`
4. Click **Create**

### Step 2: Enable Search Console API

1. In the GCP console, go to **APIs & Services** → **Library**
2. Search for: `Google Search Console API`
3. Click **Enable**

### Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **Service Account**
3. Name: `jus-tice-gsc-reader`
4. Role: none needed (GSC access is granted separately)
5. Click **Done**
6. Click the service account email → **Keys** tab → **Add Key** → **Create new key** → **JSON**
7. Download the JSON file
8. Save it to: `c:\Users\pro\justice\credentials\gsc-service-account.json`

> ⚠️ **NEVER commit this file to Git.** Add `credentials/` to `.gitignore`.

### Step 4: Grant Access in Search Console

1. Go to https://search.google.com/search-console
2. Select `jus-tice.co.il`
3. Click **Settings** (gear icon) → **Users and permissions**
4. Click **Add user**
5. Paste the service account email (from Step 3, looks like: `jus-tice-gsc-reader@jus-tice-seo.iam.gserviceaccount.com`)
6. Permission: **Full** (or **Restricted** for read-only)
7. Click **Add**

### Step 5: Install Python Dependencies

```powershell
cd c:\Users\pro\justice
python -m pip install google-auth google-auth-oauthlib google-api-python-client pandas
```

### Step 6: Run Export Script

Once I create the script (after you confirm access), run:

```powershell
cd c:\Users\pro\justice
python scripts/gsc-export.py
```

This will output:
- `reports/gsc/performance-12m.csv` — all queries + pages, last 12 months
- `reports/gsc/cannibalization-report.csv` — queries ranking for 2+ pages
- `reports/gsc/family-law-performance.csv` — family law cluster specific data
- `reports/gsc/quick-wins.csv` — pages at position 5-20 with high impressions

---

## What Data We Get

| Report | Columns | Rows (estimate) |
|--------|---------|-----------------|
| Performance (12 months) | query, page, clicks, impressions, ctr, position | 5,000-50,000 |
| Cannibalization | query, page_count, pages_list, total_clicks | 100-500 |
| Quick wins | page, query, impressions, position, clicks | 50-200 |
| Index coverage | url, status, reason | 1,200+ |

---

## My Recommendation

**Start with Option A (manual export) tomorrow.** It takes 15 minutes and gives us enough data to safely start the Family Law cluster.

If you want ongoing automated access (recommended for Phase 2+), do Option B after the first manual export.

---

## Checklist

- [ ] Verify `jus-tice.co.il` property exists in GSC
- [ ] Export Performance CSV (last 12 months, by Pages)
- [ ] Export Performance CSV (last 12 months, by Queries)
- [ ] Export Index Coverage report
- [ ] Save all CSVs to `c:\Users\pro\justice\reports\gsc\`
- [ ] (Optional) Set up API via Option B steps above
