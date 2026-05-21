<?php
/**
 * Batch Article Tagger — REST Endpoint
 *
 * POST /wp-json/justice-core/v1/batch-tag-articles
 *
 * Accepts a JSON body with:
 *   - "post_ids": array of article post IDs
 *   - "practice_area": slug of the practice area to assign (e.g., "family-law", "divorce")
 *   - "append": bool — if true, adds to existing terms; if false, replaces
 *
 * Also supports bulk tagging by sub-topic mapping:
 * POST /wp-json/justice-core/v1/batch-tag-subtopics
 *   - "mappings": array of { "post_id": int, "subtopic": "slug" }
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', function () {

	// Bulk assign a single practice area to many articles.
	register_rest_route( 'justice-core/v1', '/batch-tag-articles', array(
		'methods'             => 'POST',
		'callback'            => function ( WP_REST_Request $request ) {
			$post_ids      = $request->get_param( 'post_ids' );
			$practice_area = $request->get_param( 'practice_area' );
			$append        = (bool) $request->get_param( 'append' );

			if ( empty( $post_ids ) || ! is_array( $post_ids ) || empty( $practice_area ) ) {
				return new WP_REST_Response( array( 'error' => 'Missing post_ids or practice_area' ), 400 );
			}

			// Ensure term exists.
			$term = get_term_by( 'slug', $practice_area, 'practice-areas' );
			if ( ! $term ) {
				return new WP_REST_Response( array( 'error' => "Term '$practice_area' not found" ), 404 );
			}

			$results = array( 'tagged' => 0, 'errors' => 0 );
			foreach ( $post_ids as $pid ) {
				$pid = (int) $pid;
				if ( ! $pid ) {
					continue;
				}
				$result = wp_set_object_terms( $pid, $term->term_id, 'practice-areas', $append );
				if ( is_wp_error( $result ) ) {
					$results['errors']++;
				} else {
					$results['tagged']++;
				}
			}

			return new WP_REST_Response( $results, 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );

	// Bulk assign sub-topic practice areas with individual mappings.
	register_rest_route( 'justice-core/v1', '/batch-tag-subtopics', array(
		'methods'             => 'POST',
		'callback'            => function ( WP_REST_Request $request ) {
			$mappings = $request->get_param( 'mappings' );

			if ( empty( $mappings ) || ! is_array( $mappings ) ) {
				return new WP_REST_Response( array( 'error' => 'Missing mappings array' ), 400 );
			}

			$results = array( 'tagged' => 0, 'errors' => 0, 'term_not_found' => 0 );
			foreach ( $mappings as $mapping ) {
				$pid     = (int) ( $mapping['post_id'] ?? 0 );
				$subtopic = $mapping['subtopic'] ?? '';

				if ( ! $pid || ! $subtopic ) {
					$results['errors']++;
					continue;
				}

				$term = get_term_by( 'slug', $subtopic, 'practice-areas' );
				if ( ! $term ) {
					$results['term_not_found']++;
					continue;
				}

				// Assign both the sub-topic AND its parent (so parent-level lawyers match too).
				$terms_to_set = array( $term->term_id );
				if ( $term->parent ) {
					$terms_to_set[] = $term->parent;
				}

				$result = wp_set_object_terms( $pid, $terms_to_set, 'practice-areas', true );
				if ( is_wp_error( $result ) ) {
					$results['errors']++;
				} else {
					$results['tagged']++;
				}
			}

			return new WP_REST_Response( $results, 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );

	// Set expert lawyer on a batch of articles.
	register_rest_route( 'justice-core/v1', '/batch-set-expert', array(
		'methods'             => 'POST',
		'callback'            => function ( WP_REST_Request $request ) {
			$post_ids  = $request->get_param( 'post_ids' );
			$lawyer_id = (int) $request->get_param( 'lawyer_id' );

			if ( empty( $post_ids ) || ! $lawyer_id ) {
				return new WP_REST_Response( array( 'error' => 'Missing post_ids or lawyer_id' ), 400 );
			}

			// Verify lawyer exists.
			$lawyer = get_post( $lawyer_id );
			if ( ! $lawyer || 'justice_lawyer' !== $lawyer->post_type ) {
				return new WP_REST_Response( array( 'error' => "Lawyer ID $lawyer_id not found" ), 404 );
			}

			$results = array( 'set' => 0, 'errors' => 0 );
			foreach ( $post_ids as $pid ) {
				$pid = (int) $pid;
				if ( ! $pid ) {
					continue;
				}
				$ok = update_post_meta( $pid, 'article_expert_lawyer_id', $lawyer_id );
				if ( false === $ok ) {
					$results['errors']++;
				} else {
					$results['set']++;
				}
			}

			return new WP_REST_Response( $results, 200 );
		},
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
	) );
} );
