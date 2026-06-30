<?php
/**
 * AI legal tools app: page template support, lead-gate REST endpoint,
 * and document attachment for the gated AI document generator at
 * /legal-tools/.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the extra request meta this endpoint writes that isn't
 * already declared by the LegalTech intake plugin.
 */
function justice_theme_register_legal_tools_lead_meta() {
	if ( ! post_type_exists( 'justice_legal_request' ) ) {
		return;
	}

	register_post_meta(
		'justice_legal_request',
		'attached_document_id',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'integer',
			'auth_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'justice_theme_register_legal_tools_lead_meta', 20 );

/**
 * Register the lead-gate REST route. This is what unlocks AI-enhanced
 * output, copy, print and download in the gated app - the free template
 * draft itself never touches this endpoint.
 */
function justice_theme_register_legal_tools_lead_route() {
	register_rest_route(
		'justice/v1',
		'/legal-tools/lead',
		array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
			'callback'            => 'justice_theme_handle_legal_tools_lead',
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_legal_tools_lead_route' );

/**
 * Handle the gated lead submission: create a justice_legal_request post
 * (same CPT and meta schema the rest of the LegalTech intake already
 * uses) and, if a document was attached, sideload it as a private
 * attachment linked to the request for lawyer review.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_theme_handle_legal_tools_lead( WP_REST_Request $request ) {
	// Honeypot: a filled hidden field means a bot filled every input.
	$honeypot = $request->get_param( 'lead_hp' );
	if ( ! empty( $honeypot ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	$name    = sanitize_text_field( (string) $request->get_param( 'lead_name' ) );
	$phone   = sanitize_text_field( (string) $request->get_param( 'lead_phone' ) );
	$email   = sanitize_email( (string) $request->get_param( 'lead_email' ) );
	$consent = (string) $request->get_param( 'lead_consent' );

	if ( '' === $name || '' === $phone || '' === $consent ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'missing_fields' ), 400 );
	}

	if ( ! post_type_exists( 'justice_legal_request' ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'unavailable' ), 200 );
	}

	$tool_id        = sanitize_text_field( (string) $request->get_param( 'tool_id' ) );
	$tool_title     = sanitize_text_field( (string) $request->get_param( 'tool_title' ) );
	$lang           = sanitize_text_field( (string) $request->get_param( 'lang' ) );
	$fields_json    = (string) $request->get_param( 'fields' );
	$draft_excerpt  = sanitize_textarea_field( (string) $request->get_param( 'draft_excerpt' ) );
	$fields_decoded = json_decode( $fields_json, true );
	$fields_summary = is_array( $fields_decoded ) ? wp_json_encode( $fields_decoded, JSON_UNESCAPED_UNICODE ) : '{}';

	$request_id = wp_insert_post(
		array(
			'post_type'    => 'justice_legal_request',
			'post_status'  => 'private',
			'post_title'   => sprintf( 'AI Legal Tools - %s - %s', $tool_title ?: $tool_id ?: 'tool', $name ),
			'post_content' => $draft_excerpt,
		)
	);

	if ( ! $request_id || is_wp_error( $request_id ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'save_failed' ), 200 );
	}

	update_post_meta( $request_id, 'visitor_name', $name );
	update_post_meta( $request_id, 'visitor_phone', $phone );
	update_post_meta( $request_id, 'visitor_email', $email );
	update_post_meta( $request_id, 'legal_area', $tool_id );
	update_post_meta( $request_id, 'status', 'new' );
	update_post_meta( $request_id, 'payment_status', 'not_started' );
	update_post_meta( $request_id, 'consent', true );
	update_post_meta( $request_id, 'source_url', home_url( '/legal-tools/' ) );
	update_post_meta( $request_id, 'intake_summary', $fields_summary );
	update_post_meta( $request_id, 'ai_draft', $draft_excerpt );

	$files = $request->get_file_params();
	if ( ! empty( $files['lead_document'] ) && empty( $files['lead_document']['error'] ) ) {
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
		}

		$allowed_types = array(
			'pdf'  => 'application/pdf',
			'doc'  => 'application/msword',
			'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'jpg'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'png'  => 'image/png',
		);

		$upload = wp_handle_upload(
			$files['lead_document'],
			array(
				'test_form' => false,
				'mimes'     => $allowed_types,
			)
		);

		if ( ! empty( $upload['file'] ) && empty( $upload['error'] ) ) {
			$attachment_id = wp_insert_attachment(
				array(
					'post_mime_type' => $upload['type'],
					'post_title'     => sanitize_file_name( basename( $upload['file'] ) ),
					'post_status'    => 'private',
					'post_parent'    => $request_id,
				),
				$upload['file'],
				$request_id
			);

			if ( $attachment_id && ! is_wp_error( $attachment_id ) ) {
				wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );
				update_post_meta( $request_id, 'attached_document_id', $attachment_id );
			}
		}
	}

	do_action( 'justice_theme_legal_tools_lead_captured', $request_id );

	return new WP_REST_Response( array( 'ok' => true, 'request_id' => $request_id ), 200 );
}

/**
 * Auto-load page-legal-tools.php for the /legal-tools/ page via WP's
 * standard page-{slug}.php template hierarchy - no admin action needed.
 */
