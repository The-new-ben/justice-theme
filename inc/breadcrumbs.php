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

		$terms = get_the_terms( get_the_ID(), 'practice-areas' );
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$term    = array_shift( $terms );
			$items[] = array(
				'name' => $term->name,
				'url'  => justice_theme_public_term_link( $term ),
			);
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

		// Pillar-level middle crumb: map page slugs to their parent pillar
		$slug_to_pillar = array(
			// Family law cluster
			'lawyer-divorce-guide-proceedings-costs-rights' => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-agreement'     => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'child-support'         => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'child-custody'         => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'consensual-divorce'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-mediation'     => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-property-division' => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'family-dispute-resolution' => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-lawyer'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			// Criminal law cluster
			'criminal-defense-attorney' => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'criminal-record-deletion'  => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'criminal-lawyer-cost'      => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'police-investigation-rights' => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'plea-bargain'              => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Medical malpractice cluster
			'birth-injury'              => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'surgical-errors-medical-malpractice' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'anesthesia-medical-malpractice'      => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'what-is-medical-malpractice-definition-examples' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			// Real estate cluster
			'real-estate-attorney'      => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'buying-apartment'          => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Inheritance cluster
			'inheritance'               => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			'will-and-testament'        => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			'will-probate-objection'       => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			'inheritance-lawyer-guide'     => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			'inheritance-tax-israel'       => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			'inheritance-dispute'          => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			// Family law cluster — batch 5-12 additions
			'cohabiting-couples-rights'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'child-custody-guide'          => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-women-rights-israel'  => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'restraining-order-israel'     => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'prenuptial-agreement-guide'   => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'custody-modification-israel'  => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'guardianship-israel'          => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'power-of-attorney-guide'      => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			// Criminal cluster — batch 5-12 additions
			'criminal-sentencing-israel'   => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'traffic-offense-points'       => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'fraud-offenses-israel'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'criminal-appeal-guide'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'white-collar-crime-israel'    => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'drug-offenses-israel'         => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'criminal-rights-arrest'       => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Medical malpractice — batch 5-12 additions
			'medical-malpractice-surgery'  => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'medical-malpractice-haifa'    => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'medical-malpractice-tel-aviv' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'birth-injury-compensation'    => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'medical-malpractice-diagnosis-errors' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'medication-errors-malpractice'        => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			// Real estate — batch 5-12 additions
			'real-estate-developer-dispute' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'tenant-rights-israel'          => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'landlord-rights-israel'        => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'commercial-lease-israel'       => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'real-estate-contract-review'   => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Labor law cluster
			'labor-law-employee-rights'    => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'wrongful-dismissal-guide'     => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'employment-rights-pregnancy'  => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'sexual-harassment-work'       => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'workplace-accident-guide'     => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'discrimination-at-work'       => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			// Consumer / cross-pillar
			'consumer-rights-israel'       => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'small-claims-court-israel'    => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'insurance-claim-dispute'      => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			// Personal injury
			'personal-injury-israel'       => array( 'name' => 'נזקי גוף', 'url' => '/personal-injury-israel/' ),
			'personal-injury-car-accident' => array( 'name' => 'נזקי גוף', 'url' => '/personal-injury-israel/' ),
			'personal-injury-slip-fall'    => array( 'name' => 'נזקי גוף', 'url' => '/personal-injury-israel/' ),
			// Immigration cluster
			'immigration-lawyer-israel'    => array( 'name' => 'הגירה', 'url' => '/immigration-lawyer-israel/' ),
			'immigration-lawyer-cost'      => array( 'name' => 'הגירה', 'url' => '/immigration-lawyer-israel/' ),
			// Copyright / IP cluster
			'copyright-infringement-israel' => array( 'name' => 'קניין רוחני', 'url' => '/copyright-infringement-israel/' ),
			'trademark-registration-israel' => array( 'name' => 'קניין רוחני', 'url' => '/copyright-infringement-israel/' ),
			// Corporate / contract cluster
			'corporate-law-israel'         => array( 'name' => 'דיני חברות', 'url' => '/corporate-law-israel/' ),
			'contract-law-israel'          => array( 'name' => 'דיני חוזים', 'url' => '/contract-law-israel/' ),
			'startup-lawyer-israel'        => array( 'name' => 'דיני חברות', 'url' => '/corporate-law-israel/' ),
			// Consumer / civil cluster
			'internet-defamation-israel'   => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'class-action-lawsuit'         => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'debt-collection-israel'       => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'writ-of-execution-israel'     => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			// Mediation / ADR
			'mediation-israel'             => array( 'name' => 'גישור', 'url' => '/mediation-israel/' ),
			// Family law batches 15-24
			'child-abduction-hague'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'surrogacy-israel'             => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'adoption-israel-guide'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-pension-split'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-spousal-support'      => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'child-support-calculation'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'prenuptial-agreement-cost'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'restraining-order-violation'  => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'will-executor-israel'         => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
			// Criminal batches 15-24
			'criminal-record-israel'       => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'sexual-harassment-complaint'  => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			// Real estate batches 15-24
			'real-estate-tax-israel'       => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Labor batches 15-24
			'employment-contract-guide'    => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'workplace-safety-israel'      => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			// Mental health / disability
			'mental-health-law-israel'     => array( 'name' => 'זכויות', 'url' => '/disability-rights-israel/' ),
			'disability-rights-israel'     => array( 'name' => 'זכויות', 'url' => '/disability-rights-israel/' ),
			// Legal aid / cost
			'legal-aid-israel'             => array( 'name' => 'זכויות', 'url' => '/disability-rights-israel/' ),
			'law-suit-cost-israel'         => array( 'name' => 'זכויות', 'url' => '/consumer-rights-israel/' ),
			'medical-malpractice-cost'     => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			// Batches 25-27
			'medical-negligence-pregnancy' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'worker-rights-fired-immediately' => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'overtime-pay-israel'          => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'workplace-harassment-guide'   => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'divorce-custody-agreement'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'guardianship-adult-israel'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'fraud-victim-guide'           => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'criminal-appeal-process'      => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'tax-lawyer-israel'            => array( 'name' => 'מיסוי', 'url' => '/tax-lawyer-israel/' ),
			'real-estate-tax-israel'       => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Batches 28-29
			'divorce-children-emotional'   => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'eviction-notice-israel'       => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'tenant-eviction-defense'      => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'partner-dispute-business'     => array( 'name' => 'דיני חברות', 'url' => '/corporate-law-israel/' ),
			'elder-law-israel'             => array( 'name' => 'זכויות', 'url' => '/disability-rights-israel/' ),
			// Batches 30-31
			'immigration-asylum-israel'    => array( 'name' => 'הגירה', 'url' => '/immigration-lawyer-israel/' ),
			'domestic-violence-legal-guide' => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'sexual-offense-defense'       => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'divorce-process-steps'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'business-visa-israel'         => array( 'name' => 'הגירה', 'url' => '/immigration-lawyer-israel/' ),
			'legal-costs-who-pays'         => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			// Batch 32 — statistics pages
			'divorce-statistics-israel'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'lawyer-discipline-israel'     => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'medical-malpractice-statistics' => array( 'name' => 'רשלנות רפואית', 'url' => '/medical-malpractice-lawyer/' ),
			'real-estate-market-statistics' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-law-statistics-israel' => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Batch 33
			'real-estate-lawyer-raanana'   => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-raanana'           => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'child-welfare-law-israel'     => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'divorce-financial-planning'   => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'employment-contract-termination' => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			// Batch 34
			'real-estate-developer-defect' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-lawyer-hadera'       => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'family-law-hadera'            => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'copyright-music-israel'       => array( 'name' => 'קניין רוחני', 'url' => '/intellectual-property-israel/' ),
			'startup-investment-lawyer'    => array( 'name' => 'דיני חברות', 'url' => '/corporate-law-israel/' ),
			// Batch 35
			'insurance-claim-denial'       => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'labor-tribunal-process'       => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'real-estate-lawyer-akko'      => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-lawyer-nazareth'     => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'landlord-rights-israel'       => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Batch 36
			'criminal-lawyer-lod'          => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'family-law-lod'               => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'tenant-rights-israel'         => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'work-accident-guide'          => array( 'name' => 'נזקי גוף', 'url' => '/personal-injury-claim/' ),
			'construction-permit-violation' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Batch 37
			'non-compete-agreement-israel' => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'age-discrimination-work'      => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'inheritance-dispute'          => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'criminal-lawyer-ashkelon'     => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'real-estate-lawyer-yavne'     => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Batch 38
			'commercial-lease-israel'      => array( 'name' => 'דיני חוזים', 'url' => '/contract-law-israel/' ),
			'drug-offense-guide'           => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'property-division-divorce'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'family-law-ashkelon'          => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'real-estate-lawyer-rehovot'   => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Batch 39
			'bankruptcy-individual-israel' => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'criminal-lawyer-rosh-haayin'  => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'real-estate-lawyer-rosh-haayin' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'trade-secret-law-israel'      => array( 'name' => 'קניין רוחני', 'url' => '/intellectual-property-israel/' ),
			'debt-collection-israel'       => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			// Batch 40
			'copyright-software-israel'    => array( 'name' => 'קניין רוחני', 'url' => '/intellectual-property-israel/' ),
			'real-estate-lawyer-holon'     => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-rosh-haayin'       => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'tax-evasion-defense'          => array( 'name' => 'מיסוי', 'url' => '/tax-lawyer-israel/' ),
			'criminal-lawyer-bnei-brak'    => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Batch 41
			'real-estate-lawyer-bnei-brak' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-bnei-brak'         => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'guardianship-adult-israel'    => array( 'name' => 'זכויות', 'url' => '/disability-rights-israel/' ),
			'money-laundering-defense'     => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'startup-equity-israel'        => array( 'name' => 'דיני חברות', 'url' => '/corporate-law-israel/' ),
			// Batch 42
			'employment-sexual-harassment' => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'data-privacy-israel'          => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'real-estate-lawyer-kfar-yona' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-lawyer-kiryat-gat'   => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'child-support-calculation'    => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			// Batch 43
			'personal-injury-statistics'   => array( 'name' => 'נזקי גוף', 'url' => '/personal-injury-claim/' ),
			'real-estate-lawyer-afula'     => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-kiryat-gat'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'employment-subcontractor'     => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'drunk-driving-defense'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Batch 44
			'real-estate-lawyer-carmiel'   => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-lawyer-ramle'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'family-law-ramle'             => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'criminal-record-expungement'  => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'speeding-ticket-guide'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Batch 45
			'legal-aid-israel'             => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			'real-estate-lawyer-migdal-haemek' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-carmiel'           => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'sexual-offense-victim'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'court-appeal-israel'          => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			// Batch 46
			'real-estate-lawyer-beit-shean'  => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-lawyer-beit-shemesh'   => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'family-law-beit-shemesh'        => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'wrongful-termination-israel'    => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'minimum-wage-israel-2025'       => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			// Batch 47
			'real-estate-lawyer-beit-shemesh' => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'criminal-lawyer-dimona'          => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'real-estate-lawyer-dimona'       => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'overtime-pay-israel'             => array( 'name' => 'דיני עבודה', 'url' => '/labor-law-employee-rights/' ),
			'real-estate-statistics-2025'     => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			// Batch 48 — MILESTONE 250 pages
			'criminal-lawyer-tiberias'        => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'real-estate-lawyer-tiberias'     => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-tiberias'             => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'military-criminal-defense'       => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'property-tax-arnona-israel'      => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
			// Batch 49
			'criminal-lawyer-eilat'           => array( 'name' => 'משפט פלילי', 'url' => '/criminal-defense-attorney/' ),
			'real-estate-lawyer-eilat'        => array( 'name' => 'עורך דין מקרקעין', 'url' => '/real-estate-lawyer-guide/' ),
			'family-law-eilat'                => array( 'name' => 'דיני משפחה', 'url' => '/family-law/' ),
			'breach-of-contract-israel'       => array( 'name' => 'דיני חוזים', 'url' => '/contract-law-israel/' ),
			'consumer-rights-statistics'      => array( 'name' => 'זכויות צרכן', 'url' => '/consumer-rights-israel/' ),
		);

		$page_slug = get_post_field( 'post_name', $post_id );
		if ( isset( $slug_to_pillar[ $page_slug ] ) ) {
			$pillar = $slug_to_pillar[ $page_slug ];
			$items[] = array(
				'name' => $pillar['name'],
				'url'  => justice_theme_public_url( home_url( $pillar['url'] ) ),
			);
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
