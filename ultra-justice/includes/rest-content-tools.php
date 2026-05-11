<?php
/**
 * Justice Core — REST Content Tools
 *
 * Routes:
 *   GET /wp-json/ultra-justice/v1/content/lawyers
 *   GET /wp-json/ultra-justice/v1/content/posts
 *   GET /wp-json/ultra-justice/v1/content/leads
 *   POST /wp-json/ultra-justice/v1/content/update-meta
 *   POST /wp-json/ultra-justice/v1/content/trash-post
 *
 * All routes: admin-only.
 * All writes: logged.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'uj_register_content_routes' );

function uj_register_content_routes(): void {
	$admin_only = function () {
		return current_user_can( 'manage_options' );
	};
	$write_allowed = function () {
		return current_user_can( 'manage_options' ) && (bool) apply_filters( 'uj_enable_rest_content_writes', false );
	};

	// Read routes
	register_rest_route( 'ultra-justice/v1', '/content/lawyers', array(
		'methods'             => 'GET',
		'callback'            => 'uj_content_lawyers',
		'permission_callback' => $admin_only,
		'args'                => array(
			'per_page' => array( 'type' => 'integer', 'default' => 50, 'minimum' => 1, 'maximum' => 200 ),
			'page'     => array( 'type' => 'integer', 'default' => 1, 'minimum' => 1 ),
		),
	) );

	register_rest_route( 'ultra-justice/v1', '/content/posts', array(
		'methods'             => 'GET',
		'callback'            => 'uj_content_posts',
		'permission_callback' => $admin_only,
		'args'                => array(
			'per_page' => array( 'type' => 'integer', 'default' => 50, 'minimum' => 1, 'maximum' => 200 ),
			'page'     => array( 'type' => 'integer', 'default' => 1, 'minimum' => 1 ),
			'status'   => array( 'type' => 'string',  'default' => 'any' ),
		),
	) );

	register_rest_route( 'ultra-justice/v1', '/content/leads', array(
		'methods'             => 'GET',
		'callback'            => 'uj_content_leads',
		'permission_callback' => $admin_only,
	) );

	// Write routes
	register_rest_route( 'ultra-justice/v1', '/content/update-meta', array(
		'methods'             => 'POST',
		'callback'            => 'uj_update_meta',
		'permission_callback' => $write_allowed,
		'args'                => array(
			'post_id'  => array( 'type' => 'integer', 'required' => true ),
			'meta_key' => array( 'type' => 'string',  'required' => true ),
			'meta_val' => array( 'type' => 'string',  'required' => true ),
		),
	) );

	register_rest_route( 'ultra-justice/v1', '/content/trash-post', array(
		'methods'             => 'POST',
		'callback'            => 'uj_trash_post',
		'permission_callback' => $write_allowed,
		'args'                => array(
			'post_id' => array( 'type' => 'integer', 'required' => true ),
			'reason'  => array( 'type' => 'string',  'required' => false, 'default' => 'admin_action' ),
		),
	) );
}

function uj_content_lawyers( WP_REST_Request $request ): WP_REST_Response {
	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => $request->get_param( 'per_page' ),
		'paged'          => $request->get_param( 'page' ),
		'orderby'        => 'meta_value_num',
		'meta_key'       => 'priority_score',
		'order'          => 'DESC',
	) );

	$rows = array();
	foreach ( $query->posts as $post ) {
		$rows[] = array(
			'id'         => $post->ID,
			'title'      => $post->post_title,
			'slug'       => $post->post_name,
			'status'     => $post->post_status,
			'url'        => get_permalink( $post->ID ),
			'plan'       => get_post_meta( $post->ID, 'plan_type', true ),
			'city'       => wp_get_post_terms( $post->ID, 'city', array( 'fields' => 'names' ) ),
			'areas'      => wp_get_post_terms( $post->ID, 'practice-areas', array( 'fields' => 'names' ) ),
			'phone'      => get_post_meta( $post->ID, 'phone', true ),
			'priority'   => get_post_meta( $post->ID, 'priority_score', true ),
			'edit_link'  => admin_url( "post.php?post={$post->ID}&action=edit" ),
		);
	}

	return new WP_REST_Response( array(
		'ok'         => true,
		'total'      => $query->found_posts,
		'pages'      => $query->max_num_pages,
		'count'      => count( $rows ),
		'rows'       => $rows,
	) );
}

function uj_content_posts( WP_REST_Request $request ): WP_REST_Response {
	$status = sanitize_text_field( $request->get_param( 'status' ) );
	$allowed_statuses = array( 'publish', 'draft', 'private', 'any', 'trash' );
	if ( ! in_array( $status, $allowed_statuses, true ) ) {
		$status = 'any';
	}

	$query = new WP_Query( array(
		'post_type'      => array( 'post', 'articles' ),
		'post_status'    => $status,
		'posts_per_page' => $request->get_param( 'per_page' ),
		'paged'          => $request->get_param( 'page' ),
		'orderby'        => 'modified',
		'order'          => 'DESC',
	) );

	$rows = array();
	foreach ( $query->posts as $post ) {
		$rows[] = array(
			'id'       => $post->ID,
			'type'     => $post->post_type,
			'title'    => $post->post_title,
			'status'   => $post->post_status,
			'author'   => get_the_author_meta( 'display_name', $post->post_author ),
			'date'     => $post->post_date,
			'modified' => $post->post_modified,
			'url'      => get_permalink( $post->ID ),
			'edit'     => admin_url( "post.php?post={$post->ID}&action=edit" ),
		);
	}

	return new WP_REST_Response( array(
		'ok'    => true,
		'total' => $query->found_posts,
		'pages' => $query->max_num_pages,
		'count' => count( $rows ),
		'rows'  => $rows,
	) );
}

function uj_content_leads( WP_REST_Request $request ): WP_REST_Response {
	$query = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'publish',
		'posts_per_page' => 100,
		'orderby'        => 'date',
		'order'          => 'DESC',
	) );

	$rows = array();
	foreach ( $query->posts as $post ) {
		$rows[] = array(
			'id'      => $post->ID,
			'title'   => $post->post_title,
			'date'    => $post->post_date,
			'name'    => get_post_meta( $post->ID, 'lead_name',    true ),
			'phone'   => get_post_meta( $post->ID, 'lead_phone',   true ),
			'area'    => get_post_meta( $post->ID, 'lead_area',    true ),
			'city'    => get_post_meta( $post->ID, 'lead_city',    true ),
			'source'  => get_post_meta( $post->ID, 'lead_source',  true ),
		);
	}

	return new WP_REST_Response( array(
		'ok'    => true,
		'count' => count( $rows ),
		'rows'  => $rows,
	) );
}

/**
 * Update a single post meta field (logged write).
 */
function uj_update_meta( WP_REST_Request $request ): WP_REST_Response {
	$post_id  = absint( $request->get_param( 'post_id' ) );
	$meta_key = sanitize_key( $request->get_param( 'meta_key' ) );
	$meta_val = sanitize_text_field( $request->get_param( 'meta_val' ) );

	// Allowed meta keys (whitelist)
	$allowed_keys = array(
		'plan_type', 'priority_score', 'profile_status', 'license_status',
		'verification_status', 'subscription_status', 'lead_routing_enabled',
		'firm_name', 'phone', 'whatsapp', 'email', 'website', 'office_address',
		'years_experience', 'bio_short', 'internal_notes', 'lawyer_full_name',
	);

	if ( ! in_array( $meta_key, $allowed_keys, true ) ) {
		return new WP_REST_Response( array(
			'ok'    => false,
			'error' => "meta_key '{$meta_key}' is not in the allowed whitelist.",
		), 400 );
	}

	$post = get_post( $post_id );
	if ( ! $post ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'Post not found.' ), 404 );
	}

	$old_val = get_post_meta( $post_id, $meta_key, true );
	update_post_meta( $post_id, $meta_key, $meta_val );

	uj_log( 'update_meta', "Updated {$meta_key} on post #{$post_id}", array(
		'post_id'  => $post_id,
		'meta_key' => $meta_key,
		'old_val'  => $old_val,
		'new_val'  => $meta_val,
	) );

	return new WP_REST_Response( array(
		'ok'       => true,
		'post_id'  => $post_id,
		'meta_key' => $meta_key,
		'old_val'  => $old_val,
		'new_val'  => $meta_val,
	) );
}

/**
 * Move a post to trash (logged write). Does NOT permanently delete.
 */
function uj_trash_post( WP_REST_Request $request ): WP_REST_Response {
	$post_id = absint( $request->get_param( 'post_id' ) );
	$reason  = sanitize_text_field( $request->get_param( 'reason' ) );

	$post = get_post( $post_id );
	if ( ! $post ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'Post not found.' ), 404 );
	}

	if ( 'trash' === $post->post_status ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'Post is already in trash.' ), 400 );
	}

	$result = wp_trash_post( $post_id );

	if ( ! $result ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'wp_trash_post failed.' ), 500 );
	}

	uj_log( 'trash_post', "Trashed post #{$post_id}: {$post->post_title}", array(
		'post_id' => $post_id,
		'title'   => $post->post_title,
		'type'    => $post->post_type,
		'reason'  => $reason,
	) );

	return new WP_REST_Response( array(
		'ok'      => true,
		'post_id' => $post_id,
		'title'   => $post->post_title,
		'message' => 'Post moved to trash. Use WP Admin to restore or permanently delete.',
	) );
}

