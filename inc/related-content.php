<?php
/**
 * Related content.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Render related articles by shared practice area.
 *
 * @param int $post_id Current post ID.
 */
function justice_theme_related_articles( $post_id ) {
	$terms = get_the_terms( $post_id, 'practice-areas' );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return;
	}

	$term_ids = wp_list_pluck( $terms, 'term_id' );

	$related = new WP_Query( array(
		'post_type'      => array( 'articles', 'post' ),
		'post_status'    => 'publish',
		'posts_per_page' => 3,
		'post__not_in'   => array( $post_id ),
		'tax_query'      => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'term_id',
				'terms'    => $term_ids,
			),
		),
	) );

	if ( ! $related->have_posts() ) {
		return;
	}
	?>
	<section class="related-articles section">
		<div class="container">
			<div class="section-header">
				<h2><?php esc_html_e( 'מדריכים משפטיים קשורים', 'justice-theme' ); ?></h2>
			</div>

			<div class="article-grid article-grid--three">
				<?php
				while ( $related->have_posts() ) :
					$related->the_post();
					get_template_part( 'template-parts/cards/article-card' );
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</div>
	</section>
	<?php
}

