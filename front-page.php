<?php
/**
 * Front page - same redesign lineup as page-home.php so the homepage
 * renders identically whichever template WordPress resolves.
 *
 * Lineup reordered 2026-07-06 (owner directive): the upper fold must
 * transmit lawyer keywords first, the way the ranking portals do
 * (din.co.il, psakdin, mishpati). Practice areas, money hubs, the
 * how-to-choose guide and the guides tabs float up; the AI sections
 * (situational router, tools strip, how-it-works) move down; the map
 * stays below the keyword content per the owner (not implemented
 * enough to lead).
 *
 * @package JusticeTheme
 */

get_header();
?>

<?php if ( function_exists( 'justice_theme_new_look_active' ) && justice_theme_new_look_active() ) : ?>

<?php get_template_part( 'template-parts/look3/home' ); ?>

<?php else : ?>

<?php get_template_part( 'template-parts/redesign/hero' ); ?>

<?php get_template_part( 'template-parts/redesign/practice-areas' ); ?>

<?php get_template_part( 'template-parts/redesign/money-hubs' ); ?>

<?php get_template_part( 'template-parts/sections/find-lawyer-guide' ); ?>

<?php get_template_part( 'template-parts/redesign/content-tabs' ); ?>

<?php get_template_part( 'template-parts/sections/home-page-content' ); ?>

<?php get_template_part( 'template-parts/sections/featured-lawyers' ); ?>

<?php get_template_part( 'template-parts/redesign/situational-router' ); ?>

<?php get_template_part( 'template-parts/redesign/ai-tools-strip' ); ?>

<?php get_template_part( 'template-parts/redesign/how-it-works' ); ?>

<?php get_template_part( 'template-parts/redesign/legal-map' ); ?>

<?php get_template_part( 'template-parts/redesign/legal-news' ); ?>

<?php get_template_part( 'template-parts/sections/ask-lawyer' ); ?>

<?php get_template_part( 'template-parts/redesign/stats-trust' ); ?>

<?php get_template_part( 'template-parts/redesign/faq' ); ?>

<?php get_template_part( 'template-parts/redesign/final-cta' ); ?>

<?php endif; ?>

<?php
get_footer();
