<?php
/**
 * Trust / authority section — social proof bar.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$article_count = wp_count_posts( 'articles' );
$total         = isset( $article_count->publish ) ? (int) $article_count->publish : 0;
$total        += (int) wp_count_posts( 'post' )->publish;

$term_count = wp_count_terms( array( 'taxonomy' => 'practice-areas' ) );
$areas      = is_wp_error( $term_count ) ? 0 : (int) $term_count;

$lawyer_count = wp_count_posts( 'justice_lawyer' );
$lawyers      = isset( $lawyer_count->publish ) ? (int) $lawyer_count->publish : 0;
?>

<section class="trust-section section" id="trust-section">
	<div class="container">
		<div class="trust-section__grid">
			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $total ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'מאמרים ומדריכים', 'justice-theme' ); ?></span>
			</div>

			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $areas ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?></span>
			</div>

			<?php if ( $lawyers > 0 ) : ?>
			<div class="trust-section__stat">
				<span class="trust-section__number"><?php echo esc_html( number_format_i18n( $lawyers ) ); ?>+</span>
				<span class="trust-section__label"><?php esc_html_e( 'עורכי דין', 'justice-theme' ); ?></span>
			</div>
			<?php endif; ?>

			<div class="trust-section__stat">
				<span class="trust-section__number">20+</span>
				<span class="trust-section__label"><?php esc_html_e( 'ערים ואזורים', 'justice-theme' ); ?></span>
			</div>

			<div class="trust-section__stat">
				<span class="trust-section__number">10+</span>
				<span class="trust-section__label"><?php esc_html_e( 'שנות פעילות', 'justice-theme' ); ?></span>
			</div>
		</div>
	</div>
</section>
