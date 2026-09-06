<?php
/**
 * Live courtroom simulation band, new look (v3). Fourth section, honest copy:
 * a preparation tool, not legal advice and not evidence.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_simulation = justice_theme_look3_resolve( array( 'legal-simulation' ), 'https://jus-tice.com/' );

if ( ! $justice_simulation ) {
	return;
}
?>

<section class="l3-sim" id="simulation" aria-label="<?php esc_attr_e( 'סימולציית בית משפט חיה', 'justice-theme' ); ?>">
	<div class="l3-sim__copy">
		<span class="l3-kicker l3-kicker--light"><?php esc_html_e( 'סימולציית בית משפט חיה', 'justice-theme' ); ?></span>
		<h2 class="l3-h2 l3-h2--light"><?php esc_html_e( 'לפני שפונים לעורך דין: תארו את המקרה במשפט אחד וצפו בדיון', 'justice-theme' ); ?></h2>
		<p><?php esc_html_e( 'שופטת, עורכי דין ועדים דנים במקרה שלכם, בעברית. אפשר להתערב באמצע, לתקן פרט, ולצאת עם דוח הכנה: מה צריך להוכיח, אילו מסמכים חסרים, מה ציר הזמן. כלי הכנה. לא ייעוץ משפטי ולא ראיה.', 'justice-theme' ); ?></p>
		<div class="l3-sim__actions">
			<a class="l3-btn l3-btn--outline-light" href="<?php echo esc_url( $justice_simulation['url'] ); ?>"><?php esc_html_e( 'התחלת סימולציה', 'justice-theme' ); ?></a>
			<span class="l3-sim__note"><?php esc_html_e( 'ללא הרשמה · ללא תשלום', 'justice-theme' ); ?></span>
		</div>
	</div>
	<a class="l3-sim__media" href="<?php echo esc_url( $justice_simulation['url'] ); ?>" aria-label="<?php esc_attr_e( 'מעבר לסימולציית בית המשפט', 'justice-theme' ); ?>">
		<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/look3-arena.jpg' ); ?>" alt="<?php esc_attr_e( 'זירת הדיון החיה: שופטת ועורכי דין דנים בתיק', 'justice-theme' ); ?>" width="1200" height="675" loading="lazy" decoding="async">
		<span class="l3-sim__live"><span aria-hidden="true"></span><?php esc_html_e( 'דיון חי', 'justice-theme' ); ?></span>
	</a>
</section>
