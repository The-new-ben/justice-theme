<?php
/**
 * The single smart firm-surfacing mechanism (owner order 2026-07-21).
 *
 * Every surface that floats lawyers uses these helpers, so the rules live
 * in ONE place: owner visibility flag honored, Hebrew-titled profiles
 * first, typo-twin dedupe, and the registered (sponsored) tier separated
 * from the organic tier. Display-only: nothing here writes to the DB.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Fetch publish-visible firms for a practice term, Hebrew-first, deduped.
 *
 * @param string $term_slug       practice-areas term slug.
 * @param int    $limit           Max firms to return.
 * @param bool   $registered_only Only sponsored/reserved (registered) cards.
 * @return WP_Post[]
 */
function justice_theme_get_practice_firms( string $term_slug, int $limit = 6, bool $registered_only = false ): array {
	if ( ! $term_slug || ! taxonomy_exists( 'practice-areas' ) || ! post_type_exists( 'justice_lawyer' ) ) {
		return array();
	}
	$term = get_term_by( 'slug', $term_slug, 'practice-areas' );
	if ( ! ( $term instanceof WP_Term ) ) {
		return array();
	}

	$candidates = array();
	$object_ids = get_objects_in_term( $term->term_id, 'practice-areas' );
	if ( ! is_array( $object_ids ) ) {
		return array();
	}
	foreach ( $object_ids as $object_id ) {
		$candidate = get_post( (int) $object_id );
		if ( ! ( $candidate instanceof WP_Post ) || 'justice_lawyer' !== $candidate->post_type || 'publish' !== $candidate->post_status ) {
			continue;
		}
		if ( function_exists( 'justice_theme_lawyer_is_visible' ) && ! justice_theme_lawyer_is_visible( (int) $candidate->ID ) ) {
			continue;
		}
		if ( $registered_only ) {
			$status = (string) get_post_meta( $candidate->ID, 'sponsored_placement_status', true );
			if ( ! in_array( $status, array( 'active', 'reserved' ), true ) ) {
				continue;
			}
		}
		$candidates[] = $candidate;
	}

	// Hebrew-titled profiles first (the audience reads Hebrew; English-only
	// records sorted to the tail until they get Hebrew titles), then A-B.
	usort(
		$candidates,
		static function ( WP_Post $a, WP_Post $b ): int {
			$a_heb = preg_match( '/[א-ת]/u', $a->post_title ) ? 0 : 1;
			$b_heb = preg_match( '/[א-ת]/u', $b->post_title ) ? 0 : 1;
			if ( $a_heb !== $b_heb ) {
				return $a_heb <=> $b_heb;
			}
			return strcmp( $a->post_title, $b->post_title );
		}
	);

	// Typo-twin dedupe (ונוטריון/ונטוריון class): normalized prefix key plus
	// near-match distance.
	$seen = array();
	$out  = array();
	foreach ( $candidates as $candidate ) {
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
		$out[]        = $candidate;
		if ( count( $out ) >= $limit ) {
			break;
		}
	}
	return $out;
}

/**
 * The registered-tier mid-fold band: registered cards when they exist, an
 * honest recruitment card addressed to lawyers when the slot is open.
 *
 * @param string $term_slug      practice-areas term slug.
 * @param string $practice_label Human practice label for the copy.
 * @return string HTML.
 */
function justice_theme_registered_band_html( string $term_slug, string $practice_label ): string {
	$firms = justice_theme_get_practice_firms( $term_slug, 3, true );
	$html  = '<div class="jt-registered-band">';
	$html .= '<p class="section-header__eyebrow">' . esc_html__( 'כרטיס רשום', 'justice-theme' ) . '</p>';
	if ( ! empty( $firms ) ) {
		$html .= '<ul class="jt-registered-band__list">';
		foreach ( $firms as $firm ) {
			$html .= '<li><a href="' . esc_url( get_permalink( $firm ) ) . '">' . esc_html( $firm->post_title ) . '</a>';
			$city  = get_post_meta( $firm->ID, 'office_city', true );
			if ( $city ) {
				$html .= ' <span class="jt-registered-band__city">' . esc_html( wp_strip_all_tags( (string) $city ) ) . '</span>';
			}
			$html .= '</li>';
		}
		$html .= '</ul>';
	} else {
		$html .= '<div class="jt-registered-band__recruit">';
		$html .= '<strong>' . esc_html( sprintf( 'המקום הזה שמור למשרד רשום בתחום %s.', $practice_label ) ) . '</strong> ';
		$html .= esc_html__( 'עורכי דין: רוצים להופיע כאן בפני לקוחות שמחפשים בדיוק אתכם?', 'justice-theme' );
		$html .= ' <a class="button button--ghost" href="' . esc_url( home_url( '/lawyer-plans/' ) ) . '">' . esc_html__( 'הצטרפות ככרטיס רשום', 'justice-theme' ) . '</a>';
		$html .= '</div>';
	}
	$html .= '</div>';
	return $html;
}

/**
 * The mid-fold engagement block: registered band + the map. Injected after
 * the opening text sections, never before them (text first: relevance is
 * what the blind librarian reads).
 *
 * @param string $term_slug      practice-areas term slug.
 * @param string $practice_label Human practice label.
 * @return string HTML.
 */
function justice_theme_midfold_block_html( string $term_slug, string $practice_label ): string {
	$html  = '<div class="jt-midfold">';
	$html .= justice_theme_registered_band_html( $term_slug, $practice_label );
	if ( function_exists( 'justice_cinema_block' ) ) {
		$html .= '<div class="jt-midfold__map">' . justice_cinema_block( false ) . '</div>';
	}
	$html .= '</div>';
	return $html;
}

/**
 * Inject HTML after the Nth H2 section of a content string (default: after
 * the second section, the "lower upper fold"). Falls back to appending when
 * the content has fewer sections.
 *
 * @param string $content HTML content.
 * @param string $inject  HTML to inject.
 * @param int    $after_sections Number of H2 sections to keep above.
 * @return string
 */
function justice_theme_inject_after_section( string $content, string $inject, int $after_sections = 2 ): string {
	$positions = array();
	$offset    = 0;
	while ( false !== ( $pos = stripos( $content, '<h2', $offset ) ) ) {
		$positions[] = $pos;
		$offset      = $pos + 3;
	}
	if ( count( $positions ) > $after_sections ) {
		$cut = $positions[ $after_sections ];
		return substr( $content, 0, $cut ) . $inject . substr( $content, $cut );
	}
	return $content . $inject;
}
