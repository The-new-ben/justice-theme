<?php
/**
 * Premium visual bridge for Jus-Tice.
 *
 * The full theme v3 package is in Git, but the live UPress Git pull is blocked
 * by server authentication. This bridge improves the public visual layer through
 * the plugin channel without changing URLs, content, indexability, menus, or
 * database records.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'justice-ops-new-look-bridge',
		plugins_url( 'assets/new-look-bridge.css', __FILE__ ),
		array(),
		JUSTICE_OPS_VERSION
	);
}, 40 );

add_filter( 'body_class', function ( array $classes ): array {
	$classes[] = 'jt-premium-bridge';

	if ( is_front_page() ) {
		$classes[] = 'jt-premium-home';
	}

	if ( is_page( 'legal-simulation' ) ) {
		$classes[] = 'jt-premium-simulation';
	}

	return $classes;
} );
