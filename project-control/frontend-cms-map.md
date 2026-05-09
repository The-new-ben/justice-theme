# Frontend CMS Map
Date: 2026-05-09

| Frontend Area | Template/File | CMS Source | Status |
|---|---|---|---|
| Header logo | `template-parts/layout/site-header.php` | Custom logo / fallback lockup | PARTIALLY VERIFIED |
| Primary menu | `template-parts/layout/site-header.php` | WP menu `primary`; fallback dynamic menu | NOT VERIFIED live assignment |
| Hero practice dropdown | `template-parts/sections/hero.php` | `practice-areas` terms | VERIFIED code |
| Hero city dropdown | `template-parts/sections/hero.php` | Hardcoded Israeli city list | VERIFIED code |
| Practice grid | `template-parts/sections/practice-areas-grid.php` | `practice-areas` terms | VERIFIED code |
| Cities grid | `template-parts/sections/cities-grid.php` | hardcoded/city links | NEEDS REVIEW |
| Featured lawyers | `template-parts/sections/featured-lawyers.php` | `justice_lawyer` posts | VERIFIED code |
| Lawyer cards | `template-parts/cards/lawyer-card.php` | lawyer meta + taxonomies | VERIFIED code |
| Latest articles | `template-parts/sections/latest-articles.php` | `articles` CPT intended | NEEDS FINAL CHECK |
| Lead form | `template-parts/forms/lead-form.php` | `admin-post.php` -> plugin handler | VERIFIED code |
| Footer links | `template-parts/layout/site-footer.php` | Mostly hardcoded links + customizer contact | VERIFIED code |

## Gaps
- City values should render Hebrew names, not slugs.
- Footer should use menu locations or term queries where possible rather than hardcoded links.
- Practice area terms need cleanup; live extract shows noisy/non-commercial terms.
