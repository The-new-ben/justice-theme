<?php
/**
 * Lead form partial.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<form class="lead-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
	<input type="hidden" name="action" value="justice_submit_lead">
	<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>
	<?php justice_theme_render_lead_spam_fields(); ?>
	<?php justice_theme_render_lead_attribution_fields(); ?>

	<div class="lead-form__grid">
		<p class="lead-form__field">
			<label for="lead-name"><?php esc_html_e( 'שם מלא', 'justice-theme' ); ?></label>
			<input id="lead-name" type="text" name="lead_name" required>
		</p>

		<p class="lead-form__field">
			<label for="lead-phone"><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></label>
			<input id="lead-phone" type="tel" name="lead_phone" required>
		</p>

		<p class="lead-form__field">
			<label for="lead-email"><?php esc_html_e( 'אימייל', 'justice-theme' ); ?></label>
			<input id="lead-email" type="email" name="lead_email" autocomplete="email">
		</p>

		<p class="lead-form__field">
			<label for="lead-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
			<select id="lead-area" name="lead_area" required>
				<option value=""><?php esc_html_e( 'בחרו תחום משפטי', 'justice-theme' ); ?></option>
				<option value="family"><?php esc_html_e( 'דיני משפחה', 'justice-theme' ); ?></option>
				<option value="criminal"><?php esc_html_e( 'משפט פלילי', 'justice-theme' ); ?></option>
				<option value="traffic"><?php esc_html_e( 'דיני תעבורה', 'justice-theme' ); ?></option>
				<option value="real_estate"><?php esc_html_e( 'מקרקעין ונדל״ן', 'justice-theme' ); ?></option>
				<option value="labor"><?php esc_html_e( 'דיני עבודה', 'justice-theme' ); ?></option>
				<option value="damages"><?php esc_html_e( 'נזיקין', 'justice-theme' ); ?></option>
				<option value="אחר"><?php esc_html_e( 'אחר', 'justice-theme' ); ?></option>
			</select>
		</p>

		<p class="lead-form__field">
			<label for="lead-city"><?php esc_html_e( 'עיר / אזור', 'justice-theme' ); ?></label>
			<input id="lead-city" type="text" name="lead_city" autocomplete="address-level2">
		</p>

		<p class="lead-form__field">
			<label for="lead-urgency"><?php esc_html_e( 'דחיפות', 'justice-theme' ); ?></label>
			<select id="lead-urgency" name="lead_urgency">
				<option value="normal"><?php esc_html_e( 'רגיל', 'justice-theme' ); ?></option>
				<option value="high"><?php esc_html_e( 'דחוף', 'justice-theme' ); ?></option>
				<option value="low"><?php esc_html_e( 'התייעצות ראשונית', 'justice-theme' ); ?></option>
			</select>
		</p>

		<p class="lead-form__field lead-form__field--full">
			<label for="lead-message"><?php esc_html_e( 'תיאור קצר', 'justice-theme' ); ?></label>
			<textarea id="lead-message" name="lead_message" rows="5" required></textarea>
		</p>
	</div>

	<label class="lead-form__consent">
		<input type="checkbox" name="lead_consent" value="1" required>
		<span><?php esc_html_e( 'אני מאשר/ת יצירת קשר לצורך טיפול בפנייה. ידוע לי שהמידע אינו ייעוץ משפטי ואינו יוצר יחסי עורך דין-לקוח.', 'justice-theme' ); ?></span>
	</label>

	<button class="button button--gold" type="submit">
		<?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?>
	</button>
</form>

