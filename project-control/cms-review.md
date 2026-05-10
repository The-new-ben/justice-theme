# CMS Connection Review — Jus-Tice
## Date: 2026-05-10
## Phase: Analysis and Recommendation

---

This document maps the visible frontend elements to their backend CMS controls, identifying gaps where data is hardcoded instead of dynamic.

## 1. Mapping: Frontend to Backend

| Frontend Element | Current Source | Should Be | Status |
| :--- | :--- | :--- | :--- |
| **Site Logo** | Customizer (`logo.png`) or CSS fallback | WordPress Customizer | ✅ Dynamic (but needs real image uploaded) |
| **Header Menu** | `wp_nav_menu('primary')` + PHP fallback | WordPress Menus | ⚠️ Partially Dynamic (requires Admin action to populate) |
| **Hero Title/Subtitle** | Hardcoded in `hero.php` | ACF / Customizer / Page Meta | ❌ Hardcoded |
| **Hero Stats (1,209 / 51 / 20)** | Hardcoded in `hero.php` | Dynamic WP Queries (`wp_count_posts`, etc.) | ❌ Hardcoded |
| **Practice Area Grid** | Taxonomy `practice-areas` | Taxonomy `practice-areas` | ✅ Dynamic |
| **Practice Area Icons** | Empty CSS containers | Taxonomy Meta Field (ACF/Custom) for SVG/Icon class | ❌ Missing Data Structure |
| **Featured Lawyers** | `WP_Query` + Demo Fallbacks | `WP_Query` fetching `justice_lawyer` CPT | ✅ Dynamic (query works, needs real data) |
| **Articles Grid** | `WP_Query` fetching `post` or `articles` CPT | `WP_Query` | ✅ Dynamic |
| **Footer Links** | Hardcoded or widget fallback | WordPress Menus (`footer-1`, `footer-2`) | ⚠️ Needs Verification |
| **Contact Forms** | HTML markup | Gravity Forms / CF7 shortcode | ❌ Hardcoded UI |

## 2. The Lawyer CPT (`justice_lawyer`)

*   **Status:** The CPT is registered via `justice-core`.
*   **Fields:** Based on the changelog, it contains 30+ fields (identity, professional, contact, commercial, admin).
*   **Gap:** We have 10 drafts in the seeder, but 0 published. The frontend is currently relying on the `$demo_lawyers` array in `featured-lawyers.php`.

## 3. The Lead CPT (`justice_lead`)

*   **Status:** Registered via `justice-core` as a private CRM tool.
*   **Gap:** The frontend forms (like the hero search or "Ask a Lawyer" section) are currently just HTML. They are NOT POSTing data to the `justice_lead` endpoint.

## 4. CMS Recommendations

1.  **De-Hardcode the Hero:** Move the hero text to the WordPress Customizer (Theme Mods) or make the Homepage a real WP Page and use Custom Fields.
2.  **Dynamic Stats:** Write a helper function to count published articles, active lawyers, and active cities to populate the hero stats dynamically.
3.  **Taxonomy Icons:** Add a custom meta field to the `practice-areas` taxonomy allowing the admin to assign an icon class (e.g., `fa-balance-scale`) or upload an SVG.
4.  **Form Wiring:** The most urgent CMS task is wiring the HTML forms to actually create `justice_lead` posts.
