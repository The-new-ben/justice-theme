<?php
/**
 * Controlled medical-malpractice practice route.
 *
 * Renders the full CMS pillar page (ID 19193) using the practice-landing
 * template so that the 5,000+ word Gutenberg content is visible to users,
 * Googlebot, and AI crawlers, while preserving all SEO meta overrides.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Resolve the canonical CMS page for this route.
$justice_medical_page_id = 0;
if ( function_exists( 'get_page_by_path' ) ) {
	$justice_medical_page = get_page_by_path( 'medical-malpractice-lawyer' );
	if ( $justice_medical_page instanceof WP_Post ) {
		$justice_medical_page_id = (int) $justice_medical_page->ID;
	}
}
// Hard fallback: known stable ID avoids an extra DB call on every request.
if ( ! $justice_medical_page_id ) {
	$justice_medical_page_id = 19193;
}

$justice_medical_malpractice_config = function_exists( 'justice_theme_get_practice_landing_config' )
	? justice_theme_get_practice_landing_config( 'medical-malpractice' )
	: null;

// Override SEO meta with the richer values from the published page.
if ( is_array( $justice_medical_malpractice_config ) ) {
	$justice_medical_malpractice_config['display_title'] = 'עורך דין רשלנות רפואית';
	$justice_medical_malpractice_config['quick_path'] = array(
		array( 'label' => 'רשלנות רפואית בלידה', 'url' => '/medical-malpractice-lawyer-birth-recommended/' ),
		array( 'label' => 'רשלנות רפואית בניתוח', 'url' => '/medical-malpractice-surgery/' ),
		array( 'label' => 'רשלנות רפואית שיניים', 'url' => '/dental-malpractice/' ),
		array( 'label' => 'שכר טרחה עורך דין רשלנות רפואית', 'url' => '/medical-malpractice-cost/' ),
		array( 'label' => 'פיצויים ברשלנות רפואית', 'url' => '/medical-malpractice-compensation/' ),
	);
	$justice_medical_malpractice_config['hide_signals'] = true;
	$justice_medical_malpractice_config['show_map'] = true;
	$justice_medical_malpractice_config['reviewed_by'] = 'עו"ד בן בטש';

}

// Apply SEO meta overrides + mark as 200 OK.
if ( function_exists( 'justice_theme_prepare_medical_malpractice_practice_route_meta' ) ) {
	justice_theme_prepare_medical_malpractice_practice_route_meta();
}

// Override title tag with the full optimised pillar title.
add_filter(
	'pre_get_document_title',
	static function (): string {
		return 'עורך דין רשלנות רפואית | פיצויים, זכויות והליך התביעה 2025 | Jus-Tice';
	},
	PHP_INT_MAX - 1
);
add_filter(
	'wpseo_title',
	static function (): string {
		return 'עורך דין רשלנות רפואית | פיצויים, זכויות והליך התביעה 2025 | Jus-Tice';
	},
	PHP_INT_MAX - 1
);
add_filter(
	'wpseo_metadesc',
	static function (): string {
		return 'עורך דין רשלנות רפואית - מדריך מלא לפיצויים, הוכחת רשלנות, חוות דעת מומחה ושלבי תביעה. נתוני 2025: 4,500 תביעות בשנה, פיצויים 500K-10M &#8362;. חינם ייעוץ ראשוני.';
	},
	PHP_INT_MAX - 1
);

if ( function_exists( 'justice_theme_mark_controlled_practice_route_found' ) ) {
	justice_theme_mark_controlled_practice_route_found();
} else {
	status_header( 200 );
}


// Isolate the topics bar to the malpractice ecosystem on this route
// (winner pattern: zero cross-practice anchors on ranking pillars).
$GLOBALS['justice_practice_scope'] = array(
	array( 'label' => 'עורך דין רשלנות רפואית', 'url' => home_url( '/medical-malpractice-lawyer/' ) ),
	array( 'label' => 'רשלנות רפואית בלידה', 'url' => home_url( '/medical-malpractice-lawyer-birth-recommended/' ) ),
	array( 'label' => 'רשלנות רפואית בניתוח', 'url' => home_url( '/medical-malpractice-surgery/' ) ),
	array( 'label' => 'רשלנות רפואית שיניים', 'url' => home_url( '/dental-malpractice/' ) ),
	array( 'label' => 'פיצויים ברשלנות רפואית', 'url' => home_url( '/medical-malpractice-compensation/' ) ),
	array( 'label' => 'כמה עולה תביעת רשלנות רפואית', 'url' => home_url( '/medical-malpractice-cost/' ) ),
	array( 'label' => 'מומחים רפואיים לחוות דעת', 'url' => home_url( '/court-legal-opinion-experts-medical-2023/' ) ),
);

get_header();

get_template_part(
	'template-parts/content/practice-landing-page',
	null,
	array(
		// Pass the actual CMS page ID so the full Gutenberg content renders.
		'page_id' => $justice_medical_page_id,
		'config'  => is_array( $justice_medical_malpractice_config ) ? $justice_medical_malpractice_config : array(),
	)
);

get_footer();
