<?php
/**
 * Front page.
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php get_template_part( 'template-parts/sections/hero' ); ?>

<?php get_template_part( 'template-parts/sections/practice-areas-grid' ); ?>

<?php get_template_part( 'template-parts/sections/featured-pillars' ); ?>

<?php get_template_part( 'template-parts/sections/latest-articles' ); ?>

<?php get_template_part( 'template-parts/sections/topic-clusters' ); ?>

<?php get_template_part( 'template-parts/sections/trust-section' ); ?>

<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

<?php
get_footer();
