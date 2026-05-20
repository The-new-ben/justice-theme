<?php
/**
 * Template Name: Lawyer Dashboard
 *
 * @package JusticeTheme
 */

get_header();

echo "\n" . '<!-- justice-dashboard-first-value-v1 -->' . "\n";

if ( ! is_user_logged_in() ) :
	?>
	<section class="lawyer-dashboard lawyer-dashboard--logged-out section">
		<div class="container lawyer-dashboard__gate">
			<p class="section-header__eyebrow"><?php esc_html_e( 'אזור אישי לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'התחברו כדי לנהל את הנוכחות שלכם ב-Jus-Tice', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'האזור האישי מיועד לפרופיל, לידים, תוכן, סטטוס מנוי וכלים עתידיים. פרסום ועדכונים מהותיים עוברים בדיקה לפני עלייה לאתר.', 'justice-theme' ); ?></p>
			<div class="lawyer-dashboard__actions">
				<a class="button button--gold" href="<?php echo esc_url( wp_login_url( justice_theme_public_permalink( get_the_ID() ) ) ); ?>"><?php esc_html_e( 'התחברות', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( justice_theme_public_url( home_url( '/lawyer-registration/' ) ) ); ?>"><?php esc_html_e( 'הצטרפות לעורכי דין', 'justice-theme' ); ?></a>
			</div>
		</div>
	</section>
	<?php
	get_footer();
	return;
endif;

$user_id  = get_current_user_id();
$profiles = post_type_exists( 'justice_lawyer' )
	? new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 10,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'   => 'claimed_by_user_id',
				'value' => (string) $user_id,
			),
		),
	) )
	: null;

$profile_ids = array();
if ( $profiles && $profiles->have_posts() ) {
	foreach ( $profiles->posts as $profile_post ) {
		$profile_ids[] = (int) $profile_post->ID;
	}
}

$leads = ( post_type_exists( 'justice_lead' ) && $profile_ids )
	? new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 8,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'     => 'assigned_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: null;

$lead_count = $leads ? (int) $leads->found_posts : 0;
$profile_views_total = 0;

foreach ( $profile_ids as $profile_id ) {
	$profile_views_total += (int) get_post_meta( $profile_id, 'profile_views', true );
}

$content_requests = ( post_type_exists( 'articles' ) && $profile_ids )
	? new WP_Query( array(
		'post_type'      => 'articles',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 8,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'   => 'content_status',
				'value' => 'lawyer_requested_draft',
			),
			array(
				'key'     => 'requested_by_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: null;

$content_request_count = $content_requests ? (int) $content_requests->found_posts : 0;
$primary_profile_id     = $profile_ids ? (int) $profile_ids[0] : 0;
$primary_completeness   = $primary_profile_id ? justice_theme_lawyer_dashboard_profile_completeness( $primary_profile_id ) : 0;
$activation_status      = $primary_profile_id ? ( get_post_meta( $primary_profile_id, 'activation_status', true ) ?: 'registered' ) : 'registered';
$subscription_status    = $primary_profile_id ? ( get_post_meta( $primary_profile_id, 'subscription_status', true ) ?: 'pending' ) : 'pending';
$growth_assets          = $primary_profile_id ? justice_theme_lawyer_dashboard_growth_assets( $primary_profile_id, $lead_count, $content_request_count, $profile_views_total ) : array();
$completed_growth_assets = count( array_filter( $growth_assets, static function ( array $asset ): bool {
	return ! empty( $asset['done'] );
} ) );
$first_value_steps      = array(
	array(
		'label' => __( 'פרופיל מקושר לחשבון', 'justice-theme' ),
		'done'  => (bool) $primary_profile_id,
	),
	array(
		'label' => __( 'פרופיל מוכן לבדיקה', 'justice-theme' ),
		'done'  => 70 <= $primary_completeness,
	),
	array(
		'label' => __( 'חשיפה ראשונה נמדדה', 'justice-theme' ),
		'done'  => 0 < $profile_views_total,
	),
	array(
		'label' => __( 'ליד או פנייה שויכו', 'justice-theme' ),
		'done'  => 0 < $lead_count,
	),
	array(
		'label' => __( 'תוכן או שיפור פרופיל בטיפול', 'justice-theme' ),
		'done'  => 0 < $content_request_count,
	),
);
$completed_first_value_steps = count( array_filter( $first_value_steps, static function ( array $step ): bool {
	return ! empty( $step['done'] );
} ) );
$payment_status_text = in_array( $subscription_status, array( 'active', 'paid', 'trialing' ), true )
	? __( 'תשלום פעיל לפי סטטוס המנוי.', 'justice-theme' )
	: __( 'תשלום וסליקה עדיין לא פעילים עד אישור מסחרי, חשבוניות וכללי חיוב.', 'justice-theme' );
?>

<section class="lawyer-dashboard section">
	<div class="container">
		<header class="lawyer-dashboard__hero">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'אזור אישי לעורכי דין', 'justice-theme' ); ?></p>
				<h1><?php esc_html_e( 'מרכז השליטה לנוכחות, תוכן ולידים', 'justice-theme' ); ?></h1>
				<p><?php esc_html_e( 'זהו MVP ראשון: צפייה בפרופיל המקושר, סטטוס מסחרי, לידים משויכים ומשימות לשיפור המיני-סייט. עריכה עצמאית, תשלומים ו-AI Console יתווספו בשלבים מבוקרים.', 'justice-theme' ); ?></p>
			</div>
			<a class="button button--gold" href="<?php echo esc_url( justice_theme_public_url( home_url( '/lawyer-registration/' ) ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל נוסף', 'justice-theme' ); ?></a>
		</header>

		<?php if ( ! $profiles || ! $profiles->have_posts() ) : ?>
			<div class="lawyer-dashboard__empty">
				<h2><?php esc_html_e( 'עדיין אין פרופיל מקושר לחשבון הזה', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'אפשר לשלוח בקשת הצטרפות, או לבקש מצוות האתר לקשר פרופיל קיים לחשבון המשתמש שלכם. פרופיל לא עולה לאוויר בלי בדיקה ואישור.', 'justice-theme' ); ?></p>
				<a class="button button--gold" href="<?php echo esc_url( justice_theme_public_url( home_url( '/lawyer-registration/' ) ) ); ?>"><?php esc_html_e( 'שליחת בקשת הצטרפות', 'justice-theme' ); ?></a>
			</div>
		<?php else : ?>
			<div class="lawyer-dashboard__summary">
				<div>
					<strong><?php echo esc_html( (string) $content_request_count ); ?></strong>
					<span><?php esc_html_e( 'בקשות תוכן', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) count( $profile_ids ) ); ?></strong>
					<span><?php esc_html_e( 'פרופילים מקושרים', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) $lead_count ); ?></strong>
					<span><?php esc_html_e( 'לידים משויכים', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) $profile_views_total ); ?></strong>
					<span><?php esc_html_e( 'צפיות בפרופיל', 'justice-theme' ); ?></span>
				</div>
			</div>

			<section class="lawyer-dashboard__first-value" aria-labelledby="lawyer-dashboard-first-value-title">
				<div>
					<p class="section-header__eyebrow"><?php esc_html_e( 'מדד ערך ראשון', 'justice-theme' ); ?></p>
					<h2 id="lawyer-dashboard-first-value-title"><?php esc_html_e( 'מה כבר מתקדם בדרך לליד משלם?', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'כאן רואים את הדרך מהצטרפות לערך אמיתי: פרופיל מוכן, חשיפה, פניות, תוכן וסטטוס תשלום. הנתונים מוצגים רק כשיש מקור אמיתי, בלי הבטחות דירוג או לידים לא מאומתים.', 'justice-theme' ); ?></p>
				</div>
				<div class="lawyer-dashboard__first-value-meter">
					<strong><?php echo esc_html( $completed_first_value_steps . '/' . count( $first_value_steps ) ); ?></strong>
					<span><?php esc_html_e( 'שלבי ערך שהושלמו', 'justice-theme' ); ?></span>
				</div>
				<ul class="lawyer-dashboard__first-value-list">
					<?php foreach ( $first_value_steps as $step ) : ?>
						<li class="<?php echo esc_attr( $step['done'] ? 'is-complete' : 'is-pending' ); ?>">
							<span><?php echo $step['done'] ? esc_html__( 'בוצע', 'justice-theme' ) : esc_html__( 'בטיפול', 'justice-theme' ); ?></span>
							<?php echo esc_html( $step['label'] ); ?>
						</li>
					<?php endforeach; ?>
				</ul>
				<div class="lawyer-dashboard__first-value-note">
					<strong><?php esc_html_e( 'סטטוס הפעלה', 'justice-theme' ); ?></strong>
					<span><?php echo esc_html( $activation_status ); ?></span>
					<strong><?php esc_html_e( 'תשלום', 'justice-theme' ); ?></strong>
					<span><?php echo esc_html( $payment_status_text ); ?></span>
				</div>
			</section>

			<div class="lawyer-dashboard__grid">
				<div class="lawyer-dashboard__main">
					<?php if ( isset( $_GET['review_campaign'] ) && 'sent' === $_GET['review_campaign'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'Review campaign request saved. Nothing will be sent to clients until owner review and lawyer approval.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['review_campaign'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'Review campaign request was not saved. Please choose a linked profile.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php if ( isset( $_GET['supplier_request'] ) && 'sent' === $_GET['supplier_request'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'Supplier/service request saved. Jus-Tice will match it only after owner review and supplier quality check.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['supplier_request'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'Supplier/service request was not saved. Please choose a linked profile.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php if ( isset( $_GET['content_request'] ) && 'sent' === $_GET['content_request'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת התוכן התקבלה כטיוטה ותיבדק לפני כל פרסום.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['content_request'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'בקשת התוכן לא נשלחה. בדקו שנבחר פרופיל ושנושא המאמר מולא.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<h2><?php esc_html_e( 'הפרופילים שלי', 'justice-theme' ); ?></h2>
					<?php if ( isset( $_GET['profile_update'] ) && 'sent' === $_GET['profile_update'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת עדכון המיני-סייט נשמרה לבדיקה. שום שינוי ציבורי לא יפורסם לפני אישור.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['profile_update'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'בקשת עדכון הפרופיל לא נשלחה. בדקו שנבחר פרופיל מקושר.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php while ( $profiles->have_posts() ) : $profiles->the_post(); ?>
						<?php
						$post_id      = get_the_ID();
						$plan         = get_post_meta( $post_id, 'plan_type', true ) ?: 'free';
						$subscription = get_post_meta( $post_id, 'subscription_status', true ) ?: 'inactive';
						$verification = get_post_meta( $post_id, 'verification_status', true ) ?: 'unverified';
						$profile_url  = justice_theme_public_permalink( $post_id );
						$completeness = justice_theme_lawyer_dashboard_profile_completeness( $post_id );
						?>
						<article class="lawyer-dashboard-profile">
							<div>
								<h3><?php the_title(); ?></h3>
								<p><?php echo esc_html( get_post_meta( $post_id, 'firm_name', true ) ?: get_the_excerpt() ); ?></p>
							</div>
							<dl>
								<div><dt><?php esc_html_e( 'מסלול', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $plan ); ?></dd></div>
								<div><dt><?php esc_html_e( 'מנוי', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $subscription ); ?></dd></div>
								<div><dt><?php esc_html_e( 'אימות', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $verification ); ?></dd></div>
								<div><dt><?php esc_html_e( 'שלמות פרופיל', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $completeness . '%' ); ?></dd></div>
							</dl>
							<div class="lawyer-dashboard-profile__actions">
								<a class="button button--outline" href="<?php echo esc_url( $profile_url ); ?>"><?php esc_html_e( 'צפייה בפרופיל', 'justice-theme' ); ?></a>
								<a class="button button--gold" href="<?php echo esc_url( justice_theme_public_url( home_url( '/lawyer-plans/' ) ) ); ?>"><?php esc_html_e( 'שדרוג מסלול', 'justice-theme' ); ?></a>
							</div>
						</article>
					<?php endwhile; wp_reset_postdata(); ?>

					<section class="lawyer-dashboard-growth" aria-labelledby="lawyer-dashboard-growth-title">
						<div class="lawyer-dashboard-growth__header">
							<div>
								<p class="section-header__eyebrow"><?php esc_html_e( 'Reputation and authority cockpit', 'justice-theme' ); ?></p>
								<h2 id="lawyer-dashboard-growth-title"><?php esc_html_e( 'What makes this profile sell?', 'justice-theme' ); ?></h2>
								<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Inspired by leading lawyer platforms: claimed profile, real photo, external proof, fresh reviews, practical FAQs, content, exposure and leads. We track only real signals.', 'justice-theme' ); ?></p>
							</div>
							<div class="lawyer-dashboard-growth__score">
								<strong><?php echo esc_html( $completed_growth_assets . '/' . count( $growth_assets ) ); ?></strong>
								<span><?php esc_html_e( 'growth assets ready', 'justice-theme' ); ?></span>
							</div>
						</div>
						<?php if ( $growth_assets ) : ?>
							<ul class="lawyer-dashboard-growth__assets">
								<?php foreach ( $growth_assets as $asset ) : ?>
									<li class="<?php echo esc_attr( $asset['done'] ? 'is-complete' : 'is-pending' ); ?>">
										<strong><?php echo esc_html( $asset['label'] ); ?></strong>
										<span><?php echo esc_html( $asset['why'] ); ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</section>

					<section class="lawyer-dashboard-content-request">
						<h2><?php esc_html_e( 'בקשת עדכון למיני-סייט', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'שלחו נוסח חדש לכותרת, שירותים, תהליך עבודה, וידאו או שאלות נפוצות. העדכון נשמר לבדיקה בלבד ולא משנה את הפרופיל הציבורי עד אישור.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_profile_update_request">
							<?php wp_nonce_field( 'justice_lawyer_profile_update', 'justice_lawyer_profile_update_nonce' ); ?>

							<label for="profile-update-profile"><?php esc_html_e( 'פרופיל מחובר', 'justice-theme' ); ?></label>
							<select id="profile-update-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="profile-headline"><?php esc_html_e( 'כותרת ראשית מוצעת', 'justice-theme' ); ?></label>
							<input id="profile-headline" type="text" name="profile_headline">

							<label for="profile-services"><?php esc_html_e( 'שירותים מרכזיים', 'justice-theme' ); ?></label>
							<textarea id="profile-services" name="profile_services" rows="4"></textarea>

							<label for="profile-process"><?php esc_html_e( 'איך נראה תהליך העבודה איתכם?', 'justice-theme' ); ?></label>
							<textarea id="profile-process" name="profile_process" rows="4"></textarea>

							<label for="profile-video-url"><?php esc_html_e( 'קישור וידאו', 'justice-theme' ); ?></label>
							<input id="profile-video-url" type="url" name="profile_video_url">

							<label for="profile-faqs"><?php esc_html_e( 'שאלות נפוצות שתרצו שיופיעו בפרופיל', 'justice-theme' ); ?></label>
							<textarea id="profile-faqs" name="profile_faqs" rows="4"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת בקשת עדכון', 'justice-theme' ); ?></button>
						</form>
					</section>

					<section class="lawyer-dashboard-content-request">
						<h2><?php esc_html_e( 'Google reviews and recommendations', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Ask Jus-Tice to prepare a review campaign. This does not send messages yet. The owner reviews the request, verifies the Google Business review link, and only then sends approved client requests.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_review_campaign_request">
							<?php wp_nonce_field( 'justice_lawyer_review_campaign', 'justice_lawyer_review_campaign_nonce' ); ?>

							<label for="review-profile"><?php esc_html_e( 'Linked profile', 'justice-theme' ); ?></label>
							<select id="review-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="review-client-group"><?php esc_html_e( 'Who should receive the first request?', 'justice-theme' ); ?></label>
							<input id="review-client-group" type="text" name="review_client_group" placeholder="<?php esc_attr_e( 'Example: clients from the last 90 days after closed matters', 'justice-theme' ); ?>">

							<label for="review-campaign-notes"><?php esc_html_e( 'Notes for the owner', 'justice-theme' ); ?></label>
							<textarea id="review-campaign-notes" name="review_campaign_notes" rows="4" placeholder="<?php esc_attr_e( 'Add Google Business link, preferred wording, or sensitive cases to avoid.', 'justice-theme' ); ?>"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'Request review campaign setup', 'justice-theme' ); ?></button>
						</form>
					</section>

					<section class="lawyer-dashboard-content-request">
						<h2><?php esc_html_e( 'Vetted services for your firm', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Tell Jus-Tice what professional supplier you need. We use these requests to match lawyers with checked providers and to build partner offers inside the platform. Nothing is sent to a supplier before owner review.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_supplier_request">
							<?php wp_nonce_field( 'justice_lawyer_supplier_request', 'justice_lawyer_supplier_request_nonce' ); ?>

							<label for="supplier-profile"><?php esc_html_e( 'Linked profile', 'justice-theme' ); ?></label>
							<select id="supplier-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="supplier-category"><?php esc_html_e( 'Service needed', 'justice-theme' ); ?></label>
							<select id="supplier-category" name="supplier_category" required>
								<?php
								$supplier_categories = function_exists( 'justice_theme_lawyer_supplier_categories' ) ? justice_theme_lawyer_supplier_categories() : array( 'other' => __( 'Other', 'justice-theme' ) );
								foreach ( $supplier_categories as $category_key => $category_label ) :
									?>
									<option value="<?php echo esc_attr( $category_key ); ?>"><?php echo esc_html( $category_label ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="supplier-urgency"><?php esc_html_e( 'Urgency', 'justice-theme' ); ?></label>
							<select id="supplier-urgency" name="supplier_urgency">
								<option value="urgent"><?php esc_html_e( 'Urgent', 'justice-theme' ); ?></option>
								<option value="this_month"><?php esc_html_e( 'This month', 'justice-theme' ); ?></option>
								<option value="researching"><?php esc_html_e( 'Researching options', 'justice-theme' ); ?></option>
								<option value="not_sure"><?php esc_html_e( 'Not sure yet', 'justice-theme' ); ?></option>
							</select>

							<label for="supplier-request-notes"><?php esc_html_e( 'What do you need?', 'justice-theme' ); ?></label>
							<textarea id="supplier-request-notes" name="supplier_request_notes" rows="4" placeholder="<?php esc_attr_e( 'Example: certified translation for court documents, shared office room in Tel Aviv, video production, expert witness, CRM setup.', 'justice-theme' ); ?>"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'Request matched provider', 'justice-theme' ); ?></button>
						</form>
					</section>

					<h2><?php esc_html_e( 'Recent leads', 'justice-theme' ); ?></h2>
					<?php if ( $leads && $leads->have_posts() ) : ?>
						<div class="lawyer-dashboard-leads">
							<?php while ( $leads->have_posts() ) : $leads->the_post(); ?>
								<?php $lead_id = get_the_ID(); ?>
								<article>
									<strong><?php echo esc_html( get_post_meta( $lead_id, 'visitor_name', true ) ?: get_the_title() ); ?></strong>
									<span><?php echo esc_html( get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true ) ?: '-' ); ?></span>
									<span><?php echo esc_html( get_post_meta( $lead_id, 'lead_status', true ) ?: 'new' ); ?></span>
									<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
								</article>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
					<?php else : ?>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'אין עדיין לידים משויכים לפרופיל הזה.', 'justice-theme' ); ?></p>
					<?php endif; ?>

					<h2><?php esc_html_e( 'בקשות תוכן ומאמרים', 'justice-theme' ); ?></h2>
					<?php if ( $content_requests && $content_requests->have_posts() ) : ?>
						<div class="lawyer-dashboard-content-list">
							<?php while ( $content_requests->have_posts() ) : $content_requests->the_post(); ?>
								<?php
								$request_id    = get_the_ID();
								$request_state = get_post_status( $request_id );
								$needs_legal   = (string) get_post_meta( $request_id, 'needs_legal_review', true );
								$needs_source  = (string) get_post_meta( $request_id, 'needs_browser_source_verification', true );
								$intent        = (string) get_post_meta( $request_id, 'lawyer_content_intent', true );
								$audience      = (string) get_post_meta( $request_id, 'lawyer_content_audience', true );
								?>
								<article>
									<div>
										<strong><?php the_title(); ?></strong>
										<?php if ( '' !== $intent || '' !== $audience ) : ?>
											<p><?php echo esc_html( trim( $intent . ' ' . $audience ) ); ?></p>
										<?php endif; ?>
									</div>
									<span><?php echo esc_html( $request_state ); ?></span>
									<span><?php echo '1' === $needs_legal ? esc_html__( 'בדיקה משפטית', 'justice-theme' ) : esc_html__( 'עבר בדיקה משפטית', 'justice-theme' ); ?></span>
									<span><?php echo '1' === $needs_source ? esc_html__( 'בדיקת מקורות', 'justice-theme' ) : esc_html__( 'מקורות נבדקו', 'justice-theme' ); ?></span>
									<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
								</article>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
					<?php else : ?>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'אין עדיין בקשות תוכן לפרופיל הזה. אפשר לשלוח רעיון למאמר חתום דרך הטופס הבא.', 'justice-theme' ); ?></p>
					<?php endif; ?>

					<section class="lawyer-dashboard-content-request">
						<h2><?php esc_html_e( 'בקשת מאמר חתום', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'שלחו רעיון למאמר או מדריך. הבקשה נשמרת כטיוטה בלבד ותעבור עריכה, בדיקת מקורות ובדיקה משפטית לפני פרסום.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_content_request">
							<?php wp_nonce_field( 'justice_lawyer_content_request', 'justice_lawyer_content_request_nonce' ); ?>

							<label for="content-profile"><?php esc_html_e( 'פרופיל מחובר', 'justice-theme' ); ?></label>
							<select id="content-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="content-topic"><?php esc_html_e( 'נושא המאמר', 'justice-theme' ); ?></label>
							<input id="content-topic" type="text" name="content_topic" required placeholder="<?php esc_attr_e( 'לדוגמה: איך מתכוננים להסכם גירושין בהסכמה', 'justice-theme' ); ?>">

							<label for="content-intent"><?php esc_html_e( 'מטרת התוכן', 'justice-theme' ); ?></label>
							<input id="content-intent" type="text" name="content_intent" placeholder="<?php esc_attr_e( 'מידע ללקוחות, שאלות נפוצות, חיזוק תחום מומחיות, הכנה לפגישה', 'justice-theme' ); ?>">

							<label for="content-audience"><?php esc_html_e( 'קהל יעד', 'justice-theme' ); ?></label>
							<input id="content-audience" type="text" name="content_audience" placeholder="<?php esc_attr_e( 'לדוגמה: הורים לפני פרידה, בעלי דירות, חשודים לפני חקירה', 'justice-theme' ); ?>">

							<label for="content-notes"><?php esc_html_e( 'נקודות שחשוב לכלול', 'justice-theme' ); ?></label>
							<textarea id="content-notes" name="content_notes" rows="4"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת בקשת תוכן', 'justice-theme' ); ?></button>
						</form>
					</section>
				</div>

				<aside class="lawyer-dashboard__side">
					<section class="lawyer-dashboard__roadmap">
						<h2><?php esc_html_e( 'דוח ערך חודשי', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'המטרה של האזור האישי היא להראות לעורך הדין מה הפלטפורמה יצרה בפועל: חשיפה, פניות, תוכן ופעולות המשך.', 'justice-theme' ); ?></p>
						<ul>
							<li><?php printf( esc_html__( 'צפיות בפרופיל: %s', 'justice-theme' ), esc_html( (string) $profile_views_total ) ); ?></li>
							<li><?php printf( esc_html__( 'לידים משויכים: %s', 'justice-theme' ), esc_html( (string) $lead_count ) ); ?></li>
							<li><?php printf( esc_html__( 'בקשות תוכן בטיפול: %s', 'justice-theme' ), esc_html( (string) $content_request_count ) ); ?></li>
							<li><?php esc_html_e( 'שיחות, WhatsApp, קליקים ונתוני GSC יוצגו לאחר אימות GA4/GSC.', 'justice-theme' ); ?></li>
						</ul>
					</section>

					<h2><?php esc_html_e( 'מה יעלה את הערך של המיני-סייט?', 'justice-theme' ); ?></h2>
					<ul>
						<li><?php esc_html_e( 'תמונה מקצועית, לוגו משרד וביוגרפיה ממוקדת.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'וידאו קצר שמסביר את הגישה המקצועית.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מאמרים חתומים לפי תחומי מומחיות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'שאלות נפוצות, תהליך עבודה והסבר על זמינות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות מאושרות בלבד וללא טענות דירוג לא מבוססות.', 'justice-theme' ); ?></li>
					</ul>
					<div class="lawyer-dashboard__roadmap">
						<strong><?php esc_html_e( 'בשלבים הבאים', 'justice-theme' ); ?></strong>
						<p><?php esc_html_e( 'עריכת פרופיל עצמאית, בקשות תוכן, סליקת מנוי, תיבת לידים, AI Console ודוחות חשיפה.', 'justice-theme' ); ?></p>
					</div>
				</aside>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
