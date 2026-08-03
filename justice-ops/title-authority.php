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
 * Five legacy H1 shims remain. Two Cyprus shims are state-aware during their
 * controlled release: the exact old DB title keeps the old rendered H1, the
 * exact approved target title renders from the DB, and rollback automatically
 * restores the old H1. Unexpected DB values fail closed to the legacy H1.
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

/**
 * Exact pre-release and approved target DB titles for state-aware H1 control.
 *
 * @return array<string,array<string,string>>
 */
function justice_title_authority_cyprus_h1_states(): array {
	return array(
		'about-cyprus' => array(
			'prior_post_title'  => 'קפריסין | דסק קפריסין',
			'target_post_title' => 'קפריסין: מידע מעשי ומשפטי לישראלים',
		),
		'buy-real-estate-cyprus' => array(
			'prior_post_title'  => 'השקעות נדל"ן בקפריסין 2024 | ' . "\u{202B}" . 'עלויות נדל”ן קפריסין',
			'target_post_title' => 'עלויות ומיסוי ברכישת נכס בקפריסין',
		),
	);
}

// H1 shim, queried-page-only style (mirrors the retired strike H1 guard).
function justice_title_authority_h1_shim_queried(): array {
	return array(
		'medical-malpractice-lawsuits-law-account' => 'רשלנות רפואית 2026: בדיקת עילה, התיישנות ופיצויים',
	);
}

/**
 * DB authority on the controlled practice routes (wave 1, 2026-07-14).
 *
 * inc/practice-landing.php renders four English practice URLs at
 * template_redirect -999999 and, right before get_header(), re-registers
 * hard-coded title/description filters at PHP_INT_MAX. Those beat every
 * filter added at plugin load, so the wave-0 rule (explicit Yoast field
 * wins) silently lost on exactly those four pages - invisible until a DB
 * title actually changed, because wave 0 mirrored the engine output into
 * the DB. Registering from the get_header action (fires after the route
 * registered its filters, before wp_head renders) puts the DB back on
 * top: same hook, same priority, later registration runs last and wins.
 * Scoped strictly to the controlled routes; every other page keeps its
 * existing filter chain, and routes whose Yoast fields still equal the
 * engine strings render byte-identical.
 */
add_action( 'get_header', function () {
	if ( ! is_singular() || ! function_exists( 'justice_theme_get_controlled_practice_route_template' ) ) {
		return;
	}

	if ( '' === justice_theme_get_controlled_practice_route_template() ) {
		return;
	}

	$post_id = (int) get_queried_object_id();

	if ( $post_id <= 0 ) {
		return;
	}

	$db_title = trim( (string) get_post_meta( $post_id, '_yoast_wpseo_title', true ) );
	$db_desc  = trim( (string) get_post_meta( $post_id, '_yoast_wpseo_metadesc', true ) );

	if ( '' !== $db_title ) {
		$win_title = static function () use ( $db_title ): string {
			return $db_title;
		};
		add_filter( 'pre_get_document_title', $win_title, PHP_INT_MAX );
		add_filter( 'wpseo_title', $win_title, PHP_INT_MAX );
	}

	if ( '' !== $db_desc ) {
		add_filter( 'wpseo_metadesc', static function () use ( $db_desc ): string {
			return $db_desc;
		}, PHP_INT_MAX );
	}
} );

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
		$cyprus_states = justice_title_authority_cyprus_h1_states();
		if ( isset( $cyprus_states[ $post->post_name ] ) ) {
			$state = $cyprus_states[ $post->post_name ];
			if ( $state['target_post_title'] === (string) $post->post_title ) {
				return (string) $post->post_title;
			}

			// Exact prior and every unexpected state retain the legacy H1.
			return $money[ $post->post_name ];
		}
		return $money[ $post->post_name ];
	}

	$queried = justice_title_authority_h1_shim_queried();

	if ( isset( $queried[ $post->post_name ] ) && in_the_loop() && is_main_query() && (int) get_queried_object_id() === (int) $post_id ) {
		return $queried[ $post->post_name ];
	}

	return $title;
}, 20, 2 );
