<?php
/**
 * Controlled medical-malpractice practice route.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_medical_malpractice_config = function_exists( 'justice_theme_get_practice_landing_config' )
	? justice_theme_get_practice_landing_config( 'medical-malpractice' )
	: null;

if ( function_exists( 'justice_theme_prepare_medical_malpractice_practice_route_meta' ) ) {
	justice_theme_prepare_medical_malpractice_practice_route_meta();
}

if ( function_exists( 'justice_theme_mark_controlled_practice_route_found' ) ) {
	justice_theme_mark_controlled_practice_route_found();
} else {
	status_header( 200 );
}

get_header();

get_template_part(
	'template-parts/content/practice-landing-page',
	null,
	array(
		'page_id' => 0,
		'config'  => is_array( $justice_medical_malpractice_config ) ? $justice_medical_malpractice_config : array(),
	)
);

get_footer();
