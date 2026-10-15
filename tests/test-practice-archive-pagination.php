<?php
/**
 * Real pagination on the practice-areas archive (structure audit batch 2, 15.10.2026).
 *
 * The template follows the main query's page size, a page past the real items is an
 * honest 404 with no redirect, and the fallback item list is sliced to the same window.
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_query_vars = array( 'posts_per_page' => 12 );
$jt_status     = 0;
$jt_nocache    = false;
$jt_template   = '';
$jt_set_404    = false;

class WP_Query {
	public function set_404(): void {
		global $jt_set_404;
		$jt_set_404 = true;
	}
	public function is_main_query(): bool {
		return true;
	}
	public function is_tax( $taxonomy = '' ): bool {
		return false;
	}
	public function is_category(): bool {
		return false;
	}
	public function set( $key, $value ): void {}
}
$wp_query = new WP_Query();

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {}
function remove_filter( ...$args ): void {}
function is_admin(): bool {
	return false;
}
function get_query_var( $key, $default = '' ) {
	global $jt_query_vars;
	return $jt_query_vars[ $key ] ?? $default;
}
function status_header( $code ): void {
	global $jt_status;
	$jt_status = (int) $code;
}
function nocache_headers(): void {
	global $jt_nocache;
	$jt_nocache = true;
}
function get_template_part( $slug, $name = null, $args = array() ): void {
	global $jt_template;
	$jt_template = (string) $slug;
}
function get_term_by( $field, $value, $taxonomy ) {
	return false;
}
function __( $text, $domain = '' ) {
	return $text;
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' );
}

require_once dirname( __DIR__ ) . '/inc/practice-display-fixes.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

// Page size: the main query's value, one source of truth.
jt_assert( 12 === justice_theme_practice_archive_per_page(), 'Page size follows the main query.' );
$jt_query_vars['posts_per_page'] = 0;
jt_assert( 12 === justice_theme_practice_archive_per_page(), 'A missing main-query size falls back to 12.' );
$jt_query_vars['posts_per_page'] = 24;
jt_assert( 24 === justice_theme_practice_archive_per_page(), 'A changed main-query size is honoured.' );

// Page count and offsets (family-law: 217 articles on 15.10.2026).
jt_assert( 19 === justice_theme_practice_archive_page_count( 217, 12 ), '217 articles make 19 pages of 12.' );
jt_assert( 1 === justice_theme_practice_archive_page_count( 12, 12 ), 'Exactly one page of items makes one page.' );
jt_assert( 0 === justice_theme_practice_archive_page_count( 0, 12 ), 'No items, no pages.' );
jt_assert( 0 === justice_theme_practice_archive_page_count( 5, 0 ), 'A zero page size never divides by zero.' );
jt_assert( 0 === justice_theme_practice_archive_offset( 1, 12 ), 'Page 1 starts at the first item.' );
jt_assert( 12 === justice_theme_practice_archive_offset( 2, 12 ), 'Page 2 starts at item 13.' );
jt_assert( 216 === justice_theme_practice_archive_offset( 19, 12 ), 'Page 19 starts at item 217.' );
jt_assert( 0 === justice_theme_practice_archive_offset( 0, 12 ), 'A zero page never produces a negative offset.' );

// Past the end: page 1 always renders, page 20 of family-law is a 404, page 2 of a 16-article term is real.
jt_assert( ! justice_theme_practice_archive_is_past_end( 1, 0, 12 ), 'Page 1 renders even with no articles.' );
jt_assert( ! justice_theme_practice_archive_is_past_end( 19, 217, 12 ), 'The last real page renders.' );
jt_assert( justice_theme_practice_archive_is_past_end( 20, 217, 12 ), 'The page after the last real page is past the end.' );
jt_assert( ! justice_theme_practice_archive_is_past_end( 2, 16, 12 ), 'tax-law (16 articles) has a real page 2.' );
jt_assert( justice_theme_practice_archive_is_past_end( 3, 16, 12 ), 'tax-law has no page 3.' );
jt_assert( justice_theme_practice_archive_is_past_end( 2, 12, 12 ), 'Exactly 12 articles make no page 2.' );
jt_assert( justice_theme_practice_archive_is_past_end( 2, 0, 12 ), 'An empty term has no page 2.' );

// The 404 answer: status, no-cache, the 404 template, the main query flagged; no redirect anywhere.
justice_theme_practice_archive_not_found();
jt_assert( 404 === $jt_status, 'A page past the end answers 404.' );
jt_assert( $jt_nocache, 'The 404 answer is not cacheable as a page-1 copy.' );
jt_assert( '404' === $jt_template, 'The 404 template renders.' );
jt_assert( $jt_set_404, 'The main query is flagged 404 for Yoast and the body classes.' );

// The fallback list is sliced to the same window as the query.
$fallback = range( 1, 30 );
jt_assert( range( 13, 24 ) === array_slice( $fallback, justice_theme_practice_archive_offset( 2, 12 ), 12 ), 'Page 2 of the fallback list holds items 13-24.' );
jt_assert( range( 25, 30 ) === array_slice( $fallback, justice_theme_practice_archive_offset( 3, 12 ), 12 ), 'The last fallback page holds the remainder.' );
jt_assert( array() === array_slice( $fallback, justice_theme_practice_archive_offset( 4, 12 ), 12 ), 'A fallback page past the end is empty.' );

// The template itself: it paginates, never redirects, and keeps the long description to page 1.
$template = file_get_contents( dirname( __DIR__ ) . '/taxonomy-practice-areas.php' );
jt_assert( false !== strpos( $template, "'paged'            => \$justice_tax_paged" ), 'The article query carries the page number.' );
jt_assert( false !== strpos( $template, 'paginate_links(' ), 'The archive renders pagination links.' );
jt_assert( false !== strpos( $template, 'justice_theme_practice_archive_not_found()' ), 'A page past the end uses the honest 404 helper.' );
jt_assert( false === strpos( $template, 'wp_redirect' ) && false === strpos( $template, 'wp_safe_redirect' ), 'No redirect in the archive template.' );
jt_assert( strpos( $template, 'get_header();' ) > strpos( $template, 'justice_theme_practice_archive_not_found()' ), 'The 404 decision is made before any output.' );
jt_assert( false !== strpos( $template, '<?php if ( $justice_tax_is_paged ) : ?>' ) && false !== strpos( $template, '<?php elseif ( $term_desc ) : ?>' ), 'The term description renders on page 1 only.' );
jt_assert( false === strpos( $template, "'no_found_rows'" ), 'The article query counts rows so the page count is real.' );

echo "practice archive pagination tests passed\n";
