<?php
/**
 * Homepage legal news band (din pattern): latest real, sourced items.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_news = function_exists( 'justice_theme_latest_legal_news' ) ? justice_theme_latest_legal_news( 5 ) : array();

if ( empty( $justice_news ) ) {
	return;
}
?>

<section class="jt2-section legal-news-band" aria-label="<?php esc_attr_e( 'חדשות משפטיות', 'justice-theme' ); ?>">
	<div class="container">
		<div class="legal-news-head">
			<h2><?php esc_html_e( 'חדשות משפטיות', 'justice-theme' ); ?></h2>
			<a href="<?php echo esc_url( get_category_link( get_cat_ID( 'חדשות משפטיות' ) ) ); ?>"><?php esc_html_e( 'לכל החדשות ←', 'justice-theme' ); ?></a>
		</div>
		<div class="legal-news-grid">
			<?php foreach ( $justice_news as $justice_news_index => $justice_news_post ) : ?>
				<article class="legal-news-item<?php echo 0 === $justice_news_index ? ' legal-news-item--lead' : ''; ?>">
					<span class="legal-news-item__meta">
						<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C, $justice_news_post ) ); ?>"><?php echo esc_html( get_the_date( '', $justice_news_post ) ); ?></time>
						<?php $justice_news_outlet = (string) get_post_meta( $justice_news_post->ID, 'news_source_name', true ); ?>
						<?php if ( $justice_news_outlet ) : ?>
							· <?php echo esc_html( sprintf( __( 'לפי %s', 'justice-theme' ), $justice_news_outlet ) ); ?>
						<?php endif; ?>
					</span>
					<h3><a href="<?php echo esc_url( get_permalink( $justice_news_post ) ); ?>"><?php echo esc_html( get_the_title( $justice_news_post ) ); ?></a></h3>
					<?php if ( 0 === $justice_news_index ) : ?>
						<p><?php echo esc_html( wp_trim_words( wp_strip_all_tags( $justice_news_post->post_content ), 32, '…' ) ); ?></p>
					<?php endif; ?>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
