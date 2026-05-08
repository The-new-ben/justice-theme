<?php
/**
 * Ask a Lawyer section — lead capture + future Q&A.
 *
 * Based on din.co.il's "שאלו עורך דין" — proven conversion element.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="ask-lawyer section" id="ask-lawyer">
	<div class="container ask-lawyer__inner">
		<div class="ask-lawyer__content">
			<p class="section-header__eyebrow"><?php esc_html_e( 'ייעוץ משפטי ראשוני', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'שאלה משפטית? קבלו הכוונה ראשונית', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'תארו את הבעיה המשפטית שלכם בקצרה ונפנה אתכם לעורך הדין המתאים בתחום ובאזור שלכם.', 'justice-theme' ); ?></p>
		</div>

		<form class="ask-lawyer__form" method="post" action="#">
			<div class="ask-lawyer__fields">
				<div class="ask-lawyer__field">
					<label for="ask-name"><?php esc_html_e( 'שם', 'justice-theme' ); ?></label>
					<input id="ask-name" type="text" name="name" required>
				</div>
				<div class="ask-lawyer__field">
					<label for="ask-phone"><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></label>
					<input id="ask-phone" type="tel" name="phone" required>
				</div>
				<div class="ask-lawyer__field ask-lawyer__field--full">
					<label for="ask-message"><?php esc_html_e( 'תיאור הבעיה המשפטית', 'justice-theme' ); ?></label>
					<textarea id="ask-message" name="message" rows="3" required></textarea>
				</div>
			</div>
			<div class="ask-lawyer__consent">
				<label>
					<input type="checkbox" name="consent" required>
					<?php esc_html_e( 'אני מסכים/ה לתנאי השימוש ומדיניות הפרטיות', 'justice-theme' ); ?>
				</label>
			</div>
			<button type="submit" class="button button--gold">
				<?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?>
			</button>
			<p class="ask-lawyer__disclaimer"><?php esc_html_e( 'הפנייה אינה מהווה ייעוץ משפטי. המידע יועבר לעורך דין מתאים בכפוף להסכמתכם.', 'justice-theme' ); ?></p>
		</form>
	</div>
</section>
