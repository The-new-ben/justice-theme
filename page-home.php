<?php
/**
 * Template Name: Home
 *
 * Redesign homepage, mirrors front-page.php exactly.
 *
 * Lineup reordered 2026-07-06 (owner directive): lawyer keywords first
 * above the fold, matching the ranking portals (din.co.il, psakdin,
 * mishpati). Practice areas, money hubs, the how-to-choose guide and
 * the guides tabs float up; the AI sections move down; the map stays
 * below the keyword content. find-lawyer-guide returns to the lineup
 * by the same directive (it was retired 2026-07-02 as an oversized
 * wall; keyword signal now outranks that concern).
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
