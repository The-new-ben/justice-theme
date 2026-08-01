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
		case 'cron':
			define( 'DOING_CRON', true );
			break;
		case 'cli':
			define( 'WP_CLI', true );
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
$GLOBALS['justice_p0_test_approved_ids']   = array();
$GLOBALS['justice_p0_test_profile_posts']  = array();
$_SERVER['REQUEST_URI']                    = '/';

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

	/** @param array<string,mixed> $values Post field values. */
	public function __construct( array $values ) {
		$this->ID          = (int) $values['ID'];
		$this->post_type   = (string) $values['post_type'];
		$this->post_status = (string) $values['post_status'];
		$this->post_title  = (string) $values['post_title'];
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

		if ( true !== $this->flags['city_tax'] ) {
			return false;
		}

		if ( '' === $taxonomy || array() === $taxonomy ) {
			return true;
		}

		return is_array( $taxonomy )
			? in_array( 'city', $taxonomy, true )
			: 'city' === $taxonomy;
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

/** @param mixed $value */
function absint( $value ): int {
	return abs( (int) $value );
}

/** @return mixed */
function get_post( int $post_id ) {
	if ( ! isset( $GLOBALS['justice_p0_test_profile_posts'][ $post_id ] ) ) {
		return null;
	}

	return clone $GLOBALS['justice_p0_test_profile_posts'][ $post_id ];
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
			'post_title'  => 'מאיה רוטנברג חברת עורכי דין',
		) ),
		23406 => new WP_Post( array(
			'ID'          => 23406,
			'post_type'   => 'justice_lawyer',
			'post_status' => 'publish',
			'post_title'  => 'מאיה רוטנברג משרד עורכי דין',
		) ),
	);
	$GLOBALS['justice_p0_test_approved_ids'] = array();
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

/* Isolated constant-based runtime cases. */
if ( '' !== $justice_p0_runtime_scenario ) {
	$generic = new WP_Query(
		array(
			'post_type'    => 'justice_lawyer',
			'post__not_in' => array( 801 ),
		)
	);
	justice_p0_test_run_query( $generic, '/wp-json/example/v1/import/' );
	justice_p0_test_assert_same(
		array( 801 ),
		$generic->get( 'post__not_in' ),
		"{$justice_p0_runtime_scenario} generic secondary query was modified"
	);

	$explicit = new WP_Query(
		array(
			'post_type'                    => 'justice_lawyer',
			'justice_public_lawyer_listing' => true,
			'post__not_in'                  => array( 802 ),
		)
	);
	justice_p0_test_run_query( $explicit, '/wp-json/example/v1/lawyers/' );

	if ( 'rest' === $justice_p0_runtime_scenario ) {
		justice_p0_test_assert_same(
			array( 802, 23405, 23406 ),
			$explicit->get( 'post__not_in' ),
			'REST explicit public lawyer listing was not quarantined'
		);
	} else {
		justice_p0_test_assert_same(
			array( 802 ),
			$explicit->get( 'post__not_in' ),
			"{$justice_p0_runtime_scenario} explicit query escaped its runtime guard"
		);
	}

	echo "PASS: {$justice_p0_runtime_scenario} runtime scope\n";
	exit( 0 );
}

justice_p0_test_assert_same( '0.1.0', JUSTICE_P0_VERSION, 'plugin version contract changed' );
justice_p0_test_assert_same( 'p0-20260801', JUSTICE_P0_MARKER, 'plugin marker contract changed' );
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
$rest_callback           = justice_p0_test_registered_callback(
	'action',
	'rest_api_init',
	10,
	'justice_p0_register_healthcheck',
	0
);
justice_p0_test_registered_callback(
	'action',
	'pre_get_posts',
	99,
	'justice_p0_exclude_quarantined_profiles',
	1
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
	array( 91, 23405, 23406 ),
	call_user_func( $sitemap_callback, array( 91, 23405 ) ),
	'Yoast exclusion merge changed existing IDs, ordering, or de-duplication'
);
$GLOBALS['justice_p0_test_approved_ids'][23405] = true;
justice_p0_test_assert_same(
	array( 91, 23406 ),
	call_user_func( $sitemap_callback, array( 91 ) ),
	'Yoast exclusion merge ignored the approval transition'
);
justice_p0_test_reset_profiles();

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

$legacy_query = new WP_Query(
	array(
		'post_type'    => array( 'post', 'justice_lawyer' ),
		'post__not_in' => array( 502 ),
	)
);
justice_p0_test_run_query( $legacy_query, '/sitemap-jus-tice/?view=lawyers' );
justice_p0_test_assert_same(
	array( 502, 23405, 23406 ),
	$legacy_query->get( 'post__not_in' ),
	'exact legacy sitemap lawyer query was not quarantined'
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
justice_p0_test_assert_same( array( 602 ), $singular_query->get( 'post__not_in' ), 'singular query was modified' );

$secondary_query = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 603 ),
	)
);
justice_p0_test_run_query( $secondary_query, '/family-law/' );
justice_p0_test_assert_same(
	array( 603 ),
	$secondary_query->get( 'post__not_in' ),
	'generic secondary lawyer query was modified'
);

$unrelated_query = new WP_Query(
	array(
		'post_type'    => 'articles',
		'post__not_in' => array( 604 ),
	),
	array( 'main' => true )
);
justice_p0_test_run_query( $unrelated_query, '/legal-article/' );
justice_p0_test_assert_same( array( 604 ), $unrelated_query->get( 'post__not_in' ), 'unrelated query was modified' );

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
		array( 605 ),
		$strict_query->get( 'post__not_in' ),
		'explicit opt-in accepted a non-boolean value'
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

$lookalike_legacy = new WP_Query(
	array(
		'post_type'    => 'justice_lawyer',
		'post__not_in' => array( 607 ),
	)
);
justice_p0_test_run_query( $lookalike_legacy, '/sitemap-jus-tice-copy/' );
justice_p0_test_assert_same(
	array( 607 ),
	$lookalike_legacy->get( 'post__not_in' ),
	'lookalike legacy sitemap path was treated as exact'
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
justice_p0_test_assert_same( '0.1.0', $health['version'], 'healthcheck version changed' );
justice_p0_test_assert_same( 'p0-20260801', $health['marker'], 'healthcheck marker changed' );

/**
 * Run constant-based runtime guards in fresh PHP processes because constants
 * cannot be undefined safely inside one process.
 */
function justice_p0_test_runtime_process( string $scenario ): void {
	$command = escapeshellarg( PHP_BINARY ) . ' ' . escapeshellarg( __FILE__ ) . ' --runtime ' . escapeshellarg( $scenario );
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

foreach ( array( 'rest', 'importer', 'cron', 'cli' ) as $runtime_scenario ) {
	justice_p0_test_runtime_process( $runtime_scenario );
}

echo "PASS: Justice SEO Recovery P0 deterministic invariants\n";
