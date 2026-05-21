<?php
/**
 * Article–Lawyer Smart Bridge
 *
 * Connects articles to lawyers dynamically via shared `practice-areas` taxonomy.
 * Priority logic: specific sub-topic match > parent topic match > manual override.
 *
 * HOW IT WORKS:
 * 1. Each article has `practice-areas` terms (e.g., "divorce", "custody").
 * 2. Each lawyer has `practice-areas` terms too (e.g., "family-law", "divorce").
 * 3. The bridge finds matching lawyers by looking at:
 *    a. Exact sub-topic match (article has "divorce", lawyer has "divorce").
 *    b. Parent match (article has "divorce", lawyer has "family-law" which is parent).
 * 4. Lawyers are ranked by: specificity (exact > parent) → priority_score → seniority.
 * 5. Manual override: `article_expert_lawyer_id` meta on the article overrides auto-match.
 *
 * FUTURE-PROOF: When more lawyers join specific sub-topics, they automatically appear
 * on matching articles without any code changes.
 *
 * @package JusticeCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the manual override meta field for articles.
 */
function justice_bridge_register_meta() {
	// Manual override: set a specific lawyer on an article.
	register_post_meta( 'articles', 'article_expert_lawyer_id', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'integer',
		'description'   => 'Manual override: specific lawyer post ID to show on this article.',
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	) );

	// Also support regular posts.
	register_post_meta( 'post', 'article_expert_lawyer_id', array(
		'show_in_rest'  => true,
		'single'        => true,
		'type'          => 'integer',
		'auth_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
	) );
}
add_action( 'init', 'justice_bridge_register_meta' );

/**
 * Find matching lawyers for a given article.
 *
 * @param int $article_id The article (or post) ID.
 * @param int $limit      Max lawyers to return. Default 3.
 * @return array Array of lawyer post objects with match metadata.
 */
function justice_bridge_get_lawyers_for_article( int $article_id, int $limit = 3 ): array {

	// 1. Check manual override first.
	$manual_id = (int) get_post_meta( $article_id, 'article_expert_lawyer_id', true );
	if ( $manual_id && 'publish' === get_post_status( $manual_id ) ) {
		$lawyer = get_post( $manual_id );
		if ( $lawyer && 'justice_lawyer' === $lawyer->post_type ) {
			return array( justice_bridge_enrich_lawyer( $lawyer, 'manual', 1000 ) );
		}
	}

	// 2. Get article's practice-areas terms (with ancestors).
	$article_terms = wp_get_post_terms( $article_id, 'practice-areas', array( 'fields' => 'all' ) );
	if ( is_wp_error( $article_terms ) || empty( $article_terms ) ) {
		return array();
	}

	// Collect term IDs and their parents.
	$exact_term_ids  = wp_list_pluck( $article_terms, 'term_id' );
	$parent_term_ids = array();
	foreach ( $article_terms as $term ) {
		if ( $term->parent ) {
			$parent_term_ids[] = $term->parent;
			// Walk up the hierarchy.
			$ancestors = get_ancestors( $term->term_id, 'practice-areas', 'taxonomy' );
			$parent_term_ids = array_merge( $parent_term_ids, $ancestors );
		}
	}
	$parent_term_ids = array_unique( array_diff( $parent_term_ids, $exact_term_ids ) );

	// 3. Query lawyers with matching practice-areas.
	$all_term_ids = array_merge( $exact_term_ids, $parent_term_ids );
	if ( empty( $all_term_ids ) ) {
		return array();
	}

	$lawyers = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => 50, // Get more than needed for scoring.
		'tax_query'      => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'term_id',
				'terms'    => $all_term_ids,
			),
		),
		'meta_query'     => array(
			array(
				'key'     => 'profile_status',
				'value'   => 'active',
				'compare' => '=',
			),
		),
	) );

	if ( empty( $lawyers ) ) {
		// Fallback: try without profile_status filter.
		$lawyers = get_posts( array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => 50,
			'tax_query'      => array(
				array(
					'taxonomy' => 'practice-areas',
					'field'    => 'term_id',
					'terms'    => $all_term_ids,
				),
			),
		) );
	}

	if ( empty( $lawyers ) ) {
		return array();
	}

	// 4. Score each lawyer.
	$scored = array();
	foreach ( $lawyers as $lawyer ) {
		$lawyer_terms = wp_get_post_terms( $lawyer->ID, 'practice-areas', array( 'fields' => 'ids' ) );
		if ( is_wp_error( $lawyer_terms ) ) {
			continue;
		}

		// Determine match type and specificity.
		$exact_matches  = array_intersect( $lawyer_terms, $exact_term_ids );
		$parent_matches = array_intersect( $lawyer_terms, $parent_term_ids );

		if ( ! empty( $exact_matches ) ) {
			$match_type  = 'exact';
			$specificity = 100 + count( $exact_matches ) * 10;
		} elseif ( ! empty( $parent_matches ) ) {
			$match_type  = 'parent';
			$specificity = 50;
		} else {
			continue; // No match somehow.
		}

		$priority = (int) get_post_meta( $lawyer->ID, 'priority_score', true );
		$years    = (int) get_post_meta( $lawyer->ID, 'years_experience', true );

		// Final score: specificity (most weight) + priority + years.
		$final_score = $specificity * 100 + $priority * 10 + $years;

		$scored[] = justice_bridge_enrich_lawyer( $lawyer, $match_type, $final_score );
	}

	// 5. Sort by score descending.
	usort( $scored, function ( $a, $b ) {
		return $b['match_score'] - $a['match_score'];
	} );

	return array_slice( $scored, 0, $limit );
}

/**
 * Enrich a lawyer post with display-ready data.
 */
function justice_bridge_enrich_lawyer( WP_Post $lawyer, string $match_type, int $score ): array {
	return array(
		'id'          => $lawyer->ID,
		'name'        => get_post_meta( $lawyer->ID, 'lawyer_full_name', true ) ?: $lawyer->post_title,
		'firm'        => get_post_meta( $lawyer->ID, 'firm_name', true ),
		'bio'         => get_post_meta( $lawyer->ID, 'bio_short', true ) ?: $lawyer->post_excerpt,
		'phone'       => get_post_meta( $lawyer->ID, 'phone', true ),
		'whatsapp'    => get_post_meta( $lawyer->ID, 'whatsapp', true ),
		'years'       => (int) get_post_meta( $lawyer->ID, 'years_experience', true ),
		'verified'    => get_post_meta( $lawyer->ID, 'verification_status', true ) === 'verified',
		'photo_url'   => get_the_post_thumbnail_url( $lawyer->ID, 'medium' ),
		'profile_url' => get_permalink( $lawyer->ID ),
		'match_type'  => $match_type,
		'match_score' => $score,
		'areas'       => wp_get_post_terms( $lawyer->ID, 'practice-areas', array( 'fields' => 'names' ) ),
	);
}

/**
 * Render the expert attorney box for an article.
 * Call this in your article template: justice_bridge_render_expert_box( get_the_ID() );
 */
function justice_bridge_render_expert_box( int $article_id ): void {
	$lawyers = justice_bridge_get_lawyers_for_article( $article_id );
	if ( empty( $lawyers ) ) {
		return;
	}

	echo '<aside class="justice-expert-box" role="complementary" aria-label="עורכי דין מומחים">';
	echo '<h3 class="justice-expert-box__title">⚖️ עורכי דין מומחים בתחום</h3>';

	foreach ( $lawyers as $lawyer ) {
		$verified_badge = $lawyer['verified'] ? '<span class="justice-expert-box__badge" title="עורך דין מאומת">✓ מאומת</span>' : '';
		$photo = $lawyer['photo_url'] ? '<img src="' . esc_url( $lawyer['photo_url'] ) . '" alt="' . esc_attr( $lawyer['name'] ) . '" class="justice-expert-box__photo" loading="lazy">' : '';

		echo '<div class="justice-expert-box__card">';
		if ( $photo ) {
			echo '<div class="justice-expert-box__photo-wrap">' . $photo . '</div>';
		}
		echo '<div class="justice-expert-box__info">';
		echo '<h4 class="justice-expert-box__name"><a href="' . esc_url( $lawyer['profile_url'] ) . '">' . esc_html( $lawyer['name'] ) . '</a> ' . $verified_badge . '</h4>';

		if ( $lawyer['firm'] ) {
			echo '<p class="justice-expert-box__firm">' . esc_html( $lawyer['firm'] ) . '</p>';
		}
		if ( $lawyer['bio'] ) {
			echo '<p class="justice-expert-box__bio">' . esc_html( $lawyer['bio'] ) . '</p>';
		}
		if ( $lawyer['years'] ) {
			echo '<p class="justice-expert-box__years">' . esc_html( $lawyer['years'] ) . ' שנות ניסיון</p>';
		}
		if ( $lawyer['areas'] && ! is_wp_error( $lawyer['areas'] ) ) {
			echo '<p class="justice-expert-box__areas">' . esc_html( implode( ', ', $lawyer['areas'] ) ) . '</p>';
		}

		// CTA buttons
		echo '<div class="justice-expert-box__cta">';
		if ( $lawyer['phone'] ) {
			echo '<a href="tel:' . esc_attr( $lawyer['phone'] ) . '" class="justice-expert-box__btn justice-expert-box__btn--phone">📞 התקשרו</a>';
		}
		if ( $lawyer['whatsapp'] ) {
			echo '<a href="https://wa.me/972' . esc_attr( ltrim( $lawyer['whatsapp'], '0' ) ) . '" class="justice-expert-box__btn justice-expert-box__btn--whatsapp" target="_blank" rel="noopener">💬 וואטסאפ</a>';
		}
		echo '<a href="' . esc_url( $lawyer['profile_url'] ) . '" class="justice-expert-box__btn justice-expert-box__btn--profile">👤 לפרופיל המלא</a>';
		echo '</div>'; // .cta

		echo '</div>'; // .info
		echo '</div>'; // .card
	}

	echo '</aside>'; // .justice-expert-box
}

/**
 * REST endpoint: GET /justice-core/v1/article-lawyers/{article_id}
 * Returns matched lawyers for a given article (for frontend/API consumers).
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-core/v1', '/article-lawyers/(?P<id>\d+)', array(
		'methods'             => 'GET',
		'callback'            => function ( WP_REST_Request $request ) {
			$article_id = (int) $request->get_param( 'id' );
			$lawyers = justice_bridge_get_lawyers_for_article( $article_id );
			return new WP_REST_Response( $lawyers, 200 );
		},
		'permission_callback' => '__return_true',
	) );
} );

/**
 * Auto-inject expert lawyer box after article content on singular views.
 * Priority 50 to run after most content filters but before late ones.
 */
function justice_bridge_auto_inject_expert_box( string $content ): string {
	// Only on single articles/posts, in the main query.
	if ( ! is_singular( array( 'articles', 'post' ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$article_id = get_the_ID();
	if ( ! $article_id ) {
		return $content;
	}

	// Capture the expert box HTML.
	ob_start();
	justice_bridge_render_expert_box( $article_id );
	$expert_box = ob_get_clean();

	if ( ! $expert_box ) {
		return $content;
	}

	return $content . $expert_box;
}
add_filter( 'the_content', 'justice_bridge_auto_inject_expert_box', 50 );

