<?php
/**
 * Single article template.
 *
 * @package JusticeTheme
 */

get_header();

while ( have_posts() ) :
	the_post();

	$primary_term = justice_theme_get_primary_practice_area();
	?>

	<article <?php post_class( 'single-article premium-card' ); ?> style="background: var(--jt-surface); border: none; box-shadow: none;">
		<header class="single-article__header glass-panel" style="max-width: 900px; margin: 40px auto 3rem; padding: 3rem 2rem; text-align: center; border-radius: var(--jt-radius-lg);">
			<div class="container container--narrow">
				<?php if ( $primary_term ) : 
					$clean_name = str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ), array( '', '', '', '' ), $primary_term->name );
				?>
					<a class="single-article__term" href="<?php echo esc_url( get_term_link( $primary_term ) ); ?>" style="display: inline-block; margin-bottom: 1.2rem; font-size: 0.95rem; background: rgba(95, 126, 168, 0.1); color: var(--jt-accent); padding: 0.4rem 1.2rem; border-radius: 50px; font-weight: 800; text-decoration: none;">
						<?php echo esc_html( trim( $clean_name ) ); ?>
					</a>
				<?php endif; ?>

				<h1 class="single-article__title" style="font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1.5rem; line-height: 1.25; color: var(--jt-primary-deep); letter-spacing: -0.5px;">
					<?php the_title(); ?>
				</h1>

				<div class="single-article__meta" style="display: flex; justify-content: center; gap: 1.5rem; color: var(--jt-muted); font-size: 0.95rem; font-weight: 600;">
					<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
						<span style="color: var(--jt-accent); font-size: 1.1rem; vertical-align: middle;">🗓</span> <?php echo esc_html( get_the_date() ); ?>
					</time>

					<span><span style="color: var(--jt-accent); font-size: 1.1rem; vertical-align: middle;">⏱</span> <?php echo esc_html( justice_theme_reading_time() ); ?></span>

					<span>
						<?php
						printf(
							/* translators: %s: modified date. */
							esc_html__( 'עודכן: %s', 'justice-theme' ),
							esc_html( get_the_modified_date() )
						);
						?>
					</span>
				</div>
			</div>
		</header>

		<div class="container single-article__layout">
			
			<div class="single-article__main">
				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="single-article__image" style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 3rem; box-shadow: var(--shadow-soft);">
						<?php the_post_thumbnail( 'justice-hero', array( 'style' => 'width: 100%; height: auto;' ) ); ?>
					</figure>
				<?php endif; ?>

				<div class="single-article__content entry-content">
					<?php the_content(); ?>
				</div>

				<section class="editorial-note" style="margin-top: 4rem; padding: 2rem; background: rgba(82, 114, 178, 0.05); border-radius: var(--radius-md); border-right: 4px solid var(--color-accent);">
					<h2 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.5rem;"><?php esc_html_e( 'הערת מערכת', 'justice-theme' ); ?></h2>
					<p style="margin: 0; color: var(--color-muted); font-size: 0.95rem;">
						<?php esc_html_e( 'מדריך זה נועד לספק מידע משפטי כללי בלבד. אינו מהווה תחליף לייעוץ משפטי אישי מעורך דין מוסמך.', 'justice-theme' ); ?>
					</p>
				</section>
			</div>
			
			<aside class="single-article__sidebar" role="complementary">
				<div class="sticky-box" style="position: sticky; top: 2rem; padding: 2rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
					<h2 style="font-size: 1.3rem; color: var(--color-primary-deep); margin-bottom: 1rem;"><?php esc_html_e( 'צריכים עזרה משפטית?', 'justice-theme' ); ?></h2>
					<p style="color: var(--color-muted); margin-bottom: 1.5rem;"><?php esc_html_e( 'שלחו פנייה קצרה ונסייע להפנות אתכם לתחום הרלוונטי.', 'justice-theme' ); ?></p>
					<a class="button button--primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" style="width: 100%; text-align: center;">
						<?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?>
					</a>
				</div>
			</aside>
		</div>
	</article>

	<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

	<div style="background: var(--color-bg); padding: 4rem 0;">
		<div class="container">
			<?php
			if ( function_exists( 'justice_theme_related_articles' ) ) {
				justice_theme_related_articles( get_the_ID() );
			}
			?>
		</div>
	</div>

<?php endwhile;

get_footer();


