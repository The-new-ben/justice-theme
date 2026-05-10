<?php
/**
 * Justice Theme functions.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_THEME_VERSION', '1.0.2' );
define( 'JUSTICE_THEME_DEPLOYMENT_MARKER', '2026-05-11-public-label-map-v1' );
define( 'JUSTICE_THEME_DIR', get_template_directory() );
define( 'JUSTICE_THEME_URI', get_template_directory_uri() );

$justice_theme_files = array(
	'inc/setup.php',
	'inc/deployment-marker.php',
	'inc/enqueue.php',
	'inc/menu-seed.php',
	'inc/template-tags.php',
	'inc/breadcrumbs.php',
	'inc/routing-guards.php',
	'inc/schema.php',
	'inc/seo.php',
	'inc/accessibility.php',
	'inc/related-content.php',
	'inc/practice-landing.php',
	'inc/lead-spam-guard.php',
	'inc/lead-ui.php',
	'inc/lead-crm.php',
	'inc/lead-classifier.php',
	'inc/pillar-pages.php',
	'inc/pillar-article-seed.php',
	'inc/content-draft-importer.php',
	'inc/live-content-publication.php',
	'inc/publication-safety.php',
	'inc/lawyer-onboarding.php',
	'inc/lawyer-dashboard.php',
	'inc/lawyer-plans.php',
	'inc/taxonomy-seed.php',
	'inc/city-practice-pages.php',
	'inc/cleanup.php',
	'inc/live-migrations.php',
);

foreach ( $justice_theme_files as $justice_theme_file ) {
	$justice_theme_path = JUSTICE_THEME_DIR . '/' . $justice_theme_file;

	if ( file_exists( $justice_theme_path ) ) {
		require_once $justice_theme_path;
	}
}
