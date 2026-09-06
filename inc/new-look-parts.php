<?php
/**
 * New look (v3): data and helpers shared by the look3 partials.
 *
 * Every link here resolves against published content first. A slug that is
 * not live is skipped, never emitted. Labels for practice areas follow the
 * language bank of the top-ranking Israeli legal sites (docs/design/
 * LANGUAGE-BANK-2026-09-03-HE.md): "תחומי עיסוק", "צוואות וירושות",
 * "הסכמים וטפסים", "אבחון משפטי ראשוני".
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolve the first published slug of a candidate list to a URL and title.
 *
 * @param string[] $slugs    Candidate slugs, best first.
 * @param string   $fallback Optional path or URL used when nothing resolves.
 * @return array{url:string,title:string}|null
 */
function justice_theme_look3_resolve( array $slugs, string $fallback = '' ): ?array {
	foreach ( $slugs as $slug ) {
		$slug = trim( (string) $slug, "/ \t\n\r" );

		if ( '' === $slug ) {
			continue;
		}

		if ( function_exists( 'justice_theme_cluster_resolve_target' ) ) {
			$hit = justice_theme_cluster_resolve_target( $slug );

			if ( $hit ) {
				return $hit;
			}

			continue;
		}

		foreach ( array( 'page', 'post', 'articles' ) as $post_type ) {
			if ( ! post_type_exists( $post_type ) ) {
				continue;
			}

			$post = get_page_by_path( $slug, OBJECT, $post_type );

			if ( $post instanceof WP_Post && 'publish' === get_post_status( $post ) ) {
				return array(
					'url'   => (string) get_permalink( $post->ID ),
					'title' => get_the_title( $post->ID ),
				);
			}
		}
	}

	if ( '' !== $fallback ) {
		$url = preg_match( '#^https?://#i', $fallback ) ? $fallback : home_url( $fallback );

		return array(
			'url'   => $url,
			'title' => '',
		);
	}

	return null;
}

/**
 * Lawyer directory archive URL (always exists).
 *
 * @return string
 */
function justice_theme_look3_directory_url(): string {
	$archive = get_post_type_archive_link( 'justice_lawyer' );

	return $archive ? (string) $archive : home_url( '/lawyers/' );
}

/**
 * Practice areas in the order the portal presents them. Each entry carries
 * the head term as label, the pillar slug candidates, a directory fallback,
 * and the curated spoke candidates for the mega menu (real titles are used
 * as anchors at render time, never these keys).
 *
 * @return array<string,array{label:string,short:string,pillars:string[],area:string,spokes:array<int,string[]>}>
 */
function justice_theme_look3_areas(): array {
	return array(
		'family-law'          => array(
			'label'   => 'עורך דין גירושין',
			'short'   => 'גירושין',
			'pillars' => array( 'divorce-lawyer', 'family-law' ),
			'area'    => 'family-law',
			'spokes'  => array(
				array( 'free-divorce-agreement-template', 'mutual-divorce-agreement-2025' ),
				array( 'child-support-alimony-updated-guidelines-2023', 'alimony-israel', 'child-support' ),
				array( 'joint-custody-shared-parenting', 'child-custody', 'what-is-child-custody' ),
				array( 'property-division-divorce', 'divorce-property-division', 'marital-property-agreement' ),
				array( 'divorce-costs-2025' ),
			),
		),
		'criminal-law'        => array(
			'label'   => 'עורך דין פלילי',
			'short'   => 'פלילי',
			'pillars' => array( 'criminal-defense-attorney', 'criminal-law' ),
			'area'    => 'criminal-law',
			'spokes'  => array(
				array( 'hearing-before-indictment' ),
				array( 'criminal-indictment-cancellation-withdrawal-israel' ),
				array( 'police-records-data-deletion' ),
				array( 'drug-related-crime' ),
				array( 'how-much-will-a-criminal-defense-lawyer-cost', 'criminal-law-price-list-lawyer-recommended-review-costs' ),
				array( 'sex-crime-lawyer' ),
			),
		),
		'real-estate'         => array(
			'label'   => 'עורך דין מקרקעין ונדל"ן',
			'short'   => 'מקרקעין',
			'pillars' => array( 'real-estate-attorney', 'real-estate-lawyer-guide' ),
			'area'    => 'real-estate-law',
			'spokes'  => array(
				array( 'lawyer-for-buying-or-selling-a-house' ),
				array( 'online-rent-agreement', 'rental-agreement-guide', 'rental-agreement' ),
				array( 'registration-of-real-estate-israel' ),
				array( 'land-appreciation-tax' ),
				array( 'real-estate-lawyer-cost-2025' ),
			),
		),
		'medical-malpractice' => array(
			'label'   => 'עורך דין רשלנות רפואית',
			'short'   => 'רשלנות רפואית',
			'pillars' => array( 'medical-malpractice-lawyer' ),
			'area'    => 'medical-malpractice-law',
			'spokes'  => array(
				array( 'what-is-medical-malpractice-definition-examples' ),
				array( 'cerebral-palsy', 'malpractice-cerebral-palsy' ),
				array( 'anesthesia-medical-malpractice' ),
				array( 'medical-malpractice-common-errors-doctors-hospitals' ),
			),
		),
		'inheritance'         => array(
			'label'   => 'עורך דין צוואות וירושות',
			'short'   => 'צוואות וירושות',
			'pillars' => array( 'inheritance-lawyer' ),
			'area'    => 'inheritance-law',
			'spokes'  => array(
				array( 'what-is-a-probate-order' ),
				array( 'inheritance-order' ),
				array( 'will-probate-objection' ),
				array( 'inheritance-dispute' ),
				array( 'will-and-testament' ),
				array( 'inheritance' ),
			),
		),
		'employment'          => array(
			'label'   => 'עורך דין דיני עבודה',
			'short'   => 'דיני עבודה',
			'pillars' => array( 'labor-lawyer' ),
			'area'    => 'labor-law',
			'spokes'  => array(
				array( 'employment-contract' ),
				array( 'wrongful-termination-israel' ),
				array( 'severance-pay-calculator' ),
				array( 'employer-worker-relationship' ),
				array( 'minimum-wage-israel-2025' ),
			),
		),
		'personal-injury'     => array(
			'label'   => 'עורך דין נזיקין ותאונות',
			'short'   => 'נזיקין',
			'pillars' => array( 'personal-injury-law', 'tort-lawyer' ),
			'area'    => 'personal-injury-law',
			'spokes'  => array(
				array( 'israel-road-accident-compensation-law' ),
				array( 'car-accident-auto-injury-lawyer' ),
				array( 'tort-lawyer' ),
				array( 'bituach-leumi-appeal-guide' ),
			),
		),
		'traffic-law'         => array(
			'label'   => 'עורך דין תעבורה',
			'short'   => 'תעבורה',
			'pillars' => array( 'traffic-lawyer' ),
			'area'    => 'traffic-law',
			'spokes'  => array(
				array( 'speeding', 'speeding-ticket-guide' ),
				array( 'driving-under-the-influence', 'driving-under-influence' ),
				array( 'dui-refusal-blood-breath-urine-test' ),
				array( 'driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license' ),
			),
		),
		'immigration'         => array(
			'label'   => 'עורך דין הגירה ואזרחות',
			'short'   => 'הגירה ואזרחות',
			'pillars' => array( 'immigration-lawyer' ),
			'area'    => 'immigration-law',
			'spokes'  => array(
				array( 'german-passport' ),
				array( 'romanian-passport' ),
				array( 'golden-visa' ),
			),
		),
		'tax'                 => array(
			'label'   => 'עורך דין מיסים',
			'short'   => 'מיסים',
			'pillars' => array( 'tax-lawyer', 'israel-tax-authority' ),
			'area'    => 'tax-law',
			'spokes'  => array(
				array( 'tax-investigation-guide' ),
				array( 'tax-evasion-defense' ),
				array( 'israel-tax-authority' ),
			),
		),
	);
}

/**
 * Resolved pillar URL for one area (live pillar, else the directory filter).
 *
 * @param array $area One entry of justice_theme_look3_areas().
 * @return string
 */
function justice_theme_look3_area_url( array $area ): string {
	$hit = justice_theme_look3_resolve( $area['pillars'] );

	if ( $hit ) {
		return $hit['url'];
	}

	return add_query_arg( 'area', $area['area'], justice_theme_look3_directory_url() );
}

/**
 * Head-term links for the topics bar and the footer (first eight areas).
 *
 * @param int $limit Max items.
 * @return array<int,array{label:string,url:string}>
 */
function justice_theme_look3_topics( int $limit = 8 ): array {
	$items = array();

	foreach ( justice_theme_look3_areas() as $area ) {
		if ( count( $items ) >= $limit ) {
			break;
		}

		$items[] = array(
			'label' => $area['label'],
			'url'   => justice_theme_look3_area_url( $area ),
		);
	}

	return $items;
}

/**
 * The first-assessment tool link ("אבחון משפטי ראשוני").
 *
 * @return string
 */
function justice_theme_look3_triage_url(): string {
	if ( function_exists( 'justice_theme_safe_public_link' ) ) {
		return justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/legal-tools/' );
	}

	return home_url( '/legal-tools/' );
}

/**
 * Primary navigation for the new look. Code-defined so labels follow the
 * language bank; the CMS menu keeps serving the classic look.
 *
 * @return array<int,array{label:string,url:string,mega?:bool}>
 */
function justice_theme_look3_nav_items(): array {
	$documents  = justice_theme_look3_resolve( array( 'legal-documents', 'legal-tools' ), '/legal-tools/' );
	$simulation = justice_theme_look3_resolve( array( 'legal-simulation' ), 'https://jus-tice.com/' );

	return array(
		array(
			'label' => __( 'עורכי דין', 'justice-theme' ),
			'url'   => justice_theme_look3_directory_url(),
		),
		array(
			'label' => __( 'תחומי עיסוק', 'justice-theme' ),
			'url'   => home_url( '/#practice-areas' ),
			'mega'  => true,
		),
		array(
			'label' => __( 'לפי עיר', 'justice-theme' ),
			'url'   => home_url( '/#cities' ),
		),
		array(
			'label' => __( 'מדריכים משפטיים', 'justice-theme' ),
			'url'   => home_url( '/articles/' ),
		),
		array(
			'label' => __( 'הסכמים וטפסים', 'justice-theme' ),
			'url'   => $documents ? $documents['url'] : home_url( '/legal-tools/' ),
		),
		array(
			'label' => __( 'סימולציית בית משפט', 'justice-theme' ),
			'url'   => $simulation ? $simulation['url'] : 'https://jus-tice.com/',
		),
		array(
			'label' => __( 'לעורכי דין', 'justice-theme' ),
			'url'   => home_url( '/lawyer-plans/' ),
		),
	);
}

/**
 * City pages that are actually published.
 *
 * @param int $limit Max items.
 * @return array<int,array{city:string,label:string,url:string}>
 */
function justice_theme_look3_cities( int $limit = 8 ): array {
	$candidates = array(
		'תל אביב'     => array( 'lawyers-tel-aviv' ),
		'ירושלים'     => array( 'lawyers-jerusalem' ),
		'חיפה'        => array( 'lawyers-haifa' ),
		'באר שבע'     => array( 'lawyers-beer-sheva' ),
		'ראשון לציון' => array( 'lawyers-rishon-lezion' ),
		'פתח תקווה'   => array( 'lawyers-petah-tikva', 'lawyers-petach-tikva' ),
		'נתניה'       => array( 'lawyers-netanya' ),
		'אשדוד'       => array( 'lawyers-ashdod' ),
		'חולון'       => array( 'lawyers-holon' ),
		'רמת גן'      => array( 'lawyers-ramat-gan' ),
		'בני ברק'     => array( 'lawyers-bnei-brak' ),
		'אשקלון'      => array( 'lawyers-ashkelon' ),
	);

	$items = array();

	foreach ( $candidates as $city => $slugs ) {
		if ( count( $items ) >= $limit ) {
			break;
		}

		$hit = justice_theme_look3_resolve( $slugs );

		if ( ! $hit ) {
			continue;
		}

		$items[] = array(
			'city'  => $city,
			/* translators: %s: city name. */
			'label' => sprintf( __( 'עורכי דין ב%s', 'justice-theme' ), $city ),
			'url'   => $hit['url'],
		);
	}

	return $items;
}

/**
 * Agreements, forms and calculators that already rank. Real titles as anchors.
 *
 * @param int $limit Max items.
 * @return array<int,array{kind:string,title:string,url:string}>
 */
function justice_theme_look3_tools( int $limit = 6 ): array {
	$candidates = array(
		array( 'חוזה', array( 'online-rent-agreement', 'rental-agreement-guide' ) ),
		array( 'הסכם', array( 'free-divorce-agreement-template' ) ),
		array( 'מחירון', array( 'lawyer-fees-tariff' ) ),
		array( 'מדריך', array( 'apply-for-police-criminal-information-certificates' ) ),
		array( 'מידע', array( 'lahav-433' ) ),
		array( 'מחשבון', array( 'severance-pay-calculator' ) ),
		array( 'מחולל', array( 'demand-letter-generator' ) ),
		array( 'טופס', array( 'parking-ticket-appeal-generator' ) ),
		array( 'מחשבון', array( 'small-claims-fee-calculator' ) ),
	);

	$items = array();

	foreach ( $candidates as $candidate ) {
		if ( count( $items ) >= $limit ) {
			break;
		}

		$hit = justice_theme_look3_resolve( $candidate[1] );

		if ( ! $hit || '' === $hit['title'] ) {
			continue;
		}

		$items[] = array(
			'kind'  => $candidate[0],
			'title' => wp_trim_words( $hit['title'], 9, '' ),
			'url'   => $hit['url'],
		);
	}

	return $items;
}

/**
 * Situational picker for the hero aside: plain-language situation, head term, live target.
 *
 * @return array<int,array{situation:string,label:string,url:string}>
 */
function justice_theme_look3_situations(): array {
	$areas = justice_theme_look3_areas();
	$rows  = array(
		array( 'family-law', __( 'מתגרשים, או חלוקים על מזונות ומשמורת', 'justice-theme' ) ),
		array( 'criminal-law', __( 'זומנתם לחקירה, או קיבלתם כתב אישום', 'justice-theme' ) ),
		array( 'real-estate', __( 'קונים או מוכרים דירה', 'justice-theme' ) ),
		array( 'medical-malpractice', __( 'נזק רפואי בניתוח, בלידה או באבחון', 'justice-theme' ) ),
		array( 'employment', __( 'פוטרתם, או לא קיבלתם את השכר', 'justice-theme' ) ),
		array( 'inheritance', __( 'צו ירושה, צוואה או סכסוך בין יורשים', 'justice-theme' ) ),
	);

	$items = array();

	foreach ( $rows as $row ) {
		if ( ! isset( $areas[ $row[0] ] ) ) {
			continue;
		}

		$area    = $areas[ $row[0] ];
		$items[] = array(
			'situation' => $row[1],
			'label'     => $area['label'],
			'url'       => justice_theme_look3_area_url( $area ),
		);
	}

	return $items;
}

/**
 * Published guide count (articles + posts).
 *
 * @return int
 */
function justice_theme_look3_guides_total(): int {
	$total = 0;

	foreach ( array( 'articles', 'post' ) as $post_type ) {
		if ( ! post_type_exists( $post_type ) ) {
			continue;
		}

		$counts = wp_count_posts( $post_type );
		$total += isset( $counts->publish ) ? (int) $counts->publish : 0;
	}

	return $total;
}

/**
 * Sub-topic line for a practice-area term: real child terms first, curated fallback.
 *
 * @param WP_Term $term Practice-area term.
 * @return string
 */
function justice_theme_look3_area_subterms( WP_Term $term ): string {
	$children = get_terms(
		array(
			'taxonomy'   => $term->taxonomy,
			'parent'     => $term->term_id,
			'hide_empty' => true,
			'number'     => 4,
			'orderby'    => 'count',
			'order'      => 'DESC',
		)
	);

	if ( ! empty( $children ) && ! is_wp_error( $children ) ) {
		return implode( ' · ', wp_list_pluck( $children, 'name' ) );
	}

	$curated = array(
		'family-law'              => 'הסכם גירושין · מזונות · הסכם ממון · משמורת וזמני שהות',
		'criminal-law'            => 'חקירה במשטרה · מעצר · שימוע · ביטול כתב אישום',
		'real-estate-law'         => 'קנייה ומכירת דירה · מיסוי מקרקעין · חוזה שכירות · רישום בטאבו',
		'medical-malpractice-law' => 'רשלנות בניתוח · רשלנות בלידה · אבחון מאוחר · הוכחת התרשלות',
		'medical-malpractice'     => 'רשלנות בניתוח · רשלנות בלידה · אבחון מאוחר · הוכחת התרשלות',
		'inheritance-law'         => 'צו ירושה · צו קיום צוואה · התנגדות לצוואה · סכסוכי ירושה',
		'labor-law'               => 'פיטורים · שימוע · זכויות עובדים · הלנת שכר',
		'personal-injury-law'     => 'תאונות דרכים · תאונות עבודה · נזקי גוף · ביטוח לאומי',
		'torts'                   => 'תאונות דרכים · תאונות עבודה · נזקי גוף · ביטוח לאומי',
		'traffic-law'             => 'שלילת רישיון · נקודות · נהיגה בשכרות · תאונה עם נפגעים',
		'immigration-law'         => 'אזרחות ודרכון זר · אשרות שהייה · איחוד משפחות',
		'tax-law'                 => 'חקירת מס הכנסה · מיסוי מקרקעין · גילוי מרצון',
	);

	return isset( $curated[ $term->slug ] ) ? $curated[ $term->slug ] : '';
}

/**
 * Prebuilt mega menu for the new look: one column per practice area with the
 * live pillar and up to four live spokes (real titles), plus a side rail of
 * city pages and agreements/forms. Cached six hours; cleared on save_post.
 *
 * @return string
 */
function justice_theme_look3_mega_menu_html(): string {
	$cache_key = 'justice_look3_mega_v1';
	$cached    = get_transient( $cache_key );

	if ( is_string( $cached ) && '' !== $cached ) {
		return $cached;
	}

	$cols = '';

	foreach ( justice_theme_look3_areas() as $area ) {
		$pillar = justice_theme_look3_resolve( $area['pillars'] );
		$links  = '';
		$count  = 0;

		foreach ( $area['spokes'] as $spoke_candidates ) {
			if ( $count >= 4 ) {
				break;
			}

			$spoke = justice_theme_look3_resolve( $spoke_candidates );

			if ( ! $spoke || '' === $spoke['title'] ) {
				continue;
			}

			$links .= '<a href="' . esc_url( $spoke['url'] ) . '">' . esc_html( wp_trim_words( $spoke['title'], 6, '' ) ) . '</a>';
			$count++;
		}

		if ( ! $pillar && '' === $links ) {
			continue;
		}

		$head_url = $pillar ? $pillar['url'] : justice_theme_look3_area_url( $area );
		$cols    .= '<div class="l3-mega__col"><a class="l3-mega__head" href="' . esc_url( $head_url ) . '">' . esc_html( $area['label'] ) . '</a>' . $links . '</div>';
	}

	if ( '' === $cols ) {
		return '';
	}

	$rail = '';

	$cities = justice_theme_look3_cities( 8 );
	if ( $cities ) {
		$chips = '';
		foreach ( $cities as $city ) {
			$chips .= '<a href="' . esc_url( $city['url'] ) . '">' . esc_html( $city['city'] ) . '</a>';
		}
		$rail .= '<div class="l3-mega__rail-block"><strong>' . esc_html__( 'עורכי דין לפי עיר', 'justice-theme' ) . '</strong><div class="l3-mega__chips">' . $chips . '</div></div>';
	}

	$tools = justice_theme_look3_tools( 4 );
	if ( $tools ) {
		$tool_links = '';
		foreach ( $tools as $tool ) {
			$tool_links .= '<a href="' . esc_url( $tool['url'] ) . '">' . esc_html( $tool['title'] ) . '</a>';
		}
		$rail .= '<div class="l3-mega__rail-block"><strong>' . esc_html__( 'הסכמים וטפסים', 'justice-theme' ) . '</strong>' . $tool_links . '</div>';
	}

	$rail .= '<div class="l3-mega__rail-block"><a class="l3-mega__triage" href="' . esc_url( justice_theme_look3_triage_url() ) . '">' . esc_html__( 'אבחון משפטי ראשוני', 'justice-theme' ) . '</a></div>';

	$html = '<div class="l3-mega" id="l3-mega" role="region" aria-label="' . esc_attr__( 'כל תחומי העיסוק', 'justice-theme' ) . '" hidden>'
		. '<div class="l3-mega__inner">'
		. '<div class="l3-mega__cols">' . $cols . '</div>'
		. '<aside class="l3-mega__rail">' . $rail . '</aside>'
		. '</div>'
		. '<div class="l3-mega__foot"><a href="' . esc_url( justice_theme_look3_directory_url() ) . '">' . esc_html__( 'חיפוש לפי תחום ועיר ←', 'justice-theme' ) . '</a></div>'
		. '</div>';

	set_transient( $cache_key, $html, 6 * HOUR_IN_SECONDS );

	return $html;
}

add_action(
	'save_post',
	function () {
		delete_transient( 'justice_look3_mega_v1' );
	}
);

/**
 * Echo a look3 mega menu trigger button (shared by the nav and the topics bar).
 *
 * @param string $label Button text.
 * @param string $class Extra class.
 */
function justice_theme_look3_mega_trigger( string $label, string $class = '' ): void {
	echo '<button type="button" class="l3-mega-trigger ' . esc_attr( $class ) . '" data-l3-mega-toggle aria-expanded="false" aria-controls="l3-mega">'
		. esc_html( $label )
		. ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>'
		. '</button>';
}
