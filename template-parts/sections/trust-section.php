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

$city_count = wp_count_terms( array( 'taxonomy' => 'city', 'hide_empty' => false ) );
$cities     = is_wp_error( $city_count ) ? 0 : (int) $city_count;

// Don't render the section if we have no real data to show.
if ( $total === 0 && $areas === 0 && $cities === 0 ) {
	return;
}
?>

<section class="trust-section">
	<div class="container">
		<div class="trust-section__grid">
			<?php if ( $total > 0 ) : ?>
				<div class="trust-section__stat">
					<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $total ) ); ?></span>
					<span class="trust-section__label"><?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?></span>
				</div>
			<?php endif; ?>

			<?php if ( $areas > 0 ) : ?>
				<div class="trust-section__stat">
					<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $areas ) ); ?></span>
					<span class="trust-section__label"><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></span>
				</div>
			<?php endif; ?>

			<?php if ( $cities > 0 ) : ?>
				<div class="trust-section__stat">
					<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $cities ) ); ?></span>
					<span class="trust-section__label"><?php esc_html_e( 'ערים בישראל', 'justice-theme' ); ?></span>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>

