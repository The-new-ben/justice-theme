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
				<span class="lawyer-cta__icon" aria-hidden="true">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
				</span>
				<h3><?php esc_html_e( 'פרופיל מקצועי', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'דף עורך דין מותאם עם תחומי התמחות, ניסיון, ותמונה מקצועית.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
				</span>
				<h3><?php esc_html_e( 'קבלת פניות', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'פניות ממוקדות מגולשים הזקוקים לייצוג בדיוק בתחום שלכם.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-cta__feature">
				<span class="lawyer-cta__icon" aria-hidden="true">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>
				</span>
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
