<?php
/**
 * Plugin Name: Justice Ops
 * Description: Agent-operated delivery channel for jus-tice.co.il: healthcheck, self-updates from the Git repo, and ongoing site behavior shipped as reviewed code with zero manual clicks.
 * Version: 1.0.1
 * Author: Jus-Tice
 * Update URI: https://raw.githubusercontent.com/The-new-ben/justice-theme/main/plugin-dist/justice-ops.json
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_OPS_VERSION' ) ) {
	define( 'JUSTICE_OPS_VERSION', '1.0.1' );
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
