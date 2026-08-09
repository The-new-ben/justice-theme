<?php
/**
 * Deterministic runtime checks for the bounded Justice SEO Recovery P0 plugin.
 *
 * This file provides only the small WordPress surface used by the plugin. It
 * stores every registered callback, loads the real plugin, and exercises the
 * callbacks in public and non-public query contexts.
 */

declare(strict_types=1);

define( 'ABSPATH', dirname( __DIR__ ) . DIRECTORY_SEPARATOR );
define( 'OBJECT', 'OBJECT' );

$justice_p0_runtime_scenario = '';

if ( isset( $argv[1], $argv[2] ) && '--runtime' === $argv[1] ) {
	$justice_p0_runtime_scenario = (string) $argv[2];

	switch ( $justice_p0_runtime_scenario ) {
		case 'rest':
			define( 'REST_REQUEST', true );
			break;
		case 'importer':
			define( 'WP_LOAD_IMPORTERS', true );
			break;
		case 'wp_importing':
			define( 'WP_IMPORTING', true );
			break;
		case 'importing':
			define( 'IMPORTING', true );
			break;
		case 'cron':
			define( 'DOING_CRON', true );
			break;
		case 'cli':
			define( 'WP_CLI', true );
			break;
		case 'ajax':
			define( 'DOING_AJAX', true );
			break;
		default:
			fwrite( STDERR, "FAIL: unknown runtime scenario {$justice_p0_runtime_scenario}\n" );
			exit( 1 );
	}
}

$GLOBALS['justice_p0_test_filters']        = array();
$GLOBALS['justice_p0_test_actions']        = array();
$GLOBALS['justice_p0_test_rest_routes']    = array();
$GLOBALS['justice_p0_activation_hooks']    = array();
$GLOBALS['justice_p0_deleted_transients']  = array();
$GLOBALS['justice_p0_test_is_admin']       = false;
$GLOBALS['justice_p0_test_doing_cron']     = false;
$GLOBALS['justice_p0_test_doing_ajax']     = false;
$GLOBALS['justice_p0_test_capabilities']   = array();
$GLOBALS['justice_p0_test_approved_ids']   = array();
$GLOBALS['justice_p0_test_profile_posts']  = array();
$GLOBALS['justice_p0_test_shadow_posts']   = array();
$GLOBALS['justice_p0_test_terms']          = array();
$GLOBALS['justice_p0_test_post_links']     = array();
$GLOBALS['justice_p0_test_archive_links']  = array();
$GLOBALS['justice_p0_test_term_links']     = array();
$GLOBALS['justice_p0_registered_styles']   = array();
$GLOBALS['justice_p0_enqueued_styles']     = array();
$GLOBALS['justice_p0_inline_styles']       = array();
$_SERVER['REQUEST_URI']                    = '/';
$_SERVER['QUERY_STRING']                   = '';
$_SERVER['REQUEST_METHOD']                 = 'GET';
$_GET                                      = array();
$_POST                                     = array();
$_REQUEST                                  = array();

/**
 * Minimal immutable-by-convention post record for instanceof checks.
 */
class WP_Post {
	/** @var int */
	public $ID;

	/** @var string */
	public $post_type;

	/** @var string */
	public $post_status;

	/** @var string */
	public $post_title;

	/** @var string */
	public $post_name;

	/** @param array<string,mixed> $values Post field values. */
	public function __construct( array $values ) {
		$this->ID          = (int) $values['ID'];
		$this->post_type   = (string) $values['post_type'];
		$this->post_status = (string) $values['post_status'];
		$this->post_title  = (string) $values['post_title'];
		$this->post_name   = isset( $values['post_name'] ) ? (string) $values['post_name'] : '';
	}
}

/**
 * Minimal immutable-by-convention term record for instanceof checks.
 */
class WP_Term {
	/** @var int */
	public $term_id;

	/** @var string */
	public $taxonomy;

	/** @var string */
	public $slug;

	/** @param array<string,mixed> $values Term field values. */
	public function __construct( array $values ) {
		$this->term_id = (int) $values['term_id'];
		$this->taxonomy = (string) $values['taxonomy'];
		$this->slug = (string) $values['slug'];
	}
}

/**
 * Minimal query object with controllable WordPress conditionals.
 */
class WP_Query {
	/** @var array<string,mixed> */
	public $query_vars;

	/** @var array<string,bool> */
	private $flags;

	/**
	 * @param array<string,mixed> $query_vars Query variables.
	 * @param array<string,bool>  $flags      Conditional flags.
	 */
	public function __construct( array $query_vars = array(), array $flags = array() ) {
		$this->query_vars = $query_vars;
		$this->flags      = array_merge(
			array(
				'main'           => false,
				'singular'       => false,
				'city_tax'       => false,
				'practice_tax'   => false,
				'lawyer_archive' => false,
			),
			$flags
		);
	}

	/** @return mixed */
	public function get( string $key ) {
		return array_key_exists( $key, $this->query_vars ) ? $this->query_vars[ $key ] : null;
	}

	/** @param mixed $value */
	public function set( string $key, $value ): void {
		$this->query_vars[ $key ] = $value;
	}

	public function is_main_query(): bool {
		return true === $this->flags['main'];
	}

	/** @param string|array<int,string> $post_types */
	public function is_singular( $post_types = '' ): bool {
		unset( $post_types );
		return true === $this->flags['singular'];
	}

	/** @param string|array<int,string> $post_types */
	public function is_post_type_archive( $post_types = '' ): bool {
		if ( true !== $this->flags['lawyer_archive'] ) {
			return false;
		}

		if ( '' === $post_types || array() === $post_types ) {
			return true;
		}

		return is_array( $post_types )
			? in_array( 'justice_lawyer', $post_types, true )
			: 'justice_lawyer' === $post_types;
	}

	/**
	 * @param string|array<int,string> $taxonomy Taxonomy name.
	 * @param mixed                    $term     Unused term constraint.
	 */
	public function is_tax( $taxonomy = '', $term = '' ): bool {
		unset( $term );

		$matches_city = true === $this->flags['city_tax']
			&& (
				'' === $taxonomy
				|| array() === $taxonomy
				|| ( is_array( $taxonomy ) && in_array( 'city', $taxonomy, true ) )
				|| 'city' === $taxonomy
			);
		$matches_practice = true === $this->flags['practice_tax']
			&& (
				'' === $taxonomy
				|| array() === $taxonomy
				|| ( is_array( $taxonomy ) && in_array( 'practice-areas', $taxonomy, true ) )
				|| 'practice-areas' === $taxonomy
			);

		if ( ! $matches_city && ! $matches_practice ) {
			return false;
		}

		return true;
	}
}

/**
 * Store a filter registration exactly as WordPress receives it.
 *
 * @param callable|string|array<int,mixed> $callback Callback.
 */
function add_filter( string $tag, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	if ( ! isset( $GLOBALS['justice_p0_test_filters'][ $tag ][ $priority ] ) ) {
		$GLOBALS['justice_p0_test_filters'][ $tag ][ $priority ] = array();
	}

	$GLOBALS['justice_p0_test_filters'][ $tag ][ $priority ][] = array(
		'callback'      => $callback,
		'accepted_args' => $accepted_args,
	);

	return true;
}

/**
 * Remove one exact filter registration at one exact priority.
 *
 * @param callable|string|array<int,mixed> $callback Callback.
 */
function remove_filter( string $tag, $callback, int $priority = 10 ): bool {
	if ( empty( $GLOBALS['justice_p0_test_filters'][ $tag ][ $priority ] ) ) {
		return false;
	}

	$removed = false;
	$kept    = array();

	foreach ( $GLOBALS['justice_p0_test_filters'][ $tag ][ $priority ] as $entry ) {
		if ( ! $removed && $callback === $entry['callback'] ) {
			$removed = true;
			continue;
		}

		$kept[] = $entry;
	}

	$GLOBALS['justice_p0_test_filters'][ $tag ][ $priority ] = $kept;

	return $removed;
}

/**
 * Store an action registration exactly as WordPress receives it.
 *
 * @param callable|string|array<int,mixed> $callback Callback.
 */
function add_action( string $tag, $callback, int $priority = 10, int $accepted_args = 1 ): bool {
	if ( ! isset( $GLOBALS['justice_p0_test_actions'][ $tag ][ $priority ] ) ) {
		$GLOBALS['justice_p0_test_actions'][ $tag ][ $priority ] = array();
	}

	$GLOBALS['justice_p0_test_actions'][ $tag ][ $priority ][] = array(
		'callback'      => $callback,
		'accepted_args' => $accepted_args,
	);

	return true;
}

function is_admin(): bool {
	return true === $GLOBALS['justice_p0_test_is_admin'];
}

function wp_doing_cron(): bool {
	return true === $GLOBALS['justice_p0_test_doing_cron'];
}

function wp_doing_ajax(): bool {
	return true === $GLOBALS['justice_p0_test_doing_ajax'];
}

function current_user_can( string $capability ): bool {
	return ! empty( $GLOBALS['justice_p0_test_capabilities'][ $capability ] );
}

/** @param mixed $value */
function absint( $value ): int {
	return abs( (int) $value );
}

/** @return mixed */
function get_post( int $post_id ) {
	if ( isset( $GLOBALS['justice_p0_test_profile_posts'][ $post_id ] ) ) {
		return clone $GLOBALS['justice_p0_test_profile_posts'][ $post_id ];
	}

	if ( isset( $GLOBALS['justice_p0_test_shadow_posts'][ $post_id ] ) ) {
		return clone $GLOBALS['justice_p0_test_shadow_posts'][ $post_id ];
	}

	return null;
}

/** @param int|WP_Post $post */
function get_permalink( $post ) {
	$post_id = $post instanceof WP_Post ? (int) $post->ID : (int) $post;

	return isset( $GLOBALS['justice_p0_test_post_links'][ $post_id ] )
		? $GLOBALS['justice_p0_test_post_links'][ $post_id ]
		: false;
}

/** @return string|false */
function get_post_type_archive_link( string $post_type ) {
	return isset( $GLOBALS['justice_p0_test_archive_links'][ $post_type ] )
		? $GLOBALS['justice_p0_test_archive_links'][ $post_type ]
		: false;
}

/** @return WP_Term|null */
function get_term( int $term_id, string $taxonomy = '' ) {
	if ( ! isset( $GLOBALS['justice_p0_test_terms'][ $term_id ] ) ) {
		return null;
	}

	$term = $GLOBALS['justice_p0_test_terms'][ $term_id ];

	if ( '' !== $taxonomy && $taxonomy !== $term->taxonomy ) {
		return null;
	}

	return clone $term;
}

/** @param int|WP_Term $term */
function get_term_link( $term, string $taxonomy = '' ) {
	unset( $taxonomy );
	$term_id = $term instanceof WP_Term ? (int) $term->term_id : (int) $term;

	return isset( $GLOBALS['justice_p0_test_term_links'][ $term_id ] )
		? $GLOBALS['justice_p0_test_term_links'][ $term_id ]
		: false;
}

function sanitize_title( string $title ): string {
	$title = strtolower( trim( $title ) );
	$title = preg_replace( '/[^a-z0-9_-]+/', '-', $title );

	return is_string( $title ) ? trim( $title, '-' ) : '';
}

/** @return mixed */
function get_page_by_path( string $path, string $output = OBJECT, string $post_type = 'page' ) {
	unset( $output );

	foreach ( $GLOBALS['justice_p0_test_profile_posts'] as $post ) {
		if ( $path === $post->post_name && $post_type === $post->post_type ) {
			return clone $post;
		}
	}

	return null;
}

function justice_theme_lawyer_profile_is_public_approved( int $post_id ): bool {
	return ! empty( $GLOBALS['justice_p0_test_approved_ids'][ $post_id ] );
}

/** @return mixed */
function wp_parse_url( string $url, int $component = -1 ) {
	return -1 === $component ? parse_url( $url ) : parse_url( $url, $component );
}

function trailingslashit( string $value ): string {
	return rtrim( $value, "/\\" ) . '/';
}

/** @param mixed $value */
function rest_ensure_response( $value ) {
	return $value;
}

function __return_true(): bool {
	return true;
}

function __return_false(): bool {
	return false;
}

function esc_attr( string $value ): string {
	return htmlspecialchars( $value, ENT_QUOTES, 'UTF-8' );
}

/** @param mixed $public */
function justice_theme_robots_sitemap_directive( string $output, $public ): string {
	unset( $public );
	return rtrim( $output, "\r\n" ) . "\nSitemap: https://jus-tice.co.il/wp-json/justice/v1/sitemap\n";
}

/** @param mixed $public */
function justice_p0_test_unrelated_robots_callback( string $output, $public ): string {
	unset( $public );
	return rtrim( $output, "\r\n" ) . "\nDisallow: /preserved-callback/\n";
}

/** @param callable|string|array<int,mixed> $callback */
function register_activation_hook( string $file, $callback ): void {
	$GLOBALS['justice_p0_activation_hooks'][] = array(
		'file'     => $file,
		'callback' => $callback,
	);
}

function delete_transient( string $name ): bool {
	$GLOBALS['justice_p0_deleted_transients'][] = $name;
	return true;
}

/** @param mixed $src @param array<int,string> $deps @param mixed $ver */
function wp_register_style( string $handle, $src, array $deps = array(), $ver = false, string $media = 'all' ): bool {
	$GLOBALS['justice_p0_registered_styles'][] = array(
		'handle' => $handle,
		'src'    => $src,
		'deps'   => $deps,
		'ver'    => $ver,
		'media'  => $media,
	);
	return true;
}

/** @param mixed $src @param array<int,string> $deps @param mixed $ver */
function wp_enqueue_style( string $handle, $src = '', array $deps = array(), $ver = false, string $media = 'all' ): bool {
	$GLOBALS['justice_p0_enqueued_styles'][] = array(
		'handle' => $handle,
		'src'    => $src,
		'deps'   => $deps,
		'ver'    => $ver,
		'media'  => $media,
	);
	return true;
}

function wp_add_inline_style( string $handle, string $data ): bool {
	$GLOBALS['justice_p0_inline_styles'][] = array(
		'handle' => $handle,
		'data'   => $data,
	);
	return true;
}

/**
 * Store REST route registration for deterministic inspection.
 *
 * @param string              $namespace Route namespace.
 * @param string              $route     Route path.
 * @param array<string,mixed> $args      Route arguments.
 */
function register_rest_route( string $namespace, string $route, array $args, bool $override = false ): bool {
	$GLOBALS['justice_p0_test_rest_routes'][] = array(
		'namespace' => $namespace,
		'route'     => $route,
		'args'      => $args,
		'override'  => $override,
	);

	return true;
}

/**
 * Fail immediately with a compact deterministic message.
 */
function justice_p0_test_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: {$message}\n" );
		exit( 1 );
	}
}

/**
 * @param mixed $expected Expected value.
 * @param mixed $actual   Actual value.
 */
function justice_p0_test_assert_same( $expected, $actual, string $message ): void {
	if ( $expected !== $actual ) {
		fwrite(
			STDERR,
			"FAIL: {$message}\nEXPECTED: " . var_export( $expected, true ) . "\nACTUAL: " . var_export( $actual, true ) . "\n"
		);
		exit( 1 );
	}
}

/**
 * Fetch and validate one stored callback registration.
 *
 * @return callable
 */
function justice_p0_test_registered_callback(
	string $kind,
	string $tag,
	int $priority,
	string $expected_callback,
	int $expected_args
) {
	$registry = 'filter' === $kind
		? $GLOBALS['justice_p0_test_filters']
		: $GLOBALS['justice_p0_test_actions'];
	$entries  = isset( $registry[ $tag ][ $priority ] ) ? $registry[ $tag ][ $priority ] : array();
	$matches  = array();

	foreach ( $entries as $entry ) {
		if ( $expected_callback === $entry['callback'] ) {
			$matches[] = $entry;
		}
	}

	justice_p0_test_assert_same( 1, count( $matches ), "{$tag} registration count changed" );
	justice_p0_test_assert_same( $expected_args, $matches[0]['accepted_args'], "{$tag} accepted args changed" );
	justice_p0_test_assert( is_callable( $matches[0]['callback'] ), "{$tag} callback is not callable" );

	return $matches[0]['callback'];
}

/**
 * Restore the two exact live profile fingerprints and an unapproved state.
 */
function justice_p0_test_reset_profiles(): void {
	$GLOBALS['justice_p0_test_profile_posts'] = array(
		23405 => new WP_Post( array(
			'ID'          => 23405,
			'post_type'   => 'justice_lawyer',
			'post_status' => 'publish',
			'post_name'   => 'maya-rotenberg-firm',
			'post_title'  => 'מאיה רוטנברג חברת עורכי דין',
		) ),
		23406 => new WP_Post( array(
			'ID'          => 23406,
			'post_type'   => 'justice_lawyer',
			'post_status' => 'publish',
			'post_name'   => 'maya-rotenberg-office',
			'post_title'  => 'מאיה רוטנברג משרד עורכי דין',
		) ),
	);
	$GLOBALS['justice_p0_test_approved_ids'] = array();
}

/**
 * Restore both exact shadow records and their proven dominant-route links.
 */
function justice_p0_test_reset_sitemap_collisions(): void {
	$GLOBALS['justice_p0_test_shadow_posts'] = array(
		7905 => new WP_Post( array(
			'ID'          => 7905,
			'post_type'   => 'articles',
			'post_status' => 'publish',
			'post_name'   => 'lawyers',
			'post_title'  => 'shadow article',
		) ),
	);
	$GLOBALS['justice_p0_test_terms'] = array(
		170 => new WP_Term( array(
			'term_id'  => 170,
			'taxonomy' => 'practice-areas',
			'slug'     => 'criminal-law',
		) ),
		730 => new WP_Term( array(
			'term_id'  => 730,
			'taxonomy' => 'category',
			'slug'     => 'criminal-law',
		) ),
	);
	$GLOBALS['justice_p0_test_post_links'] = array(
		7905 => 'https://jus-tice.co.il/lawyers/',
	);
	$GLOBALS['justice_p0_test_archive_links'] = array(
		'justice_lawyer' => 'https://jus-tice.co.il/lawyers/',
	);
	$GLOBALS['justice_p0_test_term_links'] = array(
		170 => 'https://jus-tice.co.il/practice-areas/criminal-law/',
		730 => 'https://jus-tice.co.il/practice-areas/criminal-law/',
	);
}

/**
 * Run the registered pre_get_posts callback once.
 */
function justice_p0_test_run_query( WP_Query $query, string $request_uri = '/' ): WP_Query {
	$_SERVER['REQUEST_URI'] = $request_uri;
	$callback               = justice_p0_test_registered_callback(
		'action',
		'pre_get_posts',
		99,
		'justice_p0_exclude_quarantined_profiles',
		1
	);
	call_user_func( $callback, $query );
	return $query;
}

$justice_p0_plugin_override = getenv( 'JUSTICE_P0_PLUGIN_FILE' );
$justice_p0_plugin = is_string( $justice_p0_plugin_override ) && '' !== $justice_p0_plugin_override
	? $justice_p0_plugin_override
	: dirname( __DIR__ ) . '/justice-seo-recovery-p0/justice-seo-recovery-p0.php';
justice_p0_test_assert( is_file( $justice_p0_plugin ), 'standalone plugin source is missing' );
require_once $justice_p0_plugin;

justice_p0_test_reset_profiles();
justice_p0_test_reset_sitemap_collisions();

/* Isolated constant-based runtime cases. */
if ( '' !== $justice_p0_runtime_scenario ) {
	if ( 'rest' === $justice_p0_runtime_scenario ) {
		$_SERVER['REQUEST_METHOD'] = 'GET';
		$pretty = new WP_Query(
			array(
				'post_type'       => 'justice_lawyer',
				'post__not_in'    => array( 801 ),
				'suppress_filters' => true,
			)
		);
		justice_p0_test_run_query( $pretty, '/wp-json/justice/v1/knowledge/professionals?area=family-law' );
		justice_p0_test_assert_same(
			array( 801, 23405, 23406 ),
			$pretty->get( 'post__not_in' ),
			'anonymous pretty REST GET with suppress_filters escaped quarantine'
		);

		$_GET['rest_route']        = '/justice/v1/legal-tools/matched-lawyers';
		$_SERVER['QUERY_STRING']   = 'rest_route=%2Fjustice%2Fv1%2Flegal-tools%2Fmatched-lawyers';
		$plain = new WP_Query(
			array(
				'post_type'    => array( 'post', 'justice_lawyer' ),
				'post__not_in' => array( 802, 23405 ),
			)
		);
		justice_p0_test_run_query( $plain, '/?rest_route=%2Fjustice%2Fv1%2Flegal-tools%2Fmatched-lawyers' );
		justice_p0_test_assert_same(
			array( 802, 23405, 23406 ),
			$plain->get( 'post__not_in' ),
			'anonymous plain REST GET did not merge exact IDs'
		);

		$public_rest_routes = array(
			'/wp/v2/justice_lawyer',
			'/wp/v2/justice_lawyer/23405',
			'/justice/v1/sitemap/lawyers',
			'/justice/v1/knowledge/professionals',
			'/justice/v1/legal-tools/matched-lawyers',
			'/justice/v1/map/offices',
		);

		foreach ( $public_rest_routes as $route_index => $route ) {
			foreach ( array( 'pretty', 'plain' ) as $transport ) {
				$_SERVER['REQUEST_METHOD'] = 'GET';
				$_GET = 'plain' === $transport ? array( 'rest_route' => $route ) : array();
				$uri  = 'plain' === $transport
					? '/?rest_route=' . rawurlencode( $route )
					: '/wp-json' . $route;
				$route_query = new WP_Query(
					array(
						'post_type'       => 'justice_lawyer',
						'post__not_in'    => array( 820 + $route_index ),
						'suppress_filters' => true,
					)
				);
				justice_p0_test_run_query( $route_query, $uri );
				justice_p0_test_assert_same(
					array( 820 + $route_index, 23405, 23406 ),
					$route_query->get( 'post__not_in' ),
					"{$transport} REST route {$route} escaped quarantine"
				);
			}
		}

		$GLOBALS['justice_p0_test_capabilities']['edit_others_posts'] = true;
		$editor = new WP_Query(
			array(
				'post_type'    => 'justice_lawyer',
				'post__not_in' => array( 803 ),
			)
		);
		justice_p0_test_run_query( $editor, '/wp-json/wp/v2/justice_lawyer' );
		justice_p0_test_assert_same(
			array( 803 ),
			$editor->get( 'post__not_in' ),
			'authenticated editor REST GET was modified'
		);

		$GLOBALS['justice_p0_test_capabilities'] = array();
		$_SERVER['REQUEST_METHOD']               = 'POST';
		$importer = new WP_Query(
			array(
				'post_type'    => 'justice_lawyer',
				'post__not_in' => array( 804 ),
			)
		);
		justice_p0_test_run_query( $importer, '/wp-json/justice/v1/lawyer-index/import' );
		justice_p0_test_assert_same(
			array( 804 ),
			$importer->get( 'post__not_in' ),
			'public REST POST importer query was modified'
		);
	} else {
		$guarded = new WP_Query(
			array(
				'post_type'    => 'justice_lawyer',
				'post__not_in' => array( 805 ),
			)
		);
		justice_p0_test_run_query( $guarded, '/lawyers/' );
		justice_p0_test_assert_same(
			array( 805 ),
			$guarded->get( 'post__not_in' ),
			"{$justice_p0_runtime_scenario} query escaped its runtime guard"
		);
	}

	echo "PASS: {$justice_p0_runtime_scenario} runtime scope\n";
	exit( 0 );
}

justice_p0_test_assert_same( '0.1.2', JUSTICE_P0_VERSION, 'plugin version contract changed' );
justice_p0_test_assert_same( 'p0-plugin-only-20260801-v3', JUSTICE_P0_MARKER, 'plugin marker contract changed' );
justice_p0_test_assert_same(
	'justice-p0-mobile-nav-recovery-inline-css',
	JUSTICE_P0_MOBILE_NAV_STYLE_ELEMENT_ID,
	'mobile navigation style element ID changed'
);
justice_p0_test_assert_same(
	'justice-p0-mobile-nav-recovery-v1',
	JUSTICE_P0_MOBILE_NAV_CSS_MARKER,
	'mobile navigation CSS marker changed'
);
justice_p0_test_assert_same(
	1,
	count( $GLOBALS['justice_p0_activation_hooks'] ),
	'activation hook registration count changed'
);
$justice_p0_activation_hook = $GLOBALS['justice_p0_activation_hooks'][0];
justice_p0_test_assert_same(
	realpath( $justice_p0_plugin ),
	realpath( $justice_p0_activation_hook['file'] ),
	'activation hook registered for a different plugin file'
);
justice_p0_test_assert(
	is_callable( $justice_p0_activation_hook['callback'] ),
	'activation hook callback is not callable'
);
call_user_func( $justice_p0_activation_hook['callback'] );
justice_p0_test_assert_same(
	array( 'justice_map_geojson_v1' ),
	$GLOBALS['justice_p0_deleted_transients'],
	'activation hook changed its exact transient purge'
);
$justice_p0_source = file_get_contents( $justice_p0_plugin );
$justice_p0_header = array();
justice_p0_test_assert(
	is_string( $justice_p0_source )
	&& 1 === preg_match( '/^\s*\*\s*Version:\s*(\S+)/m', $justice_p0_source, $justice_p0_header ),
	'plugin Version header is unreadable'
);
justice_p0_test_assert_same(
	JUSTICE_P0_VERSION,
	$justice_p0_header[1],
	'plugin Version header differs from runtime constant'
);

$post_canonical_callback = justice_p0_test_registered_callback(
	'filter',
	'justice_seo_consolidate_map',
	999,
	'justice_p0_retire_post_cross_canonicals',
	1
);
$term_canonical_callback = justice_p0_test_registered_callback(
	'filter',
	'justice_seo_term_canonicals',
	999,
	'justice_p0_retire_term_cross_canonicals',
	1
);
$sitemap_callback        = justice_p0_test_registered_callback(
	'filter',
	'wpseo_exclude_from_sitemap_by_post_ids',
	99,
	'justice_p0_merge_sitemap_exclusions',
	1
);
$term_sitemap_callback   = justice_p0_test_registered_callback(
	'filter',
	'wpseo_exclude_from_sitemap_by_term_ids',
	99,
	'justice_p0_merge_term_sitemap_exclusions',
	1
);
$rest_callback           = justice_p0_test_registered_callback(
	'action',
	'rest_api_init',
	10,
	'justice_p0_register_healthcheck',
	0
);
$after_setup_callback    = justice_p0_test_registered_callback(
	'action',
	'after_setup_theme',
	PHP_INT_MAX,
	'justice_p0_enforce_yoast_sitemaps',
	0
);
$claim_callback          = justice_p0_test_registered_callback(
	'action',
	'template_redirect',
	-100000,
	'justice_p0_sanitize_quarantined_claim_request',
	0
);
$mobile_nav_callback     = justice_p0_test_registered_callback(
	'action',
	'wp_head',
	PHP_INT_MAX,
	'justice_p0_print_mobile_nav_recovery_style',
	0
);
justice_p0_test_registered_callback(
	'action',
	'pre_get_posts',
	99,
	'justice_p0_exclude_quarantined_profiles',
	1
);

justice_p0_test_assert_same(
	array(),
	isset( $GLOBALS['justice_p0_test_filters']['robots_txt'][PHP_INT_MAX] )
		? $GLOBALS['justice_p0_test_filters']['robots_txt'][PHP_INT_MAX]
		: array(),
	'plugin registered its robots callback before the theme loaded'
);

/* Simulate the old theme loading after plugins at the same maximum priority. */
add_filter( 'robots_txt', 'justice_theme_robots_sitemap_directive', PHP_INT_MAX, 2 );
add_filter( 'robots_txt', 'justice_p0_test_unrelated_robots_callback', PHP_INT_MAX, 2 );
add_filter( 'wpseo_sitemaps_enabled', '__return_false', 10, 1 );
call_user_func( $after_setup_callback );
justice_p0_test_assert_same(
	array(),
	$GLOBALS['justice_p0_test_filters']['wpseo_sitemaps_enabled'][10],
	'old-theme Yoast __return_false callback was not removed exactly'
);
$yoast_enabled_callback = justice_p0_test_registered_callback(
	'filter',
	'wpseo_sitemaps_enabled',
	PHP_INT_MAX,
	'justice_p0_yoast_sitemaps_enabled',
	1
);
justice_p0_test_assert_same(
	true,
	call_user_func( $yoast_enabled_callback, false ),
	'late Yoast sitemap state was not forced on'
);

$robots_callback = justice_p0_test_registered_callback(
	'filter',
	'robots_txt',
	PHP_INT_MAX,
	'justice_p0_canonical_robots_sitemap',
	2
);
justice_p0_test_registered_callback(
	'filter',
	'robots_txt',
	PHP_INT_MAX,
	'justice_p0_test_unrelated_robots_callback',
	2
);
$robots_entries   = $GLOBALS['justice_p0_test_filters']['robots_txt'][PHP_INT_MAX];
$robots_callbacks = array_map(
	static function ( array $entry ) {
		return $entry['callback'];
	},
	$robots_entries
);
justice_p0_test_assert_same(
	array( 'justice_p0_test_unrelated_robots_callback', 'justice_p0_canonical_robots_sitemap' ),
	$robots_callbacks,
	'late robots enforcement did not remove only the old theme callback and register P0 last'
);

$robots_input = "User-agent: *\r\nDisallow: /private/\r\nSitemap: https://old.example/sitemap.xml\r\nAllow: /public/\r\n  sItEmAp : https://old.example/second.xml\r\n";
$robots_expected = "User-agent: *\nDisallow: /private/\nAllow: /public/\nDisallow: /preserved-callback/\nSitemap: https://jus-tice.co.il/sitemap_index.xml\n";
$robots_output   = $robots_input;

foreach ( $robots_entries as $robots_entry ) {
	$robots_output = call_user_func( $robots_entry['callback'], $robots_output, true );
}

justice_p0_test_assert_same(
	$robots_expected,
	$robots_output,
	'robots filter changed non-Sitemap directives or canonical output'
);
justice_p0_test_assert_same(
	1,
	preg_match_all( '/^Sitemap: https:\/\/jus-tice\.co\.il\/sitemap_index\.xml$/m', $robots_output ),
	'robots output did not contain exactly one canonical sitemap directive'
);

$mobile_nav_css = '/* justice-p0-mobile-nav-recovery-v1 */@media (max-width:920px){html.nav-is-open,body.nav-is-open{overflow:hidden!important}html.nav-is-open .jt2-header nav.primary-navigation{bottom:auto!important;height:auto!important;max-height:calc(100vh - 9rem)!important;max-height:calc(100dvh - 9rem)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important}html.nav-is-open .jt2-header nav.primary-navigation #primary-menu>li>a{color:var(--jt2-ivory,#f8f3ea)!important}html.nav-is-open .jt2-header nav.primary-navigation #primary-menu>li.jt-nav-ai>a{color:#e7c765!important}}';
justice_p0_test_assert_same(
	$mobile_nav_css,
	justice_p0_mobile_nav_recovery_css(),
	'mobile navigation recovery CSS bytes changed'
);
justice_p0_test_assert_same(
	1,
	substr_count( $mobile_nav_css, JUSTICE_P0_MOBILE_NAV_CSS_MARKER ),
	'mobile navigation recovery marker count changed'
);
$vh_position  = strpos( $mobile_nav_css, 'max-height:calc(100vh - 9rem)!important' );
$dvh_position = strpos( $mobile_nav_css, 'max-height:calc(100dvh - 9rem)!important' );
justice_p0_test_assert(
	false !== $vh_position && false !== $dvh_position && $vh_position < $dvh_position,
	'100vh fallback does not immediately precede the 100dvh mobile bound'
);
ob_start();
call_user_func( $mobile_nav_callback );
$mobile_nav_head_output = ob_get_clean();
justice_p0_test_assert_same(
	'<style id="justice-p0-mobile-nav-recovery-inline-css" data-noptimize="1">' . $mobile_nav_css . "</style>\n",
	$mobile_nav_head_output,
	'mobile navigation wp_head element identity, attribute, or CSS bytes changed'
);
justice_p0_test_assert_same(
	1,
	substr_count( $mobile_nav_head_output, '<style id="justice-p0-mobile-nav-recovery-inline-css" data-noptimize="1">' ),
	'mobile navigation wp_head element was not emitted exactly once'
);
justice_p0_test_assert_same(
	'justice-p0-mobile-nav-recovery-inline-css',
	JUSTICE_P0_MOBILE_NAV_STYLE_ELEMENT_ID,
	'mobile navigation style element ID changed'
);
justice_p0_test_assert_same(
	array(),
	$GLOBALS['justice_p0_registered_styles'],
	'legacy mobile navigation style registration survived'
);
justice_p0_test_assert_same(
	array(),
	$GLOBALS['justice_p0_enqueued_styles'],
	'legacy mobile navigation style enqueue survived'
);
justice_p0_test_assert_same(
	array(),
	$GLOBALS['justice_p0_inline_styles'],
	'legacy wp_add_inline_style output survived'
);

$post_canonicals = array(
	'mutual-divorce-agreement-2025' => 'free-divorce-agreement-template',
	'mediation-divorce'             => 'divorce-mediation',
	'immigration-to-portugal'       => 'portugal-immigration-guide',
	'%d7%a2%d7%9c%d7%95%d7%aa-%d7%a2%d7%95%d7%a8%d7%9a-%d7%93%d7%99%d7%9f-%d7%a4%d7%9c%d7%99%d7%9c%d7%99-%d7%9e%d7%97%d7%99%d7%a8%d7%99%d7%9d-%d7%a9%d7%9b%d7%a8-%d7%98%d7%a8%d7%97%d7%94-%d7%95%d7%9e' => 'criminal-law-price-list-lawyer-recommended-review-costs',
	'עלות-עורך-דין-פלילי-מחירים-שכר-טרחה-ומ' => 'criminal-law-price-list-lawyer-recommended-review-costs',
	'control-owner'                 => 'control-target',
);
$expected_canonicals = $post_canonicals;
unset( $expected_canonicals['mediation-divorce'], $expected_canonicals['immigration-to-portugal'] );
justice_p0_test_assert_same(
	$expected_canonicals,
	call_user_func( $post_canonical_callback, $post_canonicals ),
	'post canonical retirement changed removals or preserved mappings'
);
justice_p0_test_assert_same(
	array( 'control:future' => '/future-owner/' ),
	call_user_func(
		$term_canonical_callback,
		array(
			'category:news'                => '/news-owner/',
			'practice-areas:child-support' => '/child-support-owner/',
			'practice-areas:family-law'    => '/family-law-owner/',
			'control:future'                => '/future-owner/',
		)
	),
	'term canonical retirement changed removals or preserved mappings'
);

justice_p0_test_assert(
	justice_p0_is_exact_sitemap_url_collision(
		'https://jus-tice.co.il/lawyers/',
		'https://jus-tice.co.il/lawyers/'
	),
	'exact absolute sitemap URL collision was not recognized'
);
foreach (
	array(
		array( 'https://jus-tice.co.il/lawyers/', 'https://jus-tice.co.il/lawyers' ),
		array( 'https://jus-tice.co.il/lawyers/?source=test', 'https://jus-tice.co.il/lawyers/?source=test' ),
		array( 'https://jus-tice.co.il/lawyers/#proof', 'https://jus-tice.co.il/lawyers/#proof' ),
		array( '/lawyers/', '/lawyers/' ),
		array( false, false ),
	) as $non_collision
) {
	justice_p0_test_assert(
		! justice_p0_is_exact_sitemap_url_collision( $non_collision[0], $non_collision[1] ),
		'non-exact or unsafe sitemap URL was accepted as a collision'
	);
}

justice_p0_test_assert(
	justice_p0_article_7905_is_lawyer_archive_shadow(),
	'exact article 7905 collision fingerprint was not recognized'
);
foreach (
	array(
		'ID'          => 7906,
		'post_type'   => 'post',
		'post_status' => 'draft',
		'post_name'   => 'lawyers-copy',
	) as $field => $replacement
) {
	justice_p0_test_reset_sitemap_collisions();
	$GLOBALS['justice_p0_test_shadow_posts'][7905]->{$field} = $replacement;
	justice_p0_test_assert(
		! justice_p0_article_7905_is_lawyer_archive_shadow(),
		"article 7905 {$field} drift did not release its sitemap exclusion"
	);
}
justice_p0_test_reset_sitemap_collisions();
$GLOBALS['justice_p0_test_post_links'][7905] = 'https://jus-tice.co.il/lawyers-copy/';
justice_p0_test_assert(
	! justice_p0_article_7905_is_lawyer_archive_shadow(),
	'article 7905 permalink drift did not release its sitemap exclusion'
);
justice_p0_test_reset_sitemap_collisions();
$GLOBALS['justice_p0_test_archive_links']['justice_lawyer'] = 'https://jus-tice.co.il/lawyers-copy/';
justice_p0_test_assert(
	! justice_p0_article_7905_is_lawyer_archive_shadow(),
	'justice_lawyer archive drift did not release article 7905 sitemap exclusion'
);
justice_p0_test_reset_sitemap_collisions();
$GLOBALS['justice_p0_test_post_links'][7905] = 'https://jus-tice.co.il/lawyers/?collision=ambiguous';
$GLOBALS['justice_p0_test_archive_links']['justice_lawyer'] = 'https://jus-tice.co.il/lawyers/?collision=ambiguous';
justice_p0_test_assert(
	! justice_p0_article_7905_is_lawyer_archive_shadow(),
	'query-bearing article collision was not rejected fail-safe'
);

justice_p0_test_reset_sitemap_collisions();
justice_p0_test_assert(
	justice_p0_term_170_is_category_730_shadow(),
	'exact term 170/category 730 collision fingerprint was not recognized'
);
foreach (
	array(
		'term_id'  => 171,
		'taxonomy' => 'category',
		'slug'     => 'criminal-law-copy',
	) as $field => $replacement
) {
	justice_p0_test_reset_sitemap_collisions();
	$GLOBALS['justice_p0_test_terms'][170]->{$field} = $replacement;
	justice_p0_test_assert(
		! justice_p0_term_170_is_category_730_shadow(),
		"term 170 {$field} drift did not release its sitemap exclusion"
	);
}
foreach (
	array(
		'term_id'  => 731,
		'taxonomy' => 'practice-areas',
		'slug'     => 'criminal-law-copy',
	) as $field => $replacement
) {
	justice_p0_test_reset_sitemap_collisions();
	$GLOBALS['justice_p0_test_terms'][730]->{$field} = $replacement;
	justice_p0_test_assert(
		! justice_p0_term_170_is_category_730_shadow(),
		"dominant category 730 {$field} drift did not release term 170 exclusion"
	);
}
justice_p0_test_reset_sitemap_collisions();
$GLOBALS['justice_p0_test_term_links'][170] = 'https://jus-tice.co.il/practice-areas/criminal-law-copy/';
justice_p0_test_assert(
	! justice_p0_term_170_is_category_730_shadow(),
	'term 170 link drift did not release its sitemap exclusion'
);
justice_p0_test_reset_sitemap_collisions();
$GLOBALS['justice_p0_test_term_links'][170] = 'https://jus-tice.co.il/practice-areas/criminal-law/?collision=ambiguous';
$GLOBALS['justice_p0_test_term_links'][730] = 'https://jus-tice.co.il/practice-areas/criminal-law/?collision=ambiguous';
justice_p0_test_assert(
	! justice_p0_term_170_is_category_730_shadow(),
	'query-bearing term collision was not rejected fail-safe'
);
justice_p0_test_assert_same(
	array(),
	call_user_func( $term_sitemap_callback, array() ),
	'term sitemap exclusion survived after its collision predicate failed'
);
justice_p0_test_reset_sitemap_collisions();
justice_p0_test_assert_same(
	array( 170 ),
	call_user_func( $term_sitemap_callback, array() ),
	'exact weaker term 170 was not added to Yoast exclusions'
);
justice_p0_test_assert_same(
	array( 91, 730, 170 ),
	call_user_func( $term_sitemap_callback, array( 91, 730, 91 ) ),
	'term sitemap merge changed existing IDs, added category 730, or failed to de-duplicate'
);

$expected_fingerprints = array(
	23405 => array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'publish',
		'post_title'  => 'מאיה רוטנברג חברת עורכי דין',
	),
	23406 => array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'publish',
		'post_title'  => 'מאיה רוטנברג משרד עורכי דין',
	),
);
justice_p0_test_assert_same(
	$expected_fingerprints,
	justice_p0_profile_fingerprints(),
	'profile fingerprint contract changed'
);
justice_p0_test_assert_same(
	array( 23405, 23406 ),
	justice_p0_quarantined_profile_ids(),
	'exact unapproved profile IDs were not quarantined'
);

foreach ( array( 'ID', 'post_type', 'post_status', 'post_title' ) as $fingerprint_field ) {
	justice_p0_test_reset_profiles();
	$replacement = array(
		'ID'          => 99999,
		'post_type'   => 'post',
		'post_status' => 'draft',
		'post_title'  => 'changed title',
	);
	$GLOBALS['justice_p0_test_profile_posts'][23405]->{$fingerprint_field} = $replacement[ $fingerprint_field ];
	$expected_quarantine = 'post_title' === $fingerprint_field
		? array( 23405, 23406 )
		: array( 23406 );
	justice_p0_test_assert_same(
		$expected_quarantine,
		justice_p0_quarantined_profile_ids(),
		"profile {$fingerprint_field} drift violated the quarantine contract"
	);
}

justice_p0_test_reset_profiles();
$GLOBALS['justice_p0_test_approved_ids'][23405] = true;
justice_p0_test_assert_same(
	array( 23406 ),
	justice_p0_quarantined_profile_ids(),
	'approval transition did not release profile 23405'
);
$GLOBALS['justice_p0_test_approved_ids'][23406] = true;
justice_p0_test_assert_same(
	array(),
	justice_p0_quarantined_profile_ids(),
	'approval transition did not release both profiles'
);

justice_p0_test_reset_profiles();
justice_p0_test_assert_same(
	array( 91, 23405, 23406, 7905 ),
	call_user_func( $sitemap_callback, array( 91, 23405 ) ),
	'Yoast exclusion merge changed existing IDs, ordering, or de-duplication'
);
$GLOBALS['justice_p0_test_approved_ids'][23405] = true;
justice_p0_test_assert_same(
	array( 91, 23406, 7905 ),
	call_user_func( $sitemap_callback, array( 91 ) ),
	'Yoast exclusion merge ignored the approval transition'
);
justice_p0_test_reset_profiles();
justice_p0_test_reset_sitemap_collisions();
$GLOBALS['justice_p0_test_shadow_posts'][7905]->post_status = 'draft';
justice_p0_test_assert_same(
	array( 91, 23405, 23406 ),
	call_user_func( $sitemap_callback, array( 91 ) ),
	'article sitemap exclusion survived after its exact fingerprint failed'
);
justice_p0_test_reset_sitemap_collisions();

$city_query = new WP_Query(
	array( 'post__not_in' => array( 501 ) ),
	array(
		'main'     => true,
		'city_tax' => true,
	)
);
justice_p0_test_run_query( $city_query, '/city/tel-aviv/' );
justice_p0_test_assert_same(
	array( 501, 23405, 23406 ),
	$city_query->get( 'post__not_in' ),
	'public main city archive was not quarantined'
);

$practice_query = new WP_Query(
	array( 'post__not_in' => array( 5011 ) ),
	array(
		'main'         => true,
		'practice_tax' => true,
	)
);
justice_p0_test_run_query( $practice_query, '/practice-areas/family-law/' );
justice_p0_test_assert_same(
	array( 5011, 23405, 23406 ),
	$practice_query->get( 'post__not_in' ),
	'mixed main practice taxonomy with empty post_type was not quarantined'
);

$archive_query = new WP_Query(
	array( 'post_type' => 'justice_lawyer' ),
	array(
		'main'           => true,
		'lawyer_archive' => true,
	)
);
justice_p0_test_run_query( $archive_query, '/lawyers/' );
justice_p0_test_assert_same(
	array( 23405, 23406 ),
	$archive_query->get( 'post__not_in' ),
	'public main lawyer archive was not quarantined'
);

$xml_query = new WP_Query(
	array(
		'post_type'       => array( 'post', 'justice_lawyer' ),
		'post__not_in'    => array( 502, 23405 ),
		'suppress_filters' => true,
	)
);
justice_p0_test_run_query( $xml_query, '/wp-json/justice/v1/sitemap/lawyers' );
justice_p0_test_assert_same(
	array( 502, 23405, 23406 ),
	$xml_query->get( 'post__not_in' ),
	'public XML lawyer query with suppress_filters did not merge exact IDs'
);

$opt_in_query = new WP_Query(
	array(
		'post_type'                    => 'justice_lawyer',
		'justice_public_lawyer_listing' => true,
	)
);
justice_p0_test_run_query( $opt_in_query, '/controlled-lawyer-list/' );
justice_p0_test_assert_same(
	array( 23405, 23406 ),
	$opt_in_query->get( 'post__not_in' ),
	'explicit public lawyer listing was not quarantined'
);

$GLOBALS['justice_p0_test_is_admin'] = true;
$admin_query = new WP_Query(
	array( 'post__not_in' => array( 601 ) ),
	array(
		'main'     => true,
		'city_tax' => true,
	)
);
justice_p0_test_run_query( $admin_query, '/wp-admin/edit.php' );
justice_p0_test_assert_same( array( 601 ), $admin_query->get( 'post__not_in' ), 'admin query was modified' );
$GLOBALS['justice_p0_test_is_admin'] = false;

$singular_query = new WP_Query(
	array(
		'post_type'                    => 'justice_lawyer',
		'justice_public_lawyer_listing' => true,
		'post__not_in'                  => array( 602 ),
	),
	array(
		'main'           => true,
		'singular'       => true,
		'lawyer_archive' => true,
	)
);
justice_p0_test_run_query( $singular_query, '/lawyer/example/' );
justice_p0_test_assert_same(
	array( 602, 23405, 23406 ),
	$singular_query->get( 'post__not_in' ),
	'anonymous public lawyer singular did not receive the bounded quarantine'
);

$secondary_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 603 ),
	)
);
justice_p0_test_run_query( $secondary_query, '/family-law/' );
justice_p0_test_assert_same(
	array( 603, 23405, 23406 ),
	$secondary_query->get( 'post__not_in' ),
	'generic secondary HTML lawyer query was not quarantined'
);

$main_search_query = new WP_Query(
	array(
		's'            => 'lawyer search',
		'post__not_in' => array( 6031 ),
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $main_search_query, '/?s=lawyer+search' );
justice_p0_test_assert_same(
	array( 6031, 23405, 23406 ),
	$main_search_query->get( 'post__not_in' ),
	'main search with empty post_type could still return quarantined IDs'
);

$mixed_post_in_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__in'     => array( 701, 23405, '23406', 702, 701 ),
		'post__not_in' => array( 703 ),
	)
);
justice_p0_test_run_query( $mixed_post_in_query, '/featured-lawyers/' );
justice_p0_test_assert_same(
	array( 701, 702 ),
	$mixed_post_in_query->get( 'post__in' ),
	'mixed post__in retained quarantined IDs or changed safe ordering'
);
justice_p0_test_assert_same(
	array( 703, 23405, 23406 ),
	$mixed_post_in_query->get( 'post__not_in' ),
	'mixed post__in query did not retain merged post__not_in evidence'
);

$all_bad_post_in_query = new WP_Query(
	array(
		'post_type' => 'justice_lawyer',
		'post__in'  => array( 23405, '23406', 23405 ),
	)
);
justice_p0_test_run_query( $all_bad_post_in_query, '/featured-lawyers/' );
justice_p0_test_assert_same(
	array( 0 ),
	$all_bad_post_in_query->get( 'post__in' ),
	'all-quarantined post__in did not become the non-empty no-result sentinel'
);

$direct_singular_query = new WP_Query(
	array(
		'post_type' => 'justice_lawyer',
		'p'         => '23405',
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $direct_singular_query, '/lawyers/quarantined-profile/' );
justice_p0_test_assert_same(
	0,
	$direct_singular_query->get( 'p' ),
	'direct quarantined p selector was not neutralized'
);
justice_p0_test_assert_same(
	array( 0 ),
	$direct_singular_query->get( 'post__in' ),
	'direct quarantined p query was not forced to no results'
);

$equivalent_singular_query = new WP_Query(
	array( 'page_id' => 23406 ),
	array( 'main' => true )
);
justice_p0_test_run_query( $equivalent_singular_query, '/?page_id=23406' );
justice_p0_test_assert_same(
	0,
	$equivalent_singular_query->get( 'page_id' ),
	'quarantined page_id selector was not neutralized'
);
justice_p0_test_assert_same(
	0,
	$equivalent_singular_query->get( 'p' ),
	'quarantined page_id did not neutralize its related p selector'
);
justice_p0_test_assert_same(
	array( 0 ),
	$equivalent_singular_query->get( 'post__in' ),
	'equivalent quarantined singular ID query was not forced to no results'
);

$attachment_singular_query = new WP_Query(
	array(
		'attachment_id' => 23405,
		'p'             => 23405,
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $attachment_singular_query, '/?attachment_id=23405' );
justice_p0_test_assert_same(
	0,
	$attachment_singular_query->get( 'attachment_id' ),
	'quarantined attachment_id selector was not neutralized'
);
justice_p0_test_assert_same(
	0,
	$attachment_singular_query->get( 'p' ),
	'quarantined attachment_id mapped p selector was not neutralized'
);
justice_p0_test_assert_same(
	array( 0 ),
	$attachment_singular_query->get( 'post__in' ),
	'quarantined attachment_id query lacked the no-result sentinel'
);

$subpost_singular_query = new WP_Query(
	array(
		'subpost_id'   => 23406,
		'attachment_id' => 23406,
		'p'            => 23406,
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $subpost_singular_query, '/?subpost_id=23406' );
foreach ( array( 'subpost_id', 'attachment_id', 'p' ) as $neutralized_key ) {
	justice_p0_test_assert_same(
		0,
		$subpost_singular_query->get( $neutralized_key ),
		"quarantined subpost selector did not neutralize {$neutralized_key}"
	);
}
justice_p0_test_assert_same(
	array( 0 ),
	$subpost_singular_query->get( 'post__in' ),
	'quarantined subpost query lacked the no-result sentinel'
);

$unrelated_query = new WP_Query(
	array(
		'post_type'    => 'articles',
		'post__not_in' => array( 604 ),
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $unrelated_query, '/legal-article/' );
justice_p0_test_assert_same(
	array( 604, 23405, 23406 ),
	$unrelated_query->get( 'post__not_in' ),
	'public main query did not receive the bounded cross-post-type exclusion'
);

foreach ( array( 1, '1' ) as $non_boolean_opt_in ) {
	$strict_query = new WP_Query(
		array(
			'post_type'                    => 'justice_lawyer',
			'justice_public_lawyer_listing' => $non_boolean_opt_in,
			'post__not_in'                  => array( 605 ),
		)
	);
	justice_p0_test_run_query( $strict_query, '/controlled-lawyer-list/' );
	justice_p0_test_assert_same(
		array( 605, 23405, 23406 ),
		$strict_query->get( 'post__not_in' ),
		'public lawyer query incorrectly depended on a boolean theme opt-in'
	);
}

$wrong_type_opt_in = new WP_Query(
	array(
		'post_type'                    => 'articles',
		'justice_public_lawyer_listing' => true,
		'post__not_in'                  => array( 606 ),
	)
);
justice_p0_test_run_query( $wrong_type_opt_in, '/controlled-lawyer-list/' );
justice_p0_test_assert_same(
	array( 606 ),
	$wrong_type_opt_in->get( 'post__not_in' ),
	'explicit opt-in modified a non-lawyer query'
);

$secondary_non_lawyer_post_in = new WP_Query(
	array(
		'post_type'    => 'articles',
		'post__in'     => array( 23405, 6061 ),
		'post__not_in' => array( 6062 ),
	)
);
justice_p0_test_run_query( $secondary_non_lawyer_post_in, '/internal-article-widget/' );
justice_p0_test_assert_same(
	array( 23405, 6061 ),
	$secondary_non_lawyer_post_in->get( 'post__in' ),
	'non-main non-lawyer post__in query was modified'
);
justice_p0_test_assert_same(
	array( 6062 ),
	$secondary_non_lawyer_post_in->get( 'post__not_in' ),
	'non-main non-lawyer post__not_in query was modified'
);

$lookalike_legacy = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 607 ),
	)
);
justice_p0_test_run_query( $lookalike_legacy, '/sitemap-jus-tice-copy/' );
justice_p0_test_assert_same(
	array( 607, 23405, 23406 ),
	$lookalike_legacy->get( 'post__not_in' ),
	'generic public lawyer query incorrectly depended on an HTML path allowlist'
);

$GLOBALS['justice_p0_test_doing_cron'] = true;
$cron_function_query = new WP_Query(
	array(
		'post_type'                    => 'justice_lawyer',
		'justice_public_lawyer_listing' => true,
		'post__not_in'                  => array( 608 ),
	)
);
justice_p0_test_run_query( $cron_function_query, '/scheduled-job/' );
justice_p0_test_assert_same(
	array( 608 ),
	$cron_function_query->get( 'post__not_in' ),
	'wp_doing_cron query escaped its runtime guard'
);
$GLOBALS['justice_p0_test_doing_cron'] = false;

$GLOBALS['justice_p0_test_doing_ajax'] = true;
$ajax_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 609 ),
	)
);
justice_p0_test_run_query( $ajax_query, '/wp-admin/admin-ajax.php?action=preview' );
justice_p0_test_assert_same(
	array( 609 ),
	$ajax_query->get( 'post__not_in' ),
	'wp_doing_ajax query escaped its runtime guard'
);
$GLOBALS['justice_p0_test_doing_ajax'] = false;

$GLOBALS['justice_p0_test_capabilities']['edit_others_posts'] = true;
$editor_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 610 ),
	)
);
justice_p0_test_run_query( $editor_query, '/lawyers/?preview=1' );
justice_p0_test_assert_same(
	array( 610 ),
	$editor_query->get( 'post__not_in' ),
	'authenticated editor preview query was modified'
);
$GLOBALS['justice_p0_test_capabilities'] = array();

$_SERVER['REQUEST_METHOD'] = 'POST';
$post_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 611 ),
	)
);
justice_p0_test_run_query( $post_query, '/wp-json/justice/v1/lawyer-index/import' );
justice_p0_test_assert_same(
	array( 611 ),
	$post_query->get( 'post__not_in' ),
	'public POST importer query was modified'
);

$_SERVER['REQUEST_METHOD'] = 'HEAD';
$head_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 612 ),
	)
);
justice_p0_test_run_query( $head_query, '/lawyers/' );
justice_p0_test_assert_same(
	array( 612, 23405, 23406 ),
	$head_query->get( 'post__not_in' ),
	'anonymous public HEAD lawyer query was not quarantined'
);
$_SERVER['REQUEST_METHOD'] = 'GET';

justice_p0_test_reset_profiles();
$GLOBALS['justice_p0_test_approved_ids'][23405] = true;
$partially_approved_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 613, 23406 ),
	)
);
justice_p0_test_run_query( $partially_approved_query, '/family-law/' );
justice_p0_test_assert_same(
	array( 613, 23406 ),
	$partially_approved_query->get( 'post__not_in' ),
	'approval did not release only profile 23405 or merge existing exclusions'
);

$approved_direct_query = new WP_Query(
	array(
		'post_type' => 'justice_lawyer',
		'p'         => 23405,
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $approved_direct_query, '/lawyers/approved-profile/' );
justice_p0_test_assert_same(
	23405,
	$approved_direct_query->get( 'p' ),
	'approved direct p selector was neutralized'
);
justice_p0_test_assert_same(
	null,
	$approved_direct_query->get( 'post__in' ),
	'approved direct profile query was forced to the no-result sentinel'
);
justice_p0_test_assert_same(
	array( 23406 ),
	$approved_direct_query->get( 'post__not_in' ),
	'approved direct profile query lost the remaining exact quarantine'
);

$approved_scalar_cases = array(
	'page_id' => array( 'page_id' => 23405 ),
	'attachment_id' => array( 'attachment_id' => 23405, 'p' => 23405 ),
	'subpost_id' => array( 'subpost_id' => 23405, 'attachment_id' => 23405, 'p' => 23405 ),
);

foreach ( $approved_scalar_cases as $approved_case => $approved_query_vars ) {
	$approved_scalar_query = new WP_Query( $approved_query_vars, array( 'main' => true ) );
	justice_p0_test_run_query( $approved_scalar_query, '/lawyers/approved-profile/' );

	foreach ( $approved_query_vars as $approved_key => $approved_value ) {
		justice_p0_test_assert_same(
			$approved_value,
			$approved_scalar_query->get( $approved_key ),
			"approved {$approved_case} query changed {$approved_key}"
		);
	}

	justice_p0_test_assert_same(
		null,
		$approved_scalar_query->get( 'post__in' ),
		"approved {$approved_case} query was forced to the no-result sentinel"
	);
}

$GLOBALS['justice_p0_test_approved_ids'][23406] = true;
$fully_approved_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 614 ),
	)
);
justice_p0_test_run_query( $fully_approved_query, '/family-law/' );
justice_p0_test_assert_same(
	array( 614 ),
	$fully_approved_query->get( 'post__not_in' ),
	'approval was not the sole release path for both exact profiles'
);

justice_p0_test_reset_profiles();
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI']    = '/lawyer-registration/?utm_source=owner&claim_profile_id=23405&plan_interest=free';
$_SERVER['QUERY_STRING']   = 'utm_source=owner&claim_profile_id=23405&plan_interest=free';
$_GET = array(
	'utm_source'       => 'owner',
	'claim_profile_id' => '23405',
	'plan_interest'    => 'free',
);
$_REQUEST = $_GET;
call_user_func( $claim_callback );
justice_p0_test_assert(
	! isset( $_GET['claim_profile_id'] ) && ! isset( $_REQUEST['claim_profile_id'] ),
	'quarantined claim ID remained in GET or REQUEST'
);
justice_p0_test_assert_same(
	array( 'utm_source' => 'owner', 'plan_interest' => 'free' ),
	$_GET,
	'claim scrub changed unrelated GET parameters'
);
justice_p0_test_assert_same(
	'/lawyer-registration/?utm_source=owner&plan_interest=free',
	$_SERVER['REQUEST_URI'],
	'claim scrub did not preserve the registration path and unrelated URI parameters'
);
justice_p0_test_assert_same(
	'utm_source=owner&plan_interest=free',
	$_SERVER['QUERY_STRING'],
	'claim scrub did not preserve unrelated QUERY_STRING parameters'
);
justice_p0_test_assert(
	false === strpos( (string) $justice_p0_source, 'wp_safe_redirect' )
	&& false === strpos( (string) $justice_p0_source, 'wp_redirect' ),
	'claim quarantine introduced a redirect instead of preserving the browser URL'
);

justice_p0_test_reset_profiles();
$_SERVER['REQUEST_URI']  = '/lawyer-registration/?keep=slug&claim_profile=maya-rotenberg-office&utm_medium=manual';
$_SERVER['QUERY_STRING'] = 'keep=slug&claim_profile=maya-rotenberg-office&utm_medium=manual';
$_GET = array(
	'keep'          => 'slug',
	'claim_profile' => 'maya-rotenberg-office',
	'utm_medium'    => 'manual',
);
$_REQUEST = $_GET;
call_user_func( $claim_callback );
justice_p0_test_assert_same(
	array( 'keep' => 'slug', 'utm_medium' => 'manual' ),
	$_GET,
	'quarantined slug-only claim remained in GET or changed unrelated values'
);
justice_p0_test_assert_same(
	'/lawyer-registration/?keep=slug&utm_medium=manual',
	$_SERVER['REQUEST_URI'],
	'quarantined slug-only claim remained in REQUEST_URI'
);
justice_p0_test_assert_same(
	'keep=slug&utm_medium=manual',
	$_SERVER['QUERY_STRING'],
	'quarantined slug-only claim remained in QUERY_STRING'
);

justice_p0_test_reset_profiles();
$GLOBALS['justice_p0_test_approved_ids'][23406] = true;
$_SERVER['REQUEST_URI']  = '/lawyer-registration/?claim_profile=maya-rotenberg-office&keep=approved-slug';
$_SERVER['QUERY_STRING'] = 'claim_profile=maya-rotenberg-office&keep=approved-slug';
$_GET = array( 'claim_profile' => 'maya-rotenberg-office', 'keep' => 'approved-slug' );
$_REQUEST = $_GET;
call_user_func( $claim_callback );
justice_p0_test_assert_same(
	array( 'claim_profile' => 'maya-rotenberg-office', 'keep' => 'approved-slug' ),
	$_GET,
	'approved slug-only claim was scrubbed'
);
justice_p0_test_assert_same(
	'/lawyer-registration/?claim_profile=maya-rotenberg-office&keep=approved-slug',
	$_SERVER['REQUEST_URI'],
	'approved slug-only claim request URI was changed'
);

justice_p0_test_reset_profiles();
$GLOBALS['justice_p0_test_approved_ids'][23405] = true;
$_SERVER['REQUEST_URI']  = '/lawyer-registration/?claim_profile_id=23405&keep=yes';
$_SERVER['QUERY_STRING'] = 'claim_profile_id=23405&keep=yes';
$_GET = array( 'claim_profile_id' => '23405', 'keep' => 'yes' );
$_REQUEST = $_GET;
call_user_func( $claim_callback );
justice_p0_test_assert_same(
	array( 'claim_profile_id' => '23405', 'keep' => 'yes' ),
	$_GET,
	'approved claim ID was scrubbed'
);
justice_p0_test_assert_same(
	'/lawyer-registration/?claim_profile_id=23405&keep=yes',
	$_SERVER['REQUEST_URI'],
	'approved claim request URI was changed'
);

justice_p0_test_reset_profiles();
$GLOBALS['justice_p0_test_capabilities']['edit_others_posts'] = true;
$_SERVER['REQUEST_URI']  = '/lawyer-registration/?claim_profile_id=23406&keep=editor';
$_SERVER['QUERY_STRING'] = 'claim_profile_id=23406&keep=editor';
$_GET = array( 'claim_profile_id' => '23406', 'keep' => 'editor' );
$_REQUEST = $_GET;
call_user_func( $claim_callback );
justice_p0_test_assert_same(
	array( 'claim_profile_id' => '23406', 'keep' => 'editor' ),
	$_GET,
	'editor registration inspection was scrubbed'
);
$GLOBALS['justice_p0_test_capabilities'] = array();

$_SERVER['REQUEST_URI']  = '/contact/?claim_profile_id=23406&keep=contact';
$_SERVER['QUERY_STRING'] = 'claim_profile_id=23406&keep=contact';
$_GET = array( 'claim_profile_id' => '23406', 'keep' => 'contact' );
$_REQUEST = $_GET;
call_user_func( $claim_callback );
justice_p0_test_assert_same(
	array( 'claim_profile_id' => '23406', 'keep' => 'contact' ),
	$_GET,
	'non-registration request was scrubbed'
);

$_SERVER['REQUEST_URI']  = '/';
$_SERVER['QUERY_STRING'] = '';
$_GET                    = array();
$_REQUEST                = array();

call_user_func( $rest_callback );
justice_p0_test_assert_same( 1, count( $GLOBALS['justice_p0_test_rest_routes'] ), 'healthcheck route count changed' );
$health_route = $GLOBALS['justice_p0_test_rest_routes'][0];
justice_p0_test_assert_same( 'justice-seo-recovery/v1', $health_route['namespace'], 'healthcheck namespace changed' );
justice_p0_test_assert_same( '/healthcheck', $health_route['route'], 'healthcheck route changed' );
justice_p0_test_assert(
	isset( $health_route['args']['callback'] ) && is_callable( $health_route['args']['callback'] ),
	'healthcheck route callback is not callable'
);
$health = call_user_func( $health_route['args']['callback'] );
justice_p0_test_assert(
	is_array( $health ) && isset( $health['version'], $health['marker'] ),
	'healthcheck response omitted its release identity'
);
justice_p0_test_assert_same( '0.1.2', $health['version'], 'healthcheck version changed' );
justice_p0_test_assert_same( 'p0-plugin-only-20260801-v3', $health['marker'], 'healthcheck marker changed' );

/**
 * Run constant-based runtime guards in fresh PHP processes because constants
 * cannot be undefined safely inside one process.
 */
function justice_p0_test_runtime_process( string $scenario ): void {
	$command = array( PHP_BINARY, __FILE__, '--runtime', $scenario );
	$spec    = array(
		0 => array( 'pipe', 'r' ),
		1 => array( 'pipe', 'w' ),
		2 => array( 'pipe', 'w' ),
	);
	$pipes   = array();
	$process = proc_open( $command, $spec, $pipes, dirname( __DIR__ ) );

	justice_p0_test_assert( is_resource( $process ), "could not start {$scenario} runtime process" );
	fclose( $pipes[0] );
	$stdout = stream_get_contents( $pipes[1] );
	$stderr = stream_get_contents( $pipes[2] );
	fclose( $pipes[1] );
	fclose( $pipes[2] );
	$status = proc_close( $process );

	justice_p0_test_assert_same(
		0,
		$status,
		"{$scenario} runtime process failed: " . trim( (string) $stderr . "\n" . (string) $stdout )
	);
	justice_p0_test_assert(
		false !== strpos( (string) $stdout, "PASS: {$scenario} runtime scope" ),
		"{$scenario} runtime process did not finish its assertions"
	);
}

foreach ( array( 'rest', 'importer', 'wp_importing', 'importing', 'cron', 'cli', 'ajax' ) as $runtime_scenario ) {
	justice_p0_test_runtime_process( $runtime_scenario );
}

echo "PASS: Justice SEO Recovery P0 deterministic invariants\n";
