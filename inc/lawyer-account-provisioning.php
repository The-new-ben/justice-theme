<?php
/**
 * Lawyer self-serve account provisioning + magic-link login.
 *
 * When a lawyer submits the public registration form we:
 *   1. Create a WP user with role `justice_lawyer_member` (using their email).
 *   2. Link that user to the freshly-created justice_lawyer draft profile
 *      via `claimed_by_user_id` post meta.
 *   3. Email a one-time magic-login URL so they land already-authenticated
 *      on `/lawyer-dashboard/` without setting a password.
 *
 * The magic-link is a short signed token stored hashed in user meta with an
 * expiry. The login endpoint validates, logs the user in, and deletes the
 * token (one-shot). If the lawyer prefers, they can also use the normal
 * `wp_login_url()` flow with a password reset.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const JUSTICE_LAWYER_ROLE          = 'justice_lawyer_member';
const JUSTICE_MAGIC_LINK_META      = '_justice_magic_link_hash';
const JUSTICE_MAGIC_LINK_EXP_META  = '_justice_magic_link_expires';
const JUSTICE_MAGIC_LINK_TTL_SECS  = 7 * DAY_IN_SECONDS;

/**
 * Create the `justice_lawyer_member` role once (idempotent).
 * Capabilities are intentionally minimal — read for dashboard access,
 * no posting/editing of public CPTs. Lawyers interact through the
 * dashboard forms which use admin-post.php, not direct edit caps.
 */
function justice_theme_register_lawyer_role(): void {
	if ( get_role( JUSTICE_LAWYER_ROLE ) ) {
		return;
	}

	add_role(
		JUSTICE_LAWYER_ROLE,
		__( 'Jus-Tice Lawyer', 'justice-theme' ),
		array(
			'read' => true,
		)
	);
}
add_action( 'init', 'justice_theme_register_lawyer_role' );

/**
 * Public API: provision (or fetch) a WP user for a lawyer email and link them
 * to a justice_lawyer profile. Returns the user id, or 0 on failure.
 *
 * Idempotent: if a user with this email already exists we reuse it.
 */
function justice_theme_provision_lawyer_user( string $email, string $display_name, int $profile_id ): int {
	$email = sanitize_email( $email );
	if ( ! is_email( $email ) || ! $profile_id ) {
		return 0;
	}

	$user = get_user_by( 'email', $email );

	if ( ! $user ) {
		$base_username = sanitize_user( current( explode( '@', $email ) ), true );
		if ( '' === $base_username ) {
			$base_username = 'lawyer';
		}
		$username = $base_username;
		$suffix   = 1;
		while ( username_exists( $username ) ) {
			$username = $base_username . '-' . $suffix;
			$suffix++;
			if ( $suffix > 50 ) {
				$username = $base_username . '-' . wp_generate_password( 5, false, false );
				break;
			}
		}

		$user_id = wp_insert_user( array(
			'user_login'   => $username,
			'user_email'   => $email,
			'user_pass'    => wp_generate_password( 24, true, true ),
			'display_name' => $display_name ?: $username,
			'role'         => JUSTICE_LAWYER_ROLE,
		) );

		if ( is_wp_error( $user_id ) || ! $user_id ) {
			return 0;
		}
		$user = get_user_by( 'id', $user_id );
	} else {
		// Existing user: make sure they at least have the lawyer role.
		if ( $user && ! in_array( JUSTICE_LAWYER_ROLE, (array) $user->roles, true ) ) {
			$user->add_role( JUSTICE_LAWYER_ROLE );
		}
	}

	if ( ! $user ) {
		return 0;
	}

	// Link user ↔ profile. Do not overwrite an existing claim by a different
	// user — that would silently steal the profile.
	$existing_claim = (int) get_post_meta( $profile_id, 'claimed_by_user_id', true );
	if ( 0 === $existing_claim ) {
		update_post_meta( $profile_id, 'claimed_by_user_id', (int) $user->ID );
	}

	return (int) $user->ID;
}

/**
 * Issue a fresh magic-link token for a user. Stores the hash + expiry in
 * user meta and returns the plain token (only known once, like a password).
 */
function justice_theme_issue_magic_link_token( int $user_id ): string {
	if ( $user_id <= 0 ) {
		return '';
	}

	$token = bin2hex( random_bytes( 32 ) );
	$hash  = wp_hash_password( $token );

	update_user_meta( $user_id, JUSTICE_MAGIC_LINK_META, $hash );
	update_user_meta( $user_id, JUSTICE_MAGIC_LINK_EXP_META, time() + JUSTICE_MAGIC_LINK_TTL_SECS );

	return $token;
}

/**
 * Build the magic-link URL.
 */
function justice_theme_magic_link_url( int $user_id, string $token ): string {
	return add_query_arg(
		array(
			'justice_magic'   => 1,
			'u'               => $user_id,
			't'               => $token,
		),
		home_url( '/lawyer-dashboard/' )
	);
}

/**
 * Send the welcome email containing the one-shot magic-link.
 *
 * @param int    $user_id
 * @param string $display_name
 * @param string $plan_key      Selected plan_interest (free/pro/featured/...).
 */
function justice_theme_send_magic_link_email( int $user_id, string $display_name, string $plan_key ): bool {
	$user = get_user_by( 'id', $user_id );
	if ( ! $user ) {
		return false;
	}

	$token = justice_theme_issue_magic_link_token( $user_id );
	if ( '' === $token ) {
		return false;
	}

	$url  = justice_theme_magic_link_url( $user_id, $token );
	$site = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );

	$plans      = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();
	$plan_label = isset( $plans[ $plan_key ]['label'] ) ? (string) $plans[ $plan_key ]['label'] : 'פרופיל בסיסי';

	$subject = sprintf( 'ברוכים הבאים ל-%s — קישור כניסה אישי', $site );

	$body = sprintf(
		"שלום %s,\n\n"
		. "תודה שנרשמתם ל-%s.\n\n"
		. "נפתח עבורכם חשבון אישי במערכת, ומסלול ההצטרפות שנבחר: %s.\n\n"
		. "לכניסה לאזור האישי, לחצו על הקישור הבא (תקף ל-7 ימים, חד-פעמי):\n%s\n\n"
		. "באזור האישי תוכלו:\n"
		. "  · לראות את הפרופיל שלכם בטיוטה\n"
		. "  · להשלים תמונה, ביוגרפיה, שירותים, וידאו ושאלות נפוצות\n"
		. "  · לעקוב אחרי לידים, צפיות ופעולות שיפור\n"
		. "  · לעבור למסלול תשלום ולהפעיל את הפרופיל לאחר אישור\n\n"
		. "אם לא נרשמתם, אפשר להתעלם מההודעה — לא תיווצר פעילות עד שמישהו יילחץ על הקישור.\n\n"
		. "בהצלחה,\n"
		. "צוות %s",
		$display_name ?: $user->display_name,
		$site,
		$plan_label,
		$url,
		$site
	);

	$headers = array(
		'Content-Type: text/plain; charset=UTF-8',
		'From: ' . $site . ' <noreply@' . wp_parse_url( home_url(), PHP_URL_HOST ) . '>',
	);

	return wp_mail( $user->user_email, $subject, $body, $headers );
}

/**
 * Verify a magic-link token. Returns the user id on success, 0 on failure.
 * Always consumes the token on a hit (one-shot).
 */
function justice_theme_consume_magic_link_token( int $user_id, string $token ): int {
	if ( $user_id <= 0 || '' === $token ) {
		return 0;
	}

	$hash    = (string) get_user_meta( $user_id, JUSTICE_MAGIC_LINK_META, true );
	$expires = (int) get_user_meta( $user_id, JUSTICE_MAGIC_LINK_EXP_META, true );

	if ( '' === $hash || $expires <= 0 ) {
		return 0;
	}

	if ( time() > $expires ) {
		delete_user_meta( $user_id, JUSTICE_MAGIC_LINK_META );
		delete_user_meta( $user_id, JUSTICE_MAGIC_LINK_EXP_META );
		return 0;
	}

	if ( ! wp_check_password( $token, $hash, $user_id ) ) {
		return 0;
	}

	// One-shot: consume immediately.
	delete_user_meta( $user_id, JUSTICE_MAGIC_LINK_META );
	delete_user_meta( $user_id, JUSTICE_MAGIC_LINK_EXP_META );

	return $user_id;
}

/**
 * Handle ?justice_magic=1&u=&t= on any front-end page. Logs the user in and
 * redirects to /lawyer-dashboard/.
 */
function justice_theme_handle_magic_link_request(): void {
	if ( is_admin() || empty( $_GET['justice_magic'] ) ) {
		return;
	}

	$user_id = isset( $_GET['u'] ) ? absint( $_GET['u'] ) : 0;
	$token   = isset( $_GET['t'] ) ? (string) wp_unslash( $_GET['t'] ) : '';

	// Token shape sanity (hex of 64 chars).
	if ( ! preg_match( '/^[a-f0-9]{32,128}$/i', $token ) ) {
		return;
	}

	$verified = justice_theme_consume_magic_link_token( $user_id, $token );
	if ( ! $verified ) {
		wp_safe_redirect( add_query_arg( 'magic', 'expired', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	if ( is_user_logged_in() ) {
		wp_logout();
	}

	wp_set_current_user( $verified );
	wp_set_auth_cookie( $verified, true );

	wp_safe_redirect( home_url( '/lawyer-dashboard/?welcome=1' ) );
	exit;
}
add_action( 'template_redirect', 'justice_theme_handle_magic_link_request', 1 );

const JUSTICE_MAGIC_RESEND_EMAIL_COOLDOWN = 60;        // seconds — 1 per minute per email
const JUSTICE_MAGIC_RESEND_IP_WINDOW      = 3600;      // seconds — 1 hour
const JUSTICE_MAGIC_RESEND_IP_MAX         = 5;         // max sends per IP per window

function justice_theme_magic_resend_client_ip(): string {
	$ip = '';
	if ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
		$ip = (string) $_SERVER['REMOTE_ADDR'];
	}
	return preg_replace( '/[^0-9a-fA-F:.]/', '', $ip ) ?: 'unknown';
}

/**
 * Lawyers can ask for a new magic link by entering their email on the
 * logged-out dashboard. POST handler with per-email + per-IP throttling.
 *
 * The endpoint deliberately returns the same "we sent it if it exists"
 * response regardless of email validity / throttle outcome, so it does not
 * leak account state to an attacker. Internally the throttle prevents:
 *   - spamming a real lawyer's inbox,
 *   - burning their currently-valid magic-link by issuing a new one each
 *     time the form is hit (the previous token is only replaced AFTER the
 *     throttle check passes).
 */
function justice_theme_handle_magic_link_resend(): void {
	if ( ! isset( $_POST['justice_magic_resend_nonce'] )
		|| ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_magic_resend_nonce'] ) ), 'justice_magic_resend' )
	) {
		wp_safe_redirect( add_query_arg( 'magic', 'invalid', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	if ( ! is_email( $email ) ) {
		wp_safe_redirect( add_query_arg( 'magic', 'invalid', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	$client_ip = justice_theme_magic_resend_client_ip();

	// IP throttle: count attempts in the rolling window.
	$ip_key   = 'justice_magic_ip_' . md5( $client_ip );
	$ip_count = (int) get_transient( $ip_key );
	if ( $ip_count >= JUSTICE_MAGIC_RESEND_IP_MAX ) {
		wp_safe_redirect( add_query_arg( 'magic', 'sent', home_url( '/lawyer-dashboard/' ) ) );
		exit;
	}

	// Email cooldown: refuse if a send went out in the last minute. Always
	// bump the IP counter so brute scans still hit the IP ceiling.
	$email_key       = 'justice_magic_email_' . md5( strtolower( $email ) );
	$email_cooldown  = (bool) get_transient( $email_key );
	$user            = $email_cooldown ? null : get_user_by( 'email', $email );
	$should_send     = ! $email_cooldown
		&& $user
		&& in_array( JUSTICE_LAWYER_ROLE, (array) $user->roles, true );

	if ( $should_send ) {
		justice_theme_send_magic_link_email( (int) $user->ID, (string) $user->display_name, '' );
		set_transient( $email_key, 1, JUSTICE_MAGIC_RESEND_EMAIL_COOLDOWN );
	}

	set_transient( $ip_key, $ip_count + 1, JUSTICE_MAGIC_RESEND_IP_WINDOW );

	wp_safe_redirect( add_query_arg( 'magic', 'sent', home_url( '/lawyer-dashboard/' ) ) );
	exit;
}
add_action( 'admin_post_justice_magic_resend', 'justice_theme_handle_magic_link_resend' );
add_action( 'admin_post_nopriv_justice_magic_resend', 'justice_theme_handle_magic_link_resend' );
