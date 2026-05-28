<?php
/**
 * Lawyer self-registration funnel.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_lawyer_activation_meta(): void {
	$fields = array(
		'activation_status'     => 'string',
		'first_value_at'        => 'string',
		'activation_owner_note' => 'string',
		'payment_path'            => 'string',
		'payment_followup_status' => 'string',
		'payment_followup_due_at' => 'string',
		'manual_payment_link_url' => 'string',
		'manual_invoice_reference' => 'string',
		'manual_payment_evidence_url' => 'string',
		'invoice_sent_at'         => 'string',
		'payment_confirmed_at'    => 'string',
		'payment_blocked_at'      => 'string',
		'payment_cancelled_at'    => 'string',
		'lead_response_commitment' => 'string',
		'google_business_profile_url' => 'string',
		'google_place_id'             => 'string',
		'google_review_request_url'   => 'string',
		'google_review_count'         => 'integer',
		'latest_review_date'          => 'string',
		'review_display_enabled'      => 'string',
		'utm_source'                  => 'string',
		'utm_medium'                  => 'string',
		'utm_campaign'                => 'string',
		'utm_content'                 => 'string',
		'utm_term'                    => 'string',
		'outreach_segment'            => 'string',
		'outreach_city'               => 'string',
		'outreach_practice'           => 'string',
		'claim_profile_id'            => 'integer',
		'claim_profile'               => 'string',
		'registration_landing_url'    => 'string',
		'registration_referrer_url'   => 'string',
		'account_continuation_status' => 'string',
		'registration_photo_attachment_id' => 'integer',
		'registration_logo_attachment_id' => 'integer',
		'registration_document_attachment_id' => 'integer',
		'registration_video_attachment_id' => 'integer',
		'pending_upload_review'       => 'string',
		'registration_upload_notes'   => 'string',
		'pending_ai_profile_draft_review' => 'string',
		'profile_ai_draft_sections'   => 'string',
		'pending_service_request'      => 'string',
		'latest_service_request_id'    => 'string',
		'latest_service_request_type'  => 'string',
		'latest_service_request_subject' => 'string',
		'latest_service_request_message' => 'string',
		'latest_service_request_desired_plan' => 'string',
		'latest_service_request_urgency' => 'string',
		'latest_service_request_status' => 'string',
		'latest_service_request_submitted_at' => 'string',
		'latest_service_request_in_review_at' => 'string',
		'latest_service_request_resolved_at' => 'string',
		'latest_service_request_blocked_at' => 'string',
		'account_user_created_at'     => 'string',
		'account_invite_sent_at'      => 'string',
		'account_invite_last_result'  => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lawyer', $key, array(
			'single'            => true,
			'type'              => $type,
			'sanitize_callback' => justice_theme_lawyer_activation_meta_sanitizer( $key ),
			'show_in_rest'      => false,
		) );
	}
}
add_action( 'init', 'justice_theme_register_lawyer_activation_meta' );

function justice_theme_lawyer_response_commitment_options(): array {
	return array(
		''              => 'Not provided',
		'within_15_min' => 'Can respond within 15 minutes during business hours',
		'same_day'      => 'Can respond same business day',
		'next_day'      => 'Usually next business day',
		'not_sure'      => 'Needs response process setup',
	);
}

function justice_theme_lawyer_activation_meta_sanitizer( string $key ): string {
	if ( in_array( $key, array( 'activation_owner_note', 'registration_upload_notes', 'profile_ai_draft_sections', 'latest_service_request_message' ), true ) ) {
		return 'sanitize_textarea_field';
	}

	if ( in_array( $key, array( 'google_business_profile_url', 'google_review_request_url', 'registration_landing_url', 'registration_referrer_url', 'manual_payment_link_url', 'manual_payment_evidence_url' ), true ) ) {
		return 'esc_url_raw';
	}

	if ( in_array( $key, array( 'google_review_count', 'claim_profile_id', 'registration_photo_attachment_id', 'registration_logo_attachment_id', 'registration_document_attachment_id', 'registration_video_attachment_id' ), true ) ) {
		return 'absint';
	}

	return 'sanitize_text_field';
}

function justice_theme_lawyer_registration_attribution_keys(): array {
	return array(
		'utm_source',
		'utm_medium',
		'utm_campaign',
		'utm_content',
		'utm_term',
		'outreach_segment',
		'outreach_city',
		'outreach_practice',
		'claim_profile_id',
		'claim_profile',
		'registration_landing_url',
		'registration_referrer_url',
	);
}

function justice_theme_lawyer_registration_request_value( string $key ): string {
	return isset( $_GET[ $key ] ) ? sanitize_text_field( wp_unslash( $_GET[ $key ] ) ) : '';
}

function justice_theme_lawyer_registration_current_url(): string {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	if ( '' === $request_uri ) {
		return home_url( '/lawyer-registration/' );
	}

	return esc_url_raw( home_url( $request_uri ) );
}

function justice_theme_lawyer_registration_referrer_url(): string {
	$referrer = isset( $_SERVER['HTTP_REFERER'] ) ? (string) wp_unslash( $_SERVER['HTTP_REFERER'] ) : '';
	return $referrer ? esc_url_raw( $referrer ) : '';
}

function justice_theme_lawyer_registration_attribution_from_request(): array {
	$attribution = array(
		'utm_source'                => justice_theme_lawyer_registration_request_value( 'utm_source' ),
		'utm_medium'                => justice_theme_lawyer_registration_request_value( 'utm_medium' ),
		'utm_campaign'              => justice_theme_lawyer_registration_request_value( 'utm_campaign' ),
		'utm_content'               => justice_theme_lawyer_registration_request_value( 'utm_content' ),
		'utm_term'                  => justice_theme_lawyer_registration_request_value( 'utm_term' ),
		'outreach_segment'          => justice_theme_lawyer_registration_request_value( 'outreach_segment' ),
		'outreach_city'             => justice_theme_lawyer_registration_request_value( 'outreach_city' ),
		'outreach_practice'         => justice_theme_lawyer_registration_request_value( 'outreach_practice' ),
		'claim_profile_id'          => (string) absint( justice_theme_lawyer_registration_request_value( 'claim_profile_id' ) ),
		'claim_profile'             => sanitize_title( justice_theme_lawyer_registration_request_value( 'claim_profile' ) ),
		'registration_landing_url'  => justice_theme_lawyer_registration_current_url(),
		'registration_referrer_url' => justice_theme_lawyer_registration_referrer_url(),
	);

	$aliases = array(
		'source'   => 'utm_source',
		'medium'   => 'utm_medium',
		'campaign' => 'utm_campaign',
		'segment'  => 'outreach_segment',
		'city'     => 'outreach_city',
		'practice' => 'outreach_practice',
	);

	foreach ( $aliases as $query_key => $target_key ) {
		if ( '' === $attribution[ $target_key ] ) {
			$attribution[ $target_key ] = justice_theme_lawyer_registration_request_value( $query_key );
		}
	}

	return $attribution;
}

function justice_theme_lawyer_registration_attribution_from_post(): array {
	$attribution = array();

	foreach ( justice_theme_lawyer_registration_attribution_keys() as $key ) {
		$value = '';
		if ( isset( $_POST[ $key ] ) ) {
			$value = in_array( $key, array( 'registration_landing_url', 'registration_referrer_url' ), true )
				? esc_url_raw( wp_unslash( $_POST[ $key ] ) )
				: sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
		}
		$attribution[ $key ] = $value;
	}

	return $attribution;
}

function justice_theme_render_lawyer_registration_attribution_fields( array $attribution ): void {
	foreach ( justice_theme_lawyer_registration_attribution_keys() as $key ) {
		if ( empty( $attribution[ $key ] ) ) {
			continue;
		}
		printf(
			'<input type="hidden" name="%s" value="%s">' . "\n",
			esc_attr( $key ),
			esc_attr( $attribution[ $key ] )
		);
	}
}

function justice_theme_lawyer_registration_attribution_summary( array $attribution ): string {
	$summary_keys = array(
		'utm_source',
		'utm_medium',
		'utm_campaign',
		'outreach_segment',
		'outreach_city',
		'outreach_practice',
		'claim_profile_id',
		'claim_profile',
	);
	$parts = array();

	foreach ( $summary_keys as $key ) {
		if ( ! empty( $attribution[ $key ] ) ) {
			$parts[] = $key . '=' . $attribution[ $key ];
		}
	}

	return implode( '; ', $parts );
}

function justice_theme_lawyer_registration_attribution_for_post( int $post_id ): array {
	$attribution = array();

	foreach ( justice_theme_lawyer_registration_attribution_keys() as $key ) {
		$attribution[ $key ] = (string) get_post_meta( $post_id, $key, true );
	}

	return $attribution;
}

function justice_theme_lawyer_claim_target_from_attribution( array $attribution ): array {
	$claim_profile_id   = absint( $attribution['claim_profile_id'] ?? 0 );
	$claim_profile_slug = sanitize_title( (string) ( $attribution['claim_profile'] ?? '' ) );
	$claim_profile      = null;

	if ( $claim_profile_id ) {
		$candidate = get_post( $claim_profile_id );
		if ( $candidate instanceof WP_Post && 'justice_lawyer' === $candidate->post_type ) {
			$claim_profile = $candidate;
		}
	}

	if ( ! $claim_profile && $claim_profile_slug ) {
		$candidate = get_page_by_path( $claim_profile_slug, OBJECT, 'justice_lawyer' );
		if ( $candidate instanceof WP_Post ) {
			$claim_profile = $candidate;
		}
	}

	if ( ! $claim_profile instanceof WP_Post ) {
		return array(
			'id'         => 0,
			'slug'       => $claim_profile_slug,
			'title'      => '',
			'edit_url'   => '',
			'public_url' => '',
			'status'     => '',
		);
	}

	return array(
		'id'         => (int) $claim_profile->ID,
		'slug'       => (string) $claim_profile->post_name,
		'title'      => get_the_title( $claim_profile ),
		'edit_url'   => get_edit_post_link( (int) $claim_profile->ID, '' ) ?: '',
		'public_url' => get_permalink( $claim_profile ) ?: '',
		'status'     => (string) get_post_meta( (int) $claim_profile->ID, 'profile_status', true ),
	);
}

function justice_theme_lawyer_claim_target_for_post( int $post_id ): array {
	return justice_theme_lawyer_claim_target_from_attribution( justice_theme_lawyer_registration_attribution_for_post( $post_id ) );
}

function justice_theme_lawyer_claim_queue_meta_query(): array {
	return array(
		'key'     => 'claim_profile_id',
		'value'   => 0,
		'compare' => '>',
		'type'    => 'NUMERIC',
	);
}

function justice_theme_lawyer_registration_upload_fields(): array {
	$five_mb       = 5 * 1024 * 1024;
	$twentyfive_mb = 25 * 1024 * 1024;

	return array(
		'profile_photo_upload' => array(
			'label'    => 'Profile photo',
			'meta_key' => 'registration_photo_attachment_id',
			'max_size' => $five_mb,
			'mimes'    => array(
				'jpg|jpeg' => 'image/jpeg',
				'png'      => 'image/png',
				'webp'     => 'image/webp',
			),
		),
		'profile_logo_upload'  => array(
			'label'    => 'Firm logo',
			'meta_key' => 'registration_logo_attachment_id',
			'max_size' => $five_mb,
			'mimes'    => array(
				'jpg|jpeg' => 'image/jpeg',
				'png'      => 'image/png',
				'webp'     => 'image/webp',
			),
		),
		'profile_document_upload' => array(
			'label'    => 'Public document or firm brochure',
			'meta_key' => 'registration_document_attachment_id',
			'max_size' => $five_mb,
			'mimes'    => array(
				'pdf'      => 'application/pdf',
				'jpg|jpeg' => 'image/jpeg',
				'png'      => 'image/png',
				'webp'     => 'image/webp',
			),
		),
		'profile_video_upload' => array(
			'label'    => 'Intro video file',
			'meta_key' => 'registration_video_attachment_id',
			'max_size' => $twentyfive_mb,
			'mimes'    => array(
				'mp4'  => 'video/mp4',
				'webm' => 'video/webm',
				'mov'  => 'video/quicktime',
			),
		),
	);
}

function justice_theme_handle_lawyer_registration_uploads( int $post_id ): array {
	$results = array(
		'uploaded' => array(),
		'blocked'  => array(),
	);

	if ( empty( $_FILES ) ) {
		return $results;
	}

	if ( ! function_exists( 'media_handle_upload' ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
	}

	$wp_limit = function_exists( 'wp_max_upload_size' ) ? (int) wp_max_upload_size() : PHP_INT_MAX;

	foreach ( justice_theme_lawyer_registration_upload_fields() as $field => $config ) {
		if ( empty( $_FILES[ $field ] ) || ! is_array( $_FILES[ $field ] ) ) {
			continue;
		}

		$file = $_FILES[ $field ];
		$error = isset( $file['error'] ) ? (int) $file['error'] : UPLOAD_ERR_NO_FILE;

		if ( UPLOAD_ERR_NO_FILE === $error ) {
			continue;
		}

		$label = (string) $config['label'];
		$limit = min( (int) $config['max_size'], $wp_limit );
		$size  = isset( $file['size'] ) ? (int) $file['size'] : 0;

		if ( UPLOAD_ERR_OK !== $error ) {
			$results['blocked'][] = sprintf( '%s upload failed with code %s.', $label, $error );
			continue;
		}

		if ( $size > $limit ) {
			$results['blocked'][] = sprintf( '%s exceeded the %s MB upload limit.', $label, round( $limit / 1024 / 1024, 1 ) );
			continue;
		}

		$attachment_id = media_handle_upload(
			$field,
			$post_id,
			array(
				'post_title' => get_the_title( $post_id ) . ' - ' . $label,
			),
			array(
				'test_form' => false,
				'mimes'     => $config['mimes'],
			)
		);

		if ( is_wp_error( $attachment_id ) ) {
			$results['blocked'][] = sprintf( '%s upload was blocked: %s', $label, $attachment_id->get_error_message() );
			continue;
		}

		update_post_meta( $post_id, (string) $config['meta_key'], (int) $attachment_id );
		$results['uploaded'][] = array(
			'label'         => $label,
			'attachment_id' => (int) $attachment_id,
			'url'           => wp_get_attachment_url( (int) $attachment_id ) ?: '',
		);
	}

	return $results;
}

function justice_theme_lawyer_registration_upload_notes( array $upload_results ): string {
	$lines = array();

	foreach ( $upload_results['uploaded'] ?? array() as $upload ) {
		$lines[] = sprintf( 'Uploaded for owner review: %s (#%s).', $upload['label'] ?? 'file', $upload['attachment_id'] ?? '-' );
	}

	foreach ( $upload_results['blocked'] ?? array() as $blocked ) {
		$lines[] = 'Blocked upload: ' . $blocked;
	}

	return implode( "\n", $lines );
}

function justice_theme_lawyer_registration_assistant_draft( array $meta, array $upload_results = array() ): string {
	$lines = array(
		'AI-assistant profile draft scaffold - owner/legal/ethics review required before public use.',
		'',
		'Suggested headline:',
		$meta['profile_headline'] ?: trim( sprintf( '%s%s', $meta['firm_name'] ? $meta['firm_name'] . ' - ' : '', $meta['lawyer_full_name'] ?? '' ) ),
		'',
		'Public summary source:',
		$meta['bio_short'] ?: 'No short bio supplied. Owner should request a factual practice summary before publishing.',
		'',
		'Services to shape into profile sections:',
		$meta['profile_services'] ?: 'No service list supplied.',
		'',
		'Work process to shape into profile sections:',
		$meta['profile_process'] ?: 'No process text supplied.',
		'',
		'FAQ material:',
		$meta['profile_faqs'] ?: 'No FAQ material supplied.',
		'',
		'Trust and evidence checklist:',
		'- Verify bar number and identity before publishing.',
		'- Check every specialty, experience and outcome-related claim.',
		'- Review Google Business/review links before any reputation workflow.',
		'- Do not use uploaded files as private identity storage; verify license externally from the bar number.',
	);

	if ( ! empty( $upload_results['uploaded'] ) ) {
		$lines[] = '- Uploaded assets are attached to the draft and pending owner review.';
	}

	if ( ! empty( $upload_results['blocked'] ) ) {
		$lines[] = '- Some uploads were blocked; contact the lawyer if the material is required.';
	}

	return trim( implode( "\n", $lines ) );
}

function justice_theme_lawyer_registration_unique_username( string $email, string $fallback_name ): string {
	$email_parts  = explode( '@', $email );
	$email_prefix = sanitize_user( $email_parts[0] ?? '', true );
	$name_slug    = sanitize_user( sanitize_title( $fallback_name ), true );
	$base         = $email_prefix ?: $name_slug ?: 'lawyer';
	$username     = $base;
	$index        = 2;

	while ( username_exists( $username ) ) {
		$username = $base . '-' . $index;
		++$index;
	}

	return $username;
}

function justice_theme_send_lawyer_account_invite( WP_User $user, int $post_id, bool $created ): bool {
	$key = get_password_reset_key( $user );
	if ( is_wp_error( $key ) ) {
		update_post_meta( $post_id, 'account_invite_last_result', 'reset_key_failed' );
		justice_theme_append_lawyer_internal_note( $post_id, 'Account invite failed: could not create password setup key.' );
		return false;
	}

	$reset_url     = network_site_url( 'wp-login.php?action=rp&key=' . rawurlencode( $key ) . '&login=' . rawurlencode( $user->user_login ), 'login' );
	$dashboard_url = function_exists( 'justice_theme_public_url' )
		? justice_theme_public_url( home_url( '/lawyer-dashboard/' ) )
		: home_url( '/lawyer-dashboard/' );
	$plans_url     = function_exists( 'justice_theme_public_url' )
		? justice_theme_public_url( home_url( '/lawyer-plans/' ) )
		: home_url( '/lawyer-plans/' );
	$subject       = $created ? 'Jus-Tice account setup for your lawyer dashboard' : 'Jus-Tice dashboard login setup';
	$message       = sprintf(
		"Hello,\n\nYour Jus-Tice lawyer profile request was received.\n\nSet or reset your password here:\n%s\n\nAfter setting the password, open your lawyer dashboard:\n%s\n\nYou can use the dashboard to prepare profile material, follow assigned leads, request content/profile updates, and submit billing, upgrade, downgrade, cancellation, refund, invoice or complaint requests.\n\nSelected plans are reviewed before publication. Paid plans are activated only after payment approval.\n\nPlan information:\n%s\n\nJus-Tice.co.il",
		$reset_url,
		$dashboard_url,
		$plans_url
	);
	$headers       = array(
		'Content-Type: text/plain; charset=UTF-8',
		'From: Jus-Tice.co.il <info@jus-tice.co.il>',
	);
	$sent          = wp_mail( $user->user_email, $subject, $message, $headers );

	update_post_meta( $post_id, 'account_invite_last_result', $sent ? 'sent' : 'wp_mail_failed' );

	if ( $sent ) {
		update_post_meta( $post_id, 'account_invite_sent_at', current_time( 'mysql' ) );
		justice_theme_append_lawyer_internal_note( $post_id, 'Account setup email sent to ' . $user->user_email . '.' );
	} else {
		justice_theme_append_lawyer_internal_note( $post_id, 'Account setup email failed through wp_mail for ' . $user->user_email . '.' );
	}

	return $sent;
}

function justice_theme_create_or_link_lawyer_registration_account( int $post_id, string $name, string $email ): array {
	$result = array(
		'user_id' => 0,
		'status'  => 'needs_owner_invite',
	);

	if ( ! is_email( $email ) ) {
		return $result;
	}

	$user    = get_user_by( 'email', $email );
	$created = false;

	if ( ! $user ) {
		$user_id = wp_insert_user( array(
			'user_login'   => justice_theme_lawyer_registration_unique_username( $email, $name ),
			'user_email'   => $email,
			'display_name' => $name,
			'nickname'     => $name,
			'role'         => 'subscriber',
			'user_pass'    => wp_generate_password( 32, true, true ),
		) );

		if ( is_wp_error( $user_id ) || ! $user_id ) {
			update_post_meta( $post_id, 'account_invite_last_result', 'user_create_failed' );
			justice_theme_append_lawyer_internal_note( $post_id, 'Account creation failed for ' . $email . '.' );
			return array(
				'user_id' => 0,
				'status'  => 'account_create_failed',
			);
		}

		$user    = get_user_by( 'id', (int) $user_id );
		$created = true;
		update_post_meta( $post_id, 'account_user_created_at', current_time( 'mysql' ) );
	}

	if ( ! $user instanceof WP_User ) {
		return $result;
	}

	$sent = justice_theme_send_lawyer_account_invite( $user, $post_id, $created );

	return array(
		'user_id' => (int) $user->ID,
		'status'  => $created
			? ( $sent ? 'account_created_invite_sent' : 'account_created_invite_failed' )
			: ( $sent ? 'existing_account_invite_sent' : 'existing_account_invite_failed' ),
	);
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
	$headline   = isset( $_POST['profile_headline'] ) ? sanitize_text_field( wp_unslash( $_POST['profile_headline'] ) ) : '';
	$services   = isset( $_POST['profile_services'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_services'] ) ) : '';
	$process    = isset( $_POST['profile_process'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_process'] ) ) : '';
	$video_url  = isset( $_POST['profile_video_url'] ) ? esc_url_raw( wp_unslash( $_POST['profile_video_url'] ) ) : '';
	$faqs       = isset( $_POST['profile_faqs'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_faqs'] ) ) : '';
	$area       = isset( $_POST['practice_area'] ) ? sanitize_key( wp_unslash( $_POST['practice_area'] ) ) : '';
	$plan         = isset( $_POST['plan_interest'] ) ? sanitize_key( wp_unslash( $_POST['plan_interest'] ) ) : 'free';
	$payment_path = isset( $_POST['payment_path'] ) ? sanitize_key( wp_unslash( $_POST['payment_path'] ) ) : '';
	$response_commitment = isset( $_POST['lead_response_commitment'] ) ? sanitize_key( wp_unslash( $_POST['lead_response_commitment'] ) ) : '';
	$google_business_url = isset( $_POST['google_business_profile_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_business_profile_url'] ) ) : '';
	$google_review_url   = isset( $_POST['google_review_request_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_review_request_url'] ) ) : '';
	$billing_legal_name     = isset( $_POST['billing_legal_name'] ) ? sanitize_text_field( wp_unslash( $_POST['billing_legal_name'] ) ) : '';
	$billing_business_id    = isset( $_POST['billing_business_id'] ) ? sanitize_text_field( wp_unslash( $_POST['billing_business_id'] ) ) : '';
	$billing_invoice_email  = isset( $_POST['billing_invoice_email'] ) ? sanitize_email( wp_unslash( $_POST['billing_invoice_email'] ) ) : '';
	$billing_invoice_address = isset( $_POST['billing_invoice_address'] ) ? sanitize_text_field( wp_unslash( $_POST['billing_invoice_address'] ) ) : '';
	$attribution         = justice_theme_lawyer_registration_attribution_from_post();
	$account_status      = is_user_logged_in() ? 'linked_current_user' : 'account_invite_pending';
	$claimed_user_id     = is_user_logged_in() ? get_current_user_id() : 0;

	if ( ! array_key_exists( $response_commitment, justice_theme_lawyer_response_commitment_options() ) ) {
		$response_commitment = '';
	}

	if ( 'manual_invoice' !== $payment_path ) {
		$payment_path = '';
	}

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

	if ( ! is_user_logged_in() ) {
		$account_result  = justice_theme_create_or_link_lawyer_registration_account( (int) $post_id, $name, $email );
		$account_status  = $account_result['status'];
		$claimed_user_id = (int) $account_result['user_id'];
	}

	$plan_type = in_array( $plan, array( 'free', 'pro', 'featured', 'lead_partner', 'full_service' ), true ) ? $plan : 'free';

	if (
		'free' !== $plan_type
		&& '' === $payment_path
		&& (
			! function_exists( 'justice_theme_plan_checkout_ready' )
			|| ! justice_theme_plan_checkout_ready( $plan_type )
		)
	) {
		$payment_path = 'manual_invoice';
	}

	$manual_payment = 'manual_invoice' === $payment_path && 'free' !== $plan_type;
	$internal_notes = 'Self-registration submission. Review license, identity, content, ethics and commercial plan before publishing.';
	$claim_target   = justice_theme_lawyer_claim_target_from_attribution( $attribution );

	if ( $manual_payment ) {
		$internal_notes .= "\nManual invoice path requested or automatically assigned because paid checkout is not ready. Create Morning/Grow invoice/payment instructions after review, then activate only after payment confirmation.";

		if ( $billing_legal_name || $billing_business_id || $billing_invoice_email || $billing_invoice_address ) {
			$internal_notes .= "\nBilling details supplied: " . implode( ' | ', array_filter( array(
				$billing_legal_name ? 'legal_name=' . $billing_legal_name : '',
				$billing_business_id ? 'business_id=' . $billing_business_id : '',
				$billing_invoice_email ? 'invoice_email=' . $billing_invoice_email : '',
				$billing_invoice_address ? 'invoice_address=' . $billing_invoice_address : '',
			) ) );
		}
	}

	if ( $response_commitment ) {
		$internal_notes .= "\nLead response commitment: " . justice_theme_lawyer_response_commitment_options()[ $response_commitment ];
	}

	if ( $google_business_url || $google_review_url ) {
		$internal_notes .= "\nGoogle reputation sources supplied during registration. Verify ownership and policy compliance before public display or review outreach.";
	}

	$internal_notes .= is_user_logged_in()
		? "\nAccount continuation: registration linked to the current logged-in user for dashboard follow-up."
		: "\nAccount continuation: " . str_replace( '_', ' ', $account_status ) . '.';

	$attribution_summary = justice_theme_lawyer_registration_attribution_summary( $attribution );
	if ( $attribution_summary ) {
		$internal_notes .= "\nAttribution: " . $attribution_summary;
	}

	if ( ! empty( $claim_target['id'] ) ) {
		$internal_notes .= sprintf(
			"\nClaim request: this registration is asking to take over public card #%s (%s). Verify identity/authority before changing the public card or connecting paid placement.",
			$claim_target['id'],
			$claim_target['title'] ?: $claim_target['slug']
		);
	}

	$meta = array_merge( array(
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
		'profile_headline'     => $headline,
		'profile_subheadline'  => $bio,
		'profile_services'     => $services,
		'profile_process'      => $process,
		'profile_video_url'    => $video_url,
		'profile_faqs'         => $faqs,
		'google_business_profile_url' => $google_business_url,
		'google_review_request_url'   => $google_review_url,
		'billing_legal_name'          => $billing_legal_name,
		'billing_business_id'         => $billing_business_id,
		'billing_invoice_email'       => $billing_invoice_email,
		'billing_invoice_address'     => $billing_invoice_address,
		'plan_type'            => $plan_type,
		'subscription_status'  => 'pending',
		'payment_path'            => $manual_payment ? 'manual_invoice' : '',
		'payment_followup_status' => $manual_payment ? 'invoice_requested' : '',
		'payment_followup_due_at' => $manual_payment ? justice_theme_lawyer_payment_followup_due_for_status( 'invoice_requested' ) : '',
		'lead_response_commitment' => $response_commitment,
		'verification_status'  => 'pending',
		'profile_status'       => 'pending',
		'activation_status'    => 'registered',
		'first_value_at'       => '',
		'activation_owner_note' => '',
		'account_continuation_status' => $account_status,
		'claimed_by_user_id'   => $claimed_user_id,
		'source_type'          => 'registration',
		'lead_routing_enabled' => false,
		'internal_notes'       => $internal_notes,
	), $attribution );

	foreach ( $meta as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	$upload_results = justice_theme_handle_lawyer_registration_uploads( $post_id );
	$upload_notes   = justice_theme_lawyer_registration_upload_notes( $upload_results );

	if ( $upload_notes ) {
		update_post_meta( $post_id, 'pending_upload_review', '1' );
		update_post_meta( $post_id, 'registration_upload_notes', $upload_notes );
		justice_theme_append_lawyer_internal_note( $post_id, $upload_notes );
		$meta['pending_upload_review']     = '1';
		$meta['registration_upload_notes'] = $upload_notes;
	} else {
		$meta['pending_upload_review']     = '';
		$meta['registration_upload_notes'] = '';
	}

	$assistant_draft = justice_theme_lawyer_registration_assistant_draft( $meta, $upload_results );
	if ( $assistant_draft ) {
		update_post_meta( $post_id, 'pending_ai_profile_draft_review', '1' );
		update_post_meta( $post_id, 'profile_ai_draft_sections', $assistant_draft );
		justice_theme_append_lawyer_internal_note( $post_id, 'AI-assistant profile draft scaffold generated for owner review. No public profile text changed automatically.' );
		$meta['pending_ai_profile_draft_review'] = '1';
		$meta['profile_ai_draft_sections']       = $assistant_draft;
	}

	if ( $area && taxonomy_exists( 'practice-areas' ) ) {
		wp_set_object_terms( $post_id, $area, 'practice-areas', false );
	}

	justice_theme_assign_registration_city_terms( $post_id, $cities );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_registration', 'New lawyer registration draft: ' . $name );
	}

	justice_theme_notify_lawyer_registration( $post_id, $meta );

	$redirect_args = array(
		'registration'  => 'sent',
		'plan_interest' => $meta['plan_type'],
	);

	if ( ! empty( $meta['payment_path'] ) ) {
		$redirect_args['payment_path'] = $meta['payment_path'];
	}

	foreach ( array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'outreach_segment', 'outreach_city', 'outreach_practice' ) as $attribution_key ) {
		if ( ! empty( $meta[ $attribution_key ] ) ) {
			$redirect_args[ $attribution_key ] = $meta[ $attribution_key ];
		}
	}

	wp_safe_redirect( add_query_arg( $redirect_args, home_url( '/lawyer-registration/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );
add_action( 'admin_post_nopriv_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );

function justice_theme_assign_registration_city_terms( int $post_id, string $cities ): void {
	if ( ! taxonomy_exists( 'city' ) || '' === trim( $cities ) ) {
		return;
	}

	$city_map = array(
		'תל אביב'     => 'tel-aviv',
		'ת"א'         => 'tel-aviv',
		'תל-אביב'     => 'tel-aviv',
		'ירושלים'     => 'jerusalem',
		'חיפה'         => 'haifa',
		'ראשון לציון' => 'rishon-lezion',
		'פתח תקווה'   => 'petah-tikva',
		'אשדוד'       => 'ashdod',
		'נתניה'       => 'netanya',
		'באר שבע'     => 'beer-sheva',
		'חולון'       => 'holon',
		'בני ברק'     => 'bnei-brak',
		'רמת גן'      => 'ramat-gan',
		'אשקלון'      => 'ashkelon',
		'רחובות'      => 'rehovot',
		'בת ים'       => 'bat-yam',
		'הרצליה'      => 'herzliya',
		'כפר סבא'     => 'kfar-saba',
		'מודיעין'     => 'modiin',
		'נצרת'        => 'nazareth',
		'לוד'          => 'lod',
		'רמלה'        => 'ramla',
	);

	$parts = preg_split( '/[,،;|]+/u', $cities ) ?: array();
	$slugs = array();

	foreach ( $parts as $part ) {
		$city = trim( $part );
		if ( '' === $city ) {
			continue;
		}

		$slug = $city_map[ $city ] ?? sanitize_title( $city );
		$term = get_term_by( 'slug', $slug, 'city' );

		if ( ! $term && isset( $city_map[ $city ] ) ) {
			$inserted = wp_insert_term( $city, 'city', array( 'slug' => $slug ) );
			if ( ! is_wp_error( $inserted ) ) {
				$term = get_term_by( 'id', (int) $inserted['term_id'], 'city' );
			}
		}

		if ( $term && ! is_wp_error( $term ) ) {
			$slugs[] = $term->slug;
		}
	}

	if ( ! empty( $slugs ) ) {
		wp_set_object_terms( $post_id, array_values( array_unique( $slugs ) ), 'city', false );
	}
}

function justice_theme_notify_lawyer_registration( int $post_id, array $meta ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$plan              = $meta['plan_type'] ?? '';
	$expected_monthly  = justice_theme_lawyer_outreach_expected_monthly_nis( (string) $plan );
	$payment_path      = $meta['payment_path'] ?? '';
	$followup_status   = $meta['payment_followup_status'] ?? '';
	$followup_due_at   = $meta['payment_followup_due_at'] ?? '';
	$manual_paid       = 'manual_invoice' === $payment_path && 'free' !== $plan;
	$claim_target      = justice_theme_lawyer_claim_target_from_attribution( $meta );
	$invoice_queue_url = add_query_arg(
		array(
			'page'          => 'justice-lawyer-onboarding',
			'payment_queue' => $followup_status ?: 'invoice_requested',
		),
		admin_url( 'admin.php' )
	);
	$plan_payments_url = admin_url( 'admin.php?page=justice-lawyer-plan-payments' );
	$review_url        = admin_url( 'post.php?post=' . $post_id . '&action=edit' );
	$next_action       = $manual_paid
		? 'Verify license/commercial fit, send the manual invoice handoff, then mark invoice sent or paid in Lawyer Onboarding.'
		: 'Review license, identity, content and plan before publishing or activating profile access.';
	$subject           = $manual_paid
		? sprintf( 'Paid lawyer registration needs invoice - %s NIS/mo', number_format_i18n( $expected_monthly ) )
		: 'New lawyer registration pending review';
	$message = sprintf(
		"New lawyer registration draft is waiting for review.\n\nNext action: %s\nExpected value: %s NIS/mo (%s NIS/year)\nInvoice due: %s\nInvoice queue: %s\nPlan payments setup: %s\n\nName: %s\nFirm: %s\nPhone: %s\nEmail: %s\nBilling legal name: %s\nBilling business ID: %s\nBilling invoice email: %s\nBilling invoice address: %s\nPlan interest: %s\nClaim target: %s\nClaim public card: %s\nClaim admin edit: %s\nPayment path: %s\nPayment follow-up: %s\nLead response: %s\nAccount continuation: %s\nAttribution: %s\nLanding page: %s\nHeadline: %s\nVideo: %s\nGoogle Business: %s\nGoogle review link: %s\nUploads: %s\nAI draft: %s\n\nReview: %s",
		$next_action,
		number_format_i18n( $expected_monthly ),
		number_format_i18n( $expected_monthly * 12 ),
		$followup_due_at ?: '-',
		$manual_paid ? $invoice_queue_url : '-',
		$plan_payments_url,
		$meta['lawyer_full_name'] ?: '-',
		$meta['firm_name'] ?: '-',
		$meta['phone'] ?: '-',
		$meta['email'] ?: '-',
		$meta['billing_legal_name'] ?: '-',
		$meta['billing_business_id'] ?: '-',
		$meta['billing_invoice_email'] ?: '-',
		$meta['billing_invoice_address'] ?: '-',
		$plan ?: '-',
		! empty( $claim_target['id'] ) ? sprintf( '#%s - %s', $claim_target['id'], $claim_target['title'] ?: $claim_target['slug'] ) : '-',
		$claim_target['public_url'] ?: '-',
		$claim_target['edit_url'] ?: '-',
		$payment_path ?: '-',
		$followup_status ?: '-',
		justice_theme_lawyer_response_commitment_options()[ $meta['lead_response_commitment'] ?? '' ] ?? '-',
		$meta['account_continuation_status'] ?: '-',
		justice_theme_lawyer_registration_attribution_summary( $meta ) ?: '-',
		$meta['registration_landing_url'] ?: '-',
		$meta['profile_headline'] ?: '-',
		$meta['profile_video_url'] ?: '-',
		$meta['google_business_profile_url'] ?: '-',
		$meta['google_review_request_url'] ?: '-',
		$meta['registration_upload_notes'] ?: 'None',
		! empty( $meta['pending_ai_profile_draft_review'] ) ? 'Ready for owner review' : 'Not generated',
		$review_url
	);

	wp_mail( $admin_email, $subject, $message );
}

function justice_theme_seed_lawyer_registration_page(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_lawyer_registration_page_seed' ) || get_option( 'justice_lawyer_registration_page_seeded_v1' ) ) {
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

function justice_theme_lawyer_onboarding_admin_menu(): void {
	add_menu_page(
		'Lawyer Onboarding',
		'Lawyer Onboarding',
		'edit_pages',
		'justice-lawyer-onboarding',
		'justice_theme_render_lawyer_onboarding_admin_page',
		'dashicons-businessperson',
		26
	);

	add_submenu_page(
		'justice-lawyer-onboarding',
		'Outreach Links',
		'Outreach Links',
		'edit_pages',
		'justice-lawyer-outreach-links',
		'justice_theme_render_lawyer_outreach_links_page'
	);
}
add_action( 'admin_menu', 'justice_theme_lawyer_onboarding_admin_menu' );

function justice_theme_lawyer_outreach_builder_value( string $key, string $default = '' ): string {
	return isset( $_GET[ $key ] ) ? sanitize_text_field( wp_unslash( $_GET[ $key ] ) ) : $default;
}

function justice_theme_lawyer_outreach_builder_key_value( string $key, string $default = '' ): string {
	return sanitize_key( justice_theme_lawyer_outreach_builder_value( $key, $default ) );
}

function justice_theme_lawyer_outreach_select_options(): array {
	return array(
		'plan_interest' => array(
			'lead_partner' => 'Lead partner',
			'pro'          => 'Professional mini-site',
			'featured'     => 'Featured visibility',
			'full_service' => 'Full service',
			'free'         => 'Free profile',
		),
		'utm_source'    => array(
			'whatsapp' => 'WhatsApp',
			'email'    => 'Email',
			'phone'    => 'Phone follow-up',
			'linkedin' => 'LinkedIn',
			'referral' => 'Referral',
		),
		'utm_medium'    => array(
			'direct_message' => 'Direct message',
			'manual_email'   => 'Manual email',
			'call_followup'  => 'Call follow-up',
			'social_dm'      => 'Social DM',
		),
	);
}

function justice_theme_lawyer_outreach_prospect_plan( string $plan ): string {
	return in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true ) ? $plan : 'unknown';
}

function justice_theme_lawyer_outreach_expected_monthly_nis( string $plan ): int {
	$values = array(
		'pro'          => 349,
		'featured'     => 749,
		'lead_partner' => 1490,
		'full_service' => 2490,
		'free'         => 0,
	);

	return $values[ $plan ] ?? 1490;
}

function justice_theme_lawyer_outreach_link_args(): array {
	$options = justice_theme_lawyer_outreach_select_options();

	$plan = justice_theme_lawyer_outreach_builder_value( 'plan_interest', 'lead_partner' );
	if ( ! array_key_exists( $plan, $options['plan_interest'] ) ) {
		$plan = 'lead_partner';
	}

	$source = justice_theme_lawyer_outreach_builder_value( 'utm_source', 'whatsapp' );
	if ( ! array_key_exists( $source, $options['utm_source'] ) ) {
		$source = 'whatsapp';
	}

	$medium = justice_theme_lawyer_outreach_builder_value( 'utm_medium', 'direct_message' );
	if ( ! array_key_exists( $medium, $options['utm_medium'] ) ) {
		$medium = 'direct_message';
	}

	$args = array(
		'plan_interest'     => $plan,
		'pre_checkout'      => '1',
		'utm_source'        => $source,
		'utm_medium'        => $medium,
		'utm_campaign'      => justice_theme_lawyer_outreach_builder_key_value( 'utm_campaign', 'founder_batch_01' ),
		'utm_content'       => justice_theme_lawyer_outreach_builder_key_value( 'utm_content', 'message_a' ),
		'outreach_segment'  => justice_theme_lawyer_outreach_builder_key_value( 'outreach_segment', 'family_law_tel_aviv' ),
		'outreach_city'     => justice_theme_lawyer_outreach_builder_key_value( 'outreach_city', 'tel-aviv' ),
		'outreach_practice' => justice_theme_lawyer_outreach_builder_key_value( 'outreach_practice', 'family-law' ),
	);

	if ( 'free' !== $plan ) {
		$args['payment_path'] = 'manual_invoice';
	}

	return array_filter(
		$args,
		static function ( $value ): bool {
			return '' !== (string) $value;
		}
	);
}

function justice_theme_lawyer_outreach_message_template( string $variant, string $practice_label, string $city_label, string $registration_url, string $personal_note = '' ): string {
	$templates = array(
		'message_a' => sprintf(
			"שלום, אני בונה ב-Jus-Tice מסלול שותפי לידים לעורכי דין בתחום %s באזור %s.\nאנחנו פותחים מספר מקומות לבדיקה מוקדמת: פרופיל מקצועי מורחב, פניות מדידות ודוח ערך חודשי. אין חיוב מהטופס ואין התחייבות.\nאם מתאים, אפשר להשאיר פרטים כאן:\n%s\nאם זה לא רלוונטי, כתבו לי להסיר ולא אפנה שוב.",
			$practice_label,
			$city_label,
			$registration_url
		),
		'message_b' => sprintf(
			"שלום, אני מחפש כמה עורכי דין מתאימים לעלייה מוקדמת ב-Jus-Tice בתחום %s ב-%s.\nהמטרה היא לבנות לכם עמוד מקצועי שמודד חשיפה, פניות ומקור הגעה, ולא רק עוד כרטיס אינדקס.\nבדיקת התאמה קצרה כאן:\n%s\nאם לא מתאים, כתבו להסיר ואעצור כאן.",
			$practice_label,
			$city_label,
			$registration_url
		),
		'message_c' => sprintf(
			"שלום, Jus-Tice מכינה מסלול לעורכי דין שרוצים לקבל נראות ופניות מדידות בתחום %s באזור %s.\nבשלב הראשון אנחנו בוחרים מעט שותפים כדי לבדוק התאמה, זמינות ותחום. אין תשלום דרך הטופס עצמו.\nאפשר להתחיל כאן:\n%s\nאם אינכם רוצים שאפנה שוב, כתבו להסיר.",
			$practice_label,
			$city_label,
			$registration_url
		),
	);

	$message = $templates[ $variant ] ?? $templates['message_a'];

	if ( '' !== trim( $personal_note ) ) {
		$message = trim( $personal_note ) . "\n\n" . $message;
	}

	return $message;
}

function justice_theme_lawyer_outreach_source_lead_id( array $args = array() ): int {
	$lead_id = absint( justice_theme_lawyer_outreach_builder_value( 'source_lead_id', '0' ) );
	$content = (string) ( $args['utm_content'] ?? '' );

	if ( ! $lead_id && preg_match( '/^lead_(\d+)$/', $content, $matches ) ) {
		$lead_id = absint( $matches[1] );
	}

	if ( ! $lead_id || 'justice_lead' !== get_post_type( $lead_id ) || ! current_user_can( 'edit_post', $lead_id ) ) {
		return 0;
	}

	return $lead_id;
}

function justice_theme_lawyer_outreach_lead_context( int $lead_id ): array {
	$area       = (string) ( get_post_meta( $lead_id, 'ai_detected_area', true ) ?: get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true ) );
	$area_label = function_exists( 'justice_theme_lead_area_label' ) && $area ? justice_theme_lead_area_label( $area ) : $area;
	$city       = (string) ( get_post_meta( $lead_id, 'city', true ) ?: get_post_meta( $lead_id, 'lead_city', true ) );
	$urgency    = (string) get_post_meta( $lead_id, 'urgency', true );
	$message    = (string) ( get_post_meta( $lead_id, 'message', true ) ?: get_post_meta( $lead_id, 'lead_message', true ) ?: get_post_meta( $lead_id, 'visitor_message', true ) );
	$name       = function_exists( 'justice_theme_crm_lead_display_name' ) ? justice_theme_crm_lead_display_name( $lead_id ) : get_the_title( $lead_id );
	$edit_url   = get_edit_post_link( $lead_id, 'raw' );

	return array(
		'id'         => $lead_id,
		'name'       => $name ?: 'Lead #' . $lead_id,
		'area'       => $area_label ?: 'needs review',
		'city'       => $city ?: 'city not captured',
		'urgency'    => $urgency ?: 'urgency not captured',
		'message'    => $message,
		'edit_url'   => $edit_url ?: '',
		'created_at' => get_the_date( 'Y-m-d H:i', $lead_id ),
	);
}

function justice_theme_lawyer_outreach_lead_revenue_script( array $lead_context, array $args, string $registration_url ): string {
	$expected_monthly = justice_theme_lawyer_outreach_expected_monthly_nis( (string) ( $args['plan_interest'] ?? 'lead_partner' ) );

	return sprintf(
		"Lead-backed lawyer outreach checklist\nLead: %s\nDemand: %s / %s / %s\nSegment: %s\nExpected monthly value if converted: %s NIS\n\n1. Verify the public lead first: consent, city, practice and urgency.\n2. Contact only lawyers who plausibly cover this practice and city.\n3. Say there is current demand in the segment, not a guaranteed case or guaranteed volume.\n4. Send the tracked registration link: %s\n5. Create or update one Lawyer Prospect before the first follow-up.\n6. If the lawyer accepts the commercial fit, request manual invoice or payment-link handling.\n7. Mark paid only after invoice or payment evidence exists.",
		$lead_context['name'] ?? '-',
		$lead_context['area'] ?? '-',
		$lead_context['city'] ?? '-',
		$lead_context['urgency'] ?? '-',
		$args['outreach_segment'] ?? '-',
		number_format_i18n( $expected_monthly ),
		$registration_url
	);
}

function justice_theme_render_lawyer_outreach_links_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access outreach links.', 'justice-theme' ) );
	}

	$options             = justice_theme_lawyer_outreach_select_options();
	$args                = justice_theme_lawyer_outreach_link_args();
	$registration_url    = add_query_arg( $args, home_url( '/lawyer-registration/' ) );
	$practice_label      = str_replace( '-', ' ', $args['outreach_practice'] ?? 'your practice area' );
	$city_label          = str_replace( '-', ' ', $args['outreach_city'] ?? 'your city' );
	$personal_note       = justice_theme_lawyer_outreach_builder_value( 'outreach_personal_note', '' );
	$message_template    = justice_theme_lawyer_outreach_message_template( $args['utm_content'] ?? 'message_a', $practice_label, $city_label, $registration_url, $personal_note );
	$prospect_plan       = justice_theme_lawyer_outreach_prospect_plan( $args['plan_interest'] ?? 'lead_partner' );
	$source_lead_id      = justice_theme_lawyer_outreach_source_lead_id( $args );
	$lead_context        = $source_lead_id ? justice_theme_lawyer_outreach_lead_context( $source_lead_id ) : array();
	$lead_revenue_script = $lead_context ? justice_theme_lawyer_outreach_lead_revenue_script( $lead_context, $args, $registration_url ) : '';
	$demand_signal    = sprintf(
		'Manual outreach batch: %s / %s via %s %s. Registration link keeps UTM tracking. Track first contact, next follow-up, and outcome in Lawyer Prospects.',
		$args['outreach_practice'] ?? '-',
		$args['outreach_city'] ?? '-',
		$args['utm_source'] ?? '-',
		$args['utm_campaign'] ?? '-'
	);
	if ( $lead_context ) {
		$demand_signal .= sprintf(
			' Source homepage lead #%d: %s / %s / %s.',
			(int) ( $lead_context['id'] ?? 0 ),
			$lead_context['area'] ?? '-',
			$lead_context['city'] ?? '-',
			$lead_context['urgency'] ?? '-'
		);
	}
	$prospect_owner_note = $lead_context
		? 'Created from a homepage lead-backed Outreach Link. Contact one relevant lawyer manually, record the first attempt, then move to invoice/payment handling only after commercial fit is accepted.'
		: 'Created from Outreach Links. Add one specific lawyer, contact manually, then use quick actions for follow-up.';
	$prospect_args       = array(
		'post_type'                     => 'justice_prospect',
		'prospect_practice_area'        => $practice_label,
		'prospect_city'                 => $city_label,
		'prospect_target_plan'          => $prospect_plan,
		'prospect_priority'             => 'warm',
		'prospect_outreach_status'      => 'ready',
		'prospect_source_url'           => $registration_url,
		'prospect_expected_monthly_nis' => justice_theme_lawyer_outreach_expected_monthly_nis( $args['plan_interest'] ?? 'lead_partner' ),
		'prospect_demand_signal'        => $demand_signal,
		'prospect_owner_note'           => $prospect_owner_note,
	);

	if ( $source_lead_id ) {
		$prospect_args['prospect_source_lead_id'] = $source_lead_id;
	}

	$prospect_url = add_query_arg( $prospect_args, admin_url( 'post-new.php' ) );
	$prospect_pipeline_url = admin_url( 'edit.php?post_type=justice_prospect' );
	?>
	<div class="wrap">
		<h1>Lawyer Outreach Links</h1>
		<p>Create tracked registration links before messaging lawyers. Keep each batch small, personal and relevant. Use lowercase campaign IDs so Analytics does not split one campaign into multiple rows. If someone asks not to be contacted, stop contacting them.</p>
		<div class="notice notice-warning inline">
			<p><strong>Manual outreach only:</strong> this screen creates copyable drafts. It does not send bulk email or SMS. Contact only relevant lawyers, personalize the opening line, and respect every removal request.</p>
		</div>
		<?php if ( $lead_context ) : ?>
			<div class="notice notice-success inline">
				<p><strong>Lead-backed revenue context:</strong> this outreach batch started from a real homepage lead, so the next move is supplier coverage, prospect follow-up and manual invoice/payment handling.</p>
				<p>
					<strong>Demand:</strong> <?php echo esc_html( $lead_context['area'] ); ?> / <?php echo esc_html( $lead_context['city'] ); ?> / <?php echo esc_html( $lead_context['urgency'] ); ?>
					<?php if ( ! empty( $lead_context['created_at'] ) ) : ?>
						<br><strong>Lead created:</strong> <?php echo esc_html( $lead_context['created_at'] ); ?>
					<?php endif; ?>
				</p>
				<?php if ( ! empty( $lead_context['message'] ) ) : ?>
					<p><strong>Lead message signal:</strong> <?php echo esc_html( wp_trim_words( $lead_context['message'], 32, '...' ) ); ?></p>
				<?php endif; ?>
				<p>
					<?php if ( ! empty( $lead_context['edit_url'] ) ) : ?>
						<a class="button" href="<?php echo esc_url( $lead_context['edit_url'] ); ?>">Open source lead</a>
					<?php endif; ?>
					<a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding&payment_queue=invoice_requested' ) ); ?>">Open invoice-requested queue</a>
				</p>
				<textarea id="justice-outreach-lead-revenue-script" readonly rows="9" style="width:100%;max-width:960px;"><?php echo esc_textarea( $lead_revenue_script ); ?></textarea>
				<p><button type="button" class="button" data-copy-target="justice-outreach-lead-revenue-script" data-copy-label="Copy lead action script">Copy lead action script</button></p>
			</div>
		<?php endif; ?>
		<form method="get" action="<?php echo esc_url( admin_url( 'admin.php' ) ); ?>" style="max-width:960px;background:#fff;border:1px solid #dcdcde;padding:18px 20px;margin:18px 0;">
			<input type="hidden" name="page" value="justice-lawyer-outreach-links">
			<?php if ( $source_lead_id ) : ?>
				<input type="hidden" name="source_lead_id" value="<?php echo esc_attr( (string) $source_lead_id ); ?>">
			<?php endif; ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="justice-outreach-plan">Plan</label></th>
					<td>
						<select id="justice-outreach-plan" name="plan_interest">
							<?php foreach ( $options['plan_interest'] as $value => $label ) : ?>
								<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $args['plan_interest'] ?? '', $value ); ?>><?php echo esc_html( $label ); ?></option>
							<?php endforeach; ?>
						</select>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-source">Source</label></th>
					<td>
						<select id="justice-outreach-source" name="utm_source">
							<?php foreach ( $options['utm_source'] as $value => $label ) : ?>
								<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $args['utm_source'] ?? '', $value ); ?>><?php echo esc_html( $label ); ?></option>
							<?php endforeach; ?>
						</select>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-medium">Medium</label></th>
					<td>
						<select id="justice-outreach-medium" name="utm_medium">
							<?php foreach ( $options['utm_medium'] as $value => $label ) : ?>
								<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $args['utm_medium'] ?? '', $value ); ?>><?php echo esc_html( $label ); ?></option>
							<?php endforeach; ?>
						</select>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-campaign">Campaign</label></th>
					<td><input id="justice-outreach-campaign" type="text" name="utm_campaign" value="<?php echo esc_attr( $args['utm_campaign'] ?? '' ); ?>" class="regular-text" placeholder="founder_batch_01"></td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-content">Message variant</label></th>
					<td>
						<input id="justice-outreach-content" type="text" name="utm_content" value="<?php echo esc_attr( $args['utm_content'] ?? '' ); ?>" class="regular-text" placeholder="message_a" list="justice-outreach-content-options">
						<datalist id="justice-outreach-content-options">
							<option value="message_a">
							<option value="message_b">
							<option value="message_c">
							<option value="lead_demand_a">
						</datalist>
						<p class="description">Use message_a, message_b, message_c or lead_demand_a to switch the copied draft while keeping the same tracking structure.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-segment">Segment</label></th>
					<td><input id="justice-outreach-segment" type="text" name="outreach_segment" value="<?php echo esc_attr( $args['outreach_segment'] ?? '' ); ?>" class="regular-text" placeholder="family_law_tel_aviv"></td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-city">City</label></th>
					<td><input id="justice-outreach-city" type="text" name="outreach_city" value="<?php echo esc_attr( $args['outreach_city'] ?? '' ); ?>" class="regular-text" placeholder="tel-aviv"></td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-practice">Practice</label></th>
					<td><input id="justice-outreach-practice" type="text" name="outreach_practice" value="<?php echo esc_attr( $args['outreach_practice'] ?? '' ); ?>" class="regular-text" placeholder="family-law"></td>
				</tr>
				<tr>
					<th scope="row"><label for="justice-outreach-personal-note">Personal opening line</label></th>
					<td>
						<textarea id="justice-outreach-personal-note" name="outreach_personal_note" rows="2" class="large-text" style="max-width:720px;" placeholder="Example: I saw your family-law articles and thought this may fit your Tel Aviv work."><?php echo esc_textarea( $personal_note ); ?></textarea>
						<p class="description">This is copied into the message only. It is not added to the registration link.</p>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Build tracked link', 'primary', 'submit', false ); ?>
		</form>

		<h2>Tracked registration URL</h2>
		<p><input id="justice-outreach-generated-url" type="url" readonly value="<?php echo esc_attr( $registration_url ); ?>" style="width:100%;max-width:960px;font-family:monospace;"></p>
		<p><button type="button" class="button" data-copy-target="justice-outreach-generated-url" data-copy-label="Copy URL">Copy URL</button></p>

		<h2>Message draft</h2>
		<textarea id="justice-outreach-message" readonly rows="7" style="width:100%;max-width:960px;"><?php echo esc_textarea( $message_template ); ?></textarea>
		<p><button type="button" class="button" data-copy-target="justice-outreach-message" data-copy-label="Copy message">Copy message</button></p>

		<h2>Prospect pipeline handoff</h2>
		<p>Create one prospect record for each lawyer before or immediately after the first manual message. This keeps follow-up, value and outcome visible instead of living in memory.</p>
		<p>
			<a class="button button-primary" href="<?php echo esc_url( $prospect_url ); ?>">Add prospect with these batch defaults</a>
			<a class="button" href="<?php echo esc_url( $prospect_pipeline_url ); ?>">Open prospect pipeline</a>
		</p>
		<p class="description">The button opens a prefilled admin draft only. It does not create a record or send outreach until you save/contact manually.</p>

		<h2>Batch rule</h2>
		<ul>
			<li>Start with 10 to 20 lawyers per segment.</li>
			<li>Use one clear segment per batch, such as family law in Tel Aviv.</li>
			<li>Change only one thing between batches: city, practice, source or message variant.</li>
			<li>Personalize the first sentence so the lawyer understands why they were contacted.</li>
			<li>Create a prospect record before sending or immediately after the first reply.</li>
			<li>Do not use this as a bulk sender; copy and send manually only when the contact is relevant.</li>
			<li>Watch Lawyer Onboarding -> Source after real submissions arrive.</li>
		</ul>
	</div>
	<script>
	document.addEventListener('click', function (event) {
		var button = event.target.closest('[data-copy-target]');
		if (!button || !navigator.clipboard) {
			return;
		}
		var target = document.getElementById(button.getAttribute('data-copy-target'));
		if (!target) {
			return;
		}
		navigator.clipboard.writeText(target.value).then(function () {
			var label = button.getAttribute('data-copy-label') || button.textContent || 'Copy';
			button.textContent = 'Copied';
			setTimeout(function () {
				button.textContent = label;
			}, 1400);
		});
	});
	</script>
	<?php
}

function justice_theme_append_lawyer_internal_note( int $post_id, string $note ): void {
	$existing = trim( (string) get_post_meta( $post_id, 'internal_notes', true ) );
	$entry    = sprintf( '[%s] %s', current_time( 'mysql' ), $note );

	update_post_meta( $post_id, 'internal_notes', trim( $existing . "\n" . $entry ) );
}

function justice_theme_lawyer_activation_options(): array {
	return array(
		'registered'       => 'Registered',
		'profile_ready'    => 'Profile ready',
		'first_value'      => 'First value reached',
		'retention_review' => 'Retention review',
		'at_risk'          => 'At risk',
	);
}

function justice_theme_lawyer_activation_badge( string $status ): array {
	$labels = justice_theme_lawyer_activation_options();
	$label  = $labels[ $status ] ?? 'Registered';

	if ( 'first_value' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#ecfdf3;color:#166534;' );
	}

	if ( 'profile_ready' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#e7f0ff;color:#16427a;' );
	}

	if ( 'retention_review' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#eef2ff;color:#3730a3;' );
	}

	if ( 'at_risk' === $status ) {
		return array( 'label' => $label, 'style' => 'background:#fef2f2;color:#991b1b;' );
	}

	return array( 'label' => $label, 'style' => 'background:#f1f5f9;color:#334155;' );
}

function justice_theme_lawyer_payment_followup_options(): array {
	return array(
		''                  => 'No manual payment state',
		'invoice_requested' => 'Invoice requested',
		'invoice_sent'      => 'Invoice sent',
		'payment_confirmed' => 'Payment confirmed',
		'payment_blocked'   => 'Payment blocked',
		'payment_cancelled' => 'Payment cancelled',
	);
}

function justice_theme_lawyer_payment_followup_badge( string $payment_path, string $followup_status ): array {
	if ( 'manual_invoice' !== $payment_path && '' === $followup_status ) {
		return array(
			'label' => 'No manual payment',
			'note'  => 'Use normal checkout or free review path.',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	if ( 'invoice_requested' === $followup_status ) {
		return array(
			'label' => 'Invoice requested',
			'note'  => 'Create/send Morning invoice, then activate after payment confirmation.',
			'style' => 'background:#fef3c7;color:#92400e;',
		);
	}

	if ( 'invoice_sent' === $followup_status ) {
		return array(
			'label' => 'Invoice sent',
			'note'  => 'Chase payment confirmation and keep activation pending until paid.',
			'style' => 'background:#e7f0ff;color:#16427a;',
		);
	}

	if ( 'payment_confirmed' === $followup_status ) {
		return array(
			'label' => 'Payment confirmed',
			'note'  => 'Private payment evidence is recorded; move the lawyer toward profile activation and first value.',
			'style' => 'background:#ecfdf3;color:#166534;',
		);
	}

	if ( 'payment_blocked' === $followup_status ) {
		return array(
			'label' => 'Payment blocked',
			'note'  => 'Resolve payment/account issue before activation.',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( 'payment_cancelled' === $followup_status ) {
		return array(
			'label' => 'Payment cancelled',
			'note'  => 'Do not activate paid benefits unless the owner reopens the deal.',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	return array(
		'label' => 'Manual payment',
		'note'  => 'Review payment state before activation.',
		'style' => 'background:#eef2ff;color:#3730a3;',
	);
}

function justice_theme_lawyer_payment_followup_due_for_status( string $followup_status ): string {
	$now = current_datetime();

	if ( 'invoice_requested' === $followup_status ) {
		return $now->modify( '+1 day' )->format( 'Y-m-d H:i:s' );
	}

	if ( 'invoice_sent' === $followup_status ) {
		return $now->modify( '+2 days' )->format( 'Y-m-d H:i:s' );
	}

	return '';
}

function justice_theme_lawyer_payment_due_badge( string $due_at ): array {
	if ( '' === $due_at ) {
		return array(
			'label' => 'No payment due date',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	$due_timestamp = mysql2date( 'U', $due_at, false );
	$now_timestamp = current_time( 'timestamp' );

	if ( $due_timestamp && $due_timestamp < $now_timestamp ) {
		return array(
			'label' => 'Payment follow-up overdue: ' . date_i18n( 'd/m H:i', $due_timestamp ),
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( $due_timestamp && $due_timestamp <= $now_timestamp + DAY_IN_SECONDS ) {
		return array(
			'label' => 'Payment follow-up due today: ' . date_i18n( 'd/m H:i', $due_timestamp ),
			'style' => 'background:#fef3c7;color:#92400e;',
		);
	}

	return array(
		'label' => 'Payment follow-up due: ' . ( $due_timestamp ? date_i18n( 'd/m H:i', $due_timestamp ) : $due_at ),
		'style' => 'background:#e7f0ff;color:#16427a;',
	);
}

function justice_theme_lawyer_payment_due_status_label( string $due_at ): string {
	if ( '' === $due_at ) {
		return '';
	}

	$due_timestamp = mysql2date( 'U', $due_at, false );
	if ( ! $due_timestamp ) {
		return 'due_date_review';
	}

	$now_timestamp = current_time( 'timestamp' );

	if ( $due_timestamp < $now_timestamp ) {
		return 'overdue';
	}

	if ( $due_timestamp <= $now_timestamp + DAY_IN_SECONDS ) {
		return 'due_today';
	}

	if ( $due_timestamp <= $now_timestamp + 2 * DAY_IN_SECONDS ) {
		return 'due_soon';
	}

	return 'scheduled';
}

function justice_theme_lawyer_has_manual_payment_evidence( int $post_id ): bool {
	return '' !== trim( (string) get_post_meta( $post_id, 'manual_payment_evidence_url', true ) );
}

function justice_theme_set_lawyer_payment_followup_status( int $post_id, string $followup_status, string $source_note ): bool {
	$followup_status = sanitize_key( $followup_status );
	$options         = justice_theme_lawyer_payment_followup_options();

	if ( ! array_key_exists( $followup_status, $options ) ) {
		$followup_status = '';
	}

	if ( 'payment_confirmed' === $followup_status && ! justice_theme_lawyer_has_manual_payment_evidence( $post_id ) ) {
		$invoice_reference = trim( (string) get_post_meta( $post_id, 'manual_invoice_reference', true ) );
		$manual_link       = trim( (string) get_post_meta( $post_id, 'manual_payment_link_url', true ) );
		$followup_status   = ( $invoice_reference || $manual_link ) ? 'invoice_sent' : 'invoice_requested';
		justice_theme_append_lawyer_internal_note( $post_id, sprintf( 'Payment confirmed was blocked because manual_payment_evidence_url is missing. Kept payment status at %s. Source: %s.', $options[ $followup_status ], $source_note ) );
	}

	$previous_payment_status = (string) get_post_meta( $post_id, 'payment_followup_status', true );
	update_post_meta( $post_id, 'payment_followup_status', $followup_status );

	if ( $followup_status === $previous_payment_status ) {
		if ( $followup_status && '' === (string) get_post_meta( $post_id, 'payment_followup_due_at', true ) ) {
			$due_at = justice_theme_lawyer_payment_followup_due_for_status( $followup_status );
			if ( $due_at ) {
				update_post_meta( $post_id, 'payment_followup_due_at', $due_at );
			}
		}
		return false;
	}

	$due_at = justice_theme_lawyer_payment_followup_due_for_status( $followup_status );
	if ( $due_at ) {
		update_post_meta( $post_id, 'payment_followup_due_at', $due_at );
	} else {
		delete_post_meta( $post_id, 'payment_followup_due_at' );
	}

	if ( $followup_status ) {
		$timestamp_meta = array(
			'invoice_sent'      => 'invoice_sent_at',
			'payment_confirmed' => 'payment_confirmed_at',
			'payment_blocked'   => 'payment_blocked_at',
			'payment_cancelled' => 'payment_cancelled_at',
		);

		if ( isset( $timestamp_meta[ $followup_status ] ) ) {
			$meta_key = $timestamp_meta[ $followup_status ];
			if ( '' === (string) get_post_meta( $post_id, $meta_key, true ) ) {
				update_post_meta( $post_id, $meta_key, current_time( 'mysql' ) );
			}
		}

		justice_theme_append_lawyer_internal_note( $post_id, sprintf( 'Payment follow-up changed to %s. Source: %s.', $options[ $followup_status ], $source_note ) );
	}

	return true;
}

function justice_theme_lawyer_payment_followup_quick_actions( string $payment_path, string $followup_status, bool $has_payment_evidence = false ): array {
	if ( 'manual_invoice' !== $payment_path && '' === $followup_status ) {
		return array();
	}

	if ( '' === $followup_status ) {
		return array(
			'invoice_requested' => 'Mark invoice requested',
		);
	}

	if ( 'invoice_requested' === $followup_status ) {
		return array(
			'invoice_sent'    => 'Mark invoice sent',
			'payment_blocked' => 'Mark blocked',
		);
	}

	if ( 'invoice_sent' === $followup_status ) {
		$actions = array(
			'payment_blocked'   => 'Mark blocked',
			'payment_cancelled' => 'Cancel',
		);

		if ( $has_payment_evidence ) {
			$actions = array( 'payment_confirmed' => 'Mark paid' ) + $actions;
		}

		return $actions;
	}

	if ( 'payment_blocked' === $followup_status ) {
		return array(
			'invoice_sent'      => 'Back to invoice sent',
			'payment_cancelled' => 'Cancel',
		);
	}

	if ( 'payment_cancelled' === $followup_status ) {
		return array(
			'invoice_requested' => 'Reopen',
		);
	}

	return array();
}

function justice_theme_lawyer_payment_followup_quick_action_url( int $post_id, string $followup_status ): string {
	return wp_nonce_url(
		admin_url( 'admin-post.php?action=justice_update_lawyer_payment_followup&lawyer_id=' . $post_id . '&payment_status=' . rawurlencode( $followup_status ) ),
		'justice_update_lawyer_payment_followup_' . $post_id . '_' . $followup_status
	);
}

function justice_theme_lawyer_manual_payment_link_email_url( int $post_id ): string {
	return wp_nonce_url(
		admin_url( 'admin-post.php?action=justice_send_lawyer_manual_payment_link&lawyer_id=' . $post_id ),
		'justice_send_lawyer_manual_payment_link_' . $post_id
	);
}

function justice_theme_lawyer_service_request_status_options(): array {
	return array(
		'open'      => 'Open',
		'in_review' => 'In review',
		'resolved'  => 'Resolved',
		'blocked'   => 'Blocked',
	);
}

function justice_theme_lawyer_service_request_quick_actions( string $service_status ): array {
	$service_status = sanitize_key( $service_status ?: 'open' );

	if ( in_array( $service_status, array( '', 'open' ), true ) ) {
		return array(
			'in_review' => 'Mark in review',
			'resolved'  => 'Resolve',
			'blocked'   => 'Block',
		);
	}

	if ( 'in_review' === $service_status ) {
		return array(
			'resolved' => 'Resolve',
			'blocked'  => 'Block',
			'open'     => 'Reopen',
		);
	}

	if ( 'blocked' === $service_status ) {
		return array(
			'in_review' => 'Back to review',
			'resolved'  => 'Resolve',
			'open'      => 'Reopen',
		);
	}

	if ( 'resolved' === $service_status ) {
		return array(
			'open' => 'Reopen',
		);
	}

	return array(
		'in_review' => 'Mark in review',
	);
}

function justice_theme_lawyer_service_request_quick_action_url( int $post_id, string $service_status ): string {
	$service_status = sanitize_key( $service_status );

	return wp_nonce_url(
		admin_url( 'admin-post.php?action=justice_update_lawyer_service_request_status&lawyer_id=' . $post_id . '&service_status=' . rawurlencode( $service_status ) ),
		'justice_update_lawyer_service_request_status_' . $post_id . '_' . $service_status
	);
}

function justice_theme_lawyer_payment_queue_export_url( string $payment_queue ): string {
	$payment_queue = sanitize_key( $payment_queue );

	return wp_nonce_url(
		add_query_arg(
			array(
				'action'        => 'justice_export_lawyer_payment_queue',
				'payment_queue' => $payment_queue,
			),
			admin_url( 'admin-post.php' )
		),
		'justice_export_lawyer_payment_queue_' . $payment_queue
	);
}

function justice_theme_lawyer_payment_queue_meta_filter( string $payment_queue ): array {
	if ( 'manual_invoice' === $payment_queue ) {
		return array(
			'key'   => 'payment_path',
			'value' => 'manual_invoice',
		);
	}

	return array(
		'key'   => 'payment_followup_status',
		'value' => $payment_queue,
	);
}

function justice_theme_lawyer_payment_export_next_action( string $payment_path, string $followup_status, string $activation_status ): string {
	if ( 'invoice_requested' === $followup_status ) {
		return 'Verify license/commercial fit, create invoice/payment instructions, send handoff message, then mark invoice sent.';
	}

	if ( 'invoice_sent' === $followup_status ) {
		return 'Follow up on payment, confirm receipt, then mark paid and continue profile activation.';
	}

	if ( 'payment_confirmed' === $followup_status ) {
		return 'Connect/activate the profile, set first-value path, and make sure the lawyer can log in.';
	}

	if ( 'payment_blocked' === $followup_status ) {
		return 'Resolve the recorded blocker before sending or chasing payment.';
	}

	if ( 'payment_cancelled' === $followup_status ) {
		return 'No active follow-up unless the lawyer reopens the conversation.';
	}

	if ( 'manual_invoice' === $payment_path ) {
		return 'Review license/commercial fit and decide whether to request/send a manual invoice.';
	}

	if ( in_array( $activation_status, array( 'profile_ready', 'first_value' ), true ) ) {
		return 'Check retention and next value milestone.';
	}

	return 'Review onboarding status and choose the next commercial action.';
}

function justice_theme_lawyer_export_term_names( int $post_id, string $taxonomy ): string {
	if ( ! taxonomy_exists( $taxonomy ) ) {
		return '';
	}

	$terms = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'names' ) );
	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		return '';
	}

	return implode( '; ', array_map( 'sanitize_text_field', $terms ) );
}

function justice_theme_lawyer_payment_export_cell( $value ): string {
	$text = wp_strip_all_tags( (string) $value );
	$text = preg_replace( "/\r\n|\r|\n/", ' ', $text );
	$text = trim( $text );

	if ( '' !== $text && preg_match( '/^[=\-+@]/', $text ) ) {
		return "'" . $text;
	}

	return $text;
}

function justice_theme_export_lawyer_payment_queue(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to export lawyer payment data.', 'justice-theme' ) );
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_die( esc_html__( 'The lawyer post type is not active.', 'justice-theme' ) );
	}

	$allowed_queues = array_merge( array_keys( justice_theme_lawyer_payment_followup_options() ), array( 'manual_invoice' ) );
	$payment_queue  = isset( $_GET['payment_queue'] ) ? sanitize_key( wp_unslash( $_GET['payment_queue'] ) ) : 'invoice_requested';

	if ( ! in_array( $payment_queue, $allowed_queues, true ) ) {
		$payment_queue = 'invoice_requested';
	}

	check_admin_referer( 'justice_export_lawyer_payment_queue_' . $payment_queue );

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => -1,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			justice_theme_lawyer_payment_queue_meta_filter( $payment_queue ),
		),
	) );

	$filename = 'justice-lawyer-payment-' . $payment_queue . '-' . wp_date( 'Y-m-d-His' ) . '.csv';

	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	header( 'X-Robots-Tag: noindex, nofollow', true );

	echo "\xEF\xBB\xBF";

	$output = fopen( 'php://output', 'w' );
	if ( ! $output ) {
		exit;
	}

	fputcsv( $output, array(
		'lawyer_id',
		'name',
		'firm',
		'phone',
		'email',
		'bar_number',
		'plan_key',
		'plan_label',
		'expected_monthly_nis',
		'expected_annual_nis',
		'payment_path',
		'payment_followup_status',
		'payment_followup_due_at',
		'payment_followup_urgency',
		'manual_payment_link_url',
		'manual_payment_link_sent_at',
		'manual_payment_link_sent_to',
		'manual_payment_link_email_last_result',
		'manual_invoice_reference',
		'manual_payment_evidence_url',
		'activation_status',
		'billing_legal_name',
		'billing_business_id',
		'billing_invoice_email',
		'billing_invoice_address',
		'practice_areas',
		'cities',
		'utm_source',
		'utm_medium',
		'utm_campaign',
		'utm_content',
		'outreach_segment',
		'landing_url',
		'registration_referrer_url',
		'invoice_sent_at',
		'payment_confirmed_at',
		'payment_blocked_at',
		'payment_cancelled_at',
		'admin_edit_url',
		'next_action',
		'invoice_handoff_context',
		'invoice_handoff_message',
		'whatsapp_handoff_url',
	) );

	while ( $query->have_posts() ) {
		$query->the_post();

		$post_id           = get_the_ID();
		$plan              = (string) get_post_meta( $post_id, 'plan_type', true );
		$expected_monthly  = justice_theme_lawyer_outreach_expected_monthly_nis( $plan );
		$payment_path      = (string) get_post_meta( $post_id, 'payment_path', true );
		$followup_status   = (string) get_post_meta( $post_id, 'payment_followup_status', true );
		$followup_due_at   = (string) get_post_meta( $post_id, 'payment_followup_due_at', true );
		$activation_status = (string) get_post_meta( $post_id, 'activation_status', true );
		$handoff_message   = justice_theme_lawyer_manual_invoice_message( $post_id );

		$row = array(
			$post_id,
			get_the_title(),
			get_post_meta( $post_id, 'firm_name', true ),
			get_post_meta( $post_id, 'phone', true ),
			get_post_meta( $post_id, 'email', true ),
			get_post_meta( $post_id, 'bar_number', true ),
			$plan,
			justice_theme_lawyer_onboarding_plan_label( $plan ),
			$expected_monthly,
			$expected_monthly * 12,
			$payment_path,
			$followup_status,
			$followup_due_at,
			justice_theme_lawyer_payment_due_status_label( $followup_due_at ),
			get_post_meta( $post_id, 'manual_payment_link_url', true ),
			get_post_meta( $post_id, 'manual_payment_link_sent_at', true ),
			get_post_meta( $post_id, 'manual_payment_link_sent_to', true ),
			get_post_meta( $post_id, 'manual_payment_link_email_last_result', true ),
			get_post_meta( $post_id, 'manual_invoice_reference', true ),
			get_post_meta( $post_id, 'manual_payment_evidence_url', true ),
			$activation_status,
			get_post_meta( $post_id, 'billing_legal_name', true ),
			get_post_meta( $post_id, 'billing_business_id', true ),
			get_post_meta( $post_id, 'billing_invoice_email', true ),
			get_post_meta( $post_id, 'billing_invoice_address', true ),
			justice_theme_lawyer_export_term_names( $post_id, 'practice-areas' ),
			justice_theme_lawyer_export_term_names( $post_id, 'city' ),
			get_post_meta( $post_id, 'utm_source', true ),
			get_post_meta( $post_id, 'utm_medium', true ),
			get_post_meta( $post_id, 'utm_campaign', true ),
			get_post_meta( $post_id, 'utm_content', true ),
			get_post_meta( $post_id, 'outreach_segment', true ),
			get_post_meta( $post_id, 'registration_landing_url', true ),
			get_post_meta( $post_id, 'registration_referrer_url', true ),
			get_post_meta( $post_id, 'invoice_sent_at', true ),
			get_post_meta( $post_id, 'payment_confirmed_at', true ),
			get_post_meta( $post_id, 'payment_blocked_at', true ),
			get_post_meta( $post_id, 'payment_cancelled_at', true ),
			get_edit_post_link( $post_id, '' ),
			justice_theme_lawyer_payment_export_next_action( $payment_path, $followup_status, $activation_status ),
			justice_theme_lawyer_manual_invoice_context( $post_id ),
			$handoff_message,
			justice_theme_lawyer_payment_link_whatsapp_url( $post_id, $handoff_message ),
		);

		fputcsv( $output, array_map( 'justice_theme_lawyer_payment_export_cell', $row ) );
	}

	wp_reset_postdata();
	fclose( $output );
	exit;
}
add_action( 'admin_post_justice_export_lawyer_payment_queue', 'justice_theme_export_lawyer_payment_queue' );

function justice_theme_lawyer_manual_invoice_context( int $post_id ): string {
	$payment_path     = (string) get_post_meta( $post_id, 'payment_path', true );
	$followup_status  = (string) get_post_meta( $post_id, 'payment_followup_status', true );
	$inactive_statuses = array( 'payment_confirmed', 'payment_cancelled' );

	if ( 'manual_invoice' !== $payment_path || in_array( $followup_status, $inactive_statuses, true ) ) {
		return '';
	}

	$plan_key         = (string) get_post_meta( $post_id, 'plan_type', true );
	$plan_label       = wp_strip_all_tags( justice_theme_lawyer_onboarding_plan_label( $plan_key ) );
	$expected_monthly = justice_theme_lawyer_outreach_expected_monthly_nis( $plan_key );
	$due_at           = (string) get_post_meta( $post_id, 'payment_followup_due_at', true );
	$due_label        = justice_theme_lawyer_payment_due_status_label( $due_at );
	$activation       = (string) get_post_meta( $post_id, 'activation_status', true );
	$pieces           = array(
		'Plan: ' . ( $plan_label ?: $plan_key ?: '-' ),
		'Expected: ' . number_format_i18n( $expected_monthly ) . ' NIS/mo',
		'Annual: ' . number_format_i18n( $expected_monthly * 12 ) . ' NIS',
		'Payment status: ' . ( $followup_status ?: 'invoice_requested' ),
		'Activation: ' . ( $activation ?: 'registered' ),
	);

	if ( $due_at ) {
		$pieces[] = 'Due: ' . $due_at . ' (' . $due_label . ')';
	}

	$billing_bits = array_filter( array(
		(string) get_post_meta( $post_id, 'billing_legal_name', true ),
		(string) get_post_meta( $post_id, 'billing_business_id', true ),
		(string) get_post_meta( $post_id, 'billing_invoice_email', true ),
		(string) get_post_meta( $post_id, 'billing_invoice_address', true ),
	) );

	if ( $billing_bits ) {
		$pieces[] = 'Billing: ' . implode( ' / ', $billing_bits );
	}

	$manual_payment_link = (string) get_post_meta( $post_id, 'manual_payment_link_url', true );
	if ( $manual_payment_link ) {
		$pieces[] = 'Payment link: ' . $manual_payment_link;
	}

	$invoice_reference = (string) get_post_meta( $post_id, 'manual_invoice_reference', true );
	if ( $invoice_reference ) {
		$pieces[] = 'Reference: ' . $invoice_reference;
	}

	if ( justice_theme_lawyer_has_manual_payment_evidence( $post_id ) ) {
		$pieces[] = 'Payment evidence: recorded privately';
	}

	return implode( ' | ', $pieces );
}

function justice_theme_lawyer_manual_invoice_message( int $post_id ): string {
	$payment_path     = (string) get_post_meta( $post_id, 'payment_path', true );
	$followup_status  = (string) get_post_meta( $post_id, 'payment_followup_status', true );
	$inactive_statuses = array( 'payment_confirmed', 'payment_cancelled' );

	if ( 'manual_invoice' !== $payment_path || in_array( $followup_status, $inactive_statuses, true ) ) {
		return '';
	}

	$name       = wp_strip_all_tags( get_the_title( $post_id ) );
	$firm       = wp_strip_all_tags( (string) get_post_meta( $post_id, 'firm_name', true ) );
	$plan       = justice_theme_lawyer_onboarding_plan_label( (string) get_post_meta( $post_id, 'plan_type', true ) );
	$plan       = wp_strip_all_tags( $plan );
	$manual_payment_link = (string) get_post_meta( $post_id, 'manual_payment_link_url', true );
	$invoice_reference   = (string) get_post_meta( $post_id, 'manual_invoice_reference', true );
	$dashboard  = function_exists( 'justice_theme_public_url' )
		? justice_theme_public_url( home_url( '/lawyer-dashboard/' ) )
		: home_url( '/lawyer-dashboard/' );
	$firm_piece = $firm ? ' עבור ' . $firm : '';

	$lines = array(
		sprintf( 'שלום %s,', $name ?: 'רב' ),
		'תודה על ההרשמה ל-Jus-Tice.',
		sprintf( 'קיבלנו את בקשת ההצטרפות למסלול %s%s.', $plan ?: 'עורכי הדין', $firm_piece ),
		'לפני הפעלה ציבורית אנחנו בודקים רישיון, תחומי עיסוק, זמינות למענה וכללי פרסום.',
		'בשלב זה לא בוצע חיוב אוטומטי. לאחר אישור התאמה נשלח חשבונית או הוראות תשלום ידניות, ונפעיל את הפרופיל רק לאחר אישור תשלום.',
		'כדי לזרז את ההפעלה, אפשר להשיב עם מספר רישיון, תחומי עיסוק מרכזיים, ערי שירות וקישור Google Business או אתר משרד אם יש.',
		'לאחר ההפעלה האזור האישי יהיה כאן: ' . $dashboard,
		'בברכה, Jus-Tice',
	);

	if ( $manual_payment_link ) {
		array_splice( $lines, -2, 0, array( 'Payment link: ' . $manual_payment_link ) );
	}

	if ( $invoice_reference ) {
		array_splice( $lines, -2, 0, array( 'Reference: ' . $invoice_reference ) );
	}

	return implode( "\n\n", $lines );
}

function justice_theme_lawyer_payment_link_recipient_email( int $post_id ): string {
	$candidates = array(
		(string) get_post_meta( $post_id, 'billing_invoice_email', true ),
		(string) get_post_meta( $post_id, 'email', true ),
	);

	foreach ( $candidates as $candidate ) {
		$email = sanitize_email( $candidate );
		if ( $email && is_email( $email ) ) {
			return $email;
		}
	}

	return '';
}

function justice_theme_lawyer_payment_link_whatsapp_url( int $post_id, string $message ): string {
	$message = trim( wp_strip_all_tags( $message ) );
	if ( '' === $message ) {
		return '';
	}

	$contact_value = (string) get_post_meta( $post_id, 'whatsapp', true );
	if ( '' === trim( $contact_value ) ) {
		$contact_value = (string) get_post_meta( $post_id, 'phone', true );
	}

	$base_url = '';
	if ( $contact_value && function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ) {
		$base_url = justice_theme_lawyer_public_whatsapp_link( $contact_value );
	}

	if ( ! $base_url ) {
		$base_url = 'https://wa.me/';
	}

	return add_query_arg( 'text', $message, $base_url );
}

function justice_theme_send_lawyer_manual_payment_link_email( int $post_id, string $manual_payment_link ): bool {
	$manual_payment_link = esc_url_raw( $manual_payment_link );
	$recipient           = justice_theme_lawyer_payment_link_recipient_email( $post_id );

	if ( ! $manual_payment_link ) {
		update_post_meta( $post_id, 'manual_payment_link_email_last_result', 'missing_link' );
		justice_theme_append_lawyer_internal_note( $post_id, 'Payment link email was requested but no manual payment link was saved.' );
		return false;
	}

	if ( ! $recipient ) {
		update_post_meta( $post_id, 'manual_payment_link_email_last_result', 'missing_recipient' );
		justice_theme_append_lawyer_internal_note( $post_id, 'Payment link email was requested but no valid lawyer or invoice email exists.' );
		return false;
	}

	$message = justice_theme_lawyer_manual_invoice_message( $post_id );
	if ( ! $message ) {
		$dashboard = function_exists( 'justice_theme_public_url' )
			? justice_theme_public_url( home_url( '/lawyer-dashboard/' ) )
			: home_url( '/lawyer-dashboard/' );
		$message = implode( "\n\n", array(
			'Hello,',
			'Your Jus-Tice lawyer plan payment link is ready.',
			'Payment link: ' . $manual_payment_link,
			'After payment is confirmed, the profile activation and lead-service setup continue from your lawyer dashboard:',
			$dashboard,
			'For invoice, refund, cancellation, upgrade, downgrade or lead-quality questions, use the service desk inside the dashboard.',
			'Jus-Tice',
		) );
	}

	$sent = wp_mail(
		$recipient,
		'Jus-Tice payment link for your lawyer plan',
		$message,
		array( 'Content-Type: text/plain; charset=UTF-8' )
	);

	if ( $sent ) {
		update_post_meta( $post_id, 'manual_payment_link_sent_at', current_time( 'mysql' ) );
		update_post_meta( $post_id, 'manual_payment_link_sent_to', $recipient );
		update_post_meta( $post_id, 'manual_payment_link_email_last_result', 'sent' );
		$current_payment_status = (string) get_post_meta( $post_id, 'payment_followup_status', true );
		if ( ! in_array( $current_payment_status, array( 'payment_confirmed', 'payment_cancelled' ), true ) ) {
			justice_theme_set_lawyer_payment_followup_status( $post_id, 'invoice_sent', 'manual payment link email' );
		}
		justice_theme_append_lawyer_internal_note( $post_id, 'Payment link email sent to ' . $recipient . '. Link: ' . $manual_payment_link );
		return true;
	}

	update_post_meta( $post_id, 'manual_payment_link_email_last_result', 'wp_mail_failed' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Payment link email failed through wp_mail for ' . $recipient . '. Link: ' . $manual_payment_link );
	return false;
}

function justice_theme_lawyer_activation_meta_box(): void {
	add_meta_box(
		'justice_theme_lawyer_activation',
		'Jus-Tice Lawyer Activation',
		'justice_theme_render_lawyer_activation_box',
		'justice_lawyer',
		'side',
		'high'
	);

	add_meta_box(
		'justice_theme_lawyer_reputation',
		'Jus-Tice Reputation Sources',
		'justice_theme_render_lawyer_reputation_box',
		'justice_lawyer',
		'normal',
		'default'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_lawyer_activation_meta_box' );

function justice_theme_render_lawyer_activation_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lawyer_activation', 'justice_theme_lawyer_activation_nonce' );

	$status         = get_post_meta( $post->ID, 'activation_status', true ) ?: 'registered';
	$first_value_at = get_post_meta( $post->ID, 'first_value_at', true );
	$owner_note     = get_post_meta( $post->ID, 'activation_owner_note', true );
	$payment_path   = (string) get_post_meta( $post->ID, 'payment_path', true );
	$payment_status = (string) get_post_meta( $post->ID, 'payment_followup_status', true );
	$payment_badge  = justice_theme_lawyer_payment_followup_badge( $payment_path, $payment_status );
	$payment_due_at = (string) get_post_meta( $post->ID, 'payment_followup_due_at', true );
	$payment_due_badge = justice_theme_lawyer_payment_due_badge( $payment_due_at );
	$manual_payment_link = (string) get_post_meta( $post->ID, 'manual_payment_link_url', true );
	$invoice_reference   = (string) get_post_meta( $post->ID, 'manual_invoice_reference', true );
	$payment_evidence_url = (string) get_post_meta( $post->ID, 'manual_payment_evidence_url', true );
	$payment_link_sent_at = (string) get_post_meta( $post->ID, 'manual_payment_link_sent_at', true );
	$payment_link_sent_to = (string) get_post_meta( $post->ID, 'manual_payment_link_sent_to', true );
	$payment_link_email_result = (string) get_post_meta( $post->ID, 'manual_payment_link_email_last_result', true );
	$invoice_sent_at      = (string) get_post_meta( $post->ID, 'invoice_sent_at', true );
	$payment_confirmed_at = (string) get_post_meta( $post->ID, 'payment_confirmed_at', true );
	$payment_blocked_at   = (string) get_post_meta( $post->ID, 'payment_blocked_at', true );
	$payment_cancelled_at = (string) get_post_meta( $post->ID, 'payment_cancelled_at', true );
	$claim_target         = justice_theme_lawyer_claim_target_for_post( $post->ID );
	$manual_payment_message = justice_theme_lawyer_manual_invoice_message( $post->ID );
	$manual_payment_whatsapp_url = justice_theme_lawyer_payment_link_whatsapp_url( $post->ID, $manual_payment_message );
	$response_commitment = (string) get_post_meta( $post->ID, 'lead_response_commitment', true );
	$response_options    = justice_theme_lawyer_response_commitment_options();
	?>
	<?php if ( ! empty( $claim_target['id'] ) ) : ?>
		<p style="border:1px solid #f0c36d;background:#fff8e5;border-radius:6px;padding:8px;">
			<strong>Public card claim</strong><br>
			<small>This registration asks to take over card #<?php echo esc_html( (string) $claim_target['id'] ); ?>: <?php echo esc_html( $claim_target['title'] ?: $claim_target['slug'] ); ?>. Verify identity before changing the public card.</small><br>
			<?php if ( $claim_target['public_url'] ) : ?>
				<a href="<?php echo esc_url( $claim_target['public_url'] ); ?>" target="_blank" rel="noopener noreferrer">Open public card</a>
			<?php endif; ?>
			<?php if ( $claim_target['edit_url'] ) : ?>
				<?php echo $claim_target['public_url'] ? ' | ' : ''; ?><a href="<?php echo esc_url( $claim_target['edit_url'] ); ?>">Edit claimed card</a>
			<?php endif; ?>
		</p>
	<?php endif; ?>
	<p>
		<strong>Payment follow-up</strong><br>
		<span style="display:inline-block;margin:4px 0;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $payment_badge['style'] ); ?>">
			<?php echo esc_html( $payment_badge['label'] ); ?>
		</span><br>
		<small><?php echo esc_html( $payment_badge['note'] ); ?></small>
		<?php if ( $payment_due_at ) : ?>
			<br><span style="display:inline-block;margin:6px 0 0;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $payment_due_badge['style'] ); ?>"><?php echo esc_html( $payment_due_badge['label'] ); ?></span>
		<?php endif; ?>
	</p>
	<p>
		<label for="justice-payment-followup-status"><strong>Payment follow-up status</strong></label>
		<select id="justice-payment-followup-status" name="payment_followup_status" style="width:100%;">
			<?php foreach ( justice_theme_lawyer_payment_followup_options() as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $payment_status, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
		<small>Use this to move manual invoice deals from requested to sent to paid. It is owner-only and never public.</small>
	</p>
	<p>
		<label for="justice-manual-payment-link-url"><strong>Manual payment link</strong></label>
		<input id="justice-manual-payment-link-url" type="url" name="manual_payment_link_url" value="<?php echo esc_attr( $manual_payment_link ); ?>" placeholder="https://pay.grow.link/..." style="width:100%;">
		<small>Paste the Grow/Morning payment link after creating it. Lawyers only see this CTA in their private area when a link exists.</small>
	</p>
	<p>
		<label>
			<input type="checkbox" name="send_manual_payment_link_email" value="1">
			<strong>Send this payment link by email now</strong>
		</label><br>
		<small>Uses billing invoice email first, then lawyer email. On successful send, the payment follow-up is marked as invoice sent.</small>
		<?php if ( $payment_link_sent_at || $payment_link_email_result ) : ?>
			<br><small>Last payment-link email: <?php echo esc_html( $payment_link_email_result ?: 'recorded' ); ?><?php echo $payment_link_sent_at ? esc_html( ' at ' . $payment_link_sent_at ) : ''; ?><?php echo $payment_link_sent_to ? esc_html( ' to ' . $payment_link_sent_to ) : ''; ?></small>
		<?php endif; ?>
		<?php if ( $manual_payment_whatsapp_url ) : ?>
			<br><a href="<?php echo esc_url( $manual_payment_whatsapp_url ); ?>" target="_blank" rel="noopener noreferrer">Open WhatsApp payment message</a>
		<?php endif; ?>
	</p>
	<p>
		<label for="justice-manual-invoice-reference"><strong>Invoice/payment reference</strong></label>
		<input id="justice-manual-invoice-reference" type="text" name="manual_invoice_reference" value="<?php echo esc_attr( $invoice_reference ); ?>" placeholder="Invoice number, Grow link name, or internal payment note" style="width:100%;">
		<small>Owner-only context for matching the payment request to the lawyer record.</small>
	</p>
	<p>
		<label for="justice-manual-payment-evidence-url"><strong>Private payment evidence URL</strong></label>
		<input id="justice-manual-payment-evidence-url" type="url" name="manual_payment_evidence_url" value="<?php echo esc_attr( $payment_evidence_url ); ?>" placeholder="Private receipt, bank/payment proof, or owner evidence URL" style="width:100%;">
		<small>Required before Payment confirmed. Keep this private; it is never shown publicly.</small>
	</p>
	<?php if ( $invoice_sent_at || $payment_confirmed_at || $payment_blocked_at || $payment_cancelled_at ) : ?>
		<p>
			<strong>Payment timeline</strong><br>
			<?php if ( $invoice_sent_at ) : ?><small>Invoice sent: <?php echo esc_html( $invoice_sent_at ); ?></small><br><?php endif; ?>
			<?php if ( $payment_confirmed_at ) : ?><small>Payment confirmed: <?php echo esc_html( $payment_confirmed_at ); ?></small><br><?php endif; ?>
			<?php if ( $payment_blocked_at ) : ?><small>Payment blocked: <?php echo esc_html( $payment_blocked_at ); ?></small><br><?php endif; ?>
			<?php if ( $payment_cancelled_at ) : ?><small>Payment cancelled: <?php echo esc_html( $payment_cancelled_at ); ?></small><?php endif; ?>
		</p>
	<?php endif; ?>
	<p>
		<strong>Lead response fit</strong><br>
		<small><?php echo esc_html( $response_options[ $response_commitment ] ?? $response_options[''] ); ?></small>
	</p>
	<p>
		<label for="justice-lawyer-activation-status"><strong>Activation status</strong></label>
		<select id="justice-lawyer-activation-status" name="activation_status" style="width:100%;">
			<?php foreach ( justice_theme_lawyer_activation_options() as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $status, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-first-value-at"><strong>First value time</strong></label>
		<input id="justice-first-value-at" type="datetime-local" name="first_value_at" value="<?php echo esc_attr( $first_value_at ); ?>" style="width:100%;">
	</p>
	<p>
		<label for="justice-activation-owner-note"><strong>Owner/customer-success note</strong></label>
		<textarea id="justice-activation-owner-note" name="activation_owner_note" rows="5" style="width:100%;"><?php echo esc_textarea( $owner_note ); ?></textarea>
	</p>
	<p style="color:#646970;">Owner-only tracking for time-to-first-value and retention review. No public display.</p>
	<?php
}

function justice_theme_render_lawyer_reputation_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lawyer_reputation', 'justice_theme_lawyer_reputation_nonce' );

	$business_url       = (string) get_post_meta( $post->ID, 'google_business_profile_url', true );
	$place_id           = (string) get_post_meta( $post->ID, 'google_place_id', true );
	$review_request_url = (string) get_post_meta( $post->ID, 'google_review_request_url', true );
	$review_count       = (string) get_post_meta( $post->ID, 'google_review_count', true );
	$latest_review_date = (string) get_post_meta( $post->ID, 'latest_review_date', true );
	$display_enabled    = (string) get_post_meta( $post->ID, 'review_display_enabled', true );
	?>
	<p>Owner-only source fields for reputation/review workflows. Do not copy Google review text into public pages from here. Use these fields to connect review links, freshness and future Google Business Profile API/OAuth work.</p>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="justice-google-business-profile-url">Google Business profile URL</label></th>
			<td><input id="justice-google-business-profile-url" type="url" name="google_business_profile_url" value="<?php echo esc_attr( $business_url ); ?>" class="regular-text" placeholder="https://maps.google.com/..."></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-google-place-id">Google Place ID</label></th>
			<td><input id="justice-google-place-id" type="text" name="google_place_id" value="<?php echo esc_attr( $place_id ); ?>" class="regular-text" placeholder="ChIJ..."></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-google-review-request-url">Google review request URL</label></th>
			<td><input id="justice-google-review-request-url" type="url" name="google_review_request_url" value="<?php echo esc_attr( $review_request_url ); ?>" class="regular-text" placeholder="https://search.google.com/local/writereview?placeid=..."></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-google-review-count">Google review count</label></th>
			<td><input id="justice-google-review-count" type="number" min="0" step="1" name="google_review_count" value="<?php echo esc_attr( $review_count ); ?>" class="small-text"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-latest-review-date">Latest review date</label></th>
			<td><input id="justice-latest-review-date" type="date" name="latest_review_date" value="<?php echo esc_attr( $latest_review_date ); ?>"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-review-display-enabled">Display approved recommendations</label></th>
			<td>
				<select id="justice-review-display-enabled" name="review_display_enabled">
					<option value="" <?php selected( $display_enabled, '' ); ?>>No / not reviewed</option>
					<option value="approved" <?php selected( $display_enabled, 'approved' ); ?>>Approved after owner review</option>
					<option value="disabled" <?php selected( $display_enabled, 'disabled' ); ?>>Disabled</option>
				</select>
				<p class="description">This flag is for first-party/display-approved recommendations. Google review text still needs a separate policy/API path.</p>
			</td>
		</tr>
	</table>
	<?php
}

function justice_theme_save_lawyer_activation( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lawyer_activation_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lawyer_activation_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lawyer_activation' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$status = isset( $_POST['activation_status'] ) ? sanitize_key( wp_unslash( $_POST['activation_status'] ) ) : 'registered';
	if ( ! array_key_exists( $status, justice_theme_lawyer_activation_options() ) ) {
		$status = 'registered';
	}

	update_post_meta( $post_id, 'activation_status', $status );
	update_post_meta( $post_id, 'first_value_at', isset( $_POST['first_value_at'] ) ? sanitize_text_field( wp_unslash( $_POST['first_value_at'] ) ) : '' );
	update_post_meta( $post_id, 'activation_owner_note', isset( $_POST['activation_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['activation_owner_note'] ) ) : '' );
	$manual_payment_link = isset( $_POST['manual_payment_link_url'] ) ? esc_url_raw( wp_unslash( $_POST['manual_payment_link_url'] ) ) : '';
	update_post_meta( $post_id, 'manual_payment_link_url', $manual_payment_link );
	update_post_meta( $post_id, 'manual_invoice_reference', isset( $_POST['manual_invoice_reference'] ) ? sanitize_text_field( wp_unslash( $_POST['manual_invoice_reference'] ) ) : '' );
	update_post_meta( $post_id, 'manual_payment_evidence_url', isset( $_POST['manual_payment_evidence_url'] ) ? esc_url_raw( wp_unslash( $_POST['manual_payment_evidence_url'] ) ) : '' );

	$payment_followup_status = isset( $_POST['payment_followup_status'] ) ? sanitize_key( wp_unslash( $_POST['payment_followup_status'] ) ) : '';
	justice_theme_set_lawyer_payment_followup_status( $post_id, $payment_followup_status, 'lawyer activation box' );

	if ( ! empty( $_POST['send_manual_payment_link_email'] ) ) {
		justice_theme_send_lawyer_manual_payment_link_email( $post_id, $manual_payment_link );
	}
}
add_action( 'save_post_justice_lawyer', 'justice_theme_save_lawyer_activation' );

function justice_theme_save_lawyer_reputation_sources( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lawyer_reputation_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lawyer_reputation_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lawyer_reputation' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	update_post_meta( $post_id, 'google_business_profile_url', isset( $_POST['google_business_profile_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_business_profile_url'] ) ) : '' );
	update_post_meta( $post_id, 'google_place_id', isset( $_POST['google_place_id'] ) ? sanitize_text_field( wp_unslash( $_POST['google_place_id'] ) ) : '' );
	update_post_meta( $post_id, 'google_review_request_url', isset( $_POST['google_review_request_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_review_request_url'] ) ) : '' );
	update_post_meta( $post_id, 'google_review_count', isset( $_POST['google_review_count'] ) ? absint( wp_unslash( $_POST['google_review_count'] ) ) : 0 );
	update_post_meta( $post_id, 'latest_review_date', isset( $_POST['latest_review_date'] ) ? sanitize_text_field( wp_unslash( $_POST['latest_review_date'] ) ) : '' );

	$display_enabled = isset( $_POST['review_display_enabled'] ) ? sanitize_key( wp_unslash( $_POST['review_display_enabled'] ) ) : '';
	if ( ! in_array( $display_enabled, array( '', 'approved', 'disabled' ), true ) ) {
		$display_enabled = '';
	}
	update_post_meta( $post_id, 'review_display_enabled', $display_enabled );
}
add_action( 'save_post_justice_lawyer', 'justice_theme_save_lawyer_reputation_sources' );

function justice_theme_apply_lawyer_profile_update(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to apply this update.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_apply_lawyer_profile_update_' . $post_id );

	$field_map = array(
		'pending_profile_headline'  => 'profile_headline',
		'pending_profile_bar_number' => 'bar_number',
		'pending_profile_website'   => 'website',
		'pending_profile_services'  => 'profile_services',
		'pending_profile_process'   => 'profile_process',
		'pending_profile_video_url' => 'profile_video_url',
		'pending_profile_faqs'      => 'profile_faqs',
	);

	foreach ( $field_map as $pending_key => $public_key ) {
		$value = get_post_meta( $post_id, $pending_key, true );
		if ( '' !== trim( (string) $value ) ) {
			update_post_meta( $post_id, $public_key, $value );
		}
		delete_post_meta( $post_id, $pending_key );
	}

	delete_post_meta( $post_id, 'pending_profile_review' );
	delete_post_meta( $post_id, 'pending_profile_submitted_at' );
	update_post_meta( $post_id, 'profile_status', 'update_applied_pending_final_review' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner applied staged mini-site update; final public review still required.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_applied', 'Applied pending lawyer profile update: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'profile_update', 'applied', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_apply_lawyer_profile_update', 'justice_theme_apply_lawyer_profile_update' );

function justice_theme_discard_lawyer_profile_update(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to discard this update.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_discard_lawyer_profile_update_' . $post_id );

	$pending_keys = array(
		'pending_profile_headline',
		'pending_profile_bar_number',
		'pending_profile_website',
		'pending_profile_services',
		'pending_profile_process',
		'pending_profile_video_url',
		'pending_profile_faqs',
		'pending_profile_review',
		'pending_profile_submitted_at',
	);

	foreach ( $pending_keys as $key ) {
		delete_post_meta( $post_id, $key );
	}

	update_post_meta( $post_id, 'profile_status', 'update_rejected_no_public_change' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner discarded staged mini-site update; public profile fields were not changed.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_discarded', 'Discarded pending lawyer profile update: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'profile_update', 'discarded', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_discard_lawyer_profile_update', 'justice_theme_discard_lawyer_profile_update' );

function justice_theme_mark_lawyer_content_reviewed(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to mark this content request reviewed.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_mark_lawyer_content_reviewed_' . $post_id );

	delete_post_meta( $post_id, 'pending_content_review' );
	update_post_meta( $post_id, 'latest_content_request_reviewed_at', current_time( 'mysql' ) );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner marked latest signed-content request as reviewed in Lawyer Onboarding.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_content_request_reviewed', 'Marked lawyer content request reviewed: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'content_review', 'marked', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_mark_lawyer_content_reviewed', 'justice_theme_mark_lawyer_content_reviewed' );

function justice_theme_mark_lawyer_review_campaign_reviewed(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to mark this review campaign reviewed.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_mark_lawyer_review_campaign_reviewed_' . $post_id );

	delete_post_meta( $post_id, 'pending_review_campaign_request' );
	update_post_meta( $post_id, 'latest_review_campaign_reviewed_at', current_time( 'mysql' ) );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner marked latest review/recommendation campaign request as reviewed in Lawyer Onboarding.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_review_campaign_reviewed', 'Marked lawyer review campaign reviewed: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'review_campaign', 'marked', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_mark_lawyer_review_campaign_reviewed', 'justice_theme_mark_lawyer_review_campaign_reviewed' );

function justice_theme_mark_lawyer_registration_assets_reviewed(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to mark these registration assets reviewed.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_mark_lawyer_registration_assets_reviewed_' . $post_id );

	delete_post_meta( $post_id, 'pending_upload_review' );
	update_post_meta( $post_id, 'latest_registration_assets_reviewed_at', current_time( 'mysql' ) );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner marked registration uploads/assets as reviewed. No public asset display changed automatically.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_registration_assets_reviewed', 'Marked lawyer registration assets reviewed: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'asset_review', 'marked', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_mark_lawyer_registration_assets_reviewed', 'justice_theme_mark_lawyer_registration_assets_reviewed' );

function justice_theme_mark_lawyer_ai_profile_draft_reviewed(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to mark this AI profile draft reviewed.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_mark_lawyer_ai_profile_draft_reviewed_' . $post_id );

	delete_post_meta( $post_id, 'pending_ai_profile_draft_review' );
	update_post_meta( $post_id, 'latest_ai_profile_draft_reviewed_at', current_time( 'mysql' ) );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner marked AI-assistant profile draft scaffold as reviewed. No public profile text changed automatically.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_ai_profile_draft_reviewed', 'Marked lawyer AI profile draft reviewed: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'ai_draft_review', 'marked', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_mark_lawyer_ai_profile_draft_reviewed', 'justice_theme_mark_lawyer_ai_profile_draft_reviewed' );

function justice_theme_update_lawyer_payment_followup(): void {
	$post_id          = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;
	$followup_status = isset( $_GET['payment_status'] ) ? sanitize_key( wp_unslash( $_GET['payment_status'] ) ) : '';

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to update this payment follow-up.', 'justice-theme' ) );
	}

	if ( '' === $followup_status || ! array_key_exists( $followup_status, justice_theme_lawyer_payment_followup_options() ) ) {
		wp_die( esc_html__( 'Invalid payment follow-up status.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_update_lawyer_payment_followup_' . $post_id . '_' . $followup_status );

	justice_theme_set_lawyer_payment_followup_status( $post_id, $followup_status, 'Lawyer Onboarding quick action' );
	$final_followup_status = (string) get_post_meta( $post_id, 'payment_followup_status', true );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_payment_followup_updated', 'Updated lawyer payment follow-up to ' . $followup_status . ': ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg(
		array(
			'payment_followup' => 'updated',
			'payment_queue'    => $final_followup_status ?: $followup_status,
		),
		admin_url( 'admin.php?page=justice-lawyer-onboarding' )
	) );
	exit;
}
add_action( 'admin_post_justice_update_lawyer_payment_followup', 'justice_theme_update_lawyer_payment_followup' );

function justice_theme_send_lawyer_manual_payment_link_from_queue(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to send this payment link.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_send_lawyer_manual_payment_link_' . $post_id );

	$manual_payment_link = (string) get_post_meta( $post_id, 'manual_payment_link_url', true );
	$sent                = justice_theme_send_lawyer_manual_payment_link_email( $post_id, $manual_payment_link );
	$result              = $sent ? 'sent' : ( (string) get_post_meta( $post_id, 'manual_payment_link_email_last_result', true ) ?: 'failed' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_manual_payment_link_email_' . $result, 'Manual payment link email ' . $result . ': ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect(
		add_query_arg(
			array(
				'payment_link_email'  => $result,
				'payment_link_status' => 'ready',
			),
			admin_url( 'admin.php?page=justice-lawyer-onboarding' )
		)
	);
	exit;
}
add_action( 'admin_post_justice_send_lawyer_manual_payment_link', 'justice_theme_send_lawyer_manual_payment_link_from_queue' );

function justice_theme_update_lawyer_service_request_status(): void {
	$post_id        = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;
	$service_status = isset( $_GET['service_status'] ) ? sanitize_key( wp_unslash( $_GET['service_status'] ) ) : '';
	$options        = justice_theme_lawyer_service_request_status_options();

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to update this service request.', 'justice-theme' ) );
	}

	if ( ! array_key_exists( $service_status, $options ) ) {
		wp_die( esc_html__( 'Invalid service request status.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_update_lawyer_service_request_status_' . $post_id . '_' . $service_status );

	$previous_status = (string) get_post_meta( $post_id, 'latest_service_request_status', true );
	update_post_meta( $post_id, 'latest_service_request_status', $service_status );

	if ( 'resolved' === $service_status ) {
		delete_post_meta( $post_id, 'pending_service_request' );
	} else {
		update_post_meta( $post_id, 'pending_service_request', '1' );
	}

	$timestamp_meta = array(
		'in_review' => 'latest_service_request_in_review_at',
		'resolved'  => 'latest_service_request_resolved_at',
		'blocked'   => 'latest_service_request_blocked_at',
	);

	if ( isset( $timestamp_meta[ $service_status ] ) && '' === (string) get_post_meta( $post_id, $timestamp_meta[ $service_status ], true ) ) {
		update_post_meta( $post_id, $timestamp_meta[ $service_status ], current_time( 'mysql' ) );
	}

	if ( $service_status !== $previous_status ) {
		justice_theme_append_lawyer_internal_note(
			$post_id,
			sprintf(
				'Service request status changed from %s to %s from Lawyer Onboarding.',
				$previous_status ?: 'open',
				$options[ $service_status ]
			)
		);
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_service_request_status_updated', 'Updated lawyer service request to ' . $service_status . ': ' . get_the_title( $post_id ) );
	}

	$redirect_args = array(
		'page'                     => 'justice-lawyer-onboarding',
		'service_request_followup' => 'updated',
	);

	if ( 'resolved' !== $service_status ) {
		$redirect_args['service_request_status'] = 'pending';
	}

	wp_safe_redirect( add_query_arg( $redirect_args, admin_url( 'admin.php' ) ) );
	exit;
}
add_action( 'admin_post_justice_update_lawyer_service_request_status', 'justice_theme_update_lawyer_service_request_status' );

function justice_theme_lawyer_onboarding_plan_label( string $plan ): string {
	if ( function_exists( 'justice_theme_lawyer_plans' ) ) {
		$plans = justice_theme_lawyer_plans();

		if ( isset( $plans[ $plan ]['label'] ) ) {
			return (string) $plans[ $plan ]['label'];
		}
	}

	return $plan ?: '-';
}

function justice_theme_lawyer_onboarding_sales_priority( string $plan ): array {
	if ( in_array( $plan, array( 'lead_partner', 'full_service' ), true ) ) {
		return array(
			'label' => 'HIGH',
			'style' => 'background:#fef2f2;color:#991b1b;',
			'note'  => 'Call first: high-value commercial intent.',
		);
	}

	if ( in_array( $plan, array( 'pro', 'featured' ), true ) ) {
		return array(
			'label' => 'MEDIUM',
			'style' => 'background:#fff7ed;color:#9a3412;',
			'note'  => 'Follow up with mini-site and visibility offer.',
		);
	}

	return array(
		'label' => 'LOW',
		'style' => 'background:#f1f5f9;color:#334155;',
		'note'  => 'Nurture until paid intent appears.',
	);
}

function justice_theme_lawyer_onboarding_prospect_count( string $meta_key, $value ): int {
	if ( ! post_type_exists( 'justice_prospect' ) ) {
		return 0;
	}

	$query_args = array(
		'post_type'      => 'justice_prospect',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_query'     => array(
			array(
				'key'   => $meta_key,
				'value' => $value,
			),
		),
	);

	if ( is_array( $value ) ) {
		$query_args['meta_query'][0]['compare'] = 'IN';
	}

	$query = new WP_Query( $query_args );

	return (int) $query->found_posts;
}

function justice_theme_lawyer_onboarding_prospect_value( array $statuses ): int {
	if ( ! post_type_exists( 'justice_prospect' ) ) {
		return 0;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_prospect',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 500,
		'fields'         => 'ids',
		'meta_query'     => array(
			array(
				'key'     => 'prospect_outreach_status',
				'value'   => $statuses,
				'compare' => 'IN',
			),
		),
	) );

	$total = 0;
	foreach ( $query->posts as $post_id ) {
		$total += absint( get_post_meta( (int) $post_id, 'prospect_expected_monthly_nis', true ) );
	}

	return $total;
}

function justice_theme_lawyer_onboarding_sales_next_action( int $overdue_count, int $due_count, int $missing_contact_count, int $unscheduled_count, int $hot_count, int $proposal_count, int $active_value, array $links ): array {
	if ( $overdue_count > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Work overdue follow-ups first',
			'body'   => sprintf( 'There are %s overdue lawyer follow-ups. Protect trust and pipeline accuracy before starting new outreach.', number_format_i18n( $overdue_count ) ),
			'url'    => $links['overdue'],
			'button' => 'Open overdue follow-ups',
		);
	}

	if ( $due_count > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Clear today\'s due follow-ups',
			'body'   => sprintf( 'There are %s prospects due now. Move each one to contacted, proposal, won, lost or a new follow-up date.', number_format_i18n( $due_count ) ),
			'url'    => $links['due'],
			'button' => 'Open due prospects',
		);
	}

	if ( $missing_contact_count > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Add contact details before outreach',
			'body'   => sprintf( '%s active prospects have no email or phone. Add one contact channel before counting them as reachable pipeline.', number_format_i18n( $missing_contact_count ) ),
			'url'    => $links['missing_contact'],
			'button' => 'Open missing contact details',
		);
	}

	if ( $unscheduled_count > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Schedule every active prospect',
			'body'   => sprintf( '%s active prospects have no next action date. Set a follow-up or move each one to won/lost so the pipeline stays honest.', number_format_i18n( $unscheduled_count ) ),
			'url'    => $links['unscheduled'],
			'button' => 'Open unscheduled prospects',
		);
	}

	if ( $proposal_count > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Convert open proposals',
			'body'   => sprintf( '%s proposal-stage prospects need a clear answer: won, next follow-up, or not a fit.', number_format_i18n( $proposal_count ) ),
			'url'    => $links['proposal'],
			'button' => 'Open proposals',
		);
	}

	if ( $hot_count > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Call hot prospects',
			'body'   => sprintf( '%s hot prospects are ready for a direct owner touch. Prioritize high-value plan fit and response speed.', number_format_i18n( $hot_count ) ),
			'url'    => $links['hot'],
			'button' => 'Open hot prospects',
		);
	}

	if ( $active_value > 0 ) {
		return array(
			'label'  => 'Next best action',
			'title'  => 'Review active pipeline',
			'body'   => sprintf( 'There is %s NIS in active monthly pipeline. Check for stuck records and set the next action date on every serious prospect.', number_format_i18n( $active_value ) ),
			'url'    => $links['prospects'],
			'button' => 'Open pipeline',
		);
	}

	return array(
		'label'  => 'Next best action',
		'title'  => 'Create the first tracked outreach batch',
		'body'   => 'No active prospect pressure is visible yet. Build one small tracked batch, create one prospect record per lawyer, then follow up from this dashboard.',
		'url'    => $links['outreach'],
		'button' => 'Build outreach link',
	);
}

function justice_theme_render_lawyer_onboarding_sales_command_center(): void {
	if ( ! post_type_exists( 'justice_prospect' ) ) {
		return;
	}

	$active_statuses = array( 'ready', 'contacted', 'follow_up', 'demo_booked', 'proposal_sent' );
	$due_count       = function_exists( 'justice_theme_lawyer_prospect_due_count' ) ? justice_theme_lawyer_prospect_due_count( 'due' ) : 0;
	$overdue_count   = function_exists( 'justice_theme_lawyer_prospect_due_count' ) ? justice_theme_lawyer_prospect_due_count( 'overdue' ) : 0;
	$missing_contact_count = function_exists( 'justice_theme_lawyer_prospect_missing_contact_count' ) ? justice_theme_lawyer_prospect_missing_contact_count() : 0;
	$unscheduled_count = function_exists( 'justice_theme_lawyer_prospect_due_count' ) ? justice_theme_lawyer_prospect_due_count( 'unscheduled' ) : 0;
	$hot_count       = justice_theme_lawyer_onboarding_prospect_count( 'prospect_priority', 'hot' );
	$proposal_count  = justice_theme_lawyer_onboarding_prospect_count( 'prospect_outreach_status', 'proposal_sent' );
	$active_value    = justice_theme_lawyer_onboarding_prospect_value( $active_statuses );
	$won_value       = justice_theme_lawyer_onboarding_prospect_value( array( 'won' ) );
	$links           = array(
		'due'         => add_query_arg( 'justice_prospect_due_filter', 'due', admin_url( 'edit.php?post_type=justice_prospect' ) ),
		'overdue'     => add_query_arg( 'justice_prospect_due_filter', 'overdue', admin_url( 'edit.php?post_type=justice_prospect' ) ),
		'unscheduled' => add_query_arg( 'justice_prospect_due_filter', 'unscheduled', admin_url( 'edit.php?post_type=justice_prospect' ) ),
		'missing_contact' => add_query_arg( 'justice_prospect_contact_filter', 'missing', admin_url( 'edit.php?post_type=justice_prospect' ) ),
		'hot'         => add_query_arg( 'justice_prospect_priority_filter', 'hot', admin_url( 'edit.php?post_type=justice_prospect' ) ),
		'proposal'    => add_query_arg( 'justice_prospect_status_filter', 'proposal_sent', admin_url( 'edit.php?post_type=justice_prospect' ) ),
		'outreach'    => admin_url( 'admin.php?page=justice-lawyer-outreach-links' ),
		'prospects'   => admin_url( 'edit.php?post_type=justice_prospect' ),
		'new'         => admin_url( 'post-new.php?post_type=justice_prospect' ),
	);
	$next_action     = justice_theme_lawyer_onboarding_sales_next_action( $overdue_count, $due_count, $missing_contact_count, $unscheduled_count, $hot_count, $proposal_count, $active_value, $links );
	?>
	<div style="max-width:1200px;background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:18px 20px;margin:18px 0;">
		<h2 style="margin-top:0;">Lawyer sales command center</h2>
		<p style="margin-top:0;">Daily operating view for turning manual outreach into paid lawyer coverage. Work overdue and due prospects first, then create the next small outreach batch.</p>
		<div style="border:1px solid #bfd7ff;background:#f6f9ff;border-radius:8px;padding:16px;margin:16px 0;">
			<p style="margin:0 0 6px;color:#1d4ed8;font-weight:700;text-transform:uppercase;letter-spacing:.02em;"><?php echo esc_html( $next_action['label'] ); ?></p>
			<h3 style="margin:0 0 6px;font-size:20px;"><?php echo esc_html( $next_action['title'] ); ?></h3>
			<p style="margin:0 0 12px;max-width:760px;"><?php echo esc_html( $next_action['body'] ); ?></p>
			<p style="margin:0;">
				<a class="button button-primary" href="<?php echo esc_url( $next_action['url'] ); ?>"><?php echo esc_html( $next_action['button'] ); ?></a>
				<span style="display:inline-block;margin:6px 0 0 8px;color:#475569;">Order: overdue -> due -> missing contact -> needs scheduling -> proposals -> hot prospects -> new outreach.</span>
			</p>
		</div>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:16px 0;">
			<div style="border:1px solid #f1c0c0;background:#fff7f7;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $overdue_count ) ); ?></strong>
				<span>Overdue follow-ups</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['overdue'] ); ?>">Open overdue</a></p>
			</div>
			<div style="border:1px solid #f5d58c;background:#fffaf0;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $due_count ) ); ?></strong>
				<span>Due now</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['due'] ); ?>">Open due list</a></p>
			</div>
			<div style="border:1px solid #ffd0b5;background:#fff8f3;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $missing_contact_count ) ); ?></strong>
				<span>Needs contact details</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['missing_contact'] ); ?>">Open missing contact</a></p>
			</div>
			<div style="border:1px solid #e0d2ff;background:#fbf8ff;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $unscheduled_count ) ); ?></strong>
				<span>Needs scheduling</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['unscheduled'] ); ?>">Open unscheduled</a></p>
			</div>
			<div style="border:1px solid #d6e4ff;background:#f7faff;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $hot_count ) ); ?></strong>
				<span>Hot prospects</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['hot'] ); ?>">Open hot list</a></p>
			</div>
			<div style="border:1px solid #d4e8d4;background:#f7fff7;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $proposal_count ) ); ?></strong>
				<span>Proposal sent</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['proposal'] ); ?>">Open proposals</a></p>
			</div>
			<div style="border:1px solid #dcdcde;background:#fbfbfb;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:24px;line-height:1;"><?php echo esc_html( number_format_i18n( $active_value ) ); ?> NIS</strong>
				<span>Active monthly pipeline</span>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $links['prospects'] ); ?>">Open pipeline</a></p>
			</div>
			<div style="border:1px solid #dcdcde;background:#fbfbfb;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:24px;line-height:1;"><?php echo esc_html( number_format_i18n( $won_value ) ); ?> NIS</strong>
				<span>Won monthly value</span>
				<p style="margin:8px 0 0;">Update after real wins.</p>
			</div>
		</div>
		<p>
			<a class="button button-primary" href="<?php echo esc_url( $links['outreach'] ); ?>">Build tracked outreach link</a>
			<a class="button" href="<?php echo esc_url( $links['new'] ); ?>">Add manual prospect</a>
			<a class="button" href="<?php echo esc_url( $links['prospects'] ); ?>">Open all prospects</a>
		</p>
	</div>
	<?php
}

function justice_theme_lawyer_onboarding_count_lawyers( array $meta_query ): int {
	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return 0;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_query'     => $meta_query,
	) );

	return (int) $query->found_posts;
}

function justice_theme_lawyer_onboarding_monthly_value( array $meta_query ): int {
	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return 0;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 500,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => $meta_query,
	) );

	$total = 0;

	foreach ( $query->posts as $post_id ) {
		$total += justice_theme_lawyer_outreach_expected_monthly_nis( (string) get_post_meta( (int) $post_id, 'plan_type', true ) );
	}

	return $total;
}

function justice_theme_lawyer_onboarding_money_label( int $amount ): string {
	return number_format_i18n( max( 0, $amount ) ) . ' NIS/mo';
}

function justice_theme_lawyer_onboarding_billing_meta_query( string $status ): array {
	$base = array(
		'relation' => 'AND',
		array(
			'key'   => 'payment_path',
			'value' => 'manual_invoice',
		),
	);

	if ( 'ready' === $status ) {
		$base[] = array(
			'key'     => 'billing_legal_name',
			'value'   => '',
			'compare' => '!=',
		);
		$base[] = array(
			'key'     => 'billing_invoice_email',
			'value'   => '',
			'compare' => '!=',
		);

		return $base;
	}

	$base[] = array(
		'relation' => 'OR',
		array(
			'key'     => 'billing_legal_name',
			'compare' => 'NOT EXISTS',
		),
		array(
			'key'   => 'billing_legal_name',
			'value' => '',
		),
		array(
			'key'     => 'billing_invoice_email',
			'compare' => 'NOT EXISTS',
		),
		array(
			'key'   => 'billing_invoice_email',
			'value' => '',
		),
	);

	return $base;
}

function justice_theme_lawyer_onboarding_payment_link_meta_query( string $status ): array {
	$base = array(
		'relation' => 'AND',
		array(
			'key'   => 'payment_path',
			'value' => 'manual_invoice',
		),
		array(
			'key'     => 'payment_followup_status',
			'value'   => array( 'invoice_requested', 'invoice_sent' ),
			'compare' => 'IN',
		),
	);

	if ( 'ready' === $status ) {
		$base[] = array(
			'key'     => 'manual_payment_link_url',
			'value'   => '',
			'compare' => '!=',
		);

		return $base;
	}

	$base[] = justice_theme_lawyer_onboarding_billing_meta_query( 'ready' );
	$base[] = array(
		'relation' => 'OR',
		array(
			'key'     => 'manual_payment_link_url',
			'compare' => 'NOT EXISTS',
		),
		array(
			'key'   => 'manual_payment_link_url',
			'value' => '',
		),
	);

	return $base;
}

function justice_theme_lawyer_onboarding_service_request_meta_query(): array {
	return array(
		array(
			'key'   => 'pending_service_request',
			'value' => '1',
		),
	);
}

function justice_theme_lawyer_onboarding_source_filter_keys(): array {
	return array(
		'outreach_segment'  => 'Segment',
		'utm_content'       => 'Message',
		'outreach_city'     => 'City',
		'outreach_practice' => 'Practice',
		'utm_campaign'      => 'Campaign',
		'utm_source'        => 'Source',
	);
}

function justice_theme_lawyer_onboarding_source_filter_url( string $source_key, string $source_value ): string {
	return add_query_arg(
		array(
			'page'         => 'justice-lawyer-onboarding',
			'source_key'   => $source_key,
			'source_value' => $source_value,
		),
		admin_url( 'admin.php' )
	);
}

function justice_theme_lawyer_source_performance_export_url(): string {
	return wp_nonce_url(
		add_query_arg(
			array(
				'action' => 'justice_export_lawyer_source_performance',
			),
			admin_url( 'admin-post.php' )
		),
		'justice_export_lawyer_source_performance'
	);
}

function justice_theme_lawyer_onboarding_compact_terms( array $values, int $limit = 3 ): string {
	$values = array_values( array_unique( array_filter( array_map( 'strval', $values ) ) ) );

	if ( empty( $values ) ) {
		return '-';
	}

	$visible = array_slice( $values, 0, $limit );
	$extra   = count( $values ) - count( $visible );
	$label   = implode( ', ', $visible );

	if ( $extra > 0 ) {
		$label .= ' +' . $extra;
	}

	return $label;
}

function justice_theme_lawyer_onboarding_export_terms( array $values ): string {
	$values = array_values( array_unique( array_filter( array_map( 'strval', $values ) ) ) );

	return implode( '; ', $values );
}

function justice_theme_lawyer_onboarding_source_key_for_post( int $post_id ): array {
	$priority_keys = array( 'outreach_segment', 'utm_content', 'outreach_city', 'outreach_practice', 'utm_campaign', 'utm_source' );

	foreach ( $priority_keys as $key ) {
		$value = (string) get_post_meta( $post_id, $key, true );

		if ( '' !== $value ) {
			return array( $key, $value );
		}
	}

	return array( 'utm_source', 'direct_or_unknown' );
}

function justice_theme_lawyer_onboarding_source_performance_rows( int $limit = 8 ): array {
	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 500,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'   => 'source_type',
				'value' => 'registration',
			),
			array(
				'key'   => 'payment_path',
				'value' => 'manual_invoice',
			),
			array(
				'key'     => 'payment_followup_status',
				'compare' => 'EXISTS',
			),
		),
	) );

	$rows = array();

	foreach ( $query->posts as $post_id ) {
		$post_id = (int) $post_id;
		list( $source_key, $source_value ) = justice_theme_lawyer_onboarding_source_key_for_post( $post_id );
		$row_key = $source_key . '|' . $source_value;

		if ( ! isset( $rows[ $row_key ] ) ) {
			$rows[ $row_key ] = array(
				'source_key'        => $source_key,
				'source_value'      => $source_value,
				'count'             => 0,
				'monthly_value'     => 0,
				'invoice_requested' => 0,
				'invoice_sent'      => 0,
				'payment_confirmed' => 0,
				'payment_blocked'   => 0,
				'payment_cancelled' => 0,
				'manual_invoice'    => 0,
				'cities'            => array(),
				'practices'         => array(),
				'messages'          => array(),
				'latest_timestamp'  => 0,
			);
		}

		$plan            = (string) get_post_meta( $post_id, 'plan_type', true );
		$payment_path    = (string) get_post_meta( $post_id, 'payment_path', true );
		$payment_status  = (string) get_post_meta( $post_id, 'payment_followup_status', true );
		$latest_time     = get_post_time( 'U', true, $post_id );
		$expected_monthly = justice_theme_lawyer_outreach_expected_monthly_nis( $plan );

		$rows[ $row_key ]['count']++;
		$rows[ $row_key ]['monthly_value'] += $expected_monthly;
		$rows[ $row_key ]['latest_timestamp'] = max( $rows[ $row_key ]['latest_timestamp'], $latest_time );
		$rows[ $row_key ]['cities'][]          = (string) get_post_meta( $post_id, 'outreach_city', true );
		$rows[ $row_key ]['practices'][]       = (string) get_post_meta( $post_id, 'outreach_practice', true );
		$rows[ $row_key ]['messages'][]        = (string) get_post_meta( $post_id, 'utm_content', true );

		if ( 'manual_invoice' === $payment_path ) {
			$rows[ $row_key ]['manual_invoice']++;
		}

		if ( isset( $rows[ $row_key ][ $payment_status ] ) ) {
			$rows[ $row_key ][ $payment_status ]++;
		}
	}

	usort(
		$rows,
		static function ( array $a, array $b ): int {
			if ( $a['monthly_value'] === $b['monthly_value'] ) {
				return $b['count'] <=> $a['count'];
			}

			return $b['monthly_value'] <=> $a['monthly_value'];
		}
	);

	return $limit > 0 ? array_slice( $rows, 0, $limit ) : $rows;
}

function justice_theme_render_lawyer_onboarding_source_performance(): void {
	$rows        = justice_theme_lawyer_onboarding_source_performance_rows();
	$filter_keys = justice_theme_lawyer_onboarding_source_filter_keys();
	$export_url  = justice_theme_lawyer_source_performance_export_url();

	?>
	<div style="max-width:1200px;background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:18px 20px;margin:18px 0;">
		<h2 style="margin-top:0;">Source performance board</h2>
		<p style="margin-top:0;">Use this to decide which lawyer outreach segment, message, city or practice area deserves the next call batch. It mirrors the intake-reporting pattern used by serious legal CRMs: source, value and follow-up status in one view.</p>
		<p style="margin:0 0 12px;"><a class="button" href="<?php echo esc_url( $export_url ); ?>">Export source performance CSV</a></p>
		<?php if ( empty( $rows ) ) : ?>
			<div style="border:1px solid #dcdcde;background:#fbfbfb;border-radius:8px;padding:14px;">
				<strong>No attributed paid-lawyer registrations yet.</strong>
				<p style="margin:6px 0 0;">Create the next tracked outreach link, then watch this board after the first submissions arrive.</p>
			</div>
		<?php else : ?>
			<table class="widefat striped" style="margin-top:12px;">
				<thead>
					<tr>
						<th>Source bucket</th>
						<th>Registrations</th>
						<th>Expected MRR</th>
						<th>Payment queue</th>
						<th>City / practice / message</th>
						<th>Latest</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $rows as $row ) : ?>
						<?php
						$latest_label = $row['latest_timestamp'] ? wp_date( 'Y-m-d H:i', (int) $row['latest_timestamp'] ) : '-';
						$payment_bits = array(
							'requested ' . number_format_i18n( (int) $row['invoice_requested'] ),
							'sent ' . number_format_i18n( (int) $row['invoice_sent'] ),
							'paid ' . number_format_i18n( (int) $row['payment_confirmed'] ),
							'blocked ' . number_format_i18n( (int) $row['payment_blocked'] ),
						);
						?>
						<tr>
							<td>
								<strong><?php echo esc_html( $row['source_value'] ); ?></strong><br>
								<small><?php echo esc_html( $filter_keys[ $row['source_key'] ] ?? $row['source_key'] ); ?></small>
							</td>
							<td><?php echo esc_html( number_format_i18n( (int) $row['count'] ) ); ?></td>
							<td><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( (int) $row['monthly_value'] ) ); ?></td>
							<td><?php echo esc_html( implode( ' / ', $payment_bits ) ); ?></td>
							<td>
								<small>
									City: <?php echo esc_html( justice_theme_lawyer_onboarding_compact_terms( $row['cities'] ) ); ?><br>
									Practice: <?php echo esc_html( justice_theme_lawyer_onboarding_compact_terms( $row['practices'] ) ); ?><br>
									Message: <?php echo esc_html( justice_theme_lawyer_onboarding_compact_terms( $row['messages'] ) ); ?>
								</small>
							</td>
							<td><?php echo esc_html( $latest_label ); ?></td>
							<td><a class="button button-small" href="<?php echo esc_url( justice_theme_lawyer_onboarding_source_filter_url( $row['source_key'], $row['source_value'] ) ); ?>">Open source</a></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_export_lawyer_source_performance(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to export lawyer source performance.', 'justice-theme' ) );
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_die( esc_html__( 'The lawyer post type is not active.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_export_lawyer_source_performance' );

	$filename = 'justice-lawyer-source-performance-' . wp_date( 'Y-m-d-His' ) . '.csv';

	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	header( 'X-Robots-Tag: noindex, nofollow', true );

	echo "\xEF\xBB\xBF";

	$output = fopen( 'php://output', 'w' );
	if ( ! $output ) {
		exit;
	}

	fputcsv( $output, array(
		'source_key',
		'source_label',
		'source_value',
		'registrations',
		'expected_monthly_nis',
		'expected_annual_nis',
		'manual_invoice_count',
		'invoice_requested',
		'invoice_sent',
		'payment_confirmed',
		'payment_blocked',
		'payment_cancelled',
		'cities',
		'practices',
		'messages',
		'latest_submission_at',
		'admin_filter_url',
		'next_action',
	) );

	$filter_keys = justice_theme_lawyer_onboarding_source_filter_keys();

	foreach ( justice_theme_lawyer_onboarding_source_performance_rows( 0 ) as $row ) {
		$latest_label = $row['latest_timestamp'] ? wp_date( 'Y-m-d H:i', (int) $row['latest_timestamp'] ) : '';
		$next_action  = 'Repeat or pause this source based on payment follow-up quality; open the filtered queue before creating the next outreach batch.';

		if ( (int) $row['invoice_requested'] > 0 ) {
			$next_action = 'Open this source and send or chase manual invoices for invoice-requested registrations.';
		} elseif ( (int) $row['invoice_sent'] > 0 ) {
			$next_action = 'Open this source and chase sent invoices until paid, blocked, or cancelled.';
		} elseif ( (int) $row['payment_confirmed'] > 0 ) {
			$next_action = 'Repeat this source after activation and first-value delivery are confirmed.';
		}

		fputcsv( $output, array_map( 'justice_theme_lawyer_payment_export_cell', array(
			$row['source_key'],
			$filter_keys[ $row['source_key'] ] ?? $row['source_key'],
			$row['source_value'],
			$row['count'],
			$row['monthly_value'],
			(int) $row['monthly_value'] * 12,
			$row['manual_invoice'],
			$row['invoice_requested'],
			$row['invoice_sent'],
			$row['payment_confirmed'],
			$row['payment_blocked'],
			$row['payment_cancelled'],
			justice_theme_lawyer_onboarding_export_terms( $row['cities'] ),
			justice_theme_lawyer_onboarding_export_terms( $row['practices'] ),
			justice_theme_lawyer_onboarding_export_terms( $row['messages'] ),
			$latest_label,
			justice_theme_lawyer_onboarding_source_filter_url( $row['source_key'], $row['source_value'] ),
			$next_action,
		) ) );
	}

	fclose( $output );
	exit;
}
add_action( 'admin_post_justice_export_lawyer_source_performance', 'justice_theme_export_lawyer_source_performance' );

function justice_theme_lawyer_onboarding_payment_due_meta_query( string $mode ): array {
	$now  = current_time( 'mysql' );
	$soon = wp_date( 'Y-m-d H:i:s', current_time( 'timestamp' ) + 2 * DAY_IN_SECONDS );

	$due_query = array(
		'key'     => 'payment_followup_due_at',
		'value'   => $now,
		'compare' => '<=',
		'type'    => 'DATETIME',
	);

	if ( 'due_soon' === $mode ) {
		$due_query = array(
			'key'     => 'payment_followup_due_at',
			'value'   => array( $now, $soon ),
			'compare' => 'BETWEEN',
			'type'    => 'DATETIME',
		);
	}

	return array(
		'relation' => 'AND',
		array(
			'key'     => 'payment_followup_status',
			'value'   => array( 'invoice_requested', 'invoice_sent' ),
			'compare' => 'IN',
		),
		$due_query,
	);
}

function justice_theme_lawyer_onboarding_payment_due_count( string $mode ): int {
	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return 0;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'meta_query'     => justice_theme_lawyer_onboarding_payment_due_meta_query( $mode ),
	) );

	return (int) $query->found_posts;
}

function justice_theme_lawyer_onboarding_payment_due_value( string $mode ): int {
	return justice_theme_lawyer_onboarding_monthly_value( justice_theme_lawyer_onboarding_payment_due_meta_query( $mode ) );
}

function justice_theme_render_lawyer_onboarding_payment_command_center(): void {
	$payment_confirmed_meta_query = array(
		array(
			'key'   => 'payment_followup_status',
			'value' => 'payment_confirmed',
		),
		array(
			'key'     => 'manual_payment_evidence_url',
			'compare' => 'EXISTS',
		),
		array(
			'key'     => 'manual_payment_evidence_url',
			'value'   => '',
			'compare' => '!=',
		),
	);
	$invoice_requested_count = justice_theme_lawyer_onboarding_count_lawyers( array(
		array(
			'key'   => 'payment_followup_status',
			'value' => 'invoice_requested',
		),
	) );
	$invoice_sent_count      = justice_theme_lawyer_onboarding_count_lawyers( array(
		array(
			'key'   => 'payment_followup_status',
			'value' => 'invoice_sent',
		),
	) );
	$payment_confirmed_count = justice_theme_lawyer_onboarding_count_lawyers( $payment_confirmed_meta_query );
	$manual_invoice_count    = justice_theme_lawyer_onboarding_count_lawyers( array(
		array(
			'key'   => 'payment_path',
			'value' => 'manual_invoice',
		),
	) );
	$profile_ready_count     = justice_theme_lawyer_onboarding_count_lawyers( array(
		array(
			'key'   => 'activation_status',
			'value' => 'profile_ready',
		),
	) );
	$first_value_count       = justice_theme_lawyer_onboarding_count_lawyers( array(
		array(
			'key'   => 'activation_status',
			'value' => 'first_value',
		),
	) );
	$payment_overdue_count  = justice_theme_lawyer_onboarding_payment_due_count( 'overdue' );
	$payment_due_soon_count = justice_theme_lawyer_onboarding_payment_due_count( 'due_soon' );
	$billing_missing_count  = justice_theme_lawyer_onboarding_count_lawyers( justice_theme_lawyer_onboarding_billing_meta_query( 'missing' ) );
	$billing_ready_count    = justice_theme_lawyer_onboarding_count_lawyers( justice_theme_lawyer_onboarding_billing_meta_query( 'ready' ) );
	$payment_link_needed_count = justice_theme_lawyer_onboarding_count_lawyers( justice_theme_lawyer_onboarding_payment_link_meta_query( 'needed' ) );
	$payment_link_ready_count  = justice_theme_lawyer_onboarding_count_lawyers( justice_theme_lawyer_onboarding_payment_link_meta_query( 'ready' ) );
	$service_request_count     = justice_theme_lawyer_onboarding_count_lawyers( justice_theme_lawyer_onboarding_service_request_meta_query() );
	$public_card_claim_count   = justice_theme_lawyer_onboarding_count_lawyers( array( justice_theme_lawyer_claim_queue_meta_query() ) );
	$invoice_requested_value = justice_theme_lawyer_onboarding_monthly_value( array(
		array(
			'key'   => 'payment_followup_status',
			'value' => 'invoice_requested',
		),
	) );
	$invoice_sent_value      = justice_theme_lawyer_onboarding_monthly_value( array(
		array(
			'key'   => 'payment_followup_status',
			'value' => 'invoice_sent',
		),
	) );
	$payment_confirmed_value = justice_theme_lawyer_onboarding_monthly_value( $payment_confirmed_meta_query );
	$manual_invoice_value    = justice_theme_lawyer_onboarding_monthly_value( array(
		array(
			'key'   => 'payment_path',
			'value' => 'manual_invoice',
		),
	) );
	$payment_overdue_value   = justice_theme_lawyer_onboarding_payment_due_value( 'overdue' );
	$payment_due_soon_value  = justice_theme_lawyer_onboarding_payment_due_value( 'due_soon' );
	$billing_missing_value   = justice_theme_lawyer_onboarding_monthly_value( justice_theme_lawyer_onboarding_billing_meta_query( 'missing' ) );
	$billing_ready_value     = justice_theme_lawyer_onboarding_monthly_value( justice_theme_lawyer_onboarding_billing_meta_query( 'ready' ) );
	$payment_link_needed_value = justice_theme_lawyer_onboarding_monthly_value( justice_theme_lawyer_onboarding_payment_link_meta_query( 'needed' ) );
	$payment_link_ready_value  = justice_theme_lawyer_onboarding_monthly_value( justice_theme_lawyer_onboarding_payment_link_meta_query( 'ready' ) );
	$service_request_value     = justice_theme_lawyer_onboarding_monthly_value( justice_theme_lawyer_onboarding_service_request_meta_query() );
	$public_card_claim_value   = justice_theme_lawyer_onboarding_monthly_value( array( justice_theme_lawyer_claim_queue_meta_query() ) );
	$queue_url               = add_query_arg(
		array(
			'page'          => 'justice-lawyer-onboarding',
			'payment_queue' => 'invoice_requested',
		),
		admin_url( 'admin.php' )
	);
	$sent_url                = add_query_arg(
		array(
			'page'          => 'justice-lawyer-onboarding',
			'payment_queue' => 'invoice_sent',
		),
		admin_url( 'admin.php' )
	);
	$payment_overdue_url     = add_query_arg(
		array(
			'page'        => 'justice-lawyer-onboarding',
			'payment_due' => 'overdue',
		),
		admin_url( 'admin.php' )
	);
	$payment_due_soon_url    = add_query_arg(
		array(
			'page'        => 'justice-lawyer-onboarding',
			'payment_due' => 'due_soon',
		),
		admin_url( 'admin.php' )
	);
	$billing_missing_url     = add_query_arg(
		array(
			'page'           => 'justice-lawyer-onboarding',
			'billing_status' => 'missing',
		),
		admin_url( 'admin.php' )
	);
	$billing_ready_url       = add_query_arg(
		array(
			'page'           => 'justice-lawyer-onboarding',
			'billing_status' => 'ready',
		),
		admin_url( 'admin.php' )
	);
	$payment_link_needed_url = add_query_arg(
		array(
			'page'                => 'justice-lawyer-onboarding',
			'payment_link_status' => 'needed',
		),
		admin_url( 'admin.php' )
	);
	$payment_link_ready_url  = add_query_arg(
		array(
			'page'                => 'justice-lawyer-onboarding',
			'payment_link_status' => 'ready',
		),
		admin_url( 'admin.php' )
	);
	$service_request_url     = add_query_arg(
		array(
			'page'                   => 'justice-lawyer-onboarding',
			'service_request_status' => 'pending',
		),
		admin_url( 'admin.php' )
	);
	$public_card_claim_url   = add_query_arg(
		array(
			'page'        => 'justice-lawyer-onboarding',
			'claim_queue' => '1',
		),
		admin_url( 'admin.php' )
	);
	$all_url                 = admin_url( 'admin.php?page=justice-lawyer-onboarding' );
	$invoice_requested_export_url = justice_theme_lawyer_payment_queue_export_url( 'invoice_requested' );
	$invoice_sent_export_url      = justice_theme_lawyer_payment_queue_export_url( 'invoice_sent' );
	$manual_invoice_export_url    = justice_theme_lawyer_payment_queue_export_url( 'manual_invoice' );
	$payment_proof_title          = $payment_confirmed_count
		? 'Owner-confirmed paid lawyers exist'
		: 'No confirmed paid lawyer yet';
	$payment_proof_body           = $payment_confirmed_count
		? 'Investor-safe claim: payment has been marked confirmed by the owner. Open the paid rows before quoting revenue.'
		: 'Investor-safe claim: registration, billing capture, manual invoice handoff and follow-up are live; realized paid revenue is not proven yet.';
	$payment_proof_background     = $payment_confirmed_count ? '#f0fdf4' : '#fff5f5';
	$payment_proof_border         = $payment_confirmed_count ? '#bbf7d0' : '#fecaca';
	$payment_proof_color          = $payment_confirmed_count ? '#166534' : '#991b1b';
	$payment_bridge_body          = $payment_link_ready_count
		? 'Payment links exist on manual-invoice registrations; the next step is sending/chasing them and confirming real payment.'
		: 'No saved payment link is ready in the manual-invoice queue. Create the Grow/Morning link before asking the owner to pay.';
	$next_money_title        = 'No invoice-ready paid registration is waiting';
	$next_money_body         = 'The payment queue is clear. The next revenue move is focused lawyer outreach or improving the plan-to-registration path.';
	$next_money_url          = $all_url;
	$next_money_button       = 'Show all onboarding';
	$next_money_value        = 0;
	$next_money_value_note   = '';

	if ( $payment_overdue_count ) {
		$next_money_title  = 'Work overdue payment follow-ups';
		$next_money_body   = 'These paid prospects already have a payment follow-up due date behind them. Chase, block, cancel or confirm payment before adding new outreach.';
		$next_money_url    = $payment_overdue_url;
		$next_money_button = 'Open overdue payments';
		$next_money_value = $payment_overdue_value;
		$next_money_value_note = 'at risk';
	} elseif ( $service_request_count ) {
		$next_money_title  = 'Handle lawyer service requests';
		$next_money_body   = 'Lawyers have open billing, refund, downgrade, cancellation, complaint or support requests. Handle them before they turn into churn or payment disputes.';
		$next_money_url    = $service_request_url;
		$next_money_button = 'Open service requests';
		$next_money_value = $service_request_value;
		$next_money_value_note = 'retention risk';
	} elseif ( $public_card_claim_count ) {
		$next_money_title  = 'Review public card claims';
		$next_money_body   = 'These lawyers arrived from public cards and are asking to claim ownership. Verify identity, connect the right card, then move strong fits into featured or sponsored placement.';
		$next_money_url    = $public_card_claim_url;
		$next_money_button = 'Open claim queue';
		$next_money_value = $public_card_claim_value;
		$next_money_value_note = 'claim pipeline';
	} elseif ( $billing_missing_count ) {
		$next_money_title  = 'Collect missing invoice details';
		$next_money_body   = 'Some manual-invoice registrations are missing billing legal name or invoice email. Collect those before sending payment links or invoices.';
		$next_money_url    = $billing_missing_url;
		$next_money_button = 'Open missing billing';
		$next_money_value = $billing_missing_value;
		$next_money_value_note = 'needs billing details';
	} elseif ( $payment_link_needed_count ) {
		$next_money_title  = 'Create payment links';
		$next_money_body   = 'These manual-invoice registrations already have billing identity and invoice email, but no saved Grow/Morning payment link. Create the link, paste it into the lawyer record, then mark invoice sent.';
		$next_money_url    = $payment_link_needed_url;
		$next_money_button = 'Open link-needed queue';
		$next_money_value = $payment_link_needed_value;
		$next_money_value_note = 'ready for link';
	} elseif ( $invoice_requested_count ) {
		$next_money_title  = 'Send or chase manual invoices';
		$next_money_body   = 'Open the invoice queue, verify the lawyer and plan, send Morning/Grow/manual payment instructions, then activate only after payment confirmation.';
		$next_money_url    = $queue_url;
		$next_money_button = 'Open invoice queue';
		$next_money_value = $invoice_requested_value;
		$next_money_value_note = 'potential';
	} elseif ( $invoice_sent_count ) {
		$next_money_title  = 'Chase sent invoices';
		$next_money_body   = 'These lawyers already received payment instructions. Follow up, confirm payment, then move them toward profile activation and first value.';
		$next_money_url    = $sent_url;
		$next_money_button = 'Open sent invoices';
		$next_money_value = $invoice_sent_value;
		$next_money_value_note = 'pending';
	}
	?>
	<div style="max-width:1200px;background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:18px 20px;margin:18px 0;">
		<h2 style="margin-top:0;">Paid registration command center</h2>
		<p style="margin-top:0;">Use this panel as the daily payment handoff while automatic recurring checkout is still pending. Every paid registration that cannot go through checkout should become a license review, invoice follow-up and activation decision.</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:16px 0;">
			<div style="border:1px solid <?php echo esc_attr( $payment_proof_border ); ?>;background:<?php echo esc_attr( $payment_proof_background ); ?>;border-radius:8px;padding:14px;">
				<strong style="display:block;color:<?php echo esc_attr( $payment_proof_color ); ?>;font-size:15px;"><?php echo esc_html( $payment_proof_title ); ?></strong>
				<p style="margin:8px 0 0;color:<?php echo esc_attr( $payment_proof_color ); ?>;"><?php echo esc_html( $payment_proof_body ); ?></p>
				<p style="margin:10px 0 0;"><strong><?php echo esc_html( number_format_i18n( $payment_confirmed_count ) ); ?></strong> paid profiles / <strong><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $payment_confirmed_value ) ); ?></strong> confirmed monthly plan value</p>
			</div>
			<div style="border:1px solid #d6e4ff;background:#f7faff;border-radius:8px;padding:14px;">
				<strong style="display:block;color:#16427a;font-size:15px;">Manual payment bridge</strong>
				<p style="margin:8px 0 0;color:#16427a;"><?php echo esc_html( $payment_bridge_body ); ?></p>
				<p style="margin:10px 0 0;"><strong><?php echo esc_html( number_format_i18n( $manual_invoice_count ) ); ?></strong> manual-invoice profiles / <strong><?php echo esc_html( number_format_i18n( $payment_link_ready_count ) ); ?></strong> saved payment links</p>
			</div>
			<div style="border:1px solid #f5d58c;background:#fffaf0;border-radius:8px;padding:14px;">
				<strong style="display:block;color:#92400e;font-size:15px;">Provider claim boundary</strong>
				<p style="margin:8px 0 0;color:#7c2d12;">Use this page for real manual payment-link follow-up. Do not claim automatic recurring billing, refunds or invoice automation until Grow/Morning/Woo integration passes a controlled paid smoke test.</p>
				<p style="margin:10px 0 0;"><a href="<?php echo esc_url( $payment_link_needed_url ); ?>">Open link-needed queue</a></p>
			</div>
		</div>
		<div data-admin-surface="owner_payment_test_drill" style="border:1px solid #c7d2fe;background:#f8faff;border-radius:8px;padding:16px;margin:16px 0;">
			<p style="margin:0 0 6px;color:#3730a3;font-weight:700;text-transform:uppercase;">Owner payment test drill</p>
			<h3 style="margin:0 0 8px;font-size:20px;">One real paid-lawyer run, without false revenue claims</h3>
			<p style="margin:0 0 12px;max-width:900px;">Use this when the owner is ready to run a controlled paid test. No payment proof, no paid status: <code>manual_payment_evidence_url</code> is required before the record counts as paid.</p>
			<ol style="margin:0 0 12px 20px;max-width:980px;">
				<li>Select one real lawyer or owner-approved test lawyer from the manual-invoice path.</li>
				<li>Confirm legal billing name, business ID, invoice email, plan, and commercial approval.</li>
				<li>Create the Grow, Morning, Meshulam, or manual payment link outside WordPress while provider checkout is blocked.</li>
				<li>Paste the payment link and invoice reference, then mark invoice sent.</li>
				<li>After real payment is visible, save a private receipt, payment-provider record, bank proof, or invoice URL in <code>manual_payment_evidence_url</code>.</li>
				<li>Only after proof exists, mark paid, activate profile work, and route the first value or lead handoff.</li>
			</ol>
			<p style="margin:0;">
				<a class="button button-primary" href="<?php echo esc_url( $payment_link_needed_url ); ?>">Open link-needed queue</a>
				<a class="button" href="<?php echo esc_url( $sent_url ); ?>">Open payment-proof-required queue</a>
				<a class="button" href="<?php echo esc_url( $invoice_sent_export_url ); ?>">Export sent invoices CSV</a>
			</p>
			<small style="display:block;margin-top:10px;color:#4b5563;">This drill is admin guidance only. It does not charge, create an invoice, send WhatsApp, send email, or change payment-provider settings.</small>
		</div>
		<div style="border:1px solid #f5d58c;background:#fffaf0;border-radius:8px;padding:16px;margin:16px 0;">
			<p style="margin:0 0 6px;color:#92400e;font-weight:700;text-transform:uppercase;letter-spacing:.02em;">Next money action</p>
			<h3 style="margin:0 0 6px;font-size:20px;"><?php echo esc_html( $next_money_title ); ?></h3>
			<p style="margin:0 0 12px;max-width:820px;"><?php echo esc_html( $next_money_body ); ?></p>
			<?php if ( $next_money_value ) : ?>
				<p style="margin:0 0 12px;color:#7c2d12;"><strong>Queue value:</strong> <?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $next_money_value ) ); ?> <?php echo esc_html( $next_money_value_note ); ?></p>
			<?php endif; ?>
			<p style="margin:0;">
				<a class="button button-primary" href="<?php echo esc_url( $next_money_url ); ?>"><?php echo esc_html( $next_money_button ); ?></a>
				<a class="button" href="<?php echo esc_url( $all_url ); ?>">Show all onboarding</a>
				<a class="button" href="<?php echo esc_url( $invoice_requested_export_url ); ?>">Export invoice queue CSV</a>
				<a class="button" href="<?php echo esc_url( $invoice_sent_export_url ); ?>">Export sent invoices CSV</a>
				<a class="button" href="<?php echo esc_url( $manual_invoice_export_url ); ?>">Export all manual invoice CSV</a>
			</p>
		</div>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0;">
			<div style="border:1px solid #f5d58c;background:#fffaf0;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $invoice_requested_count ) ); ?></strong>
				<span>Invoice requested</span>
				<small style="display:block;margin-top:6px;color:#92400e;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $invoice_requested_value ) ); ?> potential</small>
			</div>
			<div style="border:1px solid #f4b4b4;background:#fff5f5;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $payment_overdue_count ) ); ?></strong>
				<span>Payment overdue</span>
				<small style="display:block;margin-top:6px;color:#991b1b;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $payment_overdue_value ) ); ?> at risk</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $payment_overdue_url ); ?>">Open overdue</a></p>
			</div>
			<div style="border:1px solid #f4b4b4;background:#fff5f5;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $service_request_count ) ); ?></strong>
				<span>Service requests</span>
				<small style="display:block;margin-top:6px;color:#991b1b;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $service_request_value ) ); ?> retention risk</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $service_request_url ); ?>">Open service requests</a></p>
			</div>
			<div style="border:1px solid #f0c36d;background:#fff8e5;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $public_card_claim_count ) ); ?></strong>
				<span>Public card claims</span>
				<small style="display:block;margin-top:6px;color:#7c4a03;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $public_card_claim_value ) ); ?> claim pipeline</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $public_card_claim_url ); ?>">Open claim queue</a></p>
			</div>
			<div style="border:1px solid #f5d58c;background:#fffaf0;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $payment_due_soon_count ) ); ?></strong>
				<span>Due within 48h</span>
				<small style="display:block;margin-top:6px;color:#92400e;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $payment_due_soon_value ) ); ?> scheduled</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $payment_due_soon_url ); ?>">Open due soon</a></p>
			</div>
			<div style="border:1px solid #ffd0b5;background:#fff8f3;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $billing_missing_count ) ); ?></strong>
				<span>Needs billing details</span>
				<small style="display:block;margin-top:6px;color:#9a3412;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $billing_missing_value ) ); ?> blocked from invoice</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $billing_missing_url ); ?>">Open missing billing</a></p>
			</div>
			<div style="border:1px solid #d4e8d4;background:#f7fff7;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $billing_ready_count ) ); ?></strong>
				<span>Billing ready</span>
				<small style="display:block;margin-top:6px;color:#166534;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $billing_ready_value ) ); ?> invoice-ready</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $billing_ready_url ); ?>">Open billing ready</a></p>
			</div>
			<div style="border:1px solid #f5d58c;background:#fffaf0;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $payment_link_needed_count ) ); ?></strong>
				<span>Needs payment link</span>
				<small style="display:block;margin-top:6px;color:#92400e;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $payment_link_needed_value ) ); ?> ready for link</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $payment_link_needed_url ); ?>">Open link-needed</a></p>
			</div>
			<div style="border:1px solid #d4e8d4;background:#f7fff7;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $payment_link_ready_count ) ); ?></strong>
				<span>Payment link ready</span>
				<small style="display:block;margin-top:6px;color:#166534;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $payment_link_ready_value ) ); ?> link attached</small>
				<p style="margin:8px 0 0;"><a href="<?php echo esc_url( $payment_link_ready_url ); ?>">Open link ready</a></p>
			</div>
			<div style="border:1px solid #d6e4ff;background:#f7faff;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $invoice_sent_count ) ); ?></strong>
				<span>Invoice sent</span>
				<small style="display:block;margin-top:6px;color:#16427a;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $invoice_sent_value ) ); ?> pending</small>
			</div>
			<div style="border:1px solid #d4e8d4;background:#f7fff7;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $payment_confirmed_count ) ); ?></strong>
				<span>Payment confirmed</span>
				<small style="display:block;margin-top:6px;color:#166534;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $payment_confirmed_value ) ); ?> confirmed</small>
			</div>
			<div style="border:1px solid #e0d2ff;background:#fbf8ff;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $manual_invoice_count ) ); ?></strong>
				<span>Manual invoice path</span>
				<small style="display:block;margin-top:6px;color:#3730a3;"><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $manual_invoice_value ) ); ?> total path</small>
			</div>
			<div style="border:1px solid #d6e4ff;background:#f7faff;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $profile_ready_count ) ); ?></strong>
				<span>Profile ready</span>
			</div>
			<div style="border:1px solid #d4e8d4;background:#f7fff7;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:26px;line-height:1;"><?php echo esc_html( number_format_i18n( $first_value_count ) ); ?></strong>
				<span>First value reached</span>
			</div>
		</div>
	</div>
	<?php
}

function justice_theme_render_lawyer_onboarding_investor_demo_panel(): void {
	$btl_readiness = function_exists( 'justice_theme_crm_btl_readiness_snapshot' ) ? justice_theme_crm_btl_readiness_snapshot() : array();
	$demo_links = array(
		array(
			'label' => 'Homepage lawyer entrypoints',
			'url'   => home_url( '/' ),
			'note'  => 'Show visitor path plus lawyer plans, registration and private-area entry.',
		),
		array(
			'label' => 'Lawyer plans',
			'url'   => home_url( '/lawyer-plans/' ),
			'note'  => 'Choose Lead Partner and explain manual payment bridge until recurring approval.',
		),
		array(
			'label' => 'Paid registration prefill',
			'url'   => add_query_arg(
				array(
					'plan_interest' => 'lead_partner',
					'payment_path'  => 'manual_invoice',
				),
				home_url( '/lawyer-registration/' )
			),
			'note'  => 'Show lawyer intake, billing details and media/profile material.',
		),
		array(
			'label' => 'Public card claim queue',
			'url'   => add_query_arg(
				array(
					'page'        => 'justice-lawyer-onboarding',
					'claim_queue' => '1',
				),
				admin_url( 'admin.php' )
			),
			'note'  => 'Show claimed public cards and the identity-review step before upgrade or sponsored placement.',
		),
		array(
			'label' => 'Lawyer dashboard gate',
			'url'   => home_url( '/lawyer-dashboard/' ),
			'note'  => 'Show private-area promise when logged out; use claimed profile when available.',
		),
		array(
			'label' => 'Justice CRM',
			'url'   => admin_url( 'admin.php?page=justice-crm' ),
			'note'  => 'Show lead quality, SLA, lawyer report and prospect creation.',
		),
		array(
			'label' => 'Service requests',
			'url'   => add_query_arg(
				array(
					'page'                   => 'justice-lawyer-onboarding',
					'service_request_status' => 'pending',
				),
				admin_url( 'admin.php' )
			),
			'note'  => 'Show refund, cancellation, downgrade, complaint and invoice-copy tickets.',
		),
	);
	$payment_playbook = array(
		'Create a fixed-amount Morning payment link: Payments > Payment links > plus button > regular transaction. Use the exact monthly plan amount, not an open-amount link, for the investor payment test.',
		'Copy the provider link into the lawyer profile field named Manual payment link, save, then use the Send this payment link by email now checkbox from the same lawyer record.',
		'If recurring billing is asked about, open the Morning standing-order/debit-order flow as the next approval path, but keep the demo claim limited to the real manual payment link until provider approval is complete.',
		'After payment, record the invoice/reference and payment confirmed date on the lawyer profile before saying the account is activated.',
	);
	$provider_paths   = array(
		array(
			'label'  => 'One-time payment link',
			'status' => 'Demo-ready when a real Morning/Grow link is pasted on the lawyer profile.',
			'action' => 'Use the manual payment link field, send by email, then mark invoice sent or payment confirmed only after proof.',
		),
		array(
			'label'  => 'Recurring / standing order',
			'status' => 'Provider-gated. Grow asked whether the request is for standing orders through Morning.',
			'action' => 'Reply yes, confirm it is for recurring lawyer subscriptions, and ask them to enable the standing-order/direct-debit capability for account 10182706.',
		),
		array(
			'label'  => 'WooCommerce checkout',
			'status' => 'Optional next route after provider/plugin decision.',
			'action' => 'Use only after the owner decides to buy/install the Morning/Grow WooCommerce plugin and complete a paid smoke test.',
		),
		array(
			'label'  => 'Morning API payment form',
			'status' => 'Future integration route, not tonight\'s no-API demo bridge.',
			'action' => 'Use only with sandbox/production API credentials, server-side implementation and a controlled transaction test.',
		),
	);
	$grow_reply_template = implode(
		"\n",
		array(
			'שלום הילה,',
			'כן, הכוונה היא להוראות קבע / חיובים חוזרים דרך מערכת Morning/Grow עבור מנויי עורכי דין באתר Jus-Tice.',
			'אנחנו צריכים לאפשר לחשבון Grow 10182706 להקים הוראות קבע או חיובים חוזרים ללקוחות, בנוסף ללינקי תשלום חד-פעמיים שכבר עובדים.',
			'מספר עוסק: 027488360.',
			'שם האתר: Jus-Tice Israel - https://jus-tice.co.il',
			'אנא עדכנו מה צריך להפעיל בחשבון כדי לאפשר הוראות קבע/חיוב חוזר, והאם נדרש תוסף WooCommerce, טופס סליקה/API, או הגדרת הרשאה מצד Grow/Morning.',
			'תודה,',
			'Jus-Tice Israel',
		)
	);
	$demo_data_steps = array(
		'Create or use one controlled lawyer user email, then make sure one justice_lawyer profile has claimed_by_user_id set to that user ID.',
		'Use a medical-malpractice profile because the investor scenario is a medical-malpractice lawyer buying leads.',
		'Create or choose one safe justice_lead record, set assigned_lawyer_id to the demo lawyer profile ID, and keep visitor phone/email as owner-approved test details.',
		'Log in as the demo lawyer, open the dashboard, update lead stage, add a follow-up note, and submit one refund or complaint service request.',
	);
	?>
	<div style="max-width:1200px;background:#0f172a;color:#fff;border-radius:8px;padding:18px 20px;margin:18px 0;">
		<p style="margin:0 0 6px;color:#facc15;font-weight:800;text-transform:uppercase;letter-spacing:.04em;">Investor demo control</p>
		<h2 style="margin:0 0 8px;color:#fff;">Morning rehearsal links and honest blocker script</h2>
		<p style="margin:0 0 14px;max-width:920px;color:#dbeafe;">Use this admin-only panel to run the demo in order: public acquisition, plan choice, registration, manual payment handoff, private dashboard, lead CRM reporting and service requests. Do not claim recurring billing, automatic invoices or refunds are live until Grow/Meshulam approval and a controlled transaction pass.</p>
		<div style="border:1px solid rgba(248,113,113,.45);background:#450a0a;border-radius:8px;padding:12px;margin:0 0 14px;">
			<strong style="display:block;color:#fecaca;">First action before opening investor tabs</strong>
			<p style="margin:6px 0 0;color:#fee2e2;">Pull Git in uPress for `wp-content/themes/justice-theme`, clear cache if needed, then rerun the live readiness checks. If this step is skipped, the public homepage, plans, dashboard gate and deployment marker may still show the older production version.</p>
		</div>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:14px 0;">
			<?php foreach ( $demo_links as $link ) : ?>
				<div style="background:#172554;border:1px solid rgba(255,255,255,.16);border-radius:8px;padding:12px;">
					<strong style="display:block;color:#fff;margin-bottom:6px;"><?php echo esc_html( $link['label'] ); ?></strong>
					<p style="margin:0 0 10px;color:#bfdbfe;"><?php echo esc_html( $link['note'] ); ?></p>
					<a class="button button-primary" href="<?php echo esc_url( $link['url'] ); ?>" target="_blank" rel="noopener">Open</a>
				</div>
			<?php endforeach; ?>
		</div>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px;margin:14px 0;">
			<div style="background:#0f3b35;border:1px solid rgba(45,212,191,.45);border-radius:8px;padding:12px;">
				<strong style="display:block;color:#99f6e4;">Real payment-link playbook</strong>
				<ol style="margin:8px 0 0 18px;color:#d1fae5;">
					<?php foreach ( $payment_playbook as $step ) : ?>
						<li style="margin:0 0 6px;"><?php echo esc_html( $step ); ?></li>
					<?php endforeach; ?>
				</ol>
				<p style="margin:10px 0 0;color:#ccfbf1;"><a style="color:#ccfbf1;" href="https://www.greeninvoice.co.il/help-center/create-payment-link/" target="_blank" rel="noopener noreferrer">Morning guide: create a payment link</a></p>
			</div>
			<div style="background:#1e293b;border:1px solid rgba(148,163,184,.5);border-radius:8px;padding:12px;">
				<strong style="display:block;color:#e2e8f0;">Grow/Morning provider status</strong>
				<div style="display:grid;gap:8px;margin-top:8px;color:#e5e7eb;">
					<?php foreach ( $provider_paths as $path ) : ?>
						<div style="border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:9px;background:rgba(15,23,42,.6);">
							<strong style="display:block;color:#fff;"><?php echo esc_html( $path['label'] ); ?></strong>
							<span style="display:block;color:#cbd5e1;"><?php echo esc_html( $path['status'] ); ?></span>
							<small style="display:block;margin-top:4px;color:#93c5fd;"><?php echo esc_html( $path['action'] ); ?></small>
						</div>
					<?php endforeach; ?>
				</div>
				<details style="margin-top:10px;">
					<summary style="cursor:pointer;color:#bfdbfe;font-weight:700;">Copy reply to Grow support</summary>
					<textarea readonly rows="9" style="width:100%;margin-top:8px;direction:rtl;text-align:right;"><?php echo esc_textarea( $grow_reply_template ); ?></textarea>
				</details>
			</div>
			<div style="background:#312e81;border:1px solid rgba(165,180,252,.45);border-radius:8px;padding:12px;">
				<strong style="display:block;color:#c7d2fe;">Demo data checklist</strong>
				<ol style="margin:8px 0 0 18px;color:#e0e7ff;">
					<?php foreach ( $demo_data_steps as $step ) : ?>
						<li style="margin:0 0 6px;"><?php echo esc_html( $step ); ?></li>
					<?php endforeach; ?>
				</ol>
			</div>
			<?php if ( $btl_readiness ) : ?>
				<div style="background:#29170f;border:1px solid rgba(251,146,60,.45);border-radius:8px;padding:12px;">
					<strong style="display:block;color:#fed7aa;">Fast revenue proof: Bituach Leumi</strong>
					<p style="margin:6px 0 10px;color:#ffedd5;"><strong><?php echo esc_html( $btl_readiness['status'] ?? 'Unknown' ); ?></strong> · <?php echo esc_html( (string) ( $btl_readiness['percent'] ?? 0 ) ); ?>% complete</p>
					<ul style="margin:8px 0 0 18px;color:#fed7aa;">
						<?php foreach ( array_slice( (array) ( $btl_readiness['checks'] ?? array() ), 0, 6 ) as $check ) : ?>
							<li style="margin:0 0 5px;">
								<?php echo ! empty( $check['met'] ) ? 'Ready: ' : 'Blocked: '; ?>
								<?php echo esc_html( (string) ( $check['label'] ?? '' ) ); ?>
								<small style="display:block;color:#fdba74;"><?php echo esc_html( (string) ( $check['detail'] ?? '' ) ); ?></small>
							</li>
						<?php endforeach; ?>
					</ul>
					<p style="margin:10px 0 0;color:#ffedd5;">Demo claim: show this as a controlled revenue experiment, not as a proven recurring revenue line until the gate says revenue loop proven.</p>
				</div>
			<?php endif; ?>
		</div>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:14px;">
			<div style="background:#111827;border:1px solid rgba(250,204,21,.35);border-radius:8px;padding:12px;">
				<strong style="display:block;color:#facc15;">Say this if payments come up</strong>
				<p style="margin:6px 0 0;color:#e5e7eb;">Manual Grow/Morning payment links are the live bridge. Automatic recurring subscriptions, branded invoice automation and refunds stay approval-gated until provider approval and smoke test.</p>
			</div>
			<div style="background:#111827;border:1px solid rgba(96,165,250,.35);border-radius:8px;padding:12px;">
				<strong style="display:block;color:#93c5fd;">Demo data still needed</strong>
				<p style="margin:6px 0 0;color:#e5e7eb;">One claimed lawyer profile and one assigned medical-malpractice lead are required for the full private dashboard and CRM walkthrough.</p>
			</div>
			<div style="background:#111827;border:1px solid rgba(52,211,153,.35);border-radius:8px;padding:12px;">
				<strong style="display:block;color:#86efac;">Deployment marker</strong>
				<p style="margin:6px 0 0;color:#e5e7eb;"><?php echo esc_html( defined( 'JUSTICE_DEPLOY_MARKER' ) ? JUSTICE_DEPLOY_MARKER : 'marker unavailable' ); ?></p>
			</div>
		</div>
	</div>
	<?php
}

function justice_theme_render_lawyer_onboarding_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		?>
		<div class="wrap">
			<h1>Lawyer Onboarding</h1>
			<p><strong>BLOCKED:</strong> `justice_lawyer` post type is not active. Verify the Justice plugin.</p>
		</div>
		<?php
		return;
	}

	$registration_review_meta_query = array(
		'relation' => 'OR',
		array(
			'key'   => 'source_type',
			'value' => 'registration',
		),
		array(
			'key'   => 'pending_profile_review',
			'value' => '1',
		),
		array(
			'key'   => 'pending_content_review',
			'value' => '1',
		),
		array(
			'key'   => 'pending_review_campaign_request',
			'value' => '1',
		),
		array(
			'key'   => 'pending_upload_review',
			'value' => '1',
		),
		array(
			'key'   => 'pending_ai_profile_draft_review',
			'value' => '1',
		),
	);
	$payment_queue = isset( $_GET['payment_queue'] ) ? sanitize_key( wp_unslash( $_GET['payment_queue'] ) ) : '';
	$payment_due   = isset( $_GET['payment_due'] ) ? sanitize_key( wp_unslash( $_GET['payment_due'] ) ) : '';
	$billing_status = isset( $_GET['billing_status'] ) ? sanitize_key( wp_unslash( $_GET['billing_status'] ) ) : '';
	$payment_link_status = isset( $_GET['payment_link_status'] ) ? sanitize_key( wp_unslash( $_GET['payment_link_status'] ) ) : '';
	$service_request_status = isset( $_GET['service_request_status'] ) ? sanitize_key( wp_unslash( $_GET['service_request_status'] ) ) : '';
	$claim_queue  = isset( $_GET['claim_queue'] ) ? sanitize_key( wp_unslash( $_GET['claim_queue'] ) ) : '';
	$source_key    = isset( $_GET['source_key'] ) ? sanitize_key( wp_unslash( $_GET['source_key'] ) ) : '';
	$source_value  = isset( $_GET['source_value'] ) ? sanitize_text_field( wp_unslash( $_GET['source_value'] ) ) : '';
	$source_filter_keys = justice_theme_lawyer_onboarding_source_filter_keys();
	$meta_query    = $registration_review_meta_query;

	if ( ! in_array( $payment_due, array( 'overdue', 'due_soon' ), true ) ) {
		$payment_due = '';
	}

	if ( ! in_array( $billing_status, array( 'missing', 'ready' ), true ) ) {
		$billing_status = '';
	}

	if ( ! in_array( $payment_link_status, array( 'needed', 'ready' ), true ) ) {
		$payment_link_status = '';
	}

	if ( 'pending' !== $service_request_status ) {
		$service_request_status = '';
	}

	if ( '1' !== $claim_queue ) {
		$claim_queue = '';
	}

	if ( ! array_key_exists( $source_key, $source_filter_keys ) || '' === $source_value ) {
		$source_key   = '';
		$source_value = '';
	}

	if ( in_array( $payment_due, array( 'overdue', 'due_soon' ), true ) ) {
		$now       = current_time( 'mysql' );
		$soon      = wp_date( 'Y-m-d H:i:s', current_time( 'timestamp' ) + 2 * DAY_IN_SECONDS );
		$due_query = array(
			'key'     => 'payment_followup_due_at',
			'value'   => $now,
			'compare' => '<=',
			'type'    => 'DATETIME',
		);

		if ( 'due_soon' === $payment_due ) {
			$due_query = array(
				'key'     => 'payment_followup_due_at',
				'value'   => array( $now, $soon ),
				'compare' => 'BETWEEN',
				'type'    => 'DATETIME',
			);
		}

		$meta_query = array(
			'relation' => 'AND',
			$registration_review_meta_query,
			array(
				'key'     => 'payment_followup_status',
				'value'   => array( 'invoice_requested', 'invoice_sent' ),
				'compare' => 'IN',
			),
			$due_query,
		);
	} elseif ( in_array( $payment_queue, array( 'invoice_requested', 'invoice_sent', 'payment_confirmed', 'payment_blocked', 'payment_cancelled' ), true ) ) {
		$meta_query = array(
			'relation' => 'AND',
			$registration_review_meta_query,
			array(
				'key'   => 'payment_followup_status',
				'value' => $payment_queue,
			),
		);
	}

	if ( $billing_status ) {
		$meta_query = array(
			'relation' => 'AND',
			$meta_query,
			justice_theme_lawyer_onboarding_billing_meta_query( $billing_status ),
		);
	}

	if ( $payment_link_status ) {
		$meta_query = array(
			'relation' => 'AND',
			$meta_query,
			justice_theme_lawyer_onboarding_payment_link_meta_query( $payment_link_status ),
		);
	}

	if ( $service_request_status ) {
		$meta_query = array(
			'relation' => 'AND',
			$meta_query,
			justice_theme_lawyer_onboarding_service_request_meta_query(),
		);
	}

	if ( $claim_queue ) {
		$meta_query = array(
			'relation' => 'AND',
			$meta_query,
			justice_theme_lawyer_claim_queue_meta_query(),
		);
	}

	if ( $source_key && $source_value ) {
		$meta_query = array(
			'relation' => 'AND',
			$meta_query,
			array(
				'key'   => $source_key,
				'value' => $source_value,
			),
		);
	}

	$pending = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 50,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => $meta_query,
	) );
	?>
	<div class="wrap">
		<h1>Lawyer Onboarding</h1>
		<p>Pending lawyer self-registration submissions and staged profile update requests. Review identity, license, claims, practice areas, public content and commercial plan before publishing or applying updates.</p>
		<?php if ( isset( $_GET['profile_update'] ) && 'applied' === $_GET['profile_update'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Pending mini-site update applied. Review the full profile before final public approval.</p></div>
		<?php elseif ( isset( $_GET['profile_update'] ) && 'discarded' === $_GET['profile_update'] ) : ?>
			<div class="notice notice-warning is-dismissible"><p>Pending mini-site update discarded. Public profile fields were not changed.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['content_review'] ) && 'marked' === $_GET['content_review'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Content request review flag cleared for the lawyer profile.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['review_campaign'] ) && 'marked' === $_GET['review_campaign'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Review campaign request flag cleared for the lawyer profile.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['asset_review'] ) && 'marked' === $_GET['asset_review'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Registration upload review flag cleared for the lawyer profile.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['ai_draft_review'] ) && 'marked' === $_GET['ai_draft_review'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>AI-assistant profile draft review flag cleared for the lawyer profile.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['payment_followup'] ) && 'updated' === $_GET['payment_followup'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Payment follow-up status updated. Continue the next money action from this filtered queue.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['service_request_followup'] ) && 'updated' === $_GET['service_request_followup'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Service request status updated. Continue owner review, billing/refund handling or customer-success follow-up from this queue.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['recommendation_token'] ) && 'created' === $_GET['recommendation_token'] && function_exists( 'justice_theme_admin_latest_recommendation_token_link' ) ) : ?>
			<?php $recommendation_token_link = justice_theme_admin_latest_recommendation_token_link(); ?>
			<div class="notice notice-success is-dismissible">
				<p><strong>First-party recommendation link created.</strong> Send this only to a real client after lawyer/owner approval. It creates a draft recommendation for review, not a public review.</p>
				<?php if ( $recommendation_token_link ) : ?>
					<p><input type="url" class="large-text code" readonly onclick="this.select()" value="<?php echo esc_attr( $recommendation_token_link ); ?>"></p>
				<?php endif; ?>
			</div>
		<?php elseif ( isset( $_GET['recommendation_token'] ) && 'failed' === $_GET['recommendation_token'] ) : ?>
			<div class="notice notice-error is-dismissible"><p>Recommendation link creation failed. Check permissions and try again.</p></div>
		<?php endif; ?>

		<?php justice_theme_render_lawyer_onboarding_investor_demo_panel(); ?>
		<?php justice_theme_render_lawyer_onboarding_payment_command_center(); ?>
		<?php justice_theme_render_lawyer_onboarding_source_performance(); ?>
		<?php justice_theme_render_lawyer_onboarding_sales_command_center(); ?>

		<?php if ( $payment_queue ) : ?>
			<div class="notice notice-info inline"><p>Showing only lawyer registrations with payment status: <?php echo esc_html( justice_theme_lawyer_payment_followup_options()[ $payment_queue ] ?? $payment_queue ); ?>. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>
		<?php if ( $payment_due ) : ?>
			<div class="notice notice-info inline"><p>Showing only lawyer registrations with payment follow-up due filter: <?php echo esc_html( 'overdue' === $payment_due ? 'overdue' : 'due within 48 hours' ); ?>. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>
		<?php if ( $billing_status ) : ?>
			<div class="notice notice-info inline"><p>Showing only manual-invoice lawyer registrations with billing status: <?php echo esc_html( 'ready' === $billing_status ? 'billing ready' : 'missing billing details' ); ?>. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>
		<?php if ( $payment_link_status ) : ?>
			<div class="notice notice-info inline"><p>Showing only manual-invoice lawyer registrations with payment-link status: <?php echo esc_html( 'ready' === $payment_link_status ? 'payment link ready' : 'needs payment link' ); ?>. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['payment_link_email'] ) ) : ?>
			<?php $payment_link_email_result = sanitize_key( wp_unslash( $_GET['payment_link_email'] ) ); ?>
			<div class="notice <?php echo 'sent' === $payment_link_email_result ? 'notice-success' : 'notice-error'; ?> is-dismissible"><p>Payment-link email result: <?php echo esc_html( str_replace( '_', ' ', $payment_link_email_result ) ); ?>.</p></div>
		<?php endif; ?>
		<?php if ( $service_request_status ) : ?>
			<div class="notice notice-info inline"><p>Showing only lawyer registrations with open service, billing, refund, cancellation, downgrade, complaint or support requests. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>
		<?php if ( $claim_queue ) : ?>
			<div class="notice notice-info inline"><p>Showing only lawyer registrations that came from a public-card claim/upgrade path. Verify identity before changing the existing public card. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>
		<?php if ( $source_key && $source_value ) : ?>
			<div class="notice notice-info inline"><p>Showing only lawyer registrations from <?php echo esc_html( $source_filter_keys[ $source_key ] ); ?>: <?php echo esc_html( $source_value ); ?>. <a href="<?php echo esc_url( admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ); ?>">Clear filter</a>.</p></div>
		<?php endif; ?>

		<?php if ( $pending->have_posts() ) : ?>
			<table class="widefat striped">
				<thead>
					<tr>
						<th>Name</th>
						<th>Firm</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Plan</th>
						<th>Source</th>
						<th>Sales Priority</th>
						<th>Payment Follow-up</th>
						<th>Mini-site Content</th>
						<th>Assets / AI Draft</th>
						<th>Pending Update</th>
						<th>Content Request</th>
						<th>Reputation</th>
						<th>Recent Notes</th>
						<th>Status</th>
						<th>Submitted</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<?php while ( $pending->have_posts() ) : $pending->the_post(); ?>
						<?php
						$post_id = get_the_ID();
						$status  = get_post_meta( $post_id, 'profile_status', true ) ?: get_post_status( $post_id );
						$plan    = (string) get_post_meta( $post_id, 'plan_type', true );
						$expected_monthly_value = justice_theme_lawyer_outreach_expected_monthly_nis( $plan );
						$registration_attribution = justice_theme_lawyer_registration_attribution_for_post( $post_id );
						$attribution_summary      = justice_theme_lawyer_registration_attribution_summary( $registration_attribution );
						$claim_target             = justice_theme_lawyer_claim_target_from_attribution( $registration_attribution );
						$sales_priority = justice_theme_lawyer_onboarding_sales_priority( $plan );
						$activation_status = (string) get_post_meta( $post_id, 'activation_status', true ) ?: 'registered';
						$activation_badge  = justice_theme_lawyer_activation_badge( $activation_status );
						$payment_path      = (string) get_post_meta( $post_id, 'payment_path', true );
						$payment_followup  = (string) get_post_meta( $post_id, 'payment_followup_status', true );
						$payment_badge     = justice_theme_lawyer_payment_followup_badge( $payment_path, $payment_followup );
						$payment_due_at    = (string) get_post_meta( $post_id, 'payment_followup_due_at', true );
						$payment_due_badge = justice_theme_lawyer_payment_due_badge( $payment_due_at );
						$first_value_at     = get_post_meta( $post_id, 'first_value_at', true );
						$invoice_sent_at      = (string) get_post_meta( $post_id, 'invoice_sent_at', true );
						$manual_payment_link  = (string) get_post_meta( $post_id, 'manual_payment_link_url', true );
						$manual_payment_link_sent_at = (string) get_post_meta( $post_id, 'manual_payment_link_sent_at', true );
						$manual_payment_link_sent_to = (string) get_post_meta( $post_id, 'manual_payment_link_sent_to', true );
						$manual_payment_link_email_result = (string) get_post_meta( $post_id, 'manual_payment_link_email_last_result', true );
						$invoice_reference    = (string) get_post_meta( $post_id, 'manual_invoice_reference', true );
						$payment_evidence_url = (string) get_post_meta( $post_id, 'manual_payment_evidence_url', true );
						$payment_confirmed_at = (string) get_post_meta( $post_id, 'payment_confirmed_at', true );
						$payment_blocked_at   = (string) get_post_meta( $post_id, 'payment_blocked_at', true );
						$payment_cancelled_at = (string) get_post_meta( $post_id, 'payment_cancelled_at', true );
						$payment_quick_actions = justice_theme_lawyer_payment_followup_quick_actions( $payment_path, $payment_followup, '' !== trim( $payment_evidence_url ) );
						$payment_handoff_context = justice_theme_lawyer_manual_invoice_context( $post_id );
						$payment_handoff_message = justice_theme_lawyer_manual_invoice_message( $post_id );
						$payment_handoff_whatsapp_url = justice_theme_lawyer_payment_link_whatsapp_url( $post_id, $payment_handoff_message );
						$has_pending_update = '1' === (string) get_post_meta( $post_id, 'pending_profile_review', true );
						$has_pending_content = '1' === (string) get_post_meta( $post_id, 'pending_content_review', true );
						$has_pending_review_campaign = '1' === (string) get_post_meta( $post_id, 'pending_review_campaign_request', true );
						$has_pending_upload_review = '1' === (string) get_post_meta( $post_id, 'pending_upload_review', true );
						$has_pending_ai_draft = '1' === (string) get_post_meta( $post_id, 'pending_ai_profile_draft_review', true );
						$account_status = (string) get_post_meta( $post_id, 'account_continuation_status', true );
						$service_request_id = (string) get_post_meta( $post_id, 'latest_service_request_id', true );
						$service_request_type = (string) get_post_meta( $post_id, 'latest_service_request_type', true );
						$service_request_subject = (string) get_post_meta( $post_id, 'latest_service_request_subject', true );
						$service_request_status = (string) get_post_meta( $post_id, 'latest_service_request_status', true );
						$service_request_status_options = justice_theme_lawyer_service_request_status_options();
						$service_request_status_label = $service_request_status_options[ $service_request_status ?: 'open' ] ?? ( $service_request_status ?: 'open' );
						$service_request_quick_actions = $service_request_id ? justice_theme_lawyer_service_request_quick_actions( $service_request_status ) : array();
						$upload_notes = (string) get_post_meta( $post_id, 'registration_upload_notes', true );
						$ai_profile_draft = (string) get_post_meta( $post_id, 'profile_ai_draft_sections', true );
						$content_article_id = (int) get_post_meta( $post_id, 'latest_content_request_article_id', true );
						$content_topic      = (string) get_post_meta( $post_id, 'latest_content_request_topic', true );
						$review_client_group = (string) get_post_meta( $post_id, 'latest_review_campaign_client_group', true );
						$review_campaign_at  = (string) get_post_meta( $post_id, 'latest_review_campaign_requested_at', true );
						$review_business_url = (string) get_post_meta( $post_id, 'latest_review_campaign_google_business_url', true );
						if ( ! $review_business_url ) {
							$review_business_url = (string) get_post_meta( $post_id, 'google_business_profile_url', true );
						}
						$review_request_url = (string) get_post_meta( $post_id, 'latest_review_campaign_google_review_url', true );
						if ( ! $review_request_url ) {
							$review_request_url = (string) get_post_meta( $post_id, 'google_review_request_url', true );
						}
						$review_place_id = (string) get_post_meta( $post_id, 'latest_review_campaign_google_place_id', true );
						if ( ! $review_place_id ) {
							$review_place_id = (string) get_post_meta( $post_id, 'google_place_id', true );
						}
						$mini_fields = array(
							'Headline' => get_post_meta( $post_id, 'profile_headline', true ),
							'Bar'      => get_post_meta( $post_id, 'bar_number', true ),
							'Website'  => get_post_meta( $post_id, 'website', true ),
							'Services' => get_post_meta( $post_id, 'profile_services', true ),
							'Process'  => get_post_meta( $post_id, 'profile_process', true ),
							'Video'    => get_post_meta( $post_id, 'profile_video_url', true ),
							'FAQ'      => get_post_meta( $post_id, 'profile_faqs', true ),
						);
						$upload_fields = array(
							'Photo'   => (int) get_post_meta( $post_id, 'registration_photo_attachment_id', true ),
							'Logo'    => (int) get_post_meta( $post_id, 'registration_logo_attachment_id', true ),
							'Document' => (int) get_post_meta( $post_id, 'registration_document_attachment_id', true ),
							'Video'   => (int) get_post_meta( $post_id, 'registration_video_attachment_id', true ),
						);
						$pending_fields = array(
							'Headline' => get_post_meta( $post_id, 'pending_profile_headline', true ),
							'Bar'      => get_post_meta( $post_id, 'pending_profile_bar_number', true ),
							'Website'  => get_post_meta( $post_id, 'pending_profile_website', true ),
							'Services' => get_post_meta( $post_id, 'pending_profile_services', true ),
							'Process'  => get_post_meta( $post_id, 'pending_profile_process', true ),
							'Video'    => get_post_meta( $post_id, 'pending_profile_video_url', true ),
							'FAQ'      => get_post_meta( $post_id, 'pending_profile_faqs', true ),
						);
						$internal_notes = trim( (string) get_post_meta( $post_id, 'internal_notes', true ) );
						$recent_notes   = array_slice( array_filter( array_map( 'trim', explode( "\n", $internal_notes ) ) ), -3 );
						?>
						<tr>
							<td><strong><?php echo esc_html( get_the_title() ); ?></strong></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'firm_name', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'phone', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'email', true ) ?: '-' ); ?></td>
							<td>
								<strong><?php echo esc_html( justice_theme_lawyer_onboarding_plan_label( $plan ) ); ?></strong>
								<?php if ( $plan ) : ?>
									<br><small><?php echo esc_html( $plan ); ?></small>
								<?php endif; ?>
								<?php if ( $expected_monthly_value ) : ?>
									<br><small><?php echo esc_html( justice_theme_lawyer_onboarding_money_label( $expected_monthly_value ) ); ?></small>
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $attribution_summary ) : ?>
									<small><?php echo esc_html( $attribution_summary ); ?></small>
								<?php else : ?>
									-
								<?php endif; ?>
								<?php if ( ! empty( $registration_attribution['registration_landing_url'] ) ) : ?>
									<br><a href="<?php echo esc_url( $registration_attribution['registration_landing_url'] ); ?>" target="_blank" rel="noopener noreferrer">landing</a>
								<?php endif; ?>
								<?php if ( ! empty( $claim_target['id'] ) ) : ?>
									<div style="margin-top:8px;padding:8px;border-radius:6px;background:#fff8e5;border:1px solid #f0c36d;color:#7c4a03;">
										<strong>Claiming public card</strong><br>
										<small>#<?php echo esc_html( (string) $claim_target['id'] ); ?> - <?php echo esc_html( $claim_target['title'] ?: $claim_target['slug'] ); ?></small>
										<?php if ( $claim_target['public_url'] ) : ?>
											<br><a href="<?php echo esc_url( $claim_target['public_url'] ); ?>" target="_blank" rel="noopener noreferrer">public card</a>
										<?php endif; ?>
										<?php if ( $claim_target['edit_url'] ) : ?>
											<?php echo $claim_target['public_url'] ? ' | ' : '<br>'; ?><a href="<?php echo esc_url( $claim_target['edit_url'] ); ?>">edit card</a>
										<?php endif; ?>
									</div>
								<?php endif; ?>
							</td>
							<td>
								<span style="display:inline-block;margin:0 0 4px;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $sales_priority['style'] ); ?>">
									<?php echo esc_html( $sales_priority['label'] ); ?>
								</span>
								<p style="margin:0;"><?php echo esc_html( $sales_priority['note'] ); ?></p>
								<p style="margin:8px 0 0;">
									<span style="display:inline-block;margin:0 0 4px;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $activation_badge['style'] ); ?>">
										<?php echo esc_html( $activation_badge['label'] ); ?>
									</span>
									<?php if ( $first_value_at ) : ?>
										<br><small>First value: <?php echo esc_html( $first_value_at ); ?></small>
									<?php endif; ?>
								</p>
							</td>
							<td>
								<span style="display:inline-block;margin:0 0 4px;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $payment_badge['style'] ); ?>">
									<?php echo esc_html( $payment_badge['label'] ); ?>
								</span>
								<p style="margin:0;"><?php echo esc_html( $payment_badge['note'] ); ?></p>
								<?php if ( $payment_path || $payment_followup ) : ?>
									<small><?php echo esc_html( trim( $payment_path . ' / ' . $payment_followup, ' /' ) ); ?></small>
								<?php endif; ?>
								<?php if ( $manual_payment_link ) : ?>
									<br><a href="<?php echo esc_url( $manual_payment_link ); ?>" target="_blank" rel="noopener noreferrer">payment link</a>
									<br><a class="button button-small" style="margin-top:6px;" href="<?php echo esc_url( justice_theme_lawyer_manual_payment_link_email_url( $post_id ) ); ?>" onclick="return confirm('<?php echo esc_js( __( 'Send the saved payment link by email now?', 'justice-theme' ) ); ?>');"><?php echo $manual_payment_link_sent_at ? esc_html__( 'Resend payment link email', 'justice-theme' ) : esc_html__( 'Send payment link email', 'justice-theme' ); ?></a>
								<?php endif; ?>
								<?php if ( $manual_payment_link_sent_at || $manual_payment_link_email_result ) : ?>
									<br><small>Link email: <?php echo esc_html( $manual_payment_link_email_result ?: 'recorded' ); ?><?php echo $manual_payment_link_sent_at ? esc_html( ' at ' . $manual_payment_link_sent_at ) : ''; ?><?php echo $manual_payment_link_sent_to ? esc_html( ' to ' . $manual_payment_link_sent_to ) : ''; ?></small>
								<?php endif; ?>
								<?php if ( $invoice_reference ) : ?>
									<br><small>Ref: <?php echo esc_html( $invoice_reference ); ?></small>
								<?php endif; ?>
								<?php if ( $payment_evidence_url ) : ?>
									<br><a href="<?php echo esc_url( $payment_evidence_url ); ?>" target="_blank" rel="noopener noreferrer">Payment proof recorded</a>
								<?php elseif ( 'invoice_sent' === $payment_followup ) : ?>
									<br><small style="color:#991b1b;">Paid action blocked until a private payment evidence URL is saved.</small>
								<?php elseif ( 'payment_confirmed' === $payment_followup ) : ?>
									<br><small style="color:#991b1b;">Legacy paid status is not revenue proof until payment evidence URL is saved.</small>
								<?php endif; ?>
								<?php if ( $payment_due_at ) : ?>
									<br><span style="display:inline-block;margin:6px 0 0;padding:2px 7px;border-radius:999px;font-size:12px;<?php echo esc_attr( $payment_due_badge['style'] ); ?>"><?php echo esc_html( $payment_due_badge['label'] ); ?></span>
								<?php endif; ?>
								<?php if ( $invoice_sent_at || $payment_confirmed_at || $payment_blocked_at || $payment_cancelled_at ) : ?>
									<ul style="margin:6px 0 0;padding-left:16px;color:#475569;font-size:12px;">
										<?php if ( $invoice_sent_at ) : ?><li>Invoice sent: <?php echo esc_html( $invoice_sent_at ); ?></li><?php endif; ?>
										<?php if ( $payment_confirmed_at ) : ?><li>Payment confirmed: <?php echo esc_html( $payment_confirmed_at ); ?></li><?php endif; ?>
										<?php if ( $payment_blocked_at ) : ?><li>Blocked: <?php echo esc_html( $payment_blocked_at ); ?></li><?php endif; ?>
										<?php if ( $payment_cancelled_at ) : ?><li>Cancelled: <?php echo esc_html( $payment_cancelled_at ); ?></li><?php endif; ?>
									</ul>
								<?php endif; ?>
								<?php if ( $payment_quick_actions ) : ?>
									<p style="margin:8px 0 0;">
										<?php foreach ( $payment_quick_actions as $next_status => $action_label ) : ?>
											<a class="button button-small" style="margin:0 4px 4px 0;" href="<?php echo esc_url( justice_theme_lawyer_payment_followup_quick_action_url( $post_id, $next_status ) ); ?>"><?php echo esc_html( $action_label ); ?></a>
										<?php endforeach; ?>
									</p>
								<?php endif; ?>
								<?php if ( $payment_handoff_message ) : ?>
									<details style="margin-top:8px;">
										<summary style="cursor:pointer;font-weight:600;">Copy invoice handoff</summary>
										<?php if ( $payment_handoff_context ) : ?>
											<small style="display:block;margin:6px 0;color:#475569;"><?php echo esc_html( $payment_handoff_context ); ?></small>
										<?php endif; ?>
										<textarea readonly rows="7" style="width:100%;margin-top:6px;font-size:12px;direction:rtl;"><?php echo esc_textarea( $payment_handoff_message ); ?></textarea>
										<?php if ( $payment_handoff_whatsapp_url ) : ?>
											<a class="button button-small" style="margin-top:6px;" href="<?php echo esc_url( $payment_handoff_whatsapp_url ); ?>" target="_blank" rel="noopener noreferrer">Open WhatsApp handoff</a>
										<?php endif; ?>
										<small style="display:block;color:#64748b;">Send after license/commercial review. This message does not charge or activate anyone.</small>
									</details>
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_update ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#fff3cd;color:#7a4b00;font-size:12px;">Pending update review</span>
								<?php endif; ?>
								<?php foreach ( $mini_fields as $label => $value ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:<?php echo $value ? '#e7f7ed' : '#f1f1f1'; ?>;color:<?php echo $value ? '#17643a' : '#666'; ?>;font-size:12px;">
										<?php echo esc_html( $label . ': ' . ( $value ? 'YES' : 'NO' ) ); ?>
									</span>
								<?php endforeach; ?>
							</td>
							<td>
								<?php if ( $account_status ) : ?>
									<p style="margin:0 0 6px;"><strong>Account:</strong> <?php echo esc_html( str_replace( '_', ' ', $account_status ) ); ?></p>
								<?php endif; ?>
								<?php if ( $service_request_id ) : ?>
									<div style="margin:0 0 8px;padding:8px;border-radius:6px;background:#fff5f5;border:1px solid #f4b4b4;color:#7f1d1d;">
										<strong>Service request:</strong> <?php echo esc_html( $service_request_id ); ?><br>
										<small><?php echo esc_html( trim( $service_request_type . ' / ' . $service_request_status_label, ' /' ) ); ?></small>
										<?php if ( $service_request_subject ) : ?>
											<br><small><?php echo esc_html( $service_request_subject ); ?></small>
										<?php endif; ?>
										<?php if ( $service_request_quick_actions ) : ?>
											<p style="margin:8px 0 0;">
												<?php foreach ( $service_request_quick_actions as $next_service_status => $action_label ) : ?>
													<a class="button button-small" style="margin:0 4px 4px 0;" href="<?php echo esc_url( justice_theme_lawyer_service_request_quick_action_url( $post_id, $next_service_status ) ); ?>"><?php echo esc_html( $action_label ); ?></a>
												<?php endforeach; ?>
											</p>
										<?php endif; ?>
									</div>
								<?php endif; ?>
								<?php foreach ( $upload_fields as $label => $attachment_id ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:<?php echo $attachment_id ? '#e7f0ff' : '#f1f1f1'; ?>;color:<?php echo $attachment_id ? '#16427a' : '#666'; ?>;font-size:12px;">
										<?php echo esc_html( $label . ': ' . ( $attachment_id ? 'YES' : 'NO' ) ); ?>
									</span>
									<?php if ( $attachment_id ) : ?>
										<a href="<?php echo esc_url( get_edit_post_link( $attachment_id, '' ) ); ?>">review</a>
									<?php endif; ?>
								<?php endforeach; ?>
								<?php if ( $has_pending_upload_review ) : ?>
									<p style="margin:6px 0;">
										<span style="display:inline-block;padding:2px 7px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;">Upload review</span>
									</p>
									<?php if ( $upload_notes ) : ?>
										<p style="margin:0 0 6px;"><?php echo esc_html( wp_html_excerpt( $upload_notes, 150, '...' ) ); ?></p>
									<?php endif; ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_mark_lawyer_registration_assets_reviewed&lawyer_id=' . $post_id ), 'justice_mark_lawyer_registration_assets_reviewed_' . $post_id ) ); ?>">Mark assets reviewed</a>
								<?php endif; ?>
								<?php if ( $has_pending_ai_draft && $ai_profile_draft ) : ?>
									<p style="margin:8px 0 6px;">
										<span style="display:inline-block;padding:2px 7px;border-radius:999px;background:#eef2ff;color:#3730a3;font-size:12px;">AI draft review</span>
									</p>
									<p style="margin:0 0 6px;"><?php echo esc_html( wp_html_excerpt( $ai_profile_draft, 180, '...' ) ); ?></p>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_mark_lawyer_ai_profile_draft_reviewed&lawyer_id=' . $post_id ), 'justice_mark_lawyer_ai_profile_draft_reviewed_' . $post_id ) ); ?>">Mark draft reviewed</a>
								<?php endif; ?>
								<?php if ( ! $account_status && ! $upload_notes && ! $ai_profile_draft ) : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_update ) : ?>
									<?php foreach ( $pending_fields as $label => $value ) : ?>
										<?php if ( $value ) : ?>
											<p style="margin:0 0 6px;"><strong><?php echo esc_html( $label ); ?>:</strong> <?php echo esc_html( wp_html_excerpt( (string) $value, 120, '...' ) ); ?></p>
										<?php endif; ?>
									<?php endforeach; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_content ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#e7f0ff;color:#16427a;font-size:12px;">Pending content review</span>
									<p style="margin:0 0 6px;"><?php echo esc_html( $content_topic ?: '-' ); ?></p>
									<?php if ( $content_article_id ) : ?>
										<a href="<?php echo esc_url( get_edit_post_link( $content_article_id, '' ) ); ?>">Review draft</a>
									<?php endif; ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_mark_lawyer_content_reviewed&lawyer_id=' . $post_id ), 'justice_mark_lawyer_content_reviewed_' . $post_id ) ); ?>">Mark reviewed</a>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $has_pending_review_campaign ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;">Review campaign requested</span>
									<p style="margin:0 0 6px;"><strong>Client group:</strong> <?php echo esc_html( $review_client_group ?: '-' ); ?></p>
									<?php if ( $review_business_url ) : ?>
										<p style="margin:0 0 6px;"><strong>Google profile:</strong> <a href="<?php echo esc_url( $review_business_url ); ?>" target="_blank" rel="noopener noreferrer">Open</a></p>
									<?php else : ?>
										<p style="margin:0 0 6px;color:#8a6d3b;"><strong>Google profile:</strong> missing</p>
									<?php endif; ?>
									<?php if ( $review_request_url ) : ?>
										<p style="margin:0 0 6px;"><strong>Review request link:</strong> <a href="<?php echo esc_url( $review_request_url ); ?>" target="_blank" rel="noopener noreferrer">Open</a></p>
									<?php else : ?>
										<p style="margin:0 0 6px;color:#8a6d3b;"><strong>Review request link:</strong> missing</p>
									<?php endif; ?>
									<?php if ( $review_place_id ) : ?>
										<p style="margin:0 0 6px;"><strong>Place ID:</strong> <code><?php echo esc_html( $review_place_id ); ?></code></p>
									<?php endif; ?>
									<?php if ( $review_campaign_at ) : ?>
										<small><?php echo esc_html( $review_campaign_at ); ?></small>
									<?php endif; ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_mark_lawyer_review_campaign_reviewed&lawyer_id=' . $post_id ), 'justice_mark_lawyer_review_campaign_reviewed_' . $post_id ) ); ?>">Mark reviewed</a>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $recent_notes ) : ?>
									<?php foreach ( $recent_notes as $note ) : ?>
										<p style="margin:0 0 6px;"><?php echo esc_html( wp_html_excerpt( $note, 140, '...' ) ); ?></p>
									<?php endforeach; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( $status ); ?></td>
							<td><?php echo esc_html( get_the_date() ); ?></td>
							<td>
								<a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Review</a>
								<?php if ( ! empty( $claim_target['edit_url'] ) ) : ?>
									<a class="button" href="<?php echo esc_url( $claim_target['edit_url'] ); ?>">Review claimed card</a>
								<?php endif; ?>
								<?php if ( function_exists( 'justice_theme_lawyer_recommendation_token_create_admin_url' ) ) : ?>
									<a class="button" href="<?php echo esc_url( justice_theme_lawyer_recommendation_token_create_admin_url( $post_id ) ); ?>">Create recommendation link</a>
								<?php endif; ?>
								<?php if ( $has_pending_update ) : ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_apply_lawyer_profile_update&lawyer_id=' . $post_id ), 'justice_apply_lawyer_profile_update_' . $post_id ) ); ?>">Apply pending update</a>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_discard_lawyer_profile_update&lawyer_id=' . $post_id ), 'justice_discard_lawyer_profile_update_' . $post_id ) ); ?>">Discard pending update</a>
								<?php endif; ?>
							</td>
						</tr>
					<?php endwhile; ?>
				</tbody>
			</table>
			<?php wp_reset_postdata(); ?>
		<?php else : ?>
			<div class="notice notice-info inline">
				<p>No pending lawyer self-registration drafts found.</p>
			</div>
		<?php endif; ?>
	</div>
	<?php
}
