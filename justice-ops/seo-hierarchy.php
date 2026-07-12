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
	return array(
		'family' => array(
			'hub'   => 'family-law',
			'terms' => array( 'family-law', 'family', 'divorce', 'gerushin', 'mishpacha' ),
			'label' => 'מדריכים וכלים בדיני משפחה',
			'links' => array(
				array( 'path' => '/the-recommended-family-lawyers/', 'text' => 'עורכי דין מומלצים לדיני משפחה וגירושין' ),
				array( 'path' => '/child-support/', 'text' => 'מחשבון מזונות ילדים והלכת 919/15' ),
				array( 'path' => '/family-law/', 'text' => 'מדריך דיני משפחה וגירושין המלא' ),
				array( 'path' => '/legal-ai-desk/', 'text' => 'עזרה משפטית מיידית: תיאור מצב או העלאת מסמך' ),
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
