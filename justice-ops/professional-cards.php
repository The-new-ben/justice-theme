<?php
/**
 * Professional cards: the monetization surface.
 *
 * Every article, news brief and encyclopedia entry that belongs to a legal
 * family floats a rich card of the professionals attached to that family's
 * practice-area terms, ordered by priority_score (the paid placement dial,
 * same meta the practice hubs already rank by) with a daily rotation
 * tie-break, capped and clearly labeled. Mobile-first: the card is injected
 * inline after the second section heading so long articles surface it high,
 * and a second slot renders before the FAQ block. Each card links the
 * lawyer's full profile (the mini-site) and opens WhatsApp with the page
 * context plus the lawyer's name.
 *
 * Modeled on the patterns of the leading directories (Justia refreshed
 * mobile-first cards; rotating premium placements per practice+locality).
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Content context → candidate practice-area term slugs.
 * Filterable for new niches: add_filter( 'justice_cards_family_map', ... ).
 */
function justice_cards_family_map(): array {
	return apply_filters( 'justice_cards_family_map', array(
		'criminal-law'  => array( 'criminal-law', 'criminal' ),
		'family'        => array( 'family-law', 'divorce', 'child-support', 'child-custody', 'rabbinical-court', 'family-court' ),
		'real-estate'   => array( 'real-estate-law', 'real-estate' ),
		'labor'         => array( 'israeli-labor-law', 'labor-law' ),
		'nezikin'       => array( 'personal-injury', 'tort-law' ),
		'tax-business'  => array( 'tax-law', 'corporate-law' ),
		'inheritance'   => array( 'inheritance-law', 'wills-probate' ),
		'traffic'       => array( 'traffic-law' ),
	) );
}

/**
 * Resolve the family key for the current singular view.
 */
function justice_cards_current_terms(): array {
	$map = justice_cards_family_map();

	if ( is_singular( 'justice_term' ) ) {
		$domain = (string) get_post_meta( get_the_ID(), 'enc_domain', true );

		foreach ( array( 'criminal' => 'criminal-law', 'family' => 'family', 'real-estate' => 'real-estate', 'labor' => 'labor', 'nezikin' => 'nezikin', 'tax' => 'tax-business', 'inheritance' => 'inheritance', 'traffic' => 'traffic' ) as $needle => $fkey ) {
			if ( false !== strpos( $domain, $needle ) && isset( $map[ $fkey ] ) ) {
				return $map[ $fkey ];
			}
		}

		return array();
	}

	if ( is_singular( 'post' ) ) {
		$news_family = (string) get_post_meta( get_the_ID(), 'news_family', true );

		if ( isset( $map[ $news_family ] ) ) {
			return $map[ $news_family ];
		}
	}

	if ( ! is_singular( array( 'articles', 'post' ) ) ) {
		return array();
	}

	// Articles carry the same practice-areas taxonomy the lawyers do; the
	// page's own terms are the most precise signal. A term that belongs to a
	// family expands to the whole family so the lawyer pool stays wide.
	$own = get_the_terms( get_the_ID(), 'practice-areas' );

	if ( $own && ! is_wp_error( $own ) ) {
		$slugs = wp_list_pluck( $own, 'slug' );

		foreach ( $map as $family_slugs ) {
			if ( array_intersect( $slugs, $family_slugs ) ) {
				return $family_slugs;
			}
		}

		return $slugs;
	}

	$cats = wp_get_post_categories( get_the_ID(), array( 'fields' => 'slugs' ) );

	$cat_to_family = array(
		'criminal-law' => 'criminal-law',
		'family-law'   => 'family',
		'divorce'      => 'family',
		'real-estate'  => 'real-estate',
		'labor'        => 'labor',
		'nezikin'      => 'nezikin',
		'inheritance'  => 'inheritance',
		'business'     => 'tax-business',
		'traffic'      => 'traffic',
	);

	foreach ( (array) $cats as $cat ) {
		if ( isset( $cat_to_family[ $cat ] ) && isset( $map[ $cat_to_family[ $cat ] ] ) ) {
			return $map[ $cat_to_family[ $cat ] ];
		}
	}

	return array();
}

/**
 * Query the family's professionals: priority first, daily rotation tie-break.
 */
function justice_cards_lawyers( array $term_slugs, int $limit ): array {
	if ( ! $term_slugs || ! post_type_exists( 'justice_lawyer' ) ) {
		return array();
	}

	// No meta_key in the query: that inner join would drop profiles missing
	// the meta. Ranking happens in PHP after the public-approval gate.
	$candidates = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 24,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'tax_query'      => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $term_slugs,
			),
		),
	) );

	// Sponsored placement is stricter than directory listing: only profiles
	// the theme approves for public output may float inside content, and only
	// with a positive priority_score. Score zero means directory-only; the
	// score is the placement dial that sells this surface.
	$lawyers = array();

	foreach ( $candidates as $candidate ) {
		if ( (int) get_post_meta( $candidate->ID, 'priority_score', true ) < 1 ) {
			continue;
		}

		if ( function_exists( 'justice_theme_lawyer_profile_is_public_approved' ) ) {
			if ( ! justice_theme_lawyer_profile_is_public_approved( $candidate->ID ) ) {
				continue;
			}
		} else {
			$status = strtolower( (string) get_post_meta( $candidate->ID, 'profile_status', true ) );
			if ( ! in_array( $status, array( 'approved', 'public', 'published', 'active', 'verified' ), true ) ) {
				continue;
			}
		}

		$lawyers[] = $candidate;
	}

	if ( ! $lawyers ) {
		return array();
	}

	// Group by score so equal-priority profiles rotate fairly by day.
	$groups = array();

	foreach ( $lawyers as $lawyer ) {
		$score = (string) (float) get_post_meta( $lawyer->ID, 'priority_score', true );
		$groups[ $score ][] = $lawyer;
	}

	krsort( $groups, SORT_NUMERIC );
	$seed   = (int) wp_date( 'zY' );
	$sorted = array();

	foreach ( $groups as $group ) {
		if ( count( $group ) > 1 ) {
			$offset = $seed % count( $group );
			$group  = array_merge( array_slice( $group, $offset ), array_slice( $group, 0, $offset ) );
		}
		$sorted = array_merge( $sorted, $group );
	}

	return array_slice( $sorted, 0, $limit );
}

/**
 * Render one rich professional card.
 */
function justice_cards_render( WP_Post $lawyer ): string {
	$pid    = $lawyer->ID;
	$name   = get_the_title( $pid );
	$url    = add_query_arg( array( 'utm_source' => 'jt-card', 'utm_medium' => 'incontent' ), get_permalink( $pid ) );
	$photo  = get_the_post_thumbnail_url( $pid, 'medium' );
	$areas  = get_the_terms( $pid, 'practice-areas' );
	$cities = get_the_terms( $pid, 'city' );

	$area_names = array();
	if ( $areas && ! is_wp_error( $areas ) ) {
		foreach ( array_slice( $areas, 0, 3 ) as $t ) {
			$area_names[] = $t->name;
		}
	}

	$city_name = ( $cities && ! is_wp_error( $cities ) ) ? $cities[0]->name : '';

	$rating_html = '';
	if ( function_exists( 'justice_theme_lawyer_reviews_public_state' ) ) {
		$state = justice_theme_lawyer_reviews_public_state( $pid );
		if ( ! empty( $state['show'] ) ) {
			$rating_html = '<span class="jt-procard__rating">★ ' . esc_html( number_format_i18n( (float) $state['average'], 1 ) ) . ' <small>(' . esc_html( number_format_i18n( (int) $state['count'] ) ) . ' ביקורות)</small></span>';
		}
	}

	$license = (string) get_post_meta( $pid, 'license_number', true );

	$wa_message = 'שלום, אני פונה מהעמוד: ' . mb_substr( wp_strip_all_tags( get_the_title() ), 0, 70 )
		. ' | ' . get_permalink()
		. ' | אשמח לשוחח עם ' . $name . '.';

	$wa_href = function_exists( 'justice_theme_public_whatsapp_url' )
		? justice_theme_public_whatsapp_url( $wa_message )
		: 'https://wa.me/972525101555?text=' . rawurlencode( $wa_message );

	$avatar = $photo
		? '<img class="jt-procard__photo" src="' . esc_url( $photo ) . '" alt="' . esc_attr( $name ) . '" loading="lazy" width="76" height="76" />'
		: '<span class="jt-procard__photo jt-procard__photo--initial">' . esc_html( mb_substr( trim( wp_strip_all_tags( $name ) ), 0, 1 ) ) . '</span>';

	return '<aside class="jt-procard" data-card-surface="incontent">'
		. '<div class="jt-procard__flag"><span>עורך דין לתחום זה</span><em>מקודם</em></div>'
		. '<div class="jt-procard__main">'
		. $avatar
		. '<div class="jt-procard__body">'
		. '<strong class="jt-procard__name">' . esc_html( $name ) . '</strong>'
		. ( $area_names ? '<span class="jt-procard__areas">' . esc_html( implode( ' · ', $area_names ) ) . '</span>' : '' )
		. '<span class="jt-procard__meta">'
		. ( $city_name ? '<span>' . esc_html( $city_name ) . '</span>' : '' )
		. ( $license ? '<span class="jt-procard__verified">רישיון מאומת</span>' : '' )
		. $rating_html
		. '</span>'
		. '</div></div>'
		. '<div class="jt-procard__actions">'
		. '<a class="jt-procard__wa" href="' . esc_url( $wa_href ) . '" target="_blank" rel="noopener nofollow" data-whatsapp-surface="procard">שיחת וואטסאפ</a>'
		. '<a class="jt-procard__profile" href="' . esc_url( $url ) . '">לפרופיל המלא</a>'
		. '</div>'
		. '</aside>';
}

function justice_cards_css(): string {
	return '<style id="jt-procard-css">'
		. '.jt-procard{border:1px solid #e3e6ee;border-radius:16px;box-shadow:0 8px 28px rgba(15,25,60,.08);margin:26px 0;overflow:hidden;background:#fff;font-size:15px}'
		. '.jt-procard__flag{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg,#f7f2e7,#fdfaf3);padding:8px 16px;font-size:12.5px;color:#8a6d1d;font-weight:700}'
		. '.jt-procard__flag em{font-style:normal;font-weight:600;color:#98a0b3;font-size:11px;border:1px solid #dfe3ec;border-radius:999px;padding:2px 8px}'
		. '.jt-procard__main{display:flex;gap:14px;padding:16px 16px 6px;align-items:center}'
		. '.jt-procard__photo{width:76px;height:76px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:2px solid #f1e8d2}'
		. '.jt-procard__photo--initial{display:flex;align-items:center;justify-content:center;background:#14213d;color:#e7c765;font-size:30px;font-weight:800}'
		. '.jt-procard__body{display:flex;flex-direction:column;gap:3px;min-width:0}'
		. '.jt-procard__name{font-size:17.5px;color:#14213d}'
		. '.jt-procard__areas{color:#4a5468;font-size:13.5px}'
		. '.jt-procard__meta{display:flex;flex-wrap:wrap;gap:10px;color:#6a7285;font-size:12.5px;align-items:center}'
		. '.jt-procard__verified{color:#0a7d2f;font-weight:700}'
		. '.jt-procard__rating{color:#8a6d1d;font-weight:700}'
		. '.jt-procard__actions{display:flex;gap:10px;padding:12px 16px 16px}'
		. '.jt-procard__wa,.jt-procard__profile{flex:1;text-align:center;border-radius:10px;padding:11px 10px;font-weight:700;font-size:14.5px;text-decoration:none}'
		. '.jt-procard__wa{background:#25d366;color:#fff}'
		. '.jt-procard__profile{background:#14213d;color:#fff}'
		. '.jt-procard__wa:hover,.jt-procard__profile:hover{opacity:.92;color:#fff}'
		. '@media(max-width:600px){.jt-procard__main{align-items:flex-start}.jt-procard__actions{flex-direction:column}}'
		. '</style>';
}

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( array( 'articles', 'post', 'justice_term' ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if ( ! (int) get_option( 'justice_cards_enabled', 1 ) ) {
		return $content;
	}

	$terms = justice_cards_current_terms();

	if ( ! $terms ) {
		return $content;
	}

	$limit   = max( 1, min( 3, (int) get_option( 'justice_cards_max', 2 ) ) );
	$lawyers = justice_cards_lawyers( $terms, $limit );

	if ( ! $lawyers ) {
		return $content;
	}

	$cards = array();
	foreach ( $lawyers as $lawyer ) {
		$cards[] = justice_cards_render( $lawyer );
	}

	$out = justice_cards_css();

	// Short content (news briefs, small entries): one card at the end.
	if ( justice_enc_word_count( $content ) < 500 || substr_count( $content, '</h2>' ) < 2 ) {
		return $out . $content . $cards[0];
	}

	// Long content: first card right after the second section, second card
	// before the FAQ block (or at the end).
	$pos = 0;
	for ( $i = 0; $i < 2; $i++ ) {
		$next = strpos( $content, '</h2>', $pos );
		if ( false === $next ) {
			break;
		}
		$pos = $next + 5;
	}

	$first  = substr( $content, 0, $pos );
	$rest   = substr( $content, $pos );
	$second = '';

	if ( isset( $cards[1] ) ) {
		$faq_pos = mb_strpos( $rest, 'שאלות נפוצות' );

		if ( false !== $faq_pos ) {
			$h2_before = strrpos( substr( $rest, 0, $faq_pos ), '<h2' );
			$insert_at = false !== $h2_before ? $h2_before : $faq_pos;
			$rest      = substr( $rest, 0, $insert_at ) . $cards[1] . substr( $rest, $insert_at );
		} else {
			$second = $cards[1];
		}
	}

	return $out . $first . $cards[0] . $rest . $second;
}, 17 );
