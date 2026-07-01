<?php
/**
 * Justice Theme functions.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_THEME_VERSION', '2.4.0' );
define( 'JUSTICE_DEPLOY_MARKER', '2026-07-02-knowledge-hitl-comms-v1' );
define( 'JUSTICE_THEME_DIR', get_template_directory() );
define( 'JUSTICE_THEME_URI', get_template_directory_uri() );

/**
 * Resolve repo-maintained internal artifacts from dot-prefixed directories.
 *
 * These files are useful to the owner and build agents, but must not sit under
 * normal public paths in the deployed theme directory.
 */
function justice_theme_private_path( string $relative_path ): string {
	$normalized = ltrim( str_replace( '\\', '/', $relative_path ), '/' );
	$map        = array(
		'project-control/'                       => '.project-control/',
		'reports/'                               => '.reports/',
		'content-master/'                        => '.content-master/',
		'content-drafts/'                        => '.content-drafts/',
		'mnt/'                                   => '.mnt/',
		'justice_theme_emergency_master_2026_05_13/' => '.justice_theme_emergency_master_2026_05_13/',
	);

	foreach ( $map as $public_prefix => $private_prefix ) {
		if ( 0 === strpos( $normalized, $public_prefix ) ) {
			return JUSTICE_THEME_DIR . '/' . $private_prefix . substr( $normalized, strlen( $public_prefix ) );
		}
	}

	return JUSTICE_THEME_DIR . '/' . $normalized;
}

$justice_theme_files = array(
	'inc/setup.php',
	'inc/deployment-marker.php',
	'inc/enqueue.php',
	'inc/menu-seed.php',
	'inc/template-tags.php',
	'inc/authority.php',
	'inc/lawyer-rest-guards.php',
	'inc/lawyer-visibility.php',
	'inc/breadcrumbs.php',
	'inc/routing-guards.php',
	'inc/spam-url-guards.php',
	'inc/diagnostics.php',
	'inc/schema.php',
	'inc/eeat.php',
	'inc/ai-crawlers.php',
	'inc/seo.php',
	'inc/accessibility.php',
	'inc/related-content.php',
	'inc/content-clusters.php',
	'inc/cluster-pillar-titles.php',
	'inc/article-archive-controls.php',
	'inc/practice-landing.php',
	'inc/lead-spam-guard.php',
	'inc/lead-ui.php',
	'inc/lead-crm.php',
	'inc/legal-request-fulfillment.php',
	'inc/lead-classifier.php',
	'inc/lead-routing.php',
	'inc/pillar-pages.php',
	'inc/pillar-article-seed.php',
	'inc/content-draft-importer.php',
	'inc/cluster-pillar-content-publisher.php',
	'inc/live-content-publication.php',
	'inc/publication-safety.php',
	'inc/lawyer-recommendations.php',
	'inc/lawyer-suppliers.php',
	'inc/lawyer-prospects.php',
	'inc/lawyer-onboarding.php',
	'inc/lawyer-dashboard.php',
	'inc/lawyer-plans.php',
	'inc/revenue-streams.php',
	'inc/taxonomy-seed.php',
	'inc/city-practice-pages.php',
	'inc/local-money-routes.php',
	'inc/national-insurance-funnel.php',
	'inc/cleanup.php',
	'inc/live-migrations.php',
	'inc/practice-area-icons.php',
	'inc/sitemap.php',
	'inc/html-sitemap.php',
	'inc/not-found-rescue.php',
	'inc/trust-routes.php',
	'inc/payment-compliance-routes.php',
	'inc/url-redirects.php',
	'inc/admin-dashboard.php',
	'inc/legal-tools-app.php',
	'inc/knowledge-api.php',
);


foreach ( $justice_theme_files as $justice_theme_file ) {
	$justice_theme_path = JUSTICE_THEME_DIR . '/' . $justice_theme_file;

	if ( file_exists( $justice_theme_path ) ) {
		require_once $justice_theme_path;
	}
}
