<?php
/**
 * Controlled real-estate lawyer guide route.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_real_estate_config = function_exists( 'justice_theme_get_practice_landing_config' )
	? justice_theme_get_practice_landing_config( 'real-estate-law' )
	: null;

if ( is_array( $justice_real_estate_config ) ) {
	$justice_real_estate_config['term_slug'] = 'real-estate-law';
	$justice_real_estate_config['title']      = 'מדריך עורך דין מקרקעין';
	$justice_real_estate_config['keyword']    = 'עורך דין מקרקעין';
	$justice_real_estate_config['summary']    = 'מרכז מידע מעשי על קנייה ומכירת דירה, חוזי מכר, רישום זכויות, מיסוי מקרקעין, איחור במסירה ובדיקות משפטיות לפני עסקת נדל"ן.';
	$justice_real_estate_config['supporting'] = array(
		array( 'label' => 'עורך דין מקרקעין במודיעין', 'url' => '/real-estate-lawyer-modiin/' ),
		array( 'label' => 'עורך דין קניית דירה ומכירת דירה', 'url' => '/lawyer-for-buying-or-selling-a-house/' ),
		array( 'label' => 'רישום זכויות מקרקעין בישראל', 'url' => '/registration-of-real-estate-israel/' ),
		array( 'label' => 'מס שבח מקרקעין', 'url' => '/land-appreciation-tax/' ),
		array( 'label' => 'עלות עורך דין מכירת דירה', 'url' => '/real-estate-lawyer-cost-2025/' ),
		array( 'label' => 'שמאי מקרקעין', 'url' => '/real-estate-appraiser/' ),
		array( 'label' => 'הסכם ממון על דירה', 'url' => '/marital-property-agreement/' ),
	);
}

if ( function_exists( 'justice_theme_prepare_real_estate_lawyer_guide_route_meta' ) ) {
	justice_theme_prepare_real_estate_lawyer_guide_route_meta();
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
		'config'  => is_array( $justice_real_estate_config ) ? $justice_real_estate_config : array(),
	)
);

get_footer();
