<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'OBJECT', 'OBJECT' );

class WP_Post {
	public int $ID;
	public string $post_status;

	public function __construct( int $id, string $status = 'publish' ) {
		$this->ID          = $id;
		$this->post_status = $status;
	}
}

$jt_cluster_records = array();
$jt_cluster_calls   = array();

function add_filter( $tag, $callback, $priority = 10 ): void {}
function post_type_exists( $post_type ): bool { return in_array( $post_type, array( 'page', 'post', 'articles' ), true ); }
function get_page_by_path( $slug, $output, $post_type ) {
	global $jt_cluster_records, $jt_cluster_calls;
	$jt_cluster_calls[] = $post_type;
	return $jt_cluster_records[ $post_type ] ?? null;
}
function get_post_status( $post ): string { return $post->post_status; }
function get_permalink( $id ): string { return 'https://jus-tice.co.il/' . $id . '/'; }
function get_the_title( $id ): string { return 'Title ' . $id; }

require_once dirname( __DIR__ ) . '/inc/content-clusters.php';

function jt_cluster_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$jt_cluster_records = array(
	'page'     => new WP_Post( 10 ),
	'articles' => new WP_Post( 30 ),
);
$jt_cluster_calls = array();
$resolved = justice_theme_cluster_resolve_target( 'real-estate-attorney' );
jt_cluster_assert( 'https://jus-tice.co.il/10/' === $resolved['url'], 'Canonical page did not beat the same-slug article.' );
jt_cluster_assert( array( 'page' ) === $jt_cluster_calls, 'Resolver continued after finding the canonical page.' );

$jt_cluster_records = array(
	'page'     => new WP_Post( 11, 'draft' ),
	'post'     => new WP_Post( 20 ),
	'articles' => new WP_Post( 31 ),
);
$jt_cluster_calls = array();
$resolved = justice_theme_cluster_resolve_target( 'traffic-lawyer' );
jt_cluster_assert( 'https://jus-tice.co.il/20/' === $resolved['url'], 'Published post did not beat the article after a draft page.' );
jt_cluster_assert( array( 'page', 'post' ) === $jt_cluster_calls, 'Resolver post-type order is not deterministic.' );

$jt_cluster_records = array( 'articles' => new WP_Post( 32 ) );
$jt_cluster_calls = array();
$resolved = justice_theme_cluster_resolve_target( 'article-only' );
jt_cluster_assert( 'https://jus-tice.co.il/32/' === $resolved['url'], 'Article-only target no longer resolves.' );
jt_cluster_assert( array( 'page', 'post', 'articles' ) === $jt_cluster_calls, 'Article fallback order changed.' );

echo "content cluster resolver tests passed\n";
