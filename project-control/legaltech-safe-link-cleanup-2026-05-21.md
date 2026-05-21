# LegalTech Safe Link Cleanup - 2026-05-21

## Why This Moved Next

The homepage now exposes the LegalTech/product layer, but the live `/legal-tools/` archive route is still not verified as a real public destination. Sending users or Google to a route that simply redirects home weakens the product funnel and creates low-signal internal links.

## Research Insight

Google Search Central says internal links help Google and users understand what pages are about, and crawlable links should point to meaningful destinations. Google also warns that missing-file traffic should not simply be redirected to the homepage, because that can become a soft-404 style signal instead of a useful replacement.

Sources:
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/blog/2005/09/verifying-your-site-trouble-with-404
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

## What Changed

- Updated the fallback header menu so "Legal tools" uses `justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' )` instead of a raw archive URL.
- Updated the single LegalTech tool template so the "All tools" button also falls back to the live homepage intake section until the archive is verified.
- Updated the legal pillar page template so `pillar_legaltech_url` meta is rendered only when the target is a published public tool/page. If the tool route is not live, the product CTA is hidden instead of linking into a homepage redirect.

## Verification

- `php -l template-parts/layout/site-header.php` passed.
- `php -l single-justice_legal_tool.php` passed.
- `php -l page-legal-pillar.php` passed.
- `git diff --check` passed with only the existing Windows line-ending warning.
- Pushed `07d052a Keep LegalTech archive links on safe fallback`.
- uPress Pull Git succeeded; the uPress log showed `07d052a` as `(HEAD -> main, origin/main, origin/HEAD)`.
- Live homepage smoke check returned 200, contained `legaltech-tools` and `AI Console`, had no page-level `noindex`, did not expose a direct `/legal-tools/` archive link, and still had the safe `#ask-lawyer` fallback.
- Live `/legal-tools/` still returns 301 to the homepage, confirming the archive should remain unpromoted until its route/CMS state is fixed later.

## Owner Impact

This is mostly invisible safety work. It protects future homepage, pillar and tool journeys from promoting a product archive before the CMS/tool route is truly live.

## Safety

Repo theme code/docs only. No public CMS database page edited, no product record created, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no lawyer/lead/prospect/order record created and no outreach sent.
