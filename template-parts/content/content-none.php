<?php
/**
 * No content found.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="content-none">
	<h2><?php esc_html_e( 'לא נמצאו תוצאות', 'justice-theme' ); ?></h2>
	<p><?php esc_html_e( 'לא נמצאו תוצאות שמתאימות לחיפוש. נסו ניסוח אחר, חיפוש לפי תחום משפטי או מעבר למדריכי התחומים.', 'justice-theme' ); ?></p>

	<?php get_template_part( 'template-parts/forms/search-form-legal' ); ?>
</div>
