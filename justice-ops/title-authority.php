<?php
/**
 * Title authority: the database is the single source of truth for titles.
 *
 * Wave 0 (2026-07-13) mirrored every render-time title override into the
 * DB (Yoast title/metadesc + post_title), so the per-post override filters
 * below become redundant and are removed. Replacements keep ONLY the
 * non-per-post behavior (front page, archives, search, lawyer directory)
 * and always let an explicit Yoast field win. Render output is
 * byte-identical to pre-wave-0 by construction and verified live.
 *
 * The five-slug H1 shim exists because those pages' bodies contain strings
 * the publication-safety gate flags (false positives like "בדיקה משפטית"),
 * so their post_title could not be mirrored without touching the gate.
 * Remove each entry once the page's content is cleaned in wave 1+.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	remove_filter( 'the_title', 'justice_theme_money_query_public_title', 20 );
	remove_filter( 'wpseo_title', 'justice_theme_filter_plugin_seo_title' );
	remove_filter( 'aioseo_title', 'justice_theme_filter_plugin_seo_title' );
	remove_filter( 'wpseo_metadesc', 'justice_theme_filter_plugin_seo_description' );
	remove_filter( 'aioseo_description', 'justice_theme_filter_plugin_seo_description' );
	remove_filter( 'pre_get_document_title', 'justice_theme_apply_cluster_pillar_title', 99 );
	remove_filter( 'wpseo_title', 'justice_theme_apply_cluster_pillar_yoast_title', 20 );
	remove_filter( 'wpseo_opengraph_title', 'justice_theme_apply_cluster_pillar_og_title', 20 );
}, 1 );

/**
 * True when the current request is a singular post whose explicit Yoast
 * field must reign over any legacy computed value.
 */
function justice_title_authority_db_wins( string $meta_key ): bool {
	if ( ! is_singular() ) {
		return false;
	}

	$post_id = (int) get_queried_object_id();

	return $post_id > 0 && '' !== trim( (string) get_post_meta( $post_id, $meta_key, true ) );
}

add_filter( 'wpseo_title', function ( $title ) {
	if ( justice_title_authority_db_wins( '_yoast_wpseo_title' ) ) {
		return $title;
	}

	return function_exists( 'justice_theme_filter_plugin_seo_title' )
		? justice_theme_filter_plugin_seo_title( $title )
		: $title;
} );
add_filter( 'aioseo_title', function ( $title ) {
	if ( justice_title_authority_db_wins( '_yoast_wpseo_title' ) ) {
		return $title;
	}

	return function_exists( 'justice_theme_filter_plugin_seo_title' )
		? justice_theme_filter_plugin_seo_title( $title )
		: $title;
} );

add_filter( 'wpseo_metadesc', function ( $desc ) {
	if ( justice_title_authority_db_wins( '_yoast_wpseo_metadesc' ) ) {
		return $desc;
	}

	return function_exists( 'justice_theme_filter_plugin_seo_description' )
		? justice_theme_filter_plugin_seo_description( $desc )
		: $desc;
} );
add_filter( 'aioseo_description', function ( $desc ) {
	if ( justice_title_authority_db_wins( '_yoast_wpseo_metadesc' ) ) {
		return $desc;
	}

	return function_exists( 'justice_theme_filter_plugin_seo_description' )
		? justice_theme_filter_plugin_seo_description( $desc )
		: $desc;
} );

// H1 shim, money-map guard style (applies in any loop, articles only).
function justice_title_authority_h1_shim_money(): array {
	return array(
		'about-cyprus' => 'עורך דין בקפריסין לישראלים: נדל"ן, חברות ומיסוי',
		'buy-real-estate-cyprus' => 'קניית דירה בקפריסין: מחירים, מיסים וליווי משפטי',
		'buying-property-in-greece' => 'קניית דירה ביוון: מחירים, מיסים והליך הרכישה לישראלים',
		'lawyer-for-buying-or-selling-a-house' => 'עורך דין לקניית דירה ומכירת דירה: ליווי, בדיקות ומחיר',
	);
}

// H1 shim, queried-page-only style (mirrors the retired strike H1 guard).
function justice_title_authority_h1_shim_queried(): array {
	return array(
		'medical-malpractice-lawsuits-law-account' => 'רשלנות רפואית 2026: בדיקת עילה, התיישנות ופיצויים',
	);
}

add_filter( 'the_title', function ( $title, $post_id = 0 ) {
	if ( is_admin() ) {
		return $title;
	}

	$post = get_post( $post_id );

	if ( ! $post instanceof WP_Post ) {
		return $title;
	}

	$money = justice_title_authority_h1_shim_money();

	if ( in_the_loop() && 'articles' === $post->post_type && isset( $money[ $post->post_name ] ) ) {
		return $money[ $post->post_name ];
	}

	$queried = justice_title_authority_h1_shim_queried();

	if ( isset( $queried[ $post->post_name ] ) && in_the_loop() && is_main_query() && (int) get_queried_object_id() === (int) $post_id ) {
		return $queried[ $post->post_name ];
	}

	return $title;
}, 20, 2 );
