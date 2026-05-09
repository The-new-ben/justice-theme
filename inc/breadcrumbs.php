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
	?>
	<nav class="breadcrumbs" aria-label="<?php esc_attr_e( 'שביל ניווט', 'justice-theme' ); ?>">
		<ol class="container breadcrumbs__list">
			<?php foreach ( $items as $index => $item ) : ?>
				<li class="breadcrumbs__item">
					<?php if ( ! empty( $item['url'] ) && $index < count( $items ) - 1 ) : ?>
						<a href="<?php echo esc_url( $item['url'] ); ?>">
							<?php echo esc_html( $item['name'] ); ?>
						</a>
					<?php else : ?>
						<span aria-current="page"><?php echo esc_html( $item['name'] ); ?></span>
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
			'url'  => home_url( '/' ),
		),
	);

	if ( is_singular( 'articles' ) ) {
		$items[] = array(
			'name' => __( 'מאמרים משפטיים', 'justice-theme' ),
			'url'  => get_post_type_archive_link( 'articles' ),
		);

		$terms = get_the_terms( get_the_ID(), 'practice-areas' );
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$term    = array_shift( $terms );
			$items[] = array(
				'name' => $term->name,
				'url'  => get_term_link( $term ),
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
			'url'  => get_post_type_archive_link( 'justice_lawyer' ),
		);

		$areas = get_the_terms( get_the_ID(), 'practice-areas' );
		if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) {
			$area    = array_shift( $areas );
			$items[] = array(
				'name' => $area->name,
				'url'  => add_query_arg( 'area', $area->slug, get_post_type_archive_link( 'justice_lawyer' ) ),
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
			'url'  => get_post_type_archive_link( 'justice_lawyer' ),
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
		$items[] = array(
			'name' => get_the_title(),
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
