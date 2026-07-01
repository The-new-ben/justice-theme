<?php
/**
 * Final CTA per Homepage.dc.html.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone      = justice_theme_option( 'justice_phone', '0525101555' );
$justice_phone_href = 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone );
?>

<section class="jt2-final" id="final-cta">
	<h2><?php esc_html_e( 'מוכנים להתחיל?', 'justice-theme' ); ?></h2>
	<p><?php esc_html_e( 'חיפוש חינם לפי תחום ומיקום, ייעוץ ראשוני, ומדריכים מקצועיים שיעזרו לכם לקבל החלטה מושכלת.', 'justice-theme' ); ?></p>
	<div class="jt2-final__ctas">
		<a class="button button--primary" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'חיפוש עורך דין', 'justice-theme' ); ?></a>
		<?php if ( $justice_phone ) : ?>
			<a class="button button--ghost" href="<?php echo esc_url( $justice_phone_href ); ?>" dir="ltr"><?php echo esc_html( $justice_phone ); ?></a>
		<?php endif; ?>
	</div>
</section>
