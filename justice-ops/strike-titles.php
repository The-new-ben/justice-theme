<?php
/**
 * SERP strike titles: text-only CTR lifts on pages GSC proves are seen
 * and not clicked. The 2026-07-12 pull showed the pattern precisely:
 * "הסכם גירושין" on PAGE ONE (position 7.7, 1,527 impressions) with two
 * clicks, because the title leads with a qualifier and carries no year;
 * "עורך דין פלילי שכר" at position 3.7 with zero clicks behind a broken
 * 71-character double-pipe title. Every entry here was written from the
 * live SERP vocabulary of its query family.
 *
 * Render-layer only (wpseo_title / wpseo_metadesc): no URLs move, no
 * content changes, instantly reversible. Self-retiring per slug: the
 * moment the theme's own money-query map carries a slug, the theme wins
 * and this file goes quiet for it.
 *
 * Years are computed (wp_date), never hardcoded, so January does not
 * catch us lying.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The strike map. %Y% becomes the current year at render.
 *
 * @return array<string,array{title:string,desc:string}>
 */
function justice_strike_map(): array {
	return apply_filters( 'justice_strike_map', array(
		'free-divorce-agreement-template' => array(
			'title' => 'הסכם גירושין: דוגמה מלאה להורדה חינם, נוסח %Y%',
			'desc'  => 'דוגמה מלאה של הסכם גירושין להורדה, סעיף אחרי סעיף: רכוש, משמורת, מזונות ותהליך האישור בבית המשפט או בבית הדין הרבני. נוסח מעודכן %Y%.',
			'h1'    => 'הסכם גירושין %Y%: דוגמה מלאה להורדה ומה חייב להופיע',
		),
		'online-rent-agreement'           => array(
			'title' => 'חוזה שכירות אונליין להורדה חינם: נוסח מעודכן %Y%',
			'desc'  => 'חוזה שכירות אונליין בנוסח סטנדרטי מעודכן %Y%: מילוי והורדה חינם בלי הרשמה, כולל ערבויות, ביטחונות והסעיפים שחייבים לבדוק לפני חתימה.',
		),
		'apply-for-police-criminal-information-certificates' => array(
			'title' => 'תעודת יושר %Y%: בקשה לתעודת מידע פלילי אונליין',
			'desc'  => 'בקשה לתעודת מידע פלילי (תעודת יושר) אונליין: מי זכאי, איך מגישים למשטרה צעד אחר צעד, כמה זמן לוקח ומה עושים כשיש רישום. מעודכן %Y%.',
		),
		'criminal-law-lawyer-criminal-israel' => array(
			'title' => 'כמה מרוויח עורך דין פלילי בישראל: שכר %Y%',
			'desc'  => 'כמה מרוויח עורך דין פלילי בישראל: טווחי שכר לפי ניסיון, גודל משרד וסוג התיקים, על פי נתונים רשמיים, והגורמים שמזיזים את המספר. מעודכן %Y%.',
		),
		'legal-simulation'                => array(
			'title' => 'הדמיה משפטית: סימולציית בית משפט חיה עם AI',
			'desc'  => 'הדמיה משפטית אינטראקטיבית: דיון חי עם דמויות AI, עדים וטיעונים, בעברית ובאנגלית. מתארים מקרה במשפט אחד וצופים בזירה נפתחת. בלי הרשמה.',
		),
		'criminal-defense-attorney'       => array(
			'title' => 'עורך דין פלילי %Y%: מה עושים בחקירה, מעצר ושימוע',
			'desc'  => 'זומנתם לחקירה, נעצרתם או קיבלתם מכתב שימוע? מפת פעולה לפי שלב: זכויות, מועדים קריטיים, רישום פלילי ושכר טרחה. מעודכן %Y%.',
		),
	) );
}

/**
 * Resolve the current request's slug the lie-proof way (controlled
 * routes force-retype queries, so is_page/global post cannot be
 * trusted; the queried object plus the raw path can).
 */
function justice_strike_current_slug(): string {
	$qo = get_queried_object();

	if ( $qo instanceof WP_Post && '' !== (string) $qo->post_name ) {
		return (string) $qo->post_name;
	}

	$path = trim( strtok( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), '?' ), '/' );
	$path = rawurldecode( $path );
	$bits = explode( '/', $path );

	return (string) end( $bits );
}

/**
 * This layer retires per slug the moment the THEME map carries the same
 * text (the repo edit landed via the owner's pull). Until then ops wins:
 * the strike data is newer than the theme's last deploy.
 */
function justice_strike_entry(): array {
	$slug = justice_strike_current_slug();

	if ( '' === $slug ) {
		return array();
	}

	$map = justice_strike_map();

	if ( ! isset( $map[ $slug ] ) ) {
		return array();
	}

	$entry = $map[ $slug ];

	if ( function_exists( 'justice_theme_money_query_seo_map' ) ) {
		$theme_map = justice_theme_money_query_seo_map();
		$ours      = str_replace( '%Y%', wp_date( 'Y' ), $entry['title'] ) . ' | Jus-Tice';

		if ( is_array( $theme_map ) && isset( $theme_map[ $slug ]['seo_title'] ) && $theme_map[ $slug ]['seo_title'] === $ours ) {
			return array();
		}
	}

	return $entry;
}

add_filter( 'wpseo_title', function ( $title ) {
	$entry = justice_strike_entry();

	if ( empty( $entry['title'] ) ) {
		return $title;
	}

	return str_replace( '%Y%', wp_date( 'Y' ), $entry['title'] ) . ' | Jus-Tice';
}, 20 );

add_filter( 'wpseo_metadesc', function ( $desc ) {
	$entry = justice_strike_entry();

	if ( empty( $entry['desc'] ) ) {
		return $desc;
	}

	return str_replace( '%Y%', wp_date( 'Y' ), $entry['desc'] );
}, 20 );

// The rendered H1: the theme overrides the_title for mapped articles at
// priority 20, so the strike H1 rides at 30 with the same equality
// retire as the head tags.
add_filter( 'the_title', function ( $title, $post_id = 0 ) {
	if ( is_admin() || ! in_the_loop() || ! is_main_query() ) {
		return $title;
	}

	$post = get_post( $post_id );

	if ( ! $post instanceof WP_Post || (int) get_queried_object_id() !== (int) $post_id ) {
		return $title;
	}

	$map = justice_strike_map();

	if ( empty( $map[ $post->post_name ]['h1'] ) ) {
		return $title;
	}

	return str_replace( '%Y%', wp_date( 'Y' ), $map[ $post->post_name ]['h1'] );
}, 30, 2 );
