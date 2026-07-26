<?php
/**
 * The country silo: scoped navigation that turns 101 scattered pages into one
 * cluster.
 *
 * Modelled on the teardown of boaztaxes.com (2026-07-26), which ranks first on
 * "עורך דין יוון" with 896 words. Its three country pages each carry 126 to 127
 * internal links, 98 of them in a header menu, and they sit inside a tight
 * international-law cluster on a 219-URL site. The mechanism the research
 * credits is topical concentration, not the menu itself: a mega-menu spreads
 * link equity thinner, which is why this one is SCOPED. It renders only on the
 * 101 pages that belong to the cluster, so the equity stays inside it instead
 * of leaking across 2,827 unrelated URLs.
 *
 * We have 23 countries and 21 dedicated lawyer pages, a larger silo than his
 * entire site. What was missing was that they never referenced each other.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The silo: country label, its lead page, and the slug patterns that belong to it.
 *
 * @return array<string,array{label:string,lead:string,match:string}>
 */
function justice_theme_country_silo(): array {
	return array(
		'greece'       => array( 'label' => 'יוון',          'lead' => 'greece-lawyers',              'match' => 'greece|greek|athens' ),
		'cyprus'       => array( 'label' => 'קפריסין',       'lead' => 'cyprus-lawyer',               'match' => 'cyprus' ),
		'italy'        => array( 'label' => 'איטליה',        'lead' => 'italy-lawyers',               'match' => 'italy|italian' ),
		'usa'          => array( 'label' => 'ארצות הברית',   'lead' => 'usa-lawyers',                 'match' => 'usa|america|americas|new-york|florida|miami|manhattan' ),
		'portugal'     => array( 'label' => 'פורטוגל',       'lead' => 'portugal-lawyers',            'match' => 'portugal|portuguese|porto|lisbon' ),
		'uae'          => array( 'label' => 'דובאי ואיחוד האמירויות', 'lead' => 'united-arab-emirates-lawyers', 'match' => 'dubai|emirates|uae' ),
		'spain'        => array( 'label' => 'ספרד',          'lead' => 'spain-lawyers',               'match' => 'spain|spanish' ),
		'germany'      => array( 'label' => 'גרמניה',        'lead' => 'germany-lawyers',             'match' => 'germany|german' ),
		'uk'           => array( 'label' => 'בריטניה',       'lead' => 'uk-lawyer',                   'match' => 'united-kingdom|uk' ),
		'france'       => array( 'label' => 'צרפת',          'lead' => 'france-lawyers',              'match' => 'france|french' ),
		'malta'        => array( 'label' => 'מלטה',          'lead' => 'malta-lawyers',               'match' => 'malta' ),
		'romania'      => array( 'label' => 'רומניה',        'lead' => 'romania-lawyers',             'match' => 'romania|romanian' ),
		'thailand'     => array( 'label' => 'תאילנד',        'lead' => 'thailand-real-estate',        'match' => 'thailand' ),
		'australia'    => array( 'label' => 'אוסטרליה',      'lead' => 'australia-lawyers',           'match' => 'australia' ),
		'canada'       => array( 'label' => 'קנדה',          'lead' => 'canada-lawyers',              'match' => 'canada' ),
		'georgia'      => array( 'label' => 'גאורגיה',       'lead' => 'georgia-lawyers',             'match' => 'georgia' ),
		'hungary'      => array( 'label' => 'הונגריה',       'lead' => 'hungary-lawyer',              'match' => 'hungary' ),
		'china'        => array( 'label' => 'סין',           'lead' => 'china-lawyers',               'match' => 'china|chinese' ),
		'japan'        => array( 'label' => 'יפן',           'lead' => 'japan-attorneys',             'match' => 'japan' ),
		'india'        => array( 'label' => 'הודו',          'lead' => 'india-lawyers',               'match' => 'india' ),
		'brazil'       => array( 'label' => 'ברזיל',         'lead' => 'brazil-lawyers',              'match' => 'brazil' ),
		'argentina'    => array( 'label' => 'ארגנטינה',      'lead' => 'argentina-lawyers',           'match' => 'argentina' ),
		'south-africa' => array( 'label' => 'דרום אפריקה',   'lead' => 'south-african-property-law',  'match' => 'south-african' ),
	);
}

/**
 * Which country the current page belongs to, or '' when it is outside the silo.
 *
 * Matches on slug segments so that "agreement" cannot be read as Greece and
 * "digital" cannot be read as Italy, which is exactly what a naive substring
 * match did when the cluster was first mapped.
 *
 * @param string $slug Post slug.
 * @return string Silo key or empty string.
 */
function justice_theme_country_for_slug( string $slug ): string {
	if ( '' === $slug ) {
		return '';
	}
	foreach ( justice_theme_country_silo() as $key => $c ) {
		if ( preg_match( '/(^|-)(' . $c['match'] . ')(-|$)/i', $slug ) ) {
			return $key;
		}
	}
	return '';
}

/**
 * The silo parent. Supporting pages link up to it and it links back down, which
 * is the hierarchy the silo research calls for: children point at a category
 * page, the category page connects to the homepage, and lateral links stay
 * inside the cluster.
 */
const JUSTICE_SILO_PARENT_SLUG  = 'international-lawyers';
const JUSTICE_SILO_PARENT_LABEL = 'עורך דין בחו״ל';

/**
 * Render the silo navigation. Present country first, then the rest.
 *
 * @param string $current Silo key of the page being viewed.
 * @return string HTML.
 */
function justice_theme_country_silo_html( string $current, bool $is_parent = false ): string {
	$silo = justice_theme_country_silo();
	if ( ! $is_parent && ! isset( $silo[ $current ] ) ) {
		return '';
	}
	$here      = $is_parent ? '' : $silo[ $current ]['label'];
	$parent_url = home_url( '/' . JUSTICE_SILO_PARENT_SLUG . '/' );

	$html  = '<nav class="jt-silo" aria-label="' . esc_attr__( 'עורכי דין לפי מדינה', 'justice-theme' ) . '">';
	$html .= '<h2 class="jt-silo__title">' . esc_html( $is_parent ? 'עורך דין לפי מדינה' : sprintf( 'עורך דין ב%s, ובכל מדינה אחרת', $here ) ) . '</h2>';
	if ( $is_parent ) {
		$html .= '<p class="jt-silo__lede">' . esc_html__( 'לכל מדינה דין מקומי משלה, מרשם משלה וסכומים משלה. אלה העמודים לפי מדינה:', 'justice-theme' ) . '</p>';
	} else {
		$html .= '<p class="jt-silo__lede">' . esc_html__( 'ישראלים שרוכשים נכס, מקימים חברה או מסדירים אזרחות בחו״ל נתקלים באותן שאלות בכל מדינה, והתשובה משתנה לפי הדין המקומי. מה שזהה בכל המדינות מרוכז בעמוד ', 'justice-theme' )
			. '<a href="' . esc_url( $parent_url ) . '">' . esc_html( JUSTICE_SILO_PARENT_LABEL ) . '</a>'
			. esc_html__( ', ואלה העמודים לפי מדינה:', 'justice-theme' ) . '</p>';
	}
	$html .= '<ul class="jt-silo__list">';

	foreach ( $silo as $key => $c ) {
		$label = $c['label'];
		if ( $key === $current ) {
			$html .= '<li class="jt-silo__item jt-silo__item--current"><span aria-current="page">' . esc_html( $label ) . '</span></li>';
			continue;
		}
		$html .= '<li class="jt-silo__item"><a href="' . esc_url( home_url( '/' . $c['lead'] . '/' ) ) . '">'
			. esc_html( sprintf( 'עורך דין ב%s', $label ) ) . '</a></li>';
	}
	$html .= '</ul></nav>';
	return $html;
}

/**
 * The cluster menu that sits ABOVE the article, not inside it.
 *
 * This is the part of the boaztaxes shape that was still missing. His country
 * pages carry a header menu exposing the whole cluster on every page, so a
 * reader (and a crawler) meets the cluster before the copy. Ours is a
 * disclosure element so it costs no vertical space until it is opened, and it
 * renders only on the 101 cluster pages.
 *
 * @param string $current Silo key, or '' on the parent.
 * @return string HTML.
 */
function justice_theme_country_menu_html( string $current ): string {
	$silo = justice_theme_country_silo();
	$here = isset( $silo[ $current ] ) ? $silo[ $current ]['label'] : '';
	$label = $here ? sprintf( 'עורך דין ב%s ובעוד %d מדינות', $here, count( $silo ) - 1 )
		: sprintf( 'עורך דין ב%d מדינות', count( $silo ) );

	$html  = '<details class="jt-cmenu">';
	$html .= '<summary class="jt-cmenu__toggle">' . esc_html( $label ) . '</summary>';
	$html .= '<div class="jt-cmenu__panel">';
	$html .= '<a class="jt-cmenu__parent" href="' . esc_url( home_url( '/' . JUSTICE_SILO_PARENT_SLUG . '/' ) ) . '">'
		. esc_html( JUSTICE_SILO_PARENT_LABEL ) . '</a>';
	$html .= '<ul class="jt-cmenu__list">';
	foreach ( $silo as $key => $c ) {
		if ( $key === $current ) {
			$html .= '<li class="jt-cmenu__item jt-cmenu__item--current"><span aria-current="page">'
				. esc_html( $c['label'] ) . '</span></li>';
			continue;
		}
		$html .= '<li class="jt-cmenu__item"><a href="' . esc_url( home_url( '/' . $c['lead'] . '/' ) ) . '">'
			. esc_html( $c['label'] ) . '</a></li>';
	}
	$html .= '</ul></div></details>';
	return $html;
}

/**
 * Attach the silo to any page inside the cluster.
 *
 * @param string $content Post content.
 * @return string
 */
function justice_theme_append_country_silo( $content ) {
	if ( ! is_string( $content ) || is_admin() || ! is_singular() || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}
	if ( false !== strpos( $content, 'jt-silo__list' ) ) {
		return $content;
	}
	$slug = (string) get_post_field( 'post_name', get_the_ID() );

	// On the parent itself, print the full country grid with nothing marked
	// current, so the category page routes down to every child.
	if ( JUSTICE_SILO_PARENT_SLUG === $slug ) {
		return justice_theme_country_menu_html( '' ) . $content . justice_theme_country_silo_html( '', true );
	}

	$key = justice_theme_country_for_slug( $slug );
	if ( '' === $key ) {
		return $content;
	}
	return justice_theme_country_menu_html( $key ) . $content . justice_theme_country_silo_html( $key );
}
add_filter( 'the_content', 'justice_theme_append_country_silo', 26 );

/**
 * Breadcrumb hierarchy for the silo: Home > עורך דין בחו״ל > עורך דין ב[מדינה].
 *
 * The URLs cannot be reorganised into /international-lawyers/greece/ without
 * breaking live pages that already rank, so the parent-child relationship is
 * declared in schema instead. That is what tells Google the country pages are
 * children of one category rather than 23 unrelated pages.
 */
function justice_theme_country_silo_breadcrumbs(): void {
	if ( ! is_singular() ) {
		return;
	}
	$slug = (string) get_post_field( 'post_name', get_queried_object_id() );
	$key  = justice_theme_country_for_slug( $slug );
	if ( '' === $key || JUSTICE_SILO_PARENT_SLUG === $slug ) {
		return;
	}
	$silo = justice_theme_country_silo();
	if ( ! isset( $silo[ $key ] ) ) {
		return;
	}
	$items = array(
		array(
			'@type'    => 'ListItem',
			'position' => 1,
			'name'     => 'עמוד הבית',
			'item'     => home_url( '/' ),
		),
		array(
			'@type'    => 'ListItem',
			'position' => 2,
			'name'     => JUSTICE_SILO_PARENT_LABEL,
			'item'     => home_url( '/' . JUSTICE_SILO_PARENT_SLUG . '/' ),
		),
		array(
			'@type'    => 'ListItem',
			'position' => 3,
			'name'     => sprintf( 'עורך דין ב%s', $silo[ $key ]['label'] ),
			'item'     => get_permalink( get_queried_object_id() ),
		),
	);
	echo '<script type="application/ld+json" id="jt-silo-breadcrumb">'
		. wp_json_encode(
			array(
				'@context'        => 'https://schema.org',
				'@type'           => 'BreadcrumbList',
				'@id'             => get_permalink( get_queried_object_id() ) . '#silo-breadcrumb',
				'itemListElement' => $items,
			),
			JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
		)
		. '</script>';
}
add_action( 'wp_head', 'justice_theme_country_silo_breadcrumbs', 31 );

/**
 * Silo styles. Inlined at the point of use so no extra request is made.
 */
function justice_theme_country_silo_css(): void {
	if ( ! is_singular() ) {
		return;
	}
	$slug = (string) get_post_field( 'post_name', get_queried_object_id() );
	// The parent is not a country, so the country lookup returns empty for it.
	// Without this it rendered the grid as an unstyled bullet list.
	if ( '' === justice_theme_country_for_slug( $slug ) && JUSTICE_SILO_PARENT_SLUG !== $slug ) {
		return;
	}
	echo '<style id="jt-silo-css">'
		. '.jt-silo{border:1px solid #e6e6ea;border-radius:12px;padding:18px 20px;margin:28px 0;background:#fff;direction:rtl}'
		. '.jt-silo .jt-silo__title{margin:0 0 8px!important;font-size:1.1rem!important;color:#0d2149!important;line-height:1.35!important}'
		. '.jt-silo .jt-silo__lede{margin:0 0 12px!important;font-size:.9rem!important;color:#3d4149!important;line-height:1.7!important}'
		. '.jt-silo__list{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin:0;padding:0;list-style:none}'
		. '.jt-silo__item{margin:0}'
		. '.jt-silo__item a,.jt-silo__item span{display:block;padding:9px 12px;border:1px solid #e6e6ea;border-radius:8px;'
		. 'font-size:.92rem;text-decoration:none;color:#0d2149;background:#fff}'
		. '.jt-silo__item a:hover{border-color:#c9a227;background:#faf8f2}'
		. '.jt-silo__item--current span{background:#0d2149;color:#fff;border-color:#0d2149;font-weight:700}'
		. '@media(max-width:520px){.jt-silo__list{grid-template-columns:1fr 1fr}}'
		. '.jt-cmenu{border:1px solid #e6e6ea;border-radius:10px;margin:0 0 20px;background:#fff;direction:rtl;overflow:hidden}'
		. '.jt-cmenu__toggle{cursor:pointer;padding:12px 16px;font-weight:700;font-size:.95rem;color:#0d2149;background:#faf8f2;list-style:none}'
		. '.jt-cmenu__toggle::-webkit-details-marker{display:none}'
		. '.jt-cmenu__toggle::after{content:"\25bc";float:left;font-size:.7em;opacity:.6}'
		. '.jt-cmenu[open] .jt-cmenu__toggle::after{content:"\25b2"}'
		. '.jt-cmenu__panel{padding:12px 16px 16px;border-top:1px solid #e6e6ea}'
		. '.jt-cmenu__parent{display:inline-block;margin-bottom:10px;padding:7px 13px;border-radius:7px;'
		. 'background:#0d2149;color:#fff!important;text-decoration:none;font-weight:700;font-size:.9rem}'
		. '.jt-cmenu__list{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin:0;padding:0;list-style:none}'
		. '.jt-cmenu__item a,.jt-cmenu__item span{display:block;padding:7px 10px;border:1px solid #e6e6ea;border-radius:6px;'
		. 'font-size:.86rem;text-decoration:none;color:#0d2149;background:#fff}'
		. '.jt-cmenu__item a:hover{border-color:#c9a227;background:#faf8f2}'
		. '.jt-cmenu__item--current span{background:#0d2149;color:#fff;border-color:#0d2149;font-weight:700}'
		. '</style>';
}
add_action( 'wp_head', 'justice_theme_country_silo_css', 30 );
