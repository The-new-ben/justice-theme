<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

function uje_agent_permission() {
	return current_user_can( 'manage_options' );
}

function uje_register_agent_routes() {
	register_rest_route( 'ultra-justice-engine/v1', '/health', array(
		'methods' => 'GET', 'callback' => 'uje_agent_health', 'permission_callback' => 'uje_agent_permission',
	) );
	register_rest_route( 'ultra-justice-engine/v1', '/theme/files', array(
		'methods' => 'GET', 'callback' => 'uje_agent_list_theme_files', 'permission_callback' => 'uje_agent_permission',
	) );
	register_rest_route( 'ultra-justice-engine/v1', '/theme/file', array(
		'methods' => 'GET', 'callback' => 'uje_agent_read_theme_file', 'permission_callback' => 'uje_agent_permission',
		'args' => array( 'path' => array( 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ) ),
	) );
	register_rest_route( 'ultra-justice-engine/v1', '/theme/file', array(
		'methods' => 'POST', 'callback' => 'uje_agent_write_theme_file', 'permission_callback' => 'uje_agent_permission',
		'args' => array( 'path' => array( 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ), 'content' => array( 'required' => true ) ),
	) );
}
add_action( 'rest_api_init', 'uje_register_agent_routes' );

function uje_agent_health() {
	return array( 'ok' => true, 'site' => home_url(), 'wp' => get_bloginfo( 'version' ), 'php' => PHP_VERSION, 'theme' => wp_get_theme()->get( 'Name' ), 'plugin' => UJE_VERSION );
}

function uje_allowed_extensions() {
	return array( 'php', 'css', 'js', 'json', 'svg', 'txt', 'md' );
}

function uje_normalize_path( $rel ) {
	$rel = ltrim( str_replace( '\\', '/', $rel ), '/' );
	if ( false !== strpos( $rel, '..' ) ) { return false; }
	$ext = strtolower( pathinfo( $rel, PATHINFO_EXTENSION ) );
	if ( ! in_array( $ext, uje_allowed_extensions(), true ) ) { return false; }
	$dir  = trailingslashit( get_template_directory() );
	$full = $dir . $rel;
	$real_dir  = realpath( $dir );
	$real_file = realpath( dirname( $full ) );
	if ( ! $real_dir || ! $real_file || 0 !== strpos( $real_file, $real_dir ) ) { return false; }
	return $full;
}

function uje_agent_list_theme_files() {
	$dir = get_template_directory();
	$rii = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $dir ) );
	$files = array();
	foreach ( $rii as $f ) {
		if ( $f->isDir() ) { continue; }
		$ext = strtolower( pathinfo( $f->getPathname(), PATHINFO_EXTENSION ) );
		if ( in_array( $ext, uje_allowed_extensions(), true ) ) {
			$files[] = str_replace( trailingslashit( $dir ), '', $f->getPathname() );
		}
	}
	sort( $files );
	return array( 'files' => $files );
}

function uje_agent_read_theme_file( WP_REST_Request $r ) {
	$path = uje_normalize_path( $r->get_param( 'path' ) );
	if ( ! $path || ! file_exists( $path ) ) {
		return new WP_Error( 'not_found', 'File not found.', array( 'status' => 404 ) );
	}
	return array( 'path' => $r->get_param( 'path' ), 'content' => file_get_contents( $path ) );
}

function uje_agent_write_theme_file( WP_REST_Request $r ) {
	$path = uje_normalize_path( $r->get_param( 'path' ) );
	if ( ! $path ) {
		return new WP_Error( 'invalid', 'Path not allowed.', array( 'status' => 400 ) );
	}
	$dir = dirname( $path );
	if ( ! file_exists( $dir ) ) { wp_mkdir_p( $dir ); }
	$bytes = file_put_contents( $path, $r->get_param( 'content' ) );
	if ( false === $bytes ) {
		return new WP_Error( 'write_fail', 'Write failed.', array( 'status' => 500 ) );
	}
	uje_agent_log( 'write', array( 'path' => $r->get_param( 'path' ), 'user' => get_current_user_id() ) );
	return array( 'ok' => true, 'bytes' => $bytes );
}

function uje_agent_log( $action, $data = array() ) {
	$dir = trailingslashit( wp_upload_dir()['basedir'] ) . 'justice-logs/';
	if ( ! file_exists( $dir ) ) { wp_mkdir_p( $dir ); }
	file_put_contents( $dir . 'agent.log', wp_json_encode( array( 'time' => gmdate( 'c' ), 'action' => $action, 'data' => $data ), JSON_UNESCAPED_UNICODE ) . "\n", FILE_APPEND );
}
