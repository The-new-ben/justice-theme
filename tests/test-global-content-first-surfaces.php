<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'OBJECT', 'OBJECT' );

class WP_Error {
	private string $code;
	private string $message;
	private array $data;
	public function __construct( string $code, string $message, array $data = array() ) {
		$this->code = $code;
		$this->message = $message;
		$this->data = $data;
	}
	public function get_error_code(): string { return $this->code; }
	public function get_error_data(): array { return $this->data; }
}

class JT_Request {
	private string $nonce;
	private string $authorization;
	private $params;
	public function __construct( string $nonce = 'valid', $params = null, string $authorization = '' ) {
		$this->nonce = $nonce;
		$this->params = $params;
		$this->authorization = $authorization;
	}
	public function get_header( string $name ): string {
		if ( 'X-WP-Nonce' === $name ) {
			return $this->nonce;
		}
		return 'Authorization' === $name ? $this->authorization : '';
	}
	public function get_json_params() { return $this->params; }
}

$jt_type = 'articles';
$jt_front = false;
$jt_tax = false;
$jt_page_template = '';
$jt_page_slug = '';
$jt_archive = false;
$jt_object_id = 501;
$jt_admin = true;
$jt_options = array( 'justice_ops_content_first_rollout_scope' => array( 'mode' => 'all', 'paths' => array() ) );
$jt_update_count = 0;
$jt_purge_count = 0;
$jt_connected_slug = 'connected-lawyer';
$jt_connected_resolves = true;
$jt_url_lookup_count = 0;

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function apply_filters( $tag, $value ) { return $value; }
function do_action( $tag, ...$args ): void { global $jt_purge_count; if ( 'litespeed_purge_all' === $tag ) { ++$jt_purge_count; } }
function register_rest_route( ...$args ): void {}
function wp_parse_url( $url, $component = -1 ) { return parse_url( $url, $component ); }
function wp_strip_all_tags( $value ): string { return strip_tags( (string) $value ); }
function wp_json_encode( $value ): string { return (string) json_encode( $value ); }
function sanitize_key( $value ): string { return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) ); }
function get_option( $key, $default = false ) { global $jt_options; return array_key_exists( $key, $jt_options ) ? $jt_options[ $key ] : $default; }
function update_option( $key, $value, $autoload = null ): bool { global $jt_options, $jt_update_count; $jt_options[ $key ] = $value; ++$jt_update_count; return true; }
function delete_transient( $key ): bool { global $jt_purge_count; ++$jt_purge_count; return true; }
function wp_cache_flush(): bool { global $jt_purge_count; ++$jt_purge_count; return true; }
function current_user_can( $cap ): bool { global $jt_admin; return $jt_admin && 'manage_options' === $cap; }
function wp_verify_nonce( $nonce, $action ): bool { return 'valid' === $nonce && 'wp_rest' === $action; }
function is_singular( $type = null ): bool { global $jt_type; return null === $type ? '' !== $jt_type : $jt_type === $type; }
function is_front_page(): bool { global $jt_front; return $jt_front; }
function is_tax( $taxonomy = '' ): bool { global $jt_tax; return $jt_tax && 'practice-areas' === $taxonomy; }
function is_page_template( $template = '' ): bool { global $jt_page_template; return $jt_page_template === $template; }
function is_post_type_archive( $type = '' ): bool { global $jt_archive; return $jt_archive && 'justice_lawyer' === $type; }
function is_page( $slug = '' ): bool { global $jt_page_slug; return $jt_page_slug === $slug; }
function is_admin(): bool { return false; }
function is_feed(): bool { return false; }
function is_preview(): bool { return false; }
function is_embed(): bool { return false; }
function wp_is_json_request(): bool { return false; }
function in_the_loop(): bool { return true; }
function is_main_query(): bool { return true; }
function get_queried_object_id(): int { global $jt_object_id; return $jt_object_id; }
function get_queried_object() { global $jt_page_slug; return (object) array( 'ID' => 501, 'post_name' => $jt_page_slug ); }
function justice_theme_get_controlled_practice_route_template(): string { global $jt_page_template; return 'controlled-practice' === $jt_page_template ? '/theme/practice-route.php' : ''; }
function justice_theme_is_practice_landing_page( $post ): bool { return false; }
function get_post_type( $id = 0 ): string { return in_array( (int) $id, array( 11, 13 ), true ) ? 'justice_lawyer' : ( 12 === (int) $id ? 'justice_lawyer' : 'articles' ); }
function get_post_meta( $id, $key, $single = false ) {
	global $jt_connected_slug;
	$meta = array(
		11 => array( 'subscription_status' => 'active', 'plan_type' => 'featured' ),
		12 => array( 'subscription_status' => 'inactive', 'plan_type' => 'listing' ),
		13 => array( 'subscription_status' => 'active', 'plan_type' => 'premium' ),
		501 => array( 'connected_lawyer_slug' => $jt_connected_slug ),
	);
	return $meta[ (int) $id ][ $key ] ?? '';
}
function justice_theme_lawyer_profile_is_public_approved( $id ): bool { return in_array( (int) $id, array( 11, 12, 13 ), true ); }
function justice_cards_has_public_sponsored_placement( int $id ): bool { return in_array( $id, array( 11, 13 ), true ); }
function justice_theme_get_connected_lawyer_by_slug( string $slug ) { global $jt_connected_resolves; return $jt_connected_resolves && 'connected-lawyer' === $slug ? (object) array( 'ID' => 11 ) : null; }
function url_to_postid( $url ): int { global $jt_url_lookup_count; ++$jt_url_lookup_count; return 1 === preg_match( '#/lawyers/(\d+)/#', (string) $url, $m ) ? (int) $m[1] : 0; }
function get_page_by_path( $slug, $output = OBJECT, $type = 'page' ) { return null; }

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';

function jt_global_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

function jt_theme_card( int $id, string $name, string $status = '', string $extra = '' ): string {
	$label = '' !== $status ? '<span class="lawyer-card__status lawyer-card__status--sponsored">' . $status . '</span>' : '';
	return '<article class="lawyer-card premium-card lawyer-card--paid lawyer-card--sponsored"><a class="lawyer-card__media" href="https://example.test/lawyers/' . $id . '/">' . $name . '</a>'
		. '<div class="lawyer-card__body"><div class="lawyer-card__top"><h3>' . $name . '</h3>' . $label . '</div>' . $extra . '</div></article>';
}

// Route-role classifier, with exact provider-intent exemptions.
$_SERVER['REQUEST_URI'] = '/lawyers/11/';
$jt_type = 'justice_lawyer';
jt_global_assert( 'provider_profile' === justice_ops_content_first_route_role(), 'Profile route was not exempt.' );
$jt_type = 'page';
$_SERVER['REQUEST_URI'] = '/lawyers/';
jt_global_assert( 'provider_directory' === justice_ops_content_first_route_role(), 'Directory route was not exempt.' );
$_SERVER['REQUEST_URI'] = '/real-estate-lawyer-yavne/';
jt_global_assert( 'provider_city' === justice_ops_content_first_route_role(), 'Exact legacy city route was not exempt.' );
$_SERVER['REQUEST_URI'] = '/the-recommended-family-lawyers/';
jt_global_assert( 'provider_comparison' === justice_ops_content_first_route_role(), 'Comparison route was not exempt.' );
$_SERVER['REQUEST_URI'] = '/';
$jt_front = true;
jt_global_assert( 'provider_home' === justice_ops_content_first_route_role(), 'Homepage SERP decision was not encoded.' );
$jt_front = false;
$jt_tax = true;
$_SERVER['REQUEST_URI'] = '/practice-areas/family-law/';
jt_global_assert( 'editorial_taxonomy' === justice_ops_content_first_route_role(), 'Practice taxonomy role is wrong.' );
$jt_tax = false;
$jt_page_template = 'page-legal-pillar.php';
$_SERVER['REQUEST_URI'] = '/child-custody/';
jt_global_assert( 'editorial_pillar' === justice_ops_content_first_route_role(), 'Legacy pillar role is wrong.' );
$jt_page_template = '';
foreach ( array( 'articles', 'post', 'page', 'justice_term', 'justice_question' ) as $type ) {
	$jt_type = $type;
	$_SERVER['REQUEST_URI'] = '/editorial-' . $type . '/';
	jt_global_assert( 'editorial_singular' === justice_ops_content_first_route_role(), 'Editorial type was not classified: ' . $type );
}

// Canonical disclosure normalization and personal-claim suppression.
$personal = '<p class="lawyer-card__commercial-disclosure">PERSONAL_RELATIONSHIP_CLAIM</p>';
$cards = jt_theme_card( 11, 'Paid theme', 'PERSONAL_STATUS', $personal )
	. jt_theme_card( 12, 'Organic theme', 'FALSE_SPONSOR')
	. '<aside class="jt-procard" data-l="11"><div class="jt-procard__ribbon"><span>Paid plugin</span><em class="jt-procard__sponsored">WRONG</em></div></aside>'
	. '<aside class="jt-procard" data-l="12"><div class="jt-procard__ribbon"><span>Organic plugin</span><em class="jt-procard__sponsored">FALSE</em></div></aside>'
	. '<div class="jt-premium-card"><a class="jt-premium-card__photo-link" href="https://example.test/lawyers/13/">Paid premium</a><div class="jt-premium-card__body">Body</div></div>'
	. '<div class="jt-premium-card"><a class="jt-premium-card__photo-link" href="https://example.test/lawyers/12/">Organic premium</a><div class="jt-premium-card__body"><span class="jt-premium-card__sponsored">FALSE</span>Body</div></div>';
$normalized = justice_ops_content_first_normalize_public_disclosures( $cards );
jt_global_assert( false === strpos( $normalized, 'PERSONAL_RELATIONSHIP_CLAIM' ), 'Personal commercial wording survived.' );
jt_global_assert( false === strpos( $normalized, 'PERSONAL_STATUS' ), 'Personal status wording survived.' );
jt_global_assert( false === strpos( $normalized, 'FALSE_SPONSOR' ), 'Inactive theme sponsor label survived.' );
jt_global_assert( false === strpos( $normalized, '>FALSE<' ), 'Inactive plugin/premium sponsor label survived.' );
jt_global_assert( 3 === substr_count( $normalized, '>מקודם<' ), 'Active paid cards did not receive one exact label each.' );
jt_global_assert( false === strpos( $normalized, 'Organic theme</h3><span class="lawyer-card__status' ), 'Organic theme card retained paid status.' );

// Large organic directories must take the marker-only fast path and perform
// no per-card permalink/meta resolution. Repeated marked hrefs resolve once.
$organic_directory = '';
for ( $i = 0; $i < 500; $i++ ) {
	$organic_directory .= '<article class="lawyer-card"><a class="lawyer-card__media" href="https://example.test/lawyers/' . ( 1000 + $i ) . '/">Organic</a></article>';
}
$jt_url_lookup_count = 0;
jt_global_assert( $organic_directory === justice_ops_content_first_normalize_public_disclosures( $organic_directory ), 'Organic directory markup changed.' );
jt_global_assert( 0 === $jt_url_lookup_count, 'Organic directory performed profile URL lookups.' );
$repeated_marked = '<article class="lawyer-card lawyer-card--paid"><a class="lawyer-card__media" href="https://example.test/lawyers/14/">Marked A</a></article>'
	. '<article class="lawyer-card lawyer-card--paid"><a class="lawyer-card__media" href="https://example.test/lawyers/14/">Marked B</a></article>';
$jt_url_lookup_count = 0;
justice_ops_content_first_normalize_public_disclosures( $repeated_marked );
jt_global_assert( 1 === $jt_url_lookup_count, 'Repeated marked href was not memoized.' );

// Pillar: active paid cards stay high, organic/mixed modules follow the true CTA.
$pillar = '<html><body><section class="legal-pillar-body"><div class="legal-pillar-content">'
	. '<p>Pillar answer</p><div class="jt-premium-card"><a class="jt-premium-card__photo-link" href="https://example.test/lawyers/13/">Paid premium</a><div class="jt-premium-card__body">Premium body</div></div>'
	. '<section class="jtcm-wrap"><div>Mixed map</div></section></div></section>'
	. '<section class="legal-pillar-lawyers"><div class="lawyers-grid">' . jt_theme_card( 11, 'Paid pillar', 'WRONG' ) . jt_theme_card( 12, 'Organic pillar' ) . '</div></section>'
	. '<section class="legal-pillar-articles"><p>Articles end</p></section>'
	. '<section class="practice-hub-cta"><p>CTA end</p></section></body></html>';
$pillar_ordered = justice_ops_content_first_filter_full_html( $pillar, 'editorial_pillar' );
$pillar_cta = strpos( $pillar_ordered, 'CTA end' );
jt_global_assert( false !== strpos( $pillar_ordered, 'data-jt-pillar-content-first=' ), 'Pillar marker missing.' );
jt_global_assert( strpos( $pillar_ordered, 'Paid premium' ) < $pillar_cta, 'Paid premium card moved below the CTA.' );
jt_global_assert( strpos( $pillar_ordered, 'Paid pillar' ) < $pillar_cta, 'Paid theme card moved below the CTA.' );
jt_global_assert( $pillar_cta < strpos( $pillar_ordered, 'Mixed map' ), 'Pillar map remained above the terminal CTA.' );
jt_global_assert( $pillar_cta < strpos( $pillar_ordered, 'Organic pillar' ), 'Organic pillar lawyer remained above the terminal CTA.' );
jt_global_assert( $pillar_ordered === justice_ops_content_first_filter_full_html( $pillar_ordered, 'editorial_pillar' ), 'Pillar transform is not idempotent.' );

// Singular provider tail must follow the template note and CTA, not only body.
$content = justice_ops_content_first_reorder_html( '<p>Answer</p><section class="single-article__fold">Provider fold</section>' );
$singular = '<article><div class="single-article__content">' . $content . '</div><section class="editorial-note">Editorial note</section><section class="single-article__lead-cta">Final CTA</section></article>';
$singular_ordered = justice_ops_content_first_filter_full_html( $singular, 'editorial_singular' );
jt_global_assert( strpos( $singular_ordered, 'Final CTA' ) < strpos( $singular_ordered, 'Provider fold' ), 'Provider tail did not move after the final CTA.' );

// Provider-intent roles retain order. Homepage is explicitly included.
$provider_surface = '<section class="legal-map-band">Provider answer</section><section class="cta-section">Later content</section>';
foreach ( array( 'provider_home', 'provider_city', 'provider_directory', 'provider_profile', 'provider_comparison' ) as $role ) {
	$provider_result = justice_ops_content_first_filter_full_html( $provider_surface, $role );
	jt_global_assert( strpos( $provider_result, 'Provider answer' ) < strpos( $provider_result, 'Later content' ), 'Provider-intent ordering changed for ' . $role );
}

// Rollout default preserves all eight Cyprus URLs and adds one bounded canary.
unset( $jt_options['justice_ops_content_first_rollout_scope'] );
$default_scope = justice_ops_content_first_rollout_scope();
jt_global_assert( 'exact' === $default_scope['mode'], 'Missing option did not load the explicit default scope.' );
jt_global_assert( array( '/online-family-law-services/' ) === $default_scope['paths'], 'Default canary path is not exact.' );
foreach ( justice_ops_content_first_target_paths() as $path ) {
	jt_global_assert( justice_ops_content_first_rollout_allows_path( $path ), 'Cyprus URL was not preserved: ' . $path );
}
jt_global_assert( justice_ops_content_first_rollout_allows_path( '/online-family-law-services/' ), 'Default article canary was not enabled.' );
jt_global_assert( ! justice_ops_content_first_rollout_allows_path( '/family-law/' ), 'Default scope widened beyond its canary.' );
$jt_options['justice_ops_content_first_rollout_scope'] = array( 'mode' => 'exact', 'paths' => array( '/family-law/' ) );
jt_global_assert( justice_ops_content_first_rollout_allows_path( '/family-law/' ), 'Exact canary path was not enabled.' );
jt_global_assert( justice_ops_content_first_rollout_allows_path( '/cyprus-prices/' ), 'Exact mode dropped the legacy cohort.' );
jt_global_assert( ! justice_ops_content_first_rollout_allows_path( '/random/' ), 'Exact mode widened beyond explicit paths.' );
jt_global_assert( null === justice_ops_content_first_sanitize_rollout_state( array( 'mode' => 'exact', 'paths' => array() ), false ), 'Empty exact scope did not fail closed.' );
jt_global_assert( null === justice_ops_content_first_sanitize_rollout_state( array( 'mode' => 'exact', 'paths' => array( 'https://evil.test/x/' ) ), false ), 'External rollout URL was accepted.' );
jt_global_assert( null === justice_ops_content_first_sanitize_rollout_state( array( 'mode' => 'exact', 'paths' => array( '/x/?bad=1' ) ), false ), 'Query-bearing rollout URL was accepted.' );

// REST control: WordPress-authenticated admin via Application Password, or
// cookie plus nonce. A header alone never grants access.
$basic_auth = 'Basic ' . base64_encode( 'admin:application-password' );
$jt_admin = false;
jt_global_assert( justice_ops_content_first_rollout_permission( new JT_Request( '', null, $basic_auth ) ) instanceof WP_Error, 'Basic header without manage_options was allowed.' );
$jt_admin = true;
jt_global_assert( true === justice_ops_content_first_rollout_permission( new JT_Request( '', null, $basic_auth ) ), 'Authenticated Application Password transport was denied.' );
$_SERVER['REDIRECT_HTTP_AUTHORIZATION'] = $basic_auth;
jt_global_assert( true === justice_ops_content_first_rollout_permission( new JT_Request( '' ) ), 'Redirected Application Password header was denied.' );
unset( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] );
$_SERVER['PHP_AUTH_USER'] = 'admin';
$_SERVER['PHP_AUTH_PW'] = 'application-password';
jt_global_assert( true === justice_ops_content_first_rollout_permission( new JT_Request( '' ) ), 'Parsed Application Password transport was denied.' );
unset( $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] );
$_SERVER['PHP_AUTH_USER'] = 'admin';
$_SERVER['PHP_AUTH_PW'] = '';
jt_global_assert( justice_ops_content_first_rollout_permission( new JT_Request( '' ) ) instanceof WP_Error, 'Incomplete parsed Basic pair was allowed.' );
unset( $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] );
jt_global_assert( justice_ops_content_first_rollout_permission( new JT_Request( '' ) ) instanceof WP_Error, 'Cookie request without a nonce was allowed.' );
jt_global_assert( true === justice_ops_content_first_rollout_permission( new JT_Request( 'valid' ) ), 'Valid admin nonce was denied.' );
$updates_before_get = $jt_update_count;
$get_payload = justice_ops_content_first_rollout_get( new JT_Request( 'valid' ) );
jt_global_assert( $updates_before_get === $jt_update_count, 'GET mutated rollout storage.' );
jt_global_assert( isset( $get_payload['scope_hash'] ) && 64 === strlen( $get_payload['scope_hash'] ), 'GET scope hash is invalid.' );
$bad_post = justice_ops_content_first_rollout_post( new JT_Request( 'valid', array( 'mode' => 'exact', 'paths' => array() ) ) );
jt_global_assert( $bad_post instanceof WP_Error && 'justice_content_first_invalid_scope' === $bad_post->get_error_code(), 'Malformed POST did not fail closed.' );
$stale_post = justice_ops_content_first_rollout_post( new JT_Request( 'valid', array( 'mode' => 'exact', 'paths' => array( '/family-law/' ), 'expected_scope_hash' => str_repeat( '0', 64 ) ) ) );
jt_global_assert( $stale_post instanceof WP_Error && 'justice_content_first_scope_conflict' === $stale_post->get_error_code(), 'Stale CAS hash was not rejected.' );
$purges_before = $jt_purge_count;
$exact_post = justice_ops_content_first_rollout_post( new JT_Request( 'valid', array( 'mode' => 'exact', 'paths' => array( '/family-law', '/family-law/' ), 'expected_scope_hash' => $get_payload['scope_hash'] ) ) );
jt_global_assert( is_array( $exact_post ) && array( '/family-law/' ) === $exact_post['paths'], 'Exact scope was not normalized/read back.' );
jt_global_assert( $jt_purge_count > $purges_before, 'Rollout change did not purge caches.' );
$off_post = justice_ops_content_first_rollout_post( new JT_Request( 'valid', array( 'mode' => 'off', 'paths' => array(), 'expected_scope_hash' => $exact_post['scope_hash'] ) ) );
jt_global_assert( is_array( $off_post ) && 'off' === $off_post['mode'], 'Off rollback was not stored.' );
jt_global_assert( ! justice_ops_content_first_rollout_allows_path( '/cyprus-prices/' ), 'Off rollback still allows transformed output.' );

// Connected sidebar must resolve a real public profile; stale metadata is inert.
$jt_options['justice_ops_content_first_rollout_scope'] = array( 'mode' => 'all', 'paths' => array() );
$jt_type = 'articles';
$_SERVER['REQUEST_URI'] = '/connected-article/';
$jt_connected_resolves = true;
jt_global_assert( 11 === justice_ops_content_first_connected_lawyer_id( 501 ), 'Valid connected profile did not resolve.' );
$jt_connected_resolves = false;
jt_global_assert( 0 === justice_ops_content_first_connected_lawyer_id( 501 ), 'Stale connected slug activated the sidebar guard.' );

echo "global content-first surface tests passed\n";
