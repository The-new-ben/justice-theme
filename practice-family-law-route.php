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

// The family CMS page (20305) carries the pillar body: text first, then
// the mid-fold registered band and map render inside it.
$justice_family_law_page    = get_page_by_path( 'family-law' );
$justice_family_law_page_id = $justice_family_law_page instanceof WP_Post ? (int) $justice_family_law_page->ID : 0;

get_template_part(
	'template-parts/content/practice-landing-page',
	null,
	array(
		'page_id' => $justice_family_law_page_id,
		'config'  => is_array( $justice_family_law_config ) ? $justice_family_law_config : array(),
	)
);

get_footer();
