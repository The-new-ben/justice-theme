# Technical Review — Jus-Tice Repo & Architecture
## Date: 2026-05-10
## Phase: Analysis and Recommendation

---

## 1. Repository Structure

The `justice-theme` repository follows a standard WordPress theme hierarchy but incorporates a highly customized, modular approach to templates.

### Strengths
*   **Modular Template Parts:** Extensive use of `get_template_part()` for headers, footers, and cards (e.g., `template-parts/cards/lawyer-card.php`). This ensures DRY (Don't Repeat Yourself) principles.
*   **CSS Organization:** The progression of `premium-pass-1.css` to `premium-pass-3.css` shows a clear, layered approach to applying the new design language without destroying the base theme.
*   **JS Modularity:** `navigation.js` and `form-handler.js` are separated logically.
*   **Project Control:** The `project-control/` directory is an excellent pattern for maintaining architectural decisions alongside the code.

### Weaknesses / Risks
*   **Asset Management:** The CSS files are currently enqueued sequentially. For production, these should be compiled/minified into a single `style.min.css` to reduce HTTP requests.
*   **Plugin Dependency:** The theme heavily relies on `justice-core` (for CPTs). If `justice-core` is disabled, the theme will likely throw fatal errors when calling custom meta functions.
*   **Hardcoded Fallbacks:** While necessary for development, the PHP fallbacks (like the demo lawyer cards in `featured-lawyers.php`) mask data emptiness. They must be removed once real data is seeded.

## 2. Performance & Speed

*   **DOM Size:** The DOM is relatively clean. The use of semantic HTML5 (`<header>`, `<main>`, `<section>`) is good.
*   **Images:** Currently lacking real images. When images are added (lawyer headshots, hero backgrounds), they MUST be served via modern formats (WebP) with native lazy loading (`loading="lazy"`).
*   **Fonts:** Check font loading strategies. Using `font-display: swap` is critical for Core Web Vitals to avoid FOIT (Flash of Invisible Text).

## 3. RTL & Accessibility

*   **RTL Adherence:** The site is correctly built for RTL (Right-to-Left). CSS logical properties (e.g., `margin-inline-start`) should be preferred over hardcoded `margin-left`/`margin-right` where possible to ensure stability.
*   **Accessibility (a11y):**
    *   The accessibility toolbar plugin is present (seen in the DOM dump).
    *   Forms and inputs need explicit `<label>` tags.
    *   Contrast ratios on the new "Crimson" buttons and Navy backgrounds seem sufficient, but must be mathematically verified against WCAG AA standards.

## 4. API & Integration Readiness

*   **REST API:** The presence of custom endpoints (`/justice-core/v1/health` and `/justice-core/v1/seed-lawyers`) is a massive advantage. This allows for headless integrations (e.g., a React Native app for lawyers later) or easy integrations with Zapier/Make for lead routing.

## 5. Technical Recommendations

1.  **Minification Pipeline:** Implement a simple build step (e.g., npm scripts with `esbuild` or `lightningcss`) to bundle CSS/JS before deploying.
2.  **Robust Error Handling:** Wrap `justice-core` function calls in `function_exists()` checks within the theme to prevent white screens of death (WSOD) if the plugin is deactivated.
3.  **Caching Strategy:** Ensure the dynamic parts (lead forms, lawyer dashboards) are excluded from aggressive page caching (like WP Rocket), while static pages (articles) are heavily cached.

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **PERFORMANCE BUG: DB write on every lawyer page load.** `single-justice_lawyer.php` line ~35 increments `profile_views` meta on every GET request. This is a write operation on every page view — will degrade performance under load and invalidate page caches.
* **6 CSS files loaded (unminified):** main.css (~34KB) + premium-pass-2.css (~21KB) + premium-pass-3.css (~11KB) + components + accessibility + rtl. Total ~66KB unminified. Recommendation #1 above is **STILL PENDING**.
* **Mixed protocol links CONFIRMED:** Some homepage practice-area grid links use `http://` instead of `https://`. Creates redirect overhead and potential mixed-content browser warnings.
* **7 legacy CPTs CONFIRMED via REST API:** labor_law, small_claims, corona_virus, supreme_court, tort, goverment-gazette (typo!), yada_wiki. All registered and exposed at `/wp-json/wp/v2/types`. Content inside them is orphaned — not rendered by current theme templates. **Must deregister.**
* **`city` taxonomy DUAL REGISTRATION:** Applies to both old `lawyer` CPT and new `justice_lawyer` CPT — indicates legacy data still present in DB.
