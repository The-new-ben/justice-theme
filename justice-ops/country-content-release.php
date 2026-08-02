<?php
/**
 * Truthful schema boundary for the coordinated Portugal and USA cohorts.
 *
 * These preserved URLs are editorial guides, references, one location guide
 * and one taxonomy hub. They must not inherit provider, rating, offer or
 * reviewer schema without page-specific proof.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Exact public paths governed by the country schema release.
 *
 * @return string[]
 */
function justice_ops_country_schema_release_paths(): array {
	return array(
		'/portugal-lawyers/',
		'/practice-areas/portugal/',
		'/legal-services-in-portugal/',
		'/portuguese-bar-association/',
		'/immigration-to-portugal/',
		'/usa-lawyers/',
		'/choose-usa-attorney/',
		'/us-lawyer-license-requirements/',
		'/american-bar-association/',
		'/california-lawyers/',
	);
}

/**
 * Resolve one normalized request path without using a post or term lookup.
 */
function justice_ops_country_schema_release_current_path(): string {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '/';
	$path        = wp_parse_url( $request_uri, PHP_URL_PATH );
	$path        = is_string( $path ) && '' !== $path ? $path : '/';

	return '/' . trim( $path, '/' ) . '/';
}

/**
 * True only for the ten reviewed country cohort paths.
 */
function justice_ops_country_schema_release_is_current_route(): bool {
	return in_array(
		justice_ops_country_schema_release_current_path(),
		justice_ops_country_schema_release_paths(),
		true
	);
}

/**
 * Remove unsupported schema nodes and add a release marker to the body.
 */
function justice_ops_country_schema_release_filter_html( string $html ): string {
	if ( ! justice_ops_country_schema_release_is_current_route() ) {
		return $html;
	}

	if ( function_exists( 'justice_ops_real_estate_release_filter_schema_scripts' ) ) {
		$html = justice_ops_real_estate_release_filter_schema_scripts( $html );
	}

	if ( false === strpos( $html, 'data-jt-country-schema-release=' ) ) {
		$marked = preg_replace(
			'#<body\b#i',
			'<body data-jt-country-schema-release="2026-08-02-r1"',
			$html,
			1
		);
		if ( is_string( $marked ) ) {
			$html = $marked;
		}
	}

	return $html;
}

add_action(
	'template_redirect',
	static function (): void {
		if ( is_admin() || ! justice_ops_country_schema_release_is_current_route() ) {
			return;
		}

		ob_start( 'justice_ops_country_schema_release_filter_html' );
	},
	1
);
