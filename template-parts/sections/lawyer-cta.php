<?php
/**
 * Lawyer CTA section — targets lawyers as customers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="lawyer-cta section">
	<div class="container lawyer-cta__inner">
		<div class="lawyer-cta__content">
			<p class="section-header__eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'עורכי דין? הצטרפו למערכת Jus-Tice', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'קבלו חשיפה לאלפי גולשים המחפשים ייצוג משפטי. פרופיל מקצועי, מאמרים בשמכם, קבלת פניות ממוקדות ומערכת ניהול לידים — הכל במקום אחד.', 'justice-theme' ); ?></p>
		</div>

		<div class="lawyer-cta__features">
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">👤</span>
				<h3><?php esc_html_e( 'פרופיל מקצועי', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'דף עורך דין מותאם עם תחומי התמחות, ניסיון, ותמונה מקצועית.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">📩</span>
				<h3><?php esc_html_e( 'קבלת פניות', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'פניות ממוקדות מגולשים הזקוקים לייצוג בדיוק בתחום שלכם.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">📊</span>
				<h3><?php esc_html_e( 'ניהול ובקרה', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'לוח בקרה אישי: פניות, מאמרים, תשלומים וסטטיסטיקות.', 'justice-theme' ); ?></p>
			</div>
		</div>

		<div class="lawyer-cta__actions">
			<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>" class="button button--gold">
				<?php esc_html_e( 'הצטרפות למערכת', 'justice-theme' ); ?>
			</a>
			<a href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>" class="button button--outline-light">
				<?php esc_html_e( 'מידע על התוכניות', 'justice-theme' ); ?>
			</a>
		</div>
	</div>
</section>
