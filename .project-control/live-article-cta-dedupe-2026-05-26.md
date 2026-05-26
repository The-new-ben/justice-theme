# Live Article CTA Dedupe Verification - 2026-05-26

Status: PASS

Scope: read-only live verification for the owner-reported mobile article problem where the same help/request CTA could appear twice while scrolling. This does not publish CMS content, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyers, suppliers, payments, email, WhatsApp or database rows.

## Results

| URL | Status | HTTP | Lead CTA Count | Duplicate Sidebar Count | No-Sidebar Layout | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| https://jus-tice.co.il/wp-content/themes/justice-theme/deployment-marker.txt | PASS | 200 |  |  |  | justice-theme-deployment-marker=2026-05-26-supplier-smart-match-admin-v1 | expected-github-main-commit=supplier-smart-match-admin-v1 | purpose=admin-supplier-smart-match-bid-readiness |
| https://jus-tice.co.il/find-lawyer-how-to-find-good-attorney/ | PASS | 200 | 1 | 0 | yes | article_layout=true; sidebar_lead_cards=0; no_sidebar_layout=true |

## Review Note

- The sampled live article renders one after-content CTA at most.
- The duplicate sidebar CTA class is not present on the sampled live article.
- The sampled article uses the no-sidebar layout when there is no unique sidebar content, which matches the intended fix.
- This is a template-level UX fix, not a new content page, so it creates no SEO cannibalization by itself.
