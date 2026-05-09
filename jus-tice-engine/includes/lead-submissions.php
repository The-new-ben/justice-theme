<?php
/**
 * Justice Lead CPT — CRM system.
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
function jte_register_lead_cpt() {
	register_post_type( 'justice_lead', array(
		'labels' => array(
			'name'               => 'לידים',
			'singular_name'      => 'ליד',
			'menu_name'          => 'לידים',
			'all_items'          => 'כל הלידים',
			'edit_item'          => 'צפייה בליד',
			'search_items'       => 'חיפוש לידים',
			'not_found'          => 'לא נמצאו לידים',
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
add_action( 'init', 'jte_register_lead_cpt' );

/**
 * Register lead meta fields.
 */
function jte_register_lead_meta() {
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
		'assigned_lawyer_id'   => 'integer',
		'lead_status'          => 'string',
		'consent'              => 'boolean',
		'utm_source'           => 'string',
		'utm_campaign'         => 'string',
		'utm_medium'           => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lead', $key, array(
			'single' => true,
			'type'   => $type,
		) );
	}
}
add_action( 'init', 'jte_register_lead_meta' );

/**
 * Handle lead form submission.
 */
function jte_handle_lead() {
	if ( empty( $_POST['justice_lead_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lead_nonce'] ) ), 'justice_submit_lead' ) ) {
		wp_die( esc_html__( 'Security check failed.', 'jus-tice-engine' ) );
	}

	$name    = isset( $_POST['lead_name'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_name'] ) ) : '';
	$phone   = isset( $_POST['lead_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_phone'] ) ) : '';
	$email   = isset( $_POST['lead_email'] ) ? sanitize_email( wp_unslash( $_POST['lead_email'] ) ) : '';
	$area    = isset( $_POST['lead_area'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_area'] ) ) : '';
	$city    = isset( $_POST['lead_city'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_city'] ) ) : '';
	$message = isset( $_POST['lead_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['lead_message'] ) ) : '';
	$urgency = isset( $_POST['lead_urgency'] ) ? sanitize_text_field( wp_unslash( $_POST['lead_urgency'] ) ) : 'normal';
	$consent = isset( $_POST['lead_consent'] ) ? true : false;

	if ( empty( $name ) || empty( $phone ) ) {
		wp_safe_redirect( add_query_arg( 'lead', 'missing', wp_get_referer() ?: home_url( '/' ) ) );
		exit;
	}

	$lead_id = wp_insert_post( array(
		'post_type'   => 'justice_lead',
		'post_title'  => sprintf( '%s — %s', $name, $area ?: 'כללי' ),
		'post_status' => 'publish',
	) );

	if ( $lead_id && ! is_wp_error( $lead_id ) ) {
		$meta = array(
			'visitor_name'  => $name,
			'visitor_phone' => $phone,
			'visitor_email' => $email,
			'legal_area'    => $area,
			'city'          => $city,
			'message'       => $message,
			'urgency'       => $urgency,
			'lead_status'   => 'new',
			'consent'       => $consent ? '1' : '0',
			'source_url'    => wp_get_referer(),
		);

		foreach ( $meta as $key => $value ) {
			update_post_meta( $lead_id, $key, $value );
		}

		// UTM tracking
		foreach ( array( 'utm_source', 'utm_campaign', 'utm_medium' ) as $utm ) {
			if ( isset( $_POST[ $utm ] ) ) {
				update_post_meta( $lead_id, $utm, sanitize_text_field( $_POST[ $utm ] ) );
			}
		}
	}

	// Email notification
	$subject = sprintf( 'ליד חדש: %s — %s', $name, $area ?: 'כללי' );
	$body    = sprintf( "שם: %s\nטלפון: %s\nאימייל: %s\nתחום: %s\nעיר: %s\nדחיפות: %s\n\nהודעה:\n%s\n\nמקור: %s", $name, $phone, $email, $area, $city, $urgency, $message, wp_get_referer() );
	wp_mail( get_option( 'admin_email' ), $subject, $body );

	wp_safe_redirect( add_query_arg( 'lead', 'success', wp_get_referer() ?: home_url( '/' ) ) );
	exit;
}
add_action( 'admin_post_justice_submit_lead', 'jte_handle_lead' );
add_action( 'admin_post_nopriv_justice_submit_lead', 'jte_handle_lead' );

/**
 * Admin columns for leads.
 */
function jte_lead_admin_columns( $columns ) {
	return array(
		'cb'          => $columns['cb'],
		'title'       => $columns['title'],
		'lead_phone'  => 'טלפון',
		'lead_area'   => 'תחום',
		'lead_city'   => 'עיר',
		'lead_status' => 'סטטוס',
		'lead_date'   => 'תאריך',
	);
}
add_filter( 'manage_justice_lead_posts_columns', 'jte_lead_admin_columns' );

/**
 * Populate lead columns.
 */
function jte_lead_column_content( $column, $post_id ) {
	switch ( $column ) {
		case 'lead_phone':
			$phone = get_post_meta( $post_id, 'visitor_phone', true );
			echo $phone ? '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ) . '">' . esc_html( $phone ) . '</a>' : '—';
			break;
		case 'lead_area':
			echo esc_html( get_post_meta( $post_id, 'legal_area', true ) ?: '—' );
			break;
		case 'lead_city':
			echo esc_html( get_post_meta( $post_id, 'city', true ) ?: '—' );
			break;
		case 'lead_status':
			$status = get_post_meta( $post_id, 'lead_status', true );
			$labels = array( 'new' => 'חדש', 'qualified' => 'מוסמך', 'assigned' => 'שויך', 'contacted' => 'נוצר קשר', 'accepted' => 'התקבל', 'rejected' => 'נדחה', 'converted' => 'הומר', 'closed' => 'סגור' );
			echo esc_html( isset( $labels[ $status ] ) ? $labels[ $status ] : $status ?: '—' );
			break;
		case 'lead_date':
			echo esc_html( get_the_date( 'd/m/Y H:i', $post_id ) );
			break;
	}
}
add_action( 'manage_justice_lead_posts_custom_column', 'jte_lead_column_content', 10, 2 );

/**
 * Lead detail meta box.
 */
function jte_lead_meta_boxes() {
	add_meta_box( 'justice_lead_details', 'פרטי הליד', 'jte_lead_details_box', 'justice_lead', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'jte_lead_meta_boxes' );

function jte_lead_details_box( $post ) {
	wp_nonce_field( 'justice_lead_status', 'justice_lead_status_nonce' );

	$read_fields = array(
		'visitor_name'  => 'שם',
		'visitor_phone' => 'טלפון',
		'visitor_email' => 'אימייל',
		'legal_area'    => 'תחום משפטי',
		'city'          => 'עיר',
		'urgency'       => 'דחיפות',
		'message'       => 'הודעה',
		'source_url'    => 'מקור',
		'utm_source'    => 'UTM Source',
		'utm_campaign'  => 'UTM Campaign',
		'consent'       => 'הסכמה',
	);

	echo '<table class="form-table" style="margin:0;">';
	foreach ( $read_fields as $key => $label ) {
		$value = get_post_meta( $post->ID, $key, true );
		echo '<tr><th style="width:120px;">' . esc_html( $label ) . '</th><td>';
		if ( 'consent' === $key ) {
			echo $value ? 'ניתנה הסכמה' : 'ללא הסכמה';
		} elseif ( 'visitor_phone' === $key && $value ) {
			echo '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $value ) ) . '">' . esc_html( $value ) . '</a>';
			echo ' | <a href="https://wa.me/972' . esc_attr( ltrim( preg_replace( '/[^0-9]/', '', $value ), '0' ) ) . '" target="_blank">WhatsApp</a>';
		} elseif ( 'message' === $key ) {
			echo '<div style="background:#f9f9f9;padding:10px;border-radius:4px;white-space:pre-wrap;">' . esc_html( $value ) . '</div>';
		} else {
			echo esc_html( $value ?: '—' );
		}
		echo '</td></tr>';
	}

	// Status selector
	$status = get_post_meta( $post->ID, 'lead_status', true );
	echo '<tr><th>סטטוס</th><td><select name="lead_status">';
	$statuses = array( 'new' => 'חדש', 'qualified' => 'מוסמך', 'assigned' => 'שויך', 'contacted' => 'נוצר קשר', 'accepted' => 'התקבל', 'rejected' => 'נדחה', 'converted' => 'הומר', 'closed' => 'סגור' );
	foreach ( $statuses as $v => $l ) {
		echo '<option value="' . esc_attr( $v ) . '" ' . selected( $status, $v, false ) . '>' . esc_html( $l ) . '</option>';
	}
	echo '</select></td></tr>';
	echo '</table>';
}

function jte_save_lead_status( $post_id ) {
	if ( ! isset( $_POST['justice_lead_status_nonce'] ) || ! wp_verify_nonce( $_POST['justice_lead_status_nonce'], 'justice_lead_status' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( isset( $_POST['lead_status'] ) ) {
		update_post_meta( $post_id, 'lead_status', sanitize_text_field( $_POST['lead_status'] ) );
	}
}
add_action( 'save_post_justice_lead', 'jte_save_lead_status' );
