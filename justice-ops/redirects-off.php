<?php
/**
 * Redirects off (owner rule 2026-09-03: no content redirects, ever).
 *
 * WordPress itself issues 301s for old post slugs (_wp_old_slug meta) and
 * "guesses" a permalink for unknown URLs. Both are content redirects and are
 * disabled here. Canonical host/scheme/trailing-slash redirects for EXISTING
 * pages stay; on a 404 nothing redirects — the URL answers 404.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// No permalink guessing for unknown URLs (WP 5.5+ filter).
add_filter( 'do_redirect_guess_404_permalink', '__return_false' );

// No old-slug redirects (post or term).
add_action( 'init', function () {
	remove_action( 'template_redirect', 'wp_old_slug_redirect' );
}, 1 );
add_filter( 'old_slug_redirect_url', '__return_false' );

// Canonical redirect never fires for a 404 request.
add_filter( 'redirect_canonical', function ( $redirect_url, $requested_url ) {
	if ( is_404() ) {
		return false;
	}
	return $redirect_url;
}, 10, 2 );


// The THEME (justice-theme/inc/url-redirects.php) carries a second redirect
// engine: an exact legacy-path map on init and a ~1,000-entry old-slug map on
// template_redirect. Owner rule: off. Removed here after the theme loads.
add_action( 'after_setup_theme', function () {
	remove_action( 'init', 'justice_theme_exact_legacy_path_redirect', -3001 );
	remove_action( 'template_redirect', 'justice_theme_native_slug_redirect', -3000 );
}, 0 );
add_action( 'template_redirect', function () {
	remove_action( 'template_redirect', 'justice_theme_native_slug_redirect', -3000 );
}, -3001 );

// Two shortcodes that lost their handler long ago print raw text on pages;
// render nothing instead.
add_action( 'init', function () {
	foreach ( array( 'justice_contact_form', 'justice_lawyer_listing' ) as $tag ) {
		if ( ! shortcode_exists( $tag ) ) {
			add_shortcode( $tag, '__return_empty_string' );
		}
	}
}, 20 );

// Zero-friction deploys (owner order 2026-09-03): Justice Ops may update
// itself through WordPress native auto-update. Set once; the control route
// can flip it back.
add_action( 'init', function () {
	if ( ! get_option( 'justice_ops_zero_friction_autoupdate_v1' ) ) {
		update_option( 'justice_ops_native_auto_update_enabled', '1', false );
		update_option( 'justice_ops_zero_friction_autoupdate_v1', wp_date( 'Y-m-d H:i:s' ), false );
	}
}, 30 );

// Status route: GET /wp-json/justice-ops/v1/redirects-off
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/redirects-off', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return array(
				'version'            => JUSTICE_OPS_VERSION,
				'guess_404_disabled' => false === apply_filters( 'do_redirect_guess_404_permalink', true ),
				'old_slug_hooked'    => false !== has_action( 'template_redirect', 'wp_old_slug_redirect' ),
				'legacy_map_loaded'  => function_exists( 'justice_legacy_redirect_map' ),
				'theme_slug_map_hooked' => false !== has_action( 'template_redirect', 'justice_theme_native_slug_redirect' ),
				'theme_exact_map_hooked' => false !== has_action( 'init', 'justice_theme_exact_legacy_path_redirect' ),
				'native_auto_update' => '1' === (string) get_option( 'justice_ops_native_auto_update_enabled', '0' ),
			);
		},
	) );
} );
