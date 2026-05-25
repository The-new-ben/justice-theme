<?php
/**
 * Single lawyer mini-site profile.
 *
 * This template is CMS-driven: every rich section reads from justice_lawyer
 * fields first, and only shows a section when real content exists.
 *
 * @package JusticeTheme
 */

if (
	function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
	&& ! justice_theme_lawyer_profile_is_public_approved( get_the_ID() )
	&& ! current_user_can( 'edit_post', get_the_ID() )
) {
	global $wp_query;
	$wp_query->set_404();
	status_header( 404 );
	nocache_headers();
	include get_404_template();
	exit;
}

get_header();

$lawyer_id = get_the_ID();

$meta = static function ( $key, $default = '' ) use ( $lawyer_id ) {
	$value = get_post_meta( $lawyer_id, $key, true );
	return '' !== $value && null !== $value ? $value : $default;
};

$parse_rows = static function ( $raw ) {
	$rows = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $raw ) ) );
	return array_map(
		static function ( $row ) {
			return array_map( 'trim', explode( '|', $row ) );
		},
		$rows
	);
};

$firm              = $meta( 'firm_name' );
$bar_num           = $meta( 'bar_number' );
$phone             = $meta( 'phone' );
$email             = $meta( 'email' );
$website           = $meta( 'website' );
$whatsapp          = $meta( 'whatsapp' );
$languages         = $meta( 'languages' );
$experience        = $meta( 'years_experience' );
$license           = $meta( 'license_status' );
$plan              = $meta( 'plan_type' );
$subscription      = strtolower( (string) $meta( 'subscription_status' ) );
$source_type       = strtolower( (string) $meta( 'source_type' ) );
$internal_notes    = strtolower( (string) $meta( 'internal_notes' ) );
$bio_short         = $meta( 'bio_short' );
$address           = $meta( 'office_address' );
$verified          = $meta( 'verification_status' );
$routing           = $meta( 'lead_routing_enabled' );
$video_url         = $meta( 'profile_video_url' );
$linkedin_url      = $meta( 'linkedin_url' );
$facebook_url      = $meta( 'facebook_url' );
$instagram_url     = $meta( 'instagram_url' );
$youtube_url       = $meta( 'youtube_url' );
$profile_headline  = $meta( 'profile_headline', get_the_title() );
$profile_subtitle  = $meta( 'profile_subheadline', $bio_short );
$approach_title    = $meta( 'profile_approach_title', 'איך מתנהל הליווי המשפטי' );
$approach          = $meta( 'profile_approach' );
$services          = $parse_rows( $meta( 'profile_services' ) );
$process_steps     = $parse_rows( $meta( 'profile_process' ) );
$credentials       = $parse_rows( $meta( 'profile_credentials' ) );
$media_items       = $parse_rows( $meta( 'profile_media_urls' ) );
$public_sources    = $parse_rows( $meta( 'profile_public_sources' ) );
$source_summary    = $meta( 'profile_source_summary' );
$faqs              = $parse_rows( $meta( 'profile_faqs' ) );
$testimonials      = $parse_rows( $meta( 'profile_testimonials' ) );
$cta_title         = $meta( 'profile_cta_title' );
$cta_text          = $meta( 'profile_cta_text' );
$review_count      = (int) $meta( 'review_count', 0 );
$average_rating    = (float) $meta( 'average_rating', 0 );
$reviews_enabled   = in_array( strtolower( (string) $meta( 'review_display_enabled' ) ), array( '1', 'yes', 'true', 'enabled', 'approved' ), true );
$approved_recommendations = $reviews_enabled && function_exists( 'justice_theme_lawyer_public_recommendations' )
	? justice_theme_lawyer_public_recommendations( $lawyer_id, 4 )
	: array();
$cities            = get_the_terms( $lawyer_id, 'city' );
$areas             = get_the_terms( $lawyer_id, 'practice-areas' );
$is_seed_data      = 'seed' === $source_type || false !== strpos( $internal_notes, 'seed_data' );
$is_paid           = ! $is_seed_data && 'active' === $subscription && in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
$is_verified       = 'verified' === strtolower( (string) $verified );
$show_rating       = $reviews_enabled && $review_count > 0 && $average_rating > 0;
$show_testimonials = $reviews_enabled && ! empty( $testimonials );
$show_approved_recommendations = ! empty( $approved_recommendations );
$primary_area      = ( ! empty( $areas ) && ! is_wp_error( $areas ) ) ? $areas[0] : null;
$primary_city      = ( ! empty( $cities ) && ! is_wp_error( $cities ) ) ? $cities[0] : null;
$phone_link        = function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( (string) $phone ) : '';
$whatsapp_link     = function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( (string) $whatsapp ) : '';
$claim_url         = add_query_arg(
	array(
		'claim_profile_id' => $lawyer_id,
		'claim_profile'    => get_post_field( 'post_name', $lawyer_id ),
		'plan_interest'    => 'featured',
		'source'           => 'public_profile_claim_upgrade',
	),
	home_url( '/lawyer-registration/' )
);

$views = (int) $meta( 'profile_views', 0 );
$user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) ) : '';
$track_profile_views = (bool) apply_filters( 'justice_theme_enable_lawyer_profile_view_tracking', false );
$is_countable_view = $track_profile_views
	&& ! is_admin()
	&& ! is_user_logged_in()
	&& ! wp_doing_ajax()
	&& ! wp_doing_cron()
	&& ! is_feed()
	&& ! preg_match( '/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|monitor|uptime/i', $user_agent );

if ( $is_countable_view ) {
	$remote_addr      = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$view_fingerprint = hash( 'sha256', $lawyer_id . '|' . $remote_addr . '|' . substr( $user_agent, 0, 160 ) . '|' . wp_salt( 'nonce' ) );
	$view_key         = 'justice_lawyer_view_' . $lawyer_id . '_' . substr( $view_fingerprint, 0, 20 );

	if ( false === get_transient( $view_key ) ) {
		update_post_meta( $lawyer_id, 'profile_views', $views + 1 );
		set_transient( $view_key, 1, DAY_IN_SECONDS );
	}
}

$social_links = array_filter(
	array(
		'LinkedIn'  => $linkedin_url,
		'Facebook'  => $facebook_url,
		'Instagram' => $instagram_url,
		'YouTube'   => $youtube_url,
		'Website'   => $website,
	)
);

$lawyer_profile_slug      = get_post_field( 'post_name', $lawyer_id );
$authority_person_slug    = function_exists( 'justice_theme_authority_verified_person_slug_for_post' )
	? justice_theme_authority_verified_person_slug_for_post( $lawyer_id )
	: '';
$is_maya_profile          = 'advocate-maya-rotenberg' === $lawyer_profile_slug
	|| (
		false !== mb_strpos( get_the_title( $lawyer_id ), rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) )
		&& false !== mb_strpos( get_the_title( $lawyer_id ), rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) )
	);
$profile_fact_review_status = sanitize_key( (string) $meta( 'profile_fact_review_status' ) );
$profile_is_fact_checked    = in_array( $profile_fact_review_status, array( 'approved', 'source_checked', 'owner_approved', 'lawyer_approved' ), true );
$requires_fact_gate         = $is_maya_profile
	|| $is_seed_data
	|| in_array( $source_type, array( 'public_index', 'import' ), true );
$show_freeform_profile_facts = ! $requires_fact_gate || $profile_is_fact_checked;
$show_profile_marketing_modules = ( ! $requires_fact_gate || $profile_is_fact_checked )
	&& (bool) apply_filters( 'justice_theme_show_lawyer_profile_engagement_overview', false, $lawyer_id );
$show_verified_profile_badge = $is_verified && $show_freeform_profile_facts;
$can_show_profile_articles = $show_freeform_profile_facts && ( $is_paid || $is_verified ) && ! $is_maya_profile;
$connected_article_slugs = array_filter( array( $lawyer_profile_slug, $authority_person_slug ) );
$trusted_contact_source = in_array( $source_type, array( 'lawyer_submitted', 'owner_verified', 'verified_public' ), true );
$show_direct_contact = $show_freeform_profile_facts || $is_paid || $is_verified || $trusted_contact_source;
$show_profile_claim_banner = ! $is_paid && ( $requires_fact_gate || ! $is_verified );

if ( ! $show_freeform_profile_facts ) {
	$profile_headline = get_the_title( $lawyer_id );
	$safe_profile_context = array_filter(
		array(
			$primary_area ? $primary_area->name : '',
			$primary_city ? $primary_city->name : '',
		)
	);
	$profile_subtitle = ! empty( $safe_profile_context )
		? sprintf(
			/* translators: %s: safe public practice/location context. */
			__( 'כרטיס מקצועי בבדיקת מקורות: %s. פרטי רקע, ניסיון, ביקורות ותוכן חתום יוצגו רק לאחר אימות.', 'justice-theme' ),
			implode( ' · ', $safe_profile_context )
		)
		: __( 'כרטיס מקצועי בבדיקת מקורות. פרטי רקע, ניסיון, ביקורות ותוכן חתום יוצגו רק לאחר אימות.', 'justice-theme' );
	$show_rating                   = false;
	$show_testimonials             = false;
	$show_approved_recommendations = false;
	$firm                          = '';
	$languages                     = '';
	$experience                    = '';
	$bar_num                       = '';
	$license                       = '';
	$address                       = '';
	$email                         = '';
	$social_links                  = array();
}

if ( ! $show_direct_contact ) {
	$phone_link    = '';
	$whatsapp_link = '';
}

if ( false !== mb_strpos( get_the_title( $lawyer_id ), 'מאיה' ) && false !== mb_strpos( get_the_title( $lawyer_id ), 'רוטנברג' ) ) {
	// Do not force legacy person-specific content onto an unverified profile.
}

$connected_article_slugs = array_values( array_unique( array_map( 'sanitize_title', $connected_article_slugs ) ) );
$connected_article_meta_values = $connected_article_slugs;

foreach ( $connected_article_slugs as $connected_article_slug ) {
	$connected_article_meta_values[] = '`' . $connected_article_slug . '`';
}

$connected_articles_args = array(
	'post_type'           => 'articles',
	'post_status'         => 'publish',
	'posts_per_page'      => 4,
	'ignore_sticky_posts' => true,
	'meta_query'          => array(
		array(
			'key'     => 'connected_lawyer_slug',
			'value'   => array_values( array_unique( $connected_article_meta_values ) ),
			'compare' => 'IN',
		),
	),
);

$related_articles = $can_show_profile_articles
	? new WP_Query( $connected_articles_args )
	: new WP_Query(
		array(
			'post_type'      => 'articles',
			'post__in'       => array( 0 ),
			'posts_per_page' => 1,
			'no_found_rows'  => true,
		)
	);

if ( ! $related_articles->have_posts() && $primary_area && $can_show_profile_articles ) {
	$related_articles = new WP_Query( array(
		'post_type'           => 'articles',
		'post_status'         => 'publish',
		'posts_per_page'      => 4,
		'ignore_sticky_posts' => true,
		'tax_query'           => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'term_id',
				'terms'    => $primary_area->term_id,
			),
		),
	) );
}

$has_related_articles = $related_articles instanceof WP_Query && $related_articles->have_posts();
$has_media_module     = $show_freeform_profile_facts && ( $video_url || ! empty( $media_items ) );
$show_articles_panel  = $has_related_articles || ! $requires_fact_gate;
$show_reviews_panel   = $show_rating || $show_approved_recommendations || $show_testimonials || ! $requires_fact_gate;
$show_profile_photo   = has_post_thumbnail( $lawyer_id )
	&& ! $is_seed_data
	&& ! $is_maya_profile
	&& (
		$is_paid
		|| $is_verified
		|| in_array( $source_type, array( 'lawyer_submitted', 'owner_verified', 'verified_public' ), true )
	);
$public_source_count = count(
	array_filter(
		$public_sources,
		static function ( array $row ): bool {
			return ! empty( $row[0] ) && ! empty( $row[1] );
		}
	)
);
$profile_proof_items = array();

if ( $show_freeform_profile_facts && $experience ) {
	$profile_proof_items[] = array(
		'value' => $experience,
		'label' => __( 'שנות ניסיון', 'justice-theme' ),
	);
}

if ( $show_freeform_profile_facts && $bar_num ) {
	$profile_proof_items[] = array(
		'value' => $bar_num,
		'label' => __( 'מספר רישיון', 'justice-theme' ),
	);
}

if ( $show_verified_profile_badge ) {
	$profile_proof_items[] = array(
		'value' => __( 'מאומת', 'justice-theme' ),
		'label' => __( 'סטטוס פרופיל', 'justice-theme' ),
	);
} elseif ( $profile_is_fact_checked ) {
	$profile_proof_items[] = array(
		'value' => __( 'מקור נבדק', 'justice-theme' ),
		'label' => __( 'סטטוס פרופיל', 'justice-theme' ),
	);
} else {
	$profile_proof_items[] = array(
		'value' => __( 'בבדיקת מקור', 'justice-theme' ),
		'label' => __( 'סטטוס פרופיל', 'justice-theme' ),
	);
}

if ( $primary_area ) {
	$profile_proof_items[] = array(
		'value' => $primary_area->name,
		'label' => __( 'תחום מרכזי', 'justice-theme' ),
	);
}

if ( $primary_city ) {
	$profile_proof_items[] = array(
		'value' => $primary_city->name,
		'label' => __( 'אזור פעילות', 'justice-theme' ),
	);
}

if ( $show_rating ) {
	$profile_proof_items[] = array(
		'value' => number_format_i18n( $average_rating, 1 ),
		'label' => sprintf(
			/* translators: %s: approved review count. */
			__( '%s ביקורות מאושרות', 'justice-theme' ),
			number_format_i18n( $review_count )
		),
	);
} elseif ( $reviews_enabled && $show_freeform_profile_facts ) {
	$profile_proof_items[] = array(
		'value' => __( 'בבקרה', 'justice-theme' ),
		'label' => __( 'ביקורות לקוחות', 'justice-theme' ),
	);
}

if ( $public_source_count > 0 ) {
	$profile_proof_items[] = array(
		'value' => number_format_i18n( $public_source_count ),
		'label' => __( 'מקורות ציבוריים', 'justice-theme' ),
	);
}

$profile_proof_items = array_slice( $profile_proof_items, 0, 4 );
$profile_shell_classes = array( 'lawyer-mini-site' );

if ( ! $show_freeform_profile_facts ) {
	$profile_shell_classes[] = 'lawyer-mini-site--fact-gated';
}

if ( $is_paid ) {
	$profile_shell_classes[] = 'lawyer-mini-site--paid';
}

if ( $show_profile_photo ) {
	$profile_shell_classes[] = 'lawyer-mini-site--has-photo';
}
?>

<article class="<?php echo esc_attr( implode( ' ', array_unique( $profile_shell_classes ) ) ); ?>" itemscope itemtype="https://schema.org/Attorney">
	<section class="lawyer-mini-hero">
		<div class="container lawyer-mini-hero__grid">
			<div class="lawyer-mini-hero__content">
				<div class="lawyer-mini-hero__kicker">
					<span>מיני-סייט משפטי</span>
					<?php if ( $show_verified_profile_badge ) : ?>
						<strong>פרופיל מאומת</strong>
					<?php endif; ?>
					<?php if ( $is_paid ) : ?>
						<strong>פרופיל ממומן</strong>
					<?php endif; ?>
				</div>

				<h1 itemprop="name"><?php echo esc_html( $profile_headline ); ?></h1>

				<?php if ( $firm ) : ?>
					<p class="lawyer-mini-hero__firm" itemprop="worksFor"><?php echo esc_html( $firm ); ?></p>
				<?php endif; ?>

				<?php if ( $profile_subtitle ) : ?>
					<p class="lawyer-mini-hero__summary"><?php echo esc_html( $profile_subtitle ); ?></p>
				<?php endif; ?>

				<div class="lawyer-mini-hero__actions">
					<?php if ( $phone_link ) : ?>
						<a class="button button--primary" href="<?php echo esc_url( $phone_link ); ?>" itemprop="telephone">שיחה לעורכת הדין</a>
					<?php endif; ?>
					<?php if ( $whatsapp_link ) : ?>
						<a class="button button--ghost" href="<?php echo esc_url( $whatsapp_link ); ?>" target="_blank" rel="noopener">WhatsApp</a>
					<?php endif; ?>
					<a class="button button--gold" href="#lawyer-inquiry">שליחת פנייה</a>
				</div>

				<?php if ( $show_profile_claim_banner ) : ?>
					<div class="lawyer-mini-claim-banner" aria-label="<?php esc_attr_e( 'עדכון ואימות פרופיל עורך דין', 'justice-theme' ); ?>">
						<div>
							<strong><?php esc_html_e( 'זה הפרופיל שלך?', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'אפשר לאמת פרטים, להוסיף תמונה, ביקורות, מאמרים וקידום ממומן מתוך מערכת Jus-Tice.', 'justice-theme' ); ?></span>
						</div>
						<a href="<?php echo esc_url( $claim_url ); ?>"><?php esc_html_e( 'עדכון פרופיל', 'justice-theme' ); ?></a>
					</div>
				<?php endif; ?>
			</div>

			<aside class="lawyer-mini-hero__panel" aria-label="פרטי עורכת הדין">
				<div class="lawyer-mini-hero__photo">
					<?php if ( $show_profile_photo ) : ?>
						<?php the_post_thumbnail( 'large', array( 'itemprop' => 'image' ) ); ?>
					<?php else : ?>
						<div class="lawyer-mini-hero__initials" aria-hidden="true"><?php echo esc_html( mb_substr( get_the_title(), 0, 2 ) ); ?></div>
					<?php endif; ?>
				</div>

				<div class="lawyer-mini-hero__facts">
					<?php if ( $primary_area ) : ?>
						<span><?php echo esc_html( $primary_area->name ); ?></span>
					<?php endif; ?>
					<?php if ( $primary_city ) : ?>
						<span><?php echo esc_html( $primary_city->name ); ?></span>
					<?php endif; ?>
					<?php if ( $languages ) : ?>
						<span><?php echo esc_html( $languages ); ?></span>
					<?php endif; ?>
				</div>
			</aside>
		</div>
	</section>

	<section class="section lawyer-mini-proof">
		<div class="container lawyer-mini-proof__grid">
			<?php foreach ( $profile_proof_items as $proof_item ) : ?>
				<div class="lawyer-mini-proof__item">
					<strong><?php echo esc_html( (string) $proof_item['value'] ); ?></strong>
					<span><?php echo esc_html( (string) $proof_item['label'] ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
	</section>

	<?php if ( $show_profile_marketing_modules ) : ?>
	<section class="section lawyer-mini-engagement" aria-label="<?php esc_attr_e( 'אפשרויות במיני-סייט', 'justice-theme' ); ?>">
		<div class="container">
			<div class="section-header section-header--split">
				<div>
					<p class="section-header__eyebrow"><?php esc_html_e( 'מיני-סייט פעיל', 'justice-theme' ); ?></p>
					<h2><?php esc_html_e( 'מה אפשר לעשות דרך הפרופיל הזה?', 'justice-theme' ); ?></h2>
				</div>
				<a class="button button--ghost" href="#lawyer-inquiry"><?php esc_html_e( 'השארת פנייה', 'justice-theme' ); ?></a>
			</div>
			<div class="lawyer-mini-engagement__grid">
				<article class="lawyer-mini-engagement__card">
					<span><?php esc_html_e( 'פנייה', 'justice-theme' ); ?></span>
					<h3><?php esc_html_e( 'לשלוח שאלה מסודרת', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'טופס הפנייה שומר תחום, עיר, דחיפות ותיאור קצר כדי שהשיחה הראשונה תתחיל ממידע ברור יותר.', 'justice-theme' ); ?></p>
				</article>
				<article class="lawyer-mini-engagement__card">
					<span><?php esc_html_e( 'תוכן', 'justice-theme' ); ?></span>
					<h3><?php echo esc_html( $has_related_articles ? __( 'לקרוא מאמרים מחוברים לפרופיל', 'justice-theme' ) : __( 'מאמרים חתומים יופיעו לאחר בדיקה', 'justice-theme' ) ); ?></h3>
					<p><?php echo esc_html( $has_related_articles ? __( 'מאמרים ומדריכים מחוברים לפרופיל דרך CMS, כך שהתוכן המקצועי מחזק גם את המיני-סייט וגם את אשכול ה-SEO.', 'justice-theme' ) : __( 'המערכת תומכת במאמרים חתומים, אך הם יוצגו רק לאחר עריכה, בדיקת מקורות ואישור משפטי.', 'justice-theme' ) ); ?></p>
				</article>
				<article class="lawyer-mini-engagement__card">
					<span><?php esc_html_e( 'מדיה', 'justice-theme' ); ?></span>
					<h3><?php echo esc_html( $has_media_module ? __( 'לצפות בווידאו ועדכונים', 'justice-theme' ) : __( 'וידאו וקישורי מדיה זמינים כחלק מהמיני-סייט', 'justice-theme' ) ); ?></h3>
					<p><?php echo esc_html( $has_media_module ? __( 'סרטונים, הופעות ועדכונים מחוברים לפרופיל ומאפשרים למבקר להבין את סגנון העבודה לפני יצירת קשר.', 'justice-theme' ) : __( 'כאשר בעל הפרופיל מוסיף וידאו או קישורים מאושרים, הם מופיעים כאן כחלק ממסלול ההיכרות.', 'justice-theme' ) ); ?></p>
				</article>
				<article class="lawyer-mini-engagement__card">
					<span><?php esc_html_e( 'אמון', 'justice-theme' ); ?></span>
					<h3><?php echo esc_html( $show_rating ? __( 'לראות ביקורות מאושרות', 'justice-theme' ) : __( 'ביקורות יוצגו רק לאחר אימות', 'justice-theme' ) ); ?></h3>
					<p><?php echo esc_html( $show_rating ? __( 'דירוגים וביקורות מוצגים רק כאשר יש נתונים מאושרים במערכת.', 'justice-theme' ) : __( 'אין כאן דירוגים מומצאים. ביקורות יפורסמו רק אחרי אימות, בקרה ואישור פרסום.', 'justice-theme' ) ); ?></p>
				</article>
			</div>
		</div>
	</section>
	<?php endif; ?>

	<section class="section lawyer-mini-body">
		<div class="container lawyer-mini-body__grid">
			<main class="lawyer-mini-body__main">
				<section class="lawyer-mini-panel">
					<h2>על עורכת הדין</h2>
					<div class="entry-content" itemprop="description">
						<?php if ( $show_freeform_profile_facts ) : ?>
							<?php the_content(); ?>
						<?php else : ?>
							<div class="lawyer-mini-profile-gate">
								<strong><?php esc_html_e( 'פרטי הרקע המלאים בבדיקת מקורות', 'justice-theme' ); ?></strong>
								<p><?php esc_html_e( 'אנחנו לא מציגים השכלה, הסמכות, דירוגים או סיפורי הצלחה לפני בדיקה ואישור. בשלב זה מוצגים רק תחומי פעילות, עיר, מקורות ציבוריים ודרכי פנייה שניתן לערוך מתוך ה-CMS.', 'justice-theme' ); ?></p>
								<a class="button button--ghost" href="<?php echo esc_url( $claim_url ); ?>"><?php esc_html_e( 'זה הפרופיל שלך? עדכון ואימות פרטים', 'justice-theme' ); ?></a>
							</div>
						<?php endif; ?>
					</div>
				</section>

				<?php if ( $show_freeform_profile_facts && ( $approach || ! empty( $process_steps ) ) ) : ?>
					<section class="lawyer-mini-panel lawyer-mini-editorial">
						<h2><?php echo esc_html( $approach_title ); ?></h2>
						<?php if ( $approach ) : ?>
							<div class="entry-content"><?php echo wp_kses_post( wpautop( $approach ) ); ?></div>
						<?php endif; ?>
						<?php if ( ! empty( $process_steps ) ) : ?>
							<div class="lawyer-mini-steps">
								<?php foreach ( $process_steps as $index => $row ) : ?>
									<div class="lawyer-mini-step">
										<span><?php echo esc_html( $index + 1 ); ?></span>
										<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
										<?php if ( ! empty( $row[1] ) ) : ?>
											<p><?php echo esc_html( $row[1] ); ?></p>
										<?php endif; ?>
									</div>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</section>
				<?php endif; ?>

				<?php if ( $show_freeform_profile_facts && ! empty( $services ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>שירותים משפטיים מרכזיים</h2>
						<div class="lawyer-mini-service-grid">
							<?php foreach ( $services as $row ) : ?>
								<article class="lawyer-mini-service">
									<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<p><?php echo esc_html( $row[1] ); ?></p>
									<?php endif; ?>
								</article>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( $show_freeform_profile_facts && $video_url ) : ?>
					<section class="lawyer-mini-panel lawyer-mini-video">
						<h2>וידאו היכרות</h2>
						<div class="lawyer-mini-video__frame">
							<?php echo wp_oembed_get( esc_url( $video_url ) ) ?: '<a href="' . esc_url( $video_url ) . '" target="_blank" rel="noopener">צפייה בווידאו</a>'; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>תחומי טיפול</h2>
						<div class="lawyer-mini-tags">
							<?php foreach ( $areas as $area ) : ?>
								<a href="<?php echo esc_url( justice_theme_public_term_link( $area ) ); ?>"><?php echo esc_html( $area->name ); ?></a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( $show_articles_panel ) : ?>
				<section class="lawyer-mini-panel">
					<h2>מאמרים חתומים ותוכן מקצועי</h2>
					<?php if ( $related_articles->have_posts() ) : ?>
						<div class="lawyer-mini-articles">
							<?php while ( $related_articles->have_posts() ) : ?>
								<?php $related_articles->the_post(); ?>
								<a class="lawyer-mini-article" href="<?php echo esc_url( justice_theme_public_permalink( get_the_ID() ) ); ?>">
									<span><?php echo esc_html( get_the_date() ); ?></span>
									<strong><?php the_title(); ?></strong>
								</a>
							<?php endwhile; ?>
						</div>
						<?php wp_reset_postdata(); ?>
					<?php else : ?>
						<p class="lawyer-mini-muted">כאן יוצגו מאמרים, מדריכים ועדכונים מקצועיים שחוברו לפרופיל דרך שדה CMS ייעודי. התוכן יעלה רק לאחר בדיקה משפטית ועריכת מקורות.</p>
					<?php endif; ?>
				</section>
				<?php endif; ?>

				<?php if ( $show_freeform_profile_facts && ! empty( $media_items ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>וידאו, הופעות ועדכונים</h2>
						<div class="lawyer-mini-media-list">
							<?php foreach ( $media_items as $row ) : ?>
								<a class="lawyer-mini-media-item" href="<?php echo esc_url( $row[1] ?? $row[0] ?? '' ); ?>" target="_blank" rel="noopener">
									<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
									<?php if ( ! empty( $row[2] ) ) : ?>
										<span><?php echo esc_html( $row[2] ); ?></span>
									<?php endif; ?>
								</a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( $show_reviews_panel ) : ?>
				<section class="lawyer-mini-panel">
					<h2>ביקורות והמלצות</h2>
					<?php if ( $show_rating ) : ?>
						<p class="lawyer-mini-rating"><?php echo esc_html( number_format_i18n( $average_rating, 1 ) ); ?> מתוך 5 על בסיס <?php echo esc_html( number_format_i18n( $review_count ) ); ?> ביקורות מאושרות.</p>
					<?php elseif ( ! $show_approved_recommendations && ! $show_testimonials ) : ?>
						<p class="lawyer-mini-muted">ביקורות לקוחות יוצגו רק לאחר אימות, בקרה ואישור פרסום.</p>
					<?php endif; ?>
					<?php if ( $show_approved_recommendations ) : ?>
						<div class="lawyer-mini-testimonials">
							<?php foreach ( $approved_recommendations as $recommendation ) : ?>
								<figure>
									<blockquote><?php echo esc_html( $recommendation['quote'] ); ?></blockquote>
									<figcaption>
										<?php echo esc_html( $recommendation['client_name'] ?: __( 'Client recommendation', 'justice-theme' ) ); ?>
										<?php if ( ! empty( $recommendation['relationship'] ) ) : ?>
											<span> - <?php echo esc_html( $recommendation['relationship'] ); ?></span>
										<?php endif; ?>
										<?php if ( ! empty( $recommendation['received_at'] ) ) : ?>
											<span> - <?php echo esc_html( mysql2date( get_option( 'date_format' ), $recommendation['received_at'] ) ); ?></span>
										<?php endif; ?>
									</figcaption>
								</figure>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
					<?php if ( $show_testimonials ) : ?>
						<div class="lawyer-mini-testimonials">
							<?php foreach ( $testimonials as $row ) : ?>
								<figure>
									<blockquote><?php echo esc_html( $row[0] ?? '' ); ?></blockquote>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<figcaption><?php echo esc_html( $row[1] ); ?></figcaption>
									<?php endif; ?>
								</figure>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</section>
				<?php endif; ?>

				<?php if ( $show_freeform_profile_facts && ! empty( $faqs ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>שאלות נפוצות</h2>
						<div class="lawyer-mini-faqs">
							<?php foreach ( $faqs as $row ) : ?>
								<details>
									<summary><?php echo esc_html( $row[0] ?? '' ); ?></summary>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<p><?php echo esc_html( $row[1] ); ?></p>
									<?php endif; ?>
								</details>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( $show_freeform_profile_facts && ( $cta_title || $cta_text ) ) : ?>
					<section class="lawyer-mini-panel lawyer-mini-final-cta">
						<h2><?php echo esc_html( $cta_title ?: 'רוצים לבדוק את הצעד הבא?' ); ?></h2>
						<?php if ( $cta_text ) : ?>
							<p><?php echo esc_html( $cta_text ); ?></p>
						<?php endif; ?>
						<a class="button button--primary" href="#lawyer-inquiry">השארת פרטים</a>
					</section>
				<?php endif; ?>
			</main>

			<aside class="lawyer-mini-body__aside">
				<section class="lawyer-mini-contact" id="lawyer-inquiry">
					<h2>פנייה דיסקרטית</h2>
					<p>השאירו פרטים ונעביר את הפנייה בצורה מסודרת לפי תחום, עיר ודחיפות.</p>

					<?php if ( $routing ) : ?>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_submit_lead">
							<input type="hidden" name="lead_area" value="<?php echo $primary_area ? esc_attr( $primary_area->slug ) : ''; ?>">
							<input type="hidden" name="lead_city" value="<?php echo $primary_city ? esc_attr( $primary_city->name ) : ''; ?>">
							<input type="hidden" name="assigned_lawyer_id" value="<?php echo esc_attr( $lawyer_id ); ?>">
							<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>
							<?php justice_theme_render_lead_spam_fields(); ?>
							<?php justice_theme_render_lead_attribution_fields(); ?>

							<label for="inquiry-name">שם מלא</label>
							<input type="text" id="inquiry-name" name="lead_name" required>

							<label for="inquiry-phone">טלפון</label>
							<input type="tel" id="inquiry-phone" name="lead_phone" required>

							<label for="inquiry-message">תיאור קצר</label>
							<textarea id="inquiry-message" name="lead_message" rows="4"></textarea>

							<label class="lawyer-mini-consent">
								<input type="checkbox" name="lead_consent" required>
								<span>אני מסכים/ה להעברת הפנייה לצורך יצירת קשר. אין באמור ייעוץ משפטי.</span>
							</label>

							<button type="submit" class="button button--primary">שליחת פנייה</button>
						</form>
					<?php else : ?>
						<p class="lawyer-mini-muted">ניתוב לידים עדיין לא הופעל לפרופיל זה.</p>
					<?php endif; ?>
				</section>

				<?php if ( $address || $license || $email ) : ?>
				<section class="lawyer-mini-sidebox">
					<h2>פרטים מקצועיים</h2>
					<dl>
						<?php if ( $address ) : ?>
							<dt>כתובת משרד</dt>
							<dd itemprop="address"><?php echo esc_html( $address ); ?></dd>
						<?php endif; ?>
						<?php if ( $license ) : ?>
							<dt>סטטוס רישיון</dt>
							<dd><?php echo esc_html( $license ); ?></dd>
						<?php endif; ?>
						<?php if ( $email ) : ?>
							<dt>אימייל</dt>
							<dd><a href="<?php echo esc_url( 'mailto:' . $email ); ?>" itemprop="email"><?php echo esc_html( $email ); ?></a></dd>
						<?php endif; ?>
					</dl>
				</section>
				<?php endif; ?>

				<?php if ( ! empty( $credentials ) && $show_freeform_profile_facts ) : ?>
					<section class="lawyer-mini-sidebox">
						<h2>הסמכות וניסיון</h2>
						<ul class="lawyer-mini-credential-list">
							<?php foreach ( $credentials as $row ) : ?>
								<li>
									<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<span><?php echo esc_html( $row[1] ); ?></span>
									<?php endif; ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</section>
				<?php endif; ?>

				<?php if ( $source_summary || ! empty( $public_sources ) ) : ?>
					<section class="lawyer-mini-sidebox lawyer-mini-sources">
						<h2>מקורות ציבוריים</h2>
						<?php if ( $source_summary ) : ?>
							<p><?php echo esc_html( $source_summary ); ?></p>
						<?php endif; ?>
						<?php if ( ! empty( $public_sources ) ) : ?>
							<div class="lawyer-mini-source-list">
								<?php foreach ( $public_sources as $row ) : ?>
									<?php
									$source_label = $row[0] ?? '';
									$source_url   = $row[1] ?? '';
									$source_note  = $row[2] ?? '';
									?>
									<?php if ( $source_label && $source_url ) : ?>
										<a href="<?php echo esc_url( $source_url ); ?>" target="_blank" rel="noopener">
											<strong><?php echo esc_html( $source_label ); ?></strong>
											<?php if ( $source_note ) : ?>
												<span><?php echo esc_html( $source_note ); ?></span>
											<?php endif; ?>
										</a>
									<?php endif; ?>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</section>
				<?php endif; ?>

				<?php if ( ! empty( $social_links ) ) : ?>
					<section class="lawyer-mini-sidebox">
						<h2>נוכחות דיגיטלית</h2>
						<div class="lawyer-mini-social">
							<?php foreach ( $social_links as $label => $url ) : ?>
								<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $label ); ?></a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>
			</aside>
		</div>
	</section>
</article>

<?php get_footer(); ?>
