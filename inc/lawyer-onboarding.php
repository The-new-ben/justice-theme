<?php
/**
 * Lawyer self-registration funnel.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_handle_lawyer_registration(): void {
	if ( ! isset( $_POST['justice_lawyer_registration_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_registration_nonce'] ) ), 'justice_lawyer_registration' ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'failed', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	if ( ! empty( $_POST['website_url_confirm'] ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'sent', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'blocked', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$name       = isset( $_POST['lawyer_full_name'] ) ? sanitize_text_field( wp_unslash( $_POST['lawyer_full_name'] ) ) : '';
	$firm       = isset( $_POST['firm_name'] ) ? sanitize_text_field( wp_unslash( $_POST['firm_name'] ) ) : '';
	$bar_number = isset( $_POST['bar_number'] ) ? sanitize_text_field( wp_unslash( $_POST['bar_number'] ) ) : '';
	$phone      = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$email      = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$whatsapp   = isset( $_POST['whatsapp'] ) ? sanitize_text_field( wp_unslash( $_POST['whatsapp'] ) ) : '';
	$website    = isset( $_POST['website'] ) ? esc_url_raw( wp_unslash( $_POST['website'] ) ) : '';
	$languages  = isset( $_POST['languages'] ) ? sanitize_text_field( wp_unslash( $_POST['languages'] ) ) : '';
	$cities     = isset( $_POST['cities_served'] ) ? sanitize_text_field( wp_unslash( $_POST['cities_served'] ) ) : '';
	$bio        = isset( $_POST['bio_short'] ) ? sanitize_textarea_field( wp_unslash( $_POST['bio_short'] ) ) : '';
	$area       = isset( $_POST['practice_area'] ) ? sanitize_key( wp_unslash( $_POST['practice_area'] ) ) : '';
	$plan       = isset( $_POST['plan_interest'] ) ? sanitize_key( wp_unslash( $_POST['plan_interest'] ) ) : 'free';

	if ( ! $name || ! $phone || ! $email || empty( $_POST['consent'] ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'missing', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$post_id = wp_insert_post( array(
		'post_type'    => 'justice_lawyer',
		'post_status'  => 'draft',
		'post_title'   => $name,
		'post_excerpt' => $bio,
		'post_content' => $bio,
	) );

	if ( ! $post_id || is_wp_error( $post_id ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'failed', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$meta = array(
		'lawyer_full_name'     => $name,
		'firm_name'            => $firm,
		'bar_number'           => $bar_number,
		'phone'                => $phone,
		'email'                => $email,
		'whatsapp'             => $whatsapp,
		'website'              => $website,
		'languages'            => $languages,
		'cities_served'        => $cities,
		'bio_short'            => $bio,
		'plan_type'            => in_array( $plan, array( 'free', 'pro', 'featured', 'lead_partner', 'full_service' ), true ) ? $plan : 'free',
		'subscription_status'  => 'pending',
		'verification_status'  => 'pending',
		'profile_status'       => 'pending',
		'source_type'          => 'registration',
		'lead_routing_enabled' => false,
		'internal_notes'       => 'Self-registration submission. Review license, identity, content, ethics and commercial plan before publishing.',
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	if ( $area && taxonomy_exists( 'practice-areas' ) ) {
		wp_set_object_terms( $post_id, $area, 'practice-areas', false );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_registration', 'New lawyer registration draft: ' . $name );
	}

	wp_safe_redirect( add_query_arg( 'registration', 'sent', home_url( '/lawyer-registration/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );
add_action( 'admin_post_nopriv_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );

function justice_theme_seed_lawyer_registration_page(): void {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'justice_lawyer_registration_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'lawyer-registration', OBJECT, 'page' ) ) {
		update_option( 'justice_lawyer_registration_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'lawyer-registration',
		'post_title'   => 'הצטרפות עורכי דין',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-lawyer-registration.php',
		),
	) );

	update_option( 'justice_lawyer_registration_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_lawyer_registration_page' );
