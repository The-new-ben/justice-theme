# Link Hygiene Check - About Page ID - 2026-05-28

Status: FIX_PUSHED_NOT_LIVE

Scope: read-only internal and live link hygiene check for legacy WordPress `?page_id=` URLs. No public CMS/database content, redirects, canonicals/noindex, sitemap, taxonomy, forms, leads, payments, or deployment settings were changed.

## Commands

```powershell
rg -n "page_id=315|\?page_id=|/about/|about\?" . -g "*.php" -g "*.js" -g "*.mjs" -g "*.css" -g "*.md" -g "*.json"
node scripts\check-link-hygiene.mjs
node scripts\check-link-hygiene.mjs --skip-live
```

## Result

- Runtime theme links found for About point to `/about/`, not `?page_id=315`.
- Live rendered HTML still exposes `https://jus-tice.co.il/?page_id=315` from a WordPress menu item titled `אודות`.
- The likely data source is a stored WordPress menu item, not the theme templates.
- A theme-side render-time normalizer was added in `inc/menu-seed.php` so menu links with `page_id=315` render as `/about/` without writing to the CMS menu, changing redirects, or changing canonicals.
- Deploy marker/version were bumped to `2026-05-28-menu-pageid-normalizer-v1` / `1.1.68`.
- The live checker is expected to remain blocked until the pushed theme change is deployed through uPress/Git pull.
- Source-only checker mode passes before deployment with `node scripts\check-link-hygiene.mjs --skip-live`.

## What This Means

The reported About URL is not being pushed by theme templates, but it is being pushed by live menu output. The canonical route is `/about/`; the ugly `?page_id=315` URL can still work as an old WordPress request, but internal navigation should keep users on `/about/`.

## Standard Added

`scripts/check-link-hygiene.mjs` now enforces:

- Internal runtime links should use canonical slugs such as `/about/`.
- Key live pages must not expose `?page_id=` links.
- Legacy `page_id` URLs may remain reachable with canonical signals unless the owner explicitly approves redirects.

## Still Not Fixed

- No redirect was added from `?page_id=315` to `/about/`; redirects/canonicals require explicit approval under the current operating rules.
- The render-time menu normalization is pushed but not confirmed live.
- The latest deployment marker `2026-05-28-menu-pageid-normalizer-v1` is not confirmed live.
- This does not produce customers, lawyers, invoices, payments, or CRM records.

## Honesty Statement

This is a trust/QA guard, not a revenue event. It prevents one visible UX problem from re-entering the site, but it does not replace the need for real deployment proof, payment proof, or customer/lawyer conversion.
