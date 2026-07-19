<?php
/**
 * Cinematic map embed + lawyer finder strip: the din.co.il gap, closed.
 *
 * The finder (area and city selects, server-rendered links, SEO-real) sits
 * above a Mapbox Standard 3D map that lazy-loads only near the viewport:
 * drone intro onto the top paying lawyer's building, slow orbit, overview,
 * and a tour button that hops across every premium office. Premium renders
 * as gold flags with a portrait; everyone else is a quiet logo chip; courts
 * and government buildings are labeled by the basemap itself. The block
 * embeds AFTER the content on money surfaces so the first paragraphs keep
 * their SEO weight, and the map costs nothing until scrolled near.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_cinema_token(): string {
	if ( function_exists( 'justice_theme_mapbox_public_token' ) ) {
		$token = (string) justice_theme_mapbox_public_token();

		if ( '' !== $token ) {
			return $token;
		}
	}

	$token = (string) get_option( 'justice_ops_mapbox_public_token', '' );

	return (string) apply_filters( 'justice_theme_mapbox_public_token', $token );
}

/**
 * Should this view carry the map block?
 */
function justice_cinema_wanted(): bool {
	// Front page (owner order 2026-07-16 #3: "rich map, very beautiful
	// map"): the cinema map IS the homepage map now - one map system
	// sitewide instead of the theme's separate static LawyerScout band.
	if ( is_front_page() ) {
		return true;
	}

	if ( is_singular( array( 'articles', 'justice_question' ) ) ) {
		return true;
	}

	// The lawyers archive is the index's own front door - the map opens it
	// (owner order 2026-07-18: upper fold; block injected via the
	// template_include buffer in map-feed-v3.php, which also sets this
	// flag - is_post_type_archive() is false on the live /lawyers/ route).
	if ( ! empty( $GLOBALS['jt_lawyer_archive_view'] ) || is_post_type_archive( 'justice_lawyer' ) ) {
		return true;
	}

	$qo = get_queried_object();

	if ( $qo instanceof WP_Post && 'page' === $qo->post_type ) {
		if ( get_post_meta( $qo->ID, 'jt_city_practice', true ) ) {
			return true;
		}

		return in_array( $qo->post_name, array( 'legal-help', 'ask-a-lawyer', 'legal-calculators', 'legal-documents', 'family-law' ), true );
	}

	return false;
}

/**
 * The finder strip: server-rendered internal links, no JS required.
 */
function justice_cinema_finder(): string {
	$areas = '';

	foreach ( justice_city_family_labels() as $family => $conf ) {
		$areas .= '<option value="' . esc_attr( home_url( $conf['hub'] ) ) . '">' . esc_html( $conf['he'] ) . '</option>';
	}

	$cities = '';

	if ( function_exists( 'justice_city_inventory' ) ) {
		foreach ( justice_city_inventory() as $family => $city_list ) {
			foreach ( $city_list as $city_slug => $info ) {
				$page = get_page_by_path( justice_city_family_labels()[ $family ]['slug'] . '-' . $city_slug, OBJECT, 'page' );

				if ( $page instanceof WP_Post ) {
					$cities .= '<option value="' . esc_attr( get_permalink( $page ) ) . '">' . esc_html( justice_city_family_labels()[ $family ]['he'] . ' ב' . $info['city_name'] ) . '</option>';
				}
			}
		}
	}

	return '<div class="jtcm-finder">'
		. '<strong>מציאת עורך דין</strong>'
		. '<select id="jtcm-area" aria-label="בחירת תחום">' . $areas . '</select>'
		. ( $cities ? '<select id="jtcm-city" aria-label="בחירה לפי עיר"><option value="">לפי עיר (אופציונלי)</option>' . $cities . '</select>' : '' )
		. '<a class="jtcm-finder__go" href="' . esc_url( home_url( '/family-law/' ) ) . '" onclick="var c=document.getElementById(\'jtcm-city\');var a=document.getElementById(\'jtcm-area\');this.href=(c&&c.value)?c.value:a.value;">מעבר</a>'
		. '<a class="jtcm-finder__alt" href="' . esc_url( home_url( '/legal-ai-desk/' ) ) . '">לא בטוחים? קבלו כיוון משפטי מיידי</a>'
		. '</div>';
}

/**
 * The full map block - heading, finder, filter chips, canvas, actions,
 * live legend. One builder for every surface (owner law: ONE map).
 */
function justice_cinema_block( bool $front = false ): string {
	$title = $front ? 'LawyerScout: מפת המשפט של ישראל' : 'מפת עורכי הדין, המשרדים ובתי המשפט';

	return '<section class="jtcm-wrap">'
		. '<h2>' . esc_html( $title ) . '</h2>'
		. '<p class="jtcm-sub">מפה תלת ממדית חיה: משרדים רשומים בדגל זהב, בתי משפט ומוסדות מסומנים, סיור אווירי בין המשרדים המובילים. הנתונים מהמאגר המאומת בלבד.</p>'
		. justice_cinema_finder()
		. '<div class="jtcm-chips" role="group" aria-label="סינון שכבות המפה">'
		. '<button type="button" class="jtcm-chipbtn is-on" data-layer="all">הכל</button>'
		. '<button type="button" class="jtcm-chipbtn" data-layer="lawyer">משרדי עורכי דין</button>'
		. '<button type="button" class="jtcm-chipbtn" data-layer="court">בתי משפט</button>'
		. '<button type="button" class="jtcm-chipbtn" data-layer="institution">מוסדות ואכיפה</button>'
		. '</div>'
		. '<div id="jt-cinema-map" role="img" aria-label="מפה תלת ממדית של עורכי דין, משרדים ובתי משפט. לניווט נגיש השתמשו בבורר התחום והעיר שמעל המפה."></div>'
		. '<div class="jtcm-actions">'
		. '<button type="button" id="jt-cinema-tour" class="jtcm-tour">סיור אווירי מעל המשרדים המובילים</button>'
		. '<button type="button" id="jt-cinema-near" class="jtcm-near">מצאו את הקרובים אליי</button>'
		. '<span class="jtcm-legend" id="jt-cinema-legend" aria-live="polite"></span>'
		. '</div>'
		. '</section>';
}

add_filter( 'the_content', function ( $content ) {
	if ( ! in_the_loop() || ! is_main_query() || ! justice_cinema_wanted() || is_front_page() ) {
		return $content;
	}

	if ( false !== strpos( $content, 'jt-cinema-map' ) || '' === justice_cinema_token() ) {
		return $content;
	}

	return $content . justice_cinema_block( false );
}, 32 );

// Front page (owner orders 2026-07-16 #1-#3): ONE map, rich, right after
// the hero. The theme's static LawyerScout band is REPLACED by the 3D
// cinema map block (which inherits the LawyerScout name), placed in the
// second slot. The front page is a controlled route (renders and exits at
// template_redirect -999999) that never runs the loop, so a the_content
// filter can't touch it; the swap happens in an output buffer opened
// BEFORE homepage-pro's (-1000000), whose callback therefore runs LAST on
// the final HTML.
add_action( 'template_redirect', function () {
	if ( ! is_front_page() || '' === justice_cinema_token() ) {
		return;
	}

	ob_start( function ( $html ) {
		$html = (string) $html;

		if ( false !== strpos( $html, 'jt-cinema-map' ) ) {
			return $html;
		}

		$block = '<section class="jt2-section legal-map-band" id="lawyer-scout" aria-label="מפת עורכי הדין והשירותים המשפטיים"><div class="container">'
			. justice_cinema_block( true )
			. '</div></section>';

		// The theme's static band dies; its replacement takes slot 2.
		$start = strpos( $html, '<section class="jt2-section legal-map-band"' );

		if ( false !== $start ) {
			$end = strpos( $html, '</section>', $start );

			if ( false !== $end ) {
				$html = substr_replace( $html, '', $start, $end + strlen( '</section>' ) - $start );
			}
		}

		foreach ( array( '<section class="jt2-section" id="practice-areas"', '<section class="jt2-section money-hubs', '<section class="find-guide' ) as $marker ) {
			$pos = strpos( $html, $marker );

			if ( false !== $pos ) {
				return substr_replace( $html, $block, $pos, 0 );
			}
		}

		return $html;
	} );
}, -1000005 );

add_action( 'wp_enqueue_scripts', function () {
	if ( ! justice_cinema_wanted() || '' === justice_cinema_token() ) {
		return;
	}

	wp_register_script( 'justice-cinema-map', plugins_url( 'assets/cinema-map.js', __FILE__ ), array(), JUSTICE_OPS_VERSION, true );
	wp_localize_script( 'justice-cinema-map', 'JT_CINEMA', array(
		'token' => justice_cinema_token(),
		'data'  => rest_url( 'justice/v1/map/offices' ),
	) );
	wp_enqueue_script( 'justice-cinema-map' );
} );

add_action( 'wp_head', function () {
	if ( ! justice_cinema_wanted() || '' === justice_cinema_token() ) {
		return;
	}

	echo '<style id="jtcm-css">'
		. '.jtcm-wrap{margin:36px 0}'
		. '.jtcm-wrap h2{color:#14213d}'
		. '.jtcm-sub{color:#5a6579;font-size:14px;margin:4px 0 14px}'
		. '#jt-cinema-map{width:100%;height:460px;border-radius:20px;border:1.5px solid transparent;background:linear-gradient(160deg,#101d3a,#1d3057 55%,#2a4170) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;box-shadow:0 22px 48px -24px rgba(13,23,54,.5);overflow:hidden}'
		. '@media(max-width:640px){#jt-cinema-map{height:380px;border-radius:16px}}'
		. '.jtcm-finder{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:#f8fafd;border:1px solid #e2e5ee;border-radius:14px;padding:12px 14px;margin:0 0 14px}'
		. '.jtcm-finder strong{color:#14213d}'
		. '.jtcm-finder select{border:1px solid #ccd3e2;border-radius:10px;padding:9px 10px;font-size:14.5px;background:#fff;max-width:46vw}'
		. '.jtcm-finder__go{background:#14213d;color:#fff;border-radius:10px;padding:10px 22px;font-weight:800;text-decoration:none}'
		. '.jtcm-finder__go:hover{opacity:.92;color:#fff}'
		. '.jtcm-finder__alt{color:#7c6519;font-weight:700;font-size:13.5px;text-decoration:none}'
		. '.jtcm-chips{display:flex;flex-wrap:nowrap;gap:8px;margin:0 0 12px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:2px}'
		. '.jtcm-chipbtn{flex:0 0 auto;background:#fff;border:1.5px solid #ccd6e6;border-radius:999px;padding:8px 16px;font-size:13.5px;font-weight:700;color:#33405e;cursor:pointer;transition:all .15s ease}'
		. '.jtcm-chipbtn.is-on{background:#14213d;border-color:#14213d;color:#e7c765}'
		. '.jtcm-chipbtn:hover{border-color:#14213d}'
		. '.jtcm-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:12px}'
		. '.jtcm-tour{background:linear-gradient(90deg,#e7c765,#d9b654);color:#14213d;border:0;border-radius:11px;padding:12px 24px;font-weight:800;font-size:14.5px;cursor:pointer;box-shadow:0 10px 24px -12px rgba(185,143,46,.7)}'
		. '.jtcm-near{background:#fff;color:#14213d;border:1.5px solid #14213d;border-radius:11px;padding:11px 20px;font-weight:800;font-size:14px;cursor:pointer}'
		. '.jtcm-near:hover{background:#f2f5fb}'
		. '.jtcm-legend{color:#5a6579;font-size:13px;font-weight:600;margin-inline-start:auto}'
		. '@media(max-width:640px){.jtcm-actions{gap:8px}.jtcm-legend{margin-inline-start:0;width:100%}}'
		. '.jtcm-flag{position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;filter:drop-shadow(0 10px 14px rgba(13,23,54,.45))}'
		. '.jtcm-flag__photo{width:52px;height:52px;border-radius:14px;object-fit:cover;border:2.5px solid #e7c765;background:#fff}'
		. '.jtcm-flag__name{margin-top:4px;background:#14213d;color:#fff;font-size:11.5px;font-weight:800;border-radius:999px;padding:4px 10px;white-space:nowrap}'
		. '.jtcm-flag__tag{position:absolute;inset-block-start:-9px;inset-inline-end:-12px;background:#e7c765;color:#14213d;font-size:9.5px;font-weight:800;border-radius:999px;padding:2px 7px}'
		. '.jtcm-flag__pin{position:absolute;inset-block-end:-9px;width:2.5px;height:12px;background:#e7c765}'
		. '.jtcm-chip{display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.94);border:1px solid #d6dbe8;border-radius:999px;padding:3px 9px 3px 5px;font-size:10.5px;font-weight:700;color:#33405e;cursor:pointer;box-shadow:0 4px 10px rgba(13,23,54,.18);max-width:150px}'
		. '.jtcm-chip img{width:18px;height:18px;border-radius:50%;object-fit:contain;background:#fff}'
		. '.jtcm-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
		. '.jtcm-chip--place{background:rgba(20,33,61,.9);color:#f3e7c7;border-color:#2a4170}'
		. '.jtcm-chip__g{font-size:12px;line-height:1}'
		. '.jtcm-chip--glyph{padding-inline-start:8px}'
		. '.jtcm-chip__av svg{width:20px;height:20px;border-radius:6px}'
		. '.jtcm-chipbtn--area{border-style:dashed}'
		. '.jtcm-cardpin{display:inline-flex;align-items:center;gap:5px;margin-top:8px;background:#fff;border:1.5px solid #ccd6e6;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:700;color:#33507e;cursor:pointer}'
		. '.jtcm-cardpin:hover{border-color:#14213d;color:#14213d}'
		. '.jtcm-pop{direction:rtl;font-family:inherit}'
		. '.jtcm-pop strong{color:#14213d}'
		. '.jtcm-pop__meta{color:#5a6579;font-size:12px;margin-top:4px;display:block}'
		. '.jtcm-pop__card{display:flex;gap:10px;align-items:flex-start}'
		. '.jtcm-pop__ava img,.jtcm-pop__ava svg{width:44px;height:44px;border-radius:12px;object-fit:cover;display:block}'
		. '.jtcm-pop__id{display:flex;flex-direction:column;gap:2px}'
		. '.jtcm-pop__badge{display:inline-block;background:#f2f5fb;color:#5a6579;border:1px solid #dbe3f0;border-radius:999px;padding:2px 9px;font-size:10.5px;font-weight:700;margin-top:4px;align-self:flex-start}'
		. '.jtcm-pop__badge--v{background:#eefaf1;color:#116b36;border-color:#bfe6cc}'
		. '.jtcm-pop__acts{display:flex;gap:8px;margin-top:8px}'
		. '.jtcm-pop__wa{background:#1fb355;color:#fff;border-radius:9px;padding:7px 14px;font-weight:800;font-size:12.5px;text-decoration:none}'
		. '.jtcm-pop__go{background:#14213d;color:#fff;border-radius:9px;padding:7px 14px;font-weight:800;font-size:12.5px;text-decoration:none}'
		// Map v3 (owner order 2026-07-18): free offices are mute dots; the
		// always-visible label is what a plan buys. Dot hit area stays a
		// thumb-friendly 22px via the ::after halo while the visible dot is 11px.
		. '.jtcm-dot{position:relative;width:11px;height:11px;border-radius:50%;background:#33507e;border:2px solid #fff;box-shadow:0 2px 7px rgba(13,23,54,.4);cursor:pointer;transition:transform .15s ease,background .15s ease}'
		. '.jtcm-dot::after{content:"";position:absolute;inset:-6px;border-radius:50%}'
		. '.jtcm-dot:hover{transform:scale(1.5);background:#14213d}'
		. '.jtcm-flag.is-hot{animation:jtcmHot 1.8s ease-out 1}'
		. '@keyframes jtcmHot{0%{transform:scale(1)}18%{transform:scale(1.18)}36%{transform:scale(1.04)}52%{transform:scale(1.14)}100%{transform:scale(1)}}'
		. '.jtcm-pop__near{display:flex;flex-direction:column;gap:1px;margin-top:9px;background:#fdf8ea;border:1px solid rgba(231,199,101,.6);border-radius:10px;padding:8px 11px;text-decoration:none}'
		. '.jtcm-pop__near-tag{color:#8a6d1f;font-size:10px;font-weight:800}'
		. '.jtcm-pop__near strong{font-size:12.5px}'
		. '.jtcm-pop__near-km{color:#5a6579;font-size:11px}'
		. '.jtcm-pop__claim{display:block;margin-top:9px;color:#1b2f55;font-size:11.5px;font-weight:700;text-decoration:none;border-top:1px dashed #dbe3f0;padding-top:8px}'
		. '.jtcm-pop__claim:hover{color:#14213d;text-decoration:underline}'
		. '.jtcm-archive-slot{margin-top:18px}'
		. '</style>';
}, 42 );
