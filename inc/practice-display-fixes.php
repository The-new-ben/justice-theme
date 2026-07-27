<?php
/**
 * Display-only practice fixes (owner order 2026-07-21). No DB writes here,
 * ever: these are render-time blocks and query scoping only.
 *
 * 1. Practice-areas taxonomy archives list the articles CPT (they queried
 *    the empty default post type, so pillar links landed on "no results").
 * 2. Thin practice city pages open with the firms band and the map instead
 *    of bare text, and close with a link to the practice pillar.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Practice-areas term archives AND category archives must surface the
 * articles CPT (the /practice-areas/ URLs are category archives whose base
 * was rewritten; their default post-type query returned nothing, so pillar
 * links landed on empty pages).
 */
function justice_theme_practice_tax_archive_post_types( WP_Query $query ): void {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( ! $query->is_tax( 'practice-areas' ) && ! $query->is_category() ) {
		return;
	}
	$query->set( 'post_type', array( 'articles', 'post' ) );
	$query->set( 'posts_per_page', 12 );
}
add_action( 'pre_get_posts', 'justice_theme_practice_tax_archive_post_types', 20 );

/**
 * The encyclopedia domain terms were created with English slugs and no Hebrew
 * name, so WordPress fell back to printing the slug: "ארכיון civil-procedure".
 * Measured 2026-07-25: 14 of these are live and at least one is indexed, which
 * means a Hebrew searcher is shown an English slug in the result. These are the
 * standard Hebrew names of the legal domains, not invented labels.
 *
 * @return array<string,string>
 */
function justice_theme_encyclopedia_domain_names(): array {
	return array(
		'civil-procedure'         => 'סדר דין אזרחי',
		'consumer-law'            => 'דיני צרכנות',
		'contract-law'            => 'דיני חוזים',
		'corporate-law'           => 'דיני תאגידים',
		'criminal-law'            => 'משפט פלילי',
		'enforcement-insolvency'  => 'הוצאה לפועל וחדלות פירעון',
		'family-law'              => 'דיני משפחה',
		'immigration-citizenship' => 'הגירה ואזרחות',
		'labor-law'               => 'דיני עבודה',
		'legal-system'            => 'מערכת המשפט',
		'nezikin'                 => 'דיני נזיקין',
		'property-law'            => 'דיני קניין',
		'real-estate-planning'    => 'מקרקעין, תכנון ובנייה',
		'tax-law'                 => 'דיני מסים',
	);
}

/**
 * Archive headings speak the topic, not WordPress internals.
 */
function justice_theme_clean_archive_title( string $title ): string {
	$title = wp_strip_all_tags( $title );
	// The prefix comes in three shapes: "ארכיון:", a bare "ארכיון " with no
	// colon on taxonomy archives that have no label, and the taxonomy's own
	// singular name ("תחומי אנציקלופדיה:"). The original pattern matched only
	// the first, so the other two shipped straight to Google.
	$title = trim( preg_replace( '/^(קטגוריה|תגית|ארכיון|תחומי אנציקלופדיה|מונחים)\s*:?\s*/u', '', $title ) );

	$names = justice_theme_encyclopedia_domain_names();
	if ( isset( $names[ $title ] ) ) {
		$title = $names[ $title ];
	}
	return $title;
}
add_filter( 'get_the_archive_title', 'justice_theme_clean_archive_title', 20 );

/**
 * The same repair for the document title, which Yoast owns and which the
 * archive-heading filter never reaches.
 *
 * @param string $title Document title.
 * @return string
 */
function justice_theme_fix_domain_document_title( $title ) {
	if ( ! is_string( $title ) || is_admin() ) {
		return $title;
	}
	$term = get_queried_object();
	if ( ! ( $term instanceof WP_Term ) ) {
		return $title;
	}
	$names = justice_theme_encyclopedia_domain_names();
	if ( ! isset( $names[ $term->slug ] ) ) {
		return $title;
	}
	$hebrew = $names[ $term->slug ];
	return sprintf( '%s: מונחים והגדרות | Jus-Tice', $hebrew );
}
add_filter( 'wpseo_title', 'justice_theme_fix_domain_document_title', 20 );
add_filter( 'pre_get_document_title', 'justice_theme_fix_domain_document_title', 20 );

/**
 * Map a city-page slug to its practice term and pillar.
 *
 * @param string $slug Page slug.
 * @return array{term:string,pillar:string,label:string}|null
 */
function justice_theme_city_page_practice( string $slug ): ?array {
	if ( preg_match( '/^criminal-lawyer-[a-z-]+$/', $slug ) ) {
		return array(
			'term'   => 'criminal-law',
			'pillar' => '/criminal-defense-attorney/',
			'label'  => 'עורך דין פלילי',
		);
	}
	return null;
}

/**
 * Prepend the firms band + map to thin practice city pages, and append the
 * pillar link. Render-time only.
 */
function justice_theme_city_page_enrichment( ?string $content ): string {
	$content = (string) $content;
	if ( is_admin() ) {
		return $content;
	}
	// Flag-proof: ops early hooks corrupt is_page()/is_main_query() on pages,
	// so route by the queried object itself (same fix as the pillar router).
	$queried = get_queried_object();
	if ( ! ( $queried instanceof WP_Post ) || 'page' !== $queried->post_type || get_the_ID() !== $queried->ID ) {
		return $content;
	}
	$slug     = (string) $queried->post_name;
	$practice = justice_theme_city_page_practice( $slug );
	if ( null === $practice ) {
		return $content;
	}

	$top = '';

	$firms = function_exists( 'justice_theme_get_practice_firms' )
		? justice_theme_get_practice_firms( $practice['term'], 6 )
		: array();
	if ( count( $firms ) >= 3 ) {
		$top .= '<div class="city-page-firms"><p class="section-header__eyebrow">נבדקו ונמצאו מובילים</p><h2>משרדי עורכי דין מובילים בתחום</h2><ul class="city-page-firms__list">';
		foreach ( $firms as $firm ) {
			$top .= '<li><a href="' . esc_url( get_permalink( $firm ) ) . '">' . esc_html( $firm->post_title ) . '</a></li>';
		}
		$top .= '</ul></div>';
	}

	if ( function_exists( 'justice_cinema_block' ) ) {
		$top .= '<div class="city-page-map">' . justice_cinema_block( false ) . '</div>';
	}

	$bottom = '<p class="city-page-pillar-link">למדריך המלא: <a href="' . esc_url( home_url( $practice['pillar'] ) ) . '">' . esc_html( $practice['label'] ) . '</a>.</p>';

	// Text first (the blind-librarian law): the band and map come AFTER
	// the page's own text, in the lower upper fold, never above it.
	return $content . $top . $bottom;
}
add_filter( 'the_content', 'justice_theme_city_page_enrichment', 60 );

/**
 * Mid-article conversion strip for the articles CPT: CTA plus the map,
 * injected after the second H2 so the reader (and the librarian) meets
 * text first. Display-only.
 */
function justice_theme_article_midfold( ?string $content ): string {
	$content = (string) $content;
	if ( is_admin() || ! function_exists( 'justice_theme_inject_after_section' ) ) {
		return $content;
	}
	$queried = get_queried_object();
	if ( ! ( $queried instanceof WP_Post ) || 'articles' !== $queried->post_type || get_the_ID() !== $queried->ID ) {
		return $content;
	}
	$term  = function_exists( 'justice_theme_get_primary_practice_area' ) ? justice_theme_get_primary_practice_area( $queried->ID ) : null;
	$label = $term instanceof WP_Term ? trim( str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ' ), '', $term->name ) ) : '';
	// Pillar-class articles carry the registered band too (owner order:
	// these pages must match the full pillar standard).
	$pillar_articles = array(
		'labor-lawyer' => array( 'term' => 'labor-law', 'label' => 'דיני עבודה' ),
	);
	$band_html = '';
	if ( isset( $pillar_articles[ $queried->post_name ] ) && function_exists( 'justice_theme_registered_band_html' ) ) {
		$pa        = $pillar_articles[ $queried->post_name ];
		$band_html = justice_theme_registered_band_html( $pa['term'], $pa['label'] );
	}
	$strip  = '<div class="single-article__fold">' . $band_html;
	$strip .= '<div class="single-article__fold-cta">';
	$strip .= '<strong>' . esc_html( $label ? 'צריכים עורך דין ' . $label . '?' : 'צריכים עורך דין מתאים?' ) . '</strong> ';
	$strip .= '<a class="button button--gold" href="' . esc_url( home_url( '/#ask-lawyer' ) ) . '">' . esc_html__( 'השארת פנייה קצרה', 'justice-theme' ) . '</a> ';
	$strip .= '<a class="button button--ghost" href="' . esc_url( home_url( '/lawyers/' ) ) . '">' . esc_html__( 'חיפוש עורך דין לפי תחום ועיר', 'justice-theme' ) . '</a>';
	$strip .= '</div>';
	if ( function_exists( 'justice_cinema_block' ) ) {
		$strip .= justice_cinema_block( false );
	}
	$strip .= '</div>';
	return justice_theme_inject_after_section( $content, $strip );
}
add_filter( 'the_content', 'justice_theme_article_midfold', 12 );

/**
 * Titles keep their literal hyphen. wptexturize converts " - " into an en dash
 * in the H1, and the owner's standing order (2026-07-20) bans dash characters
 * site-wide. The Yoast <title> is unfiltered and was already safe; this brings
 * the visible H1 in line with it.
 */
remove_filter( 'the_title', 'wptexturize' );
