<?php
/**
 * The professional homepage layer: our strongest page finally sells our
 * strongest assets.
 *
 * The 2026-07 side-by-side against din.co.il found the gap in one line:
 * their homepage shows a trust wall and disciplined links; ours carried 239
 * links with ZERO links to our own money pages and zero mention of the AI
 * desk, the one thing they cannot match. This layer injects one premium
 * band right after the hero: a one-box "tell us what happened" that lands
 * in the AI desk prefilled, a document-upload entry, a truthful trust wall
 * (real counts with floors, never inflated), and a curated row of
 * contextual, descriptive-anchor links into the money pages, passing the
 * homepage's authority exactly where GSC showed starvation. The homepage
 * meta description is rewritten to a hand-written snippet.
 *
 * Injection uses the proven front-page output buffer with a marker
 * cascade, so it survives theme reordering and never doubles.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Truthful trust numbers, cached 6 hours. A number below its floor is
 * omitted, never rounded up: the wall only says what the data can prove.
 *
 * @return array<int,array{n:string,label:string}>
 */
function justice_home_trust_numbers(): array {
	$cached = get_transient( 'jt_home_trust_v1' );

	if ( is_array( $cached ) ) {
		return $cached;
	}

	$counts = array();

	$guides = (int) ( wp_count_posts( 'articles' )->publish ?? 0 ) + (int) ( wp_count_posts( 'post' )->publish ?? 0 );

	if ( $guides >= 50 ) {
		$counts[] = array( 'n' => number_format( $guides ), 'label' => 'מדריכים ומאמרים משפטיים' );
	}

	$terms = (int) ( wp_count_posts( 'justice_term' )->publish ?? 0 );

	if ( $terms >= 30 ) {
		$counts[] = array( 'n' => number_format( $terms ), 'label' => 'ערכים באנציקלופדיה המשפטית' );
	}

	$tools = ( function_exists( 'justice_calc_registry' ) ? count( justice_calc_registry() ) : 0 )
		+ ( function_exists( 'justice_docs_registry' ) ? count( justice_docs_registry() ) : 0 );

	if ( $tools >= 4 ) {
		$counts[] = array( 'n' => (string) $tools, 'label' => 'מחשבונים ומחוללי מסמכים' );
	}

	$courts = 0;

	if ( post_type_exists( 'justice_place' ) ) {
		$court_ids = get_posts( array(
			'post_type'      => 'justice_place',
			'post_status'    => 'publish',
			'posts_per_page' => 100,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_query'     => array( array( 'key' => 'place_type', 'value' => 'court' ) ),
		) );
		$courts    = count( $court_ids );
	}

	if ( $courts >= 10 ) {
		$counts[] = array( 'n' => (string) $courts, 'label' => 'בתי משפט מסומנים במפה' );
	}

	set_transient( 'jt_home_trust_v1', $counts, 6 * HOUR_IN_SECONDS );

	return $counts;
}

/**
 * The band itself. One box into the desk, upload entry, trust wall,
 * curated money links with descriptive anchors.
 */
function justice_home_pro_band(): string {
	$trust = '';

	foreach ( justice_home_trust_numbers() as $t ) {
		$trust .= '<div class="jt-hp__stat"><strong>' . esc_html( $t['n'] ) . '</strong><span>' . esc_html( $t['label'] ) . '</span></div>';
	}

	$links = array(
		array( '/legal-ai-desk/', 'עוזר משפטי מיידי: תיאור מצב או העלאת מסמך' ),
		array( '/legal-calculators/', 'מחשבוני פיצויי פיטורים, הבראה וחופשה' ),
		array( '/free-divorce-agreement-template/', 'הסכם גירושין: דוגמה מלאה להורדה' ),
		array( '/child-support/', 'מחשבון מזונות ילדים לפי הלכת 919/15' ),
		array( '/the-recommended-family-lawyers/', 'עורכי דין מומלצים לדיני משפחה' ),
		array( '/apply-for-police-criminal-information-certificates/', 'תעודת יושר ומידע פלילי: המדריך המלא' ),
	);

	$links_html = '';

	foreach ( $links as $l ) {
		$links_html .= '<a href="' . esc_url( home_url( $l[0] ) ) . '">' . esc_html( $l[1] ) . '</a>';
	}

	return '<section class="jt-hp" aria-label="עזרה משפטית מיידית וכלים">'
		. '<div class="jt-hp__inner">'
		. '<p class="jt-hp__eyebrow">הדרך הקצרה לתשובה</p>'
		. '<h2 class="jt-hp__h">ספרו מה קרה, וקבלו כיוון משפטי תוך שניות</h2>'
		. '<p class="jt-hp__sub">תיאור קצר במשפט אחד, או צילום של מסמך, ועוזר ה-AI יסביר במה מדובר, מה הזכויות ומה הצעד הבא. בלי הרשמה, והפנייה לא נשמרת.</p>'
		. '<form class="jt-hp__box" method="get" action="' . esc_url( home_url( '/legal-ai-desk/' ) ) . '">'
		. '<label class="screen-reader-text" for="jt-hp-q">מה קרה?</label>'
		. '<input type="text" id="jt-hp-q" name="q" placeholder="לדוגמה: קיבלתי דוח חניה ואני רוצה לערער" maxlength="300">'
		. '<button type="submit">קבלת כיוון</button>'
		. '</form>'
		. '<a class="jt-hp__doc" href="' . esc_url( home_url( '/legal-ai-desk/#doc' ) ) . '">יש לכם מסמך? העלו תמונה שלו לבדיקה מיידית</a>'
		. ( '' !== $trust ? '<div class="jt-hp__wall">' . $trust . '</div>' : '' )
		. '<nav class="jt-hp__links" aria-label="המדריכים והכלים המרכזיים"><h3>המדריכים והכלים שהכי מבוקשים</h3>' . $links_html . '</nav>'
		. '</div></section>';
}

add_action( 'template_redirect', function () {
	if ( ! is_front_page() ) {
		return;
	}

	ob_start( function ( $html ) {
		// The theme templates carry emoji inside headings (37 on the live
		// audit); screen readers announce them and they read low-authority
		// for a legal brand. Strip them from headings at render time.
		$html = preg_replace_callback( '/<h([1-6])([^>]*)>(.*?)<\/h\1>/su', function ( $m ) {
			$inner = preg_replace( '/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}\x{200D}]/u', '', $m[3] );

			return '<h' . $m[1] . $m[2] . '>' . trim( (string) $inner ) . '</h' . $m[1] . '>';
		}, $html );

		if ( false !== strpos( $html, 'jt-hp__box' ) ) {
			return $html;
		}

		// Right after the hero: before the money-hubs band when present,
		// otherwise before the featured lawyers.
		foreach ( array( '<section class="jt2-section money-hubs', '<section class="money-hubs', '<section class="featured-lawyers section"' ) as $marker ) {
			$pos = strpos( $html, $marker );

			if ( false !== $pos ) {
				return substr_replace( $html, justice_home_pro_band(), $pos, 0 );
			}
		}

		return $html;
	} );
}, 5 );

add_action( 'wp_head', function () {
	if ( ! is_front_page() ) {
		return;
	}

	echo '<style id="jt-hp-css">'
		. '.jt-hp{background:linear-gradient(165deg,#0f1e3d,#1b2f55 60%,#24406e);padding:44px 18px;margin:0}'
		. '.jt-hp__inner{max-width:880px;margin:0 auto;text-align:center}'
		. '.jt-hp__eyebrow{color:#e7c765;font-weight:800;font-size:13px;letter-spacing:.12em;margin:0 0 10px}'
		. '.jt-hp__h{color:#fff;font-size:clamp(24px,4.4vw,36px);line-height:1.15;margin:0 0 10px;letter-spacing:-.01em}'
		. '.jt-hp__sub{color:#c6d0e4;font-size:16px;line-height:1.6;margin:0 auto 22px;max-width:56ch}'
		. '.jt-hp__box{display:flex;gap:10px;max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:8px;box-shadow:0 24px 50px -22px rgba(0,0,0,.55)}'
		. '.jt-hp__box input{flex:1;border:0;padding:12px 14px;font:inherit;font-size:16px;color:#14213d;background:transparent;min-width:0}'
		. '.jt-hp__box input:focus{outline:none}'
		. '.jt-hp__box:focus-within{box-shadow:0 0 0 4px rgba(231,199,101,.4),0 24px 50px -22px rgba(0,0,0,.55)}'
		. '.jt-hp__box button{background:linear-gradient(90deg,#e7c765,#d9b654);color:#14213d;border:0;border-radius:12px;padding:12px 26px;font-weight:800;font-size:15.5px;cursor:pointer;white-space:nowrap}'
		. '.jt-hp__doc{display:inline-block;margin-top:14px;color:#e7c765;font-weight:700;font-size:14px;text-decoration:none;border-bottom:1px solid rgba(231,199,101,.5)}'
		. '.jt-hp__doc:hover{color:#fff}'
		. '.jt-hp__wall{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin:28px auto 0;max-width:760px}'
		. '.jt-hp__stat{background:rgba(255,255,255,.07);border:1px solid rgba(231,199,101,.35);border-radius:14px;padding:14px 22px;min-width:150px}'
		. '.jt-hp__stat strong{display:block;color:#e7c765;font-size:26px;font-weight:800;font-variant-numeric:tabular-nums}'
		. '.jt-hp__stat span{color:#c6d0e4;font-size:12.5px}'
		. '.jt-hp__links{margin:30px auto 0;max-width:820px;text-align:start}'
		. '.jt-hp__links h3{color:#fff;font-size:15px;margin:0 0 10px;text-align:center}'
		. '.jt-hp__links a{display:inline-block;margin:5px 0 5px 10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);color:#e8edf7;border-radius:999px;padding:8px 16px;font-size:13.5px;font-weight:700;text-decoration:none}'
		. '.jt-hp__links a:hover{border-color:#e7c765;color:#e7c765}'
		. '@media(max-width:560px){.jt-hp{padding:34px 14px}.jt-hp__box{flex-direction:column}.jt-hp__box button{width:100%}}'
		. '</style>';
}, 7 );

/**
 * Hand-written homepage snippet instead of the 270-character auto dump.
 */
add_filter( 'wpseo_metadesc', function ( $desc ) {
	if ( is_front_page() ) {
		return 'איתור עורך דין לפי תחום ועיר, מדריכים משפטיים מעודכנים, מחשבונים, מסמכים להורדה ועוזר AI שמכוון אתכם לצעד הבא. מידע כללי ואיתור אנשי מקצוע, ללא עלות.';
	}

	return $desc;
} );
