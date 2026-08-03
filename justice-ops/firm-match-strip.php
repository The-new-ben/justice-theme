<?php
/**
 * Matched-firms strip: distribute organic law-firm directory entries at the
 * end of informational content.
 *
 * On every single article, append a compact strip of up to 3 organic firm
 * cards matched by the article's practice-areas terms. Paid placements have
 * their own explicitly labelled professional-card surface and are excluded
 * here. This keeps the article's answer and topic signals ahead of directory
 * inventory while free firms still receive contextual discovery at the end.
 *
 * Every candidate passes the real visibility gate
 * (justice_theme_lawyer_profile_is_public_approved) - never raw publish
 * status. No contact details on the strip: name, area, city, profile link
 * only, matching the fact-gate rules for unclaimed cards.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Pick up to 3 approved firms for a set of practice-area term IDs.
 *
 * @param int[] $term_ids Practice-area term IDs of the current article.
 * @param int   $exclude  Post ID to exclude (unused today, future-proof).
 * @return array[] Each: id, title, url, area, city.
 */
function justice_fms_pick_firms( array $term_ids, int $exclude = 0 ): array {
	if (
		empty( $term_ids )
		|| ! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		|| (
			! function_exists( 'justice_cards_has_public_sponsored_placement' )
			&& ! function_exists( 'justice_theme_lawyer_has_public_sponsored_placement' )
		)
	) {
		return array();
	}

	$candidates = justice_fms_candidate_profiles( $term_ids );

	if ( empty( $candidates ) ) {
		return array();
	}

	$rows = array();

	foreach ( $candidates as $candidate ) {
		$lawyer_id = (int) $candidate->ID;

		if ( $lawyer_id === $exclude ) {
			continue;
		}

		// Both truth helpers are required. Missing theme contracts fail closed.
		if (
			! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			|| ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id )
			|| justice_fms_has_public_sponsored_placement( $lawyer_id )
		) {
			continue;
		}

		$score = (int) get_post_meta( $lawyer_id, 'priority_score', true );

		$rows[] = array(
			'id'    => $lawyer_id,
			'score' => $score,
		);
	}

	if ( empty( $rows ) ) {
		return array();
	}

	// Organic equals rotate daily but stay stable within a day so the page
	// cache and the visitor see the same strip.
	$seed = crc32( get_the_ID() . gmdate( 'Ymd' ) );
	usort( $rows, function ( $a, $b ) use ( $seed ) {
		if ( $a['score'] !== $b['score'] ) {
			return $b['score'] <=> $a['score'];
		}
		return ( crc32( $seed . $a['id'] ) ) <=> ( crc32( $seed . $b['id'] ) );
	} );

	$picked = array();

	$picked_ids = array_column( array_slice( $rows, 0, 3 ), 'id' );
	if ( $picked_ids && function_exists( 'update_object_term_cache' ) ) {
		update_object_term_cache( $picked_ids, 'justice_lawyer' );
	}

	foreach ( array_slice( $rows, 0, 3 ) as $row ) {
		$lawyer_id = $row['id'];
		$areas     = get_the_terms( $lawyer_id, 'practice-areas' );
		$cities    = get_the_terms( $lawyer_id, 'city' );
		$area_name = '';

		if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
			// Prefer an area the article itself carries - that's the match
			// the reader is in the middle of.
			foreach ( $areas as $area ) {
				if ( in_array( (int) $area->term_id, $term_ids, true ) ) {
					$area_name = $area->name;
					break;
				}
			}
			if ( '' === $area_name ) {
				$area_name = $areas[0]->name;
			}
		}

		$picked[] = array(
			'id'    => $lawyer_id,
			'title' => get_the_title( $lawyer_id ),
			'url'   => get_permalink( $lawyer_id ),
			'area'  => $area_name,
			'city'  => ( ! empty( $cities ) && ! is_wp_error( $cities ) ) ? $cities[0]->name : '',
			'type'  => justice_fms_professional_type_label( $lawyer_id ),
		);
	}

	return $picked;
}

/**
 * Paid-plan keys used to keep sponsored profiles out of organic inventory.
 *
 * @return string[]
 */
function justice_fms_active_paid_plan_keys(): array {
	return function_exists( 'justice_cards_active_paid_plan_keys' )
		? justice_cards_active_paid_plan_keys()
		: array( 'pro', 'featured', 'premium', 'lead_partner', 'full_service' );
}

/**
 * Fail closed when sponsorship truth is unavailable.
 */
function justice_fms_has_public_sponsored_placement( int $lawyer_id ): bool {
	if ( function_exists( 'justice_cards_has_public_sponsored_placement' ) ) {
		return justice_cards_has_public_sponsored_placement( $lawyer_id );
	}
	if ( function_exists( 'justice_theme_lawyer_has_public_sponsored_placement' ) ) {
		if ( justice_theme_lawyer_has_public_sponsored_placement( $lawyer_id ) ) {
			return true;
		}

		$subscription = sanitize_key( (string) get_post_meta( $lawyer_id, 'subscription_status', true ) );
		$plan         = sanitize_key( (string) get_post_meta( $lawyer_id, 'plan_type', true ) );

		return 'active' === $subscription && in_array( $plan, justice_fms_active_paid_plan_keys(), true );
	}

	return true;
}

/**
 * Bounded, cached organic candidate pool with SQL-level paid exclusion.
 * Final helper checks still fail closed, so stale meta cannot expose a paid
 * profile as organic. The 96-profile pool avoids the old full-directory scan.
 *
 * @param int[] $term_ids Practice-area IDs.
 * @return WP_Post[]
 */
function justice_fms_candidate_profiles( array $term_ids ): array {
	$term_ids  = array_values( array_unique( array_filter( array_map( 'intval', $term_ids ) ) ) );
	sort( $term_ids, SORT_NUMERIC );
	$cache_key = 'jt_fms_' . substr( hash( 'sha256', wp_json_encode( array( $term_ids, justice_fms_active_paid_plan_keys() ) ) ), 0, 26 );
	$cached    = get_transient( $cache_key );
	$args      = array(
		'post_type'              => 'justice_lawyer',
		'post_status'            => 'publish',
		'posts_per_page'         => 96,
		'orderby'                => 'date',
		'order'                  => 'DESC',
		'no_found_rows'          => true,
		'update_post_meta_cache' => true,
		'update_post_term_cache' => false,
	);

	if ( is_array( $cached ) ) {
		$args['post__in'] = array_values( array_unique( array_map( 'intval', $cached ) ) );
		$args['orderby']  = 'post__in';
		if ( empty( $args['post__in'] ) ) {
			return array();
		}

		return get_posts( $args );
	}

	$args['tax_query'] = array(
		array(
			'taxonomy' => 'practice-areas',
			'field'    => 'term_id',
			'terms'    => $term_ids,
		),
	);
	$args['meta_query'] = array(
		'relation' => 'AND',
		array(
			'relation' => 'OR',
			array(
				'key'     => 'sponsored_placement_status',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'sponsored_placement_status',
				'value'   => 'active',
				'compare' => '!=',
			),
		),
		array(
			'relation' => 'OR',
			array(
				'key'     => 'subscription_status',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'subscription_status',
				'value'   => 'active',
				'compare' => '!=',
			),
			array(
				'key'     => 'plan_type',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'plan_type',
				'value'   => justice_fms_active_paid_plan_keys(),
				'compare' => 'NOT IN',
			),
		),
	);

	$profiles = get_posts( $args );
	set_transient( $cache_key, array_map( static fn( WP_Post $post ): int => (int) $post->ID, $profiles ), 10 * MINUTE_IN_SECONDS );

	return $profiles;
}

/**
 * Neutral professional-type label for an organic card.
 */
function justice_fms_professional_type_label( int $lawyer_id ): string {
	if ( function_exists( 'justice_cards_professional_type_label' ) ) {
		return (string) preg_replace( '/^כרטיס\s+/u', '', justice_cards_professional_type_label( $lawyer_id ) );
	}

	$type = sanitize_key( (string) get_post_meta( $lawyer_id, 'professional_type', true ) );
	$map  = array(
		'lawyer'              => 'עורך דין',
		'law_firm'            => 'משרד עורכי דין',
		'rabbinical_advocate' => 'טוען רבני',
		'mediator'            => 'מגשר',
		'notary'              => 'נוטריון',
		'legal_supplier'      => 'ספק שירותים משפטיים',
	);

	return $map[ $type ] ?? 'איש מקצוע משפטי';
}

/**
 * Render the strip markup.
 *
 * @param array[] $firms     From justice_fms_pick_firms().
 * @param string  $area_slug Slug for the "all firms in this area" link.
 * @return string
 */
function justice_fms_render( array $firms, string $area_slug ): string {
	if ( empty( $firms ) ) {
		return '';
	}

	$archive_url = home_url( '/lawyers/' );

	if ( '' !== $area_slug ) {
		$archive_url = add_query_arg( 'area', rawurlencode( $area_slug ), $archive_url );
	}

	$html = '<aside class="jt-firm-strip" aria-label="כרטיסים נוספים במאגר אנשי המקצוע המשפטיים">';
	$html .= '<div class="jt-firm-strip__head"><span class="jt-firm-strip__title">אנשי מקצוע משפטיים נוספים</span>'
		. '<a class="jt-firm-strip__all" href="' . esc_url( $archive_url ) . '" data-lead-utm-source="article_firm_strip" data-lead-utm-medium="internal" data-lead-utm-campaign="firm_index">לכל המשרדים ←</a></div>';
	$html .= '<p class="jt-firm-strip__note">השיוך מבוסס על התחום הכללי של המאמר בלבד. יש לבדוק רישיון, ניסיון והתאמה למקרה.</p>';
	$html .= '<div class="jt-firm-strip__row">';

	foreach ( $firms as $firm ) {
		$html .= '<a class="jt-firm-strip__card" href="' . esc_url( $firm['url'] ) . '" data-lead-utm-source="article_firm_strip" data-lead-utm-medium="internal" data-lead-utm-campaign="firm_index">';
		$html .= '<strong class="jt-firm-strip__name">' . esc_html( $firm['title'] ) . '</strong>';
		$meta_bits = array_filter( array( $firm['type'] ?? '', $firm['area'], $firm['city'] ) );
		if ( ! empty( $meta_bits ) ) {
			$html .= '<span class="jt-firm-strip__meta">' . esc_html( implode( ' · ', $meta_bits ) ) . '</span>';
		}
		$html .= '</a>';
	}

	$html .= '</div></aside>';

	return $html;
}

function justice_fms_filter_content( $content ): string {
	if ( ! is_singular( 'articles' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if (
		is_feed()
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

	$content = (string) $content;

	if ( false !== strpos( $content, 'jt-firm-strip' ) ) {
		return $content;
	}

	if ( function_exists( 'justice_cards_country_context' ) && 'comparison' === justice_cards_country_context() ) {
		return $content;
	}

	$terms = get_the_terms( get_the_ID(), 'practice-areas' );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return $content;
	}

	$term_ids = array_map( 'intval', wp_list_pluck( $terms, 'term_id' ) );
	$firms    = justice_fms_pick_firms( $term_ids );

	if ( empty( $firms ) ) {
		return $content;
	}

	$strip = justice_fms_render( $firms, (string) $terms[0]->slug );

	return $content . $strip;
}
add_filter( 'the_content', 'justice_fms_filter_content', 30 );

add_action( 'wp_head', function () {
	if ( ! is_singular( 'articles' ) ) {
		return;
	}

	echo '<style id="jt-firm-strip-css">'
		. '.jt-firm-strip{background:#f7f9fd;border:1px solid #dbe3f0;border-inline-start:4px solid #14213d;border-radius:14px;padding:16px 18px;margin:26px 0}'
		. '.jt-firm-strip__head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}'
		. '.jt-firm-strip__title{font-weight:800;font-size:15.5px;color:#14213d}'
		. '.jt-firm-strip__note{margin:0 0 12px;font-size:12.5px;line-height:1.55;color:#44506b}'
		. '.jt-firm-strip__all{font-weight:700;font-size:13.5px;color:#1b2f55;text-decoration:none;white-space:nowrap}'
		. '.jt-firm-strip__all:hover{text-decoration:underline}'
		. '.jt-firm-strip__row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}'
		. '.jt-firm-strip__card{position:relative;display:flex;flex-direction:column;gap:4px;background:#fff;border:1px solid #cbd6e8;border-radius:11px;padding:12px 14px;text-decoration:none;min-height:72px;transition:border-color .15s ease,box-shadow .15s ease}'
		. '.jt-firm-strip__card:hover{border-color:#14213d;box-shadow:0 6px 16px rgba(20,33,61,.10)}'
		. '.jt-firm-strip__name{font-size:14.5px;font-weight:800;color:#14213d;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}'
		. '.jt-firm-strip__meta{font-size:12.5px;color:#44506b}'
		. '@media (max-width:640px){.jt-firm-strip__row{grid-template-columns:1fr}.jt-firm-strip__card{min-height:0}}'
		. '</style>';
} );
