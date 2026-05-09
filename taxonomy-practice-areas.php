<?php
/**
 * Taxonomy archive: practice-areas.
 *
 * @package JusticeTheme
 */

get_header();

$term = get_queried_object();
?>

	<section class="taxonomy-header premium-card" style="background: linear-gradient(135deg, var(--color-primary-deep), var(--color-primary)); color: #fff; padding: 4rem 0 3rem; margin-bottom: 3rem; text-align: center;">
		<div class="container container--narrow" style="max-width: 800px; margin: 0 auto;">
			<p class="taxonomy-header__eyebrow" style="display: inline-block; margin-bottom: 1rem; font-size: 0.9rem; background: rgba(255,255,255,0.1); color: var(--color-accent); padding: 0.4rem 1rem; border-radius: 50px; font-weight: 700;">
				<?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?>
			</p>

			<?php
			$clean_name = str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ), array( '', '', '', '' ), single_term_title( '', false ) );
			?>
			<h1 style="font-size: clamp(2.2rem, 5vw, 3.5rem); margin-bottom: 1.5rem; line-height: 1.2;">
				<?php echo esc_html( trim( $clean_name ) ); ?>
			</h1>

			<?php if ( ! empty( $term->description ) ) : ?>
				<div class="taxonomy-header__description" style="color: rgba(255,255,255,0.8); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
					<?php echo wp_kses_post( wpautop( $term->description ) ); ?>
				</div>
			<?php endif; ?>

			<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" style="background: var(--color-accent); border-color: var(--color-accent); color: #fff;">
				<?php esc_html_e( 'מצאו עורך דין בתחום זה', 'justice-theme' ); ?>
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
