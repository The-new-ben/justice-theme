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

$lead_prefill_area    = function_exists( 'justice_theme_current_lead_prefill_area' ) ? justice_theme_current_lead_prefill_area() : '';
$lead_prefill_message = function_exists( 'justice_theme_current_lead_prefill_message' ) ? justice_theme_current_lead_prefill_message() : '';
?>

<section class="ask-lawyer section" id="ask-lawyer">
	<div class="container ask-lawyer__inner">
		<div class="ask-lawyer__content">
			<p class="section-header__eyebrow"><?php esc_html_e( 'פנייה משפטית מסודרת', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'השאירו פנייה עכשיו ונבין לאיזה מסלול משפטי היא שייכת', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'כתבו מה קרה, באיזו עיר מדובר, מה הדחיפות ומה כבר קיבלתם בכתב. המטרה היא להפוך לחץ לפנייה ברורה שאפשר לבדוק, לסווג ולהעביר לעורך דין מתאים רק אם יש התאמה והסכמה.', 'justice-theme' ); ?></p>
			<div class="ask-lawyer__visual">
				<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/ask-lawyer-visual.png' ); ?>"
					alt="<?php esc_attr_e( 'ייעוץ משפטי מקוון — שיחת וידאו עם עורך דין', 'justice-theme' ); ?>"
					width="520" height="340" loading="lazy" decoding="async">
			</div>
		</div>

		<form class="ask-lawyer__form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="justice_submit_lead">
			<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>
			<?php justice_theme_render_lead_spam_fields(); ?>
			<?php justice_theme_render_lead_attribution_fields(); ?>
			<div class="ask-lawyer__fields">
				<div class="ask-lawyer__field">
					<label for="ask-name"><?php esc_html_e( 'שם', 'justice-theme' ); ?></label>
					<input id="ask-name" type="text" name="lead_name" required>
				</div>
				<div class="ask-lawyer__field">
					<label for="ask-phone"><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></label>
					<input id="ask-phone" type="tel" name="lead_phone" required>
				</div>
				<div class="ask-lawyer__field">
					<label for="ask-email"><?php esc_html_e( 'אימייל', 'justice-theme' ); ?></label>
					<input id="ask-email" type="email" name="lead_email" autocomplete="email">
				</div>
				<div class="ask-lawyer__field">
					<label for="ask-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
					<select id="ask-area" name="lead_area" required>
						<?php justice_theme_render_lead_area_options( $lead_prefill_area, __( 'בחרו תחום', 'justice-theme' ) ); ?>
					</select>
				</div>
				<div class="ask-lawyer__field">
					<label for="ask-city"><?php esc_html_e( 'עיר / אזור', 'justice-theme' ); ?></label>
					<input id="ask-city" type="text" name="lead_city" autocomplete="address-level2">
				</div>
				<div class="ask-lawyer__field">
					<label for="ask-urgency"><?php esc_html_e( 'דחיפות', 'justice-theme' ); ?></label>
					<select id="ask-urgency" name="lead_urgency">
						<option value="normal"><?php esc_html_e( 'רגיל', 'justice-theme' ); ?></option>
						<option value="high"><?php esc_html_e( 'דחוף', 'justice-theme' ); ?></option>
						<option value="low"><?php esc_html_e( 'התייעצות ראשונית', 'justice-theme' ); ?></option>
					</select>
				</div>
				<div class="ask-lawyer__field ask-lawyer__field--full">
					<label for="ask-message"><?php esc_html_e( 'תיאור הבעיה המשפטית', 'justice-theme' ); ?></label>
					<textarea id="ask-message" name="lead_message" rows="4" required><?php echo esc_textarea( $lead_prefill_message ); ?></textarea>
				</div>
			</div>
			<div class="ask-lawyer__consent">
				<label>
					<input type="checkbox" name="lead_consent" value="1" required>
					<?php esc_html_e( 'אני מסכים/ה לתנאי השימוש ומדיניות הפרטיות', 'justice-theme' ); ?>
				</label>
			</div>
			<button type="submit" class="button button--gold">
				<?php esc_html_e( 'שליחת פנייה לבדיקה', 'justice-theme' ); ?>
			</button>
			<p class="ask-lawyer__disclaimer"><?php esc_html_e( 'הפנייה אינה ייעוץ משפטי ואינה התחייבות להעברה לעורך דין. ניצור קשר רק לפי הפרטים שמסרתם ובהתאם להסכמה שנתתם.', 'justice-theme' ); ?></p>
		</form>
	</div>
</section>
