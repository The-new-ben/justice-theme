add_action( 'rest_api_init', function () {
	$expected_run_id          = __RUN_ID__;
	$expected_helper_id       = __HELPER_ID__;
	$expected_helper_name     = __HELPER_NAME__;
	$expected_route_base      = __ROUTE_BASE__;
	$expected_token           = __TOKEN__;
	$expected_token_sha256    = __TOKEN_SHA256__;
	$expected_commit_sha      = __COMMIT_SHA__;
	$expected_version         = __VERSION__;
	$expected_prior_version   = __PRIOR_VERSION__;
	$expected_artifact_url    = __ARTIFACT_URL__;
	$expected_artifact_sha256 = __ARTIFACT_SHA256__;
	$expected_artifact_bytes  = __ARTIFACT_BYTES__;
	$expected_expanded_bytes  = __ARTIFACT_EXPANDED_BYTES__;
	$expected_plugin          = __PLUGIN_BASENAME__;
	$expected_plugin_slug     = __PLUGIN_SLUG__;
	$expected_base_url        = __TARGET_BASE_URL__;
	$lock_option              = __LOCK_OPTION__;
	$state_option             = __STATE_OPTION__;
	$affected_paths           = __AFFECTED_PATHS__;
	$candidate_files          = __CANDIDATE_FILES__;
	$expected_recovery_proof  = __RECOVERY_PROOF__;
	$expected_marker_sha256   = __RECOVERY_MARKER_SHA256__;
	$expected_marker_bytes    = __RECOVERY_MARKER_BYTES__;
	$expected_normalized_hash = '__JUSTICE_OPS_HELPER_NORMALIZED_SHA256__';
	// WP_Upgrader::unpack_package() clears every child of wp-content/upgrade.
	// Recovery material must therefore live in a dedicated sibling path.
	$expected_backup_root     = WP_CONTENT_DIR . '/.justice-ops-recovery-' . substr( hash( 'sha256', $expected_run_id ), 0, 20 );

	$max_files        = 250;
	$max_file_bytes   = 5 * 1024 * 1024;
	$max_plugin_bytes = 20 * 1024 * 1024;
	$operation_lease_seconds = 15 * 60;
	$stale_lock_seconds      = 2 * 60 * 60;
	$scoped_option_names     = array(
		'rewrite_rules',
		'justice_enc_rewrite_flushed',
		'justice_review_claims_body_clean_v1',
		'justice_cards_db_ver',
	);

	$permission = static function (): bool {
		return current_user_can( 'update_plugins' );
	};

	$error_response = static function ( string $code, string $message, int $status, array $extra = array() ): WP_REST_Response {
		return new WP_REST_Response(
			array_merge(
				array(
					'success' => false,
					'code'    => $code,
					'message' => $message,
				),
				$extra
			),
			$status
		);
	};

	$classify_failure = static function ( Throwable $error, string $fallback ): string {
		$known = array(
			'The one-time deployment token is invalid.' => 'request_token_invalid',
			'The target site or release fingerprint changed.' => 'request_target_changed',
			'The Code Snippets identity API is unavailable.' => 'helper_identity_api_unavailable',
			'The temporary helper identity changed.' => 'helper_identity_changed',
			'The temporary helper code hash changed.' => 'helper_code_hash_changed',
			'The normalized helper self-hash changed.' => 'helper_self_hash_changed',
			'The operation nonce is absent or invalid.' => 'operation_nonce_invalid',
			'This Justice Ops deployment state already exists.' => 'run_state_exists',
			'The bound uPress recovery proof is invalid.' => 'marker_contract_invalid',
			'The bound uPress recovery marker filename is unsafe.' => 'marker_filename_invalid',
			'The bounded uPress marker directory is absent or linked.' => 'marker_root_unavailable',
			'The single-use uPress recovery marker is absent.' => 'marker_absent',
			'The uPress recovery marker bytes changed.' => 'marker_bytes_mismatch',
			'The uPress recovery marker payload changed.' => 'marker_payload_mismatch',
			'The uPress recovery marker is not bound to this exact site and release.' => 'marker_binding_mismatch',
			'The live plugin path differs from the recovery proof.' => 'marker_plugin_path_mismatch',
			'The single-use uPress recovery marker cannot be consumed.' => 'marker_consume_failed',
			'The consumed uPress recovery marker still exists.' => 'marker_consume_readback_failed',
			'An unknown deployment lock exists and requires manual recovery.' => 'foreign_lock_unknown_contract',
			'An active or recently expired deployment lock exists.' => 'foreign_lock_recent',
			'The stale lock recovery paths are outside the bounded policy.' => 'foreign_lock_paths_unbounded',
			'A stale lock still has recovery state, files or a helper; automatic reclaim is forbidden.' => 'foreign_lock_has_recovery',
			'The exclusive Justice Ops deployment lock cannot be acquired.' => 'lock_insert_conflict',
			'The exclusive Justice Ops deployment lock failed exact readback.' => 'lock_readback_failed',
			'The expected prior Justice Ops plugin is not active.' => 'prior_inactive_or_missing',
			'The live Justice Ops version differs from the prior pin.' => 'prior_version_mismatch',
			'The live plugin changed during snapshot preparation.' => 'prior_tree_changed',
			'The bounded server recovery root already exists.' => 'backup_root_preexists',
			'The bounded server recovery root cannot be created.' => 'backup_root_create_failed',
			'The fresh server recovery copy differs from live.' => 'backup_copy_mismatch',
			'Free disk space cannot be measured.' => 'disk_measurement_failed',
			'Free disk space cannot hold every bounded deploy and recovery copy.' => 'disk_capacity_insufficient',
			'The bounded disk capacity probe size is outside the safe limit.' => 'disk_probe_size_unbounded',
			'The bounded disk capacity probe directory is unavailable.' => 'disk_probe_root_unavailable',
			'The bounded disk capacity probe cannot be opened.' => 'disk_probe_open_failed',
			'The bounded disk capacity probe write is incomplete.' => 'disk_probe_write_failed',
			'The bounded disk capacity probe cannot be flushed.' => 'disk_probe_flush_failed',
			'The bounded disk capacity probe written size differs.' => 'disk_probe_written_size_mismatch',
			'The bounded disk capacity probe cannot be reopened.' => 'disk_probe_reopen_failed',
			'The bounded disk capacity probe read is incomplete.' => 'disk_probe_read_failed',
			'The bounded disk capacity probe readback differs.' => 'disk_probe_readback_mismatch',
			'The bounded disk capacity probe cannot be removed.' => 'disk_probe_cleanup_failed',
		);
		$message = $error->getMessage();
		if ( isset( $known[ $message ] ) ) {
			return $known[ $message ];
		}
		return 1 === preg_match( '/^[a-z0-9_]{3,80}$/', $fallback ) ? $fallback : 'unexpected_failure';
	};

	$inspect_directory = static function ( string $directory, bool $include_data = false ) use ( $max_files, $max_file_bytes, $max_plugin_bytes ): array {
		$directory = untrailingslashit( $directory );
		if ( ! is_dir( $directory ) || is_link( $directory ) ) {
			throw new RuntimeException( 'The bounded plugin directory is absent or linked.' );
		}
		$root = realpath( $directory );
		if ( ! is_string( $root ) || '' === $root ) {
			throw new RuntimeException( 'The bounded plugin directory cannot be resolved.' );
		}
		$root = wp_normalize_path( $root );
		$rows = array();
		$total = 0;
		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $directory, FilesystemIterator::SKIP_DOTS ),
			RecursiveIteratorIterator::LEAVES_ONLY
		);
		foreach ( $iterator as $item ) {
			if ( $item->isLink() || ! $item->isFile() ) {
				throw new RuntimeException( 'The bounded plugin tree contains a non-regular file.' );
			}
			$absolute = wp_normalize_path( $item->getPathname() );
			if ( 0 !== strpos( $absolute, $root . '/' ) ) {
				throw new RuntimeException( 'A plugin file escaped the bounded directory.' );
			}
			$relative = substr( $absolute, strlen( $root ) + 1 );
			if ( '' === $relative || false !== strpos( $relative, '..' ) || false !== strpos( $relative, '\\' ) ) {
				throw new RuntimeException( 'A plugin relative path is unsafe.' );
			}
			$body = file_get_contents( $item->getPathname() );
			if ( ! is_string( $body ) ) {
				throw new RuntimeException( 'A plugin file cannot be read.' );
			}
			$bytes = strlen( $body );
			$total += $bytes;
			if ( $bytes > $max_file_bytes || $total > $max_plugin_bytes || count( $rows ) >= $max_files ) {
				throw new RuntimeException( 'The plugin tree exceeds the bounded export contract.' );
			}
			$row = array(
				'path'   => $relative,
				'bytes'  => $bytes,
				'sha256' => hash( 'sha256', $body ),
			);
			if ( $include_data ) {
				$row['data_base64'] = base64_encode( $body );
			}
			$rows[] = $row;
		}
		usort(
			$rows,
			static function ( array $left, array $right ): int {
				return strcmp( (string) $left['path'], (string) $right['path'] );
			}
		);
		$files = array();
		$hash  = hash_init( 'sha256' );
		foreach ( $rows as $row ) {
			$relative = (string) $row['path'];
			$files[ $relative ] = array(
				'bytes'  => (int) $row['bytes'],
				'sha256' => (string) $row['sha256'],
			);
			hash_update( $hash, $relative . "\0" . (string) $row['bytes'] . "\0" . (string) $row['sha256'] . "\n" );
		}
		return array(
			'file_count'      => count( $rows ),
			'expanded_bytes'  => $total,
			'directory_sha256'=> hash_final( $hash ),
			'files'           => $files,
			'rows'            => $rows,
		);
	};

	$copy_directory = static function ( string $source, string $destination ) use ( $inspect_directory ): array {
		$source_manifest = $inspect_directory( $source, false );
		if ( file_exists( $destination ) || is_link( $destination ) ) {
			throw new RuntimeException( 'The bounded copy destination already exists.' );
		}
		if ( ! wp_mkdir_p( $destination ) ) {
			throw new RuntimeException( 'The bounded copy destination cannot be created.' );
		}
		foreach ( $source_manifest['files'] as $relative => $identity ) {
			$source_file      = trailingslashit( $source ) . $relative;
			$destination_file = trailingslashit( $destination ) . $relative;
			$parent           = dirname( $destination_file );
			if ( ! is_dir( $parent ) && ! wp_mkdir_p( $parent ) ) {
				throw new RuntimeException( 'A bounded backup directory cannot be created.' );
			}
			$body = file_get_contents( $source_file );
			if ( ! is_string( $body ) ) {
				throw new RuntimeException( 'A bounded source file cannot be read.' );
			}
			$written = file_put_contents( $destination_file, $body, LOCK_EX );
			if ( ! is_int( $written ) || strlen( $body ) !== $written ) {
				throw new RuntimeException( 'A bounded backup file cannot be written.' );
			}
			@chmod( $destination_file, 0644 );
		}
		$destination_manifest = $inspect_directory( $destination, false );
		if ( $source_manifest['files'] !== $destination_manifest['files'] || $source_manifest['directory_sha256'] !== $destination_manifest['directory_sha256'] ) {
			throw new RuntimeException( 'The bounded directory copy failed exact readback.' );
		}
		return $destination_manifest;
	};

	$remove_directory = static function ( string $directory ) use ( $expected_backup_root ): bool {
		$allowed    = wp_normalize_path( untrailingslashit( $expected_backup_root ) );
		$normalized = wp_normalize_path( untrailingslashit( $directory ) );
		if ( $normalized !== $allowed && 0 !== strpos( $normalized, $allowed . '/' ) ) {
			throw new RuntimeException( 'Refused to remove a path outside the bounded recovery root.' );
		}
		if ( is_link( $directory ) ) {
			return @unlink( $directory );
		}
		if ( ! file_exists( $directory ) ) {
			return true;
		}
		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $directory, FilesystemIterator::SKIP_DOTS ),
			RecursiveIteratorIterator::CHILD_FIRST
		);
		foreach ( $iterator as $item ) {
			$path = $item->getPathname();
			$ok   = ( $item->isLink() || $item->isFile() ) ? @unlink( $path ) : @rmdir( $path );
			if ( ! $ok ) {
				throw new RuntimeException( 'A bounded recovery path cannot be removed.' );
			}
		}
		return @rmdir( $directory );
	};

	$invalidate_option_cache = static function ( string $option_name ): void {
		wp_cache_delete( $option_name, 'options' );
		wp_cache_delete( 'notoptions', 'options' );
	};

	$get_raw_option = static function ( string $option_name ): array {
		global $wpdb;
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT option_value, autoload FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
				$option_name
			),
			ARRAY_A
		);
		if ( '' !== (string) $wpdb->last_error ) {
			throw new RuntimeException( 'A scoped raw option read failed.' );
		}
		if ( ! is_array( $row ) ) {
			return array( 'exists' => false, 'value_base64' => '', 'autoload' => '' );
		}
		return array(
			'exists'       => true,
			'value_base64' => base64_encode( (string) $row['option_value'] ),
			'autoload'     => (string) $row['autoload'],
		);
	};

	$raw_option_value = static function ( array $record ): ?string {
		if ( empty( $record['exists'] ) ) {
			return null;
		}
		$value = base64_decode( (string) ( $record['value_base64'] ?? '' ), true );
		if ( ! is_string( $value ) ) {
			throw new RuntimeException( 'A raw option value cannot be decoded.' );
		}
		return $value;
	};

	$assert_raw_option = static function ( string $option_name, ?string $expected_raw ) use ( $get_raw_option, $raw_option_value ): void {
		$observed = $raw_option_value( $get_raw_option( $option_name ) );
		if ( null === $expected_raw ? null !== $observed : ( ! is_string( $observed ) || ! hash_equals( $expected_raw, $observed ) ) ) {
			throw new RuntimeException( 'An exact database option readback differs: ' . $option_name );
		}
	};

	$delete_raw_option_cas = static function ( string $option_name, string $expected_raw ) use ( $assert_raw_option, $invalidate_option_cache ): bool {
		global $wpdb;
		$rows = $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name = %s AND option_value = %s",
				$option_name,
				$expected_raw
			)
		);
		if ( 1 !== $rows || '' !== (string) $wpdb->last_error ) {
			throw new RuntimeException( 'An exact option CAS delete failed: ' . $option_name );
		}
		$invalidate_option_cache( $option_name );
		$assert_raw_option( $option_name, null );
		if ( null !== get_option( $option_name, null ) ) {
			throw new RuntimeException( 'An exact option CAS delete remained visible through the option API: ' . $option_name );
		}
		return true;
	};

	$acquire_raw_option_once = static function ( string $option_name, string $raw_value ) use ( $get_raw_option, $raw_option_value, $invalidate_option_cache ): array {
		global $wpdb;
		$invalidate_option_cache( $option_name );
		$rows = $wpdb->query(
			$wpdb->prepare(
				"INSERT IGNORE INTO {$wpdb->options} (option_name, option_value, autoload) VALUES (%s, %s, %s)",
				$option_name,
				$raw_value,
				'no'
			)
		);
		if ( false === $rows || '' !== (string) $wpdb->last_error ) {
			throw new RuntimeException( 'The exclusive lock insert failed at the database boundary.' );
		}
		if ( 1 !== $rows ) {
			$observed = $raw_option_value( $get_raw_option( $option_name ) );
			return array(
				'inserted'              => false,
				'verified'              => false,
				'conflict_raw_present'  => is_string( $observed ),
				'conflict_raw_sha256'   => is_string( $observed ) ? hash( 'sha256', $observed ) : '',
			);
		}

		$invalidate_option_cache( $option_name );
		try {
			$observed = $raw_option_value( $get_raw_option( $option_name ) );
			$api_value = get_option( $option_name, null );
			$verified = is_string( $observed ) && hash_equals( $raw_value, $observed ) && is_string( $api_value ) && hash_equals( $raw_value, $api_value );
			return array(
				'inserted'              => true,
				'verified'              => $verified,
				'raw_sha256'            => is_string( $observed ) ? hash( 'sha256', $observed ) : '',
				'api_sha256'            => is_string( $api_value ) ? hash( 'sha256', $api_value ) : '',
				'raw_api_match'         => $verified,
			);
		} catch ( Throwable $error ) {
			return array(
				'inserted'              => true,
				'verified'              => false,
				'readback_error_sha256' => hash( 'sha256', $error->getMessage() ),
			);
		}
	};

	$persist_new_state = static function ( string $option_name, array $state ) use ( $get_raw_option, $raw_option_value, $assert_raw_option, $invalidate_option_cache ): array {
		$raw = maybe_serialize( $state );
		$invalidate_option_cache( $option_name );
		if ( ! is_string( $raw ) || ! add_option( $option_name, $state, '', false ) ) {
			throw new RuntimeException( 'The bounded deployment state cannot be persisted.' );
		}
		$invalidate_option_cache( $option_name );
		$assert_raw_option( $option_name, $raw );
		$readback = $raw_option_value( $get_raw_option( $option_name ) );
		if ( ! is_string( $readback ) || ! hash_equals( $raw, $readback ) ) {
			throw new RuntimeException( 'The fresh deployment state failed exact readback.' );
		}
		return $state;
	};

	$cas_state = static function ( array $expected, array $next ) use ( $state_option, $assert_raw_option, $invalidate_option_cache ): array {
		global $wpdb;
		$expected_raw = maybe_serialize( $expected );
		$next_raw     = maybe_serialize( $next );
		if ( ! is_string( $expected_raw ) || ! is_string( $next_raw ) ) {
			throw new RuntimeException( 'The deployment state cannot be serialized for CAS.' );
		}
		$rows = $wpdb->query(
			$wpdb->prepare(
				"UPDATE {$wpdb->options} SET option_value = %s WHERE option_name = %s AND option_value = %s",
				$next_raw,
				$state_option,
				$expected_raw
			)
		);
		if ( 1 !== $rows || '' !== (string) $wpdb->last_error ) {
			throw new RuntimeException( 'The atomic deployment state transition lost its CAS.' );
		}
		$invalidate_option_cache( $state_option );
		$assert_raw_option( $state_option, $next_raw );
		$readback = get_option( $state_option, null );
		if ( ! is_array( $readback ) || maybe_serialize( $readback ) !== $next_raw ) {
			throw new RuntimeException( 'The atomic deployment state transition failed readback.' );
		}
		return $next;
	};

	$assert_options_snapshot = static function ( array $snapshot ) use ( $get_raw_option ): void {
		foreach ( $snapshot as $option_name => $expected ) {
			if ( ! is_string( $option_name ) || ! is_array( $expected ) ) {
				throw new RuntimeException( 'The scoped option snapshot is invalid during readback.' );
			}
			if ( $get_raw_option( $option_name ) !== $expected ) {
				throw new RuntimeException( 'A scoped option differs from its exact database snapshot: ' . $option_name );
			}
		}
	};

	$restore_raw_options = static function ( array $snapshot ) use ( $get_raw_option, $assert_options_snapshot ): void {
		global $wpdb;
		$wpdb->query( 'START TRANSACTION' );
		try {
			foreach ( $snapshot as $option_name => $record ) {
				if ( ! is_string( $option_name ) || ! is_array( $record ) ) {
					throw new RuntimeException( 'The scoped option snapshot is invalid.' );
				}
				if ( empty( $record['exists'] ) ) {
					$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name = %s", $option_name ) );
				} else {
					$value = base64_decode( (string) $record['value_base64'], true );
					if ( ! is_string( $value ) ) {
						throw new RuntimeException( 'The scoped option snapshot cannot be decoded.' );
					}
					$current = $get_raw_option( $option_name );
					if ( ! empty( $current['exists'] ) ) {
						$wpdb->query(
							$wpdb->prepare(
								"UPDATE {$wpdb->options} SET option_value = %s, autoload = %s WHERE option_name = %s",
								$value,
								(string) $record['autoload'],
								$option_name
							)
						);
					} else {
						$wpdb->query(
							$wpdb->prepare(
								"INSERT INTO {$wpdb->options} (option_name, option_value, autoload) VALUES (%s, %s, %s)",
								$option_name,
								$value,
								(string) $record['autoload']
							)
						);
					}
				}
				if ( '' !== (string) $wpdb->last_error ) {
					throw new RuntimeException( 'A scoped raw option restore failed.' );
				}
			}
			if ( false === $wpdb->query( 'COMMIT' ) ) {
				throw new RuntimeException( 'The scoped option restore could not commit.' );
			}
		} catch ( Throwable $error ) {
			$wpdb->query( 'ROLLBACK' );
			throw $error;
		}
		foreach ( array_keys( $snapshot ) as $option_name ) {
			if ( is_string( $option_name ) ) {
				wp_cache_delete( $option_name, 'options' );
			}
		}
		$assert_options_snapshot( $snapshot );
	};

	$database_preconditions = static function (): array {
		global $wpdb;
		$table = $wpdb->prefix . 'jt_card_events_daily';
		$options_engine = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s',
				$wpdb->options
			)
		);
		if ( 'InnoDB' !== (string) $options_engine ) {
			throw new RuntimeException( 'The WordPress options table is non-transactional.' );
		}
		$engine = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = %s',
				$table
			)
		);
		if ( 'InnoDB' !== (string) $engine ) {
			throw new RuntimeException( 'The Justice card-events table is absent or non-transactional.' );
		}
		if ( '1' !== (string) get_option( 'justice_cards_db_ver', '' ) ) {
			throw new RuntimeException( 'The Justice card-events schema has a pending migration.' );
		}
		if ( '' === (string) get_option( 'justice_review_claims_body_clean_v1', '' ) ) {
			throw new RuntimeException( 'The legacy review-body migration has not completed.' );
		}
		$row_count = $wpdb->get_var( "SELECT COUNT(*) FROM `{$table}`" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		return array(
			'card_events_table'  => $table,
			'card_events_engine' => (string) $engine,
			'card_events_rows'   => (int) $row_count,
			'options_engine'     => (string) $options_engine,
			'cards_db_version'   => '1',
			'review_cleanup_done'=> true,
			'migration_scope'    => array( 'rewrite_rules', 'justice_enc_rewrite_flushed' ),
		);
	};

	$purge_caches = static function () use ( $affected_paths ): array {
		$urls                     = array();
		$confirmations            = array();
		$page_cache_confirmations = array();
		$litespeed_all_handlers = (int) has_action( 'litespeed_purge_all' );
		$litespeed_url_handlers = (int) has_action( 'litespeed_purge_url' );
		if ( $litespeed_all_handlers > 0 ) {
			do_action( 'litespeed_purge_all' );
			$confirmations[] = 'litespeed_purge_all_handler';
			$page_cache_confirmations[] = 'litespeed_purge_all_handler';
		}
		foreach ( $affected_paths as $path ) {
			$url    = home_url( $path );
			$urls[] = $url;
			if ( $litespeed_url_handlers > 0 ) {
				do_action( 'litespeed_purge_url', $url );
			}
		}
		if ( class_exists( 'autoptimizeCache' ) && method_exists( 'autoptimizeCache', 'clearall' ) ) {
			autoptimizeCache::clearall();
			$confirmations[] = 'autoptimize_clearall_called';
		}
		if ( function_exists( 'rocket_clean_domain' ) ) {
			rocket_clean_domain();
			$confirmations[] = 'rocket_clean_domain_called';
			$page_cache_confirmations[] = 'rocket_clean_domain_called';
		}
		if ( function_exists( 'w3tc_flush_all' ) ) {
			w3tc_flush_all();
			$confirmations[] = 'w3tc_flush_all_called';
			$page_cache_confirmations[] = 'w3tc_flush_all_called';
		}
		$object_result = wp_cache_flush();
		if ( true !== $object_result ) {
			throw new RuntimeException( 'The required object-cache flush did not return exact true.' );
		}
		$edge = array();
		$edge_confirmed = 0;
		foreach ( $urls as $url ) {
			$response = wp_remote_request( $url, array( 'method' => 'PURGE', 'timeout' => 8 ) );
			$status   = is_wp_error( $response ) ? 0 : (int) wp_remote_retrieve_response_code( $response );
			if ( in_array( $status, array( 200, 202, 204 ), true ) ) {
				++$edge_confirmed;
			}
			$edge[] = array(
				'url'    => $url,
				'status' => $status,
			);
		}
		if ( $litespeed_url_handlers > 0 ) {
			$confirmations[] = 'litespeed_url_handlers_dispatched';
			$page_cache_confirmations[] = 'litespeed_url_handlers_dispatched';
		}
		if ( count( $urls ) === $edge_confirmed ) {
			$confirmations[] = 'canonical_edge_purge_http_confirmed';
			$page_cache_confirmations[] = 'canonical_edge_purge_http_confirmed';
		}
		if ( empty( $page_cache_confirmations ) ) {
			throw new RuntimeException( 'No page-cache purge mechanism provided a positive confirmation.' );
		}
		return array(
			'confirmed'                       => true,
			'confirmation_modes'              => $confirmations,
			'page_cache_confirmation_modes'   => $page_cache_confirmations,
			'object_cache_flush_result'       => true,
			'litespeed_purge_all_handlers'    => $litespeed_all_handlers,
			'litespeed_url_purge_handlers'    => $litespeed_url_handlers,
			'litespeed_url_purge_dispatches'  => $litespeed_url_handlers > 0 ? count( $urls ) : 0,
			'affected_urls'                   => $urls,
			'edge_purge_dispatches'           => $edge,
			'edge_purge_confirmed_count'      => $edge_confirmed,
		);
	};

	$load_state = static function () use ( $state_option, $expected_run_id, $expected_helper_id, $expected_token_sha256, $expected_backup_root, $get_raw_option, $raw_option_value ): array {
		$state = get_option( $state_option, null );
		if ( ! is_array( $state ) || (string) ( $state['run_id'] ?? '' ) !== $expected_run_id || (int) ( $state['helper_id'] ?? 0 ) !== $expected_helper_id || (string) ( $state['token_sha256'] ?? '' ) !== $expected_token_sha256 || (string) ( $state['backup_root'] ?? '' ) !== $expected_backup_root ) {
			throw new RuntimeException( 'The bounded deployment state is absent or changed.' );
		}
		$raw = $raw_option_value( $get_raw_option( $state_option ) );
		if ( ! is_string( $raw ) || maybe_serialize( $state ) !== $raw ) {
			throw new RuntimeException( 'The bounded deployment state differs from its direct database row.' );
		}
		return $state;
	};

	$assert_lock = static function ( array $state ) use ( $lock_option, $get_raw_option, $raw_option_value ): void {
		$observed = $raw_option_value( $get_raw_option( $lock_option ) );
		if ( ! is_string( $observed ) || ! isset( $state['lock_value'] ) || ! is_string( $state['lock_value'] ) || ! hash_equals( $state['lock_value'], $observed ) ) {
			throw new RuntimeException( 'Exact deployment-lock ownership was lost.' );
		}
	};

	$begin_operation = static function ( array $state, string $nonce, string $name, array $allowed_phases, ?string $next_phase = null, bool $mutation_started = false ) use ( $cas_state, $operation_lease_seconds ): array {
		$phase = (string) ( $state['phase'] ?? '' );
		if ( ! in_array( $phase, $allowed_phases, true ) ) {
			throw new RuntimeException( 'The operation is not allowed from the current phase.', 409 );
		}
		$now = time();
		$operation = isset( $state['operation'] ) && is_array( $state['operation'] ) ? $state['operation'] : array();
		if ( ! empty( $operation['active'] ) ) {
			$expires = (int) ( $operation['lease_expires_epoch'] ?? 0 );
			if ( 'cleanup' === $name && (string) ( $operation['name'] ?? '' ) === $name && hash_equals( (string) ( $operation['nonce_sha256'] ?? '' ), hash( 'sha256', $nonce ) ) ) {
				return $state;
			}
			if ( $expires >= $now ) {
				throw new RuntimeException( 'Another deployment operation still owns the active lease.', 409 );
			}
			if ( 'installing' === $phase || ! empty( $state['mutation_started'] ) ) {
				throw new RuntimeException( 'An expired mutation lease is ambiguous and cannot be stolen automatically.', 409 );
			}
		}
		$next = $state;
		$next['state_revision'] = 1 + (int) ( $state['state_revision'] ?? 0 );
		$next['phase'] = null === $next_phase ? $phase : $next_phase;
		$next['mutation_started'] = $mutation_started || ! empty( $state['mutation_started'] );
		$next['operation'] = array(
			'active'              => true,
			'name'                => $name,
			'nonce_sha256'        => hash( 'sha256', $nonce ),
			'started_at_utc'      => gmdate( 'c', $now ),
			'heartbeat_at_utc'    => gmdate( 'c', $now ),
			'heartbeat_epoch'     => $now,
			'lease_expires_epoch' => $now + $operation_lease_seconds,
		);
		return $cas_state( $state, $next );
	};

	$heartbeat_operation = static function ( array $state, string $nonce, string $name ) use ( $cas_state, $operation_lease_seconds ): array {
		$operation = isset( $state['operation'] ) && is_array( $state['operation'] ) ? $state['operation'] : array();
		if ( empty( $operation['active'] ) || (string) ( $operation['name'] ?? '' ) !== $name || ! hash_equals( (string) ( $operation['nonce_sha256'] ?? '' ), hash( 'sha256', $nonce ) ) ) {
			throw new RuntimeException( 'The deployment operation lease identity changed.' );
		}
		$now = time();
		$next = $state;
		$next['state_revision'] = 1 + (int) ( $state['state_revision'] ?? 0 );
		$next['operation']['heartbeat_at_utc']    = gmdate( 'c', $now );
		$next['operation']['heartbeat_epoch']     = $now;
		$next['operation']['lease_expires_epoch'] = $now + $operation_lease_seconds;
		return $cas_state( $state, $next );
	};

	$complete_operation = static function ( array $state, string $nonce, string $name, string $next_phase, array $result = array() ) use ( $cas_state ): array {
		$operation = isset( $state['operation'] ) && is_array( $state['operation'] ) ? $state['operation'] : array();
		if ( empty( $operation['active'] ) || (string) ( $operation['name'] ?? '' ) !== $name || ! hash_equals( (string) ( $operation['nonce_sha256'] ?? '' ), hash( 'sha256', $nonce ) ) ) {
			throw new RuntimeException( 'The deployment operation cannot complete without its exact lease.' );
		}
		$next = $state;
		$next['state_revision'] = 1 + (int) ( $state['state_revision'] ?? 0 );
		$next['phase'] = $next_phase;
		$next['operation']['active'] = false;
		$next['operation']['completed_at_utc'] = gmdate( 'c' );
		$next['last_operation'] = array(
			'name'           => $name,
			'nonce_sha256'   => hash( 'sha256', $nonce ),
			'completed_at_utc'=> gmdate( 'c' ),
			'result'         => $result,
		);
		return $cas_state( $state, $next );
	};

	$abort_nonmutating_operation = static function ( array $state, string $nonce, string $name, string $message ) use ( $cas_state ): array {
		$operation = isset( $state['operation'] ) && is_array( $state['operation'] ) ? $state['operation'] : array();
		if ( ( 'install' === $name && ! empty( $state['mutation_started'] ) ) || empty( $operation['active'] ) || (string) ( $operation['name'] ?? '' ) !== $name || ! hash_equals( (string) ( $operation['nonce_sha256'] ?? '' ), hash( 'sha256', $nonce ) ) ) {
			return $state;
		}
		$next = $state;
		$next['state_revision'] = 1 + (int) ( $state['state_revision'] ?? 0 );
		$next['operation']['active'] = false;
		$next['operation']['failed_at_utc'] = gmdate( 'c' );
		$next['last_operation'] = array(
			'name'            => $name,
			'nonce_sha256'    => hash( 'sha256', $nonce ),
			'failed_at_utc'   => gmdate( 'c' ),
			'error_sha256'    => hash( 'sha256', $message ),
		);
		return $cas_state( $state, $next );
	};

	// BEGIN JUSTICE OPS DISK CAPACITY CONTRACT.
	$disk_probe_cleanup_safe = true;
	$prove_disk_capacity_with_write = static function ( string $phase, int $required ) use ( $expected_run_id, &$disk_probe_cleanup_safe ): array {
		$disk_probe_cleanup_safe = true;
		$max_probe_bytes = 150 * 1024 * 1024;
		if ( $required <= 0 || $required > $max_probe_bytes ) {
			throw new RuntimeException( 'The bounded disk capacity probe size is outside the safe limit.' );
		}

		$content_root = realpath( WP_CONTENT_DIR );
		$probe_root   = WP_CONTENT_DIR . '/upgrade';
		if ( ! is_string( $content_root ) || '' === $content_root || is_link( $probe_root ) || ! is_dir( $probe_root ) ) {
			throw new RuntimeException( 'The bounded disk capacity probe directory is unavailable.' );
		}
		$probe_root_real = realpath( $probe_root );
		$content_root    = trailingslashit( wp_normalize_path( $content_root ) );
		$probe_root_real = is_string( $probe_root_real ) ? wp_normalize_path( $probe_root_real ) : '';
		if ( '' === $probe_root_real || 0 !== strpos( trailingslashit( $probe_root_real ), $content_root ) ) {
			throw new RuntimeException( 'The bounded disk capacity probe directory is unavailable.' );
		}

		$probe_name = '.justice-ops-capacity-probe-' . substr( hash( 'sha256', $expected_run_id . '|' . $phase . '|' . wp_generate_uuid4() ), 0, 32 ) . '.tmp';
		$probe_path = trailingslashit( $probe_root_real ) . $probe_name;
		$writer = null;
		$reader = null;
		$created = false;
		$failure = null;
		$written_bytes = 0;
		$readable_bytes = 0;
		$expected_digest = '';
		$observed_digest = '';
		$cleanup_verified = false;
		$unlink_succeeded = false;

		try {
			$writer = @fopen( $probe_path, 'x+b' );
			if ( ! is_resource( $writer ) ) {
				throw new RuntimeException( 'The bounded disk capacity probe cannot be opened.' );
			}
			$created = true;
			$disk_probe_cleanup_safe = false;
			$write_chunk_bytes = 256 * 1024;
			$write_hash = hash_init( 'sha256' );
			while ( $written_bytes < $required ) {
				$remaining = $required - $written_bytes;
				$piece_bytes = min( $write_chunk_bytes, $remaining );
				$piece = random_bytes( $piece_bytes );
				$written = @fwrite( $writer, $piece );
				if ( ! is_int( $written ) || $written !== $piece_bytes ) {
					throw new RuntimeException( 'The bounded disk capacity probe write is incomplete.' );
				}
				hash_update( $write_hash, $piece );
				$written_bytes += $written;
			}
			if ( true !== @fflush( $writer ) ) {
				throw new RuntimeException( 'The bounded disk capacity probe cannot be flushed.' );
			}
			$written_stat = @fstat( $writer );
			if ( ! is_array( $written_stat ) || (int) ( $written_stat['size'] ?? -1 ) !== $required ) {
				throw new RuntimeException( 'The bounded disk capacity probe written size differs.' );
			}
			$expected_digest = hash_final( $write_hash );
			if ( true !== @fclose( $writer ) ) {
				throw new RuntimeException( 'The bounded disk capacity probe cannot be flushed.' );
			}
			$writer = null;
			clearstatcache( true, $probe_path );
			$persisted_size = @filesize( $probe_path );
			if ( ! is_int( $persisted_size ) || $persisted_size !== $required ) {
				throw new RuntimeException( 'The bounded disk capacity probe written size differs.' );
			}

			$reader = @fopen( $probe_path, 'rb' );
			if ( ! is_resource( $reader ) ) {
				throw new RuntimeException( 'The bounded disk capacity probe cannot be reopened.' );
			}
			$read_hash = hash_init( 'sha256' );
			$read_chunk_bytes = 256 * 1024;
			while ( $readable_bytes < $required ) {
				$read_length = min( $read_chunk_bytes, $required - $readable_bytes );
				$piece = @fread( $reader, $read_length );
				if ( ! is_string( $piece ) || '' === $piece ) {
					throw new RuntimeException( 'The bounded disk capacity probe read is incomplete.' );
				}
				$piece_bytes = strlen( $piece );
				if ( $piece_bytes > $read_length ) {
					throw new RuntimeException( 'The bounded disk capacity probe readback differs.' );
				}
				hash_update( $read_hash, $piece );
				$readable_bytes += $piece_bytes;
			}
			$extra = @fread( $reader, 1 );
			if ( ! is_string( $extra ) || '' !== $extra ) {
				throw new RuntimeException( 'The bounded disk capacity probe readback differs.' );
			}
			$observed_digest = hash_final( $read_hash );
			if ( $readable_bytes !== $required || ! hash_equals( $expected_digest, $observed_digest ) ) {
				throw new RuntimeException( 'The bounded disk capacity probe readback differs.' );
			}
			if ( true !== @fclose( $reader ) ) {
				throw new RuntimeException( 'The bounded disk capacity probe read is incomplete.' );
			}
			$reader = null;
		} catch ( Throwable $error ) {
			$failure = $error;
		} finally {
			if ( is_resource( $reader ) ) {
				@fclose( $reader );
			}
			if ( is_resource( $writer ) ) {
				@fclose( $writer );
			}
			if ( $created ) {
				$unlink_succeeded = @unlink( $probe_path );
				clearstatcache( true, $probe_path );
				$cleanup_verified = $unlink_succeeded && ! file_exists( $probe_path ) && ! is_link( $probe_path );
				$disk_probe_cleanup_safe = $cleanup_verified;
			}
		}

		if ( $created && ! $cleanup_verified ) {
			throw new RuntimeException( 'The bounded disk capacity probe cannot be removed.' );
		}
		if ( $failure instanceof Throwable ) {
			throw $failure;
		}
		return array(
			'method'           => 'bounded_real_write_read_unlink_probe',
			'proven_bytes'     => $required,
			'written_bytes'    => $written_bytes,
			'readable_bytes'   => $readable_bytes,
			'sha256'           => $observed_digest,
			'cleanup_verified' => $cleanup_verified,
			'max_probe_bytes'  => $max_probe_bytes,
		);
	};

	$assert_disk_capacity = static function ( string $phase, int $prior_expanded, int $rollback_zip_bytes = 0 ) use ( $expected_artifact_bytes, $expected_expanded_bytes, $prove_disk_capacity_with_write ): array {
		$rollback_bound = $rollback_zip_bytes > 0 ? $rollback_zip_bytes : $prior_expanded + 1024 * 1024;
		$copies = array(
			'prior_backup_copy'          => $prior_expanded,
			'rollback_zip'               => $rollback_bound,
			'rollback_verify_extraction' => $prior_expanded,
			'candidate_download'         => $expected_artifact_bytes,
			'candidate_extraction'       => $expected_expanded_bytes,
			'rollback_restore_copy'      => $prior_expanded,
			'safety_margin'              => 20 * 1024 * 1024,
		);
		$required = array_sum( $copies );
		if ( function_exists( 'disk_free_space' ) ) {
			$free = @disk_free_space( WP_CONTENT_DIR );
			if ( ! is_float( $free ) && ! is_int( $free ) ) {
				throw new RuntimeException( 'Free disk space cannot be measured.' );
			}
			if ( (int) $free < $required ) {
				throw new RuntimeException( 'Free disk space cannot hold every bounded deploy and recovery copy.' );
			}
			return array(
				'phase'          => $phase,
				'free_bytes'     => (int) $free,
				'required_bytes' => $required,
				'copies'         => $copies,
			);
		}

		$probe = $prove_disk_capacity_with_write( $phase, (int) $required );
		return array(
			'phase'          => $phase,
			'free_bytes'     => null,
			'required_bytes' => $required,
			'copies'         => $copies,
			'capacity_proof' => $probe,
		);
	};
	// END JUSTICE OPS DISK CAPACITY CONTRACT.

	$inspect_recovery_marker = static function ( bool $consume = false ) use ( $expected_recovery_proof, $expected_marker_sha256, $expected_marker_bytes, $expected_plugin_slug, $expected_base_url, $expected_commit_sha, $expected_artifact_sha256, $expected_prior_version ): array {
		if ( ! is_array( $expected_recovery_proof ) ) {
			throw new RuntimeException( 'The bound uPress recovery proof is invalid.' );
		}
		$filename = (string) ( $expected_recovery_proof['marker_filename'] ?? '' );
		if ( 1 !== preg_match( '/^\.justice-ops-upress-recovery-[0-9a-f]{32}\.json$/', $filename ) || basename( $filename ) !== $filename ) {
			throw new RuntimeException( 'The bound uPress recovery marker filename is unsafe.' );
		}
		$marker_root = wp_normalize_path( WP_CONTENT_DIR . '/upgrade' );
		if ( is_link( $marker_root ) || ! is_dir( $marker_root ) ) {
			throw new RuntimeException( 'The bounded uPress marker directory is absent or linked.', 409 );
		}
		$marker = $marker_root . '/' . $filename;
		if ( is_link( $marker ) || ! is_file( $marker ) ) {
			throw new RuntimeException( 'The single-use uPress recovery marker is absent.', 409 );
		}
		$body = file_get_contents( $marker );
		if ( ! is_string( $body ) || strlen( $body ) !== $expected_marker_bytes || ! hash_equals( $expected_marker_sha256, hash( 'sha256', $body ) ) ) {
			throw new RuntimeException( 'The uPress recovery marker bytes changed.', 409 );
		}
		$decoded = json_decode( $body, true );
		if ( ! is_array( $decoded ) || $decoded !== $expected_recovery_proof ) {
			throw new RuntimeException( 'The uPress recovery marker payload changed.', 409 );
		}
		$issued  = strtotime( (string) ( $decoded['issued_at_utc'] ?? '' ) );
		$expires = strtotime( (string) ( $decoded['expires_at_utc'] ?? '' ) );
		$now     = time();
		if (
			'justice-ops-upress-recovery-proof-v2' !== (string) ( $decoded['contract'] ?? '' ) ||
			$expected_base_url !== untrailingslashit( (string) ( $decoded['target'] ?? '' ) ) ||
			90517 !== (int) ( $decoded['upress_pid'] ?? 0 ) ||
			'wp-content/plugins/justice-ops' !== (string) ( $decoded['plugin_path'] ?? '' ) ||
			'wp-content/upgrade/' . $filename !== (string) ( $decoded['marker_path'] ?? '' ) ||
			$expected_commit_sha !== (string) ( $decoded['commit_sha'] ?? '' ) ||
			$expected_artifact_sha256 !== (string) ( $decoded['artifact_sha256'] ?? '' ) ||
			$expected_prior_version !== (string) ( $decoded['prior_version'] ?? '' ) ||
			false === $issued || false === $expires || $issued > $now + 60 || $now - $issued > 15 * 60 || $expires <= $now || $expires - $issued > 15 * 60
		) {
			throw new RuntimeException( 'The uPress recovery marker is not bound to this exact site and release.', 409 );
		}
		$normalized_plugin = wp_normalize_path( WP_PLUGIN_DIR . '/' . $expected_plugin_slug );
		if ( substr( $normalized_plugin, -strlen( '/wp-content/plugins/justice-ops' ) ) !== '/wp-content/plugins/justice-ops' ) {
			throw new RuntimeException( 'The live plugin path differs from the recovery proof.', 409 );
		}
		if ( $consume ) {
			if ( ! @unlink( $marker ) ) {
				throw new RuntimeException( 'The single-use uPress recovery marker cannot be consumed.' );
			}
			clearstatcache( true, $marker );
			if ( file_exists( $marker ) || is_link( $marker ) ) {
				throw new RuntimeException( 'The consumed uPress recovery marker still exists.' );
			}
		}
		return array(
			'contract'        => 'justice-ops-upress-recovery-proof-v2',
			'marker_sha256'   => $expected_marker_sha256,
			'marker_filename' => $filename,
			'marker_bytes'    => $expected_marker_bytes,
			'marker_present'  => ! $consume,
			'single_use_deleted'=> $consume,
			'consumed'        => $consume,
			'upress_pid'      => 90517,
			'marker_path'     => 'wp-content/upgrade/' . $filename,
		);
	};

	$verify_request = static function ( WP_REST_Request $request ) use ( $expected_token, $expected_helper_id, $expected_helper_name, $expected_normalized_hash, $expected_base_url, $expected_commit_sha ): string {
		if ( ! hash_equals( $expected_token, (string) $request->get_param( 'token' ) ) ) {
			throw new RuntimeException( 'The one-time deployment token is invalid.', 403 );
		}
		if ( untrailingslashit( home_url( '/' ) ) !== $expected_base_url || 1 !== preg_match( '/^[0-9a-f]{40}$/', $expected_commit_sha ) ) {
			throw new RuntimeException( 'The target site or release fingerprint changed.', 409 );
		}
		if ( ! function_exists( 'Code_Snippets\\get_snippet' ) ) {
			throw new RuntimeException( 'The Code Snippets identity API is unavailable.' );
		}
		$self = \Code_Snippets\get_snippet( $expected_helper_id, false );
		if ( ! $self || (int) $self->id !== $expected_helper_id || (string) $self->name !== $expected_helper_name || ! (bool) $self->active || (string) $self->scope !== 'global' ) {
			throw new RuntimeException( 'The temporary helper identity changed.', 409 );
		}
		$self_code = (string) $self->code;
		$provided  = strtolower( (string) $request->get_param( 'helper_code_sha256' ) );
		if ( ! preg_match( '/^[0-9a-f]{64}$/', $provided ) || ! hash_equals( hash( 'sha256', $self_code ), $provided ) ) {
			throw new RuntimeException( 'The temporary helper code hash changed.', 409 );
		}
		$marker = '__JUSTICE_OPS_' . 'HELPER_NORMALIZED_SHA256__';
		$normalized = str_replace( $expected_normalized_hash, $marker, $self_code );
		if ( ! hash_equals( $expected_normalized_hash, hash( 'sha256', $normalized ) ) ) {
			throw new RuntimeException( 'The normalized helper self-hash changed.', 409 );
		}
		$operation_nonce = strtolower( (string) $request->get_param( 'operation_nonce' ) );
		if ( 1 !== preg_match( '/^[0-9a-f]{64}$/', $operation_nonce ) ) {
			throw new RuntimeException( 'The operation nonce is absent or invalid.', 403 );
		}
		return $operation_nonce;
	};

	$hard_delete_helper = static function () use ( $expected_helper_id ): array {
		$deleted = false;
		$absent  = false;
		if ( function_exists( 'Code_Snippets\\delete_snippet' ) ) {
			$deleted = (bool) \Code_Snippets\delete_snippet( $expected_helper_id, false );
		}
		if ( function_exists( 'Code_Snippets\\get_snippet' ) ) {
			$after  = \Code_Snippets\get_snippet( $expected_helper_id, false );
			$absent = ! $after || 0 === (int) $after->id;
		}
		return array( 'helper_deleted' => $deleted, 'helper_absent_after' => $absent );
	};

	$release_lock = static function ( array $state ) use ( $lock_option, $delete_raw_option_cas ): bool {
		if ( ! isset( $state['lock_value'] ) || ! is_string( $state['lock_value'] ) ) {
			throw new RuntimeException( 'The exact lock value is absent from deployment state.' );
		}
		return $delete_raw_option_cas( $lock_option, $state['lock_value'] );
	};

	$restore_prior = static function ( array $state ) use ( $inspect_directory, $copy_directory, $remove_directory, $restore_raw_options, $assert_options_snapshot, $expected_plugin, $expected_prior_version, $purge_caches ): array {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		$plugin_dir = WP_PLUGIN_DIR . '/' . dirname( $expected_plugin );
		$backup_dir = trailingslashit( (string) $state['backup_root'] ) . 'plugin';
		$restore_dir = trailingslashit( (string) $state['backup_root'] ) . 'restore';
		$quarantine  = trailingslashit( (string) $state['backup_root'] ) . 'candidate';
		$zip_path    = (string) ( $state['rollback_zip'] ?? '' );
		$transport   = 'sealed_zip';
		$zip_failure = false;
		$restored    = array();
		try {
			$expected_zip = trailingslashit( (string) $state['backup_root'] ) . 'live-rollback.zip';
			if ( $zip_path !== $expected_zip || is_link( $zip_path ) || ! is_file( $zip_path ) ) {
				throw new RuntimeException( 'The sealed rollback ZIP path changed.' );
			}
			$zip_hash     = hash_file( 'sha256', $zip_path );
			$zip_bytes    = filesize( $zip_path );
			if (
				! is_string( $zip_hash ) ||
				! hash_equals( (string) ( $state['rollback_zip_sha256'] ?? '' ), strtolower( $zip_hash ) ) ||
				(int) $zip_bytes !== (int) ( $state['rollback_zip_bytes'] ?? 0 )
			) {
				throw new RuntimeException( 'The sealed rollback ZIP identity changed.' );
			}
			$skin      = new WP_Ajax_Upgrader_Skin();
			$upgrader  = new Plugin_Upgrader( $skin );
			$installed = $upgrader->install( $zip_path, array( 'overwrite_package' => true ) );
			if ( is_wp_error( $installed ) || true !== $installed ) {
				throw new RuntimeException( 'Plugin_Upgrader did not confirm sealed rollback installation.' );
			}
			wp_clean_plugins_cache( true );
			clearstatcache( true, $plugin_dir );
			$restored = $inspect_directory( $plugin_dir, false );
			if ( $restored['files'] !== $state['prior_files'] || $restored['directory_sha256'] !== $state['prior_directory_sha256'] ) {
				throw new RuntimeException( 'The sealed ZIP restore failed exact readback.' );
			}
		} catch ( Throwable $zip_error ) {
			$zip_failure = true;
			$transport   = 'directory_fallback';
			if ( file_exists( $restore_dir ) || is_link( $restore_dir ) ) {
				$remove_directory( $restore_dir );
			}
			$restore_manifest = $copy_directory( $backup_dir, $restore_dir );
			if ( $restore_manifest['files'] !== $state['prior_files'] || $restore_manifest['directory_sha256'] !== $state['prior_directory_sha256'] ) {
				throw new RuntimeException( 'The exact prior restore tree differs from the snapshot.' );
			}
			if ( file_exists( $quarantine ) || is_link( $quarantine ) ) {
				$remove_directory( $quarantine );
			}
			$quarantined = false;
			if ( is_link( $plugin_dir ) ) {
				throw new RuntimeException( 'Refused to replace a symlinked candidate plugin directory.' );
			}
			if ( file_exists( $plugin_dir ) ) {
				if ( ! @rename( $plugin_dir, $quarantine ) ) {
					throw new RuntimeException( 'The candidate plugin directory cannot be quarantined.' );
				}
				$quarantined = true;
			}
			if ( ! @rename( $restore_dir, $plugin_dir ) ) {
				if ( $quarantined ) {
					@rename( $quarantine, $plugin_dir );
				}
				throw new RuntimeException( 'The exact prior plugin directory cannot be restored.' );
			}
			wp_clean_plugins_cache( true );
			clearstatcache( true, $plugin_dir );
			$restored = $inspect_directory( $plugin_dir, false );
			if ( $restored['files'] !== $state['prior_files'] || $restored['directory_sha256'] !== $state['prior_directory_sha256'] ) {
				throw new RuntimeException( 'The directory fallback failed exact readback.' );
			}
		}
		if ( ! is_plugin_active( $expected_plugin ) ) {
			$activated = activate_plugin( $expected_plugin, '', false, false );
			if ( is_wp_error( $activated ) ) {
				throw new RuntimeException( 'The restored prior plugin could not be activated.' );
			}
		}
		$restore_raw_options( (array) $state['option_snapshot'] );
		$assert_options_snapshot( (array) $state['option_snapshot'] );
		wp_clean_plugins_cache( true );
		$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
		$data = get_plugin_data( $plugin_file, false, false );
		if ( (string) ( $data['Version'] ?? '' ) !== $expected_prior_version || ! is_plugin_active( $expected_plugin ) ) {
			throw new RuntimeException( 'The restored prior plugin version or active state failed readback.' );
		}
		$remove_directory( $quarantine );
		return array(
			'prior_version'          => $expected_prior_version,
			'prior_active'           => true,
			'directory_sha256'       => $restored['directory_sha256'],
			'file_count'              => $restored['file_count'],
			'options_readback_match'  => true,
			'rollback_transport'      => $transport,
			'sealed_zip_restore_failed' => $zip_failure,
			'cache'                   => $purge_caches(),
		);
	};

	$inspect_candidate_post_state = static function () use ( $expected_plugin, $expected_version, $candidate_files, $inspect_directory, $scoped_option_names, $get_raw_option ): array {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
		$data = get_plugin_data( $plugin_file, false, false );
		if ( (string) ( $data['Version'] ?? '' ) !== $expected_version || ! defined( 'JUSTICE_OPS_VERSION' ) || JUSTICE_OPS_VERSION !== $expected_version || ! is_plugin_active( $expected_plugin ) ) {
			throw new RuntimeException( 'Fresh-request runtime identity differs from the candidate.' );
		}
		$manifest = $inspect_directory( dirname( $plugin_file ), false );
		ksort( $candidate_files, SORT_STRING );
		if ( $manifest['files'] !== $candidate_files ) {
			throw new RuntimeException( 'Fresh-request candidate files differ from protected main.' );
		}
		$post_options = array();
		foreach ( $scoped_option_names as $option_name ) {
			$post_options[ $option_name ] = $get_raw_option( $option_name );
		}
		$encoded = wp_json_encode( $post_options );
		if ( ! is_string( $encoded ) ) {
			throw new RuntimeException( 'The scoped post-option snapshot cannot be fingerprinted.' );
		}
		return array(
			'identity' => array(
				'version'          => $expected_version,
				'runtime_version'  => JUSTICE_OPS_VERSION,
				'active'           => true,
				'file_count'       => $manifest['file_count'],
				'directory_sha256' => $manifest['directory_sha256'],
			),
			'files'                    => $manifest['files'],
			'options'                  => $post_options,
			'option_fingerprint'       => hash( 'sha256', $encoded ),
		);
	};

	$inspect_deploy_lock = static function () use ( $lock_option, $get_raw_option, $raw_option_value, $stale_lock_seconds ): array {
		$record = $get_raw_option( $lock_option );
		$raw = $raw_option_value( $record );
		$api_value = get_option( $lock_option, null );
		$notoptions = wp_cache_get( 'notoptions', 'options' );
		$raw_autoload = is_string( $raw ) ? (string) ( $record['autoload'] ?? '' ) : '';
		$summary = array(
			'raw_present'             => is_string( $raw ),
			'raw_sha256'              => is_string( $raw ) ? hash( 'sha256', $raw ) : '',
			'raw_autoload'            => in_array( $raw_autoload, array( 'yes', 'no', 'on', 'off', 'auto', 'auto-on', 'auto-off' ), true ) ? $raw_autoload : '',
			'raw_autoload_sha256'     => '' === $raw_autoload ? '' : hash( 'sha256', $raw_autoload ),
			'api_present'             => is_string( $api_value ),
			'api_sha256'              => is_string( $api_value ) ? hash( 'sha256', $api_value ) : '',
			'raw_api_match'           => null === $raw ? null === $api_value : is_string( $api_value ) && hash_equals( $raw, $api_value ),
			'notoptions_contains_lock'=> is_array( $notoptions ) && isset( $notoptions[ $lock_option ] ),
			'recognized_contract'     => false,
			'paths_bounded'           => false,
			'recent'                  => false,
			'reclaimable'             => false,
			'state_present'           => false,
			'backup_present'          => false,
			'helper_present'          => false,
			'helper_inspection_available'=> function_exists( 'Code_Snippets\\get_snippet' ),
		);
		if ( ! is_string( $raw ) ) {
			return $summary;
		}

		$decoded = json_decode( $raw, true );
		if ( ! is_array( $decoded ) || 'justice-ops-deploy-lock-v2' !== (string) ( $decoded['contract'] ?? '' ) ) {
			return $summary;
		}
		$summary['recognized_contract'] = true;
		$foreign_run_id = (string) ( $decoded['run_id'] ?? '' );
		$summary['owner_run_sha256'] = hash( 'sha256', $foreign_run_id );
		$summary['helper_id'] = (int) ( $decoded['helper_id'] ?? 0 );
		$summary['acquired_epoch'] = (int) ( $decoded['acquired_epoch'] ?? 0 );
		$summary['lease_expires_epoch'] = (int) ( $decoded['lease_expires_epoch'] ?? 0 );
		$summary['expired_by_seconds'] = time() - (int) $summary['lease_expires_epoch'];
		$summary['recent'] = (int) $summary['lease_expires_epoch'] <= 0 || time() <= (int) $summary['lease_expires_epoch'] + $stale_lock_seconds;

		$foreign_state = (string) ( $decoded['state_option'] ?? '' );
		$foreign_backup = wp_normalize_path( (string) ( $decoded['backup_root'] ?? '' ) );
		$allowed_backup_prefix = wp_normalize_path( WP_CONTENT_DIR . '/.justice-ops-recovery-' );
		$state_bounded = 1 === preg_match( '/^justice_ops_deploy_state_[0-9a-f]{20}$/', $foreign_state );
		$backup_bounded = 1 === preg_match( '#^' . preg_quote( $allowed_backup_prefix, '#' ) . '[0-9a-f]{20}$#', $foreign_backup );
		$identity_bounded = 1 === preg_match( '/^justice-ops-install-[0-9]{8}T[0-9]{6}Z-[a-f0-9]{8}$/', $foreign_run_id ) && (int) $summary['helper_id'] > 0;
		$summary['identity_bounded'] = $identity_bounded;
		$summary['paths_bounded'] = $state_bounded && $backup_bounded && $identity_bounded;
		$summary['state_option_sha256'] = '' === $foreign_state ? '' : hash( 'sha256', $foreign_state );
		$summary['backup_root_sha256'] = '' === $foreign_backup ? '' : hash( 'sha256', $foreign_backup );

		if ( $state_bounded ) {
			$state_record = $get_raw_option( $foreign_state );
			$state_raw = $raw_option_value( $state_record );
			$summary['state_present'] = is_string( $state_raw );
			$summary['state_raw_sha256'] = is_string( $state_raw ) ? hash( 'sha256', $state_raw ) : '';
			$state = is_string( $state_raw ) ? maybe_unserialize( $state_raw ) : null;
			if ( is_array( $state ) ) {
				$operation = isset( $state['operation'] ) && is_array( $state['operation'] ) ? $state['operation'] : array();
				$last = isset( $state['last_operation'] ) && is_array( $state['last_operation'] ) ? $state['last_operation'] : array();
				$phase = (string) ( $state['phase'] ?? '' );
				$operation_name = (string) ( $operation['name'] ?? '' );
				$last_operation_name = (string) ( $last['name'] ?? '' );
				$summary['state_summary'] = array(
					'phase'                 => 1 === preg_match( '/^[a-z0-9_]{1,80}$/', $phase ) ? $phase : '',
					'phase_sha256'          => '' === $phase ? '' : hash( 'sha256', $phase ),
					'state_revision'        => (int) ( $state['state_revision'] ?? 0 ),
					'mutation_started'      => ! empty( $state['mutation_started'] ),
					'operation_active'      => ! empty( $operation['active'] ),
					'operation_name'        => 1 === preg_match( '/^[a-z0-9_]{1,80}$/', $operation_name ) ? $operation_name : '',
					'operation_name_sha256' => '' === $operation_name ? '' : hash( 'sha256', $operation_name ),
					'lease_expires_epoch'   => (int) ( $operation['lease_expires_epoch'] ?? 0 ),
					'last_operation_name'   => 1 === preg_match( '/^[a-z0-9_]{1,80}$/', $last_operation_name ) ? $last_operation_name : '',
					'last_operation_name_sha256'=> '' === $last_operation_name ? '' : hash( 'sha256', $last_operation_name ),
				);
			}
		}
		if ( $backup_bounded ) {
			$summary['backup_present'] = file_exists( $foreign_backup ) || is_link( $foreign_backup );
			$summary['backup_is_link'] = is_link( $foreign_backup );
		}

		$foreign_helper_id = (int) $summary['helper_id'];
		if ( $foreign_helper_id > 0 && ! empty( $summary['helper_inspection_available'] ) ) {
			$foreign_helper = \Code_Snippets\get_snippet( $foreign_helper_id, false );
			$summary['helper_present'] = (bool) $foreign_helper && (int) $foreign_helper->id === $foreign_helper_id;
			if ( $summary['helper_present'] ) {
				$summary['helper_active'] = (bool) $foreign_helper->active;
				$summary['helper_name_sha256'] = hash( 'sha256', (string) $foreign_helper->name );
				$summary['helper_code_sha256'] = hash( 'sha256', (string) $foreign_helper->code );
			}
		}

		$summary['reclaimable'] = $summary['recognized_contract'] && $summary['paths_bounded'] && ! empty( $summary['helper_inspection_available'] ) && ! $summary['recent'] && ! $summary['state_present'] && ! $summary['backup_present'] && ! $summary['helper_present'];
		return $summary;
	};

	$assert_lock_preflight = static function ( array $inspection ): void {
		if ( empty( $inspection['raw_present'] ) ) {
			return;
		}
		if ( empty( $inspection['recognized_contract'] ) ) {
			throw new RuntimeException( 'An unknown deployment lock exists and requires manual recovery.', 409 );
		}
		if ( ! empty( $inspection['recent'] ) ) {
			throw new RuntimeException( 'An active or recently expired deployment lock exists.', 409 );
		}
		if ( empty( $inspection['paths_bounded'] ) ) {
			throw new RuntimeException( 'The stale lock recovery paths are outside the bounded policy.', 409 );
		}
		if ( ! empty( $inspection['state_present'] ) || ! empty( $inspection['backup_present'] ) || ! empty( $inspection['helper_present'] ) ) {
			throw new RuntimeException( 'A stale lock still has recovery state, files or a helper; automatic reclaim is forbidden.', 409 );
		}
		if ( empty( $inspection['reclaimable'] ) ) {
			throw new RuntimeException( 'An unknown deployment lock exists and requires manual recovery.', 409 );
		}
	};

	$reclaim_stale_lock = static function () use ( $lock_option, $get_raw_option, $raw_option_value, $delete_raw_option_cas, $inspect_deploy_lock, $assert_lock_preflight ): array {
		$inspection = $inspect_deploy_lock();
		if ( empty( $inspection['raw_present'] ) ) {
			return array( 'present' => false, 'reclaimed' => false, 'inspection' => $inspection );
		}
		$assert_lock_preflight( $inspection );
		$raw = $raw_option_value( $get_raw_option( $lock_option ) );
		if ( ! is_string( $raw ) || ! hash_equals( (string) $inspection['raw_sha256'], hash( 'sha256', $raw ) ) ) {
			throw new RuntimeException( 'The deployment lock changed after preflight.', 409 );
		}
		$delete_raw_option_cas( $lock_option, $raw );
		return array(
			'present'              => true,
			'reclaimed'            => true,
			'prior_run_id_sha256'  => (string) ( $inspection['owner_run_sha256'] ?? '' ),
			'expired_by_seconds'   => (int) ( $inspection['expired_by_seconds'] ?? 0 ),
			'inspection'           => $inspection,
		);
	};

	$terminal_cleanup = static function ( array $state, string $expected_terminal, string $acceptance_sha256 ) use ( $inspect_directory, $remove_directory, $state_option, $release_lock, $hard_delete_helper, $cas_state, $delete_raw_option_cas ): array {
		$phase = (string) ( $state['phase'] ?? '' );
		if ( ! in_array( $expected_terminal, array( 'finalized', 'prior_restored' ), true ) || ( $phase !== $expected_terminal && ( 'cleanup_pending' !== $phase || (string) ( $state['cleanup_terminal'] ?? '' ) !== $expected_terminal ) ) ) {
			throw new RuntimeException( 'Recovery cleanup is allowed only after a verified terminal phase.', 409 );
		}
		if ( 1 !== preg_match( '/^[0-9a-f]{64}$/', $acceptance_sha256 ) ) {
			throw new RuntimeException( 'The independent acceptance digest is invalid.', 400 );
		}
		$backup_dir = trailingslashit( (string) $state['backup_root'] ) . 'plugin';
		$backup = $inspect_directory( $backup_dir, false );
		if ( $backup['files'] !== $state['prior_files'] || $backup['directory_sha256'] !== $state['prior_directory_sha256'] ) {
			throw new RuntimeException( 'Recovery material changed before terminal cleanup.' );
		}
		if ( 'cleanup_pending' !== $phase ) {
			$next = $state;
			$next['state_revision'] = 1 + (int) ( $state['state_revision'] ?? 0 );
			$next['phase'] = 'cleanup_pending';
			$next['cleanup_terminal'] = $expected_terminal;
			$next['acceptance_sha256'] = $acceptance_sha256;
			$next['cleanup_started_at_utc'] = gmdate( 'c' );
			$state = $cas_state( $state, $next );
		} elseif ( ! hash_equals( (string) ( $state['acceptance_sha256'] ?? '' ), $acceptance_sha256 ) ) {
			throw new RuntimeException( 'The cleanup acceptance digest changed during an idempotent retry.', 409 );
		}

		// The global lock remains held throughout every destructive cleanup step.
		// If helper, state or backup retirement fails, the lock stays in place and
		// prevents another deployment from entering the incomplete cleanup.
		$helper = $hard_delete_helper();
		if ( empty( $helper['helper_deleted'] ) || empty( $helper['helper_absent_after'] ) ) {
			throw new RuntimeException( 'The temporary helper could not be retired; recovery was preserved.' );
		}
		$state_deleted = $delete_raw_option_cas( $state_option, maybe_serialize( $state ) );
		if ( ! $state_deleted ) {
			throw new RuntimeException( 'The deployment state could not be retired; recovery was preserved.' );
		}
		$backup_removed = $remove_directory( (string) $state['backup_root'] );
		clearstatcache( true, (string) $state['backup_root'] );
		if ( ! $backup_removed || file_exists( (string) $state['backup_root'] ) || is_link( (string) $state['backup_root'] ) ) {
			throw new RuntimeException( 'The acknowledged recovery directory could not be removed.' );
		}
		$lock_released = $release_lock( $state );
		if ( ! $lock_released ) {
			throw new RuntimeException( 'The final global deployment lock release failed closed.' );
		}
		return array_merge(
			array(
				'cleanup_phase'            => 'complete',
				'cleanup_terminal'         => $expected_terminal,
				'acceptance_sha256'        => $acceptance_sha256,
				'backup_verified_before'   => true,
				'backup_removed'           => true,
				'state_deleted'            => true,
				'state_absent_after'       => true,
				'lock_released'            => $lock_released,
				'lock_absent_after'        => true,
			),
			$helper
		);
	};

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/preflight',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $classify_failure, $inspect_recovery_marker, $inspect_deploy_lock, $assert_lock_preflight, $assert_disk_capacity, &$disk_probe_cleanup_safe, $expected_prior_version, $expected_plugin, $expected_plugin_slug, $expected_backup_root, $state_option, $get_raw_option, $inspect_directory ): WP_REST_Response {
				$request_verified = false;
				$state_present = false;
				$backup_root_present = false;
				$failure_stage = 'request_verification';
				$marker_inspection = array();
				$lock_inspection = array();
				$prior_identity = array();
				$disk = array();
				try {
					$operation_nonce = $verify_request( $request );
					$request_verified = true;
					$failure_stage = 'run_state_inspection';
					$state_record = $get_raw_option( $state_option );
					$state_present = ! empty( $state_record['exists'] );
					if ( $state_present ) {
						throw new RuntimeException( 'This Justice Ops deployment state already exists.', 409 );
					}
					$failure_stage = 'backup_root_inspection';
					$backup_root_present = file_exists( $expected_backup_root ) || is_link( $expected_backup_root );
					if ( $backup_root_present ) {
						throw new RuntimeException( 'The bounded server recovery root already exists.', 409 );
					}

					$failure_stage = 'marker_inspection';
					$marker_inspection = $inspect_recovery_marker( false );
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
					$plugin_dir = WP_PLUGIN_DIR . '/' . $expected_plugin_slug;
					$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
					$failure_stage = 'prior_identity_inspection';
					if ( ! is_plugin_active( $expected_plugin ) || ! is_file( $plugin_file ) ) {
						throw new RuntimeException( 'The expected prior Justice Ops plugin is not active.', 409 );
					}
					$data = get_plugin_data( $plugin_file, false, false );
					if ( (string) ( $data['Version'] ?? '' ) !== $expected_prior_version ) {
						throw new RuntimeException( 'The live Justice Ops version differs from the prior pin.', 409 );
					}
					$prior = $inspect_directory( $plugin_dir, false );
					$prior_identity = array(
						'version'          => $expected_prior_version,
						'active'           => true,
						'file_count'       => (int) $prior['file_count'],
						'expanded_bytes'   => (int) $prior['expanded_bytes'],
						'directory_sha256' => (string) $prior['directory_sha256'],
					);
					$failure_stage = 'lock_preflight';
					$lock_inspection = $inspect_deploy_lock();
					$assert_lock_preflight( $lock_inspection );
					$failure_stage = 'disk_preflight';
					$disk = $assert_disk_capacity( 'preflight', (int) $prior['expanded_bytes'] );

					return new WP_REST_Response(
						array(
							'success'                    => true,
							'operation'                  => 'preflight',
							'ready'                      => true,
							'state'                      => 'preflight_ready',
							'marker_inspection'          => $marker_inspection,
							'lock_inspection'            => $lock_inspection,
							'prior_identity'             => $prior_identity,
							'disk_capacity'              => $disk,
							'candidate_mutation_started' => false,
							'state_persisted'            => false,
							'state_absent_after'         => true,
							'own_lock_acquired'          => false,
							'own_lock_absent_after'      => true,
							'backup_root_created'        => false,
							'backup_root_absent_after'   => true,
							'marker_consumed'            => false,
							'disk_probe_cleanup_safe'     => $disk_probe_cleanup_safe,
							'safe_to_retire_helper'      => true,
							'foreign_lock_present'       => ! empty( $lock_inspection['raw_present'] ),
							'operation_nonce_sha256'     => hash( 'sha256', $operation_nonce ),
						),
						200
					);
				} catch ( Throwable $error ) {
					$status = (int) $error->getCode();
					$safe = $request_verified && ! $state_present && ! $backup_root_present && $disk_probe_cleanup_safe;
					return $error_response(
						'justice_ops_preflight_failed',
						$error->getMessage(),
						$status >= 400 && $status <= 599 ? $status : 500,
						array(
							'failure_reason'             => $classify_failure( $error, $failure_stage ),
							'failure_stage'              => $failure_stage,
							'ready'                      => false,
							'marker_inspection'          => $marker_inspection,
							'lock_inspection'            => $lock_inspection,
							'prior_identity'             => $prior_identity,
							'disk_capacity'              => $disk,
							'candidate_mutation_started' => false,
							'state_persisted'            => $state_present,
							'state_absent_after'         => ! $state_present,
							'own_lock_acquired'          => false,
							'own_lock_absent_after'      => true,
							'backup_root_created'        => false,
							'backup_root_absent_after'   => ! $backup_root_present,
							'marker_consumed'            => false,
							'disk_probe_cleanup_safe'     => $disk_probe_cleanup_safe,
							'safe_to_retire_helper'      => $safe,
							'foreign_lock_present'       => ! empty( $lock_inspection['raw_present'] ),
						)
					);
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/prepare',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $classify_failure, $inspect_recovery_marker, $inspect_deploy_lock, $reclaim_stale_lock, $acquire_raw_option_once, $assert_disk_capacity, &$disk_probe_cleanup_safe, $persist_new_state, $delete_raw_option_cas, $assert_lock, $expected_run_id, $expected_helper_id, $expected_helper_name, $expected_token_sha256, $expected_commit_sha, $expected_prior_version, $expected_plugin, $expected_plugin_slug, $expected_backup_root, $lock_option, $state_option, $scoped_option_names, $inspect_directory, $copy_directory, $remove_directory, $get_raw_option, $raw_option_value, $database_preconditions, $operation_lease_seconds ): WP_REST_Response {
				$backup_root         = $expected_backup_root;
				$lock_value          = '';
				$operation_nonce     = '';
				$failure_stage       = 'request_verification';
				$request_verified     = false;
				$lock_acquired       = false;
				$marker_consumed      = false;
				$backup_root_created = false;
				$state_persisted      = false;
				$state                = array();
				$marker_inspection    = array();
				$lock_inspection      = array();
				$lock_acquisition     = array();
				$prior_identity       = array();
				$disk                 = array();
				$stale_lock           = array();
				$recovery_proof       = array();
				try {
					$operation_nonce = $verify_request( $request );
					$request_verified = true;
					$failure_stage = 'run_state_inspection';
					$state_record = $get_raw_option( $state_option );
					if ( ! empty( $state_record['exists'] ) ) {
						throw new RuntimeException( 'This Justice Ops deployment state already exists.', 409 );
					}

					$failure_stage = 'marker_revalidation';
					$marker_inspection = $inspect_recovery_marker( false );
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
					$plugin_dir = WP_PLUGIN_DIR . '/' . $expected_plugin_slug;
					$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
					$failure_stage = 'prior_identity_inspection';
					if ( ! is_plugin_active( $expected_plugin ) || ! is_file( $plugin_file ) ) {
						throw new RuntimeException( 'The expected prior Justice Ops plugin is not active.', 409 );
					}
					$data = get_plugin_data( $plugin_file, false, false );
					if ( (string) ( $data['Version'] ?? '' ) !== $expected_prior_version ) {
						throw new RuntimeException( 'The live Justice Ops version differs from the prior pin.', 409 );
					}
					$prior = $inspect_directory( $plugin_dir, false );
					$prior_identity = array(
						'version'          => $expected_prior_version,
						'active'           => true,
						'file_count'       => (int) $prior['file_count'],
						'expanded_bytes'   => (int) $prior['expanded_bytes'],
						'directory_sha256' => (string) $prior['directory_sha256'],
					);
					$failure_stage = 'lock_preflight_and_reclaim';
					$lock_inspection = $inspect_deploy_lock();
					$stale_lock = $reclaim_stale_lock();
					$now = time();
					$lock_value = wp_json_encode(
						array(
							'contract'       => 'justice-ops-deploy-lock-v2',
							'run_id'         => $expected_run_id,
							'helper_id'      => $expected_helper_id,
							'helper_name'    => $expected_helper_name,
							'commit_sha'     => $expected_commit_sha,
							'token_sha256'   => $expected_token_sha256,
							'state_option'   => $state_option,
							'backup_root'    => $expected_backup_root,
							'acquired_at_utc'=> gmdate( 'c', $now ),
							'acquired_epoch' => $now,
							'lease_expires_epoch' => $now + $operation_lease_seconds,
						)
					);
					if ( ! is_string( $lock_value ) ) {
						throw new RuntimeException( 'The exclusive Justice Ops deployment lock cannot be encoded.' );
					}
					$failure_stage = 'exclusive_lock_acquisition';
					$lock_acquisition = $acquire_raw_option_once( $lock_option, $lock_value );
					$lock_acquired = ! empty( $lock_acquisition['inserted'] );
					if ( ! $lock_acquired ) {
						throw new RuntimeException( 'The exclusive Justice Ops deployment lock cannot be acquired.', 409 );
					}
					if ( empty( $lock_acquisition['verified'] ) ) {
						throw new RuntimeException( 'The exclusive Justice Ops deployment lock failed exact readback.', 409 );
					}
					$failure_stage = 'disk_preflight';
					$disk = $assert_disk_capacity( 'prepare', (int) $prior['expanded_bytes'] );

					$failure_stage = 'marker_consumption';
					$recovery_proof = $inspect_recovery_marker( true );
					$marker_consumed = true;
					$failure_stage = 'backup_root_creation';
					if ( file_exists( $backup_root ) || is_link( $backup_root ) || ! wp_mkdir_p( $backup_root ) ) {
						throw new RuntimeException( 'The bounded server recovery root cannot be created.' );
					}
					$backup_root_created = true;
					$failure_stage = 'backup_snapshot';
					$backup = $copy_directory( $plugin_dir, trailingslashit( $backup_root ) . 'plugin' );
					if ( $backup['files'] !== $prior['files'] || $backup['directory_sha256'] !== $prior['directory_sha256'] ) {
						throw new RuntimeException( 'The fresh server recovery copy differs from live.' );
					}
					$option_snapshot = array();
					foreach ( $scoped_option_names as $option_name ) {
						$option_snapshot[ $option_name ] = $get_raw_option( $option_name );
					}
					$failure_stage = 'database_preconditions';
					$db = $database_preconditions();
					$failure_stage = 'immediate_prior_revalidation';
					$immediate_prior = $inspect_directory( $plugin_dir, false );
					$data = get_plugin_data( $plugin_file, false, false );
					if ( ! is_plugin_active( $expected_plugin ) || (string) ( $data['Version'] ?? '' ) !== $expected_prior_version || $immediate_prior['files'] !== $prior['files'] || $immediate_prior['directory_sha256'] !== $prior['directory_sha256'] ) {
						throw new RuntimeException( 'The live plugin changed during snapshot preparation.', 409 );
					}
					$state = array(
						'schema_version'          => 2,
						'state_revision'          => 1,
						'run_id'                  => $expected_run_id,
						'helper_id'               => $expected_helper_id,
						'token_sha256'            => $expected_token_sha256,
						'commit_sha'              => $expected_commit_sha,
						'phase'                   => 'prepared',
						'mutation_started'        => false,
						'lock_value'              => $lock_value,
						'backup_root'             => $backup_root,
						'prior_version'           => $expected_prior_version,
						'prior_active'            => true,
						'prior_files'             => $prior['files'],
						'prior_directory_sha256'  => $prior['directory_sha256'],
						'prior_file_count'        => $prior['file_count'],
						'option_snapshot'         => $option_snapshot,
						'database_preconditions'  => $db,
						'prior_expanded_bytes'    => (int) $prior['expanded_bytes'],
						'recovery_proof'          => $recovery_proof,
						'disk_capacity'           => $disk,
						'operation'               => array( 'active' => false ),
						'last_operation'          => array(
							'name'             => 'prepare',
							'nonce_sha256'     => hash( 'sha256', $operation_nonce ),
							'completed_at_utc' => gmdate( 'c' ),
						),
						'prepared_at_utc'         => gmdate( 'c' ),
					);
					$failure_stage = 'state_persistence';
					$persist_new_state( $state_option, $state );
					$state_persisted = true;
					$failure_stage = 'prepared_state_verification';
					$assert_lock( $state );
					return new WP_REST_Response(
						array(
							'success'                => true,
							'operation'              => 'prepare',
							'state'                  => 'prepared',
							'prior_version'          => $expected_prior_version,
							'prior_active'           => true,
							'file_count'             => $prior['file_count'],
							'directory_sha256'       => $prior['directory_sha256'],
							'expanded_bytes'         => $prior['expanded_bytes'],
							'files'                  => $prior['rows'],
							'lock_acquired'          => true,
							'own_lock_acquired'      => true,
							'own_lock_absent_after'  => false,
							'lock_acquisition'       => $lock_acquisition,
							'disk_capacity'          => $disk,
							'recovery_proof'         => $recovery_proof,
							'marker_inspection'      => $marker_inspection,
							'marker_consumed'        => true,
							'disk_probe_cleanup_safe' => $disk_probe_cleanup_safe,
							'stale_lock_policy'      => $stale_lock,
							'operation_nonce_sha256' => hash( 'sha256', $operation_nonce ),
							'database_preconditions' => $db,
							'candidate_mutation_started' => false,
							'state_persisted'        => true,
							'state_absent_after'     => false,
							'backup_root_created'    => true,
							'backup_root_absent_after'=> false,
							'safe_to_retire_helper'  => false,
							'foreign_lock_present'   => false,
						),
						200
					);
				} catch ( Throwable $error ) {
					$cleanup_errors = array();
					$cleanup_can_continue = $disk_probe_cleanup_safe;
					if ( ! $disk_probe_cleanup_safe ) {
						$cleanup_errors[] = array(
							'stage'          => 'disk_probe_cleanup',
							'message_sha256' => hash( 'sha256', 'The bounded disk capacity probe cannot be removed.' ),
						);
					}
					try {
						$current_state_raw = $raw_option_value( $get_raw_option( $state_option ) );
						$expected_state_raw = ! empty( $state ) ? maybe_serialize( $state ) : null;
						if ( is_string( $expected_state_raw ) && is_string( $current_state_raw ) && hash_equals( $expected_state_raw, $current_state_raw ) ) {
							$state_persisted = true;
							$current_lock_raw = $raw_option_value( $get_raw_option( $lock_option ) );
							if ( ! $lock_acquired || ! is_string( $current_lock_raw ) || ! hash_equals( $lock_value, $current_lock_raw ) ) {
								throw new RuntimeException( 'Owned state cleanup requires the exact owned deployment lock.' );
							}
							$delete_raw_option_cas( $state_option, $expected_state_raw );
						} elseif ( is_string( $current_state_raw ) ) {
							throw new RuntimeException( 'A non-owned deployment state blocks automatic cleanup.' );
						}
					} catch ( Throwable $cleanup_error ) {
						$cleanup_can_continue = false;
						$cleanup_errors[] = array(
							'stage'          => 'state_cleanup',
							'message_sha256' => hash( 'sha256', $cleanup_error->getMessage() ),
						);
					}

					if ( $cleanup_can_continue && $backup_root_created && ( file_exists( $backup_root ) || is_link( $backup_root ) ) ) {
						try {
							if ( ! $remove_directory( $backup_root ) ) {
								throw new RuntimeException( 'The owned recovery directory cleanup returned false.' );
							}
							clearstatcache( true, $backup_root );
							if ( file_exists( $backup_root ) || is_link( $backup_root ) ) {
								throw new RuntimeException( 'The owned recovery directory remains after cleanup.' );
							}
						} catch ( Throwable $cleanup_error ) {
							$cleanup_can_continue = false;
							$cleanup_errors[] = array(
								'stage'          => 'backup_cleanup',
								'message_sha256' => hash( 'sha256', $cleanup_error->getMessage() ),
							);
						}
					}

					if ( $cleanup_can_continue && $lock_acquired ) {
						try {
							$delete_raw_option_cas( $lock_option, $lock_value );
						} catch ( Throwable $cleanup_error ) {
							$cleanup_errors[] = array(
								'stage'          => 'lock_cleanup',
								'message_sha256' => hash( 'sha256', $cleanup_error->getMessage() ),
							);
						}
					}

					$state_absent_after = false;
					$own_lock_absent_after = false;
					$backup_root_absent_after = ! file_exists( $backup_root ) && ! is_link( $backup_root );
					$foreign_lock_present = false;
					$lock_inspection_after = array( 'inspection_complete' => false );
					try {
						$state_after_raw = $raw_option_value( $get_raw_option( $state_option ) );
						$lock_after_raw = $raw_option_value( $get_raw_option( $lock_option ) );
						$state_absent_after = ! is_string( $state_after_raw );
						$own_lock_absent_after = '' === $lock_value || ! is_string( $lock_after_raw ) || ! hash_equals( $lock_value, $lock_after_raw );
						$foreign_lock_present = is_string( $lock_after_raw ) && ( '' === $lock_value || ! hash_equals( $lock_value, $lock_after_raw ) );
						$lock_inspection_after = $inspect_deploy_lock();
						$lock_inspection_after['inspection_complete'] = true;
						if ( ! empty( $lock_inspection_after['raw_present'] ) ) {
							$observed_lock_sha256 = (string) ( $lock_inspection_after['raw_sha256'] ?? '' );
							$own_lock_sha256 = '' === $lock_value ? '' : hash( 'sha256', $lock_value );
							$foreign_lock_present = '' === $own_lock_sha256 || ! hash_equals( $own_lock_sha256, $observed_lock_sha256 );
							$own_lock_absent_after = '' === $own_lock_sha256 || $foreign_lock_present;
						}
					} catch ( Throwable $inspection_error ) {
						$cleanup_errors[] = array(
							'stage'          => 'cleanup_readback',
							'message_sha256' => hash( 'sha256', $inspection_error->getMessage() ),
						);
					}
					$safe_to_retire_helper = $request_verified && $disk_probe_cleanup_safe && $state_absent_after && $own_lock_absent_after && $backup_root_absent_after && ! empty( $lock_inspection_after['inspection_complete'] );
					$status = (int) $error->getCode();
					return $error_response(
						'justice_ops_prepare_failed',
						$error->getMessage(),
						$status >= 400 && $status <= 599 ? $status : 500,
						array(
							'failure_reason'             => $classify_failure( $error, $failure_stage ),
							'failure_stage'              => $failure_stage,
							'candidate_mutation_started' => false,
							'state_persisted'            => $state_persisted,
							'state_absent_after'         => $state_absent_after,
							'own_lock_acquired'          => $lock_acquired,
							'own_lock_absent_after'      => $own_lock_absent_after,
							'backup_root_created'        => $backup_root_created,
							'backup_root_absent_after'   => $backup_root_absent_after,
							'marker_consumed'            => $marker_consumed,
							'disk_probe_cleanup_safe'     => $disk_probe_cleanup_safe,
							'safe_to_retire_helper'      => $safe_to_retire_helper,
							'foreign_lock_present'       => $foreign_lock_present,
							'marker_inspection'          => $marker_inspection,
							'lock_inspection'            => $lock_inspection,
							'lock_inspection_after'      => $lock_inspection_after,
							'lock_acquisition'           => $lock_acquisition,
							'prior_identity'             => $prior_identity,
							'disk_capacity'              => $disk,
							'cleanup_errors'             => $cleanup_errors,
						)
					);
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/export',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock ): WP_REST_Response {
				try {
					$verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					if ( 'prepared' !== (string) $state['phase'] || ! empty( $state['mutation_started'] ) ) {
						throw new RuntimeException( 'Live files can be exported only from a fresh prepared snapshot.', 409 );
					}
					$paths = $request->get_param( 'paths' );
					if ( ! is_array( $paths ) || count( $paths ) < 1 || count( $paths ) > 8 ) {
						throw new RuntimeException( 'The bounded live export requires one to eight paths.', 400 );
					}
					$paths = array_values( array_unique( array_map( 'strval', $paths ) ) );
					if ( count( $paths ) < 1 || count( $paths ) > 8 ) {
						throw new RuntimeException( 'The bounded live export path set changed.', 400 );
					}
					$rows = array();
					foreach ( $paths as $relative ) {
						if ( '' === $relative || false !== strpos( $relative, '..' ) || false !== strpos( $relative, '\\' ) || ! isset( $state['prior_files'][ $relative ] ) ) {
							throw new RuntimeException( 'A requested live export path is outside the snapshot.', 400 );
						}
						$file = trailingslashit( (string) $state['backup_root'] ) . 'plugin/' . $relative;
						if ( ! is_file( $file ) || is_link( $file ) ) {
							throw new RuntimeException( 'A requested server-backup file is unavailable.' );
						}
						$body = file_get_contents( $file );
						if ( ! is_string( $body ) ) {
							throw new RuntimeException( 'A requested server-backup file cannot be read.' );
						}
						$identity = $state['prior_files'][ $relative ];
						if ( strlen( $body ) !== (int) $identity['bytes'] || ! hash_equals( (string) $identity['sha256'], hash( 'sha256', $body ) ) ) {
							throw new RuntimeException( 'A server-backup file changed after preparation.' );
						}
						$rows[] = array(
							'path'        => $relative,
							'bytes'       => strlen( $body ),
							'sha256'      => hash( 'sha256', $body ),
							'data_base64' => base64_encode( $body ),
						);
					}
					return new WP_REST_Response(
						array(
							'success'   => true,
							'operation' => 'export',
							'state'     => 'prepared',
							'files'     => $rows,
						),
						200
					);
				} catch ( Throwable $error ) {
					$status = (int) $error->getCode();
					return $error_response( 'justice_ops_export_failed', $error->getMessage(), $status >= 400 && $status <= 599 ? $status : 500 );
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/seal',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $begin_operation, $heartbeat_operation, $complete_operation, $abort_nonmutating_operation, $cas_state, $assert_disk_capacity, $expected_plugin_slug, $inspect_directory, $remove_directory ): WP_REST_Response {
				$state = array();
				$operation_nonce = '';
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$last = isset( $state['last_operation'] ) && is_array( $state['last_operation'] ) ? $state['last_operation'] : array();
					if ( 'sealed' === (string) $state['phase'] && 'seal' === (string) ( $last['name'] ?? '' ) && hash_equals( (string) ( $last['nonce_sha256'] ?? '' ), hash( 'sha256', $operation_nonce ) ) ) {
						return new WP_REST_Response(
							array(
								'success' => true,
								'operation' => 'seal',
								'state' => 'sealed',
								'idempotent_replay' => true,
								'rollback_zip_sha256' => (string) $state['rollback_zip_sha256'],
								'rollback_zip_bytes' => (int) $state['rollback_zip_bytes'],
							),
							200
						);
					}
					if ( 'prepared' !== (string) $state['phase'] || ! empty( $state['mutation_started'] ) ) {
						throw new RuntimeException( 'Only a fresh prepared snapshot can be sealed.', 409 );
					}
					$state = $begin_operation( $state, $operation_nonce, 'seal', array( 'prepared' ) );
					$encoded       = (string) $request->get_param( 'rollback_zip_base64' );
					$expected_hash = strtolower( (string) $request->get_param( 'rollback_zip_sha256' ) );
					$expected_size = (int) $request->get_param( 'rollback_zip_bytes' );
					if ( ! preg_match( '/^[0-9a-f]{64}$/', $expected_hash ) || $expected_size <= 0 || $expected_size > 25 * 1024 * 1024 || strlen( $encoded ) > 36 * 1024 * 1024 ) {
						throw new RuntimeException( 'The bounded rollback ZIP identity is invalid.', 400 );
					}
					$bytes = base64_decode( $encoded, true );
					if ( ! is_string( $bytes ) || strlen( $bytes ) !== $expected_size || ! hash_equals( $expected_hash, hash( 'sha256', $bytes ) ) ) {
						throw new RuntimeException( 'The uploaded rollback ZIP differs from the local seal.', 400 );
					}
					$disk = $assert_disk_capacity( 'seal', (int) $state['prior_expanded_bytes'], $expected_size );
					$zip_path   = trailingslashit( (string) $state['backup_root'] ) . 'live-rollback.zip';
					$verify_dir = trailingslashit( (string) $state['backup_root'] ) . 'zip-verify';
					if ( file_exists( $zip_path ) || file_exists( $verify_dir ) || is_link( $zip_path ) || is_link( $verify_dir ) ) {
						throw new RuntimeException( 'The bounded rollback seal target already exists.', 409 );
					}
					$written = file_put_contents( $zip_path, $bytes, LOCK_EX );
					if ( ! is_int( $written ) || $written !== strlen( $bytes ) ) {
						throw new RuntimeException( 'The bounded rollback ZIP cannot be persisted.' );
					}
					require_once ABSPATH . 'wp-admin/includes/file.php';
					WP_Filesystem();
					$unzipped = unzip_file( $zip_path, $verify_dir );
					if ( is_wp_error( $unzipped ) || true !== $unzipped ) {
						throw new RuntimeException( 'The bounded rollback ZIP cannot be independently extracted.' );
					}
					$verified = $inspect_directory( trailingslashit( $verify_dir ) . $expected_plugin_slug, false );
					if ( $verified['files'] !== $state['prior_files'] || $verified['directory_sha256'] !== $state['prior_directory_sha256'] ) {
						throw new RuntimeException( 'The rollback ZIP contents differ from the fresh live snapshot.' );
					}
					$remove_directory( $verify_dir );
					$state = $heartbeat_operation( $state, $operation_nonce, 'seal' );
					$next = $state;
					$next['state_revision']          = 1 + (int) $state['state_revision'];
					$next['rollback_zip']           = $zip_path;
					$next['rollback_zip_sha256']    = $expected_hash;
					$next['rollback_zip_bytes']     = $expected_size;
					$next['rollback_zip_sealed_at'] = gmdate( 'c' );
					$next['seal_disk_capacity']     = $disk;
					$state = $cas_state( $state, $next );
					$state = $complete_operation( $state, $operation_nonce, 'seal', 'sealed', array( 'rollback_zip_sha256' => $expected_hash ) );
					return new WP_REST_Response(
						array(
							'success'                 => true,
							'operation'               => 'seal',
							'state'                   => 'sealed',
							'rollback_zip_sha256'     => $expected_hash,
							'rollback_zip_bytes'      => $expected_size,
							'rollback_directory_sha256'=> $verified['directory_sha256'],
							'disk_capacity'           => $disk,
							'operation_nonce_sha256'  => hash( 'sha256', $operation_nonce ),
						),
						200
					);
				} catch ( Throwable $error ) {
					if ( ! empty( $state ) && '' !== $operation_nonce ) {
						try { $abort_nonmutating_operation( $state, $operation_nonce, 'seal', $error->getMessage() ); } catch ( Throwable $ignored ) {}
					}
					$status = (int) $error->getCode();
					return $error_response( 'justice_ops_seal_failed', $error->getMessage(), $status >= 400 && $status <= 599 ? $status : 500 );
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/install',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $begin_operation, $heartbeat_operation, $complete_operation, $cas_state, $assert_disk_capacity, $assert_options_snapshot, $expected_artifact_url, $expected_artifact_sha256, $expected_artifact_bytes, $expected_plugin, $expected_version, $expected_prior_version, $candidate_files, $inspect_directory, $restore_prior, $purge_caches ): WP_REST_Response {
				$temp_file        = '';
				$state            = array();
				$mutation_started = false;
				$operation_nonce  = '';
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$last = isset( $state['last_operation'] ) && is_array( $state['last_operation'] ) ? $state['last_operation'] : array();
					if ( 'installed_pending_stabilization' === (string) $state['phase'] && 'install' === (string) ( $last['name'] ?? '' ) && hash_equals( (string) ( $last['nonce_sha256'] ?? '' ), hash( 'sha256', $operation_nonce ) ) ) {
						return new WP_REST_Response(
							array(
								'success' => true,
								'operation' => 'install',
								'state' => 'installed_pending_stabilization',
								'idempotent_replay' => true,
								'version' => $expected_version,
								'active' => true,
								'file_count' => (int) ( $state['candidate_file_count'] ?? 0 ),
								'directory_sha256' => (string) ( $state['candidate_digest'] ?? '' ),
							),
							200
						);
					}
					if ( 'sealed' !== (string) $state['phase'] || ! empty( $state['mutation_started'] ) ) {
						throw new RuntimeException( 'The deployment state does not contain a verified rollback ZIP.', 409 );
					}
					require_once ABSPATH . 'wp-admin/includes/file.php';
					require_once ABSPATH . 'wp-admin/includes/misc.php';
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
					require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
					$download_url = $expected_artifact_url . '?nlcb=' . rawurlencode( wp_generate_uuid4() . '-' . microtime( true ) );
					$temp_file = download_url( $download_url, 180 );
					if ( is_wp_error( $temp_file ) || ! is_string( $temp_file ) || ! is_file( $temp_file ) ) {
						throw new RuntimeException( 'The immutable candidate cannot be downloaded.' );
					}
					$observed_hash  = hash_file( 'sha256', $temp_file );
					$observed_bytes = filesize( $temp_file );
					if ( ! is_string( $observed_hash ) || ! hash_equals( $expected_artifact_sha256, strtolower( $observed_hash ) ) || (int) $observed_bytes !== $expected_artifact_bytes ) {
						throw new RuntimeException( 'The downloaded candidate differs from protected main.' );
					}

					// Last exact live reinspection before the atomic sealed-to-installing CAS.
					$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
					$prior_data = get_plugin_data( $plugin_file, false, false );
					$immediate_live = $inspect_directory( dirname( $plugin_file ), false );
					if ( ! is_plugin_active( $expected_plugin ) || (string) ( $prior_data['Version'] ?? '' ) !== $expected_prior_version || $immediate_live['files'] !== $state['prior_files'] || $immediate_live['directory_sha256'] !== $state['prior_directory_sha256'] ) {
						throw new RuntimeException( 'Live version, active state or digest changed immediately before mutation.', 409 );
					}
					$assert_options_snapshot( (array) $state['option_snapshot'] );
					$disk = $assert_disk_capacity( 'install', (int) $state['prior_expanded_bytes'], (int) $state['rollback_zip_bytes'] );
					$state = $begin_operation( $state, $operation_nonce, 'install', array( 'sealed' ), 'installing', true );
					$next = $state;
					$next['state_revision'] = 1 + (int) $state['state_revision'];
					$next['install_started_at_utc'] = gmdate( 'c' );
					$next['install_disk_capacity'] = $disk;
					$next['immediate_prior_reinspection'] = array(
						'version' => $expected_prior_version,
						'active' => true,
						'directory_sha256' => $immediate_live['directory_sha256'],
						'options_match' => true,
					);
					$state = $cas_state( $state, $next );
					$assert_lock( $state );
					$mutation_started = true;
					$state = $heartbeat_operation( $state, $operation_nonce, 'install' );
					$skin = new WP_Ajax_Upgrader_Skin();
					$upgrader = new Plugin_Upgrader( $skin );
					$installed = $upgrader->install( $temp_file, array( 'overwrite_package' => true ) );
					if ( is_wp_error( $installed ) || true !== $installed ) {
						throw new RuntimeException( 'Plugin_Upgrader did not confirm exact overwrite installation.' );
					}
					if ( ! is_plugin_active( $expected_plugin ) ) {
						$activated = activate_plugin( $expected_plugin, '', false, false );
						if ( is_wp_error( $activated ) ) {
							throw new RuntimeException( 'The candidate plugin could not be activated.' );
						}
					}
					wp_clean_plugins_cache( true );
					$state = $heartbeat_operation( $state, $operation_nonce, 'install' );
					$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
					$data = get_plugin_data( $plugin_file, false, false );
					if ( (string) ( $data['Version'] ?? '' ) !== $expected_version ) {
						throw new RuntimeException( 'Installed plugin header version differs from the candidate.' );
					}
					$installed_manifest = $inspect_directory( dirname( $plugin_file ), false );
					ksort( $candidate_files, SORT_STRING );
					if ( $installed_manifest['files'] !== $candidate_files ) {
						throw new RuntimeException( 'Installed plugin directory differs from every reviewed candidate byte.' );
					}
					$cache = $purge_caches();
					if ( is_file( $temp_file ) && ! @unlink( $temp_file ) ) {
						throw new RuntimeException( 'The owned candidate temporary file cannot be removed.' );
					}
					$temp_file = '';
					$next = $state;
					$next['state_revision']       = 1 + (int) $state['state_revision'];
					$next['candidate_files']      = $candidate_files;
					$next['candidate_digest']     = $installed_manifest['directory_sha256'];
					$next['candidate_file_count'] = $installed_manifest['file_count'];
					$next['installed_at_utc']     = gmdate( 'c' );
					$next['install_cache']        = $cache;
					$state = $cas_state( $state, $next );
					$state = $complete_operation( $state, $operation_nonce, 'install', 'installed_pending_stabilization', array( 'directory_sha256' => $installed_manifest['directory_sha256'] ) );
					return new WP_REST_Response(
						array(
							'success'             => true,
							'operation'           => 'install',
							'state'               => 'installed_pending_stabilization',
							'version'             => $expected_version,
							'active'              => true,
							'file_count'          => $installed_manifest['file_count'],
							'directory_sha256'    => $installed_manifest['directory_sha256'],
							'cache'               => $cache,
							'rollback_attempted'  => false,
							'rollback_succeeded'  => false,
							'operation_nonce_sha256'=> hash( 'sha256', $operation_nonce ),
							'recovery_held'       => true,
						),
						200
					);
				} catch ( Throwable $error ) {
					$rollback_attempted = false;
					$rollback_succeeded = false;
					$rollback = array();
					if ( $mutation_started && ! empty( $state ) ) {
						$rollback_attempted = true;
						try {
							$rollback = $restore_prior( $state );
							$state = $heartbeat_operation( $state, $operation_nonce, 'install' );
							$next = $state;
							$next['state_revision'] = 1 + (int) $state['state_revision'];
							$next['rollback_result'] = $rollback;
							$next['rollback_at_utc'] = gmdate( 'c' );
							$state = $cas_state( $state, $next );
							$state = $complete_operation( $state, $operation_nonce, 'install', 'prior_restored', array( 'automatic_rollback' => true ) );
							$rollback_succeeded = true;
						} catch ( Throwable $rollback_error ) {
							$rollback['error'] = $rollback_error->getMessage();
						}
					}
					if ( is_string( $temp_file ) && '' !== $temp_file && is_file( $temp_file ) ) {
						@unlink( $temp_file );
					}
					return $error_response(
						'justice_ops_install_failed',
						$error->getMessage(),
						500,
						array(
							'rollback_attempted' => $rollback_attempted,
							'rollback_succeeded' => $rollback_succeeded,
							'rollback'           => $rollback,
							'state'              => $rollback_succeeded ? 'prior_restored' : ( $mutation_started ? 'installing' : (string) ( $state['phase'] ?? 'sealed' ) ),
							'recovery_held'      => ! empty( $state ),
							'operation_nonce_sha256'=> '' === $operation_nonce ? '' : hash( 'sha256', $operation_nonce ),
						)
					);
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/rollback',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $begin_operation, $complete_operation, $abort_nonmutating_operation, $cas_state, $restore_prior ): WP_REST_Response {
				$state = array();
				$operation_nonce = '';
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$phase = (string) $state['phase'];
					if ( 'installing' === $phase ) {
						throw new RuntimeException( 'An installing state is ambiguous; automatic concurrent rollback is forbidden.', 409 );
					}
					if ( 'prior_restored' === $phase ) {
						return new WP_REST_Response(
							array(
								'success' => true,
								'operation' => 'rollback',
								'state' => 'prior_restored',
								'idempotent_replay' => true,
								'rollback_attempted' => true,
								'rollback_succeeded' => true,
								'rollback' => (array) ( $state['rollback_result'] ?? array() ),
								'recovery_held' => true,
							),
							200
						);
					}
					$state = $begin_operation( $state, $operation_nonce, 'rollback', array( 'prepared', 'sealed', 'installed_pending_stabilization', 'stabilized_pending_confirmation', 'finalized' ) );
					$rollback_attempted = false;
					$rollback = array();
					if ( in_array( $phase, array( 'installed_pending_stabilization', 'stabilized_pending_confirmation', 'finalized' ), true ) || ! empty( $state['mutation_started'] ) ) {
						$rollback_attempted = true;
						$rollback = $restore_prior( $state );
					}
					$next = $state;
					$next['state_revision'] = 1 + (int) $state['state_revision'];
					$next['rollback_result'] = $rollback;
					$next['rollback_at_utc'] = gmdate( 'c' );
					$state = $cas_state( $state, $next );
					$state = $complete_operation( $state, $operation_nonce, 'rollback', 'prior_restored', array( 'rollback_attempted' => $rollback_attempted ) );
					return new WP_REST_Response(
						array(
								'success'             => true,
								'operation'           => 'rollback',
								'state'               => 'prior_restored',
								'rollback_attempted'  => $rollback_attempted,
								'rollback_succeeded'  => true,
								'rollback'            => $rollback,
								'recovery_held'       => true,
								'operation_nonce_sha256'=> hash( 'sha256', $operation_nonce ),
							),
						200
					);
				} catch ( Throwable $error ) {
					if ( ! empty( $state ) && '' !== $operation_nonce && empty( $state['mutation_started'] ) ) {
						try { $abort_nonmutating_operation( $state, $operation_nonce, 'rollback', $error->getMessage() ); } catch ( Throwable $ignored ) {}
					}
					return $error_response( 'justice_ops_rollback_failed', $error->getMessage(), 500, array( 'rollback_attempted' => true, 'rollback_succeeded' => false ) );
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/finalize',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $begin_operation, $complete_operation, $abort_nonmutating_operation, $cas_state, $inspect_candidate_post_state, $expected_version, $database_preconditions, $purge_caches ): WP_REST_Response {
				$state = array();
				$operation_nonce = '';
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$last = isset( $state['last_operation'] ) && is_array( $state['last_operation'] ) ? $state['last_operation'] : array();
					if ( 'stabilized_pending_confirmation' === (string) $state['phase'] && 'finalize' === (string) ( $last['name'] ?? '' ) && hash_equals( (string) ( $last['nonce_sha256'] ?? '' ), hash( 'sha256', $operation_nonce ) ) ) {
						return new WP_REST_Response( array( 'success' => true, 'operation' => 'finalize', 'state' => 'stabilized_pending_confirmation', 'idempotent_replay' => true, 'version' => $expected_version, 'active' => true, 'directory_sha256' => (string) $state['candidate_digest'], 'file_count' => (int) $state['candidate_file_count'], 'cache' => (array) ( $state['finalize_cache'] ?? array() ), 'post_option_fingerprint' => (string) ( $state['post_option_fingerprint'] ?? '' ), 'recovery_held' => true ), 200 );
					}
					if ( 'installed_pending_stabilization' !== (string) $state['phase'] ) {
						throw new RuntimeException( 'Only an installed candidate can be stabilized.', 409 );
					}
					$state = $begin_operation( $state, $operation_nonce, 'finalize', array( 'installed_pending_stabilization' ) );
					$observed = $inspect_candidate_post_state();
					$identity = (array) $observed['identity'];
					$db = $database_preconditions();
					$prior_db = isset( $state['database_preconditions'] ) && is_array( $state['database_preconditions'] ) ? $state['database_preconditions'] : array();
					if ( (string) ( $db['card_events_table'] ?? '' ) !== (string) ( $prior_db['card_events_table'] ?? '' ) || (int) ( $db['card_events_rows'] ?? -1 ) < (int) ( $prior_db['card_events_rows'] ?? 0 ) ) {
						throw new RuntimeException( 'The non-migrating card-events table lost identity or rows.' );
					}
					if ( (string) get_option( 'justice_enc_rewrite_flushed', '' ) !== $expected_version ) {
						throw new RuntimeException( 'The bounded fresh-request rewrite migration did not stabilize.' );
					}
					$cache = $purge_caches();
					$next = $state;
					$next['state_revision'] = 1 + (int) $state['state_revision'];
					$next['post_candidate_identity'] = $identity;
					$next['post_option_snapshot'] = (array) $observed['options'];
					$next['post_option_fingerprint'] = (string) $observed['option_fingerprint'];
					$next['finalize_cache'] = $cache;
					$next['database_postconditions'] = $db;
					$next['stabilized_at_utc'] = gmdate( 'c' );
					$state = $cas_state( $state, $next );
					$state = $complete_operation( $state, $operation_nonce, 'finalize', 'stabilized_pending_confirmation', array( 'directory_sha256' => $identity['directory_sha256'] ) );
					return new WP_REST_Response(
						array(
								'success'             => true,
								'operation'           => 'finalize',
								'state'               => 'stabilized_pending_confirmation',
								'version'             => $expected_version,
								'active'              => true,
								'file_count'          => $identity['file_count'],
								'directory_sha256'    => $identity['directory_sha256'],
								'database_preconditions'=> $db,
								'cache'               => $cache,
								'post_option_fingerprint'=> $state['post_option_fingerprint'],
								'operation_nonce_sha256'=> hash( 'sha256', $operation_nonce ),
								'recovery_held'       => true,
							),
						200
					);
				} catch ( Throwable $error ) {
					if ( ! empty( $state ) && '' !== $operation_nonce ) {
						try { $abort_nonmutating_operation( $state, $operation_nonce, 'finalize', $error->getMessage() ); } catch ( Throwable $ignored ) {}
					}
					return $error_response( 'justice_ops_finalize_failed', $error->getMessage(), 500 );
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/confirm-finalized',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $begin_operation, $complete_operation, $abort_nonmutating_operation, $cas_state, $inspect_candidate_post_state, $expected_version ): WP_REST_Response {
				$state = array();
				$operation_nonce = '';
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$last = isset( $state['last_operation'] ) && is_array( $state['last_operation'] ) ? $state['last_operation'] : array();
					if ( 'finalized' === (string) $state['phase'] && 'confirm_finalized' === (string) ( $last['name'] ?? '' ) && hash_equals( (string) ( $last['nonce_sha256'] ?? '' ), hash( 'sha256', $operation_nonce ) ) ) {
						return new WP_REST_Response( array( 'success' => true, 'operation' => 'confirm_finalized', 'state' => 'finalized', 'idempotent_replay' => true, 'version' => $expected_version, 'active' => true, 'directory_sha256' => (string) $state['candidate_digest'], 'file_count' => (int) $state['candidate_file_count'], 'post_option_fingerprint' => (string) $state['post_option_fingerprint'], 'stabilization_match' => true, 'recovery_held' => true ), 200 );
					}
					if ( 'stabilized_pending_confirmation' !== (string) $state['phase'] ) {
						throw new RuntimeException( 'Only independently matched stabilization can be confirmed.', 409 );
					}
					$state = $begin_operation( $state, $operation_nonce, 'confirm_finalized', array( 'stabilized_pending_confirmation' ) );
					$post = $inspect_candidate_post_state();
					if (
						! isset( $state['post_candidate_identity'], $state['post_option_snapshot'], $state['post_option_fingerprint'] ) ||
						! is_array( $state['post_candidate_identity'] ) ||
						! is_array( $state['post_option_snapshot'] ) ||
						$state['post_candidate_identity'] !== $post['identity'] ||
						$state['post_option_snapshot'] !== $post['options'] ||
						! hash_equals( (string) $state['post_option_fingerprint'], (string) $post['option_fingerprint'] )
					) {
						throw new RuntimeException( 'The independent post-stabilization readback differs from durable state.', 409 );
					}
					$next = $state;
					$next['state_revision'] = 1 + (int) $state['state_revision'];
					$next['confirmation_identity'] = (array) $post['identity'];
					$next['confirmation_option_fingerprint'] = (string) $post['option_fingerprint'];
					$next['confirmed_at_utc'] = gmdate( 'c' );
					$state = $cas_state( $state, $next );
					$state = $complete_operation( $state, $operation_nonce, 'confirm_finalized', 'finalized', array( 'post_option_fingerprint' => (string) $post['option_fingerprint'] ) );
					$identity = (array) $post['identity'];
					return new WP_REST_Response(
						array(
							'success'                     => true,
							'operation'                   => 'confirm_finalized',
							'state'                       => 'finalized',
							'version'                     => $identity['version'],
							'active'                      => $identity['active'],
							'file_count'                  => $identity['file_count'],
							'directory_sha256'            => $identity['directory_sha256'],
							'post_option_fingerprint'     => (string) $post['option_fingerprint'],
							'stabilization_match'         => true,
							'operation_nonce_sha256'      => hash( 'sha256', $operation_nonce ),
							'recovery_held'               => true,
						),
						200
					);
				} catch ( Throwable $error ) {
					if ( ! empty( $state ) && '' !== $operation_nonce ) {
						try { $abort_nonmutating_operation( $state, $operation_nonce, 'confirm_finalized', $error->getMessage() ); } catch ( Throwable $ignored ) {}
					}
					$status = (int) $error->getCode();
					return $error_response( 'justice_ops_confirm_finalized_failed', $error->getMessage(), $status >= 400 && $status <= 599 ? $status : 500 );
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/cleanup',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $begin_operation, $terminal_cleanup ): WP_REST_Response {
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$terminal = (string) $request->get_param( 'terminal' );
					$acceptance_sha256 = strtolower( (string) $request->get_param( 'acceptance_sha256' ) );
					if ( 'cleanup_pending' !== (string) $state['phase'] ) {
						$state = $begin_operation( $state, $operation_nonce, 'cleanup', array( 'finalized', 'prior_restored' ) );
					}
					$cleanup = $terminal_cleanup( $state, $terminal, $acceptance_sha256 );
					return new WP_REST_Response(
						array_merge(
							array(
								'success'   => true,
								'operation' => 'cleanup',
								'state'     => 'cleanup_complete',
								'operation_nonce_sha256' => hash( 'sha256', $operation_nonce ),
							),
							$cleanup
						),
						200
					);
				} catch ( Throwable $error ) {
					$status = (int) $error->getCode();
					return $error_response( 'justice_ops_cleanup_failed', $error->getMessage(), $status >= 400 && $status <= 599 ? $status : 500, array( 'recovery_preserved_unless_absence_acknowledged' => true ) );
				}
			},
		)
	);

	register_rest_route(
		'justice-ops-deploy/v1',
		$expected_route_base . '/status',
		array(
			'methods'             => 'POST',
			'permission_callback' => $permission,
			'callback'            => static function ( WP_REST_Request $request ) use ( $verify_request, $error_response, $load_state, $assert_lock, $inspect_directory, $assert_options_snapshot, $inspect_candidate_post_state, $expected_plugin ): WP_REST_Response {
				try {
					$operation_nonce = $verify_request( $request );
					$state = $load_state();
					$assert_lock( $state );
					$current = array( 'inspection_safe' => false );
					if ( 'installing' !== (string) $state['phase'] ) {
						require_once ABSPATH . 'wp-admin/includes/plugin.php';
						$plugin_file = WP_PLUGIN_DIR . '/' . $expected_plugin;
						$data = get_plugin_data( $plugin_file, false, false );
						$manifest = $inspect_directory( dirname( $plugin_file ), false );
						$current = array(
							'inspection_safe'  => true,
							'version'          => (string) ( $data['Version'] ?? '' ),
							'active'           => is_plugin_active( $expected_plugin ),
							'file_count'       => $manifest['file_count'],
							'directory_sha256' => $manifest['directory_sha256'],
						);
					}
					$options_match = false;
					if ( in_array( (string) $state['phase'], array( 'prepared', 'sealed', 'prior_restored' ), true ) ) {
						$assert_options_snapshot( (array) $state['option_snapshot'] );
						$options_match = true;
					}
					$stabilization_match = false;
					$current_post_option_fingerprint = '';
					$post_options_match = false;
					if ( in_array( (string) $state['phase'], array( 'stabilized_pending_confirmation', 'finalized' ), true ) ) {
						$post = $inspect_candidate_post_state();
						$current = (array) $post['identity'];
						$current_post_option_fingerprint = (string) $post['option_fingerprint'];
						$post_options_match = isset( $state['post_option_snapshot'] ) && is_array( $state['post_option_snapshot'] ) && $state['post_option_snapshot'] === $post['options'];
						$stabilization_match =
							isset( $state['post_candidate_identity'] ) &&
							is_array( $state['post_candidate_identity'] ) &&
							$state['post_candidate_identity'] === $post['identity'] &&
							$post_options_match &&
							hash_equals( (string) ( $state['post_option_fingerprint'] ?? '' ), $current_post_option_fingerprint );
					}
					return new WP_REST_Response(
						array(
							'success'       => true,
							'operation'     => 'status',
							'state'         => (string) $state['phase'],
							'lock_acquired' => true,
							'state_revision'=> (int) ( $state['state_revision'] ?? 0 ),
							'mutation_started'=> ! empty( $state['mutation_started'] ),
							'operation_lease'=> (array) ( $state['operation'] ?? array() ),
							'last_operation'=> (array) ( $state['last_operation'] ?? array() ),
							'current_identity'=> $current,
							'prior_directory_sha256'=> (string) ( $state['prior_directory_sha256'] ?? '' ),
							'candidate_directory_sha256'=> (string) ( $state['candidate_digest'] ?? '' ),
							'options_snapshot_match'=> $options_match,
							'rollback'      => (array) ( $state['rollback_result'] ?? array() ),
							'install_cache' => (array) ( $state['install_cache'] ?? array() ),
							'finalize_cache'=> (array) ( $state['finalize_cache'] ?? array() ),
							'stabilization_match'=> $stabilization_match,
							'post_options_match'=> $post_options_match,
							'current_post_option_fingerprint'=> $current_post_option_fingerprint,
							'stored_post_option_fingerprint'=> (string) ( $state['post_option_fingerprint'] ?? '' ),
							'recovery_held'=> true,
							'status_nonce_sha256'=> hash( 'sha256', $operation_nonce ),
						),
						200
					);
				} catch ( Throwable $error ) {
					return $error_response( 'justice_ops_status_failed', $error->getMessage(), 500 );
				}
			},
		)
	);
} );
