<?php
/**
 * Taxonomy archive: practice-areas.
 *
 * @package JusticeTheme
 */

get_header();

$term = get_queried_object();
?>

<section class="taxonomy-header">
	<div class="container container--narrow">
		<p class="taxonomy-header__eyebrow">
			<?php esc_html_e( 'Practice area', 'justice-theme' ); ?>
		</p>

		<h1><?php single_term_title(); ?></h1>

		<?php if ( ! empty( $term->description ) ) : ?>
			<div class="taxonomy-header__description">
				<?php echo wp_kses_post( wpautop( $term->description ) ); ?>
			</div>
		<?php endif; ?>

		<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">
			<?php esc_html_e( 'Get legal direction', 'justice-theme' ); ?>
		</a>
	</div>
</section>

<section class="taxonomy-content section">
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
