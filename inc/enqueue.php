<?php
/**
 * Enqueue theme assets.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_enqueue_assets() {
	wp_enqueue_style(
		'justice-fonts',
		'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'justice-main',
		JUSTICE_THEME_URI . '/assets/css/main.css',
		array( 'justice-fonts' ),
		JUSTICE_THEME_VERSION
	);

	wp_enqueue_style(
		'justice-components',
		JUSTICE_THEME_URI . '/assets/css/components.css',
		array( 'justice-main' ),
		JUSTICE_THEME_VERSION
	);

	wp_enqueue_style(
		'justice-accessibility',
		JUSTICE_THEME_URI . '/assets/css/accessibility.css',
		array( 'justice-main' ),
		JUSTICE_THEME_VERSION
	);

	if ( is_rtl() ) {
		wp_enqueue_style(
			'justice-rtl',
			JUSTICE_THEME_URI . '/assets/css/rtl.css',
			array( 'justice-main' ),
			JUSTICE_THEME_VERSION
		);
	}

	wp_enqueue_script(
		'justice-navigation',
		JUSTICE_THEME_URI . '/assets/js/navigation.js',
		array(),
		JUSTICE_THEME_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'justice_theme_enqueue_assets' );
