<?php
declare(strict_types=1);
/**
 * Stub harness for justice-ops/legal-entities.php: proves the wiring layer
 * renders where the theme applies the_content outside the loop, the Yoast
 * breadcrumb gets the pillar, the seeder adopts interrupted drafts, and the
 * refresh pass touches only pages nobody edited. Run: php tests/test-legal-entities-wiring.php
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'OBJECT', 'OBJECT' );

class WP_Post {
	public int $ID;
	public string $post_name;
	public string $post_type;
	public string $post_status;
	public string $post_content;
	public string $post_title;
	public string $post_modified_gmt;
	public function __construct( int $id, string $name, string $type = 'page', string $status = 'publish', string $content = 'body', string $modified = '2026-09-07 13:41:00' ) {
		$this->ID                = $id;
		$this->post_name         = $name;
		$this->post_type         = $type;
		$this->post_status       = $status;
		$this->post_content      = $content;
		$this->post_title        = 'Title of ' . $name;
		$this->post_modified_gmt = $modified;
	}
}
class WP_Error {}

$jt_filters   = array();
$jt_posts     = array(); // slug => WP_Post
$jt_options   = array();
$jt_transient = array();
$jt_meta      = array();
$jt_updates   = array();
$jt_inserts   = array();
$jt_queried   = null;
$jt_next_id   = 1000;

function add_filter( $tag, $callback, $priority = 10 ): void { global $jt_filters; $jt_filters[ $tag ][ $priority ] = $callback; }
function add_action( ...$args ): void {}
function is_admin(): bool { return false; }
function is_feed(): bool { return false; }
function is_archive(): bool { return false; }
function is_search(): bool { return false; }
function is_home(): bool { return false; }
function is_main_query(): bool { return true; }
function in_the_loop(): bool { return false; } // The practice-landing part: the_content applied outside the loop.
function wp_doing_ajax(): bool { return false; }
function wp_doing_cron(): bool { return false; }
function get_queried_object() { global $jt_queried; return $jt_queried; }
function wp_parse_url( $url, $component = -1 ) { return parse_url( $url, $component ); }
function untrailingslashit( $s ): string { return rtrim( (string) $s, '/' ); }
function esc_url( $u ): string { return (string) $u; }
function esc_html( $s ): string { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function home_url( $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function get_permalink( $post ): string { return home_url( '/' . $post->post_name . '/' ); }
function get_the_title( $post ): string { return $post->post_title; }
function wp_list_pluck( $list, $field ): array { return array_map( static fn( $i ) => $i[ $field ], $list ); }
function get_page_by_path( $path, $output = OBJECT, $types = 'page' ) { global $jt_posts; return $jt_posts[ $path ] ?? null; }
function get_option( $key, $default = false ) { global $jt_options; return $jt_options[ $key ] ?? $default; }
function update_option( $key, $value, $autoload = null ): bool { global $jt_options; $jt_options[ $key ] = $value; return true; }
function delete_option( $key ): bool { global $jt_options; unset( $jt_options[ $key ] ); return true; }
function get_transient( $key ) { global $jt_transient; return $jt_transient[ $key ] ?? false; }
function set_transient( $key, $value, $ttl = 0 ): bool { global $jt_transient; $jt_transient[ $key ] = $value; return true; }
function delete_transient( $key ): bool { global $jt_transient; unset( $jt_transient[ $key ] ); return true; }
function wp_slash( $v ) { return $v; }
function is_wp_error( $v ): bool { return $v instanceof WP_Error; }
function wp_date( $f ): string { return '2026-09-07 13:45:00'; }
function wp_timezone_string(): string { return 'Asia/Jerusalem'; }
function get_post_field( $field, $id ) { global $jt_posts; foreach ( $jt_posts as $p ) { if ( $p->ID === (int) $id ) { return $p->$field; } } return ''; }
function get_post_meta( $id, $key, $single = false ) { global $jt_meta; return $jt_meta[ (int) $id ][ $key ] ?? ''; }
function update_post_meta( $id, $key, $value ): bool { global $jt_meta; $jt_meta[ (int) $id ][ $key ] = $value; return true; }
function wp_insert_post( $arr, $wp_error = false ) {
	global $jt_posts, $jt_inserts, $jt_next_id;
	$id = ++$jt_next_id;
	$jt_posts[ $arr['post_name'] ] = new WP_Post( $id, $arr['post_name'], $arr['post_type'], $arr['post_status'], (string) $arr['post_content'] );
	$jt_inserts[] = $arr['post_name'];
	return $id;
}
function wp_update_post( $arr, $wp_error = false ) {
	global $jt_posts, $jt_updates;
	foreach ( $jt_posts as $p ) {
		if ( $p->ID === (int) $arr['ID'] ) {
			if ( isset( $arr['post_status'] ) ) { $p->post_status = $arr['post_status']; }
			if ( isset( $arr['post_content'] ) ) { $p->post_content = $arr['post_content']; }
			$jt_updates[] = $p->post_name;
			return $p->ID;
		}
	}
	return new WP_Error();
}
function register_rest_route( ...$args ): void {}
function add_shortcode( $tag, $cb ): void { global $jt_shortcodes; $jt_shortcodes[ $tag ] = $cb; }
function shortcode_atts( $defaults, $atts, $tag = '' ): array { return array_merge( $defaults, array_intersect_key( $atts, $defaults ) ); }
function apply_filters( $tag, $value, ...$args ) { global $jt_filters; if ( isset( $jt_filters[ $tag ] ) ) { foreach ( $jt_filters[ $tag ] as $cb ) { $value = $cb( $value, ...$args ); } } return $value; }
function sanitize_title( $s ): string { return strtolower( preg_replace( '/[^a-z0-9-]/', '', (string) $s ) ); }

class JT_WPDB {
	public string $posts = 'wp_posts';
	public array $queries = array();
	public function prepare( $sql, ...$args ): string { $this->queries[] = $sql; return $sql . '|' . json_encode( $args ); }
	public function get_col( $sql ): array {
		global $jt_posts;
		$live = array();
		foreach ( $jt_posts as $p ) { if ( 'page' === $p->post_type && 'publish' === $p->post_status ) { $live[] = $p->post_name; } }
		return $live;
	}
}
$wpdb = new JT_WPDB();

require __DIR__ . '/../justice-ops/legal-entities.php';

$failures = 0;
function check( string $label, bool $ok ): void { global $failures; echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n"; if ( ! $ok ) { $failures++; } }

$index = justice_ops_entity_index();
check( 'index loads 5 waves x 47 = 235 entities', 235 === count( $index['by_slug'] ) );
check( 'malpractice pillar has 47 entities', 47 === count( $index['by_pillar']['medical-malpractice-lawyer'] ?? array() ) );

// Live pillars and every entity page as published pages.
$jt_posts['divorce-lawyer']            = new WP_Post( 7274, 'divorce-lawyer' );
$jt_posts['criminal-defense-attorney'] = new WP_Post( 20211, 'criminal-defense-attorney' );
$jt_posts['medical-malpractice-lawyer'] = new WP_Post( 30001, 'medical-malpractice-lawyer' );
$jt_posts['labor-lawyer']              = new WP_Post( 341, 'labor-lawyer', 'articles' );
$id = 40000;
foreach ( $index['by_slug'] as $slug => $entry ) { $jt_posts[ $slug ] = new WP_Post( ++$id, $slug ); }

$the_content = $jt_filters['the_content'][28];

// 1. Pillar page rendered by the practice-landing part: in_the_loop() is false, queried object is the page.
$jt_queried = $jt_posts['divorce-lawyer'];
$_SERVER['REQUEST_URI'] = '/divorce-lawyer/';
$out = $the_content( '<p>pillar body</p>' );
check( 'hub renders on /divorce-lawyer/ outside the loop', false !== strpos( $out, 'jt-entity-hub' ) && substr_count( $out, '<li>' ) >= 3 );
check( 'hub keeps the original body first', 0 === strpos( $out, '<p>pillar body</p>' ) );
check( 'hub is not duplicated on a second pass', 1 === substr_count( $the_content( $out ), 'jt-entity-hub' ) );
check( 'hub uses one query for existence, not one per entity', 1 === count( $wpdb->queries ) );

// 2. Controlled practice route: main query re-typed, queried object is not the page.
$jt_queried = null;
$_SERVER['REQUEST_URI'] = '/medical-malpractice-lawyer/?utm=x';
$out = $the_content( '<p>body</p>' );
check( 'hub renders on the controlled /medical-malpractice-lawyer/ route from the request path', false !== strpos( $out, 'jt-entity-hub' ) && 30 === substr_count( $out, '<li>' ) );
check( 'hub links are plain parameter-free paths', ! preg_match( '/href="[^"]*\?/', $out ) );

// 3. Entity page: crumb with the pillar link in front of the content.
$jt_queried = $jt_posts['res-ipsa-loquitur-israel'];
$_SERVER['REQUEST_URI'] = '/res-ipsa-loquitur-israel/';
$out = $the_content( '<p>entity body</p>' );
check( 'entity page gets the hierarchy line first', 0 === strpos( $out, '<nav class="jt-entity-crumb"' ) );
check( 'hierarchy line links home and the pillar', false !== strpos( $out, 'href="https://jus-tice.co.il/"' ) && false !== strpos( $out, 'href="https://jus-tice.co.il/medical-malpractice-lawyer/"' ) );
check( 'entity page gets no hub', false === strpos( $out, 'jt-entity-hub' ) );

// 3b. Design contract: template functions, shortcode, restyle filter, auto-wire off.
$jt_queried = $jt_posts['divorce-lawyer'];
$_SERVER['REQUEST_URI'] = '/divorce-lawyer/';
check( 'template function: hub html for a pillar by slug', substr_count( justice_ops_entity_hub_html( 'medical-malpractice-lawyer' ), '<li>' ) === 30 );
check( 'template function: hub html defaults to the served pillar', justice_ops_entity_hub_html() === justice_ops_entity_hub_html( 'divorce-lawyer' ) && 9 === substr_count( justice_ops_entity_hub_html(), '<li>' ) );
check( 'template function: crumb html for an entity by slug', false !== strpos( justice_ops_entity_crumb_html( 'sachar-minimum-2026' ), '/labor-lawyer/' ) && '' === justice_ops_entity_crumb_html( 'about-us' ) );
check( 'shortcode [justice_entity_hub pillar=…] renders with a custom title', false !== strpos( $jt_shortcodes['justice_entity_hub']( array( 'pillar' => 'labor-lawyer', 'title' => 'כלים לעובדים' ) ), '<h2>כלים לעובדים</h2>' ) );
check( 'data function: items carry slug/title/description/url for live pages only', count( justice_ops_entity_items( 'labor-lawyer', 5 ) ) === 5 && isset( justice_ops_entity_items( 'labor-lawyer', 1 )[0]['description'] ) );
$jt_filters['justice_ops_entity_hub_html'][10] = static fn( $html, $pillar, $items ) => '<div class="astra-hub" data-count="' . count( $items ) . '"></div>';
check( 'restyle filter replaces the hub markup', '<div class="astra-hub" data-count="9"></div>' === justice_ops_entity_hub_html( 'divorce-lawyer' ) );
unset( $jt_filters['justice_ops_entity_hub_html'] );
$jt_filters['justice_ops_entity_auto_wire'][10] = '__return_false_stub';
function __return_false_stub(): bool { return false; }
check( 'auto-wire off: the_content is left alone for a template that places the hub itself', '<p>pillar body</p>' === $the_content( '<p>pillar body</p>' ) );
unset( $jt_filters['justice_ops_entity_auto_wire'] );

// 4. Unrelated page: untouched.
$jt_queried = new WP_Post( 5, 'about-us' );
$_SERVER['REQUEST_URI'] = '/about-us/';
check( 'unrelated page content is returned as is', '<p>x</p>' === $the_content( '<p>x</p>' ) );

// 5. Yoast breadcrumb links get the pillar inserted before the current page.
$yoast = $jt_filters['wpseo_breadcrumb_links'][10];
$jt_queried = $jt_posts['sachar-minimum-2026'];
$_SERVER['REQUEST_URI'] = '/sachar-minimum-2026/';
$links = $yoast( array( array( 'url' => 'https://jus-tice.co.il/', 'text' => 'ראשי' ), array( 'url' => 'https://jus-tice.co.il/sachar-minimum-2026/', 'text' => 'שכר מינימום' ) ) );
check( 'Yoast breadcrumb: home > pillar > entity', 3 === count( $links ) && 'https://jus-tice.co.il/labor-lawyer/' === $links[1]['url'] );
check( 'Yoast breadcrumb: not inserted twice', 3 === count( $yoast( $links ) ) );

// 6. Seeder adopts an interrupted run: one wave pending, 3 empty drafts with our marker exist, an editor's unmarked empty draft and one living slug are skipped.
$jt_posts = array();
$jt_posts['medical-malpractice-lawyer'] = new WP_Post( 30001, 'medical-malpractice-lawyer' );
foreach ( array( 'checking-negligence-claim-grounds', 'obtaining-medical-records-copy', 'attaching-expert-opinion-claim' ) as $draft ) {
	$jt_posts[ $draft ] = new WP_Post( ++$id, $draft, 'page', 'draft', '' );
	$jt_meta[ $id ]['_justice_ops_entity_seed'] = 'justice_ops_entity_wave_medical-malpractice-w5';
}
$jt_posts['kol-habriut-hotline']     = new WP_Post( ++$id, 'kol-habriut-hotline', 'page', 'draft', '' ); // An editor's own empty draft: no marker.
$jt_posts['res-ipsa-loquitur-israel'] = new WP_Post( ++$id, 'res-ipsa-loquitur-israel', 'page', 'publish', '<p>owner wrote this</p>' );
foreach ( justice_ops_entity_waves() as $key => $file ) { $jt_options[ $key ] = 'done:2026-09-07 12:00:00 created:47 skipped:0'; $jt_options[ $key . '_data' ] = md5_file( $file ); }
unset( $jt_options['justice_ops_entity_wave_medical-malpractice-w5'], $jt_options['justice_ops_entity_wave_medical-malpractice-w5_data'] );
$jt_transient = array();
$jt_updates   = array();
justice_ops_entity_seed();
$first_batch = count( $jt_inserts ) + count( $jt_updates );
check( 'seeder: the first request writes at most one batch, releases the lock, keeps progress', $first_batch > 0 && $first_batch <= JUSTICE_OPS_ENTITY_BATCH && empty( $jt_transient ) && is_array( get_option( 'justice_ops_entity_wave_medical-malpractice-w5_progress' ) ) );
$rounds = 1;
while ( ! get_option( 'justice_ops_entity_wave_medical-malpractice-w5' ) && $rounds < 40 ) { justice_ops_entity_request_worked( false ); justice_ops_entity_seed(); $rounds++; }
$state = (string) get_option( 'justice_ops_entity_wave_medical-malpractice-w5' );
check( 'seeder: 42 inserted + 3 adopted marked drafts = created:45, editor draft + living slug skipped:2, across ' . $rounds . ' requests', 42 === count( $jt_inserts ) && false !== strpos( $state, 'created:45 skipped:2' ) && $rounds >= 9 && null === get_option( 'justice_ops_entity_wave_medical-malpractice-w5_progress', null ) );
check( 'seeder: a page inserted in an early batch links a sibling from a later batch by title', false !== strpos( $jt_posts['checking-negligence-claim-grounds']->post_content, '/known-complication-versus-negligence/' ) );
check( 'seeder: adopted drafts were published with content', 'publish' === $jt_posts['obtaining-medical-records-copy']->post_status && false !== strpos( $jt_posts['obtaining-medical-records-copy']->post_content, 'בקצרה' ) );
check( 'seeder: the editor\'s unmarked draft stays a draft, untouched', 'draft' === $jt_posts['kol-habriut-hotline']->post_status && '' === $jt_posts['kol-habriut-hotline']->post_content );
check( 'seeder: new drafts carry the ownership marker', 'justice_ops_entity_wave_medical-malpractice-w5' === get_post_meta( $jt_posts['venue-malpractice-claim-court']->ID, '_justice_ops_entity_seed', true ) );
check( 'seeder: the living slug was not touched', '<p>owner wrote this</p>' === $jt_posts['res-ipsa-loquitur-israel']->post_content );
check( 'same request: refresh backs off after the seeder worked', ( function () { global $jt_updates; $jt_options_before = $GLOBALS['jt_options']; $GLOBALS['jt_options']['justice_ops_entity_wave_family-law-w1_data'] = 'stale'; $before = count( $jt_updates ); justice_ops_entity_refresh(); $GLOBALS['jt_options'] = $jt_options_before; return count( $jt_updates ) === $before; } )() );
check( 'seeder: lock released and data hash recorded', empty( $jt_transient ) && get_option( 'justice_ops_entity_wave_medical-malpractice-w5_data' ) === md5_file( __DIR__ . '/../justice-ops/data/legal-entities/medical-malpractice-w5.php' ) );
check( 'seeder: fingerprint stored on seeded pages', '' !== get_post_meta( $jt_posts['checking-negligence-claim-grounds']->ID, '_justice_ops_entity_hash', true ) );
check( 'seeder: rendered page links the simulation and the pillar', false !== strpos( $jt_posts['checking-negligence-claim-grounds']->post_content, '/legal-simulation/' ) && false !== strpos( $jt_posts['checking-negligence-claim-grounds']->post_content, '/medical-malpractice-lawyer/' ) );

// 7. Refresh, in a NEW request: wave 1 data changed (hash stale). Untouched page (old modified stamp, no fingerprint) refreshes; edited page is kept.
justice_ops_entity_request_worked( false );
$jt_updates = array();
$jt_options['justice_ops_entity_wave_family-law-w1'] = 'done:2026-09-07 16:40:21 created:47 skipped:0';
$jt_options['justice_ops_entity_wave_family-law-w1_data'] = 'stale';
foreach ( $index['by_pillar'] as $pillar => $entries ) { $jt_posts[ $pillar ] = $jt_posts[ $pillar ] ?? new WP_Post( ++$id, $pillar ); }
foreach ( $index['by_slug'] as $slug => $entry ) {
	if ( isset( $jt_posts[ $slug ] ) ) { continue; }
	$jt_posts[ $slug ] = new WP_Post( ++$id, $slug, 'page', 'publish', '<p>seeded</p>', '2026-09-07 13:40:10' ); // 16:40 Jerusalem = 13:40 UTC
}
$jt_posts['fees-rabbinical-courts']->post_modified_gmt = '2026-09-07 18:00:00'; // The owner edited this one later.
justice_ops_entity_refresh();
$first = count( $jt_updates );
check( 'refresh: the first request re-renders at most one batch', $first > 0 && $first <= JUSTICE_OPS_ENTITY_BATCH && empty( $jt_transient ) );
$rounds = 1;
while ( ! get_option( 'justice_ops_entity_wave_family-law-w1_refresh' ) && $rounds < 40 ) { justice_ops_entity_request_worked( false ); justice_ops_entity_refresh(); $rounds++; }
$refresh = (string) get_option( 'justice_ops_entity_wave_family-law-w1_refresh' );
check( 'refresh: 46 untouched wave-1 pages re-rendered, 1 edited page kept', false !== strpos( $refresh, 'refreshed:46 kept:1' ) && ! in_array( 'fees-rabbinical-courts', $jt_updates, true ) );
check( 'refresh: only wave 1 pages were touched, each once, across ' . $rounds . ' requests', 46 === count( array_unique( $jt_updates ) ) && $rounds >= 10 && ! array_diff( $jt_updates, array_keys( $jt_posts ) ) );
$dead_left = 0;
$fixed     = 0;
foreach ( $jt_updates as $slug ) {
	$dead_left += substr_count( $jt_posts[ $slug ]->post_content, 'family_fee' ) + substr_count( $jt_posts[ $slug ]->post_content, 'departments/about/about2' );
	$fixed     += substr_count( $jt_posts[ $slug ]->post_content, 'תקנות_בית_המשפט_לעניני_משפחה_(אגרות)' );
}
check( 'refresh: no dead gov.il link left in any re-rendered page, fixed links present', 0 === $dead_left && $fixed >= 5 );
check( 'refresh: data hash now current', md5_file( __DIR__ . '/../justice-ops/data/legal-entities/family-law-w1.php' ) === get_option( 'justice_ops_entity_wave_family-law-w1_data' ) );

// 8. Refresh with fingerprint (new request): an edited page whose stored fingerprint no longer matches is kept.
justice_ops_entity_request_worked( false );
$jt_updates = array();
$jt_options['justice_ops_entity_wave_family-law-w1_data'] = 'stale';
$jt_meta[ $jt_posts['temporary-alimony']->ID ]['_justice_ops_entity_hash'] = 'different';
$jt_posts['temporary-alimony']->post_modified_gmt = '2026-09-08 09:00:00';
$rounds = 0;
while ( get_option( 'justice_ops_entity_wave_family-law-w1_data' ) !== md5_file( __DIR__ . '/../justice-ops/data/legal-entities/family-law-w1.php' ) && $rounds < 40 ) { justice_ops_entity_request_worked( false ); justice_ops_entity_refresh(); $rounds++; }
check( 'refresh: fingerprint mismatch means the page is the owner\'s now', ! in_array( 'temporary-alimony', $jt_updates, true ) );

echo $failures ? "\n$failures FAILED\n" : "\nALL PASS\n";
exit( $failures ? 1 : 0 );
