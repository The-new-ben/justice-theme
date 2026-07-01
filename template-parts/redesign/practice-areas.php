<?php
/**
 * Practice areas grid with REAL guide counts per Homepage.dc.html and
 * the strategy doc ("real guide counts instead of vague claims").
 *
 * Counts come straight from the practice-areas taxonomy term counts.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_area_terms = get_terms(
	array(
		'taxonomy'   => 'practice-areas',
		'hide_empty' => true,
		'number'     => 8,
		'parent'     => 0,
		'orderby'    => 'count',
		'order'      => 'DESC',
	)
);

if ( empty( $justice_area_terms ) || is_wp_error( $justice_area_terms ) ) {
	return;
}

$justice_area_icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M5 7h14M7 7l-3 6h6zM17 7l-3 6h6z"/><path d="M4 13a3 3 0 0 0 6 0M14 13a3 3 0 0 0 6 0"/></svg>';
?>

<section class="jt2-section" id="practice-areas">
	<div class="jt2-section__inner">
		<span class="jt2-eyebrow"><?php esc_html_e( 'חיפוש לפי תחום משפטי', 'justice-theme' ); ?></span>
		<h2 class="jt2-h2" style="margin-bottom:28px"><?php esc_html_e( 'תחומי משפט מובילים', 'justice-theme' ); ?></h2>

		<div class="jt2-areas">
			<?php
			foreach ( $justice_area_terms as $justice_area_term ) :
				$justice_area_icon_html = $justice_area_icon;
				if ( function_exists( 'justice_get_practice_area_icon' ) ) {
					$justice_custom_icon = justice_get_practice_area_icon( $justice_area_term->slug );
					if ( $justice_custom_icon ) {
						$justice_area_icon_html = $justice_custom_icon;
					}
				}
				?>
				<a class="jt2-area" href="<?php echo esc_url( get_term_link( $justice_area_term ) ); ?>">
					<span class="jt2-area__icon"><?php echo $justice_area_icon_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
					<strong><?php echo esc_html( $justice_area_term->name ); ?></strong>
					<span>
						<?php
						printf(
							/* translators: %s: number of guides in this practice area. */
							esc_html__( '%s מדריכים', 'justice-theme' ),
							esc_html( number_format_i18n( (int) $justice_area_term->count ) )
						);
						?>
					</span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
