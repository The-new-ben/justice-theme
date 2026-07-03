<?php
/**
 * SERP-reverse-engineered titles for cluster pillar pages.
 *
 * RESEARCH BASIS (real sources read 2026-06-09 — see TITLE-BLUEPRINT-from-SERP.md):
 *   - Zyppy / Cyrus Shepard 41,000-title study: titles 50-60 chars keep the lowest
 *     rewrite rate (~40% rewrite vs 61% sitewide). 84.87% of kept titles are in that range.
 *     https://zyppy.com/seo/google-title-rewrite-study/
 *   - Aleyda Solis: focus on pages with high impressions and below-position-average CTR;
 *     rewrite title and meta so the page matches the SERP intent.
 *     https://www.aleydasolis.com/en/search-engine-optimization/improving-pages-ctr-search-results/
 *   - Google Search Central: title must align with prominent on-page text; no keyword
 *     stuffing; one head keyword + descriptive context.
 *     https://developers.google.com/search/docs/appearance/title-link
 *   - Backlinko/Traficxo CTR-by-position 2025: position 1 ~ 27.6%, position 10 ~ 2.4%.
 *   - Search Engine Land: striking-distance queries (pos 8-20, imp >=500, CTR <3%) are the
 *     highest-ROI title-rewrite targets. https://searchengineland.com/guide/title-tag
 *
 * PATTERN APPLIED (extracted from page-1 winners for the head terms):
 *   <head keyword> <co-occurring SERP synonym> | <SERP-vocabulary trust word> | Jus-Tice
 *
 *   - "head keyword first" rule (Google + Zyppy + every modern SEO source).
 *   - "trust word from the SERP's OWN vocabulary": מדריך / השוואה / זכויות / מנוסה
 *     (NEVER best / number 1 / fastest / guaranteed — Bar rules + Google spam).
 *   - No em-dashes; ASCII hyphen "-" and pipe "|" only (owner directive).
 *   - Each title sized to ~50-58 characters to stay inside the low-rewrite band.
 *
 * MECHANISM: a pre_get_document_title filter keyed by the page slug. No DB writes,
 * no post_meta touched, no plugin. Removing this filter restores the previous title.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * SERP-pattern titles for cluster pillar pages.
 *
 * Slug => title. The slug is the page's post_name (the real live English slug).
 *
 * @return array<string,string>
 */
function justice_theme_cluster_pillar_titles(): array {
	return array(
		'criminal-defense-attorney'   => 'עורך דין פלילי - ייעוץ וליווי משפטי | מדריך | Jus-Tice',
		'real-estate-attorney'        => 'עורך דין מקרקעין ונדל"ן - מדריך לעסקה בטוחה | Jus-Tice',
		'divorce-lawyer'              => 'עורך דין גירושין: ליווי בהסכמה, בסכסוך ובגישור | Jus-Tice',
		'family-law'                  => 'דיני משפחה וגירושין - זכויות, הסכמים ומשמורת | Jus-Tice',
		'medical-malpractice-lawyer'  => 'עורך דין רשלנות רפואית - מתי תובעים ואיך | מדריך | Jus-Tice',
		'traffic-lawyer'              => 'עורך דין תעבורה - שלילה, דוחות ושכרות | מדריך | Jus-Tice',
		'labor-lawyer'                => 'עורך דין דיני עבודה - זכויות עובדים וייעוץ ראשוני | Jus-Tice',
		'inheritance-lawyer'          => 'עורך דין ירושה וצוואות - צו ירושה והתנגדות | Jus-Tice',
		'personal-injury-law'         => 'עורך דין נזיקין ותאונות - פיצויים ותביעות | Jus-Tice',
		'immigration-lawyer'          => 'עורך דין הגירה ואזרחות - ויזות ודרכונים | Jus-Tice',
	);
}

/**
 * Apply the SERP-pattern title when the current request is a mapped pillar page.
 *
 * Hooked at pre_get_document_title (priority 99). Respects an owner override stored
 * in Yoast meta (_yoast_wpseo_title) so manual title edits in wp-admin still win.
 *
 * @param string $title Current title.
 * @return string
 */
function justice_theme_apply_cluster_pillar_title( $title ) {
	if ( is_admin() || ! is_singular() ) {
		return $title;
	}

	$post_id = (int) get_queried_object_id();
	if ( $post_id <= 0 ) {
		return $title;
	}

	$slug = strtolower( trim( (string) get_post_field( 'post_name', $post_id ) ) );
	if ( '' === $slug ) {
		return $title;
	}

	$titles = justice_theme_cluster_pillar_titles();
	if ( ! isset( $titles[ $slug ] ) ) {
		return $title;
	}

	// Respect an explicit Yoast title set by the owner in wp-admin.
	$yoast_title = (string) get_post_meta( $post_id, '_yoast_wpseo_title', true );
	if ( '' !== trim( $yoast_title ) ) {
		return $title;
	}

	return $titles[ $slug ];
}
add_filter( 'pre_get_document_title', 'justice_theme_apply_cluster_pillar_title', 99 );

/**
 * Mirror the same title to Yoast's title chain so the Yoast-rendered SERP snippet
 * stays consistent.
 *
 * @param string $title Yoast title.
 * @return string
 */
function justice_theme_apply_cluster_pillar_yoast_title( $title ) {
	if ( ! is_string( $title ) || ! is_singular() ) {
		return $title;
	}
	$post_id = (int) get_queried_object_id();
	if ( $post_id <= 0 ) {
		return $title;
	}
	$slug   = strtolower( trim( (string) get_post_field( 'post_name', $post_id ) ) );
	$titles = justice_theme_cluster_pillar_titles();
	if ( ! isset( $titles[ $slug ] ) ) {
		return $title;
	}
	$yoast_title = (string) get_post_meta( $post_id, '_yoast_wpseo_title', true );
	if ( '' !== trim( $yoast_title ) ) {
		return $title;
	}
	return $titles[ $slug ];
}
add_filter( 'wpseo_title', 'justice_theme_apply_cluster_pillar_yoast_title', 20 );

/**
 * Match the OpenGraph title so social shares show the same SERP-pattern title.
 *
 * @param string $og_title Current OG title.
 * @return string
 */
function justice_theme_apply_cluster_pillar_og_title( $og_title ) {
	if ( ! is_string( $og_title ) || ! is_singular() ) {
		return $og_title;
	}
	$post_id = (int) get_queried_object_id();
	$slug    = strtolower( trim( (string) get_post_field( 'post_name', $post_id ) ) );
	$titles  = justice_theme_cluster_pillar_titles();
	if ( ! isset( $titles[ $slug ] ) ) {
		return $og_title;
	}
	if ( '' !== trim( (string) get_post_meta( $post_id, '_yoast_wpseo_opengraph-title', true ) ) ) {
		return $og_title;
	}
	return $titles[ $slug ];
}
add_filter( 'wpseo_opengraph_title', 'justice_theme_apply_cluster_pillar_og_title', 20 );
