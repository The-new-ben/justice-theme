<?php
declare(strict_types=1);
define( 'ABSPATH', __DIR__ );
class WP_Error {}
class WP_Post {
	public function __construct( public int $ID, public string $post_type, public string $post_status, public string $post_title ) {}
}
class WP_Query {
	public array $posts = array();
	public int $found_posts = 0;
	public function __construct( public array $args ) { $GLOBALS['last_query'] = $args; }
}
class IntakeResponse extends RuntimeException {
	public function __construct( public int $status, public string $target ) { parent::__construct( $target ); }
}
$actions = array();
function add_action( $hook, $callback, $priority = 10, ...$args ) { $GLOBALS['actions'][$hook][$priority][] = $callback; }
function add_filter( ...$args ) {}
function dispatch_fixture_hook( $hook, ...$args ) {
	$priorities = $GLOBALS['actions'][$hook] ?? array(); ksort( $priorities );
	foreach ( $priorities as $callbacks ) { foreach ( $callbacks as $cb ) { $cb( ...$args ); } }
}
function has_action( $hook, $callback ) {
	foreach ( $GLOBALS['actions'][$hook] ?? array() as $priority => $callbacks ) { if ( in_array( $callback, $callbacks, true ) ) { return $priority; } }
	return false;
}
function remove_action( $hook, $callback, $priority = 10 ) { $GLOBALS['actions'][$hook][$priority] = array_filter( $GLOBALS['actions'][$hook][$priority] ?? array(), fn( $cb ) => $cb !== $callback ); }
function current_user_can( $cap ) { return $GLOBALS['fixture']['admin']; }
function wp_verify_nonce( $nonce, $action ) { return 'valid-' . $action === $nonce; }
function wp_unslash( $value ) { return is_string( $value ) ? stripslashes( $value ) : $value; }
function wp_slash( $value ) { return addslashes( $value ); }
function sanitize_text_field( $value ) { return trim( strip_tags( (string) $value ) ); }
function sanitize_textarea_field( $value ) { return sanitize_text_field( $value ); }
function sanitize_key( $value ) { return preg_replace( '/[^a-z0-9_-]/', '', strtolower( $value ) ); }
function sanitize_email( $value ) { return filter_var( $value, FILTER_VALIDATE_EMAIL ) ? $value : ''; }
function absint( $value ) { return abs( (int) $value ); }
function __( $value, ...$args ) { return $value; }
function esc_html__( $value, ...$args ) { return $value; }
function esc_html( $value ) { return htmlspecialchars( (string) $value, ENT_QUOTES ); }
function wp_nonce_field( $action, $name ) { echo '<input name="' . $name . '">'; }
function home_url( $path = '' ) { return 'https://jus-tice.co.il' . $path; }
function wp_get_referer() { return 'https://jus-tice.co.il/criminal-defense-attorney/'; }
function current_time( ...$args ) { return '2026-10-21 10:00:00'; }
function is_wp_error( $value ) { return $value instanceof WP_Error; }
function add_query_arg( $key, $value, $url ) { return $url . '?' . $key . '=' . $value; }
function wp_safe_redirect( $url ) { throw new IntakeResponse( 302, $url ); }
function justice_ops_intake_clear_receipt() { $GLOBALS['receipt_cleared'] = true; }
function justice_ops_intake_issue_receipt( $id, $source ) {
	$GLOBALS['receipt_attempt'] = array( 'id' => $id, 'stored' => get_post_meta( $id, 'lead_storage_status' ), 'source' => $source );
	return false; // A failed measurement receipt must not change successful intake.
}
function wp_die( $message, $title = '', $args = array() ) { throw new IntakeResponse( $args['response'] ?? 500, $message ); }
function get_option( $key, $default = '' ) {
	if ( 'justice_hubspot_token' === $key ) {
		if ( ! empty( $GLOBALS['fixture']['real_hooks'] ) && ! get_post_meta( 1, 'lead_is_test' ) && 'stored' === get_post_meta( 1, 'lead_storage_status' ) ) { return ''; }
		throw new RuntimeException( 'Test/incomplete exclusion must happen before token/API access' );
	}
	return 'admin_email' === $key ? 'owner@example.com' : $default;
}
function wp_insert_post( $post, $wp_error = false ) {
	$GLOBALS['inserts']++;
	if ( $GLOBALS['fixture']['insert_fail'] ) { return $wp_error ? new WP_Error() : 0; }
	$GLOBALS['posts'][1] = $post;
	foreach ( $post['meta_input'] ?? array() as $key => $value ) { update_post_meta( 1, $key, $value ); }
	if ( ! empty( $GLOBALS['fixture']['owner_hold'] ) ) { update_post_meta( 1, 'routing_hold', '1' ); }
	if ( ! empty( $GLOBALS['fixture']['real_hooks'] ) ) { dispatch_fixture_hook( 'save_post_justice_lead', 1, get_post( 1 ), false ); }
	return 1;
}
function wp_update_post( $post, $wp_error = false ) {
	if ( $GLOBALS['fixture']['publish_fail'] ) { return new WP_Error(); }
	$GLOBALS['posts'][$post['ID']] = array_merge( $GLOBALS['posts'][$post['ID']], $post );
	if ( ! empty( $GLOBALS['fixture']['real_hooks'] ) ) { dispatch_fixture_hook( 'save_post_justice_lead', $post['ID'], get_post( $post['ID'] ), true ); }
	return $post['ID'];
}
function get_post_status( $id ) { return $GLOBALS['posts'][$id]['post_status'] ?? ''; }
function get_post_type( $id ) { return $GLOBALS['posts'][$id]['post_type'] ?? ''; }
function get_post( $id ) { $p = $GLOBALS['posts'][$id]; return new WP_Post( $id, $p['post_type'], $p['post_status'], $p['post_title'] ); }
function wp_is_post_revision( $id ) { return false; }
function wp_strip_all_tags( $v ) { return strip_tags( $v ); }
function post_type_exists( $type ) { return true; }
function taxonomy_exists( $type ) { return true; }
function is_email( $email ) { return filter_var( $email, FILTER_VALIDATE_EMAIL ); }
function get_the_title( $id ) { return 'Fixture lawyer ' . $id; }
function wp_date( ...$args ) { return '2026-10-21 10:00'; }
function wp_hash( $v ) { return md5( $v ); }
function rest_url( $path ) { return 'https://example.com/' . $path; }
function justice_cards_family_map() { return array( 'criminal-law' => array( 'criminal-law' ) ); }
function justice_cards_lawyers( ...$args ) { return empty( $GLOBALS['fixture']['no_capacity'] ) ? array( (object) array( 'ID' => 777 ) ) : array(); }
function justice_ai_chat( ...$args ) { return ''; }
function get_post_meta( $id, $key, $single = true ) { return $GLOBALS['meta'][$id][$key] ?? ''; }
function delete_post_meta( $id, $key, $value = '' ) {
	if ( get_post_meta( $id, $key ) !== $value ) { return false; }
	unset( $GLOBALS['meta'][$id][$key] ); return true;
}
function update_post_meta( $id, $key, $value ) {
	if ( $GLOBALS['fixture']['meta_fail'] === $key ) { return false; }
	$exists = array_key_exists( $key, $GLOBALS['meta'][$id] ?? array() );
	$clean = is_string( $value ) ? stripslashes( $value ) : $value;
	if ( $exists && get_post_meta( $id, $key ) === $clean ) { return false; }
	$GLOBALS['meta'][$id][$key] = is_string( $value ) ? stripslashes( $value ) : $value;
	if ( ! empty( $GLOBALS['fixture']['real_hooks'] ) ) {
		dispatch_fixture_hook( $exists ? 'updated_post_meta' : 'added_post_meta', 1, $id, $key, $clean );
		return true;
	}
	if ( 'lead_status' === $key && 'new' === $value ) {
		$GLOBALS['at_route'][] = $GLOBALS['meta'][$id];
		// Simulate the existing router's writes to catch any later overwrite.
		$GLOBALS['meta'][$id]['assigned_lawyer_id'] = '777';
		$GLOBALS['meta'][$id]['qualified_lead_billing_status'] = 'routed_pending_qualification';
	}
	return true;
}
function wp_mail( $to, $subject, $body, ...$args ) {
	$GLOBALS['mails'][] = array( $to, $subject, $body, $GLOBALS['meta'][1] ?? array(), get_post_status( 1 ) );
	return $GLOBALS['fixture']['mail_ok'];
}
function fixture( array $changes = array() ): void {
	$GLOBALS['fixture'] = array_merge( array( 'admin' => false, 'insert_fail' => false, 'publish_fail' => false, 'meta_fail' => '', 'mail_ok' => true ), $changes );
	foreach ( array( 'posts', 'meta', 'mails', 'at_route' ) as $key ) { $GLOBALS[$key] = array(); }
	$GLOBALS['inserts'] = 0;
	$GLOBALS['receipt_cleared'] = false;
	$GLOBALS['receipt_attempt'] = null;
	$_GET = array();
	$_POST = array(
		'justice_lead_nonce' => 'valid-justice_submit_lead', 'lead_name' => 'Synthetic check',
		'lead_phone' => '0000000000', 'lead_email' => '', 'lead_area' => 'criminal-law',
		'lead_city' => '', 'lead_message' => wp_slash( "Synthetic O'Brien \\ sample" ), 'lead_consent' => '1',
		'utm_content' => 'case_review', 'product_intent' => 'case_review',
	);
}
function run_intake( string $handler = 'justice_ops_handle_public_intake' ): IntakeResponse {
	try { $handler(); } catch ( IntakeResponse $result ) { return $result; }
	throw new RuntimeException( 'Handler did not terminate with a response' );
}
$passed = 0;
function check_intake( $condition, $label ): void {
	if ( ! $condition ) { throw new RuntimeException( $label ); }
	$GLOBALS['passed']++;
	echo "PASS: $label\n";
}
require dirname( __DIR__ ) . '/ultra-justice-engine/includes/lead-submissions.php';
require dirname( __DIR__ ) . '/justice-ops/lead-intake.php';

if ( in_array( '--legacy', $argv, true ) ) {
	fixture( array( 'insert_fail' => true ) );
	$r = run_intake( 'uje_handle_lead' );
	check_intake( 503 === $r->status && ! str_contains( $r->target, 'success' ), 'Legacy must not report storage failure as success (expected RED)' );
	exit;
}

fixture();
add_action( 'admin_post_justice_submit_lead', 'spam_guard', 0 );
justice_ops_register_public_intake();
check_intake( false === has_action( 'admin_post_justice_submit_lead', 'uje_handle_lead' ), 'Old authenticated handler removed' );
check_intake( false === has_action( 'admin_post_nopriv_justice_submit_lead', 'uje_handle_lead' ), 'Old anonymous handler removed' );
check_intake( 10 === has_action( 'admin_post_nopriv_justice_submit_lead', 'justice_ops_handle_public_intake' ), 'Anonymous request uses reliable handler' );
check_intake( 0 === has_action( 'admin_post_justice_submit_lead', 'spam_guard' ), 'Existing spam guard retained' );
justice_ops_register_public_intake();
check_intake( 1 === count( $actions['admin_post_justice_submit_lead'][10] ), 'Handler installation is idempotent' );

fixture( array( 'insert_fail' => true ) ); $r = run_intake();
check_intake( 503 === $r->status && ! str_contains( $r->target, 'success' ), 'Insert failure cannot report success' );
check_intake( ! $mails && ! $at_route, 'Insert failure sends no mail or commercial routing' );
check_intake( $receipt_cleared && null === $receipt_attempt, 'Failed new intake clears old proof and cannot issue fresh proof' );
fixture( array( 'meta_fail' => 'visitor_phone' ) ); $r = run_intake();
check_intake( 503 === $r->status && 'draft' === get_post_status( 1 ), 'Partial metadata remains a draft and reports failure' );
check_intake( ! $mails && ! $at_route && 'incomplete' === get_post_meta( 1, 'lead_storage_status' ), 'Partial storage cannot trigger notifications or routing' );
fixture( array( 'publish_fail' => true ) ); $r = run_intake();
check_intake( 503 === $r->status && ! $mails && ! $at_route, 'Publish failure is not a successful enquiry' );

fixture(); $r = run_intake();
check_intake( 302 === $r->status && str_ends_with( $r->target, 'lead=success' ), 'Verified storage keeps the existing success return path' );
check_intake( $receipt_cleared && 'stored' === $receipt_attempt['stored'] && 1 === $receipt_attempt['id'], 'Receipt is attempted only after committed storage, and its failure does not block intake' );
check_intake( 'stored' === get_post_meta( 1, 'lead_storage_status' ) && 'publish' === get_post_status( 1 ), 'Success has persisted metadata and a published CRM record' );
check_intake( "Synthetic O'Brien \\ sample" === get_post_meta( 1, 'message' ), 'Apostrophes and backslashes survive metadata storage' );
check_intake( '1' === $at_route[0]['consent'] && 'case_review' === $at_route[0]['utm_content'], 'Consent and attribution exist before routing starts' );
check_intake( 'case_review' === get_post_meta( 1, 'product_intent' ), 'Hadmaya product context persists' );
check_intake( '777' === get_post_meta( 1, 'assigned_lawyer_id' ), 'Handler never overwrites router assignment' );
check_intake( 'routed_pending_qualification' === get_post_meta( 1, 'qualified_lead_billing_status' ), 'Handler never overwrites router billing trail' );
check_intake( 'accepted_for_sending' === get_post_meta( 1, 'lead_owner_mail_status' ), 'Mail acceptance is recorded without claiming inbox delivery' );
fixture(); $_POST['lead_consent'] = 'on'; $r = run_intake();
check_intake( 302 === $r->status && '1' === get_post_meta( 1, 'consent' ), 'Native checkbox value from lawyer-profile forms remains accepted' );
fixture( array( 'mail_ok' => false ) ); $r = run_intake();
check_intake( 302 === $r->status && 'failed' === get_post_meta( 1, 'lead_owner_mail_status' ), 'Mail failure is visible internally while saved enquiry remains valid' );

fixture(); $_POST['justice_lead_nonce'] = 'bad'; $r = run_intake();
check_intake( 403 === $r->status && 0 === $inserts, 'Invalid form nonce cannot create a lead' );
fixture(); $_POST['lead_name'] = array( 'bad' ); $r = run_intake();
check_intake( 400 === $r->status && 0 === $inserts, 'Malformed required field fails safely' );
fixture(); $_POST['lead_consent'] = '0'; $r = run_intake();
check_intake( 302 === $r->status && '0' === get_post_meta( 1, 'consent' ), 'Unchecked value is never recorded as explicit consent' );
fixture(); unset( $_POST['lead_consent'] ); $r = run_intake();
check_intake( 302 === $r->status && 'missing_site_form_consent' === get_post_meta( 1, 'consent_status' ), 'Legacy generator forms without checkbox remain accepted without inventing consent' );
fixture(); $_POST['justice_intake_test'] = '1'; $_POST['justice_intake_test_nonce'] = 'valid-justice_intake_test'; $r = run_intake();
check_intake( 403 === $r->status && 0 === $inserts, 'Anonymous visitor cannot activate the private test mode' );
fixture( array( 'admin' => true ) ); $_POST['justice_intake_test'] = '1'; $r = run_intake();
check_intake( 403 === $r->status && 0 === $inserts, 'Administrator still needs the separate test nonce' );
fixture( array( 'admin' => true ) ); $_POST['justice_intake_test'] = '1'; $_POST['justice_intake_test_nonce'] = 'valid-justice_intake_test'; $r = run_intake();
check_intake( 302 === $r->status && '1' === get_post_meta( 1, 'lead_is_test' ), 'Authorized synthetic enquiry is saved and labelled' );
check_intake( ! $at_route && 'closed' === get_post_meta( 1, 'lead_status' ), 'Synthetic enquiry never raises the new-lead routing hook' );
check_intake( '1' === get_post_meta( 1, 'routing_hold' ) && 'test_excluded' === get_post_meta( 1, 'qualified_lead_billing_status' ), 'Synthetic enquiry is held and excluded from billing' );
check_intake( 1 === count( $mails ) && 'owner@example.com' === $mails[0][0] && str_contains( $mails[0][1], 'לא ליד' ), 'Test notification goes only to the existing owner address and is labelled' );
require dirname( __DIR__ ) . '/justice-ops/lead-router.php';
require dirname( __DIR__ ) . '/justice-ops/hubspot-sync.php';
check_intake( false === justice_router_route_lead( 1 )['ok'], 'Manual router invocation also excludes a synthetic lead' );
check_intake( false === justice_hubspot_sync_lead( 1 )['ok'], 'HubSpot/backfill excludes a synthetic lead before token access' );
justice_hubspot_backfill();
check_intake( 'AND' === $last_query['meta_query']['relation'] && 'NOT EXISTS' === $last_query['meta_query'][0]['compare'], 'Backfill retains missing-deal selection with combined exclusions' );
check_intake( 'lead_is_test' === $last_query['meta_query'][1][0]['key'] && array( '', '0' ) === $last_query['meta_query'][1][1]['value'], 'Backfill excludes synthetic rows before applying its batch limit' );
check_intake( 'lead_storage_status' === $last_query['meta_query'][2][0]['key'] && array( 'pending', 'incomplete' ) === $last_query['meta_query'][2][1]['value'] && 'NOT IN' === $last_query['meta_query'][2][1]['compare'], 'Backfill excludes pending/incomplete rows before applying its batch limit' );

fixture(); $_GET['lead_test'] = '1'; ob_start(); justice_ops_intake_form_context(); $html = ob_get_clean();
check_intake( '' === $html, 'Anonymous page never exposes test fields' );
$fixture['admin'] = true; ob_start(); justice_ops_intake_form_context(); $html = ob_get_clean();
check_intake( str_contains( $html, 'justice_intake_test_nonce' ), 'Administrator test page contains the dedicated nonce field' );
$_GET = array( 'lead' => 'success' ); ob_start(); justice_ops_intake_form_context(); $html = ob_get_clean();
check_intake( str_contains( $html, 'data-intake-receipt-notice' ) && ! str_contains( $html, 'נשמרה' ) && ! str_contains( $html, 'נשלחה לעורך דין' ), 'Success URL alone makes no storage/delivery claim; client needs server proof' );

// Real theme classifier + routing and Ops hooks, dispatched in WordPress order.
// This catches routes nested inside wp_insert_post or a metadata write.
require dirname( __DIR__ ) . '/inc/lead-classifier.php';
require dirname( __DIR__ ) . '/inc/lead-routing.php';
function lifecycle_fixture( array $changes = array() ): void {
	fixture( array_merge( array( 'real_hooks' => true ), $changes ) );
	$GLOBALS['meta'][777]['email'] = 'lawyer@example.com';
	$GLOBALS['meta'][888]['email'] = 'profile@example.com';
}
foreach ( array( 'routing_hold', 'lead_is_test', 'lead_storage_status', 'visitor_phone', 'message', 'utm_content', 'assigned_lawyer_id' ) as $field ) {
	lifecycle_fixture( array( 'meta_fail' => $field ) ); $r = run_intake();
	check_intake( 503 === $r->status && ! $mails && ! get_post_meta( 1, 'routing_completed' ), 'Real hooks cannot notify/bill on failed field: ' . $field );
}
lifecycle_fixture( array( 'publish_fail' => true ) ); $r = run_intake();
check_intake( 503 === $r->status && ! $mails, 'Real classifier/meta hooks cannot notify before publish succeeds' );
lifecycle_fixture( array( 'admin' => true ) ); $_POST['justice_intake_test'] = '1'; $_POST['justice_intake_test_nonce'] = 'valid-justice_intake_test'; $r = run_intake();
check_intake( 302 === $r->status && 1 === count( $mails ) && 'owner@example.com' === $mails[0][0], 'Real hooks send synthetic notification only to owner' );
check_intake( ! get_post_meta( 1, 'routing_completed' ) && ! get_post_meta( 1, 'lead_routed_at' ) && 'test_excluded' === get_post_meta( 1, 'qualified_lead_billing_status' ), 'Real hooks leave synthetic record unassigned/unbilled' );
lifecycle_fixture(); $r = run_intake();
$lawyer_mails = array_values( array_filter( $mails, fn( $m ) => 'lawyer@example.com' === $m[0] ) );
check_intake( 302 === $r->status && 1 === count( $lawyer_mails ), 'Generic intake uses Ops once, with no duplicate theme notification' );
check_intake( 'stored' === $lawyer_mails[0][3]['lead_storage_status'] && '1' === $lawyer_mails[0][3]['consent'] && 'case_review' === $lawyer_mails[0][3]['utm_content'] && 'publish' === $lawyer_mails[0][4], 'Actual notification sees committed consent, attribution and published record' );
dispatch_fixture_hook( 'save_post_justice_lead', 1, get_post( 1 ), true );
check_intake( 3 === count( $mails ), 'Later theme save cannot send generic enquiry a second time' );
lifecycle_fixture(); $_POST['assigned_lawyer_id'] = '888'; $r = run_intake();
$profile_mails = array_filter( $mails, fn( $m ) => 'profile@example.com' === $m[0] );
check_intake( 302 === $r->status && 1 === count( $profile_mails ) && '888' === get_post_meta( 1, 'assigned_lawyer_id' ), 'Profile enquiry keeps selected lawyer, uses theme once, no Ops reassignment' );
check_intake( ! array_filter( $mails, fn( $m ) => 'lawyer@example.com' === $m[0] ), 'Generic advertiser never receives direct profile enquiry' );
lifecycle_fixture( array( 'owner_hold' => true ) ); $r = run_intake();
check_intake( 302 === $r->status && '1' === get_post_meta( 1, 'routing_hold' ) && 1 === count( $mails ), 'Verified intake never removes a separate owner hold' );
lifecycle_fixture( array( 'no_capacity' => true ) ); $r = run_intake();
check_intake( 302 === $r->status && 1 === count( $mails ) && 'unrouted_no_capacity' === get_post_meta( 1, 'lead_routing_status' ), 'No eligible lawyer stays saved for owner without a false handoff' );
echo "Passed $passed intake persistence assertions.\n";
