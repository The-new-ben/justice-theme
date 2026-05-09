<?php
/**
 * Taxonomy archive: practice-areas.
 *
 * @package JusticeTheme
 */

get_header();

$term = get_queried_object();
?>

	<section class="taxonomy-hero glass-panel">
		<div class="container">
			<p class="section-eyebrow taxonomy-hero__eyebrow">
				תחום משפטי
			</p>
			<?php
			$clean_name = str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ), array( '', '', '', '' ), single_term_title( '', false ) );
			?>
			<h1><?php echo esc_html( trim( $clean_name ) ); ?></h1>

			<?php if ( ! empty( $term->description ) ) : ?>
				<div class="taxonomy-description" style="color: var(--color-text); font-size: 1.1rem; line-height: 1.7; max-width: 680px; margin: 0 auto 2rem;">
					<?php echo wp_kses_post( wpautop( $term->description ) ); ?>
				</div>
			<?php endif; ?>

			<a class="button button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" style="font-size: 1.05rem; padding: 0.9rem 2rem;">
				קבלת הכוונה משפטית
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

				<div class="pagination" style="margin-top: 3rem; text-align: center;">
					<?php
					the_posts_pagination( array(
						'mid_size'  => 2,
						'prev_text' => esc_html__( '→ הקודם', 'justice-theme' ),
						'next_text' => esc_html__( 'הבא ←', 'justice-theme' ),
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
