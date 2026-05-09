<?php
/**
 * Latest articles section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$latest_articles = new WP_Query( array(
	'post_type'           => array( 'articles' ),
	'post_status'         => 'publish',
	'posts_per_page'      => 6,
	'ignore_sticky_posts' => true,
) );

if ( ! $latest_articles->have_posts() ) {
	return;
}
?>

<section class="latest-articles section">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow">
					<?php esc_html_e( 'מדריכים משפטיים אחרונים', 'justice-theme' ); ?>
				</p>

				<h2>
					<?php esc_html_e( 'מאמרים משפטיים אחרונים', 'justice-theme' ); ?>
				</h2>
			</div>

			<a class="section-header__link button button--gold" href="<?php echo esc_url( get_post_type_archive_link( 'articles' ) ); ?>">
				<?php esc_html_e( 'צפייה בכל המאמרים', 'justice-theme' ); ?>
			</a>
		</div>

		<div class="article-grid">
			<?php
			while ( $latest_articles->have_posts() ) :
				$latest_articles->the_post();
				get_template_part( 'template-parts/cards/article-card' );
			endwhile;
			wp_reset_postdata();
			?>
		</div>
	</div>
</section>

