<?php
declare(strict_types=1);
/**
 * Stub harness for justice-ops/lead-form-shortcode.php (HAD-447).
 * Proves: the form renders without a nonce or a server timestamp (cache-safe),
 * consent is required and never pre-checked, the REST path writes the same
 * canonical lead meta as uje_handle_lead plus the routing fields, abroad leads
 * are held from the automatic router before lead_status is written, and the
 * honeypot, fill-time, rate-limit and duplicate guards hold.
 * Run: php tests/test-lead-form-shortcode.php
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );

class WP_Error {
	public string $code;
	public string $message;
	public array $data;
	public function __construct( string $code = '', string $message = '', array $data = array() ) {
		$this->code    = $code;
		$this->message = $message;
		$this->data    = $data;
	}
}
class WP_REST_Request {
	private array $params;
	private array $headers;
	public function __construct( array $params, array $headers = array() ) {
		$this->params  = $params;
		$this->headers = $headers;
	}
	public function get_param( string $key ) { return $this->params[ $key ] ?? null; }
	public function get_header( string $key ) { return $this->headers[ $key ] ?? null; }
}

$jt_meta_log  = array(); // [lead_id, key, value] in write order
$jt_inserts   = array();
$jt_transient = array();
$jt_mail      = array();
$jt_next_id   = 500;
$jt_options   = array( 'admin_email' => 'admin@example.test' );

function add_action( ...$args ): void {}
function add_shortcode( ...$args ): void {}
function shortcode_atts( array $defaults, array $atts, string $tag = '' ): array { return array_merge( $defaults, array_intersect_key( $atts, $defaults ) ); }
function sanitize_key( $v ): string { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $v ) ); }
function sanitize_text_field( $v ): string { return trim( strip_tags( (string) $v ) ); }
function sanitize_email( $v ): string { return filter_var( (string) $v, FILTER_SANITIZE_EMAIL ) ?: ''; }
function is_email( $v ) { return false !== filter_var( (string) $v, FILTER_VALIDATE_EMAIL ) ? $v : false; }
function esc_attr( $v ): string { return htmlspecialchars( (string) $v, ENT_QUOTES ); }
function esc_html( $v ): string { return htmlspecialchars( (string) $v, ENT_QUOTES ); }
function esc_url( $v ): string { return (string) $v; }
function esc_url_raw( $v ): string { return preg_match( '#^https?://#', (string) $v ) ? (string) $v : ''; }
function rest_url( string $path ): string { return 'https://jus-tice.co.il/wp-json/' . $path; }
function home_url( string $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function get_queried_object_id(): int { return 12897; }
function get_post_meta( $id, $key, $single = false ) { return 'primary_keyword' === $key ? 'עורך דין גירושין מומלץ' : ''; }
function get_the_title( $id ): string { return 'Title'; }
function get_locale(): string { return 'he_IL'; }
function get_privacy_policy_url(): string { return ''; }
function get_option( $key, $default = false ) { global $jt_options; return $jt_options[ $key ] ?? $default; }
function wp_date( string $format ): string { return gmdate( $format ); }
function wp_generate_uuid4(): string { return '00000000-0000-4000-8000-000000000000'; }
function absint( $v ): int { return abs( (int) $v ); }
function is_wp_error( $thing ): bool { return $thing instanceof WP_Error; }
function get_transient( string $key ) { global $jt_transient; return $jt_transient[ $key ] ?? false; }
function set_transient( string $key, $value, int $ttl ): bool { global $jt_transient; $jt_transient[ $key ] = $value; return true; }
function wp_insert_post( array $args ) { global $jt_inserts, $jt_next_id; $jt_inserts[] = $args; return ++$jt_next_id; }
function update_post_meta( $id, $key, $value ) { global $jt_meta_log; $jt_meta_log[] = array( $id, $key, $value ); return true; }
function wp_mail( $to, $subject, $body ): bool { global $jt_mail; $jt_mail[] = array( $to, $subject, $body ); return true; }

require dirname( __DIR__ ) . '/justice-ops/lead-form-shortcode.php';

$fails = 0;
$total = 0;
function check( bool $ok, string $label ): void {
	global $fails, $total;
	++$total;
	if ( ! $ok ) {
		++$fails;
		echo "FAIL: {$label}\n";
	}
}
function meta_of( int $id ): array {
	global $jt_meta_log;
	$out = array();
	foreach ( $jt_meta_log as $row ) {
		if ( $row[0] === $id ) {
			$out[ $row[1] ] = $row[2];
		}
	}
	return $out;
}
function key_order( int $id ): array {
	global $jt_meta_log;
	$out = array();
	foreach ( $jt_meta_log as $row ) {
		if ( $row[0] === $id ) {
			$out[] = $row[1];
		}
	}
	return $out;
}
function reset_state(): void {
	global $jt_meta_log, $jt_inserts, $jt_transient, $jt_mail;
	$jt_meta_log = $jt_inserts = $jt_transient = $jt_mail = array();
}
function family_params( array $over = array() ): array {
	return array_merge(
		array(
			'variant'      => 'family',
			'lead_name'    => 'דנה',
			'lead_phone'   => '050-1234567',
			'lead_email'   => '',
			'lead_topic'   => 'alimony-custody',
			'lead_timing'  => 'this-week',
			'lead_consent' => '1',
			'jlf_el'       => '8000',
			'page_url'     => 'https://jus-tice.co.il/the-recommended-family-lawyers/',
			'utm_source'   => 'google',
		),
		$over
	);
}

// --- Render ---------------------------------------------------------------
$_SERVER['REMOTE_ADDR'] = '203.0.113.7';

$family = justice_lf_render( array( 'variant' => 'family' ) );
check( false !== strpos( $family, 'wp-json/justice-ops/v1/lead-form' ), 'family form posts to the REST route' );
check( false === strpos( $family, 'nonce' ), 'no nonce printed into a cached page' );
check( false === strpos( $family, 'justice_lead_started_at' ), 'no server timestamp printed into a cached page' );
check( 1 === preg_match( '/<input[^>]+name="lead_consent"[^>]*required/', $family ), 'consent checkbox is required' );
check( 0 === preg_match( '/<input[^>]+name="lead_consent"[^>]*checked/', $family ), 'consent checkbox is not pre-checked' );
check( false !== strpos( $family, 'name="justice_lead_company"' ), 'honeypot field present' );
check( 0 === preg_match( '/<h[1-6]/', $family ), 'no heading tag added to the page outline' );
check( false !== strpos( $family, 'value="alimony-custody"' ), 'family topic list rendered' );
check( false !== strpos( $family, 'justice-lead-form-js' ), 'assets printed with the first form' );
check( false !== strpos( $family, 'value="עורך דין גירושין מומלץ"' ), 'source keyword from page meta' );

$abroad = justice_lf_render( array( 'variant' => 'abroad', 'country' => 'greece', 'topic' => 'property' ) );
check( false === strpos( $abroad, 'justice-lead-form-js' ), 'assets printed only once per page' );
check( 1 === preg_match( '/value="greece" selected/', $abroad ), 'country prefilled from the shortcode' );
check( 1 === preg_match( '/value="property" selected/', $abroad ), 'need prefilled from the topic attribute' );
check( false !== strpos( $abroad, 'ביוון' ), 'abroad consent names the country' );
check( false !== strpos( $abroad, 'דמי הפניה' ), 'abroad consent discloses the referral fee' );
check( false !== strpos( $abroad, 'name="preferred_language"' ), 'abroad form asks for the preferred language' );

$bad_variant = justice_lf_render( array( 'variant' => 'x', 'topic' => 'inheritance' ) );
check( false !== strpos( $bad_variant, 'לענייני ירושה' ), 'unknown variant falls back to family, inheritance title' );

// --- Guards ---------------------------------------------------------------
reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'justice_lead_company' => 'ACME' ) ) ) );
check( is_array( $r ) && true === $r['ok'] && 0 === count( $jt_inserts ), 'honeypot: fake success, nothing stored' );

reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'jlf_el' => '900' ) ) ) );
check( $r instanceof WP_Error && 'jlf_fast' === $r->code && 0 === count( $jt_inserts ), 'too fast (or no JS): rejected' );

reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'lead_consent' => '' ) ) ) );
check( $r instanceof WP_Error && 'jlf_consent' === $r->code && 0 === count( $jt_inserts ), 'missing consent: rejected' );

reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'lead_phone' => '123' ) ) ) );
check( $r instanceof WP_Error && 'jlf_fields' === $r->code, 'short phone: rejected' );

reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'lead_topic' => 'hack' ) ) ) );
check( $r instanceof WP_Error && 'jlf_topic' === $r->code, 'unknown topic: rejected' );

reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'lead_email' => 'not-an-email' ) ) ) );
check( $r instanceof WP_Error && 'jlf_email' === $r->code, 'bad email: rejected' );

reset_state();
$r = justice_lf_submit( new WP_REST_Request( array_merge( family_params(), array( 'variant' => 'abroad', 'lead_topic' => 'property', 'lead_country' => 'spain' ) ) ) );
check( $r instanceof WP_Error && 'jlf_country' === $r->code, 'abroad without a known country: rejected' );

// --- Family lead ----------------------------------------------------------
reset_state();
$r = justice_lf_submit( new WP_REST_Request( family_params() ) );
check( is_array( $r ) && true === $r['ok'] && 1 === count( $jt_inserts ), 'family lead stored once' );
$id = $jt_next_id;
$m  = meta_of( $id );
check( 'justice_lead' === $jt_inserts[0]['post_type'], 'stored as justice_lead' );
foreach ( array( 'visitor_name', 'visitor_phone', 'visitor_email', 'legal_area', 'city', 'message', 'urgency', 'lead_status', 'follow_up_status', 'coverage_status', 'consent', 'consent_status', 'source_url', 'source_page_url', 'source_keyword', 'source_channel', 'source_system', 'lead_source_surface', 'product_intent', 'lead_revenue_model', 'qualified_lead_billing_status', 'lead_revenue_notes', 'owner_revenue_next_step', 'assigned_lawyer_id' ) as $k ) {
	check( array_key_exists( $k, $m ), "canonical meta {$k} written" );
}
check( 'family-law' === $m['legal_area'] && 'high' === $m['urgency'] && 'new' === $m['lead_status'], 'family: area, urgency and status' );
check( 'family_topic_form' === $m['lead_source_surface'], 'family surface' );
check( 'alimony-custody' === $m['lead_topic'] && 'this-week' === $m['lead_timing'], 'family: topic and timing stored' );
check( '1' === $m['consent'] && false !== strpos( (string) $m['consent_text'], 'Jus-Tice' ) && JUSTICE_LF_CONSENT_VERSION === $m['consent_version'], 'consent text and version stored server-side' );
check( '' !== (string) $m['request_uuid'], 'request id stored' );
check( ! array_key_exists( 'routing_hold', $m ), 'family lead goes to the normal router' );
check( 'google' === ( $m['utm_source'] ?? '' ), 'utm from the browser stored' );
check( 1 === count( $jt_mail ) && 'admin@example.test' === $jt_mail[0][0], 'notification to admin email when no verified mailbox' );

// Duplicate within 10 minutes.
$r = justice_lf_submit( new WP_REST_Request( family_params() ) );
check( is_array( $r ) && ! empty( $r['duplicate'] ) && 1 === count( $jt_inserts ), 'duplicate within 10 minutes: no second lead' );

// --- Abroad lead ----------------------------------------------------------
reset_state();
$jt_options['justice_ops_verified_lead_mailbox'] = 'leads@example.test';
$r  = justice_lf_submit(
	new WP_REST_Request(
		array(
			'variant'            => 'abroad',
			'lead_country'       => 'greece',
			'lead_topic'         => 'property',
			'lead_budget'        => '250-500',
			'lead_timing'        => '3-months',
			'preferred_language' => 'en',
			'lead_name'          => 'Yossi',
			'lead_phone'         => '+972 54 765 4321',
			'lead_email'         => 'yossi@example.com',
			'lead_consent'       => '1',
			'jlf_el'             => '15000',
			'page_url'           => 'https://evil.example/greece/',
		),
		array( 'referer' => 'https://jus-tice.co.il/greece-price-list/' )
	)
);
$id = $jt_next_id;
$m  = meta_of( $id );
$o  = key_order( $id );
check( is_array( $r ) && true === $r['ok'], 'abroad lead accepted' );
check( '1' === ( $m['routing_hold'] ?? '' ), 'abroad lead held from the automatic router' );
check( array_search( 'routing_hold', $o, true ) < array_search( 'legal_area', $o, true ) && array_search( 'routing_hold', $o, true ) < array_search( 'lead_status', $o, true ), 'hold written before legal_area and lead_status' );
check( 'greece' === $m['lead_country'] && '250-500' === $m['lead_budget'] && 'en' === $m['preferred_language'], 'abroad: country, budget, language stored' );
check( 'real-estate-law' === $m['legal_area'] && 'abroad_quote_form' === $m['lead_source_surface'], 'abroad: area and surface' );
check( 'https://jus-tice.co.il/greece-price-list/' === $m['source_page_url'], 'foreign page_url refused, same-site referer used' );
check( false !== strpos( (string) $m['consent_text'], 'ביוון' ), 'abroad consent text names the country' );
check( 'leads@example.test' === $jt_mail[0][0], 'verified mailbox used when set' );

// --- Rate limit -----------------------------------------------------------
reset_state();
for ( $i = 0; $i < 6; $i++ ) {
	justice_lf_submit( new WP_REST_Request( family_params( array( 'lead_phone' => '05012345' . $i . '0' ) ) ) );
}
$r = justice_lf_submit( new WP_REST_Request( family_params( array( 'lead_phone' => '0509999999' ) ) ) );
check( 6 === count( $jt_inserts ) && $r instanceof WP_Error && 'jlf_limit' === $r->code && 429 === $r->data['status'], 'seventh lead in an hour from one IP: 429' );

echo ( 0 === $fails ? 'OK' : 'FAILED' ) . " {$total} checks, {$fails} failed\n";
exit( $fails ? 1 : 0 );
