<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Post {
	public int $ID;
	public string $post_status = 'future';
	public string $post_date = '2026-08-27 10:07:00';
	public string $post_date_gmt = '2026-08-27 07:07:00';
	public function __construct( int $id ) { $this->ID = $id; }
}

$jt_freeze_options = array();
$jt_freeze_updates = array();
$jt_freeze_posts   = array( 21275 => new WP_Post( 21275 ) );

function add_action( $tag, $callback, $priority = 10 ): void {}
function apply_filters( $tag, $value ) { return $value; }
function get_option( $key, $default = false ) { global $jt_freeze_options; return array_key_exists( $key, $jt_freeze_options ) ? $jt_freeze_options[ $key ] : $default; }
function update_option( $key, $value, $autoload = null ): bool { global $jt_freeze_options; $jt_freeze_options[ $key ] = $value; return true; }
function get_posts( $args ): array { return array( 21275 ); }
function get_post( $id ) { global $jt_freeze_posts; return $jt_freeze_posts[ $id ] ?? null; }
function wp_update_post( $args ) { global $jt_freeze_updates; $jt_freeze_updates[] = $args; return $args['ID']; }
require_once dirname( __DIR__ ) . '/justice-ops/content-freeze.php';

if ( ! justice_ops_automatic_content_paused() ) {
	throw new RuntimeException( 'Automatic content freeze did not fail closed.' );
}

$snapshot = justice_ops_phase1_freeze_scheduled_terms();
if ( 1 !== count( $snapshot ) || 21275 !== $snapshot[0]['id'] ) {
	throw new RuntimeException( 'Scheduled encyclopedia snapshot was not retained.' );
}
if ( array( 'ID' => 21275, 'post_status' => 'draft' ) !== $jt_freeze_updates[0] ) {
	throw new RuntimeException( 'Scheduled encyclopedia entry was not returned to draft.' );
}

justice_ops_phase1_freeze_scheduled_terms();
if ( 1 !== count( $jt_freeze_updates ) ) {
	throw new RuntimeException( 'One-shot freeze was not idempotent.' );
}

echo "content freeze tests passed\n";
