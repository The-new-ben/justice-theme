<?php
/**
 * Justice Core Health REST endpoint.
 *
 * Provides system state verification at /wp-json/justice-core/v1/health
 * Admin-only access.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_core_register_health_route() {
	register_rest_route( 'justice-core/v1', '/health', array(
		'methods'             => 'GET',
		'callback'            => 'justice_core_health_callback',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );

	register_rest_route( 'justice-core/v1', '/theme-state', array(
		'methods'             => 'GET',
		'callback'            => 'justice_core_theme_state_callback',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
}
add_action( 'rest_api_init', 'justice_core_register_health_route' );

function justice_core_health_callback() {
	$theme = wp_get_theme();

	// Check CPTs
	$cpt_check = array(
		'justice_lawyer' => post_type_exists( 'justice_lawyer' ),
		'justice_lead'   => post_type_exists( 'justice_lead' ),
		'articles'       => post_type_exists( 'articles' ),
	);

	// Check taxonomies
	$tax_check = array(
		'practice-areas' => taxonomy_exists( 'practice-areas' ),
		'city'           => taxonomy_exists( 'city' ),
	);

	// Count content
	$counts = array(
		'lawyers' => wp_count_posts( 'justice_lawyer' ),
		'leads'   => wp_count_posts( 'justice_lead' ),
		'articles' => wp_count_posts( 'articles' ),
		'posts'   => wp_count_posts( 'post' ),
	);

	return array(
		'ok'              => true,
		'plugin_version'  => JUSTICE_CORE_VERSION,
		'theme'           => $theme->get( 'Name' ),
		'theme_version'   => $theme->get( 'Version' ),
		'cpt_registered'  => $cpt_check,
		'tax_registered'  => $tax_check,
		'content_counts'  => $counts,
		'time'            => current_time( 'mysql' ),
		'php_version'     => PHP_VERSION,
		'wp_version'      => get_bloginfo( 'version' ),
	);
}

function justice_core_theme_state_callback() {
	$theme = wp_get_theme();
	$active_plugins = get_option( 'active_plugins', array() );

	return array(
		'theme_name'       => $theme->get( 'Name' ),
		'theme_slug'       => $theme->get_stylesheet(),
		'theme_version'    => $theme->get( 'Version' ),
		'theme_directory'  => $theme->get_stylesheet_directory(),
		'active_plugins'   => $active_plugins,
		'permalink_struct' => get_option( 'permalink_structure' ),
		'time'             => current_time( 'mysql' ),
	);
}
