<?php
/**
 * Cleanup 2026-09 (owner order 2026-09-03): remove the automatic content
 * engines and their output.
 *
 * - The encyclopedia writer and the news engine are no longer loaded; their
 *   cron hooks are cleared.
 * - One-shot: every justice_term entry (any status) is TRASHED, every
 *   auto-news brief is trashed, and an explicit list of thin, zero-demand
 *   pages/posts created since May 2026 is trashed. Trash is reversible for
 *   30 days; nothing is force-deleted. Trashed URLs return 404 (owner rule:
 *   no redirects).
 * - AI-layer state e-mails are off unless jt_ai_notify_email = 1.
 * - Log of everything trashed: option justice_cleanup_2026_09_log.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_cleanup_2026_09_thin_posts(): array {
	return array( 21026, 21031, 21027, 21033, 21032, 21029, 21034, 21035 );
}

function justice_cleanup_2026_09_zero_demand_pages(): array {
	return array( 21337, 20480, 20475, 20471, 20427, 20409, 20406, 20401, 20395, 20389, 20387, 20380, 20372, 20366, 20363, 20361, 20352, 20346, 20323, 20295, 20293, 20255, 20251, 20250, 20249, 20242, 20241, 20240, 20239, 20238, 20223, 20198, 20197 );
}

add_action( 'init', function () {
	wp_clear_scheduled_hook( 'justice_news_tick' );
	wp_clear_scheduled_hook( 'justice_enc_writer_tick' );
}, 5 );

add_action( 'init', function () {
	if ( get_option( 'justice_cleanup_2026_09_done', '' ) ) {
		return;
	}
	if ( ! function_exists( 'wp_trash_post' ) ) {
		return;
	}
	global $wpdb;
	$log = array( 'at' => wp_date( 'Y-m-d H:i:s' ), 'terms' => array(), 'news' => array(), 'thin' => array(), 'pages' => array(), 'skipped' => array() );

	// 1. Every encyclopedia entry, any status except trash/auto-draft.
	$term_ids = $wpdb->get_col( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'justice_term' AND post_status NOT IN ('trash','auto-draft')" );
	foreach ( $term_ids as $id ) {
		if ( wp_trash_post( (int) $id ) ) {
			$log['terms'][] = (int) $id;
		}
	}

	// 2. Auto-news briefs (slug pattern *-legal-news-YYYY-MM-DD-*).
	$news_ids = $wpdb->get_col( "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'post' AND post_status NOT IN ('trash','auto-draft') AND post_name REGEXP '-legal-news-[0-9]{4}-[0-9]{2}-[0-9]{2}'" );
	foreach ( $news_ids as $id ) {
		if ( wp_trash_post( (int) $id ) ) {
			$log['news'][] = (int) $id;
		}
	}

	// 3. Explicit lists: only if the post exists, is published, and was created since 2026-05-01.
	foreach ( array( 'thin' => justice_cleanup_2026_09_thin_posts(), 'pages' => justice_cleanup_2026_09_zero_demand_pages() ) as $bucket => $list ) {
		foreach ( $list as $id ) {
			$p = get_post( (int) $id );
			if ( ! $p || 'publish' !== $p->post_status || $p->post_date < '2026-05-01' ) {
				$log['skipped'][] = (int) $id;
				continue;
			}
			if ( wp_trash_post( (int) $id ) ) {
				$log[ $bucket ][] = (int) $id;
			}
		}
	}

	update_option( 'justice_cleanup_2026_09_log', $log, false );
	update_option( 'justice_cleanup_2026_09_done', wp_date( 'Y-m-d H:i:s' ), false );
	update_option( 'justice_news_enabled', 0, false );
	update_option( 'justice_enc_enabled', 0, false );
}, 99 );

// Status route for verification: GET /wp-json/justice-ops/v1/cleanup-2026-09
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/cleanup-2026-09', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$log = get_option( 'justice_cleanup_2026_09_log', array() );
			$counts = array();
			foreach ( array( 'terms', 'news', 'thin', 'pages', 'skipped' ) as $k ) {
				$counts[ $k ] = isset( $log[ $k ] ) && is_array( $log[ $k ] ) ? count( $log[ $k ] ) : 0;
			}
			return array(
				'version'      => JUSTICE_OPS_VERSION,
				'done_at'      => get_option( 'justice_cleanup_2026_09_done', '' ),
				'counts'       => $counts,
				'news_cron'    => (bool) wp_next_scheduled( 'justice_news_tick' ),
				'enc_cron'     => (bool) wp_next_scheduled( 'justice_enc_writer_tick' ),
				'engines_loaded' => function_exists( 'justice_news_run' ) || function_exists( 'justice_enc_writer_run' ),
			);
		},
	) );
} );
