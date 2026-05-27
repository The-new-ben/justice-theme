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
 * Return public lead-area options in display order.
 *
 * @return array<string, string>
 */
function justice_theme_lead_area_options(): array {
	return array(
		'family-law'              => __( 'משפחה וגירושין', 'justice-theme' ),
		'criminal-law'            => __( 'משפט פלילי', 'justice-theme' ),
		'real-estate-law'         => __( 'מקרקעין ונדל״ן', 'justice-theme' ),
		'medical-malpractice-law' => __( 'רשלנות רפואית', 'justice-theme' ),
		'personal-injury-law'     => __( 'נזיקין ותאונות', 'justice-theme' ),
		'traffic-law'             => __( 'תעבורה', 'justice-theme' ),
		'labor-law'               => __( 'דיני עבודה', 'justice-theme' ),
		'inheritance-law'         => __( 'ירושה וצוואות', 'justice-theme' ),
		'national-insurance'      => __( 'ביטוח לאומי', 'justice-theme' ),
		'uk-law'                  => __( 'UK / cross-border law', 'justice-theme' ),
		'thailand-law'            => __( 'תאילנד / משפט בינלאומי', 'justice-theme' ),
		'general'                 => __( 'אחר / לא בטוח', 'justice-theme' ),
	);
}

/**
 * Return the lead areas accepted by public lead forms.
 *
 * @return array<int, string>
 */
function justice_theme_lead_area_values(): array {
	return array_keys( justice_theme_lead_area_options() );
}

/**
 * Render a lead-area select option set from the canonical public vocabulary.
 *
 * @param string $selected    Selected area slug.
 * @param string $placeholder Placeholder label.
 */
function justice_theme_render_lead_area_options( string $selected = '', string $placeholder = '' ): void {
	$placeholder = '' !== $placeholder ? $placeholder : __( 'בחרו תחום משפטי', 'justice-theme' );
	?>
	<option value="" <?php selected( $selected, '' ); ?>><?php echo esc_html( $placeholder ); ?></option>
	<?php foreach ( justice_theme_lead_area_options() as $area_value => $area_label ) : ?>
		<option value="<?php echo esc_attr( $area_value ); ?>" <?php selected( $selected, $area_value ); ?>><?php echo esc_html( $area_label ); ?></option>
	<?php endforeach; ?>
	<?php
}

/**
 * Read a safe area prefill from the current request.
 */
function justice_theme_current_lead_prefill_area(): string {
	$area = isset( $_GET['lead_area'] ) ? sanitize_key( wp_unslash( $_GET['lead_area'] ) ) : '';

	return in_array( $area, justice_theme_lead_area_values(), true ) ? $area : '';
}

/**
 * Read a safe editable message prefill from the current request.
 */
function justice_theme_current_lead_prefill_message(): string {
	$message = isset( $_GET['lead_message'] ) ? sanitize_textarea_field( wp_unslash( $_GET['lead_message'] ) ) : '';
	$message = trim( preg_replace( '/\s+/', ' ', $message ) );

	if ( '' === $message ) {
		return '';
	}

	return function_exists( 'mb_substr' ) ? mb_substr( $message, 0, 260, 'UTF-8' ) : substr( $message, 0, 260 );
}

/**
 * Read a safe lead-source surface from the current request.
 *
 * @param string $fallback Surface to use when no query value is present.
 */
function justice_theme_current_lead_source_surface( string $fallback = 'homepage_ask_lawyer' ): string {
	$surface  = isset( $_GET['lead_source_surface'] ) ? sanitize_key( wp_unslash( $_GET['lead_source_surface'] ) ) : '';
	$fallback = sanitize_key( $fallback );

	return '' !== $surface ? $surface : $fallback;
}

/**
 * Build a contextual fallback URL for homepage lead capture.
 *
 * @param array<string, string> $args Query arguments.
 */
function justice_theme_ask_lawyer_fallback_url( array $args = array() ): string {
	$query               = array();
	$query_keys          = array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'source_keyword' );
	$lead_area           = isset( $args['lead_area'] ) ? sanitize_key( $args['lead_area'] ) : '';
	$lead_message        = isset( $args['lead_message'] ) ? sanitize_textarea_field( $args['lead_message'] ) : '';
	$lead_source_surface = isset( $args['lead_source_surface'] ) ? sanitize_key( $args['lead_source_surface'] ) : '';

	if ( in_array( $lead_area, justice_theme_lead_area_values(), true ) ) {
		$query['lead_area'] = $lead_area;
	}

	if ( '' !== trim( $lead_message ) ) {
		$query['lead_message'] = trim( preg_replace( '/\s+/', ' ', $lead_message ) );
	}

	if ( '' !== $lead_source_surface ) {
		$query['lead_source_surface'] = $lead_source_surface;
	}

	foreach ( $query_keys as $key ) {
		if ( isset( $args[ $key ] ) && '' !== trim( (string) $args[ $key ] ) ) {
			$query[ $key ] = sanitize_text_field( $args[ $key ] );
		}
	}

	return add_query_arg( $query, home_url( '/' ) ) . '#ask-lawyer';
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

	if ( is_front_page() || is_home() ) {
		return 'עורך דין / עורכי דין / הכוונה משפטית';
	}

	if ( is_post_type_archive( 'justice_lawyer' ) ) {
		return 'מדריך עורכי דין לפי תחום ואזור';
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
