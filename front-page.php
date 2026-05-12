<?php
/**
 * Front page — premium legal portal homepage.
 *
 * Section order optimized for:
 *  - High-intent legal consumers (search → categories → lawyers → trust → contact)
 *  - Lawyer B2B funnel (visible CTA at position 8)
 *  - Search engines (H1 → H2 hierarchy, internal links to all major pillars)
 *  - Mobile-first conversion (search above the fold, fast LCP)
 *
 * Each section is independently editable through template parts.
 * Editable copy is sourced from the Customizer (panel: "עמוד הבית — Jus-Tice").
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php // 1. Hero — search-first, CMS-driven (Customizer panel: "גיבור"). ?>
<?php get_template_part( 'template-parts/sections/hero' ); ?>

<?php // 2. How it works — three-pathway intent routing (consumer / reader / lawyer). ?>
<?php get_template_part( 'template-parts/sections/how-it-works' ); ?>

<?php // 3. Practice areas grid — taxonomy-driven category cards. ?>
<?php get_template_part( 'template-parts/sections/practice-areas-grid' ); ?>

<?php // 4. Featured lawyers — dynamic query (verified + active subscription). ?>
<?php get_template_part( 'template-parts/sections/featured-lawyers' ); ?>

<?php // 5. Featured pillar pages — links to major SEO pillar pages. ?>
<?php get_template_part( 'template-parts/sections/featured-pillars' ); ?>

<?php // 6. Trust + authority — verification signals + E-E-A-T statements. ?>
<?php get_template_part( 'template-parts/sections/trust-section' ); ?>

<?php // 7. Latest articles — content freshness signal + internal links. ?>
<?php get_template_part( 'template-parts/sections/latest-articles' ); ?>

<?php // 8. Lawyer B2B CTA — explicit invitation for lawyers to join. ?>
<?php get_template_part( 'template-parts/sections/lawyer-cta' ); ?>

<?php // 9. Cities grid — geo SEO + city-based lawyer navigation. ?>
<?php get_template_part( 'template-parts/sections/cities-grid' ); ?>

<?php // 10. Ask a lawyer — lead capture form (CRM-connected). ?>
<?php get_template_part( 'template-parts/sections/ask-lawyer' ); ?>

<?php // 11. Find-lawyer guide — educational content (moved out of conversion path). ?>
<?php get_template_part( 'template-parts/sections/find-lawyer-guide' ); ?>

<?php // 12. Final CTA band — phone + search + legal disclaimer. ?>
<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

<?php
get_footer();
