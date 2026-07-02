<?php
/**
 * Knowledge connectors for AI research agents (justice/v1/knowledge).
 *
 * Read-only, self-describing REST endpoints over the portal's public
 * knowledge: guides, approved professionals and the tools/simulation
 * contract. Contract naming mirrors courtai's /api/schemas convention
 * (cases / professionals / simulations / files) so an agent built for
 * one can discover the other. An MCP server can wrap these endpoints
 * one-to-one as tools; the schemas route is the manifest.
 *
 * Everything served here is already-public data: published guides and
 * publicly approved professional profiles. No visitor or lead data is
 * ever exposed.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the knowledge routes.
 */
function justice_theme_register_knowledge_routes() {
	register_rest_route(
		'justice/v1',
		'/knowledge/schemas',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => 'justice_theme_knowledge_schemas',
		)
	);

	register_rest_route(
		'justice/v1',
		'/knowledge/articles',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'args'                => array(
				'q'        => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ),
				'area'     => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_key' ),
				'per_page' => array( 'type' => 'integer', 'default' => 10 ),
			),
			'callback'            => 'justice_theme_knowledge_articles',
		)
	);

	register_rest_route(
		'justice/v1',
		'/knowledge/professionals',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'args'                => array(
				'area' => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_key' ),
			),
			'callback'            => 'justice_theme_knowledge_professionals',
		)
	);
}
add_action( 'rest_api_init', 'justice_theme_register_knowledge_routes' );

/**
 * Self-describing manifest: what an agent can call and with what fields.
 */
function justice_theme_knowledge_schemas() {
	$base = rest_url( 'justice/v1' );

	return new WP_REST_Response(
		array(
			'platform'  => 'jus-tice.co.il',
			'language'  => 'he',
			'contracts' => array(
				array(
					'name'     => 'articles',
					'endpoint' => $base . '/knowledge/articles',
					'method'   => 'GET',
					'params'   => array( 'q' => 'free-text search', 'area' => 'practice-areas term slug', 'per_page' => 'max 25' ),
					'fields'   => array( 'id', 'title', 'url', 'date', 'areas', 'excerpt' ),
					'notes'    => 'Published legal guides. Public content only.',
				),
				array(
					'name'     => 'professionals',
					'endpoint' => $base . '/knowledge/professionals',
					'method'   => 'GET',
					'params'   => array( 'area' => 'practice-areas term slug (optional)' ),
					'fields'   => array( 'id', 'name', 'fullName', 'url', 'city', 'skills', 'specializations', 'type', 'role', 'years', 'experienceYears', 'verified', 'verificationStatus' ),
					'notes'    => 'Publicly approved professional profiles only, verified-first.',
				),
				array(
					'name'     => 'simulations',
					'endpoint' => home_url( '/legal-tools/' ),
					'method'   => 'LINK',
					'params'   => array( 'tool' => 'tool id, e.g. court-arena / contract-arena / hearing-simulation / cost-estimator', 'area' => 'practice-areas term slug' ),
					'fields'   => array(),
					'notes'    => 'Interactive simulation surface for humans. Agents should link users here; generation itself is human-gated.',
				),
				array(
					'name'     => 'files',
					'endpoint' => $base . '/legal-tools/lead',
					'method'   => 'POST',
					'params'   => array( 'lead_name' => 'required', 'lead_phone' => 'required', 'lead_consent' => 'required', 'lead_document' => 'optional file (pdf/doc/docx/jpg/png)', 'area' => 'practice-areas slug', 'review_request' => '1 for attorney review' ),
					'fields'   => array( 'ok', 'request_id' ),
					'notes'    => 'Document intake with explicit consent; routed to the human lead pipeline.',
				),
				array(
					'name'     => 'reasoning',
					'endpoint' => '',
					'method'   => 'DOC',
					'params'   => array(),
					'fields'   => array( 'pipeline', 'humanReviewRule' ),
					'notes'    => 'Compatibility doc: mirrors courtai System3 PAC-Reasoning. Pipeline: multi-agent analysis, consensus (pairwise similarity 0-1), contradiction detection (factual/logical/ethical/procedural), quality assessment, final answer with PAC bounds. Human review is required when consensus < 0.6 or reliability < 0.65 or a critical contradiction exists; on this platform that maps to the review_request=1 lead flow, which routes the document to a licensed attorney.',
				),
			),
			'compatibility' => 'Contract naming and professional fields follow courtai docs/schemas (case.json, professional.json, simulation_run.json, file.json).',
		),
		200
	);
}

/**
 * Published guides, searchable by text and practice area.
 *
 * @param WP_REST_Request $request Request.
 */
function justice_theme_knowledge_articles( WP_REST_Request $request ) {
	$per_page = min( 25, max( 1, (int) $request->get_param( 'per_page' ) ) );
	$area     = (string) $request->get_param( 'area' );

	$args = array(
		'post_type'           => 'articles',
		'post_status'         => 'publish',
		'posts_per_page'      => $per_page,
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	);

	$q = (string) $request->get_param( 'q' );
	if ( '' !== $q ) {
		$args['s'] = $q;
	}

	if ( '' !== $area && taxonomy_exists( 'practice-areas' ) ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $area,
			),
		);
	}

	$query = new WP_Query( $args );
	$rows  = array();

	foreach ( $query->posts as $post ) {
		$areas = array();
		$terms = get_the_terms( $post->ID, 'practice-areas' );
		if ( is_array( $terms ) ) {
			foreach ( $terms as $term ) {
				$areas[] = $term->slug;
			}
		}

		$rows[] = array(
			'id'      => $post->ID,
			'title'   => get_the_title( $post ),
			'url'     => get_permalink( $post ),
			'date'    => get_the_date( 'c', $post ),
			'areas'   => $areas,
			'excerpt' => wp_trim_words( wp_strip_all_tags( $post->post_content ), 40 ),
		);
	}

	return new WP_REST_Response( array( 'articles' => $rows ), 200 );
}

/**
 * Publicly approved professionals, optionally filtered by area.
 *
 * @param WP_REST_Request $request Request.
 */
function justice_theme_knowledge_professionals( WP_REST_Request $request ) {
	if ( ! function_exists( 'justice_theme_matched_lawyers_callback' ) ) {
		return new WP_REST_Response( array( 'professionals' => array() ), 200 );
	}

	$area = (string) $request->get_param( 'area' );

	if ( '' !== $area ) {
		$inner = justice_theme_matched_lawyers_callback( $request );
		$data  = $inner->get_data();

		return new WP_REST_Response(
			array(
				'professionals' => isset( $data['lawyers'] ) ? $data['lawyers'] : array(),
				'directory_url' => isset( $data['directory_url'] ) ? $data['directory_url'] : home_url( '/lawyers/' ),
			),
			200
		);
	}

	// No area: latest publicly approved profiles across all areas.
	$candidate_ids = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => 12,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'orderby'        => 'modified',
			'order'          => 'DESC',
		)
	);

	$rows = array();
	foreach ( $candidate_ids as $lawyer_id ) {
		$lawyer_id = (int) $lawyer_id;
		if ( function_exists( 'justice_theme_lawyer_profile_is_public_approved' ) && ! justice_theme_lawyer_profile_is_public_approved( $lawyer_id ) ) {
			continue;
		}

		$skills = array();
		$terms  = get_the_terms( $lawyer_id, 'practice-areas' );
		if ( is_array( $terms ) ) {
			foreach ( array_slice( $terms, 0, 4 ) as $term ) {
				$skills[] = $term->name;
			}
		}

		$city_terms   = get_the_terms( $lawyer_id, 'city' );
		$review_state = function_exists( 'justice_theme_lawyer_reviews_public_state' )
			? justice_theme_lawyer_reviews_public_state( $lawyer_id )
			: array( 'show' => false, 'count' => 0, 'average' => 0.0 );

		$rows[] = array(
			'id'          => $lawyer_id,
			'name'        => get_the_title( $lawyer_id ),
			'url'         => function_exists( 'justice_theme_public_permalink' ) ? justice_theme_public_permalink( $lawyer_id ) : get_permalink( $lawyer_id ),
			'city'        => ( is_array( $city_terms ) && ! empty( $city_terms ) ) ? $city_terms[0]->name : '',
			'skills'      => $skills,
			'type'        => (string) get_post_meta( $lawyer_id, 'professional_type', true ) ?: 'עורך דין',
			'years'       => absint( get_post_meta( $lawyer_id, 'years_experience', true ) ),
			'verified'    => 'verified' === strtolower( (string) get_post_meta( $lawyer_id, 'verification_status', true ) ),
			'rating'      => $review_state['show'] ? (float) $review_state['average'] : 0,
			'reviewCount' => $review_state['show'] ? (int) $review_state['count'] : 0,
		);
	}

	return new WP_REST_Response( array( 'professionals' => array_slice( $rows, 0, 6 ) ), 200 );
}
