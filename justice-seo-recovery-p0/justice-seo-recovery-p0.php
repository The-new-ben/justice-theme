<?php
/**
 * Plugin Name: Justice SEO Recovery P0
 * Description: Bounded P0 canonical and public lawyer-listing corrections for Jus-Tice.
 * Version: 0.1.0
 * Requires PHP: 7.4
 * Author: Jus-Tice
 * License: GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_P0_VERSION', '0.1.0' );
define( 'JUSTICE_P0_MARKER', 'p0-20260801' );

/**
 * Remove the one shared map payload that can outlive profile approval changes.
 *
 * The feed itself applies the theme approval predicate when regenerating. This
 * bounded activation hook prevents an older six-hour payload being served
 * after the quarantine is activated.
 *
 * @return void
 */
function justice_p0_clear_public_lawyer_listing_transient() {
	delete_transient( 'justice_map_geojson_v1' );
}
register_activation_hook(
	__FILE__,
	'justice_p0_clear_public_lawyer_listing_transient'
);

/**
 * Retire only the two disproven post-level cross-canonicals.
 *
 * The existing hierarchy plugin owns the canonical map. This late filter
 * removes the two entries whose source and target pages serve distinct intent,
 * while preserving every other reviewed mapping.
 *
 * @param mixed $map Existing weaker-path-to-canonical-path map.
 * @return mixed
 */
function justice_p0_retire_post_cross_canonicals( $map ) {
	if ( ! is_array( $map ) ) {
		return $map;
	}

	unset( $map['mediation-divorce'], $map['immigration-to-portugal'] );

	return $map;
}
add_filter( 'justice_seo_consolidate_map', 'justice_p0_retire_post_cross_canonicals', 999, 1 );

/**
 * Retire the former term-archive cross-canonicals.
 *
 * Each affected taxonomy archive keeps its own canonical URL. No URL, term,
 * post, redirect, or indexability setting is changed by this filter.
 *
 * @param mixed $map Existing term canonical map.
 * @return mixed
 */
function justice_p0_retire_term_cross_canonicals( $map ) {
	if ( ! is_array( $map ) ) {
		return $map;
	}

	unset(
		$map['category:news'],
		$map['practice-areas:child-support'],
		$map['practice-areas:family-law']
	);

	return $map;
}
add_filter( 'justice_seo_term_canonicals', 'justice_p0_retire_term_cross_canonicals', 999, 1 );

/**
 * Stable fingerprints for the two unverified duplicate profile records.
 *
 * IDs are durable record identities. Title is retained for evidence, but a
 * title-only edit cannot release an unapproved known duplicate. Approval is
 * the only public release path while the record remains a published lawyer.
 *
 * @return array<int,array<string,string>>
 */
function justice_p0_profile_fingerprints() {
	return array(
		23405 => array(
			'post_type'   => 'justice_lawyer',
			'post_status' => 'publish',
			'post_title'  => 'מאיה רוטנברג חברת עורכי דין',
		),
		23406 => array(
			'post_type'   => 'justice_lawyer',
			'post_status' => 'publish',
			'post_title'  => 'מאיה רוטנברג משרד עורכי דין',
		),
	);
}

/**
 * Resolve the exact profile IDs that still satisfy the quarantine contract.
 *
 * A profile that passes the theme's evidence-backed approval predicate is
 * never excluded, even if its original database fingerprint still matches.
 *
 * @return array<int,int>
 */
function justice_p0_quarantined_profile_ids() {
	$quarantined = array();

	foreach ( justice_p0_profile_fingerprints() as $post_id => $fingerprint ) {
		$post = get_post( $post_id );

		if ( ! ( $post instanceof WP_Post ) ) {
			continue;
		}

		if (
			(int) $post_id !== (int) $post->ID
			|| $fingerprint['post_type'] !== $post->post_type
			|| $fingerprint['post_status'] !== $post->post_status
		) {
			continue;
		}

		if (
			function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			&& justice_theme_lawyer_profile_is_public_approved( $post_id )
		) {
			continue;
		}

		$quarantined[] = (int) $post_id;
	}

	return $quarantined;
}

/**
 * Keep trust-gated duplicate profiles out of Yoast XML sitemaps.
 *
 * @param mixed $ids Existing sitemap exclusions.
 * @return array<int,int>
 */
function justice_p0_merge_sitemap_exclusions( $ids ) {
	$merged = array_merge( (array) $ids, justice_p0_quarantined_profile_ids() );
	$clean  = array();

	foreach ( $merged as $post_id ) {
		$post_id = (int) $post_id;

		if ( $post_id > 0 && ! in_array( $post_id, $clean, true ) ) {
			$clean[] = $post_id;
		}
	}

	return $clean;
}
add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', 'justice_p0_merge_sitemap_exclusions', 99, 1 );

/**
 * Detect request contexts that must never receive public-listing mutations.
 *
 * @return bool
 */
function justice_p0_is_non_public_runtime() {
	if ( is_admin() ) {
		return true;
	}

	if ( function_exists( 'wp_doing_cron' ) && wp_doing_cron() ) {
		return true;
	}

	if ( defined( 'DOING_CRON' ) && DOING_CRON ) {
		return true;
	}

	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		return true;
	}

	if ( defined( 'WP_LOAD_IMPORTERS' ) && WP_LOAD_IMPORTERS ) {
		return true;
	}

	if ( defined( 'WP_IMPORTING' ) && WP_IMPORTING ) {
		return true;
	}

	if ( defined( 'IMPORTING' ) && IMPORTING ) {
		return true;
	}

	return false;
}

/**
 * Return a normalized request path with one leading and trailing slash.
 * Query parameters never participate in the legacy-page match.
 *
 * @return string
 */
function justice_p0_request_path() {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
	$path        = function_exists( 'wp_parse_url' )
		? wp_parse_url( $request_uri, PHP_URL_PATH )
		: parse_url( $request_uri, PHP_URL_PATH );

	if ( ! is_string( $path ) || '' === $path ) {
		return '/';
	}

	$path = preg_replace( '#/+#', '/', '/' . ltrim( $path, '/' ) );

	if ( ! is_string( $path ) || '/' === $path ) {
		return '/';
	}

	return rtrim( $path, '/' ) . '/';
}

/**
 * Determine whether a query explicitly requests lawyer profile records.
 *
 * @param mixed $query Query under construction.
 * @return bool
 */
function justice_p0_is_lawyer_query( $query ) {
	if ( ! is_object( $query ) || ! method_exists( $query, 'get' ) ) {
		return false;
	}

	$post_type = $query->get( 'post_type' );

	return 'justice_lawyer' === $post_type
		|| ( is_array( $post_type ) && in_array( 'justice_lawyer', $post_type, true ) );
}

/**
 * Decide whether a query is one of the audited public lawyer listings.
 *
 * Generic secondary queries remain untouched. A secondary query is eligible
 * only on the exact legacy HTML-sitemap path, or when its caller deliberately
 * supplies the strict boolean justice_public_lawyer_listing query variable.
 *
 * @param mixed $query Query under construction.
 * @return bool
 */
function justice_p0_should_filter_public_query( $query ) {
	if (
		justice_p0_is_non_public_runtime()
		|| ! is_object( $query )
		|| ! method_exists( $query, 'get' )
		|| ! method_exists( $query, 'is_main_query' )
	) {
		return false;
	}

	$is_main_query = $query->is_main_query();

	if ( $is_main_query ) {
		if ( method_exists( $query, 'is_singular' ) && $query->is_singular() ) {
			return false;
		}

		$is_city_archive = method_exists( $query, 'is_tax' ) && $query->is_tax( 'city' );
		$is_lawyer_archive = method_exists( $query, 'is_post_type_archive' )
			&& $query->is_post_type_archive( 'justice_lawyer' );

		if ( $is_city_archive || $is_lawyer_archive ) {
			return true;
		}
	}

	if (
		true === $query->get( 'justice_public_lawyer_listing' )
		&& justice_p0_is_lawyer_query( $query )
	) {
		return true;
	}

	return ! $is_main_query
		&& '/sitemap-jus-tice/' === justice_p0_request_path()
		&& justice_p0_is_lawyer_query( $query );
}

/**
 * Exclude fingerprint-matched, unapproved profiles from audited public lists.
 *
 * Existing exclusions are preserved. This changes query visibility only and
 * never edits, deletes, redirects, noindexes, or canonicalizes a profile URL.
 *
 * @param mixed $query Query under construction.
 * @return void
 */
function justice_p0_exclude_quarantined_profiles( $query ) {
	if ( ! justice_p0_should_filter_public_query( $query ) ) {
		return;
	}

	$quarantined = justice_p0_quarantined_profile_ids();

	if ( empty( $quarantined ) ) {
		return;
	}

	$current = (array) $query->get( 'post__not_in' );
	$merged  = array();

	foreach ( array_merge( $current, $quarantined ) as $post_id ) {
		$post_id = (int) $post_id;

		if ( $post_id > 0 && ! in_array( $post_id, $merged, true ) ) {
			$merged[] = $post_id;
		}
	}

	$query->set( 'post__not_in', $merged );
}
add_action( 'pre_get_posts', 'justice_p0_exclude_quarantined_profiles', 99, 1 );

/**
 * Public, non-sensitive release healthcheck.
 *
 * @return array<string,string>
 */
function justice_p0_healthcheck() {
	return array(
		'version' => JUSTICE_P0_VERSION,
		'marker'  => JUSTICE_P0_MARKER,
	);
}

/**
 * Register the public release healthcheck route.
 *
 * @return void
 */
function justice_p0_register_healthcheck() {
	register_rest_route(
		'justice-seo-recovery/v1',
		'/healthcheck',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => 'justice_p0_healthcheck',
		)
	);
}
add_action( 'rest_api_init', 'justice_p0_register_healthcheck', 10, 0 );
