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
	if ( is_singular( array( 'articles', 'justice_question' ) ) ) {
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
		. '<a class="jtcm-finder__alt" href="' . esc_url( home_url( '/legal-help/' ) ) . '">לא בטוחים? אבחון מהיר</a>'
		. '</div>';
}

add_filter( 'the_content', function ( $content ) {
	if ( ! in_the_loop() || ! is_main_query() || ! justice_cinema_wanted() ) {
		return $content;
	}

	if ( false !== strpos( $content, 'jt-cinema-map' ) || '' === justice_cinema_token() ) {
		return $content;
	}

	$block = '<section class="jtcm-wrap">'
		. '<h2>מפת עורכי הדין, המשרדים ובתי המשפט</h2>'
		. '<p class="jtcm-sub">משרדים מקודמים מסומנים בדגל זהב. בתי משפט ומוסדות מסומנים על המפה עצמה. אפשר סיור אווירי בין המשרדים המובילים.</p>'
		. justice_cinema_finder()
		. '<div id="jt-cinema-map" aria-label="מפה תלת ממדית של עורכי דין ובתי משפט"></div>'
		. '<button type="button" id="jt-cinema-tour" class="jtcm-tour">סיור אווירי מעל המשרדים המובילים</button>'
		. '</section>';

	return $content . $block;
}, 32 );

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
		. '.jtcm-tour{margin-top:12px;background:linear-gradient(90deg,#e7c765,#d9b654);color:#14213d;border:0;border-radius:11px;padding:12px 24px;font-weight:800;font-size:14.5px;cursor:pointer;box-shadow:0 10px 24px -12px rgba(185,143,46,.7)}'
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
		. '.jtcm-pop{direction:rtl;font-family:inherit}'
		. '.jtcm-pop strong{color:#14213d}'
		. '.jtcm-pop__meta{color:#5a6579;font-size:12px;margin-top:4px}'
		. '.jtcm-pop__acts{display:flex;gap:8px;margin-top:8px}'
		. '.jtcm-pop__wa{background:#1fb355;color:#fff;border-radius:9px;padding:7px 14px;font-weight:800;font-size:12.5px;text-decoration:none}'
		. '.jtcm-pop__go{background:#14213d;color:#fff;border-radius:9px;padding:7px 14px;font-weight:800;font-size:12.5px;text-decoration:none}'
		. '</style>';
}, 42 );
