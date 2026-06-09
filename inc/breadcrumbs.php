<?php
/**
 * Breadcrumbs.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render breadcrumbs with Schema.org markup.
 */
function justice_theme_breadcrumbs() {
	if ( is_front_page() ) {
		return;
	}

	$items = justice_theme_get_breadcrumb_items();

	if ( empty( $items ) ) {
		return;
	}

	$item_count = count( $items );
	?>
	<nav class="breadcrumbs" aria-label="<?php esc_attr_e( 'שביל ניווט', 'justice-theme' ); ?>" data-breadcrumb-depth="<?php echo esc_attr( (string) $item_count ); ?>">
		<ol class="container breadcrumbs__list">
			<?php foreach ( $items as $index => $item ) : ?>
				<?php
				$is_first   = 0 === $index;
				$is_current = $index === $item_count - 1;
				$classes    = array( 'breadcrumbs__item' );

				if ( $is_first ) {
					$classes[] = 'breadcrumbs__item--home';
				}

				if ( $is_current ) {
					$classes[] = 'breadcrumbs__item--current';
				}
				?>
				<li class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
					<?php if ( ! empty( $item['url'] ) && ! $is_current ) : ?>
						<a class="breadcrumbs__link" href="<?php echo esc_url( $item['url'] ); ?>">
							<?php if ( $is_first ) : ?>
								<span class="breadcrumbs__home-mark" aria-hidden="true"></span>
							<?php endif; ?>
							<span class="breadcrumbs__text"><?php echo esc_html( $item['name'] ); ?></span>
						</a>
					<?php else : ?>
						<span class="breadcrumbs__current" aria-current="page">
							<span class="breadcrumbs__text"><?php echo esc_html( $item['name'] ); ?></span>
						</span>
					<?php endif; ?>
				</li>
			<?php endforeach; ?>
		</ol>
	</nav>
	<?php

	if ( function_exists( 'justice_theme_print_breadcrumb_schema' ) ) {
		justice_theme_print_breadcrumb_schema( $items );
	}
}

/**
 * Get the practice config slug for a controlled virtual practice route.
 *
 * @return string
 */
function justice_theme_get_controlled_practice_breadcrumb_slug(): string {
	if ( ! function_exists( 'justice_theme_practice_landing_request_path' ) ) {
		return '';
	}

	$request_path = justice_theme_practice_landing_request_path();
	$route_map    = array(
		'/family-law/'                 => 'family-law',
		'/medical-malpractice-lawyer/' => 'medical-malpractice',
		'/real-estate-lawyer-guide/'   => 'real-estate-law',
		'/inheritance-lawyer/'         => 'inheritance',
	);

	return isset( $route_map[ $request_path ] ) ? $route_map[ $request_path ] : '';
}

/**
 * Build breadcrumbs for controlled virtual practice routes before query fallbacks.
 *
 * @param array $base_items Home breadcrumb item.
 * @return array
 */
function justice_theme_get_controlled_practice_breadcrumb_items( array $base_items ): array {
	$practice_slug = justice_theme_get_controlled_practice_breadcrumb_slug();

	if ( '' === $practice_slug || ! function_exists( 'justice_theme_get_practice_landing_config' ) ) {
		return array();
	}

	$config = justice_theme_get_practice_landing_config( $practice_slug );
	if ( empty( $config['title'] ) ) {
		return array();
	}

	$base_items[] = array(
		'name' => (string) $config['title'],
		'url'  => '',
	);

	return $base_items;
}

/**
 * Remove stale SEO-plugin BreadcrumbList schema on controlled practice routes.
 *
 * Yoast may build breadcrumbs from the underlying queried object before the
 * controlled route template renders. The theme prints a controlled BreadcrumbList
 * from the route config, so stale plugin BreadcrumbList nodes are removed only
 * for these virtual money routes.
 *
 * @param array $graph Schema graph.
 * @return array
 */
function justice_theme_filter_controlled_practice_yoast_breadcrumb_schema( $graph ): array {
	if ( '' === justice_theme_get_controlled_practice_breadcrumb_slug() || ! is_array( $graph ) ) {
		return is_array( $graph ) ? $graph : array();
	}

	return array_values(
		array_filter(
			$graph,
			static function ( $piece ): bool {
				if ( ! is_array( $piece ) ) {
					return true;
				}

				$types = isset( $piece['@type'] ) ? (array) $piece['@type'] : array();

				return ! in_array( 'BreadcrumbList', $types, true );
			}
		)
	);
}
add_filter( 'wpseo_schema_graph', 'justice_theme_filter_controlled_practice_yoast_breadcrumb_schema', PHP_INT_MAX );

/**
 * Build breadcrumb items array.
 *
 * @return array
 */
function justice_theme_get_breadcrumb_items() {
	$items = array(
		array(
			'name' => __( 'עמוד הבית', 'justice-theme' ),
			'url'  => justice_theme_public_url( home_url( '/' ) ),
		),
	);

	if ( justice_theme_is_html_sitemap_request() ) {
		$items[] = array(
			'name' => __( 'מפת אתר', 'justice-theme' ),
			'url'  => '',
		);

		return $items;
	}

	$controlled_practice_items = justice_theme_get_controlled_practice_breadcrumb_items( $items );
	if ( ! empty( $controlled_practice_items ) ) {
		return $controlled_practice_items;
	}

	if ( is_singular( 'articles' ) ) {
		$items[] = array(
			'name' => __( 'מאמרים משפטיים', 'justice-theme' ),
			'url'  => justice_theme_public_url( (string) get_post_type_archive_link( 'articles' ) ),
		);

		// Prefer the explicit GSC-derived cluster pillar over the practice-area term,
		// so the breadcrumb hierarchy matches the data-driven topology.
		$explicit = function_exists( 'justice_theme_cluster_pillar_crumb' )
			? justice_theme_cluster_pillar_crumb( (int) get_the_ID() )
			: null;

		if ( $explicit ) {
			$items[] = $explicit;
		} else {
			$terms = get_the_terms( get_the_ID(), 'practice-areas' );
			if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
				$term    = array_shift( $terms );
				$items[] = array(
					'name' => $term->name,
					'url'  => justice_theme_public_term_link( $term ),
				);
			}
		}

		$items[] = array(
			'name' => get_the_title(),
			'url'  => '',
		);

		return $items;
	}

	if ( is_singular( 'justice_lawyer' ) ) {
		$items[] = array(
			'name' => __( 'עורכי דין', 'justice-theme' ),
			'url'  => justice_theme_public_url( (string) get_post_type_archive_link( 'justice_lawyer' ) ),
		);

		$areas = get_the_terms( get_the_ID(), 'practice-areas' );
		if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
			$area    = array_shift( $areas );
			$items[] = array(
				'name' => $area->name,
				'url'  => justice_theme_public_url( (string) add_query_arg( 'area', $area->slug, get_post_type_archive_link( 'justice_lawyer' ) ) ),
			);
		}

		$items[] = array(
			'name' => get_the_title(),
			'url'  => '',
		);

		return $items;
	}

	if ( is_tax( 'practice-areas' ) ) {
		$items[] = array(
			'name' => __( 'תחומי משפט', 'justice-theme' ),
			'url'  => justice_theme_public_url( (string) get_post_type_archive_link( 'justice_lawyer' ) ),
		);

		$items[] = array(
			'name' => single_term_title( '', false ),
			'url'  => '',
		);

		return $items;
	}

	if ( is_post_type_archive( 'articles' ) ) {
		$items[] = array(
			'name' => __( 'מאמרים משפטיים', 'justice-theme' ),
			'url'  => '',
		);

		return $items;
	}

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		$items[] = array(
			'name' => __( 'עורכי דין', 'justice-theme' ),
			'url'  => '',
		);

		return $items;
	}

	if ( is_search() ) {
		$items[] = array(
			'name' => sprintf(
				/* translators: %s: search query. */
				__( 'תוצאות חיפוש: %s', 'justice-theme' ),
				get_search_query()
			),
			'url'  => '',
		);

		return $items;
	}

	if ( is_404() ) {
		$items[] = array(
			'name' => __( 'העמוד לא נמצא', 'justice-theme' ),
			'url'  => '',
		);

		return $items;
	}

	if ( is_page() || is_single() ) {
		$post_id = get_queried_object_id();
		$title   = trim( wp_strip_all_tags( get_the_title() ) );
		if ( '' === $title ) {
			$title = justice_theme_get_fallback_breadcrumb_name();
		}

		$page_slug = get_post_field( 'post_name', $post_id );

		// 1) Try the GSC-derived explicit cluster map first (cannibalization-aware,
		//    overrides the regex for the 3 documented anti-cannibalization cases).
		$explicit = function_exists( 'justice_theme_cluster_pillar_crumb' )
			? justice_theme_cluster_pillar_crumb( (int) $post_id )
			: null;

		if ( $explicit ) {
			$items[] = $explicit;
		} else {
			// 2) Fall back to the regex/pattern resolver for slugs not in the explicit map.
			$pillar = justice_theme_resolve_pillar_for_slug( (string) $page_slug );
			if ( $pillar ) {
				$items[] = array(
					'name' => $pillar['name'],
					'url'  => justice_theme_public_url( home_url( $pillar['url'] ) ),
				);
			}
		}

		$items[] = array(
			'name' => $title,
			'url'  => '',
		);

		return $items;
	}

	if ( is_archive() ) {
		$items[] = array(
			'name' => get_the_archive_title(),
			'url'  => '',
		);
	}

	return $items;
}

/**
 * Check whether the current request is the virtual HTML sitemap.
 *
 * @return bool
 */
function justice_theme_is_html_sitemap_request(): bool {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );
	$request_path = '/' . trim( $request_path, '/' ) . '/';

	return '/site-map/' === $request_path || '/html-sitemap/' === $request_path;
}

/**
 * Provide a non-empty breadcrumb name for virtual or edge routes.
 *
 * @return string
 */
function justice_theme_get_fallback_breadcrumb_name(): string {
	if ( justice_theme_is_html_sitemap_request() ) {
		return __( 'מפת אתר', 'justice-theme' );
	}

	$document_title = trim( wp_strip_all_tags( wp_get_document_title() ) );
	if ( '' !== $document_title ) {
		$parts = preg_split( '/\s+[-–—]\s+/u', $document_title );
		if ( is_array( $parts ) && ! empty( $parts[0] ) ) {
			return trim( $parts[0] );
		}
	}

	return get_bloginfo( 'name' ) ?: 'Jus-Tice';
}

/**
 * Dynamically resolve the parent pillar mapping for a given page slug.
 *
 * @param string $slug Page slug.
 * @return array|null Name and URL array, or null if no mapping exists.
 */
function justice_theme_resolve_pillar_for_slug( string $slug ) {
	// 1. Direct custom matches for exact slugs that might be ambiguous
	$exact_mappings = array(
		'lawyer-divorce-guide-proceedings-costs-rights' => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
		'criminal-defense-attorney' => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
		'real-estate-attorney'      => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
		'legal-aid-israel'          => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
		'law-suit-cost-israel'      => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
		'elder-law-israel'          => array( 'name' => 'זכויות', 'url' => '/disability-rights-israel/' ),
		'tax-lawyer-israel'         => array( 'name' => 'מיסוי', 'url' => '/tax-lawyer-israel/' ),
		'mediation-israel'          => array( 'name' => 'גישור', 'url' => '/mediation-israel/' ),
	);

	if ( isset( $exact_mappings[ $slug ] ) ) {
		return $exact_mappings[ $slug ];
	}

	// 2. Pattern matches for dynamic resolution
	$patterns = array(
		// Real estate patterns
		'/(real-estate|buying-apartment|tenant-rights|landlord-rights|landlord-obligations|commercial-lease|eviction|tenant-eviction|property-tax-arnona)/i' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),

		// Family law patterns
		'/(divorce|custody|child-support|prenuptial|guardianship|family-law|family-dispute|surrogacy|adoption|spousal-support|child-abduction)/i' => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),

		// Criminal law patterns
		'/(criminal|police-record|police-investigation|plea-bargain|sentencing|fraud-offense|fraud-victim|white-collar|drug-offense|military-criminal|speeding|drunk-driving|traffic-offense|arrest)/i' => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),

		// Medical malpractice patterns
		'/(medical-malpractice|medical-negligence|birth-injury|surgical-error|anesthesia-medical|medication-error)/i' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),

		// Labor law patterns
		'/(labor-law|wrongful-dismissal|employment-rights|sexual-harassment|workplace-accident|discrimination-at-work|worker-rights|overtime-pay|workplace-harassment|employment-contract|workplace-safety|labor-tribunal)/i' => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),

		// Consumer rights patterns
		'/(consumer-rights|small-claims|insurance-claim|internet-defamation|class-action|debt-collection|writ-of-execution)/i' => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),

		// Inheritance patterns
		'/(inheritance|will-and-testament|will-probate|will-executor)/i' => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),

		// Immigration patterns
		'/(immigration|asylum|business-visa)/i' => array( 'name' => 'הגירה', 'url' => '/immigration-lawyer-israel/' ),

		// Copyright/IP patterns
		'/(copyright|trademark|intellectual-property)/i' => array( 'name' => 'קניין רוחני', 'url' => '/intellectual-property-israel/' ),

		// Corporate patterns
		'/(corporate-law|contract-law|startup-lawyer|startup-investment|startup-equity|partner-dispute)/i' => array( 'name' => 'דיני חברות', 'url' => '/corporate-law-israel/' ),
	);

	foreach ( $patterns as $pattern => $pillar ) {
		if ( preg_match( $pattern, $slug ) ) {
			return $pillar;
		}
	}

	return null;
}
