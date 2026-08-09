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
