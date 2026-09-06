<?php
/**
 * Leading guides, new look (v3): eight real published guides.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_guides_query = new WP_Query(
	array(
		'post_type'           => post_type_exists( 'articles' ) ? array( 'articles', 'post' ) : 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => 8,
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	)
);

if ( ! $justice_guides_query->have_posts() ) {
	return;
}
?>

<section class="l3-section l3-guides" id="guides">
	<div class="l3-section__inner">
		<div class="l3-section__head">
			<div>
				<span class="l3-kicker"><?php esc_html_e( 'מדריכים משפטיים', 'justice-theme' ); ?></span>
				<h2 class="l3-h2"><?php esc_html_e( 'מדריכים מובילים', 'justice-theme' ); ?></h2>
			</div>
			<a class="l3-more" href="<?php echo esc_url( home_url( '/articles/' ) ); ?>"><?php esc_html_e( 'לכל המדריכים ←', 'justice-theme' ); ?></a>
		</div>
		<div class="l3-guides__grid">
			<?php
			while ( $justice_guides_query->have_posts() ) :
				$justice_guides_query->the_post();
				$justice_guide_terms = get_the_terms( get_the_ID(), 'practice-areas' );
				$justice_guide_area  = ( is_array( $justice_guide_terms ) && ! empty( $justice_guide_terms ) ) ? $justice_guide_terms[0]->name : '';
				$justice_guide_url   = function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( get_the_ID() ) : get_permalink();
				?>
				<a class="l3-guide" href="<?php echo esc_url( $justice_guide_url ); ?>">
					<?php if ( '' !== $justice_guide_area ) : ?>
						<span class="l3-guide__area"><?php echo esc_html( $justice_guide_area ); ?></span>
					<?php endif; ?>
					<strong class="l3-guide__title"><?php echo esc_html( wp_trim_words( get_the_title(), 14, '' ) ); ?></strong>
					<span class="l3-guide__more"><?php esc_html_e( 'קראו עוד ←', 'justice-theme' ); ?></span>
				</a>
			<?php endwhile; ?>
		</div>
	</div>
</section>
<?php
wp_reset_postdata();
