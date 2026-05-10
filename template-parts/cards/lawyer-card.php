<?php
/**
 * Premium lawyer card for verified directory/profile surfaces.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'justice_theme_lawyer_card_public_city_label' ) ) {
	/**
	 * Convert setup slugs/demo terms into visitor-facing Hebrew where possible.
	 */
	function justice_theme_lawyer_card_public_city_label( string $name, string $slug = '' ): string {
		$map = array(
			'tel-aviv'      => 'תל אביב',
			'jerusalem'     => 'ירושלים',
			'haifa'         => 'חיפה',
			'petah-tikva'   => 'פתח תקווה',
			'ramat-gan'     => 'רמת גן',
			'beer-sheva'    => 'באר שבע',
			'rishon-lezion' => 'ראשון לציון',
			'netanya'       => 'נתניה',
			'ashdod'        => 'אשדוד',
			'holon'         => 'חולון',
		);

		$key = $slug ?: sanitize_title( $name );
		if ( isset( $map[ $key ] ) ) {
			return $map[ $key ];
		}

		return preg_match( '/^[a-z0-9-]+$/i', $name ) ? ucwords( str_replace( '-', ' ', $name ) ) : $name;
	}
}

$lawyer_id       = get_the_ID();
$firm            = get_post_meta( $lawyer_id, 'firm_name', true );
$phone           = get_post_meta( $lawyer_id, 'phone', true );
$whatsapp        = get_post_meta( $lawyer_id, 'whatsapp', true );
$experience      = get_post_meta( $lawyer_id, 'years_experience', true );
$languages       = get_post_meta( $lawyer_id, 'languages', true );
$bio_short       = get_post_meta( $lawyer_id, 'bio_short', true );
$plan            = get_post_meta( $lawyer_id, 'plan_type', true );
$subscription    = get_post_meta( $lawyer_id, 'subscription_status', true );
$verified        = get_post_meta( $lawyer_id, 'verification_status', true );
$source_type     = get_post_meta( $lawyer_id, 'source_type', true );
$internal_notes  = get_post_meta( $lawyer_id, 'internal_notes', true );
$review_count    = (int) get_post_meta( $lawyer_id, 'review_count', true );
$average_rating  = (float) get_post_meta( $lawyer_id, 'average_rating', true );
$is_seed_data    = 'seed' === $source_type || false !== stripos( (string) $internal_notes, 'SEED_DATA' );
$is_paid         = ! $is_seed_data && 'active' === $subscription && in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
$cities          = get_the_terms( $lawyer_id, 'city' );
$areas           = get_the_terms( $lawyer_id, 'practice-areas' );
$city_name       = ( $cities && ! is_wp_error( $cities ) ) ? justice_theme_lawyer_card_public_city_label( $cities[0]->name, $cities[0]->slug ) : '';
$area_names      = ( $areas && ! is_wp_error( $areas ) ) ? wp_list_pluck( array_slice( $areas, 0, 3 ), 'name' ) : array();
$phone_link      = $phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) : '';
$whatsapp_digits = $whatsapp ? preg_replace( '/[^0-9]/', '', $whatsapp ) : '';
$whatsapp_link   = $whatsapp_digits ? 'https://wa.me/972' . ltrim( $whatsapp_digits, '0' ) : '';
?>

<article class="lawyer-card premium-card">
	<a class="lawyer-card__media" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( sprintf( 'פרופיל עורך הדין %s', get_the_title() ) ); ?>">
		<?php if ( has_post_thumbnail() ) : ?>
			<?php the_post_thumbnail( 'justice-card', array( 'loading' => 'lazy' ) ); ?>
		<?php else : ?>
			<div class="lawyer-card__placeholder" aria-hidden="true">
				<span><?php echo esc_html( mb_substr( get_the_title(), 0, 2 ) ); ?></span>
			</div>
		<?php endif; ?>
	</a>

	<div class="lawyer-card__body">
		<div class="lawyer-card__top">
			<h3 class="lawyer-card__name">
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h3>
			<?php if ( 'verified' === $verified ) : ?>
				<span class="lawyer-card__status">מאומת</span>
			<?php elseif ( $is_paid ) : ?>
				<span class="lawyer-card__status lawyer-card__status--sponsored">ממומן</span>
			<?php endif; ?>
		</div>

		<?php if ( $firm ) : ?>
			<p class="lawyer-card__firm"><?php echo esc_html( $firm ); ?></p>
		<?php endif; ?>

		<?php if ( $city_name || ! empty( $area_names ) ) : ?>
			<p class="lawyer-card__meta">
				<?php echo esc_html( implode( ' · ', array_filter( array_merge( array( $city_name ), $area_names ) ) ) ); ?>
			</p>
		<?php endif; ?>

		<?php if ( $bio_short ) : ?>
			<p class="lawyer-card__summary"><?php echo esc_html( wp_trim_words( $bio_short, 24, '...' ) ); ?></p>
		<?php endif; ?>

		<div class="lawyer-card__proof">
			<?php if ( $experience ) : ?>
				<span><?php echo esc_html( $experience ); ?> שנות ניסיון</span>
			<?php endif; ?>
			<?php if ( $languages ) : ?>
				<span><?php echo esc_html( $languages ); ?></span>
			<?php endif; ?>
			<?php if ( $review_count > 0 && $average_rating > 0 ) : ?>
				<span><?php echo esc_html( number_format_i18n( $average_rating, 1 ) ); ?> / 5</span>
			<?php endif; ?>
		</div>

		<div class="lawyer-card__actions">
			<a class="button button--primary" href="<?php the_permalink(); ?>">צפייה בפרופיל</a>
			<?php if ( $whatsapp_link ) : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $whatsapp_link ); ?>" target="_blank" rel="noopener">וואטסאפ</a>
			<?php elseif ( $phone_link ) : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $phone_link ); ?>">שיחה</a>
			<?php else : ?>
				<a class="button button--ghost" href="<?php echo esc_url( add_query_arg( 'lawyer_id', $lawyer_id, home_url( '/contact/' ) ) ); ?>">שליחת פנייה</a>
			<?php endif; ?>
		</div>
	</div>
</article>
