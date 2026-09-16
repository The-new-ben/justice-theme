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
		<span class="l3-kicker l3-kicker--light"><?php esc_html_e( 'Hadmaya · מתכוננים לשיחה הבאה', 'justice-theme' ); ?></span>
		<h2 class="l3-h2 l3-h2--light"><?php esc_html_e( 'מקום לתרגל. זמן להתכונן.', 'justice-theme' ); ?></h2>
		<p><?php esc_html_e( 'תארו את המקרה והיכנסו לסימולציה משפטית בעברית. תרגלו תשובות, בחנו את טענות הצד השני ותקנו פרטים במהלך הדיון. התרגול נועד להכנה ואינו תחליף לייעוץ משפטי.', 'justice-theme' ); ?></p>
		<div class="l3-sim__actions">
			<a class="l3-btn l3-btn--outline-light" href="<?php echo esc_url( $justice_simulation['url'] ); ?>"><?php esc_html_e( 'התחלת סימולציה', 'justice-theme' ); ?></a>
			<a class="l3-btn l3-btn--outline-light" href="https://jus-tice.com/he/how-it-works/"><?php esc_html_e( 'איך משתמשים במערכת?', 'justice-theme' ); ?></a>
			<span class="l3-sim__note"><?php esc_html_e( 'ללא הרשמה · ללא תשלום', 'justice-theme' ); ?></span>
		</div>
	</div>
	<a class="l3-sim__media" href="<?php echo esc_url( $justice_simulation['url'] ); ?>" aria-label="<?php esc_attr_e( 'מעבר לסימולציית בית המשפט', 'justice-theme' ); ?>">
		<img src="https://jus-tice.com/brand/hadmaya-cockpit-controls-en-v1.webp" alt="משתתפים ותמלול בתוך מערכת הסימולציה, עם עריכת פרטים ובקרת השמעה" width="1368" height="1105" loading="lazy" decoding="async">
		<span class="l3-sim__live"><span aria-hidden="true"></span><?php esc_html_e( 'לסימולציה המשפטית', 'justice-theme' ); ?></span>
	</a>
</section>