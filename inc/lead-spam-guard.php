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
 * Render hidden attribution fields so SEO/ad context reaches the lead CRM.
 */
function justice_theme_render_lead_attribution_fields(): void {
	$source_keyword = justice_theme_get_current_lead_source_keyword();

	if ( '' !== $source_keyword ) {
		echo '<input type="hidden" name="source_keyword" value="' . esc_attr( $source_keyword ) . '">' . "\n";
	}

	foreach ( array( 'utm_source', 'utm_campaign', 'utm_medium' ) as $utm_key ) {
		$value = isset( $_GET[ $utm_key ] ) ? sanitize_text_field( wp_unslash( $_GET[ $utm_key ] ) ) : '';
		if ( '' !== $value ) {
			echo '<input type="hidden" name="' . esc_attr( $utm_key ) . '" value="' . esc_attr( $value ) . '">' . "\n";
		}
	}
}

/**
 * Resolve a public source keyword for lead attribution.
 */
function justice_theme_get_current_lead_source_keyword(): string {
	foreach ( array( 'source_keyword', 'keyword', 's', 'utm_term' ) as $query_key ) {
		if ( ! empty( $_GET[ $query_key ] ) ) {
			return sanitize_text_field( wp_unslash( $_GET[ $query_key ] ) );
		}
	}

	$queried_id = get_queried_object_id();
	if ( ! $queried_id ) {
		return '';
	}

	foreach ( array( 'primary_keyword', 'top_keyword', 'target_keyword' ) as $meta_key ) {
		$value = get_post_meta( $queried_id, $meta_key, true );
		if ( is_string( $value ) && '' !== trim( $value ) ) {
			return sanitize_text_field( $value );
		}
	}

	if ( is_singular() ) {
		return sanitize_text_field( get_the_title( $queried_id ) );
	}

	return '';
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
