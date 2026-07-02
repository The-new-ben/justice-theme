<?php
/**
 * Verified per-case client reviews.
 *
 * Builds on the existing first-party recommendation engine
 * (inc/lawyer-recommendations.php): the same justice_recommendation CPT,
 * moderation queue and one-time token intake, extended with a hard case
 * link. A case-linked review token can only be created for a lawyer who
 * actually received that lead through the routing pipeline, the client
 * must leave a 1-5 score with the feedback (courtai ratings schema), and
 * the lawyer's public review_count / average_rating are recomputed from
 * approved reviews only. Nothing is displayed before owner moderation.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Extra meta for case-linked reviews on the recommendation and token CPTs.
 */
function justice_theme_register_case_review_meta(): void {
	$recommendation_fields = array(
		'reviewed_lead_id'       => 'integer',
		'reviewed_case_area'     => 'string',
		'review_verified_client' => 'string',
	);

	foreach ( $recommendation_fields as $key => $type ) {
		register_post_meta(
			'justice_recommendation',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => 'integer' === $type ? 'absint' : 'sanitize_text_field',
				'show_in_rest'      => false,
			)
		);
	}

	register_post_meta(
		'justice_reco_token',
		'recommendation_token_lead_id',
		array(
			'single'            => true,
			'type'              => 'integer',
			'sanitize_callback' => 'absint',
			'show_in_rest'      => false,
		)
	);
}
add_action( 'init', 'justice_theme_register_case_review_meta', 11 );

/**
 * Lawyer profile IDs that actually received a given lead: the direct
 * assignment plus everyone the routing engine notified.
 *
 * @param int $lead_id justice_lead post ID.
 * @return int[]
 */
function justice_theme_lawyer_ids_connected_to_lead( int $lead_id ): array {
	if ( ! $lead_id || 'justice_lead' !== get_post_type( $lead_id ) ) {
		return array();
	}

	$ids   = array();
	$ids[] = (int) get_post_meta( $lead_id, 'assigned_lawyer_id', true );

	foreach ( explode( ',', (string) get_post_meta( $lead_id, 'routed_to_lawyer_ids', true ) ) as $routed_id ) {
		$ids[] = (int) trim( $routed_id );
	}

	$ids = array_values( array_unique( array_filter( $ids ) ) );

	return array_values(
		array_filter(
			$ids,
			static function ( int $lawyer_id ): bool {
				return 'justice_lawyer' === get_post_type( $lawyer_id );
			}
		)
	);
}

/**
 * Active case-review token IDs for a lead+lawyer pair.
 *
 * @param int $lead_id   Lead post ID.
 * @param int $lawyer_id Lawyer post ID.
 * @return int[]
 */
function justice_theme_case_review_token_ids( int $lead_id, int $lawyer_id ): array {
	if ( ! post_type_exists( 'justice_reco_token' ) ) {
		return array();
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'justice_reco_token',
			'post_status'    => 'publish',
			'posts_per_page' => 10,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_query'     => array(
				'relation' => 'AND',
				array(
					'key'   => 'recommendation_token_lead_id',
					'value' => (string) $lead_id,
				),
				array(
					'key'   => 'recommendation_token_lawyer_id',
					'value' => (string) $lawyer_id,
				),
				array(
					'key'   => 'recommendation_token_status',
					'value' => 'active',
				),
			),
		)
	);

	return array_map( 'intval', $query->posts ?: array() );
}

/**
 * Create a case-linked verified-client review token.
 *
 * The token proves the reviewer was a real routed client: it can only be
 * minted for a lawyer who is connected to the lead in the CRM. Issuing a
 * new token revokes older active tokens for the same lead+lawyer pair, so
 * one lead can never produce more than one live review link per lawyer.
 *
 * @param int $lead_id    justice_lead post ID.
 * @param int $lawyer_id  justice_lawyer post ID.
 * @param int $valid_days Days the link stays active.
 * @return array{token_id?:int,token?:string,url?:string,expires_at?:string,error?:string}
 */
function justice_theme_create_case_review_token( int $lead_id, int $lawyer_id, int $valid_days = 45 ): array {
	if ( ! function_exists( 'justice_theme_create_lawyer_recommendation_token' ) ) {
		return array( 'error' => 'recommendations_module_missing' );
	}

	if ( ! $lead_id || 'justice_lead' !== get_post_type( $lead_id ) ) {
		return array( 'error' => 'invalid_lead' );
	}

	if ( ! in_array( $lawyer_id, justice_theme_lawyer_ids_connected_to_lead( $lead_id ), true ) ) {
		return array( 'error' => 'lawyer_not_connected_to_lead' );
	}

	foreach ( justice_theme_case_review_token_ids( $lead_id, $lawyer_id ) as $stale_token_id ) {
		update_post_meta( $stale_token_id, 'recommendation_token_status', 'revoked' );
	}

	$result = justice_theme_create_lawyer_recommendation_token( $lawyer_id, $valid_days );

	if ( ! empty( $result['error'] ) || empty( $result['token_id'] ) ) {
		return $result;
	}

	$token_id = (int) $result['token_id'];
	update_post_meta( $token_id, 'recommendation_token_lead_id', $lead_id );
	wp_update_post(
		array(
			'ID'         => $token_id,
			'post_title' => sprintf(
				'Case review link - %s - lead #%d - %s',
				get_the_title( $lawyer_id ),
				$lead_id,
				gmdate( 'Y-m-d' )
			),
		)
	);

	if ( function_exists( 'justice_theme_append_lawyer_internal_note' ) ) {
		justice_theme_append_lawyer_internal_note(
			$lawyer_id,
			'Case-linked verified-client review link created for lead #' . $lead_id . '. The link expires at ' . $result['expires_at'] . ' UTC and the review will wait for owner moderation.'
		);
	}

	return $result;
}

/**
 * Meta query for reviews that may count toward a lawyer's public rating:
 * owner-approved for public display, permission confirmed, an allowed
 * source type and a real 1-5 score.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @return array
 */
function justice_theme_lawyer_rated_review_meta_query( int $lawyer_id ): array {
	$meta_query = function_exists( 'justice_theme_lawyer_public_recommendation_meta_query' )
		? justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id )
		: array();

	$meta_query[] = array(
		'key'     => 'recommendation_rating',
		'value'   => array( 1, 5 ),
		'compare' => 'BETWEEN',
		'type'    => 'NUMERIC',
	);

	return $meta_query;
}

/**
 * Recompute a lawyer's review_count and average_rating from approved,
 * permission-confirmed, rated reviews. This is the ONLY writer of these
 * fields besides the admin metabox, so every number shown on cards,
 * profiles, rails and schema is derived from real moderated reviews.
 *
 * @param int $lawyer_id Lawyer post ID.
 */
function justice_theme_lawyer_recalculate_review_aggregates( int $lawyer_id ): void {
	if ( ! $lawyer_id || 'justice_lawyer' !== get_post_type( $lawyer_id ) || ! post_type_exists( 'justice_recommendation' ) ) {
		return;
	}

	$query = new WP_Query(
		array(
			'post_type'      => 'justice_recommendation',
			'post_status'    => 'publish',
			'posts_per_page' => 200,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_query'     => justice_theme_lawyer_rated_review_meta_query( $lawyer_id ),
		)
	);

	$ratings = array();

	foreach ( $query->posts ?: array() as $recommendation_id ) {
		$rating = (int) get_post_meta( (int) $recommendation_id, 'recommendation_rating', true );
		if ( $rating >= 1 && $rating <= 5 ) {
			$ratings[] = $rating;
		}
	}

	$count   = count( $ratings );
	$average = $count ? round( array_sum( $ratings ) / $count, 1 ) : 0;

	update_post_meta( $lawyer_id, 'review_count', $count );
	update_post_meta( $lawyer_id, 'average_rating', $average );

	$display_enabled = (string) get_post_meta( $lawyer_id, 'review_display_enabled', true );

	if ( $count > 0 && '' === $display_enabled && apply_filters( 'justice_theme_reviews_auto_enable_display', true, $lawyer_id ) ) {
		update_post_meta( $lawyer_id, 'review_display_enabled', 'approved' );
	}
}

/**
 * Keep aggregates in sync when a recommendation is saved, and promote an
 * owner-approved review to publish status so the public quote query
 * (publish-only) and the aggregate query agree. The CPT is not public, so
 * publish status exposes no URL.
 *
 * @param int     $post_id Recommendation post ID.
 * @param WP_Post $post    Recommendation post.
 */
function justice_theme_reviews_sync_on_recommendation_save( int $post_id, WP_Post $post ): void {
	static $running = false;

	if ( $running || wp_is_post_revision( $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$moderation = (string) get_post_meta( $post_id, 'recommendation_moderation', true );
	$permission = (string) get_post_meta( $post_id, 'recommendation_permission', true );

	if ( 'approved_public' === $moderation && 'confirmed' === $permission && in_array( $post->post_status, array( 'draft', 'pending', 'private' ), true ) ) {
		$running = true;
		wp_update_post(
			array(
				'ID'          => $post_id,
				'post_status' => 'publish',
			)
		);
		$running = false;
	}

	justice_theme_lawyer_recalculate_review_aggregates( (int) get_post_meta( $post_id, 'recommended_lawyer_id', true ) );
}
// Priority 30 runs after the details metabox save (default 10).
add_action( 'save_post_justice_recommendation', 'justice_theme_reviews_sync_on_recommendation_save', 30, 2 );

/**
 * Recompute aggregates when a recommendation is trashed or restored.
 *
 * @param int $post_id Post ID.
 */
function justice_theme_reviews_sync_on_recommendation_removal( int $post_id ): void {
	if ( 'justice_recommendation' !== get_post_type( $post_id ) ) {
		return;
	}

	$lawyer_id = (int) get_post_meta( $post_id, 'recommended_lawyer_id', true );

	if ( $lawyer_id ) {
		justice_theme_lawyer_recalculate_review_aggregates( $lawyer_id );
	}
}
add_action( 'trashed_post', 'justice_theme_reviews_sync_on_recommendation_removal' );
add_action( 'untrashed_post', 'justice_theme_reviews_sync_on_recommendation_removal' );

/**
 * Hard delete: the meta is gone by deleted_post, so capture the lawyer id
 * while the recommendation still exists and recompute after the delete.
 *
 * @param int $post_id Post ID.
 */
function justice_theme_reviews_capture_lawyer_before_delete( int $post_id ): void {
	if ( 'justice_recommendation' !== get_post_type( $post_id ) ) {
		return;
	}

	$GLOBALS['justice_theme_reviews_pending_recalc'][ $post_id ] = (int) get_post_meta( $post_id, 'recommended_lawyer_id', true );
}
add_action( 'before_delete_post', 'justice_theme_reviews_capture_lawyer_before_delete' );

/**
 * @param int $post_id Post ID.
 */
function justice_theme_reviews_recalc_after_delete( int $post_id ): void {
	$pending = $GLOBALS['justice_theme_reviews_pending_recalc'] ?? array();

	if ( empty( $pending[ $post_id ] ) ) {
		return;
	}

	$lawyer_id = (int) $pending[ $post_id ];
	unset( $GLOBALS['justice_theme_reviews_pending_recalc'][ $post_id ] );

	justice_theme_lawyer_recalculate_review_aggregates( $lawyer_id );
}
add_action( 'deleted_post', 'justice_theme_reviews_recalc_after_delete' );

/**
 * The single source of truth for whether a lawyer's rating may appear on
 * any public surface (card, profile, rail, schema). Mirrors the fact-gate
 * rules the card and profile templates already enforce.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @return array{show:bool,count:int,average:float}
 */
function justice_theme_lawyer_reviews_public_state( int $lawyer_id ): array {
	$none = array(
		'show'    => false,
		'count'   => 0,
		'average' => 0.0,
	);

	if ( ! $lawyer_id || 'justice_lawyer' !== get_post_type( $lawyer_id ) ) {
		return $none;
	}

	$count   = (int) get_post_meta( $lawyer_id, 'review_count', true );
	$average = (float) get_post_meta( $lawyer_id, 'average_rating', true );
	$enabled = in_array( strtolower( (string) get_post_meta( $lawyer_id, 'review_display_enabled', true ) ), array( '1', 'yes', 'true', 'enabled', 'approved' ), true );

	if ( ! $enabled || $count < 1 || $average <= 0 ) {
		return $none;
	}

	$source_type    = strtolower( (string) get_post_meta( $lawyer_id, 'source_type', true ) );
	$internal_notes = (string) get_post_meta( $lawyer_id, 'internal_notes', true );

	if ( 'seed' === $source_type || false !== stripos( $internal_notes, 'seed_data' ) ) {
		return $none;
	}

	$title         = get_the_title( $lawyer_id );
	$is_maya       = 'advocate-maya-rotenberg' === get_post_field( 'post_name', $lawyer_id )
		|| ( false !== mb_strpos( $title, rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) ) && false !== mb_strpos( $title, rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) ) );
	$fact_status   = sanitize_key( (string) get_post_meta( $lawyer_id, 'profile_fact_review_status', true ) );
	$fact_checked  = in_array( $fact_status, array( 'approved', 'source_checked', 'owner_approved', 'lawyer_approved' ), true );
	$requires_gate = $is_maya || in_array( $source_type, array( 'public_index', 'import' ), true );

	if ( $requires_gate && ! $fact_checked ) {
		return $none;
	}

	return array(
		'show'    => true,
		'count'   => $count,
		'average' => round( $average, 1 ),
	);
}

/**
 * aggregateRating + review fields for the Attorney JSON-LD node, computed
 * only from approved public reviews and only when the same gates that
 * control on-page display pass. Never fabricated, never seed data.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @return array
 */
function justice_theme_lawyer_review_schema_fields( int $lawyer_id ): array {
	$state = justice_theme_lawyer_reviews_public_state( $lawyer_id );

	if ( ! $state['show'] ) {
		return array();
	}

	$fields = array(
		'aggregateRating' => array(
			'@type'       => 'AggregateRating',
			'ratingValue' => (string) $state['average'],
			'reviewCount' => $state['count'],
			'bestRating'  => '5',
			'worstRating' => '1',
		),
	);

	if ( ! function_exists( 'justice_theme_lawyer_public_recommendations' ) ) {
		return $fields;
	}

	$reviews = array();

	foreach ( justice_theme_lawyer_public_recommendations( $lawyer_id, 5 ) as $item ) {
		$rating = (int) ( $item['rating'] ?? 0 );

		if ( $rating < 1 || $rating > 5 || empty( $item['quote'] ) ) {
			continue;
		}

		$review = array(
			'@type'        => 'Review',
			'reviewBody'   => wp_strip_all_tags( (string) $item['quote'] ),
			'reviewRating' => array(
				'@type'       => 'Rating',
				'ratingValue' => (string) $rating,
				'bestRating'  => '5',
				'worstRating' => '1',
			),
			'author'       => array(
				'@type' => 'Person',
				'name'  => '' !== (string) $item['client_name'] ? (string) $item['client_name'] : __( 'לקוח מאומת', 'justice-theme' ),
			),
		);

		if ( ! empty( $item['received_at'] ) ) {
			$timestamp = strtotime( (string) $item['received_at'] );
			if ( $timestamp ) {
				$review['datePublished'] = gmdate( 'Y-m-d', $timestamp );
			}
		}

		$reviews[] = $review;
	}

	if ( ! empty( $reviews ) ) {
		$fields['review'] = $reviews;
	}

	return $fields;
}

/**
 * Hebrew label for a reviewed case area slug.
 *
 * @param string $area_slug practice-areas term slug.
 * @return string
 */
function justice_theme_review_case_area_label( string $area_slug ): string {
	if ( '' === $area_slug || ! taxonomy_exists( 'practice-areas' ) ) {
		return '';
	}

	$term = get_term_by( 'slug', sanitize_key( $area_slug ), 'practice-areas' );

	return $term instanceof WP_Term ? $term->name : '';
}

/**
 * Admin: case review invite metabox on the lead edit screen.
 */
function justice_theme_case_review_lead_metabox(): void {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return;
	}

	add_meta_box(
		'justice_theme_case_review_invite',
		__( 'Verified client review invite', 'justice-theme' ),
		'justice_theme_render_case_review_lead_metabox',
		'justice_lead',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_case_review_lead_metabox' );

/**
 * @param WP_Post $post Lead post.
 */
function justice_theme_render_case_review_lead_metabox( WP_Post $post ): void {
	$lawyer_ids = justice_theme_lawyer_ids_connected_to_lead( $post->ID );

	if ( empty( $lawyer_ids ) ) {
		echo '<p>' . esc_html__( 'No lawyer is assigned or routed on this lead yet. Route or assign the lead first, then create the review invite.', 'justice-theme' ) . '</p>';
		return;
	}

	echo '<p>' . esc_html__( 'Create a one-time review link for the client of this lead. The review is case-linked, marked as a verified client review, and waits for owner moderation before any public display.', 'justice-theme' ) . '</p>';

	foreach ( $lawyer_ids as $lawyer_id ) {
		$active_tokens = justice_theme_case_review_token_ids( $post->ID, $lawyer_id );
		$create_url    = wp_nonce_url(
			admin_url(
				sprintf(
					'admin-post.php?action=justice_create_case_review_token&lead_id=%d&lawyer_id=%d',
					$post->ID,
					$lawyer_id
				)
			),
			sprintf( 'justice_create_case_review_token_%d_%d', $post->ID, $lawyer_id )
		);

		echo '<p style="margin:10px 0 4px"><strong>' . esc_html( get_the_title( $lawyer_id ) ) . '</strong><br>';

		if ( ! empty( $active_tokens ) ) {
			echo '<span class="description">' . esc_html__( 'An active link already exists. Creating a new one revokes it.', 'justice-theme' ) . '</span><br>';
		}

		echo '<a class="button" href="' . esc_url( $create_url ) . '">' . esc_html__( 'Create review link', 'justice-theme' ) . '</a></p>';
	}
}

/**
 * Admin handler: mint a case review token from the lead edit screen.
 */
function justice_theme_handle_create_case_review_token(): void {
	$lead_id   = isset( $_GET['lead_id'] ) ? absint( wp_unslash( $_GET['lead_id'] ) ) : 0;
	$lawyer_id = isset( $_GET['lawyer_id'] ) ? absint( wp_unslash( $_GET['lawyer_id'] ) ) : 0;

	if (
		! $lead_id
		|| ! $lawyer_id
		|| ! current_user_can( 'edit_post', $lead_id )
		|| ! check_admin_referer( sprintf( 'justice_create_case_review_token_%d_%d', $lead_id, $lawyer_id ) )
	) {
		wp_safe_redirect( admin_url( 'edit.php?post_type=justice_lead&case_review_token=failed' ) );
		exit;
	}

	$result   = justice_theme_create_case_review_token( $lead_id, $lawyer_id );
	$edit_url = get_edit_post_link( $lead_id, 'raw' ) ?: admin_url( 'edit.php?post_type=justice_lead' );

	if ( ! empty( $result['error'] ) || empty( $result['url'] ) ) {
		wp_safe_redirect( add_query_arg( 'case_review_token', 'failed', $edit_url ) );
		exit;
	}

	set_transient(
		'justice_case_review_token_link_' . get_current_user_id(),
		array(
			'url'       => (string) $result['url'],
			'lead_id'   => $lead_id,
			'lawyer_id' => $lawyer_id,
		),
		15 * MINUTE_IN_SECONDS
	);

	wp_safe_redirect( add_query_arg( 'case_review_token', 'created', $edit_url ) );
	exit;
}
add_action( 'admin_post_justice_create_case_review_token', 'justice_theme_handle_create_case_review_token' );

/**
 * Admin notice showing the freshly minted review link (shown once).
 */
function justice_theme_case_review_token_admin_notice(): void {
	if ( ! isset( $_GET['case_review_token'] ) ) {
		return;
	}

	$status = sanitize_key( wp_unslash( $_GET['case_review_token'] ) );

	if ( 'failed' === $status ) {
		echo '<div class="notice notice-error"><p>' . esc_html__( 'The review link could not be created. Check that the lawyer is assigned or routed on this lead.', 'justice-theme' ) . '</p></div>';
		return;
	}

	if ( 'created' !== $status ) {
		return;
	}

	$record = get_transient( 'justice_case_review_token_link_' . get_current_user_id() );

	if ( ! is_array( $record ) || empty( $record['url'] ) ) {
		return;
	}

	delete_transient( 'justice_case_review_token_link_' . get_current_user_id() );

	echo '<div class="notice notice-success"><p><strong>' . esc_html__( 'Verified client review link created.', 'justice-theme' ) . '</strong> ';
	echo esc_html__( 'Send it to the client of this lead. It is shown once:', 'justice-theme' ) . '</p>';
	echo '<p><input type="text" readonly onclick="this.select()" style="width:100%" value="' . esc_attr( (string) $record['url'] ) . '"></p></div>';
}
add_action( 'admin_notices', 'justice_theme_case_review_token_admin_notice' );

/**
 * Lawyer dashboard handler: a logged-in lawyer requests a review link for
 * a lead that is actually connected to one of their claimed profiles.
 */
function justice_theme_handle_lawyer_case_review_link(): void {
	if (
		! is_user_logged_in()
		|| ! isset( $_POST['justice_lawyer_case_review_nonce'] )
		|| ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_case_review_nonce'] ) ), 'justice_lawyer_case_review' )
	) {
		wp_safe_redirect( home_url( '/lawyer-dashboard/' ) );
		exit;
	}

	$lead_id  = isset( $_POST['lead_id'] ) ? absint( wp_unslash( $_POST['lead_id'] ) ) : 0;
	$back_url = wp_get_referer() ?: home_url( '/lawyer-dashboard/' );
	$user_id  = get_current_user_id();

	$claimed_profile_ids = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 10,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'meta_query'     => array(
				array(
					'key'   => 'claimed_by_user_id',
					'value' => (string) $user_id,
				),
			),
		)
	);

	$claimed_profile_ids = array_map( 'intval', $claimed_profile_ids ?: array() );
	$connected_ids       = justice_theme_lawyer_ids_connected_to_lead( $lead_id );
	$own_connected       = array_values( array_intersect( $claimed_profile_ids, $connected_ids ) );

	if ( empty( $own_connected ) ) {
		wp_safe_redirect( add_query_arg( 'case_review_link', 'failed', $back_url ) );
		exit;
	}

	$result = justice_theme_create_case_review_token( $lead_id, (int) $own_connected[0] );

	if ( ! empty( $result['error'] ) || empty( $result['url'] ) ) {
		wp_safe_redirect( add_query_arg( 'case_review_link', 'failed', $back_url ) );
		exit;
	}

	set_transient(
		'justice_lawyer_case_review_link_' . $user_id,
		array(
			'url'     => (string) $result['url'],
			'lead_id' => $lead_id,
		),
		15 * MINUTE_IN_SECONDS
	);

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_case_review_link', 'Lawyer created a case review link for lead #' . $lead_id );
	}

	wp_safe_redirect( add_query_arg( 'case_review_link', 'created', $back_url ) . '#dashboard-review-link' );
	exit;
}
add_action( 'admin_post_justice_lawyer_case_review_link', 'justice_theme_handle_lawyer_case_review_link' );

/**
 * The freshly minted dashboard review link for the current lawyer, once.
 *
 * @return array{url:string,lead_id:int}|null
 */
function justice_theme_lawyer_dashboard_fresh_review_link(): ?array {
	if ( ! is_user_logged_in() ) {
		return null;
	}

	$record = get_transient( 'justice_lawyer_case_review_link_' . get_current_user_id() );

	if ( ! is_array( $record ) || empty( $record['url'] ) ) {
		return null;
	}

	delete_transient( 'justice_lawyer_case_review_link_' . get_current_user_id() );

	return array(
		'url'     => (string) $record['url'],
		'lead_id' => (int) ( $record['lead_id'] ?? 0 ),
	);
}
