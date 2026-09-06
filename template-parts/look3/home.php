<?php
/**
 * Homepage lineup, new look (v3). Portal first, simulation fourth.
 *
 * Shared by front-page.php and page-home.php so the homepage renders the
 * same whichever template WordPress resolves.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<?php get_template_part( 'template-parts/look3/hero' ); ?>

<?php get_template_part( 'template-parts/look3/tools' ); ?>

<?php get_template_part( 'template-parts/look3/areas' ); ?>

<?php get_template_part( 'template-parts/look3/simulation' ); ?>

<?php get_template_part( 'template-parts/look3/guides' ); ?>

<?php get_template_part( 'template-parts/look3/cities' ); ?>

<div class="l3-legacy">
	<?php get_template_part( 'template-parts/sections/home-page-content' ); ?>

	<?php get_template_part( 'template-parts/redesign/faq' ); ?>
</div>

<?php get_template_part( 'template-parts/look3/lead' ); ?>
