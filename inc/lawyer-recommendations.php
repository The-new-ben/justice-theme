<?php
/**
 * First-party lawyer recommendations.
 *
 * Google reviews stay external unless an approved API/policy path exists.
 * This CPT stores Jus-Tice first-party recommendations separately so owner
 * review, permission, moderation and later public display can be controlled.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_lawyer_recommendation_cpt(): void {
	$labels = array(
		'name'          => __( 'Lawyer Recommendations', 'justice-theme' ),
		'singular_name' => __( 'Lawyer Recommendation', 'justice-theme' ),
		'add_new_item'  => __( 'Add Lawyer Recommendation', 'justice-theme' ),
		'edit_item'     => __( 'Edit Lawyer Recommendation', 'justice-theme' ),
		'menu_name'     => __( 'Recommendations', 'justice-theme' ),
	);

	register_post_type(
		'justice_recommendation',
		array(
			'labels'        => $labels,
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => 'justice-lawyer-onboarding',
			'supports'      => array( 'title', 'editor' ),
			'capability_type' => 'post',
			'map_meta_cap'  => true,
			'has_archive'   => false,
			'rewrite'       => false,
			'show_in_rest'  => false,
		)
	);
}
add_action( 'init', 'justice_theme_register_lawyer_recommendation_cpt' );

function justice_theme_register_lawyer_recommendation_meta(): void {
	$fields = array(
		'recommended_lawyer_id'       => 'integer',
		'client_display_name'         => 'string',
		'client_relationship'         => 'string',
		'recommendation_rating'       => 'integer',
		'recommendation_source_type'  => 'string',
		'recommendation_source_url'   => 'string',
		'recommendation_received_at'  => 'string',
		'recommendation_permission'   => 'string',
		'recommendation_moderation'   => 'string',
		'recommendation_owner_note'   => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta(
			'justice_recommendation',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => justice_theme_recommendation_meta_sanitizer( $key ),
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_register_lawyer_recommendation_meta' );

function justice_theme_recommendation_meta_sanitizer( string $key ): string {
	if ( 'recommendation_source_url' === $key ) {
		return 'esc_url_raw';
	}

	if ( 'recommended_lawyer_id' === $key || 'recommendation_rating' === $key ) {
		return 'absint';
	}

	if ( 'recommendation_owner_note' === $key ) {
		return 'sanitize_textarea_field';
	}

	return 'sanitize_text_field';
}

function justice_theme_recommendation_moderation_options(): array {
	return array(
		'draft_review' => __( 'Draft / owner review', 'justice-theme' ),
		'permission_needed' => __( 'Permission needed', 'justice-theme' ),
		'approved_private' => __( 'Approved private', 'justice-theme' ),
		'approved_public' => __( 'Approved public', 'justice-theme' ),
		'rejected' => __( 'Rejected', 'justice-theme' ),
	);
}

function justice_theme_recommendation_source_type_options(): array {
	return array(
		'first_party'     => __( 'First-party Jus-Tice recommendation', 'justice-theme' ),
		'verified_client' => __( 'Verified client (case-linked review token)', 'justice-theme' ),
		'google_link'     => __( 'Google link/reference only', 'justice-theme' ),
		'manual_import'   => __( 'Manual import / not public by default', 'justice-theme' ),
		'other'           => __( 'Other / review before display', 'justice-theme' ),
	);
}

function justice_theme_public_recommendation_source_types(): array {
	$allowed = apply_filters( 'justice_theme_public_recommendation_source_types', array( 'first_party', 'verified_client' ) );
	$allowed = array_values( array_unique( array_map( 'sanitize_key', (array) $allowed ) ) );
	$allowed = array_values( array_intersect( $allowed, array_keys( justice_theme_recommendation_source_type_options() ) ) );

	return $allowed ?: array( 'first_party' );
}

function justice_theme_lawyer_public_recommendation_meta_query( int $lawyer_id ): array {
	return array(
		'relation' => 'AND',
		array(
			'key'   => 'recommended_lawyer_id',
			'value' => (string) $lawyer_id,
		),
		array(
			'key'   => 'recommendation_moderation',
			'value' => 'approved_public',
		),
		array(
			'key'   => 'recommendation_permission',
			'value' => 'confirmed',
		),
		array(
			'key'     => 'recommendation_source_type',
			'value'   => justice_theme_public_recommendation_source_types(),
			'compare' => 'IN',
		),
	);
}

function justice_theme_register_lawyer_recommendation_token_cpt(): void {
	$labels = array(
		'name'          => __( 'Recommendation Tokens', 'justice-theme' ),
		'singular_name' => __( 'Recommendation Token', 'justice-theme' ),
		'edit_item'     => __( 'Edit Recommendation Token', 'justice-theme' ),
		'menu_name'     => __( 'Recommendation Tokens', 'justice-theme' ),
	);

	register_post_type(
		'justice_reco_token',
		array(
			'labels'          => $labels,
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => 'justice-lawyer-onboarding',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'map_meta_cap'    => true,
			'has_archive'     => false,
			'rewrite'         => false,
			'show_in_rest'    => false,
		)
	);
}
add_action( 'init', 'justice_theme_register_lawyer_recommendation_token_cpt' );

function justice_theme_register_lawyer_recommendation_token_meta(): void {
	$fields = array(
		'recommendation_token_lawyer_id'                     => 'integer',
		'recommendation_token_hash'                          => 'string',
		'recommendation_token_status'                        => 'string',
		'recommendation_token_expires_at'                    => 'string',
		'recommendation_token_used_at'                       => 'string',
		'recommendation_token_created_by'                    => 'integer',
		'recommendation_token_submitted_recommendation_id'   => 'integer',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta(
			'justice_reco_token',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => in_array( $type, array( 'integer' ), true ) ? 'absint' : 'sanitize_text_field',
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_register_lawyer_recommendation_token_meta' );

function justice_theme_recommendation_token_hash( string $token ): string {
	return hash( 'sha256', $token );
}

function justice_theme_lawyer_recommendation_token_url( string $token ): string {
	return add_query_arg(
		'justice_recommendation_token',
		rawurlencode( $token ),
		home_url( '/' )
	);
}

function justice_theme_lawyer_recommendation_token_create_admin_url( int $lawyer_id ): string {
	return wp_nonce_url(
		admin_url( 'admin-post.php?action=justice_create_lawyer_recommendation_token&lawyer_id=' . $lawyer_id ),
		'justice_create_lawyer_recommendation_token_' . $lawyer_id
	);
}

function justice_theme_create_lawyer_recommendation_token( int $lawyer_id, int $valid_days = 30 ): array {
	if ( ! $lawyer_id || 'justice_lawyer' !== get_post_type( $lawyer_id ) || ! post_type_exists( 'justice_reco_token' ) ) {
		return array( 'error' => 'invalid_lawyer' );
	}

	$valid_days = max( 1, min( 90, $valid_days ) );
	$token      = wp_generate_password( 40, false, false );
	$expires_at = gmdate( 'Y-m-d H:i:s', time() + ( DAY_IN_SECONDS * $valid_days ) );
	$token_id   = wp_insert_post(
		array(
			'post_type'   => 'justice_reco_token',
			'post_status' => 'publish',
			'post_title'  => sprintf(
				'Recommendation link - %s - %s',
				get_the_title( $lawyer_id ),
				gmdate( 'Y-m-d' )
			),
			'meta_input'  => array(
				'recommendation_token_lawyer_id'   => $lawyer_id,
				'recommendation_token_hash'        => justice_theme_recommendation_token_hash( $token ),
				'recommendation_token_status'      => 'active',
				'recommendation_token_expires_at'  => $expires_at,
				'recommendation_token_created_by'  => get_current_user_id(),
			),
		)
	);

	if ( ! $token_id || is_wp_error( $token_id ) ) {
		return array( 'error' => 'insert_failed' );
	}

	return array(
		'token_id'   => (int) $token_id,
		'token'      => $token,
		'url'        => justice_theme_lawyer_recommendation_token_url( $token ),
		'expires_at' => $expires_at,
	);
}

function justice_theme_handle_create_lawyer_recommendation_token(): void {
	$lawyer_id = isset( $_GET['lawyer_id'] ) ? absint( wp_unslash( $_GET['lawyer_id'] ) ) : 0;

	if ( ! $lawyer_id || ! current_user_can( 'edit_post', $lawyer_id ) || ! check_admin_referer( 'justice_create_lawyer_recommendation_token_' . $lawyer_id ) ) {
		wp_safe_redirect( add_query_arg( 'recommendation_token', 'failed', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
		exit;
	}

	$result = justice_theme_create_lawyer_recommendation_token( $lawyer_id );
	if ( ! empty( $result['error'] ) || empty( $result['url'] ) ) {
		wp_safe_redirect( add_query_arg( 'recommendation_token', 'failed', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
		exit;
	}

	set_transient( 'justice_recommendation_token_link_' . get_current_user_id(), (string) $result['url'], 15 * MINUTE_IN_SECONDS );

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'Owner created a one-time first-party recommendation intake link. The link expires at ' . $result['expires_at'] . ' UTC.' );
	}

	wp_safe_redirect(
		add_query_arg(
			array(
				'recommendation_token' => 'created',
				'lawyer_id'            => $lawyer_id,
			),
			admin_url( 'admin.php?page=justice-lawyer-onboarding' )
		)
	);
	exit;
}
add_action( 'admin_post_justice_create_lawyer_recommendation_token', 'justice_theme_handle_create_lawyer_recommendation_token' );

function justice_theme_admin_latest_recommendation_token_link(): string {
	return (string) get_transient( 'justice_recommendation_token_link_' . get_current_user_id() );
}

function justice_theme_recommendation_token_from_request( string $raw_token ): array {
	$token = preg_replace( '/[^A-Za-z0-9]/', '', $raw_token );
	if ( ! $token || strlen( $token ) < 32 || ! post_type_exists( 'justice_reco_token' ) ) {
		return array();
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'justice_reco_token',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_query'     => array(
				array(
					'key'   => 'recommendation_token_hash',
					'value' => justice_theme_recommendation_token_hash( $token ),
				),
			),
		)
	);

	if ( empty( $query->posts ) ) {
		return array();
	}

	$token_id  = (int) $query->posts[0];
	$lawyer_id = (int) get_post_meta( $token_id, 'recommendation_token_lawyer_id', true );

	if ( ! $lawyer_id || 'justice_lawyer' !== get_post_type( $lawyer_id ) ) {
		return array();
	}

	return array(
		'token_id'   => $token_id,
		'lawyer_id'  => $lawyer_id,
		'lead_id'    => (int) get_post_meta( $token_id, 'recommendation_token_lead_id', true ),
		'status'     => (string) get_post_meta( $token_id, 'recommendation_token_status', true ),
		'expires_at' => (string) get_post_meta( $token_id, 'recommendation_token_expires_at', true ),
	);
}

function justice_theme_recommendation_token_is_active( array $record ): bool {
	if ( empty( $record['token_id'] ) || empty( $record['lawyer_id'] ) || 'active' !== (string) ( $record['status'] ?? '' ) ) {
		return false;
	}

	$expires_at = isset( $record['expires_at'] ) ? strtotime( (string) $record['expires_at'] ) : 0;
	return $expires_at && $expires_at > time();
}

function justice_theme_handle_lawyer_recommendation_intake(): void {
	if ( empty( $_GET['justice_recommendation_token'] ) ) {
		return;
	}

	$raw_token = sanitize_text_field( wp_unslash( $_GET['justice_recommendation_token'] ) );
	$record    = justice_theme_recommendation_token_from_request( $raw_token );
	$submitted = isset( $_GET['recommendation_submitted'] ) && '1' === (string) $_GET['recommendation_submitted'];

	if ( empty( $record ) ) {
		justice_theme_render_lawyer_recommendation_intake_page( array(), $raw_token, array(), false, 'invalid' );
		exit;
	}

	if ( $submitted && 'used' === (string) $record['status'] ) {
		justice_theme_render_lawyer_recommendation_intake_page( $record, $raw_token, array(), true );
		exit;
	}

	if ( 'POST' === (string) ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) {
		$errors = justice_theme_process_lawyer_recommendation_intake_submission( $record, $raw_token );
		if ( empty( $errors ) ) {
			wp_safe_redirect( add_query_arg( 'recommendation_submitted', '1', justice_theme_lawyer_recommendation_token_url( $raw_token ) ) );
			exit;
		}

		justice_theme_render_lawyer_recommendation_intake_page( $record, $raw_token, $errors );
		exit;
	}

	if ( ! justice_theme_recommendation_token_is_active( $record ) ) {
		justice_theme_render_lawyer_recommendation_intake_page( $record, $raw_token, array(), false, 'expired' );
		exit;
	}

	justice_theme_render_lawyer_recommendation_intake_page( $record, $raw_token );
	exit;
}
add_action( 'template_redirect', 'justice_theme_handle_lawyer_recommendation_intake' );

function justice_theme_process_lawyer_recommendation_intake_submission( array $record, string $raw_token ): array {
	$token_id  = (int) ( $record['token_id'] ?? 0 );
	$lawyer_id = (int) ( $record['lawyer_id'] ?? 0 );
	$errors    = array();

	if ( ! justice_theme_recommendation_token_is_active( $record ) ) {
		return array( __( 'The recommendation link is no longer active.', 'justice-theme' ) );
	}

	$nonce = isset( $_POST['justice_recommendation_intake_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_recommendation_intake_nonce'] ) ) : '';
	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_recommendation_intake_' . $token_id ) ) {
		return array( __( 'The form session expired. Please reload the page and try again.', 'justice-theme' ) );
	}

	if ( ! empty( $_POST['recommendation_website'] ) ) {
		update_post_meta( $token_id, 'recommendation_token_status', 'used' );
		update_post_meta( $token_id, 'recommendation_token_used_at', current_time( 'mysql' ) );
		return array();
	}

	$client_name  = isset( $_POST['client_display_name'] ) ? sanitize_text_field( wp_unslash( $_POST['client_display_name'] ) ) : '';
	$relationship = isset( $_POST['client_relationship'] ) ? sanitize_text_field( wp_unslash( $_POST['client_relationship'] ) ) : '';
	$body         = isset( $_POST['recommendation_body'] ) ? sanitize_textarea_field( wp_unslash( $_POST['recommendation_body'] ) ) : '';
	$rating       = isset( $_POST['recommendation_rating'] ) ? absint( wp_unslash( $_POST['recommendation_rating'] ) ) : 0;
	$permission   = ! empty( $_POST['recommendation_permission_confirmed'] );
	$lead_id      = (int) ( $record['lead_id'] ?? 0 );
	$is_case_link = $lead_id > 0 && 'justice_lead' === get_post_type( $lead_id );

	if ( $rating > 5 ) {
		$rating = 5;
	}

	$body_length = function_exists( 'mb_strlen' ) ? mb_strlen( $body, 'UTF-8' ) : strlen( $body );

	if ( '' === $client_name ) {
		$errors[] = __( 'Please add a display name or initials.', 'justice-theme' );
	}

	if ( $is_case_link && ( $rating < 1 || $rating > 5 ) ) {
		$errors[] = __( 'נא לבחור דירוג בין 1 ל-5. בביקורת מקושרת לתיק הדירוג הוא חלק מהביקורת.', 'justice-theme' );
	}

	if ( $body_length < 20 ) {
		$errors[] = __( 'Please add a recommendation of at least 20 characters.', 'justice-theme' );
	}

	if ( $body_length > 2000 ) {
		$errors[] = __( 'Please shorten the recommendation to 2,000 characters or less.', 'justice-theme' );
	}

	if ( ! $permission ) {
		$errors[] = __( 'Please confirm that Jus-Tice may review and display the recommendation.', 'justice-theme' );
	}

	if ( ! empty( $errors ) ) {
		return $errors;
	}

	$recommendation_id = wp_insert_post(
		array(
			'post_type'    => 'justice_recommendation',
			'post_status'  => 'draft',
			'post_title'   => sprintf( 'Recommendation for %s - %s', get_the_title( $lawyer_id ), current_time( 'Y-m-d H:i' ) ),
			'post_content' => $body,
		)
	);

	if ( ! $recommendation_id || is_wp_error( $recommendation_id ) ) {
		return array( __( 'The recommendation could not be saved. Please try again later.', 'justice-theme' ) );
	}

	update_post_meta( $recommendation_id, 'recommended_lawyer_id', $lawyer_id );
	update_post_meta( $recommendation_id, 'client_display_name', $client_name );
	update_post_meta( $recommendation_id, 'client_relationship', $relationship );
	update_post_meta( $recommendation_id, 'recommendation_rating', $rating );
	update_post_meta( $recommendation_id, 'recommendation_source_type', $is_case_link ? 'verified_client' : 'first_party' );
	update_post_meta( $recommendation_id, 'recommendation_received_at', current_time( 'Y-m-d' ) );
	update_post_meta( $recommendation_id, 'recommendation_permission', 'confirmed' );
	update_post_meta( $recommendation_id, 'recommendation_moderation', 'draft_review' );

	if ( $is_case_link ) {
		update_post_meta( $recommendation_id, 'reviewed_lead_id', $lead_id );
		update_post_meta( $recommendation_id, 'review_verified_client', '1' );

		$case_area = (string) ( get_post_meta( $lead_id, 'ai_detected_area', true ) ?: get_post_meta( $lead_id, 'legal_area', true ) );
		if ( '' !== $case_area && 'general' !== $case_area ) {
			update_post_meta( $recommendation_id, 'reviewed_case_area', sanitize_key( $case_area ) );
		}

		update_post_meta( $recommendation_id, 'recommendation_owner_note', 'Submitted via case-linked verified-client review token #' . $token_id . ' for lead #' . $lead_id . '. The token was issued only for a real routed/assigned lead. Owner approval is required before any public display.' );
	} else {
		update_post_meta( $recommendation_id, 'recommendation_owner_note', 'Submitted via one-time first-party recommendation token #' . $token_id . '. Owner approval is required before any public display.' );
	}

	update_post_meta( $token_id, 'recommendation_token_status', 'used' );
	update_post_meta( $token_id, 'recommendation_token_used_at', current_time( 'mysql' ) );
	update_post_meta( $token_id, 'recommendation_token_submitted_recommendation_id', (int) $recommendation_id );

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note( $lawyer_id, 'First-party recommendation submitted through token #' . $token_id . '. Review draft recommendation #' . $recommendation_id . ' before public display.' );
	}

	justice_theme_notify_lawyer_recommendation_submission( (int) $recommendation_id, $lawyer_id, $client_name );

	return array();
}

function justice_theme_notify_lawyer_recommendation_submission( int $recommendation_id, int $lawyer_id, string $client_name ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$message = sprintf(
		"New first-party lawyer recommendation is waiting for owner review.\n\nLawyer: %s\nClient display name: %s\n\nReview recommendation: %s\n\nImportant: keep it private unless permission, ethics and owner review are complete.",
		get_the_title( $lawyer_id ),
		$client_name ?: '-',
		admin_url( 'post.php?post=' . $recommendation_id . '&action=edit' )
	);

	wp_mail( $admin_email, 'New lawyer recommendation waiting for review', $message );
}

function justice_theme_render_lawyer_recommendation_intake_page( array $record, string $raw_token, array $errors = array(), bool $submitted = false, string $state = 'active' ): void {
	$lawyer_id    = (int) ( $record['lawyer_id'] ?? 0 );
	$lawyer_title = $lawyer_id ? get_the_title( $lawyer_id ) : '';
	$lead_id      = (int) ( $record['lead_id'] ?? 0 );
	$is_case_link = $lead_id > 0 && 'justice_lead' === get_post_type( $lead_id );
	$page_title   = $submitted ? 'ההמלצה התקבלה' : ( $is_case_link ? 'ביקורת לקוח מאומתת' : 'שליחת המלצה לעורך דין' );

	status_header( 'invalid' === $state ? 404 : 200 );
	nocache_headers();
	header( 'Content-Type: text/html; charset=' . get_bloginfo( 'charset' ) );
	?>
	<!doctype html>
	<html <?php language_attributes(); ?> dir="rtl">
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="robots" content="noindex,nofollow">
		<title><?php echo esc_html( $page_title ); ?> | Jus-Tice</title>
		<style>
			body{margin:0;background:#f4f7fb;color:#13233d;font-family:Arial,"Helvetica Neue",sans-serif;line-height:1.65}
			.recommendation-intake{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 16px}
			.recommendation-intake__card{width:min(720px,100%);background:#fff;border:1px solid #d9e2ef;border-radius:12px;box-shadow:0 24px 70px rgba(19,35,61,.12);padding:28px}
			.recommendation-intake__brand{font-weight:800;color:#9f1d35;margin:0 0 8px}
			.recommendation-intake h1{font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.2;margin:0 0 10px;color:#071d3a}
			.recommendation-intake p{margin:0 0 16px}
			.recommendation-intake label{display:block;font-weight:700;margin:14px 0 6px}
			.recommendation-intake input,.recommendation-intake select,.recommendation-intake textarea{box-sizing:border-box;width:100%;border:1px solid #c9d4e5;border-radius:8px;padding:11px 12px;font:inherit}
			.recommendation-intake textarea{resize:vertical}
			.recommendation-intake__check{display:flex;gap:10px;align-items:flex-start;margin:16px 0}
			.recommendation-intake__check input{width:auto;margin-top:7px}
			.recommendation-intake__actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:18px}
			.recommendation-intake button,.recommendation-intake .button{border:0;border-radius:999px;background:#9f1d35;color:#fff;padding:11px 20px;font-weight:800;text-decoration:none;cursor:pointer}
			.recommendation-intake .button--muted{background:#eef2f7;color:#13233d}
			.recommendation-intake__errors{background:#fff3f4;border:1px solid #efb7c0;color:#7d1026;border-radius:8px;padding:12px 16px;margin:0 0 16px}
			.recommendation-intake__fineprint{color:#66758a;font-size:.92rem}
			.recommendation-intake__hidden{position:absolute;right:-9999px;opacity:0}
		</style>
	</head>
	<body>
		<main class="recommendation-intake" role="main">
			<section class="recommendation-intake__card" aria-labelledby="recommendation-intake-title">
				<p class="recommendation-intake__brand">Jus-Tice</p>
				<?php if ( $submitted ) : ?>
					<h1 id="recommendation-intake-title">תודה, ההמלצה התקבלה לבדיקה</h1>
					<p>ההמלצה נשמרה כממתינה לבדיקה. היא לא תוצג באתר לפני בדיקת בעל האתר ואישור התאמה לפרסום.</p>
					<p class="recommendation-intake__fineprint">אם כללתם בטעות מידע אישי, פרטי תיק חסויים או פרט שאינו מיועד לפרסום, פנו אלינו כדי להסיר או לערוך אותו לפני פרסום.</p>
					<div class="recommendation-intake__actions">
						<a class="button button--muted" href="<?php echo esc_url( home_url( '/' ) ); ?>">חזרה לאתר</a>
					</div>
				<?php elseif ( 'invalid' === $state || 'expired' === $state || ! justice_theme_recommendation_token_is_active( $record ) ) : ?>
					<h1 id="recommendation-intake-title">הקישור אינו פעיל</h1>
					<p>קישור ההמלצה אינו תקין, פג תוקף או כבר נוצל. ניתן לבקש מעורך הדין קישור חדש.</p>
					<div class="recommendation-intake__actions">
						<a class="button button--muted" href="<?php echo esc_url( home_url( '/' ) ); ?>">חזרה לאתר</a>
					</div>
				<?php else : ?>
					<h1 id="recommendation-intake-title"><?php echo $is_case_link ? 'ביקורת על הליווי המשפטי של ' . esc_html( $lawyer_title ) : 'שליחת המלצה עבור ' . esc_html( $lawyer_title ); ?></h1>
					<?php if ( $is_case_link ) : ?>
						<p>קישור זה נשלח אליכם כי הפנייה שלכם טופלה דרך Jus-Tice. הביקורת מקושרת לפנייה אמיתית ולכן תסומן באתר כביקורת לקוח מאומתת לאחר בדיקה ואישור.</p>
					<?php endif; ?>
					<p>הביקורת נשלחת ישירות ל-Jus-Tice לבדיקה. אל תכללו פרטים חסויים, מספרי תיקים, מידע רפואי, שמות צדדים אחרים או כל פרט שאינו מיועד לפרסום.</p>
					<?php if ( ! empty( $errors ) ) : ?>
						<div class="recommendation-intake__errors">
							<?php foreach ( $errors as $error ) : ?>
								<p><?php echo esc_html( $error ); ?></p>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
					<form method="post" action="<?php echo esc_url( justice_theme_lawyer_recommendation_token_url( $raw_token ) ); ?>">
						<?php wp_nonce_field( 'justice_recommendation_intake_' . (int) $record['token_id'], 'justice_recommendation_intake_nonce' ); ?>
						<label class="recommendation-intake__hidden" for="recommendation-website">Website</label>
						<input class="recommendation-intake__hidden" id="recommendation-website" type="text" name="recommendation_website" tabindex="-1" autocomplete="off">

						<label for="client-display-name">שם לתצוגה או ראשי תיבות</label>
						<input id="client-display-name" type="text" name="client_display_name" maxlength="80" required>

						<label for="client-relationship">הקשר לשירות המשפטי</label>
						<input id="client-relationship" type="text" name="client_relationship" maxlength="120" placeholder="לדוגמה: לקוח/ה לשעבר, ייעוץ נקודתי, ליווי בהליך">

						<?php if ( $is_case_link ) : ?>
							<label for="recommendation-rating">דירוג כולל מ-1 עד 5 (חובה)</label>
							<select id="recommendation-rating" name="recommendation_rating" required>
								<option value="">בחירת דירוג</option>
								<option value="5">5 - מצוין</option>
								<option value="4">4 - טוב מאוד</option>
								<option value="3">3 - סביר</option>
								<option value="2">2 - טעון שיפור</option>
								<option value="1">1 - לא מרוצה</option>
							</select>
						<?php else : ?>
							<label for="recommendation-rating">דירוג אופציונלי</label>
							<select id="recommendation-rating" name="recommendation_rating">
								<option value="0">ללא דירוג</option>
								<option value="5">5</option>
								<option value="4">4</option>
								<option value="3">3</option>
								<option value="2">2</option>
								<option value="1">1</option>
							</select>
						<?php endif; ?>

						<label for="recommendation-body">ההמלצה</label>
						<textarea id="recommendation-body" name="recommendation_body" rows="7" maxlength="2000" required></textarea>

						<label class="recommendation-intake__check">
							<input type="checkbox" name="recommendation_permission_confirmed" value="1" required>
							<span>אני מאשר/ת ל-Jus-Tice לבדוק את ההמלצה ולשקול פרסום שלה באתר לאחר עריכה ובדיקת התאמה. ידוע לי שההמלצה לא תפורסם אוטומטית.</span>
						</label>

						<p class="recommendation-intake__fineprint">שליחת ההמלצה אינה מבטיחה פרסום, דירוג או הצגה בפרופיל. Jus-Tice רשאית שלא לפרסם המלצות שאינן מתאימות, כוללות מידע חסוי או דורשות הבהרה.</p>
						<div class="recommendation-intake__actions">
							<button type="submit">שליחת ההמלצה לבדיקה</button>
							<a class="button button--muted" href="<?php echo esc_url( home_url( '/' ) ); ?>">ביטול</a>
						</div>
					</form>
				<?php endif; ?>
			</section>
		</main>
	</body>
	</html>
	<?php
}

function justice_theme_recommendation_meta_boxes(): void {
	add_meta_box(
		'justice_theme_recommendation_details',
		__( 'Recommendation Details', 'justice-theme' ),
		'justice_theme_render_recommendation_details_box',
		'justice_recommendation',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_recommendation_meta_boxes' );

function justice_theme_render_recommendation_details_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_recommendation_details', 'justice_theme_recommendation_details_nonce' );

	$lawyer_id     = (int) get_post_meta( $post->ID, 'recommended_lawyer_id', true );
	$client_name   = (string) get_post_meta( $post->ID, 'client_display_name', true );
	$relationship  = (string) get_post_meta( $post->ID, 'client_relationship', true );
	$rating        = (int) get_post_meta( $post->ID, 'recommendation_rating', true );
	$source_type   = (string) get_post_meta( $post->ID, 'recommendation_source_type', true );
	$source_url    = (string) get_post_meta( $post->ID, 'recommendation_source_url', true );
	$received_at   = (string) get_post_meta( $post->ID, 'recommendation_received_at', true );
	$permission    = (string) get_post_meta( $post->ID, 'recommendation_permission', true );
	$moderation    = (string) get_post_meta( $post->ID, 'recommendation_moderation', true ) ?: 'draft_review';
	$owner_note    = (string) get_post_meta( $post->ID, 'recommendation_owner_note', true );
	$lawyers       = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 200,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'fields'         => 'ids',
		)
	);
	?>
	<p>Store only recommendations that have owner/lawyer review. Do not paste Google review text here unless the policy/API path is explicitly approved.</p>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="justice-recommendation-lawyer-id">Lawyer profile</label></th>
			<td>
				<select id="justice-recommendation-lawyer-id" name="recommended_lawyer_id">
					<option value="0">Select lawyer</option>
					<?php foreach ( $lawyers as $candidate_id ) : ?>
						<option value="<?php echo esc_attr( $candidate_id ); ?>" <?php selected( $lawyer_id, $candidate_id ); ?>><?php echo esc_html( get_the_title( $candidate_id ) ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-client-display-name">Client display name</label></th>
			<td><input id="justice-client-display-name" type="text" name="client_display_name" value="<?php echo esc_attr( $client_name ); ?>" class="regular-text" placeholder="Initials or approved display name"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-client-relationship">Client relationship/context</label></th>
			<td><input id="justice-client-relationship" type="text" name="client_relationship" value="<?php echo esc_attr( $relationship ); ?>" class="regular-text" placeholder="Example: former client, with permission"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-rating">Rating</label></th>
			<td><input id="justice-recommendation-rating" type="number" min="0" max="5" step="1" name="recommendation_rating" value="<?php echo esc_attr( (string) $rating ); ?>" class="small-text"> <span class="description">0 means no public star rating.</span></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-source-type">Source type</label></th>
			<td>
				<select id="justice-recommendation-source-type" name="recommendation_source_type">
					<?php foreach ( justice_theme_recommendation_source_type_options() as $type => $label ) : ?>
						<option value="<?php echo esc_attr( $type ); ?>" <?php selected( $source_type ?: 'first_party', $type ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description">Only first-party Jus-Tice recommendations are public by default. Google links stay external/reference-only unless policy changes are explicitly approved.</p>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-source-url">Source URL</label></th>
			<td><input id="justice-recommendation-source-url" type="url" name="recommendation_source_url" value="<?php echo esc_attr( $source_url ); ?>" class="regular-text"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-received-at">Received date</label></th>
			<td><input id="justice-recommendation-received-at" type="date" name="recommendation_received_at" value="<?php echo esc_attr( $received_at ); ?>"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-permission">Permission status</label></th>
			<td>
				<select id="justice-recommendation-permission" name="recommendation_permission">
					<?php foreach ( array( 'unknown', 'requested', 'confirmed', 'declined' ) as $status ) : ?>
						<option value="<?php echo esc_attr( $status ); ?>" <?php selected( $permission ?: 'unknown', $status ); ?>><?php echo esc_html( $status ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-moderation">Moderation</label></th>
			<td>
				<select id="justice-recommendation-moderation" name="recommendation_moderation">
					<?php foreach ( justice_theme_recommendation_moderation_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $moderation, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description">Use "Approved public" only after permission, ethics and owner review.</p>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-owner-note">Owner note</label></th>
			<td><textarea id="justice-recommendation-owner-note" name="recommendation_owner_note" rows="4" class="large-text"><?php echo esc_textarea( $owner_note ); ?></textarea></td>
		</tr>
	</table>
	<?php
}

function justice_theme_save_recommendation_details( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_recommendation_details_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_recommendation_details_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_recommendation_details' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$rating = isset( $_POST['recommendation_rating'] ) ? absint( wp_unslash( $_POST['recommendation_rating'] ) ) : 0;
	if ( $rating > 5 ) {
		$rating = 5;
	}

	$moderation = isset( $_POST['recommendation_moderation'] ) ? sanitize_key( wp_unslash( $_POST['recommendation_moderation'] ) ) : 'draft_review';
	if ( ! array_key_exists( $moderation, justice_theme_recommendation_moderation_options() ) ) {
		$moderation = 'draft_review';
	}

	$permission = isset( $_POST['recommendation_permission'] ) ? sanitize_key( wp_unslash( $_POST['recommendation_permission'] ) ) : 'unknown';
	if ( ! in_array( $permission, array( 'unknown', 'requested', 'confirmed', 'declined' ), true ) ) {
		$permission = 'unknown';
	}

	$source_type = isset( $_POST['recommendation_source_type'] ) ? sanitize_key( wp_unslash( $_POST['recommendation_source_type'] ) ) : 'first_party';
	if ( ! array_key_exists( $source_type, justice_theme_recommendation_source_type_options() ) ) {
		$source_type = 'first_party';
	}

	update_post_meta( $post_id, 'recommended_lawyer_id', isset( $_POST['recommended_lawyer_id'] ) ? absint( wp_unslash( $_POST['recommended_lawyer_id'] ) ) : 0 );
	update_post_meta( $post_id, 'client_display_name', isset( $_POST['client_display_name'] ) ? sanitize_text_field( wp_unslash( $_POST['client_display_name'] ) ) : '' );
	update_post_meta( $post_id, 'client_relationship', isset( $_POST['client_relationship'] ) ? sanitize_text_field( wp_unslash( $_POST['client_relationship'] ) ) : '' );
	update_post_meta( $post_id, 'recommendation_rating', $rating );
	update_post_meta( $post_id, 'recommendation_source_type', $source_type );
	update_post_meta( $post_id, 'recommendation_source_url', isset( $_POST['recommendation_source_url'] ) ? esc_url_raw( wp_unslash( $_POST['recommendation_source_url'] ) ) : '' );
	update_post_meta( $post_id, 'recommendation_received_at', isset( $_POST['recommendation_received_at'] ) ? sanitize_text_field( wp_unslash( $_POST['recommendation_received_at'] ) ) : '' );
	update_post_meta( $post_id, 'recommendation_permission', $permission );
	update_post_meta( $post_id, 'recommendation_moderation', $moderation );
	update_post_meta( $post_id, 'recommendation_owner_note', isset( $_POST['recommendation_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['recommendation_owner_note'] ) ) : '' );
}
add_action( 'save_post_justice_recommendation', 'justice_theme_save_recommendation_details' );

function justice_theme_lawyer_recommendation_counts( int $lawyer_id ): array {
	if ( ! post_type_exists( 'justice_recommendation' ) ) {
		return array( 'approved_public' => 0, 'fresh_approved' => 0 );
	}

	$approved = new WP_Query(
		array(
			'post_type'      => 'justice_recommendation',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id ),
		)
	);

	$fresh = new WP_Query(
		array(
			'post_type'      => 'justice_recommendation',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'date_query'     => array(
				array(
					'after' => '120 days ago',
				),
			),
			'meta_query'     => justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id ),
		)
	);

	return array(
		'approved_public' => (int) $approved->found_posts,
		'fresh_approved'  => (int) $fresh->found_posts,
	);
}

function justice_theme_lawyer_public_recommendations( int $lawyer_id, int $limit = 3 ): array {
	if ( ! post_type_exists( 'justice_recommendation' ) || ! $lawyer_id ) {
		return array();
	}

	$recommendations = new WP_Query(
		array(
			'post_type'           => 'justice_recommendation',
			'post_status'         => 'publish',
			'posts_per_page'      => max( 1, min( 6, $limit ) ),
			'orderby'             => 'date',
			'order'               => 'DESC',
			'ignore_sticky_posts' => true,
			'meta_query'          => justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id ),
		)
	);

	if ( ! $recommendations->have_posts() ) {
		return array();
	}

	$items = array();
	foreach ( $recommendations->posts as $recommendation ) {
		$quote = trim( wp_strip_all_tags( (string) $recommendation->post_content ) );
		if ( '' === $quote ) {
			continue;
		}

		$source_type = (string) get_post_meta( $recommendation->ID, 'recommendation_source_type', true );

		$items[] = array(
			'id'            => (int) $recommendation->ID,
			'quote'         => $quote,
			'client_name'   => (string) get_post_meta( $recommendation->ID, 'client_display_name', true ),
			'relationship'  => (string) get_post_meta( $recommendation->ID, 'client_relationship', true ),
			'rating'        => (int) get_post_meta( $recommendation->ID, 'recommendation_rating', true ),
			'received_at'   => (string) get_post_meta( $recommendation->ID, 'recommendation_received_at', true ),
			'source_type'   => $source_type,
			'verified'      => 'verified_client' === $source_type || '1' === (string) get_post_meta( $recommendation->ID, 'review_verified_client', true ),
			'case_area'     => (string) get_post_meta( $recommendation->ID, 'reviewed_case_area', true ),
		);
	}

	return $items;
}

function justice_theme_recommendation_columns( array $columns ): array {
	$columns['recommended_lawyer'] = __( 'Lawyer', 'justice-theme' );
	$columns['moderation']         = __( 'Moderation', 'justice-theme' );
	$columns['permission']         = __( 'Permission', 'justice-theme' );
	$columns['received_at']        = __( 'Received', 'justice-theme' );
	return $columns;
}
add_filter( 'manage_justice_recommendation_posts_columns', 'justice_theme_recommendation_columns' );

function justice_theme_render_recommendation_columns( string $column, int $post_id ): void {
	if ( 'recommended_lawyer' === $column ) {
		$lawyer_id = (int) get_post_meta( $post_id, 'recommended_lawyer_id', true );
		echo esc_html( $lawyer_id ? get_the_title( $lawyer_id ) : '-' );
	}

	if ( 'moderation' === $column ) {
		$moderation = (string) get_post_meta( $post_id, 'recommendation_moderation', true );
		echo esc_html( $moderation ?: 'draft_review' );
	}

	if ( 'permission' === $column ) {
		$permission = (string) get_post_meta( $post_id, 'recommendation_permission', true );
		echo esc_html( $permission ?: 'unknown' );
	}

	if ( 'received_at' === $column ) {
		echo esc_html( (string) get_post_meta( $post_id, 'recommendation_received_at', true ) ?: '-' );
	}
}
add_action( 'manage_justice_recommendation_posts_custom_column', 'justice_theme_render_recommendation_columns', 10, 2 );

