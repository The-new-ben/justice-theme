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
			'will-probate-objection'    => array( 'name' => 'ירושה וצוואות', 'url' => '/inheritance-lawyer/' ),
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
