<?php
/**
 * Google Business reviews for lawyer profiles, via the official Google
 * Places API.
 *
 * Real reviews only, fetched server-side and displayed with Google
 * attribution as the Places policies require. The API key lives on the
 * server (wp-config constant or the mu-plugin filter), never in this repo.
 * Google review content is display-only: it is deliberately kept OUT of
 * the profile's Review/AggregateRating schema, which stays first-party
 * (Google's structured-data policy forbids marking up third-party reviews
 * as your own).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Server-held Places API key. Define JUSTICE_GOOGLE_PLACES_KEY in
 * wp-config.php or supply it via the filter from the mu-plugin (same
 * pattern as the OpenAI key). Empty string disables the whole feature
 * gracefully.
 *
 * @return string
 */
function justice_theme_google_places_api_key(): string {
	$key = defined( 'JUSTICE_GOOGLE_PLACES_KEY' ) ? (string) JUSTICE_GOOGLE_PLACES_KEY : '';

	return (string) apply_filters( 'justice_theme_google_places_api_key', $key );
}

/**
 * Resolve and persist the Google Place ID for a lawyer office.
 *
 * Prefers the stored google_place_id meta. When empty, resolves once from
 * the office address plus firm name through the official Find Place
 * endpoint and stores the result, so the owner never has to hunt for
 * Place IDs manually.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @return string Place ID or empty string.
 */
function justice_theme_lawyer_resolve_google_place_id( int $lawyer_id ): string {
	$place_id = trim( (string) get_post_meta( $lawyer_id, 'google_place_id', true ) );

	if ( '' !== $place_id ) {
		return $place_id;
	}

	$api_key = justice_theme_google_places_api_key();
	$address = trim( (string) get_post_meta( $lawyer_id, 'office_address', true ) );

	if ( '' === $api_key || '' === $address ) {
		return '';
	}

	// One resolution attempt per day per profile so a bad address does not
	// burn API quota on every page view.
	$attempt_key = 'justice_gplace_resolve_' . $lawyer_id;
	if ( get_transient( $attempt_key ) ) {
		return '';
	}
	set_transient( $attempt_key, 1, DAY_IN_SECONDS );

	$firm  = trim( (string) get_post_meta( $lawyer_id, 'firm_name', true ) );
	$query = trim( $firm . ' ' . $address );

	$response = wp_remote_get(
		add_query_arg(
			array(
				'input'     => rawurlencode( $query ),
				'inputtype' => 'textquery',
				'fields'    => 'place_id',
				'language'  => 'he',
				'key'       => $api_key,
			),
			'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
		),
		array( 'timeout' => 8 )
	);

	if ( is_wp_error( $response ) ) {
		return '';
	}

	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	if ( ! is_array( $body ) || 'OK' !== ( $body['status'] ?? '' ) || empty( $body['candidates'][0]['place_id'] ) ) {
		return '';
	}

	$place_id = sanitize_text_field( (string) $body['candidates'][0]['place_id'] );
	update_post_meta( $lawyer_id, 'google_place_id', $place_id );

	return $place_id;
}

/**
 * Fetch the office's real Google rating, review count and top reviews.
 *
 * Official Place Details endpoint, cached in a 12-hour transient per
 * profile to respect quota while staying reasonably fresh.
 *
 * @param int $lawyer_id Lawyer post ID.
 * @return array{rating:float,total:int,url:string,reviews:array<int,array{author:string,rating:int,text:string,relative_time:string,author_photo:string}>}|null
 */
function justice_theme_lawyer_google_reviews( int $lawyer_id ) {
	$api_key = justice_theme_google_places_api_key();

	if ( '' === $api_key || ! $lawyer_id ) {
		return null;
	}

	$cache_key = 'justice_greviews_' . $lawyer_id;
	$cached    = get_transient( $cache_key );

	if ( is_array( $cached ) ) {
		return ! empty( $cached['rating'] ) ? $cached : null;
	}

	$place_id = justice_theme_lawyer_resolve_google_place_id( $lawyer_id );

	if ( '' === $place_id ) {
		return null;
	}

	$response = wp_remote_get(
		add_query_arg(
			array(
				'place_id'     => rawurlencode( $place_id ),
				'fields'       => 'rating,user_ratings_total,reviews,url',
				'language'     => 'he',
				'reviews_sort' => 'newest',
				'key'          => $api_key,
			),
			'https://maps.googleapis.com/maps/api/place/details/json'
		),
		array( 'timeout' => 8 )
	);

	if ( is_wp_error( $response ) ) {
		return null;
	}

	$body   = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$result = is_array( $body ) && 'OK' === ( $body['status'] ?? '' ) && is_array( $body['result'] ?? null )
		? $body['result']
		: array();

	$data = array(
		'rating'  => isset( $result['rating'] ) ? round( (float) $result['rating'], 1 ) : 0.0,
		'total'   => isset( $result['user_ratings_total'] ) ? (int) $result['user_ratings_total'] : 0,
		'url'     => isset( $result['url'] ) ? esc_url_raw( (string) $result['url'] ) : '',
		'reviews' => array(),
	);

	foreach ( array_slice( (array) ( $result['reviews'] ?? array() ), 0, 4 ) as $review ) {
		if ( ! is_array( $review ) ) {
			continue;
		}

		$text = trim( wp_strip_all_tags( (string) ( $review['text'] ?? '' ) ) );

		$data['reviews'][] = array(
			'author'        => sanitize_text_field( (string) ( $review['author_name'] ?? '' ) ),
			'rating'        => max( 0, min( 5, (int) ( $review['rating'] ?? 0 ) ) ),
			'text'          => $text,
			'relative_time' => sanitize_text_field( (string) ( $review['relative_time_description'] ?? '' ) ),
			'author_photo'  => esc_url_raw( (string) ( $review['profile_photo_url'] ?? '' ) ),
		);
	}

	set_transient( $cache_key, $data, 12 * HOUR_IN_SECONDS );

	return ! empty( $data['rating'] ) ? $data : null;
}

/**
 * Render the Google reviews panel for a lawyer profile.
 *
 * Displayed with explicit Google attribution per the Places display
 * policies. Renders nothing when the feature is unconfigured, the office
 * has no Google listing, or the profile is not approved for facts.
 *
 * @param int $lawyer_id Lawyer post ID.
 */
function justice_theme_render_lawyer_google_reviews( int $lawyer_id ): void {
	$data = justice_theme_lawyer_google_reviews( $lawyer_id );

	if ( empty( $data ) || $data['rating'] <= 0 || $data['total'] < 1 ) {
		return;
	}

	$full_stars = (int) round( $data['rating'] );
	?>
	<div class="lawyer-google-reviews" aria-label="<?php esc_attr_e( 'ביקורות Google על המשרד', 'justice-theme' ); ?>">
		<div class="lawyer-google-reviews__head">
			<span class="lawyer-google-reviews__brand" aria-hidden="true">G</span>
			<div>
				<strong><?php esc_html_e( 'ביקורות Google', 'justice-theme' ); ?></strong>
				<span class="lawyer-google-reviews__score">
					<span aria-hidden="true"><?php echo esc_html( str_repeat( '★', $full_stars ) . str_repeat( '☆', 5 - $full_stars ) ); ?></span>
					<?php echo esc_html( number_format_i18n( $data['rating'], 1 ) ); ?>
					<?php echo esc_html( sprintf( __( 'לפי %s ביקורות בגוגל', 'justice-theme' ), number_format_i18n( $data['total'] ) ) ); ?>
				</span>
			</div>
			<?php if ( $data['url'] ) : ?>
				<a class="lawyer-google-reviews__all" href="<?php echo esc_url( $data['url'] ); ?>" target="_blank" rel="noopener nofollow"><?php esc_html_e( 'לכל הביקורות בגוגל ←', 'justice-theme' ); ?></a>
			<?php endif; ?>
		</div>
		<?php if ( ! empty( $data['reviews'] ) ) : ?>
			<div class="lawyer-google-reviews__list">
				<?php foreach ( $data['reviews'] as $review ) : ?>
					<?php
					if ( '' === $review['text'] ) {
						continue;
					}
					?>
					<figure class="lawyer-google-reviews__card">
						<div class="lawyer-google-reviews__card-head">
							<?php if ( $review['author_photo'] ) : ?>
								<img src="<?php echo esc_url( $review['author_photo'] ); ?>" alt="" width="34" height="34" loading="lazy" referrerpolicy="no-referrer">
							<?php endif; ?>
							<div>
								<strong><?php echo esc_html( $review['author'] ); ?></strong>
								<span aria-label="<?php echo esc_attr( sprintf( __( 'דירוג %d מתוך 5', 'justice-theme' ), $review['rating'] ) ); ?>"><span aria-hidden="true"><?php echo esc_html( str_repeat( '★', $review['rating'] ) ); ?></span> · <?php echo esc_html( $review['relative_time'] ); ?></span>
							</div>
						</div>
						<blockquote><?php echo esc_html( wp_trim_words( $review['text'], 40, '…' ) ); ?></blockquote>
					</figure>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		<p class="lawyer-google-reviews__attribution"><?php esc_html_e( 'הביקורות מוצגות מתוך Google. התוכן באחריות כותביהן.', 'justice-theme' ); ?></p>
	</div>
	<?php
}
