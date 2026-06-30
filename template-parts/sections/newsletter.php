<?php
/**
 * Newsletter signup section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="newsletter section">
	<div class="container newsletter__inner">
		<div class="newsletter__content">
			<h2><?php esc_html_e( 'עדכונים משפטיים חשובים ישירות למייל', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'הישארו מעודכנים עם שינויי חקיקה, פסקי דין חשובים, ומדריכים משפטיים חדשים, ישירות לתיבת הדואר.', 'justice-theme' ); ?></p>
		</div>
		<form class="newsletter__form" method="post" action="#">
			<label class="screen-reader-text" for="newsletter-email"><?php esc_html_e( 'כתובת אימייל', 'justice-theme' ); ?></label>
			<input id="newsletter-email" type="email" name="email" placeholder="<?php echo esc_attr__( 'כתובת האימייל שלכם', 'justice-theme' ); ?>" required>
			<button type="submit" class="button button--gold"><?php esc_html_e( 'הרשמה', 'justice-theme' ); ?></button>
		</form>
		<p class="newsletter__disclaimer"><?php esc_html_e( 'ללא ספאם. ביטול בכל עת.', 'justice-theme' ); ?></p>
	</div>
</section>
