# About Page URL Check - 2026-05-27

## Owner report

Requested URL: `https://jus-tice.co.il/?page_id=315`

Expected public route: `https://jus-tice.co.il/about/`

## Before fix

- `https://jus-tice.co.il/?page_id=315` returned HTTP 404.
- The page title was `Page not found | Jus-Tice.co.il`.
- The page emitted `noindex, follow`.
- `https://jus-tice.co.il/about/` returned HTTP 200.
- The About route had title `אודות Jus-Tice | Jus-Tice`.
- The About route emitted canonical `https://jus-tice.co.il/about/`.

## Diagnosis

The About page itself was not down. The canonical `/about/` route worked. The broken URL was an old or stale WordPress numeric page URL (`page_id=315`) that no longer resolved to a live public page.

## Implemented code fix

Added a narrow legacy alias in `inc/trust-routes.php`:

- If the public request contains `page_id=315`, serve the existing About trust route.
- Keep the canonical signal on `/about/`.
- Do not create or edit a CMS page.
- Do not change sitemap, taxonomy, noindex rules, or stored redirects.
- Add response header `X-Justice-Route-Alias: page_id-315-about` for live verification.

## Skill / knowledge base

Created Codex skill:

`C:\Users\janana\.codex\skills\justice-url-site-route-checker`

Included:

- repeatable URL audit workflow,
- research reference file,
- live URL checking script,
- owner reporting standard.

The skill was validated successfully with the Codex skill validator.

## Sources used for the new skill

- Google Search technical requirements.
- Google Search Console URL Inspection help.
- Chrome Lighthouse overview.
- Web Vitals overview.
- W3C Link Checker documentation.
- WordPress `redirect_canonical()` reference.

## Safety statement

This code change fixes only the owner-reported old About page URL. It does not publish CMS content, edit public page content, create CRM leads, contact clients/lawyers, create invoices, charge payments, change redirects, change canonical rules, change noindex, change sitemap entries, or change taxonomies.

## Revenue relevance

This is not direct revenue. It is trust and site-quality repair: broken About/trust URLs reduce user confidence and SEO hygiene. Fixing this supports conversion but does not create a paying customer by itself.

Estimated readiness to profit after this fix: 58%.
