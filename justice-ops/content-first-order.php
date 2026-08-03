<?php
/**
 * Content-first ordering for editorial articles and practice taxonomies.
 *
 * The theme can place lawyer maps, registered bands and organic directory
 * inventory before the complete editorial answer. This module moves those
 * known surfaces behind the editorial content without changing their internal
 * DOM. A sponsored card stays inline only when its profile passes the canonical
 * public and active-paid gates and the card visibly says "מקודם".
 *
 * Lawyer directories and individual lawyer profiles are deliberately excluded.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Normalize the current request path.
 */
function justice_ops_content_first_request_path(): string {
	$path = (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Exact foreign-country cohort used by the separate jurisdiction card gate.
 *
 * Content-first article ordering is now sitewide. This list remains exact
 * because professional-cards.php uses it to recognize the Cyprus jurisdiction.
 *
 * @return string[]
 */
function justice_ops_content_first_target_paths(): array {
	return array(
		'/about-cyprus/',
		'/avoiding-mistakes-when-buying-property-in-cyprus/',
		'/buy-real-estate-cyprus/',
		'/cyprus-corporate-tax/',
		'/cyprus-lawyer/',
		'/cyprus-prices/',
		'/real-estate-market-greece-cyprus/',
		'/real-estate-market-review-cyprus-guide-israelis-2025/',
	);
}

/**
 * Normalize an arbitrary path value to the exact public-path form used here.
 */
function justice_ops_content_first_normalize_path( string $path ): string {
	$path = (string) wp_parse_url( $path, PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Validate one local, exact public path without accepting hosts or queries.
 */
function justice_ops_content_first_validate_rollout_path( $path ): ?string {
	if ( ! is_string( $path ) ) {
		return null;
	}
	$path = trim( $path );
	if (
		'' === $path
		|| strlen( $path ) > 200
		|| '/' !== $path[0]
		|| false !== strpos( $path, '://' )
		|| false !== strpbrk( $path, "?#\0\r\n" )
		|| false !== strpos( $path, '..' )
	) {
		return null;
	}

	$normalized = justice_ops_content_first_normalize_path( $path );

	return 1 === preg_match( '#^/[A-Za-z0-9%._~!$&\'()*+,;=:@/-]*/$#u', $normalized ) ? $normalized : null;
}

/**
 * Convert stored or requested rollout state to its canonical representation.
 *
 * Modes:
 * - legacy: the existing eight Cyprus URLs only, the upgrade default.
 * - exact: the legacy cohort plus one to fifty explicit canary URLs.
 * - all: every classified public surface.
 * - off: immediate global rollback of this module's rendered-output behavior.
 *
 * @return array{mode:string,paths:array}|null
 */
function justice_ops_content_first_sanitize_rollout_state( $raw, bool $allow_legacy = true ): ?array {
	if ( is_string( $raw ) ) {
		$raw = array( 'mode' => strtolower( trim( $raw ) ), 'paths' => array() );
	}
	if ( ! is_array( $raw ) ) {
		return null;
	}

	$mode = strtolower( trim( (string) ( $raw['mode'] ?? '' ) ) );
	$valid_modes = $allow_legacy ? array( 'legacy', 'exact', 'all', 'off' ) : array( 'exact', 'all', 'off' );
	if ( ! in_array( $mode, $valid_modes, true ) ) {
		return null;
	}

	$raw_paths = $raw['paths'] ?? array();
	if ( is_string( $raw_paths ) ) {
		$raw_paths = preg_split( '/[\r\n,]+/', $raw_paths );
	}
	if ( ! is_array( $raw_paths ) || count( $raw_paths ) > 50 ) {
		return null;
	}

	$paths = array();
	foreach ( $raw_paths as $path ) {
		$normalized = justice_ops_content_first_validate_rollout_path( $path );
		if ( null === $normalized ) {
			return null;
		}
		$paths[] = $normalized;
	}
	$paths = array_values( array_unique( $paths ) );

	if ( 'exact' === $mode && empty( $paths ) ) {
		return null;
	}
	if ( 'exact' !== $mode && ! empty( $paths ) ) {
		return null;
	}

	return array( 'mode' => $mode, 'paths' => $paths );
}

/**
 * Return the fail-closed rollout state without mutating storage.
 *
 * @return array{mode:string,paths:array}
 */
function justice_ops_content_first_rollout_scope(): array {
	$default = array( 'mode' => 'exact', 'paths' => array( '/online-family-law-services/' ) );
	$raw     = function_exists( 'get_option' )
		? get_option( 'justice_ops_content_first_rollout_scope', $default )
		: $default;
	$scope   = justice_ops_content_first_sanitize_rollout_state( $raw, true );

	if ( null === $scope ) {
		$scope = array( 'mode' => 'off', 'paths' => array() );
	}
	if ( function_exists( 'apply_filters' ) ) {
		$filtered = apply_filters( 'justice_ops_content_first_rollout_scope', $scope );
		$scope    = justice_ops_content_first_sanitize_rollout_state( $filtered, true );
		if ( null === $scope ) {
			$scope = array( 'mode' => 'off', 'paths' => array() );
		}
	}

	return $scope;
}

/**
 * Effective exact paths for status output and hash verification.
 *
 * @param array{mode:string,paths:array}|null $scope Canonical state.
 * @return string[]
 */
function justice_ops_content_first_effective_rollout_paths( ?array $scope = null ): array {
	$scope = null === $scope ? justice_ops_content_first_rollout_scope() : $scope;
	if ( in_array( $scope['mode'], array( 'all', 'off' ), true ) ) {
		return array();
	}

	return array_values( array_unique( array_merge( justice_ops_content_first_target_paths(), $scope['paths'] ) ) );
}

/**
 * Whether the current exact URL is inside the controlled rollout.
 */
function justice_ops_content_first_rollout_allows_path( ?string $path = null ): bool {
	$scope = justice_ops_content_first_rollout_scope();
	$path  = justice_ops_content_first_normalize_path( null === $path ? justice_ops_content_first_request_path() : $path );

	if ( 'all' === $scope['mode'] ) {
		return true;
	}
	if ( 'off' === $scope['mode'] ) {
		return false;
	}

	return in_array( $path, justice_ops_content_first_effective_rollout_paths( $scope ), true );
}

/**
 * Stable status payload used by both rollout-control methods.
 *
 * @param array{mode:string,paths:array}|null $scope Canonical state.
 * @return array<string,mixed>
 */
function justice_ops_content_first_rollout_payload( ?array $scope = null ): array {
	$scope    = null === $scope ? justice_ops_content_first_rollout_scope() : $scope;
	$effective = justice_ops_content_first_effective_rollout_paths( $scope );
	$encoded   = function_exists( 'wp_json_encode' )
		? wp_json_encode( $scope )
		: json_encode( $scope );

	return array(
		'mode'            => $scope['mode'],
		'paths'           => $scope['paths'],
		'effective_paths' => $effective,
		'scope_hash'      => hash( 'sha256', (string) $encoded ),
		'rollback'        => 'off',
		'global'          => 'all',
	);
}

/**
 * Return a WordPress REST error without weakening production behavior.
 */
function justice_ops_content_first_rest_error( string $code, string $message, int $status ) {
	return class_exists( 'WP_Error' )
		? new WP_Error( $code, $message, array( 'status' => $status ) )
		: false;
}

/**
 * Detect a syntactically complete Basic Authorization credential.
 *
 * This is only called after WordPress has authenticated the request and the
 * resulting user has passed manage_options. The header is therefore a signal
 * for the Application Password transport, never an authentication decision.
 */
function justice_ops_content_first_has_basic_authorization( $request ): bool {
	// Apache/FastCGI may consume the raw header and expose only the parsed pair.
	if (
		isset( $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] )
		&& '' !== trim( (string) $_SERVER['PHP_AUTH_USER'] )
		&& '' !== (string) $_SERVER['PHP_AUTH_PW']
	) {
		return true;
	}

	$headers = array();
	if ( is_object( $request ) && method_exists( $request, 'get_header' ) ) {
		$headers[] = (string) $request->get_header( 'Authorization' );
	}
	foreach ( array( 'HTTP_AUTHORIZATION', 'REDIRECT_HTTP_AUTHORIZATION' ) as $server_key ) {
		if ( isset( $_SERVER[ $server_key ] ) ) {
			$headers[] = (string) $_SERVER[ $server_key ];
		}
	}

	foreach ( array_unique( $headers ) as $header ) {
		if ( 1 !== preg_match( '/^Basic\s+([A-Za-z0-9+\/]++={0,2})$/i', trim( $header ), $match ) ) {
			continue;
		}
		$decoded = base64_decode( $match[1], true );
		if ( false === $decoded || false === strpos( $decoded, ':' ) ) {
			continue;
		}
		list( $username ) = explode( ':', $decoded, 2 );
		if ( '' !== trim( $username ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Require an administrator authenticated by one of WordPress's two REST
 * transports: Application Password Basic auth, or cookie auth plus wp_rest
 * nonce. Capability is always checked before transport evidence.
 */
function justice_ops_content_first_rollout_permission( $request ) {
	if ( ! function_exists( 'current_user_can' ) || ! current_user_can( 'manage_options' ) ) {
		return justice_ops_content_first_rest_error( 'rest_forbidden', 'Administrator access is required.', 403 );
	}

	if ( justice_ops_content_first_has_basic_authorization( $request ) ) {
		return true;
	}

	$nonce = is_object( $request ) && method_exists( $request, 'get_header' )
		? (string) $request->get_header( 'X-WP-Nonce' )
		: '';
	if ( '' === $nonce || ! function_exists( 'wp_verify_nonce' ) || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
		return justice_ops_content_first_rest_error( 'rest_cookie_invalid_nonce', 'A valid wp_rest nonce is required for cookie authentication.', 403 );
	}

	return true;
}

/**
 * Read the current rollout state. This callback never writes or purges.
 */
function justice_ops_content_first_rollout_get( $request ): array {
	unset( $request );

	return justice_ops_content_first_rollout_payload();
}

/**
 * Purge only public-render and map data affected by a rollout-state change.
 */
function justice_ops_content_first_purge_rollout_caches(): void {
	if ( function_exists( 'justice_ops_purge_map_feed_cache' ) ) {
		justice_ops_purge_map_feed_cache();
	} elseif ( function_exists( 'delete_transient' ) ) {
		delete_transient( 'justice_map_geojson_v1' );
		delete_transient( 'justice_map_geojson_v2' );
	}
	if ( function_exists( 'do_action' ) ) {
		do_action( 'litespeed_purge_all' );
	}
	if ( function_exists( 'sg_cachepress_purge_cache' ) ) {
		sg_cachepress_purge_cache();
	}
	if ( class_exists( 'SiteGround_Optimizer\\Supercacher\\Supercacher' ) ) {
		SiteGround_Optimizer\Supercacher\Supercacher::purge_cache();
	}
	if ( function_exists( 'wp_cache_flush' ) ) {
		wp_cache_flush();
	}
}

/**
 * Store one exact, verified rollout transition.
 */
function justice_ops_content_first_rollout_post( $request ) {
	$params = is_object( $request ) && method_exists( $request, 'get_json_params' )
		? $request->get_json_params()
		: null;
	$scope = justice_ops_content_first_sanitize_rollout_state( $params, false );

	if ( null === $scope ) {
		return justice_ops_content_first_rest_error(
			'justice_content_first_invalid_scope',
			'Use mode exact with 1-50 exact local paths, or mode all/off with no paths.',
			400
		);
	}
	if ( ! function_exists( 'update_option' ) || ! function_exists( 'get_option' ) ) {
		return justice_ops_content_first_rest_error( 'justice_content_first_storage_unavailable', 'Rollout storage is unavailable.', 500 );
	}

	$current_payload = justice_ops_content_first_rollout_payload();
	$expected_hash   = is_array( $params ) ? strtolower( trim( (string) ( $params['expected_scope_hash'] ?? '' ) ) ) : '';
	if (
		64 !== strlen( $expected_hash )
		|| ! ctype_xdigit( $expected_hash )
		|| ! hash_equals( (string) $current_payload['scope_hash'], $expected_hash )
	) {
		return justice_ops_content_first_rest_error(
			'justice_content_first_scope_conflict',
			'Rollout scope changed. Read the current scope and retry with its exact hash.',
			409
		);
	}

	update_option( 'justice_ops_content_first_rollout_scope', $scope, false );
	$stored = justice_ops_content_first_sanitize_rollout_state(
		get_option( 'justice_ops_content_first_rollout_scope', null ),
		true
	);
	if ( $stored !== $scope ) {
		return justice_ops_content_first_rest_error( 'justice_content_first_write_mismatch', 'Stored rollout state did not match the request.', 500 );
	}

	justice_ops_content_first_purge_rollout_caches();

	return justice_ops_content_first_rollout_payload( $stored );
}

/**
 * Register the narrow cookie-and-nonce authenticated rollout controller.
 */
function justice_ops_content_first_register_rollout_route(): void {
	if ( ! function_exists( 'register_rest_route' ) ) {
		return;
	}

	register_rest_route(
		'justice-ops/v1',
		'/content-first-rollout',
		array(
			array(
				'methods'             => 'GET',
				'permission_callback' => 'justice_ops_content_first_rollout_permission',
				'callback'            => 'justice_ops_content_first_rollout_get',
			),
			array(
				'methods'             => 'POST',
				'permission_callback' => 'justice_ops_content_first_rollout_permission',
				'callback'            => 'justice_ops_content_first_rollout_post',
			),
		)
	);
}
add_action( 'rest_api_init', 'justice_ops_content_first_register_rollout_route' );

/**
 * Test a singular type without requiring a test double to support arrays.
 *
 * @param string[] $types Post types.
 */
function justice_ops_content_first_is_singular_type( array $types ): bool {
	if ( ! function_exists( 'is_singular' ) ) {
		return false;
	}

	foreach ( $types as $type ) {
		if ( is_singular( $type ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Exact provider-intent city routes whose legacy default-page records do not
 * reliably carry the city template or jt_city_practice metadata.
 *
 * The allowlist is sourced from the reviewed 2026-08-02 real-estate release
 * manifest. Broad slug pattern matching is intentionally prohibited.
 *
 * @return string[]
 */
function justice_ops_content_first_city_provider_paths(): array {
	$paths = array(
		'/real-estate-lawyer-modiin/',
		'/real-estate-lawyer-eilat/',
		'/real-estate-lawyer-afula/',
		'/real-estate-lawyer-akko/',
		'/real-estate-lawyer-bat-yam/',
		'/real-estate-lawyer-beer-sheva/',
		'/real-estate-lawyer-beit-shean/',
		'/real-estate-lawyer-beit-shemesh/',
		'/real-estate-lawyer-bnei-brak/',
		'/real-estate-lawyer-carmiel/',
		'/real-estate-lawyer-dimona/',
		'/real-estate-lawyer-givatayim/',
		'/real-estate-lawyer-haifa/',
		'/real-estate-lawyer-herzliya/',
		'/real-estate-lawyer-holon/',
		'/real-estate-lawyer-jerusalem/',
		'/real-estate-lawyer-kfar-saba/',
		'/real-estate-lawyer-kfar-yona/',
		'/real-estate-lawyer-migdal-haemek/',
		'/real-estate-lawyer-petah-tikva/',
		'/real-estate-lawyer-raanana/',
		'/real-estate-lawyer-ramat-gan/',
		'/real-estate-lawyer-rehovot/',
		'/real-estate-lawyer-rishon-lezion/',
		'/real-estate-lawyer-rosh-haayin/',
		'/real-estate-lawyer-tel-aviv/',
		'/real-estate-lawyer-tiberias/',
		'/real-estate-lawyer-yavne/',
	);

	if ( function_exists( 'apply_filters' ) ) {
		$paths = (array) apply_filters( 'justice_ops_content_first_city_provider_paths', $paths );
	}

	return array_values( array_unique( array_map( 'justice_ops_content_first_normalize_path', $paths ) ) );
}

/**
 * Exact comparison routes whose provider cards are the requested answer.
 *
 * @return string[]
 */
function justice_ops_content_first_comparison_paths(): array {
	$paths = array(
		'/the-recommended-family-lawyers/',
		'/criminal-lawyers-rating/',
	);

	if ( function_exists( 'apply_filters' ) ) {
		$paths = (array) apply_filters( 'justice_ops_content_first_comparison_paths', $paths );
	}

	return array_values( array_unique( array_map( 'justice_ops_content_first_normalize_path', $paths ) ) );
}

/**
 * Resolve the queried object to a real WP_Post before calling typed theme APIs.
 *
 * Taxonomy and category routes return WP_Term from get_queried_object(). Some
 * theme versions declare justice_theme_is_practice_landing_page( ?WP_Post ),
 * so passing an arbitrary object is a fatal TypeError. A post-like object may
 * be normalized through get_post(), but terms and every other object fail
 * closed without entering the typed predicate.
 *
 * @return WP_Post|null
 */
function justice_ops_content_first_queried_post() {
	if ( ! function_exists( 'get_queried_object' ) || ! class_exists( 'WP_Post' ) ) {
		return null;
	}

	$queried = get_queried_object();
	if ( $queried instanceof WP_Post ) {
		return $queried;
	}

	if (
		! is_object( $queried )
		|| ! isset( $queried->ID, $queried->post_type )
		|| ! is_numeric( $queried->ID )
		|| (int) $queried->ID <= 0
		|| ! function_exists( 'get_post' )
	) {
		return null;
	}

	$post = get_post( (int) $queried->ID );

	return $post instanceof WP_Post ? $post : null;
}

/**
 * Resolve the public route role before any ordering decision.
 *
 * Provider-intent routes never inherit editorial ordering merely because they
 * happen to use the page or articles post type. The homepage is an explicit
 * provider-intent exception based on the live Google Israel SERP for
 * "חיפוש עורך דין". Disclosure normalization still applies there.
 */
function justice_ops_content_first_route_role(): string {
	$path = justice_ops_content_first_request_path();

	if ( justice_ops_content_first_is_singular_type( array( 'justice_lawyer' ) ) ) {
		return 'provider_profile';
	}

	if (
		'/lawyers/' === $path
		|| ! empty( $GLOBALS['jt_lawyer_archive_view'] )
		|| ( function_exists( 'is_post_type_archive' ) && is_post_type_archive( 'justice_lawyer' ) )
		|| ( function_exists( 'is_page' ) && is_page( 'lawyers' ) )
	) {
		return 'provider_directory';
	}

	$queried_id = function_exists( 'get_queried_object_id' ) ? (int) get_queried_object_id() : 0;
	if (
		in_array( $path, justice_ops_content_first_city_provider_paths(), true )
		||
		( function_exists( 'is_page_template' ) && is_page_template( 'page-city-practice.php' ) )
		|| ( $queried_id > 0 && function_exists( 'get_post_meta' ) && '' !== trim( (string) get_post_meta( $queried_id, 'jt_city_practice', true ) ) )
	) {
		return 'provider_city';
	}

	if (
		in_array( $path, justice_ops_content_first_comparison_paths(), true )
		|| ( function_exists( 'justice_ops_comparison_is_target' ) && justice_ops_comparison_is_target() )
	) {
		return 'provider_comparison';
	}

	if ( function_exists( 'is_front_page' ) && is_front_page() ) {
		return 'provider_home';
	}

	if ( function_exists( 'is_tax' ) && is_tax( 'practice-areas' ) ) {
		return 'editorial_taxonomy';
	}

	$pillar = function_exists( 'is_page_template' ) && is_page_template( 'page-legal-pillar.php' );
	if ( ! $pillar && function_exists( 'justice_theme_get_controlled_practice_route_template' ) ) {
		$pillar = '' !== (string) justice_theme_get_controlled_practice_route_template();
	}
	if ( ! $pillar && function_exists( 'justice_theme_is_practice_landing_page' ) ) {
		$queried_post = justice_ops_content_first_queried_post();
		$pillar       = null !== $queried_post && justice_theme_is_practice_landing_page( $queried_post );
	}
	if ( $pillar ) {
		return 'editorial_pillar';
	}

	if ( justice_ops_content_first_is_singular_type( array( 'articles', 'post', 'page', 'justice_term', 'justice_question' ) ) ) {
		return 'editorial_singular';
	}

	return 'other';
}

/**
 * Protect raw-text elements and comments during structural scans.
 *
 * @param array<string,string> $protected Token-to-source map.
 */
function justice_ops_content_first_protect_raw_text( string $html, array &$protected ): string {
	$protected = array();
	$prefix    = 'JTCF_' . substr( hash( 'sha256', $html ), 0, 12 );
	$updated   = preg_replace_callback(
		'#<(script|style|title|textarea|template|noscript|xmp)\b[^>]*>[\s\S]*?</\1\s*>|<!--[\s\S]*?-->#iu',
		static function ( array $match ) use ( &$protected, $prefix ): string {
			$token               = '<!--' . $prefix . '_' . count( $protected ) . '-->';
			$protected[ $token ] = $match[0];

			return $token;
		},
		$html
	);

	return is_string( $updated ) ? $updated : $html;
}

/**
 * Read class tokens from one opening tag.
 *
 * @return string[]
 */
function justice_ops_content_first_tag_classes( string $tag_html ): array {
	$matched = preg_match(
		'#(?:^|[\x20\t\r\n\f])class\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+))#iu',
		$tag_html,
		$class_match
	);

	if ( 1 !== $matched ) {
		return array();
	}

	$value = '';
	foreach ( array( 1, 2, 3 ) as $index ) {
		if ( isset( $class_match[ $index ] ) && '' !== $class_match[ $index ] ) {
			$value = $class_match[ $index ];
			break;
		}
	}

	return '' === trim( $value ) ? array() : preg_split( '/\s+/u', trim( $value ) );
}

/**
 * Scan HTML tags without treating a greater-than sign inside quotes as a close.
 * Raw-text elements must be protected before calling this function.
 *
 * @return array<int,array{start:int,end:int,html:string,name:string,closing:bool,self_closing:bool,classes:array}>
 */
function justice_ops_content_first_scan_tags( string $html ): array {
	$tags        = array();
	$length      = strlen( $html );
	$cursor      = 0;
	$void_names  = array( 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr' );

	while ( $cursor < $length ) {
		$start = strpos( $html, '<', $cursor );
		if ( false === $start ) {
			break;
		}

		$quote = '';
		$end   = null;
		for ( $i = $start + 1; $i < $length; $i++ ) {
			$char = $html[ $i ];
			if ( '' !== $quote ) {
				if ( $char === $quote ) {
					$quote = '';
				}
				continue;
			}
			if ( '"' === $char || "'" === $char ) {
				$quote = $char;
				continue;
			}
			if ( '>' === $char ) {
				$end = $i + 1;
				break;
			}
		}

		if ( null === $end ) {
			break;
		}

		$tag_html = substr( $html, $start, $end - $start );
		if ( 1 === preg_match( '#^<\s*(/?)\s*([a-z][a-z0-9:-]*)\b#iu', $tag_html, $match ) ) {
			$name         = strtolower( $match[2] );
			$closing      = '/' === $match[1];
			$self_closing = ! $closing && ( 1 === preg_match( '#/\s*>$#u', $tag_html ) || in_array( $name, $void_names, true ) );
			$tags[]       = array(
				'start'        => $start,
				'end'          => $end,
				'html'         => $tag_html,
				'name'         => $name,
				'closing'      => $closing,
				'self_closing' => $self_closing,
				'classes'      => $closing ? array() : justice_ops_content_first_tag_classes( $tag_html ),
			);
		}

		$cursor = $end;
	}

	return $tags;
}

/**
 * Find all balanced elements carrying an exact class token.
 *
 * Null means at least one matching opening element was malformed.
 *
 * @param array $tags Output of justice_ops_content_first_scan_tags().
 * @return array<int,array{start:int,end:int,open_end:int,close_start:int,element:string}>|null
 */
function justice_ops_content_first_find_class_blocks( string $html, array $tags, string $class_name ): ?array {
	$opening_indexes = array();
	foreach ( $tags as $index => $tag ) {
		if ( ! $tag['closing'] && in_array( $class_name, $tag['classes'], true ) ) {
			$opening_indexes[] = $index;
		}
	}

	$blocks = array();
	foreach ( $opening_indexes as $opening_index ) {
		$opening = $tags[ $opening_index ];
		if ( $opening['self_closing'] ) {
			return null;
		}

		$depth = 1;
		$close = null;
		for ( $i = $opening_index + 1, $count = count( $tags ); $i < $count; $i++ ) {
			$tag = $tags[ $i ];
			if ( $tag['name'] !== $opening['name'] ) {
				continue;
			}
			if ( $tag['closing'] ) {
				--$depth;
				if ( 0 === $depth ) {
					$close = $tag;
					break;
				}
			} elseif ( ! $tag['self_closing'] ) {
				++$depth;
			}
		}

		if ( null === $close ) {
			return null;
		}

		$blocks[] = array(
			'start'       => $opening['start'],
			'end'         => $close['end'],
			'open_end'    => $opening['end'],
			'close_start' => $close['start'],
			'element'     => substr( $html, $opening['start'], $close['end'] - $opening['start'] ),
		);
	}

	return $blocks;
}

/**
 * Whether one parsed block is wholly inside another.
 */
function justice_ops_content_first_block_contains( array $outer, array $inner ): bool {
	return $inner['start'] > $outer['start'] && $inner['end'] < $outer['end'];
}

/**
 * Read one named attribute from an opening tag.
 */
function justice_ops_content_first_tag_attribute( string $tag_html, string $name ): string {
	$name = preg_quote( $name, '#' );
	if ( 1 !== preg_match( '#(?:^|[\x20\t\r\n\f])' . $name . '\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+))#iu', $tag_html, $match ) ) {
		return '';
	}

	foreach ( array( 1, 2, 3 ) as $index ) {
		if ( isset( $match[ $index ] ) && '' !== $match[ $index ] ) {
			return html_entity_decode( $match[ $index ], ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		}
	}

	return '';
}

/**
 * Normalize visible text for an exact disclosure comparison.
 */
function justice_ops_content_first_visible_text( string $html ): string {
	$text = function_exists( 'wp_strip_all_tags' ) ? wp_strip_all_tags( $html ) : strip_tags( $html );
	$text = html_entity_decode( (string) $text, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	$text = preg_replace( '/\s+/u', ' ', trim( $text ) );

	return is_string( $text ) ? $text : '';
}

/**
 * Require exactly one visible disclosure node carrying the controlled label.
 */
function justice_ops_content_first_has_promoted_disclosure( string $html, string $class_name ): bool {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$labels    = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );

	return is_array( $labels )
		&& 1 === count( $labels )
		&& 'מקודם' === justice_ops_content_first_visible_text( $labels[0]['element'] );
}

/**
 * Resolve the profile ID represented by a rendered provider card.
 *
 * Plugin cards carry data-l. Theme cards are resolved through their public
 * profile permalink without requiring a theme edit.
 */
function justice_ops_content_first_card_profile_id( array $block ): int {
	static $resolved_by_href = array();

	$opening_length = max( 0, (int) $block['open_end'] - (int) $block['start'] );
	$opening_tag    = substr( (string) $block['element'], 0, $opening_length );

	foreach ( array( 'data-l', 'data-lawyer-id' ) as $attribute ) {
		$value = justice_ops_content_first_tag_attribute( $opening_tag, $attribute );
		if ( ctype_digit( $value ) && (int) $value > 0 ) {
			return (int) $value;
		}
	}

	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( (string) $block['element'], $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$href      = '';

	foreach ( $tags as $tag ) {
		if ( $tag['closing'] || 'a' !== $tag['name'] ) {
			continue;
		}
		$classes = (array) $tag['classes'];
		if (
			! array_intersect(
				$classes,
				array( 'lawyer-card__media', 'lawyer-card__name-link', 'jt-premium-card__photo-link', 'jt-premium-card__name', 'jt-procard__profile' )
			)
		) {
			continue;
		}
		$href = justice_ops_content_first_tag_attribute( $tag['html'], 'href' );
		if ( '' !== $href ) {
			break;
		}
	}

	if ( '' === $href ) {
		return 0;
	}
	if ( array_key_exists( $href, $resolved_by_href ) ) {
		return (int) $resolved_by_href[ $href ];
	}

	if ( function_exists( 'url_to_postid' ) ) {
		$post_id = (int) url_to_postid( $href );
		if ( $post_id > 0 ) {
			$resolved_by_href[ $href ] = $post_id;
			return $post_id;
		}
	}

	if ( ! function_exists( 'get_page_by_path' ) ) {
		$resolved_by_href[ $href ] = 0;
		return 0;
	}

	$path = (string) wp_parse_url( $href, PHP_URL_PATH );
	$slug = basename( trim( $path, '/' ) );
	$post = '' !== $slug ? get_page_by_path( $slug, OBJECT, 'justice_lawyer' ) : null;

	$resolved_by_href[ $href ] = $post instanceof WP_Post ? (int) $post->ID : 0;

	return (int) $resolved_by_href[ $href ];
}

/**
 * Canonical active-paid profile gate for any card allowed above the answer.
 *
 * sponsored_placement_status alone is intentionally insufficient. The owner
 * allowed an upper placement for a paid card, not for a reserved or editorial
 * promotion. Public approval and the professional-cards sponsorship contract
 * remain mandatory additional gates.
 */
function justice_ops_content_first_profile_is_active_paid( int $lawyer_id ): bool {
	static $memo = array();

	$country   = function_exists( 'justice_cards_country_context' ) ? (string) justice_cards_country_context() : '';
	$cache_key = $lawyer_id . '|' . $country;
	if ( array_key_exists( $cache_key, $memo ) ) {
		return (bool) $memo[ $cache_key ];
	}

	if (
		$lawyer_id <= 0
		|| ! function_exists( 'get_post_meta' )
		|| ! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		|| ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id )
	) {
		$memo[ $cache_key ] = false;
		return false;
	}

	if ( function_exists( 'get_post_type' ) && 'justice_lawyer' !== get_post_type( $lawyer_id ) ) {
		$memo[ $cache_key ] = false;
		return false;
	}

	$subscription = function_exists( 'sanitize_key' )
		? sanitize_key( (string) get_post_meta( $lawyer_id, 'subscription_status', true ) )
		: strtolower( trim( (string) get_post_meta( $lawyer_id, 'subscription_status', true ) ) );
	$plan = function_exists( 'sanitize_key' )
		? sanitize_key( (string) get_post_meta( $lawyer_id, 'plan_type', true ) )
		: strtolower( trim( (string) get_post_meta( $lawyer_id, 'plan_type', true ) ) );
	$paid_keys = function_exists( 'justice_cards_active_paid_plan_keys' )
		? justice_cards_active_paid_plan_keys()
		: array( 'pro', 'featured', 'premium', 'lead_partner', 'full_service' );

	if ( 'active' !== $subscription || ! in_array( $plan, (array) $paid_keys, true ) ) {
		$memo[ $cache_key ] = false;
		return false;
	}

	if (
		! function_exists( 'justice_cards_has_public_sponsored_placement' )
		|| ! justice_cards_has_public_sponsored_placement( $lawyer_id )
	) {
		$memo[ $cache_key ] = false;
		return false;
	}

	if ( '' !== $country ) {
		if (
			(
				! function_exists( 'justice_cards_has_verified_jurisdiction_eligibility' )
				|| ! justice_cards_has_verified_jurisdiction_eligibility( $lawyer_id, $country )
			)
		) {
			$memo[ $cache_key ] = false;
			return false;
		}
	}

	$memo[ $cache_key ] = true;
	return true;
}

/**
 * True only for a plugin sponsored card that may remain inline.
 */
function justice_ops_content_first_procard_is_inline_paid( array $block ): bool {
	return justice_ops_content_first_has_promoted_disclosure( (string) $block['element'], 'jt-procard__sponsored' )
		&& justice_ops_content_first_profile_is_active_paid( justice_ops_content_first_card_profile_id( $block ) );
}

/**
 * True only for a theme card that may remain above a practice guide.
 */
function justice_ops_content_first_theme_card_is_inline_paid( array $block ): bool {
	return justice_ops_content_first_has_promoted_disclosure( (string) $block['element'], 'lawyer-card__status--sponsored' )
		&& justice_ops_content_first_profile_is_active_paid( justice_ops_content_first_card_profile_id( $block ) );
}

/**
 * Return an active-paid theme card with the one public disclosure normalized.
 *
 * The current theme prints "כרטיס רשום" for both paid and reserved placement.
 * Only the canonical active-paid state may stay high, and its visible label is
 * rewritten to the owner's required, unambiguous "מקודם" disclosure.
 *
 * Null means the card must remain in the organic lower section.
 */
function justice_ops_content_first_normalize_theme_paid_card( array $block ): ?string {
	if ( ! justice_ops_content_first_profile_is_active_paid( justice_ops_content_first_card_profile_id( $block ) ) ) {
		return null;
	}

	$element   = (string) $block['element'];
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $element, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$labels    = justice_ops_content_first_find_class_blocks( $masked, $tags, 'lawyer-card__status--sponsored' );

	if ( ! is_array( $labels ) || 1 !== count( $labels ) ) {
		return null;
	}

	$label  = $labels[0];
	$masked = substr_replace(
		$masked,
		'מקודם',
		(int) $label['open_end'],
		(int) $label['close_start'] - (int) $label['open_end']
	);

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Remove only repeated generated sec-N IDs from later H2 elements.
 *
 * The first occurrence remains the stable fragment target. Other IDs are not
 * rewritten because duplicate form, map or widget IDs indicate a structural
 * failure that acceptance tests must catch rather than silently rename.
 */
function justice_ops_content_first_dedupe_heading_ids( string $content ): string {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $content, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$seen      = array();
	$changes   = array();

	foreach ( $tags as $tag ) {
		if ( $tag['closing'] || 'h2' !== $tag['name'] ) {
			continue;
		}
		if ( 1 !== preg_match( '/\sid\s*=\s*(?:"(sec-\d+)"|\'(sec-\d+)\'|(sec-\d+)(?:\s|>))/iu', $tag['html'], $id_match ) ) {
			continue;
		}
		$id = '';
		foreach ( array( 1, 2, 3 ) as $index ) {
			if ( '' !== ( $id_match[ $index ] ?? '' ) ) {
				$id = strtolower( $id_match[ $index ] );
				break;
			}
		}
		if ( '' === $id ) {
			continue;
		}
		if ( ! isset( $seen[ $id ] ) ) {
			$seen[ $id ] = true;
			continue;
		}
		$replacement = preg_replace(
			'/\sid\s*=\s*(?:"sec-\d+"|\'sec-\d+\'|sec-\d+(?=\s|>))/iu',
			'',
			$tag['html'],
			1
		);
		if ( is_string( $replacement ) && $replacement !== $tag['html'] ) {
			$changes[] = array(
				'start' => $tag['start'],
				'end'   => $tag['end'],
				'html'  => $replacement,
			);
		}
	}

	usort( $changes, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $changes as $change ) {
		$masked = substr_replace( $masked, $change['html'], $change['start'], $change['end'] - $change['start'] );
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Move organic provider modules and undisclosed/unverified manual cards behind
 * the complete editorial body.
 */
function justice_ops_content_first_reorder_html( string $content ): string {
	if ( '' === $content ) {
		return $content;
	}

	// A real marker is idempotent. A literal marker collision is unexpected.
	// Both cases fail closed and preserve the exact input bytes.
	if ( false !== strpos( $content, 'data-jt-content-first-order' ) || false !== strpos( $content, 'jt-content-first-order' ) ) {
		return $content;
	}

	$original  = $content;
	$protected = array();
	$content   = justice_ops_content_first_protect_raw_text( $content, $protected );
	$tags      = justice_ops_content_first_scan_tags( $content );
	$classes   = array( 'single-article__fold', 'jt-cmenu', 'jt-firm-strip' );
	$blocks    = array();

	foreach ( $classes as $class_name ) {
		$found = justice_ops_content_first_find_class_blocks( $content, $tags, $class_name );
		if ( null === $found || count( $found ) > 1 ) {
			return $original;
		}
		$blocks[ $class_name ] = $found[0] ?? null;
	}

	$fold = $blocks['single-article__fold'];
	$menu = $blocks['jt-cmenu'];
	$strip = $blocks['jt-firm-strip'];
	$procards = justice_ops_content_first_find_class_blocks( $content, $tags, 'jt-procard' );
	if ( null === $procards ) {
		return $original;
	}

	// The live Cyprus DOM nests jt-cmenu inside the fold's jtcm-wrap. The fold
	// must move as one byte-identical unit. The reverse nesting is invalid.
	if ( null !== $fold && null !== $menu && justice_ops_content_first_block_contains( $menu, $fold ) ) {
		return $original;
	}
	if ( null !== $fold && null !== $strip && justice_ops_content_first_block_contains( $strip, $fold ) ) {
		return $original;
	}

	$moved = array();
	if ( null !== $menu && ( null === $fold || ! justice_ops_content_first_block_contains( $fold, $menu ) ) ) {
		$moved['jt-cmenu'] = $menu;
	}
	if ( null !== $fold ) {
		$moved['single-article__fold'] = $fold;
	}
	if ( null !== $strip && ( null === $fold || ! justice_ops_content_first_block_contains( $fold, $strip ) ) ) {
		$moved['jt-firm-strip'] = $strip;
	}
	foreach ( $procards as $procard ) {
		foreach ( $moved as $organic_block ) {
			if ( justice_ops_content_first_block_contains( $procard, $organic_block ) ) {
				return $original;
			}
		}
	}

	$moved_procards = array();
	foreach ( $procards as $procard ) {
		if ( justice_ops_content_first_procard_is_inline_paid( $procard ) ) {
			continue;
		}

		// A card already inside a moved organic module travels with its parent.
		$inside_moved_parent = false;
		foreach ( $moved as $parent ) {
			if ( justice_ops_content_first_block_contains( $parent, $procard ) ) {
				$inside_moved_parent = true;
				break;
			}
		}
		if ( $inside_moved_parent ) {
			continue;
		}

		$moved_procards[] = $procard;
	}

	if ( empty( $moved ) && empty( $moved_procards ) ) {
		return $original;
	}

	// Any overlap not explained by a descendant retained inside the fold is an
	// unexpected tree shape. Do not attempt a partial reorder.
	$ranges = array_merge( array_values( $moved ), $moved_procards );
	for ( $i = 0, $count = count( $ranges ); $i < $count; $i++ ) {
		for ( $j = $i + 1; $j < $count; $j++ ) {
			if ( $ranges[ $i ]['start'] < $ranges[ $j ]['end'] && $ranges[ $j ]['start'] < $ranges[ $i ]['end'] ) {
				return $original;
			}
		}
	}

	usort( $ranges, static function ( array $a, array $b ): int {
		return $b['start'] <=> $a['start'];
	} );
	foreach ( $ranges as $range ) {
		$content = substr_replace( $content, '', $range['start'], $range['end'] - $range['start'] );
	}

	$tail = '<div class="jt-content-first-order" data-jt-content-first-order="2026-08-03-r3">';
	foreach ( array( 'jt-cmenu', 'single-article__fold' ) as $class_name ) {
		if ( isset( $moved[ $class_name ] ) ) {
			$tail .= $moved[ $class_name ]['element'];
		}
	}
	usort( $moved_procards, static fn( array $a, array $b ): int => $a['start'] <=> $b['start'] );
	foreach ( $moved_procards as $procard ) {
		$tail .= $procard['element'];
	}
	if ( isset( $moved['jt-firm-strip'] ) ) {
		$tail .= $moved['jt-firm-strip']['element'];
	}
	$tail   .= '</div>';
	$content = rtrim( $content ) . $tail;

	return empty( $protected ) ? $content : strtr( $content, $protected );
}

/**
 * Apply article ordering only to the public main-loop body.
 */
function justice_ops_content_first_filter( $content ): string {
	$content = (string) $content;

	if (
		! justice_ops_content_first_rollout_allows_path()
		|| 'editorial_singular' !== justice_ops_content_first_route_role()
		|| ! in_the_loop()
		|| ! is_main_query()
		|| is_feed()
		|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() )
		|| ( function_exists( 'is_preview' ) && is_preview() )
		|| ( function_exists( 'is_embed' ) && is_embed() )
		|| ( function_exists( 'is_admin' ) && is_admin() )
	) {
		return $content;
	}

	foreach ( array( 'preview', 'feed', 'embed', 'rest_route' ) as $variant ) {
		if ( isset( $_GET[ $variant ] ) ) {
			return $content;
		}
	}

	$ordered = justice_ops_content_first_reorder_html( $content );
	$marked  = 1 === preg_match( '#<div\b[^>]*class=["\'][^"\']*\bjt-content-first-order\b[^"\']*["\'][^>]*>#iu', $ordered );

	return $ordered !== $content || $marked
		? justice_ops_content_first_dedupe_heading_ids( $ordered )
		: $content;
}
add_filter( 'the_content', 'justice_ops_content_first_filter', PHP_INT_MAX );

/**
 * Split an early practice-taxonomy lawyer section into paid-high and
 * organic-bottom output without duplicating the section's ID.
 *
 * @return array{high:string,bottom:string}|null Null means malformed card DOM.
 */
function justice_ops_content_first_split_practice_lawyers( array $section ): ?array {
	$section_html = (string) $section['element'];
	$tags         = justice_ops_content_first_scan_tags( $section_html );
	$cards        = justice_ops_content_first_find_class_blocks( $section_html, $tags, 'lawyer-card' );

	if ( null === $cards ) {
		return null;
	}
	if ( empty( $cards ) ) {
		return array(
			'high'   => '',
			'bottom' => $section_html,
		);
	}

	$paid = array();
	foreach ( $cards as $card ) {
		$normalized = justice_ops_content_first_normalize_theme_paid_card( $card );
		if ( null !== $normalized ) {
			$card['normalized'] = $normalized;
			$paid[]             = $card;
		}
	}

	if ( empty( $paid ) ) {
		return array(
			'high'   => '',
			'bottom' => $section_html,
		);
	}

	// Nested lawyer-card elements are not a supported card template shape.
	for ( $i = 0, $count = count( $cards ); $i < $count; $i++ ) {
		for ( $j = $i + 1; $j < $count; $j++ ) {
			if ( $cards[ $i ]['start'] < $cards[ $j ]['end'] && $cards[ $j ]['start'] < $cards[ $i ]['end'] ) {
				return null;
			}
		}
	}

	if ( count( $paid ) === count( $cards ) ) {
		$high = $section_html;
		usort( $paid, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
		foreach ( $paid as $card ) {
			$high = substr_replace( $high, $card['normalized'], $card['start'], $card['end'] - $card['start'] );
		}

		return array(
			'high'   => $high,
			'bottom' => '',
		);
	}

	$bottom = $section_html;
	$paid_descending = $paid;
	usort( $paid_descending, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $paid_descending as $card ) {
		$bottom = substr_replace( $bottom, '', $card['start'], $card['end'] - $card['start'] );
	}

	usort( $paid, static fn( array $a, array $b ): int => $a['start'] <=> $b['start'] );
	$high = '<section class="jt-taxonomy-paid-placement section" data-jt-taxonomy-paid-placement="active-paid" aria-label="מקודם">'
		. '<div class="container"><div class="lawyers-grid">';
	foreach ( $paid as $card ) {
		$high .= $card['normalized'];
	}
	$high .= '</div></div></section>';

	return array(
		'high'   => $high,
		'bottom' => $bottom,
	);
}

/**
 * Reorder a rendered practice taxonomy after every inner output buffer has
 * added the full term guide. Directory and profile templates never reach this
 * transformer.
 */
function justice_ops_practice_taxonomy_reorder_html( string $html ): string {
	if ( '' === $html ) {
		return $html;
	}
	if (
		false !== strpos( $html, 'data-jt-practice-taxonomy-content-first' )
		|| false !== strpos( $html, 'jt-practice-taxonomy-content-first' )
	) {
		return $html;
	}

	$original  = $html;
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$guides    = justice_ops_content_first_find_class_blocks( $masked, $tags, 'practice-hub-content' );

	if ( ! is_array( $guides ) || 1 !== count( $guides ) ) {
		return $original;
	}
	$guide = $guides[0];

	$lawyer_sections = justice_ops_content_first_find_class_blocks( $masked, $tags, 'practice-hub-lawyers' );
	if ( null === $lawyer_sections ) {
		return $original;
	}

	$replacements = array();
	$tail_entries = array();
	foreach ( $lawyer_sections as $section ) {
		if ( $section['start'] >= $guide['start'] ) {
			continue;
		}
		$split = justice_ops_content_first_split_practice_lawyers( $section );
		if ( null === $split ) {
			return $original;
		}
		if ( $split['high'] !== $section['element'] || '' !== $split['bottom'] ) {
			$replacements[] = array(
				'start' => $section['start'],
				'end'   => $section['end'],
				'html'  => $split['high'],
			);
		}
		if ( '' !== $split['bottom'] ) {
			$tail_entries[] = array(
				'start' => $section['start'],
				'html'  => $split['bottom'],
			);
		}
	}

	$provider_classes = array(
		'jt-midfold',
		'single-article__fold',
		'jt-registered-band',
		'jtcm-wrap',
		'jt-cmenu',
		'jt-firm-strip',
	);
	$provider_blocks = array();
	foreach ( $provider_classes as $class_name ) {
		$found = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );
		if ( null === $found ) {
			return $original;
		}
		foreach ( $found as $block ) {
			if ( $block['start'] >= $guide['start'] ) {
				continue;
			}
			$inside_lawyer_section = false;
			foreach ( $lawyer_sections as $section ) {
				if ( justice_ops_content_first_block_contains( $section, $block ) ) {
					$inside_lawyer_section = true;
					break;
				}
			}
			if ( ! $inside_lawyer_section ) {
				$provider_blocks[] = $block;
			}
		}
	}

	// Move only outer provider blocks so maps or menus nested in a fold retain
	// their byte-exact DOM and JavaScript bindings.
	$outer_provider_blocks = array();
	foreach ( $provider_blocks as $candidate_index => $candidate ) {
		$nested = false;
		foreach ( $provider_blocks as $other_index => $other ) {
			if ( $candidate_index !== $other_index && justice_ops_content_first_block_contains( $other, $candidate ) ) {
				$nested = true;
				break;
			}
		}
		if ( ! $nested ) {
			$outer_provider_blocks[] = $candidate;
		}
	}

	foreach ( $outer_provider_blocks as $block ) {
		$replacements[] = array(
			'start' => $block['start'],
			'end'   => $block['end'],
			'html'  => '',
		);
		$tail_entries[] = array(
			'start' => $block['start'],
			'html'  => $block['element'],
		);
	}

	if ( empty( $replacements ) ) {
		return $original;
	}

	// Any unexplained overlap means a new theme shape. Preserve it untouched.
	for ( $i = 0, $count = count( $replacements ); $i < $count; $i++ ) {
		for ( $j = $i + 1; $j < $count; $j++ ) {
			if (
				$replacements[ $i ]['start'] < $replacements[ $j ]['end']
				&& $replacements[ $j ]['start'] < $replacements[ $i ]['end']
			) {
				return $original;
			}
		}
	}

	usort( $replacements, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $replacements as $replacement ) {
		$masked = substr_replace(
			$masked,
			$replacement['html'],
			$replacement['start'],
			$replacement['end'] - $replacement['start']
		);
	}

	if ( ! empty( $tail_entries ) ) {
		$updated_tags = justice_ops_content_first_scan_tags( $masked );
		$terminal     = justice_ops_content_first_terminal_block(
			$masked,
			$updated_tags,
			array( 'practice-hub-content', 'practice-hub-tools', 'practice-hub-related' )
		);
		if ( null === $terminal ) {
			return $original;
		}

		usort( $tail_entries, static fn( array $a, array $b ): int => $a['start'] <=> $b['start'] );
		$tail = '<div class="jt-practice-taxonomy-content-first" data-jt-practice-taxonomy-content-first="2026-08-03-r2">';
		foreach ( $tail_entries as $entry ) {
			$tail .= $entry['html'];
		}
		$tail .= '</div>';
		$masked = substr_replace( $masked, $tail, $terminal['end'], 0 );
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Whether this response is the public practice taxonomy HTML document.
 */
function justice_ops_practice_taxonomy_should_buffer(): bool {
	if (
		! justice_ops_content_first_rollout_allows_path()
		|| 'editorial_taxonomy' !== justice_ops_content_first_route_role()
		|| ( function_exists( 'is_admin' ) && is_admin() )
		|| ( function_exists( 'is_feed' ) && is_feed() )
		|| ( function_exists( 'is_preview' ) && is_preview() )
		|| ( function_exists( 'is_embed' ) && is_embed() )
		|| ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() )
		|| ( function_exists( 'wp_doing_ajax' ) && wp_doing_ajax() )
		|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
	) {
		return false;
	}

	foreach ( array( 'preview', 'feed', 'embed', 'rest_route' ) as $variant ) {
		if ( isset( $_GET[ $variant ] ) ) {
			return false;
		}
	}

	return true;
}

/**
 * Open the outer practice buffer before the legacy priority-10 polish buffer.
 */
function justice_ops_practice_taxonomy_start_content_first_buffer(): void {
	if ( justice_ops_practice_taxonomy_should_buffer() ) {
		ob_start( 'justice_ops_practice_taxonomy_reorder_html' );
	}
}
add_action( 'template_redirect', 'justice_ops_practice_taxonomy_start_content_first_buffer', 1 );

/**
 * Remove every balanced element carrying one exact class from a fragment.
 *
 * Null means malformed markup. Callers then preserve the original response.
 */
function justice_ops_content_first_remove_fragment_class( string $html, string $class_name ): ?string {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$blocks    = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );

	if ( null === $blocks ) {
		return null;
	}

	$outer = array();
	foreach ( $blocks as $index => $candidate ) {
		$nested = false;
		foreach ( $blocks as $other_index => $other ) {
			if ( $index !== $other_index && justice_ops_content_first_block_contains( $other, $candidate ) ) {
				$nested = true;
				break;
			}
		}
		if ( ! $nested ) {
			$outer[] = $candidate;
		}
	}

	usort( $outer, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $outer as $block ) {
		$masked = substr_replace( $masked, '', $block['start'], $block['end'] - $block['start'] );
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Insert one disclosure as the last child of a known card sub-container.
 */
function justice_ops_content_first_insert_fragment_disclosure( string $html, string $parent_class, string $disclosure ): ?string {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$parents   = justice_ops_content_first_find_class_blocks( $masked, $tags, $parent_class );

	if ( null === $parents || count( $parents ) > 1 ) {
		return null;
	}

	if ( 1 === count( $parents ) ) {
		$masked = substr_replace( $masked, $disclosure, $parents[0]['close_start'], 0 );
	} else {
		$opening = null;
		foreach ( $tags as $tag ) {
			if ( ! $tag['closing'] && ! $tag['self_closing'] ) {
				$opening = $tag;
				break;
			}
		}
		if ( null === $opening ) {
			return null;
		}
		$masked = substr_replace( $masked, $disclosure, $opening['end'], 0 );
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Strip paid-only root classes when the represented profile fails the gate.
 *
 * @param string[] $remove Class tokens to remove.
 */
function justice_ops_content_first_remove_root_classes( string $html, array $remove ): string {
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$opening   = null;

	foreach ( $tags as $tag ) {
		if ( ! $tag['closing'] ) {
			$opening = $tag;
			break;
		}
	}

	if ( null === $opening ) {
		return $html;
	}

	$classes = array_values( array_diff( (array) $opening['classes'], $remove ) );
	$tag_html = preg_replace(
		'#(?:^|[\x20\t\r\n\f])class\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)#iu',
		' class="' . htmlspecialchars( implode( ' ', $classes ), ENT_QUOTES | ENT_HTML5, 'UTF-8' ) . '"',
		$opening['html'],
		1
	);

	if ( ! is_string( $tag_html ) ) {
		return $html;
	}

	$masked = substr_replace( $masked, $tag_html, $opening['start'], $opening['end'] - $opening['start'] );

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Normalize one provider card against the canonical paid-placement truth.
 */
function justice_ops_content_first_normalize_public_card( array $block, string $kind ): string {
	$original = (string) $block['element'];
	$paid     = justice_ops_content_first_profile_is_active_paid( justice_ops_content_first_card_profile_id( $block ) );
	$updated  = $original;

	if ( 'lawyer-card' === $kind ) {
		$updated = justice_ops_content_first_remove_fragment_class( $updated, 'lawyer-card__commercial-disclosure' );
		if ( null === $updated ) {
			return $original;
		}
		$updated = justice_ops_content_first_remove_fragment_class( $updated, 'lawyer-card__status--sponsored' );
		if ( null === $updated ) {
			return $original;
		}

		if ( $paid ) {
			$updated = justice_ops_content_first_insert_fragment_disclosure(
				$updated,
				'lawyer-card__top',
				'<span class="lawyer-card__status lawyer-card__status--sponsored" data-jt-sponsored-disclosure="active-paid">מקודם</span>'
			);
			return null === $updated ? $original : $updated;
		}

		return justice_ops_content_first_remove_root_classes(
			$updated,
			array( 'lawyer-card--paid', 'lawyer-card--sponsored', 'lawyer-card--promoted' )
		);
	}

	if ( 'jt-procard' === $kind ) {
		$updated = justice_ops_content_first_remove_fragment_class( $updated, 'jt-procard__sponsored' );
		if ( null === $updated ) {
			return $original;
		}
		if ( ! $paid ) {
			return $updated;
		}

		$updated = justice_ops_content_first_insert_fragment_disclosure(
			$updated,
			'jt-procard__ribbon',
			'<em class="jt-procard__sponsored" data-jt-sponsored-disclosure="active-paid">מקודם</em>'
		);
		return null === $updated ? $original : $updated;
	}

	if ( 'jt-premium-card' === $kind ) {
		$updated = justice_ops_content_first_remove_fragment_class( $updated, 'jt-premium-card__sponsored' );
		if ( null === $updated ) {
			return $original;
		}
		if ( ! $paid ) {
			return $updated;
		}

		$updated = justice_ops_content_first_insert_fragment_disclosure(
			$updated,
			'jt-premium-card__body',
			'<span class="jt-premium-card__sponsored" data-jt-sponsored-disclosure="active-paid">מקודם</span>'
		);
		return null === $updated ? $original : $updated;
	}

	return $original;
}

/**
 * Decide whether a rendered card can carry a paid or relationship claim.
 *
 * Organic theme directory cards have no such marker. Skipping them before
 * profile resolution prevents an uncached URL/meta lookup for every result on
 * large directory pages while still policing every promoted-looking surface.
 */
function justice_ops_content_first_card_requires_normalization( array $block, string $kind ): bool {
	if ( 'lawyer-card' !== $kind ) {
		return true;
	}

	$element = (string) $block['element'];
	foreach (
		array(
			'lawyer-card--paid',
			'lawyer-card--sponsored',
			'lawyer-card--promoted',
			'lawyer-card__status--sponsored',
			'lawyer-card__commercial-disclosure',
		)
		as $marker
	) {
		if ( false !== strpos( $element, $marker ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Replace all nonnested instances of one card class in the full document.
 */
function justice_ops_content_first_normalize_card_class( string $html, string $class_name ): string {
	$original  = $html;
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$blocks    = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );

	if ( null === $blocks ) {
		return $original;
	}

	// Blocks are validated in one ordered pass rather than an O(n^2) pairwise
	// comparison. A nested duplicate class still fails closed.
	usort( $blocks, static fn( array $a, array $b ): int => $a['start'] <=> $b['start'] );
	$previous_end = -1;
	foreach ( $blocks as $block ) {
		if ( (int) $block['start'] < $previous_end ) {
			return $original;
		}
		$previous_end = (int) $block['end'];
	}

	usort( $blocks, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $blocks as $block ) {
		if ( ! justice_ops_content_first_card_requires_normalization( $block, $class_name ) ) {
			continue;
		}
		$replacement = justice_ops_content_first_normalize_public_card( $block, $class_name );
		$masked      = substr_replace( $masked, $replacement, $block['start'], $block['end'] - $block['start'] );
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Apply one paid-truth contract to every known server-rendered card surface.
 */
function justice_ops_content_first_normalize_public_disclosures( string $html ): string {
	$markers = array(
		'jt-procard',
		'jt-premium-card',
		'lawyer-card--paid',
		'lawyer-card--sponsored',
		'lawyer-card--promoted',
		'lawyer-card__status--sponsored',
		'lawyer-card__commercial-disclosure',
	);
	$requires_normalization = false;
	foreach ( $markers as $marker ) {
		if ( false !== strpos( $html, $marker ) ) {
			$requires_normalization = true;
			break;
		}
	}
	if ( ! $requires_normalization ) {
		return $html;
	}

	foreach ( array( 'jt-procard', 'lawyer-card', 'jt-premium-card' ) as $class_name ) {
		$html = justice_ops_content_first_normalize_card_class( $html, $class_name );
	}

	// A malformed legacy card must not leave a detached personal relationship
	// paragraph elsewhere in the response.
	$without_personal = justice_ops_content_first_remove_fragment_class( $html, 'lawyer-card__commercial-disclosure' );

	return null === $without_personal ? $html : $without_personal;
}

/**
 * Find the last complete block among a list of terminal classes.
 *
 * @param string[] $classes Candidate terminal classes.
 */
function justice_ops_content_first_terminal_block( string $html, array $tags, array $classes ): ?array {
	$terminal = null;
	foreach ( $classes as $class_name ) {
		$blocks = justice_ops_content_first_find_class_blocks( $html, $tags, $class_name );
		if ( null === $blocks ) {
			return null;
		}
		foreach ( $blocks as $block ) {
			if ( null === $terminal || $block['end'] > $terminal['end'] ) {
				$terminal = $block;
			}
		}
	}

	return $terminal;
}

/**
 * Reuse the fail-closed taxonomy splitter with a route-specific high wrapper.
 */
function justice_ops_content_first_split_lawyer_section( array $section, string $scope ): ?array {
	$split = justice_ops_content_first_split_practice_lawyers( $section );
	if ( null === $split || '' === $split['high'] || 'taxonomy' === $scope ) {
		return $split;
	}

	$split['high'] = str_replace(
		array( 'jt-taxonomy-paid-placement', 'data-jt-taxonomy-paid-placement' ),
		array( 'jt-' . $scope . '-paid-placement', 'data-jt-' . $scope . '-paid-placement' ),
		$split['high']
	);

	return $split;
}

/**
 * Move provider modules below the true terminal section of a pillar template.
 */
function justice_ops_content_first_reorder_pillar_html( string $html ): string {
	if (
		'' === $html
		|| false !== strpos( $html, 'data-jt-pillar-content-first' )
		|| false !== strpos( $html, 'jt-pillar-content-first' )
	) {
		return $html;
	}

	$original  = $html;
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$terminal  = justice_ops_content_first_terminal_block(
		$masked,
		$tags,
		array( 'legal-pillar-body', 'legal-pillar-articles', 'practice-hub-cta' )
	);

	if ( null === $terminal ) {
		return $original;
	}

	$lawyer_sections = justice_ops_content_first_find_class_blocks( $masked, $tags, 'legal-pillar-lawyers' );
	if ( null === $lawyer_sections ) {
		return $original;
	}

	$replacements = array();
	$tail_entries = array();
	foreach ( $lawyer_sections as $section ) {
		if ( $section['start'] >= $terminal['end'] ) {
			continue;
		}
		$split = justice_ops_content_first_split_lawyer_section( $section, 'pillar' );
		if ( null === $split ) {
			return $original;
		}
		$replacements[] = array(
			'start' => $section['start'],
			'end'   => $section['end'],
			'html'  => $split['high'],
		);
		if ( '' !== $split['bottom'] ) {
			$tail_entries[] = array( 'start' => $section['start'], 'html' => $split['bottom'] );
		}
	}

	$provider_classes = array(
		'jt-midfold',
		'single-article__fold',
		'jt-registered-band',
		'jtcm-wrap',
		'jt-cmenu',
		'jt-firm-strip',
		'jt-procard',
		'jt-premium-card',
	);
	$provider_blocks = array();
	foreach ( $provider_classes as $class_name ) {
		$found = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );
		if ( null === $found ) {
			return $original;
		}
		foreach ( $found as $block ) {
			if ( $block['start'] >= $terminal['end'] ) {
				continue;
			}

			$inside_lawyer_section = false;
			foreach ( $lawyer_sections as $section ) {
				if ( justice_ops_content_first_block_contains( $section, $block ) ) {
					$inside_lawyer_section = true;
					break;
				}
			}
			if ( $inside_lawyer_section ) {
				continue;
			}

			if (
				'jt-procard' === $class_name
				&& justice_ops_content_first_procard_is_inline_paid( $block )
			) {
				continue;
			}
			if (
				'jt-premium-card' === $class_name
				&& justice_ops_content_first_profile_is_active_paid( justice_ops_content_first_card_profile_id( $block ) )
				&& justice_ops_content_first_has_promoted_disclosure( (string) $block['element'], 'jt-premium-card__sponsored' )
			) {
				continue;
			}

			$provider_blocks[] = $block;
		}
	}

	$outer = array();
	foreach ( $provider_blocks as $index => $candidate ) {
		$nested = false;
		foreach ( $provider_blocks as $other_index => $other ) {
			if ( $index !== $other_index && justice_ops_content_first_block_contains( $other, $candidate ) ) {
				$nested = true;
				break;
			}
		}
		if ( ! $nested ) {
			$outer[] = $candidate;
		}
	}

	foreach ( $outer as $block ) {
		$replacements[] = array( 'start' => $block['start'], 'end' => $block['end'], 'html' => '' );
		$tail_entries[] = array( 'start' => $block['start'], 'html' => $block['element'] );
	}

	if ( empty( $tail_entries ) ) {
		return $original;
	}

	for ( $i = 0, $count = count( $replacements ); $i < $count; $i++ ) {
		for ( $j = $i + 1; $j < $count; $j++ ) {
			if ( $replacements[ $i ]['start'] < $replacements[ $j ]['end'] && $replacements[ $j ]['start'] < $replacements[ $i ]['end'] ) {
				return $original;
			}
		}
	}

	usort( $replacements, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $replacements as $replacement ) {
		$masked = substr_replace( $masked, $replacement['html'], $replacement['start'], $replacement['end'] - $replacement['start'] );
	}

	$updated_tags = justice_ops_content_first_scan_tags( $masked );
	$terminal     = justice_ops_content_first_terminal_block(
		$masked,
		$updated_tags,
		array( 'legal-pillar-body', 'legal-pillar-articles', 'practice-hub-cta' )
	);
	if ( null === $terminal ) {
		return $original;
	}

	usort( $tail_entries, static fn( array $a, array $b ): int => $a['start'] <=> $b['start'] );
	$tail = '<div class="jt-pillar-content-first" data-jt-pillar-content-first="2026-08-03-r1">';
	foreach ( $tail_entries as $entry ) {
		$tail .= $entry['html'];
	}
	$tail  .= '</div>';
	$masked = substr_replace( $masked, $tail, $terminal['end'], 0 );

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Put a the_content-generated provider tail after the template's final note or
 * call to action. Generic pages without a later sibling keep the tail inside
 * the content container as its final child.
 */
function justice_ops_content_first_relocate_singular_tail( string $html ): string {
	$original  = $html;
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$tails     = justice_ops_content_first_find_class_blocks( $masked, $tags, 'jt-content-first-order' );

	if ( null === $tails || 1 !== count( $tails ) ) {
		return $original;
	}
	$tail = $tails[0];

	$anchor        = null;
	$inside_anchor = false;
	foreach ( array( 'single-article__lead-cta', 'editorial-note' ) as $anchor_class ) {
		$anchors = justice_ops_content_first_find_class_blocks( $masked, $tags, $anchor_class );
		if ( null === $anchors ) {
			return $original;
		}
		if ( ! empty( $anchors ) ) {
			$anchor = $anchors[ count( $anchors ) - 1 ];
			break;
		}
	}

	if ( null === $anchor ) {
		$anchors = justice_ops_content_first_find_class_blocks( $masked, $tags, 'single-article__content' );
		if ( null === $anchors || 1 !== count( $anchors ) ) {
			return $original;
		}
		$anchor        = $anchors[0];
		$inside_anchor = true;
	}

	if ( ! $inside_anchor && $tail['start'] >= $anchor['end'] ) {
		return $original;
	}

	$tail_html = $tail['element'];
	$masked    = substr_replace( $masked, '', $tail['start'], $tail['end'] - $tail['start'] );
	$tags      = justice_ops_content_first_scan_tags( $masked );

	if ( $inside_anchor ) {
		$anchors = justice_ops_content_first_find_class_blocks( $masked, $tags, 'single-article__content' );
		if ( null === $anchors || 1 !== count( $anchors ) ) {
			return $original;
		}
		$insert_at = $anchors[0]['close_start'];
	} else {
		$anchor_class = in_array( 'single-article__lead-cta', justice_ops_content_first_tag_classes( substr( $anchor['element'], 0, $anchor['open_end'] - $anchor['start'] ) ), true )
			? 'single-article__lead-cta'
			: 'editorial-note';
		$anchors = justice_ops_content_first_find_class_blocks( $masked, $tags, $anchor_class );
		if ( null === $anchors || empty( $anchors ) ) {
			return $original;
		}
		$insert_at = $anchors[ count( $anchors ) - 1 ]['end'];
	}

	$masked = substr_replace( $masked, $tail_html, $insert_at, 0 );

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Remove unsupported or noisy attribution from the top of editorial pages.
 *
 * The site-wide review-claims kill switch already suppresses reviewedBy schema
 * and bottom reviewer claims. Two legacy templates can still print a reviewer
 * or generic author inside the page header, and the articles template prints a
 * Hebrew reading-time value that is calculated with an ASCII-only counter.
 * Those three fragments are removed from rendered HTML so crawlers and readers
 * receive the same claim-free, content-first header. Dates and the claim-free
 * disclaimer remain intact.
 */
function justice_ops_content_first_remove_top_attribution_noise( string $html ): string {
	if ( '' === $html ) {
		return $html;
	}

	$original  = $html;
	$protected = array();
	$masked    = justice_ops_content_first_protect_raw_text( $html, $protected );
	$tags      = justice_ops_content_first_scan_tags( $masked );
	$removals  = array();

	foreach ( array( 'single-article__author', 'meta-author' ) as $class_name ) {
		$blocks = justice_ops_content_first_find_class_blocks( $masked, $tags, $class_name );
		if ( null === $blocks ) {
			return $original;
		}
		foreach ( $blocks as $block ) {
			$removals[] = $block;
		}
	}

	usort( $removals, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $removals as $block ) {
		$masked = substr_replace( $masked, '', $block['start'], $block['end'] - $block['start'] );
	}

	$tags        = justice_ops_content_first_scan_tags( $masked );
	$meta_blocks = justice_ops_content_first_find_class_blocks( $masked, $tags, 'single-article__meta' );
	if ( null === $meta_blocks ) {
		return $original;
	}

	usort( $meta_blocks, static fn( array $a, array $b ): int => $b['start'] <=> $a['start'] );
	foreach ( $meta_blocks as $block ) {
		$clean = preg_replace(
			'#<span\b[^>]*>\s*[0-9]+\s+דק(?:ת|ות)\s+קריאה\s*</span>\s*#u',
			'',
			$block['element']
		);
		if ( ! is_string( $clean ) ) {
			return $original;
		}
		if ( $clean !== $block['element'] ) {
			$masked = substr_replace( $masked, $clean, $block['start'], $block['end'] - $block['start'] );
		}
	}

	return empty( $protected ) ? $masked : strtr( $masked, $protected );
}

/**
 * Apply route-role ordering and the universal disclosure contract.
 */
function justice_ops_content_first_filter_full_html( string $html, ?string $role = null ): string {
	if ( '' === $html || ! justice_ops_content_first_rollout_allows_path() ) {
		return $html;
	}

	$role = null === $role ? justice_ops_content_first_route_role() : $role;
	if ( 'other' === $role ) {
		return $html;
	}

	$html = justice_ops_content_first_remove_top_attribution_noise( $html );
	$html = justice_ops_content_first_normalize_public_disclosures( $html );

	if ( 'editorial_taxonomy' === $role ) {
		return justice_ops_practice_taxonomy_reorder_html( $html );
	}
	if ( 'editorial_pillar' === $role ) {
		return justice_ops_content_first_reorder_pillar_html( $html );
	}
	if ( 'editorial_singular' === $role ) {
		return justice_ops_content_first_relocate_singular_tail( $html );
	}

	// provider_home, provider_city, provider_directory, provider_profile and
	// provider_comparison are explicit ordering exemptions. Only paid-truth and
	// personal-claim suppression run on those routes.
	return $html;
}

/**
 * Open the outermost public HTML buffer before controlled theme routes render.
 */
function justice_ops_content_first_start_global_buffer(): void {
	if (
		! justice_ops_content_first_rollout_allows_path()
		|| ( function_exists( 'is_admin' ) && is_admin() )
		|| ( function_exists( 'is_feed' ) && is_feed() )
		|| ( function_exists( 'is_preview' ) && is_preview() )
		|| ( function_exists( 'is_embed' ) && is_embed() )
		|| ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() )
		|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
	) {
		return;
	}

	foreach ( array( 'preview', 'feed', 'embed', 'rest_route' ) as $variant ) {
		if ( isset( $_GET[ $variant ] ) ) {
			return;
		}
	}

	$role = justice_ops_content_first_route_role();
	if ( 'other' === $role ) {
		return;
	}

	ob_start( static function ( $html ) use ( $role ): string {
		return justice_ops_content_first_filter_full_html( (string) $html, $role );
	} );
}
add_action( 'template_redirect', 'justice_ops_content_first_start_global_buffer', -3000000 );

/**
 * Resolve a connected-lawyer meta value through the theme's public resolver.
 *
 * A nonempty slug is not proof that a public provider exists. The layout guard
 * activates only for a real justice_lawyer record that passes the same public
 * approval boundary as cards and the directory.
 */
function justice_ops_content_first_connected_lawyer_id( int $article_id ): int {
	if (
		$article_id <= 0
		|| ! function_exists( 'get_post_meta' )
	) {
		return 0;
	}

	$slug = trim( (string) get_post_meta( $article_id, 'connected_lawyer_slug', true ) );
	if ( '' === $slug ) {
		return 0;
	}

	$lawyer = function_exists( 'justice_theme_get_connected_lawyer_by_slug' )
		? justice_theme_get_connected_lawyer_by_slug( $slug )
		: null;

	if ( ! is_object( $lawyer ) && function_exists( 'get_page_by_path' ) ) {
		$lawyer = get_page_by_path( $slug, defined( 'OBJECT' ) ? OBJECT : 'OBJECT', 'justice_lawyer' );
	}

	$lawyer_id = is_object( $lawyer ) && isset( $lawyer->ID ) ? (int) $lawyer->ID : 0;
	if (
		$lawyer_id <= 0
		|| ( function_exists( 'get_post_type' ) && 'justice_lawyer' !== get_post_type( $lawyer_id ) )
		|| ! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		|| ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id )
	) {
		return 0;
	}

	return $lawyer_id;
}

/**
 * The legacy article sidebar is after main in DOM but beside it on desktop.
 * Force that rail below the complete answer only for a resolved public profile.
 */
function justice_ops_content_first_has_connected_lawyer_sidebar(): bool {
	if (
		! function_exists( 'is_singular' )
		|| ! is_singular( 'articles' )
		|| ! function_exists( 'get_queried_object_id' )
		|| ! justice_ops_content_first_rollout_allows_path()
	) {
		return false;
	}

	return justice_ops_content_first_connected_lawyer_id( (int) get_queried_object_id() ) > 0;
}

/**
 * Add the narrow article-only CSS scope.
 *
 * @param string[] $classes Existing body classes.
 * @return string[]
 */
function justice_ops_content_first_body_classes( array $classes ): array {
	if ( justice_ops_content_first_has_connected_lawyer_sidebar() ) {
		$classes[] = 'jt-content-first-connected-lawyer';
	}

	return array_values( array_unique( $classes ) );
}
add_filter( 'body_class', 'justice_ops_content_first_body_classes' );

/**
 * Print the connected-lawyer visual-order guard only when needed.
 */
function justice_ops_content_first_connected_lawyer_css(): void {
	if ( ! justice_ops_content_first_has_connected_lawyer_sidebar() ) {
		return;
	}
	?>
	<style id="justice-ops-connected-lawyer-bottom">
		body.jt-content-first-connected-lawyer .single-article__layout{display:flex!important;flex-direction:column!important}
		body.jt-content-first-connected-lawyer .single-article__main{order:1;width:100%;max-width:none}
		body.jt-content-first-connected-lawyer .single-article__sidebar{order:2;width:100%;max-width:none;margin-top:2.5rem}
		body.jt-content-first-connected-lawyer .single-article__sidebar>.sticky-box{position:static!important;top:auto!important}
	</style>
	<?php
}
add_action( 'wp_head', 'justice_ops_content_first_connected_lawyer_css', 99 );
