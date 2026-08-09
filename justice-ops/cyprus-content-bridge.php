<?php
/**
 * Exact-CAS content release bridge for eight existing Cyprus articles.
 *
 * This route can update only post_content, post_title and two approved Yoast fields.
 * Record type, status, slug and public path are immutable boundaries. Every
 * write carries exact current and target digests, holds one global lock, stores
 * a durable prior-state snapshot before mutation, verifies exact readback, and
 * retains rollback evidence until explicit acceptance or rollback.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Exact article slug to public-path allowlist.
 *
 * @return array<string,string>
 */
function justice_ops_cyprus_bridge_allowlist(): array {
	return array(
		'about-cyprus'                                            => '/about-cyprus/',
		'avoiding-mistakes-when-buying-property-in-cyprus'       => '/avoiding-mistakes-when-buying-property-in-cyprus/',
		'buy-real-estate-cyprus'                                  => '/buy-real-estate-cyprus/',
		'cyprus-corporate-tax'                                    => '/cyprus-corporate-tax/',
		'cyprus-lawyer'                                           => '/cyprus-lawyer/',
		'cyprus-prices'                                           => '/cyprus-prices/',
		'real-estate-market-greece-cyprus'                        => '/real-estate-market-greece-cyprus/',
		'real-estate-market-review-cyprus-guide-israelis-2025'   => '/real-estate-market-review-cyprus-guide-israelis-2025/',
	);
}

function justice_ops_cyprus_bridge_lock_name(): string {
	return 'justice_ops_cyprus_content_write_lock';
}

function justice_ops_cyprus_bridge_rollback_name(): string {
	return 'justice_ops_cyprus_content_rollback_evidence';
}

/**
 * One non-autoloaded terminal receipt per evidence token. Receipts are never
 * reused as mutable state and make lost-response retries deterministic.
 */
function justice_ops_cyprus_bridge_receipt_name( string $token ): string {
	return 'justice_ops_cyprus_content_receipt_' . hash( 'sha256', strtolower( $token ) );
}

/**
 * True only when an array carries the exact reviewed key set.
 *
 * @param array<mixed>      $value Value under review.
 * @param array<int,string> $keys  Required keys.
 */
function justice_ops_cyprus_bridge_exact_keys( array $value, array $keys ): bool {
	$actual = array_keys( $value );
	sort( $actual );
	sort( $keys );

	return $actual === $keys;
}

/**
 * Normalize a public path for exact allowlist comparison.
 */
function justice_ops_cyprus_bridge_normalize_path( string $url_or_path ): string {
	$path = wp_parse_url( $url_or_path, PHP_URL_PATH );
	$path = is_string( $path ) ? $path : '';

	return '/' . trim( $path, '/' ) . '/';
}

/**
 * Stable JSON SHA-256 helper.
 *
 * @param mixed $value JSON-compatible value.
 */
function justice_ops_cyprus_bridge_hash( $value ): string {
	$json = wp_json_encode( $value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );

	return is_string( $json ) ? hash( 'sha256', $json ) : '';
}

/**
 * Build one exact metadata field state, preserving absent versus empty.
 *
 * @param array<int,mixed> $rows Raw metadata rows.
 * @return array<string,mixed>
 */
function justice_ops_cyprus_bridge_build_meta_state( array $rows ): array {
	$rows  = array_values( $rows );
	$value = isset( $rows[0] ) ? (string) $rows[0] : '';

	return array(
		'value'     => $value,
		'exists'    => 0 < count( $rows ),
		'row_count' => count( $rows ),
		'sha256'    => hash( 'sha256', $value ),
	);
}

/**
 * Build the exact controlled state for one record.
 *
 * @param array<int,mixed> $title_rows       Raw Yoast title rows.
 * @param array<int,mixed> $description_rows Raw Yoast description rows.
 * @return array<string,mixed>
 */
function justice_ops_cyprus_bridge_build_state( string $content, string $post_title, array $title_rows, array $description_rows ): array {
	$state = array(
		'content'           => $content,
		'content_sha256'    => hash( 'sha256', $content ),
		'post_title'        => $post_title,
		'post_title_sha256' => hash( 'sha256', $post_title ),
		'yoast_title'       => justice_ops_cyprus_bridge_build_meta_state( $title_rows ),
		'yoast_description' => justice_ops_cyprus_bridge_build_meta_state( $description_rows ),
	);
	$state['state_sha256'] = justice_ops_cyprus_bridge_hash( $state );

	return $state;
}

/**
 * Exact keys in a complete controlled state.
 *
 * @return string[]
 */
function justice_ops_cyprus_bridge_state_keys(): array {
	return array( 'content', 'content_sha256', 'post_title', 'post_title_sha256', 'yoast_title', 'yoast_description', 'state_sha256' );
}

/**
 * Validate a complete controlled state and its self hashes.
 */
function justice_ops_cyprus_bridge_state_is_supported( array $state ): bool {
	if ( ! justice_ops_cyprus_bridge_exact_keys( $state, justice_ops_cyprus_bridge_state_keys() ) ) {
		return false;
	}
	if (
		! is_string( $state['content'] )
		|| ! is_string( $state['content_sha256'] )
		|| ! is_string( $state['post_title'] )
		|| ! is_string( $state['post_title_sha256'] )
		|| ! is_string( $state['state_sha256'] )
	) {
		return false;
	}
	foreach ( array( 'yoast_title', 'yoast_description' ) as $field ) {
		$meta = $state[ $field ];
		if (
			! is_array( $meta )
			|| ! justice_ops_cyprus_bridge_exact_keys( $meta, array( 'value', 'exists', 'row_count', 'sha256' ) )
			|| ! is_string( $meta['value'] )
			|| ! is_bool( $meta['exists'] )
			|| ! is_int( $meta['row_count'] )
			|| ! in_array( $meta['row_count'], array( 0, 1 ), true )
			|| $meta['exists'] !== ( 1 === $meta['row_count'] )
			|| ( ! $meta['exists'] && '' !== $meta['value'] )
			|| ! is_string( $meta['sha256'] )
			|| 1 !== preg_match( '/^[a-f0-9]{64}$/D', $meta['sha256'] )
			|| ! hash_equals( hash( 'sha256', $meta['value'] ), $meta['sha256'] )
		) {
			return false;
		}
	}
	if (
		1 !== preg_match( '/^[a-f0-9]{64}$/D', $state['content_sha256'] )
		|| 1 !== preg_match( '/^[a-f0-9]{64}$/D', $state['post_title_sha256'] )
		|| 1 !== preg_match( '/^[a-f0-9]{64}$/D', $state['state_sha256'] )
		|| ! hash_equals( hash( 'sha256', $state['content'] ), $state['content_sha256'] )
		|| ! hash_equals( hash( 'sha256', $state['post_title'] ), $state['post_title_sha256'] )
	) {
		return false;
	}
	$copy = $state;
	unset( $copy['state_sha256'] );

	return hash_equals( justice_ops_cyprus_bridge_hash( $copy ), $state['state_sha256'] );
}

/**
 * Build the one-row target state from request values.
 */
function justice_ops_cyprus_bridge_build_target_state( string $content, string $post_title, string $title, string $description ): array {
	return justice_ops_cyprus_bridge_build_state( $content, $post_title, array( $title ), array( $description ) );
}

/**
 * Read raw metadata bytes directly from the database, bypassing object cache.
 * An unavailable or malformed read returns two sentinel rows so the state is
 * rejected by the existing cardinality guard rather than trusted.
 *
 * @return array<int,string>
 */
function justice_ops_cyprus_bridge_read_raw_meta_values( int $post_id, string $meta_key ): array {
	global $wpdb;

	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->postmeta )
		|| ! is_string( $wpdb->postmeta )
		|| '' === $wpdb->postmeta
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'get_results' )
	) {
		return array( '__invalid_db_read_1__', '__invalid_db_read_2__' );
	}
	$query = $wpdb->prepare(
		"SELECT meta_value
		 FROM {$wpdb->postmeta}
		 WHERE post_id = %d AND BINARY meta_key = BINARY %s
		 ORDER BY meta_id ASC
		 LIMIT 2",
		$post_id,
		$meta_key
	);
	$rows  = $wpdb->get_results( $query, ARRAY_A );
	if ( ! is_array( $rows ) ) {
		return array( '__invalid_db_read_1__', '__invalid_db_read_2__' );
	}
	$values = array();
	foreach ( $rows as $row ) {
		if ( ! is_array( $row ) || ! array_key_exists( 'meta_value', $row ) || ! is_string( $row['meta_value'] ) ) {
			return array( '__invalid_db_read_1__', '__invalid_db_read_2__' );
		}
		$values[] = $row['meta_value'];
	}

	return $values;
}

/**
 * Read the controlled state directly from database rows, never object cache.
 *
 * @return array<string,mixed>
 */
function justice_ops_cyprus_bridge_read_state( WP_Post $post ): array {
	global $wpdb;

	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->posts )
		|| ! is_string( $wpdb->posts )
		|| '' === $wpdb->posts
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'get_results' )
	) {
		return array();
	}
	$query = $wpdb->prepare(
		"SELECT post_content, post_title, post_modified_gmt, post_name, post_type, post_status
		 FROM {$wpdb->posts}
		 WHERE ID = %d
		 LIMIT 2",
		$post->ID
	);
	$rows  = $wpdb->get_results( $query, ARRAY_A );
	if ( ! is_array( $rows ) || 1 !== count( $rows ) || ! is_array( $rows[0] ) ) {
		return array();
	}
	$row = $rows[0];
	if (
		! isset( $row['post_content'], $row['post_title'], $row['post_modified_gmt'], $row['post_name'], $row['post_type'], $row['post_status'] )
		|| ! is_string( $row['post_content'] )
		|| ! is_string( $row['post_title'] )
		|| ! is_string( $row['post_modified_gmt'] )
		|| ! is_string( $row['post_name'] )
		|| ! is_string( $row['post_type'] )
		|| ! is_string( $row['post_status'] )
		|| $post->post_name !== $row['post_name']
		|| 'articles' !== $row['post_type']
		|| 'publish' !== $row['post_status']
	) {
		return array();
	}
	$post->post_content      = $row['post_content'];
	$post->post_title        = $row['post_title'];
	$post->post_modified_gmt = $row['post_modified_gmt'];
	$title_rows              = justice_ops_cyprus_bridge_read_raw_meta_values( $post->ID, '_yoast_wpseo_title' );
	$description_rows        = justice_ops_cyprus_bridge_read_raw_meta_values( $post->ID, '_yoast_wpseo_metadesc' );

	return justice_ops_cyprus_bridge_build_state(
		$row['post_content'],
		$row['post_title'],
		$title_rows,
		$description_rows
	);
}

/**
 * Resolve and verify one immutable allowlisted article identity.
 *
 * @return WP_Post|WP_Error
 */
function justice_ops_cyprus_bridge_resolve_record( string $slug ) {
	global $wpdb;

	$allowlist = justice_ops_cyprus_bridge_allowlist();
	if ( ! isset( $allowlist[ $slug ] ) ) {
		return new WP_Error( 'cyprus_content_slug_not_allowed', 'The requested slug is outside the Cyprus release allowlist.', array( 'status' => 400 ) );
	}

	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->posts )
		|| ! is_string( $wpdb->posts )
		|| '' === $wpdb->posts
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'get_results' )
	) {
		return new WP_Error( 'cyprus_content_fresh_read_unavailable', 'A fresh database-backed article read is unavailable.', array( 'status' => 500 ) );
	}
	$query = $wpdb->prepare(
		"SELECT *
		 FROM {$wpdb->posts}
		 WHERE BINARY post_name = BINARY %s AND BINARY post_type = BINARY %s
		 ORDER BY ID ASC
		 LIMIT 2",
		$slug,
		'articles'
	);
	$rows  = $wpdb->get_results( $query, OBJECT );
	if ( ! is_array( $rows ) || 1 !== count( $rows ) || ! is_object( $rows[0] ) ) {
		return new WP_Error( 'cyprus_content_record_missing', 'An allowlisted Cyprus article is missing or ambiguous.', array( 'status' => 409, 'slug' => $slug ) );
	}
	$post = $rows[0] instanceof WP_Post ? $rows[0] : new WP_Post( $rows[0] );
	if ( ! ( $post instanceof WP_Post ) ) {
		return new WP_Error( 'cyprus_content_record_missing', 'An allowlisted Cyprus article is missing.', array( 'status' => 409, 'slug' => $slug ) );
	}
	if (
		'articles' !== $post->post_type
		|| 'publish' !== $post->post_status
		|| $slug !== $post->post_name
		|| justice_ops_cyprus_bridge_normalize_path( (string) get_permalink( $post ) ) !== $allowlist[ $slug ]
	) {
		return new WP_Error( 'cyprus_content_identity_mismatch', 'An allowlisted Cyprus article changed type, status, slug or public path.', array( 'status' => 409, 'slug' => $slug ) );
	}
	if ( ! current_user_can( 'edit_post', $post->ID ) ) {
		return new WP_Error( 'cyprus_content_record_forbidden', 'The authenticated user cannot edit an allowlisted record.', array( 'status' => 403, 'slug' => $slug ) );
	}

	return $post;
}

/**
 * Compact identity and state response for a resolved record.
 *
 * @return array<string,mixed>
 */
function justice_ops_cyprus_bridge_record_snapshot( WP_Post $post, bool $include_content = true, ?array $known_state = null ): array {
	$allowlist = justice_ops_cyprus_bridge_allowlist();
	$state     = null === $known_state ? justice_ops_cyprus_bridge_read_state( $post ) : $known_state;
	$snapshot  = array(
		'post_id'      => (int) $post->ID,
		'slug'         => (string) $post->post_name,
		'path'         => $allowlist[ $post->post_name ],
		'post_type'    => (string) $post->post_type,
		'post_status'  => (string) $post->post_status,
		'modified_gmt' => (string) $post->post_modified_gmt,
		'state'        => $state,
	);
	if ( ! $include_content ) {
		unset( $snapshot['state']['content'] );
	}

	return $snapshot;
}

/**
 * Stable digest of controlled record states, sorted by slug.
 *
 * @param array<string,array<string,mixed>> $snapshots Snapshot map.
 */
function justice_ops_cyprus_bridge_batch_state_hash( array $snapshots ): string {
	$summary = array();
	ksort( $snapshots, SORT_STRING );
	foreach ( $snapshots as $slug => $snapshot ) {
		$summary[ $slug ] = array(
			'post_id'      => (int) $snapshot['post_id'],
			'path'         => (string) $snapshot['path'],
			'state_sha256' => (string) $snapshot['state']['state_sha256'],
		);
	}

	return justice_ops_cyprus_bridge_hash( $summary );
}

/**
 * Stable digest including post revision times for drift detection.
 *
 * @param array<string,array<string,mixed>> $snapshots Snapshot map.
 */
function justice_ops_cyprus_bridge_batch_revision_hash( array $snapshots ): string {
	$summary = array();
	ksort( $snapshots, SORT_STRING );
	foreach ( $snapshots as $slug => $snapshot ) {
		$summary[ $slug ] = array(
			'post_id'      => (int) $snapshot['post_id'],
			'modified_gmt' => (string) $snapshot['modified_gmt'],
			'state_sha256' => (string) $snapshot['state']['state_sha256'],
		);
	}

	return justice_ops_cyprus_bridge_hash( $summary );
}

/**
 * Read one requested set of records and calculate both batch digests.
 *
 * @param string[] $slugs Slugs to read.
 * @return array<string,mixed>|WP_Error
 */
function justice_ops_cyprus_bridge_read_batch( array $slugs, bool $include_content = true ) {
	$snapshots = array();
	foreach ( $slugs as $slug ) {
		$post = justice_ops_cyprus_bridge_resolve_record( (string) $slug );
		if ( is_wp_error( $post ) ) {
			return $post;
		}
		$state = justice_ops_cyprus_bridge_read_state( $post );
		if ( ! justice_ops_cyprus_bridge_state_is_supported( $state ) ) {
			return new WP_Error( 'cyprus_content_state_unsupported', 'Controlled metadata must contain zero or one row per approved key.', array( 'status' => 409, 'slug' => $slug ) );
		}
		$snapshots[ $slug ] = justice_ops_cyprus_bridge_record_snapshot( $post, $include_content, $state );
	}

	return array(
		'records'               => $snapshots,
		'batch_state_sha256'    => justice_ops_cyprus_bridge_batch_state_hash( $snapshots ),
		'batch_revision_sha256' => justice_ops_cyprus_bridge_batch_revision_hash( $snapshots ),
	);
}

/**
 * True only for a lowercase SHA-256 digest.
 */
function justice_ops_cyprus_bridge_is_sha256( $value ): bool {
	return is_string( $value ) && 1 === preg_match( '/^[a-f0-9]{64}$/D', $value );
}

/**
 * True only for a UUID-shaped operation or evidence token.
 */
function justice_ops_cyprus_bridge_is_uuid( $value ): bool {
	return is_string( $value ) && 1 === preg_match( '/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/iD', $value );
}

/**
 * Hash durable evidence after removing its self-referential digest.
 */
function justice_ops_cyprus_bridge_evidence_hash( array $evidence ): string {
	unset( $evidence['evidence_sha256'] );

	return justice_ops_cyprus_bridge_hash( $evidence );
}

/**
 * Build state snapshots from evidence records for a stable batch digest.
 *
 * @param array<string,array<string,mixed>> $records Evidence record map.
 * @param string                            $field   Either prior or target.
 * @return array<string,array<string,mixed>>
 */
function justice_ops_cyprus_bridge_evidence_snapshots( array $records, string $field ): array {
	$snapshots = array();
	foreach ( $records as $slug => $record ) {
		$snapshots[ $slug ] = array(
			'post_id'      => (int) $record['post_id'],
			'path'         => (string) $record['path'],
			'modified_gmt' => (string) $record['initial_modified_gmt'],
			'state'        => $record[ $field ],
		);
	}

	return $snapshots;
}

/**
 * Build the durable exact-prior-state record before the first mutation.
 *
 * @param array<string,mixed>              $batch   Current full batch.
 * @param array<string,array<string,mixed>> $targets Exact target states.
 * @return array<string,mixed>
 */
function justice_ops_cyprus_bridge_build_evidence( array $batch, array $targets, string $operation_id, string $token ): array {
	$records = array();
	foreach ( $batch['records'] as $slug => $snapshot ) {
		$records[ $slug ] = array(
			'post_id'             => (int) $snapshot['post_id'],
			'slug'                => (string) $slug,
			'path'                => (string) $snapshot['path'],
			'post_type'           => (string) $snapshot['post_type'],
			'post_status'         => (string) $snapshot['post_status'],
			'initial_modified_gmt'=> (string) $snapshot['modified_gmt'],
			'prior'               => $snapshot['state'],
			'target'              => $targets[ $slug ],
		);
	}
	ksort( $records, SORT_STRING );
	$slugs    = array_keys( $records );
	$evidence = array(
		'schema_version'           => 1,
		'kind'                     => 'cyprus-content-exact-prior-state',
		'operation_id'             => $operation_id,
		'token'                    => $token,
		'created_at_gmt'           => gmdate( 'c' ),
		'slugs'                    => $slugs,
		'records'                  => $records,
		'prior_batch_state_sha256' => justice_ops_cyprus_bridge_batch_state_hash( justice_ops_cyprus_bridge_evidence_snapshots( $records, 'prior' ) ),
		'target_batch_state_sha256'=> justice_ops_cyprus_bridge_batch_state_hash( justice_ops_cyprus_bridge_evidence_snapshots( $records, 'target' ) ),
	);
	$evidence['evidence_sha256'] = justice_ops_cyprus_bridge_evidence_hash( $evidence );

	return $evidence;
}

/**
 * Validate durable rollback evidence without trusting any stored field.
 *
 * @param mixed $value Stored option value.
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_cyprus_bridge_validate_evidence( $value ) {
	if ( null === $value || false === $value ) {
		return null;
	}
	$top_keys = array(
		'schema_version',
		'kind',
		'operation_id',
		'token',
		'created_at_gmt',
		'slugs',
		'records',
		'prior_batch_state_sha256',
		'target_batch_state_sha256',
		'evidence_sha256',
	);
	if ( ! is_array( $value ) || ! justice_ops_cyprus_bridge_exact_keys( $value, $top_keys ) ) {
		return new WP_Error( 'cyprus_content_evidence_invalid', 'Stored Cyprus rollback evidence has an invalid shape.', array( 'status' => 500 ) );
	}
	if (
		1 !== $value['schema_version']
		|| 'cyprus-content-exact-prior-state' !== $value['kind']
		|| ! justice_ops_cyprus_bridge_is_uuid( $value['operation_id'] )
		|| ! justice_ops_cyprus_bridge_is_uuid( $value['token'] )
		|| ! is_string( $value['created_at_gmt'] )
		|| '' === $value['created_at_gmt']
		|| ! is_array( $value['slugs'] )
		|| ! is_array( $value['records'] )
		|| ! justice_ops_cyprus_bridge_is_sha256( $value['prior_batch_state_sha256'] )
		|| ! justice_ops_cyprus_bridge_is_sha256( $value['target_batch_state_sha256'] )
		|| ! justice_ops_cyprus_bridge_is_sha256( $value['evidence_sha256'] )
	) {
		return new WP_Error( 'cyprus_content_evidence_invalid', 'Stored Cyprus rollback evidence contains invalid identity or digest fields.', array( 'status' => 500 ) );
	}

	$allowlist = justice_ops_cyprus_bridge_allowlist();
	$slugs     = array_values( $value['slugs'] );
	$sorted    = $slugs;
	sort( $sorted, SORT_STRING );
	if ( $slugs !== $sorted || count( $slugs ) < 1 || count( $slugs ) > count( $allowlist ) || array_keys( $value['records'] ) !== $slugs ) {
		return new WP_Error( 'cyprus_content_evidence_invalid', 'Stored Cyprus rollback evidence has an invalid record set.', array( 'status' => 500 ) );
	}

	$record_keys = array( 'post_id', 'slug', 'path', 'post_type', 'post_status', 'initial_modified_gmt', 'prior', 'target' );
	foreach ( $value['records'] as $slug => $record ) {
		if (
			! is_string( $slug )
			|| ! isset( $allowlist[ $slug ] )
			|| ! is_array( $record )
			|| ! justice_ops_cyprus_bridge_exact_keys( $record, $record_keys )
			|| ! is_int( $record['post_id'] )
			|| $record['post_id'] < 1
			|| $slug !== $record['slug']
			|| $allowlist[ $slug ] !== $record['path']
			|| 'articles' !== $record['post_type']
			|| 'publish' !== $record['post_status']
			|| ! is_string( $record['initial_modified_gmt'] )
			|| '' === $record['initial_modified_gmt']
			|| ! is_array( $record['prior'] )
			|| ! is_array( $record['target'] )
			|| ! justice_ops_cyprus_bridge_state_is_supported( $record['prior'] )
			|| ! justice_ops_cyprus_bridge_state_is_supported( $record['target'] )
			|| ! $record['target']['yoast_title']['exists']
			|| 1 !== $record['target']['yoast_title']['row_count']
			|| ! $record['target']['yoast_description']['exists']
			|| 1 !== $record['target']['yoast_description']['row_count']
		) {
			return new WP_Error( 'cyprus_content_evidence_invalid', 'Stored Cyprus rollback evidence contains an invalid controlled record.', array( 'status' => 500, 'slug' => $slug ) );
		}
	}

	$prior_hash  = justice_ops_cyprus_bridge_batch_state_hash( justice_ops_cyprus_bridge_evidence_snapshots( $value['records'], 'prior' ) );
	$target_hash = justice_ops_cyprus_bridge_batch_state_hash( justice_ops_cyprus_bridge_evidence_snapshots( $value['records'], 'target' ) );
	if (
		! hash_equals( $prior_hash, $value['prior_batch_state_sha256'] )
		|| ! hash_equals( $target_hash, $value['target_batch_state_sha256'] )
		|| ! hash_equals( justice_ops_cyprus_bridge_evidence_hash( $value ), $value['evidence_sha256'] )
	) {
		return new WP_Error( 'cyprus_content_evidence_invalid', 'Stored Cyprus rollback evidence failed exact hash validation.', array( 'status' => 500 ) );
	}

	return $value;
}

/**
 * Read one bridge option directly from the database, bypassing persistent
 * object cache. The option cache entry is evicted before the query so a PHP
 * crash after a later direct SQL mutation cannot leave an older value trusted
 * by the next request.
 *
 * @return array{exists:bool,value:mixed,serialized:string}|WP_Error
 */
function justice_ops_cyprus_bridge_read_option_fresh( string $option_name ) {
	global $wpdb;

	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->options )
		|| ! is_string( $wpdb->options )
		|| '' === $wpdb->options
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'get_results' )
	) {
		return new WP_Error( 'cyprus_content_option_read_unavailable', 'A fresh database-backed bridge option read is unavailable.', array( 'status' => 500 ) );
	}
	if ( function_exists( 'wp_cache_delete' ) ) {
		wp_cache_delete( $option_name, 'options' );
	}
	$query = $wpdb->prepare(
		"SELECT option_value
		 FROM {$wpdb->options}
		 WHERE BINARY option_name = BINARY %s
		 LIMIT 2",
		$option_name
	);
	$rows  = $wpdb->get_results( $query, ARRAY_A );
	if ( ! is_array( $rows ) || count( $rows ) > 1 ) {
		return new WP_Error( 'cyprus_content_option_read_failed', 'A bridge option could not be read unambiguously from the database.', array( 'status' => 500 ) );
	}
	if ( array() === $rows ) {
		return array(
			'exists'     => false,
			'value'      => null,
			'serialized' => '',
		);
	}
	if ( ! is_array( $rows[0] ) || ! array_key_exists( 'option_value', $rows[0] ) || ! is_string( $rows[0]['option_value'] ) ) {
		return new WP_Error( 'cyprus_content_option_read_failed', 'A bridge option database row is malformed.', array( 'status' => 500 ) );
	}
	$serialized = $rows[0]['option_value'];
	$value      = function_exists( 'maybe_unserialize' ) ? maybe_unserialize( $serialized ) : @unserialize( $serialized );

	return array(
		'exists'     => true,
		'value'      => $value,
		'serialized' => $serialized,
	);
}

/**
 * Persist a non-autoloaded bridge option once and verify its exact raw bytes.
 */
function justice_ops_cyprus_bridge_add_option_once( string $option_name, array $value ): bool {
	$current = justice_ops_cyprus_bridge_read_option_fresh( $option_name );
	if ( is_wp_error( $current ) || $current['exists'] ) {
		return false;
	}
	if ( ! add_option( $option_name, $value, '', 'no' ) ) {
		return false;
	}
	$stored     = justice_ops_cyprus_bridge_read_option_fresh( $option_name );
	$serialized = function_exists( 'maybe_serialize' ) ? maybe_serialize( $value ) : serialize( $value );

	return is_array( $stored )
		&& $stored['exists']
		&& hash_equals( $serialized, $stored['serialized'] );
}

/**
 * Read and validate pending durable evidence.
 *
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_cyprus_bridge_pending_evidence() {
	$stored = justice_ops_cyprus_bridge_read_option_fresh( justice_ops_cyprus_bridge_rollback_name() );
	if ( is_wp_error( $stored ) ) {
		return $stored;
	}

	return justice_ops_cyprus_bridge_validate_evidence( $stored['exists'] ? $stored['value'] : null );
}

/**
 * Return a safe evidence summary without prior or target article bodies.
 *
 * @param array<string,mixed>|null $evidence Valid evidence or null.
 * @return array<string,mixed>|null
 */
function justice_ops_cyprus_bridge_evidence_summary( $evidence ) {
	if ( ! is_array( $evidence ) ) {
		return null;
	}
	$records = array();
	foreach ( $evidence['records'] as $slug => $record ) {
		$records[ $slug ] = array(
			'post_id'                  => $record['post_id'],
			'path'                     => $record['path'],
			'initial_modified_gmt'     => $record['initial_modified_gmt'],
			'prior_state_sha256'       => $record['prior']['state_sha256'],
			'target_state_sha256'      => $record['target']['state_sha256'],
			'prior_post_title_sha256'  => $record['prior']['post_title_sha256'],
			'target_post_title_sha256' => $record['target']['post_title_sha256'],
		);
	}

	return array(
		'operation_id'             => $evidence['operation_id'],
		'token'                    => $evidence['token'],
		'created_at_gmt'           => $evidence['created_at_gmt'],
		'slugs'                    => $evidence['slugs'],
		'records'                  => $records,
		'prior_batch_state_sha256' => $evidence['prior_batch_state_sha256'],
		'target_batch_state_sha256'=> $evidence['target_batch_state_sha256'],
		'evidence_sha256'          => $evidence['evidence_sha256'],
	);
}

/**
 * Hash a terminal receipt without its self-referential digest.
 */
function justice_ops_cyprus_bridge_receipt_hash( array $receipt ): string {
	unset( $receipt['receipt_sha256'] );

	return justice_ops_cyprus_bridge_hash( $receipt );
}

/**
 * Build an immutable terminal receipt before consuming rollback evidence.
 *
 * @param array<string,mixed> $evidence Valid durable evidence.
 * @param array<string,mixed> $request  Valid lifecycle request.
 * @param array<string,mixed> $terminal Exact terminal readback batch.
 */
function justice_ops_cyprus_bridge_build_receipt( string $outcome, array $evidence, array $request, array $terminal ): array {
	$records = array();
	foreach ( $terminal['records'] as $slug => $record ) {
		$records[ $slug ] = array(
			'post_id'                  => (int) $record['post_id'],
			'path'                     => (string) $record['path'],
			'modified_gmt'             => (string) $record['modified_gmt'],
			'state_sha256'             => (string) $record['state']['state_sha256'],
			'prior_post_title_sha256'  => (string) $evidence['records'][ $slug ]['prior']['post_title_sha256'],
			'target_post_title_sha256' => (string) $evidence['records'][ $slug ]['target']['post_title_sha256'],
			'terminal_post_title_sha256'=> (string) $record['state']['post_title_sha256'],
		);
	}
	ksort( $records, SORT_STRING );
	$receipt = array(
		'schema_version'              => 1,
		'kind'                        => 'cyprus-content-terminal-receipt',
		'outcome'                     => $outcome,
		'operation_id'                => $evidence['operation_id'],
		'token'                       => $evidence['token'],
		'evidence_sha256'             => $evidence['evidence_sha256'],
		'completed_at_gmt'            => gmdate( 'c' ),
		'slugs'                       => $evidence['slugs'],
		'request_batch_state_sha256'  => $request['expected']['batch_state_sha256'],
		'request_batch_revision_sha256'=> $request['expected']['batch_revision_sha256'],
		'prior_batch_state_sha256'    => $evidence['prior_batch_state_sha256'],
		'target_batch_state_sha256'   => $evidence['target_batch_state_sha256'],
		'terminal_batch_state_sha256' => $terminal['batch_state_sha256'],
		'terminal_batch_revision_sha256'=> $terminal['batch_revision_sha256'],
		'records'                     => $records,
	);
	$receipt['receipt_sha256'] = justice_ops_cyprus_bridge_receipt_hash( $receipt );

	return $receipt;
}

/**
 * Validate one durable terminal receipt and all of its identity bindings.
 *
 * @param mixed $value Stored option value.
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_cyprus_bridge_validate_receipt( $value ) {
	if ( null === $value || false === $value ) {
		return null;
	}
	$top_keys = array(
		'schema_version',
		'kind',
		'outcome',
		'operation_id',
		'token',
		'evidence_sha256',
		'completed_at_gmt',
		'slugs',
		'request_batch_state_sha256',
		'request_batch_revision_sha256',
		'prior_batch_state_sha256',
		'target_batch_state_sha256',
		'terminal_batch_state_sha256',
		'terminal_batch_revision_sha256',
		'records',
		'receipt_sha256',
	);
	if ( ! is_array( $value ) || ! justice_ops_cyprus_bridge_exact_keys( $value, $top_keys ) ) {
		return new WP_Error( 'cyprus_content_receipt_invalid', 'Stored Cyprus terminal receipt has an invalid shape.', array( 'status' => 500 ) );
	}
	if (
		1 !== $value['schema_version']
		|| 'cyprus-content-terminal-receipt' !== $value['kind']
		|| ! in_array( $value['outcome'], array( 'finalized', 'rolled_back' ), true )
		|| ! justice_ops_cyprus_bridge_is_uuid( $value['operation_id'] )
		|| ! justice_ops_cyprus_bridge_is_uuid( $value['token'] )
		|| ! justice_ops_cyprus_bridge_is_sha256( $value['evidence_sha256'] )
		|| ! is_string( $value['completed_at_gmt'] )
		|| '' === $value['completed_at_gmt']
		|| ! is_array( $value['slugs'] )
		|| ! is_array( $value['records'] )
	) {
		return new WP_Error( 'cyprus_content_receipt_invalid', 'Stored Cyprus terminal receipt has invalid identity fields.', array( 'status' => 500 ) );
	}
	foreach (
		array(
			'request_batch_state_sha256',
			'request_batch_revision_sha256',
			'prior_batch_state_sha256',
			'target_batch_state_sha256',
			'terminal_batch_state_sha256',
			'terminal_batch_revision_sha256',
			'receipt_sha256',
		) as $hash_key
	) {
		if ( ! justice_ops_cyprus_bridge_is_sha256( $value[ $hash_key ] ) ) {
			return new WP_Error( 'cyprus_content_receipt_invalid', 'Stored Cyprus terminal receipt has an invalid digest.', array( 'status' => 500 ) );
		}
	}

	$allowlist = justice_ops_cyprus_bridge_allowlist();
	$slugs     = array_values( $value['slugs'] );
	$sorted    = $slugs;
	sort( $sorted, SORT_STRING );
	if ( $slugs !== $sorted || count( $slugs ) < 1 || count( $slugs ) > count( $allowlist ) || array_keys( $value['records'] ) !== $slugs ) {
		return new WP_Error( 'cyprus_content_receipt_invalid', 'Stored Cyprus terminal receipt has an invalid record set.', array( 'status' => 500 ) );
	}
	foreach ( $value['records'] as $slug => $record ) {
		if (
			! isset( $allowlist[ $slug ] )
			|| ! is_array( $record )
			|| ! justice_ops_cyprus_bridge_exact_keys( $record, array( 'post_id', 'path', 'modified_gmt', 'state_sha256', 'prior_post_title_sha256', 'target_post_title_sha256', 'terminal_post_title_sha256' ) )
			|| ! is_int( $record['post_id'] )
			|| $record['post_id'] < 1
			|| $allowlist[ $slug ] !== $record['path']
			|| ! is_string( $record['modified_gmt'] )
			|| '' === $record['modified_gmt']
			|| ! justice_ops_cyprus_bridge_is_sha256( $record['state_sha256'] )
			|| ! justice_ops_cyprus_bridge_is_sha256( $record['prior_post_title_sha256'] )
			|| ! justice_ops_cyprus_bridge_is_sha256( $record['target_post_title_sha256'] )
			|| ! justice_ops_cyprus_bridge_is_sha256( $record['terminal_post_title_sha256'] )
			|| ! hash_equals(
				'finalized' === $value['outcome'] ? $record['target_post_title_sha256'] : $record['prior_post_title_sha256'],
				$record['terminal_post_title_sha256']
			)
		) {
			return new WP_Error( 'cyprus_content_receipt_invalid', 'Stored Cyprus terminal receipt contains an invalid controlled record.', array( 'status' => 500, 'slug' => $slug ) );
		}
	}
	$terminal_snapshots = array();
	foreach ( $value['records'] as $slug => $record ) {
		$terminal_snapshots[ $slug ] = array(
			'post_id' => $record['post_id'],
			'path'    => $record['path'],
			'state'   => array( 'state_sha256' => $record['state_sha256'] ),
		);
	}
	$expected_terminal = 'finalized' === $value['outcome'] ? $value['target_batch_state_sha256'] : $value['prior_batch_state_sha256'];
	if (
		! hash_equals( $expected_terminal, $value['terminal_batch_state_sha256'] )
		|| ! hash_equals( justice_ops_cyprus_bridge_batch_state_hash( $terminal_snapshots ), $value['terminal_batch_state_sha256'] )
		|| ! hash_equals( justice_ops_cyprus_bridge_receipt_hash( $value ), $value['receipt_sha256'] )
	) {
		return new WP_Error( 'cyprus_content_receipt_invalid', 'Stored Cyprus terminal receipt failed exact hash validation.', array( 'status' => 500 ) );
	}

	return $value;
}

/**
 * Read one receipt by its evidence token.
 *
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_cyprus_bridge_terminal_receipt( string $token ) {
	$stored = justice_ops_cyprus_bridge_read_option_fresh( justice_ops_cyprus_bridge_receipt_name( $token ) );
	if ( is_wp_error( $stored ) ) {
		return $stored;
	}

	return justice_ops_cyprus_bridge_validate_receipt( $stored['exists'] ? $stored['value'] : null );
}

/**
 * Persist once, or accept only an already identical terminal receipt.
 *
 * @return array<string,mixed>|WP_Error
 */
function justice_ops_cyprus_bridge_persist_receipt( array $receipt ) {
	$name = justice_ops_cyprus_bridge_receipt_name( $receipt['token'] );
	if ( justice_ops_cyprus_bridge_add_option_once( $name, $receipt ) ) {
		return $receipt;
	}
	$stored = justice_ops_cyprus_bridge_terminal_receipt( $receipt['token'] );
	if ( is_array( $stored ) && hash_equals( $stored['receipt_sha256'], $receipt['receipt_sha256'] ) ) {
		return $stored;
	}

	return new WP_Error( 'cyprus_content_receipt_write_failed', 'A durable exact terminal receipt could not be persisted.', array( 'status' => 500 ) );
}

/**
 * Safe terminal receipt response; contains hashes and identity, never bodies.
 */
function justice_ops_cyprus_bridge_receipt_summary( array $receipt ): array {
	return $receipt;
}

/**
 * Atomically delete only the exact option value observed by this request.
 *
 * @param array<string,mixed> $observed Exact serialized option value.
 */
function justice_ops_cyprus_bridge_delete_option_value_exact( string $option_name, array $observed ): bool {
	global $wpdb;

	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->options )
		|| ! is_string( $wpdb->options )
		|| '' === $wpdb->options
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'query' )
	) {
		return false;
	}

	if ( function_exists( 'wp_cache_delete' ) ) {
		wp_cache_delete( $option_name, 'options' );
	}
	$serialized = function_exists( 'maybe_serialize' ) ? maybe_serialize( $observed ) : serialize( $observed );
	$query      = $wpdb->prepare(
		"DELETE FROM {$wpdb->options} WHERE BINARY option_name = BINARY %s AND BINARY option_value = BINARY %s",
		$option_name,
		$serialized
	);
	$deleted    = $wpdb->query( $query );
	if ( 1 === $deleted ) {
		if ( function_exists( 'wp_cache_delete' ) ) {
			wp_cache_delete( $option_name, 'options' );
		}

		return true;
	}
	$fresh = justice_ops_cyprus_bridge_read_option_fresh( $option_name );

	return is_array( $fresh ) && ! $fresh['exists'];
}

/**
 * Acquire the one global lock shared by update, rollback and finalize.
 *
 * @return string|WP_Error
 */
function justice_ops_cyprus_bridge_acquire_lock() {
	$lock_name  = justice_ops_cyprus_bridge_lock_name();
	$lock_token = wp_generate_uuid4();
	$fresh      = justice_ops_cyprus_bridge_read_option_fresh( $lock_name );
	if ( is_wp_error( $fresh ) ) {
		return $fresh;
	}
	$existing = $fresh['exists'] ? $fresh['value'] : null;
	if ( is_array( $existing ) && isset( $existing['expires_at'] ) && (int) $existing['expires_at'] < time() ) {
		if ( ! justice_ops_cyprus_bridge_delete_option_value_exact( $lock_name, $existing ) ) {
			return new WP_Error( 'cyprus_content_locked', 'Another Cyprus content operation is active.', array( 'status' => 409 ) );
		}
		$existing = null;
	}
	if ( null !== $existing || ! justice_ops_cyprus_bridge_add_option_once( $lock_name, array( 'token' => $lock_token, 'expires_at' => time() + 300 ) ) ) {
		return new WP_Error( 'cyprus_content_locked', 'Another Cyprus content operation is active.', array( 'status' => 409 ) );
	}

	return $lock_token;
}

/**
 * Release only the lock token held by this operation.
 */
function justice_ops_cyprus_bridge_release_lock( string $lock_token ): void {
	$lock_name = justice_ops_cyprus_bridge_lock_name();
	$fresh     = justice_ops_cyprus_bridge_read_option_fresh( $lock_name );
	$held      = is_array( $fresh ) && $fresh['exists'] ? $fresh['value'] : null;
	if ( is_array( $held ) && isset( $held['token'] ) && hash_equals( $lock_token, (string) $held['token'] ) ) {
		justice_ops_cyprus_bridge_delete_option_value_exact( $lock_name, $held );
	}
}

/**
 * Validate and normalize a strict update request.
 *
 * @return array<string,mixed>|WP_Error
 */
function justice_ops_cyprus_bridge_validate_update_request( WP_REST_Request $request ) {
	$params = $request->get_json_params();
	if (
		! is_array( $params )
		|| ! justice_ops_cyprus_bridge_exact_keys( $params, array( 'operation_id', 'records' ) )
		|| ! justice_ops_cyprus_bridge_is_uuid( $params['operation_id'] )
		|| ! is_array( $params['records'] )
		|| count( $params['records'] ) < 1
		|| count( $params['records'] ) > count( justice_ops_cyprus_bridge_allowlist() )
		|| array_keys( $params['records'] ) !== range( 0, count( $params['records'] ) - 1 )
	) {
		return new WP_Error( 'cyprus_content_request_invalid', 'An operation UUID and a non-empty list of controlled records are required.', array( 'status' => 400 ) );
	}

	$allowlist      = justice_ops_cyprus_bridge_allowlist();
	$normalized     = array();
	$record_keys    = array( 'slug', 'post_id', 'path', 'expected', 'target' );
	$expected_keys  = array( 'modified_gmt', 'state_sha256', 'content_sha256', 'post_title_sha256', 'yoast_title_sha256', 'yoast_description_sha256' );
	$target_keys    = array( 'content', 'post_title', 'yoast_title', 'yoast_description', 'content_sha256', 'post_title_sha256', 'yoast_title_sha256', 'yoast_description_sha256', 'state_sha256' );
	foreach ( $params['records'] as $record ) {
		if ( ! is_array( $record ) || ! justice_ops_cyprus_bridge_exact_keys( $record, $record_keys ) ) {
			return new WP_Error( 'cyprus_content_record_invalid', 'Every Cyprus release record must use the exact reviewed shape.', array( 'status' => 400 ) );
		}
		$slug = $record['slug'];
		if (
			! is_string( $slug )
			|| ! isset( $allowlist[ $slug ] )
			|| isset( $normalized[ $slug ] )
			|| ! is_int( $record['post_id'] )
			|| $record['post_id'] < 1
			|| ! is_string( $record['path'] )
			|| $allowlist[ $slug ] !== $record['path']
			|| ! is_array( $record['expected'] )
			|| ! is_array( $record['target'] )
			|| ! justice_ops_cyprus_bridge_exact_keys( $record['expected'], $expected_keys )
			|| ! justice_ops_cyprus_bridge_exact_keys( $record['target'], $target_keys )
		) {
			return new WP_Error( 'cyprus_content_record_invalid', 'A release record is duplicated, outside the allowlist, or has invalid immutable identity.', array( 'status' => 400, 'slug' => is_string( $slug ) ? $slug : '' ) );
		}

		$expected = $record['expected'];
		$target   = $record['target'];
		if ( ! is_string( $expected['modified_gmt'] ) || '' === $expected['modified_gmt'] ) {
			return new WP_Error( 'cyprus_content_expected_invalid', 'Every record requires its exact observed modified time.', array( 'status' => 400, 'slug' => $slug ) );
		}
		foreach ( array( 'state_sha256', 'content_sha256', 'post_title_sha256', 'yoast_title_sha256', 'yoast_description_sha256' ) as $hash_key ) {
			if ( ! justice_ops_cyprus_bridge_is_sha256( $expected[ $hash_key ] ) ) {
				return new WP_Error( 'cyprus_content_expected_invalid', 'Expected state digests must be lowercase SHA-256 values.', array( 'status' => 400, 'slug' => $slug ) );
			}
		}
		foreach ( array( 'content', 'post_title', 'yoast_title', 'yoast_description' ) as $text_key ) {
			if ( ! is_string( $target[ $text_key ] ) || 1 !== preg_match( '//u', $target[ $text_key ] ) ) {
				return new WP_Error( 'cyprus_content_target_invalid', 'Target text must be valid UTF-8.', array( 'status' => 400, 'slug' => $slug ) );
			}
		}
		if (
			'' === trim( $target['content'] )
			|| '' === trim( $target['post_title'] )
			|| '' === trim( $target['yoast_title'] )
			|| '' === trim( $target['yoast_description'] )
			|| strlen( $target['content'] ) > 2000000
			|| strlen( $target['post_title'] ) > 512
			|| strlen( $target['yoast_title'] ) > 512
			|| strlen( $target['yoast_description'] ) > 2048
		) {
			return new WP_Error( 'cyprus_content_target_invalid', 'Target content or metadata is empty or exceeds the reviewed byte limit.', array( 'status' => 400, 'slug' => $slug ) );
		}
		foreach ( array( 'content_sha256', 'post_title_sha256', 'yoast_title_sha256', 'yoast_description_sha256', 'state_sha256' ) as $hash_key ) {
			if ( ! justice_ops_cyprus_bridge_is_sha256( $target[ $hash_key ] ) ) {
				return new WP_Error( 'cyprus_content_target_invalid', 'Target state digests must be lowercase SHA-256 values.', array( 'status' => 400, 'slug' => $slug ) );
			}
		}

		$target_state = justice_ops_cyprus_bridge_build_target_state(
			$target['content'],
			$target['post_title'],
			$target['yoast_title'],
			$target['yoast_description']
		);
		if (
			! hash_equals( $target_state['content_sha256'], $target['content_sha256'] )
			|| ! hash_equals( $target_state['post_title_sha256'], $target['post_title_sha256'] )
			|| ! hash_equals( $target_state['yoast_title']['sha256'], $target['yoast_title_sha256'] )
			|| ! hash_equals( $target_state['yoast_description']['sha256'], $target['yoast_description_sha256'] )
			|| ! hash_equals( $target_state['state_sha256'], $target['state_sha256'] )
		) {
			return new WP_Error( 'cyprus_content_target_hash_mismatch', 'Target text does not match its exact supplied digests.', array( 'status' => 400, 'slug' => $slug ) );
		}

		$normalized[ $slug ] = array(
			'post_id' => $record['post_id'],
			'path'    => $record['path'],
			'expected'=> $expected,
			'target'  => $target_state,
		);
	}
	ksort( $normalized, SORT_STRING );

	return array(
		'operation_id' => $params['operation_id'],
		'records'      => $normalized,
		'slugs'        => array_keys( $normalized ),
	);
}

/**
 * True when one metadata field is exactly equal in two complete states.
 */
function justice_ops_cyprus_bridge_meta_matches( array $left, array $right, string $field ): bool {
	return $left[ $field ]['value'] === $right[ $field ]['value']
		&& $left[ $field ]['exists'] === $right[ $field ]['exists']
		&& $left[ $field ]['row_count'] === $right[ $field ]['row_count']
		&& hash_equals( $left[ $field ]['sha256'], $right[ $field ]['sha256'] );
}

/**
 * Read the exact raw database row behind one controlled metadata key.
 *
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_cyprus_bridge_read_raw_meta_row( int $post_id, string $meta_key ) {
	global $wpdb;

	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->postmeta )
		|| ! is_string( $wpdb->postmeta )
		|| '' === $wpdb->postmeta
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'get_results' )
	) {
		return new WP_Error( 'cyprus_content_meta_cas_unavailable', 'Atomic metadata compare-and-swap is unavailable.', array( 'status' => 500 ) );
	}
	$query = $wpdb->prepare(
		"SELECT meta_id, meta_value
		 FROM {$wpdb->postmeta}
		 WHERE post_id = %d AND BINARY meta_key = BINARY %s
		 ORDER BY meta_id ASC
		 LIMIT 2",
		$post_id,
		$meta_key
	);
	$rows  = $wpdb->get_results( $query, ARRAY_A );
	if ( ! is_array( $rows ) || count( $rows ) > 1 ) {
		return new WP_Error( 'cyprus_content_meta_cardinality_invalid', 'Controlled Yoast metadata must contain zero or one row.', array( 'status' => 409 ) );
	}
	if ( array() === $rows ) {
		return null;
	}
	$row = $rows[0];
	if (
		! is_array( $row )
		|| ! isset( $row['meta_id'], $row['meta_value'] )
		|| ! is_numeric( $row['meta_id'] )
		|| (int) $row['meta_id'] < 1
		|| ! is_string( $row['meta_value'] )
	) {
		return new WP_Error( 'cyprus_content_meta_cas_unavailable', 'Controlled Yoast metadata has an unsupported raw row.', array( 'status' => 500 ) );
	}

	return array(
		'meta_id'    => (int) $row['meta_id'],
		'meta_value' => $row['meta_value'],
	);
}

/**
 * Move one metadata field through one atomic conditional SQL statement.
 *
 * Normal editors do not hold the bridge lock. Existing rows are therefore
 * bound by meta_id and exact bytes; absent rows use INSERT...SELECT with an
 * atomic NOT EXISTS guard. There is no ambiguous absent crash state.
 */
function justice_ops_cyprus_bridge_transition_meta( string $slug, array $from, array $to, string $field, string $meta_key ): bool {
	global $wpdb;
	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->posts, $wpdb->postmeta )
		|| ! is_string( $wpdb->posts )
		|| ! is_string( $wpdb->postmeta )
		|| '' === $wpdb->posts
		|| '' === $wpdb->postmeta
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'query' )
	) {
		return false;
	}

	$post = justice_ops_cyprus_bridge_resolve_record( $slug );
	if ( is_wp_error( $post ) ) {
		return false;
	}
	$current = justice_ops_cyprus_bridge_read_state( $post );
	if ( ! justice_ops_cyprus_bridge_state_is_supported( $current ) ) {
		return false;
	}
	if ( justice_ops_cyprus_bridge_meta_matches( $current, $to, $field ) ) {
		return true;
	}
	if ( ! justice_ops_cyprus_bridge_meta_matches( $current, $from, $field ) ) {
		return false;
	}
	$raw_row = justice_ops_cyprus_bridge_read_raw_meta_row( $post->ID, $meta_key );
	if ( is_wp_error( $raw_row ) ) {
		return false;
	}
	$current_exists = $current[ $field ]['exists'];
	$target_exists  = $to[ $field ]['exists'];
	if ( $current_exists !== is_array( $raw_row ) ) {
		return false;
	}
	if (
		$current_exists
		&& (
			$current[ $field ]['value'] !== $raw_row['meta_value']
			|| ! hash_equals( $current[ $field ]['sha256'], hash( 'sha256', $raw_row['meta_value'] ) )
		)
	) {
		return false;
	}

	$identity_sql = "SELECT 1 FROM {$wpdb->posts} AS p
		WHERE p.ID = %d AND BINARY p.post_type = BINARY %s AND BINARY p.post_status = BINARY %s
		AND BINARY p.post_name = BINARY %s";
	$meta_id      = 0;
	$action       = '';
	if ( ! $current_exists && ! $target_exists ) {
		return true;
	}
	if ( ! $current_exists && $target_exists ) {
		$query = $wpdb->prepare(
			"INSERT INTO {$wpdb->postmeta} (post_id, meta_key, meta_value)
			 SELECT %d, %s, %s
			 WHERE EXISTS ({$identity_sql})
			   AND NOT EXISTS (
				SELECT 1 FROM {$wpdb->postmeta} AS guard
				WHERE guard.post_id = %d AND BINARY guard.meta_key = BINARY %s
			   )",
			$post->ID,
			$meta_key,
			$to[ $field ]['value'],
			$post->ID,
			'articles',
			'publish',
			$slug,
			$post->ID,
			$meta_key
		);
		$action = 'added';
	} elseif ( $current_exists && ! $target_exists ) {
		$query = $wpdb->prepare(
			"DELETE FROM {$wpdb->postmeta}
			 WHERE meta_id = %d AND post_id = %d AND BINARY meta_key = BINARY %s
			   AND BINARY meta_value = BINARY %s
			   AND EXISTS ({$identity_sql})",
			$raw_row['meta_id'],
			$post->ID,
			$meta_key,
			$raw_row['meta_value'],
			$post->ID,
			'articles',
			'publish',
			$slug
		);
		$meta_id = $raw_row['meta_id'];
		$action  = 'deleted';
	} else {
		$query = $wpdb->prepare(
			"UPDATE {$wpdb->postmeta}
			 SET meta_value = %s
			 WHERE meta_id = %d AND post_id = %d AND BINARY meta_key = BINARY %s
			   AND BINARY meta_value = BINARY %s
			   AND EXISTS ({$identity_sql})",
			$to[ $field ]['value'],
			$raw_row['meta_id'],
			$post->ID,
			$meta_key,
			$raw_row['meta_value'],
			$post->ID,
			'articles',
			'publish',
			$slug
		);
		$meta_id = $raw_row['meta_id'];
		$action  = 'updated';
	}
	if ( 1 !== $wpdb->query( $query ) ) {
		return false;
	}
	if ( 'added' === $action ) {
		$meta_id = isset( $wpdb->insert_id ) ? (int) $wpdb->insert_id : 0;
		if ( $meta_id < 1 ) {
			return false;
		}
	}
	if ( function_exists( 'wp_cache_delete' ) ) {
		wp_cache_delete( $post->ID, 'post_meta' );
	}
	clean_post_cache( $post->ID );
	if ( 'added' === $action ) {
		do_action( 'added_post_meta', $meta_id, $post->ID, $meta_key, $to[ $field ]['value'] );
	} elseif ( 'updated' === $action ) {
		do_action( 'updated_post_meta', $meta_id, $post->ID, $meta_key, $to[ $field ]['value'] );
	} else {
		do_action( 'deleted_post_meta', array( $meta_id ), $post->ID, $meta_key, $current[ $field ]['value'] );
	}
	$readback_post = justice_ops_cyprus_bridge_resolve_record( $slug );
	if ( is_wp_error( $readback_post ) ) {
		return false;
	}
	$readback = justice_ops_cyprus_bridge_read_state( $readback_post );

	return justice_ops_cyprus_bridge_state_is_supported( $readback )
		&& justice_ops_cyprus_bridge_meta_matches( $readback, $to, $field );
}

/**
 * Move post_content and post_title in one atomic database compare-and-swap.
 *
 * The bridge lock serializes bridge requests, but normal WordPress editors do
 * not hold it. The UPDATE therefore binds both prior field values, revision
 * time and immutable identity in its WHERE clause. An ordinary edit between
 * read and write makes the affected-row count zero and is never overwritten.
 */
function justice_ops_cyprus_bridge_transition_post_fields( string $slug, array $from, array $to ): bool {
	global $wpdb;

	$post = justice_ops_cyprus_bridge_resolve_record( $slug );
	if ( is_wp_error( $post ) ) {
		return false;
	}
	$current = justice_ops_cyprus_bridge_read_state( $post );
	if ( ! justice_ops_cyprus_bridge_state_is_supported( $current ) ) {
		return false;
	}
	if (
		hash_equals( $to['content_sha256'], $current['content_sha256'] )
		&& $to['content'] === $current['content']
		&& hash_equals( $to['post_title_sha256'], $current['post_title_sha256'] )
		&& $to['post_title'] === $current['post_title']
	) {
		return true;
	}
	if (
		! hash_equals( $from['content_sha256'], $current['content_sha256'] )
		|| $from['content'] !== $current['content']
		|| ! hash_equals( $from['post_title_sha256'], $current['post_title_sha256'] )
		|| $from['post_title'] !== $current['post_title']
	) {
		return false;
	}
	if (
		! isset( $wpdb )
		|| ! is_object( $wpdb )
		|| ! isset( $wpdb->posts )
		|| ! is_string( $wpdb->posts )
		|| '' === $wpdb->posts
		|| ! method_exists( $wpdb, 'prepare' )
		|| ! method_exists( $wpdb, 'query' )
	) {
		return false;
	}

	$prior_timestamp = strtotime( (string) $post->post_modified_gmt . ' UTC' );
	$next_timestamp  = max( time(), false === $prior_timestamp ? 0 : $prior_timestamp + 1 );
	$modified_gmt    = gmdate( 'Y-m-d H:i:s', $next_timestamp );
	$modified_local  = function_exists( 'get_date_from_gmt' ) ? get_date_from_gmt( $modified_gmt ) : $modified_gmt;
	$query           = $wpdb->prepare(
		"UPDATE {$wpdb->posts}
		 SET post_content = %s, post_title = %s, post_modified = %s, post_modified_gmt = %s
		 WHERE ID = %d
		   AND BINARY post_type = BINARY %s
		   AND BINARY post_status = BINARY %s
		   AND BINARY post_name = BINARY %s
		   AND BINARY post_content = BINARY %s
		   AND BINARY post_title = BINARY %s
		   AND BINARY post_modified_gmt = BINARY %s",
		$to['content'],
		$to['post_title'],
		$modified_local,
		$modified_gmt,
		$post->ID,
		'articles',
		'publish',
		$slug,
		$from['content'],
		$from['post_title'],
		(string) $post->post_modified_gmt
	);
	if ( 1 !== $wpdb->query( $query ) ) {
		return false;
	}
	clean_post_cache( $post->ID );
	$readback_post = justice_ops_cyprus_bridge_resolve_record( $slug );
	if ( is_wp_error( $readback_post ) ) {
		return false;
	}
	$readback = justice_ops_cyprus_bridge_read_state( $readback_post );

	return justice_ops_cyprus_bridge_state_is_supported( $readback )
		&& hash_equals( $to['content_sha256'], $readback['content_sha256'] )
		&& $to['content'] === $readback['content']
		&& hash_equals( $to['post_title_sha256'], $readback['post_title_sha256'] )
		&& $to['post_title'] === $readback['post_title'];
}

/**
 * Transition the four controlled values of one immutable article.
 */
function justice_ops_cyprus_bridge_transition_record( string $slug, array $from, array $to ): bool {
	if ( ! justice_ops_cyprus_bridge_state_is_supported( $from ) || ! justice_ops_cyprus_bridge_state_is_supported( $to ) ) {
		return false;
	}
	if ( ! justice_ops_cyprus_bridge_transition_post_fields( $slug, $from, $to ) ) {
		return false;
	}
	$mapping = array(
		'yoast_title'       => '_yoast_wpseo_title',
		'yoast_description' => '_yoast_wpseo_metadesc',
	);
	foreach ( $mapping as $field => $meta_key ) {
		if ( ! justice_ops_cyprus_bridge_transition_meta( $slug, $from, $to, $field, $meta_key ) ) {
			return false;
		}
	}

	$post = justice_ops_cyprus_bridge_resolve_record( $slug );
	if ( is_wp_error( $post ) ) {
		return false;
	}
	$readback = justice_ops_cyprus_bridge_read_state( $post );

	return justice_ops_cyprus_bridge_state_is_supported( $readback )
		&& hash_equals( $to['state_sha256'], $readback['state_sha256'] );
}

/**
 * Transition every evidence record and verify the exact requested batch.
 *
 * @param array<string,mixed> $evidence  Valid evidence.
 * @param string              $from_key  Evidence state key.
 * @param string              $to_key    Evidence state key.
 */
function justice_ops_cyprus_bridge_transition_batch( array $evidence, string $from_key, string $to_key ): bool {
	$slugs = $evidence['slugs'];
	if ( 'prior' === $to_key ) {
		$slugs = array_reverse( $slugs );
	}
	$success = true;
	foreach ( $slugs as $slug ) {
		$record = $evidence['records'][ $slug ];
		if ( ! justice_ops_cyprus_bridge_transition_record( $slug, $record[ $from_key ], $record[ $to_key ] ) ) {
			$success = false;
		}
	}
	$readback = justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], true );
	if ( is_wp_error( $readback ) ) {
		return false;
	}
	$expected_hash = $evidence[ $to_key . '_batch_state_sha256' ];

	return $success && hash_equals( $expected_hash, $readback['batch_state_sha256'] );
}

/**
 * Evict public object and metadata caches for exact allowlisted records.
 * Direct SQL is intentional for CAS safety, so every accepted/replayed state
 * must explicitly converge WordPress' persistent caches before page purge.
 *
 * @param string[] $slugs Accepted allowlisted slugs.
 */
function justice_ops_cyprus_bridge_reconcile_public_caches( array $slugs ): void {
	$allowlist = justice_ops_cyprus_bridge_allowlist();
	foreach ( array_values( array_unique( $slugs ) ) as $slug ) {
		if ( ! is_string( $slug ) || ! isset( $allowlist[ $slug ] ) ) {
			continue;
		}
		$post = justice_ops_cyprus_bridge_resolve_record( $slug );
		if ( is_wp_error( $post ) ) {
			continue;
		}
		clean_post_cache( $post->ID );
		if ( function_exists( 'wp_cache_delete' ) ) {
			wp_cache_delete( $post->ID, 'posts' );
			wp_cache_delete( $post->ID, 'post_meta' );
		}
	}
}

/**
 * Purge only exact allowlisted URLs whose controlled state was accepted.
 *
 * @param string[] $slugs Accepted slugs.
 */
function justice_ops_cyprus_bridge_purge_urls( array $slugs ): void {
	justice_ops_cyprus_bridge_reconcile_public_caches( $slugs );
	foreach ( $slugs as $slug ) {
		$post = justice_ops_cyprus_bridge_resolve_record( $slug );
		if ( is_wp_error( $post ) ) {
			continue;
		}
		do_action( 'litespeed_purge_url', (string) get_permalink( $post ) );
	}
}

/**
 * Build the stable target batch digest using current immutable identities.
 *
 * @param array<string,mixed>               $batch   Current batch.
 * @param array<string,array<string,mixed>> $records Normalized request records.
 */
function justice_ops_cyprus_bridge_request_target_hash( array $batch, array $records ): string {
	$snapshots = $batch['records'];
	foreach ( $records as $slug => $record ) {
		$snapshots[ $slug ]['state'] = $record['target'];
	}

	return justice_ops_cyprus_bridge_batch_state_hash( $snapshots );
}

/**
 * Validate request identity and exact current-state expectations.
 *
 * @param array<string,mixed> $batch      Current batch.
 * @param array<string,mixed> $normalized Normalized request.
 * @return true|WP_Error
 */
function justice_ops_cyprus_bridge_expected_matches( array $batch, array $normalized ) {
	foreach ( $normalized['records'] as $slug => $record ) {
		$current  = $batch['records'][ $slug ];
		$expected = $record['expected'];
		if ( $record['post_id'] !== $current['post_id'] || $record['path'] !== $current['path'] ) {
			return new WP_Error( 'cyprus_content_identity_conflict', 'An allowlisted article no longer has the planned immutable identity.', array( 'status' => 409, 'slug' => $slug ) );
		}
		if (
			$expected['modified_gmt'] !== $current['modified_gmt']
			|| ! hash_equals( $expected['state_sha256'], $current['state']['state_sha256'] )
			|| ! hash_equals( $expected['content_sha256'], $current['state']['content_sha256'] )
			|| ! hash_equals( $expected['post_title_sha256'], $current['state']['post_title_sha256'] )
			|| ! hash_equals( $expected['yoast_title_sha256'], $current['state']['yoast_title']['sha256'] )
			|| ! hash_equals( $expected['yoast_description_sha256'], $current['state']['yoast_description']['sha256'] )
		) {
			return new WP_Error( 'cyprus_content_state_conflict', 'A Cyprus article changed after preflight. Refresh before writing.', array( 'status' => 409, 'slug' => $slug ) );
		}
	}

	return true;
}

/**
 * Verify request immutable identities without enforcing stale expectations.
 * This is used only to recognize an exact idempotent replay already bound to
 * pending server-held evidence.
 *
 * @return true|WP_Error
 */
function justice_ops_cyprus_bridge_identity_matches( array $batch, array $normalized ) {
	foreach ( $normalized['records'] as $slug => $record ) {
		$current = $batch['records'][ $slug ];
		if ( $record['post_id'] !== $current['post_id'] || $record['path'] !== $current['path'] ) {
			return new WP_Error( 'cyprus_content_identity_conflict', 'An allowlisted article no longer has the planned immutable identity.', array( 'status' => 409, 'slug' => $slug ) );
		}
	}

	return true;
}

/**
 * Authenticated preflight for one allowlisted article or the full cohort.
 */
function justice_ops_cyprus_bridge_rest_get( WP_REST_Request $request ) {
	$slug       = $request->get_param( 'slug' );
	$allowlist  = justice_ops_cyprus_bridge_allowlist();
	$slugs      = array_keys( $allowlist );
	$include    = in_array( $request->get_param( 'include_content' ), array( 1, '1', true, 'true' ), true );
	if ( null !== $slug && '' !== $slug ) {
		if ( ! is_string( $slug ) || ! isset( $allowlist[ $slug ] ) ) {
			return new WP_Error( 'cyprus_content_slug_not_allowed', 'The requested slug is outside the Cyprus release allowlist.', array( 'status' => 400 ) );
		}
		$slugs = array( $slug );
	}

	$batch = justice_ops_cyprus_bridge_read_batch( $slugs, $include );
	if ( is_wp_error( $batch ) ) {
		return $batch;
	}
	$pending = justice_ops_cyprus_bridge_pending_evidence();
	if ( is_wp_error( $pending ) ) {
		return $pending;
	}

	return rest_ensure_response(
		array(
			'allowlist' => $allowlist,
			'current'   => $batch,
			'rollback'  => justice_ops_cyprus_bridge_evidence_summary( $pending ),
		)
	);
}

/**
 * Exact-CAS update for one to eight allowlisted existing articles.
 */
function justice_ops_cyprus_bridge_rest_update( WP_REST_Request $request ) {
	$normalized = justice_ops_cyprus_bridge_validate_update_request( $request );
	if ( is_wp_error( $normalized ) ) {
		return $normalized;
	}
	$lock_token = justice_ops_cyprus_bridge_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$batch = justice_ops_cyprus_bridge_read_batch( $normalized['slugs'], true );
		if ( is_wp_error( $batch ) ) {
			return $batch;
		}
		$identity = justice_ops_cyprus_bridge_identity_matches( $batch, $normalized );
		if ( is_wp_error( $identity ) ) {
			return $identity;
		}
		$target_batch_hash = justice_ops_cyprus_bridge_request_target_hash( $batch, $normalized['records'] );
		$pending           = justice_ops_cyprus_bridge_pending_evidence();
		if ( is_wp_error( $pending ) ) {
			return $pending;
		}
		if ( is_array( $pending ) ) {
			$same_operation = hash_equals( $pending['operation_id'], $normalized['operation_id'] )
				&& $pending['slugs'] === $normalized['slugs']
				&& hash_equals( $pending['target_batch_state_sha256'], $target_batch_hash );
			if ( $same_operation && hash_equals( $pending['target_batch_state_sha256'], $batch['batch_state_sha256'] ) ) {
				justice_ops_cyprus_bridge_purge_urls( $normalized['slugs'] );
				return rest_ensure_response(
					array(
						'updated'    => false,
						'idempotent' => true,
						'current'    => justice_ops_cyprus_bridge_read_batch( $normalized['slugs'], false ),
						'rollback'   => justice_ops_cyprus_bridge_evidence_summary( $pending ),
					)
				);
			}
			return new WP_Error( 'cyprus_content_rollback_pending', 'Pending rollback evidence must be finalized or rolled back before another content release.', array( 'status' => 409 ) );
		}

		$expected = justice_ops_cyprus_bridge_expected_matches( $batch, $normalized );
		if ( is_wp_error( $expected ) ) {
			return $expected;
		}
		if ( hash_equals( $target_batch_hash, $batch['batch_state_sha256'] ) ) {
			justice_ops_cyprus_bridge_purge_urls( $normalized['slugs'] );
			return rest_ensure_response(
				array(
					'updated'    => false,
					'idempotent' => true,
					'current'    => justice_ops_cyprus_bridge_read_batch( $normalized['slugs'], false ),
					'rollback'   => null,
				)
			);
		}

		$targets = array();
		foreach ( $normalized['records'] as $slug => $record ) {
			$targets[ $slug ] = $record['target'];
		}
		$evidence = justice_ops_cyprus_bridge_build_evidence(
			$batch,
			$targets,
			$normalized['operation_id'],
			wp_generate_uuid4()
		);
		if ( '' === $evidence['evidence_sha256'] || ! justice_ops_cyprus_bridge_add_option_once( justice_ops_cyprus_bridge_rollback_name(), $evidence ) ) {
			return new WP_Error( 'cyprus_content_evidence_write_failed', 'Exact prior-state evidence could not be persisted before the first content write.', array( 'status' => 500 ) );
		}

		if ( ! justice_ops_cyprus_bridge_transition_batch( $evidence, 'prior', 'target' ) ) {
			$restored = justice_ops_cyprus_bridge_transition_batch( $evidence, 'target', 'prior' );
			if ( $restored ) {
				$consumed = justice_ops_cyprus_bridge_delete_option_value_exact( justice_ops_cyprus_bridge_rollback_name(), $evidence );
				justice_ops_cyprus_bridge_purge_urls( $evidence['slugs'] );
				if ( ! $consumed ) {
					return new WP_Error( 'cyprus_content_compensation_cleanup_failed', 'The prior state was restored, but its rollback evidence could not be consumed.', array( 'status' => 500, 'evidence_sha256' => $evidence['evidence_sha256'] ) );
				}
			}
			return new WP_Error(
				$restored ? 'cyprus_content_write_failed' : 'cyprus_content_compensation_failed',
				$restored ? 'Exact target readback failed and every prior value was restored.' : 'Exact target readback failed and full prior-state restoration also failed.',
				array( 'status' => 500, 'evidence_sha256' => $evidence['evidence_sha256'] )
			);
		}

		$readback = justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], true );
		if ( is_wp_error( $readback ) || ! hash_equals( $evidence['target_batch_state_sha256'], $readback['batch_state_sha256'] ) ) {
			return new WP_Error( 'cyprus_content_readback_failed', 'The controlled target could not be confirmed after writing; rollback evidence remains available.', array( 'status' => 500, 'evidence_sha256' => $evidence['evidence_sha256'] ) );
		}
		justice_ops_cyprus_bridge_purge_urls( $evidence['slugs'] );

		return rest_ensure_response(
			array(
				'updated'    => true,
				'idempotent' => false,
				'current'    => justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], false ),
				'rollback'   => justice_ops_cyprus_bridge_evidence_summary( $evidence ),
			)
		);
	} finally {
		justice_ops_cyprus_bridge_release_lock( $lock_token );
	}
}

/**
 * Validate the common strict rollback/finalize request shape.
 *
 * @return array<string,mixed>|WP_Error
 */
function justice_ops_cyprus_bridge_validate_lifecycle_request( WP_REST_Request $request ) {
	$params = $request->get_json_params();
	if (
		! is_array( $params )
		|| ! justice_ops_cyprus_bridge_exact_keys( $params, array( 'operation_id', 'token', 'evidence_sha256', 'expected' ) )
		|| ! justice_ops_cyprus_bridge_is_uuid( $params['operation_id'] )
		|| ! justice_ops_cyprus_bridge_is_uuid( $params['token'] )
		|| ! justice_ops_cyprus_bridge_is_sha256( $params['evidence_sha256'] )
		|| ! is_array( $params['expected'] )
		|| ! justice_ops_cyprus_bridge_exact_keys( $params['expected'], array( 'batch_state_sha256', 'batch_revision_sha256' ) )
		|| ! justice_ops_cyprus_bridge_is_sha256( $params['expected']['batch_state_sha256'] )
		|| ! justice_ops_cyprus_bridge_is_sha256( $params['expected']['batch_revision_sha256'] )
	) {
		return new WP_Error( 'cyprus_content_lifecycle_request_invalid', 'Exact evidence identity and current batch digests are required.', array( 'status' => 400 ) );
	}

	return $params;
}

/**
 * Verify lifecycle request identity against server-held evidence.
 *
 * @return true|WP_Error
 */
function justice_ops_cyprus_bridge_lifecycle_identity_matches( array $params, array $evidence ) {
	if (
		! hash_equals( $evidence['operation_id'], $params['operation_id'] )
		|| ! hash_equals( $evidence['token'], $params['token'] )
		|| ! hash_equals( $evidence['evidence_sha256'], $params['evidence_sha256'] )
	) {
		return new WP_Error( 'cyprus_content_evidence_mismatch', 'The request does not match the exact server-held rollback evidence.', array( 'status' => 409 ) );
	}

	return true;
}

/**
 * Replay a completed lifecycle request from its immutable terminal receipt.
 * If a crash left the matching evidence behind after the receipt was saved,
 * this retry also completes that exact evidence cleanup.
 *
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_cyprus_bridge_terminal_replay( array $params, string $outcome ) {
	$receipt = justice_ops_cyprus_bridge_terminal_receipt( $params['token'] );
	if ( is_wp_error( $receipt ) || null === $receipt ) {
		return $receipt;
	}
	if (
		$outcome !== $receipt['outcome']
		|| ! hash_equals( $receipt['token'], $params['token'] )
		|| ! hash_equals( $receipt['operation_id'], $params['operation_id'] )
		|| ! hash_equals( $receipt['evidence_sha256'], $params['evidence_sha256'] )
		|| ! hash_equals( $receipt['request_batch_state_sha256'], $params['expected']['batch_state_sha256'] )
		|| ! hash_equals( $receipt['request_batch_revision_sha256'], $params['expected']['batch_revision_sha256'] )
	) {
		return new WP_Error( 'cyprus_content_receipt_mismatch', 'The lifecycle retry does not match the exact terminal receipt.', array( 'status' => 409 ) );
	}

	$pending = justice_ops_cyprus_bridge_pending_evidence();
	if ( is_wp_error( $pending ) ) {
		return $pending;
	}
	if (
		is_array( $pending )
		&& hash_equals( $pending['token'], $receipt['token'] )
		&& hash_equals( $pending['evidence_sha256'], $receipt['evidence_sha256'] )
		&& ! justice_ops_cyprus_bridge_delete_option_value_exact( justice_ops_cyprus_bridge_rollback_name(), $pending )
	) {
		return new WP_Error( 'cyprus_content_receipt_cleanup_failed', 'The terminal outcome is proven, but matching pending evidence could not be consumed.', array( 'status' => 500, 'receipt_sha256' => $receipt['receipt_sha256'] ) );
	}

	$key = 'finalized' === $outcome ? 'finalized' : 'rolled_back';
	justice_ops_cyprus_bridge_purge_urls( $receipt['slugs'] );

	return rest_ensure_response(
		array(
			$key                 => true,
			'replayed'            => true,
			'terminal'            => justice_ops_cyprus_bridge_receipt_summary( $receipt ),
			'evidence_sha256'     => $receipt['evidence_sha256'],
			'evidence_consumed'   => true,
		)
	);
}

/**
 * Restore exact prior content, H1 and metadata for the pending batch.
 */
function justice_ops_cyprus_bridge_rest_rollback( WP_REST_Request $request ) {
	$params = justice_ops_cyprus_bridge_validate_lifecycle_request( $request );
	if ( is_wp_error( $params ) ) {
		return $params;
	}
	$lock_token = justice_ops_cyprus_bridge_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$replay = justice_ops_cyprus_bridge_terminal_replay( $params, 'rolled_back' );
		if ( is_wp_error( $replay ) || is_array( $replay ) ) {
			return $replay;
		}
		$evidence = justice_ops_cyprus_bridge_pending_evidence();
		if ( is_wp_error( $evidence ) ) {
			return $evidence;
		}
		if ( ! is_array( $evidence ) ) {
			return new WP_Error( 'cyprus_content_evidence_missing', 'No pending Cyprus rollback evidence exists.', array( 'status' => 409 ) );
		}
		$identity = justice_ops_cyprus_bridge_lifecycle_identity_matches( $params, $evidence );
		if ( is_wp_error( $identity ) ) {
			return $identity;
		}
		$current = justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], true );
		if ( is_wp_error( $current ) ) {
			return $current;
		}
		if (
			! hash_equals( $params['expected']['batch_state_sha256'], $current['batch_state_sha256'] )
			|| ! hash_equals( $params['expected']['batch_revision_sha256'], $current['batch_revision_sha256'] )
		) {
			return new WP_Error( 'cyprus_content_rollback_state_conflict', 'The current batch changed after rollback preflight.', array( 'status' => 409 ) );
		}

		if ( ! justice_ops_cyprus_bridge_transition_batch( $evidence, 'target', 'prior' ) ) {
			$forward_restored = justice_ops_cyprus_bridge_transition_batch( $evidence, 'prior', 'target' );
			if ( $forward_restored ) {
				justice_ops_cyprus_bridge_purge_urls( $evidence['slugs'] );
			}
			return new WP_Error(
				$forward_restored ? 'cyprus_content_rollback_write_failed' : 'cyprus_content_rollback_recovery_failed',
				$forward_restored ? 'Rollback failed and the accepted forward state was restored.' : 'Rollback and forward-state recovery both failed; evidence remains available.',
				array( 'status' => 500, 'evidence_sha256' => $evidence['evidence_sha256'] )
			);
		}
		$terminal = justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], true );
		if ( is_wp_error( $terminal ) || ! hash_equals( $evidence['prior_batch_state_sha256'], $terminal['batch_state_sha256'] ) ) {
			return new WP_Error( 'cyprus_content_rollback_readback_failed', 'Prior values were written but exact terminal readback failed; evidence remains available.', array( 'status' => 500, 'evidence_sha256' => $evidence['evidence_sha256'] ) );
		}
		$receipt = justice_ops_cyprus_bridge_persist_receipt(
			justice_ops_cyprus_bridge_build_receipt( 'rolled_back', $evidence, $params, $terminal )
		);
		if ( is_wp_error( $receipt ) ) {
			return $receipt;
		}
		if ( ! justice_ops_cyprus_bridge_delete_option_value_exact( justice_ops_cyprus_bridge_rollback_name(), $evidence ) ) {
			return new WP_Error( 'cyprus_content_rollback_cleanup_failed', 'Prior state was restored, but consumed rollback evidence could not be removed.', array( 'status' => 500, 'rolled_back' => true, 'evidence_sha256' => $evidence['evidence_sha256'] ) );
		}
		justice_ops_cyprus_bridge_purge_urls( $evidence['slugs'] );

		return rest_ensure_response(
			array(
				'rolled_back'      => true,
				'replayed'         => false,
				'current'          => justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], false ),
				'terminal'         => justice_ops_cyprus_bridge_receipt_summary( $receipt ),
				'evidence_sha256'  => $evidence['evidence_sha256'],
				'evidence_consumed'=> true,
			)
		);
	} finally {
		justice_ops_cyprus_bridge_release_lock( $lock_token );
	}
}

/**
 * Consume evidence only when the exact target batch remains accepted.
 */
function justice_ops_cyprus_bridge_rest_finalize( WP_REST_Request $request ) {
	$params = justice_ops_cyprus_bridge_validate_lifecycle_request( $request );
	if ( is_wp_error( $params ) ) {
		return $params;
	}
	$lock_token = justice_ops_cyprus_bridge_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$replay = justice_ops_cyprus_bridge_terminal_replay( $params, 'finalized' );
		if ( is_wp_error( $replay ) || is_array( $replay ) ) {
			return $replay;
		}
		$evidence = justice_ops_cyprus_bridge_pending_evidence();
		if ( is_wp_error( $evidence ) ) {
			return $evidence;
		}
		if ( ! is_array( $evidence ) ) {
			return new WP_Error( 'cyprus_content_evidence_missing', 'No pending Cyprus rollback evidence exists.', array( 'status' => 409 ) );
		}
		$identity = justice_ops_cyprus_bridge_lifecycle_identity_matches( $params, $evidence );
		if ( is_wp_error( $identity ) ) {
			return $identity;
		}
		$current = justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], true );
		if ( is_wp_error( $current ) ) {
			return $current;
		}
		if (
			! hash_equals( $params['expected']['batch_state_sha256'], $current['batch_state_sha256'] )
			|| ! hash_equals( $params['expected']['batch_revision_sha256'], $current['batch_revision_sha256'] )
			|| ! hash_equals( $evidence['target_batch_state_sha256'], $current['batch_state_sha256'] )
		) {
			return new WP_Error( 'cyprus_content_finalize_state_conflict', 'The current batch no longer matches the exact accepted target.', array( 'status' => 409 ) );
		}
		$receipt = justice_ops_cyprus_bridge_persist_receipt(
			justice_ops_cyprus_bridge_build_receipt( 'finalized', $evidence, $params, $current )
		);
		if ( is_wp_error( $receipt ) ) {
			return $receipt;
		}
		if ( ! justice_ops_cyprus_bridge_delete_option_value_exact( justice_ops_cyprus_bridge_rollback_name(), $evidence ) ) {
			return new WP_Error( 'cyprus_content_finalize_cleanup_failed', 'Accepted content was unchanged, but rollback evidence could not be finalized.', array( 'status' => 500, 'evidence_sha256' => $evidence['evidence_sha256'] ) );
		}
		justice_ops_cyprus_bridge_purge_urls( $evidence['slugs'] );

		return rest_ensure_response(
			array(
				'finalized'         => true,
				'replayed'          => false,
				'current'           => justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], false ),
				'terminal'          => justice_ops_cyprus_bridge_receipt_summary( $receipt ),
				'evidence_sha256'   => $evidence['evidence_sha256'],
				'evidence_consumed' => true,
			)
		);
	} finally {
		justice_ops_cyprus_bridge_release_lock( $lock_token );
	}
}

add_action(
	'rest_api_init',
	static function (): void {
		$permission = static function (): bool {
			return current_user_can( 'manage_options' );
		};

		register_rest_route(
			'justice-ops/v1',
			'/cyprus-content-release',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => $permission,
					'callback'            => 'justice_ops_cyprus_bridge_rest_get',
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => $permission,
					'callback'            => 'justice_ops_cyprus_bridge_rest_update',
				),
			)
		);
		register_rest_route(
			'justice-ops/v1',
			'/cyprus-content-release-rollback',
			array(
				'methods'             => 'POST',
				'permission_callback' => $permission,
				'callback'            => 'justice_ops_cyprus_bridge_rest_rollback',
			)
		);
		register_rest_route(
			'justice-ops/v1',
			'/cyprus-content-release-finalize',
			array(
				'methods'             => 'POST',
				'permission_callback' => $permission,
				'callback'            => 'justice_ops_cyprus_bridge_rest_finalize',
			)
		);
	}
);
