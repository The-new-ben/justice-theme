<?php
/**
 * AI legal tools app: page template support, lead-gate REST endpoint,
 * and document attachment for the gated AI document generator at
 * /legal-tools/.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the extra request meta this endpoint writes that isn't
 * already declared by the LegalTech intake plugin.
 */
function justice_theme_register_legal_tools_lead_meta() {
	if ( ! post_type_exists( 'justice_legal_request' ) ) {
		return;
	}

	register_post_meta(
		'justice_legal_request',
		'attached_document_id',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'integer',
			'auth_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'justice_theme_register_legal_tools_lead_meta', 20 );

/**
 * Register the lead-gate REST route. This is what unlocks AI-enhanced
 * output, copy, print and download in the gated app - the free template
 * draft itself never touches this endpoint.
 */
function justice_theme_register_legal_tools_lead_route() {
	register_rest_route(
		'justice/v1',
		'/legal-tools/lead',
		array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
			'callback'            => 'justice_theme_handle_legal_tools_lead',
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_legal_tools_lead_route' );

/**
 * Handle the gated lead submission: create a justice_legal_request post
 * (same CPT and meta schema the rest of the LegalTech intake already
 * uses) and, if a document was attached, sideload it as a private
 * attachment linked to the request for lawyer review.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_theme_handle_legal_tools_lead( WP_REST_Request $request ) {
	// Honeypot: a filled hidden field means a bot filled every input.
	$honeypot = $request->get_param( 'lead_hp' );
	if ( ! empty( $honeypot ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	$name    = sanitize_text_field( (string) $request->get_param( 'lead_name' ) );
	$phone   = sanitize_text_field( (string) $request->get_param( 'lead_phone' ) );
	$email   = sanitize_email( (string) $request->get_param( 'lead_email' ) );
	$consent = (string) $request->get_param( 'lead_consent' );

	if ( '' === $name || '' === $phone || '' === $consent ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'missing_fields' ), 400 );
	}

	if ( ! post_type_exists( 'justice_legal_request' ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'unavailable' ), 200 );
	}

	$tool_id        = sanitize_text_field( (string) $request->get_param( 'tool_id' ) );
	$tool_title     = sanitize_text_field( (string) $request->get_param( 'tool_title' ) );
	$lang           = sanitize_text_field( (string) $request->get_param( 'lang' ) );
	$fields_json    = (string) $request->get_param( 'fields' );
	$draft_excerpt  = sanitize_textarea_field( (string) $request->get_param( 'draft_excerpt' ) );
	$fields_decoded = json_decode( $fields_json, true );
	$fields_summary = is_array( $fields_decoded ) ? wp_json_encode( $fields_decoded, JSON_UNESCAPED_UNICODE ) : '{}';

	$request_id = wp_insert_post(
		array(
			'post_type'    => 'justice_legal_request',
			'post_status'  => 'private',
			'post_title'   => sprintf( 'AI Legal Tools - %s - %s', $tool_title ?: $tool_id ?: 'tool', $name ),
			'post_content' => $draft_excerpt,
		)
	);

	if ( ! $request_id || is_wp_error( $request_id ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'save_failed' ), 200 );
	}

	update_post_meta( $request_id, 'visitor_name', $name );
	update_post_meta( $request_id, 'visitor_phone', $phone );
	update_post_meta( $request_id, 'visitor_email', $email );
	update_post_meta( $request_id, 'legal_area', $tool_id );
	update_post_meta( $request_id, 'status', 'new' );
	update_post_meta( $request_id, 'payment_status', 'not_started' );
	update_post_meta( $request_id, 'consent', true );
	update_post_meta( $request_id, 'source_url', home_url( '/legal-tools/' ) );
	update_post_meta( $request_id, 'intake_summary', $fields_summary );
	update_post_meta( $request_id, 'ai_draft', $draft_excerpt );

	$files = $request->get_file_params();
	if ( ! empty( $files['lead_document'] ) && empty( $files['lead_document']['error'] ) ) {
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
		}

		$allowed_types = array(
			'pdf'  => 'application/pdf',
			'doc'  => 'application/msword',
			'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'jpg'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'png'  => 'image/png',
		);

		$upload = wp_handle_upload(
			$files['lead_document'],
			array(
				'test_form' => false,
				'mimes'     => $allowed_types,
			)
		);

		if ( ! empty( $upload['file'] ) && empty( $upload['error'] ) ) {
			$attachment_id = wp_insert_attachment(
				array(
					'post_mime_type' => $upload['type'],
					'post_title'     => sanitize_file_name( basename( $upload['file'] ) ),
					'post_status'    => 'private',
					'post_parent'    => $request_id,
				),
				$upload['file'],
				$request_id
			);

			if ( $attachment_id && ! is_wp_error( $attachment_id ) ) {
				wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );
				update_post_meta( $request_id, 'attached_document_id', $attachment_id );
			}
		}
	}

	do_action( 'justice_theme_legal_tools_lead_captured', $request_id );

	return new WP_REST_Response( array( 'ok' => true, 'request_id' => $request_id ), 200 );
}

/**
 * True when the current request resolved to the page whose slug is
 * "legal-tools", checked directly against the queried post object instead
 * of is_page(). The justice_legal_tool CPT also registers a rewrite slug
 * of "legal-tools" (its archive base), which leaves this site's main query
 * with is_page=false / is_single=true for that page even though the right
 * page object (post_type "page", post_name "legal-tools") is what's
 * actually loaded - so is_page('legal-tools') is not reliable here.
 *
 * @return bool
 */
function justice_theme_is_legal_tools_page(): bool {
	$queried = get_queried_object();

	if ( $queried instanceof WP_Post && 'page' === $queried->post_type && 'legal-tools' === $queried->post_name ) {
		return true;
	}

	// Fallback for hooks that fire before the main query settles on this
	// page (e.g. wp_enqueue_scripts can run before get_queried_object() is
	// reliable here, the same collision noted above). Matches the bare
	// /legal-tools/ request path directly, independent of query state.
	$request_path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '';

	return 'legal-tools' === trim( (string) $request_path, '/' );
}

/**
 * Force page-legal-tools.php for the /legal-tools/ page.
 *
 * WP's automatic page-{slug}.php template hierarchy should already pick this
 * up, but the live page for this slug was previously rendering through the
 * generic page template (with an <iframe> to a manually-uploaded copy of the
 * app baked into its post_content) and not the new template - this explicit
 * template_include override guarantees the gated app renders regardless of
 * how that page's content or template assignment is set in the database.
 *
 * @param string $template Resolved template path.
 * @return string
 */
function justice_theme_force_legal_tools_template( $template ) {
	if ( is_admin() ) {
		return $template;
	}

	if ( ! justice_theme_is_legal_tools_page() ) {
		return $template;
	}

	$forced = JUSTICE_THEME_DIR . '/page-legal-tools.php';

	return file_exists( $forced ) ? $forced : $template;
}
add_filter( 'template_include', 'justice_theme_force_legal_tools_template', 99 );

/**
 * Map a practice-areas term slug to the most relevant drafting tool in
 * the AI tools app (real tool IDs from the catalog).
 *
 * @param string $area_slug Practice-area term slug.
 * @return array{0:string,1:string} Tool id and Hebrew label.
 */
function justice_theme_area_matched_tool( string $area_slug ): array {
	$map = array(
		'family-law'          => array( 'divorce-settlement', 'טיוטת הסכם גירושין' ),
		'inheritance-law'     => array( 'simple-will', 'טיוטת צוואה פשוטה' ),
		'real-estate-law'     => array( 'residential-lease', 'בדיקת חוזה שכירות' ),
		'labor-law'           => array( 'hearing-request', 'בקשה לשימוע לפני פיטורים' ),
		'traffic-law'         => array( 'ticket-appeal', 'ערעור על דוח תנועה' ),
		'torts'               => array( 'accident-demand', 'מכתב דרישה אחרי תאונה' ),
		'medical-malpractice' => array( 'accident-demand', 'מכתב דרישה בנזקי גוף' ),
		'debt-collection'     => array( 'debt-settlement', 'הסדר חוב' ),
		'tax-law'             => array( 'demand-letter', 'מכתב התראה' ),
	);

	return isset( $map[ $area_slug ] ) ? $map[ $area_slug ] : array( 'demand-letter', 'מכתב התראה' );
}

/**
 * Content ↔ tool ↔ lawyer mesh: append a practice-area-matched AI tool
 * CTA (hearing simulation + the area's drafting tool) to every article,
 * carrying the area as a deep-link the app understands (?area=).
 *
 * @param string $content Post content.
 * @return string
 */
function justice_theme_article_tools_mesh( string $content ): string {
	if ( ! is_singular( 'articles' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	if ( ! function_exists( 'justice_theme_public_path_is_published' ) || ! justice_theme_public_path_is_published( '/legal-tools/' ) ) {
		return $content;
	}

	$area_slug = '';
	$terms     = get_the_terms( get_the_ID(), 'practice-areas' );
	if ( is_array( $terms ) && ! empty( $terms ) ) {
		$area_slug = (string) $terms[0]->slug;
	}

	$tools_hub      = home_url( '/legal-tools/' );
	$simulation_url = add_query_arg(
		array_filter(
			array(
				'tool' => 'hearing-simulation',
				'area' => $area_slug,
			)
		),
		$tools_hub
	);

	$matched          = justice_theme_area_matched_tool( $area_slug );
	$matched_tool_url = add_query_arg(
		array_filter(
			array(
				'tool' => $matched[0],
				'area' => $area_slug,
			)
		),
		$tools_hub
	);

	$lawyers_url = $area_slug
		? home_url( '/lawyers/?area=' . rawurlencode( $area_slug ) )
		: home_url( '/lawyers/' );

	$block  = '<div class="jt2-lawyer-cta" data-jt2-mesh="article_tools">';
	$block .= '<div><strong>' . esc_html__( 'להתכונן לפני שפונים: כלי AI לפי הנושא של המדריך', 'justice-theme' ) . '</strong>';
	$block .= '<span>' . esc_html__( 'טיוטה בסיסית חינם ובלי הרשמה. המסמך אינו ייעוץ משפטי.', 'justice-theme' ) . '</span></div>';
	$block .= '<div style="display:flex;gap:10px;flex-wrap:wrap">';
	$block .= '<a href="' . esc_url( $simulation_url ) . '" data-lead-utm-source="article_mesh" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="hearing_simulation">' . esc_html__( 'סימולציית דיון משפטי', 'justice-theme' ) . '</a>';
	$block .= '<a href="' . esc_url( $matched_tool_url ) . '" data-lead-utm-source="article_mesh" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="area_tool">' . esc_html( $matched[1] ) . '</a>';
	$block .= '<a href="' . esc_url( $lawyers_url ) . '" data-lead-utm-source="article_mesh" data-lead-utm-medium="directory" data-lead-utm-campaign="area_lawyers">' . esc_html__( 'עורכי דין בתחום', 'justice-theme' ) . '</a>';
	$block .= '</div></div>';

	return $content . $block;
}
add_filter( 'the_content', 'justice_theme_article_tools_mesh', 26 );
