<?php
/**
 * Template Name: Home
 *
 * Redesign homepage. Consumer-first premium flow. Retired from the lineup
 * 2026-07-02 (owner critique "it does not look good"): the two dead partials
 * that rendered nothing on live (home-page-content needs page body content,
 * lawyer-revenue is the B2B pricing strip) and the oversized
 * find-lawyer-guide wall (a full guide of steps, FAQ, fee tables and
 * checklists that broke the premium flow with an endless text block). Those
 * template parts still exist and can be restored to the lineup if wanted.
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

<?php get_template_part( 'template-parts/redesign/stats-trust' ); ?>

<?php get_template_part( 'template-parts/redesign/faq' ); ?>

<?php get_template_part( 'template-parts/redesign/final-cta' ); ?>

<?php
get_footer();
