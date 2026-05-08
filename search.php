<?php
/**
 * Search results.
 *
 * @package JusticeTheme
 */

get_header();

global $wp_query;
?>

<section class="search-header">
	<div class="container container--narrow">
		<h1>
			<?php
			printf(
				/* translators: %s: search query. */
				esc_html__( 'Search results for: %s', 'justice-theme' ),
				'<span>' . esc_html( get_search_query() ) . '</span>'
			);
			?>
		</h1>

		<?php get_template_part( 'template-parts/forms/search-form-legal' ); ?>
	</div>
</section>

<section class="search-results section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="article-grid">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/content/content-search-result' );
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
