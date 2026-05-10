<?php
/**
 * Lightweight public lead-form spam guard.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_post_justice_submit_lead', 'justice_theme_guard_lead_submission_spam', 0 );
add_action( 'admin_post_nopriv_justice_submit_lead', 'justice_theme_guard_lead_submission_spam', 0 );

/**
 * Render hidden anti-spam fields for lead forms.
 */
function justice_theme_render_lead_spam_fields(): void {
	static $field_index = 0;
	++$field_index;
	$field_id = 'justice-lead-company-' . $field_index;
	?>
	<div class="justice-lead-guard" aria-hidden="true">
		<label for="<?php echo esc_attr( $field_id ); ?>"><?php esc_html_e( 'Company', 'justice-theme' ); ?></label>
		<input id="<?php echo esc_attr( $field_id ); ?>" type="text" name="justice_lead_company" value="" tabindex="-1" autocomplete="off">
	</div>
	<input type="hidden" name="justice_lead_started_at" value="<?php echo esc_attr( (string) time() ); ?>">
	<?php
}

/**
 * Block obvious bot submissions before the plugin creates a CRM lead.
 */
function justice_theme_guard_lead_submission_spam(): void {
	$honeypot = isset( $_POST['justice_lead_company'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['justice_lead_company'] ) ) ) : '';
	if ( '' !== $honeypot ) {
		justice_theme_redirect_blocked_lead_submission( 'honeypot' );
	}

	$started_at = isset( $_POST['justice_lead_started_at'] ) ? absint( $_POST['justice_lead_started_at'] ) : 0;
	if ( 0 === $started_at ) {
		return;
	}

	$age = time() - $started_at;
	if ( $age < 3 || $age > DAY_IN_SECONDS ) {
		justice_theme_redirect_blocked_lead_submission( 'timing' );
	}
}

/**
 * Redirect blocked submissions without creating a public error page.
 *
 * @param string $reason Block reason.
 */
function justice_theme_redirect_blocked_lead_submission( string $reason ): void {
	$target = wp_get_referer() ?: home_url( '/' );

	wp_safe_redirect(
		add_query_arg(
			array(
				'lead'        => 'blocked',
				'lead_reason' => sanitize_key( $reason ),
			),
			$target
		)
	);
	exit;
}
