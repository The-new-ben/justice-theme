<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function is_singular( $type = null ): bool {
	return true;
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
	return (string) $value;
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

require_once dirname( __DIR__ ) . '/justice-ops/content-first-order.php';
require_once dirname( __DIR__ ) . '/justice-ops/reader-ux.php';

function jt_reader_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$source = '<script>const fake = "<h2>Script heading</h2>";</script><!-- <h2>Comment heading</h2> -->'
	. '<div class="single-article__fold"><p>Provider copy</p><h2>מפת עורכי הדין</h2></div>'
	. '<p>Direct answer</p><h2 data-id="trap">First editorial</h2><p>A</p><h2 id=custom-anchor>Second editorial</h2><p>B</p>'
	. '<h2>Third editorial</h2><p>C</p><h2>Fourth editorial</h2><p>D</p>';
$output = justice_reader_ux_filter_content( $source );
jt_reader_assert( false !== strpos( $output, '<h2 id="sec-1">מפת עורכי הדין</h2>' ), 'Skipped fold H2 lost its stable fragment ID.' );
jt_reader_assert( false !== strpos( $output, '<h2 id="sec-2" data-id="trap">First editorial</h2>' ), 'data-id was mistaken for the heading ID.' );
jt_reader_assert( false !== strpos( $output, '<h2 id=custom-anchor>Second editorial</h2>' ), 'Valid unquoted heading ID was replaced.' );
preg_match( '#<details class="jt-toc">.*?</details>#su', $output, $toc_match );
$toc = $toc_match[0] ?? '';
jt_reader_assert( false === strpos( $toc, 'מפת עורכי הדין' ), 'Fold H2 appears in the TOC.' );
jt_reader_assert( false !== strpos( $toc, 'href="#sec-2"' ), 'TOC does not preserve historic fragment ordinals.' );
jt_reader_assert( false !== strpos( $toc, 'href="#custom-anchor"' ), 'TOC did not use a valid unquoted ID.' );
jt_reader_assert( strpos( $toc, 'First editorial' ) < strpos( $toc, 'Fourth editorial' ), 'TOC order is wrong.' );
jt_reader_assert( strpos( $output, 'Direct answer' ) < strpos( $output, '<details class="jt-toc">' ), 'TOC was inserted after a paragraph inside the provider fold.' );
jt_reader_assert( strpos( $output, '<details class="jt-toc">' ) < strpos( $output, 'First editorial' ), 'TOC was not inserted after the first editorial paragraph.' );
preg_match_all( '#href="\#([^"]+)"#u', $toc, $toc_targets );
foreach ( $toc_targets[1] as $target ) {
	jt_reader_assert( 1 === preg_match_all( '#\sid\s*=\s*(?:"' . preg_quote( $target, '#' ) . '"|\'' . preg_quote( $target, '#' ) . '\'|' . preg_quote( $target, '#' ) . ')(?:\s|>)#iu', $output ), 'TOC target is missing or duplicated: ' . $target );
}

$three_editorial = '<div class="single-article__fold"><h2>Map</h2></div><p>Answer</p>'
	. '<h2>One</h2><h2>Two</h2><h2>Three</h2>';
jt_reader_assert( $three_editorial === justice_reader_ux_filter_content( $three_editorial ), 'Fold H2 incorrectly satisfied the four-editorial-section threshold.' );

$nested_duplicate = '<div class="single-article__fold"><div class="single-article__fold"><h2>Map</h2></div></div>'
	. '<p>Answer</p><h2>One</h2><h2>Two</h2><h2>Three</h2><h2>Four</h2>';
jt_reader_assert( $nested_duplicate === justice_reader_ux_filter_content( $nested_duplicate ), 'Nested duplicate folds did not fail closed.' );

echo "reader UX tests passed\n";
