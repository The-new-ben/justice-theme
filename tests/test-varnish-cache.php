<?php
/** Smart Varnish (HAD-284): the 12-hour shared lifetime, and which URLs are purged when content changes. */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Post {
	public $ID; public $post_type; public $post_status; public $post_name;
	public function __construct( array $a ) { foreach ( $a as $k => $v ) { $this->$k = $v; } }
}

$jt_posts = array(); $jt_actions = array(); $jt_sent = array();
function home_url( $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function add_action( $tag, $callback, $priority = 10, $args = 1 ): void { global $jt_actions; $jt_actions[ $tag ][] = $callback; }
function has_action( $tag, $callback ): bool { global $jt_actions; return in_array( $callback, $jt_actions[ $tag ] ?? array(), true ); }
function get_post( $id ) { global $jt_posts; return $jt_posts[ $id ] ?? null; }
function get_permalink( $post ): string { return 'https://jus-tice.co.il/' . $post->post_name . '/'; }
function is_post_type_viewable( $type ): bool { return in_array( $type, array( 'post', 'page', 'articles' ), true ); }
function wp_is_post_revision( $post ) { return 'revision' === $post->post_type ? 1 : false; }
function wp_is_post_autosave( $post ) { return false; }
function wp_remote_request( $url, $args ) { global $jt_sent; $jt_sent[] = array( $url, $args['method'] ); return array(); }

// Request state for the lifetime header.
$jt_q = array();
function jt_q( string $k ): bool { global $jt_q; return ! empty( $jt_q[ $k ] ); }
function is_admin(): bool { return jt_q( 'admin' ); }
function is_user_logged_in(): bool { return jt_q( 'logged_in' ); }
function is_search(): bool { return jt_q( 'search' ); }
function is_404(): bool { return jt_q( '404' ); }
function is_preview(): bool { return jt_q( 'preview' ); }
function is_feed(): bool { return jt_q( 'feed' ); }
function is_customize_preview(): bool { return jt_q( 'customize' ); }
function is_singular( $t = '' ): bool { return jt_q( 'singular' ); }
function is_front_page(): bool { return jt_q( 'front' ); }
function is_home(): bool { return jt_q( 'home' ); }
function is_archive(): bool { return jt_q( 'archive' ); }
function is_woocommerce(): bool { return jt_q( 'wc' ); }
function is_cart(): bool { return jt_q( 'cart' ); }
function is_checkout(): bool { return jt_q( 'checkout' ); }
function is_account_page(): bool { return jt_q( 'account' ); }

require_once dirname( __DIR__ ) . '/inc/varnish-cache.php';

$checks = 0;
function check( bool $ok, string $message ): void { global $checks; if ( ! $ok ) { throw new RuntimeException( $message ); } $checks++; }
function flush_sent(): array { global $jt_sent; $jt_sent = array(); justice_theme_varnish_flush(); $out = $jt_sent; $jt_sent = array(); return $out; }
function urls( array $sent ): array { return array_map( fn( $s ) => $s[0], $sent ); }

// Update of a published article: its URL and the home page, once each, with PURGE, at shutdown.
$jt_posts[5] = new WP_Post( array( 'ID' => 5, 'post_type' => 'articles', 'post_status' => 'publish', 'post_name' => 'posta' ) );
justice_theme_varnish_before_update( 5 );
justice_theme_varnish_on_transition( 'publish', 'publish', $jt_posts[5] );
justice_theme_varnish_on_transition( 'publish', 'publish', $jt_posts[5] );
check( has_action( 'shutdown', 'justice_theme_varnish_flush' ), 'flush runs at shutdown' );
$sent = flush_sent();
check( array( 'https://jus-tice.co.il/posta/', 'https://jus-tice.co.il/' ) === urls( $sent ), 'post URL and home, once each: ' . json_encode( urls( $sent ) ) );
check( array( 'PURGE' ) === array_values( array_unique( array_column( $sent, 1 ) ) ), 'PURGE method' );
check( array() === flush_sent(), 'queue empties after flush' );

// Slug change: the old and the new URL.
justice_theme_varnish_before_update( 5 );
$jt_posts[5]->post_name = 'posta-news';
justice_theme_varnish_on_transition( 'publish', 'publish', $jt_posts[5] );
check( array( 'https://jus-tice.co.il/posta/', 'https://jus-tice.co.il/posta-news/', 'https://jus-tice.co.il/' ) === urls( flush_sent() ), 'slug change purges old and new URL' );

// Trash / unpublish: the URL it had while published, and the home page.
$jt_posts[5]->post_name = 'posta';
justice_theme_varnish_before_update( 5 );
$jt_posts[5]->post_status = 'trash'; $jt_posts[5]->post_name = 'posta__trashed';
justice_theme_varnish_on_transition( 'trash', 'publish', $jt_posts[5] );
check( array( 'https://jus-tice.co.il/posta/', 'https://jus-tice.co.il/' ) === urls( flush_sent() ), 'trash purges the published URL, not the trashed slug' );

// Drafts, revisions, private types and foreign hosts never purge.
$jt_posts[6] = new WP_Post( array( 'ID' => 6, 'post_type' => 'page', 'post_status' => 'draft', 'post_name' => 'draft-page' ) );
justice_theme_varnish_before_update( 6 );
justice_theme_varnish_on_transition( 'draft', 'draft', $jt_posts[6] );
justice_theme_varnish_on_transition( 'publish', 'publish', new WP_Post( array( 'ID' => 7, 'post_type' => 'revision', 'post_status' => 'publish', 'post_name' => 'r' ) ) );
justice_theme_varnish_on_transition( 'publish', 'publish', new WP_Post( array( 'ID' => 8, 'post_type' => 'justice_lead', 'post_status' => 'publish', 'post_name' => 'lead' ) ) );
justice_theme_varnish_queue( 'https://evil.example/x/' );
check( array() === flush_sent(), 'drafts, revisions, private types and foreign hosts are ignored' );

// First publish of a draft: the new URL and the home page.
justice_theme_varnish_before_update( 6 );
$jt_posts[6]->post_status = 'publish';
justice_theme_varnish_on_transition( 'publish', 'draft', $jt_posts[6] );
check( array( 'https://jus-tice.co.il/draft-page/', 'https://jus-tice.co.il/' ) === urls( flush_sent() ), 'publish purges the new URL and home' );

// Bulk updates are capped.
for ( $i = 0; $i < 250; $i++ ) { justice_theme_varnish_queue( 'https://jus-tice.co.il/p' . $i . '/' ); }
check( 200 === count( flush_sent() ), 'at most 200 purges per request' );

// Fragments are dropped.
justice_theme_varnish_queue( 'https://jus-tice.co.il/a/#top' );
check( array( 'https://jus-tice.co.il/a/' ) === urls( flush_sent() ), 'fragment dropped' );

// Lifetime header: 12 hours for the shared cache on public pages for anonymous visitors only.
$long = 'public, max-age=0, s-maxage=43200';
$_SERVER['REQUEST_METHOD'] = 'GET';
foreach ( array( 'singular', 'front', 'home', 'archive' ) as $kind ) {
	$jt_q = array( $kind => true );
	check( $long === justice_theme_varnish_cache_control( array() ), $kind . ': 12-hour shared lifetime' );
}
foreach ( array( 'admin', 'logged_in', 'search', '404', 'preview', 'feed', 'customize' ) as $kind ) {
	$jt_q = array( 'singular' => true, $kind => true );
	check( null === justice_theme_varnish_cache_control( array() ), $kind . ': left alone' );
}
foreach ( array( 'cart', 'checkout', 'account' ) as $kind ) {
	$jt_q = array( 'singular' => true, $kind => true );
	check( null === justice_theme_varnish_cache_control( array() ), 'WooCommerce ' . $kind . ': left alone' );
}
$jt_q = array();
check( null === justice_theme_varnish_cache_control( array() ), 'anything that is not a page, a post or an archive: left alone' );
$jt_q = array( 'singular' => true );
check( null === justice_theme_varnish_cache_control( array( 'Content-Type: text/html', 'Cache-Control: no-cache, must-revalidate, max-age=0' ) ), 'an existing Cache-Control wins' );
$_SERVER['REQUEST_METHOD'] = 'POST';
check( null === justice_theme_varnish_cache_control( array() ), 'POST left alone' );
$_SERVER['REQUEST_METHOD'] = 'HEAD';
check( $long === justice_theme_varnish_cache_control( array() ), 'HEAD like GET' );

echo $checks . " varnish cache checks passed\n";
