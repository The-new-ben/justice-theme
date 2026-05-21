<?php
/**
 * First-party lawyer recommendations.
 *
 * Google reviews stay external unless an approved API/policy path exists.
 * This CPT stores Jus-Tice first-party recommendations separately so owner
 * review, permission, moderation and later public display can be controlled.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_register_lawyer_recommendation_cpt(): void {
	$labels = array(
		'name'          => __( 'Lawyer Recommendations', 'justice-theme' ),
		'singular_name' => __( 'Lawyer Recommendation', 'justice-theme' ),
		'add_new_item'  => __( 'Add Lawyer Recommendation', 'justice-theme' ),
		'edit_item'     => __( 'Edit Lawyer Recommendation', 'justice-theme' ),
		'menu_name'     => __( 'Recommendations', 'justice-theme' ),
	);

	register_post_type(
		'justice_recommendation',
		array(
			'labels'        => $labels,
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => 'justice-lawyer-onboarding',
			'supports'      => array( 'title', 'editor' ),
			'capability_type' => 'post',
			'map_meta_cap'  => true,
			'has_archive'   => false,
			'rewrite'       => false,
			'show_in_rest'  => false,
		)
	);
}
add_action( 'init', 'justice_theme_register_lawyer_recommendation_cpt' );

function justice_theme_register_lawyer_recommendation_meta(): void {
	$fields = array(
		'recommended_lawyer_id'       => 'integer',
		'client_display_name'         => 'string',
		'client_relationship'         => 'string',
		'recommendation_rating'       => 'integer',
		'recommendation_source_type'  => 'string',
		'recommendation_source_url'   => 'string',
		'recommendation_received_at'  => 'string',
		'recommendation_permission'   => 'string',
		'recommendation_moderation'   => 'string',
		'recommendation_owner_note'   => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta(
			'justice_recommendation',
			$key,
			array(
				'single'            => true,
				'type'              => $type,
				'sanitize_callback' => justice_theme_recommendation_meta_sanitizer( $key ),
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_register_lawyer_recommendation_meta' );

function justice_theme_recommendation_meta_sanitizer( string $key ): string {
	if ( 'recommendation_source_url' === $key ) {
		return 'esc_url_raw';
	}

	if ( 'recommended_lawyer_id' === $key || 'recommendation_rating' === $key ) {
		return 'absint';
	}

	if ( 'recommendation_owner_note' === $key ) {
		return 'sanitize_textarea_field';
	}

	return 'sanitize_text_field';
}

function justice_theme_recommendation_moderation_options(): array {
	return array(
		'draft_review' => __( 'Draft / owner review', 'justice-theme' ),
		'permission_needed' => __( 'Permission needed', 'justice-theme' ),
		'approved_private' => __( 'Approved private', 'justice-theme' ),
		'approved_public' => __( 'Approved public', 'justice-theme' ),
		'rejected' => __( 'Rejected', 'justice-theme' ),
	);
}

function justice_theme_recommendation_source_type_options(): array {
	return array(
		'first_party'   => __( 'First-party Jus-Tice recommendation', 'justice-theme' ),
		'google_link'   => __( 'Google link/reference only', 'justice-theme' ),
		'manual_import' => __( 'Manual import / not public by default', 'justice-theme' ),
		'other'         => __( 'Other / review before display', 'justice-theme' ),
	);
}

function justice_theme_public_recommendation_source_types(): array {
	$allowed = apply_filters( 'justice_theme_public_recommendation_source_types', array( 'first_party' ) );
	$allowed = array_values( array_unique( array_map( 'sanitize_key', (array) $allowed ) ) );
	$allowed = array_values( array_intersect( $allowed, array_keys( justice_theme_recommendation_source_type_options() ) ) );

	return $allowed ?: array( 'first_party' );
}

function justice_theme_lawyer_public_recommendation_meta_query( int $lawyer_id ): array {
	return array(
		'relation' => 'AND',
		array(
			'key'   => 'recommended_lawyer_id',
			'value' => (string) $lawyer_id,
		),
		array(
			'key'   => 'recommendation_moderation',
			'value' => 'approved_public',
		),
		array(
			'key'   => 'recommendation_permission',
			'value' => 'confirmed',
		),
		array(
			'key'     => 'recommendation_source_type',
			'value'   => justice_theme_public_recommendation_source_types(),
			'compare' => 'IN',
		),
	);
}

function justice_theme_recommendation_meta_boxes(): void {
	add_meta_box(
		'justice_theme_recommendation_details',
		__( 'Recommendation Details', 'justice-theme' ),
		'justice_theme_render_recommendation_details_box',
		'justice_recommendation',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_recommendation_meta_boxes' );

function justice_theme_render_recommendation_details_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_recommendation_details', 'justice_theme_recommendation_details_nonce' );

	$lawyer_id     = (int) get_post_meta( $post->ID, 'recommended_lawyer_id', true );
	$client_name   = (string) get_post_meta( $post->ID, 'client_display_name', true );
	$relationship  = (string) get_post_meta( $post->ID, 'client_relationship', true );
	$rating        = (int) get_post_meta( $post->ID, 'recommendation_rating', true );
	$source_type   = (string) get_post_meta( $post->ID, 'recommendation_source_type', true );
	$source_url    = (string) get_post_meta( $post->ID, 'recommendation_source_url', true );
	$received_at   = (string) get_post_meta( $post->ID, 'recommendation_received_at', true );
	$permission    = (string) get_post_meta( $post->ID, 'recommendation_permission', true );
	$moderation    = (string) get_post_meta( $post->ID, 'recommendation_moderation', true ) ?: 'draft_review';
	$owner_note    = (string) get_post_meta( $post->ID, 'recommendation_owner_note', true );
	$lawyers       = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 200,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'fields'         => 'ids',
		)
	);
	?>
	<p>Store only recommendations that have owner/lawyer review. Do not paste Google review text here unless the policy/API path is explicitly approved.</p>
	<table class="form-table" role="presentation">
		<tr>
			<th scope="row"><label for="justice-recommendation-lawyer-id">Lawyer profile</label></th>
			<td>
				<select id="justice-recommendation-lawyer-id" name="recommended_lawyer_id">
					<option value="0">Select lawyer</option>
					<?php foreach ( $lawyers as $candidate_id ) : ?>
						<option value="<?php echo esc_attr( $candidate_id ); ?>" <?php selected( $lawyer_id, $candidate_id ); ?>><?php echo esc_html( get_the_title( $candidate_id ) ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-client-display-name">Client display name</label></th>
			<td><input id="justice-client-display-name" type="text" name="client_display_name" value="<?php echo esc_attr( $client_name ); ?>" class="regular-text" placeholder="Initials or approved display name"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-client-relationship">Client relationship/context</label></th>
			<td><input id="justice-client-relationship" type="text" name="client_relationship" value="<?php echo esc_attr( $relationship ); ?>" class="regular-text" placeholder="Example: former client, with permission"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-rating">Rating</label></th>
			<td><input id="justice-recommendation-rating" type="number" min="0" max="5" step="1" name="recommendation_rating" value="<?php echo esc_attr( (string) $rating ); ?>" class="small-text"> <span class="description">0 means no public star rating.</span></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-source-type">Source type</label></th>
			<td>
				<select id="justice-recommendation-source-type" name="recommendation_source_type">
					<?php foreach ( justice_theme_recommendation_source_type_options() as $type => $label ) : ?>
						<option value="<?php echo esc_attr( $type ); ?>" <?php selected( $source_type ?: 'first_party', $type ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description">Only first-party Jus-Tice recommendations are public by default. Google links stay external/reference-only unless policy changes are explicitly approved.</p>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-source-url">Source URL</label></th>
			<td><input id="justice-recommendation-source-url" type="url" name="recommendation_source_url" value="<?php echo esc_attr( $source_url ); ?>" class="regular-text"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-received-at">Received date</label></th>
			<td><input id="justice-recommendation-received-at" type="date" name="recommendation_received_at" value="<?php echo esc_attr( $received_at ); ?>"></td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-permission">Permission status</label></th>
			<td>
				<select id="justice-recommendation-permission" name="recommendation_permission">
					<?php foreach ( array( 'unknown', 'requested', 'confirmed', 'declined' ) as $status ) : ?>
						<option value="<?php echo esc_attr( $status ); ?>" <?php selected( $permission ?: 'unknown', $status ); ?>><?php echo esc_html( $status ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-moderation">Moderation</label></th>
			<td>
				<select id="justice-recommendation-moderation" name="recommendation_moderation">
					<?php foreach ( justice_theme_recommendation_moderation_options() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $moderation, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description">Use "Approved public" only after permission, ethics and owner review.</p>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="justice-recommendation-owner-note">Owner note</label></th>
			<td><textarea id="justice-recommendation-owner-note" name="recommendation_owner_note" rows="4" class="large-text"><?php echo esc_textarea( $owner_note ); ?></textarea></td>
		</tr>
	</table>
	<?php
}

function justice_theme_save_recommendation_details( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_recommendation_details_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_recommendation_details_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_recommendation_details' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$rating = isset( $_POST['recommendation_rating'] ) ? absint( wp_unslash( $_POST['recommendation_rating'] ) ) : 0;
	if ( $rating > 5 ) {
		$rating = 5;
	}

	$moderation = isset( $_POST['recommendation_moderation'] ) ? sanitize_key( wp_unslash( $_POST['recommendation_moderation'] ) ) : 'draft_review';
	if ( ! array_key_exists( $moderation, justice_theme_recommendation_moderation_options() ) ) {
		$moderation = 'draft_review';
	}

	$permission = isset( $_POST['recommendation_permission'] ) ? sanitize_key( wp_unslash( $_POST['recommendation_permission'] ) ) : 'unknown';
	if ( ! in_array( $permission, array( 'unknown', 'requested', 'confirmed', 'declined' ), true ) ) {
		$permission = 'unknown';
	}

	$source_type = isset( $_POST['recommendation_source_type'] ) ? sanitize_key( wp_unslash( $_POST['recommendation_source_type'] ) ) : 'first_party';
	if ( ! array_key_exists( $source_type, justice_theme_recommendation_source_type_options() ) ) {
		$source_type = 'first_party';
	}

	update_post_meta( $post_id, 'recommended_lawyer_id', isset( $_POST['recommended_lawyer_id'] ) ? absint( wp_unslash( $_POST['recommended_lawyer_id'] ) ) : 0 );
	update_post_meta( $post_id, 'client_display_name', isset( $_POST['client_display_name'] ) ? sanitize_text_field( wp_unslash( $_POST['client_display_name'] ) ) : '' );
	update_post_meta( $post_id, 'client_relationship', isset( $_POST['client_relationship'] ) ? sanitize_text_field( wp_unslash( $_POST['client_relationship'] ) ) : '' );
	update_post_meta( $post_id, 'recommendation_rating', $rating );
	update_post_meta( $post_id, 'recommendation_source_type', $source_type );
	update_post_meta( $post_id, 'recommendation_source_url', isset( $_POST['recommendation_source_url'] ) ? esc_url_raw( wp_unslash( $_POST['recommendation_source_url'] ) ) : '' );
	update_post_meta( $post_id, 'recommendation_received_at', isset( $_POST['recommendation_received_at'] ) ? sanitize_text_field( wp_unslash( $_POST['recommendation_received_at'] ) ) : '' );
	update_post_meta( $post_id, 'recommendation_permission', $permission );
	update_post_meta( $post_id, 'recommendation_moderation', $moderation );
	update_post_meta( $post_id, 'recommendation_owner_note', isset( $_POST['recommendation_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['recommendation_owner_note'] ) ) : '' );
}
add_action( 'save_post_justice_recommendation', 'justice_theme_save_recommendation_details' );

function justice_theme_lawyer_recommendation_counts( int $lawyer_id ): array {
	if ( ! post_type_exists( 'justice_recommendation' ) ) {
		return array( 'approved_public' => 0, 'fresh_approved' => 0 );
	}

	$approved = new WP_Query(
		array(
			'post_type'      => 'justice_recommendation',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id ),
		)
	);

	$fresh = new WP_Query(
		array(
			'post_type'      => 'justice_recommendation',
			'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'date_query'     => array(
				array(
					'after' => '120 days ago',
				),
			),
			'meta_query'     => justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id ),
		)
	);

	return array(
		'approved_public' => (int) $approved->found_posts,
		'fresh_approved'  => (int) $fresh->found_posts,
	);
}

function justice_theme_lawyer_public_recommendations( int $lawyer_id, int $limit = 3 ): array {
	if ( ! post_type_exists( 'justice_recommendation' ) || ! $lawyer_id ) {
		return array();
	}

	$recommendations = new WP_Query(
		array(
			'post_type'           => 'justice_recommendation',
			'post_status'         => 'publish',
			'posts_per_page'      => max( 1, min( 6, $limit ) ),
			'orderby'             => 'date',
			'order'               => 'DESC',
			'ignore_sticky_posts' => true,
			'meta_query'          => justice_theme_lawyer_public_recommendation_meta_query( $lawyer_id ),
		)
	);

	if ( ! $recommendations->have_posts() ) {
		return array();
	}

	$items = array();
	foreach ( $recommendations->posts as $recommendation ) {
		$quote = trim( wp_strip_all_tags( (string) $recommendation->post_content ) );
		if ( '' === $quote ) {
			continue;
		}

		$items[] = array(
			'id'            => (int) $recommendation->ID,
			'quote'         => $quote,
			'client_name'   => (string) get_post_meta( $recommendation->ID, 'client_display_name', true ),
			'relationship'  => (string) get_post_meta( $recommendation->ID, 'client_relationship', true ),
			'rating'        => (int) get_post_meta( $recommendation->ID, 'recommendation_rating', true ),
			'received_at'   => (string) get_post_meta( $recommendation->ID, 'recommendation_received_at', true ),
			'source_type'   => (string) get_post_meta( $recommendation->ID, 'recommendation_source_type', true ),
		);
	}

	return $items;
}

function justice_theme_recommendation_columns( array $columns ): array {
	$columns['recommended_lawyer'] = __( 'Lawyer', 'justice-theme' );
	$columns['moderation']         = __( 'Moderation', 'justice-theme' );
	$columns['permission']         = __( 'Permission', 'justice-theme' );
	$columns['received_at']        = __( 'Received', 'justice-theme' );
	return $columns;
}
add_filter( 'manage_justice_recommendation_posts_columns', 'justice_theme_recommendation_columns' );

function justice_theme_render_recommendation_columns( string $column, int $post_id ): void {
	if ( 'recommended_lawyer' === $column ) {
		$lawyer_id = (int) get_post_meta( $post_id, 'recommended_lawyer_id', true );
		echo esc_html( $lawyer_id ? get_the_title( $lawyer_id ) : '-' );
	}

	if ( 'moderation' === $column ) {
		$moderation = (string) get_post_meta( $post_id, 'recommendation_moderation', true );
		echo esc_html( $moderation ?: 'draft_review' );
	}

	if ( 'permission' === $column ) {
		$permission = (string) get_post_meta( $post_id, 'recommendation_permission', true );
		echo esc_html( $permission ?: 'unknown' );
	}

	if ( 'received_at' === $column ) {
		echo esc_html( (string) get_post_meta( $post_id, 'recommendation_received_at', true ) ?: '-' );
	}
}
add_action( 'manage_justice_recommendation_posts_custom_column', 'justice_theme_render_recommendation_columns', 10, 2 );

