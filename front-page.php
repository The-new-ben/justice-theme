<?php
/**
 * Front page — premium legal portal homepage.
 *
 * Section order modeled after leading Israeli & global legal directories
 * (din.co.il, psakdin.co.il, avvo.com) but with superior design and content.
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php get_template_part( 'template-parts/sections/hero' ); ?>

<?php get_template_part( 'template-parts/sections/customer-intake-strip' ); ?>

<?php get_template_part( 'template-parts/sections/homepage-intent-pyramid' ); ?>

<?php get_template_part( 'template-parts/sections/practice-areas-grid' ); ?>

<?php get_template_part( 'template-parts/sections/find-lawyer-guide' ); ?>

<?php get_template_part( 'template-parts/sections/featured-lawyers' ); ?>

<?php get_template_part( 'template-parts/sections/legaltech-tools' ); ?>

<?php get_template_part( 'template-parts/sections/lawyer-cta' ); ?>

<?php get_template_part( 'template-parts/sections/latest-articles' ); ?>

<?php get_template_part( 'template-parts/sections/ask-lawyer' ); ?>

<?php get_template_part( 'template-parts/sections/trust-section' ); ?>

<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

<?php
get_footer();
