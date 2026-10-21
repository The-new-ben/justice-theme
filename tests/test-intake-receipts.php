<?php
declare(strict_types=1);
define( 'ABSPATH', __DIR__ );
$checks = 0; $transients = array(); $options = array(); $jobs = array(); $hooks = array();
$lead = array( 'type' => 'justice_lead', 'status' => 'publish', 'lead_storage_status' => 'stored', 'lead_is_test' => '0' );
function add_action( $hook, $fn ) { $GLOBALS['hooks'][$hook] = $fn; }
function wp_parse_url( $url, $part = -1 ) { return parse_url( $url, $part ); }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function admin_url( $path ) { return 'https://jus-tice.co.il/wp-admin/' . $path; }
function is_ssl() { return $GLOBALS['ssl'] ?? true; }
function wp_unslash( $value ) { return stripslashes( $value ); }
function get_post_type( $id ) { return $id === 7 ? $GLOBALS['lead']['type'] : ''; }
function get_post_status( $id ) { return $id === 7 ? $GLOBALS['lead']['status'] : ''; }
function get_post_meta( $id, $key, $single ) { return $id === 7 ? ( $GLOBALS['lead'][$key] ?? '' ) : ''; }
function set_transient( $key, $value, $ttl ) {
	if ( ! empty( $GLOBALS['storage_fail'] ) ) { return false; }
	$GLOBALS['transients'][$key] = $value; $GLOBALS['ttl'] = $ttl; return true;
}
function get_transient( $key ) { return $GLOBALS['transients'][$key] ?? false; }
function delete_transient( $key ) { unset( $GLOBALS['transients'][$key] ); }
function add_option( $key, $value, $deprecated, $autoload ) {
	$GLOBALS['last_autoload'] = $autoload;
	if ( array_key_exists( $key, $GLOBALS['options'] ) || ! empty( $GLOBALS['claim_failure'] ) ) { return false; }
	$GLOBALS['options'][$key] = $value; return true;
}
function delete_option( $key ) { unset( $GLOBALS['options'][$key] ); }
function wp_schedule_single_event( $time, $hook, $args ) { $GLOBALS['jobs'][] = compact( 'time', 'hook', 'args' ); }
function check_receipt( $condition, $label ) {
	if ( ! $condition ) { throw new RuntimeException( $label ); }
	$GLOBALS['checks']++;
}
require dirname( __DIR__ ) . '/justice-ops/intake-receipts.php';

$cookie = justice_ops_intake_receipt_cookie_options( time() + 600 );
check_receipt( $cookie['secure'] && $cookie['httponly'] && 'Strict' === $cookie['samesite'], 'Secure/HttpOnly/Strict cookie flags' );
check_receipt( '/wp-admin/admin-ajax.php' === $cookie['path'] && ! isset( $cookie['domain'] ), 'Host-only cookie limited to endpoint' );
check_receipt( justice_ops_intake_issue_receipt( 7, home_url( '/criminal-defense-attorney/?case=PRIVATE#private' ) ), 'Stored non-test lead gets short-lived proof' );
$issued = end( $transients );
check_receipt( $issued['path'] === '/criminal-defense-attorney/' && array_keys( $issued ) === array( 'lead', 'path', 'expires' ), 'Receipt retains only ID, public path and expiry on server' );
check_receipt( 600 === $ttl && $issued['expires'] <= time() + 600, 'Receipt expires after ten minutes' );
check_receipt( ! justice_ops_intake_issue_receipt( 7, 'https://example.com/' ), 'Foreign return origin cannot receive proof' );
$ssl = false; check_receipt( ! justice_ops_intake_issue_receipt( 7, home_url( '/' ) ), 'No insecure transport proof' ); $ssl = true;
$storage_fail = true; check_receipt( ! justice_ops_intake_issue_receipt( 7, home_url( '/' ) ), 'Receipt store failure is non-fatal false' ); $storage_fail = false;
foreach ( array( 'lead_is_test' => '1', 'lead_storage_status' => 'pending', 'status' => 'draft', 'type' => 'post' ) as $field => $value ) {
	$before = $lead[$field]; $lead[$field] = $value;
	check_receipt( ! justice_ops_intake_issue_receipt( 7, home_url( '/' ) ), 'No proof for ' . $field ); $lead[$field] = $before;
}
$token = str_repeat( 'a', 64 ); $hash = hash( 'sha256', $token );
$transients['justice_receipt_' . $hash] = array( 'lead' => 7, 'path' => '/criminal-defense-attorney/', 'expires' => time() + 600 );
$server = array( 'REQUEST_METHOD' => 'POST', 'HTTP_ORIGIN' => 'https://jus-tice.co.il', 'HTTP_X_JUSTICE_RECEIPT' => '1' );
$cookies = array( justice_ops_intake_receipt_cookie() => $token );
$input = array( 'return_path' => '/criminal-defense-attorney/' );
$no = array( 'stored' => false, 'fresh' => false, 'version' => 1 );
foreach ( array( 'REQUEST_METHOD' => 'GET', 'HTTP_ORIGIN' => 'https://example.com', 'HTTP_X_JUSTICE_RECEIPT' => '' ) as $field => $value ) {
	$bad = array_merge( $server, array( $field => $value ) );
	check_receipt( $no === justice_ops_intake_confirm_receipt( $bad, $cookies, $input ), 'Reject invalid boundary ' . $field );
}
foreach ( array( '', 'not-a-token', str_repeat( 'b', 64 ), array( 'bad' ) ) as $bad_token ) {
	check_receipt( $no === justice_ops_intake_confirm_receipt( $server, array( justice_ops_intake_receipt_cookie() => $bad_token ), $input ), 'Reject absent, malformed, unknown or array token' );
}
foreach ( array( '/other/', '/criminal-defense-attorney/?case=PRIVATE', array( 'bad' ) ) as $bad_path ) {
	check_receipt( $no === justice_ops_intake_confirm_receipt( $server, $cookies, array( 'return_path' => $bad_path ) ), 'Cannot claim from another path or malformed path' );
}
check_receipt( ! $options, 'Invalid consumers never reserve a claim' );
foreach ( array( 'lead_is_test' => '1', 'lead_storage_status' => 'incomplete', 'status' => 'trash', 'type' => 'post' ) as $field => $value ) {
	$before = $lead[$field]; $lead[$field] = $value;
	check_receipt( $no === justice_ops_intake_confirm_receipt( $server, $cookies, $input ), 'Recheck current stored state: ' . $field ); $lead[$field] = $before;
}
$first = justice_ops_intake_confirm_receipt( $server, $cookies, $input );
check_receipt( array( 'stored'=>true, 'fresh'=>true, 'version'=>1 ) === $first, 'First confirmed consumption counts' );
check_receipt( false === $last_autoload && '1' === $options['justice_receipt_claim_' . $hash], 'Claim has constant value and is not autoloaded' );
check_receipt( array( 'stored'=>true, 'fresh'=>false, 'version'=>1 ) === justice_ops_intake_confirm_receipt( $server, $cookies, $input ), 'Refresh does not count again, but still confirms storage' );
check_receipt( 1 === count( $jobs ) && $jobs[0]['args'] === array( $hash ), 'One bounded cleanup, no identifier in job args' );
check_receipt( array_keys( $first ) === array( 'stored','fresh','version' ), 'No contact, case, source, lead ID or token in response' );
justice_ops_intake_receipt_cleanup( $hash );
check_receipt( isset( $options['justice_receipt_claim_' . $hash] ), 'Early cleanup cannot reopen live claim' );
$transients['justice_receipt_' . $hash]['expires'] = time() - 1;
check_receipt( $no === justice_ops_intake_confirm_receipt( $server, $cookies, $input ), 'Expired proof rejected independently of cache expiry' );
justice_ops_intake_receipt_cleanup( $hash );
check_receipt( ! isset( $options['justice_receipt_claim_' . $hash], $transients['justice_receipt_' . $hash] ), 'Expired claim and mapping cleaned' );
$transients['justice_receipt_' . $hash] = array( 'lead' => 7, 'path' => $input['return_path'], 'expires' => time() + 600 );
$claim_failure = true;
check_receipt( array( 'stored'=>true, 'fresh'=>false, 'version'=>1 ) === justice_ops_intake_confirm_receipt( $server, $cookies, $input ), 'Claim failure cannot fabricate a fresh event' );
check_receipt( isset( $hooks['wp_ajax_justice_intake_receipt'], $hooks['wp_ajax_nopriv_justice_intake_receipt'] ), 'Same contract for logged-in and anonymous visitors' );
justice_ops_intake_clear_receipt();
echo "PASS: {$checks} receipt assertions. WordPress API fixtures; no real leads or analytics sent.\n";
