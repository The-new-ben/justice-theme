<?php
/**
 * Plugin Name: Justice Core
 * Plugin URI: https://jus-tice.co.il
 * Description: Core engine for Jus-Tice legal portal: lawyer directory, lead CRM, articles CPT, practice areas + city taxonomies, REST inspection tools, and admin bridge.
 * Version: 4.1.0
 * Author: Jus-Tice
 * Author URI: https://jus-tice.co.il
 * Text Domain: justice-core
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_CORE_VERSION', '4.1.0' );
define( 'JUSTICE_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'JUSTICE_CORE_URL', plugin_dir_url( __FILE__ ) );

$justice_core_files = array(
	'includes/security.php',
	'includes/logger.php',
	'includes/cpt-articles.php',
	'includes/cpt-lawyers.php',
	'includes/taxonomy-practice-areas.php',
	'includes/taxonomy-city.php',
	'includes/lead-submissions.php',  // Registers justice_lead CPT + form handler + admin UI
	'includes/seeder.php',
	'includes/rest-health.php',
	'includes/rest-content-tools.php',
	'includes/rest-db-tools.php',
	'includes/admin-pages.php',
	'includes/article-lawyer-bridge.php',
	'includes/family-law-subtopics.php',
	'includes/batch-tagger.php',
	'includes/emergency-run.php',
);


foreach ( $justice_core_files as $justice_core_file ) {
	$justice_core_path = JUSTICE_CORE_DIR . $justice_core_file;
	if ( file_exists( $justice_core_path ) ) {
		require_once $justice_core_path;
	}
}

register_activation_hook( __FILE__, 'justice_core_activate' );
function justice_core_activate() {
	foreach ( array(
		'justice_core_register_articles_cpt',
		'justice_core_register_lawyer_cpt',
		'justice_core_register_lead_cpt',
		'justice_core_register_practice_areas_taxonomy',
		'justice_core_register_city_taxonomy',
	) as $fn ) {
		if ( function_exists( $fn ) ) {
			$fn();
		}
	}
	flush_rewrite_rules();
	justice_core_log( 'activated', 'Justice Core v4.0.0 activated.' );
}

register_deactivation_hook( __FILE__, 'justice_core_deactivate' );
function justice_core_deactivate() {
	flush_rewrite_rules();
	justice_core_log( 'deactivated', 'Justice Core v4.0.0 deactivated.' );
}

/**
 * Fix archive titles — remove WordPress default "Archives: Lawyers".
 */
add_filter( 'get_the_archive_title', function ( $title ) {
	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		return 'אינדקס עורכי דין בישראל';
	}
	if ( is_post_type_archive( 'articles' ) ) {
		return 'מאמרים ומדריכים משפטיים';
	}
	return $title;
} );
