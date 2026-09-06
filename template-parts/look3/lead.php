<?php
/**
 * Lead form, new look (v3). Same backend as the classic "ask a lawyer" form
 * (admin-post justice_submit_lead, nonce, spam and attribution fields); the
 * copy follows the language bank: "השאירו פרטים ונחזור אליכם בהקדם", "שליחה".
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_lead_prefill_area    = function_exists( 'justice_theme_current_lead_prefill_area' ) ? justice_theme_current_lead_prefill_area() : '';
$justice_lead_prefill_message = function_exists( 'justice_theme_current_lead_prefill_message' ) ? justice_theme_current_lead_prefill_message() : '';
$justice_lead_source_surface  = function_exists( 'justice_theme_current_lead_source_surface' ) ? justice_theme_current_lead_source_surface( 'homepage_look3_lead' ) : 'homepage_look3_lead';
$justice_lead_notice          = isset( $_GET['lead'] ) ? sanitize_key( wp_unslash( $_GET['lead'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$justice_lead_notice_messages = array(
	'success' => array(
		'type' => 'success',
		'text' => __( 'הפנייה התקבלה. נבדוק את הפרטים ונחזור אליכם בהקדם.', 'justice-theme' ),
	),
	'missing' => array(
		'type' => 'error',
		'text' => __( 'חסרים שם או טלפון. מלאו את הפרטים החסרים ושלחו שוב.', 'justice-theme' ),
	),
	'blocked' => array(
		'type' => 'error',
		'text' => __( 'הפנייה לא נשלחה בגלל בדיקת אבטחה. נסו שוב בעוד כמה שניות.', 'justice-theme' ),
	),
);
$justice_lead_notice_message  = isset( $justice_lead_notice_messages[ $justice_lead_notice ] ) ? $justice_lead_notice_messages[ $justice_lead_notice ] : null;
?>

<section class="l3-lead" id="ask-lawyer">
	<div class="l3-lead__copy">
		<span class="l3-kicker"><?php esc_html_e( 'ייעוץ אישי', 'justice-theme' ); ?></span>
		<h2 class="l3-h2"><?php esc_html_e( 'השאירו פרטים ועורך דין מתאים יחזור אליכם בהקדם', 'justice-theme' ); ?></h2>
		<p><?php esc_html_e( 'הפנייה מועברת לעורך דין מתאים לתחום ולעיר. ללא תשלום וללא התחייבות. הפנייה אינה מהווה ייעוץ משפטי.', 'justice-theme' ); ?></p>
	</div>

	<form class="l3-lead__form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<?php if ( $justice_lead_notice_message ) : ?>
			<div class="l3-lead__notice l3-lead__notice--<?php echo esc_attr( $justice_lead_notice_message['type'] ); ?>" role="status">
				<?php echo esc_html( $justice_lead_notice_message['text'] ); ?>
			</div>
		<?php endif; ?>
		<input type="hidden" name="action" value="justice_submit_lead">
		<input type="hidden" name="lead_source_surface" value="<?php echo esc_attr( $justice_lead_source_surface ); ?>">
		<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>
		<?php
		if ( function_exists( 'justice_theme_render_lead_spam_fields' ) ) {
			justice_theme_render_lead_spam_fields();
		}
		if ( function_exists( 'justice_theme_render_lead_attribution_fields' ) ) {
			justice_theme_render_lead_attribution_fields();
		}
		?>
		<div class="l3-lead__fields">
			<div class="l3-field">
				<label for="l3-lead-name"><?php esc_html_e( 'שם מלא', 'justice-theme' ); ?></label>
				<input id="l3-lead-name" type="text" name="lead_name" autocomplete="name" required>
			</div>
			<div class="l3-field">
				<label for="l3-lead-phone"><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></label>
				<input id="l3-lead-phone" type="tel" name="lead_phone" autocomplete="tel" required>
			</div>
			<div class="l3-field">
				<label for="l3-lead-area"><?php esc_html_e( 'תחום עיסוק', 'justice-theme' ); ?></label>
				<select id="l3-lead-area" name="lead_area" required>
					<?php
					if ( function_exists( 'justice_theme_render_lead_area_options' ) ) {
						justice_theme_render_lead_area_options( $justice_lead_prefill_area, __( 'בחרו תחום עיסוק', 'justice-theme' ) );
					} else {
						echo '<option value="">' . esc_html__( 'בחרו תחום עיסוק', 'justice-theme' ) . '</option>';
					}
					?>
				</select>
			</div>
			<div class="l3-field">
				<label for="l3-lead-city"><?php esc_html_e( 'עיר', 'justice-theme' ); ?></label>
				<input id="l3-lead-city" type="text" name="lead_city" autocomplete="address-level2">
			</div>
			<div class="l3-field l3-field--full">
				<label for="l3-lead-message"><?php esc_html_e( 'תיאור קצר של המצב', 'justice-theme' ); ?></label>
				<textarea id="l3-lead-message" name="lead_message" rows="3" required><?php echo esc_textarea( $justice_lead_prefill_message ); ?></textarea>
			</div>
			<input type="hidden" name="lead_urgency" value="normal">
		</div>
		<label class="l3-lead__consent">
			<input type="checkbox" name="lead_consent" value="1" required>
			<span><?php esc_html_e( 'אני מאשר/ת את תנאי השימוש ומדיניות הפרטיות', 'justice-theme' ); ?></span>
		</label>
		<button type="submit" class="l3-btn l3-btn--lead"><?php esc_html_e( 'שליחה', 'justice-theme' ); ?></button>
	</form>
</section>
