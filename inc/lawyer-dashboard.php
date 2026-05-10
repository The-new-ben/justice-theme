<?php
/**
 * Lawyer dashboard page seeding.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_seed_lawyer_dashboard_page(): void {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'justice_lawyer_dashboard_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'lawyer-dashboard', OBJECT, 'page' ) ) {
		update_option( 'justice_lawyer_dashboard_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'lawyer-dashboard',
		'post_title'   => 'אזור אישי לעורכי דין',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-lawyer-dashboard.php',
		),
	) );

	update_option( 'justice_lawyer_dashboard_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_lawyer_dashboard_page' );

function justice_theme_handle_lawyer_content_request(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_content_request_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_content_request_nonce'] ) ), 'justice_lawyer_content_request' ) ) {
		wp_safe_redirect( add_query_arg( 'content_request', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'articles' ) || ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'content_request', 'blocked', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id    = get_current_user_id();
	$lawyer_id  = isset( $_POST['lawyer_profile_id'] ) ? absint( $_POST['lawyer_profile_id'] ) : 0;
	$topic      = isset( $_POST['content_topic'] ) ? sanitize_text_field( wp_unslash( $_POST['content_topic'] ) ) : '';
	$intent     = isset( $_POST['content_intent'] ) ? sanitize_text_field( wp_unslash( $_POST['content_intent'] ) ) : '';
	$audience   = isset( $_POST['content_audience'] ) ? sanitize_text_field( wp_unslash( $_POST['content_audience'] ) ) : '';
	$notes      = isset( $_POST['content_notes'] ) ? sanitize_textarea_field( wp_unslash( $_POST['content_notes'] ) ) : '';
	$profile_ok = $lawyer_id && (string) $user_id === (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

	if ( ! $profile_ok || ! $topic ) {
		wp_safe_redirect( add_query_arg( 'content_request', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$body = sprintf(
		"Lawyer content request.\n\nTopic: %s\nIntent: %s\nAudience: %s\nNotes:\n%s\n\nStatus: DRAFT ONLY. Requires editorial, legal and source review before publication.",
		$topic,
		$intent ?: '-',
		$audience ?: '-',
		$notes ?: '-'
	);

	$article_id = wp_insert_post( array(
		'post_type'    => 'articles',
		'post_status'  => 'draft',
		'post_title'   => $topic,
		'post_content' => wpautop( esc_html( $body ) ),
		'post_author'  => $user_id,
	) );

	if ( ! $article_id || is_wp_error( $article_id ) ) {
		wp_safe_redirect( add_query_arg( 'content_request', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	update_post_meta( $article_id, 'content_status', 'lawyer_requested_draft' );
	update_post_meta( $article_id, 'requested_by_lawyer_id', (string) $lawyer_id );
	update_post_meta( $article_id, 'requested_by_user_id', (string) $user_id );
	update_post_meta( $article_id, 'connected_lawyer_slug', get_post_field( 'post_name', $lawyer_id ) );
	update_post_meta( $article_id, 'lawyer_content_intent', $intent );
	update_post_meta( $article_id, 'lawyer_content_audience', $audience );
	update_post_meta( $article_id, 'lawyer_content_notes', $notes );
	update_post_meta( $article_id, 'needs_legal_review', '1' );
	update_post_meta( $article_id, 'needs_browser_source_verification', '1' );
	update_post_meta( $article_id, 'source_note', 'Requested from lawyer dashboard. Draft only; editorial/legal/source review required.' );
	update_post_meta( $article_id, 'primary_keyword', $topic );

	justice_theme_connect_content_request_to_lawyer_taxonomy( $article_id, $lawyer_id );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_content_request', 'New lawyer content request draft: ' . $topic );
	}

	justice_theme_notify_lawyer_content_request( $article_id, $lawyer_id, $topic, $intent, $audience );

	wp_safe_redirect( add_query_arg( 'content_request', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_content_request', 'justice_theme_handle_lawyer_content_request' );

function justice_theme_connect_content_request_to_lawyer_taxonomy( int $article_id, int $lawyer_id ): void {
	if ( ! taxonomy_exists( 'practice-areas' ) ) {
		return;
	}

	$practice_slugs = wp_get_object_terms( $lawyer_id, 'practice-areas', array( 'fields' => 'slugs' ) );

	if ( is_wp_error( $practice_slugs ) || empty( $practice_slugs ) ) {
		return;
	}

	wp_set_object_terms( $article_id, $practice_slugs, 'practice-areas', false );
	update_post_meta( $article_id, 'content_cluster', sanitize_key( (string) $practice_slugs[0] ) );
}

function justice_theme_notify_lawyer_content_request( int $article_id, int $lawyer_id, string $topic, string $intent, string $audience ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$message = sprintf(
		"New lawyer content request created as an article draft.\n\nTopic: %s\nLawyer: %s\nIntent: %s\nAudience: %s\n\nReview draft: %s",
		$topic,
		get_the_title( $lawyer_id ),
		$intent ?: '-',
		$audience ?: '-',
		admin_url( 'post.php?post=' . $article_id . '&action=edit' )
	);

	wp_mail( $admin_email, 'New lawyer content request draft', $message );
}

function justice_theme_lawyer_dashboard_profile_completeness( int $post_id ): int {
	$fields = array(
		'lawyer_full_name',
		'firm_name',
		'bio_short',
		'bio_long',
		'phone',
		'email',
		'whatsapp',
		'cities_served',
		'languages',
		'profile_video_url',
	);

	$filled = 0;
	foreach ( $fields as $field ) {
		if ( get_post_meta( $post_id, $field, true ) ) {
			$filled++;
		}
	}

	return (int) round( ( $filled / count( $fields ) ) * 100 );
}
