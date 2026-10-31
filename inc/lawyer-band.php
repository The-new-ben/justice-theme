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
 * @param bool   $directory_only  Require a contactable card and public listing query eligibility.
 * @return WP_Post[]
 */
function justice_theme_get_practice_firms( string $term_slug, int $limit = 6, bool $registered_only = false, bool $directory_only = false ): array {
	if ( ! $term_slug || ! taxonomy_exists( 'practice-areas' ) || ! post_type_exists( 'justice_lawyer' ) ) {
		return array();
	}
	$term = get_term_by( 'slug', $term_slug, 'practice-areas' );
	if ( ! ( $term instanceof WP_Term ) ) {
		return array();
	}

	$candidates = array();
	// Name-only bands historically use term relationships. They are not proof
	// that the directory offers a contactable professional. Conversion surfaces
	// must also honour its public query filters and the existing activity gate.
	$object_ids = $directory_only
		? get_posts(
			array(
				'post_type'                     => 'justice_lawyer',
				'post_status'                   => 'publish',
				'posts_per_page'                => -1,
				'fields'                        => 'ids',
				'no_found_rows'                 => true,
				'suppress_filters'              => false,
				'justice_public_lawyer_listing' => true,
				'tax_query'                     => array(
					array(
						'taxonomy' => 'practice-areas',
						'field'    => 'slug',
						'terms'    => $term_slug,
					),
				),
			)
		)
		: get_objects_in_term( $term->term_id, 'practice-areas' );
	if ( ! is_array( $object_ids ) ) {
		return array();
	}
	foreach ( $object_ids as $object_id ) {
		$candidate = get_post( (int) $object_id );
		if ( ! ( $candidate instanceof WP_Post ) || 'justice_lawyer' !== $candidate->post_type || 'publish' !== $candidate->post_status ) {
			continue;
		}
		if (
			! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			|| ! justice_theme_lawyer_profile_is_public_approved( (int) $candidate->ID )
		) {
			continue;
		}
		if ( $registered_only ) {
			$status = (string) get_post_meta( $candidate->ID, 'sponsored_placement_status', true );
			if ( ! in_array( $status, array( 'active', 'reserved' ), true ) ) {
				continue;
			}
		}
		if (
			$directory_only
			&& (
				! function_exists( 'justice_theme_lawyer_card_is_active' )
				|| ! justice_theme_lawyer_card_is_active( (int) $candidate->ID )
			)
		) {
			continue;
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
 * One premium lawyer card. A lawyer with an office plan gets it beside the text (HAD-616, inc/lawyer-office.php).
 *
 * The plugin's in-article card reuses this card for the house lawyer (HAD-641, Ben 31.10.2026: "the new card on all
 * the family pages"). It passes the article's own WhatsApp link in 'wa_href', and 'track' marks the WhatsApp and
 * profile links for the click beacon of justice-ops/card-analytics.php.
 *
 * @param WP_Post              $firm The justice_lawyer post.
 * @param array<string, mixed> $args 'wa_href' (string) and 'track' (bool), both optional.
 * @return array{html: string, schema: array<string, mixed>|null}
 */
function justice_theme_premium_card( WP_Post $firm, array $args = array() ): array {
	$office = function_exists( 'justice_theme_lawyer_office' ) ? justice_theme_lawyer_office( $firm ) : null;
	$track  = ! empty( $args['track'] );
	// Prefer the dedicated portrait (owner: the face looks at you from
	// the screen) over the featured banner/collage.
	$portrait_id = (int) get_post_meta( $firm->ID, 'profile_portrait_id', true );
	$photo       = $portrait_id
		? wp_get_attachment_image( $portrait_id, 'medium', false, array( 'class' => 'jt-premium-card__photo', 'loading' => 'lazy' ) )
		: get_the_post_thumbnail( $firm, 'medium', array( 'class' => 'jt-premium-card__photo', 'loading' => 'lazy' ) );
	$firm_name = wp_strip_all_tags( (string) get_post_meta( $firm->ID, 'firm_name', true ) );
	$firm_name = trim( str_replace( array( "\xE2\x80\x94", ' - ' ), array( ',', ', ' ), $firm_name ) );
	$city      = wp_strip_all_tags( (string) get_post_meta( $firm->ID, 'office_city', true ) );
	$bio       = wp_strip_all_tags( (string) get_post_meta( $firm->ID, 'bio_short', true ) );
	$phone     = preg_replace( '/[^0-9]/', '', (string) get_post_meta( $firm->ID, 'phone', true ) );
	$wa        = ! empty( $args['wa_href'] ) ? (string) $args['wa_href'] : ( $phone ? 'https://wa.me/972' . ltrim( $phone, '0' ) : '' );
	$profile   = esc_url( get_permalink( $firm ) );
	$click     = static function ( string $kind ) use ( $track ): string {
		return $track ? ' data-procard-click="' . $kind . '"' : '';
	};
	$html = '<div class="jt-premium-card' . ( $office ? ' jt-premium-card--office' : '' ) . '">';
	if ( $office ) {
		$html .= '<div class="jt-premium-card__main">';
	}
	if ( $photo ) {
		$html .= '<a class="jt-premium-card__photo-link" href="' . $profile . '"' . $click( 'profile' ) . '>' . $photo . '</a>';
	}
	$html .= '<div class="jt-premium-card__body">';
	$html .= '<a class="jt-premium-card__name" href="' . $profile . '"' . $click( 'profile' ) . '>' . esc_html( $firm->post_title ) . '</a>';
	$meta_line = implode( ' · ', array_filter( array( $firm_name, $city ) ) );
	if ( $meta_line ) {
		$html .= '<span class="jt-premium-card__meta">' . esc_html( $meta_line ) . '</span>';
	}
	if ( $bio ) {
		$html .= '<p class="jt-premium-card__bio">' . esc_html( wp_trim_words( $bio, 22, '' ) ) . '</p>';
	}
	$html .= '<span class="jt-premium-card__actions">';
	if ( $wa ) {
		$html .= '<a class="button button--gold jt-premium-card__wa" href="' . esc_url( $wa ) . '" target="_blank" rel="noopener' . ( $track ? ' nofollow" data-whatsapp-surface="procard"' : '"' ) . $click( 'wa' ) . '>וואטסאפ</a>';
	}
	if ( $phone ) {
		$html .= '<a class="button button--primary" href="tel:' . esc_attr( $phone ) . '">התקשרו</a>';
	}
	$html .= '<a class="button button--ghost" href="' . $profile . '"' . $click( 'profile' ) . '>לפרופיל המלא</a>';
	$html .= '</span></div>';
	if ( $office ) {
		$html .= '</div>' . justice_theme_lawyer_office_html( $firm, $office );
	}
	$html .= '</div>';
	return array(
		'html'   => $html,
		'schema' => $office ? justice_theme_lawyer_office_schema( $firm, $office ) : null,
	);
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
	$firms   = justice_theme_get_practice_firms( $term_slug, 3, true );
	$html    = '<div class="jt-registered-band">';
	$schemas = array();
	if ( ! empty( $firms ) ) {
		foreach ( $firms as $firm ) {
			$card  = justice_theme_premium_card( $firm );
			$html .= $card['html'];
			if ( $card['schema'] ) {
				$schemas[] = $card['schema'];
			}
		}
	} else {
		$html .= '<div class="jt-registered-band__recruit">';
		$html .= '<strong>' . esc_html( sprintf( 'המקום הזה שמור למשרד מוביל בתחום %s.', $practice_label ) ) . '</strong> ';
		$html .= esc_html__( 'עורכי דין: רוצים להופיע כאן בפני לקוחות שמחפשים בדיוק אתכם?', 'justice-theme' );
		$html .= ' <a class="button button--ghost" href="' . esc_url( home_url( '/lawyer-plans/' ) ) . '">' . esc_html__( 'לפרטים והצטרפות', 'justice-theme' ) . '</a>';
		$html .= '</div>';
	}
	$html .= '</div>';
	if ( $schemas ) {
		foreach ( $schemas as $schema ) {
			$html .= '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';
		}
		$html .= justice_theme_lawyer_office_script();
	}
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
