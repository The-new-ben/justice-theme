<?php
/**
 * Content tabs (guides / legal updates) per Homepage.dc.html.
 *
 * Both grids are fully server-rendered from real posts (SEO-safe); the
 * tab toggle only flips a [hidden] attribute client-side.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_guides_query = new WP_Query(
	array(
		'post_type'           => 'articles',
		'post_status'         => 'publish',
		'posts_per_page'      => 4,
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	)
);

$justice_news_query = new WP_Query(
	array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => 4,
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	)
);

$justice_articles_counts = wp_count_posts( 'articles' );
$justice_guides_total    = isset( $justice_articles_counts->publish ) ? (int) $justice_articles_counts->publish : 0;

if ( ! $justice_guides_query->have_posts() ) {
	return;
}

$justice_has_news = $justice_news_query->have_posts();
?>

<section class="jt2-section jt2-section--white" id="content-updates">
	<div class="jt2-section__inner">
		<div class="jt2-content__head">
			<div>
				<span class="jt2-eyebrow"><?php esc_html_e( 'תוכן מתעדכן', 'justice-theme' ); ?></span>
				<h2 class="jt2-h2"><?php esc_html_e( 'מדריכים ועדכוני חקיקה ופסיקה', 'justice-theme' ); ?></h2>
			</div>
			<?php if ( $justice_has_news ) : ?>
				<div class="jt2-content__tabs" role="tablist">
					<button type="button" class="jt2-content__tab is-active" data-content-tab="guides" role="tab" aria-selected="true"><?php esc_html_e( 'מדריכים', 'justice-theme' ); ?></button>
					<button type="button" class="jt2-content__tab" data-content-tab="news" role="tab" aria-selected="false"><?php esc_html_e( 'עדכוני חקיקה ופסיקה', 'justice-theme' ); ?></button>
				</div>
			<?php endif; ?>
		</div>
		<p class="jt2-content__count">
			<?php
			printf(
				/* translators: %s: published guide count. */
				esc_html__( '%s+ מדריכים משפטיים, מתעדכנים לפי תחום ופרקטיקה.', 'justice-theme' ),
				esc_html( number_format_i18n( $justice_guides_total ) )
			);
			?>
		</p>

		<div class="jt2-content__grid" data-content-panel="guides">
			<?php
			while ( $justice_guides_query->have_posts() ) :
				$justice_guides_query->the_post();
				?>
				<a class="jt2-content-card" href="<?php echo esc_url( get_permalink() ); ?>">
					<span class="jt2-badge jt2-badge--navy"><?php esc_html_e( 'מדריך', 'justice-theme' ); ?></span>
					<h4><?php echo esc_html( wp_trim_words( get_the_title(), 12 ) ); ?></h4>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
				</a>
			<?php endwhile; ?>
		</div>

		<?php if ( $justice_has_news ) : ?>
			<div class="jt2-content__grid" data-content-panel="news" hidden>
				<?php
				while ( $justice_news_query->have_posts() ) :
					$justice_news_query->the_post();
					?>
					<a class="jt2-content-card" href="<?php echo esc_url( get_permalink() ); ?>">
						<span class="jt2-badge jt2-badge--urgent"><?php esc_html_e( 'עדכון', 'justice-theme' ); ?></span>
						<h4><?php echo esc_html( wp_trim_words( get_the_title(), 12 ) ); ?></h4>
						<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
					</a>
				<?php endwhile; ?>
			</div>

			<script>
			( function () {
				var tabs = document.querySelectorAll( '[data-content-tab]' );
				tabs.forEach( function ( tab ) {
					tab.addEventListener( 'click', function () {
						var target = tab.getAttribute( 'data-content-tab' );
						tabs.forEach( function ( t ) {
							t.classList.toggle( 'is-active', t === tab );
							t.setAttribute( 'aria-selected', t === tab ? 'true' : 'false' );
						} );
						document.querySelectorAll( '[data-content-panel]' ).forEach( function ( panel ) {
							panel.hidden = panel.getAttribute( 'data-content-panel' ) !== target;
						} );
					} );
				} );
			}() );
			</script>
		<?php endif; ?>
	</div>
</section>
<?php
wp_reset_postdata();
