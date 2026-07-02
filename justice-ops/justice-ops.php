<?php
/**
 * Plugin Name: Justice Ops
 * Description: Agent-operated delivery channel for jus-tice.co.il: healthcheck, self-updates from the Git repo, and ongoing site behavior shipped as reviewed code with zero manual clicks.
 * Version: 1.0.5
 * Author: Jus-Tice
 * Update URI: https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_OPS_VERSION' ) ) {
	define( 'JUSTICE_OPS_VERSION', '1.0.5' );
}

define( 'JUSTICE_OPS_MANIFEST', 'https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json' );

/**
 * Public healthcheck: what version of the ops plugin is live.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/healthcheck', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return array(
				'plugin'   => 'justice-ops',
				'version'  => JUSTICE_OPS_VERSION,
				'marker'   => 'self-update-proof-v1',
				'time_utc' => gmdate( 'c' ),
			);
		},
	) );
} );

/**
 * Core-native self-update (WP 5.8+ Update URI protocol): WordPress asks
 * this filter for update info for our host, we read the Git manifest.
 * Cached 15 minutes; the agent's deploy route stays the instant path and
 * this keeps wp-admin updates and auto-updates working with no human.
 */
add_filter( 'update_plugins_raw.githubusercontent.com', function ( $update, $plugin_data, $plugin_file ) {
	if ( 'justice-ops/justice-ops.php' !== $plugin_file ) {
		return $update;
	}

	$manifest = get_transient( 'justice_ops_manifest_v1' );

	if ( ! is_array( $manifest ) ) {
		$response = wp_remote_get( JUSTICE_OPS_MANIFEST . '?nlcb=' . (int) ( time() / 900 ), array( 'timeout' => 8 ) );

		if ( is_wp_error( $response ) ) {
			return $update;
		}

		$manifest = json_decode( (string) wp_remote_retrieve_body( $response ), true );

		if ( ! is_array( $manifest ) || empty( $manifest['version'] ) || empty( $manifest['download_url'] ) ) {
			return $update;
		}

		set_transient( 'justice_ops_manifest_v1', $manifest, 15 * MINUTE_IN_SECONDS );
	}

	if ( version_compare( (string) $manifest['version'], JUSTICE_OPS_VERSION, '<=' ) ) {
		return $update;
	}

	return array(
		'id'      => 'justice-ops/justice-ops.php',
		'slug'    => 'justice-ops',
		'version' => (string) $manifest['version'],
		'url'     => isset( $manifest['homepage'] ) ? (string) $manifest['homepage'] : 'https://jus-tice.co.il/',
		'package' => (string) $manifest['download_url'] . '?nlcb=' . time(),
	);
}, 10, 3 );

/**
 * LawyerScout map: serve the public Mapbox token (pk scope, meant for
 * the browser; access control happens via URL restriction in the Mapbox
 * dashboard) from the justice_ops_mapbox_public_token option. The token
 * value lives only in the live database, never in this repo. The
 * theme's justice_theme_mapbox_public_token() consumes this filter; an
 * empty token keeps the whole map feature dark.
 */
add_filter( 'justice_theme_mapbox_public_token', function ( $token ) {
	if ( '' !== (string) $token ) {
		return $token;
	}

	return (string) get_option( 'justice_ops_mapbox_public_token', '' );
} );

/**
 * Theme bridge: instant fixes delivered ahead of the owner's next theme
 * pull, self-retiring once the theme reaches the version that carries the
 * same code natively. Covers the 2026-07-02 owner orders: no stock people
 * photos, fixed homepage lawyer cards, auto-loading RTL-correct light map.
 */
function justice_ops_theme_needs_bridge(): bool {
	return ! defined( 'JUSTICE_THEME_VERSION' ) || version_compare( JUSTICE_THEME_VERSION, '2.21.0', '<' );
}

/**
 * Until the theme carries the office logo natively (2.21.0), enrich the
 * map GeoJSON response with each lawyer's office_logo_id so the premium
 * flag cards can render logos today. The theme's transient stays
 * untouched; enrichment happens per response.
 */
add_filter( 'rest_request_after_callbacks', function ( $response, $handler, $request ) {
	if ( ! justice_ops_theme_needs_bridge() || ! ( $response instanceof WP_REST_Response ) ) {
		return $response;
	}

	if ( '/justice/v1/map/offices' !== $request->get_route() ) {
		return $response;
	}

	$data = $response->get_data();

	if ( ! is_array( $data ) || empty( $data['features'] ) || ! is_array( $data['features'] ) ) {
		return $response;
	}

	foreach ( $data['features'] as &$feature ) {
		if ( ! isset( $feature['properties']['kind'] ) || 'lawyer' !== $feature['properties']['kind'] ) {
			continue;
		}

		if ( ! empty( $feature['properties']['logo'] ) ) {
			continue;
		}

		$logo_id = (int) get_post_meta( (int) ( $feature['properties']['id'] ?? 0 ), 'office_logo_id', true );

		$feature['properties']['logo'] = $logo_id ? (string) wp_get_attachment_image_url( $logo_id, 'medium' ) : '';
	}
	unset( $feature );

	$response->set_data( $data );

	return $response;
}, 10, 3 );

add_filter( 'script_loader_src', function ( $src, $handle ) {
	if ( 'justice-legal-map' === $handle && justice_ops_theme_needs_bridge() ) {
		return plugins_url( 'assets/legal-map.js', __FILE__ ) . '?ver=' . JUSTICE_OPS_VERSION;
	}

	return $src;
}, 10, 2 );

add_action( 'wp_enqueue_scripts', function () {
	if ( justice_ops_theme_needs_bridge() ) {
		wp_enqueue_style( 'justice-ops-bridge', plugins_url( 'assets/theme-bridge.css', __FILE__ ), array(), JUSTICE_OPS_VERSION );
	}
}, 60 );

/**
 * Purge every cache layer this site runs, after our own upgrade completes.
 */
add_action( 'upgrader_process_complete', function ( $upgrader, $options ) {
	if ( empty( $options['type'] ) || 'plugin' !== $options['type'] ) {
		return;
	}

	if ( class_exists( 'autoptimizeCache' ) ) { autoptimizeCache::clearall(); }
	if ( function_exists( 'sg_cachepress_purge_cache' ) ) { sg_cachepress_purge_cache(); }
	if ( class_exists( 'SiteGround_Optimizer\\Supercacher\\Supercacher' ) ) {
		SiteGround_Optimizer\Supercacher\Supercacher::purge_cache();
	}
	wp_cache_flush();
}, 10, 2 );
