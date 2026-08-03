<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'MINUTE_IN_SECONDS', 60 );

class WP_Post {
	public int $ID;
	public function __construct( int $id ) {
		$this->ID = $id;
	}
}

$jt_filters          = array();
$jt_candidates       = array_map( static fn( int $id ): WP_Post => new WP_Post( $id ), range( 101, 130 ) );
$jt_transients       = array();
$jt_query_unbounded  = false;
$jt_query_meta       = array();
$jt_country_context  = '';
$jt_preview          = false;
$jt_feed             = false;
$jt_json             = false;

function add_filter( $tag, $callback, $priority = 10 ): void {
	global $jt_filters;
	$jt_filters[ $tag ][ $priority ] = $callback;
}
function add_action( ...$args ): void {}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) );
}
function wp_json_encode( $value ): string {
	return json_encode( $value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
}
function get_posts( $args ): array {
	global $jt_candidates, $jt_query_unbounded, $jt_query_meta;
	$limit = (int) ( $args['posts_per_page'] ?? 0 );
	$jt_query_unbounded = $jt_query_unbounded || -1 === $limit || $limit > 96;
	if ( isset( $args['meta_query'] ) ) {
		$jt_query_meta = $args['meta_query'];
	}
	if ( isset( $args['post__in'] ) ) {
		$wanted = array_map( 'intval', (array) $args['post__in'] );
		return array_values( array_filter( $jt_candidates, static fn( WP_Post $post ): bool => in_array( $post->ID, $wanted, true ) ) );
	}
	return array_slice( $jt_candidates, 0, $limit );
}
function get_post_meta( $id, $key, $single = false ) {
	$id = (int) $id;
	if ( 'priority_score' === $key ) {
		$scores = array( 101 => 50, 102 => 100, 128 => 300, 129 => 2, 130 => 1 );
		return (string) ( $scores[ $id ] ?? 25 );
	}
	if ( 'subscription_status' === $key ) {
		return 128 === $id ? 'active' : ( $id >= 102 && $id <= 127 ? 'active' : 'inactive' );
	}
	if ( 'plan_type' === $key ) {
		return 128 === $id ? 'premium' : ( $id >= 102 && $id <= 127 ? 'featured' : 'listing' );
	}
	if ( 'professional_type' === $key ) {
		return 129 === $id ? 'mediator' : 'lawyer';
	}
	return '';
}
function justice_theme_lawyer_profile_is_public_approved( $id ): bool {
	return true;
}
function justice_theme_lawyer_has_public_sponsored_placement( $id ): bool {
	$id = (int) $id;
	return $id >= 102 && $id <= 127;
}
function get_transient( $key ) {
	global $jt_transients;
	return $jt_transients[ $key ] ?? false;
}
function set_transient( $key, $value, $ttl ): bool {
	global $jt_transients;
	$jt_transients[ $key ] = $value;
	return true;
}
function get_the_ID(): int {
	return 500;
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
function update_object_term_cache( $ids, $type ): void {}
function is_wp_error( $value ): bool {
	return false;
}
function get_the_title( $id ): string {
	return justice_theme_lawyer_has_public_sponsored_placement( $id ) || 128 === (int) $id
		? 'Sponsored Professional ' . (int) $id
		: 'Organic Professional ' . (int) $id;
}
function get_permalink( $id ): string {
	return 'https://example.test/professional/' . (int) $id . '/';
}
function home_url( $path = '' ): string {
	return 'https://example.test' . $path;
}
function add_query_arg( $key, $value, $url ): string {
	return $url . '?' . rawurlencode( (string) $key ) . '=' . rawurlencode( (string) $value );
}
function esc_url( $value ): string {
	return (string) $value;
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function is_singular( $type = null ): bool {
	return 'articles' === $type;
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
function wp_list_pluck( $list, $field ): array {
	return array_map( static fn( $item ) => $item->{$field}, $list );
}
function justice_cards_country_context(): string {
	global $jt_country_context;
	return $jt_country_context;
}

require_once dirname( __DIR__ ) . '/justice-ops/firm-match-strip.php';

function jt_firm_strip_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$firms = justice_fms_pick_firms( array( 7 ) );
$ids   = array_column( $firms, 'id' );
jt_firm_strip_assert( ! $jt_query_unbounded, 'Organic candidate query is unbounded.' );
jt_firm_strip_assert( false !== strpos( json_encode( $jt_query_meta ), 'premium' ), 'SQL prefilter does not recognize premium as paid.' );
jt_firm_strip_assert( 3 === count( $firms ), 'Eligible organic candidates were starved after sponsored rows.' );
jt_firm_strip_assert( in_array( 101, $ids, true ), 'A free profile with positive priority was incorrectly treated as paid.' );
jt_firm_strip_assert( in_array( 129, $ids, true ), 'An eligible organic profile after sponsored rows was starved.' );
jt_firm_strip_assert( ! in_array( 128, $ids, true ), 'Active premium profile leaked into the organic strip.' );
jt_firm_strip_assert( ! in_array( 102, $ids, true ), 'A sponsored profile leaked into the organic strip.' );
jt_firm_strip_assert( 'מגשר' === $firms[ array_search( 129, $ids, true ) ]['type'], 'Organic professional type was mislabeled.' );

$callback = $jt_filters['the_content'][30] ?? null;
jt_firm_strip_assert( 'justice_fms_filter_content' === $callback, 'Named content filter was not registered.' );

$source = '<p>Direct answer</p><h2>Evidence</h2><p>Complete article</p>';
$output = justice_fms_filter_content( $source );
jt_firm_strip_assert( strpos( $output, 'Complete article' ) < strpos( $output, 'jt-firm-strip' ), 'Organic strip was not appended after the article.' );
jt_firm_strip_assert( false === strpos( $output, 'Sponsored Professional' ), 'Sponsored profile appeared in organic output.' );
jt_firm_strip_assert( false !== strpos( $output, 'יש לבדוק רישיון, ניסיון והתאמה למקרה' ), 'Neutral capability disclaimer is missing.' );

$jt_country_context = 'comparison';
jt_firm_strip_assert( $source === justice_fms_filter_content( $source ), 'Provider strip was not suppressed on the Greece-Cyprus comparison.' );
$jt_country_context = '';
$jt_preview = true;
jt_firm_strip_assert( $source === justice_fms_filter_content( $source ), 'Preview response was mutated.' );
$jt_preview = false;
$jt_feed = true;
jt_firm_strip_assert( $source === justice_fms_filter_content( $source ), 'Feed response was mutated.' );
$jt_feed = false;
$jt_json = true;
jt_firm_strip_assert( $source === justice_fms_filter_content( $source ), 'JSON response was mutated.' );
$jt_json = false;
$_GET['rest_route'] = '/wp/v2/articles/500';
jt_firm_strip_assert( $source === justice_fms_filter_content( $source ), 'REST query transport response was mutated.' );
unset( $_GET['rest_route'] );

echo "firm match strip tests passed\n";
