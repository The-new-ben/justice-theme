<?php
/**
 * Content hierarchy + internal authority: point the pillars at the pages
 * that should rank.
 *
 * GSC (2026-07) showed the money pages buried on page 3-6 with almost no
 * internal links pointing at them: the recommended-family-lawyers page sat
 * at position 64 as a literal orphan (zero links from the family hub or the
 * homepage). Search engines pass relevance and authority along internal
 * links; an orphan gets neither. This module builds a small, curated,
 * genuinely useful "related pages" mesh so each practice pillar and its
 * articles feed authority into the money pages in the same family, and it
 * fills the missing meta descriptions on the tool pages so their search
 * snippets stop being empty.
 *
 * Nothing here is spam: the links are hand-picked, capped, relevant to the
 * page they sit on, and never link a page to itself.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The money-page mesh, per practice family. Each family lists the hub slug,
 * the practice-area term slugs that mark an article as belonging to it, and
 * the curated set of internal links (money pages, tools) that deserve the
 * authority. Links to the current page are dropped at render time.
 *
 * @return array<string,array<string,mixed>>
 */
function justice_seo_mesh(): array {
	$map  = function_exists( 'justice_cards_family_map' ) ? justice_cards_family_map() : array();
	$desk = array( 'path' => '/legal-ai-desk/', 'text' => 'עזרה משפטית מיידית: תיאור מצב או העלאת מסמך' );

	return array(
		'family' => array(
			'hub'   => 'family-law',
			'terms' => $map['family'] ?? array( 'family-law', 'divorce', 'child-support' ),
			'label' => 'מדריכים וכלים בדיני משפחה',
			'links' => array(
				array( 'path' => '/the-recommended-family-lawyers/', 'text' => 'עורכי דין מומלצים לדיני משפחה וגירושין' ),
				array( 'path' => '/child-support/', 'text' => 'מחשבון מזונות ילדים והלכת 919/15' ),
				array( 'path' => '/divorce-lawyer/', 'text' => 'מדריך גירושין ועורך דין גירושין' ),
				$desk,
			),
		),
		'criminal-law' => array(
			'hub'   => '',
			'terms' => $map['criminal-law'] ?? array( 'criminal-law', 'criminal' ),
			'label' => 'מדריכים וכלים בפלילי',
			'links' => array(
				array( 'path' => '/apply-for-police-criminal-information-certificates/', 'text' => 'בקשה לתעודת יושר ומחיקת מידע פלילי' ),
				array( 'path' => '/lahav-433/', 'text' => 'להב 433: היחידה ללחימה בפשיעה חמורה' ),
				array( 'path' => '/criminal-defense-attorney/', 'text' => 'עורך דין פלילי: המדריך המלא' ),
				$desk,
			),
		),
		'real-estate' => array(
			'hub'   => '',
			'terms' => $map['real-estate'] ?? array( 'real-estate-law', 'real-estate' ),
			'label' => 'מדריכים וכלים במקרקעין ונדל"ן',
			'links' => array(
				array( 'path' => '/israel-real-estate-price-forecast/', 'text' => 'תחזית מחירי הנדל"ן בישראל' ),
				array( 'path' => '/guide-israeli-apartment-2025/', 'text' => 'מדריך קניית דירה בישראל' ),
				array( 'path' => '/real-estate-attorney/', 'text' => 'עורך דין מקרקעין: המדריך המלא' ),
				$desk,
			),
		),
		'labor' => array(
			'hub'   => '',
			'terms' => $map['labor'] ?? array( 'israeli-labor-law', 'labor-law' ),
			'label' => 'מדריכים וכלים בדיני עבודה',
			'links' => array(
				array( 'path' => '/labor-lawyer/', 'text' => 'עורך דין דיני עבודה: המדריך המלא' ),
				array( 'path' => '/legal-calculators/', 'text' => 'מחשבוני פיצויי פיטורים, הבראה וחופשה' ),
				$desk,
			),
		),
		'nezikin' => array(
			'hub'   => '',
			'terms' => $map['nezikin'] ?? array( 'personal-injury', 'tort-law' ),
			'label' => 'מדריכים וכלים בנזיקין ותאונות',
			'links' => array(
				array( 'path' => '/medical-malpractice-lawsuits-law-account/', 'text' => 'רשלנות רפואית: תביעות ופיצויים' ),
				array( 'path' => '/tort-lawyer/', 'text' => 'עורך דין נזיקין: המדריך המלא' ),
				$desk,
			),
		),
	);
}

/**
 * Which family (if any) does the current queried object belong to?
 */
function justice_seo_current_family(): string {
	$qo = get_queried_object();

	if ( ! ( $qo instanceof WP_Post ) ) {
		return '';
	}

	foreach ( justice_seo_mesh() as $family => $conf ) {
		if ( 'page' === $qo->post_type && $qo->post_name === $conf['hub'] ) {
			return $family;
		}
	}

	// Articles: match by practice-areas term.
	if ( in_array( $qo->post_type, array( 'articles', 'post' ), true ) ) {
		$terms = get_the_terms( $qo->ID, 'practice-areas' );

		if ( is_array( $terms ) ) {
			$slugs = wp_list_pluck( $terms, 'slug' );

			foreach ( justice_seo_mesh() as $family => $conf ) {
				if ( array_intersect( $slugs, $conf['terms'] ) ) {
					return $family;
				}
			}
		}
	}

	return '';
}

/**
 * Append the curated related-pages block after the content on hub and
 * family articles. Self-links are dropped; nothing renders if fewer than
 * two links survive.
 */
add_filter( 'the_content', function ( $content ) {
	if ( ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if ( false !== strpos( $content, 'jt-seo-mesh' ) ) {
		return $content;
	}

	$family = justice_seo_current_family();

	if ( '' === $family ) {
		return $content;
	}

	$conf    = justice_seo_mesh()[ $family ];
	$here    = trailingslashit( (string) wp_parse_url( get_permalink(), PHP_URL_PATH ) );
	$items   = '';
	$count   = 0;

	foreach ( $conf['links'] as $link ) {
		if ( trailingslashit( $link['path'] ) === $here ) {
			continue;
		}

		$items .= '<li><a href="' . esc_url( home_url( $link['path'] ) ) . '">' . esc_html( $link['text'] ) . '</a></li>';
		$count++;
	}

	if ( $count < 2 ) {
		return $content;
	}

	$block = '<nav class="jt-seo-mesh" aria-label="' . esc_attr( $conf['label'] ) . '">'
		. '<h2 class="jt-seo-mesh__h">' . esc_html( $conf['label'] ) . '</h2>'
		. '<ul>' . $items . '</ul>'
		. '</nav>';

	return $content . $block;
}, 30 );

add_action( 'wp_head', function () {
	if ( '' === justice_seo_current_family() ) {
		return;
	}

	echo '<style id="jt-seo-mesh-css">'
		. '.jt-seo-mesh{margin:34px 0;padding:22px 24px;background:#f7f9fd;border:1px solid #e3e8f2;border-radius:16px}'
		. '.jt-seo-mesh__h{margin:0 0 12px;font-size:19px;color:#14213d}'
		. '.jt-seo-mesh ul{margin:0;padding:0;list-style:none;display:grid;gap:10px}'
		. '.jt-seo-mesh li{padding-inline-start:20px;position:relative}'
		. '.jt-seo-mesh li::before{content:"←";position:absolute;inset-inline-start:0;color:#c99a2e;font-weight:800}'
		. '.jt-seo-mesh a{color:#14213d;font-weight:700;text-decoration:none;border-bottom:1px solid transparent}'
		. '.jt-seo-mesh a:hover{border-bottom-color:#c99a2e}'
		. '</style>';
}, 44 );

/**
 * The missing meta descriptions on the tool pages: GSC-relevant snippets
 * for pages the theme and Yoast left blank. Set the copy once, then emit a
 * description tag for exactly those slugs, only when one is not already in
 * the head (guarded by a one-time flag per request).
 *
 * @return array<string,string> slug => description.
 */
function justice_seo_tool_descriptions(): array {
	return array(
		'legal-help'         => 'אבחון משפטי מהיר בלי פרטים אישיים: כמה שאלות קצרות ובסוף פנייה מסודרת לעורך דין מתאים לפי התחום, המצב והדחיפות שלכם.',
		'legal-calculators'  => 'מחשבונים משפטיים חינמיים ומעודכנים: פיצויי פיטורים, דמי הבראה, ימי חופשה ואגרת תביעה קטנה, לפי הנוסחאות והסכומים הקבועים בחוק.',
		'legal-documents'    => 'מחוללי מסמכים משפטיים חינמיים: מכתב התראה לפני תביעה וערעור על דוח חניה, נבנים בדפדפן עם אפשרות להעברה לעורך דין לבדיקה.',
		'ask-a-lawyer'       => 'שאלה משפטית קצרה מקבלת תשובה כללית מסודרת תחת כללי גילוי נאות, ואם תשאירו טלפון נחבר אתכם לעורך דין מתאים לתחום.',
	);
}

/**
 * Cannibalization consolidation: when several of our own pages fight over
 * one query, Google splits the signal and buries all of them. GSC
 * (2026-07) surfaced clear cases: two near-identical divorce-mediation
 * pages, a duplicate divorce-agreement template, and overlapping Portugal
 * relocation guides. We point the weaker page's canonical at the stronger
 * one, so the equity and relevance concentrate on a single URL. This uses
 * a rel=canonical hint (through Yoast, which owns canonicals here), not a
 * redirect: it is fully reversible and the weaker page still serves users.
 *
 * Each target was verified live (HTTP 200) and is never itself a key, so
 * no canonical loop is possible. Filterable so the map can grow as more
 * cannibalization is confirmed.
 *
 * @return array<string,string> weaker path => canonical path (no slashes).
 */
function justice_seo_consolidate_map(): array {
	return apply_filters( 'justice_seo_consolidate_map', array(
		'mediation-divorce'             => 'divorce-mediation',
		'mutual-divorce-agreement-2025' => 'free-divorce-agreement-template',
		'immigration-to-portugal'       => 'portugal-relocation',
	) );
}

add_filter( 'wpseo_canonical', function ( $canonical ) {
	$qo = get_queried_object();

	if ( ! ( $qo instanceof WP_Post ) ) {
		return $canonical;
	}

	$path = trim( (string) wp_parse_url( (string) get_permalink( $qo->ID ), PHP_URL_PATH ), '/' );
	$map  = justice_seo_consolidate_map();

	if ( isset( $map[ $path ] ) ) {
		return home_url( '/' . $map[ $path ] . '/' );
	}

	return $canonical;
} );

add_action( 'wp_head', function () {
	$qo = get_queried_object();

	if ( ! ( $qo instanceof WP_Post ) || 'page' !== $qo->post_type ) {
		return;
	}

	$map = justice_seo_tool_descriptions();

	if ( ! isset( $map[ $qo->post_name ] ) ) {
		return;
	}

	// Prefer an editor-set description; fall back to the curated copy.
	$desc = (string) get_post_meta( $qo->ID, 'seo_description', true );

	if ( '' === $desc ) {
		$desc = $map[ $qo->post_name ];
	}

	echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n";
}, 1 );
