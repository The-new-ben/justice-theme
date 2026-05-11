<?php
/**
 * Read-only diagnostics for controlled deployment checks.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register admin-only diagnostic REST routes.
 */
function justice_theme_register_diagnostic_routes(): void {
	register_rest_route(
		'justice-theme/v1',
		'/active-plugin-manifest',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'justice_theme_active_plugin_manifest_callback',
			'permission_callback' => 'justice_theme_diagnostics_permission_callback',
			'args'                => array(
				'plugin' => array(
					'description'       => 'Active plugin file, for example ultra-justice-engine/ultra-justice-engine.php.',
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_diagnostic_routes' );

/**
 * Restrict diagnostics to administrators.
 *
 * @return bool
 */
function justice_theme_diagnostics_permission_callback(): bool {
	return current_user_can( 'manage_options' );
}

/**
 * Return a read-only file manifest for one active plugin.
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error
 */
function justice_theme_active_plugin_manifest_callback( WP_REST_Request $request ) {
	if ( ! defined( 'WP_PLUGIN_DIR' ) ) {
		return new WP_Error(
			'justice_theme_plugin_dir_missing',
			'Plugin directory is unavailable.',
			array( 'status' => 500 )
		);
	}

	$requested_plugin = (string) $request->get_param( 'plugin' );
	$plugin_file      = '' !== $requested_plugin ? $requested_plugin : 'ultra-justice-engine/ultra-justice-engine.php';
	$plugin_file      = ltrim( str_replace( '\\', '/', $plugin_file ), '/' );
	$active_plugins   = justice_theme_get_active_plugin_files();

	if ( ! in_array( $plugin_file, $active_plugins, true ) ) {
		return new WP_Error(
			'justice_theme_plugin_not_active',
			'Requested plugin is not active.',
			array(
				'status'           => 404,
				'requested_plugin' => $plugin_file,
			)
		);
	}

	$plugin_root = realpath( WP_PLUGIN_DIR );
	$main_file   = realpath( trailingslashit( WP_PLUGIN_DIR ) . $plugin_file );

	if ( ! $plugin_root || ! $main_file || ! is_file( $main_file ) ) {
		return new WP_Error(
			'justice_theme_plugin_file_missing',
			'Requested plugin file is missing.',
			array(
				'status'           => 404,
				'requested_plugin' => $plugin_file,
			)
		);
	}

	$plugin_dir             = dirname( $main_file );
	$plugin_root_normalized = trailingslashit( wp_normalize_path( $plugin_root ) );
	$plugin_dir_normalized  = trailingslashit( wp_normalize_path( $plugin_dir ) );

	if ( 0 !== strpos( $plugin_dir_normalized, $plugin_root_normalized ) ) {
		return new WP_Error(
			'justice_theme_plugin_path_invalid',
			'Requested plugin path is invalid.',
			array( 'status' => 400 )
		);
	}

	$manifest = justice_theme_build_file_manifest( $plugin_dir, $plugin_root );

	nocache_headers();

	return rest_ensure_response(
		array(
			'ok'               => true,
			'generated_at'     => current_time( 'mysql' ),
			'plugin'           => $plugin_file,
			'plugin_directory' => basename( $plugin_dir ),
			'file_count'       => count( $manifest ),
			'total_bytes'      => array_sum( wp_list_pluck( $manifest, 'bytes' ) ),
			'files'            => $manifest,
		)
	);
}

/**
 * Get active plugin file paths, including network-active plugins.
 *
 * @return array<int,string>
 */
function justice_theme_get_active_plugin_files(): array {
	$plugins = (array) get_option( 'active_plugins', array() );

	if ( is_multisite() ) {
		$sitewide_plugins = (array) get_site_option( 'active_sitewide_plugins', array() );
		$plugins          = array_merge( $plugins, array_keys( $sitewide_plugins ) );
	}

	$plugins = array_map(
		static function ( $plugin ): string {
			return ltrim( str_replace( '\\', '/', (string) $plugin ), '/' );
		},
		$plugins
	);

	$plugins = array_values( array_unique( array_filter( $plugins ) ) );
	sort( $plugins, SORT_STRING );

	return $plugins;
}

/**
 * Build a file manifest for a plugin directory.
 *
 * @param string $plugin_dir  Absolute plugin directory.
 * @param string $plugin_root Absolute wp-content/plugins directory.
 * @return array<int,array<string,int|string|null>>
 */
function justice_theme_build_file_manifest( string $plugin_dir, string $plugin_root ): array {
	$files      = array();
	$iterator   = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $plugin_dir, FilesystemIterator::SKIP_DOTS )
	);
	$max_files  = 500;
	$file_count = 0;

	foreach ( $iterator as $file_info ) {
		if ( ! $file_info instanceof SplFileInfo || ! $file_info->isFile() ) {
			continue;
		}

		$file_count++;
		if ( $file_count > $max_files ) {
			break;
		}

		$path = $file_info->getPathname();
		if ( ! is_readable( $path ) ) {
			continue;
		}

		$relative = ltrim( str_replace( '\\', '/', substr( $path, strlen( $plugin_root ) ) ), '/' );

		$hash = hash_file( 'sha256', $path );

		$files[] = array(
			'path'          => $relative,
			'bytes'         => (int) $file_info->getSize(),
			'sha256'        => false === $hash ? '' : $hash,
			'last_modified' => gmdate( 'c', (int) $file_info->getMTime() ),
		);
	}

	usort(
		$files,
		static function ( array $left, array $right ): int {
			return strcmp( (string) $left['path'], (string) $right['path'] );
		}
	);

	return $files;
}
