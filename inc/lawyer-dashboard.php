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
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_lawyer_dashboard_page_seed' ) || get_option( 'justice_lawyer_dashboard_page_seeded_v1' ) ) {
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
	update_post_meta( $lawyer_id, 'pending_content_review', '1' );
	update_post_meta( $lawyer_id, 'latest_content_request_article_id', (string) $article_id );
	update_post_meta( $lawyer_id, 'latest_content_request_topic', $topic );
	update_post_meta( $lawyer_id, 'latest_content_request_submitted_at', current_time( 'mysql' ) );
	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'Lawyer requested signed content draft: ' . $topic );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_content_request', 'New lawyer content request draft: ' . $topic );
	}

	justice_theme_notify_lawyer_content_request( $article_id, $lawyer_id, $topic, $intent, $audience );

	wp_safe_redirect( add_query_arg( 'content_request', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_content_request', 'justice_theme_handle_lawyer_content_request' );

function justice_theme_handle_lawyer_profile_update_request(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_profile_update_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_profile_update_nonce'] ) ), 'justice_lawyer_profile_update' ) ) {
		wp_safe_redirect( add_query_arg( 'profile_update', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'profile_update', 'blocked', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id    = get_current_user_id();
	$lawyer_id  = isset( $_POST['lawyer_profile_id'] ) ? absint( $_POST['lawyer_profile_id'] ) : 0;
	$profile_ok = $lawyer_id && (string) $user_id === (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

	if ( ! $profile_ok ) {
		wp_safe_redirect( add_query_arg( 'profile_update', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$pending = array(
		'pending_profile_headline'  => isset( $_POST['profile_headline'] ) ? sanitize_text_field( wp_unslash( $_POST['profile_headline'] ) ) : '',
		'pending_profile_bar_number' => isset( $_POST['profile_bar_number'] ) ? sanitize_text_field( wp_unslash( $_POST['profile_bar_number'] ) ) : '',
		'pending_profile_website'   => isset( $_POST['profile_website'] ) ? esc_url_raw( wp_unslash( $_POST['profile_website'] ) ) : '',
		'pending_profile_services'  => isset( $_POST['profile_services'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_services'] ) ) : '',
		'pending_profile_process'   => isset( $_POST['profile_process'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_process'] ) ) : '',
		'pending_profile_video_url' => isset( $_POST['profile_video_url'] ) ? esc_url_raw( wp_unslash( $_POST['profile_video_url'] ) ) : '',
		'pending_profile_faqs'      => isset( $_POST['profile_faqs'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_faqs'] ) ) : '',
	);

	foreach ( $pending as $key => $value ) {
		update_post_meta( $lawyer_id, $key, $value );
	}

	update_post_meta( $lawyer_id, 'pending_profile_review', '1' );
	update_post_meta( $lawyer_id, 'pending_profile_submitted_at', current_time( 'mysql' ) );
	update_post_meta( $lawyer_id, 'profile_status', 'pending_update_review' );
	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'Lawyer submitted staged mini-site update request from dashboard.' );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_request', 'New lawyer profile update request: ' . get_the_title( $lawyer_id ) );
	}

	justice_theme_notify_lawyer_profile_update_request( $lawyer_id, $pending );

	wp_safe_redirect( add_query_arg( 'profile_update', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_profile_update_request', 'justice_theme_handle_lawyer_profile_update_request' );

function justice_theme_handle_lawyer_review_campaign_request(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_review_campaign_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_review_campaign_nonce'] ) ), 'justice_lawyer_review_campaign' ) ) {
		wp_safe_redirect( add_query_arg( 'review_campaign', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'review_campaign', 'blocked', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id    = get_current_user_id();
	$lawyer_id  = isset( $_POST['lawyer_profile_id'] ) ? absint( $_POST['lawyer_profile_id'] ) : 0;
	$profile_ok = $lawyer_id && (string) $user_id === (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

	if ( ! $profile_ok ) {
		wp_safe_redirect( add_query_arg( 'review_campaign', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$client_group = isset( $_POST['review_client_group'] ) ? sanitize_text_field( wp_unslash( $_POST['review_client_group'] ) ) : '';
	$notes        = isset( $_POST['review_campaign_notes'] ) ? sanitize_textarea_field( wp_unslash( $_POST['review_campaign_notes'] ) ) : '';
	$business_url = isset( $_POST['google_business_profile_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_business_profile_url'] ) ) : '';
	$review_url   = isset( $_POST['google_review_request_url'] ) ? esc_url_raw( wp_unslash( $_POST['google_review_request_url'] ) ) : '';
	$place_id     = isset( $_POST['google_place_id'] ) ? sanitize_text_field( wp_unslash( $_POST['google_place_id'] ) ) : '';

	update_post_meta( $lawyer_id, 'pending_review_campaign_request', '1' );
	update_post_meta( $lawyer_id, 'latest_review_campaign_client_group', $client_group );
	update_post_meta( $lawyer_id, 'latest_review_campaign_notes', $notes );
	update_post_meta( $lawyer_id, 'latest_review_campaign_requested_at', current_time( 'mysql' ) );
	update_post_meta( $lawyer_id, 'latest_review_campaign_google_business_url', $business_url );
	update_post_meta( $lawyer_id, 'latest_review_campaign_google_review_url', $review_url );
	update_post_meta( $lawyer_id, 'latest_review_campaign_google_place_id', $place_id );

	if ( $business_url ) {
		update_post_meta( $lawyer_id, 'google_business_profile_url', $business_url );
	}
	if ( $review_url ) {
		update_post_meta( $lawyer_id, 'google_review_request_url', $review_url );
	}
	if ( $place_id ) {
		update_post_meta( $lawyer_id, 'google_place_id', $place_id );
	}

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		$source_note = $business_url || $review_url || $place_id ? ' Google source details were provided.' : '';
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'Lawyer requested review/recommendation campaign setup from dashboard.' . $source_note );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_review_campaign_request', 'New lawyer review campaign request: ' . get_the_title( $lawyer_id ) );
	}

	justice_theme_notify_lawyer_review_campaign_request(
		$lawyer_id,
		$client_group,
		$notes,
		array(
			'business_url' => $business_url,
			'review_url'   => $review_url,
			'place_id'     => $place_id,
		)
	);

	wp_safe_redirect( add_query_arg( 'review_campaign', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_review_campaign_request', 'justice_theme_handle_lawyer_review_campaign_request' );

function justice_theme_handle_lawyer_supplier_request(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_supplier_request_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_supplier_request_nonce'] ) ), 'justice_lawyer_supplier_request' ) ) {
		wp_safe_redirect( add_query_arg( 'supplier_request', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'supplier_request', 'blocked', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id    = get_current_user_id();
	$lawyer_id  = isset( $_POST['lawyer_profile_id'] ) ? absint( $_POST['lawyer_profile_id'] ) : 0;
	$profile_ok = $lawyer_id && (string) $user_id === (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

	if ( ! $profile_ok ) {
		wp_safe_redirect( add_query_arg( 'supplier_request', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$category = isset( $_POST['supplier_category'] ) ? sanitize_key( wp_unslash( $_POST['supplier_category'] ) ) : 'other';
	if ( function_exists( 'justice_theme_lawyer_supplier_categories' ) && ! array_key_exists( $category, justice_theme_lawyer_supplier_categories() ) ) {
		$category = 'other';
	}

	$urgency = isset( $_POST['supplier_urgency'] ) ? sanitize_key( wp_unslash( $_POST['supplier_urgency'] ) ) : 'this_month';
	if ( ! in_array( $urgency, array( 'urgent', 'this_month', 'researching', 'not_sure' ), true ) ) {
		$urgency = 'this_month';
	}

	$notes = isset( $_POST['supplier_request_notes'] ) ? sanitize_textarea_field( wp_unslash( $_POST['supplier_request_notes'] ) ) : '';

	update_post_meta( $lawyer_id, 'pending_supplier_request', '1' );
	update_post_meta( $lawyer_id, 'latest_supplier_request_category', $category );
	update_post_meta( $lawyer_id, 'latest_supplier_request_urgency', $urgency );
	update_post_meta( $lawyer_id, 'latest_supplier_request_notes', $notes );
	update_post_meta( $lawyer_id, 'latest_supplier_request_requested_at', current_time( 'mysql' ) );

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'Lawyer requested a vetted supplier/service: ' . $category . ' (' . $urgency . ').' );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_supplier_request', 'New lawyer supplier request: ' . get_the_title( $lawyer_id ) . ' - ' . $category );
	}

	justice_theme_notify_lawyer_supplier_request( $lawyer_id, $category, $urgency, $notes );

	wp_safe_redirect( add_query_arg( 'supplier_request', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_supplier_request', 'justice_theme_handle_lawyer_supplier_request' );

/**
 * Simulation representation interest checkbox (owner order 2026-07-17,
 * Phase 3 of the law-firm index expansion). Records ONLY a boolean signal
 * on the lawyer's own claimed profile - no integration exists yet, this
 * exists to measure real demand before the cross-product HADMAIA
 * integration work is scoped.
 */
function justice_theme_handle_lawyer_sim_interest(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_sim_interest_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_sim_interest_nonce'] ) ), 'justice_lawyer_sim_interest' ) ) {
		wp_safe_redirect( add_query_arg( 'sim_interest', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id    = get_current_user_id();
	$lawyer_id  = isset( $_POST['lawyer_profile_id'] ) ? absint( $_POST['lawyer_profile_id'] ) : 0;
	$profile_ok = $lawyer_id && (string) $user_id === (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

	if ( ! $profile_ok ) {
		wp_safe_redirect( add_query_arg( 'sim_interest', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$interested = ! empty( $_POST['sim_interest'] ) ? '1' : '0';
	update_post_meta( $lawyer_id, 'sim_representation_interest', $interested );

	if ( '1' === $interested && function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'Lawyer recorded interest in AI courtroom simulation representation.' );
	}

	wp_safe_redirect( add_query_arg( 'sim_interest', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_sim_interest', 'justice_theme_handle_lawyer_sim_interest' );

function justice_theme_lawyer_service_request_options(): array {
	return array(
		'billing_question'    => __( 'Billing / payment question', 'justice-theme' ),
		'payment_link_request' => __( 'Send payment link', 'justice-theme' ),
		'invoice_copy'        => __( 'Invoice or receipt copy', 'justice-theme' ),
		'upgrade_plan'        => __( 'Upgrade plan', 'justice-theme' ),
		'downgrade_plan'      => __( 'Downgrade plan', 'justice-theme' ),
		'cancel_subscription' => __( 'Cancel subscription', 'justice-theme' ),
		'refund_request'      => __( 'Refund / money-back request', 'justice-theme' ),
		'complaint'           => __( 'Complaint or service issue', 'justice-theme' ),
		'lead_quality'        => __( 'Lead quality problem', 'justice-theme' ),
		'technical_issue'     => __( 'Technical issue', 'justice-theme' ),
		'other'               => __( 'Other service request', 'justice-theme' ),
	);
}

function justice_theme_lawyer_dashboard_service_presets(): array {
	return array(
		'payment_link' => array(
			'label'        => __( 'Send payment link', 'justice-theme' ),
			'type'         => 'payment_link_request',
			'urgency'      => 'urgent',
			'desired_plan' => '',
			'subject'      => __( 'Please send my payment link', 'justice-theme' ),
			'message'      => __( 'I want to complete payment for my selected lawyer plan. Please send the Grow/Morning payment link and invoice details.', 'justice-theme' ),
		),
		'upgrade'      => array(
			'label'        => __( 'Upgrade plan', 'justice-theme' ),
			'type'         => 'upgrade_plan',
			'urgency'      => 'this_week',
			'desired_plan' => 'lead_partner',
			'subject'      => __( 'I want to upgrade my plan', 'justice-theme' ),
			'message'      => __( 'Please review my account and send the correct upgrade/payment instructions before the next billing cycle.', 'justice-theme' ),
		),
		'downgrade'    => array(
			'label'        => __( 'Downgrade plan', 'justice-theme' ),
			'type'         => 'downgrade_plan',
			'urgency'      => 'next_cycle',
			'desired_plan' => 'pro',
			'subject'      => __( 'I want to downgrade my plan', 'justice-theme' ),
			'message'      => __( 'Please review my account and confirm the downgrade terms before the next billing cycle.', 'justice-theme' ),
		),
		'cancel'       => array(
			'label'        => __( 'Cancel subscription', 'justice-theme' ),
			'type'         => 'cancel_subscription',
			'urgency'      => 'next_cycle',
			'desired_plan' => '',
			'subject'      => __( 'I want to cancel my subscription', 'justice-theme' ),
			'message'      => __( 'Please review my account, confirm the cancellation date, and explain what happens to my profile and leads.', 'justice-theme' ),
		),
		'refund'       => array(
			'label'        => __( 'Request refund', 'justice-theme' ),
			'type'         => 'refund_request',
			'urgency'      => 'urgent',
			'desired_plan' => '',
			'subject'      => __( 'I want to request a refund', 'justice-theme' ),
			'message'      => __( 'Please review the payment, invoice/reference, service issue, and refund eligibility. I understand no refund is executed until owner/provider review.', 'justice-theme' ),
		),
		'invoice'      => array(
			'label'        => __( 'Invoice copy', 'justice-theme' ),
			'type'         => 'invoice_copy',
			'urgency'      => 'this_week',
			'desired_plan' => '',
			'subject'      => __( 'Please send invoice or receipt copy', 'justice-theme' ),
			'message'      => __( 'Please send me the invoice/receipt copy for my latest payment. Include the invoice reference if available.', 'justice-theme' ),
		),
		'lead_quality' => array(
			'label'        => __( 'Lead quality issue', 'justice-theme' ),
			'type'         => 'lead_quality',
			'urgency'      => 'this_week',
			'desired_plan' => '',
			'subject'      => __( 'Lead quality issue', 'justice-theme' ),
			'message'      => __( 'Please review the lead quality. I will include the lead name, date, and what happened after contact.', 'justice-theme' ),
		),
		'complaint'    => array(
			'label'        => __( 'Complaint', 'justice-theme' ),
			'type'         => 'complaint',
			'urgency'      => 'urgent',
			'desired_plan' => '',
			'subject'      => __( 'Service complaint', 'justice-theme' ),
			'message'      => __( 'Please review this service issue and tell me the next action, owner response, and expected resolution time.', 'justice-theme' ),
		),
	);
}

function justice_theme_lawyer_service_request_urgency_options(): array {
	return array(
		'urgent'      => __( 'Urgent - today', 'justice-theme' ),
		'this_week'   => __( 'This week', 'justice-theme' ),
		'next_cycle'  => __( 'Before next billing cycle', 'justice-theme' ),
		'not_urgent'  => __( 'Not urgent', 'justice-theme' ),
	);
}

function justice_theme_handle_lawyer_service_request(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_service_request_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_service_request_nonce'] ) ), 'justice_lawyer_service_request' ) ) {
		wp_safe_redirect( add_query_arg( 'service_request', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'service_request', 'blocked', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id    = get_current_user_id();
	$lawyer_id  = isset( $_POST['lawyer_profile_id'] ) ? absint( $_POST['lawyer_profile_id'] ) : 0;
	$profile_ok = $lawyer_id && (string) $user_id === (string) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );

	if ( ! $profile_ok ) {
		wp_safe_redirect( add_query_arg( 'service_request', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$request_type = isset( $_POST['service_request_type'] ) ? sanitize_key( wp_unslash( $_POST['service_request_type'] ) ) : 'other';
	$type_options = justice_theme_lawyer_service_request_options();
	if ( ! array_key_exists( $request_type, $type_options ) ) {
		$request_type = 'other';
	}

	$urgency = isset( $_POST['service_request_urgency'] ) ? sanitize_key( wp_unslash( $_POST['service_request_urgency'] ) ) : 'this_week';
	$urgency_options = justice_theme_lawyer_service_request_urgency_options();
	if ( ! array_key_exists( $urgency, $urgency_options ) ) {
		$urgency = 'this_week';
	}

	$subject      = isset( $_POST['service_request_subject'] ) ? sanitize_text_field( wp_unslash( $_POST['service_request_subject'] ) ) : '';
	$message      = isset( $_POST['service_request_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['service_request_message'] ) ) : '';
	$desired_plan = isset( $_POST['service_request_desired_plan'] ) ? sanitize_key( wp_unslash( $_POST['service_request_desired_plan'] ) ) : '';
	$plans        = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();

	if ( $desired_plan && ! array_key_exists( $desired_plan, $plans ) ) {
		$desired_plan = '';
	}

	if ( 'payment_link_request' === $request_type && '' === $desired_plan ) {
		$current_plan = sanitize_key( (string) get_post_meta( $lawyer_id, 'plan_type', true ) );

		if ( $current_plan && 'free' !== $current_plan && array_key_exists( $current_plan, $plans ) ) {
			$desired_plan = $current_plan;
		}
	}

	if ( '' === $subject && '' === $message ) {
		wp_safe_redirect( add_query_arg( 'service_request', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$request_id = 'LSR-' . gmdate( 'Ymd-His' ) . '-' . $lawyer_id;

	update_post_meta( $lawyer_id, 'pending_service_request', '1' );
	update_post_meta( $lawyer_id, 'latest_service_request_id', $request_id );
	update_post_meta( $lawyer_id, 'latest_service_request_type', $request_type );
	update_post_meta( $lawyer_id, 'latest_service_request_subject', $subject );
	update_post_meta( $lawyer_id, 'latest_service_request_message', $message );
	update_post_meta( $lawyer_id, 'latest_service_request_desired_plan', $desired_plan );
	update_post_meta( $lawyer_id, 'latest_service_request_urgency', $urgency );
	update_post_meta( $lawyer_id, 'latest_service_request_status', 'open' );
	update_post_meta( $lawyer_id, 'latest_service_request_submitted_at', current_time( 'mysql' ) );

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note(
			$lawyer_id,
			sprintf(
				'Lawyer service request %s: %s / %s. Desired plan: %s.',
				$request_id,
				$type_options[ $request_type ],
				$urgency_options[ $urgency ],
				$desired_plan ?: '-'
			)
		);
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_service_request', 'New lawyer service request ' . $request_id . ': ' . get_the_title( $lawyer_id ) . ' - ' . $request_type );
	}

	justice_theme_notify_lawyer_service_request(
		$lawyer_id,
		array(
			'request_id'   => $request_id,
			'type'         => $request_type,
			'type_label'   => $type_options[ $request_type ],
			'urgency'      => $urgency,
			'urgency_label' => $urgency_options[ $urgency ],
			'subject'      => $subject,
			'message'      => $message,
			'desired_plan' => $desired_plan,
		)
	);

	wp_safe_redirect( add_query_arg( 'service_request', 'sent', home_url( '/lawyer-dashboard/#service-request' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_service_request', 'justice_theme_handle_lawyer_service_request' );

function justice_theme_lawyer_dashboard_lead_stage_options(): array {
	return array(
		'not_started'       => __( 'New', 'justice-theme' ),
		'first_attempt'     => __( 'First attempt', 'justice-theme' ),
		'contacted'         => __( 'Contacted', 'justice-theme' ),
		'consult_scheduled' => __( 'Consultation scheduled', 'justice-theme' ),
		'won'               => __( 'Won', 'justice-theme' ),
		'lost'              => __( 'Not fit / lost', 'justice-theme' ),
	);
}

function justice_theme_handle_lawyer_lead_stage_update(): void {
	if ( ! is_user_logged_in() || ! isset( $_POST['justice_lawyer_lead_stage_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_lead_stage_nonce'] ) ), 'justice_lawyer_lead_stage_update' ) ) {
		wp_safe_redirect( add_query_arg( 'lead_stage', 'failed', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lead' ) || ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'lead_stage', 'blocked', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$user_id        = get_current_user_id();
	$lead_id        = isset( $_POST['lead_id'] ) ? absint( $_POST['lead_id'] ) : 0;
	$selected_stage = isset( $_POST['lead_stage'] ) ? sanitize_key( wp_unslash( $_POST['lead_stage'] ) ) : 'not_started';
	$follow_up_note = isset( $_POST['lead_follow_up_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['lead_follow_up_note'] ) ) : '';
	$stage_options  = justice_theme_lawyer_dashboard_lead_stage_options();
	$assigned_id    = $lead_id ? (int) get_post_meta( $lead_id, 'assigned_lawyer_id', true ) : 0;
	$profile_ok     = $assigned_id && 'justice_lawyer' === get_post_type( $assigned_id ) && (string) $user_id === (string) get_post_meta( $assigned_id, 'claimed_by_user_id', true );

	if ( ! $lead_id || 'justice_lead' !== get_post_type( $lead_id ) || ! $profile_ok || ! array_key_exists( $selected_stage, $stage_options ) ) {
		wp_safe_redirect( add_query_arg( 'lead_stage', 'missing', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$lead_status_map = array(
		'not_started'       => 'assigned',
		'first_attempt'     => 'contacted',
		'contacted'         => 'contacted',
		'consult_scheduled' => 'accepted',
		'won'               => 'converted',
		'lost'              => 'closed',
	);

	update_post_meta( $lead_id, 'follow_up_status', $selected_stage );
	update_post_meta( $lead_id, 'lead_status', $lead_status_map[ $selected_stage ] ?? 'assigned' );
	update_post_meta( $lead_id, 'latest_lawyer_stage_update_at', current_time( 'mysql' ) );
	update_post_meta( $lead_id, 'latest_lawyer_stage_update_by', (string) $user_id );
	update_post_meta( $lead_id, 'latest_lawyer_follow_up_note', $follow_up_note );

	if ( in_array( $selected_stage, array( 'first_attempt', 'contacted', 'consult_scheduled', 'won', 'lost' ), true ) && ! get_post_meta( $lead_id, 'first_contact_at', true ) ) {
		update_post_meta( $lead_id, 'first_contact_at', current_time( 'Y-m-d\TH:i' ) );
	}
	if ( 'consult_scheduled' === $selected_stage && ! get_post_meta( $lead_id, 'consultation_scheduled_at', true ) ) {
		update_post_meta( $lead_id, 'consultation_scheduled_at', current_time( 'mysql' ) );
	}
	if ( 'won' === $selected_stage && ! get_post_meta( $lead_id, 'retained_at', true ) ) {
		update_post_meta( $lead_id, 'retained_at', current_time( 'mysql' ) );
	}
	if ( 'lost' === $selected_stage && ! get_post_meta( $lead_id, 'closed_at', true ) ) {
		update_post_meta( $lead_id, 'closed_at', current_time( 'mysql' ) );
	}

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_lead_stage_update', 'Lawyer updated lead #' . $lead_id . ' stage to ' . $selected_stage );
	}

	wp_safe_redirect( add_query_arg( 'lead_stage', 'updated', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_lead_stage_update', 'justice_theme_handle_lawyer_lead_stage_update' );

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

function justice_theme_notify_lawyer_profile_update_request( int $lawyer_id, array $pending ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$message = sprintf(
		"New staged lawyer mini-site update is waiting for review.\n\nLawyer: %s\nHeadline: %s\nBar number: %s\nWebsite/proof link: %s\nVideo: %s\n\nReview profile: %s",
		get_the_title( $lawyer_id ),
		$pending['pending_profile_headline'] ?: '-',
		$pending['pending_profile_bar_number'] ?: '-',
		$pending['pending_profile_website'] ?: '-',
		$pending['pending_profile_video_url'] ?: '-',
		admin_url( 'post.php?post=' . $lawyer_id . '&action=edit' )
	);

	wp_mail( $admin_email, 'New lawyer mini-site update request', $message );
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

function justice_theme_notify_lawyer_review_campaign_request( int $lawyer_id, string $client_group, string $notes, array $google_sources = array() ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$message = sprintf(
		"New lawyer review/recommendation campaign request.\n\nLawyer: %s\nClient group: %s\nGoogle Business URL: %s\nGoogle review request URL: %s\nGoogle Place ID: %s\nNotes: %s\n\nImportant: do not send SMS/email review requests before owner review and lawyer approval. Do not copy Google review text into Jus-Tice unless the approved API/policy path is used.\n\nReview profile: %s",
		get_the_title( $lawyer_id ),
		$client_group ?: '-',
		isset( $google_sources['business_url'] ) && $google_sources['business_url'] ? $google_sources['business_url'] : '-',
		isset( $google_sources['review_url'] ) && $google_sources['review_url'] ? $google_sources['review_url'] : '-',
		isset( $google_sources['place_id'] ) && $google_sources['place_id'] ? $google_sources['place_id'] : '-',
		$notes ?: '-',
		admin_url( 'post.php?post=' . $lawyer_id . '&action=edit' )
	);

	wp_mail( $admin_email, 'New lawyer review campaign request', $message );
}

function justice_theme_notify_lawyer_supplier_request( int $lawyer_id, string $category, string $urgency, string $notes ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$category_label = $category;
	if ( function_exists( 'justice_theme_lawyer_supplier_categories' ) ) {
		$categories     = justice_theme_lawyer_supplier_categories();
		$category_label = isset( $categories[ $category ] ) ? wp_strip_all_tags( (string) $categories[ $category ] ) : $category;
	}

	$message = sprintf(
		"New lawyer supplier/service request.\n\nLawyer: %s\nCategory: %s\nUrgency: %s\nNotes: %s\n\nMoney path: match this request to an approved supplier prospect or use it as evidence for supplier outreach.\n\nReview profile: %s\nSupplier pipeline: %s",
		get_the_title( $lawyer_id ),
		$category_label ?: '-',
		$urgency ?: '-',
		$notes ?: '-',
		admin_url( 'post.php?post=' . $lawyer_id . '&action=edit' ),
		admin_url( 'edit.php?post_type=justice_supplier' )
	);

	wp_mail( $admin_email, 'New lawyer supplier request', $message );
}

function justice_theme_notify_lawyer_service_request( int $lawyer_id, array $request ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$plans             = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();
	$desired_plan      = (string) ( $request['desired_plan'] ?? '' );
	$desired_plan_name = $desired_plan && isset( $plans[ $desired_plan ]['label'] ) ? wp_strip_all_tags( (string) $plans[ $desired_plan ]['label'] ) : $desired_plan;

	$message = sprintf(
		"New lawyer service / billing request.\n\nRequest ID: %s\nLawyer: %s\nType: %s\nUrgency: %s\nDesired plan: %s\nSubject: %s\nMessage:\n%s\n\nOwner action: handle this before the next billing cycle if it affects payment, cancellation, downgrade, refund or lead satisfaction.\n\nReview profile: %s\nLawyer onboarding queue: %s",
		$request['request_id'] ?? '-',
		get_the_title( $lawyer_id ),
		$request['type_label'] ?? ( $request['type'] ?? '-' ),
		$request['urgency_label'] ?? ( $request['urgency'] ?? '-' ),
		$desired_plan_name ?: '-',
		$request['subject'] ?? '-',
		$request['message'] ?? '-',
		admin_url( 'post.php?post=' . $lawyer_id . '&action=edit' ),
		admin_url( 'admin.php?page=justice-lawyer-onboarding&service_request_status=pending' )
	);

	wp_mail( $admin_email, 'New lawyer service request', $message );
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

function justice_theme_lawyer_dashboard_growth_assets( int $post_id, int $lead_count, int $content_request_count, int $profile_views_total ): array {
	$review_count       = (int) get_post_meta( $post_id, 'google_review_count', true );
	if ( ! $review_count ) {
		$review_count = (int) get_post_meta( $post_id, 'review_count', true );
	}
	$latest_review_date = (string) get_post_meta( $post_id, 'latest_review_date', true );
	$has_fresh_review   = false;
	$has_google_source  = (bool) get_post_meta( $post_id, 'google_review_request_url', true ) || (bool) get_post_meta( $post_id, 'google_business_profile_url', true ) || (bool) get_post_meta( $post_id, 'google_place_id', true );
	$recommendations    = function_exists( 'justice_theme_lawyer_recommendation_counts' ) ? justice_theme_lawyer_recommendation_counts( $post_id ) : array( 'approved_public' => 0, 'fresh_approved' => 0 );
	$has_recommendation = 0 < (int) $recommendations['approved_public'];
	$has_fresh_first_party_recommendation = 0 < (int) $recommendations['fresh_approved'];

	if ( $latest_review_date ) {
		$review_timestamp = strtotime( $latest_review_date );
		$has_fresh_review = $review_timestamp && $review_timestamp >= strtotime( '-120 days', current_time( 'timestamp' ) );
	}

	return array(
		array(
			'label' => __( 'Profile is claimed and connected to a login', 'justice-theme' ),
			'done'  => (bool) get_post_meta( $post_id, 'claimed_by_user_id', true ),
			'why'   => __( 'Claimed profiles are easier to keep accurate and more likely to convert.', 'justice-theme' ),
		),
		array(
			'label' => __( 'Professional photo is present', 'justice-theme' ),
			'done'  => has_post_thumbnail( $post_id ),
			'why'   => __( 'A real photo is a basic trust signal before a user calls.', 'justice-theme' ),
			'action_label' => __( 'Request profile update', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#profile-update-request' ),
		),
		array(
			'label' => __( 'License / Bar number is recorded', 'justice-theme' ),
			'done'  => (bool) get_post_meta( $post_id, 'bar_number', true ),
			'why'   => __( 'Legal profiles need verifiable professional identity.', 'justice-theme' ),
			'action_label' => __( 'Request profile update', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#profile-update-request' ),
		),
		array(
			'label' => __( 'Website or external proof link is recorded', 'justice-theme' ),
			'done'  => (bool) get_post_meta( $post_id, 'website', true ),
			'why'   => __( 'External proof supports authority and user confidence.', 'justice-theme' ),
			'action_label' => __( 'Request profile update', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#profile-update-request' ),
		),
		array(
			'label' => __( 'Services and process are explained', 'justice-theme' ),
			'done'  => (bool) get_post_meta( $post_id, 'profile_services', true ) && (bool) get_post_meta( $post_id, 'profile_process', true ),
			'why'   => __( 'Users want to know what happens after they call.', 'justice-theme' ),
			'action_label' => __( 'Send profile text', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#profile-update-request' ),
		),
		array(
			'label' => __( 'FAQ / AI-search answer material exists', 'justice-theme' ),
			'done'  => (bool) get_post_meta( $post_id, 'profile_faqs', true ),
			'why'   => __( 'FAQs help search, AI answers and conversion.', 'justice-theme' ),
			'action_label' => __( 'Add FAQs', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#profile-update-request' ),
		),
		array(
			'label' => __( 'Video or personal introduction exists', 'justice-theme' ),
			'done'  => (bool) get_post_meta( $post_id, 'profile_video_url', true ),
			'why'   => __( 'Video helps the lawyer feel real before the first call.', 'justice-theme' ),
			'action_label' => __( 'Add video link', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#profile-update-request' ),
		),
		array(
			'label' => __( 'Review/recommendation source exists', 'justice-theme' ),
			'done'  => $has_google_source || $has_recommendation || 0 < $review_count || '1' === (string) get_post_meta( $post_id, 'pending_review_campaign_request', true ),
			'why'   => __( 'Fresh recommendations are a major trust and local SEO signal.', 'justice-theme' ),
			'action_label' => __( 'Add review source', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#review-campaign-request' ),
		),
		array(
			'label' => __( 'Fresh recommendation activity exists', 'justice-theme' ),
			'done'  => $has_fresh_review || $has_fresh_first_party_recommendation || '1' === (string) get_post_meta( $post_id, 'pending_review_campaign_request', true ),
			'why'   => __( 'Recent reviews usually matter more than old review count.', 'justice-theme' ),
			'action_label' => __( 'Request review campaign', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#review-campaign-request' ),
		),
		array(
			'label' => __( 'Signed content or guide request exists', 'justice-theme' ),
			'done'  => 0 < $content_request_count,
			'why'   => __( 'Content connects the lawyer to practice-area authority.', 'justice-theme' ),
			'action_label' => __( 'Request signed guide', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#content-request' ),
		),
		array(
			'label' => __( 'Professional supplier/service need is captured', 'justice-theme' ),
			'done'  => '1' === (string) get_post_meta( $post_id, 'pending_supplier_request', true ),
			'why'   => __( 'Useful partner services give lawyers more value and reduce operational friction.', 'justice-theme' ),
			'action_label' => __( 'Request supplier', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-dashboard/#supplier-request' ),
		),
		array(
			'label' => __( 'Measured exposure exists', 'justice-theme' ),
			'done'  => 0 < $profile_views_total,
			'why'   => __( 'Paid lawyers need visible proof that the platform is working.', 'justice-theme' ),
			'action_label' => __( 'Upgrade visibility', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-plans/' ),
		),
		array(
			'label' => __( 'Lead flow exists', 'justice-theme' ),
			'done'  => 0 < $lead_count,
			'why'   => __( 'Leads are the strongest retention proof once routing is active.', 'justice-theme' ),
			'action_label' => __( 'View lead plans', 'justice-theme' ),
			'action_url'   => home_url( '/lawyer-plans/' ),
		),
	);
}
