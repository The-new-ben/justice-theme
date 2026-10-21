<?php
/** Verified public intake, with observable storage/mail stages. @package JusticeOps */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Replace only the known companion handler; retain the theme's priority-0 spam guard. */
function justice_ops_register_public_intake(): void {
	if ( ! function_exists( 'uje_handle_lead' ) ) { return; }
	foreach ( array( 'admin_post_justice_submit_lead', 'admin_post_nopriv_justice_submit_lead' ) as $hook ) {
		if ( false !== has_action( $hook, 'uje_handle_lead' ) ) {
			remove_action( $hook, 'uje_handle_lead', 10 );
			add_action( $hook, 'justice_ops_handle_public_intake', 10 );
		}
	}
}
add_action( 'after_setup_theme', 'justice_ops_register_public_intake', 20 );

/** Read one form field without accepting arrays/objects. */
function justice_ops_intake_field( array $input, string $key, bool $multiline = false ): string {
	$value = isset( $input[ $key ] ) && is_scalar( $input[ $key ] ) ? (string) wp_unslash( $input[ $key ] ) : '';
	return $multiline ? sanitize_textarea_field( $value ) : sanitize_text_field( $value );
}

/** Private synthetic mode requires both an administrator and its own nonce. */
function justice_ops_intake_is_test( array $input ): bool {
	return '1' === justice_ops_intake_field( $input, 'justice_intake_test' )
		&& current_user_can( 'manage_options' )
		&& (bool) wp_verify_nonce( justice_ops_intake_field( $input, 'justice_intake_test_nonce' ), 'justice_intake_test' );
}

/** Shared form hook: no test fields are printed for an anonymous visitor. */
function justice_ops_intake_form_context(): void {
	if ( current_user_can( 'manage_options' ) && '1' === justice_ops_intake_field( $_GET, 'lead_test' ) ) {
		echo '<p role="status">בדיקת מערכת בלבד. הפנייה תישמר כניסוי ולא תועבר לעורך דין או ל־HubSpot.</p>';
		echo '<input type="hidden" name="justice_intake_test" value="1">';
		wp_nonce_field( 'justice_intake_test', 'justice_intake_test_nonce' );
	}
	if ( 'success' === justice_ops_intake_field( $_GET, 'lead' ) ) {
		echo '<p class="lead-form__notice" data-intake-receipt-notice role="status">אפשר לברר את מצב הפנייה דרך פרטי הקשר באתר.</p>';
	}
}
add_action( 'justice_public_lead_form_context', 'justice_ops_intake_form_context' );

/** Fail visibly. Never include submitted facts or database errors in the URL/output. */
function justice_ops_intake_failure( int $lead_id, string $stage ): void {
	if ( $lead_id > 0 ) {
		update_post_meta( $lead_id, 'lead_storage_status', 'incomplete' );
		update_post_meta( $lead_id, 'lead_storage_error_stage', $stage );
	}
	wp_die(
		'לא הצלחנו לשמור את הפנייה. חזרו לטופס ונסו שוב, או פנו אלינו דרך פרטי הקשר באתר.',
		'שליחת הפנייה לא הושלמה',
		array( 'response' => 503, 'back_link' => true )
	);
}

function justice_ops_handle_public_intake(): void {
	$nonce = justice_ops_intake_field( $_POST, 'justice_lead_nonce' );
	if ( ! wp_verify_nonce( $nonce, 'justice_submit_lead' ) ) {
		wp_die( 'בדיקת האבטחה נכשלה. חזרו לטופס ונסו שוב.', '', array( 'response' => 403, 'back_link' => true ) );
	}
	// A new submission must not inherit a previous successful submission's receipt.
	if ( function_exists( 'justice_ops_intake_clear_receipt' ) ) { justice_ops_intake_clear_receipt(); }
	$is_test = justice_ops_intake_is_test( $_POST );
	if ( '1' === justice_ops_intake_field( $_POST, 'justice_intake_test' ) && ! $is_test ) {
		wp_die( 'בדיקת המערכת דורשת הרשאת מנהל תקפה.', '', array( 'response' => 403 ) );
	}
	$name    = justice_ops_intake_field( $_POST, 'lead_name' );
	$phone   = justice_ops_intake_field( $_POST, 'lead_phone' );
	$email   = sanitize_email( justice_ops_intake_field( $_POST, 'lead_email' ) );
	$area    = justice_ops_intake_field( $_POST, 'lead_area' );
	$city    = justice_ops_intake_field( $_POST, 'lead_city' );
	$message = justice_ops_intake_field( $_POST, 'lead_message', true );
	$urgency = justice_ops_intake_field( $_POST, 'lead_urgency' ) ?: 'normal';
	// Existing profile forms use the native checkbox default "on".
	$consent = in_array( justice_ops_intake_field( $_POST, 'lead_consent' ), array( '1', 'on' ), true );
	// Preserve legacy forms that do not emit this field. Record absence honestly;
	// adding a new sitewide consent policy is not part of this storage repair.
	if ( '' === $name || '' === $phone ) {
		wp_die( 'יש למלא שם וטלפון לפני השליחה.', '', array( 'response' => 400, 'back_link' => true ) );
	}
	$surface = sanitize_key( justice_ops_intake_field( $_POST, 'lead_source_surface' ) ) ?: 'public_lead_form';
	$source  = wp_get_referer() ?: home_url( '/' );
	$intent  = sanitize_key( justice_ops_intake_field( $_POST, 'product_intent' ) );
	$intent  = function_exists( 'justice_theme_normalize_professional_review_product_intent' )
		? justice_theme_normalize_professional_review_product_intent( $intent )
		: ( in_array( $intent, array( 'court_rehearsal', 'mediation', 'witness_prep', 'case_review' ), true ) ? $intent : '' );
	$channel = function_exists( 'justice_theme_public_lead_source_channel' )
		? justice_theme_public_lead_source_channel( $surface ) : 'public_site_form';
	$next = function_exists( 'justice_theme_public_lead_revenue_next_step' )
		? justice_theme_public_lead_revenue_next_step( $surface )
		: 'Review need, consent and coverage before assignment or billing.';

	$assigned = $is_test ? 0 : absint( justice_ops_intake_field( $_POST, 'assigned_lawyer_id' ) );
	// WordPress writes meta_input before save_post. Hold even the classifier's
	// nested meta hooks; a draft alone was not a guard in the legacy theme.
	$initial_meta = array(
		'routing_hold' => $is_test ? '1' : 'intake_pending',
		'lead_storage_status' => 'pending',
		'lead_intake_version' => '2026-10-21-persistence-v2',
		'lead_routing_owner' => $assigned ? 'theme' : 'ops',
		'lead_is_test' => $is_test ? '1' : '0',
	);
	$lead_id = wp_insert_post( array(
		'post_type' => 'justice_lead', 'post_status' => 'draft',
		'post_title' => ( $is_test ? '[בדיקת מערכת] ' : '' ) . $name . ' - ' . ( $area ?: 'כללי' ),
		'meta_input' => $initial_meta,
	), true );
	if ( ! $lead_id || is_wp_error( $lead_id ) ) {
		justice_ops_intake_failure( 0, 'insert' );
		return;
	}
	$lead_id = (int) $lead_id;
	foreach ( $initial_meta as $key => $value ) {
		// A separate owner policy may replace our temporary hold with its own.
		$actual = (string) get_post_meta( $lead_id, $key, true );
		if ( ( 'routing_hold' === $key && '' !== $actual ) || $actual === $value ) { continue; }
		justice_ops_intake_failure( $lead_id, 'initial_metadata' );
		return;
	}
	$meta = array(
		'visitor_name' => $name, 'visitor_phone' => $phone, 'visitor_email' => $email,
		'legal_area' => $area, 'city' => $city, 'message' => $message, 'urgency' => $urgency,
		'follow_up_status' => 'not_started', 'coverage_status' => 'coverage_review',
		'consent' => $consent ? '1' : '0', 'consent_status' => $consent ? 'explicit_site_form_consent' : 'missing_site_form_consent',
		'source_url' => $source, 'source_page_url' => $source,
		'source_keyword' => justice_ops_intake_field( $_POST, 'source_keyword' ),
		'source_channel' => $channel, 'source_system' => 'justice_public_site',
		'lead_source_surface' => $surface, 'product_intent' => $intent,
		'lead_revenue_model' => 'public_intake_review', 'qualified_lead_billing_status' => 'not_ready',
		'lead_revenue_notes' => 'Qualify need, consent, coverage and commercial terms before billing.',
		'owner_revenue_next_step' => $next,
		'assigned_lawyer_id' => (string) $assigned,
	);
	if ( $is_test ) {
		$meta['lead_is_test'] = '1';
		$meta['routing_hold'] = '1';
		$meta['qualified_lead_billing_status'] = 'test_excluded';
		$meta['assigned_lawyer_id'] = '0';
		$meta['owner_revenue_next_step'] = 'System test only. Exclude from lead and revenue metrics.';
	}
	foreach ( array( 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content' ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) { $meta[ $key ] = justice_ops_intake_field( $_POST, $key ); }
	}
	foreach ( $meta as $key => $value ) {
		update_post_meta( $lead_id, $key, wp_slash( (string) $value ) );
		if ( (string) get_post_meta( $lead_id, $key, true ) !== (string) $value ) {
			justice_ops_intake_failure( $lead_id, 'metadata' );
			return;
		}
	}
	$published = wp_update_post( array( 'ID' => $lead_id, 'post_status' => 'publish' ), true );
	if ( ! $published || is_wp_error( $published ) || 'publish' !== get_post_status( $lead_id ) ) {
		justice_ops_intake_failure( $lead_id, 'publish' );
		return;
	}
	update_post_meta( $lead_id, 'lead_storage_status', 'stored' );
	if ( 'stored' !== get_post_meta( $lead_id, 'lead_storage_status', true ) ) {
		justice_ops_intake_failure( $lead_id, 'storage_confirmation' );
		return;
	}
	update_post_meta( $lead_id, 'lead_stored_at', current_time( 'mysql', true ) );

	// Mail acceptance is observable, but is not proof of inbox delivery.
	$subject = ( $is_test ? '[בדיקת מערכת - לא ליד] ' : 'ליד חדש: ' ) . $name . ' - ' . ( $area ?: 'כללי' );
	$body = sprintf( "שם: %s\nטלפון: %s\nאימייל: %s\nתחום: %s\nעיר: %s\nדחיפות: %s\n\nהודעה:\n%s\n\nמקור: %s", $name, $phone, $email, $area, $city, $urgency, $message, $source );
	$mail_ok = wp_mail( get_option( 'admin_email' ), $subject, $body );
	update_post_meta( $lead_id, 'lead_owner_mail_status', $mail_ok ? 'accepted_for_sending' : 'failed' );
	update_post_meta( $lead_id, 'lead_owner_mail_attempted_at', current_time( 'mysql', true ) );

	// Release only OUR hold, never an owner's or policy's hold. A failed delete
	// leaves a saved lead in the owner queue, not an unsafe external handoff.
	if ( ! $is_test ) { delete_post_meta( $lead_id, 'routing_hold', 'intake_pending' ); }
	// One routing owner: profile requests keep their direct assignment; generic
	// requests use Ops eligibility/caps. The theme must not also broadcast them.
	update_post_meta( $lead_id, 'lead_status', $is_test ? 'closed' : 'new' );
	if ( ! $is_test && $assigned && function_exists( 'justice_theme_route_lead_to_lawyers' ) ) {
		justice_theme_route_lead_to_lawyers( $lead_id, get_post( $lead_id ), true );
	}
	if ( function_exists( 'justice_ops_intake_issue_receipt' ) ) { justice_ops_intake_issue_receipt( $lead_id, $source ); }
	wp_safe_redirect( add_query_arg( 'lead', 'success', $source ) );
	exit;
}

/** Private evidence without exposing contact/case data on a new endpoint. */
function justice_ops_intake_meta_box(): void {
	add_meta_box( 'justice-intake-evidence', 'שמירת פנייה והתראה', 'justice_ops_intake_meta_box_render', 'justice_lead', 'side' );
}
add_action( 'add_meta_boxes', 'justice_ops_intake_meta_box' );
function justice_ops_intake_meta_box_render( $post ): void {
	$fields = array(
		'lead_storage_status' => 'שמירה', 'lead_owner_mail_status' => 'התראת מנהל',
		'lead_storage_error_stage' => 'שלב כשל', 'lead_is_test' => 'ניסוי פנימי',
		'lead_intake_version' => 'גרסת מסלול',
	);
	foreach ( $fields as $key => $label ) {
		echo '<p><strong>' . esc_html( $label ) . ':</strong> ' . esc_html( (string) get_post_meta( $post->ID, $key, true ) ?: 'לא נמדד' ) . '</p>';
	}
	echo '<p>accepted_for_sending מציין שהמערכת קיבלה את המייל למשלוח, לא שהגיע לתיבה.</p>';
}
