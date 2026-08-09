<?php
/**
 * Inactive-card gate (owner order 2026-07-27).
 *
 * The concern is the lawyers themselves: most profile records were imported
 * without the lawyer's consent, and the profile pages publish their details.
 * So a card whose owner never consented and never paid is now simply
 * INACTIVE: it stays visible as a name, it links nowhere, it makes no offer
 * and no demand, and the full profile page behind it stops being reachable.
 * No redirects, no join funnel, no upsell copy anywhere near it.
 *
 * Active = the lawyer is a paying/consenting participant:
 *   - sponsored placement active or reserved, or
 *   - a paid plan in force, or
 *   - the profile was claimed by its owner, or
 *   - the data was submitted by the lawyer or verified with them.
 * Everything else (public_index / import / seed) is inactive.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Is this lawyer card active (consented or paying)?
 *
 * @param int $post_id justice_lawyer ID.
 * @return bool
 */
function justice_theme_lawyer_card_is_active( int $post_id ): bool {
	if ( ! $post_id || 'justice_lawyer' !== get_post_type( $post_id ) ) {
		return false;
	}

	if ( function_exists( 'justice_theme_lawyer_sponsored_placement_status' ) ) {
		$sponsor = justice_theme_lawyer_sponsored_placement_status( $post_id );
	} else {
		$sponsor = (string) get_post_meta( $post_id, 'sponsored_placement_status', true );
	}
	if ( in_array( $sponsor, array( 'active', 'reserved' ), true ) ) {
		return true;
	}

	if ( function_exists( 'justice_theme_lawyer_paid_plan_is_active' )
		&& justice_theme_lawyer_paid_plan_is_active( $post_id ) ) {
		return true;
	}

	if ( (int) get_post_meta( $post_id, 'claimed_by_user_id', true ) > 0 ) {
		return true;
	}

	$source = strtolower( (string) get_post_meta( $post_id, 'source_type', true ) );
	if ( in_array( $source, array( 'lawyer_submitted', 'owner_verified', 'verified_public' ), true ) ) {
		return true;
	}

	return false;
}

/**
 * Inactive profile pages carry noindex. These are third-party personal-data
 * pages published without consent, not content articles, so the standing
 * "never noindex a content article" rule does not cover them; removing them
 * from the index is the point.
 *
 * @param array $robots Robots directives.
 * @return array
 */
function justice_theme_inactive_lawyer_robots( array $robots ): array {
	if ( is_singular( 'justice_lawyer' )
		&& ! justice_theme_lawyer_card_is_active( (int) get_queried_object_id() ) ) {
		$robots['noindex'] = true;
		$robots['follow']  = true;
	}
	return $robots;
}
add_filter( 'wp_robots', 'justice_theme_inactive_lawyer_robots', 20 );

/**
 * Yoast owns robots output on production and does not read wp_robots, so the
 * same rule is mirrored into its filters (bot review on PR #52 caught this).
 *
 * @param array|string $robots Yoast robots value.
 * @return array|string
 */
function justice_theme_inactive_lawyer_yoast_robots( $robots ) {
	if ( ! is_singular( 'justice_lawyer' )
		|| justice_theme_lawyer_card_is_active( (int) get_queried_object_id() ) ) {
		return $robots;
	}
	if ( is_array( $robots ) ) {
		$robots['index']  = 'noindex';
		$robots['follow'] = 'follow';
		return $robots;
	}
	return 'noindex, follow';
}
add_filter( 'wpseo_robots_array', 'justice_theme_inactive_lawyer_yoast_robots', 99997 );
add_filter( 'wpseo_robots', 'justice_theme_inactive_lawyer_yoast_robots', 99997 );

/**
 * Inactive profiles leave the XML sitemap. Cached: 1,000+ records, and the
 * answer only changes when a lawyer joins.
 *
 * @param array $excluded Post IDs Yoast should skip.
 * @return array
 */
function justice_theme_exclude_inactive_lawyers_from_sitemap( $excluded ) {
	$excluded = is_array( $excluded ) ? $excluded : array();
	$cached   = get_transient( 'justice_inactive_lawyer_ids_v1' );
	if ( false === $cached ) {
		$cached = array();
		$ids    = get_posts(
			array(
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);
		foreach ( $ids as $id ) {
			if ( ! justice_theme_lawyer_card_is_active( (int) $id ) ) {
				$cached[] = (int) $id;
			}
		}
		set_transient( 'justice_inactive_lawyer_ids_v1', $cached, 12 * HOUR_IN_SECONDS );
	}
	return array_merge( $excluded, $cached );
}
add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', 'justice_theme_exclude_inactive_lawyers_from_sitemap' );

/**
 * Muted look for inactive cards. Inlined only where lawyer cards render.
 */
function justice_theme_inactive_card_css(): void {
	if ( ! is_post_type_archive( 'justice_lawyer' ) && ! is_singular( 'justice_lawyer' ) && ! is_front_page() ) {
		return;
	}
	echo '<style id="jt-inactive-card">'
		. '.lawyer-card--inactive{opacity:.82}'
		. '.lawyer-card--inactive .lawyer-card__media--plain{display:flex;align-items:center;justify-content:center;cursor:default}'
		. '.lawyer-card__status--inactive{background:#eef0f3;color:#5b6470;border-radius:6px;padding:2px 8px;font-size:.78rem}'
		. '.inactive-profile{max-width:640px;margin:60px auto;padding:0 20px;text-align:center;direction:rtl}'
		. '.inactive-profile h1{font-size:1.5rem;color:#0d2149;margin-bottom:10px}'
		. '.inactive-profile p{color:#5b6470;font-size:1rem;line-height:1.7}'
		. '</style>';
}
add_action( 'wp_head', 'justice_theme_inactive_card_css', 32 );


/**
 * Response-layer seal for the map feed.
 *
 * The gate exists in both feed implementations, but uPress opcache held the
 * plugin route on stale bytecode for over an hour after the file was replaced
 * (opcache_invalidate is blocked on this host). This filter sanitises the
 * response itself, whichever callback produced it, so a stale compile or any
 * future feed regression cannot leak an unconsented lawyer's details.
 *
 * @param mixed           $result  Route response.
 * @param WP_REST_Server  $server  Server.
 * @param WP_REST_Request $request Request.
 * @return mixed
 */
function justice_theme_seal_map_feed( $result, $server, $request ) {
	if ( false === strpos( (string) $request->get_route(), '/justice/v1/map/offices' ) ) {
		return $result;
	}
	$data = $result instanceof WP_REST_Response ? $result->get_data() : $result;
	if ( ! is_array( $data ) ) {
		return $result;
	}
	$inactive = array_flip( array_map( 'intval', justice_theme_exclude_inactive_lawyers_from_sitemap( array() ) ) );
	$has_feats = isset( $data['features'] ) && is_array( $data['features'] );
	$list      = $has_feats ? $data['features'] : $data;
	$kept      = array();
	foreach ( $list as $feat ) {
		if ( ! is_array( $feat ) ) {
			continue;
		}
		$has_props = isset( $feat['properties'] ) && is_array( $feat['properties'] );
		$t         = $has_props ? $feat['properties'] : $feat;
		if ( ( $t['kind'] ?? '' ) !== 'lawyer' ) {
			$kept[] = $feat;
			continue;
		}
		$id = (int) ( $t['id'] ?? 0 );
		if ( $id && isset( $inactive[ $id ] ) ) {
			// Dropped entirely: even a name pin carries precise office
			// coordinates in the feature geometry (PR #53 bot review).
			continue;
		}
		$kept[] = $feat;
	}
	if ( $has_feats ) {
		$data['features'] = array_values( $kept );
	} else {
		$data = array_values( $kept );
	}
	if ( $result instanceof WP_REST_Response ) {
		$result->set_data( $data );
		return $result;
	}
	return $data;
}
add_filter( 'rest_post_dispatch', 'justice_theme_seal_map_feed', 999, 3 );


/**
 * The gate's caches go stale the moment a lawyer's standing changes, and
 * nothing purged them (PR #53 bot review: the subscription watchdog flips
 * subscription_status without a post save). Any change to a field the
 * active-check reads purges the inactive-ID list and both map payload keys.
 */
function justice_theme_card_gate_purge_caches(): void {
	delete_transient( 'justice_inactive_lawyer_ids_v1' );
	delete_transient( 'justice_map_geojson_v1' );
	delete_transient( 'justice_map_geojson_v2' );
}

function justice_theme_card_gate_meta_watch( $meta_id, $post_id, $meta_key ): void {
	unset( $meta_id );
	if ( 'justice_lawyer' !== get_post_type( (int) $post_id ) ) {
		return;
	}
	$watched = array( 'sponsored_placement_status', 'plan_type', 'subscription_status', 'claimed_by_user_id', 'source_type', 'verification_status' );
	if ( in_array( (string) $meta_key, $watched, true ) ) {
		justice_theme_card_gate_purge_caches();
	}
}
add_action( 'updated_post_meta', 'justice_theme_card_gate_meta_watch', 10, 3 );
add_action( 'added_post_meta', 'justice_theme_card_gate_meta_watch', 10, 3 );
add_action( 'deleted_post_meta', 'justice_theme_card_gate_meta_watch', 10, 3 );
add_action( 'save_post_justice_lawyer', 'justice_theme_card_gate_purge_caches' );

/**
 * No OpenGraph/Twitter image for an inactive profile: the head must not ship
 * the lawyer's photo after the body stopped doing so.
 *
 * @param string $image Image URL.
 * @return string
 */
function justice_theme_inactive_lawyer_og_image( $image ) {
	if ( is_singular( 'justice_lawyer' )
		&& ! justice_theme_lawyer_card_is_active( (int) get_queried_object_id() ) ) {
		return '';
	}
	return $image;
}
add_filter( 'wpseo_opengraph_image', 'justice_theme_inactive_lawyer_og_image', 99 );
add_filter( 'wpseo_twitter_image', 'justice_theme_inactive_lawyer_og_image', 99 );
