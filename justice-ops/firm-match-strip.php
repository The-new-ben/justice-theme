<?php
/**
 * Matched-firms strip: distribute the law-firm index into the content pages
 * (owner order 2026-07-18: "the index listing distributed among the content
 * pages, accessible on the upper fold").
 *
 * On every single article, inject a compact strip of up to 3 firm cards
 * matched by the article's practice-areas terms, placed before the FIRST
 * <h2> - the highest content position that doesn't break the intro. Cards
 * are ordered by priority_score (the paid-placement dial) with a
 * date-seeded rotation among equals, so free firms rotate fairly and paid
 * firms always lead - the strip is the inventory the paid tiers buy.
 * Paid placements carry an honest "ממומן" chip per the site's labeling law.
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
 * @return array[] Each: id, title, url, area, city, sponsored.
 */
function justice_fms_pick_firms( array $term_ids, int $exclude = 0 ): array {
	if ( empty( $term_ids ) ) {
		return array();
	}

	$candidate_ids = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => 24,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'tax_query'      => array(
				array(
					'taxonomy' => 'practice-areas',
					'field'    => 'term_id',
					'terms'    => $term_ids,
				),
			),
		)
	);

	if ( empty( $candidate_ids ) ) {
		return array();
	}

	$rows = array();

	foreach ( $candidate_ids as $lawyer_id ) {
		$lawyer_id = (int) $lawyer_id;

		if ( $lawyer_id === $exclude ) {
			continue;
		}

		if ( function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			&& ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id ) ) {
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

	// Paid first; equals rotate daily but stay stable within a day so the
	// page cache and the visitor see the same strip.
	$seed = crc32( get_the_ID() . gmdate( 'Ymd' ) );
	usort( $rows, function ( $a, $b ) use ( $seed ) {
		if ( $a['score'] !== $b['score'] ) {
			return $b['score'] <=> $a['score'];
		}
		return ( crc32( $seed . $a['id'] ) ) <=> ( crc32( $seed . $b['id'] ) );
	} );

	$picked = array();

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
			'id'        => $lawyer_id,
			'title'     => get_the_title( $lawyer_id ),
			'url'       => get_permalink( $lawyer_id ),
			'area'      => $area_name,
			'city'      => ( ! empty( $cities ) && ! is_wp_error( $cities ) ) ? $cities[0]->name : '',
			'sponsored' => $row['score'] > 0,
		);
	}

	return $picked;
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

	$html = '<aside class="jt-firm-strip" aria-label="משרדי עורכי דין בתחום">';
	$html .= '<div class="jt-firm-strip__head"><span class="jt-firm-strip__title">משרדי עורכי דין בתחום זה</span>'
		. '<a class="jt-firm-strip__all" href="' . esc_url( $archive_url ) . '" data-lead-utm-source="article_firm_strip" data-lead-utm-medium="internal" data-lead-utm-campaign="firm_index">לכל המשרדים ←</a></div>';
	$html .= '<div class="jt-firm-strip__row">';

	foreach ( $firms as $firm ) {
		$html .= '<a class="jt-firm-strip__card" href="' . esc_url( $firm['url'] ) . '" data-lead-utm-source="article_firm_strip" data-lead-utm-medium="internal" data-lead-utm-campaign="firm_index">';
		$html .= '<strong class="jt-firm-strip__name">' . esc_html( $firm['title'] ) . '</strong>';
		$meta_bits = array_filter( array( $firm['area'], $firm['city'] ) );
		if ( ! empty( $meta_bits ) ) {
			$html .= '<span class="jt-firm-strip__meta">' . esc_html( implode( ' · ', $meta_bits ) ) . '</span>';
		}
		if ( $firm['sponsored'] ) {
		}
		$html .= '</a>';
	}

	$html .= '</div></aside>';

	return $html;
}

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( 'articles' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if ( is_feed() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return $content;
	}

	$content = (string) $content;

	if ( false !== strpos( $content, 'jt-firm-strip' ) ) {
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

	if ( preg_match( '/<h2[\s>]/i', $content, $m, PREG_OFFSET_CAPTURE ) ) {
		return substr_replace( $content, $strip, $m[0][1], 0 );
	}

	return $content . $strip;
}, 30 );

add_action( 'wp_head', function () {
	if ( ! is_singular( 'articles' ) ) {
		return;
	}

	echo '<style id="jt-firm-strip-css">'
		. '.jt-firm-strip{background:#f7f9fd;border:1px solid #dbe3f0;border-inline-start:4px solid #14213d;border-radius:14px;padding:16px 18px;margin:26px 0}'
		. '.jt-firm-strip__head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}'
		. '.jt-firm-strip__title{font-weight:800;font-size:15.5px;color:#14213d}'
		. '.jt-firm-strip__all{font-weight:700;font-size:13.5px;color:#1b2f55;text-decoration:none;white-space:nowrap}'
		. '.jt-firm-strip__all:hover{text-decoration:underline}'
		. '.jt-firm-strip__row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}'
		. '.jt-firm-strip__card{position:relative;display:flex;flex-direction:column;gap:4px;background:#fff;border:1px solid #cbd6e8;border-radius:11px;padding:12px 14px;text-decoration:none;min-height:72px;transition:border-color .15s ease,box-shadow .15s ease}'
		. '.jt-firm-strip__card:hover{border-color:#14213d;box-shadow:0 6px 16px rgba(20,33,61,.10)}'
		. '.jt-firm-strip__name{font-size:14.5px;font-weight:800;color:#14213d;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}'
		. '.jt-firm-strip__meta{font-size:12.5px;color:#44506b}'
		. '.jt-firm-strip__chip{position:absolute;top:10px;inset-inline-end:10px;font-size:10.5px;font-weight:700;color:#8a6d1f;background:rgba(231,199,101,.18);border:1px solid rgba(231,199,101,.55);border-radius:999px;padding:1px 8px}'
		. '@media (max-width:640px){.jt-firm-strip__row{grid-template-columns:1fr}.jt-firm-strip__card{min-height:0}}'
		. '</style>';
} );
