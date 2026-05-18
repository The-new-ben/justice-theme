<?php
/**
 * Controlled inheritance/wills lawyer route.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_inheritance_config = function_exists( 'justice_theme_get_practice_landing_config' )
	? justice_theme_get_practice_landing_config( 'inheritance' )
	: null;

if ( is_array( $justice_inheritance_config ) ) {
	$justice_inheritance_config['title']         = 'עורך דין ירושה וצוואות';
	$justice_inheritance_config['display_title'] = $justice_inheritance_config['title'];
	$justice_inheritance_config['keyword']       = 'עורך דין ירושה';
	$justice_inheritance_config['summary']       = 'מרכז מידע מעשי על צוואות, ירושות, צו ירושה, צו קיום צוואה, התנגדות לצוואה, ניהול עיזבון וסכסוכים בין יורשים.';
	$justice_inheritance_config['supporting']    = array(
		array( 'label' => 'מהי ירושה', 'url' => '/inheritance/' ),
		array( 'label' => 'צו ירושה', 'url' => '/inheritance-order/' ),
		array( 'label' => 'צוואה', 'url' => '/will-and-testament/' ),
		array( 'label' => 'התנגדות לצוואה', 'url' => '/will-probate-objection/' ),
		array( 'label' => 'צו קיום צוואה', 'url' => '/what-is-a-probate-order/' ),
		array( 'label' => 'ביטול צוואה וקיום צוואה קודמת', 'url' => '/revocation-of-a-will-and-reviving-previous-will/' ),
	);
}

if ( function_exists( 'justice_theme_prepare_inheritance_lawyer_practice_route_meta' ) ) {
	justice_theme_prepare_inheritance_lawyer_practice_route_meta();
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
		'config'  => is_array( $justice_inheritance_config ) ? $justice_inheritance_config : array(),
	)
);

get_footer();
