<?php
/**
 * Justice Core — Lead CPT
 *
 * CPT: justice_lead (private CRM)
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_core_register_lead_cpt(): void {
	register_post_type( 'justice_lead', array(
		'labels' => array(
			'name'          => 'פניות לידים',
			'singular_name' => 'פנייה',
			'menu_name'     => 'CRM — פניות',
			'all_items'     => 'כל הפניות',
		),
		'public'             => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'menu_icon'          => 'dashicons-email-alt',
		'menu_position'      => 7,
		'supports'           => array( 'title', 'editor' ),
		'show_in_rest'       => false,
		'publicly_queryable' => false,
		'exclude_from_search'=> true,
		'capability_type'    => 'post',
	) );
}
add_action( 'init', 'justice_core_register_lead_cpt' );

/**
 * Handle lead form submission (front-end form → admin_post action).
 */
function justice_core_handle_lead_submission(): void {
	if ( ! isset( $_POST['justice_lead_nonce'] ) ||
	     ! wp_verify_nonce( $_POST['justice_lead_nonce'], 'justice_submit_lead' ) ) {
		wp_die( 'Invalid request.', 'Security Error', array( 'response' => 403 ) );
	}

	$name    = sanitize_text_field( $_POST['lead_name']    ?? '' );
	$phone   = sanitize_text_field( $_POST['lead_phone']   ?? '' );
	$message = sanitize_textarea_field( $_POST['lead_message'] ?? '' );
	$area    = sanitize_text_field( $_POST['lead_area']    ?? '' );
	$city    = sanitize_text_field( $_POST['lead_city']    ?? '' );
	$referer = wp_get_referer() ?: home_url( '/' );

	if ( empty( $name ) || empty( $phone ) ) {
		wp_safe_redirect( add_query_arg( 'lead_sent', 'error', $referer ) );
		exit;
	}

	$post_id = wp_insert_post( array(
		'post_type'    => 'justice_lead',
		'post_title'   => sprintf( 'פנייה מ-%s | %s | %s', $name, $area, $city ),
		'post_content' => $message,
		'post_status'  => 'publish',
	) );

	if ( $post_id && ! is_wp_error( $post_id ) ) {
		update_post_meta( $post_id, 'lead_name',    $name );
		update_post_meta( $post_id, 'lead_phone',   $phone );
		update_post_meta( $post_id, 'lead_area',    $area );
		update_post_meta( $post_id, 'lead_city',    $city );
		update_post_meta( $post_id, 'lead_message', $message );
		update_post_meta( $post_id, 'lead_source',  $referer );
		update_post_meta( $post_id, 'lead_ip',      sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '' ) );

		justice_core_log( 'lead_submitted', "Lead from {$name}", array(
			'post_id' => $post_id,
			'area'    => $area,
			'city'    => $city,
		) );
	}

	wp_safe_redirect( add_query_arg( 'lead_sent', 'ok', $referer ) );
	exit;
}
add_action( 'admin_post_justice_submit_lead',        'justice_core_handle_lead_submission' );
add_action( 'admin_post_nopriv_justice_submit_lead', 'justice_core_handle_lead_submission' );
