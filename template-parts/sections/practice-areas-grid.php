<?php
/**
 * Practice areas grid section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$terms = get_terms( array(
	'taxonomy'   => 'practice-areas',
	'hide_empty' => true,
	'number'     => 16,
	'parent'     => 0,
	'orderby'    => 'count',
	'order'      => 'DESC',
) );

if ( empty( $terms ) || is_wp_error( $terms ) ) {
	return;
}
?>

<section class="practice-areas-section section">
	<div class="container">
		<div class="section-header">
			<p class="section-header__eyebrow">
				<?php esc_html_e( 'נושאים משפטיים', 'justice-theme' ); ?>
			</p>

			<h2>
				<?php esc_html_e( 'חיפוש לפי תחום משפטי', 'justice-theme' ); ?>
			</h2>

			<p>
				<?php esc_html_e( 'התחילו מהתחום המשפטי הקרוב למצבכם והמשיכו למדריכים ממוקדים.', 'justice-theme' ); ?>
			</p>
		</div>

		<div class="practice-areas-grid">
			<?php
			foreach ( $terms as $term ) {
				get_template_part(
					'template-parts/cards/practice-area-card',
					null,
					array( 'term' => $term )
				);
			}
			?>
		</div>
	</div>
</section>

