<?php
/**
 * Justice Theme functions.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_THEME_VERSION', '1.0.5' );
define( 'JUSTICE_THEME_DEPLOYMENT_MARKER', '2026-05-11-lawyer-rest-public-guard-v1' );
define( 'JUSTICE_THEME_DIR', get_template_directory() );
define( 'JUSTICE_THEME_URI', get_template_directory_uri() );

$justice_theme_files = array(
	'inc/setup.php',
	'inc/deployment-marker.php',
	'inc/enqueue.php',
	'inc/menu-seed.php',
	'inc/template-tags.php',
	'inc/lawyer-rest-guards.php',
	'inc/breadcrumbs.php',
	'inc/routing-guards.php',
	'inc/diagnostics.php',
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
	'inc/practice-area-icons.php',
);

// ONE-TIME Criminal Law pillar updater (post 857). Remove after use.
add_action('wp_ajax_nopriv_justice_update_857', 'justice_do_update_857');
add_action('wp_ajax_justice_update_857', 'justice_do_update_857');
function justice_do_update_857() {
	if ( get_option('justice_857_done_v4') ) {
		wp_send_json( array( 'done' => get_option('justice_857_done_v4') ) );
	}
	$dir = get_template_directory();
	$p1 = @file_get_contents( $dir . '/criminal-article-part1.html' );
	$p2 = @file_get_contents( $dir . '/criminal-article-part2.html' );
	if ( empty($p1) || empty($p2) ) {
		wp_send_json_error( array( 'msg' => 'missing html', 'dir' => $dir, 'p1' => strlen($p1), 'p2' => strlen($p2) ) );
	}
	$content = $p1 . $p2;
	global $wpdb;
	$title = "\xd7\xa2\xd7\x95\xd7\xa8\xd7\x9a \xd7\x93\xd7\x99\xd7\x9f \xd7\xa4\xd7\x9c\xd7\x99\xd7\x9c\xd7\x99 \xd7\x91\xd7\x99\xd7\xa9\xd7\xa8\xd7\x90\xd7\x9c | \xd7\x9e\xd7\x93\xd7\xa8\xd7\x99\xd7\x9a \xd7\x9e\xd7\x9c\xd7\x90: \xd7\x97\xd7\xa7\xd7\x99\xd7\xa8\xd7\x94, \xd7\x9e\xd7\xa2\xd7\xa6\xd7\xa8, \xd7\x9b\xd7\xaa\xd7\x91 \xd7\x90\xd7\x99\xd7\xa9\xd7\x95\xd7\x9d \xd7\x95\xd7\xa8\xd7\x99\xd7\xa9\xd7\x95\xd7\x9d \xd7\xa4\xd7\x9c\xd7\x99\xd7\x9c\xd7\x99";
	$rows = $wpdb->update( $wpdb->posts, array( 'post_title' => $title, 'post_content' => $content, 'post_modified' => current_time('mysql'), 'post_modified_gmt' => current_time('mysql',true) ), array('ID'=>857), array('%s','%s','%s','%s'), array('%d') );
	if ( $rows === false ) { wp_send_json_error( array('db_err' => $wpdb->last_error) ); }
	clean_post_cache(857);
	update_option( 'justice_857_done_v4', current_time('mysql') );
	wp_send_json_success( array( 'post' => 857, 'len' => strlen($content), 'rows' => $rows ) );
}

foreach ( $justice_theme_files as $justice_theme_file ) {
	$justice_theme_path = JUSTICE_THEME_DIR . '/' . $justice_theme_file;

	if ( file_exists( $justice_theme_path ) ) {
		require_once $justice_theme_path;
	}
}
