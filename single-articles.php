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

	<article <?php post_class( 'single-article' ); ?>>
		<header class="single-article__header">
			<div class="container container--narrow">
				<?php if ( $primary_term ) : ?>
					<a class="single-article__term" href="<?php echo esc_url( get_term_link( $primary_term ) ); ?>">
						<?php echo esc_html( $primary_term->name ); ?>
					</a>
				<?php endif; ?>

				<h1 class="single-article__title"><?php the_title(); ?></h1>

				<div class="single-article__meta">
					<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
						<?php echo esc_html( get_the_date() ); ?>
					</time>

					<span><?php echo esc_html( justice_theme_reading_time() ); ?></span>

					<span>
						<?php
						printf(
							/* translators: %s: modified date. */
							esc_html__( 'Updated: %s', 'justice-theme' ),
							esc_html( get_the_modified_date() )
						);
						?>
					</span>
				</div>
			</div>
		</header>

		<div class="container single-article__layout">
			<aside class="single-article__sidebar" role="complementary">
				<div class="sticky-box">
					<h2><?php esc_html_e( 'Need legal help?', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'Send a short inquiry and we will help route it to the relevant field.', 'justice-theme' ); ?></p>
					<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">
						<?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?>
					</a>
				</div>
			</aside>

			<div class="single-article__main">
				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="single-article__image">
						<?php the_post_thumbnail( 'justice-hero' ); ?>
					</figure>
				<?php endif; ?>

				<div class="single-article__content entry-content">
					<?php the_content(); ?>
				</div>

				<section class="editorial-note">
					<h2><?php esc_html_e( 'Editorial note', 'justice-theme' ); ?></h2>
					<p>
						<?php esc_html_e( 'This guide is intended as general legal information. It does not replace individual legal advice from a qualified lawyer.', 'justice-theme' ); ?>
					</p>
				</section>
			</div>
		</div>
	</article>

	<?php get_template_part( 'template-parts/sections/cta-section' ); ?>

	<?php
	if ( function_exists( 'justice_theme_related_articles' ) ) {
		justice_theme_related_articles( get_the_ID() );
	}

endwhile;

get_footer();

