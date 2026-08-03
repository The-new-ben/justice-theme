<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );

class WP_Post {
	public int $ID;
	public function __construct( int $id ) {
		$this->ID = $id;
	}
}

$jt_filters               = array();
$jt_candidates            = array_map( static fn( int $id ): WP_Post => new WP_Post( $id ), range( 201, 270 ) );
$jt_jurisdiction_approved = array();
$jt_transients            = array();
$jt_query_was_unbounded   = false;
$jt_candidate_query_calls = 0;
$jt_preview               = false;
$jt_feed                  = false;
$jt_json                  = false;
$jt_queried_object_id     = 0;
$jt_queried_path          = '/cyprus-prices/';

function add_filter( $tag, $callback, $priority = 10 ): void {
	global $jt_filters;
	$jt_filters[ $tag ][ $priority ] = $callback;
}
function add_action( ...$args ): void {}
function apply_filters( $tag, $value, ...$args ) {
	global $jt_jurisdiction_approved;
	if ( 'justice_cards_verified_jurisdiction_eligible' === $tag ) {
		return in_array( (int) ( $args[0] ?? 0 ), $jt_jurisdiction_approved, true );
	}
	if ( 'justice_cards_settings' === $tag ) {
		$value['sponsored_label'] = 'המלצה';
	}
	return $value;
}
function get_option( $key, $default = false ) {
	$overrides = array(
		'justice_cards_flag_label'      => 'עורך דין מוביל לתחום',
		'justice_cards_sponsored_label' => 'מומלץ',
		'justice_cards_max'             => 2,
		'justice_cards_min_gap_chars'   => 100,
	);
	return $overrides[ $key ] ?? $default;
}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) );
}
function sanitize_title( $value ): string {
	return sanitize_key( $value );
}
function wp_json_encode( $value ): string {
	return json_encode( $value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
}
function post_type_exists( $type ): bool {
	return 'justice_lawyer' === $type;
}
function get_posts( $args ): array {
	global $jt_candidates, $jt_query_was_unbounded, $jt_candidate_query_calls;
	if ( 'justice_lead' === ( $args['post_type'] ?? '' ) ) {
		return array();
	}
	if ( 'justice_lawyer' !== ( $args['post_type'] ?? '' ) ) {
		return array();
	}
	$limit = (int) ( $args['posts_per_page'] ?? 0 );
	$jt_query_was_unbounded = $jt_query_was_unbounded || -1 === $limit || $limit > 64;
	$jt_candidate_query_calls++;
	if ( isset( $args['post__in'] ) ) {
		$wanted = array_map( 'intval', (array) $args['post__in'] );
		return array_values( array_filter( $jt_candidates, static fn( WP_Post $post ): bool => in_array( $post->ID, $wanted, true ) ) );
	}
	$offset = (int) ( $args['offset'] ?? 0 );
	return array_slice( $jt_candidates, $offset, $limit );
}
function get_post_meta( $id, $key, $single = false ) {
	$id = (int) $id;
	$meta = array(
		201 => array( 'priority_score' => '200', 'professional_type' => 'lawyer', 'subscription_status' => 'inactive', 'plan_type' => 'listing' ),
		202 => array( 'priority_score' => '0', 'professional_type' => 'lawyer', 'subscription_status' => 'active', 'plan_type' => 'featured', 'profile_fact_review_status' => 'source_checked' ),
		203 => array( 'priority_score' => '180', 'professional_type' => 'lawyer', 'subscription_status' => 'active', 'plan_type' => 'featured' ),
		204 => array( 'priority_score' => '50', 'professional_type' => 'law_firm', 'subscription_status' => 'active', 'plan_type' => 'featured', 'years_experience' => '15', 'profile_fact_review_status' => 'pending' ),
		270 => array( 'priority_score' => '120', 'professional_type' => 'mediator', 'subscription_status' => 'active', 'plan_type' => 'premium', 'years_experience' => '12', 'profile_fact_review_status' => 'approved' ),
	);
	return $meta[ $id ][ $key ] ?? '';
}
function justice_theme_lawyer_profile_is_public_approved( $id ): bool {
	return 203 !== (int) $id;
}
function justice_theme_lawyer_has_public_sponsored_placement( $id ): bool {
	return in_array( (int) $id, array( 202, 203, 204 ), true );
}
function wp_date( $format ): string {
	return '12026';
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function get_queried_object_id(): int {
	global $jt_queried_object_id;
	return $jt_queried_object_id;
}
function get_the_ID(): int {
	return 500;
}
function get_the_title( $id = 0 ): string {
	return $id ? 'איש מקצוע ' . (int) $id : 'מדריך מחירי דירות בקפריסין';
}
function get_permalink( $id = 0 ): string {
	global $jt_queried_path;
	if ( 500 === (int) $id ) {
		return 'https://example.test' . $jt_queried_path;
	}
	return $id ? 'https://example.test/professional/' . (int) $id . '/' : 'https://example.test/cyprus-prices/';
}
function get_the_terms( $id, $taxonomy ) {
	if ( 500 === (int) $id ) {
		return array( (object) array( 'term_id' => 7, 'slug' => 'real-estate', 'name' => 'מקרקעין' ) );
	}
	if ( 'city' === $taxonomy ) {
		return array( (object) array( 'term_id' => 9, 'slug' => 'tel-aviv', 'name' => 'תל אביב' ) );
	}
	return array( (object) array( 'term_id' => 7, 'slug' => 'real-estate', 'name' => 'מקרקעין' ) );
}
function wp_list_pluck( $list, $field ): array {
	return array_map( static fn( $item ) => $item->{$field}, $list );
}
function wp_get_post_categories( $id, $args = array() ): array {
	return array();
}
function is_wp_error( $value ): bool {
	return false;
}
function add_query_arg( $key, $value = null, $url = null ): string {
	if ( is_array( $key ) ) {
		return (string) $value . '?' . http_build_query( $key );
	}
	return (string) $url . '?' . rawurlencode( (string) $key ) . '=' . rawurlencode( (string) $value );
}
function get_post_thumbnail_id( $id ): int {
	return 0;
}
function get_transient( $key ) {
	global $jt_transients;
	if ( str_starts_with( (string) $key, 'jt_resp_' ) ) {
		return '';
	}
	return $jt_transients[ $key ] ?? false;
}
function set_transient( $key, $value, $ttl ): bool {
	global $jt_transients;
	$jt_transients[ $key ] = $value;
	return true;
}
function wp_strip_all_tags( $value ): string {
	return strip_tags( (string) $value );
}
function justice_theme_public_whatsapp_url( $message ): string {
	return 'https://wa.me/972500000000?text=' . rawurlencode( (string) $message );
}
function esc_url( $value ): string {
	return (string) $value;
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function esc_attr( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function number_format_i18n( $number, $decimals = 0 ): string {
	return number_format( (float) $number, (int) $decimals );
}
function is_singular( $type = null ): bool {
	return is_array( $type ) ? in_array( 'articles', $type, true ) : 'articles' === $type;
}
function in_the_loop(): bool {
	return true;
}
function is_main_query(): bool {
	return true;
}
function is_feed(): bool {
	global $jt_feed;
	return $jt_feed;
}
function is_preview(): bool {
	global $jt_preview;
	return $jt_preview;
}
function wp_is_json_request(): bool {
	global $jt_json;
	return $jt_json;
}
function is_embed(): bool {
	return false;
}
function is_admin(): bool {
	return false;
}
function justice_enc_word_count( $content ): int {
	$words = preg_split( '/\s+/u', trim( strip_tags( (string) $content ) ) );
	return count( array_filter( (array) $words ) );
}

require_once dirname( __DIR__ ) . '/justice-ops/professional-cards.php';

function jt_professional_cards_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$_SERVER['REQUEST_URI'] = '/family-law/';
$lawyers = justice_cards_lawyers( array( 'real-estate' ), 5 );
$ids     = array_map( static fn( WP_Post $post ): int => $post->ID, $lawyers );
jt_professional_cards_assert( ! $jt_query_was_unbounded, 'A professional candidate query was unbounded.' );
jt_professional_cards_assert( $jt_candidate_query_calls >= 2, 'Sponsored candidate pagination was not exercised.' );
jt_professional_cards_assert( in_array( 270, $ids, true ), 'Active premium profile beyond the first query page was starved.' );
jt_professional_cards_assert( ! in_array( 201, $ids, true ), 'Free positive-priority profile was presented as sponsored.' );
jt_professional_cards_assert( in_array( 202, $ids, true ), 'True sponsored profile with zero priority was incorrectly excluded.' );
jt_professional_cards_assert( ! in_array( 203, $ids, true ), 'Nonpublic sponsored profile bypassed the approval gate.' );
jt_professional_cards_assert( justice_cards_has_public_sponsored_placement( 270 ), 'Premium was not recognized when the historical theme helper returned false.' );

foreach ( array(
	'/about-cyprus/',
	'/avoiding-mistakes-when-buying-property-in-cyprus/',
	'/buy-real-estate-cyprus/',
	'/cyprus-corporate-tax/',
	'/cyprus-lawyer/',
	'/cyprus-prices/',
	'/real-estate-market-review-cyprus-guide-israelis-2025/',
) as $path ) {
	$_SERVER['REQUEST_URI'] = $path . '?test=1';
	jt_professional_cards_assert( 'cyprus' === justice_cards_country_context(), 'Reviewed Cyprus path was not recognized: ' . $path );
}

$jt_queried_object_id = 500;
$jt_queried_path      = '/cyprus-prices/';
$_SERVER['REQUEST_URI'] = '/family-law/?misleading-request-uri=1';
jt_professional_cards_assert( 'cyprus' === justice_cards_country_context(), 'Canonical queried post did not override the raw request URI.' );
$jt_queried_object_id = 0;

$_SERVER['REQUEST_URI'] = '/real-estate-market-greece-cyprus/';
$jt_jurisdiction_approved = array( 202, 204, 270 );
jt_professional_cards_assert( 'comparison' === justice_cards_country_context(), 'Cross-country comparison was not recognized.' );
jt_professional_cards_assert( array() === justice_cards_lawyers( array( 'real-estate' ), 5 ), 'Provider cards were not suppressed on the cross-country comparison.' );

$_SERVER['REQUEST_URI'] = '/cyprus-prices/';
$jt_jurisdiction_approved = array();
jt_professional_cards_assert( array() === justice_cards_lawyers( array( 'real-estate' ), 5 ), 'Country-context paid cards did not default to suppressed.' );

$jt_jurisdiction_approved = array( 204, 270 );
$lawyers = justice_cards_lawyers( array( 'real-estate' ), 5 );
$ids     = array_map( static fn( WP_Post $post ): int => $post->ID, $lawyers );
jt_professional_cards_assert( array( 270, 204 ) === $ids, 'Explicit country-jurisdiction approval was not enforced per profile.' );

$premium_rendered = justice_cards_render( new WP_Post( 270 ) );
jt_professional_cards_assert( false !== strpos( $premium_rendered, 'מקודם' ), 'Controlled sponsored disclosure is missing.' );
jt_professional_cards_assert( false === strpos( $premium_rendered, 'מומלץ' ) && false === strpos( $premium_rendered, 'המלצה' ), 'Mutable stale disclosure escaped into output.' );
jt_professional_cards_assert( false !== strpos( $premium_rendered, 'כרטיס מגשר' ), 'Professional type label is incorrect.' );
jt_professional_cards_assert( false !== strpos( $premium_rendered, '12 שנות ניסיון' ), 'Approved experience fact is missing.' );
jt_professional_cards_assert( false === strpos( $premium_rendered, 'M12 3l1.8 3.8' ), 'Star/recommendation icon remains on the neutral label.' );

$pending_rendered = justice_cards_render( new WP_Post( 204 ) );
jt_professional_cards_assert( false !== strpos( $pending_rendered, 'כרטיס משרד עורכי דין' ), 'Law-firm profile was mislabeled as a lawyer.' );
jt_professional_cards_assert( false === strpos( $pending_rendered, '15 שנות ניסיון' ), 'Unreviewed experience fact was exposed.' );

foreach ( array( 'cyprus-prices', 'buy-real-estate-cyprus' ) as $draft_slug ) {
	$_SERVER['REQUEST_URI'] = '/' . $draft_slug . '/';
	$draft = file_get_contents( __DIR__ . '/fixtures/' . $draft_slug . '-draft.html' );
	jt_professional_cards_assert( false !== $draft, 'Real Hebrew draft fixture is missing: ' . $draft_slug );
	$output = justice_cards_filter_content( $draft );
	jt_professional_cards_assert( 2 === substr_count( $output, 'class="jt-procard"' ), 'Two distinct cards were not placed in real Hebrew draft: ' . $draft_slug );
	jt_professional_cards_assert( 1 === substr_count( $output, 'data-l="270"' ) && 1 === substr_count( $output, 'data-l="204"' ), 'A professional was duplicated in real Hebrew draft: ' . $draft_slug );
	jt_professional_cards_assert( mb_check_encoding( $output, 'UTF-8' ), 'Card placement split Hebrew UTF-8 bytes: ' . $draft_slug );
}

$source = '<p>תשובה</p><h2>א</h2><h2>ב</h2><p>טקסט</p>';
$jt_preview = true;
jt_professional_cards_assert( $source === justice_cards_filter_content( $source ), 'Preview response was mutated.' );
$jt_preview = false;
$jt_feed = true;
jt_professional_cards_assert( $source === justice_cards_filter_content( $source ), 'Feed response was mutated.' );
$jt_feed = false;
$jt_json = true;
jt_professional_cards_assert( $source === justice_cards_filter_content( $source ), 'JSON response was mutated.' );
$jt_json = false;
$_GET['rest_route'] = '/wp/v2/articles/500';
jt_professional_cards_assert( $source === justice_cards_filter_content( $source ), 'REST query transport response was mutated.' );
unset( $_GET['rest_route'] );

echo "professional cards tests passed\n";
