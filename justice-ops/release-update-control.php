<?php
/**
 * Narrow control plane for Justice Ops native WordPress auto-updates.
 *
 * Native auto-update is denied for this plugin by default. Authenticated
 * operators with update_plugins capability can inspect or toggle only the
 * exact Justice Ops plugin basename through a compare-and-set REST route.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the only plugin basename governed by this module.
 */
function justice_ops_release_update_control_plugin(): string {
	return 'justice-ops/justice-ops.php';
}

/**
 * Return whether native auto-update was explicitly enabled by an operator.
 */
function justice_ops_release_update_control_enabled(): bool {
	return '1' === (string) get_option( 'justice_ops_native_auto_update_enabled', '0' );
}

/**
 * Read the plugin header version from the same source tree as this module.
 */
function justice_ops_release_update_control_source_version(): string {
	$plugin_file = __DIR__ . '/justice-ops.php';
	if ( ! is_file( $plugin_file ) ) {
		return '';
	}
	$source = file_get_contents( $plugin_file );
	if ( ! is_string( $source ) ) {
		return '';
	}
	return 1 === preg_match( '/^\s*\*\s*Version:\s*([^\r\n]+)\r?$/m', $source, $match )
		? trim( (string) $match[1] )
		: '';
}

/**
 * Normalize the core auto-update list without changing unrelated basenames.
 *
 * @param mixed $value Core option value.
 * @return array<int,string>
 */
function justice_ops_release_update_control_normalize_plugins( $value ): array {
	if ( ! is_array( $value ) ) {
		return array();
	}

	$plugins = array();
	foreach ( $value as $plugin ) {
		if ( is_string( $plugin ) && '' !== $plugin && ! in_array( $plugin, $plugins, true ) ) {
			$plugins[] = $plugin;
		}
	}

	return $plugins;
}

/**
 * Produce a deterministic state document for compare-and-set writes.
 *
 * The full core list is represented only by a digest. The endpoint therefore
 * detects concurrent changes without exposing or controlling other plugins.
 *
 * @return array<string,mixed>
 */
function justice_ops_release_update_control_status(): array {
	$plugin     = justice_ops_release_update_control_plugin();
	$plugins    = justice_ops_release_update_control_normalize_plugins(
		get_site_option( 'auto_update_plugins', array() )
	);
	$sorted     = $plugins;
	sort( $sorted, SORT_STRING );
	$list_json  = wp_json_encode( $sorted, JSON_UNESCAPED_SLASHES );
	$list_json  = is_string( $list_json ) ? $list_json : '[]';
	$enabled    = justice_ops_release_update_control_enabled();
	$is_listed  = in_array( $plugin, $plugins, true );
	$runtime    = defined( 'JUSTICE_OPS_VERSION' ) ? (string) JUSTICE_OPS_VERSION : '';
	$source     = justice_ops_release_update_control_source_version();
	$lock_raw   = get_option( 'auto_updater.lock', false );
	$lock_epoch = is_numeric( $lock_raw ) && (int) $lock_raw > 0 ? (int) $lock_raw : 0;
	$lock_age   = $lock_epoch > 0 ? max( 0, time() - $lock_epoch ) : null;
	$state_core = array(
		'plugin'                       => $plugin,
		'control_module_active'        => true,
		'direct_target_decision'       => $enabled,
		'native_auto_update_enabled'   => $enabled,
		'listed_in_core_auto_updates'  => $is_listed,
		'effective_native_auto_update' => $enabled,
		'runtime_version'              => $runtime,
		'source_version'               => $source,
		'version_match'                => '' !== $runtime && $runtime === $source,
		'auto_updater_lock_present'    => $lock_epoch > 0,
		'auto_updater_lock_timestamp'  => $lock_epoch,
		'core_auto_update_list_sha256' => hash( 'sha256', $list_json ),
	);
	$state_json = wp_json_encode( $state_core, JSON_UNESCAPED_SLASHES );
	$state_json = is_string( $state_json ) ? $state_json : '';

	$state_core['state_sha256'] = hash( 'sha256', $state_json );
	$state_core['auto_updater_lock_age_seconds'] = $lock_age;

	return $state_core;
}

/**
 * Deny native auto-update only for the exact Justice Ops basename by default.
 *
 * @param mixed $update Current WordPress decision.
 * @param mixed $item   Plugin update item.
 * @return mixed
 */
function justice_ops_release_update_control_filter( $update, $item ) {
	$plugin = is_object( $item ) && isset( $item->plugin )
		? (string) $item->plugin
		: '';

	if ( justice_ops_release_update_control_plugin() !== $plugin ) {
		return $update;
	}

	return justice_ops_release_update_control_enabled();
}
add_filter( 'auto_update_plugin', 'justice_ops_release_update_control_filter', PHP_INT_MAX, 2 );

/**
 * Allow only authenticated plugin-update administrators.
 */
function justice_ops_release_update_control_permission(): bool {
	return current_user_can( 'update_plugins' );
}

/**
 * Return the authenticated status response.
 */
function justice_ops_release_update_control_rest_status() {
	return rest_ensure_response( justice_ops_release_update_control_status() );
}

/**
 * Return a narrow REST error without leaking mutable state.
 *
 * @param string $code    Error code.
 * @param string $message Error message.
 * @param int    $status  HTTP status.
 */
function justice_ops_release_update_control_error( string $code, string $message, int $status ) {
	return new WP_Error( $code, $message, array( 'status' => $status ) );
}

/**
 * Return the private option used to serialize update-control writes.
 */
function justice_ops_release_update_control_lock_name(): string {
	return 'justice_ops_release_update_control_lock_v1';
}

/**
 * Acquire the operation lock atomically. Existing locks fail closed, including
 * locks left by an interrupted request. The target remains safely disabled and
 * an operator can inspect the condition before any exact manual recovery.
 *
 * @return string|WP_Error
 */
function justice_ops_release_update_control_acquire_lock() {
	$token = wp_generate_uuid4();
	if ( ! add_option( justice_ops_release_update_control_lock_name(), $token, '', 'no' ) ) {
		return justice_ops_release_update_control_error(
			'justice_ops_update_control_locked',
			'Another update-control operation is active or requires exact recovery.',
			409
		);
	}

	return $token;
}

/**
 * Release only the lock token owned by this request.
 */
function justice_ops_release_update_control_release_lock( string $token ): void {
	$name = justice_ops_release_update_control_lock_name();
	$held = get_option( $name, null );
	if ( is_string( $held ) && hash_equals( $token, $held ) ) {
		delete_option( $name );
	}
}

/**
 * Restore the exact custom option captured before a failed toggle.
 *
 * The authoritative filter does not need to rewrite WordPress's shared
 * auto_update_plugins list. Leaving that shared option byte-identical avoids
 * lost updates from unrelated plugin settings changed by another request.
 *
 * @param mixed  $prior_enabled Raw custom-option value or the absent sentinel.
 * @param string $sentinel      Unique absent sentinel.
 */
function justice_ops_release_update_control_restore( $prior_enabled, string $sentinel ): bool {
	return $sentinel === $prior_enabled
		? delete_option( 'justice_ops_native_auto_update_enabled' ) || $sentinel === get_option( 'justice_ops_native_auto_update_enabled', $sentinel )
		: update_option( 'justice_ops_native_auto_update_enabled', $prior_enabled, false ) || $prior_enabled === get_option( 'justice_ops_native_auto_update_enabled', $sentinel );
}

/**
 * Compare-and-set the exact Justice Ops native auto-update state.
 *
 * @param WP_REST_Request $request REST request.
 * @return mixed
 */
function justice_ops_release_update_control_rest_toggle( $request ) {
	$params = $request->get_json_params();
	if ( ! is_array( $params ) ) {
		return justice_ops_release_update_control_error(
			'justice_ops_update_control_invalid_body',
			'An exact JSON object is required.',
			400
		);
	}

	$keys = array_keys( $params );
	sort( $keys, SORT_STRING );
	if ( array( 'enabled', 'expected_state_sha256', 'plugin' ) !== $keys ) {
		return justice_ops_release_update_control_error(
			'justice_ops_update_control_invalid_fields',
			'Only plugin, enabled and expected_state_sha256 are accepted.',
			400
		);
	}

	$plugin        = $params['plugin'] ?? null;
	$enabled       = $params['enabled'] ?? null;
	$expected_hash = $params['expected_state_sha256'] ?? null;
	if (
		justice_ops_release_update_control_plugin() !== $plugin
		|| ! is_bool( $enabled )
		|| ! is_string( $expected_hash )
		|| 1 !== preg_match( '/^[a-f0-9]{64}$/D', $expected_hash )
	) {
		return justice_ops_release_update_control_error(
			'justice_ops_update_control_invalid_contract',
			'The update-control contract is invalid.',
			400
		);
	}

	$lock_token = justice_ops_release_update_control_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$current = justice_ops_release_update_control_status();
		if ( ! hash_equals( (string) $current['state_sha256'], $expected_hash ) ) {
			return justice_ops_release_update_control_error(
				'justice_ops_update_control_stale_state',
				'The update-control state changed. Read status and retry.',
				409
			);
		}

		$sentinel      = '__justice_ops_update_control_absent__';
		$prior_enabled = get_option( 'justice_ops_native_auto_update_enabled', $sentinel );
		update_option( 'justice_ops_native_auto_update_enabled', $enabled ? '1' : '0', false );

		$stored_enabled = ( $enabled ? '1' : '0' ) === (string) get_option( 'justice_ops_native_auto_update_enabled', '' );
		if ( ! $stored_enabled ) {
			$restored = justice_ops_release_update_control_restore( $prior_enabled, $sentinel );
			return justice_ops_release_update_control_error(
				$restored ? 'justice_ops_update_control_write_failed' : 'justice_ops_update_control_restore_failed',
				$restored ? 'The toggle write failed and prior state was restored.' : 'The toggle write and prior-state restoration failed.',
				500
			);
		}

		return rest_ensure_response( justice_ops_release_update_control_status() );
	} finally {
		justice_ops_release_update_control_release_lock( $lock_token );
	}
}

/**
 * Register one authenticated status and toggle route.
 */
function justice_ops_release_update_control_register_rest(): void {
	register_rest_route(
		'justice-ops/v1',
		'/release-update-control',
		array(
			array(
				'methods'             => 'GET',
				'permission_callback' => 'justice_ops_release_update_control_permission',
				'callback'            => 'justice_ops_release_update_control_rest_status',
			),
			array(
				'methods'             => 'POST',
				'permission_callback' => 'justice_ops_release_update_control_permission',
				'callback'            => 'justice_ops_release_update_control_rest_toggle',
			),
		)
	);
}
add_action( 'rest_api_init', 'justice_ops_release_update_control_register_rest' );
