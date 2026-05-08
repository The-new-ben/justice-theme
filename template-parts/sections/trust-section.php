<?php
/**
 * Trust / authority section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$article_count = wp_count_posts( 'articles' );
$total         = isset( $article_count->publish ) ? (int) $article_count->publish : 0;

$term_count = wp_count_terms( array( 'taxonomy' => 'practice-areas' ) );
$areas      = is_wp_error( $term_count ) ? 0 : (int) $term_count;
?>

<section class="trust-section">
	<div class="container">
		<div class="trust-section__grid">
			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $total ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?></span>
			</div>

			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $areas ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></span>
			</div>

			<div class="trust-section__stat">
				<span class="trust-section__number">10+</span>
				<span class="trust-section__label"><?php esc_html_e( 'שנות פעילות', 'justice-theme' ); ?></span>
			</div>
		</div>
	</div>
</section>

