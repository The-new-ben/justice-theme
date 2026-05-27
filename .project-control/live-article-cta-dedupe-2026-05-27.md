# Live Article CTA Dedupe Verification - 2026-05-27

Status: PASS

Scope: read-only live verification for the owner-reported mobile article problem where the same help/request CTA could appear twice while scrolling. This does not publish CMS content, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyers, suppliers, payments, email, WhatsApp or database rows.

## Results

| URL | Status | HTTP | Lead CTA Count | Contextual CTA URL Count | Duplicate Sidebar Count | No-Sidebar Layout | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt | PASS | 200 |  |  |  |  | justice-theme-deployment-marker=2026-05-27-connected-lawyer-article-cta-dedupe-v1 | expected-github-main-commit=connected-lawyer-article-cta-dedupe-v1 | purpose=single-article-connected-lawyer-sidebar-cta-dedupe |
| https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/ | PASS | 200 | 1 | 1 | 0 | yes | article_layout=true; sidebar_lead_cards=0; contextual_cta_urls=1; no_sidebar_layout=true |
| https://jus-tice.co.il/most-recommended-family-lawyer/ | PASS | 200 | 1 | 1 | 0 | yes | article_layout=true; sidebar_lead_cards=0; contextual_cta_urls=1; no_sidebar_layout=true |
| https://jus-tice.co.il/experienced-family-law-attorney/ | PASS | 200 | 1 | 1 | 0 | yes | article_layout=true; sidebar_lead_cards=0; contextual_cta_urls=1; no_sidebar_layout=true |
| https://jus-tice.co.il/domestic-violence/ | PASS | 200 | 1 | 1 | 0 | yes | article_layout=true; sidebar_lead_cards=0; contextual_cta_urls=1; no_sidebar_layout=true |
| https://jus-tice.co.il/rabbinical-agreement-approval/ | PASS | 200 | 1 | 1 | 0 | yes | article_layout=true; sidebar_lead_cards=0; contextual_cta_urls=1; no_sidebar_layout=true |

## Review Note

- The sampled live article renders one after-content CTA at most.
- The sampled live article exposes the contextual article lead URL once at most, so connected-lawyer sidebars do not repeat it.
- The duplicate sidebar CTA class is not present on the sampled live article.
- The sampled article set includes the lawyer-selection guide and family-law article pages, and uses the no-sidebar layout when there is no unique sidebar content.
- This is a template-level UX fix, not a new content page, so it creates no SEO cannibalization by itself.
