<?php
/** Short-lived proof of a stored public enquiry, never a delivery/qualification claim. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function justice_ops_intake_receipt_cookie(): string { return 'justice_intake_receipt_v1'; }

/** A host-only, HttpOnly cookie is sent only to the receipt endpoint, never to analytics. */
function justice_ops_intake_receipt_cookie_options( int $expires ): array {
	return array(
		'expires' => $expires,
		'path' => (string) wp_parse_url( admin_url( 'admin-ajax.php' ), PHP_URL_PATH ),
		'secure' => true, 'httponly' => true, 'samesite' => 'Strict',
	);
}

function justice_ops_intake_clear_receipt(): void {
	if ( ! headers_sent() ) {
		setcookie( justice_ops_intake_receipt_cookie(), '', justice_ops_intake_receipt_cookie_options( time() - 3600 ) );
	}
}

function justice_ops_intake_receipt_origin( string $url ): string {
	$parts = wp_parse_url( $url );
	if ( ! is_array( $parts ) || empty( $parts['scheme'] ) || empty( $parts['host'] ) || isset( $parts['user'] ) || isset( $parts['pass'] ) ) { return ''; }
	return strtolower( $parts['scheme'] . '://' . $parts['host'] ) . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
}

function justice_ops_intake_receipt_stored( int $id ): bool {
	return $id > 0 && 'justice_lead' === get_post_type( $id ) && 'publish' === get_post_status( $id )
		&& 'stored' === get_post_meta( $id, 'lead_storage_status', true )
		&& '0' === get_post_meta( $id, 'lead_is_test', true );
}

/** Analytics failure must never prevent storage, routing or the existing success return. */
function justice_ops_intake_issue_receipt( int $id, string $source ): bool {
	if ( headers_sent() || ! is_ssl() || ! justice_ops_intake_receipt_stored( $id )
		|| justice_ops_intake_receipt_origin( $source ) !== justice_ops_intake_receipt_origin( home_url( '/' ) ) ) { return false; }
	try { $token = bin2hex( random_bytes( 32 ) ); } catch ( Exception $error ) { return false; }
	$key = 'justice_receipt_' . hash( 'sha256', $token );
	$expires = time() + 600;
	$receipt = array( 'lead' => $id, 'path' => wp_parse_url( $source, PHP_URL_PATH ) ?: '/', 'expires' => $expires );
	if ( ! set_transient( $key, $receipt, 600 ) ) { return false; }
	if ( ! setcookie( justice_ops_intake_receipt_cookie(), $token, justice_ops_intake_receipt_cookie_options( $expires ) ) ) {
		delete_transient( $key ); return false;
	}
	return true;
}

/** Pure request boundary apart from the atomic claim; no contacts, case text or identifiers returned. */
function justice_ops_intake_confirm_receipt( array $server, array $cookies, array $input ): array {
	$no = array( 'stored' => false, 'fresh' => false, 'version' => 1 );
	$origin = $server['HTTP_ORIGIN'] ?? '';
	$header = $server['HTTP_X_JUSTICE_RECEIPT'] ?? '';
	if ( 'POST' !== ( $server['REQUEST_METHOD'] ?? '' ) || ! is_string( $origin ) || '1' !== $header
		|| $origin !== justice_ops_intake_receipt_origin( home_url( '/' ) ) ) { return $no; }
	$token = $cookies[ justice_ops_intake_receipt_cookie() ] ?? '';
	$path = $input['return_path'] ?? '';
	if ( ! is_string( $token ) || ! preg_match( '/\A[a-f0-9]{64}\z/', $token ) || ! is_string( $path ) ) { return $no; }
	$hash = hash( 'sha256', $token );
	$receipt = get_transient( 'justice_receipt_' . $hash );
	if ( ! is_array( $receipt ) || (int) ( $receipt['expires'] ?? 0 ) <= time()
		|| ( $receipt['path'] ?? '' ) !== wp_unslash( $path )
		|| ! justice_ops_intake_receipt_stored( (int) ( $receipt['lead'] ?? 0 ) ) ) { return $no; }

	// add_option uses the unique option_name key. Unlike get/delete_transient,
	// two concurrent consumers cannot both successfully add this constant value.
	$claim = 'justice_receipt_claim_' . $hash;
	$fresh = add_option( $claim, '1', '', false );
	if ( $fresh ) {
		wp_schedule_single_event( (int) $receipt['expires'] + 60, 'justice_intake_receipt_cleanup', array( $hash ) );
	}
	return array( 'stored' => true, 'fresh' => $fresh, 'version' => 1 );
}

/** Keep refresh confirmation usable until expiry without counting it again. */
function justice_ops_intake_receipt_cleanup( string $hash ): void {
	if ( ! preg_match( '/\A[a-f0-9]{64}\z/', $hash ) ) { return; }
	$receipt = get_transient( 'justice_receipt_' . $hash );
	// Never remove a live claim even if a job is invoked early.
	if ( is_array( $receipt ) && (int) ( $receipt['expires'] ?? 0 ) > time() ) { return; }
	delete_option( 'justice_receipt_claim_' . $hash );
	delete_transient( 'justice_receipt_' . $hash );
}
add_action( 'justice_intake_receipt_cleanup', 'justice_ops_intake_receipt_cleanup' );

function justice_ops_intake_receipt_ajax(): void {
	nocache_headers();
	header( 'Cache-Control: no-store, private, max-age=0' );
	wp_send_json( justice_ops_intake_confirm_receipt( $_SERVER, $_COOKIE, $_POST ) );
}
add_action( 'wp_ajax_justice_intake_receipt', 'justice_ops_intake_receipt_ajax' );
add_action( 'wp_ajax_nopriv_justice_intake_receipt', 'justice_ops_intake_receipt_ajax' );
