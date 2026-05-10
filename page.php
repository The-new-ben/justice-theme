<?php
/**
 * Generic page template.
 *
 * @package JusticeTheme
 */

get_header();

$justice_theme_current_page = get_post();

if (
	$justice_theme_current_page instanceof WP_Post
	&& function_exists( 'justice_theme_is_practice_landing_page' )
	&& justice_theme_is_practice_landing_page( $justice_theme_current_page )
) {
	get_template_part(
		'template-parts/content/practice-landing-page',
		null,
		array(
			'page_id' => $justice_theme_current_page->ID,
			'config'  => justice_theme_get_practice_landing_config( $justice_theme_current_page->post_name ),
		)
	);

	get_footer();
	return;
}

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
