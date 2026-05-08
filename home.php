<?php
/**
 * Blog posts listing (home.php).
 *
 * @package JusticeTheme
 */

get_header();
?>

<section class="archive-header">
	<div class="container">
		<h1><?php esc_html_e( 'Blog', 'justice-theme' ); ?></h1>
	</div>
</section>

<section class="archive-content section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<div class="article-grid">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'template-parts/cards/article-card' );
				endwhile;
				?>
			</div>
			<div class="pagination">
				<?php the_posts_pagination( array(
					'mid_size'  => 2,
					'prev_text' => esc_html__( 'Previous', 'justice-theme' ),
					'next_text' => esc_html__( 'Next', 'justice-theme' ),
				) ); ?>
			</div>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content/content-none' ); ?>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
