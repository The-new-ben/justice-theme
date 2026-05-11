<?php
/**
 * Front page — premium legal portal homepage.
 *
 * Streamlined section order (7 sections instead of 12):
 * 1. Hero (search-first, centered, with category chips)
 * 2. Practice areas grid (primary navigation)
 * 3. Featured lawyers (social proof)
 * 4. Latest articles (content authority)
 * 5. Ask a lawyer (lead capture — prominently placed)
 * 6. Trust section (authority signals)
 * 7. Footer CTA
 *
 * Removed from homepage (still exist in codebase):
 * - Cities grid (available via /lawyers/ page)
 * - Featured pillars (merged conceptually into articles)
 * - Topic clusters (available via /articles/ archive)
 * - Lawyer CTA B2B (moved to /for-lawyers/ page)
 * - Newsletter (merged into footer)
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php get_template_part( 'template-parts/sections/hero' ); ?>

<?php get_template_part( 'template-parts/sections/home-page-content' ); ?>

<?php get_template_part( 'template-parts/sections/practice-areas-grid' ); ?>

<?php get_template_part( 'template-parts/sections/featured-lawyers' ); ?>

<?php get_template_part( 'template-parts/sections/legaltech-tools' ); ?>

<?php get_template_part( 'template-parts/sections/latest-articles' ); ?>

<?php get_template_part( 'template-parts/sections/ask-lawyer' ); ?>

<?php get_template_part( 'template-parts/sections/trust-section' ); ?>

<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

<?php
get_footer();
