<?php
/**
 * Stats + trust chips strip per Homepage.dc.html.
 *
 * Every number is computed from the CMS at render time.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_articles_counts = wp_count_posts( 'articles' );
$justice_guides_total    = isset( $justice_articles_counts->publish ) ? (int) $justice_articles_counts->publish : 0;

$justice_area_total = wp_count_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => true ) );
$justice_area_total = is_wp_error( $justice_area_total ) ? 0 : (int) $justice_area_total;

$justice_lawyer_total = 0;
if ( post_type_exists( 'justice_lawyer' ) ) {
	$justice_lawyer_counts = wp_count_posts( 'justice_lawyer' );
	$justice_lawyer_total  = isset( $justice_lawyer_counts->publish ) ? (int) $justice_lawyer_counts->publish : 0;
}

$justice_stats = array(
	array( number_format_i18n( $justice_guides_total ) . '+', __( 'מדריכים משפטיים', 'justice-theme' ) ),
	array( number_format_i18n( $justice_area_total ) . '+', __( 'תחומי משפט', 'justice-theme' ) ),
	array( '20+', __( 'ערים', 'justice-theme' ) ),
);

if ( $justice_lawyer_total > 0 ) {
	$justice_stats[] = array( number_format_i18n( $justice_lawyer_total ) . '+', __( 'עורכי דין ואנשי מקצוע', 'justice-theme' ) );
}
?>

<section class="jt2-section jt2-section--tint" id="trust-strip">
	<div class="jt2-section__inner">
		<div class="jt2-stats">
			<?php foreach ( $justice_stats as $justice_stat ) : ?>
				<div>
					<strong><?php echo esc_html( $justice_stat[0] ); ?></strong>
					<span><?php echo esc_html( $justice_stat[1] ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
		<div class="jt2-trust-divider"></div>
		<div class="jt2-trust-chips">
			<span><?php esc_html_e( '✓ פרופילים נבדקים לפני הצגה', 'justice-theme' ); ?></span>
			<span><?php esc_html_e( '✓ ללא הבטחת תוצאה או דירוג', 'justice-theme' ); ?></span>
			<span><?php esc_html_e( '✓ שקיפות מלאה לגבי שיתופי פעולה ומסלולים בתשלום', 'justice-theme' ); ?></span>
		</div>
	</div>
</section>
