<?php
/**
 * Display-only practice fixes (owner order 2026-07-21). No DB writes here,
 * ever: these are render-time blocks and query scoping only.
 *
 * 1. Practice-areas taxonomy archives list the articles CPT (they queried
 *    the empty default post type, so pillar links landed on "no results").
 * 2. Thin practice city pages open with the firms band and the map instead
 *    of bare text, and close with a link to the practice pillar.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Practice-areas term archives must surface the articles CPT.
 */
function justice_theme_practice_tax_archive_post_types( WP_Query $query ): void {
	if ( is_admin() || ! $query->is_main_query() || ! $query->is_tax( 'practice-areas' ) ) {
		return;
	}
	$query->set( 'post_type', array( 'articles', 'post' ) );
	$query->set( 'posts_per_page', 12 );
}
add_action( 'pre_get_posts', 'justice_theme_practice_tax_archive_post_types', 20 );

/**
 * Map a city-page slug to its practice term and pillar.
 *
 * @param string $slug Page slug.
 * @return array{term:string,pillar:string,label:string}|null
 */
function justice_theme_city_page_practice( string $slug ): ?array {
	if ( preg_match( '/^criminal-lawyer-[a-z-]+$/', $slug ) ) {
		return array(
			'term'   => 'criminal-law',
			'pillar' => '/criminal-defense-attorney/',
			'label'  => 'עורך דין פלילי',
		);
	}
	return null;
}

/**
 * Prepend the firms band + map to thin practice city pages, and append the
 * pillar link. Render-time only.
 */
function justice_theme_city_page_enrichment( ?string $content ): string {
	$content = (string) $content;
	if ( is_admin() ) {
		return $content;
	}
	// Flag-proof: ops early hooks corrupt is_page()/is_main_query() on pages,
	// so route by the queried object itself (same fix as the pillar router).
	$queried = get_queried_object();
	if ( ! ( $queried instanceof WP_Post ) || 'page' !== $queried->post_type || get_the_ID() !== $queried->ID ) {
		return $content;
	}
	$slug     = (string) $queried->post_name;
	$practice = justice_theme_city_page_practice( $slug );
	if ( null === $practice ) {
		return $content;
	}

	$top = '';

	if ( taxonomy_exists( 'practice-areas' ) && post_type_exists( 'justice_lawyer' ) ) {
		$term = get_term_by( 'slug', $practice['term'], 'practice-areas' );
		if ( $term instanceof WP_Term ) {
			$object_ids = get_objects_in_term( $term->term_id, 'practice-areas' );
			$firms      = array();
			$seen       = array();
			if ( is_array( $object_ids ) ) {
				foreach ( $object_ids as $object_id ) {
					$candidate = get_post( (int) $object_id );
					if ( ! ( $candidate instanceof WP_Post ) || 'justice_lawyer' !== $candidate->post_type || 'publish' !== $candidate->post_status ) {
						continue;
					}
					if ( function_exists( 'justice_theme_lawyer_is_visible' ) && ! justice_theme_lawyer_is_visible( (int) $candidate->ID ) ) {
						continue;
					}
					$key = mb_substr( preg_replace( '/[^א-תa-z0-9]/iu', '', mb_strtolower( $candidate->post_title ) ), 0, 18 );
					$dup = isset( $seen[ $key ] );
					if ( ! $dup ) {
						foreach ( array_keys( $seen ) as $seen_key ) {
							if ( levenshtein( $key, (string) $seen_key ) <= 4 ) {
								$dup = true;
								break;
							}
						}
					}
					if ( $dup ) {
						continue;
					}
					$seen[ $key ] = true;
					$firms[]      = $candidate;
					if ( count( $firms ) >= 6 ) {
						break;
					}
				}
			}
			if ( count( $firms ) >= 3 ) {
				$top .= '<div class="city-page-firms"><p class="section-header__eyebrow">נבדקו ונמצאו מובילים</p><h2>משרדי עורכי דין מובילים בתחום</h2><ul class="city-page-firms__list">';
				foreach ( $firms as $firm ) {
					$top .= '<li><a href="' . esc_url( get_permalink( $firm ) ) . '">' . esc_html( $firm->post_title ) . '</a></li>';
				}
				$top .= '</ul></div>';
			}
		}
	}

	if ( function_exists( 'justice_cinema_block' ) ) {
		$top .= '<div class="city-page-map">' . justice_cinema_block( false ) . '</div>';
	}

	$bottom = '<p class="city-page-pillar-link">למדריך המלא: <a href="' . esc_url( home_url( $practice['pillar'] ) ) . '">' . esc_html( $practice['label'] ) . '</a>.</p>';

	return $top . $content . $bottom;
}
add_filter( 'the_content', 'justice_theme_city_page_enrichment', 60 );
