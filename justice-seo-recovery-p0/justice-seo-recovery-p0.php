<?php
/**
 * Plugin Name: Justice SEO Recovery P0
 * Description: Bounded P0 canonical and public lawyer-listing corrections for Jus-Tice.
 * Version: 0.1.1
 * Requires PHP: 7.4
 * Author: Jus-Tice
 * License: GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_P0_VERSION', '0.1.1' );
define( 'JUSTICE_P0_MARKER', 'p0-plugin-only-20260801-v2' );

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
 * Keep the canonical Yoast sitemap index enabled on the old live theme.
 *
 * @param mixed $enabled Existing Yoast sitemap state.
 * @return bool
 */
function justice_p0_yoast_sitemaps_enabled( $enabled ) {
	unset( $enabled );

	return true;
}

/**
 * Remove the old theme's exact sitemap kill switch, then win the final value.
 *
 * This runs after the theme has loaded so a top-level __return_false callback
 * can be removed without changing any unrelated Yoast filters.
 *
 * @return void
 */
function justice_p0_enforce_yoast_sitemaps() {
	remove_filter( 'wpseo_sitemaps_enabled', '__return_false', 10 );
	add_filter( 'wpseo_sitemaps_enabled', 'justice_p0_yoast_sitemaps_enabled', PHP_INT_MAX, 1 );

	remove_filter( 'robots_txt', 'justice_theme_robots_sitemap_directive', PHP_INT_MAX );
	remove_filter( 'robots_txt', 'justice_p0_canonical_robots_sitemap', PHP_INT_MAX );
	add_filter( 'robots_txt', 'justice_p0_canonical_robots_sitemap', PHP_INT_MAX, 2 );
}
add_action( 'after_setup_theme', 'justice_p0_enforce_yoast_sitemaps', PHP_INT_MAX, 0 );

/**
 * Emit one canonical sitemap directive while preserving all other robots lines.
 *
 * @param mixed $output Existing robots.txt output.
 * @param mixed $public Whether WordPress considers the site public.
 * @return string
 */
function justice_p0_canonical_robots_sitemap( $output, $public ) {
	unset( $public );

	$lines     = preg_split( '/\r\n|\n|\r/', (string) $output );
	$preserved = array();

	foreach ( is_array( $lines ) ? $lines : array() as $line ) {
		if ( preg_match( '/^[\t ]*sitemap[\t ]*:/i', $line ) ) {
			continue;
		}

		$preserved[] = $line;
	}

	while ( ! empty( $preserved ) && '' === end( $preserved ) ) {
		array_pop( $preserved );
	}

	$preserved[] = 'Sitemap: https://jus-tice.co.il/sitemap_index.xml';

	return implode( "\n", $preserved ) . "\n";
}

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

	if ( function_exists( 'wp_doing_ajax' ) && wp_doing_ajax() ) {
		return true;
	}

	if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
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

	if ( function_exists( 'current_user_can' ) && current_user_can( 'edit_others_posts' ) ) {
		return true;
	}

	$method = isset( $_SERVER['REQUEST_METHOD'] )
		? strtoupper( (string) $_SERVER['REQUEST_METHOD'] )
		: 'GET';

	if ( ! in_array( $method, array( 'GET', 'HEAD' ), true ) ) {
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
 * Remove every exact query-parameter occurrence without rewriting other bytes.
 *
 * @param string $query_string Raw query string without a leading question mark.
 * @param string $parameter    Decoded parameter name to remove.
 * @return string
 */
function justice_p0_query_string_without_parameter( $query_string, $parameter ) {
	$preserved = array();

	foreach ( explode( '&', (string) $query_string ) as $part ) {
		$name = explode( '=', $part, 2 );
		$name = rawurldecode( str_replace( '+', ' ', $name[0] ) );

		if ( $parameter === $name ) {
			continue;
		}

		if ( '' !== $part ) {
			$preserved[] = $part;
		}
	}

	return implode( '&', $preserved );
}

/**
 * Remove one query parameter from a request URI while retaining path and peers.
 *
 * @param string $request_uri Raw request URI.
 * @param string $parameter   Decoded parameter name to remove.
 * @return string
 */
function justice_p0_request_uri_without_parameter( $request_uri, $parameter ) {
	$fragment = '';
	$uri      = (string) $request_uri;
	$hash     = strpos( $uri, '#' );

	if ( false !== $hash ) {
		$fragment = substr( $uri, $hash );
		$uri      = substr( $uri, 0, $hash );
	}

	$question = strpos( $uri, '?' );

	if ( false === $question ) {
		return $uri . $fragment;
	}

	$path  = substr( $uri, 0, $question );
	$query = justice_p0_query_string_without_parameter( substr( $uri, $question + 1 ), $parameter );

	return $path . ( '' !== $query ? '?' . $query : '' ) . $fragment;
}

/**
 * Keep quarantined IDs out of the public profile-claim rendering path.
 *
 * No redirect is performed, so the browser URL remains unchanged. The PHP
 * request globals are scrubbed before the template and attribution helpers
 * run, preventing hidden fields from echoing the quarantined ID.
 *
 * @return void
 */
function justice_p0_sanitize_quarantined_claim_request() {
	if (
		justice_p0_is_non_public_runtime()
		|| '/lawyer-registration/' !== justice_p0_request_path()
	) {
		return;
	}

	$quarantined = justice_p0_quarantined_profile_ids();
	$parameters  = array();

	if ( isset( $_GET['claim_profile_id'] ) && is_scalar( $_GET['claim_profile_id'] ) ) {
		$claim_profile_id = absint( (string) $_GET['claim_profile_id'] );

		if ( in_array( $claim_profile_id, $quarantined, true ) ) {
			$parameters[] = 'claim_profile_id';
		}
	}

	if ( isset( $_GET['claim_profile'] ) && is_scalar( $_GET['claim_profile'] ) ) {
		$claim_profile_slug = sanitize_title( (string) $_GET['claim_profile'] );
		$claim_profile      = '' !== $claim_profile_slug
			? get_page_by_path( $claim_profile_slug, OBJECT, 'justice_lawyer' )
			: null;

		if (
			$claim_profile instanceof WP_Post
			&& in_array( (int) $claim_profile->ID, $quarantined, true )
		) {
			$parameters[] = 'claim_profile';
		}
	}

	if ( empty( $parameters ) ) {
		return;
	}

	foreach ( $parameters as $parameter ) {
		unset( $_GET[ $parameter ], $_REQUEST[ $parameter ] );

		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$_SERVER['REQUEST_URI'] = justice_p0_request_uri_without_parameter(
				(string) $_SERVER['REQUEST_URI'],
				$parameter
			);
		}

		if ( isset( $_SERVER['QUERY_STRING'] ) ) {
			$_SERVER['QUERY_STRING'] = justice_p0_query_string_without_parameter(
				(string) $_SERVER['QUERY_STRING'],
				$parameter
			);
		}
	}
}
add_action( 'template_redirect', 'justice_p0_sanitize_quarantined_claim_request', -100000, 0 );

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
 * Decide whether an anonymous read query can return a quarantined record.
 *
 * The live theme contains public secondary and get_posts() calls that do not
 * opt into a custom query variable and sometimes set suppress_filters=true.
 * pre_get_posts still runs for those calls. Every public main query is eligible
 * because an empty post_type search can return lawyer records. A secondary
 * query remains eligible only when it explicitly requests justice_lawyer.
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

	if ( $query->is_main_query() ) {
		return true;
	}

	return justice_p0_is_lawyer_query( $query );
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

	$current_post_in = (array) $query->get( 'post__in' );

	if ( ! empty( $current_post_in ) ) {
		$filtered_post_in = array();

		foreach ( $current_post_in as $post_id ) {
			$post_id = (int) $post_id;

			if (
				$post_id > 0
				&& ! in_array( $post_id, $quarantined, true )
				&& ! in_array( $post_id, $filtered_post_in, true )
			) {
				$filtered_post_in[] = $post_id;
			}
		}

		$query->set( 'post__in', ! empty( $filtered_post_in ) ? $filtered_post_in : array( 0 ) );
	}

	$singular_id_keys = array( 'p', 'page_id', 'attachment_id', 'subpost_id' );
	$blocked_singular = false;

	foreach ( $singular_id_keys as $singular_id_key ) {
		$singular_id = $query->get( $singular_id_key );

		if (
			is_scalar( $singular_id )
			&& in_array( (int) $singular_id, $quarantined, true )
		) {
			$query->set( $singular_id_key, 0 );
			$blocked_singular = true;
		}
	}

	if ( $blocked_singular ) {
		foreach ( $singular_id_keys as $singular_id_key ) {
			$query->set( $singular_id_key, 0 );
		}

		$query->set( 'post__in', array( 0 ) );
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
