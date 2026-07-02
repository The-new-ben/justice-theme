<?php
/**
 * Public healthcheck for the agent-driven deploy pipeline.
 *
 * One GET answers "what exactly is live right now": theme version, deploy
 * marker, PHP and WP versions. Read-only and safe to be public; it exposes
 * nothing an HTML source view does not already show (the marker is printed
 * as a meta tag on every page).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_healthcheck_route(): void {
	register_rest_route(
		'justice/v1',
		'/healthcheck',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => function () {
				return new WP_REST_Response(
					array(
						'theme'          => 'justice-theme',
						'theme_version'  => defined( 'JUSTICE_THEME_VERSION' ) ? JUSTICE_THEME_VERSION : '',
						'deploy_marker'  => defined( 'JUSTICE_DEPLOY_MARKER' ) ? JUSTICE_DEPLOY_MARKER : '',
						'php_version'    => PHP_VERSION,
						'wp_version'     => get_bloginfo( 'version' ),
						'time_utc'       => gmdate( 'c' ),
					),
					200
				);
			},
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_healthcheck_route' );
