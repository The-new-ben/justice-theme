<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'OBJECT', 'OBJECT' );
define( 'ARRAY_A', 'ARRAY_A' );

class WP_Post {
	public int $ID;
	public string $post_name;
	public string $post_type;
	public string $post_status;
	public string $post_content;
	public string $post_title;
	public string $post_modified_gmt;

	public function __construct( $id, string $slug = '', string $content = '' ) {
		if ( is_object( $id ) ) {
			$this->ID                = (int) $id->ID;
			$this->post_name         = (string) $id->post_name;
			$this->post_type         = (string) $id->post_type;
			$this->post_status       = (string) $id->post_status;
			$this->post_content      = (string) $id->post_content;
			$this->post_title        = (string) $id->post_title;
			$this->post_modified_gmt = (string) $id->post_modified_gmt;
			return;
		}
		$this->ID                = (int) $id;
		$this->post_name         = $slug;
		$this->post_type         = 'articles';
		$this->post_status       = 'publish';
		$this->post_content      = $content;
		$this->post_title        = 'Old H1 ' . $slug;
		$this->post_modified_gmt = '2026-08-03 10:00:00';
	}
}

class WP_Error {
	private string $code;
	private string $message;
	private array $data;

	public function __construct( string $code, string $message, array $data = array() ) {
		$this->code    = $code;
		$this->message = $message;
		$this->data    = $data;
	}

	public function get_error_code(): string {
		return $this->code;
	}

	public function get_error_message(): string {
		return $this->message;
	}

	public function get_error_data(): array {
		return $this->data;
	}
}

class WP_REST_Request {
	private array $json;
	private array $params;

	public function __construct( array $json = array(), array $params = array() ) {
		$this->json   = $json;
		$this->params = $params;
	}

	public function get_json_params(): array {
		return $this->json;
	}

	public function get_param( string $key ) {
		return $this->params[ $key ] ?? null;
	}
}

$jt_bridge_actions                    = array();
$jt_bridge_routes                     = array();
$jt_bridge_posts                      = array();
$jt_bridge_db_posts                   = array();
$jt_bridge_meta                       = array();
$jt_bridge_meta_cache                 = array();
$jt_bridge_meta_ids                   = array();
$jt_bridge_options                    = array();
$jt_bridge_option_cache               = array();
$jt_bridge_manage_options             = true;
$jt_bridge_edit_posts                 = true;
$jt_bridge_uuid_counter               = 1;
$jt_bridge_modified_counter           = 0;
$jt_bridge_fail_meta_key              = '';
$jt_bridge_meta_write_keys            = array();
$jt_bridge_post_update_keys           = array();
$jt_bridge_evidence_seen_before_write = false;
$jt_bridge_action_log                 = array();
$jt_bridge_atomic_cas_count           = 0;
$jt_bridge_atomic_meta_cas_count      = 0;
$jt_bridge_inject_editor_race_slug    = '';
$jt_bridge_inject_editor_title_slug   = '';
$jt_bridge_inject_meta_delete         = '';
$jt_bridge_fail_option_delete_once    = '';
$jt_bridge_next_meta_id               = 50000;
$jt_bridge_suppress_public_cache_cleanup = false;
$jt_bridge_cleaned_post_ids           = array();
$jt_bridge_evicted_meta_ids           = array();

class JT_Cyprus_Bridge_WPDB {
	public string $options = 'wp_options';
	public string $posts = 'wp_posts';
	public string $postmeta = 'wp_postmeta';
	public int $insert_id = 0;
	/** @var array<int,mixed> */
	public array $prepared_args = array();
	public string $prepared_query = '';

	public function prepare( string $query, ...$args ): string {
		$this->prepared_query = $query;
		$this->prepared_args = $args;
		return $query;
	}

	public function query( string $query ): int {
		global $jt_bridge_options, $jt_bridge_db_posts, $jt_bridge_meta, $jt_bridge_meta_ids, $jt_bridge_atomic_cas_count, $jt_bridge_atomic_meta_cas_count, $jt_bridge_inject_editor_race_slug, $jt_bridge_inject_editor_title_slug, $jt_bridge_inject_meta_delete, $jt_bridge_evidence_seen_before_write, $jt_bridge_fail_option_delete_once, $jt_bridge_fail_meta_key, $jt_bridge_next_meta_id, $jt_bridge_meta_write_keys;
		if ( str_starts_with( ltrim( $this->prepared_query ), 'UPDATE wp_posts' ) ) {
			if ( 11 !== count( $this->prepared_args ) ) {
				return 0;
			}
			list( $target_content, $target_title, $modified_local, $modified_gmt, $post_id, $post_type, $post_status, $slug, $prior_content, $prior_title, $prior_modified_gmt ) = $this->prepared_args;
			$post = $jt_bridge_db_posts[ (string) $slug ] ?? null;
			if ( $post instanceof WP_Post && (string) $slug === $jt_bridge_inject_editor_race_slug ) {
				$post->post_content      = '<p>External editor content</p>';
				$post->post_modified_gmt = '2026-08-03 12:34:56';
				$jt_bridge_inject_editor_race_slug = '';
			}
			if ( $post instanceof WP_Post && (string) $slug === $jt_bridge_inject_editor_title_slug ) {
				$post->post_title        = 'External editor H1';
				$post->post_modified_gmt = '2026-08-03 12:35:56';
				$jt_bridge_inject_editor_title_slug = '';
			}
			if (
				! ( $post instanceof WP_Post )
				|| $post->ID !== (int) $post_id
				|| $post->post_type !== (string) $post_type
				|| $post->post_status !== (string) $post_status
				|| $post->post_name !== (string) $slug
				|| $post->post_content !== (string) $prior_content
				|| $post->post_title !== (string) $prior_title
				|| $post->post_modified_gmt !== (string) $prior_modified_gmt
			) {
				return 0;
			}
			$post->post_content      = (string) $target_content;
			$post->post_title        = (string) $target_title;
			$post->post_modified_gmt = (string) $modified_gmt;
			$jt_bridge_atomic_cas_count++;
			$jt_bridge_evidence_seen_before_write = $jt_bridge_evidence_seen_before_write
				|| array_key_exists( 'justice_ops_cyprus_content_rollback_evidence', $jt_bridge_options );
			return 1;
		}
		if ( str_starts_with( ltrim( $this->prepared_query ), 'INSERT INTO wp_postmeta' ) ) {
			if ( 9 !== count( $this->prepared_args ) ) {
				return 0;
			}
			list( $post_id, $meta_key, $target_value, $identity_id, $post_type, $post_status, $slug, $guard_id, $guard_key ) = $this->prepared_args;
			$post = $jt_bridge_db_posts[ (string) $slug ] ?? null;
			$this->inject_meta_delete_if_requested( (string) $slug, (int) $post_id, (string) $meta_key );
			if ( (string) $meta_key === $jt_bridge_fail_meta_key ) {
				$jt_bridge_fail_meta_key = '';
				return 0;
			}
			if (
				! ( $post instanceof WP_Post )
				|| $post->ID !== (int) $post_id
				|| $post->ID !== (int) $identity_id
				|| $post->ID !== (int) $guard_id
				|| $post->post_type !== (string) $post_type
				|| $post->post_status !== (string) $post_status
				|| $post->post_name !== (string) $slug
				|| (string) $meta_key !== (string) $guard_key
				|| ! empty( $jt_bridge_meta[ $post->ID ][ (string) $meta_key ] )
			) {
				return 0;
			}
			$this->insert_id = $jt_bridge_next_meta_id++;
			$jt_bridge_meta[ $post->ID ][ (string) $meta_key ]     = array( (string) $target_value );
			$jt_bridge_meta_ids[ $post->ID ][ (string) $meta_key ] = array( $this->insert_id );
			$jt_bridge_meta_write_keys[] = (string) $meta_key;
			$jt_bridge_atomic_meta_cas_count++;
			return 1;
		}
		if ( str_starts_with( ltrim( $this->prepared_query ), 'UPDATE wp_postmeta' ) ) {
			if ( 9 !== count( $this->prepared_args ) ) {
				return 0;
			}
			list( $target_value, $meta_id, $post_id, $meta_key, $prior_value, $identity_id, $post_type, $post_status, $slug ) = $this->prepared_args;
			$post = $jt_bridge_db_posts[ (string) $slug ] ?? null;
			$this->inject_meta_delete_if_requested( (string) $slug, (int) $post_id, (string) $meta_key );
			if ( (string) $meta_key === $jt_bridge_fail_meta_key ) {
				$jt_bridge_fail_meta_key = '';
				return 0;
			}
			$rows = $jt_bridge_meta[ (int) $post_id ][ (string) $meta_key ] ?? array();
			$ids  = $jt_bridge_meta_ids[ (int) $post_id ][ (string) $meta_key ] ?? array();
			if (
				! ( $post instanceof WP_Post )
				|| $post->ID !== (int) $post_id
				|| $post->ID !== (int) $identity_id
				|| $post->post_type !== (string) $post_type
				|| $post->post_status !== (string) $post_status
				|| $post->post_name !== (string) $slug
				|| 1 !== count( $rows )
				|| 1 !== count( $ids )
				|| (int) $ids[0] !== (int) $meta_id
				|| (string) $rows[0] !== (string) $prior_value
			) {
				return 0;
			}
			$jt_bridge_meta[ (int) $post_id ][ (string) $meta_key ][0] = (string) $target_value;
			$jt_bridge_meta_write_keys[] = (string) $meta_key;
			$jt_bridge_atomic_meta_cas_count++;
			return 1;
		}
		if ( str_starts_with( ltrim( $this->prepared_query ), 'DELETE FROM wp_postmeta' ) ) {
			if ( 8 !== count( $this->prepared_args ) ) {
				return 0;
			}
			list( $meta_id, $post_id, $meta_key, $prior_value, $identity_id, $post_type, $post_status, $slug ) = $this->prepared_args;
			$post = $jt_bridge_db_posts[ (string) $slug ] ?? null;
			$this->inject_meta_delete_if_requested( (string) $slug, (int) $post_id, (string) $meta_key );
			if ( (string) $meta_key === $jt_bridge_fail_meta_key ) {
				$jt_bridge_fail_meta_key = '';
				return 0;
			}
			$rows = $jt_bridge_meta[ (int) $post_id ][ (string) $meta_key ] ?? array();
			$ids  = $jt_bridge_meta_ids[ (int) $post_id ][ (string) $meta_key ] ?? array();
			if (
				! ( $post instanceof WP_Post )
				|| $post->ID !== (int) $post_id
				|| $post->ID !== (int) $identity_id
				|| $post->post_type !== (string) $post_type
				|| $post->post_status !== (string) $post_status
				|| $post->post_name !== (string) $slug
				|| 1 !== count( $rows )
				|| 1 !== count( $ids )
				|| (int) $ids[0] !== (int) $meta_id
				|| (string) $rows[0] !== (string) $prior_value
			) {
				return 0;
			}
			$jt_bridge_meta[ (int) $post_id ][ (string) $meta_key ]     = array();
			$jt_bridge_meta_ids[ (int) $post_id ][ (string) $meta_key ] = array();
			$jt_bridge_meta_write_keys[] = (string) $meta_key;
			$jt_bridge_atomic_meta_cas_count++;
			return 1;
		}
		if ( 2 !== count( $this->prepared_args ) ) {
			return 0;
		}
		$option_name = (string) $this->prepared_args[0];
		$serialized  = (string) $this->prepared_args[1];
		if ( $option_name === $jt_bridge_fail_option_delete_once ) {
			$jt_bridge_fail_option_delete_once = '';
			return 0;
		}
		if ( ! array_key_exists( $option_name, $jt_bridge_options ) || serialize( $jt_bridge_options[ $option_name ] ) !== $serialized ) {
			return 0;
		}
		unset( $jt_bridge_options[ $option_name ] );
		return 1;
	}

	public function get_results( string $query, $output = OBJECT ): array {
		global $jt_bridge_db_posts, $jt_bridge_meta, $jt_bridge_meta_ids, $jt_bridge_options;
		$prepared = ltrim( $this->prepared_query );
		if ( str_starts_with( $prepared, 'SELECT *' ) && str_contains( $prepared, 'FROM wp_posts' ) ) {
			if ( 2 !== count( $this->prepared_args ) ) {
				return array();
			}
			$slug      = (string) $this->prepared_args[0];
			$post_type = (string) $this->prepared_args[1];
			$post      = $jt_bridge_db_posts[ $slug ] ?? null;
			if ( ! ( $post instanceof WP_Post ) || $post_type !== $post->post_type ) {
				return array();
			}

			return array( (object) get_object_vars( clone $post ) );
		}
		if ( str_starts_with( $prepared, 'SELECT post_content' ) && str_contains( $prepared, 'FROM wp_posts' ) ) {
			if ( 1 !== count( $this->prepared_args ) ) {
				return array();
			}
			$post_id = (int) $this->prepared_args[0];
			foreach ( $jt_bridge_db_posts as $post ) {
				if ( $post instanceof WP_Post && $post_id === $post->ID ) {
					return array(
						array(
							'post_content'      => $post->post_content,
							'post_title'        => $post->post_title,
							'post_modified_gmt' => $post->post_modified_gmt,
							'post_name'         => $post->post_name,
							'post_type'         => $post->post_type,
							'post_status'       => $post->post_status,
						)
					);
				}
			}

			return array();
		}
		if ( str_starts_with( $prepared, 'SELECT option_value' ) && str_contains( $prepared, 'FROM wp_options' ) ) {
			if ( 1 !== count( $this->prepared_args ) ) {
				return array();
			}
			$option_name = (string) $this->prepared_args[0];
			if ( ! array_key_exists( $option_name, $jt_bridge_options ) ) {
				return array();
			}

			return array( array( 'option_value' => serialize( $jt_bridge_options[ $option_name ] ) ) );
		}
		if ( 2 !== count( $this->prepared_args ) ) {
			return array();
		}
		$post_id  = (int) $this->prepared_args[0];
		$meta_key = (string) $this->prepared_args[1];
		$rows     = $jt_bridge_meta[ $post_id ][ $meta_key ] ?? array();
		$ids      = $jt_bridge_meta_ids[ $post_id ][ $meta_key ] ?? array();
		$result   = array();
		foreach ( $rows as $index => $value ) {
			$result[] = array(
				'meta_id'    => $ids[ $index ] ?? 0,
				'meta_value' => (string) $value,
			);
		}
		return array_slice( $result, 0, 2 );
	}

	private function inject_meta_delete_if_requested( string $slug, int $post_id, string $meta_key ): void {
		global $jt_bridge_inject_meta_delete, $jt_bridge_meta, $jt_bridge_meta_ids;
		if ( $slug . '|' . $meta_key !== $jt_bridge_inject_meta_delete ) {
			return;
		}
		$jt_bridge_meta[ $post_id ][ $meta_key ]     = array();
		$jt_bridge_meta_ids[ $post_id ][ $meta_key ] = array();
		$jt_bridge_inject_meta_delete = '';
	}
}

$wpdb = new JT_Cyprus_Bridge_WPDB();

function add_action( string $tag, callable $callback, int $priority = 10, int $accepted_args = 1 ): void {
	global $jt_bridge_actions;
	$jt_bridge_actions[ $tag ][ $priority ][] = $callback;
}

function do_action( string $tag, ...$args ): void {
	global $jt_bridge_actions, $jt_bridge_action_log;
	$jt_bridge_action_log[] = array( $tag, $args );
	if ( ! isset( $jt_bridge_actions[ $tag ] ) ) {
		return;
	}
	ksort( $jt_bridge_actions[ $tag ] );
	foreach ( $jt_bridge_actions[ $tag ] as $callbacks ) {
		foreach ( $callbacks as $callback ) {
			$callback( ...$args );
		}
	}
}

function register_rest_route( string $namespace, string $route, array $definition ): void {
	global $jt_bridge_routes;
	$jt_bridge_routes[ $namespace . $route ] = $definition;
}

function current_user_can( string $capability, ...$args ): bool {
	global $jt_bridge_manage_options, $jt_bridge_edit_posts;
	if ( 'manage_options' === $capability ) {
		return $jt_bridge_manage_options;
	}
	if ( 'edit_post' === $capability ) {
		return $jt_bridge_edit_posts;
	}
	return false;
}

function get_page_by_path( string $slug, $output = OBJECT, $post_type = 'page' ) {
	global $jt_bridge_posts;
	$post = $jt_bridge_posts[ $slug ] ?? null;
	if ( ! ( $post instanceof WP_Post ) ) {
		return null;
	}
	$types = is_array( $post_type ) ? $post_type : array( $post_type );
	return in_array( $post->post_type, $types, true ) ? $post : null;
}

function get_permalink( $post ): string {
	global $jt_bridge_posts;
	if ( is_int( $post ) ) {
		foreach ( $jt_bridge_posts as $candidate ) {
			if ( $candidate->ID === $post ) {
				$post = $candidate;
				break;
			}
		}
	}
	return $post instanceof WP_Post ? 'https://jus-tice.co.il/' . $post->post_name . '/' : '';
}

function get_post_meta( int $post_id, string $key, bool $single = false ) {
	global $jt_bridge_meta_cache;
	$rows = $jt_bridge_meta_cache[ $post_id ][ $key ] ?? array();
	return $single ? ( $rows[0] ?? '' ) : array_values( $rows );
}

function add_post_meta( int $post_id, string $key, $value, bool $unique = false ) {
	global $jt_bridge_meta, $jt_bridge_fail_meta_key, $jt_bridge_meta_write_keys;
	$jt_bridge_meta_write_keys[] = $key;
	if ( $key === $jt_bridge_fail_meta_key ) {
		$jt_bridge_fail_meta_key = '';
		return false;
	}
	$rows = $jt_bridge_meta[ $post_id ][ $key ] ?? array();
	if ( $unique && $rows ) {
		return false;
	}
	$rows[] = (string) wp_unslash( $value );
	$jt_bridge_meta[ $post_id ][ $key ] = $rows;
	return count( $rows );
}

function update_post_meta( int $post_id, string $key, $value, $previous = '' ) {
	global $jt_bridge_meta, $jt_bridge_fail_meta_key, $jt_bridge_meta_write_keys;
	$jt_bridge_meta_write_keys[] = $key;
	if ( $key === $jt_bridge_fail_meta_key ) {
		$jt_bridge_fail_meta_key = '';
		return false;
	}
	$rows = $jt_bridge_meta[ $post_id ][ $key ] ?? array();
	$value = wp_unslash( $value );
	if ( 1 !== count( $rows ) || (string) $previous !== (string) $rows[0] ) {
		return false;
	}
	$jt_bridge_meta[ $post_id ][ $key ][0] = (string) $value;
	return true;
}

function delete_post_meta( int $post_id, string $key, $value = '' ): bool {
	global $jt_bridge_meta, $jt_bridge_fail_meta_key, $jt_bridge_meta_write_keys;
	$jt_bridge_meta_write_keys[] = $key;
	if ( $key === $jt_bridge_fail_meta_key ) {
		$jt_bridge_fail_meta_key = '';
		return false;
	}
	$value = wp_unslash( $value );
	$rows  = $jt_bridge_meta[ $post_id ][ $key ] ?? array();
	if ( 1 !== count( $rows ) || (string) $value !== (string) $rows[0] ) {
		return false;
	}
	$jt_bridge_meta[ $post_id ][ $key ] = array();
	return true;
}

function wp_update_post( array $data, bool $wp_error = false ) {
	global $jt_bridge_posts, $jt_bridge_modified_counter, $jt_bridge_post_update_keys, $jt_bridge_options, $jt_bridge_evidence_seen_before_write;
	$jt_bridge_post_update_keys[] = array_keys( $data );
	$jt_bridge_evidence_seen_before_write = $jt_bridge_evidence_seen_before_write
		|| array_key_exists( 'justice_ops_cyprus_content_rollback_evidence', $jt_bridge_options );
	foreach ( $jt_bridge_posts as $post ) {
		if ( $post->ID === (int) ( $data['ID'] ?? 0 ) ) {
			$post->post_content = (string) $data['post_content'];
			$jt_bridge_modified_counter++;
			$post->post_modified_gmt = sprintf( '2026-08-03 10:%02d:00', $jt_bridge_modified_counter );
			return $post->ID;
		}
	}
	return new WP_Error( 'missing', 'Post missing.' );
}

function wp_slash( $value ) {
	return is_string( $value ) ? addslashes( $value ) : $value;
}

function wp_unslash( $value ) {
	return is_string( $value ) ? stripslashes( $value ) : $value;
}

function clean_post_cache( int $post_id ): void {
	global $jt_bridge_suppress_public_cache_cleanup, $jt_bridge_cleaned_post_ids, $jt_bridge_posts, $jt_bridge_db_posts;
	if ( $jt_bridge_suppress_public_cache_cleanup ) {
		return;
	}
	$jt_bridge_cleaned_post_ids[] = $post_id;
	foreach ( $jt_bridge_db_posts as $slug => $post ) {
		if ( $post instanceof WP_Post && $post_id === $post->ID ) {
			$jt_bridge_posts[ $slug ] = clone $post;
			return;
		}
	}
}

function wp_parse_url( string $url, int $component = -1 ) {
	return parse_url( $url, $component );
}

function wp_json_encode( $value, int $flags = 0 ) {
	return json_encode( $value, $flags );
}

function is_wp_error( $value ): bool {
	return $value instanceof WP_Error;
}

function rest_ensure_response( $value ) {
	return $value;
}

function get_option( string $key, $default = false ) {
	global $jt_bridge_options, $jt_bridge_option_cache;
	if ( array_key_exists( $key, $jt_bridge_option_cache ) ) {
		return $jt_bridge_option_cache[ $key ];
	}
	if ( ! array_key_exists( $key, $jt_bridge_options ) ) {
		return $default;
	}
	$jt_bridge_option_cache[ $key ] = $jt_bridge_options[ $key ];

	return $jt_bridge_options[ $key ];
}

function add_option( string $key, $value, string $deprecated = '', string $autoload = 'yes' ): bool {
	global $jt_bridge_options, $jt_bridge_option_cache;
	if ( array_key_exists( $key, $jt_bridge_options ) ) {
		return false;
	}
	$jt_bridge_options[ $key ]      = $value;
	$jt_bridge_option_cache[ $key ] = $value;
	return true;
}

function delete_option( string $key ): bool {
	global $jt_bridge_options, $jt_bridge_option_cache;
	if ( ! array_key_exists( $key, $jt_bridge_options ) ) {
		return false;
	}
	unset( $jt_bridge_options[ $key ] );
	unset( $jt_bridge_option_cache[ $key ] );
	return true;
}

function maybe_serialize( $value ): string {
	return serialize( $value );
}

function maybe_unserialize( $value ) {
	if ( ! is_string( $value ) ) {
		return $value;
	}
	$unserialized = @unserialize( $value );

	return false === $unserialized && 'b:0;' !== $value ? $value : $unserialized;
}

function wp_cache_delete( string $key, string $group = '' ): bool {
	global $jt_bridge_option_cache, $jt_bridge_suppress_public_cache_cleanup, $jt_bridge_evicted_meta_ids, $jt_bridge_meta_cache, $jt_bridge_meta, $jt_bridge_posts, $jt_bridge_db_posts;
	if ( 'options' === $group ) {
		unset( $jt_bridge_option_cache[ $key ] );
	}
	if ( $jt_bridge_suppress_public_cache_cleanup && in_array( $group, array( 'posts', 'post_meta' ), true ) ) {
		return true;
	}
	if ( 'posts' === $group ) {
		foreach ( $jt_bridge_db_posts as $slug => $post ) {
			if ( $post instanceof WP_Post && (int) $key === $post->ID ) {
				$jt_bridge_posts[ $slug ] = clone $post;
				break;
			}
		}
	}
	if ( 'post_meta' === $group ) {
		$post_id = (int) $key;
		$jt_bridge_evicted_meta_ids[] = $post_id;
		$jt_bridge_meta_cache[ $post_id ] = $jt_bridge_meta[ $post_id ] ?? array();
	}
	return true;
}

function wp_generate_uuid4(): string {
	global $jt_bridge_uuid_counter;
	return sprintf( '00000000-0000-4000-8000-%012d', $jt_bridge_uuid_counter++ );
}

require_once dirname( __DIR__ ) . '/justice-ops/cyprus-content-bridge.php';

function jt_cyprus_bridge_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

function jt_cyprus_bridge_error_code( $value ): string {
	return $value instanceof WP_Error ? $value->get_error_code() : '';
}

/**
 * @param string[] $slugs
 */
function jt_cyprus_bridge_update_request( array $slugs, string $operation_id, string $suffix = 'new' ): WP_REST_Request {
	$batch   = justice_ops_cyprus_bridge_read_batch( $slugs, true );
	$records = array();
	foreach ( $slugs as $slug ) {
		$current = $batch['records'][ $slug ];
		$content = '<section data-release="' . $suffix . '"><h2>' . $slug . '</h2><p>Controlled Cyprus copy.</p></section>';
		$post_title = 'Controlled H1 ' . $slug . ' ' . $suffix;
		$title   = 'SEO title ' . $slug . ' ' . $suffix;
		$desc    = 'SEO description ' . $slug . ' ' . $suffix . ' C:\\Cyprus\\buyer';
		$target  = justice_ops_cyprus_bridge_build_target_state( $content, $post_title, $title, $desc );
		$records[] = array(
			'slug'     => $slug,
			'post_id'  => $current['post_id'],
			'path'     => $current['path'],
			'expected' => array(
				'modified_gmt'             => $current['modified_gmt'],
				'state_sha256'             => $current['state']['state_sha256'],
				'content_sha256'           => $current['state']['content_sha256'],
				'post_title_sha256'        => $current['state']['post_title_sha256'],
				'yoast_title_sha256'       => $current['state']['yoast_title']['sha256'],
				'yoast_description_sha256' => $current['state']['yoast_description']['sha256'],
			),
			'target'   => array(
				'content'                    => $content,
				'post_title'                 => $post_title,
				'yoast_title'                => $title,
				'yoast_description'          => $desc,
				'content_sha256'             => $target['content_sha256'],
				'post_title_sha256'          => $target['post_title_sha256'],
				'yoast_title_sha256'         => $target['yoast_title']['sha256'],
				'yoast_description_sha256'   => $target['yoast_description']['sha256'],
				'state_sha256'               => $target['state_sha256'],
			),
		);
	}

	return new WP_REST_Request(
		array(
			'operation_id' => $operation_id,
			'records'      => $records,
		)
	);
}

function jt_cyprus_bridge_lifecycle_request( array $evidence, array $current ): WP_REST_Request {
	return new WP_REST_Request(
		array(
			'operation_id'   => $evidence['operation_id'],
			'token'          => $evidence['token'],
			'evidence_sha256'=> $evidence['evidence_sha256'],
			'expected'       => array(
				'batch_state_sha256'    => $current['batch_state_sha256'],
				'batch_revision_sha256' => $current['batch_revision_sha256'],
			),
		)
	);
}

$id = 1001;
foreach ( justice_ops_cyprus_bridge_allowlist() as $slug => $path ) {
	$jt_bridge_posts[ $slug ] = new WP_Post( $id, $slug, '<p>Old content ' . $slug . '</p>' );
	$jt_bridge_db_posts[ $slug ] = clone $jt_bridge_posts[ $slug ];
	$jt_bridge_meta[ $id ] = array(
		'_yoast_wpseo_title'    => array( 'Old title ' . $slug ),
		'_yoast_wpseo_metadesc' => array( 'Old description ' . $slug ),
	);
	$jt_bridge_meta_ids[ $id ] = array(
		'_yoast_wpseo_title'    => array( $jt_bridge_next_meta_id++ ),
		'_yoast_wpseo_metadesc' => array( $jt_bridge_next_meta_id++ ),
	);
	$id++;
}
$first_slug = 'cyprus-prices';
$first_id   = $jt_bridge_posts[ $first_slug ]->ID;
$jt_bridge_meta[ $first_id ]['_yoast_wpseo_title']    = array();
$jt_bridge_meta[ $first_id ]['_yoast_wpseo_metadesc'] = array( '' );
$jt_bridge_meta_ids[ $first_id ]['_yoast_wpseo_title'] = array();
$jt_bridge_meta_cache = $jt_bridge_meta;

$allowlist = justice_ops_cyprus_bridge_allowlist();
jt_cyprus_bridge_assert( 8 === count( $allowlist ), 'Bridge allowlist must contain exactly eight Cyprus article URLs.' );
jt_cyprus_bridge_assert( '/cyprus-prices/' === $allowlist['cyprus-prices'], 'Cyprus prices path is missing from the immutable allowlist.' );

do_action( 'rest_api_init' );
jt_cyprus_bridge_assert( isset( $jt_bridge_routes['justice-ops/v1/cyprus-content-release'] ), 'Read/write route was not registered.' );
jt_cyprus_bridge_assert( isset( $jt_bridge_routes['justice-ops/v1/cyprus-content-release-rollback'] ), 'Rollback route was not registered.' );
jt_cyprus_bridge_assert( isset( $jt_bridge_routes['justice-ops/v1/cyprus-content-release-finalize'] ), 'Finalize route was not registered.' );
$permission = $jt_bridge_routes['justice-ops/v1/cyprus-content-release'][0]['permission_callback'];
$jt_bridge_manage_options = false;
jt_cyprus_bridge_assert( false === $permission(), 'REST bridge did not require manage_options.' );
$jt_bridge_manage_options = true;

$preflight = justice_ops_cyprus_bridge_rest_get( new WP_REST_Request( array(), array( 'slug' => $first_slug, 'include_content' => '1' ) ) );
jt_cyprus_bridge_assert( isset( $preflight['current']['records'][ $first_slug ]['state']['content'] ), 'Authenticated preflight did not return requested content.' );
jt_cyprus_bridge_assert( null === $preflight['rollback'], 'Fresh preflight unexpectedly reported rollback evidence.' );

$original_first = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $first_slug ] );
$first_type     = $jt_bridge_db_posts[ $first_slug ]->post_type;
$first_status   = $jt_bridge_db_posts[ $first_slug ]->post_status;
$first_name     = $jt_bridge_db_posts[ $first_slug ]->post_name;
$first_url      = get_permalink( $jt_bridge_posts[ $first_slug ] );
$request_one    = jt_cyprus_bridge_update_request( array( $first_slug ), '11111111-1111-4111-8111-111111111111', 'canary' );
$jt_bridge_suppress_public_cache_cleanup = true;
$result_one     = justice_ops_cyprus_bridge_rest_update( $request_one );
$jt_bridge_suppress_public_cache_cleanup = false;
jt_cyprus_bridge_assert( is_array( $result_one ) && true === $result_one['updated'], 'One-record canary did not complete.' );
$request_one_json = $request_one->get_json_params();
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['yoast_description'] === $jt_bridge_meta[ $first_id ]['_yoast_wpseo_metadesc'][0], 'Yoast metadata backslashes were not preserved byte-for-byte.' );
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['post_title'] === $jt_bridge_db_posts[ $first_slug ]->post_title, 'Atomic post-table CAS did not write the exact H1/post_title.' );
jt_cyprus_bridge_assert( $original_first['content'] === $jt_bridge_posts[ $first_slug ]->post_content, 'The simulated persistent WP_Post cache did not remain stale after the SQL commit.' );
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['content'] === $jt_bridge_db_posts[ $first_slug ]->post_content, 'The database row did not retain the accepted target while WP_Post cache remained stale.' );
jt_cyprus_bridge_assert( '' === get_post_meta( $first_id, '_yoast_wpseo_metadesc', true ), 'The simulated metadata cache did not remain stale after the SQL commit.' );
$fresh_after_commit = justice_ops_cyprus_bridge_rest_get( new WP_REST_Request( array(), array( 'slug' => $first_slug, 'include_content' => '1' ) ) );
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['content'] === $fresh_after_commit['current']['records'][ $first_slug ]['state']['content'], 'Preflight trusted stale WP_Post cache after a committed SQL write.' );
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['yoast_description'] === $fresh_after_commit['current']['records'][ $first_slug ]['state']['yoast_description']['value'], 'Preflight trusted stale metadata cache after a committed SQL write.' );
jt_cyprus_bridge_assert( $jt_bridge_evidence_seen_before_write, 'Durable evidence was not present before the first post write.' );
jt_cyprus_bridge_assert( $first_type === $jt_bridge_db_posts[ $first_slug ]->post_type, 'Post type changed during content release.' );
jt_cyprus_bridge_assert( $first_status === $jt_bridge_db_posts[ $first_slug ]->post_status, 'Post status changed during content release.' );
jt_cyprus_bridge_assert( $first_name === $jt_bridge_db_posts[ $first_slug ]->post_name, 'Post slug changed during content release.' );
jt_cyprus_bridge_assert( $first_url === get_permalink( $jt_bridge_posts[ $first_slug ] ), 'Public URL changed during content release.' );
jt_cyprus_bridge_assert( $jt_bridge_atomic_cas_count > 0, 'Content was not written through the atomic SQL compare-and-swap.' );
jt_cyprus_bridge_assert( $jt_bridge_atomic_meta_cas_count > 0, 'Yoast metadata was not written through atomic SQL compare-and-swap.' );
jt_cyprus_bridge_assert( array() === $jt_bridge_post_update_keys, 'Bridge fell back to non-atomic wp_update_post.' );
jt_cyprus_bridge_assert( array() === array_diff( array_unique( $jt_bridge_meta_write_keys ), array( '_yoast_wpseo_title', '_yoast_wpseo_metadesc' ) ), 'A metadata key outside the two approved Yoast fields was written.' );

$evidence = justice_ops_cyprus_bridge_pending_evidence();
jt_cyprus_bridge_assert( is_array( $evidence ), 'Successful canary did not retain durable rollback evidence.' );
jt_cyprus_bridge_assert( ! is_wp_error( justice_ops_cyprus_bridge_validate_evidence( $evidence ) ), 'Stored rollback evidence did not validate.' );
$purges = array_values( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => 'litespeed_purge_url' === $entry[0] ) );
jt_cyprus_bridge_assert( 1 === count( $purges ) && $first_url === $purges[0][1][0], 'Canary did not purge only its exact accepted URL.' );
jt_cyprus_bridge_assert( 0 === count( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => in_array( $entry[0], array( 'litespeed_purge_all', 'litespeed_purge_all_object' ), true ) ) ), 'A global cache purge was requested.' );

$pending_preflight = justice_ops_cyprus_bridge_rest_get( new WP_REST_Request( array(), array( 'slug' => $first_slug ) ) );
jt_cyprus_bridge_assert( is_array( $pending_preflight['rollback'] ), 'Preflight did not expose safe rollback identity.' );
jt_cyprus_bridge_assert( false === strpos( serialize( $pending_preflight['rollback'] ), 'Old content' ), 'Preflight leaked prior article content in rollback summary.' );

$idempotent = justice_ops_cyprus_bridge_rest_update( $request_one );
jt_cyprus_bridge_assert( is_array( $idempotent ) && true === $idempotent['idempotent'] && false === $idempotent['updated'], 'Exact operation replay was not idempotent.' );
$idempotent_purges = array_values( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => 'litespeed_purge_url' === $entry[0] ) );
jt_cyprus_bridge_assert( 2 === count( $idempotent_purges ) && $first_url === $idempotent_purges[1][1][0], 'Accepted-target idempotent replay did not complete its exact URL purge.' );
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['content'] === $jt_bridge_posts[ $first_slug ]->post_content, 'Accepted-target replay did not converge stale public WP_Post cache.' );
jt_cyprus_bridge_assert( $request_one_json['records'][0]['target']['yoast_description'] === get_post_meta( $first_id, '_yoast_wpseo_metadesc', true ), 'Accepted-target replay did not converge stale public metadata cache.' );
jt_cyprus_bridge_assert( in_array( $first_id, $jt_bridge_cleaned_post_ids, true ) && in_array( $first_id, $jt_bridge_evicted_meta_ids, true ), 'Accepted-target replay did not explicitly evict both public cache layers.' );

$blocked_request = jt_cyprus_bridge_update_request( array( 'about-cyprus' ), '22222222-2222-4222-8222-222222222222', 'blocked' );
$blocked         = justice_ops_cyprus_bridge_rest_update( $blocked_request );
jt_cyprus_bridge_assert( 'cyprus_content_rollback_pending' === jt_cyprus_bridge_error_code( $blocked ), 'Pending evidence did not block another operation.' );

$current_one          = justice_ops_cyprus_bridge_read_batch( $evidence['slugs'], true );
$jt_bridge_action_log = array();
$rollback_request     = jt_cyprus_bridge_lifecycle_request( $evidence, $current_one );
$rolled_back          = justice_ops_cyprus_bridge_rest_rollback( $rollback_request );
jt_cyprus_bridge_assert( is_array( $rolled_back ) && true === $rolled_back['rolled_back'], 'Exact canary rollback failed.' );
$restored_first = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $first_slug ] );
jt_cyprus_bridge_assert( hash_equals( $original_first['state_sha256'], $restored_first['state_sha256'] ), 'Rollback did not restore exact prior content and metadata.' );
jt_cyprus_bridge_assert( false === $restored_first['yoast_title']['exists'], 'Rollback did not restore an absent Yoast title row.' );
jt_cyprus_bridge_assert( true === $restored_first['yoast_description']['exists'] && '' === $restored_first['yoast_description']['value'], 'Rollback did not preserve an existing empty Yoast description row.' );
$jt_bridge_option_cache[ justice_ops_cyprus_bridge_rollback_name() ] = $evidence;
jt_cyprus_bridge_assert( is_array( get_option( justice_ops_cyprus_bridge_rollback_name(), null ) ), 'The test did not reproduce stale option cache after evidence deletion committed.' );
jt_cyprus_bridge_assert( null === justice_ops_cyprus_bridge_pending_evidence(), 'Fresh lifecycle read trusted stale rollback evidence after its database row was deleted.' );
jt_cyprus_bridge_assert( null === get_option( justice_ops_cyprus_bridge_rollback_name(), null ), 'Fresh lifecycle read did not evict stale rollback-evidence cache.' );
$rollback_purges = array_values( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => 'litespeed_purge_url' === $entry[0] ) );
jt_cyprus_bridge_assert( 1 === count( $rollback_purges ) && $first_url === $rollback_purges[0][1][0], 'Rollback did not purge only the restored URL.' );
$jt_bridge_posts[ $first_slug ]->post_content = $request_one_json['records'][0]['target']['content'];
$jt_bridge_posts[ $first_slug ]->post_title   = $request_one_json['records'][0]['target']['post_title'];
$jt_bridge_meta_cache[ $first_id ]['_yoast_wpseo_title']    = array( $request_one_json['records'][0]['target']['yoast_title'] );
$jt_bridge_meta_cache[ $first_id ]['_yoast_wpseo_metadesc'] = array( $request_one_json['records'][0]['target']['yoast_description'] );
$jt_bridge_option_cache[ justice_ops_cyprus_bridge_receipt_name( $evidence['token'] ) ] = array( 'invalid' => 'stale terminal receipt' );
$rollback_replay = justice_ops_cyprus_bridge_rest_rollback( $rollback_request );
jt_cyprus_bridge_assert( is_array( $rollback_replay ) && true === $rollback_replay['rolled_back'] && true === $rollback_replay['replayed'], 'Lost-response rollback retry was not proven by a terminal receipt.' );
jt_cyprus_bridge_assert( ! is_wp_error( justice_ops_cyprus_bridge_validate_receipt( $rollback_replay['terminal'] ) ), 'Rollback terminal receipt failed validation.' );
jt_cyprus_bridge_assert( $original_first['content'] === $jt_bridge_posts[ $first_slug ]->post_content, 'Rollback terminal replay did not converge stale public WP_Post cache.' );
jt_cyprus_bridge_assert( '' === get_post_meta( $first_id, '_yoast_wpseo_metadesc', true ), 'Rollback terminal replay did not converge stale public metadata cache.' );

$second_slug    = 'about-cyprus';
$second_id      = $jt_bridge_db_posts[ $second_slug ]->ID;
$second_cache_prior = clone $jt_bridge_posts[ $second_slug ];
$second_meta_prior  = $jt_bridge_meta_cache[ $second_id ];
$request_two    = jt_cyprus_bridge_update_request( array( $second_slug ), '33333333-3333-4333-8333-333333333333', 'final' );
$jt_bridge_suppress_public_cache_cleanup = true;
$result_two     = justice_ops_cyprus_bridge_rest_update( $request_two );
$jt_bridge_suppress_public_cache_cleanup = false;
jt_cyprus_bridge_assert( is_array( $result_two ) && true === $result_two['updated'], 'Finalize scenario forward write failed.' );
$request_two_json = $request_two->get_json_params();
jt_cyprus_bridge_assert( $second_cache_prior->post_content === $jt_bridge_posts[ $second_slug ]->post_content, 'Finalize scenario did not reproduce stale WP_Post cache before acceptance.' );
jt_cyprus_bridge_assert( $second_meta_prior['_yoast_wpseo_metadesc'][0] === get_post_meta( $second_id, '_yoast_wpseo_metadesc', true ), 'Finalize scenario did not reproduce stale metadata cache before acceptance.' );
$evidence_two   = justice_ops_cyprus_bridge_pending_evidence();
$target_two     = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $second_slug ] );
$current_two    = justice_ops_cyprus_bridge_read_batch( $evidence_two['slugs'], true );
$jt_bridge_action_log = array();
$finalize_request = jt_cyprus_bridge_lifecycle_request( $evidence_two, $current_two );
$finalized      = justice_ops_cyprus_bridge_rest_finalize( $finalize_request );
jt_cyprus_bridge_assert( is_array( $finalized ) && true === $finalized['finalized'], 'Exact target finalization failed.' );
jt_cyprus_bridge_assert( hash_equals( $target_two['state_sha256'], justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $second_slug ] )['state_sha256'] ), 'Finalize mutated accepted target content.' );
jt_cyprus_bridge_assert( null === get_option( justice_ops_cyprus_bridge_rollback_name(), null ), 'Finalize did not consume rollback evidence.' );
$finalize_purges = array_values( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => 'litespeed_purge_url' === $entry[0] ) );
jt_cyprus_bridge_assert( 1 === count( $finalize_purges ) && get_permalink( $jt_bridge_posts[ $second_slug ] ) === $finalize_purges[0][1][0], 'Finalize did not purge only its exact accepted URL.' );
jt_cyprus_bridge_assert( $request_two_json['records'][0]['target']['content'] === $jt_bridge_posts[ $second_slug ]->post_content, 'Finalize did not converge stale public WP_Post cache.' );
jt_cyprus_bridge_assert( $request_two_json['records'][0]['target']['yoast_description'] === get_post_meta( $second_id, '_yoast_wpseo_metadesc', true ), 'Finalize did not converge stale public metadata cache.' );
$jt_bridge_posts[ $second_slug ] = clone $second_cache_prior;
$jt_bridge_meta_cache[ $second_id ] = $second_meta_prior;
$jt_bridge_action_log = array();
$finalize_replay = justice_ops_cyprus_bridge_rest_finalize( $finalize_request );
jt_cyprus_bridge_assert( is_array( $finalize_replay ) && true === $finalize_replay['finalized'] && true === $finalize_replay['replayed'], 'Lost-response finalize retry was not proven by a terminal receipt.' );
jt_cyprus_bridge_assert( ! is_wp_error( justice_ops_cyprus_bridge_validate_receipt( $finalize_replay['terminal'] ) ), 'Finalize terminal receipt failed validation.' );
jt_cyprus_bridge_assert( $request_two_json['records'][0]['target']['content'] === $jt_bridge_posts[ $second_slug ]->post_content, 'Finalize terminal replay did not converge stale public WP_Post cache.' );
jt_cyprus_bridge_assert( $request_two_json['records'][0]['target']['yoast_description'] === get_post_meta( $second_id, '_yoast_wpseo_metadesc', true ), 'Finalize terminal replay did not converge stale public metadata cache.' );
$finalize_replay_purges = array_values( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => 'litespeed_purge_url' === $entry[0] ) );
jt_cyprus_bridge_assert( 1 === count( $finalize_replay_purges ) && get_permalink( $jt_bridge_posts[ $second_slug ] ) === $finalize_replay_purges[0][1][0], 'Finalize terminal replay did not purge only its exact accepted URL.' );

$receipt_slug     = 'buy-real-estate-cyprus';
$receipt_request  = jt_cyprus_bridge_update_request( array( $receipt_slug ), 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'receipt-cleanup' );
$receipt_forward  = justice_ops_cyprus_bridge_rest_update( $receipt_request );
jt_cyprus_bridge_assert( is_array( $receipt_forward ) && true === $receipt_forward['updated'], 'Terminal-receipt cleanup setup write failed.' );
$receipt_evidence = justice_ops_cyprus_bridge_pending_evidence();
$receipt_current  = justice_ops_cyprus_bridge_read_batch( $receipt_evidence['slugs'], true );
$receipt_lifecycle = jt_cyprus_bridge_lifecycle_request( $receipt_evidence, $receipt_current );
$jt_bridge_fail_option_delete_once = justice_ops_cyprus_bridge_rollback_name();
$cleanup_failure = justice_ops_cyprus_bridge_rest_finalize( $receipt_lifecycle );
jt_cyprus_bridge_assert( 'cyprus_content_finalize_cleanup_failed' === jt_cyprus_bridge_error_code( $cleanup_failure ), 'Injected evidence cleanup failure was not surfaced.' );
jt_cyprus_bridge_assert( is_array( justice_ops_cyprus_bridge_terminal_receipt( $receipt_evidence['token'] ) ), 'Terminal receipt was not durable before evidence consumption.' );
jt_cyprus_bridge_assert( is_array( justice_ops_cyprus_bridge_pending_evidence() ), 'Injected cleanup failure unexpectedly lost rollback evidence.' );
$cleanup_replay = justice_ops_cyprus_bridge_rest_finalize( $receipt_lifecycle );
jt_cyprus_bridge_assert( is_array( $cleanup_replay ) && true === $cleanup_replay['replayed'], 'Terminal retry did not finish exact evidence cleanup.' );
jt_cyprus_bridge_assert( null === justice_ops_cyprus_bridge_pending_evidence(), 'Terminal replay left matching evidence behind.' );

$third_slug   = 'cyprus-lawyer';
$stale        = jt_cyprus_bridge_update_request( array( $third_slug ), '44444444-4444-4444-8444-444444444444', 'stale' );
$before_stale = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $third_slug ] );
$jt_bridge_db_posts[ $third_slug ]->post_modified_gmt = '2026-08-03 11:59:59';
$stale_result = justice_ops_cyprus_bridge_rest_update( $stale );
jt_cyprus_bridge_assert( 'cyprus_content_state_conflict' === jt_cyprus_bridge_error_code( $stale_result ), 'Stale modified/hash CAS was not rejected.' );
jt_cyprus_bridge_assert( hash_equals( $before_stale['state_sha256'], justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $third_slug ] )['state_sha256'] ), 'Stale request changed controlled state.' );

$bad_hash_request = jt_cyprus_bridge_update_request( array( 'cyprus-corporate-tax' ), '55555555-5555-4555-8555-555555555555', 'bad-hash' );
$bad_json = $bad_hash_request->get_json_params();
$bad_json['records'][0]['target']['content_sha256'] = str_repeat( '0', 64 );
$bad_hash = justice_ops_cyprus_bridge_rest_update( new WP_REST_Request( $bad_json ) );
jt_cyprus_bridge_assert( 'cyprus_content_target_hash_mismatch' === jt_cyprus_bridge_error_code( $bad_hash ), 'Mismatched target digest was accepted.' );

$duplicate_request = jt_cyprus_bridge_update_request( array( 'buy-real-estate-cyprus' ), '66666666-6666-4666-8666-666666666666', 'duplicate' );
$duplicate_json = $duplicate_request->get_json_params();
$duplicate_json['records'][] = $duplicate_json['records'][0];
$duplicate = justice_ops_cyprus_bridge_rest_update( new WP_REST_Request( $duplicate_json ) );
jt_cyprus_bridge_assert( 'cyprus_content_record_invalid' === jt_cyprus_bridge_error_code( $duplicate ), 'Duplicate allowlisted record was accepted.' );

$invalid_slug_json = $duplicate_request->get_json_params();
$invalid_slug_json['records'][0]['slug'] = 'not-allowed';
$invalid_slug_json['records'][0]['path'] = '/not-allowed/';
$invalid_slug = justice_ops_cyprus_bridge_rest_update( new WP_REST_Request( $invalid_slug_json ) );
jt_cyprus_bridge_assert( 'cyprus_content_record_invalid' === jt_cyprus_bridge_error_code( $invalid_slug ), 'Non-allowlisted slug was accepted.' );

$draft_slug    = 'real-estate-market-greece-cyprus';
$draft_request = jt_cyprus_bridge_update_request( array( $draft_slug ), '77777777-7777-4777-8777-777777777777', 'draft' );
$jt_bridge_db_posts[ $draft_slug ]->post_status = 'draft';
$draft_result = justice_ops_cyprus_bridge_rest_update( $draft_request );
jt_cyprus_bridge_assert( 'cyprus_content_identity_mismatch' === jt_cyprus_bridge_error_code( $draft_result ), 'Non-published article was not rejected.' );
$jt_bridge_db_posts[ $draft_slug ]->post_status = 'publish';

$failure_slug  = 'avoiding-mistakes-when-buying-property-in-cyprus';
$failure_prior = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $failure_slug ] );
$failure       = jt_cyprus_bridge_update_request( array( $failure_slug ), '88888888-8888-4888-8888-888888888888', 'fail-meta' );
$jt_bridge_fail_meta_key = '_yoast_wpseo_title';
$failure_result = justice_ops_cyprus_bridge_rest_update( $failure );
jt_cyprus_bridge_assert( 'cyprus_content_write_failed' === jt_cyprus_bridge_error_code( $failure_result ), 'Injected Yoast failure did not trigger compensating rollback.' );
$failure_after = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $failure_slug ] );
jt_cyprus_bridge_assert( hash_equals( $failure_prior['state_sha256'], $failure_after['state_sha256'] ), 'Compensating rollback did not restore exact prior state.' );
jt_cyprus_bridge_assert( null === get_option( justice_ops_cyprus_bridge_rollback_name(), null ), 'Successful compensation left dangling evidence.' );

$recovery_slug    = 'cyprus-corporate-tax';
$recovery_request = jt_cyprus_bridge_update_request( array( $recovery_slug ), 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'rollback-recovery' );
$recovery_forward = justice_ops_cyprus_bridge_rest_update( $recovery_request );
jt_cyprus_bridge_assert( is_array( $recovery_forward ) && true === $recovery_forward['updated'], 'Rollback-recovery setup write failed.' );
$recovery_evidence = justice_ops_cyprus_bridge_pending_evidence();
$recovery_current  = justice_ops_cyprus_bridge_read_batch( $recovery_evidence['slugs'], true );
$recovery_lifecycle = jt_cyprus_bridge_lifecycle_request( $recovery_evidence, $recovery_current );
$jt_bridge_fail_meta_key = '_yoast_wpseo_title';
$jt_bridge_action_log    = array();
$recovery_failure = justice_ops_cyprus_bridge_rest_rollback( $recovery_lifecycle );
jt_cyprus_bridge_assert( 'cyprus_content_rollback_write_failed' === jt_cyprus_bridge_error_code( $recovery_failure ), 'Injected rollback failure did not restore the exact forward state.' );
$recovery_purges = array_values( array_filter( $jt_bridge_action_log, static fn( array $entry ): bool => 'litespeed_purge_url' === $entry[0] ) );
jt_cyprus_bridge_assert( 1 === count( $recovery_purges ) && get_permalink( $jt_bridge_posts[ $recovery_slug ] ) === $recovery_purges[0][1][0], 'Successful forward recovery did not purge only its restored target URL.' );
$recovery_evidence = justice_ops_cyprus_bridge_pending_evidence();
$recovery_current  = justice_ops_cyprus_bridge_read_batch( $recovery_evidence['slugs'], true );
$recovery_cleanup  = justice_ops_cyprus_bridge_rest_rollback( jt_cyprus_bridge_lifecycle_request( $recovery_evidence, $recovery_current ) );
jt_cyprus_bridge_assert( is_array( $recovery_cleanup ) && true === $recovery_cleanup['rolled_back'], 'Recovery scenario could not subsequently restore its prior state.' );

$lock_slug    = 'real-estate-market-review-cyprus-guide-israelis-2025';
$lock_request = jt_cyprus_bridge_update_request( array( $lock_slug ), '99999999-9999-4999-8999-999999999999', 'locked' );
$jt_bridge_options[ justice_ops_cyprus_bridge_lock_name() ] = array( 'token' => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'expires_at' => time() + 300 );
$locked = justice_ops_cyprus_bridge_rest_update( $lock_request );
jt_cyprus_bridge_assert( 'cyprus_content_locked' === jt_cyprus_bridge_error_code( $locked ), 'Active global lock did not block a concurrent write.' );
unset( $jt_bridge_options[ justice_ops_cyprus_bridge_lock_name() ] );
$stale_lock = array( 'token' => 'abababab-abab-4bab-8bab-abababababab', 'expires_at' => time() + 300 );
$jt_bridge_option_cache[ justice_ops_cyprus_bridge_lock_name() ] = $stale_lock;
jt_cyprus_bridge_assert( $stale_lock === get_option( justice_ops_cyprus_bridge_lock_name(), null ), 'The test did not reproduce a stale persistent lock cache entry.' );
$recovered_lock = justice_ops_cyprus_bridge_acquire_lock();
jt_cyprus_bridge_assert( is_string( $recovered_lock ), 'A stale cached lock blocked acquisition after the database lock row was absent.' );
justice_ops_cyprus_bridge_release_lock( $recovered_lock );
jt_cyprus_bridge_assert( ! array_key_exists( justice_ops_cyprus_bridge_lock_name(), $jt_bridge_options ), 'Recovered lock was not released from the database.' );
$changed_lock = array( 'token' => 'cdcdcdcd-cdcd-4dcd-8dcd-cdcdcdcdcdcd', 'expires_at' => time() + 300 );
$jt_bridge_options[ justice_ops_cyprus_bridge_lock_name() ] = $changed_lock;
$jt_bridge_option_cache[ justice_ops_cyprus_bridge_lock_name() ] = $stale_lock;
jt_cyprus_bridge_assert( false === justice_ops_cyprus_bridge_delete_option_value_exact( justice_ops_cyprus_bridge_lock_name(), $stale_lock ), 'Exact option deletion accepted a changed database value.' );
jt_cyprus_bridge_assert( $changed_lock === $jt_bridge_options[ justice_ops_cyprus_bridge_lock_name() ], 'Exact option deletion removed a changed lock value.' );
unset( $jt_bridge_options[ justice_ops_cyprus_bridge_lock_name() ], $jt_bridge_option_cache[ justice_ops_cyprus_bridge_lock_name() ] );

$race_slug    = 'real-estate-market-review-cyprus-guide-israelis-2025';
$race_request = jt_cyprus_bridge_update_request( array( $race_slug ), 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'editor-race' );
$jt_bridge_inject_editor_race_slug = $race_slug;
$race_result = justice_ops_cyprus_bridge_rest_update( $race_request );
jt_cyprus_bridge_assert( 'cyprus_content_compensation_failed' === jt_cyprus_bridge_error_code( $race_result ), 'Ordinary-editor race did not fail the atomic CAS closed.' );
jt_cyprus_bridge_assert( '<p>External editor content</p>' === $jt_bridge_db_posts[ $race_slug ]->post_content, 'Atomic CAS overwrote ordinary-editor content.' );
jt_cyprus_bridge_assert( is_array( justice_ops_cyprus_bridge_pending_evidence() ), 'Race conflict did not retain exact recovery evidence.' );

$race_evidence = justice_ops_cyprus_bridge_pending_evidence();
$jt_bridge_db_posts[ $race_slug ]->post_content      = $race_evidence['records'][ $race_slug ]['prior']['content'];
$jt_bridge_db_posts[ $race_slug ]->post_title        = $race_evidence['records'][ $race_slug ]['prior']['post_title'];
$jt_bridge_db_posts[ $race_slug ]->post_modified_gmt = '2026-08-03 12:40:00';
$race_current = justice_ops_cyprus_bridge_read_batch( $race_evidence['slugs'], true );
$race_cleanup = justice_ops_cyprus_bridge_rest_rollback( jt_cyprus_bridge_lifecycle_request( $race_evidence, $race_current ) );
jt_cyprus_bridge_assert( is_array( $race_cleanup ) && true === $race_cleanup['rolled_back'], 'Human-resolved content race evidence could not be consumed.' );

$title_race_slug    = 'real-estate-market-greece-cyprus';
$title_race_request = jt_cyprus_bridge_update_request( array( $title_race_slug ), 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'title-race' );
$title_race_prior   = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $title_race_slug ] );
$jt_bridge_inject_editor_title_slug = $title_race_slug;
$title_race_result = justice_ops_cyprus_bridge_rest_update( $title_race_request );
jt_cyprus_bridge_assert( 'cyprus_content_compensation_failed' === jt_cyprus_bridge_error_code( $title_race_result ), 'Ordinary-editor H1 race did not fail the joint post-table CAS closed.' );
jt_cyprus_bridge_assert( 'External editor H1' === $jt_bridge_db_posts[ $title_race_slug ]->post_title, 'Joint CAS overwrote an ordinary-editor H1.' );
jt_cyprus_bridge_assert( $title_race_prior['content'] === $jt_bridge_db_posts[ $title_race_slug ]->post_content, 'H1 race unexpectedly changed article content.' );
$title_race_evidence = justice_ops_cyprus_bridge_pending_evidence();
$jt_bridge_db_posts[ $title_race_slug ]->post_title        = $title_race_evidence['records'][ $title_race_slug ]['prior']['post_title'];
$jt_bridge_db_posts[ $title_race_slug ]->post_modified_gmt = '2026-08-03 12:41:00';
$title_race_current = justice_ops_cyprus_bridge_read_batch( $title_race_evidence['slugs'], true );
$title_race_cleanup = justice_ops_cyprus_bridge_rest_rollback( jt_cyprus_bridge_lifecycle_request( $title_race_evidence, $title_race_current ) );
jt_cyprus_bridge_assert( is_array( $title_race_cleanup ) && true === $title_race_cleanup['rolled_back'], 'Human-resolved H1 race evidence could not be consumed.' );

$meta_race_slug    = 'cyprus-lawyer';
$meta_race_request = jt_cyprus_bridge_update_request( array( $meta_race_slug ), 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'meta-delete-race' );
$meta_race_prior   = justice_ops_cyprus_bridge_read_state( $jt_bridge_db_posts[ $meta_race_slug ] );
$jt_bridge_inject_meta_delete = $meta_race_slug . '|_yoast_wpseo_title';
$meta_race_result = justice_ops_cyprus_bridge_rest_update( $meta_race_request );
jt_cyprus_bridge_assert( 'cyprus_content_compensation_failed' === jt_cyprus_bridge_error_code( $meta_race_result ), 'External Yoast deletion race did not fail atomic metadata CAS closed.' );
jt_cyprus_bridge_assert( array() === $jt_bridge_meta[ $jt_bridge_posts[ $meta_race_slug ]->ID ]['_yoast_wpseo_title'], 'Atomic metadata CAS overwrote an external editor deletion.' );
jt_cyprus_bridge_assert( $meta_race_prior['content'] === $jt_bridge_db_posts[ $meta_race_slug ]->post_content, 'Metadata race did not compensate the controlled post content.' );
jt_cyprus_bridge_assert( $meta_race_prior['post_title'] === $jt_bridge_db_posts[ $meta_race_slug ]->post_title, 'Metadata race did not compensate the controlled H1.' );
jt_cyprus_bridge_assert( is_array( justice_ops_cyprus_bridge_pending_evidence() ), 'External metadata race did not retain recovery evidence.' );

echo "cyprus content bridge tests passed\n";
