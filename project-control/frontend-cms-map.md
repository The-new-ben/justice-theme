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
| Lead form | `template-parts/forms/lead-form.php` + `inc/lead-spam-guard.php` | `admin-post.php` -> plugin handler with theme-level honeypot/timing guard | VERIFIED code |
| Footer links | `template-parts/layout/site-footer.php` | Mostly hardcoded links + customizer contact | VERIFIED code |

## Gaps
- City values should render Hebrew names, not slugs.
- Footer should use menu locations or term queries where possible rather than hardcoded links.
- Practice area terms need cleanup; live extract shows noisy/non-commercial terms.

## 2026-05-10 Customer-Facing CMS Wiring Detail

| Component | File path | Data source | Editable in wp-admin | Missing CMS connection | Required field / next action |
|---|---|---|---|---|---|
| Header logo | `template-parts/layout/site-header.php` | WordPress Custom Logo, fallback code lockup | YES | Old logo not found from repo | Verify Media Library and Site Identity |
| Favicon/site icon | `inc/seo.php`, `assets/images/favicon.svg` | WordPress Site Icon, fallback SVG | YES | Final icon not uploaded | Upload final icon or keep fallback TEMPORARY |
| Primary menu | `site-header.php`, `inc/menu-seed.php` | WP `primary` menu plus code augmentation | YES | Live assigned menu is too thin | Assign full menu in wp-admin |
| Mobile menu | `navigation.js`, WP menu | Same primary/mobile menu | YES | Open-state content not visually verified | Test hamburger after deploy |
| Footer menu | `site-footer.php` | Mostly hardcoded links + Customizer contact | PARTIAL | Not fully menu-location controlled | Move footer quick links to WP menu later |
| Hero title/subtitle | `template-parts/sections/hero.php` | Hardcoded copy | NO | Needs page/customizer field | Later expose via front-page fields |
| Hero CTAs | `hero.php` | Hardcoded URLs | NO | Needs CMS selection | Later expose via front-page fields |
| Practice cards | section/card templates | `practice-areas` taxonomy | YES | Taxonomy needs cleanup | Audit noisy terms and descriptions |
| Lawyer cards | `template-parts/cards/lawyer-card.php` | `justice_lawyer` CPT/meta/taxonomies | YES | Demo data still public live | Draft demo lawyers; verify Maya slug |
| Article cards | `template-parts/cards/article-card.php` | `articles` CPT/post fields | YES | Missing source/author/reviewer for many old posts | Add editorial metadata fields |
| Breadcrumbs | `inc/breadcrumbs.php` + CSS | WP query hierarchy | NO | Visual polish needed live | Recheck after deploy |
| Lead form | `ask-lawyer.php`, `template-parts/forms/lead-form.php`, `single-justice_lawyer.php`, plugin lead handlers | `admin-post.php`, `justice_lead` CPT/meta, `assigned_lawyer_id`, `source_keyword`, UTM fields | PARTIAL | Live routing not verified | Submit test lead after deploy and confirm assigned lawyer/meta in CRM |
| Footer brand block | `site-footer.php` | Custom logo + Customizer contact | PARTIAL | Description hardcoded | Later expose via Customizer |
| Lawyer profile fields | `single-justice_lawyer.php`, `inc/live-migrations.php` | lawyer CPT meta | YES | Photo/video/social/reviews not complete for live profiles | Maya rich text fields now bootstrap if empty; review contact/photo/license in wp-admin |
| Lawyer mini-site engagement module | `single-justice_lawyer.php` | lead form route, connected articles query, video/media meta, approved review meta | PARTIAL | Text is template-controlled; data modules depend on CMS fields | Keep as product-value module; add owner/lawyer editable copy later if needed |
| Article author/reviewer | `single-articles.php` | WP author + review meta | PARTIAL | Reviewer/person authority incomplete | Add visible reviewer fields |
| Category intro text | `taxonomy-practice-areas.php` | Taxonomy description fallback | YES | Many terms likely empty | Add Hebrew descriptions per priority area |
| Practice-area intent layer | `taxonomy-practice-areas.php` | Taxonomy name/slug plus generic legal-intent copy | PARTIAL | Text is not individually editable per term yet | Add term meta for custom intro, urgency notes, documents and FAQ per practice area |
| Practice-area CTA | `taxonomy-practice-areas.php` | Taxonomy slug, lawyer archive URL, homepage lead form anchor | PARTIAL | CTA copy and routing are still hardcoded | Later route by lead area and expose CTA copy in term meta |
| English practice page fallback | `page.php`, `inc/practice-landing.php`, `template-parts/content/practice-landing-page.php` | Controlled slug config, page content, taxonomy term, related articles, lawyer archive, Maya resolver | PARTIAL | Route config is code-controlled, not wp-admin controlled yet | Use as safety layer for `/family-law/` and other English practice pages; later move per-route copy into term/page meta |
| Homepage sections | `front-page.php`, `page-home.php` | Mixed CPT/taxonomy/hardcoded/page content | PARTIAL | Hero/value copy not editable | Add ACF/customizer/front-page fields later |
| SEO title/meta | `inc/seo.php` | Query context + excerpt | PARTIAL | No SEO plugin/GSC feedback loop | Connect GSC and decide SEO plugin |
| Schema fields | `inc/schema.php` | Site/lawyer/article data | PARTIAL | Lawyer schema needs live profile validation | Validate Maya profile schema |
