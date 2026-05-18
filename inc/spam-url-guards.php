<?php
/**
 * Guards for deleted hacked/spam URLs that can linger in Google.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Serve stable theme favicons from root-level legacy favicon paths.
 */
function justice_theme_serve_root_brand_icon(): void {
	$request_path = wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH );

	if ( ! is_string( $request_path ) ) {
		return;
	}

	$icon_map = array(
		'/favicon.ico' => array(
			'file' => JUSTICE_THEME_DIR . '/assets/images/favicon.ico',
			'type' => 'image/x-icon',
		),
		'/favicon.png' => array(
			'file' => JUSTICE_THEME_DIR . '/assets/images/favicon-512.png',
			'type' => 'image/png',
		),
	);

	if ( ! isset( $icon_map[ $request_path ] ) ) {
		return;
	}

	$icon = $icon_map[ $request_path ];

	if ( ! file_exists( $icon['file'] ) ) {
		return;
	}

	status_header( 200 );
	http_response_code( 200 );
	header( 'Content-Type: ' . $icon['type'] );
	header( 'Cache-Control: public, max-age=604800' );
	readfile( $icon['file'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
	exit;
}
add_action( 'init', 'justice_theme_serve_root_brand_icon', 0 );

/**
 * Return 410 for deleted casino/gambling spam paths left by the old breach.
 */
function justice_theme_guard_deleted_spam_urls(): void {
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	$request_path = wp_parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH );

	if ( ! is_string( $request_path ) ) {
		return;
	}

	$decoded_path = rawurldecode( strtolower( $request_path ) );
	$spam_pattern = '/casino|bonos|juego|juegos|intrattenimento|punta|assistenza|semplicita|keno|alkalmazasban|hogyan|penzt|befizetni/i';

	if ( ! preg_match( $spam_pattern, $decoded_path ) ) {
		return;
	}

	status_header( 410 );
	http_response_code( 410 );
	header( 'Status: 410 Gone', true, 410 );
	header( 'X-Robots-Tag: noindex, nofollow', true );
	nocache_headers();

	echo '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>עמוד הוסר | Jus-Tice</title></head><body><h1>עמוד הוסר</h1><p>העמוד הוסר מהאתר ואינו זמין יותר.</p></body></html>';
	exit;
}
add_action( 'init', 'justice_theme_guard_deleted_spam_urls', 0 );
