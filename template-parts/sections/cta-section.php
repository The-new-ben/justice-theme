<?php
/**
 * CTA section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone = justice_theme_option( 'justice_phone', '03-6161535' );
?>

<section class="cta-section">
	<div class="container cta-section__inner">
		<h2><?php esc_html_e( 'צריכים עזרה משפטית?', 'justice-theme' ); ?></h2>
		<p><?php esc_html_e( 'שלחו פנייה קצרה ונעזור להפנות אותה לתחום המשפטי הרלוונטי.', 'justice-theme' ); ?></p>

		<div class="cta-section__actions">
			<?php if ( $justice_phone ) : ?>
				<a class="button button--gold" href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>">
					<?php
					printf(
						/* translators: %s: phone number. */
						esc_html__( 'חייגו %s', 'justice-theme' ),
						esc_html( $justice_phone )
					);
					?>
				</a>
			<?php endif; ?>

			<a class="button button--outline" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">
				<?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?>
			</a>
		</div>
	</div>
</section>

