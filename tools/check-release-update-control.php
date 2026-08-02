<?php
/**
 * Offline adversarial checks for Justice Ops native auto-update control.
 */

define( 'ABSPATH', __DIR__ . '/' );
$jt_update_control_main_source = file_get_contents( dirname( __DIR__ ) . '/justice-ops/justice-ops.php' );
if (
	! is_string( $jt_update_control_main_source )
	|| 1 !== preg_match( '/^\s*\*\s*Version:\s*([^\r\n]+)\r?$/m', $jt_update_control_main_source, $jt_update_control_version_match )
) {
	throw new RuntimeException( 'The Justice Ops source version is unavailable.' );
}
$jt_update_control_test_version = trim( (string) $jt_update_control_version_match[1] );
define( 'JUSTICE_OPS_VERSION', $jt_update_control_test_version );

$GLOBALS['jt_update_control_options']        = array();
$GLOBALS['jt_update_control_site_options']   = array(
	'auto_update_plugins' => array( 'other/other.php', 'justice-ops/justice-ops.php' ),
);
$GLOBALS['jt_update_control_filters']        = array();
$GLOBALS['jt_update_control_actions']        = array();
$GLOBALS['jt_update_control_routes']         = array();
$GLOBALS['jt_update_control_authorized']     = true;
$GLOBALS['jt_update_control_fail_option_once'] = false;
$GLOBALS['jt_update_control_site_write_count'] = 0;
$GLOBALS['jt_update_control_uuid_counter']     = 0;

function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ): void {
	$GLOBALS['jt_update_control_filters'][ $hook ][] = array( $callback, $priority, $accepted_args );
}

function add_action( $hook, $callback, $priority = 10, $accepted_args = 1 ): void {
	$GLOBALS['jt_update_control_actions'][ $hook ][] = array( $callback, $priority, $accepted_args );
}

function register_rest_route( $namespace, $route, $definition ): void {
	$GLOBALS['jt_update_control_routes'][ $namespace . $route ] = $definition;
}

function current_user_can( $capability ): bool {
	return 'update_plugins' === $capability && true === $GLOBALS['jt_update_control_authorized'];
}

function get_option( $name, $default = false ) {
	return array_key_exists( $name, $GLOBALS['jt_update_control_options'] )
		? $GLOBALS['jt_update_control_options'][ $name ]
		: $default;
}

function update_option( $name, $value, $autoload = null ): bool {
	if ( true === $GLOBALS['jt_update_control_fail_option_once'] && 'justice_ops_native_auto_update_enabled' === $name ) {
		$GLOBALS['jt_update_control_fail_option_once'] = false;
		return false;
	}
	$changed = ! array_key_exists( $name, $GLOBALS['jt_update_control_options'] )
		|| $GLOBALS['jt_update_control_options'][ $name ] !== $value;
	$GLOBALS['jt_update_control_options'][ $name ] = $value;
	return $changed;
}

function add_option( $name, $value, $deprecated = '', $autoload = null ): bool {
	if ( array_key_exists( $name, $GLOBALS['jt_update_control_options'] ) ) {
		return false;
	}
	$GLOBALS['jt_update_control_options'][ $name ] = $value;
	return true;
}

function delete_option( $name ): bool {
	if ( ! array_key_exists( $name, $GLOBALS['jt_update_control_options'] ) ) {
		return false;
	}
	unset( $GLOBALS['jt_update_control_options'][ $name ] );
	return true;
}

function get_site_option( $name, $default = false ) {
	return array_key_exists( $name, $GLOBALS['jt_update_control_site_options'] )
		? $GLOBALS['jt_update_control_site_options'][ $name ]
		: $default;
}

function update_site_option( $name, $value ): bool {
	$GLOBALS['jt_update_control_site_write_count']++;
	$changed = ! array_key_exists( $name, $GLOBALS['jt_update_control_site_options'] )
		|| $GLOBALS['jt_update_control_site_options'][ $name ] !== $value;
	$GLOBALS['jt_update_control_site_options'][ $name ] = $value;
	return $changed;
}

function delete_site_option( $name ): bool {
	if ( ! array_key_exists( $name, $GLOBALS['jt_update_control_site_options'] ) ) {
		return false;
	}
	unset( $GLOBALS['jt_update_control_site_options'][ $name ] );
	return true;
}

function wp_json_encode( $value, $flags = 0 ) {
	return json_encode( $value, $flags );
}

function rest_ensure_response( $value ) {
	return $value;
}

function wp_generate_uuid4(): string {
	$GLOBALS['jt_update_control_uuid_counter']++;
	return sprintf( '00000000-0000-4000-8000-%012d', $GLOBALS['jt_update_control_uuid_counter'] );
}

class WP_Error {
	private string $code;
	private string $message;
	private array $data;

	public function __construct( $code, $message, $data = array() ) {
		$this->code    = (string) $code;
		$this->message = (string) $message;
		$this->data    = is_array( $data ) ? $data : array();
	}

	public function get_error_code(): string {
		return $this->code;
	}

	public function get_error_data(): array {
		return $this->data;
	}
}

class Justice_Ops_Update_Control_Test_Request {
	/** @var mixed */
	private $params;

	public function __construct( $params ) {
		$this->params = $params;
	}

	public function get_json_params() {
		return $this->params;
	}
}

function is_wp_error( $value ): bool {
	return $value instanceof WP_Error;
}

function justice_ops_update_control_test_assert( $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

require_once dirname( __DIR__ ) . '/justice-ops/release-update-control.php';

$plugin = 'justice-ops/justice-ops.php';
$other  = 'other/other.php';
$core_auto_updates_before = $GLOBALS['jt_update_control_site_options']['auto_update_plugins'];

justice_ops_update_control_test_assert(
	isset( $GLOBALS['jt_update_control_filters']['auto_update_plugin'] ),
	'The exact native auto-update filter was not registered.'
);
justice_ops_update_control_test_assert(
	false === justice_ops_release_update_control_filter( true, (object) array( 'plugin' => $plugin ) ),
	'Justice Ops native auto-update was not denied by default.'
);
$unrelated_decision = (object) array( 'preserve' => true );
justice_ops_update_control_test_assert(
	$unrelated_decision === justice_ops_release_update_control_filter(
		$unrelated_decision,
		(object) array( 'plugin' => $other )
	),
	'An unrelated plugin auto-update decision was changed.'
);

$initial = justice_ops_release_update_control_status();
justice_ops_update_control_test_assert(
	false === $initial['native_auto_update_enabled']
	&& true === $initial['control_module_active']
	&& false === $initial['direct_target_decision']
	&& true === $initial['listed_in_core_auto_updates']
	&& false === $initial['effective_native_auto_update']
	&& $jt_update_control_test_version === $initial['runtime_version']
	&& $jt_update_control_test_version === $initial['source_version']
	&& true === $initial['version_match']
	&& false === $initial['auto_updater_lock_present']
	&& null === $initial['auto_updater_lock_age_seconds']
	&& 1 === preg_match( '/^[a-f0-9]{64}$/D', $initial['state_sha256'] ),
	'Default fail-closed status is not exact.'
);
justice_ops_update_control_test_assert(
	! array_key_exists( 'configured_plugins', $initial ),
	'The narrow status route exposed the full plugin list.'
);

$GLOBALS['jt_update_control_options']['auto_updater.lock'] = time() - 30;
$locked = justice_ops_release_update_control_status();
justice_ops_update_control_test_assert(
	true === $locked['auto_updater_lock_present']
	&& $locked['auto_updater_lock_age_seconds'] >= 30
	&& $locked['auto_updater_lock_age_seconds'] < 60
	&& $locked['state_sha256'] !== $initial['state_sha256'],
	'The authenticated status omitted the native updater lock.'
);
unset( $GLOBALS['jt_update_control_options']['auto_updater.lock'] );
justice_ops_update_control_test_assert(
	$initial === justice_ops_release_update_control_status(),
	'The native updater lock changed unrelated control state after release.'
);

$GLOBALS['jt_update_control_authorized'] = false;
justice_ops_update_control_test_assert(
	false === justice_ops_release_update_control_permission(),
	'Unauthorized update-control access was permitted.'
);
$GLOBALS['jt_update_control_authorized'] = true;
justice_ops_update_control_test_assert(
	true === justice_ops_release_update_control_permission(),
	'An update_plugins administrator was rejected.'
);

justice_ops_release_update_control_register_rest();
$route = $GLOBALS['jt_update_control_routes']['justice-ops/v1/release-update-control'] ?? null;
justice_ops_update_control_test_assert(
	is_array( $route )
	&& 2 === count( $route )
	&& 'GET' === $route[0]['methods']
	&& 'POST' === $route[1]['methods']
	&& 'justice_ops_release_update_control_permission' === $route[0]['permission_callback']
	&& 'justice_ops_release_update_control_permission' === $route[1]['permission_callback'],
	'The authenticated status/toggle route contract changed.'
);

$operation_lock_name = justice_ops_release_update_control_lock_name();
$GLOBALS['jt_update_control_options'][ $operation_lock_name ] = 'held-by-another-request';
$operation_locked = justice_ops_release_update_control_rest_toggle(
	new Justice_Ops_Update_Control_Test_Request(
		array(
			'plugin'                => $plugin,
			'enabled'               => true,
			'expected_state_sha256' => $initial['state_sha256'],
		)
	)
);
justice_ops_update_control_test_assert(
	$operation_locked instanceof WP_Error
	&& 'justice_ops_update_control_locked' === $operation_locked->get_error_code()
	&& 409 === $operation_locked->get_error_data()['status'],
	'Concurrent update-control writes were not serialized.'
);
unset( $GLOBALS['jt_update_control_options'][ $operation_lock_name ] );

$stale = justice_ops_release_update_control_rest_toggle(
	new Justice_Ops_Update_Control_Test_Request(
		array(
			'plugin'                => $plugin,
			'enabled'               => true,
			'expected_state_sha256' => str_repeat( '0', 64 ),
		)
	)
);
justice_ops_update_control_test_assert(
	$stale instanceof WP_Error
	&& 'justice_ops_update_control_stale_state' === $stale->get_error_code()
	&& 409 === $stale->get_error_data()['status']
	&& ! array_key_exists( $operation_lock_name, $GLOBALS['jt_update_control_options'] ),
	'A stale compare-and-set write was accepted.'
);

$enabled = justice_ops_release_update_control_rest_toggle(
	new Justice_Ops_Update_Control_Test_Request(
		array(
			'plugin'                => $plugin,
			'enabled'               => true,
			'expected_state_sha256' => $initial['state_sha256'],
		)
	)
);
justice_ops_update_control_test_assert(
	is_array( $enabled )
	&& true === $enabled['native_auto_update_enabled']
	&& true === $enabled['listed_in_core_auto_updates']
	&& true === $enabled['effective_native_auto_update']
	&& $core_auto_updates_before === get_site_option( 'auto_update_plugins', array() )
	&& 0 === $GLOBALS['jt_update_control_site_write_count']
	&& ! array_key_exists( $operation_lock_name, $GLOBALS['jt_update_control_options'] )
	&& true === justice_ops_release_update_control_filter( false, (object) array( 'plugin' => $plugin ) ),
	'Exact enable did not preserve the shared core auto-update state byte-for-byte.'
);

$extra_field = justice_ops_release_update_control_rest_toggle(
	new Justice_Ops_Update_Control_Test_Request(
		array(
			'plugin'                => $plugin,
			'enabled'               => false,
			'expected_state_sha256' => $enabled['state_sha256'],
			'extra'                 => true,
		)
	)
);
justice_ops_update_control_test_assert(
	$extra_field instanceof WP_Error
	&& 'justice_ops_update_control_invalid_fields' === $extra_field->get_error_code(),
	'An over-broad toggle payload was accepted.'
);

$before_failed_write = justice_ops_release_update_control_status();
$GLOBALS['jt_update_control_fail_option_once'] = true;
$failed_write = justice_ops_release_update_control_rest_toggle(
	new Justice_Ops_Update_Control_Test_Request(
		array(
			'plugin'                => $plugin,
			'enabled'               => false,
			'expected_state_sha256' => $before_failed_write['state_sha256'],
		)
	)
);
$after_failed_write = justice_ops_release_update_control_status();
justice_ops_update_control_test_assert(
	$failed_write instanceof WP_Error
	&& 'justice_ops_update_control_write_failed' === $failed_write->get_error_code()
	&& $before_failed_write === $after_failed_write
	&& $core_auto_updates_before === get_site_option( 'auto_update_plugins', array() )
	&& ! array_key_exists( $operation_lock_name, $GLOBALS['jt_update_control_options'] ),
	'A partial toggle failure did not restore the exact prior state.'
);

$disabled = justice_ops_release_update_control_rest_toggle(
	new Justice_Ops_Update_Control_Test_Request(
		array(
			'plugin'                => $plugin,
			'enabled'               => false,
			'expected_state_sha256' => $after_failed_write['state_sha256'],
		)
	)
);
justice_ops_update_control_test_assert(
	is_array( $disabled )
	&& false === $disabled['native_auto_update_enabled']
	&& true === $disabled['listed_in_core_auto_updates']
	&& false === $disabled['effective_native_auto_update']
	&& $core_auto_updates_before === get_site_option( 'auto_update_plugins', array() )
	&& 0 === $GLOBALS['jt_update_control_site_write_count']
	&& ! array_key_exists( $operation_lock_name, $GLOBALS['jt_update_control_options'] ),
	'Exact disable changed the shared core auto-update state.'
);

fwrite(
	STDOUT,
	json_encode(
		array(
			'passed'                     => true,
			'plugin'                     => $plugin,
			'default_fail_closed'        => true,
			'cas_and_restore_verified'       => true,
			'operation_lock_verified'        => true,
			'shared_core_option_byte_stable' => true,
			'unrelated_plugin_preserved'     => true,
		),
		JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
	) . PHP_EOL
);
