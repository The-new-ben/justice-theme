<?php
/**
 * Phase-1 SEO recovery content freeze.
 *
 * Automatic generators fail closed by default while the existing content
 * inventory is audited. The freeze is reversible by setting
 * `justice_automatic_content_paused` to 0. One already-scheduled encyclopedia
 * entry is returned to draft with a rollback snapshot retained in an option.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_ops_automatic_content_paused(): bool {
	$paused = (bool) get_option( 'justice_automatic_content_paused', 1 );

	return (bool) apply_filters( 'justice_ops_automatic_content_paused', $paused );
}

/**
 * Return scheduled machine-written encyclopedia entries to draft once.
 *
 * @return array<int,array{id:int,post_date:string,post_date_gmt:string}>
 */
function justice_ops_phase1_freeze_scheduled_terms(): array {
	if ( ! justice_ops_automatic_content_paused() ) {
		return array();
	}

	$existing = get_option( 'justice_phase1_content_freeze_applied_v1', null );
	if ( is_array( $existing ) ) {
		return isset( $existing['posts'] ) && is_array( $existing['posts'] ) ? $existing['posts'] : array();
	}

	$ids = get_posts( array(
		'post_type'      => 'justice_term',
		'post_status'    => 'future',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	) );

	$snapshot = array();
	foreach ( $ids as $id ) {
		$post = get_post( (int) $id );
		if ( ! $post instanceof WP_Post || 'future' !== $post->post_status ) {
			continue;
		}

		$snapshot[] = array(
			'id'            => (int) $post->ID,
			'post_date'     => (string) $post->post_date,
			'post_date_gmt' => (string) $post->post_date_gmt,
		);

		wp_update_post( array(
			'ID'          => (int) $post->ID,
			'post_status' => 'draft',
		) );
	}

	update_option( 'justice_phase1_content_freeze_applied_v1', array(
		'applied_at_utc' => gmdate( 'c' ),
		'posts'          => $snapshot,
	), false );

	return $snapshot;
}
add_action( 'init', 'justice_ops_phase1_freeze_scheduled_terms', 100 );

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/phase1-freeze-status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$frozen = get_option( 'justice_phase1_content_freeze_applied_v1', array() );

			return rest_ensure_response( array(
				'marker'                       => 'seo-recovery-phase1-freeze-v1',
				'automatic_content_paused'     => justice_ops_automatic_content_paused(),
				'news_engine_enabled'           => (int) get_option( 'justice_news_enabled', 1 ),
				'encyclopedia_engine_enabled'   => (int) get_option( 'justice_enc_writer_enabled', 1 ),
				'scheduled_terms_moved_to_draft' => isset( $frozen['posts'] ) && is_array( $frozen['posts'] ) ? count( $frozen['posts'] ) : 0,
				'applied_at_utc'                => isset( $frozen['applied_at_utc'] ) ? (string) $frozen['applied_at_utc'] : '',
			) );
		},
	) );
} );
