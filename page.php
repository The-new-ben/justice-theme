<?php
/**
 * Generic page template.
 *
 * @package JusticeTheme
 */

get_header();

while ( have_posts() ) :
	the_post();
	?>

	<article <?php post_class( 'single-page' ); ?>>
		<header class="single-article__header">
			<div class="container container--narrow">
				<h1 class="single-article__title"><?php the_title(); ?></h1>
			</div>
		</header>

		<div class="container container--narrow">
			<div class="single-article__content entry-content">
				<?php the_content(); ?>
			</div>
		</div>
	</article>

	<?php
endwhile;

get_footer();
