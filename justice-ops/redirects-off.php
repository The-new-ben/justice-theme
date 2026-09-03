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
			);
		},
	) );
} );
