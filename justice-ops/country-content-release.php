<?php
/**
 * Truthful schema boundary for the coordinated Portugal, USA and Cyprus
 * editorial cohorts.
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
		'/about-cyprus/',
		'/cyprus-lawyer/',
		'/cyprus-prices/',
		'/avoiding-mistakes-when-buying-property-in-cyprus/',
		'/buy-real-estate-cyprus/',
		'/cyprus-corporate-tax/',
		'/real-estate-market-review-cyprus-guide-israelis-2025/',
		'/real-estate-market-greece-cyprus/',
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
 * True only for the reviewed country cohort paths.
 */
function justice_ops_country_schema_release_is_current_route(): bool {
	return in_array(
		justice_ops_country_schema_release_current_path(),
		justice_ops_country_schema_release_paths(),
		true
	);
}

/**
 * Replace only an unsupported recommendation claim on a WebSite node.
 *
 * @param mixed $value Decoded JSON-LD value.
 * @return mixed
 */
function justice_ops_country_schema_release_neutralize_website_description( $value ) {
	if ( ! is_array( $value ) ) {
		return $value;
	}

	$types = isset( $value['@type'] ) ? (array) $value['@type'] : array();
	if (
		in_array( 'WebSite', $types, true )
		&& isset( $value['description'] )
		&& is_string( $value['description'] )
		&& false !== strpos( $value['description'], 'עורכי דין מומלצים' )
	) {
		$value['description'] = 'פורטל מידע משפטי בישראל';
	}

	foreach ( $value as $key => $item ) {
		$value[ $key ] = justice_ops_country_schema_release_neutralize_website_description( $item );
	}

	return $value;
}

/**
 * Normalize preserved WebSite nodes after unsupported provider nodes are cut.
 */
function justice_ops_country_schema_release_filter_website_schema( string $html ): string {
	$updated = preg_replace_callback(
		'#<script\b([^>]*)type=["\']application/ld\+json["\']([^>]*)>([\s\S]*?)</script>#iu',
		static function ( array $match ): string {
			$decoded = json_decode( html_entity_decode( trim( $match[3] ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ), true );
			if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
				return $match[0];
			}

			$clean = justice_ops_country_schema_release_neutralize_website_description( $decoded );
			$json  = wp_json_encode( $clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
			if ( ! is_string( $json ) || '' === $json ) {
				return $match[0];
			}

			return '<script' . $match[1] . 'type="application/ld+json"' . $match[2] . '>' . $json . '</script>';
		},
		$html
	);

	return is_string( $updated ) ? $updated : $html;
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
	$html = justice_ops_country_schema_release_filter_website_schema( $html );

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
