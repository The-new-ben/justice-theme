# uPress Git Pull Workflow

Date: 2026-05-11
Status: VERIFIED WORKFLOW / POST-PULL SEO OUTPUT PARTIAL

## Purpose

Document the browser-based uPress Git pull path for `jus-tice.co.il` so future
deployment checks do not depend on guesswork.

Do not store credentials in this file.

## Access Status

- uPress browser login: AVAILABLE with account login and 2FA/owner approval.
- File Manager path: AVAILABLE.
- Theme Git manager path: AVAILABLE at
  `wp-content/themes/justice-theme`.
- Git status action: VERIFIED.
- Git pull action: VERIFIED.
- Direct SSH/WP-CLI: NOT AVAILABLE in this session.
- Current Codex browser automation: NOT EXPOSED in the 2026-05-18 heartbeat
  session. If no browser/control tool is available, record the blocker and run
  `node tools/check-live-deployment.mjs` after the owner or another agent pulls.

## Verified Steps

1. Open uPress account.
2. Open `jus-tice.co.il`.
3. Open File Manager.
4. Navigate to `/wp-content/themes/justice-theme`.
5. Click `ניהול GIT`.
6. Wait until the Git panel loads.
7. Click `בדיקת סטטוס (Status)`.
8. Confirm working directory is clean.
9. Click `משיכת נתונים (Pull)`.
10. Open `צפיה ביומן פעילות (Log)`.
11. Confirm the top commit matches GitHub `main`.

## 2026-05-11 Pull Result

VERIFIED:

- uPress Git log top commit: `c992fd2`
- Commit title: `Document reviews compliance alias`
- Live static marker:
  `justice-theme-deployment-marker=2026-05-11-robots-sitemap-directive-v1`
- Homepage source marker includes:
  `2026-05-11-robots-sitemap-directive-v1`
- Homepage source still uses the WordPress/RealFaviconGenerator manifest and
  does not duplicate the theme fallback manifest.

## 2026-05-11 Second Pull Result

VERIFIED:

- uPress Git log top commit: `4c7b45e`
- Commit title: `Bypass Rank Math sitemap cache`
- Live static marker:
  `justice-theme-deployment-marker=2026-05-11-rankmath-sitemap-cache-bypass-v1`
- Rank Math child sitemap HTTP-loc blocker fixed in sampled public checks:
  - `page-sitemap.xml`: 0 HTTP / 11 HTTPS
  - `articles-sitemap1.xml`: 0 HTTP / 201 HTTPS
  - `articles-sitemap2.xml`: 0 HTTP / 200 HTTPS
  - `practice-areas-sitemap.xml`: 0 HTTP / 40 HTTPS
  - `category-sitemap.xml`: 0 HTTP / 16 HTTPS

## 2026-05-18 Pull Result

PARTIAL TOOLING BLOCKER / OWNER MANUAL PULL VERIFIED:

- GitHub `main` now includes commit `08a3844`
  (`Add lawyer growth analytics and journey checks`).
- GitHub `main` also includes later deployment/status commits through
  `c66d678`.
- The owner manually ran the uPress Git pull after Codex reported the blocker.
- Codex could not operate the uPress panel directly in this heartbeat session
  because the authenticated browser/control tool was not exposed to the active
  tool list. This was a tool availability issue, not a credential objection.
- Previous sessions did have browser/uPress control available, so future agents
  should try the browser/chrome tool again before declaring uPress blocked.

POST-PULL VERIFICATION:

- Run `node tools/check-live-deployment.mjs`.
- Expected result after successful uPress pull/cache generation:
  - analytics asset returns HTTP `200`;
  - homepage serves the analytics code directly or through an optimized
    Autoptimize JS file;
  - homepage still includes `justice-deployment-marker` and
    `justice-theme-version`.

CURRENT CHECK RESULT AFTER OWNER MANUAL PULL:

- `node tools/check-live-deployment.mjs` was rerun after owner manual pull.
- Result: PASS.
- Live analytics asset: HTTP `200`.
- Homepage analytics check: PASS via Autoptimize optimized script.
- Homepage deployment marker: present.

PARTIAL / NOT FIXED BY PULL:

- `https://jus-tice.co.il/robots.txt` returns HTTP 200 with zero-length body.
- Initial pull only: `https://jus-tice.co.il/articles-sitemap2.xml` still
  returned first-party `http://jus-tice.co.il` locs until the Rank Math sitemap
  cache-bypass patch was deployed.
- `https://jus-tice.co.il/sitemap_index.xml` returns valid XML and points to
  HTTPS child sitemap URLs.

## Interpretation

The Git deployment problem is now solved for this cycle.

The remaining robots/sitemap issues are not caused by stale theme files:

- Robots output is likely being served by a static/server/plugin layer before
  WordPress' dynamic `robots_txt` filter can append the sitemap directive.
- Rank Math sitemap child XML is likely cached or generated from plugin settings
  that still emit HTTP loc values. Rank Math official documentation notes that
  sitemap cache must be flushed after sitemap filter changes.

These are technical SEO follow-up tasks, not article-publication tasks.

## Next Safe Actions

1. Inspect uPress/webroot or WordPress SEO settings for the empty `robots.txt`
   output.
2. Clear Rank Math sitemap cache or resave Rank Math sitemap/permalink settings.
3. Recheck:
   - `https://jus-tice.co.il/robots.txt`
   - `https://jus-tice.co.il/sitemap_index.xml`
   - `https://jus-tice.co.il/articles-sitemap1.xml`
   - `https://jus-tice.co.il/articles-sitemap2.xml`
   - `https://jus-tice.co.il/page-sitemap.xml`
   - `https://jus-tice.co.il/practice-areas-sitemap.xml`
4. Do not add redirects, URL migrations, noindex rules, content rewrites or
   robots/htaccess changes until the approved migration plan is ready.

## Safety

No content body, URL, redirect, taxonomy term, canonical setting, lawyer profile,
lead/CRM record, review data, wp-admin content setting or database row was
changed by this workflow. The only live action was the requested Git pull.
