<?php
/**
 * Plugin Name: Justice Core
 * Plugin URI: https://jus-tice.co.il
 * Description: Core functionality for the Jus-Tice legal portal: CPTs, taxonomies, REST API, lead CRM, safe inspection tools, and demo seeding.
 * Version: 1.0.0
 * Author: Jus-Tice
 * Author URI: https://jus-tice.co.il
 * Text Domain: justice-core
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * Network: false
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ג”€ג”€ג”€ Constants ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
define( 'UJE_VERSION', '1.0.0' );
define( 'UJE_DIR',     plugin_dir_path( __FILE__ ) );
define( 'UJE_URL',     plugin_dir_url( __FILE__ ) );

// ג”€ג”€ג”€ Load Modules ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
$uje_includes = array(
	'includes/security.php',
	'includes/logger.php',
	'includes/cpt-articles.php',
	'includes/cpt-lawyers.php',
	'includes/taxonomy-practice-areas.php',
	'includes/taxonomy-city.php',
	'includes/lead-submissions.php',
	'includes/seeder.php',
	'includes/rest-health.php',
	'includes/rest-content-tools.php',
	'includes/rest-db-tools.php',
	'includes/admin-pages.php',
);

foreach ( $uje_includes as $file ) {
	$path = UJE_DIR . $file;
	if ( file_exists( $path ) ) {
		require_once $path;
	} else {
		error_log( "[Justice Core] Missing include: {$path}" );
	}
}

// ג”€ג”€ג”€ Activation Hook ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
register_activation_hook( __FILE__, 'uje_activate' );
function uje_activate(): void {
	$fns = array(
		'uje_register_articles_cpt',
		'uje_register_lawyer_cpt',
		'uje_register_lead_cpt',
		'uje_register_practice_areas_taxonomy',
		'uje_register_city_taxonomy',
	);
	foreach ( $fns as $fn ) {
		if ( function_exists( $fn ) ) {
			$fn();
		}
	}
	flush_rewrite_rules();

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'activated', 'Justice Core v1.0.0 activated.' );
	}
}

// ג”€ג”€ג”€ Deactivation Hook ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
register_deactivation_hook( __FILE__, 'uje_deactivate' );
function uje_deactivate(): void {
	flush_rewrite_rules();
}

// ג”€ג”€ג”€ Archive Title Fix ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
add_filter( 'get_the_archive_title', function ( string $title ): string {
	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		return '׳׳™׳ ׳“׳§׳¡ ׳¢׳•׳¨׳›׳™ ׳“׳™׳ ׳‘׳™׳©׳¨׳׳';
	}
	if ( is_post_type_archive( 'articles' ) ) {
		return '׳׳׳׳¨׳™׳ ׳•׳׳“׳¨׳™׳›׳™׳ ׳׳©׳₪׳˜׳™׳™׳';
	}
	return $title;
} );
