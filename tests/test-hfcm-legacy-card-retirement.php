<?php
/**
 * Isolated regression tests for the reversible HFCM retirement bridge.
 */

define( 'ABSPATH', __DIR__ . '/' );

$jt_hfcm_routes        = array();
$jt_hfcm_actions       = array();
$jt_hfcm_cleaned_posts = array();
$jt_hfcm_cache_deletes = array();
$jt_hfcm_can_manage    = true;

class WP_Error {
	private $code;
	private $message;
	private $data;

	public function __construct( $code, $message, $data = null ) {
		$this->code    = $code;
		$this->message = $message;
		$this->data    = $data;
	}

	public function get_error_code() {
		return $this->code;
	}

	public function get_error_data() {
		return $this->data;
	}
}

class WP_REST_Request {
	private $params;

	public function __construct( array $params ) {
		$this->params = $params;
	}

	public function get_param( $key ) {
		return array_key_exists( $key, $this->params ) ? $this->params[ $key ] : null;
	}
}

class JT_HFCM_Fake_WPDB {
	public $prefix = 'wp_';
	public $options = 'wp_options';
	public $last_error = '';
	public $rows = array();
	public $option_rows = array();
	public $queries = array();
	public $engines = array( 'wp_hfcm_scripts' => 'InnoDB', 'wp_options' => 'InnoDB' );
	public $fail_update_id = 0;
	public $locked_state_override_once = null;
	public $locked_state_query_count = 0;
	private $transaction_backup = null;

	public function __construct() {
		$this->rows = array(
			5 => $this->row( 5, "מומחה ג'אסטיס", '[12219,12264]', "מומחה ג'אסטיס" ),
			6 => $this->row( 6, "צוות ג'אסטיס", '[12219]', "מומלץ ג'אסטיס" ),
			7 => $this->row( 7, "צוות ג'אסטיס", '[12264]', "מומלץ ג'אסטיס" ),
		);
	}

	private function row( $id, $name, $posts, $label ) {
		$markup = '<div class="lawyer-card-container"><img src="jus-tice-expert.webp"><h2>' . $label . '</h2></div>';
		return (object) array(
			'script_id'   => $id,
			'name'        => $name,
			'snippet'     => htmlentities( $markup, ENT_QUOTES | ENT_HTML5, 'UTF-8' ),
			'status'      => 'active',
			'location'    => 'header',
			'display_on'  => 's_posts',
			's_posts'     => $posts,
			'device_type' => 'both',
		);
	}

	public function prepare( $query, ...$args ) {
		foreach ( $args as $arg ) {
			$replacement = "'" . str_replace( "'", "''", (string) $arg ) . "'";
			$query       = preg_replace( '/%s/', $replacement, $query, 1 );
		}
		return $query;
	}

	public function get_var( $sql ) {
		$this->last_error = '';
		if ( false !== strpos( $sql, 'SELECT option_value' ) ) {
			if ( false !== strpos( $sql, 'FOR UPDATE' ) ) {
				++$this->locked_state_query_count;
			}
			$key = 'justice_ops_hfcm_legacy_head_cards_v2';
			if ( is_array( $this->locked_state_override_once ) ) {
				$value = maybe_serialize( $this->locked_state_override_once );
				$this->locked_state_override_once = null;
				$this->option_rows[ $key ]['option_value'] = $value;
				if ( is_array( $this->transaction_backup ) ) {
					$this->transaction_backup['options'][ $key ]['option_value'] = $value;
				}
			}
			return isset( $this->option_rows[ $key ] ) ? $this->option_rows[ $key ]['option_value'] : null;
		}
		foreach ( $this->engines as $table => $engine ) {
			if ( false !== strpos( $sql, "'{$table}'" ) ) {
				return $engine;
			}
		}
		return null;
	}

	public function get_results( $sql ) {
		$this->last_error = '';
		return array_map(
			static function ( $row ) {
				return clone $row;
			},
			array_values( $this->rows )
		);
	}

	public function query( $sql ) {
		$this->queries[] = $sql;
		if ( 'START TRANSACTION' === $sql ) {
			$this->transaction_backup = array(
				'rows'    => unserialize( serialize( $this->rows ) ),
				'options' => unserialize( serialize( $this->option_rows ) ),
			);
			return 1;
		}
		if ( 'ROLLBACK' === $sql ) {
			if ( is_array( $this->transaction_backup ) ) {
				$this->rows        = $this->transaction_backup['rows'];
				$this->option_rows = $this->transaction_backup['options'];
			}
			$this->transaction_backup = null;
			return 1;
		}
		if ( 'COMMIT' === $sql ) {
			$this->transaction_backup = null;
			return 1;
		}
		return 1;
	}

	public function update( $table, $data, $where, $data_format = null, $where_format = null ) {
		if ( 'wp_hfcm_scripts' === $table ) {
			$id = (int) $where['script_id'];
			if ( $id === (int) $this->fail_update_id || ! isset( $this->rows[ $id ] ) || $this->rows[ $id ]->status !== $where['status'] ) {
				return 0;
			}
			$this->rows[ $id ]->status = $data['status'];
			return 1;
		}
		if ( 'wp_options' === $table ) {
			$name = $where['option_name'];
			if ( ! isset( $this->option_rows[ $name ] ) ) {
				return 0;
			}
			$this->option_rows[ $name ]['option_value'] = $data['option_value'];
			return 1;
		}
		return 0;
	}

	public function insert( $table, $data, $format = null ) {
		if ( 'wp_options' !== $table || isset( $this->option_rows[ $data['option_name'] ] ) ) {
			return 0;
		}
		$this->option_rows[ $data['option_name'] ] = $data;
		return 1;
	}

	public function delete( $table, $where, $where_format = null ) {
		if ( 'wp_options' !== $table || ! isset( $this->option_rows[ $where['option_name'] ] ) ) {
			return 0;
		}
		unset( $this->option_rows[ $where['option_name'] ] );
		return 1;
	}
}

function jt_hfcm_assert( $condition, $message ) {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: {$message}\n" );
		exit( 1 );
	}
}

function absint( $value ) {
	return abs( (int) $value );
}

function sanitize_key( $value ) {
	return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $value ) );
}

function maybe_unserialize( $value ) {
	if ( ! is_string( $value ) ) {
		return $value;
	}
	$decoded = @unserialize( $value );
	return false === $decoded ? $value : $decoded;
}

function maybe_serialize( $value ) {
	return is_array( $value ) || is_object( $value ) ? serialize( $value ) : $value;
}

function get_option( $key, $default = false ) {
	global $wpdb;
	return isset( $wpdb->option_rows[ $key ] ) ? maybe_unserialize( $wpdb->option_rows[ $key ]['option_value'] ) : $default;
}

function is_wp_error( $value ) {
	return $value instanceof WP_Error;
}

function rest_ensure_response( $value ) {
	return $value;
}

function current_user_can( $capability ) {
	global $jt_hfcm_can_manage;
	return $jt_hfcm_can_manage && 'manage_options' === $capability;
}

function register_rest_route( $namespace, $route, $args ) {
	global $jt_hfcm_routes;
	$jt_hfcm_routes[ $namespace . $route ] = $args;
	return true;
}

function add_action( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
	global $jt_hfcm_actions;
	$jt_hfcm_actions[ $hook ][] = $callback;
	return true;
}

function clean_post_cache( $post_id ) {
	global $jt_hfcm_cleaned_posts;
	$jt_hfcm_cleaned_posts[] = (int) $post_id;
}

function wp_cache_delete( $key, $group = '' ) {
	global $jt_hfcm_cache_deletes;
	$jt_hfcm_cache_deletes[] = $group . ':' . $key;
	return true;
}

$wpdb = new JT_HFCM_Fake_WPDB();
require_once dirname( __DIR__ ) . '/justice-ops/hfcm-legacy-card-retirement.php';

justice_ops_hfcm_retirement_register_route();
$route_key = 'justice-ops/v1/retire-legacy-head-cards';
jt_hfcm_assert( isset( $jt_hfcm_routes[ $route_key ] ), 'REST route was not registered.' );
jt_hfcm_assert( 'POST' === $jt_hfcm_routes[ $route_key ]['methods'], 'Route is not POST-only.' );
$jt_hfcm_can_manage = false;
jt_hfcm_assert( false === call_user_func( $jt_hfcm_routes[ $route_key ]['permission_callback'] ), 'Unauthorized capability passed.' );
$jt_hfcm_can_manage = true;
jt_hfcm_assert( true === call_user_func( $jt_hfcm_routes[ $route_key ]['permission_callback'] ), 'Authorized capability failed.' );

$wpdb->engines['wp_hfcm_scripts'] = 'MyISAM';
$bad_engine = justice_ops_hfcm_retirement_rest_callback( new WP_REST_Request( array( 'mode' => 'inspect' ) ) );
jt_hfcm_assert( is_wp_error( $bad_engine ) && 'justice_hfcm_nontransactional_table' === $bad_engine->get_error_code(), 'Nontransactional HFCM table did not fail closed.' );
$wpdb->engines['wp_hfcm_scripts'] = 'InnoDB';

$inspect = justice_ops_hfcm_retirement_rest_callback( new WP_REST_Request( array( 'mode' => 'inspect' ) ) );
jt_hfcm_assert( ! is_wp_error( $inspect ) && 'ready' === $inspect['state'], 'Ready inspect failed.' );
jt_hfcm_assert( array( 5, 6, 7 ) === array_keys( $inspect['records'] ), 'Inspect returned the wrong rows.' );
jt_hfcm_assert( array( 'hfcm' => 'INNODB', 'options' => 'INNODB' ) === $inspect['engines'], 'Engine proof changed.' );

$hashes = array(
	7 => strtoupper( $inspect['records'][7]['snippet_sha256'] ),
	5 => strtoupper( $inspect['records'][5]['snippet_sha256'] ),
	6 => strtoupper( $inspect['records'][6]['snippet_sha256'] ),
);
$execute_request = static function ( $mode, $confirm, $expected ) {
	return new WP_REST_Request(
		array(
			'mode'            => $mode,
			'confirm'         => $confirm,
			'expected_hashes' => $expected,
		)
	);
};

$wpdb->fail_update_id = 6;
$failed_execute = justice_ops_hfcm_retirement_rest_callback(
	$execute_request( 'execute', 'retire-hfcm-legacy-head-cards-v2', $hashes )
);
jt_hfcm_assert( is_wp_error( $failed_execute ), 'Mid-batch update failure was accepted.' );
jt_hfcm_assert( array( 'active', 'active', 'active' ) === array( $wpdb->rows[5]->status, $wpdb->rows[6]->status, $wpdb->rows[7]->status ), 'Rollback did not restore all statuses.' );
jt_hfcm_assert( null === justice_ops_hfcm_retirement_state(), 'Failed execute left a workflow seal.' );
$wpdb->fail_update_id = 0;

$execute = justice_ops_hfcm_retirement_rest_callback(
	$execute_request( 'execute', 'retire-hfcm-legacy-head-cards-v2', $hashes )
);
jt_hfcm_assert( ! is_wp_error( $execute ) && 'pending_acceptance' === $execute['state'], 'Exact execute did not enter pending acceptance.' );
jt_hfcm_assert( array( 'inactive', 'inactive', 'inactive' ) === array( $wpdb->rows[5]->status, $wpdb->rows[6]->status, $wpdb->rows[7]->status ), 'Execute did not retire all rows.' );
$pending = justice_ops_hfcm_retirement_state();
jt_hfcm_assert( is_array( $pending ) && 'pending_acceptance' === $pending['state'], 'Pending audit was not stored transactionally.' );
unset( $jt_hfcm_routes[ $route_key ] );
justice_ops_hfcm_retirement_register_route();
jt_hfcm_assert( isset( $jt_hfcm_routes[ $route_key ] ), 'Rollback route disappeared before acceptance.' );

$pending_inspect = justice_ops_hfcm_retirement_rest_callback( new WP_REST_Request( array( 'mode' => 'inspect' ) ) );
jt_hfcm_assert( ! is_wp_error( $pending_inspect ) && 'pending_acceptance' === $pending_inspect['state'], 'Pending inspect failed.' );

$rollback = justice_ops_hfcm_retirement_rest_callback(
	$execute_request( 'rollback', 'rollback-hfcm-legacy-head-cards-v2', $hashes )
);
jt_hfcm_assert( ! is_wp_error( $rollback ) && 'rolled_back' === $rollback['state'], 'Controlled rollback failed.' );
jt_hfcm_assert( 'ready_for_execute' === $rollback['route_state'], 'Rollback returned a misleading route state.' );
jt_hfcm_assert( array( 'active', 'active', 'active' ) === array( $wpdb->rows[5]->status, $wpdb->rows[6]->status, $wpdb->rows[7]->status ), 'Controlled rollback did not reactivate exact rows.' );
jt_hfcm_assert( null === justice_ops_hfcm_retirement_state(), 'Controlled rollback retained pending state.' );

$execute_again = justice_ops_hfcm_retirement_rest_callback(
	$execute_request( 'execute', 'retire-hfcm-legacy-head-cards-v2', $hashes )
);
jt_hfcm_assert( ! is_wp_error( $execute_again ) && 'pending_acceptance' === $execute_again['state'], 'Second execute failed after rollback.' );

$pending_again = justice_ops_hfcm_retirement_state();
$wpdb->locked_state_override_once = array(
	'state'          => 'complete',
	'script_ids'     => array( 5, 6, 7 ),
	'snippet_hashes' => $pending_again['snippet_hashes'],
);
$stale_rollback = justice_ops_hfcm_retirement_rest_callback(
	$execute_request( 'rollback', 'rollback-hfcm-legacy-head-cards-v2', $hashes )
);
jt_hfcm_assert( is_wp_error( $stale_rollback ) && 'justice_hfcm_not_pending' === $stale_rollback->get_error_code(), 'A queued rollback accepted or misclassified a freshly finalized state.' );
jt_hfcm_assert( 409 === $stale_rollback->get_error_data()['status'], 'A stale rollback conflict was not returned as HTTP 409.' );
jt_hfcm_assert( array( 'inactive', 'inactive', 'inactive' ) === array( $wpdb->rows[5]->status, $wpdb->rows[6]->status, $wpdb->rows[7]->status ), 'Stale rollback reactivated finalized rows.' );
jt_hfcm_assert( 'complete' === justice_ops_hfcm_retirement_state()['state'], 'Stale rollback removed a freshly finalized state.' );
$wpdb->option_rows[ justice_ops_hfcm_retirement_option_key() ]['option_value'] = maybe_serialize( $pending_again );

$finalize = justice_ops_hfcm_retirement_rest_callback(
	$execute_request( 'finalize', 'finalize-hfcm-legacy-head-cards-v2', $hashes )
);
jt_hfcm_assert( ! is_wp_error( $finalize ) && 'complete' === $finalize['state'], 'Finalize failed.' );
jt_hfcm_assert( justice_ops_hfcm_retirement_is_complete(), 'Final state was not recognized.' );
jt_hfcm_assert( array( 'inactive', 'inactive', 'inactive' ) === array( $wpdb->rows[5]->status, $wpdb->rows[6]->status, $wpdb->rows[7]->status ), 'Finalize changed inactive statuses.' );

unset( $jt_hfcm_routes[ $route_key ] );
justice_ops_hfcm_retirement_register_route();
jt_hfcm_assert( ! isset( $jt_hfcm_routes[ $route_key ] ), 'Route remained after final acceptance.' );
jt_hfcm_assert( count( $jt_hfcm_cleaned_posts ) >= 6, 'Exact post caches were not cleaned across transitions.' );
jt_hfcm_assert( in_array( 'options:notoptions', $jt_hfcm_cache_deletes, true ), 'Missing-option cache was not invalidated.' );
jt_hfcm_assert( 6 === $wpdb->locked_state_query_count, 'Every workflow state transition must use exactly one locking read.' );

echo "PASS: HFCM retirement is authenticated, encoded-input safe, transactional, reversible and finalizable.\n";
