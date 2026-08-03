<?php
/**
 * Controlled retirement of three legacy HFCM lawyer-card snippets.
 *
 * The affected records inject unsupported recommendation cards into wp_head.
 * This bridge preserves the rows and snippet code, requires exact hashes, locks
 * the rows inside an InnoDB transaction, and keeps rollback available until a
 * separate acceptance pass explicitly finalizes the transition.
 *
 * @package Justice_Ops
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * State option used for the pending acceptance and final audit records.
 */
function justice_ops_hfcm_retirement_option_key(): string {
	return 'justice_ops_hfcm_legacy_head_cards_v2';
}

/**
 * Immutable identity contract for the three legacy HFCM records.
 *
 * @return array<int,array<string,mixed>>
 */
function justice_ops_hfcm_retirement_expected_records(): array {
	return array(
		5 => array(
			'name'  => "מומחה ג'אסטיס",
			'posts' => array( 12219, 12264 ),
			'label' => "מומחה ג'אסטיס",
		),
		6 => array(
			'name'  => "צוות ג'אסטיס",
			'posts' => array( 12219 ),
			'label' => "מומלץ ג'אסטיס",
		),
		7 => array(
			'name'  => "צוות ג'אסטיס",
			'posts' => array( 12264 ),
			'label' => "מומלץ ג'אסטיס",
		),
	);
}

/**
 * Normalize HFCM's JSON, serialized, comma-delimited or array post storage.
 *
 * @param mixed $value Stored s_posts value.
 * @return int[]
 */
function justice_ops_hfcm_retirement_normalize_posts( $value ): array {
	if ( is_string( $value ) ) {
		$decoded = json_decode( $value, true );
		if ( JSON_ERROR_NONE === json_last_error() && is_array( $decoded ) ) {
			$value = $decoded;
		} elseif ( function_exists( 'maybe_unserialize' ) ) {
			$decoded = maybe_unserialize( $value );
			$value   = is_array( $decoded ) ? $decoded : preg_split( '/\s*,\s*/', trim( $value, " []\t\n\r\0\x0B" ) );
		} else {
			$value = preg_split( '/\s*,\s*/', trim( $value, " []\t\n\r\0\x0B" ) );
		}
	}

	$ids = array_values(
		array_unique(
			array_filter(
				array_map( 'absint', (array) $value )
			)
		)
	);
	sort( $ids, SORT_NUMERIC );
	return $ids;
}

/**
 * Read the stored workflow state.
 *
 * @return array<string,mixed>|null
 */
function justice_ops_hfcm_retirement_state(): ?array {
	$state = get_option( justice_ops_hfcm_retirement_option_key(), null );
	return is_array( $state ) ? $state : null;
}

/**
 * Lock and read the workflow option inside an already-open transaction.
 *
 * A fresh locking read prevents a queued rollback from acting on a stale
 * pending state after another request has finalized the release.
 *
 * @return array<string,mixed>|null|WP_Error
 */
function justice_ops_hfcm_retirement_locked_state() {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return $tables;
	}

	$sql = $wpdb->prepare(
		"SELECT option_value FROM `{$tables['options']}` WHERE option_name = %s FOR UPDATE",
		justice_ops_hfcm_retirement_option_key()
	);
	$raw = $wpdb->get_var( $sql ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	if ( ! empty( $wpdb->last_error ) ) {
		return new WP_Error( 'justice_hfcm_state_lock_failed', 'The HFCM workflow state could not be locked.', array( 'status' => 500 ) );
	}
	if ( null === $raw ) {
		return null;
	}

	$state = maybe_unserialize( $raw );
	if ( ! is_array( $state ) ) {
		return new WP_Error( 'justice_hfcm_state_invalid', 'The locked HFCM workflow state is invalid.', array( 'status' => 409 ) );
	}
	return $state;
}

/**
 * The REST bridge disappears only after the acceptance state is finalized.
 */
function justice_ops_hfcm_retirement_is_complete(): bool {
	$state = justice_ops_hfcm_retirement_state();
	return is_array( $state )
		&& 'complete' === (string) ( $state['state'] ?? '' )
		&& array( 5, 6, 7 ) === array_map( 'absint', (array) ( $state['script_ids'] ?? array() ) );
}

/**
 * Resolve the exact HFCM and options table names.
 *
 * @return array<string,string>|WP_Error
 */
function justice_ops_hfcm_retirement_tables() {
	global $wpdb;
	if ( ! isset( $wpdb ) || ! is_object( $wpdb ) || empty( $wpdb->prefix ) || empty( $wpdb->options ) ) {
		return new WP_Error( 'justice_hfcm_db_unavailable', 'WordPress database access is unavailable.', array( 'status' => 503 ) );
	}

	return array(
		'hfcm'    => preg_replace( '/[^A-Za-z0-9_]/', '', (string) $wpdb->prefix ) . 'hfcm_scripts',
		'options' => preg_replace( '/[^A-Za-z0-9_]/', '', (string) $wpdb->options ),
	);
}

/**
 * Fail closed unless both mutated tables are transactional InnoDB tables.
 *
 * @return array<string,string>|WP_Error
 */
function justice_ops_hfcm_retirement_engine_contract() {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return $tables;
	}

	$engines = array();
	foreach ( $tables as $key => $table ) {
		$sql    = $wpdb->prepare(
			'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s',
			$table
		);
		$engine = strtoupper( (string) $wpdb->get_var( $sql ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		if ( 'INNODB' !== $engine ) {
			return new WP_Error(
				'justice_hfcm_nontransactional_table',
				'The exact database tables are not both InnoDB.',
				array( 'status' => 409, 'table_role' => $key, 'engine' => $engine )
			);
		}
		$engines[ $key ] = $engine;
	}

	return $engines;
}

/**
 * Read and validate the exact HFCM records without returning snippet code.
 *
 * @param string $required_status Expected active or inactive state.
 * @param bool   $for_update      Lock rows inside an already-open transaction.
 * @return array<string,mixed>|WP_Error
 */
function justice_ops_hfcm_retirement_snapshot( string $required_status, bool $for_update = false ) {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return $tables;
	}

	$lock  = $for_update ? ' FOR UPDATE' : '';
	$sql   = "SELECT script_id, name, snippet, status, location, display_on, s_posts, device_type FROM `{$tables['hfcm']}` WHERE script_id IN (5,6,7) ORDER BY script_id ASC{$lock}";
	$rows  = $wpdb->get_results( $sql ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

	if ( ! empty( $wpdb->last_error ) ) {
		return new WP_Error( 'justice_hfcm_read_failed', 'The HFCM records could not be read.', array( 'status' => 500 ) );
	}

	$expected = justice_ops_hfcm_retirement_expected_records();
	if ( ! is_array( $rows ) || count( $rows ) !== count( $expected ) ) {
		return new WP_Error( 'justice_hfcm_record_set_changed', 'The exact HFCM record set is not present.', array( 'status' => 409 ) );
	}

	$observed = array();
	foreach ( $rows as $row ) {
		$id = isset( $row->script_id ) ? absint( $row->script_id ) : 0;
		if ( ! isset( $expected[ $id ] ) ) {
			return new WP_Error( 'justice_hfcm_unexpected_record', 'An unexpected HFCM record was returned.', array( 'status' => 409 ) );
		}

		$contract       = $expected[ $id ];
		$snippet_raw    = isset( $row->snippet ) ? (string) $row->snippet : '';
		$snippet_markup = html_entity_decode( $snippet_raw, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		$posts          = justice_ops_hfcm_retirement_normalize_posts( $row->s_posts ?? '' );
		$valid          = (string) ( $row->name ?? '' ) === $contract['name']
			&& (string) ( $row->status ?? '' ) === $required_status
			&& 'header' === (string) ( $row->location ?? '' )
			&& 's_posts' === (string) ( $row->display_on ?? '' )
			&& 'both' === (string) ( $row->device_type ?? '' )
			&& $contract['posts'] === $posts
			&& false !== strpos( $snippet_markup, 'lawyer-card-container' )
			&& false !== strpos( $snippet_markup, 'jus-tice-expert.webp' )
			&& false !== strpos( $snippet_markup, $contract['label'] );

		if ( ! $valid ) {
			return new WP_Error(
				'justice_hfcm_contract_changed',
				'The HFCM record identity or semantic contract changed.',
				array( 'status' => 409, 'script_id' => $id )
			);
		}

		$observed[ $id ] = array(
			'script_id'      => $id,
			'name'           => (string) $row->name,
			'status'         => (string) $row->status,
			'location'       => (string) $row->location,
			'display_on'     => (string) $row->display_on,
			'device_type'    => (string) $row->device_type,
			'post_ids'       => $posts,
			'snippet_bytes'  => strlen( $snippet_raw ),
			'snippet_sha256' => hash( 'sha256', $snippet_raw ),
		);
	}

	ksort( $observed, SORT_NUMERIC );
	return array(
		'tables'  => $tables,
		'records' => $observed,
	);
}

/**
 * Normalize and validate the caller's three exact snippet hashes.
 *
 * @param mixed $value Request value.
 * @return array<int,string>|WP_Error
 */
function justice_ops_hfcm_retirement_hash_contract( $value ) {
	if ( ! is_array( $value ) ) {
		return new WP_Error( 'justice_hfcm_hash_contract_required', 'Exact hashes for scripts 5, 6 and 7 are required.', array( 'status' => 400 ) );
	}

	$hashes = array();
	foreach ( $value as $id => $hash ) {
		$hashes[ absint( $id ) ] = strtolower( (string) $hash );
	}
	ksort( $hashes, SORT_NUMERIC );
	if ( array( 5, 6, 7 ) !== array_keys( $hashes ) ) {
		return new WP_Error( 'justice_hfcm_hash_contract_required', 'Exact hashes for scripts 5, 6 and 7 are required.', array( 'status' => 400 ) );
	}
	foreach ( $hashes as $hash ) {
		if ( ! preg_match( '/^[a-f0-9]{64}$/', $hash ) ) {
			return new WP_Error( 'justice_hfcm_hash_contract_required', 'Every expected hash must be a SHA-256 value.', array( 'status' => 400 ) );
		}
	}
	return $hashes;
}

/**
 * Compare request hashes and, when present, pending-state hashes.
 *
 * @param array<int,array<string,mixed>> $records Snapshot records.
 * @param array<int,string>              $hashes  Caller hashes.
 * @param array<string,mixed>|null       $state   Pending state.
 * @return true|WP_Error
 */
function justice_ops_hfcm_retirement_verify_hashes( array $records, array $hashes, ?array $state = null ) {
	foreach ( $records as $id => $record ) {
		$observed = (string) $record['snippet_sha256'];
		if ( ! isset( $hashes[ $id ] ) || ! hash_equals( $observed, $hashes[ $id ] ) ) {
			return new WP_Error( 'justice_hfcm_hash_mismatch', 'An HFCM snippet hash changed.', array( 'status' => 409, 'script_id' => $id ) );
		}
		if ( is_array( $state ) ) {
			$sealed = (string) ( $state['snippet_hashes'][ $id ] ?? '' );
			if ( ! hash_equals( $observed, $sealed ) ) {
				return new WP_Error( 'justice_hfcm_pending_state_mismatch', 'The pending HFCM audit no longer matches the records.', array( 'status' => 409, 'script_id' => $id ) );
			}
		}
	}
	return true;
}

/**
 * Invalidate the exact non-autoloaded workflow option after direct DB writes.
 */
function justice_ops_hfcm_retirement_clear_option_cache(): void {
	wp_cache_delete( justice_ops_hfcm_retirement_option_key(), 'options' );
	wp_cache_delete( 'notoptions', 'options' );
}

/**
 * Update only the three locked HFCM statuses.
 *
 * @param string $from Current status.
 * @param string $to   New status.
 * @return true|WP_Error
 */
function justice_ops_hfcm_retirement_update_statuses( string $from, string $to ) {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return $tables;
	}

	foreach ( array( 5, 6, 7 ) as $script_id ) {
		$updated = $wpdb->update(
			$tables['hfcm'],
			array( 'status' => $to ),
			array( 'script_id' => $script_id, 'status' => $from ),
			array( '%s' ),
			array( '%d', '%s' )
		);
		if ( 1 !== $updated ) {
			return new WP_Error( 'justice_hfcm_update_count_changed', 'An exact HFCM row update count changed.', array( 'status' => 409, 'script_id' => $script_id ) );
		}
	}
	return true;
}

/**
 * Directly insert the pending non-autoloaded state inside the DB transaction.
 *
 * @param array<string,mixed> $state Pending state.
 * @return bool
 */
function justice_ops_hfcm_retirement_insert_state( array $state ): bool {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return false;
	}
	return 1 === $wpdb->insert(
		$tables['options'],
		array(
			'option_name'  => justice_ops_hfcm_retirement_option_key(),
			'option_value' => maybe_serialize( $state ),
			'autoload'     => 'no',
		),
		array( '%s', '%s', '%s' )
	);
}

/**
 * Directly replace the pending state inside the same DB transaction.
 *
 * @param array<string,mixed> $state New state.
 * @return bool
 */
function justice_ops_hfcm_retirement_replace_state( array $state ): bool {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return false;
	}
	return 1 === $wpdb->update(
		$tables['options'],
		array( 'option_value' => maybe_serialize( $state ) ),
		array( 'option_name' => justice_ops_hfcm_retirement_option_key() ),
		array( '%s' ),
		array( '%s' )
	);
}

/**
 * Directly delete the pending state during a rollback transaction.
 */
function justice_ops_hfcm_retirement_delete_state(): bool {
	global $wpdb;
	$tables = justice_ops_hfcm_retirement_tables();
	if ( is_wp_error( $tables ) ) {
		return false;
	}
	return 1 === $wpdb->delete(
		$tables['options'],
		array( 'option_name' => justice_ops_hfcm_retirement_option_key() ),
		array( '%s' )
	);
}

/**
 * Clean exact WordPress object caches. Host HTML cache is purged separately.
 */
function justice_ops_hfcm_retirement_clean_post_caches(): void {
	clean_post_cache( 12219 );
	clean_post_cache( 12264 );
}

/**
 * Inspect, execute, roll back or finalize the exact transition.
 *
 * @param WP_REST_Request $request REST request.
 * @return WP_REST_Response|WP_Error
 */
function justice_ops_hfcm_retirement_rest_callback( WP_REST_Request $request ) {
	global $wpdb;
	$mode = sanitize_key( (string) $request->get_param( 'mode' ) );
	if ( ! in_array( $mode, array( 'inspect', 'execute', 'rollback', 'finalize' ), true ) ) {
		return new WP_Error( 'justice_hfcm_invalid_mode', 'Mode must be inspect, execute, rollback or finalize.', array( 'status' => 400 ) );
	}

	$state = justice_ops_hfcm_retirement_state();
	if ( is_array( $state ) && ! in_array( (string) ( $state['state'] ?? '' ), array( 'pending_acceptance', 'complete' ), true ) ) {
		return new WP_Error( 'justice_hfcm_state_invalid', 'The HFCM workflow state is invalid.', array( 'status' => 409 ) );
	}

	if ( 'inspect' === $mode ) {
		$status   = is_array( $state ) && 'pending_acceptance' === (string) $state['state'] ? 'inactive' : 'active';
		$snapshot = justice_ops_hfcm_retirement_snapshot( $status );
		if ( is_wp_error( $snapshot ) ) {
			return $snapshot;
		}
		$engines = justice_ops_hfcm_retirement_engine_contract();
		if ( is_wp_error( $engines ) ) {
			return $engines;
		}
		return rest_ensure_response(
			array(
				'passed'               => true,
				'mode'                 => 'inspect',
				'state'                => is_array( $state ) ? (string) $state['state'] : 'ready',
				'engines'              => $engines,
				'records'              => $snapshot['records'],
				'execute_confirmation' => 'retire-hfcm-legacy-head-cards-v2',
				'rollback_confirmation' => 'rollback-hfcm-legacy-head-cards-v2',
				'finalize_confirmation' => 'finalize-hfcm-legacy-head-cards-v2',
			)
		);
	}

	$hashes = justice_ops_hfcm_retirement_hash_contract( $request->get_param( 'expected_hashes' ) );
	if ( is_wp_error( $hashes ) ) {
		return $hashes;
	}

	$confirmations = array(
		'execute'  => 'retire-hfcm-legacy-head-cards-v2',
		'rollback' => 'rollback-hfcm-legacy-head-cards-v2',
		'finalize' => 'finalize-hfcm-legacy-head-cards-v2',
	);
	if ( $confirmations[ $mode ] !== (string) $request->get_param( 'confirm' ) ) {
		return new WP_Error( 'justice_hfcm_confirmation_required', 'The exact confirmation phrase is required.', array( 'status' => 400 ) );
	}

	if ( 'execute' === $mode && null !== $state ) {
		return new WP_Error( 'justice_hfcm_already_started', 'The HFCM workflow already has a stored state.', array( 'status' => 409 ) );
	}
	if ( in_array( $mode, array( 'rollback', 'finalize' ), true ) && ( ! is_array( $state ) || 'pending_acceptance' !== (string) ( $state['state'] ?? '' ) ) ) {
		return new WP_Error( 'justice_hfcm_not_pending', 'The HFCM workflow is not pending acceptance.', array( 'status' => 409 ) );
	}

	$engines = justice_ops_hfcm_retirement_engine_contract();
	if ( is_wp_error( $engines ) ) {
		return $engines;
	}
	if ( false === $wpdb->query( 'START TRANSACTION' ) ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		return new WP_Error( 'justice_hfcm_transaction_failed', 'The database transaction could not start.', array( 'status' => 500 ) );
	}

	$transition_error = null;
	try {
		$locked_state = justice_ops_hfcm_retirement_locked_state();
		if ( is_wp_error( $locked_state ) ) {
			$transition_error = $locked_state;
			throw new RuntimeException( $locked_state->get_error_code() );
		}
		if ( 'execute' === $mode && null !== $locked_state ) {
			$transition_error = new WP_Error( 'justice_hfcm_already_started', 'The HFCM workflow already has a stored state.', array( 'status' => 409 ) );
			throw new RuntimeException( 'justice_hfcm_already_started' );
		}
		if (
			in_array( $mode, array( 'rollback', 'finalize' ), true )
			&& ( ! is_array( $locked_state ) || 'pending_acceptance' !== (string) ( $locked_state['state'] ?? '' ) )
		) {
			$transition_error = new WP_Error( 'justice_hfcm_not_pending', 'The HFCM workflow is no longer pending acceptance.', array( 'status' => 409 ) );
			throw new RuntimeException( 'justice_hfcm_not_pending' );
		}

		$current_status = 'execute' === $mode ? 'active' : 'inactive';
		$snapshot       = justice_ops_hfcm_retirement_snapshot( $current_status, true );
		if ( is_wp_error( $snapshot ) ) {
			$transition_error = $snapshot;
			throw new RuntimeException( $snapshot->get_error_code() );
		}
		$hash_check = justice_ops_hfcm_retirement_verify_hashes( $snapshot['records'], $hashes, 'execute' === $mode ? null : $locked_state );
		if ( is_wp_error( $hash_check ) ) {
			$transition_error = $hash_check;
			throw new RuntimeException( $hash_check->get_error_code() );
		}

		if ( 'execute' === $mode ) {
			$updated = justice_ops_hfcm_retirement_update_statuses( 'active', 'inactive' );
			if ( is_wp_error( $updated ) ) {
				$transition_error = $updated;
				throw new RuntimeException( $updated->get_error_code() );
			}
			$after = justice_ops_hfcm_retirement_snapshot( 'inactive', true );
			if ( is_wp_error( $after ) ) {
				$transition_error = $after;
				throw new RuntimeException( $after->get_error_code() );
			}
			$pending = array(
				'state'          => 'pending_acceptance',
				'created_at_utc' => gmdate( 'c' ),
				'script_ids'     => array( 5, 6, 7 ),
				'snippet_hashes' => $hashes,
				'before'         => $snapshot['records'],
				'after'          => $after['records'],
			);
			if ( ! justice_ops_hfcm_retirement_insert_state( $pending ) ) {
				$transition_error = new WP_Error( 'justice_hfcm_pending_state_write_failed', 'The pending acceptance state could not be stored.', array( 'status' => 500 ) );
				throw new RuntimeException( 'justice_hfcm_pending_state_write_failed' );
			}
			$result_state = 'pending_acceptance';
		} elseif ( 'rollback' === $mode ) {
			$updated = justice_ops_hfcm_retirement_update_statuses( 'inactive', 'active' );
			if ( is_wp_error( $updated ) ) {
				$transition_error = $updated;
				throw new RuntimeException( $updated->get_error_code() );
			}
			if ( ! justice_ops_hfcm_retirement_delete_state() ) {
				$transition_error = new WP_Error( 'justice_hfcm_rollback_state_delete_failed', 'The pending acceptance state could not be removed.', array( 'status' => 500 ) );
				throw new RuntimeException( 'justice_hfcm_rollback_state_delete_failed' );
			}
			$after = justice_ops_hfcm_retirement_snapshot( 'active', true );
			if ( is_wp_error( $after ) ) {
				$transition_error = $after;
				throw new RuntimeException( $after->get_error_code() );
			}
			$result_state = 'rolled_back';
		} else {
			$complete                     = $locked_state;
			$complete['state']            = 'complete';
			$complete['completed_at_utc'] = gmdate( 'c' );
			$complete['final_records']    = $snapshot['records'];
			if ( ! justice_ops_hfcm_retirement_replace_state( $complete ) ) {
				$transition_error = new WP_Error( 'justice_hfcm_finalize_failed', 'The final acceptance state could not be stored.', array( 'status' => 500 ) );
				throw new RuntimeException( 'justice_hfcm_finalize_failed' );
			}
			$after        = $snapshot;
			$result_state = 'complete';
		}

		if ( false === $wpdb->query( 'COMMIT' ) ) { // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
			$transition_error = new WP_Error( 'justice_hfcm_commit_failed', 'The HFCM transaction could not be committed.', array( 'status' => 500 ) );
			throw new RuntimeException( 'justice_hfcm_commit_failed' );
		}
	} catch ( Throwable $error ) {
		$wpdb->query( 'ROLLBACK' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		justice_ops_hfcm_retirement_clear_option_cache();
		if ( is_wp_error( $transition_error ) ) {
			return $transition_error;
		}
		return new WP_Error(
			'justice_hfcm_transition_failed',
			'The HFCM transition failed and the InnoDB transaction was rolled back.',
			array( 'status' => 500, 'phase' => $mode, 'reason' => $error->getMessage() )
		);
	}

	justice_ops_hfcm_retirement_clear_option_cache();
	justice_ops_hfcm_retirement_clean_post_caches();
	$route_state = 'available_for_acceptance_or_rollback';
	if ( 'complete' === $result_state ) {
		$route_state = 'absent_on_next_request';
	} elseif ( 'rolled_back' === $result_state ) {
		$route_state = 'ready_for_execute';
	}
	return rest_ensure_response(
		array(
			'passed'      => true,
			'mode'        => $mode,
			'state'       => $result_state,
			'script_ids'  => array( 5, 6, 7 ),
			'records'     => $after['records'],
			'route_state' => $route_state,
		)
	);
}

/**
 * Register the bridge until the final acceptance seal exists.
 */
function justice_ops_hfcm_retirement_register_route(): void {
	if ( justice_ops_hfcm_retirement_is_complete() ) {
		return;
	}

	register_rest_route(
		'justice-ops/v1',
		'/retire-legacy-head-cards',
		array(
			'methods'             => 'POST',
			'permission_callback' => static function (): bool {
				return current_user_can( 'manage_options' );
			},
			'callback'            => 'justice_ops_hfcm_retirement_rest_callback',
		)
	);
}
add_action( 'rest_api_init', 'justice_ops_hfcm_retirement_register_route' );
