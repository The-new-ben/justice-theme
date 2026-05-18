# Favicon And Casino Spam Indexing Fix - 2026-05-18

Cycle time: 2026-05-18 18:28 Asia/Jerusalem

## Research basis

- Google Search Central says the homepage should expose a favicon with a supported `rel="icon"` or `rel="shortcut icon"` link, the favicon and homepage must be crawlable, the icon must be square, Google recommends larger than 48x48, and Google supports one favicon per hostname. Source: https://developers.google.com/search/docs/appearance/favicon-in-search
- Google Search Console Removals guidance says removed URLs can still appear in results temporarily, and the Removals tool can hide URLs from Search while permanent removal is handled by 404/410/noindex behavior. Source: https://support.google.com/webmasters/answer/9689846

## What was wrong

Live homepage head output had multiple conflicting icon sources:

- Theme hardcoded `favicon-gen.png`, which is the unwanted J mark.
- Plugin/admin icon output also exposed `/wp-content/uploads/fbrfg/...`.
- WordPress Site Icon output exposed `cropped-jus-tice-ai-2025...`, also the unwanted J mark.
- Root `/favicon.ico` and `/favicon.png` returned 404 before this fix.

This explains why Google could show the default globe or choose the wrong icon. Google supports one favicon per hostname, so competing icon stacks are risky.

## Implemented

- Removed the hardcoded J favicon links from `header.php`.
- Made `inc/seo.php` output one canonical Justice scales favicon set from theme assets:
  - `favicon-48.png`
  - `favicon-192.png`
  - `favicon-512.png`
  - `favicon.svg`
  - `favicon.ico`
  - `apple-touch-icon.png`
- Added public head cleanup to suppress conflicting plugin/admin favicon tags while preserving the canonical theme scales icon tags.
- Added `/favicon.ico` and `/favicon.png` root fallbacks through the theme so old/root favicon fetches do not 404.
- Combined the legacy scales logo asset with the Jus-Tice wordmark in the header/footer, while preserving the blinking red dot in the wordmark.
- Added a 410 + `X-Robots-Tag: noindex,nofollow` guard for deleted casino/gambling spam URL patterns left from the previous hacked content.
- Added `tools/check-live-favicon-and-spam-guard.mjs` to verify live deployment after uPress pull.
- Updated deployment marker to `2026-05-18-brand-favicon-spam-guard-v1`.

## Casino spam note

If deleted casino pages still show in Google after this deployment, that can be normal until Google recrawls or a Search Console Removals request is submitted. The code now helps permanent cleanup by returning 410 for matching spam paths. For faster hiding of specific search results, submit the exact spam URLs in Search Console Removals.

## Verification before deployment

- PHP lint passed for `header.php`, `functions.php`, `inc/seo.php`, `inc/spam-url-guards.php`, `template-parts/layout/site-header.php`, and `template-parts/layout/site-footer.php`.
- `node --check tools/check-live-favicon-and-spam-guard.mjs` passed.
- `git diff --check` passed.

## Post-deploy verification required

After uPress pulls this commit:

1. Run `node tools/check-live-favicon-and-spam-guard.mjs`.
2. Verify homepage head has only canonical `data-justice-theme="brand-icon"` favicon tags.
3. Verify `/favicon.ico` and `/favicon.png` return HTTP 200.
4. Verify known casino spam examples return HTTP 410 with `X-Robots-Tag: noindex,nofollow`.
5. Use Search Console URL Inspection on the homepage to request recrawl. The Google search favicon may still take time to refresh.

## Safety

This is a theme-level technical SEO/brand fix plus a deleted-spam URL guard. It does not edit public CMS database rows, article bodies, stored WordPress titles/H1/meta, slugs, taxonomy terms, sitemap settings, lawyer profiles, lead records, payment settings, GA4/GSC settings, wp-admin settings, or WordPress database values.
