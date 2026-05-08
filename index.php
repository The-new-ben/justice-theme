<?php
/**
 * Main fallback template.
 *
 * @package JusticeTheme
 */

get_header();
?>

<section class="archive-content section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="article-grid">
				<?php
				while ( have_posts() ) :
					the_post();

					if ( 'articles' === get_post_type() ) {
						get_template_part( 'template-parts/cards/article-card' );
					} else {
						get_template_part( 'template-parts/content/content' );
					}
				endwhile;
				?>
			</div>

			<div class="pagination">
				<?php
				the_posts_pagination( array(
					'mid_size'  => 2,
					'prev_text' => esc_html__( 'Previous', 'justice-theme' ),
					'next_text' => esc_html__( 'Next', 'justice-theme' ),
				) );
				?>
			</div>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content/content-none' ); ?>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();

