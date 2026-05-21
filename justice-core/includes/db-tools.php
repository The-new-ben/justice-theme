<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function justice_core_register_db_routes() {
	register_rest_route( 'justice-core/v1', '/db/summary', array(
		'methods' => 'GET', 'callback' => 'justice_core_db_summary', 'permission_callback' => 'justice_core_agent_permission',
	) );
	register_rest_route( 'justice-core/v1', '/db/posts/search', array(
		'methods' => 'GET', 'callback' => 'justice_core_db_search_posts', 'permission_callback' => 'justice_core_agent_permission',
		'args' => array( 'q' => array( 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ) ),
	) );
}
add_action( 'rest_api_init', 'justice_core_register_db_routes' );

function justice_core_db_summary() {
	global $wpdb;
	return array(
		'articles_publish' => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='articles' AND post_status='publish'" ),
		'posts_publish'    => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='post' AND post_status='publish'" ),
		'pages_publish'    => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='page' AND post_status='publish'" ),
		'terms'            => (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->terms}" ),
	);
}

function justice_core_db_search_posts( WP_REST_Request $r ) {
	global $wpdb;
	$like = '%' . $wpdb->esc_like( $r->get_param( 'q' ) ) . '%';
	$sql  = $wpdb->prepare( "SELECT ID, post_title, post_name, post_type, post_status FROM {$wpdb->posts} WHERE post_type IN ('post','page','articles') AND (post_title LIKE %s OR post_name LIKE %s) ORDER BY post_modified DESC LIMIT 50", $like, $like );
	return array( 'results' => $wpdb->get_results( $sql, ARRAY_A ) );
}
