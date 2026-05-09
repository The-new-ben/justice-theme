<?php
/**
 * Articles archive.
 *
 * @package JusticeTheme
 */

get_header();
?>

<section class="archive-header">
	<div class="container">
		<p class="archive-header__eyebrow">
			<?php esc_html_e( 'ספריית מאמרים משפטיים', 'justice-theme' ); ?>
		</p>

		<h1><?php esc_html_e( 'ספריית מאמרים משפטיים', 'justice-theme' ); ?></h1>

		<p>
			<?php esc_html_e( 'מדריכים משפטיים, הסברים מעשיים ומידע לפי תחום משפטי.', 'justice-theme' ); ?>
		</p>
	</div>
</section>

<section class="archive-content section">
	<div class="container archive-layout">
		<aside class="archive-sidebar" role="complementary">
			<h2><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></h2>

			<?php
			$sidebar_terms = get_terms( array(
				'taxonomy'   => 'practice-areas',
				'hide_empty' => true,
			) );

			if ( ! empty( $sidebar_terms ) && ! is_wp_error( $sidebar_terms ) ) :
			?>
				<ul class="term-list">
					<?php foreach ( $sidebar_terms as $sterm ) : ?>
						<li>
							<a href="<?php echo esc_url( get_term_link( $sterm ) ); ?>">
								<?php echo esc_html( $sterm->name ); ?>
								<span><?php echo esc_html( $sterm->count ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		</aside>

		<div class="archive-main">
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
						'prev_text' => esc_html__( 'הקודם', 'justice-theme' ),
						'next_text' => esc_html__( 'הבא', 'justice-theme' ),
					) );
					?>
				</div>
			<?php else : ?>
				<?php get_template_part( 'template-parts/content/content-none' ); ?>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php
get_footer();

