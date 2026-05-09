# Current Site State
Generated: 2026-05-08

## Technical Confirmation
1. **Active Theme**: `justice-theme` is currently active (confirmed via frontend HTML structure and CSS loading).
2. **Theme Location**: Server: `wp-content/themes/justice-theme/`. Local: `c:\Users\pro\justice\justice-theme\`.
3. **Justice Core Plugin**: Active (Agent bridge and REST routes responded during checks).
4. **Duplicate Plugins**: The system has `justice-core`, but the old `Custom Post Type UI` plugin is likely still active and competing for the `articles` CPT.
5. **CPT Registration**: The `articles` CPT is currently registered by both `CPT UI` (old system) and `justice-core`. We need to eventually phase out `CPT UI`.
6. **Practice-Areas Taxonomy**: Registered in `justice-core` via `taxonomy-practice-areas.php`.
7. **REST API Endpoints**: Active. `wp-json/justice-core/v1/health` exists.
8. **CSS/JS Assets**: Working. The `assets` directory is now correctly uploaded and returning HTTP 200.
9. **Templates**: Loading correctly (custom templates from `justice-theme/template-parts/` are rendering).
10. **Homepage Rendering**: Using `front-page.php` from the `justice-theme`, bypassing the old visual builder.

## Immediate Action Plan
We will now move to translate the entire theme UI to native Hebrew, rebuild the homepage structure, and prepare the content inventory.
