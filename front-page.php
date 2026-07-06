<?php
/**
 * Front page - same redesign lineup as page-home.php so the homepage
 * renders identically whichever template WordPress resolves. Lineup
 * tightened 2026-07-02 (see page-home.php header for the rationale).
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php get_template_part( 'template-parts/redesign/hero' ); ?>

<?php get_template_part( 'template-parts/redesign/situational-router' ); ?>

<?php get_template_part( 'template-parts/redesign/ai-tools-strip' ); ?>

<?php get_template_part( 'template-parts/redesign/legal-map' ); ?>

<?php get_template_part( 'template-parts/redesign/how-it-works' ); ?>

<?php get_template_part( 'template-parts/redesign/practice-areas' ); ?>

<?php get_template_part( 'template-parts/redesign/money-hubs' ); ?>

<?php get_template_part( 'template-parts/sections/home-page-content' ); ?>

<?php get_template_part( 'template-parts/sections/featured-lawyers' ); ?>

<?php get_template_part( 'template-parts/redesign/content-tabs' ); ?>

<?php get_template_part( 'template-parts/redesign/legal-news' ); ?>

<?php get_template_part( 'template-parts/sections/ask-lawyer' ); ?>

<?php get_template_part( 'template-parts/sections/find-lawyer-guide' ); ?>

<?php get_template_part( 'template-parts/redesign/stats-trust' ); ?>

<?php get_template_part( 'template-parts/redesign/faq' ); ?>

<?php get_template_part( 'template-parts/redesign/final-cta' ); ?>

<?php
get_footer();
