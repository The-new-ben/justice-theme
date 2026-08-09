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

$jt_chain_transients = array();

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function apply_filters( $tag, $value, ...$args ) {
	return $value;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
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
	return false;
}
function is_preview(): bool {
	return false;
}
function wp_is_json_request(): bool {
	return false;
}
function is_embed(): bool {
	return false;
}
function is_admin(): bool {
	return false;
}
function wp_strip_all_tags( $value ): string {
	return strip_tags( (string) $value );
}
function esc_attr( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function esc_url( $value ): string {
	return (string) $value;
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
function get_option( $key, $default = false ) {
	return $default;
}
function post_type_exists( $type ): bool {
	return 'justice_lawyer' === $type;
}
function get_posts( $args ): array {
	if ( 'justice_lead' === ( $args['post_type'] ?? '' ) ) {
		return array();
	}
	if ( 'justice_lawyer' !== ( $args['post_type'] ?? '' ) ) {
		return array();
	}
	$profiles = array( 901 => new WP_Post( 901 ), 902 => new WP_Post( 902 ) );
	if ( isset( $args['post__in'] ) ) {
		$output = array();
		foreach ( (array) $args['post__in'] as $id ) {
			if ( isset( $profiles[ (int) $id ] ) ) {
				$output[] = $profiles[ (int) $id ];
			}
		}
		return $output;
	}
	if ( 'OR' === ( $args['meta_query']['relation'] ?? '' ) ) {
		return array( $profiles[901] );
	}
	return array( $profiles[902] );
}
function get_post_meta( $id, $key, $single = false ) {
	$meta = array(
		901 => array( 'subscription_status' => 'active', 'plan_type' => 'premium', 'priority_score' => '100', 'professional_type' => 'lawyer', 'profile_fact_review_status' => 'approved' ),
		902 => array( 'subscription_status' => 'inactive', 'plan_type' => 'listing', 'priority_score' => '0', 'professional_type' => 'lawyer' ),
	);
	return $meta[ (int) $id ][ $key ] ?? '';
}
function justice_theme_lawyer_profile_is_public_approved( $id ): bool {
	return true;
}
function justice_theme_lawyer_has_public_sponsored_placement( $id ): bool {
	return false;
}
function get_transient( $key ) {
	global $jt_chain_transients;
	if ( str_starts_with( (string) $key, 'jt_resp_' ) ) {
		return '';
	}
	return $jt_chain_transients[ $key ] ?? false;
}
function set_transient( $key, $value, $ttl ): bool {
	global $jt_chain_transients;
	$jt_chain_transients[ $key ] = $value;
	return true;
}
function get_queried_object_id(): int {
	return 0;
}
function get_the_ID(): int {
	return 500;
}
function get_the_title( $id = 0 ): string {
	return $id ? 'איש מקצוע ' . (int) $id : 'מדריך קפריסין';
}
function get_permalink( $id = 0 ): string {
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
function wp_get_post_categories( $id, $args = array() ): array {
	return array();
}
function wp_list_pluck( $list, $field ): array {
	return array_map( static fn( $item ) => $item->{$field}, $list );
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
function home_url( $path = '' ): string {
	return 'https://example.test' . $path;
}
function get_post_thumbnail_id( $id ): int {
	return 0;
}
function justice_theme_public_whatsapp_url( $message ): string {
	return 'https://wa.me/972500000000?text=' . rawurlencode( (string) $message );
}
function number_format_i18n( $number, $decimals = 0 ): string {
	return number_format( (float) $number, (int) $decimals );
}
function wp_date( $format ): string {
	return '12026';
}
function update_object_term_cache( $ids, $type ): void {}
function justice_enc_word_count( $content ): int {
	$words = preg_split( '/\s+/u', trim( strip_tags( (string) $content ) ) );
	return count( array_filter( (array) $words ) );
}

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';
require_once dirname( __DIR__ ) . '/justice-ops/professional-cards.php';
require_once dirname( __DIR__ ) . '/justice-ops/reader-ux.php';
require_once dirname( __DIR__ ) . '/justice-ops/firm-match-strip.php';

function jt_cyprus_chain_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

/**
 * Return the sole parsed block carrying an exact class.
 */
function jt_cyprus_chain_class_block( string $html, string $class_name ): array {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$blocks    = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );
	jt_cyprus_chain_assert( 1 === count( $blocks ?? array() ), 'Expected one .' . $class_name . ' block.' );
	$block = $blocks[0];
	if ( ! empty( $protected ) ) {
		$block['element'] = strtr( $block['element'], $protected );
	}
	return $block;
}

/**
 * Return the inner HTML of the sole element carrying a class.
 */
function jt_cyprus_chain_inner_class( string $html, string $class_name ): string {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$blocks    = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );
	jt_cyprus_chain_assert( 1 === count( $blocks ?? array() ), 'Expected one .' . $class_name . ' block.' );
	$block = $blocks[0];
	$inner = substr( $masked, $block['open_end'], $block['close_start'] - $block['open_end'] );

	return empty( $protected ) ? $inner : strtr( $inner, $protected );
}

/**
 * Parse a real id attribute without mistaking data-id for id.
 */
function jt_cyprus_chain_attr_id( string $attrs ): string {
	if ( 1 !== preg_match( '/(?:^|\s)id\s*=\s*(?:"([^"]+)"|\'([^\']+)\'|([^\s>]+))/iu', $attrs, $match ) ) {
		return '';
	}
	foreach ( array( 1, 2, 3 ) as $index ) {
		if ( '' !== ( $match[ $index ] ?? '' ) ) {
			return $match[ $index ];
		}
	}
	return '';
}

/**
 * Normalize a captured heading or TOC label for stable fixture matching.
 */
function jt_cyprus_chain_label( string $html ): string {
	$label = html_entity_decode( trim( strip_tags( $html ) ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$label = preg_replace( '/\s+/u', ' ', $label );
	return mb_substr( trim( (string) $label ), 0, 70 );
}

/**
 * Extract ordered TOC pairs as id and visible label.
 *
 * @return array<int,array{id:string,label:string}>
 */
function jt_cyprus_chain_toc_pairs( string $html ): array {
	$block = jt_cyprus_chain_class_block( $html, 'jt-toc' );
	preg_match_all( '#<a\b[^>]*href=["\']\#([^"\']+)["\'][^>]*>(.*?)</a>#isu', $block['element'], $matches, PREG_SET_ORDER );
	$pairs = array();
	foreach ( $matches as $match ) {
		$pairs[] = array(
			'id'    => html_entity_decode( $match[1], ENT_QUOTES | ENT_HTML5, 'UTF-8' ),
			'label' => jt_cyprus_chain_label( $match[2] ),
		);
	}
	return $pairs;
}

/**
 * Extract ordered H2 pairs that have IDs.
 *
 * @return array<int,array{id:string,label:string}>
 */
function jt_cyprus_chain_heading_pairs( string $html ): array {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	preg_match_all( '/<h2([^>]*)>(.*?)<\/h2>/isu', $masked, $matches, PREG_SET_ORDER );
	$pairs = array();
	foreach ( $matches as $match ) {
		$id = jt_cyprus_chain_attr_id( $match[1] );
		if ( '' === $id ) {
			continue;
		}
		$pairs[] = array(
			'id'    => $id,
			'label' => jt_cyprus_chain_label( $match[2] ),
		);
	}
	return $pairs;
}

/**
 * Count exact occurrences of an element ID.
 */
function jt_cyprus_chain_id_count( string $html, string $id ): int {
	$quoted = preg_quote( $id, '#' );
	return preg_match_all( '#(?:^|\s)id\s*=\s*(?:"' . $quoted . '"|\'' . $quoted . '\'|' . $quoted . ')(?:\s|>)#imu', $html );
}

/**
 * Collect every real ID with multiplicity for structural preservation checks.
 *
 * @return string[]
 */
function jt_cyprus_chain_all_ids( string $html ): array {
	preg_match_all( '/(?:^|\s)id\s*=\s*(?:"([^"]+)"|\'([^\']+)\'|([^\s>]+))/imu', $html, $matches, PREG_SET_ORDER );
	$ids = array();
	foreach ( $matches as $match ) {
		foreach ( array( 1, 2, 3 ) as $index ) {
			if ( '' !== ( $match[ $index ] ?? '' ) ) {
				$ids[] = $match[ $index ];
				break;
			}
		}
	}
	sort( $ids );
	return $ids;
}

/**
 * Build a priority-13 reader fixture from the captured TOC and captured fold.
 *
 * Final HTML cannot be replayed directly because late filters can add, remove
 * or duplicate headings after priority 14. The captured TOC is therefore the
 * oracle for the exact historical heading/fragment order. The real captured
 * fold is inserted at its historical position so descendant exclusion runs
 * against the production DOM rather than invented nesting.
 */
function jt_cyprus_chain_priority13_fixture( string $html, array $original_toc ): string {
	$fold          = jt_cyprus_chain_class_block( $html, 'single-article__fold' )['element'];
	$fold_headings = jt_cyprus_chain_heading_pairs( $fold );
	$fold_ids      = array_column( $fold_headings, 'id' );
	$fold_pairs    = array_values( array_filter( $original_toc, static fn( array $pair ): bool => in_array( $pair['id'], $fold_ids, true ) ) );
	jt_cyprus_chain_assert( 1 === count( $fold_pairs ), 'Captured fold does not own exactly one historical TOC heading.' );
	$fold_pair = $fold_pairs[0];

	$protected = array();
	$fold      = justice_ops_content_first_protect_raw_text( $fold, $protected );
	$used      = false;
	$fold      = preg_replace_callback(
		'/<h2([^>]*)>(.*?)<\/h2>/isu',
		static function ( array $match ) use ( $fold_pair, &$used ): string {
			$attrs = preg_replace( '/(?:^|\s)id\s*=\s*(?:"[^"]+"|\'[^\']+\'|[^\s>]+)/iu', '', $match[1] );
			if ( ! $used && $fold_pair['label'] === jt_cyprus_chain_label( $match[2] ) ) {
				$used = true;
				return '<h2 id="' . htmlspecialchars( $fold_pair['id'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ) . '"' . $attrs . '>' . $match[2] . '</h2>';
			}
			return '<h3' . $attrs . '>' . $match[2] . '</h3>';
		},
		$fold
	);
	jt_cyprus_chain_assert( is_string( $fold ) && $used, 'Could not reconstruct captured fold heading.' );
	if ( ! empty( $protected ) ) {
		$fold = strtr( $fold, $protected );
	}

	$fixture = '<p>Captured priority-13 direct-answer fixture.</p>';
	foreach ( $original_toc as $pair ) {
		if ( $pair['id'] === $fold_pair['id'] ) {
			$fixture .= $fold;
			continue;
		}
		$fixture .= '<h2 id="' . htmlspecialchars( $pair['id'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ) . '">'
			. htmlspecialchars( $pair['label'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' )
			. '</h2><p>Captured editorial section fixture.</p>';
	}

	return $fixture;
}

/**
 * Assert that the live nested fold remains structurally intact.
 */
function jt_cyprus_chain_assert_fold( string $html, string $slug ): void {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$folds     = justice_ops_content_first_find_class_blocks( $masked, $tags, 'single-article__fold' );
	$menus     = justice_ops_content_first_find_class_blocks( $masked, $tags, 'jt-cmenu' );
	jt_cyprus_chain_assert( 1 === count( $folds ?? array() ) && 1 === count( $menus ?? array() ), 'Fold/menu cardinality changed for ' . $slug );
	jt_cyprus_chain_assert( justice_ops_content_first_block_contains( $folds[0], $menus[0] ), 'Menu detached from fold for ' . $slug );
	jt_cyprus_chain_assert( 1 === preg_match_all( '#<form\b#iu', $masked ), 'Form is not present exactly once for ' . $slug );
	jt_cyprus_chain_assert( 1 === jt_cyprus_chain_id_count( $masked, 'jt-cinema-map' ), 'Map is not present exactly once for ' . $slug );
}

$fixture_names = array(
	'about-cyprus',
	'avoiding-mistakes-when-buying-property-in-cyprus',
	'buy-real-estate-cyprus',
	'cyprus-corporate-tax',
	'cyprus-lawyer',
	'cyprus-prices',
	'real-estate-market-greece-cyprus',
	'real-estate-market-review-cyprus-guide-israelis-2025',
);
$fixture_root = __DIR__ . '/fixtures/';
$manifest_lines = file( __DIR__ . '/fixtures/cyprus-server-captures.sha256', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES );
jt_cyprus_chain_assert( false !== $manifest_lines, 'Captured fixture hash manifest is missing.' );
$fixture_hashes = array();
foreach ( $manifest_lines as $line ) {
	if ( 1 === preg_match( '#^([a-f0-9]{64})\s+(.+)$#', trim( $line ), $hash_match ) ) {
		$fixture_hashes[ $hash_match[2] ] = $hash_match[1];
	}
}
jt_cyprus_chain_assert( count( $fixture_names ) === count( $fixture_hashes ), 'Captured fixture hash manifest is incomplete.' );
$price_priority13 = '';

foreach ( $fixture_names as $slug ) {
	$fixture_name = $slug . '-server.html.gz';
	$gzip = file_get_contents( $fixture_root . $fixture_name );
	jt_cyprus_chain_assert( false !== $gzip, 'Missing captured fixture: ' . $slug );
	jt_cyprus_chain_assert( ( $fixture_hashes[ $fixture_name ] ?? '' ) === hash( 'sha256', $gzip ), 'Captured fixture hash changed: ' . $slug );
	$document = gzdecode( $gzip );
	jt_cyprus_chain_assert( false !== $document, 'Could not decode captured fixture: ' . $slug );
	$entry = jt_cyprus_chain_inner_class( $document, 'entry-content' );

	$original_toc = jt_cyprus_chain_toc_pairs( $entry );
	jt_cyprus_chain_assert( ! empty( $original_toc ), 'Captured TOC is empty for ' . $slug );

	$fold_headings = jt_cyprus_chain_heading_pairs( jt_cyprus_chain_inner_class( $entry, 'single-article__fold' ) );
	$fold_ids      = array_column( $fold_headings, 'id' );
	jt_cyprus_chain_assert( in_array( 'sec-3', $fold_ids, true ), 'Captured map fragment is not sec-3 for ' . $slug );
	$expected_toc = array_values( array_filter( $original_toc, static fn( array $pair ): bool => ! in_array( $pair['id'], $fold_ids, true ) ) );

	$priority13 = jt_cyprus_chain_priority13_fixture( $entry, $original_toc );
	$_SERVER['REQUEST_URI'] = '/' . $slug . '/?fixture=1';
	$with_toc = justice_reader_ux_filter_content( $priority13 );
	$actual_toc = jt_cyprus_chain_toc_pairs( $with_toc );
	jt_cyprus_chain_assert( $expected_toc === $actual_toc, 'Rebuilt TOC differs from captured TOC minus fold items for ' . $slug . ': expected=' . json_encode( $expected_toc, JSON_UNESCAPED_UNICODE ) . ' actual=' . json_encode( $actual_toc, JSON_UNESCAPED_UNICODE ) );
	jt_cyprus_chain_assert( $with_toc === justice_reader_ux_filter_content( $with_toc ), 'Reader filter is not idempotent for ' . $slug );

	$rebuilt_headings = array_column( jt_cyprus_chain_heading_pairs( $with_toc ), 'label', 'id' );
	foreach ( $original_toc as $pair ) {
		jt_cyprus_chain_assert( isset( $rebuilt_headings[ $pair['id'] ] ), 'Historical fragment changed for ' . $slug . ': ' . $pair['id'] );
		jt_cyprus_chain_assert( $pair['label'] === $rebuilt_headings[ $pair['id'] ], 'Historical heading-to-fragment pair changed for ' . $slug . ': ' . $pair['id'] );
	}
	foreach ( $actual_toc as $pair ) {
		jt_cyprus_chain_assert( 1 === jt_cyprus_chain_id_count( $with_toc, $pair['id'] ), 'Rebuilt TOC target is missing or duplicated for ' . $slug . ': ' . $pair['id'] );
	}

	// Content-first is replayed separately on the byte-complete captured entry.
	// This preserves late modules while testing the real nested DOM exactly.
	$original_ids = jt_cyprus_chain_all_ids( $entry );
	$expected_ids = array_values( array_unique( $original_ids ) );
	$reordered    = justice_ops_content_first_filter( $entry );
	$reordered_ids = jt_cyprus_chain_all_ids( $reordered );
	jt_cyprus_chain_assert( 1 === substr_count( $reordered, 'data-jt-content-first-order=' ), 'Ordering marker count changed for ' . $slug );
	jt_cyprus_chain_assert( $reordered === justice_ops_content_first_filter( $reordered ), 'Content-first filter is not idempotent for ' . $slug );
	jt_cyprus_chain_assert( $expected_ids === $reordered_ids, 'Stable element IDs changed during captured replay for ' . $slug );
	jt_cyprus_chain_assert( count( $reordered_ids ) === count( array_unique( $reordered_ids ) ), 'Duplicate element ID remains after captured replay for ' . $slug );
	jt_cyprus_chain_assert_fold( $reordered, $slug );

	if ( 'cyprus-prices' === $slug ) {
		$price_priority13 = $priority13;
	}
}

// Ordered release-chain acceptance. The representative late callbacks prove
// reader14 runs before paid17, organic30, map32, hygiene99 and content-first.
jt_cyprus_chain_assert( '' !== $price_priority13, 'Price fixture was not captured.' );
$_SERVER['REQUEST_URI'] = '/cyprus-prices/';
$trace = array();
$chain = array(
	array( 14, static function ( string $content ) use ( &$trace ): string {
		$trace[] = 14;
		return justice_reader_ux_filter_content( $content );
	} ),
	array( 17, static function ( string $content ) use ( &$trace ): string {
		$trace[] = 17;
		return justice_cards_filter_content( $content );
	} ),
	array( 30, static function ( string $content ) use ( &$trace ): string {
		$trace[] = 30;
		return justice_fms_filter_content( $content );
	} ),
	array( 32, static function ( string $content ) use ( &$trace ): string {
		$trace[] = 32;
		return $content;
	} ),
	array( 99, static function ( string $content ) use ( &$trace ): string {
		$trace[] = 99;
		return $content . '<nav class="jt-seo-mesh"><h2 id="late-module">Late module</h2></nav>';
	} ),
	array( PHP_INT_MAX, static function ( string $content ) use ( &$trace ): string {
		$trace[] = PHP_INT_MAX;
		return justice_ops_content_first_filter( $content );
	} ),
);
usort( $chain, static fn( array $a, array $b ): int => $a[0] <=> $b[0] );
$chain_output = $price_priority13;
foreach ( $chain as $filter ) {
	$chain_output = $filter[1]( $chain_output );
}
jt_cyprus_chain_assert( array( 14, 17, 30, 32, 99, PHP_INT_MAX ) === $trace, 'Release filter priorities executed out of order.' );
$chain_toc = jt_cyprus_chain_toc_pairs( $chain_output );
$chain_labels = array_column( $chain_toc, 'label' );
jt_cyprus_chain_assert( ! in_array( 'Late module', $chain_labels, true ), 'Priority-99 module leaked into the TOC.' );
jt_cyprus_chain_assert( false === strpos( jt_cyprus_chain_class_block( $chain_output, 'jt-toc' )['element'], 'מפת עורכי הדין' ), 'Provider fold leaked into ordered-chain TOC.' );
jt_cyprus_chain_assert( false === strpos( $chain_output, 'jt-procard' ), 'Unapproved country paid card appeared in ordered chain.' );
jt_cyprus_chain_assert( strpos( $chain_output, 'Late module' ) < strpos( $chain_output, 'jt-firm-strip' ), 'Organic directory did not move behind late editorial modules.' );
jt_cyprus_chain_assert_fold( $chain_output, 'cyprus-prices ordered chain' );

$_SERVER['REQUEST_URI'] = '/online-family-law-services/';
$control = '<p>Answer</p><div class="single-article__fold"><details class="jt-cmenu">Menu</details></div><h2>Body</h2>';
$control_ordered = justice_ops_content_first_filter( $control );
jt_cyprus_chain_assert( false !== strpos( $control_ordered, 'data-jt-content-first-order=' ), 'Default article canary was not ordered.' );
jt_cyprus_chain_assert( strpos( $control_ordered, 'Body' ) < strpos( $control_ordered, 'Menu' ), 'Article-canary provider module remained above the editorial body.' );

echo "captured Cyprus content-chain tests passed\n";
