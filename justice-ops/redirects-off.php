<?php
/**
 * Redirect policy (2026-09-03, revised the same evening).
 *
 * No NEW content redirects: WordPress may not "guess" a permalink for an
 * unknown URL, and a 404 stays a 404. But the two legacy maps that carry the
 * site's ranking history — WordPress's own old-slug 301s (_wp_old_slug) and
 * the theme's Hebrew→English slug map from the 2026-05-17 migration — stay
 * ON. Search Console shows Google crawling those Hebrew URLs as redirects
 * until 2026-09-02; the 2.37.0/2.37.1 unhooking turned every one of them
 * into a 404 and started erasing the equity they still carry. This release
 * puts the legacy maps back exactly as they were before 2.37.0.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// No permalink guessing for unknown URLs (WP 5.5+ filter).
add_filter( 'do_redirect_guess_404_permalink', '__return_false' );

// Canonical redirect never fires for a 404 request.
add_filter( 'redirect_canonical', function ( $redirect_url, $requested_url ) {
	if ( is_404() ) {
		return false;
	}
	return $redirect_url;
}, 10, 2 );

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
