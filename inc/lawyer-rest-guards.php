<?php
/**
 * Public output guards for lawyer profiles.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check whether the current REST requester may inspect non-public lawyer data.
 *
 * @return bool
 */
function justice_theme_lawyer_rest_can_inspect_private(): bool {
	return is_user_logged_in() && current_user_can( 'edit_posts' );
}

/**
 * Limit public lawyer REST collections to profiles that pass the public gate.
 *
 * This is read-only output filtering. It does not draft, delete, edit or
 * migrate any lawyer records.
 *
 * @param array           $args    WP_Query arguments.
 * @param WP_REST_Request $request REST request.
 * @return array
 */
function justice_theme_filter_public_lawyer_rest_query( array $args, WP_REST_Request $request ): array {
	unset( $request );

	if (
		justice_theme_lawyer_rest_can_inspect_private()
		|| ! post_type_exists( 'justice_lawyer' )
	) {
		return $args;
	}

	if ( ! function_exists( 'justice_theme_lawyer_profile_is_public_approved' ) ) {
		$args['post__in'] = array( 0 );
		return $args;
	}

	$args['suppress_filters']              = false;
	$args['justice_public_lawyer_listing'] = true;

	$candidate_ids = get_posts(
		array(
			'post_type'                     => 'justice_lawyer',
			'post_status'                   => 'publish',
			'fields'                        => 'ids',
			'posts_per_page'                => -1,
			'no_found_rows'                 => true,
			'update_post_meta_cache'        => false,
			'update_post_term_cache'        => false,
			'suppress_filters'              => false,
			'justice_public_lawyer_listing' => true,
		)
	);

	$approved_ids = array_values(
		array_filter(
			array_map( 'intval', $candidate_ids ),
			static function ( int $post_id ): bool {
				if ( ! justice_theme_lawyer_profile_is_public_approved( $post_id ) ) {
					return false;
				}
				return ! function_exists( 'justice_theme_lawyer_card_is_active' )
					|| justice_theme_lawyer_card_is_active( $post_id );
			}
		)
	);

	$args['post__in'] = ! empty( $approved_ids ) ? $approved_ids : array( 0 );

	return $args;
}
add_filter( 'rest_justice_lawyer_query', 'justice_theme_filter_public_lawyer_rest_query', 10, 2 );

/**
 * Check whether the current public request is an unapproved lawyer profile.
 *
 * @return bool
 */
function justice_theme_is_unapproved_public_lawyer_profile_request(): bool {
	if ( ! is_singular( 'justice_lawyer' ) ) {
		return false;
	}

	$post_id = (int) get_queried_object_id();

	return $post_id > 0
		&& function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		&& ! justice_theme_lawyer_profile_is_public_approved( $post_id )
		&& ! current_user_can( 'edit_post', $post_id );
}

/**
 * Mark unapproved public lawyer profiles as 404 before SEO/head output runs.
 *
 * @return void
 */
function justice_theme_mark_unapproved_lawyer_profile_404(): void {
	if ( ! justice_theme_is_unapproved_public_lawyer_profile_request() ) {
		return;
	}

	$GLOBALS['justice_theme_blocked_lawyer_profile_404'] = true;

	global $wp_query, $post;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->set_404();
		$wp_query->posts             = array();
		$wp_query->post              = null;
		$wp_query->post_count        = 0;
		$wp_query->queried_object    = null;
		$wp_query->queried_object_id = 0;
	}

	$post = null;

	status_header( 404 );
	nocache_headers();
}
add_action( 'wp', 'justice_theme_mark_unapproved_lawyer_profile_404', 1 );

/**
 * Resolve a lawyer profile slug from the public /lawyers/{slug}/ route.
 *
 * This is intentionally narrow. It exists for live hosts where the CPT archive
 * is available but single lawyer permalinks are still handed to the generic
 * unknown-route guard.
 *
 * @return string
 */
function justice_theme_lawyer_profile_route_slug(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );
	$home_path    = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );

	$request_path = '/' . trim( rawurldecode( $request_path ), '/' ) . '/';
	$home_path    = '/' . trim( rawurldecode( $home_path ), '/' ) . '/';

	if ( '/' !== $home_path && 0 === strpos( $request_path, $home_path ) ) {
		$request_path = '/' . ltrim( substr( $request_path, strlen( $home_path ) ), '/' );
	}

	if ( ! preg_match( '#^/lawyers/([^/]+)/$#', $request_path, $matches ) ) {
		return '';
	}

	return sanitize_title( $matches[1] );
}

/**
 * Render a CMS-backed lawyer profile when the host misses the CPT single route.
 *
 * @return void
 */
function justice_theme_render_lawyer_profile_route_fallback(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || is_singular( 'justice_lawyer' ) ) {
		return;
	}

	$slug = justice_theme_lawyer_profile_route_slug();
	if ( '' === $slug || ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$profile = get_page_by_path( $slug, OBJECT, 'justice_lawyer' );
	if ( ! $profile instanceof WP_Post || 'publish' !== get_post_status( $profile ) ) {
		return;
	}

	$can_view = current_user_can( 'edit_post', $profile->ID )
		|| (
			function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			&& justice_theme_lawyer_profile_is_public_approved( $profile->ID )
		);

	if ( ! $can_view ) {
		return;
	}

	global $wp_query, $post;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404              = false;
		$wp_query->is_home             = false;
		$wp_query->is_page             = false;
		$wp_query->is_single           = true;
		$wp_query->is_singular         = true;
		$wp_query->is_archive          = false;
		$wp_query->is_post_type_archive = false;
		$wp_query->post                = $profile;
		$wp_query->posts               = array( $profile );
		$wp_query->post_count          = 1;
		$wp_query->found_posts         = 1;
		$wp_query->queried_object      = $profile;
		$wp_query->queried_object_id   = $profile->ID;
		$wp_query->query_vars['name']  = $profile->post_name;
		$wp_query->query_vars['post_type'] = 'justice_lawyer';
	}

	$post = $profile;
	setup_postdata( $post );
	status_header( 200 );

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route: lawyer-profile-cms-fallback', true );
	}

	$template = locate_template( 'single-justice_lawyer.php' );
	if ( $template ) {
		include $template;
		exit;
	}
}
add_action( 'template_redirect', 'justice_theme_render_lawyer_profile_route_fallback', -5000 );

/**
 * Check whether this request was blocked by the lawyer profile 404 guard.
 *
 * @return bool
 */
function justice_theme_is_blocked_lawyer_profile_404(): bool {
	return ! empty( $GLOBALS['justice_theme_blocked_lawyer_profile_404'] );
}

/**
 * Use a generic Hebrew document title for blocked lawyer profile routes.
 *
 * @param string $title Current title.
 * @return string
 */
function justice_theme_blocked_lawyer_profile_404_title( string $title ): string {
	return justice_theme_is_blocked_lawyer_profile_404() ? __( 'עמוד לא נמצא | Jus-Tice', 'justice-theme' ) : $title;
}
add_filter( 'pre_get_document_title', 'justice_theme_blocked_lawyer_profile_404_title', PHP_INT_MAX );
add_filter( 'wpseo_title', 'justice_theme_blocked_lawyer_profile_404_title', PHP_INT_MAX );

/**
 * Use a generic Hebrew description for blocked lawyer profile routes.
 *
 * @param string $description Current description.
 * @return string
 */
function justice_theme_blocked_lawyer_profile_404_description( string $description ): string {
	return justice_theme_is_blocked_lawyer_profile_404() ? __( 'העמוד שביקשתם לא נמצא או אינו זמין לצפייה ציבורית.', 'justice-theme' ) : $description;
}
add_filter( 'wpseo_metadesc', 'justice_theme_blocked_lawyer_profile_404_description', PHP_INT_MAX );

/**
 * Remove canonical URLs from blocked lawyer profile routes.
 *
 * @param string $canonical Current canonical URL.
 * @return string
 */
function justice_theme_blocked_lawyer_profile_404_canonical( string $canonical ): string {
	return justice_theme_is_blocked_lawyer_profile_404() ? '' : $canonical;
}
add_filter( 'wpseo_canonical', 'justice_theme_blocked_lawyer_profile_404_canonical', PHP_INT_MAX );

/**
 * Force noindex/nofollow for blocked lawyer profile routes.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function justice_theme_blocked_lawyer_profile_404_robots( array $robots ): array {
	if ( ! justice_theme_is_blocked_lawyer_profile_404() ) {
		return $robots;
	}

	unset( $robots['index'], $robots['follow'] );

	$robots['noindex']  = true;
	$robots['nofollow'] = true;

	return $robots;
}
add_filter( 'wp_robots', 'justice_theme_blocked_lawyer_profile_404_robots', PHP_INT_MAX );

/* Rank Math-specific robots filter removed — handled by wpseo_robots below. */

/**
 * Force noindex/nofollow for blocked lawyer profile routes in Yoast-style output.
 *
 * @param string $robots Robots directive string.
 * @return string
 */
function justice_theme_blocked_lawyer_profile_404_yoast_robots( string $robots ): string {
	return justice_theme_is_blocked_lawyer_profile_404() ? 'noindex, nofollow' : $robots;
}
add_filter( 'wpseo_robots', 'justice_theme_blocked_lawyer_profile_404_yoast_robots', PHP_INT_MAX );

/**
 * Block direct public REST reads for unapproved lawyer profile IDs.
 *
 * @param mixed           $response Current response, if any.
 * @param array           $handler  Matched REST handler.
 * @param WP_REST_Request $request  REST request.
 * @return mixed
 */
function justice_theme_block_unapproved_lawyer_rest_item( $response, $handler, WP_REST_Request $request ) {
	unset( $handler );

	if ( null !== $response || justice_theme_lawyer_rest_can_inspect_private() || 'GET' !== $request->get_method() ) {
		return $response;
	}

	if ( ! preg_match( '#^/wp/v2/justice_lawyer/(?P<id>[0-9]+)$#', $request->get_route(), $matches ) ) {
		return $response;
	}

	$post_id = (int) $matches['id'];
	if (
		$post_id > 0
		&& function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		&& justice_theme_lawyer_profile_is_public_approved( $post_id )
		&& ( ! function_exists( 'justice_theme_lawyer_card_is_active' )
			|| justice_theme_lawyer_card_is_active( $post_id ) )
	) {
		return $response;
	}

	return new WP_Error(
		'rest_lawyer_profile_not_public',
		__( 'פרופיל עורך הדין אינו זמין לצפייה ציבורית.', 'justice-theme' ),
		array( 'status' => 404 )
	);
}
add_filter( 'rest_request_before_callbacks', 'justice_theme_block_unapproved_lawyer_rest_item', 10, 3 );

/**
 * Remove sensitive custom fields from anonymous lawyer REST responses.
 *
 * @param WP_REST_Response $response REST response.
 * @param WP_Post          $post     Lawyer post.
 * @param WP_REST_Request  $request  REST request.
 * @return WP_REST_Response
 */
function justice_theme_sanitize_public_lawyer_rest_response( WP_REST_Response $response, WP_Post $post, WP_REST_Request $request ): WP_REST_Response {
	unset( $request );

	if ( justice_theme_lawyer_rest_can_inspect_private() ) {
		return $response;
	}

	$data = $response->get_data();

	if (
		! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		|| ! justice_theme_lawyer_profile_is_public_approved( (int) $post->ID )
		|| ( function_exists( 'justice_theme_lawyer_card_is_active' )
			&& ! justice_theme_lawyer_card_is_active( (int) $post->ID ) )
	) {
		$response->set_data(
			array(
				'id'     => (int) $post->ID,
				'type'   => 'justice_lawyer',
				'status' => 'not_public',
			)
		);

		return $response;
	}

	unset( $data['meta'], $data['acf'], $data['guid'] );

	if ( isset( $data['link'] ) && is_string( $data['link'] ) ) {
		$data['link'] = justice_theme_public_url( $data['link'] );
	}

	$response->set_data( $data );

	return $response;
}
add_filter( 'rest_prepare_justice_lawyer', 'justice_theme_sanitize_public_lawyer_rest_response', 10, 3 );
