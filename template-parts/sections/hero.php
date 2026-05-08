<?php
/**
 * Homepage hero section — strategic portal messaging.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="hero">
	<div class="container hero__grid">
		<div class="hero__content">
			<p class="hero__eyebrow">
				<?php esc_html_e( 'הפורטל המשפטי המוביל בישראל', 'justice-theme' ); ?>
			</p>

			<h1 class="hero__title">
				<?php esc_html_e( 'מידע משפטי מקצועי, חיבור לעורכי דין ופתרונות משפטיים', 'justice-theme' ); ?>
			</h1>

			<p class="hero__description">
				<?php esc_html_e( 'מאמרים משפטיים, מדריכים מקצועיים, חיפוש עורכי דין לפי תחום ומיקום — והפנייה חכמה לייצוג המשפטי המתאים.', 'justice-theme' ); ?>
			</p>

			<form class="hero-search" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<label class="screen-reader-text" for="hero-search-input">
					<?php esc_html_e( 'חיפוש משפטי', 'justice-theme' ); ?>
				</label>

				<input
					id="hero-search-input"
					type="search"
					name="s"
					placeholder="<?php echo esc_attr__( 'מה הבעיה המשפטית שלך?', 'justice-theme' ); ?>"
					value="<?php echo esc_attr( get_search_query() ); ?>"
				>

				<button type="submit">
					<?php esc_html_e( 'חיפוש', 'justice-theme' ); ?>
				</button>
			</form>

			<div class="hero__actions">
				<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="button button--gold">
					<?php esc_html_e( 'מצאו עורך דין', 'justice-theme' ); ?>
				</a>
				<a href="<?php echo esc_url( get_post_type_archive_link( 'articles' ) ); ?>" class="button button--outline-light">
					<?php esc_html_e( 'מדריכים משפטיים', 'justice-theme' ); ?>
				</a>
			</div>
		</div>

		<div class="hero__panel" aria-label="<?php esc_attr_e( 'תחומי משפט נפוצים', 'justice-theme' ); ?>">
			<h2><?php esc_html_e( 'תחומי משפט נפוצים', 'justice-theme' ); ?></h2>

			<?php
			$popular_terms = get_terms( array(
				'taxonomy'   => 'practice-areas',
				'hide_empty' => true,
				'number'     => 6,
				'orderby'    => 'count',
				'order'      => 'DESC',
			) );

			if ( ! empty( $popular_terms ) && ! is_wp_error( $popular_terms ) ) :
			?>
				<ul class="hero__quick-links">
					<?php foreach ( $popular_terms as $pterm ) : ?>
						<li>
							<a href="<?php echo esc_url( get_term_link( $pterm ) ); ?>">
								<?php echo esc_html( $pterm->name ); ?>
								<span><?php echo esc_html( $pterm->count ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		</div>
	</div>
</section>
