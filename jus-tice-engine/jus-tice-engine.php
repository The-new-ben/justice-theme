<?php
/**
 * Plugin Name: Jus-Tice Engine
 * Plugin URI: https://jus-tice.co.il
 * Description: Core engine for the Jus-Tice legal portal — lawyer directory, lead CRM, articles CPT, practice areas & city taxonomies, REST inspection tools, and premium seeder.
 * Version: 1.0.0
 * Author: Jus-Tice
 * Author URI: https://jus-tice.co.il
 * Text Domain: jus-tice-engine
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * Network: false
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ─── Constants ──────────────────────────────────────────────────────────────
define( 'JTE_VERSION', '1.0.0' );
define( 'JTE_DIR',     plugin_dir_path( __FILE__ ) );
define( 'JTE_URL',     plugin_dir_url( __FILE__ ) );

// ─── Load Modules ───────────────────────────────────────────────────────────
$jte_includes = array(
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

foreach ( $jte_includes as $file ) {
	$path = JTE_DIR . $file;
	if ( file_exists( $path ) ) {
		require_once $path;
	} else {
		error_log( "[Jus-Tice Engine] Missing include: {$path}" );
	}
}

// ─── Activation Hook ────────────────────────────────────────────────────────
register_activation_hook( __FILE__, 'jte_activate' );
function jte_activate(): void {
	$fns = array(
		'jte_register_articles_cpt',
		'jte_register_lawyer_cpt',
		'jte_register_lead_cpt',
		'jte_register_practice_areas_taxonomy',
		'jte_register_city_taxonomy',
	);
	foreach ( $fns as $fn ) {
		if ( function_exists( $fn ) ) {
			$fn();
		}
	}
	flush_rewrite_rules();

	if ( function_exists( 'jte_log' ) ) {
		jte_log( 'activated', 'Jus-Tice Engine v1.0.0 activated.' );
	}
}

// ─── Deactivation Hook ──────────────────────────────────────────────────────
register_deactivation_hook( __FILE__, 'jte_deactivate' );
function jte_deactivate(): void {
	flush_rewrite_rules();
}

// ─── Archive Title Fix ───────────────────────────────────────────────────────
add_filter( 'get_the_archive_title', function ( string $title ): string {
	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		return 'אינדקס עורכי דין בישראל';
	}
	if ( is_post_type_archive( 'articles' ) ) {
		return 'מאמרים ומדריכים משפטיים';
	}
	return $title;
} );
