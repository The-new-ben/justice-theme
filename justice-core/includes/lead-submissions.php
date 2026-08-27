<?php
/**
 * Justice Lead CPT ג€” CRM system.
 *
 * Admin-only CPT for tracking legal inquiries.
 * Stores form submissions + email notification.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register justice_lead CPT (admin-only).
 */
function uje_register_lead_cpt() {
	register_post_type( 'justice_lead', array(
		'labels' => array(
			'name'               => '׳׳™׳“׳™׳',
			'singular_name'      => '׳׳™׳“',
			'menu_name'          => '׳׳™׳“׳™׳',
			'all_items'          => '׳›׳ ׳”׳׳™׳“׳™׳',
			'edit_item'          => '׳¦׳₪׳™׳™׳” ׳‘׳׳™׳“',
			'search_items'       => '׳—׳™׳₪׳•׳© ׳׳™׳“׳™׳',
			'not_found'          => '׳׳ ׳ ׳׳¦׳׳• ׳׳™׳“׳™׳',
		),
		'public'              => false,
		'show_ui'             => true,
		'show_in_rest'        => true,
		'has_archive'         => false,
		'menu_position'       => 7,
		'menu_icon'           => 'dashicons-email-alt',
		'supports'            => array( 'title', 'custom-fields' ),
		'capability_type'     => 'post',
	) );
}
add_action( 'init', 'uje_register_lead_cpt' );

/**
 * Register lead meta fields.
 */
function uje_register_lead_meta() {
	$fields = array(
		'visitor_name'         => 'string',
		'visitor_phone'        => 'string',
		'visitor_email'        => 'string',
		'legal_area'           => 'string',
		'city'                 => 'string',
		'urgency'              => 'string',
		'message'              => 'string',
		'source_url'           => 'string',
		'source_keyword'       => 'string',
		'source_channel'       => 'string',
		'source_system'        => 'string',
		'source_page_url'      => 'string',
		'lead_source_surface'  => 'string',
		'lead_revenue_model'      => 'string',
		'suggested_lead_price_ils' => 'string',
		'lead_revenue_notes'      => 'string',
		'qualified_lead_billing_status' => 'string',
		'owner_revenue_next_step' => 'string',
		'assigned_lawyer_id'   => 'integer',
		'lead_status'          => 'string',
		'follow_up_status'     => 'string',
		'coverage_status'      => 'string',
		'consent_status'       => 'string',
		'consent'              => 'boolean',
		'utm_source'           => 'string',
		'utm_campaign'         => 'string',
		'utm_medium'           => 'string',
		'product_journey_id'   => 'string',
		'product_origin_cluster' => 'string',
		'product_handoff_source' => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lead', $key, array(
			'single' => true,
			'type'   => $type,
		) );
	}
}
add_action( 'init', 'uje_register_lead_meta' );

/**
 * Handle lead form submission.
 */
function uje_handle_lead() {
	if ( empty( $_POST['justice_lead_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lead_nonce'] ) ), 'justice_submit_lead' ) ) {
		wp_die( esc_html__( 'Security check failed.', 'justice-core' ) );
	}

	$name    = isset( $_POST['lead_name'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_name'] ) ) : '';
	$phone   = isset( $_POST['lead_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_phone'] ) ) : '';
	$email   = isset( $_POST['lead_email'] ) ? sanitize_email( wp_unslash( $_POST['lead_email'] ) ) : '';
	$area    = isset( $_POST['lead_area'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_area'] ) ) : '';
	$city    = isset( $_POST['lead_city'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_city'] ) ) : '';
	$message = isset( $_POST['lead_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['lead_message'] ) ) : '';
	$urgency = isset( $_POST['lead_urgency'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_urgency'] ) ) : 'normal';
	$consent = isset( $_POST['lead_consent'] ) ? true : false;
	$assigned_lawyer_id = isset( $_POST['assigned_lawyer_id'] ) ? absint( $_POST['assigned_lawyer_id'] ) : 0;
	$source_keyword     = isset( $_POST['source_keyword'] ) ? sanitize_text_field( wp_unslash( $_POST['source_keyword'] ) ) : '';
	$lead_source_surface = isset( $_POST['lead_source_surface'] ) ? sanitize_key( wp_unslash( $_POST['lead_source_surface'] ) ) : '';
	$lead_source_surface = $lead_source_surface ?: 'public_lead_form';
	$source_url          = wp_get_referer();
	$source_channel      = function_exists( 'justice_theme_public_lead_source_channel' )
		? justice_theme_public_lead_source_channel( $lead_source_surface )
		: ( 0 === strpos( $lead_source_surface, 'homepage_' ) ? 'public_homepage_form' : 'public_site_form' );
	$owner_next_step     = function_exists( 'justice_theme_public_lead_revenue_next_step' )
		? justice_theme_public_lead_revenue_next_step( $lead_source_surface )
		: 'Review this public lead quickly, call or WhatsApp the visitor, confirm legal area and consent, then assign only to a paid/approved lawyer path. Do not mark paid without payment evidence.';
	$product_journey_id = isset( $_POST['product_journey_id'] ) ? wp_unslash( $_POST['product_journey_id'] ) : '';
	$product_journey_id = function_exists( 'justice_theme_sanitize_product_journey_id' )
		? justice_theme_sanitize_product_journey_id( $product_journey_id )
		: ( preg_match( '/^jf-(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/Di', (string) $product_journey_id ) ? strtolower( (string) $product_journey_id ) : '' );
	$product_origin_cluster = isset( $_POST['product_origin_cluster'] ) ? wp_unslash( $_POST['product_origin_cluster'] ) : '';
	$product_origin_cluster = function_exists( 'justice_theme_sanitize_product_handoff_cluster' )
		? justice_theme_sanitize_product_handoff_cluster( $product_origin_cluster )
		: ( in_array( sanitize_key( (string) $product_origin_cluster ), array( 'family-law', 'criminal-law', 'real-estate', 'immigration', 'international-real-estate', 'traffic-law', 'inheritance', 'employment', 'medical-malpractice', 'personal-injury', 'tax' ), true ) ? sanitize_key( (string) $product_origin_cluster ) : '' );
	$product_handoff_source = isset( $_POST['product_handoff_source'] ) ? sanitize_key( wp_unslash( $_POST['product_handoff_source'] ) ) : '';
	if ( '' === $product_journey_id || 'juris-arena' !== $product_handoff_source ) {
		$product_journey_id     = '';
		$product_origin_cluster = '';
		$product_handoff_source = '';
	}

	if ( empty( $name ) || empty( $phone ) ) {
		wp_safe_redirect( add_query_arg( 'lead', 'missing', wp_get_referer() ?: home_url( '/' ) ) );
		exit;
	}

	$lead_id = wp_insert_post( array(
		'post_type'   => 'justice_lead',
		'post_title'  => sprintf( '%s ג€” %s', $name, $area ?: '׳›׳׳׳™' ),
		'post_status' => 'publish',
	) );

	if ( $lead_id && ! is_wp_error( $lead_id ) ) {
		$meta = array(
			'visitor_name'        => $name,
			'visitor_phone'       => $phone,
			'visitor_email'       => $email,
			'legal_area'          => $area,
			'city'                => $city,
			'message'             => $message,
			'urgency'             => $urgency,
			'lead_status'         => 'new',
			'follow_up_status'    => 'not_started',
			'coverage_status'     => 'coverage_review',
			'consent'             => $consent ? '1' : '0',
			'consent_status'      => $consent ? 'explicit_site_form_consent' : 'missing_site_form_consent',
			'source_url'          => $source_url,
			'source_page_url'     => $source_url,
			'source_keyword'      => $source_keyword,
			'source_channel'      => $source_channel,
			'source_system'       => $product_journey_id ? 'justice_juris_handoff' : 'justice_public_site',
			'lead_source_surface' => $lead_source_surface,
			'lead_revenue_model'  => 'public_intake_review',
			'qualified_lead_billing_status' => 'not_ready',
			'lead_revenue_notes'  => 'Public site lead. Qualify need, consent, coverage and lawyer commercial terms before billing.',
			'owner_revenue_next_step' => $owner_next_step,
			'assigned_lawyer_id' => $assigned_lawyer_id,
		);
		if ( $product_journey_id ) {
			$meta['product_journey_id']     = $product_journey_id;
			$meta['product_handoff_source'] = $product_handoff_source;
			if ( $product_origin_cluster ) {
				$meta['product_origin_cluster'] = $product_origin_cluster;
			}
		}

		foreach ( $meta as $key => $value ) {
			update_post_meta( $lead_id, $key, $value );
		}

		// UTM tracking
		foreach ( array( 'utm_source', 'utm_campaign', 'utm_medium' ) as $utm ) {
			if ( isset( $_POST[ $utm ] ) ) {
				update_post_meta( $lead_id, $utm, sanitize_text_field( wp_unslash( $_POST[ $utm ] ) ) );
			}
		}
	}

	// Email notification
	$subject = sprintf( '׳׳™׳“ ׳—׳“׳©: %s ג€” %s', $name, $area ?: '׳›׳׳׳™' );
	$body    = sprintf( "׳©׳: %s\n׳˜׳׳₪׳•׳: %s\n׳׳™׳׳™׳™׳: %s\n׳×׳—׳•׳: %s\n׳¢׳™׳¨: %s\n׳“׳—׳™׳₪׳•׳×: %s\n\n׳”׳•׳“׳¢׳”:\n%s\n\n׳׳§׳•׳¨: %s", $name, $phone, $email, $area, $city, $urgency, $message, wp_get_referer() );
	wp_mail( get_option( 'admin_email' ), $subject, $body );

	wp_safe_redirect( add_query_arg( 'lead', 'success', wp_get_referer() ?: home_url( '/' ) ) );
	exit;
}
add_action( 'admin_post_justice_submit_lead', 'uje_handle_lead' );
add_action( 'admin_post_nopriv_justice_submit_lead', 'uje_handle_lead' );

/**
 * Admin columns for leads.
 */
function uje_lead_admin_columns( $columns ) {
	return array(
		'cb'          => $columns['cb'],
		'title'       => $columns['title'],
		'lead_phone'  => '׳˜׳׳₪׳•׳',
		'lead_area'   => '׳×׳—׳•׳',
		'lead_city'   => '׳¢׳™׳¨',
		'lead_status' => '׳¡׳˜׳˜׳•׳¡',
		'lead_date'   => '׳×׳׳¨׳™׳',
	);
}
add_filter( 'manage_justice_lead_posts_columns', 'uje_lead_admin_columns' );

/**
 * Populate lead columns.
 */
function uje_lead_column_content( $column, $post_id ) {
	switch ( $column ) {
		case 'lead_phone':
			$phone = get_post_meta( $post_id, 'visitor_phone', true );
			echo $phone ? '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ) . '">' . esc_html( $phone ) . '</a>' : 'ג€”';
			break;
		case 'lead_area':
			echo esc_html( get_post_meta( $post_id, 'legal_area', true ) ?: 'ג€”' );
			break;
		case 'lead_city':
			echo esc_html( get_post_meta( $post_id, 'city', true ) ?: 'ג€”' );
			break;
		case 'lead_status':
			$status = get_post_meta( $post_id, 'lead_status', true );
			$labels = array( 'new' => '׳—׳“׳©', 'qualified' => '׳׳•׳¡׳׳', 'assigned' => '׳©׳•׳™׳', 'contacted' => '׳ ׳•׳¦׳¨ ׳§׳©׳¨', 'accepted' => '׳”׳×׳§׳‘׳', 'rejected' => '׳ ׳“׳—׳”', 'converted' => '׳”׳•׳׳¨', 'closed' => '׳¡׳’׳•׳¨' );
			echo esc_html( isset( $labels[ $status ] ) ? $labels[ $status ] : ( $status ?: 'ג€”' ) );
			break;
		case 'lead_date':
			echo esc_html( get_the_date( 'd/m/Y H:i', $post_id ) );
			break;
	}
}
add_action( 'manage_justice_lead_posts_custom_column', 'uje_lead_column_content', 10, 2 );

/**
 * Lead detail meta box.
 */
function uje_lead_meta_boxes() {
	add_meta_box( 'justice_lead_details', '׳₪׳¨׳˜׳™ ׳”׳׳™׳“', 'uje_lead_details_box', 'justice_lead', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'uje_lead_meta_boxes' );

function uje_lead_details_box( $post ) {
	wp_nonce_field( 'justice_lead_status', 'justice_lead_status_nonce' );

	$read_fields = array(
		'visitor_name'        => '׳©׳',
		'visitor_phone'       => '׳˜׳׳₪׳•׳',
		'visitor_email'       => '׳׳™׳׳™׳™׳',
		'legal_area'          => '׳×׳—׳•׳ ׳׳©׳₪׳˜׳™',
		'city'                => '׳¢׳™׳¨',
		'urgency'             => '׳“׳—׳™׳₪׳•׳×',
		'message'             => '׳”׳•׳“׳¢׳”',
		'source_url'          => '׳׳§׳•׳¨',
		'source_keyword'      => 'Source keyword',
		'lead_revenue_model'      => 'Revenue model',
		'suggested_lead_price_ils' => 'Suggested price ILS',
		'lead_revenue_notes'      => 'Revenue notes',
		'assigned_lawyer_id'      => 'Assigned lawyer',
		'utm_source'          => 'UTM Source',
		'utm_campaign'        => 'UTM Campaign',
		'consent'             => '׳”׳¡׳›׳׳”',
	);

	echo '<table class="form-table" style="margin:0;">';
	foreach ( $read_fields as $key => $label ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<tr><th style="width:120px;">' . esc_html( $label ) . '</th><td>';
		if ( 'consent' === $key ) {
			echo $value ? '׳ ׳™׳×׳ ׳” ׳”׳¡׳›׳׳”' : '׳׳׳ ׳”׳¡׳›׳׳”';
		} elseif ( 'visitor_phone' === $key && $value ) {
			echo '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $value ) ) . '">' . esc_html( $value ) . '</a>';
			echo ' | <a href="https://wa.me/972' . esc_attr( ltrim( preg_replace( '/[^0-9]/', '', $value ), '0' ) ) . '" target="_blank">WhatsApp</a>';
		} elseif ( 'message' === $key ) {
			echo '<div style="background:#f9f9f9;padding:10px;border-radius:4px;white-space:pre-wrap;">' . esc_html( $value ) . '</div>';
		} elseif ( 'assigned_lawyer_id' === $key && $value ) {
			$lawyer_title = get_the_title( (int) $value );
			$edit_link    = get_edit_post_link( (int) $value );
			if ( $lawyer_title && $edit_link ) {
				echo '<a href="' . esc_url( $edit_link ) . '">' . esc_html( $lawyer_title ) . '</a>';
			} else {
				echo esc_html( $value );
			}
		} else {
			echo esc_html( $value ?: 'ג€”' );
		}
		echo '</td></tr>';
	}

	// Status selector
	$status = get_post_meta( $post->ID, 'lead_status', true );
	echo '<tr><th>׳¡׳˜׳˜׳•׳¡</th><td><select name="lead_status">';
	$statuses = array( 'new' => '׳—׳“׳©', 'qualified' => '׳׳•׳¡׳׳', 'assigned' => '׳©׳•׳™׳', 'contacted' => '׳ ׳•׳¦׳¨ ׳§׳©׳¨', 'accepted' => '׳”׳×׳§׳‘׳', 'rejected' => '׳ ׳“׳—׳”', 'converted' => '׳”׳•׳׳¨', 'closed' => '׳¡׳’׳•׳¨' );
	foreach ( $statuses as $v => $l ) {
		echo '<option value="' . esc_attr( $v ) . '" ' . selected( $status, $v, false ) . '>' . esc_html( $l ) . '</option>';
	}
	echo '</select></td></tr>';
	echo '</table>';
}

function uje_save_lead_status( $post_id ) {
	$nonce = isset( $_POST['justice_lead_status_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_lead_status_nonce'] ) ) : '';
	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_lead_status' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( isset( $_POST['lead_status'] ) ) {
		update_post_meta( $post_id, 'lead_status', sanitize_text_field( wp_unslash( $_POST['lead_status'] ) ) );
	}
}
add_action( 'save_post_justice_lead', 'uje_save_lead_status' );
