# 404 / Redirect Rescue Plan
Date: 2026-05-20
Status: ACTIVE SEO RESCUE WORKFLOW

## Plain Answer

Do not redirect every 404 to the homepage.

The right rule is:

- spam, casino, fake URLs: keep 404, or use 410 only after confirmation;
- old real pages with a close replacement: exact 301 to the replacement;
- old pages with search traffic but no replacement: rebuild the page or redirect to the closest matching hub after review;
- old pages with no traffic, no links and no useful replacement: leave 404;
- internal broken links: fix the link source.

## Live Finding This Cycle

`tools/check-404-routing.ps1` was run against the live site on 2026-05-20.

Result:

- PASS: random fake URL returns HTTP 404, not homepage 301.
- PASS: invalid post query returns HTTP 404.
- PASS: homepage returns HTTP 200.
- PASS: `/articles/` returns HTTP 200.
- PASS: `/lawyers/` returns HTTP 200.
- PASS: `robots.txt` advertises `sitemap_index.xml`.
- PASS: `sitemap_index.xml` returns XML.

Meaning: the old "all 404s redirect to homepage" failure appears fixed. The remaining problem is likely missing exact 301 redirects for real legacy URLs, plus spam/noise URLs that should stay 404.

## GSC Access Status

The local GSC tool exists at `tools/gsc/gsc-pull.js`.

Current blocker:

- this machine did not have `tools/gsc/gsc-token.json`;
- `npm install` was run in `tools/gsc`;
- the read-only GSC pull opened a Google OAuth URL and is waiting for login approval on `localhost:3333`.

Important: the Search Analytics API gives performance rows, but the Page Indexing "Not found (404)" list often needs a GSC UI export. If the API path does not expose the exact 404 list, use the manual export below.

## What I Need From The Owner If OAuth Does Not Complete

Open Google Search Console:

1. Property: `jus-tice.co.il`
2. Left menu: `Indexing` -> `Pages`
3. Open the issue: `Not found (404)`
4. Click `Export`
5. Export CSV or Google Sheet
6. Put the file in the repo or send it in the thread

Optional but useful from Analytics:

1. GA4 -> Reports
2. Filter pages where title contains `Page not found` or path is a 404 URL
3. Export page paths for the last 28 days

## Tool Added

Created:

- `tools/triage-404-urls.mjs`

Usage:

```bash
node tools/triage-404-urls.mjs path/to/404-export.csv --live --out project-control/404-triage-2026-05-20.csv
```

What it does:

- reads GSC/GA4 exports;
- detects URL/path columns automatically;
- checks existing planned redirects from `project-control/redirect-map.csv`;
- checks generated slug redirects from `inc/url-redirects.php`;
- checks local GSC performance history where available;
- optionally live-checks source and target HTTP status;
- classifies every URL into a safe action bucket.

## Triage Buckets

### 1. `spam_or_casino_noise`

Action: leave 404, or use 410 after confirming it is indexed spam.

Do not redirect to homepage. Do not redirect to real legal pages. That teaches Google the spam URL has a destination.

### 2. `planned_redirect_candidate`

Action: review and execute an exact 301 only if the target is truly relevant and returns 200.

### 3. `known_slug_redirect_candidate`

Action: verify the existing generated redirect works. If it does not, add an exact rule.

### 4. `articles_prefix_candidate`

Action: verify `/articles/{slug}/` should go to `/{slug}/`, then 301.

### 5. `old_case_or_numeric_url`

Action: inspect old inventory first. These may be case-law pages. Do not blind-redirect to a broad category.

### 6. `search_visible_unknown`

Action: if it has clicks or impressions, rebuild or find the closest topical destination.

### 7. `unknown_low_evidence`

Action: leave 404 unless GSC links, Analytics visits or internal links show value.

## Why This Matters For Money

Bad 404 handling loses two kinds of money:

1. Users hit dead pages and leave instead of calling or submitting a lead.
2. Google wastes crawl attention on broken legacy URLs instead of the money pages.

The repair path is not "more redirects". It is "correct redirects for valuable old demand".

## Next Action

Finish GSC OAuth or get the Page Indexing -> Not found (404) export from the owner, then run:

```bash
node tools/triage-404-urls.mjs <export.csv> --live --out project-control/404-triage-live-2026-05-20.csv
```

After the report exists, implement only the approved exact 301 rules in a separate code PR and pull to uPress.
