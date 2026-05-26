# Article Duplicate CTA Guard - 2026-05-26

Status: PASS

Scope: local template/CSS safety check for the owner-reported mobile article issue where the same help/request CTA could appear twice. This does not publish CMS content, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, leads, payments or public database rows.

## Results

| Check | Status | Evidence | Next Step |
| --- | --- | --- | --- |
| unique_sidebar_guard | PASS | Template defines a unique-content sidebar guard. | Keep sidebar rendering behind unique connected lawyer, cluster nav or admin status content. |
| sidebar_render_guard | PASS | Aside is rendered only when sidebar has unique content. | Do not render duplicate-only article CTA sidebars. |
| duplicate_sidebar_text_removed | PASS | Contextual CTA text render count in single-articles.php: 1. | Expected count is 1: the main after-article CTA only. |
| no_sidebar_duplicate_class_in_template | PASS | Duplicate sidebar CTA class should not be emitted by the template. | Keep no-lawyer sidebars focused on unique cluster/admin content only. |
| no_sidebar_layout_class | PASS | No-sidebar article layout is centered when duplicate-only sidebar is suppressed. | Keep the single-column layout override in the last-loaded public CSS file. |
| deployment_marker | PASS | justice-theme-deployment-marker=2026-05-26-article-duplicate-cta-guard-v1 | expected-github-main-commit=article-duplicate-cta-guard-v1 | purpose=single-article-mobile-duplicate-help-cta-guard | After uPress pull, verify live marker matches article-duplicate-cta-guard-v1. |

## Interpretation

- The article keeps one contextual after-content CTA.
- The sidebar now renders only when it has unique content such as a connected lawyer, family-law cluster navigation, or editor-only status.
- If the sidebar would only repeat the same request/help text, it is suppressed at PHP render time instead of relying on mobile CSS.
