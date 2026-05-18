<?php
/**
 * Controlled family-law practice route.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_family_law_config = function_exists( 'justice_theme_get_practice_landing_config' )
	? justice_theme_get_practice_landing_config( 'family-law' )
	: null;

if ( function_exists( 'justice_theme_prepare_family_law_practice_route_meta' ) ) {
	justice_theme_prepare_family_law_practice_route_meta();
}

status_header( 200 );

get_header();

get_template_part(
	'template-parts/content/practice-landing-page',
	null,
	array(
		'page_id' => 0,
		'config'  => is_array( $justice_family_law_config ) ? $justice_family_law_config : array(),
	)
);

get_footer();
