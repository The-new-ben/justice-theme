<?php
/**
 * Professional cards: the monetization surface.
 *
 * Sponsored lawyer cards inside articles, news briefs and encyclopedia
 * entries, resolved by the page's legal family, ranked by priority_score
 * (the placement dial that sells this surface) with a daily rotation among
 * equal scores. Only profiles that pass the theme public-approval gate AND
 * carry a positive score ever float, so the sponsored label is never false.
 *
 * Design benchmarked against the strongest marketplace cards (photo-first
 * with one saturated accent, gradient border with layered elevation, strict
 * CTA hierarchy, chips for scannability, avatar locked with aspect-ratio +
 * object-fit so no theme CSS can distort it). Mobile-first, RTL.
 *
 * Everything user-facing is customizable via options (Settings > Justice
 * Cards) and filters.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function justice_cards_settings(): array {
	$defaults = array(
		'enabled'         => 1,
		'max'             => 2,
		'min_gap_chars'   => 2500,
		'brand'           => '#14213d',
		'accent'          => '#e7c765',
		'flag_label'      => 'עורך דין מוביל לתחום',
		'sponsored_label' => 'מקודם',
		'wa_label'        => 'שליחת הודעה עכשיו',
		'profile_label'   => 'לפרופיל המלא',
	);

	$settings = array();

	foreach ( $defaults as $key => $default ) {
		$value = get_option( 'justice_cards_' . $key, $default );
		$settings[ $key ] = '' === $value ? $default : $value;
	}

	$settings['max'] = max( 1, min( 3, (int) $settings['max'] ) );

	return apply_filters( 'justice_cards_settings', $settings );
}


/**
 * Singular types that carry the cards mesh; extendable by other modules
 * (the Q&A engine adds justice_question).
 */
function justice_cards_singular_types(): array {
	return apply_filters( 'justice_cards_singular_types', array( 'articles', 'post', 'justice_term' ) );
}

// ---------------------------------------------------------------------------
// Family resolution
// ---------------------------------------------------------------------------

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

	if ( ! is_singular( array_diff( justice_cards_singular_types(), array( 'justice_term' ) ) ) ) {
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

// ---------------------------------------------------------------------------
// Eligibility and ranking
// ---------------------------------------------------------------------------

/**
 * Query the family's professionals: approval gate + positive score, priority
 * first, daily rotation tie-break among equals.
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

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Square avatar source for the card. Order: the card_photo_id override meta
 * (lets any profile carry a dedicated headshot without touching its featured
 * banner), then hard-cropped square sizes of the featured image. Returns
 * array( src, srcset ) or null.
 */
function justice_cards_avatar_src( int $lawyer_id ): ?array {
	$attachment = (int) get_post_meta( $lawyer_id, 'card_photo_id', true );

	if ( ! $attachment ) {
		$attachment = (int) get_post_thumbnail_id( $lawyer_id );
	}

	if ( ! $attachment ) {
		return null;
	}

	$small = wp_get_attachment_image_src( $attachment, 'thumbnail' );

	if ( ! $small ) {
		return null;
	}

	$srcset = '';
	$retina = wp_get_attachment_image_src( $attachment, 'woocommerce_thumbnail' );

	if ( $retina && (int) $retina[1] >= 200 && (int) $retina[1] === (int) $retina[2] ) {
		$srcset = esc_url( $small[0] ) . ' 1x, ' . esc_url( $retina[0] ) . ' 2x';
	}

	return array( 'src' => $small[0], 'srcset' => $srcset );
}


/**
 * Median first-response minutes over the last 90 days of acknowledged
 * routed leads. Badge appears only with 3+ real samples: unfakeable,
 * computed from our own routing telemetry.
 */
function justice_cards_response_badge( int $lawyer_id ): string {
	$cached = get_transient( 'jt_resp_' . $lawyer_id );

	if ( false === $cached ) {
		$leads = get_posts( array(
			'post_type'      => 'justice_lead',
			'post_status'    => 'any',
			'posts_per_page' => 40,
			'fields'         => 'ids',
			'date_query'     => array( array( 'after' => '90 days ago' ) ),
			'meta_query'     => array(
				array( 'key' => 'assigned_lawyer_id', 'value' => (string) $lawyer_id ),
				array( 'key' => 'lead_ack_at', 'compare' => 'EXISTS' ),
			),
		) );

		$mins = array();

		foreach ( $leads as $lead_id ) {
			$routed = strtotime( (string) get_post_meta( $lead_id, 'lead_routed_at', true ) );
			$acked  = strtotime( (string) get_post_meta( $lead_id, 'lead_ack_at', true ) );

			if ( $routed && $acked && $acked >= $routed ) {
				$mins[] = ( $acked - $routed ) / 60;
			}
		}

		$cached = '';

		if ( count( $mins ) >= 3 ) {
			sort( $mins );
			$median = $mins[ (int) floor( count( $mins ) / 2 ) ];

			if ( $median <= 60 ) {
				$cached = 'מגיב בדרך כלל בתוך שעה';
			} elseif ( $median <= 240 ) {
				$cached = 'מגיב בדרך כלל בתוך ' . ceil( $median / 60 ) . ' שעות';
			}
		}

		set_transient( 'jt_resp_' . $lawyer_id, $cached, 12 * HOUR_IN_SECONDS );
	}

	return $cached ? '<span class="jt-procard__trustitem jt-procard__resp">' . esc_html( $cached ) . '</span>' : '';
}

/**
 * Render one professional card.
 */
function justice_cards_render( WP_Post $lawyer ): string {
	$s      = justice_cards_settings();
	$pid    = $lawyer->ID;
	$name   = get_the_title( $pid );
	$url    = add_query_arg( array( 'utm_source' => 'jt-card', 'utm_medium' => 'incontent' ), get_permalink( $pid ) );
	$areas  = get_the_terms( $pid, 'practice-areas' );
	$cities = get_the_terms( $pid, 'city' );

	$area_names = array();
	if ( $areas && ! is_wp_error( $areas ) ) {
		foreach ( array_slice( $areas, 0, 2 ) as $t ) {
			$area_names[] = $t->name;
		}
	}

	$city_name = ( $cities && ! is_wp_error( $cities ) ) ? $cities[0]->name : '';

	$rating_html = '';
	if ( function_exists( 'justice_theme_lawyer_reviews_public_state' ) ) {
		$state = justice_theme_lawyer_reviews_public_state( $pid );
		if ( ! empty( $state['show'] ) ) {
			$rating_html = '<span class="jt-procard__trustitem jt-procard__rating">★ ' . esc_html( number_format_i18n( (float) $state['average'], 1 ) ) . ' <small>(' . esc_html( number_format_i18n( (int) $state['count'] ) ) . ')</small></span>';
		}
	}

	$license = (string) get_post_meta( $pid, 'license_number', true );
	$years   = (int) get_post_meta( $pid, 'years_experience', true );

	$wa_message = 'שלום, אני פונה מהעמוד: ' . mb_substr( wp_strip_all_tags( get_the_title() ), 0, 70 )
		. ' | ' . get_permalink()
		. ' | אשמח לשוחח עם ' . $name . '.';

	$wa_href = function_exists( 'justice_theme_public_whatsapp_url' )
		? justice_theme_public_whatsapp_url( $wa_message )
		: 'https://wa.me/972525101555?text=' . rawurlencode( $wa_message );

	// The avatar geometry rides inline on the element: theme content CSS
	// (img { max-width:100%; height:auto }) must never distort it, cached
	// pages with an older stylesheet included.
	$avatar_inline = 'width:84px;height:84px;aspect-ratio:1;border-radius:18px;object-fit:cover;object-position:center 30%;display:block;flex:none;margin:0';
	$photo         = justice_cards_avatar_src( $pid );

	if ( $photo ) {
		$avatar = '<span class="jt-procard__ring"><img class="jt-procard__photo" src="' . esc_url( $photo['src'] ) . '"'
			. ( $photo['srcset'] ? ' srcset="' . esc_attr( $photo['srcset'] ) . '"' : '' )
			. ' alt="' . esc_attr( $name ) . '" loading="lazy" decoding="async" width="84" height="84" style="' . esc_attr( $avatar_inline ) . '" /></span>';
	} else {
		$avatar = '<span class="jt-procard__ring"><span class="jt-procard__photo jt-procard__photo--initial" style="' . esc_attr( $avatar_inline ) . '">' . esc_html( mb_substr( trim( wp_strip_all_tags( $name ) ), 0, 1 ) ) . '</span></span>';
	}

	$chips = '';
	foreach ( $area_names as $area_name ) {
		$chips .= '<span class="jt-procard__chip">' . esc_html( $area_name ) . '</span>';
	}
	if ( $city_name ) {
		$chips .= '<span class="jt-procard__chip jt-procard__chip--city"><svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>' . esc_html( $city_name ) . '</span>';
	}

	$trust = '';
	if ( $license ) {
		$trust .= '<span class="jt-procard__trustitem jt-procard__verified"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-1.5 15.5-4-4 1.4-1.4 2.6 2.6 6.1-6.1L18 9l-7.5 7.5z"/></svg>רישיון מאומת</span>';
	}
	if ( $years >= 3 ) {
		$trust .= '<span class="jt-procard__trustitem">' . esc_html( number_format_i18n( $years ) ) . ' שנות ניסיון</span>';
	}
	$trust .= justice_cards_response_badge( $pid );
	$trust .= $rating_html;

	return '<aside class="jt-procard" role="complementary" aria-label="' . esc_attr( $s['flag_label'] ) . '" data-card-surface="incontent" data-l="' . (int) $pid . '">'
		. '<div class="jt-procard__ribbon">'
		. '<span class="jt-procard__flag"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 3l1.8 3.8 4.2.6-3 2.9.7 4.2L12 12.6l-3.7 1.9.7-4.2-3-2.9 4.2-.6L12 3z"/></svg>' . esc_html( $s['flag_label'] ) . '</span>'
		. '<em class="jt-procard__sponsored">' . esc_html( $s['sponsored_label'] ) . '</em>'
		. '</div>'
		. '<div class="jt-procard__main">'
		. $avatar
		. '<div class="jt-procard__body">'
		. '<strong class="jt-procard__name">' . esc_html( $name ) . '</strong>'
		. ( $chips ? '<span class="jt-procard__chips">' . $chips . '</span>' : '' )
		. ( $trust ? '<span class="jt-procard__trust">' . $trust . '</span>' : '' )
		. '</div></div>'
		. '<div class="jt-procard__actions">'
		. '<a class="jt-procard__wa" href="' . esc_url( $wa_href ) . '" target="_blank" rel="noopener nofollow" data-whatsapp-surface="procard">'
		. '<svg viewBox="0 0 32 32" width="19" height="19" fill="currentColor" aria-hidden="true"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.5.8 3.1 1.2 4.7 1.2 6.6 0 12-5.3 12-11.9C28 8.3 22.6 3 16 3zm5.9 16.9c-.3.8-1.7 1.6-2.3 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.4-1.5-5.6-4.9-5.8-5.1-.2-.2-1.4-1.8-1.4-3.5s.9-2.5 1.2-2.8c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.7 1 2.4 1.1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.6.7c-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.2.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.6.4.1.3.1.9-.2 1.7z"/></svg>'
		. esc_html( $s['wa_label'] ) . '</a>'
		. '<a class="jt-procard__profile" href="' . esc_url( $url ) . '">' . esc_html( $s['profile_label'] ) . '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" class="jt-procard__arrow"><path d="M14.7 5.3 8 12l6.7 6.7 1.4-1.4L10.8 12l5.3-5.3-1.4-1.4z"/></svg></a>'
		. '</div>'
		. '</aside>';
}

/**
 * Card styles print from wp_head: style tags inside post content get
 * stripped by content sanitization, so the CSS cannot ride the filter.
 */
function justice_cards_css(): string {
	$s      = justice_cards_settings();
	$brand  = sanitize_hex_color( (string) $s['brand'] ) ?: '#14213d';
	$accent = sanitize_hex_color( (string) $s['accent'] ) ?: '#e7c765';

	return '<style id="jt-procard-css">'
		. '.jt-procard{position:relative;isolation:isolate;margin:34px 0;padding:0;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,' . $accent . ' 0%,#d9b654 22%,' . $brand . ' 78%) border-box;border:1.5px solid transparent;border-radius:20px;box-shadow:0 2px 6px rgba(13,23,54,.07),0 22px 44px -22px rgba(13,23,54,.32);font-size:15px;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}'
		. '.jt-procard::before{content:"";position:absolute;inset-block-start:-70px;inset-inline-end:-70px;width:210px;height:210px;background:radial-gradient(circle,' . $accent . '33 0%,transparent 62%);pointer-events:none;z-index:0}'
		. '@media(hover:hover){.jt-procard:hover{transform:translateY(-3px);box-shadow:0 4px 10px rgba(13,23,54,.09),0 30px 56px -24px rgba(13,23,54,.4)}}'
		. '.jt-procard__ribbon{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 18px;background:linear-gradient(90deg,' . $brand . ',#1d2f56 60%,#24395f);position:relative;z-index:1}'
		. '.jt-procard__flag{display:inline-flex;align-items:center;gap:6px;color:' . $accent . ';font-size:12.5px;font-weight:800;letter-spacing:.02em}'
		. '.jt-procard__sponsored{font-style:normal;font-weight:600;color:#c7cfe2;font-size:10.5px;border:1px solid rgba(199,207,226,.45);border-radius:999px;padding:2px 9px}'
		. '.jt-procard__main{display:flex;gap:16px;padding:18px 18px 8px;align-items:center;position:relative;z-index:1}'
		. '.jt-procard__ring{flex:none;display:inline-block;padding:3px;border-radius:21px;background:conic-gradient(from 130deg,' . $accent . ',#b98f2e,' . $brand . ' 55%,' . $accent . ');box-shadow:0 8px 18px -8px rgba(13,23,54,.45)}'
		. '.jt-procard .jt-procard__photo{border:2.5px solid #fff}'
		. '.jt-procard .jt-procard__photo--initial{display:flex;align-items:center;justify-content:center;background:' . $brand . ';color:' . $accent . ';font-size:34px;font-weight:800;border:2.5px solid #fff}'
		. '.jt-procard__body{display:flex;flex-direction:column;gap:7px;min-width:0}'
		. '.jt-procard__name{font-size:18.5px;line-height:1.25;color:' . $brand . ';letter-spacing:.01em}'
		. '.jt-procard__chips{display:flex;flex-wrap:wrap;gap:6px}'
		. '.jt-procard__chip{display:inline-flex;align-items:center;gap:4px;background:#f1f4fb;color:#2c3a58;font-size:12.5px;font-weight:600;border-radius:999px;padding:4px 11px;line-height:1}'
		. '.jt-procard__chip--city{background:#faf6ea;color:#7c6519}'
		. '.jt-procard__trust{display:flex;flex-wrap:wrap;gap:12px;align-items:center;color:#5a6579;font-size:12.5px}'
		. '.jt-procard__trustitem{display:inline-flex;align-items:center;gap:4px;font-weight:600}'
		. '.jt-procard__verified{color:#0a7d2f}'
		. '.jt-procard__rating{color:#8a6d1d;font-weight:700}'
		. '.jt-procard__resp{color:#1465b0;font-weight:700}'
		. '.jt-procard__actions{display:flex;gap:10px;padding:14px 18px 18px;position:relative;z-index:1}'
		. '.jt-procard__wa,.jt-procard__profile{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;border-radius:13px;padding:11px 12px;font-weight:800;font-size:15px;text-decoration:none;line-height:1.2;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}'
		. '.jt-procard__wa{background:linear-gradient(180deg,#2ade70,#1fb355);color:#fff;box-shadow:0 10px 22px -10px rgba(31,179,85,.65)}'
		. '.jt-procard__profile{background:transparent;color:' . $brand . ';border:1.6px solid ' . $brand . '2e;background-color:#f8fafd}'
		. '.jt-procard__arrow{transition:transform .15s ease}'
		. '@media(hover:hover){.jt-procard__wa:hover{transform:translateY(-1px);box-shadow:0 14px 26px -10px rgba(31,179,85,.75);color:#fff}.jt-procard__profile:hover{background-color:' . $brand . ';color:#fff;border-color:' . $brand . '}.jt-procard__profile:hover .jt-procard__arrow{transform:translateX(-3px)}}'
		. '.jt-procard__wa:active{transform:translateY(0)}'
		. '@media(max-width:640px){.jt-procard{margin:28px 0;border-radius:18px}.jt-procard__main{gap:13px;padding:15px 14px 6px}.jt-procard__actions{flex-direction:column;padding:12px 14px 15px}.jt-procard__name{font-size:17px}.jt-procard .jt-procard__photo,.jt-procard .jt-procard__photo--initial{width:74px!important;height:74px!important;border-radius:16px!important}.jt-procard__ring{border-radius:19px}}'
		. '@media(prefers-reduced-motion:reduce){.jt-procard,.jt-procard__wa,.jt-procard__profile,.jt-procard__arrow{transition:none}}'
		. '</style>';
}

add_action( 'wp_head', function () {
	if ( ! is_singular( justice_cards_singular_types() ) ) {
		return;
	}

	$s = justice_cards_settings();

	if ( ! (int) $s['enabled'] ) {
		return;
	}

	echo justice_cards_css(); // phpcs:ignore WordPress.Security.EscapeOutput
}, 99 );

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( justice_cards_singular_types() ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	// Never double-inject (reruns of the filter, cached fragments).
	if ( false !== strpos( $content, 'jt-procard' ) ) {
		return $content;
	}

	$s = justice_cards_settings();

	if ( ! (int) $s['enabled'] ) {
		return $content;
	}

	$terms = justice_cards_current_terms();

	if ( ! $terms ) {
		return $content;
	}

	$lawyers = justice_cards_lawyers( $terms, (int) $s['max'] );

	if ( ! $lawyers ) {
		return $content;
	}

	$cards = array();
	foreach ( $lawyers as $lawyer ) {
		$cards[] = justice_cards_render( $lawyer );
	}

	// Tells the analytics footer beacon that this response carries cards.
	$GLOBALS['justice_cards_rendered'] = true;

	// Short content (news briefs, small entries): one card at the end.
	if ( justice_enc_word_count( $content ) < 500 || substr_count( $content, '</h2>' ) < 2 ) {
		return $content . $cards[0];
	}

	// Long content: first card right after the second section. A second card
	// only when a SECOND lawyer exists (never the same professional twice)
	// and only if the page is long enough to keep the placements far apart:
	// the second slot anchors before the FAQ heading and must sit at least
	// min_gap_chars after the first slot.
	$pos = 0;
	for ( $i = 0; $i < 2; $i++ ) {
		$next = strpos( $content, '</h2>', $pos );
		if ( false === $next ) {
			break;
		}
		$pos = $next + 5;
	}

	$first = substr( $content, 0, $pos );
	$rest  = substr( $content, $pos );

	if ( isset( $cards[1] ) ) {
		$faq_pos = mb_strpos( $rest, 'שאלות נפוצות' );

		if ( false !== $faq_pos && $faq_pos > (int) $s['min_gap_chars'] ) {
			$h2_before = strrpos( substr( $rest, 0, $faq_pos ), '<h2' );
			$insert_at = false !== $h2_before ? $h2_before : $faq_pos;

			if ( $insert_at > (int) $s['min_gap_chars'] ) {
				$rest = substr( $rest, 0, $insert_at ) . $cards[1] . substr( $rest, $insert_at );
			}
		}
	}

	return $first . $cards[0] . $rest;
}, 17 );

// ---------------------------------------------------------------------------
// Admin: Settings > Justice Cards
// ---------------------------------------------------------------------------

add_action( 'admin_menu', function () {
	add_options_page( 'Justice Cards', 'Justice Cards', 'manage_options', 'justice-cards', 'justice_cards_settings_page' );
} );

add_action( 'admin_init', function () {
	$fields = array(
		'justice_cards_enabled'         => 'absint',
		'justice_cards_max'             => 'absint',
		'justice_cards_min_gap_chars'   => 'absint',
		'justice_cards_brand'           => 'sanitize_hex_color',
		'justice_cards_accent'          => 'sanitize_hex_color',
		'justice_cards_flag_label'      => 'sanitize_text_field',
		'justice_cards_sponsored_label' => 'sanitize_text_field',
		'justice_cards_wa_label'        => 'sanitize_text_field',
		'justice_cards_profile_label'   => 'sanitize_text_field',
	);

	foreach ( $fields as $option => $sanitize ) {
		register_setting( 'justice_cards', $option, array( 'sanitize_callback' => $sanitize ) );
	}
} );

function justice_cards_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$s = justice_cards_settings();
	?>
	<div class="wrap">
		<h1>Justice Cards: כרטיסי אנשי מקצוע בתוכן</h1>
		<p>כרטיס ממומן צף בתוך מאמרים, חדשות והאנציקלופדיה לפי תחום העמוד. מי מופיע: פרופיל שעובר את שער האישור הציבורי ומחזיק priority_score חיובי. מכירת מיקום = תיוג הפרופיל בתחום + קביעת priority_score (גבוה יותר = מקום ראשון; שוויון מתחלף יומית).</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'justice_cards' ); ?>
			<table class="form-table" role="presentation">
				<tr><th scope="row">הפעלה</th><td><label><input type="checkbox" name="justice_cards_enabled" value="1" <?php checked( 1, (int) $s['enabled'] ); ?>> כרטיסים פעילים באתר</label></td></tr>
				<tr><th scope="row">מקסימום כרטיסים בעמוד</th><td><input type="number" name="justice_cards_max" min="1" max="3" value="<?php echo esc_attr( (string) $s['max'] ); ?>"></td></tr>
				<tr><th scope="row">מרווח מינימלי בין כרטיסים (תווים)</th><td><input type="number" name="justice_cards_min_gap_chars" min="800" max="12000" step="100" value="<?php echo esc_attr( (string) $s['min_gap_chars'] ); ?>"><p class="description">כרטיס שני נכנס רק אם עוגן השאלות הנפוצות רחוק מספיק מהכרטיס הראשון.</p></td></tr>
				<tr><th scope="row">צבע מותג</th><td><input type="text" class="regular-text" name="justice_cards_brand" value="<?php echo esc_attr( (string) $s['brand'] ); ?>" placeholder="#14213d"></td></tr>
				<tr><th scope="row">צבע הדגשה</th><td><input type="text" class="regular-text" name="justice_cards_accent" value="<?php echo esc_attr( (string) $s['accent'] ); ?>" placeholder="#e7c765"></td></tr>
				<tr><th scope="row">תווית הכרטיס</th><td><input type="text" class="regular-text" name="justice_cards_flag_label" value="<?php echo esc_attr( (string) $s['flag_label'] ); ?>"></td></tr>
				<tr><th scope="row">תווית שקיפות</th><td><input type="text" class="regular-text" name="justice_cards_sponsored_label" value="<?php echo esc_attr( (string) $s['sponsored_label'] ); ?>"></td></tr>
				<tr><th scope="row">כפתור וואטסאפ</th><td><input type="text" class="regular-text" name="justice_cards_wa_label" value="<?php echo esc_attr( (string) $s['wa_label'] ); ?>"></td></tr>
				<tr><th scope="row">כפתור פרופיל</th><td><input type="text" class="regular-text" name="justice_cards_profile_label" value="<?php echo esc_attr( (string) $s['profile_label'] ); ?>"></td></tr>
			</table>
			<?php submit_button(); ?>
		</form>
		<h2>תמונת כרטיס לעורך דין</h2>
		<p>הכרטיס משתמש בחיתוך ריבועי של התמונה הראשית בפרופיל. לתמונת כרטיס ייעודית (פורטרט), מעלים תמונה לספריית המדיה וקובעים בפרופיל עורך הדין שדה מותאם <code>card_photo_id</code> עם מזהה הקובץ.</p>
	</div>
	<?php
}
