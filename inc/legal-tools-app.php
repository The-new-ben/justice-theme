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

	$area_slug = function_exists( 'justice_theme_tools_valid_area' )
		? justice_theme_tools_valid_area( (string) $request->get_param( 'area' ) )
		: '';
	if ( '' !== $area_slug ) {
		update_post_meta( $request_id, 'practice_area_slug', $area_slug );
	}

	$contact_channel = sanitize_text_field( (string) $request->get_param( 'lead_channel' ) );
	if ( '' !== $contact_channel ) {
		update_post_meta( $request_id, 'contact_channel', $contact_channel );
	}

	if ( '1' === (string) $request->get_param( 'review_request' ) ) {
		update_post_meta( $request_id, 'human_review_requested', '1' );
	}

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
		'criminal-law'        => array( 'witness-prep', 'הכנת עדות וחקירה נגדית' ),
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
				'tool' => 'court-arena',
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
	$block .= '<a href="' . esc_url( $simulation_url ) . '" data-lead-utm-source="article_mesh" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="court_arena">' . esc_html__( 'סימולציית בית משפט על המקרה שלכם', 'justice-theme' ) . '</a>';
	$block .= '<a href="' . esc_url( $matched_tool_url ) . '" data-lead-utm-source="article_mesh" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="area_tool">' . esc_html( $matched[1] ) . '</a>';
	$block .= '<a href="' . esc_url( $lawyers_url ) . '" data-lead-utm-source="article_mesh" data-lead-utm-medium="directory" data-lead-utm-campaign="area_lawyers">' . esc_html__( 'עורכי דין בתחום', 'justice-theme' ) . '</a>';
	$block .= '</div></div>';

	return $content . $block;
}
add_filter( 'the_content', 'justice_theme_article_tools_mesh', 26 );

/**
 * Resolve and validate a practice-areas slug sent by the tools app.
 *
 * @param string $raw Raw area value from the request.
 * @return string Valid term slug or empty string.
 */
function justice_theme_tools_valid_area( string $raw ): string {
	$slug = sanitize_key( $raw );

	if ( '' === $slug || ! taxonomy_exists( 'practice-areas' ) ) {
		return '';
	}

	$term = get_term_by( 'slug', $slug, 'practice-areas' );

	return $term instanceof WP_Term ? $term->slug : '';
}

/**
 * Marketplace wire: when the tools lead gate captures a visitor, also
 * create a real justice_lead with the exact meta contract the existing
 * classifier (priority 20) and lawyer routing engine (priority 30)
 * act on, so simulation and tool users flow into the same paid-lawyer
 * routing and billing pipeline as every other public lead.
 *
 * @param int $request_id justice_legal_request post ID.
 */
function justice_theme_tools_lead_marketplace_bridge( $request_id ) {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return;
	}

	$request_id = (int) $request_id;
	$name       = (string) get_post_meta( $request_id, 'visitor_name', true );
	$phone      = (string) get_post_meta( $request_id, 'visitor_phone', true );
	$email      = (string) get_post_meta( $request_id, 'visitor_email', true );
	$area       = (string) get_post_meta( $request_id, 'practice_area_slug', true );
	$tool_id    = (string) get_post_meta( $request_id, 'legal_area', true );
	$excerpt    = (string) get_post_field( 'post_content', $request_id );

	if ( '' === $name || '' === $phone ) {
		return;
	}

	$channel        = (string) get_post_meta( $request_id, 'contact_channel', true );
	$review         = '1' === (string) get_post_meta( $request_id, 'human_review_requested', true );
	$surface        = 'legal_tools_gate';
	$source_channel = function_exists( 'justice_theme_public_lead_source_channel' )
		? justice_theme_public_lead_source_channel( $surface )
		: 'public_site_form';

	$lead_id = wp_insert_post(
		array(
			'post_type'   => 'justice_lead',
			'post_title'  => sprintf( '%s - %s', $name, $area ?: ( $tool_id ?: 'legal-tools' ) ),
			'post_status' => 'publish',
		)
	);

	if ( ! $lead_id || is_wp_error( $lead_id ) ) {
		return;
	}

	$meta = array(
		'visitor_name'                  => $name,
		'visitor_phone'                 => $phone,
		'visitor_email'                 => $email,
		'legal_area'                    => $area,
		'message'                       => trim(
			'כלי AI: ' . $tool_id
			. ( $channel ? "\nערוץ חזרה מועדף: " . $channel : '' )
			. ( $review ? "\nהמבקש ביקש בדיקת עורך דין למסמך." : '' )
			. "\n\n" . $excerpt
		),
		'urgency'                       => $review ? 'high' : 'normal',
		'lead_status'                   => 'new',
		'follow_up_status'              => 'not_started',
		'coverage_status'               => 'coverage_review',
		'consent'                       => '1',
		'consent_status'                => 'explicit_site_form_consent',
		'source_url'                    => home_url( '/legal-tools/' ),
		'source_page_url'               => home_url( '/legal-tools/' ),
		'source_keyword'                => $tool_id,
		'source_channel'                => $source_channel,
		'source_system'                 => 'justice_public_site',
		'lead_source_surface'           => $surface,
		'lead_revenue_model'            => 'public_intake_review',
		'qualified_lead_billing_status' => 'not_ready',
		'lead_revenue_notes'            => 'Lead captured by the AI tools gate (simulation/drafting). Qualify need, consent, coverage and lawyer commercial terms before billing.',
		'owner_revenue_next_step'       => 'AI tools lead: review the attached draft context, confirm area and consent, then route or assign to a paid lawyer path.',
		'linked_legal_request_id'       => $request_id,
		'contact_channel'               => $channel,
		'human_review_requested'        => $review ? '1' : '0',
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $lead_id, $key, $value );
	}

	update_post_meta( $request_id, 'linked_lead_id', $lead_id );
}
add_action( 'justice_theme_legal_tools_lead_captured', 'justice_theme_tools_lead_marketplace_bridge', 10, 1 );

/**
 * Matched professionals for the tools app rail: same practice-areas
 * matcher the routing engine uses, restricted to publicly approved
 * profiles, verified-first. Public directory data only.
 */
function justice_theme_register_matched_lawyers_route() {
	register_rest_route(
		'justice/v1',
		'/legal-tools/matched-lawyers',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'args'                => array(
				'area' => array(
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_key',
				),
			),
			'callback'            => 'justice_theme_matched_lawyers_callback',
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_matched_lawyers_route' );

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_theme_matched_lawyers_callback( WP_REST_Request $request ) {
	$area = justice_theme_tools_valid_area( (string) $request->get_param( 'area' ) );

	if ( '' === $area || ! post_type_exists( 'justice_lawyer' ) ) {
		return new WP_REST_Response( array( 'lawyers' => array(), 'area' => $area ), 200 );
	}

	$candidate_ids = get_posts(
		array(
			'post_type'                     => 'justice_lawyer',
			'post_status'                   => 'publish',
			'posts_per_page'                => 12,
			'fields'                        => 'ids',
			'no_found_rows'                 => true,
			'orderby'                       => 'modified',
			'order'                         => 'DESC',
			'suppress_filters'              => false,
			'justice_public_lawyer_listing' => true,
			'tax_query'      => array(
				array(
					'taxonomy' => 'practice-areas',
					'field'    => 'slug',
					'terms'    => $area,
				),
			),
		)
	);

	$rows = array();

	foreach ( $candidate_ids as $lawyer_id ) {
		$lawyer_id = (int) $lawyer_id;

		if (
			! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			|| ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id )
		) {
			continue;
		}

		$skills = array();
		$terms  = get_the_terms( $lawyer_id, 'practice-areas' );
		if ( is_array( $terms ) ) {
			foreach ( array_slice( $terms, 0, 4 ) as $term ) {
				$skills[] = $term->name;
			}
		}

		$city_terms = get_the_terms( $lawyer_id, 'city' );
		$city       = ( is_array( $city_terms ) && ! empty( $city_terms ) ) ? $city_terms[0]->name : '';

		$professional_type = (string) get_post_meta( $lawyer_id, 'professional_type', true );
		$years             = absint( get_post_meta( $lawyer_id, 'years_experience', true ) );
		$review_state      = function_exists( 'justice_theme_lawyer_reviews_public_state' )
			? justice_theme_lawyer_reviews_public_state( $lawyer_id )
			: array( 'show' => false, 'count' => 0, 'average' => 0.0 );

		$rows[] = array(
			'id'       => $lawyer_id,
			'name'     => get_the_title( $lawyer_id ),
			'url'      => function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( $lawyer_id ) : get_permalink( $lawyer_id ),
			'city'     => $city,
			'skills'   => $skills,
			'type'     => $professional_type ?: 'עורך דין',
			'years'    => $years,
			'verified' => 'verified' === strtolower( (string) get_post_meta( $lawyer_id, 'verification_status', true ) ),
			// courtai professional.json aliases for cross-platform agents.
			'fullName'           => get_the_title( $lawyer_id ),
			'role'               => $professional_type ?: 'lawyer',
			'specializations'    => $skills,
			'experienceYears'    => $years,
			'verificationStatus' => 'verified' === strtolower( (string) get_post_meta( $lawyer_id, 'verification_status', true ) ) ? 'verified' : 'pending',
			// courtai professional.json rating fields: real moderated reviews only.
			'rating'             => $review_state['show'] ? (float) $review_state['average'] : 0,
			'reviewCount'        => $review_state['show'] ? (int) $review_state['count'] : 0,
		);
	}

	usort(
		$rows,
		static function ( $a, $b ) {
			$verified_order = (int) $b['verified'] <=> (int) $a['verified'];

			if ( 0 !== $verified_order ) {
				return $verified_order;
			}

			return $b['rating'] <=> $a['rating'];
		}
	);

	return new WP_REST_Response(
		array(
			'area'          => $area,
			'directory_url' => home_url( '/lawyers/?area=' . rawurlencode( $area ) ),
			'lawyers'       => array_slice( $rows, 0, 3 ),
		),
		200
	);
}

/**
 * One-shot sitewide copy hygiene sweep (owner-ordered 2026-07-03):
 * removes em/en-dashes from published articles and pages, replacing
 * "X — Y" in titles with "X: Y" and in body text with a comma, plus
 * the most common Hebrew AI-teller phrases. Runs once per flag version
 * on an admin visit, gated behind the standard CMS-write switch, and
 * records every touched post ID for audit.
 */
function justice_theme_copy_hygiene_sweep() {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if ( get_option( 'justice_copy_hygiene_done_v1' ) ) {
		return;
	}

	if ( ! function_exists( 'justice_theme_admin_cms_write_enabled' ) || ! justice_theme_admin_cms_write_enabled( 'justice_copy_hygiene_sweep_enabled' ) ) {
		return;
	}

	$post_ids = get_posts(
		array(
			'post_type'      => array( 'articles', 'page', 'post' ),
			'post_status'    => 'publish',
			'posts_per_page' => 400,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		)
	);

	$tellers = array(
		'חשוב לציין כי '   => '',
		'חשוב לציין ש'      => '',
		'ראוי לציין כי '    => '',
		'בעידן המודרני, '  => '',
		'בעידן המודרני '   => '',
		'לסיכומו של דבר, ' => 'לסיכום, ',
	);

	$touched = array();
	$flagged = array();

	foreach ( $post_ids as $post_id ) {
		$post = get_post( (int) $post_id );
		if ( ! $post instanceof WP_Post ) {
			continue;
		}

		$title   = $post->post_title;
		$content = $post->post_content;

		$new_title   = preg_replace( '/\s+[—–]\s+/u', ': ', $title );
		$new_title   = str_replace( array( '—', '–' ), '-', $new_title );
		$new_content = preg_replace( '/\s+[—–]\s+/u', ', ', $content );
		$new_content = str_replace( array( '—', '–' ), '-', $new_content );

		foreach ( $tellers as $from => $to ) {
			$new_content = str_replace( $from, $to, $new_content );
		}

		if ( $new_title !== $title || $new_content !== $content ) {
			// The publication safety gate hard-blocks (wp_die) any re-save of a
			// published post that still carries internal editorial markers. Those
			// posts are already live with the markers and need owner review, not a
			// dash sweep, so skip them here and record them for review. Without
			// this skip a single flagged post aborts every wp-admin page load.
			if ( function_exists( 'justice_theme_detect_publication_safety_markers' ) ) {
				$safety_markers = justice_theme_detect_publication_safety_markers(
					$new_title . "\n\n" . (string) $post->post_excerpt . "\n\n" . $new_content
				);

				if ( ! empty( $safety_markers ) ) {
					$flagged[ (int) $post_id ] = array_slice( $safety_markers, 0, 5 );
					continue;
				}
			}

			wp_update_post(
				array(
					'ID'           => (int) $post_id,
					'post_title'   => $new_title,
					'post_content' => $new_content,
				)
			);
			$touched[] = (int) $post_id;
		}
	}

	update_option(
		'justice_copy_hygiene_done_v1',
		wp_json_encode(
			array(
				'at'                 => current_time( 'mysql' ),
				'touched'            => $touched,
				'flagged_for_review' => $flagged,
			)
		),
		false
	);
}
add_action( 'admin_init', 'justice_theme_copy_hygiene_sweep', 50 );

// Owner-ordered enablement (2026-07-03): "remove all AI tellers and
// em-dashes from the website completely." One-shot via the done flag.
add_filter( 'justice_copy_hygiene_sweep_enabled', '__return_true' );
