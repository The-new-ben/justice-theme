<?php
/**
 * Practice-area archive -> pillar canonical (structure audit batch 1, 15.10.2026).
 *
 * The archive of a practice area that has a pillar page emits the pillar as its
 * canonical and og:url; page 2+ keeps its own; an unpublished pillar is skipped;
 * the P0 plugin's retirement of the old static keys does not touch the pillar map.
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Post {
	public int $ID;
	public string $post_status = 'publish';
	public function __construct( int $id, string $status = 'publish' ) {
		$this->ID          = $id;
		$this->post_status = $status;
	}
}
class WP_Term {
	public string $taxonomy;
	public string $slug;
	public function __construct( string $taxonomy, string $slug ) {
		$this->taxonomy = $taxonomy;
		$this->slug     = $slug;
	}
}

$jt_filters   = array();
$jt_queried   = null;
$jt_paged     = false;
$jt_published = array( 'family-law', 'child-support', 'child-custody', 'divorce-lawyer', 'criminal-defense-attorney', 'real-estate-attorney', 'medical-malpractice-lawyer', 'personal-injury-israel', 'traffic-lawyer', 'labor-lawyer', 'inheritance-lawyer', 'immigration-lawyer', 'tax-lawyer', 'prenuptial-agreements-overview', 'legal-news' );
$jt_drafts    = array();

function add_filter( $tag, $callback, $priority = 10, $args = 1 ): void {
	global $jt_filters;
	$jt_filters[ $tag ][ $priority ][] = $callback;
}
function add_action( ...$args ): void {}
function apply_filters( $tag, $value, ...$args ) {
	global $jt_filters;
	if ( empty( $jt_filters[ $tag ] ) ) {
		return $value;
	}
	ksort( $jt_filters[ $tag ] );
	foreach ( $jt_filters[ $tag ] as $callbacks ) {
		foreach ( $callbacks as $callback ) {
			$value = $callback( $value, ...$args );
		}
	}
	return $value;
}
function home_url( $path = '' ): string {
	return 'https://jus-tice.co.il' . $path;
}
function get_queried_object() {
	global $jt_queried;
	return $jt_queried;
}
function is_paged(): bool {
	global $jt_paged;
	return $jt_paged;
}
function post_type_exists( $type ): bool {
	return in_array( $type, array( 'page', 'post', 'articles' ), true );
}
function get_page_by_path( $slug, $output = OBJECT, $post_type = 'page' ) {
	global $jt_published, $jt_drafts;
	if ( in_array( $slug, $jt_drafts, true ) ) {
		return 'page' === $post_type ? new WP_Post( 9, 'draft' ) : null;
	}
	if ( in_array( $slug, $jt_published, true ) ) {
		return 'page' === $post_type ? new WP_Post( crc32( $slug ) ) : null;
	}
	return null;
}
function get_permalink( $id = 0 ): string {
	return 'https://jus-tice.co.il/post-' . (int) $id . '/';
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function get_post_meta( $id, $key, $single = false ) {
	return '';
}
function is_post_type_archive( $type ): bool {
	return false;
}
function is_singular( $types = '' ): bool {
	return false;
}
function get_the_ID(): int {
	return 0;
}
function get_the_title( $id = 0 ): string {
	return '';
}
function wp_json_encode( $value, $flags = 0 ) {
	return json_encode( $value, $flags );
}
function esc_attr( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' );
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' );
}
function esc_url( $value ): string {
	return (string) $value;
}
function wp_strip_all_tags( $value ): string {
	return strip_tags( (string) $value );
}
function wp_trim_words( $text, $num = 55, $more = '' ): string {
	return (string) $text;
}
function has_excerpt( $id = 0 ): bool {
	return false;
}
function get_the_excerpt( $id = 0 ): string {
	return '';
}
function function_exists_stub(): bool {
	return true;
}
if ( ! defined( 'OBJECT' ) ) {
	define( 'OBJECT', 'OBJECT' );
}

require_once dirname( __DIR__ ) . '/justice-ops/seo-hierarchy.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

// The P0 recovery plugin retires the three static keys at priority 999 on the live site.
add_filter( 'justice_seo_term_canonicals', static function ( $map ) {
	unset( $map['category:news'], $map['practice-areas:child-support'], $map['practice-areas:family-law'] );
	return $map;
}, 999 );

$canonical = static function ( string $slug, bool $paged = false, string $taxonomy = 'practice-areas' ): string {
	global $jt_queried, $jt_paged;
	$jt_queried = new WP_Term( $taxonomy, $slug );
	$jt_paged   = $paged;
	return justice_seo_consolidated_url();
};

$expected = array(
	'family-law'           => '/family-law/',
	'child-support'        => '/child-support/',
	'child-custody'        => '/child-custody/',
	'divorce'              => '/divorce-lawyer/',
	'prenuptial-agreement' => '/prenuptial-agreements-overview/',
	'criminal-law'         => '/criminal-defense-attorney/',
	'real-estate'          => '/real-estate-attorney/',
	'medical-malpractice'  => '/medical-malpractice-lawyer/',
	'personal-injury'      => '/personal-injury-israel/',
	'traffic-law'          => '/traffic-lawyer/',
	'israeli-labor-law'    => '/labor-lawyer/',
	'inheritance-law'      => '/inheritance-lawyer/',
	'immigration-law'      => '/immigration-lawyer/',
	'tax-law'              => '/tax-lawyer/',
);
jt_assert( 14 === count( justice_seo_term_pillar_canonicals() ), 'Fourteen practice-area archives carry a pillar canonical.' );
foreach ( $expected as $slug => $path ) {
	jt_assert( 'https://jus-tice.co.il' . $path === $canonical( $slug ), "Archive {$slug} canonicalises to {$path} even after the P0 retirement filter." );
	jt_assert( '' === $canonical( $slug, true ), "Page 2+ of {$slug} keeps its own canonical." );
}

jt_assert( '' === $canonical( 'rabbinical-court' ), 'An archive without a pillar keeps its own canonical.' );
jt_assert( '' === $canonical( 'family-law', false, 'category' ), 'Only practice-areas terms use the pillar map.' );
jt_assert( '' === $canonical( 'news', false, 'category' ), 'A retired static key stays retired.' );

$jt_drafts = array( 'tax-lawyer' );
jt_assert( '' === $canonical( 'tax-law' ), 'An unpublished pillar is skipped: the archive never points at a dead URL.' );
$jt_drafts    = array();
$jt_published = array_diff( $jt_published, array( 'immigration-lawyer' ) );
jt_assert( '' === $canonical( 'immigration-law' ), 'A missing pillar is skipped.' );

$jt_queried = new WP_Term( 'practice-areas', 'family-law' );
$jt_paged   = false;
jt_assert( 'https://jus-tice.co.il/family-law/' === apply_filters( 'wpseo_canonical', 'https://jus-tice.co.il/practice-areas/family-law/' ), 'Yoast canonical follows the pillar.' );
jt_assert( 'https://jus-tice.co.il/family-law/' === apply_filters( 'wpseo_opengraph_url', 'https://jus-tice.co.il/practice-areas/family-law/' ), 'og:url follows the same pillar.' );

$jt_queried = null;
jt_assert( 'https://jus-tice.co.il/x/' === apply_filters( 'wpseo_canonical', 'https://jus-tice.co.il/x/' ), 'A view without a queried object keeps its canonical.' );

echo "seo term pillar canonical tests passed\n";
