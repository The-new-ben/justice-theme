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
		$map = array_merge(
			$map,
			array(
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
				'herzliya'      => 'הרצליה',
			)
		);

		if ( isset( $map[ $key ] ) ) {
			return $map[ $key ];
		}

		return preg_match( '/^[a-z0-9-]+$/i', $name ) ? ucwords( str_replace( '-', ' ', $name ) ) : $name;
	}
}

$lawyer_id       = get_the_ID();
$lawyer_url      = justice_theme_public_permalink( $lawyer_id );
$firm            = get_post_meta( $lawyer_id, 'firm_name', true );
$phone           = get_post_meta( $lawyer_id, 'phone', true );
$whatsapp        = get_post_meta( $lawyer_id, 'whatsapp', true );
$experience      = get_post_meta( $lawyer_id, 'years_experience', true );
$languages       = get_post_meta( $lawyer_id, 'languages', true );
$bio_short       = get_post_meta( $lawyer_id, 'bio_short', true );
$professional    = strtolower( (string) get_post_meta( $lawyer_id, 'professional_type', true ) );
$plan            = get_post_meta( $lawyer_id, 'plan_type', true );
$subscription    = get_post_meta( $lawyer_id, 'subscription_status', true );
$verified        = get_post_meta( $lawyer_id, 'verification_status', true );
$source_type     = get_post_meta( $lawyer_id, 'source_type', true );
$profile_status  = get_post_meta( $lawyer_id, 'profile_status', true );
$claimed_user_id = (int) get_post_meta( $lawyer_id, 'claimed_by_user_id', true );
$internal_notes  = get_post_meta( $lawyer_id, 'internal_notes', true );
$review_count    = (int) get_post_meta( $lawyer_id, 'review_count', true );
$average_rating  = (float) get_post_meta( $lawyer_id, 'average_rating', true );
$reviews_enabled = in_array( strtolower( (string) get_post_meta( $lawyer_id, 'review_display_enabled', true ) ), array( '1', 'yes', 'true', 'enabled', 'approved' ), true );
$card_context    = isset( $GLOBALS['justice_lawyer_card_context'] ) ? sanitize_key( (string) $GLOBALS['justice_lawyer_card_context'] ) : '';
$is_homepage_showcase = 'homepage_showcase' === $card_context;
$is_seed_data    = 'seed' === $source_type || false !== stripos( (string) $internal_notes, 'SEED_DATA' );
$is_paid         = ! $is_seed_data && ( function_exists( 'justice_theme_lawyer_paid_plan_is_active' )
	? justice_theme_lawyer_paid_plan_is_active( $lawyer_id )
	: ( 'active' === $subscription && in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true ) ) );
$sponsor_status  = function_exists( 'justice_theme_lawyer_sponsored_placement_status' ) ? justice_theme_lawyer_sponsored_placement_status( $lawyer_id ) : 'none';
$has_public_sponsor = ! $is_seed_data && ( function_exists( 'justice_theme_lawyer_has_public_sponsored_placement' ) ? justice_theme_lawyer_has_public_sponsored_placement( $lawyer_id ) : $is_paid );
$has_reserved_sponsor = ! $is_seed_data && 'reserved' === $sponsor_status;
$is_basic_public = ! $is_seed_data
	&& 0 === $claimed_user_id
	&& 'verified' !== $verified
	&& in_array( strtolower( (string) $source_type ), array( 'public_index', 'import' ), true )
	&& in_array( strtolower( (string) $profile_status ), array( 'public', 'published' ), true );
$show_rating     = $reviews_enabled && ! $is_seed_data && $review_count > 0 && $average_rating > 0;
$cities          = get_the_terms( $lawyer_id, 'city' );
$areas           = get_the_terms( $lawyer_id, 'practice-areas' );
$city_name       = ( $cities && ! is_wp_error( $cities ) ) ? justice_theme_lawyer_card_public_city_label( $cities[0]->name, $cities[0]->slug ) : '';
$area_names      = ( $areas && ! is_wp_error( $areas ) ) ? wp_list_pluck( array_slice( $areas, 0, 3 ), 'name' ) : array();
$phone_link      = function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( (string) $phone ) : '';
$whatsapp_link   = function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( (string) $whatsapp ) : '';
$has_thumbnail   = has_post_thumbnail( $lawyer_id );
$is_maya_profile = 'advocate-maya-rotenberg' === get_post_field( 'post_name', $lawyer_id )
	|| (
		false !== mb_strpos( get_the_title( $lawyer_id ), rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) )
		&& false !== mb_strpos( get_the_title( $lawyer_id ), rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) )
	);
$profile_fact_review_status = sanitize_key( (string) get_post_meta( $lawyer_id, 'profile_fact_review_status', true ) );
$profile_is_fact_checked    = in_array( $profile_fact_review_status, array( 'approved', 'source_checked', 'owner_approved', 'lawyer_approved' ), true );
$requires_fact_gate         = $is_maya_profile
	|| $is_seed_data
	|| in_array( strtolower( (string) $source_type ), array( 'public_index', 'import' ), true );
$show_profile_claims        = ! $requires_fact_gate || $profile_is_fact_checked;
$trusted_contact_source     = in_array( strtolower( (string) $source_type ), array( 'lawyer_submitted', 'owner_verified', 'verified_public' ), true );
$show_direct_contact        = $show_profile_claims || $is_paid || 'verified' === strtolower( (string) $verified ) || $trusted_contact_source;
$show_rating                = $show_rating && $show_profile_claims;

if ( ! $show_profile_claims ) {
	$firm = '';
}

if ( ! $show_direct_contact ) {
	$phone_link    = '';
	$whatsapp_link = '';
}

$show_thumbnail  = $has_thumbnail
	&& ! $is_seed_data
	&& ( ! $is_maya_profile || $profile_is_fact_checked )
	&& (
		$is_paid
		|| 'verified' === strtolower( (string) $verified )
		|| in_array( strtolower( (string) $source_type ), array( 'lawyer_submitted', 'owner_verified', 'verified_public' ), true )
	);
$card_classes    = array( 'lawyer-card', 'premium-card' );

if ( $show_thumbnail ) {
	$card_classes[] = 'lawyer-card--has-photo';
} else {
	$card_classes[] = 'lawyer-card--initials';
}

if ( $is_basic_public ) {
	$card_classes[] = 'lawyer-card--basic-index';
}

if ( $is_paid ) {
	$card_classes[] = 'lawyer-card--paid';
}

if ( $has_public_sponsor ) {
	$card_classes[] = 'lawyer-card--sponsored';
} elseif ( $has_reserved_sponsor ) {
	$card_classes[] = 'lawyer-card--promoted';
}

if ( $requires_fact_gate && ! $profile_is_fact_checked ) {
	$card_classes[] = 'lawyer-card--fact-gated';
}
$is_legal_provider = in_array( $professional, array( 'rabbinical_advocate', 'mediator', 'legal_service_provider', 'expert_witness' ), true )
	|| false !== mb_stripos( get_the_title(), 'טוען רבני' )
	|| false !== mb_stripos( get_the_title(), 'מגשר' );
$profile_label = $is_legal_provider ? __( 'כרטיס מקצועי', 'justice-theme' ) : __( 'פרופיל עורך דין', 'justice-theme' );
$claim_url       = add_query_arg(
	array(
		'claim_profile_id' => $lawyer_id,
		'claim_profile'    => get_post_field( 'post_name', $lawyer_id ),
		'plan_interest'    => 'featured',
		'source'           => 'public_card_claim_upgrade',
	),
	home_url( '/lawyer-registration/' )
);
$inquiry_url     = add_query_arg( 'lawyer_id', $lawyer_id, home_url( '/contact/' ) );
?>

<article class="<?php echo esc_attr( implode( ' ', array_unique( $card_classes ) ) ); ?>">
	<a class="lawyer-card__media<?php echo $show_thumbnail ? '' : ' lawyer-card__media--initials'; ?>" href="<?php echo esc_url( $lawyer_url ); ?>" aria-label="<?php echo esc_attr( sprintf( '%s %s', $profile_label, get_the_title() ) ); ?>">
		<?php if ( $show_thumbnail ) : ?>
			<?php
			echo wp_get_attachment_image(
				get_post_thumbnail_id( $lawyer_id ),
				'justice-card',
				false,
				array(
					'class'    => 'lawyer-card__photo',
					'loading'  => 'lazy',
					'decoding' => 'async',
					'sizes'    => '(max-width: 640px) 86px, 112px',
				)
			);
			?>
		<?php else :
			$lawyer_title = get_the_title();
			$name_parts   = preg_split( '/\s+/', trim( $lawyer_title ) );
			$prefixes     = array( 'עו״ד', 'עו"ד', "עו\xd7\xb3\xd7\x93", 'עוד', 'ד״ר', 'ד"ר', 'פרופ', 'פרופ׳' );
			while ( ! empty( $name_parts ) && in_array( $name_parts[0], $prefixes, true ) ) {
				array_shift( $name_parts );
			}

			$initials = '';
			foreach ( array_slice( $name_parts, 0, 2 ) as $name_part ) {
				$clean_part = preg_replace( '/[^\p{L}\p{N}]+/u', '', (string) $name_part );
				if ( '' !== $clean_part ) {
					$initials .= mb_substr( $clean_part, 0, 1 );
				}
			}

			if ( '' === $initials ) {
				$initials = mb_substr( wp_strip_all_tags( $lawyer_title ), 0, 2 );
			}
		?>
			<span class="lawyer-card__initials" aria-hidden="true"><?php echo esc_html( $initials ); ?></span>
		<?php endif; ?>
	</a>

	<div class="lawyer-card__body">
		<div class="lawyer-card__top">
			<h3 class="lawyer-card__name">
				<a href="<?php echo esc_url( $lawyer_url ); ?>"><?php the_title(); ?></a>
			</h3>
			<?php if ( $has_public_sponsor && $show_profile_claims ) : ?>
				<span class="lawyer-card__status lawyer-card__status--sponsored"><?php esc_html_e( 'ממומן', 'justice-theme' ); ?></span>
			<?php elseif ( $has_reserved_sponsor && $show_profile_claims ) : ?>
				<span class="lawyer-card__status lawyer-card__status--sponsored"><?php esc_html_e( 'מקודם', 'justice-theme' ); ?></span>
			<?php elseif ( 'verified' === $verified && $show_profile_claims ) : ?>
				<span class="lawyer-card__status">מאומת</span>
			<?php elseif ( $is_basic_public ) : ?>
				<span class="lawyer-card__status lawyer-card__status--basic"><?php esc_html_e( 'כרטיס ציבורי', 'justice-theme' ); ?></span>
			<?php elseif ( $is_paid && ! $has_public_sponsor && ! $has_reserved_sponsor ) : ?>
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

		<?php if ( $show_profile_claims && $bio_short ) : ?>
			<p class="lawyer-card__summary"><?php echo esc_html( wp_trim_words( $bio_short, 24, '...' ) ); ?></p>
		<?php elseif ( $requires_fact_gate && ! $profile_is_fact_checked ) : ?>
			<p class="lawyer-card__summary"><?php esc_html_e( 'הכרטיס מציג תחום, אזור ודרך פנייה בלבד עד השלמת אימות הפרטים.', 'justice-theme' ); ?></p>
		<?php endif; ?>

		<div class="lawyer-card__proof">
			<?php if ( $show_profile_claims && $experience ) : ?>
				<span><?php echo esc_html( $experience ); ?> שנות ניסיון</span>
			<?php endif; ?>
			<?php if ( $show_profile_claims && $languages ) : ?>
				<span><?php echo esc_html( $languages ); ?></span>
			<?php endif; ?>
			<?php if ( $show_rating ) : ?>
				<span class="lawyer-card__rating"><span aria-hidden="true">★</span> <?php echo esc_html( number_format_i18n( $average_rating, 1 ) ); ?>/5 · <?php echo esc_html( sprintf( __( '%s ביקורות מאושרות', 'justice-theme' ), number_format_i18n( $review_count ) ) ); ?></span>
			<?php endif; ?>
			<?php if ( $requires_fact_gate && ! $profile_is_fact_checked ) : ?>
				<span><?php esc_html_e( 'תחום ואזור מוצגים', 'justice-theme' ); ?></span>
			<?php endif; ?>
			<?php if ( $is_basic_public ) : ?>
				<span><?php esc_html_e( 'פרטים בתהליך אימות', 'justice-theme' ); ?></span>
			<?php endif; ?>
		</div>

		<?php if ( $is_basic_public && ! $is_homepage_showcase ) : ?>
			<div class="lawyer-card__claim">
				<strong><?php esc_html_e( 'זה הכרטיס שלך?', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'אפשר לאמת בעלות, לעדכן פרטים ולהרחיב חשיפה לאחר בדיקה.', 'justice-theme' ); ?></span>
				<a href="<?php echo esc_url( $claim_url ); ?>"><?php esc_html_e( 'התחלת שדרוג', 'justice-theme' ); ?></a>
			</div>
		<?php endif; ?>

		<div class="lawyer-card__actions">
			<a class="button button--primary" href="<?php echo esc_url( $lawyer_url ); ?>"><?php echo $is_basic_public ? esc_html__( 'צפייה בכרטיס', 'justice-theme' ) : esc_html__( 'צפייה בפרופיל', 'justice-theme' ); ?></a>
			<?php if ( $whatsapp_link ) : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $whatsapp_link ); ?>" target="_blank" rel="noopener">וואטסאפ</a>
			<?php elseif ( $phone_link ) : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $phone_link ); ?>">שיחה</a>
			<?php elseif ( $is_homepage_showcase ) : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $inquiry_url ); ?>"><?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?></a>
			<?php elseif ( $is_basic_public ) : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $claim_url ); ?>"><?php esc_html_e( 'תביעת כרטיס', 'justice-theme' ); ?></a>
			<?php else : ?>
				<a class="button button--ghost" href="<?php echo esc_url( $inquiry_url ); ?>">שליחת פנייה</a>
			<?php endif; ?>
		</div>
	</div>
</article>
